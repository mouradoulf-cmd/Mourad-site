---
name: brand-brain
description: Build a "brand brain" for an NM Studio client before making their website, QR menu, Google listing, ads or videos — one folder with every REAL fact about the business (details, menu and prices, Google rating and what reviews praise or complain about, bestsellers, photos and their origin, competitors, tone of voice). Use when starting work for a new client or prospect, when Mourad sends info/photos/screenshots about a business, or before writing any copy, ad or video for a client.
---

# Brand brain (NM Studio)

Goal: never invent anything about a client. Every site, ad and video is written from this folder.

## Where

`clients/<slug>/brain.md` (+ `clients/<slug>/sources/` for screenshots/menus Mourad sends).
The repo is published on GitHub Pages: only put **public business information** here (what is on
their Google listing, menu, website, social pages). Private notes, contracts, owner phone numbers
that are not public, invoices: never in the repo; keep them in the chat or the client's own files.

## brain.md template

```md
# <Business name> — brand brain (updated YYYY-MM-DD)
## Identity
Type · city/area · address · hours · public phone/WhatsApp/LINE · links (Google Maps, FB, IG, site)
Languages spoken / customers (tourists? locals? which countries?)
## Offer
Top 3 products/services (the ones to show first) · full menu/prices (source + date)
## Proof (real numbers only)
Google rating + review count (date checked) · year opened · team size · anything countable
## What customers say
Top 5 praises and top 3 complaints, paraphrased from public reviews (source, date). No reviewer
names beyond what is public, never invented quotes, never reused as fake testimonials.
## Fears to answer (for the « peur → engagement » section)
## Visual identity
Colours, logo, photo style · photo list with origin: client / Google listing / stock (label stock)
## Competitors nearby
2-3 names + what they do better/worse (from their public pages)
## Voice
3 adjectives + words to use/avoid · language priority (TH/EN/FR/RU/…)
## Missing (ask Mourad / the client)
```

## Rules

- Fill only from sources Mourad gives or public pages you actually read; write the source next to
  each fact. Unknown = put it under "Missing", never guess.
- Then apply CLAUDE.md methods (« parfait du premier coup », « le téléphone doit sonner ») using this
  brain; update it whenever new info arrives.
- Thai privacy law (PDPA): no personal data of customers or staff (see `thailand-pdpa` skill).
