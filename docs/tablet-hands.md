# StoreWell tablet hands

The animated artwork follows the retained Soldier character's worn tan armor, black tactical fabric, olive cuff and red trim. It uses the user's tablet photograph for grip and touch poses. Other saved character choices tint the armor palette; these are animated transparent sprites, not a new rig or a replacement outdoor character.

## Project assets

- `public/img/hands/soldier-grip.webp`
- `public/img/hands/soldier-tap.webp`
- `public/img/hands/character-sleeve.webp`
- `public/tablet-hands.js` and `public/tablet-hands.css`

Created with the built-in image-generation tool. The originals have genuine alpha; WebP compression retains transparency. The hand sprites are 1254 × 1254 and the sleeve is 1024 × 1536. Combined transfer size is approximately 827 KiB. The sleeve extends to the viewport edge so the wrist never appears detached inside the screen.

## Original generation prompts

### Right hand

Use case: stylized-concept.
Asset type: a single transparent PNG right-hand sprite for a working first-person holographic tablet interface in the StoreWell 3D app.
Input images: Image 1 is the user's pose and quality reference (the gloved hand tapping the tablet). Image 2 is the ACTUAL character's texture atlas, reference for its black tactical fabric, worn sand/tan armor plates, olive undersuit and red trim. Do not reproduce the atlas or the tablet.
Primary request: one anatomically correct RIGHT hand, back of hand facing viewer, index finger extended diagonally toward the upper-left to touch an invisible screen. The other three fingers curl naturally into the palm, thumb relaxed on the left side of the hand. Five fingers total. The wrist and a short forearm run toward the bottom-right. Match the reference's convincing high-quality realistic tactical glove construction and perspective, but match the existing character: black full-finger textured tactical glove with scuffed tan segmented knuckle/back-of-hand armor and an olive/black cuff, a small restrained red uniform stripe at cuff. No bare skin for this armored character.
Composition: square transparent canvas; entire hand visible except sleeve exits the bottom-right corner. The extended index fingertip must be around 16% from left and 15% from top. Hand runs diagonally from that fingertip toward wrist at 88% across, 90% down. Reasonable slender finger anatomy, no giant bulky gauntlet.
Lighting: detailed 3D game-quality rendering, soft neutral daylight, subtle cool cyan reflected light along edges from the holographic screen, soft self shadows only.
Constraints: actual transparent background with clean alpha edges; only the one right hand and short wrist, no tablet, no screen, no buttons, no text, no logos, no detached pieces, no cast background shadow. No cartoon, no icon, no wireframe, no extra fingers.

### Left hand

Use case: stylized-concept.
Asset type: a single transparent left gripping-hand sprite for the first-person StoreWell holographic tablet interface.
Input images: Image 1 is the exact RIGHT glove already made for this character: match its worn tan armor plates, black tactical fabric, muted olive sleeve and small red stripe, physical scale, lighting and rendering fidelity. Image 2 shows the desired LEFT support hand pose gripping a tablet edge; use the pose only, do not reproduce the tablet or the person.
Primary request: one LEFT hand supporting the LEFT edge of an invisible thin tablet. First-person view down onto the hand, wrist enters from bottom-left, palm angled toward the invisible tablet on the right; thumb gently hooks over the front edge at upper-right, four fingers curl naturally behind the invisible edge to support it. Relaxed convincing grip, not a pointing gesture. Back of glove visible on left, thumb is on right. Full finger black tactical gloves with lightly worn tan armor plates, olive-black cuff, small red accent. All fingers covered, matching Image 1 exactly. Realistic anatomy and fine cloth/leather detailing.
Composition: square canvas transparent everywhere outside hand. Wrist exits bottom-left corner. Thumb contact pad at approximately x=80%, y=28%, the rightmost part of the entire hand; the hand mass and curled fingers stay to LEFT of that contact point so the controls to its right remain unobscured. No long fingers poking to the right.
Lighting: soft neutral daylight and subtle reflected cyan along upper/right edges, detailed realistic game rendering.
Constraints: one left hand and short forearm only. Genuine transparent background with clean alpha. Absolutely no tablet, no screen, no frame, no object in the grip, no words or logos, no background shadows, no detached parts, no extra fingers, no cartoon.

## Behavior and verification scope

### Forearm sleeve prompt

Use case: stylized-concept.
Asset type: transparent 3D game sprite, an extensible forearm sleeve that will join under the wrist of the supplied glove.
Input image: the exact StoreWell character glove. Use only its muted olive/black woven sleeve fabric, fine realistic stitching and worn tactical materials as a style and lighting reference.
Primary request: ONLY a straight, long forearm sleeve viewed from above in first person, oriented vertically from TOP (wrist) to BOTTOM (toward elbow). No hand, no fingers, no palm. A fitted black/very dark olive tactical fabric sleeve with subtle black side seams and realistic fine woven texture. The sleeve continues out of BOTH the top and bottom canvas edges: no closed end, no cap, no exposed arm or wrist. The top is slightly narrower than the bottom, gently rounded cylindrical lighting from left to right. Keep the midsection flexible fabric, no metal armor plates, no bands or badges, no repeated pattern blocks.
Composition: portrait canvas, sleeve occupies approximately 80% of canvas width, centered, transparent margins on the left and right only. Continuous fabric all the way through top and bottom edges. Straight smooth silhouette to make stretching the middle clean.
Lighting: same soft neutral daylight and restrained cyan reflected edge lighting as the reference. Detailed realistic game render, subtle self-shading.
Constraints: genuinely transparent outside the sleeve, no hand or body, no background or cast shadow, no words or logos, no additional objects.

### Interaction behavior

Hand motion observes real button clicks. It never invokes the business action, delays a save or requests staff credentials. The holding hand stays on the left bezel. Tap motion lasts 540 ms, cancels on rapid input, scroll and pinch, and becomes a short contact ring with reduced motion. Control > Tablet hands stores the on/off choice locally. Saved character changes update the palette.

The public sample-only preview permits direct mouse and keyboard checks without live unit changes or sign-in. It contains no staff code and no production data requests. Its preview preference is separate from the real app. The existing isolated build checks still exercise all 166 unit buttons, status choices and full history without production writes. Authenticated production testing must be reported separately and never inferred from these checks.
