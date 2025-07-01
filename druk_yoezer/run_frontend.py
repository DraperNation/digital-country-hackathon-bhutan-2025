"""
Frontend runner script for development.
Usage: python nameoffile.py
"""

import os
import subprocess
import sys

def run_streamlit_app():
    # Get absolute path to the frontend directory
    base_dir = os.path.dirname(os.path.abspath(__file__))
    frontend_app_path = os.path.join(base_dir, "frontend", "streamlit_app.py")

    # Ensure the frontend app exists
    if not os.path.isfile(frontend_app_path):
        print(f"Error: {frontend_app_path} not found.")
        sys.exit(1)

    # Run the Streamlit app
    subprocess.run([
        sys.executable, "-m", "streamlit", "run", frontend_app_path,
        "--server.address", "0.0.0.0",
        "--server.port", "8501"
    ])

if __name__ == "__main__":
    run_streamlit_app()
