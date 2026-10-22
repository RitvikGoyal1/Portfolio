export type Point = [number, number, number];
export type Chapter = {
  id: string;
  label: string;
  accent: string;
  center: Point;
  camera: Point;
  target: Point;
  mobileCamera: Point;
  mobileTarget: Point;
  fov: number;
};

// Endpoints share one coordinate system. The journey travels through the portal
// and alongside the project instruments, rather than swapping isolated canvases.
export const chapters: Chapter[] = [
  {
    id: "top",
    label: "Enter",
    accent: "#b9a0ff",
    center: [3, 0, 0],
    camera: [0, 1, 14],
    target: [0, 0, 0],
    mobileCamera: [3, 1.5, 23],
    mobileTarget: [3, 5, 0],
    fov: 43,
  },
  {
    id: "work",
    label: "Dealify",
    accent: "#d5ff5f",
    center: [4, 0, -26],
    camera: [0, 2, -10],
    target: [0, 0, -26],
    mobileCamera: [4, 2, -6],
    mobileTarget: [4, -3.8, -26],
    fov: 42,
  },
  {
    id: "wealthsnaps",
    label: "WealthSnaps",
    accent: "#ad91ff",
    center: [-4, 1, -52],
    camera: [1, 3, -36],
    target: [-8, 1, -52],
    mobileCamera: [-4, 3, -31],
    mobileTarget: [-4, -3, -52],
    fov: 44,
  },
  {
    id: "studyflow",
    label: "StudyFlow",
    accent: "#ff997b",
    center: [4, -1, -78],
    camera: [-1, 3, -60],
    target: [0, 0, -78],
    mobileCamera: [4, 1, -56],
    mobileTarget: [4, -5.4, -78],
    fov: 43,
  },
  {
    id: "about",
    label: "The maker",
    accent: "#b9a0ff",
    center: [3, 0, -104],
    camera: [0, 2, -89],
    target: [0, 0, -104],
    mobileCamera: [3, 1.5, -86],
    mobileTarget: [3, -3.5, -104],
    fov: 43,
  },
  {
    id: "contact",
    label: "What’s next",
    accent: "#d5ff5f",
    center: [4, 0, -132],
    camera: [0, 1, -116],
    target: [0, 0, -132],
    mobileCamera: [4, 2, -112],
    mobileTarget: [4, -4.2, -132],
    fov: 44,
  },
];

export type WorldState = {
  exact: number;
  active: number;
  remix: number;
  experiment: boolean;
  hover: boolean;
  visible: boolean;
};
export const clamp = (n: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, n));
export const smoothstep = (low: number, high: number, n: number) => {
  const x = clamp((n - low) / (high - low));
  return x * x * (3 - 2 * x);
};
