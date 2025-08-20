#!/bin/bash

echo "🎵 Iniciando JTRecords Music Player Backend..."
echo "=========================================="

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 no está instalado. Por favor, instala Python 3.8+"
    exit 1
fi

# Check if pip is installed
if ! command -v pip &> /dev/null && ! command -v pip3 &> /dev/null; then
    echo "❌ pip no está instalado. Por favor, instala pip"
    exit 1
fi

# Install requirements if they don't exist
echo "📦 Instalando dependencias Python..."
if command -v pip3 &> /dev/null; then
    pip3 install -r requirements.txt
else
    pip install -r requirements.txt
fi

# Create necessary directories
mkdir -p uploads downloads

echo "🚀 Iniciando servidor API en http://localhost:8000"
echo "   Presiona Ctrl+C para detener el servidor"
echo ""

# Start the API server
python3 api_server.py