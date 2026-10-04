import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  Command,
  Copy,
  FileText,
  Github,
  Linkedin,
  Layers3,
  Pause,
  Play,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import PersonalField from "./PersonalField";
import { KineticName, Magnetic, ScrambleText } from "./KineticText";
import { personalFacts, storyChapters } from "./personalContent";
import ScrollManifesto from "./ScrollManifesto";
import WorkGallery from "./WorkGallery";
import "./signature.css";
import "./refinement.css";

const chapterNames = [
  "An introduction",
  "Things I’ve made",
  "The story so far",
  "Your move",
];
const torontoTime = () =>
  new Intl.DateTimeFormat("en-GB", {
    timeZone: "America/Toronto",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());

function useMotionPreference() {
  const [reduced, setReduced] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => setReduced(query.matches);
    query.addEventListener("change", change);
    return () => query.removeEventListener("change", change);
  }, []);
  return reduced;
}

function CommandMenu({
  open,
  onClose,
  onPlay,
}: {
  open: boolean;
  onClose: () => void;
  onPlay: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const opener = useRef<HTMLElement | null>(null);
  const commands = [
    {
      title: "Explore selected work",
      hint: "THE THINGS I BUILD",
      href: "#sig-work",
    },
    { title: "Read my story", hint: "2022 → NOW", href: "#sig-story" },
    {
      title: "View my resume",
      hint: "READ OR DOWNLOAD THE PDF",
      href: "/resume",
    },
    {
      title: "Find me on GitHub",
      hint: "PUBLIC REPOSITORIES",
      href: "https://github.com/RitvikGoyal1",
    },
    {
      title: "View my LinkedIn",
      hint: "EXPERIENCE & EDUCATION",
      href: "https://www.linkedin.com/in/ritvikgoyal1/",
    },
    {
      title: "Explore my hackathon projects",
      hint: "DEVPOST · BUILT WITH A TEAM",
      href: "https://devpost.com/RitvikGoyal1",
    },
    {
      title: "Start a conversation",
      hint: "CONNECT@RITVIKGOYAL.COM",
      href: "mailto:connect@ritvikgoyal.com",
    },
    {
      title: "Find the hidden signature",
      hint: "A LITTLE CURIOSITY GOES A LONG WAY",
      href: "play",
    },
  ];
  const filtered = commands.filter((item) =>
    `${item.title} ${item.hint}`.toLowerCase().includes(query.toLowerCase()),
  );
  useEffect(() => {
    if (open) {
      opener.current = document.activeElement as HTMLElement;
      dialog.current?.showModal();
      setQuery("");
      setSelected(0);
      input.current?.focus();
    } else if (dialog.current?.open) {
      dialog.current.close();
      opener.current?.focus({ preventScroll: true });
    }
  }, [open]);
  const choose = (href: string) => {
    onClose();
    if (href === "play") onPlay();
    else if (href.startsWith("#"))
      document.querySelector(href)?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
    else if (href.startsWith("mailto:") || href.startsWith("/"))
      window.location.href = href;
    else window.open(href, "_blank", "noopener,noreferrer");
  };
  return (
    <dialog
      ref={dialog}
      className="sig-command"
      aria-label="Find your way around"
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="sig-command-inner">
        <div className="sig-command-search">
          <Search size={20} />
          <input
            ref={input}
            aria-label="Search portfolio shortcuts"
            value={query}
            placeholder="What brings you here?"
            onChange={(event) => {
              setQuery(event.target.value);
              setSelected(0);
            }}
            onKeyDown={(event) => {
              if (event.key === "ArrowDown") {
                event.preventDefault();
                setSelected((value) =>
                  Math.min(value + 1, filtered.length - 1),
                );
              }
              if (event.key === "ArrowUp") {
                event.preventDefault();
                setSelected((value) => Math.max(value - 1, 0));
              }
              if (event.key === "Enter" && filtered[selected]) {
                event.preventDefault();
                choose(filtered[selected].href);
              }
            }}
          />
          <button aria-label="Close shortcuts" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <div className="sig-command-list">
          {filtered.map((item, i) => (
            <button
              className={i === selected ? "is-selected" : ""}
              onFocus={() => setSelected(i)}
              key={item.href}
              onClick={() => choose(item.href)}
            >
              <span>
                {item.title}
                <small>{item.hint}</small>
              </span>
              <ArrowUpRight size={19} />
            </button>
          ))}
          {!filtered.length && (
            <p>No matches yet. Try “work”, “story”, or “signature”.</p>
          )}
        </div>
        <div className="sig-command-foot">
          <span>THE SHORT WAY INTO MY WORLD</span>
          <span>↑ ↓ to explore · ↵ to go</span>
        </div>
      </div>
    </dialog>
  );
}

export default function Signature() {
  const root = useRef<HTMLDivElement>(null);
  const [chapter, setChapter] = useState(0);
  const [playground, setPlayground] = useState(false);
  const [paused, setPaused] = useState(false);
  const [story, setStory] = useState(storyChapters.length - 1);
  const [copied, setCopied] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [time, setTime] = useState(torontoTime);
  const [mobileMenu, setMobileMenu] = useState(false);
  const reducedMotion = useMotionPreference();
  const closeCommand = useCallback(() => setCommandOpen(false), []);

  useEffect(() => {
    const interval = window.setInterval(() => setTime(torontoTime()), 15000);
    return () => window.clearInterval(interval);
  }, []);
  useEffect(() => {
    const keydown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen((value) => !value);
      }
      if (event.key === "Escape") {
        setPlayground(false);
        setMobileMenu(false);
      }
    };
    document.addEventListener("keydown", keydown);
    return () => document.removeEventListener("keydown", keydown);
  }, []);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting)
            setChapter(Number((entry.target as HTMLElement).dataset.chapter));
        });
      },
      { rootMargin: "-25% 0px -55% 0px" },
    );
    root.current
      ?.querySelectorAll("[data-chapter]")
      .forEach((section) => observer.observe(section));
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    root.current
      ?.querySelectorAll("[data-sig-reveal]")
      .forEach((node) => revealObserver.observe(node));
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const scroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        const height = document.documentElement.scrollHeight - innerHeight;
        const heroProgress = motion.matches
          ? 0
          : Math.min(1, Math.max(0, scrollY / innerHeight));
        root.current?.style.setProperty(
          "--sig-hero-drift",
          `${heroProgress * 70}px`,
        );
        root.current?.style.setProperty(
          "--sig-progress",
          `${height > 0 ? scrollY / height : 0}`,
        );
        frame = 0;
      });
    };
    window.addEventListener("scroll", scroll, { passive: true });
    scroll();
    return () => {
      observer.disconnect();
      revealObserver.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scroll);
    };
  }, []);
  useEffect(() => {
    if (chapter !== 0) setPlayground(false);
  }, [chapter]);
  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2400);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const enterPlayground = () => {
    document.getElementById("sig-top")?.scrollIntoView({ behavior: "instant" });
    setChapter(0);
    setPlayground(true);
  };
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText("connect@ritvikgoyal.com");
      setCopied(true);
    } catch {
      window.location.href = "mailto:connect@ritvikgoyal.com";
    }
  };

  return (
    <div
      ref={root}
      className={`signature ${playground ? "sig-is-playing" : ""} ${paused ? "sig-is-paused" : ""}`}
    >
      <div className="sig-field-layer" aria-hidden="true">
        <PersonalField
          chapter={chapter}
          playground={playground}
          paused={paused}
          reducedMotion={reducedMotion}
        />
      </div>
      <div className="sig-grain" aria-hidden="true" />
      <div className="sig-progress" aria-hidden="true" />
      <a className="sig-skip" href="#sig-work">
        Skip to selected work
      </a>
      <header className="sig-header">
        <a
          href="#sig-top"
          className="sig-logo"
          aria-label="Ritvik Goyal, back to top"
        >
          r<span>g</span>
          <i />
        </a>
        <span className="sig-header-note">
          <span /> SOFTWARE, WITH A HUMAN SIDE
        </span>
        <nav
          className={mobileMenu ? "sig-nav is-open" : "sig-nav"}
          aria-label="Main navigation"
        >
          <a href="#sig-work" onClick={() => setMobileMenu(false)}>
            <ScrambleText text="The work" />
          </a>
          <a href="#sig-story" onClick={() => setMobileMenu(false)}>
            <ScrambleText text="The human" />
          </a>
          <a href="/resume" onClick={() => setMobileMenu(false)}>
            <ScrambleText text="Resume" />
          </a>
          <a href="#sig-contact" onClick={() => setMobileMenu(false)}>
            <ScrambleText text="Say hello" />
            <ArrowUpRight size={13} />
          </a>
        </nav>
        <div className="sig-header-controls">
          <button
            className="sig-shortcut"
            onClick={() => setCommandOpen(true)}
            aria-label="Open portfolio shortcuts"
          >
            <Command size={14} />
            <span>K</span>
          </button>
          <button
            className="sig-motion"
            onClick={() => setPaused((value) => !value)}
            aria-pressed={paused}
            aria-label={
              paused ? "Resume ambient motion" : "Pause ambient motion"
            }
          >
            {paused ? <Play size={13} /> : <Pause size={13} />}
          </button>
          <button
            className="sig-mobile-toggle"
            onClick={() => setMobileMenu((value) => !value)}
            aria-label={mobileMenu ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileMenu}
          >
            {mobileMenu ? (
              <X size={19} />
            ) : (
              <span>
                <i />
                <i />
              </span>
            )}
          </button>
        </div>
      </header>

      <main>
        <section
          className="sig-hero"
          id="sig-top"
          data-chapter="0"
          aria-labelledby="sig-name"
        >
          <div className="sig-hero-top">
            <span className="sig-mono">
              <span className="sig-cross">+</span> SOFTWARE DEVELOPER &
              COMMUNITY BUILDER
            </span>
            <span className="sig-mono sig-hero-coordinates">
              TORONTO, CA <span>43.6532° N</span>
            </span>
          </div>
          <h1 id="sig-name" className="sig-hero-name">
            <span className="sig-name-first">
              <KineticName text="RITVIK" />
            </span>
            <span className="sig-name-second">
              <KineticName text="GOYAL" />
              <span className="sig-name-star" aria-hidden="true">
                ✳
              </span>
            </span>
          </h1>
          <div className="sig-hero-note">
            <span className="sig-note-rule" />
            <p>
              Serious about craft.
              <br /> Always up for
              <br /> <em>a little wonder.</em>
            </p>
            <span className="sig-mono">MOVE A LITTLE. LOOK CLOSER.</span>
          </div>
          <div className="sig-hero-bottom">
            <div className="sig-hero-intro">
              <p>
                A developer with a builder’s mindset.
                <br />
                <span>Turning curious ideas into useful things.</span>
              </p>
              <Magnetic>
                <a className="sig-round-link" href="#sig-work">
                  <span>
                    <ArrowDown size={19} />
                  </span>
                  <ScrambleText text="Explore selected work" />
                </a>
              </Magnetic>
            </div>
            <div className="sig-now">
              <span className="sig-mono">
                <i /> CURRENTLY BUILDING & LEARNING
              </span>
              <p>
                Shopify <span>×</span> York University
              </p>
              <small>Dev Degree · Digital Technologies</small>
              <a
                href="https://www.linkedin.com/in/ritvikgoyal1/"
                target="_blank"
                rel="noreferrer"
              >
                Experience & education <ArrowUpRight size={13} />
              </a>
            </div>
          </div>
          <div className="sig-playground-label" aria-live="polite">
            {playground && (
              <>
                <span className="sig-mono">YOU FOUND MY SIGNATURE.</span>
                <p>
                  Two letters. <em>Endless possibilities.</em>
                </p>
                <span className="sig-mono">
                  RG, WRITTEN IN LIGHT. MOVE YOUR POINTER.
                </span>
              </>
            )}
          </div>
          <button
            className="sig-play-trigger"
            onClick={() => setPlayground((value) => !value)}
            aria-pressed={playground}
          >
            <Sparkles size={15} />
            <ScrambleText
              text={playground ? "Put it back together" : "Break the pattern"}
            />
            <span className="sig-trigger-arrow">
              <ArrowUpRight size={14} />
            </span>
          </button>
          <div className="sig-hero-base">
            <span className="sig-mono">01 / AN INTRODUCTION</span>
            <span className="sig-mono sig-live-time">{time} IN TORONTO</span>
            <a href="#sig-work" className="sig-mono">
              THERE’S MORE BELOW <ArrowDown size={12} />
            </a>
          </div>
        </section>

        <ScrollManifesto />
        <WorkGallery />

        <section
          className="sig-story sig-container"
          id="sig-story"
          data-chapter="2"
          aria-labelledby="sig-story-title"
        >
          <div className="sig-section-top">
            <span className="sig-mono">
              <span className="sig-cross">+</span> 03 / A HUMAN, BEFORE ANYTHING
              ELSE
            </span>
            <span className="sig-mono">FOLLOW THE THREAD</span>
          </div>
          <div className="sig-story-heading" data-sig-reveal="">
            <h2 id="sig-story-title">
              More than
              <br />
              <em>the commit history.</em>
            </h2>
            <div className="sig-portrait">
              <img
                src="/ritvik-duotone.webp"
                alt="Cinematic duotone portrait of Ritvik Goyal"
                width="720"
                height="900"
                loading="lazy"
                decoding="async"
              />
              <span className="sig-portrait-caption">
                RITVIK GOYAL / TORONTO
              </span>
            </div>
          </div>
          <div className="sig-journey">
            <div
              className="sig-year-selector"
              role="tablist"
              aria-label="Explore my journey"
            >
              {storyChapters.map((item, index) => (
                <button
                  key={item.year}
                  role="tab"
                  id={`sig-year-${index}`}
                  aria-controls={`sig-story-panel-${index}`}
                  aria-selected={story === index}
                  tabIndex={story === index ? 0 : -1}
                  onClick={() => setStory(index)}
                  onKeyDown={(event) => {
                    if (
                      ["ArrowLeft", "ArrowRight", "Home", "End"].includes(
                        event.key,
                      )
                    ) {
                      event.preventDefault();
                      const next =
                        event.key === "Home"
                          ? 0
                          : event.key === "End"
                            ? storyChapters.length - 1
                            : (story +
                                (event.key === "ArrowRight" ? 1 : -1) +
                                storyChapters.length) %
                              storyChapters.length;
                      setStory(next);
                      document.getElementById(`sig-year-${next}`)?.focus();
                    }
                  }}
                >
                  <span className="sig-year-dot" />
                  <span>
                    {item.year.split(" ")[0]}
                    {index === storyChapters.length - 1 && (
                      <span className="sig-year-suffix"> — NOW</span>
                    )}
                  </span>
                  {index === storyChapters.length - 1 && (
                    <span className="sig-now-tag">CURRENT CHAPTER</span>
                  )}
                </button>
              ))}
            </div>
            <div className="sig-chapter-panels">
              {storyChapters.map((item, index) => (
                <article
                  role="tabpanel"
                  id={`sig-story-panel-${index}`}
                  aria-labelledby={`sig-year-${index}`}
                  tabIndex={0}
                  hidden={story !== index}
                  key={item.year}
                >
                  <span className="sig-story-year" aria-hidden="true">
                    {item.year.split(" ")[0]}
                    <span>↗</span>
                  </span>
                  <div className="sig-chapter-copy">
                    <span className="sig-mono">CHAPTER 0{index + 1}</span>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <a href={item.url} target="_blank" rel="noreferrer">
                      <ScrambleText text="Follow this part of the story" />
                      <ArrowUpRight size={14} />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
          <div className="sig-personal-facts">
            {personalFacts.map((fact, index) => (
              <a
                href={fact.url}
                key={fact.label}
                target="_blank"
                rel="noreferrer"
              >
                <span className="sig-mono">
                  0{index + 1} / {fact.label.toUpperCase()}
                </span>
                <span>{fact.value}</span>
                <ArrowUpRight size={15} />
              </a>
            ))}
          </div>
          <div className="sig-toolkit">
            <span className="sig-mono">A FEW TOOLS. ENDLESS COMBINATIONS.</span>
            <div>
              {[
                "TypeScript",
                "React",
                "Python",
                "React Native",
                "Node.js",
                "Firebase",
              ].map((tool, index) => (
                <span key={tool}>
                  <span className="sig-tool-index">0{index + 1}</span>
                  <ScrambleText text={tool} />
                </span>
              ))}
            </div>
          </div>
        </section>

        <section
          className="sig-contact sig-container"
          id="sig-contact"
          data-chapter="3"
          aria-labelledby="sig-contact-title"
        >
          <div className="sig-section-top">
            <span className="sig-mono">
              <span className="sig-cross">+</span> 04 / THIS IS WHERE YOU COME
              IN
            </span>
            <span className="sig-mono">AN OPEN INVITATION</span>
          </div>
          <a
            className="sig-contact-title"
            data-sig-reveal=""
            href="mailto:connect@ritvikgoyal.com"
          >
            <h2 id="sig-contact-title">
              <span>What if</span>
              <em>we built it?</em>
            </h2>
            <span className="sig-contact-arrow">
              <ArrowUpRight strokeWidth={0.75} />
            </span>
          </a>
          <div className="sig-contact-bottom">
            <p>
              A team I could learn from. A problem worth solving.
              <br />
              An idea that won’t leave you alone.
              <br />
              <span>I’d like to hear about it.</span>
            </p>
            <div className="sig-contact-email">
              <a href="mailto:connect@ritvikgoyal.com">
                connect@ritvikgoyal.com
              </a>
              <button
                onClick={copyEmail}
                aria-label={
                  copied ? "Email address copied" : "Copy email address"
                }
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
              <span role="status">{copied ? "Copied. Your move ↗" : ""}</span>
            </div>
          </div>
          <div className="sig-socials">
            <Magnetic>
              <a href="/resume">
                <FileText size={18} />
                <ScrambleText text="Resume" />
                <ArrowUpRight size={16} />
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href="https://github.com/RitvikGoyal1"
                target="_blank"
                rel="noreferrer"
              >
                <Github size={18} />
                <ScrambleText text="GitHub" />
                <ArrowUpRight size={16} />
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href="https://www.linkedin.com/in/ritvikgoyal1/"
                target="_blank"
                rel="noreferrer"
              >
                <Linkedin size={18} />
                <ScrambleText text="LinkedIn" />
                <ArrowUpRight size={16} />
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href="https://devpost.com/RitvikGoyal1"
                target="_blank"
                rel="noreferrer"
              >
                <Layers3 size={18} />
                <ScrambleText text="Devpost" />
                <ArrowUpRight size={16} />
              </a>
            </Magnetic>
          </div>
        </section>
      </main>
      <footer className="sig-footer">
        <a href="#sig-top" className="sig-footer-name">
          Ritvik Goyal<span>STILL FOLLOWING THE CURIOSITY.</span>
        </a>
        <span className="sig-mono">
          PERSONALLY MADE. TORONTO, CANADA.
          <br />© {new Date().getFullYear()}
        </span>
        <a href="#sig-top" className="sig-footer-top">
          <span className="sig-mono">BACK TO THE BEGINNING</span>
          <ArrowUpRight size={18} />
        </a>
      </footer>
      <nav
        className={`sig-floating-nav ${chapter > 0 ? "is-visible" : ""}`}
        aria-label="Quick section navigation"
      >
        <a
          href="#sig-top"
          aria-label="Back to introduction"
          className="sig-floating-logo"
        >
          rg.
        </a>
        <a
          href="#sig-work"
          aria-current={chapter === 1 ? "location" : undefined}
        >
          Work
        </a>
        <a
          href="#sig-story"
          aria-current={chapter === 2 ? "location" : undefined}
        >
          About
        </a>
        <a
          href="#sig-contact"
          aria-current={chapter === 3 ? "location" : undefined}
        >
          Contact <ArrowUpRight size={13} />
        </a>
        <a href="/resume">Resume</a>
        <button
          onClick={() => setCommandOpen(true)}
          aria-label="Search portfolio"
        >
          <Command size={14} />
          <span>K</span>
        </button>
      </nav>
      <div className="sig-chapter-indicator" aria-hidden="true">
        <span>0{chapter + 1}</span>
        <i />
        <span>{chapterNames[chapter]}</span>
      </div>
      <CommandMenu
        open={commandOpen}
        onClose={closeCommand}
        onPlay={enterPlayground}
      />
    </div>
  );
}
