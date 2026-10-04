import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, Check, Copy, Github, Linkedin, Mail, Minus, Pause, Play, Plus } from "lucide-react";
import BronzeSculpture from "./BronzeSculpture";
import "./obsidian.css";

const projects = [
  {
    number: "01", title: "Mail Automation", detail: "A little less inbox. A little more possibility.",
    description: "An AI-powered workspace that turns a crowded inbox into clear priorities, smart summaries, and draft replies that sound like you.",
    category: "AI / WEB APPLICATION", year: "2026", tags: ["React", "TypeScript", "AI"],
    image: "/projects/mail.webp",
    url: "https://automations-dashboard-jyx8.vercel.app/", tone: "mail",
  },
  {
    number: "02", title: "Synapse Investments", detail: "Making market signals feel a little more human.",
    description: "A stock prediction and trading application exploring the intersection of machine learning, market data, and a clear product experience.",
    category: "FINTECH / AI", year: "2025", tags: ["React", "Python", "Supabase"],
    image: "/projects/synapse.webp",
    url: "https://synapseinvests.com", tone: "synapse",
  },
  {
    number: "03", title: "StudyFlow", detail: "A calmer space for your next big idea.",
    description: "A focused study companion with Pomodoro sessions, goal tracking, a calendar, and session analytics. Built around the rhythm of real learning.",
    category: "PRODUCTIVITY / WEB APPLICATION", year: "2026", tags: ["TypeScript", "Node.js", "Recharts"],
    image: "/projects/studyflow.webp",
    url: "https://dazzling-licorice-53acc6.netlify.app/", tone: "study",
  },
];

function useReveals(ref: React.RefObject<HTMLDivElement>) {
  useEffect(() => {
    const nodes = ref.current?.querySelectorAll<HTMLElement>(".ob-reveal");
    if (!nodes || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add("ob-visible"); observer.unobserve(entry.target); }
    }), { threshold: 0.08 });
    nodes.forEach((node) => { node.classList.add("ob-observed"); observer.observe(node); });
    return () => observer.disconnect();
  }, [ref]);
}

export default function Obsidian() {
  const [expanded, setExpanded] = useState(false);
  const [paused, setPaused] = useState(false);
  const [copied, setCopied] = useState(false);
  const [openProject, setOpenProject] = useState<string | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const copyTimer = useRef<ReturnType<typeof setTimeout>>();
  useReveals(root);
  useEffect(() => () => clearTimeout(copyTimer.current), []);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText("connect@ritvikgoyal.com");
      setCopied(true);
      copyTimer.current = setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = "mailto:connect@ritvikgoyal.com";
    }
  }

  return (
    <div className="obsidian" ref={root}>
      <a className="ob-skip" href="#ob-work">Skip to selected work</a>
      <header className="ob-header">
        <a className="ob-logo" href="#ob-top" aria-label="Ritvik Goyal, back to top">r<span>g</span><i /></a>
        <div className="ob-header-note"><span className="ob-status-dot" /> TORONTO, CANADA</div>
        <nav aria-label="Main navigation"><a href="#ob-work">Work <span>01</span></a><a href="#ob-about">About <span>02</span></a><a href="#ob-contact">Let’s talk <ArrowUpRight size={13} /></a></nav>
      </header>

      <main>
        <section className="ob-hero" id="ob-top" aria-labelledby="ob-name">
          <div className="ob-hero-eyebrow"><span>DEVELOPER. MAKER. ENDLESSLY CURIOUS.</span><span>SELECTED PORTFOLIO / 2026</span></div>
          <h1 id="ob-name">RITVIK GOYAL<span className="ob-name-mark" aria-hidden="true">✳</span></h1>
          <div className="ob-hero-stage">
            <div className="ob-hero-copy">
              <span className="ob-overline">BUILT WITH INTENTION</span>
              <h2>Good software.<br /><em>A little unexpected.</em></h2>
              <p>I build thoughtful digital things.<br />From the first idea to the last detail.</p>
              <a className="ob-primary-link" href="#ob-work">Explore my work <span><ArrowDown size={18} /></span></a>
              <div className="ob-current"><span className="ob-current-icon">S</span><div><span>CURRENT CHAPTER</span><p>Shopify <i>×</i> Dev Degree</p></div></div>
            </div>
            <div className="ob-art">
              <div className="ob-art-orbit ob-art-orbit-one" aria-hidden="true" /><div className="ob-art-orbit ob-art-orbit-two" aria-hidden="true" />
              <span className="ob-art-coordinate ob-coordinate-left" aria-hidden="true">+<span>43°39′ N</span></span><span className="ob-art-coordinate ob-coordinate-right" aria-hidden="true">+<span>79°23′ W</span></span>
              <BronzeSculpture expanded={expanded} paused={paused} />
              <div className="ob-art-caption"><span>FORM 001<br /><b>{expanded ? "A DIFFERENT PERSPECTIVE" : "THERE’S MORE BENEATH THE SURFACE"}</b></span><div className="ob-art-controls"><button className="ob-unfold" onClick={() => setExpanded(!expanded)} aria-pressed={expanded}>{expanded ? <Minus size={14} /> : <Plus size={14} />}{expanded ? "Reassemble" : "Unfold the idea"}</button><button className="ob-pause" onClick={() => setPaused(!paused)} aria-label={paused ? "Resume sculpture rotation" : "Pause sculpture rotation"} aria-pressed={paused}>{paused ? <Play size={12} /> : <Pause size={12} />}</button></div></div>
            </div>
          </div>
          <div className="ob-hero-foot"><span>CODE IS THE MEDIUM. <b>EXPERIENCE IS THE POINT.</b></span><a href="#ob-work">SCROLL TO DISCOVER <ArrowDown size={12} /></a></div>
        </section>

        <section className="ob-work" id="ob-work" aria-labelledby="ob-work-title">
          <div className="ob-section-heading ob-reveal"><div><span className="ob-overline">01 / SELECTED WORK</span><h2 id="ob-work-title">Ideas, made <em>real.</em></h2></div><p>A few things I’ve put into the world.<br />Built to be used, not just looked at.</p></div>
          <div className="ob-projects">
            {projects.map((project) => (
              <article className={`ob-project ob-reveal ob-project-${project.tone}`} key={project.number}>
                <a className="ob-project-image" href={project.url} target="_blank" rel="noreferrer" aria-label={`Open ${project.title} live project in a new tab`}>
                  <div className="ob-project-image-top"><span>PROJECT {project.number}</span><span>{project.year}</span></div>
                  <div className="ob-project-preview"><div className="ob-browser-bar"><i /><i /><i /><span>{project.title} — preview</span></div><img src={project.image} alt={`${project.title} application interface`} loading="lazy" /></div>
                  <span className="ob-project-visit">Explore project <ArrowUpRight size={16} /></span>
                  <span className="ob-image-index" aria-hidden="true">{project.number}</span>
                </a>
                <div className="ob-project-info"><div><span className="ob-overline">{project.category}</span><h3><a href={project.url} target="_blank" rel="noreferrer">{project.title}<ArrowUpRight size={23} /></a></h3><p>{project.detail}</p></div><button className="ob-project-more" aria-expanded={openProject === project.number} aria-controls={`ob-project-detail-${project.number}`} onClick={() => setOpenProject(openProject === project.number ? null : project.number)} aria-label={`${openProject === project.number ? "Hide" : "Show"} ${project.title} details`}>{openProject === project.number ? <Minus size={20} /> : <Plus size={20} />}</button></div>
                <div id={`ob-project-detail-${project.number}`} className="ob-project-detail" hidden={openProject !== project.number}><p>{project.description}</p><div>{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div>
              </article>
            ))}
          </div>
          <a className="ob-project-extra ob-reveal" href="https://apps.apple.com/us/app/mapstem/id6504693720" target="_blank" rel="noreferrer"><span className="ob-extra-number">04</span><div><span className="ob-overline">ALSO OUT IN THE WORLD</span><h3>mapSTEM <span>Connecting students with STEM events.</span></h3></div><span className="ob-extra-tag">ON THE APP STORE</span><ArrowUpRight size={25} /></a>
          <div className="ob-work-bottom"><span>ALWAYS SOMETHING IN THE MAKING.</span><a href="https://github.com/RitvikGoyal1" target="_blank" rel="noreferrer">More on GitHub <ArrowUpRight size={15} /></a></div>
        </section>

        <section className="ob-about" id="ob-about" aria-labelledby="ob-about-title">
          <div className="ob-about-intro ob-reveal"><span className="ob-overline">02 / THE PERSON BEHIND THE PIXELS</span><h2 id="ob-about-title">Curiosity is<br />the <em>constant.</em></h2><div className="ob-about-asterisk" aria-hidden="true">✳</div></div>
          <div className="ob-about-copy ob-reveal"><p className="ob-about-lead">I like figuring things out.<br />Even more, I like making them work.</p><p>I’m Ritvik, a developer in Toronto exploring the space between useful engineering and memorable experiences. I work across the web, mobile, and AI—following good questions wherever they lead.</p><p>I’m building and learning through Shopify’s Dev Degree program while studying Digital Technologies at York University.</p><div className="ob-background"><div><span>BUILDING & LEARNING</span><strong>Shopify <span>Dev Degree</span></strong></div><div><span>EDUCATION</span><strong>York University <span>2026 — 2030</span></strong></div><div><span>MY TOOLKIT</span><strong className="ob-toolkit">React · TypeScript · Python<br />React Native · Node.js · Firebase</strong></div></div><a className="ob-text-link" href="https://www.linkedin.com/in/ritvikgoyal1/" target="_blank" rel="noreferrer">The full story on LinkedIn <ArrowUpRight size={16} /></a></div>
        </section>

        <section className="ob-contact" id="ob-contact" aria-labelledby="ob-contact-title">
          <div className="ob-contact-top ob-reveal"><span className="ob-overline">03 / GOOD THINGS START WITH A CONVERSATION</span><span className="ob-contact-star" aria-hidden="true">↗</span></div>
          <h2 id="ob-contact-title" className="ob-reveal">Have something<br />in <em>mind?</em><a href="mailto:connect@ritvikgoyal.com" aria-label="Email Ritvik Goyal"><ArrowUpRight strokeWidth={1} /></a></h2>
          <div className="ob-contact-bottom"><div className="ob-email"><a href="mailto:connect@ritvikgoyal.com">connect@ritvikgoyal.com</a><button onClick={copyEmail} aria-label={copied ? "Email address copied" : "Copy email address"}>{copied ? <Check size={16} /> : <Copy size={16} />}</button><span role="status" className="ob-copy-status">{copied ? "Copied" : ""}</span></div><p>A project, an opportunity, or a good idea.<br />I’d love to hear it.</p></div>
        </section>
      </main>

      <footer className="ob-footer"><a className="ob-footer-signature" href="#ob-top">Ritvik Goyal<span>BUILT WITH CURIOSITY. IN TORONTO.</span></a><div className="ob-socials"><a href="https://github.com/RitvikGoyal1" target="_blank" rel="noreferrer"><Github size={15} /><span>GitHub</span><ArrowUpRight size={12} /></a><a href="https://www.linkedin.com/in/ritvikgoyal1/" target="_blank" rel="noreferrer"><Linkedin size={15} /><span>LinkedIn</span><ArrowUpRight size={12} /></a><a href="mailto:connect@ritvikgoyal.com"><Mail size={15} /><span>Email</span><ArrowUpRight size={12} /></a></div><a className="ob-back-top" href="#ob-top">BACK TO TOP <ArrowRight size={13} /></a></footer>
    </div>
  );
}
