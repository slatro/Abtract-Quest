import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { projectId, wallet } = await req.json();
    if (!projectId || !wallet) {
      return NextResponse.json({ error: "projectId and wallet are required" }, { status: 400 });
    }

    const userWallet = wallet.toLowerCase();

    // Check if upvote exists
    const existing = await db.ecosystemUpvote.findUnique({
      where: {
        wallet_projectId: {
          wallet: userWallet,
          projectId,
        },
      },
    });

    let upvoted = false;

    if (existing) {
      // Toggle off: Delete upvote
      await db.ecosystemUpvote.delete({
        where: {
          wallet_projectId: {
            wallet: userWallet,
            projectId,
          },
        },
      });
      upvoted = false;
    } else {
      // Toggle on: Create upvote
      await db.ecosystemUpvote.create({
        data: {
          wallet: userWallet,
          projectId,
        },
      });
      upvoted = true;
    }

    // Get new count
    const count = await db.ecosystemUpvote.count({
      where: { projectId },
    });

    return NextResponse.json({ data: { upvoted, count } });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
