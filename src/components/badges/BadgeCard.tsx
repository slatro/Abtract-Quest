import { Badge } from "@/types";
import { BadgeMedallion } from "./BadgeMedallion";

const rarityStyles: Record<string, string> = {
  common:
    "border-white/20 bg-[#020202]/85 backdrop-blur-2xl hover:border-white/80 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]",
  uncommon:
    "border-[#00ff66]/30 bg-[#020202]/85 backdrop-blur-2xl hover:border-[#00ff66] hover:shadow-[0_0_20px_rgba(0,255,102,0.6)]",
  rare:
    "border-[#00ffff]/30 bg-[#020202]/85 backdrop-blur-2xl hover:border-[#00ffff] hover:shadow-[0_0_20px_rgba(0,255,255,0.6)]",
  epic:
    "border-[#ff00ff]/30 bg-[#020202]/85 backdrop-blur-2xl hover:border-[#ff00ff] hover:shadow-[0_0_20px_rgba(255,0,255,0.6)]",
  legendary:
    "border-[#ffd700]/30 bg-[#020202]/85 backdrop-blur-2xl hover:border-[#ffd700] hover:shadow-[0_0_20px_rgba(255,215,0,0.6)]",
};

const rarityLabelStyles: Record<string, string> = {
  common: "chip-muted",
  uncommon: "chip-green",
  rare: "border border-[#00ffff] text-[#00ffff] bg-[#00ffff]/10 shadow-[0_0_5px_rgba(0,255,255,0.3)]",
  epic: "border border-[#ff00ff] text-[#ff00ff] bg-[#ff00ff]/10 shadow-[0_0_5px_rgba(255,0,255,0.3)]",
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
  common: "bg-[#020202] border border-white/10",
  uncommon: "bg-[#020202] border border-[#00ff66]/20",
  rare: "bg-[#020202] border border-[#00ffff]/20",
  epic: "bg-[#020202] border border-[#ff00ff]/20",
  legendary: "bg-[#020202] border border-[#ffd700]/20",
};

interface Props {
  badge: Badge;
  onClick: (badge: Badge) => void;
}

export function BadgeCard({ badge, onClick }: Props) {
  const isLocked = !badge.owned && !badge.unlocked;
  const isMintable = badge.unlocked && !badge.owned;
  const statusLabel = badge.owned
    ? "Owned"
    : badge.unlocked
      ? "Mintable"
      : "Locked";

  return (
    <div
      onClick={() => onClick(badge)}
      className={`
        relative w-full overflow-hidden rounded-md border p-3 cursor-pointer transition-all duration-300 ease-out
        hover:scale-[1.03] hover:-translate-y-1 hover:z-10 ${rarityStyles[badge.rarity]}
        ${badge.owned ? "opacity-100" : ""}
        ${isLocked ? "opacity-90 grayscale-[40%]" : ""}
        ${isMintable ? "animate-pulse-neon" : ""}
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

      <div className="relative mb-3 mx-auto aspect-square w-full max-w-[148px]">
        <div className={`relative h-full w-full rounded-md overflow-hidden ${rarityHeroStyles[badge.rarity]}`}>
          <div className="absolute inset-0 flex items-center justify-center p-2">
            <BadgeMedallion badge={badge} size="lg" framed={false} />
          </div>
        </div>

        <div className="absolute right-1 top-1 z-10 flex items-center gap-2">
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold backdrop-blur-md ${
              badge.owned
                ? "bg-green text-[#061009]"
                : badge.unlocked
                  ? "bg-white/10 text-white"
                  : "bg-black/40 text-white/60"
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
