import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Hide loading screen function
const hideLoadingScreen = () => {
  const loadingScreen = document.getElementById("loading-screen");
  if (loadingScreen) {
    loadingScreen.classList.add("hidden");
    setTimeout(() => {
      loadingScreen.remove();
    }, 500);
  }
};

// Render app
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Hide loading screen after React has rendered
// Use requestAnimationFrame to ensure the browser has painted
requestAnimationFrame(() => {
  requestAnimationFrame(hideLoadingScreen);
});
