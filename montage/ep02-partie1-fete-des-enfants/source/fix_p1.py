# targeted best-of-24 re-synthesis for the weakest part-1 lines (keeps old take unless the new one scores better)
import sys, os, json, shutil, hashlib, difflib, multiprocessing as mp
WD = os.path.abspath('ep2p1')
TARGETS = ['หก เจ็ด แปด เก้า สิบ', 'ต่อไปคือ ข ไข่ ไข่ที่แม่ไก่ออก', 'ชั่วโมงสุดท้าย เป็นวิชาศิลปะ', 'ใช่จ้ะ ช้างเป็นสัตว์ประจำชาติไทย', 'ถูกต้องจ้ะ เก่งมาก', 'ตอนบ่าย เป็นชั่วโมงพลศึกษา', 'สวัสดีจ้ะ นักเรียนทุกคน', 'ในที่สุด เต่าก็ชนะการแข่งขัน']
def work(k):
    os.chdir(WD); sys.path.insert(0, WD)
    src = open('build_voice.py').read().split('\ntimeline = ')[0].replace('num_threads=4', 'num_threads=1').replace('num_threads=8', 'num_threads=1').replace('__file__', repr(os.path.join(WD, 'build_voice.py')))
    g = {'__name__': 'f%d' % k}; exec(src, g); g['SF'] = os.path.join(WD, 'fix_%d.json' % k); g['ES'] = 0.95
    g['CANDS'][:] = [(ns, nw, d) for ns, nw in [(0.667, 0.8), (0.5, 0.7), (0.4, 0.6), (0.3, 0.5)] for d in (0.0, -0.05, -0.1)] * 2
    from script import SCENES
    sc = json.load(open('scores.json')); res = []
    items = [(b[0], b[1], b[2] if len(b) > 2 else None) for sid, beats in SCENES for b in beats if b[0] not in 'PKX' and b[1] in TARGETS]
    for who, text, say_o in items[k::4]:
        h = hashlib.md5((who + text + (say_o or '') + json.dumps(g['VOICE'][who]) + 'v2').encode()).hexdigest()[:10]; f = f'{who}_{h}.wav'; path = os.path.join(WD, 'vo', f)
        ref = say_o or text; old = sc.get(f); o = difflib.SequenceMatcher(None, g['norm'](ref), g['norm'](old[1])).ratio() if old and os.path.exists(path) else -1
        tmp = os.path.join(WD, 'vo', '_fx_' + f); g['synth'](who, text, tmp, say_o); n = g['SCORES'][os.path.basename(tmp)]
        if n[0] > o: shutil.move(tmp, path); res.append((f, n)); print('BETTER', round(o, 2), '->', n[0], text, flush=True)
        else: os.remove(tmp); print('KEEP', round(o, 2), n[0], text, flush=True)
    json.dump(res, open(os.path.join(WD, 'fixres_%d.json' % k), 'w'), ensure_ascii=False)
if __name__ == '__main__':
    ps = [mp.Process(target=work, args=(k,)) for k in range(4)]; [p.start() for p in ps]; [p.join() for p in ps]
    sc = json.load(open(os.path.join(WD, 'scores.json')))
    for k in range(4):
        f = os.path.join(WD, 'fixres_%d.json' % k)
        if os.path.exists(f): [sc.__setitem__(a, b) for a, b in json.load(open(f))]; os.remove(f)
        if os.path.exists(os.path.join(WD, 'fix_%d.json' % k)): os.remove(os.path.join(WD, 'fix_%d.json' % k))
    json.dump(sc, open(os.path.join(WD, 'scores.json'), 'w'), ensure_ascii=False, indent=0); print('FIX DONE')
