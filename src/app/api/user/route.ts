import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { syncOnChainBadges } from "@/lib/badgeSync";

export async function GET(req: NextRequest) {
  const wallet = req.nextUrl.searchParams.get("wallet");
  if (!wallet) return NextResponse.json({ error: "wallet required" }, { status: 400 });

  let user: any = null;
  try {
    user = await db.user.findUnique({
      where: { wallet: wallet.toLowerCase() },
      include: {
        mintRecords: { select: { badgeId: true } },
        badgeUnlocks: { select: { badgeId: true } },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }

    try {
      await syncOnChainBadges(wallet, user.id);
      // Re-fetch mint records to include synced ones
      const updatedMintRecords = await db.mintRecord.findMany({
        where: { userId: user.id },
        select: { badgeId: true }
      });
      user.mintRecords = updatedMintRecords;
    } catch (syncError) {
      console.error("Failed to sync on-chain badges or fetch updated records:", syncError);
    }

  } catch (error) {
    console.error("Database connection failed for user profile, using mock fallback:", error);
    // Return a mock user profile when DB is down
    return NextResponse.json({
      data: {
        id: "mock-user-id",
        wallet: wallet.toLowerCase(),
        username: "Abstract Explorer",
        avatar: "astronaut",
        xp: 1500,
        streak: 1,
        ownedBadgeIds: [],
        unlockedBadgeIds: [],
      }
    });
  }

  return NextResponse.json({
    data: {
      ...user,
      avatar: user.avatar ? user.avatar.replace("_penguin", "") : null,
      ownedBadgeIds: user.mintRecords.map((r: any) => r.badgeId),
      unlockedBadgeIds: user.badgeUnlocks.map((r: any) => r.badgeId),
    },
  });
}

export async function POST(req: NextRequest) {
  const { wallet } = await req.json();
  if (!wallet) return NextResponse.json({ error: "wallet required" }, { status: 400 });

  try {
    const user = await db.user.upsert({
      where: { wallet: wallet.toLowerCase() },
      update: {},
      create: { wallet: wallet.toLowerCase() },
    });
    return NextResponse.json({ data: user });
  } catch (error) {
    console.error("Database connection failed for user registration, using mock fallback:", error);
    return NextResponse.json({
      data: {
        id: "mock-user-id",
        wallet: wallet.toLowerCase(),
        username: "Abstract Explorer",
        avatar: "astronaut",
        xp: 1500,
        streak: 1,
      }
    });
  }
}
