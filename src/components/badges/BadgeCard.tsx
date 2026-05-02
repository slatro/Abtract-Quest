import { Badge } from "@/types";

const rarityStyles: Record<string, string> = {
  common: "border-border bg-card hover:shadow-[0_8px_24px_rgba(10,14,11,0.55)]",
  uncommon: "border-green/25 bg-card hover:shadow-[0_12px_28px_rgba(61,255,160,0.12)]",
  rare: "border-blue-400/25 bg-[#111a24] hover:shadow-[0_12px_30px_rgba(96,200,255,0.2)]",
  epic: "border-purple-400/25 bg-[#171227] hover:shadow-[0_12px_30px_rgba(180,122,255,0.22)]",
  legendary: "border-yellow-300/30 bg-[#211b11] hover:shadow-[0_14px_36px_rgba(255,215,0,0.24)]",
};

const rarityLabelStyles: Record<string, string> = {
  common: "bg-border text-[#b5beb6]",
  uncommon: "bg-green-dim text-green",
  rare: "bg-blue-400/10 text-blue-300",
  epic: "bg-purple-400/10 text-purple-300",
  legendary: "bg-yellow-400/10 text-yellow-400",
};

const rarityAuras: Record<string, string> = {
  common: "from-green-700/20 via-transparent to-indigo-500/20",
  uncommon: "from-green-500/25 via-transparent to-green-300/10",
  rare: "from-blue-500/25 via-transparent to-indigo-500/25",
  epic: "from-purple-500/25 via-transparent to-indigo-500/25",
  legendary: "from-yellow-500/30 via-transparent to-amber-400/20",
};

interface Props {
  badge: Badge;
  onClick: (badge: Badge) => void;
}

export function BadgeCard({ badge, onClick }: Props) {
  const isLocked = !badge.owned && !badge.unlocked;

  return (
    <div
      onClick={() => onClick(badge)}
      className={`
        relative rounded-card border p-3.5 cursor-pointer transition-all duration-200
        hover:-translate-y-0.5 ${rarityStyles[badge.rarity]}
        ${badge.owned ? "opacity-100" : ""}
        ${isLocked ? "opacity-50" : ""}
      `}
    >
      {badge.owned && (
        <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-green flex items-center justify-center text-[#061009] text-xs font-bold">
          ✓
        </div>
      )}

      <div className="relative h-36 rounded-2xl mb-3 overflow-hidden border border-white/10 bg-bg2">
        <div className={`absolute inset-0 bg-gradient-to-br ${rarityAuras[badge.rarity]}`} />
        <div className="absolute inset-3 rounded-2xl border border-white/10" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 rounded-full border border-white/15 bg-black/20 backdrop-blur-[1px] flex items-center justify-center text-4xl shadow-[0_0_30px_rgba(0,0,0,0.25)]">
            {badge.emoji}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-2">
        <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded ${rarityLabelStyles[badge.rarity]}`}>
          {badge.rarity.toUpperCase()}
        </span>
        <span className="font-mono text-[10px] text-[#aeb8af]">
          {badge.price === "free" ? "FREE" : badge.price}
        </span>
      </div>

      <div className="text-[22px] leading-none font-bold tracking-tight text-[#e8f0e9] mb-2">{badge.name}</div>

      <p className="text-sm text-[#aeb8af] leading-snug mb-3 h-10 overflow-hidden">{badge.lore}</p>

      <div className="font-mono text-[11px]">
        {badge.owned ? <span className="text-green font-semibold">✓ Owned</span> : <span className="text-[#93a197]">Tap to view</span>}
      </div>
    </div>
  );
}
