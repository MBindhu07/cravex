#!/usr/bin/env bash
# ==============================================================================
# CraveX - Next-Generation Food Ordering & Restaurant Management Platform
# One-Command Unified Launcher (Starts Backend: 5001 + Frontend: 5173)
# ==============================================================================

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

echo "================================================================="
echo "  🚀 Starting CraveX Next-Gen Food Ordering Platform...         "
echo "================================================================="

# Trap Ctrl+C (SIGINT) and SIGTERM to kill background children cleanly
cleanup() {
  echo ""
  echo "🛑 Shutting down CraveX backend and frontend..."
  kill $(jobs -p) 2>/dev/null
  exit 0
}
trap cleanup SIGINT SIGTERM EXIT

# 1. Start CraveX Backend Server (Port 5001)
echo "📡 [1/2] Starting Backend Server (Port 5001)..."
cd "$PROJECT_DIR/server"
node src/server.js &
BACKEND_PID=$!

# Wait 1 second for backend socket to initialize
sleep 1

# 2. Start CraveX Frontend Client (Port 5173)
echo "💻 [2/2] Starting Frontend Vite App (Port 5173)..."
cd "$PROJECT_DIR/client"
npm run dev &
FRONTEND_PID=$!

echo ""
echo "================================================================="
echo "  🎉 CraveX Platform is running!"
echo "  🌐 Customer App:          http://localhost:5173"
echo "  🏬 Restaurant Dashboard:  http://localhost:5173/restaurant/dashboard"
echo "  🛵 Delivery Dashboard:    http://localhost:5173/delivery/dashboard"
echo "  👑 Super Admin:           http://localhost:5173/admin/overview"
echo "  📡 Backend API Engine:    http://localhost:5001/api"
echo "================================================================="
echo "  🔑 Demo Credentials (or click 'Role: DEMO' in the top navbar):"
echo "     Customer:   customer@cravex.com / password123"
echo "     Restaurant: owner@cravex.com    / password123"
echo "     Delivery:   delivery@cravex.com / password123"
echo "     Admin:      admin@cravex.com    / password123"
echo "================================================================="
echo "  Press Ctrl+C to stop all servers."
echo ""

# Wait for both child processes
wait
