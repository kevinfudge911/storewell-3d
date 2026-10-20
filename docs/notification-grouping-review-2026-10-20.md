# StoreWell notification grouping — local review, October 20, 2026

Status: third local candidate for final re-review; all three P2 findings addressed plus client-clock ordering corrected. No push, PR, deployment, real notification, or production data write.

## Exact source and production provenance

- Repository: https://github.com/kevinfudge911/storewell-3d (GitHub repository ID `1361518224`).
- Base/default-branch commit: `d62247fb23c4832f9967073d8967f11095315532`.
- Isolated local branch: `codex/storewell-notification-grouping`.
- Production target: https://storewell-3d.pages.dev/ (Cloudflare Pages project `storewell-3d`).
- Latest production workflow: https://github.com/kevinfudge911/storewell-3d/actions/runs/37933869873, completed successfully October 9 at 13:01:43 UTC.
- Job `113830947763` confirms deployment `bacc4f70-4a2c-4231-ad92-68378ebbaecd`, environment `production`, status `success`, at https://bacc4f70.storewell-3d.pages.dev. Retained fire, limo and police models and limo photograph were included.
- No GitHub Releases exist; workflow/deployment records are the release evidence.
- Read-only HTTP GETs on October 20 returned 200 for the following public production files. Each exactly matched the base checkout after CRLF/LF normalization:

| Public file | SHA-256 of normalized production UTF-8 content |
| --- | --- |
| `sw.js` | `8b4412fcd48666a76706a7fe163b1585ad35a12a8b8984c9875618cb964c78d8` |
| `notifications.js` | `bbae5259d0f993e888c266604b4cd0953c63bbe51cc274e13f4f1bcbdd0678dd` |
| `vendor/dc-runtime.js` | `772dbcbd112f7857a14c0ec5ff584092405eb5f57f7a06c415cfd1ddaf8def3b` |

Functions are not public source assets. Their source provenance is established by the successful workflow at the base commit, rather than by downloading deployed backend code. The recovered September exterior remains the baseline; no July restoration or Ohana source was used.

## Existing path and change

The inline app's `setStatus` waits for `__swCommitLockChange`. `src/database-session.js` saves `lockOverrides` and a unique `lockLog` entry atomically and already returns that history key. The app then calls `public/notifications.js`, which posts to `/notify`. `functions/notify.js` encrypts a separate payload for each eligible device. `public/sw.js` displays it and acknowledges its signed receipt only after successful display.

Previously, `/notify` used a new random delivery UUID as the display tag for every request. The patch separates display grouping from that unique delivery/receipt ID:

| Activity | Visible alert behavior |
| --- | --- |
| Routine statuses: Rented, Reserved, Rented / No Lock, Ready to Rent, Empty, Not rentable | Same normalized unit and same status share the first event's group tag while consecutive server commit times are at most two minutes apart. A longer gap starts a new alert. Exact retries retain their saved identity and do not extend the rolling interval. Successful group display is recorded durably; later exact retries and grouped successors use `silent:true` even after dismissal/click and worker restart. |
| Different units or different status kinds | Separate alerts, including during the same burst. |
| Late, Lock It, Lock Off | Each distinct saved history event has its own alert. A repeat delivery for that exact unit/status/history ID replaces only itself, independent of arrival time or worker restart. |
| Reports, staff messages and test alerts | Independent alerts; no grouping is inferred from title/body. |
| Missing or malformed unit/event metadata | Safe fallback to existing independent delivery UUID behavior. A valid saved identity without a resolved server commit marker retains its exact-retry tag but cannot join a routine group. Fallback event tags and full-metadata group tags have distinct namespaces, preventing fallback contents from replacing a newer group. Older clients need a reload to save the new notification metadata. |

There are no clock buckets. Only newly saved history entries gain optional `notificationCommittedAt: serverTimestamp()` in the existing atomic status/history update. Their original `t`, ID, status meanings and other history fields are preserved; no old entry is rewritten, migrated or deleted. The staff bundle is regenerated from this source. After a confirmed save, `/notify` reads that entry's resolved commit marker with the existing server database access. It ignores client `eventAt` for grouping order. An unreadable marker returns a notification-only failure; a legacy entry without one gets an independent exact-event alert. Urgent notifications and reports do not need this extra read.

The encrypted payload carries that resolved server commit time. For routine updates, the worker persists one latest-event watermark/tag/title/body per unit/status in device-local CacheStorage `storewell-notification-state-v1`, before attempting display. After successful display it durably sets `displayed:true`; later redraws of that group request silence. A failed first display leaves that flag false, so its first successful retry retains normal alert behavior. The state survives worker restart, notification dismissal and shell-cache upgrades. Server timestamp orders events, with saved history ID as a deterministic same-millisecond tie-breaker.

Clock assessment: the installed Firebase SDK generates push keys using local time plus a server offset, but those keys still are not guaranteed commit order. Client `entry.t` also cannot distinguish a delayed old event from a later commit on a slower clock. The new server-resolved marker avoids discarding later commits solely because client time or key ordering moves backwards. Same-server-millisecond ties remain deterministic, not a claimed total sequence of database commits. See [Firebase's push-key caveat](https://firebase.blog/posts/2015/02/the-2120-ways-to-ensure-unique_68/) and [server timestamp guidance](https://firebase.google.com/docs/database/web/offline-capabilities#server_timestamps).

A delayed older routine event cannot replace the newest contents or receive a display acknowledgement. The worker redraws the persisted newest title/body under its latest tag, silently if that group has already displayed. If the user dismissed that alert, only the newest contents can reappear, quietly. This avoids silently swallowing `userVisibleOnly` pushes, which can cause browser-generated alerts; see [Google's push-event guidance](https://web.dev/articles/push-notifications-handling-messages). An exact retry of the latest saved event reuses its prior tag even after two minutes; a retry of an older event cannot resurrect a prior burst. A serialized queue protects concurrent pushes from read/write/display races. Routine storage failure rejects that display with no receipt; urgent alerts and reports do not depend on routine state storage. Failed display leaves the reserved watermark retryable by that exact event. Clearing the site's storage removes this device-local state, as it removes the app's other caches.

This is presentation grouping; every saved record remains in history and server delivery is not deduplicated. Routine repeats may have distinct history IDs. Urgent events never share the routine grouping tag. OS display behavior still depends on browser/platform notification-tag support.

The service worker shell cache advances from v43 to v46. `renotify:false` requests quiet replacement and `silent:true` protects repeats even when no visible notification remains. First routine alerts, first retries after a failed display, new bursts and distinct urgent notifications retain normal platform alert behavior.

## Scope preserved

The atomic save boundary adds only optional notification-order metadata to new entries, with no separate database path or permission change. Complete history, original fields/IDs, status update behavior, subscription handling/preferences, recipients, credentials, staff sessions, reports and deployment configuration are preserved. No production records were touched during this work. All unrelated October outdoor/tablet/inventory fixes remain in the base. Acceptance of the optional field by live database validation rules has not been write-tested because this task prohibits production writes; no rule changes or bypasses are proposed.

## Verification evidence

Node `v24.18.0`; locked `npm ci --no-audit --no-fund` succeeded (179 packages). Tests used generated keys and intercepted requests; no live messages or database writes.

- `node scripts/check-notification-grouping.mjs`: PASS. Actual encrypted server payloads enter the real worker source. Covers quiet exact retries after dismissal/restart and grouped successors after click/restart for all six routine statuses; normal first/new-burst/failed-display retry behavior; resolved commit order despite backwards client time and key order; legacy records and failed ordering reads; 119999/120000ms boundary, rolling 120000/120001ms gaps, long retries, durable stale-content protection, concurrency/ties, cache retention, separate urgent/unit/status/report behavior and truthful receipts.
- `node scripts/check.mjs`: PASS in both mocked GPU and no-GPU contexts; 166 doors, full history/export, successful save forwards the confirmed history key and persisted timestamp, failed/current-status saves do not alert.
- `node scripts/check-tablet-hands.mjs`: PASS.
- `node scripts/check-tablet-touch.mjs`: PASS (simulated touch).
- `node scripts/check-alerts.mjs`: PASS; encrypted delivery, saved preferences, selected recipients, failures/retries, client forwards unit/event identity/saved time, service-worker display.
- `node scripts/check-push-runtime.mjs`: PASS in actual local Cloudflare/workerd runtime; encrypted delivery and redirect refusal.
- `node scripts/check-session.mjs`: PASS; atomic history/status saves, original history time preserved, Firebase server-timestamp marker added only to the new entry, no separate database path, and same-key token-refresh retries.
- `node scripts/check-inventory-poll.mjs`: PASS.
- `node scripts/check-staff-access.mjs`: PASS.
- `git diff --check`: PASS.

The revised candidate's final `npm run check` completes the entire nine-script suite in one invocation with permitted loopback access for the offline workerd test. Its saved output is `../storewell-v3-regression-log.txt`. The original candidate's initial sandbox run had hit loopback `EACCES`; no production network is used by the tests.

The literal `npm run build` command hits a pre-existing Windows portability error in `scripts/bundle-staff.mjs`: `new URL(...).pathname` passes `/C:/.../src/staff.js` to esbuild. The identical esbuild configuration was run with native relative paths and successfully regenerated `public/staff.bundle.js` for the server-timestamp import and new metadata. This required generated asset is included. Panorama assets remain unchanged. The bundler portability issue is not changed here; the existing release workflow runs Linux. No claim is made that the unmodified build command succeeded on Windows.

## Review/release hold

Independent reviews confirmed the initial bucket-edge and stale-replacement P2 defects fixed, then found the remaining dismissed-alert sound P2. This candidate persists successful display and explicitly silences both exact retries and grouped successors after dismissal/click and restart. It also replaces client-clock ordering with server commit metadata. Review evidence is in `task-8/v2-review-results.json` and `task-8/review-v2/independent-edge-review.mjs`. Final independent re-review is pending.

No browser control was used; Scout retains the shared browser. Unique Market priority was not interrupted. No Ohana work was performed or delegated.

Publication is pending the explicit review hold in this task. No credentials were needed or inspected. After review, release through the existing GitHub workflow, including the new grouping check, and confirm service-worker refresh and actual OS notification replacement on an authorized test device. Real device display/sound and authenticated production behavior remain untested because this task prohibits real messages and publication.
