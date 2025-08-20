# 🎵 JTRecords Music Player - React Interface

Una moderna interfaz web React para tu reproductor de música Python, construida con Material-UI y TypeScript.

## ✨ Características

- **🎮 Controles de Reproducción**: Play, pausa, stop, siguiente, anterior
- **📋 Gestión de Playlist**: Lista de reproducción interactiva con drag & drop
- **🔊 Control de Volumen**: Slider de volumen con presets y indicador visual
- **📁 Subida de Archivos**: Drag & drop para archivos MP3, WAV, FLAC, M4A
- **🌐 Descarga desde URL**: Soporte para YouTube, SoundCloud y otras plataformas
- **🎨 Diseño Moderno**: Interfaz oscura con gradientes y animaciones
- **📱 Responsive**: Funciona perfectamente en desktop, tablet y móvil

## 🚀 Instalación y Configuración

### Prerequisitos

- Python 3.8+
- Node.js 16+
- VLC Media Player instalado en el sistema

### 1. Configurar el Backend (API Python)

```bash
# Instalar dependencias Python
pip install -r requirements.txt

# Ejecutar el servidor API
python api_server.py
```

El servidor API estará disponible en `http://localhost:8000`

### 2. Configurar el Frontend (React)

```bash
# Navegar al directorio de React
cd music-player-ui

# Instalar dependencias
npm install

# Ejecutar la aplicación React
npm start
```

La aplicación React estará disponible en `http://localhost:3000`

## 🛠️ Estructura del Proyecto

```
/workspace/
├── api_server.py              # Servidor FastAPI
├── requirements.txt           # Dependencias Python
├── main.py                   # Aplicación Python original (PySide6)
├── music-player-ui/          # Aplicación React
│   ├── src/
│   │   ├── components/       # Componentes React
│   │   │   ├── PlayerControls.tsx
│   │   │   ├── Playlist.tsx
│   │   │   ├── VolumeControl.tsx
│   │   │   ├── FileUpload.tsx
│   │   │   └── URLDownload.tsx
│   │   ├── api/             # Cliente API
│   │   │   └── client.ts
│   │   └── App.tsx          # Componente principal
│   └── package.json
├── uploads/                  # Archivos subidos
└── downloads/               # Archivos descargados
```

## 🎯 Uso de la Aplicación

### Controles Básicos
- **▶️ Play/Pausa**: Reproduce o pausa la canción actual
- **⏹️ Stop**: Detiene la reproducción
- **⏮️ Anterior**: Canción anterior
- **⏭️ Siguiente**: Canción siguiente

### Gestión de Música
1. **Subir Archivos**: Arrastra archivos o usa el botón "Seleccionar Archivos"
2. **Descargar desde URL**: Pega enlaces de YouTube, SoundCloud, etc.
3. **Gestionar Playlist**: Haz clic en canciones para reproducir, eliminar con el botón 🗑️

### Control de Volumen
- Usa el slider para ajustar el volumen
- Botones de preset: 25%, 50%, 75%, 100%
- Indicador visual de nivel de volumen
- Botón de mute/unmute

## 🔧 API Endpoints

### Reproducción
- `GET /status` - Estado del reproductor
- `POST /play` - Reproducir canción
- `POST /pause` - Pausar reproducción
- `POST /stop` - Detener reproducción
- `POST /next` - Siguiente canción
- `POST /previous` - Canción anterior

### Playlist
- `GET /playlist` - Obtener playlist
- `POST /upload` - Subir archivo
- `POST /download` - Descargar desde URL
- `DELETE /playlist` - Limpiar playlist
- `DELETE /track/{id}` - Eliminar canción

### Configuración
- `POST /volume` - Ajustar volumen

## 🎨 Personalización

### Temas y Colores
El tema se puede personalizar en `src/App.tsx`:

```typescript
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: purple[500] },
    secondary: { main: pink[500] },
  },
});
```

### Componentes
Cada componente está en su propio archivo y puede ser personalizado independientemente.

## 🐛 Solución de Problemas

### Error de conexión API
- Verifica que `api_server.py` esté ejecutándose en puerto 8000
- Comprueba que no haya bloqueos de CORS

### Archivos no se reproducen
- Asegúrate de que VLC esté instalado correctamente
- Verifica que los archivos de audio sean válidos

### Problemas de descarga
- Verifica tu conexión a internet
- Algunos videos pueden estar restringidos por región

## 📝 Notas de Desarrollo

- La aplicación usa Material-UI para componentes
- TypeScript para type safety
- Axios para llamadas HTTP
- Polling cada 2 segundos para actualizar el estado

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Añadir nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 🙏 Agradecimientos

- Material-UI por los componentes
- FastAPI por el framework backend
- VLC por el reproductor multimedia
- yt-dlp para descarga de audio