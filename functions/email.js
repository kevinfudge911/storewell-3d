// Report emails via Brevo. The BREVO_API_KEY secret is set on the Cloudflare
// Pages project (Settings > Variables and secrets) and survives deploys.
export async function onRequestPost({ request, env }) {
    let d = {};
    try { d = await request.json(); } catch (e) {}
    if (!d.to) return json({ success: false, error: 'No recipient' }, 400);
    const payload = {
          sender: { name: 'StoreWell Storage', email: 'kevin.fudge911@gmail.com' },
          to: [{ email: d.to, name: d.toName || d.to }],
          subject: d.subject || 'StoreWell',
          textContent: d.body || ' ',
          htmlContent: d.html || ('<pre>' + (d.body || '') + '</pre>')
    };
    const r = await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: { 'api-key': env.BREVO_API_KEY, 'Content-Type': 'application/json', accept: 'application/json' },
          body: JSON.stringify(payload)
    });
    const data = await r.json().catch(() => ({}));
    return json({ success: r.status < 300, status: r.status, data });
}
function json(o, status = 200) {
    return new Response(JSON.stringify(o), { status, headers: { 'Content-Type': 'application/json' } });
}
