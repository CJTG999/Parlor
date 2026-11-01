/** Cylinder-vs-AABB slide and a segment test for "can the seeker see you?".
 *  The player is a vertical capsule approximated as a cylinder of fixed radius. */

export type AABB = {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  minZ: number;
  maxZ: number;
};

function clamp(v: number, a: number, b: number): number {
  return v < a ? a : v > b ? b : v;
}

/** Push a vertical cylinder out of any box it overlaps. Y is feet height. */
export function resolveCylinder(
  x: number,
  z: number,
  feetY: number,
  height: number,
  radius: number,
  boxes: readonly AABB[],
): { x: number; z: number } {
  const top = feetY + height;
  for (let iter = 0; iter < 3; iter += 1) {
    for (const b of boxes) {
      if (top <= b.minY + 0.001 || feetY >= b.maxY - 0.001) continue;
      const cx = clamp(x, b.minX, b.maxX);
      const cz = clamp(z, b.minZ, b.maxZ);
      const dx = x - cx;
      const dz = z - cz;
      const d2 = dx * dx + dz * dz;
      if (d2 >= radius * radius) continue;
      if (d2 > 1e-8) {
        const d = Math.sqrt(d2);
        const push = radius - d + 0.001;
        x += (dx / d) * push;
        z += (dz / d) * push;
      } else {
        const left = x - b.minX;
        const right = b.maxX - x;
        const north = z - b.minZ;
        const south = b.maxZ - z;
        const m = Math.min(left, right, north, south);
        if (m === left) x = b.minX - radius - 0.001;
        else if (m === right) x = b.maxX + radius + 0.001;
        else if (m === north) z = b.minZ - radius - 0.001;
        else z = b.maxZ + radius + 0.001;
      }
    }
  }
  return { x, z };
}

function slab(
  origin: number,
  delta: number,
  min: number,
  max: number,
  tmin: number,
  tmax: number,
): { tmin: number; tmax: number } | null {
  if (Math.abs(delta) < 1e-8) {
    if (origin < min || origin > max) return null;
    return { tmin, tmax };
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
  return { tmin: nmin, tmax: nmax };
}

/** True when the segment hits a solid before it reaches the target. */
export function segmentBlocked(
  x0: number,
  y0: number,
  z0: number,
  x1: number,
  y1: number,
  z1: number,
  boxes: readonly AABB[],
): boolean {
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
    if (span.tmax >= 0 && span.tmin <= 0.98) return true;
  }
  return false;
}
