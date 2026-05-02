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

  const readyToMint = badges?.filter((b) => b.unlocked && !b.owned).slice(0, 4) ?? [];

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-[280px_1fr] gap-6">
      {/* Profile */}
      <div className="bg-card border border-border rounded-2xl p-5 self-start sticky top-20">
        <div className="w-14 h-14 rounded-xl bg-bg2 border border-border-2 flex items-center justify-center text-2xl mb-3">
          🦊
        </div>
        <div className="font-mono text-[11px] text-text-2 mb-3 break-all">{address}</div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-400/10 text-amber-400 border border-amber-400/20 mb-4">
          🏆 Quest Sweeper
        </div>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {[
            { val: user?.xp?.toLocaleString() ?? "0", label: "XP" },
            { val: user?.ownedBadgeIds?.length ?? 0, label: "Badges" },
            { val: user?.streak ?? 0, label: "Streak" },
            { val: "0", label: "Crests" },
          ].map(({ val, label }) => (
            <div key={label} className="bg-bg2 border border-border rounded-xl p-2.5">
              <div className="text-lg font-bold">{val}</div>
              <div className="text-[11px] text-text-3">{label}</div>
            </div>
          ))}
        </div>
        {address && (
          <a
            href={`/u/${address}`}
            target="_blank"
            className="block w-full text-center py-2 rounded-xl border border-border text-xs text-text-2 hover:border-green hover:text-green transition-colors mt-3"
          >
            View public badge wall →
          </a>
        )}
      </div>

      {/* Main */}
      <div>
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold">⚡ Ready to mint</h2>
          </div>
          {readyToMint.length === 0 ? (
            <p className="text-sm text-text-2">Complete quests to unlock badges.</p>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-3">
              {readyToMint.map((b) => (
                <BadgeCard key={b.id} badge={b} onClick={setSelected} />
              ))}
            </div>
          )}
        </div>
      </div>

      <MintModal badge={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
