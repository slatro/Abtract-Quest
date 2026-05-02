import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  const Factory = await ethers.getContractFactory("BadgeRush1155");
  const contract = await Factory.deploy(
    deployer.address,
    "https://meta.badgerush.xyz"
  );
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("BadgeRush1155 deployed to:", address);

  // Badge fiyatları wei cinsinden
  const badgePrices: Record<string, bigint> = {
    free:       0n,
    "0.0001 ETH": ethers.parseEther("0.0001"),
    "0.0005 ETH": ethers.parseEther("0.0005"),
    "0.001 ETH":  ethers.parseEther("0.001"),
    "0.002 ETH":  ethers.parseEther("0.002"),
  };

  // Seed dosyasındaki aynı badge listesi burada da kullanılır
  const badges = [
    { id: 1,  price: "free",       maxSupply: 0,    requiresUnlock: false, onePerWallet: true },
    { id: 2,  price: "0.0001 ETH", maxSupply: 0,    requiresUnlock: true,  onePerWallet: true },
    // ... 42'ye kadar devam et, seed.ts ile aynı sıra
    { id: 7,  price: "0.001 ETH",  maxSupply: 1000, requiresUnlock: true,  onePerWallet: true },
    { id: 42, price: "0.001 ETH",  maxSupply: 500,  requiresUnlock: true,  onePerWallet: true },
  ];

  for (const b of badges) {
    const tx = await contract.createBadge(
      b.id,
      badgePrices[b.price] ?? 0n,
      b.maxSupply,
      b.requiresUnlock,
      b.onePerWallet
    );
    await tx.wait();
    console.log(`Badge ${b.id} created`);
  }

  console.log("\nDeploy tamamlandı.");
  console.log("NEXT_PUBLIC_CONTRACT_ADDRESS=" + address);
  console.log(".env.local dosyasına bu adresi ekle.");
}

main().catch((e) => { console.error(e); process.exit(1); });
