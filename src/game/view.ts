/** Three.js view of Larkspur. The sim owns yaw/pitch; this only draws them.
 *  Camera rotation.y = yaw, rotation.x = pitch (order YXZ) so look direction
 *  matches basis() in logic.ts: yaw 0 looks down world -Z.
 */

import * as THREE from "three";
import { LAMPS, VISUALS, type Visual } from "./world";
import type { Role } from "./types";

export type OtherDraw = {
  x: number;
  z: number;
  yaw: number;
  pitch: number;
  crouch: boolean;
  role: Role;
  flash: boolean;
};

export type ViewFrame = {
  x: number;
  z: number;
  yaw: number;
  pitch: number;
  eye: number;
  walk: number;
  shake: number;
  crouch: boolean;
  flashlight: boolean;
  doorClosed: boolean;
  other: OtherDraw | null;
};

export type View = {
  render: (frame: ViewFrame) => void;
  look: () => { x: number; y: number; z: number };
  dispose: () => void;
};

function makeMaterial(v: Visual, cache: Map<string, THREE.Material>): THREE.Material {
  const key = `${v.glow ? "g" : "l"}:${v.color}`;
  const cached = cache.get(key);
  if (cached) return cached;
  const mat = v.glow
    ? new THREE.MeshBasicMaterial({ color: v.color })
    : new THREE.MeshLambertMaterial({ color: v.color });
  cache.set(key, mat);
  return mat;
}

function makeMesh(v: Visual, mat: THREE.Material): THREE.Mesh {
  if (v.t === "cyl") {
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(v.r ?? 0.3, v.r ?? 0.3, v.h, 16), mat);
    mesh.position.set(v.x, v.y, v.z);
    return mesh;
  }
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(v.w, v.h, v.d), mat);
  mesh.position.set(v.x, v.y, v.z);
  return mesh;
}

function makePerson(coat: number): THREE.Group {
  const group = new THREE.Group();
  const cloth = new THREE.MeshLambertMaterial({ color: coat });
  const skin = new THREE.MeshLambertMaterial({ color: 0xf0d2b4 });
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.28, 0.86, 4, 10), cloth);
  body.position.y = 0.71;
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.2, 14, 12), skin);
  head.position.y = 1.52;
  group.add(body, head);
  return group;
}

function makeViewmodel(): { root: THREE.Group; lamp: THREE.Group; hands: THREE.Group } {
  const root = new THREE.Group();
  const lamp = new THREE.Group();
  const brass = new THREE.MeshBasicMaterial({ color: 0xe0a24a });
  const dark = new THREE.MeshBasicMaterial({ color: 0x2a241c });
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.28), dark);
  const head = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.06, 0.1, 12), brass);
  head.rotation.x = Math.PI / 2;
  head.position.z = -0.18;
  const lens = new THREE.Mesh(new THREE.CircleGeometry(0.045, 12), new THREE.MeshBasicMaterial({ color: 0xfff1cc }));
  lens.position.z = -0.23;
  lamp.add(body, head, lens);
  lamp.position.set(0.28, -0.28, -0.55);
  const hands = new THREE.Group();
  const glove = new THREE.MeshBasicMaterial({ color: 0x4a3034 });
  const left = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.06, 0.12), glove);
  left.position.set(-0.22, -0.3, -0.45);
  const right = left.clone();
  right.position.x = 0.22;
  hands.add(left, right);
  root.add(lamp, hands);
  return { root, lamp, hands };
}

export function createView(canvas: HTMLCanvasElement): View {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    powerPreference: "high-performance",
  });
  if (!renderer.getContext()) throw new Error("WebGL is not available in this browser.");
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
  renderer.autoClear = false;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#10161b");
  scene.fog = new THREE.FogExp2("#10161b", 0.02);

  const camera = new THREE.PerspectiveCamera(72, 1, 0.08, 80);
  camera.rotation.order = "YXZ";

  scene.add(new THREE.HemisphereLight(0xb7c6d6, 0x2a2118, 0.72));
  scene.add(new THREE.AmbientLight(0x2a241c, 0.35));
  const moon = new THREE.DirectionalLight(0xc5d4ea, 0.55);
  moon.position.set(-8, 18, -6);
  scene.add(moon);

  for (const lamp of LAMPS) {
    const light = new THREE.PointLight(lamp.color, lamp.intensity, lamp.distance, 2);
    light.position.set(lamp.x, lamp.y, lamp.z);
    scene.add(light);
    const bulb = new THREE.Mesh(
      new THREE.SphereGeometry(0.08, 10, 8),
      new THREE.MeshBasicMaterial({ color: lamp.color }),
    );
    bulb.position.copy(light.position);
    scene.add(bulb);
  }

  const matCache = new Map<string, THREE.Material>();
  const doorMeshes: THREE.Mesh[] = [];
  for (const v of VISUALS) {
    const mesh = makeMesh(v, makeMaterial(v, matCache));
    if (v.hideOnly) doorMeshes.push(mesh);
    scene.add(mesh);
  }

  const hider = makePerson(0x5c2434);
  const seeker = makePerson(0xd7b07a);
  const brim = new THREE.Mesh(
    new THREE.CylinderGeometry(0.26, 0.26, 0.06, 14),
    new THREE.MeshLambertMaterial({ color: 0xe0a24a }),
  );
  brim.position.y = 1.7;
  seeker.add(brim);
  const otherRoot = new THREE.Group();
  otherRoot.add(hider, seeker);
  otherRoot.visible = false;
  scene.add(otherRoot);

  // Remote seeker's beam so the hider can see the hunt coming.
  const remotePivot = new THREE.Group();
  remotePivot.rotation.order = "YXZ";
  const remoteSpot = new THREE.SpotLight(0xfff1d2, 0, 22, 0.52, 0.42, 2);
  const remoteTarget = new THREE.Object3D();
  remoteTarget.position.set(0, 0, -1);
  remotePivot.add(remoteSpot);
  remotePivot.add(remoteTarget);
  remoteSpot.target = remoteTarget;
  scene.add(remotePivot);

  const localSpot = new THREE.SpotLight(0xfff3d6, 0, 24, 0.5, 0.4, 2);
  const localTarget = new THREE.Object3D();
  localTarget.position.set(0.05, -0.08, -1);
  localSpot.position.set(0.12, -0.08, 0);
  camera.add(localSpot);
  camera.add(localTarget);
  localSpot.target = localTarget;
  scene.add(camera);

  const vmScene = new THREE.Scene();
  const vmCam = new THREE.PerspectiveCamera(72, 1, 0.05, 10);
  const vm = makeViewmodel();
  vmScene.add(vm.root);

  const lookVec = new THREE.Vector3();

  function resize() {
    const w = canvas.clientWidth || 1;
    const h = canvas.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / Math.max(1, h);
    camera.updateProjectionMatrix();
    vmCam.aspect = camera.aspect;
    vmCam.updateProjectionMatrix();
  }
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  resize();

  return {
    look: () => {
      camera.getWorldDirection(lookVec);
      return { x: lookVec.x, y: lookVec.y, z: lookVec.z };
    },
    render: (frame) => {
      for (const door of doorMeshes) door.visible = frame.doorClosed;
      const bob = Math.sin(frame.walk) * (frame.crouch ? 0.012 : 0.03);
      const shake = frame.shake;
      camera.position.set(
        frame.x + Math.sin(frame.walk * 17) * shake * 0.05,
        frame.eye + bob + Math.cos(frame.walk * 21) * shake * 0.03,
        frame.z,
      );
      camera.rotation.y = frame.yaw;
      camera.rotation.x = frame.pitch;
      localSpot.intensity = frame.flashlight ? 220 : 0;

      if (frame.other) {
        otherRoot.visible = true;
        otherRoot.position.set(frame.other.x, 0, frame.other.z);
        // Mesh faces +Z; yaw 0 should face -Z, so add half a turn.
        otherRoot.rotation.y = frame.other.yaw + Math.PI;
        const crouched = frame.other.crouch;
        otherRoot.scale.set(1, crouched ? 0.62 : 1, 1);
        hider.visible = frame.other.role === "hider";
        seeker.visible = frame.other.role === "seeker";
        remotePivot.position.set(frame.other.x, crouched ? 0.9 : 1.48, frame.other.z);
        remotePivot.rotation.y = frame.other.yaw;
        remotePivot.rotation.x = frame.other.pitch;
        remoteSpot.intensity = frame.other.flash ? 200 : 0;
      } else {
        otherRoot.visible = false;
        remoteSpot.intensity = 0;
      }

      vm.lamp.visible = frame.flashlight;
      vm.hands.visible = !frame.flashlight;
      vm.root.position.y = Math.sin(frame.walk * 2) * 0.008;
      vm.root.rotation.z = Math.sin(frame.walk) * 0.02;

      remotePivot.updateMatrixWorld(true);
      camera.updateMatrixWorld(true);

      renderer.setRenderTarget(null);
      renderer.clear(true, true, true);
      renderer.render(scene, camera);
      renderer.clearDepth();
      renderer.render(vmScene, vmCam);
    },
    dispose: () => {
      observer.disconnect();
      scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        mesh.geometry?.dispose();
      });
      for (const mat of matCache.values()) mat.dispose();
      renderer.dispose();
    },
  };
}
