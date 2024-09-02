// @ts-check

import { useEffect, useState } from "react";
import { Command } from '@tauri-apps/api/shell'
import "./App.css";

// const test = "
      //      https://www.youtube.com/watch?v=Pqbl3gbj_kQ
      //      https://www.youtube.com/watch?v=dPNVJZP3i5g
      //      https://www.youtube.com/watch?v=a_DNuT7J1wk
      //      https://www.youtube.com/watch?v=vAhSxWMjhS0


function App() {
  const [resultMsg, setResultMsg] = useState("");
  const [url, setUrl] = useState("");
  const [curUrls, setCurUrls] = useState<{ url: string; status: Status }[]>([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [queue, setQueue] = useState<(() => Promise<string>)[]>([]); 

  const [completeUrls, setCompleteUrls] = useState<{ url: string}[]>([]);

  enum Status {
    Waiting = "Waiting",
    Downloading = "Downloading",
    Complete = "Complete!"
  }

  useEffect(() => {
    if (!isDownloading) {
      runQueue();
    }
  }, [queue, isDownloading]);

  useEffect(() => {
    console.log("Current URLs:", curUrls);
    updateCurList();
  }, [curUrls]);

  useEffect(() => {
    console.log("Complete URLs:", completeUrls);
    updateCompleteList();
  }, [completeUrls]);


  async function runQueue() {
    
    setIsDownloading(true);

    if (queue.length > 0) {
      console.log("[Run queue] *** === Running new task!!");
      const task = queue[0];
      setQueue((prevQueue) => {
        return prevQueue.slice(1);
      });
      if (task) {
        await task();
      }
    }

    console.log("[Run queue] *** === Finished running queue!!");
    setIsDownloading(false);
  }
  
  function submitUrl() {
    // console.log("sup")

    const target_url = url;

    // clear input field
    const input = document.getElementById("url-input") as HTMLInputElement
    if (input != null) {
      input.value = "";
    }
    setUrl("");

    console.log("Adding to queue: ", target_url);
    // add to queue
    setQueue([...queue, () => download(target_url)]);

    // add to curUrls, and the change will update list
    setCurUrls([...curUrls, { url: target_url, status: Status.Waiting }]);
  }
  
  function updateCurList() {
    console.log("----- rerendering cur url display ist -----");
    var result = "";
    curUrls.forEach(function (item) {
      result += "<li>" + item.status + " - " + item.url + "</li>";
    });
    
    const list_queue = document.getElementById("queue") as HTMLOListElement;
    if (list_queue != null) {
      list_queue.innerHTML = result;
    }
  }

  async function download(target_url: string): Promise<string> {
    // set status to downloading
    console.log("[download]: Setting to downloading: ", target_url);
    // setCurUrls([...curUrls, {url: target_url, status: Status.Downloading}]);
    setCurUrls((prevUrls) => prevUrls.map((item) => item.url === target_url ? { url: target_url, status: Status.Downloading } : item));


    // print current time
    const now = new Date();
    console.log(now, ": Starting download for URL: \n", target_url);
    setResultMsg("Starting download...");
    
    // start download
    let result_title = "";
    let result_artist = "";
    const command = Command.sidecar('binaries/youtube', String(target_url));
    command.spawn();
    // std in and stderr from command
    command.stdout.on('data', (line) => {
      console.log("==============", line);
      setResultMsg(line);
    });
    command.on('error', (line) => {
      console.log(line);
      setResultMsg("**[ERROR]**: " + line);
    });
    
    const output = await command.execute();
    console.log("*********** =========== ************* PYTHON OUTPUT", output);
    console.log("***** output out:", output.stdout);
    console.log("***** output err:", output.stderr);
    if (output.stdout.includes("START_RESULT--")) {
      console.log("*********** =========== *************** FOUND RESULT");
      const line = String(output.stdout);
      result_title = line.substring(line.indexOf("TITLE:") + 7, line.indexOf("--ARTIST:"));
      result_artist = line.substring(line.indexOf("ARTIST:") + 8, line.indexOf("--END_RESULT"));
    }

    // on finish
    const finished = new Date();
    console.log(finished, ": Download complete for URL: \n", target_url);
    setResultMsg("Download complete for [" + result_title + " - " + result_artist + "] from: " + target_url);

    // if (curUrls[0]) {
    //   console.log("curUrls: ", curUrls);
    //   curUrls.shift();
    //   console.log("Next download: ", curUrls[0]);
    // }
    // setCurUrls(curUrls);
    console.log("[download]: Removing from curUrls: ", target_url);
    setCurUrls((prevUrls) => prevUrls.filter((item) => item.url !== target_url));


    // add to completeUrls
    console.log("[download]: Adding to completeUrls: ", target_url);
    setCompleteUrls((prevCompleteUrls) => {
      return [...prevCompleteUrls, { url: result_title + " - " + result_artist + " - " + target_url }];
    });  

    return "Download complete!";
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
      <h1>YouTube mp3 downloader</h1>

      <p>Click to download!</p>

      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          const test = url.replace(/\s/g, "");
          if (test) {
            submitUrl();
          } else {
            // clear input field
            const input = document.getElementById("url-input") as HTMLInputElement
            if (input != null) {
              input.value = "";
            }
            setUrl("");
            setResultMsg("Please enter a URL");
          }
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
// 