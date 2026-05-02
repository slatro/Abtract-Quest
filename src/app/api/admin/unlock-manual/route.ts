import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/adminAuth";
import { signUnlockPayload } from "@/lib/signer";

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { wallet, badgeId } = await req.json();
  if (!wallet || !badgeId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const result = await signUnlockPayload(wallet as `0x${string}`, Number(badgeId));
  return NextResponse.json({ data: result });
}
