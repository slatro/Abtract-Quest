import type { Metadata } from "next";
import { Providers } from "./providers";
import { Nav } from "@/components/Nav";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Abstract Quests",
  description: "Quest, collect badges, and climb the leaderboard on Abstract.",
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
