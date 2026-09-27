import numpy as np, wave
SR=44100; DUR=60.5; N=int(SR*DUR); L=np.zeros(N); R=np.zeros(N)
rng=np.random.default_rng(3)
def hz(m): return 440*2**((m-69)/12)
def put(sig,t0,pan=0.0,g=1.0):
    s=int(t0*SR); e=min(N,s+len(sig)); 
    if s>=N: return
    sig=sig[:e-s]*g; L[s:e]+=sig*(1-pan)*0.7; R[s:e]+=sig*(1+pan)*0.7
def ranat(m,dur=1.2,amp=.22):  # xylophone
    t=np.arange(int(dur*SR))/SR; f=hz(m)
    v=np.sin(2*np.pi*f*t)*np.exp(-5*t)+.45*np.sin(2*np.pi*f*3.93*t)*np.exp(-12*t)+.2*np.sin(2*np.pi*f*9.2*t)*np.exp(-25*t)
    return amp*v*np.minimum(1,t/.003)
def khim(m,dur=1.6,amp=.16):  # hammered dulcimer
    t=np.arange(int(dur*SR))/SR; f=hz(m)
    v=sum(a*np.sin(2*np.pi*f*k*t*(1+.0008*k))*np.exp(-(2.2+k*.9)*t) for k,a in ((1,1),(2,.5),(3,.3),(4,.15)))
    return amp*v*np.minimum(1,t/.002)
def pad(ms,dur,amp=.05):
    t=np.arange(int(dur*SR))/SR; env=np.minimum(1,t/1.0)*np.minimum(1,(dur-t)/1.0)
    return amp*env*sum(np.sin(2*np.pi*hz(m)*t)+.3*np.sin(2*np.pi*hz(m)*1.003*t+1)+.15*np.sin(4*np.pi*hz(m)*t) for m in ms)
def bass(m,dur=.5,amp=.2):
    t=np.arange(int(dur*SR))/SR; return amp*(np.sin(2*np.pi*hz(m)*t)+.25*np.sin(4*np.pi*hz(m)*t))*np.exp(-3*t)*np.minimum(1,t/.01)
def ching(amp=.05,open_=True):
    d=.5 if open_ else .12; t=np.arange(int(d*SR))/SR
    v=sum(np.sin(2*np.pi*f*t) for f in (3150,4410,5230,6980))*np.exp(-(8 if open_ else 30)*t)/4
    return amp*v
def thon(amp=.28):
    t=np.arange(int(.35*SR))/SR; f=120*np.exp(-8*t)+55
    return amp*np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-9*t)
B=0.6
# chord progression (C major pentatonic flavour)
prog=[(48,[60,64,67]),(45,[57,60,64]),(43,[55,59,62]),(48,[60,64,67])]
theme=[72,74,76,79,76,74,72,74, 76,79,81,79,76,74,76,None, 79,81,84,81,79,76,74,76, 72,74,76,74,72,None,72,None]
def section(t0,t1,full=True,mel=True,amp=1.0,inst=ranat,perc=True,octave=0):
    t=t0;i=0
    while t<t1-0.01:
        bar=int((t-t0)/(4*B))%4
        if abs(((t-t0)/B)%4)<1e-6:
            b,ch=prog[bar]; put(bass(b+12*0,2*B,.18*amp),t); put(bass(b+7,B,.1*amp),t+2*B)
            put(pad(ch,4*B+.6,.035*amp),t,pan=0)
        if mel:
            m=theme[i%len(theme)]
            if m: put(inst(m+octave,amp=.2*amp),t,pan=-.25)
        if full and i%2==1: put(khim(theme[(i+3)%len(theme)] or 67,amp=.08*amp),t+B/2,pan=.35)
        if perc:
            put(ching(.05*amp,open_=(i%2==1)),t,pan=.4)
            if i%4==0: put(thon(.25*amp),t)
        t+=B/2 if False else B; i+=1
# intro 0-6: fanfare
for k,m in enumerate([60,64,67,72,76,79,84]): put(ranat(m,1.4,.22),0.45+k*.09,pan=-.3+.1*k)
put(pad([60,64,67,72],5.5,.05),0.4)
for k,m in enumerate([72,76,79,76,74,72,74,76]): put(ranat(m,1.2,.18),1.8+k*B*0.5,pan=-.2)
put(ranat(84,2.0,.2),4.2); put(bass(48,2,.2),4.2)
section(6.0,21.0)
# planting: gentle khim + pad
t=21.0
for k in range(15):
    b,ch=prog[(k//4)%4]
    if k%4==0: put(pad(ch,4*B+.6,.04),t+k*B); put(bass(b,1.5,.12),t+k*B)
    m=[67,72,76,74,72,69,67,69][k%8]; put(khim(m,1.8,.13),t+k*B,pan=-.2)
    if k%2: put(khim(m+12,1.0,.05),t+k*B+B/2,pan=.3)
# rain: minor pentatonic, soft
t=30.0
for k in range(12):
    ch=[[57,60,64],[53,57,60],[55,59,62],[57,60,64]][(k//3)%4]
    if k%3==0: put(pad(ch,3*B+.6,.045),t+k*B); put(bass(ch[0]-12,1.5,.12),t+k*B)
    put(ranat([69,72,74,72,69,67][k%6],1.4,.11),t+k*B,pan=-.3); put(ranat([76,79][k%2],.8,.04),t+k*B+B/2,pan=.4)
# growth 37-45: rising arpeggios
t=36.4
for k in range(28):
    base=[60,62,64,65][min(3,k//7)]
    m=[0,4,7,12][k%4]+base; put(ranat(m+(12 if k>13 else 0),1.0,.12+.004*k),t+k*B/2,pan=-.3+.2*(k%4))
    if k%4==0: put(pad([base,base+4,base+7],2*B+.6,.035+.002*k),t+k*B/2); put(bass(base-12,1.2,.14),t+k*B/2)
for k,m in enumerate([72,76,79,84,88]): put(ranat(m,1.6,.15),43.3+k*.07,pan=.3)
section(44.6,53.0,amp=1.15,octave=0)
# ending 53-60
put(pad([60,64,67],4.2,.05),53.0); put(pad([57,60,64],2.2,.045),55.0)
for k,m in enumerate([76,74,72,74,72,69,67,69]): put(khim(m,1.8,.12),53.0+k*B*0.75,pan=-.2)
for k,m in enumerate([60,64,67,72,76,79,84]): put(ranat(m,2.6,.17),56.95+k*.08,pan=-.3+.1*k)
put(pad([48,60,64,67,72],3.4,.05),56.9); put(bass(36,3,.2),56.95)
env=np.ones(N); tt=np.arange(N)/SR; env*=np.clip((DUR-.2-tt)/1.3,0,1); L*=env; R*=env
pk=max(abs(L).max(),abs(R).max()); out=np.stack([L,R],1)/pk*0.8
w=wave.open('music.wav','wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((out*32767).astype('<i2').tobytes()); w.close()
print('music ok')
