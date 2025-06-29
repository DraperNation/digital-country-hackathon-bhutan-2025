#!/usr/bin/env python3
"""
🇧🇹 Bhutan E-Residency Agent Setup Script

This script helps set up the Bhutan E-Residency Agent system
for Digital Drukyul initiatives.
"""

import os
import sys
import subprocess
import shutil
from pathlib import Path

def print_banner():
    """Print the Bhutan E-Residency banner."""
    print("🇧🇹" + "=" * 60 + "🇧🇹")
    print("   BHUTAN E-RESIDENCY AGENT SETUP")
    print("   Digital Drukyul - Gross National Happiness through AI")
    print("🇧🇹" + "=" * 60 + "🇧🇹")
    print()

def check_python_version():
    """Check if Python version is compatible."""
    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 9):
        print("❌ Python 3.9+ is required. Current version:", sys.version)
        return False
    print(f"✅ Python {version.major}.{version.minor}.{version.micro} - Compatible")
    return True

def install_dependencies():
    """Install required dependencies."""
    print("\n📦 Installing Bhutan E-Residency Agent dependencies...")
    
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✅ Dependencies installed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install dependencies: {e}")
        return False

def install_playwright():
    """Install Playwright browsers."""
    print("\n🎭 Installing Playwright browsers for government website scraping...")
    
    try:
        subprocess.check_call([sys.executable, "-m", "playwright", "install"])
        print("✅ Playwright browsers installed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install Playwright browsers: {e}")
        return False

def setup_environment():
    """Set up environment configuration."""
    print("\n⚙️ Setting up environment configuration...")
    
    env_file = Path(".env")
    env_template = Path(".env.template")
    
    if env_file.exists():
        print("✅ .env file already exists")
        return True
    
    if env_template.exists():
        try:
            shutil.copy(env_template, env_file)
            print("✅ Created .env file from template")
            print("📝 Please edit .env file and add your API keys:")
            print("   - OPENAI_API_KEY (for government service analysis)")
            print("   - GOOGLE_API_KEY (for e-residency agent)")
            return True
        except Exception as e:
            print(f"❌ Failed to create .env file: {e}")
            return False
    else:
        print("⚠️  .env.template not found. Creating basic .env file...")
        with open(env_file, 'w') as f:
            f.write("# Bhutan E-Residency Agent Configuration\n")
            f.write("OPENAI_API_KEY=your_openai_api_key_here\n")
            f.write("GOOGLE_API_KEY=your_gemini_api_key_here\n")
        print("✅ Created basic .env file")
        return True

def verify_setup():
    """Verify the setup is working."""
    print("\n🔍 Verifying Bhutan E-Residency Agent setup...")
    
    try:
        # Test import
        import bhutan_eresidency_agent
        print("✅ Bhutan E-Residency Agent module imports successfully")
        
        # Check for API keys
        from dotenv import load_dotenv
        load_dotenv()
        
        openai_key = os.getenv("OPENAI_API_KEY")
        gemini_key = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")
        
        if openai_key and openai_key != "your_openai_api_key_here":
            print("✅ OpenAI API key configured")
        else:
            print("⚠️  OpenAI API key not configured (needed for government analysis)")
        
        if gemini_key and gemini_key != "your_gemini_api_key_here":
            print("✅ Gemini API key configured")
        else:
            print("⚠️  Gemini API key not configured (needed for e-residency agent)")
        
        return True
        
    except ImportError as e:
        print(f"❌ Import error: {e}")
        return False
    except Exception as e:
        print(f"❌ Setup verification failed: {e}")
        return False

def main():
    """Main setup function."""
    print_banner()
    
    # Check Python version
    if not check_python_version():
        print("\n❌ Setup failed. Please upgrade Python and try again.")
        return False
    
    # Install dependencies
    if not install_dependencies():
        print("\n❌ Setup failed. Please check your Python environment.")
        return False
    
    # Install Playwright
    if not install_playwright():
        print("\n⚠️  Playwright installation failed. You may need to install manually:")
        print("   python -m playwright install")
    
    # Set up environment
    if not setup_environment():
        print("\n❌ Environment setup failed.")
        return False
    
    # Verify setup
    if not verify_setup():
        print("\n❌ Setup verification failed.")
        return False
    
    # Success message
    print("\n🎉 Bhutan E-Residency Agent setup completed successfully!")
    print("\n📚 Next Steps:")
    print("1. Edit the .env file with your API keys")
    print("2. Run the demo: python bhutan_eresidency_demo.py")
    print("3. Start the MCP server: python bhutan_eresidency_agent.py")
    print("\n🇧🇹 Ready to support Digital Drukyul and e-residency services!")
    
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1) 