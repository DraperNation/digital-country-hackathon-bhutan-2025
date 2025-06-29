const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("EResidencyNFT", function () {
  let EResidencyNFT;
  let eResidencyNFT;
  let owner;
  let addr1;
  
  const name = "Test User";
  const citizenshipCountry = "Testland";
  const eResidencyId = "ER12345";
  const tokenURI = "ipfs://test-uri";

  beforeEach(async function () {
    // Get the ContractFactory and Signers here
    EResidencyNFT = await ethers.getContractFactory("EResidencyNFT");
    [owner, addr1] = await ethers.getSigners();
    
    // Deploy a new contract for each test
    eResidencyNFT = await EResidencyNFT.deploy();
    await eResidencyNFT.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await eResidencyNFT.owner()).to.equal(owner.address);
    });
  });

  describe("Minting", function () {
    it("Should mint a new eResidency NFT", async function () {
      await expect(
        eResidencyNFT.mintNFT(
          addr1.address,
          name,
          citizenshipCountry,
          eResidencyId,
          tokenURI
        )
      ).to.emit(eResidencyNFT, "ResidencyMinted").withArgs(addr1.address, 1, eResidencyId);

      // Check token ownership
      expect(await eResidencyNFT.ownerOf(1)).to.equal(addr1.address);
      
      // Check residency data
      const [storedName, storedCountry, storedId, timestamp] = await eResidencyNFT.getResidencyData(1);
      expect(storedName).to.equal(name);
      expect(storedCountry).to.equal(citizenshipCountry);
      expect(storedId).to.equal(eResidencyId);
      expect(timestamp).to.be.a("bigint");
    });

    it("Should not allow minting multiple tokens to the same address", async function () {
      // First mint should succeed
      await eResidencyNFT.mintNFT(
        addr1.address,
        name,
        citizenshipCountry,
        eResidencyId,
        tokenURI
      );

      // Second mint should fail
      await expect(
        eResidencyNFT.mintNFT(
          addr1.address,
          "Another Name",
          "Another Country",
          "ER67890",
          tokenURI
        )
      ).to.be.revertedWith("Address already has an eResidency NFT");
    });
  });

  describe("Soulbound functionality", function () {
    it("Should not allow token transfers", async function () {
      // Mint a token
      await eResidencyNFT.mintNFT(
        addr1.address,
        name,
        citizenshipCountry,
        eResidencyId,
        tokenURI
      );

      // Attempt to transfer should fail
      await expect(
        eResidencyNFT.connect(addr1).transferFrom(
          addr1.address,
          owner.address,
          1
        )
      ).to.be.revertedWith("eResidencyNFT: Token is soulbound and cannot be transferred");
    });
  });
});
