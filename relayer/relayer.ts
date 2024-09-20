import { FhenixClient, getPermit } from "fhenixjs";
import hre from "hardhat";

const fhenixBridgeContractAddress =
  "0x8ca0b191825F09252117932a23331F40B1BdE09C"; // test address

const { ethers } = hre;

//fhenix related configurations
const fhenixProvider = ethers.provider;
const fhenixClient = new FhenixClient({ provider: fhenixProvider });

let fhenixPermit; // fhenix permit

async function main() {
  fhenixPermit = await getPermit(fhenixBridgeContractAddress, fhenixProvider);

  if (!fhenixPermit) {
    throw new Error("Permit not found!");
  }
  fhenixClient.storePermit(fhenixPermit);

  console.log("Permit is", fhenixPermit);
}
