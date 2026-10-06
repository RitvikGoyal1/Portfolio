// Retire the previous portfolio cache so returning visitors receive current pages.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    await Promise.all(["ritvik-portfolio-v1.1", "static-cache-v1.1", "dynamic-cache-v1.1"].map((name) => caches.delete(name)));
    await self.clients.claim();
    await self.registration.unregister();
  })());
});
