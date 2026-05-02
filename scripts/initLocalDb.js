const { Client } = require("pg");

const sql = `
DO $$ BEGIN
  CREATE TYPE "Rarity" AS ENUM ('common','uncommon','rare','epic','legendary');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "QuestType" AS ENUM ('daily','visit','social','quiz','streak','hidden');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS "User" (
  id TEXT PRIMARY KEY,
  wallet TEXT UNIQUE NOT NULL,
  xp INTEGER NOT NULL DEFAULT 0,
  "riskScore" INTEGER NOT NULL DEFAULT 0,
  streak INTEGER NOT NULL DEFAULT 0,
  "lastCheckIn" TIMESTAMP,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "Badge" (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  emoji TEXT NOT NULL,
  rarity "Rarity" NOT NULL,
  "setName" TEXT NOT NULL,
  "isMaster" BOOLEAN NOT NULL DEFAULT FALSE,
  price TEXT NOT NULL DEFAULT 'free',
  "requiresUnlock" BOOLEAN NOT NULL DEFAULT TRUE,
  lore TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  "mintedCount" INTEGER NOT NULL DEFAULT 0,
  "maxSupply" INTEGER
);

CREATE TABLE IF NOT EXISTS "BadgeSet" (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  "masterBadgeId" INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS "Quest" (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type "QuestType" NOT NULL,
  "xpReward" INTEGER NOT NULL,
  "badgeId" INTEGER,
  "visitUrl" TEXT,
  "cooldownMin" INTEGER NOT NULL DEFAULT 1440,
  active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS "QuestCompletion" (
  id TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  "questId" TEXT NOT NULL REFERENCES "Quest"(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  "completedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "MintRecord" (
  id TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  "badgeId" INTEGER NOT NULL REFERENCES "Badge"(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  "txHash" TEXT UNIQUE NOT NULL,
  "mintedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "MintNonce" (
  id TEXT PRIMARY KEY,
  nonce TEXT UNIQUE NOT NULL,
  wallet TEXT NOT NULL,
  "badgeId" INTEGER NOT NULL,
  used BOOLEAN NOT NULL DEFAULT FALSE,
  expiry TIMESTAMP NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "Quiz" (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL DEFAULT 'medium',
  "badgeId" INTEGER,
  active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS "QuizQuestion" (
  id TEXT PRIMARY KEY,
  "quizId" TEXT NOT NULL REFERENCES "Quiz"(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  question TEXT NOT NULL,
  answers TEXT[] NOT NULL,
  "correctIndex" INTEGER NOT NULL,
  explanation TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS "QuizAttempt" (
  id TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  "quizId" TEXT NOT NULL REFERENCES "Quiz"(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  score INTEGER NOT NULL,
  "totalQ" INTEGER NOT NULL,
  passed BOOLEAN NOT NULL,
  "completedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "Blocklist" (
  id TEXT PRIMARY KEY,
  wallet TEXT UNIQUE NOT NULL,
  reason TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "Allowlist" (
  id TEXT PRIMARY KEY,
  wallet TEXT UNIQUE NOT NULL,
  note TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "EcosystemProject" (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  "websiteUrl" TEXT NOT NULL,
  "referralUrl" TEXT,
  "twitterUrl" TEXT,
  "discordUrl" TEXT,
  "telegramUrl" TEXT,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "ReferralClick" (
  id TEXT PRIMARY KEY,
  "projectId" TEXT NOT NULL REFERENCES "EcosystemProject"(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  wallet TEXT,
  "questId" TEXT,
  "refUsed" BOOLEAN NOT NULL DEFAULT FALSE,
  "clickedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);
`;

async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  await client.query(sql);
  await client.end();
  console.log("schema-ok");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
