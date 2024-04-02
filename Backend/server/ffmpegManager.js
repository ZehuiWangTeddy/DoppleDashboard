require('dotenv').config({ path: '../../credentials.env' });
const { spawn } = require('child_process');

//Add the reolink camera links
const cameraStreams = [
  { id: 'cam1', rtspUrl: `rtsp://admin:${process.env.CAMERA_PASS}@192.168.1.22:554/h265Preview_01_main`, outputPath: './cams/cam1-videos/index.m3u8' },
  //{ id: 'cam2', rtspUrl: `rtsp://admin:${process.env.CAMERA_PASS}@192.168.1.22:554/h265Preview_01_main`, outputPath: './cams/cam2-videos/index.m3u8' },
  //{ id: 'cam3', rtspUrl: `rtsp://admin:${process.env.CAMERA_PASS}@192.168.1.22:554/h265Preview_01_main`, outputPath: './cams/cam3-videos/index.m3u8' },
  //{ id: 'cam4', rtspUrl: `rtsp://admin:${process.env.CAMERA_PASS}@192.168.1.22:554/h265Preview_01_main`, outputPath: './cams/cam3-videos/index.m3u8' },
];
//ffmpeg command to encode the stream to hls
function startFFmpegProcess(rtspUrl, outputPath) {
  const ffmpegProcess = spawn('ffmpeg', [
    '-rtsp_transport', 'tcp',
    '-i', rtspUrl,
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
  ]);

  ffmpegProcess.stderr.on('data', (data) => {
    console.error(`FFmpeg stderr: ${data}`);
  });

  ffmpegProcess.on('close', (code) => {
    console.log(`FFmpeg process for ${rtspUrl} exited with code ${code}`);
  });
}

cameraStreams.forEach(stream => startFFmpegProcess(stream.rtspUrl, stream.outputPath));

console.log('FFmpeg processes have been started for all camera streams.');
