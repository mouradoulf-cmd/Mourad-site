/* NM Studio demo personaliser. A demo site opened with ?n=Business+Name shows that name in place of the demo brand,
   with a small "mock-up for ... by NM Studio" label, so a prospect sees their own site in seconds.
   Usage on a demo page: <script defer src="../demo-name.js" data-brand="Neon Tiger"></script>
   (several brand spellings: data-brand="Atelier des Façadiers|Façadiers"). Without ?n= nothing changes. */
(function () {
  "use strict";
  var me = document.currentScript || document.querySelector('script[src*="demo-name.js"]');
  var q = new URLSearchParams(location.search);
  var name = (q.get("n") || "").trim().slice(0, 60);
  if (!me || !name) return;
  var brands = (me.getAttribute("data-brand") || "").split("|").map(function (s) { return s.trim(); }).filter(Boolean)
    .sort(function (a, b) { return b.length - a.length; });   // longest first ("Atelier des Façadiers" before "Façadiers")
  if (!brands.length) return;
  var re = new RegExp(brands.map(function (b) { return b.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }).join("|"), "g");
  var busy = false;

  function swap(root) {
    if (busy) return; busy = true;
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null), n;
    while ((n = w.nextNode())) {
      var p = n.parentNode && n.parentNode.nodeName;
      if (p === "SCRIPT" || p === "STYLE" || p === "NOSCRIPT") continue;
      re.lastIndex = 0;
      if (re.test(n.nodeValue)) { re.lastIndex = 0; n.nodeValue = n.nodeValue.replace(re, name); }
    }
    // logos drawn with several spans ("NEON" + "TIGER", one span per letter...): an element whose whole text is the brand
    var low = brands.map(function (x) { return x.toLowerCase().replace(/\s+/g, ""); });
    [].slice.call(root.querySelectorAll ? root.querySelectorAll("a, span, div, h1, h2, p, strong, b") : []).forEach(function (el) {
      if (el.children.length < 2 || el.querySelector("img, svg, video, picture, input, button")) return;
      var txt = (el.textContent || "").toLowerCase().replace(/\s+/g, "");
      if (low.indexOf(txt) > -1 && !el.closest("#nmDemoLabel")) el.textContent = name;
    });
    re.lastIndex = 0;
    if (re.test(document.title)) { re.lastIndex = 0; document.title = document.title.replace(re, name); }
    busy = false;
  }

  function label() {
    if (document.getElementById("nmDemoLabel")) return;
    var lang = (document.documentElement.lang || "en").slice(0, 2);
    var txt = { fr: "Maquette pour ", it: "Bozza per ", th: "แบบร่างสำหรับ ", ar: "نموذج لـ ", de: "Entwurf für " }[lang] || "Mock-up for ";
    var free = { fr: "GRATUIT", it: "GRATIS", th: "ฟรี", ar: "مجاني", de: "GRATIS" }[lang] || "FREE";
    var by = { fr: " · par NM Studio", it: " · di NM Studio", th: " · โดย NM Studio", ar: " · من NM Studio", de: " · von NM Studio" }[lang] || " · by NM Studio";
    var el = document.createElement("div"); el.id = "nmDemoLabel"; el.setAttribute("role", "note");
    el.style.cssText = "position:fixed;left:12px;right:12px;bottom:14px;margin:0 auto;width:max-content;z-index:2147483000;max-width:calc(100% - 24px);" +
      "display:flex;align-items:center;gap:10px;padding:7px 8px 7px 7px;border-radius:999px;background:rgba(12,12,14,.82);color:#f5f1e8;" +
      "font:600 13px/1.2 system-ui,-apple-system,'Segoe UI',sans-serif;box-shadow:0 10px 30px rgba(0,0,0,.35),inset 0 0 0 1px rgba(228,207,154,.35);" +
      "-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px)";
    var chip = document.createElement("b"); chip.textContent = free;
    chip.style.cssText = "flex:none;padding:5px 9px;border-radius:999px;background:#2bd97a;color:#04140b;font:800 11px/1 system-ui,-apple-system,sans-serif;letter-spacing:.06em;box-shadow:0 6px 16px -6px rgba(43,217,122,.8)";
    var t = document.createElement("span"); t.textContent = txt + name + by;
    var x = document.createElement("button"); x.type = "button"; x.setAttribute("aria-label", "Close"); x.textContent = "×";
    x.style.cssText = "all:unset;cursor:pointer;width:26px;height:26px;border-radius:50%;display:grid;place-items:center;background:rgba(255,255,255,.12);font-size:16px";
    x.onclick = function () { el.remove(); };
    el.appendChild(chip); el.appendChild(t); el.appendChild(x); document.body.appendChild(el);
  }

  /* ---------- Maquette Pro: palette, title font and the business's own photos (from nm/maquette.html) ----------
     ?pal=bordeaux|olive|ocean|safran|emeraude  ?font=elegant|moderne|chic  ?mx=<id> (photos saved on the owner's phone) */
  var TPL = {   // accent / display-font variables of each demo
    "": { main: ["--terracotta"], dark: ["--terracotta-dark"], btn: ["--terracotta-btn"], light: [], font: "--font-display" },
    "street-food": { main: ["--chili"], dark: ["--chili-ink"], btn: ["--chili-btn"], light: [], font: "--display" },
    "oblanc": { main: ["--menthe-2"], dark: [], btn: ["--menthe"], light: ["--menthe-l"], font: "--display" },
    "neon-tiger": { main: ["--pink"], dark: [], btn: ["--pink-btn"], light: [], font: "--display" },
    "noir": { main: ["--bronze"], dark: ["--bronze-2"], btn: [], light: [], font: "--serif" },
    "v6-thai-spa": { main: ["--gold"], dark: ["--gold-ink"], btn: [], light: ["--gold-2"], font: "--display" },
    "scooter": { main: ["--accent"], dark: ["--accent-ink"], btn: [], light: ["--accent-2"], font: "--display" },
    "atelier-des-facadiers": { main: ["--signal"], dark: [], btn: ["--blue"], light: ["--sky"], font: "--f-display" }
  };
  var PAL = {
    bordeaux: { main: "#c23b4f", dark: "#8a2335", btn: "#a8304a", light: "#f0a8b4" },
    olive: { main: "#8aa04a", dark: "#55682a", btn: "#5e7530", light: "#d3e0a8" },
    ocean: { main: "#2f8fc4", dark: "#1d5f86", btn: "#236f9c", light: "#a9d8f2" },
    safran: { main: "#e8a531", dark: "#9a6a12", btn: "#a36d10", light: "#f7d68f" },
    emeraude: { main: "#1fa27a", dark: "#116b50", btn: "#13795a", light: "#a3e6cf" }
  };
  var FONTS = {
    elegant: { fam: "Playfair+Display:ital,wght@0,500;0,700;1,500", css: "'Playfair Display', 'Noto Sans Thai', Georgia, serif" },
    moderne: { fam: "Poppins:wght@500;600;700", css: "'Poppins', 'Noto Sans Thai', system-ui, sans-serif" },
    chic: { fam: "DM+Serif+Display:ital@0;1", css: "'DM Serif Display', 'Noto Sans Thai', Georgia, serif" }
  };
  function tplKey() {
    var parts = location.pathname.split("/").filter(Boolean);
    for (var i = parts.length - 1; i >= 0; i--) if (TPL.hasOwnProperty(parts[i])) return parts[i];
    return "";
  }
  function restyle() {
    var t = TPL[tplKey()], pal = PAL[q.get("pal")], font = FONTS[q.get("font")], css = "";
    if (!t) return;
    if (pal) ["main", "dark", "btn", "light"].forEach(function (k) { t[k].forEach(function (v) { css += v + ":" + pal[k] + ";"; }); });
    if (font) {
      css += t.font + ":" + font.css + ";";
      var l = document.createElement("link"); l.rel = "stylesheet";
      l.href = "https://fonts.googleapis.com/css2?family=" + font.fam + "&display=swap"; document.head.appendChild(l);
    }
    if (!css) return;
    var st = document.createElement("style"); st.id = "nmMxStyle"; st.textContent = "html:root{" + css + "}"; document.head.appendChild(st);
  }
  var photoUrls = null, photoMap = {};
  function photoKey(img) {
    var s = img.getAttribute("data-src") || img.getAttribute("src") || "";
    if (/^data:|\.svg(\?|$)|^blob:/.test(s)) return "";
    return s.split("?")[0].split("/").pop().replace(/\.[a-z0-9]+$/i, "").replace(/-\d{3,4}w?$/, "");
  }
  function applyPhotos(root) {
    if (!photoUrls || !photoUrls.length) return;
    [].slice.call((root || document).querySelectorAll("img")).forEach(function (img) {
      if (img.hasAttribute("data-nm-mx") || img.closest("header, nav, footer, #nmDemoLabel, [class*='logo']")) return;
      var w = +img.getAttribute("width") || 0; if (w && w < 300) return;
      var k = photoKey(img); if (!k) return;
      if (!(k in photoMap)) photoMap[k] = Object.keys(photoMap).length % photoUrls.length;
      var url = photoUrls[photoMap[k]];
      var pic = img.parentNode && img.parentNode.nodeName === "PICTURE" ? img.parentNode : null;
      if (pic) [].slice.call(pic.querySelectorAll("source")).forEach(function (s) { s.remove(); });
      img.removeAttribute("srcset"); img.removeAttribute("data-srcset"); img.removeAttribute("sizes");
      if (img.hasAttribute("data-src")) img.setAttribute("data-src", url);
      img.src = url; img.style.objectFit = "cover"; img.setAttribute("data-nm-mx", "");
    });
  }
  function loadPhotos(cb) {
    var id = q.get("mx"); if (!id || !window.indexedDB) return cb();
    try {
      var req = indexedDB.open("nmMaquettes", 1);
      req.onupgradeneeded = function () { req.result.createObjectStore("mx", { keyPath: "id" }); };
      req.onerror = function () { cb(); };
      req.onsuccess = function () {
        try {
          var g = req.result.transaction("mx").objectStore("mx").get(id);
          g.onsuccess = function () {
            var r = g.result;
            if (r && r.photos && r.photos.length) photoUrls = r.photos.map(function (b) { return URL.createObjectURL(b); });
            cb();
          };
          g.onerror = function () { cb(); };
        } catch (e) { cb(); }
      };
    } catch (e) { cb(); }
  }
  restyle();

  function run() {
    swap(document.body); label();
    loadPhotos(function () { applyPhotos(document); });
    // demos that re-render their text (language switch, sliders) are swapped again
    new MutationObserver(function (ms) {
      if (busy) return;
      ms.forEach(function (m) { if (m.target && m.target.nodeType === 1) { swap(m.target); applyPhotos(m.target); } else if (m.target && m.target.parentNode) swap(m.target.parentNode); });
    }).observe(document.body, { subtree: true, childList: true, characterData: true });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run); else run();
})();
