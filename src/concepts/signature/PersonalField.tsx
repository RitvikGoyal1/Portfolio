import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import "./PersonalField.css";

export type PersonalFieldProps = {
  chapter: number;
  playground: boolean;
  paused: boolean;
  reducedMotion: boolean;
};

const vertexShader = /* glsl */ `
  attribute vec2 aUV;
  attribute vec3 aGlyph;
  attribute float aSeed;
  uniform float uTime;
  uniform vec4 uChapters;
  uniform float uPlayground;
  uniform float uPixelRatio;
  uniform float uIsLine;
  uniform float uIsSurface;
  uniform float uAspect;
  uniform float uGlyphScale;
  uniform float uGlyphOffsetY;
  uniform float uPointerStrength;
  uniform vec2 uPointer;
  uniform vec2 uPointerVelocity;
  varying float vAlpha;
  varying float vLight;
  varying float vMint;
  varying float vSeed;
  varying vec2 vUV;
  varying vec3 vViewPosition;
  varying float vInfluence;
  varying float vWeave;

  const float PI = 3.14159265359;

  mat2 turn(float angle) {
    float s = sin(angle), c = cos(angle);
    return mat2(c, -s, s, c);
  }

  float noise(float v) { return fract(sin(v * 127.1) * 43758.5453); }

  void main() {
    // Use the same angular parameter at both ends of closed chapters.
    float u = fract(aUV.x) * PI * 2.0;
    float v = aUV.y * 2.0 - 1.0;
    float breath = sin(u * 3.0 + v * 4.0 + uTime * 0.42);

    // An infinity-shaped sheet: the contours wrap over and under themselves.
    vec2 tangent = normalize(vec2(3.6 * cos(u), 2.6 * cos(2.0 * u)));
    vec2 normal = vec2(-tangent.y, tangent.x);
    float twist = u + 0.65 * sin(u * 2.0 + uTime * 0.23) + 0.22 * sin(uTime * 0.17);
    float width = 0.79 + 0.13 * sin(u * 3.0 - uTime * 0.14);
    vec3 ribbonNormal = vec3(normal * cos(twist), sin(twist));
    vec3 silk = vec3(3.6 * sin(u), 1.3 * sin(2.0 * u), cos(u) * 1.04);
    silk += ribbonNormal * v * width;
    silk.z += sin(v * 11.0 + u * 4.0 - uTime * 0.55) * 0.035;
    silk.z += breath * 0.16 * (1.0 - v * v);
    silk.y += sin(u * 2.0 - uTime * 0.23) * 0.12;
    silk.xy = turn(0.38) * silk.xy;
    silk.x += 1.35;
    silk.y += 0.5;

    // A broad, open orbital instrument, reserved for the work chapter.
    float radius = 2.4 + v * 0.64 * cos(u + uTime * 0.10);
    vec3 orbit = vec3(cos(u) * radius, sin(u) * radius * 0.76, sin(u * 2.0) * 0.65 + v * sin(u + uTime * 0.10) * 0.8);
    orbit.xy = turn(-0.44) * orbit.xy;
    orbit.x += 2.0;
    orbit.y += 0.15;

    // Every point gains its own place in a quiet constellation.
    float starX = noise(aSeed * 11.0 + aUV.x * 17.0);
    float starY = noise(aSeed * 21.0 + aUV.y * 23.0);
    vec3 stars = vec3((starX - 0.5) * 13.0, (starY - 0.5) * 7.0, (noise(aSeed * 29.0) - 0.5) * 3.0);
    stars.x += sin(uTime * 0.035 + aSeed * 5.0) * 0.08;
    stars = mix(stars, silk * 0.76, uIsSurface);

    // The last chapter opens into an inviting, oversized arc.
    float arcAngle = aUV.x * PI * 1.65 - 0.1;
    float arcRadius = 3.6 + v * 0.51;
    vec3 arc = vec3(cos(arcAngle) * arcRadius + 2.1, sin(arcAngle) * arcRadius - 1.2, sin(arcAngle * 2.0) * 0.5 + v * 0.5);
    arc.z += breath * 0.09;

    vec3 p = silk * uChapters.x + orbit * uChapters.y + stars * uChapters.z + arc * uChapters.w;
    // An aspect-aware composition keeps the sculpture present on a phone.
    float narrow = 1.0 - smoothstep(0.65, 1.3, uAspect);
    p.x = mix(p.x, (p.x - 0.7) * 0.61, narrow);
    p.y += narrow * 0.72 * uChapters.x;

    // The signature has its own camera-fitted composition, independent of
    // the hero's deliberately offset ribbon. Its samples are centered below.
    vec3 glyph = aGlyph * uGlyphScale;
    glyph.y += uGlyphOffsetY;
    glyph.z += sin(glyph.x * 2.0 + uTime * 0.5) * 0.08;
    p = mix(p, mix(glyph, silk * 0.75, uIsSurface), uPlayground);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vec4 projected = projectionMatrix * mv;
    vec2 screen = projected.xy / projected.w;
    vec2 difference = (screen - uPointer) * vec2(uAspect, 1.0);
    float distance = length(difference);
    float influence = exp(-distance * distance * 5.0) * uPointerStrength;
    float ripple = sin(distance * 18.0 - uTime * 2.2) * exp(-distance * 2.1) * uPointerStrength;
    p.xy += normalize(difference + vec2(0.001)) * influence * 0.22;
    p.xy += uPointerVelocity * influence * 0.28;
    p.z += ripple * 0.12 + influence * 0.38;

    // Tiny parallax makes the object respond as a volume, without a camera jump.
    p.x += uPointer.x * uPointerStrength * 0.065;
    p.y += uPointer.y * uPointerStrength * 0.035;
    mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    vUV = aUV;
    vViewPosition = mv.xyz;
    vInfluence = influence;
    vWeave = sin(u * 3.0 - uTime * 0.2);

    float edge = pow(abs(v), 1.7);
    float current = pow(max(0.0, sin(u * 2.0 - uTime * 0.6 + v * 3.0)), 10.0);
    float light = 0.58 + 0.32 * sin(u + v * 2.0 - uTime * 0.22) + edge * 0.15;
    float depth = clamp((mv.z + 12.0) / 5.5, 0.3, 1.0);
    float leftFade = mix(0.47, 1.0, smoothstep(-4.0, 1.6, p.x));
    vAlpha = (0.40 + edge * 0.55 + light * 0.27 + current * 0.2) * depth * leftFade;
    vAlpha *= mix(1.0, 0.20 + aSeed * 0.2, uChapters.z);
    vAlpha = mix(vAlpha, 0.76 + aSeed * 0.28, uPlayground);
    vAlpha *= mix(1.0, 1.0 - uPlayground, uIsLine);
    vAlpha *= mix(1.0, 1.0 - uChapters.z * 0.98, uIsLine);
    vLight = light;
    vMint = smoothstep(0.56, 1.0, sin(u * 2.0 + v * 2.0 + uTime * 0.16) * 0.5 + 0.5) * 0.7 + influence * 0.75 + current * 0.45;
    vSeed = aSeed;
    gl_PointSize = (1.4 + aSeed * 1.2 + influence * 0.65) * uPixelRatio * (8.0 / -mv.z);
    gl_PointSize *= mix(1.0, 1.14, uPlayground);
    gl_PointSize *= mix(1.0, 0.8 + aSeed * 0.6, uChapters.z);
  }
`;

const pointFragmentShader = /* glsl */ `
  uniform float uPlayground;
  uniform vec4 uChapters;
  varying float vAlpha;
  varying float vLight;
  varying float vMint;
  varying float vSeed;
  void main() {
    float distance = length(gl_PointCoord - 0.5);
    if (distance > 0.5) discard;
    float softness = 1.0 - smoothstep(0.16, 0.5, distance);
    vec3 bronze = vec3(0.67, 0.46, 0.27);
    vec3 ivory = vec3(0.91, 0.85, 0.72);
    vec3 mint = vec3(0.55, 0.88, 0.76);
    vec3 color = mix(bronze, ivory, clamp(vLight, 0.0, 1.0));
    color = mix(color, mint, clamp(vMint, 0.0, 0.9));
    float presence = mix(0.025, 1.0, max(uPlayground, uChapters.z));
    gl_FragColor = vec4(color, softness * vAlpha * presence);
  }
`;

const lineFragmentShader = /* glsl */ `
  varying float vAlpha;
  varying float vLight;
  varying float vMint;
  varying float vSeed;
  void main() {
    vec3 color = mix(vec3(0.48, 0.31, 0.18), vec3(0.84, 0.78, 0.65), vLight);
    color = mix(color, vec3(0.47, 0.76, 0.66), vMint * 0.5);
    gl_FragColor = vec4(color, vAlpha * 0.055);
  }
`;

// The mesh deliberately has a dedicated position function: its continuous
// topology and normals never depend on random particle/letter attributes.
const surfaceVertexShader = /* glsl */ `
  uniform float uTime;
  uniform vec4 uChapters;
  uniform float uPlayground;
  uniform float uAspect;
  uniform float uPointerStrength;
  uniform vec2 uPointer;
  uniform vec2 uPointerVelocity;
  varying vec2 vUV;
  varying vec3 vViewPosition;
  varying vec3 vSurfaceNormal;
  varying float vInfluence;
  varying float vWeave;
  const float PI = 3.14159265359;

  mat2 turn(float angle) {
    float s = sin(angle), c = cos(angle);
    return mat2(c, -s, s, c);
  }

  vec3 surfacePosition(vec2 coordinate) {
    float u = (coordinate.x == 1.0 ? 0.0 : coordinate.x) * PI * 2.0;
    float v = coordinate.y * 2.0 - 1.0;
    float breath = sin(u * 3.0 + v * 4.0 + uTime * 0.42);
    vec2 tangent = normalize(vec2(3.6 * cos(u), 2.6 * cos(2.0 * u)));
    vec2 normal = vec2(-tangent.y, tangent.x);
    float twist = u + 0.65 * sin(u * 2.0 + uTime * 0.23) + 0.22 * sin(uTime * 0.17);
    float width = 0.79 + 0.13 * sin(u * 3.0 - uTime * 0.14);
    vec3 silk = vec3(3.6 * sin(u), 1.3 * sin(2.0 * u), cos(u) * 1.04);
    silk += vec3(normal * cos(twist), sin(twist)) * v * width;
    silk.z += sin(v * 11.0 + u * 4.0 - uTime * 0.55) * 0.035;
    silk.z += breath * 0.16 * (1.0 - v * v);
    silk.y += sin(u * 2.0 - uTime * 0.23) * 0.12;
    silk.xy = turn(0.38) * silk.xy;
    silk.xy += vec2(1.35, 0.5);

    float radius = 2.4 + v * 0.64 * cos(u + uTime * 0.10);
    vec3 orbit = vec3(cos(u) * radius, sin(u) * radius * 0.76, sin(u * 2.0) * 0.65 + v * sin(u + uTime * 0.10) * 0.8);
    orbit.xy = turn(-0.44) * orbit.xy;
    orbit.xy += vec2(2.0, 0.15);

    float angle = coordinate.x * PI * 1.65 - 0.1;
    float arcRadius = 3.6 + v * 0.51;
    vec3 arc = vec3(cos(angle) * arcRadius + 2.1, sin(angle) * arcRadius - 1.2, sin(angle * 2.0) * 0.5 + v * 0.5 + breath * 0.09);
    vec3 p = silk * uChapters.x + orbit * uChapters.y + silk * 0.76 * uChapters.z + arc * uChapters.w;
    float narrow = 1.0 - smoothstep(0.65, 1.3, uAspect);
    p.x = mix(p.x, (p.x - 0.7) * 0.61, narrow);
    p.y += narrow * 0.72 * uChapters.x;
    p = mix(p, silk * 0.75, uPlayground);

    vec4 projected = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
    vec2 difference = (projected.xy / projected.w - uPointer) * vec2(uAspect, 1.0);
    float distance = length(difference);
    float influence = exp(-distance * distance * 5.0) * uPointerStrength;
    float ripple = sin(distance * 18.0 - uTime * 2.2) * exp(-distance * 2.1) * uPointerStrength;
    p.xy += normalize(difference + vec2(0.001)) * influence * 0.22;
    p.xy += uPointerVelocity * influence * 0.28;
    p.z += ripple * 0.12 + influence * 0.38;
    p.xy += uPointer * uPointerStrength * vec2(0.065, 0.035);
    return p;
  }

  void main() {
    vec3 p = surfacePosition(uv);
    // Sample the continuous shape, not the edges of its rasterized triangles.
    // Interpolating these vertex normals yields a smooth specular reflection.
    float epsilon = 0.0007;
    vec3 along = surfacePosition(uv + vec2(epsilon, 0.0)) - surfacePosition(uv - vec2(epsilon, 0.0));
    vec3 across = surfacePosition(uv + vec2(0.0, epsilon)) - surfacePosition(uv - vec2(0.0, epsilon));
    vSurfaceNormal = normalize(normalMatrix * normalize(cross(along, across)));
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    vViewPosition = mv.xyz;
    vUV = uv;
    vWeave = sin(uv.x * PI * 6.0 - uTime * 0.2);
    vec2 difference = (gl_Position.xy / gl_Position.w - uPointer) * vec2(uAspect, 1.0);
    vInfluence = exp(-dot(difference, difference) * 5.0) * uPointerStrength;
  }
`;

// The form is one continuous surface; fibers only accent its material.
const surfaceFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uPlayground;
  uniform vec4 uChapters;
  varying vec2 vUV;
  varying vec3 vViewPosition;
  varying vec3 vSurfaceNormal;
  varying float vInfluence;
  varying float vWeave;

  void main() {
    float presence = pow(1.0 - uPlayground, 2.0) * pow(1.0 - uChapters.z, 3.0);
    if (presence < 0.004) discard;
    vec3 N = normalize(vSurfaceNormal);
    vec3 V = normalize(-vViewPosition);
    if (dot(N, V) < 0.0) N = -N;
    vec3 key = normalize(vec3(-0.55, 0.9, 1.1));
    vec3 fill = normalize(vec3(0.85, -0.25, 0.6));
    float diffuse = max(dot(N, key), 0.0);
    float grazing = pow(1.0 - max(dot(N, V), 0.0), 2.4);
    float highlight = pow(max(dot(N, normalize(key + V)), 0.0), 54.0);
    float broadSheen = pow(max(dot(N, normalize(fill + V)), 0.0), 11.0);

    // A directional environment gives the underside bronze, and the folding
    // edge a cool mint reflection. This follows the geometry as it twists.
    vec3 R = reflect(-V, N);
    float coolReflection = smoothstep(-0.25, 0.8, R.x * 0.7 + R.y * 0.8);
    vec3 bronze = vec3(0.39, 0.265, 0.15);
    vec3 mint = vec3(0.36, 0.58, 0.48);
    vec3 ivory = vec3(0.93, 0.87, 0.73);
    vec3 base = mix(bronze, mint, coolReflection * 0.84);
    float folds = 0.96 + 0.04 * sin(vUV.y * 94.0 + vWeave * 1.4);
    vec3 color = base * (0.18 + diffuse * 0.58) * folds;
    color += mix(ivory, mint * 1.4, coolReflection) * (highlight * 0.73 + broadSheen * 0.20);
    color += mix(bronze, mint, coolReflection) * grazing * 0.48;
    color += mint * vInfluence * (0.08 + broadSheen * 0.19);

    // A slender luminous hem defines the silhouette without a neon outline.
    float hem = pow(abs(vUV.y * 2.0 - 1.0), 45.0);
    color += ivory * hem * (0.10 + grazing * 0.22);
    float quietLeft = mix(0.54, 1.0, smoothstep(-2.5, 2.0, vViewPosition.x));
    color *= quietLeft;
    float feather = 1.0 - smoothstep(0.986, 1.0, abs(vUV.y * 2.0 - 1.0));
    gl_FragColor = vec4(color, feather * presence * 0.91);
  }
`;

function sampleMonogram(): Array<[number, number]> {
  const canvas = document.createElement("canvas");
  canvas.width = 600;
  canvas.height = 280;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) return [[0, 0]];
  context.font = "600 230px Manrope, Arial, sans-serif";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText("RG", 300, 145);
  const pixels = context.getImageData(0, 0, 600, 280).data;
  const samples: Array<[number, number]> = [];
  for (let y = 10; y < 270; y += 2) {
    for (let x = 10; x < 590; x += 2) {
      if (pixels[(y * 600 + x) * 4 + 3] > 128) {
        samples.push([(x - 300) * 0.024, (145 - y) * 0.024]);
      }
    }
  }
  return samples.length ? samples : [[0, 0]];
}

function buildGeometry(
  columns: number,
  rows: number,
  glyph: Array<[number, number]>,
  lines = false,
) {
  const count = lines ? columns * rows * 2 : columns * rows;
  const positions = new Float32Array(count * 3);
  const uv = new Float32Array(count * 2);
  const letter = new Float32Array(count * 3);
  const seeds = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const cell = lines ? Math.floor(i / 2) : i;
    const column = cell % columns;
    const row = Math.floor(cell / columns);
    uv[i * 2] = (column + (lines ? i % 2 : 0)) / columns;
    uv[i * 2 + 1] = row / Math.max(rows - 1, 1);
    const seed = ((cell * 2654435761) >>> 0) / 4294967295;
    seeds[i] = seed;
    const sample = glyph[Math.floor(seed * (glyph.length - 1))];
    letter[i * 3] = sample[0] + (seed - 0.5) * 0.015;
    letter[i * 3 + 1] = sample[1];
    letter[i * 3 + 2] = Math.sin(seed * 500.0) * 0.3;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("aUV", new THREE.BufferAttribute(uv, 2));
  geometry.setAttribute("aGlyph", new THREE.BufferAttribute(letter, 3));
  geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
  // The shader moves positions beyond the otherwise zero-sized bounds.
  geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 20);
  return geometry;
}

function buildSurfaceGeometry(columns: number, rows: number) {
  const geometry = new THREE.PlaneGeometry(1, 1, columns, rows - 1);
  geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 20);
  return geometry;
}

/**
 * The fixed, decorative backdrop for Ritvik's Signature direction.
 * All particle deformation happens on the GPU. Pausing or reducing motion
 * stops the animation loop entirely; resize and chapter changes still render.
 */
export default function PersonalField(props: PersonalFieldProps) {
  const { chapter, playground, paused, reducedMotion } = props;
  const hostRef = useRef<HTMLDivElement>(null);
  const current = useRef(props);
  const invalidate = useRef<() => void>(() => undefined);
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    current.current = { chapter, playground, paused, reducedMotion };
    invalidate.current();
  }, [chapter, playground, paused, reducedMotion]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "low-power",
        premultipliedAlpha: false,
      });
    } catch {
      return;
    }
    const mobile = window.innerWidth < 768;
    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, mobile ? 1.25 : 1.7),
    );
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.setAttribute("aria-hidden", "true");
    host.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(39, 1, 0.1, 30);
    camera.position.z = 9.2;
    const glyph = sampleMonogram();
    const glyphBounds = glyph.reduce(
      (bounds, [x, y]) => ({
        minX: Math.min(bounds.minX, x),
        maxX: Math.max(bounds.maxX, x),
        minY: Math.min(bounds.minY, y),
        maxY: Math.max(bounds.maxY, y),
      }),
      { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity },
    );
    const glyphCenterX = (glyphBounds.minX + glyphBounds.maxX) / 2;
    const glyphCenterY = (glyphBounds.minY + glyphBounds.maxY) / 2;
    for (const sample of glyph) {
      sample[0] -= glyphCenterX;
      sample[1] -= glyphCenterY;
    }
    const glyphWidth = Math.max(glyphBounds.maxX - glyphBounds.minX, 1);
    const geometry = buildGeometry(mobile ? 280 : 420, mobile ? 42 : 64, glyph);
    const lineGeometry = buildGeometry(
      mobile ? 220 : 340,
      mobile ? 10 : 16,
      glyph,
      true,
    );
    const surfaceGeometry = buildSurfaceGeometry(
      mobile ? 220 : 360,
      mobile ? 44 : 64,
    );
    // Vector4 defaults to w=1, which would blend the open contact arc into
    // the hero on startup. Start from an explicit partition of unity.
    const chapterWeights = new THREE.Vector4(0, 0, 0, 0);
    const initialChapter = Math.max(0, Math.min(3, current.current.chapter));
    for (let index = 0; index < 4; index++) {
      chapterWeights.setComponent(
        index,
        Math.max(0, 1 - Math.abs(initialChapter - index)),
      );
    }
    const sharedUniforms = {
      uTime: { value: 0 },
      uChapters: { value: chapterWeights },
      uPlayground: { value: current.current.playground ? 1 : 0 },
      uPixelRatio: { value: renderer.getPixelRatio() },
      uAspect: { value: 1 },
      uGlyphScale: { value: 0.8 },
      uGlyphOffsetY: { value: glyphCenterY * 0.8 - 0.7 },
      uPointer: { value: new THREE.Vector2(0.5, 0.4) },
      uPointerVelocity: { value: new THREE.Vector2() },
      uPointerStrength: { value: 0 },
    };
    const material = new THREE.ShaderMaterial({
      uniforms: {
        ...sharedUniforms,
        uIsLine: { value: 0 },
        uIsSurface: { value: 0 },
      },
      vertexShader,
      fragmentShader: pointFragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const lineMaterial = new THREE.ShaderMaterial({
      uniforms: {
        ...sharedUniforms,
        uIsLine: { value: 1 },
        uIsSurface: { value: 0 },
      },
      vertexShader,
      fragmentShader: lineFragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const surfaceMaterial = new THREE.ShaderMaterial({
      uniforms: {
        ...sharedUniforms,
        uIsLine: { value: 0 },
        uIsSurface: { value: 1 },
      },
      vertexShader: surfaceVertexShader,
      fragmentShader: surfaceFragmentShader,
      transparent: true,
      depthWrite: true,
      side: THREE.DoubleSide,
      forceSinglePass: true,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
      blending: THREE.NormalBlending,
    });
    const surface = new THREE.Mesh(surfaceGeometry, surfaceMaterial);
    const points = new THREE.Points(geometry, material);
    const contours = new THREE.LineSegments(lineGeometry, lineMaterial);
    surface.renderOrder = 0;
    contours.renderOrder = 1;
    points.renderOrder = 2;
    scene.add(surface, points, contours);

    // A hand-drawn stellar R / G: a second, subtler signature in the story.
    const paths = [
      [
        [-4.3, 0.3],
        [-4.3, 1.65],
        [-3.45, 1.65],
        [-3.2, 1.25],
        [-3.45, 0.95],
        [-4.3, 0.95],
        [-3.1, 0.2],
      ],
      [
        [4.35, 1.6],
        [3.65, 1.9],
        [3.1, 1.4],
        [3.0, 0.7],
        [3.6, 0.3],
        [4.4, 0.6],
        [4.4, 1.05],
        [3.9, 1.05],
      ],
    ];
    const constellationCoordinates: number[] = [];
    const constellationNodes: number[] = [];
    for (const path of paths) {
      path.forEach(([x, y]) => constellationNodes.push(x, y, -0.1));
      for (let i = 0; i < path.length - 1; i++) {
        constellationCoordinates.push(...path[i], -0.1, ...path[i + 1], -0.1);
      }
    }
    const constellationGeometry = new THREE.BufferGeometry();
    constellationGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(constellationCoordinates, 3),
    );
    const constellationMaterial = new THREE.LineBasicMaterial({
      color: 0xb9c6a4,
      transparent: true,
      opacity: 0,
    });
    const constellation = new THREE.LineSegments(
      constellationGeometry,
      constellationMaterial,
    );
    const nodeGeometry = new THREE.BufferGeometry();
    nodeGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(constellationNodes, 3),
    );
    const nodeMaterial = new THREE.PointsMaterial({
      color: 0xe9d7b7,
      transparent: true,
      opacity: 0,
      size: 0.025,
    });
    const nodes = new THREE.Points(nodeGeometry, nodeMaterial);
    scene.add(constellation, nodes);

    let frame: number | null = null;
    let lastTime = performance.now();
    let elapsed = 0;
    let lost = false;
    let pointerPresent = false;
    let disposed = false;
    const targetPointer = new THREE.Vector2(0.5, 0.4);
    const pointerVelocity = new THREE.Vector2();
    const nextPointer = new THREE.Vector2();
    const draw = (now: number) => {
      frame = null;
      if (disposed || lost || document.hidden) return;
      const settings = current.current;
      const moving = !settings.paused && !settings.reducedMotion;
      const delta = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      if (moving) elapsed += delta;
      sharedUniforms.uTime.value = elapsed;
      const easing = moving ? 1 - Math.exp(-delta * 2.5) : 1;
      const targetChapter = Math.max(0, Math.min(3, settings.chapter));
      for (let index = 0; index < 4; index++) {
        const target = Math.max(0, 1 - Math.abs(targetChapter - index));
        const value = chapterWeights.getComponent(index);
        chapterWeights.setComponent(index, value + (target - value) * easing);
      }
      sharedUniforms.uPlayground.value +=
        ((settings.playground ? 1 : 0) - sharedUniforms.uPlayground.value) *
        easing;
      sharedUniforms.uPointer.value.lerp(
        targetPointer,
        moving ? 1 - Math.exp(-delta * 4) : 1,
      );
      sharedUniforms.uPointerStrength.value +=
        ((pointerPresent && moving ? 1 : 0) -
          sharedUniforms.uPointerStrength.value) *
        (moving ? 1 - Math.exp(-delta * 3) : 1);
      pointerVelocity.multiplyScalar(moving ? Math.exp(-delta * 3.5) : 0);
      sharedUniforms.uPointerVelocity.value.lerp(
        pointerVelocity,
        moving ? 1 - Math.exp(-delta * 7) : 1,
      );
      const story = chapterWeights.z * (1 - sharedUniforms.uPlayground.value);
      constellationMaterial.opacity = story * 0.2;
      nodeMaterial.opacity = story * 0.67;
      renderer.render(scene, camera);
      if (moving) frame = requestAnimationFrame(draw);
    };
    const schedule = () => {
      if (frame === null && !disposed && !document.hidden && !lost) {
        frame = requestAnimationFrame(draw);
      }
    };
    invalidate.current = schedule;
    const resize = () => {
      const { width, height } = host.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.position.z = camera.aspect < 0.8 ? 10.5 : 9.2;
      camera.updateProjectionMatrix();
      sharedUniforms.uAspect.value = camera.aspect;
      const narrowViewport = width < 768;
      const visibleHeight =
        2 *
        Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) *
        camera.position.z;
      sharedUniforms.uGlyphScale.value = narrowViewport
        ? (visibleHeight * camera.aspect * 0.82) / glyphWidth
        : 0.8;
      sharedUniforms.uGlyphOffsetY.value = narrowViewport
        ? 0
        : glyphCenterY * 0.8 - 0.7;
      schedule();
    };
    const pointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      nextPointer.set(
        (event.clientX / window.innerWidth) * 2 - 1,
        1 - (event.clientY / window.innerHeight) * 2,
      );
      pointerVelocity
        .subVectors(nextPointer, targetPointer)
        .multiplyScalar(12)
        .clampLength(0, 1.2);
      targetPointer.copy(nextPointer);
      pointerPresent = true;
      if (!current.current.paused && !current.current.reducedMotion) schedule();
    };
    const pointerLeave = () => {
      pointerPresent = false;
    };
    const visibility = () => {
      if (document.hidden && frame !== null) {
        cancelAnimationFrame(frame);
        frame = null;
      } else {
        lastTime = performance.now();
        schedule();
      }
    };
    const contextLost = (event: Event) => {
      event.preventDefault();
      lost = true;
      setAvailable(false);
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;
    };
    const contextRestored = () => {
      lost = false;
      setAvailable(true);
      schedule();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(host);
    window.addEventListener("pointermove", pointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", pointerLeave);
    document.addEventListener("visibilitychange", visibility);
    renderer.domElement.addEventListener("webglcontextlost", contextLost);
    renderer.domElement.addEventListener(
      "webglcontextrestored",
      contextRestored,
    );
    resize();
    setAvailable(true);
    schedule();
    return () => {
      disposed = true;
      if (frame !== null) cancelAnimationFrame(frame);
      invalidate.current = () => undefined;
      observer.disconnect();
      window.removeEventListener("pointermove", pointerMove);
      document.documentElement.removeEventListener(
        "pointerleave",
        pointerLeave,
      );
      document.removeEventListener("visibilitychange", visibility);
      renderer.domElement.removeEventListener("webglcontextlost", contextLost);
      renderer.domElement.removeEventListener(
        "webglcontextrestored",
        contextRestored,
      );
      [
        geometry,
        lineGeometry,
        surfaceGeometry,
        constellationGeometry,
        nodeGeometry,
      ].forEach((item) => item.dispose());
      [
        material,
        lineMaterial,
        surfaceMaterial,
        constellationMaterial,
        nodeMaterial,
      ].forEach((item) => item.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div
      className={`signature-personal-field ${available ? "is-rendered" : "is-fallback"}`}
      ref={hostRef}
      aria-hidden="true"
    >
      <div className="signature-field-atmosphere" />
      <svg
        className={`signature-field-fallback ${playground ? "is-monogram" : ""}`}
        viewBox={playground ? "0 0 1000 500" : "0 0 1400 900"}
        fill="none"
        preserveAspectRatio={playground ? "xMidYMid meet" : "xMidYMid slice"}
      >
        <defs>
          <pattern
            id="signature-field-monogram-dots"
            width="4"
            height="4"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2" cy="2" r="1.1" fill="#bcd3b3" />
          </pattern>
          <linearGradient
            id="signature-field-fallback-stroke"
            x1="200"
            y1="650"
            x2="1200"
            y2="100"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#5b4937" />
            <stop offset=".5" stopColor="#c1b29a" />
            <stop offset="1" stopColor="#8ab5a4" />
          </linearGradient>
        </defs>
        {playground ? (
          <text
            x="500"
            y="255"
            textAnchor="middle"
            dominantBaseline="central"
            fontFamily="Manrope, Arial, sans-serif"
            fontWeight="600"
            fontSize="490"
            textLength="950"
            lengthAdjust="spacingAndGlyphs"
            fill="url(#signature-field-monogram-dots)"
          >
            RG
          </text>
        ) : (
          Array.from({ length: 22 }, (_, index) => (
            <path
              key={index}
              d={`M ${250 + index * 3} ${480 + index * 3} C ${480 - index * 2} ${80 + index * 2}, ${1130 - index * 4} ${850 - index * 7}, ${1190 - index * 4} ${380 + index * 2} S ${620 + index * 5} ${50 + index * 2}, ${520 + index * 3} ${320 + index * 4} S ${700 - index * 2} ${660 - index * 3}, ${960 - index * 4} ${260 + index * 5}`}
              stroke="url(#signature-field-fallback-stroke)"
              strokeWidth=".6"
              opacity={0.25 + index * 0.013}
            />
          ))
        )}
      </svg>
    </div>
  );
}
