"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectButton } from "./wallet/ConnectButton";

export function Nav() {
  const pathname = usePathname();
  const items = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/gallery", label: "Gallery" },
    { href: "/quests", label: "Quests" },
    { href: "/ecosystem", label: "Ecosystem" },
    { href: "/leaderboard", label: "Leaderboard" },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-bg/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 relative">
        <div className="min-h-[52px] md:h-[72px] relative flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-3 font-bold text-sm text-[#e8f0e9] shrink min-w-0">
            <span className="w-10 h-10 rounded-xl surface-panel-soft flex items-center justify-center text-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
              ⬡
            </span>
            <span className="truncate text-[15px]">Abstract Quests</span>
            <span className="hidden sm:inline text-[10px] font-mono px-2.5 py-1 rounded-full chip-green ml-1">
              Quest Arcade
            </span>
          </Link>

          <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-1.5 surface-panel rounded-full p-1.5">
            {items.map(({ href, label }) => {
              const active = pathname?.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                    active
                      ? "surface-panel-soft text-[#eff7f0] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                      : "text-[#aeb8af] hover:text-[#e8f0e9] hover:bg-white/[0.035]"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </div>

          <div className="shrink-0">
            <ConnectButton />
          </div>
        </div>

        <div className="md:hidden mt-3 -mx-1 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex min-w-max items-center gap-1.5 surface-panel rounded-full p-1.5">
            {items.map(({ href, label }) => {
              const active = pathname?.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                    active
                      ? "surface-panel-soft text-[#eff7f0]"
                      : "text-[#aeb8af] hover:text-[#e8f0e9] hover:bg-white/[0.035]"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
