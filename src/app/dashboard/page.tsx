"use client";

import { useAccount } from "wagmi";
import { useQuery } from "@tanstack/react-query";
import { Badge, User } from "@/types";
import { BadgeCard } from "@/components/badges/BadgeCard";
import { MintModal } from "@/components/badges/MintModal";
import { useState } from "react";

export default function DashboardPage() {
  const { address } = useAccount();
  const [selected, setSelected] = useState<Badge | null>(null);

  const { data: user } = useQuery<User>({
    queryKey: ["user", address],
    queryFn: async () => {
      const res = await fetch(`/api/user?wallet=${address}`);
      const json = await res.json();
      return json.data;
    },
    enabled: !!address,
  });

  const { data: badges } = useQuery<Badge[]>({
    queryKey: ["badges", address],
    queryFn: async () => {
      const res = await fetch(`/api/badges?wallet=${address}`);
      const json = await res.json();
      return json.data;
    },
    enabled: !!address,
  });

  const allBadges = badges ?? [];
  const readyToMint = allBadges.filter((b) => b.unlocked && !b.owned).slice(0, 4);
  const unlockedNotOwned = allBadges.filter((b) => b.unlocked && !b.owned);
  const masterBadges = allBadges.filter((b) => b.isMaster);
  const ownedMasterCount = masterBadges.filter((b) => b.owned).length;

  const setProgress = Array.from(new Set(allBadges.map((badge) => badge.setName)))
    .map((setName) => {
      const badgesInSet = allBadges.filter((badge) => badge.setName === setName && !badge.isMaster);
      const crest = allBadges.find((badge) => badge.setName === setName && badge.isMaster) ?? null;
      const ownedCount = badgesInSet.filter((badge) => badge.owned).length;
      const unlockedCount = badgesInSet.filter((badge) => badge.unlocked || badge.owned).length;
      const total = badgesInSet.length;

      return {
        setName,
        total,
        ownedCount,
        unlockedCount,
        crest,
        crestOwned: !!crest?.owned,
        crestUnlocked: !!crest?.unlocked,
        percent: total > 0 ? Math.round((ownedCount / total) * 100) : 0,
      };
    })
    .sort((a, b) => {
      if (a.crestOwned !== b.crestOwned) return a.crestOwned ? 1 : -1;
      return b.ownedCount - a.ownedCount;
    });

  const nextCrest = setProgress.find((set) => !set.crestOwned) ?? null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
      {/* Profile */}
      <div className="surface-panel rounded-[28px] p-4 sm:p-5 self-start lg:sticky lg:top-20">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="w-14 h-14 rounded-2xl surface-panel-soft flex items-center justify-center text-2xl">
          🦊
          </div>
          <div className="rounded-full chip-muted px-3 py-1 text-[11px] font-mono uppercase tracking-[0.14em]">
            Collector
          </div>
        </div>
        <div className="font-mono text-[11px] text-text-2 mb-3 break-all">{address}</div>
        <div className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-white/8 bg-white/[0.03] px-2.5 py-1 text-xs font-semibold text-white/80">
          🏆 Quest Sweeper
        </div>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {[
            { val: user?.xp?.toLocaleString() ?? "0", label: "XP" },
            { val: user?.ownedBadgeIds?.length ?? 0, label: "Badges" },
            { val: user?.streak ?? 0, label: "Streak" },
            { val: ownedMasterCount, label: "Crests" },
          ].map(({ val, label }) => (
            <div key={label} className="surface-panel-soft rounded-2xl p-3">
              <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/42">{label}</div>
              <div className="mt-2 text-xl font-bold text-white">{val}</div>
            </div>
          ))}
        </div>
        {address && (
          <a
            href={`/u/${address}`}
            target="_blank"
            className="block w-full text-center py-2.5 rounded-2xl chip-muted text-xs hover:border-green/20 hover:text-green transition-colors mt-3"
          >
            View public badge wall →
          </a>
        )}
      </div>

      {/* Main */}
      <div>
        <div className="mb-6 rounded-[30px] surface-panel p-5 sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex rounded-full border border-white/8 bg-white/[0.03] px-3 py-1 text-[11px] font-mono uppercase tracking-[0.16em] text-white/66">
                Live Progress
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-[38px]">
                Your quest loop, unlock queue, and crest chase.
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-7 text-white/62">
                Track what is already unlocked, what can be minted right now, and which set is closest to its crest.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:min-w-[420px]">
            {[
              {
                label: "Unlocked",
                value: allBadges.filter((badge) => badge.unlocked || badge.owned).length,
                helper: "Ready or claimed",
              },
              {
                label: "Ready now",
                value: unlockedNotOwned.length,
                helper: "Can mint today",
              },
              {
                label: "Sets moving",
                value: setProgress.filter((set) => set.ownedCount > 0 && !set.crestOwned).length,
                helper: "Crests in progress",
              },
            ].map((item) => (
              <div key={item.label} className="surface-panel-soft rounded-2xl p-4">
                <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/42">{item.label}</div>
                <div className="mt-2 text-3xl font-bold text-[#eef2f6]">{item.value}</div>
                <div className="text-[11px] text-text-3 mt-2">{item.helper}</div>
              </div>
            ))}
            </div>
          </div>
        </div>

        <div className="mb-6">
        {nextCrest && (
          <div className="mb-6 rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,rgba(34,37,42,0.95),rgba(20,22,26,0.98))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_16px_36px_rgba(0,0,0,0.16)] sm:p-6">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
              <div>
                <div className="mb-1 text-[11px] font-mono uppercase tracking-[0.16em] text-white/48">Next Crest</div>
                <h2 className="text-[24px] font-bold text-[#f3f5f7]">{nextCrest.setName}</h2>
                <p className="mt-1 text-sm text-white/62">
                  {nextCrest.ownedCount}/{nextCrest.total} set badges owned
                  {nextCrest.crestUnlocked && !nextCrest.crestOwned ? " · Crest unlocked, mint waiting" : ""}
                </p>
              </div>
              <div className="sm:min-w-24 sm:text-right">
                <div className="text-2xl font-bold text-white">{nextCrest.percent}%</div>
                <div className="text-[11px] text-white/42">completion</div>
              </div>
            </div>
            <div className="mt-5 h-2.5 rounded-full progress-track overflow-hidden">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,#95a0ad,#eef2f6)]"
                style={{ width: `${nextCrest.percent}%` }}
              />
            </div>
          </div>
        )}
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-white">Ready to mint</h2>
          </div>
          {readyToMint.length === 0 ? (
            <div className="surface-panel-soft rounded-2xl p-5 text-sm text-text-2">Complete quests to unlock badges.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-3">
              {readyToMint.map((b) => (
                <BadgeCard key={b.id} badge={b} onClick={setSelected} />
              ))}
            </div>
          )}
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-white">Set progress</h2>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
            {setProgress.map((set) => (
              <div key={set.setName} className="surface-panel rounded-[24px] p-4">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="text-base font-semibold text-[#e8f0e9]">{set.setName}</div>
                    <div className="text-xs text-text-3 mt-1 leading-6">
                      {set.ownedCount}/{set.total} owned · {set.unlockedCount}/{set.total} unlocked
                    </div>
                  </div>
                  <div
                    className={`rounded-full px-2 py-1 text-[10px] font-semibold ${
                      set.crestOwned
                        ? "chip-gold"
                        : set.crestUnlocked
                          ? "chip-green"
                          : "chip-muted"
                    }`}
                  >
                    {set.crestOwned ? "Crest owned" : set.crestUnlocked ? "Crest unlocked" : "Crest locked"}
                  </div>
                </div>
                <div className="h-2 rounded-full progress-track overflow-hidden">
                  <div className="h-full rounded-full bg-[linear-gradient(90deg,#19c37d,#3dffa0)]" style={{ width: `${set.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <MintModal badge={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
