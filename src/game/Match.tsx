/** First-person match: local sim, optional practice ghost, optional WebRTC peer.
 *  The host (room creator, or the lower id if both joined) starts rounds and
 *  confirms tags. Movement is client-side; a friend could lie about position.
 */

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowLeft, Copy, Eye, EyeOff, Shuffle, Timer, Users } from "lucide-react";
import type { P2PRoomHandle } from "@/lib/multiplayer";
import { heartbeat, playEscape, playFound, playReady, playStep, playTick, unlockAudio } from "./audio";
import {
  advanceClock,
  axesFromKeys,
  beginRound,
  conclude,
  createSim,
  eyeHeight,
  formatClock,
  HIDE_MS,
  interpolate,
  remainingMs,
  resolveRoles,
  restartSolo,
  SEEK_MS,
  stepBody,
  stepBot,
  taggable,
  withinSlack,
  worldSolids,
  type Body,
  type Sim,
} from "./logic";
import type { NetMsg, Phase, PickRole, Role } from "./types";
import type { View } from "./view";

declare global {
  interface Window {
    __gameReady?: boolean;
    __controlsTest?: {
      getYaw: () => number;
      getSpeed: () => number;
      getPos: () => { x: number; z: number };
      setKeys: (codes: string[]) => void;
      setSteer?: (v: number) => void;
    };
  }
}

type Partner = {
  id: string;
  name: string;
  creator: boolean;
  pick: PickRole;
  ready: boolean;
  hello: boolean;
};

type InputState = {
  keys: Set<string>;
  forced: Set<string> | null;
  touch: { f: number; s: number };
  touchCrouch: boolean;
  touchTag: boolean;
  lookDx: number;
  lookDy: number;
  tagLatch: boolean;
};

function hostOf(selfId: string, creator: boolean, partner: Partner | null): boolean {
  if (!partner?.hello) return creator;
  if (creator !== partner.creator) return creator;
  return selfId < partner.id;
}

function isNetMsg(data: unknown): data is NetMsg {
  return !!data && typeof data === "object" && "k" in data;
}

export function Match({
  net,
  creator,
  soloRole,
  selfId,
  name,
  roomCode,
  onExit,
}: {
  net: P2PRoomHandle | null;
  creator: boolean;
  soloRole: Role | null;
  selfId: string;
  name: string;
  roomCode: string;
  onExit: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const simRef = useRef<Sim | null>(null);
  if (!simRef.current) simRef.current = createSim(soloRole, selfId);
  const inputRef = useRef<InputState>({
    keys: new Set(),
    forced: null,
    touch: { f: 0, s: 0 },
    touchCrouch: false,
    touchTag: false,
    lookDx: 0,
    lookDy: 0,
    tagLatch: false,
  });
  const partnerRef = useRef<Partner | null>(null);
  const notedRound = useRef<number>(-1);
  const startLock = useRef(false);
  const timerRef = useRef<HTMLSpanElement>(null);
  const bigRef = useRef<HTMLParagraphElement>(null);
  const tagRef = useRef<HTMLParagraphElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const netRef = useRef(net);
  netRef.current = net;
  const nameRef = useRef(name);
  nameRef.current = name;
  const creatorRef = useRef(creator);
  creatorRef.current = creator;

  const [phase, setPhase] = useState<Phase>(simRef.current.phase);
  const phaseRef = useRef(phase);
  phaseRef.current = phase;
  const [role, setRole] = useState<Role>(simRef.current.role);
  const roleRef = useRef(role);
  roleRef.current = role;
  const [pick, setPick] = useState<PickRole>("either");
  const pickRef = useRef(pick);
  pickRef.current = pick;
  const [ready, setReady] = useState(false);
  const readyRef = useRef(ready);
  readyRef.current = ready;
  const [partner, setPartner] = useState<Partner | null>(null);
  const [locked, setLocked] = useState(false);
  const [copied, setCopied] = useState<"code" | "link" | null>(null);
  const [gfxError, setGfxError] = useState<string | null>(null);
  const [roomFull, setRoomFull] = useState(false);
  const [linkLost, setLinkLost] = useState(false);
  const [winner, setWinner] = useState<Role | null>(null);
  const [reason, setReason] = useState<"tag" | "time" | null>(null);
  const [contested, setContested] = useState(false);

  const host = hostOf(selfId, creator, partner);
  const hostRef = useRef(host);
  hostRef.current = host;

  useEffect(() => {
    partnerRef.current = partner;
  }, [partner]);

  useEffect(() => {
    if (!net) return;
    if (partnerRef.current || roomFull) return;
    if (net.peers.length >= 2) {
      setRoomFull(true);
      return;
    }
    const connected = net.peers.find((p) => p.connectionState === "connected");
    if (!connected) return;
    const next: Partner = {
      id: connected.id,
      name: connected.name || "Friend",
      creator: false,
      pick: "either",
      ready: false,
      hello: false,
    };
    partnerRef.current = next;
    setPartner(next);
    net.send(
      {
        k: "hi",
        name: nameRef.current,
        creator: creatorRef.current,
        pick: pickRef.current,
        ready: readyRef.current,
      },
      connected.id,
    );
  }, [net, net?.peers, roomFull]);

  useEffect(() => {
    if (!net) return;
    return net.onMessage((from, data, channel) => {
      if (!isNetMsg(data)) return;
      const current = partnerRef.current;
      if (current && from !== current.id) return;
      if (!current) {
        if ((net.peers.length ?? 0) >= 2) return;
        const next: Partner = {
          id: from,
          name: "Friend",
          creator: false,
          pick: "either",
          ready: false,
          hello: false,
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
        const next: Partner = {
          id: from,
          name: data.name || "Friend",
          creator: !!data.creator,
          pick: data.pick === "hider" || data.pick === "seeker" || data.pick === "either" ? data.pick : "either",
          ready: !!data.ready,
          hello: true,
        };
        partnerRef.current = next;
        setPartner(next);
      } else if (data.k === "lobby" && partnerRef.current) {
        const next = {
          ...partnerRef.current,
          pick: data.pick,
          ready: !!data.ready,
        };
        partnerRef.current = next;
        setPartner(next);
      } else if (data.k === "start") {
        if (sim.round === data.round && (sim.phase === "hide" || sim.phase === "seek")) return;
        const mine: Role = data.hiderId === selfId ? "hider" : "seeker";
        beginRound(sim, {
          round: data.round,
          role: mine,
          hideMs: data.hideMs || HIDE_MS,
          seekMs: data.seekMs || SEEK_MS,
          contested: !!data.contested,
          now: performance.now(),
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
        net.send({ k: "end", round: sim.round, winner: "seeker", reason: "tag" });
      } else if (data.k === "end" && data.round === sim.round) {
        conclude(sim, data.winner, data.reason);
      }
    });
  }, [net, selfId]);

  useEffect(() => {
    if (!net || !partner) return;
    net.send({ k: "lobby", pick, ready }, partner.id);
  }, [net, partner?.id, pick, ready]);

  useEffect(() => {
    if (!net || !partner?.hello) return;
    if (phase !== "lobby" && phase !== "result") return;
    if (!ready || !partner.ready) {
      startLock.current = false;
      return;
    }
    if (!host) return;
    const live = net.peers.some((p) => p.id === partner.id && p.connectionState === "connected");
    if (!live || startLock.current) return;
    startLock.current = true;
    const round = (simRef.current?.round ?? 0) + 1;
    const resolved = resolveRoles({ id: selfId, pick }, { id: partner.id, pick: partner.pick }, round);
    const mine: Role = resolved.hiderId === selfId ? "hider" : "seeker";
    net.send({
      k: "start",
      round,
      hiderId: resolved.hiderId,
      seekerId: resolved.seekerId,
      hideMs: HIDE_MS,
      seekMs: SEEK_MS,
      contested: resolved.contested,
    });
    if (simRef.current) {
      beginRound(simRef.current, {
        round,
        role: mine,
        hideMs: HIDE_MS,
        seekMs: SEEK_MS,
        contested: resolved.contested,
        now: performance.now(),
      });
    }
    setRole(mine);
    roleRef.current = mine;
    setContested(resolved.contested);
  }, [net, partner, ready, pick, phase, host, selfId, net?.peers]);

  useEffect(() => {
    if (!net || !partner || phase === "lobby") return;
    const still = net.peers.some((p) => p.id === partner.id);
    if (!still) setLinkLost(true);
  }, [net, net?.peers, partner, phase]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const sim = simRef.current;
    if (!canvas || !sim) return;
    let stopped = false;
    let raf = 0;
    let view: View | null = null;
    let last = performance.now();
    let lastSend = 0;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const input = inputRef.current;

    window.__controlsTest = {
      getYaw: () => sim.me.yaw,
      getSpeed: () => Math.hypot(sim.me.vx, sim.me.vz),
      getPos: () => ({ x: sim.me.x, z: sim.me.z }),
      setKeys: (codes) => {
        input.forced = new Set(codes);
      },
      setSteer: () => {},
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code.startsWith("Arrow") || e.code === "Space") e.preventDefault();
      input.keys.add(e.code);
      unlockAudio();
    };
    const onKeyUp = (e: KeyboardEvent) => {
      input.keys.delete(e.code);
    };
    const onBlur = () => input.keys.clear();
    const onMouse = (e: MouseEvent) => {
      if (document.pointerLockElement !== canvas) return;
      sim.me.yaw -= e.movementX * 0.0022;
      sim.me.pitch = Math.max(-1.45, Math.min(1.45, sim.me.pitch - e.movementY * 0.0022));
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
          void flashRef.current?.offsetWidth;
          flashRef.current?.classList.add("flash-on");
        } else if (sim.reason === "time") playEscape();
        if (!sim.useBot && notedRound.current !== sim.round) {
          notedRound.current = sim.round;
          setPick(sim.role === "hider" ? "seeker" : "hider");
          setReady(false);
        }
      }
    };

    const loop = (now: number) => {
      if (stopped) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      sim.me.yaw -= input.lookDx * 0.0045;
      sim.me.pitch = Math.max(-1.45, Math.min(1.45, sim.me.pitch - input.lookDy * 0.0045));
      input.lookDx = 0;
      input.lookDy = 0;

      const keys = input.forced ?? input.keys;
      const axes = axesFromKeys(keys, input.touch);
      const crouch = axes.crouch || input.touchCrouch;
      const frozen = sim.phase === "hide" && sim.role === "seeker";
      const canMove = sim.phase === "lobby" || sim.phase === "hide" || sim.phase === "seek";
      stepBody(
        sim.me,
        { f: canMove && !frozen ? axes.f : 0, s: canMove && !frozen ? axes.s : 0, crouch: frozen ? false : crouch },
        dt,
        worldSolids(sim.phase),
        { frozen },
      );

      if (sim.useBot) {
        const botRole: Role = sim.role === "hider" ? "seeker" : "hider";
        stepBot(sim.bot, sim.me, sim.phase, botRole, dt, worldSolids(sim.phase));
        if (sim.phase === "seek" && botRole === "seeker" && taggable(sim.bot, sim.me, worldSolids("seek"))) {
          conclude(sim, "seeker", "tag");
        }
      }

      const ev = advanceClock(sim, now, !netRef.current || hostRef.current);
      if (ev === "time" && netRef.current && hostRef.current) {
        netRef.current.send({ k: "end", round: sim.round, winner: "hider", reason: "time" });
      }

      const pressed = axes.tag || input.touchTag;
      if (pressed && !input.tagLatch && sim.phase === "seek" && sim.role === "seeker") {
        const other = otherBody(sim, now);
        if (other && taggable(sim.me, other, worldSolids("seek"))) {
          if (!netRef.current || hostRef.current) {
            if (conclude(sim, "seeker", "tag") && netRef.current) {
              netRef.current.send({ k: "end", round: sim.round, winner: "seeker", reason: "tag" });
            }
          } else {
            netRef.current.send({ k: "tag", round: sim.round });
          }
        }
      }
      input.tagLatch = pressed;

      const speed = Math.hypot(sim.me.vx, sim.me.vz);
      if (speed > 0.45 && !sim.me.crouch && !frozen) {
        sim.walk += dt * speed * 2.1;
        sim.stepAcc += dt * speed;
        if (sim.stepAcc > 2.15) {
          sim.stepAcc = 0;
          playStep();
        }
      }
      sim.shake = Math.max(0, sim.shake - dt * 1.6);
      if (sim.phase === "hide") {
        const sec = Math.ceil(Math.max(0, remainingMs(sim, now)) / 1000);
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
          c: sim.me.crouch ? 1 : 0,
        });
      }

      if (timerRef.current) {
        timerRef.current.textContent =
          sim.phase === "hide" || sim.phase === "seek" ? formatClock(remainingMs(sim, now)) : "—";
      }
      if (bigRef.current) bigRef.current.textContent = formatClock(remainingMs(sim, now));
      const showTag =
        sim.phase === "seek" &&
        sim.role === "seeker" &&
        !!other &&
        taggable(sim.me, other, worldSolids("seek"));
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
        other: other
          ? {
              x: other.x,
              z: other.z,
              yaw: other.yaw,
              pitch: other.pitch,
              crouch: other.crouch,
              role: sim.role === "hider" ? "seeker" : "hider",
              flash: sim.role === "hider" && (sim.phase === "seek" || sim.phase === "result"),
            }
          : null,
      });
      publishPhase();
      if (!window.__gameReady) window.__gameReady = true;
      raf = requestAnimationFrame(loop);
    };

    void import("./view").then(({ createView }) => {
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
    // The sim lives in a ref for the whole mount. Net updates are read from refs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const peerLink = net?.peers.find((p) => p.id === partner?.id);
  const linkLabel = linkLabelFor(net, peerLink?.connectionState ?? null, peerLink?.rttMs ?? null, !!partner);

  const requestLook = () => {
    unlockAudio();
    const canvas = canvasRef.current;
    if (!canvas || document.pointerLockElement === canvas) return;
    const pending = canvas.requestPointerLock?.({ unadjustedMovement: true });
    void pending?.catch(() => canvas.requestPointerLock());
  };

  const copyText = async (value: string, kind: "code" | "link") => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(kind);
    } catch {
      setCopied(null);
    }
  };

  const objective =
    phase === "hide" && role === "hider"
      ? contested
        ? "Both of you wanted the same role. The house decided — hide."
        : "Hide. They are counting in the foyer closet."
      : phase === "hide" && role === "seeker"
        ? "Eyes covered. The door opens when the count hits zero."
        : phase === "seek" && role === "seeker"
          ? "The door is open. Get close and press E to tag."
          : phase === "seek"
            ? "They are out with the lamp. Stay low, break line of sight."
            : "";

  return (
    <div className="fixed inset-0 overflow-hidden bg-ink text-paper touch-none">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        onClick={requestLook}
        onContextMenu={(e) => e.preventDefault()}
      />
      <div ref={flashRef} className="pointer-events-none absolute inset-0" />
      {phase === "hide" && role === "seeker" && <div className="blindfold pointer-events-none absolute inset-0" />}

      <div className="pointer-events-none absolute inset-0">
        <div className="flex items-start justify-between gap-3 p-4">
          <div className="pointer-events-auto flex items-center gap-3 rounded-full border border-line bg-ink-2 px-4 py-2">
            <Timer className="size-5 text-brass" aria-hidden />
            <span ref={timerRef} className="font-display text-2xl tabular-nums leading-none">
              {phase === "hide" ? formatClock(HIDE_MS) : "—"}
            </span>
          </div>
          <div className="pointer-events-auto flex items-center gap-2">
            {net && (
              <p className="hidden rounded-full border border-line bg-ink-2 px-3 py-2 text-sm text-muted sm:block">
                {linkLabel}
              </p>
            )}
            <button
              type="button"
              onClick={onExit}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-ink-2 px-4 text-sm"
            >
              <ArrowLeft className="size-4" aria-hidden />
              Leave
            </button>
          </div>
        </div>

        {objective && (
          <p className="mx-auto mt-2 max-w-xl px-4 text-center text-sm text-paper">
            <span className="inline-block rounded-full border border-line bg-ink-2 px-4 py-2">{objective}</span>
          </p>
        )}

        {phase === "hide" && role === "seeker" && (
          <div className="pointer-events-none absolute inset-0 grid place-items-center">
            <div className="text-center">
              <p className="text-sm uppercase tracking-widest text-brass">Counting</p>
              <p ref={bigRef} className="font-display text-7xl tabular-nums text-paper">
                0:24
              </p>
            </div>
          </div>
        )}

        <p
          ref={tagRef}
          className="absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-16 rounded-full bg-brass px-4 py-2 text-sm font-medium text-ink"
        >
          Press E to tag
        </p>
        <div className="pointer-events-none absolute top-1/2 left-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-brass" />

        {(phase === "hide" || phase === "seek") && (
          <p className="absolute inset-x-0 bottom-4 hidden px-4 text-center md:block">
            <span className="inline-block rounded-full border border-line bg-ink-2 px-4 py-2 text-sm text-muted">
              {locked ? "Esc releases the mouse. The round keeps going." : "Click the scene to look."} WASD move · A
              left, D right · C crouch
              {role === "seeker" ? " · E tag" : ""}
            </span>
          </p>
        )}

        <div className="touch-layer absolute inset-0">
          {(phase === "hide" || phase === "seek" || phase === "lobby") && (
            <>
              <div
                className="absolute top-20 bottom-28 left-0 w-1/2"
                onPointerDown={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.setPointerCapture(e.pointerId);
                  el.dataset.ox = String(e.clientX);
                  el.dataset.oy = String(e.clientY);
                  el.dataset.pid = String(e.pointerId);
                }}
                onPointerMove={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  if (el.dataset.pid !== String(e.pointerId)) return;
                  const dx = e.clientX - Number(el.dataset.ox);
                  const dy = e.clientY - Number(el.dataset.oy);
                  const max = 56;
                  const mag = Math.hypot(dx, dy) || 1;
                  const k = mag > max ? max / mag : 1;
                  const nx = (dx * k) / max;
                  const ny = (dy * k) / max;
                  inputRef.current.touch.s = Math.abs(nx) < 0.12 ? 0 : nx;
                  inputRef.current.touch.f = Math.abs(ny) < 0.12 ? 0 : -ny;
                }}
                onPointerUp={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  if (el.dataset.pid !== String(e.pointerId)) return;
                  el.dataset.pid = "";
                  inputRef.current.touch.f = 0;
                  inputRef.current.touch.s = 0;
                }}
              >
                <span className="absolute bottom-4 left-6 rounded-full border border-line bg-ink-2 px-3 py-2 text-xs text-muted">
                  Move
                </span>
              </div>
              <div
                className="absolute top-20 right-0 bottom-28 w-1/2"
                onPointerDown={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.setPointerCapture(e.pointerId);
                  el.dataset.lx = String(e.clientX);
                  el.dataset.ly = String(e.clientY);
                  el.dataset.pid = String(e.pointerId);
                }}
                onPointerMove={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  if (el.dataset.pid !== String(e.pointerId)) return;
                  const lx = Number(el.dataset.lx);
                  const ly = Number(el.dataset.ly);
                  inputRef.current.lookDx += e.clientX - lx;
                  inputRef.current.lookDy += e.clientY - ly;
                  el.dataset.lx = String(e.clientX);
                  el.dataset.ly = String(e.clientY);
                }}
                onPointerUp={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  if (el.dataset.pid === String(e.pointerId)) el.dataset.pid = "";
                }}
              />
              <div className="absolute right-4 bottom-6 flex flex-col gap-3">
                <button
                  type="button"
                  className="pointer-events-auto min-h-12 min-w-24 rounded-full border border-line bg-ink-2 px-4 text-sm"
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    inputRef.current.touchCrouch = !inputRef.current.touchCrouch;
                    e.currentTarget.classList.toggle("bg-brass", inputRef.current.touchCrouch);
                    e.currentTarget.classList.toggle("text-ink", inputRef.current.touchCrouch);
                  }}
                >
                  Crouch
                </button>
                {role === "seeker" && phase === "seek" && (
                  <button
                    type="button"
                    className="pointer-events-auto min-h-12 min-w-24 rounded-full bg-brass px-4 text-sm font-medium text-ink"
                    onPointerDown={(e) => {
                      e.stopPropagation();
                      inputRef.current.touchTag = true;
                      unlockAudio();
                    }}
                    onPointerUp={() => {
                      inputRef.current.touchTag = false;
                    }}
                    onPointerLeave={() => {
                      inputRef.current.touchTag = false;
                    }}
                  >
                    Tag
                  </button>
                )}
              </div>
            </>
          )}
        </div>

        {gfxError && (
          <div className="pointer-events-auto absolute inset-0 grid place-items-center bg-ink p-6">
            <div className="max-w-md text-center">
              <h2 className="font-display text-3xl">This browser can’t show the house</h2>
              <p className="mt-3 text-muted">{gfxError}</p>
              <button type="button" className="mt-6 min-h-12 rounded-full bg-brass px-5 text-ink" onClick={onExit}>
                Back
              </button>
            </div>
          </div>
        )}

        {roomFull && (
          <div className="pointer-events-auto absolute inset-0 grid place-items-center bg-ink/80 p-6">
            <div className="max-w-md rounded-card border border-line bg-ink-2 p-6 text-center">
              <h2 className="font-display text-3xl">This room is full</h2>
              <p className="mt-3 text-muted">Hide and seek here is two players. Ask for a new code.</p>
              <button type="button" className="mt-6 min-h-12 rounded-full bg-brass px-5 text-ink" onClick={onExit}>
                Back
              </button>
            </div>
          </div>
        )}

        {linkLost && !roomFull && (
          <div className="pointer-events-auto absolute inset-0 grid place-items-center bg-ink/80 p-6">
            <div className="max-w-md rounded-card border border-line bg-ink-2 p-6 text-center">
              <h2 className="font-display text-3xl">The link dropped</h2>
              <p className="mt-3 text-muted">
                Your friend closed the game or the direct connection failed. Create a new room and try again.
              </p>
              <button type="button" className="mt-6 min-h-12 rounded-full bg-brass px-5 text-ink" onClick={onExit}>
                Back to the menu
              </button>
            </div>
          </div>
        )}

        {phase === "lobby" && net && !roomFull && (
          <div className="pointer-events-auto absolute inset-x-0 bottom-0 max-h-full overflow-y-auto px-4 pb-4">
            <div className="mx-auto mb-2 w-full max-w-3xl rounded-card border border-line bg-ink-2 p-5">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-sm text-muted">Room code</p>
                  <p className="font-display text-5xl tracking-widest text-brass">{roomCode}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-4 text-sm"
                    onClick={() => void copyText(roomCode, "code")}
                  >
                    <Copy className="size-4" aria-hidden />
                    {copied === "code" ? "Copied" : "Copy code"}
                  </button>
                  <button
                    type="button"
                    className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-4 text-sm"
                    onClick={() => {
                      const link = `${window.location.origin}${window.location.pathname}?room=${roomCode}`;
                      void copyText(link, "link");
                    }}
                  >
                    {copied === "link" ? "Copied" : "Copy link"}
                  </button>
                </div>
              </div>
              <p className="mt-3 text-sm text-muted">{linkLabel}</p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <fieldset>
                  <legend className="text-sm text-muted">You play as</legend>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <RoleButton active={pick === "hider"} onClick={() => setPick("hider")} icon={<EyeOff className="size-4" />}>
                      Hider
                    </RoleButton>
                    <RoleButton active={pick === "seeker"} onClick={() => setPick("seeker")} icon={<Eye className="size-4" />}>
                      Seeker
                    </RoleButton>
                    <RoleButton active={pick === "either"} onClick={() => setPick("either")} icon={<Shuffle className="size-4" />}>
                      Either
                    </RoleButton>
                  </div>
                </fieldset>
                <div>
                  <p className="text-sm text-muted">Friend</p>
                  <p className="mt-2 flex items-center gap-2 text-paper">
                    <Users className="size-4 text-brass" aria-hidden />
                    {partner ? `${partner.name} · wants ${partner.pick}` : "Nobody here yet"}
                    {partner?.ready ? " · ready" : ""}
                  </p>
                  <button
                    type="button"
                    disabled={!partner?.hello || linkLost}
                    onClick={() => {
                      unlockAudio();
                      setReady((v) => !v);
                    }}
                    className="mt-3 min-h-12 rounded-full bg-brass px-5 font-medium text-ink disabled:opacity-40"
                  >
                    {ready ? "Waiting for them…" : "Ready"}
                  </button>
                </div>
              </div>
              <p className="mt-4 text-sm text-muted">
                Wander while you wait. When you are both ready, the hider is moved to a hiding spot and the seeker is
                shut in the closet. Roles swap after each round if you leave them on the suggestion.
              </p>
            </div>
          </div>
        )}

        {phase === "result" && !linkLost && !roomFull && (
          <div className="pointer-events-auto absolute inset-0 grid place-items-center bg-ink/70 p-4">
            <div className="w-full max-w-md rounded-card border border-line bg-ink-2 p-6 text-center">
              <p className="text-sm uppercase tracking-widest text-brass">
                {winner === "hider" ? "Hider wins" : "Seeker wins"}
              </p>
              <h2 className="mt-2 font-display text-5xl text-balance">
                {reason === "tag" ? "Found in the dark." : "The lamp went cold."}
              </h2>
              <p className="mt-3 text-muted">
                {reason === "tag"
                  ? "Close enough, and in sight. That’s a tag."
                  : "Eighty seconds and no hand on a shoulder."}
              </p>
              {net ? (
                <>
                  <p className="mt-4 text-sm text-paper">
                    Next round you are set as {pick === "either" ? "either role" : `the ${pick}`}. Change it if you want,
                    then ready up.
                  </p>
                  <div className="mt-3 flex flex-wrap justify-center gap-2">
                    <RoleButton active={pick === "hider"} onClick={() => setPick("hider")} icon={<EyeOff className="size-4" />}>
                      Hider
                    </RoleButton>
                    <RoleButton active={pick === "seeker"} onClick={() => setPick("seeker")} icon={<Eye className="size-4" />}>
                      Seeker
                    </RoleButton>
                  </div>
                  <button
                    type="button"
                    className="mt-5 min-h-12 rounded-full bg-brass px-5 font-medium text-ink"
                    onClick={() => setReady(true)}
                  >
                    {ready ? "Waiting for your friend…" : "Run it back"}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="mt-6 min-h-12 rounded-full bg-brass px-5 font-medium text-ink"
                  onClick={() => {
                    if (!simRef.current) return;
                    restartSolo(simRef.current, performance.now());
                    setWinner(null);
                    setReason(null);
                    setPhase("hide");
                    phaseRef.current = "hide";
                  }}
                >
                  Play again
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function RoleButton({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? "inline-flex min-h-11 items-center gap-2 rounded-full bg-brass px-4 text-sm font-medium text-ink"
          : "inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-4 text-sm text-paper"
      }
    >
      {icon}
      {children}
    </button>
  );
}

function otherBody(sim: Sim, now: number): Body | null {
  if (sim.useBot) return sim.bot;
  return interpolate(sim.samples, now);
}

function pushPose(sim: Sim, msg: Extract<NetMsg, { k: "pose" }>, now: number) {
  if (msg.seq < sim.lastSeq) return;
  sim.lastSeq = msg.seq;
  sim.samples.push({
    t: now,
    seq: msg.seq,
    x: msg.x,
    z: msg.z,
    yaw: msg.yaw,
    pitch: msg.pitch,
    c: msg.c,
  });
  const cutoff = now - 1000;
  while (sim.samples.length > 2 && sim.samples[0].t < cutoff) sim.samples.shift();
}

function round3(n: number): number {
  return Math.round(n * 1000) / 1000;
}

function linkLabelFor(
  net: P2PRoomHandle | null,
  state: string | null,
  rtt: number | null,
  havePartner: boolean,
): string {
  if (!net) return "";
  if (!net.joined) return "Reaching the introduction service…";
  if (state === "connected") return `Linked${rtt != null ? ` · ${rtt} ms` : ""}`;
  if (state === "failed") return "Networks couldn’t meet. Try another Wi-Fi or a phone hotspot.";
  if (state === "connecting" || state === "new" || havePartner) return "Found them. Opening a direct link…";
  return "Share the code. Leave this page open while they join.";
}
