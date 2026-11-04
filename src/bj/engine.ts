/**
 * Parlor — two-seat blackjack against the house.
 *
 * The shoe never leaves the host. Guests only receive a Snapshot, and the
 * dealer's hole card is omitted until the reveal. Payouts are integers:
 * blackjack pays 3:2, other wins pay 1:1, ties push. The dealer stands on
 * every 17, including soft 17. Split is allowed once; split aces take one
 * card each and stand. No insurance, no surrender.
 */
export const RANKS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13] as const;
export type Rank = (typeof RANKS)[number];
export type Suit = "s" | "h" | "d" | "c";
export type Card = { r: Rank; s: Suit };

export const START_CHIPS = 1000;
export const MIN_BET = 10;
export const MAX_BET = 500;
export const CHIP_VALUES = [10, 50, 100, 500] as const;
const CHIP_SET = new Set<number>(CHIP_VALUES);

export type Act = "hit" | "stand" | "double" | "split";
export type Outcome = "win" | "lose" | "push" | "blackjack" | "bust";
export type Phase = "betting" | "acting" | "result";

export interface Hand {
  cards: Card[];
  bet: number;
  done: boolean;
  doubled: boolean;
  /** Split aces: one card, then the hand stands. */
  splitAce: boolean;
  outcome?: Outcome;
}

export interface Seat {
  id: string;
  name: string;
  chips: number;
  /** Chips staged for the next hand. Taken from the stack only when locked. */
  staged: number;
  locked: boolean;
  lastBet: number;
  hands: Hand[];
  focus: number;
}

export interface Table {
  phase: Phase;
  seats: Seat[];
  dealer: Card[];
  holeHidden: boolean;
  /** Index into seats, or -1 when nobody is deciding. */
  turn: number;
  shoe: Card[];
  round: number;
  banner: string;
}

/** What every browser is allowed to see. No shoe, no hole card. */
export interface Snapshot {
  phase: Phase;
  seats: Seat[];
  dealer: Card[];
  holeHidden: boolean;
  turn: number;
  shoeCount: number;
  round: number;
  banner: string;
}

export type ClientMsg =
  | { t: "sit"; name: string }
  | { t: "chip"; amount: number }
  | { t: "clear" }
  | { t: "lock" }
  | { t: "repeat" }
  | { t: "act"; action: Act }
  | { t: "next" }
  | { t: "rebuy" };

const SUITS: Suit[] = ["s", "h", "d", "c"];

export function rankLabel(r: Rank): string {
  if (r === 1) return "A";
  if (r === 11) return "J";
  if (r === 12) return "Q";
  if (r === 13) return "K";
  return String(r);
}

export function suitGlyph(s: Suit): string {
  return { s: "♠", h: "♥", d: "♦", c: "♣" }[s];
}

export function isRed(s: Suit): boolean {
  return s === "h" || s === "d";
}

export function handTotal(cards: Card[]): { total: number; soft: boolean } {
  let total = 0;
  let aces = 0;
  for (const card of cards) {
    if (card.r === 1) {
      aces += 1;
      total += 11;
    } else if (card.r >= 10) {
      total += 10;
    } else {
      total += card.r;
    }
  }
  while (total > 21 && aces > 0) {
    total -= 10;
    aces -= 1;
  }
  return { total, soft: aces > 0 };
}

/** A two-card 21 that was not created by a split. */
export function isNatural(cards: Card[]): boolean {
  return cards.length === 2 && handTotal(cards).total === 21;
}

export function makeShoe(decks = 6, rng: () => number = Math.random): Card[] {
  const shoe: Card[] = [];
  for (let d = 0; d < decks; d += 1) {
    for (const s of SUITS) {
      for (const r of RANKS) shoe.push({ r, s });
    }
  }
  for (let i = shoe.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    const swap = shoe[i];
    shoe[i] = shoe[j]!;
    shoe[j] = swap!;
  }
  return shoe;
}

export function createTable(rng?: () => number): Table {
  return {
    phase: "betting",
    seats: [],
    dealer: [],
    holeHidden: false,
    turn: -1,
    shoe: makeShoe(6, rng),
    round: 0,
    banner: "Place a bet from 10 to 500.",
  };
}

/** Test helper: the first card of `nextOut` is the next one dealt. */
export function debugShoe(table: Table, nextOut: Card[]): void {
  const pad: Card[] = [];
  while (pad.length + nextOut.length < 60) pad.push({ r: 2, s: "c" });
  table.shoe = [...pad, ...[...nextOut].reverse()];
}

function draw(table: Table): Card {
  if (table.shoe.length === 0) table.shoe = makeShoe(6);
  const card = table.shoe.pop();
  if (!card) throw new Error("empty shoe");
  return card;
}

export function sit(table: Table, id: string, name: string): void {
  const clean = name.replace(/\s+/g, " ").trim().slice(0, 18) || "Guest";
  const existing = table.seats.find((seat) => seat.id === id);
  if (existing) {
    existing.name = clean;
    return;
  }
  if (table.seats.length >= 2) return;
  table.seats.push({
    id,
    name: clean,
    chips: START_CHIPS,
    staged: 0,
    locked: false,
    lastBet: 0,
    hands: [],
    focus: 0,
  });
}

/**
 * Drop a seat. Mid-hand, their remaining hands stand so the other player
 * is not stuck waiting, then the seat is removed before the payout.
 */
export function leave(table: Table, id: string): void {
  const index = table.seats.findIndex((seat) => seat.id === id);
  if (index < 0) return;
  if (table.phase !== "acting") {
    table.seats.splice(index, 1);
    if (table.seats.length === 0) {
      table.phase = "betting";
      table.dealer = [];
      table.holeHidden = false;
      table.turn = -1;
      table.banner = "Place a bet from 10 to 500.";
    }
    return;
  }
  for (const hand of table.seats[index]!.hands) hand.done = true;
  const wasTurn = table.turn === index;
  table.seats.splice(index, 1);
  if (table.seats.length === 0) {
    table.phase = "betting";
    table.dealer = [];
    table.holeHidden = false;
    table.turn = -1;
    table.banner = "The other seat left.";
    return;
  }
  if (table.turn > index) table.turn -= 1;
  if (wasTurn) advance(table);
}

export function addChip(table: Table, id: string, amount: number): void {
  if (!CHIP_SET.has(amount)) return;
  const seat = seatById(table, id);
  if (!seat || table.phase !== "betting" || seat.locked) return;
  const next = seat.staged + amount;
  if (next > seat.chips || next > MAX_BET) return;
  seat.staged = next;
}

export function clearStage(table: Table, id: string): void {
  const seat = seatById(table, id);
  if (!seat || table.phase !== "betting" || seat.locked) return;
  seat.staged = 0;
}

export function repeatBet(table: Table, id: string): void {
  const seat = seatById(table, id);
  if (!seat || table.phase !== "betting" || seat.locked || seat.lastBet < MIN_BET) return;
  const amount = Math.min(seat.lastBet, seat.chips, MAX_BET);
  if (amount < MIN_BET) return;
  seat.staged = amount;
}

export function rebuy(table: Table, id: string): void {
  const seat = seatById(table, id);
  if (!seat || table.phase !== "betting" || seat.locked || seat.chips >= MIN_BET) return;
  seat.chips = START_CHIPS;
  seat.staged = 0;
}

export function lockBet(table: Table, id: string): void {
  const seat = seatById(table, id);
  if (!seat || table.phase !== "betting" || seat.locked) return;
  if (seat.staged < MIN_BET || seat.staged > seat.chips || seat.staged > MAX_BET) return;
  seat.chips -= seat.staged;
  seat.locked = true;
  seat.lastBet = seat.staged;
  if (!table.seats.every((s) => s.locked)) {
    const waiting = table.seats.filter((s) => !s.locked).map((s) => s.name);
    table.banner = `Waiting for ${waiting.join(" and ")} to lock a bet.`;
    return;
  }
  deal(table);
}

export function act(table: Table, id: string, action: Act): void {
  if (table.phase !== "acting" || table.turn < 0) return;
  const seat = table.seats[table.turn];
  if (!seat || seat.id !== id) return;
  const hand = seat.hands[seat.focus];
  if (!hand || hand.done || hand.splitAce) {
    if (hand?.splitAce && action === "stand") hand.done = true;
    else return;
  } else if (action === "hit") {
    hand.cards.push(draw(table));
    if (handTotal(hand.cards).total >= 21) hand.done = true;
  } else if (action === "stand") {
    hand.done = true;
  } else if (action === "double") {
    if (hand.cards.length !== 2 || seat.chips < hand.bet) return;
    seat.chips -= hand.bet;
    hand.bet *= 2;
    hand.doubled = true;
    hand.cards.push(draw(table));
    hand.done = true;
  } else if (action === "split") {
    if (!canSplit(seat, hand)) return;
    const [leftCard, rightCard] = hand.cards;
    if (!leftCard || !rightCard) return;
    const bet = hand.bet;
    seat.chips -= bet;
    const aces = leftCard.r === 1;
    const left: Hand = {
      cards: [leftCard, draw(table)],
      bet,
      done: aces,
      doubled: false,
      splitAce: aces,
    };
    const right: Hand = {
      cards: [rightCard, draw(table)],
      bet,
      done: aces,
      doubled: false,
      splitAce: aces,
    };
    if (!aces && handTotal(left.cards).total === 21) left.done = true;
    if (!aces && handTotal(right.cards).total === 21) right.done = true;
    seat.hands.splice(seat.focus, 1, left, right);
  } else {
    return;
  }
  advance(table);
}

export function legalActions(table: Table, id: string): Act[] {
  if (table.phase !== "acting" || table.turn < 0) return [];
  const seat = table.seats[table.turn];
  if (!seat || seat.id !== id) return [];
  const hand = seat.hands[seat.focus];
  if (!hand || hand.done) return [];
  if (hand.splitAce) return ["stand"];
  const actions: Act[] = ["hit", "stand"];
  if (hand.cards.length === 2 && seat.chips >= hand.bet) actions.push("double");
  if (canSplit(seat, hand)) actions.push("split");
  return actions;
}

export function nextRound(table: Table): void {
  if (table.phase !== "result") return;
  table.phase = "betting";
  table.dealer = [];
  table.holeHidden = false;
  table.turn = -1;
  for (const seat of table.seats) {
    seat.hands = [];
    seat.locked = false;
    seat.staged = 0;
    seat.focus = 0;
  }
  table.banner = "Place a bet from 10 to 500.";
}

export function snapshot(table: Table): Snapshot {
  return {
    phase: table.phase,
    seats: table.seats.map((seat) => ({
      ...seat,
      hands: seat.hands.map((hand) => ({ ...hand, cards: [...hand.cards] })),
    })),
    dealer: table.holeHidden ? table.dealer.slice(0, 1) : [...table.dealer],
    holeHidden: table.holeHidden,
    turn: table.turn,
    shoeCount: table.shoe.length,
    round: table.round,
    banner: table.banner,
  };
}

export function isSnapshot(value: unknown): value is Snapshot {
  if (!value || typeof value !== "object") return false;
  const snap = value as Snapshot;
  return (
    (snap.phase === "betting" || snap.phase === "acting" || snap.phase === "result") &&
    Array.isArray(snap.seats) &&
    Array.isArray(snap.dealer) &&
    typeof snap.banner === "string" &&
    typeof snap.round === "number" &&
    typeof snap.holeHidden === "boolean"
  );
}

export function parseClient(data: unknown): ClientMsg | null {
  if (!data || typeof data !== "object") return null;
  const msg = data as Record<string, unknown>;
  if (msg.t === "sit" && typeof msg.name === "string") return { t: "sit", name: msg.name };
  if (msg.t === "chip" && typeof msg.amount === "number" && CHIP_SET.has(msg.amount)) {
    return { t: "chip", amount: msg.amount };
  }
  if (msg.t === "clear") return { t: "clear" };
  if (msg.t === "lock") return { t: "lock" };
  if (msg.t === "repeat") return { t: "repeat" };
  if (msg.t === "next") return { t: "next" };
  if (msg.t === "rebuy") return { t: "rebuy" };
  if (
    msg.t === "act" &&
    (msg.action === "hit" || msg.action === "stand" || msg.action === "double" || msg.action === "split")
  ) {
    return { t: "act", action: msg.action };
  }
  return null;
}

/** Host-only. Applies one guest (or local) request and ignores anything illegal. */
export function applyClient(table: Table, id: string, msg: ClientMsg): "full" | "ok" {
  if (msg.t === "sit") {
    const before = table.seats.length;
    sit(table, id, msg.name);
    if (!table.seats.some((seat) => seat.id === id) && table.seats.length === before) return "full";
    return "ok";
  }
  if (msg.t === "chip") addChip(table, id, msg.amount);
  else if (msg.t === "clear") clearStage(table, id);
  else if (msg.t === "lock") lockBet(table, id);
  else if (msg.t === "repeat") repeatBet(table, id);
  else if (msg.t === "act") act(table, id, msg.action);
  else if (msg.t === "next") nextRound(table);
  else if (msg.t === "rebuy") rebuy(table, id);
  return "ok";
}

function seatById(table: Table, id: string): Seat | undefined {
  return table.seats.find((seat) => seat.id === id);
}

function canSplit(seat: Seat, hand: Hand): boolean {
  if (hand.cards.length !== 2 || hand.splitAce) return false;
  if (seat.hands.length >= 2) return false;
  const [a, b] = hand.cards;
  if (!a || !b || a.r !== b.r) return false;
  return seat.chips >= hand.bet;
}

function deal(table: Table): void {
  if (table.shoe.length < 52) table.shoe = makeShoe(6);
  table.round += 1;
  table.dealer = [];
  table.holeHidden = true;
  for (const seat of table.seats) {
    seat.hands = [
      {
        cards: [],
        bet: seat.staged,
        done: false,
        doubled: false,
        splitAce: false,
      },
    ];
    seat.focus = 0;
  }
  for (let pass = 0; pass < 2; pass += 1) {
    for (const seat of table.seats) seat.hands[0]!.cards.push(draw(table));
    table.dealer.push(draw(table));
  }
  if (isNatural(table.dealer)) {
    table.holeHidden = false;
    for (const seat of table.seats) for (const hand of seat.hands) hand.done = true;
    settle(table, true);
    return;
  }
  for (const seat of table.seats) {
    const hand = seat.hands[0];
    if (hand && isNatural(hand.cards)) hand.done = true;
  }
  table.phase = "acting";
  table.turn = 0;
  advance(table);
}

function advance(table: Table): void {
  if (table.phase !== "acting") return;
  if (table.seats.length === 0) {
    table.phase = "betting";
    table.turn = -1;
    table.banner = "Place a bet from 10 to 500.";
    return;
  }
  if (table.turn < 0) table.turn = 0;
  while (table.turn < table.seats.length) {
    const seat = table.seats[table.turn];
    if (!seat) break;
    const current = seat.hands[seat.focus];
    if (current && !current.done) {
      table.banner = `${seat.name} to act.`;
      return;
    }
    const later = seat.hands.findIndex((hand, index) => index > seat.focus && !hand.done);
    if (later >= 0) {
      seat.focus = later;
      table.banner = `${seat.name}, next hand.`;
      return;
    }
    table.turn += 1;
    const next = table.seats[table.turn];
    if (next) next.focus = Math.max(0, next.hands.findIndex((hand) => !hand.done));
  }
  playDealer(table);
  settle(table, false);
}

function playDealer(table: Table): void {
  table.holeHidden = false;
  const anyoneLive = table.seats.some((seat) =>
    seat.hands.some((hand) => handTotal(hand.cards).total <= 21),
  );
  if (!anyoneLive) return;
  while (handTotal(table.dealer).total < 17) table.dealer.push(draw(table));
}

function settle(table: Table, dealerNatural: boolean): void {
  table.holeHidden = false;
  table.phase = "result";
  table.turn = -1;
  const dealerTotal = handTotal(table.dealer).total;
  const dealerBust = dealerTotal > 21;
  const lines: string[] = [];
  for (const seat of table.seats) {
    const bits: string[] = [];
    for (const hand of seat.hands) {
      const total = handTotal(hand.cards).total;
      const natural = isNatural(hand.cards) && seat.hands.length === 1 && !hand.doubled;
      if (total > 21) {
        hand.outcome = "bust";
        bits.push("bust");
        continue;
      }
      if (natural && dealerNatural) {
        seat.chips += hand.bet;
        hand.outcome = "push";
        bits.push("push");
        continue;
      }
      if (natural && !dealerNatural) {
        const profit = Math.floor((hand.bet * 3) / 2);
        seat.chips += hand.bet + profit;
        hand.outcome = "blackjack";
        bits.push("blackjack");
        continue;
      }
      if (dealerNatural || (!dealerBust && total < dealerTotal)) {
        hand.outcome = "lose";
        bits.push("lose");
        continue;
      }
      if (dealerBust || total > dealerTotal) {
        seat.chips += hand.bet * 2;
        hand.outcome = "win";
        bits.push("win");
        continue;
      }
      seat.chips += hand.bet;
      hand.outcome = "push";
      bits.push("push");
    }
    if (bits.length) lines.push(`${seat.name}: ${bits.join(", ")}`);
    seat.locked = false;
    seat.staged = 0;
  }
  table.banner = lines.join(" · ") || "Hand over.";
}

export function outcomeLabel(outcome: Outcome | undefined): string {
  if (outcome === "blackjack") return "Blackjack";
  if (outcome === "bust") return "Bust";
  if (outcome === "win") return "Win";
  if (outcome === "lose") return "Lose";
  if (outcome === "push") return "Push";
  return "";
}
