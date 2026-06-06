import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { signUnlockPayload } from "@/lib/signer";
import { rateLimit, getIP } from "@/lib/rateLimit";
import { isBlocked } from "@/lib/checkBlocklist";
import { verifyTurnstile } from "@/lib/verifyTurnstile";
import { getUnlockedBadgeIds } from "@/lib/badgeUnlocks";

export async function POST(req: NextRequest) {
  // IP başına dakikada 10 unlock isteği
  const ip = getIP(req);
  const ipLimit = rateLimit(`unlock:ip:${ip}`, 10, 60_000);
  if (!ipLimit.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const { wallet, badgeId, turnstileToken } = await req.json();

  if (!wallet || !badgeId) {
    return NextResponse.json({ error: "wallet and badgeId required" }, { status: 400 });
  }

  if (process.env.NODE_ENV === "production" && process.env.TURNSTILE_SECRET_KEY) {
    if (!turnstileToken) {
      return NextResponse.json({ error: "Captcha required" }, { status: 400 });
    }
    const valid = await verifyTurnstile(turnstileToken);
    if (!valid) {
      return NextResponse.json({ error: "Captcha failed" }, { status: 400 });
    }
  }

  if (await isBlocked(wallet)) {
    return NextResponse.json({ error: "Wallet restricted" }, { status: 403 });
  }

  // Wallet başına saatte 20 unlock isteği
  const walletLimit = rateLimit(`unlock:wallet:${wallet}`, 20, 3_600_000);
  if (!walletLimit.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const walletLower = wallet.toLowerCase();

  // Daha önce mint etmiş mi?
  const existing = await db.mintRecord.findFirst({
    where: {
      badgeId: Number(badgeId),
      user: { wallet: walletLower },
    },
  });

  if (existing) {
    return NextResponse.json({ error: "Already minted" }, { status: 409 });
  }

  // Badge var mı ve unlock gerekiyor mu?
  const badge = await db.badge.findUnique({ where: { id: Number(badgeId) } });
  if (!badge || !badge.active) {
    return NextResponse.json({ error: "Badge not available" }, { status: 404 });
  }

  const badges = await db.badge.findMany({
    orderBy: [{ setName: "asc" }, { id: "asc" }],
  });

  const user = await db.user.upsert({
    where: { wallet: walletLower },
    update: {},
    create: { wallet: walletLower },
  });

  const userWithProgress = await db.user.findUnique({
    where: { id: user.id },
    include: {
      mintRecords: { select: { badgeId: true } },
      badgeUnlocks: { select: { badgeId: true } },
      questCompletions: {
        include: {
          quest: { select: { badgeId: true } },
        },
      },
      quizAttempts: {
        where: { passed: true },
        include: {
          quiz: { select: { badgeId: true } },
        },
      },
    },
  });

  if (!userWithProgress) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const unlockedIds = getUnlockedBadgeIds(userWithProgress, badges);
  if (badge.requiresUnlock && !unlockedIds.has(Number(badgeId))) {
    return NextResponse.json({ error: "Badge not unlocked yet" }, { status: 403 });
  }

  if (badge.isMaster) {
    const setMembers = badges.filter((item) => item.setName === badge.setName && !item.isMaster);
    const memberIds = setMembers.map((item) => item.id);
    const ownedIds = new Set(userWithProgress.mintRecords.map((record) => record.badgeId));
    const fullSetOwned = memberIds.every((id) => ownedIds.has(id));
    if (!fullSetOwned) {
      return NextResponse.json({ error: "Complete the full set first" }, { status: 403 });
    }
  }

  const result = await signUnlockPayload(wallet as `0x${string}`, Number(badgeId));

  // Nonce'u DB'ye kaydet
  await db.mintNonce.create({
    data: {
      nonce: result.payload.nonce,
      wallet: walletLower,
      badgeId: Number(badgeId),
      expiry: new Date(result.payload.expiry * 1000),
    },
  });

  return NextResponse.json({ data: result });
}
