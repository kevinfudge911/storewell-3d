# Bottom Notifications shortcut — September 25, 2026

Kevin requested a push subscription button beside Save & reports.

Verified deployment: https://7f063318.storewell-3d.pages.dev
Review: https://round-glass-review.storewell-3d.pages.dev/previews/tablet-hands

## Changes

- Notifications is immediately before Save & reports in the bottom bar.
- The app launches its existing push registration and device preferences inside
  the tablet. Permission and connection failures stay readable in that screen.
- The bell turns green only after registration succeeds. Existing subscriptions
  and saved alert preferences are retained. Late and Not rentable use the
  original status names in the notification choices.
- The bottom bar remains visible in both orientations. Short landscape views
  bring the actual lock choices into view above it when opening or rotating.
- The public review has a clearly labeled sample subscription and alert choices;
  it does not request permission, register a push device or call staff services.

## Verification

- Complete Node 24 build passed, including the real push client with intercepted
  requests: first registration, subscription reuse, retained preferences,
  all ten alert choices and denied-permission handling.
- Clicked Notifications, Subscribe, alert checkboxes, Save & reports and Full
  history in the deployed review. The sample subscription indicator and chosen
  preferences survived switching screens.
- At 390×844, all three footer buttons fit with no horizontal page overflow.
- At 844×390, all three footer buttons remain visible and open their screens.
- The first landscape check caught a lock-choice row clipped by the footer.
  The corrected deployment brings all nine choices into the scroll viewport
  (allowing under one CSS pixel of fractional rounding), including after rotation.
  Clicked Lock Off from that row and confirmed the sample change in History.

The live URL was checked through browser clicks and resized layouts. This
does not claim a physical phone or touchscreen test.

This review does not establish actual device push delivery or authenticated
production behavior. Production remains unchanged pending visual review.
