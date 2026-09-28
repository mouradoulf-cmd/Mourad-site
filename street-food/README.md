# Mae Lek — Thai street kitchen demo (Pattaya)

Fictional business: name, story, address (Soi Buakhao), phone, reviews and
prices are demo content to swap per client. Plain HTML/CSS/JS, no build.

## Design
Warm paper + chili red + turmeric yellow + charcoal night, "sticker" cards
with a hard ink shadow. Fonts self-hosted: Rubik (signage), Manrope (body),
Caveat (chalkboard). Thai loads Noto Sans Thai on demand.

## Features
- Menu of 15 dishes in the HTML (works without JS); category chips + a
  vegetarian toggle filter it; `+` builds a takeaway bag (sessionStorage).
- Sticky order bar → drawer (bottom sheet on mobile): quantities, spice
  level, pick-up slots for tonight / the next open evening, WhatsApp order
  with the baht total.
- Spice meter (5 levels, Thai + translation), synced with the order.
- Chalkboard special per evening (Bangkok time, Monday off; after 1 am it
  shows the coming evening), live open status, today highlighted in hours.
- "Eat like a local" steps + phrase cards shown full-screen to the cook,
  and a Thai address card for drivers.
- EN baked in; FR/TH/RU in `assets/js/i18n.js`. Prices stored in baht
  (`data-price` for display, `data-thb` on dish cards): EN → USD, FR → EUR,
  TH/RU → THB.

## Photos (Unsplash License)
Unsplash photo IDs — hero-wok 1550967977-2ab262149a5f · hero-street
1673449239841-06fb264eef2b · hero-fire 1789999375808-db7192b683b0 · mae
1734071555084-215eca735e58 · tables 1628428800730-43b0f1246a0f · d-krapao
1627308595186-e6bb36712645 · d-padthai 1746973645769-c11eb0a81025 · d-somtam
1648421331147-9fcfab29536e · d-tomyum 1628428798909-75a2d42a557e · d-curry
1618449840665-9ed506d73a34 · d-noodle 1555126634-323283e090fa · d-moo
1568882041008-c0954e91caba · d-grill 1603088549155-6ae9395b928f · d-rice
1790001074380-3a04ef3f49c5 · d-chicken 1628430044262-fb84cffbb744 · d-mango
1705056508219-0aa0ceb16820 · d-tea 1788016284567-f612a7383cb2 · d-seeew
1655091273851-7bdc2e578a88 · d-glory 1707270686208-5d1fc168dd7b · d-boat
1628430043154-290c67c19550 · g-cook 1552912470-ee2e96439539 · g-cart
1671597728634-7a8fc32f3051 · g-night 1671597728641-9d11ab267f21 · g-mortar
1731990456159-988fae774abd · g-pots 1741004420286-e0e726a8f1f5 · g-wok
1681889870636-3f58e5288e03 · g-skewers 1734069956282-aabac27c33bf · g-spread
1763647818427-326fa8e6699f
