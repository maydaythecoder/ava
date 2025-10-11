#!/bin/bash
# Reset development environment when things go wrong

echo "🔄 Resetting Ava development environment..."
echo ""

# Navigate to project root
cd "$(dirname "$0")/.."

# Stop any running processes
echo "1️⃣  Stopping any running processes..."
pkill -f "next dev" 2>/dev/null || true

# Clean Next.js cache
echo "2️⃣  Cleaning Next.js cache..."
rm -rf apps/web/.next
rm -rf apps/web/node_modules/.cache

# Clean build artifacts
echo "3️⃣  Cleaning build artifacts..."
rm -rf packages/*/dist

# Remove npm lockfile if exists
echo "4️⃣  Removing npm lockfiles..."
rm -f apps/web/package-lock.json

echo ""
echo "✅ Reset complete!"
echo ""
echo "Now run: pnpm web"

