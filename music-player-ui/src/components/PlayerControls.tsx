import React from 'react';
import {
  Box,
  IconButton,
  Typography,
  LinearProgress,
  Card,
  CardContent,
  Stack,
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  Stop,
  SkipNext,
  SkipPrevious,
  MusicNote,
} from '@mui/icons-material';
import { PlayerStatus } from '../api/client';
import { MusicPlayerAPI } from '../api/client';

interface PlayerControlsProps {
  status: PlayerStatus | null;
  onAction: (action: () => Promise<void>) => void;
}

const PlayerControls: React.FC<PlayerControlsProps> = ({ status, onAction }) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = status?.duration ? (status.position / status.duration) * 100 : 0;

  return (
    <Box>
      {/* Current Track Display */}
      <Card sx={{ mb: 3, bgcolor: 'rgba(156, 39, 176, 0.1)' }}>
        <CardContent>
          <Stack direction="row" alignItems="center" spacing={2}>
            <MusicNote color="primary" sx={{ fontSize: 40 }} />
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Typography variant="h6" noWrap>
                {status?.current_track?.title || 'No hay canción seleccionada'}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {status?.current_track?.filename || 'Selecciona una canción para reproducir'}
              </Typography>
            </Box>
          </Stack>

          {/* Progress Bar */}
          {status?.current_track && (
            <Box sx={{ mt: 2 }}>
              <LinearProgress 
                variant="determinate" 
                value={progress} 
                sx={{ 
                  height: 6, 
                  borderRadius: 3,
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 3,
                    background: 'linear-gradient(45deg, #9c27b0 30%, #e91e63 90%)',
                  },
                }} 
              />
              <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  {formatTime(status.position)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatTime(status.duration)}
                </Typography>
              </Stack>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Control Buttons */}
      <Stack direction="row" justifyContent="center" spacing={2}>
        <IconButton
          size="large"
          onClick={() => onAction(() => MusicPlayerAPI.previous())}
          sx={{ 
            bgcolor: 'rgba(255, 255, 255, 0.1)',
            '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' },
          }}
        >
          <SkipPrevious fontSize="large" />
        </IconButton>

        <IconButton
          size="large"
          onClick={() => {
            if (status?.is_playing) {
              onAction(() => MusicPlayerAPI.pause());
            } else {
              onAction(() => MusicPlayerAPI.play());
            }
          }}
          sx={{ 
            bgcolor: 'primary.main',
            color: 'white',
            width: 64,
            height: 64,
            '&:hover': { bgcolor: 'primary.dark' },
          }}
        >
          {status?.is_playing ? (
            <Pause fontSize="large" />
          ) : (
            <PlayArrow fontSize="large" />
          )}
        </IconButton>

        <IconButton
          size="large"
          onClick={() => onAction(() => MusicPlayerAPI.stop())}
          sx={{ 
            bgcolor: 'rgba(255, 255, 255, 0.1)',
            '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' },
          }}
        >
          <Stop fontSize="large" />
        </IconButton>

        <IconButton
          size="large"
          onClick={() => onAction(() => MusicPlayerAPI.next())}
          sx={{ 
            bgcolor: 'rgba(255, 255, 255, 0.1)',
            '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' },
          }}
        >
          <SkipNext fontSize="large" />
        </IconButton>
      </Stack>

      {/* Status Display */}
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Estado: {
            status?.is_playing ? '▶️ Reproduciendo' :
            status?.is_paused ? '⏸️ Pausado' :
            '⏹️ Detenido'
          }
        </Typography>
      </Box>
    </Box>
  );
};

export default PlayerControls;