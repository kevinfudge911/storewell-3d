# StoreWell command bridge

The opening page is the interactive command room. Room and At the desk change the viewpoint; Look around supports a full turn with touch, mouse or arrow keys. Center restores the display. On phones the same live controls use a readable, scrolling layout.

Exit and Find on 3D property open the original facility model. The original unit records, locations, staff sign-in, reports and notification services are retained. Green means rented, red means locked out, and the two flashing statuses mean lock on / lock off. Counts come from the model and shared records, not from the reference artwork.

## Development

Use Node 24 and run `npm ci`, then `npm run dev`. `npm run build` bundles the staff services and runs the offline regression checks. Deploy the `public` directory with the existing Cloudflare Pages functions.

The tests exercise the original model, unit search, filters, route marker, responsive control docking, and successful/rejected saves. They intercept all network requests and do not change production records. They do not replace visual testing in a GPU-enabled browser.

The GitHub workflow checks the app before deploying `main` to the existing `storewell-3d` Pages project, using the repository's existing Cloudflare secrets. Runtime scripts and room artwork are included locally in the deployment. No Cloudflare credentials are committed.
