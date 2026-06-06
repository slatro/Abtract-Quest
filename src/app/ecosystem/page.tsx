"use client";

import { useState, useMemo, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLoginWithAbstract } from "@abstract-foundation/agw-react";
import { useAccount } from "wagmi";
import {
  ChevronRight,
  X,
  Globe,
  ImageIcon,
  ArrowUp
} from "lucide-react";

type Project = {
  id: string;
  name: string;
  description: string;
  category: string;
  websiteUrl: string;
  logoUrl?: string | null;
  bannerUrl?: string | null;
  twitterUrl?: string | null;
  upvotesCount?: number;
  hasUpvoted?: boolean;
};

const PROJECT_TUTORIALS: Record<string, {
  tagline: string;
  steps: { title: string; desc: string }[];
  rewards: string[];
}> = {
  "213": {
    tagline: "Fight in the dungeons of Maze of Gains and win your share of the weekly ETH prize pool!",
    steps: [
      { title: "Connect Wallet", desc: "Go to the Maze of Gains platform and connect your Abstract Global Wallet (AGW)." },
      { title: "Enter the Dungeon", desc: "Select your character on the dungeon map and begin your turn-based roguelike adventure." },
      { title: "Defeat Monsters", desc: "Defeat creatures using turn-based combat mechanics and collect dungeon gold." },
      { title: "Record Your Score", desc: "Successfully exit the dungeon to save your high score on the weekly leaderboard." },
      { title: "Share the Prize Pool", desc: "Rank on the leaderboard to claim your share of the weekly ETH prize pool." }
    ],
    rewards: ["Weekly ETH Prize Pool", "+5 XP Exploration Reward", "Exclusive OOH Quest Badge Unlock"]
  },
  "207": {
    tagline: "Defeat waves of monsters in an action RPG world and compete for leaderboard glory!",
    steps: [
      { title: "Connect Wallet", desc: "Go to Tollan Universe and connect your Abstract wallet to create your profile." },
      { title: "Choose Your Class", desc: "Select from different character classes and join the lobby." },
      { title: "Fight Waves", desc: "Fight waves of incoming monsters solo or with friends to level up." },
      { title: "Defeat Bosses", desc: "Defeat bosses to earn elemental powers and legendary gear." }
    ],
    rewards: ["Abstract Network Loot Boxes", "+5 XP Exploration Reward", "Seasonal Tournament Rewards"]
  },
  "39": {
    tagline: "Explore planets and fight in PvP arenas under the AI supervision of Gigus Maximus!",
    steps: [
      { title: "Create Character", desc: "Connect to the Gigaverse platform and create your hero character." },
      { title: "Gather Resources", desc: "Explore planets to gather raw materials and craft advanced gear." },
      { title: "PvE & PvP Battles", desc: "Fight creatures to gain experience or challenge other players in the PvP arena." },
      { title: "AI Overlord Quests", desc: "Complete mysterious quests given by the AI Overlord Gigus Maximus to earn rare items." }
    ],
    rewards: ["Rare Item Drops", "+5 XP Exploration Reward", "Leaderboard Points"]
  },
  "15": {
    tagline: "Buy, sell, and vault authentic physical collectibles digitally on-chain!",
    steps: [
      { title: "Register on Marketplace", desc: "Go to DYLI and connect your Web3 wallet to verify your profile." },
      { title: "Browse Collectibles", desc: "Find rare cards, packs, and toys you want to own." },
      { title: "Purchase Digital Asset", desc: "Buy digital versions of physical collectibles backed by secure vaults." },
      { title: "Trade or Request Delivery", desc: "Trade your collectibles or request physical shipping to your address." }
    ],
    rewards: ["Physical Asset Delivery", "+5 XP Exploration Reward", "Collectible Trading Access"]
  },
  "236": {
    tagline: "Test your knowledge in weekly Trivia Rush sessions and win real cash prizes!",
    steps: [
      { title: "Join the Session", desc: "Join the live trivia room every Friday at 1 PM EST." },
      { title: "Answer Questions", desc: "Answer general knowledge questions faster than your opponents." },
      { title: "Claim Cash Prizes", desc: "Rank among the top players to win cash rewards directly to your wallet." },
      { title: "Practice Daily", desc: "Play daily practice quizzes to sharpen your brain and earn Abstract Quest XP." }
    ],
    rewards: ["Weekly Cash Prize Pool", "+5 XP Exploration Reward", "Trivia Master Status"]
  },
  "225": {
    tagline: "Create NFT vaults, descend through depth tiers, and maximize your $DEPTH yields!",
    steps: [
      { title: "Create Vault", desc: "Lock your first soulbound NFT vault on the DEPTH Protocol platform." },
      { title: "Descend Tiers", desc: "Fulfill requirements to deepen your vault from the Shallows to the Mariana Trench." },
      { title: "Earn Tokens", desc: "Earn continuous $DEPTH token rewards based on your vault depth." }
    ],
    rewards: ["$DEPTH Token Stream", "+5 XP Exploration Reward", "Soulbound NFT Level Upgrades"]
  },
  "183": {
    tagline: "Swap tokens and yield farm on the core liquidity layer of Abstract!",
    steps: [
      { title: "Swap Tokens", desc: "Instantly swap between ETH and other tokens on the Aborean Finance interface." },
      { title: "Join Liquidity Pools", desc: "Add liquidity in token pairs to earn a share of trading fees." },
      { title: "Stake LP Tokens", desc: "Stake your LP tokens in gauges to earn additional yield incentives." }
    ],
    rewards: ["Trading Fee Share", "+5 XP Exploration Reward", "Liquidity Provider Rewards"]
  },
  "179": {
    tagline: "Lend and borrow assets with low-risk rates on Abstract!",
    steps: [
      { title: "Supply Collateral", desc: "Deposit your assets (e.g. ETH) as collateral on Kona DeFi." },
      { title: "Earn Interest", desc: "Earn automatic interest on your supplied collateral assets." },
      { title: "Borrow Stablecoins", desc: "Borrow stablecoins or other assets against your collateral safely." }
    ],
    rewards: ["Lending Interest Yield", "+5 XP Exploration Reward", "DeFi Borrowing Limits"]
  }
};

function getProjectTutorial(project: Project) {
  const custom = PROJECT_TUTORIALS[project.id];
  if (custom) return custom;

  const category = project.category?.toLowerCase() || "";
  const isGaming = category.includes("gaming") || category.includes("game") || category.includes("play") || category.includes("rpg");
  const isDeFi = category.includes("defi") || category.includes("finance") || category.includes("swap") || category.includes("yield");
  const isSocial = category.includes("social") || category.includes("friends") || category.includes("chat");

  if (isGaming) {
    return {
      tagline: `Enter the universe of ${project.name}, complete quests, and claim Web3 rewards!`,
      steps: [
        { title: "Connect Wallet", desc: "Connect your Abstract Global Wallet (AGW) to enter the game." },
        { title: "Choose Game Mode", desc: "Select PvE, PvP, or practice mode from the main menu." },
        { title: "Complete Quests", desc: "Complete daily and weekly in-game quests to earn points." },
        { title: "Claim Rewards", desc: "Open chests and boost your Abstract Quest progression." }
      ],
      rewards: ["In-Game Assets", "+5 XP Exploration Reward", "Special Quest Badges"]
    };
  } else if (isDeFi) {
    return {
      tagline: `Manage your assets on the ${project.name} DeFi protocol on Abstract!`,
      steps: [
        { title: "Connect Wallet", desc: "Connect your Abstract Global Wallet to the platform." },
        { title: "Select Action", desc: "Choose swap, lending, borrowing, or yield farming." },
        { title: "Execute Transaction", desc: "Confirm your transactions with low gas fees on Abstract." },
        { title: "Track Earnings", desc: "Monitor your portfolio and earnings directly from the dashboard." }
      ],
      rewards: ["Financial Yield", "+5 XP Exploration Reward", "DeFi Fee Discounts"]
    };
  } else if (isSocial) {
    return {
      tagline: `Join the Abstract community on ${project.name} and build your network!`,
      steps: [
        { title: "Create Profile", desc: "Connect your wallet and set up your profile name and avatar." },
        { title: "Engage with Others", desc: "Join channels, create posts, and interact with the community." },
        { title: "Unlock Roles", desc: "Complete community achievements to gain special roles and titles." }
      ],
      rewards: ["Community Roles", "+5 XP Exploration Reward", "Airdrop Whitelists"]
    };
  } else {
    return {
      tagline: `Explore and interact with the ${project.name} dApp on Abstract!`,
      steps: [
        { title: "Visit Platform", desc: "Click the button below to visit the site and connect your Abstract wallet." },
        { title: "Experience Features", desc: "Try the core features of the application and complete your first action." },
        { title: "Upvote Support", desc: "If you like the project, upvote it to help them climb the ecosystem ranks." }
      ],
      rewards: ["+5 XP Exploration Reward", "Abstract Ecosystem Access"]
    };
  }
}

function ProjectModal({ 
  project, 
  onClose,
  onUpvote,
  onLogin
}: { 
  project: Project; 
  onClose: () => void;
  onUpvote: (projectId: string) => Promise<void>;
  onLogin: () => void;
}) {
  const { address } = useAccount();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [rewarded, setRewarded] = useState(false);
  const [activeTab, setActiveTab] = useState<"about" | "tutorial" | "rewards">("about");

  const tutorial = getProjectTutorial(project);

  async function handleVisit() {
    setLoading(true);
    try {
      const res = await fetch("/api/ecosystem/click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: project.id,
          wallet: address,
        }),
      });
      const json = await res.json();
      if (address) {
        setRewarded(true);
        queryClient.invalidateQueries({ queryKey: ["user", address] });
        setTimeout(() => setRewarded(false), 3000);
      }
      window.open(json.data.url, "_blank");
    } catch (e) {
      window.open(project.websiteUrl, "_blank");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/75 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative flex w-full max-w-4xl h-[500px] max-h-[calc(100vh-32px)] flex-col overflow-hidden rounded-[24px] bg-[#0f1115]/95 border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.9)] backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-300">
        
        {/* Banner Section */}
        <div className="relative h-[140px] shrink-0 w-full bg-[#1c1c1e] overflow-hidden">
          {project.bannerUrl ? (
            <img 
              src={project.bannerUrl} 
              alt={`${project.name} banner`} 
              className="h-full w-full object-cover opacity-90 transition-opacity hover:opacity-100"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-green-500/10 to-blue-500/10">
              <Globe className="h-16 w-16 text-white/10" />
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f1115] via-[#0f1115]/20 to-transparent" />
          
          <button 
            onClick={onClose}
            className="absolute right-4 top-4 flex items-center gap-2 rounded-full bg-black/40 border border-white/10 px-4 py-2 text-white/80 backdrop-blur-md transition-all hover:bg-black/60 hover:text-white z-10"
          >
            <span className="text-sm font-semibold">Close</span>
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content Section */}
        <div className="relative flex flex-1 flex-col md:flex-row p-6 pt-0 min-h-0 gap-6">
          
          {/* Left Column: Brand Info & Primary Action */}
          <div className="flex flex-col w-full md:w-[250px] shrink-0 md:justify-between mb-6 md:mb-0">
            <div className="flex flex-col">
              {/* Logo & Upvote */}
              <div className="relative -mt-11 mb-3 flex justify-between items-end">
                <div className="h-[80px] w-[80px] shrink-0 overflow-hidden rounded-[22px] border-[4px] border-[#0f1115] bg-[#2c2c2e] shadow-xl z-10">
                  {project.logoUrl ? (
                    <img 
                      src={project.logoUrl} 
                      alt={`${project.name} logo`} 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[#2c2c2e]">
                      <ImageIcon className="h-9 w-9 text-white/20" />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 z-10">
                  <button
                    onClick={async () => {
                      if (!address) {
                        onLogin();
                      } else {
                        await onUpvote(project.id);
                      }
                    }}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border transition-all duration-300 relative group/vote ${
                      project.hasUpvoted
                        ? "bg-[#13D075]/15 border-[#13D075]/30 text-[#13D075] shadow-[0_0_12px_rgba(19,208,117,0.15)]"
                        : "bg-[#1c1c1e] border-white/10 text-white/70 hover:text-[#13D075] hover:border-[#13D075]/25 hover:bg-[#13D075]/5 hover:shadow-[0_0_8px_rgba(19,208,117,0.08)]"
                    }`}
                    title={address ? "Upvote Project" : "Connect Wallet to Upvote"}
                  >
                    <ArrowUp className="h-3.5 w-3.5 transition-transform duration-300 group-hover/vote:-translate-y-0.5" />
                    <span className="text-[11px] font-bold font-sans">Upvote ({project.upvotesCount || 0})</span>
                  </button>

                  {project.twitterUrl && (
                    <a 
                      href={project.twitterUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center h-9 w-9 shrink-0 rounded-xl bg-[#1c1c1e] border border-white/10 text-white hover:bg-white/10 transition-colors shadow-lg"
                      title="View on X (Twitter)"
                    >
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.008 3.824H5.035z" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight truncate shrink-0">{project.name}</h2>
              <a 
                href={project.websiteUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="mb-4 text-xs text-[#13D075] hover:text-[#13D075]/80 transition-colors truncate block font-medium shrink-0"
              >
                {project.websiteUrl}
              </a>

              {/* Stats Grid */}
              <div className="flex flex-col gap-2.5 mb-4 shrink-0">
                <div className="bg-white/[0.01] border border-white/5 p-2.5 rounded-xl flex justify-between items-center">
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Category</span>
                  <span className="text-xs font-bold text-white bg-white/5 px-2 py-0.5 rounded-md">{project.category || "Abstract App"}</span>
                </div>
                <div className="bg-white/[0.01] border border-white/5 p-2.5 rounded-xl flex justify-between items-center">
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Support</span>
                  <span className="text-xs font-bold text-white flex items-center gap-1">
                    <span>🔥</span> {project.upvotesCount || 0} Upvotes
                  </span>
                </div>
              </div>
            </div>

            {/* Visit button fixed at the bottom of the left column on desktop */}
            <div className="mt-auto pt-2 shrink-0">
              {rewarded && (
                <div className="mb-2 text-center text-[10px] font-bold text-[#13D075] animate-pulse">
                  ✓ Platform explored! +5 XP rewarded.
                </div>
              )}
              <button 
                disabled={loading}
                onClick={handleVisit}
                className="w-full rounded-xl bg-gradient-to-r from-[#13D075] to-[#10b063] py-3.5 font-bold text-black shadow-[0_0_15px_rgba(19,208,117,0.25)] transition-all hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(19,208,117,0.4)] active:scale-[0.98] disabled:opacity-50 text-xs"
              >
                {loading ? "Loading..." : "Visit Platform (+5 XP)"}
              </button>
            </div>
          </div>

          {/* Right Column: Dynamic Tabs (About, Tutorial, Rewards) */}
          <div className="flex-1 flex flex-col min-w-0 md:border-l border-white/5 md:pl-6 pt-4 md:pt-0 h-full overflow-hidden">
            {/* Tab Header */}
            <div className="flex gap-2 border-b border-white/5 pb-3 mb-4 shrink-0 overflow-x-auto no-scrollbar">
              {[
                { id: "about", label: "About" },
                { id: "tutorial", label: "Guide / Tutorial" },
                { id: "rewards", label: "Rewards & Quests" }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id as any)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                    activeTab === t.id
                      ? "bg-white/10 text-white shadow-md border border-white/15"
                      : "bg-transparent text-white/40 border border-transparent hover:text-white hover:bg-white/5"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Scrollable Tab Content Panel */}
            <div className="flex-1 overflow-y-auto no-scrollbar pr-1 min-h-0">
              {activeTab === "about" && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <h4 className="text-sm font-bold text-[#13D075] italic leading-snug">
                    "{tutorial.tagline}"
                  </h4>
                  <p className="text-sm text-white/70 leading-relaxed font-medium">
                    {project.description}
                  </p>
                  
                  {/* Context Note */}
                  <div className="text-xs text-white/30 leading-relaxed italic">
                    Note: Abstract Global Wallet (AGW) users benefit from frictionless interactions and gasless operations when interacting with {project.name}. Be sure to complete the associated quests to maximize your XP gains.
                  </div>
                </div>
              )}

              {activeTab === "tutorial" && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-1">Interactive Step-by-Step Guide</h4>
                  <div className="relative pl-6 border-l border-white/10 space-y-4 my-3 ml-6">
                    {tutorial.steps.map((step, idx) => (
                      <div key={idx} className="relative group/step">
                        {/* Timeline node - perfect circle centered on timeline line */}
                        <div className="absolute -left-[36px] top-[-3px] z-10 flex h-6 w-6 items-center justify-center rounded-full bg-[#0f1115] border border-white/10 group-hover/step:border-[#13D075] transition-colors shadow-sm">
                          <span className="text-[11px] font-bold text-[#13D075]">{idx + 1}</span>
                        </div>
                        <div className="text-xs font-bold text-[#13D075] uppercase tracking-wider mb-0.5">
                          {step.title}
                        </div>
                        <p className="text-xs text-white/50 leading-relaxed font-medium">
                          {step.desc}
                        </p>
                      </div>
                    ))}
                    {/* Glowing green node at the bottom of the timeline line */}
                    <div className="absolute -left-[3px] bottom-0 z-10 h-1.5 w-1.5 rounded-full bg-[#13D075] shadow-[0_0_8px_#13D075] animate-pulse" />
                  </div>
                </div>
              )}

              {activeTab === "rewards" && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                    <h5 className="text-[11px] font-black uppercase text-white/40 tracking-wider mb-3">Rewards Checklist</h5>
                    <ul className="space-y-2.5">
                      {tutorial.rewards.map((reward, idx) => (
                        <li key={idx} className="flex items-center gap-3 text-xs font-semibold text-white/80">
                          <div className="h-5 w-5 rounded-md bg-[#13D075]/10 border border-[#13D075]/25 flex items-center justify-center text-[#13D075] shrink-0 text-[10px] font-bold">
                            ✓
                          </div>
                          <span>{reward}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Sticky Bottom Card Area - perfectly aligned with left Visit button */}
            <div className="shrink-0 mt-4">
              {activeTab === "about" && (
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3 animate-in fade-in duration-200">
                  <h5 className="text-[11px] font-black uppercase text-white/40 tracking-wider">Ecosystem Profile</h5>
                  <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
                    <div>
                      <span className="block text-white/30 text-[10px] uppercase tracking-wider mb-0.5">Deployment</span>
                      <span className="text-white/80 font-mono">Abstract L2 Mainnet-ready</span>
                    </div>
                    <div>
                      <span className="block text-white/30 text-[10px] uppercase tracking-wider mb-0.5">Verification</span>
                      <span className="text-[#13D075]">Verified Community App</span>
                    </div>
                    <div>
                      <span className="block text-white/30 text-[10px] uppercase tracking-wider mb-0.5">Gas Optimization</span>
                      <span className="text-green">Paymaster Enabled</span>
                    </div>
                    <div>
                      <span className="block text-white/30 text-[10px] uppercase tracking-wider mb-0.5">Rating</span>
                      <span className="text-orange-400 font-mono">★★★★★ (5.0 / 5)</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "rewards" && (
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 animate-in fade-in duration-200">
                  <h5 className="text-[11px] font-black uppercase text-white/40 tracking-wider mb-2">XP Multipliers & Badges</h5>
                  <p className="text-xs text-white/50 leading-relaxed font-medium">
                    Every ecosystem verification gains you direct progression points. Completing all steps in the guide unlocks progress toward the prestigious <strong className="text-white">Ecosystem Explorer</strong> badge.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


const CATEGORIES = ["All", "Gaming", "DeFi", "Social", "Tooling"];

export default function EcosystemPage() {
  const { address } = useAccount();
  const { login } = useLoginWithAbstract();
  const queryClient = useQueryClient();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");

  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["ecosystem", address],
    queryFn: async () => {
      const url = address ? `/api/ecosystem?wallet=${address}` : "/api/ecosystem";
      const res = await fetch(url);
      const json = await res.json();
      return json.data ?? [];
    },
  });

  const activeProject = useMemo(() => {
    if (!selectedProject) return null;
    return projects.find(p => p.id === selectedProject.id) || selectedProject;
  }, [projects, selectedProject]);

  async function handleUpvote(projectId: string) {
    if (!address) return;
    try {
      const res = await fetch("/api/ecosystem/upvote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, wallet: address }),
      });
      if (res.ok) {
        queryClient.invalidateQueries({ queryKey: ["ecosystem", address] });
      }
    } catch (e) {
      console.error("Upvote failed", e);
    }
  }

  // Filter by category exactly, since projects are now correctly categorized in the DB
  const filteredProjects = useMemo(() => {
    if (activeCategory === "All") return projects;
    return projects.filter(
      p => (p.category?.toLowerCase() || "") === activeCategory.toLowerCase()
    );
  }, [projects, activeCategory]);

  return (
    <div className="mx-auto flex w-full max-w-[1000px] flex-col gap-6 px-4 py-8 sm:px-6 sm:py-10">
      
      {/* Sleek Header Section */}
      <div className="flex flex-col gap-2 mb-4">
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">Abstract Ecosystem</h1>
        <p className="text-white/50 text-base max-w-2xl">Discover and interact with the best dApps on Abstract.</p>
      </div>

      {/* Interactive Category Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-2 pb-2 overflow-x-auto no-scrollbar">
        {CATEGORIES.map(cat => {
          // Calculate count for this category
          const count = cat === "All" 
            ? projects.length 
            : projects.filter(
                p => (p.category?.toLowerCase() || "") === cat.toLowerCase()
              ).length;

          return (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-all border ${
                activeCategory === cat 
                  ? "bg-white/10 text-white border-white/20 shadow-lg" 
                  : "bg-transparent text-white/50 border-transparent hover:bg-white/5 hover:text-white"
              }`}
            >
              <span>{cat}</span>
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                activeCategory === cat ? "bg-white/20 text-white" : "bg-white/5 text-white/40"
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <div className="rounded-3xl bg-white/[0.02] border border-white/5 p-16 text-center shadow-xl">
          <div className="animate-pulse text-white/40 font-semibold tracking-widest uppercase text-sm">Loading Ecosystem...</div>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="rounded-3xl bg-white/[0.02] border border-white/5 p-16 text-center shadow-xl">
          <div className="text-white/40 font-semibold tracking-widest uppercase text-sm mb-2">No apps found</div>
          <p className="text-white/30 text-sm">Try selecting a different category.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredProjects.map((project) => (
            <div 
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className="group flex h-[116px] cursor-pointer items-center gap-6 rounded-[24px] bg-gradient-to-r from-[#1c1d22] to-[#15161a] p-5 backdrop-blur-xl border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.2)] transition-all duration-300 hover:border-[#13D075]/40 hover:from-[#22242a] hover:to-[#1a1c20] hover:-translate-y-1 hover:shadow-[0_8px_40px_rgba(19,208,117,0.15)]"
            >
              {/* Left: Logo */}
              <div className="h-[76px] w-[76px] shrink-0 overflow-hidden rounded-[20px] border border-white/10 bg-black/40 shadow-inner">
                {project.logoUrl ? (
                  <img src={project.logoUrl} alt={project.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-white/20 bg-gradient-to-br from-white/5 to-transparent">
                    <Globe className="h-8 w-8" />
                  </div>
                )}
              </div>

              {/* Middle Left: Title & Category */}
              <div className="flex w-[200px] shrink-0 flex-col justify-center">
                <h3 className="text-[19px] font-bold text-white transition-colors group-hover:text-[#13D075] truncate">{project.name}</h3>
                <span className="text-[13px] font-medium text-white/40 mt-1.5 tracking-wide uppercase truncate">{project.category || "Abstract App"}</span>
              </div>

              {/* Middle: Description (Truncated exactly to 2 lines) */}
              <div className="hidden flex-1 px-4 lg:block">
                <p className="line-clamp-2 h-[44px] text-[15px] leading-[22px] text-white/50 group-hover:text-white/70 transition-colors">
                  {project.description}
                </p>
              </div>

              {/* Right: Actions */}
              <div className="ml-auto flex shrink-0 items-center gap-3 sm:pl-4">
                 {/* Upvote Box */}
                 <button
                   onClick={async (e) => {
                     e.stopPropagation();
                     if (!address) {
                       login();
                     } else {
                       await handleUpvote(project.id);
                     }
                   }}
                   className={`flex flex-col items-center justify-center h-11 w-11 rounded-lg border transition-all duration-300 relative group/vote ${
                     project.hasUpvoted
                       ? "bg-[#13D075]/15 border-[#13D075]/30 text-[#13D075] shadow-[0_0_12px_rgba(19,208,117,0.15)]"
                       : "bg-white/[0.01] border-white/5 text-white/30 hover:text-[#13D075] hover:border-[#13D075]/25 hover:bg-[#13D075]/5 hover:shadow-[0_0_8px_rgba(19,208,117,0.08)]"
                   }`}
                   title={address ? "Upvote Project" : "Connect Wallet to Upvote"}
                 >
                   <ArrowUp className="h-3.5 w-3.5 transition-transform duration-300 group-hover/vote:-translate-y-0.5 group-active/vote:scale-90" />
                   <span className="text-[10px] font-black mt-0.5 tabular-nums leading-none">{project.upvotesCount || 0}</span>
                 </button>

                <div className="hidden items-center gap-1.5 rounded-full bg-white/5 border border-white/5 px-5 py-2.5 text-sm font-semibold text-white/60 transition-colors group-hover:bg-[#13D075]/10 group-hover:text-[#13D075] group-hover:border-[#13D075]/20 sm:flex">
                  Explore
                </div>
                
                <button className="flex h-11 w-11 items-center justify-center rounded-full bg-white/5 border border-white/5 text-white/40 transition-colors group-hover:bg-[#13D075]/20 group-hover:text-[#13D075] group-hover:border-[#13D075]/20">
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeProject && (
        <ProjectModal 
          project={activeProject} 
          onClose={() => setSelectedProject(null)} 
          onUpvote={handleUpvote}
          onLogin={login}
        />
      )}
    </div>
  );
}
