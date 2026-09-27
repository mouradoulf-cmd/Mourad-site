#!/bin/bash
# renders the whole episode in parallel chunks, then concatenates
set -e
cd "$(dirname "$0")"
export PW=$(npm root -g)/playwright FF=/usr/local/lib/python3.11/dist-packages/imageio_ffmpeg/binaries/ffmpeg-linux-x86_64-v7.0.2
python3 -c "import json;open('web/timeline.js','w').write('window.TIMELINE='+json.dumps(json.load(open('timeline.json')),ensure_ascii=False)+';')"
TOTAL=$(python3 -c "import json;print(round(json.load(open('timeline.json'))['total']*30))")
CH=${CHUNK:-1500}; PAR=${PAR:-3}; mkdir -p seg
i=0; jobs_list=()
for ((s=0; s<TOTAL; s+=CH)); do e=$((s+CH)); [ $e -gt $TOTAL ] && e=$TOTAL; n=$(printf "seg/s%03d.mp4" $i)
  if [ ! -f "$n" ] || [ -n "$FORCE" ]; then node render_ep.js $s $e $n & fi
  i=$((i+1)); while [ $(jobs -r | wc -l) -ge $PAR ]; do sleep 2; done
done
wait
ls seg/s*.mp4 | sort | sed "s/^/file '/; s/$/'/" > seg/list.txt
$FF -loglevel error -y -f concat -safe 0 -i seg/list.txt -c copy video.mp4
echo "video frames: $($FF -hide_banner -i video.mp4 2>&1 | grep Duration)"
