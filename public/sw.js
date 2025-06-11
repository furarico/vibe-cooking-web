// 最小限のService Worker - PWAインストール用
self.addEventListener('install', function(event) {
  console.log('Service Worker: インストール中...');
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  console.log('Service Worker: アクティベート中...');
  event.waitUntil(self.clients.claim());
});

// fetchイベントの処理（Chrome PWA要件）
self.addEventListener('fetch', function(event) {
  // ネットワークファーストで処理
  event.respondWith(fetch(event.request));
});
