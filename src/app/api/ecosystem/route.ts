import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const wallet = req.nextUrl.searchParams.get("wallet")?.toLowerCase() || "";

  const projects = await db.ecosystemProject.findMany({
    where: { active: true },
    include: {
      _count: { select: { upvotes: true } },
      upvotes: wallet ? { where: { wallet } } : undefined,
    },
  });

  const formatted = projects.map((p) => {
    const { upvotes, _count, ...rest } = p;
    return {
      ...rest,
      upvotesCount: _count.upvotes,
      hasUpvoted: (wallet && upvotes) ? upvotes.length > 0 : false,
    };
  });

  const sorted = formatted.sort((a, b) => {
    if (b.upvotesCount !== a.upvotesCount) {
      return b.upvotesCount - a.upvotesCount;
    }
    return a.name.localeCompare(b.name);
  });

  return NextResponse.json({ data: sorted });
}
