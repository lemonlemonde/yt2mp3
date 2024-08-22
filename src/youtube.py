import yt_dlp
import argparse

parser = argparse.ArgumentParser(description='Download audio from YouTube')
parser.add_argument('url', metavar='URL', type=str)
args = parser.parse_args()

URL = args.url

ydl_opts = {
    'format': 'm4a/bestaudio/best',
    # ℹ️ See help(yt_dlp.postprocessor) for a list of available Postprocessors and their arguments
    'postprocessors': [{  # Extract audio using ffmpeg
        'key': 'FFmpegExtractAudio',
        'preferredcodec': 'm4a',
    }]
}

with yt_dlp.YoutubeDL(ydl_opts) as ydl:
    error_code = ydl.download(URL)
    
    
    
    /Users/mirujun/Library/Python/3.9/bin