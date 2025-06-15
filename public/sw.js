// 最小限のService Worker - PWAインストール用
self.addEventListener('install', function(event) {
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(self.clients.claim());
});

// fetchイベントの処理（Chrome PWA要件）
self.addEventListener('fetch', function(event) {
  // ネットワークファーストで処理
  event.respondWith(fetch(event.request));
});
