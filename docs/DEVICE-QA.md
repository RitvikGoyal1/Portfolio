# Device and environment QA

Audit date: 2026-10-14. Scope: the default Playground portfolio and the three project-note pages. This is an evidence record, not a claim that every device or browser is perfect.

## Problems found and fixed

- **Small phone content collisions.** The 320×568 Dealify chapter overlapped the fixed bottom rail, and expanded notes could leave the viewport. The small-phone composition was tightened; expanded notes now use a bounded panel in immersive mode. The contact chapter received a separate short-screen composition. Normal reading mode retains native, in-flow details.
- **Layout changes lost the current chapter.** A viewport resize reused pixel scroll offsets, which map to a different chapter after reflow. Changing presentation could restore an outdated URL hash after manual scrolling. The journey hook now preserves a logical position across viewport and presentation changes and restores the URL anchor on initial load.
- **Hidden navigation remained keyboard-focusable.** The chapter rail disappears over the message area. It now also becomes inert while hidden.
- **The footer focus ring disappeared against its background.** Its inherited lime outline matched the lime footer. Footer and tail-navigation focus rings now use ink.
- **Reading-mode expansion regression caught during review.** An early position-preservation implementation moved the page 34px when notes expanded. Content-size changes now retain browser scroll behavior; viewport changes perform logical restoration. A regression test covers this distinction.
- **Static document theme was missing.** The prerendered root depended on JavaScript to set its design attribute. The HTML now includes the correct theme before scripts run, including the intended anchor scrolling and color scheme.
- **Small navigation targets.** The mobile header and project-note summaries now provide 44px-tall targets. The automated checks require at least 24px width and 44px height for the sampled touch controls.

## Acceptance matrix

`playwright.production.config.ts` runs the production suite serially across bundled Chromium, Firefox and WebKit. It uses the built site on `http://127.0.0.1:4173`.

| Coverage                                                                              | Environments                                                                                                                                                                       |
| ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| All six scenes, copy bounds, hidden-panel ownership, project controls, expanded notes | 320×568, 390×844, 768×1024, 1366×768, 1920×1080 in each engine                                                                                                                     |
| Touch input                                                                           | Phone and tablet contexts, including tap navigation and controls; Firefox uses touch with a desktop rendering context because Playwright does not support Firefox mobile emulation |
| Keyboard                                                                              | Skip link, native details, local scene control, visible focus, hidden-rail bypass; WebKit uses Option+Tab to follow its macOS link-traversal convention                            |
| Motion and rendering                                                                  | Reduced motion with no Three.js download; WebGL creation failure; context loss at depth; scene-chunk network failure                                                               |
| Navigation                                                                            | Deep links, browser Back/Forward, resize, portrait/landscape changes, stale URL hashes, reading-mode expansion                                                                     |
| Reflow                                                                                | 320px width and 720×450 CSS viewport, equivalent to the layout available at 200% zoom on a 1440×900 desktop viewport                                                               |
| Project notes                                                                         | All three routes at 320px, JavaScript enabled/disabled, loaded project images, return-to-chapter links, notes links and browser Back                                               |
| Contact                                                                               | A failed request retains and refocuses the draft; an intercepted retry succeeds. No real message is sent                                                                           |
| Contrast                                                                              | Sampled reading-mode text against solid backgrounds, and keyboard focus against the lime footer                                                                                    |

The default development suite also exercises retained alternate designs, résumé, contact validation/timeout handling, and the continuous forward/reverse journey at 1440×900, 768×1024 and 390×844. Its legacy assertions were updated only where the design intentionally changed labels.

## Completed regression runs

The initial integrated runs finished with zero failures, skips or flaky retries:

| Run                                        | Result           | Duration       | Evidence                              |
| ------------------------------------------ | ---------------- | -------------- | ------------------------------------- |
| Production acceptance                      | **57/57 passed** | 91.98 seconds  | `artifacts/qa-production-final.json`  |
| Development and retained-design regression | **64/64 passed** | 282.49 seconds | `artifacts/qa-development-final.json` |

These are per-suite execution counts. The 14 device cases also run against development, so the counts are not a claim of 121 independent features. The production matrix is 19 specifications across each of three engines. Browser versions bundled with Playwright 1.63.0: Chromium 153.0.8010.12, Firefox 155.0 and WebKit 26.6.

The successful production run started at 20:36:22 UTC and exercised `index-DEldmx-H.js` / `Forma-Df6Qt3Z7.js`. The successful development run started at 20:38:03 UTC. Both included the static document theme, fixed project-header spacing, small-phone contact clearance and reading-mode expansion correction. TypeScript and scoped lint for the changed runtime/tests also passed. Later release builds integrated the painted portrait. The final bundle received a separate acceptance run below.

Solid-background text samples ranged from 7.74:1 to 16.50:1; tested footer focus outlines exceeded 3:1. These measurements intentionally exclude translucent labels over changing 3D imagery.

Final small-phone note-panel capture: `artifacts/qa-small-phone-notes.png`. The development journey tests also refreshed all chapter captures at 1440, 768 and 390px under `artifacts/playground-*`.

## Final release acceptance

The full production matrix passed again against the immutable 73-file release at `work/releases/integrated-20261014-2046/dist`: **57/57 passed**, zero failures, skips or flaky retries. The run started at **20:49:03 UTC** and took **96.22 seconds**, using a separate preview server on port 4175. Evidence: `artifacts/qa-production-immutable.json` and `work/playwright-immutable.config.ts`. No rebuild ran during this check.

The accepted bundle contains `index-B_PEhGGV.js`, `Forma-CldfY4eD.js`, `worldEngine-Btojt4Io.js`, and the graded painted portrait. All 73 files matched the frozen SHA-256 manifest before and after testing:

- Manifest SHA-256: `399a9f2c8c8d04586561fce49c474caabba849920d3f472785144712756cb405`.
- Home HTML SHA-256: `24eac5e6845d83dd87e615dadd25172dc2d061f68d22e990b866bc8833b95699`.
- Evidence: `artifacts/qa-immutable-hashes-before.json` and `artifacts/qa-immutable-hashes-after.json`.

The release coordinator confirmed Cloudflare version `afa8cc26` as Ready at 100% traffic on `app.ritvikgoyal.com`. Its separate live verification matched 43 served files byte-for-byte with the frozen release, including home/project HTML, application assets and the painted portrait; see `artifacts/release-live-verification.json`. Production route checks also passed for five pages across four user agents, eight redirects, and the missing-page response.

## Runtime measurements

`artifacts/device-runtime-measurements.json` records a local production-preview sample starting at 20:43:10 UTC against `index-DehwTgcO.js` / `Forma-cPhxFlPQ.js`. Chromium 153.0.8010.12 used ANGLE/SwiftShader software rendering, with emulated device pixel ratio 2. Each viewport traversed the scenes forward and backward, then performed five reading/experience remounts with forced JavaScript garbage collection.

| Measurement                           | 1366×768 desktop viewport   | 390×844 phone viewport      |
| ------------------------------------- | --------------------------- | --------------------------- |
| Initial canvas pixels                 | 2049×1152                   | 487×1055                    |
| Maximum sampled draw calls            | 107                         | 103                         |
| Maximum sampled triangles             | 52,686                      | 49,584                      |
| Texture counts during travel          | 6–13                        | 6–13                        |
| Engine rolling median range           | 33.3–66.7 ms                | 16.7–33.4 ms                |
| Engine rolling p95 range              | 50.0–116.7 ms               | 33.4–83.4 ms                |
| Forced-GC heap, first → fifth remount | 7,043,496 → 7,403,472 bytes | 7,039,432 → 7,465,648 bytes |

The resolution governor reached 70% in both runs. The engine's frame collector excludes intervals of 150 ms or more; its rolling values are bounded diagnostics, not a complete end-user frame-time distribution. Software-renderer results do not establish physical-phone frame rates. The observed draw-call maxima exceed the earlier under-90 target in `PLAYGROUND-WORLD.md`; that budget is not met in these samples. Triangle counts remain below the 180,000 target.

Texture count returned to six at the hero after each remount. JavaScript heap grew modestly across the short sample, so it does not prove absence of leaks or long-term memory stability. Encoded resource bodies summed to 921,157 and 967,025 bytes respectively during the local tours; these totals do not measure real-network initial transfer or Core Web Vitals. Later release bundle changes also mean these measurements are context, not performance certification of the final deployment.

## Limits of the evidence

Device sizes and touch are emulated on this computer. They are not physical iPhone, Android or tablet tests. Bundled WebKit is useful Safari-engine coverage but does not reproduce Safari's complete application shell, iOS browser chrome, virtual keyboard or device GPU. The zoom check verifies equivalent CSS reflow, not a manual browser-zoom gesture. Contrast samples cover solid backgrounds; they do not prove every animation frame or translucent overlay meets a contrast ratio. No screen-reader user study, full WCAG conformance audit, sustained thermal/battery test, or real contact inbox-delivery test was performed.

Reference criteria: W3C's [minimum target size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html), [text contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html), and [visible focus](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html). The audit uses these as specific checks rather than claiming complete conformance.
