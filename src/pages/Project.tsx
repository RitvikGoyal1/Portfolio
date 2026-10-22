import { defaultDesign, homeAnchors } from "../content/site";
import { projects, type ProjectRecord } from "../content/projects";
import ProjectDemo from "../components/ProjectDemo";
import "./Project.css";

export default function Project({ project }: { project: ProjectRecord }) {
  const next = projects[(projects.indexOf(project) + 1) % projects.length];
  return (
    <div className="project-page">
      <a className="project-skip" href="#project-content">
        Skip to project notes
      </a>
      <header className="project-header">
        <a className="project-brand" href="/">
          Ritvik Goyal<span> / Selected work</span>
        </a>
        <nav aria-label="Main navigation">
          <a href={`/#${homeAnchors.work}`}>Work</a>
          <a href="/resume">Résumé</a>
          <a href="mailto:connect@ritvikgoyal.com">Get in touch</a>
        </nav>
      </header>
      <main id="project-content">
        <nav className="project-breadcrumb" aria-label="Breadcrumb">
          <a href="/">Home</a>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{project.name}</span>
        </nav>
        <article>
          <header className="project-intro">
            <p className="project-kicker">
              {project.category} <span>{project.year}</span>
            </p>
            <h1>{project.name}</h1>
            <p className="project-lead">{project.lead}</p>
            <p className="project-credit">{project.credit}</p>
            <div className="project-actions">
              {project.demo && (
                <a className="project-visit project-visit-primary" href="#demo">
                  Watch walkthrough <span aria-hidden="true">↓</span>
                </a>
              )}
              <a
                className="project-visit"
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
              >
                {project.slug === "dealify"
                  ? "Open trial store"
                  : "Open the project"}{" "}
                <span aria-hidden="true">↗</span>
              </a>
              {project.repository && (
                <a
                  className="project-source"
                  href={project.repository.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {project.repository.label} ↗
                </a>
              )}
            </div>
            {project.availability && (
              <p className="project-availability">{project.availability}</p>
            )}
          </header>
          {project.demo ? (
            <ProjectDemo demo={project.demo} name={project.name} />
          ) : (
            <figure className="project-figure">
              <img
                src={project.image}
                alt={project.imageAlt}
                width={project.imageWidth}
                height={project.imageHeight}
                fetchPriority="high"
              />
              <figcaption>{project.caption}</figcaption>
            </figure>
          )}
          <div className="project-notes">
            <aside className="project-facts" aria-label="Project facts">
              {project.technologies.length > 0 && <h2>Built with</h2>}
              <ul>
                {project.technologies.map((technology) => (
                  <li key={technology}>{technology}</li>
                ))}
              </ul>
              {project.award && (
                <>
                  <h2>Recognition</h2>
                  <p>{project.award}</p>
                </>
              )}
              <h2>By</h2>
              <a href={`/#${homeAnchors.about}`}>Ritvik Goyal</a>
              {project.collaborators && (
                <>
                  <h2 className="project-team-title">Team</h2>
                  <ul className="project-team">
                    {project.collaborators.map((person) => (
                      <li key={person.name}>
                        {person.url ? (
                          <a href={person.url} target="_blank" rel="noreferrer">
                            {person.name}
                          </a>
                        ) : (
                          person.name
                        )}
                        {person.role && <small>{person.role}</small>}
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {project.repository?.note && (
                <p className="project-repo-note">{project.repository.note}</p>
              )}
            </aside>
            <div className="project-prose">
              {project.sections.map((section, index) => (
                <section
                  key={section.title}
                  aria-labelledby={`project-section-${index}`}
                >
                  <h2 id={`project-section-${index}`}>{section.title}</h2>
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </section>
              ))}
              <section
                className="project-references"
                aria-labelledby="project-references-title"
              >
                <h2 id="project-references-title">See it for yourself</h2>
                <ul>
                  {project.sources.map((source) => (
                    <li key={source.url}>
                      <a href={source.url} target="_blank" rel="noreferrer">
                        {source.label} <span aria-hidden="true">↗</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>
        </article>
        <nav className="project-next" aria-label="More projects">
          <a
            href={`/#${(defaultDesign === "signature" ? "sig-work" : project.homeAnchor) || (project.slug === "dealify" ? "work" : project.slug)}`}
          >
            ← Back to the experience
          </a>
          <a href={`/projects/${next.slug}`}>
            <span>Next project</span>
            <strong>{next.name} ↗</strong>
          </a>
        </nav>
      </main>
      <footer className="project-footer">
        <a href="/">Ritvik Goyal</a>
        <a href="mailto:connect@ritvikgoyal.com">connect@ritvikgoyal.com</a>
        <span>Toronto, Canada</span>
      </footer>
    </div>
  );
}
