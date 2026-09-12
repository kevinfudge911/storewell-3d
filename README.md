# StoreWell command bridge

StoreWell opens outside at the upgraded September storage property, with animated characters, uniforms, walking routes, whole-door status alerts and staff rounds. See RECOVERY.md for the recovered source and custom character files. Use Command Center to enter the interactive spaceship room. Room and At the desk change the viewpoint; Look around supports a full turn with touch, mouse or arrow keys. Center restores the display. On phones the same live controls use a readable, scrolling layout.

Exit returns to the same outdoor location. Find on property marks the selected unit in the original facility model. Devices without WebGL get an outdoor plan built from the same building edges and door locations. Gear includes Activity log, Team, Staff chat, My character, and How to navigate; staff operations keep the original sign-in requirement. The original unit records, locations, staff sign-in, reports and notification services are retained. Green means rented, red means locked out, and the two flashing statuses mean lock on / lock off. Counts come from the model and shared records, not from the reference artwork.

## Development

Use Node 24 and run `npm ci`, then `npm run dev`. `npm run build` bundles the staff services and runs the offline regression checks. Deploy the `public` directory with the existing Cloudflare Pages functions.

The tests exercise outside-first startup, entry and exit, staff tool access, the original model, unit search, filters, route marker, responsive control docking, and successful/rejected saves. They intercept all network requests and do not change production records. They do not replace visual testing in a GPU-enabled browser.

The GitHub workflow checks the app before deploying `main` to the existing `storewell-3d` Pages project, using the repository's existing Cloudflare secrets. Deploy with `node scripts/deploy.mjs main` so the custom model assets are retained. Runtime scripts, standard character models and room artwork are included locally in the deployment. No Cloudflare credentials are committed.
