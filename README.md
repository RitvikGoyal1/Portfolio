# Ritvik Goyal — Signature & Playground

This codebase maintains exactly two designs: **Signature** for [ritvikgoyal.com](https://ritvikgoyal.com/) and **Playground** for [app.ritvikgoyal.com](https://app.ritvikgoyal.com/). Both read the same project records and X/Instagram profiles. Obsidian, Atelier, Signal, and the older portfolio implementations have been removed.

The default development homepage is a continuous Three.js scroll world live at **[app.ritvikgoyal.com](https://app.ritvikgoyal.com/)**. Native scroll travels through a giant portal, three interactive project instruments, the maker’s portrait, and an open invitation to collaborate. Code-generated geometry, self-hosted fonts, and local screenshots keep the world self-contained.

Remix the portal, explode Dealify’s layers, scatter the WealthSnaps snapshot, or bend the StudyFlow clock. Chapter links offer direct access, and Reading mode turns off the renderer. Reduced-motion preferences, WebGL failure, and JavaScript-disabled visits retain all project content and links.

See [world, camera, materials, interaction and performance ledgers](docs/PLAYGROUND-WORLD.md).

## Run and verify

```sh
npm install
npm run dev
npm run typecheck
npm run build:all
node scripts/check-seo.mjs
node scripts/check-seo.mjs --signature
npm run test:e2e
npm run test:production
```

`test:production` starts a local preview and verifies the built pages in Chromium, Firefox, and WebKit. It includes small phones, tablets, landscape layouts, keyboard and touch interaction, rotation, JavaScript-disabled content, reduced motion, WebGL fallback, project-page navigation, and failure recovery. Contact tests intercept requests; they never send real email.

`npm run build` writes Playground to `dist/`. `npm run build:signature` writes Signature to `dist-signature/`, with the root domain’s canonical URLs, sitemap, and static homepage. Use `npm run dev:signature` or `npm run preview:signature` to work on that deployment. `?design=signature` and `?design=forma` compare the two designs in either build.

WealthSnaps replaces Synapse in selected work. Its shared record describes the React Native/Expo implementation verified through the owner’s private repository, including Supabase, Gemini extraction, statement review, and analytics. The public site remains a concept and early-access waitlist; the private repository is not linked from the portfolio.

## Publish

The root domain is connected to GitHub `main` through the Cloudflare Pages project `portfolio`. Its existing `npm run build` / `dist` pipeline is preserved: Cloudflare's `CF_PAGES=1` environment selects Signature, the root-domain metadata, and `dist` as the output directory. Pushing `main` triggers this deployment; verify its GitHub Cloudflare Pages check and the live site afterward.

Playground is a separate Cloudflare Worker with static assets, `ritvik-playground`, attached to `app.ritvikgoyal.com`. After authenticating Wrangler, run:

```sh
npm run build
npm run deploy
```

The app custom domain is declared in `wrangler.toml`. Earlier Worker releases used the authenticated Cloudflare dashboard upload flow. A Pages deployment does not itself publish this separate Worker. See [world design, skills and release verification](docs/PLAYGROUND-WORLD.md).

After publishing, verify the real Cloudflare routes and notify participating search engines of the canonical URLs:

```sh
node scripts/check-routes.mjs https://app.ritvikgoyal.com
node scripts/submit-indexnow.mjs --submit
```

The IndexNow helper verifies the live ownership file and pages before submitting. Without `--submit`, it only validates the local payload. Receipt does not establish indexing or ranking. For local Cloudflare route checks, start Wrangler after building so its asset manifest matches the finished output.

Local Signature previews use `dist-signature/`; the Pages build writes the same design to `dist/` for compatibility with its existing hosting settings. The current Wrangler configuration deploys only Playground to the app subdomain. The original résumé PDF remains unchanged at `/RG.pdf` and has a dedicated `/resume` page.

## Contact form

Playground and Signature share an optional name, required reply email, and message form alongside the displayed email address. `src/concepts/signature/ContactForm.tsx` submits via [FormSubmit’s AJAX endpoint](https://formsubmit.co/ajax-documentation) to `connect@ritvikgoyal.com`. The visitor’s email is the Reply-To address. No API key or backend is required.

**Activation:** FormSubmit requires the inbox owner to click **Activate Form** in its first setup email before forwarding messages. The owner confirmed activation on October 5, 2026. Actual inbox receipt must still be distinguished from the provider accepting a request. Test using the production site, because form activation is associated with the site. Do not treat mocked browser tests as evidence of inbox delivery.

The form validates fields, includes a honeypot, disables duplicate submissions while sending, and retains drafts on errors or a 20-second timeout. FormSubmit’s spam filtering remains enabled; no CAPTCHA-disabling option is set. Requests are accepted only when both the HTTP response and provider `success` value indicate success. Visitors see a link to the provider’s privacy policy. FormSubmit documents 30-day submission retention; the app does not persist drafts or messages in browser storage.

Run `npx playwright test tests/contact.spec.ts` for isolated browser checks. They intercept all email requests and never send real messages.

## Search and quality checks

- Build-time React rendering exposes project descriptions, biography, contact links, and the resume without requiring JavaScript. Real links and native disclosure elements expose the project information.
- Home, résumé, and four project-note pages have distinct descriptions, canonical URLs, Open Graph/Twitter metadata, and a connected identity and structured-data graph. Project pages include factual authorship, source links, and breadcrumbs. No invented reviews, keyword lists, addresses, or ratings are added.
- `public/social-card.png` is a 1200×630 branded sharing image. Regenerate with `node scripts/create-social-card.mjs` after installing Playwright Chromium.
- The sitemap is generated from the same six-route registry as the prerendered pages. Canonical aliases and legacy routes redirect; unknown routes return a real 404.
- An updated `sw.js` retires the previous site's persistent caches. Fonts are self-hosted/preloaded; hashed assets use long-lived caching.
- Run `node scripts/check-seo.mjs` after a production build. For cross-browser checks install `npx playwright install chromium firefox webkit`, then run `npx playwright test`. The mobile matrix can also run with `npx playwright test tests/mobile-audit.spec.ts --browser=all`.
- See [search and AI discovery research](docs/REACH-RESEARCH.md), [editorial design audit](docs/EDITORIAL-DESIGN-AUDIT.md), and [device QA](docs/DEVICE-QA.md) for the current release. The earlier [October quality review](docs/QUALITY-REVIEW.md) is historical. Search ranking depends on indexing, competition, content, and links; the implementation does not guarantee rank.

Project walkthroughs use opt-in MP4 playback, static posters, and no-JavaScript recording links. Dealify’s full recording and original animated WebP are hosted independently of its trial store. See [project media and source verification](docs/PROJECT-MEDIA.md). Run `npx playwright test --config playwright.production.config.ts` for the production suite, including media playback, failure recovery, and no-JavaScript checks across Chromium, Firefox, and WebKit.
