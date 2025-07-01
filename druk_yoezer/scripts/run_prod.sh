#!/bin/bash

# Production runner for GovBot Bhutan

echo "🇧🇹 Starting GovBot Bhutan in production mode..."

# Check if Docker is available
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is required for production deployment"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is required for production deployment"
    exit 1
fi

# Build and start services
echo "🏗️ Building and starting services..."
docker-compose up -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be ready..."
sleep 30

# Check service health
echo "🔍 Checking service health..."
docker-compose ps

# Show access information
echo ""
echo "✅ GovBot Bhutan is running in production mode!"
echo "🌐 Access via: http://localhost"
echo "📱 Direct frontend: http://localhost:8501"
echo "🔧 Direct backend: http://localhost:8000"
echo ""
echo "📊 To monitor logs: docker-compose logs -f"
echo "🛑 To stop: docker-compose down"
echo ""
echo "🌸 Serving the Kingdom of Bhutan with Gross National Happiness! 🇧🇹"
