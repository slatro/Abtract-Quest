import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const wallet = req.nextUrl.searchParams.get("wallet");
  if (!wallet) return NextResponse.json({ error: "wallet required" }, { status: 400 });

  const user = await db.user.findUnique({
    where: { wallet: wallet.toLowerCase() },
    include: { mintRecords: { select: { badgeId: true } } },
  });

  if (!user) return NextResponse.json({ error: "not found" }, { status: 404 });

  return NextResponse.json({
    data: {
      ...user,
      ownedBadgeIds: user.mintRecords.map((r) => r.badgeId),
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
