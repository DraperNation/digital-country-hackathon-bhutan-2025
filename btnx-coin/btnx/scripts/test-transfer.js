const hre = require("hardhat");
require("dotenv").config();
const cors = require("cors");
const express = require("express");
const axios = require("axios");

const { ethers } = hre;

const connectDB = require("../restapi/db");
const Transfer = require("../restapi/models/Transfer");

const BTNX_ADDRESS = "0x6f2548B040278E3B65C0158BfD38371e7e9c6712"; // your BTNX contract
const BTC_RECEIVE_ADDRESS = "tb1qed7vxuh8s2lhkhu58s8d3mj0qksd2utewejzyq";
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

app.use(
  cors({
    origin: "http://localhost:8080",
    credentials: true,
  })
);

app.post("/api/redeem", async (req, res) => {
  const { btcTx, ethAddress, btcAmount } = req.body;

  // Validate inputs
  if (!btcTx || !ethAddress || !ethers.isAddress(ethAddress) || !btcAmount) {
    console.error("Invalid inputs:", { btcTx, ethAddress, btcAmount });
    return res.status(400).json({ success: false, error: "Missing or invalid btcTx, ethAddress, or btcAmount" });
  }

  const parsedBtc = parseFloat(btcAmount);
  if (isNaN(parsedBtc) || parsedBtc <= 0) {
    console.error("Invalid BTC amount:", btcAmount);
    return res.status(400).json({ success: false, error: "BTC amount must be a positive number" });
  }

  try {
    // Fetch Bitcoin transaction with timeout
    const { data: txData } = await axios.get(`https://blockstream.info/testnet/api/tx/${btcTx}`, {
      timeout: 10000 // 10 seconds
    });
    console.log("Bitcoin transaction details:", {
      txid: txData.txid,
      confirmed: txData.status.confirmed,
      outputs: txData.vout,
    });

    // Check if transaction is confirmed
    if (!txData.status.confirmed) {
      console.error("Transaction not confirmed:", btcTx);
      return res.status(400).json({ success: false, error: "Bitcoin transaction is not yet confirmed" });
    }

    // Verify payment to BTC_RECEIVE_ADDRESS
    const paidOutput = txData.vout.find((o) => o.scriptpubkey_address === BTC_RECEIVE_ADDRESS);
    if (!paidOutput) {
      console.error("No output to expected address:", {
        expected: BTC_RECEIVE_ADDRESS,
        outputs: txData.vout.map((o) => o.scriptpubkey_address),
      });
      return res.status(400).json({
        success: false,
        error: `BTC not sent to ${BTC_RECEIVE_ADDRESS}. Found: ${txData.vout.map((o) => o.scriptpubkey_address).join(", ")}`,
      });
    }

    // Verify BTC amount
    const btcReceived = paidOutput.value / 1e8;
    console.log("BTC amount check:", { received: btcReceived, requested: parsedBtc });
    if (btcReceived < parsedBtc) {
      console.error("Insufficient BTC received:", { received: btcReceived, requested: parsedBtc });
      return res.status(400).json({
        success: false,
        error: `Insufficient BTC: received ${btcReceived} BTC, requested ${parsedBtc} BTC`
      });
    }

    // Check for duplicate redemption
    const existingTransfer = await Transfer.findOne({ btcTxHash: btcTx });
    if (existingTransfer) {
      console.error("Transaction already redeemed:", btcTx);
      return res.status(400).json({ success: false, error: "This Bitcoin transaction has already been redeemed" });
    }

    // Fetch current Bitcoin price for accurate BTNX calculation
    let bitcoinPrice = 45000; // Fallback price
    try {
      const btcPriceResponse = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd', {
        timeout: 5000
      });
      bitcoinPrice = btcPriceResponse.data.bitcoin.usd;
      console.log("Current Bitcoin price:", bitcoinPrice);
    } catch (priceError) {
      console.warn("Failed to fetch Bitcoin price, using fallback:", priceError.message);
    }

    // Calculate BTNX reward using 200% collateral ratio
    // Formula: BTNX = BTC_Amount / 2 
    // Where 2 represents the 200% collateral ratio (2 BTC = 1 BTNX)
    const rewardAmount = parsedBtc / 2; // 200% collateral ratio: 2 BTC = 1 BTNX
    
    const rewardWei = ethers.parseUnits(rewardAmount.toString(), 18);
    console.log("BTNX reward calculated:", { 
      btcAmount: parsedBtc,
      btcPrice: bitcoinPrice,
      btcValueUSD: parsedBtc * bitcoinPrice,
      rewardAmount: rewardAmount,
      rewardWei: rewardWei.toString(),
      collateralRatio: "200% (2 BTC = 1 BTNX)"
    });

    // Execute BTNX transfer
    const [sender] = await ethers.getSigners();
    const btnx = await ethers.getContractAt("BTNX", BTNX_ADDRESS, sender);
    const senderBalance = await btnx.balanceOf(sender.address);
    console.log("Sender details:", {
      address: sender.address,
      balance: ethers.formatUnits(senderBalance, 18),
    });

    if (senderBalance < rewardWei) {
      console.error("Insufficient sender balance:", {
        balance: ethers.formatUnits(senderBalance, 18),
        required: rewardAmount,
      });
      return res.status(400).json({
        success: false,
        error: `Sender has insufficient BTNX: ${ethers.formatUnits(senderBalance, 18)} available`
      });
    }

    const tx = await btnx.transfer(ethAddress, rewardWei);
    const receipt = await tx.wait();
    console.log("Ethereum transfer completed:", { txHash: receipt.hash, status: receipt.status });

    // Save transfer record
    const transfer = new Transfer({
      sender: sender.address.toLowerCase(),
      receiver: ethAddress.toLowerCase(),
      amount: rewardWei.toString(),
      txHash: receipt.hash,
      btcTxHash: btcTx,
    });
    await transfer.save();
    console.log("Transfer record saved:", transfer);

    res.json({
      success: true,
      message: `Sent ${rewardAmount} BTNX for ${parsedBtc} BTC`,
      txHash: receipt.hash,
      ethAddress,
    });
  } catch (err) {
    console.error("Redeem error:", err.message);
    if (err.code === 'ECONNABORTED') {
      return res.status(504).json({ success: false, error: "Request to Blockstream API timed out" });
    }
    if (err.response?.status === 404) {
      return res.status(400).json({ success: false, error: "Invalid Bitcoin transaction ID" });
    }
    return res.status(500).json({ success: false, error: `Failed to process redemption: ${err.message}` });
  }
});



app.get("/transfers", async (req, res) => {
  try {
    const { sender, receiver } = req.query;
    const filter = {};
    if (sender) filter.sender = sender.toLowerCase();
    if (receiver) filter.receiver = receiver.toLowerCase();

    const transfers = await Transfer.find(filter).sort({ timestamp: -1 });
    res.json(transfers);
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

app.get("/api/balance/:address", async (req, res) => {
  const address = req.params.address;

  if (!ethers.isAddress(address)) {
    return res.status(400).json({ success: false, error: "Invalid address" });
  }

  try {
    const [signer] = await ethers.getSigners(); // just to connect the contract
    const btnx = await ethers.getContractAt("BTNX", BTNX_ADDRESS, signer);

    const balance = await btnx.balanceOf(address);
    const formatted = ethers.formatUnits(balance, 18);

    res.json({
      success: true,
      address,
      balance: formatted,
    });
  } catch (err) {
    console.error("Failed to fetch balance:", err);
    res.status(500).json({ success: false, error: "Could not fetch balance" });
  }
});


app.post("/api/transfer", async (req, res) => {
  const { receiver, amt } = req.body;

  if (!receiver || !ethers.isAddress(receiver)) {
    return res.status(400).json({ success: false, error: "Invalid or missing receiver address" });
  }

  try {
    const [sender] = await ethers.getSigners();
    const btnx = await ethers.getContractAt("BTNX", BTNX_ADDRESS, sender);

    const amount = ethers.parseUnits(amt.toString(), 18);
    const tx = await btnx.transfer(receiver, amount);
    const receipt = await tx.wait();

    const transfer = new Transfer({
      sender: sender.address,
      receiver,
      amount: amount.toString(),
      txHash: receipt.hash,
    });
    await transfer.save();

    res.json({
      success: true,
      txHash: receipt.hash,
      sender: sender.address,
      receiver,
      amount: ethers.formatUnits(amount, 18),
    });
  } catch (err) {
    console.error("Transfer failed:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Transfer API is live on port ${PORT}`);
});
