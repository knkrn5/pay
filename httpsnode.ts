import https from "node:https";
import { createReadStream } from "node:fs";
import path from "node:path";

const filepath = `/home/karan/Videos/Money.Heist.S05.ENGLISH.WEBRip.x264-ION10/Money.Heist.S05E01.DUBBED.WEBRip.x264-ION10.mp4`;
const fileName = path.basename(filepath);
const url = "https://rework-parched-unlisted.ngrok-free.dev";

const stream = createReadStream(filepath);

const req = https.request(
  `${url}/post2`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/octet-stream",
      "X-File-Name": fileName,
    },
  },
  (res) => {
    res.pipe(process.stdout);
  },
);

req.on("error", console.error);

stream.pipe(req);
