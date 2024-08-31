// @ts-check

import { useEffect, useState } from "react";
import { Command } from '@tauri-apps/api/shell'
import "./App.css";

// const test = "
      //      https://www.youtube.com/watch?v=Pqbl3gbj_kQ
      //      https://www.youtube.com/watch?v=dPNVJZP3i5g
      //      https://www.youtube.com/watch?v=a_DNuT7J1wk
function App() {
  const [resultMsg, setResultMsg] = useState("");
  const [url, setUrl] = useState("");
  const [curUrls, setCurUrls] = useState<{ url: string; status: Status }[]>([]);
  const [completeUrls, setCompleteUrls] = useState<{ url: string}[]>([]);

  enum Status {
    Waiting = "Waiting",
    Downloading = "Downloading",
    Complete = "Complete!"
  }
  useEffect(() => {
    updateCurList();
  }, [curUrls]);

  useEffect(() => {
    updateCompleteList();
  }, [completeUrls]);

  async function submitUrl() {
    // empty check
    if (!url) {
      setResultMsg("Please enter a URL");
      return;
    }

    const target_url = url;

    // clear input field
    const input = document.getElementById("url-input") as HTMLInputElement
    if (input != null) {
      input.value = "";
    }

    // if curUrls is empty, start download
    if (curUrls.length == 0) {
      setCurUrls([...curUrls, { url: target_url, status: Status.Downloading }]);
      download(target_url);
      return;
    }

    // add to curUrls, and the change will update list
    setCurUrls([...curUrls, { url: target_url, status: Status.Waiting }]);

  }

  async function checkNext() {
    // check if any downloads are in progress
    var downloading = false;
    curUrls.forEach(function (item) {
      if (item.status == Status.Downloading) {
        downloading = true;
      }
    });

    // if no downloads in progress, start download
    if (!downloading && curUrls.length > 0) {
      // curUrls[0].status = Status.Downloading;
      // setCurUrls(curUrls);
      const target_url = curUrls.shift();
      setCurUrls((curUrls) => [...curUrls, { url: target_url!.url, status: Status.Downloading }]);
      download(String(target_url!.url));
    }
  }
  
  async function updateCurList() {
    console.log("----- updating cur list -----");
    var result = "";
    curUrls.forEach(function (item) {
      result += "<li>" + item.status + " - " + item.url + "</li>";
    });
    
    const queue = document.getElementById("queue") as HTMLOListElement;
    if (queue != null) {
      queue.innerHTML = result;
    }
  }

  async function download(target_url: string) {
    // print current time
    const now = new Date();
    console.log(now, ": Starting download for URL: \n", target_url);
    setResultMsg("Starting download...");
  
    // start download
    const command = Command.sidecar('binaries/youtube', String(target_url));
    command.spawn();
    // std in and stderr from command
    command.stdout.on('data', (line) => {
      console.log("==============", line);
      setResultMsg(line);
    });
    command.on('error', (line) => {
      console.log(line);
    });

    const output = await command.execute();
    console.log(output);

    // on finish
    const finished = new Date();
    console.log(finished, ": Download complete for URL: \n", target_url);
    setResultMsg("Download complete for URL: \n" + target_url);

    if (curUrls[0]) {
      curUrls.shift();
    }
    setCurUrls(curUrls);

    // add to completeUrls
    completeUrls.push({url: target_url});
    setCompleteUrls(completeUrls);
  }

  async function updateCompleteList() {
    var result = "";
    completeUrls.forEach(function (item) {
      result += "<li>" + "Finished download! - " + item.url + "</li>";
    });
    
    const finished = document.getElementById("finished") as HTMLOListElement;
    if (finished != null) {
      finished.innerHTML = result;
    }
  }

  return (
    <div className="container">
      <h1>Add YouTube URL here</h1>

      <p>Click to download!</p>

      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          submitUrl();
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

      <div><ol id="queue"></ol></div>

      <div><ol id="finished"></ol></div>
    </div>
  );
}

export default App;
