// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable2Step.sol";
import "@fhenixprotocol/contracts/FHE.sol";

enum IntentStatus {
  Pending,
  Processed,
  Repaid
}

interface IFhenixWEERC20 {
  function transferEncrypted(
    address recipient,
    inEuint64 calldata encryptedAmount
  ) external;

  function transferFromEncrypted(
    address sender,
    address recipient,
    inEuint64 calldata encryptedAmount
  ) external;
}

contract FhenixBridge is Ownable2Step {
  IFhenixWEERC20 public weerc20;

  struct Intent {
    address from;
    address to;
    address relayer;
    euint64 amount;
    IntentStatus status;
  }

  uint64 public nextIntentId = 0;

  mapping(uint64 => Intent) public intents;

  bytes32 public repayingRoot;

  event Packet(
    eaddress encryptedTo,
    euint64 encryptedAmount,
    string toPermit,
    string amountPermit,
    address relayerAddress
  );
  event IntentProcesses(
    address indexed from,
    address indexed to,
    euint64 amount
  );

  constructor(address _tokenAddress) Ownable(msg.sender) {
    weerc20 = IFhenixWEERC20(_tokenAddress);
  }

  function setRepayingRoot(bytes32 _root) public onlyOwner {
    repayingRoot = _root;
  }

  function bridgeWEERC20(
    inEaddress calldata _encryptedTo,
    inEuint64 calldata _encryptedAmount,
    address _relayerAddress,
    bytes32 _relayerSeal
  ) public {
    weerc20.transferFromEncrypted(msg.sender, address(this), _encryptedAmount);

    eaddress to = FHE.asEaddress(_encryptedTo);
    euint64 amount = FHE.asEuint64(_encryptedAmount);

    string memory toPermit = FHE.sealoutput(to, _relayerSeal);
    string memory amountPermit = FHE.sealoutput(amount, _relayerSeal);

    emit Packet(to, amount, toPermit, amountPermit, _relayerAddress);
  }

  function onRecvIntent(
    address _to,
    inEuint64 calldata _encryptedAmount
  ) public {
    weerc20.transferFromEncrypted(msg.sender, _to, _encryptedAmount);

    euint64 amount = FHE.asEuint64(_encryptedAmount);

    nextIntentId++;
    Intent memory intent = Intent({
      from: msg.sender,
      to: _to,
      amount: amount,
      relayer: msg.sender,
      status: IntentStatus.Pending
    });
    intents[nextIntentId] = intent;

    emit IntentProcesses(msg.sender, _to, amount);
  }

  function processedIntrentStatus(uint64 _intentId) public onlyOwner {
    Intent storage intent = intents[_intentId];
    require(intent.status == IntentStatus.Pending, "Intent not pending");

    intent.status = IntentStatus.Processed;
  }

  function repayRelayer(
    uint64 _intentId,
    inEuint64 calldata _encryptedAmount
  ) public {
    Intent storage intent = intents[_intentId];
    require(intent.relayer != address(0), "Intent not found");
    require(intent.relayer == msg.sender, "You can't repay this intent");
    require(intent.status == IntentStatus.Processed, "Intent not processed");

    euint64 amount = FHE.asEuint64(_encryptedAmount);
    ebool canRepay = FHE.eq(intent.amount, amount);

    FHE.req(canRepay);

    weerc20.transferEncrypted(intent.from, _encryptedAmount);

    intent.status = IntentStatus.Repaid;
  }

  // For Testing
  function withdraw(inEuint64 calldata _encryptedAmount) public onlyOwner {
    weerc20.transferEncrypted(msg.sender, _encryptedAmount);
  }
}
