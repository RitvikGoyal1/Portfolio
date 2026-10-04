import { useEffect, useState } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, Check, Copy, Expand, Github, Linkedin, Mail, Minimize, Plus } from 'lucide-react';
import RibbonSculpture from './RibbonSculpture';
import './atelier.css';

const projects = [
  {
    number: '01', title: 'Mail Automation', kind: 'A little less inbox. A lot more headspace.',
    description: 'An AI-powered dashboard that turns email into clear summaries, prioritized tasks, and draft replies that sound like you.',
    category: 'AI PRODUCT · WEB APPLICATION', year: '2026', style: 'mail',
    image: '/projects/mail.webp',
    url: 'https://automations-dashboard-jyx8.vercel.app/', tech: ['React', 'TypeScript', 'AI'],
  },
  {
    number: '02', title: 'Synapse Investments', kind: 'Making sense of the signal.',
    description: 'A stock prediction and trading app exploring the intersection of machine learning, market data, and a considered interface.',
    category: 'FINTECH · AI / ML', year: '2025', style: 'synapse',
    image: '/projects/synapse.webp',
    url: 'https://synapseinvests.com', tech: ['React', 'Python', 'Supabase'],
  },
];

const moreProjects = [
  { number: '03', title: 'StudyFlow', description: 'A calmer place to focus, plan, and learn.', category: 'PRODUCTIVITY', year: '2026', url: 'https://dazzling-licorice-53acc6.netlify.app/' },
  { number: '04', title: 'mapSTEM', description: 'Connecting curious students with STEM events.', category: 'IOS APPLICATION', year: '2025', url: 'https://apps.apple.com/us/app/mapstem/id6504693720' },
  { number: '05', title: 'Panther Press', description: 'A digital home for the stories around us.', category: 'EDITORIAL PLATFORM', year: '2025', url: 'https://panther-press.pages.dev' },
];

function AtelierMark({ className = '' }: { className?: string }) {
  return <span className={`at-mark ${className}`} aria-hidden="true"><span /><span /><span /></span>;
}

function ProjectImage({ src, title }: { src: string; title: string }) {
  const [failed, setFailed] = useState(false);
  return <div className="at-browser-window">
    <div className="at-browser-top"><i /><i /><i /><span>{title}</span><Plus size={10} /></div>
    {failed ? <div className="at-image-fallback"><AtelierMark /><span>{title}</span><small>Explore the live project <ArrowUpRight size={13} /></small></div>
      : <img src={src} alt={`${title} application interface`} loading="lazy" onError={() => setFailed(true)} />}
  </div>;
}

export default function Atelier() {
  const [exploded, setExploded] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timeout = window.setTimeout(() => setCopied(false), 2200);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText('connect@ritvikgoyal.com');
      setCopied(true);
    } catch {
      window.location.href = 'mailto:connect@ritvikgoyal.com';
    }
  };

  return (
    <div className="atelier" id="at-top">
      <a className="at-skip" href="#at-main">Skip to content</a>
      <header className="at-header at-container">
        <a className="at-brand" href="#at-top" aria-label="Ritvik Goyal, back to top"><AtelierMark /><span>Ritvik Goyal<span className="at-brand-role">A CURIOUS MIND AT WORK</span></span></a>
        <span className="at-location"><span /> Toronto, Canada</span>
        <nav className="at-nav" aria-label="Main navigation"><a href="#at-work">Selected work <span>05</span></a><a href="#at-about">About</a><a className="at-nav-contact" href="#at-contact">Let's talk <ArrowUpRight size={14} /></a></nav>
      </header>

      <main id="at-main">
        <section className="at-hero at-container" aria-labelledby="at-hero-title">
          <div className="at-hero-copy">
            <p className="at-eyebrow"><span className="at-tiny-cross">+</span> SOFTWARE DEVELOPER & CURIOUS HUMAN</p>
            <h1 id="at-hero-title">Serious craft.<br /><em>Playful mind.</em></h1>
            <p className="at-hero-description">I’m Ritvik. I turn complex ideas into<br className="at-desktop-br" /> thoughtful digital experiences—with a<br className="at-desktop-br" /> little room for the unexpected.</p>
            <a className="at-primary-link" href="#at-work">Explore my work <ArrowDown size={17} /></a>
          </div>
          <div className="at-hero-art">
            <div className="at-art-corner at-art-corner-tl" /><div className="at-art-corner at-art-corner-br" />
            <span className="at-art-coordinate">FIG. 001 — A STUDY IN POSSIBILITY</span>
            <RibbonSculpture exploded={exploded} />
            <div className="at-sculpture-control">
              <span className="at-handwritten">Curiosity looks good on you.</span>
              <button onClick={() => setExploded(value => !value)} aria-pressed={exploded} className="at-explode-button">{exploded ? <Minimize size={14} /> : <Expand size={14} />}{exploded ? 'Bring it together' : 'Pull it apart'}</button>
            </div>
            <span className="at-art-index" aria-hidden="true">RG—01<br />FORM / FUNCTION / A LITTLE FUN</span>
          </div>
        </section>

        <div className="at-intro-strip at-container">
          <p><span className="at-live-dot" />CURRENTLY<span className="at-strip-main">Shopify <span className="at-strip-divider">/</span> Dev Degree</span></p>
          <p className="at-strip-center">ENGINEERING WITH INTENTION.<br /><span>BUILDING WITH PERSONALITY.</span></p>
          <a href="#at-work">SCROLL TO DISCOVER <ArrowDown size={14} /></a>
        </div>

        <section className="at-work at-container" id="at-work" aria-labelledby="at-work-title">
          <div className="at-section-heading"><div><p className="at-eyebrow">01 / SELECTED WORK</p><h2 id="at-work-title">Ideas, made <em>real.</em></h2></div><p>A few things I’ve put<br />my mind—and heart—into.</p></div>
          <div className="at-project-grid">
            {projects.map(project => <article className={`at-project at-project-${project.style}`} key={project.title}>
              <a className={`at-project-visual at-visual-${project.style}`} href={project.url} target="_blank" rel="noreferrer" aria-label={`View ${project.title}, opens in a new tab`}>
                <div className="at-visual-caption"><span>{project.category}</span><span>{project.number} / 05</span></div>
                {project.style === 'mail' ? <div className="at-visual-wordmark">Less noise.<br /><em>More possibility.</em></div> : <div className="at-synapse-symbol" aria-hidden="true"><span /><span /><span /><span /><span /><span /><span /></div>}
                <ProjectImage src={project.image} title={project.title} />
                <span className="at-project-visit"><ArrowUpRight size={20} /></span>
              </a>
              <div className="at-project-title"><h3><a href={project.url} target="_blank" rel="noreferrer">{project.title}</a></h3><span>{project.year}</span></div>
              <p className="at-project-tagline">{project.kind}</p>
              <p className="at-project-description">{project.description}</p>
              <div className="at-project-tech">{project.tech.map(tech => <span key={tech}>{tech}</span>)}</div>
            </article>)}
          </div>
          <div className="at-project-index"><p className="at-eyebrow">MORE EXPLORATIONS</p>{moreProjects.map(project => <a href={project.url} target="_blank" rel="noreferrer" className="at-index-row" key={project.number}><span className="at-index-number">{project.number}</span><div><h3>{project.title}</h3><p>{project.description}</p></div><span className="at-index-category">{project.category}</span><span className="at-index-year">{project.year}</span><span className="at-index-arrow"><ArrowUpRight size={21} /></span></a>)}</div>
        </section>

        <section className="at-about" id="at-about" aria-labelledby="at-about-title"><div className="at-container at-about-inner">
          <div className="at-about-art" aria-hidden="true"><div className="at-paper at-paper-back" /><div className="at-paper at-paper-middle" /><div className="at-paper at-paper-front"><span>NOTES TO SELF</span><AtelierMark /><p>Stay curious.<br />Make things.<br /><em>Care deeply.</em></p><span>RITVIK GOYAL — AN ONGOING WORK</span></div><span className="at-about-art-caption">A WORK IN PROGRESS. ALWAYS.</span></div>
          <div className="at-about-copy"><p className="at-eyebrow">02 / THE PERSON BEHIND THE PIXELS</p><h2 id="at-about-title">An engineer’s head.<br /><em>A maker’s heart.</em></h2><p>I’m a Toronto-based developer who enjoys figuring out how things work—and imagining how they could work better.</p><p>Through Shopify’s Dev Degree, I’m combining hands-on experience at Shopify with Digital Technologies at York University. In between, I build products that make everyday things a little more useful, intuitive, and enjoyable.</p><p className="at-about-note">Good engineering makes it work.<br />A little care makes it matter.</p><a className="at-text-link" href="https://www.linkedin.com/in/ritvikgoyal1/" target="_blank" rel="noreferrer">More about my journey <ArrowUpRight size={16} /></a></div>
          <div className="at-background"><div><span>THE PRACTICE</span><p>Shopify</p><small>Dev Degree</small></div><div><span>THE FOUNDATION</span><p>York University</p><small>Digital Technologies · 2026–2030</small></div><div><span>THE TOOLKIT</span><p>Ideas → interfaces</p><small>React · TypeScript · Python · React Native</small></div></div>
        </div></section>

        <section className="at-contact" id="at-contact" aria-labelledby="at-contact-title"><div className="at-container"><div className="at-contact-top"><p className="at-eyebrow">03 / GOOD THINGS START WITH A CONVERSATION</p><AtelierMark /></div><a className="at-contact-heading" href="mailto:connect@ritvikgoyal.com"><h2 id="at-contact-title">Have something<br /><em>in mind?</em></h2><span className="at-contact-big-arrow"><ArrowUpRight strokeWidth={1} /></span></a><div className="at-contact-bottom"><p>An interesting problem. An ambitious idea.<br />Or just a really good hello.</p><div className="at-email"><a href="mailto:connect@ritvikgoyal.com">connect@ritvikgoyal.com</a><button onClick={copyEmail} aria-label={copied ? 'Email address copied' : 'Copy email address'}>{copied ? <Check size={18} /> : <Copy size={17} />}</button><span className="at-copy-feedback" role="status">{copied ? 'Copied!' : ''}</span></div></div></div></section>
      </main>
      <footer className="at-footer at-container"><a className="at-footer-brand" href="#at-top"><AtelierMark /><span>Thoughtfully made by Ritvik.</span></a><div className="at-socials"><a href="https://github.com/RitvikGoyal1" target="_blank" rel="noreferrer"><Github size={14} />GitHub<ArrowUpRight size={12} /></a><a href="https://www.linkedin.com/in/ritvikgoyal1/" target="_blank" rel="noreferrer"><Linkedin size={14} />LinkedIn<ArrowUpRight size={12} /></a><a href="mailto:connect@ritvikgoyal.com"><Mail size={14} />Email<ArrowUpRight size={12} /></a></div><a className="at-back-top" href="#at-top">BACK TO TOP <ArrowRight size={13} /></a></footer>
    </div>
  );
}
