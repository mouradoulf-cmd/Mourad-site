"""Scene-aware Thai-flavoured score for the episode (ranat, khim, khlui, ching, thon)."""
import json, wave, numpy as np
SR = 44100
tl = json.load(open('timeline.json'))
TOTAL = tl['total'] + 1.0
N = int(SR * TOTAL); L = np.zeros(N); R = np.zeros(N)
rng = np.random.default_rng(11)
def hz(m): return 440 * 2 ** ((m - 69) / 12)
def tt(d): return np.arange(int(round(d * SR))) / SR
def ranat(m, d=1.2, a=.2, soft=False):
    t = tt(d); f = hz(m)
    v = np.sin(2*np.pi*f*t)*np.exp(-5*t) + (.25 if soft else .45)*np.sin(2*np.pi*f*3.93*t)*np.exp(-12*t) + .15*np.sin(2*np.pi*f*9.2*t)*np.exp(-25*t)
    return a * v * np.minimum(1, t/.003)
def mbox(m, d=1.8, a=.12):
    t = tt(d); f = hz(m); return a*(np.sin(2*np.pi*f*t)+.3*np.sin(2*np.pi*f*4*t)*np.exp(-6*t))*np.exp(-2.6*t)*np.minimum(1,t/.002)
def khim(m, d=1.6, a=.14):
    t = tt(d); f = hz(m)
    v = sum(k*np.sin(2*np.pi*f*h*t*(1+.0008*h))*np.exp(-(2.2+h*.9)*t) for h, k in ((1,1),(2,.5),(3,.3),(4,.15)))
    return a * v * np.minimum(1, t/.002)
def khlui(m, d, a=.1):
    t = tt(d); f = hz(m); vib = np.sin(2*np.pi*5.4*t) * np.minimum(1, t/.5) * .006
    ph = 2*np.pi*f*np.cumsum(1+vib)/SR
    env = np.minimum(1, t/.07) * np.minimum(1, (d-t)/.12)
    breath = rng.normal(0, 1, len(t)); b2 = np.convolve(breath, np.ones(12)/12, 'same') * .05
    return a * env * (np.sin(ph) + .18*np.sin(2*ph) + .06*np.sin(3*ph) + b2)
def pad(ms, d, a=.035):
    t = tt(d); env = np.minimum(1, t/1.0) * np.minimum(1, np.maximum(0, d-t)/1.0)
    return a * env * sum(np.sin(2*np.pi*hz(m)*t) + .3*np.sin(2*np.pi*hz(m)*1.003*t+1) + .12*np.sin(4*np.pi*hz(m)*t) for m in ms)
def bass(m, d=.6, a=.17):
    t = tt(d); return a*(np.sin(2*np.pi*hz(m)*t)+.25*np.sin(4*np.pi*hz(m)*t))*np.exp(-3*t)*np.minimum(1,t/.01)
def ching(a=.045, open_=True):
    d = .5 if open_ else .12; t = tt(d)
    return a * sum(np.sin(2*np.pi*f*t) for f in (3150,4410,5230,6980)) * np.exp(-(8 if open_ else 30)*t) / 4
def thon(a=.24):
    t = tt(.35); f = 120*np.exp(-8*t)+55; return a*np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-9*t)

THEME_A = [72,74,76,79, 76,74,72,None, 74,76,79,81, 79,76,74,None, 76,79,81,84, 81,79,76,74, 72,74,76,74, 72,None,None,None]
THEME_B = [79,None,76,79, 81,79,76,None, 74,76,72,74, 76,None,None,None, 81,84,81,79, 76,79,76,74, 72,74,76,79, 72,None,None,None]
LULL = [76,72,74,69, 72,67,69,None, 72,74,76,74, 72,69,72,None]
PROG = [(48,[60,64,67]),(45,[57,60,64]),(41,[53,57,60]),(43,[55,59,62])]
STYLE = {  # bpm, melody, melody instrument, extras
 'fanfare': (104, THEME_A, 'ranat', 'full'), 'morning': (84, THEME_A, 'khlui', 'arp'), 'sleepy': (60, LULL, 'mbox', 'pad'),
 'playful': (104, THEME_A, 'ranat', 'play'), 'cozy': (80, THEME_B, 'khim', 'soft'), 'travel': (96, THEME_A, 'khlui', 'travel'),
 'work': (100, THEME_B, 'ranat', 'work'), 'calm': (72, THEME_B, 'khim', 'calm'), 'joy': (108, THEME_A, 'ranat', 'full'),
 'sunset': (72, THEME_B, 'khlui', 'calm'), 'lullaby': (58, LULL, 'mbox', 'pad'), 'end': (90, THEME_A, 'ranat', 'end'),
}
def render(style, dur, seed=0):
    bpm, mel, inst, ex = STYLE[style]; B = 60/bpm; n = int((dur+2)*SR); l = np.zeros(n); r = np.zeros(n)
    def put(sig, t0, pan=0., g=1.):
        s = int(t0*SR)
        if s >= n: return
        e = min(n, s+len(sig)); sig = sig[:e-s]*g; l[s:e] += sig*(1-pan)*.7; r[s:e] += sig*(1+pan)*.7
    t = 0.; i = seed * 8
    while t < dur:
        beat = i % 4; bar = (i // 4) % 4; b, ch = PROG[bar]; m = mel[i % len(mel)]
        if beat == 0:
            put(pad(ch, 4*B+.8, .03 if ex not in ('pad', 'soft') else .04), t)
            if ex not in ('pad',): put(bass(b, 2*B, .15), t); put(bass(b+7, B, .08), t+2*B)
        if m is not None:
            if inst == 'ranat': put(ranat(m, 1.2, .17 if ex != 'soft' else .12), t, -.25)
            elif inst == 'khim': put(khim(m, 1.6, .13), t, -.2)
            elif inst == 'mbox': put(mbox(m+12, 2.2, .11), t, -.1)
            elif inst == 'khlui':
                ln = 1
                while mel[(i+ln) % len(mel)] is None and ln < 3: ln += 1
                put(khlui(m, B*ln*.95+.05, .09), t, -.15)
        if ex in ('arp', 'calm', 'soft') and beat % 2 == 0:
            for k, mm in enumerate(ch): put(khim(mm+12, 1.2, .045 if ex != 'calm' else .05), t + k*B/3, .3)
        if ex in ('play', 'full', 'travel', 'work', 'end'):
            put(ching(.04, open_=(beat % 2 == 1)), t, .4)
            if ex in ('full', 'work', 'travel') and beat in (0, 2): put(thon(.2 if ex != 'travel' else .16), t)
            if ex == 'play' and beat == 0: put(thon(.14), t)
            if ex in ('play', 'full'): put(khim(mel[(i+3) % len(mel)] or 67, .9, .05), t+B/2, .35)
        if ex == 'travel' and beat % 2 == 1: put(ranat((mel[(i+2) % len(mel)] or 76)+12, .8, .05, True), t+B/2, .4)
        t += B; i += 1
    e = np.ones(n); tt_ = np.arange(n)/SR; e *= np.minimum(1, tt_/.8); e *= np.clip((dur+1.2-tt_)/1.4, 0, 1)
    return l*e, r*e

SCENE_STYLE = {'title': [('fanfare', None, None)], 'recap': [('calm', None, None)], 'saturday': [('morning', None, None)], 'lesson': [('work', None, None)], 'mud': [('playful', None, None)], 'thuiwash': [('playful', None, None)], 'lines': [('cozy', None, None)], 'market': [('travel', None, None)], 'costume': [('cozy', None, 'wear'), ('joy', 'wear', None)], 'kaew': [('cozy', None, None)], 'ton': [('playful', None, None)], 'monday': [('playful', None, None)], 'rehearse': [('calm', None, None)], 'stagek': [('cozy', None, None)], 'staget': [('playful', None, None)], 'stageb': [('calm', None, 'forget'), ('sleepy', 'forget', None)], 'breathe': [('sleepy', None, 'smile'), ('calm', 'smile', None)], 'rain': [('calm', None, 'dark'), ('sleepy', 'dark', None)], 'shelter': [('sleepy', None, 'yes'), ('joy', 'yes', None)], 'rainbow': [('sleepy', None, 'bow'), ('joy', 'bow', None)], 'paddy': [('sunset', None, None)], 'practice': [('cozy', None, None)], 'props': [('playful', None, None)], 'final': [('joy', None, None)], 'decorate': [('sunset', None, None)], 'bed': [('lullaby', None, None)], 'end': [('end', None, None)]}
for k, sc in enumerate(tl['scenes']):
    for j, (st, a, b) in enumerate(SCENE_STYLE[sc['id']]):
        s0 = sc['start'] + (sc['marks'][a] if a else 0); s1 = sc['start'] + (sc['marks'][b] if b else sc['dur'])
        l, r = render(st, s1 - s0, seed=k + j)
        st_i = int(max(0, s0 - .4) * SR); e = min(N, st_i + len(l)); L[st_i:e] += l[:e-st_i]; R[st_i:e] += r[:e-st_i]
# final ending chord under the end card
endc = tl['scenes'][-1]; t0 = endc['start'] + .3
for k, m in enumerate([60, 64, 67, 72, 76, 79, 84]):
    s = ranat(m, 3.0, .15); st_i = int((t0 + k*.08)*SR); L[st_i:st_i+len(s)] += s*.7; R[st_i:st_i+len(s)] += s*.7
tt_ = np.arange(N)/SR; g = np.clip((TOTAL - .2 - tt_)/1.5, 0, 1); L *= g; R *= g
pk = max(abs(L).max(), abs(R).max()); out = np.stack([L, R], 1)/pk*.8
w = wave.open('audio/music.wav', 'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((out*32767).astype('<i2').tobytes()); w.close()
print('music', round(TOTAL, 1), 's')
