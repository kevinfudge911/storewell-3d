STOREWELL 3D - DEPLOY KIT (rebuilt July 13, 2026)

WHAT THIS IS
  public\           = the whole app (index.html) + PWA files (manifest, icons, sw.js)
  functions\        = the backend: email.js (Brevo reports), notify.js (free push
                                                                                              alerts), sms.js (disabled - push replaced texting)
  DEPLOY-STOREWELL.bat = double-click to put everything live. Progress is written
                      to deploy-log.txt. Cloudflare login is already saved on this PC.

HOW ALERTS WORK (100% FREE - no SMS costs)
  1. Open the site on any phone/computer and tap the little bell (bottom-left).
  2. Allow notifications. That device is now subscribed (saved in Firebase).
  3. When staff mark a lock READY (or clear it) or a report is emailed,
     every subscribed device gets a push notification instantly.
  On iPhone: first add the app to the Home Screen (Share > Add to Home Screen),
  then open it from there and tap the bell.

IMPORTANT
  - The BREVO_API_KEY email secret lives in Cloudflare Pages project settings
    and survives deploys. Do not delete it.
  - If a deploy ever breaks the site: Cloudflare dash > Workers & Pages >
    storewell-3d > Deployments > pick an older one > Rollback.
  - The service worker (sw.js) only ever touches GET requests, so it can NEVER
    break lock saves or report emails again.
