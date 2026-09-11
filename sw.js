/* A las Brasas — cache de la PWA de existencias */
const CACHE = "brasas-existencias-v1";

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE).then((cache) => {
      const base = self.location.pathname.replace(/sw\.js$/, "");
      return cache.addAll([
        base,
        `${base}index.html`,
        `${base}manifest.webmanifest`,
        `${base}favicon.svg`,
        `${base}logo-brasas.jpg`,
        `${base}apple-touch-icon.png`,
        `${base}icon-192.png`,
        `${base}icon-512.png`,
      ]);
    }),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const cached = await cache.match(event.request);
      if (cached) return cached;
      try {
        const response = await fetch(event.request);
        if (response.ok && new URL(event.request.url).origin === self.location.origin) {
          cache.put(event.request, response.clone());
        }
        return response;
      } catch {
        const base = self.location.pathname.replace(/sw\.js$/, "");
        return (await cache.match(`${base}index.html`)) || (await cache.match(base)) || Response.error();
      }
    }),
  );
});
