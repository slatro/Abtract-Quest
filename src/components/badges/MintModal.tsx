"use client";

import { useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { parseEther } from "viem";
import { Badge, UnlockSignatureResponse } from "@/types";
import BADGE_RUSH_ABI from "@/lib/abi/BadgeRush1155.json";
import { Turnstile } from "@marsidev/react-turnstile";

type Phase = "detail" | "minting" | "success";

interface Props {
  badge: Badge | null;
  onClose: () => void;
}

export function MintModal({ badge, onClose }: Props) {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const [phase, setPhase] = useState<Phase>("detail");
  const [txHash, setTxHash] = useState("");
  const [error, setError] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  if (!badge) return null;
  const currentBadge = badge;

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

      setTxHash(hash);
      setPhase("success");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Mint failed");
      setPhase("detail");
    }
  }

  return (
    <div
      className="fixed inset-0 bg-bg/85 backdrop-blur-sm z-50 flex items-center justify-center p-5"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-card border border-border-2 rounded-modal p-7 max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 rounded-lg bg-bg2 border border-border flex items-center justify-center text-text-2 hover:text-text text-sm"
        >
          ✕
        </button>

        {phase === "detail" && (
          <div>
            <div className="w-28 h-28 rounded-2xl mx-auto mb-5 flex items-center justify-center text-6xl bg-bg2 border border-border">
              {badge.emoji}
            </div>
            <h2 className="text-xl font-bold text-center mb-1">{badge.name}</h2>
            <p className="text-xs text-text-2 text-center mb-4">{badge.setName} Set</p>
            <p className="text-sm text-text-2 text-center leading-relaxed mb-5 border-t border-border pt-4">
              {badge.lore}
            </p>

            {error && (
              <p className="text-xs text-red-400 text-center mb-3">{error}</p>
            )}

            {badge.owned ? (
              <button disabled className="w-full py-3.5 rounded-xl bg-bg2 text-text-2 border border-border text-sm font-semibold cursor-default">
                ✓ Already owned
              </button>
            ) : !address ? (
              <button onClick={onClose} className="w-full py-3.5 rounded-xl bg-green text-[#061009] text-sm font-bold">
                Connect AGW to mint
              </button>
            ) : !badge.unlocked ? (
              <button disabled className="w-full py-3.5 rounded-xl bg-bg2 text-text-2 border border-border text-sm cursor-default">
                Complete the quest. Unlock the mint.
              </button>
            ) : (
              <>
                {!turnstileToken && (
                  <Turnstile
                    siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
                    onSuccess={setTurnstileToken}
                    className="mb-3"
                  />
                )}
                <button onClick={handleMint} className="w-full py-3.5 rounded-xl bg-green text-[#061009] text-sm font-bold hover:bg-green-400 transition-colors">
                  Mint for {badge.price === "free" ? "Free" : badge.price}
                </button>
              </>
            )}
          </div>
        )}

        {phase === "minting" && (
          <div className="text-center py-6">
            <div className="text-5xl mb-4 animate-spin inline-block">{badge.emoji}</div>
            <p className="font-semibold mb-2">Signing transaction...</p>
            <p className="text-sm text-text-2">Abstract mainnet · ERC-1155</p>
            <p className="text-xs font-mono text-text-3 mt-3">Chain ID: 2741</p>
          </div>
        )}

        {phase === "success" && (
          <div className="text-center py-4">
            <div className="text-6xl mb-4">{badge.emoji}</div>
            <h3 className="text-xl font-bold text-green mb-2">Badge minted!</h3>
            <p className="text-sm text-text-2 mb-4">{badge.name} is yours. Permanently onchain.</p>
            <div className="bg-bg2 border border-border rounded-lg p-2.5 font-mono text-[10px] text-text-2 break-all mb-4">
              tx: {txHash}
            </div>
            <a
              href={`https://abscan.org/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-sm text-blue-400 mb-5 hover:underline"
            >
              View on Abscan →
            </a>
            <button onClick={onClose} className="w-full py-3 rounded-xl bg-green text-[#061009] text-sm font-bold">
              Keep collecting
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
