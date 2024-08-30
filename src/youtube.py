import os
from pathlib import Path
import yt_dlp
import argparse

parser = argparse.ArgumentParser(description='Download audio from YouTube')
parser.add_argument('url', metavar='URL', type=str)
args = parser.parse_args()

URL = args.url

# URL = "https://www.youtube.com/watch?v=8piyzDXN9qw"

if os.name == 'nt':  # Windows
    downloads_folder = Path(os.environ['USERPROFILE']) / 'Downloads'
elif os.name == 'posix':  # macOS or Linux
    downloads_folder = Path.home() / 'Downloads'
else:
    raise OSError('Unsupported operating system')

print("====== Downloads folder: " + str(downloads_folder), flush=True)


ydl_opts = {
    'format': 'm4a/bestaudio/best',
    # ℹ️ See help(yt_dlp.postprocessor) for a list of available Postprocessors and their arguments
    'postprocessors': [{  # Extract audio using ffmpeg
        'key': 'FFmpegExtractAudio',
        'preferredcodec': 'm4a',
    }],
    'outtmpl': str(os.path.join(downloads_folder, '%(title)s.%(ext)s'))
}

with yt_dlp.YoutubeDL(ydl_opts) as ydl:
    error_code = ydl.download(URL)
    info = ydl.extract_info(URL, download=False)
    title = info['title']
    artist = info['uploader']
    if artist == None:
        artist = "Unknown"
    if title == None:
        title = "Unknown"
        
    print("====== Title: " + title, flush=True)
    print("====== Artist: " + artist, flush=True)