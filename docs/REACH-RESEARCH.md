# Search and AI discovery: 14 October 2026

The reach problem was structural: a visitor could explore the projects, but each project lived inside the same long, interactive page. Only the homepage and résumé had independent, indexable URLs. The release now gives Dealify, Synapse Investments, and StudyFlow their own static project notes while keeping the cinematic homepage.

## Research and decisions

Primary sources reviewed on 14 October 2026:

| Evidence                                                                                                                                                                                                                                                                                     | Decision for this portfolio                                                                                                                                                                                    |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Google: optimizing for generative AI search](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) connects AI discovery to useful, original content and the ordinary search infrastructure. It says special AI text files and query-variant pages are unnecessary. | Publish readable project notes with real implementation context; do not add `llms.txt`, hidden answer bait, or pages for keyword permutations.                                                                 |
| [Bing Webmaster Guidelines](https://www.bing.com/webmasters/help/webmaster-guidelines-30fba23a) ties search and grounding eligibility to discovery, rendering, factual clarity, canonical URLs, and crawlable links. It recommends IndexNow for changes.                                     | Link every project from the homepage, render it as HTML, keep one canonical URL, and provide an ownership-verified submission helper.                                                                          |
| [OpenAI crawler documentation](https://developers.openai.com/api/docs/bots) distinguishes OAI-SearchBot from GPTBot and user-triggered visits.                                                                                                                                               | Explicitly allow OAI-SearchBot. Preserve the existing general allow policy. Do not mislabel ChatGPT-User as a training crawler or claim that training permission earns search visibility.                      |
| [Google JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics) explains the additional rendering stage for JavaScript pages.                                                                                                          | Build real HTML for every canonical route. Core notes, images, attribution, and links work without JavaScript; the 3D renderer is not the content source.                                                      |
| [Google link guidance](https://developers.google.com/search/docs/crawling-indexing/links-crawlable) recommends standard anchors and meaningful link text.                                                                                                                                    | Add `href` links to project notes, related projects, the résumé, and supporting primary records.                                                                                                               |
| [Google canonical guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls) and [sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap) explain consistent URL signals.                               | Share one route registry across rendering, metadata, and the generated sitemap. Redirect `.html` and trailing-slash aliases. Remove obsolete, fixed `lastmod` values rather than invent freshness.             |
| [Google profile markup](https://developers.google.com/search/docs/appearance/structured-data/profile-page), [Schema.org CreativeWork](https://schema.org/CreativeWork), and [BreadcrumbList](https://schema.org/BreadcrumbList) describe truthful identity, work, and navigation markup.     | Keep a stable Person identity and ProfilePage on home; add CreativeWork and breadcrumb entities to project notes, matching visible authorship and award wording. No ratings or commercial offers are invented. |
| [Google SEO starter guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide) says Google ignores the keywords meta tag and warns against keyword stuffing.                                                                                                           | Remove keyword-stuffed legacy defaults, unverified expertise claims, and SEO-only boilerplate.                                                                                                                 |
| [IndexNow documentation](https://www.indexnow.org/documentation) and [FAQ](https://www.indexnow.org/faq) document a publicly hosted ownership file and submission to the global endpoint.                                                                                                    | Prepare a local dry run and an explicit post-deployment `--submit` action. The helper checks ownership and all live canonical pages before sending their URLs. HTTP 200/202 is receipt, not proof of indexing. |
| [Cloudflare HTML handling](https://developers.cloudflare.com/workers/static-assets/routing/advanced/html-handling/) documents static-file route behavior.                                                                                                                                    | Test with Wrangler’s local Worker runtime, including redirects and actual 404 responses. Vite preview alone does not validate `_redirects`.                                                                    |

## What changed

- `/projects/dealify`, `/projects/synapse`, and `/projects/studyflow` have individual titles, descriptions, canonical links, relevant share images, full static HTML, native links, supporting references, and a route back into the experience. They load their own small page module rather than Three.js.
- The résumé now has a visible HTML introduction and selected-project links in addition to its PDF.
- All five canonical pages have crawlable internal links. Home, résumé, and project metadata use the same verified identity and contact information.
- The build emits a five-URL sitemap from `pageRoutes`. The public sitemap mirrors it for development. Crawler directives allow indexing and snippets, and unknown project addresses return a genuine 404.
- Alternate design queries keep the homepage canonical. The client updates its title, description, social metadata, schema, and canonical together with the route, avoiding stale homepage metadata on a project page.
- Dormant legacy SEO modules no longer supply a fictional business address, a five-star review, an invented reviewer, prices, hours, default free software offers, an unverified social handle, or contradictory crawler exclusions. Those modules were not included in the active production UI; the cleanup prevents reintroducing those claims later.

## Factual boundaries

Project notes use the existing portfolio’s supplied project facts. The [Dealify repository](https://github.com/Maristanez/dealify) additionally supports the storefront responsibility and separation of conversational and pricing code. Its [Devpost submission](https://devpost.com/software/bazaar-wgv16i) identifies all three teammates and the Shopify: Hack Shopping with AI category award at Hack the North 2026. The page preserves that category, credits Bryan Maristanez and Ricardo Gao, and calls the 300 simulated shoppers synthetic test inputs.

Synapse’s model outputs remain experimental. No measured investment performance, client count, grade improvement, or productivity gain was added. No project dates were fabricated beyond the years already present in the portfolio. New pages describe the existing work rather than inventing first-person development anecdotes or metrics.

## Verification

Completed before parent integration:

- TypeScript build and lint of the affected application, metadata, build, and legacy SEO modules passed.
- Production build and `node scripts/check-seo.mjs` passed for all five canonical pages. Assertions cover static content, titles/descriptions, image files, one canonical and H1, JSON-LD identities, project team attribution, home-to-project links, sitemap, crawler policy, and 404 metadata.
- `node scripts/check-routes.mjs http://127.0.0.1:8788` passed against the local Cloudflare Worker: five HTTP 200 pages, eight HTTP 301 canonical aliases, and an unknown project returning HTTP 404.
- Each page returned identical content for browser, Googlebot, bingbot, and OAI-SearchBot user-agent strings. This checks HTTP behavior; it does not verify traffic from the crawlers’ real published IP ranges or bypass Cloudflare bot verification.
- `node scripts/submit-indexnow.mjs` validated the five-URL local submission payload. Submission is intentionally a post-deployment operation because the key and project pages must be live first.

The parent integration owns the final browser matrix, production release, live bot/header verification, and IndexNow submission. Do not treat local verification as proof that a search engine has crawled or selected a page.

## After release

1. Run `node scripts/check-routes.mjs https://app.ritvikgoyal.com` to verify the production contract.
2. Run `node scripts/submit-indexnow.mjs --submit` once for this release. It submits only public, canonical URLs on `app.ritvikgoyal.com`; it shares no contact-form contents or analytics. The ownership file is deliberately public.
3. In a verified Google Search Console and Bing Webmaster Tools property, submit the sitemap, inspect the project URLs, check any crawler/WAF denial, and record indexing plus query/click baselines. Review the available generative-AI visibility reports as well. Account access and settings were not assumed from the Cloudflare connection.
4. As projects change, publish specific implementation decisions, screenshots, and results that Ritvik can substantiate. Accurate project references from his own profiles and repositories can help people discover the work; no outreach or third-party profile edits were performed.

`ritvikgoyal.com` still hosts the prior portfolio. Two public portfolios can split links and identity signals. Choosing one long-term home and moving the other with redirects is a separate owner decision; this release does not change that domain or its DNS, and every new canonical remains on the explicitly requested `app.ritvikgoyal.com`.

Search rankings, traffic, AI citations, and indexing remain outcomes to measure. The release improves discovery eligibility and clarity; it does not guarantee distribution.

## Production verification

The combined release is live on Cloudflare Worker version `afa8cc26` (Ready, 100%), including the painted portrait update made in the companion chat. Production route checks passed for five static pages, four user-agent strings, eight canonical redirects and an actual 404. A separate HTTPS check matched 43 live files byte for byte to the frozen release, covering the five pages, robots, sitemap, original PDF, graded portrait and emitted JavaScript/CSS bundles. Evidence: `artifacts/release-live-verification.json`.

IndexNow received all five canonical URLs on 14 October 2026 and returned HTTP 202. Ownership validation is pending; this confirms receipt, not indexing, rankings or AI citations. Search Console and Bing Webmaster Tools property verification, sitemap submission and visibility baselines remain account-level follow-up work.
