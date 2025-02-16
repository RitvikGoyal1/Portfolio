"use client";
import { CardBody, CardContainer, CardItem } from "./3d-card";

export function ThreeDCardDemo({
  title = "Project",
  description = "Project description",
  imgUrl = "/default-project.jpg",
  date = "2024",
  demoLink = "#"
}) {
  return (
    <CardContainer className="inter-var">
      <CardBody className="bg-gray-50 relative group/card hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-white/[0.2] border-black/[0.1] border rounded-xl p-6 w-full sm:w-[30rem] h-auto shadow-md hover:shadow-xl transition-all duration-300">
        <CardItem
          translateZ="50"
          className="text-xl font-bold text-neutral-600 dark:text-white"
        >
          {title}
        </CardItem>
        <CardItem
          as="p"
          translateZ="60"
          className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
        >
          {description}
        </CardItem>
        <CardItem
          translateZ="100"
          className="w-full mt-4 transition-transform duration-300 hover:scale-105">
          <img
            src={imgUrl}
            height="400"
            width="800"
            className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
            alt={title}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = '/fallback-image.jpg';
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
            className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold hover:bg-opacity-80 transition-all"
          >
            View Demo →
          </CardItem>
        </div>
      </CardBody>
    </CardContainer>
  );
}