"""Analyse d'un site de restaurant : on ne note que ce qu'on a VRAIMENT pu lire.
Respecte robots.txt, 1 page d'accueil + au plus 2 pages utiles (carte, contact), pas de formulaire, aucune connexion."""
import re, ssl, time, urllib.parse, urllib.request, urllib.robotparser
from html.parser import HTMLParser

UA = "NMStudioResearchBot/1.0 (restaurant outreach research; +https://mouradoulf-cmd.github.io/Mourad-site/nm/)"
MAXB = 700_000
MENU_WORDS = re.compile(r"menu|carte|menù|speisekarte|speisen|carta|cardápio|ementa|μενού|meniu|เมนู|メニュー|お品書|菜单|菜單|메뉴|thực đơn|daftar", re.I)
CONTACT_WORDS = re.compile(r"contact|kontakt|contatt|contacto|contato|ติดต่อ|お問い合わせ|問い合わせ|联系|聯絡|문의|liên hệ|hubungi|επικοινων|iletişim", re.I)
QR_TEXT = re.compile(r"\bqr\b|qr[- ]?code|scan(?:nez|ner| the| to| für| per| para)|escanea|scansiona|扫码|掃碼|スキャン|สแกน|스캔", re.I)
MENU_SAAS = re.compile(r"(menu-?tiger|qrcode-tiger|qr-code-generator|menuviel|scanmenu|tableqr|menumaker|menu\.to|menuqr|qrmenu|bestqr|"
                       r"flipdish|gloriafood|menulux|zenchef|thefork|lightspeed|toasttab|squareup|sevenrooms|resy|opentable|ubereats|doordash|"
                       r"grab\.com|lineman|foodpanda|wongnai|tabelog|gnavi|hotpepper|dianping|meituan|baemin|deliveroo|justeat|glovo|orderapp|"
                       r"menusifu|clover\.com|bentobox|owner\.com|popmenu)", re.I)
EMAIL_RE = re.compile(r"[A-Za-z0-9._%+\-]+@[A-Za-z0-9\-]+(?:\.[A-Za-z0-9\-]+)*\.[A-Za-z]{2,}")
EMAIL_BAD = re.compile(r"(\.(png|jpe?g|gif|webp|svg|css|js)$|sentry|wixpress|example\.|your(name|email)|domain\.com|@2x|noreply|no-reply|donotreply|schema\.org|godaddy|wordpress|webmaster@|privacy@|abuse@|dpo@)", re.I)
LANG_SWITCH = {"en": r"\b(english|en)\b", "fr": r"\b(français|francais|fr)\b", "de": r"\b(deutsch|de)\b", "es": r"\b(español|espanol|es)\b",
               "it": r"\b(italiano|it)\b", "ru": r"(русский|\bru\b)", "zh": r"(中文|简体|繁體|\bzh\b)", "ja": r"(日本語|\bja\b)",
               "ko": r"(한국어|\bko\b)", "th": r"(ไทย|\bth\b)"}

class P(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.links, self.text, self.imgs, self.metas, self.title, self._t = [], [], [], {}, "", False
        self.lang = ""; self.hreflang = set(); self.skip = 0; self.tables = 0; self.frames = 0; self.mailtos = []
    def handle_starttag(self, tag, a):
        a = dict(a)
        if tag == "html": self.lang = (a.get("lang") or "").lower()
        elif tag in ("script", "style", "noscript"): self.skip += 1
        elif tag == "title": self._t = True
        elif tag == "meta" and a.get("name"): self.metas[a["name"].lower()] = a.get("content") or ""
        elif tag == "a" and a.get("href"):
            self.links.append((a["href"], a.get("title") or a.get("aria-label") or ""))
            if a["href"].lower().startswith("mailto:"): self.mailtos.append(a["href"][7:].split("?")[0])
            self._lasthref = a["href"]
        elif tag == "link" and a.get("hreflang"): self.hreflang.add((a["hreflang"] or "").lower()[:2])
        elif tag == "img": self.imgs.append(((a.get("src") or ""), (a.get("alt") or "")))
        elif tag == "table": self.tables += 1
        elif tag in ("frameset", "frame"): self.frames += 1
        elif tag == "object" or tag == "embed": self.frames += 1
    def handle_endtag(self, tag):
        if tag in ("script", "style", "noscript") and self.skip: self.skip -= 1
        elif tag == "title": self._t = False
    def handle_data(self, d):
        if self._t: self.title += d
        elif not self.skip and d.strip(): self.text.append(d.strip())

_ctx = ssl.create_default_context()
_robots = {}

def allowed(url):
    p = urllib.parse.urlparse(url); base = f"{p.scheme}://{p.netloc}"
    if base not in _robots:
        rp = urllib.robotparser.RobotFileParser()
        try:
            req = urllib.request.Request(base + "/robots.txt", headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=8, context=_ctx) as r:
                rp.parse(r.read(80_000).decode("utf8", "ignore").splitlines())
        except Exception:
            rp = None
        _robots[base] = rp
    rp = _robots[base]
    return True if rp is None else rp.can_fetch(UA, url)

def fetch(url, timeout=12):
    if not allowed(url): return None, "blocked_robots", url
    try:
        req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "text/html,application/xhtml+xml", "Accept-Language": "en,*;q=0.5"})
        with urllib.request.urlopen(req, timeout=timeout, context=_ctx) as r:
            ct = r.headers.get("Content-Type", "")
            if "html" not in ct and ct: return None, "not_html", r.geturl()
            raw = r.read(MAXB)
            m = re.search(rb"charset=([\w\-]+)", raw[:3000]) or re.search(r"charset=([\w\-]+)", ct)
            enc = (m.group(1).decode() if isinstance(m.group(1), bytes) else m.group(1)) if m else "utf-8"
            try: html = raw.decode(enc, "replace")
            except LookupError: html = raw.decode("utf-8", "replace")
            return html, "ok", r.geturl()
    except Exception as e:
        code = getattr(e, "code", None)
        return None, (f"http_{code}" if code else "error:" + type(e).__name__), url

def parse(html):
    p = P()
    try: p.feed(html)
    except Exception: pass
    return p

def sitehost(u): return urllib.parse.urlparse(u).netloc.lower().removeprefix("www.")

def analyze(site, site_is_social=False):
    res = {"site": site, "fetch": "", "pages": [], "facts": {}, "emails": [], "instagram": "", "facebook": "", "whatsapp": "", "line": "", "evidence": []}
    if site_is_social:
        res["fetch"] = "social_only"
        if "instagram.com" in site: res["instagram"] = site.split("?")[0]
        elif "facebook.com" in site or "fb.com" in site: res["facebook"] = site.split("?")[0]
        return res
    html, st, final = fetch(site)
    res["fetch"] = st
    if not html: return res
    res["site"] = final; res["pages"].append(final)
    home = parse(html); pages = [(final, home, html)]
    host = sitehost(final)
    # pages utiles : carte + contact (même domaine)
    want = {}
    for href, title in home.links:
        u = urllib.parse.urljoin(final, href.split("#")[0])
        if not u.startswith("http") or sitehost(u) != host or u.rstrip("/") == final.rstrip("/"): continue
        label = (href + " " + title)
        if "menu" not in want and MENU_WORDS.search(label) and not u.lower().endswith(".pdf"): want["menu"] = u
        if "contact" not in want and CONTACT_WORDS.search(label): want["contact"] = u
    for k, u in want.items():
        h, s, f = fetch(u)
        if h: pages.append((f, parse(h), h)); res["pages"].append(f)
        time.sleep(0.6)
    alltext = " ".join(" ".join(pg.text) for _, pg, _ in pages)[:200_000]
    alllinks = [(urllib.parse.urljoin(u, h), t) for u, pg, _ in pages for h, t in pg.links]
    allimgs = [i for _, pg, _ in pages for i in pg.imgs]
    # emails publiés
    ems = []
    for _, pg, raw in pages:
        ems += pg.mailtos + EMAIL_RE.findall(" ".join(pg.text)) + EMAIL_RE.findall(raw[:300_000])
    seen = []
    for e in ems:
        e = e.strip().strip(".,;:()<>").lower()
        if EMAIL_RE.fullmatch(e) and not EMAIL_BAD.search(e) and e not in seen: seen.append(e)
    def _reg(h):
        p = h.lower().removeprefix("www.").split("."); return ".".join(p[-2:])
    res["emails"] = [{"email": e, "own_domain": _reg(e.split("@")[1]) == _reg(host)} for e in seen[:4]]
    # réseaux
    for href, _ in alllinks:
        hl = href.lower()
        if "instagram.com/" in hl and not res["instagram"] and not re.search(r"instagram\.com/(p|reel|explore|accounts|tv)/", hl): res["instagram"] = href.split("?")[0]
        elif ("facebook.com/" in hl or "fb.com/" in hl) and not res["facebook"] and not re.search(r"(sharer|share\.php|plugins|dialog|tr\?|login|policies)", hl): res["facebook"] = href.split("?")[0]
        elif ("wa.me/" in hl or "api.whatsapp.com" in hl or "whatsapp.com/send" in hl) and not res["whatsapp"]: res["whatsapp"] = href.split("?")[0]
        elif ("line.me/" in hl or "lin.ee/" in hl) and not res["line"]: res["line"] = href.split("?")[0]
    # faits mesurés
    hosts_ext = {sitehost(h) for h, _ in alllinks if h.startswith("http") and sitehost(h) != host}
    saas = sorted({x for x in hosts_ext if MENU_SAAS.search(x)})[:5]
    pdf_menu = [h for h, t in alllinks if h.lower().split("?")[0].endswith(".pdf") and MENU_WORDS.search(h + " " + t)][:3]
    img_menu = [s for s, a in allimgs if MENU_WORDS.search(s + " " + a)][:3]
    qr_hint = bool(QR_TEXT.search(alltext)) or any("qr" in h.lower() for h, _ in alllinks)
    prices = len(re.findall(r"(?:[€$£¥฿₩]\s?\d{1,3}(?:[.,]\d{1,2})?|\d{1,3}(?:[.,]\d{2})?\s?(?:€|฿|THB|baht|円|元|원|EUR|USD))", alltext))
    langs = {l for l, rx in LANG_SWITCH.items() if re.search(rx, " ".join(t for _, t in alllinks) + " " + " ".join(alltext.split()[:400]), re.I)}
    langs |= {l for l in home.hreflang if l in LANG_SWITCH}
    if home.lang[:2] in LANG_SWITCH: langs.add(home.lang[:2])
    years = [int(y) for y in re.findall(r"(?:©|&copy;|copyright)\s*(?:\w+\s*)?(?:\d{4}\s*[-–]\s*)?(20\d\d|19\d\d)", alltext, re.I)]
    res["facts"] = {
        "title": home.title.strip()[:120], "https": final.startswith("https://"), "mobile_viewport": "viewport" in home.metas,
        "lang_attr": home.lang[:5], "languages": sorted(langs), "n_languages": len(langs),
        "menu_page_found": "menu" in want, "menu_pdf": bool(pdf_menu), "menu_image": bool(img_menu), "price_mentions": prices,
        "qr_menu_hint": qr_hint, "menu_tool_links": saas, "copyright_year": max(years) if years else None,
        "legacy_markup": home.frames > 0 or home.tables > 25, "text_chars": len(alltext),
    }
    return res
