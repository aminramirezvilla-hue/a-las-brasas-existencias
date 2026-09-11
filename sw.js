const CACHE = "brasas-existencias-v2";

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  event.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const cached = await cache.match(req);
      if (cached) return cached;
      try {
        const res = await fetch(req);
        const url = new URL(req.url);
        if (res.ok && url.origin === self.location.origin) {
          cache.put(req, res.clone());
        }
        return res;
      } catch {
        const fallback =
          (await cache.match("./index.html")) ||
          (await cache.match("./")) ||
          (await cache.match("/a-las-brasas-existencias/")) ||
          (await cache.match("/a-las-brasas-existencias/index.html"));
        if (fallback) return fallback;
        throw new Error("offline");
      }
    }),
  );
});
