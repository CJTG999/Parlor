import { o as __toESM } from "../_runtime.mjs";
import { K as require_jsx_runtime, q as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as useP2PRoom } from "./use-p2p-room-CtU6MI1f.mjs";
import { a as Play, c as Eye, d as ArrowLeft, i as Shuffle, l as EyeOff, r as Timer, s as Lamp, t as Users, u as Copy } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/house-9LOLfGd4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var WALL = "#5c6c74";
var FLOOR = "#6b4a30";
var STONE = "#3e4a46";
var CEIL = "#1c2126";
var WOOD = "#6d4b30";
var WOOD_D = "#3a2618";
var CLOTH = "#23443a";
var ROSE = "#7a3a48";
var HEDGE = "#1e5238";
var METAL = "#8c867a";
var BOOK = "#8a6840";
var BOOK2 = "#3e5560";
var WATER = "#1a4558";
var GLASS = "#d5e6ef";
var DOOR = "#2c241c";
var RUG = "#6e303c";
var visuals = [];
function box(x, y, z, w, h, d, color, blocks = true, extra) {
	visuals.push({
		t: "box",
		x,
		y,
		z,
		w,
		h,
		d,
		color,
		blocks,
		...extra
	});
}
function cyl(x, y, z, r, h, color, blocks = true, extra) {
	visuals.push({
		t: "cyl",
		x,
		y,
		z,
		w: r * 2,
		h,
		d: r * 2,
		r,
		color,
		blocks,
		...extra
	});
}
/** Wall running along Z, centered on x. */
function wallX(x, z1, z2) {
	box(x, 1.55, (z1 + z2) / 2, .32, 3.1, Math.abs(z2 - z1), WALL);
}
/** Wall running along X, centered on z. */
function wallZ(z, x1, x2) {
	box((x1 + x2) / 2, 1.55, z, Math.abs(x2 - x1), 3.1, .32, WALL);
}
wallX(-14.5, -11.5, 12.5);
wallX(14.5, -11.5, 12.5);
wallZ(-11.5, -14.5, 14.5);
wallZ(12.5, -14.5, 14.5);
wallX(-4, -11.5, -7.6);
wallX(-4, -5.9, .65);
wallX(-4, 2.35, 7.9);
wallX(-4, 9.6, 12.5);
wallX(4, -11.5, -7.6);
wallX(4, -5.9, .65);
wallX(4, 2.35, 7.9);
wallX(4, 9.6, 12.5);
wallZ(-2, -14.5, -10.1);
wallZ(-2, -8.4, -.85);
wallZ(-2, .85, 8.4);
wallZ(-2, 10.1, 14.5);
wallZ(5, -14.5, -10.1);
wallZ(5, -8.4, -.85);
wallZ(5, .85, 8.4);
wallZ(5, 10.1, 14.5);
wallX(2.32, 10.72, 12.5);
box(3.12, 1.25, 10.72, 1.3, 2.5, .16, DOOR, true, { hideOnly: true });
box(0, -.12, .5, 29.2, .24, 24.2, FLOOR, false);
box(0, .03, -6.75, 7.5, .06, 9, STONE, false);
box(-9.25, 3.12, -6.75, 10.1, .1, 9.1, CEIL, false);
box(9.25, 3.12, -6.75, 10.1, .1, 9.1, CEIL, false);
box(-9.25, 3.12, 1.5, 10.1, .1, 6.6, CEIL, false);
box(0, 3.12, 1.5, 7.5, .1, 6.6, CEIL, false);
box(9.25, 3.12, 1.5, 10.1, .1, 6.6, CEIL, false);
box(-9.25, 3.12, 8.75, 10.1, .1, 7.1, CEIL, false);
box(0, 3.12, 8.75, 7.5, .1, 7.1, CEIL, false);
box(9.25, 3.12, 8.75, 10.1, .1, 7.1, CEIL, false);
box(-9.2, 1.7, -11.28, 1.6, 1.1, .08, GLASS, false, { glow: true });
box(9.2, 1.7, -11.28, 1.8, 1.1, .08, GLASS, false, { glow: true });
box(-14.28, 1.7, 1.5, .08, 1.1, 1.4, GLASS, false, { glow: true });
box(14.28, 1.7, 8.6, .08, 1.2, 1.5, GLASS, false, { glow: true });
box(0, 1.6, 12.28, 1.4, 1.3, .08, GLASS, false, { glow: true });
box(-13.55, 1.1, -7.2, .5, 2.2, 2.6, WOOD_D);
box(-9.4, .4, -10.55, 2.3, .8, .8, WOOD);
box(-9.4, .45, -9.55, .55, .9, .55, ROSE, true);
box(-6.1, .35, -4.15, .7, .7, .7, WOOD_D);
box(-5.55, .28, -4.7, .55, .55, .55, WOOD);
box(-2.35, .61, -9.3, 1.7, 1.22, 1.45, HEDGE);
box(2.35, .61, -9.3, 1.7, 1.22, 1.45, HEDGE);
box(-2.35, .61, -4.55, 1.45, 1.22, 1.25, HEDGE);
box(2.35, .61, -4.55, 1.45, 1.22, 1.25, HEDGE);
cyl(0, .28, -6.8, .72, .56, STONE);
cyl(0, .6, -6.8, .42, .1, WATER, false);
box(9.3, 1, -6.9, 2.5, .1, 1.25, WOOD);
box(8.4, .48, -6.9, .12, .96, .12, WOOD_D, false);
box(10.2, .48, -6.9, .12, .96, .12, WOOD_D, false);
box(13.55, .48, -6.9, .55, .96, 2.3, WOOD_D);
box(9.2, .42, -10.7, 2.2, .84, .5, WOOD);
box(-12.3, .46, -1.32, 2, .92, .58, WOOD_D);
box(-13.6, .46, .7, .58, .92, 2, WOOD_D);
box(-9.3, .48, 1.55, 1.9, .96, .9, WOOD);
box(-13.55, 1.02, 3.85, .75, 2.05, .75, METAL);
cyl(-2.35, .55, 3.35, .32, 1.1, STONE);
cyl(2.4, .4, -.15, .34, .8, HEDGE);
box(12.9, .52, 1.5, .75, 1.05, 2.5, CLOTH);
box(10.7, .32, 1.5, 1.15, .4, .7, WOOD);
box(8.6, .5, 3.85, 1.55, 1, .7, WOOD_D);
box(-10.4, .28, 10.35, 2.1, .55, 1.45, ROSE);
box(-10.4, .7, 11.15, 2.1, 1.15, .16, WOOD_D);
box(-13.5, 1.05, 6.85, .55, 2.1, 1.45, WOOD_D);
box(-6.15, .42, 11.35, 1.35, .84, .5, WOOD);
box(0, .02, 8.5, 3.4, .04, 3.6, RUG, false);
box(-2.55, .4, 11.45, 1.3, .8, .42, WOOD);
cyl(-2.55, .85, 8.9, .16, 1.7, WOOD_D);
box(6.55, 1.1, 9.35, .48, 2.2, 2.5, BOOK);
box(6.55, 1.35, 9.35, .5, .18, 2.5, BOOK2, false);
box(10.05, 1.1, 9.35, .48, 2.2, 2.5, BOOK2);
box(12.7, 1.1, 7.3, .48, 2.2, 1.8, BOOK);
box(8.1, .4, 11.45, 1.4, .8, .65, WOOD);
box(12.6, .45, 11.25, .6, .9, .6, CLOTH);
var VISUALS = visuals;
var LAMPS = [
	{
		x: -9.2,
		y: 2.45,
		z: -6.8,
		color: 16758122,
		intensity: 70,
		distance: 14
	},
	{
		x: 0,
		y: 4.2,
		z: -6.8,
		color: 12965615,
		intensity: 90,
		distance: 18
	},
	{
		x: 9.3,
		y: 2.45,
		z: -6.8,
		color: 16758122,
		intensity: 70,
		distance: 14
	},
	{
		x: -9.3,
		y: 2.45,
		z: 1.5,
		color: 16761994,
		intensity: 64,
		distance: 13
	},
	{
		x: 0,
		y: 2.45,
		z: 1.6,
		color: 16761994,
		intensity: 50,
		distance: 12
	},
	{
		x: 10.4,
		y: 2.45,
		z: 1.6,
		color: 16758122,
		intensity: 64,
		distance: 13
	},
	{
		x: -9.4,
		y: 2.45,
		z: 8.8,
		color: 16756928,
		intensity: 56,
		distance: 13
	},
	{
		x: .2,
		y: 2.45,
		z: 8.4,
		color: 16761994,
		intensity: 64,
		distance: 12
	},
	{
		x: 9.2,
		y: 2.45,
		z: 8.6,
		color: 16761994,
		intensity: 64,
		distance: 13
	},
	{
		x: 3.15,
		y: 2.3,
		z: 11.45,
		color: 16769200,
		intensity: 28,
		distance: 6
	}
];
var HIDER_SPAWNS = [
	{
		x: -11.2,
		z: 8.05,
		yaw: .3
	},
	{
		x: -7.1,
		z: -8.5,
		yaw: .4
	},
	{
		x: 8.25,
		z: 9.15,
		yaw: Math.PI
	},
	{
		x: -6.85,
		z: 3.25,
		yaw: -.8
	},
	{
		x: 6.7,
		z: -9.15,
		yaw: 1.1
	},
	{
		x: 11.15,
		z: 3.15,
		yaw: Math.PI * .85
	}
];
/** Inside the foyer closet, facing the door (yaw 0 looks toward -Z). */
var SEEKER_SPAWN = {
	x: 3.12,
	z: 11.5,
	yaw: 0
};
function toAABB(v) {
	if (v.t === "cyl") {
		const r = v.r ?? v.w / 2;
		return {
			minX: v.x - r,
			maxX: v.x + r,
			minY: v.y - v.h / 2,
			maxY: v.y + v.h / 2,
			minZ: v.z - r,
			maxZ: v.z + r
		};
	}
	return {
		minX: v.x - v.w / 2,
		maxX: v.x + v.w / 2,
		minY: v.y - v.h / 2,
		maxY: v.y + v.h / 2,
		minZ: v.z - v.d / 2,
		maxZ: v.z + v.d / 2
	};
}
function computeSolids(hideDoor) {
	const out = [];
	for (const v of visuals) {
		if (!v.blocks) continue;
		if (v.hideOnly && !hideDoor) continue;
		out.push(toAABB(v));
	}
	return out;
}
var SOLIDS_OPEN = computeSolids(false);
var SOLIDS_SHUT = computeSolids(true);
function solids(hideDoor) {
	return hideDoor ? SOLIDS_SHUT : SOLIDS_OPEN;
}
/** Room centers used by the practice ghost. Index matches roomIndex() in logic. */
var ROOM_CENTERS = [
	{
		x: -9.2,
		z: -6.8
	},
	{
		x: 0,
		z: -6.8
	},
	{
		x: 9.2,
		z: -6.8
	},
	{
		x: -9.2,
		z: 1.5
	},
	{
		x: 0,
		z: 1.5
	},
	{
		x: 9.2,
		z: 1.5
	},
	{
		x: -9.2,
		z: 8.7
	},
	{
		x: 0,
		z: 8.6
	},
	{
		x: 9.2,
		z: 8.7
	}
];
/** Tiny synthesized cues. The AudioContext stays locked until the first gesture. */
var ctx = null;
var master = null;
var heart = null;
var heartTimer = 0;
function unlockAudio() {
	const AC = window.AudioContext || window.webkitAudioContext;
	if (!AC) return;
	if (!ctx) {
		ctx = new AC();
		master = ctx.createGain();
		master.gain.value = .22;
		master.connect(ctx.destination);
		const osc = ctx.createOscillator();
		osc.type = "sine";
		osc.frequency.value = 62;
		heart = ctx.createGain();
		heart.gain.value = 1e-4;
		osc.connect(heart);
		heart.connect(master);
		osc.start();
	}
	ctx.resume();
}
function tone(freq, dur, type, vol, when = 0) {
	if (!ctx || !master) return;
	const t = ctx.currentTime + when;
	const o = ctx.createOscillator();
	const g = ctx.createGain();
	o.type = type;
	o.frequency.setValueAtTime(freq, t);
	g.gain.setValueAtTime(Math.max(vol, 1e-4), t);
	g.gain.exponentialRampToValueAtTime(1e-4, t + dur);
	o.connect(g);
	g.connect(master);
	o.start(t);
	o.stop(t + dur + .02);
}
function playTick() {
	tone(740, .045, "square", .035);
}
function playFound() {
	tone(150, .35, "sawtooth", .09);
	tone(80, .5, "sine", .08);
}
function playEscape() {
	tone(523, .16, "sine", .07);
	tone(784, .22, "sine", .06, .14);
}
function playStep() {
	tone(70 + Math.random() * 50, .045, "triangle", .03);
}
function playReady() {
	tone(440, .08, "sine", .04);
}
/** urgency 0..1. Pulses faster as the seeker gets close. */
function heartbeat(urgency, dt) {
	if (!heart || !ctx) return;
	if (urgency < .04) {
		heartTimer = 0;
		return;
	}
	heartTimer -= dt;
	if (heartTimer > 0) return;
	heartTimer = .9 - urgency * .62;
	const t = ctx.currentTime;
	heart.gain.cancelScheduledValues(t);
	heart.gain.setValueAtTime(1e-4, t);
	heart.gain.linearRampToValueAtTime(.09 * urgency, t + .025);
	heart.gain.exponentialRampToValueAtTime(1e-4, t + .16);
}
function clamp(v, a, b) {
	return v < a ? a : v > b ? b : v;
}
/** Push a vertical cylinder out of any box it overlaps. Y is feet height. */
function resolveCylinder(x, z, feetY, height, radius, boxes) {
	const top = feetY + height;
	for (let iter = 0; iter < 3; iter += 1) for (const b of boxes) {
		if (top <= b.minY + .001 || feetY >= b.maxY - .001) continue;
		const cx = clamp(x, b.minX, b.maxX);
		const cz = clamp(z, b.minZ, b.maxZ);
		const dx = x - cx;
		const dz = z - cz;
		const d2 = dx * dx + dz * dz;
		if (d2 >= radius * radius) continue;
		if (d2 > 1e-8) {
			const d = Math.sqrt(d2);
			const push = radius - d + .001;
			x += dx / d * push;
			z += dz / d * push;
		} else {
			const left = x - b.minX;
			const right = b.maxX - x;
			const north = z - b.minZ;
			const south = b.maxZ - z;
			const m = Math.min(left, right, north, south);
			if (m === left) x = b.minX - radius - .001;
			else if (m === right) x = b.maxX + radius + .001;
			else if (m === north) z = b.minZ - radius - .001;
			else z = b.maxZ + radius + .001;
		}
	}
	return {
		x,
		z
	};
}
function slab(origin, delta, min, max, tmin, tmax) {
	if (Math.abs(delta) < 1e-8) {
		if (origin < min || origin > max) return null;
		return {
			tmin,
			tmax
		};
	}
	let t1 = (min - origin) / delta;
	let t2 = (max - origin) / delta;
	if (t1 > t2) {
		const s = t1;
		t1 = t2;
		t2 = s;
	}
	const nmin = t1 > tmin ? t1 : tmin;
	const nmax = t2 < tmax ? t2 : tmax;
	if (nmin > nmax) return null;
	return {
		tmin: nmin,
		tmax: nmax
	};
}
/** True when the segment hits a solid before it reaches the target. */
function segmentBlocked(x0, y0, z0, x1, y1, z1, boxes) {
	const dx = x1 - x0;
	const dy = y1 - y0;
	const dz = z1 - z0;
	for (const b of boxes) {
		let span = slab(x0, dx, b.minX, b.maxX, 0, 1);
		if (!span) continue;
		span = slab(y0, dy, b.minY, b.maxY, span.tmin, span.tmax);
		if (!span) continue;
		span = slab(z0, dz, b.minZ, b.maxZ, span.tmin, span.tmax);
		if (!span) continue;
		if (span.tmax >= 0 && span.tmin <= .98) return true;
	}
	return false;
}
/** Rules, movement, and the practice ghost.
*
*  FPS basis (three.js, Y up, yaw 0 looks down -Z):
*    forward = (-sin(yaw), -cos(yaw))
*    right   = ( cos(yaw), -sin(yaw))
*  W/S walk forward/back. A strafes left (−right), D strafes right.
*  A/D do not turn the body — the mouse does. Do not "fix" A by flipping yaw.
*/
var PLAYER_RADIUS = .32;
var HEIGHT_STAND = 1.72;
var HEIGHT_CROUCH = .9;
var EYE_STAND = 1.56;
var EYE_CROUCH = .78;
var HIDE_MS = 24e3;
var SEEK_MS = 8e4;
function basis(yaw) {
	return {
		fx: -Math.sin(yaw),
		fz: -Math.cos(yaw),
		rx: Math.cos(yaw),
		rz: -Math.sin(yaw)
	};
}
function lerpAngle(a, b, t) {
	let d = b - a;
	while (d > Math.PI) d -= Math.PI * 2;
	while (d < -Math.PI) d += Math.PI * 2;
	return a + d * t;
}
function eyeHeight(crouch) {
	return crouch ? EYE_CROUCH : EYE_STAND;
}
function hiderSpawn(round) {
	return HIDER_SPAWNS[Math.abs(Math.trunc(round) * 3 + 1) % HIDER_SPAWNS.length];
}
function freshBody(spawn) {
	return {
		x: spawn.x,
		z: spawn.z,
		vx: 0,
		vz: 0,
		yaw: spawn.yaw,
		pitch: 0,
		crouch: false,
		stuck: 0
	};
}
function place(body, spawn) {
	body.x = spawn.x;
	body.z = spawn.z;
	body.yaw = spawn.yaw;
	body.pitch = 0;
	body.vx = 0;
	body.vz = 0;
	body.crouch = false;
	body.stuck = 0;
}
function createSim(soloRole, selfKey) {
	const side = (selfKey.charCodeAt(2) || 1) % 2 === 0 ? -1.3 : 1.3;
	const meSpawn = soloRole === "seeker" ? SEEKER_SPAWN : soloRole === "hider" ? hiderSpawn(1) : {
		x: side,
		z: 7.6,
		yaw: 0
	};
	const botSpawn = soloRole === "seeker" ? hiderSpawn(2) : SEEKER_SPAWN;
	const sim = {
		phase: soloRole ? "hide" : "lobby",
		role: soloRole ?? "hider",
		me: freshBody(meSpawn),
		bot: freshBody(botSpawn),
		useBot: soloRole != null,
		round: soloRole ? 1 : 0,
		startedAt: typeof performance !== "undefined" ? performance.now() : 0,
		hideMs: HIDE_MS,
		seekMs: SEEK_MS,
		winner: null,
		reason: null,
		contested: false,
		endSent: false,
		samples: [],
		lastSeq: 0,
		seq: 0,
		walk: 0,
		shake: 0,
		stepAcc: 0,
		lastTick: -1,
		fallbackEnd: 0
	};
	if (soloRole === "seeker") sim.bot.crouch = true;
	return sim;
}
function beginRound(sim, args) {
	sim.phase = "hide";
	sim.round = args.round;
	sim.role = args.role;
	sim.hideMs = args.hideMs;
	sim.seekMs = args.seekMs;
	sim.contested = args.contested;
	sim.startedAt = args.now;
	sim.winner = null;
	sim.reason = null;
	sim.endSent = false;
	sim.samples = [];
	sim.lastSeq = 0;
	sim.fallbackEnd = 0;
	sim.lastTick = -1;
	sim.useBot = false;
	place(sim.me, args.role === "hider" ? hiderSpawn(args.round) : SEEKER_SPAWN);
}
function conclude(sim, winner, reason) {
	if (sim.phase === "result") return false;
	sim.phase = "result";
	sim.winner = winner;
	sim.reason = reason;
	sim.endSent = true;
	sim.shake = reason === "tag" ? 1 : .3;
	return true;
}
/** Hide → seek on the local clock. Only the authority emits a time-win. */
function advanceClock(sim, now, authoritative) {
	if (sim.phase !== "hide" && sim.phase !== "seek") return null;
	const elapsed = now - sim.startedAt;
	if (sim.phase === "hide" && elapsed >= sim.hideMs) {
		sim.phase = "seek";
		return "seek";
	}
	if (sim.phase === "seek" && elapsed >= sim.hideMs + sim.seekMs) {
		if (authoritative) {
			if (conclude(sim, "hider", "time")) return "time";
		} else if (sim.fallbackEnd === 0) sim.fallbackEnd = now;
		else if (now - sim.fallbackEnd > 2e3) {
			if (conclude(sim, "hider", "time")) return "time";
		}
	}
	return null;
}
function remainingMs(sim, now) {
	const elapsed = now - sim.startedAt;
	if (sim.phase === "hide") return sim.hideMs - elapsed;
	if (sim.phase === "seek") return sim.hideMs + sim.seekMs - elapsed;
	return 0;
}
function formatClock(ms) {
	const s = Math.max(0, Math.ceil(ms / 1e3));
	return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
}
function axesFromKeys(keys, touch) {
	let f = touch.f;
	let s = touch.s;
	if (keys.has("KeyW") || keys.has("ArrowUp")) f += 1;
	if (keys.has("KeyS") || keys.has("ArrowDown")) f -= 1;
	if (keys.has("KeyA") || keys.has("ArrowLeft")) s -= 1;
	if (keys.has("KeyD") || keys.has("ArrowRight")) s += 1;
	f = Math.max(-1, Math.min(1, f));
	s = Math.max(-1, Math.min(1, s));
	const crouch = keys.has("KeyC") || keys.has("ControlLeft") || keys.has("ControlRight");
	const tag = keys.has("KeyE");
	return {
		f,
		s,
		crouch,
		tag
	};
}
function stepBody(body, input, dt, boxes, opts) {
	if (opts?.frozen) {
		body.vx = 0;
		body.vz = 0;
		return;
	}
	body.crouch = input.crouch;
	const cap = opts?.maxSpeed ?? (body.crouch ? 2.15 : 4.45);
	const { fx, fz, rx, rz } = basis(body.yaw);
	let wx = fx * input.f + rx * input.s;
	let wz = fz * input.f + rz * input.s;
	const wl = Math.hypot(wx, wz);
	if (wl > 1) {
		wx /= wl;
		wz /= wl;
	}
	body.vx += wx * 28 * dt;
	body.vz += wz * 28 * dt;
	const friction = input.f === 0 && input.s === 0 ? 14 : 5.5;
	const damp = Math.exp(-friction * dt);
	body.vx *= damp;
	body.vz *= damp;
	const sp = Math.hypot(body.vx, body.vz);
	if (sp > cap) {
		body.vx = body.vx / sp * cap;
		body.vz = body.vz / sp * cap;
	}
	const height = body.crouch ? HEIGHT_CROUCH : HEIGHT_STAND;
	let left = dt;
	while (left > 1e-5) {
		const speed = Math.hypot(body.vx, body.vz);
		const step = Math.min(left, speed > .05 ? .12 / speed : left);
		body.x += body.vx * step;
		body.z += body.vz * step;
		const resolved = resolveCylinder(body.x, body.z, 0, height, PLAYER_RADIUS, boxes);
		const penX = resolved.x - body.x;
		const penZ = resolved.z - body.z;
		body.x = resolved.x;
		body.z = resolved.z;
		if (penX * body.vx < 0) body.vx = 0;
		if (penZ * body.vz < 0) body.vz = 0;
		left -= step;
	}
}
function taggable(a, b, boxes) {
	const dx = a.x - b.x;
	const dz = a.z - b.z;
	if (dx * dx + dz * dz > 1.72 * 1.72) return false;
	const ah = a.crouch ? .62 : 1.2;
	const bh = b.crouch ? .5 : 1.2;
	return !segmentBlocked(a.x, ah, a.z, b.x, bh, b.z, boxes);
}
function withinSlack(a, b) {
	const dx = a.x - b.x;
	const dz = a.z - b.z;
	return dx * dx + dz * dz <= 2.45 * 2.45;
}
function resolveRoles(a, b, salt) {
	if (a.pick === "hider" && b.pick !== "hider") return {
		hiderId: a.id,
		seekerId: b.id,
		contested: false
	};
	if (b.pick === "hider" && a.pick !== "hider") return {
		hiderId: b.id,
		seekerId: a.id,
		contested: false
	};
	if (a.pick === "seeker" && b.pick !== "seeker") return {
		hiderId: b.id,
		seekerId: a.id,
		contested: false
	};
	if (b.pick === "seeker" && a.pick !== "seeker") return {
		hiderId: a.id,
		seekerId: b.id,
		contested: false
	};
	const contested = a.pick === b.pick && a.pick !== "either";
	const [lo, hi] = a.id < b.id ? [a, b] : [b, a];
	const loHides = salt % 2 === 0;
	return {
		hiderId: loHides ? lo.id : hi.id,
		seekerId: loHides ? hi.id : lo.id,
		contested
	};
}
function roomIndex(x, z) {
	return (z < -2 ? 0 : z < 5 ? 1 : 2) * 3 + (x < -4 ? 0 : x < 4 ? 1 : 2);
}
var LINKS = [
	[1, 3],
	[
		0,
		2,
		4
	],
	[1, 5],
	[
		0,
		4,
		6
	],
	[
		1,
		3,
		5,
		7
	],
	[
		2,
		4,
		8
	],
	[3, 7],
	[
		4,
		6,
		8
	],
	[5, 7]
];
function nextRoom(from, to) {
	if (from === to) return to;
	const prev = /* @__PURE__ */ new Map();
	const q = [from];
	prev.set(from, -1);
	while (q.length > 0) {
		const n = q.shift();
		if (n === to) break;
		for (const c of LINKS[n] ?? []) {
			if (prev.has(c)) continue;
			prev.set(c, n);
			q.push(c);
		}
	}
	if (!prev.has(to)) return from;
	let cur = to;
	while (prev.get(cur) !== from && prev.get(cur) !== -1 && prev.get(cur) !== void 0) cur = prev.get(cur);
	return cur;
}
function sees(a, b, boxes, range) {
	const dx = a.x - b.x;
	const dz = a.z - b.z;
	if (dx * dx + dz * dz > range * range) return false;
	const ah = a.crouch ? .62 : 1.25;
	const bh = b.crouch ? .5 : 1.15;
	return !segmentBlocked(a.x, ah, a.z, b.x, bh, b.z, boxes);
}
/** Practice opponent. Hider-bot stays crouched in a spot. Seeker-bot patrols doors. */
function stepBot(bot, player, phase, botRole, dt, boxes) {
	if (botRole === "hider") {
		bot.vx = 0;
		bot.vz = 0;
		bot.crouch = true;
		return;
	}
	if (phase !== "seek") {
		bot.x = SEEKER_SPAWN.x;
		bot.z = SEEKER_SPAWN.z;
		bot.yaw = SEEKER_SPAWN.yaw;
		bot.vx = 0;
		bot.vz = 0;
		bot.crouch = false;
		bot.stuck = 0;
		return;
	}
	let goalX = player.x;
	let goalZ = player.z;
	const same = roomIndex(bot.x, bot.z) === roomIndex(player.x, player.z);
	const spotted = sees(bot, player, boxes, 11);
	if (bot.z > 10.25) {
		goalX = 3.12;
		goalZ = 9.35;
	} else if (!(same && spotted)) {
		const c = ROOM_CENTERS[nextRoom(roomIndex(bot.x, bot.z), roomIndex(player.x, player.z))] ?? ROOM_CENTERS[4];
		goalX = c.x;
		goalZ = c.z;
		if (same) {
			goalX = player.x;
			goalZ = player.z;
		}
	}
	const desired = Math.atan2(-(goalX - bot.x), -(goalZ - bot.z));
	bot.yaw = lerpAngle(bot.yaw, desired, 1 - Math.exp(-8 * dt));
	const beforeX = bot.x;
	const beforeZ = bot.z;
	stepBody(bot, {
		f: 1,
		s: bot.stuck > .45 ? 1 : 0,
		crouch: false
	}, dt, boxes, { maxSpeed: 3.35 });
	bot.stuck = Math.hypot(bot.x - beforeX, bot.z - beforeZ) < .25 * dt ? bot.stuck + dt : 0;
}
function interpolate(samples, now) {
	if (samples.length === 0) return null;
	const target = now - 90;
	const last = samples[samples.length - 1];
	let a = samples[Math.max(0, samples.length - 2)];
	let b = last;
	if (target < last.t) {
		for (let i = 0; i < samples.length - 1; i += 1) if (samples[i].t <= target && samples[i + 1].t >= target) {
			a = samples[i];
			b = samples[i + 1];
			break;
		}
	}
	if (a === b || b.t === a.t) return {
		x: b.x,
		z: b.z,
		yaw: b.yaw,
		pitch: b.pitch,
		crouch: b.c === 1,
		vx: 0,
		vz: 0,
		stuck: 0
	};
	const u = Math.min(1, Math.max(0, (target - a.t) / (b.t - a.t)));
	return {
		x: a.x + (b.x - a.x) * u,
		z: a.z + (b.z - a.z) * u,
		yaw: lerpAngle(a.yaw, b.yaw, u),
		pitch: a.pitch + (b.pitch - a.pitch) * u,
		crouch: (u < .5 ? a.c : b.c) === 1,
		vx: 0,
		vz: 0,
		stuck: 0
	};
}
function restartSolo(sim, now) {
	sim.round += 1;
	sim.phase = "hide";
	sim.startedAt = now;
	sim.winner = null;
	sim.reason = null;
	sim.endSent = false;
	sim.lastTick = -1;
	sim.fallbackEnd = 0;
	sim.samples = [];
	if (sim.role === "hider") {
		place(sim.me, hiderSpawn(sim.round));
		place(sim.bot, SEEKER_SPAWN);
	} else {
		place(sim.me, SEEKER_SPAWN);
		place(sim.bot, hiderSpawn(sim.round));
		sim.bot.crouch = true;
	}
}
function worldSolids(phase) {
	return solids(phase === "hide");
}
/** First-person match: local sim, optional practice ghost, optional WebRTC peer.
*  The host (room creator, or the lower id if both joined) starts rounds and
*  confirms tags. Movement is client-side; a friend could lie about position.
*/
function hostOf(selfId, creator, partner) {
	if (!partner?.hello) return creator;
	if (creator !== partner.creator) return creator;
	return selfId < partner.id;
}
function isNetMsg(data) {
	return !!data && typeof data === "object" && "k" in data;
}
function Match({ net, creator, soloRole, selfId, name, roomCode, onExit }) {
	const canvasRef = (0, import_react.useRef)(null);
	const simRef = (0, import_react.useRef)(null);
	if (!simRef.current) simRef.current = createSim(soloRole, selfId);
	const inputRef = (0, import_react.useRef)({
		keys: /* @__PURE__ */ new Set(),
		forced: null,
		touch: {
			f: 0,
			s: 0
		},
		touchCrouch: false,
		touchTag: false,
		lookDx: 0,
		lookDy: 0,
		tagLatch: false
	});
	const partnerRef = (0, import_react.useRef)(null);
	const notedRound = (0, import_react.useRef)(-1);
	const startLock = (0, import_react.useRef)(false);
	const timerRef = (0, import_react.useRef)(null);
	const bigRef = (0, import_react.useRef)(null);
	const tagRef = (0, import_react.useRef)(null);
	const flashRef = (0, import_react.useRef)(null);
	const netRef = (0, import_react.useRef)(net);
	netRef.current = net;
	const nameRef = (0, import_react.useRef)(name);
	nameRef.current = name;
	const creatorRef = (0, import_react.useRef)(creator);
	creatorRef.current = creator;
	const [phase, setPhase] = (0, import_react.useState)(simRef.current.phase);
	const phaseRef = (0, import_react.useRef)(phase);
	phaseRef.current = phase;
	const [role, setRole] = (0, import_react.useState)(simRef.current.role);
	const roleRef = (0, import_react.useRef)(role);
	roleRef.current = role;
	const [pick, setPick] = (0, import_react.useState)("either");
	const pickRef = (0, import_react.useRef)(pick);
	pickRef.current = pick;
	const [ready, setReady] = (0, import_react.useState)(false);
	const readyRef = (0, import_react.useRef)(ready);
	readyRef.current = ready;
	const [partner, setPartner] = (0, import_react.useState)(null);
	const [locked, setLocked] = (0, import_react.useState)(false);
	const [copied, setCopied] = (0, import_react.useState)(null);
	const [gfxError, setGfxError] = (0, import_react.useState)(null);
	const [roomFull, setRoomFull] = (0, import_react.useState)(false);
	const [linkLost, setLinkLost] = (0, import_react.useState)(false);
	const [winner, setWinner] = (0, import_react.useState)(null);
	const [reason, setReason] = (0, import_react.useState)(null);
	const [contested, setContested] = (0, import_react.useState)(false);
	const host = hostOf(selfId, creator, partner);
	const hostRef = (0, import_react.useRef)(host);
	hostRef.current = host;
	(0, import_react.useEffect)(() => {
		partnerRef.current = partner;
	}, [partner]);
	(0, import_react.useEffect)(() => {
		if (!net) return;
		if (partnerRef.current || roomFull) return;
		if (net.peers.length >= 2) {
			setRoomFull(true);
			return;
		}
		const connected = net.peers.find((p) => p.connectionState === "connected");
		if (!connected) return;
		const next = {
			id: connected.id,
			name: connected.name || "Friend",
			creator: false,
			pick: "either",
			ready: false,
			hello: false
		};
		partnerRef.current = next;
		setPartner(next);
		net.send({
			k: "hi",
			name: nameRef.current,
			creator: creatorRef.current,
			pick: pickRef.current,
			ready: readyRef.current
		}, connected.id);
	}, [
		net,
		net?.peers,
		roomFull
	]);
	(0, import_react.useEffect)(() => {
		if (!net) return;
		return net.onMessage((from, data, channel) => {
			if (!isNetMsg(data)) return;
			const current = partnerRef.current;
			if (current && from !== current.id) return;
			if (!current) {
				if ((net.peers.length ?? 0) >= 2) return;
				const next = {
					id: from,
					name: "Friend",
					creator: false,
					pick: "either",
					ready: false,
					hello: false
				};
				partnerRef.current = next;
				setPartner(next);
			}
			const sim = simRef.current;
			if (!sim) return;
			if (channel === "state" && data.k === "pose") {
				pushPose(sim, data, performance.now());
				return;
			}
			if (data.k === "hi") {
				const next = {
					id: from,
					name: data.name || "Friend",
					creator: !!data.creator,
					pick: data.pick === "hider" || data.pick === "seeker" || data.pick === "either" ? data.pick : "either",
					ready: !!data.ready,
					hello: true
				};
				partnerRef.current = next;
				setPartner(next);
			} else if (data.k === "lobby" && partnerRef.current) {
				const next = {
					...partnerRef.current,
					pick: data.pick,
					ready: !!data.ready
				};
				partnerRef.current = next;
				setPartner(next);
			} else if (data.k === "start") {
				if (sim.round === data.round && (sim.phase === "hide" || sim.phase === "seek")) return;
				const mine = data.hiderId === selfId ? "hider" : "seeker";
				beginRound(sim, {
					round: data.round,
					role: mine,
					hideMs: data.hideMs || 24e3,
					seekMs: data.seekMs || 8e4,
					contested: !!data.contested,
					now: performance.now()
				});
				setRole(mine);
				setContested(!!data.contested);
				roleRef.current = mine;
			} else if (data.k === "tag") {
				if (!hostRef.current || data.round !== sim.round || sim.phase !== "seek") return;
				const other = interpolate(sim.samples, performance.now());
				const seekerPos = sim.role === "seeker" ? sim.me : other;
				const hiderPos = sim.role === "hider" ? sim.me : other;
				if (!seekerPos || !hiderPos || !withinSlack(seekerPos, hiderPos)) return;
				conclude(sim, "seeker", "tag");
				net.send({
					k: "end",
					round: sim.round,
					winner: "seeker",
					reason: "tag"
				});
			} else if (data.k === "end" && data.round === sim.round) conclude(sim, data.winner, data.reason);
		});
	}, [net, selfId]);
	(0, import_react.useEffect)(() => {
		if (!net || !partner) return;
		net.send({
			k: "lobby",
			pick,
			ready
		}, partner.id);
	}, [
		net,
		partner?.id,
		pick,
		ready
	]);
	(0, import_react.useEffect)(() => {
		if (!net || !partner?.hello) return;
		if (phase !== "lobby" && phase !== "result") return;
		if (!ready || !partner.ready) {
			startLock.current = false;
			return;
		}
		if (!host) return;
		if (!net.peers.some((p) => p.id === partner.id && p.connectionState === "connected") || startLock.current) return;
		startLock.current = true;
		const round = (simRef.current?.round ?? 0) + 1;
		const resolved = resolveRoles({
			id: selfId,
			pick
		}, {
			id: partner.id,
			pick: partner.pick
		}, round);
		const mine = resolved.hiderId === selfId ? "hider" : "seeker";
		net.send({
			k: "start",
			round,
			hiderId: resolved.hiderId,
			seekerId: resolved.seekerId,
			hideMs: HIDE_MS,
			seekMs: SEEK_MS,
			contested: resolved.contested
		});
		if (simRef.current) beginRound(simRef.current, {
			round,
			role: mine,
			hideMs: HIDE_MS,
			seekMs: SEEK_MS,
			contested: resolved.contested,
			now: performance.now()
		});
		setRole(mine);
		roleRef.current = mine;
		setContested(resolved.contested);
	}, [
		net,
		partner,
		ready,
		pick,
		phase,
		host,
		selfId,
		net?.peers
	]);
	(0, import_react.useEffect)(() => {
		if (!net || !partner || phase === "lobby") return;
		if (!net.peers.some((p) => p.id === partner.id)) setLinkLost(true);
	}, [
		net,
		net?.peers,
		partner,
		phase
	]);
	(0, import_react.useEffect)(() => {
		const canvas = canvasRef.current;
		const sim = simRef.current;
		if (!canvas || !sim) return;
		let stopped = false;
		let raf = 0;
		let view = null;
		let last = performance.now();
		let lastSend = 0;
		const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		const input = inputRef.current;
		window.__controlsTest = {
			getYaw: () => sim.me.yaw,
			getSpeed: () => Math.hypot(sim.me.vx, sim.me.vz),
			getPos: () => ({
				x: sim.me.x,
				z: sim.me.z
			}),
			setKeys: (codes) => {
				input.forced = new Set(codes);
			},
			setSteer: () => {}
		};
		const onKeyDown = (e) => {
			if (e.code.startsWith("Arrow") || e.code === "Space") e.preventDefault();
			input.keys.add(e.code);
			unlockAudio();
		};
		const onKeyUp = (e) => {
			input.keys.delete(e.code);
		};
		const onBlur = () => input.keys.clear();
		const onMouse = (e) => {
			if (document.pointerLockElement !== canvas) return;
			sim.me.yaw -= e.movementX * .0022;
			sim.me.pitch = Math.max(-1.45, Math.min(1.45, sim.me.pitch - e.movementY * .0022));
		};
		const onLock = () => setLocked(document.pointerLockElement === canvas);
		window.addEventListener("keydown", onKeyDown);
		window.addEventListener("keyup", onKeyUp);
		window.addEventListener("blur", onBlur);
		window.addEventListener("mousemove", onMouse);
		document.addEventListener("pointerlockchange", onLock);
		const publishPhase = () => {
			if (sim.phase === phaseRef.current) return;
			phaseRef.current = sim.phase;
			setPhase(sim.phase);
			if (sim.phase === "hide") playReady();
			if (sim.phase === "result") {
				setWinner(sim.winner);
				setReason(sim.reason);
				if (sim.reason === "tag") {
					playFound();
					flashRef.current?.classList.remove("flash-on");
					flashRef.current?.offsetWidth;
					flashRef.current?.classList.add("flash-on");
				} else if (sim.reason === "time") playEscape();
				if (!sim.useBot && notedRound.current !== sim.round) {
					notedRound.current = sim.round;
					setPick(sim.role === "hider" ? "seeker" : "hider");
					setReady(false);
				}
			}
		};
		const loop = (now) => {
			if (stopped) return;
			const dt = Math.min(.05, (now - last) / 1e3);
			last = now;
			sim.me.yaw -= input.lookDx * .0045;
			sim.me.pitch = Math.max(-1.45, Math.min(1.45, sim.me.pitch - input.lookDy * .0045));
			input.lookDx = 0;
			input.lookDy = 0;
			const axes = axesFromKeys(input.forced ?? input.keys, input.touch);
			const crouch = axes.crouch || input.touchCrouch;
			const frozen = sim.phase === "hide" && sim.role === "seeker";
			const canMove = sim.phase === "lobby" || sim.phase === "hide" || sim.phase === "seek";
			stepBody(sim.me, {
				f: canMove && !frozen ? axes.f : 0,
				s: canMove && !frozen ? axes.s : 0,
				crouch: frozen ? false : crouch
			}, dt, worldSolids(sim.phase), { frozen });
			if (sim.useBot) {
				const botRole = sim.role === "hider" ? "seeker" : "hider";
				stepBot(sim.bot, sim.me, sim.phase, botRole, dt, worldSolids(sim.phase));
				if (sim.phase === "seek" && botRole === "seeker" && taggable(sim.bot, sim.me, worldSolids("seek"))) conclude(sim, "seeker", "tag");
			}
			if (advanceClock(sim, now, !netRef.current || hostRef.current) === "time" && netRef.current && hostRef.current) netRef.current.send({
				k: "end",
				round: sim.round,
				winner: "hider",
				reason: "time"
			});
			const pressed = axes.tag || input.touchTag;
			if (pressed && !input.tagLatch && sim.phase === "seek" && sim.role === "seeker") {
				const other = otherBody(sim, now);
				if (other && taggable(sim.me, other, worldSolids("seek"))) {
					if (!netRef.current || hostRef.current) {
						if (conclude(sim, "seeker", "tag") && netRef.current) netRef.current.send({
							k: "end",
							round: sim.round,
							winner: "seeker",
							reason: "tag"
						});
					} else netRef.current.send({
						k: "tag",
						round: sim.round
					});
				}
			}
			input.tagLatch = pressed;
			const speed = Math.hypot(sim.me.vx, sim.me.vz);
			if (speed > .45 && !sim.me.crouch && !frozen) {
				sim.walk += dt * speed * 2.1;
				sim.stepAcc += dt * speed;
				if (sim.stepAcc > 2.15) {
					sim.stepAcc = 0;
					playStep();
				}
			}
			sim.shake = Math.max(0, sim.shake - dt * 1.6);
			if (sim.phase === "hide") {
				const sec = Math.ceil(Math.max(0, remainingMs(sim, now)) / 1e3);
				if (sec !== sim.lastTick) {
					sim.lastTick = sec;
					playTick();
				}
			}
			const other = otherBody(sim, now);
			if (sim.role === "hider" && sim.phase === "seek" && other) {
				const d = Math.hypot(sim.me.x - other.x, sim.me.z - other.z);
				heartbeat(Math.max(0, Math.min(1, (9.5 - d) / 9.5)), dt);
			} else heartbeat(0, dt);
			const link = netRef.current;
			if (link && now - lastSend > 50) {
				lastSend = now;
				sim.seq += 1;
				link.broadcast({
					k: "pose",
					seq: sim.seq,
					x: round3(sim.me.x),
					z: round3(sim.me.z),
					yaw: round3(sim.me.yaw),
					pitch: round3(sim.me.pitch),
					c: sim.me.crouch ? 1 : 0
				});
			}
			if (timerRef.current) timerRef.current.textContent = sim.phase === "hide" || sim.phase === "seek" ? formatClock(remainingMs(sim, now)) : "—";
			if (bigRef.current) bigRef.current.textContent = formatClock(remainingMs(sim, now));
			const showTag = sim.phase === "seek" && sim.role === "seeker" && !!other && taggable(sim.me, other, worldSolids("seek"));
			tagRef.current?.classList.toggle("hidden", !showTag);
			view?.render({
				x: sim.me.x,
				z: sim.me.z,
				yaw: sim.me.yaw,
				pitch: sim.me.pitch,
				eye: eyeHeight(sim.me.crouch),
				walk: reduce ? 0 : sim.walk,
				shake: reduce ? 0 : sim.shake,
				crouch: sim.me.crouch,
				flashlight: sim.role === "seeker" && (sim.phase === "seek" || sim.phase === "result"),
				doorClosed: sim.phase === "hide",
				other: other ? {
					x: other.x,
					z: other.z,
					yaw: other.yaw,
					pitch: other.pitch,
					crouch: other.crouch,
					role: sim.role === "hider" ? "seeker" : "hider",
					flash: sim.role === "hider" && (sim.phase === "seek" || sim.phase === "result")
				} : null
			});
			publishPhase();
			if (!window.__gameReady) window.__gameReady = true;
			raf = requestAnimationFrame(loop);
		};
		import("./view-DGVKgBla.mjs").then(({ createView }) => {
			if (stopped) return;
			try {
				view = createView(canvas);
			} catch (err) {
				setGfxError(err instanceof Error ? err.message : "Could not start the 3D view.");
			}
		});
		raf = requestAnimationFrame(loop);
		return () => {
			stopped = true;
			cancelAnimationFrame(raf);
			view?.dispose();
			window.removeEventListener("keydown", onKeyDown);
			window.removeEventListener("keyup", onKeyUp);
			window.removeEventListener("blur", onBlur);
			window.removeEventListener("mousemove", onMouse);
			document.removeEventListener("pointerlockchange", onLock);
			if (document.pointerLockElement === canvas) document.exitPointerLock();
			delete window.__controlsTest;
			window.__gameReady = false;
		};
	}, []);
	const peerLink = net?.peers.find((p) => p.id === partner?.id);
	const linkLabel = linkLabelFor(net, peerLink?.connectionState ?? null, peerLink?.rttMs ?? null, !!partner);
	const requestLook = () => {
		unlockAudio();
		const canvas = canvasRef.current;
		if (!canvas || document.pointerLockElement === canvas) return;
		(canvas.requestPointerLock?.({ unadjustedMovement: true }))?.catch(() => canvas.requestPointerLock());
	};
	const copyText = async (value, kind) => {
		try {
			await navigator.clipboard.writeText(value);
			setCopied(kind);
		} catch {
			setCopied(null);
		}
	};
	const objective = phase === "hide" && role === "hider" ? contested ? "Both of you wanted the same role. The house decided — hide." : "Hide. They are counting in the foyer closet." : phase === "hide" && role === "seeker" ? "Eyes covered. The door opens when the count hits zero." : phase === "seek" && role === "seeker" ? "The door is open. Get close and press E to tag." : phase === "seek" ? "They are out with the lamp. Stay low, break line of sight." : "";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 overflow-hidden bg-ink text-paper touch-none",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
				ref: canvasRef,
				className: "absolute inset-0 h-full w-full",
				onClick: requestLook,
				onContextMenu: (e) => e.preventDefault()
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref: flashRef,
				className: "pointer-events-none absolute inset-0"
			}),
			phase === "hide" && role === "seeker" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "blindfold pointer-events-none absolute inset-0" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pointer-events-none absolute inset-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-3 p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pointer-events-auto flex items-center gap-3 rounded-full border border-line bg-ink-2 px-4 py-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Timer, {
								className: "size-5 text-brass",
								"aria-hidden": true
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								ref: timerRef,
								className: "font-display text-2xl tabular-nums leading-none",
								children: phase === "hide" ? formatClock(HIDE_MS) : "—"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pointer-events-auto flex items-center gap-2",
							children: [net && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "hidden rounded-full border border-line bg-ink-2 px-3 py-2 text-sm text-muted sm:block",
								children: linkLabel
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: onExit,
								className: "inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-ink-2 px-4 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, {
									className: "size-4",
									"aria-hidden": true
								}), "Leave"]
							})]
						})]
					}),
					objective && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mx-auto mt-2 max-w-xl px-4 text-center text-sm text-paper",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "inline-block rounded-full border border-line bg-ink-2 px-4 py-2",
							children: objective
						})
					}),
					phase === "hide" && role === "seeker" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "pointer-events-none absolute inset-0 grid place-items-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm uppercase tracking-widest text-brass",
								children: "Counting"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								ref: bigRef,
								className: "font-display text-7xl tabular-nums text-paper",
								children: "0:24"
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						ref: tagRef,
						className: "absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-16 rounded-full bg-brass px-4 py-2 text-sm font-medium text-ink",
						children: "Press E to tag"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute top-1/2 left-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-brass" }),
					(phase === "hide" || phase === "seek") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "absolute inset-x-0 bottom-4 hidden px-4 text-center md:block",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-block rounded-full border border-line bg-ink-2 px-4 py-2 text-sm text-muted",
							children: [
								locked ? "Esc releases the mouse. The round keeps going." : "Click the scene to look.",
								" WASD move · A left, D right · C crouch",
								role === "seeker" ? " · E tag" : ""
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "touch-layer absolute inset-0",
						children: (phase === "hide" || phase === "seek" || phase === "lobby") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute top-20 bottom-28 left-0 w-1/2",
								onPointerDown: (e) => {
									const el = e.currentTarget;
									el.setPointerCapture(e.pointerId);
									el.dataset.ox = String(e.clientX);
									el.dataset.oy = String(e.clientY);
									el.dataset.pid = String(e.pointerId);
								},
								onPointerMove: (e) => {
									const el = e.currentTarget;
									if (el.dataset.pid !== String(e.pointerId)) return;
									const dx = e.clientX - Number(el.dataset.ox);
									const dy = e.clientY - Number(el.dataset.oy);
									const max = 56;
									const mag = Math.hypot(dx, dy) || 1;
									const k = mag > max ? max / mag : 1;
									const nx = dx * k / max;
									const ny = dy * k / max;
									inputRef.current.touch.s = Math.abs(nx) < .12 ? 0 : nx;
									inputRef.current.touch.f = Math.abs(ny) < .12 ? 0 : -ny;
								},
								onPointerUp: (e) => {
									const el = e.currentTarget;
									if (el.dataset.pid !== String(e.pointerId)) return;
									el.dataset.pid = "";
									inputRef.current.touch.f = 0;
									inputRef.current.touch.s = 0;
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "absolute bottom-4 left-6 rounded-full border border-line bg-ink-2 px-3 py-2 text-xs text-muted",
									children: "Move"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute top-20 right-0 bottom-28 w-1/2",
								onPointerDown: (e) => {
									const el = e.currentTarget;
									el.setPointerCapture(e.pointerId);
									el.dataset.lx = String(e.clientX);
									el.dataset.ly = String(e.clientY);
									el.dataset.pid = String(e.pointerId);
								},
								onPointerMove: (e) => {
									const el = e.currentTarget;
									if (el.dataset.pid !== String(e.pointerId)) return;
									const lx = Number(el.dataset.lx);
									const ly = Number(el.dataset.ly);
									inputRef.current.lookDx += e.clientX - lx;
									inputRef.current.lookDy += e.clientY - ly;
									el.dataset.lx = String(e.clientX);
									el.dataset.ly = String(e.clientY);
								},
								onPointerUp: (e) => {
									const el = e.currentTarget;
									if (el.dataset.pid === String(e.pointerId)) el.dataset.pid = "";
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "absolute right-4 bottom-6 flex flex-col gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "pointer-events-auto min-h-12 min-w-24 rounded-full border border-line bg-ink-2 px-4 text-sm",
									onPointerDown: (e) => {
										e.stopPropagation();
										inputRef.current.touchCrouch = !inputRef.current.touchCrouch;
										e.currentTarget.classList.toggle("bg-brass", inputRef.current.touchCrouch);
										e.currentTarget.classList.toggle("text-ink", inputRef.current.touchCrouch);
									},
									children: "Crouch"
								}), role === "seeker" && phase === "seek" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "pointer-events-auto min-h-12 min-w-24 rounded-full bg-brass px-4 text-sm font-medium text-ink",
									onPointerDown: (e) => {
										e.stopPropagation();
										inputRef.current.touchTag = true;
										unlockAudio();
									},
									onPointerUp: () => {
										inputRef.current.touchTag = false;
									},
									onPointerLeave: () => {
										inputRef.current.touchTag = false;
									},
									children: "Tag"
								})]
							})
						] })
					}),
					gfxError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "pointer-events-auto absolute inset-0 grid place-items-center bg-ink p-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "max-w-md text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-display text-3xl",
									children: "This browser can’t show the house"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 text-muted",
									children: gfxError
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "mt-6 min-h-12 rounded-full bg-brass px-5 text-ink",
									onClick: onExit,
									children: "Back"
								})
							]
						})
					}),
					roomFull && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "pointer-events-auto absolute inset-0 grid place-items-center bg-ink/80 p-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "max-w-md rounded-card border border-line bg-ink-2 p-6 text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-display text-3xl",
									children: "This room is full"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 text-muted",
									children: "Hide and seek here is two players. Ask for a new code."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "mt-6 min-h-12 rounded-full bg-brass px-5 text-ink",
									onClick: onExit,
									children: "Back"
								})
							]
						})
					}),
					linkLost && !roomFull && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "pointer-events-auto absolute inset-0 grid place-items-center bg-ink/80 p-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "max-w-md rounded-card border border-line bg-ink-2 p-6 text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-display text-3xl",
									children: "The link dropped"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 text-muted",
									children: "Your friend closed the game or the direct connection failed. Create a new room and try again."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "mt-6 min-h-12 rounded-full bg-brass px-5 text-ink",
									onClick: onExit,
									children: "Back to the menu"
								})
							]
						})
					}),
					phase === "lobby" && net && !roomFull && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "pointer-events-auto absolute inset-x-0 bottom-0 max-h-full overflow-y-auto px-4 pb-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mx-auto mb-2 w-full max-w-3xl rounded-card border border-line bg-ink-2 p-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-end justify-between gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-muted",
										children: "Room code"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-display text-5xl tracking-widest text-brass",
										children: roomCode
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											className: "inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-4 text-sm",
											onClick: () => void copyText(roomCode, "code"),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, {
												className: "size-4",
												"aria-hidden": true
											}), copied === "code" ? "Copied" : "Copy code"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											className: "inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-4 text-sm",
											onClick: () => {
												const link = `${window.location.origin}${window.location.pathname}?room=${roomCode}`;
												copyText(link, "link");
											},
											children: copied === "link" ? "Copied" : "Copy link"
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 text-sm text-muted",
									children: linkLabel
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4 grid gap-4 md:grid-cols-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
										className: "text-sm text-muted",
										children: "You play as"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-2 flex flex-wrap gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoleButton, {
												active: pick === "hider",
												onClick: () => setPick("hider"),
												icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "size-4" }),
												children: "Hider"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoleButton, {
												active: pick === "seeker",
												onClick: () => setPick("seeker"),
												icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-4" }),
												children: "Seeker"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoleButton, {
												active: pick === "either",
												onClick: () => setPick("either"),
												icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shuffle, { className: "size-4" }),
												children: "Either"
											})
										]
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm text-muted",
											children: "Friend"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "mt-2 flex items-center gap-2 text-paper",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, {
													className: "size-4 text-brass",
													"aria-hidden": true
												}),
												partner ? `${partner.name} · wants ${partner.pick}` : "Nobody here yet",
												partner?.ready ? " · ready" : ""
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											disabled: !partner?.hello || linkLost,
											onClick: () => {
												unlockAudio();
												setReady((v) => !v);
											},
											className: "mt-3 min-h-12 rounded-full bg-brass px-5 font-medium text-ink disabled:opacity-40",
											children: ready ? "Waiting for them…" : "Ready"
										})
									] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-4 text-sm text-muted",
									children: "Wander while you wait. When you are both ready, the hider is moved to a hiding spot and the seeker is shut in the closet. Roles swap after each round if you leave them on the suggestion."
								})
							]
						})
					}),
					phase === "result" && !linkLost && !roomFull && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "pointer-events-auto absolute inset-0 grid place-items-center bg-ink/70 p-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "w-full max-w-md rounded-card border border-line bg-ink-2 p-6 text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm uppercase tracking-widest text-brass",
									children: winner === "hider" ? "Hider wins" : "Seeker wins"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "mt-2 font-display text-5xl text-balance",
									children: reason === "tag" ? "Found in the dark." : "The lamp went cold."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 text-muted",
									children: reason === "tag" ? "Close enough, and in sight. That’s a tag." : "Eighty seconds and no hand on a shoulder."
								}),
								net ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-4 text-sm text-paper",
										children: [
											"Next round you are set as ",
											pick === "either" ? "either role" : `the ${pick}`,
											". Change it if you want, then ready up."
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-3 flex flex-wrap justify-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoleButton, {
											active: pick === "hider",
											onClick: () => setPick("hider"),
											icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "size-4" }),
											children: "Hider"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoleButton, {
											active: pick === "seeker",
											onClick: () => setPick("seeker"),
											icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-4" }),
											children: "Seeker"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "mt-5 min-h-12 rounded-full bg-brass px-5 font-medium text-ink",
										onClick: () => setReady(true),
										children: ready ? "Waiting for your friend…" : "Run it back"
									})
								] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "mt-6 min-h-12 rounded-full bg-brass px-5 font-medium text-ink",
									onClick: () => {
										if (!simRef.current) return;
										restartSolo(simRef.current, performance.now());
										setWinner(null);
										setReason(null);
										setPhase("hide");
										phaseRef.current = "hide";
									},
									children: "Play again"
								})
							]
						})
					})
				]
			})
		]
	});
}
function RoleButton({ active, onClick, icon, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		className: active ? "inline-flex min-h-11 items-center gap-2 rounded-full bg-brass px-4 text-sm font-medium text-ink" : "inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-4 text-sm text-paper",
		children: [icon, children]
	});
}
function otherBody(sim, now) {
	if (sim.useBot) return sim.bot;
	return interpolate(sim.samples, now);
}
function pushPose(sim, msg, now) {
	if (msg.seq < sim.lastSeq) return;
	sim.lastSeq = msg.seq;
	sim.samples.push({
		t: now,
		seq: msg.seq,
		x: msg.x,
		z: msg.z,
		yaw: msg.yaw,
		pitch: msg.pitch,
		c: msg.c
	});
	const cutoff = now - 1e3;
	while (sim.samples.length > 2 && sim.samples[0].t < cutoff) sim.samples.shift();
}
function round3(n) {
	return Math.round(n * 1e3) / 1e3;
}
function linkLabelFor(net, state, rtt, havePartner) {
	if (!net) return "";
	if (!net.joined) return "Reaching the introduction service…";
	if (state === "connected") return `Linked${rtt != null ? ` · ${rtt} ms` : ""}`;
	if (state === "failed") return "Networks couldn’t meet. Try another Wi-Fi or a phone hotspot.";
	if (state === "connecting" || state === "new" || havePartner) return "Found them. Opening a direct link…";
	return "Share the code. Leave this page open while they join.";
}
var ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
function makeCode() {
	const bytes = /* @__PURE__ */ new Uint8Array(4);
	crypto.getRandomValues(bytes);
	return Array.from(bytes, (n) => ALPHABET[n % 32]).join("");
}
function cleanCode(raw) {
	return raw.toUpperCase().replace(/[^A-Z2-9]/g, "").replace(/[IO]/g, "").slice(0, 4);
}
function GameApp() {
	const [session, setSession] = (0, import_react.useState)(null);
	const [name, setName] = (0, import_react.useState)("Guest");
	const [code, setCode] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		const saved = localStorage.getItem("larkspur-name");
		if (saved) setName(saved.slice(0, 18));
		const room = new URLSearchParams(window.location.search).get("room");
		if (room) setCode(cleanCode(room));
	}, []);
	if (session?.kind === "solo") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Match, {
		net: null,
		creator: false,
		soloRole: session.role,
		selfId: "solo-player",
		name: "You",
		roomCode: "",
		onExit: () => setSession(null)
	});
	if (session?.kind === "net") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OnlineMatch, {
		room: session.room,
		name: session.name,
		creator: session.creator,
		onExit: () => setSession(null)
	}, `${session.room}:${session.name}`);
	const startOnline = (room, creator) => {
		const cleanName = name.trim().slice(0, 18) || "Guest";
		localStorage.setItem("larkspur-name", cleanName);
		const url = new URL(window.location.href);
		url.searchParams.set("room", room);
		window.history.replaceState(null, "", `${url.pathname}${url.search}`);
		setSession({
			kind: "net",
			room,
			creator,
			name: cleanName
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-dvh overflow-x-hidden bg-ink text-paper",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex min-h-dvh w-full max-w-6xl flex-col px-5 py-8 md:px-10 md:py-12",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid size-11 place-items-center rounded-full border border-line bg-ink-2 text-brass",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lamp, {
							className: "size-5",
							"aria-hidden": true
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs tracking-widest text-muted uppercase",
						children: "Night wing"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-lg leading-none",
						children: "Larkspur"
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "hidden text-sm text-muted sm:block",
					children: "Two players, one house"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 grid flex-1 items-start gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display text-5xl leading-tight text-balance sm:text-6xl",
							children: "Hide in the dark. Or bring the lamp."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-5 max-w-xl text-lg leading-relaxed text-pretty text-muted",
							children: "First-person hide and seek. One of you disappears into Larkspur House. The other counts in a closet, then hunts by flashlight."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 flex flex-col gap-3 sm:flex-row",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								"data-qa": "practice",
								onClick: () => setSession({
									kind: "solo",
									role: "hider"
								}),
								className: "inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-brass px-5 font-medium text-ink",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, {
									className: "size-5",
									"aria-hidden": true
								}), "Start practice"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setSession({
									kind: "solo",
									role: "seeker"
								}),
								className: "inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-line px-5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, {
									className: "size-5 text-brass",
									"aria-hidden": true
								}), "Hunt the ghost"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm text-muted",
							children: "Practice is you against the house ghost, on this device. No one else joins that round."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "mt-8 rounded-card border border-line bg-ink-2 p-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, {
										className: "size-5 text-brass",
										"aria-hidden": true
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "font-display text-2xl",
										children: "Play with a friend"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm leading-relaxed text-muted",
									children: "Nothing to install. Create a room, send the code, and your friend types it into this same game on their computer or phone. You connect directly to each other."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "mt-4 block text-sm text-muted",
									htmlFor: "player-name",
									children: "Your name"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									id: "player-name",
									value: name,
									maxLength: 18,
									onChange: (e) => setName(e.target.value),
									className: "mt-2 min-h-12 w-full rounded-full border border-line bg-ink px-4 text-paper outline-none"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4 flex flex-col gap-3 sm:flex-row",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => startOnline(makeCode(), true),
										className: "inline-flex min-h-12 flex-1 items-center justify-center rounded-full bg-brass px-5 font-medium text-ink",
										children: "Create room"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
										className: "flex min-w-0 flex-1 gap-2",
										onSubmit: (e) => {
											e.preventDefault();
											if (code.length === 4) startOnline(code, false);
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											"aria-label": "Room code",
											value: code,
											onChange: (e) => setCode(cleanCode(e.target.value)),
											placeholder: "CODE",
											className: "min-h-12 w-full min-w-0 rounded-full border border-line bg-ink px-4 tracking-widest text-paper uppercase outline-none"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "submit",
											disabled: code.length !== 4,
											className: "min-h-12 shrink-0 rounded-full border border-line px-4 disabled:opacity-40",
											children: "Join"
										})]
									})]
								}),
								code.length === 4 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 text-sm text-muted",
									children: "A code is waiting in the address bar. Join if a friend sent it to you, or create a fresh room."
								})
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "min-w-0 rounded-card border border-line bg-ink-2 p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl",
							children: "How a round works"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
							className: "mt-4 flex list-decimal flex-col gap-3 pl-5 text-sm leading-relaxed text-muted",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "One player creates a room and shares the four-letter code." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "The other opens this game and joins with that code." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Pick hider, seeker, or either. Both press Ready." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "The hider gets 24 seconds. The seeker is shut in the foyer closet." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "The door opens. The seeker has a flashlight and 80 seconds." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Stand close, in sight, and press E to tag — or survive the clock." })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mt-6 font-display text-xl",
							children: "Controls"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "mt-3 flex flex-col gap-2 text-sm text-muted",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "WASD or arrow keys move. A is left, D is right." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Click the scene to look around. Esc lets go of the mouse." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "C or Ctrl crouches. Crouch behind hedges, sofas, and under the dining table." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "E tags, only for the seeker, only when you are close and can see them." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "On a phone, the left side moves, the right side looks, and the buttons crouch or tag." })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "mt-6 flex items-center gap-2 font-display text-xl",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, {
								className: "size-5 text-brass",
								"aria-hidden": true
							}), "Playing across the internet"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm leading-relaxed text-pretty text-muted",
							children: "After you publish this game, send your friend the public link and the room code. Two browsers are enough. A small introduction service only helps you find each other. After that, movement goes straight between your two devices. You do not open a port on your router, and you do not run a server on your computer."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm leading-relaxed text-pretty text-muted",
							children: "It is free. Rooms hold two people who chose to play together. Some locked-down school or office networks cannot open a direct link — the lobby will say so instead of hanging. A direct link shares network addresses the way a video call does. The game also trusts both players about where they are standing, so keep it to friends, not a tournament."
						})
					]
				})]
			})]
		})
	});
}
function OnlineMatch({ room, name, creator, onExit }) {
	const net = useP2PRoom({
		room,
		name
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Match, {
		net,
		creator,
		soloRole: null,
		selfId: net.selfId,
		name,
		roomCode: room,
		onExit
	});
}
var house_exports = /* @__PURE__ */ __exportAll({ component: () => SplitComponent });
var SplitComponent = GameApp;
//#endregion
export { LAMPS as n, VISUALS as r, house_exports as t };
