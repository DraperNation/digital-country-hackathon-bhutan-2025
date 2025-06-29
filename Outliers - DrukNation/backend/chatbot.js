require("dotenv").config();
const express = require("express");
const pdfParse = require("pdf-parse");
const axios = require("axios");
const cheerio = require("cheerio");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const path = require("path");
const fs = require("fs");

const app = express();
const port = process.env.PORT || 3000;

// Gemini API configuration
const GEMINI_API_KEY =
  process.env.GEMINI_API_KEY || "YOUR_GEMINI_API_KEY_PLACEHOLDER";
const PDF_PATH = path.join(__dirname, "uploads", "Bhutan-Penal-Code.pdf");

// Initialize Gemini AI
let genAI;
let model;
let isInitialized = false;

// Storage for legal documents
let bhutanLawData = {
  penalCode: "",
  wikiContent: "",
  combinedContext: "",
  lastUpdated: null,
};

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Gemini API
function initializeGemini() {
  try {
    if (
      !GEMINI_API_KEY ||
      GEMINI_API_KEY === "YOUR_GEMINI_API_KEY_PLACEHOLDER"
    ) {
      console.warn(
        "WARNING: Using placeholder API key. Set GEMINI_API_KEY environment variable."
      );
    }

    genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    console.log("✓ Gemini API initialized successfully");
    return true;
  } catch (error) {
    console.error("✗ Failed to initialize Gemini API:", error.message);
    return false;
  }
}

// Extract text from PDF
async function extractPDFText(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error(`PDF file not found at path: ${filePath}`);
    }

    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    console.log(
      `✓ PDF extracted successfully (${data.text.length} characters)`
    );
    return data.text;
  } catch (error) {
    console.error("✗ Error extracting PDF text:", error.message);
    throw error;
  }
}

// Scrape Wikipedia content
async function scrapeWikipediaContent(url) {
  try {
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    const $ = cheerio.load(response.data);

    // Remove navigation, references, and other non-content elements
    $(
      ".navbox, .reflist, .navigation-not-searchable, .printfooter, .infobox"
    ).remove();

    // Extract main content
    const content = $("#mw-content-text").text().trim();
    console.log(
      `✓ Wikipedia content scraped successfully (${content.length} characters)`
    );
    return content;
  } catch (error) {
    console.error("✗ Error scraping Wikipedia:", error.message);
    throw error;
  }
}

// Generate response using Gemini
async function generateResponse(question, context) {
  try {
    if (!model) {
      throw new Error("Gemini model not initialized");
    }

    const prompt = `You are a legal expert specializing in Bhutan law. Based on the following legal documents and information about Bhutan law, please answer the user's question accurately and comprehensively.

CONTEXT:
${context}

USER QUESTION: ${question}

Please provide a detailed answer based on the legal documents provided. If the question cannot be answered from the available documents, please state that clearly. Always cite relevant sections or provisions when possible.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("✗ Error generating response:", error.message);
    throw error;
  }
}

// Initialize all documents on startup
async function initializeDocuments() {
  console.log("🚀 Initializing Bhutan Law Server...");

  try {
    // Initialize Gemini API
    const geminiInit = initializeGemini();
    if (!geminiInit) {
      console.warn(
        "⚠️  Gemini API initialization failed, but server will continue"
      );
    }

    // Load PDF
    console.log("📄 Loading Bhutan Penal Code PDF...");
    bhutanLawData.penalCode = await extractPDFText(PDF_PATH);

    // Load Wikipedia content
    console.log("🌐 Loading Wikipedia content...");
    bhutanLawData.wikiContent = await scrapeWikipediaContent(
      "https://en.wikipedia.org/wiki/Law_of_Bhutan"
    );

    // Combine contexts
    bhutanLawData.combinedContext =
      bhutanLawData.penalCode + "\n\n" + bhutanLawData.wikiContent;

    bhutanLawData.lastUpdated = new Date().toISOString();
    isInitialized = true;

    console.log("✅ Server initialization completed successfully!");
    console.log(
      `📊 Total context length: ${bhutanLawData.combinedContext.length} characters`
    );
  } catch (error) {
    console.error("❌ Server initialization failed:", error.message);
    process.exit(1);
  }
}

// Routes

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    status: "online",
    service: "Bhutan Law API Server",
    version: "1.0.0",
    initialized: isInitialized,
    timestamp: new Date().toISOString(),
  });
});

// Detailed status endpoint
app.get("/status", (req, res) => {
  res.json({
    server: {
      status: "running",
      initialized: isInitialized,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    },
    gemini: {
      initialized: !!model,
      apiKey:
        GEMINI_API_KEY !== "YOUR_GEMINI_API_KEY_PLACEHOLDER"
          ? "configured"
          : "placeholder",
    },
    documents: {
      penalCodeLoaded: bhutanLawData.penalCode.length > 0,
      wikipediaLoaded: bhutanLawData.wikiContent.length > 0,
      totalContextLength: bhutanLawData.combinedContext.length,
      lastUpdated: bhutanLawData.lastUpdated,
    },
  });
});

// Ask question endpoint
app.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;

    // Validation
    if (!question || typeof question !== "string") {
      return res.status(400).json({
        error: "Question is required and must be a string",
        success: false,
      });
    }

    if (!isInitialized) {
      return res.status(503).json({
        error: "Server is still initializing. Please try again later.",
        success: false,
      });
    }

    if (!model) {
      return res.status(503).json({
        error: "Gemini API not properly initialized",
        success: false,
      });
    }

    if (!bhutanLawData.combinedContext) {
      return res.status(503).json({
        error: "Legal documents not loaded",
        success: false,
      });
    }

    // Generate response
    const answer = await generateResponse(
      question,
      bhutanLawData.combinedContext
    );

    res.json({
      success: true,
      question: question,
      answer: answer,
      contextLength: bhutanLawData.combinedContext.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error processing question:", error);
    res.status(500).json({
      error: "Failed to process question",
      details: error.message,
      success: false,
    });
  }
});

// Reload documents endpoint (for manual refresh)
app.post("/reload", async (req, res) => {
  try {
    console.log("🔄 Manual document reload requested...");
    await initializeDocuments();
    res.json({
      success: true,
      message: "Documents reloaded successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error reloading documents:", error);
    res.status(500).json({
      error: "Failed to reload documents",
      details: error.message,
      success: false,
    });
  }
});

// Get document info endpoint
app.get("/documents", (req, res) => {
  res.json({
    penalCode: {
      loaded: bhutanLawData.penalCode.length > 0,
      length: bhutanLawData.penalCode.length,
      preview: bhutanLawData.penalCode.substring(0, 200) + "...",
    },
    wikipedia: {
      loaded: bhutanLawData.wikiContent.length > 0,
      length: bhutanLawData.wikiContent.length,
      preview: bhutanLawData.wikiContent.substring(0, 200) + "...",
    },
    combined: {
      length: bhutanLawData.combinedContext.length,
      lastUpdated: bhutanLawData.lastUpdated,
    },
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error("Unhandled error:", error);
  res.status(500).json({
    error: "Internal server error",
    success: false,
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Endpoint not found",
    availableEndpoints: [
      "GET /",
      "GET /status",
      "GET /documents",
      "POST /ask",
      "POST /reload",
    ],
    success: false,
  });
});

// Start server
async function startServer() {
  try {
    // Initialize documents before starting server
    await initializeDocuments();

    app.listen(port, () => {
      console.log(`🌟 Bhutan Law API Server running on port ${port}`);
      console.log(`🔗 Health check: http://localhost:${port}/`);
      console.log(`📋 Status: http://localhost:${port}/status`);
      console.log(`❓ Ask questions: POST http://localhost:${port}/ask`);
      console.log("\n📝 Required dependencies:");
      console.log(
        "npm install express pdf-parse axios cheerio @google/generative-ai"
      );
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("\n🛑 Received SIGINT. Shutting down gracefully...");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("\n🛑 Received SIGTERM. Shutting down gracefully...");
  process.exit(0);
});

// Start the server
startServer();

module.exports = app;
