"""Sound effects + ambiences placed from timeline cues and scene marks."""
import json, wave, numpy as np
SR = 44100
tl = json.load(open('timeline.json')); TOTAL = tl['total'] + 1.0
N = int(SR * TOTAL); L = np.zeros(N); R = np.zeros(N); rng = np.random.default_rng(5)
def tt(d): return np.arange(int(round(d * SR))) / SR
def noise(d): return rng.uniform(-1, 1, int(round(d * SR)))
def lp(x, a):
    y = np.empty_like(x); acc = 0.0
    for i in range(len(x)): acc += a * (x[i] - acc); y[i] = acc
    return y
def bp(x, f, q=4):  # simple 2-pole resonator
    w = 2*np.pi*f/SR; r = 1 - w/q; a1 = -2*r*np.cos(w); a2 = r*r; y = np.zeros_like(x)
    for i in range(2, len(x)): y[i] = x[i] - a1*y[i-1] - a2*y[i-2]
    return y * (1-r)
def put(sig, t0, pan=0., g=1.):
    s = int(t0 * SR)
    if s < 0: sig = sig[-s:]; s = 0
    e = min(N, s + len(sig))
    if e <= s: return
    sig = sig[:e-s] * g; L[s:e] += sig * (1-pan) * .7; R[s:e] += sig * (1+pan) * .7
def sweep(f0, f1, d, a, dec=6):
    t = tt(d); f = f0 * (f1/f0) ** (t/d); return a*np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-dec*t)*np.minimum(1, t/.005)
def saw_contour(pts, d, harm=14):
    t = tt(d); f = np.interp(t, [p[0] for p in pts], [p[1] for p in pts]); ph = 2*np.pi*np.cumsum(f)/SR
    return sum(np.sin(k*ph)/k for k in range(1, harm))
def rooster():
    segs = [(.0, .18, [(0, 520), (.18, 640)]), (.2, .16, [(0, 600), (.16, 700)]), (.38, .22, [(0, 700), (.22, 820)]), (.62, .9, [(0, 820), (.3, 900), (.9, 640)])]
    out = np.zeros(int(1.6*SR))
    for st, d, pts in segs:
        s = saw_contour(pts, d); env = np.minimum(1, tt(d)/.03) * np.clip((d - tt(d))/.08, 0, 1); s = bp(s*env, 1400, 3) + .4*bp(s*env, 2600, 4)
        i = int(st*SR); out[i:i+len(s)] += s
    return .5*out/np.abs(out).max()
def moo():
    d = 1.3; t = tt(d); s = saw_contour([(0, 105), (.25, 135), (1.0, 118), (1.3, 92)], d, 18)
    env = np.minimum(1, t/.12)*np.clip((d-t)/.35, 0, 1); y = lp(s*env, .08); return .5*y/np.abs(y).max()
def bark():
    out = np.zeros(int(.5*SR))
    for k, st in enumerate((0, .2)):
        d = .14; t = tt(d); s = saw_contour([(0, 520), (d, 360)], d, 10) + .5*noise(d)
        y = bp(s*np.exp(-14*t)*np.minimum(1, t/.004), 900, 2.5); i = int(st*SR); out[i:i+len(y)] += y
    return .45*out/np.abs(out).max()
def quack():
    out = np.zeros(int(.6*SR))
    for st in (0, .25):
        d = .18; t = tt(d); s = saw_contour([(0, 300), (d, 230)], d, 20); y = bp(s*np.exp(-8*t)*np.minimum(1, t/.006), 1100, 3)
        i = int(st*SR); out[i:i+len(y)] += y
    return .35*out/np.abs(out).max()
def peep(): d = .09; t = tt(d); f = np.interp(t, [0, d], [3000, 4300]); return .05*np.sin(2*np.pi*np.cumsum(f)/SR)*np.sin(np.pi*t/d)
def bird(): d = .18; t = tt(d); f = np.interp(t, [0, .06, .12, .18], [3200, 4200, 3600, 4600]); return .05*np.sin(2*np.pi*np.cumsum(f)/SR)*np.sin(np.pi*t/d)
def splash(): d = .8; t = tt(d); n = noise(d); y = lp(n, .35) - lp(n, .05); return .5*y*np.exp(-6*t)*np.minimum(1, t/.004)
def plop(): return sweep(700, 260, .22, .22, 12) + .15*lp(noise(.1), .3)*np.exp(-40*tt(.1))[:int(round(.1*SR))].sum()*0
def pop(): return sweep(300, 900, .2, .25, 9)
def boing(): d = .35; t = tt(d); f = 200 + 180*np.sin(2*np.pi*9*t)*np.exp(-6*t) + t*500; return .2*np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-5*t)
def chime(notes, gap=.07, a=.1):
    out = np.zeros(int((len(notes)*gap + 1.6)*SR))
    for k, f in enumerate(notes): t = tt(1.5); s = int(k*gap*SR); v = a*(np.sin(2*np.pi*f*t)+.3*np.sin(2*np.pi*f*2.76*t))*np.exp(-3.5*t); out[s:s+len(v)] += v
    return out
def whoosh(d=.8, a=.16):
    t = tt(d); n = noise(d); env = np.sin(np.pi*t/d)**2; k = .02 + .25*np.sin(np.pi*t/d); y = np.empty_like(n); acc = 0.
    for i in range(len(n)): acc += k[i]*(n[i]-acc); y[i] = acc
    return a*y*env*3
def grain(): out = np.zeros(int(.8*SR)); [out.__setitem__(slice(int(s*SR), int(s*SR)+400), out[int(s*SR):int(s*SR)+400] + .04*noise(400/SR)*np.exp(-30*tt(400/SR))) for s in rng.uniform(.1, .7, 30)]; return out
def brush(d): t = tt(d); n = lp(noise(d), .5) - lp(noise(d), .1); return .06*n*(.5+.5*np.sin(2*np.pi*7*t))
def wind(d, a=.05): t = tt(d); y = lp(noise(d), .01); env = np.minimum(1, t/1)*np.clip((d-t)/1, 0, 1)*(.6+.4*np.sin(2*np.pi*.3*t)); return a*y/np.abs(y).max()*env*3
def water(d, a=.03): t = tt(d); y = lp(noise(d), .12) - lp(noise(d), .03); env = np.minimum(1, t/1)*np.clip((d-t)/1, 0, 1); return a*y/np.abs(y).max()*env
def crickets(d, a=.018):
    t = tt(d); c = np.sin(2*np.pi*4600*t)*(np.sin(2*np.pi*28*t) > .3)*(np.sin(2*np.pi*.9*t) > -.2); env = np.minimum(1, t/1.5)*np.clip((d-t)/1.5, 0, 1); return a*c*env
def steps(t0, t1, dt, a=.05, f=.2):
    t = t0
    while t < t1: put(a*lp(noise(.07), f)*np.exp(-60*tt(.07)), t, rng.uniform(-.2, .2)); t += dt
def birds_amb(t0, t1, dens=1.2):
    t = t0 + rng.uniform(0, 1)
    while t < t1:
        for k in range(rng.integers(1, 4)): put(bird(), t + k*.14, rng.uniform(-.7, .7), .8)
        t += rng.uniform(1/dens, 2/dens)
LIB = {'rooster': rooster, 'moo': moo, 'bark': bark, 'quack': quack, 'splash': splash, 'plop': lambda: sweep(700, 260, .22, .22, 12), 'sparkle': lambda: chime([2093, 2637, 3136, 4186], .06, .09),
       'boing': boing, 'grain': grain, 'wind': lambda: whoosh(1.6, .2)}
for cue in tl['sfx']: put(LIB[cue['name']](), cue['t'], 0.)
S = {s['id']: s for s in tl['scenes']}
A = lambda sid, m: S[sid]['start'] + S[sid]['marks'][m]
st = lambda sid: S[sid]['start']; en = lambda sid: S[sid]['start'] + S[sid]['dur']
for s in tl['scenes'][1:]: put(whoosh(.7, .07), s['start'] - .55)
put(pop(), .5); put(chime([1047, 1319, 1568, 2093], .08, .08), 1.3)
birds_amb(st('dawn'), A('dawn', 'cut'), 1.5); birds_amb(st('wash'), en('wash'), .8); birds_amb(st('animals'), en('garden'), .7)
birds_amb(st('thui'), en('path'), .8); birds_amb(st('work'), en('fish'), .5); birds_amb(st('kite'), en('kite'), .4)
steps(st('wash') + .3, st('wash') + 4.5, .28)
put(brush(2.6), A('wash', 'brush') + .4)
for i in range(22): put(peep(), A('animals', 'throw') + 1.0 + i*.9 + rng.uniform(0, .3), rng.uniform(-.3, .5))
for i in range(5): put(pop(), A('animals', 'count') + i*S['animals']['lines'][[l['text'].startswith('หนึ่ง') for l in S['animals']['lines']].index(True)]['d']/5*.98, 0, .5)
for m in ('chili', 'eggplant', 'beans'): put(pop(), A('garden', m), 0, .6); put(chime([1568, 2093], .06, .05), A('garden', m) + 1.0)
put(boing(), A('thui', 'climb') - .2); steps(A('thui', 'go'), en('thui'), .32, .07, .1)
steps(st('path'), en('path'), .34, .05, .1); put(water(S['path']['dur'], .025), st('path'))
put(water(S['work']['dur'], .02), st('work'))
put(wind(S['lunch']['dur'], .045), st('lunch'))
put(water(S['fish']['dur'], .03), st('fish'))
put(wind(S['kite']['dur'], .06), st('kite')); put(chime([1047, 1319, 1568, 2093, 2637], .09, .07), A('kite', 'up'))
birds_amb(st('sunset'), en('sunset') - 2, .5)
put(crickets(en('bed') - st('dinner') + 4), st('dinner')); put(chime([2093, 2637, 3136], .08, .06), st('dinner') + 1.5)
put(chime([1568, 1319, 1047, 784], .14, .06), A('bed', 'sleep') + .5)
for k in range(3): put(boing(), A('kite', 'up') + 5.5 + k*.45)
L = np.nan_to_num(L); R = np.nan_to_num(R); pk = max(abs(L).max(), abs(R).max()); out = np.stack([L, R], 1)/pk*.8
w = wave.open('audio/sfx.wav', 'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((out*32767).astype('<i2').tobytes()); w.close(); print('sfx ok')
