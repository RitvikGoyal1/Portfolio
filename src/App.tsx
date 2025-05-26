import { useState, useEffect, lazy, Suspense } from "react";
import { ThemeProvider, CssBaseline, CircularProgress } from "@mui/material";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lightTheme, darkTheme } from "./styles/theme";
import Header from "./components/Header";
import Footer from "./components/Footer";
import InteractiveBackground from "./components/InteractiveBackground";
import { AnimatePresence } from "framer-motion";
import CustomCursor from "./components/CustomCursor";
import { motion } from "framer-motion";
import ErrorBoundary from "./components/ErrorBoundary";
import { HelmetProvider } from "react-helmet-async";
import GoogleAnalytics from "./components/GoogleAnalytics";
import seoConfig from "./config/seoConfig";
import SEOAudit from "./components/SEOAudit";

const Home = lazy(() => import("./pages/Home"));
const Experiences = lazy(() => import("./pages/Experiences"));
const Portfolio = lazy(() => import("./pages/Portfolio"));
const Contact = lazy(() => import("./pages/Contact"));
const Resume = lazy(() => import("./pages/Resume"));

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem("darkMode");
    return stored ? stored === "true" : true;
  });

  useEffect(() => {
    localStorage.setItem("darkMode", String(darkMode));
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const theme = darkMode ? darkTheme : lightTheme;

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 },
  };

  const pageTransition = { duration: 0.4 };

  const routes = [
    { path: "/", element: Home },
    { path: "/experiences", element: Experiences },
    { path: "/resume", element: Resume },
    { path: "/contact", element: Contact },
    { path: "/portfolio", element: Portfolio },
  ];
  return (
    <HelmetProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GoogleAnalytics />
        <div
          style={{
            position: "relative",
            zIndex: 1,
            backgroundColor: darkMode
              ? "rgba(18, 18, 18, 0.7)"
              : "rgba(255, 255, 255, 0.85)",
          }}
        >
          <InteractiveBackground />
          <div style={{ padding: "2rem" }}>
            <Router basename="/">
              <Header setDarkMode={setDarkMode} darkMode={darkMode} />
              <Suspense
                fallback={
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100vh",
                    }}
                  >
                    <CircularProgress />
                  </div>
                }
              >
                <ErrorBoundary>
                  <div id="main-content">
                    {" "}
                    <AnimatePresence mode="wait">
                      <Routes>
                        {routes.map(({ path, element: Element }) => (
                          <Route
                            key={path}
                            path={path}
                            element={
                              <motion.div
                                initial="initial"
                                animate="in"
                                exit="out"
                                variants={pageVariants}
                                transition={pageTransition}
                              >
                                <Element />
                              </motion.div>
                            }
                          />
                        ))}
                      </Routes>
                    </AnimatePresence>
                  </div>
                </ErrorBoundary>
              </Suspense>
              <Footer />
            </Router>
          </div>{" "}
        </div>
        {window.innerWidth > 768 && <CustomCursor />}
        {seoConfig.features.enableSEOAudit && <SEOAudit />}
      </ThemeProvider>
    </HelmetProvider>
  );
};

export default App;
