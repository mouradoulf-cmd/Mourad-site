# AZUR Restaurant & Lounge — prototype QR menu (UNOFFICIAL, made by NM Studio)

Prospect demo built overnight from the venue's **public** online menu (azurpattaya.com): 194 lines in 23 sections incl. the Russian & Ukrainian card. Nothing was sent to the venue; Mourad validates and sends the message himself (`clients/azur-restaurant/message.md`).

- 20 languages (names/sections/ingredients translated by Claude — **to be proofread by a native speaker**; the Russian card keeps the original Russian names). Hot/iced coffee-and-tea prices ("70 / 85") are split into two rows.
- Theme "Ivoire" (light, Mediterranean). Photos: Wikimedia Commons free licences, chosen and checked by eye, credited in `CREDITS.md`, labelled as illustrations in the footnote. ~97 distinct photos; dishes without a faithful free photo (lamb chops, blini variants, many smoothies, most cocktails…) stay photo-less on purpose.
- Rebuild: `menus/tools/prospect-demo/build_menu.py azur`.
