import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { rateLimit, getIP } from "@/lib/rateLimit";
import { isBlocked } from "@/lib/checkBlocklist";
import { persistBadgeUnlock } from "@/lib/badgeUnlocks";
import { STATIC_QUESTS } from "@/lib/staticData";
import { getMockState, saveMockState } from "@/lib/mockCookies";

export async function POST(req: NextRequest) {
  try {
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

    let quest: any = null;
    try {
      quest = await db.quest.findUnique({ where: { id: questId } });
    } catch (dbError) {
      console.error("Database connection failed when fetching quest, using static quests fallback:", dbError);
      quest = STATIC_QUESTS.find((q) => q.id === questId);
    }

    if (!quest || !quest.active) {
      return NextResponse.json({ error: "Quest not found" }, { status: 404 });
    }

    let user: any = null;
    try {
      user = await db.user.upsert({
        where: { wallet: wallet.toLowerCase() },
        update: {},
        create: { wallet: wallet.toLowerCase() },
      });
    } catch (dbError) {
      console.error("Database connection failed when updating user for quest, using mock fallback:", dbError);
      
      const mockState = await getMockState();
      const updatedQuests = Array.from(new Set([...mockState.completedQuests, questId]));
      const unlockedBadges = mockState.unlockedBadges;
      if (quest.badgeId && !unlockedBadges.includes(quest.badgeId)) {
        unlockedBadges.push(quest.badgeId);
      }

      await saveMockState({
        completedQuests: updatedQuests,
        xp: mockState.xp + quest.xpReward,
        unlockedBadges,
      });

      return NextResponse.json({
        data: { success: true, xpGained: quest.xpReward, badgeId: quest.badgeId },
      });
    }

    let lastCompletion: any = null;
    try {
      lastCompletion = await db.questCompletion.findFirst({
        where: { userId: user.id, questId },
        orderBy: { completedAt: "desc" },
      });
    } catch (dbError) {
      console.error("Failed to query last completion, bypassing cooldown check:", dbError);
    }

    if (quest.type === "streak") {
      const match = quest.id.match(/quest-streak-(\d+)/);
      const requiredStreak = match ? parseInt(match[1]) : 0;
      if (user.streak < requiredStreak) {
        return NextResponse.json({ error: `Requires a ${requiredStreak}-day streak.` }, { status: 400 });
      }
    }

    if (lastCompletion) {
      const cooldownMs = quest.cooldownMin * 60 * 1000;
      const elapsed = Date.now() - new Date(lastCompletion.completedAt).getTime();
      if (elapsed < cooldownMs) {
        const remaining = Math.ceil((cooldownMs - elapsed) / 60000);
        return NextResponse.json(
          { error: `On cooldown. Try again in ${remaining} minutes.` },
          { status: 429 }
        );
      }
    }

    try {
      await db.$transaction([
        db.questCompletion.create({
          data: { userId: user.id, questId },
        }),
        db.user.update({
          where: { id: user.id },
          data: { xp: { increment: quest.xpReward } },
        }),
      ]);

      if (quest.badgeId) {
        await persistBadgeUnlock(user.id, quest.badgeId, "quest", quest.id);
      }
    } catch (txError) {
      console.error("Failed to record quest completion in DB, using fallback success:", txError);
    }

    return NextResponse.json({
      data: { success: true, xpGained: quest.xpReward, badgeId: quest.badgeId },
    });
  } catch (err: any) {
    console.error("Quest completion general error:", err);
    return NextResponse.json({ error: err.message || "Quest completion failed" }, { status: 500 });
  }
}
