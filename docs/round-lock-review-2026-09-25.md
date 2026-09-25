# Round lock consistency review — September 25, 2026

Review only: https://round-glass-review.storewell-3d.pages.dev/previews/tablet-hands
Final review deployment: https://b8acda33.storewell-3d.pages.dev

Kevin requested the circled round glass lock design throughout the tablet,
unit numbers on the locks, one shared color key, matching filters and orange
accents on the graphite tablet case. The review uses fictional statuses and
never loads staff code, connects to inventory services, or writes live records.

## Changes

- All nine original status definitions and sound mappings remain unchanged.
- A shared disc owns its color and pending-action animation. Board, route,
  route list, inline choices and history use it; map markers reuse the same SVG
  geometry at each door's real position.
- History shows the original before → after states with the unit on both locks.
  Staff, date/time, record IDs, search/order/activity filters and complete
  archive export remain. Unknown historical states are shown as recorded,
  without inventing a color or disc status.
- One small, unboxed color key stays beneath the scrollable display. Repeated
  status captions were removed from lock tiles and route entries.
- Status filtering uses inline glass choices; history order/activity use text
  buttons instead of native selects.
- Bright orange corner bumpers and small grip/edge accents retain the black
  physical case and transparent screen.
- The original status save boundary and outside scene are unchanged. The
  production-ready tablet adapters also match Overview and retained Rounds
  buttons to the same discs.
- Rotation now brings an open choice row into view, retaining selection and zoom.

## Browser interaction evidence

Using the actual review URL in Chrome (not DOM-only test assertions):

- Opened and closed each of the **166 distinct board lock buttons**. Each
  displayed the correct unit and all nine inline choices.
- Clicked all **11 status filters**. Visible counts matched the initial
  sample inventory: 166 total; 38 pending; green/red/flashred/flashgreen 19
  each; blue/yellow/purple/white/black 18 each.
- Changed C2 through all nine statuses and verified its displayed status and
  each matching before/after history entry. History search and both order
  buttons worked. A same-status selection closes without creating a change.
- The media element reported playing for red, flashred, flashgreen, blue,
  purple, black and green. The recovered yellow recording was separately
  verified through ended. Empty has no original recording; this pass does
  not claim a human listened to or judged the recordings.
- Route starts at C2, then C3; Previous, Next and Open lock controls worked.
  All 166 route/list/map entries use shared discs. A list lock and a map lock
  opened their choices. A map change appeared in History.
- Map +/− changed 100% → 125% → 100%. Lock sizing changed to 120%, survived
  rotation, then reset to 100%.
- Portrait 390×844: three board columns, no horizontal page overflow.
  Landscape 844×390: seven columns at 100%, no horizontal page overflow.
  Selected C2 retained its nine choices on rotation. After the final fix,
  all nine choice buttons fit inside the visible landscape page bounds.
- Sound edge button muted/unmuted, Stow hid the tablet, and Open command tablet
  returned. Team, Control, Save & reports and Lock History tabs opened.
- A new downloaded sample-history JSON was inspected on disk: 12 sample
  changes, including the most recent flashgreen → yellow change. The browser
  download event timed out even though the file arrived. A subsequent sample
  CSV click did not produce a new confirmed file in this browser session;
  this pass does not claim a new end-to-end CSV download was verified.

## Offline checks and limits

Node 24, `npm ci`, and the complete `npm run build` passed. The gate covers
GPU/no-GPU entry, 166 door mappings, route/filter behavior, all launchers,
611 lock changes plus the email archive record, original history IDs, failed
and confirmed saves, hands, gesture suppression, notifications and staff access.
Network is intercepted in these checks: no production writes or messages.

Browser checks above use mouse/keyboard interactions and real layout resizing.
Two-finger touch events are covered by the gesture test, but no physical
phone/touchscreen pinch was available. The authenticated production app and
actual push/email delivery were not retested as part of this visual revision.
Production remains unchanged until Kevin reviews this design.
