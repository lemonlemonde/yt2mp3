import os
from pathlib import Path
import yt_dlp
import argparse

def main():
    print("====== Starting YouTube download", flush=True)
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
        'format': 'mp3/bestaudio/best',
        # ℹ️ See help(yt_dlp.postprocessor) for a list of available Postprocessors and their arguments
        'postprocessors': [{  # Extract audio using ffmpeg
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
        }, {
            'key': 'FFmpegMetadata',  # Embed metadata into the file
        }],
        'outtmpl': str(os.path.join(downloads_folder, '%(title)s.%(ext)s'))
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        try:
            info = ydl.extract_info(URL, download=True)
        except Exception as e:
            print("====== Error, trying extracting info again", flush=True)
            info = ydl.extract_info(URL, download=False)
            artist = info.get('artist') or 'Unknown Artist'
            title = info.get('title') or 'Unknown Title'
            
            print("====== Finished download", flush=True)
            
            print("Successfully downloaded title: ", str(title), " by ", str(artist), flush=True)
            if (str(title) == 'Unknown Title' or str(artist) == 'Unknown Artist' or str(title) == "" or str(artist) == ""):
                split_output = info['title'].split(' - ')
                if (len(split_output) > 1):
                    artist = split_output[0]
                    title = split_output[1]

            print("START_RESULT--TITLE:", str(title), "--ARTIST:", str(artist), "--END_RESULT", flush=True)

if __name__ == '__main__':
    main()