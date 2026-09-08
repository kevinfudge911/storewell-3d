// SMS is retired - StoreWell uses free push notifications instead (see notify.js).
export async function onRequestPost() {
  return new Response(JSON.stringify({ success: false, error: 'SMS is turned off - StoreWell now uses free push notifications' }),
      { headers: { 'Content-Type': 'application/json' } });
      }
