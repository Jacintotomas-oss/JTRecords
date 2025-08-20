import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
  Button,
  Divider,
  Chip,
} from '@mui/material';
import {
  MusicNote,
  Delete,
  PlayArrow,
  VolumeUp,
  Clear,
} from '@mui/icons-material';
import { PlaylistResponse, TrackInfo } from '../api/client';

interface PlaylistProps {
  playlist: PlaylistResponse;
  currentTrack?: TrackInfo;
  onPlayTrack: (index: number) => void;
  onRemoveTrack: (trackId: number) => void;
  onClearPlaylist: () => void;
}

const Playlist: React.FC<PlaylistProps> = ({
  playlist,
  currentTrack,
  onPlayTrack,
  onRemoveTrack,
  onClearPlaylist,
}) => {
  const formatDuration = (duration?: number): string => {
    if (!duration) return '--:--';
    const mins = Math.floor(duration / 60);
    const secs = Math.floor(duration % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (playlist.tracks.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <MusicNote sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          La lista de reproducción está vacía
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Sube archivos de música o descarga desde una URL para comenzar
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Playlist Header */}
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Chip 
            label={`${playlist.tracks.length} canción${playlist.tracks.length !== 1 ? 'es' : ''}`}
            color="primary"
            size="small"
          />
          {currentTrack && (
            <Chip 
              icon={<VolumeUp />}
              label="Reproduciendo"
              color="secondary"
              size="small"
            />
          )}
        </Box>
        
        <Button
          startIcon={<Clear />}
          onClick={onClearPlaylist}
          color="error"
          size="small"
          variant="outlined"
        >
          Limpiar Lista
        </Button>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Track List */}
      <List sx={{ maxHeight: 400, overflow: 'auto' }}>
        {playlist.tracks.map((track, index) => {
          const isCurrentTrack = currentTrack?.id === track.id;
          
          return (
            <ListItem
              key={track.id}
              disablePadding
              sx={{
                mb: 1,
                borderRadius: 2,
                bgcolor: isCurrentTrack ? 'rgba(156, 39, 176, 0.2)' : 'transparent',
                border: isCurrentTrack ? '1px solid rgba(156, 39, 176, 0.5)' : '1px solid transparent',
                '&:hover': {
                  bgcolor: isCurrentTrack ? 'rgba(156, 39, 176, 0.3)' : 'rgba(255, 255, 255, 0.05)',
                },
              }}
            >
              <ListItemButton
                onClick={() => onPlayTrack(index)}
                sx={{ borderRadius: 2 }}
              >
                <ListItemIcon>
                  {isCurrentTrack ? (
                    <VolumeUp color="primary" />
                  ) : (
                    <MusicNote color="action" />
                  )}
                </ListItemIcon>
                
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: isCurrentTrack ? 600 : 400,
                          color: isCurrentTrack ? 'primary.main' : 'text.primary',
                          flexGrow: 1,
                        }}
                      >
                        {track.title}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ minWidth: 'fit-content' }}
                      >
                        {formatDuration(track.duration)}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontSize: '0.875rem' }}
                    >
                      {track.filename}
                    </Typography>
                  }
                />
              </ListItemButton>

              <Box sx={{ display: 'flex', alignItems: 'center', pr: 1 }}>
                <IconButton
                  edge="end"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPlayTrack(index);
                  }}
                  size="small"
                  sx={{ mr: 1 }}
                >
                  <PlayArrow />
                </IconButton>
                
                <IconButton
                  edge="end"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveTrack(track.id);
                  }}
                  size="small"
                  color="error"
                >
                  <Delete />
                </IconButton>
              </Box>
            </ListItem>
          );
        })}
      </List>

      {/* Playlist Stats */}
      <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Typography variant="caption" color="text.secondary">
          Total de canciones: {playlist.tracks.length} • 
          Duración total: {formatDuration(
            playlist.tracks.reduce((total, track) => total + (track.duration || 0), 0)
          )}
        </Typography>
      </Box>
    </Box>
  );
};

export default Playlist;