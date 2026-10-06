# Ritvik Goyal — Signature & three portfolio explorations

Signature is a personal, interactive portfolio developed from the Obsidian and Signal directions. Three Astra agents contributed the procedural artwork, kinetic typography, and researched personal history. The three original explorations remain available for comparison.

| Design | Preview | Character |
| --- | --- | --- |
| **Signature** | `/` or `/?design=signature` | Shaded bronze/mint silk, scroll typography, an editorial work gallery, and a personal journey |
| Obsidian | `/?design=obsidian` | Oversized typography, warm black, interactive bronze sculpture |
| Atelier | `/?design=atelier` | Ivory, vermillion, editorial type, an architectural ribbon |
| Signal | `/?design=signal` | Navy and mint, an orbital particle instrument, filterable work |

Use “Compare designs” to open the floating switcher in development or with an explicit `?design=` URL. The production homepage presents Signature without comparison controls. The active design lives in the URL and supports browser history. Only the selected design is loaded.

## Try Signature

- Move over the name to bend the lettering; hover links and project titles to decode them.
- Select **Break the pattern** to transform the particle silk into RG. Move the pointer through it; Escape restores the scene.
- Scroll through “Curiosity becomes possibility” to illuminate the type; scroll back to reverse the progression.
- The 3D silk changes through orbit, constellation, and open arcs across the page.
- Select projects to reveal their own color, large interface preview, implementation notes, and live/source links.
- Open **Build notes**, or use the previous/next controls to explore all four projects.
- Explore the timeline with its year tabs or arrow keys.
- Use **⌘K on Apple devices / Ctrl+K on Windows and Linux** for searchable navigation and the hidden signature. On small touch layouts, use the search icon.
- Open **Resume** from navigation, contact links, or shortcuts to view `/resume`, open the existing PDF in a separate tab, or download it.
- Pause ambient motion from the header. Reduced-motion preferences and a no-WebGL fallback are supported.

The content includes a custom typographic “rg.” monogram, Toronto local time, Dealify’s Hack the North award, a complete 2022–2026 timeline, community work, and publicly verified Shopify Dev Degree / York University details.

## Development

```sh
npm install
npm run dev
```

## Verification

```sh
npm run typecheck
npm run lint
npm run build
npx playwright install chromium
npm run test:e2e
```

The suite uses a dedicated Playwright test browser. Browser checks cover mobile/tablet/desktop, actual 3D controls, image loading, section navigation, project filters, browser history, Signature keyboard navigation, shortcut search, clipboard, reduced motion, and the fallback when WebGL is unavailable.

Legacy components remain in `src/components` and `src/pages` as reference. The restored `src/pages/Resume.tsx` is actively routed; other legacy pages are not imported by the new app. ESLint reports existing warnings in those legacy components; the active application passes without warnings.

## Implementation

- React 18, TypeScript, Vite with SWC.
- Three.js with custom procedural geometry, materials, and particle shaders.
- Self-hosted Manrope and Instrument Serif fonts.
- Local optimized WebP screenshots; no remote image dependency in the active designs.
- Keyboard controls, motion preferences, scene cleanup, and responsive layouts.
- Confirmed Shopify Dev Degree / York University details; see [content sources and research](docs/DESIGN-NOTES.md).
- The second Signature iteration applies [2026 design and motion research](docs/2026-DESIGN-RESEARCH.md).

Production builds render the actual Signature homepage and resume into HTML with route-specific metadata and styles. `resume.html` uses Cloudflare Pages’ clean URL handling to serve `/resume` directly; `/resume/` redirects to that canonical URL. JavaScript adds the interactive controls; content and native links are available before it loads. Legacy paths redirect to their matching sections, and unknown paths use a real 404 page. The resume uses the repository's original `public/RG.pdf` without changing its contents. Publishing source to `main` and deploying the live host are separate operations unless hosting is configured to deploy automatically.

## Contact form

Signature includes an optional name, required reply email, and message form alongside the displayed email address. `src/concepts/signature/ContactForm.tsx` submits via [FormSubmit’s AJAX endpoint](https://formsubmit.co/ajax-documentation) to `connect@ritvikgoyal.com`. The visitor’s email is the Reply-To address. No API key or backend is required.

**Activation:** FormSubmit requires the inbox owner to click **Activate Form** in its first setup email before forwarding messages. The owner confirmed activation on October 5, 2026. Actual inbox receipt must still be distinguished from the provider accepting a request. Test using the production site, because form activation is associated with the site. Do not treat mocked browser tests as evidence of inbox delivery.

The form validates fields, includes a honeypot, disables duplicate submissions while sending, and retains drafts on errors or a 20-second timeout. FormSubmit’s spam filtering remains enabled; no CAPTCHA-disabling option is set. Requests are accepted only when both the HTTP response and provider `success` value indicate success. Visitors see a link to the provider’s privacy policy. FormSubmit documents 30-day submission retention; the app does not persist drafts or messages in browser storage.

Run `npx playwright test tests/contact.spec.ts` for isolated browser checks. They intercept all email requests and never send real messages.

## Search and quality checks

- Build-time React rendering exposes project descriptions, timeline, contact links, and the resume without requiring JavaScript. The native project directory exposes all four project links.
- Root and resume have distinct descriptions, canonical URLs, Open Graph/Twitter metadata, and a connected Person/website/page structured-data graph. No invented reviews, keyword lists, addresses, or ratings are added.
- `public/social-card.png` is a 1200×630 branded sharing image. Regenerate with `node scripts/create-social-card.mjs` after installing Playwright Chromium.
- Sitemap contains only the homepage and resume, with manually maintained factual modification dates. Legacy route redirects and a 404 document avoid duplicate/soft-404 pages.
- An updated `sw.js` retires the previous site's persistent caches. Fonts are self-hosted/preloaded; hashed assets use long-lived caching.
- Run `node scripts/check-seo.mjs` after a production build. For cross-browser checks install `npx playwright install chromium firefox webkit`, then run `npx playwright test`. The mobile matrix can also run with `npx playwright test tests/mobile-audit.spec.ts --browser=all`.
- See [October quality review](docs/QUALITY-REVIEW.md) for measured coverage and remaining external SEO work. Search ranking depends on indexing, competition, content, and links; the implementation does not guarantee rank.
