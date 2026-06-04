import type { Badge } from "@/types";

export type BadgeRequirement = {
  availability: "live" | "planned";
  headline: string;
  bullets: string[];
};

const LIVE_REQUIREMENTS: Record<number, BadgeRequirement> = {
  1: {
    availability: "live",
    headline: "Visit Abstract.xyz",
    bullets: [
      "Complete the Abstract.xyz visit quest",
      "Unlocks once",
      "1 mint per wallet",
    ],
  },
  4: {
    availability: "live",
    headline: "Use daily check-in",
    bullets: [
      "1 valid daily check-in",
      "Unlocks on first successful check-in",
      "1 mint per wallet",
    ],
  },
  5: {
    availability: "live",
    headline: "Read AGW Docs",
    bullets: [
      "Complete the AGW docs quest",
      "Unlocks once",
      "1 mint per wallet",
    ],
  },
  6: {
    availability: "live",
    headline: "Visit Abscan",
    bullets: [
      "Complete the Abscan quest",
      "Unlocks once",
      "1 mint per wallet",
    ],
  },
  23: {
    availability: "live",
    headline: "Reach a 3-day streak",
    bullets: [
      "Check in 3 days in a row",
      "Unlocks once at streak 3",
      "1 mint per wallet",
    ],
  },
  27: {
    availability: "live",
    headline: "Find the hidden route",
    bullets: [
      "Complete the hidden route quest",
      "Unlocks once",
      "1 mint per wallet",
    ],
  },
  36: {
    availability: "live",
    headline: "Pass Abstract Basics",
    bullets: [
      "Pass the Abstract Basics quiz",
      "Unlocks once",
      "1 mint per wallet",
    ],
  },
  37: {
    availability: "live",
    headline: "Pass NFT Culture",
    bullets: [
      "Pass the NFT Culture quiz",
      "Unlocks once",
      "1 mint per wallet",
    ],
  },
  38: {
    availability: "live",
    headline: "Pass AGW & Account Abstraction",
    bullets: [
      "Pass the AGW quiz",
      "Unlocks once",
      "1 mint per wallet",
    ],
  },
  39: {
    availability: "live",
    headline: "Perfect score a quiz",
    bullets: [
      "Get a perfect quiz score",
      "Unlocks once",
      "1 mint per wallet",
    ],
  },
};

const PLANNED_REQUIREMENTS: Record<number, BadgeRequirement> = {
  2: {
    availability: "planned",
    headline: "AGW onboarding challenge",
    bullets: [
      "Future onboarding challenge",
      "Not live yet",
      "1 mint per wallet",
    ],
  },
  3: {
    availability: "planned",
    headline: "Daily app voting streak",
    bullets: [
      "1 valid vote per day",
      "3 separate days",
      "1 mint per wallet",
    ],
  },
  8: {
    availability: "planned",
    headline: "Live mint event quest",
    bullets: [
      "Future mint-day event",
      "Not live yet",
      "1 mint per wallet",
    ],
  },
  9: {
    availability: "planned",
    headline: "Reveal event quest",
    bullets: [
      "Future reveal event",
      "Not live yet",
      "1 mint per wallet",
    ],
  },
  10: {
    availability: "planned",
    headline: "Premium mint challenge",
    bullets: [
      "Future gas-war event",
      "Not live yet",
      "1 mint per wallet",
    ],
  },
  11: {
    availability: "planned",
    headline: "Market watch streak",
    bullets: [
      "Future market-watch streak",
      "Not live yet",
      "1 mint per wallet",
    ],
  },
  12: {
    availability: "planned",
    headline: "Collector culture quest",
    bullets: [
      "Future collector culture path",
      "Not live yet",
      "1 mint per wallet",
    ],
  },
  13: {
    availability: "planned",
    headline: "Longer conviction streak",
    bullets: [
      "Future holding challenge",
      "Not live yet",
      "1 mint per wallet",
    ],
  },
  15: {
    availability: "planned",
    headline: "Safety challenge",
    bullets: [
      "Future safety route",
      "Not live yet",
      "1 mint per wallet",
    ],
  },
  16: {
    availability: "planned",
    headline: "Trait hunt challenge",
    bullets: [
      "Future trait-hunt activity",
      "Not live yet",
      "1 mint per wallet",
    ],
  },
  17: {
    availability: "planned",
    headline: "Metadata speed challenge",
    bullets: [
      "Future speed challenge",
      "Not live yet",
      "1 mint per wallet",
    ],
  },
  18: {
    availability: "planned",
    headline: "Whitelist campaign",
    bullets: [
      "Future whitelist campaign",
      "Not live yet",
      "1 mint per wallet",
    ],
  },
  19: {
    availability: "planned",
    headline: "Liquidity route quest",
    bullets: [
      "Future liquidity route",
      "Not live yet",
      "1 mint per wallet",
    ],
  },
  20: {
    availability: "planned",
    headline: "Collection analysis quest",
    bullets: [
      "Future analysis quest",
      "Not live yet",
      "1 mint per wallet",
    ],
  },
  22: {
    availability: "planned",
    headline: "Collection milestone",
    bullets: [
      "Future collection milestone",
      "Not live yet",
      "1 mint per wallet",
    ],
  },
  24: {
    availability: "planned",
    headline: "One-tap action quest",
    bullets: [
      "Future quick-action quest",
      "Not live yet",
      "1 mint per wallet",
    ],
  },
  25: {
    availability: "planned",
    headline: "Sweep the full quest board",
    bullets: [
      "Finish the full active quest board",
      "Single quest is not enough",
      "1 mint per wallet",
    ],
  },
  26: {
    availability: "planned",
    headline: "Late-night time window",
    bullets: [
      "Future late-night window",
      "Not live yet",
      "1 mint per wallet",
    ],
  },
  29: {
    availability: "planned",
    headline: "Culture collaboration",
    bullets: [
      "Future community route",
      "Not live yet",
      "1 mint per wallet",
    ],
  },
  30: {
    availability: "planned",
    headline: "Cozy holder milestone",
    bullets: [
      "Future collector milestone",
      "Not live yet",
      "1 mint per wallet",
    ],
  },
  31: {
    availability: "planned",
    headline: "Green portal culture quest",
    bullets: [
      "Future culture route",
      "Not live yet",
      "1 mint per wallet",
    ],
  },
  32: {
    availability: "planned",
    headline: "Consumer app usage milestone",
    bullets: [
      "Future app-usage milestone",
      "Not live yet",
      "1 mint per wallet",
    ],
  },
  33: {
    availability: "planned",
    headline: "Mascot interaction challenge",
    bullets: [
      "Future playful route",
      "Not live yet",
      "1 mint per wallet",
    ],
  },
  34: {
    availability: "planned",
    headline: "Multi-system progression",
    bullets: [
      "Future progression milestone",
      "Not live yet",
      "1 mint per wallet",
    ],
  },
  40: {
    availability: "planned",
    headline: "Advanced quiz tracks",
    bullets: [
      "Future advanced quizzes",
      "Not live yet",
      "1 mint per wallet",
    ],
  },
  41: {
    availability: "planned",
    headline: "Full quiz program",
    bullets: [
      "Finish the full quiz program",
      "Not live yet",
      "1 mint per wallet",
    ],
  },
};

export function getBadgeRequirement(badge: Pick<Badge, "id" | "isMaster" | "setName" | "name">): BadgeRequirement {
  if (badge.isMaster) {
    return {
      availability: "live",
      headline: `Complete the ${badge.setName} set`,
      bullets: [
        `Own all 6 badges from ${badge.setName}`,
        "Crest unlocks after full set",
        "1 mint per wallet",
      ],
    };
  }

  return LIVE_REQUIREMENTS[badge.id] ?? PLANNED_REQUIREMENTS[badge.id] ?? {
    availability: "planned",
    headline: `Unlock path for ${badge.name}`,
    bullets: [
      "Badge art is ready",
      "Unlock path not shipped yet",
      "1 mint per wallet",
    ],
  };
}
