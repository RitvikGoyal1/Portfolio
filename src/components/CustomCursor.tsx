import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@mui/material/styles";

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [clicked, setClicked] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [linkHovered, setLinkHovered] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseDown = () => setClicked(true);
    const handleMouseUp = () => setClicked(false);

    const handleMouseEnterLink = (e: Event) => {
      if (
        (e.target as HTMLElement).tagName === "A" ||
        (e.target as HTMLElement).closest("button") ||
        (e.target as HTMLElement).classList.contains("clickable")
      ) {
        setLinkHovered(true);
      }
    };

    const handleMouseLeaveLink = (e: Event) => {
      setLinkHovered(false);
    };

    const handleMouseLeave = () => setHidden(true);
    const handleMouseEnter = () => setHidden(false);

    document.addEventListener("mousemove", updatePosition);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    document.querySelectorAll("a, button, .clickable").forEach((el) => {
      el.addEventListener("mouseenter", handleMouseEnterLink);
      el.addEventListener("mouseleave", handleMouseLeaveLink);
    });

    return () => {
      document.removeEventListener("mousemove", updatePosition);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);

      document.querySelectorAll("a, button, .clickable").forEach((el) => {
        el.removeEventListener("mouseenter", handleMouseEnterLink);
        el.removeEventListener("mouseleave", handleMouseLeaveLink);
      });
    };
  }, []);

  const cursorColor =
    theme.palette.mode === "dark"
      ? "rgba(100, 200, 255, 0.7)"
      : "rgba(255, 111, 97, 0.7)";

  return (
    <>
      <motion.div
        className="hidden md:block"
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          zIndex: 9999,
          pointerEvents: "none",
          mixBlendMode: "difference",
        }}
        animate={{
          x: position.x - 4,
          y: position.y - 4,
          scale: clicked ? 0.8 : linkHovered ? 1.5 : 1,
          opacity: hidden ? 0 : 1,
        }}
      >
        <motion.div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: "white",
          }}
        />
      </motion.div>
      <motion.div
        className="hidden md:block"
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          zIndex: 9998,
          pointerEvents: "none",
        }}
        animate={{
          x: position.x - 16,
          y: position.y - 16,
          scale: linkHovered ? 1.5 : 1,
          opacity: hidden ? 0 : clicked ? 0.4 : 0.7,
        }}
        transition={{
          type: "spring",
          stiffness: 150,
          damping: 15,
          mass: 0.2,
        }}
      >
        <motion.div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            border: `2px solid ${cursorColor}`,
          }}
        />
      </motion.div>
    </>
  );
};

export default CustomCursor;
