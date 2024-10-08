import { FhenixClient } from "fhenixjs";
import { address, abi } from "../deployments/testnet/FhenixBridge.json";

import hre from "hardhat";

const { ethers } = hre;

const wallets: { [key: number]: string } = {
  1: process.env.KEY1 as string,
  2: process.env.KEY2 as string,
  3: process.env.KEY3 as string,
};

const contractAddress = address;
const relayerAddress = "0xA139Bcfb689926ebCF2AABDbd32FBaFC250e70d9";
const contractABI = abi;
async function ContractCall(
  key: number,
  cfunc: string,
  cargs: any[] = [],
  cvalue: string = "0",
) {
  let args = cargs;
  const wallet = new ethers.Wallet(
    wallets[key],
    new ethers.JsonRpcProvider("https://api.helium.fhenix.zone"),
  );
  const client = new FhenixClient({ provider: hre.ethers.provider });

  if (cfunc === "bridgeWEERC20") {
    const encryptedTo = await client.encrypt_address(args[0]);
    const encryptedAmount = await client.encrypt_uint64(args[1]);
    const seal =
      "0x5c3e7456151987b15780733878bc01a3cce6eeba995ba71904084a4bc661d631";

    args[0] = encryptedTo;
    args[1] = encryptedAmount;
    args[2] = relayerAddress;
    args[3] = seal;
  } else if (cfunc === "onRecvIntent") {
    const encryptedIntentId = await client.encrypt_uint64(args[1]);
    args[1] = encryptedIntentId;
  } else if (cfunc === "repayRelayer") {
    const encryptedAmount = await client.encrypt_uint64(args[1]);
    args[1] = encryptedAmount;
  } else if (cfunc === "withdraw") {
    const encryptedAmount = await client.encrypt_uint64(args[0]);
    args[0] = encryptedAmount;
  }

  const contract = new ethers.Contract(contractAddress, contractABI, wallet);
  const result = await contract[cfunc](...args, {
    value: BigInt(Number(cvalue) * 10 ** 18),
  });

  console.log("result: ", result);
}

async function main() {
  const wallet = process.argv[2];
  const param1 = process.argv[3];
  const param2 = process.argv[4];
  const param3 = process.argv[5];

  switch (param1) {
    case "nextIntentId":
      await ContractCall(Number(wallet), param1);
      break;
    case "intents":
      await ContractCall(Number(wallet), param1, [BigInt(param2)]);
      break;
    case "bridgeWEERC20":
      await ContractCall(Number(wallet), param1, [
        param2,
        BigInt(Number(param3) * 10 ** 6),
      ]);
      break;
    case "onRecvIntent":
      await ContractCall(Number(wallet), param1, [
        param2,
        BigInt(Number(param3) * 10 ** 6),
      ]);
      break;
    case "processedIntentStatus":
      await ContractCall(Number(wallet), param1, [BigInt(Number(param2))]);
      break;
    case "repayRelayer":
      await ContractCall(Number(wallet), param1, [
        BigInt(Number(param2)),
        BigInt(Number(param3) * 10 ** 6),
      ]);
      break;
    case "withdraw":
      await ContractCall(Number(wallet), param1, [
        BigInt(Number(param2) * 10 ** 6),
      ]);
      break;
    default:
      console.log("Invalid parameter");
      console.log("Your param: ", param1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });
