"use client";

import { useLoginWithAbstract } from "@abstract-foundation/agw-react";
import { useAccount } from "wagmi";
import { useEffect } from "react";

export function ConnectButton() {
  const { login, logout } = useLoginWithAbstract();
  const { address, isConnecting } = useAccount();

  useEffect(() => {
    if (!address) return;
    // İlk bağlantıda kullanıcıyı DB'ye kaydet
    fetch("/api/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wallet: address }),
    });
  }, [address]);

  if (isConnecting) {
    return (
      <div className="surface-panel-soft flex items-center gap-2 px-4 py-2 rounded-full text-sm text-[#aeb8af]">
        <span className="w-2 h-2 rounded-full bg-green animate-pulse" />
        Connecting...
      </div>
    );
  }

  if (address) {
    return (
      <button
        onClick={() => logout()}
        className="surface-panel-soft flex items-center gap-2 px-4 py-2 rounded-full text-sm hover:border-white/10 hover:bg-white/[0.035] transition-colors"
      >
        <span className="w-2 h-2 rounded-full bg-green shadow-[0_0_8px_#3dffa0]" />
        <span className="font-mono text-xs text-[#d7e6d8]">
          {address.slice(0, 6)}...{address.slice(-4)}
        </span>
        <span className="chip-green px-1.5 py-0.5 rounded-full text-[10px] font-semibold leading-none">AGW</span>
      </button>
    );
  }

  return (
    <button
      onClick={() => login()}
      className="rounded-full bg-[linear-gradient(180deg,#56ffad_0%,#35f39a_100%)] px-5 py-2.5 text-sm font-bold text-[#061009] shadow-[0_10px_24px_rgba(61,255,160,0.18)] transition-all hover:translate-y-[-1px] hover:shadow-[0_14px_30px_rgba(61,255,160,0.22)]"
    >
      Connect AGW
    </button>
  );
}
