import { cookies } from "next/headers";

export async function getMockState() {
  const cookieStore = await cookies();
  
  const completedQuestsStr = cookieStore.get("mock_completed_quests")?.value || "";
  const completedQuests = completedQuestsStr.split(",").filter(Boolean);
  
  const ownedBadgesStr = cookieStore.get("mock_owned_badges")?.value || "";
  const ownedBadges = ownedBadgesStr.split(",").map(Number).filter((id) => !isNaN(id));
  
  const unlockedBadgesStr = cookieStore.get("mock_unlocked_badges")?.value || "";
  const unlockedBadges = unlockedBadgesStr.split(",").map(Number).filter((id) => !isNaN(id));
  
  const lastCheckIn = cookieStore.get("mock_last_checkin")?.value || null;
  const streak = Number(cookieStore.get("mock_streak")?.value || "0");
  const xp = Number(cookieStore.get("mock_xp")?.value || "0");
  
  return { completedQuests, ownedBadges, unlockedBadges, lastCheckIn, streak, xp };
}

export async function saveMockState(state: {
  completedQuests?: string[];
  ownedBadges?: number[];
  unlockedBadges?: number[];
  lastCheckIn?: string | null;
  streak?: number;
  xp?: number;
}) {
  const cookieStore = await cookies();
  
  if (state.completedQuests !== undefined) {
    cookieStore.set("mock_completed_quests", state.completedQuests.join(","), { path: "/", maxAge: 60 * 60 * 24 * 365 });
  }
  if (state.ownedBadges !== undefined) {
    cookieStore.set("mock_owned_badges", state.ownedBadges.join(","), { path: "/", maxAge: 60 * 60 * 24 * 365 });
  }
  if (state.unlockedBadges !== undefined) {
    cookieStore.set("mock_unlocked_badges", state.unlockedBadges.join(","), { path: "/", maxAge: 60 * 60 * 24 * 365 });
  }
  if (state.lastCheckIn !== undefined) {
    cookieStore.set("mock_last_checkin", state.lastCheckIn || "", { path: "/", maxAge: 60 * 60 * 24 * 365 });
  }
  if (state.streak !== undefined) {
    cookieStore.set("mock_streak", String(state.streak), { path: "/", maxAge: 60 * 60 * 24 * 365 });
  }
  if (state.xp !== undefined) {
    cookieStore.set("mock_xp", String(state.xp), { path: "/", maxAge: 60 * 60 * 24 * 365 });
  }
}
