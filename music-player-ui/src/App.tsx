import React, { useState, useEffect } from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  Box,
  Typography,
  Paper,
  Grid,
} from '@mui/material';
import { purple, pink } from '@mui/material/colors';

import PlayerControls from './components/PlayerControls';
import Playlist from './components/Playlist';
import FileUpload from './components/FileUpload';
import URLDownload from './components/URLDownload';
import VolumeControl from './components/VolumeControl';
import { MusicPlayerAPI, PlayerStatus, PlaylistResponse } from './api/client';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: purple[500],
    },
    secondary: {
      main: pink[500],
    },
    background: {
      default: '#0a0a0a',
      paper: '#1a1a1a',
    },
  },
  typography: {
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
  },
});

function App() {
  const [playerStatus, setPlayerStatus] = useState<PlayerStatus | null>(null);
  const [playlist, setPlaylist] = useState<PlaylistResponse>({ tracks: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlayerStatus = async () => {
    try {
      const status = await MusicPlayerAPI.getStatus();
      setPlayerStatus(status);
    } catch (err) {
      console.error('Failed to fetch player status:', err);
      setError('Failed to connect to music player API');
    }
  };

  const fetchPlaylist = async () => {
    try {
      const playlistData = await MusicPlayerAPI.getPlaylist();
      setPlaylist(playlistData);
    } catch (err) {
      console.error('Failed to fetch playlist:', err);
    }
  };

  const refreshData = async () => {
    await Promise.all([fetchPlayerStatus(), fetchPlaylist()]);
    setLoading(false);
  };

  useEffect(() => {
    refreshData();
    
    // Poll for updates every 2 seconds
    const interval = setInterval(() => {
      fetchPlayerStatus();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handlePlaylistUpdate = () => {
    fetchPlaylist();
  };

  const handlePlayerAction = async (action: () => Promise<void>) => {
    try {
      await action();
      // Wait a bit for the action to take effect, then refresh
      setTimeout(fetchPlayerStatus, 200);
    } catch (err) {
      console.error('Player action failed:', err);
      setError('Player action failed');
    }
  };

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Typography variant="h4" align="center">
            Cargando reproductor de música...
          </Typography>
        </Container>
      </ThemeProvider>
    );
  }

  if (error) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h5" color="error" gutterBottom>
              Error de conexión
            </Typography>
            <Typography variant="body1" gutterBottom>
              {error}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Asegúrate de que el servidor de la API esté ejecutándose en http://localhost:8000
            </Typography>
          </Paper>
        </Container>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom
            sx={{ 
              background: 'linear-gradient(45deg, #9c27b0 30%, #e91e63 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            🎵 JTRecords Music Player
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Tu reproductor de música moderno y elegante
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Player Controls Section */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Controles de Reproducción
              </Typography>
              <PlayerControls 
                status={playerStatus} 
                onAction={handlePlayerAction}
              />
            </Paper>

            {/* Playlist Section */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Lista de Reproducción
              </Typography>
              <Playlist 
                playlist={playlist}
                currentTrack={playerStatus?.current_track}
                onPlayTrack={(index) => handlePlayerAction(() => MusicPlayerAPI.play(index))}
                onRemoveTrack={(trackId) => {
                  handlePlayerAction(() => MusicPlayerAPI.removeTrack(trackId));
                  handlePlaylistUpdate();
                }}
                onClearPlaylist={() => {
                  handlePlayerAction(() => MusicPlayerAPI.clearPlaylist());
                  handlePlaylistUpdate();
                }}
              />
            </Paper>
          </Grid>

          {/* Controls Sidebar */}
          <Grid item xs={12} md={4}>
            {/* Volume Control */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Volumen
              </Typography>
              <VolumeControl 
                volume={playerStatus?.volume || 80}
                onVolumeChange={(volume) => handlePlayerAction(() => MusicPlayerAPI.setVolume(volume))}
              />
            </Paper>

            {/* File Upload */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Subir Archivos
              </Typography>
              <FileUpload onUploadComplete={handlePlaylistUpdate} />
            </Paper>

            {/* URL Download */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Descargar desde URL
              </Typography>
              <URLDownload onDownloadComplete={handlePlaylistUpdate} />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}

export default App;
