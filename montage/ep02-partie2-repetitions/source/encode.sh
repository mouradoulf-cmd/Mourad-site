#!/bin/bash
cd "$(dirname "$0")"; FF=/usr/local/lib/python3.11/dist-packages/imageio_ffmpeg/binaries/ffmpeg-linux-x86_64-v7.0.2; VB=${VB:-750k}
$FF -loglevel error -y -i video.mp4 -c:v libx264 -b:v $VB -maxrate 2200k -bufsize 4400k -preset slow -tune animation -pass 1 -passlogfile p2 -an -f null /dev/null && \
$FF -loglevel error -y -i video.mp4 -i audio/mix.wav -map 0:v -map 1:a -c:v libx264 -b:v $VB -maxrate 2200k -bufsize 4400k -preset slow -tune animation -pass 2 -passlogfile p2 -pix_fmt yuv420p -c:a aac -b:a 112k -movflags +faststart -shortest final.mp4 && ls -la final.mp4 && echo ENC DONE
