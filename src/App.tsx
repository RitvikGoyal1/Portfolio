import { lazy, Suspense, useEffect, useState } from "react";
import ConceptSwitcher, { type ConceptId } from "./components/ConceptSwitcher";
import { defaultDesign } from "./content/site";
import ConceptBoundary from "./components/ConceptBoundary";
import { pageMetadata, resolvePage, structuredData } from "./seo";
import { projectBySlug } from "./content/projects";

const concepts = {
  forma: lazy(() => import("./concepts/forma/Forma")),
  signature: lazy(() => import("./concepts/signature/Signature")),
};
const Resume = lazy(() => import("./pages/Resume"));
const Project = lazy(() => import("./pages/Project"));
const readPage = () => resolvePage(window.location.pathname);

function readConcept(): ConceptId {
  const requested = new URLSearchParams(window.location.search).get("design");
  return requested === "forma" || requested === "signature"
    ? requested
    : defaultDesign;
}

export default function App() {
  const [concept, setConcept] = useState<ConceptId>(readConcept);
  const [page, setPage] = useState(readPage);
  const isResume = page === "resume";
  const project = projectBySlug(page);
  const Design = concepts[concept];

  useEffect(() => {
    const onPopState = () => {
      setConcept(readConcept());
      setPage(readPage());
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.design = isResume
      ? "signature"
      : project
        ? "forma"
        : concept;
    const metadata = pageMetadata(page);
    for (const selector of [
      'meta[name="description"]',
      'meta[property="og:description"]',
      'meta[name="twitter:description"]',
    ]) {
      document
        .querySelector(selector)
        ?.setAttribute("content", metadata.description);
    }
    document
      .querySelector('meta[name="twitter:title"]')
      ?.setAttribute("content", metadata.title);
    delete document.documentElement.dataset.prerendered;

    document.title = metadata.title;
    const canonical = metadata.url;
    document
      .querySelector('link[rel="canonical"]')
      ?.setAttribute("href", canonical);
    document
      .querySelector('meta[property="og:url"]')
      ?.setAttribute("content", canonical);
    document
      .querySelector('meta[property="og:title"]')
      ?.setAttribute("content", document.title);
    document
      .querySelector('meta[name="robots"]')
      ?.setAttribute("content", metadata.robots);
    for (const selector of [
      'meta[property="og:image"]',
      'meta[name="twitter:image"]',
    ]) {
      document.querySelector(selector)?.setAttribute("content", metadata.image);
    }
    for (const selector of [
      'meta[property="og:image:alt"]',
      'meta[name="twitter:image:alt"]',
    ]) {
      document
        .querySelector(selector)
        ?.setAttribute("content", metadata.imageAlt);
    }
    document
      .querySelector('meta[property="og:image:width"]')
      ?.setAttribute("content", String(metadata.imageWidth));
    document
      .querySelector('meta[property="og:image:height"]')
      ?.setAttribute("content", String(metadata.imageHeight));
    const schema = document.querySelector('script[type="application/ld+json"]');
    if (schema)
      schema.textContent = JSON.stringify(structuredData(page)).replace(
        /</g,
        "\\u003c",
      );
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute(
        "content",
        isResume || (!project && concept === "signature")
          ? "#111310"
          : "#101115",
      );
  }, [concept, isResume, page, project]);

  const selectConcept = (next: ConceptId) => {
    if (next === concept) return;
    const url = new URL(window.location.href);
    url.searchParams.set("design", next);
    url.hash = "";
    window.history.pushState({}, "", url);
    document.documentElement.dataset.design = next;
    window.scrollTo({ top: 0, behavior: "instant" });
    setConcept(next);
  };

  return (
    <>
      <ConceptBoundary key={page === "home" ? concept : page}>
        <Suspense
          fallback={
            <div className="concept-loading" role="status">
              <span>
                RG<span className="loading-dot">.</span>
              </span>
              <p>Setting the scene</p>
            </div>
          }
        >
          {isResume ? (
            <Resume />
          ) : project ? (
            <Project project={project} />
          ) : page === "not-found" ? (
            <main className="concept-loading">
              <h1>Page not found</h1>
              <p>This address doesn’t lead to a project.</p>
              <a href="/">Return to Ritvik’s portfolio</a>
            </main>
          ) : (
            <Design />
          )}
        </Suspense>
      </ConceptBoundary>
      {page === "home" &&
        new URLSearchParams(window.location.search).has("design") && (
          <ConceptSwitcher current={concept} onSelect={selectConcept} />
        )}
    </>
  );
}
