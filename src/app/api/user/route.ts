import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { syncOnChainBadges } from "@/lib/badgeSync";

export async function GET(req: NextRequest) {
  const wallet = req.nextUrl.searchParams.get("wallet");
  if (!wallet) return NextResponse.json({ error: "wallet required" }, { status: 400 });

  let user: any = null;
  user = await db.user.findUnique({
    where: { wallet: wallet.toLowerCase() },
    include: {
      mintRecords: { select: { badgeId: true } },
      badgeUnlocks: { select: { badgeId: true } },
    },
  });

  if (!user) return NextResponse.json({ error: "not found" }, { status: 404 });

  await syncOnChainBadges(wallet, user.id);

  // Re-fetch mint records to include synced ones
  const updatedMintRecords = await db.mintRecord.findMany({
    where: { userId: user.id },
    select: { badgeId: true }
  });
  user.mintRecords = updatedMintRecords;

  return NextResponse.json({
    data: {
      ...user,
      ownedBadgeIds: user.mintRecords.map((r: any) => r.badgeId),
      unlockedBadgeIds: user.badgeUnlocks.map((r: any) => r.badgeId),
    },
  });
}

export async function POST(req: NextRequest) {
  const { wallet } = await req.json();
  if (!wallet) return NextResponse.json({ error: "wallet required" }, { status: 400 });

  const user = await db.user.upsert({
    where: { wallet: wallet.toLowerCase() },
    update: {},
    create: { wallet: wallet.toLowerCase() },
  });

  return NextResponse.json({ data: user });
}
