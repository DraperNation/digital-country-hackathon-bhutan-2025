import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("LendingPool", function () {
  let lendingPool: Contract;
  let invoiceNFT: Contract;
  let stablecoin: Contract;
  let owner: SignerWithAddress;
  let supplier: SignerWithAddress;
  let buyer: SignerWithAddress;
  let lp: SignerWithAddress;

  beforeEach(async function () {
    [owner, supplier, buyer, lp] = await ethers.getSigners();

    // Deploy mock stablecoin
    const MockToken = await ethers.getContractFactory("MockERC20");
    stablecoin = await MockToken.deploy("Mock USDC", "USDC", 6);
    await stablecoin.waitForDeployment();

    // Deploy InvoiceNFT
    const InvoiceNFT = await ethers.getContractFactory("InvoiceNFT");
    invoiceNFT = await InvoiceNFT.deploy();
    await invoiceNFT.waitForDeployment();

    // Deploy LendingPool
    const LendingPool = await ethers.getContractFactory("LendingPool");
    lendingPool = await LendingPool.deploy(
      await stablecoin.getAddress(),
      await invoiceNFT.getAddress()
    );
    await lendingPool.waitForDeployment();

    // Mint some stablecoins to LP
    await stablecoin.mint(lp.address, ethers.parseUnits("1000000", 6));
    await stablecoin.connect(lp).approve(await lendingPool.getAddress(), ethers.parseUnits("1000000", 6));
  });

  describe("Deposits", function () {
    it("Should allow LP to deposit stablecoins", async function () {
      const depositAmount = ethers.parseUnits("10000", 6);

      await expect(lendingPool.connect(lp).deposit(depositAmount))
        .to.emit(lendingPool, "Deposit")
        .withArgs(lp.address, depositAmount);

      expect(await lendingPool.deposits(lp.address)).to.equal(depositAmount);
      expect(await lendingPool.totalDeposits()).to.equal(depositAmount);
    });

    it("Should allow LP to withdraw stablecoins", async function () {
      const depositAmount = ethers.parseUnits("10000", 6);
      await lendingPool.connect(lp).deposit(depositAmount);

      await expect(lendingPool.connect(lp).withdraw(depositAmount))
        .to.emit(lendingPool, "Withdraw")
        .withArgs(lp.address, depositAmount);

      expect(await lendingPool.deposits(lp.address)).to.equal(0);
      expect(await lendingPool.totalDeposits()).to.equal(0);
    });
  });

  describe("Borrowing", function () {
    beforeEach(async function () {
      // Setup: LP deposits and supplier mints verified invoice
      await lendingPool.connect(lp).deposit(ethers.parseUnits("10000", 6));

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
    });

    it("Should allow supplier to borrow against verified invoice", async function () {
      const maxBorrowAmount = await lendingPool.calculateMaxBorrowableAmount(1);

      await expect(lendingPool.connect(supplier).borrow(1))
        .to.emit(lendingPool, "Borrow")
        .withArgs(supplier.address, 1, maxBorrowAmount);

      const loan = await lendingPool.loans(1);
      expect(loan.amount).to.equal(maxBorrowAmount);
      expect(loan.isRepaid).to.be.false;
      expect(loan.isLiquidated).to.be.false;
    });

    it("Should not allow borrowing against unverified invoice", async function () {
      // Mint another unverified invoice
      const invoiceId = "INV-002";
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

      await expect(lendingPool.connect(supplier).borrow(2))
        .to.be.revertedWith("Invoice not verified");
    });
  });

  describe("Repayment", function () {
    beforeEach(async function () {
      // Setup: LP deposits, supplier mints verified invoice and borrows
      await lendingPool.connect(lp).deposit(ethers.parseUnits("10000", 6));

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

      const maxBorrowAmount = await lendingPool.calculateMaxBorrowableAmount(1);
      await lendingPool.connect(supplier).borrow(1);

      // Mint enough stablecoins to supplier for repayment
      await stablecoin.mint(supplier.address, maxBorrowAmount);
      await stablecoin.connect(supplier).approve(await lendingPool.getAddress(), maxBorrowAmount);
    });

    it("Should allow supplier to repay loan", async function () {
      const loan = await lendingPool.loans(1);
      const repayAmount = loan.amount;

      await expect(lendingPool.connect(supplier).repay(1))
        .to.emit(lendingPool, "Repay")
        .withArgs(supplier.address, 1, repayAmount);

      const updatedLoan = await lendingPool.loans(1);
      expect(updatedLoan.isRepaid).to.be.true;
    });
  });

  describe("Liquidation", function () {
    beforeEach(async function () {
      // Setup: LP deposits, supplier mints verified invoice and borrows
      await lendingPool.connect(lp).deposit(ethers.parseUnits("10000", 6));

      const invoiceId = "INV-001";
      const amount = ethers.parseEther("1000");
      const dueDate = Math.floor(Date.now() / 1000) + 1; // 1 second from now
      const ipfsHash = "QmTest123";

      await invoiceNFT.connect(supplier).mintInvoiceNFT(
        buyer.address,
        invoiceId,
        amount,
        dueDate,
        ipfsHash
      );
      await invoiceNFT.connect(owner).verifyInvoice(1);

      const maxBorrowAmount = await lendingPool.calculateMaxBorrowableAmount(1);
      await lendingPool.connect(supplier).borrow(1);

      // Move time forward past due date
      await ethers.provider.send("evm_increaseTime", [2]);
      await ethers.provider.send("evm_mine");
    });

    it("Should allow liquidation of overdue loan", async function () {
      const loan = await lendingPool.loans(1);
      const liquidateAmount = loan.amount;

      // Mint enough stablecoins to liquidator
      await stablecoin.mint(lp.address, liquidateAmount);
      await stablecoin.connect(lp).approve(await lendingPool.getAddress(), liquidateAmount);

      await expect(lendingPool.connect(lp).liquidateOverdue(1))
        .to.emit(lendingPool, "Liquidate")
        .withArgs(1, lp.address, liquidateAmount);

      const updatedLoan = await lendingPool.loans(1);
      expect(updatedLoan.isLiquidated).to.be.true;
      expect(await invoiceNFT.ownerOf(1)).to.equal(lp.address);
    });
  });
}); 