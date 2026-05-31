#!/bin/bash
set -e

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║     HairsUp — Setup Script               ║"
echo "║     Premium Hair Wig E-Commerce          ║"
echo "╚══════════════════════════════════════════╝"
echo ""

# Check prerequisites
command -v node >/dev/null 2>&1 || { echo "Node.js not found. Install from https://nodejs.org"; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "npm not found."; exit 1; }

echo "✅ Node $(node -v) detected"
echo ""

# ─── BACKEND ───────────────────────────────────────
echo "📦 Installing backend dependencies..."
cd "$(dirname "$0")/backend"
npm install

echo ""
echo "🔧 Generating Prisma client..."
npx prisma generate

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "⚠️  DATABASE SETUP"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "You need PostgreSQL running. Options:"
echo ""
echo "  Option A — Docker (recommended):"
echo "    docker run --name hairsup_db -e POSTGRES_USER=hairsup_user \\"
echo "      -e POSTGRES_PASSWORD=hairsup_pass -e POSTGRES_DB=hairsup_db \\"
echo "      -p 5432:5432 -d postgres:15-alpine"
echo ""
echo "  Option B — Local PostgreSQL:"
echo "    createdb hairsup_db"
echo "    Update DATABASE_URL in backend/.env"
echo ""
read -p "Press Enter once PostgreSQL is running to continue..."

echo ""
echo "🗄️  Running database migrations..."
npx prisma migrate dev --name init

echo ""
echo "🌱 Seeding database with sample data..."
npx ts-node prisma/seed.ts

# ─── FRONTEND ───────────────────────────────────────
echo ""
echo "📦 Installing frontend dependencies..."
cd "$(dirname "$0")/frontend"
npm install

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║  ✅  Setup Complete!                     ║"
echo "╚══════════════════════════════════════════╝"
echo ""
echo "To start the application:"
echo ""
echo "  Terminal 1 — Backend:"
echo "    cd backend && npm run dev"
echo "    → API running at http://localhost:5000"
echo ""
echo "  Terminal 2 — Frontend:"
echo "    cd frontend && npm run dev"
echo "    → App running at http://localhost:3000"
echo ""
echo "Admin credentials:"
echo "  Email:    admin@hairsup.com"
echo "  Password: Admin@123"
echo ""
