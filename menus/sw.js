/* NM Studio QR menus: keeps every menu usable on a weak or lost connection.
   - pages, scripts, styles, data (prices, subscription status): network first, the saved copy only when offline
   - photos and fonts: saved copy first (their URLs carry a version, so a new photo is a new file)
   Bump VERSION to drop every saved copy. */
var VERSION = "nm-menus-v1";
self.addEventListener("install", function () { self.skipWaiting(); });
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k.indexOf("nm-menus-") === 0 && k !== VERSION; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener("fetch", function (e) {
  var r = e.request;
  if (r.method !== "GET") return;
  var u = new URL(r.url);
  var media = r.destination === "image" || r.destination === "font" || /\.(webp|jpe?g|png|svg|woff2?)$/i.test(u.pathname) || u.hostname === "fonts.gstatic.com";
  var css = u.hostname === "fonts.googleapis.com";
  if (u.origin !== location.origin && !media && !css) return;
  if (media) {
    e.respondWith(caches.open(VERSION).then(function (c) {
      return c.match(r).then(function (hit) {
        return hit || fetch(r).then(function (res) { if (res.ok || res.type === "opaque") c.put(r, res.clone()); return res; });
      });
    }));
    return;
  }
  e.respondWith(fetch(r).then(function (res) {
    if (res.ok) { var copy = res.clone(); caches.open(VERSION).then(function (c) { c.put(r, copy); }); }
    return res;
  }).catch(function () {
    return caches.match(r, { ignoreSearch: r.mode === "navigate" }).then(function (hit) { return hit || Response.error(); });
  }));
});
