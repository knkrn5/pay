import express from "express";
import path from "node:path";
import multer from "multer";
import { mkdir, open } from "node:fs/promises";
import { createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";

const app = express();
const port = Number(process.env.PORT ?? 3000);
const uploadDir = path.resolve("uploads");

app.disable("x-powered-by");
app.use(express.json());
app.use(express.static(path.join(import.meta.dirname)));

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    console.log("cl", req.headers["content-length"])
    cb(null, path.basename(file.originalname));
  },
});

const upload = multer({ storage });

app.get("/", (_request, response) => {
  response.json({ status: "ok" });
});

app.post("/post", upload.single("file"), (req, res) => {
  console.log("data", req.file);
  res.json({
    status: "uploaded",
    filename: req.file.filename,
    size: req.file.size,
  });
});

app.post("/post2", async (req, res) => {
  let handle;

  try {
    await mkdir(uploadDir, { recursive: true });

    const rawName = decodeURIComponent(
      req.get("X-File-Name") || "upload.bin"
    );

    const filename = path.basename(rawName.replace(/\\/g, "/"));

    if (!filename || filename === "." || filename === "..") {
      return res.status(400).json({ error: "Invalid filename" });
    }

    const destination = path.join(uploadDir, filename);

    // "wx" prevents accidentally overwriting an existing file.
    handle = await open(destination, "wx");

    await pipeline(req, createWriteStream(destination, {
      fd: handle.fd,
      autoClose: false,
    }));

    await handle.close();
    handle = undefined;

    res.json({ status: "uploaded", filename });
  } catch (error) {
    await handle?.close().catch(() => {});

    res.status(error.code === "EEXIST" ? 409 : 500).json({
      error: error.code === "EEXIST"
        ? "File already exists"
        : "Upload failed",
    });
  }
});

app.get("/health", (_request, response) => {
  response.json({ status: "ok health" });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
