// StoreWell service worker v2 (safe) - GET-only caching + push notifications.
// Never touches POST/PUT requests, so it can never break lock saves or reports.
const CACHE = 'storewell-handheld-readable-v48';
// Device-local presentation state. Keep it across shell-cache upgrades and
// notification dismissal so delayed pushes cannot roll back newer activity.
const NOTIFICATION_STATE = 'storewell-notification-state-v1';
const GROUP_WINDOW_MS = 2 * 60 * 1000;
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => {
    e.waitUntil(caches.keys()
                    .then(k => Promise.all(k.filter(x => x !== CACHE && x !== NOTIFICATION_STATE).map(x => caches.delete(x))))
                    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
    const req = e.request;
    if (req.method !== 'GET') return;
    const url = new URL(req.url);
    if (url.origin !== self.location.origin || ['/notify','/email','/sms','/staff-session','/staff-contacts','/staff-chat','/push-subscription','/push-receipt'].includes(url.pathname)) return;
    e.respondWith(
          fetch(req).then(r => { if(r.ok){ const c = r.clone(); caches.open(CACHE).then(x => x.put(req, c)).catch(()=>{}); } return r; })
            .catch(async () => (await caches.match(req)) || new Response('StoreWell is offline. Reconnect and reload.', {status:503,headers:{'Content-Type':'text/plain'}}))
        );
});
function routineActivity(alert) {
    const a=alert.activity;
    return a && /^storewell:lock:[A-Z0-9]{1,12}:(green|blue|yellow|purple|white|black)$/.test(a.key) &&
        typeof a.eventId==='string' && /^[A-Za-z0-9_-]{1,150}$/.test(a.eventId) && Number.isSafeInteger(a.eventAt) && a.eventAt>=0 ? a : null;
}
async function displayAlert(alert) {
    let tag=alert.tag||'storewell-update';
    let title=alert.title,body=alert.body,receipt=alert.receipt,silent=false;
    const activity=routineActivity(alert);
    let savedState,stateKey,nextState;
    if(activity){
        // Group tags cannot collide with an exact-event fallback that lacks
        // ordering metadata. Clearing state also retains this stable identity.
        tag='storewell:group:'+activity.key+':'+activity.eventId;
        const state=await caches.open(NOTIFICATION_STATE);
        const key=new URL('/__notification_state__/'+encodeURIComponent(activity.key),self.location.origin).href;
        const response=await state.match(key);
        const previous=response ? await response.json() : null;
        const valid=previous && typeof previous.tag==='string' && typeof previous.eventId==='string' && Number.isSafeInteger(previous.eventAt) && typeof previous.title==='string' && typeof previous.body==='string';
        // Saved time orders events; saved history ID breaks same-ms ties.
        const stale=valid && (activity.eventAt<previous.eventAt || (activity.eventAt===previous.eventAt && activity.eventId<previous.eventId) || (activity.eventId===previous.eventId && activity.eventAt!==previous.eventAt));
        if(stale){
            // userVisibleOnly pushes must still show a notification. Redraw only
            // the persisted newest contents, never acknowledge the stale payload.
            tag=previous.tag;title=previous.title;body=previous.body;receipt=null;silent=previous.displayed===true;
            savedState=state;stateKey=key;nextState=previous;
        }else{
            const sameGroup=valid && (activity.eventId===previous.eventId || activity.eventAt-previous.eventAt<=GROUP_WINDOW_MS);
            if(sameGroup){tag=previous.tag;silent=previous.displayed===true;}
            // Persist BEFORE display. Exact retries can recover a failed display
            // without extending the rolling interval or resetting its identity.
            nextState={tag,eventId:activity.eventId,eventAt:activity.eventAt,title,body,displayed:sameGroup && previous.displayed===true};
            await state.put(key,Response.json(nextState));
            savedState=state;stateKey=key;
        }
    }
    await self.registration.showNotification(title,{body,tag,renotify:false,...(silent?{silent:true}:{}),icon:'/icons/icon-192.png',badge:'/icons/icon-192.png',data:{url:'/'}});
    // Record successful display separately from the pre-display ordering reserve.
    // A failed first display remains audible on retry; a dismissed group's later
    // redraws remain silent even after this worker has been restarted.
    if(savedState)await savedState.put(stateKey,Response.json({...nextState,displayed:true}));
    if(receipt)await fetch('/push-receipt',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(receipt)}).catch(()=>{});
}
// Serialize read/compare/write/display, including concurrently arriving pushes.
// The cache watermark survives termination; this queue only prevents live races.
let notificationQueue=Promise.resolve();
self.addEventListener('push', e => {
    const pending=notificationQueue.then(async () => {
          let alert={title:'StoreWell update',body:'Open StoreWell to see the latest activity.'};
          try { if(e.data)alert={...alert,...e.data.json()}; } catch {}
          await displayAlert(alert);
    });
    notificationQueue=pending.catch(()=>{});
    e.waitUntil(pending);
});
self.addEventListener('notificationclick', e => {
    e.notification.close();
    e.waitUntil(clients.matchAll({ type: 'window' }).then(ws => {
          for (const w of ws) { if ('focus' in w) return w.focus(); }
          return clients.openWindow('/');
    }));
});
