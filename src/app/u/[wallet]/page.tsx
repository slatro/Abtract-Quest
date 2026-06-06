import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BadgeMedallion } from "@/components/badges/BadgeMedallion";

interface Props {
  params: Promise<{ wallet: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { wallet: rawWallet } = await params;
  const wallet = rawWallet.toLowerCase();
  const user = await db.user.findUnique({
    where: { wallet },
    include: { _count: { select: { mintRecords: true } } },
  });

  if (!user) return { title: "User not found" };

  const displayName = user.username || `${wallet.slice(0, 6)}...${wallet.slice(-4)}`;

  return {
    title: `${displayName} — Abstract Quests`,
    description: `${user._count.mintRecords} badges collected on Abstract Testnet.`,
    openGraph: {
      title: `${displayName} on Abstract Quests`,
      description: `${user._count.mintRecords} badges · ${user.xp} XP · ${user.streak} day streak`,
      images: [`/api/og?wallet=${wallet}`],
    },
    twitter: {
      card: "summary_large_image",
      title: `${displayName} on Abstract Quests`,
      description: `${user._count.mintRecords} badges collected on Abstract Testnet.`,
      images: [`/api/og?wallet=${wallet}`],
    },
  };
}

export default async function UserProfilePage({ params }: Props) {
  const { wallet: rawWallet } = await params;
  const wallet = rawWallet.toLowerCase();

  const user = await db.user.findUnique({
    where: { wallet },
    include: {
      mintRecords: {
        include: { badge: true },
        orderBy: { mintedAt: "desc" },
      },
    },
  });

  if (!user) notFound();

  // Fetch total active badges to show overall progress fraction
  const totalBadgesCount = await db.badge.count({ where: { active: true } });

  const masterBadgeIds = [7, 14, 21, 28, 35, 42];
  const masterBadges = user.mintRecords.filter((r) => masterBadgeIds.includes(r.badgeId));
  const regularBadges = user.mintRecords.filter((r) => !masterBadgeIds.includes(r.badgeId));

  const rarityOrder = { legendary: 0, epic: 1, rare: 2, uncommon: 3, common: 4 };

  const sortedRegularBadges = [...regularBadges].sort((a, b) => {
    const aOrder = rarityOrder[a.badge.rarity as keyof typeof rarityOrder] ?? 5;
    const bOrder = rarityOrder[b.badge.rarity as keyof typeof rarityOrder] ?? 5;
    return aOrder - bOrder;
  });

  const shareUrl = `https://portalbadgerush.xyz/u/${wallet}`;
  const tweetText = encodeURIComponent(
    `I've collected ${user.mintRecords.length} badges on Abstract Quests ⬡\n${shareUrl}`
  );

  // Dynamic Level Calculation
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
  } = getLevelInfo(user.xp || 0);

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Dynamic Background Halo for profile */}
      <div className="absolute top-[80px] left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-green/5 blur-[120px] rounded-full pointer-events-none z-0" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        {/* LEFT COLUMN: Premium Collector Card */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.08] p-6 rounded-2xl relative overflow-hidden flex flex-col items-center text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_10px_40px_rgba(0,0,0,0.4)]">
            
            {/* Silver Banner background container */}
            <div className="h-20 w-[calc(100%+48px)] -mx-6 -mt-6 bg-zinc-300 border-b border-zinc-400 relative z-0" />

            {/* Avatar container with level outline glow */}
            <div className="relative mb-5 -mt-10 group z-10">
              <div className="absolute inset-0 rounded-2xl bg-[linear-gradient(135deg,#00ff66,#00ffff)] opacity-25 blur-md group-hover:opacity-40 transition-opacity duration-300 pointer-events-none" />
              <div className="w-24 h-24 rounded-2xl border-2 border-white/10 flex items-center justify-center overflow-hidden bg-black/60 relative z-10 p-1">
                {user.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={`/avatars/${user.avatar}.png`} alt="avatar" className="w-full h-full object-cover rounded-xl" />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src="/avatars/ninja.png" alt="default avatar" className="w-full h-full object-cover rounded-xl opacity-80" />
                )}
              </div>
              
              {/* Level indicator badge */}
              <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[linear-gradient(135deg,#00ff66,#00ffff)] text-black font-extrabold text-[11px] shadow-[0_4px_10px_rgba(0,255,102,0.4)] z-20">
                LVL {currentLevel}
              </div>
            </div>

            {/* Profile Info */}
            <div className="mt-2">
              <h1 className="text-2xl font-black text-white tracking-tight leading-none mb-1">
                {user.username || "Collector"}
              </h1>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.03] border border-white/5 font-mono text-[11px] text-white/50">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00ff66] shadow-[0_0_6px_#00ff66]" />
                {wallet.slice(0, 6)}...{wallet.slice(-4)}
              </div>
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-white/5 my-6" />

            {/* Collector Progress / Level Tracker */}
            <div className="w-full text-left flex flex-col gap-2">
              <div className="flex justify-between items-baseline">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#00ff66]">Level {currentLevel} Progress</span>
                <span className="text-[11px] font-mono text-white/50">{currentXP} / {xpNeededForThisLevel} XP</span>
              </div>
              <div className="h-2 bg-black/50 rounded-full overflow-hidden border border-white/5 relative">
                <div 
                  className="h-full bg-[linear-gradient(90deg,#00ff66,#00ffff)] rounded-full transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(0,255,102,0.5)]"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="text-[10px] text-white/40 italic">
                Earn XP by completing quests and answering quizzes
              </div>
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-white/5 my-6" />

            {/* Statistics Dashboard */}
            <div className="grid grid-cols-3 gap-3 w-full">
              <div className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-white/[0.01] border border-white/5">
                <span className="text-lg font-black text-white leading-none mb-1">
                  {user.mintRecords.length}
                </span>
                <span className="text-[9px] font-bold text-white/40 uppercase tracking-wider">Badges</span>
              </div>
              <div className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-white/[0.01] border border-white/5">
                <span className="text-lg font-black text-green leading-none mb-1 shadow-green/10">
                  {user.xp}
                </span>
                <span className="text-[9px] font-bold text-white/40 uppercase tracking-wider">XP</span>
              </div>
              <div className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-white/[0.01] border border-white/5">
                <span className="text-lg font-black text-white leading-none mb-1 flex items-center justify-center gap-0.5">
                  {user.streak}<span className="text-xs">🔥</span>
                </span>
                <span className="text-[9px] font-bold text-white/40 uppercase tracking-wider">Streak</span>
              </div>
            </div>

            {/* Sharing buttons */}
            <div className="w-full mt-6">
              <a
                href={`https://twitter.com/intent/tweet?text=${tweetText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 rounded-xl bg-[#0a0f16]/90 backdrop-blur-md text-[#1d9bf0] border border-[#1d9bf0]/20 hover:border-[#1d9bf0]/50 hover:bg-[#1d9bf0]/10 hover:text-white transition-all shadow-[0_4px_20px_rgba(0,0,0,0.5)] flex items-center justify-center gap-2 text-xs font-bold"
              >
                <svg className="w-4 height-4 fill-currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                Share profile on X
              </a>
            </div>
            
          </div>
        </div>

        {/* RIGHT COLUMN: Achievements Wall */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          
          {/* Master Crests shelf */}
          {masterBadges.length > 0 && (
            <div className="bg-white/[0.02] backdrop-blur-xl border border-yellow-500/10 p-6 rounded-2xl shadow-[0_8px_32px_rgba(255,215,0,0.02)]">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">👑</span>
                <h2 className="text-base font-sans font-bold text-yellow-400 tracking-wide uppercase text-[12px]">Master Crests</h2>
                <span className="px-2 py-0.5 rounded-full bg-yellow-400/10 border border-yellow-400/20 text-[10px] text-yellow-400 font-bold">{masterBadges.length}</span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                {masterBadges.map((r) => (
                  <div
                    key={r.id}
                    className="flex flex-col items-center justify-center p-3 rounded-xl border border-yellow-400/20 bg-[#020202]/50 hover:bg-[#020202]/80 shadow-[0_0_20px_rgba(255,215,0,0.08)] hover:shadow-[0_0_30px_rgba(255,215,0,0.15)] hover:border-yellow-400/40 transition-all duration-300 transform hover:-translate-y-1 group cursor-help"
                    title={r.badge.name}
                  >
                    <div className="mb-2">
                      <BadgeMedallion badge={r.badge} size="md" />
                    </div>
                    <div className="text-[10px] font-bold text-yellow-400/80 leading-none text-center truncate w-full group-hover:text-yellow-400">{r.badge.name}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Badge Wall grid */}
          <div className="bg-white/[0.01] backdrop-blur-xl border border-white/[0.06] p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <span className="text-lg">🏆</span>
                <h2 className="text-base font-sans font-bold text-white tracking-wide uppercase text-[12px]">Badge Wall</h2>
                <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-white/60 font-bold">
                  {user.mintRecords.length} / {totalBadgesCount}
                </span>
              </div>
              <div className="text-[11px] text-white/40">
                Sorted by rarity
              </div>
            </div>

            {sortedRegularBadges.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-2xl mb-4 border border-white/5 text-white/40">
                  🛡️
                </div>
                <h3 className="text-white font-bold text-sm mb-1">No Badges Minted</h3>
                <p className="text-xs text-white/40 max-w-xs">
                  This collector hasn't minted any badges yet. Complete quests to unlock new rewards.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {sortedRegularBadges.map((r) => {
                  const glowStyles: Record<string, string> = {
                    legendary: "border-yellow-400/30 shadow-[0_0_24px_rgba(255,215,0,0.12)] hover:border-yellow-400/60 bg-yellow-400/[0.01]",
                    epic: "border-purple-400/25 shadow-[0_0_18px_rgba(180,122,255,0.12)] hover:border-purple-400/50 bg-purple-400/[0.01]",
                    rare: "border-blue-400/20 shadow-[0_0_15px_rgba(96,200,255,0.08)] hover:border-blue-400/40 bg-blue-400/[0.01]",
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

                  const mintedDate = new Date(r.mintedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });

                  return (
                    <div
                      key={r.id}
                      className={`group rounded-xl border p-4 text-center transition-all duration-300 transform hover:-translate-y-1 hover:bg-white/[0.03] ${glowStyles[r.badge.rarity] ?? "border-white/5"}`}
                    >
                      <div className="mb-3 flex justify-center transform group-hover:scale-105 transition-transform duration-300">
                        <BadgeMedallion badge={r.badge} size="md" />
                      </div>
                      
                      <div className="font-sans font-bold text-xs text-white leading-tight mb-1 truncate px-1 group-hover:text-white" title={r.badge.name}>
                        {r.badge.name}
                      </div>

                      <div className={`inline-flex rounded-full border px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider leading-none mb-2.5 scale-95 origin-center capitalize select-none opacity-80 group-hover:opacity-100 transition-opacity duration-300 font-sans cursor-default ${chipColors[r.badge.rarity] || 'text-white border-white/10 bg-white/5'}`}>
                        {r.badge.rarity}
                      </div>

                      <div className="text-[9px] font-mono text-white/30 uppercase tracking-widest leading-none select-none">
                        {mintedDate}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
