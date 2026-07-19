const CACHE='esc-wayfinder-v4';
const FILES=['./','./index.html','./styles.css','./app.js','./config.js','./manifest.webmanifest','./assets/esc-logo.png','./assets/esc-logo-transparent.png','./assets/icon-192.png','./assets/icon-512.png','./assets/social-preview.jpg'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)))});
self.addEventListener('activate',e=>e.waitUntil(Promise.all([self.clients.claim(),caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))])));
self.addEventListener('fetch',e=>e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(resp=>{const copy=resp.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return resp}).catch(()=>caches.match('./index.html')))));
