import "dotenv/config";
import { Client } from "pg";

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  await client.connect();

  await client.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'UnlockSource') THEN
        CREATE TYPE "UnlockSource" AS ENUM (
          'default_access',
          'quest',
          'checkin',
          'streak',
          'quiz',
          'perfect_score',
          'full_set',
          'admin'
        );
      END IF;
    END $$;
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS "BadgeUnlock" (
      "id" TEXT PRIMARY KEY,
      "userId" TEXT NOT NULL,
      "badgeId" INTEGER NOT NULL,
      "source" "UnlockSource" NOT NULL,
      "sourceRef" TEXT,
      "unlockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "BadgeUnlock_userId_fkey"
        FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
      CONSTRAINT "BadgeUnlock_badgeId_fkey"
        FOREIGN KEY ("badgeId") REFERENCES "Badge"("id") ON DELETE RESTRICT ON UPDATE CASCADE
    );
  `);

  await client.query(`
    CREATE UNIQUE INDEX IF NOT EXISTS "BadgeUnlock_userId_badgeId_key"
    ON "BadgeUnlock" ("userId", "badgeId");
  `);

  await client.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
