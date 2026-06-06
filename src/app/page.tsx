import Link from "next/link";
import { BadgeMedallion } from "@/components/badges/BadgeMedallion";
import { PenguinIcon, PenguinVariant } from "@/components/ui/PenguinIcon";
import {
  ArrowRight,
  BadgeCheck,
  Blocks,
  Compass,
  Flame,
  Globe,
  LayoutGrid,
  Sparkles,
  Swords,
  Trophy,
} from "lucide-react";

const featuredBadges = [
  {
    id: 1,
    name: "First Portal Step",
    rarity: "common",
    glow: "shadow-[0_0_24px_rgba(61,255,160,0.08)]",
    accent: "text-green",
  },
  {
    id: 6,
    name: "Ecosystem Explorer",
    rarity: "rare",
    glow: "shadow-[0_0_28px_rgba(96,200,255,0.12)]",
    accent: "text-[#60c8ff]",
  },
  {
    id: 7,
    name: "Abstract Native Crest",
    rarity: "legendary",
    isMaster: true,
    glow: "shadow-[0_0_30px_rgba(255,215,0,0.14)]",
    accent: "text-[#ffd700]",
  },
];

const quickLinks = [
  {
    href: "/gallery",
    label: "Badge Gallery",
    copy: "Browse the full collection, sort by rarity, and mint unlocked badges.",
    variant: "badge" as PenguinVariant,
    bgClass: "bg-[radial-gradient(circle_at_top_left,rgba(180,122,255,0.04),transparent_60%),linear-gradient(180deg,#0d1410_0%,#080c0a_100%)] border-[#b47aff]/10 hover:border-[#b47aff]/30 shadow-[0_0_15px_rgba(180,122,255,0.02)]",
    hoverText: "group-hover:text-[#b47aff]",
    iconColor: "text-[#b47aff] border-[#b47aff]/10 bg-[#b47aff]/5",
  },
  {
    href: "/quests",
    label: "Quest Board",
    copy: "Knock out dailies, ecosystem visits, quizzes, and streak milestones.",
    variant: "base" as PenguinVariant,
    bgClass: "bg-[radial-gradient(circle_at_top_left,rgba(61,255,160,0.04),transparent_60%),linear-gradient(180deg,#0d1410_0%,#080c0a_100%)] border-green/10 hover:border-green/30 shadow-[0_0_15px_rgba(61,255,160,0.02)]",
    hoverText: "group-hover:text-green",
    iconColor: "text-green border-green/10 bg-green/5",
  },
  {
    href: "/leaderboard",
    label: "Leaderboard",
    copy: "Track the collectors climbing by XP, streaks, and master crests.",
    variant: "streak" as PenguinVariant,
    bgClass: "bg-[radial-gradient(circle_at_top_left,rgba(255,215,0,0.03),transparent_60%),linear-gradient(180deg,#0d1410_0%,#080c0a_100%)] border-[#ffd700]/10 hover:border-[#ffd700]/25 shadow-[0_0_15px_rgba(255,215,0,0.02)]",
    hoverText: "group-hover:text-[#ffd700]",
    iconColor: "text-[#ffd700] border-[#ffd700]/10 bg-[#ffd700]/5",
  },
  {
    href: "/ecosystem",
    label: "Ecosystem",
    copy: "Jump into Abstract apps and route quest traffic through live projects.",
    variant: "visit" as PenguinVariant,
    bgClass: "bg-[radial-gradient(circle_at_top_left,rgba(96,200,255,0.04),transparent_60%),linear-gradient(180deg,#0d1410_0%,#080c0a_100%)] border-[#60c8ff]/10 hover:border-[#60c8ff]/30 shadow-[0_0_15px_rgba(96,200,255,0.02)]",
    hoverText: "group-hover:text-[#60c8ff]",
    iconColor: "text-[#60c8ff] border-[#60c8ff]/10 bg-[#60c8ff]/5",
  },
];

const valueProps = [
  {
    title: "Quest-first loop",
    copy: "Quests, unlocks, mints, and leaderboard movement all feed the same progression loop.",
    icon: Sparkles,
    border: "border-green/15 bg-green/[0.02] shadow-[inset_0_1px_0_rgba(61,255,160,0.05)]",
    hover: "hover:border-green/35 hover:bg-green/[0.06] hover:shadow-[inset_0_1px_0_rgba(61,255,160,0.08),0_10px_20px_rgba(0,0,0,0.2)]",
    iconStyle: "border-green/20 bg-green/10 text-green",
  },
  {
    title: "Public collector identity",
    copy: "Every badge you mint adds to a clean public wall you can actually share without apologizing for it.",
    icon: BadgeCheck,
    border: "border-[#60c8ff]/15 bg-[#60c8ff]/[0.02] shadow-[inset_0_1px_0_rgba(96,200,255,0.05)]",
    hover: "hover:border-[#60c8ff]/35 hover:bg-[#60c8ff]/0.06 hover:shadow-[inset_0_1px_0_rgba(96,200,255,0.08),0_10px_20px_rgba(0,0,0,0.2)]",
    iconStyle: "border-[#60c8ff]/20 bg-[#60c8ff]/10 text-[#60c8ff]",
  },
  {
    title: "Built around Abstract",
    copy: "The whole product is tuned for chain-native activity instead of bolting badges onto a generic app shell.",
    icon: Blocks,
    border: "border-[#b47aff]/15 bg-[#b47aff]/[0.02] shadow-[inset_0_1px_0_rgba(180,122,255,0.05)]",
    hover: "hover:border-[#b47aff]/35 hover:bg-[#b47aff]/0.06 hover:shadow-[inset_0_1px_0_rgba(180,122,255,0.08),0_10px_20px_rgba(0,0,0,0.2)]",
    iconStyle: "border-[#b47aff]/20 bg-[#b47aff]/10 text-[#b47aff]",
  },
];

const liveSurfaces = [
  {
    label: "Quests",
    copy: "Daily check-ins, ecosystem visits, streaks, and quizzes.",
    href: "/quests",
    variant: "base" as PenguinVariant,
    border: "border-green/15 bg-green/[0.02] shadow-[inset_0_1px_0_rgba(61,255,160,0.05)]",
    hover: "hover:border-green/35 hover:bg-green/[0.06]",
    iconStyle: "border-green/20 bg-green/10 text-green",
    hoverText: "group-hover:text-green",
  },
  {
    label: "Gallery",
    copy: "Mint-ready collection sorted by rarity and set progress.",
    href: "/gallery",
    variant: "badge" as PenguinVariant,
    border: "border-[#60c8ff]/15 bg-[#60c8ff]/[0.02] shadow-[inset_0_1px_0_rgba(96,200,255,0.05)]",
    hover: "hover:border-[#60c8ff]/35 hover:bg-[#60c8ff]/0.06",
    iconStyle: "border-[#60c8ff]/20 bg-[#60c8ff]/10 text-[#60c8ff]",
    hoverText: "group-hover:text-[#60c8ff]",
  },
  {
    label: "Ecosystem",
    copy: "Project discovery surface with referral-aware outbound routing.",
    href: "/ecosystem",
    variant: "visit" as PenguinVariant,
    border: "border-[#b47aff]/15 bg-[#b47aff]/[0.02] shadow-[inset_0_1px_0_rgba(180,122,255,0.05)]",
    hover: "hover:border-[#b47aff]/35 hover:bg-[#b47aff]/0.06",
    iconStyle: "border-[#b47aff]/20 bg-[#b47aff]/10 text-[#b47aff]",
    hoverText: "group-hover:text-[#b47aff]",
  },
  {
    label: "Leaderboard",
    copy: "XP, streak, badge, and crest race in one place.",
    href: "/leaderboard",
    variant: "streak" as PenguinVariant,
    border: "border-[#ffd700]/15 bg-[#ffd700]/[0.02] shadow-[inset_0_1px_0_rgba(255,215,0,0.05)]",
    hover: "hover:border-[#ffd700]/35 hover:bg-[#ffd700]/0.06",
    iconStyle: "border-[#ffd700]/20 bg-[#ffd700]/10 text-[#ffd700]",
    hoverText: "group-hover:text-[#ffd700]",
  },
];

export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-8">
      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-md border border-border/80 bg-[radial-gradient(circle_at_top_left,rgba(61,255,160,0.04),transparent_55%),linear-gradient(180deg,#0d1410_0%,#080c0a_100%)] p-8">
          <div className="mb-6 inline-flex items-center gap-2 rounded-sm border border-green/20 bg-green/10 px-3 py-1 text-[11px] font-mono uppercase tracking-[0.18em] text-green">
            Abstract Mainnet
          </div>

          <div className="max-w-2xl">
            <h1 className="mb-3 text-4xl font-bold tracking-tight text-[#e8f0e9] sm:text-5xl">
              Quest, collect, and flex your onchain progress.
            </h1>
            <p className="max-w-xl text-base leading-7 text-[#aeb8af] sm:text-lg">
              Abstract Quests turns daily activity into a clean badge chase:
              finish quests, unlock mints, stack XP, and build a public wall
              that actually looks worth sharing.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/quests"
              className="inline-flex items-center justify-center rounded-md bg-green px-5 py-3 text-sm font-bold text-[#061009] transition-colors hover:bg-[#58ffb0]"
            >
              Start questing
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/gallery"
              className="inline-flex items-center justify-center rounded-md border border-border-2 bg-card px-5 py-3 text-sm font-semibold text-[#e8f0e9] transition-colors hover:border-green/30 hover:text-green"
            >
              Open gallery
            </Link>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              { value: "42", label: "Launch badges", border: "border-green/15 bg-green/[0.02] shadow-[inset_0_1px_0_rgba(61,255,160,0.05)]", hover: "hover:border-green/35 hover:bg-green/[0.06]" },
              { value: "13", label: "Live quests", border: "border-[#b47aff]/15 bg-[#b47aff]/[0.02] shadow-[inset_0_1px_0_rgba(180,122,255,0.05)]", hover: "hover:border-[#b47aff]/35 hover:bg-[#b47aff]/[0.06]" },
              { value: "11124", label: "Chain ID", border: "border-[#ffd700]/15 bg-[#ffd700]/[0.02] shadow-[inset_0_1px_0_rgba(255,215,0,0.05)]", hover: "hover:border-[#ffd700]/35 hover:bg-[#ffd700]/[0.06]" },
            ].map((item) => (
              <div
                key={item.label}
                className={`rounded-md border p-4 transition-all duration-300 ${item.border} ${item.hover}`}
              >
                <div className="text-2xl font-bold text-[#e8f0e9]">
                  {item.value}
                </div>
                <div className="mt-1 text-xs text-[#8fa890]">{item.label}</div>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-3 lg:grid-cols-3">
            {valueProps.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className={`rounded-md border p-4 transition-all duration-300 ${item.border} ${item.hover}`}
                >
                  <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-md border ${item.iconStyle}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="text-sm font-semibold text-[#e8f0e9]">
                    {item.title}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#aeb8af]">
                    {item.copy}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-md border border-border/80 bg-[radial-gradient(circle_at_top_right,rgba(61,255,160,0.04),transparent_55%),linear-gradient(180deg,#0d1410_0%,#080c0a_100%)] p-8 shadow-xl relative overflow-hidden group">
          <div className="mb-5 flex items-center justify-between relative z-10">
            <div>
              <p className="text-xs font-mono uppercase tracking-[0.18em] text-[#8fa890] mb-1">
                Featured Badges
              </p>
              <h2 className="text-xl font-bold text-white">
                Rarity-first collection
              </h2>
            </div>
            <Link
              href="/gallery"
              className="text-sm font-semibold text-green transition-colors hover:text-[#58ffb0]"
            >
              View all
            </Link>
          </div>

          <div className="grid gap-4 relative z-10">
            {featuredBadges.map((badge) => {
              const rarityStyles: Record<string, { base: string; hover: string; badgeBg: string; textClass: string }> = {
                common: {
                  base: "bg-green/[0.02] border-green/15 shadow-[inset_0_1px_0_rgba(61,255,160,0.05)]",
                  hover: "hover:bg-green/[0.06] hover:border-green/35 hover:shadow-[inset_0_1px_0_rgba(61,255,160,0.08),0_0_20px_rgba(61,255,160,0.05)]",
                  badgeBg: "border-green/20 bg-green/10",
                  textClass: "text-green",
                },
                rare: {
                  base: "bg-[#60c8ff]/[0.02] border-[#60c8ff]/15 shadow-[inset_0_1px_0_rgba(96,200,255,0.05)]",
                  hover: "hover:bg-[#60c8ff]/[0.06] hover:border-[#60c8ff]/35 hover:shadow-[inset_0_1px_0_rgba(96,200,255,0.08),0_0_20px_rgba(96,200,255,0.05)]",
                  badgeBg: "border-[#60c8ff]/20 bg-[#60c8ff]/10",
                  textClass: "text-[#60c8ff]",
                },
                legendary: {
                  base: "bg-[#ffd700]/[0.02] border-[#ffd700]/15 shadow-[inset_0_1px_0_rgba(255,215,0,0.05)]",
                  hover: "hover:bg-[#ffd700]/[0.06] hover:border-[#ffd700]/35 hover:shadow-[inset_0_1px_0_rgba(255,215,0,0.08),0_0_25px_rgba(255,215,0,0.06)]",
                  badgeBg: "border-[#ffd700]/20 bg-[#ffd700]/10",
                  textClass: "text-[#ffd700]",
                },
              };

              const style = rarityStyles[badge.rarity] || rarityStyles.common;

              return (
                <div
                  key={badge.name}
                  className={`group/badge rounded-xl border p-4 transition-all duration-300 ${style.base} ${style.hover}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`flex h-16 w-16 items-center justify-center rounded-xl border shadow-inner group-hover/badge:scale-105 transition-transform duration-300 shrink-0 ${style.badgeBg}`}>
                        <BadgeMedallion
                          badge={{
                            id: badge.id,
                            name: badge.name,
                            rarity: badge.rarity,
                            isMaster: badge.isMaster,
                          }}
                          size="sm"
                        />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white transition-colors group-hover/badge:text-green">
                          {badge.name}
                        </div>
                        <div className={`mt-1.5 text-[10px] font-extrabold uppercase tracking-widest ${style.textClass}`}>
                          {badge.rarity}
                        </div>
                      </div>
                    </div>
                    <span className={`rounded-full border px-2.5 py-1 text-[9px] font-mono tracking-wider uppercase ${badge.rarity === 'common' ? 'border-green/25 bg-green/5 text-green/50' : badge.rarity === 'rare' ? 'border-[#60c8ff]/25 bg-[#60c8ff]/5 text-[#60c8ff]/50' : 'border-[#ffd700]/25 bg-[#ffd700]/5 text-[#ffd700]/50'}`}>
                      ERC-1155
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        {quickLinks.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`group rounded-md border p-5 transition-all duration-300 hover:-translate-y-1 ${item.bgClass}`}
          >
            <div className={`mb-3 flex h-11 w-11 items-center justify-center rounded-lg border transition-all duration-300 ${item.iconColor}`}>
              <PenguinIcon variant={item.variant} className="h-5.5 w-5.5" />
            </div>
            <h3 className={`text-lg font-bold text-white transition-colors ${item.hoverText}`}>
              {item.label}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[#aeb8af] min-h-[48px]">{item.copy}</p>
            <div className={`mt-4 inline-flex items-center text-sm font-bold text-white/50 transition-colors ${item.hoverText}`}>
              Open
              <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-md border border-border/80 bg-[radial-gradient(circle_at_top_left,rgba(61,255,160,0.04),transparent_55%),linear-gradient(180deg,#0d1410_0%,#080c0a_100%)] p-8 shadow-xl relative overflow-hidden">
          <p className="text-xs font-mono uppercase tracking-[0.18em] text-[#8fa890] mb-1">
            Flow
          </p>
          <h2 className="text-2xl font-bold text-white mb-6">
            The loop is simple and addictive.
          </h2>

          <div className="space-y-3.5">
            {[
              { text: "Complete a quest or quiz.", style: "bg-green/[0.02] border-green/15 hover:border-green/35 hover:bg-green/[0.06] shadow-[inset_0_1px_0_rgba(61,255,160,0.05)]", circle: "from-[#3dffa0] to-[#00ffff] shadow-[0_0_12px_rgba(61,255,160,0.25)]" },
              { text: "Unlock the matching badge.", style: "bg-[#60c8ff]/[0.02] border-[#60c8ff]/15 hover:border-[#60c8ff]/35 hover:bg-[#60c8ff]/0.06 shadow-[inset_0_1px_0_rgba(96,200,255,0.05)]", circle: "from-[#60c8ff] to-[#00abff] shadow-[0_0_12px_rgba(96,200,255,0.25)]" },
              { text: "Mint it on Abstract and gain XP.", style: "bg-[#b47aff]/[0.02] border-[#b47aff]/15 hover:border-[#b47aff]/35 hover:bg-[#b47aff]/0.06 shadow-[inset_0_1px_0_rgba(180,122,255,0.05)]", circle: "from-[#b47aff] to-[#a855f7] shadow-[0_0_12px_rgba(180,122,255,0.25)]" },
              { text: "Climb the leaderboard and fill your public wall.", style: "bg-[#ffd700]/[0.02] border-[#ffd700]/15 hover:border-[#ffd700]/35 hover:bg-[#ffd700]/0.06 shadow-[inset_0_1px_0_rgba(255,215,0,0.05)]", circle: "from-[#ffd700] to-[#f59e0b] shadow-[0_0_12px_rgba(255,215,0,0.25)]" },
            ].map((step, index) => (
              <div
                key={step.text}
                className={`flex items-center gap-4 rounded-xl border p-4 transition-all duration-300 ${step.style}`}
              >
                <div className={`flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br text-[#080c0a] text-sm font-black shrink-0 ${step.circle}`}>
                  {index + 1}
                </div>
                <p className="text-sm font-medium text-white/80">{step.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-md border border-border/80 bg-[radial-gradient(circle_at_top_right,rgba(96,200,255,0.04),transparent_55%),linear-gradient(180deg,#0d1410_0%,#080c0a_100%)] p-8 shadow-xl relative overflow-hidden">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <p className="text-xs font-mono uppercase tracking-[0.18em] text-[#8fa890] mb-1">
                Best Next Step
              </p>
              <h2 className="text-2xl font-bold text-white">
                Open quests first, then mint from the gallery.
              </h2>
            </div>
            <div className="rounded-full border border-green/30 bg-green/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-green shadow-[0_0_10px_rgba(61,255,160,0.1)] shrink-0">
              Recommended
            </div>
          </div>

          <div className="grid gap-3.5 sm:grid-cols-2">
            <Link
              href="/quests"
              className="group rounded-xl border border-green/15 bg-green/[0.02] p-5 transition-all duration-300 hover:bg-green/[0.05] hover:border-green/30 shadow-[inset_0_1px_0_rgba(61,255,160,0.05)]"
            >
              <div className="text-sm font-bold text-green flex items-center gap-1.5 transition-colors group-hover:text-[#58ffb0]">
                Quest Board
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
              <p className="mt-2 text-xs leading-relaxed text-white/70">
                Daily check-ins, visit quests, quiz runs, and streak progress
                all start here.
              </p>
            </Link>
            <Link
              href="/dashboard"
              className="group rounded-xl border border-[#60c8ff]/15 bg-[#60c8ff]/[0.02] p-5 transition-all duration-300 hover:bg-[#60c8ff]/0.06 hover:border-[#60c8ff]/35 shadow-[inset_0_1px_0_rgba(96,200,255,0.05)]"
            >
              <div className="text-sm font-bold text-[#60c8ff] flex items-center gap-1.5 transition-colors group-hover:text-[#58d0ff]">
                Collector Dashboard
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
              <p className="mt-2 text-xs leading-relaxed text-[#aeb8af]">
                Once connected, this becomes the fastest way to see unlocked
                mints and progress.
              </p>
            </Link>
          </div>

          <div className="mt-6 grid gap-3">
            {liveSurfaces.map((item) => {
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`group flex items-start gap-4 rounded-xl border p-4 transition-all duration-300 ${item.border} ${item.hover}`}
                >
                  <div className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border transition-all duration-300 group-hover:scale-105 ${item.iconStyle}`}>
                    <PenguinIcon variant={item.variant} className="h-5.5 w-5.5" />
                  </div>
                  <div className="min-w-0">
                    <div className={`text-sm font-bold text-white transition-colors ${item.hoverText}`}>
                       {item.label}
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-[#aeb8af]">
                      {item.copy}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
