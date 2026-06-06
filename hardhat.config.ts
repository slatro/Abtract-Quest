import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const deployerPrivateKey = process.env.DEPLOYER_PRIVATE_KEY;
const abstractAccounts =
  deployerPrivateKey && /^0x[0-9a-fA-F]{64}$/.test(deployerPrivateKey)
    ? [deployerPrivateKey]
    : [];

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      evmVersion: "paris",
      optimizer: { enabled: true, runs: 200 },
    },
  },
  networks: {
    abstract: {
      url: process.env.ABSTRACT_RPC || "https://api.testnet.abs.xyz",
      chainId: 11124,
      accounts: abstractAccounts,
    },
  },
};

export default config;
