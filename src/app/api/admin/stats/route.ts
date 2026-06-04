import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/adminAuth";

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [
    totalUsers,
    totalMints,
    totalUnlocks,
    totalQuestCompletions,
    topBadges,
    recentMints,
    recentUnlocks,
    riskyUsers,
  ] = await Promise.all([
    db.user.count(),
    db.mintRecord.count(),
    db.badgeUnlock.count(),
    db.questCompletion.count(),
    db.mintRecord.groupBy({
      by: ["badgeId"],
      _count: { badgeId: true },
      orderBy: { _count: { badgeId: "desc" } },
      take: 10,
    }),
    db.mintRecord.findMany({
      take: 20,
      orderBy: { mintedAt: "desc" },
      include: { user: { select: { wallet: true } }, badge: { select: { name: true } } },
    }),
    db.badgeUnlock.findMany({
      take: 20,
      orderBy: { unlockedAt: "desc" },
      include: {
        user: { select: { wallet: true } },
        badge: { select: { name: true } },
      },
    }),
    db.user.findMany({
      where: { riskScore: { gte: 20 } },
      orderBy: { riskScore: "desc" },
      select: { wallet: true, riskScore: true, xp: true },
    }),
  ]);

  return NextResponse.json({
    data: {
      totalUsers,
      totalMints,
      totalUnlocks,
      totalQuestCompletions,
      topBadges,
      recentMints,
      recentUnlocks,
      riskyUsers,
    },
  });
}
