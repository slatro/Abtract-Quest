import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const users = await db.user.findMany({
    orderBy: { xp: "desc" },
    take: 100,
    select: {
      wallet: true,
      xp: true,
      streak: true,
      _count: { select: { mintRecords: true } },
    },
  });

  // Master badge sayisini ayri cek
  const masterBadgeIds = [7, 14, 21, 28, 35, 42];

  const leaderboard = await Promise.all(
    users.map(async (u, i) => {
      const masterCount = await db.mintRecord.count({
        where: {
          badgeId: { in: masterBadgeIds },
          user: { wallet: u.wallet },
        },
      });

      return {
        rank: i + 1,
        wallet: u.wallet,
        xp: u.xp,
        streak: u.streak,
        badgeCount: u._count.mintRecords,
        masterCount,
      };
    })
  );

  return NextResponse.json({ data: leaderboard });
}
