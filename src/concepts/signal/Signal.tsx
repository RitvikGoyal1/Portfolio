import { useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Check,
  Copy,
  Github,
  Linkedin,
  Menu,
  Pause,
  Play,
  Plus,
  Radio,
  X,
} from "lucide-react";
import Orbit from "./Orbit";
import "./signal.css";

const projects = [
  {
    id: "01",
    name: "Mail Automation",
    fullName: "Mail Automation Dashboard",
    type: "AI · PRODUCTIVITY",
    year: "2026",
    description: "A little less inbox. A little more headspace.",
    detail:
      "An email workspace with AI summaries, editable replies in your writing style, and a clearer view of what needs your attention.",
    stack: ["React", "TypeScript", "Vite"],
    image: "/projects/mail.webp",
    url: "https://automations-dashboard-jyx8.vercel.app/",
    category: "Web",
  },
  {
    id: "02",
    name: "Synapse Investments",
    fullName: "Synapse Investments",
    type: "AI · FINTECH",
    year: "2025",
    description: "Making sense of a world that never stands still.",
    detail:
      "A stock prediction and trading application exploring how machine learning can make financial information more useful.",
    stack: ["React", "Python", "Supabase"],
    image: "/projects/synapse.webp",
    url: "https://synapseinvests.com",
    category: "Web",
  },
  {
    id: "03",
    name: "StudyFlow",
    fullName: "StudyFlow",
    type: "EDUCATION · WEB APP",
    year: "2026",
    description: "Find your focus. Keep your momentum.",
    detail:
      "A study workspace that brings Pomodoro sessions, goals, analytics, and a calendar together, so the next step always feels clear.",
    stack: ["TypeScript", "Node.js", "Recharts"],
    image: "/projects/studyflow.webp",
    url: "https://dazzling-licorice-53acc6.netlify.app/",
    category: "Web",
  },
  {
    id: "04",
    name: "mapSTEM",
    fullName: "mapSTEM",
    type: "COMMUNITY · MOBILE",
    year: "2025",
    description: "The next big discovery might be around the corner.",
    detail:
      "An iOS app that connects students with STEM events, built with React Native and Firebase and published on the App Store.",
    stack: ["React Native", "Expo", "Firebase"],
    image: "",
    url: "https://apps.apple.com/us/app/mapstem/id6504693720",
    category: "Mobile",
  },
];

function Mark({ small = false }: { small?: boolean }) {
  return (
    <svg
      viewBox="0 0 42 42"
      fill="none"
      aria-hidden="true"
      width={small ? 28 : 36}
      height={small ? 28 : 36}
    >
      <path
        d="M9 29V13h11c6 0 7 9 0 9H9m12 0 10 9M29 9v13"
        stroke="currentColor"
        strokeWidth="2.2"
      />
      <path
        d="M5 5h8M5 5v8m32 24h-8m8 0v-8"
        stroke="currentColor"
        strokeWidth="1.4"
      />
    </svg>
  );
}

export default function Signal() {
  const [expanded, setExpanded] = useState(false);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeProject, setActiveProject] = useState(0);
  const [filter, setFilter] = useState("All");
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [time, setTime] = useState("");
  const project = projects[activeProject];

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(preference.matches);
    const updatePreference = () => setReducedMotion(preference.matches);
    preference.addEventListener("change", updatePreference);
    const updateTime = () =>
      setTime(
        new Intl.DateTimeFormat("en-CA", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          timeZone: "America/Toronto",
        }).format(new Date()),
      );
    updateTime();
    const timer = window.setInterval(updateTime, 60000);
    return () => {
      preference.removeEventListener("change", updatePreference);
      window.clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (!copied) return;
    const timeout = window.setTimeout(() => setCopied(false), 2500);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText("connect@ritvikgoyal.com");
      setCopied(true);
    } catch {
      window.location.href = "mailto:connect@ritvikgoyal.com";
    }
  };

  return (
    <div className="signal">
      <a className="signal-skip" href="#signal-work">
        Skip to work
      </a>
      <header className="signal-header">
        <a
          className="signal-brand"
          href="#signal-home"
          aria-label="Ritvik Goyal, back to top"
        >
          <Mark />
          <span>
            Ritvik Goyal
            <span className="signal-brand-sub">
              INDEPENDENT MIND. BUILDER AT HEART.
            </span>
          </span>
        </a>
        <nav
          className={menuOpen ? "signal-nav is-open" : "signal-nav"}
          aria-label="Main navigation"
        >
          <a href="#signal-work" onClick={() => setMenuOpen(false)}>
            Selected work <span>04</span>
          </a>
          <a href="#signal-about" onClick={() => setMenuOpen(false)}>
            About
          </a>
          <a href="#signal-contact" onClick={() => setMenuOpen(false)}>
            Say hello <ArrowUpRight size={14} />
          </a>
        </nav>
        <span className="signal-local">
          <span className="signal-status-dot" />
          TORONTO, CA <span>{time}</span>
        </span>
        <button
          className="signal-menu"
          type="button"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      <main>
        <section
          className={`signal-hero ${expanded ? "signal-hero-expanded" : ""}`}
          id="signal-home"
          aria-labelledby="signal-title"
        >
          <div className="signal-hero-copy">
            <div className="signal-eyebrow">
              <span className="signal-tiny-cross">+</span> SOFTWARE DEVELOPER /
              ENDLESSLY CURIOUS
            </div>
            <h1 id="signal-title">
              Curiosity,
              <br />
              <em>in motion.</em>
              <span className="signal-title-period" />
            </h1>
            <p className="signal-intro">
              I’m Ritvik. I turn interesting questions into
              <br className="signal-desktop-break" /> thoughtful software — and
              see where it takes me.
            </p>
            <div className="signal-hero-actions">
              <a
                className="signal-button signal-button-primary"
                href="#signal-work"
              >
                Discover my work <ArrowDownRight size={18} />
              </a>
              <a className="signal-text-link" href="#signal-about">
                A little about me <ArrowUpRight size={15} />
              </a>
            </div>
            <div className="signal-current">
              <span className="signal-current-icon">
                <Radio size={18} />
              </span>
              <div>
                <span className="signal-mono">CURRENT FREQUENCY</span>
                <p>
                  Shopify <span>×</span> York University{" "}
                  <span className="signal-dev-degree">/ Dev Degree</span>
                </p>
              </div>
            </div>
          </div>

          <div
            className="signal-instrument"
            role="group"
            aria-label="Interactive three-dimensional particle sculpture"
          >
            <div className="signal-instrument-grid" aria-hidden="true" />
            <div className="signal-instrument-top">
              <span>
                FIG. 01 — {expanded ? "NEW PERSPECTIVES" : "A CURIOUS MIND"}
              </span>
              <span>LIVE RENDER</span>
            </div>
            <Orbit
              expanded={expanded}
              reducedMotion={reducedMotion}
              paused={paused}
            />
            <div
              className="signal-orbit-cross signal-orbit-cross-one"
              aria-hidden="true"
            >
              +
            </div>
            <div
              className="signal-orbit-cross signal-orbit-cross-two"
              aria-hidden="true"
            >
              +
            </div>
            <span
              className="signal-axis-label signal-axis-label-one"
              aria-hidden="true"
            >
              43.6532° N
            </span>
            <span
              className="signal-axis-label signal-axis-label-two"
              aria-hidden="true"
            >
              79.3832° W
            </span>
            <div className="signal-instrument-bottom">
              <button
                className="signal-orbit-trigger"
                type="button"
                aria-pressed={expanded}
                onClick={() => setExpanded(!expanded)}
              >
                <span className="signal-trigger-icon">
                  <Plus size={17} />
                </span>
                {expanded ? "Restore the orbit" : "Change your perspective"}
                <ArrowUpRight size={14} />
              </button>
              <button
                className="signal-pause"
                type="button"
                aria-label={
                  paused ? "Play orbital animation" : "Pause orbital animation"
                }
                onClick={() => setPaused(!paused)}
              >
                {paused ? <Play size={14} /> : <Pause size={14} />}
              </button>
            </div>
            <p className="signal-instrument-note" aria-live="polite">
              {expanded
                ? "Same points. A different possibility."
                : "A small experiment in seeing things differently."}
            </p>
          </div>
          <div className="signal-hero-footer">
            <span>GOOD SOFTWARE STARTS WITH A GOOD QUESTION.</span>
            <a href="#signal-work">
              SCROLL TO EXPLORE <ArrowDown size={13} />
            </a>
          </div>
        </section>

        <section
          className="signal-work signal-section"
          id="signal-work"
          aria-labelledby="signal-work-title"
        >
          <div className="signal-section-top">
            <span className="signal-eyebrow">
              <span className="signal-tiny-cross">+</span> 01 / SELECTED
              TRANSMISSIONS
            </span>
            <span className="signal-mono">
              BUILT WITH INTENTION. SHIPPED TO THE WORLD.
            </span>
          </div>
          <div className="signal-section-heading">
            <h2 id="signal-work-title">
              Ideas with
              <br />
              <em>somewhere to go.</em>
            </h2>
            <p>
              From a better inbox to your next discovery.
              <br />A selection of things I’ve brought to life.
            </p>
          </div>
          <div
            className="signal-work-filter"
            role="group"
            aria-label="Filter projects"
          >
            {["All", "Web", "Mobile"].map((item) => (
              <button
                type="button"
                key={item}
                aria-pressed={filter === item}
                className={filter === item ? "is-active" : ""}
                onClick={() => {
                  setFilter(item);
                  const first = projects.findIndex(
                    (p) => item === "All" || p.category === item,
                  );
                  setActiveProject(first);
                }}
              >
                {item}
                <span>
                  {item === "All" ? "04" : item === "Web" ? "03" : "01"}
                </span>
              </button>
            ))}
          </div>
          <div className="signal-project-stage">
            <div
              className={`signal-project-visual signal-project-visual-${activeProject}`}
            >
              <div className="signal-project-browser">
                <div className="signal-browser-chrome">
                  <span>
                    <i />
                    <i />
                    <i />
                  </span>
                  <span>{project.fullName.toLowerCase()}</span>
                  <ArrowUpRight size={11} />
                </div>
                {project.image ? (
                  <img
                    key={project.image}
                    src={project.image}
                    alt={`${project.fullName} application interface`}
                    loading="lazy"
                  />
                ) : (
                  <div
                    className="signal-map-preview"
                    role="img"
                    aria-label="Conceptual illustration of discovering nearby STEM events with mapSTEM"
                  >
                    <svg viewBox="0 0 500 290" fill="none" aria-hidden="true">
                      <rect width="500" height="290" fill="#e8edde" />
                      <path
                        d="M0 265C100 223 200 270 284 206S410 152 500 148V290H0Z"
                        fill="#c8dcda"
                      />
                      <path
                        d="M-30 10 345 310M35-20 415 310M95-20 480 310M155-20 525 275M235-20 525 215M315-20 525 155M-10 85 320-25M-10 155 455-15M-10 225 525 25M65 285 525 105"
                        stroke="#fffef5"
                        strokeWidth="11"
                      />
                      <path
                        d="M-40 72 355 340M85-35 525 300M-40 210 525 0M55 305 555 95"
                        stroke="#d5dbc9"
                        strokeWidth="2"
                      />
                      <rect
                        x="289"
                        y="49"
                        width="65"
                        height="42"
                        rx="8"
                        transform="rotate(39 289 49)"
                        fill="#b6ce9f"
                      />
                      <rect
                        x="127"
                        y="174"
                        width="64"
                        height="29"
                        rx="8"
                        transform="rotate(39 127 174)"
                        fill="#b6ce9f"
                      />
                      {[
                        [282, 112],
                        [170, 151],
                        [371, 165],
                        [247, 216],
                      ].map(([x, y], i) => (
                        <g key={i} transform={`translate(${x},${y})`}>
                          <circle r="17" fill="#183c2c" fillOpacity=".08" />
                          <circle r="11" fill="#325e42" />
                          <circle r="4" fill="#e9f5c9" />
                        </g>
                      ))}
                    </svg>
                    <div className="signal-map-label">
                      <strong>
                        mapSTEM<span>↗</span>
                      </strong>
                      <span>
                        A world of discovery.
                        <br />
                        Closer than you think.
                      </span>
                    </div>
                    <span className="signal-map-key">● STEM, around you.</span>
                  </div>
                )}
              </div>
              <div className="signal-visual-caption">
                <span>{project.type}</span>
                <span>DESIGNED TO BE USED. BUILT TO MATTER.</span>
              </div>
            </div>
            <div className="signal-project-info" aria-live="polite">
              <div className="signal-project-kicker">
                <span>PROJECT {project.id}</span>
                <span>{project.year}</span>
              </div>
              <h3>{project.name}</h3>
              <p className="signal-project-lede">{project.description}</p>
              <p className="signal-project-detail">{project.detail}</p>
              <div className="signal-project-stack">
                {project.stack.map((tech) => (
                  <span key={tech}>{tech}</span>
                ))}
              </div>
              <a
                className="signal-project-link"
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Explore project <ArrowUpRight size={19} />
              </a>
            </div>
          </div>
          <div
            className="signal-project-selector"
            role="group"
            aria-label="Select project"
          >
            {projects.map(
              (item, index) =>
                (filter === "All" || item.category === filter) && (
                  <button
                    type="button"
                    key={item.id}
                    aria-pressed={activeProject === index}
                    className={activeProject === index ? "is-active" : ""}
                    onClick={() => setActiveProject(index)}
                  >
                    <span className="signal-selector-number">{item.id}</span>
                    <span>
                      {item.name}
                      <small>{item.type}</small>
                    </span>
                    <ArrowUpRight size={17} />
                  </button>
                ),
            )}
          </div>
          <div className="signal-archive">
            <button
              type="button"
              onClick={() => setArchiveOpen(!archiveOpen)}
              aria-expanded={archiveOpen}
              aria-controls="signal-archive-list"
            >
              <span>There’s always another idea.</span>
              <span>
                {archiveOpen ? "Close the archive" : "Open the archive"}
                <Plus size={17} className={archiveOpen ? "is-open" : ""} />
              </span>
            </button>
            {archiveOpen && (
              <div id="signal-archive-list" className="signal-archive-list">
                {[
                  {
                    name: "Panther Press",
                    type: "A modern school newsroom",
                    url: "https://panther-press.pages.dev",
                  },
                  {
                    name: "Scrapyard Toronto",
                    type: "A home for an inventive hackathon",
                    url: "https://scrapyard.hackclub.com/toronto",
                  },
                  {
                    name: "Build-A-Budget",
                    type: "A friendlier approach to personal finance",
                    url: "https://sassy33893.github.io/Budgeting-Fun/pages/index.html",
                  },
                ].map((item) => (
                  <a
                    key={item.name}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <strong>{item.name}</strong>
                    <span>{item.type}</span>
                    <ArrowUpRight size={18} />
                  </a>
                ))}
              </div>
            )}
          </div>
        </section>

        <section
          className="signal-about signal-section"
          id="signal-about"
          aria-labelledby="signal-about-title"
        >
          <div className="signal-section-top">
            <span className="signal-eyebrow">
              <span className="signal-tiny-cross">+</span> 02 / THE PERSON
              BEHIND THE PIXELS
            </span>
            <span className="signal-mono">BASED ON EARTH. MOSTLY TORONTO.</span>
          </div>
          <div className="signal-about-grid">
            <div>
              <h2 id="signal-about-title">
                Serious about
                <br />
                the craft.
                <br />
                <em>
                  Curious about
                  <br />
                  everything.
                </em>
              </h2>
              <div className="signal-about-coordinate">
                <span className="signal-coordinate-glyph" aria-hidden="true">
                  ✳
                </span>
                <span>
                  43°39′11.5″N
                  <br />
                  079°22′59.5″W
                </span>
              </div>
            </div>
            <div className="signal-about-story">
              <p className="signal-about-lede">
                The most interesting part of building something is finding out
                what it could become.
              </p>
              <p>
                I’m a developer in Toronto, learning and building through
                Shopify’s Dev Degree program with York University. I care about
                the details that make technology feel natural: a clear
                interface, a thoughtful interaction, a complicated thing made
                simple.
              </p>
              <p>
                My projects move between AI, web, and mobile. The common thread?
                Finding a real problem, following the curiosity, and making
                something people can actually use.
              </p>
              <div className="signal-experience">
                <div>
                  <span className="signal-mono">BUILDING + LEARNING</span>
                  <strong>Shopify</strong>
                  <span>Dev Degree</span>
                </div>
                <div>
                  <span className="signal-mono">2026 — 2030</span>
                  <strong>York University</strong>
                  <span>Digital Technologies · Dev Degree</span>
                </div>
              </div>
              <a
                className="signal-text-link"
                href="https://www.linkedin.com/in/ritvikgoyal1/"
                target="_blank"
                rel="noopener noreferrer"
              >
                The longer story on LinkedIn <ArrowUpRight size={16} />
              </a>
            </div>
          </div>
          <div className="signal-toolkit">
            <span className="signal-mono">TOOLS IN MY ORBIT</span>
            <div>
              {[
                "TypeScript",
                "React",
                "React Native",
                "Python",
                "Node.js",
                "Firebase",
                "Supabase",
              ].map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>
        </section>

        <section
          className="signal-contact signal-section"
          id="signal-contact"
          aria-labelledby="signal-contact-title"
        >
          <div className="signal-contact-top">
            <span className="signal-eyebrow">
              <span className="signal-tiny-cross">+</span> 03 / OPEN A CHANNEL
            </span>
            <span className="signal-mono">
              GOOD THINGS START WITH A CONVERSATION.
            </span>
          </div>
          <div className="signal-contact-body">
            <h2 id="signal-contact-title">
              Have something
              <br />
              <em>in mind?</em>
            </h2>
            <a
              className="signal-contact-orb"
              href="mailto:connect@ritvikgoyal.com"
              aria-label="Email Ritvik Goyal"
            >
              <ArrowUpRight size={58} strokeWidth={1.1} />
            </a>
          </div>
          <div className="signal-contact-bottom">
            <p>
              An interesting role, a wild idea, or just a hello.
              <br />
              I’d love to hear it.
            </p>
            <div className="signal-email-row">
              <a href="mailto:connect@ritvikgoyal.com">
                connect@ritvikgoyal.com
              </a>
              <button
                type="button"
                onClick={copyEmail}
                aria-label={copied ? "Email copied" : "Copy email address"}
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
              </button>
              <span className="signal-copy-status" role="status">
                {copied ? "Copied!" : ""}
              </span>
            </div>
          </div>
        </section>
      </main>
      <footer className="signal-footer">
        <a className="signal-footer-brand" href="#signal-home">
          <Mark small />
          <span>
            Ritvik Goyal <span>© {new Date().getFullYear()}</span>
          </span>
        </a>
        <span className="signal-footer-note">
          MADE OF CURIOSITY & A FEW GOOD IDEAS.
        </span>
        <div>
          <a
            href="https://github.com/RitvikGoyal1"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github size={16} />
            GitHub <ArrowUpRight size={12} />
          </a>
          <a
            href="https://www.linkedin.com/in/ritvikgoyal1/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Linkedin size={16} />
            LinkedIn <ArrowUpRight size={12} />
          </a>
          <a
            className="signal-top-link"
            href="#signal-home"
            aria-label="Back to top"
          >
            <ArrowRight size={18} />
          </a>
        </div>
      </footer>
    </div>
  );
}
