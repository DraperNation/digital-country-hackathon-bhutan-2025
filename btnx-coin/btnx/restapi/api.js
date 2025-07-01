// api.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./db");         // ✅ Import your existing DB connection
const Transfer = require("./models/Transfer");

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware (optional: to support future POST/PUT)
app.use(express.json());
app.use(cors()); 

app.use(
  cors({
    origin: "http://localhost:4000",
    credentials: true,
  })
);

// GET all transfers or filtered by sender/receiver
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

// GET a specific transfer by txHash
app.get("/transfers/:txHash", async (req, res) => {
  try {
    const transfer = await Transfer.findOne({ txHash: req.params.txHash });
    if (!transfer) return res.status(404).json({ error: "Transfer not found" });
    res.json(transfer);
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// Start server only after DB is connected
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 REST API running at http://localhost:${PORT}`);
  });
});

