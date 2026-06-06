const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../apps_local.json');
const apps = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

const descriptions = {
  "213": "Maze of Gains is a turn-based roguelike dungeon crawler where players battle monsters and collect gold. Each run contributes to a weekly leaderboard where top players earn a share of the ETH prize pool.",
  "207": "Tollan Universe is an action roguelike RPG featuring intense combat and competitive gameplay. Players survive waves of enemies and defeat bosses to claim their spot on the global leaderboard.",
  "39": "Gigaverse is an immersive role-playing game where players explore alien planets and gather resources. Challenge other players in the PvP arena and complete quests under the supervision of an AI overlord.",
  "15": "DYLI is a marketplace for physical and digital collectibles such as trading cards, packs, and toys. Players can buy digital representations of these assets and request physical shipping to their address.",
  "236": "Trivia Rush is a live trivia game where players test their knowledge against others in real time. Participate in weekly sessions to answer questions quickly and win cash rewards directly to your wallet.",
  "235": "Unchained is a pixel-art dungeon crawler battle royale where players fight for survival against dragons and other players. Earn gold, unlock characters, and climb the ranks in this high-stakes combat game.",
  "231": "SuperTripLand is a fast-paced multiplayer first-person shooter set in an interactive digital arena. Team up with friends, customize your weapons, and dominate the leaderboard in action-packed matches.",
  "225": "DEPTH Protocol is a soulbound NFT vault system designed to maximize token yields on Abstract. Upgrade your vault depth from the Shallows to the Mariana Trench to unlock higher emission rates.",
  "223": "Lingo is a competitive word puzzle game that challenges players to solve word boards before their opponent. Win high-stakes matches and claim jackpots by finding the correct letters faster than anyone else.",
  "222": "Rugpull Bakery is a cooperative social game where players bake cookies to grow a shared prize pool. Collaborate with crews, sabotage opponents, and secure your earnings before the rug is pulled.",
  "220": "Amigo is a social platform that allows users to support their favorite creators by buying their social tokens. Share in the success of the creators you believe in and build your web3 profile.",
  "216": "Polar Pair-Up is a fast-paced puzzle game where players match ice blocks to clear the board. Beat the clock and complete levels before the ice melts to earn ecosystem rewards.",
  "205": "Digitoys is a digital toy and entertainment platform combining gaming with physical collectibles. Customize your digital characters, complete challenges, and trade rare assets on the marketplace.",
  "183": "Aborean Finance is the core liquidity layer of Abstract, enabling fast and low-fee token swaps. Add liquidity to pools, stake LP tokens, and earn yield in a secure decentralized environment.",
  "179": "Kona is a decentralized lending and borrowing protocol built on the Abstract network. Deposit collateral to earn interest on your assets and borrow stablecoins with high efficiency.",
  "175": "Anichess is a chess-based strategy game featuring spellcasting mechanics and interactive challenges. Complete daily puzzles, battle other players, and collect chess pieces in this immersive universe.",
  "168": "COSMO is a social platform that gives K-Pop fans the power to vote on unit formations and song concepts. Collect digital photocards of your favorite artists and influence real-world group decisions.",
  "157": "OpenSea is the largest decentralized marketplace for buying, selling, and discovering digital collectibles. Explore collections, trade assets, and interact with the web3 ecosystem on Abstract.",
  "155": "Moody Madness is a competitive multiplayer game where players race and battle in customized vehicles. Form guilds, participate in tournaments, and win glory in high-speed, action-packed arenas.",
  "150": "Bigcoin is a decentralized token mining simulator that allows players to mine assets using their local hardware. Build your mining empire, optimize your rigs, and compete with other miners globally.",
  "144": "Cambria is a competitive risk-to-earn MMO set in a medieval fantasy world with massive stakes. Engage in battles, secure resources, and trade assets in a player-driven virtual economy.",
  "25": "Onchain Heroes is an idle RPG where players send heroes on quests to gather resources and gear. Every transaction and hero progression is verified on-chain to ensure transparent gameplay.",
  "16": "Duper is a competitive social war game of bidding, betting, and betrayal played in real time. Form alliances with other players or deceive them to dominate the board and win the round.",
  "9": "BLUE Protocol is a treasury-backed reserve currency and decentralized liquidity network. Stake your assets to receive auto-compounding rewards and earn yield on the Abstract chain.",
  "7": "Prontoboro is a competitive tournament game featuring customized vehicle combat and race tracks. Team up with your guild, enter massive arenas, and win seasonal token rewards."
};

const updatedApps = apps.map(app => {
  const customDesc = descriptions[app.id];
  return {
    ...app,
    description: customDesc || app.description
  };
});

fs.writeFileSync(filePath, JSON.stringify(updatedApps, null, 2), 'utf-8');
console.log("Updated descriptions to exactly 2 sentences without long dashes!");
