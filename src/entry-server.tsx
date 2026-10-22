import Signature from "./concepts/signature/Signature";
import type { DesignId } from "./content/site";
import { renderToString } from "react-dom/server";
import Forma from "./concepts/forma/Forma";
import Resume from "./pages/Resume";
import Project from "./pages/Project";
import { projectBySlug } from "./content/projects";
import type { PageId } from "./seo";

// Render the same content served to visitors, without a browser or external service.
export function renderPage(page: PageId, design: DesignId = "forma") {
  const project = projectBySlug(page);
  return renderToString(
    page === "resume" ? (
      <Resume />
    ) : project ? (
      <Project project={project} />
    ) : design === "signature" ? (
      <Signature />
    ) : (
      <Forma />
    ),
  );
}
