"""Découverte : établissements OpenStreetMap (Overpass, gratuit, sans clé) dans une zone.
Seuls les restaurants / cafés / bars qui ont un site web (ou une page Facebook/Instagram) renseigné sont gardés :
sans cela, rien de vérifiable. Aucune donnée n'est inventée : tout vient des étiquettes OSM."""
import json, re, time, urllib.parse, urllib.request

UA = "NMStudioResearchBot/1.0 (restaurant outreach research; +https://mouradoulf-cmd.github.io/Mourad-site/nm/)"
MIRRORS = ["https://maps.mail.ru/osm/tools/overpass/api/interpreter",
           "https://overpass-api.de/api/interpreter",
           "https://overpass.kumi.systems/api/interpreter"]
CHAINS = re.compile(r"mcdonald|kfc|starbucks|burger king|pizza hut|domino|subway|costa coffee|tim hortons|dunkin|papa john|"
                    r"wagamama|nando|five guys|hard rock|wendy|taco bell|sizzler|mk restaurants|the pizza company|swensen|"
                    r"après-midi|paul\b|ladurée|hippopotamus|buffalo grill|flunch|courtepaille|vapiano|l'osteria|"
                    r"yoshinoya|sukiya|matsuya|coco ichibanya|gusto|saizeriya|ootoya|mos burger", re.I)
SOCIAL = re.compile(r"(facebook\.com|fb\.com|instagram\.com|linktr\.ee|line\.me|lin\.ee|tiktok\.com)", re.I)
_last = [0.0]

def _post(query, tries=3):
    for mirror in MIRRORS:
        for a in range(tries):
            wait = 2.0 - (time.time() - _last[0])
            if wait > 0: time.sleep(wait)
            _last[0] = time.time()
            try:
                req = urllib.request.Request(mirror, data=urllib.parse.urlencode({"data": query}).encode(), headers={"User-Agent": UA})
                with urllib.request.urlopen(req, timeout=70) as r:
                    return json.loads(r.read().decode("utf8"))
            except Exception as e:
                code = getattr(e, "code", None)
                if code in (400,): break
                time.sleep(3 * (a + 1))
    return None

def norm_site(u):
    u = (u or "").strip()
    if not u: return ""
    if not re.match(r"^https?://", u, re.I): u = "http://" + u
    return u

def discover(lat, lon, half=0.012, limit=120):
    s, w, n, e = lat - half, lon - half * 1.15, lat + half, lon + half * 1.15
    box = f"({s:.5f},{w:.5f},{n:.5f},{e:.5f})"
    q = (f'[out:json][timeout:60];('
         f'nwr["amenity"~"^(restaurant|cafe|bar|pub|fast_food)$"]["website"]{box};'
         f'nwr["amenity"~"^(restaurant|cafe|bar|pub|fast_food)$"]["contact:website"]{box};'
         f');out center tags {limit};')
    d = _post(q)
    if not d: return None
    out = []
    for el in d.get("elements", []):
        t = el.get("tags", {})
        name = (t.get("name") or t.get("name:en") or "").strip()
        site = norm_site(t.get("website") or t.get("contact:website"))
        if not name or not site: continue
        if t.get("brand") or t.get("brand:wikidata") or CHAINS.search(name): continue
        c = el.get("center") or {"lat": el.get("lat"), "lon": el.get("lon")}
        out.append({
            "osm": f'{el.get("type","n")[0]}{el.get("id")}',
            "name": name, "site": site, "site_is_social": bool(SOCIAL.search(site)),
            "type": t.get("amenity"), "cuisine": (t.get("cuisine") or "").replace(";", ", "),
            "phone": t.get("phone") or t.get("contact:phone") or "",
            "email_osm": t.get("email") or t.get("contact:email") or "",
            "instagram_osm": t.get("contact:instagram") or "", "facebook_osm": t.get("contact:facebook") or "",
            "address": " ".join(x for x in [t.get("addr:housenumber"), t.get("addr:street"), t.get("addr:postcode"), t.get("addr:city")] if x),
            "hours": t.get("opening_hours") or "", "lat": c.get("lat"), "lon": c.get("lon"),
        })
    return out
