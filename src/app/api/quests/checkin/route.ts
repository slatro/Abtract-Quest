import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { persistBadgeUnlock } from "@/lib/badgeUnlocks";
import { getMockState, saveMockState } from "@/lib/mockCookies";

export async function POST(req: NextRequest) {
  try {
    const { wallet } = await req.json();
    if (!wallet) return NextResponse.json({ error: "wallet required" }, { status: 400 });

    let user: any = null;
    try {
      user = await db.user.upsert({
        where: { wallet: wallet.toLowerCase() },
        update: {},
        create: { wallet: wallet.toLowerCase() },
      });
    } catch (dbError) {
      console.error("Database connection failed during check-in, using mock fallback:", dbError);
      
      const mockState = await getMockState();
      const newStreak = mockState.lastCheckIn ? mockState.streak + 1 : 1; // simple increment
      const nowStr = new Date().toISOString();
      const updatedQuests = Array.from(new Set([...mockState.completedQuests, "quest-daily-checkin"]));
      
      await saveMockState({
        lastCheckIn: nowStr,
        streak: newStreak,
        xp: mockState.xp + 50,
        completedQuests: updatedQuests,
      });

      return NextResponse.json({
        data: {
          streak: newStreak,
          xpGained: 50,
          unlockedBadgeId: null,
        },
      });
    }

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

    try {
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
    } catch (txError) {
      console.error("Database transaction failed during check-in, using mock success:", txError);
      return NextResponse.json({
        data: {
          streak: newStreak,
          xpGained: 50,
          unlockedBadgeId: null,
        },
      });
    }

    // Streak badge unlock kontrolu
    const streakBadges: Record<number, number> = {
      3: 23, // Streak Addict
      7: 23,
      30: 23,
    };
    const unlockedBadgeId = streakBadges[newStreak] ?? null;

    try {
      await persistBadgeUnlock(user.id, 4, "checkin", "quest-daily-checkin");
      if (unlockedBadgeId) {
        await persistBadgeUnlock(user.id, unlockedBadgeId, "streak", `streak-${newStreak}`);
      }
    } catch (unlockError) {
      console.error("Failed to persist badge unlock:", unlockError);
    }

    return NextResponse.json({
      data: {
        streak: newStreak,
        xpGained: 50,
        unlockedBadgeId,
      },
    });
  } catch (err: any) {
    console.error("Check-in general error:", err);
    return NextResponse.json({ error: err.message || "Check-in failed" }, { status: 500 });
  }
}
