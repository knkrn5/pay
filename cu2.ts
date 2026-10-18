import { openAsBlob } from "node:fs";

const file = await openAsBlob("./index.html", {
  type: "text/html",
});

const form = new FormData();
form.append("file", file, "index.html");

const response = await fetch("http://localhost:3000/post", {
  method: "POST",
  body: form,
});

console.log(await response.json());