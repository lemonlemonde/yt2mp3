# Tauri + React + Typescript

This template should help get you started developing with Tauri, React and Typescript in Vite.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)



## Notes
- `npm run tauri dev`
- `pyinstaller -F --distpath src-tauri/binaries src/youtube.py` 
    - (if modules for script installed in conda env, make sure to do `conda install -c conda-forge pyinstaller` instead of `pip install pyinstaller`)
- add target triple architecture at end of binary e.g., `youtube-x86_64-apple-darwin` or `hi-x86_64-apple-darwin`
- `pip install -r requirements.txt`
- possibly `pip install ffmpeg`?

## Dev log / todo
- ✅ added python code as sidecar after turning into binary
- ✅ make sure `src-tauri/default.profraw` is read only!!
- ✅ need to use pyinstaller on a windows device to compile binary for diff architecture
- ✅ try building into complete and see if it works on mmy comp + dad's comp
- Downloads folder selection in app
- Bug: it occasionally leaves .webm and .mp3.parts??? Or just leaves .webm files without creating .mp3 files. YouTube.py is bugging out somewhere and leaving things unfinished! Need to make sure to do cleanup possibly?
- Make python sidecar command a persistent process!!! and keep feeding urls until quit!!! it'll be much faster b/c no more heavy imports!
- try torify???? Use Tor to switcheroo IP addresses with yt-dl --proxy in case YouTube decides it doesn't like me?
    - check out: https://github.com/yt-dlp/yt-dlp/issues/3129#issuecomment-1575139548
    - https://linuxaria.com/howto/how-to-anonymize-the-programs-from-your-terminal-with-torify
- just spawn a shell command instead of the python binary. Potentially much faster? (wait but what about the installs required?)
- mp3 or m4a?
- 