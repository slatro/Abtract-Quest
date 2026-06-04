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
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="bg-card border border-border rounded-2xl p-8 max-w-sm w-full">
          <h1 className="text-xl font-bold mb-6">Admin Panel</h1>
          <input
            type="password"
            placeholder="Admin secret"
            value={secret}
            onChange={e => setSecret(e.target.value)}
            onKeyDown={e => e.key === "Enter" && login()}
            className="w-full bg-bg2 border border-border rounded-xl px-4 py-3 text-sm mb-3 outline-none focus:border-green"
          />
          <button
            onClick={login}
            className="w-full py-3 rounded-xl bg-green text-[#061009] font-bold text-sm"
          >
            Enter
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

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">Admin Panel</h1>
        <button
          onClick={() => setAuthed(false)}
          className="text-xs text-text-3 hover:text-text"
        >
          Sign out
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === t.key
                ? "bg-green/10 text-green border border-green/20"
                : "text-text-2 hover:bg-card"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* OVERVIEW */}
      {tab === "overview" && stats && (
        <div>
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: "Total users", val: stats.totalUsers },
              { label: "Total mints", val: stats.totalMints },
              { label: "Total unlocks", val: stats.totalUnlocks },
              { label: "Quest completions", val: stats.totalQuestCompletions },
            ].map(s => (
              <div key={s.label} className="bg-card border border-border rounded-xl p-5">
                <div className="text-2xl font-bold">{s.val}</div>
                <div className="text-xs text-text-3 mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Recent mints */}
            <div>
              <h2 className="text-sm font-semibold mb-3">Recent mints</h2>
              <div className="flex flex-col gap-2">
                {stats.recentMints.map((m: any) => (
                  <div key={m.id} className="flex items-center justify-between px-3 py-2 bg-card border border-border rounded-lg text-xs">
                    <span className="font-mono text-text-2">
                      {m.user.wallet.slice(0, 8)}...
                    </span>
                    <span className="text-green">{m.badge.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent unlocks */}
            <div>
              <h2 className="text-sm font-semibold mb-3">Recent unlocks</h2>
              {stats.recentUnlocks.length === 0 ? (
                <p className="text-xs text-text-3">No unlocks recorded yet.</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {stats.recentUnlocks.map((u: any) => (
                    <div key={u.id} className="flex items-center justify-between px-3 py-2 bg-card border border-border rounded-lg text-xs">
                      <span className="font-mono text-text-2">{u.user.wallet.slice(0, 10)}...</span>
                      <span className="text-green">{u.badge.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* BADGES */}
      {tab === "badges" && (
        <div>
          <div className="flex flex-col gap-2">
            {badges.map((b: any) => (
              <div key={b.id} className="flex items-center gap-4 px-4 py-3 bg-card border border-border rounded-xl">
                <span className="font-mono text-xs text-text-3 w-6">#{b.id}</span>
                <div className="flex-1">
                  <div className="text-sm font-semibold">{b.name}</div>
                  <div className="text-xs text-text-3">{b.setName} · {b.rarity} · {b.mintedCount} minted</div>
                </div>
                <input
                  defaultValue={b.price}
                  onBlur={e => {
                    if (e.target.value !== b.price) updateBadgePrice(b.id, e.target.value);
                  }}
                  className="bg-bg2 border border-border rounded-lg px-2 py-1 text-xs font-mono w-28 text-center"
                />
                <button
                  onClick={() => toggleBadge(b.id, b.active)}
                  className={`text-xs px-3 py-1 rounded-lg border font-medium ${
                    b.active
                      ? "border-green/20 text-green bg-green/5"
                      : "border-red-400/20 text-red-400 bg-red-400/5"
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
        <div className="flex flex-col gap-2">
          {quests.map((q: any) => (
            <div key={q.id} className="flex items-center gap-4 px-4 py-3 bg-card border border-border rounded-xl">
              <div className="flex-1">
                <div className="text-sm font-semibold">{q.title}</div>
                <div className="text-xs text-text-3">{q.type} · {q.xpReward} XP · cooldown: {q.cooldownMin}min</div>
              </div>
              <span className={`text-xs px-2 py-1 rounded ${q.active ? "text-green" : "text-text-3"}`}>
                {q.active ? "Active" : "Inactive"}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* USERS */}
      {tab === "users" && stats && (
        <div>
          <div className="grid grid-cols-[1fr_auto] gap-3 mb-6">
            <input
              placeholder="Wallet lookup"
              value={walletLookup}
              onChange={(e) => setWalletLookup(e.target.value)}
              className="bg-bg2 border border-border rounded-xl px-4 py-2.5 text-sm font-mono outline-none focus:border-green"
            />
            <button
              onClick={() => loadWalletUnlocks(walletLookup)}
              className="px-4 py-2.5 rounded-xl bg-green text-[#061009] font-semibold text-sm"
            >
              Load unlocks
            </button>
          </div>

          <div className="grid grid-cols-[1fr_160px_auto] gap-3 mb-6">
            <input
              placeholder="Manual unlock wallet"
              value={unlockWallet}
              onChange={(e) => setUnlockWallet(e.target.value)}
              className="bg-bg2 border border-border rounded-xl px-4 py-2.5 text-sm font-mono outline-none focus:border-green"
            />
            <input
              placeholder="Badge ID"
              value={unlockBadgeId}
              onChange={(e) => setUnlockBadgeId(e.target.value)}
              className="bg-bg2 border border-border rounded-xl px-4 py-2.5 text-sm font-mono outline-none focus:border-green"
            />
            <button
              onClick={manualUnlockAction}
              className="px-4 py-2.5 rounded-xl bg-green text-[#061009] font-semibold text-sm"
            >
              Manual unlock
            </button>
          </div>

          {walletUnlockData && (
            <div className="mb-8">
              <div className="mb-3">
                <div className="font-mono text-sm">{walletUnlockData.wallet}</div>
                <div className="text-xs text-text-3">
                  {walletUnlockData.xp} XP · {walletUnlockData.streak} streak · {walletUnlockData.unlocks.length} unlocks
                </div>
              </div>

              <div className="flex flex-col gap-2 mb-8">
                {walletUnlockData.unlocks.map((unlock: any) => (
                  <div key={unlock.id} className="flex items-center justify-between px-4 py-3 bg-card border border-border rounded-xl">
                    <div>
                      <div className="text-sm font-semibold">
                        #{unlock.badge.id} {unlock.badge.name}
                      </div>
                      <div className="text-xs text-text-3">
                        {unlock.badge.setName} · {unlock.source}
                        {unlock.sourceRef ? ` · ${unlock.sourceRef}` : ""}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-xs font-semibold ${unlock.owned ? "text-green" : "text-amber-400"}`}>
                        {unlock.owned ? "Minted" : "Unlocked"}
                      </div>
                      <div className="text-[10px] text-text-3">
                        {new Date(unlock.unlockedAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}

                {walletUnlockData.unlocks.length === 0 && (
                  <p className="text-sm text-text-2">No unlocks recorded for this wallet.</p>
                )}
              </div>
            </div>
          )}

          <h2 className="text-sm font-semibold mb-3">High risk users</h2>
          {stats.riskyUsers.length === 0 ? (
            <p className="text-sm text-text-2">No suspicious activity detected.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {stats.riskyUsers.map((u: any) => (
                <div key={u.wallet} className="flex items-center justify-between px-4 py-3 bg-card border border-red-400/20 rounded-xl">
                  <div>
                    <div className="font-mono text-sm">{u.wallet}</div>
                    <div className="text-xs text-text-3">XP: {u.xp} · Risk: {u.riskScore}</div>
                  </div>
                  <button
                    onClick={async () => {
                      await adminFetch("/api/admin/blocklist", {
                        method: "POST",
                        body: JSON.stringify({ wallet: u.wallet, reason: "High risk score" }),
                      });
                      showToast("Wallet blocked.");
                    }}
                    className="text-xs px-3 py-1.5 rounded-lg bg-red-400/10 text-red-400 border border-red-400/20"
                  >
                    Block
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* BLOCKLIST */}
      {tab === "blocklist" && (
        <div>
          <div className="flex gap-3 mb-6">
            <input
              placeholder="Wallet address"
              value={blockWallet}
              onChange={e => setBlockWallet(e.target.value)}
              className="flex-1 bg-bg2 border border-border rounded-xl px-4 py-2.5 text-sm font-mono outline-none focus:border-green"
            />
            <input
              placeholder="Reason (optional)"
              value={blockReason}
              onChange={e => setBlockReason(e.target.value)}
              className="flex-1 bg-bg2 border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-green"
            />
            <button
              onClick={blockWalletAction}
              className="px-4 py-2.5 rounded-xl bg-red-400/10 text-red-400 border border-red-400/20 text-sm font-semibold"
            >
              Block
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {blocklist.map((b: any) => (
              <div key={b.id} className="flex items-center justify-between px-4 py-3 bg-card border border-border rounded-xl">
                <div>
                  <div className="font-mono text-sm">{b.wallet}</div>
                  <div className="text-xs text-text-3">{b.reason ?? "No reason"} · {new Date(b.createdAt).toLocaleDateString()}</div>
                </div>
                <button
                  onClick={() => unblockWallet(b.wallet)}
                  className="text-xs px-3 py-1.5 rounded-lg border border-border text-text-2 hover:border-green hover:text-green"
                >
                  Unblock
                </button>
              </div>
            ))}
            {blocklist.length === 0 && (
              <p className="text-sm text-text-2">Blocklist is empty.</p>
            )}
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-card border border-border-2 rounded-xl px-4 py-3 text-sm font-medium shadow-xl z-50">
          {toast}
        </div>
      )}
    </div>
  );
}
