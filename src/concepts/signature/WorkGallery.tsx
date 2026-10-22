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
import { projects as projectRecords } from "../../content/projects";

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
  sourceNote?: string;
  devpost?: string;
  award?: string;
  notes: string[][];
}

const treatments = {
  dealify: { word: "let’s deal.", palette: "#162c29", ink: "#c9d9c6" },
  wealthsnaps: { word: "new light.", palette: "#193437", ink: "#c7e0df" },
  studyflow: { word: "find flow.", palette: "#272430", ink: "#d0c9df" },
  panther: { word: "the press.", palette: "#30261d", ink: "#e4d1ba" },
};
const projects: GalleryProject[] = projectRecords.map((record) => ({
  ...treatments[record.slug],
  id: record.slug,
  title: record.name,
  category: record.category.toUpperCase(),
  year: record.year,
  image: record.image,
  imageSize: [record.imageWidth, record.imageHeight],
  description: record.lead,
  detail: record.summary,
  stack: record.technologies,
  url: record.liveUrl,
  source: record.repository?.url || "",
  sourceNote: record.repository?.note,
  devpost: record.sources.find(({ url }) => url.includes("devpost.com"))?.url,
  award: record.award,
  notes: record.sections.map(({ title, paragraphs }) => [
    title,
    paragraphs.join(" "),
  ]),
}));

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
                alt={projectRecords[active].imageAlt}
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
              {project.stack[0] || "Receipts"}
              <span>↔</span>
              {project.stack[1] || "Net worth"}
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
            {project.sourceNote && <p>{project.sourceNote}</p>}
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
              <a href={`/projects/${project.id}`}>
                Project notes <ArrowUpRight size={15} />
              </a>
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
        href="https://github.com/STEM-E-Youth-Career-Development-Program/map-app"
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
          Explore the source <ArrowUpRight size={18} />
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
                <a href={`/projects/${item.id}`}>Project notes</a>
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
