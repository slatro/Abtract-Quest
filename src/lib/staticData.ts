import staticEcosystem from "../../apps_local.json";

export const STATIC_ECOSYSTEM = staticEcosystem;

export const STATIC_BADGES = [
  // Genesis Abstract Set
  { id: 1,  name: "First Portal Step",    emoji: "🚪", rarity: "common",    setName: "Genesis Abstract",   isMaster: false, price: "free",       lore: "You stepped through the portal for the first time.", requiresUnlock: true },
  { id: 2,  name: "No-Popup Pioneer",     emoji: "🔇", rarity: "uncommon",  setName: "Genesis Abstract",   isMaster: false, price: "0.0001 ETH", lore: "The popups never stood a chance.", requiresUnlock: true },
  { id: 3,  name: "App Voter",            emoji: "🗳️", rarity: "common",    setName: "Genesis Abstract",   isMaster: false, price: "free",       lore: "You cast your vote. Your signal matters.", requiresUnlock: true },
  { id: 4,  name: "Daily Looper",         emoji: "🔄", rarity: "common",    setName: "Genesis Abstract",   isMaster: false, price: "free",       lore: "Every day. Without fail.", requiresUnlock: true },
  { id: 5,  name: "Gasless Tourist",      emoji: "⛽", rarity: "uncommon",  setName: "Genesis Abstract",   isMaster: false, price: "0.0001 ETH", lore: "Abstract is cheap. Embarrassingly cheap.", requiresUnlock: true },
  { id: 6,  name: "Ecosystem Explorer",   emoji: "🗺️", rarity: "rare",      setName: "Genesis Abstract",   isMaster: false, price: "0.0005 ETH", lore: "You found the stuff most users never see.", requiresUnlock: true },
  { id: 7,  name: "Abstract Native Crest",emoji: "👑", rarity: "legendary", setName: "Genesis Abstract",   isMaster: true,  price: "0.001 ETH",  lore: "Complete the Genesis Abstract Set to unlock.", requiresUnlock: false },
  // NFT Boomer Set
  { id: 8,  name: "Mint Day Veteran",     emoji: "🪖", rarity: "uncommon",  setName: "NFT Boomer",         isMaster: false, price: "0.0001 ETH", lore: "You survived a real mint day.", requiresUnlock: true },
  { id: 9,  name: "Reveal Survivor",      emoji: "🎭", rarity: "rare",      setName: "NFT Boomer",         isMaster: false, price: "0.0005 ETH", lore: "The curtain dropped. Your metadata loaded.", requiresUnlock: true },
  { id: 10, name: "Gas War Ghost",        emoji: "👻", rarity: "rare",      setName: "NFT Boomer",         isMaster: false, price: "0.0005 ETH", lore: "You paid more in gas than the NFT was worth.", requiresUnlock: true },
  { id: 11, name: "Floor Watcher",        emoji: "📉", rarity: "common",    setName: "NFT Boomer",         isMaster: false, price: "free",       lore: "F5. F5. F5.", requiresUnlock: true },
  { id: 12, name: "JPEG Believer",        emoji: "🖼️", rarity: "common",    setName: "NFT Boomer",         isMaster: false, price: "free",       lore: "People called it speculation. Still holding.", requiresUnlock: true },
  { id: 13, name: "Diamond Hands Relic",  emoji: "💎", rarity: "rare",      setName: "NFT Boomer",         isMaster: false, price: "0.0005 ETH", lore: "The floor went to zero. You didn't blink.", requiresUnlock: true },
  { id: 14, name: "Culture Survivor Crest",emoji:"🏺", rarity: "legendary", setName: "NFT Boomer",         isMaster: true,  price: "0.001 ETH",  lore: "Complete the NFT Boomer Set to unlock.", requiresUnlock: false },
  // Degenerate Utility Set
  { id: 15, name: "Rug Detector",         emoji: "🛡️", rarity: "uncommon",  setName: "Degenerate Utility", isMaster: false, price: "0.0001 ETH", lore: "You smelled the rug anyway.", requiresUnlock: true },
  { id: 16, name: "Trait Goblin",         emoji: "👺", rarity: "uncommon",  setName: "Degenerate Utility", isMaster: false, price: "0.0001 ETH", lore: "You knew the trait values before the contract was verified.", requiresUnlock: true },
  { id: 17, name: "Metadata Sniper",      emoji: "🎯", rarity: "rare",      setName: "Degenerate Utility", isMaster: false, price: "0.0005 ETH", lore: "You pulled the metadata before anyone else.", requiresUnlock: true },
  { id: 18, name: "Whitelist Hunter",     emoji: "📋", rarity: "common",    setName: "Degenerate Utility", isMaster: false, price: "free",       lore: "You did the tasks. You got the WL.", requiresUnlock: true },
  { id: 19, name: "Liquidity Tourist",    emoji: "🌊", rarity: "common",    setName: "Degenerate Utility", isMaster: false, price: "free",       lore: "You left when the APR dropped.", requiresUnlock: true },
  { id: 20, name: "PFP Archaeologist",    emoji: "🔬", rarity: "rare",      setName: "Degenerate Utility", isMaster: false, price: "0.0005 ETH", lore: "You can date a collection by its art style.", requiresUnlock: true },
  { id: 21, name: "Utility Goblin Crest", emoji: "⚙️", rarity: "legendary", setName: "Degenerate Utility", isMaster: true,  price: "0.001 ETH",  lore: "Complete the Degenerate Utility Set to unlock.", requiresUnlock: false },
  // Portal Personality Set
  { id: 22, name: "Badge Goblin",         emoji: "🏷️", rarity: "common",    setName: "Portal Personality", isMaster: false, price: "free",       lore: "You just wanted every single badge.", requiresUnlock: true },
  { id: 23, name: "Streak Addict",        emoji: "🔥", rarity: "uncommon",  setName: "Portal Personality", isMaster: false, price: "0.0001 ETH", lore: "You have a reminder set. You're not missing this streak.", requiresUnlock: true },
  { id: 24, name: "One-Tap Enjoyer",      emoji: "⚡", rarity: "uncommon",  setName: "Portal Personality", isMaster: false, price: "0.0001 ETH", lore: "Gasless. Frictionless. You came, you tapped.", requiresUnlock: true },
  { id: 25, name: "Quest Sweeper",        emoji: "🧹", rarity: "rare",      setName: "Portal Personality", isMaster: false, price: "0.0005 ETH", lore: "Every quest. Every day.", requiresUnlock: true },
  { id: 26, name: "Late Night Grinder",   emoji: "🌙", rarity: "common",    setName: "Portal Personality", isMaster: false, price: "free",       lore: "2am. Still here. Some people sleep.", requiresUnlock: true },
  { id: 27, name: "Hidden Route Finder",  emoji: "🗝️", rarity: "rare",      setName: "Portal Personality", isMaster: false, price: "0.0005 ETH", lore: "You found the page that wasn't in the nav.", requiresUnlock: true },
  { id: 28, name: "Portal Maniac Crest",  emoji: "🌀", rarity: "legendary", setName: "Portal Personality", isMaster: true,  price: "0.001 ETH",  lore: "Complete the Portal Personality Set to unlock.", requiresUnlock: false },
  // Culture Tribute Set
  { id: 29, name: "Penguin Energy",       emoji: "🐧", rarity: "uncommon",  setName: "Culture Tribute",    isMaster: false, price: "0.0001 ETH", lore: "Cozy. Composed. Collective.", requiresUnlock: true },
  { id: 30, name: "Cozy Holder",          emoji: "🛋️", rarity: "common",    setName: "Culture Tribute",    isMaster: false, price: "free",       lore: "You hold. You don't flip. You don't stress.", requiresUnlock: true },
  { id: 31, name: "Green Portal Energy",  emoji: "🌿", rarity: "common",    setName: "Culture Tribute",    isMaster: false, price: "free",       lore: "Abstract green runs through everything you touch.", requiresUnlock: true },
  { id: 32, name: "Consumer Crypto Believer", emoji: "📱", rarity: "rare",  setName: "Culture Tribute",    isMaster: false, price: "0.0005 ETH", lore: "Real apps. Real users. Real Abstract.", requiresUnlock: true },
  { id: 33, name: "Portal Petter",        emoji: "🤝", rarity: "uncommon",  setName: "Culture Tribute",    isMaster: false, price: "0.0001 ETH", lore: "You clicked the penguin. Multiple times.", requiresUnlock: true },
  { id: 34, name: "Mini Empire Builder",  emoji: "🏗️", rarity: "rare",      setName: "Culture Tribute",    isMaster: false, price: "0.0005 ETH", lore: "Badge by badge. Quest by quest.", requiresUnlock: true },
  { id: 35, name: "Culture Signal Crest", emoji: "📡", rarity: "legendary", setName: "Culture Tribute",    isMaster: true,  price: "0.001 ETH",  lore: "Complete the Culture Tribute Set to unlock.", requiresUnlock: false },
  // Quiz Master Set
  { id: 36, name: "Quiz Rookie",          emoji: "📚", rarity: "common",    setName: "Quiz Master",        isMaster: false, price: "free",       lore: "You passed your first quiz.", requiresUnlock: true },
  { id: 37, name: "Knowledge Miner",      emoji: "⛏️", rarity: "common",    setName: "Quiz Master",        isMaster: false, price: "free",       lore: "Five quizzes in. Digging deeper.", requiresUnlock: true },
  { id: 38, name: "Lore Collector",       emoji: "📜", rarity: "uncommon",  setName: "Quiz Master",        isMaster: false, price: "0.0001 ETH", lore: "You know the lore. The history. The context.", requiresUnlock: true },
  { id: 39, name: "Perfect Score",        emoji: "🎯", rarity: "rare",      setName: "Quiz Master",        isMaster: false, price: "0.0005 ETH", lore: "100%. No mistakes. Pure knowledge.", requiresUnlock: true },
  { id: 40, name: "Ecosystem Analyst",    emoji: "🔭", rarity: "rare",      setName: "Quiz Master",        isMaster: false, price: "0.0005 ETH", lore: "You know more about Abstract than most builders.", requiresUnlock: true },
  { id: 41, name: "Portal Professor",     emoji: "🎓", rarity: "epic",      setName: "Quiz Master",        isMaster: false, price: "0.002 ETH",  lore: "All 20 starter quizzes. You are the professor now.", requiresUnlock: true },
  { id: 42, name: "Portal Scholar Crest", emoji: "🏛️", rarity: "legendary", setName: "Quiz Master",        isMaster: true,  price: "0.001 ETH",  lore: "Complete the Quiz Master Set to unlock.", requiresUnlock: false },
];

export const STATIC_QUESTS = [
  // Daily
  { id: "quest-daily-checkin", title: "Daily Check-in", description: "Check in today to keep your streak alive.", type: "daily", xpReward: 50, badgeId: 4, cooldownMin: 1440, active: true },
  // Visit quests
  { id: "quest-visit-abscan", title: "Visit Abstractscan", description: "Explore the Abstract block explorer.", type: "visit", xpReward: 100, badgeId: 6, cooldownMin: 10080, active: true },
  { id: "quest-visit-abstract-home", title: "Visit Abstract.xyz", description: "Explore the official Abstract website.", type: "visit", xpReward: 75, badgeId: 1, cooldownMin: 10080, active: true },
  { id: "quest-visit-agw-docs", title: "Read AGW Docs", description: "Learn how Abstract Global Wallet works.", type: "visit", xpReward: 100, badgeId: 5, cooldownMin: 10080, active: true },
  // Social quests
  { id: "quest-follow-abstract-x", title: "Follow @AbstractChain on X", description: "Follow the official Abstract X account.", type: "social", xpReward: 75, badgeId: null, cooldownMin: 99999, active: true },
  { id: "quest-join-abstract-discord", title: "Join Abstract Discord", description: "Join the official Abstract community.", type: "social", xpReward: 75, badgeId: null, cooldownMin: 99999, active: true },
  // Streak quests
  { id: "quest-streak-3", title: "3-Day Streak", description: "Check in 3 days in a row.", type: "streak", xpReward: 200, badgeId: 23, cooldownMin: 99999, active: true },
  { id: "quest-streak-7", title: "7-Day Streak", description: "Check in 7 days in a row.", type: "streak", xpReward: 500, badgeId: 23, cooldownMin: 99999, active: true },
  { id: "quest-streak-30", title: "30-Day Streak", description: "Check in 30 days in a row.", type: "streak", xpReward: 2000, badgeId: 23, cooldownMin: 99999, active: true },
  // Quiz quests
  { id: "quest-quiz-abstract-basics", title: "Abstract Basics Quiz", description: "Test your knowledge of Abstract fundamentals.", type: "quiz", xpReward: 150, badgeId: 36, cooldownMin: 1440, active: true },
  { id: "quest-quiz-nft-culture", title: "NFT Culture Quiz", description: "How well do you know NFT history?", type: "quiz", xpReward: 150, badgeId: 37, cooldownMin: 1440, active: true },
  { id: "quest-quiz-agw", title: "AGW & Account Abstraction Quiz", description: "Deep dive into Abstract Global Wallet.", type: "quiz", xpReward: 200, badgeId: 38, cooldownMin: 1440, active: true },
  { id: "quest-quiz-zk-cryptography", title: "ZK Cryptography Quiz", description: "Test your knowledge of zero-knowledge cryptography.", type: "quiz", xpReward: 250, badgeId: 39, cooldownMin: 1440, active: true },
  { id: "quest-quiz-abstract-gas-tokenomics", title: "Abstract Gas & Tokenomics Quiz", description: "How well do you understand gas refunds and paymasters.", type: "quiz", xpReward: 150, badgeId: 40, cooldownMin: 1440, active: true },
  { id: "quest-quiz-defi-on-abstract", title: "DeFi on Abstract Quiz", description: "Test your knowledge on AMMs, yield farming, and liquidity.", type: "quiz", xpReward: 200, badgeId: 38, cooldownMin: 1440, active: true },
  { id: "quest-quiz-advanced-account-abstraction", title: "Advanced Account Abstraction Quiz", description: "Deep dive into bundlers, EntryPoint, and session keys.", type: "quiz", xpReward: 250, badgeId: 41, cooldownMin: 1440, active: true },
  { id: "quest-quiz-rollup-history-zksync", title: "Rollup History & zkSync Quiz", description: "Learn about Vitalik's rollup roadmap and Hyperchains.", type: "quiz", xpReward: 200, badgeId: 37, cooldownMin: 1440, active: true },
  // Hidden
  { id: "quest-hidden-portal", title: "???", description: "Something is hidden here.", type: "hidden", xpReward: 500, badgeId: 27, cooldownMin: 99999, active: true },
];

export const STATIC_QUIZZES = [
  {
    id: "quiz-abstract-basics",
    title: "Abstract Basics",
    category: "Abstract",
    difficulty: "easy",
    badgeId: 36,
    questions: [
      { id: "q1", question: "What is the chain ID of Abstract mainnet?", answers: ["2741", "1", "8453", "42161"], correctIndex: 0, explanation: "Abstract mainnet runs on chain ID 2741." },
      { id: "q2", question: "What is the native currency of Abstract?", answers: ["ETH", "ABS", "USDC", "MATIC"], correctIndex: 0, explanation: "Abstract uses ETH as its native currency." },
      { id: "q3", question: "What does AGW stand for?", answers: ["Abstract Global Wallet", "Abstract Gas Wrapper", "Automated Gas Wallet", "Abstract General Web"], correctIndex: 0, explanation: "AGW stands for Abstract Global Wallet." },
      { id: "q4", question: "What type of rollup is Abstract?", answers: ["ZK rollup", "Optimistic rollup", "Plasma chain", "Sidechain"], correctIndex: 0, explanation: "Abstract is a ZK rollup built on Ethereum." },
      { id: "q5", question: "Which block explorer does Abstract use?", answers: ["Abscan", "Etherscan", "Blockscout", "Arbiscan"], correctIndex: 0, explanation: "Abstract's block explorer is Abscan at abscan.org." }
    ]
  },
  {
    id: "quiz-agw",
    title: "AGW & Account Abstraction",
    category: "AGW",
    difficulty: "medium",
    badgeId: 38,
    questions: [
      { id: "q6", question: "What EIP introduced account abstraction on Ethereum?", answers: ["EIP-4337", "EIP-1559", "EIP-721", "EIP-2981"], correctIndex: 0, explanation: "EIP-4337 introduced account abstraction without consensus changes." },
      { id: "q7", question: "What is a key benefit of Abstract Global Wallet?", answers: ["No seed phrases needed", "Unlimited free transactions", "Built-in token swaps", "Anonymous transactions"], correctIndex: 0, explanation: "AGW uses account abstraction so users don't need seed phrases." },
      { id: "q8", question: "What is a UserOperation in account abstraction?", answers: ["A pseudo-transaction object sent to a bundler", "A signed message for token approval", "A smart contract deployment", "A layer 2 bridge transaction"], correctIndex: 0, explanation: "UserOperations are pseudo-tx objects bundled and submitted on-chain." },
      { id: "q9", question: "What is a Paymaster in account abstraction?", answers: ["A contract that sponsors gas fees", "A wallet that stores ETH", "A bridge between chains", "A token approval contract"], correctIndex: 0, explanation: "Paymasters can sponsor gas so users pay zero fees." },
      { id: "q10", question: "What is the EntryPoint contract in EIP-4337?", answers: ["The singleton contract that processes UserOperations", "The contract that holds user funds", "The contract that issues tokens", "The contract that validates NFTs"], correctIndex: 0, explanation: "The EntryPoint is a singleton contract all bundlers interact with." }
    ]
  },
  {
    id: "quiz-nft-culture",
    title: "NFT Culture",
    category: "NFT Culture",
    difficulty: "medium",
    badgeId: 37,
    questions: [
      { id: "q11", question: "What does 'floor price' mean in NFT markets?", answers: ["The lowest listed price in a collection", "The average sale price", "The price set by the creator", "The highest ever sale price"], correctIndex: 0, explanation: "Floor price is the cheapest NFT available in a collection." },
      { id: "q12", question: "What is a 'whitelist' in NFT context?", answers: ["A pre-approved list for early mint access", "A list of banned wallets", "A token gated Discord role", "A list of verified creators"], correctIndex: 0, explanation: "Whitelists (now often called allowlists) grant early mint access." },
      { id: "q13", question: "What does 'reveal' mean in an NFT launch?", answers: ["When metadata is made public after mint", "When the contract is verified", "When trading begins", "When royalties are set"], correctIndex: 0, explanation: "Many collections launch with unrevealed metadata, then reveal traits later." },
      { id: "q14", question: "What is 'diamond hands' slang for?", answers: ["Holding an asset despite pressure to sell", "Buying at the peak", "Selling at profit", "Minting multiple NFTs"], correctIndex: 0, explanation: "Diamond hands means holding through volatility without selling." },
      { id: "q15", question: "What is a 'rug pull'?", answers: ["When developers abandon a project and take funds", "When floor price drops suddenly", "When metadata changes after mint", "When a collection sells out instantly"], correctIndex: 0, explanation: "A rug pull is when project founders exit with investor funds." }
    ]
  },
  {
    id: "quiz-badge-rush-rules",
    title: "Badge Rush Rules",
    category: "Badge Rush",
    difficulty: "easy",
    badgeId: 36,
    questions: [
      { id: "q16", question: "What token standard are Portal Badge Rush badges?", answers: ["ERC-1155", "ERC-721", "ERC-20", "ERC-4337"], correctIndex: 0, explanation: "All badges are ERC-1155 tokens on Abstract mainnet." },
      { id: "q17", question: "How many badges are in a standard badge set?", answers: ["6", "5", "10", "12"], correctIndex: 0, explanation: "Each set has 6 badges plus 1 master badge." },
      { id: "q18", question: "What unlocks a master badge?", answers: ["Collecting all 6 badges in the set", "Paying extra ETH", "Completing 30 quests", "Reaching level 10"], correctIndex: 0, explanation: "Complete all 6 set badges to unlock the master crest." },
      { id: "q19", question: "Can you mint the same badge twice?", answers: ["No, one per wallet", "Yes, unlimited", "Yes, up to 3 times", "Only with admin approval"], correctIndex: 0, explanation: "Each badge is one per wallet enforced both onchain and offchain." },
      { id: "q20", question: "What chain does Portal Badge Rush run on?", answers: ["Abstract mainnet", "Ethereum mainnet", "Base", "Arbitrum"], correctIndex: 0, explanation: "Portal Badge Rush is deployed on Abstract mainnet (chain ID 2741)." }
    ]
  },
  {
    id: "quiz-zk-cryptography",
    title: "ZK Cryptography",
    category: "Cryptography",
    difficulty: "hard",
    badgeId: 39,
    questions: [
      { id: "q21", question: "What does the 'ZK' in ZK rollup stand for?", answers: ["Zero Knowledge", "Zone Key", "Zeta Kernel", "Zillions of Keys"], correctIndex: 0, explanation: "ZK stands for Zero-Knowledge, a cryptographic method to prove truth without sharing the data." },
      { id: "q22", question: "Which zero-knowledge proof system does Abstract use?", answers: ["ZK-SNARK", "ZK-STARK", "Bulletproofs", "Sonic"], correctIndex: 0, explanation: "zkSync and Abstract utilize ZK-SNARKs for transaction proof generation and validation." },
      { id: "q23", question: "What is a prover in a ZK rollup system?", answers: ["The actor that generates ZK proofs", "The contract that validates proofs", "The user who signs the transaction", "The node that bundles transactions"], correctIndex: 0, explanation: "The prover is responsible for generating mathematical proofs for state transitions." },
      { id: "q24", question: "What is a verifier in a ZK rollup system?", answers: ["The L1 contract that verifies proofs", "The L2 node that orders blocks", "The wallet signature validator", "The miner validating gas fees"], correctIndex: 0, explanation: "The verifier is an L1 smart contract that mathematically verifies validity proofs." },
      { id: "q25", question: "What is the main security advantage of ZK rollups over Optimistic rollups?", answers: ["Instant cryptographic finality without fraud proofs", "Larger block sizes", "Private transactions", "No gas fees"], correctIndex: 0, explanation: "ZK rollups rely on validity proofs for instant mathematical finality, whereas Optimistic rollups require a 7-day challenge window." }
    ]
  },
  {
    id: "quiz-abstract-gas-tokenomics",
    title: "Abstract Gas & Tokenomics",
    category: "Gas & Fees",
    difficulty: "easy",
    badgeId: 40,
    questions: [
      { id: "q26", question: "How are gas fees on Abstract paid by default?", answers: ["Native ETH", "ABS token", "USDC only", "Wrapped Bitcoin"], correctIndex: 0, explanation: "Gas fees on Abstract are paid in native ETH." },
      { id: "q27", question: "What is gas fee refund on Abstract?", answers: ["Refunding unused gas after transaction execution", "Refunding gas when a transaction fails", "A weekly cashback on all gas fees", "Free transactions during weekends"], correctIndex: 0, explanation: "Because gas is estimated conservatively, Abstract refunds up to 60-80% of unused gas directly to the user." },
      { id: "q28", question: "How does account abstraction enable gasless transactions?", answers: ["Through Paymasters sponsoring gas fees", "By bypassing L1 security entirely", "By compressing transaction data", "By mining tokens on-chain"], correctIndex: 0, explanation: "Paymaster contracts allow developers or partners to sponsor transaction fees for users." },
      { id: "q29", question: "What is the role of a Sequencer in a layer-2 rollup?", answers: ["Ordering and executing transactions", "Verifying proofs on Ethereum L1", "Bridging assets to other rollups", "Holding user assets in a vault"], correctIndex: 0, explanation: "The Sequencer is responsible for receiving transactions, ordering them, and producing L2 blocks." },
      { id: "q30", question: "Why are transaction fees significantly lower on Abstract?", answers: ["Data compression batching into ZK proofs", "Transactions are not saved to L1", "Validation is done offline by users", "It doesn't use smart contracts"], correctIndex: 0, explanation: "Validity proofs compile batch data, saving immense costs when posting state updates to Ethereum L1." }
    ]
  },
  {
    id: "quiz-defi-on-abstract",
    title: "DeFi on Abstract",
    category: "DeFi",
    difficulty: "medium",
    badgeId: 38,
    questions: [
      { id: "q31", question: "What is the main purpose of an AMM (Automated Market Maker)?", answers: ["Using liquidity pools to trade tokens without intermediaries", "Automating wallet creation", "Monitoring floor prices of NFTs", "Bridging assets between rollups"], correctIndex: 0, explanation: "AMMs allow decentralized token swaps using liquidity pools instead of traditional order books." },
      { id: "q32", question: "What is impermanent loss in DeFi liquidity pools?", answers: ["Loss of value compared to holding tokens separately when prices diverge", "Losing your private key", "When a transaction fails due to low gas", "A temporary protocol hack"], correctIndex: 0, explanation: "Impermanent loss occurs when the price ratio of deposited tokens changes compared to when you deposited them." },
      { id: "q33", question: "What does TVL stand for in DeFi?", answers: ["Total Value Locked", "Token Volume Limit", "Transaction Validity Log", "Transfer Value Ledger"], correctIndex: 0, explanation: "TVL stands for Total Value Locked, representing the total assets deposited in a DeFi protocol." },
      { id: "q34", question: "What is yield farming?", answers: ["Staking or lending tokens to earn interest or rewards", "Minting NFTs on a launchpad", "Voting on protocol governance proposals", "Validating blocks on a testnet"], correctIndex: 0, explanation: "Yield farming involves depositing assets into pools to generate incentives and fees." },
      { id: "q35", question: "What is slippage in decentralized exchanges?", answers: ["The difference between expected and executed price of a trade", "A failed wallet connection", "Slow block confirmation times", "Losing your browser session"], correctIndex: 0, explanation: "Slippage is the price variation between transaction submission and block confirmation." }
    ]
  },
  {
    id: "quiz-advanced-account-abstraction",
    title: "Advanced Account Abstraction",
    category: "AGW",
    difficulty: "hard",
    badgeId: 41,
    questions: [
      { id: "q36", question: "What is a signature aggregator in EIP-4337?", answers: ["A contract that bundles multiple signatures into one", "A tool for backup keys", "A service to pay gas", "A database of signed messages"], correctIndex: 0, explanation: "Aggregators combine multiple cryptographic signatures into a single proof to reduce gas costs." },
      { id: "q37", question: "What does social recovery mean in smart contract wallets?", answers: ["Recovering wallet access using designated guardians", "Recovering keys through Twitter", "Asking customer support to reset your password", "Bridging funds back to Ethereum L1"], correctIndex: 0, explanation: "Social recovery allows trusted guardians (friends, devices, or institutions) to help recover access to your wallet." },
      { id: "q38", question: "What is a key difference between EOAs (Externally Owned Accounts) and Contract Accounts?", answers: ["Contract Accounts can execute custom code and verification logic", "EOAs can run smart contracts", "Contract Accounts do not need addresses", "EOAs are stored on layer 2 only"], correctIndex: 0, explanation: "EOAs are controlled by private keys, while Contract Accounts are smart contracts that can run arbitrary logic." },
      { id: "q39", question: "How do session keys work in smart contract wallets?", answers: ["Temporary permissions granted to dApps for specific actions", "A master password for your wallet", "An offline backup of your seed phrase", "A bridge approval tool"], correctIndex: 0, explanation: "Session keys let users authorize apps to perform limited actions for a set period without prompting for every transaction." },
      { id: "q40", question: "What is the role of a Bundler in the EIP-4337 architecture?", answers: ["Packages UserOperations and submits them to the EntryPoint", "Mints the NFTs for a collection", "Calculates the floor price of a token", "Signs messages on behalf of the user"], correctIndex: 0, explanation: "Bundlers package user operations from the mempool and submit them to Ethereum or L2 as standard transactions." }
    ]
  },
  {
    id: "quiz-rollup-history-zksync",
    title: "Rollup History & zkSync",
    category: "History",
    difficulty: "medium",
    badgeId: 37,
    questions: [
      { id: "q41", question: "Who first proposed the concept of rollups for scaling Ethereum?", answers: ["Vitalik Buterin", "Satoshi Nakamoto", "Gavin Wood", "Charles Hoskinson"], correctIndex: 0, explanation: "Vitalik Buterin first proposed rollups as a key scaling strategy for the Ethereum network." },
      { id: "q42", question: "Which technology framework powers zkSync Era and Abstract?", answers: ["ZK Stack", "OP Stack", "Arbitrum Orbit", "Polygon CDK"], correctIndex: 0, explanation: "zkSync Era and Abstract are built using zkSync's ZK Stack, a modular hyperchain framework." },
      { id: "q43", question: "What is a Hyperchain in the ZK Stack ecosystem?", answers: ["A modular, customizable ZK chain running on the ZK Stack", "A bridge between L1 and L2", "A decentralized storage network", "A high-yield staking pool"], correctIndex: 0, explanation: "Hyperchains are sovereign ZK-powered blockchains built using the ZK Stack that share a common bridge." },
      { id: "q44", question: "What is the purpose of L1-L2 bridging?", answers: ["Moving assets and data between mainnet and rollup layers", "Creating new smart contract logic", "Upvoting ecosystem dApps", "Paying gasless fees"], correctIndex: 0, explanation: "Bridging allows users to deposit and withdraw assets between L1 (Ethereum) and L2 (rollups like Abstract)." },
      { id: "q45", question: "What is the role of metadata in ZK proofs?", answers: ["Describing the transactions in the batch without leaking data", "Storing the private keys", "Setting the block gas limit", "Generating transaction hashes"], correctIndex: 0, explanation: "Metadata is checked alongside proof validation to guarantee correctness of executed state changes." }
    ]
  }
];
