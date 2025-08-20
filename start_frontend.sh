#!/bin/bash

echo "🎵 Iniciando JTRecords Music Player Frontend..."
echo "============================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor, instala Node.js 16+"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm no está instalado. Por favor, instala npm"
    exit 1
fi

# Navigate to React app directory
cd music-player-ui

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias React..."
    npm install
fi

echo "🚀 Iniciando aplicación React en http://localhost:3000"
echo "   Presiona Ctrl+C para detener la aplicación"
echo "   Asegúrate de que el backend esté ejecutándose en http://localhost:8000"
echo ""

# Start the React app
npm start