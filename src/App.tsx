// @ts-check

import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";

function App() {
  const [resultMsg, setResultMsg] = useState("");
  const [url, setUrl] = useState("");

  async function download() {
    const exe_path = "youtube.py";
    const args = { url: url};
    setResultMsg(await invoke('run_executable', { path: exe_path, args: args }));
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
