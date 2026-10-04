import {
  type CSSProperties,
  type ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";
import "./kinetic.css";

type TextProps = { text: string; className?: string };
type MotionStyle = CSSProperties & {
  "--sig-letter"?: number;
  "--sig-word"?: number;
};
type SpringPoint = {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  vr: number;
  tx: number;
  ty: number;
  tr: number;
};

const newPoint = (): SpringPoint => ({
  x: 0,
  y: 0,
  r: 0,
  vx: 0,
  vy: 0,
  vr: 0,
  tx: 0,
  ty: 0,
  tr: 0,
});
const joinClass = (base: string, extra?: string) =>
  extra ? `${base} ${extra}` : base;

function stepSpring(
  point: SpringPoint,
  delta: number,
  stiffness = 0.095,
  damping = 0.77,
) {
  const friction = Math.pow(damping, delta);
  point.vx = (point.vx + (point.tx - point.x) * stiffness * delta) * friction;
  point.vy = (point.vy + (point.ty - point.y) * stiffness * delta) * friction;
  point.vr = (point.vr + (point.tr - point.r) * stiffness * delta) * friction;
  point.x += point.vx * delta;
  point.y += point.vy * delta;
  point.r += point.vr * delta;
  return (
    Math.abs(point.tx - point.x) +
      Math.abs(point.ty - point.y) +
      Math.abs(point.tr - point.r) +
      Math.abs(point.vx) +
      Math.abs(point.vy) +
      Math.abs(point.vr) >
    0.025
  );
}

function paintSpring(element: HTMLElement, point: SpringPoint) {
  element.style.setProperty("--sig-move-x", `${point.x.toFixed(3)}px`);
  element.style.setProperty("--sig-move-y", `${point.y.toFixed(3)}px`);
  element.style.setProperty("--sig-move-r", `${point.r.toFixed(3)}deg`);
}

/** Large inherited typography, with a soft spring field following the pointer. */
export function KineticName({ text, className }: TextProps) {
  const root = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const element = root.current;
    if (!element) return;
    const letters = Array.from(
      element.querySelectorAll<HTMLElement>(".sig-kinetic-letter"),
    );
    const points = letters.map(newPoint);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const precise = window.matchMedia("(hover: hover) and (pointer: fine)");
    let frame = 0;
    let previousTime = 0;
    let revealed = false;

    const tick = (time: number) => {
      const delta = previousTime
        ? Math.min((time - previousTime) / 16.667, 2)
        : 1;
      previousTime = time;
      let moving = false;
      points.forEach((point, index) => {
        moving = stepSpring(point, delta) || moving;
        paintSpring(letters[index], point);
      });
      if (moving) frame = requestAnimationFrame(tick);
      else {
        frame = 0;
        previousTime = 0;
      }
    };
    const start = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const restore = () => {
      points.forEach((point) => {
        point.tx = 0;
        point.ty = 0;
        point.tr = 0;
      });
      start();
    };
    const move = (event: PointerEvent) => {
      if (reduce.matches || !precise.matches || event.pointerType === "touch")
        return;
      const bounds = element.getBoundingClientRect();
      const radius = Math.max(100, Math.min(bounds.height * 1.65, 280));
      const pointerX = event.clientX - bounds.left;
      const pointerY = event.clientY - bounds.top;
      letters.forEach((letter, index) => {
        // offsetLeft/Top stay unchanged by the presentation transforms, so the field never drifts.
        const cell = letter.parentElement as HTMLElement;
        const dx = pointerX - (cell.offsetLeft + cell.offsetWidth / 2);
        const dy = pointerY - (cell.offsetTop + cell.offsetHeight / 2);
        const proximity = Math.max(0, 1 - Math.hypot(dx, dy * 0.65) / radius);
        const strength = proximity * proximity;
        points[index].tx = Math.max(-11, Math.min(11, dx * 0.09)) * strength;
        points[index].ty =
          (Math.max(-12, Math.min(12, dy * 0.13)) - 5) * strength;
        points[index].tr = Math.max(-3.5, Math.min(3.5, dx * 0.035)) * strength;
      });
      start();
    };
    const reveal = () => {
      revealed = true;
      element.dataset.kineticState = "visible";
    };
    const preferenceChanged = () => {
      if (reduce.matches || !precise.matches) {
        cancelAnimationFrame(frame);
        frame = 0;
        previousTime = 0;
        points.forEach((point, index) => {
          Object.assign(point, newPoint());
          paintSpring(letters[index], point);
        });
      }
      if (reduce.matches) reveal();
    };
    let observer: IntersectionObserver | undefined;
    if (!reduce.matches && "IntersectionObserver" in window) {
      element.dataset.kineticState = "waiting";
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            reveal();
            observer?.disconnect();
          }
        },
        { threshold: 0.12 },
      );
      observer.observe(element);
    } else reveal();
    element.addEventListener("pointermove", move);
    element.addEventListener("pointerleave", restore);
    element.addEventListener("pointercancel", restore);
    reduce.addEventListener("change", preferenceChanged);
    precise.addEventListener("change", preferenceChanged);
    const visibility = () => {
      if (document.hidden) restore();
    };
    document.addEventListener("visibilitychange", visibility);

    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      element.removeEventListener("pointermove", move);
      element.removeEventListener("pointerleave", restore);
      element.removeEventListener("pointercancel", restore);
      reduce.removeEventListener("change", preferenceChanged);
      precise.removeEventListener("change", preferenceChanged);
      document.removeEventListener("visibilitychange", visibility);
      if (!revealed) element.dataset.kineticState = "visible";
    };
  }, [text]);

  return (
    <span
      ref={root}
      className={joinClass("sig-kinetic-name", className)}
      aria-label={text}
    >
      <span className="sig-motion-accessible">{text}</span>
      <span className="sig-kinetic-visual" aria-hidden="true">
        {Array.from(text).map((character, index) => (
          <span
            className="sig-kinetic-cell"
            key={`${index}-${character}`}
            style={{ "--sig-letter": index } as MotionStyle}
          >
            <span className="sig-kinetic-letter">
              {character === " " ? "\u00a0" : character}
            </span>
          </span>
        ))}
      </span>
    </span>
  );
}

/** A short decode sweep. The original text owns the layout and accessible name throughout. */
export function ScrambleText({ text, className }: TextProps) {
  const root = useRef<HTMLSpanElement>(null);
  const output = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = root.current;
    const visible = output.current;
    if (!element || !visible) return;
    visible.textContent = text;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const precise = window.matchMedia("(hover: hover) and (pointer: fine)");
    const interactiveParent = element.closest("a, button, [tabindex]");
    const characters = Array.from(text);
    const symbols = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let frame = 0;
    let started = 0;
    let previousStep = -1;
    let lastRun = -1000;

    const finish = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      visible.textContent = text;
      element.removeAttribute("data-scrambling");
    };
    const tick = (time: number) => {
      const elapsed = time - started;
      if (elapsed >= 560 || reduce.matches) {
        finish();
        return;
      }
      const step = Math.floor(elapsed / 38);
      if (step !== previousStep) {
        previousStep = step;
        const frontier = (elapsed / 510) * characters.length;
        visible.textContent = characters
          .map((character, index) => {
            if (
              !/[a-z0-9]/i.test(character) ||
              index < frontier - 1 ||
              index > frontier + 1
            )
              return character;
            const symbol = symbols[(index * 13 + step * 7) % symbols.length];
            return character === character.toLowerCase()
              ? symbol.toLowerCase()
              : symbol;
          })
          .join("");
      }
      frame = requestAnimationFrame(tick);
    };
    const begin = () => {
      const now = performance.now();
      if (reduce.matches || frame || now - lastRun < 700 || !text) return;
      started = now;
      lastRun = now;
      previousStep = -1;
      element.dataset.scrambling = "true";
      frame = requestAnimationFrame(tick);
    };
    const hover = (event: PointerEvent) => {
      if (precise.matches && event.pointerType !== "touch") begin();
    };
    const onPreference = () => {
      if (reduce.matches) finish();
    };
    element.addEventListener("pointerenter", hover);
    interactiveParent?.addEventListener("focusin", begin);
    interactiveParent?.addEventListener("focusout", finish);
    reduce.addEventListener("change", onPreference);
    return () => {
      finish();
      element.removeEventListener("pointerenter", hover);
      interactiveParent?.removeEventListener("focusin", begin);
      interactiveParent?.removeEventListener("focusout", finish);
      reduce.removeEventListener("change", onPreference);
    };
  }, [text]);

  return (
    <span ref={root} className={joinClass("sig-scramble", className)}>
      <span className="sig-scramble-measure">{text}</span>
      <span ref={output} className="sig-scramble-output" aria-hidden="true">
        {text}
      </span>
    </span>
  );
}

/** Keeps the child’s native semantics: use outside or inside a link/button, never adds a control. */
export function Magnetic({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const root = useRef<HTMLSpanElement>(null);
  const surface = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = root.current;
    const content = surface.current;
    if (!element || !content) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const precise = window.matchMedia("(hover: hover) and (pointer: fine)");
    const point = newPoint();
    let frame = 0;
    let previousTime = 0;
    const tick = (time: number) => {
      const delta = previousTime
        ? Math.min((time - previousTime) / 16.667, 2)
        : 1;
      previousTime = time;
      const moving = stepSpring(point, delta, 0.085, 0.78);
      paintSpring(content, point);
      if (moving) frame = requestAnimationFrame(tick);
      else {
        frame = 0;
        previousTime = 0;
      }
    };
    const start = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const restore = () => {
      point.tx = 0;
      point.ty = 0;
      start();
    };
    const move = (event: PointerEvent) => {
      if (reduce.matches || !precise.matches || event.pointerType === "touch")
        return;
      const bounds = element.getBoundingClientRect();
      point.tx = Math.max(
        -9,
        Math.min(9, (event.clientX - bounds.left - bounds.width / 2) * 0.16),
      );
      point.ty = Math.max(
        -7,
        Math.min(7, (event.clientY - bounds.top - bounds.height / 2) * 0.2),
      );
      start();
    };
    const preferenceChanged = () => {
      if (!reduce.matches && precise.matches) return;
      cancelAnimationFrame(frame);
      frame = 0;
      previousTime = 0;
      Object.assign(point, newPoint());
      paintSpring(content, point);
    };
    element.addEventListener("pointermove", move);
    element.addEventListener("pointerleave", restore);
    element.addEventListener("pointercancel", restore);
    element.addEventListener("focusin", restore);
    reduce.addEventListener("change", preferenceChanged);
    precise.addEventListener("change", preferenceChanged);
    return () => {
      cancelAnimationFrame(frame);
      element.removeEventListener("pointermove", move);
      element.removeEventListener("pointerleave", restore);
      element.removeEventListener("pointercancel", restore);
      element.removeEventListener("focusin", restore);
      reduce.removeEventListener("change", preferenceChanged);
      precise.removeEventListener("change", preferenceChanged);
    };
  }, []);

  return (
    <span ref={root} className={joinClass("sig-magnetic", className)}>
      <span ref={surface} className="sig-magnetic-surface">
        {children}
      </span>
    </span>
  );
}

/** A one-time word reveal, with the complete sentence continuously available to assistive tech. */
export function RevealText({ text, className }: TextProps) {
  const root = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const element = root.current;
    if (!element) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let observer: IntersectionObserver | undefined;
    const reveal = () => {
      element.dataset.revealState = "visible";
      observer?.disconnect();
    };
    if (reduce.matches || !("IntersectionObserver" in window)) reveal();
    else {
      element.dataset.revealState = "waiting";
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) reveal();
        },
        { threshold: 0.12, rootMargin: "0px 0px -24px 0px" },
      );
      observer.observe(element);
    }
    const preferenceChanged = () => {
      if (reduce.matches) reveal();
    };
    reduce.addEventListener("change", preferenceChanged);
    return () => {
      observer?.disconnect();
      reduce.removeEventListener("change", preferenceChanged);
      element.dataset.revealState = "visible";
    };
  }, [text]);

  let wordIndex = 0;
  return (
    <span
      ref={root}
      className={joinClass("sig-reveal-text", className)}
      aria-label={text}
    >
      <span className="sig-motion-accessible">{text}</span>
      <span aria-hidden="true">
        {text.split(/(\s+)/).map((part, index) =>
          /\s/.test(part) ? (
            part
          ) : (
            <span
              key={index}
              className="sig-reveal-word"
              style={{ "--sig-word": Math.min(wordIndex++, 16) } as MotionStyle}
            >
              {part}
            </span>
          ),
        )}
      </span>
    </span>
  );
}
