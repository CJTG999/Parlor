/**
 * Parlor table UI.
 *
 * Online play uses the same WebRTC room as the night wing (useP2PRoom → /api/rtc
 * for the introduction, then a direct data channel). The player who creates the
 * table is the host: their browser owns the shoe and is the only one that
 * applies bets and hits. Everyone else sends a short request and renders the
 * snapshot the host sends back. That snapshot never includes the hole card or
 * the undealt shoe.
 */
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Copy, LogOut, Play, Users } from "lucide-react";
import { useP2PRoom } from "@/lib/multiplayer";
import {
  CHIP_VALUES,
  MAX_BET,
  MIN_BET,
  START_CHIPS,
  applyClient,
  createTable,
  handTotal,
  isRed,
  isSnapshot,
  leave,
  legalActions,
  outcomeLabel,
  parseClient,
  rankLabel,
  sit,
  snapshot,
  suitGlyph,
  type Act,
  type Card,
  type ClientMsg,
  type Outcome,
  type Seat,
  type Snapshot,
  type Table,
} from "./engine";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function makeCode(): string {
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (n) => ALPHABET[n % ALPHABET.length]).join("");
}

function cleanCode(raw: string): string {
  return raw.toUpperCase().replace(/[^A-Z2-9]/g, "").replace(/[IO]/g, "").slice(0, 4);
}

function hostKey(room: string): string {
  return `parlor-host:${room}`;
}

type Session =
  | { kind: "solo"; name: string }
  | { kind: "net"; room: string; creator: boolean; name: string };

export function Parlor() {
  const [session, setSession] = useState<Session | null>(null);
  const [name, setName] = useState("Guest");
  const [code, setCode] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("parlor-name");
    const cleanName = (saved || "Guest").trim().slice(0, 18) || "Guest";
    setName(cleanName);
    const room = cleanCode(new URLSearchParams(window.location.search).get("room") ?? "");
    if (!room) return;
    setCode(room);
    const creator = sessionStorage.getItem(hostKey(room)) === "1";
    setSession({ kind: "net", room, creator, name: cleanName });
  }, []);

  if (session?.kind === "solo") {
    return <SoloTable name={session.name} onExit={() => setSession(null)} />;
  }
  if (session?.kind === "net") {
    return (
      <OnlineTable
        key={`${session.room}:${session.name}:${session.creator}`}
        room={session.room}
        name={session.name}
        creator={session.creator}
        onExit={() => {
          sessionStorage.removeItem(hostKey(session.room));
          const url = new URL(window.location.href);
          url.searchParams.delete("room");
          window.history.replaceState(null, "", `${url.pathname}${url.search}`);
          setSession(null);
        }}
      />
    );
  }

  const remember = (nextName: string) => {
    const clean = nextName.trim().slice(0, 18) || "Guest";
    localStorage.setItem("parlor-name", clean);
    return clean;
  };

  const openTable = (room: string, creator: boolean) => {
    const clean = remember(name);
    if (creator) sessionStorage.setItem(hostKey(room), "1");
    else sessionStorage.removeItem(hostKey(room));
    const url = new URL(window.location.href);
    url.searchParams.set("room", room);
    window.history.replaceState(null, "", `${url.pathname}${url.search}`);
    setSession({ kind: "net", room, creator, name: clean });
  };

  return (
    <div className="min-h-dvh overflow-x-hidden bg-ink text-paper">
      <div className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col px-5 py-8 md:px-10 md:py-12">
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-lg border border-brass bg-ink-2 font-display text-xl text-brass">
              P
            </span>
            <div>
              <p className="text-xs tracking-widest text-muted uppercase">Late table</p>
              <p className="font-display text-lg leading-none">Parlor</p>
            </div>
          </div>
          <Link to="/house" className="text-sm text-muted underline-offset-4 hover:text-paper hover:underline">
            Night wing
          </Link>
        </header>

        <div className="mt-10 grid flex-1 items-start gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16">
          <div className="min-w-0">
            <h1 className="font-display text-5xl leading-tight text-balance sm:text-6xl">Two seats. One shoe.</h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-pretty text-muted">
              Blackjack against the house, with a friend in the other chair. You each bet, then play your own hand.
              The dealer stands on 17. Blackjack pays three to two.
            </p>
            <button
              type="button"
              data-qa="practice"
              onClick={() => setSession({ kind: "solo", name: remember(name) })}
              className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-brass px-5 font-medium text-ink"
            >
              <Play className="size-5" aria-hidden />
              Practice against the house
            </button>
            <p className="mt-3 max-w-xl text-sm text-muted">
              Practice stays on this device. Nobody else can join that shoe.
            </p>
            <ul className="mt-8 max-w-xl space-y-2 text-sm leading-relaxed text-muted">
              <li>Hit draws a card. Stand keeps the total. Double doubles the bet and takes exactly one card.</li>
              <li>Split a pair into two hands, once. Split aces each get one card.</li>
              <li>A tie pushes. Bust and you lose, even if the dealer busts too.</li>
            </ul>
          </div>

          <section className="rounded-card border border-line bg-ink-2 p-5">
            <div className="flex items-center gap-2">
              <Users className="size-5 text-brass" aria-hidden />
              <h2 className="font-display text-2xl">Sit with a friend</h2>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Create a table and send the code. Your friend opens Parlor, enters it, and the two browsers connect
              directly. Your browser deals. Theirs never sees the deck or the hole card.
            </p>
            <label className="mt-5 block text-sm text-muted" htmlFor="parlor-name">
              Your name
            </label>
            <input
              id="parlor-name"
              value={name}
              maxLength={18}
              onChange={(event) => setName(event.target.value)}
              className="mt-2 min-h-12 w-full rounded-xl border border-line bg-ink px-3 text-paper"
            />
            <button
              type="button"
              data-qa="create-table"
              onClick={() => openTable(makeCode(), true)}
              className="mt-4 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-brass px-5 font-medium text-ink"
            >
              Create a table
            </button>
            <form
              className="mt-4 flex gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                const room = cleanCode(code);
                if (room.length === 4) openTable(room, false);
              }}
            >
              <label className="sr-only" htmlFor="parlor-code">
                Table code
              </label>
              <input
                id="parlor-code"
                value={code}
                inputMode="text"
                autoCapitalize="characters"
                maxLength={4}
                placeholder="Code"
                onChange={(event) => setCode(cleanCode(event.target.value))}
                className="min-h-12 min-w-0 flex-1 rounded-xl border border-line bg-ink px-3 tracking-widest text-paper uppercase"
              />
              <button
                type="submit"
                data-qa="join-table"
                disabled={cleanCode(code).length !== 4}
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-line px-4 disabled:opacity-40"
              >
                Join
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}

function SoloTable({ name, onExit }: { name: string; onExit: () => void }) {
  const tableRef = useRef<Table | null>(null);
  const [snap, setSnap] = useState<Snapshot | null>(null);

  useEffect(() => {
    const table = createTable();
    sit(table, "you", name);
    const savedRaw = localStorage.getItem("parlor-bank");
    const saved = savedRaw === null ? Number.NaN : Number(savedRaw);
    const seat = table.seats[0];
    if (seat && Number.isFinite(saved) && saved >= 0 && saved < 100000) seat.chips = Math.floor(saved);
    tableRef.current = table;
    setSnap(snapshot(table));
  }, [name]);

  const send = (msg: ClientMsg) => {
    const table = tableRef.current;
    if (!table) return;
    applyClient(table, "you", msg);
    const next = snapshot(table);
    const seat = next.seats[0];
    if (seat) localStorage.setItem("parlor-bank", String(seat.chips));
    setSnap(next);
  };

  return (
    <TableScreen
      snap={snap}
      selfId="you"
      note="Practice. This shoe never leaves your browser."
      onExit={onExit}
      onCommand={send}
    />
  );
}

function OnlineTable({
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
  const { selfId, peers, send, onMessage } = useP2PRoom({ room, name });
  const tableRef = useRef<Table | null>(null);
  const hostFrom = useRef<string | null>(null);
  const [snap, setSnap] = useState<Snapshot | null>(null);
  const [full, setFull] = useState(false);

  const publish = useCallback(() => {
    const table = tableRef.current;
    if (!table) return;
    const next = snapshot(table);
    setSnap(next);
    send({ t: "snap", snap: next });
  }, [send]);

  useEffect(() => {
    if (!creator) return;
    const table = createTable();
    sit(table, selfId, name);
    tableRef.current = table;
    setSnap(snapshot(table));
  }, [creator, selfId, name]);

  useEffect(() => {
    return onMessage((from, data) => {
      if (!creator) {
        if (!data || typeof data !== "object") return;
        const msg = data as { t?: string; snap?: unknown };
        if (msg.t === "full") {
          setFull(true);
          return;
        }
        if (msg.t !== "snap" || !isSnapshot(msg.snap)) return;
        if (hostFrom.current && !peers.some((peer) => peer.id === hostFrom.current)) hostFrom.current = null;
        if (!hostFrom.current) hostFrom.current = from;
        if (from !== hostFrom.current) return;
        setSnap(msg.snap);
        return;
      }
      const table = tableRef.current;
      const client = parseClient(data);
      if (!table || !client) return;
      if (applyClient(table, from, client) === "full") send({ t: "full" }, from);
      else publish();
    });
  }, [creator, onMessage, peers, publish, send]);

  const seated = snap?.seats.some((seat) => seat.id === selfId) ?? false;

  useEffect(() => {
    if (creator || seated || full) return;
    const announce = () => {
      if (peers.some((peer) => peer.connectionState === "connected")) send({ t: "sit", name });
    };
    announce();
    const id = window.setInterval(announce, 700);
    return () => window.clearInterval(id);
  }, [creator, seated, full, peers, send, name]);

  useEffect(() => {
    if (!creator) return;
    const table = tableRef.current;
    if (!table) return;
    const alive = new Set(peers.map((peer) => peer.id));
    let changed = false;
    for (const seat of [...table.seats]) {
      if (seat.id !== selfId && !alive.has(seat.id)) {
        leave(table, seat.id);
        changed = true;
      }
    }
    if (changed) publish();
  }, [creator, peers, selfId, publish]);

  const connected = peers.some((peer) => peer.connectionState === "connected");
  const note = creator
    ? connected
      ? "Your friend is connected. You are dealing."
      : "Share the code. You deal once they sit down."
    : connected
      ? "Connected to the dealer. They hold the shoe."
      : "Looking for the host of this code. They need to stay at the table.";

  if (full) {
    return (
      <Shell onExit={onExit}>
        <p className="font-display text-4xl">This table is full.</p>
        <p className="mt-3 max-w-md text-muted">Parlor seats two. Ask for a new code, or play the house alone.</p>
      </Shell>
    );
  }

  return (
    <TableScreen
      snap={snap}
      selfId={selfId}
      room={room}
      note={note}
      waiting={creator ? !snap : !seated}
      onExit={onExit}
      onCommand={(msg) => {
        if (creator) {
          const table = tableRef.current;
          if (!table) return;
          applyClient(table, selfId, msg);
          publish();
        } else {
          send(msg);
        }
      }}
    />
  );
}

function Shell({ children, onExit }: { children: ReactNode; onExit: () => void }) {
  return (
    <div className="min-h-dvh bg-ink px-5 py-8 text-paper">
      <button type="button" onClick={onExit} className="inline-flex min-h-12 items-center gap-2 text-sm text-muted">
        <LogOut className="size-4" aria-hidden />
        Leave table
      </button>
      <div className="mx-auto mt-16 max-w-lg">{children}</div>
    </div>
  );
}

function TableScreen({
  snap,
  selfId,
  room,
  note,
  waiting,
  onExit,
  onCommand,
}: {
  snap: Snapshot | null;
  selfId: string;
  room?: string;
  note: string;
  waiting?: boolean;
  onExit: () => void;
  onCommand: (msg: ClientMsg) => void;
}) {
  const [copied, setCopied] = useState(false);
  const commandRef = useRef(onCommand);
  commandRef.current = onCommand;

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target;
      if (target instanceof HTMLInputElement || target instanceof HTMLButtonElement || target instanceof HTMLTextAreaElement) {
        return;
      }
      const key = event.key.toLowerCase();
      const map: Record<string, Act> = { h: "hit", s: "stand", d: "double", p: "split" };
      const action = map[key];
      if (action) {
        event.preventDefault();
        commandRef.current({ t: "act", action });
      } else if (key === "n") {
        commandRef.current({ t: "next" });
      } else if (key === "enter") {
        commandRef.current({ t: "lock" });
      } else if (key === "c") {
        commandRef.current({ t: "clear" });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const you = snap?.seats.find((seat) => seat.id === selfId);
  const others = snap?.seats.filter((seat) => seat.id !== selfId) ?? [];
  const legal = snap ? legalActions(viewAsTable(snap), selfId) : [];

  const copyCode = async () => {
    if (!room) return;
    const url = new URL(window.location.href);
    url.searchParams.set("room", room);
    try {
      await navigator.clipboard.writeText(`${room}  ${url.href}`);
    } catch {
      await navigator.clipboard.writeText(room);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="h-dvh overflow-hidden bg-ink text-paper">
      <div className="mx-auto flex h-full w-full max-w-5xl flex-col px-4 py-4 sm:px-6">
        <header className="flex shrink-0 flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-lg border border-brass font-display text-brass">P</span>
            <div>
              <p className="font-display text-lg leading-none">Parlor</p>
              <p className="text-xs text-muted">{snap ? `Round ${snap.round}` : "Shuffling"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {room ? (
              <button
                type="button"
                onClick={() => void copyCode()}
                className="inline-flex min-h-12 items-center gap-2 rounded-full border border-line px-4"
              >
                <Copy className="size-4 text-brass" aria-hidden />
                <span className="font-display tracking-widest">{room}</span>
                <span className="text-sm text-muted">{copied ? "Copied" : "Copy"}</span>
              </button>
            ) : null}
            <button
              type="button"
              onClick={onExit}
              className="inline-flex min-h-12 items-center gap-2 rounded-full border border-line px-4 text-sm"
            >
              <LogOut className="size-4" aria-hidden />
              Leave
            </button>
          </div>
        </header>

        <p className="mt-3 shrink-0 text-sm text-muted" aria-live="polite">
          {note}
        </p>

        <div className="table-felt mt-4 flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto rounded-card px-4 py-5 sm:px-8" data-qa="table">
          {waiting || !snap ? (
            <p className="m-auto text-center font-display text-3xl text-paper">Taking a seat…</p>
          ) : (
            <>
              <Dealer dealer={snap.dealer} holeHidden={snap.holeHidden} />
              {others.map((seat) => (
                <SeatView key={seat.id} seat={seat} active={snap.turn >= 0 && snap.seats[snap.turn]?.id === seat.id} />
              ))}
              {you ? (
                <SeatView
                  seat={you}
                  mine
                  active={snap.turn >= 0 && snap.seats[snap.turn]?.id === you.id}
                />
              ) : (
                <p className="text-center text-muted">Waiting for an open chair.</p>
              )}
              <p className="text-center font-display text-2xl text-balance" data-qa="banner">
                {snap.phase === "acting" && snap.seats[snap.turn]?.id === selfId ? "Your move." : snap.banner}
              </p>
              <p className="text-center text-xs tracking-widest text-muted uppercase">
                {snap.shoeCount} cards left in the shoe
              </p>
            </>
          )}
        </div>

        <div className="mt-3 shrink-0 border-t border-line pt-3">
          {you && snap?.phase === "betting" ? (
            <Betting seat={you} onCommand={onCommand} />
          ) : null}
          {you && snap?.phase === "acting" ? (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <Action label="Hit" hint="H" action="hit" legal={legal} onCommand={onCommand} qa="hit" />
              <Action label="Stand" hint="S" action="stand" legal={legal} onCommand={onCommand} qa="stand" />
              <Action label="Double" hint="D" action="double" legal={legal} onCommand={onCommand} qa="double" />
              <Action label="Split" hint="P" action="split" legal={legal} onCommand={onCommand} qa="split" />
            </div>
          ) : null}
          {snap?.phase === "result" ? (
            <button
              type="button"
              data-qa="next-hand"
              onClick={() => onCommand({ t: "next" })}
              className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-brass font-medium text-ink"
            >
              Next hand
            </button>
          ) : null}
          <p className="mt-3 text-center text-xs text-muted">
            Keys when a hand is live: H hit, S stand, D double, P split. Enter locks a bet. N deals the next hand.
          </p>
        </div>
      </div>
    </div>
  );
}

function Betting({ seat, onCommand }: { seat: Seat; onCommand: (msg: ClientMsg) => void }) {
  const broke = seat.chips < MIN_BET;
  return (
    <div>
      <div className="mb-3 flex items-end justify-between gap-3">
        <div>
          <p className="text-xs tracking-widest text-muted uppercase">Your bet</p>
          <p className="font-display text-4xl tabular-nums text-brass">{seat.locked ? seat.lastBet : seat.staged}</p>
        </div>
        <p className="text-sm text-muted tabular-nums">Stack {seat.chips}</p>
      </div>
      {broke ? (
        <button
          type="button"
          onClick={() => onCommand({ t: "rebuy" })}
          className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-brass font-medium text-ink"
        >
          Buy back in for {START_CHIPS}
        </button>
      ) : (
        <>
          <div className="flex flex-wrap gap-2">
            {CHIP_VALUES.map((value) => (
              <button
                key={value}
                type="button"
                data-qa={`chip-${value}`}
                disabled={seat.locked || seat.staged + value > seat.chips || seat.staged + value > MAX_BET}
                onClick={() => onCommand({ t: "chip", amount: value })}
                className="grid size-14 place-items-center rounded-full border-2 border-brass bg-ink font-semibold text-brass disabled:opacity-40"
              >
                {value}
              </button>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <button
              type="button"
              disabled={seat.locked || seat.staged === 0}
              onClick={() => onCommand({ t: "clear" })}
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-line disabled:opacity-40"
            >
              Clear
            </button>
            <button
              type="button"
              disabled={seat.locked || seat.lastBet < MIN_BET}
              onClick={() => onCommand({ t: "repeat" })}
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-line disabled:opacity-40"
            >
              Same bet
            </button>
            <button
              type="button"
              data-qa="lock"
              disabled={seat.locked || seat.staged < MIN_BET}
              onClick={() => onCommand({ t: "lock" })}
              className="col-span-2 inline-flex min-h-12 items-center justify-center rounded-full bg-brass font-medium text-ink disabled:opacity-40"
            >
              {seat.locked ? "Bet locked" : "Lock bet"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function Action({
  label,
  hint,
  action,
  legal,
  qa,
  onCommand,
}: {
  label: string;
  hint: string;
  action: Act;
  legal: Act[];
  qa: string;
  onCommand: (msg: ClientMsg) => void;
}) {
  const allowed = legal.includes(action);
  return (
    <button
      type="button"
      data-qa={qa}
      disabled={!allowed}
      onClick={() => onCommand({ t: "act", action })}
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-full disabled:opacity-40 ${allowed && action === "hit" ? "bg-brass font-medium text-ink" : "border border-line"}`}
    >
      {label}
      <span className="text-xs opacity-70">{hint}</span>
    </button>
  );
}

function Dealer({ dealer, holeHidden }: { dealer: Card[]; holeHidden: boolean }) {
  const total = dealer.length ? handTotal(dealer).total : 0;
  return (
    <section className="text-center" aria-label="Dealer">
      <p className="text-xs tracking-widest text-muted uppercase">House</p>
      <div className="mt-3 flex min-h-24 justify-center">
        {dealer.length === 0 ? (
          <div className="h-24 w-16 rounded-lg border border-dashed border-line sm:h-28 sm:w-20" />
        ) : (
          <div className="flex">
            {dealer.map((card, index) => (
              <PlayingCard key={`${card.r}${card.s}${index}`} card={card} index={index} />
            ))}
            {holeHidden ? <CardBack index={dealer.length} /> : null}
          </div>
        )}
      </div>
      <p className="mt-2 text-sm text-muted tabular-nums">
        {dealer.length === 0 ? "Waiting for bets" : holeHidden ? `Showing ${total}` : `Total ${total}`}
      </p>
    </section>
  );
}

function SeatView({ seat, mine, active }: { seat: Seat; mine?: boolean; active: boolean }) {
  return (
    <section className={`rounded-2xl border px-3 py-3 ${active ? "border-brass" : "border-line"}`} aria-label={seat.name}>
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="font-display text-xl">{mine ? `You · ${seat.name}` : seat.name}</h2>
        <p className="text-sm text-muted tabular-nums">
          {seat.chips} chips
          {seat.locked && seat.hands[0] ? ` · bet ${seat.hands.reduce((sum, hand) => sum + hand.bet, 0)}` : ""}
          {!seat.locked && seat.staged > 0 ? ` · staging ${seat.staged}` : ""}
        </p>
      </div>
      {seat.hands.length === 0 ? (
        <p className="mt-3 text-sm text-muted">{seat.locked ? "Bet locked." : "Choosing a bet."}</p>
      ) : (
        <div className="mt-3 flex flex-wrap gap-4">
          {seat.hands.map((hand, index) => {
            const total = handTotal(hand.cards);
            const focused = active && seat.focus === index && !hand.done;
            return (
              <div key={index} className={focused ? "rounded-xl ring-2 ring-brass ring-offset-2 ring-offset-ink" : ""}>
                <div className="flex">
                  {hand.cards.map((card, cardIndex) => (
                    <PlayingCard key={`${card.r}${card.s}${cardIndex}`} card={card} index={cardIndex} />
                  ))}
                </div>
                <p className="mt-1 text-sm tabular-nums">
                  {total.total}
                  {total.soft && total.total < 21 ? " soft" : ""}
                  {hand.doubled ? " · doubled" : ""}
                  {hand.outcome ? <OutcomeText outcome={hand.outcome} /> : null}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

function OutcomeText({ outcome }: { outcome: Outcome }) {
  const tone =
    outcome === "win" || outcome === "blackjack" ? "text-brass" : outcome === "push" ? "text-muted" : "text-wine";
  return <span className={`ml-2 ${tone}`}>{outcomeLabel(outcome)}</span>;
}

function PlayingCard({ card, index }: { card: Card; index: number }) {
  const red = isRed(card.s);
  return (
    <div
      className={`card-in relative flex h-24 w-16 flex-col justify-between rounded-lg border border-line bg-paper p-1.5 font-display sm:h-28 sm:w-20 ${index > 0 ? "-ml-5" : ""} ${red ? "text-wine" : "text-ink"}`}
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <span className="text-sm leading-none">
        {rankLabel(card.r)}
        {suitGlyph(card.s)}
      </span>
      <span className="self-center text-2xl leading-none sm:text-3xl">{suitGlyph(card.s)}</span>
      <span className="rotate-180 self-end text-sm leading-none">
        {rankLabel(card.r)}
        {suitGlyph(card.s)}
      </span>
    </div>
  );
}

function CardBack({ index }: { index: number }) {
  return (
    <div
      className={`card-in relative h-24 w-16 rounded-lg border-2 border-brass bg-ink sm:h-28 sm:w-20 ${index > 0 ? "-ml-5" : ""}`}
      style={{ animationDelay: `${index * 40}ms` }}
      aria-label="Face-down card"
    >
      <div className="absolute inset-2 rounded-md border border-brass" />
      <div className="absolute inset-4 rounded-sm border border-wine" />
    </div>
  );
}

/**
 * legalActions only needs the turn, phase, and the acting seat. The snapshot
 * is already public, so reuse it instead of a second rules implementation.
 */
function viewAsTable(snap: Snapshot): Table {
  return {
    phase: snap.phase,
    seats: snap.seats,
    dealer: snap.dealer,
    holeHidden: snap.holeHidden,
    turn: snap.turn,
    shoe: [],
    round: snap.round,
    banner: snap.banner,
  };
}
