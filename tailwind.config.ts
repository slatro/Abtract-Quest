import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#080c0a",
          2: "#0d1410",
          3: "#111810",
        },
        card: {
          DEFAULT: "#131a14",
          2: "#162018",
        },
        border: {
          DEFAULT: "#1e2b1f",
          2: "#253628",
        },
        green: {
          DEFAULT: "#3dffa0",
          dim: "rgba(61,255,160,0.12)",
          glow: "rgba(61,255,160,0.25)",
        },
        rarity: {
          common: "#8fa890",
          uncommon: "#3dffa0",
          rare: "#60c8ff",
          epic: "#b47aff",
          legendary: "#ffd700",
        },
      },
      fontFamily: {
        sans: ["Space Grotesk", "sans-serif"],
        mono: ["DM Mono", "monospace"],
      },
      borderRadius: {
        card: "14px",
        modal: "20px",
      },
    },
  },
  plugins: [],
};

export default config;
