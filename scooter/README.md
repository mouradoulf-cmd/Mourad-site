# Ride Siam — premium scooter rental demo (Pattaya / Jomtien)

Fictional business: brand, address (Jomtien Second Road), phone, reviews,
fleet prices and deposits are demo content to swap per client. Plain
HTML/CSS/JS, no build step.

## Design
Graphite + warm off-white + tangerine accent (`--accent`; `--accent-ink`
for accent text on light backgrounds). Geologica (display) + Inter, both
self-hosted variable woff2 (latin + cyrillic); Thai loads Noto Sans Thai.

## Features
- Hero quick quote (model + native date inputs) that pre-fills the booking.
- Fleet of 6 with category filter and a Day / Week / Month price toggle.
  Rates live on each card (`data-day/-week/-month`, `data-deposit`).
- Booking builder: model picker, custom range calendar (2 months on
  desktop, 1 on mobile, hover preview), pick-up/return times, delivery
  (hotel free / shop / further ฿300), per-day extras, licence check with an
  honest hint, live summary (tier: 7+ days weekly, 28+ days monthly, with
  the saving shown), deposit, WhatsApp request with the baht total.
  Mobile gets a sticky recap bar that jumps to the summary.
- How it works, draggable routes rail with Google Maps links, safety
  checklist, reviews, FAQ, shop hours with live Bangkok open status.
- EN baked in; FR/TH/RU in `assets/js/i18n.js` (`RSI18n`). Prices stored in
  baht: EN → USD, FR → EUR, TH/RU → THB.

## Photos (Unsplash License)
Unsplash photo IDs — hero 1751675790030-f1fe163f6660 · ride-sunset
1785366111096-643e8b410ba7 · ride-coast 1769192403325-57d75e6582df ·
ride-curve 1640350410779-8bc2384c338a · ride-palms 1753791407792-43c6c2488b20 ·
f-scoopy 1698407566323-9fbb940a3bbd · f-pcx 1628798211398-29d5c9773fbd ·
f-xmax 1774562610881-a317320a58b9 · f-primavera 1663330082092-11fa01e1ee8e ·
f-gts 1591517487866-e7c7bf9896fb · f-electric 1768907489904-1d72e205d37b ·
r-bay 1625492206717-61c584a8b11e · r-view 1702546330003-5d4dec1563c3 ·
r-sanctuary 1671597728617-32d19c352c4d · r-buddha 1634235423707-c554ee0993e9 ·
r-larn 1679563028385-46b147d62845 · r-hills 1761150284873-75ee48094e72 ·
rider 1611004061856-ccc3cbe944b2
