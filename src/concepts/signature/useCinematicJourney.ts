import { useEffect, useRef, type RefObject } from "react";

export type CinematicJourney = {
  chapter: number;
  passage: number;
  occluded: boolean;
  invalidate: () => void;
};

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const smooth = (value: number) => value * value * (3 - 2 * value);

/** One reversible scroll state drives the type and the existing WebGL world. */
export default function useCinematicJourney(
  root: RefObject<HTMLDivElement>,
  reducedMotion: boolean,
) {
  const journey = useRef<CinematicJourney>({
    chapter: 0,
    passage: 0,
    occluded: false,
    invalidate: () => undefined,
  });

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    let frame = 0;
    let disposed = false;
    let height = 1;
    let openingEnd = 1;
    let workTop = 1;
    let workBottom = 1;
    let stops: Array<{ position: number; chapter: number; passage: number }> =
      [];

    const paint = () => {
      frame = 0;
      if (disposed) return;
      const y = window.scrollY;
      let chapter = 0;
      let passage = 0;
      for (let index = 1; index < stops.length; index++) {
        const start = stops[index - 1];
        const end = stops[index];
        const progress = smooth(
          clamp(
            (y - start.position) / Math.max(1, end.position - start.position),
          ),
        );
        chapter = start.chapter + (end.chapter - start.chapter) * progress;
        passage = start.passage + (end.passage - start.passage) * progress;
        if (y < end.position) break;
      }
      journey.current.chapter = chapter;
      journey.current.passage = reducedMotion ? 0 : passage;
      journey.current.occluded =
        y >= workTop && y + window.innerHeight <= workBottom;
      const opening = reducedMotion ? 0 : clamp(y / openingEnd);
      element.style.setProperty("--sig-hero-drift", `${opening * 70}px`);
      element.style.setProperty("--sig-opening-progress", String(opening));
      element.style.setProperty("--sig-progress", String(clamp(y / height)));
      element.style.setProperty(
        "--sig-work-arrival",
        String(
          reducedMotion
            ? 1
            : smooth(
                clamp((y - workTop + window.innerHeight) / window.innerHeight),
              ),
        ),
      );
      element.dataset.pastOpening = String(y > openingEnd * 0.75);
      journey.current.invalidate();
    };

    const schedule = () => {
      if (!disposed && !frame) frame = requestAnimationFrame(paint);
    };
    const measure = () => {
      const top = (node: Element) =>
        node.getBoundingClientRect().top + window.scrollY;
      const hero = element.querySelector<HTMLElement>("#sig-top");
      const manifesto = element.querySelector<HTMLElement>(
        ".sig-scroll-manifesto",
      );
      const work = element.querySelector<HTMLElement>("#sig-work");
      const story = element.querySelector<HTMLElement>("#sig-story");
      const contact = element.querySelector<HTMLElement>("#sig-contact");
      if (!hero || !manifesto || !work || !story || !contact) return;
      const viewport = window.innerHeight;
      openingEnd = top(hero) + hero.offsetHeight;
      workTop = top(work);
      workBottom = workTop + work.offsetHeight;
      height = Math.max(1, document.documentElement.scrollHeight - viewport);
      stops = [
        { position: 0, chapter: 0, passage: 0 },
        {
          position: top(manifesto) - viewport * 0.25,
          chapter: 0.35,
          passage: 0.55,
        },
        { position: top(work) - viewport * 0.7, chapter: 0.85, passage: 1 },
        { position: top(work), chapter: 1, passage: 1 },
        { position: top(story) - viewport * 0.35, chapter: 2, passage: 0 },
        { position: top(contact) - viewport * 0.35, chapter: 3, passage: 0 },
      ];
      // Short/reduced-motion layouts can collapse the intermediate beat.
      stops = stops.filter(
        (stop, index) =>
          index === 0 || stop.position > stops[index - 1].position,
      );
      schedule();
    };
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    element
      .querySelectorAll("main > section")
      .forEach((section) => observer.observe(section));
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", measure, { passive: true });
    document.fonts.ready.then(() => {
      if (!disposed) measure();
    });
    measure();

    return () => {
      disposed = true;
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", measure);
    };
  }, [root, reducedMotion]);

  return journey;
}
