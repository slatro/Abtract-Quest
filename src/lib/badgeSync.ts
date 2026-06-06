import { db } from "@/lib/db";
import { createPublicClient, http } from "viem";
import { abstractTestnet } from "viem/chains";
import BADGE_RUSH_ABI from "@/lib/abi/BadgeRush1155.json";

const publicClient = createPublicClient({
  chain: abstractTestnet,
  transport: http("https://api.testnet.abs.xyz"),
});

export async function syncOnChainBadges(wallet: string, userId: string) {
  try {
    const badges = await db.badge.findMany({
      select: { id: true }
    });
    if (badges.length === 0) return;

    const badgeIds = badges.map((b) => BigInt(b.id));
    const accounts = badgeIds.map(() => wallet as `0x${string}`);

    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
    if (!contractAddress) {
      console.warn("NEXT_PUBLIC_CONTRACT_ADDRESS not configured, skipping sync.");
      return;
    }

    // Onchain balance check for all badges in batch
    const balances = (await publicClient.readContract({
      address: contractAddress as `0x${string}`,
      abi: BADGE_RUSH_ABI,
      functionName: "balanceOfBatch",
      args: [accounts, badgeIds],
    })) as bigint[];

    // Fetch existing DB mint records
    const existingMintRecords = await db.mintRecord.findMany({
      where: { userId },
      select: { badgeId: true }
    });
    const dbOwnedIds = new Set(existingMintRecords.map((r) => r.badgeId));

    const missingRecords: number[] = [];
    for (let i = 0; i < badges.length; i++) {
      const badgeId = badges[i].id;
      const balance = balances[i];
      if (balance > 0n && !dbOwnedIds.has(badgeId)) {
        missingRecords.push(badgeId);
      }
    }

    if (missingRecords.length > 0) {
      console.log(`Sync: Detected ${missingRecords.length} on-chain badges not registered in DB for ${wallet}. Syncing...`);
      await db.$transaction(
        missingRecords.map((badgeId) =>
          db.mintRecord.create({
            data: {
              userId,
              badgeId,
              txHash: `sync-chain-${wallet.toLowerCase()}-${badgeId}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            },
          })
        )
      );
    }
  } catch (error) {
    console.error(`Failed to sync on-chain badges for wallet ${wallet}:`, error);
  }
}
