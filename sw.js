// Offline cache for 그림자 술래. Bump VERSION whenever files change so phones pick up the update.
const VERSION = 'shadow-tag-v2.3';
const CORE = ['./', './index.html', './play/', './play/index.html',
  './play/lib/three.min.js', './play/lib/qrcode.min.js', './play/lib/peerjs.min.js', './play/lib/jsQR.js',
  './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png', './icons/icon-maskable-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const fonts = url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';
  if (url.origin !== self.location.origin && !fonts) return;   // game networking goes straight to the network
  const isPage = req.mode === 'navigate' || url.pathname.endsWith('.html') || url.pathname.endsWith('/');
  if (isPage) {   // pages: newest first, cached copy when offline
    e.respondWith(fetch(req).then(res => { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); return res; })
      .catch(() => caches.match(req).then(r => r || caches.match('./play/index.html'))));
  } else {        // libraries, icons, fonts: cache first
    e.respondWith(caches.match(req).then(r => r || fetch(req).then(res => { if (res.ok || res.type === 'opaque') { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); } return res; })));
  }
});
