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

  const topUser = leaderboard[0] ?? null;
  const myEntry = leaderboard.find((user: any) => address?.toLowerCase() === user.wallet.toLowerCase()) ?? null;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="mb-6 rounded-[30px] surface-panel p-5 sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <div className="mb-3 inline-flex rounded-full chip-gold px-3 py-1 text-[11px] font-mono uppercase tracking-[0.16em]">
              Ranking Feed
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-[38px]">Collectors, crests, streaks, and XP.</h1>
            <p className="mt-3 text-sm leading-7 text-white/62">See who is actually pushing the board, not just collecting one-off drops.</p>
          </div>

          {topUser && (
            <div className="surface-panel-soft rounded-[24px] px-5 py-4 lg:min-w-[250px]">
              <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/42">Current leader</div>
              <div className="mt-2 font-mono text-sm text-white">{topUser.wallet.slice(0, 6)}...{topUser.wallet.slice(-4)}</div>
              <div className="mt-3 text-3xl font-bold text-green">{topUser.xp.toLocaleString()}</div>
              <div className="mt-1 text-xs text-white/50">{topUser.masterCount} crests · {topUser.badgeCount} badges</div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Collectors", value: leaderboard.length },
          { label: "Top XP", value: topUser?.xp?.toLocaleString?.() ?? "0" },
          { label: "Top crests", value: topUser?.masterCount ?? 0 },
          { label: "Your rank", value: myEntry ? `#${myEntry.rank}` : "—" },
        ].map((item) => (
          <div key={item.label} className="surface-panel-soft rounded-[22px] p-4">
            <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/42">{item.label}</div>
            <div className="mt-2 text-3xl font-bold text-[#e8f0e9]">{item.value}</div>
          </div>
        ))}
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
                className={`flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-3 rounded-[22px] border transition-all ${
                  isMe
                    ? "surface-panel-tint border-green/20"
                    : rankStyles[user.rank] ?? "surface-panel"
                }`}
              >
                <span className={`font-mono text-sm font-bold min-w-8 ${rankColors[user.rank] ?? "text-text-3"}`}>
                  #{user.rank}
                </span>

                <div className="w-9 h-9 rounded-xl surface-panel-soft flex items-center justify-center text-base shrink-0">
                  {["🦅", "👺", "🦊", "🔬", "🔥", "🎓", "🛋️", "🏗️"][user.rank % 8]}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-xs sm:text-sm font-semibold font-mono truncate">
                    {user.wallet.slice(0, 6)}...{user.wallet.slice(-4)}
                    {isMe && (
                      <span className="ml-2 chip-green px-1.5 py-0.5 rounded font-sans">
                        YOU
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] sm:text-xs text-text-3">
                    {user.badgeCount} badges · {user.masterCount} crests · {user.streak}🔥
                  </div>
                </div>

                <div className="text-right shrink-0">
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
