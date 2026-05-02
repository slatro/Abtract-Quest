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

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-[#e8f0e9] mb-1">Badge Gallery</h1>
        <p className="text-sm text-[#aeb8af]">
          {data?.length ?? 0} collectible badges.{" "}
          {!data?.some((b) => b.owned) && (
            <span className="text-red-400">No badges yet. That&apos;s fixable.</span>
          )}
        </p>
      </div>

      <div className="flex gap-2 flex-wrap mb-6">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
              filter === f
                ? "border-green/30 text-green bg-green/10"
                : "border-border text-[#aeb8af] bg-card hover:border-border-2 hover:text-[#e8f0e9]"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="text-sm text-text-2">Loading badges...</div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
          {filtered.map((badge) => (
            <BadgeCard key={badge.id} badge={badge} onClick={setSelected} />
          ))}
        </div>
      )}

      <MintModal badge={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
