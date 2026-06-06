"use client";

import { useLoginWithAbstract } from "@abstract-foundation/agw-react";
import { useAccount } from "wagmi";
import { useEffect, useState, useRef } from "react";

export function ConnectButton() {
  const { login, logout } = useLoginWithAbstract();
  const { address, isConnecting } = useAccount();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!address) return;
    // İlk bağlantıda kullanıcıyı DB'ye kaydet
    fetch("/api/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wallet: address }),
    });
  }, [address]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCopy = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setIsOpen(false);
      }, 1000);
    }
  };

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
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="surface-panel-soft flex items-center gap-2 px-4 py-2 rounded-full text-sm hover:border-white/10 hover:bg-white/[0.035] transition-colors"
        >
          <span className="w-2 h-2 rounded-full bg-green shadow-[0_0_8px_#3dffa0]" />
          <span className="font-mono text-xs text-[#d7e6d8]">
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
          <span className="chip-green px-1.5 py-0.5 rounded-full text-[10px] font-semibold leading-none">AGW</span>
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 rounded-md surface-panel border border-white/10 shadow-xl overflow-hidden z-50">
            <button
              onClick={handleCopy}
              className="w-full text-left px-4 py-3 text-sm text-white hover:bg-white/5 transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                {copied ? (
                  <svg width="14" height="14" fill="none" stroke="#3dffa0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
                <span className={copied ? "text-[#3dffa0]" : ""}>{copied ? "Copied!" : "Copy Address"}</span>
              </div>
            </button>
            <div className="h-px bg-white/5" />
            <button
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-3 text-sm text-[#ff4d4d] hover:bg-white/5 transition-colors flex items-center gap-2"
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Disconnect
            </button>
          </div>
        )}
      </div>
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
