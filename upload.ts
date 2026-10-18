import express from "express";
import path from "node:path";
import multer from "multer";

const app = express();
const port = Number(process.env.PORT ?? 3000);

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

app.get("/health", (_request, response) => {
  response.json({ status: "ok health" });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
