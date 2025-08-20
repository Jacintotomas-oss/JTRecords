#player.py
import os 
import vlc 

#aqui se define la clase player con la que el usuario podra descargar u musica

from typing import Optional

def download_audio(url, output_dir: str = "downloads") -> Optional[str]:
    # esta funcion descarga la musica de un enlace y si no se ingresa un enlace se devuelve None
    os.makedirs(output_dir, exist_ok=True)
    
    ydl_opts = {
        "format": 'bestaudio/best',
        "outtmpl": os.path.join(output_dir, '%(title)s.%(ext)s'),
        "postprocessors": [{
            "key": 'FFmpegExtractAudio',
            "preferredcodec": 'mp3',
            "preferredquality": '192',
        }],
        "noplaylist": True,
        "quiet": True,
    }
    
    try:
        with ydl_opts.youtubeDL(ydl_opts) as ydl:
            info= ydl.extract_info(url, download=True)
            title = info.get("title", "audio")
            path = os.path.join(output_dir, f"{title}.mp3")
            return path if os.path.exists(path) else None
    except Exception as e:
        print("Error en la descarga:", e)
        return None
    
