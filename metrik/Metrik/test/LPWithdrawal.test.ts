import { expect } from "chai";
import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

describe("LP Withdrawal Tests", function () {
  this.timeout(600000); // 10 minutes for all tests in this suite
  
  // Test accounts
  let owner: any;
  let lp: any;

  // Contract instances
  let usdc: any;
  let lendingPool: any;

  // Test constants
  const LP_DEPOSIT = ethers.parseUnits("100000", 6); // 100,000 USDC
  const WAIT_TIME = 5 * 60 * 1000; // 5 minutes wait for interest accrual

  // Load deployed contracts
  before(async function() {
    console.log("Starting test setup...");
    [owner, lp] = await ethers.getSigners();
    console.log("Loaded signers");

    // Load deployed contract addresses
    const network = process.env.HARDHAT_NETWORK || "fuji";
    const deploymentPath = path.join(__dirname, "..", "deployments", `${network}.json`);
    const deployedAddresses = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));
    console.log("Loaded deployment addresses");

    // Get contract instances
    console.log("Loading contract instances...");
    usdc = await ethers.getContractAt("MockERC20", deployedAddresses.usdc);
    lendingPool = await ethers.getContractAt("LendingPool", deployedAddresses.lendingPool);
    console.log("Contract instances loaded");

    // Setup initial balances if needed
    console.log("Checking initial balances...");
    const lpUSDCBalance = await usdc.balanceOf(lp.address);

    if (lpUSDCBalance < LP_DEPOSIT) {
      console.log("Minting USDC to LP...");
      const mintUsdcLpTx = await usdc.mint(lp.address, LP_DEPOSIT);
      await mintUsdcLpTx.wait();
      console.log("Minted USDC to LP");
    }

    console.log("Test setup completed");
  });

  // Reset state between tests
  beforeEach(async function() {
    // Reset LP deposit
    const lpInfo = await lendingPool.lpInfo(lp.address);
    if (lpInfo.depositAmount > 0) {
      try {
        // First withdraw interest if any
        if (lpInfo.interestAccrued > 0) {
          await lendingPool.connect(lp).withdrawInterest();
        }
        // Then withdraw deposit
        await lendingPool.connect(lp).withdraw(lpInfo.depositAmount);
      } catch (error) {
        console.log("Could not reset LP deposit, continuing...");
      }
    }
  });

  describe("LP Deposit and Withdrawal", function () {
    it("Should allow LP to deposit USDC", async function () {
      // First ensure LP has no existing deposit
      const lpInfo = await lendingPool.lpInfo(lp.address);
      if (lpInfo.depositAmount > 0) {
        try {
          if (lpInfo.interestAccrued > 0) {
            await lendingPool.connect(lp).withdrawInterest();
          }
          await lendingPool.connect(lp).withdraw(lpInfo.depositAmount);
        } catch (error) {
          console.log("Could not reset LP deposit, continuing...");
        }
      }

      // Ensure LP has enough USDC
      const lpBalance = await usdc.balanceOf(lp.address);
      if (lpBalance < LP_DEPOSIT) {
        console.log("Minting additional USDC to LP...");
        await usdc.mint(lp.address, LP_DEPOSIT - lpBalance);
      }

      console.log("\nApproving USDC for LP deposit...");
      const approveTx = await usdc.connect(lp).approve(await lendingPool.getAddress(), LP_DEPOSIT);
      await approveTx.wait();
      console.log("Approved", ethers.formatUnits(LP_DEPOSIT, 6), "USDC for LP deposit");

      // Check LP's USDC balance before deposit
      const lpBalanceBefore = await usdc.balanceOf(lp.address);
      console.log("LP USDC balance before deposit:", ethers.formatUnits(lpBalanceBefore, 6));

      console.log("Depositing USDC to lending pool...");
      const depositTx = await lendingPool.connect(lp).deposit(LP_DEPOSIT);
      await depositTx.wait();
      console.log("Deposited", ethers.formatUnits(LP_DEPOSIT, 6), "USDC to lending pool");

      // Check LP's USDC balance after deposit
      const lpBalanceAfter = await usdc.balanceOf(lp.address);
      console.log("LP USDC balance after deposit:", ethers.formatUnits(lpBalanceAfter, 6));

      // Check lending pool's USDC balance
      const lendingPoolBalance = await usdc.balanceOf(await lendingPool.getAddress());
      console.log("Lending pool USDC balance:", ethers.formatUnits(lendingPoolBalance, 6));

      const lpInfoAfter = await lendingPool.lpInfo(lp.address);
      console.log("LP info after deposit:", {
        depositAmount: ethers.formatUnits(lpInfoAfter.depositAmount, 6),
        interestAccrued: ethers.formatUnits(lpInfoAfter.interestAccrued, 6),
        lastInterestUpdate: new Date(Number(lpInfoAfter.lastInterestUpdate) * 1000).toISOString()
      });

      expect(lpInfoAfter.depositAmount).to.equal(LP_DEPOSIT);
    });

    it("Should allow LP to withdraw funds with earned interest", async function () {
      // First ensure LP has a deposit
      const lpInfo = await lendingPool.lpInfo(lp.address);
      if (lpInfo.depositAmount === 0) {
        // Deposit if no existing deposit
        console.log("\nApproving USDC for LP deposit...");
        const approveTx = await usdc.connect(lp).approve(await lendingPool.getAddress(), LP_DEPOSIT);
        await approveTx.wait();
        
        console.log("Depositing USDC to lending pool...");
        const depositTx = await lendingPool.connect(lp).deposit(LP_DEPOSIT);
        await depositTx.wait();
      }
      
      console.log("\nTesting LP withdrawal with interest...");
      
      // Wait for interest to accrue
      console.log("Waiting for interest to accrue...");
      await new Promise(resolve => setTimeout(resolve, WAIT_TIME));
      
      // Get initial balances
      const initialLPBalance = await usdc.balanceOf(lp.address);
      const initialPoolBalance = await usdc.balanceOf(await lendingPool.getAddress());
      console.log("Initial LP USDC balance:", ethers.formatUnits(initialLPBalance, 6));
      console.log("Initial pool USDC balance:", ethers.formatUnits(initialPoolBalance, 6));
      
      // Get LP info before withdrawal
      const lpInfoBefore = await lendingPool.lpInfo(lp.address);
      console.log("LP deposit amount before:", ethers.formatUnits(lpInfoBefore.depositAmount, 6));
      console.log("LP interest accrued before:", ethers.formatUnits(lpInfoBefore.interestAccrued, 6));
      
      // Get current interest from contract
      const currentInterest = await lendingPool.getLPInterest(lp.address);
      console.log("Current LP interest:", ethers.formatUnits(currentInterest, 6));
      
      // Withdraw deposit amount
      const withdrawAmount = lpInfoBefore.depositAmount;
      console.log("Withdrawing amount:", ethers.formatUnits(withdrawAmount, 6));
      
      // Withdraw
      const withdrawTx = await lendingPool.connect(lp).withdraw(withdrawAmount);
      await withdrawTx.wait();
      
      // Get final balances
      const finalLPBalance = await usdc.balanceOf(lp.address);
      const finalPoolBalance = await usdc.balanceOf(await lendingPool.getAddress());
      console.log("Final LP USDC balance:", ethers.formatUnits(finalLPBalance, 6));
      console.log("Final pool USDC balance:", ethers.formatUnits(finalPoolBalance, 6));
      
      // Get LP info after withdrawal
      const lpInfoAfter = await lendingPool.lpInfo(lp.address);
      console.log("LP deposit amount after:", ethers.formatUnits(lpInfoAfter.depositAmount, 6));
      console.log("LP interest accrued after:", ethers.formatUnits(lpInfoAfter.interestAccrued, 6));
      
      // Verify withdrawal
      expect(finalLPBalance).to.be.gt(initialLPBalance);
      expect(lpInfoAfter.depositAmount).to.equal(0);
    });

    it("Should allow LP to withdraw interest separately", async function () {
      // First ensure LP has a deposit
      const lpInfo = await lendingPool.lpInfo(lp.address);
      if (lpInfo.depositAmount === 0) {
        // Deposit if no existing deposit
        console.log("\nApproving USDC for LP deposit...");
        const approveTx = await usdc.connect(lp).approve(await lendingPool.getAddress(), LP_DEPOSIT);
        await approveTx.wait();
        
        console.log("Depositing USDC to lending pool...");
        const depositTx = await lendingPool.connect(lp).deposit(LP_DEPOSIT);
        await depositTx.wait();
      }
      
      // Wait for interest to accrue
      console.log("Waiting for interest to accrue...");
      await new Promise(resolve => setTimeout(resolve, WAIT_TIME));
      
      // Get initial balances
      const initialLPBalance = await usdc.balanceOf(lp.address);
      console.log("Initial LP USDC balance:", ethers.formatUnits(initialLPBalance, 6));
      
      // Get current interest from contract
      const currentInterest = await lendingPool.getLPInterest(lp.address);
      console.log("Current LP interest:", ethers.formatUnits(currentInterest, 6));
      
      // Get LP info before interest withdrawal
      const lpInfoBefore = await lendingPool.lpInfo(lp.address);
      console.log("LP interest accrued before:", ethers.formatUnits(lpInfoBefore.interestAccrued, 6));
      
      // Withdraw interest
      const withdrawInterestTx = await lendingPool.connect(lp).withdrawInterest();
      await withdrawInterestTx.wait();
      
      // Get final balances
      const finalLPBalance = await usdc.balanceOf(lp.address);
      console.log("Final LP USDC balance:", ethers.formatUnits(finalLPBalance, 6));
      
      // Get LP info after interest withdrawal
      const lpInfoAfter = await lendingPool.lpInfo(lp.address);
      console.log("LP interest accrued after:", ethers.formatUnits(lpInfoAfter.interestAccrued, 6));
      
      // Verify interest withdrawal
      expect(finalLPBalance).to.be.gt(initialLPBalance);
      expect(lpInfoAfter.interestAccrued).to.equal(0);
    });
  });
}); 