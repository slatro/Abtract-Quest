"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { Trophy, Medal, Crown, Star, Flame, Shield, Search } from "lucide-react";

export default function LeaderboardPage() {
  const { address } = useAccount();
  const [searchQuery, setSearchQuery] = useState("");

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
    1: "bg-yellow-500/[0.08] backdrop-blur-xl border-yellow-500/20 shadow-[0_0_30px_rgba(234,179,8,0.15)] hover:border-yellow-500/40",
    2: "bg-gray-300/[0.08] backdrop-blur-xl border-gray-400/20 hover:border-gray-400/40",
    3: "bg-amber-600/[0.08] backdrop-blur-xl border-amber-600/20 hover:border-amber-600/40",
  };

  const rankColors: Record<number, string> = {
    1: "text-yellow-400 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]",
    2: "text-gray-300 drop-shadow-[0_0_10px_rgba(209,213,219,0.3)]",
    3: "text-amber-500 drop-shadow-[0_0_10px_rgba(245,158,11,0.3)]",
  };

  const RankIcons: Record<number, any> = {
    1: Crown,
    2: Medal,
    3: Medal,
  };

  const topUser = leaderboard[0] ?? null;
  const myEntry = leaderboard.find((user: any) => address?.toLowerCase() === user.wallet.toLowerCase()) ?? null;

  const filteredLeaderboard = leaderboard.filter((user: any) =>
    user.wallet.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Premium Hero Banner */}
      <section className="mb-8 relative overflow-hidden rounded-2xl bg-[#0f1115] border border-white/10 shadow-2xl p-6 sm:p-10">
        {/* Glow Effects */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-[120px] pointer-events-none opacity-50" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-green-500/10 rounded-full blur-[100px] pointer-events-none opacity-50" />

        <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.15)]">
              <Trophy className="w-4 h-4" />
              Ranking Feed
            </div>
            <h1 className="text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/60 mb-4 sm:text-5xl lg:leading-[1.1]">
              Collectors, crests, streaks, and XP.
            </h1>
            <p className="max-w-lg text-base leading-relaxed text-white/60 sm:text-lg">
              See who is actually pushing the board, not just collecting one-off drops.
            </p>
          </div>

          {topUser && (
            <div className="bg-white/[0.03] backdrop-blur-xl border border-yellow-500/20 rounded-2xl p-6 lg:min-w-[300px] shadow-[0_0_40px_rgba(234,179,8,0.05)] relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600" />
              <div className="absolute -right-10 -top-10 opacity-5 group-hover:opacity-10 transition-opacity">
                <Crown className="w-48 h-48 text-yellow-500" />
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-yellow-500/80 mb-3">
                  <Star className="w-3.5 h-3.5" /> Current Leader
                </div>
                <div className="font-mono text-lg text-white mb-4 bg-black/40 inline-block px-3 py-1 rounded-md border border-white/5">
                  {topUser.wallet.slice(0, 6)}...{topUser.wallet.slice(-4)}
                </div>
                <div className="flex items-end gap-2">
                  <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-green-400 to-green-600">
                    {topUser.xp.toLocaleString()}
                  </div>
                  <div className="text-sm font-bold text-green-500/50 mb-1.5 uppercase tracking-wider">XP</div>
                </div>
                <div className="mt-3 flex items-center gap-4 text-xs font-medium text-white/50 bg-white/5 px-3 py-2 rounded-lg border border-white/5">
                  <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5" /> {topUser.masterCount} Crests</span>
                  <span className="w-px h-3 bg-white/20" />
                  <span className="flex items-center gap-1"><Medal className="w-3.5 h-3.5" /> {topUser.badgeCount} Badges</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Collectors", value: leaderboard.length },
          { label: "Top XP", value: topUser?.xp?.toLocaleString?.() ?? "0" },
          { label: "Top Crests", value: topUser?.masterCount ?? 0 },
          { label: "Your Rank", value: myEntry ? `#${myEntry.rank}` : "—", highlight: !!myEntry },
        ].map((item) => (
          <div key={item.label} className={`bg-white/[0.03] backdrop-blur-xl rounded-xl p-5 sm:p-6 border transition-all ${item.highlight ? 'border-green-500/30 bg-green-500/5' : 'border-white/5 hover:border-white/10 hover:bg-white/[0.05]'}`}>
            <div className={`text-[11px] font-bold uppercase tracking-[0.15em] ${item.highlight ? 'text-green-400/80' : 'text-white/40'}`}>{item.label}</div>
            <div className={`mt-2 text-3xl sm:text-4xl font-black ${item.highlight ? 'text-green-400' : 'text-white'}`}>{item.value}</div>
          </div>
        ))}
      </div>

      {/* Search Bar */}
      <div className="mb-6 relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/30 group-focus-within:text-green transition-colors">
          <Search className="h-4 w-4" />
        </div>
        <input
          type="text"
          placeholder="Search by wallet address (0x...)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white/[0.02] backdrop-blur-xl border border-white/5 focus:border-green/35 focus:bg-white/[0.04] focus:ring-1 focus:ring-green/20 rounded-xl py-3.5 pl-11 pr-12 text-sm text-white placeholder-white/30 transition-all outline-none"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-xs font-bold text-white/40 hover:text-white transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-20 w-full rounded-xl bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filteredLeaderboard.map((user: any) => {
            const isMe = address?.toLowerCase() === user.wallet.toLowerCase();
            const RankIcon = RankIcons[user.rank];

            return (
              <div
                key={user.wallet}
                className={`group relative flex items-center gap-4 sm:gap-6 px-4 sm:px-6 py-4 rounded-xl border transition-all duration-300 ${
                  isMe
                    ? "bg-[#09150f]/65 backdrop-blur-xl border-green-500/30 shadow-[0_0_20px_rgba(34,197,94,0.15)] hover:bg-[#09150f]/80"
                    : rankStyles[user.rank] ?? "bg-white/[0.03] backdrop-blur-xl border-white/5 hover:bg-white/[0.06] hover:border-white/10"
                }`}
              >
                {/* Accent line for top 3 or user */}
                <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 rounded-r-full transition-all duration-300 ease-out ${
                  user.rank === 1 ? 'bg-yellow-400 h-12 opacity-100' :
                  user.rank === 2 ? 'bg-gray-300 h-8 opacity-100' :
                  user.rank === 3 ? 'bg-amber-500 h-8 opacity-100' :
                  isMe ? 'bg-green-500 h-10 opacity-100' :
                  'bg-white/20 group-hover:h-8 group-hover:opacity-100'
                }`} />

                {/* Rank Number / Icon */}
                <div className="flex items-center justify-center w-12 shrink-0">
                  {RankIcon ? (
                    <RankIcon className={`w-8 h-8 ${rankColors[user.rank]}`} strokeWidth={1.5} />
                  ) : (
                    <span className={`font-mono text-2xl font-black ${isMe ? 'text-green-400' : 'text-white/30'}`}>
                      {user.rank}
                    </span>
                  )}
                </div>

                {/* Avatar / Initials */}
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center text-2xl shrink-0 shadow-inner border border-white/5 group-hover:scale-110 transition-transform duration-300 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/avatars/${user.avatar || ["ninja", "king", "samurai", "doctor", "astronaut", "cyberpunk", "wizard", "pirate", "chef", "detective", "pilot", "explorer"][(user.rank - 1) % 12]}.png`}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-1">
                    <span className={`text-base sm:text-lg font-bold font-mono truncate ${isMe ? 'text-white' : 'text-white/90 group-hover:text-white transition-colors'}`}>
                      {user.wallet.slice(0, 6)}...{user.wallet.slice(-4)}
                    </span>
                    {isMe && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-green-500/20 text-green-400 border border-green-500/30">
                        You
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-[11px] sm:text-xs text-white/50 font-medium">
                    <span className="flex items-center gap-1.5"><Medal className="w-3.5 h-3.5" />{user.badgeCount} Badges</span>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" />{user.masterCount} Crests</span>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <span className="flex items-center gap-1.5"><Flame className="w-3.5 h-3.5 text-orange-500/70" />{user.streak} Streak</span>
                  </div>
                </div>

                {/* XP Score */}
                <div className="text-right shrink-0 flex flex-col justify-center items-end">
                  <div className={`text-2xl sm:text-3xl font-black ${isMe ? 'text-green-400' : 'text-green-500'}`}>
                    {user.xp.toLocaleString()}
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">XP</div>
                </div>
              </div>
            );
          })}

          {leaderboard.length === 0 ? (
            <div className="relative overflow-hidden rounded-2xl bg-white/[0.02] border border-white/5 p-12 text-center shadow-xl mt-4">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/[0.03] border border-white/10 shadow-inner">
                <Trophy className="h-10 w-10 text-white/40" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">No collectors yet</h2>
              <p className="text-base text-white/50 max-w-md mx-auto">
                Be the first to start claiming quests, earning XP, and pushing the leaderboard.
              </p>
            </div>
          ) : filteredLeaderboard.length === 0 ? (
            <div className="relative overflow-hidden rounded-2xl bg-white/[0.02] border border-white/5 p-12 text-center shadow-xl mt-4">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/[0.03] border border-white/10 shadow-inner">
                <Search className="h-10 w-10 text-white/40" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">No matching collectors</h2>
              <p className="text-base text-white/50 max-w-md mx-auto">
                Try searching for a different wallet address.
              </p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
