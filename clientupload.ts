import { readFile } from "node:fs/promises";

const file = new File(
  [await readFile("./index.html")],
  "document.pdf",
  { type: "application/pdf" }
);

const form = new FormData();
form.append("file", file);

const response = await fetch("http://localhost:3000/post", {
  method: "POST",
  body: form,
});

console.log(await response.json());