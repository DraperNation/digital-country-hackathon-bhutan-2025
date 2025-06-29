const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const axios = require("axios");
const cheerio = require("cheerio");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const path = require("path");
const fs = require("fs");

const app = express();
const port = 3000;

// Initialize Gemini AI
let genAI;
let model;

// Storage for legal documents
let bhutanLawData = {
  penalCode: "",
  wikiContent: "",
  combinedContext: "",
};

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Configure multer for file uploads
const upload = multer({
  dest: "uploads/",
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"));
    }
  },
});

// Initialize Gemini API
function initializeGemini(apiKey) {
  try {
    genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    console.log("Gemini API initialized successfully");
    return true;
  } catch (error) {
    console.error("Failed to initialize Gemini API:", error);
    return false;
  }
}

// Extract text from PDF
async function extractPDFText(filePath) {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  } catch (error) {
    console.error("Error extracting PDF text:", error);
    throw error;
  }
}

// Scrape Wikipedia content
async function scrapeWikipediaContent(url) {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    // Remove navigation, references, and other non-content elements
    $(".navbox, .reflist, .navigation-not-searchable, .printfooter").remove();

    // Extract main content
    const content = $("#mw-content-text").text().trim();
    return content;
  } catch (error) {
    console.error("Error scraping Wikipedia:", error);
    throw error;
  }
}

// Generate response using Gemini
async function generateResponse(question, context) {
  try {
    const prompt = `You are a legal expert specializing in Bhutan law. Based on the following legal documents and information about Bhutan law, please answer the user's question accurately and comprehensively.

CONTEXT:
${context}

USER QUESTION: ${question}

Please provide a detailed answer based on the legal documents provided. If the question cannot be answered from the available documents, please state that clearly. Always cite relevant sections or provisions when possible.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating response:", error);
    throw error;
  }
}

// Routes

// Serve the main HTML page
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bhutan Law Chatbot</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f5f5f5;
            }
            .container {
                background: white;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            h1 {
                color: #d4af37;
                text-align: center;
                margin-bottom: 30px;
            }
            .setup-section, .chat-section {
                margin-bottom: 30px;
                padding: 20px;
                border: 1px solid #ddd;
                border-radius: 5px;
            }
            .setup-section {
                background-color: #f9f9f9;
            }
            .form-group {
                margin-bottom: 15px;
            }
            label {
                display: block;
                margin-bottom: 5px;
                font-weight: bold;
            }
            input, textarea, button {
                width: 100%;
                padding: 10px;
                border: 1px solid #ddd;
                border-radius: 4px;
                font-size: 14px;
            }
            button {
                background-color: #d4af37;
                color: white;
                border: none;
                cursor: pointer;
                margin-top: 10px;
            }
            button:hover {
                background-color: #b8941f;
            }
            .status {
                padding: 10px;
                border-radius: 4px;
                margin-top: 10px;
            }
            .success {
                background-color: #d4edda;
                color: #155724;
                border: 1px solid #c3e6cb;
            }
            .error {
                background-color: #f8d7da;
                color: #721c24;
                border: 1px solid #f5c6cb;
            }
            .chat-messages {
                height: 400px;
                overflow-y: auto;
                border: 1px solid #ddd;
                padding: 15px;
                background-color: #fafafa;
                margin-bottom: 10px;
            }
            .message {
                margin-bottom: 15px;
                padding: 10px;
                border-radius: 5px;
            }
            .user-message {
                background-color: #e3f2fd;
                margin-left: 20px;
            }
            .bot-message {
                background-color: #f3e5f5;
                margin-right: 20px;
            }
            .disabled {
                opacity: 0.6;
                pointer-events: none;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🏛️ Bhutan Law Chatbot</h1>
            
            <div class="setup-section">
                <h3>Setup</h3>
                <div class="form-group">
                    <label for="apiKey">Gemini API Key:</label>
                    <input type="password" id="apiKey" placeholder="Enter your Gemini API key">
                    <button onclick="initializeAPI()">Initialize API</button>
                    <div id="apiStatus"></div>
                </div>
                
                <div class="form-group">
                    <label for="pdfFile">Upload Bhutan Penal Code PDF:</label>
                    <input type="file" id="pdfFile" accept=".pdf">
                    <button onclick="uploadPDF()">Upload PDF</button>
                    <div id="pdfStatus"></div>
                </div>
                
                <div class="form-group">
                    <button onclick="loadWikipedia()">Load Wikipedia Content</button>
                    <div id="wikiStatus"></div>
                </div>
            </div>
            
            <div class="chat-section" id="chatSection">
                <h3>Ask about Bhutan Law</h3>
                <div class="chat-messages" id="chatMessages">
                    <div class="message bot-message">
                        Welcome! Please complete the setup above, then ask me anything about Bhutan law.
                    </div>
                </div>
                <div class="form-group">
                    <textarea id="questionInput" placeholder="Ask your question about Bhutan law..." rows="3"></textarea>
                    <button onclick="askQuestion()" id="askButton" class="disabled">Ask Question</button>
                </div>
            </div>
        </div>

        <script>
            let isSetupComplete = false;
            
            async function initializeAPI() {
                const apiKey = document.getElementById('apiKey').value;
                const statusDiv = document.getElementById('apiStatus');
                
                if (!apiKey) {
                    statusDiv.innerHTML = '<div class="status error">Please enter an API key</div>';
                    return;
                }
                
                try {
                    const response = await fetch('/initialize-api', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ apiKey })
                    });
                    
                    const result = await response.json();
                    if (result.success) {
                        statusDiv.innerHTML = '<div class="status success">API initialized successfully</div>';
                        checkSetupComplete();
                    } else {
                        statusDiv.innerHTML = '<div class="status error">Failed to initialize API</div>';
                    }
                } catch (error) {
                    statusDiv.innerHTML = '<div class="status error">Error initializing API</div>';
                }
            }
            
            async function uploadPDF() {
                const fileInput = document.getElementById('pdfFile');
                const statusDiv = document.getElementById('pdfStatus');
                
                if (!fileInput.files[0]) {
                    statusDiv.innerHTML = '<div class="status error">Please select a PDF file</div>';
                    return;
                }
                
                const formData = new FormData();
                formData.append('pdf', fileInput.files[0]);
                
                try {
                    statusDiv.innerHTML = '<div class="status">Uploading and processing PDF...</div>';
                    const response = await fetch('/upload-pdf', {
                        method: 'POST',
                        body: formData
                    });
                    
                    const result = await response.json();
                    if (result.success) {
                        statusDiv.innerHTML = '<div class="status success">PDF processed successfully</div>';
                        checkSetupComplete();
                    } else {
                        statusDiv.innerHTML = '<div class="status error">Failed to process PDF</div>';
                    }
                } catch (error) {
                    statusDiv.innerHTML = '<div class="status error">Error uploading PDF</div>';
                }
            }
            
            async function loadWikipedia() {
                const statusDiv = document.getElementById('wikiStatus');
                
                try {
                    statusDiv.innerHTML = '<div class="status">Loading Wikipedia content...</div>';
                    const response = await fetch('/load-wikipedia', { method: 'POST' });
                    
                    const result = await response.json();
                    if (result.success) {
                        statusDiv.innerHTML = '<div class="status success">Wikipedia content loaded successfully</div>';
                        checkSetupComplete();
                    } else {
                        statusDiv.innerHTML = '<div class="status error">Failed to load Wikipedia content</div>';
                    }
                } catch (error) {
                    statusDiv.innerHTML = '<div class="status error">Error loading Wikipedia content</div>';
                }
            }
            
            function checkSetupComplete() {
                // Check if all components are ready
                fetch('/status')
                    .then(response => response.json())
                    .then(result => {
                        if (result.ready) {
                            isSetupComplete = true;
                            document.getElementById('askButton').classList.remove('disabled');
                        }
                    });
            }
            
            async function askQuestion() {
                if (!isSetupComplete) return;
                
                const question = document.getElementById('questionInput').value.trim();
                if (!question) return;
                
                const messagesDiv = document.getElementById('chatMessages');
                
                // Add user message
                messagesDiv.innerHTML += '<div class="message user-message"><strong>You:</strong> ' + question + '</div>';
                
                // Add loading message
                messagesDiv.innerHTML += '<div class="message bot-message" id="loading"><strong>Bot:</strong> Thinking...</div>';
                messagesDiv.scrollTop = messagesDiv.scrollHeight;
                
                try {
                    const response = await fetch('/ask', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ question })
                    });
                    
                    const result = await response.json();
                    
                    // Remove loading message
                    document.getElementById('loading').remove();
                    
                    // Add bot response
                    messagesDiv.innerHTML += '<div class="message bot-message"><strong>Bot:</strong> ' + result.answer.replace(/\\n/g, '<br>') + '</div>';
                    messagesDiv.scrollTop = messagesDiv.scrollHeight;
                    
                    // Clear input
                    document.getElementById('questionInput').value = '';
                    
                } catch (error) {
                    document.getElementById('loading').remove();
                    messagesDiv.innerHTML += '<div class="message bot-message"><strong>Bot:</strong> Sorry, I encountered an error processing your question.</div>';
                }
            }
            
            // Allow Enter key to submit question
            document.getElementById('questionInput').addEventListener('keypress', function(e) {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    askQuestion();
                }
            });
        </script>
    </body>
    </html>
  `);
});

// Initialize Gemini API
app.post("/initialize-api", (req, res) => {
  const { apiKey } = req.body;
  const success = initializeGemini(apiKey);
  res.json({ success });
});

// Upload and process PDF
app.post("/upload-pdf", upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, error: "No file uploaded" });
    }

    const pdfText = await extractPDFText(req.file.path);
    bhutanLawData.penalCode = pdfText;
    bhutanLawData.combinedContext =
      bhutanLawData.penalCode + "\\n\\n" + bhutanLawData.wikiContent;

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Load Wikipedia content
app.post("/load-wikipedia", async (req, res) => {
  try {
    const wikiContent = await scrapeWikipediaContent(
      "https://en.wikipedia.org/wiki/Law_of_Bhutan"
    );
    bhutanLawData.wikiContent = wikiContent;
    bhutanLawData.combinedContext =
      bhutanLawData.penalCode + "\\n\\n" + bhutanLawData.wikiContent;

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Check system status
app.get("/status", (req, res) => {
  const ready = model && bhutanLawData.combinedContext.length > 0;
  res.json({ ready });
});

// Handle questions
app.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;

    if (!model) {
      return res.status(400).json({ error: "Gemini API not initialized" });
    }

    if (!bhutanLawData.combinedContext) {
      return res.status(400).json({ error: "Legal documents not loaded" });
    }

    const answer = await generateResponse(
      question,
      bhutanLawData.combinedContext
    );
    res.json({ answer });
  } catch (error) {
    console.error("Error processing question:", error);
    res.status(500).json({ error: "Failed to process question" });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ success: false, error: "File too large" });
    }
  }
  res.status(500).json({ success: false, error: error.message });
});

app.listen(port, () => {
  console.log(`Bhutan Law Chatbot server running at http://localhost:${port}`);
  console.log(
    "Make sure to install dependencies: npm install express multer pdf-parse axios cheerio @google/generative-ai"
  );
});

module.exports = app;
