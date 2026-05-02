import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const projects = await db.ecosystemProject.findMany({
    where: { active: true },
    orderBy: { name: "asc" },
  });
  return NextResponse.json({ data: projects });
}
