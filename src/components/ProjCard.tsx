"use client";
import { CardBody, CardContainer, CardItem } from "./3d-card";
import { useState } from "react";

export function ThreeDCardDemo({
  title = "Project",
  description = "Project description",
  imgUrl = "/default-project.jpg",
  date = "2024",
  demoLink = "#",
}) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <CardContainer className="inter-var">
      <CardBody className="bg-gray-50 relative group/card hover:bg-gray-100 dark:bg-gray-800/90 dark:hover:bg-gray-700/95 dark:border-white/[0.2] border-black/[0.1] border-2 rounded-xl p-6 w-full h-auto shadow-lg hover:shadow-2xl transition-all duration-300">
        <CardItem
          translateZ="50"
          className="text-xl font-bold text-neutral-600 dark:text-white"
        >
          {title}
        </CardItem>
        <CardItem
          as="p"
          translateZ="60"
          className="text-neutral-500 text-sm mt-2 dark:text-neutral-300"
        >
          {description}
        </CardItem>
        <CardItem
          translateZ="100"
          className="w-full mt-4 transition-transform duration-300 hover:scale-105 relative"
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
            height="400"
            width="800"
            className={`h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl ${imageLoaded ? "opacity-100" : "opacity-0"}`}
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
            className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white"
          >
            {date}
          </CardItem>
          <CardItem
            translateZ={20}
            as="a"
            href={demoLink}
            target="_blank"
            className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold hover:bg-opacity-80 transition-all hover:scale-105"
          >
            View Demo →
          </CardItem>
        </div>
      </CardBody>
    </CardContainer>
  );
}
