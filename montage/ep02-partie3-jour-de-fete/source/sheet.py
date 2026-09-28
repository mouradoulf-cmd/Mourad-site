import sys,glob
from PIL import Image,ImageDraw
for sid in sys.argv[1].split(','):
    fs=sorted(glob.glob(f'chk/{sid}_*.jpg'))
    if not fs: continue
    W,H=640,360;cols=3;rows=(len(fs)+cols-1)//cols;im=Image.new('RGB',(W*cols,H*rows),'white')
    for i,f in enumerate(fs):
        a=Image.open(f).resize((W,H));im.paste(a,((i%cols)*W,(i//cols)*H));ImageDraw.Draw(im).text(((i%cols)*W+6,(i//cols)*H+4),f.split('/')[-1],fill='red')
    im.save(f'chk/S_{sid}.jpg',quality=80)
