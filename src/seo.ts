export const siteUrl = "https://ritvikgoyal.com";
export const homeDescription =
  "Ritvik Goyal is a software developer in Toronto, building at Shopify through Dev Degree and studying at York University. Explore projects, experience, and resume.";
export const resumeDescription =
  "View and download Ritvik Goyal’s resume: software development experience, projects, and education. Based in Toronto, building at Shopify through Dev Degree.";

export function pageMetadata(isResume: boolean) {
  return {
    title: `Ritvik Goyal — ${isResume ? "Resume" : "Software Developer"}`,
    description: isResume ? resumeDescription : homeDescription,
    url: `${siteUrl}${isResume ? "/resume" : "/"}`,
    image: `${siteUrl}/social-card.png`,
  };
}

export function structuredData(isResume: boolean) {
  const page = pageMetadata(isResume);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: `${siteUrl}/`,
        name: "Ritvik Goyal",
        inLanguage: "en-CA",
        publisher: { "@id": `${siteUrl}/#person` },
      },
      {
        "@type": "Person",
        "@id": `${siteUrl}/#person`,
        name: "Ritvik Goyal",
        url: `${siteUrl}/`,
        jobTitle: "Software Developer",
        email: "connect@ritvikgoyal.com",
        homeLocation: { "@type": "City", name: "Toronto, Ontario, Canada" },
        worksFor: {
          "@type": "Organization",
          name: "Shopify",
          url: "https://www.shopify.com/",
        },
        affiliation: {
          "@type": "CollegeOrUniversity",
          name: "York University",
          url: "https://www.yorku.ca/",
        },
        sameAs: [
          "https://github.com/RitvikGoyal1",
          "https://www.linkedin.com/in/ritvikgoyal1/",
          "https://devpost.com/RitvikGoyal1",
        ],
      },
      {
        "@type": isResume ? "WebPage" : "ProfilePage",
        "@id": `${page.url}#webpage`,
        url: page.url,
        name: page.title,
        description: page.description,
        inLanguage: "en-CA",
        isPartOf: { "@id": `${siteUrl}/#website` },
        mainEntity: { "@id": `${siteUrl}/#person` },
        ...(isResume
          ? {
              associatedMedia: {
                "@type": "DigitalDocument",
                name: "Ritvik Goyal Resume",
                url: `${siteUrl}/RG.pdf`,
                encodingFormat: "application/pdf",
              },
            }
          : {}),
      },
    ],
  };
}
