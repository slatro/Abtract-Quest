import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createPublicClient, http } from "viem";
import { abstractTestnet } from "viem/chains";
import { persistBadgeUnlock } from "@/lib/badgeUnlocks";

const publicClient = createPublicClient({
  chain: abstractTestnet,
  transport: http("https://api.testnet.abs.xyz"),
});

export async function POST(req: NextRequest) {
  console.time("MINT-CONFIRM TOTAL");
  const { wallet, badgeId, txHash } = await req.json();
  if (!wallet || !badgeId || !txHash) {
    console.timeEnd("MINT-CONFIRM TOTAL");
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // Idempotent — aynı txHash iki kez gelirse tekrar kaydetme
  console.time("MINT-CONFIRM DB IDEMPOTENCY");
  const existing = await db.mintRecord.findUnique({ where: { txHash } });
  console.timeEnd("MINT-CONFIRM DB IDEMPOTENCY");
  if (existing) {
    console.timeEnd("MINT-CONFIRM TOTAL");
    return NextResponse.json({ data: { alreadyRecorded: true } });
  }

  // TX'i zincirde doğrula
  console.time("MINT-CONFIRM RPC VERIFY");
  try {
    let receipt;
    try {
      receipt = await publicClient.getTransactionReceipt({ hash: txHash });
    } catch {
      // Fallback: poll every 500ms if not indexed yet
      receipt = await publicClient.waitForTransactionReceipt({ 
        hash: txHash,
        confirmations: 0,
        pollingInterval: 500,
        timeout: 15000 
      });
    }

    if (receipt.status !== "success") {
      console.timeEnd("MINT-CONFIRM RPC VERIFY");
      console.timeEnd("MINT-CONFIRM TOTAL");
      return NextResponse.json({ error: "Transaction failed" }, { status: 400 });
    }
  } catch {
    console.timeEnd("MINT-CONFIRM RPC VERIFY");
    console.timeEnd("MINT-CONFIRM TOTAL");
    return NextResponse.json({ error: "Transaction not found or timed out" }, { status: 404 });
  }
  console.timeEnd("MINT-CONFIRM RPC VERIFY");

  console.time("MINT-CONFIRM DB UPSERT");
  const user = await db.user.upsert({
    where: { wallet: wallet.toLowerCase() },
    update: {},
    create: { wallet: wallet.toLowerCase() },
  });
  console.timeEnd("MINT-CONFIRM DB UPSERT");

  console.time("MINT-CONFIRM DB FIND BADGE");
  const badge = await db.badge.findUnique({ where: { id: Number(badgeId) } });
  console.timeEnd("MINT-CONFIRM DB FIND BADGE");
  const xpGain = badge?.isMaster ? 500 : 100;

  console.time("MINT-CONFIRM DB TRANSACTION");
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
  console.timeEnd("MINT-CONFIRM DB TRANSACTION");

  console.time("MINT-CONFIRM DB SET CHECK");
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
  console.timeEnd("MINT-CONFIRM DB SET CHECK");

  console.timeEnd("MINT-CONFIRM TOTAL");
  return NextResponse.json({ data: { success: true, xpGained: xpGain } });
}
