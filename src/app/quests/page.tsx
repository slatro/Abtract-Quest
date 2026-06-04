"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAccount } from "wagmi";

const TABS = ["All", "Daily", "Ecosystem", "Social", "Quiz", "Streak", "Hidden"];

const typeIcons: Record<string, string> = {
  daily: "☀️",
  visit: "🌐",
  social: "🐦",
  quiz: "📚",
  streak: "🔥",
  hidden: "🗝️",
};

const typeLabels: Record<string, string> = {
  daily: "Daily",
  visit: "Ecosystem",
  social: "Social",
  quiz: "Quiz",
  streak: "Streak",
  hidden: "Hidden",
};

export default function QuestsPage() {
  const { address } = useAccount();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState("All");
  const [toast, setToast] = useState<string | null>(null);

  const { data: quests = [], isLoading } = useQuery({
    queryKey: ["quests", address],
    queryFn: async () => {
      const url = address ? `/api/quests?wallet=${address}` : "/api/quests";
      const res = await fetch(url);
      const json = await res.json();
      return json.data ?? [];
    },
  });

  const checkInMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/quests/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet: address }),
      });
      return res.json();
    },
    onSuccess: (data) => {
      if (data.error) {
        setToast(data.error);
      } else {
        const unlockNote = data.data.unlockedBadgeId ? ` · Badge #${data.data.unlockedBadgeId} unlocked` : "";
        setToast(`✓ Checked in! Streak: ${data.data.streak} days · +${data.data.xpGained} XP${unlockNote}`);
        queryClient.invalidateQueries({ queryKey: ["quests", address] });
        queryClient.invalidateQueries({ queryKey: ["user", address] });
        queryClient.invalidateQueries({ queryKey: ["badges", address] });
        queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
      }
      setTimeout(() => setToast(null), 4000);
    },
  });

  const completeQuestMutation = useMutation({
    mutationFn: async (questId: string) => {
      const res = await fetch("/api/quests/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet: address, questId }),
      });
      return res.json();
    },
    onSuccess: (data) => {
      if (data.error) {
        setToast(data.error);
      } else {
        const unlockNote = data.data.badgeId ? ` · Badge #${data.data.badgeId} unlocked` : "";
        setToast(`✓ Quest complete! +${data.data.xpGained} XP${unlockNote}`);
        queryClient.invalidateQueries({ queryKey: ["quests", address] });
        queryClient.invalidateQueries({ queryKey: ["user", address] });
        queryClient.invalidateQueries({ queryKey: ["badges", address] });
        queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
      }
      setTimeout(() => setToast(null), 4000);
    },
  });

  const filtered = quests.filter((q: any) => {
    if (tab === "All") return true;
    if (tab === "Ecosystem") return q.type === "visit";
    return typeLabels[q.type] === tab;
  });

  const totalQuests = quests.length;
  const completedQuests = quests.filter((quest: any) => quest.completed).length;
  const cooldownQuests = quests.filter((quest: any) => quest.onCooldown).length;
  const unlockingQuests = quests.filter((quest: any) => quest.badgeId).length;

  function handleQuestAction(quest: any) {
    if (!address) {
      setToast("Connect your wallet first.");
      return;
    }
    if (quest.type === "daily") {
      checkInMutation.mutate();
      return;
    }
    if (quest.type === "visit") {
      // Linki ac, 3 saniye sonra complete et
      window.open(getVisitUrl(quest), "_blank");
      setTimeout(() => completeQuestMutation.mutate(quest.id), 3000);
      return;
    }
    if (quest.type === "quiz") {
      window.location.href = `/quests/quiz/${quest.id.replace("quest-quiz-", "")}`;
      return;
    }
    completeQuestMutation.mutate(quest.id);
  }

  function getVisitUrl(quest: any): string {
    const urls: Record<string, string> = {
      "quest-visit-abscan": "https://abscan.org",
      "quest-visit-abstract-home": "https://abstract.xyz",
      "quest-visit-agw-docs": "https://docs.abstract.xyz",
    };
    return urls[quest.id] ?? "https://abstract.xyz";
  }

  function getStatusLabel(quest: any) {
    if (quest.completed && !quest.onCooldown) return "✓ Done";
    if (quest.onCooldown) return "⏳ Cooldown";
    return "Start";
  }

  function getStatusStyle(quest: any) {
    if (quest.completed && !quest.onCooldown) return "bg-green/5 text-green/50";
    if (quest.onCooldown) return "bg-amber-400/10 text-amber-400";
    return "bg-green/10 text-green";
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight mb-1">Quest board</h1>
        <p className="text-sm text-text-2">Complete quests. Unlock badges. Climb the leaderboard.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Visible", value: totalQuests },
          { label: "Completed", value: completedQuests },
          { label: "Cooldown", value: cooldownQuests },
          { label: "Badge quests", value: unlockingQuests },
        ].map((item) => (
          <div key={item.label} className="surface-panel rounded-2xl p-4">
            <div className="text-2xl font-bold text-[#e8f0e9]">{item.value}</div>
            <div className="text-xs font-semibold text-[#aeb8af] mt-1">{item.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap border transition-colors ${
              tab === t
                ? "chip-green"
                : "text-text-2 bg-transparent border-transparent hover:bg-white/5"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Quest list */}
      {isLoading ? (
        <div className="text-sm text-text-2">Loading quests...</div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((quest: any) => (
            <div
              key={quest.id}
              className="surface-panel flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl hover:border-white/10 transition-all cursor-pointer"
              onClick={() => handleQuestAction(quest)}
            >
              <div className="w-10 h-10 rounded-xl surface-panel-soft flex items-center justify-center text-lg shrink-0">
                {typeIcons[quest.type] ?? "⚡"}
              </div>

              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold mb-0.5">{quest.title}</div>
                <div className="text-xs text-text-2 leading-relaxed">{quest.description}</div>
                <div className="flex gap-2 mt-1.5 flex-wrap">
                  <span className="text-[10px] px-2 py-0.5 rounded chip-muted">
                    {typeLabels[quest.type] ?? quest.type}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded chip-green">
                    +{quest.xpReward} XP
                  </span>
                  {quest.badgeId && (
                    <span className="text-[10px] px-2 py-0.5 rounded border border-purple-300/15 bg-purple-300/10 text-purple-200">
                      Unlocks badge
                    </span>
                  )}
                </div>
              </div>

              <div className="sm:shrink-0 self-start sm:self-auto">
                <span className={`text-xs font-semibold px-3 py-1.5 rounded-lg ${getStatusStyle(quest)}`}>
                  {getStatusLabel(quest)}
                </span>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-sm text-text-2 py-8 text-center">No quests in this category yet.</div>
          )}
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-xs bg-card border border-border-2 rounded-xl px-4 py-3 text-sm font-medium shadow-xl z-50">
          {toast}
        </div>
      )}
    </div>
  );
}
