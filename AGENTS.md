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

## November 10 white screen and lock-sized choices

Kevin, November 10, 2026 (7:26 PM Central): the blue glass behind the tablet
text was hard to read, and the status choices were too small and did not grow
with the lock zoom. He asked for a white screen and choices the same size as
the locks. This supersedes the translucent blue screen for the tablet display
only; the case, hands, outdoor backdrop and every function are unchanged.

- The white screen and its lock colors live at the end of `tablet-case.css`.
  The dark design is flipped once on `.tablet-glass`; the round lock art is
  flipped back inside the filter each disc already had, with true status colors.
  Do not add per-screen color overrides or remove the flip without replacing it.
- Status choices (board menu and filter menu) use the same `--lock-base` and
  `--lock-zoom` sizing as the lock tiles. Keep them equal to the lock size at
  every zoom level, in portrait, landscape and phone width.
- Pictures inside the screen are flipped back so they keep their true colors.

## November 10 big print, fewer words, one-tap report

Kevin, November 10, 2026 (10:01 PM Central), from his phone: the print around
the locks was far too small "for us old people", there were too many words, and
Save & reports took him to another screen instead of just sending to Brad.

- `text-size.js` sets `--ui` on `#sw-tablet` (saved per device as
  `sw_text_size`); the A− / A+ buttons in the status strip change it. His phone
  reports a wide, low-density page (about 923 CSS px across), so a low-density
  touch screen starts at 2x in portrait. Words and buttons zoom with `--ui`;
  locks and status choices keep their own pinch / plus-minus size and stay
  equal to each other. Keep this control and keep the print at least this big.
- In portrait the tablet fills the whole screen (no 1000px height cap).
- Hidden as extra words (CSS only, nothing removed from the code): the FIELD
  COMMAND tagline, clock, PROPERTY OPERATIONS, the page title on lock screens,
  the route-start banner, "Pinch to resize", stop numbers on tiles, "Stops
  x–y", the lock count and the bottom-bar brand. Do not add words back without
  Kevin asking.
- Bottom bar is Alerts, Send report, History. Send report opens the existing
  report dialog and starts sending at once (Brad's email is still required,
  failures still keep the report, Save only still exists). Control > Save &
  reports still has the inventory download, history and Prepare report.

## November 11 readable workspace and voice

Kevin authorized building the revised interface live on November 11 instead of
waiting for another visual preview. This supersedes the prior review hold and
November 10 A− / A+ controls. Keep the readable white screen and physical case.

- Use a compact labeled Menu rather than six always-visible crowded tabs.
  Preserve All locks, Action required, Route, Lock history, Team and Control.
  Alerts, Send report and History stay immediately available at the bottom.
- No text-size buttons or stored text-size override. Automatic responsive sizing
  should be readable on phones and tablets. Keep the browser viewport zoom enabled
  and safe lock-board/map pinch. Scrolling or pinching must not select a status.
- Tapping a lock opens a compact, vertically scrollable labeled status list beside
  its row, with all nine unchanged meanings. Preserve the round colored discs,
  sounds, hands, and app.setStatus as the only shared save boundary.
- The color key opens only on demand. History always shows a unit identifier,
  old/new status, operator and Central time. Normalize legacy field/status names
  in presentation only; retain original archive records, IDs and full backup.
- Talk is optional. Recognition begins only from an explicit microphone button.
  A recognized or typed command is a proposal until explicit confirmation.
  Reject ambiguous units/statuses and stale proposals. Browser speech availability
  and microphone permissions vary; retain the typed-command fallback.

Run npm run build, including readable-tablet and voice checks, before deployment.
Use isolated samples and mocked services for save/report tests, never live data.

## November 11 one-tap report correction

Send report immediately sends the pending local report to the saved recipients,
including Brad's required email, without navigating away or asking for another
Send tap. A compact notice shows progress, service acceptance or retained failure.
Never equate service acceptance with recipient receipt. Dismissal preserves
pending changes; do not restore Save only. Repeated taps share the in-flight
request. Keep failed snapshots stable while newer changes remain queued, and
never resend an empty queue. Alert preferences remain per-device and unchanged.

## November 11 full-size status buttons

After reviewing his real phone screenshot, Kevin requested status choices as
full-size round lock icons matching the selected lock, with names inside the
icons and no right-side checkmark. Keep a narrow vertically scrollable chooser
anchored by the selected lock without reserving an empty grid row. Do not show
all nine in a large grid or boxed panel.
The icon itself is the button. Preserve scroll/pinch safety and existing saves.

## November 15 Team screen on phones

The phone audit found Menu > Team shifted half off the left edge with a stray
"Close menu" bar: `bridge-light.css` centers `#sw-cmd-panel` with
`transform:translate(-50%,-50%)` while the deck is open, which beat the
`.tablet-tool-host>.tablet-embedded` reset. The end of `command-tablet.css` now
resets every embedded staff tool with higher specificity. Keep it.

## November 15 action-first screen for Kevin and Mike

Kevin and Mike do the lock work, so when the signed-in staff name starts with
Kevin, Mike or Michael, Command Center opens on Action required (Lock It / Lock
Off, the flashing red/green statuses). If nothing needs action it opens on All
locks. Brad and everyone else still open on All locks. `openTablet()` has no
default screen anymore; `firstScreen()` picks it. Explicit callers (Find,
unit menus) still pass 'locks'.

## November 18 red lock run, Paid and Undo

Kevin's normal day: Brad hands out 15 to 20 Lock It (flashred) units at once,
then later one or two at a time go back to Rented when the tenant pays.

- **Run** pill on the lock screen (only when something is Lock It) opens the
  Red lock run: every Lock It unit in gate order, one at a time. Done saves
  Late (red lock on) and moves to the next. Skip and Stop are there too. Tap
  the big lock to get all nine choices, so move-outs, cleaning and every other
  color are still one tap away. The run ends with Send and Back; Send only
  sends the report when someone presses it.
- **Quick button** on top of the normal nine choices: Lock It shows Done
  (Late), Late and Lock Off show Paid (Rented). Other statuses show none. It
  uses `data-quick-status`, so the nine `[data-status]` buttons are unchanged.
- **Undo** in the save toast (stays 9 seconds) puts the lock back to what it
  was through the same `app.setStatus`, so history keeps both changes.
- Every save still goes through `app.setStatus`; nothing was removed.

## November 18 lock alerts reach every staff member

Brad set E16 to Lock Off and got no alert while Kevin's phone did. Lock alerts
were push-only, but Team > Notify Via (Email only is the default) was used only
for reports, so a staff member without a working push device got nothing.

- `/notify` still pushes to every device exactly as before (sender included).
- For Lock It and Lock Off it now also emails, through `server/lock-email.js`:
  Email only and Email + push always get the email; Push choosers get it when
  none of their devices received the push (no device or failed delivery), but
  not when they switched that alert off on every device. No notifications = none.
- Emails need a verified staff session and a matching, recent lockLog record,
  and are sent once per event (`lockEmails/<eventId>`), so retries never repeat.
- The saving phone shows a short note when it has no alert device at all.
- Check: `scripts/check-lock-email.mjs` (offline only).

## November 19 email sign-in check and tablet mismatches

- `/email` now needs a signed-in staff session (same HTTP-only staff cookie as
  Alerts and Staff chat) and a same-origin request. No session = 401, nothing sent.
  Reports and the Team email test still use it. Lock It / Lock Off emails do not:
  they go from `/notify` through `server/lock-email.js` (unchanged).
- One name for history: **History** (Menu, screen title, Overview, Reports, chooser,
  bottom bar). **Outside** only means put the tablet away (header and case key);
  the chooser's find-this-unit link is **Find**.
- Old menus say **Not rentable** (never N/A) and show Rented · No Lock in the
  tablet yellow `#ffdc77`.
- A failed save shows one message: `app.setStatus` keeps the text in
  `app._lastSaveError` and only uses the browser pop-up when the tablet is put away.
- The chooser has the old door menu's small **Application inside** check
  (`lockReady/<unit>`) and, for Not rentable, the **✎ Reason** note
  (`lockNotes/<unit>`), edited in place. Saving Not rentable reopens the chooser
  with the reason open. Status still saves only through `app.setStatus`.

## November 26 2026 alerts reach every phone (Brad had 0 devices for a week)
- functions/notify.js sends like Ohana Home: PUSH_OPTIONS {ttl:86400, urgency:'high'} and one retry on no answer, 429 or 5xx. Before: 1 hour, normal priority, no retry.
- public/notifications.js never stays silent: a signed-in device that can't get push (iPhone in Safari, in-app browser) shows the red bar with the exact fix; a sign-in that finishes after page load now runs the same check (it used to just turn the bell off).
- Test: scripts/check-alerts-reach-brad.mjs. Problem doc + plan: AI HQ "AI CREW - StoreWell: Brad gets no alerts".

## November 26 2026 alert signups stay saved (Brad kept signing up and losing it)
- What was stored: Brad 0 signups, Kevin 2, Mike 1, and no dropped (pushDead) copies at all, and no history to show when or how Brad's were lost.
- Now: only a real 410 retires a signup, and only after its dead copy is confirmed saved (a 404, 5xx or failed copy keeps it). A phone moving to a new signup no longer deletes the old one or its dead copy.
- "Alerts off on your phone" email only goes out when none of that person's phones still works.
- Every real signup change (new, moved, reassigned to another person, dropped) is written to Firebase pushLog with who, device id, push host and time. Team shows each person's last saved / last dropped time.
- Test: scripts/check-signups-stay-saved.mjs.
