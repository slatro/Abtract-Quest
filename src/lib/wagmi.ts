import { createConfig, http, createStorage } from "wagmi";
import { abstractTestnet as viemAbstractTestnet } from "viem/chains";

export const abstractTestnet = viemAbstractTestnet;

export const config = createConfig({
  chains: [abstractTestnet],
  ssr: true,
  storage: createStorage({
    storage: typeof window !== "undefined" ? window.localStorage : undefined,
  }),
  transports: {
    [abstractTestnet.id]: http("https://api.testnet.abs.xyz"),
  },
});
