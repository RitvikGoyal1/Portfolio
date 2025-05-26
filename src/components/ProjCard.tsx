"use client";
import { CardBody, CardContainer, CardItem } from "./3d-card";
import { useState } from "react";

// Tech icon mapping for better visual representation
const techIcons: Record<string, string> = {
  React: "https://skillicons.dev/icons?i=react",
  "React Native": "https://skillicons.dev/icons?i=react",
  "Next.js": "https://skillicons.dev/icons?i=nextjs",
  TypeScript: "https://skillicons.dev/icons?i=ts",
  JavaScript: "https://skillicons.dev/icons?i=js",
  HTML: "https://skillicons.dev/icons?i=html",
  CSS: "https://skillicons.dev/icons?i=css",
  "Node.js": "https://skillicons.dev/icons?i=nodejs",
  Firebase: "https://skillicons.dev/icons?i=firebase",
  Database: "https://skillicons.dev/icons?i=mongodb",
  MongoDB: "https://skillicons.dev/icons?i=mongodb",
  Python: "https://skillicons.dev/icons?i=python",
  "AI/ML": "https://skillicons.dev/icons?i=python",
  TensorFlow: "https://skillicons.dev/icons?i=tensorflow",
  "Stock APIs": "📈",
  Vite: "https://skillicons.dev/icons?i=vite",
  Supabase: "https://skillicons.dev/icons?i=supabase",
  "Tailwind CSS": "https://skillicons.dev/icons?i=tailwind",
  "Framer Motion": "🎬",
  Expo: "📱",
  "Google Maps": "🗺️",
  "React Navigation": "🧭",
  "Maps API": "🗺️",
  "OpenAI API": "🤖",
  Astro: "https://skillicons.dev/icons?i=astro",
  MDX: "📝",
  "Keystatic CMS": "📝",
  CMS: "📝",
  Vercel: "https://skillicons.dev/icons?i=vercel",
  "Leaflet Maps": "🗺️",
  Airtable: "🗃️",
  Stripe: "💳",
  Auth: "🔐",
  Dashboard: "📊",
  Responsive: "📱",
  Bootstrap: "https://skillicons.dev/icons?i=bootstrap",
  Registration: "📋",
  Forms: "📝",
  "Charts.js": "📊",
  "Local Storage": "💾",
  Finance: "💰",
  "Social Impact": "🌍",
  "Vanilla JS": "https://skillicons.dev/icons?i=js",
  SEO: "🔍",
  "Event Management": "📅",
};

export function ThreeDCardDemo({
  title = "Project",
  description = "Project description",
  imgUrl = "/default-project.jpg",
  date = "2024",
  demoLink = "#",
  tech = [],
}: {
  title?: string;
  description?: string;
  imgUrl?: string;
  date?: string;
  demoLink?: string;
  tech?: string[];
}) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <CardContainer className="inter-var">
      <CardBody className="bg-gray-50 relative group/card hover:bg-gray-100 dark:bg-gray-800/90 dark:hover:bg-gray-700/95 dark:border-white/[0.2] border-black/[0.1] border-2 rounded-xl p-6 w-full h-full flex flex-col shadow-lg hover:shadow-2xl transition-all duration-300">
        <CardItem
          translateZ="50"
          className="text-xl font-bold text-neutral-600 dark:text-white"
        >
          {title}
        </CardItem>
        <CardItem
          as="p"
          translateZ="60"
          className="text-neutral-500 text-sm mt-2 dark:text-neutral-300 leading-relaxed"
        >
          {description}
        </CardItem>

        {/* Tech Skills Section */}
        {tech && tech.length > 0 && (
          <CardItem translateZ="30" className="flex flex-wrap gap-2 mt-3 mb-2">
            {" "}
            {tech.map((technology, index) => {
              const icon = techIcons[technology];
              const isEmoji =
                icon && icon.length <= 2 && !icon.startsWith("http");

              return (
                <div
                  key={index}
                  className="group relative inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full border border-blue-200/50 dark:border-blue-700/50 transition-all duration-300 hover:scale-105 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600"
                >
                  {icon && !isEmoji ? (
                    <img
                      src={icon}
                      alt={technology}
                      className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12"
                    />
                  ) : isEmoji ? (
                    <span className="text-sm transition-transform duration-300 group-hover:scale-110">
                      {icon}
                    </span>
                  ) : (
                    <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"></div>
                  )}
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    {technology}
                  </span>

                  {/* Subtle glow effect on hover */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm -z-10"></div>
                </div>
              );
            })}
          </CardItem>
        )}

        <CardItem
          translateZ="100"
          className="w-full mt-4 transition-transform duration-300 hover:scale-105 relative flex-grow rounded-xl overflow-hidden"
        >
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-xl">
              <svg
                className="animate-spin h-8 w-8 text-primary"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
          )}
          <img
            src={imgUrl}
            className={`h-60 w-full object-cover group-hover/card:shadow-xl transition-all duration-500 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
            alt={title}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              e.currentTarget.src = "/fallback-image.jpg";
              setImageLoaded(true);
            }}
          />
        </CardItem>
        <div className="flex justify-between items-center mt-6 sm:mt-8">
          <CardItem
            translateZ={20}
            className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-600"
          >
            {date}
          </CardItem>
          <CardItem
            translateZ={20}
            as="a"
            href={demoLink}
            target="_blank"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-black to-gray-800 dark:from-white dark:to-gray-200 dark:text-black text-white text-xs font-bold hover:opacity-90 transition-all hover:scale-105 shadow-lg hover:shadow-xl"
          >
            View Demo →
          </CardItem>
        </div>
      </CardBody>
    </CardContainer>
  );
}
