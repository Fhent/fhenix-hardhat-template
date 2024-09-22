import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import chalk from "chalk";

const hre = require("hardhat");

const func: DeployFunction = async function () {
  const { fhenixjs, ethers } = hre;
  const { deploy } = hre.deployments;
  const [signer] = await ethers.getSigners();

  if ((await ethers.provider.getBalance(signer.address)).toString() === "0") {
    if (hre.network.name === "localfhenix") {
      await fhenixjs.getFunds(signer.address);
    } else {
      console.log(
        chalk.red(
          "Please fund your account with testnet FHE from https://faucet.fhenix.zone",
        ),
      );
      return;
    }
  }

  const encryptedERC20 = await deploy("EncryptedERC20", {
    from: signer.address,
    args: ["EncryptedERC20", "E20"],
    log: true,
    skipIfAlreadyDeployed: false,
  });

  const bridge = await deploy("FhenixBridge", {
    from: signer.address,
    args: [encryptedERC20.address],
    log: true,
    skipIfAlreadyDeployed: false,
  });

  console.log("Signer address: ", signer.address);
  console.log(`EncryptedERC20 contract: `, encryptedERC20.address);
  console.log(`Bridge contract: `, bridge.address);

  try {
    await hre.run("verify:verify", {
      address: encryptedERC20.address,
      constructorArguments: ["EncryptedERC20", "E20"],
    });

    await hre.run("verify:verify", {
      address: bridge.address,
      constructorArguments: [encryptedERC20.address],
    });

    console.log("Contracts verified!");
  } catch (error) {
    console.error("Verification failed");
  }
};

export default func;
func.id = "deploy_contract";
func.tags = ["Contract"];
