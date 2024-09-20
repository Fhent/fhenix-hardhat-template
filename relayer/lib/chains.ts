import { Chain } from "viem";

export const zamaDevnet = {
  id: 9000,
  name: "Zama Devnet",
  nativeCurrency: { name: "Zama", symbol: "ZAMA", decimals: 18 },
  rpcUrls: {
    default: {
      http: ["https://devnet.zama.ai"],
    },
  },
  blockExplorers: {
    default: {
      name: "Zamascan Devnet",
      url: "https://main.explorer.zama.ai",
    },
  },
} as const satisfies Chain;

export const fhenixDevnet = {
  id: 8008135,
  name: "Fhenix Helium",
  nativeCurrency: { name: "Fhenix", symbol: "tFHE", decimals: 18 },
  rpcUrls: {
    default: {
      http: ["https://api.helium.fhenix.zone"],
    },
  },
  blockExplorers: {
    default: {
      name: "Fhenixscan Helium",
      url: "https://explorer.helium.fhenix.zone",
    },
  },
} as const satisfies Chain;
