/* Funciona sin internet: con conexión siempre usa la versión más nueva y la guarda;
   sin conexión (o si la red tarda demasiado) usa la copia guardada en el teléfono. */
var CACHE = "formulas-v2";
var CORE = ["./", "index.html", "manifest.webmanifest", "icon-192.png", "apple-touch-icon.png", "catalogo.js",
  "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.js"];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) {
    return Promise.all(CORE.map(function (u) { return c.add(u).catch(function () {}); }));
  }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

function fromNetwork(req, ms) {
  return new Promise(function (ok, fail) {
    var t = setTimeout(fail, ms);
    fetch(req).then(function (r) {
      clearTimeout(t);
      if (r && (r.ok || r.type === "opaque")) {
        var copy = r.clone();
        caches.open(CACHE).then(function (c) { c.put(req, copy); });
      }
      ok(r);
    }, function (err) { clearTimeout(t); fail(err); });
  });
}

self.addEventListener("fetch", function (e) {
  var req = e.request, url = new URL(req.url);
  if (req.method !== "GET") return;
  /* Nunca guardar los datos de la cuenta: siempre van directo a Supabase */
  if (/supabase\.co$/.test(url.hostname)) return;
  var known = url.origin === location.origin || url.hostname === "cdn.jsdelivr.net" ||
    url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com";
  if (!known) return;
  var isPage = req.mode === "navigate";
  e.respondWith(
    fromNetwork(req, isPage ? 4000 : 8000).catch(function () {
      return caches.match(req, { ignoreSearch: isPage }).then(function (r) {
        return r || (isPage ? caches.match("index.html") : Response.error());
      });
    })
  );
});
