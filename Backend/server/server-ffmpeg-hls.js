const http = require('http');
const fs = require('fs');
const { spawn } = require('child_process');
const PORT = 3000;

function ensureDirectoryExists(directoryPath) {
    if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath, { recursive: true });
    }
}

function startFFmpegStream(inputUrl, outputPath, streamId) {
    ensureDirectoryExists(outputPath.substring(0, outputPath.lastIndexOf('/')));

    const ffmpegCommand = 'ffmpeg';
    const ffmpegArgs = [
        '-rtsp_transport', 'tcp',
        '-i', inputUrl,
        '-fflags', 'flush_packets',
        '-max_delay', '500000',
        '-flags', '+global_header',
        '-hls_time', '1',
        '-hls_list_size', '20',
        '-c:v', 'libx264',
        '-c:a', 'copy',
        '-b:v', '2000k',
        '-preset', 'faster',
        '-tune', 'zerolatency',
        '-x264-params', 'keyint=15:min-keyint=15',
        '-hls_flags', 'delete_segments+append_list',
        '-http_persistent', '0',
        '-probesize', '32',
        '-analyzeduration', '0',
        '-y', outputPath
    ];

    const ffmpegProcess = spawn(ffmpegCommand, ffmpegArgs);

    ffmpegProcess.stderr.on('data', (data) => {
        console.log(`FFmpeg stderr [${streamId}]: ${data}`);
    });

    ffmpegProcess.on('close', (code) => {
        console.log(`FFmpeg process [${streamId}] exited with code ${code}`);
    });
}

// Update these RTSP URLs and output paths for your actual camera feeds and desired output directories
startFFmpegStream("rtsp://admin:Dopple700@192.168.1.22:554/h265Preview_01_main", "./cams/cam1-videos/index.m3u8", "Camera 1");
startFFmpegStream("rtsp://admin:Dopple700@192.168.0.110:554/h264Preview_01_sub", "./cams/cam2-videos/index.m3u8", "Camera 2");
// Assuming RTSP URLs and output paths for cameras 3 to 5 are known and follow a similar pattern
startFFmpegStream("rtsp://admin:Dopple700@192.168.1.22:554/h265Preview_01_main", "./cams/cam3-videos/index.m3u8", "Camera 3");
startFFmpegStream("rtsp://admin:Dopple700@192.168.1.22:554/h265Preview_01_main", "./cams/cam4-videos/index.m3u8", "Camera 4");
startFFmpegStream("rtsp://admin:Dopple700@192.168.1.22:554/h265Preview_01_main", "./cams/cam5-videos/index.m3u8", "Camera 5");

http.createServer(function (request, response) {
    console.log('Request starting...', new Date());

    // Determine the base path based on the URL
    let basePath;
    if (request.url.startsWith('/cam2-videos')) basePath = './cams/cam2-videos';
    else if (request.url.startsWith('/cam3-videos')) basePath = './cams/cam3-videos';
    else if (request.url.startsWith('/cam4-videos')) basePath = './cams/cam4-videos';
    else if (request.url.startsWith('/cam5-videos')) basePath = './cams/cam5-videos';
    else basePath = './cams/cam1-videos'; // Default to camera 1

    var filePath = basePath + request.url.split('/').pop();
    console.log(filePath);

    fs.readFile(filePath, function (error, content) {
        if (error) {
            if (error.code === 'ENOENT') {
                response.writeHead(404);
                response.end('Not found');
                return; // Ensure function execution stops here
            } else {
                response.writeHead(500);
                response.end('Server error: ' + error.code);
                return; // Ensure function execution stops here
            }
        }
        response.writeHead(200, { 'Content-Type': 'application/vnd.apple.mpegurl', 'Access-Control-Allow-Origin': '*' });
        response.end(content, 'utf-8');
    });
}).listen(PORT);
console.log(`Server listening on PORT ${PORT}`);