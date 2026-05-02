import { db } from "./db";

export async function isBlocked(wallet: string): Promise<boolean> {
  const entry = await db.blocklist.findUnique({
    where: { wallet: wallet.toLowerCase() },
  });
  return !!entry;
}
