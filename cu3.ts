import { createReadStream } from "node:fs";
import { Readable } from "node:stream";
import path from "node:path"

// const filepath = String.raw(`/home/karan/Videos/Money.Heist.S05.ENGLISH.WEBRip.x264-ION10`)
const filepath = `/home/karan/Videos/Money.Heist.S05.ENGLISH.WEBRip.x264-ION10/Money.Heist.S05E01.DUBBED.WEBRip.x264-ION10.mp4`
const fileName =  path.basename(filepath)

const stream = createReadStream(filepath);

const response = await fetch("http://localhost:3000/post2", {
  method: "POST",
  headers: {
    "Content-Type": "application/octet-stream",
    "X-File-Name": fileName,
  },
  body: Readable.toWeb(stream),
  duplex: "half",
});

console.log(await response.json());