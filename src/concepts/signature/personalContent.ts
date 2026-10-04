export interface StoryChapter {
  year: string;
  title: string;
  description: string;
  url: string;
}

export interface PersonalFact {
  label: string;
  value: string;
  url: string;
}

const linkedIn = "https://www.linkedin.com/in/ritvikgoyal1/";
const originalJourney =
  "https://github.com/RitvikGoyal1/Portfolio/blob/main/src/pages/Experiences.tsx";
const dealifyAward = "https://devpost.com/software/bazaar-wgv16i";

/**
 * Personal history, deliberately kept separate from decorative scene language.
 *
 * 2022/2023: the original portfolio's src/pages/Experiences.tsx.
 * The original 2022 entry links the e-waste article below; that article could
 * not be independently retrieved during this pass, so the copy claims only
 * the Python/web learning and competition win explicitly stated in the repo.
 *
 * 2024: the original timeline dates CCC, CALICO, M(IT)^2, SLCC and the second
 * hackathon, IgnitionHacks, to 2024. Public indexed LinkedIn corroborates the
 * competition participation, STEM Camp volunteering in July–August 2024,
 * and CALICO bronze in December 2024. No unverified contest placements.
 *
 * 2025: Ritvik's own public Scrapyard post, corroborated by the original
 * portfolio timeline and the event website. No uncertain funding totals.
 *
 * Current: indexed public LinkedIn profile, checked 2026-10-04, plus GitHub
 * profile listing Shopify and Toronto. 2026 marks the current chapter and
 * the start of the listed university interval, not a claimed job start date.
 * No claim that the Dev Degree program's planned hours are already completed.
 * Devpost, checked 2026-10-04, names Ritvik as a Dealify creator and records
 * the Hack the North 2026 Shopify: Hack Shopping with AI category award.
 * This is a team/category win, not an overall hackathon win or solo project.
 */
export const storyChapters: readonly StoryChapter[] = [
  {
    year: "2022",
    title: "The first lines. The first win.",
    description:
      "I learned Python and web development, built my first website and a Pygame game, and won a TCS goIT monthly competition.",
    url: "https://www.itworldcanada.com/article/ontario-teen-lands-first-place-in-the-tcs-goit-monthly-competition-for-creating-an-app-to-reduce-e-waste/486760",
  },
  {
    year: "2023",
    title: "Code leaves the classroom.",
    description:
      "I started learning React, joined STEM·E for my first software development internship, and built at my first hackathon, AmberHacks.",
    url: originalJourney,
  },
  {
    year: "2024",
    title: "Solving problems. Sharing the curiosity.",
    description:
      "I competed in CCC, CALICO, M(IT)^2 and SLCC, and joined my second hackathon, IgnitionHacks. Summer meant guiding hands-on activities at STEM Camp; December brought a CALICO bronze.",
    url: linkedIn,
  },
  {
    year: "2025",
    title: "From showing up to bringing people together.",
    description:
      "I helped lead Scrapyard Toronto, a Hack Club hackathon where students came together to turn scrappy, creative ideas into projects.",
    url: "https://www.linkedin.com/posts/ritvikgoyal1_hackclub-scrapyard-hackathon-activity-7307451545313271808-Mh8j",
  },
  {
    year: "2026 — NOW",
    title: "Learning by building. At Shopify.",
    description:
      "I’m studying Digital Technologies at York through Shopify’s Dev Degree while building at Shopify. At Hack the North, our team’s Dealify won the 2026 Shopify: Hack Shopping with AI category.",
    url: dealifyAward,
  },
];

/**
 * Short, verifiable details for an identity strip or an interactive index.
 * Toronto is independently present on the current public GitHub profile.
 * The other facts are paraphrased from public LinkedIn's indexed education,
 * volunteer experience, and awards sections. Total LinkedIn-derived display
 * copy across both exports stays below 100 words.
 */
export const personalFacts: readonly PersonalFact[] = [
  {
    label: "Home base",
    value: "Toronto, Ontario",
    url: "https://github.com/RitvikGoyal1",
  },
  {
    label: "Beyond the screen",
    value: "STEM Camp counselor · Summer 2024",
    url: linkedIn,
  },
  {
    label: "Competitive programming",
    value: "CALICO bronze · December 2024",
    url: linkedIn,
  },
  {
    label: "The next four years",
    value: "York University · 2026–2030",
    url: linkedIn,
  },
];
