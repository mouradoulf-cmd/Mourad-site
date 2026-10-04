# NM Studio — business card

Standard Thai print size (90mm x 54mm), same brand system as the main
NM Studio site (`#04050c` background, cyan/purple/pink gradient, Onest
font, wave-icon logo).

- `card.html` — source (FR + EN, front + back, 4 cards total: `#cardFront`,
  `#cardBack`, `#cardFrontEN`, `#cardBackEN`). Open directly in a browser
  to preview, or screenshot with Playwright for print-res exports.
- `card-front.png` / `card-back.png` — FR renders.
- `card-front-en.png` / `card-back-en.png` — EN renders.
- `qr-site.png` — QR on the front, links to the NM Studio site.
- `qr-whatsapp.png` — QR on the back, links to the real WhatsApp
  (`https://wa.me/qr/PYPOVXTCVM74I1`).

## Still to do

The back has a "Line" QR slot that's currently an honest dashed
placeholder ("QR à venir" / "QR coming soon") — no real Line ID yet.
Once Mourad sends his Line ID/QR:

1. Generate a QR PNG for it the same way `qr-whatsapp.png` was made:
   `QRCode` from `nm/assets/js/qrcode.min.js`, `colorDark: "#ffffff"`,
   `colorLight: "#04050c"`, `correctLevel: QRCode.CorrectLevel.H`,
   rendered at 600x600 then screenshotted from the canvas.
2. Save it here as `qr-line.png`.
3. In `card.html`, replace both
   `<div class="back__qr-frame back__qr-frame--placeholder"><span>QR à venir</span></div>`
   (and the EN "QR coming soon" one) with
   `<div class="back__qr-frame"><img src="qr-line.png" alt="QR code Line NM Studio"></div>`.
4. Re-screenshot `#cardBack` / `#cardBackEN` to refresh the PNG exports.
