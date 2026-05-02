import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import type { Prisma } from "@prisma/client";

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

  const minted = await db.mintRecord.findMany({
    where: { user: { wallet: wallet.toLowerCase() } },
    select: { badgeId: true },
  });

  const ownedIds = new Set(minted.map((m) => m.badgeId));

  const badgesWithOwned = badges.map((b) => ({
    ...b,
    owned: ownedIds.has(b.id),
  }));

  return NextResponse.json({ data: badgesWithOwned });
}
