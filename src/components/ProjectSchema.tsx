import React from "react";
import { Helmet } from "react-helmet-async";

interface ProjectSchemaProps {
  project: {
    title: string;
    description: string;
    url?: string;
    imageUrl?: string;
    technologies: string[];
    dateCreated?: string;
    datePublished?: string;
    category?: string;
  };
  author?: {
    name: string;
    url?: string;
  };
}

const ProjectSchema: React.FC<ProjectSchemaProps> = ({
  project,
  author = { name: "Ritvik Goyal", url: "https://ritvikgoyal.com" },
}) => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.description,
    url: project.url,
    image: project.imageUrl,
    author: {
      "@type": "Person",
      name: author.name,
      url: author.url,
    },
    creator: {
      "@type": "Person",
      name: author.name,
      url: author.url,
    },
    dateCreated: project.dateCreated,
    datePublished: project.datePublished || project.dateCreated,
    about: project.technologies.map((tech) => ({
      "@type": "Thing",
      name: tech,
    })),
    genre: project.category || "Software Development",
    programmingLanguage: project.technologies,
    applicationCategory: "WebApplication",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
    </Helmet>
  );
};

export default ProjectSchema;
