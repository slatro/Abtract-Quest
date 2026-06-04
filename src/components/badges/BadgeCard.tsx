import { Badge } from "@/types";
import { BadgeMedallion } from "./BadgeMedallion";

const rarityStyles: Record<string, string> = {
  common:
    "border-white/8 bg-[linear-gradient(180deg,#121313_0%,#0b0c0c_100%)] hover:shadow-[0_18px_40px_rgba(0,0,0,0.24)]",
  uncommon:
    "border-green/12 bg-[linear-gradient(180deg,#111513_0%,#0b0d0c_100%)] hover:shadow-[0_18px_40px_rgba(61,255,160,0.1)]",
  rare:
    "border-blue-300/12 bg-[linear-gradient(180deg,#11141a_0%,#0b0d11_100%)] hover:shadow-[0_18px_42px_rgba(96,200,255,0.12)]",
  epic:
    "border-purple-300/12 bg-[linear-gradient(180deg,#15121b_0%,#0c0b10_100%)] hover:shadow-[0_18px_42px_rgba(180,122,255,0.14)]",
  legendary:
    "border-yellow-300/14 bg-[linear-gradient(180deg,#18150f_0%,#0d0c0a_100%)] hover:shadow-[0_18px_44px_rgba(255,215,0,0.16)]",
};

const rarityLabelStyles: Record<string, string> = {
  common: "chip-muted",
  uncommon: "chip-green",
  rare: "border border-blue-300/15 bg-blue-300/10 text-blue-200",
  epic: "border border-purple-300/15 bg-purple-300/10 text-purple-200",
  legendary: "chip-gold",
};

const rarityGlowStyles: Record<string, string> = {
  common: "from-white/[0.035] via-transparent to-transparent",
  uncommon: "from-green/10 via-transparent to-transparent",
  rare: "from-blue-300/12 via-transparent to-transparent",
  epic: "from-purple-300/12 via-transparent to-transparent",
  legendary: "from-yellow-300/12 via-transparent to-transparent",
};

const rarityHeroStyles: Record<string, string> = {
  common:
    "bg-[radial-gradient(circle_at_50%_18%,rgba(61,255,160,0.11),transparent_34%),radial-gradient(circle_at_20%_82%,rgba(210,255,226,0.05),transparent_28%),linear-gradient(180deg,#141a16_0%,#0f1411_100%)]",
  uncommon:
    "bg-[radial-gradient(circle_at_50%_18%,rgba(61,255,160,0.16),transparent_34%),radial-gradient(circle_at_22%_80%,rgba(181,255,214,0.07),transparent_28%),linear-gradient(180deg,#101912_0%,#0d1310_100%)]",
  rare:
    "bg-[radial-gradient(circle_at_50%_18%,rgba(96,200,255,0.18),transparent_34%),radial-gradient(circle_at_22%_80%,rgba(182,232,255,0.07),transparent_28%),linear-gradient(180deg,#111924_0%,#0d1218_100%)]",
  epic:
    "bg-[radial-gradient(circle_at_50%_18%,rgba(180,122,255,0.18),transparent_34%),radial-gradient(circle_at_22%_80%,rgba(227,198,255,0.07),transparent_28%),linear-gradient(180deg,#161320_0%,#100d15_100%)]",
  legendary:
    "bg-[radial-gradient(circle_at_50%_18%,rgba(255,215,0,0.18),transparent_34%),radial-gradient(circle_at_22%_80%,rgba(255,238,166,0.07),transparent_28%),linear-gradient(180deg,#1b170e_0%,#13100c_100%)]",
};

interface Props {
  badge: Badge;
  onClick: (badge: Badge) => void;
}

export function BadgeCard({ badge, onClick }: Props) {
  const isLocked = !badge.owned && !badge.unlocked;
  const statusLabel = badge.owned
    ? "Owned"
    : badge.unlocked
      ? "Mintable"
      : "Locked";

  return (
    <div
      onClick={() => onClick(badge)}
      className={`
        relative mx-auto w-full max-w-[198px] overflow-hidden rounded-[20px] border p-3 cursor-pointer transition-all duration-200
        hover:-translate-y-0.5 ${rarityStyles[badge.rarity]}
        ${badge.owned ? "opacity-100" : ""}
        ${isLocked ? "opacity-50" : ""}
      `}
    >
      <div className={`pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b ${rarityGlowStyles[badge.rarity]}`} />

      <div className="mb-3 flex items-center justify-between gap-3">
        <span className={`inline-flex text-[10px] font-semibold px-2.5 py-1 rounded-full ${rarityLabelStyles[badge.rarity]}`}>
          {badge.rarity.toUpperCase()}
        </span>
        <span className="text-[10px] font-mono text-[#8f9992]">
          {badge.price === "free" ? "FREE" : badge.price}
        </span>
      </div>

      <div className="relative mb-3 mx-auto h-[148px] w-[148px]">
        <div className={`relative h-full w-full rounded-[14px] overflow-hidden ${rarityHeroStyles[badge.rarity]}`}>
          <div className="absolute inset-0 flex items-center justify-center p-2">
            <BadgeMedallion badge={badge} size="lg" framed={false} />
          </div>
        </div>

        <div className="absolute right-0 top-0 z-10 translate-x-[18%] flex items-center gap-2">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold backdrop-blur-md ${
              badge.owned
                ? "bg-green text-[#061009]"
                : badge.unlocked
                  ? "bg-white/10 text-white/85"
                  : "bg-black/35 text-white/58"
            }`}
          >
            {statusLabel}
          </span>
        </div>
      </div>

      <div className="space-y-1">
        <div className="truncate text-[13px] leading-tight font-bold tracking-tight text-[#eef4f0]">
          {badge.name}
        </div>
        <div className="truncate text-[12px] text-[#88928b]">{badge.setName}</div>
        <div className="pt-1 text-[11px] font-mono text-white/40">Tap to view</div>
      </div>
    </div>
  );
}
