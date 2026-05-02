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
      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border text-sm text-[#aeb8af]">
        <span className="w-2 h-2 rounded-full bg-green animate-pulse" />
        Connecting...
      </div>
    );
  }

  if (address) {
    return (
      <button
        onClick={() => logout()}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border-2 text-sm hover:border-green/30 hover:bg-green/5 transition-colors"
      >
        <span className="w-2 h-2 rounded-full bg-green shadow-[0_0_8px_#3dffa0]" />
        <span className="font-mono text-xs text-[#d7e6d8]">
          {address.slice(0, 6)}...{address.slice(-4)}
        </span>
        <span className="text-[10px] text-green font-semibold">AGW</span>
      </button>
    );
  }

  return (
    <button
      onClick={() => login()}
      className="px-6 py-2.5 rounded-full bg-green text-[#061009] text-sm font-bold hover:bg-[#56ffad] transition-colors"
    >
      Connect AGW
    </button>
  );
}
