> October 22 update: WealthSnaps replaces Synapse in selected work. Authenticated GitHub access confirmed that `RitvikGoyal1/ExpenseManagement` is private. The repository is used as implementation evidence, not a public source-code link. The current image is a screenshot of the public concept, not the app. The Synapse notes below are historical.

## WealthSnaps implementation evidence

Reviewed on October 22, 2026 through authenticated, read-only GitHub access. No app services were run and no launch or production-readiness claim is made.

- `package.json` and `app.json`: React Native, Expo, TypeScript, Expo Router, Supabase, Google Gemini SDK, Zustand, gluestack UI, Uniwind; iOS, Android, and web configuration.
- `app/(tabs)/scan.tsx`, `services/ocrService.ts`, and `components/ui/ReceiptConfirmationModal.tsx`: connected receipt capture, structured extraction, confidence review, retries/timeouts, OCR.space fallback, and confirmation before persistence.
- `services/correctionService.ts` and `utils/duplicateDetection.ts`: merchant correction lookup and potential-duplicate detection for receipt entry.
- `services/bankStatementService.ts`, `components/bank-statement/BankStatementImport.tsx`, `BulkReviewScreen.tsx`, and `utils/statementMatching.ts`: PDF extraction, editable/selectable review, amount/date matching against receipts, and batch persistence.
- `services/databaseService.ts`, `services/storageService.ts`, and `services/authService.ts`: Supabase-backed records, document uploads, and authentication. No claim of a deployed security audit or offline-first transaction storage.
- `app/(tabs)/analytics.tsx`, `utils/analytics.ts`, and `services/aiChatService.ts`: transaction-derived analytics, net-worth data, and financial summaries passed to the chat model.
- `app/(tabs)/tax.tsx` and `services/exportService.ts`: CSV export of deductible transactions.

# Project media and source verification

Published October 14, 2026 at https://app.ritvikgoyal.com/.
Cloudflare Worker: `ritvik-playground`; release `6dd9b51a`, Ready with 100% traffic.
The upload used the frozen 84-file release in `work/releases/project-media-20261014/dist`; its SHA-256 manifest was verified before upload.

## What visitors can watch

| Project | Demo and source scope |
| --- | --- |
| Dealify | A 13.67-second preview derived from the supplied animated WebP, the original WebP, and the complete 69.8-second recording with original audio. Hosted on this domain, independently of the Shopify trial. Public source: https://github.com/Maristanez/dealify. Verified stack includes Shopify Liquid/JavaScript, React, TypeScript, Node.js and Supabase. Team attribution names Ritvik Goyal, Bryan Maristanez and Ricardo Gao. |
| Synapse Investments | Browser captures of the course library, Strategies filter, and AI Predictor coming-soon page. Live URL updated to https://synapse-investments.vercel.app/ throughout website variants and checks. The supplied https://github.com/RitvikGoyal1/synapse-investments returned 404 for signed-out visitors, so no public-source claim/link was added. Public About page credits Ritvik Goyal, Shaurya Suresh and Matthew Kim. No prediction results or performance claims were invented. |
| StudyFlow | Browser captures of a sample Mathematics subject, a running focus timer, and goal navigation. The timer was paused after capture. User confirmed no source repository. |
| Panther Press | Browser captures of the homepage, article search, Science Olympics article, and issue archive. Verified public source: https://github.com/vpci-panther-press/panther-press. GitHub reported archived February 21, 2026, GPL-3.0, 1 star. Stack verified from the manifest: Astro, React, TypeScript, Tailwind, MDX, Keystatic and Pagefind. Contributors link included. |
| mapSTEM | Public source linked at https://github.com/STEM-E-Youth-Career-Development-Program/map-app. Verified React Native, Expo, JavaScript, react-native-maps and React Navigation; GitHub showed 3 stars. The official App Store listing returned page-not-found and iTunes lookup returned no results. No recording was fabricated; this project remains a source link on the homepage. |

The Synapse, StudyFlow and Panther clips are labeled as walkthroughs assembled from browser captures, not continuous screen recordings. GitHub stars and repository visibility are observations from the review date and may change.

A credential-like exposure in the public mapSTEM README was flagged to the owner. Values were not used or copied into the website; active credentials should be checked and rotated by the repository owners.

## Playback and accessibility

`ProjectDemo` renders a static poster and recording links without JavaScript. Video sources mount only after explicit play; media pauses offscreen or when the tab is hidden and never automatically resumes. The full Dealify recording mounts only while its disclosure is open, with native controls and no autoplay. Playing one recording pauses the other. Failed previews recover to a poster, status and direct recording link. Reduced-motion visitors get the same opt-in experience.

The homepage now leads to the durable Dealify demo. All four project pages have walkthroughs, captions, verified source details where available, and factual team credits. Six canonical pages are prerendered, included in the sitemap, and checked for redirects and metadata.

## Validation

- TypeScript production build, SEO checks, scoped ESLint and whitespace checks passed.
- All 66 production browser checks passed across Chromium, Firefox and WebKit against the frozen release. This includes media request deferral, playback progression, offscreen pause, 320px layout, failed-media recovery, full-player cleanup, and no-JavaScript recording access, plus the existing device/accessibility/fallback suite. These are browser/device emulations, not physical hardware certification.
- Live checks passed for six pages, four user agents, ten canonical redirects and genuine 404 handling. User-agent checks do not impersonate verified crawler IPs.
- 54 live pages/assets, including all ten demo files and every manifest JS/CSS bundle, matched the frozen release byte-for-byte over HTTPS.
- Range requests for all five MP4s returned complete HTTP 200 responses, not partial 206 responses. The complete files were verified. Cloudflare currently does not provide partial transfer for these assets; seeking ahead can wait for a full download. Files are small, with the largest recording about 3.2 MB.
- Live Dealify preview and full recording both played with valid durations and no media error. The inspected page produced no console errors.
- IndexNow accepted six canonical URLs with HTTP 200. Receipt does not guarantee crawling, indexing, ranking or AI citations.

Evidence: `artifacts/qa-project-media.json`, `artifacts/project-media-live-verification.json`, `artifacts/project-media-range-verification.json`, and `artifacts/project-media-live.png`.
