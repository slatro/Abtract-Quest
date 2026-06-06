import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const badgeCount = await db.badge.count();
    return NextResponse.json({ status: "ok", badgeCount, time: Date.now() });
  } catch (error: any) {
    return NextResponse.json({
      status: "error",
      message: error.message || "Unknown error",
      stack: error.stack || "",
      time: Date.now(),
    });
  }
}
