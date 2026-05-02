import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const quizzes = [
  {
    id: "quiz-abstract-basics",
    title: "Abstract Basics",
    category: "Abstract",
    difficulty: "easy",
    badgeId: 36,
    questions: [
      {
        question: "What is the chain ID of Abstract mainnet?",
        answers: ["2741", "1", "8453", "42161"],
        correctIndex: 0,
        explanation: "Abstract mainnet runs on chain ID 2741.",
      },
      {
        question: "What is the native currency of Abstract?",
        answers: ["ETH", "ABS", "USDC", "MATIC"],
        correctIndex: 0,
        explanation: "Abstract uses ETH as its native currency.",
      },
      {
        question: "What does AGW stand for?",
        answers: [
          "Abstract Global Wallet",
          "Abstract Gas Wrapper",
          "Automated Gas Wallet",
          "Abstract General Web",
        ],
        correctIndex: 0,
        explanation: "AGW stands for Abstract Global Wallet.",
      },
      {
        question: "What type of rollup is Abstract?",
        answers: ["ZK rollup", "Optimistic rollup", "Plasma chain", "Sidechain"],
        correctIndex: 0,
        explanation: "Abstract is a ZK rollup built on Ethereum.",
      },
      {
        question: "Which block explorer does Abstract use?",
        answers: ["Abscan", "Etherscan", "Blockscout", "Arbiscan"],
        correctIndex: 0,
        explanation: "Abstract's block explorer is Abscan at abscan.org.",
      },
    ],
  },
  {
    id: "quiz-agw-account-abstraction",
    title: "AGW & Account Abstraction",
    category: "AGW",
    difficulty: "medium",
    badgeId: 38,
    questions: [
      {
        question: "What EIP introduced account abstraction on Ethereum?",
        answers: ["EIP-4337", "EIP-1559", "EIP-721", "EIP-2981"],
        correctIndex: 0,
        explanation: "EIP-4337 introduced account abstraction without consensus changes.",
      },
      {
        question: "What is a key benefit of Abstract Global Wallet?",
        answers: [
          "No seed phrases needed",
          "Unlimited free transactions",
          "Built-in token swaps",
          "Anonymous transactions",
        ],
        correctIndex: 0,
        explanation: "AGW uses account abstraction so users don't need seed phrases.",
      },
      {
        question: "What is a UserOperation in account abstraction?",
        answers: [
          "A pseudo-transaction object sent to a bundler",
          "A signed message for token approval",
          "A smart contract deployment",
          "A layer 2 bridge transaction",
        ],
        correctIndex: 0,
        explanation: "UserOperations are pseudo-tx objects bundled and submitted on-chain.",
      },
      {
        question: "What is a Paymaster in account abstraction?",
        answers: [
          "A contract that sponsors gas fees",
          "A wallet that stores ETH",
          "A bridge between chains",
          "A token approval contract",
        ],
        correctIndex: 0,
        explanation: "Paymasters can sponsor gas so users pay zero fees.",
      },
      {
        question: "What is the EntryPoint contract in EIP-4337?",
        answers: [
          "The singleton contract that processes UserOperations",
          "The contract that holds user funds",
          "The contract that issues tokens",
          "The contract that validates NFTs",
        ],
        correctIndex: 0,
        explanation: "The EntryPoint is a singleton contract all bundlers interact with.",
      },
    ],
  },
  {
    id: "quiz-nft-culture",
    title: "NFT Culture",
    category: "NFT Culture",
    difficulty: "medium",
    badgeId: 37,
    questions: [
      {
        question: "What does 'floor price' mean in NFT markets?",
        answers: [
          "The lowest listed price in a collection",
          "The average sale price",
          "The price set by the creator",
          "The highest ever sale price",
        ],
        correctIndex: 0,
        explanation: "Floor price is the cheapest NFT available in a collection.",
      },
      {
        question: "What is a 'whitelist' in NFT context?",
        answers: [
          "A pre-approved list for early mint access",
          "A list of banned wallets",
          "A token gated Discord role",
          "A list of verified creators",
        ],
        correctIndex: 0,
        explanation: "Whitelists (now often called allowlists) grant early mint access.",
      },
      {
        question: "What does 'reveal' mean in an NFT launch?",
        answers: [
          "When metadata is made public after mint",
          "When the contract is verified",
          "When trading begins",
          "When royalties are set",
        ],
        correctIndex: 0,
        explanation: "Many collections launch with unrevealed metadata, then reveal traits later.",
      },
      {
        question: "What is 'diamond hands' slang for?",
        answers: [
          "Holding an asset despite pressure to sell",
          "Buying at the peak",
          "Selling at profit",
          "Minting multiple NFTs",
        ],
        correctIndex: 0,
        explanation: "Diamond hands means holding through volatility without selling.",
      },
      {
        question: "What is a 'rug pull'?",
        answers: [
          "When developers abandon a project and take funds",
          "When floor price drops suddenly",
          "When metadata changes after mint",
          "When a collection sells out instantly",
        ],
        correctIndex: 0,
        explanation: "A rug pull is when project founders exit with investor funds.",
      },
    ],
  },
  {
    id: "quiz-badge-rush-rules",
    title: "Badge Rush Rules",
    category: "Badge Rush",
    difficulty: "easy",
    badgeId: 36,
    questions: [
      {
        question: "What token standard are Portal Badge Rush badges?",
        answers: ["ERC-1155", "ERC-721", "ERC-20", "ERC-4337"],
        correctIndex: 0,
        explanation: "All badges are ERC-1155 tokens on Abstract mainnet.",
      },
      {
        question: "How many badges are in a standard badge set?",
        answers: ["6", "5", "10", "12"],
        correctIndex: 0,
        explanation: "Each set has 6 badges plus 1 master badge.",
      },
      {
        question: "What unlocks a master badge?",
        answers: [
          "Collecting all 6 badges in the set",
          "Paying extra ETH",
          "Completing 30 quests",
          "Reaching level 10",
        ],
        correctIndex: 0,
        explanation: "Complete all 6 set badges to unlock the master crest.",
      },
      {
        question: "Can you mint the same badge twice?",
        answers: ["No, one per wallet", "Yes, unlimited", "Yes, up to 3 times", "Only with admin approval"],
        correctIndex: 0,
        explanation: "Each badge is one per wallet enforced both onchain and offchain.",
      },
      {
        question: "What chain does Portal Badge Rush run on?",
        answers: ["Abstract mainnet", "Ethereum mainnet", "Base", "Arbitrum"],
        correctIndex: 0,
        explanation: "Portal Badge Rush is deployed on Abstract mainnet (chain ID 2741).",
      },
    ],
  },
];

async function main() {
  console.log("Seeding quizzes...");

  for (const quiz of quizzes) {
    const { questions, ...quizData } = quiz;

    await prisma.quiz.upsert({
      where: { id: quizData.id },
      update: { ...quizData },
      create: {
        ...quizData,
        questions: {
          create: questions,
        },
      },
    });
  }

  console.log(`Seeded ${quizzes.length} quizzes.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
