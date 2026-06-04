import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createPublicClient, http, type Chain } from "viem";
import { persistBadgeUnlock } from "@/lib/badgeUnlocks";

const abstractMainnet = {
  id: 2741,
  name: "Abstract",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: { default: { http: [process.env.ABSTRACT_RPC!] } },
} as const;

const publicClient = createPublicClient({
  chain: abstractMainnet as Chain,
  transport: http(),
});

export async function POST(req: NextRequest) {
  const { wallet, badgeId, txHash } = await req.json();
  if (!wallet || !badgeId || !txHash) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // Idempotent — aynı txHash iki kez gelirse tekrar kaydetme
  const existing = await db.mintRecord.findUnique({ where: { txHash } });
  if (existing) return NextResponse.json({ data: { alreadyRecorded: true } });

  // TX'i zincirde doğrula
  try {
    const receipt = await publicClient.getTransactionReceipt({ hash: txHash });
    if (receipt.status !== "success") {
      return NextResponse.json({ error: "Transaction failed" }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
  }

  const user = await db.user.upsert({
    where: { wallet: wallet.toLowerCase() },
    update: {},
    create: { wallet: wallet.toLowerCase() },
  });

  const badge = await db.badge.findUnique({ where: { id: Number(badgeId) } });
  const xpGain = badge?.isMaster ? 500 : 100;

  await db.$transaction([
    db.mintRecord.create({
      data: { userId: user.id, badgeId: Number(badgeId), txHash },
    }),
    db.user.update({
      where: { id: user.id },
      data: { xp: { increment: xpGain } },
    }),
    db.badge.update({
      where: { id: Number(badgeId) },
      data: { mintedCount: { increment: 1 } },
    }),
    db.mintNonce.updateMany({
      where: { wallet: wallet.toLowerCase(), badgeId: Number(badgeId) },
      data: { used: true },
    }),
  ]);

  if (badge && !badge.isMaster) {
    const setMembers = await db.badge.findMany({
      where: { setName: badge.setName, isMaster: false },
      select: { id: true },
    });

    const ownedInSet = await db.mintRecord.findMany({
      where: {
        userId: user.id,
        badgeId: { in: setMembers.map((member) => member.id) },
      },
      select: { badgeId: true },
    });

    const ownedIds = new Set(ownedInSet.map((record) => record.badgeId));
    const fullSetOwned = setMembers.every((member) => ownedIds.has(member.id));

    if (fullSetOwned) {
      const masterBadge = await db.badge.findFirst({
        where: { setName: badge.setName, isMaster: true },
        select: { id: true },
      });
      if (masterBadge) {
        await persistBadgeUnlock(user.id, masterBadge.id, "full_set", badge.setName);
      }
    }
  }

  return NextResponse.json({ data: { success: true, xpGained: xpGain } });
}
