const fs = require("fs");
const express = require("express");

const app = express();

app.get("/", (req, res) => {
  fs.readFile("./public/index.html", (err, content) => res.end(content));
});

app.get("/movies/:movieName", (req, res) => {
  const { movieName } = req.params;
  const movieFile = `./movies/${movieName}`;
  fs.stat(movieFile, (err, stats) => {
    if (err) {
      return res.status(404).end("<h1>Movie not found</h1>");
    }
    const { range } = req.headers;
    const { size } = stats;
    const parts = (range || "").replace(/bytes=/, "").split("-")
    const start = Number(parts[0]);
    const end = size - 1;
    const chunkSize = end - start + 1;
    // console.log(chunkSize, start, end)
    console.log(parts)
    res.set({
      "Content-Range": `bytes ${start}-${end}/${size}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunkSize,
      "Content-Type": "video/mp4",
    });
    const stream = fs.createReadStream(movieFile, { start, end });
    stream.on("open", () => stream.pipe(res));
    stream.on("error", (streamErr) => res.end(streamErr));
  });
});

app.listen(3000, () => {
  console.log("start in port 3000");
});
