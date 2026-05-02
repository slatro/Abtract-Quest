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
      <div className="max-w-7xl mx-auto h-[72px] px-6 py-3 relative flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-sm text-[#e8f0e9] shrink-0">
          <span className="w-8 h-8 rounded-lg bg-card border border-border-2 flex items-center justify-center text-sm">⬡</span>
          Portal Badge Rush
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-green-dim text-green border border-green/20 ml-1">
            Abstract
          </span>
        </Link>

        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-1.5 bg-[#0f1416]/90 border border-border rounded-full p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
          {items.map(({ href, label }) => {
            const active = pathname?.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                  active
                    ? "bg-green/20 text-green"
                    : "text-[#aeb8af] hover:text-[#e8f0e9] hover:bg-white/5"
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
    </nav>
  );
}
