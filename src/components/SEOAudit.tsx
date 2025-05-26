import React, { useEffect, useState } from "react";

interface SEOAuditResult {
  category: string;
  test: string;
  status: "pass" | "warning" | "fail";
  message: string;
  value?: string | number;
  recommendation?: string;
}

interface SEOAuditProps {
  showInProduction?: boolean;
  autoRun?: boolean;
}

const SEOAudit: React.FC<SEOAuditProps> = ({
  showInProduction = false,
  autoRun = true,
}) => {
  const [auditResults, setAuditResults] = useState<SEOAuditResult[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in development by default
    if (process.env.NODE_ENV === "production" && !showInProduction) {
      return;
    }

    if (autoRun) {
      runSEOAudit();
    }

    // Add keyboard shortcut to toggle audit (Ctrl+Shift+S)
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === "S") {
        event.preventDefault();
        setIsVisible(!isVisible);
        if (!auditResults.length) {
          runSEOAudit();
        }
      }
    };

    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, [autoRun, showInProduction, isVisible, auditResults.length]);

  const runSEOAudit = () => {
    const results: SEOAuditResult[] = [];

    // Basic Meta Tags
    results.push(checkMetaTag("title", "Title Tag"));
    results.push(checkMetaTag("description", "Meta Description"));
    results.push(checkMetaTag("keywords", "Meta Keywords"));
    results.push(checkMetaTag("author", "Author Tag"));
    results.push(checkMetaTag("robots", "Robots Meta"));

    // Open Graph Tags
    results.push(checkMetaProperty("og:title", "Open Graph Title"));
    results.push(checkMetaProperty("og:description", "Open Graph Description"));
    results.push(checkMetaProperty("og:image", "Open Graph Image"));
    results.push(checkMetaProperty("og:url", "Open Graph URL"));
    results.push(checkMetaProperty("og:type", "Open Graph Type"));

    // Twitter Cards
    results.push(checkMetaTag("twitter:card", "Twitter Card"));
    results.push(checkMetaTag("twitter:title", "Twitter Title"));
    results.push(checkMetaTag("twitter:description", "Twitter Description"));
    results.push(checkMetaTag("twitter:image", "Twitter Image"));

    // Technical SEO
    results.push(checkCanonicalTag());
    results.push(checkStructuredData());
    results.push(checkHreflang());
    results.push(checkViewport());
    results.push(checkCharset());

    // Content SEO
    results.push(checkHeadingStructure());
    results.push(checkImageAltTags());
    results.push(checkInternalLinks());
    results.push(checkPageTitle());

    // Performance SEO
    results.push(checkPageSpeed());
    results.push(checkMobileResponsive());
    results.push(checkHTTPS());

    // Local SEO
    results.push(checkLocalBusinessSchema());
    results.push(checkGeoTags());

    setAuditResults(results);
  };

  const checkMetaTag = (name: string, displayName: string): SEOAuditResult => {
    const meta = document.querySelector(
      `meta[name="${name}"]`
    ) as HTMLMetaElement;
    if (!meta) {
      return {
        category: "Meta Tags",
        test: displayName,
        status: "fail",
        message: `Missing ${displayName}`,
        recommendation: `Add <meta name="${name}" content="..."> tag`,
      };
    }

    const content = meta.content;
    if (!content || content.length < 10) {
      return {
        category: "Meta Tags",
        test: displayName,
        status: "warning",
        message: `${displayName} is too short`,
        value: content,
        recommendation: `${displayName} should be at least 10 characters`,
      };
    }

    // Check specific requirements
    if (
      name === "description" &&
      (content.length > 160 || content.length < 120)
    ) {
      return {
        category: "Meta Tags",
        test: displayName,
        status: "warning",
        message: `Meta description length: ${content.length} characters`,
        value: content,
        recommendation: "Meta description should be 120-160 characters",
      };
    }

    if (name === "title" && (content.length > 60 || content.length < 30)) {
      return {
        category: "Meta Tags",
        test: displayName,
        status: "warning",
        message: `Title length: ${content.length} characters`,
        value: content,
        recommendation: "Title should be 30-60 characters",
      };
    }

    return {
      category: "Meta Tags",
      test: displayName,
      status: "pass",
      message: `${displayName} is properly set`,
      value: content,
    };
  };

  const checkMetaProperty = (
    property: string,
    displayName: string
  ): SEOAuditResult => {
    const meta = document.querySelector(
      `meta[property="${property}"]`
    ) as HTMLMetaElement;
    if (!meta) {
      return {
        category: "Social Media",
        test: displayName,
        status: "fail",
        message: `Missing ${displayName}`,
        recommendation: `Add <meta property="${property}" content="..."> tag`,
      };
    }

    return {
      category: "Social Media",
      test: displayName,
      status: "pass",
      message: `${displayName} is properly set`,
      value: meta.content,
    };
  };

  const checkCanonicalTag = (): SEOAuditResult => {
    const canonical = document.querySelector(
      'link[rel="canonical"]'
    ) as HTMLLinkElement;
    if (!canonical) {
      return {
        category: "Technical SEO",
        test: "Canonical URL",
        status: "fail",
        message: "Missing canonical URL",
        recommendation: 'Add <link rel="canonical" href="..."> tag',
      };
    }

    return {
      category: "Technical SEO",
      test: "Canonical URL",
      status: "pass",
      message: "Canonical URL is set",
      value: canonical.href,
    };
  };

  const checkStructuredData = (): SEOAuditResult => {
    const jsonLd = document.querySelectorAll(
      'script[type="application/ld+json"]'
    );
    if (jsonLd.length === 0) {
      return {
        category: "Technical SEO",
        test: "Structured Data",
        status: "fail",
        message: "No structured data found",
        recommendation: "Add JSON-LD structured data",
      };
    }

    return {
      category: "Technical SEO",
      test: "Structured Data",
      status: "pass",
      message: `${jsonLd.length} structured data blocks found`,
      value: jsonLd.length,
    };
  };

  const checkHreflang = (): SEOAuditResult => {
    const hreflang = document.querySelectorAll("link[hreflang]");
    return {
      category: "Technical SEO",
      test: "Hreflang",
      status: hreflang.length > 0 ? "pass" : "warning",
      message:
        hreflang.length > 0
          ? "Hreflang tags found"
          : "No hreflang tags (OK for single language sites)",
      value: hreflang.length,
    };
  };

  const checkViewport = (): SEOAuditResult => {
    const viewport = document.querySelector(
      'meta[name="viewport"]'
    ) as HTMLMetaElement;
    if (!viewport) {
      return {
        category: "Mobile SEO",
        test: "Viewport Meta",
        status: "fail",
        message: "Missing viewport meta tag",
        recommendation:
          'Add <meta name="viewport" content="width=device-width, initial-scale=1.0">',
      };
    }

    return {
      category: "Mobile SEO",
      test: "Viewport Meta",
      status: "pass",
      message: "Viewport meta tag is set",
      value: viewport.content,
    };
  };

  const checkCharset = (): SEOAuditResult => {
    const charset = document.querySelector("meta[charset]") as HTMLMetaElement;
    if (!charset) {
      return {
        category: "Technical SEO",
        test: "Character Encoding",
        status: "fail",
        message: "Missing charset declaration",
        recommendation: 'Add <meta charset="UTF-8">',
      };
    }

    return {
      category: "Technical SEO",
      test: "Character Encoding",
      status: "pass",
      message: "Character encoding is set",
      value: charset.getAttribute("charset") || undefined,
    };
  };

  const checkHeadingStructure = (): SEOAuditResult => {
    const h1s = document.querySelectorAll("h1");
    const h2s = document.querySelectorAll("h2");
    const h3s = document.querySelectorAll("h3");

    if (h1s.length === 0) {
      return {
        category: "Content SEO",
        test: "Heading Structure",
        status: "fail",
        message: "No H1 tag found",
        recommendation: "Add exactly one H1 tag per page",
      };
    }

    if (h1s.length > 1) {
      return {
        category: "Content SEO",
        test: "Heading Structure",
        status: "warning",
        message: `Multiple H1 tags found (${h1s.length})`,
        recommendation: "Use only one H1 tag per page",
      };
    }

    return {
      category: "Content SEO",
      test: "Heading Structure",
      status: "pass",
      message: `Good heading structure: ${h1s.length} H1, ${h2s.length} H2, ${h3s.length} H3`,
      value: `H1:${h1s.length}, H2:${h2s.length}, H3:${h3s.length}`,
    };
  };

  const checkImageAltTags = (): SEOAuditResult => {
    const images = document.querySelectorAll("img");
    const imagesWithoutAlt = Array.from(images).filter((img) => !img.alt);

    if (imagesWithoutAlt.length > 0) {
      return {
        category: "Content SEO",
        test: "Image Alt Tags",
        status: "warning",
        message: `${imagesWithoutAlt.length} images missing alt text`,
        recommendation: "Add descriptive alt text to all images",
      };
    }

    return {
      category: "Content SEO",
      test: "Image Alt Tags",
      status: "pass",
      message: `All ${images.length} images have alt text`,
      value: images.length,
    };
  };

  const checkInternalLinks = (): SEOAuditResult => {
    const links = document.querySelectorAll("a[href]");
    const internalLinks = Array.from(links).filter((link) => {
      const href = link.getAttribute("href");
      return (
        href &&
        (href.startsWith("/") || href.includes(window.location.hostname))
      );
    });

    return {
      category: "Content SEO",
      test: "Internal Links",
      status: internalLinks.length > 0 ? "pass" : "warning",
      message: `${internalLinks.length} internal links found`,
      value: internalLinks.length,
    };
  };

  const checkPageTitle = (): SEOAuditResult => {
    const title = document.title;
    if (!title) {
      return {
        category: "Content SEO",
        test: "Page Title",
        status: "fail",
        message: "Missing page title",
        recommendation: "Add a descriptive page title",
      };
    }

    return {
      category: "Content SEO",
      test: "Page Title",
      status: "pass",
      message: "Page title is set",
      value: title,
    };
  };

  const checkPageSpeed = (): SEOAuditResult => {
    const loadTime =
      performance.timing?.loadEventEnd - performance.timing?.navigationStart;
    if (!loadTime) {
      return {
        category: "Performance SEO",
        test: "Page Load Time",
        status: "warning",
        message: "Unable to measure page load time",
      };
    }

    const status =
      loadTime < 3000 ? "pass" : loadTime < 5000 ? "warning" : "fail";
    return {
      category: "Performance SEO",
      test: "Page Load Time",
      status,
      message: `Page loaded in ${loadTime}ms`,
      value: `${loadTime}ms`,
      recommendation:
        status !== "pass"
          ? "Optimize images, minify CSS/JS, enable compression"
          : undefined,
    };
  };
  const checkMobileResponsive = (): SEOAuditResult => {
    const hasResponsiveDesign =
      document.querySelector('meta[name="viewport"]') !== null;

    return {
      category: "Mobile SEO",
      test: "Mobile Responsive",
      status: hasResponsiveDesign ? "pass" : "fail",
      message: hasResponsiveDesign
        ? "Site appears mobile responsive"
        : "Mobile responsiveness needs verification",
      value: `Viewport width: ${window.innerWidth}px`,
    };
  };

  const checkHTTPS = (): SEOAuditResult => {
    const isHTTPS = window.location.protocol === "https:";
    return {
      category: "Security SEO",
      test: "HTTPS",
      status: isHTTPS ? "pass" : "fail",
      message: isHTTPS
        ? "Site is served over HTTPS"
        : "Site is not using HTTPS",
      value: window.location.protocol,
      recommendation: !isHTTPS
        ? "Enable SSL certificate and redirect HTTP to HTTPS"
        : undefined,
    };
  };

  const checkLocalBusinessSchema = (): SEOAuditResult => {
    const scripts = document.querySelectorAll(
      'script[type="application/ld+json"]'
    );
    const hasLocalBusiness = Array.from(scripts).some((script) => {
      try {
        const data = JSON.parse(script.textContent || "");
        return (
          data["@type"] === "LocalBusiness" ||
          data["@type"] === "ProfessionalService"
        );
      } catch {
        return false;
      }
    });

    return {
      category: "Local SEO",
      test: "Local Business Schema",
      status: hasLocalBusiness ? "pass" : "warning",
      message: hasLocalBusiness
        ? "Local business schema found"
        : "No local business schema (OK for non-local businesses)",
    };
  };

  const checkGeoTags = (): SEOAuditResult => {
    const geoRegion = document.querySelector('meta[name="geo.region"]');
    const geoPosition = document.querySelector('meta[name="geo.position"]');

    if (!geoRegion && !geoPosition) {
      return {
        category: "Local SEO",
        test: "Geo Tags",
        status: "warning",
        message: "No geo tags found (OK for non-local businesses)",
        recommendation:
          "Add geo.region and geo.position meta tags for local SEO",
      };
    }

    return {
      category: "Local SEO",
      test: "Geo Tags",
      status: "pass",
      message: "Geographic meta tags found",
      value: `Region: ${(geoRegion as HTMLMetaElement)?.content || "N/A"}`,
    };
  };

  if (process.env.NODE_ENV === "production" && !showInProduction) {
    return null;
  }

  if (!isVisible) {
    return (
      <div
        style={{
          position: "fixed",
          top: "10px",
          right: "10px",
          zIndex: 9999,
          background: "#000",
          color: "#fff",
          padding: "5px 10px",
          borderRadius: "4px",
          fontSize: "12px",
          cursor: "pointer",
        }}
        onClick={() => setIsVisible(true)}
      >
        SEO Audit (Ctrl+Shift+S)
      </div>
    );
  }

  const passCount = auditResults.filter((r) => r.status === "pass").length;
  const warningCount = auditResults.filter(
    (r) => r.status === "warning"
  ).length;
  const failCount = auditResults.filter((r) => r.status === "fail").length;

  return (
    <div
      style={{
        position: "fixed",
        top: "10px",
        right: "10px",
        width: "400px",
        maxHeight: "80vh",
        background: "#fff",
        border: "1px solid #ccc",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        zIndex: 9999,
        overflow: "hidden",
        fontFamily: "monospace",
        fontSize: "12px",
      }}
    >
      <div
        style={{
          background: "#f5f5f5",
          padding: "10px",
          borderBottom: "1px solid #ddd",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <strong>SEO Audit Results</strong>
        <button
          onClick={() => setIsVisible(false)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          ×
        </button>
      </div>

      <div style={{ padding: "10px", background: "#f9f9f9" }}>
        <div style={{ display: "flex", gap: "15px" }}>
          <span style={{ color: "#28a745" }}>✓ {passCount} Pass</span>
          <span style={{ color: "#ffc107" }}>⚠ {warningCount} Warning</span>
          <span style={{ color: "#dc3545" }}>✗ {failCount} Fail</span>
        </div>
      </div>

      <div
        style={{
          maxHeight: "60vh",
          overflowY: "auto",
          padding: "10px",
        }}
      >
        {Object.entries(
          auditResults.reduce(
            (acc, result) => {
              if (!acc[result.category]) acc[result.category] = [];
              acc[result.category].push(result);
              return acc;
            },
            {} as Record<string, SEOAuditResult[]>
          )
        ).map(([category, results]) => (
          <div key={category} style={{ marginBottom: "15px" }}>
            <h4 style={{ margin: "0 0 8px 0", color: "#333" }}>{category}</h4>
            {results.map((result, idx) => (
              <div
                key={idx}
                style={{
                  padding: "8px",
                  margin: "4px 0",
                  border: "1px solid #eee",
                  borderRadius: "4px",
                  background:
                    result.status === "pass"
                      ? "#d4edda"
                      : result.status === "warning"
                        ? "#fff3cd"
                        : "#f8d7da",
                }}
              >
                <div style={{ fontWeight: "bold", marginBottom: "4px" }}>
                  {result.status === "pass"
                    ? "✓"
                    : result.status === "warning"
                      ? "⚠"
                      : "✗"}{" "}
                  {result.test}
                </div>
                <div style={{ color: "#666" }}>{result.message}</div>
                {result.value && (
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#555",
                      marginTop: "2px",
                    }}
                  >
                    Value: {result.value}
                  </div>
                )}
                {result.recommendation && (
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#007bff",
                      marginTop: "2px",
                    }}
                  >
                    💡 {result.recommendation}
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div
        style={{
          padding: "10px",
          borderTop: "1px solid #ddd",
          background: "#f5f5f5",
        }}
      >
        <button
          onClick={runSEOAudit}
          style={{
            width: "100%",
            padding: "8px",
            background: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Re-run Audit
        </button>
      </div>
    </div>
  );
};

export default SEOAudit;
