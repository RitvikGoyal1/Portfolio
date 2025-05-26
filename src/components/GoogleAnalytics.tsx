import React, { useEffect } from "react";
import seoConfig from "../config/seoConfig";

// Extend Window interface for gtag
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

interface GoogleAnalyticsProps {
  measurementId?: string;
  enableEnhancedEcommerce?: boolean;
  enableUserTiming?: boolean;
}

const GoogleAnalytics: React.FC<GoogleAnalyticsProps> = ({
  measurementId = seoConfig.googleAnalytics.measurementId,
  enableEnhancedEcommerce = seoConfig.googleAnalytics.enableEnhancedEcommerce,
  enableUserTiming = seoConfig.googleAnalytics.enableUserTiming,
}) => {
  useEffect(() => {
    // Only load in production
    if (process.env.NODE_ENV !== "production") {
      console.log("Google Analytics disabled in development mode");
      return;
    }

    // Load Google Analytics script
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer.push(args);
    }

    // Make gtag globally available
    (window as any).gtag = gtag;

    gtag("js", new Date());
    gtag("config", measurementId, {
      // Enhanced measurement settings
      enhanced_measurement: true,
      page_title: document.title,
      page_location: window.location.href,

      // Privacy settings
      anonymize_ip: true,
      cookie_flags: "SameSite=None;Secure",

      // Performance settings
      send_page_view: true,

      // Custom parameters for portfolio
      custom_map: {
        developer_name: "Ritvik Goyal",
        portfolio_version: "2.0",
        site_type: "portfolio",
      },
    });

    // Track enhanced ecommerce events if enabled
    if (enableEnhancedEcommerce) {
      gtag("config", measurementId, {
        enhanced_ecommerce: true,
      });
    }

    // Set up user timing if enabled
    if (enableUserTiming) {
      // Track page load performance
      window.addEventListener("load", () => {
        const perfData = performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;

        gtag("event", "timing_complete", {
          event_category: "Page Load",
          event_label: "Total Load Time",
          value: pageLoadTime,
        });

        // Track DOM ready time
        const domReadyTime =
          perfData.domContentLoadedEventEnd - perfData.navigationStart;
        gtag("event", "timing_complete", {
          event_category: "Page Load",
          event_label: "DOM Ready Time",
          value: domReadyTime,
        });
      });
    }

    // Track scroll depth
    let maxScroll = 0;
    const trackScrollDepth = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) *
          100
      );

      if (scrollPercent > maxScroll && scrollPercent % 25 === 0) {
        maxScroll = scrollPercent;
        gtag("event", "scroll", {
          event_category: "Engagement",
          event_label: `${scrollPercent}%`,
          value: scrollPercent,
        });
      }
    };

    window.addEventListener("scroll", trackScrollDepth, { passive: true });

    // Track file downloads
    const trackDownloads = (event: Event) => {
      const target = event.target as HTMLElement;
      const link = target.closest("a");

      if (link && link.href) {
        const url = new URL(link.href);
        const fileName = url.pathname.split("/").pop();

        // Track PDF downloads (resume)
        if (fileName && fileName.endsWith(".pdf")) {
          gtag("event", "file_download", {
            event_category: "Downloads",
            event_label: fileName,
            file_name: fileName,
            file_extension: ".pdf",
          });
        }
      }
    };

    document.addEventListener("click", trackDownloads);

    // Track external link clicks
    const trackExternalLinks = (event: Event) => {
      const target = event.target as HTMLElement;
      const link = target.closest("a");

      if (link && link.href) {
        const url = new URL(link.href);

        // Check if it's an external link
        if (url.hostname !== window.location.hostname) {
          gtag("event", "click", {
            event_category: "External Links",
            event_label: url.hostname,
            transport_type: "beacon",
          });
        }
      }
    };

    document.addEventListener("click", trackExternalLinks);

    // Track form interactions
    const trackFormInteractions = () => {
      const forms = document.querySelectorAll("form");

      forms.forEach((form) => {
        form.addEventListener("submit", () => {
          window.gtag("event", "form_submit", {
            event_category: "Form",
            event_label: form.id || "contact_form",
          });
        });

        // Track form field interactions
        const inputs = form.querySelectorAll("input, textarea, select");
        inputs.forEach((input) => {
          input.addEventListener("focus", () => {
            window.gtag("event", "form_start", {
              event_category: "Form",
              event_label:
                (input as HTMLInputElement).name || "field_interaction",
            });
          });
        });
      });
    };

    // Set up form tracking after DOM is ready
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", trackFormInteractions);
    } else {
      trackFormInteractions();
    }

    // Track page visibility changes
    document.addEventListener("visibilitychange", () => {
      gtag("event", document.hidden ? "page_hide" : "page_show", {
        event_category: "Engagement",
        event_label: "Page Visibility",
      });
    });

    // Cleanup function
    return () => {
      window.removeEventListener("scroll", trackScrollDepth);
      document.removeEventListener("click", trackDownloads);
      document.removeEventListener("click", trackExternalLinks);
      document.removeEventListener("DOMContentLoaded", trackFormInteractions);
    };
  }, [measurementId, enableEnhancedEcommerce, enableUserTiming]);

  return null; // This component doesn't render anything
};

// Utility functions for manual tracking
export const trackEvent = (eventName: string, parameters: any = {}) => {
  if (typeof window !== "undefined" && typeof window.gtag !== "undefined") {
    window.gtag("event", eventName, parameters);
  }
};

export const trackPageView = (pagePath: string, pageTitle?: string) => {
  if (typeof window !== "undefined" && typeof window.gtag !== "undefined") {
    window.gtag("config", seoConfig.googleAnalytics.measurementId, {
      page_path: pagePath,
      page_title: pageTitle || document.title,
    });
  }
};

export const setUserProperties = (properties: any) => {
  if (typeof window !== "undefined" && typeof window.gtag !== "undefined") {
    window.gtag("config", seoConfig.googleAnalytics.measurementId, {
      user_properties: properties,
    });
  }
};

// Portfolio-specific tracking functions
export const trackProjectView = (
  projectName: string,
  projectTech: string[]
) => {
  trackEvent("view_project", {
    event_category: "Portfolio",
    event_label: projectName,
    project_name: projectName,
    technologies: projectTech.join(", "),
  });
};

export const trackContactFormSubmission = (formData: any) => {
  trackEvent("contact_form_submit", {
    event_category: "Lead Generation",
    event_label: "Contact Form",
    form_type: "contact",
    has_message: !!formData.message,
  });
};

export const trackResumeDownload = () => {
  trackEvent("resume_download", {
    event_category: "Downloads",
    event_label: "Resume PDF",
    file_name: "RG.pdf",
  });
};

export default GoogleAnalytics;
