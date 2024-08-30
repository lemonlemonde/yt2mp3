// @ts-check

import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
import { Command } from '@tauri-apps/api/shell'

function App() {
  const [resultMsg, setResultMsg] = useState("");
  const [url, setUrl] = useState("");

  async function download() {
    const test = "https://www.youtube.com/watch?v=8piyzDXN9qw"
    const command = Command.sidecar('binaries/youtube')
    const output = await command.execute()
    // setResultMsg(await invoke('run_executable', { path: exe_path, args: args }));
    console.log("Downloaded URL: ", url);
  }

  return (
    <div className="container">
      <h1>Add YouTube URL here</h1>

      <p>Click to download!</p>

      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          download();
        }}
      >
        <input
          id="url-input"
          onChange={(e) => setUrl(e.currentTarget.value)}
          placeholder="Enter a Youtube URL..."
        />
        <button type="submit">Download</button>
      </form>

      <p id="result">{resultMsg}</p>
    </div>
  );
}

export default App;
