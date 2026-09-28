import json, os, subprocess, wave, struct, hashlib, sys
import sherpa_onnx
from script import SCENES, GAP

FF = '/usr/local/lib/python3.11/dist-packages/imageio_ffmpeg/binaries/ffmpeg-linux-x86_64-v7.0.2'
MODEL = os.path.join(os.path.dirname(__file__), '..', 'mont', 'vits-mms-tha')
OUT = os.path.join(os.path.dirname(__file__), 'vo')
os.makedirs(OUT, exist_ok=True)

REPL = {'เล็กๆ': 'เล็กเล็ก', 'ใสๆ': 'ใสใส', 'เบาๆ': 'เบาเบา', 'ค่อยๆ': 'ค่อยค่อย', 'เยอะๆ': 'เยอะเยอะ',
        'ไวๆ': 'ไวไว', 'จริงๆ': 'จริงจริง', 'เด็กๆ': 'เด็กเด็ก', 'หลานๆ': 'หลานหลาน', 'เรื่อยๆ': 'เรื่อยเรื่อย', 'ยาวๆ': 'ยาวยาว', 'ตรงๆ': 'ตรงตรง', 'ช้าๆ': 'ช้าช้า', 'ลึกๆ': 'ลึกลึก', 'สู้ๆ': 'สู้สู้', 'ดีๆ': 'ดีดี', 'แน่ๆ': 'แน่แน่', 'ต่างๆ': 'ต่างต่าง', 'น่ารักๆ': 'น่ารักน่ารัก', 'พี่ๆ': 'พี่พี่'}
def say_text(t):
    for a, b in REPL.items(): t = t.replace(a, b)
    assert 'ๆ' not in t, t
    return t.replace('ำ', 'ํา')

VOICE = {  # tts speed, ffmpeg voice chain
 'N': (0.92, 'anull'),
 'B': (0.95, 'asetrate=16000*1.30,aresample=16000,atempo=0.85'),
 'F': (0.97, 'asetrate=16000*0.84,aresample=16000,atempo=1.12'),
 'M': (0.95, 'asetrate=16000*1.14,aresample=16000,atempo=0.92'),
 'T': (0.92, 'asetrate=16000*1.20,aresample=16000,atempo=0.90'),
 'G': (0.95, 'asetrate=16000*1.42,aresample=16000,atempo=0.80'),
 'O': (0.95, 'asetrate=16000*1.22,aresample=16000,atempo=0.88'),
 'Y': (0.88, 'asetrate=16000*1.06,aresample=16000,atempo=0.93'),
 'C': (0.92, 'CHORUS'),
}
import numpy as np, difflib, re
TTS = {}
REC = None
DIG = {'10':'สิบ','1':'หนึ่ง','2':'สอง','3':'สาม','4':'สี่','5':'ห้า','6':'หก','7':'เจ็ด','8':'แปด','9':'เก้า','0':'ศูนย์'}
def norm(t):
    for k,v in DIG.items(): t=t.replace(k,v)
    return re.sub(r'[\s!?.,ๆ"\'\-ชภ]','',t)
def get_tts(ns, nw):
    if (ns,nw) not in TTS:
        TTS[(ns,nw)] = sherpa_onnx.OfflineTts(sherpa_onnx.OfflineTtsConfig(model=sherpa_onnx.OfflineTtsModelConfig(vits=sherpa_onnx.OfflineTtsVitsModelConfig(
            model=f'{MODEL}/model.onnx', tokens=f'{MODEL}/tokens.txt', noise_scale=ns, noise_scale_w=nw), num_threads=4)))
    return TTS[(ns,nw)]
def asr(x, sr):
    global REC
    if REC is None:
        A=os.path.join(os.path.dirname(__file__),'..','asr','sherpa-onnx-whisper-small')+'/'
        REC=sherpa_onnx.OfflineRecognizer.from_whisper(encoder=A+'small-encoder.int8.onnx',decoder=A+'small-decoder.int8.onnx',tokens=A+'small-tokens.txt',language='th',num_threads=8)
    pad=np.zeros(int(sr*.8),np.float32); st=REC.create_stream(); st.accept_waveform(sr,np.concatenate([pad,x,pad])); REC.decode_stream(st); return st.result.text.strip()
CANDS=[(0.667,0.8,0.0),(0.5,0.7,0.0),(0.4,0.6,0.0),(0.667,0.8,-0.05),(0.5,0.7,-0.05),(0.4,0.6,-0.05)]*2+[(0.3,0.5,-0.08),(0.3,0.5,0.0)]
SCORES={}
ES=0.93
SF=os.path.join(os.path.dirname(os.path.abspath(__file__)),'scores.json')
def synth(who, text, path, say_override=None):
    ref=say_override or text; say=say_text(ref); best=None
    for ns,nw,dsp in CANDS:
        a=get_tts(ns,nw).generate(say, sid=0, speed=VOICE[who][0]+dsp); x=np.array(a.samples,np.float32)
        h=asr(x,a.sample_rate); sc=difflib.SequenceMatcher(None,norm(ref),norm(h)).ratio()
        if best is None or sc>best[0]+1e-9: best=(sc,x,a.sample_rate,h)
        if sc>=ES: break
    sc,x,sr,h=best; SCORES[os.path.basename(path)]=(round(sc,3),h)
    raw = path + '.raw.wav'
    w = wave.open(raw, 'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr)
    w.writeframes((np.clip(x,-1,1)*32767).astype('<i2').tobytes()); w.close()
    chain = VOICE[who][1] + ',silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.02,areverse,' \
            'silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.05,areverse,' \
            'loudnorm=I=-18:TP=-2:LRA=7,aresample=44100'
    if who == 'C':
        parts = []
        for k, v in enumerate(('B', 'G', 'O')):
            pp = f'{path}.{v}.wav'; ch = VOICE[v][1] + ',silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.02,areverse,silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.05,areverse,aresample=44100' + (f',adelay={k*35}' if k else '')
            subprocess.run([FF, '-loglevel', 'error', '-y', '-i', raw, '-af', ch, '-ac', '1', pp], check=True); parts.append(pp)
        subprocess.run([FF, '-loglevel', 'error', '-y'] + sum([['-i', q] for q in parts], []) + ['-filter_complex', 'amix=inputs=3:normalize=0,loudnorm=I=-18:TP=-2:LRA=7,aresample=44100', '-ac', '1', path], check=True)
        for q in parts: os.remove(q)
    else:
        subprocess.run([FF, '-loglevel', 'error', '-y', '-i', raw, '-af', chain, '-ac', '1', path], check=True)
    os.remove(raw)
    old=json.load(open(SF)) if os.path.exists(SF) else {}; old.update(SCORES); json.dump(old, open(SF,'w'), ensure_ascii=False, indent=0)

def dur(path):
    w = wave.open(path); d = w.getnframes() / w.getframerate(); w.close(); return d

timeline = {'scenes': [], 'lines': [], 'sfx': []}
T = 0.0; n = 0
for sid, beats in SCENES:
    sc = {'id': sid, 'start': round(T, 3), 'marks': {}, 'lines': []}
    t = 0.0
    for b in beats:
        k = b[0]
        if k == 'P': t += b[1]
        elif k == 'K': sc['marks'][b[1]] = round(t, 3)
        elif k == 'X': timeline['sfx'].append({'name': b[1], 't': round(T + t, 3)})
        else:
            who, text = b[0], b[1]; say_o = b[2] if len(b) > 2 else None
            h = hashlib.md5((who + text + (say_o or '') + json.dumps(VOICE[who]) + 'v2').encode()).hexdigest()[:10]
            path = f'{OUT}/{who}_{h}.wav'
            if not os.path.exists(path): synth(who, text, path, say_o)
            d = dur(path)
            ln = {'i': n, 'who': who, 'text': text, 't': round(t, 3), 'd': round(d, 3), 'file': os.path.basename(path)}
            sc['lines'].append(ln)
            timeline['lines'].append({**ln, 'T': round(T + t, 3), 'scene': sid})
            t += d + GAP; n += 1
    sc['dur'] = round(t, 3)
    timeline['scenes'].append(sc)
    T += t
timeline['total'] = round(T, 3)
json.dump(timeline, open(os.path.join(os.path.dirname(__file__), 'timeline.json'), 'w'), ensure_ascii=False, indent=1)
for sc in timeline['scenes']: print(f"{sc['id']:10s} start {sc['start']:7.2f}  dur {sc['dur']:6.2f}  lines {len(sc['lines'])}")
print('TOTAL', round(T, 2), 's =', round(T / 60, 2), 'min; lines', n)
