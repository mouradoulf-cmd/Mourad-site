import segno,sys,json
SITE="https://nmstudiothai.com"; WA="https://wa.me/qr/PYPOVXTCVM74I1"
LINE=sys.argv[1] if len(sys.argv)>1 else ""   # optional LINE url
def qr(url,color="#07060c"):
    q=segno.make(url,error='q',micro=False)
    return q.svg_inline(scale=1,border=0,dark=color,light=None,omitsize=True)
items=[("WEBSITE","เว็บไซต์",SITE,"nmstudiothai.com"),("WHATSAPP","วอทส์แอป",WA,"WhatsApp")]
if LINE: items.insert(1,("LINE","ไลน์",LINE,"LINE"))
tiles=''.join(f'<div class="tile"><div class="qr">{qr(u)}</div><b>{l}</b><i>{t}</i></div>' for l,t,u,_ in items)
n=len(items)
html=f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><title>NM Studio card</title><style>
@font-face{{font-family:Sat;font-weight:500;src:url(fonts/satoshi-500.woff2)}}
@font-face{{font-family:Sat;font-weight:700;src:url(fonts/satoshi-700.woff2)}}
@font-face{{font-family:Sat;font-weight:900;src:url(fonts/satoshi-900.woff2)}}
@font-face{{font-family:Fr;font-style:italic;font-weight:100 900;src:url(fonts/fraunces-italic-latin.woff2)}}
@font-face{{font-family:Th;font-weight:300;src:url(fonts/noto-sans-thai-thai-300-normal.woff2)}}
@font-face{{font-family:Th;font-weight:400;src:url(fonts/noto-sans-thai-thai-400-normal.woff2)}}
@font-face{{font-family:Th;font-weight:600;src:url(fonts/noto-sans-thai-thai-600-normal.woff2)}}
@page{{size:96mm 60mm;margin:0}}
*{{margin:0;padding:0;box-sizing:border-box;text-rendering:geometricPrecision;font-kerning:normal;-webkit-font-smoothing:antialiased}}
html,body{{background:#222}}
.page{{width:96mm;height:60mm;position:relative;overflow:hidden;page-break-after:always;break-after:page;font-family:Sat,Th,sans-serif}}
.front{{background:#07060c;color:#f4f1ea}}
.front::before{{content:"";position:absolute;width:70mm;height:70mm;right:-22mm;top:-34mm;border-radius:50%;background:radial-gradient(circle,rgba(123,97,255,.5),transparent 66%)}}
.front::after{{content:"";position:absolute;width:62mm;height:62mm;left:-26mm;bottom:-36mm;border-radius:50%;background:radial-gradient(circle,rgba(230,194,122,.28),transparent 66%)}}
.frame{{position:absolute;inset:6mm;border:.18mm solid rgba(230,194,122,.4);border-radius:1.6mm;z-index:1}}
.f-in{{position:absolute;inset:6mm;z-index:2;padding:4.4mm 5mm 4mm}}
.waves{{position:absolute;z-index:1;width:41mm;height:41mm;right:8.5mm;top:12.5mm;transform:rotate(-6deg);-webkit-mask-image:linear-gradient(90deg,transparent 0,#000 38%);mask-image:linear-gradient(90deg,transparent 0,#000 38%)}}
.brand{{display:flex;align-items:center;gap:2.2mm}}
.brand svg{{width:9mm;height:auto}}
.brand span{{font-weight:700;font-size:4.2mm;letter-spacing:-.02em}}
.tag{{position:absolute;left:5mm;top:15mm}}
.tag h1{{font-weight:900;font-size:7.6mm;line-height:1;letter-spacing:-.035em}}
.tag h1 em{{font-family:Fr,serif;font-style:italic;font-weight:500;color:#e6c27a;letter-spacing:-.02em}}
.tag p{{margin-top:2.4mm;font-family:Th,sans-serif;font-weight:300;font-size:3mm;color:#cfcbe0;letter-spacing:.01em}}
.who{{position:absolute;left:5mm;bottom:4mm}}
.who b{{display:block;font-weight:700;font-size:2.7mm;letter-spacing:.22em;text-transform:uppercase}}
.who i{{display:block;margin-top:.7mm;font-style:normal;font-weight:500;font-size:2.1mm;color:#a9a6bb;letter-spacing:.06em}}
.url{{position:absolute;right:5mm;bottom:4mm;font-weight:700;font-size:2.7mm;color:#e6c27a;letter-spacing:.02em}}
.back{{background:#f4f1ea;color:#07060c}}
.back .frame{{border-color:rgba(160,120,40,.45)}}
.b-in{{position:absolute;inset:6mm;z-index:2;padding:5mm 5mm 4.6mm;display:flex;justify-content:space-between;gap:3mm}}
.b-l{{display:flex;flex-direction:column;justify-content:space-between;min-width:0}}
.b-l svg{{width:8.5mm;height:auto}}
.b-l h2{{font-family:Fr,serif;font-style:italic;font-weight:500;font-size:6.2mm;line-height:1.02;letter-spacing:-.02em}}
.b-l h2 span{{color:#a07828}}
.b-l .th{{font-family:Th,sans-serif;font-weight:400;font-size:2.7mm;color:#4a4458;margin-top:1mm}}
.b-l ul{{list-style:none;font-weight:500;font-size:2.15mm;line-height:1.55;color:#3b3548}}
.b-l ul li:before{{content:"";display:inline-block;width:1.1mm;height:1.1mm;border-radius:50%;background:#7b61ff;margin-right:1.4mm;vertical-align:.1mm}}
.b-r{{display:flex;flex-direction:column;justify-content:center;gap:2.2mm}}
.tiles{{display:flex;gap:2.4mm;align-items:flex-start}}
.tile{{text-align:center}}
.qr{{width:{19 if n==2 else 15}mm;height:{19 if n==2 else 15}mm;background:#fff;border-radius:1.2mm;padding:1.4mm;box-shadow:inset 0 0 0 .2mm rgba(7,6,12,.12)}}
.qr svg{{width:100%;height:100%;display:block}}
.tile b{{display:block;margin-top:1.3mm;font-weight:700;font-size:1.9mm;letter-spacing:.16em}}
.tile i{{display:block;font-style:normal;font-family:Th,sans-serif;font-size:1.9mm;color:#6a6478;margin-top:.2mm}}
.site{{text-align:center;font-weight:700;font-size:2.4mm;color:#a07828;letter-spacing:.02em}}
</style></head><body>
<section class="page front" id="front"><div class="frame"></div>
<div class="f-in">
 <div class="brand"><svg viewBox="0 0 32 20" fill="none" stroke-linecap="round" stroke-width="2.6"><path d="M2 6c2.9 0 2.9 5 5.9 5S10.8 6 13.3 6s2.9 5 5.9 5S22 6 24.6 6s2.9 5 5.4 5" stroke="#7b61ff"/><path d="M2 13c2.9 0 2.9 5 5.9 5s3-5 5.4-5 2.9 5 5.9 5S22 13 24.6 13s2.9 5 5.4 5" stroke="#e6c27a"/></svg><span>NM Studio</span></div>
</div>
<svg class="waves" viewBox="0 0 120 120" fill="none" stroke-linecap="round"><defs><linearGradient id="g1" x1="0" x2="1"><stop offset="0" stop-color="#7b61ff"/><stop offset="1" stop-color="#4f7bff"/></linearGradient><linearGradient id="g2" x1="0" x2="1"><stop offset="0" stop-color="#e6c27a"/><stop offset="1" stop-color="#b98a2e"/></linearGradient></defs><path d="M0 34c10 0 10 -14 20 -14s10 14 20 14 10 -14 20 -14 10 14 20 14 10 -14 20 -14 10 14 20 14" stroke="url(#g1)" stroke-width="2.40" opacity="0.75"/><path d="M0 43c10 0 10 -14 20 -14s10 14 20 14 10 -14 20 -14 10 14 20 14 10 -14 20 -14 10 14 20 14" stroke="url(#g1)" stroke-width="2.22" opacity="0.68"/><path d="M0 52c10 0 10 -14 20 -14s10 14 20 14 10 -14 20 -14 10 14 20 14 10 -14 20 -14 10 14 20 14" stroke="url(#g2)" stroke-width="2.04" opacity="0.61"/><path d="M0 61c10 0 10 -14 20 -14s10 14 20 14 10 -14 20 -14 10 14 20 14 10 -14 20 -14 10 14 20 14" stroke="url(#g1)" stroke-width="1.86" opacity="0.54"/><path d="M0 70c10 0 10 -14 20 -14s10 14 20 14 10 -14 20 -14 10 14 20 14 10 -14 20 -14 10 14 20 14" stroke="url(#g1)" stroke-width="1.68" opacity="0.47"/><path d="M0 79c10 0 10 -14 20 -14s10 14 20 14 10 -14 20 -14 10 14 20 14 10 -14 20 -14 10 14 20 14" stroke="url(#g2)" stroke-width="1.50" opacity="0.40"/><path d="M0 88c10 0 10 -14 20 -14s10 14 20 14 10 -14 20 -14 10 14 20 14 10 -14 20 -14 10 14 20 14" stroke="url(#g1)" stroke-width="1.32" opacity="0.33"/><path d="M0 97c10 0 10 -14 20 -14s10 14 20 14 10 -14 20 -14 10 14 20 14 10 -14 20 -14 10 14 20 14" stroke="url(#g1)" stroke-width="1.14" opacity="0.26"/></svg><div class="tag" style="left:11mm;top:17.5mm"><h1>Be found.<br><em>Be chosen.</em></h1><p>ให้ลูกค้าเจอคุณ และเลือกคุณ</p></div>
<div class="who" style="left:11mm;bottom:9.5mm"><b>Mourad</b><i>Founder · Web design</i></div>
<div class="url" style="right:11mm;bottom:9.5mm">nmstudiothai.com</div>
</section>
<section class="page back" id="back"><div class="frame"></div>
<div class="b-in">
 <div class="b-l">
  <svg viewBox="0 0 32 20" fill="none" stroke-linecap="round" stroke-width="2.6"><path d="M2 6c2.9 0 2.9 5 5.9 5S10.8 6 13.3 6s2.9 5 5.9 5S22 6 24.6 6s2.9 5 5.4 5" stroke="#7b61ff"/><path d="M2 13c2.9 0 2.9 5 5.9 5s3-5 5.4-5 2.9 5 5.9 5S22 13 24.6 13s2.9 5 5.4 5" stroke="#b98a2e"/></svg>
  <div><h2>Let’s<br><span>talk.</span></h2><p class="th">คุยกันได้เลย</p></div>
  <ul><li>Websites</li><li>QR menus</li><li>Google visibility</li></ul>
 </div>
 <div class="b-r"><div class="tiles">{tiles}</div></div>
</div></section></body></html>'''
open('card.html','w',encoding='utf8').write(html)
print('ok',n)
