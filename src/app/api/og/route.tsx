import { ImageResponse } from "next/og";
import { db } from "@/lib/db";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const wallet = req.nextUrl.searchParams.get("wallet") ?? "";

  const user = await db.user.findUnique({
    where: { wallet: wallet.toLowerCase() },
    include: { _count: { select: { mintRecords: true } } },
  });

  const badgeCount = user?._count.mintRecords ?? 0;
  const xp = user?.xp ?? 0;
  const short = wallet ? `${wallet.slice(0, 6)}...${wallet.slice(-4)}` : "Unknown";

  return new ImageResponse(
    (
      <div
        style={{
          background: "#080c0a",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 64, marginBottom: 16 }}>⬡</div>
        <div style={{ color: "#3dffa0", fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
          Abstract Quests
        </div>
        <div style={{ color: "#e8f0e9", fontSize: 20, marginBottom: 24 }}>{short}</div>
        <div style={{ display: "flex", gap: 32 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ color: "#3dffa0", fontSize: 36, fontWeight: 700 }}>{badgeCount}</div>
            <div style={{ color: "#4a6b50", fontSize: 14 }}>Badges</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ color: "#3dffa0", fontSize: 36, fontWeight: 700 }}>{xp.toLocaleString()}</div>
            <div style={{ color: "#4a6b50", fontSize: 14 }}>XP</div>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
