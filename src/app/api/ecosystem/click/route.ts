import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const { projectId, wallet, questId } = await req.json();
  if (!projectId) return NextResponse.json({ error: "projectId required" }, { status: 400 });

  const project = await db.ecosystemProject.findUnique({
    where: { id: projectId },
  });
  if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

  await db.referralClick.create({
    data: {
      projectId,
      wallet: wallet?.toLowerCase(),
      questId,
      refUsed: !!project.referralUrl,
    },
  });

  if (wallet) {
    const userWallet = wallet.toLowerCase();
    await db.user.upsert({
      where: { wallet: userWallet },
      update: { xp: { increment: 5 } },
      create: { wallet: userWallet, xp: 5 },
    });
  }

  // Hangi URL'yi kullanacagiz
  const url = project.referralUrl ?? project.websiteUrl;

  return NextResponse.json({ data: { url, refUsed: !!project.referralUrl } });
}
