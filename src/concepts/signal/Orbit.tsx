import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

type OrbitProps = {
  expanded: boolean;
  reducedMotion: boolean;
  paused: boolean;
};

/** A small, self-contained instrument. Its geometry is also its no-WebGL fallback. */
export default function Orbit({ expanded, reducedMotion, paused }: OrbitProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const settings = useRef({ expanded, reducedMotion, paused });
  const [unavailable, setUnavailable] = useState(false);
  useEffect(() => {
    settings.current = { expanded, reducedMotion, paused };
  }, [expanded, reducedMotion, paused]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "low-power",
      });
    } catch {
      setUnavailable(true);
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.setAttribute("aria-hidden", "true");
    host.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(37, 1, 0.1, 40);
    camera.position.set(0, 0, 8.4);
    const instrument = new THREE.Group();
    instrument.rotation.z = -0.25;
    scene.add(instrument);
    const count = 4700;
    const positions = new Float32Array(count * 3);
    const field = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const radius = Math.sqrt(1 - y * y);
      const angle = i * Math.PI * (3 - Math.sqrt(5));
      const ripple = 1.9 + Math.sin(y * 21 + angle * 0.015) * 0.07;
      positions[i * 3] = Math.cos(angle) * radius * ripple;
      positions[i * 3 + 1] = y * ripple;
      positions[i * 3 + 2] = Math.sin(angle) * radius * ripple;
      const strand = i % 4;
      const progress = Math.floor(i / 4) / (count / 4);
      const spiral = progress * Math.PI * 5 + (strand * Math.PI) / 2;
      const reach = 0.45 + progress * 2.2;
      field[i * 3] = Math.cos(spiral) * reach;
      field[i * 3 + 1] = (progress - 0.5) * 3.7;
      field[i * 3 + 2] = Math.sin(spiral) * reach;
      sizes[i] = 1.15 + (i % 7) * 0.22;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("aField", new THREE.BufferAttribute(field, 3));
    geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uMorph: { value: 0 },
        uTime: { value: 0 },
        uPixelRatio: { value: renderer.getPixelRatio() },
      },
      vertexShader: `
        attribute vec3 aField;
        attribute float aSize;
        uniform float uMorph;
        uniform float uTime;
        uniform float uPixelRatio;
        varying float vLight;
        void main() {
          vec3 p = mix(position, aField, uMorph);
          p *= 1.0 + sin(p.y * 3.0 + uTime * 0.6) * 0.011;
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          vLight = clamp((mv.z + 11.0) / 4.5, 0.22, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = aSize * uPixelRatio * (7.5 / -mv.z);
        }
      `,
      fragmentShader: `
        varying float vLight;
        void main() {
          float d = length(gl_PointCoord - 0.5);
          if (d > 0.5) discard;
          vec3 color = mix(vec3(0.24, 0.48, 0.50), vec3(0.78, 0.98, 0.65), vLight);
          gl_FragColor = vec4(color, (1.0 - smoothstep(0.22, 0.5, d)) * vLight * 0.95);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    instrument.add(new THREE.Points(geometry, material));

    const disposableGeometries: THREE.BufferGeometry[] = [geometry];
    const disposableMaterials: THREE.Material[] = [material];
    const rings = new THREE.Group();
    instrument.add(rings);
    for (let n = 0; n < 5; n++) {
      const points: THREE.Vector3[] = [];
      for (let j = 0; j <= 240; j++) {
        const a = (j / 240) * Math.PI * 2;
        const r = 2.22 + n * 0.08;
        points.push(new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r, 0));
      }
      const g = new THREE.BufferGeometry().setFromPoints(points);
      const m = new THREE.LineBasicMaterial({
        color: n === 1 ? 0xc4f28b : 0x6d9c9e,
        transparent: true,
        opacity: n === 1 ? 0.58 : 0.22,
      });
      const ring = new THREE.Line(g, m);
      ring.rotation.x = 1.08 + n * 0.052;
      ring.rotation.y = 0.08 + n * 0.025;
      rings.add(ring);
      disposableGeometries.push(g);
      disposableMaterials.push(m);
    }
    const globeLines = new THREE.Group();
    for (let n = 1; n < 9; n++) {
      const y = (n / 9) * 3.8 - 1.9;
      const radius = Math.sqrt(1.9 * 1.9 - y * y);
      const points = Array.from({ length: 161 }, (_, j) => {
        const a = (j / 160) * Math.PI * 2;
        return new THREE.Vector3(Math.cos(a) * radius, y, Math.sin(a) * radius);
      });
      const g = new THREE.BufferGeometry().setFromPoints(points);
      const m = new THREE.LineBasicMaterial({
        color: 0x86bfb0,
        transparent: true,
        opacity: 0.09,
      });
      globeLines.add(new THREE.Line(g, m));
      disposableGeometries.push(g);
      disposableMaterials.push(m);
    }
    instrument.add(globeLines);
    const orbitDotGeometry = new THREE.SphereGeometry(0.036, 12, 12);
    const orbitDotMaterial = new THREE.MeshBasicMaterial({ color: 0xd2f5aa });
    const orbitDot = new THREE.Mesh(orbitDotGeometry, orbitDotMaterial);
    rings.add(orbitDot);
    disposableGeometries.push(orbitDotGeometry);
    disposableMaterials.push(orbitDotMaterial);

    let frame = 0;
    let visible = true;
    let previousTime = performance.now();
    let elapsed = 0;
    const pointer = { x: 0, y: 0 };
    const move = (e: PointerEvent) => {
      const bounds = host.getBoundingClientRect();
      pointer.x = ((e.clientX - bounds.left) / bounds.width - 0.5) * 0.4;
      pointer.y = ((e.clientY - bounds.top) / bounds.height - 0.5) * 0.24;
    };
    const leave = () => {
      pointer.x = 0;
      pointer.y = 0;
    };
    host.addEventListener("pointermove", move);
    host.addEventListener("pointerleave", leave);
    const resize = () => {
      const { width, height } = host.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(host);
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    visibilityObserver.observe(host);
    resize();
    const draw = (now: number) => {
      frame = requestAnimationFrame(draw);
      const delta = Math.min((now - previousTime) / 1000, 0.05);
      previousTime = now;
      if (!visible || document.hidden) return;
      const {
        expanded: open,
        reducedMotion: reduce,
        paused: isPaused,
      } = settings.current;
      if (!reduce && !isPaused) elapsed += delta;
      const target = open ? 1 : 0;
      material.uniforms.uMorph.value +=
        (target - material.uniforms.uMorph.value) * (reduce ? 1 : 0.035);
      material.uniforms.uTime.value = elapsed;
      instrument.rotation.y = elapsed * 0.065 + (reduce ? 0.1 : pointer.x);
      instrument.rotation.x +=
        ((reduce ? 0 : pointer.y) - instrument.rotation.x) * 0.04;
      rings.rotation.z = elapsed * 0.035;
      globeLines.visible = material.uniforms.uMorph.value < 0.45;
      orbitDot.position.set(
        Math.cos(elapsed * 0.15) * 2.3,
        Math.sin(elapsed * 0.15) * 1.07,
        Math.sin(elapsed * 0.15) * 2.03,
      );
      renderer.render(scene, camera);
    };
    frame = requestAnimationFrame(draw);
    const lose = (event: Event) => {
      event.preventDefault();
      setUnavailable(true);
    };
    renderer.domElement.addEventListener("webglcontextlost", lose);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      visibilityObserver.disconnect();
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerleave", leave);
      renderer.domElement.removeEventListener("webglcontextlost", lose);
      disposableGeometries.forEach((g) => g.dispose());
      disposableMaterials.forEach((m) => m.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div
      ref={hostRef}
      className={`signal-orbit-canvas ${unavailable ? "signal-orbit-unavailable" : ""}`}
    >
      {unavailable && (
        <div
          className={`signal-orbit-fallback ${expanded ? "is-expanded" : ""}`}
          aria-hidden="true"
        >
          <i />
          <i />
          <i />
          <i />
          <i />
          <span />
        </div>
      )}
    </div>
  );
}
