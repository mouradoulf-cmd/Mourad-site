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
    var txt = { fr: "Maquette gratuite pour ", it: "Bozza gratuita per ", th: "แบบร่างฟรีสำหรับ ", ar: "نموذج مجاني لـ ", de: "Kostenloser Entwurf für " }[lang] || "Free mock-up for ";
    var by = { fr: " · par NM Studio", it: " · di NM Studio", th: " · โดย NM Studio", ar: " · من NM Studio", de: " · von NM Studio" }[lang] || " · by NM Studio";
    var el = document.createElement("div"); el.id = "nmDemoLabel"; el.setAttribute("role", "note");
    el.style.cssText = "position:fixed;left:50%;bottom:14px;transform:translateX(-50%);z-index:2147483000;max-width:calc(100% - 24px);" +
      "display:flex;align-items:center;gap:10px;padding:8px 8px 8px 14px;border-radius:999px;background:rgba(12,12,14,.82);color:#f5f1e8;" +
      "font:600 13px/1.2 system-ui,-apple-system,'Segoe UI',sans-serif;box-shadow:0 10px 30px rgba(0,0,0,.35),inset 0 0 0 1px rgba(228,207,154,.35);" +
      "-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px)";
    var t = document.createElement("span"); t.textContent = txt + name + by;
    var x = document.createElement("button"); x.type = "button"; x.setAttribute("aria-label", "Close"); x.textContent = "×";
    x.style.cssText = "all:unset;cursor:pointer;width:26px;height:26px;border-radius:50%;display:grid;place-items:center;background:rgba(255,255,255,.12);font-size:16px";
    x.onclick = function () { el.remove(); };
    el.appendChild(t); el.appendChild(x); document.body.appendChild(el);
  }

  function run() {
    swap(document.body); label();
    // demos that re-render their text (language switch, sliders) are swapped again
    new MutationObserver(function (ms) {
      if (busy) return;
      ms.forEach(function (m) { if (m.target && m.target.nodeType === 1) swap(m.target); else if (m.target && m.target.parentNode) swap(m.target.parentNode); });
    }).observe(document.body, { subtree: true, childList: true, characterData: true });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run); else run();
})();
