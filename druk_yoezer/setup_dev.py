"""
Development setup script for Windows
"""

import os
import sys
import subprocess
import asyncio

def install_requirements():
    """Install Python requirements"""
    print("📦 Installing Python dependencies...")
    subprocess.run([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])

def create_directories():
    """Create necessary directories"""
    print("📁 Creating directories...")
    os.makedirs("data/chroma_db", exist_ok=True)
    os.makedirs("logs", exist_ok=True)
    print("✅ Directories created")

async def initialize_database():
    """Initialize the RAG system database"""
    print("🗄️ Initializing vector database...")
    
    # Add backend to path
    backend_dir = os.path.join(os.path.dirname(__file__), 'backend')
    sys.path.insert(0, backend_dir)
    
    try:
        from govbot.rag_system import RAGSystem
        
        rag = RAGSystem()
        await rag.initialize()
        print("✅ Database initialized successfully")
    except Exception as e:
        print(f"⚠️ Database initialization failed: {e}")
        print("This is normal for first-time setup. The database will be created when you start the backend.")

def main():
    """Main setup function"""
    print("🇧🇹 Setting up GovBot Bhutan for development...")
    
    # Install requirements
    install_requirements()
    
    # Create directories
    create_directories()
    
    # Initialize database
    try:
        asyncio.run(initialize_database())
    except Exception as e:
        print(f"⚠️ Could not initialize database: {e}")
        print("The database will be initialized when you first start the backend.")
    
    print("\n✅ Setup complete!")
    print("\n🚀 To start GovBot Bhutan:")
    print("   Windows: run_dev.bat")
    print("   Manual:  python run_backend.py (in one terminal)")
    print("           python run_frontend.py (in another terminal)")
    print("\n📱 Access points:")
    print("   Frontend: http://localhost:8501")
    print("   Backend API: http://localhost:8000")
    print("   API Docs: http://localhost:8000/docs")
    print("\n🌸 May this serve the greater good and contribute to Gross National Happiness! 🇧🇹")

if __name__ == "__main__":
    main()
