import { useEffect, useState } from "react";
import { Eye, EyeOff, Lamp, Play, Users } from "lucide-react";
import { useP2PRoom } from "@/lib/multiplayer";
import { Match } from "./Match";
import type { Role } from "./types";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function makeCode(): string {
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (n) => ALPHABET[n % ALPHABET.length]).join("");
}

function cleanCode(raw: string): string {
  return raw.toUpperCase().replace(/[^A-Z2-9]/g, "").replace(/[IO]/g, "").slice(0, 4);
}

type Session =
  | { kind: "solo"; role: Role }
  | { kind: "net"; room: string; creator: boolean; name: string };

export function GameApp() {
  const [session, setSession] = useState<Session | null>(null);
  const [name, setName] = useState("Guest");
  const [code, setCode] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("larkspur-name");
    if (saved) setName(saved.slice(0, 18));
    const room = new URLSearchParams(window.location.search).get("room");
    if (room) setCode(cleanCode(room));
  }, []);

  if (session?.kind === "solo") {
    return (
      <Match
        net={null}
        creator={false}
        soloRole={session.role}
        selfId="solo-player"
        name="You"
        roomCode=""
        onExit={() => setSession(null)}
      />
    );
  }
  if (session?.kind === "net") {
    return (
      <OnlineMatch
        key={`${session.room}:${session.name}`}
        room={session.room}
        name={session.name}
        creator={session.creator}
        onExit={() => setSession(null)}
      />
    );
  }

  const startOnline = (room: string, creator: boolean) => {
    const cleanName = name.trim().slice(0, 18) || "Guest";
    localStorage.setItem("larkspur-name", cleanName);
    const url = new URL(window.location.href);
    url.searchParams.set("room", room);
    window.history.replaceState(null, "", `${url.pathname}${url.search}`);
    setSession({ kind: "net", room, creator, name: cleanName });
  };

  return (
    <div className="min-h-dvh overflow-x-hidden bg-ink text-paper">
      <div className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col px-5 py-8 md:px-10 md:py-12">
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-full border border-line bg-ink-2 text-brass">
              <Lamp className="size-5" aria-hidden />
            </span>
            <div>
              <p className="text-xs tracking-widest text-muted uppercase">Night wing</p>
              <p className="font-display text-lg leading-none">Larkspur</p>
            </div>
          </div>
          <p className="hidden text-sm text-muted sm:block">Two players, one house</p>
        </header>

        <div className="mt-10 grid flex-1 items-start gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16">
          <div className="min-w-0">
            <h1 className="font-display text-5xl leading-tight text-balance sm:text-6xl">
              Hide in the dark. Or bring the lamp.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-pretty text-muted">
              First-person hide and seek. One of you disappears into Larkspur House. The other counts in a closet, then
              hunts by flashlight.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                data-qa="practice"
                onClick={() => setSession({ kind: "solo", role: "hider" })}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-brass px-5 font-medium text-ink"
              >
                <Play className="size-5" aria-hidden />
                Start practice
              </button>
              <button
                type="button"
                onClick={() => setSession({ kind: "solo", role: "seeker" })}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-line px-5"
              >
                <Eye className="size-5 text-brass" aria-hidden />
                Hunt the ghost
              </button>
            </div>
            <p className="mt-3 text-sm text-muted">
              Practice is you against the house ghost, on this device. No one else joins that round.
            </p>

            <section className="mt-8 rounded-card border border-line bg-ink-2 p-5">
              <div className="flex items-center gap-2">
                <Users className="size-5 text-brass" aria-hidden />
                <h2 className="font-display text-2xl">Play with a friend</h2>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Nothing to install. Create a room, send the code, and your friend types it into this same game on
                their computer or phone. You connect directly to each other.
              </p>
              <label className="mt-4 block text-sm text-muted" htmlFor="player-name">
                Your name
              </label>
              <input
                id="player-name"
                value={name}
                maxLength={18}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 min-h-12 w-full rounded-full border border-line bg-ink px-4 text-paper outline-none"
              />
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => startOnline(makeCode(), true)}
                  className="inline-flex min-h-12 flex-1 items-center justify-center rounded-full bg-brass px-5 font-medium text-ink"
                >
                  Create room
                </button>
                <form
                  className="flex min-w-0 flex-1 gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (code.length === 4) startOnline(code, false);
                  }}
                >
                  <input
                    aria-label="Room code"
                    value={code}
                    onChange={(e) => setCode(cleanCode(e.target.value))}
                    placeholder="CODE"
                    className="min-h-12 w-full min-w-0 rounded-full border border-line bg-ink px-4 tracking-widest text-paper uppercase outline-none"
                  />
                  <button
                    type="submit"
                    disabled={code.length !== 4}
                    className="min-h-12 shrink-0 rounded-full border border-line px-4 disabled:opacity-40"
                  >
                    Join
                  </button>
                </form>
              </div>
              {code.length === 4 && (
                <p className="mt-3 text-sm text-muted">
                  A code is waiting in the address bar. Join if a friend sent it to you, or create a fresh room.
                </p>
              )}
            </section>
          </div>

          <aside className="min-w-0 rounded-card border border-line bg-ink-2 p-6">
            <h2 className="font-display text-2xl">How a round works</h2>
            <ol className="mt-4 flex list-decimal flex-col gap-3 pl-5 text-sm leading-relaxed text-muted">
              <li>One player creates a room and shares the four-letter code.</li>
              <li>The other opens this game and joins with that code.</li>
              <li>Pick hider, seeker, or either. Both press Ready.</li>
              <li>The hider gets 24 seconds. The seeker is shut in the foyer closet.</li>
              <li>The door opens. The seeker has a flashlight and 80 seconds.</li>
              <li>Stand close, in sight, and press E to tag — or survive the clock.</li>
            </ol>

            <h3 className="mt-6 font-display text-xl">Controls</h3>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-muted">
              <li>WASD or arrow keys move. A is left, D is right.</li>
              <li>Click the scene to look around. Esc lets go of the mouse.</li>
              <li>C or Ctrl crouches. Crouch behind hedges, sofas, and under the dining table.</li>
              <li>E tags, only for the seeker, only when you are close and can see them.</li>
              <li>On a phone, the left side moves, the right side looks, and the buttons crouch or tag.</li>
            </ul>

            <h3 className="mt-6 flex items-center gap-2 font-display text-xl">
              <EyeOff className="size-5 text-brass" aria-hidden />
              Playing across the internet
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-pretty text-muted">
              After you publish this game, send your friend the public link and the room code. Two browsers are enough.
              A small introduction service only helps you find each other. After that, movement goes straight between
              your two devices. You do not open a port on your router, and you do not run a server on your computer.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-pretty text-muted">
              It is free. Rooms hold two people who chose to play together. Some locked-down school or office networks
              cannot open a direct link — the lobby will say so instead of hanging. A direct link shares network
              addresses the way a video call does. The game also trusts both players about where they are standing, so
              keep it to friends, not a tournament.
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
}

function OnlineMatch({
  room,
  name,
  creator,
  onExit,
}: {
  room: string;
  name: string;
  creator: boolean;
  onExit: () => void;
}) {
  const net = useP2PRoom({ room, name });
  return (
    <Match
      net={net}
      creator={creator}
      soloRole={null}
      selfId={net.selfId}
      name={name}
      roomCode={room}
      onExit={onExit}
    />
  );
}
