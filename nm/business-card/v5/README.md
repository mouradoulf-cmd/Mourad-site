# NM Studio card v5 (variant A "Monogramme") - user-approved

Front: big wave mark + NM STUDIO, nothing else. Back: Thai headline ให้ลูกค้าเจอคุณ + gold viewfinder QR to nmstudiothai.com.
Print files: `nm-studio-card-print.pdf` (2 pages, 90x54 mm + 3 mm bleed) and `nm-studio-spot-uv-mask.pdf`.
Rebuild: `python3 build2.py` (needs segno) then `node renderA.js` (paths point to /tmp/claude-0/card, copy this folder there).
The QR is real (segno) and was decoded from the render. Add LINE later by editing the back block in build2.py.
