# parallel pre-synthesis: python3 par_synth.py <workdir> <nworkers>
import sys, os, json, hashlib, multiprocessing as mp
WD = os.path.abspath(sys.argv[1]); NW = int(sys.argv[2]) if len(sys.argv) > 2 else 3
def work(k):
    os.chdir(WD); sys.path.insert(0, WD)
    src = open('build_voice.py').read().split('\ntimeline = ')[0]
    src = src.replace('num_threads=4', 'num_threads=1').replace('num_threads=8', 'num_threads=1').replace("__file__", repr(os.path.join(WD, 'build_voice.py')))
    g = {'__name__': 'w%d' % k}; exec(src, g)
    g['SF'] = os.path.join(WD, 'scores_%d.json' % k); g['ES'] = 0.9; g['CANDS'][:] = g['CANDS'][:8]
    from script import SCENES
    items = []
    for sid, beats in SCENES:
        for b in beats:
            if b[0] in ('P', 'K', 'X'): continue
            who, text = b[0], b[1]; say_o = b[2] if len(b) > 2 else None
            h = hashlib.md5((who + text + (say_o or '') + json.dumps(g['VOICE'][who]) + 'v2').encode()).hexdigest()[:10]
            path = os.path.join(WD, 'vo', f'{who}_{h}.wav')
            if not os.path.exists(path) and (who, text, say_o, path) not in items: items.append((who, text, say_o, path))
    mine = items[k::NW]
    for i, (who, text, say_o, path) in enumerate(mine):
        g['synth'](who, text, path, say_o); print(f'w{k} {i+1}/{len(mine)} {g["SCORES"][os.path.basename(path)][0]} {text}', flush=True)
if __name__ == '__main__':
    ps = [mp.Process(target=work, args=(k,)) for k in range(NW)]
    [p.start() for p in ps]; [p.join() for p in ps]
    sc = json.load(open(os.path.join(WD, 'scores.json'))) if os.path.exists(os.path.join(WD, 'scores.json')) else {}
    for k in range(NW):
        f = os.path.join(WD, 'scores_%d.json' % k)
        if os.path.exists(f): sc.update(json.load(open(f))); os.remove(f)
    json.dump(sc, open(os.path.join(WD, 'scores.json'), 'w'), ensure_ascii=False, indent=0); print('PAR DONE')
