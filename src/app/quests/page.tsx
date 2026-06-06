"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAccount, useSignMessage } from "wagmi";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { PenguinIcon, PenguinVariant } from "@/components/ui/PenguinIcon";
import { useRouter } from "next/navigation";
import { createGuildClient, createSigner } from "@guildxyz/sdk";

const guildClient = createGuildClient("Abstract Quests");

const TABS = ["Daily", "Ecosystem", "Social", "Quiz", "Streak", "Hidden"];

const typeIcons: Record<string, PenguinVariant> = {
  daily: "daily",
  visit: "visit",
  social: "social",
  quiz: "quiz",
  streak: "streak",
  hidden: "hidden",
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
  const router = useRouter();
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState("Daily");
  const [toast, setToast] = useState<string | null>(null);

  const [clickedQuests, setClickedQuests] = useState<Record<string, boolean>>({});
  const [verifyingIds, setVerifyingIds] = useState<Record<string, boolean>>({});
  const [resetCountdown, setResetCountdown] = useState("");

  useEffect(() => {
    function updateCountdown() {
      const now = new Date();
      const nextUtc = Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate() + 1,
        0,
        0,
        0
      );
      const diffMs = nextUtc - now.getTime();
      if (diffMs <= 0) {
        setResetCountdown("0s 0d");
        return;
      }
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      setResetCountdown(`${hours}s ${minutes}d`);
    }

    updateCountdown();
    const timer = setInterval(updateCountdown, 10000);
    return () => clearInterval(timer);
  }, []);

  const cleanAddress = address && (address as string) !== "undefined" && (address as string) !== "null" ? address : undefined;

  const { data: quests = [], isLoading } = useQuery({
    queryKey: ["quests", cleanAddress],
    queryFn: async () => {
      const url = cleanAddress ? `/api/quests?wallet=${cleanAddress}` : "/api/quests";
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("Failed to fetch quests");
      }
      const json = await res.json();
      return json.data ?? [];
    },
    enabled: typeof window !== "undefined",
  });

  const checkInMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/quests/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet: address }),
      });
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || "Check-in request failed");
      }
      return res.json();
    },
    onSuccess: (data) => {
      if (data.error) {
        setToast(data.error);
      } else {
        const unlockNote = data.data.unlockedBadgeId ? ` · Badge #${data.data.unlockedBadgeId} unlocked` : "";
        setToast(`✓ Checked in! Streak: ${data.data.streak} days · +${data.data.xpGained} XP${unlockNote}`);
        
        import("canvas-confetti").then((module) => {
          module.default({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            zIndex: 9999
          });
        });

        queryClient.setQueryData(["user", address], (oldData: any) => {
          if (!oldData) return oldData;
          return { ...oldData, xp: oldData.xp + data.data.xpGained };
        });

        queryClient.invalidateQueries({ queryKey: ["quests", address] });
        queryClient.invalidateQueries({ queryKey: ["user", address] });
        queryClient.invalidateQueries({ queryKey: ["badges", address] });
        queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
      }
      setTimeout(() => setToast(null), 4000);
    },
    onError: (err: any) => {
      setToast(err.message || "Error: Check-in failed. Please try again.");
      setTimeout(() => setToast(null), 4000);
    }
  });

  const completeQuestMutation = useMutation({
    mutationFn: async (questId: string) => {
      const res = await fetch("/api/quests/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet: address, questId }),
      });
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || "Quest completion failed");
      }
      return res.json();
    },
    onSuccess: (data) => {
      if (data.error) {
        setToast(data.error);
      } else {
        const unlockNote = data.data.badgeId ? ` · Badge #${data.data.badgeId} unlocked` : "";
        setToast(`✓ Quest complete! +${data.data.xpGained} XP${unlockNote}`);
        
        import("canvas-confetti").then((module) => {
          module.default({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            zIndex: 9999
          });
        });

        queryClient.setQueryData(["user", address], (oldData: any) => {
          if (!oldData) return oldData;
          return { ...oldData, xp: oldData.xp + data.data.xpGained };
        });

        queryClient.invalidateQueries({ queryKey: ["quests", address] });
        queryClient.invalidateQueries({ queryKey: ["user", address] });
        queryClient.invalidateQueries({ queryKey: ["badges", address] });
        queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
      }
      setTimeout(() => setToast(null), 4000);
    },
    onError: (err: any) => {
      setToast(err.message || "Error: Failed to complete quest. Please try again.");
      setTimeout(() => setToast(null), 4000);
    }
  });

  const filtered = quests.filter((q: any) => {
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
    if (quest.completed || quest.onCooldown || verifyingIds[quest.id]) {
      return;
    }
    if (quest.type === "daily") {
      checkInMutation.mutate();
      return;
    }
    if (quest.type === "visit" || quest.type === "social") {
      if (!clickedQuests[quest.id]) {
        window.open(getVisitUrl(quest), "_blank");
        setClickedQuests(prev => ({ ...prev, [quest.id]: true }));
      } else {
        setVerifyingIds(prev => ({ ...prev, [quest.id]: true }));
        const isSocial = quest.type === "social";
        setToast(isSocial ? `Connecting to ${quest.title.includes("Discord") ? "Discord" : "X"} API...` : "Verifying visit...");
        
        setTimeout(() => {
          if (isSocial) {
            setToast(`Verifying account connection...`);
          }
          setTimeout(() => {
            completeQuestMutation.mutate(quest.id, {
              onSuccess: () => {
                setVerifyingIds(prev => ({ ...prev, [quest.id]: false }));
              },
              onError: () => {
                setToast("Verification failed. Please try again.");
                setVerifyingIds(prev => ({ ...prev, [quest.id]: false }));
              }
            });
          }, 1000);
        }, 1000);
      }
      return;
    }
    if (quest.type === "quiz") {
      router.push(`/quests/quiz/${quest.id.replace("quest-quiz-", "")}`);
      return;
    }
    completeQuestMutation.mutate(quest.id);
  }

  function getVisitUrl(quest: any): string {
    if (quest.visitUrl) return quest.visitUrl;
    const urls: Record<string, string> = {
      "quest-visit-abscan": "https://abscan.org",
      "quest-visit-abstract-home": "https://abstract.xyz",
      "quest-visit-agw-docs": "https://docs.abstract.xyz",
      "quest-follow-abstract-x": "https://x.com/AbstractChain",
      "quest-join-abstract-discord": "https://discord.gg/abstractchain",
    };
    return urls[quest.id] ?? "https://abstract.xyz";
  }

  function getStatusLabel(quest: any) {
    if (quest.completed && !quest.onCooldown) return "✓ Completed";
    if (quest.onCooldown) return "✓ Completed";
    if (verifyingIds[quest.id]) return "Verifying...";
    if ((quest.type === "visit" || quest.type === "social") && clickedQuests[quest.id]) return "Verify";
    return "Start";
  }

  function getStatusStyle(quest: any) {
    if (quest.completed && !quest.onCooldown) return "bg-green/5 text-green/50";
    if (quest.onCooldown) return "bg-green/10 text-green-400 opacity-80 cursor-not-allowed";
    if (verifyingIds[quest.id]) return "bg-blue-500/10 text-blue-400 animate-pulse";
    if ((quest.type === "visit" || quest.type === "social") && clickedQuests[quest.id]) return "bg-orange-500/10 text-orange-400";
    return "bg-green/10 text-green";
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Premium Hero Banner */}
      <div className="mb-8 relative overflow-hidden rounded-2xl bg-[#0f1115] border border-white/10 shadow-2xl">
        {/* Glow Effects */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-green/20 rounded-full blur-[100px] pointer-events-none opacity-50" />
        <div className="absolute top-1/2 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none opacity-50" />

        <div className="relative p-6 sm:p-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl relative z-10">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-green shadow-[0_0_15px_rgba(34,197,94,0.15)]">
              <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
              Active Missions
            </div>
            <h1 className="text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/60 mb-3 sm:text-5xl">
              Quest Board
            </h1>
            <p className="text-base leading-relaxed text-white/60 sm:text-lg max-w-xl">
              Complete quests, earn XP, and unlock exclusive badges. Your journey on Abstract starts here.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 lg:min-w-[400px] relative z-10">
            {[
              { label: "Visible", value: totalQuests, icon: "visible" },
              { label: "Completed", value: completedQuests, icon: "completed" },
              { label: "Cooldown", value: cooldownQuests, icon: "cooldown" },
              { label: "Badge Quests", value: unlockingQuests, icon: "badge" },
            ].map((item) => (
              <div key={item.label} className="bg-white/[0.03] backdrop-blur-xl rounded-xl p-4 sm:p-5 border border-white/5 hover:border-white/10 hover:bg-white/[0.05] transition-all shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                <div className="flex items-center gap-2 mb-2 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-white/40">
                  <PenguinIcon variant={item.icon as PenguinVariant} className="w-4 h-4" /> {item.label}
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden no-scrollbar">
        {TABS.map((t) => {
          const count = quests.filter((q: any) => {
            if (t === "Ecosystem") return q.type === "visit";
            return typeLabels[q.type] === t;
          }).length;

          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider whitespace-nowrap border transition-all ${
                tab === t
                  ? "bg-white/10 text-white border-white/20 shadow-lg"
                  : "bg-transparent text-white/50 border-transparent hover:bg-white/5 hover:text-white"
              }`}
            >
              <span>{t}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                tab === t ? "bg-white/20 text-white" : "bg-white/5 text-white/40"
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Quest list */}
      {isLoading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl bg-white/5" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState title="No quests found" description="You have completed all available quests in this category." />
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((quest: any) => (
            <div
              key={quest.id}
              className="group relative bg-white/[0.03] backdrop-blur-xl border border-white/[0.05] flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-xl hover:bg-white/[0.05] hover:border-white/10 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300 ease-out cursor-pointer"
              onClick={() => handleQuestAction(quest)}
            >
              {/* Subtle accent line on hover */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-green rounded-r-full opacity-0 group-hover:h-12 group-hover:opacity-100 transition-all duration-300 ease-out" />

              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center text-white shrink-0 shadow-inner border border-white/5 group-hover:scale-110 group-hover:text-green transition-all duration-300">
                <PenguinIcon variant={typeIcons[quest.type] ?? "base"} className="w-6 h-6" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="text-base font-bold text-white mb-1 group-hover:text-green transition-colors">{quest.title}</div>
                <div className="text-sm text-white/50 leading-relaxed mb-3">{quest.description}</div>
                <div className="flex gap-2 flex-wrap">
                  <span className="text-[10px] px-2.5 py-1 rounded-md bg-white/5 text-white/60 font-medium uppercase tracking-widest border border-white/5">
                    {typeLabels[quest.type] ?? quest.type}
                  </span>
                  <span className="text-[10px] px-2.5 py-1 rounded-md bg-green/10 text-green font-bold uppercase tracking-widest border border-green/20">
                    +{quest.xpReward} XP
                  </span>
                  {quest.id === "quest-daily-checkin" && typeof quest.streak === "number" && (
                    <span className="text-[10px] px-2.5 py-1 rounded-md bg-orange-500/10 text-orange-400 font-bold uppercase tracking-widest border border-orange-500/20">
                      🔥 {quest.streak} Day Streak
                    </span>
                  )}

                  {quest.badgeId && (
                    <span className="text-[10px] px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-400 font-bold uppercase tracking-widest border border-purple-500/20">
                      Unlocks Badge
                    </span>
                  )}
                </div>
              </div>

              <div className="sm:shrink-0 self-start sm:self-auto mt-2 sm:mt-0 flex items-center gap-3">
                {quest.id === "quest-daily-checkin" && quest.onCooldown && resetCountdown && (
                  <span className="text-[12px] font-mono font-black text-white/30 tracking-wider">
                    {resetCountdown}
                  </span>
                )}
                <div className={`flex items-center justify-center min-w-[120px] text-[11px] font-bold uppercase tracking-widest px-4 py-2.5 rounded-lg border transition-all ${
                  quest.completed && !quest.onCooldown 
                    ? "bg-green/5 border-green/10 text-green/50" 
                    : quest.onCooldown 
                      ? "bg-green/10 border-green/20 text-green-400 opacity-80" 
                      : "bg-white/5 border-white/10 text-white group-hover:bg-green group-hover:border-green group-hover:text-black group-hover:shadow-[0_0_15px_rgba(34,197,94,0.4)]"
                }`}>
                  {getStatusLabel(quest)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-xs bg-card border border-border-2 rounded-md px-4 py-3 text-sm font-medium shadow-xl z-50">
          {toast}
        </div>
      )}
    </div>
  );
}
