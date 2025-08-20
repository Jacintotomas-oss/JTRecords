import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Typography,
  LinearProgress,
  Alert,
  Stack,
  Chip,
  Paper,
} from '@mui/material';
import {
  CloudUpload,
  AudioFile,
  CheckCircle,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { MusicPlayerAPI } from '../api/client';

interface FileUploadProps {
  onUploadComplete: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUploadComplete }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const acceptedFormats = ['.mp3', '.wav', '.flac', '.m4a'];
  const maxFileSize = 50 * 1024 * 1024; // 50MB

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles: File[] = [];
    const invalidFiles: string[] = [];

    files.forEach((file) => {
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      
      if (!acceptedFormats.includes(fileExtension)) {
        invalidFiles.push(`${file.name} (formato no válido)`);
        return;
      }
      
      if (file.size > maxFileSize) {
        invalidFiles.push(`${file.name} (muy grande)`);
        return;
      }
      
      validFiles.push(file);
    });

    if (invalidFiles.length > 0) {
      setMessage({
        type: 'error',
        text: `Archivos rechazados: ${invalidFiles.join(', ')}`
      });
    }

    setSelectedFiles(validFiles);
    
    if (validFiles.length > 0 && invalidFiles.length === 0) {
      setMessage(null);
    }
  };

  const uploadFiles = async () => {
    if (selectedFiles.length === 0) return;

    setUploading(true);
    setUploadProgress(0);
    setMessage(null);

    try {
      const totalFiles = selectedFiles.length;
      let uploadedCount = 0;

      for (const file of selectedFiles) {
        await MusicPlayerAPI.uploadFile(file);
        uploadedCount++;
        setUploadProgress((uploadedCount / totalFiles) * 100);
      }

      setMessage({
        type: 'success',
        text: `${totalFiles} archivo${totalFiles > 1 ? 's' : ''} subido${totalFiles > 1 ? 's' : ''} correctamente`
      });
      
      setSelectedFiles([]);
      onUploadComplete();
      
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

    } catch (error) {
      console.error('Upload failed:', error);
      setMessage({
        type: 'error',
        text: 'Error al subir archivos. Inténtalo de nuevo.'
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const clearSelection = () => {
    setSelectedFiles([]);
    setMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Box>
      {/* File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptedFormats.join(',')}
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        id="file-upload-input"
      />
      
      {/* Upload Button */}
      <label htmlFor="file-upload-input">
        <Button
          component="span"
          variant="outlined"
          startIcon={<CloudUpload />}
          fullWidth
          disabled={uploading}
          sx={{
            py: 2,
            borderStyle: 'dashed',
            borderWidth: 2,
            '&:hover': {
              borderStyle: 'dashed',
              borderWidth: 2,
            },
          }}
        >
          Seleccionar Archivos de Audio
        </Button>
      </label>

      {/* Format Info */}
      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
        Formatos soportados: {acceptedFormats.join(', ')} • Máximo: {formatFileSize(maxFileSize)}
      </Typography>

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <Paper sx={{ mt: 2, p: 2, bgcolor: 'rgba(156, 39, 176, 0.1)' }}>
          <Typography variant="subtitle2" gutterBottom>
            Archivos seleccionados ({selectedFiles.length}):
          </Typography>
          
          <Stack spacing={1} sx={{ maxHeight: 150, overflow: 'auto' }}>
            {selectedFiles.map((file, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AudioFile fontSize="small" color="primary" />
                <Typography variant="body2" sx={{ flexGrow: 1, minWidth: 0 }}>
                  {file.name}
                </Typography>
                <Chip 
                  label={formatFileSize(file.size)} 
                  size="small" 
                  variant="outlined" 
                />
              </Box>
            ))}
          </Stack>

          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
            <Button
              variant="contained"
              onClick={uploadFiles}
              disabled={uploading}
              startIcon={<CloudUpload />}
              sx={{ flexGrow: 1 }}
            >
              {uploading ? 'Subiendo...' : 'Subir Archivos'}
            </Button>
            
            <Button
              variant="outlined"
              onClick={clearSelection}
              disabled={uploading}
              size="small"
            >
              Limpiar
            </Button>
          </Stack>
        </Paper>
      )}

      {/* Progress Bar */}
      {uploading && (
        <Box sx={{ mt: 2 }}>
          <LinearProgress 
            variant="determinate" 
            value={uploadProgress} 
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
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Subiendo... {Math.round(uploadProgress)}%
          </Typography>
        </Box>
      )}

      {/* Messages */}
      {message && (
        <Alert 
          severity={message.type} 
          sx={{ mt: 2 }}
          icon={message.type === 'success' ? <CheckCircle /> : <ErrorIcon />}
        >
          {message.text}
        </Alert>
      )}
    </Box>
  );
};

export default FileUpload;