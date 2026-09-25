# StoreWell project

Production is https://storewell-3d.pages.dev, served by the existing Cloudflare Pages project `storewell-3d`. The app must open OUTSIDE in the latest upgraded Three.js facility model. Only the Command Center button opens the pocket command tablet after the existing admin/staff sign-in gate; sign in at app entry and remember the existing admin session for every admin; opening the tablet and loading lock history must not require another sign-in; Exit returns outside without resetting the visitor’s location. Preserve the September 8 deployment’s outdoor buildings, GLB characters, uniforms, movement, vehicles, walking paths, whole-door status indicators, rounds, sounds, units and staff features. The early GitHub upload contained an older July build and must not be used as a restoration baseline. See RECOVERY.md for provenance. The no-WebGL property plan is an outdoor fallback, never a spaceship dashboard. More must retain access to the original activity log, team, chat, character editor and help.

Kevin's September 24/25 direction supersedes the earlier command-room design: Command Center opens a bright pearl-white phone/tablet over the unchanged outdoor property. Keep the actual property geometry, walking, vehicles, door buttons and staff functions. Put away the tablet without moving the outdoor character. The tablet has Overview, Locks, Route, History, Team and More screens, with bright colored controls and all nine existing statuses. Keep the original limo photograph in More.

The lock map uses actual door coordinates and building footprints. The walking route begins at C2 (the first storage door on the front building’s right/east side, just inside the open main gate at x=15,z=13), then C3, and follows walkable property lanes. Never replace this with an alphabetical list or route from the former command office. Preserve all 166 modeled doors.

Lock history reads the complete saved lockLog with the staff session. Preserve every existing record and ID. Never replace history with current status snapshots, cap the complete history at the latest 500 entries, or add a clear-log action. The wall can preview recent changes, but its full history menu must reach the oldest saved change and offer the complete activity backup, including email and sign-in records.

## Deployment continuity

- Changes to `main` run `.github/workflows/deploy-storewell.yml`, which builds, checks, and deploys the `public` directory with the existing Pages functions.
- The workflow reads the repository secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`. Use this existing deployment path.
- Before asking Kevin to recreate deployment access, check the existing workflow and his connected Google Drive for the current documents titled **CLOUDFLARE-MASTER-TOKEN — All Projects Deploy Key** and **GITHUB-MASTER-TOKEN — All Repos Deploy Key**, created September 10, 2026. They are the user-designated access handoffs. Do not assume that an older failed secret means no newer credential exists.
- Never print, commit, or put credentials into frontend files. Repository files should contain only secret names and nonsensitive deployment instructions. Follow the current user's authorization and platform permissions.

## Verification

Staff sign-in and contact writes use the existing server-side `FIREBASE_DB_SECRET`
through `/staff-session` and `/staff-contacts`. Staff cookies are HTTP-only and
remember the verified session. Never restore browser-side password checks or make
`staffConfig` writable to anonymous clients. Contact updates patch edited fields
and verify persistence without changing inventory/history or retained settings.
Push registration uses `/push-subscription`; preserve existing device preferences.
A provider accepting a push is not proof it displayed: signed `/push-receipt`
acknowledgements are written only after the service worker displays the alert.

Use Node 24. Run `npm ci` and `npm run build` before deployment. The regression checks intercept network requests and must never write to production data. Preserve the original unit status meanings and property locations.

After deployment, verify the actual production URL, including the outside starting view, opening the tablet, its staff tools, property-map zoom, route, phone layout, search, and returning to the property. Report a deployment as complete only after Cloudflare confirms success and the live page is checked.
