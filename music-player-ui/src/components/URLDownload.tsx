import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Stack,
  Chip,
  Paper,
} from '@mui/material';
import {
  Download,
  Link as LinkIcon,
  YouTube,
  CheckCircle,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { MusicPlayerAPI } from '../api/client';

interface URLDownloadProps {
  onDownloadComplete: () => void;
}

const URLDownload: React.FC<URLDownloadProps> = ({ onDownloadComplete }) => {
  const [url, setUrl] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  const supportedPlatforms = [
    { name: 'YouTube', icon: <YouTube />, domains: ['youtube.com', 'youtu.be'] },
    { name: 'SoundCloud', icon: <LinkIcon />, domains: ['soundcloud.com'] },
    { name: 'Otros', icon: <LinkIcon />, domains: ['*'] },
  ];

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const getPlatformInfo = (url: string) => {
    if (!isValidUrl(url)) return null;
    
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname.toLowerCase();
      
      return supportedPlatforms.find(platform => 
        platform.domains.some(domain => 
          domain === '*' || hostname.includes(domain)
        )
      ) || supportedPlatforms[supportedPlatforms.length - 1];
    } catch {
      return null;
    }
  };

  const handleDownload = async () => {
    if (!url.trim()) {
      setMessage({
        type: 'error',
        text: 'Por favor, ingresa una URL válida'
      });
      return;
    }

    if (!isValidUrl(url)) {
      setMessage({
        type: 'error',
        text: 'La URL ingresada no es válida'
      });
      return;
    }

    setDownloading(true);
    setMessage({
      type: 'info',
      text: 'Iniciando descarga... Esto puede tomar unos minutos.'
    });

    try {
      await MusicPlayerAPI.downloadFromUrl(url);
      
      setMessage({
        type: 'success',
        text: 'Descarga completada exitosamente'
      });
      
      setUrl('');
      onDownloadComplete();
      
    } catch (error) {
      console.error('Download failed:', error);
      setMessage({
        type: 'error',
        text: 'Error al descargar el audio. Verifica la URL e inténtalo de nuevo.'
      });
    } finally {
      setDownloading(false);
    }
  };

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = event.target.value;
    setUrl(newUrl);
    
    // Clear previous messages when URL changes
    if (message && message.type === 'error') {
      setMessage(null);
    }
  };

  const platformInfo = getPlatformInfo(url);

  return (
    <Box>
      {/* URL Input */}
      <TextField
        fullWidth
        label="URL del audio"
        placeholder="https://www.youtube.com/watch?v=..."
        value={url}
        onChange={handleUrlChange}
        disabled={downloading}
        variant="outlined"
        InputProps={{
          startAdornment: <LinkIcon sx={{ mr: 1, color: 'text.secondary' }} />,
        }}
        sx={{ mb: 2 }}
      />

      {/* Platform Detection */}
      {url && platformInfo && (
        <Paper sx={{ p: 2, mb: 2, bgcolor: 'rgba(156, 39, 176, 0.1)' }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            {platformInfo.icon}
            <Typography variant="body2">
              Plataforma detectada: <strong>{platformInfo.name}</strong>
            </Typography>
          </Stack>
          
          {isValidUrl(url) && (
            <Typography variant="caption" color="success.main" sx={{ mt: 1, display: 'block' }}>
              ✓ URL válida
            </Typography>
          )}
        </Paper>
      )}

      {/* Download Button */}
      <Button
        fullWidth
        variant="contained"
        startIcon={downloading ? <CircularProgress size={20} /> : <Download />}
        onClick={handleDownload}
        disabled={downloading || !url.trim()}
        sx={{
          py: 1.5,
          mb: 2,
          background: downloading 
            ? 'rgba(156, 39, 176, 0.5)' 
            : 'linear-gradient(45deg, #9c27b0 30%, #e91e63 90%)',
        }}
      >
        {downloading ? 'Descargando...' : 'Descargar Audio'}
      </Button>

      {/* Supported Platforms */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="caption" color="text.secondary" gutterBottom sx={{ display: 'block' }}>
          Plataformas soportadas:
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {supportedPlatforms.slice(0, -1).map((platform) => (
            <Chip
              key={platform.name}
              icon={platform.icon}
              label={platform.name}
              size="small"
              variant="outlined"
            />
          ))}
        </Stack>
      </Box>

      {/* Messages */}
      {message && (
        <Alert 
          severity={message.type} 
          sx={{ mt: 2 }}
          icon={
            message.type === 'success' ? <CheckCircle /> :
            message.type === 'error' ? <ErrorIcon /> :
            <CircularProgress size={20} />
          }
        >
          {message.text}
        </Alert>
      )}

      {/* Instructions */}
      <Paper sx={{ mt: 2, p: 2, bgcolor: 'rgba(255, 255, 255, 0.02)' }}>
        <Typography variant="caption" color="text.secondary">
          <strong>Instrucciones:</strong>
          <br />
          1. Copia la URL del video o audio que deseas descargar
          <br />
          2. Pega la URL en el campo de arriba
          <br />
          3. Haz clic en "Descargar Audio"
          <br />
          4. El archivo se añadirá automáticamente a tu lista de reproducción
        </Typography>
      </Paper>
    </Box>
  );
};

export default URLDownload;