import type { Metadata } from "next";
import { Providers } from "./providers";
import { Nav } from "@/components/Nav";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Abstract Quests",
  description: "Quest, collect badges, and climb the leaderboard on Abstract.",
  other: {
    "talentapp:project_verification": "22ecf9c72ccb8743b8d8e843d0e1f79e08c55ec1e7156e6e71255d3469c7f223ab7f14deb0bf687d71928700c767a2b998f3634d51125883d77afbb9939d98fa"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <Nav />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
