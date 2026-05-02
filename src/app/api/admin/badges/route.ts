import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/adminAuth";

// GET — tüm badge'leri listele
export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const badges = await db.badge.findMany({
    orderBy: { id: "asc" },
  });
  return NextResponse.json({ data: badges });
}

// POST — yeni badge oluştur
export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const badge = await db.badge.create({ data: body });
  return NextResponse.json({ data: badge });
}

// PATCH — badge güncelle
export async function PATCH(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, ...data } = await req.json();
  const badge = await db.badge.update({
    where: { id: Number(id) },
    data,
  });
  return NextResponse.json({ data: badge });
}
