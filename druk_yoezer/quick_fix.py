"""
Quick fix script to resolve import issues
"""

import os
import sys

def main():
    print("🔧 Applying quick fixes for Windows environment...")
    
    # Create __init__.py files if they don't exist
    init_files = [
        "backend/__init__.py",
        "backend/govbot/__init__.py", 
        "backend/govbot/agents/__init__.py"
    ]
    
    for init_file in init_files:
        if not os.path.exists(init_file):
            with open(init_file, 'w') as f:
                f.write('# Package initialization\n')
            print(f"✅ Created {init_file}")
    
    # Create data directories
    os.makedirs("data/chroma_db", exist_ok=True)
    os.makedirs("logs", exist_ok=True)
    
    print("✅ Quick fixes applied!")
    print("\n🚀 Now you can run:")
    print("   python run_backend.py")
    print("   (in another terminal) python run_frontend.py")

if __name__ == "__main__":
    main()
