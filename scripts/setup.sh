#!/bin/bash

# Development setup script
set -e

echo "🔧 Setting up development environment..."

# Check if Bun is installed
if ! command -v bun &> /dev/null; then
    echo "❌ Bun not found. Please install it first:"
    echo "curl -fsSL https://bun.sh/install | bash"
    exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found. Please install it first:"
    echo "https://docs.docker.com/get-docker/"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
bun install

# Copy environment file
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp env.example .env
    echo "⚠️  Please edit .env file with your database and Redis URLs"
fi

# Start services
echo "🐳 Starting PostgreSQL and Redis..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Run database migrations
echo "🗄️  Running database migrations..."
bun run db:migrate

# Seed the database
echo "🌱 Seeding database..."
bun run db:seed

echo "✅ Setup complete!"
echo ""
echo "🚀 To start development servers:"
echo "   bun run dev"
echo ""
echo "📊 Services:"
echo "   - API: http://localhost:4000/graphql"
echo "   - Frontend: http://localhost:5173"
echo "   - PostgreSQL: localhost:5432"
echo "   - Redis: localhost:6379"


