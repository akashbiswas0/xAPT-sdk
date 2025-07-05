#!/bin/bash

# xAPT SDK Build Script
# Builds all packages in the monorepo

set -e

echo "🏗️  Building xAPT SDK..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
npm run clean

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Build all packages
echo "🔨 Building packages..."
npm run build

# Run tests
echo "🧪 Running tests..."
npm run test

# Run linting
echo "🔍 Running linting..."
npm run lint

echo "✅ Build completed successfully!"
echo ""
echo "📦 Built packages:"
echo "  - @xapt/common"
echo "  - @xapt/client" 
echo "  - @xapt/server"
echo ""
echo "📁 Build outputs:"
echo "  - packages/common/dist/"
echo "  - packages/client/dist/"
echo "  - packages/server/dist/" 