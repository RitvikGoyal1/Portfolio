export type ProjectSlug = "dealify" | "wealthsnaps" | "studyflow" | "panther";

export interface ProjectDemo {
  preview: string;
  poster: string;
  width: number;
  height: number;
  label: string;
  caption: string;
  steps: string[];
  fullVideo?: string;
  animatedImage?: string;
}

export interface ProjectRecord {
  slug: ProjectSlug;
  name: string;
  title: string;
  description: string;
  category: string;
  year: string;
  lead: string;
  summary: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
  imageAlt: string;
  caption: string;
  technologies: string[];
  liveUrl: string;
  credit: string;
  sections: { title: string; paragraphs: string[] }[];
  sources: { label: string; url: string }[];
  award?: string;
  demo?: ProjectDemo;
  availability?: string;
  repository?: { url: string; label: string; note?: string };
  collaborators?: { name: string; role?: string; url?: string }[];
  homeAnchor?: string;
}

// Facts come from the existing portfolio and the linked project records.
// Keep outcomes, usage figures and individual contributions explicitly sourced.
export const projects: ProjectRecord[] = [
  {
    slug: "dealify",
    summary:
      "The language model handles the conversation. A shared TypeScript engine decides which offers are valid. A merchant Console makes negotiations visible, and a simulation tests policies against 300 seeded synthetic shoppers. Built with Bryan Maristanez and Ricardo Gao.",
    name: "Dealify",
    title: "Dealify: AI shopkeeper for Shopify | Ritvik Goyal",
    description:
      "Dealify is a Shopify negotiation project by Ritvik Goyal, Bryan Maristanez, and Ricardo Gao. Explore its storefront, pricing engine, and merchant simulation.",
    category: "Commerce / Hack the North",
    year: "2026",
    lead: "A shopper makes an offer. The shopkeeper answers. Behind that exchange, a pricing engine keeps the conversation within the merchant’s rules.",
    image: "/projects/dealify.webp",
    imageWidth: 1800,
    imageHeight: 997,
    imageAlt:
      "Dealify’s Trailhead Shopify storefront, showing outdoor products and the shopping assistant",
    caption: "Trailhead, the Shopify storefront used to demonstrate Dealify.",
    technologies: [
      "Shopify Liquid",
      "JavaScript",
      "React",
      "TypeScript",
      "Node.js",
      "Supabase",
    ],
    liveUrl: "https://dealifytest.myshopify.com/",
    credit: "Built with Bryan Maristanez and Ricardo Gao.",
    repository: {
      url: "https://github.com/Maristanez/dealify",
      label: "Public source",
    },
    collaborators: [{ name: "Bryan Maristanez" }, { name: "Ricardo Gao" }],
    availability:
      "The live Shopify store depends on a trial. The recordings below are hosted here and remain available independently of the store.",
    demo: {
      preview: "/projects/demos/dealify-preview.mp4",
      poster: "/projects/demos/dealify-poster.webp",
      width: 1280,
      height: 800,
      label: "A negotiation, in 14 seconds",
      caption:
        "Ritvik’s recorded product-page demo. The full 70-second recording also shows the merchant Console and simulator.",
      steps: [
        "Choose a product and open the shopkeeper.",
        "Make an offer and review the counter-offer.",
        "Use the full recording to see the merchant side.",
      ],
      fullVideo: "/projects/demos/dealify-full.mp4",
      animatedImage: "/projects/demos/dealify-loop.webp",
    },
    award:
      "Hack the North 2026: Shopify: Hack Shopping with AI category winner",
    sections: [
      {
        title: "The storefront is the starting point",
        paragraphs: [
          "Dealify puts negotiation on the product page. Its shopping assistant can answer questions, help find products, and present offers in the context of a Shopify store. The shopper chooses whether to accept a deal and proceed to checkout.",
          "I worked on the storefront and Shopify store: the pages a shopper sees, store setup, and the product context that the assistant uses. The pricing engine, merchant tools, and integrations were a shared team effort.",
        ],
      },
      {
        title: "Conversation and pricing have different jobs",
        paragraphs: [
          "The language model handles the exchange with the shopper. A shared TypeScript engine produces the available offers using product costs and merchant settings. Keeping those responsibilities separate gives the conversation room to feel natural while pricing stays inspectable in code.",
          "The merchant Console exposes negotiations, approvals, pricing controls, and a pause action. A simulator called the Gym runs 300 seeded synthetic shoppers through the same engine. Those shoppers are test inputs, not customer usage; the simulation is a rehearsal, not a revenue forecast.",
        ],
      },
      {
        title: "What the hackathon established",
        paragraphs: [
          "Dealify won the Shopify: Hack Shopping with AI category at Hack the North 2026. The award belongs to the team of Ritvik Goyal, Bryan Maristanez, and Ricardo Gao.",
          "The published next steps include stronger checkout enforcement, packaging the Console as an embedded Shopify app, and comparing the simulator with real order outcomes. The submission and source repository below document the project’s scope and remaining work.",
        ],
      },
    ],
    sources: [
      {
        label: "Source code and team responsibilities",
        url: "https://github.com/Maristanez/dealify",
      },
      {
        label: "Hack the North submission and category award",
        url: "https://devpost.com/software/bazaar-wgv16i",
      },
    ],
  },
  {
    slug: "wealthsnaps",
    summary:
      "In development. A React Native and Expo app with Gemini receipt extraction, reviewable bank-statement imports, and Supabase-backed transactions. Spending, cash flow, and net worth share the same workspace.",
    name: "WealthSnaps",
    title: "WealthSnaps: expense tracking in development | Ritvik Goyal",
    description:
      "WealthSnaps is Ritvik Goyal’s React Native and Expo finance app in development, with Gemini receipt extraction, PDF statement imports, Supabase, and spending analytics.",
    category: "Mobile / Personal finance",
    year: "2026",
    lead: "Scan a receipt, review the details, and see it in the bigger picture. WealthSnaps brings expenses, statement imports, and net worth into one app.",
    image: "/projects/wealthsnaps.png",
    imageWidth: 1280,
    imageHeight: 720,
    imageAlt:
      "WealthSnaps landing page showing its expense-tracking concept with sample net worth and a receipt",
    caption:
      "The public WealthSnaps landing page, captured October 2026. This image shows the product concept with sample data; the app is in development.",
    technologies: [
      "React Native",
      "Expo",
      "TypeScript",
      "Supabase",
      "Google Gemini",
      "Zustand",
      "gluestack UI",
      "Uniwind",
    ],
    liveUrl: "https://wealthsnaps.com/",
    credit: "A project by Ritvik Goyal.",
    availability:
      "In development. The public website offers a product concept and early-access waitlist. The app implementation includes the flows described below; the landing-page preview uses sample data.",
    sections: [
      {
        title: "Extract, then review",
        paragraphs: [
          "The receipt flow accepts a camera capture or an imported image. Google Gemini extracts structured fields including the merchant, amount, date, category, and line items. A confirmation screen highlights fields with low model-reported confidence and lets the user correct the result before saving.",
          "The extraction service bounds retries and request timeouts, then falls back to OCR.space and text parsing if Gemini fails. That fallback marks its fields for closer review. Duplicate checks compare the merchant, amount, and date against existing transactions, while saved merchant corrections can inform later scans.",
        ],
      },
      {
        title: "Import statements into the same ledger",
        paragraphs: [
          "PDF bank and credit-card statements pass through a separate Gemini extraction flow. The resulting transactions go to a bulk-review screen where the user can edit merchant names and choose which rows to save.",
          "A statement’s merchant label can differ from the original receipt. The review flow therefore checks amounts and nearby dates against saved receipts, leaving potential matches unselected by default. Selected rows are saved in a batch, with a link to the source PDF when its upload succeeds.",
        ],
      },
      {
        title: "A shared app and data model",
        paragraphs: [
          "The app uses React Native, Expo Router, and TypeScript, with iOS, Android, and web targets. Supabase handles authentication, transaction and net-worth records, and document storage. Zustand holds the application state; gluestack UI and Uniwind support the interface.",
          "Transactions feed spending breakdowns and cash-flow views, while asset and liability entries form the net-worth view. The Gemini chat service receives those financial summaries as context for questions. Tax-related transaction fields and CSV export provide another way to review and use the records.",
        ],
      },
      {
        title: "What’s public today",
        paragraphs: [
          "The app is still in development. The public WealthSnaps website presents an interactive concept and an early-access waitlist. Its sample finances illustrate the product direction; they are not customer usage or measured financial outcomes.",
        ],
      },
    ],
    sources: [
      {
        label: "Explore WealthSnaps and early access",
        url: "https://wealthsnaps.com/",
      },
    ],
  },
  {
    slug: "studyflow",
    summary:
      "Pomodoro sessions, goals, calendars, and learning analytics share one workspace. Built with React and TypeScript, with Node.js, Express, and Recharts in the stack.",
    name: "StudyFlow",
    title: "StudyFlow: study planning and Pomodoro sessions | Ritvik Goyal",
    description:
      "StudyFlow is Ritvik Goyal’s study management project: Pomodoro sessions, goals, a calendar, and learning analytics built with React, TypeScript, and Recharts.",
    category: "Learning / Productivity",
    year: "2026",
    lead: "A study plan only helps if it meets you at the desk. StudyFlow brings the plan, the timer, and the record of your sessions into one workspace.",
    image: "/projects/studyflow.webp",
    imageWidth: 1600,
    imageHeight: 732,
    imageAlt:
      "StudyFlow dashboard with study goals, a session timer, and learning analytics",
    caption:
      "The StudyFlow dashboard, bringing sessions and planning into one view.",
    technologies: [
      "React",
      "TypeScript",
      "Recharts",
      "Node.js",
      "Express",
      "Tailwind CSS",
    ],
    liveUrl: "https://dazzling-licorice-53acc6.netlify.app/",
    credit: "A project by Ritvik Goyal.",
    demo: {
      preview: "/projects/demos/studyflow-walkthrough.mp4",
      poster: "/projects/demos/studyflow-poster.webp",
      width: 1280,
      height: 720,
      label: "From a subject to a focus session",
      caption:
        "Browser captures show a clearly labelled sample subject and a real timer interaction. The sample is demonstration data, not a record of study outcomes.",
      steps: [
        "Create a sample mathematics subject.",
        "Set a target of ten study hours.",
        "Select the subject and start a 25-minute focus timer.",
      ],
    },
    sections: [
      {
        title: "From a goal to a session",
        paragraphs: [
          "StudyFlow is a study management platform with an interactive dashboard, Pomodoro timer, goal tracking, session analytics, and calendar integration. Planning and focused work share the same workspace instead of requiring a separate tool for each step.",
          "The timer gives a study session a boundary. Goals describe what the session is for, while the calendar helps place that work in the week. Session analytics give the user another way to review their activity afterward.",
        ],
      },
      {
        title: "The implementation",
        paragraphs: [
          "The interface uses React and TypeScript, with Recharts for data visualization. Node.js and Express are included in the project stack, alongside Tailwind CSS for styling.",
          "Charts belong next to the work they describe. In StudyFlow, the dashboard brings session analytics back to the same place where the next session gets planned. Open the project below to explore the timer, goals, and calendar together.",
        ],
      },
    ],
    sources: [
      {
        label: "Explore the StudyFlow application",
        url: "https://dazzling-licorice-53acc6.netlify.app/",
      },
    ],
  },
  {
    slug: "panther",
    summary:
      "A student newsroom with article search, issue archives, and a publishing workflow built with Astro, React, MDX, and Keystatic.",
    name: "Panther Press",
    title: "Panther Press: a student newsroom | Ritvik Goyal",
    description:
      "Explore Panther Press, Victoria Park Collegiate Institute’s student newspaper: article search, issue archives, and a publishing workflow built with Astro, React, and Keystatic.",
    category: "Student publishing / Editorial",
    year: "2025",
    lead: "A home for the school’s stories. Find an article, follow a topic, or open an entire issue of the student newspaper.",
    image: "/projects/panther.webp",
    imageWidth: 1600,
    imageHeight: 900,
    imageAlt:
      "Panther Press student newspaper homepage with its editorial introduction and article navigation",
    caption: "The Victoria Park Collegiate Institute student newspaper.",
    technologies: [
      "Astro",
      "TypeScript",
      "React",
      "Tailwind CSS",
      "MDX",
      "Keystatic",
      "Pagefind",
    ],
    liveUrl: "https://panther-press.pages.dev/",
    credit: "Developed with the VPCI Panther Press web team.",
    repository: {
      url: "https://github.com/vpci-panther-press/panther-press",
      label: "Source · GPL-3.0",
      note: "This repository was archived in February 2026. Its source and live reading experience remain available.",
    },
    homeAnchor: "message",
    demo: {
      preview: "/projects/demos/panther-walkthrough.mp4",
      poster: "/projects/demos/panther-poster.webp",
      width: 1280,
      height: 720,
      label: "Find a story. Open an issue.",
      caption:
        "A walkthrough assembled from browser captures of the homepage, article search, a Science Olympics story, and the issue archive.",
      steps: [
        "Open the student newsroom.",
        "Search for Science Olympics.",
        "Read the matching story and browse past issues.",
      ],
    },
    sections: [
      {
        title: "Built around readers and writers",
        paragraphs: [
          "Readers can browse sections, search articles, and explore past issues. The public source uses Astro and React for the site, Pagefind for search, and MDX with Keystatic for publishing.",
        ],
      },
      {
        title: "A team publication",
        paragraphs: [
          "The articles, photography, and issues belong to the student publication and its credited contributors. The linked repository documents the web team’s work, its GPL-3.0 license, and the underlying blog-template attribution.",
        ],
      },
    ],
    sources: [
      {
        label: "Archived source and project documentation",
        url: "https://github.com/vpci-panther-press/panther-press",
      },
      {
        label: "Repository contributors",
        url: "https://github.com/vpci-panther-press/panther-press/graphs/contributors",
      },
      { label: "Read Panther Press", url: "https://panther-press.pages.dev/" },
    ],
  },
];

export function projectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}
