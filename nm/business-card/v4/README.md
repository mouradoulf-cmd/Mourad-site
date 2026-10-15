# NM Studio business card v4 (night + violet + gold, matches the site)

Print-ready: `nm-studio-card-print.pdf` (vector, 2 pages, 90x54 mm + 3 mm bleed).
Previews: `front-600dpi.png`, `back-600dpi.png`. Printer notes: `PRINT-SPEC.txt`.

Rebuild (needs `pip install segno` and Playwright):
`python3 build.py [LINE_URL]` then `node render.js` (paths in render.js point to /tmp/claude-0/card — adjust
or copy this folder there). With a LINE URL the back shows 3 QR codes (website, LINE, WhatsApp).
QR codes are always real (segno); both current ones were verified by decoding the render.
