// Service Worker for Portfolio Website
// Enhanced caching strategy for better performance and SEO

const CACHE_NAME = "ritvik-portfolio-v1.1";
const STATIC_CACHE = "static-cache-v1.1";
const DYNAMIC_CACHE = "dynamic-cache-v1.1";

// Resources to cache immediately
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/robots.txt",
  "/sitemap.xml",
  "/humans.txt",
  "/portfolio",
  "/contact",
  "/experiences",
  "/resume",
  // Critical CSS and JS will be added by build process
];

// Critical external resources
const EXTERNAL_RESOURCES = [
  "https://fonts.googleapis.com/css2?family=Open+Sans+Condensed:wght@700&display=swap",
  "https://cdn.hack.pet/slackcdn/8dc629a933313d44753d58ee864bbee0.png",
];

// Install event - cache static assets
self.addEventListener("install", (event) => {
  console.log("Service Worker: Installing...");

  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) => {
        console.log("Service Worker: Caching static assets");
        return cache.addAll(STATIC_ASSETS);
      }),
      caches.open(DYNAMIC_CACHE).then((cache) => {
        console.log("Service Worker: Caching external resources");
        return cache.addAll(EXTERNAL_RESOURCES);
      }),
    ]).then(() => {
      console.log("Service Worker: Installation complete");
      return self.skipWaiting();
    })
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activating...");

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log("Service Worker: Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log("Service Worker: Activation complete");
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== "GET") {
    return;
  }

  // Handle different types of requests
  if (url.origin === location.origin) {
    // Same origin requests - use cache first strategy
    event.respondWith(cacheFirstStrategy(request));
  } else if (
    url.hostname === "fonts.googleapis.com" ||
    url.hostname === "fonts.gstatic.com" ||
    url.hostname === "cdn.hack.pet"
  ) {
    // External resources - use cache first with long expiry
    event.respondWith(cacheFirstWithNetworkFallback(request));
  } else {
    // Other external requests - network first
    event.respondWith(networkFirstStrategy(request));
  }
});

// Cache first strategy - good for static assets
async function cacheFirstStrategy(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error("Cache first strategy failed:", error);
    // Return offline page if available
    return caches.match("/index.html");
  }
}

// Cache first with network fallback - good for external resources
async function cacheFirstWithNetworkFallback(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request, {
      mode: "cors",
      headers: {
        Accept: "text/css,*/*;q=0.1",
      },
    });

    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error("External resource fetch failed:", error);
    throw error;
  }
}

// Network first strategy - good for API calls and dynamic content
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// Background sync for form submissions
self.addEventListener("sync", (event) => {
  if (event.tag === "contact-form") {
    event.waitUntil(handleContactFormSync());
  }
});

async function handleContactFormSync() {
  // Handle offline form submissions when back online
  console.log("Service Worker: Handling background sync for contact form");
}

// Push notifications support (for future features)
self.addEventListener("push", (event) => {
  if (event.data) {
    const options = {
      body: event.data.text(),
      icon: "/manifest-icon-192.png",
      badge: "/manifest-icon-192.png",
      vibrate: [100, 50, 100],
      data: {
        url: "/",
      },
    };

    event.waitUntil(
      self.registration.showNotification("Ritvik Goyal Portfolio", options)
    );
  }
});

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  event.waitUntil(clients.openWindow(event.notification.data.url || "/"));
});

// Performance monitoring
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// Cache size management
setInterval(
  async () => {
    const cache = await caches.open(DYNAMIC_CACHE);
    const keys = await cache.keys();

    if (keys.length > 100) {
      // Remove oldest entries if cache gets too large
      const oldestKey = keys[0];
      await cache.delete(oldestKey);
      console.log("Service Worker: Cleaned up cache entry:", oldestKey.url);
    }
  },
  5 * 60 * 1000
); // Every 5 minutes
