"use client";

import { useAccount } from "wagmi";
import { useQuery } from "@tanstack/react-query";
import { Badge, User } from "@/types";
import { BadgeCard } from "@/components/badges/BadgeCard";
import { MintModal } from "@/components/badges/MintModal";
import { ProfileEditModal } from "@/components/profile/ProfileEditModal";
import { BadgeMedallion } from "@/components/badges/BadgeMedallion";
import { useState } from "react";
import { useLoginWithAbstract } from "@abstract-foundation/agw-react";

export default function DashboardPage() {
  const { address } = useAccount();
  const { login } = useLoginWithAbstract();
  const [selected, setSelected] = useState<Badge | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const { data: user, refetch: refetchUser } = useQuery<User>({
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

  if (!address) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 relative overflow-hidden">
        {/* Sleek background glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green/20 rounded-full blur-[120px] pointer-events-none opacity-40 animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none opacity-40" />

        <div className="max-w-md w-full rounded-2xl bg-[#0f1115]/90 border border-white/10 p-8 text-center relative z-10 shadow-2xl backdrop-blur-2xl">
          {/* Subtle top light effect */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green/30 to-transparent" />
          
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green/10 to-green/5 border border-green/20 flex items-center justify-center mx-auto mb-6 shadow-inner text-green">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>

          <h2 className="text-2xl font-black text-white mb-3 tracking-tight">Connect Your Wallet</h2>
          <p className="text-sm text-white/50 leading-relaxed mb-8">
            Access your personalized Abstract Quest dashboard to view your unlocked badges, complete active crest sets, and customize your collector profile.
          </p>

          <button
            onClick={() => login()}
            className="w-full py-3.5 rounded-xl bg-[linear-gradient(180deg,#56ffad_0%,#35f39a_100%)] text-[#061009] font-bold text-sm shadow-[0_10px_24px_rgba(61,255,160,0.18)] transition-all hover:scale-[1.01] hover:shadow-[0_14px_30px_rgba(61,255,160,0.22)] active:scale-[0.99]"
          >
            Connect AGW
          </button>
        </div>
      </div>
    );
  }

  const allBadges = badges ?? [];
  const readyToMint = allBadges.filter((b) => b.unlocked && !b.owned).slice(0, 4);
  const unlockedNotOwned = allBadges.filter((b) => b.unlocked && !b.owned);
  const masterBadges = allBadges.filter((b) => b.isMaster);
  const ownedMasterCount = masterBadges.filter((b) => b.owned).length;

  // Owned badges for the Badge Wall
  const ownedBadges = allBadges.filter((b) => b.owned);

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

  // Dynamic Level calculation
  const getLevelInfo = (totalXP: number) => {
    let lvl = 1;
    while (true) {
      const nextLevelTotalXP = 250 * lvl * (lvl + 1);
      if (totalXP >= nextLevelTotalXP) {
        lvl++;
      } else {
        break;
      }
    }
    const xpForCurrentLvlStart = 250 * lvl * (lvl - 1);
    const xpForNextLvlStart = 250 * lvl * (lvl + 1);
    const xpNeededForThisLvl = xpForNextLvlStart - xpForCurrentLvlStart;
    const currentLvlXP = totalXP - xpForCurrentLvlStart;
    const progressPct = Math.min((currentLvlXP / xpNeededForThisLvl) * 100, 100);

    return {
      level: lvl,
      currentXP: currentLvlXP,
      xpNeededForThisLevel: xpNeededForThisLvl,
      progressPercent: progressPct,
    };
  };

  const {
    level: currentLevel,
    currentXP,
    xpNeededForThisLevel,
    progressPercent,
  } = getLevelInfo(user?.xp || 0);

  const rarityOrder = { legendary: 0, epic: 1, rare: 2, uncommon: 3, common: 4 };
  const sortedOwnedRegularBadges = ownedBadges
    .filter((b) => !masterBadgeIds().includes(b.id))
    .sort((a, b) => {
      const aOrder = rarityOrder[a.rarity as keyof typeof rarityOrder] ?? 5;
      const bOrder = rarityOrder[b.rarity as keyof typeof rarityOrder] ?? 5;
      return aOrder - bOrder;
    });

  function masterBadgeIds() {
    return [7, 14, 21, 28, 35, 42];
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
      
      {/* LEFT COLUMN: Premium Glassmorphic Collector Card (Upgraded Sidebar) */}
      <div className="flex flex-col gap-6 self-start">
        <div className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.08] p-5 rounded-2xl relative overflow-hidden flex flex-col items-center text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_10px_40px_rgba(0,0,0,0.4)]">
          
          {/* Silver Banner background container */}
          <div className="h-20 w-[calc(100%+40px)] -mx-5 -mt-5 bg-zinc-300 border-b border-zinc-400 relative z-0" />

          {/* Edit Profile button */}
          <div className="absolute top-3 right-3 z-20">
            <button 
              onClick={() => setIsProfileModalOpen(true)} 
              className="chip-muted px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider hover:text-white hover:border-white/20 transition-colors flex items-center gap-1 backdrop-blur-md bg-black/40 border border-white/5"
            >
              <span>Edit</span>
              <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          </div>

          {/* Avatar container with level outline glow */}
          <div className="relative mb-5 -mt-10 group z-10">
            <div className="absolute inset-0 rounded-2xl bg-[linear-gradient(135deg,#00ff66,#00ffff)] opacity-25 blur-md group-hover:opacity-40 transition-opacity duration-300 pointer-events-none" />
            <div 
              onClick={() => setIsProfileModalOpen(true)}
              className="w-20 h-20 rounded-2xl border-2 border-white/10 flex items-center justify-center overflow-hidden bg-black/60 relative z-10 p-1 cursor-pointer group-hover:scale-[1.02] transition-transform duration-300"
            >
              {user?.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={`/avatars/${user.avatar}.png`} alt="avatar" className="w-full h-full object-cover rounded-xl" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src="/avatars/ninja.png" alt="default avatar" className="w-full h-full object-cover rounded-xl opacity-80" />
              )}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-xl">
                 <span className="text-[9px] text-white font-extrabold tracking-widest">EDIT</span>
              </div>
            </div>
            
            {/* Level indicator badge */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-[linear-gradient(135deg,#00ff66,#00ffff)] text-black font-extrabold text-[10px] shadow-[0_3px_8px_rgba(0,255,102,0.4)] z-20">
              LVL {currentLevel}
            </div>
          </div>

          {/* Profile Info */}
          <div className="mt-1.5 z-10 w-full">
            <h1 className="text-xl font-bold text-white tracking-tight leading-none mb-1.5 truncate px-2">
              {user?.username || "Collector"}
            </h1>
            
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/[0.03] border border-white/5 font-mono text-[10px] text-white/50 max-w-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00ff66] shadow-[0_0_6px_#00ff66]" />
              <span className="truncate max-w-[120px]">{address}</span>
              <button 
                onClick={(e) => {
                  navigator.clipboard.writeText(address);
                  const btn = e.currentTarget;
                  const svg = btn.querySelector('svg');
                  if (svg) svg.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />';
                  setTimeout(() => {
                    if (svg) svg.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />';
                  }, 2000);
                }} 
                className="text-white/40 hover:text-white transition-colors ml-1 p-0.5"
                title="Copy address"
              >
                <svg width="10" height="10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-white/5 my-5" />

          {/* Level Progress Tracker */}
          <div className="w-full text-left flex flex-col gap-2">
            <div className="flex justify-between items-baseline">
              <span className="text-[9px] font-bold uppercase tracking-widest text-[#00ff66]">Level Progress</span>
              <span className="text-[10px] font-mono text-white/50">{currentXP}/{xpNeededForThisLevel}</span>
            </div>
            <div className="h-1.5 bg-black/50 rounded-full overflow-hidden border border-white/5 relative">
              <div 
                className="h-full bg-[linear-gradient(90deg,#00ff66,#00ffff)] rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(0,255,102,0.4)]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-white/5 my-5" />

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-2.5 w-full">
            {[
              { val: user?.xp?.toLocaleString() ?? "0", label: "XP", icon: "⚡" },
              { val: ownedBadges.length, label: "Badges", icon: "🛡️" },
              { val: user?.streak ?? 0, label: "Streak", icon: "🔥" },
              { val: ownedMasterCount, label: "Crests", icon: "👑" },
            ].map(({ val, label, icon }) => (
              <div key={label} className="bg-white/[0.01] rounded-xl p-2.5 border border-white/5 hover:border-white/10 transition-colors text-left flex flex-col">
                <div className="flex items-center gap-1 mb-1 text-[9px] font-bold uppercase tracking-wider text-white/40 select-none">
                  <span>{icon}</span> {label}
                </div>
                <div className="text-base font-black text-white leading-none mt-0.5">{val}</div>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-white/5 my-5" />

          {/* View Badge Wall Scroll Button */}
          <button
            onClick={() => {
              const element = document.getElementById("badge-wall-section");
              if (element) {
                element.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/20 py-3 text-[11px] font-semibold text-white/70 hover:text-white transition-all hover:bg-white/[0.04] shadow-[0_2px_10px_rgba(0,0,0,0.2)]"
          >
            <span>View Badge Wall</span>
            <span className="group-hover:translate-y-0.5 transition-transform">↓</span>
          </button>
        </div>
      </div>

      {/* RIGHT COLUMN: Main Dashboard Content */}
      <div className="flex flex-col min-w-0">
        
        {/* Live Progress Card */}
        <div className="mb-10 rounded-2xl border border-white/5 bg-[#0f1115] p-8 lg:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green/10 to-transparent" />
          <div className="flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between">
            <div className="max-w-xl">
              <div className="mb-5 inline-block border border-white/15 px-2.5 py-1 text-[9px] font-mono font-bold uppercase tracking-[0.2em] text-white/70 rounded-sm">
                Live Status
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl leading-[1.1] mb-4">
                Your quest loop, unlock<br />queue, and crest chase.
              </h1>
              <p className="max-w-md text-[14px] leading-relaxed text-white/50">
                Track what is already unlocked, what can be minted right now, and which set is closest to its crest.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full xl:w-auto shrink-0">
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
              <div key={item.label} className="flex flex-col justify-center min-h-[130px] rounded-xl border border-white/5 bg-[#0e0e11] p-5 w-full xl:w-[150px]">
                <div className="text-[9px] font-bold uppercase tracking-wider text-white/80 mb-2.5">{item.label}</div>
                <div className="text-3xl font-bold text-white mb-2">{item.value}</div>
                <div className="text-[11px] text-white/40">{item.helper}</div>
              </div>
            ))}
            </div>
          </div>
        </div>

        {/* Next Crest Card */}
        {nextCrest && (
          <div className="mb-8 mt-1.5">
            <div className="rounded-2xl bg-[linear-gradient(180deg,rgba(34,37,42,0.95),rgba(20,22,26,0.98))] p-6 shadow-xl sm:p-8 border border-white/5">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                <div>
                  <div className="mb-2 text-[10px] font-mono uppercase tracking-widest text-white/40">Next Crest</div>
                  <h2 className="text-2xl font-bold text-white">{nextCrest.setName}</h2>
                  <p className="mt-1 text-xs text-white/50">
                    {nextCrest.ownedCount}/{nextCrest.total} set badges owned
                    {nextCrest.crestUnlocked && !nextCrest.crestOwned ? " · Crest unlocked, mint waiting" : ""}
                  </p>
                </div>
                <div className="sm:min-w-24 sm:text-right">
                  <div className="text-2xl font-black text-white">{nextCrest.percent}%</div>
                  <div className="text-[10px] text-white/40 uppercase tracking-wider mt-0.5">completion</div>
                </div>
              </div>
              <div className="mt-6 h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full rounded-full bg-[linear-gradient(90deg,#19c37d,#00ffff)] shadow-[0_0_8px_#19c37d]"
                  style={{ width: `${nextCrest.percent}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Ready to Mint Section */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>⚡</span> Ready to mint
            </h2>
          </div>
          {readyToMint.length === 0 ? (
            <div className="rounded-2xl border border-white/5 bg-[#09090b]/40 backdrop-blur-md p-6 text-sm text-white/40">Complete quests to unlock badges.</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {readyToMint.map((b) => (
                <BadgeCard key={b.id} badge={b} onClick={setSelected} />
              ))}
            </div>
          )}
        </div>

        {/* NEW: Integrated Badge Wall */}
        {ownedBadges.length > 0 && (
          <div id="badge-wall-section" className="mb-10 bg-white/[0.01] backdrop-blur-xl border border-white/[0.06] p-6 rounded-2xl scroll-mt-24">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <span className="text-lg">🏆</span>
                <h2 className="text-base font-sans font-bold text-white tracking-wide uppercase text-[12px]">Your Badge Wall</h2>
                <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-white/60 font-bold">
                  {ownedBadges.length} / {allBadges.length}
                </span>
              </div>
              <div className="text-[11px] text-white/40">
                Sorted by rarity
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {sortedOwnedRegularBadges.map((b) => {
                const glowStyles: Record<string, string> = {
                  legendary: "border-yellow-400/30 shadow-[0_0_20px_rgba(255,215,0,0.12)] hover:border-yellow-400/60 bg-yellow-400/[0.01]",
                  epic: "border-purple-400/25 shadow-[0_0_15px_rgba(180,122,255,0.12)] hover:border-purple-400/50 bg-purple-400/[0.01]",
                  rare: "border-blue-400/20 shadow-[0_0_12px_rgba(96,200,255,0.08)] hover:border-blue-400/40 bg-blue-400/[0.01]",
                  uncommon: "border-green/20 hover:border-green/40 bg-green/[0.01]",
                  common: "border-white/5 hover:border-white/20 bg-white/[0.005]",
                };

                const chipColors: Record<string, string> = {
                  legendary: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
                  epic: "text-purple-400 bg-purple-400/10 border-purple-400/20",
                  rare: "text-blue-400 bg-blue-400/10 border-blue-400/20",
                  uncommon: "text-green bg-green/10 border-green/20",
                  common: "text-white/60 bg-white/5 border-white/10",
                };

                return (
                  <div
                    key={b.id}
                    onClick={() => setSelected(b)}
                    className={`group rounded-xl border p-4 text-center transition-all duration-300 transform hover:-translate-y-1 hover:bg-white/[0.03] cursor-pointer ${glowStyles[b.rarity] ?? "border-white/5"}`}
                  >
                    <div className="mb-3 flex justify-center transform group-hover:scale-105 transition-transform duration-300">
                      <BadgeMedallion badge={b} size="md" />
                    </div>
                    
                    <div className="font-sans font-bold text-xs text-white leading-tight mb-1 truncate px-1 group-hover:text-white" title={b.name}>
                      {b.name}
                    </div>

                    <div className={`inline-flex rounded-full border px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider leading-none scale-95 origin-center capitalize select-none opacity-80 group-hover:opacity-100 transition-opacity duration-300 font-sans cursor-default ${chipColors[b.rarity] || 'text-white border-white/10 bg-white/5'}`}>
                      {b.rarity}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Set Progress Section */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>🎯</span> Set progress
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {setProgress.map((set) => (
              <div key={set.setName} className="rounded-2xl border border-white/5 bg-[#09090b]/40 backdrop-blur-md p-6 transition-colors hover:border-[#19c37d]/30">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="text-lg font-bold text-white">{set.setName}</div>
                  <div
                    className={`rounded-full border px-2.5 py-1 text-[9px] font-mono font-bold tracking-[0.1em] uppercase ${
                      set.crestOwned
                        ? "border-[#f5a623]/20 text-[#f5a623] bg-[#f5a623]/5 shadow-[0_0_8px_rgba(245,166,35,0.1)]"
                        : set.crestUnlocked
                          ? "border-green/20 text-green bg-green/5 shadow-[0_0_8px_rgba(0,255,102,0.1)]"
                          : "border-white/10 text-white/40 bg-white/[0.02]"
                    }`}
                  >
                    {set.crestOwned ? "Crest owned" : set.crestUnlocked ? "Crest unlocked" : "Crest locked"}
                  </div>
                </div>
                
                <div className="text-xs text-white/50 mb-4">
                  {set.ownedCount}/{set.total} owned · {set.unlockedCount}/{set.total} unlocked
                </div>
                
                <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full rounded-full bg-[linear-gradient(90deg,#00ff66,#00ffff)]" style={{ width: `${set.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      <MintModal badge={selected} onClose={() => setSelected(null)} />
      
      {isProfileModalOpen && user && (
        <ProfileEditModal
          user={user}
          onClose={() => setIsProfileModalOpen(false)}
          onSuccess={() => refetchUser()}
        />
      )}
    </div>
  );
}
