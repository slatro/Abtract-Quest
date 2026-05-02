import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const quests = [
  // Daily
  {
    id: "quest-daily-checkin",
    title: "Daily Check-in",
    description: "Check in today to keep your streak alive.",
    type: "daily",
    xpReward: 50,
    badgeId: 4, // Daily Looper
    cooldownMin: 1440,
    active: true,
  },
  // Visit quests
  {
    id: "quest-visit-abscan",
    title: "Visit Abstractscan",
    description: "Explore the Abstract block explorer.",
    type: "visit",
    xpReward: 100,
    badgeId: 6, // Ecosystem Explorer
    cooldownMin: 10080,
    active: true,
  },
  {
    id: "quest-visit-abstract-home",
    title: "Visit Abstract.xyz",
    description: "Explore the official Abstract website.",
    type: "visit",
    xpReward: 75,
    badgeId: 1, // First Portal Step
    cooldownMin: 10080,
    active: true,
  },
  {
    id: "quest-visit-agw-docs",
    title: "Read AGW Docs",
    description: "Learn how Abstract Global Wallet works.",
    type: "visit",
    xpReward: 100,
    badgeId: 5, // Gasless Tourist
    cooldownMin: 10080,
    active: true,
  },
  // Social quests
  {
    id: "quest-follow-abstract-x",
    title: "Follow @AbstractChain on X",
    description: "Follow the official Abstract X account.",
    type: "social",
    xpReward: 75,
    badgeId: null,
    cooldownMin: 99999,
    active: true,
  },
  {
    id: "quest-join-abstract-discord",
    title: "Join Abstract Discord",
    description: "Join the official Abstract community.",
    type: "social",
    xpReward: 75,
    badgeId: null,
    cooldownMin: 99999,
    active: true,
  },
  // Streak quests
  {
    id: "quest-streak-3",
    title: "3-Day Streak",
    description: "Check in 3 days in a row.",
    type: "streak",
    xpReward: 200,
    badgeId: 23, // Streak Addict
    cooldownMin: 99999,
    active: true,
  },
  {
    id: "quest-streak-7",
    title: "7-Day Streak",
    description: "Check in 7 days in a row.",
    type: "streak",
    xpReward: 500,
    badgeId: 23,
    cooldownMin: 99999,
    active: true,
  },
  {
    id: "quest-streak-30",
    title: "30-Day Streak",
    description: "Check in 30 days in a row.",
    type: "streak",
    xpReward: 2000,
    badgeId: 23,
    cooldownMin: 99999,
    active: true,
  },
  // Quiz quests
  {
    id: "quest-quiz-abstract-basics",
    title: "Abstract Basics Quiz",
    description: "Test your knowledge of Abstract fundamentals.",
    type: "quiz",
    xpReward: 150,
    badgeId: 36, // Quiz Rookie
    cooldownMin: 1440,
    active: true,
  },
  {
    id: "quest-quiz-nft-culture",
    title: "NFT Culture Quiz",
    description: "How well do you know NFT history?",
    type: "quiz",
    xpReward: 150,
    badgeId: 37, // Knowledge Miner
    cooldownMin: 1440,
    active: true,
  },
  {
    id: "quest-quiz-agw",
    title: "AGW & Account Abstraction Quiz",
    description: "Deep dive into Abstract Global Wallet.",
    type: "quiz",
    xpReward: 200,
    badgeId: 38, // Lore Collector
    cooldownMin: 1440,
    active: true,
  },
  // Hidden
  {
    id: "quest-hidden-portal",
    title: "???",
    description: "Something is hidden here.",
    type: "hidden",
    xpReward: 500,
    badgeId: 27, // Hidden Route Finder
    cooldownMin: 99999,
    active: true,
  },
];

async function main() {
  console.log("Seeding quests...");

  for (const quest of quests) {
    await prisma.quest.upsert({
      where: { id: quest.id },
      update: quest,
      create: quest,
    });
  }

  console.log(`Seeded ${quests.length} quests.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
