import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { rateLimit, getIP } from "@/lib/rateLimit";
import { incrementRisk } from "@/lib/riskScoring";
import { persistBadgeUnlock } from "@/lib/badgeUnlocks";
import { STATIC_QUIZZES } from "@/lib/staticData";
import { getMockState, saveMockState } from "@/lib/mockCookies";

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

  if (!wallet || !answers) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  try {
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

    // Quiz sorularini DB'den cek
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
        const minExpected = quiz.questions.length * 3000;
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
    const passed = score >= Math.ceil(totalQ * 0.6);
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
    if (perfectScore) unlockedBadgeId = 39;

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
  } catch (error) {
    console.error("Database connection failed during quiz submit, using mock fallback:", error);

    const quiz = STATIC_QUIZZES.find((q) => q.id === quizId || q.id === quizId.replace("quiz-", ""));
    if (!quiz) return NextResponse.json({ error: "Quiz not found" }, { status: 404 });

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
    const passed = score >= Math.ceil(totalQ * 0.6);
    const perfectScore = score === totalQ;

    const xpGain = passed ? 150 : 25;

    const mockState = await getMockState();
    const unlockedBadges = [...mockState.unlockedBadges];
    if (passed && quiz.badgeId && !unlockedBadges.includes(quiz.badgeId)) {
      unlockedBadges.push(quiz.badgeId);
    }
    if (perfectScore && !unlockedBadges.includes(39)) {
      unlockedBadges.push(39);
    }

    const completedQuests = [...mockState.completedQuests];
    const questId = `quest-${quiz.id}`;
    if (passed && !completedQuests.includes(questId)) {
      completedQuests.push(questId);
    }

    await saveMockState({
      xp: mockState.xp + xpGain,
      unlockedBadges,
      completedQuests,
    });

    return NextResponse.json({
      data: {
        score,
        totalQ,
        passed,
        perfectScore,
        xpGained: xpGain,
        unlockedBadgeId: passed ? (perfectScore ? 39 : quiz.badgeId) : null,
        results,
      },
    });
  }
}
