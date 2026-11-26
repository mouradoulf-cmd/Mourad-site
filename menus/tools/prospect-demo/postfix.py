import sys,json,re,os,glob
from PIL import Image
d=sys.argv[1];rm_names=sys.argv[2].split('||') if len(sys.argv)>2 and sys.argv[2] else []
p=f'{d}/menu.js';js=open(p).read();c=json.loads(re.search(r'window.NM_MENU = (.*);\n',js).group(1));n=0
for s in c['sections']:
    for it in s['items']:
        if it.get('img') and (any(it['n'].startswith(x) for x in rm_names) or (s['id']=='s17' and it['id'].endswith('_i'))): del it['img'];n+=1
open(p,'w').write(js.split('window.NM_MENU')[0]+'window.NM_MENU = '+json.dumps(c,ensure_ascii=False,separators=(',',':'))+';\n')
keys={it['img'] for s in c['sections'] for it in s['items'] if it.get('img')};o=0
for f in os.listdir(d):
    m=re.match(r'(ph-.+?)(-m|-t|-c-800|-c-1200|-w-1280|-w-2048|-sc)?\.webp$',f)
    if m and (m.group(1) not in keys or m.group(2) is None): os.remove(f'{d}/{f}');o+=1
Q={'-w-2048':40,'-c-1200':44,'-w-1280':60,'-c-800':56}
for suf,q in Q.items():
    for f in glob.glob(f'{d}/ph-*{suf}.webp'):
        sz=os.path.getsize(f);im=Image.open(f).convert('RGB');im.save(f+'.tmp','WEBP',quality=q,method=6)
        if os.path.getsize(f+'.tmp')<sz: os.replace(f+'.tmp',f)
        else: os.remove(f+'.tmp')
print(d,'removed',n,'orphans',o,len(keys))
