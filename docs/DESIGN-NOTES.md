# Signature and three directions for Ritvik Goyal

Three independently built Astra concepts, integrated into one React application, followed by Signature: a personal synthesis of Obsidian’s editorial confidence and Signal’s interactive energy. Open the site and use the floating exploration switcher. Each has its own layout, art direction, interaction, and Three.js scene; the inactive designs are lazy-loaded.

- `/` or `/?design=signature`: the default; dark olive, ivory, bronze, and pale mint, with kinetic type and a responsive particle field.
- `/?design=obsidian`: warm black, bronze, and a sculptural assembly.
- `/?design=atelier`: ivory, vermilion, editorial typography, and architectural form.
- `/?design=signal`: ink, mint, and an interactive orbital instrument.

The control panel can be hidden to view each design on its own.

## Signature interactions

The hero’s GPU particle ribbon changes into an RG monogram with “Break the pattern.” The field reacts to the pointer and morphs between four chapter compositions. Spring-driven letter motion, short text decode sweeps, magnetic links, staggered word reveals, and dimensional project previews keep the page tactile. A native dialog provides searchable keyboard shortcuts. Timeline tabs support arrow keys, Home, and End.

All interactions preserve native semantics or provide explicit keyboard controls. Touch users can select projects and timeline chapters directly. Ambient animation can be paused; reduced-motion preferences stop the scene loop and text effects. The WebGL scene disposes geometries, materials, listeners, and observers when switching designs. The full profile, project links, and story remain readable without WebGL.

## Content provenance

Reviewed October 3–4, 2026.

- [Current portfolio source](https://github.com/RitvikGoyal1/Portfolio): project descriptions, years, technologies, images, and live links. The original page and component source remains in the repository for reference.
- [LinkedIn profile, public search index](https://ca.linkedin.com/in/ritvikgoyal1): Toronto, Shopify, Shopify Dev Degree, and York University, 2026–2030. The search index reported a crawl the previous day. LinkedIn's full profile cannot be fetched publicly, so exact job titles and employment dates are intentionally not invented. The profile's 3,800+ hours refer to the program, not completed work experience.
- [Public GitHub profile](https://github.com/RitvikGoyal1): current Shopify/Toronto affiliation, linked repositories, and the original portrait at `public/ritvik.webp`. Signature uses `public/ritvik-duotone.webp`, the user's selected cinematic duotone direction, refined with a clean background, smoother masking and restrained sharpening. `scripts/refine-duotone.py` reproduces it with Pillow and NumPy. It preserves facial geometry through image processing, not AI generation; the original remains untouched. The five initial art studies remain available at `/portrait-options.html`.
- [Original experience timeline](https://github.com/RitvikGoyal1/Portfolio/blob/main/src/pages/Experiences.tsx): early Python/web work, TCS goIT competition, STEM·E internship, and AmberHacks. The linked goIT news article was not independently retrievable during this pass.
- [Ritvik’s Scrapyard post](https://www.linkedin.com/posts/ritvikgoyal1_hackclub-scrapyard-hackathon-activity-7307451545313271808-Mh8j): helped lead Scrapyard Toronto in 2025. Conflicting historical sponsorship amounts were omitted.
- Public LinkedIn’s index also supplied STEM Camp counseling in summer 2024 and CALICO bronze in December 2024. No private profile information was accessed. Detailed provenance sits beside the copy in `src/concepts/signature/personalContent.ts`.
- The 2024 chapter combines these with CCC, CALICO, M(IT)^2, SLCC and IgnitionHacks from the original timeline.
- [Dealify submission](https://devpost.com/software/bazaar-wgv16i): Hack the North 2026 winner in the Shopify: Hack Shopping with AI category, with Ritvik credited on the team. Its original Devpost screenshot is self-hosted as `public/projects/dealify.webp`; only browser chrome was cropped. [Project repository](https://github.com/Maristanez/dealify) supports the engineering notes. The original repository/store links redirect to the canonical project and [current demo](https://dealifytest.myshopify.com/).
- Contact: `connect@ritvikgoyal.com`, also present in the existing public resume. At the user's request, `/resume` restores the existing `public/RG.pdf` with inline preview, a new-tab link and a download action. The PDF contents are unchanged; no inferred profile updates were applied to the document.

## Design research

- [Bruno Simon](https://bruno-simon.com/): a portfolio can reward exploration with real-time 3D interaction. Inspiration is the sense of discovery, not a reproduction of the driving world.
- [Dennis Snellenberg](https://dennissnellenberg.com/): expressive scale and type with straightforward routes to the work.
- [Locomotive](https://locomotive.ca/en/work): deliberate editorial pacing and individual project identities.

All interactive artwork is procedural. No borrowed portfolio models or layouts.

## Running

```sh
npm install
npm run dev
npm run build
```

A production build creates `dist`, including a direct static `/resume/` entry. Signature is the default public homepage; design comparisons remain available through explicit `?design=` URLs. A source push does not itself confirm that a hosting deployment has completed.

## Dependency maintenance

Applied compatible dependency security updates, including Vite 6.4.3. The original repository still has audit advisories in legacy Tailwind/glob and styled-components dependency chains. These packages are not imported into the new browser application; removing the legacy source/tooling after selecting a design can simplify that remaining dependency surface. No breaking package migrations were forced.

## Verified result

- Production build and full TypeScript check pass.
- Active application, concept code, and browser tests pass ESLint.
- All 27 Playwright checks pass in the dedicated test browser: mobile/tablet/desktop, 3D controls, local images, section links, reduced motion, unavailable WebGL, design/history controls, Signal project filtering, Signature command search, timeline keyboard controls, clipboard, mobile navigation, build-note dialogs, gallery controls, reversible scroll choreography, resume routing, PDF downloads and navigation back to the portfolio.
- Additional visual review at 320px and 390px; no horizontal overflow.
- All four compiled production routes render with no page errors.
- The built resume route and refresh also pass on a plain static server without an SPA fallback. The production homepage hides comparison controls unless an explicit design URL is used.
- The normal Chrome installation interrupts remote automation under its management policy; the tests use Playwright's own test browser. No browser policy or user profile was changed.

## Signature, second iteration

The refined direction adds a continuous shaded silk mesh beneath sparse fibers, with periodic geometry/materials and eased pointer interaction. It retains the RG reveal and motion controls. A sticky native-scroll typography chapter has reversible word illumination and a static reduced-motion layout.

The work chapter uses a continuous ink surface with warm ivory, bronze, and mint. Four restrained project palettes, large framed interface captures, explicit live/source links, and keyboard-accessible build-note dialogs make the work easier to assess. Dealify leads the gallery, replacing Mail Automation, with a linked award credit and team/build notes. Captures are labeled interface previews; no prediction statistics visible in Synapse’s old marketing image are repeated as verified results.

Professional context and supporting copy are larger. A compact section navigation appears after the introduction. Comparison controls start collapsed in Signature. The email address remains stable during hover.

The finishing pass adds 2024, derives the current timeline chapter from the data, improves five-year spacing at narrow widths, adds Devpost to contact and search shortcuts, and uses accurate image aspect ratios to avoid loading shifts. The project frame grows between phone and tablet widths so Dealify’s taller capture remains visible.

Research and the initial audit are documented in [2026-DESIGN-RESEARCH.md](2026-DESIGN-RESEARCH.md).
