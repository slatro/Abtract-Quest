import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { rateLimit, getIP } from "@/lib/rateLimit";
import { isBlocked } from "@/lib/checkBlocklist";

export async function POST(req: NextRequest) {
  const ip = getIP(req);
  const ipLimit = rateLimit(`quest:ip:${ip}`, 30, 60_000);
  if (!ipLimit.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const { wallet, questId } = await req.json();
  if (!wallet || !questId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  if (await isBlocked(wallet)) {
    return NextResponse.json({ error: "Wallet restricted" }, { status: 403 });
  }

  const quest = await db.quest.findUnique({ where: { id: questId } });
  if (!quest || !quest.active) {
    return NextResponse.json({ error: "Quest not found" }, { status: 404 });
  }

  const user = await db.user.upsert({
    where: { wallet: wallet.toLowerCase() },
    update: {},
    create: { wallet: wallet.toLowerCase() },
  });

  // Cooldown kontrolü
  const lastCompletion = await db.questCompletion.findFirst({
    where: { userId: user.id, questId },
    orderBy: { completedAt: "desc" },
  });

  if (lastCompletion) {
    const cooldownMs = quest.cooldownMin * 60 * 1000;
    const elapsed = Date.now() - lastCompletion.completedAt.getTime();
    if (elapsed < cooldownMs) {
      const remaining = Math.ceil((cooldownMs - elapsed) / 60000);
      return NextResponse.json(
        { error: `On cooldown. Try again in ${remaining} minutes.` },
        { status: 429 }
      );
    }
  }

  await db.$transaction([
    db.questCompletion.create({
      data: { userId: user.id, questId },
    }),
    db.user.update({
      where: { id: user.id },
      data: { xp: { increment: quest.xpReward } },
    }),
  ]);

  return NextResponse.json({
    data: { success: true, xpGained: quest.xpReward, badgeId: quest.badgeId },
  });
}
