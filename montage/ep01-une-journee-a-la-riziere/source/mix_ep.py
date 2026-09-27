"""voice track from timeline + final mix (ducking, -14 LUFS)."""
import json, wave, subprocess, numpy as np
FF = '/usr/local/lib/python3.11/dist-packages/imageio_ffmpeg/binaries/ffmpeg-linux-x86_64-v7.0.2'
SR = 44100; tl = json.load(open('timeline.json')); N = int(SR * (tl['total'] + 1.0)); V = np.zeros(N)
GAIN = {'N': 1.0, 'B': 1.05, 'F': 1.0, 'M': 1.0}
for ln in tl['lines']:
    w = wave.open('vo/' + ln['file']); assert w.getframerate() == SR and w.getnchannels() == 1
    x = np.frombuffer(w.readframes(w.getnframes()), '<i2').astype(np.float32) / 32768; w.close()
    s = int(round(ln['T'] * SR)); V[s:s + len(x)] += x * GAIN[ln['who']]
w = wave.open('audio/voice.wav', 'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(V, -1, 1) * 32767).astype('<i2').tobytes()); w.close()
fc = ("[0:a]aformat=channel_layouts=stereo,aecho=0.8:0.6:40:0.1,volume=2.4,asplit=2[v][vk];[1:a]volume=0.62[m];[m][vk]sidechaincompress=threshold=0.025:ratio=5:attack=40:release=500[md];"
      "[2:a]volume=0.55[s];[v][md][s]amix=inputs=3:normalize=0[a]")
subprocess.run([FF, '-loglevel', 'error', '-y', '-i', 'audio/voice.wav', '-i', 'audio/music.wav', '-i', 'audio/sfx.wav', '-filter_complex', fc, '-map', '[a]', '-ar', '48000', 'audio/pre.wav'], check=True)
out = subprocess.run([FF, '-hide_banner', '-i', 'audio/pre.wav', '-af', 'ebur128', '-f', 'null', '-'], capture_output=True, text=True).stderr
I = float([l for l in out.splitlines() if l.strip().startswith('I:')][-1].split()[1]); g = -14 - I
subprocess.run([FF, '-loglevel', 'error', '-y', '-i', 'audio/pre.wav', '-af', f'volume={g}dB,alimiter=limit=0.89:level=false', 'audio/mix.wav'], check=True)
print('mix ok, gain', round(g, 2))
