// models/Transfer.js
const mongoose = require("mongoose");

const TransferSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  receiver: { type: String, required: true },
  amount: { type: String, required: true }, // in wei
  txHash: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Transfer", TransferSchema);

