#!/bin/bash

# Setup script for Bhutan Legal RAG System
# This script sets up everything you need

echo "🇧🇹 Bhutan Legal RAG System Setup"
echo "=================================="

# Check if we're in a virtual environment
if [[ "$VIRTUAL_ENV" != "" ]]; then
    echo "✅ Virtual environment detected: $VIRTUAL_ENV"
else
    echo "⚠️  No virtual environment detected"
    echo "Creating virtual environment..."
    python3 -m venv venv
    echo "🔧 Please run: source venv/bin/activate"
    echo "Then run this script again"
    exit 1
fi

# Install required packages
echo ""
echo "📦 Installing required packages..."
pip install --upgrade pip

# Core packages
pip install flask flask-cors
pip install torch torchvision torchaudio
pip install transformers sentence-transformers
pip install chromadb langchain
pip install requests PyPDF2 pathlib tqdm

# Optional: Google AI for Gemini
echo ""
echo "🤖 Installing optional AI packages..."
pip install google-generativeai

echo ""
echo "✅ Package installation complete!"

# Create project structure
echo ""
echo "📁 Creating project structure..."

# Create directories
mkdir -p bhutan_legal_data/documents
mkdir -p bhutan_legal_data/cache

echo "✅ Project structure created!"

# Check if files exist
echo ""
echo "📋 Checking required files..."

if [ ! -f "persistent_bhutan_rag.py" ]; then
    echo "❌ persistent_bhutan_rag.py not found!"
    echo "Please copy the persistent RAG system code to this file"
else
    echo "✅ persistent_bhutan_rag.py found"
fi

if [ ! -f "app.py" ]; then
    echo "❌ app.py not found!"
    echo "Please copy the Flask API code to this file"
else
    echo "✅ app.py found"
fi

if [ ! -f "frontend.html" ]; then
    echo "❌ frontend.html not found!"
    echo "Please copy the HTML frontend code to this file"
else
    echo "✅ frontend.html found"
fi

echo ""
echo "🔑 Optional: Set up Gemini AI for better responses"
echo "1. Get API key from: https://makersuite.google.com/app/apikey"
echo "2. Set environment variable:"
echo "   export GEMINI_API_KEY='your_api_key_here'"
echo ""

echo "🚀 Setup complete! To run the system:"
echo ""
echo "1. Make sure all files are in place:"
echo "   - persistent_bhutan_rag.py"
echo "   - app.py (Flask API)"
echo "   - frontend.html"
echo ""
echo "2. Run the Flask app:"
echo "   python app.py"
echo ""
echo "3. Open browser to: http://localhost:5000"
echo ""
echo "📝 The system will:"
echo "   - Download legal documents from Bhutan"
echo "   - Process them with AI (cached for speed)"
echo "   - Provide a web interface for legal Q&A"
echo ""
echo "✨ Enjoy your sovereign Bhutan Legal AI system!"