import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { wallet, username, avatar } = body;

    if (!wallet) {
      return NextResponse.json({ error: "wallet required" }, { status: 400 });
    }

    const updatedUser = await db.user.update({
      where: { wallet: wallet.toLowerCase() },
      data: {
        username: username !== undefined ? username : undefined,
        avatar: avatar !== undefined ? avatar : undefined,
      },
    });

    return NextResponse.json({ data: updatedUser });
  } catch (error: any) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
