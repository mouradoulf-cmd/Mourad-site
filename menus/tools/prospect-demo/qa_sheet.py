import sys,json,re
from PIL import Image,ImageDraw
slug=sys.argv[1];d=f'/tmp/hub/menus/{slug}'
c=json.loads(re.search(r'window.NM_MENU = (.*);\n',open(d+'/menu.js').read()).group(1))
its=[(it['n'],it['img']) for s in c['sections'] for it in s['items'] if it.get('img')]
seen=set();its=[x for x in its if not (x[1] in seen or seen.add(x[1]))]
per=24;cols=6
for n in range(0,len(its),per):
    ch=its[n:n+per];rows=(len(ch)+cols-1)//cols;W=300;H=250
    S=Image.new('RGB',(cols*W,rows*H),'white');dr=ImageDraw.Draw(S)
    for i,(t,k) in enumerate(ch):
        im=Image.open(f'{d}/{k}-m.webp').convert('RGB').resize((296,222));S.paste(im,((i%cols)*W+2,(i//cols)*H+2));dr.rectangle([(i%cols)*W,(i//cols)*H+224,(i%cols)*W+W,(i//cols)*H+H],fill='black');dr.text(((i%cols)*W+4,(i//cols)*H+230),t[:46],fill='white')
    S.save(f'/tmp/night/qa_{slug[:4]}_{n//per}.jpg',quality=80)
print(len(its))
