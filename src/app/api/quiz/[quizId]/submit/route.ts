import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { rateLimit, getIP } from "@/lib/rateLimit";
import { incrementRisk } from "@/lib/riskScoring";
import { persistBadgeUnlock } from "@/lib/badgeUnlocks";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ quizId: string }> }
) {
  const ip = getIP(req);
  const ipLimit = rateLimit(`quiz:ip:${ip}`, 5, 60_000);
  if (!ipLimit.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const { quizId } = await params;
  const { wallet, answers } = await req.json();
  // answers: [{ questionId: string, answerText: string }]

  if (!wallet || !answers) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const user = await db.user.upsert({
    where: { wallet: wallet.toLowerCase() },
    update: {},
    create: { wallet: wallet.toLowerCase() },
  });

  // Cooldown kontrolu
  const lastAttempt = await db.quizAttempt.findFirst({
    where: { userId: user.id, quizId },
    orderBy: { completedAt: "desc" },
  });

  if (lastAttempt) {
    const cooldownMs = 24 * 60 * 60 * 1000;
    const elapsed = Date.now() - lastAttempt.completedAt.getTime();
    if (elapsed < cooldownMs) {
      const remaining = Math.ceil((cooldownMs - elapsed) / 3600000);
      return NextResponse.json(
        { error: `On cooldown. Try again in ${remaining} hours.` },
        { status: 429 }
      );
    }
  }

  // Quiz sorularini DB'den cek (correctIndex burada)
  const quiz = await db.quiz.findUnique({
    where: { id: quizId },
    include: { questions: true },
  });

  if (!quiz) return NextResponse.json({ error: "Quiz not found" }, { status: 404 });

  // Submit basinda timestamp kontrolu
  const startTime = req.headers.get("x-quiz-start");
  if (startTime) {
    const parsed = parseInt(startTime, 10);
    if (Number.isFinite(parsed)) {
      const elapsed = Date.now() - parsed;
      const minExpected = quiz.questions.length * 3000; // soru basina min 3 saniye
      if (elapsed < minExpected) {
        await incrementRisk(wallet, 10, "quiz_too_fast");
      }
    }
  }

  // Her cevabi degerlendir
  const results = quiz.questions.map((q) => {
    const userAnswer = answers.find((a: { questionId: string; answerText: string }) => a.questionId === q.id);
    const correct = q.answers[q.correctIndex];
    const isCorrect = userAnswer?.answerText === correct;

    return {
      questionId: q.id,
      question: q.question,
      userAnswer: userAnswer?.answerText ?? null,
      correctAnswer: correct,
      isCorrect,
      explanation: q.explanation,
    };
  });

  const score = results.filter((r) => r.isCorrect).length;
  const totalQ = quiz.questions.length;
  const passed = score >= Math.ceil(totalQ * 0.6); // %60 gecer
  const perfectScore = score === totalQ;

  // Attempt kaydet
  await db.quizAttempt.create({
    data: {
      userId: user.id,
      quizId,
      score,
      totalQ,
      passed,
    },
  });

  // XP ver
  const xpGain = passed ? 150 : 25;
  await db.user.update({
    where: { id: user.id },
    data: { xp: { increment: xpGain } },
  });

  // Badge unlock bilgisi
  let unlockedBadgeId: number | null = null;
  if (passed && quiz.badgeId) unlockedBadgeId = quiz.badgeId;
  if (perfectScore) unlockedBadgeId = 39; // Perfect Score badge

  if (passed && quiz.badgeId) {
    await persistBadgeUnlock(user.id, quiz.badgeId, "quiz", quizId);
  }

  if (perfectScore) {
    await persistBadgeUnlock(user.id, 39, "perfect_score", quizId);
  }

  return NextResponse.json({
    data: {
      score,
      totalQ,
      passed,
      perfectScore,
      xpGained: xpGain,
      unlockedBadgeId,
      results,
    },
  });
}
