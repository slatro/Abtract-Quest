import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/adminAuth";

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const list = await db.blocklist.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ data: list });
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { wallet, reason } = await req.json();
  const entry = await db.blocklist.upsert({
    where: { wallet: wallet.toLowerCase() },
    update: { reason },
    create: { wallet: wallet.toLowerCase(), reason },
  });
  return NextResponse.json({ data: entry });
}

export async function DELETE(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { wallet } = await req.json();
  await db.blocklist.delete({ where: { wallet: wallet.toLowerCase() } });
  return NextResponse.json({ data: { success: true } });
}
