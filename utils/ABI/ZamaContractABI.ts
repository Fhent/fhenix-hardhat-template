const abi = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_tokenAddress",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "euint64",
        "name": "encryptedAmount",
        "type": "uint256"
      }
    ],
    "name": "IntentProcessed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "eaddress",
        "name": "to",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "euint64",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "relayer",
        "type": "address"
      }
    ],
    "name": "Packet",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "num",
        "type": "uint256"
      }
    ],
    "name": "TestPacket",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "einput",
        "name": "_encryptedTo",
        "type": "bytes32"
      },
      {
        "internalType": "einput",
        "name": "_encryptedAmount",
        "type": "bytes32"
      },
      {
        "internalType": "bytes",
        "name": "_inputProof",
        "type": "bytes"
      },
      {
        "internalType": "address",
        "name": "_relayerAddress",
        "type": "address"
      }
    ],
    "name": "bridgeWEERC20",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "gateway",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint64",
        "name": "",
        "type": "uint64"
      }
    ],
    "name": "intents",
    "outputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "euint64",
        "name": "encryptedAmount",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "nextIntentId",
    "outputs": [
      {
        "internalType": "uint64",
        "name": "",
        "type": "uint64"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_to",
        "type": "address"
      },
      {
        "internalType": "einput",
        "name": "_encryptedAmount",
        "type": "bytes32"
      },
      {
        "internalType": "bytes",
        "name": "inputProof",
        "type": "bytes"
      }
    ],
    "name": "onRecvIntent",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "testEmit",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "weerc20",
    "outputs": [
      {
        "internalType": "contract IZamaWEERC20",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const

export default abi