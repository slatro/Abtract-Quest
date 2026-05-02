"use client";

import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";

export default function LeaderboardPage() {
  const { address } = useAccount();

  const { data: leaderboard = [], isLoading } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      const res = await fetch("/api/leaderboard");
      const json = await res.json();
      return json.data ?? [];
    },
    refetchInterval: 30000,
  });

  const rankStyles: Record<number, string> = {
    1: "border-yellow-400/30 bg-yellow-400/5",
    2: "border-gray-400/20",
    3: "border-amber-600/20",
  };

  const rankColors: Record<number, string> = {
    1: "text-yellow-400",
    2: "text-gray-400",
    3: "text-amber-600",
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight mb-1">Leaderboard</h1>
        <p className="text-sm text-text-2">Badge collectors ranked by XP.</p>
      </div>

      {isLoading ? (
        <div className="text-sm text-text-2">Loading...</div>
      ) : (
        <div className="flex flex-col gap-2">
          {leaderboard.map((user: any) => {
            const isMe = address?.toLowerCase() === user.wallet.toLowerCase();

            return (
              <div
                key={user.wallet}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl border transition-all ${
                  isMe
                    ? "border-green/30 bg-green/5"
                    : rankStyles[user.rank] ?? "border-border bg-card"
                }`}
              >
                <span className={`font-mono text-sm font-bold min-w-7 ${rankColors[user.rank] ?? "text-text-3"}`}>
                  #{user.rank}
                </span>

                <div className="w-9 h-9 rounded-xl bg-bg2 border border-border flex items-center justify-center text-base">
                  {["🦅", "👺", "🦊", "🔬", "🔥", "🎓", "🛋️", "🏗️"][user.rank % 8]}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold font-mono truncate">
                    {user.wallet.slice(0, 6)}...{user.wallet.slice(-4)}
                    {isMe && (
                      <span className="ml-2 text-[10px] text-green bg-green/10 px-1.5 py-0.5 rounded font-sans">
                        YOU
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-text-3">
                    {user.badgeCount} badges · {user.masterCount} crests · {user.streak}🔥
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-bold text-green">{user.xp.toLocaleString()}</div>
                  <div className="text-[10px] text-text-3">XP</div>
                </div>
              </div>
            );
          })}

          {leaderboard.length === 0 && (
            <div className="text-sm text-text-2 text-center py-12">
              No collectors yet. Be the first.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
