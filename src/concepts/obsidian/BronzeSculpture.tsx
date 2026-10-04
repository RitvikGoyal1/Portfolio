import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

type SculptureProps = { expanded: boolean; paused: boolean };

function roundedRectangle(width: number, height: number, radius: number) {
  const shape = new THREE.Shape();
  const x = -width / 2;
  const y = -height / 2;
  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + radius);
  shape.lineTo(x + width, y + height - radius);
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  shape.lineTo(x + radius, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - radius);
  shape.lineTo(x, y + radius);
  shape.quadraticCurveTo(x, y, x + radius, y);
  return shape;
}

export default function BronzeSculpture({ expanded, paused }: SculptureProps) {
  const mount = useRef<HTMLDivElement>(null);
  const settings = useRef({ expanded, paused });
  const [fallback, setFallback] = useState(false);

  useEffect(() => { settings.current = { expanded, paused }; }, [expanded, paused]);

  useEffect(() => {
    const container = mount.current;
    if (!container) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
    } catch {
      setFallback(true);
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.45;
    container.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 80);
    camera.position.set(5.9, 4.1, 8.7);
    camera.lookAt(0, 0.05, 0);

    // A small studio environment gives the metal real reflections without a remote HDRI.
    const studio = document.createElement("canvas");
    studio.width = 1024;
    studio.height = 512;
    const context = studio.getContext("2d");
    let environment: THREE.CanvasTexture | undefined;
    let environmentTarget: THREE.WebGLRenderTarget | undefined;
    if (context) {
      const gradient = context.createLinearGradient(0, 0, 0, 512);
      gradient.addColorStop(0, "#b9a186");
      gradient.addColorStop(0.35, "#524335");
      gradient.addColorStop(0.55, "#11100f");
      gradient.addColorStop(1, "#030303");
      context.fillStyle = gradient;
      context.fillRect(0, 0, 1024, 512);
      context.fillStyle = "#fff8df";
      context.fillRect(90, 35, 80, 310);
      context.fillStyle = "#d6b48c";
      context.fillRect(460, 70, 28, 270);
      context.fillStyle = "#f7eee2";
      context.fillRect(740, 25, 150, 180);
      environment = new THREE.CanvasTexture(studio);
      environment.mapping = THREE.EquirectangularReflectionMapping;
      environment.colorSpace = THREE.SRGBColorSpace;
      const generator = new THREE.PMREMGenerator(renderer);
      environmentTarget = generator.fromEquirectangular(environment);
      scene.environment = environmentTarget.texture;
      generator.dispose();
    }

    const shape = roundedRectangle(3.15, 2.25, 0.67);
    const hole = roundedRectangle(2.34, 1.44, 0.35);
    shape.holes.push(new THREE.Path(hole.getPoints(48).reverse()));
    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth: 0.105, bevelEnabled: true, bevelSegments: 3,
      steps: 1, bevelSize: 0.035, bevelThickness: 0.035, curveSegments: 24,
    });
    geometry.center();
    geometry.rotateX(Math.PI / 2);
    const material = new THREE.MeshStandardMaterial({
      color: 0xba8962, metalness: 0.98, roughness: 0.215, envMapIntensity: 1.25,
    });
    const darkMaterial = new THREE.MeshStandardMaterial({
      color: 0x544437, metalness: 0.97, roughness: 0.26, envMapIntensity: 1.3,
    });
    const sculpture = new THREE.Group();
    const layers: THREE.Mesh[] = [];
    for (let i = 0; i < 17; i++) {
      const mesh = new THREE.Mesh(geometry, i % 5 === 0 ? darkMaterial : material);
      mesh.position.y = (i - 8) * 0.182;
      mesh.rotation.y = i * 0.12;
      layers.push(mesh);
      sculpture.add(mesh);
    }
    sculpture.rotation.z = -0.13;
    scene.add(sculpture);
    const ambient = new THREE.AmbientLight(0xffe7cc, 1.3);
    scene.add(ambient);
    const key = new THREE.DirectionalLight(0xffe7d0, 4);
    key.position.set(-3, 6, 4);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xffffff, 2);
    rim.position.set(4, 2, -3);
    scene.add(rim);

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = true;
    let pointerX = 0;
    let pointerY = 0;
    let unfolding = 0;
    let frame = 0;
    let rotation = 0.15;
    let lastTime = 0;
    const resize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      if (!width || !height) return;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(container);
    resize();
    const visibility = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    visibility.observe(container);
    const move = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const bounds = container.getBoundingClientRect();
      pointerX = (event.clientX - bounds.left) / bounds.width - 0.5;
      pointerY = (event.clientY - bounds.top) / bounds.height - 0.5;
    };
    const leave = () => { pointerX = 0; pointerY = 0; };
    container.addEventListener("pointermove", move);
    container.addEventListener("pointerleave", leave);
    const render = (time: number) => {
      frame = requestAnimationFrame(render);
      const delta = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;
      if (!visible || document.hidden) return;
      const target = settings.current.expanded ? 1 : 0;
      unfolding = reducedMotion.matches ? target : THREE.MathUtils.lerp(unfolding, target, 1 - Math.exp(-delta * 4));
      if (!reducedMotion.matches && !settings.current.paused) rotation += delta * 0.105;
      sculpture.rotation.y = rotation + (reducedMotion.matches ? 0 : pointerX * 0.35);
      sculpture.rotation.x = reducedMotion.matches ? 0 : pointerY * 0.12;
      sculpture.scale.setScalar(1 - unfolding * 0.1);
      layers.forEach((layer, index) => {
        layer.position.y = (index - 8) * (0.182 + unfolding * 0.115);
        layer.rotation.y = index * (0.12 + unfolding * 0.12);
      });
      renderer.render(scene, camera);
    };
    frame = requestAnimationFrame(render);
    const contextLost = (event: Event) => { event.preventDefault(); setFallback(true); };
    renderer.domElement.addEventListener("webglcontextlost", contextLost);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      visibility.disconnect();
      container.removeEventListener("pointermove", move);
      container.removeEventListener("pointerleave", leave);
      renderer.domElement.removeEventListener("webglcontextlost", contextLost);
      geometry.dispose(); material.dispose(); darkMaterial.dispose();
      environmentTarget?.dispose(); environment?.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div className={`ob-sculpture ${expanded ? "is-expanded" : ""}`} role="img" aria-label={`Interactive bronze sculpture: seventeen twisting layers, ${expanded ? "unfolded" : "assembled"}.`}>
      <div className="ob-canvas" ref={mount} aria-hidden="true" />
      {fallback && <div className="ob-fallback" aria-hidden="true">{Array.from({ length: 17 }, (_, i) => <i key={i} style={{ transform: `translateY(${(i - 8) * (expanded ? 21 : 12)}px) rotateX(64deg) rotateZ(${i * 7}deg)` }} />)}</div>}
    </div>
  );
}
