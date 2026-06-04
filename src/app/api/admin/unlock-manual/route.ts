import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/adminAuth";
import { signUnlockPayload } from "@/lib/signer";
import { db } from "@/lib/db";
import { persistBadgeUnlock } from "@/lib/badgeUnlocks";

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { wallet, badgeId } = await req.json();
  if (!wallet || !badgeId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const user = await db.user.upsert({
    where: { wallet: wallet.toLowerCase() },
    update: {},
    create: { wallet: wallet.toLowerCase() },
  });

  const badge = await db.badge.findUnique({
    where: { id: Number(badgeId) },
  });

  if (!badge) {
    return NextResponse.json({ error: "Badge not found" }, { status: 404 });
  }

  await persistBadgeUnlock(user.id, Number(badgeId), "admin", "manual_unlock");

  const result = await signUnlockPayload(wallet as `0x${string}`, Number(badgeId));
  return NextResponse.json({ data: { ...result, persisted: true } });
}
