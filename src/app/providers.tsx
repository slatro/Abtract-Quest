"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { AbstractWalletProvider } from "@abstract-foundation/agw-react";
import { abstractMainnet, config } from "@/lib/wagmi";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <AbstractWalletProvider chain={abstractMainnet}>
          {children}
        </AbstractWalletProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
