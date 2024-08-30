// @ts-check

import { useState } from "react";
import { Command } from '@tauri-apps/api/shell'
import "./App.css";

function App() {
  const [resultMsg, setResultMsg] = useState("");
  const [url, setUrl] = useState("");

  async function download() {
    // print current time
    const now = new Date();
    console.log("Download started at: ", now);

    const test = "https://www.youtube.com/watch?v=8piyzDXN9qw"
    // const args = { url: url};

    const command = Command.sidecar('binaries/youtube', test);
    command.spawn();
    // std in and stderr from command
    command.stdout.on('data', (line) => {
      console.log(line);
    });
    command.on('error', (line) => {
      console.log(line);
    });

    const output = await command.execute();

    console.log("Downloaded URL: ", url);
    const finished = new Date();
    console.log("Download ended at: ", finished);
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
