// Plugins
// Tasks
import "./tasks";
import "@nomicfoundation/hardhat-toolbox";
import { config as dotenvConfig } from "dotenv";
import "fhenix-hardhat-docker";
import "fhenix-hardhat-plugin";
import "fhenix-hardhat-network";
import "hardhat-deploy";
import { HardhatUserConfig } from "hardhat/config";
import { resolve } from "path";
import "@nomicfoundation/hardhat-verify";

// DOTENV_CONFIG_PATH is used to specify the path to the .env file for example in the CI
const dotenvConfigPath: string = process.env.DOTENV_CONFIG_PATH || "./.env";
dotenvConfig({ path: resolve(__dirname, dotenvConfigPath) });

const TESTNET_CHAIN_ID = 8008135;
const TESTNET_RPC_URL = "https://api.helium.fhenix.zone";

type TestnetConfig = {
  chainId: number;
  url: string;
  accounts?:
    | string[]
    | {
        count: number;
        mnemonic: string;
        path: string;
      };
};

const testnetConfig: TestnetConfig = {
  chainId: TESTNET_CHAIN_ID,
  url: TESTNET_RPC_URL,
};

const localTestnetConfig: TestnetConfig = {
  chainId: 412346,
  url: "http://127.0.0.1:42069",
};

// Select either private keys or mnemonic from .env file or environment variables
const keys = process.env.KEY2 as string;
// if (!keys) {
//   let mnemonic = process.env.MNEMONIC;
//   if (!mnemonic) {
//     throw new Error(
//       "No mnemonic or private key provided, please set MNEMONIC or KEY in your .env file",
//     );
//   }
//   testnetConfig["accounts"] = {
//     count: 10,
//     mnemonic,
//     path: "m/44'/60'/0'/0",
//   };
// } else {
testnetConfig["accounts"] = [keys];
localTestnetConfig["accounts"] = [keys];
//}

const config: HardhatUserConfig = {
  solidity: "0.8.25",
  defaultNetwork: "testnet",
  networks: {
    testnet: testnetConfig,
    localfhenix: localTestnetConfig,
  },
  etherscan: {
    apiKey: {
      testnet: "abc",
    },
    customChains: [
      {
        network: "testnet",
        chainId: 8008135,
        urls: {
          apiURL: "https://explorer.helium.fhenix.zone/api",
          browserURL: "https://explorer.helium.fhenix.zone/",
        },
      },
    ],
  },
  typechain: {
    outDir: "types",
    target: "ethers-v6",
  },
};

export default config;
