import https from "node:https";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import path from "node:path";

const filepath = `/home/karan/Videos/Money.Heist.S05.ENGLISH.WEBRip.x264-ION10/Money.Heist.S05E01.DUBBED.WEBRip.x264-ION10.mp4`;
const fileName = path.basename(filepath);
// const url = "https://rework-parched-unlisted.ngrok-free.dev";
const url = "http://127.0.0.1:3000";

const { size } = await stat(filepath);
const stream = createReadStream(filepath);

const req = https.request(
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
    res.pipe(process.stdout);
  },
);

req.on("error", console.error);
stream.on("error", console.error);

stream.pipe(req);
