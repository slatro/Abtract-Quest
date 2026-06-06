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
  const todayUtc = now.toISOString().split("T")[0];

  // Bugun zaten check-in yapti mi?
  if (user.lastCheckIn) {
    const last = new Date(user.lastCheckIn);
    const lastUtc = last.toISOString().split("T")[0];

    if (todayUtc === lastUtc) {
      return NextResponse.json({ error: "Already checked in today" }, { status: 429 });
    }
  }

  // Streak hesapla
  let newStreak = 1;
  if (user.lastCheckIn) {
    const last = new Date(user.lastCheckIn);
    const lastUtc = last.toISOString().split("T")[0];
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const yesterdayUtc = yesterday.toISOString().split("T")[0];

    // Dun check-in yaptiysa streak devam eder
    if (lastUtc === yesterdayUtc) {
      newStreak = user.streak + 1;
    } else {
      newStreak = 1;
    }
  }

  await db.$transaction([
    db.user.update({
      where: { id: user.id },
      data: {
        lastCheckIn: now,
        streak: newStreak,
        xp: { increment: 50 },
      },
    }),
    db.questCompletion.create({
      data: {
        userId: user.id,
        questId: "quest-daily-checkin",
      },
    }),
  ]);

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
