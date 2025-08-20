#!/bin/bash

echo "🎵 JTRecords Music Player - Inicio Completo"
echo "=========================================="
echo ""

# Function to cleanup background processes
cleanup() {
    echo ""
    echo "🛑 Deteniendo servicios..."
    kill $(jobs -p) 2>/dev/null
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Check dependencies
echo "🔍 Verificando dependencias..."

if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 no está instalado"
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado"
    exit 1
fi

echo "✅ Dependencias verificadas"
echo ""

# Start backend in background
echo "🚀 Iniciando backend (API)..."
bash start_backend.sh &
BACKEND_PID=$!

# Wait a bit for backend to start
sleep 3

# Start frontend in background
echo "🚀 Iniciando frontend (React)..."
bash start_frontend.sh &
FRONTEND_PID=$!

echo ""
echo "🎉 ¡JTRecords Music Player está ejecutándose!"
echo ""
echo "📍 Servicios:"
echo "   • Backend API: http://localhost:8000"
echo "   • Frontend React: http://localhost:3000"
echo ""
echo "🌐 Abre tu navegador en http://localhost:3000 para usar la aplicación"
echo ""
echo "⚠️  Presiona Ctrl+C para detener todos los servicios"

# Wait for background processes
wait