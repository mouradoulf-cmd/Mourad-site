import segno,sys
SITE="https://nmstudiothai.com"
def qr(url,color="#07060c"):
    return segno.make(url,error='q').svg_inline(scale=1,border=0,dark=color,light=None,omitsize=True)
Q=qr(SITE)
WAVE=lambda a,b:f'<svg viewBox="0 0 32 20" fill="none" stroke-linecap="round" stroke-width="2.4"><path d="M2 6c2.9 0 2.9 5 5.9 5S10.8 6 13.3 6s2.9 5 5.9 5S22 6 24.6 6s2.9 5 5.4 5" stroke="{a}"/><path d="M2 13c2.9 0 2.9 5 5.9 5s3-5 5.4-5 2.9 5 5.9 5S22 13 24.6 13s2.9 5 5.4 5" stroke="{b}"/></svg>'
CSS='''
@font-face{font-family:Sat;font-weight:500;src:url(fonts/satoshi-500.woff2)}
@font-face{font-family:Sat;font-weight:700;src:url(fonts/satoshi-700.woff2)}
@font-face{font-family:Sat;font-weight:900;src:url(fonts/satoshi-900.woff2)}
@font-face{font-family:Th;font-weight:400;src:url(fonts/noto-sans-thai-thai-400-normal.woff2)}
@font-face{font-family:Th;font-weight:700;src:url(fonts/noto-sans-thai-thai-700-normal.woff2)}
@font-face{font-family:ThS;font-weight:600;src:url(fonts/noto-serif-thai-thai-600-normal.woff2)}
@page{size:96mm 60mm;margin:0}
*{margin:0;padding:0;box-sizing:border-box;text-rendering:geometricPrecision;-webkit-font-smoothing:antialiased}
html,body{background:#222}
.page{width:96mm;height:60mm;position:relative;overflow:hidden;break-after:page;font-family:Sat,Th,sans-serif;display:flex;align-items:center;justify-content:center}
.dark{background:#07060c;color:#f4f1ea}.cream{background:#f4f1ea;color:#07060c}
.glow{position:absolute;border-radius:50%;pointer-events:none}
.qrwrap{position:relative;width:29mm;height:29mm;background:#fff;border-radius:1.6mm;padding:2.2mm}
.qrwrap svg{width:100%;height:100%;display:block}
.vf i{position:absolute;width:4.4mm;height:4.4mm;border:0 solid #e6c27a}
.vf .a{left:-2.6mm;top:-2.6mm;border-left-width:.55mm;border-top-width:.55mm;border-top-left-radius:1.2mm}
.vf .b{right:-2.6mm;top:-2.6mm;border-right-width:.55mm;border-top-width:.55mm;border-top-right-radius:1.2mm}
.vf .c{left:-2.6mm;bottom:-2.6mm;border-left-width:.55mm;border-bottom-width:.55mm;border-bottom-left-radius:1.2mm}
.vf .d{right:-2.6mm;bottom:-2.6mm;border-right-width:.55mm;border-bottom-width:.55mm;border-bottom-right-radius:1.2mm}
.vfg i{border-color:#a07828}
.scan{font-family:ThS,serif;font-weight:600;color:#e6c27a;font-size:4.4mm;line-height:1.3}
.url{font-weight:700;font-size:2.4mm;letter-spacing:.06em;color:#a9a6bb}
'''
VF='<i class="a"></i><i class="b"></i><i class="c"></i><i class="d"></i>'
def doc(front,back,name):
    open(name,'w',encoding='utf8').write(f'<!doctype html><html><head><meta charset="utf-8"><style>{CSS}</style></head><body><section class="page" id="front">{front}</section><section class="page" id="back">{back}</section></body></html>')
# A: monogram
doc(f'''<div class="page dark" style="position:absolute;inset:0"><div class="glow" style="width:80mm;height:80mm;background:radial-gradient(circle,rgba(123,97,255,.38),transparent 62%)"></div>
<div style="position:relative;text-align:center"><div style="width:46mm;margin:0 auto">{WAVE('#7b61ff','#e6c27a')}</div>
<div style="margin-top:3.4mm;font-weight:700;font-size:4mm;letter-spacing:.5em;padding-left:.5em;color:#f4f1ea">NM STUDIO</div></div></div>''',
f'''<div class="page dark" style="position:absolute;inset:0"><div class="glow" style="width:70mm;height:70mm;background:radial-gradient(circle,rgba(230,194,122,.22),transparent 62%)"></div>
<div style="position:relative;display:flex;align-items:center;gap:9mm"><div style="text-align:left"><div class="scan" style="font-size:7.2mm;line-height:1.25;font-family:Th;font-weight:700;color:#f4f1ea">ให้ลูกค้า<br><span style="color:#e6c27a;font-family:ThS">เจอคุณ</span></div><div class="url" style="margin-top:3mm">nmstudiothai.com</div></div>
<div class="qrwrap vf">{Q}{VF}</div></div></div>''','cardA.html')
# B: statement
doc(f'''<div class="page dark" style="position:absolute;inset:0;justify-content:flex-start"><div class="glow" style="width:75mm;height:75mm;right:-26mm;top:-24mm;background:radial-gradient(circle,rgba(123,97,255,.5),transparent 64%)"></div>
<div style="position:relative;padding-left:11mm;width:100%"><div style="font-family:Th;font-weight:700;font-size:11.4mm;line-height:1.22;letter-spacing:-.01em">ให้ลูกค้า<br><span style="font-family:ThS;font-weight:600;color:#e6c27a">เจอคุณ</span></div>
<div style="display:flex;align-items:center;gap:2mm;margin-top:5mm"><div style="width:8mm">{WAVE('#7b61ff','#e6c27a')}</div><b style="font-size:3mm;letter-spacing:.3em;font-weight:700">NM STUDIO</b></div></div></div>''',
f'''<div class="page cream" style="position:absolute;inset:0"><div style="display:flex;align-items:center;gap:10mm">
<div style="text-align:right"><div style="font-family:ThS;font-weight:600;font-size:7mm;color:#a07828;line-height:1.2">สแกนเลย</div><div style="font-size:5mm;color:#a07828;margin-top:1mm">→</div></div>
<div class="qrwrap vf vfg" style="box-shadow:0 0 0 .3mm rgba(7,6,12,.14)">{Q}{VF}</div></div></div>''','cardB.html')
# C: cream wordmark
doc(f'''<div class="page cream" style="position:absolute;inset:0;justify-content:flex-start"><div style="padding-left:9mm;position:relative;width:100%">
<div style="font-weight:900;font-size:29mm;line-height:.8;letter-spacing:-.07em;color:#07060c">NM</div>
<div style="display:flex;align-items:center;gap:3mm;margin-top:3mm"><div style="width:15mm">{WAVE('#7b61ff','#b98a2e')}</div><b style="font-size:4mm;letter-spacing:.42em;font-weight:700">STUDIO</b></div></div></div>''',
f'''<div class="page dark" style="position:absolute;inset:0"><div class="glow" style="width:76mm;height:76mm;background:radial-gradient(circle,rgba(123,97,255,.4),transparent 62%)"></div>
<div style="position:relative;display:flex;flex-direction:column;align-items:center;gap:5.6mm"><div class="qrwrap vf">{Q}{VF}</div><div class="scan" style="font-family:Th;font-weight:700;font-size:3.6mm;color:#f4f1ea">เว็บไซต์ที่<span style="color:#e6c27a;font-family:ThS">พาลูกค้ามาหาคุณ</span></div></div></div>''','cardC.html')
