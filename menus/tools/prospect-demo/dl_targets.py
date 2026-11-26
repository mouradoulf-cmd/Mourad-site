# usage: python3 dl_targets.py preview|hq <file with lines "type-idx"> [gap]
import urllib.parse,urllib.request,urllib.error,time,json,os,sys
mode,lst=sys.argv[1],sys.argv[2];GAP=float(sys.argv[3]) if len(sys.argv)>3 else 2.2
UA='NMStudioMenuBot/1.0 (restaurant menu illustrations; contact via site)'
W={'preview':960,'hq':1920}[mode];D='cp' if mode=='preview' else 'hq'
os.makedirs(f'/tmp/night/pw/{D}',exist_ok=True)
C=json.load(open('/tmp/night/pw/cands_all.json'))
def url(title):
    n=title.replace('File:','',1).replace(' ','_');return f'https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/{urllib.parse.quote(n)}&width={W}'
def get(u):
    for a in range(10):
        try: return urllib.request.urlopen(urllib.request.Request(u,headers={'User-Agent':UA}),timeout=60).read()
        except urllib.error.HTTPError as e:
            if e.code==429: time.sleep(4+a*3)
            elif e.code in (400,404): return None
            else: time.sleep(4)
        except Exception: time.sleep(4)
    return None
ok=fail=0
for ref in [l.strip() for l in open(lst) if l.strip()]:
    if ref.startswith('lib:'): continue
    k,i=ref.rsplit('-',1);i=int(i)
    f=f'/tmp/night/pw/{D}/{k}-{i}.jpg'
    if os.path.exists(f) and os.path.getsize(f)>8000: continue
    if i>=len(C.get(k,[])): print('NOCAND',ref);continue
    d=get(url(C[k][i]['title']))
    if d and len(d)>8000: open(f,'wb').write(d);ok+=1;print('ok',ref,flush=True)
    else: fail+=1;print('FAIL',ref,flush=True)
    time.sleep(GAP)
print('DONE',mode,ok,'ok',fail,'fail')
