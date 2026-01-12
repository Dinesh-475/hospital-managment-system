#!/bin/bash

echo "🏥 DocVista Hospital Management System - Setup Script"
echo "======================================================"
echo ""

# Check if Docker is available
if command -v docker &> /dev/null; then
    echo "✅ Docker found"
    
    # Start PostgreSQL and Redis
    echo "📦 Starting PostgreSQL and Redis containers..."
    docker compose up -d
    
    # Wait for services to be ready
    echo "⏳ Waiting for services to be ready..."
    sleep 5
    
    # Run database migrations
    echo "🗄️  Running database migrations..."
    npx prisma db push --accept-data-loss
    
    echo ""
    echo "✅ Setup complete!"
    echo ""
    echo "📊 Services:"
    echo "   - PostgreSQL: localhost:5432"
    echo "   - Redis: localhost:6379"
    echo ""
else
    echo "⚠️  Docker not found"
    echo ""
    echo "Please install Docker or set up PostgreSQL and Redis manually:"
    echo ""
    echo "PostgreSQL:"
    echo "  - Create database: docvista"
    echo "  - Update DATABASE_URL in .env"
    echo ""
    echo "Redis (optional but recommended):"
    echo "  - Install Redis locally"
    echo "  - Update REDIS_URL in .env"
    echo ""
    echo "Then run: npx prisma db push --accept-data-loss"
    echo ""
fi

echo "🚀 Start the server with: npm run dev"

