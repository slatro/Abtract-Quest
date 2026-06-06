import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import type { Prisma } from "@prisma/client";
import { getUnlockedBadgeIds } from "@/lib/badgeUnlocks";
import { syncOnChainBadges } from "@/lib/badgeSync";

export async function GET(req: NextRequest) {
  const wallet = req.nextUrl.searchParams.get("wallet");
  const rarity = req.nextUrl.searchParams.get("rarity");
  const setName = req.nextUrl.searchParams.get("set");
  const where: any = {
    ...(setName ? { setName } : {}),
  };

  if (rarity) {
    where.rarity = rarity.toLowerCase();
  }

  let badges: any[] = [];
  badges = await db.badge.findMany({
    where,
    orderBy: [{ setName: "asc" }, { id: "asc" }],
  });

  if (!wallet) return NextResponse.json({ data: badges });

  let user: any = null;
  try {
    user = await db.user.findUnique({
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

    if (user) {
      await syncOnChainBadges(wallet, user.id);
      // Re-fetch user mint records to include synced ones
      const updatedMintRecords = await db.mintRecord.findMany({
        where: { userId: user.id },
        select: { badgeId: true }
      });
      user.mintRecords = updatedMintRecords;
    }
  } catch (error) {
    // If user DB fetch fails, continue without user state
    console.error("User fetch failed, defaulting to disconnected state:", error);
  }

  if (!user) {
    const badgesWithoutUserState = badges.map((b) => ({
      ...b,
      owned: false,
      unlocked: !b.requiresUnlock,
    }));
    return NextResponse.json({ data: badgesWithoutUserState });
  }

  const ownedIds = new Set(user.mintRecords.map((m: any) => m.badgeId));
  const unlockedIds = getUnlockedBadgeIds(user, badges as any);

  const badgesWithState = badges.map((b) => ({
    ...b,
    owned: ownedIds.has(b.id),
    unlocked: ownedIds.has(b.id) || unlockedIds.has(b.id),
  }));

  return NextResponse.json({ data: badgesWithState });
}
