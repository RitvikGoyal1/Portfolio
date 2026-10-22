import { defaultDesign } from "./content/site";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { resolvePage } from "./seo";
import "./index.css";

async function start() {
  // Keep the readable static page on screen while its interactive module loads.
  if (
    document.documentElement.dataset.prerendered &&
    !new URLSearchParams(location.search).has("design")
  ) {
    const page = resolvePage(location.pathname);
    if (page === "resume") await import("./pages/Resume");
    else if (page !== "home" && page !== "not-found")
      await import("./pages/Project");
    else if (defaultDesign === "signature")
      await import("./concepts/signature/Signature");
    else await import("./concepts/forma/Forma");
  }
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}
void start().catch(() => {
  // Static pages and native links remain usable if a module download fails.
  const notice = document.createElement("p");
  notice.textContent =
    "The interactive features couldn’t load. Please refresh to try again.";
  notice.style.cssText =
    "padding:16px;text-align:center;color:#eeede5;background:#111310";
  document.body.prepend(notice);
});
