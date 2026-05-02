import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const wallet = req.nextUrl.searchParams.get("wallet");

  const quizzes = await db.quiz.findMany({
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

  if (!wallet) return NextResponse.json({ data: quizzes });

  const user = await db.user.findUnique({
    where: { wallet: wallet.toLowerCase() },
  });

  if (!user) return NextResponse.json({ data: quizzes.map((q) => ({ ...q, attempted: false })) });

  const attempts = await db.quizAttempt.findMany({
    where: { userId: user.id },
    orderBy: { completedAt: "desc" },
  });

  const attemptMap = new Map<string, typeof attempts[0]>();
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
