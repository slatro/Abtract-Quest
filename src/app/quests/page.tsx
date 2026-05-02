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
        setToast(`✓ Checked in! Streak: ${data.data.streak} days · +${data.data.xpGained} XP`);
        queryClient.invalidateQueries({ queryKey: ["quests", address] });
        queryClient.invalidateQueries({ queryKey: ["user", address] });
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
        setToast(`✓ Quest complete! +${data.data.xpGained} XP`);
        queryClient.invalidateQueries({ queryKey: ["quests", address] });
        queryClient.invalidateQueries({ queryKey: ["user", address] });
      }
      setTimeout(() => setToast(null), 4000);
    },
  });

  const filtered = quests.filter((q: any) => {
    if (tab === "All") return true;
    if (tab === "Ecosystem") return q.type === "visit";
    return typeLabels[q.type] === tab;
  });

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
    <div className="max-w-3xl mx-auto px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight mb-1">Quest board</h1>
        <p className="text-sm text-text-2">Complete quests. Unlock badges. Climb the leaderboard.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap border transition-colors ${
              tab === t
                ? "text-green bg-green/10 border-green/20"
                : "text-text-2 bg-transparent border-transparent hover:bg-card"
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
              className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-border-2 transition-all cursor-pointer"
              onClick={() => handleQuestAction(quest)}
            >
              <div className="w-10 h-10 rounded-xl bg-bg2 border border-border flex items-center justify-center text-lg flex-shrink-0">
                {typeIcons[quest.type] ?? "⚡"}
              </div>

              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold mb-0.5">{quest.title}</div>
                <div className="text-xs text-text-2 leading-relaxed">{quest.description}</div>
                <div className="flex gap-2 mt-1.5 flex-wrap">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-bg2 border border-border text-text-2">
                    {typeLabels[quest.type] ?? quest.type}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-green/8 border border-green/15 text-green">
                    +{quest.xpReward} XP
                  </span>
                  {quest.badgeId && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-purple-400/8 border border-purple-400/15 text-purple-400">
                      Unlocks badge
                    </span>
                  )}
                </div>
              </div>

              <div className="flex-shrink-0">
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
        <div className="fixed bottom-6 right-6 bg-card border border-border-2 rounded-xl px-4 py-3 text-sm font-medium shadow-xl z-50 max-w-xs">
          {toast}
        </div>
      )}
    </div>
  );
}
