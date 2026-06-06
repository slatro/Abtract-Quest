import { db } from "../src/lib/db";

async function main() {
  const wallet = "0xDf0b8BFEe60AC7F7F75D754aEd564f9bF6E2A6fF".toLowerCase();
  const user = await db.user.findUnique({
    where: { wallet },
    include: {
      mintRecords: {
        include: { badge: true }
      },
      badgeUnlocks: {
        include: { badge: true }
      }
    }
  });
  console.log("USER:", JSON.stringify(user, null, 2));
}

main().catch(console.error);
