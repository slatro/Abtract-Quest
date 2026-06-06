"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { useQuery } from "@tanstack/react-query";
import { User } from "@/types";

export function UserLevelBar() {
  const { address } = useAccount();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: user } = useQuery<User>({
    queryKey: ["user", address],
    queryFn: async () => {
      const res = await fetch(`/api/user?wallet=${address}`);
      const json = await res.json();
      return json.data;
    },
    enabled: !!address,
  });

  if (!mounted || !address || !user) return null;

  // Dynamic Level calculation: required XP increases progressively
  // Level L requires 500 * L XP to reach Level L+1.
  // Cumulative XP needed to START Level L is 250 * L * (L-1)
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
    <div className="flex items-center gap-3 bg-white/[0.02] backdrop-blur-md border border-[#00ff66]/30 px-3 py-1.5 rounded-full mr-3 shadow-[0_0_15px_rgba(0,255,102,0.1)] transition-all hover:border-[#00ff66]/50">
      {/* Level Icon */}
      <div className="relative flex items-center justify-center w-6 h-6 rounded-full bg-[linear-gradient(135deg,#00ff66,#00ffff)] text-black font-extrabold text-[12px] shadow-[0_0_10px_rgba(0,255,102,0.4)]">
        {currentLevel}
      </div>
      
      {/* XP Track */}
      <div className="flex flex-col w-28">
        <div className="flex justify-between items-baseline mb-1">
          <span className="text-[9px] font-mono uppercase text-[#00ff66] tracking-widest font-bold">Lvl {currentLevel}</span>
          <span className="text-[9px] font-mono text-white/60">{currentXP}/{xpNeededForThisLevel}</span>
        </div>
        <div className="h-1 bg-black/60 rounded-full overflow-hidden border border-white/5">
          <div 
            className="h-full bg-[linear-gradient(90deg,#00ff66,#00ffff)] rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_#00ff66]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
