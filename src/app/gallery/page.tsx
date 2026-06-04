"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { Badge } from "@/types";
import { BadgeCard } from "@/components/badges/BadgeCard";
import { MintModal } from "@/components/badges/MintModal";

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

  const { data, isLoading } = useQuery({
    queryKey: ["badges", address],
    queryFn: async () => {
      const url = address
        ? `/api/badges?wallet=${address}`
        : "/api/badges";
      const res = await fetch(url);
      const json = await res.json();
      return json.data as Badge[];
    },
  });

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="mb-5 rounded-[30px] surface-panel p-5 sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center rounded-full chip-gold px-3 py-1 text-[11px] font-mono uppercase tracking-[0.16em]">
              Badge Collection
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-[#eef4f0] mb-2 sm:text-[38px]">
              A calmer wall for unlocks, mints, and set progress.
            </h1>
            <p className="text-sm leading-7 text-[#aeb8af] sm:text-base">
              {data?.length ?? 0} collectible badges across rarity tiers and set crests.
              {!data?.some((b) => b.owned) && (
                <span className="text-[#ff8c8c]"> No badges yet. That&apos;s fixable.</span>
              )}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:w-[420px]">
            {[
              { label: "Owned", value: ownedCount },
              { label: "Unlocked", value: unlockedCount },
              { label: "Mintable", value: mintableCount },
              { label: "Crests", value: crestCount },
            ].map((item) => (
              <div key={item.label} className="surface-panel-soft rounded-[22px] p-4">
                <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/42">{item.label}</div>
                <div className="mt-2 text-3xl font-bold text-[#eef4f0]">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {setProgress.length > 0 && (
        <div className="mb-6 rounded-[28px] surface-panel p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-[#eef4f0]">Set progress</div>
              <div className="mt-1 text-[12px] text-white/46">See which crests are getting close.</div>
            </div>
            <div className="text-[11px] font-mono uppercase tracking-[0.16em] text-[#8e9890]">
              Crest chase
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {setProgress.map((set) => (
              <div key={set.setName} className="surface-panel-soft rounded-[20px] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold text-[#eef4f0]">{set.setName}</div>
                  <div className="text-[10px] text-[#8e9890] font-mono">
                    {set.total ? Math.round((set.ownedInSet / set.total) * 100) : 0}%
                  </div>
                </div>
                <div className="text-[11px] text-text-3 mt-1">
                  {set.ownedInSet}/{set.total} owned
                </div>
                <div className="mt-3 h-2 rounded-full progress-track overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[linear-gradient(90deg,#19c37d,#3dffa0)]"
                    style={{ width: `${set.total ? (set.ownedInSet / set.total) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mb-6 flex flex-wrap gap-2">
        {[
          ...FILTERS,
        ].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-xs font-semibold border transition-colors ${
              filter === f
                ? "bg-white text-[#0b0d0c] border-white shadow-[0_10px_22px_rgba(255,255,255,0.08)]"
                : "chip-muted hover:border-white/10 hover:text-[#e8f0e9]"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="text-sm text-text-2">Loading badges...</div>
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
