import { db } from "./db";

export async function incrementRisk(wallet: string, amount: number, reason: string) {
  await db.user.update({
    where: { wallet: wallet.toLowerCase() },
    data: { riskScore: { increment: amount } },
  });
  console.warn(`[RISK] ${wallet} +${amount} (${reason})`);
}

export async function getRiskScore(wallet: string): Promise<number> {
  const user = await db.user.findUnique({
    where: { wallet: wallet.toLowerCase() },
    select: { riskScore: true },
  });
  return user?.riskScore ?? 0;
}
