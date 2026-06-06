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
    id: "quiz-agw",
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
  {
    id: "quiz-zk-cryptography",
    title: "ZK Cryptography",
    category: "Cryptography",
    difficulty: "hard",
    badgeId: 39,
    questions: [
      {
        question: "What does the 'ZK' in ZK rollup stand for?",
        answers: ["Zero Knowledge", "Zone Key", "Zeta Kernel", "Zillions of Keys"],
        correctIndex: 0,
        explanation: "ZK stands for Zero-Knowledge, a cryptographic method to prove truth without sharing the data.",
      },
      {
        question: "Which zero-knowledge proof system does Abstract use?",
        answers: ["ZK-SNARK", "ZK-STARK", "Bulletproofs", "Sonic"],
        correctIndex: 0,
        explanation: "zkSync and Abstract utilize ZK-SNARKs for transaction proof generation and validation.",
      },
      {
        question: "What is a prover in a ZK rollup system?",
        answers: ["The actor that generates ZK proofs", "The contract that validates proofs", "The user who signs the transaction", "The node that bundles transactions"],
        correctIndex: 0,
        explanation: "The prover is responsible for generating mathematical proofs for state transitions.",
      },
      {
        question: "What is a verifier in a ZK rollup system?",
        answers: ["The L1 contract that verifies proofs", "The L2 node that orders blocks", "The wallet signature validator", "The miner validating gas fees"],
        correctIndex: 0,
        explanation: "The verifier is an L1 smart contract that mathematically verifies validity proofs.",
      },
      {
        question: "What is the main security advantage of ZK rollups over Optimistic rollups?",
        answers: ["Instant cryptographic finality without fraud proofs", "Larger block sizes", "Private transactions", "No gas fees"],
        correctIndex: 0,
        explanation: "ZK rollups rely on validity proofs for instant mathematical finality, whereas Optimistic rollups require a 7-day challenge window.",
      },
    ],
  },
  {
    id: "quiz-abstract-gas-tokenomics",
    title: "Abstract Gas & Tokenomics",
    category: "Gas & Fees",
    difficulty: "easy",
    badgeId: 40,
    questions: [
      {
        question: "How are gas fees on Abstract paid by default?",
        answers: ["Native ETH", "ABS token", "USDC only", "Wrapped Bitcoin"],
        correctIndex: 0,
        explanation: "Gas fees on Abstract are paid in native ETH.",
      },
      {
        question: "What is gas fee refund on Abstract?",
        answers: ["Refunding unused gas after transaction execution", "Refunding gas when a transaction fails", "A weekly cashback on all gas fees", "Free transactions during weekends"],
        correctIndex: 0,
        explanation: "Because gas is estimated conservatively, Abstract refunds up to 60-80% of unused gas directly to the user.",
      },
      {
        question: "How does account abstraction enable gasless transactions?",
        answers: ["Through Paymasters sponsoring gas fees", "By bypassing L1 security entirely", "By compressing transaction data", "By mining tokens on-chain"],
        correctIndex: 0,
        explanation: "Paymaster contracts allow developers or partners to sponsor transaction fees for users.",
      },
      {
        question: "What is the role of a Sequencer in a layer-2 rollup?",
        answers: ["Ordering and executing transactions", "Verifying proofs on Ethereum L1", "Bridging assets to other rollups", "Holding user assets in a vault"],
        correctIndex: 0,
        explanation: "The Sequencer is responsible for receiving transactions, ordering them, and producing L2 blocks.",
      },
      {
        question: "Why are transaction fees significantly lower on Abstract?",
        answers: ["Data compression batching into ZK proofs", "Transactions are not saved to L1", "Validation is done offline by users", "It doesn't use smart contracts"],
        correctIndex: 0,
        explanation: "Validity proofs compile batch data, saving immense costs when posting state updates to Ethereum L1.",
      },
    ],
  },
  {
    id: "quiz-defi-on-abstract",
    title: "DeFi on Abstract",
    category: "DeFi",
    difficulty: "medium",
    badgeId: 38,
    questions: [
      {
        question: "What is the main purpose of an AMM (Automated Market Maker)?",
        answers: ["Using liquidity pools to trade tokens without intermediaries", "Automating wallet creation", "Monitoring floor prices of NFTs", "Bridging assets between rollups"],
        correctIndex: 0,
        explanation: "AMMs allow decentralized token swaps using liquidity pools instead of traditional order books.",
      },
      {
        question: "What is impermanent loss in DeFi liquidity pools?",
        answers: ["Loss of value compared to holding tokens separately when prices diverge", "Losing your private key", "When a transaction fails due to low gas", "A temporary protocol hack"],
        correctIndex: 0,
        explanation: "Impermanent loss occurs when the price ratio of deposited tokens changes compared to when you deposited them.",
      },
      {
        question: "What does TVL stand for in DeFi?",
        answers: ["Total Value Locked", "Token Volume Limit", "Transaction Validity Log", "Transfer Value Ledger"],
        correctIndex: 0,
        explanation: "TVL stands for Total Value Locked, representing the total assets deposited in a DeFi protocol.",
      },
      {
        question: "What is yield farming?",
        answers: ["Staking or lending tokens to earn interest or rewards", "Minting NFTs on a launchpad", "Voting on protocol governance proposals", "Validating blocks on a testnet"],
        correctIndex: 0,
        explanation: "Yield farming involves depositing assets into pools to generate incentives and fees.",
      },
      {
        question: "What is slippage in decentralized exchanges?",
        answers: ["The difference between expected and executed price of a trade", "A failed wallet connection", "Slow block confirmation times", "Losing your browser session"],
        correctIndex: 0,
        explanation: "Slippage is the price variation between transaction submission and block confirmation.",
      },
    ],
  },
  {
    id: "quiz-advanced-account-abstraction",
    title: "Advanced Account Abstraction",
    category: "AGW",
    difficulty: "hard",
    badgeId: 41,
    questions: [
      {
        question: "What is a signature aggregator in EIP-4337?",
        answers: ["A contract that bundles multiple signatures into one", "A tool for backup keys", "A service to pay gas", "A database of signed messages"],
        correctIndex: 0,
        explanation: "Aggregators combine multiple cryptographic signatures into a single proof to reduce gas costs.",
      },
      {
        question: "What does social recovery mean in smart contract wallets?",
        answers: ["Recovering wallet access using designated guardians", "Recovering keys through Twitter", "Asking customer support to reset your password", "Bridging funds back to Ethereum L1"],
        correctIndex: 0,
        explanation: "Social recovery allows trusted guardians (friends, devices, or institutions) to help recover access to your wallet.",
      },
      {
        question: "What is a key difference between EOAs (Externally Owned Accounts) and Contract Accounts?",
        answers: ["Contract Accounts can execute custom code and verification logic", "EOAs can run smart contracts", "Contract Accounts do not need addresses", "EOAs are stored on layer 2 only"],
        correctIndex: 0,
        explanation: "EOAs are controlled by private keys, while Contract Accounts are smart contracts that can run arbitrary logic.",
      },
      {
        question: "How do session keys work in smart contract wallets?",
        answers: ["Temporary permissions granted to dApps for specific actions", "A master password for your wallet", "An offline backup of your seed phrase", "A bridge approval tool"],
        correctIndex: 0,
        explanation: "Session keys let users authorize apps to perform limited actions for a set period without prompting for every transaction.",
      },
      {
        question: "What is the role of a Bundler in the EIP-4337 architecture?",
        answers: ["Packages UserOperations and submits them to the EntryPoint", "Mints the NFTs for a collection", "Calculates the floor price of a token", "Signs messages on behalf of the user"],
        correctIndex: 0,
        explanation: "Bundlers package user operations from the mempool and submit them to Ethereum or L2 as standard transactions.",
      },
    ],
  },
  {
    id: "quiz-rollup-history-zksync",
    title: "Rollup History & zkSync",
    category: "History",
    difficulty: "medium",
    badgeId: 37,
    questions: [
      {
        question: "Who first proposed the concept of rollups for scaling Ethereum?",
        answers: ["Vitalik Buterin", "Satoshi Nakamoto", "Gavin Wood", "Charles Hoskinson"],
        correctIndex: 0,
        explanation: "Vitalik Buterin first proposed rollups as a key scaling strategy for the Ethereum network.",
      },
      {
        question: "Which technology framework powers zkSync Era and Abstract?",
        answers: ["ZK Stack", "OP Stack", "Arbitrum Orbit", "Polygon CDK"],
        correctIndex: 0,
        explanation: "zkSync Era and Abstract are built using zkSync's ZK Stack, a modular hyperchain framework.",
      },
      {
        question: "What is a Hyperchain in the ZK Stack ecosystem?",
        answers: ["A modular, customizable ZK chain running on the ZK Stack", "A bridge between L1 and L2", "A decentralized storage network", "A high-yield staking pool"],
        correctIndex: 0,
        explanation: "Hyperchains are sovereign ZK-powered blockchains built using the ZK Stack that share a common bridge.",
      },
      {
        question: "What is the purpose of L1-L2 bridging?",
        answers: ["Moving assets and data between mainnet and rollup layers", "Creating new smart contract logic", "Upvoting ecosystem dApps", "Paying gasless fees"],
        correctIndex: 0,
        explanation: "Bridging allows users to deposit and withdraw assets between L1 (Ethereum) and L2 (rollups like Abstract).",
      },
      {
        question: "What is the role of metadata in ZK proofs?",
        answers: ["Describing the transactions in the batch without leaking data", "Storing the private keys", "Setting the block gas limit", "Generating transaction hashes"],
        correctIndex: 0,
        explanation: "Metadata is checked alongside proof validation to guarantee correctness of executed state changes.",
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
