"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { Badge } from "@/types";
import { BadgeCard } from "@/components/badges/BadgeCard";
import { MintModal } from "@/components/badges/MintModal";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";

const FILTERS = ["All", "Owned", "Mintable", "Common", "Uncommon", "Rare", "Epic", "Legendary"];
const RARITY_ORDER: Record<string, number> = {
  common: 0,
  uncommon: 1,
  rare: 2,
  epic: 3,
  legendary: 4,
};

export default function GalleryPage() {
  const { address } = useAccount();
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState<Badge | null>(null);

  const cleanAddress = address && (address as string) !== "undefined" && (address as string) !== "null" ? address : undefined;

  const { data, isLoading } = useQuery({
    queryKey: ["badges", cleanAddress],
    queryFn: async () => {
      const url = cleanAddress
        ? `/api/badges?wallet=${cleanAddress}`
        : "/api/badges";
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("Failed to fetch badges");
      }
      const json = await res.json();
      return json.data as Badge[];
    },
    enabled: typeof window !== "undefined",
  });

  useEffect(() => {
    if (typeof window !== "undefined" && data) {
      const params = new URLSearchParams(window.location.search);
      const mintId = params.get("mint");
      if (mintId) {
        const found = data.find((b) => b.id === Number(mintId));
        if (found) {
          setSelected(found);
          // Clear query param so it doesn't reopen on every navigation/refresh
          const url = new URL(window.location.href);
          url.searchParams.delete("mint");
          window.history.replaceState({}, "", url.pathname + url.search);
        }
      }
    }
  }, [data]);

  const sortedByRarity = [...(data || [])].sort((a, b) => {
    const rarityDiff = RARITY_ORDER[a.rarity] - RARITY_ORDER[b.rarity];
    if (rarityDiff !== 0) return rarityDiff;
    return a.id - b.id;
  });

  const filtered = sortedByRarity.filter((b) => {
    if (filter === "All") return true;
    if (filter === "Owned") return b.owned;
    if (filter === "Mintable") return b.unlocked && !b.owned;
    return b.rarity === filter.toLowerCase();
  });

  const allBadges = data ?? [];
  const ownedCount = allBadges.filter((badge) => badge.owned).length;
  const unlockedCount = allBadges.filter((badge) => badge.unlocked || badge.owned).length;
  const crestCount = allBadges.filter((badge) => badge.isMaster && badge.owned).length;
  const mintableCount = allBadges.filter((badge) => badge.unlocked && !badge.owned).length;

  const setProgress = Array.from(new Set(allBadges.map((badge) => badge.setName)))
    .map((setName) => {
      const setBadges = allBadges.filter((badge) => badge.setName === setName && !badge.isMaster);
      const ownedInSet = setBadges.filter((badge) => badge.owned).length;
      return { setName, ownedInSet, total: setBadges.length };
    })
    .sort((a, b) => b.ownedInSet - a.ownedInSet);

  const filterGlowStyles: Record<string, string> = {
    All: "hover:border-white/60 hover:shadow-[0_0_12px_rgba(255,255,255,0.25)]",
    Owned: "hover:border-emerald-500/60 hover:shadow-[0_0_12px_rgba(16,185,129,0.3)]",
    Mintable: "hover:border-blue-400/60 hover:shadow-[0_0_12px_rgba(96,165,250,0.3)]",
    Common: "hover:border-white/40 hover:shadow-[0_0_12px_rgba(255,255,255,0.2)]",
    Uncommon: "hover:border-green-500/60 hover:shadow-[0_0_12px_rgba(34,197,94,0.35)]",
    Rare: "hover:border-cyan-400/60 hover:shadow-[0_0_12px_rgba(34,211,238,0.35)]",
    Epic: "hover:border-fuchsia-500/60 hover:shadow-[0_0_12px_rgba(217,70,239,0.35)]",
    Legendary: "hover:border-yellow-400/60 hover:shadow-[0_0_12px_rgba(250,204,21,0.35)]",
  };

  function getFilterCount(f: string): number {
    if (f === "All") return allBadges.length;
    if (f === "Owned") return ownedCount;
    if (f === "Mintable") return mintableCount;
    const lower = f.toLowerCase();
    return allBadges.filter((b) => b.rarity === lower).length;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Premium Hero Banner */}
      <div className="mb-8 relative overflow-hidden rounded-2xl bg-[#0f1115] border border-white/10 shadow-2xl">
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-green/20 rounded-full blur-[120px] pointer-events-none opacity-50" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none opacity-50" />

        <div className="relative p-6 sm:p-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl relative z-10">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.15)]">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
              Badge Collection
            </div>
            <h1 className="text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/60 mb-3 sm:text-5xl lg:leading-[1.1]">
              A calmer wall for unlocks, mints, and set progress.
            </h1>
            <p className="text-base leading-relaxed text-white/60 sm:text-lg max-w-xl">
              {data?.length ?? 0} collectible badges across rarity tiers and set crests.
              {!data?.some((b) => b.owned) && (
                <span className="text-red-400 font-medium ml-1">No badges yet. That&apos;s fixable.</span>
              )}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 lg:min-w-[400px] relative z-10">
            {[
              { label: "Owned", value: ownedCount, icon: "💎" },
              { label: "Unlocked", value: unlockedCount, icon: "🔓" },
              { label: "Mintable", value: mintableCount, icon: "✨" },
              { label: "Crests", value: crestCount, icon: "👑" },
            ].map((item) => (
              <div key={item.label} className="bg-white/[0.03] backdrop-blur-xl rounded-xl p-5 border border-white/5 hover:border-white/10 hover:bg-white/[0.05] transition-all shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                <div className="flex items-center gap-2 mb-2 text-[11px] font-bold uppercase tracking-widest text-white/40">
                  <span>{item.icon}</span> {item.label}
                </div>
                <div className="text-3xl font-black text-white">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {setProgress.length > 0 && (
        <div className="mb-8 relative rounded-2xl bg-[#0f1115] border border-white/5 p-6 sm:p-8 shadow-xl overflow-hidden">
          {/* Subtle top border glow */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green/20 to-transparent" />
          
          <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-white/5 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                Set Progress
              </h2>
              <div className="mt-1 text-sm text-white/50">See which crests are getting close.</div>
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.03] px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white/40">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              Crest Chase
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {setProgress.map((set) => {
              const percent = set.total ? Math.round((set.ownedInSet / set.total) * 100) : 0;
              return (
                <div key={set.setName} className="group relative rounded-xl bg-white/[0.02] border border-white/[0.04] p-5 transition-all hover:bg-white/[0.04] hover:border-white/10 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <div className="text-base font-bold text-white group-hover:text-green transition-colors">{set.setName}</div>
                      <div className="text-xs text-white/40 mt-1 font-medium">
                        {set.ownedInSet} <span className="opacity-50">/</span> {set.total} collected
                      </div>
                    </div>
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/5 shadow-inner">
                      <span className="text-xs font-black text-white">{percent}%</span>
                    </div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-black/40 overflow-hidden shadow-inner relative">
                    <div
                      className="absolute top-0 left-0 h-full rounded-full bg-[linear-gradient(90deg,#19c37d,#3dffa0)] shadow-[0_0_10px_rgba(61,255,160,0.5)] transition-all duration-500 ease-out"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="mb-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const count = getFilterCount(f);
          const isActive = filter === f;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border transition-all duration-300 ${
                isActive
                  ? "bg-white text-[#0b0d0c] border-white shadow-[0_4px_20px_rgba(255,255,255,0.15)] scale-105"
                  : `bg-[#090b0e]/95 backdrop-blur-3xl text-white/60 border-white/10 hover:text-white hover:bg-black/90 ${filterGlowStyles[f] || ""}`
              }`}
            >
              {f} <span className={`ml-1 text-[10px] ${isActive ? "text-[#0b0d0c]/60" : "text-white/30"}`}>({count})</span>
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2.5">
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="h-[260px] w-full max-w-[198px] rounded-md" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState title="No badges found" description="Try changing your filters or checking back later." />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2.5">
          {filtered.map((badge) => (
            <BadgeCard key={badge.id} badge={badge} onClick={setSelected} />
          ))}
        </div>
      )}

      <MintModal badge={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
