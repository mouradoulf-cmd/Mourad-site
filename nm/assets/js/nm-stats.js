/* NM Studio: tiny, cookie-free visit counter (counts only, no personal data).
   - one "visitor" per device per day (remembered in localStorage)
   - WhatsApp clicks and free mock-up / Google check requests
   Counters live on the free Abacus counting service; the owner reads them on nm/stats.html.
   The owner's own devices are not counted once "don't count me" is set on the stats page. */
(function () {
  "use strict";
  var NS = "mouradoulf-nmstudio", API = "https://abacus.jasoncameron.dev/hit/" + NS + "/";
  function owner() { try { return localStorage.getItem("nmOwner") === "1"; } catch (e) { return false; } }
  if (owner() || /bot|crawl|spider|headless|lighthouse/i.test(navigator.userAgent)) return;
  function day() { return new Date(Date.now() + 7 * 3600e3).toISOString().slice(0, 10).replace(/-/g, ""); }   // Thailand day (UTC+7)
  function hit(key) { try { fetch(API + key + "-" + day(), { mode: "no-cors", keepalive: true, cache: "no-store" }).catch(function () {}); } catch (e) {} }

  if (/\/th-fr\//.test(location.pathname)) return;   // Mourad's private translated copy is never counted
  // all-time counters (no day in the key): total visitors, visitors per language, visitors per ?src= source
  function hitAll(key) { try { fetch(API + key, { mode: "no-cors", keepalive: true, cache: "no-store" }).catch(function () {}); } catch (e) {} }
  var lang = (document.documentElement.lang || "").slice(0, 2).toLowerCase();
  var src = ""; try { src = (new URLSearchParams(location.search).get("src") || "").toLowerCase().replace(/[^a-z0-9_-]/g, "").slice(0, 20); } catch (e) {}

  // one visitor per device per day
  var seen = "";
  try { seen = localStorage.getItem("nmSeen") || ""; } catch (e) {}
  if (seen !== day()) {
    hit("v"); hitAll("vtot");
    if (/^(th|fr|en|it|ar)$/.test(lang)) hitAll("vl-" + lang);
    if (src) hitAll("vs-" + src);
    try { localStorage.setItem("nmSeen", day()); } catch (e) {}
  }

  // WhatsApp clicks (any wa.me link) and form requests (nm-grow.js fires "nm:lead")
  document.addEventListener("click", function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href*="wa.me"]') : null;
    if (a) hit("wa");
    var l = e.target && e.target.closest ? e.target.closest('a[href*="line.me"]') : null;
    if (l) hit("line");
  }, true);
  document.addEventListener("nm:lead", function () { hit("lead"); });
})();
