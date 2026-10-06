import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
} from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Award,
  Github,
  Plus,
  X,
} from "lucide-react";
import { ScrambleText } from "./KineticText";
import "./WorkGallery.css";

interface GalleryProject {
  id: string;
  title: string;
  word: string;
  category: string;
  year: string;
  image: string;
  imageSize: [number, number];
  palette: string;
  ink: string;
  description: string;
  detail: string;
  stack: string[];
  url: string;
  source: string;
  devpost?: string;
  award?: string;
  notes: string[][];
}

// Dealify's award, team, architecture, and genuine screenshot are documented at
// https://devpost.com/software/bazaar-wgv16i (verified 4 October 2026).
// Devpost's repository link /Maristanez/bazaar redirects to /Maristanez/dealify.
// Image: Devpost software_photos/005/352/663/datas/original.png, browser chrome cropped.
// Other descriptions and technologies come from the existing portfolio records.
const projects: GalleryProject[] = [
  {
    id: "dealify",
    title: "Dealify",
    word: "let’s deal.",
    category: "SHOPIFY / AI COMMERCE",
    year: "2026",
    image: "/projects/dealify.webp",
    imageSize: [1800, 997],
    palette: "#162c29",
    ink: "#c9d9c6",
    description: "A shopkeeper that can talk. Rules you can trust.",
    detail:
      "An AI shopkeeper for Shopify, with deterministic TypeScript pricing, a React merchant Console, and a Gym that rehearses policies with 300 seeded synthetic shoppers.",
    stack: ["TypeScript", "Shopify", "React", "Node.js"],
    url: "https://dealifytest.myshopify.com/",
    source: "https://github.com/Maristanez/dealify",
    devpost: "https://devpost.com/software/bazaar-wgv16i",
    award: "Hack the North 2026 · Shopify: Hack Shopping with AI",
    notes: [
      [
        "The idea",
        "Help shoppers discover products and negotiate while merchants retain control of pricing.",
      ],
      [
        "The boundary",
        "A shared TypeScript engine calculates eligible offers. The AI chooses and explains an option; it cannot invent a price.",
      ],
      [
        "The merchant’s view",
        "A React Console exposes live negotiations, pricing settings, approvals, and pause controls.",
      ],
      [
        "The rehearsal",
        "The Gym tests the same engine against 300 seeded, rule-based shoppers. It compares policy outcomes, not predicted revenue.",
      ],
      [
        "The team",
        "Built with Bryan Maristanez and Ricardo Gao at Hack the North 2026.",
      ],
    ],
  },
  {
    id: "synapse",
    title: "Synapse Investments",
    word: "synapse.",
    category: "MACHINE LEARNING / FINANCE",
    year: "2025",
    image: "/projects/synapse.webp",
    imageSize: [1600, 737],
    palette: "#18262f",
    ink: "#bdcfd8",
    description: "A clearer view of a complicated market.",
    detail:
      "A stock prediction and trading application connecting machine learning with a focused web experience.",
    stack: ["React", "Python", "Supabase"],
    url: "https://synapseinvests.com",
    source: "",
    notes: [
      [
        "The idea",
        "Bring stock predictions and trading tools into one approachable application.",
      ],
      [
        "The implementation",
        "A React interface, Python and machine learning, with Supabase in the application stack.",
      ],
      [
        "The experience",
        "Market information, an AI predictor, and a learning hub give different entry points into financial data.",
      ],
    ],
  },
  {
    id: "studyflow",
    title: "StudyFlow",
    word: "find flow.",
    category: "EDUCATION / FOCUS",
    year: "2026",
    image: "/projects/studyflow.webp",
    imageSize: [1600, 732],
    palette: "#272430",
    ink: "#d0c9df",
    description: "Find a rhythm. Make room to learn.",
    detail:
      "A study workspace that brings Pomodoro sessions, goals, calendars, and learning analytics together.",
    stack: ["TypeScript", "Node.js", "Recharts"],
    url: "https://dazzling-licorice-53acc6.netlify.app/",
    source: "",
    notes: [
      [
        "The idea",
        "Keep planning, focused study, and reflection in the same workspace.",
      ],
      [
        "The implementation",
        "React and TypeScript for the interface, Node.js and Express in the stack, and Recharts for session analytics.",
      ],
      [
        "The experience",
        "A Pomodoro timer, goal tracking, study sessions, and calendar integration support the rhythm of learning.",
      ],
    ],
  },
  {
    id: "panther",
    title: "Panther Press",
    word: "our stories.",
    category: "PUBLISHING / COMMUNITY",
    year: "2025",
    image: "/projects/panther.webp",
    imageSize: [1600, 743],
    palette: "#30271f",
    ink: "#dcc7b2",
    description: "A home for the stories around us.",
    detail:
      "A school newsroom made for the people behind the stories, with a publishing system that keeps new voices coming.",
    stack: ["Astro", "React", "Keystatic"],
    url: "https://panther-press.pages.dev",
    source: "https://github.com/vpci-panther-press/panther-press",
    notes: [
      [
        "The idea",
        "Give a student-run newspaper a dedicated home for articles and issues.",
      ],
      [
        "The implementation",
        "Astro and React, with MDX and Keystatic for the content workflow.",
      ],
      [
        "The experience",
        "Readers explore articles and issues, while the content management system supports ongoing publishing.",
      ],
    ],
  },
];

export default function WorkGallery() {
  const [active, setActive] = useState(0);
  const [notesOpen, setNotesOpen] = useState(false);
  const stage = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const project = projects[active];

  useEffect(() => {
    if (notesOpen) {
      dialog.current?.showModal();
    } else if (dialog.current?.open) {
      dialog.current.close();
      opener.current?.focus({ preventScroll: true });
    }
  }, [notesOpen]);

  const move = (event: PointerEvent<HTMLDivElement>) => {
    if (
      event.pointerType !== "mouse" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    stage.current?.style.setProperty("--gallery-x", `${(x - 0.5) * 4}deg`);
    stage.current?.style.setProperty("--gallery-y", `${(0.5 - y) * 4}deg`);
    stage.current?.style.setProperty("--gallery-light-x", `${x * 100}%`);
    stage.current?.style.setProperty("--gallery-light-y", `${y * 100}%`);
  };
  const select = (index: number) =>
    setActive((index + projects.length) % projects.length);

  return (
    <section
      className="sig-work-gallery"
      id="sig-work"
      data-chapter="1"
      aria-labelledby="sig-work-title"
    >
      <div className="sg-section-heading" data-sig-reveal="">
        <div className="sg-eyebrow">
          <span>02 / SELECTED WORK</span>
          <span>IDEAS BUILT. BOUNDARIES PUSHED.</span>
        </div>
        <div className="sg-title-row">
          <h2 id="sig-work-title">
            Curiosity,
            <br />
            <em>put to work.</em>
          </h2>
          <p>
            From an everyday frustration
            <br />
            to something worth opening.
            <span>Four projects. Four different rabbit holes.</span>
          </p>
        </div>
      </div>
      <div
        className="sg-project-tabs"
        role="group"
        aria-label="Choose a project"
      >
        {projects.map((item, index) => (
          <button
            key={item.id}
            className={active === index ? "is-active" : ""}
            onClick={() => select(index)}
            aria-pressed={active === index}
          >
            <span>0{index + 1}</span>
            <ScrambleText text={item.title} />
            <ArrowUpRight size={17} />
          </button>
        ))}
      </div>
      <div
        className="sg-feature"
        style={
          {
            "--gallery-paper": project.palette,
            "--gallery-ink": project.ink,
          } as CSSProperties
        }
      >
        <div
          ref={stage}
          className={`sg-cover sg-cover-${project.id}`}
          onPointerMove={move}
          onPointerLeave={() => {
            stage.current?.style.setProperty("--gallery-x", "0deg");
            stage.current?.style.setProperty("--gallery-y", "0deg");
          }}
        >
          <div className="sg-cover-meta">
            <span>{project.category}</span>
            <span>
              PROJECT 0{active + 1} / {project.year}
            </span>
          </div>
          <div
            className="sg-cover-word"
            aria-hidden="true"
            key={`word-${project.id}`}
          >
            {project.word}
          </div>
          <svg
            className="sg-cover-lines"
            viewBox="0 0 1200 620"
            fill="none"
            aria-hidden="true"
          >
            {Array.from({ length: 9 }, (_, i) => (
              <ellipse
                key={i}
                cx="600"
                cy="345"
                rx={340 + i * 42}
                ry={80 + i * 22}
                transform={`rotate(${-18 + i * 3} 600 345)`}
              />
            ))}
          </svg>
          <a
            className="sg-screen-link"
            href={project.url}
            target="_blank"
            rel="noreferrer"
            aria-label={`Open ${project.title} live project in a new tab`}
          >
            <div className="sg-screen" key={project.image}>
              <div className="sg-screen-bar">
                <span>
                  <i />
                  <i />
                  <i />
                </span>
                <span>{new URL(project.url).hostname}</span>
                <ArrowUpRight size={12} />
              </div>
              <img
                src={project.image}
                alt={`${project.title} application screenshot`}
                loading="lazy"
                decoding="async"
                width={project.imageSize[0]}
                height={project.imageSize[1]}
              />
            </div>
            <span className="sg-explore">
              <ArrowUpRight size={24} />
              <span>
                EXPLORE
                <br />
                THE PROJECT
              </span>
            </span>
          </a>
          <div className="sg-cover-bottom">
            <span>
              SELECTED PROJECT
              <br />
              {project.year}
            </span>
            <span className="sg-stack-label">
              {project.stack[0]}
              <span>↔</span>
              {project.stack[1]}
            </span>
            <span>INTERFACE PREVIEW ↗</span>
          </div>
        </div>
        <div className="sg-project-details" key={project.title}>
          <div className="sg-project-title">
            <span className="sg-project-number">0{active + 1}</span>
            <div>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              {project.award && (
                <a
                  className="sg-award"
                  href={project.devpost}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Award size={17} />
                  <span>
                    <strong>WINNER</strong>
                    {project.award}
                  </span>
                  <ArrowUpRight size={13} />
                </a>
              )}
            </div>
          </div>
          <div className="sig-project-copy sg-project-copy">
            <p>{project.detail}</p>
            <div className="sg-tech">
              {project.stack.map((tech) => (
                <span key={tech}>{tech}</span>
              ))}
            </div>
            <div className="sg-project-actions">
              <a href={project.url} target="_blank" rel="noreferrer">
                Live project <ArrowUpRight size={15} />
              </a>
              {project.source && (
                <a
                  href={project.source}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`View ${project.title} source code`}
                >
                  <Github size={15} /> Source
                </a>
              )}
              {project.devpost && (
                <a href={project.devpost} target="_blank" rel="noreferrer">
                  Devpost <ArrowUpRight size={15} />
                </a>
              )}
              <button
                onClick={(event) => {
                  opener.current = event.currentTarget;
                  setNotesOpen(true);
                }}
              >
                Build notes <Plus size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="sg-gallery-footer">
        <div className="sg-archives">
          <a
            href="https://github.com/RitvikGoyal1"
            target="_blank"
            rel="noreferrer"
          >
            <Github size={16} /> GitHub archive <ArrowUpRight size={14} />
          </a>
          <a
            href="https://devpost.com/RitvikGoyal1"
            target="_blank"
            rel="noreferrer"
          >
            <Award size={16} /> Hackathon projects <ArrowUpRight size={14} />
          </a>
        </div>
        <div className="sg-gallery-controls">
          <button
            onClick={() => select(active - 1)}
            aria-label="Previous project"
          >
            <ArrowLeft size={18} />
          </button>
          <span>
            0{active + 1} <span>/ 04</span>
          </span>
          <button onClick={() => select(active + 1)} aria-label="Next project">
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
      <a
        className="sg-mapstem"
        href="https://apps.apple.com/us/app/mapstem/id6504693720"
        target="_blank"
        rel="noreferrer"
      >
        <span className="sg-map-icon" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <div>
          <span>SMALL SCREEN. BIG POSSIBILITIES.</span>
          <strong>mapSTEM</strong>
          <p>Connecting students with their next STEM opportunity.</p>
        </div>
        <span className="sg-store">
          Explore on the App Store <ArrowUpRight size={18} />
        </span>
      </a>
      <details className="sg-directory">
        <summary>All project links</summary>
        <div className="sg-directory-grid">
          {projects.map((item) => (
            <article key={item.id}>
              <h3>
                <a href={item.url} target="_blank" rel="noreferrer">
                  {item.title} <ArrowUpRight size={15} aria-hidden="true" />
                </a>
              </h3>
              <p>{item.detail}</p>
              <div className="sg-directory-links">
                {item.source && (
                  <a href={item.source} target="_blank" rel="noreferrer">
                    Source code
                  </a>
                )}
                {item.devpost && (
                  <a href={item.devpost} target="_blank" rel="noreferrer">
                    Devpost
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </details>
      <dialog
        ref={dialog}
        className="sg-notes"
        aria-label={`${project.title} build notes`}
        onCancel={(event) => {
          event.preventDefault();
          setNotesOpen(false);
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) setNotesOpen(false);
        }}
      >
        {notesOpen && (
          <div className="sg-notes-inner">
            <div className="sg-notes-header">
              <span>FROM THE WORKBENCH / 0{active + 1}</span>
              <button
                onClick={() => setNotesOpen(false)}
                aria-label="Close build notes"
              >
                <X size={22} />
              </button>
            </div>
            <h2>{project.title}</h2>
            <p className="sg-notes-deck">{project.description}</p>
            {project.award && (
              <a
                className="sg-award"
                href={project.devpost}
                target="_blank"
                rel="noreferrer"
              >
                <Award size={17} />
                <span>
                  <strong>WINNER</strong>
                  {project.award}
                </span>
                <ArrowUpRight size={13} />
              </a>
            )}
            <img
              src={project.image}
              alt={`${project.title} interface overview`}
              width={project.imageSize[0]}
              height={project.imageSize[1]}
            />
            {project.notes.map(([title, copy], index) => (
              <section key={title}>
                <span>0{index + 1}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </div>
              </section>
            ))}
            <div className="sg-notes-links">
              <a href={project.url} target="_blank" rel="noreferrer">
                Explore the live project <ArrowUpRight size={17} />
              </a>
              {project.devpost && (
                <a href={project.devpost} target="_blank" rel="noreferrer">
                  Award & project story <ArrowUpRight size={17} />
                </a>
              )}
              {project.source && (
                <a href={project.source} target="_blank" rel="noreferrer">
                  Read the code <Github size={17} />
                </a>
              )}
            </div>
          </div>
        )}
      </dialog>
    </section>
  );
}
