import { useEffect } from "react";
import { onCLS, onINP, onFCP, onLCP, onTTFB } from "web-vitals";

// Define our own Metric interface based on web-vitals v5
interface Metric {
  name: string;
  value: number;
  rating: "good" | "needs-improvement" | "poor";
  delta: number;
  entries: PerformanceEntry[];
  id: string;
  navigationType: string;
}

interface WebVitalsReporterProps {
  onMetric?: (metric: Metric) => void;
  reportToAnalytics?: boolean;
  debug?: boolean;
}

const WebVitalsReporter: React.FC<WebVitalsReporterProps> = ({
  onMetric,
  reportToAnalytics = true,
  debug = false,
}) => {
  useEffect(() => {
    const handleMetric = (metric: any) => {
      // Normalize the metric to our interface
      const normalizedMetric: Metric = {
        name: metric.name,
        value: metric.value,
        rating: metric.rating,
        delta: metric.delta,
        entries: metric.entries || [],
        id: metric.id,
        navigationType: metric.navigationType || "navigate",
      };

      if (debug) {
        console.log("Web Vital:", normalizedMetric);
      }

      // Send to callback
      if (onMetric) {
        onMetric(normalizedMetric);
      }

      // Send to Google Analytics if available and enabled
      if (reportToAnalytics && window.gtag) {
        window.gtag("event", normalizedMetric.name, {
          event_category: "Web Vitals",
          event_label: normalizedMetric.id,
          value: Math.round(normalizedMetric.value),
          custom_map: {
            metric_rating: normalizedMetric.rating,
            metric_delta: normalizedMetric.delta,
          },
          non_interaction: true,
        });
      }

      // Send to analytics endpoint if configured
      const endpoint = process.env.REACT_APP_WEBVITALS_ENDPOINT;
      if (endpoint) {
        fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            metric: normalizedMetric,
            url: window.location.href,
            userAgent: navigator.userAgent,
            timestamp: Date.now(),
          }),
        }).catch((err) => {
          if (debug) {
            console.warn("Failed to send Web Vitals to endpoint:", err);
          }
        });
      }
    };

    // Register all Web Vitals
    onCLS(handleMetric);
    onINP(handleMetric); // Replaces FID in v5
    onFCP(handleMetric);
    onLCP(handleMetric);
    onTTFB(handleMetric);

    // Measure custom metrics
    measureCustomMetrics(handleMetric);
  }, [onMetric, reportToAnalytics, debug]);

  return null;
};

function measureCustomMetrics(handleMetric: (metric: Metric) => void) {
  // Measure custom metrics using Performance API
  if (typeof window === "undefined" || !window.performance) return;

  // Time to Interactive (TTI) approximation
  const measureTTI = () => {
    try {
      const navigationEntry = performance.getEntriesByType(
        "navigation"
      )[0] as PerformanceNavigationTiming;
      if (navigationEntry) {
        const tti = navigationEntry.domInteractive - navigationEntry.fetchStart;
        handleMetric({
          name: "TTI",
          value: tti,
          rating:
            tti < 3800 ? "good" : tti < 7300 ? "needs-improvement" : "poor",
          delta: tti,
          entries: [navigationEntry],
          id: `v5-${Date.now()}-${Math.random()}`,
          navigationType: "navigate",
        } as Metric);
      }
    } catch (error) {
      console.warn("Failed to measure TTI:", error);
    }
  };

  // Speed Index approximation
  const measureSpeedIndex = () => {
    try {
      const paintEntries = performance.getEntriesByType("paint");
      const fcp = paintEntries.find(
        (entry) => entry.name === "first-contentful-paint"
      );
      if (fcp) {
        // Simple Speed Index approximation based on FCP
        const speedIndex = fcp.startTime * 1.2; // Rough approximation
        handleMetric({
          name: "SI",
          value: speedIndex,
          rating:
            speedIndex < 3400
              ? "good"
              : speedIndex < 5800
                ? "needs-improvement"
                : "poor",
          delta: speedIndex,
          entries: paintEntries,
          id: `v5-${Date.now()}-${Math.random()}`,
          navigationType: "navigate",
        } as Metric);
      }
    } catch (error) {
      console.warn("Failed to measure Speed Index:", error);
    }
  };

  // Resource Loading Performance
  const measureResourceMetrics = () => {
    try {
      const resources = performance.getEntriesByType(
        "resource"
      ) as PerformanceResourceTiming[];
      if (resources.length > 0) {
        const totalSize = resources.reduce(
          (sum, resource) => sum + (resource.transferSize || 0),
          0
        );
        const avgLoadTime =
          resources.reduce((sum, resource) => sum + resource.duration, 0) /
          resources.length;

        handleMetric({
          name: "Resource_Load_Time",
          value: avgLoadTime,
          rating:
            avgLoadTime < 200
              ? "good"
              : avgLoadTime < 500
                ? "needs-improvement"
                : "poor",
          delta: avgLoadTime,
          entries: resources.slice(0, 10), // Limit entries for performance
          id: `v5-${Date.now()}-${Math.random()}`,
          navigationType: "navigate",
        } as Metric);

        if (totalSize > 0) {
          handleMetric({
            name: "Total_Resource_Size",
            value: totalSize,
            rating:
              totalSize < 500000
                ? "good"
                : totalSize < 1000000
                  ? "needs-improvement"
                  : "poor",
            delta: totalSize,
            entries: resources.slice(0, 5),
            id: `v5-${Date.now()}-${Math.random()}`,
            navigationType: "navigate",
          } as Metric);
        }
      }
    } catch (error) {
      console.warn("Failed to measure resource metrics:", error);
    }
  };

  // Memory usage (if available)
  const measureMemoryUsage = () => {
    try {
      // @ts-ignore - performance.memory is non-standard but widely supported
      if (performance.memory) {
        // @ts-ignore
        const memoryUsage = performance.memory.usedJSHeapSize;
        handleMetric({
          name: "Memory_Usage",
          value: memoryUsage,
          rating:
            memoryUsage < 50000000
              ? "good"
              : memoryUsage < 100000000
                ? "needs-improvement"
                : "poor",
          delta: memoryUsage,
          entries: [],
          id: `v5-${Date.now()}-${Math.random()}`,
          navigationType: "navigate",
        } as Metric);
      }
    } catch (error) {
      console.warn("Failed to measure memory usage:", error);
    }
  };

  // Run measurements after page load
  if (document.readyState === "complete") {
    setTimeout(() => {
      measureTTI();
      measureSpeedIndex();
      measureResourceMetrics();
      measureMemoryUsage();
    }, 1000);
  } else {
    window.addEventListener("load", () => {
      setTimeout(() => {
        measureTTI();
        measureSpeedIndex();
        measureResourceMetrics();
        measureMemoryUsage();
      }, 1000);
    });
  }
}

export default WebVitalsReporter;
