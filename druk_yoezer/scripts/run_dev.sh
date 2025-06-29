#!/bin/bash

# Development runner for GovBot Bhutan

echo "🇧🇹 Starting GovBot Bhutan in development mode..."

# Check if Python dependencies are installed
if ! python -c "import fastapi, streamlit, langchain" 2>/dev/null; then
    echo "📦 Installing dependencies..."
    pip install -r requirements.txt
fi

# Start backend in background
echo "🚀 Starting backend server..."
cd backend
python main.py &
BACKEND_PID=$!

# Wait for backend to start
echo "⏳ Waiting for backend to initialize..."
sleep 10

# Start frontend
echo "🎨 Starting frontend..."
cd ../frontend
streamlit run streamlit_app.py &
FRONTEND_PID=$!

echo "✅ GovBot Bhutan is running!"
echo "📱 Frontend: http://localhost:8501"
echo "🔧 Backend API: http://localhost:8000"
echo "📚 API Docs: http://localhost:8000/api/docs"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for interrupt
trap "echo '🛑 Stopping services...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
