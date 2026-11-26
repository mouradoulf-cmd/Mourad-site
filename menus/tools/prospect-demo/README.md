# Prospect demos — how Primo Bistro and Chez Mony were built (2026-11-26, overnight)

Pipeline (all scripts here; they expect their working files under `/tmp/night`, copy `data/` there):
1. **Find** restaurants whose full menu is public and who publish a WhatsApp/LINE (web search + `render.js` = real-browser text dump, `net.js` = which data file the page loads).
2. **Menu data**: Primo = the JSON feed its own page loads (`data/primo.json`); Chez Mony = tabs clicked in a real browser (`mony.js` → `data/mony_raw.json` → `mony_menu.json`).
3. **Translations**: `data/tr_*.txt` (one line per dish, pipe-separated, fixed language order, see `build_menu.py`); `meta_texts.txt` = footnote and taglines in 20 languages.
4. **Photos**: `dtypes_pm.py` (dish → search queries) → Wikimedia Commons search through subagents (the container IP gets 429s from the API) → `cands_all.json` → previews downloaded with `dl_targets.py preview` → looked at by eye with `sheet.py` contact sheets → choices in `make_picks.py` + `extra_pt.json` → full-size files with `dl_targets.py hq` → `build_menu.py` makes every variant the engine needs.
5. `build_menu.py primo|mony` writes `menus/<slug>/menu.js`, photos, `CREDITS.md`; `make_index.py` writes `index.html`; `shot.js` makes phone screenshots (file:// URLs, no server needed).

Rules kept: real names and prices only; no photo from the restaurant's own site; Wikimedia photos credited; a dish without a faithful free photo has no photo; footer says "unofficial prototype".
