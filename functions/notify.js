// Free push notifications (Web Push / VAPID). No SMS costs, no third party.
// POST /notify {title, body} -> saves the alert to Firebase, then pings every
// subscribed device. Devices fetch the alert text and show the notification.
//
// UPDATED: uses FIREBASE_DB_SECRET for authenticated writes (rules now block
// unauthenticated writes). Reads that the client also does stay open in rules,
// but server writes go through the secret.

const FB = 'https://storewell-3d-default-rtdb.firebaseio.com';
const VAPID_PUB = 'BN0xNqqMyTy7gBdyIpDM8dGfOpX6-fIHO5nxEn7-Vzl-3xkIgI6JKaJw9tbM3ApSzFEBcRS4J5DBh23vsil5Y8M';
const VAPID_JWK = {
  kty: 'EC', crv: 'P-256',
  d: 'kFwDm4hzZNwodhz91_eFDb8oDPXPWiTe7FnJEECfa38',
  x: '3TE2qozJPLuAF3IikMzx0Z86lfr58gc7mfESfv5XOX4',
  y: '3xkIgI6JKaJw9tbM3ApSzFEBcRS4J5DBh23vsil5Y8M'
};
const SUBJECT = 'mailto:kevin.fudge911@gmail.com';

function fbUrl(path, env) {
  const secret = env.FIREBASE_DB_SECRET || '';
  return FB + path + (secret ? '?auth=' + secret : '');
}

function b64u(buf) {
  return btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function vapidAuth(endpoint) {
  const aud = new URL(endpoint).origin;
  const key = await crypto.subtle.importKey('jwk', VAPID_JWK, { name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign']);
  const enc = new TextEncoder();
  const header = b64u(enc.encode(JSON.stringify({ typ: 'JWT', alg: 'ES256' })));
  const payload = b64u(enc.encode(JSON.stringify({ aud, exp: Math.floor(Date.now() / 1000) + 12 * 3600, sub: SUBJECT })));
  const unsigned = header + '.' + payload;
  const sig = await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, key, enc.encode(unsigned));
  return 'vapid t=' + unsigned + '.' + b64u(sig) + ', k=' + VAPID_PUB;
}

export async function onRequestPost({ request, env }) {
  let msg = {};
  try { msg = await request.json(); } catch (e) {}
  const title = String(msg.title || 'StoreWell update').slice(0, 90);
  const body = String(msg.body || '').slice(0, 180);

  // Write lastAlert with auth
  await fetch(fbUrl('/lastAlert.json', env), {
    method: 'PUT', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, body, t: Date.now() })
  }).catch(() => {});

  // Read pushSubs with auth (rules block public reads on pushSubs)
  const subs = (await fetch(fbUrl('/pushSubs.json', env)).then(r => r.json()).catch(() => null)) || {};
  const sent = [];
  for (const [id, sub] of Object.entries(subs)) {
    if (!sub || !sub.endpoint) continue;
    try {
      const auth = await vapidAuth(sub.endpoint);
      const r = await fetch(sub.endpoint, { method: 'POST', headers: { Authorization: auth, TTL: '300', Urgency: 'high' } });
      sent.push(r.status);
      if (r.status === 404 || r.status === 410) {
        // Clean up dead subscriptions with auth
        await fetch(fbUrl('/pushSubs/' + id + '.json', env), { method: 'DELETE' }).catch(() => {});
      }
    } catch (e) { sent.push('err'); }
  }
  return new Response(JSON.stringify({ success: true, devices: sent.length, sent }),
    { headers: { 'Content-Type': 'application/json' } });
}
