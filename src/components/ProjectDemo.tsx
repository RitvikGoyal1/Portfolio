import { useEffect, useRef, useState } from "react";
import type { ProjectDemo as DemoRecord } from "../content/projects";

export default function ProjectDemo({
  demo,
  name,
}: {
  demo: DemoRecord;
  name: string;
}) {
  const [hydrated, setHydrated] = useState(false);
  const [started, setStarted] = useState(false);
  const [failed, setFailed] = useState(false);
  const [fullOpen, setFullOpen] = useState(false);
  const preview = useRef<HTMLVideoElement>(null);
  const full = useRef<HTMLVideoElement>(null);
  useEffect(() => setHydrated(true), []);

  useEffect(() => {
    const videos = [preview.current, full.current].filter(
      (video): video is HTMLVideoElement => Boolean(video),
    );
    const pauseHidden = () => {
      if (document.hidden) videos.forEach((video) => video.pause());
    };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) (entry.target as HTMLVideoElement).pause();
      });
    });
    videos.forEach((video) => observer.observe(video));
    document.addEventListener("visibilitychange", pauseHidden);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", pauseHidden);
    };
  }, [started, fullOpen]);

  return (
    <section
      className="project-demo"
      id="demo"
      aria-labelledby="project-demo-title"
    >
      <div className="project-demo-heading">
        <p className="project-kicker">See it in use</p>
        <h2 id="project-demo-title">{demo.label}</h2>
      </div>
      <figure className="project-figure">
        <div
          className="project-player"
          style={{ aspectRatio: `${demo.width} / ${demo.height}` }}
        >
          {started && !failed ? (
            <video
              ref={preview}
              src={demo.preview}
              poster={demo.poster}
              controls
              autoPlay
              muted
              loop
              playsInline
              width={demo.width}
              height={demo.height}
              aria-label={`${name} walkthrough`}
              onPlay={() => full.current?.pause()}
              onError={() => setFailed(true)}
            >
              Your browser cannot play this video. Use the preview link below.
            </video>
          ) : (
            <>
              <img
                src={demo.poster}
                alt={`${name} walkthrough preview`}
                width={demo.width}
                height={demo.height}
                loading="lazy"
              />
              {hydrated && !failed && (
                <button
                  className="project-play"
                  onClick={() => setStarted(true)}
                  aria-label={`Play ${name} walkthrough`}
                >
                  <span aria-hidden="true">▶</span> Play walkthrough
                </button>
              )}
            </>
          )}
        </div>
        <figcaption>{demo.caption}</figcaption>
      </figure>
      {failed && (
        <p role="status">
          The preview could not load. You can still open the recording below.
        </p>
      )}
      <div className="project-demo-details">
        <ol>
          {demo.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <div className="project-media-links">
          <a href={demo.preview} target="_blank" rel="noreferrer">
            Open the short preview ↗
          </a>
          {demo.animatedImage && (
            <a href={demo.animatedImage} target="_blank" rel="noreferrer">
              Open animated WebP ↗
            </a>
          )}
        </div>
      </div>
      {demo.fullVideo && (
        <details
          className="project-full-demo"
          onToggle={(event) => {
            const open = event.currentTarget.open;
            setFullOpen(open);
            if (open) preview.current?.pause();
          }}
        >
          <summary>
            Watch the full Dealify demo <span>1 min 10 sec</span>
          </summary>
          {fullOpen && (
            <video
              ref={full}
              src={demo.fullVideo}
              controls
              playsInline
              preload="metadata"
              poster={demo.poster}
              aria-label="Full Dealify recorded demo"
              onPlay={() => preview.current?.pause()}
            />
          )}
          <p>
            A product-page negotiation, followed by the merchant Console and
            simulator.
          </p>
          <a href={demo.fullVideo} target="_blank" rel="noreferrer">
            Open the full recording ↗
          </a>
        </details>
      )}
    </section>
  );
}
