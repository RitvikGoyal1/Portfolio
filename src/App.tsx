import { lazy, Suspense, useEffect, useState } from "react";
import ConceptSwitcher, { type ConceptId } from "./components/ConceptSwitcher";
import ConceptBoundary from "./components/ConceptBoundary";
import { pageMetadata } from "./seo";

const concepts = {
  signature: lazy(() => import("./concepts/signature/Signature")),
  obsidian: lazy(() => import("./concepts/obsidian/Obsidian")),
  atelier: lazy(() => import("./concepts/atelier/Atelier")),
  signal: lazy(() => import("./concepts/signal/Signal")),
};
const Resume = lazy(() => import("./pages/Resume"));
const readIsResume = () =>
  window.location.pathname.replace(/\/+$/, "").replace(/\.html$/, "") ===
  "/resume";

function readConcept(): ConceptId {
  const requested = new URLSearchParams(window.location.search).get("design");
  return requested === "atelier" ||
    requested === "signal" ||
    requested === "obsidian"
    ? requested
    : "signature";
}

export default function App() {
  const [concept, setConcept] = useState<ConceptId>(readConcept);
  const [isResume, setIsResume] = useState(readIsResume);
  const Design = concepts[concept];

  useEffect(() => {
    const onPopState = () => {
      setConcept(readConcept());
      setIsResume(readIsResume());
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.design = isResume ? "signature" : concept;
    const metadata = pageMetadata(isResume);
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

    document.title = `Ritvik Goyal — ${isResume ? "Resume" : concept === "signature" ? "Software Developer" : concept.charAt(0).toUpperCase() + concept.slice(1)}`;
    const canonical = `https://ritvikgoyal.com/${isResume ? "resume" : ""}`;
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
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute(
        "content",
        isResume
          ? "#111310"
          : concept === "atelier"
            ? "#f5f2eb"
            : concept === "signal"
              ? "#0b1319"
              : concept === "signature"
                ? "#111310"
                : "#10100f",
      );
  }, [concept, isResume]);

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
      <ConceptBoundary key={isResume ? "resume" : concept}>
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
          {isResume ? <Resume /> : <Design />}
        </Suspense>
      </ConceptBoundary>
      {!isResume &&
        (import.meta.env.DEV ||
          new URLSearchParams(window.location.search).has("design")) && (
          <ConceptSwitcher current={concept} onSelect={selectConcept} />
        )}
    </>
  );
}
