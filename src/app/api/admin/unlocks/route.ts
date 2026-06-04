import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/adminAuth";

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const wallet = req.nextUrl.searchParams.get("wallet");
  if (!wallet) {
    return NextResponse.json({ error: "wallet required" }, { status: 400 });
  }

  const user = await db.user.findUnique({
    where: { wallet: wallet.toLowerCase() },
    include: {
      badgeUnlocks: {
        orderBy: { unlockedAt: "desc" },
        include: {
          badge: {
            select: {
              id: true,
              name: true,
              rarity: true,
              setName: true,
              isMaster: true,
            },
          },
        },
      },
      mintRecords: {
        select: { badgeId: true },
      },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const ownedIds = new Set(user.mintRecords.map((record) => record.badgeId));

  return NextResponse.json({
    data: {
      wallet: user.wallet,
      xp: user.xp,
      streak: user.streak,
      unlocks: user.badgeUnlocks.map((unlock) => ({
        id: unlock.id,
        badgeId: unlock.badgeId,
        source: unlock.source,
        sourceRef: unlock.sourceRef,
        unlockedAt: unlock.unlockedAt,
        owned: ownedIds.has(unlock.badgeId),
        badge: unlock.badge,
      })),
    },
  });
}
