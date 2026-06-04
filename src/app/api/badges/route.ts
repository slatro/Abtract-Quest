import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import type { Prisma } from "@prisma/client";
import { getUnlockedBadgeIds } from "@/lib/badgeUnlocks";

export async function GET(req: NextRequest) {
  const wallet = req.nextUrl.searchParams.get("wallet");
  const rarity = req.nextUrl.searchParams.get("rarity");
  const setName = req.nextUrl.searchParams.get("set");
  const where: Prisma.BadgeWhereInput = {
    ...(setName ? { setName } : {}),
  };

  if (rarity) {
    where.rarity = rarity.toLowerCase() as Prisma.EnumRarityFilter["equals"];
  }

  const badges = await db.badge.findMany({
    where,
    orderBy: [{ setName: "asc" }, { id: "asc" }],
  });

  if (!wallet) return NextResponse.json({ data: badges });

  const user = await db.user.findUnique({
    where: { wallet: wallet.toLowerCase() },
    include: {
      mintRecords: { select: { badgeId: true } },
      badgeUnlocks: { select: { badgeId: true } },
      questCompletions: {
        include: {
          quest: {
            select: { badgeId: true },
          },
        },
      },
      quizAttempts: {
        where: { passed: true },
        include: {
          quiz: {
            select: { badgeId: true },
          },
        },
      },
    },
  });

  if (!user) {
    const badgesWithoutUserState = badges.map((b) => ({
      ...b,
      owned: false,
      unlocked: !b.requiresUnlock,
    }));
    return NextResponse.json({ data: badgesWithoutUserState });
  }

  const ownedIds = new Set(user.mintRecords.map((m) => m.badgeId));
  const unlockedIds = getUnlockedBadgeIds(user, badges);

  const badgesWithState = badges.map((b) => ({
    ...b,
    owned: ownedIds.has(b.id),
    unlocked: ownedIds.has(b.id) || unlockedIds.has(b.id),
  }));

  return NextResponse.json({ data: badgesWithState });
}
