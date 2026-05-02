export type RarityTier =
  | "common"
  | "uncommon"
  | "rare"
  | "epic"
  | "legendary";

export type QuestType =
  | "daily"
  | "visit"
  | "social"
  | "quiz"
  | "streak"
  | "hidden";

export interface Badge {
  id: number;
  name: string;
  emoji: string;
  rarity: RarityTier;
  setName: string;
  isMaster: boolean;
  price: string;        // "free" veya "0.0005 ETH" formatında
  requiresUnlock: boolean;
  lore: string;
  active: boolean;
  mintedCount: number;
  maxSupply: number | null;
  owned?: boolean;      // kullanıcıya özel, DB'den gelir
  unlocked?: boolean;   // kullanıcıya özel, quest tamamlandı mı
}

export interface BadgeSet {
  id: string;
  name: string;
  masterBadgeId: number;
  badges: Badge[];
  ownedCount: number;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: QuestType;
  xpReward: number;
  badgeId: number | null;
  cooldownMin: number;
  active: boolean;
  completed?: boolean;
  completedAt?: string;
}

export interface User {
  id: string;
  wallet: string;
  xp: number;
  streak: number;
  lastCheckIn: string | null;
  ownedBadgeIds: number[];
}

export interface UnlockPayload {
  user: `0x${string}`;
  badgeId: number;
  chainId: number;
  contractAddress: `0x${string}`;
  nonce: string;
  expiry: number;
}

export interface UnlockSignatureResponse {
  payload: UnlockPayload;
  signature: `0x${string}`;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}
