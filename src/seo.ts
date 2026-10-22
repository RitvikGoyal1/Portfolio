import { xProfile, instagramProfile } from "./content/social";
import { projectBySlug, projects, type ProjectSlug } from "./content/projects";

export const siteUrl =
  import.meta.env?.VITE_SITE_URL || "https://app.ritvikgoyal.com";
export const homeDescription =
  "Ritvik Goyal is a software developer in Toronto, building at Shopify through Dev Degree and studying at York University. Explore projects, experience, and resume.";
export const resumeDescription =
  "View and download Ritvik Goyal’s resume: software development experience, projects, and education. Based in Toronto, building at Shopify through Dev Degree.";
export type PageId = "home" | "resume" | "not-found" | ProjectSlug;

export const pageRoutes: { id: PageId; path: string; file: string }[] = [
  { id: "home", path: "/", file: "index.html" },
  { id: "resume", path: "/resume", file: "resume.html" },
  ...projects.map(({ slug }) => ({
    id: slug,
    path: `/projects/${slug}`,
    file: `projects/${slug}.html`,
  })),
];

export function resolvePage(pathname: string): PageId {
  const path =
    pathname
      .replace(/\/index\.html$/, "/")
      .replace(/\.html$/, "")
      .replace(/\/+$/, "") || "/";
  return pageRoutes.find((route) => route.path === path)?.id || "not-found";
}

export function pageMetadata(id: PageId, origin = siteUrl) {
  const project = projectBySlug(id);
  const route = pageRoutes.find((page) => page.id === id);
  return {
    title:
      project?.title ||
      `Ritvik Goyal — ${id === "resume" ? "Resume" : id === "not-found" ? "Page not found" : "Software Developer"}`,
    description:
      project?.description ||
      (id === "resume" ? resumeDescription : homeDescription),
    url: `${origin}${route?.path || "/404"}`,
    image: `${origin}${project?.image || "/social-card.png"}`,
    imageWidth: project?.imageWidth || 1200,
    imageHeight: project?.imageHeight || 630,
    imageAlt:
      project?.imageAlt ||
      "Ritvik Goyal — Software Developer. Toronto. Shopify Dev Degree · York University.",
    robots:
      id === "not-found"
        ? "noindex, follow"
        : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  };
}

export function structuredData(id: PageId, origin = siteUrl) {
  const page = pageMetadata(id, origin);
  const project = projectBySlug(id);
  const personId = `${origin}/#person`;
  const projectId = `${page.url}#project`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${origin}/#website`,
        url: `${origin}/`,
        name: "Ritvik Goyal",
        inLanguage: "en-CA",
        publisher: { "@id": personId },
      },
      {
        "@type": "Person",
        "@id": personId,
        name: "Ritvik Goyal",
        url: `${origin}/`,
        jobTitle: "Software Developer",
        description: homeDescription,
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
          xProfile.url,
          instagramProfile.url,
          "https://github.com/RitvikGoyal1",
          "https://www.linkedin.com/in/ritvikgoyal1/",
          "https://devpost.com/RitvikGoyal1",
        ],
      },
      {
        "@type": id === "home" ? "ProfilePage" : "WebPage",
        "@id": `${page.url}#webpage`,
        url: page.url,
        name: page.title,
        description: page.description,
        inLanguage: "en-CA",
        isPartOf: { "@id": `${origin}/#website` },
        mainEntity: { "@id": project ? projectId : personId },
        ...(project
          ? {
              author: { "@id": personId },
              primaryImageOfPage: {
                "@type": "ImageObject",
                url: page.image,
                width: page.imageWidth,
                height: page.imageHeight,
                caption: project.caption,
              },
              breadcrumb: { "@id": `${page.url}#breadcrumb` },
            }
          : {}),
        ...(id === "resume"
          ? {
              associatedMedia: {
                "@type": "DigitalDocument",
                name: "Ritvik Goyal Resume",
                url: `${origin}/RG.pdf`,
                encodingFormat: "application/pdf",
              },
            }
          : {}),
        ...(id === "home"
          ? {
              hasPart: projects.map(({ slug, name }) => ({
                "@type": "WebPage",
                name: `${name} project notes`,
                url: `${origin}/projects/${slug}`,
              })),
            }
          : {}),
      },
      ...(project
        ? [
            {
              "@type": "CreativeWork",
              "@id": projectId,
              name: project.name,
              description: project.description,
              genre: "Software project",
              url: project.liveUrl,
              image: page.image,
              mainEntityOfPage: { "@id": `${page.url}#webpage` },
              creator: [
                { "@id": personId },
                ...(project.collaborators || []).map((person) => ({
                  "@type": "Person",
                  name: person.name,
                  ...(person.url ? { url: person.url } : {}),
                })),
              ],
              ...(project.award ? { award: project.award } : {}),
              citation: project.sources.map((source) => source.url),
            },
            {
              "@type": "BreadcrumbList",
              "@id": `${page.url}#breadcrumb`,
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: `${origin}/`,
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: project.name,
                  item: page.url,
                },
              ],
            },
          ]
        : []),
    ],
  };
}
