import React, { useEffect, useRef } from "react";
import { useTheme } from "@mui/material/styles";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
}

const InteractiveBackground: React.FC = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const maxParticles = window.innerWidth < 768 ? 40 : 80;
  const linkDistance = 120;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

    let particles: Particle[] = [];
    const mouse = { x: -9999, y: -9999 };
    let throttleTimeout: NodeJS.Timeout | null = null;

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < maxParticles; i++) {
        const radius = Math.random() * 3 + 1.5;
        const baseColor = isDarkMode
          ? [100, 200, 255]
          : [255, 111, 97];

        const colorVariation = 30;
        const r =
          baseColor[0] + (Math.random() * colorVariation - colorVariation / 2);
        const g =
          baseColor[1] + (Math.random() * colorVariation - colorVariation / 2);
        const b =
          baseColor[2] + (Math.random() * colorVariation - colorVariation / 2);

        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5,
          radius,
          color: `rgba(${r}, ${g}, ${b}, ${0.7 + Math.random() * 0.3})`,
        });
      }
    };

    initParticles();

    const mouseMoveHandler = (e: MouseEvent) => {
      if (!throttleTimeout) {
        throttleTimeout = setTimeout(() => {
          mouse.x = e.clientX;
          mouse.y = e.clientY;
          throttleTimeout = null;
        }, 16);
      }
    };
    const mouseLeaveHandler = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };
    window.addEventListener("mousemove", mouseMoveHandler);
    window.addEventListener("mouseleave", mouseLeaveHandler);

    let animationFrameId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          p.vx += (dx / dist) * 0.05;
          p.vy += (dy / dist) * 0.05;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < linkDistance) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = isDarkMode
              ? `rgba(100, 200, 255, ${1 - dist / linkDistance})`
              : `rgba(255, 111, 97, ${1 - dist / linkDistance})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", mouseMoveHandler);
      window.removeEventListener("mouseleave", mouseLeaveHandler);
      window.removeEventListener("resize", setCanvasSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDarkMode]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
        pointerEvents: "none",
        background: isDarkMode ? "#000014" : "#fff5f2",
      }}
    />
  );
};

export default InteractiveBackground;
