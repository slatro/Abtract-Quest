import { db } from "./db";

export async function isBlocked(wallet: string): Promise<boolean> {
  try {
    const entry = await db.blocklist.findUnique({
      where: { wallet: wallet.toLowerCase() },
    });
    return !!entry;
  } catch (error) {
    console.error("Database connection failed during blocklist check, assuming not blocked:", error);
    return false;
  }
}
