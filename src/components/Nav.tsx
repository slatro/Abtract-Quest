"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectButton } from "./wallet/ConnectButton";
import { UserLevelBar } from "./wallet/UserLevelBar";
import { NotificationBell } from "./notifications/NotificationBell";

const PenguinDashboard = ({ active }: { active: boolean }) => (
  <svg width="21" height="18" viewBox="0 0 28 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={`transition-all duration-300 ${active ? "text-[#3dffa0]" : "text-[#7a857e]"}`}>
    <path d="M12 2C8 2 5 6 5 12v5c0 3 3 5 7 5s7-2 7-5v-5c0-6-3-10-7-10z" />
    <path d="M8 12c0-3 8-3 8 0v3c0 2-2 3-4 3s-4-1-4-3z" />
    <path d="M9 8v.01" /><path d="M15 8v.01" /><path d="M11 10l1 1 1-1" />
    <path d="M5 12l-2 3" /><path d="M19 12l2 -2" />
    <path d="M9 22l-1 2" /><path d="M15 22l1 2" />
    <g stroke="#3b82f6" transform="translate(3, -1)">
      <path d="M18 9v-2M20 9v-4M22 9v-1" />
    </g>
  </svg>
);

const PenguinGallery = ({ active }: { active: boolean }) => (
  <svg width="21" height="18" viewBox="0 0 28 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={`transition-all duration-300 ${active ? "text-[#3dffa0]" : "text-[#7a857e]"}`}>
    <path d="M12 2C8 2 5 6 5 12v5c0 3 3 5 7 5s7-2 7-5v-5c0-6-3-10-7-10z" />
    <path d="M8 12c0-3 8-3 8 0v3c0 2-2 3-4 3s-4-1-4-3z" />
    <path d="M9 8v.01" /><path d="M15 8v.01" /><path d="M11 10l1 1 1-1" />
    <path d="M5 12l-2 3" /><path d="M19 12l2 -2" />
    <path d="M9 22l-1 2" /><path d="M15 22l1 2" />
    <g stroke="#a855f7" transform="translate(4, -1)">
      <rect x="17" y="5" width="6" height="4" rx="0.5" />
      <path d="M18 8l1-1 2 2" />
    </g>
  </svg>
);

const PenguinQuests = ({ active }: { active: boolean }) => (
  <svg width="21" height="18" viewBox="0 0 28 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={`transition-all duration-300 ${active ? "text-[#3dffa0]" : "text-[#7a857e]"}`}>
    <path d="M12 2C8 2 5 6 5 12v5c0 3 3 5 7 5s7-2 7-5v-5c0-6-3-10-7-10z" />
    <path d="M8 12c0-3 8-3 8 0v3c0 2-2 3-4 3s-4-1-4-3z" />
    <path d="M9 8v.01" /><path d="M15 8v.01" /><path d="M11 10l1 1 1-1" />
    <path d="M5 12l-2 3" /><path d="M19 12l2 -2" />
    <path d="M9 22l-1 2" /><path d="M15 22l1 2" />
    <g stroke="#eab308" transform="translate(2, -1)">
      <path d="M22 5l-2 2h2l-1.5 2.5" />
    </g>
  </svg>
);

const PenguinEcosystem = ({ active }: { active: boolean }) => (
  <svg width="21" height="18" viewBox="0 0 28 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={`transition-all duration-300 ${active ? "text-[#3dffa0]" : "text-[#7a857e]"}`}>
    <path d="M12 2C8 2 5 6 5 12v5c0 3 3 5 7 5s7-2 7-5v-5c0-6-3-10-7-10z" />
    <path d="M8 12c0-3 8-3 8 0v3c0 2-2 3-4 3s-4-1-4-3z" />
    <path d="M9 8v.01" /><path d="M15 8v.01" /><path d="M11 10l1 1 1-1" />
    <path d="M5 12l-2 3" /><path d="M19 12l2 -2" />
    <path d="M9 22l-1 2" /><path d="M15 22l1 2" />
    <g stroke="#06b6d4" transform="translate(3, -1)">
      <circle cx="21" cy="7" r="2.5" />
      <path d="M18.5 7h5M21 4.5v5" />
    </g>
  </svg>
);

const PenguinLeaderboard = ({ active }: { active: boolean }) => (
  <svg width="21" height="18" viewBox="0 0 28 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={`transition-all duration-300 ${active ? "text-[#3dffa0]" : "text-[#7a857e]"}`}>
    <path d="M12 2C8 2 5 6 5 12v5c0 3 3 5 7 5s7-2 7-5v-5c0-6-3-10-7-10z" />
    <path d="M8 12c0-3 8-3 8 0v3c0 2-2 3-4 3s-4-1-4-3z" />
    <path d="M9 8v.01" /><path d="M15 8v.01" /><path d="M11 10l1 1 1-1" />
    <path d="M5 12l-2 3" /><path d="M19 12l2 -2" />
    <path d="M9 22l-1 2" /><path d="M15 22l1 2" />
    <g stroke="#f59e0b" transform="translate(3, -1)">
      <polygon points="21,4.5 21.8,6 23.5,6 22.2,7.2 22.7,8.9 21,8 19.3,8.9 19.8,7.2 18.5,6 20.2,6" />
    </g>
  </svg>
);

const PenguinStats = ({ active }: { active: boolean }) => (
  <svg width="21" height="18" viewBox="0 0 28 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={`transition-all duration-300 ${active ? "text-[#3dffa0]" : "text-[#7a857e]"}`}>
    <path d="M12 2C8 2 5 6 5 12v5c0 3 3 5 7 5s7-2 7-5v-5c0-6-3-10-7-10z" />
    <path d="M8 12c0-3 8-3 8 0v3c0 2-2 3-4 3s-4-1-4-3z" />
    <path d="M9 8v.01" /><path d="M15 8v.01" /><path d="M11 10l1 1 1-1" />
    <path d="M5 12l-2 3" /><path d="M19 12l2 -2" />
    <path d="M9 22l-1 2" /><path d="M15 22l1 2" />
    <g stroke="#10b981" transform="translate(3, -1)">
      <path d="M18 9v-3M20 9v-5M22 9v-1" />
    </g>
  </svg>
);

export function Nav() {
  const pathname = usePathname();
  const items = [
    { href: "/dashboard", label: "Dashboard", Icon: PenguinDashboard, color: "#3b82f6" },
    { href: "/gallery", label: "Gallery", Icon: PenguinGallery, color: "#a855f7" },
    { href: "/quests", label: "Quests", Icon: PenguinQuests, color: "#eab308" },
    { href: "/ecosystem", label: "Ecosystem", Icon: PenguinEcosystem, color: "#06b6d4" },
    { href: "/leaderboard", label: "Leaderboard", Icon: PenguinLeaderboard, color: "#f59e0b" },
    { href: "/stats", label: "Stats & Tools", Icon: PenguinStats, color: "#10b981" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#0a0f16]/90 backdrop-blur-xl border-b border-white/[0.08] mb-8">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 flex flex-col">
        {/* Top Row: Logo & Wallet */}
        <div className="flex items-center justify-between h-16 mt-2">
          <Link href="/" prefetch={false} className="flex items-center gap-3.5 font-bold text-sm text-[#e8f0e9] shrink min-w-0 group translate-y-5 -translate-x-4">
            <svg width="36" height="36" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform duration-700 ease-out group-hover:rotate-90 group-hover:scale-110">
              <path d="M20 4L34 12V28L20 36L6 28V12L20 4Z" stroke="url(#logo-grad-1)" strokeWidth="2.5" strokeLinejoin="round" fill="none"/>
              <path d="M20 12L27 16V24L20 28L13 24V16L20 12Z" stroke="url(#logo-grad-1)" strokeWidth="1.8" strokeLinejoin="round" fill="none"/>
              <defs>
                <linearGradient id="logo-grad-1" x1="6" y1="4" x2="34" y2="36" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#00ffff"/>
                  <stop offset="0.5" stopColor="#a855f7"/>
                  <stop offset="1" stopColor="#00ff66"/>
                </linearGradient>
              </defs>
            </svg>
            <div className="flex flex-col justify-center">
              <span className="truncate text-[22px] tracking-wide font-extrabold text-white leading-none">
                ABSTRACT <span className="font-light">QUESTS</span>
              </span>
            </div>
          </Link>
          <div className="flex items-center justify-end w-[400px]">
            <NotificationBell />
            <UserLevelBar />
            <ConnectButton />
          </div>
        </div>

        {/* Bottom Row: Navigation */}
        <div className="flex items-center justify-center gap-4 mt-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {items.map(({ href, label, Icon, color }) => {
            const active = pathname?.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                prefetch={false}
                className={`relative flex items-center justify-center gap-3 w-[150px] py-3.5 text-[14px] font-sans font-bold transition-all duration-300 rounded-t-xl ${
                  active
                    ? "text-white bg-gradient-to-b from-white/[0.08] to-transparent shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                    : "text-[#8a99a8] hover:text-[#b0c0d0] hover:bg-white/[0.02]"
                }`}
              >
                <div style={{ color: active ? color : "inherit", transition: "color 0.3s ease" }}>
                  <Icon active={active} />
                </div>
                
                {label}

                {/* Glowing Bottom Pill for Active State */}
                {active && (
                  <div 
                    className="absolute bottom-0 left-0 right-0 h-[3px]"
                    style={{
                      WebkitMaskImage: "linear-gradient(90deg, transparent, black 15%, black 85%, transparent)",
                      maskImage: "linear-gradient(90deg, transparent, black 15%, black 85%, transparent)"
                    }}
                  >
                    <div 
                      className="absolute inset-0"
                      style={{ 
                        backgroundColor: color,
                        boxShadow: `0 0 12px ${color}, 0 0 24px ${color}`
                      }}
                    />
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
