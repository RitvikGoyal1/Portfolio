"use client";
import React, { useRef, useEffect, useState } from 'react';
import { useScroll, useTransform, motion } from "framer-motion";
import { useTheme } from "@mui/material/styles";

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

const Timeline = ({ data }: { data: TimelineEntry[] }) => {
  const theme = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [timelineHeight, setTimelineHeight] = useState(0);

  useEffect(() => {
    if (timelineRef.current) {
      setTimelineHeight(timelineRef.current.getBoundingClientRect().height);
    }
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, timelineHeight]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  return (
    <div
      ref={containerRef}
      className="w-full font-sans md:px-10"
      style={{
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary
      }}
    >
      <div className="max-w-7xl mx-auto py-20 px-4 md:px-8 lg:px-10">
        <h2 className="text-lg md:text-4xl mb-4 max-w-4xl">
          Ritvik's Journey
        </h2>
        <p className={`${theme.palette.mode === 'dark' ? "text-neutral-400" : "text-neutral-600"} text-sm md:text-base max-w-sm`}>
          I've come a long way!
        </p>
      </div>

      <div ref={timelineRef} className="relative max-w-7xl mx-auto pb-20">
        {data.map((item, index) => (
          <motion.div
            key={index}
            className="flex justify-start pt-10 md:pt-40 md:gap-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -100px 0px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
              <div className="h-10 absolute left-3 md:left-3 w-10 rounded-full bg-background dark:bg-backgroundDark flex items-center justify-center">
                <div className="h-4 w-4 rounded-full border-2 border-primary dark:border-secondary bg-primary/20 dark:bg-secondary/20 p-2" />
              </div>
              <h3 className="hidden md:block text-xl md:pl-20 md:text-5xl font-bold backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary">
                {item.title}
              </h3>
            </div>

            <div className="relative pl-20 pr-4 md:pl-4 w-full pb-12 md:pb-20">
              <h3 className="md:hidden block text-2xl mb-4 text-left font-bold text-primary dark:text-secondary">
                {item.title}
              </h3>
              <p className={`${theme.palette.mode === 'dark' ? "text-neutral-400" : "text-neutral-600"}`}>
                {item.content}
              </p>
            </div>
          </motion.div>
        ))}

        <div
          style={{ height: `${timelineHeight}px` }}
          className="absolute md:left-8 left-8 top-0 overflow-hidden w-[2px] bg-gradient-to-b from-transparent via-neutral-300 dark:via-neutral-600 to-transparent"
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0 w-[2px] bg-gradient-to-t from-purple-500 via-blue-500 to-transparent"
          />
        </div>
      </div>
    </div>
  );
};

export default Timeline;