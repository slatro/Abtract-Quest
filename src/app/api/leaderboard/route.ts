import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const walletParam = req.nextUrl.searchParams.get("wallet");
  const wallet = walletParam && walletParam !== "undefined" && walletParam !== "null" ? walletParam.toLowerCase() : null;

  let leaderboard: any[] = [];
  try {
    const users = await db.user.findMany({
      orderBy: { xp: "desc" },
      take: 100,
      select: {
        wallet: true,
        xp: true,
        streak: true,
        avatar: true,
        _count: { select: { mintRecords: true } },
      },
    });

    // Master badge sayisini ayri cek
    const masterBadgeIds = [7, 14, 21, 28, 35, 42];

    leaderboard = await Promise.all(
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
          avatar: u.avatar || null,
          badgeCount: u._count.mintRecords,
          masterCount,
        };
      })
    );
  } catch (error) {
    console.error("Database connection failed, using static leaderboard fallback:", error);
    // When DB is down, do NOT return fake mock users.
    // Instead, return an empty leaderboard, or just the connected user if logged in.
    if (wallet) {
      leaderboard = [
        {
          rank: 1,
          wallet: wallet.toLowerCase(),
          xp: 0,
          streak: 0,
          avatar: "samurai",
          badgeCount: 0,
          masterCount: 0
        }
      ];
    } else {
      leaderboard = [];
    }
  }

  return NextResponse.json({ data: leaderboard });
}
