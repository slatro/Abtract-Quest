"use client";

import { useLoginWithAbstract } from "@abstract-foundation/agw-react";
import { useAccount } from "wagmi";
import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";

export function ConnectButton() {
  const { login, logout } = useLoginWithAbstract();
  const { address, isConnecting } = useAccount();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const [copied, setCopied] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (showWarning) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showWarning]);

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
    <>
      <button
        onClick={() => setShowWarning(true)}
        className="rounded-full bg-[linear-gradient(180deg,#56ffad_0%,#35f39a_100%)] px-5 py-2.5 text-sm font-bold text-[#061009] shadow-[0_10px_24px_rgba(61,255,160,0.18)] transition-all hover:translate-y-[-1px] hover:shadow-[0_14px_30px_rgba(61,255,160,0.22)]"
      >
        Connect AGW
      </button>

      {mounted && typeof window !== "undefined" && showWarning && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 text-left">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
            onClick={() => {
              setShowWarning(false);
              setAccepted(false);
            }}
          />

          {/* Modal Card */}
          <div className="relative w-full max-w-[360px] overflow-hidden rounded-md border border-border/80 bg-[radial-gradient(circle_at_top,rgba(61,255,160,0.04),transparent_55%),linear-gradient(180deg,#0d1410_0%,#080c0a_100%)] p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.1)]">
                  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-xs font-bold tracking-tight text-white uppercase font-mono">
                  Security Warning
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowWarning(false);
                  setAccepted(false);
                }}
                className="p-1.5 text-white/40 hover:text-white transition-colors text-xs"
              >
                ✕
              </button>
            </div>

            {/* Warning Message */}
            <div className="space-y-3 mb-6">
              <p className="text-xs font-semibold leading-relaxed text-[#ffd700]/95 bg-[#ffd700]/5 border border-[#ffd700]/10 rounded-md p-3">
                Please <strong>do not use your main wallet</strong> (the one holding substantial assets) on this platform.
              </p>
              <p className="text-[11px] leading-relaxed text-[#aeb8af]">
                Abstract Quests is a beta/testnet application. To protect your funds, using a dedicated testnet address or an empty burner wallet is highly recommended.
              </p>
            </div>

            {/* Acceptance Checkbox */}
            <label className="group flex items-start gap-3 cursor-pointer select-none mb-6">
              <div className="relative flex items-center justify-center mt-0.5 shrink-0">
                <input
                  type="checkbox"
                  checked={accepted}
                  onChange={(e) => setAccepted(e.target.checked)}
                  className="peer sr-only"
                />
                <div className="h-4 w-4 rounded border border-white/20 bg-white/5 transition-all peer-checked:border-green peer-checked:bg-green/10 peer-checked:shadow-[0_0_8px_rgba(61,255,160,0.2)]" />
                <svg
                  className="absolute hidden h-2.5 w-2.5 text-green peer-checked:block"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-[11px] font-medium text-white/70 transition-colors group-hover:text-white">
                I accept all risks.
              </span>
            </label>

            {/* Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setShowWarning(false);
                  setAccepted(false);
                }}
                className="flex-1 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/80 transition-all hover:bg-white/10 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowWarning(false);
                  login();
                }}
                disabled={!accepted}
                className="flex-1 rounded-full bg-[linear-gradient(180deg,#56ffad_0%,#35f39a_100%)] px-4 py-2 text-xs font-bold text-[#061009] shadow-[0_4px_12px_rgba(61,255,160,0.1)] transition-all hover:translate-y-[-1px] hover:shadow-[0_6px_15px_rgba(61,255,160,0.2)] disabled:pointer-events-none disabled:opacity-35"
              >
                Connect Wallet
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}
    </>
  );
}
