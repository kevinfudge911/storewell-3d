# StoreWell report email repair — November 1, 2026

Kevin confirmed that the authorized delivery-test email arrived for Brad, while
Save and Send reports did not. Brad's saved address and Email + push preference
were verified in the initial investigation. No provider or contact change is
part of this repair.

Production before this change: Cloudflare deployment
`ec1d61f7-0668-447b-8f24-0e58b8ff6fe2`, October 20, 2026, source commit
`912de3f9e4d1fb5c9de58af8761f9757f289e43e`. The live root HTML,
staff bundle, command tablet and service worker matched that source. Public
copies were retained before editing, with a local backup branch at that commit.

Confirmed defects: the retained report action cleared its changes and claimed
success without awaiting delivery. Its separate sender could abort on another
recipient before reaching Brad. The current report dialog also sent channels
sequentially and kept unsent changes and accepted-delivery receipts only in
memory. A reload lost the report. There is insufficient historical telemetry to
prove which path caused the specific missing report on Kevin's device.

All retained entry points now open the same report dialog. Every sent report
requires Brad's email, independently of his phone-alert preference. Recipient
channels start independently, so another recipient cannot hold up Brad's email.
Email failure retains the report even when push succeeds. Confirmed changes
persist locally per staff member, and accepted-delivery receipts survive a
reload so pending retries do not repeat an accepted channel. Save only remains
an explicit choice to finish without sending. No report sends automatically
on reload. Original inventory, lock history and saved contact/device settings
are unchanged. The worker shell cache advances to v47.

Validation: Node 24, npm ci, and the complete npm run build regression suite
passed. Added cases cover required Brad email with push-only or disabled alert
preferences, another recipient stalling, successful push with failed email,
retry-only-pending behavior across refresh, unsent report restoration, confirmed
history identity, and retained report controls preserving pending changes.
All automated provider and database requests are intercepted. No production
lock changes or additional test messages were sent during this repair.

The existing signed-in production browser was used to inspect report controls.
Actual post-repair report arrival and physical phone/tablet acceptance must not
be claimed solely from the automated tests or provider acceptance.
