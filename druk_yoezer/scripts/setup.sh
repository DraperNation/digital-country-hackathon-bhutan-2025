#!/bin/bash

# GovBot Bhutan Setup Script
# E-Bhutan Hackathon 2024

set -e

echo "🇧🇹 Setting up GovBot Bhutan..."

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p data/chroma_db
mkdir -p logs
mkdir -p ssl

# Set permissions
chmod 755 data
chmod 755 logs

# Install Python dependencies
echo "📦 Installing Python dependencies..."
pip install -r requirements.txt

# Initialize the database
echo "🗄️ Initializing vector database..."
python -c "
import asyncio
from backend.govbot.rag_system import RAGSystem

async def init_db():
    rag = RAGSystem()
    await rag.initialize()
    print('✅ Database initialized successfully')

asyncio.run(init_db())
"

# Run tests
echo "🧪 Running tests..."
python -m pytest tests/ -v || echo "⚠️ Some tests failed, but setup continues..."

# Build Docker images
echo "🐳 Building Docker images..."
docker-compose build

echo "✅ Setup complete!"
echo ""
echo "🚀 To start GovBot Bhutan:"
echo "   Development: python backend/main.py & streamlit run frontend/streamlit_app.py"
echo "   Production:  docker-compose up -d"
echo ""
echo "📱 Access points:"
echo "   Frontend: http://localhost:8501"
echo "   Backend API: http://localhost:8000"
echo "   API Docs: http://localhost:8000/api/docs"
echo ""
echo "🌸 May this serve the greater good and contribute to Gross National Happiness! 🇧🇹"
