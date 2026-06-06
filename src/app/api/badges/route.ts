import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import type { Prisma } from "@prisma/client";
import { getUnlockedBadgeIds } from "@/lib/badgeUnlocks";
import { syncOnChainBadges } from "@/lib/badgeSync";
import { STATIC_BADGES } from "@/lib/staticData";

export async function GET(req: NextRequest) {
  const walletParam = req.nextUrl.searchParams.get("wallet");
  const wallet = walletParam && walletParam !== "undefined" && walletParam !== "null" ? walletParam : null;
  const rarity = req.nextUrl.searchParams.get("rarity");
  const setName = req.nextUrl.searchParams.get("set");
  const where: any = {
    ...(setName ? { setName } : {}),
  };

  if (rarity) {
    where.rarity = rarity.toLowerCase();
  }

  let badges: any[] = [];
  try {
    badges = await db.badge.findMany({
      where,
      orderBy: [{ setName: "asc" }, { id: "asc" }],
    });
  } catch (error) {
    console.error("Database connection failed, using static badges fallback:", error);
    badges = STATIC_BADGES.filter((b) => {
      if (setName && b.setName !== setName) return false;
      if (rarity && b.rarity !== rarity.toLowerCase()) return false;
      return true;
    });
  }

  if (!wallet) {
    const badgesWithoutUserState = badges.map((b) => ({
      ...b,
      owned: false,
      unlocked: !b.requiresUnlock,
    }));
    return NextResponse.json({ data: badgesWithoutUserState });
  }

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
