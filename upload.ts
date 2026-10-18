import express from "express";
import path from "node:path";

const app = express();
const port = Number(process.env.PORT ?? 3000);

app.disable("x-powered-by");
app.use(express.json());
app.use(express.static(path.join(import.meta.dirname)));

app.get("/", (_request, response) => {
  response.json({ status: "ok" });
});

app.post("/post", (req, res) => {
  res.json({ status: "uploading" });
});

app.get("/health", (_request, response) => {
  response.json({ status: "ok health" });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});