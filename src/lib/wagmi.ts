import { createConfig, http } from "wagmi";
import type { Chain } from "viem";

export const abstractMainnet: Chain = {
  id: 2741,
  name: "Abstract",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://api.mainnet.abs.xyz"] },
    public: { http: ["https://api.mainnet.abs.xyz"] },
  },
};

export const config = createConfig({
  chains: [abstractMainnet],
  transports: {
    [abstractMainnet.id]: http("https://api.mainnet.abs.xyz"),
  },
});
