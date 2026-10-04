import {
  ArrowDownToLine,
  ArrowLeft,
  ArrowUpRight,
  FileText,
} from "lucide-react";
import "./Resume.css";

export default function Resume() {
  return (
    <div className="resume-page">
      <a className="resume-skip" href="#resume-document">
        Skip to resume
      </a>
      <header className="resume-header">
        <a className="resume-logo" href="/" aria-label="Ritvik Goyal, home">
          rg.
        </a>
        <nav aria-label="Main navigation">
          <a href="/#sig-work">Work</a>
          <a href="/#sig-story">About</a>
          <a href="/resume" aria-current="page">
            Resume
          </a>
          <a href="/#sig-contact">
            Contact <ArrowUpRight size={13} />
          </a>
        </nav>
      </header>
      <main id="resume-main">
        <div className="resume-intro">
          <div>
            <span className="resume-eyebrow">RITVIK GOYAL / THE DETAILS</span>
            <h1>
              My <em>resume.</em>
            </h1>
            <p>Experience, projects, and education. All in one place.</p>
          </div>
          <a
            className="resume-download"
            href="/RG.pdf"
            download="Ritvik-Goyal-Resume.pdf"
          >
            Download resume <ArrowDownToLine size={17} />
          </a>
        </div>
        <section
          id="resume-document"
          aria-label="Resume document"
          className="resume-document"
        >
          <div className="resume-document-bar">
            <span>
              <FileText size={16} /> RITVIK GOYAL · PDF
            </span>
            <a href="/RG.pdf" target="_blank" rel="noreferrer">
              Open PDF <ArrowUpRight size={15} />
            </a>
          </div>
          <object
            data="/RG.pdf#view=FitH"
            type="application/pdf"
            title="Ritvik Goyal's resume"
            width="100%"
            height="900"
          >
            <div className="resume-fallback">
              <FileText size={32} strokeWidth={1} />
              <h2>Your copy is one click away.</h2>
              <p>
                If your browser cannot preview the PDF here, open it in a new
                tab or save a copy.
              </p>
              <a href="/RG.pdf" target="_blank" rel="noreferrer">
                Open the resume PDF <ArrowUpRight size={16} />
              </a>
            </div>
          </object>
        </section>
        <div className="resume-bottom">
          <a href="/">
            <ArrowLeft size={15} /> Back to the portfolio
          </a>
          <a href="mailto:connect@ritvikgoyal.com">
            Let’s talk <ArrowUpRight size={15} />
          </a>
        </div>
      </main>
      <footer className="resume-footer">
        <span>Ritvik Goyal</span>
        <span>TORONTO, CANADA · {new Date().getFullYear()}</span>
      </footer>
    </div>
  );
}
