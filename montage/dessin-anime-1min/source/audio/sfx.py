import numpy as np, wave
SR=44100; DUR=60.5; N=int(SR*DUR); L=np.zeros(N); R=np.zeros(N); rng=np.random.default_rng(5)
def put(sig,t0,pan=0.0,g=1.0):
    s=int(t0*SR); e=min(N,s+len(sig)); sig=sig[:e-s]*g; L[s:e]+=sig*(1-pan)*.7; R[s:e]+=sig*(1+pan)*.7
def tt(d): return np.arange(int(round(d*SR)))/SR
def lp(x,a): 
    y=np.empty_like(x); acc=0.0
    for i in range(len(x)): acc+=a*(x[i]-acc); y[i]=acc
    return y
def sweep(f0,f1,d,amp,decay=6):
    t=tt(d); f=f0*(f1/f0)**(t/d); return amp*np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-decay*t)*np.minimum(1,t/.005)
def noise(d): return rng.uniform(-1,1,int(round(d*SR)))
def whoosh(d=.7,amp=.25):
    t=tt(d); n=noise(d); env=np.sin(np.pi*t/d)**2
    a=.02+.25*np.sin(np.pi*t/d); y=np.empty_like(n); acc=0.0
    for i in range(len(n)): acc+=a[i]*(n[i]-acc); y[i]=acc
    return amp*y*env*3
def moo():
    d=1.3; t=tt(d); f=np.interp(t,[0,.25,1.0,1.3],[105,135,118,92]); ph=2*np.pi*np.cumsum(f)/SR
    saw=sum(np.sin(k*ph)/k for k in range(1,18))
    env=np.minimum(1,t/.12)*np.clip((d-t)/.35,0,1)
    y=lp(saw*env,.08); return .5*y/abs(y).max()
def splash():
    d=.8; t=tt(d); n=noise(d); y=lp(n,.35)-lp(n,.05); return .6*y*np.exp(-6*t)*np.minimum(1,t/.004)
def bloop(): return sweep(300,900,.25,.35,8)
def chime(notes,gap=.07,amp=.12):
    out=np.zeros(int((len(notes)*gap+1.6)*SR))
    for k,f in enumerate(notes):
        t=tt(1.5); s=int(k*gap*SR); v=amp*(np.sin(2*np.pi*f*t)+.3*np.sin(2*np.pi*f*2.76*t))*np.exp(-3.5*t); out[s:s+len(v)]+=v
    return out
def bird():
    d=.18; t=tt(d); f=np.interp(t,[0,.06,.12,.18],[3200,4200,3600,4600]); return .07*np.sin(2*np.pi*np.cumsum(f)/SR)*np.sin(np.pi*t/d)
def boing(): 
    d=.35; t=tt(d); f=200+180*np.sin(2*np.pi*9*t)*np.exp(-6*t)+t*500; return .22*np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-5*t)
def step(): return .09*lp(noise(.07),.2)*np.exp(-60*tt(.07))
# rain bed
d=6.6; r=lp(noise(d),.25)-lp(noise(d),.02)*0; t=tt(d); env=np.minimum(1,t/1.0)*np.clip((d-t)/1.0,0,1)
drops=np.zeros(len(r))
for k in range(260):
    s=rng.integers(0,len(r)-2000); drops[s:s+900]+=rng.uniform(.05,.15)*np.sin(2*np.pi*rng.uniform(1500,3000)*tt(900/SR))*np.exp(-60*tt(900/SR))
put((r*.09+drops)*env,30.3)
put(bloop(),.5); put(sweep(500,1500,.3,.2,6),1.2,pan=.3)
for tw in (5.05,20.5,44.4): put(whoosh(),tw)
for k in range(15): put(step(),8.2+k*.26,pan=-.5+k*.05)
put(moo(),16.35,pan=.4)
put(chime([1568,2093,2637,3136],.12,.08),17.6,pan=.2)
put(splash(),26.9); put(sweep(600,300,.3,.12,10),27.0)
put(chime([1047,1319,1568,2093,2637,3136],.1,.07),35.3,pan=-.2)
put(chime([2093,2637,3136,4186],.06,.09),43.3,pan=.3)
for k in range(22): put(bird(),45.8+k*.33+rng.uniform(0,.1),pan=rng.uniform(-.6,.6))
for k in range(3): put(boing(),49.2+k*.6)
put(chime([1047,1568,2093,3136],.09,.1),57.0)
pk=max(abs(L).max(),abs(R).max()); out=np.stack([L,R],1)/pk*0.8
w=wave.open('sfx.wav','wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((out*32767).astype('<i2').tobytes()); w.close(); print('sfx ok')
