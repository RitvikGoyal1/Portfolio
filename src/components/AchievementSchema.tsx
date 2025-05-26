import React from "react";
import { Helmet } from "react-helmet-async";

interface AchievementSchemaProps {
  achievements: Array<{
    title: string;
    description: string;
    date: string;
    organization?: string;
    url?: string;
    type: "Award" | "Certificate" | "Recognition" | "Publication" | "Project";
  }>;
  person?: {
    name: string;
    url: string;
    jobTitle: string;
    location: string;
  };
}

const AchievementSchema: React.FC<AchievementSchemaProps> = ({
  achievements,
  person = {
    name: "Ritvik Goyal",
    url: "https://ritvikgoyal.com",
    jobTitle: "Software Developer",
    location: "Toronto, Ontario, Canada",
  },
}) => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: person.name,
    url: person.url,
    jobTitle: person.jobTitle,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Toronto",
      addressRegion: "Ontario",
      addressCountry: "Canada",
    },
    knowsAbout: [
      "Software Development",
      "Web Development",
      "Mobile Development",
      "React",
      "TypeScript",
      "JavaScript",
      "Python",
      "Node.js",
      "Database Design",
      "API Development",
      "UI/UX Design",
    ],
    hasCredential: achievements
      .filter((a) => a.type === "Certificate" || a.type === "Award")
      .map((achievement) => ({
        "@type": "EducationalOccupationalCredential",
        name: achievement.title,
        description: achievement.description,
        dateEarned: achievement.date,
        credentialCategory: achievement.type,
        recognizedBy: {
          "@type": "Organization",
          name: achievement.organization || "Professional Organization",
        },
        url: achievement.url,
      })),
    award: achievements
      .filter((a) => a.type === "Award" || a.type === "Recognition")
      .map((achievement) => ({
        "@type": "Thing",
        name: achievement.title,
        description: achievement.description,
        dateCreated: achievement.date,
        url: achievement.url,
      })),
    workExample: achievements
      .filter((a) => a.type === "Project")
      .map((achievement) => ({
        "@type": "CreativeWork",
        name: achievement.title,
        description: achievement.description,
        dateCreated: achievement.date,
        url: achievement.url,
        author: {
          "@type": "Person",
          name: person.name,
        },
      })),
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
    </Helmet>
  );
};

export default AchievementSchema;
