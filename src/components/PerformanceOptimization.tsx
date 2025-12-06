import React, { useEffect } from "react";
import WebVitalsReporter from "./WebVitalsReporter";

interface PerformanceOptimizationProps {
  children: React.ReactNode;
}

const PerformanceOptimization: React.FC<PerformanceOptimizationProps> = ({
  children,
}) => {
  useEffect(() => {
    // Preload critical resources
    const preloadCriticalResources = () => {
      // Preload fonts
      const fontLinks = [
        "https://fonts.googleapis.com/css2?family=Open+Sans+Condensed:wght@700&display=swap",
      ];

      fontLinks.forEach((href) => {
        const link = document.createElement("link");
        link.rel = "preload";
        link.as = "style";
        link.href = href;
        link.onload = () => {
          link.rel = "stylesheet";
        };
        document.head.appendChild(link);
      });

      // Preload critical images
      const criticalImages = ["https://placehold.co/512"];

      criticalImages.forEach((src) => {
        const link = document.createElement("link");
        link.rel = "preload";
        link.as = "image";
        link.href = src;
        document.head.appendChild(link);
      });
    };

    // Optimize animations for better performance
    const optimizeAnimations = () => {
      // Reduce motion for users who prefer it
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      );
      if (prefersReducedMotion.matches) {
        document.documentElement.style.setProperty(
          "--animation-duration",
          "0.01ms"
        );
      }
    };

    // Lazy load non-critical resources
    const lazyLoadResources = () => {
      // Intersection Observer for lazy loading
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target as HTMLImageElement;
              if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute("data-src");
                observer.unobserve(img);
              }
            }
          });
        },
        {
          rootMargin: "50px",
        }
      );

      // Observe all images with data-src
      document.querySelectorAll("img[data-src]").forEach((img) => {
        observer.observe(img);
      });
    };

    // Initialize optimizations
    preloadCriticalResources();
    optimizeAnimations();

    // Delay non-critical optimizations
    setTimeout(() => {
      lazyLoadResources();
    }, 100);

    // Service Worker registration for caching
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log("SW registered: ", registration);
          })
          .catch((registrationError) => {
            console.log("SW registration failed: ", registrationError);
          });
      });
    } // Web Vitals monitoring
    const reportWebVitals = () => {
      // Web vitals will be handled by WebVitalsReporter component
      console.log("Performance optimization initialized");
    };

    // Report web vitals after page load
    if (document.readyState === "complete") {
      reportWebVitals();
    } else {
      window.addEventListener("load", reportWebVitals);
    }

    return () => {
      window.removeEventListener("load", reportWebVitals);
    };
  }, []);

  return (
    <>
      <WebVitalsReporter />
      {children}
    </>
  );
};

export default PerformanceOptimization;
