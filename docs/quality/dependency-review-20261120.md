# Colour Game compatible dependency review, 20 November 2026

Baseline npm audit: 1 critical, 16 high, 7 moderate, 4 low. Final full and `--omit=dev` audits: **0 vulnerabilities**. The audit JSON is recorded alongside this receipt. This describes the installed dependency graph, not an application security certification.

## Bounded changes

- Next 15.2.3 to 15.5.29 with matching eslint-config-next, within the existing framework major. npm's actual advisory graph identified the compatible fix. No framework migration or schema/auth work.
- Non-force existing-range updates repaired lint/test transitive dependencies, including brace-expansion and the existing TypeScript ESLint parser/plugin branch. No `npm audit fix --force` was used.
- Next's exact transitive PostCSS 8.4.31 was still affected by source-map file-read and stringify advisories after the Next patch. A **Next-scoped PostCSS 8.5.33 override**, within the same PostCSS major, resolves it. npm and the declared pnpm package-manager configuration carry the same scoped override; a clean npm install confirms the actual Next tree resolves 8.5.33. No global major override was applied.
- Removed unused direct package declarations `react-email`, `satori` and `@vercel/og`. Source and script scans contain no imports or CLI usage of these packages. Actual email templates and rendering retain `@react-email/components`; both actual OG routes already import `ImageResponse` from `next/og`. No source files or features were removed.

The lock needed a targeted refresh of its stale nested Next/PostCSS record before a clean install would honour the override. After refresh, `npm ci --ignore-scripts` succeeds and `npm ls next postcss --all` has no invalid nodes: Next15.5.29 uses PostCSS8.5.33. The checked-in npm lock was used for this verification; a pnpm installation was not claimed.

## Verification

After the clean install: direct local schema-to-client generation, full TypeScript, 20 Jest checks, changed-source ESLint, zero icon violations and all 11 shared icon regressions pass. No DB connection, migration, SQL, env-file access, email send, provider or scheduled generation was used. The offline actual game/Tailwind bundle was rebuilt with the repaired graph, and keyboard, mobile and Gauntlet flows were checked in Chrome. The browser receipt and labelled offline captures are in the product review.

A full Next production build remains withheld to avoid current-date prerender and unreviewed server/email/admin surfaces. Full-site lint still has existing unrelated API/worker/config errors; no blanket ignores or bypasses were introduced. Existing Next config already skips build-time lint, so build success would not establish lint success. Local dependency health and a polished client do not certify newsletter/admin security or a deployment. No push, merge or release occurred.
