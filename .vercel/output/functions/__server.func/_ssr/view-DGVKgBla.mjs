import { n as LAMPS, r as VISUALS } from "./house-9LOLfGd4.mjs";
import { S as Vector3, _ as PointLight, a as CircleGeometry, b as SphereGeometry, c as DirectionalLight, d as HemisphereLight, f as Mesh, g as PerspectiveCamera, h as Object3D, i as CapsuleGeometry, l as FogExp2, m as MeshLambertMaterial, n as AmbientLight, o as Color, p as MeshBasicMaterial, r as BoxGeometry, s as CylinderGeometry, t as WebGLRenderer, u as Group, v as SRGBColorSpace, x as SpotLight, y as Scene } from "../_libs/three.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/view-DGVKgBla.js
/** Three.js view of Larkspur. The sim owns yaw/pitch; this only draws them.
*  Camera rotation.y = yaw, rotation.x = pitch (order YXZ) so look direction
*  matches basis() in logic.ts: yaw 0 looks down world -Z.
*/
function makeMaterial(v, cache) {
	const key = `${v.glow ? "g" : "l"}:${v.color}`;
	const cached = cache.get(key);
	if (cached) return cached;
	const mat = v.glow ? new MeshBasicMaterial({ color: v.color }) : new MeshLambertMaterial({ color: v.color });
	cache.set(key, mat);
	return mat;
}
function makeMesh(v, mat) {
	if (v.t === "cyl") {
		const mesh = new Mesh(new CylinderGeometry(v.r ?? .3, v.r ?? .3, v.h, 16), mat);
		mesh.position.set(v.x, v.y, v.z);
		return mesh;
	}
	const mesh = new Mesh(new BoxGeometry(v.w, v.h, v.d), mat);
	mesh.position.set(v.x, v.y, v.z);
	return mesh;
}
function makePerson(coat) {
	const group = new Group();
	const cloth = new MeshLambertMaterial({ color: coat });
	const skin = new MeshLambertMaterial({ color: 15782580 });
	const body = new Mesh(new CapsuleGeometry(.28, .86, 4, 10), cloth);
	body.position.y = .71;
	const head = new Mesh(new SphereGeometry(.2, 14, 12), skin);
	head.position.y = 1.52;
	group.add(body, head);
	return group;
}
function makeViewmodel() {
	const root = new Group();
	const lamp = new Group();
	const brass = new MeshBasicMaterial({ color: 14721610 });
	const dark = new MeshBasicMaterial({ color: 2761756 });
	const body = new Mesh(new BoxGeometry(.08, .08, .28), dark);
	const head = new Mesh(new CylinderGeometry(.07, .06, .1, 12), brass);
	head.rotation.x = Math.PI / 2;
	head.position.z = -.18;
	const lens = new Mesh(new CircleGeometry(.045, 12), new MeshBasicMaterial({ color: 16773580 }));
	lens.position.z = -.23;
	lamp.add(body, head, lens);
	lamp.position.set(.28, -.28, -.55);
	const hands = new Group();
	const glove = new MeshBasicMaterial({ color: 4862004 });
	const left = new Mesh(new BoxGeometry(.08, .06, .12), glove);
	left.position.set(-.22, -.3, -.45);
	const right = left.clone();
	right.position.x = .22;
	hands.add(left, right);
	root.add(lamp, hands);
	return {
		root,
		lamp,
		hands
	};
}
function createView(canvas) {
	const renderer = new WebGLRenderer({
		canvas,
		antialias: true,
		alpha: false,
		powerPreference: "high-performance"
	});
	if (!renderer.getContext()) throw new Error("WebGL is not available in this browser.");
	renderer.outputColorSpace = SRGBColorSpace;
	renderer.toneMapping = 4;
	renderer.toneMappingExposure = 1.05;
	renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
	renderer.autoClear = false;
	const scene = new Scene();
	scene.background = new Color("#10161b");
	scene.fog = new FogExp2("#10161b", .02);
	const camera = new PerspectiveCamera(72, 1, .08, 80);
	camera.rotation.order = "YXZ";
	scene.add(new HemisphereLight(12043990, 2760984, .72));
	scene.add(new AmbientLight(2761756, .35));
	const moon = new DirectionalLight(12965098, .55);
	moon.position.set(-8, 18, -6);
	scene.add(moon);
	for (const lamp of LAMPS) {
		const light = new PointLight(lamp.color, lamp.intensity, lamp.distance, 2);
		light.position.set(lamp.x, lamp.y, lamp.z);
		scene.add(light);
		const bulb = new Mesh(new SphereGeometry(.08, 10, 8), new MeshBasicMaterial({ color: lamp.color }));
		bulb.position.copy(light.position);
		scene.add(bulb);
	}
	const matCache = /* @__PURE__ */ new Map();
	const doorMeshes = [];
	for (const v of VISUALS) {
		const mesh = makeMesh(v, makeMaterial(v, matCache));
		if (v.hideOnly) doorMeshes.push(mesh);
		scene.add(mesh);
	}
	const hider = makePerson(6038580);
	const seeker = makePerson(14135418);
	const brim = new Mesh(new CylinderGeometry(.26, .26, .06, 14), new MeshLambertMaterial({ color: 14721610 }));
	brim.position.y = 1.7;
	seeker.add(brim);
	const otherRoot = new Group();
	otherRoot.add(hider, seeker);
	otherRoot.visible = false;
	scene.add(otherRoot);
	const remotePivot = new Group();
	remotePivot.rotation.order = "YXZ";
	const remoteSpot = new SpotLight(16773586, 0, 22, .52, .42, 2);
	const remoteTarget = new Object3D();
	remoteTarget.position.set(0, 0, -1);
	remotePivot.add(remoteSpot);
	remotePivot.add(remoteTarget);
	remoteSpot.target = remoteTarget;
	scene.add(remotePivot);
	const localSpot = new SpotLight(16774102, 0, 24, .5, .4, 2);
	const localTarget = new Object3D();
	localTarget.position.set(.05, -.08, -1);
	localSpot.position.set(.12, -.08, 0);
	camera.add(localSpot);
	camera.add(localTarget);
	localSpot.target = localTarget;
	scene.add(camera);
	const vmScene = new Scene();
	const vmCam = new PerspectiveCamera(72, 1, .05, 10);
	const vm = makeViewmodel();
	vmScene.add(vm.root);
	const lookVec = new Vector3();
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
			return {
				x: lookVec.x,
				y: lookVec.y,
				z: lookVec.z
			};
		},
		render: (frame) => {
			for (const door of doorMeshes) door.visible = frame.doorClosed;
			const bob = Math.sin(frame.walk) * (frame.crouch ? .012 : .03);
			const shake = frame.shake;
			camera.position.set(frame.x + Math.sin(frame.walk * 17) * shake * .05, frame.eye + bob + Math.cos(frame.walk * 21) * shake * .03, frame.z);
			camera.rotation.y = frame.yaw;
			camera.rotation.x = frame.pitch;
			localSpot.intensity = frame.flashlight ? 220 : 0;
			if (frame.other) {
				otherRoot.visible = true;
				otherRoot.position.set(frame.other.x, 0, frame.other.z);
				otherRoot.rotation.y = frame.other.yaw + Math.PI;
				const crouched = frame.other.crouch;
				otherRoot.scale.set(1, crouched ? .62 : 1, 1);
				hider.visible = frame.other.role === "hider";
				seeker.visible = frame.other.role === "seeker";
				remotePivot.position.set(frame.other.x, crouched ? .9 : 1.48, frame.other.z);
				remotePivot.rotation.y = frame.other.yaw;
				remotePivot.rotation.x = frame.other.pitch;
				remoteSpot.intensity = frame.other.flash ? 200 : 0;
			} else {
				otherRoot.visible = false;
				remoteSpot.intensity = 0;
			}
			vm.lamp.visible = frame.flashlight;
			vm.hands.visible = !frame.flashlight;
			vm.root.position.y = Math.sin(frame.walk * 2) * .008;
			vm.root.rotation.z = Math.sin(frame.walk) * .02;
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
				obj.geometry?.dispose();
			});
			for (const mat of matCache.values()) mat.dispose();
			renderer.dispose();
		}
	};
}
//#endregion
export { createView };
