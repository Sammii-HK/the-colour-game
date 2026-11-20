# Colour Game product review, 20 November 2026

## Source and ownership

Main baseline `243408d` had one uncommitted owner file: `src/components/ColourGame.tsx`, a Gauntlet draft (+251/-100). Its exact bytes were copied in isolation and saved separately as `b5f0891`; attribution and SHA256 are in `owner-game-baseline-20261120.json`. This follow-up builds on that draft. Main and its draft remain untouched. Integrating must retain both the owner contribution and these repairs, rather than replace the owner's main checkout wholesale.

## Actual behaviour repaired

- A pure round state machine accepts a single nonblank answer, holds feedback, then advances only through Next colour. User-controlled progression replaces uncancelled timers, prevents duplicate points and gives feedback time to be read. Switching modes/difficulties starts a clean run. Focus moves to Next and back to the next answer control.
- Owner Gauntlet rules remain three correct per stage, Easy 10 / Medium 20 / Hard 30 points, and one miss ends the run. Hard continues at 30 points per correct answer. Practice score/best remain separately labelled.
- Sampling is bounded, uses Fisher-Yates and deduplicates rendered hex values, so aqua/cyan cannot appear as different-looking alternatives. Immediate equivalent target repeats are excluded. Trimmed, case-insensitive CSS aliases count in typed answers, including grey/gray and aqua/cyan.
- Legacy browser storage keys are preserved. Corrupt history/high scores are validated; denied reads or writes cannot stop play. A yesterday streak stays alive until today has been missed. History uses the browser's local calendar, not a cross-device record.
- Answer controls have labels, native form submission, 44px targets, selected mode states, visible keyboard focus, an announced feedback message and clear comparison swatches. Score copying reports success or failure without opening a placeholder social post.
- The home game card is width-limited. Unsupported 1000+ users and upload-gallery claims are removed. Random practice is explicitly separate from the date-hashed reference colour. No shared leaderboard, server-saved game or identical daily questions is claimed.
- UI icons throughout checked site source use Lucide; unused decorative email glyphs are omitted. Shared icon lint is part of normal lint and build, with all 11 canonical regressions retained. No admin/email action was executed.

## Checks and limits

19 Jest checks pass, including actual mounted game duplicate clicks, focus, blank hard submissions and denied persistence; pure engine promotion/scoring/alias/sampling/streak checks; existing date-colour helper checks. The 11 shared icon regressions pass; icon scan reports zero violations. Changed TypeScript/TSX files pass ESLint. Full TypeScript passes after direct local Prisma client generation from checked-out schema; no database connection, schema change, env-file access or SQL was used.

The full-site lint still exposes legacy errors in unrelated API/worker/config sources. No lint bypass was added. Full Next production build is withheld because it prerenders current date content and includes email/admin/server surfaces outside this offline review. `next.config.ts` already ignores build-time ESLint; this is not counted as verification.

`scripts/review-game.mjs` bundles only the actual game client and Tailwind CSS with esbuild, excludes Next routes/layout/email/analytics/date-reference code, and serves a clearly labelled local review at 127.0.0.1:4830 with CSP `connect-src 'none'`. It is a real random game client, not a provider simulation or live deployment. Browser evidence is recorded separately below once checked.

Existing date-colour hashing/timezone semantics, newsletter/admin security and scheduled delivery are unchanged and unaudited in this lane. No backend generation, live date route, email, provider, DB, push, merge or deployment ran. Baseline dependency audit was 1 critical / 16 high / 7 moderate / 4 low; the separate dependency receipt records its remediation. This is not a release-ready claim.

## Browser receipt

The client-only review was exercised on Chrome at default 1144px and a temporary 390px viewport. Native Enter scored a correct practice answer once (10), disabled answer controls, and focused Next colour. Enter on Next restored focus to the next answer. Hard mode has a labelled input; invalid Enter submission showed a complete comparison rather than a blank or silent result. At 390px document width equalled 390, and all observed buttons/input were 44px high.

Gauntlet actual play advanced three Easy correct answers to Medium at 30 points; a Medium miss preserved 30 and opened a summary of 3 Easy / 0 Medium / 0 Hard. A final keyboard repair focuses Try again when the answer control disappears; it was reloaded and verified. Practice best survived reload, remained separately labelled, and the fixture origin alone gained local play history. No clipboard write/social sharing was exercised. The viewport was reset to 1144px and the browser handed back.

Local, ignored captures (client-only review, not production screenshots):
- `.codex-artifacts/colour-game-feedback-desktop.jpg`: correct Practice answer, disabled alternatives and visible Next focus.
- `.codex-artifacts/colour-game-gauntlet-mobile.jpg`: 390px actual random Gauntlet with rules, counts and four choice controls.

The first review harness forced a white card while the browser used system dark styling. The harness was corrected to use the site's light/dark surface classes before evidence was captured. No fake output or hard-coded target was substituted.
