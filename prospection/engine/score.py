"""Score commercial sur 100, 100 % explicable : chaque point vient d'un fait mesuré ou publié.
Aucun point n'est donné pour ce qu'on n'a pas pu lire (site bloqué / inaccessible = « non analysé », jamais « mauvais »)."""
import datetime

NOW_YEAR = datetime.date.today().year

def regdom(host):
    parts = host.lower().removeprefix("www.").split(".")
    if len(parts) >= 3 and parts[-2] in ("co", "com", "org", "ac", "go", "or", "ne"): return ".".join(parts[-3:])
    return ".".join(parts[-2:])

def contacts_of(an, osm):
    """Voies de contact PUBLIÉES, avec leur source."""
    c = []
    host = regdom(__import__("urllib.parse").parse.urlparse(an["site"]).netloc) if an.get("site") else ""
    emails = list(an.get("emails", []))
    if osm.get("email_osm") and not any(e["email"] == osm["email_osm"].lower() for e in emails):
        emails.append({"email": osm["email_osm"].strip().lower(), "own_domain": True, "src": "OpenStreetMap"})
    for e in emails:
        own = e["email"].split("@")[1].endswith(host) if host else e.get("own_domain", False)
        c.append({"kind": "email", "value": e["email"], "pro": own, "src": e.get("src") or "site du restaurant"})
    ig = an.get("instagram") or osm.get("instagram_osm"); fb = an.get("facebook") or osm.get("facebook_osm")
    if ig: c.append({"kind": "instagram", "value": ig, "src": "site du restaurant" if an.get("instagram") else "OpenStreetMap"})
    if fb: c.append({"kind": "facebook", "value": fb, "src": "site du restaurant" if an.get("facebook") else "OpenStreetMap"})
    if an.get("whatsapp"): c.append({"kind": "whatsapp", "value": an["whatsapp"], "src": "site du restaurant"})
    if an.get("line"): c.append({"kind": "line", "value": an["line"], "src": "site du restaurant"})
    if osm.get("phone"): c.append({"kind": "phone", "value": osm["phone"], "src": "OpenStreetMap"})
    return c

def score(osm, an, cities_langs_tourist=True):
    f = an.get("facts", {}); contacts = contacts_of(an, osm)
    pts, why, cons = 0, [], []
    fetched = an.get("fetch") == "ok"
    need = 0
    if fetched:
        if f.get("menu_tool_links") or f.get("qr_menu_hint"):
            cons.append("a déjà un outil de menu / QR (" + ", ".join(f.get("menu_tool_links", [])[:2] or ["QR mentionné"]) + ")")
            why.append("Déjà équipé d'un menu numérique : peu de besoin, à traiter en dernier")
            need = 5
        else:
            need += 18; why.append("Aucun menu QR ni outil de menu numérique détecté sur le site (+18)")
            if f.get("menu_pdf"): need += 14; why.append("Carte en PDF : pénible à lire sur téléphone, impossible à traduire (+14)")
            elif f.get("menu_image"): need += 12; why.append("Carte en image : illisible/non traduisible sur téléphone (+12)")
            elif not f.get("menu_page_found") and f.get("price_mentions", 0) < 3: need += 10; why.append("Pas de carte lisible trouvée en ligne (+10)")
            elif f.get("menu_page_found") and f.get("price_mentions", 0) >= 3: need += 3; why.append("Carte en page web classique, à moderniser (+3)")
            if f.get("n_languages", 0) <= 1: need += 10; why.append("Site dans une seule langue (+10), alors que la clientèle est internationale")
            if not f.get("mobile_viewport"): need += 7; why.append("Site non adapté au téléphone (+7)")
            if not f.get("https"): need += 3; why.append("Site sans HTTPS (+3)")
            cy = f.get("copyright_year")
            if f.get("legacy_markup"): need += 4; why.append("Structure de site ancienne (+4)")
            if cy and cy <= NOW_YEAR - 3: need += 5; why.append(f"Site non mis à jour depuis {cy} (+5)")
    elif an.get("fetch") == "social_only":
        need += 22; why.append("Pas de vrai site : seulement une page de réseau social (+22). Contenu non analysé")
    else:
        why.append("Site non analysé (" + str(an.get("fetch")) + ") : aucun point attribué sur le besoin")
    pts += min(need, 62)
    reach = 0
    kinds = {c["kind"] for c in contacts}
    pro_mail = any(c["kind"] == "email" and c.get("pro") for c in contacts)
    if "email" in kinds: reach += 13 + (3 if pro_mail else 0); why.append("Email publié par l'établissement (+" + str(13 + (3 if pro_mail else 0)) + ")")
    if "whatsapp" in kinds or "line" in kinds: reach += 7; why.append("WhatsApp / LINE publié (+7)")
    if "instagram" in kinds: reach += 4; why.append("Instagram publié (+4)")
    if "facebook" in kinds: reach += 3; why.append("Facebook publié (+3)")
    if "phone" in kinds: reach += 2
    pts += min(reach, 28)
    if fetched and an.get("pages"): pts += 5; why.append("Site accessible et lu (+5)")
    if osm.get("hours"): pts += 4; why.append("Horaires publiés : établissement actif (+4)")
    if osm.get("cuisine"): pts += 1
    pts = min(pts, 100)
    if cons: pts = min(pts, 25)
    return {"score": pts, "why": why, "cons": cons, "contacts": contacts}
