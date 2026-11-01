/** Rules, movement, and the practice ghost.
 *
 *  FPS basis (three.js, Y up, yaw 0 looks down -Z):
 *    forward = (-sin(yaw), -cos(yaw))
 *    right   = ( cos(yaw), -sin(yaw))
 *  W/S walk forward/back. A strafes left (−right), D strafes right.
 *  A/D do not turn the body — the mouse does. Do not "fix" A by flipping yaw.
 */

import { resolveCylinder, segmentBlocked, type AABB } from "./collision";
import { HIDER_SPAWNS, ROOM_CENTERS, SEEKER_SPAWN, solids } from "./world";
import type { Phase, PickRole, Role } from "./types";

export const PLAYER_RADIUS = 0.32;
export const HEIGHT_STAND = 1.72;
export const HEIGHT_CROUCH = 0.9;
export const EYE_STAND = 1.56;
export const EYE_CROUCH = 0.78;
export const WALK_SPEED = 4.45;
export const CROUCH_SPEED = 2.15;
export const TAG_RANGE = 1.72;
export const HIDE_MS = 24_000;
export const SEEK_MS = 80_000;

export type Body = {
  x: number;
  z: number;
  vx: number;
  vz: number;
  yaw: number;
  pitch: number;
  crouch: boolean;
  stuck: number;
};

export type PoseSample = {
  t: number;
  seq: number;
  x: number;
  z: number;
  yaw: number;
  pitch: number;
  c: 0 | 1;
};

export type Sim = {
  phase: Phase;
  role: Role;
  me: Body;
  bot: Body;
  useBot: boolean;
  round: number;
  startedAt: number;
  hideMs: number;
  seekMs: number;
  winner: Role | null;
  reason: "tag" | "time" | null;
  contested: boolean;
  endSent: boolean;
  samples: PoseSample[];
  lastSeq: number;
  seq: number;
  walk: number;
  shake: number;
  stepAcc: number;
  lastTick: number;
  fallbackEnd: number;
};

export function basis(yaw: number): { fx: number; fz: number; rx: number; rz: number } {
  return {
    fx: -Math.sin(yaw),
    fz: -Math.cos(yaw),
    rx: Math.cos(yaw),
    rz: -Math.sin(yaw),
  };
}

export function lerpAngle(a: number, b: number, t: number): number {
  let d = b - a;
  while (d > Math.PI) d -= Math.PI * 2;
  while (d < -Math.PI) d += Math.PI * 2;
  return a + d * t;
}

export function eyeHeight(crouch: boolean): number {
  return crouch ? EYE_CROUCH : EYE_STAND;
}

export function hiderSpawn(round: number): { x: number; z: number; yaw: number } {
  const i = Math.abs(Math.trunc(round) * 3 + 1) % HIDER_SPAWNS.length;
  return HIDER_SPAWNS[i];
}

export function freshBody(spawn: { x: number; z: number; yaw: number }): Body {
  return {
    x: spawn.x,
    z: spawn.z,
    vx: 0,
    vz: 0,
    yaw: spawn.yaw,
    pitch: 0,
    crouch: false,
    stuck: 0,
  };
}

export function place(body: Body, spawn: { x: number; z: number; yaw: number }) {
  body.x = spawn.x;
  body.z = spawn.z;
  body.yaw = spawn.yaw;
  body.pitch = 0;
  body.vx = 0;
  body.vz = 0;
  body.crouch = false;
  body.stuck = 0;
}

export function createSim(soloRole: Role | null, selfKey: string): Sim {
  const code = selfKey.charCodeAt(2) || 1;
  const side = code % 2 === 0 ? -1.3 : 1.3;
  const meSpawn =
    soloRole === "seeker"
      ? SEEKER_SPAWN
      : soloRole === "hider"
        ? hiderSpawn(1)
        : { x: side, z: 7.6, yaw: 0 };
  const botSpawn = soloRole === "seeker" ? hiderSpawn(2) : SEEKER_SPAWN;
  const sim: Sim = {
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
    fallbackEnd: 0,
  };
  if (soloRole === "seeker") sim.bot.crouch = true;
  return sim;
}

export function beginRound(
  sim: Sim,
  args: { round: number; role: Role; hideMs: number; seekMs: number; contested: boolean; now: number },
) {
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

export function conclude(sim: Sim, winner: Role, reason: "tag" | "time"): boolean {
  if (sim.phase === "result") return false;
  sim.phase = "result";
  sim.winner = winner;
  sim.reason = reason;
  sim.endSent = true;
  sim.shake = reason === "tag" ? 1 : 0.3;
  return true;
}

/** Hide → seek on the local clock. Only the authority emits a time-win. */
export function advanceClock(sim: Sim, now: number, authoritative: boolean): "seek" | "time" | null {
  if (sim.phase !== "hide" && sim.phase !== "seek") return null;
  const elapsed = now - sim.startedAt;
  if (sim.phase === "hide" && elapsed >= sim.hideMs) {
    sim.phase = "seek";
    return "seek";
  }
  if (sim.phase === "seek" && elapsed >= sim.hideMs + sim.seekMs) {
    if (authoritative) {
      if (conclude(sim, "hider", "time")) return "time";
    } else if (sim.fallbackEnd === 0) {
      sim.fallbackEnd = now;
    } else if (now - sim.fallbackEnd > 2000) {
      if (conclude(sim, "hider", "time")) return "time";
    }
  }
  return null;
}

export function remainingMs(sim: Sim, now: number): number {
  const elapsed = now - sim.startedAt;
  if (sim.phase === "hide") return sim.hideMs - elapsed;
  if (sim.phase === "seek") return sim.hideMs + sim.seekMs - elapsed;
  return 0;
}

export function formatClock(ms: number): string {
  const s = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
}

export type MoveInput = { f: number; s: number; crouch: boolean };

export function axesFromKeys(
  keys: Set<string>,
  touch: { f: number; s: number },
): { f: number; s: number; crouch: boolean; tag: boolean } {
  let f = touch.f;
  let s = touch.s;
  if (keys.has("KeyW") || keys.has("ArrowUp")) f += 1;
  if (keys.has("KeyS") || keys.has("ArrowDown")) f -= 1;
  // A is left, D is right. Strafe, not steering.
  if (keys.has("KeyA") || keys.has("ArrowLeft")) s -= 1;
  if (keys.has("KeyD") || keys.has("ArrowRight")) s += 1;
  f = Math.max(-1, Math.min(1, f));
  s = Math.max(-1, Math.min(1, s));
  const crouch = keys.has("KeyC") || keys.has("ControlLeft") || keys.has("ControlRight");
  const tag = keys.has("KeyE");
  return { f, s, crouch, tag };
}

export function stepBody(
  body: Body,
  input: MoveInput,
  dt: number,
  boxes: readonly AABB[],
  opts?: { frozen?: boolean; maxSpeed?: number },
) {
  if (opts?.frozen) {
    body.vx = 0;
    body.vz = 0;
    return;
  }
  body.crouch = input.crouch;
  const cap = opts?.maxSpeed ?? (body.crouch ? CROUCH_SPEED : WALK_SPEED);
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
    body.vx = (body.vx / sp) * cap;
    body.vz = (body.vz / sp) * cap;
  }
  const height = body.crouch ? HEIGHT_CROUCH : HEIGHT_STAND;
  let left = dt;
  while (left > 1e-5) {
    const speed = Math.hypot(body.vx, body.vz);
    const step = Math.min(left, speed > 0.05 ? 0.12 / speed : left);
    body.x += body.vx * step;
    body.z += body.vz * step;
    const resolved = resolveCylinder(body.x, body.z, 0, height, PLAYER_RADIUS, boxes);
    const penX = resolved.x - body.x;
    const penZ = resolved.z - body.z;
    body.x = resolved.x;
    body.z = resolved.z;
    // pen is the push out of a wall. If velocity still points into that wall, stop it.
    if (penX * body.vx < 0) body.vx = 0;
    if (penZ * body.vz < 0) body.vz = 0;
    left -= step;
  }
}

export function taggable(a: Body, b: Body, boxes: readonly AABB[]): boolean {
  const dx = a.x - b.x;
  const dz = a.z - b.z;
  if (dx * dx + dz * dz > TAG_RANGE * TAG_RANGE) return false;
  const ah = a.crouch ? 0.62 : 1.2;
  const bh = b.crouch ? 0.5 : 1.2;
  return !segmentBlocked(a.x, ah, a.z, b.x, bh, b.z, boxes);
}

export function withinSlack(a: { x: number; z: number }, b: { x: number; z: number }): boolean {
  const dx = a.x - b.x;
  const dz = a.z - b.z;
  return dx * dx + dz * dz <= 2.45 * 2.45;
}

export function resolveRoles(
  a: { id: string; pick: PickRole },
  b: { id: string; pick: PickRole },
  salt: number,
): { hiderId: string; seekerId: string; contested: boolean } {
  if (a.pick === "hider" && b.pick !== "hider") return { hiderId: a.id, seekerId: b.id, contested: false };
  if (b.pick === "hider" && a.pick !== "hider") return { hiderId: b.id, seekerId: a.id, contested: false };
  if (a.pick === "seeker" && b.pick !== "seeker") return { hiderId: b.id, seekerId: a.id, contested: false };
  if (b.pick === "seeker" && a.pick !== "seeker") return { hiderId: a.id, seekerId: b.id, contested: false };
  const contested = a.pick === b.pick && a.pick !== "either";
  const [lo, hi] = a.id < b.id ? [a, b] : [b, a];
  const loHides = salt % 2 === 0;
  return {
    hiderId: loHides ? lo.id : hi.id,
    seekerId: loHides ? hi.id : lo.id,
    contested,
  };
}

export function roomIndex(x: number, z: number): number {
  const col = x < -4 ? 0 : x < 4 ? 1 : 2;
  const row = z < -2 ? 0 : z < 5 ? 1 : 2;
  return row * 3 + col;
}

const LINKS: readonly (readonly number[])[] = [
  [1, 3],
  [0, 2, 4],
  [1, 5],
  [0, 4, 6],
  [1, 3, 5, 7],
  [2, 4, 8],
  [3, 7],
  [4, 6, 8],
  [5, 7],
];

function nextRoom(from: number, to: number): number {
  if (from === to) return to;
  const prev = new Map<number, number>();
  const q = [from];
  prev.set(from, -1);
  while (q.length > 0) {
    const n = q.shift()!;
    if (n === to) break;
    for (const c of LINKS[n] ?? []) {
      if (prev.has(c)) continue;
      prev.set(c, n);
      q.push(c);
    }
  }
  if (!prev.has(to)) return from;
  let cur = to;
  while (prev.get(cur) !== from && prev.get(cur) !== -1 && prev.get(cur) !== undefined) {
    cur = prev.get(cur)!;
  }
  return cur;
}

function sees(a: Body, b: Body, boxes: readonly AABB[], range: number): boolean {
  const dx = a.x - b.x;
  const dz = a.z - b.z;
  if (dx * dx + dz * dz > range * range) return false;
  const ah = a.crouch ? 0.62 : 1.25;
  const bh = b.crouch ? 0.5 : 1.15;
  return !segmentBlocked(a.x, ah, a.z, b.x, bh, b.z, boxes);
}

/** Practice opponent. Hider-bot stays crouched in a spot. Seeker-bot patrols doors. */
export function stepBot(bot: Body, player: Body, phase: Phase, botRole: Role, dt: number, boxes: readonly AABB[]) {
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
    // Walk straight out of the closet before pathing across the house.
    goalX = 3.12;
    goalZ = 9.35;
  } else if (!(same && spotted)) {
    const nxt = nextRoom(roomIndex(bot.x, bot.z), roomIndex(player.x, player.z));
    const c = ROOM_CENTERS[nxt] ?? ROOM_CENTERS[4];
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
  const strafe = bot.stuck > 0.45 ? 1 : 0;
  stepBody(bot, { f: 1, s: strafe, crouch: false }, dt, boxes, { maxSpeed: 3.35 });
  const moved = Math.hypot(bot.x - beforeX, bot.z - beforeZ);
  bot.stuck = moved < 0.25 * dt ? bot.stuck + dt : 0;
}

export function pushSample(
  sim: Sim,
  msg: { seq: number; x: number; z: number; yaw: number; pitch: number; c: 0 | 1 },
  now: number,
) {
  if (msg.seq < sim.lastSeq) return;
  sim.lastSeq = msg.seq;
  sim.samples.push({ ...msg, t: now });
  const cutoff = now - 1000;
  while (sim.samples.length > 2 && sim.samples[0].t < cutoff) sim.samples.shift();
}

export function interpolate(samples: readonly PoseSample[], now: number): Body | null {
  if (samples.length === 0) return null;
  const target = now - 90;
  const last = samples[samples.length - 1];
  let a = samples[Math.max(0, samples.length - 2)];
  let b = last;
  if (target < last.t) {
    for (let i = 0; i < samples.length - 1; i += 1) {
      if (samples[i].t <= target && samples[i + 1].t >= target) {
        a = samples[i];
        b = samples[i + 1];
        break;
      }
    }
  }
  if (a === b || b.t === a.t) {
    return { x: b.x, z: b.z, yaw: b.yaw, pitch: b.pitch, crouch: b.c === 1, vx: 0, vz: 0, stuck: 0 };
  }
  const u = Math.min(1, Math.max(0, (target - a.t) / (b.t - a.t)));
  return {
    x: a.x + (b.x - a.x) * u,
    z: a.z + (b.z - a.z) * u,
    yaw: lerpAngle(a.yaw, b.yaw, u),
    pitch: a.pitch + (b.pitch - a.pitch) * u,
    crouch: (u < 0.5 ? a.c : b.c) === 1,
    vx: 0,
    vz: 0,
    stuck: 0,
  };
}

export function restartSolo(sim: Sim, now: number) {
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

export function worldSolids(phase: Phase): readonly AABB[] {
  return solids(phase === "hide");
}
