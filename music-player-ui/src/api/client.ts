import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export interface TrackInfo {
  id: number;
  title: string;
  filename: string;
  path: string;
  duration?: number;
}

export interface PlaylistResponse {
  tracks: TrackInfo[];
  current_index?: number;
}

export interface PlayerStatus {
  is_playing: boolean;
  is_paused: boolean;
  current_track?: TrackInfo;
  position: number;
  duration: number;
  volume: number;
}

export class MusicPlayerAPI {
  static async getPlaylist(): Promise<PlaylistResponse> {
    const response = await apiClient.get<PlaylistResponse>('/playlist');
    return response.data;
  }

  static async getStatus(): Promise<PlayerStatus> {
    const response = await apiClient.get<PlayerStatus>('/status');
    return response.data;
  }

  static async play(index?: number): Promise<void> {
    await apiClient.post('/play', index !== undefined ? { index } : {});
  }

  static async pause(): Promise<void> {
    await apiClient.post('/pause');
  }

  static async stop(): Promise<void> {
    await apiClient.post('/stop');
  }

  static async next(): Promise<void> {
    await apiClient.post('/next');
  }

  static async previous(): Promise<void> {
    await apiClient.post('/previous');
  }

  static async setVolume(volume: number): Promise<void> {
    await apiClient.post('/volume', { volume });
  }

  static async uploadFile(file: File): Promise<{ track: TrackInfo }> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiClient.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  }

  static async downloadFromUrl(url: string): Promise<void> {
    await apiClient.post('/download', { url });
  }

  static async clearPlaylist(): Promise<void> {
    await apiClient.delete('/playlist');
  }

  static async removeTrack(trackId: number): Promise<void> {
    await apiClient.delete(`/track/${trackId}`);
  }
}