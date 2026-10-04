import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

interface RibbonSculptureProps {
  exploded: boolean;
}

function makeRibbon(start: number, end: number) {
  const positions: number[] = [];
  const indices: number[] = [];
  const segments = 180;
  const point = (t: number) => new THREE.Vector3(
    (1.5 + 0.45 * Math.cos(3 * t)) * Math.cos(2 * t),
    (1.5 + 0.45 * Math.cos(3 * t)) * Math.sin(2 * t),
    0.65 * Math.sin(3 * t),
  );
  for (let i = 0; i <= segments; i++) {
    const t = start + ((end - start) * i) / segments;
    const center = point(t);
    const tangent = point(t + 0.001).sub(point(t - 0.001)).normalize();
    const radial = new THREE.Vector3(Math.cos(2 * t), Math.sin(2 * t), 0);
    const normal = radial.sub(tangent.clone().multiplyScalar(radial.dot(tangent))).normalize();
    const binormal = new THREE.Vector3().crossVectors(tangent, normal).normalize();
    const twist = 0.38 * Math.sin(3 * t) + 0.28;
    const widthAxis = normal.clone().multiplyScalar(Math.cos(twist)).addScaledVector(binormal, Math.sin(twist));
    const thicknessAxis = new THREE.Vector3().crossVectors(tangent, widthAxis).normalize();
    const corners = [[-0.37, -0.034], [0.37, -0.034], [0.37, 0.034], [-0.37, 0.034]];
    corners.forEach(([w, h]) => {
      const vertex = center.clone().addScaledVector(widthAxis, w).addScaledVector(thicknessAxis, h);
      positions.push(vertex.x, vertex.y, vertex.z);
    });
  }
  for (let i = 0; i < segments; i++) {
    for (let j = 0; j < 4; j++) {
      const a = i * 4 + j;
      const b = i * 4 + ((j + 1) % 4);
      indices.push(a, b, a + 4, b, b + 4, a + 4);
    }
  }
  indices.push(0, 2, 1, 0, 3, 2);
  const last = segments * 4;
  indices.push(last, last + 1, last + 2, last, last + 2, last + 3);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

export default function RibbonSculpture({ exploded }: RibbonSculptureProps) {
  const host = useRef<HTMLDivElement>(null);
  const explodeRef = useRef(exploded);
  const [ready, setReady] = useState(false);
  useEffect(() => { explodeRef.current = exploded; }, [exploded]);

  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
    } catch {
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    element.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0, 0, 9.6);
    const pmrem = new THREE.PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    const environment = pmrem.fromScene(room, 0.04);
    scene.environment = environment.texture;
    scene.environmentIntensity = 0.7;
    room.dispose();
    pmrem.dispose();
    const key = new THREE.DirectionalLight(0xfff8ee, 2.5);
    key.position.set(-3, 5, 6);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xffffff, 2);
    rim.position.set(4, -1, -3);
    scene.add(rim);
    const fill = new THREE.HemisphereLight(0xfff8f0, 0x5d2219, 1.3);
    scene.add(fill);
    const sculpture = new THREE.Group();
    sculpture.rotation.set(-0.48, 0.35, 0.4);
    scene.add(sculpture);
    const material = new THREE.MeshPhysicalMaterial({
      color: 0xb91e08,
      metalness: 0.45,
      roughness: 0.36,
      clearcoat: 0.32,
      clearcoatRoughness: 0.25,
      side: THREE.DoubleSide,
    });
    const pieces: THREE.Mesh[] = [];
    for (let i = 0; i < 3; i++) {
      const mesh = new THREE.Mesh(makeRibbon((i / 3) * Math.PI * 2, ((i + 1) / 3) * Math.PI * 2), material);
      sculpture.add(mesh);
      pieces.push(mesh);
    }
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pointer = new THREE.Vector2();
    const pointerMove = (event: PointerEvent) => {
      const rect = element.getBoundingClientRect();
      pointer.set(((event.clientX - rect.left) / rect.width - 0.5) * 2, ((event.clientY - rect.top) / rect.height - 0.5) * 2);
    };
    const pointerLeave = () => { pointer.set(0, 0); };
    element.addEventListener('pointermove', pointerMove);
    element.addEventListener('pointerleave', pointerLeave);
    let renderedReducedState: boolean | null = null;
    const resize = () => {
      const { width, height } = element.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.position.z = camera.aspect < 0.85 ? 11.6 : 9.6;
      camera.updateProjectionMatrix();
      renderedReducedState = null;
    };
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    resize();
    let frame = 0;
    let amount = 0;
    let visible = true;
    let contextLost = false;
    let elapsed = 0;
    let previous = performance.now();
    const visibility = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    visibility.observe(element);
    const animate = (now: number) => {
      frame = requestAnimationFrame(animate);
      const delta = Math.min((now - previous) / 1000, 0.05);
      previous = now;
      if (!visible || document.hidden || contextLost) return;
      if (reducedMotion.matches && renderedReducedState === explodeRef.current) return;
      elapsed += delta;
      const targetAmount = explodeRef.current ? 1 : 0;
      amount = reducedMotion.matches ? targetAmount : THREE.MathUtils.lerp(amount, targetAmount, 1 - Math.exp(-delta * 5));
      pieces.forEach((piece, i) => {
        const angle = (i / 3) * Math.PI * 2 + 0.6;
        piece.position.set(Math.cos(angle) * amount * 0.82, Math.sin(angle) * amount * 0.82, amount * (i - 1) * 0.22);
        piece.rotation.z = (i - 1) * amount * 0.15;
      });
      const gentle = reducedMotion.matches ? 0 : Math.sin(elapsed * 0.2) * 0.12;
      sculpture.rotation.x = THREE.MathUtils.lerp(sculpture.rotation.x, -0.48 + (reducedMotion.matches ? 0 : pointer.y * 0.14), 0.045);
      sculpture.rotation.y = THREE.MathUtils.lerp(sculpture.rotation.y, 0.35 + gentle + (reducedMotion.matches ? 0 : pointer.x * 0.25), 0.045);
      sculpture.position.y = reducedMotion.matches ? 0 : Math.sin(elapsed * 0.55) * 0.055;
      renderer.render(scene, camera);
      renderedReducedState = reducedMotion.matches ? explodeRef.current : null;
    };
    const onContextLost = (event: Event) => { event.preventDefault(); contextLost = true; setReady(false); };
    const onContextRestored = () => { contextLost = false; renderedReducedState = null; setReady(true); };
    renderer.domElement.addEventListener('webglcontextlost', onContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', onContextRestored);
    frame = requestAnimationFrame(animate);
    setReady(true);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      visibility.disconnect();
      element.removeEventListener('pointermove', pointerMove);
      element.removeEventListener('pointerleave', pointerLeave);
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', onContextRestored);
      pieces.forEach(piece => piece.geometry.dispose());
      material.dispose();
      environment.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div className={`at-sculpture ${ready ? 'is-ready' : ''} ${exploded ? 'is-exploded' : ''}`}>
      <div className="at-sculpture-canvas" ref={host} aria-hidden="true" />
      <svg className="at-sculpture-fallback" viewBox="0 0 600 550" aria-hidden="true">
        <defs>
          <linearGradient id="at-ribbon-red" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#f58150" /><stop offset=".45" stopColor="#d43418" /><stop offset="1" stopColor="#801a10" />
          </linearGradient>
        </defs>
        <g fill="none" stroke="url(#at-ribbon-red)" strokeWidth="58">
          <ellipse cx="300" cy="275" rx="170" ry="95" transform="rotate(-35 300 275)" />
          <ellipse cx="300" cy="275" rx="170" ry="95" transform="rotate(85 300 275)" />
          <ellipse cx="300" cy="275" rx="170" ry="95" transform="rotate(205 300 275)" />
        </g>
      </svg>
      <div className="at-sculpture-shadow" />
    </div>
  );
}
