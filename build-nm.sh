#!/usr/bin/env bash
# Builds the standalone NM Studio site (nm/ at the root + the 7 demos) into ./dist
# for a custom domain (Cloudflare Pages: build command `bash build-nm.sh`, output `dist`).
# Usage: NM_DOMAIN=nmstudiothai.com bash build-nm.sh [outdir]
set -euo pipefail
DOMAIN="${NM_DOMAIN:-nmstudiothai.com}"
OUT="${1:-dist}"
DEMOS="v6-thai-spa street-food scooter oblanc noir neon-tiger atelier-des-facadiers"
BASE='https://mouradoulf-cmd\.github\.io/Mourad-site'

rm -rf "$OUT"; mkdir -p "$OUT"
# nm/ becomes the site root (th-fr is a private copy: never published)
(cd nm && tar cf - --exclude=./th-fr --exclude=./README.md --exclude=./FILM.md .) | tar xf - -C "$OUT"
for d in $DEMOS; do
  mkdir -p "$OUT/$d"; (cd "$d" && tar cf - --exclude=./README.md .) | tar xf - -C "$OUT/$d"
  # demos link back to "../nm/" -> now the site root
  find "$OUT/$d" -type f -name '*.html' -print0 | xargs -0 sed -i 's#href="\.\./nm/"#href="../"#g'
done

cp demo-name.js "$OUT/demo-name.js"
DEMO_RE=$(echo $DEMOS | tr ' ' '|')
find "$OUT" -type f \( -name '*.html' -o -name '*.js' -o -name '*.css' -o -name '*.xml' -o -name '*.json' -o -name '*.webmanifest' -o -name '*.txt' \) -print0 |
  xargs -0 sed -i -E \
    -e "s#${BASE}/giulivo-qr-menu#@@GIU@@#g" \
    -e "s#${BASE}/nm/#https://${DOMAIN}/#g" \
    -e "s#${BASE}/(${DEMO_RE})/#https://${DOMAIN}/\1/#g" \
    -e "s#${BASE}/?#https://${DOMAIN}/#g" \
    -e "s#@@GIU@@#https://mouradoulf-cmd.github.io/Mourad-site/giulivo-qr-menu#g"

printf 'User-agent: *\nAllow: /\nSitemap: https://%s/sitemap.xml\n' "$DOMAIN" > "$OUT/robots.txt"
echo "Built $OUT for $DOMAIN: $(find "$OUT" -type f | wc -l) files"
