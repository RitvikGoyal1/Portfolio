import React from "react";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

const SEOBreadcrumbs: React.FC = () => {
  const location = useLocation();

  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const path = location.pathname;

    switch (path) {
      case "/":
        return [{ label: "Home", current: true }];
      case "/portfolio":
        return [
          { label: "Home", href: "/" },
          { label: "Portfolio", current: true },
        ];
      case "/experiences":
        return [
          { label: "Home", href: "/" },
          { label: "Experiences", current: true },
        ];
      case "/resume":
        return [
          { label: "Home", href: "/" },
          { label: "Resume", current: true },
        ];
      case "/contact":
        return [
          { label: "Home", href: "/" },
          { label: "Contact", current: true },
        ];
      default:
        return [{ label: "Home", current: true }];
    }
  };

  const breadcrumbs = getBreadcrumbs();

  // Generate JSON-LD for breadcrumbs
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.label,
      item: crumb.href ? `https://ritvikgoyal.com${crumb.href}` : undefined,
    })),
  };

  return (
    <>
      {/* JSON-LD for breadcrumbs */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd),
        }}
      />

      {/* Visual breadcrumbs */}
      {breadcrumbs.length > 1 && (
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
          sx={{
            mb: 2,
            "& .MuiBreadcrumbs-ol": {
              flexWrap: "wrap",
            },
          }}
        >
          {breadcrumbs.map((crumb, index) =>
            crumb.current ? (
              <Typography key={index} color="text.primary" aria-current="page">
                {crumb.label}
              </Typography>
            ) : (
              <Link
                key={index}
                underline="hover"
                color="inherit"
                href={crumb.href}
              >
                {crumb.label}
              </Link>
            )
          )}
        </Breadcrumbs>
      )}
    </>
  );
};

export default SEOBreadcrumbs;
