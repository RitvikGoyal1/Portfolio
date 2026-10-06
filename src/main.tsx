import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

async function start() {
  // Keep the readable static page on screen while its interactive module loads.
  if (
    document.documentElement.dataset.prerendered &&
    !new URLSearchParams(location.search).has("design")
  ) {
    if (location.pathname.replace(/\/+$/, "") === "/resume")
      await import("./pages/Resume");
    else await import("./concepts/signature/Signature");
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
