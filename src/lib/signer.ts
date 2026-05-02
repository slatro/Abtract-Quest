import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { UnlockPayload } from "@/types";
import { randomBytes } from "crypto";

const account = privateKeyToAccount(
  process.env.BADGE_SIGNER_PRIVATE_KEY as `0x${string}`
);

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;
const CHAIN_ID = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || "2741");

const domain = {
  name: "BadgeRush",
  version: "1",
  chainId: CHAIN_ID,
  verifyingContract: CONTRACT_ADDRESS,
} as const;

const types = {
  UnlockPayload: [
    { name: "user",            type: "address" },
    { name: "badgeId",         type: "uint256" },
    { name: "chainId",         type: "uint256" },
    { name: "contractAddress", type: "address" },
    { name: "nonce",           type: "bytes32"  },
    { name: "expiry",          type: "uint256"  },
  ],
} as const;

export async function signUnlockPayload(
  wallet: `0x${string}`,
  badgeId: number
): Promise<{ payload: UnlockPayload; signature: `0x${string}` }> {
  const nonce = ("0x" + randomBytes(32).toString("hex")) as `0x${string}`;
  const expiry = Math.floor(Date.now() / 1000) + 600; // 10 dakika geçerli

  const payload: UnlockPayload = {
    user: wallet,
    badgeId,
    chainId: CHAIN_ID,
    contractAddress: CONTRACT_ADDRESS,
    nonce,
    expiry,
  };

  const client = createWalletClient({
    account,
    transport: http(),
  });

  const signature = await client.signTypedData({
    domain,
    types,
    primaryType: "UnlockPayload",
    message: payload,
  });

  return { payload, signature };
}
