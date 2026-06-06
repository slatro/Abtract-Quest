import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/adminAuth";

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { action, wallet, xpValue } = await req.json();
  if (!wallet) {
    return NextResponse.json({ error: "Wallet is required" }, { status: 400 });
  }

  const walletLower = wallet.toLowerCase();

  try {
    const user = await db.user.findUnique({
      where: { wallet: walletLower },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (action === "modifyXp") {
      if (xpValue === undefined || isNaN(Number(xpValue))) {
        return NextResponse.json({ error: "Valid XP value is required" }, { status: 400 });
      }
      const updated = await db.user.update({
        where: { id: user.id },
        data: { xp: Number(xpValue) },
      });
      return NextResponse.json({ data: { success: true, xp: updated.xp } });
    }

    if (action === "resetQuests") {
      await db.$transaction([
        db.questCompletion.deleteMany({ where: { userId: user.id } }),
        db.badgeUnlock.deleteMany({ where: { userId: user.id } }),
        db.mintRecord.deleteMany({ where: { userId: user.id } }),
        db.user.update({
          where: { id: user.id },
          data: { streak: 0, xp: 0 },
        }),
      ]);
      return NextResponse.json({ data: { success: true } });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("Admin user action error:", error);
    return NextResponse.json({ error: error.message || "Action failed" }, { status: 500 });
  }
}
