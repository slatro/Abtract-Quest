"use client";

import { useState, useEffect } from "react";

type Tab = "overview" | "badges" | "quests" | "users" | "blocklist";

export default function AdminPage() {
  const [secret, setSecret] = useState("");
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState<Tab>("overview");
  const [stats, setStats] = useState<any>(null);
  const [badges, setBadges] = useState<any[]>([]);
  const [quests, setQuests] = useState<any[]>([]);
  const [blocklist, setBlocklist] = useState<any[]>([]);
  const [blockWallet, setBlockWallet] = useState("");
  const [blockReason, setBlockReason] = useState("");
  const [unlockWallet, setUnlockWallet] = useState("");
  const [unlockBadgeId, setUnlockBadgeId] = useState("");
  const [walletLookup, setWalletLookup] = useState("");
  const [walletUnlockData, setWalletUnlockData] = useState<any | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  async function adminFetch(url: string, options?: RequestInit) {
    return fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        "x-admin-secret": secret,
        ...options?.headers,
      },
    });
  }

  async function login() {
    const res = await adminFetch("/api/admin/stats");
    if (res.ok) {
      setAuthed(true);
      const json = await res.json();
      setStats(json.data);
      // Load badges & blocklist concurrently for statistics charts and quick moderation actions
      const [badgesRes, blocklistRes] = await Promise.all([
        adminFetch("/api/admin/badges"),
        adminFetch("/api/admin/blocklist"),
      ]);
      const [badgesJson, blocklistJson] = await Promise.all([
        badgesRes.json(),
        blocklistRes.json(),
      ]);
      setBadges(badgesJson.data ?? []);
      setBlocklist(blocklistJson.data ?? []);
    } else {
      showToast("Wrong secret.");
    }
  }

  async function loadBadges() {
    const res = await adminFetch("/api/admin/badges");
    const json = await res.json();
    setBadges(json.data ?? []);
  }

  async function loadQuests() {
    const res = await adminFetch("/api/admin/quests");
    const json = await res.json();
    setQuests(json.data ?? []);
  }

  async function loadBlocklist() {
    const res = await adminFetch("/api/admin/blocklist");
    const json = await res.json();
    setBlocklist(json.data ?? []);
  }

  async function loadWalletUnlocks(wallet: string) {
    const res = await adminFetch(`/api/admin/unlocks?wallet=${encodeURIComponent(wallet)}`);
    const json = await res.json();
    if (!res.ok) {
      setWalletUnlockData(null);
      showToast(json.error ?? "Wallet lookup failed.");
      return;
    }
    setWalletUnlockData(json.data);
    loadBlocklist(); // Ensure blocklist is synced for UI buttons
  }

  async function toggleBadge(id: number, active: boolean) {
    await adminFetch("/api/admin/badges", {
      method: "PATCH",
      body: JSON.stringify({ id, active: !active }),
    });
    await loadBadges();
    showToast(`Badge ${!active ? "activated" : "paused"}.`);
  }

  async function updateBadgePrice(id: number, price: string) {
    await adminFetch("/api/admin/badges", {
      method: "PATCH",
      body: JSON.stringify({ id, price }),
    });
    showToast("Price updated.");
  }

  async function blockWalletAction() {
    if (!blockWallet) return;
    await adminFetch("/api/admin/blocklist", {
      method: "POST",
      body: JSON.stringify({ wallet: blockWallet, reason: blockReason }),
    });
    setBlockWallet("");
    setBlockReason("");
    await loadBlocklist();
    showToast("Wallet blocked.");
  }

  async function unblockWallet(wallet: string) {
    await adminFetch("/api/admin/blocklist", {
      method: "DELETE",
      body: JSON.stringify({ wallet }),
    });
    await loadBlocklist();
    showToast("Wallet unblocked.");
  }

  async function manualUnlockAction() {
    if (!unlockWallet || !unlockBadgeId) return;

    const res = await adminFetch("/api/admin/unlock-manual", {
      method: "POST",
      body: JSON.stringify({ wallet: unlockWallet, badgeId: Number(unlockBadgeId) }),
    });
    const json = await res.json();

    if (!res.ok) {
      showToast(json.error ?? "Manual unlock failed.");
      return;
    }

    showToast(`Badge #${unlockBadgeId} unlocked for wallet.`);
    setUnlockBadgeId("");
    await loadWalletUnlocks(unlockWallet);
  }

  useEffect(() => {
    if (!authed) return;
    if (tab === "badges") loadBadges();
    if (tab === "quests") loadQuests();
    if (tab === "blocklist") loadBlocklist();
  }, [tab, authed]);

  // Login ekranı
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden bg-black">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="bg-white/[0.02] backdrop-blur-2xl border border-white/10 rounded-2xl p-8 max-w-sm w-full relative z-10 shadow-2xl">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-green/30 to-transparent" />
          <h1 className="text-2xl font-black mb-6 text-white text-center tracking-tight">Admin Console</h1>
          <input
            type="password"
            placeholder="Admin secret"
            value={secret}
            onChange={e => setSecret(e.target.value)}
            onKeyDown={e => e.key === "Enter" && login()}
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-white/30 mb-4 outline-none focus:border-green focus:ring-1 focus:ring-green transition-all"
          />
          <button
            onClick={login}
            className="w-full py-3.5 rounded-xl bg-green text-[#061009] font-bold text-sm hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] transition-all shadow-[0_10px_20px_rgba(34,197,94,0.2)]"
          >
            Enter Console
          </button>
        </div>
      </div>
    );
  }

  const TABS: { key: Tab; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "badges", label: "Badges" },
    { key: "quests", label: "Quests" },
    { key: "users", label: "Users" },
    { key: "blocklist", label: "Blocklist" },
  ];

  // Compute rarity distribution for chart
  const rarityCounts: Record<string, number> = {
    common: 0,
    uncommon: 0,
    rare: 0,
    epic: 0,
    legendary: 0,
  };

  let totalMintedCount = 0;
  if (stats?.topBadges && badges.length > 0) {
    stats.topBadges.forEach((tb: any) => {
      const bObj = badges.find((b) => b.id === tb.badgeId);
      if (bObj) {
        rarityCounts[bObj.rarity] += tb._count.badgeId;
        totalMintedCount += tb._count.badgeId;
      }
    });
  }

  const rarityColorGlows: Record<string, string> = {
    common: "bg-white/60 shadow-[0_0_10px_rgba(255,255,255,0.3)]",
    uncommon: "bg-[#00ff66] shadow-[0_0_10px_rgba(0,255,102,0.5)]",
    rare: "bg-[#00ffff] shadow-[0_0_10px_rgba(0,255,255,0.5)]",
    epic: "bg-[#ff00ff] shadow-[0_0_10px_rgba(255,0,255,0.5)]",
    legendary: "bg-[#ffd700] shadow-[0_0_10px_rgba(255,215,0,0.5)]",
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            🛡️ Admin Console
          </h1>
          <p className="text-xs text-white/40 mt-1">Manage users, badgelist, quests, and blocklist</p>
        </div>
        <button
          onClick={() => setAuthed(false)}
          className="text-xs font-bold uppercase tracking-wider px-3.5 py-2 bg-white/5 border border-white/10 text-white/60 rounded-lg hover:text-white hover:bg-white/10 transition-all"
        >
          Sign out
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider border transition-all ${
              tab === t.key
                ? "bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.2)] scale-105"
                : "text-white/50 bg-white/5 border-transparent hover:bg-white/10 hover:text-white"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* OVERVIEW */}
      {tab === "overview" && stats && (
        <div className="space-y-8 animate-fade-in">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total Users", val: stats.totalUsers, icon: "👥" },
              { label: "Total Mints", val: stats.totalMints, icon: "💎" },
              { label: "Total Unlocks", val: stats.totalUnlocks, icon: "🔓" },
              { label: "Quest Completions", val: stats.totalQuestCompletions, icon: "✓" },
            ].map(s => (
              <div key={s.label} className="bg-white/[0.02] border border-white/5 rounded-xl p-5 hover:border-white/10 hover:bg-white/[0.04] transition-all">
                <div className="flex items-center gap-2 mb-2 text-[10px] font-bold uppercase tracking-wider text-white/40">
                  <span>{s.icon}</span> {s.label}
                </div>
                <div className="text-3xl font-black text-white">{s.val}</div>
              </div>
            ))}
          </div>

          {/* Rarity Distribution Chart */}
          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-6">
            <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              📊 Rarity Distribution of Minted Badges
            </h2>
            
            <div className="space-y-4">
              {[
                { label: "Legendary", key: "legendary" },
                { label: "Epic", key: "epic" },
                { label: "Rare", key: "rare" },
                { label: "Uncommon", key: "uncommon" },
                { label: "Common", key: "common" },
              ].map((tier) => {
                const count = rarityCounts[tier.key] || 0;
                const percent = totalMintedCount ? Math.round((count / totalMintedCount) * 100) : 0;
                return (
                  <div key={tier.key} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-white/60">
                      <span>{tier.label}</span>
                      <span>{count} ({percent}%)</span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-black/40 overflow-hidden shadow-inner relative">
                      <div
                        className={`absolute top-0 left-0 h-full rounded-full ${rarityColorGlows[tier.key]} transition-all duration-500 ease-out`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent lists */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recent mints */}
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5">
              <h2 className="text-sm font-bold mb-4 text-white flex items-center gap-2">
                💎 Recent Mints
              </h2>
              <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-1">
                {stats.recentMints.map((m: any) => (
                  <div key={m.id} className="flex items-center justify-between px-3.5 py-2.5 bg-white/[0.02] border border-white/5 rounded-lg text-xs hover:bg-white/[0.04] transition-colors">
                    <span className="font-mono text-white/50">
                      {m.user.wallet.slice(0, 12)}...{m.user.wallet.slice(-4)}
                    </span>
                    <span className="text-green font-semibold">{m.badge.name}</span>
                  </div>
                ))}
                {stats.recentMints.length === 0 && (
                  <p className="text-xs text-white/40">No mints recorded yet.</p>
                )}
              </div>
            </div>

            {/* Recent unlocks */}
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5">
              <h2 className="text-sm font-bold mb-4 text-white flex items-center gap-2">
                🔓 Recent Unlocks
              </h2>
              <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-1">
                {stats.recentUnlocks.map((u: any) => (
                  <div key={u.id} className="flex items-center justify-between px-3.5 py-2.5 bg-white/[0.02] border border-white/5 rounded-lg text-xs hover:bg-white/[0.04] transition-colors">
                    <span className="font-mono text-white/50">
                      {u.user.wallet.slice(0, 12)}...{u.user.wallet.slice(-4)}
                    </span>
                    <span className="text-blue-300 font-semibold">{u.badge.name}</span>
                  </div>
                ))}
                {stats.recentUnlocks.length === 0 && (
                  <p className="text-xs text-white/40">No unlocks recorded yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BADGES */}
      {tab === "badges" && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex flex-col gap-2">
            {badges.map((b: any) => (
              <div key={b.id} className="flex flex-col sm:flex-row sm:items-center gap-4 px-4 py-3 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.04] hover:border-white/10 transition-all">
                <span className="font-mono text-xs text-white/40 w-6">#{b.id}</span>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-white">{b.name}</div>
                  <div className="text-xs text-white/50">{b.setName} · <span className="capitalize">{b.rarity}</span> · {b.mintedCount} minted</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-white/40 font-bold uppercase">Price</span>
                  <input
                    defaultValue={b.price}
                    onBlur={e => {
                      if (e.target.value !== b.price) updateBadgePrice(b.id, e.target.value);
                    }}
                    className="bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 text-xs font-mono w-28 text-center text-white outline-none focus:border-green"
                  />
                </div>
                <button
                  onClick={() => toggleBadge(b.id, b.active)}
                  className={`text-xs px-3 py-1.5 rounded-lg border font-bold uppercase tracking-wider transition-colors ${
                    b.active
                      ? "border-green/20 text-green bg-green/5 hover:bg-green/15"
                      : "border-red-400/20 text-red-400 bg-red-400/5 hover:bg-red-400/15"
                  }`}
                >
                  {b.active ? "Active" : "Paused"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* QUESTS */}
      {tab === "quests" && (
        <div className="flex flex-col gap-2 animate-fade-in">
          {quests.map((q: any) => (
            <div key={q.id} className="flex items-center gap-4 px-4 py-3 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.04] hover:border-white/10 transition-all">
              <div className="flex-1">
                <div className="text-sm font-semibold text-white">{q.title}</div>
                <div className="text-xs text-white/50 capitalize">{q.type} · {q.xpReward} XP · Cooldown: {q.cooldownMin}min</div>
              </div>
              <span className={`text-xs font-bold uppercase px-3 py-1 rounded-full ${q.active ? "bg-green/10 text-green border border-green/20" : "bg-white/5 text-white/40 border border-white/5"}`}>
                {q.active ? "Active" : "Inactive"}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* USERS */}
      {tab === "users" && stats && (
        <div className="space-y-6 animate-fade-in">
          {/* User Lookup */}
          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5">
            <h3 className="text-sm font-bold text-white mb-3">Lookup User Wallet</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                placeholder="Wallet address (0x...)"
                value={walletLookup}
                onChange={(e) => setWalletLookup(e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-mono text-white placeholder-white/30 outline-none focus:border-green"
              />
              <button
                onClick={() => loadWalletUnlocks(walletLookup)}
                className="px-6 py-3 rounded-xl bg-green text-[#061009] font-bold text-sm hover:opacity-90 transition-all shadow-[0_5px_15px_rgba(34,197,94,0.15)]"
              >
                Search Wallet
              </button>
            </div>
          </div>

          {/* Manual Unlock Tools */}
          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5">
            <h3 className="text-sm font-bold text-white mb-3">Manual Badge Unlock</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                placeholder="Wallet address"
                value={unlockWallet}
                onChange={(e) => setUnlockWallet(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-mono text-white placeholder-white/30 outline-none focus:border-green"
              />
              <input
                placeholder="Badge ID"
                value={unlockBadgeId}
                onChange={(e) => setUnlockBadgeId(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-mono text-white placeholder-white/30 outline-none focus:border-green"
              />
              <button
                onClick={manualUnlockAction}
                className="px-6 py-3 rounded-xl bg-green text-[#061009] font-bold text-sm hover:opacity-90 transition-all shadow-[0_5px_15px_rgba(34,197,94,0.15)]"
              >
                Trigger Unlock
              </button>
            </div>
          </div>

          {/* Lookup Results with Actions */}
          {walletUnlockData && (
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-400/20 to-transparent" />
              
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 border-b border-white/5 pb-5">
                <div>
                  <div className="font-mono text-base font-bold text-white break-all">{walletUnlockData.wallet}</div>
                  <div className="text-xs text-white/50 mt-1">
                    Streak: <span className="text-white font-bold">{walletUnlockData.streak} days</span> · Unlocks: <span className="text-white font-bold">{walletUnlockData.unlocks.length}</span>
                  </div>
                </div>
                
                {/* Inline Action Controls */}
                <div className="flex flex-wrap items-center gap-3">
                  {/* Edit XP */}
                  <div className="flex items-center gap-2 bg-black/40 border border-white/5 rounded-xl px-3.5 py-1.5">
                    <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider">XP</span>
                    <input
                      type="number"
                      defaultValue={walletUnlockData.xp}
                      id={`xp-input-${walletUnlockData.wallet}`}
                      className="w-16 bg-white/5 text-center text-xs font-bold text-white border border-white/10 rounded px-1.5 py-0.5 outline-none focus:border-green"
                    />
                    <button
                      onClick={async () => {
                        const input = document.getElementById(`xp-input-${walletUnlockData.wallet}`) as HTMLInputElement;
                        const xpValue = input ? parseInt(input.value) : 0;
                        const res = await adminFetch("/api/admin/users/action", {
                          method: "POST",
                          body: JSON.stringify({ action: "modifyXp", wallet: walletUnlockData.wallet, xpValue })
                        });
                        if (res.ok) {
                          showToast("XP updated!");
                          loadWalletUnlocks(walletUnlockData.wallet);
                        } else {
                          showToast("Failed to update XP");
                        }
                      }}
                      className="text-[9px] font-bold uppercase tracking-wider px-2 py-1 bg-green text-[#061009] rounded hover:opacity-85 transition-opacity"
                    >
                      Set
                    </button>
                  </div>

                  {/* Reset Progress */}
                  <button
                    onClick={async () => {
                      if (!confirm("Are you sure you want to reset all quest completions and unlocks for this user? This cannot be undone.")) return;
                      const res = await adminFetch("/api/admin/users/action", {
                        method: "POST",
                        body: JSON.stringify({ action: "resetQuests", wallet: walletUnlockData.wallet })
                      });
                      if (res.ok) {
                        showToast("Quest progress reset!");
                        loadWalletUnlocks(walletUnlockData.wallet);
                      } else {
                        showToast("Failed to reset progress");
                      }
                    }}
                    className="text-[10px] font-bold uppercase tracking-wider px-3.5 py-2.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-lg hover:bg-amber-500/20 transition-colors"
                  >
                    Reset Progress
                  </button>

                  {/* Block / Unblock User */}
                  {blocklist.some(b => b.wallet.toLowerCase() === walletUnlockData.wallet.toLowerCase()) ? (
                    <button
                      onClick={async () => {
                        await unblockWallet(walletUnlockData.wallet);
                        loadWalletUnlocks(walletUnlockData.wallet);
                      }}
                      className="text-[10px] font-bold uppercase tracking-wider px-3.5 py-2.5 bg-green/10 text-green border border-green/20 rounded-lg hover:bg-green/20 transition-colors"
                    >
                      Unblock
                    </button>
                  ) : (
                    <button
                      onClick={async () => {
                        await adminFetch("/api/admin/blocklist", {
                          method: "POST",
                          body: JSON.stringify({ wallet: walletUnlockData.wallet, reason: "Manual admin block" }),
                        });
                        showToast("User blocked.");
                        loadBlocklist();
                      }}
                      className="text-[10px] font-bold uppercase tracking-wider px-3.5 py-2.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors"
                    >
                      Block User
                    </button>
                  )}
                </div>
              </div>

              {/* Unlock records list */}
              <div className="flex flex-col gap-2 pr-1">
                {walletUnlockData.unlocks.map((unlock: any) => (
                  <div key={unlock.id} className="flex items-center justify-between px-4 py-3 bg-white/[0.01] border border-white/5 rounded-lg hover:bg-white/[0.02] transition-colors">
                    <div>
                      <div className="text-xs font-bold text-white">
                        #{unlock.badge.id} {unlock.badge.name}
                      </div>
                      <div className="text-[10px] text-white/40 mt-0.5">
                        {unlock.badge.setName} Set · Source: <span className="capitalize">{unlock.source}</span>
                        {unlock.sourceRef ? ` (${unlock.sourceRef})` : ""}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-[10px] font-bold uppercase tracking-wider ${unlock.owned ? "text-green" : "text-blue-300"}`}>
                        {unlock.owned ? "Minted" : "Unlocked"}
                      </div>
                      <div className="text-[9px] text-white/30 mt-0.5">
                        {new Date(unlock.unlockedAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}

                {walletUnlockData.unlocks.length === 0 && (
                  <p className="text-xs text-white/40 text-center py-4">No unlocks or mints recorded for this wallet.</p>
                )}
              </div>
            </div>
          )}

          {/* High Risk Alerts */}
          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5">
            <h2 className="text-sm font-bold mb-4 text-white flex items-center gap-2">
              🚨 Suspicious Activity Alerts
            </h2>
            {stats.riskyUsers.length === 0 ? (
              <p className="text-xs text-white/40">No suspicious user wallets detected.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {stats.riskyUsers.map((u: any) => (
                  <div key={u.wallet} className="flex items-center justify-between px-4 py-3 bg-red-500/[0.01] border border-red-500/20 rounded-xl hover:bg-red-500/[0.03] transition-colors">
                    <div>
                      <div className="font-mono text-xs text-white break-all">{u.wallet}</div>
                      <div className="text-[10px] text-red-400 mt-1">XP: {u.xp} · Risk Score: <span className="font-bold">{u.riskScore}</span></div>
                    </div>
                    <button
                      onClick={async () => {
                        await adminFetch("/api/admin/blocklist", {
                          method: "POST",
                          body: JSON.stringify({ wallet: u.wallet, reason: "High risk score" }),
                        });
                        showToast("Wallet blocked.");
                        loadBlocklist();
                      }}
                      className="text-[10px] font-bold uppercase tracking-wider px-3.5 py-2.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors"
                    >
                      Block User
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* BLOCKLIST */}
      {tab === "blocklist" && (
        <div className="space-y-6 animate-fade-in">
          {/* Add block */}
          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5">
            <h3 className="text-sm font-bold text-white mb-3">Add Wallet to Blocklist</h3>
            <div className="flex flex-col md:flex-row gap-3">
              <input
                placeholder="Wallet address (0x...)"
                value={blockWallet}
                onChange={e => setBlockWallet(e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-mono text-white placeholder-white/30 outline-none focus:border-green"
              />
              <input
                placeholder="Reason for blocking"
                value={blockReason}
                onChange={e => setBlockReason(e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-green"
              />
              <button
                onClick={blockWalletAction}
                className="px-6 py-3 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 text-sm font-bold uppercase tracking-wider hover:bg-red-500/20 transition-colors"
              >
                Block
              </button>
            </div>
          </div>

          {/* Blocklist Table */}
          <div className="flex flex-col gap-2">
            {blocklist.map((b: any) => (
              <div key={b.id} className="flex items-center justify-between px-4 py-3 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.04] hover:border-white/10 transition-all">
                <div>
                  <div className="font-mono text-xs text-white break-all">{b.wallet}</div>
                  <div className="text-[10px] text-white/40 mt-1">{b.reason ?? "No reason"} · Blocked on {new Date(b.createdAt).toLocaleDateString()}</div>
                </div>
                <button
                  onClick={() => unblockWallet(b.wallet)}
                  className="text-xs px-3 py-1.5 rounded-lg border border-white/10 text-white/60 hover:border-green hover:text-green hover:bg-green/5 transition-all"
                >
                  Unblock
                </button>
              </div>
            ))}
            {blocklist.length === 0 && (
              <p className="text-sm text-white/40 text-center py-6">Blocklist is currently empty.</p>
            )}
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-[#0f1115] border border-white/10 rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-wider text-green shadow-xl z-50">
          {toast}
        </div>
      )}
    </div>
  );
}
