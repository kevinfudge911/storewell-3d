// StoreWell service worker v2 (safe) - GET-only caching + push notifications.
// Never touches POST/PUT requests, so it can never break lock saves or reports.
const CACHE = 'storewell-command-bridge-v3';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => {
    e.waitUntil(caches.keys()
                    .then(k => Promise.all(k.filter(x => x !== CACHE).map(x => caches.delete(x))))
                    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
    const req = e.request;
    if (req.method !== 'GET') return;
    const url = new URL(req.url);
    if (url.origin !== self.location.origin) return;
    e.respondWith(
          fetch(req).then(r => { if(r.ok){ const c = r.clone(); caches.open(CACHE).then(x => x.put(req, c)).catch(()=>{}); } return r; })
            .catch(async () => (await caches.match(req)) || new Response('StoreWell is offline. Reconnect and reload.', {status:503,headers:{'Content-Type':'text/plain'}}))
        );
});
self.addEventListener('push', e => {
    e.waitUntil((async () => {
          let title = 'StoreWell update', body = 'Something changed at the facility.';
          try {
                  const a = await fetch('https://storewell-3d-default-rtdb.firebaseio.com/lastAlert.json').then(r => r.json());
                  if (a && a.title) { title = a.title; body = a.body || ''; }
          } catch (err) {}
          await self.registration.showNotification(title, { body, icon: '/icons/icon-192.png', badge: '/icons/icon-192.png' });
    })());
});
self.addEventListener('notificationclick', e => {
    e.notification.close();
    e.waitUntil(clients.matchAll({ type: 'window' }).then(ws => {
          for (const w of ws) { if ('focus' in w) return w.focus(); }
          return clients.openWindow('/');
    }));
});
