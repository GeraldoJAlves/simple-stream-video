const fs = require("fs");
const express = require("express");

const app = express();

const requestFile = (req, res, pathFile) => {
  if (!fs.existsSync(pathFile)) {
    return res.status(404).end("<h1>File not found</h1>");
  }
  fs.readFile(pathFile, (err, content) => {
    if (err) {
      console.error(err);
      return res.status(500).end("internal error");
    }
    res.end(content);
  });
}

app.get("/:file", (req, res) => {
  let file = req.params.file;
  const pathFile = `./public/${file}`;
  requestFile(req, res, pathFile)
});

app.get("/", (req, res) => {
  let file = "index.html"
  const pathFile = `./public/${file}`;
  requestFile(req, res, pathFile)
});

app.get("/movies/:movieName", (req, res) => {
  const { movieName } = req.params;
  const movieFile = `./movies/${movieName}`;
  requestFile(req, res, movieFile)
});

app.get("/stream/:movieName", (req, res) => {
  const { movieName } = req.params;
  const movieFile = `./movies/${movieName}`;

  if (!fs.existsSync(movieFile)) {
    return res.status(404).end("<h1>Movie not found</h1>");
  }
  const stat = fs.statSync(movieFile);
  const fileSize = stat.size;
  const { range } = req.headers;
  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = end - start + 1;
    const file = fs.createReadStream(movieFile, { start, end });
    const head = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunksize,
      "Content-Type": "video/mp4",
    };
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      "Content-Length": fileSize,
      "Content-Type": "video/mp4",
    };
    res.writeHead(200, head);
    fs.createReadStream(movieFile).pipe(res);
  }
});

app.listen(3000, () => {
  console.log("start in port 3000");
});
