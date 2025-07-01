import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("InvoiceNFT", function () {
  let invoiceNFT: Contract;
  let owner: SignerWithAddress;
  let supplier: SignerWithAddress;
  let buyer: SignerWithAddress;

  beforeEach(async function () {
    [owner, supplier, buyer] = await ethers.getSigners();

    const InvoiceNFT = await ethers.getContractFactory("InvoiceNFT");
    invoiceNFT = await InvoiceNFT.deploy();
    await invoiceNFT.waitForDeployment();
  });

  describe("Minting", function () {
    it("Should mint a new invoice NFT", async function () {
      const invoiceId = "INV-001";
      const amount = ethers.parseEther("1000");
      const dueDate = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60; // 30 days from now
      const ipfsHash = "QmTest123";

      await expect(
        invoiceNFT.connect(supplier).mintInvoiceNFT(
          buyer.address,
          invoiceId,
          amount,
          dueDate,
          ipfsHash
        )
      )
        .to.emit(invoiceNFT, "InvoiceMinted")
        .withArgs(1, invoiceId, supplier.address, buyer.address, amount, dueDate);

      const details = await invoiceNFT.getInvoiceDetails(1);
      expect(details.invoiceId).to.equal(invoiceId);
      expect(details.supplier).to.equal(supplier.address);
      expect(details.buyer).to.equal(buyer.address);
      expect(details.creditAmount).to.equal(amount);
      expect(details.dueDate).to.equal(dueDate);
      expect(details.ipfsHash).to.equal(ipfsHash);
      expect(details.isVerified).to.be.false;
    });

    it("Should not allow minting with invalid parameters", async function () {
      const invoiceId = "INV-001";
      const amount = ethers.parseEther("1000");
      const dueDate = Math.floor(Date.now() / 1000) - 1; // Past date
      const ipfsHash = "QmTest123";

      await expect(
        invoiceNFT.connect(supplier).mintInvoiceNFT(
          buyer.address,
          invoiceId,
          amount,
          dueDate,
          ipfsHash
        )
      ).to.be.revertedWith("Due date must be in the future");
    });
  });

  describe("Verification", function () {
    it("Should allow owner to verify invoice", async function () {
      const invoiceId = "INV-001";
      const amount = ethers.parseEther("1000");
      const dueDate = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;
      const ipfsHash = "QmTest123";

      await invoiceNFT.connect(supplier).mintInvoiceNFT(
        buyer.address,
        invoiceId,
        amount,
        dueDate,
        ipfsHash
      );

      await expect(invoiceNFT.connect(owner).verifyInvoice(1))
        .to.emit(invoiceNFT, "InvoiceVerified")
        .withArgs(1);

      const details = await invoiceNFT.getInvoiceDetails(1);
      expect(details.isVerified).to.be.true;
    });

    it("Should not allow non-owner to verify invoice", async function () {
      const invoiceId = "INV-001";
      const amount = ethers.parseEther("1000");
      const dueDate = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;
      const ipfsHash = "QmTest123";

      await invoiceNFT.connect(supplier).mintInvoiceNFT(
        buyer.address,
        invoiceId,
        amount,
        dueDate,
        ipfsHash
      );

      await expect(
        invoiceNFT.connect(supplier).verifyInvoice(1)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Transfers", function () {
    it("Should not allow transfer of unverified invoice", async function () {
      const invoiceId = "INV-001";
      const amount = ethers.parseEther("1000");
      const dueDate = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;
      const ipfsHash = "QmTest123";

      await invoiceNFT.connect(supplier).mintInvoiceNFT(
        buyer.address,
        invoiceId,
        amount,
        dueDate,
        ipfsHash
      );

      await expect(
        invoiceNFT.connect(supplier).transferFrom(
          supplier.address,
          buyer.address,
          1
        )
      ).to.be.revertedWith("Invoice must be verified before transfer");
    });

    it("Should allow transfer of verified invoice", async function () {
      const invoiceId = "INV-001";
      const amount = ethers.parseEther("1000");
      const dueDate = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;
      const ipfsHash = "QmTest123";

      await invoiceNFT.connect(supplier).mintInvoiceNFT(
        buyer.address,
        invoiceId,
        amount,
        dueDate,
        ipfsHash
      );

      await invoiceNFT.connect(owner).verifyInvoice(1);
      await invoiceNFT.connect(supplier).approve(buyer.address, 1);

      await expect(
        invoiceNFT.connect(buyer).transferFrom(
          supplier.address,
          buyer.address,
          1
        )
      ).to.not.be.reverted;

      expect(await invoiceNFT.ownerOf(1)).to.equal(buyer.address);
    });
  });
}); 