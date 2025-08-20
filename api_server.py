#!/usr/bin/env python3
"""
FastAPI server to provide REST API for the music player functionality
"""
import os
import sys
import asyncio
import threading
from typing import List, Optional, Dict, Any
from pathlib import Path

from fastapi import FastAPI, HTTPException, UploadFile, File, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import uvicorn

# Import our existing player functionality
try:
    import vlc
    from music_player import MusicPlayer as BaseMusicPlayer
except ImportError:
    print("VLC not found. Please install python-vlc: pip install python-vlc")
    sys.exit(1)

# Models for API requests/responses
class TrackInfo(BaseModel):
    id: int
    title: str
    filename: str
    path: str
    duration: Optional[float] = None

class PlaylistResponse(BaseModel):
    tracks: List[TrackInfo]
    current_index: Optional[int] = None

class PlayerStatus(BaseModel):
    is_playing: bool
    is_paused: bool
    current_track: Optional[TrackInfo] = None
    position: float = 0.0
    duration: float = 0.0
    volume: int = 80

class DownloadRequest(BaseModel):
    url: str

class VolumeRequest(BaseModel):
    volume: int

# Enhanced Music Player class for API
class APIPlayer(BaseMusicPlayer):
    def __init__(self):
        super().__init__()
        
    def add_track(self, file_path: str) -> TrackInfo:
        """Add a track to the playlist"""
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File not found: {file_path}")
            
        # Add to base class playlist
        self.add_single(file_path)
        
        track_id = len(self.playlist) - 1
        filename = os.path.basename(file_path)
        title = os.path.splitext(filename)[0]
        
        # Try to get duration
        media = self.instance.media_new(file_path)
        media.parse()
        duration = media.get_duration() / 1000.0 if media.get_duration() > 0 else None
        
        track = TrackInfo(
            id=track_id,
            title=title,
            filename=filename,
            path=file_path,
            duration=duration
        )
        
        return track
    
    def get_playlist(self) -> PlaylistResponse:
        """Get current playlist"""
        tracks = []
        for i, path in enumerate(super().get_playlist()):
            filename = os.path.basename(path)
            title = os.path.splitext(filename)[0]
            
            # Try to get duration
            media = self.instance.media_new(path)
            media.parse()
            duration = media.get_duration() / 1000.0 if media.get_duration() > 0 else None
            
            track = TrackInfo(
                id=i,
                title=title,
                filename=filename,
                path=path,
                duration=duration
            )
            tracks.append(track)
        
        return PlaylistResponse(
            tracks=tracks,
            current_index=self.current_index if tracks else None
        )
    
    def play_track(self, index: int = None):
        """Play track at specific index or current index"""
        playlist = super().get_playlist()
        if not playlist:
            raise HTTPException(status_code=400, detail="Playlist is empty")
            
        if index is not None:
            if 0 <= index < len(playlist):
                self.play_index(index)
            else:
                raise HTTPException(status_code=400, detail="Invalid track index")
        else:
            self.play()
    
    def next_track(self):
        """Play next track"""
        self.next()
    
    def previous_track(self):
        """Play previous track"""
        self.previous()
    
    def get_status(self) -> PlayerStatus:
        """Get current player status"""
        is_playing = self.is_playing()
        is_paused = self.is_paused()
        
        current_track = None
        current_path = self.get_current_track()
        if current_path:
            filename = os.path.basename(current_path)
            title = os.path.splitext(filename)[0]
            
            # Try to get duration
            media = self.instance.media_new(current_path)
            media.parse()
            duration = media.get_duration() / 1000.0 if media.get_duration() > 0 else None
            
            current_track = TrackInfo(
                id=self.current_index,
                title=title,
                filename=filename,
                path=current_path,
                duration=duration
            )
        
        position = self.get_position() * (current_track.duration or 0) if current_track else 0
        duration = current_track.duration or 0 if current_track else 0
        
        return PlayerStatus(
            is_playing=is_playing,
            is_paused=is_paused,
            current_track=current_track,
            position=position,
            duration=duration,
            volume=self.volume
        )

# Initialize FastAPI app
app = FastAPI(title="Music Player API", version="1.0.0")

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize player
player = APIPlayer()

# Create directories
os.makedirs("uploads", exist_ok=True)
os.makedirs("downloads", exist_ok=True)

# Mount static files
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
app.mount("/downloads", StaticFiles(directory="downloads"), name="downloads")

# API Routes
@app.get("/")
async def root():
    return {"message": "Music Player API is running"}

@app.get("/playlist", response_model=PlaylistResponse)
async def get_playlist():
    """Get current playlist"""
    return player.get_playlist()

@app.get("/status", response_model=PlayerStatus)
async def get_status():
    """Get player status"""
    return player.get_status()

@app.post("/play")
async def play(index: Optional[int] = None):
    """Play track at index or resume current track"""
    try:
        player.play_track(index)
        return {"message": "Playing"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/pause")
async def pause():
    """Pause playback"""
    player.pause()
    return {"message": "Paused"}

@app.post("/stop")
async def stop():
    """Stop playback"""
    player.stop()
    return {"message": "Stopped"}

@app.post("/next")
async def next_track():
    """Play next track"""
    player.next_track()
    return {"message": "Next track"}

@app.post("/previous")
async def previous_track():
    """Play previous track"""
    player.previous_track()
    return {"message": "Previous track"}

@app.post("/volume")
async def set_volume(request: VolumeRequest):
    """Set volume"""
    player.set_volume(request.volume)
    return {"message": f"Volume set to {request.volume}"}

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    """Upload audio file"""
    if not file.filename.lower().endswith(('.mp3', '.wav', '.flac', '.m4a')):
        raise HTTPException(status_code=400, detail="Invalid file type")
    
    file_path = f"uploads/{file.filename}"
    
    with open(file_path, "wb") as f:
        content = await file.read()
        f.write(content)
    
    try:
        track = player.add_track(file_path)
        return {"message": "File uploaded successfully", "track": track}
    except Exception as e:
        os.remove(file_path)  # Clean up on error
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/download")
async def download_from_url(request: DownloadRequest, background_tasks: BackgroundTasks):
    """Download audio from URL (YouTube, etc.)"""
    try:
        # Add to background tasks for async processing
        background_tasks.add_task(download_audio_task, request.url)
        return {"message": "Download started", "url": request.url}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

async def download_audio_task(url: str):
    """Background task to download audio"""
    try:
        import yt_dlp
        
        output_dir = "downloads"
        os.makedirs(output_dir, exist_ok=True)
        
        ydl_opts = {
            'format': 'bestaudio/best',
            'outtmpl': os.path.join(output_dir, '%(title)s.%(ext)s'),
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': '192',
            }],
            'noplaylist': True,
            'quiet': True,
        }
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)
            title = info.get('title', 'audio')
            # Clean filename
            safe_title = "".join(c for c in title if c.isalnum() or c in (' ', '-', '_')).rstrip()
            path = os.path.join(output_dir, f"{safe_title}.mp3")
            
            # Try to find the actual downloaded file
            for file in os.listdir(output_dir):
                if file.startswith(safe_title) and file.endswith('.mp3'):
                    actual_path = os.path.join(output_dir, file)
                    if os.path.exists(actual_path):
                        # Add to playlist
                        player.add_track(actual_path)
                        break
                        
    except ImportError:
        print("yt-dlp not installed. Install with: pip install yt-dlp")
    except Exception as e:
        print(f"Download error: {e}")

@app.delete("/playlist")
async def clear_playlist():
    """Clear playlist"""
    player.clear_playlist()
    return {"message": "Playlist cleared"}

@app.delete("/track/{track_id}")
async def remove_track(track_id: int):
    """Remove track from playlist"""
    playlist = player.get_playlist()
    if 0 <= track_id < len(playlist):
        removed_path = playlist[track_id]
        removed_filename = os.path.basename(removed_path)
        player.remove_track(track_id)
        return {"message": f"Removed track: {removed_filename}"}
    else:
        raise HTTPException(status_code=404, detail="Track not found")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)