const fs = require("fs");
const http = require("http");
const path = require("path");

const root = path.join(__dirname, "build");
const port = Number(process.env.PORT || 3000);
const types = {
  ".css": "text/css",
  ".html": "text/html",
  ".js": "text/javascript",
  ".json": "application/json",
  ".mp4": "video/mp4",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain"
};

http
  .createServer((request, response) => {
    const cleanUrl = decodeURIComponent(request.url.split("?")[0]);
    const requestedPath = path.normalize(path.join(root, cleanUrl));
    const safePath = requestedPath.startsWith(root) ? requestedPath : path.join(root, "index.html");
    const filePath = fs.existsSync(safePath) && fs.statSync(safePath).isFile() ? safePath : path.join(root, "index.html");

    response.writeHead(200, { "Content-Type": types[path.extname(filePath)] || "application/octet-stream" });
    fs.createReadStream(filePath).pipe(response);
  })
  .listen(port, () => {
    console.log(`Serving RealTube at http://localhost:${port}`);
  });
