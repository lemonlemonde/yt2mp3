import os
from pathlib import Path
import yt_dlp
import argparse

def main():
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
        }, {
            'key': 'FFmpegMetadata',  # Embed metadata into the file
        }],
        'outtmpl': str(os.path.join(downloads_folder, '%(title)s.%(ext)s'))
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(URL, download=True)
        
        artist = info.get('artist') or 'Unknown Artist'
        title = info.get('title') or 'Unknown Title'
            
        # Use ffmpeg to apply the metadata to the downloaded file
        filepath = os.path.join(downloads_folder, f"{info['title']}.m4a")

        # # Adding metadata to the file
        # ydl_opts_with_metadata = {
        #     'postprocessors': [{
        #         'key': 'FFmpegMetadata',
        #         'add_metadata': True,
        #         'metadata': {
        #             'artist': artist,
        #             'title': title
        #         }
        #     }],
        # }


        # # Re-run yt-dlp with the modified metadata options
        # with yt_dlp.YoutubeDL(ydl_opts_with_metadata) as ydl_with_metadata:
        #     ydl_with_metadata.post_process([{
        #         'filepath': filepath,
        #         'info_dict': info,
        #     }])
        
        
    print("Successfully downloaded title: " + title + " by " + artist, flush=True)

    return title, artist

if __name__ == '__main__':
    main()