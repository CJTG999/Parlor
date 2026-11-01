/** Larkspur House — one floor, nine spaces, built as boxes.
 *
 *  Top-down (X right, Z down the page). Doors are 1.7m gaps.
 *
 *    study     court     dining          z = -11.5 .. -2
 *    kitchen   hall      parlor          z = -2 .. 5
 *    bedroom   foyer     library         z = 5 .. 12.5
 *
 *  The seeker counts in a closet in the foyer's south-east corner.
 *  Crouch-height tables have their solid slab up at y ≈ 1.0 so a
 *  crouched body (0.9m) walks under and a standing body does not.
 */

import type { AABB } from "./collision";

export type Visual = {
  t: "box" | "cyl";
  x: number;
  y: number;
  z: number;
  w: number;
  h: number;
  d: number;
  r?: number;
  color: string;
  blocks: boolean;
  hideOnly?: boolean;
  glow?: boolean;
};

const WALL = "#5c6c74";
const FLOOR = "#6b4a30";
const STONE = "#3e4a46";
const CEIL = "#1c2126";
const WOOD = "#6d4b30";
const WOOD_D = "#3a2618";
const CLOTH = "#23443a";
const ROSE = "#7a3a48";
const HEDGE = "#1e5238";
const METAL = "#8c867a";
const BOOK = "#8a6840";
const BOOK2 = "#3e5560";
const WATER = "#1a4558";
const GLASS = "#d5e6ef";
const DOOR = "#2c241c";
const RUG = "#6e303c";

const visuals: Visual[] = [];

function box(
  x: number,
  y: number,
  z: number,
  w: number,
  h: number,
  d: number,
  color: string,
  blocks = true,
  extra?: Partial<Visual>,
) {
  visuals.push({ t: "box", x, y, z, w, h, d, color, blocks, ...extra });
}

function cyl(
  x: number,
  y: number,
  z: number,
  r: number,
  h: number,
  color: string,
  blocks = true,
  extra?: Partial<Visual>,
) {
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
    ...extra,
  });
}

/** Wall running along Z, centered on x. */
function wallX(x: number, z1: number, z2: number) {
  const z = (z1 + z2) / 2;
  box(x, 1.55, z, 0.32, 3.1, Math.abs(z2 - z1), WALL);
}

/** Wall running along X, centered on z. */
function wallZ(z: number, x1: number, x2: number) {
  const x = (x1 + x2) / 2;
  box(x, 1.55, z, Math.abs(x2 - x1), 3.1, 0.32, WALL);
}

// Outer shell.
wallX(-14.5, -11.5, 12.5);
wallX(14.5, -11.5, 12.5);
wallZ(-11.5, -14.5, 14.5);
wallZ(12.5, -14.5, 14.5);

// West divider x = -4, with three doors.
wallX(-4, -11.5, -7.6);
wallX(-4, -5.9, 0.65);
wallX(-4, 2.35, 7.9);
wallX(-4, 9.6, 12.5);

// East divider x = 4.
wallX(4, -11.5, -7.6);
wallX(4, -5.9, 0.65);
wallX(4, 2.35, 7.9);
wallX(4, 9.6, 12.5);

// North/mid seam z = -2.
wallZ(-2, -14.5, -10.1);
wallZ(-2, -8.4, -0.85);
wallZ(-2, 0.85, 8.4);
wallZ(-2, 10.1, 14.5);

// Mid/south seam z = 5.
wallZ(5, -14.5, -10.1);
wallZ(5, -8.4, -0.85);
wallZ(5, 0.85, 8.4);
wallZ(5, 10.1, 14.5);

// Foyer closet. The seeker stands inside; the door exists only while they count.
wallX(2.32, 10.72, 12.5);
box(3.12, 1.25, 10.72, 1.3, 2.5, 0.16, DOOR, true, { hideOnly: true });

// Floors and ceilings (visual only — feet stay at y = 0).
box(0, -0.12, 0.5, 29.2, 0.24, 24.2, FLOOR, false);
box(0, 0.03, -6.75, 7.5, 0.06, 9.0, STONE, false);
box(-9.25, 3.12, -6.75, 10.1, 0.1, 9.1, CEIL, false);
box(9.25, 3.12, -6.75, 10.1, 0.1, 9.1, CEIL, false);
box(-9.25, 3.12, 1.5, 10.1, 0.1, 6.6, CEIL, false);
box(0, 3.12, 1.5, 7.5, 0.1, 6.6, CEIL, false);
box(9.25, 3.12, 1.5, 10.1, 0.1, 6.6, CEIL, false);
box(-9.25, 3.12, 8.75, 10.1, 0.1, 7.1, CEIL, false);
box(0, 3.12, 8.75, 7.5, 0.1, 7.1, CEIL, false);
box(9.25, 3.12, 8.75, 10.1, 0.1, 7.1, CEIL, false);

// Moonlit window panes.
box(-9.2, 1.7, -11.28, 1.6, 1.1, 0.08, GLASS, false, { glow: true });
box(9.2, 1.7, -11.28, 1.8, 1.1, 0.08, GLASS, false, { glow: true });
box(-14.28, 1.7, 1.5, 0.08, 1.1, 1.4, GLASS, false, { glow: true });
box(14.28, 1.7, 8.6, 0.08, 1.2, 1.5, GLASS, false, { glow: true });
box(0, 1.6, 12.28, 1.4, 1.3, 0.08, GLASS, false, { glow: true });

// —— Study ——
box(-13.55, 1.1, -7.2, 0.5, 2.2, 2.6, WOOD_D);
box(-9.4, 0.4, -10.55, 2.3, 0.8, 0.8, WOOD);
box(-9.4, 0.45, -9.55, 0.55, 0.9, 0.55, ROSE, true);
box(-6.1, 0.35, -4.15, 0.7, 0.7, 0.7, WOOD_D);
box(-5.55, 0.28, -4.7, 0.55, 0.55, 0.55, WOOD);

// —— Court (hedges hide a crouched body; a standing eye looks over them) ——
box(-2.35, 0.61, -9.3, 1.7, 1.22, 1.45, HEDGE);
box(2.35, 0.61, -9.3, 1.7, 1.22, 1.45, HEDGE);
box(-2.35, 0.61, -4.55, 1.45, 1.22, 1.25, HEDGE);
box(2.35, 0.61, -4.55, 1.45, 1.22, 1.25, HEDGE);
cyl(0, 0.28, -6.8, 0.72, 0.56, STONE);
cyl(0, 0.6, -6.8, 0.42, 0.1, WATER, false);

// —— Dining (tabletop is a crouch tunnel) ——
box(9.3, 1.0, -6.9, 2.5, 0.1, 1.25, WOOD);
box(8.4, 0.48, -6.9, 0.12, 0.96, 0.12, WOOD_D, false);
box(10.2, 0.48, -6.9, 0.12, 0.96, 0.12, WOOD_D, false);
box(13.55, 0.48, -6.9, 0.55, 0.96, 2.3, WOOD_D);
box(9.2, 0.42, -10.7, 2.2, 0.84, 0.5, WOOD);

// —— Kitchen ——
box(-12.3, 0.46, -1.32, 2.0, 0.92, 0.58, WOOD_D);
box(-13.6, 0.46, 0.7, 0.58, 0.92, 2.0, WOOD_D);
box(-9.3, 0.48, 1.55, 1.9, 0.96, 0.9, WOOD);
box(-13.55, 1.02, 3.85, 0.75, 2.05, 0.75, METAL);

// —— Hall ——
cyl(-2.35, 0.55, 3.35, 0.32, 1.1, STONE);
cyl(2.4, 0.4, -0.15, 0.34, 0.8, HEDGE);

// —— Parlor ——
box(12.9, 0.52, 1.5, 0.75, 1.05, 2.5, CLOTH);
box(10.7, 0.32, 1.5, 1.15, 0.4, 0.7, WOOD);
box(8.6, 0.5, 3.85, 1.55, 1.0, 0.7, WOOD_D);

// —— Bedroom ——
box(-10.4, 0.28, 10.35, 2.1, 0.55, 1.45, ROSE);
box(-10.4, 0.7, 11.15, 2.1, 1.15, 0.16, WOOD_D);
box(-13.5, 1.05, 6.85, 0.55, 2.1, 1.45, WOOD_D);
box(-6.15, 0.42, 11.35, 1.35, 0.84, 0.5, WOOD);

// —— Foyer ——
box(0, 0.02, 8.5, 3.4, 0.04, 3.6, RUG, false);
box(-2.55, 0.4, 11.45, 1.3, 0.8, 0.42, WOOD);
cyl(-2.55, 0.85, 8.9, 0.16, 1.7, WOOD_D);

// —— Library aisles ——
box(6.55, 1.1, 9.35, 0.48, 2.2, 2.5, BOOK);
box(6.55, 1.35, 9.35, 0.5, 0.18, 2.5, BOOK2, false);
box(10.05, 1.1, 9.35, 0.48, 2.2, 2.5, BOOK2);
box(12.7, 1.1, 7.3, 0.48, 2.2, 1.8, BOOK);
box(8.1, 0.4, 11.45, 1.4, 0.8, 0.65, WOOD);
box(12.6, 0.45, 11.25, 0.6, 0.9, 0.6, CLOTH);

export const VISUALS: readonly Visual[] = visuals;

export const LAMPS: readonly { x: number; y: number; z: number; color: number; intensity: number; distance: number }[] = [
  { x: -9.2, y: 2.45, z: -6.8, color: 0xffb56a, intensity: 70, distance: 14 },
  { x: 0, y: 4.2, z: -6.8, color: 0xc5d6ef, intensity: 90, distance: 18 },
  { x: 9.3, y: 2.45, z: -6.8, color: 0xffb56a, intensity: 70, distance: 14 },
  { x: -9.3, y: 2.45, z: 1.5, color: 0xffc48a, intensity: 64, distance: 13 },
  { x: 0, y: 2.45, z: 1.6, color: 0xffc48a, intensity: 50, distance: 12 },
  { x: 10.4, y: 2.45, z: 1.6, color: 0xffb56a, intensity: 64, distance: 13 },
  { x: -9.4, y: 2.45, z: 8.8, color: 0xffb0c0, intensity: 56, distance: 13 },
  { x: 0.2, y: 2.45, z: 8.4, color: 0xffc48a, intensity: 64, distance: 12 },
  { x: 9.2, y: 2.45, z: 8.6, color: 0xffc48a, intensity: 64, distance: 13 },
  { x: 3.15, y: 2.3, z: 11.45, color: 0xffe0b0, intensity: 28, distance: 6 },
];

export const HIDER_SPAWNS: readonly { x: number; z: number; yaw: number }[] = [
  { x: -11.2, z: 8.05, yaw: 0.3 },
  { x: -7.1, z: -8.5, yaw: 0.4 },
  { x: 8.25, z: 9.15, yaw: Math.PI },
  { x: -6.85, z: 3.25, yaw: -0.8 },
  { x: 6.7, z: -9.15, yaw: 1.1 },
  { x: 11.15, z: 3.15, yaw: Math.PI * 0.85 },
];

/** Inside the foyer closet, facing the door (yaw 0 looks toward -Z). */
export const SEEKER_SPAWN = { x: 3.12, z: 11.5, yaw: 0 };

function toAABB(v: Visual): AABB {
  if (v.t === "cyl") {
    const r = v.r ?? v.w / 2;
    return {
      minX: v.x - r,
      maxX: v.x + r,
      minY: v.y - v.h / 2,
      maxY: v.y + v.h / 2,
      minZ: v.z - r,
      maxZ: v.z + r,
    };
  }
  return {
    minX: v.x - v.w / 2,
    maxX: v.x + v.w / 2,
    minY: v.y - v.h / 2,
    maxY: v.y + v.h / 2,
    minZ: v.z - v.d / 2,
    maxZ: v.z + v.d / 2,
  };
}

function computeSolids(hideDoor: boolean): AABB[] {
  const out: AABB[] = [];
  for (const v of visuals) {
    if (!v.blocks) continue;
    if (v.hideOnly && !hideDoor) continue;
    out.push(toAABB(v));
  }
  return out;
}

export const SOLIDS_OPEN: readonly AABB[] = computeSolids(false);
export const SOLIDS_SHUT: readonly AABB[] = computeSolids(true);

export function solids(hideDoor: boolean): readonly AABB[] {
  return hideDoor ? SOLIDS_SHUT : SOLIDS_OPEN;
}

/** Room centers used by the practice ghost. Index matches roomIndex() in logic. */
export const ROOM_CENTERS: readonly { x: number; z: number }[] = [
  { x: -9.2, z: -6.8 },
  { x: 0, z: -6.8 },
  { x: 9.2, z: -6.8 },
  { x: -9.2, z: 1.5 },
  { x: 0, z: 1.5 },
  { x: 9.2, z: 1.5 },
  { x: -9.2, z: 8.7 },
  { x: 0, z: 8.6 },
  { x: 9.2, z: 8.7 },
];
