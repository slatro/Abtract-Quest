import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import type { Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
  const walletParam = req.nextUrl.searchParams.get("wallet");
  const wallet = walletParam && walletParam !== "undefined" && walletParam !== "null" ? walletParam : null;
  const type = req.nextUrl.searchParams.get("type");
  const where: any = { active: true };

  if (type) {
    where.type = type.toLowerCase();
  }

  let quests: any[] = [];
  quests = await db.quest.findMany({ where });

  if (!wallet) {
    return NextResponse.json({ data: quests.map((q) => ({ ...q, completed: false })) });
  }

  let user: any = null;
  try {
    user = await db.user.findUnique({ where: { wallet: wallet.toLowerCase() } });
  } catch (error) {}
  if (!user) return NextResponse.json({ data: quests.map((q) => ({ ...q, completed: false })) });

  let completions: any[] = [];
  try {
    completions = await db.questCompletion.findMany({
      where: { userId: user.id },
      orderBy: { completedAt: "desc" },
    });
  } catch (error) {}

  const completionMap = new Map<string, Date>();
  for (const c of completions) {
    if (!completionMap.has(c.questId)) {
      completionMap.set(c.questId, c.completedAt);
    }
  }

  const now = new Date();
  const todayUtc = now.toISOString().split("T")[0];
  const sameDay = user.lastCheckIn && (
    new Date(user.lastCheckIn).toISOString().split("T")[0] === todayUtc
  );

  const questsWithStatus = quests.map((q) => {
    if (q.id === "quest-daily-checkin") {
      return {
        ...q,
        completed: !!sameDay,
        onCooldown: !!sameDay,
        lastCompleted: user.lastCheckIn,
        streak: user.streak,
      };
    }

    const lastCompleted = completionMap.get(q.id);
    if (!lastCompleted) return { ...q, completed: false };

    const cooldownMs = q.cooldownMin * 60 * 1000;
    const onCooldown = Date.now() - lastCompleted.getTime() < cooldownMs;
    return { ...q, completed: true, onCooldown, lastCompleted };
  });

  return NextResponse.json({ data: questsWithStatus });
}
