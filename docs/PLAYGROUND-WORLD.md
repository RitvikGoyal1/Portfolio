# Playground — a spatial portfolio

## World contract

Travel through a giant creative portal into three working ideas, then pull back to meet their maker and open a new connection. One persistent Three.js scene, six authored stations, one reversible native scroll coordinate. Scroll owns the camera; buttons, pointer and keyboard own local experiments.

Audience: curious teenagers, collaborators and people exploring Ritvik's work. Emotional arc: curiosity → surprise → discovery → connection. Native scrolling, chapter links and a reading mode keep the experience intuitive.

## Visual bible

- Units: 1 unit ≈ 1 meter; deliberately oversized 6–12 m landmarks.
- Grammar: inflated torus portals, bevelled equipment, chrome orbital rails, precise technical labels. No unrelated particle cloud.
- Palette: ink #101115; warm white #f1f0e8; acid #d5ff5f; violet #ad91ff; coral #ff886b. Each project has one dominant accent.
- Surfaces: satin coloured polymer (roughness .28, metalness 0), brushed chrome (.2/1), matte ink (.65/0), luminous screens (sRGB, unlit). No texture grunge.
- Light: neutral environment from RoomEnvironment + one white key and violet edge light, no expensive dynamic shadows. Contact discs provide grounding.
- Lens: 40–48° desktop; explicit phone 49–55° compositions. Max .12 world-unit pointer drift; no camera roll. Depth fog separates connected stations.
- Motion: deterministic scroll transforms, camera damping 7/s, local interaction damping 6/s, slow ambient orbit. Reading mode removes travel and loops.

## Chapter / camera / scene ledger

Camera constants live in `src/concepts/forma/worldSpec.ts`. Chapters occupy 180 small-viewport heights, contact 100. Endpoints have dwell; interpolation is smoothstep. Stations connected along the negative Z axis; rails continue through the space.

| id | landmark | spatial beat | DOM / interaction | seam |
|---|---|---|---|---|
| top | oversized violet portal, chrome knot, lime satellites | approach and pass through the portal | Make something matter; Remix the world | portal rim fills peripheral view |
| work | floating Dealify console and 3 layers | turn toward an assembled machine; layers separate on scroll | AI commerce; Explode the build; native detail notes | curved rails guide travel |
| wealthsnaps | screen within orbital data rings | orbit around a data instrument | expense-tracking concept; Scatter the snapshot | foreground orbit sweeps past lens |
| studyflow | large clock ring with blocks/ticks and console | descend toward a time instrument | learning tools; Bend time | clock rim reveals following set |
| about | portrait in a rotating frame, four milestone satellites | wider view reveals the maker among the work | maker biography; résumé | frame/rails slide away |
| contact | open portal and floating star | return to an open threshold | email, contact form, social links | story remains at final endpoint |

Scene graph: world/environment (fog + shared rails); world/stations (portal, dealify, wealthsnaps, studyflow, maker, exit); lights; camera. One renderer. Chapter groups retained for reversal and culled beyond relevance. Code-generated geometry avoids a model download.

## Interaction matrix

| action | availability | response | keyboard/touch | recovery |
|---|---|---|---|---|
| remix | all immersive chapters | cycle polymer palette, orbital phase | button, Enter/Space, tap | saved until reload |
| local experiment | current project only | split console layers / scatter data orbit / expand clock | DOM button aria-pressed, mirrored 3D raycast | chapter change resets local state |
| visit project | its chapter | external link in new tab | native link | no camera disruption |
| chapter navigation | always | native hash + native scroll | links, visible focus | exact progress follows scroll |
| reading mode | always after hydration | static poster/content order, no WebGL loop | button aria-pressed | returns to same chapter |
| project notes | its chapter | native details, technical facts | summary/Enter | preserves local state |

## Asset / loading ledger

Initial DOM + self-hosted Barlow, designed SVG fallback. Lazy Three + RoomEnvironment only for motion-enabled mode. Project images and portrait load as sRGB textures after renderer init; DOM images remain fallback and links remain available if a texture fails. Geometry generated locally. No video, audio autoplay, API keys, or third-party runtime CDNs.

Budget: DPR 1.25 phone / 1.5 desktop; <90 visible draw calls; <180k visible triangles; <3 MB initial transfer. Lower DPR after sustained frame misses. Pause RAF while hidden or reading, dispose renderer, environment, geometry and materials on teardown. Context loss switches to the readable fallback. Real mobile GPU/thermal performance remains unverified until measured on hardware.

## Skills

Applied MengTo [build-threejs-scroll-worlds](https://github.com/MengTo/Skills/tree/main/agent-skills/web-design/build-threejs-scroll-worlds), including world-bible, realtime-architecture and quality-and-qa references. Earlier research: GSAP official scroll/performance guidance; Taste composition guidance. This user-directed rebuild supersedes the previous Forma visual direction. HyperFrames and Onetake were assessed, but the requested interactive, reversible world benefits from native geometry instead of a rendered film.

Repository stars checked 2026-10-14 (rounded, repository-level popularity rather than skill quality): Taste 96.2k; HyperFrames 63.5k; GSAP skills 16.4k; MengTo Skills 6.8k; Onetake 2.4k.

Review gates are performed through endpoint captures and live interaction inspection within the user's existing authorization to redesign and deploy.

## Release — 2026-10-14

Live at **[app.ritvikgoyal.com](https://app.ritvikgoyal.com/)** on Cloudflare Workers static assets. Worker: `ritvik-playground`; deployed version: `cbc1edc2`. The authenticated dashboard uploaded the complete production `dist/` directory and attached the custom domain. Future CLI releases use `npm run build` followed by `npm run deploy` after Wrangler authentication. The existing root-domain Pages project was not changed.

Live verification confirmed HTTPS and HTTP 200 for the homepage, résumé page, original PDF, world engine and fallback poster. The fetched homepage hash exactly matched the local production HTML. `/portfolio` redirects to `/#work`, and an unknown path returns the real 404 page. The production browser loaded the 3D scene without reported console errors or warnings; navigation to Dealify and its layer-explosion control worked.

### Visual and functional verification

- Captured all six chapters at 1440×900, 768×1024 and 390×844, including exploded project states. Inspected desktop and phone compositions. Recorded a complete forward and reverse scroll tour.
- Checked native scrolling, chapter links, reloading at depth, reversal, local interaction reset, reading-mode restoration, project notes, short landscape layouts, reduced motion and WebGL context-loss recovery.
- TypeScript, active-source lint, production build/prerender, SEO checks and whitespace checks passed.
- The main browser run passed 46 of 50 checks. Four obsolete assertions from the previous design were corrected, and all eight relevant checks passed in the focused rerun. The production fallback suite passed 9/9 across Chromium, Firefox and WebKit, covering JavaScript-disabled content, a 320px reduced-motion layout without a Three.js download, and WebGL failure.
- Contact success and failure flows used intercepted requests. No real messages were sent by the tests.

### Recorded runtime measurements and limits

The 1440×900 forward/reverse tour used headless Chromium while recording video. Samples ranged from 15–88 draw calls and 14,112–43,826 triangles, with up to 13 textures. Sampled rolling median frame times were 16.7–33.4 ms and p95 values were 33.4–66.7 ms. The adaptive resolution governor dropped to 70% during the tour. These measurements describe this test environment, not a sustained 60 fps guarantee.

Separate endpoint checks at 390px recorded roughly 51–53 draw calls, 30–31k triangles, a 16.7 ms rolling median and 33.4 ms p95 at full configured phone resolution. Physical phone GPU, battery and thermal behavior remain unmeasured. The complete uncompressed deployment is about 3 MB, including retained alternate designs; this is not a measurement of initial network transfer. GPU profiling and long-session heap trends were not measured.

The contact provider was previously activated by the owner. Actual inbox delivery from the new subdomain remains unverified; mocked browser success is not evidence of email receipt.

Evidence in the local repository: `artifacts/playground-live.png`, `artifacts/playground-live-dealify.png`, viewport/chapter captures, `artifacts/playground-tour.webm`, and `artifacts/playground-performance.json`.

## Painted portrait update — 2026-10-14

Integrated the hand-painted portrait supplied by Ritvik into the maker station's 3D frame and the static reading-mode image. The illustration's sage and lavender background fits the world palette. The optimized asset is `public/forma/ritvik-painted.webp`, 1024×1280 pixels, 131,622 bytes. The original photograph remains available for other existing pages.

Checked the framed composition on desktop and at 390×844; the production build, TypeScript, SEO checks and whitespace checks passed. Published through the Cloudflare dashboard as version `21e445f3` (Ready, 100%).

Ritvik subsequently authorized a tint to suit the website. Applied a subtle split-tone grade to the supplied illustration: violet shadows, warm highlights and 12% lower saturation, with facial detail and painted texture preserved. The 3D frame and static view now use `public/forma/ritvik-painted-graded.webp` (1024×1280, 154,580 bytes). This is a deterministic color adjustment, not a newly generated image. Reviewed the grade within the desktop scene; the build, TypeScript, SEO and whitespace checks passed. Cloudflare version `afa8cc26` is Ready at 100%.

## Integrated reach, editorial design and device QA release — 2026-10-14

All three requested agents completed their work. Their changes and the companion portrait update are live together at `https://app.ritvikgoyal.com/`, Cloudflare version `afa8cc26`, Ready at 100%.

- **Reach:** added prerendered Dealify, WealthSnaps and StudyFlow project-note pages, plus visible HTML résumé context; aligned canonical URLs, crawler directives, sitemap, route metadata and truthful structured data. Removed fabricated claims from dormant SEO components. Research and account-level follow-ups are documented in `REACH-RESEARCH.md`.
- **Editorial design:** replaced generic support copy with specific project behavior and accurate identity, removed decorative pseudo-technical labels, clarified links versus interactive scene controls, and refined typography, spacing, touch targets and focus. The continuous six-scene world remains. See `EDITORIAL-DESIGN-AUDIT.md`.
- **Device quality:** corrected tiny-phone collisions, bounded expanded notes, preserved logical chapter position through resize and presentation changes, removed hidden navigation from keyboard traversal, and supplied the static theme before JavaScript. See `DEVICE-QA.md`.

The exact release was frozen in `work/releases/integrated-20261014-2046/dist`. Its 73-file SHA manifest matched before and after a clean **57/57** production acceptance run across Chromium, Firefox and WebKit. That run used `index-B_PEhGGV.js`, `Forma-CldfY4eD.js` and `worldEngine-Btojt4Io.js`. The earlier full development/regression suite passed **64/64**. No failures, skips or flaky retries were recorded in these runs. The later source changes between those runs were the supplied portrait asset and its grade.

Live HTTPS verification matched 43 files byte for byte to the frozen release, including all five canonical pages, the original résumé PDF, robots, sitemap, the graded portrait, and JavaScript/CSS bundles. Live routing passed five pages under four user-agent strings, eight canonical redirects and a real 404. The public homepage loaded without reported console errors or warnings. Evidence: `artifacts/release-live-verification.json`, `artifacts/qa-production-immutable.json`, and `artifacts/integrated-live-*.png`.

IndexNow received all five canonical URLs with HTTP 202; ownership validation is pending. Receipt is not proof of indexing, ranking or AI citation.

Device and touch checks use emulation rather than physical phones. The software-renderer profiling sample recorded peaks of 107 desktop and 103 phone draw calls, above the earlier under-90 target; the frame-time collector also omits intervals of at least 150 ms. These are material performance limits, not a sustained frame-rate claim. Physical GPU, thermal/battery behavior, long-session stability, a full accessibility audit and real contact inbox delivery remain unverified. The detailed QA report separates those limits from the functional checks that passed.
