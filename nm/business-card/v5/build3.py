import segno,sys
exec(open('build2.py',encoding='utf8').read().split("# A: monogram")[0])   # reuse CSS/helpers
LINE=sys.argv[1] if len(sys.argv)>1 else ""
def tile(inner,label,th):
    return f'<div style="text-align:center"><div class="qrwrap vf" style="width:25mm;height:25mm;padding:2mm">{inner}{VF}</div><div style="margin-top:3.2mm;font-weight:700;font-size:2.3mm;letter-spacing:.3em;padding-left:.3em;color:#f4f1ea">{label}</div><div style="font-family:Th;font-size:2.1mm;color:#a9a6bb;margin-top:.3mm">{th}</div></div>'
ph='<div style="width:100%;height:100%;border:.35mm dashed #a07828;display:grid;place-items:center;font:700 3mm Sat;color:#a07828;text-align:center;line-height:1.3">LINE<br>QR</div>'
line_inner=qr(LINE) if LINE else ph
back=f'''<div class="page dark" style="position:absolute;inset:0"><div class="glow" style="width:76mm;height:76mm;background:radial-gradient(circle,rgba(230,194,122,.2),transparent 62%)"></div>
<div style="position:relative;display:flex;flex-direction:column;align-items:center;gap:4.4mm"><div style="font-family:Th;font-weight:700;font-size:4.2mm;color:#f4f1ea">ให้ลูกค้า<span style="color:#e6c27a;font-family:ThS">เจอคุณ</span></div>
<div style="display:flex;gap:9mm">{tile(line_inner,'LINE','ไลน์')}{tile(Q,'WEBSITE','เว็บไซต์')}</div></div></div>'''
front=open('cardA.html',encoding='utf8').read().split('<section class="page" id="front">')[1].split('</section>')[0]
name='cardA2.html' if LINE else 'cardA2_preview.html'
open(name,'w',encoding='utf8').write(f'<!doctype html><html><head><meta charset="utf-8"><style>{CSS}</style></head><body><section class="page" id="front">{front}</section><section class="page" id="back">{back}</section></body></html>')
print(name)
