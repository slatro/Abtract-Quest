import type { Metadata } from "next";
import { Providers } from "./providers";
import { Nav } from "@/components/Nav";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Portal Badge Rush",
  description: "A mainnet badge arcade on Abstract.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Nav />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
