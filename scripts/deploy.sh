#!/bin/bash

# Deploy script for Fly.io
set -e

echo "🚀 Starting deployment to Fly.io..."

# Check if fly CLI is installed
if ! command -v fly &> /dev/null; then
    echo "❌ Fly CLI not found. Please install it first:"
    echo "curl -L https://fly.io/install.sh | sh"
    exit 1
fi

# Check if logged in
if ! fly auth whoami &> /dev/null; then
    echo "❌ Not logged in to Fly.io. Please run: fly auth login"
    exit 1
fi

# Build the application
echo "📦 Building application..."
bun run build

# Deploy to Fly.io
echo "🚀 Deploying to Fly.io..."
fly deploy

echo "✅ Deployment complete!"
echo "🌐 Your app should be available at: https://dealers-concierge-test.fly.dev"


