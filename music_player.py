#!/usr/bin/env python3
"""
Enhanced Music Player implementation using VLC
"""
import os
import vlc
from typing import List, Optional

class MusicPlayer:
    def __init__(self):
        """Initialize the music player"""
        self.instance = vlc.Instance('--intf', 'dummy')
        self.player = self.instance.media_player_new()
        self.playlist: List[str] = []
        self.current_index = 0
        self.volume = 80
        self.player.audio_set_volume(self.volume)
        
    def add(self, file_paths: List[str]):
        """Add files to the playlist"""
        for path in file_paths:
            if os.path.exists(path) and path not in self.playlist:
                self.playlist.append(path)
    
    def add_single(self, file_path: str):
        """Add a single file to the playlist"""
        if os.path.exists(file_path) and file_path not in self.playlist:
            self.playlist.append(file_path)
    
    def play_or_pause(self):
        """Toggle play/pause"""
        if self.player.get_state() == vlc.State.Playing:
            self.player.pause()
        else:
            self.play()
    
    def play(self):
        """Play current track or resume"""
        if not self.playlist:
            return
            
        if self.player.get_media() is None:
            self.play_index(self.current_index)
        else:
            self.player.play()
    
    def play_index(self, index: int):
        """Play track at specific index"""
        if not self.playlist or index < 0 or index >= len(self.playlist):
            return
            
        self.current_index = index
        media = self.instance.media_new(self.playlist[index])
        self.player.set_media(media)
        self.player.play()
    
    def pause(self):
        """Pause playback"""
        self.player.pause()
    
    def stop(self):
        """Stop playback"""
        self.player.stop()
    
    def next(self):
        """Play next track"""
        if not self.playlist:
            return
        self.current_index = (self.current_index + 1) % len(self.playlist)
        self.play_index(self.current_index)
    
    def previous(self):
        """Play previous track"""
        if not self.playlist:
            return
        self.current_index = (self.current_index - 1) % len(self.playlist)
        self.play_index(self.current_index)
    
    def set_volume(self, volume: int):
        """Set volume (0-100)"""
        self.volume = max(0, min(100, volume))
        self.player.audio_set_volume(self.volume)
    
    def get_current_track(self) -> Optional[str]:
        """Get current track path"""
        if self.playlist and 0 <= self.current_index < len(self.playlist):
            return self.playlist[self.current_index]
        return None
    
    def get_playlist(self) -> List[str]:
        """Get playlist"""
        return self.playlist.copy()
    
    def clear_playlist(self):
        """Clear the playlist"""
        self.stop()
        self.playlist.clear()
        self.current_index = 0
    
    def remove_track(self, index: int):
        """Remove track at index"""
        if 0 <= index < len(self.playlist):
            self.playlist.pop(index)
            if self.current_index >= len(self.playlist):
                self.current_index = max(0, len(self.playlist) - 1)
    
    def is_playing(self) -> bool:
        """Check if currently playing"""
        return self.player.get_state() == vlc.State.Playing
    
    def is_paused(self) -> bool:
        """Check if currently paused"""
        return self.player.get_state() == vlc.State.Paused
    
    def get_position(self) -> float:
        """Get playback position (0.0 to 1.0)"""
        return self.player.get_position()
    
    def get_length(self) -> int:
        """Get track length in milliseconds"""
        return self.player.get_length()