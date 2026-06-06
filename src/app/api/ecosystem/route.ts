import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { STATIC_ECOSYSTEM } from "@/lib/staticData";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const wallet = req.nextUrl.searchParams.get("wallet")?.toLowerCase() || "";

  let formatted: any[] = [];
  try {
    const projects = await db.ecosystemProject.findMany({
      where: { active: true },
      include: {
        _count: { select: { upvotes: true } },
        upvotes: wallet ? { where: { wallet } } : undefined,
      },
    });

    formatted = projects.map((p) => {
      const { upvotes, _count, ...rest } = p;
      return {
        ...rest,
        upvotesCount: _count.upvotes,
        hasUpvoted: (wallet && upvotes) ? upvotes.length > 0 : false,
      };
    });
  } catch (error) {
    console.error("Database connection failed, using static ecosystem fallback:", error);
    formatted = (STATIC_ECOSYSTEM as any[]).map((app) => ({
      id: app.id.toString(),
      name: app.name,
      description: app.description || "",
      category: app.category || "App",
      websiteUrl: app.link || "",
      logoUrl: app.localLogoUrl || app.icon || null,
      bannerUrl: app.localBannerUrl || app.banner || null,
      twitterUrl: app.twitterUrl || null,
      active: true,
      upvotesCount: 0,
      hasUpvoted: false,
    }));
  }

  const sorted = formatted.sort((a, b) => {
    if (b.upvotesCount !== a.upvotesCount) {
      return b.upvotesCount - a.upvotesCount;
    }
    return a.name.localeCompare(b.name);
  });

  return NextResponse.json({ data: sorted });
}
