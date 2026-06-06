import { ethers } from "hardhat";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const [deployer] = await ethers.getSigners();
  const signerWallet = new ethers.Wallet(process.env.BADGE_SIGNER_PRIVATE_KEY!);
  
  console.log("Deploying with:", deployer.address);
  console.log("Signer address:", signerWallet.address);

  const Factory = await ethers.getContractFactory("BadgeRush1155");
  const contract = await Factory.deploy(
    signerWallet.address,
    "https://meta.badgerush.xyz"
  );
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("BadgeRush1155 deployed to:", address);

  const badgePrices: Record<string, bigint> = {
    free:       0n,
    "0.0001 ETH": ethers.parseEther("0.0001"),
    "0.0005 ETH": ethers.parseEther("0.0005"),
    "0.001 ETH":  ethers.parseEther("0.001"),
    "0.002 ETH":  ethers.parseEther("0.002"),
  };

  console.log("Fetching badges from database...");
  const badges = await prisma.badge.findMany({ orderBy: { id: "asc" } });

  for (const b of badges) {
    const tx = await contract.createBadge(
      b.id,
      badgePrices[b.price] ?? 0n,
      b.maxSupply ?? 0,
      b.requiresUnlock,
      true
    );
    await tx.wait();
    console.log(`Badge ${b.id} created on-chain`);
  }

  console.log("\nDeploy tamamlandı.");
  console.log("NEXT_PUBLIC_CONTRACT_ADDRESS=" + address);
}

main().catch((e) => { console.error(e); process.exit(1); });
