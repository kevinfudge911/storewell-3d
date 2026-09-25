# Round glass tablet review — September 25, 2026

Kevin's active instructions: preserve the approved translucent holographic
tablet, apply the no-nested-boxes rules saved during Ohana, use round translucent
locks in the existing nine colors, and add a high-end physical tablet rim.
Show the revision before changing production again.

The working UI now has a thin polished graphite/silver rim with a cyan light
edge, continuous translucent glass, slanted tabs, compact text, and round disc
locks. Existing status writes, all 166 unit identities, route order, history,
contacts, notifications and exterior logic are preserved. Primary page groups
use dividers rather than nested framed cards. The sleeve now extends to the
screen edge during taps. Shared `lock-controls.js` and the actual tablet CSS
are used in the isolated review, so the core artwork is the implementation.

The review has fictional statuses on real modeled door positions, local-only
sample status changes/history, route browsing, search/filter, map controls,
all six sections, character palettes, hands toggle, and sample downloads. It
contains no staff services, authentication credentials, or live writes. The
review is not proof of authenticated production end-to-end verification.

The review scenery is a generated illustration, not a replacement for the
live Three.js exterior. Asset: `public/previews/storage-lane.webp`.
Built-in image generation prompt:

> Use case: precise-object-edit. Remove the entire tablet, all interface, lines, letters and graphics from the approved holographic reference. Reconstruct only the outdoor self-storage lane scenery: pale metal storage buildings, roll-up doors, slim warm lamps, reflective pavement, distant trees, blue twilight. Eye-level center-lane perspective, soft depth of field, premium materials. No tablet, hands, people, text, logos or hologram. Generic illustrated review background only; real interactive HTML overlays it.

Display font: locally hosted Rajdhani, SIL Open Font License in public/fonts/LICENSE.txt.

## Verification

`npm run build` passed with default Node 24 memory after sharing the lock SVG
symbols. Checks cover 166 modeled doors, original route, filters, complete
history, save success/failure, staff services and decorative hand behavior.

Browser review at tablet width and a 390px phone frame: each of the nine sample
status choices clicked and its result read; nine sample changes appeared in
Lock History in newest and oldest order. Route advanced C2 to C3. Search C2
returned one door; Reserved returned 18 fictional examples. Character hands
were toggled and all six sample uniform palettes selected. Team sample toggle,
reports menu and both sample download controls were clicked. These are isolated
preview interactions, not a live authenticated app audit. No live messages or
inventory writes were made. Production remains at the prior release.

## Simple choices and large tablet — September 25

Kevin asked for a simple status choice at the tapped lock and then clarified
that this is a large tablet. The shared chooser expands inline after its lock
row. All nine statuses remain; no unit page or additional modal opens. Large
layouts use 56px-high status buttons and a larger device footprint. Small-screen
compatibility remains, but present the full tablet as the design review.

The app still saves through `app.setStatus`, including its atomic shared-history
write, outside indicators, notifications and original sound mapping. Choosing
the current status is a no-op; repeated taps cannot submit twice. Failed saves
leave the prior status and show a small retry message. Live refresh keeps an
open chooser in place. Rounds keeps its checklist when the chooser opens and
refreshes it after a successful save.

The original eight embedded MP3 strings are unchanged and were compared with
both production and the September 8 source deployment
`https://37c8dac5.storewell-3d.pages.dev`. Empty was silent in that source.
Actual browser playback exposed malformed base64 and damaged frames in
Reserved and Rented · No Lock. Their playable WAV copies in `public/audio`
recover the decodable portion of the saved effects (0.419s and 0.262s); the
damaged portions could not be recovered. No replacement tones were generated,
and the source recordings remain intact for future recovery. The other six
effects use their original MP3 data with canonical base64 padding. A single
media element avoids overlapping effects; the existing saved mute preference
is retained. The sample review uses the same audio module and adds its mute
control under Control.

Final browser review: all nine C2 status choices were clicked on the large
tablet. All eight corresponding audio elements reached their `ended` event;
Empty remained silent. Nine changes appeared in sample Lock History, and
oldest-first reached the first change. Choosing the current status kept the
count at nine. A further muted status change updated its lock without starting
audio. Muting persisted across a reload; switching sound back on played the
retained Reserved effect. Board, route, list and map choices were opened; Escape
kept the route, and map zoom reached 125%. Final preview deployment:
`https://d6dee510.storewell-3d.pages.dev` (branch alias
`https://round-glass-review.storewell-3d.pages.dev/previews/tablet-hands`).
`npm run build` passed. This is review-only; production and live data were not
changed. Audio playback events were verified in the browser; this is not a
claim of listening on Kevin's own device.

A direct coordinate click on the visible C2 lock rim also opened all nine
choices. The final screenshot is the running large-tablet review, not a mockup.
