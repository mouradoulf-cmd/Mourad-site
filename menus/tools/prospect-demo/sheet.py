# usage: python3 sheet.py <out.jpg> key-idx key-idx ...   (idx = candidate number)  -> labelled contact sheet 4 columns
import sys,json,os
from PIL import Image,ImageDraw
out=sys.argv[1];items=sys.argv[2:]
C=json.load(open('/tmp/night/pw/cands_all.json'))
T=(300,225);cols=4;lab=34
rows=(len(items)+cols-1)//cols
S=Image.new('RGB',(T[0]*cols,(T[1]+lab)*rows),'white');d=ImageDraw.Draw(S)
for n,it in enumerate(items):
    k,i=it.rsplit('-',1);i=int(i);f=f'/tmp/night/pw/cp/{k}-{i}.jpg'
    x,y=(n%cols)*T[0],(n//cols)*(T[1]+lab)
    try:
        im=Image.open(f).convert('RGB');im.thumbnail(T);S.paste(im,(x+(T[0]-im.width)//2,y+lab+(T[1]-im.height)//2))
    except Exception as e: d.text((x+5,y+lab+5),'MISSING',fill='red')
    t=(C.get(k,[{}]*(i+1))[i].get('title','') if i<len(C.get(k,[])) else '')[5:48]
    d.text((x+3,y+1),f'{k}-{i}',fill='black');d.text((x+3,y+16),t,fill=(90,90,90))
S.save(out,quality=82);print(out,S.size)
