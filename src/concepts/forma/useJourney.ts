import {
  useEffect,
  useRef,
  type RefObject,
  type MutableRefObject,
} from "react";
import { chapters, clamp, smoothstep, type WorldState } from "./worldSpec";

export function useJourney(
  root: RefObject<HTMLDivElement>,
  state: MutableRefObject<WorldState>,
  immersive: boolean,
  onChapter: (index: number) => void,
) {
  // Keep a logical reading position when the viewport or presentation changes.
  // Pixel scroll offsets refer to different chapters after rotation or reflow.
  const position = useRef({ index: 0, fraction: 0 });
  const measured = useRef(false);
  const previousMode = useRef(immersive);
  useEffect(() => {
    const host = root.current;
    if (!host) return;
    const sections = Array.from(
      host.querySelectorAll<HTMLElement>("[data-world-chapter]"),
    );
    const panels = sections.map(
      (section) => section.querySelector<HTMLElement>(".world-panel")!,
    );
    const meter = host.querySelector<HTMLElement>(".world-progress-fill");
    const chapterNavigation =
      host.querySelector<HTMLElement>(".world-chapter-nav");
    const flight = host.querySelector<HTMLElement>(".world-flight-type");
    const phrases = [
      "FOLLOW YOUR CURIOSITY",
      "FIND THE SIGNAL",
      "GET INTO FLOW",
      "MEET THE MAKER",
      "WHAT COMES NEXT?",
    ];
    let flightChapter = -1;
    let anchors: number[] = [];
    let last = -1;
    let raf = 0;
    let live = true;
    let viewportHeight = window.innerHeight;
    let viewportWidth = window.innerWidth;
    let pageHeight = document.documentElement.scrollHeight;
    const update = () => {
      raf = 0;
      if (!anchors.length) return;
      const y = window.scrollY;
      let index = 0;
      while (index < anchors.length - 1 && y >= anchors[index + 1]) index++;
      const fraction =
        index < anchors.length - 1
          ? clamp((y - anchors[index]) / (anchors[index + 1] - anchors[index]))
          : 0;
      const p = index + fraction;
      const finalTravel = Math.max(
        1,
        document.documentElement.scrollHeight -
          window.innerHeight -
          anchors[anchors.length - 1],
      );
      position.current = {
        index,
        fraction:
          index < anchors.length - 1
            ? fraction
            : clamp((y - anchors[index]) / finalTravel),
      };
      const active = Math.round(p);
      host.style.setProperty("--hero-flight", String(smoothstep(0.02, 0.6, p)));
      if (flight && immersive) {
        if (flightChapter !== index) {
          flight.textContent = phrases[index] || "";
          flightChapter = index;
        }
        flight.style.opacity = String(
          smoothstep(0.25, 0.42, fraction) *
            (1 - smoothstep(0.63, 0.8, fraction)) *
            0.24,
        );
        flight.style.transform = `translate3d(${(0.5 - fraction) * 70}vw, -50%, 0) rotate(-7deg)`;
      }
      state.current.exact = p;
      state.current.active = active;
      state.current.visible =
        y < anchors[anchors.length - 1] + window.innerHeight * 1.2;
      host.dataset.chapter = chapters[active].id;
      const tail = clamp(
        (y - anchors[anchors.length - 1]) / window.innerHeight,
      );
      host.dataset.end = String(tail > 0.85);
      if (chapterNavigation) chapterNavigation.inert = tail > 0.85;
      host.style.setProperty("--chapter-accent", chapters[active].accent);
      if (meter) meter.style.transform = `scaleX(${p / (chapters.length - 1)})`;
      if (active !== last) {
        state.current.experiment = false;
        state.current.hover = false;
        onChapter(active);
        last = active;
      }
      panels.forEach((panel, i) => {
        if (!immersive) {
          panel.inert = false;
          panel.style.removeProperty("opacity");
          panel.style.removeProperty("visibility");
          panel.style.removeProperty("--copy-shift");
          return;
        }
        const distance = p - i;
        const opacity =
          (1 - smoothstep(0.22, 0.49, Math.abs(distance))) *
          (i === chapters.length - 1 ? 1 - smoothstep(0.35, 0.95, tail) : 1);
        panel.inert = i !== active || opacity < 0.15;
        panel.style.visibility = i === active ? "visible" : "hidden";
        panel.style.opacity = String(opacity);
        panel.style.setProperty("--copy-shift", `${-distance * 100}px`);
      });
    };
    const measure = (preserve = true, forceRestore = false) => {
      const nextAnchors = sections.map(
        (section) => section.getBoundingClientRect().top + window.scrollY,
      );
      const nextPageHeight = document.documentElement.scrollHeight;
      const changed =
        anchors.length > 0 &&
        (nextAnchors.some(
          (value, index) => Math.abs(value - anchors[index]) > 1,
        ) ||
          viewportHeight !== window.innerHeight ||
          pageHeight !== nextPageHeight);
      anchors = nextAnchors;
      viewportHeight = window.innerHeight;
      viewportWidth = window.innerWidth;
      pageHeight = nextPageHeight;
      if (preserve && (changed || forceRestore)) {
        const { index, fraction } = position.current;
        const start = anchors[index];
        const end =
          anchors[index + 1] ??
          Math.max(start, nextPageHeight - window.innerHeight);
        window.scrollTo({
          top: start + (end - start) * fraction,
          behavior: "instant",
        });
      }
      update();
    };
    const restoreLocation = () => measure(false);
    const resizeViewport = () => measure();
    const scroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    // Expanding normal-flow notes should keep the browser's reading position.
    // Restore the logical coordinate only when the viewport itself changes.
    const resize = new ResizeObserver(() =>
      measure(
        window.innerHeight !== viewportHeight ||
          window.innerWidth !== viewportWidth,
      ),
    );
    resize.observe(host);
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("resize", resizeViewport);
    window.addEventListener("hashchange", restoreLocation);
    window.addEventListener("pageshow", restoreLocation);
    if (!measured.current) {
      const target = document.getElementById(location.hash.slice(1));
      target?.scrollIntoView({ behavior: "instant" });
    }
    measure(true, measured.current && previousMode.current !== immersive);
    measured.current = true;
    previousMode.current = immersive;
    void document.fonts.ready.then(() => {
      if (live) measure();
    });
    return () => {
      live = false;
      cancelAnimationFrame(raf);
      resize.disconnect();
      window.removeEventListener("scroll", scroll);
      window.removeEventListener("resize", resizeViewport);
      window.removeEventListener("hashchange", restoreLocation);
      window.removeEventListener("pageshow", restoreLocation);
      if (chapterNavigation) chapterNavigation.inert = false;
      panels.forEach((panel) => {
        panel.inert = false;
      });
    };
  }, [root, state, immersive, onChapter]);
}
