# StoreWell project

Production is https://storewell-3d.pages.dev, served by the existing Cloudflare Pages project `storewell-3d`. The app must open OUTSIDE in the latest upgraded Three.js facility model. Only the Command Center button opens the pocket command tablet after the existing admin/staff sign-in gate; sign in at app entry and remember the existing admin session for every admin; opening the tablet and loading lock history must not require another sign-in; Exit returns outside without resetting the visitor’s location. Preserve the September 8 deployment’s outdoor buildings, GLB characters, uniforms, movement, vehicles, walking paths, whole-door status indicators, rounds, sounds, units and staff features. The early GitHub upload contained an older July build and must not be used as a restoration baseline. See RECOVERY.md for provenance. The no-WebGL property plan is an outdoor fallback, never a spaceship dashboard. More must retain access to the original activity log, team, chat, character editor and help.

Kevin's September 25 approved direction supersedes both the earlier command-room and opaque-white tablet designs: Command Center opens a translucent holographic tablet over the unchanged outdoor property, with thin glowing cyan edges, readable white text and colored glass controls. Keep the actual property geometry, walking, vehicles, door buttons and staff functions. Put away the tablet without moving the outdoor character. Top tabs are Action Required, All Locks, Route, Lock History, Team and Control; the brand opens Overview. Keep all nine original statuses, including Late, Lock It, Lock Off and Not rentable, with flashing red/green pending actions. Keep the original limo photograph in Control. Rounds and lock tiles follow the same property order. Kevin authorized publishing this redesign using the existing deployment credentials on September 25; deployment does not require him to sign in to the test browser.

The lock map uses actual door coordinates and building footprints. The walking route begins at C2 (the first storage door on the front building’s right/east side, just inside the open main gate at x=15,z=13), then C3, and follows walkable property lanes. Never replace this with an alphabetical list or route from the former command office. Preserve all 166 modeled doors.

The tablet hands match the retained Soldier character: black tactical gloves, worn tan armor and restrained red trim. `tablet-hands.js` observes actual controls in capture phase without replaying, delaying or intercepting their actions. The holding thumb stays on the bezel; the tapping fingertip follows the actual tap or the center of a keyboard-activated button. Character palettes follow saved choices; gloves remain covered. Preserve the Control > Tablet hands toggle, reduced-motion support and scroll/pinch suppression. `/previews/tablet-hands.html` is a public, sample-only artwork preview with no staff code, live records or network writes; its interactions are not proof of authenticated production behavior.

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

## September 25 approved tablet revision

At 2:28 PM Central on September 25, Kevin approved the reviewed orange-case
round-lock tablet, including the bottom Notifications shortcut: "Ok make this
go live." This authorizes publishing this reviewed revision to the existing
StoreWell production site; the earlier visual-review hold is satisfied.

Kevin clarified that the permanent rules saved during the Ohana build apply: no
oversized panels, boxes inside boxes or nested borders; preserve a cohesive,
dimensional design with compact readable controls. A different gradient on the
old stacked panels is not sufficient. The lock controls must be ROUND,
translucent disc locks, in all nine original status colors. Give the tablet a
slim, polished physical rim, beveled corners and a restrained cyan edge light.
The screen remains glass, with the outside visible through it. Match the
character hands to this device. Show the revised working design to Kevin before
publishing another production visual change. The `round-glass-review` preview
is sample-only and must not connect to staff services or live inventory writes.

The September 25 lock interaction is deliberately small: tap a round lock, then
choose its status inline on the same screen. Do not restore the separate full
unit page or add a modal. Keep all nine meanings and the visible red/green
Lock It/Lock Off flashing. Use the original `app.setStatus` save boundary for
shared inventory, history, exterior indicators, sounds and notifications. The
eight saved MP3 recordings map to green, red, flashred, flashgreen, blue, yellow,
purple and black; Empty has no recording in the original. Preserve the sound
bytes and saved mute preference. The isolated preview uses the same choices
and audio module, with sample-only state.

Kevin clarified that this is a large tablet. Favor a generous full-size device
and larger readable status buttons; show the large tablet review by default.
Phone width remains a compatibility check, not the design presentation.

Kevin's later September 25 correction: the outside must read as a handheld
gaming tablet case, with a rounded dimensional shell, tactile side grips,
protected corners and restrained hardware details. Keep the translucent glass.
The tablet follows the device viewport in portrait and landscape; do not lock
orientation or stretch a fixed screenshot. Lock discs, labels and grid density
resize to fit the available screen. Keep two-finger pinch on both the lock board
and property map; a pinch must never activate a lock. Preserve the current
selection and zoom through rotation. The separate review has Phone and Rotate
controls for checking the same loaded document without resetting its sample data.

Kevin's September 25 consistency revision: reuse the circled round translucent
lock artwork on every lock view, including route lists, the map and before →
after history. Unit numbers belong inside the discs; omit repeated status
labels beneath each lock. Keep one compact shared color key with all nine
original meanings. Filters and status choices are inline round glass locks,
never a white native status dropdown. Add bright orange corner/edge accents
to the graphite gaming case while retaining the transparent display. Preserve
operator, timestamps, original history IDs and all save behavior. This revision
is included in Kevin's September 25 production approval above.

Keep a visible Notifications button in the bottom bar immediately beside
Save & reports, in portrait and landscape. It opens the existing device push
subscription and alert preferences inside the tablet. Preserve saved device
preferences, report permission failures clearly, and distinguish the sample
preview subscription from an actual live-device subscription.

Kevin's post-release correction: the storage-building backdrop shown behind
the approved tablet must also appear behind the live tablet. Keep this image
in the shared tablet case styling, with a production asset path, so the review
and live command screen cannot diverge. It appears only while the tablet is
open; putting the tablet away reveals the same outdoor location and controls.
