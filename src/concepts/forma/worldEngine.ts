import * as T from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { chapters, clamp, smoothstep, type WorldState } from "./worldSpec";
import type { MutableRefObject } from "react";

type Station = {
  root: T.Group;
  sculpture: T.Group;
  orbit: T.Group;
  satellites: T.Mesh[];
  layers: T.Group[];
  hit: T.Mesh;
};

export async function createWorld(
  canvas: HTMLCanvasElement,
  state: MutableRefObject<WorldState>,
  ready: () => void,
  failure: () => void,
  interact: () => void,
): Promise<() => void> {
  let renderer: T.WebGLRenderer;
  try {
    renderer = new T.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
  } catch {
    failure();
    return () => {};
  }
  let disposed = false;
  let frame = 0;
  let previous = performance.now();
  let ambient = 0;
  let smooth = state.current.exact;
  let interaction = 0;
  let pointerDirty = true;
  let hovered = false;
  let lastRemix = -1;
  let slowFrames = 0;
  let quality = 1;
  let mobile = innerWidth < 800;
  const timings: number[] = [];
  const scene = new T.Scene();
  const ink = new T.Color("#101115");
  scene.background = ink;
  scene.fog = new T.FogExp2(ink, 0.025);
  renderer.outputColorSpace = T.SRGBColorSpace;
  renderer.toneMapping = T.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.96;
  const camera = new T.PerspectiveCamera(
    43,
    innerWidth / innerHeight,
    0.1,
    105,
  );
  const pmrem = new T.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const environment = pmrem.fromScene(room, 0.04);
  scene.environment = environment.texture;
  scene.environmentIntensity = 0.65;
  room.dispose();
  pmrem.dispose();
  const key = new T.DirectionalLight("#ffffff", 3.2);
  key.position.set(-5, 9, 10);
  scene.add(key, new T.HemisphereLight("#cbd5ff", "#292531", 1.5));
  const rim = new T.PointLight("#b49aff", 80, 32, 2);
  scene.add(rim);
  const world = new T.Group();
  world.name = "playground-world";
  scene.add(world);
  const polymer = new T.MeshStandardMaterial({
    color: "#a98aff",
    roughness: 0.28,
    metalness: 0,
  });
  const lime = new T.MeshStandardMaterial({
    color: "#d5ff5f",
    roughness: 0.3,
    metalness: 0,
  });
  const coral = new T.MeshStandardMaterial({
    color: "#ff997b",
    roughness: 0.32,
    metalness: 0,
  });
  const chrome = new T.MeshStandardMaterial({
    color: "#e5e8ec",
    roughness: 0.17,
    metalness: 1,
  });
  const chassis = new T.MeshStandardMaterial({
    color: "#282931",
    roughness: 0.5,
    metalness: 0.8,
  });
  const dark = new T.MeshStandardMaterial({
    color: "#16171d",
    roughness: 0.68,
  });
  const white = new T.MeshBasicMaterial({
    color: "#f1f0e8",
    toneMapped: false,
  });
  const accents = [polymer, lime, polymer, coral, polymer, lime];
  const sphereGeo = new T.SphereGeometry(1, 24, 16);
  const cubeGeo = new RoundedBoxGeometry(1, 1, 1, 2, 0.13);
  const textures = new Set<T.Texture>();
  const materials = new Set<T.Material>([
    polymer,
    lime,
    coral,
    chrome,
    chassis,
    dark,
    white,
  ]);
  const geometries = new Set<T.BufferGeometry>([sphereGeo, cubeGeo]);
  const pendingTextures = new Map<string, T.Texture>();
  const loader = new T.TextureLoader();

  function mesh(
    geometry: T.BufferGeometry,
    material: T.Material,
    parent: T.Object3D,
    position: number[] = [0, 0, 0],
  ) {
    geometries.add(geometry);
    materials.add(material);
    const result = new T.Mesh(geometry, material);
    result.position.set(position[0], position[1], position[2]);
    parent.add(result);
    return result;
  }
  function torus(
    parent: T.Object3D,
    radius: number,
    tube: number,
    material: T.Material,
    position?: number[],
  ) {
    return mesh(
      new T.TorusGeometry(radius, tube, 12, 80),
      material,
      parent,
      position,
    );
  }
  function labelTexture(title: string, subtitle: string, accent: string) {
    const surface = document.createElement("canvas");
    surface.width = 1024;
    surface.height = 512;
    const ctx = surface.getContext("2d")!;
    ctx.fillStyle = "#1e2025";
    ctx.fillRect(0, 0, 1024, 512);
    ctx.strokeStyle = "#3d4048";
    ctx.lineWidth = 2;
    for (let x = 24; x < 1024; x += 48) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 512);
      ctx.stroke();
    }
    for (let y = 24; y < 512; y += 48) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1024, y);
      ctx.stroke();
    }
    ctx.fillStyle = accent;
    ctx.fillRect(50, 58, 46, 46);
    ctx.font = "bold 58px sans-serif";
    ctx.fillText(title, 50, 230);
    ctx.font = "24px monospace";
    ctx.fillStyle = "#f1f0e8";
    ctx.fillText(subtitle, 50, 300);
    ctx.strokeStyle = accent;
    ctx.strokeRect(740, 140, 150, 150);
    ctx.strokeRect(790, 190, 150, 150);
    const texture = new T.CanvasTexture(surface);
    texture.colorSpace = T.SRGBColorSpace;
    textures.add(texture);
    return texture;
  }
  function screenTexture(url: string, material: T.MeshBasicMaterial) {
    const texture = loader.load(
      url,
      (loaded) => {
        if (disposed) {
          loaded.dispose();
          return;
        }
        material.map = loaded;
        material.needsUpdate = true;
      },
      undefined,
      () => {
        /* A labelled circuit panel remains if a screenshot fails. */
      },
    );
    texture.colorSpace = T.SRGBColorSpace;
    texture.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
    textures.add(texture);
    pendingTextures.set(url, texture);
  }
  function screen(
    parent: T.Group,
    url: string,
    accent: string,
    notes: [string, string][],
  ) {
    const layers: T.Group[] = [];
    for (let i = 0; i < 3; i++) {
      const layer = new T.Group();
      parent.add(layer);
      layers.push(layer);
      mesh(
        new RoundedBoxGeometry(8.2, 4.8, 0.22, 2, 0.13),
        i === 0 ? chassis : dark,
        layer,
      );
      const material = new T.MeshBasicMaterial({
        map: labelTexture(notes[i][0], notes[i][1], accent),
        toneMapped: false,
      });
      const face = mesh(
        new T.PlaneGeometry(7.8, 4.39),
        material,
        layer,
        [0, 0, 0.125],
      );
      if (i === 0) screenTexture(url, material);
      face.userData.isScreen = true;
      for (const x of [-3.94, 3.94])
        mesh(sphereGeo, chrome, layer, [x, 2.22, 0.14]).scale.setScalar(0.045);
      const edge = mesh(
        new T.BoxGeometry(5.4, 0.045, 0.03),
        new T.MeshBasicMaterial({ color: accent }),
        layer,
        [0, -2.28, 0.13],
      );
      edge.name = "status-strip";
    }
    return layers;
  }
  function star(parent: T.Group, material: T.Material, size = 1.5) {
    const shape = new T.Shape();
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      const radius = i % 2 === 0 ? size : size * 0.52;
      if (i === 0)
        shape.moveTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
      else shape.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
    }
    shape.closePath();
    return mesh(
      new T.ExtrudeGeometry(shape, {
        depth: 0.42,
        bevelEnabled: true,
        bevelSegments: 3,
        steps: 1,
        bevelSize: 0.12,
        bevelThickness: 0.12,
      }),
      material,
      parent,
    );
  }

  const stations: Station[] = chapters.map((chapter, index) => {
    const root = new T.Group();
    root.name = chapter.id;
    root.position.fromArray(chapter.center);
    world.add(root);
    const sculpture = new T.Group();
    root.add(sculpture);
    const orbit = new T.Group();
    root.add(orbit);
    const accent = accents[index];
    const satellites: T.Mesh[] = [];
    let layers: T.Group[] = [];
    if (index === 0 || index === 5) {
      const portal = torus(sculpture, 3.4, 0.65, accent);
      portal.rotation.set(0.14, -0.35, -0.26);
      const rail = torus(sculpture, 4.38, 0.035, chrome);
      rail.rotation.set(0.32, -0.45, -0.5);
      const inner = torus(sculpture, 2.62, 0.035, lime);
      inner.rotation.copy(portal.rotation);
      if (index === 0) {
        const knot = mesh(
          new T.TorusKnotGeometry(1.32, 0.43, 100, 12, 2, 3),
          chrome,
          sculpture,
          [0, 0, 0.1],
        );
        knot.rotation.x = 0.45;
        knot.name = "core";
        const slash = mesh(
          new RoundedBoxGeometry(1, 1, 1, 2, 0.13),
          lime,
          sculpture,
          [3.3, -2.05, 1.2],
        );
        slash.scale.set(2, 0.75, 0.85);
        slash.rotation.set(0.3, -0.3, -0.5);
      } else {
        const spark = star(sculpture, chrome, 2.15);
        spark.name = "core";
      }
      for (let i = 0; i < 7; i++) {
        const satellite = mesh(
          i % 2 ? cubeGeo : sphereGeo,
          i % 3 === 0 ? chrome : i % 2 ? lime : polymer,
          orbit,
        );
        satellite.scale.setScalar(i === 0 ? 0.65 : 0.18 + i * 0.045);
        satellites.push(satellite);
      }
    } else if (index < 4) {
      layers = screen(
        sculpture,
        [
          "",
          "/projects/dealify.webp",
          "/projects/wealthsnaps.png",
          "/projects/studyflow.webp",
        ][index],
        chapter.accent,
        index === 1
          ? [
              ["THE STOREFRONT", "SHOPIFY / CHAT WITH THE SHOP"],
              ["THE CONVERSATION", "AI HANDLES THE DIALOGUE"],
              ["THE PRICING ENGINE", "TYPESCRIPT CHECKS EVERY OFFER"],
            ]
          : index === 2
            ? [
                ["THE INTERFACE", "REACT / MARKET EXPLORATION"],
                ["PREDICTION MODEL", "PYTHON / EXPERIMENTAL OUTPUTS"],
                ["THE DATA LAYER", "SUPABASE / APPLICATION DATA"],
              ]
            : [
                ["THE WORKSPACE", "REACT / GOALS & CALENDARS"],
                ["FOCUS SESSIONS", "POMODORO / SESSION TIMER"],
                ["LEARNING ANALYTICS", "RECHARTS / SESSION HISTORY"],
              ],
      );
      const halo = torus(
        orbit,
        index === 2 ? 5.1 : 5.35,
        index === 3 ? 0.14 : 0.026,
        accent,
      );
      halo.rotation.set(
        index === 3 ? 0.14 : 0.68,
        index === 2 ? 0.4 : -0.35,
        0.2,
      );
      if (index === 2) {
        const second = torus(orbit, 5.35, 0.055, chrome);
        second.rotation.set(-0.62, 0.5, -0.4);
        for (let i = 0; i < 16; i++) {
          const point = mesh(sphereGeo, i % 4 === 0 ? chrome : accent, orbit);
          point.scale.setScalar(i % 4 === 0 ? 0.34 : 0.12);
          satellites.push(point);
        }
      } else if (index === 3) {
        for (let i = 0; i < 36; i++) {
          const tick = mesh(cubeGeo, i % 3 === 0 ? chrome : accent, orbit);
          tick.scale.set(
            i % 3 === 0 ? 0.12 : 0.07,
            i % 3 === 0 ? 0.55 : 0.24,
            0.12,
          );
          satellites.push(tick);
        }
      } else {
        for (let i = 0; i < 8; i++) {
          const block = mesh(cubeGeo, i % 3 === 0 ? chrome : accent, orbit);
          block.scale.setScalar(0.22 + (i % 3) * 0.15);
          satellites.push(block);
        }
      }
    } else {
      mesh(new RoundedBoxGeometry(4.35, 5.5, 0.24, 2, 0.18), chrome, sculpture);
      const portrait = new T.MeshBasicMaterial({
        map: labelTexture(
          "RITVIK GOYAL",
          "SHOPIFY / YORK UNIVERSITY",
          chapter.accent,
        ),
        toneMapped: false,
      });
      screenTexture("/forma/ritvik-painted-graded.webp", portrait);
      mesh(new T.PlaneGeometry(4, 5), portrait, sculpture, [0, 0, 0.14]);
      torus(orbit, 4.4, 0.035, chrome).rotation.set(0.45, -0.5, -0.2);
      for (let i = 0; i < 4; i++) {
        const point = mesh(
          i % 2 ? cubeGeo : sphereGeo,
          i % 2 ? lime : polymer,
          orbit,
        );
        point.scale.setScalar(0.42);
        satellites.push(point);
      }
    }
    // Deliberately simple interaction proxy; essential controls are mirrored in HTML.
    const hit = mesh(
      new T.SphereGeometry(4.7, 10, 8),
      new T.MeshBasicMaterial({ visible: false }),
      root,
    );
    hit.userData.chapter = index;
    const base = torus(
      root,
      5.2,
      0.018,
      new T.MeshBasicMaterial({
        color: "#4a4b53",
        transparent: true,
        opacity: 0.45,
      }),
      [0, -4.4, 0],
    );
    base.rotation.x = Math.PI / 2;
    return { root, sculpture, orbit, satellites, layers, hit };
  });

  // Two continuous rails join the sets, making forward/backward travel spatially legible.
  const railPoints = chapters.map(
    (chapter) => new T.Vector3(chapter.center[0], -5.5, chapter.center[2]),
  );
  for (const side of [-1, 1]) {
    const curve = new T.CatmullRomCurve3(
      railPoints.map((point) =>
        point.clone().add(new T.Vector3(side * 6.5, 0, 0)),
      ),
    );
    mesh(
      new T.TubeGeometry(curve, 120, 0.028, 5, false),
      new T.MeshBasicMaterial({ color: "#50515a" }),
      world,
    );
  }
  const grid = new T.GridHelper(180, 90, "#292b32", "#1c1e24");
  grid.position.set(0, -5.6, -65);
  world.add(grid);
  geometries.add(grid.geometry);
  (Array.isArray(grid.material) ? grid.material : [grid.material]).forEach(
    (m) => materials.add(m),
  );

  const pointer = new T.Vector2(0, 0);
  const pointerSmooth = new T.Vector2(0, 0);
  const raycaster = new T.Raycaster();
  const positionA = new T.Vector3(),
    positionB = new T.Vector3(),
    targetA = new T.Vector3(),
    targetB = new T.Vector3();
  const target = new T.Vector3();
  function size() {
    mobile = innerWidth < 800;
    renderer.setPixelRatio(
      Math.min(devicePixelRatio, (mobile ? 1.25 : 1.5) * quality),
    );
    renderer.setSize(innerWidth, innerHeight, false);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
  }
  size();
  function move(event: PointerEvent) {
    if (event.pointerType !== "mouse") return;
    pointer.set(
      (event.clientX / innerWidth) * 2 - 1,
      -(event.clientY / innerHeight) * 2 + 1,
    );
    pointerDirty = true;
  }
  function leave() {
    pointer.set(0, 0);
    hovered = false;
    state.current.hover = false;
    canvas.style.cursor = "";
  }
  function click(event: MouseEvent) {
    if (event.target !== canvas) return;
    pointer.set(
      (event.clientX / innerWidth) * 2 - 1,
      -(event.clientY / innerHeight) * 2 + 1,
    );
    raycaster.setFromCamera(pointer, camera);
    const active = state.current.active;
    if (
      Math.abs(state.current.exact - active) < 0.3 &&
      raycaster.intersectObject(stations[active].hit).length
    )
      interact();
  }
  const palettes = [
    ["#a98aff", "#d5ff5f", "#ff997b"],
    ["#72c9ff", "#ffb3d9", "#dfef86"],
    ["#ff9278", "#b5a0ff", "#c0ff75"],
  ];
  function render(now: number) {
    if (disposed) return;
    frame = 0;
    const elapsed = now - previous;
    const dt = Math.min(elapsed / 1000, 1 / 30);
    previous = now;
    const current = state.current;
    if (document.hidden) return;
    if (!current.visible) return;
    ambient += dt;
    smooth += (current.exact - smooth) * (1 - Math.exp(-7 * dt));
    const index = Math.min(chapters.length - 1, Math.floor(smooth));
    const next = Math.min(chapters.length - 1, index + 1);
    const t = smoothstep(0.16, 0.88, smooth - index);
    const a = chapters[index],
      b = chapters[next];
    positionA.fromArray(mobile ? a.mobileCamera : a.camera);
    positionB.fromArray(mobile ? b.mobileCamera : b.camera);
    targetA.fromArray(mobile ? a.mobileTarget : a.target);
    targetB.fromArray(mobile ? b.mobileTarget : b.target);
    camera.position.lerpVectors(positionA, positionB, t);
    // The opening move crosses the portal aperture, then returns to the path.
    if (index === 0) camera.position.x += Math.sin(t * Math.PI) * 3;
    target.lerpVectors(targetA, targetB, t);
    pointerSmooth.lerp(pointer, 1 - Math.exp(-4 * dt));
    if (!mobile) {
      camera.position.x += pointerSmooth.x * 0.12;
      camera.position.y += pointerSmooth.y * 0.08;
    }
    camera.fov = (mobile ? 50 : a.fov) + (mobile ? 0 : b.fov - a.fov) * t;
    camera.updateProjectionMatrix();
    camera.lookAt(target);
    rim.position.copy(camera.position).add(new T.Vector3(8, 4, -12));
    key.position.copy(camera.position).add(new T.Vector3(-8, 10, 5));
    key.target.position.copy(target);
    key.target.updateMatrixWorld();
    if (lastRemix !== current.remix) {
      const colors = palettes[current.remix % palettes.length];
      polymer.color.set(colors[0]);
      lime.color.set(colors[1]);
      coral.color.set(colors[2]);
      lastRemix = current.remix;
    }
    interaction +=
      ((current.experiment ? 1 : 0) - interaction) * (1 - Math.exp(-6 * dt));
    stations.forEach((station, i) => {
      station.root.visible = Math.abs(smooth - i) < 1.65;
      if (!station.root.visible) return;
      const focus = Math.max(0, 1 - Math.abs(smooth - i));
      const effect = i === current.active ? interaction : 0;
      const journeyTurn = clamp(smooth - i, -0.8, 0.8);
      const clock = ambient * 0.12 + current.remix * 0.4;
      station.sculpture.rotation.set(
        Math.sin(ambient * 0.35 + i) * 0.035 - 0.05,
        -0.12 + journeyTurn * 0.65 + (!mobile ? pointerSmooth.x * 0.035 : 0),
        -0.07 + Math.sin(ambient * 0.2 + i) * 0.025,
      );
      station.sculpture.position.y = Math.sin(ambient * 0.6 + i) * 0.11;
      if (i === 0 || i === 5) {
        station.sculpture.rotation.z = -0.12 + smooth * 0.35;
        const core = station.sculpture.getObjectByName("core");
        if (core) {
          core.rotation.y = clock + effect * 1.5;
          core.rotation.z = clock * 0.6;
        }
      }
      if (station.layers.length) {
        station.layers.forEach((layer, j) => {
          const automatic = (1 - focus) * 0.9;
          const spread = effect + automatic;
          layer.position.set(
            j * spread * 0.6,
            -j * spread * 1.35,
            -j * (0.28 + spread * 1.6),
          );
          layer.rotation.x = -0.06 - j * spread * 0.1;
        });
      }
      station.orbit.rotation.z =
        i === 3
          ? effect * 2 + journeyTurn * 0.8
          : clock * 0.22 + journeyTurn * 0.28;
      station.satellites.forEach((satellite, j) => {
        const angle =
          (j / station.satellites.length) * Math.PI * 2 +
          (i === 3 ? 0 : clock * 0.3);
        const radius =
          (i === 0 || i === 5 ? 4.8 : i === 4 ? 4.2 : 5.3) +
          effect * (i === 2 ? ((j % 3) + 1) * 0.7 : 0.45);
        satellite.position.set(
          Math.cos(angle) * radius,
          Math.sin(angle) * radius * (i === 3 ? 1 : 0.74),
          Math.sin(angle * 2 + i) * (i === 2 ? 1.7 + effect : 0.85),
        );
        if (i === 3) satellite.rotation.z = -angle + Math.PI / 2;
        else satellite.rotation.set(clock + j, clock * 0.7, angle);
      });
      station.root.scale.setScalar(
        1 + (i === current.active && (current.hover || hovered) ? 0.012 : 0),
      );
    });
    if (pointerDirty || Math.abs(smooth - current.exact) > 0.005) {
      raycaster.setFromCamera(pointer, camera);
      hovered =
        Math.abs(current.exact - current.active) < 0.3 &&
        raycaster.intersectObject(stations[current.active].hit).length > 0;
      canvas.style.cursor = hovered ? "pointer" : "";
      pointerDirty = false;
    }
    renderer.render(scene, camera);
    // Diagnostics describe this runtime, never extrapolate to a physical phone.
    if (ambient > 1 && elapsed < 150) {
      timings.push(elapsed);
      if (timings.length > 240) timings.shift();
      slowFrames = elapsed > 26 ? slowFrames + 1 : Math.max(0, slowFrames - 2);
      if (slowFrames > 100 && quality > 0.7) {
        quality = 0.7;
        size();
        slowFrames = 0;
      }
    }
    canvas.dataset.progress = smooth.toFixed(4);
    if (import.meta.env.DEV || location.search.includes("world-debug")) {
      canvas.dataset.calls = String(renderer.info.render.calls);
      canvas.dataset.triangles = String(renderer.info.render.triangles);
      canvas.dataset.textures = String(renderer.info.memory.textures);
      canvas.dataset.quality = String(quality);
      if (timings.length) {
        const sorted = [...timings].sort((x, y) => x - y);
        canvas.dataset.frameMedian =
          sorted[Math.floor(sorted.length / 2)].toFixed(1);
        canvas.dataset.frameP95 =
          sorted[Math.floor(sorted.length * 0.95)].toFixed(1);
      }
    }
    frame = requestAnimationFrame(render);
  }
  function resume() {
    if (!disposed && !document.hidden && !frame) {
      previous = performance.now();
      frame = requestAnimationFrame(render);
    }
  }
  function visibility() {
    if (document.hidden) {
      cancelAnimationFrame(frame);
      frame = 0;
    } else resume();
  }
  function lost(event: Event) {
    event.preventDefault();
    cancelAnimationFrame(frame);
    frame = 0;
    failure();
  }
  window.addEventListener("resize", size);
  window.addEventListener("pointermove", move, { passive: true });
  window.addEventListener("scroll", resume, { passive: true });
  canvas.addEventListener("pointerleave", leave);
  canvas.addEventListener("click", click);
  canvas.addEventListener("webglcontextlost", lost);
  document.addEventListener("visibilitychange", visibility);
  // Warm the composed first frame before hiding its poster.
  render(performance.now());
  ready();
  return () => {
    disposed = true;
    cancelAnimationFrame(frame);
    window.removeEventListener("resize", size);
    window.removeEventListener("pointermove", move);
    window.removeEventListener("scroll", resume);
    canvas.removeEventListener("pointerleave", leave);
    canvas.removeEventListener("click", click);
    canvas.removeEventListener("webglcontextlost", lost);
    document.removeEventListener("visibilitychange", visibility);
    geometries.forEach((item) => item.dispose());
    materials.forEach((item) => item.dispose());
    textures.forEach((item) => item.dispose());
    environment.dispose();
    renderer.dispose();
    pendingTextures.clear();
  };
}
