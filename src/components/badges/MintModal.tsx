"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAccount, useWriteContract } from "wagmi";
import { parseEther } from "viem";
import { Badge, UnlockSignatureResponse } from "@/types";
import BADGE_RUSH_ABI from "@/lib/abi/BadgeRush1155.json";
import { Turnstile } from "@marsidev/react-turnstile";
import { BadgeMedallion } from "./BadgeMedallion";
import { getBadgeRequirement } from "@/lib/badgeRequirements";

type Phase = "detail" | "minting" | "success";

interface Props {
  badge: Badge | null;
  onClose: () => void;
}

export function MintModal({ badge, onClose }: Props) {
  const { address } = useAccount();
  const queryClient = useQueryClient();
  const { writeContractAsync } = useWriteContract();
  const [phase, setPhase] = useState<Phase>("detail");
  const [txHash, setTxHash] = useState("");
  const [error, setError] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  if (!badge) return null;
  const currentBadge = badge;
  const requirement = getBadgeRequirement(currentBadge);
  const rarityChipClass =
    badge.rarity === "legendary"
      ? "chip-gold"
      : badge.rarity === "uncommon"
        ? "chip-green"
        : badge.rarity === "rare"
          ? "border border-blue-300/15 bg-blue-300/10 text-blue-200"
          : badge.rarity === "epic"
          ? "border border-purple-300/15 bg-purple-300/10 text-purple-200"
            : "chip-muted";
  const modalSurfaceByRarity: Record<string, string> = {
    common:
      "bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.05),transparent_26%),linear-gradient(180deg,rgba(18,21,20,0.98),rgba(11,14,13,1))] border border-white/7",
    uncommon:
      "bg-[radial-gradient(circle_at_top_left,rgba(61,255,160,0.08),transparent_28%),linear-gradient(180deg,rgba(17,25,20,0.98),rgba(10,15,12,1))] border border-green/10",
    rare:
      "bg-[radial-gradient(circle_at_top_left,rgba(96,200,255,0.12),transparent_30%),linear-gradient(180deg,rgba(14,19,27,0.98),rgba(9,12,18,1))] border border-blue-300/12",
    epic:
      "bg-[radial-gradient(circle_at_top_left,rgba(180,122,255,0.12),transparent_30%),linear-gradient(180deg,rgba(20,16,28,0.98),rgba(12,10,18,1))] border border-purple-300/12",
    legendary:
      "bg-[radial-gradient(circle_at_top_left,rgba(255,215,0,0.1),transparent_30%),linear-gradient(180deg,rgba(24,21,15,0.98),rgba(15,12,9,1))] border border-yellow-300/14",
  };
  const artShellByRarity: Record<string, string> = {
    common:
      "bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_58%),linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.005))] before:absolute before:inset-0 before:rounded-[24px] before:p-px before:bg-[linear-gradient(135deg,rgba(255,255,255,0.16),rgba(255,255,255,0.02),rgba(255,255,255,0.12))]",
    uncommon:
      "bg-[radial-gradient(circle_at_top,rgba(61,255,160,0.12),transparent_58%),linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.005))] before:absolute before:inset-0 before:rounded-[24px] before:p-px before:bg-[linear-gradient(135deg,rgba(61,255,160,0.22),rgba(255,255,255,0.02),rgba(61,255,160,0.16))] shadow-[0_0_24px_rgba(61,255,160,0.08)]",
    rare:
      "bg-[radial-gradient(circle_at_top,rgba(96,200,255,0.14),transparent_58%),linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.005))] before:absolute before:inset-0 before:rounded-[24px] before:p-px before:bg-[linear-gradient(135deg,rgba(96,200,255,0.24),rgba(255,255,255,0.02),rgba(96,200,255,0.18))] shadow-[0_0_24px_rgba(96,200,255,0.08)]",
    epic:
      "bg-[radial-gradient(circle_at_top,rgba(180,122,255,0.14),transparent_58%),linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.005))] before:absolute before:inset-0 before:rounded-[24px] before:p-px before:bg-[linear-gradient(135deg,rgba(180,122,255,0.24),rgba(255,255,255,0.02),rgba(180,122,255,0.18))] shadow-[0_0_24px_rgba(180,122,255,0.08)]",
    legendary:
      "bg-[radial-gradient(circle_at_top,rgba(255,215,0,0.14),transparent_58%),linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.005))] before:absolute before:inset-0 before:rounded-[24px] before:p-px before:bg-[linear-gradient(135deg,rgba(255,215,0,0.26),rgba(255,255,255,0.03),rgba(255,215,0,0.18))] shadow-[0_0_28px_rgba(255,215,0,0.08)]",
  };
  const requirementPanelByRarity: Record<string, string> = {
    common:
      "border-white/7 bg-[linear-gradient(180deg,rgba(255,255,255,0.028),rgba(255,255,255,0.014))]",
    uncommon:
      "border-green/10 bg-[linear-gradient(180deg,rgba(61,255,160,0.05),rgba(255,255,255,0.014))]",
    rare:
      "border-blue-300/12 bg-[linear-gradient(180deg,rgba(96,200,255,0.06),rgba(255,255,255,0.014))]",
    epic:
      "border-purple-300/12 bg-[linear-gradient(180deg,rgba(180,122,255,0.06),rgba(255,255,255,0.014))]",
    legendary:
      "border-yellow-300/14 bg-[linear-gradient(180deg,rgba(255,215,0,0.06),rgba(255,255,255,0.014))]",
  };
  const modalSurface = modalSurfaceByRarity[badge.rarity] ?? modalSurfaceByRarity.common;
  const artShell = artShellByRarity[badge.rarity] ?? artShellByRarity.common;
  const requirementPanel = requirementPanelByRarity[badge.rarity] ?? requirementPanelByRarity.common;

  async function handleMint() {
    if (!address) return;
    setError("");
    setPhase("minting");

    try {
      // 1. Backend'den unlock signature al
      const unlockRes = await fetch("/api/badges/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet: address, badgeId: currentBadge.id, turnstileToken }),
      });

      if (!unlockRes.ok) {
        const err = await unlockRes.json();
        throw new Error(err.error || "Unlock failed");
      }

      const { data }: { data: UnlockSignatureResponse } = await unlockRes.json();

      // 2. ETH değerini hesapla
      const value = currentBadge.price === "free"
        ? 0n
        : parseEther(currentBadge.price.replace(" ETH", ""));

      // 3. Kontratı çağır
      const hash = await writeContractAsync({
        address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
        abi: BADGE_RUSH_ABI.abi,
        functionName: "mint",
        args: [
          BigInt(currentBadge.id),
          data.payload.nonce,
          BigInt(data.payload.expiry),
          data.signature,
        ],
        value,
      });

      // 4. Backend'e onayla
      await fetch("/api/badges/mint-confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet: address, badgeId: currentBadge.id, txHash: hash }),
      });

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["badges", address] }),
        queryClient.invalidateQueries({ queryKey: ["user", address] }),
        queryClient.invalidateQueries({ queryKey: ["leaderboard"] }),
      ]);

      setTxHash(hash);
      setPhase("success");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Mint failed");
      setPhase("detail");
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={`relative flex max-h-[calc(100vh-32px)] w-full max-w-[480px] flex-col overflow-hidden rounded-[28px] p-4 sm:p-5 ${modalSurface}`}>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_60%)]" />
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-2xl border border-white/8 bg-white/[0.03] text-white/70 transition-colors hover:text-white"
        >
          ✕
        </button>

        {phase === "detail" && (
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="mb-4 flex items-center justify-center gap-2">
              <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold ${rarityChipClass}`}>
                {badge.rarity.toUpperCase()}
              </span>
              <span className="inline-flex rounded-full border border-white/8 bg-white/[0.03] px-3 py-1 text-[11px] font-mono text-white/70">
                {badge.price === "free" ? "FREE" : badge.price}
              </span>
            </div>

            <div className={`relative mx-auto mb-4 flex h-32 w-32 items-center justify-center rounded-[24px] ${artShell}`}>
              <div className="absolute inset-px rounded-[23px] bg-black/12" />
              <div className="relative z-10">
                <BadgeMedallion badge={badge} size="xl" framed={false} />
              </div>
            </div>

            <div className="mb-3 text-center">
              <h2 className="mb-1 text-[26px] font-bold tracking-tight text-white">{badge.name}</h2>
              <p className="text-[13px] text-white/62">{badge.setName} Set</p>
            </div>

            <div className="mb-4">
              <div className="mx-auto mb-3 h-px w-40 bg-[linear-gradient(90deg,transparent,rgba(61,255,160,0.45),rgba(255,255,255,0.5),rgba(61,255,160,0.45),transparent)]" />
              <p className="text-center text-[14px] leading-relaxed text-white/74">
                {badge.lore}
              </p>
            </div>

            <div className={`mb-4 overflow-hidden rounded-[24px] border px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] ${requirementPanel}`}>
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="pl-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/42">
                  Unlock requirement
                </span>
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                    requirement.availability === "live"
                      ? "chip-green"
                      : "border border-amber-300/15 bg-amber-300/10 text-amber-200"
                  }`}
                >
                  {requirement.availability === "live" ? "Live now" : "Not live yet"}
                </span>
              </div>
              <div className="mb-3 pl-3 text-left text-[16px] font-semibold text-white">{requirement.headline}</div>
              <ul className="grid gap-2 text-left text-[13px] leading-relaxed text-white/70">
                {requirement.bullets.map((bullet) => (
                  <li key={bullet} className="grid grid-cols-[10px_1fr] items-start gap-3 pl-3">
                    <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-white/35" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>

            {error && (
              <p className="mb-3 text-center text-xs text-red-400">{error}</p>
            )}

            <div className="mt-auto pt-1">
            {badge.owned ? (
              <button disabled className="w-full cursor-default rounded-2xl border border-white/8 bg-white/[0.03] py-4 text-sm font-semibold text-white/52">
                ✓ Already owned
              </button>
            ) : !address ? (
              <button onClick={onClose} className="w-full rounded-2xl bg-green py-3.5 text-sm font-bold text-[#061009] shadow-[0_10px_30px_rgba(61,255,160,0.22)] transition-transform hover:translate-y-[-1px]">
                Connect AGW to mint
              </button>
            ) : requirement.availability !== "live" ? (
              <button disabled className="w-full cursor-default rounded-2xl border border-white/8 bg-white/[0.03] py-3.5 text-sm text-white/52">
                Unlock path not live yet
              </button>
            ) : !badge.unlocked ? (
              <button disabled className="w-full cursor-default rounded-2xl border border-white/8 bg-white/[0.03] py-3.5 text-sm text-white/52">
                Finish requirement to unlock mint
              </button>
            ) : (
              <>
                {!turnstileToken && (
                  <Turnstile
                    siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
                    onSuccess={setTurnstileToken}
                    className="mb-3 flex justify-center"
                  />
                )}
                <button onClick={handleMint} className="w-full rounded-2xl bg-green py-3.5 text-sm font-bold text-[#061009] shadow-[0_10px_30px_rgba(61,255,160,0.22)] transition-transform hover:translate-y-[-1px]">
                  Mint for {badge.price === "free" ? "Free" : badge.price}
                </button>
              </>
            )}
            </div>
          </div>
        )}

        {phase === "minting" && (
          <div className="py-8 text-center">
            <div className="mb-5 inline-flex animate-[spin_3s_linear_infinite] rounded-full">
              <BadgeMedallion badge={badge} size="lg" framed />
            </div>
            <p className="mb-2 text-lg font-semibold text-white">Signing transaction...</p>
            <p className="text-sm text-white/62">Abstract mainnet · ERC-1155</p>
            <p className="mt-3 text-xs font-mono text-white/42">Chain ID: 2741</p>
          </div>
        )}

        {phase === "success" && (
          <div className="py-4 text-center">
            <div className="mb-5 flex justify-center">
              <BadgeMedallion badge={badge} size="xl" framed />
            </div>
            <div className="mb-3 inline-flex rounded-full border border-green/20 bg-green/10 px-3 py-1 text-[11px] font-semibold text-green">
              Mint confirmed
            </div>
            <h3 className="mb-2 text-2xl font-bold text-white">Badge minted!</h3>
            <p className="mb-5 text-sm text-white/64">{badge.name} is yours. Permanently onchain.</p>
            <div className="mb-4 break-all rounded-2xl border border-white/8 bg-black/14 p-3 font-mono text-[10px] text-white/62">
              tx: {txHash}
            </div>
            <a
              href={`https://abscan.org/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mb-5 inline-block text-sm text-blue-300 transition-colors hover:text-blue-200"
            >
              View on Abscan →
            </a>
            <button onClick={onClose} className="w-full rounded-2xl bg-green py-4 text-sm font-bold text-[#061009] shadow-[0_10px_30px_rgba(61,255,160,0.22)] transition-transform hover:translate-y-[-1px]">
              Keep collecting
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
