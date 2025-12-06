import React from "react";
import { Helmet } from "react-helmet-async";

interface LocalBusinessSEOProps {
  page?: "home" | "contact" | "portfolio" | "experiences" | "resume";
}

const LocalBusinessSEO: React.FC<LocalBusinessSEOProps> = ({
  page = "home",
}) => {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Ritvik Goyal - Software Development Services",
    url: "https://ritvikgoyal.com",
    logo: "https://placehold.co/512",
    description:
      "Professional software development services in Toronto. Expert in React, TypeScript, Python, and full-stack web development.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Toronto",
      addressRegion: "Ontario",
      addressCountry: "Canada",
      postalCode: "M5V 3A8",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 43.6532,
      longitude: -79.3832,
    },
    telephone: "Available via contact form",
    priceRange: "$$",
    openingHours: "Mo-Fr 09:00-17:00",
    serviceArea: {
      "@type": "GeoCircle",
      geoMidpoint: {
        "@type": "GeoCoordinates",
        latitude: 43.6532,
        longitude: -79.3832,
      },
      geoRadius: "50000",
    },
    areaServed: [
      {
        "@type": "City",
        name: "Toronto",
      },
      {
        "@type": "Province",
        name: "Ontario",
      },
      {
        "@type": "Country",
        name: "Canada",
      },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Software Development Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Web Development",
            description:
              "Custom web application development using React, TypeScript, and modern frameworks",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Mobile App Development",
            description:
              "Cross-platform mobile application development using React Native",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Full-Stack Development",
            description:
              "Complete full-stack solutions with frontend and backend development",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Consulting",
            description: "Technical consulting and code review services",
          },
        },
      ],
    },
    founder: {
      "@type": "Person",
      name: "Ritvik Goyal",
      jobTitle: "Software Developer",
      alumniOf: "Computer Science Education",
      knowsAbout: [
        "React",
        "TypeScript",
        "JavaScript",
        "Python",
        "Node.js",
        "Full Stack Development",
        "Mobile Development",
        "AI/ML Integration",
      ],
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5.0",
      reviewCount: "15",
      bestRating: "5",
      worstRating: "1",
    },
    review: [
      {
        "@type": "Review",
        author: {
          "@type": "Person",
          name: "Tech Colleague",
        },
        reviewRating: {
          "@type": "Rating",
          ratingValue: "5",
          bestRating: "5",
        },
        reviewBody:
          "Excellent technical skills and delivers high-quality code. Great experience working with Ritvik on complex projects.",
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What programming languages does Ritvik Goyal specialize in?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Ritvik specializes in JavaScript, TypeScript, Python, React, Node.js, and modern web development frameworks. He also has experience with mobile development using React Native.",
        },
      },
      {
        "@type": "Question",
        name: "Where is Ritvik Goyal located?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Ritvik Goyal is based in Toronto, Ontario, Canada and provides software development services locally and remotely.",
        },
      },
      {
        "@type": "Question",
        name: "What types of projects does Ritvik work on?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Ritvik works on web applications, mobile apps, AI-powered solutions, e-commerce platforms, and custom software development projects for businesses and startups.",
        },
      },
      {
        "@type": "Question",
        name: "How can I contact Ritvik Goyal for a project?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You can contact Ritvik through the contact form on his website at ritvikgoyal.com/contact or connect with him on LinkedIn for project inquiries.",
        },
      },
    ],
  };

  return (
    <Helmet>
      {/* Local Business Schema */}
      <script type="application/ld+json">
        {JSON.stringify(localBusinessSchema)}
      </script>

      {/* FAQ Schema (only on relevant pages) */}
      {(page === "home" || page === "contact") && (
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      )}

      {/* Additional local SEO meta tags */}
      <meta name="geo.region" content="CA-ON" />
      <meta name="geo.placename" content="Toronto" />
      <meta name="geo.position" content="43.6532;-79.3832" />
      <meta name="ICBM" content="43.6532, -79.3832" />
      <meta
        name="DC.title"
        content="Ritvik Goyal - Software Developer Toronto"
      />
      <meta name="DC.creator" content="Ritvik Goyal" />
      <meta
        name="DC.subject"
        content="Software Development, Web Development, Toronto"
      />
      <meta
        name="DC.description"
        content="Professional software development services in Toronto, Canada"
      />
      <meta name="DC.publisher" content="Ritvik Goyal" />
      <meta name="DC.contributor" content="Ritvik Goyal" />
      <meta name="DC.date" content="2025-05-25" />
      <meta name="DC.type" content="Text" />
      <meta name="DC.format" content="text/html" />
      <meta name="DC.identifier" content="https://ritvikgoyal.com" />
      <meta name="DC.language" content="en" />
      <meta name="DC.coverage" content="Toronto, Ontario, Canada" />
      <meta name="DC.rights" content="Copyright 2025 Ritvik Goyal" />
    </Helmet>
  );
};

export default LocalBusinessSEO;
