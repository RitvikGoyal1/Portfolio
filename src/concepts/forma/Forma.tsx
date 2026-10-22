import { useCallback, useEffect, useRef, useState } from "react";
import ContactForm from "../signature/ContactForm";
import { projects as projectRecords } from "../../content/projects";
import { xProfile, instagramProfile } from "../../content/social";
import World from "./World";
import { chapters, type WorldState } from "./worldSpec";
import { useJourney } from "./useJourney";
import "./forma.css";

const projects = [
  {
    id: "dealify",
    chapter: 1,
    line: (
      <>
        Name your price.
        <br />
        <em>The shop can counter.</em>
      </>
    ),
    action: "Explode the build",
    visit: "Watch Dealify",
    note: "How an offer gets accepted",
  },
  {
    id: "wealthsnaps",
    chapter: 2,
    line: (
      <>
        Your money.
        <br />
        <em>In a new light.</em>
      </>
    ),
    action: "Scatter the snapshot",
    visit: "Explore WealthSnaps",
    note: "What’s taking shape",
  },
  {
    id: "studyflow",
    chapter: 3,
    line: (
      <>
        One session
        <br />
        <em>at a time.</em>
      </>
    ),
    action: "Bend time",
    visit: "Open StudyFlow",
    note: "Inside the study workspace",
  },
].map((presentation) => {
  const record = projectRecords.find(({ slug }) => slug === presentation.id)!;
  return {
    ...presentation,
    name: record.name,
    category: record.category.toUpperCase(),
    description: record.lead,
    image: record.image,
    imageAlt: record.imageAlt,
    imageWidth: record.imageWidth,
    imageHeight: record.imageHeight,
    url: record.slug === "dealify" ? "/projects/dealify#demo" : record.liveUrl,
    stack: record.technologies.join(" / "),
    detail: record.summary,
    source: record.repository?.url,
    sourceNote: record.repository?.note,
  };
});
const Arrow = () => <span aria-hidden="true">↗</span>;

export default function Forma() {
  const root = useRef<HTMLDivElement>(null);
  const runtime = useRef<WorldState>({
    exact: 0,
    active: 0,
    remix: 0,
    experiment: false,
    hover: false,
    visible: true,
  });
  const [motion, setMotion] = useState(false);
  const [reading, setReading] = useState(false);
  const [compact, setCompact] = useState(false);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(0);
  const [experiment, setExperiment] = useState(false);
  const [remix, setRemix] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const immersive = motion && !reading && !failed && !compact;
  const chapterChanged = useCallback((index: number) => {
    setActive(index);
    setExperiment(false);
  }, []);
  const fail = useCallback(() => {
    setFailed(true);
  }, []);
  const interact = useCallback(() => {
    if (runtime.current.active > 0 && runtime.current.active < 4) {
      runtime.current.experiment = !runtime.current.experiment;
      setExperiment(runtime.current.experiment);
    } else {
      runtime.current.remix++;
      setRemix(runtime.current.remix);
    }
  }, []);
  useJourney(root, runtime, immersive, chapterChanged);
  useEffect(() => {
    setHydrated(true);
    const query = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setMotion(!query.matches);
    const height = matchMedia("(max-height: 560px)");
    const updateHeight = () => setCompact(height.matches);
    update();
    updateHeight();
    query.addEventListener("change", update);
    height.addEventListener("change", updateHeight);
    return () => {
      query.removeEventListener("change", update);
      height.removeEventListener("change", updateHeight);
    };
  }, []);
  function toggleReading() {
    const target = chapters[runtime.current.active].id;
    history.replaceState(null, "", `#${target}`);
    setReading((value) => !value);
  }
  function remixWorld() {
    runtime.current.remix++;
    setRemix(runtime.current.remix);
  }
  const localHover = (hover: boolean) => {
    runtime.current.hover = hover;
  };

  return (
    <div
      className="forma playground"
      ref={root}
      data-immersive={immersive}
      data-ready={ready}
      data-chapter={chapters[active].id}
    >
      <a className="world-skip" href="#work">
        Skip to projects
      </a>
      <World
        enabled={immersive}
        state={runtime}
        onReady={setReady}
        onFailure={fail}
        onInteract={interact}
      />
      <div className="world-vignette" aria-hidden="true" />
      <div className="world-flight" aria-hidden="true">
        <div className="world-flight-type">FOLLOW YOUR CURIOSITY</div>
      </div>
      <header className="world-header">
        <a
          className="world-logo"
          href="#top"
          aria-label="Ritvik Goyal, back to top"
        >
          rg<span>.</span>
        </a>
        <span className="world-header-note">
          RITVIK GOYAL
          <br />
          DEVELOPER, TORONTO
        </span>
        <nav aria-label="Main navigation">
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a href="/resume">
            Résumé <Arrow />
          </a>
        </nav>
        <a className="world-hello" href="#contact">
          Say hello <Arrow />
        </a>
      </header>
      <main>
        <div className="world-story">
          <section
            className="world-chapter world-intro"
            id="top"
            data-world-chapter
            aria-labelledby="world-title"
          >
            <div className="world-panel">
              <div className="world-copy world-hero-copy">
                <p className="world-eyebrow">
                  SELECTED WORK & ONGOING EXPERIMENTS
                </p>
                <h1 id="world-title">
                  <span>MAKE</span>
                  <span>SOMETHING</span>
                  <span className="world-outline">
                    MATTER<span className="world-title-dot">.</span>
                  </span>
                </h1>
                <div className="world-hero-bottom">
                  <p>
                    I’m Ritvik. I build software at Shopify.
                    <br />
                    Here are a few things I’ve made.
                  </p>
                  <a
                    className="world-round-link"
                    href="#work"
                    aria-label="Explore my work"
                  >
                    <span>
                      SCROLL TO
                      <br />
                      EXPLORE
                    </span>
                    <b aria-hidden="true">↓</b>
                  </a>
                </div>
              </div>
              <div className="world-intro-meta">
                <span>SOFTWARE DEVELOPER</span>
                <span>SHOPIFY DEV DEGREE · TORONTO</span>
              </div>
              <img
                className="world-static-art world-portal-art"
                src="/forma/playground-poster.svg"
                alt="A violet portal encircling a chrome star, with lime satellites"
                width="900"
                height="800"
              />
              {immersive && (
                <button
                  className="world-object-action"
                  onClick={remixWorld}
                  onMouseEnter={() => localHover(true)}
                  onMouseLeave={() => localHover(false)}
                  onFocus={() => localHover(true)}
                  onBlur={() => localHover(false)}
                >
                  <span aria-hidden="true">↻</span> Remix the world
                  <span aria-hidden="true">{(remix % 3) + 1} / 3</span>
                </button>
              )}
            </div>
          </section>
          {projects.map((project) => (
            <section
              className={`world-chapter world-project world-project-${project.id}`}
              id={chapters[project.chapter].id}
              key={project.id}
              data-world-chapter
              aria-labelledby={`world-${project.id}-title`}
            >
              {project.id === "dealify" && (
                <span id="dealify" className="world-alias" />
              )}
              <div className="world-panel">
                <div className="world-copy">
                  <p className="world-eyebrow">{project.category}</p>
                  <h2
                    className="world-project-name"
                    id={`world-${project.id}-title`}
                  >
                    {project.name}
                  </h2>
                  <p className="world-project-line">{project.line}</p>
                  <p className="world-description">{project.description}</p>
                  <div className="world-project-links">
                    <a
                      className="world-pill"
                      href={project.url}
                      target={
                        project.url.startsWith("/") ? undefined : "_blank"
                      }
                      rel={
                        project.url.startsWith("/") ? undefined : "noreferrer"
                      }
                    >
                      {project.visit} <Arrow />
                    </a>
                    <a
                      className="world-notes-link"
                      href={`/projects/${project.id}`}
                      aria-label={`${project.name} project notes`}
                    >
                      Project notes <span aria-hidden="true">→</span>
                    </a>
                  </div>
                  {project.id === "dealify" && (
                    <a
                      className="world-award"
                      href="https://devpost.com/software/bazaar-wgv16i"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span>
                        HACK THE NORTH 2026
                        <br />
                        <b>Shopify: Hack Shopping with AI winner</b>
                      </span>
                    </a>
                  )}
                  <details className="world-details">
                    <summary>
                      {project.note} <span aria-hidden="true">+</span>
                    </summary>
                    <div>
                      <p>{project.detail}</p>
                      <p className="world-stack">{project.stack}</p>
                      {project.sourceNote && <p>{project.sourceNote}</p>}
                      {project.source && (
                        <a
                          href={project.source}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Explore the source <Arrow />
                        </a>
                      )}
                    </div>
                  </details>
                </div>
                <a
                  className="world-static-art world-static-project"
                  href={project.url}
                  target={project.url.startsWith("/") ? undefined : "_blank"}
                  rel={project.url.startsWith("/") ? undefined : "noreferrer"}
                  aria-label={`Open ${project.name}`}
                >
                  <img
                    src={project.image}
                    alt={project.imageAlt}
                    width={project.imageWidth}
                    height={project.imageHeight}
                    loading="lazy"
                  />
                </a>
                {immersive && (
                  <button
                    className="world-object-action"
                    onClick={interact}
                    aria-pressed={experiment && active === project.chapter}
                    onMouseEnter={() => localHover(true)}
                    onMouseLeave={() => localHover(false)}
                    onFocus={() => localHover(true)}
                    onBlur={() => localHover(false)}
                  >
                    <span aria-hidden="true">
                      {experiment && active === project.chapter ? "↺" : "+"}
                    </span>{" "}
                    {experiment && active === project.chapter
                      ? "Put it back together"
                      : project.action}
                  </button>
                )}
              </div>
            </section>
          ))}
          <section
            className="world-chapter world-about"
            id="about"
            data-world-chapter
            aria-labelledby="world-about-title"
          >
            <div className="world-panel">
              <div className="world-copy">
                <p className="world-eyebrow">A LITTLE ABOUT ME</p>
                <h2 className="world-big-title" id="world-about-title">
                  STILL <br />
                  FIGURING <br />
                  <em>IT OUT.</em>
                </h2>
                <p className="world-description">
                  I’m Ritvik, a software developer at Shopify in Toronto. I’m
                  also studying Digital Technologies at York University through
                  Dev Degree.
                </p>
                <p className="world-description world-about-extra">
                  Dealify began at Hack the North with Bryan Maristanez and
                  Ricardo Gao. Other projects here explore personal finance,
                  studying, and student publishing.
                </p>
                <a className="world-pill" href="/resume">
                  The story so far <Arrow />
                </a>
              </div>
              <img
                className="world-static-art world-static-portrait"
                src="/forma/ritvik-painted-graded.webp"
                alt="Hand-painted portrait of Ritvik Goyal"
                width="640"
                height="800"
                loading="lazy"
              />
              <div className="world-maker-label">
                <span>RITVIK GOYAL</span>
                <span>SHOPIFY · YORK UNIVERSITY</span>
              </div>
            </div>
          </section>
          <section
            className="world-chapter world-contact"
            id="contact"
            data-world-chapter
            aria-labelledby="world-contact-title"
          >
            <div className="world-panel">
              <div className="world-copy">
                <p className="world-eyebrow">HAVE SOMETHING IN MIND?</p>
                <h2 className="world-big-title" id="world-contact-title">
                  WHAT <br />
                  IF WE <br />
                  <em>BUILT IT?</em>
                </h2>
                <p className="world-description">
                  Have a project in mind, or a question about the work? I’d like
                  to hear it.
                </p>
                <a className="world-pill" href="mailto:connect@ritvikgoyal.com">
                  Email me <Arrow />
                </a>
                <a className="world-message-link" href="#message">
                  Or leave me a message ↓
                </a>
              </div>
              <img
                className="world-static-art world-portal-art"
                src="/forma/playground-poster.svg"
                alt="An open creative portal"
                width="900"
                height="800"
                loading="lazy"
              />
            </div>
          </section>
        </div>
        <section
          className="world-message"
          id="message"
          aria-label="More projects and contact"
        >
          <div className="world-more">
            <p className="world-eyebrow">OTHER THINGS I’VE BUILT</p>
            <a href="/projects/panther">
              <span>Panther Press</span>
              <small>Astro / React · Watch the walkthrough</small>
              <Arrow />
            </a>
            <a
              href="https://github.com/STEM-E-Youth-Career-Development-Program/map-app"
              target="_blank"
              rel="noreferrer"
            >
              <span>mapSTEM</span>
              <small>React Native / Expo · Public source</small>
              <Arrow />
            </a>
          </div>
          <ContactForm />
          <footer className="world-footer">
            <a href="mailto:connect@ritvikgoyal.com">
              connect@ritvikgoyal.com <Arrow />
            </a>
            <div>
              <a
                href="https://github.com/RitvikGoyal1"
                target="_blank"
                rel="noreferrer"
              >
                GitHub <Arrow />
              </a>
              <a
                href="https://www.linkedin.com/in/ritvikgoyal1/"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn <Arrow />
              </a>
              <a
                href="https://devpost.com/RitvikGoyal1"
                target="_blank"
                rel="noreferrer"
              >
                Devpost <Arrow />
              </a>
              <a
                href={xProfile.url}
                target="_blank"
                rel="noreferrer"
                aria-label={`X (${xProfile.handle})`}
              >
                X <Arrow />
              </a>
              <a
                href={instagramProfile.url}
                target="_blank"
                rel="noreferrer"
                aria-label={`Instagram (${instagramProfile.handle})`}
              >
                Instagram <Arrow />
              </a>
            </div>
            <div className="world-footer-bottom">
              <span>© {new Date().getFullYear()} Ritvik Goyal</span>
              <a href="#top">Run it back ↑</a>
            </div>
          </footer>
        </section>
      </main>
      <nav className="world-chapter-nav" aria-label="Explore chapters">
        {chapters.map((chapter, index) => (
          <a
            key={chapter.id}
            href={`#${chapter.id}`}
            aria-label={`${index + 1}. ${chapter.label}`}
            aria-current={active === index ? "step" : undefined}
          >
            <span className="world-nav-dot" />
            <span className="world-nav-label">{chapter.label}</span>
          </a>
        ))}
      </nav>
      <div className="world-bottom-bar">
        <span className="world-current">
          <b>{String(active).padStart(2, "0")}</b> / {chapters[active].label}
        </span>
        <span className="world-scroll-hint">
          {active === 5 ? "KEEP SCROLLING TO CONNECT" : "SCROLL TO TRAVEL"}{" "}
          <span aria-hidden="true">↓</span>
        </span>
        {hydrated && (
          <button
            className="world-mode"
            onClick={toggleReading}
            aria-pressed={reading || !motion || failed || compact}
            disabled={!motion || failed || compact}
          >
            {failed
              ? "3D unavailable · reading mode"
              : compact
                ? "Reading mode · compact view"
                : !motion
                  ? "Reduced motion"
                  : reading
                    ? "Enter the experience"
                    : "Reading mode"}
          </button>
        )}
      </div>
      <div className="world-progress" aria-hidden="true">
        <div className="world-progress-fill" />
      </div>
    </div>
  );
}
