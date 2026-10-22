# Editorial and visual audit: 14 October 2026

## Aim

Give Ritvik’s portfolio a clearer author and a more considered visual hierarchy while preserving the continuous, reversible 3D experience. There is no dependable visual test for whether a site was made with AI. The useful design question is whether a choice explains this person and this work, or could be transplanted unchanged into any portfolio.

The palette is not the problem. Violet, lime, chrome, and coral already connect six distinctive scenes. Replacing those colours with a fashionable alternative would not supply the missing specificity. The strongest opportunities were in the writing, duplicated decoration, ambiguous actions, and a few small-screen details.

## Changes

| Finding | Change | Reason |
|---|---|---|
| Header used “Independent mind. Always in the making.” | It now names Ritvik Goyal and Toronto. | The persistent header identifies the person rather than repeating a slogan. |
| Hero supported its headline with “Code is my medium. Curiosity is the whole point.” | “I’m Ritvik. I build software at Shopify. Here are a few things I’ve made.” | Keep the expressive title, then immediately establish who is speaking and what follows. |
| All three projects used interchangeable motivational copy. | Each introduction explains an actual behavior: price negotiation, experimental predictions, or Pomodoro sessions with planning. | The descriptions earn their place by helping someone decide whether to explore. |
| Repeated “BUILD NO.” captions, oversized duplicate chapter numerals, decorative coordinates, and “curious human” labels. | Removed redundant ornament; retained useful chapter navigation and factual project/biography context. | Visual detail should contribute orientation, authorship, or meaning. |
| Arrows appeared next to project headings that were not links. | Removed the nonfunctional arrows; live links name their destinations. | The interface now distinguishes headings from things a visitor can activate. |
| Nearly every action had the same pill treatment. | Utility buttons use modest corners; navigation is plain text; project notes use an underlined secondary link. The round scroll control remains. | The forms now express different jobs instead of repeating a single component. |
| Identical “Under the hood” labels and empty technical slogans inside exploded screens. | Details summaries describe their topic, and 3D layers identify actual responsibilities and technologies. | “Explode the build” reveals meaningful content rather than another marketing phrase. |
| About copy could describe almost any young developer. | Added the factual Shopify/York context and Dealify’s named collaborators. | Attribution and real context make the voice more credible without inventing personal anecdotes. |
| Useful detail was hidden inside the scene. | Added crawlable project-note links for all three projects, coordinated with the SEO work. | A visitor can leave the spectacle and inspect a build in detail. |
| The floor grid competed with body copy. | Reduced its contrast while retaining continuous spatial rails. | Preserve depth cues and give the writing more separation. |

## Small interface corrections

- Enlarged header navigation, summaries, and message links to useful touch targets.
- In immersive mode, expanded project details open in a bounded panel above the summary. Opening them no longer pushes content below a fixed viewport. In reading mode they remain ordinary flowing content.
- On very small portrait screens, omit the redundant project tagline while keeping the name, description, destination, award attribution, and details.
- Adjusted the short-phone contact composition to keep its message link above the persistent bottom bar.
- Restored spaces between words when responsive layouts hide heading line breaks.
- Set dark focus rings on the lime footer and end-state header, and kept hover text visible there.
- Removed the component’s stale-hash scrolling effect so the QA-owned journey hook can preserve the actual location when the layout changes.

## Verification

TypeScript and component/engine ESLint passed after the changes. Captured all six scenes at 1440×900, 390×844, and 320×568. The captured scenes had no horizontal document overflow. Inspected the desktop hero/project layouts, phone hero/about layouts, and both collapsed and expanded Dealify states at 320px.

At 320×568 the revised Dealify copy ends at approximately 518px. Its expanded details panel spans approximately 259–466px, leaving its summary available to close it. A final contact-specific check measured the contact copy ending at 523px, above the persistent footer controls. Earlier measurements in `artifacts/editorial-measurements.json` precede the final contact correction; `artifacts/editorial-320-contact.png` shows the corrected result.

Evidence: `artifacts/editorial-{1440,390,320}-{top,work,synapse,studyflow,about,contact}.png` and corresponding `work-open.png` captures. The QA agent owns broader browser, motion, navigation, keyboard, and production regression checks.

The portrait remains the original photograph. A generated illustration requires the separate image-generation decision and was not substituted by this audit. Visual authorship is a design judgment; these changes do not assert that the result can be proven “human-made” or guarantee an audience response.
