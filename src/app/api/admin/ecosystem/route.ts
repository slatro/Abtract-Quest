import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/adminAuth";

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const projects = await db.ecosystemProject.findMany({
    include: { _count: { select: { referralClicks: true } } },
    orderBy: { name: "asc" },
  });
  return NextResponse.json({ data: projects });
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const project = await db.ecosystemProject.create({ data: body });
  return NextResponse.json({ data: project });
}

export async function PATCH(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, ...data } = await req.json();
  const project = await db.ecosystemProject.update({ where: { id }, data });
  return NextResponse.json({ data: project });
}
