import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface Props {
  params: { wallet: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const wallet = params.wallet.toLowerCase();
  const user = await db.user.findUnique({
    where: { wallet },
    include: { _count: { select: { mintRecords: true } } },
  });

  if (!user) return { title: "User not found" };

  return {
    title: `${wallet.slice(0, 6)}...${wallet.slice(-4)} — Portal Badge Rush`,
    description: `${user._count.mintRecords} badges collected on Abstract mainnet.`,
    openGraph: {
      title: `${wallet.slice(0, 6)}...${wallet.slice(-4)} on Portal Badge Rush`,
      description: `${user._count.mintRecords} badges · ${user.xp} XP · ${user.streak} day streak`,
      images: [`/api/og?wallet=${wallet}`],
    },
    twitter: {
      card: "summary_large_image",
      title: `${wallet.slice(0, 6)}...${wallet.slice(-4)} on Portal Badge Rush`,
      description: `${user._count.mintRecords} badges collected on Abstract mainnet.`,
      images: [`/api/og?wallet=${wallet}`],
    },
  };
}

export default async function UserProfilePage({ params }: Props) {
  const wallet = params.wallet.toLowerCase();

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

  const masterBadgeIds = [7, 14, 21, 28, 35, 42];
  const masterBadges = user.mintRecords.filter((r) => masterBadgeIds.includes(r.badgeId));
  const regularBadges = user.mintRecords.filter((r) => !masterBadgeIds.includes(r.badgeId));

  const rarityOrder = { legendary: 0, epic: 1, rare: 2, uncommon: 3, common: 4 };

  const sortedBadges = [...user.mintRecords].sort((a, b) => {
    const aOrder = rarityOrder[a.badge.rarity as keyof typeof rarityOrder] ?? 5;
    const bOrder = rarityOrder[b.badge.rarity as keyof typeof rarityOrder] ?? 5;
    return aOrder - bOrder;
  });

  const shareUrl = `https://portalbadgerush.xyz/u/${wallet}`;
  const tweetText = encodeURIComponent(
    `I've collected ${user.mintRecords.length} badges on Portal Badge Rush ⬡\n${shareUrl}`
  );

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-bg2 border border-border-2 flex items-center justify-center text-2xl">
            🦊
          </div>
          <div>
            <div className="font-mono text-sm font-semibold">
              {wallet.slice(0, 6)}...{wallet.slice(-4)}
            </div>
            <div className="text-xs text-text-3 mt-0.5">
              {user.mintRecords.length} badges · {user.xp} XP · {user.streak}🔥 streak
            </div>
            {masterBadges.length > 0 && (
              <div className="text-xs text-yellow-400 mt-0.5">
                {masterBadges.length} master crest{masterBadges.length > 1 ? "s" : ""}
              </div>
            )}
          </div>
        </div>

        <a
          href={`https://twitter.com/intent/tweet?text=${tweetText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-xl bg-[#1d9bf0]/10 text-[#1d9bf0] border border-[#1d9bf0]/20 text-xs font-semibold hover:bg-[#1d9bf0]/20 transition-colors"
        >
          Share on X →
        </a>
      </div>

      {masterBadges.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold mb-3">👑 Master crests</h2>
          <div className="flex gap-3 flex-wrap">
            {masterBadges.map((r) => (
              <div
                key={r.id}
                className="w-20 h-20 rounded-2xl border border-yellow-400/30 bg-yellow-400/5 flex items-center justify-center text-4xl shadow-[0_0_20px_rgba(255,215,0,0.1)]"
                title={r.badge.name}
              >
                {r.badge.emoji}
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-sm font-semibold mb-3">
          Badge wall
          <span className="text-text-3 font-normal ml-2">({regularBadges.length})</span>
        </h2>

        {sortedBadges.length === 0 ? (
          <p className="text-sm text-text-2">No badges yet.</p>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-3">
            {sortedBadges.map((r) => {
              const glowStyles: Record<string, string> = {
                legendary: "border-yellow-400/30 shadow-[0_0_16px_rgba(255,215,0,0.15)]",
                epic: "border-purple-400/25 shadow-[0_0_12px_rgba(180,122,255,0.15)]",
                rare: "border-blue-400/20 shadow-[0_0_10px_rgba(96,200,255,0.1)]",
                uncommon: "border-green/20",
                common: "border-border",
              };

              return (
                <div
                  key={r.id}
                  className={`rounded-xl border bg-card p-2.5 text-center ${glowStyles[r.badge.rarity] ?? "border-border"}`}
                  title={r.badge.name}
                >
                  <div className="text-3xl mb-1.5">{r.badge.emoji}</div>
                  <div className="text-[10px] text-text-2 leading-tight">{r.badge.name}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
