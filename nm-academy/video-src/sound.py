"""Design sonore des vidéos NM Academy (numpy, sans musique) : drone discret, whooshes aux changements de scène,
frappes de clavier pendant le terminal, blips de compteur, impacts, carillon final. Usage : python3 sound.py ai|web out.wav"""
import sys,wave,numpy as np
sr=44100;D=14.0 if sys.argv[1]=='lesson' else 34.0;N=int(sr*D);rng=np.random.RandomState(7)
L=np.zeros(N);R=np.zeros(N)
def add(sig,t,pan=0.0,gain=1.0):
    i=int(t*sr);
    if i<0 or i>=N:return
    j=min(N,i+len(sig));s=sig[:j-i]*gain
    L[i:j]+=s*(1-max(0,pan));R[i:j]+=s*(1+min(0,pan))
def env(n,a=0.004,d=None):
    t=np.arange(n)/sr;d=d or n/sr;e=np.exp(-t*(5/d));e[:int(a*sr)+1]*=np.linspace(0,1,int(a*sr)+1);return e
def sine(f,d,f2=None):
    n=int(d*sr);t=np.arange(n)/sr;f2=f2 or f;fr=f+(f2-f)*(t/d);return np.sin(2*np.pi*np.cumsum(fr)/sr)
def lp(x,k):
    return np.convolve(x,np.ones(k)/k,mode='same')
def noise(n):return rng.randn(n)
def key():
    n=int(.03*sr);c=lp(noise(n),3)*env(n,.0005,.02)*.5;th=sine(rng.uniform(170,250),.05,90)*env(int(.05*sr),.002,.04)*.55
    s=np.zeros(max(len(c),len(th)));s[:len(c)]+=c;s[:len(th)]+=th;return s
def tick(f=None):
    f=f or rng.choice([1046,1174,1318,1568,1760,2093]);d=.08;return sine(f,d)*env(int(d*sr),.002,.06)*.5
def whoosh(d=.7):
    n=int(d*sr);x=noise(n);out=np.zeros(n)
    # bande glissante via moyennes mobiles successives (passe-bas variable) : simple et sans scipy
    for k in (3,9,27):out+=lp(x,k)*(1/np.sqrt(k))
    sw=np.sin(np.linspace(0,np.pi,n))**1.6;sub=sine(70,d,36)*sw*.6;return (out*sw*.9+sub)
def impact():
    d=1.0;n=int(d*sr);b=sine(62,d,32)*env(n,.003,.8);c=lp(noise(n),2)*env(n,.001,.12)*.35;return b+c
def chime(t,notes=(880,1318.5,1760)):
    for k,f in enumerate(notes):
        d=.9;n=int(d*sr);tt=np.arange(n)/sr;mod=np.sin(2*np.pi*f*2.01*tt)*f*1.3*np.exp(-tt*5)
        sig=np.sin(2*np.pi*f*tt+mod/f*3)*env(n,.005,.7)*.28;add(sig,t+k*.09,pan=(-.3,0,.3)[k])
def drone(g=.05):
    t=np.arange(N)/sr;s=np.sin(2*np.pi*55*t)+.6*np.sin(2*np.pi*110.4*t)+.35*np.sin(2*np.pi*164.9*t)
    s*= (0.7+0.3*np.sin(2*np.pi*.12*t));return s*g
v=sys.argv[1];out=sys.argv[2]
if v=='lesson':
    nl=int(sys.argv[3]);acts=[2.4,10.8];counter=[];typing=[];tick_runs=[(2.7+i*1.3,2.7+i*1.3+.25) for i in range(nl)];cta=11.1
elif v=='ai':
    acts=[4.8,9.4,17.0,24.5,29.5];counter=[(1.9,3.4)];typing=[];tick_runs=[(4.8+1.2,4.8+3.4),(9.4+2.6,9.4+6.0),(17+.7,17+2.5),(24.5+.5,24.5+3.2)]
    cta=29.5+.5
else:
    acts=[5.2,12.2,20.4,28.0];counter=[(12.2+1.4,12.2+6.6)];typing=[(5.2+1.0,5.2+5.6),(12.2+.5,12.2+1.9)];tick_runs=[(20.4+.6,20.4+2.5),(5.2+5.4,5.2+6.5)]
    cta=28.0+.5
for a in acts:add(whoosh(),a-.15,gain=.7);add(impact(),a,gain=.38)
add(whoosh(.9),0.0,gain=.6);add(impact(),.25,gain=.3)
for (a,b) in typing:
    t=a
    while t<b:add(key(),t,pan=rng.uniform(-.3,.3),gain=.9);t+=rng.uniform(.035,.06)
for (a,b) in tick_runs:
    t=a
    while t<b:add(tick(),t,pan=rng.uniform(-.4,.4),gain=.65);t+=rng.uniform(.09,.16)
for (a,b) in counter:
    n=0;t=a
    while t<b:add(tick(1568+ (t-a)/(b-a)*1500),t,gain=.4);t+=0.045+0.02*np.sin(n);n+=1
add(impact(),cta,gain=.6);chime(cta+.05)
d=drone(.045);L+=d;R+=d
# fondu début/fin + normalisation
fade=np.ones(N);fi=int(.4*sr);fo=int(1.2*sr);fade[:fi]=np.linspace(0,1,fi);fade[-fo:]=np.linspace(1,0,fo);L*=fade;R*=fade
# écho léger (réverb simplifiée)
for dly,g in ((int(.19*sr),.28),(int(.37*sr),.18),(int(.61*sr),.1)):
    L[dly:]+=R[:-dly]*g;R[dly:]+=L[:-dly]*g*.9
pk=max(np.abs(L).max(),np.abs(R).max());L/=pk;R/=pk;L*=.85;R*=.85
w=wave.open(out,'wb');w.setnchannels(2);w.setsampwidth(2);w.setframerate(sr)
w.writeframes((np.stack([L,R],1)*32767).astype(np.int16).tobytes());w.close()
print('ok',v,out)
