# Upgraded exterior recovery — September 12, 2026

The first GitHub upload contained a July version of StoreWell. It is not the latest outdoor app. Do not restore that version as the exterior baseline.

The newer exterior was recovered from the rendered HTML and scripts in the September 8 Cloudflare deployment `37c8dac5-aad8-45e4-aa0e-6185f0d8b771`. That version adds animated GLB characters, uniforms, names, optimized walking routes around buildings, whole-door lock alerts, rounds, staff tools, history and status sounds. Its component, character system and staff modules are now in this repository. Only the Command Center entrance opens the new spaceship room. Exit restores the exterior location.

The September 8 upload omitted the custom character model files. The August 19 deployment `fc403072-736d-456c-bd4b-92f85ff2769e` still contains Kevin's Limo Driver, Police and Firefighter models and limo picture. Their content hashes are recorded in `scripts/recovered-assets.json`. They are retained in the owner account's Pages asset store, not checked into GitHub. Do not delete that source deployment until the model bytes have been backed up in this repository.

`scripts/deploy.mjs` verifies these retained assets through the authenticated Cloudflare API, uploads the local app to a preview using pinned Wrangler, preserves the compiled Pages Functions, and merges the custom assets into the final manifest before deploying the requested branch. A missing retained model stops deployment before production changes. The workflow uses the existing repository secrets. New local model files take precedence over the retained versions.

The four standard character models and matching Three.js GLTFLoader are bundled locally. This removes dependencies on the original CDN model URLs. Their sources are listed in `public/models/ATTRIBUTION.txt`.

Compatibility repairs preserve purple as Ready to Rent, yellow as Rented / No Lock, and white as Empty. All modeled doors retain alert/frame metadata. The app can still open an outdoor plan when WebGL is unavailable. Staff edits remain sign-in protected, failed writes do not display as saved, and realtime updates do not trigger duplicate notifications.

Run Node 24, `npm ci`, and `npm run build`. Offline checks parse the real Soldier geometry, skeleton and animation, verify exterior routes and inventory, and exercise both GPU-state and no-GPU entry/exit paths and staff tools without writing production data. Image decoding and GPU rendering are mocked; these checks cannot replace a visual check on a GPU-enabled device.
