import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const badges = [
  // Genesis Abstract Set
  { id: 1,  name: "First Portal Step",    emoji: "🚪", rarity: "common",    setName: "Genesis Abstract",   isMaster: false, price: "free",       lore: "You stepped through the portal for the first time." },
  { id: 2,  name: "No-Popup Pioneer",     emoji: "🔇", rarity: "uncommon",  setName: "Genesis Abstract",   isMaster: false, price: "0.0001 ETH", lore: "The popups never stood a chance." },
  { id: 3,  name: "App Voter",            emoji: "🗳️", rarity: "common",    setName: "Genesis Abstract",   isMaster: false, price: "free",       lore: "You cast your vote. Your signal matters." },
  { id: 4,  name: "Daily Looper",         emoji: "🔄", rarity: "common",    setName: "Genesis Abstract",   isMaster: false, price: "free",       lore: "Every day. Without fail." },
  { id: 5,  name: "Gasless Tourist",      emoji: "⛽", rarity: "uncommon",  setName: "Genesis Abstract",   isMaster: false, price: "0.0001 ETH", lore: "Abstract is cheap. Embarrassingly cheap." },
  { id: 6,  name: "Ecosystem Explorer",   emoji: "🗺️", rarity: "rare",      setName: "Genesis Abstract",   isMaster: false, price: "0.0005 ETH", lore: "You found the stuff most users never see." },
  { id: 7,  name: "Abstract Native Crest",emoji: "👑", rarity: "legendary", setName: "Genesis Abstract",   isMaster: true,  price: "0.001 ETH",  lore: "Complete the Genesis Abstract Set to unlock." },
  // NFT Boomer Set
  { id: 8,  name: "Mint Day Veteran",     emoji: "🪖", rarity: "uncommon",  setName: "NFT Boomer",         isMaster: false, price: "0.0001 ETH", lore: "You survived a real mint day." },
  { id: 9,  name: "Reveal Survivor",      emoji: "🎭", rarity: "rare",      setName: "NFT Boomer",         isMaster: false, price: "0.0005 ETH", lore: "The curtain dropped. Your metadata loaded." },
  { id: 10, name: "Gas War Ghost",        emoji: "👻", rarity: "rare",      setName: "NFT Boomer",         isMaster: false, price: "0.0005 ETH", lore: "You paid more in gas than the NFT was worth." },
  { id: 11, name: "Floor Watcher",        emoji: "📉", rarity: "common",    setName: "NFT Boomer",         isMaster: false, price: "free",       lore: "F5. F5. F5." },
  { id: 12, name: "JPEG Believer",        emoji: "🖼️", rarity: "common",    setName: "NFT Boomer",         isMaster: false, price: "free",       lore: "People called it speculation. Still holding." },
  { id: 13, name: "Diamond Hands Relic",  emoji: "💎", rarity: "rare",      setName: "NFT Boomer",         isMaster: false, price: "0.0005 ETH", lore: "The floor went to zero. You didn't blink." },
  { id: 14, name: "Culture Survivor Crest",emoji:"🏺", rarity: "legendary", setName: "NFT Boomer",         isMaster: true,  price: "0.001 ETH",  lore: "Complete the NFT Boomer Set to unlock." },
  // Degenerate Utility Set
  { id: 15, name: "Rug Detector",         emoji: "🛡️", rarity: "uncommon",  setName: "Degenerate Utility", isMaster: false, price: "0.0001 ETH", lore: "You smelled the rug anyway." },
  { id: 16, name: "Trait Goblin",         emoji: "👺", rarity: "uncommon",  setName: "Degenerate Utility", isMaster: false, price: "0.0001 ETH", lore: "You knew the trait values before the contract was verified." },
  { id: 17, name: "Metadata Sniper",      emoji: "🎯", rarity: "rare",      setName: "Degenerate Utility", isMaster: false, price: "0.0005 ETH", lore: "You pulled the metadata before anyone else." },
  { id: 18, name: "Whitelist Hunter",     emoji: "📋", rarity: "common",    setName: "Degenerate Utility", isMaster: false, price: "free",       lore: "You did the tasks. You got the WL." },
  { id: 19, name: "Liquidity Tourist",    emoji: "🌊", rarity: "common",    setName: "Degenerate Utility", isMaster: false, price: "free",       lore: "You left when the APR dropped." },
  { id: 20, name: "PFP Archaeologist",    emoji: "🔬", rarity: "rare",      setName: "Degenerate Utility", isMaster: false, price: "0.0005 ETH", lore: "You can date a collection by its art style." },
  { id: 21, name: "Utility Goblin Crest", emoji: "⚙️", rarity: "legendary", setName: "Degenerate Utility", isMaster: true,  price: "0.001 ETH",  lore: "Complete the Degenerate Utility Set to unlock." },
  // Portal Personality Set
  { id: 22, name: "Badge Goblin",         emoji: "🏷️", rarity: "common",    setName: "Portal Personality", isMaster: false, price: "free",       lore: "You just wanted every single badge." },
  { id: 23, name: "Streak Addict",        emoji: "🔥", rarity: "uncommon",  setName: "Portal Personality", isMaster: false, price: "0.0001 ETH", lore: "You have a reminder set. You're not missing this streak." },
  { id: 24, name: "One-Tap Enjoyer",      emoji: "⚡", rarity: "uncommon",  setName: "Portal Personality", isMaster: false, price: "0.0001 ETH", lore: "Gasless. Frictionless. You came, you tapped." },
  { id: 25, name: "Quest Sweeper",        emoji: "🧹", rarity: "rare",      setName: "Portal Personality", isMaster: false, price: "0.0005 ETH", lore: "Every quest. Every day." },
  { id: 26, name: "Late Night Grinder",   emoji: "🌙", rarity: "common",    setName: "Portal Personality", isMaster: false, price: "free",       lore: "2am. Still here. Some people sleep." },
  { id: 27, name: "Hidden Route Finder",  emoji: "🗝️", rarity: "rare",      setName: "Portal Personality", isMaster: false, price: "0.0005 ETH", lore: "You found the page that wasn't in the nav." },
  { id: 28, name: "Portal Maniac Crest",  emoji: "🌀", rarity: "legendary", setName: "Portal Personality", isMaster: true,  price: "0.001 ETH",  lore: "Complete the Portal Personality Set to unlock." },
  // Culture Tribute Set
  { id: 29, name: "Penguin Energy",       emoji: "🐧", rarity: "uncommon",  setName: "Culture Tribute",    isMaster: false, price: "0.0001 ETH", lore: "Cozy. Composed. Collective." },
  { id: 30, name: "Cozy Holder",          emoji: "🛋️", rarity: "common",    setName: "Culture Tribute",    isMaster: false, price: "free",       lore: "You hold. You don't flip. You don't stress." },
  { id: 31, name: "Green Portal Energy",  emoji: "🌿", rarity: "common",    setName: "Culture Tribute",    isMaster: false, price: "free",       lore: "Abstract green runs through everything you touch." },
  { id: 32, name: "Consumer Crypto Believer", emoji: "📱", rarity: "rare",  setName: "Culture Tribute",    isMaster: false, price: "0.0005 ETH", lore: "Real apps. Real users. Real Abstract." },
  { id: 33, name: "Portal Petter",        emoji: "🤝", rarity: "uncommon",  setName: "Culture Tribute",    isMaster: false, price: "0.0001 ETH", lore: "You clicked the penguin. Multiple times." },
  { id: 34, name: "Mini Empire Builder",  emoji: "🏗️", rarity: "rare",      setName: "Culture Tribute",    isMaster: false, price: "0.0005 ETH", lore: "Badge by badge. Quest by quest." },
  { id: 35, name: "Culture Signal Crest", emoji: "📡", rarity: "legendary", setName: "Culture Tribute",    isMaster: true,  price: "0.001 ETH",  lore: "Complete the Culture Tribute Set to unlock." },
  // Quiz Master Set
  { id: 36, name: "Quiz Rookie",          emoji: "📚", rarity: "common",    setName: "Quiz Master",        isMaster: false, price: "free",       lore: "You passed your first quiz." },
  { id: 37, name: "Knowledge Miner",      emoji: "⛏️", rarity: "common",    setName: "Quiz Master",        isMaster: false, price: "free",       lore: "Five quizzes in. Digging deeper." },
  { id: 38, name: "Lore Collector",       emoji: "📜", rarity: "uncommon",  setName: "Quiz Master",        isMaster: false, price: "0.0001 ETH", lore: "You know the lore. The history. The context." },
  { id: 39, name: "Perfect Score",        emoji: "🎯", rarity: "rare",      setName: "Quiz Master",        isMaster: false, price: "0.0005 ETH", lore: "100%. No mistakes. Pure knowledge." },
  { id: 40, name: "Ecosystem Analyst",    emoji: "🔭", rarity: "rare",      setName: "Quiz Master",        isMaster: false, price: "0.0005 ETH", lore: "You know more about Abstract than most builders." },
  { id: 41, name: "Portal Professor",     emoji: "🎓", rarity: "epic",      setName: "Quiz Master",        isMaster: false, price: "0.002 ETH",  lore: "All 20 starter quizzes. You are the professor now." },
  { id: 42, name: "Portal Scholar Crest", emoji: "🏛️", rarity: "legendary", setName: "Quiz Master",        isMaster: true,  price: "0.001 ETH",  lore: "Complete the Quiz Master Set to unlock." },
];

const badgeSets = [
  { name: "Genesis Abstract",   masterBadgeId: 7  },
  { name: "NFT Boomer",         masterBadgeId: 14 },
  { name: "Degenerate Utility", masterBadgeId: 21 },
  { name: "Portal Personality", masterBadgeId: 28 },
  { name: "Culture Tribute",    masterBadgeId: 35 },
  { name: "Quiz Master",        masterBadgeId: 42 },
];

async function main() {
  console.log("Seeding badges...");

  for (const badge of badges) {
    await prisma.badge.upsert({
      where: { id: badge.id },
      update: badge,
      create: { ...badge, requiresUnlock: !badge.isMaster },
    });
  }

  for (const set of badgeSets) {
    await prisma.badgeSet.upsert({
      where: { name: set.name },
      update: set,
      create: set,
    });
  }

  console.log(`Seeded ${badges.length} badges and ${badgeSets.length} sets.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
