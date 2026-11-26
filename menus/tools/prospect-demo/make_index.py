# usage: python3 make_index.py primo|mony  -> writes index.html next to menu.js (prototype pages are noindex + noarchive)
import sys,os
w=sys.argv[1]
cfg={'primo':('primo-bistro-demo','Primo Bistro & Wine Bar · prototype','Unofficial prototype of a QR menu for Primo Bistro & Wine Bar, Jomtien — made by NM Studio for demonstration.','#1a0f0d'),
     'mony':('chez-mony-demo','Chez Mony · prototype','Unofficial prototype of a QR menu for Chez Mony, Pattaya — made by NM Studio for demonstration.','#190e0f'),
     'azur':('azur-restaurant-demo','AZUR Restaurant & Lounge · prototype','Unofficial prototype of a QR menu for AZUR Restaurant & Lounge, Na Jomtien — made by NM Studio for demonstration.','#f2ede3')}[w]
slug,title,desc,theme=cfg
hero=os.path.exists(f'/tmp/hub/menus/{slug}/hero-m.webp')
html=f'''<!doctype html>
<html translate="no" lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="google" content="notranslate">
<meta name="robots" content="noindex,nofollow,noarchive">
<meta name="theme-color" content="{theme}">
<meta name="color-scheme" content="{'light' if w=='azur' else 'dark'}">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 64 64%27%3E%3Crect width=%2764%27 height=%2764%27 rx=%2716%27 fill=%27%23111%27/%3E%3Cpath d=%27M18 20h12v12H18zM34 20h12v12H34zM18 36h12v12H18z%27 fill=%27%23e9c46a%27/%3E%3C/svg%3E">
<title>{title}</title>
<meta name="description" content="{desc}">
{'<link rel="preload" as="image" href="hero-m.webp?v=1" media="(max-width:760px)" fetchpriority="high">' if hero else ''}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="../assets/menu.css?v=34">
<link rel="stylesheet" href="../assets/menu-plus.css?v=8">
<link rel="stylesheet" href="../assets/menu-plus-lux.css?v=6">
<link rel="stylesheet" href="../assets/menu-plus-cards.css?v=10">
<link rel="stylesheet" href="../assets/menu-plus-polish.css?v=2">
</head>
<body>
<div id="menu"><noscript><p style="padding:40px 20px;text-align:center">{title} — please enable JavaScript or ask our staff.</p></noscript></div>
<script src="../assets/i18n-extra.js?v=1"></script>
<script src="menu.js?v=1"></script>
<script src="../assets/menu.js?v=124"></script>
<script src="../assets/menu-plus.js?v=10"></script>
<script src="../assets/menu-plus-lux.js?v=9"></script>
<script src="../assets/menu-plus-cards.js?v=8"></script>
<script src="../assets/menu-plus-polish.js?v=2"></script>
</body>
</html>
'''
open(f'/tmp/hub/menus/{slug}/index.html','w',encoding='utf8').write(html);print('written',slug,'hero' if hero else 'no hero')
