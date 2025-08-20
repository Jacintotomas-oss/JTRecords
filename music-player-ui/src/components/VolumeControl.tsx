import React, { useState, useEffect } from 'react';
import {
  Box,
  Slider,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import {
  VolumeUp,
  VolumeDown,
  VolumeMute,
  VolumeOff,
} from '@mui/icons-material';

interface VolumeControlProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
}

const VolumeControl: React.FC<VolumeControlProps> = ({ volume, onVolumeChange }) => {
  const [localVolume, setLocalVolume] = useState(volume);
  const [previousVolume, setPreviousVolume] = useState(volume);

  useEffect(() => {
    setLocalVolume(volume);
  }, [volume]);

  const handleVolumeChange = (event: Event, newValue: number | number[]) => {
    const vol = Array.isArray(newValue) ? newValue[0] : newValue;
    setLocalVolume(vol);
  };

  const handleVolumeCommit = (event: Event | React.SyntheticEvent, newValue: number | number[]) => {
    const vol = Array.isArray(newValue) ? newValue[0] : newValue;
    onVolumeChange(vol);
  };

  const toggleMute = () => {
    if (localVolume > 0) {
      setPreviousVolume(localVolume);
      setLocalVolume(0);
      onVolumeChange(0);
    } else {
      const volToRestore = previousVolume > 0 ? previousVolume : 50;
      setLocalVolume(volToRestore);
      onVolumeChange(volToRestore);
    }
  };

  const getVolumeIcon = () => {
    if (localVolume === 0) return <VolumeOff />;
    if (localVolume < 30) return <VolumeMute />;
    if (localVolume < 70) return <VolumeDown />;
    return <VolumeUp />;
  };

  return (
    <Box>
      <Stack direction="row" spacing={2} alignItems="center">
        <IconButton 
          onClick={toggleMute}
          color={localVolume === 0 ? 'error' : 'primary'}
          size="small"
        >
          {getVolumeIcon()}
        </IconButton>
        
        <Slider
          value={localVolume}
          onChange={handleVolumeChange}
          onChangeCommitted={handleVolumeCommit}
          min={0}
          max={100}
          step={1}
          sx={{
            flexGrow: 1,
            '& .MuiSlider-thumb': {
              width: 20,
              height: 20,
              background: 'linear-gradient(45deg, #9c27b0 30%, #e91e63 90%)',
              '&:hover': {
                boxShadow: '0 0 0 8px rgba(156, 39, 176, 0.16)',
              },
            },
            '& .MuiSlider-track': {
              background: 'linear-gradient(45deg, #9c27b0 30%, #e91e63 90%)',
              border: 'none',
            },
            '& .MuiSlider-rail': {
              bgcolor: 'rgba(255, 255, 255, 0.2)',
            },
          }}
        />
        
        <Typography 
          variant="body2" 
          sx={{ minWidth: '3ch', textAlign: 'right' }}
          color="text.secondary"
        >
          {Math.round(localVolume)}
        </Typography>
      </Stack>

      {/* Volume Level Indicator */}
      <Box sx={{ mt: 2 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          {[...Array(10)].map((_, index) => {
            const threshold = (index + 1) * 10;
            const isActive = localVolume >= threshold;
            
            return (
              <Box
                key={index}
                sx={{
                  width: 4,
                  height: 16 + (index * 2),
                  bgcolor: isActive 
                    ? index < 6 
                      ? 'success.main' 
                      : index < 8 
                        ? 'warning.main' 
                        : 'error.main'
                    : 'rgba(255, 255, 255, 0.2)',
                  borderRadius: 1,
                  transition: 'all 0.2s ease',
                }}
              />
            );
          })}
        </Stack>
      </Box>

      {/* Volume Presets */}
      <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
        {[25, 50, 75, 100].map((preset) => (
          <IconButton
            key={preset}
            size="small"
            onClick={() => {
              setLocalVolume(preset);
              onVolumeChange(preset);
            }}
            sx={{
              fontSize: '0.75rem',
              minWidth: 32,
              height: 24,
              bgcolor: localVolume === preset ? 'primary.main' : 'rgba(255, 255, 255, 0.1)',
              color: localVolume === preset ? 'white' : 'text.secondary',
              '&:hover': {
                bgcolor: localVolume === preset ? 'primary.dark' : 'rgba(255, 255, 255, 0.2)',
              },
            }}
          >
            {preset}%
          </IconButton>
        ))}
      </Stack>
    </Box>
  );
};

export default VolumeControl;