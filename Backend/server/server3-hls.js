const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3003;

http
  .createServer(function (request, response) {
    console.log("Request starting...", new Date());

    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
      "Access-Control-Max-Age": 2592000, // 30 days
    };
    if (request.method === "OPTIONS") {
      response.writeHead(204, headers);
      response.end();
      return;
    }

    // This is the file path for the reolink videos
    let filePath = "." + request.url;
    if (filePath == "./") {
      filePath = "./index.html";
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
      ".html": "text/html",
      ".m3u8": "application/vnd.apple.mpegurl",
      ".ts": "video/MP2T", // MIME type for .ts files
    };

    const contentType = mimeTypes[extname] || "application/octet-stream";

    fs.readFile(filePath, function (error, content) {
      if (error) {
        if (error.code == "ENOENT") {
          fs.readFile("./404.html", function (error, content) {
            response.writeHead(404, { "Content-Type": "text/html" });
            response.end(content, "utf-8");
          });
        } else {
          response.writeHead(500);
          response.end(
            `Sorry, check with the site admin for error: ${error.code} ..\n`
          );
        }
      } else {
        response.writeHead(200, { "Content-Type": contentType, ...headers });
        response.end(content, "utf-8");
      }
    });
  })
  .listen(PORT);
console.log(`Server listening on port ${PORT}`);
