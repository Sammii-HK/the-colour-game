// Simple service worker to stop 404 errors
self.addEventListener('install', function(event) {
  console.log('Service Worker installed');
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  console.log('Service Worker activated');
  event.waitUntil(clients.claim());
});

// Optional: Basic caching for better performance
self.addEventListener('fetch', function(event) {
  // Let the browser handle all fetch requests normally
  return;
});
