import http from "node:http";
import { createReadStream } from "node:fs";
import path from "node:path"
import { stat } from "node:fs/promises";


const filepath = `/home/karan/Videos/Money.Heist.S05.ENGLISH.WEBRip.x264-ION10/Money.Heist.S05E01.DUBBED.WEBRip.x264-ION10.mp4`
const fileName =  path.basename(filepath)
const { size } = await stat(filepath);
// const url = "https://rework-parched-unlisted.ngrok-free.dev"
const url = "http://127.0.0.1:3000";

const stream = createReadStream(filepath);

const req = http.request(
  `${url}/post3`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Length": String(size),
      "X-File-Name": fileName,
    },
  },
  (res) => {
    let response = "";

    res.setEncoding("utf8");
    res.on("data", (chunk) => (response += chunk));
    res.on("end", () => console.log(response));
  }
);

req.on("error", console.error);

// Streams the file to the HTTP request with backpressure handling.
stream.pipe(req);