import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { persistBadgeUnlock } from "@/lib/badgeUnlocks";

export async function POST(req: NextRequest) {
  const { wallet } = await req.json();
  if (!wallet) return NextResponse.json({ error: "wallet required" }, { status: 400 });

  const user = await db.user.upsert({
    where: { wallet: wallet.toLowerCase() },
    update: {},
    create: { wallet: wallet.toLowerCase() },
  });

  const now = new Date();
  const lastCheckIn = user.lastCheckIn;

  // Bugun zaten check-in yapti mi?
  if (lastCheckIn) {
    const last = new Date(lastCheckIn);
    const sameDay =
      last.getFullYear() === now.getFullYear() &&
      last.getMonth() === now.getMonth() &&
      last.getDate() === now.getDate();

    if (sameDay) {
      return NextResponse.json({ error: "Already checked in today" }, { status: 429 });
    }
  }

  // Streak hesapla
  let newStreak = 1;
  if (lastCheckIn) {
    const last = new Date(lastCheckIn);
    const diffMs = now.getTime() - last.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    // Dun check-in yaptiysa streak devam eder
    newStreak = diffDays === 1 ? user.streak + 1 : 1;
  }

  await db.user.update({
    where: { id: user.id },
    data: {
      lastCheckIn: now,
      streak: newStreak,
      xp: { increment: 50 },
    },
  });

  // Streak badge unlock kontrolu
  const streakBadges: Record<number, number> = {
    3: 23, // Streak Addict
    7: 23,
    30: 23,
  };
  const unlockedBadgeId = streakBadges[newStreak] ?? null;

  await persistBadgeUnlock(user.id, 4, "checkin", "quest-daily-checkin");

  if (unlockedBadgeId) {
    await persistBadgeUnlock(user.id, unlockedBadgeId, "streak", `streak-${newStreak}`);
  }

  return NextResponse.json({
    data: {
      streak: newStreak,
      xpGained: 50,
      unlockedBadgeId,
    },
  });
}
