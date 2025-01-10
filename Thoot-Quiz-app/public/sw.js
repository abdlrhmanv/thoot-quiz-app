// In public/sw.js or similar
self.addEventListener("install", (event) => {
    self.skipWaiting(); // Skip waiting to activate the new service worker
  });
  
  self.addEventListener("activate", (event) => {
    self.registration.unregister(); // Unregister the service worker
  });