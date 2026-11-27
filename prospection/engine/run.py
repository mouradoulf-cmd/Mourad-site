#!/usr/bin/env python3
"""Moteur de prospection : découvrir -> dédoublonner -> analyser -> noter -> préparer les messages.
Sans dépendance, sans clé, sans serveur : tourne dans une session Claude Code cloud (ou n'importe quel Python 3.9+).
Ne contacte personne. Écrit un fichier JSON de prospects (voir README).

Exemples :
  python3 run.py --cities Nice,Florence --limit 25 --out ../out/run.json
  python3 run.py --auto 3 --known ../out/known.txt --out ../out/run.json     (choix tournant du jour, évite les doublons)
"""
import argparse, concurrent.futures as cf, datetime, hashlib, json, os, re, sys, time, unicodedata, urllib.parse
sys.path.insert(0, os.path.dirname(__file__))
from cities import CITIES, EMAIL_POLICY, DEFAULT_EMAIL_POLICY
import discover, analyze, score as sc, messages

OFFSETS = [(0, 0), (0.022, 0), (-0.022, 0), (0, 0.026), (0, -0.026), (0.022, 0.026), (-0.022, -0.026), (0.022, -0.026), (-0.022, 0.026)]

def norm(s):
    s = unicodedata.normalize("NFKD", s or "").encode("ascii", "ignore").decode().lower()
    return re.sub(r"[^a-z0-9]+", " ", s).strip()

def pid(osm, an):
    host = urllib.parse.urlparse(an.get("site") or osm["site"]).netloc
    if osm.get("site_is_social") or any(x in host for x in ("facebook", "instagram", "linktr", "line.me", "tiktok")):
        key = osm["site"].split("?")[0].rstrip("/").lower()
    else:
        key = sc.regdom(host)
    return "p_" + hashlib.sha1(key.encode()).hexdigest()[:10], key

def pick_cities(names, auto):
    if names:
        want = [norm(n) for n in names.split(",")]
        out = [c for c in CITIES if any(w in norm(c[2]) for w in want)]
        return [(c, (0, 0)) for c in out]
    ordinal = datetime.date.today().toordinal()
    out = []
    for i in range(auto):
        k = ordinal * auto + i
        out.append((CITIES[k % len(CITIES)], OFFSETS[(k // len(CITIES)) % len(OFFSETS)]))
    return out

def hook_kind(an, f):
    if an.get("fetch") == "social_only": return "none"
    if f.get("menu_pdf") or f.get("menu_image"): return "pdf"
    if not f.get("menu_page_found") and f.get("price_mentions", 0) < 3 and an.get("fetch") == "ok": return "none"
    return "gen"

def qualified(s, an):
    """Prospect QUALIFIÉ = site lu + besoin mesuré + score >= 60 + une voie de contact publiée et exploitable
    (email du domaine du restaurant, ou WhatsApp/LINE, ou page sociale) + pas déjà équipé d'un menu QR."""
    if s["score"] < 60 or s["cons"] or an.get("fetch") not in ("ok", "social_only"): return False
    return any((c["kind"] == "email" and c.get("pro")) or c["kind"] in ("whatsapp", "line", "instagram", "facebook") for c in s["contacts"])

def process(item):
    osm, city = item
    an = analyze.analyze(osm["site"], osm["site_is_social"])
    return osm, city, an

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--cities", default=""); ap.add_argument("--auto", type=int, default=0)
    ap.add_argument("--limit", type=int, default=30, help="établissements analysés par zone")
    ap.add_argument("--known", default="", help="fichier d'identifiants/clés déjà connus (un par ligne)")
    ap.add_argument("--min-score", type=int, default=40); ap.add_argument("--threads", type=int, default=6)
    ap.add_argument("--max-minutes", type=float, default=25); ap.add_argument("--out", default="out/run.json")
    a = ap.parse_args()
    t0 = time.time()
    known = set(l.strip() for l in open(a.known, encoding="utf8")) if a.known and os.path.exists(a.known) else set()
    stats = {"zones": [], "discovered": 0, "duplicates": 0, "analyzed": 0, "kept": 0, "no_contact": 0, "unreachable": 0, "below_min_score": 0, "overpass_failed": []}
    todo, seen = [], set()
    for (cc, country, city, lat, lon, lang), (dy, dx) in pick_cities(a.cities, a.auto):
        res = discover.discover(lat + dy, lon + dx)
        label = f"{city}" + (f" (zone {dy:+.3f},{dx:+.3f})" if (dy, dx) != (0, 0) else "")
        if res is None: stats["overpass_failed"].append(label); print("!! Overpass injoignable pour", label, file=sys.stderr); continue
        stats["zones"].append({"city": label, "found_with_website": len(res)}); stats["discovered"] += len(res)
        fresh = []
        for r in res:
            k = norm(r["name"]) + "|" + norm(city)
            if k in known or k in seen: stats["duplicates"] += 1; continue
            seen.add(k); fresh.append(r)
        fresh.sort(key=lambda r: (r["site_is_social"], not r["email_osm"], not r["hours"]))   # d'abord ceux qui sont atteignables
        for r in fresh[: a.limit]: todo.append((r, (cc, country, city, lang)))
        print(f"{label}: {len(res)} avec site, {len(fresh)} nouveaux, {min(len(fresh), a.limit)} à analyser", file=sys.stderr)
    out = []
    with cf.ThreadPoolExecutor(a.threads) as ex:
        futs = [ex.submit(process, it) for it in todo]
        for fu in cf.as_completed(futs):
            if time.time() - t0 > a.max_minutes * 60: print("!! temps maximum atteint, arrêt propre", file=sys.stderr); break
            try: osm, (cc, country, city, lang), an = fu.result()
            except Exception as e: print("erreur analyse:", e, file=sys.stderr); continue
            stats["analyzed"] += 1
            i, key = pid(osm, an)
            if i in known or key in known: stats["duplicates"] += 1; continue
            known.add(i)
            if an["fetch"] not in ("ok", "social_only"):
                stats["unreachable"] += 1
                if not (osm.get("email_osm") or osm.get("phone")): continue
            s = sc.score(osm, an)
            if not s["contacts"]: stats["no_contact"] += 1; continue
            if s["score"] < a.min_score: stats["below_min_score"] += 1; continue
            f = an.get("facts", {}); pol = EMAIL_POLICY.get(cc, DEFAULT_EMAIL_POLICY)
            hk = hook_kind(an, f)
            out.append({
                "id": i, "key": key, "name": osm["name"], "country_code": cc, "country": country, "city": city, "lang": lang,
                "type": osm["type"], "cuisine": osm["cuisine"], "address": osm["address"], "site": an.get("site") or osm["site"],
                "site_is_social": osm["site_is_social"], "fetch_status": an["fetch"], "analysis_pages": an.get("pages", []),
                "facts": f, "score": s["score"], "why": s["why"], "constraints": s["cons"], "contacts": s["contacts"],
                "email_policy": {"level": pol[0], "note": pol[1]}, "hook": hk,
                "messages": messages.build(osm["name"], lang, hk, pol[0]),
                "osm_id": osm["osm"], "lat": osm["lat"], "lon": osm["lon"],
                "found_at": datetime.date.today().isoformat(), "source": "OpenStreetMap + site public du restaurant",
                "qualified": qualified(s, an), "status": "nouveau", "history": [], "notes": "", "price_quoted": "",
            })
    out.sort(key=lambda p: -p["score"]); stats["kept"] = len(out)
    stats["serious_60plus"] = sum(1 for p in out if p["score"] >= 60); stats["seconds"] = round(time.time() - t0)
    os.makedirs(os.path.dirname(os.path.abspath(a.out)), exist_ok=True)
    json.dump({"generated": datetime.datetime.now().isoformat(timespec="seconds"), "stats": stats, "prospects": out}, open(a.out, "w", encoding="utf8"), ensure_ascii=False, indent=1)
    print(json.dumps(stats, ensure_ascii=False))
    for p in out[:8]: print(f"{p['score']:3d}  {p['name'][:34]:34s} {p['city']:18s} {p['fetch_status']:12s} " + ",".join(c['kind'] for c in p['contacts']))

if __name__ == "__main__":
    main()
