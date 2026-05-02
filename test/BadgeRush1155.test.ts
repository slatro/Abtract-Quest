import { expect } from "chai";
import { ethers } from "hardhat";
import type { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { BadgeRush1155 } from "../typechain-types";

describe("BadgeRush1155", () => {
  let contract: BadgeRush1155;
  let owner: HardhatEthersSigner;
  let user: HardhatEthersSigner;
  let signer: HardhatEthersSigner;

  const BADGE_ID = 1;
  const PRICE = ethers.parseEther("0.0001");

  beforeEach(async () => {
    [owner, user, signer] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("BadgeRush1155");
    contract = await Factory.deploy(signer.address, "https://meta.badgerush.xyz");
    await contract.createBadge(BADGE_ID, PRICE, 100, true, true);
  });

  async function validSig(userAddr: string, badgeId: number, nonce: string, expiry: number) {
    const domain = {
      name: "BadgeRush",
      version: "1",
      chainId: (await ethers.provider.getNetwork()).chainId,
      verifyingContract: await contract.getAddress(),
    };
    const types = {
      UnlockPayload: [
        { name: "user",            type: "address" },
        { name: "badgeId",         type: "uint256" },
        { name: "chainId",         type: "uint256" },
        { name: "contractAddress", type: "address" },
        { name: "nonce",           type: "bytes32"  },
        { name: "expiry",          type: "uint256"  },
      ],
    };
    const value = {
      user: userAddr,
      badgeId,
      chainId: domain.chainId,
      contractAddress: domain.verifyingContract,
      nonce: ethers.encodeBytes32String(nonce),
      expiry,
    };
    return signer.signTypedData(domain, types, value);
  }

  it("mint succeeds with valid sig and correct ETH", async () => {
    const expiry = Math.floor(Date.now() / 1000) + 3600;
    const nonce = "nonce-1";
    const sig = await validSig(user.address, BADGE_ID, nonce, expiry);
    await expect(
      contract.connect(user).mint(
        BADGE_ID,
        ethers.encodeBytes32String(nonce),
        expiry,
        sig,
        { value: PRICE }
      )
    ).to.emit(contract, "BadgeMinted");
  });

  it("reverts on wrong ETH amount", async () => {
    const expiry = Math.floor(Date.now() / 1000) + 3600;
    const nonce = "nonce-2";
    const sig = await validSig(user.address, BADGE_ID, nonce, expiry);
    await expect(
      contract.connect(user).mint(
        BADGE_ID,
        ethers.encodeBytes32String(nonce),
        expiry,
        sig,
        { value: ethers.parseEther("0.00001") }
      )
    ).to.be.revertedWith("Wrong ETH amount");
  });

  it("reverts on double mint", async () => {
    const expiry = Math.floor(Date.now() / 1000) + 3600;
    const sig1 = await validSig(user.address, BADGE_ID, "nonce-3", expiry);
    await contract.connect(user).mint(BADGE_ID, ethers.encodeBytes32String("nonce-3"), expiry, sig1, { value: PRICE });

    const sig2 = await validSig(user.address, BADGE_ID, "nonce-4", expiry);
    await expect(
      contract.connect(user).mint(BADGE_ID, ethers.encodeBytes32String("nonce-4"), expiry, sig2, { value: PRICE })
    ).to.be.revertedWith("Already minted");
  });

  it("reverts on expired signature", async () => {
    const expiry = Math.floor(Date.now() / 1000) - 1;
    const sig = await validSig(user.address, BADGE_ID, "nonce-5", expiry);
    await expect(
      contract.connect(user).mint(BADGE_ID, ethers.encodeBytes32String("nonce-5"), expiry, sig, { value: PRICE })
    ).to.be.revertedWith("Signature expired");
  });

  it("reverts on used nonce", async () => {
    const expiry = Math.floor(Date.now() / 1000) + 3600;
    const sig = await validSig(user.address, BADGE_ID, "nonce-6", expiry);
    await contract.connect(user).mint(BADGE_ID, ethers.encodeBytes32String("nonce-6"), expiry, sig, { value: PRICE });
    await expect(
      contract.connect(user).mint(BADGE_ID, ethers.encodeBytes32String("nonce-6"), expiry, sig, { value: PRICE })
    ).to.be.revertedWith("Nonce already used");
  });

  it("reverts when paused", async () => {
    await contract.pause();
    const expiry = Math.floor(Date.now() / 1000) + 3600;
    const sig = await validSig(user.address, BADGE_ID, "nonce-7", expiry);
    await expect(
      contract.connect(user).mint(BADGE_ID, ethers.encodeBytes32String("nonce-7"), expiry, sig, { value: PRICE })
    ).to.be.revertedWithCustomError(contract, "EnforcedPause");
  });

  it("withdraw sends ETH to owner", async () => {
    const expiry = Math.floor(Date.now() / 1000) + 3600;
    const sig = await validSig(user.address, BADGE_ID, "nonce-8", expiry);
    await contract.connect(user).mint(BADGE_ID, ethers.encodeBytes32String("nonce-8"), expiry, sig, { value: PRICE });
    const before = await ethers.provider.getBalance(owner.address);
    await contract.withdraw();
    const after = await ethers.provider.getBalance(owner.address);
    expect(after).to.be.gt(before);
  });
});
