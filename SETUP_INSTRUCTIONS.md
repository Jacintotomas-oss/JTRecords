# 🎵 JTRecords Music Player - Instrucciones de Instalación

## 🎯 Resumen

Has transformado exitosamente tu reproductor de música Python en una moderna aplicación web con React. Ahora tienes:

- **Backend Python**: API REST con FastAPI
- **Frontend React**: Interfaz moderna con Material-UI
- **Funcionalidad completa**: Reproducción, playlist, subida de archivos, descarga desde URL

## 🚀 Instalación Rápida

### Opción 1: Inicio Automático (Recomendado)

```bash
# Ejecutar todo de una vez
./start_all.sh
```

### Opción 2: Inicio Manual

**Terminal 1 - Backend:**
```bash
./start_backend.sh
```

**Terminal 2 - Frontend:**
```bash
./start_frontend.sh
```

## 📋 Prerequisitos

### Sistema Operativo
- **Linux**: ✅ Completamente soportado
- **macOS**: ✅ Soportado
- **Windows**: ✅ Soportado (con WSL recomendado)

### Software Requerido

1. **Python 3.8+**
   ```bash
   python3 --version
   ```

2. **Node.js 16+**
   ```bash
   node --version
   npm --version
   ```

3. **VLC Media Player**
   ```bash
   # Ubuntu/Debian
   sudo apt install vlc
   
   # macOS
   brew install --cask vlc
   
   # Windows
   # Descargar desde https://www.videolan.org/vlc/
   ```

## 🔧 Instalación Manual Detallada

### 1. Backend Python

```bash
# Instalar dependencias
pip install -r requirements.txt

# Verificar instalación
python3 -c "import vlc, fastapi; print('✅ Dependencias instaladas')"

# Ejecutar servidor
python3 api_server.py
```

### 2. Frontend React

```bash
cd music-player-ui

# Instalar dependencias
npm install

# Verificar instalación
npm list --depth=0

# Ejecutar aplicación
npm start
```

## 🌐 Acceso a la Aplicación

Una vez que ambos servicios estén ejecutándose:

- **Frontend (Interfaz Principal)**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Documentación API**: http://localhost:8000/docs

## 🎮 Guía de Uso

### 1. Reproducción Básica
- Haz clic en **▶️** para reproducir
- Usa **⏸️** para pausar
- **⏹️** para detener
- **⏮️⏭️** para navegar entre canciones

### 2. Añadir Música

**Subir Archivos Locales:**
1. Haz clic en "Seleccionar Archivos de Audio"
2. Selecciona archivos MP3, WAV, FLAC, M4A
3. Haz clic en "Subir Archivos"

**Descargar desde Internet:**
1. Copia la URL de YouTube, SoundCloud, etc.
2. Pégala en el campo "URL del audio"
3. Haz clic en "Descargar Audio"

### 3. Gestionar Playlist
- **Reproducir canción**: Haz clic en cualquier canción
- **Eliminar canción**: Botón 🗑️ junto a cada canción
- **Limpiar lista**: Botón "Limpiar Lista"

### 4. Control de Volumen
- Arrastra el slider de volumen
- Usa los presets: 25%, 50%, 75%, 100%
- Haz clic en el icono de volumen para silenciar

## 🛠️ Solución de Problemas

### Error: "Failed to connect to music player API"
```bash
# Verificar que el backend esté ejecutándose
curl http://localhost:8000/status

# Si no responde, reiniciar backend
python3 api_server.py
```

### Error: VLC no encontrado
```bash
# Ubuntu/Debian
sudo apt update && sudo apt install vlc

# Verificar instalación
vlc --version
```

### Error: Puerto en uso
```bash
# Encontrar proceso usando puerto 8000
lsof -i :8000

# Terminar proceso
kill -9 <PID>
```

### Error: Dependencias de Node.js
```bash
cd music-player-ui
rm -rf node_modules package-lock.json
npm install
```

## 🔄 Actualizaciones

Para actualizar la aplicación:

```bash
# Actualizar dependencias Python
pip install -r requirements.txt --upgrade

# Actualizar dependencias React
cd music-player-ui
npm update
```

## 📁 Estructura de Archivos

```
/workspace/
├── 🐍 Backend Python
│   ├── api_server.py          # Servidor principal
│   ├── music_player.py        # Lógica del reproductor
│   ├── main.py               # App original (opcional)
│   └── requirements.txt       # Dependencias
│
├── ⚛️ Frontend React
│   └── music-player-ui/
│       ├── src/components/    # Componentes UI
│       ├── src/api/          # Cliente API
│       └── package.json      # Dependencias
│
├── 📁 Directorios de datos
│   ├── uploads/              # Archivos subidos
│   └── downloads/            # Archivos descargados
│
└── 🚀 Scripts de inicio
    ├── start_all.sh          # Inicia todo
    ├── start_backend.sh      # Solo backend
    └── start_frontend.sh     # Solo frontend
```

## 🎨 Personalización

### Cambiar Colores
Edita `music-player-ui/src/App.tsx`:
```typescript
const theme = createTheme({
  palette: {
    primary: { main: '#tu-color-primario' },
    secondary: { main: '#tu-color-secundario' },
  },
});
```

### Añadir Funcionalidades
1. Backend: Añade endpoints en `api_server.py`
2. Frontend: Crea componentes en `src/components/`

## 🆘 Soporte

Si encuentras problemas:

1. **Revisa los logs** en la terminal donde ejecutaste los servicios
2. **Verifica dependencias** con los comandos de verificación
3. **Reinicia servicios** usando los scripts de inicio
4. **Consulta la documentación** de la API en http://localhost:8000/docs

## 🎉 ¡Disfruta tu nuevo reproductor!

Tu reproductor de música Python ahora tiene una interfaz web moderna y profesional. ¡Comparte tu música favorita y disfruta de la experiencia!