"use client";

import Image from "next/image";
import { Icon, addCollection } from "@iconify/react/offline";
import { icons as gameIcons } from "@iconify-json/game-icons";

addCollection(gameIcons);

type BadgeVisual = {
  id: number;
  name: string;
  setName?: string;
  rarity: string;
  isMaster?: boolean;
};

interface Props {
  badge: BadgeVisual;
  size?: "sm" | "md" | "lg" | "xl";
  framed?: boolean;
}

const iconById: Record<number, string> = {
  1: "game-icons:portal",
  2: "game-icons:speaker-off",
  3: "game-icons:vote",
  4: "game-icons:clockwise-rotation",
  5: "game-icons:gas-pump",
  6: "game-icons:radar-sweep",
  7: "game-icons:crown",
  8: "game-icons:medal",
  9: "game-icons:theater-curtains",
  10: "game-icons:ghost-ally",
  11: "game-icons:chart",
  12: "game-icons:wood-frame",
  13: "game-icons:diamond-ring",
  14: "game-icons:column-vase",
  15: "game-icons:checked-shield",
  16: "game-icons:carnival-mask",
  17: "game-icons:reticule",
  18: "game-icons:checklist",
  19: "game-icons:wave-surfer",
  20: "game-icons:microscope-lens",
  21: "game-icons:gear-hammer",
  22: "game-icons:laurels-trophy",
  23: "game-icons:fire-silhouette",
  24: "game-icons:click",
  25: "game-icons:broom",
  26: "game-icons:moon-orbit",
  27: "game-icons:hidden",
  28: "game-icons:vortex",
  29: "game-icons:penguin",
  30: "game-icons:sofa",
  31: "game-icons:leaf-swirl",
  32: "game-icons:smartphone",
  33: "game-icons:shaking-hands",
  34: "game-icons:modern-city",
  35: "game-icons:radio-tower",
  36: "game-icons:book-cover",
  37: "game-icons:miner",
  38: "game-icons:scroll-unfurled",
  39: "game-icons:bullseye",
  40: "game-icons:spyglass",
  41: "game-icons:graduate-cap",
  42: "game-icons:greek-temple",
};

const badgeImageById: Record<number, string> = {
  1: "/badge-art/first-portal-step.png",
  2: "/badge-art/no-popup-pioneer.png",
  3: "/badge-art/app-voter.png",
  4: "/badge-art/daily-looper.png",
  5: "/badge-art/gasless-tourist.png",
  6: "/badge-art/ecosystem-explorer.png",
  7: "/badge-art/abstract-native-crest.png",
  8: "/badge-art/mint-day-veteran.png",
  9: "/badge-art/reveal-survivor.png",
  10: "/badge-art/gas-war-ghost.png",
  11: "/badge-art/floor-watcher.png",
  12: "/badge-art/jpeg-believer.png",
  13: "/badge-art/diamond-hands-relic.png",
  14: "/badge-art/culture-survivor-crest.png",
  15: "/badge-art/rug-detector.png",
  16: "/badge-art/trait-goblin.png",
  17: "/badge-art/metadata-sniper.png",
  18: "/badge-art/whitelist-hunter.png",
  19: "/badge-art/liquidity-tourist.png",
  20: "/badge-art/pfp-archaeologist.png",
  21: "/badge-art/utility-goblin-crest.png",
  22: "/badge-art/badge-goblin.png",
  23: "/badge-art/streak-addict.png",
  24: "/badge-art/one-tap-enjoyer.png",
  25: "/badge-art/quest-sweeper.png",
  26: "/badge-art/late-night-grinder.png",
  27: "/badge-art/hidden-route-finder.png",
  28: "/badge-art/portal-maniac-crest.png",
  29: "/badge-art/penguin-energy.png",
  30: "/badge-art/cozy-holder.png",
  31: "/badge-art/green-portal-energy.png",
  32: "/badge-art/consumer-crypto-believer.png",
  33: "/badge-art/portal-petter.png",
  34: "/badge-art/mini-empire-builder.png",
  35: "/badge-art/culture-signal-crest.png",
  36: "/badge-art/quiz-rookie.png",
  37: "/badge-art/knowledge-miner.png",
  38: "/badge-art/lore-collector.png",
  39: "/badge-art/perfect-score.png",
  40: "/badge-art/ecosystem-analyst.png",
  41: "/badge-art/portal-professor.png",
  42: "/badge-art/portal-scholar-crest.png",
};

const sizeStyles = {
  sm: {
    wrap: "h-16 w-16 rounded-[18px]",
    imagePad: "p-1.5",
    back: "text-[52px]",
    front: "text-[28px]",
  },
  md: {
    wrap: "h-24 w-24 rounded-[24px]",
    imagePad: "p-2",
    back: "text-[78px]",
    front: "text-[42px]",
  },
  lg: {
    wrap: "h-36 w-36 rounded-[28px]",
    imagePad: "p-3",
    back: "text-[118px]",
    front: "text-[64px]",
  },
  xl: {
    wrap: "h-44 w-44 rounded-[34px]",
    imagePad: "p-4",
    back: "text-[146px]",
    front: "text-[78px]",
  },
} as const;

const rarityThemes: Record<
  string,
  {
    background: string;
    surface: string;
    icon: string;
    iconSoft: string;
    glow: string;
    border: string;
  }
> = {
  common: {
    background:
      "bg-[radial-gradient(circle_at_18%_18%,rgba(255,255,255,0.08),transparent_26%),linear-gradient(145deg,#121814_0%,#19201b_50%,#222a24_100%)]",
    surface:
      "bg-[radial-gradient(circle_at_50%_38%,rgba(255,255,255,0.08),transparent_42%),linear-gradient(180deg,rgba(245,249,246,0.09),rgba(214,223,216,0.03))]",
    icon: "#f0f6f1",
    iconSoft: "rgba(208,221,212,0.26)",
    glow: "rgba(208,221,212,0.18)",
    border: "border-white/8",
  },
  uncommon: {
    background:
      "bg-[radial-gradient(circle_at_18%_18%,rgba(61,255,160,0.18),transparent_28%),linear-gradient(145deg,#0f1c15_0%,#163424_52%,#1f4b35_100%)]",
    surface:
      "bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.12),transparent_42%),linear-gradient(180deg,rgba(221,255,236,0.12),rgba(61,255,160,0.04))]",
    icon: "#eefff5",
    iconSoft: "rgba(118,255,191,0.3)",
    glow: "rgba(61,255,160,0.22)",
    border: "border-green/15",
  },
  rare: {
    background:
      "bg-[radial-gradient(circle_at_18%_18%,rgba(96,200,255,0.2),transparent_28%),linear-gradient(145deg,#111824_0%,#19324a_52%,#214a67_100%)]",
    surface:
      "bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.12),transparent_42%),linear-gradient(180deg,rgba(234,247,255,0.12),rgba(96,200,255,0.05))]",
    icon: "#f2fbff",
    iconSoft: "rgba(140,220,255,0.32)",
    glow: "rgba(96,200,255,0.24)",
    border: "border-sky-300/15",
  },
  epic: {
    background:
      "bg-[radial-gradient(circle_at_18%_18%,rgba(180,122,255,0.2),transparent_28%),linear-gradient(145deg,#171225_0%,#2d2147_52%,#433067_100%)]",
    surface:
      "bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.11),transparent_42%),linear-gradient(180deg,rgba(247,240,255,0.12),rgba(180,122,255,0.05))]",
    icon: "#fbf6ff",
    iconSoft: "rgba(213,175,255,0.3)",
    glow: "rgba(180,122,255,0.24)",
    border: "border-purple-300/15",
  },
  legendary: {
    background:
      "bg-[radial-gradient(circle_at_18%_18%,rgba(255,215,0,0.24),transparent_28%),linear-gradient(145deg,#1b140b_0%,#433015_52%,#6c4a13_100%)]",
    surface:
      "bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.12),transparent_42%),linear-gradient(180deg,rgba(255,248,224,0.12),rgba(255,215,0,0.05))]",
    icon: "#fff8df",
    iconSoft: "rgba(255,226,126,0.34)",
    glow: "rgba(255,215,0,0.26)",
    border: "border-yellow-300/20",
  },
};

export function BadgeMedallion({ badge, size = "md", framed = false }: Props) {
  const theme = rarityThemes[badge.rarity] ?? rarityThemes.common;
  const icon = iconById[badge.id] ?? "game-icons:seal-emblem";
  const imageSrc = badgeImageById[badge.id];
  const metrics = sizeStyles[size];

  if (imageSrc) {
    return (
      <div
        className={`relative overflow-hidden ${metrics.wrap} ${
          framed
            ? `${theme.background} ${theme.border} border shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]`
            : ""
        }`}
      >
        {framed && (
          <div className="absolute inset-0 opacity-80">
            <div
              className="absolute left-[8%] top-[8%] h-[52%] w-[52%] rounded-full blur-2xl"
              style={{ backgroundColor: theme.glow }}
            />
            <div
              className="absolute right-[4%] bottom-[6%] h-[44%] w-[44%] rounded-full blur-2xl"
              style={{ backgroundColor: theme.glow }}
            />
          </div>
        )}
        {framed && <div className="absolute inset-[8%] rounded-[inherit] border border-white/6" />}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`relative aspect-square w-[96%] ${metrics.imagePad}`}>
            <Image
              src={imageSrc}
              alt={badge.name}
              fill
              sizes="(max-width: 768px) 160px, 240px"
              className="object-contain drop-shadow-[0_16px_30px_rgba(0,0,0,0.34)]"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden ${metrics.wrap} ${theme.background} ${
        framed ? `${theme.border} border shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]` : ""
      }`}
    >
      <div className="absolute inset-0 opacity-70">
        <div
          className="absolute -left-[12%] top-[6%] h-[56%] w-[56%] rounded-full blur-2xl"
          style={{ backgroundColor: theme.glow }}
        />
        <div
          className="absolute right-[6%] bottom-[4%] h-[38%] w-[38%] rounded-full blur-xl"
          style={{ backgroundColor: theme.glow }}
        />
      </div>

      <div className="absolute inset-[8%] rounded-[inherit] border border-white/6" />

      <div className="absolute inset-[10%] flex items-center justify-center rounded-[inherit]">
        <div
          className={`absolute inset-[12%] rounded-[inherit] ${theme.surface}`}
        />

        <div
          className={`absolute ${metrics.back} translate-x-[16%] -translate-y-[10%] rotate-[-16deg] opacity-90`}
          style={{ color: theme.iconSoft, filter: "blur(0.2px)" }}
        >
          <Icon icon={icon} />
        </div>

        <div
          className={`relative ${metrics.front} -translate-x-[8%] translate-y-[6%] drop-shadow-[0_12px_24px_rgba(0,0,0,0.32)]`}
          style={{ color: theme.icon }}
        >
          <Icon icon={icon} />
        </div>
      </div>
    </div>
  );
}
