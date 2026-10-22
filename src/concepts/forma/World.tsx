import { useEffect, useRef, type MutableRefObject } from "react";
import type { WorldState } from "./worldSpec";

type Props = {
  enabled: boolean;
  state: MutableRefObject<WorldState>;
  onReady: (value: boolean) => void;
  onFailure: () => void;
  onInteract: () => void;
};

export default function World({
  enabled,
  state,
  onReady,
  onFailure,
  onInteract,
}: Props) {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!enabled || !canvas.current) return;
    let live = true;
    let dispose: (() => void) | undefined;
    const element = canvas.current;
    void import("./worldEngine")
      .then(async ({ createWorld }) => {
        if (!live) return;
        dispose = await createWorld(
          element,
          state,
          () => {
            if (live) onReady(true);
          },
          () => {
            if (live) onFailure();
          },
          onInteract,
        );
        if (!live) dispose();
      })
      .catch(() => {
        if (live) onFailure();
      });
    return () => {
      live = false;
      dispose?.();
      onReady(false);
    };
  }, [enabled, state, onReady, onFailure, onInteract]);
  return (
    <div className="world-renderer" aria-hidden="true">
      {enabled && <canvas ref={canvas} />}
    </div>
  );
}
