"use client";

import { useState, useEffect, useRef } from "react";
import { useAccount } from "wagmi";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Badge } from "@/types";
import { BadgeMedallion } from "../badges/BadgeMedallion";

interface NotificationItem {
  id: string;
  badgeId: number;
  badgeName: string;
  rarity: string;
  createdAt: number;
  read: boolean;
}

export function NotificationBell() {
  const { address } = useAccount();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch all badges (cached and synced across pages by react-query)
  const { data: badges } = useQuery<Badge[]>({
    queryKey: ["badges", address],
    queryFn: async () => {
      const res = await fetch(`/api/badges?wallet=${address}`);
      const json = await res.json();
      return json.data;
    },
    enabled: !!address,
  });

  // Load and sync notifications from localStorage
  useEffect(() => {
    if (!address || !badges) return;

    const storageKey = `quest_notifications_${address.toLowerCase()}`;
    const storedRaw = localStorage.getItem(storageKey);
    let storedList: NotificationItem[] = storedRaw ? JSON.parse(storedRaw) : [];

    // Find all currently mintable badges (unlocked but not owned)
    const mintableBadges = badges.filter((b) => b.unlocked && !b.owned);

    let listChanged = false;

    // Add new notifications for new mintable badges
    mintableBadges.forEach((badge) => {
      const exists = storedList.some((n) => n.badgeId === badge.id);
      if (!exists) {
        storedList.unshift({
          id: `mintable-${badge.id}`,
          badgeId: badge.id,
          badgeName: badge.name,
          rarity: badge.rarity,
          createdAt: Date.now(),
          read: false,
        });
        listChanged = true;
      }
    });

    // Remove notifications if a badge is no longer unlocked (e.g. progress reset)
    const activeBadgeIds = new Set(badges.map((b) => b.id));
    const originalLength = storedList.length;
    storedList = storedList.filter((n) => activeBadgeIds.has(n.badgeId));
    if (storedList.length !== originalLength) {
      listChanged = true;
    }

    if (listChanged) {
      localStorage.setItem(storageKey, JSON.stringify(storedList));
    }
    setNotifications(storedList);
  }, [address, badges]);

  // Click away listener to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!address) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen && unreadCount > 0) {
      // Mark all as read when opening the dropdown
      const storageKey = `quest_notifications_${address.toLowerCase()}`;
      const updated = notifications.map((n) => ({ ...n, read: true }));
      localStorage.setItem(storageKey, JSON.stringify(updated));
      setNotifications(updated);
    }
  };

  const handleNotificationClick = (badgeId: number) => {
    setIsOpen(false);
    router.push(`/gallery?mint=${badgeId}`);
  };

  const clearAll = () => {
    const storageKey = `quest_notifications_${address.toLowerCase()}`;
    localStorage.setItem(storageKey, JSON.stringify([]));
    setNotifications([]);
  };

  return (
    <div className="relative mr-3" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={handleToggle}
        className={`relative flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-300 ${
          isOpen
            ? "border-[#00ff66]/50 bg-white/[0.06] text-white"
            : "border-white/10 bg-white/[0.02] text-white/70 hover:border-white/20 hover:text-white hover:bg-white/[0.04]"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={unreadCount > 0 ? "animate-[swing_1.5s_ease-in-out_infinite]" : ""}
        >
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>

        {/* Glow/Light notification badge */}
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green shadow-[0_0_8px_rgba(61,255,160,0.8)]"></span>
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-80 origin-top-right rounded-xl border border-white/10 bg-[#0a0f16]/95 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl transition-all duration-200 z-50">
          <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Unlocks & Mints</h4>
            {notifications.length > 0 && (
              <button
                onClick={clearAll}
                className="text-[10px] font-semibold text-white/40 hover:text-red-400 transition-colors"
              >
                Clear All
              </button>
            )}
          </div>

          <div className="max-h-64 overflow-y-auto space-y-2 pr-1 [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-xs text-white/40">
                <p>No notifications yet.</p>
                <p className="mt-1 text-[10px] text-white/30">Complete quests to unlock badges!</p>
              </div>
            ) : (
              notifications.map((item) => {
                const badgeObj = badges?.find((b) => b.id === item.badgeId);
                const rarityColor =
                  item.rarity === "legendary" ? "text-yellow-400" :
                  item.rarity === "epic" ? "text-purple-400" :
                  item.rarity === "rare" ? "text-blue-400" :
                  item.rarity === "uncommon" ? "text-green" :
                  "text-white/60";

                return (
                  <div
                    key={item.id}
                    onClick={() => handleNotificationClick(item.badgeId)}
                    className="flex items-center gap-3 p-2 rounded-lg border border-white/5 bg-white/[0.01] hover:bg-white/[0.04] hover:border-white/10 transition-all cursor-pointer group"
                  >
                    <div className="w-8 h-8 rounded-md bg-black/20 flex items-center justify-center shrink-0">
                      {badgeObj ? (
                        <BadgeMedallion badge={badgeObj} size="sm" framed={false} />
                      ) : (
                        <span className="text-xs">✨</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-white group-hover:text-green transition-colors truncate">
                        {item.badgeName}
                      </div>
                      <div className="text-[10px] text-white/50 truncate">
                        Ready to mint! · <span className={`font-semibold capitalize ${rarityColor}`}>{item.rarity}</span>
                      </div>
                    </div>
                    {/* Unread indicator inside list */}
                    {!item.read && (
                      <span className="h-1.5 w-1.5 rounded-full bg-green shrink-0" />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes swing {
          0%, 100% { transform: rotate(0); }
          15% { transform: rotate(10deg); }
          30% { transform: rotate(-10deg); }
          45% { transform: rotate(5deg); }
          60% { transform: rotate(-5deg); }
          75% { transform: rotate(2deg); }
          90% { transform: rotate(-2deg); }
        }
      `}</style>
    </div>
  );
}
