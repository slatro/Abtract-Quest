"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAccount, useWriteContract, usePublicClient } from "wagmi";
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
  const publicClient = usePublicClient();
  const queryClient = useQueryClient();
  const { writeContractAsync } = useWriteContract();
  const [phase, setPhase] = useState<Phase>("detail");
  const [txHash, setTxHash] = useState("");
  const [error, setError] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [mintStep, setMintStep] = useState<"payload" | "wallet" | "network" | "done">("payload");

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
      "bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.05),transparent_26%),linear-gradient(180deg,rgba(18,21,20,0.98),rgba(11,14,13,1))] shadow-[0_24px_50px_rgba(0,0,0,0.5)]",
    uncommon:
      "bg-[radial-gradient(circle_at_top_left,rgba(61,255,160,0.08),transparent_28%),linear-gradient(180deg,rgba(17,25,20,0.98),rgba(10,15,12,1))] shadow-[0_24px_50px_rgba(61,255,160,0.1)]",
    rare:
      "bg-[radial-gradient(circle_at_top_left,rgba(96,200,255,0.12),transparent_30%),linear-gradient(180deg,rgba(14,19,27,0.98),rgba(9,12,18,1))] shadow-[0_24px_50px_rgba(96,200,255,0.1)]",
    epic:
      "bg-[radial-gradient(circle_at_top_left,rgba(180,122,255,0.12),transparent_30%),linear-gradient(180deg,rgba(20,16,28,0.98),rgba(12,10,18,1))] shadow-[0_24px_50px_rgba(180,122,255,0.1)]",
    legendary:
      "bg-[radial-gradient(circle_at_top_left,rgba(255,215,0,0.1),transparent_30%),linear-gradient(180deg,rgba(24,21,15,0.98),rgba(15,12,9,1))] shadow-[0_24px_50px_rgba(255,215,0,0.1)]",
  };
  const artShellByRarity: Record<string, string> = {
    common:
      "bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_58%),linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.005))] before:absolute before:inset-0 before:rounded-md before:p-px before:bg-[linear-gradient(135deg,rgba(255,255,255,0.16),rgba(255,255,255,0.02),rgba(255,255,255,0.12))]",
    uncommon:
      "bg-[radial-gradient(circle_at_top,rgba(61,255,160,0.12),transparent_58%),linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.005))] before:absolute before:inset-0 before:rounded-md before:p-px before:bg-[linear-gradient(135deg,rgba(61,255,160,0.22),rgba(255,255,255,0.02),rgba(61,255,160,0.16))] shadow-[0_0_24px_rgba(61,255,160,0.08)]",
    rare:
      "bg-[radial-gradient(circle_at_top,rgba(96,200,255,0.14),transparent_58%),linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.005))] before:absolute before:inset-0 before:rounded-md before:p-px before:bg-[linear-gradient(135deg,rgba(96,200,255,0.24),rgba(255,255,255,0.02),rgba(96,200,255,0.18))] shadow-[0_0_24px_rgba(96,200,255,0.08)]",
    epic:
      "bg-[radial-gradient(circle_at_top,rgba(180,122,255,0.14),transparent_58%),linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.005))] before:absolute before:inset-0 before:rounded-md before:p-px before:bg-[linear-gradient(135deg,rgba(180,122,255,0.24),rgba(255,255,255,0.02),rgba(180,122,255,0.18))] shadow-[0_0_24px_rgba(180,122,255,0.08)]",
    legendary:
      "bg-[radial-gradient(circle_at_top,rgba(255,215,0,0.14),transparent_58%),linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.005))] before:absolute before:inset-0 before:rounded-md before:p-px before:bg-[linear-gradient(135deg,rgba(255,215,0,0.26),rgba(255,255,255,0.03),rgba(255,215,0,0.18))] shadow-[0_0_28px_rgba(255,215,0,0.08)]",
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
    setMintStep("payload");

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

      // 2. Awaiting Wallet Approval
      setMintStep("wallet");
      const value = currentBadge.price === "free"
        ? 0n
        : parseEther(currentBadge.price.replace(" ETH", ""));

      // 3. Kontratı çağır
      const hash = await writeContractAsync({
        address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
        abi: BADGE_RUSH_ABI,
        functionName: "mint",
        args: [
          BigInt(currentBadge.id),
          data.payload.nonce,
          BigInt(data.payload.expiry),
          data.signature,
        ],
        value,
      });

      // 4. Confirm transaction and mint on backend (Backend queries the receipt)
      setMintStep("network");
      const confirmRes = await fetch("/api/badges/mint-confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet: address, badgeId: currentBadge.id, txHash: hash }),
      });

      if (!confirmRes.ok) {
        const err = await confirmRes.json();
        throw new Error(err.error || "Onchain confirmation failed");
      }

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["badges", address] }),
        queryClient.invalidateQueries({ queryKey: ["user", address] }),
        queryClient.invalidateQueries({ queryKey: ["leaderboard"] }),
      ]);

      setTxHash(hash);
      setMintStep("done");
      setPhase("success");

      // Particle Confetti Effect
      import("canvas-confetti").then((module) => {
        const confetti = module.default;
        const rarityColors: Record<string, string> = {
          common: "#ffffff",
          uncommon: "#00ff66",
          rare: "#00ffff",
          epic: "#ff00ff",
          legendary: "#ffd700",
        };
        const color = rarityColors[currentBadge.rarity] || "#00ff66";
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.5 },
          colors: [color, "#ffffff", "#aaaaaa"],
          zIndex: 9999
        });
      });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Mint failed");
      setPhase("detail");
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0f16]/60 p-4 backdrop-blur-2xl"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={`relative flex max-h-[calc(100vh-32px)] w-full max-w-[480px] flex-col overflow-hidden rounded-md p-4 sm:p-5 border border-white/10 backdrop-blur-3xl shadow-[0_24px_50px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.1)] ${modalSurface}`}>
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-70" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_60%)]" />
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-md border border-white/8 bg-white/[0.03] text-white/70 transition-colors hover:text-white"
        >
          ✕
        </button>

        {phase === "detail" && (
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="mb-4 flex items-center justify-center gap-2">
              <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold ${rarityChipClass}`}>
                {badge.rarity.toUpperCase()}
              </span>
              <span className="inline-flex rounded-sm border border-white/8 bg-white/[0.03] px-3 py-1 text-[11px] font-mono text-white/70">
                {badge.price === "free" ? "FREE" : badge.price}
              </span>
            </div>

            <div className={`relative mx-auto mb-4 flex h-32 w-32 items-center justify-center rounded-md animate-breathe-shimmer ${artShell}`}>
              <div className="absolute inset-px rounded-md bg-black/12" />
              <div className="relative z-10">
                <BadgeMedallion badge={badge} size="xl" framed={false} />
              </div>
            </div>

            <div className="mb-3 text-center">
              <h2 className="mb-1 text-[26px] font-bold tracking-tight text-white">{badge.name}</h2>
              <p className="text-[13px] text-white/62">{badge.setName} Set</p>
            </div>

            <div className="mb-4">
              <div className="mx-auto mb-3 h-px w-44 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.1),rgba(255,255,255,0.55),rgba(61,255,160,0.28),transparent)]" />
              <p className="text-center text-[14px] leading-relaxed text-white/74">
                {badge.lore}
              </p>
            </div>

            <div className={`mb-4 overflow-hidden rounded-md border px-5 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03),0_18px_36px_rgba(0,0,0,0.16)] ${requirementPanel}`}>
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/42">
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
              <div className="mb-3 text-left text-[16px] font-semibold text-white">{requirement.headline}</div>
              <ul className="grid gap-2 text-left text-[13px] leading-relaxed text-white/70">
                {requirement.bullets.map((bullet) => (
                  <li key={bullet} className="grid grid-cols-[10px_1fr] items-start gap-3">
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
              <button disabled className="w-full cursor-default rounded-md border border-white/8 bg-white/[0.03] py-4 text-sm font-semibold text-white/52">
                ✓ Already owned
              </button>
            ) : !address ? (
              <button onClick={onClose} className="w-full rounded-md bg-green py-3.5 text-sm font-bold text-[#061009] shadow-[0_10px_30px_rgba(61,255,160,0.22)] transition-transform hover:translate-y-[-1px]">
                Connect AGW to mint
              </button>
            ) : requirement.availability !== "live" ? (
              <button disabled className="w-full cursor-default rounded-md border border-white/8 bg-white/[0.03] py-3.5 text-sm text-white/52">
                Unlock path not live yet
              </button>
            ) : !badge.unlocked ? (
              <button disabled className="w-full cursor-default rounded-md border border-white/8 bg-white/[0.03] py-3.5 text-sm text-white/52">
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
                <button onClick={handleMint} className="w-full rounded-md bg-green py-3.5 text-sm font-bold text-[#061009] shadow-[0_10px_30px_rgba(61,255,160,0.22)] transition-transform hover:translate-y-[-1px]">
                  Mint for {badge.price === "free" ? "Free" : badge.price}
                </button>
              </>
            )}
            </div>
          </div>
        )}

        {phase === "minting" && (
          <div className="py-6 flex flex-col items-center">
            {/* Breathing Shimmer Medallion */}
            <div className="mb-6 inline-flex animate-breathe-shimmer rounded-full">
              <BadgeMedallion badge={badge} size="lg" framed />
            </div>
            
            <h3 className="text-lg font-bold text-white mb-6">Minting Badge...</h3>
            
            {/* Steps Checklist */}
            <div className="w-full max-w-[280px] space-y-4 text-left">
              {[
                {
                  key: "payload",
                  label: "1. Prepare Cryptographic Payload",
                  desc: "Fetching signature from secure backend"
                },
                {
                  key: "wallet",
                  label: "2. Awaiting Wallet Approval",
                  desc: "Please sign the transaction in your wallet"
                },
                {
                  key: "network",
                  label: "3. Confirming Onchain",
                  desc: "Broadcasting transaction to Abstract Network"
                }
              ].map((step) => {
                const stepsOrder = ["payload", "wallet", "network", "done"];
                const currentIdx = stepsOrder.indexOf(mintStep);
                const stepIdx = stepsOrder.indexOf(step.key);
                
                const isCompleted = currentIdx > stepIdx;
                const isActive = currentIdx === stepIdx;
                
                return (
                  <div key={step.key} className={`flex items-start gap-3 transition-opacity duration-300 ${isCompleted || isActive ? "opacity-100" : "opacity-30"}`}>
                    <div className="mt-1">
                      {isCompleted ? (
                        <div className="flex items-center justify-center w-4 h-4 rounded-full bg-green text-[#061009] text-[9px] font-bold">
                          ✓
                        </div>
                      ) : isActive ? (
                        <div className="w-4 h-4 rounded-full border-2 border-green border-t-transparent animate-spin" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-white/20" />
                      )}
                    </div>
                    <div>
                      <div className={`text-xs font-bold ${isActive ? "text-green" : "text-white"}`}>
                        {step.label}
                      </div>
                      <div className="text-[10px] text-white/50 mt-0.5 leading-normal">
                        {step.desc}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-6 text-[10px] font-mono text-white/30 uppercase tracking-wider">
              Abstract Testnet · Chain ID: 11124
            </div>
          </div>
        )}

        {phase === "success" && (
          <div className="py-4 text-center">
            <div className="mb-6 flex justify-center relative">
              {/* Halos & Glows */}
              <div className={`absolute inset-0 m-auto w-24 h-24 rounded-full blur-2xl opacity-60 animate-pulse bg-gradient-to-r ${
                badge.rarity === "legendary" ? "from-yellow-400 to-amber-500" :
                badge.rarity === "epic" ? "from-purple-500 to-pink-500" :
                badge.rarity === "rare" ? "from-blue-400 to-cyan-500" :
                badge.rarity === "uncommon" ? "from-green to-emerald-500" :
                "from-white to-gray-500"
              }`} />
              <div className="relative z-10 transition-transform duration-500 hover:scale-110 active:rotate-3 cursor-grab">
                <BadgeMedallion badge={badge} size="xl" framed />
              </div>
            </div>
            <div className="mb-3 inline-flex rounded-sm border border-green/20 bg-green/10 px-3 py-1 text-[11px] font-semibold text-green animate-bounce">
              Mint confirmed
            </div>
            <h3 className="mb-2 text-2xl font-bold text-white">Badge minted!</h3>
            <p className="mb-5 text-sm text-white/64">{badge.name} is yours. Permanently onchain.</p>
            <div className="mb-4 break-all rounded-md border border-white/8 bg-black/14 p-3 font-mono text-[10px] text-white/62">
              tx: {txHash}
            </div>
            <a
              href={`https://explorer.testnet.abs.xyz/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mb-5 inline-block text-sm text-blue-300 transition-colors hover:text-blue-200"
            >
              View on Explorer →
            </a>
            <button onClick={onClose} className="w-full rounded-md bg-green py-4 text-sm font-bold text-[#061009] shadow-[0_10px_30px_rgba(61,255,160,0.22)] transition-transform hover:translate-y-[-1px]">
              Keep collecting
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
