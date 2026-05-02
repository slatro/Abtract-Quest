import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import type { Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
  const wallet = req.nextUrl.searchParams.get("wallet");
  const type = req.nextUrl.searchParams.get("type");
  const where: Prisma.QuestWhereInput = { active: true };

  if (type) {
    where.type = type.toLowerCase() as Prisma.EnumQuestTypeFilter["equals"];
  }

  const quests = await db.quest.findMany({
    where,
  });

  if (!wallet) return NextResponse.json({ data: quests });

  const user = await db.user.findUnique({ where: { wallet: wallet.toLowerCase() } });
  if (!user) return NextResponse.json({ data: quests.map((q) => ({ ...q, completed: false })) });

  const completions = await db.questCompletion.findMany({
    where: { userId: user.id },
    orderBy: { completedAt: "desc" },
  });

  const completionMap = new Map<string, Date>();
  for (const c of completions) {
    if (!completionMap.has(c.questId)) {
      completionMap.set(c.questId, c.completedAt);
    }
  }

  const questsWithStatus = quests.map((q) => {
    const lastCompleted = completionMap.get(q.id);
    if (!lastCompleted) return { ...q, completed: false };

    const cooldownMs = q.cooldownMin * 60 * 1000;
    const onCooldown = Date.now() - lastCompleted.getTime() < cooldownMs;
    return { ...q, completed: true, onCooldown, lastCompleted };
  });

  return NextResponse.json({ data: questsWithStatus });
}
