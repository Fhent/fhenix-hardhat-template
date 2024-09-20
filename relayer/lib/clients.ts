import dotenv from "dotenv";

import { createPublicClient, createWalletClient, Hex, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { zamaDevnet, fhenixDevnet } from "./chains";

dotenv.config();

const relayerKey = process.env.RELAYER_KEY as Hex;

const account = privateKeyToAccount(relayerKey);

export const zamaPublicClient = createPublicClient({
  chain: zamaDevnet,
  transport: http(),
});

export const fhenixPublicClient = createPublicClient({
  chain: fhenixDevnet,
  transport: http(),
});

export const fhenixWalletClient = createWalletClient({
  account,
  chain: fhenixDevnet,
  transport: http(),
});
