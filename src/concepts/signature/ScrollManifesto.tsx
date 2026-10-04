import { useId, useLayoutEffect, useRef } from 'react';
import { ArrowDown, ArrowDownRight } from 'lucide-react';
import './ScrollManifesto.css';

export type ScrollManifestoProps = {
  className?: string;
  /** Native destination link; the narrative never blocks access to the work. */
  workHref?: string;
};

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const smooth = (value: number) => value * value * (3 - 2 * value);

/**
 * A brief, reversible scroll chapter. Native CSS sticky owns the geometry;
 * scroll frames only paint the type and drawing inside it.
 */
export default function ScrollManifesto({ className = '', workHref = '#sig-work' }: ScrollManifestoProps) {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useLayoutEffect(() => {
    const section = root.current;
    const frameElement = stage.current;
    if (!section || !frameElement) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const shortViewport = window.matchMedia('(max-height: 560px)');
    let animationFrame = 0;
    let active = true;
    let previousProgress = -1;

    const paint = () => {
      animationFrame = 0;
      if (!active) return;
      const staticLayout = reduced.matches || shortViewport.matches;
      const bounds = section.getBoundingClientRect();
      const lead = window.innerHeight * 0.13;
      const distance = Math.max(1, bounds.height - frameElement.offsetHeight + lead);
      const progress = staticLayout ? 1 : clamp((lead - bounds.top) / distance);
      if (Math.abs(previousProgress - progress) < 0.0001) return;
      previousProgress = progress;
      const curiosity = smooth(clamp((progress + 0.045) / 0.34));
      const becomes = smooth(clamp((progress - 0.22) / 0.34));
      const possibility = smooth(clamp((progress - 0.48) / 0.37));

      section.style.setProperty('--sm-progress', progress.toFixed(4));
      section.style.setProperty('--sm-first-fill', `${(curiosity * 100).toFixed(2)}%`);
      section.style.setProperty('--sm-second-fill', `${(becomes * 100).toFixed(2)}%`);
      section.style.setProperty('--sm-third-fill', `${(possibility * 100).toFixed(2)}%`);
      section.style.setProperty('--sm-line-shift', `${((1 - becomes) * 15).toFixed(2)}px`);
      section.style.setProperty('--sm-turn', `${(-28 + progress * 28).toFixed(2)}deg`);
      section.style.setProperty('--sm-connection', `${(smooth(clamp((progress - 0.04) / 0.79)) * 100).toFixed(2)}%`);
      section.dataset.manifestoState = progress >= 0.85 ? 'complete' : 'reading';
    };
    const schedule = () => { if (active && !animationFrame) animationFrame = requestAnimationFrame(paint); };
    const resizeObserver = new ResizeObserver(schedule);
    resizeObserver.observe(section);
    resizeObserver.observe(frameElement);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    reduced.addEventListener('change', schedule);
    shortViewport.addEventListener('change', schedule);
    document.fonts?.ready.then(schedule);
    paint();

    return () => {
      active = false;
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      reduced.removeEventListener('change', schedule);
      shortViewport.removeEventListener('change', schedule);
    };
  }, []);

  return (
    <section ref={root} className={`sig-scroll-manifesto ${className}`.trim()} aria-labelledby={titleId}>
      <div ref={stage} className="sm-stage">
        <div className="sm-frame-line sm-frame-line-left" aria-hidden="true" />
        <div className="sm-frame-line sm-frame-line-right" aria-hidden="true" />

        <div className="sm-topline">
          <p className="sm-eyebrow"><span aria-hidden="true">✳</span> A THREAD THROUGH EVERYTHING</p>
          <span className="sm-aside" aria-hidden="true">AN IDEA IS ONLY THE BEGINNING.</span>
        </div>

        <div className="sm-composition">
          <h2 className="sm-title" id={titleId}>
            <span className="sm-readable">Curiosity becomes possibility.</span>
            <span className="sm-visual-phrase" aria-hidden="true">
              <span className="sm-word sm-word-first">
                <span className="sm-word-base">Curiosity</span>
                <span className="sm-word-light">Curiosity</span>
              </span>
              <span className="sm-middle-line">
                <span className="sm-direction" aria-hidden="true"><ArrowDownRight strokeWidth={0.8} /></span>
                <span className="sm-word sm-word-second">
                  <span className="sm-word-base">becomes</span>
                  <span className="sm-word-light">becomes</span>
                </span>
              </span>
              <span className="sm-word sm-word-third">
                <span className="sm-word-base">possibility.</span>
                <span className="sm-word-light">possibility.</span>
              </span>
            </span>
          </h2>

          <div className="sm-margin-note" aria-hidden="true">
            <span className="sm-note-point" />
            <span>FOLLOW THE QUESTION.<br />MAKE SOMETHING OF IT.</span>
          </div>
        </div>

        <div className="sm-bottomline">
          <div className="sm-journey">
            <span className="sm-journey-label">THE THREAD SO FAR</span>
            <p><span>Toronto</span><span className="sm-route-arrow">→</span><span>Shopify <i>×</i> York</span><span className="sm-route-arrow">→</span><span className="sm-journey-next">whatever comes next</span></p>
          </div>
          <a className="sm-work-link" href={workHref}>
            <span>Here’s what that looks like.</span>
            <span className="sm-work-arrow"><ArrowDown size={18} strokeWidth={1.4} /></span>
          </a>
        </div>

        <div className="sm-connection-track" aria-hidden="true"><span /><i /></div>
      </div>
    </section>
  );
}
