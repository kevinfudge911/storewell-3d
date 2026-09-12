# StoreWell project

Production is https://storewell-3d.pages.dev, served by the existing Cloudflare Pages project `storewell-3d`. The app must open OUTSIDE in the original Three.js facility model. Only the Command Center button opens the spaceship command room; Exit returns outside without resetting the visitor’s location. Keep the original outdoor buildings, movement, vehicles, units and staff features. The no-WebGL property plan is an outdoor fallback, never a spaceship dashboard. Gear must retain access to the original activity log, team, chat, character editor and help.

## Deployment continuity

- Changes to `main` run `.github/workflows/deploy-storewell.yml`, which builds, checks, and deploys the `public` directory with the existing Pages functions.
- The workflow reads the repository secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`. Use this existing deployment path.
- Before asking Kevin to recreate deployment access, check the existing workflow and his connected Google Drive for the current documents titled **CLOUDFLARE-MASTER-TOKEN — All Projects Deploy Key** and **GITHUB-MASTER-TOKEN — All Repos Deploy Key**, created September 10, 2026. They are the user-designated access handoffs. Do not assume that an older failed secret means no newer credential exists.
- Never print, commit, or put credentials into frontend files. Repository files should contain only secret names and nonsensitive deployment instructions. Follow the current user's authorization and platform permissions.

## Verification

Use Node 24. Run `npm ci` and `npm run build` before deployment. The regression checks intercept network requests and must never write to production data. Preserve the original unit status meanings and property locations.

After deployment, verify the actual production URL, including the outside starting view, entering the command room, its staff tools, room/desk/look-around controls, phone layout, search, and returning to the property. Report a deployment as complete only after Cloudflare confirms success and the live page is checked.
