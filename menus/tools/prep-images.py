#!/usr/bin/env python3
"""Prepare the photo set the premium QR menu needs, from the restaurant's real photos.
Usage:  python3 menus/tools/prep-images.py menus/<slug> [featured_id1,featured_id2,...]
For every item `img` key K in menus/<slug>/menu.js it reads K.webp (or K.jpg/png) and writes
  K-m.webp   720x540  4:3 card photo           (cards layer)
  K-t.webp   288x288  square thumbnail         (tab icon, bag, fly-to-bag, blurred placeholder)
  K-sc.webp  720x900  4:5 crop, only for the featured ids passed as 2nd argument (3D showcase)
Never invent a photo: only files the restaurant supplied are used."""
import sys, json, os
from PIL import Image
d = sys.argv[1].rstrip('/')
feat = set((sys.argv[2] if len(sys.argv) > 2 else '').split(',')) - {''}
s = open(d + '/menu.js').read()
j = json.loads(s[s.index('{', s.index('NM_MENU')):s.rindex('}')+1])
def src(k):
    for e in ('.webp', '.jpg', '.jpeg', '.png'):
        if os.path.exists(d + '/' + k + e): return d + '/' + k + e
items = [(i['id'], i['img']) for sec in j['sections'] for i in sec['items'] if i.get('img')]
done = set()
for iid, k in items:
    p = src(k)
    if not p: print('MISSING', k); continue
    im = Image.open(p).convert('RGB'); w, h = im.size
    if k not in done:
        tw, th = (w, int(w * 3 / 4)) if w / h < 4 / 3 else (int(h * 4 / 3), h)
        x, y = (w - tw) // 2, (h - th) // 2
        im.crop((x, y, x + tw, y + th)).resize((720, 540), Image.LANCZOS).save(f'{d}/{k}-m.webp', 'WEBP', quality=74, method=6)
        m = min(w, h); x, y = (w - m) // 2, (h - m) // 2
        im.crop((x, y, x + m, y + m)).resize((288, 288), Image.LANCZOS).save(f'{d}/{k}-t.webp', 'WEBP', quality=78, method=6)
        done.add(k)
    if iid in feat:
        tw = int(h * 0.8); x = (w - tw) // 2
        im.crop((x, 0, x + tw, h)).resize((720, 900), Image.LANCZOS).save(f'{d}/{k}-sc.webp', 'WEBP', quality=76, method=6)
print(len(done), 'photos prepared in', d)
