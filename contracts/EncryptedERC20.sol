// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@fhenixprotocol/contracts/FHE.sol";

contract WrappingERC20 is ERC20 {
  mapping(address => euint32) internal _encBalances;

  constructor(string memory name, string memory symbol) ERC20(name, symbol) {
    _mint(msg.sender, 100 * 10 ** uint(decimals()));
  }

  function wrap(uint256 amount) external {
    require(balanceOf(msg.sender) >= amount);

    _burn(msg.sender, amount);

    uint64 convertedAmount = _convertDecimalForWrap(amount);
    euint64 shieldedAmount = FHE.asEuint64(convertedAmount);

    _encBalances[msg.sender] = _encBalances[msg.sender] + shieldedAmount;
  }

  function unwrap(inEuint64 memory amount) external {
    euint64 _amount = FHE.asEuint64(amount);
    FHE.req(_encBalances[msg.sender].gte(_amount));

    _encBalances[msg.sender] = _encBalances[msg.sender] - _amount;

    uint64 decryptedAmount = FHE.decrypt(_amount);
    uint256 convertedAmount = _convertDecimalForUnwrap(decryptedAmount);

    _mint(msg.sender, convertedAmount);
  }

  function approveEncrypted(
    address spender,
    inEuint64 calldata encryptedAmount
  ) external {
    euint64 amount = FHE.asEuint64(encryptedAmount);

    _allowances[msg.sender][spender] = amount;
  }

  function transferEncrypted(
    address to,
    inEuint32 calldata encryptedAmount
  ) public {
    euint32 amount = FHE.asEuint32(encryptedAmount);
    // Make sure the sender has enough tokens.
    FHE.req(amount.lte(_encBalances[msg.sender]));

    // Add to the balance of `to` and subract from the balance of `from`.
    _encBalances[to] = _encBalances[to] + amount;
    _encBalances[msg.sender] = _encBalances[msg.sender] - amount;
  }

  function _updateAllowance(
    address owner,
    address spender,
    euint64 amount,
    ebool isTransferable
  ) internal returns (ebool) {
    euint64 currentAllowance = _allowances[owner][spender];

    _allowances[owner][spender] = FHE.select(
      isTransferable,
      FHE.sub(currentAllowance, amount),
      currentAllowance
    );

    return isTransferable;
  }

  function _convertDecimalForWrap(
    uint256 amount
  ) internal view returns (uint64) {
    return uint64(amount / 10 ** (decimals() - encDecimals));
  }

  function _convertDecimalForUnwrap(
    uint64 amount
  ) internal view returns (uint256) {
    return uint256(amount) * 10 ** (decimals() - encDecimals);
  }
}
