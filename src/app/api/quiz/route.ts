import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { STATIC_QUIZZES } from "@/lib/staticData";

export async function GET(req: NextRequest) {
  const wallet = req.nextUrl.searchParams.get("wallet");

  let quizzes: any[] = [];
  try {
    quizzes = await db.quiz.findMany({
      where: { active: true },
      select: {
        id: true,
        title: true,
        category: true,
        difficulty: true,
        badgeId: true,
        _count: { select: { questions: true } },
      },
    });
  } catch (error) {
    console.error("Database connection failed, using static quizzes fallback:", error);
    quizzes = STATIC_QUIZZES.map((q) => ({
      id: q.id,
      title: q.title,
      category: q.category,
      difficulty: q.difficulty,
      badgeId: q.badgeId,
      _count: { questions: q.questions.length },
    }));
  }

  if (!wallet) return NextResponse.json({ data: quizzes });

  let user: any = null;
  let attempts: any[] = [];
  try {
    user = await db.user.findUnique({
      where: { wallet: wallet.toLowerCase() },
    });
    if (user) {
      attempts = await db.quizAttempt.findMany({
        where: { userId: user.id },
        orderBy: { completedAt: "desc" },
      });
    }
  } catch (error) {
    console.error("Database lookup failed for user/attempts, defaulting to unattempted:", error);
  }

  if (!user) return NextResponse.json({ data: quizzes.map((q) => ({ ...q, attempted: false })) });

  const attemptMap = new Map<string, any>();
  for (const a of attempts) {
    if (!attemptMap.has(a.quizId)) attemptMap.set(a.quizId, a);
  }

  const quizzesWithStatus = quizzes.map((q) => {
    const last = attemptMap.get(q.id);
    if (!last) return { ...q, attempted: false, passed: false, onCooldown: false };

    const cooldownMs = 24 * 60 * 60 * 1000;
    const onCooldown = Date.now() - last.completedAt.getTime() < cooldownMs;

    return {
      ...q,
      attempted: true,
      passed: last.passed,
      lastScore: last.score,
      lastTotal: last.totalQ,
      onCooldown,
    };
  });

  return NextResponse.json({ data: quizzesWithStatus });
}
