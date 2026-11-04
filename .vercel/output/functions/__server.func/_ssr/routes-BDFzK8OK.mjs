import { o as __toESM } from "../_runtime.mjs";
import { K as require_jsx_runtime, q as require_react, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as useP2PRoom } from "./use-p2p-room-CtU6MI1f.mjs";
import { a as Play, o as LogOut, t as Users, u as Copy } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BDFzK8OK.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Parlor — two-seat blackjack against the house.
*
* The shoe never leaves the host. Guests only receive a Snapshot, and the
* dealer's hole card is omitted until the reveal. Payouts are integers:
* blackjack pays 3:2, other wins pay 1:1, ties push. The dealer stands on
* every 17, including soft 17. Split is allowed once; split aces take one
* card each and stand. No insurance, no surrender.
*/
var RANKS = [
	1,
	2,
	3,
	4,
	5,
	6,
	7,
	8,
	9,
	10,
	11,
	12,
	13
];
var START_CHIPS = 1e3;
var CHIP_VALUES = [
	10,
	50,
	100,
	500
];
var CHIP_SET = new Set(CHIP_VALUES);
var SUITS = [
	"s",
	"h",
	"d",
	"c"
];
function rankLabel(r) {
	if (r === 1) return "A";
	if (r === 11) return "J";
	if (r === 12) return "Q";
	if (r === 13) return "K";
	return String(r);
}
function suitGlyph(s) {
	return {
		s: "♠",
		h: "♥",
		d: "♦",
		c: "♣"
	}[s];
}
function isRed(s) {
	return s === "h" || s === "d";
}
function handTotal(cards) {
	let total = 0;
	let aces = 0;
	for (const card of cards) if (card.r === 1) {
		aces += 1;
		total += 11;
	} else if (card.r >= 10) total += 10;
	else total += card.r;
	while (total > 21 && aces > 0) {
		total -= 10;
		aces -= 1;
	}
	return {
		total,
		soft: aces > 0
	};
}
/** A two-card 21 that was not created by a split. */
function isNatural(cards) {
	return cards.length === 2 && handTotal(cards).total === 21;
}
function makeShoe(decks = 6, rng = Math.random) {
	const shoe = [];
	for (let d = 0; d < decks; d += 1) for (const s of SUITS) for (const r of RANKS) shoe.push({
		r,
		s
	});
	for (let i = shoe.length - 1; i > 0; i -= 1) {
		const j = Math.floor(rng() * (i + 1));
		const swap = shoe[i];
		shoe[i] = shoe[j];
		shoe[j] = swap;
	}
	return shoe;
}
function createTable(rng) {
	return {
		phase: "betting",
		seats: [],
		dealer: [],
		holeHidden: false,
		turn: -1,
		shoe: makeShoe(6, rng),
		round: 0,
		banner: "Place a bet from 10 to 500."
	};
}
function draw(table) {
	if (table.shoe.length === 0) table.shoe = makeShoe(6);
	const card = table.shoe.pop();
	if (!card) throw new Error("empty shoe");
	return card;
}
function sit(table, id, name) {
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
		focus: 0
	});
}
/**
* Drop a seat. Mid-hand, their remaining hands stand so the other player
* is not stuck waiting, then the seat is removed before the payout.
*/
function leave(table, id) {
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
	for (const hand of table.seats[index].hands) hand.done = true;
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
function addChip(table, id, amount) {
	if (!CHIP_SET.has(amount)) return;
	const seat = seatById(table, id);
	if (!seat || table.phase !== "betting" || seat.locked) return;
	const next = seat.staged + amount;
	if (next > seat.chips || next > 500) return;
	seat.staged = next;
}
function clearStage(table, id) {
	const seat = seatById(table, id);
	if (!seat || table.phase !== "betting" || seat.locked) return;
	seat.staged = 0;
}
function repeatBet(table, id) {
	const seat = seatById(table, id);
	if (!seat || table.phase !== "betting" || seat.locked || seat.lastBet < 10) return;
	const amount = Math.min(seat.lastBet, seat.chips, 500);
	if (amount < 10) return;
	seat.staged = amount;
}
function rebuy(table, id) {
	const seat = seatById(table, id);
	if (!seat || table.phase !== "betting" || seat.locked || seat.chips >= 10) return;
	seat.chips = START_CHIPS;
	seat.staged = 0;
}
function lockBet(table, id) {
	const seat = seatById(table, id);
	if (!seat || table.phase !== "betting" || seat.locked) return;
	if (seat.staged < 10 || seat.staged > seat.chips || seat.staged > 500) return;
	seat.chips -= seat.staged;
	seat.locked = true;
	seat.lastBet = seat.staged;
	if (!table.seats.every((s) => s.locked)) {
		table.banner = `Waiting for ${table.seats.filter((s) => !s.locked).map((s) => s.name).join(" and ")} to lock a bet.`;
		return;
	}
	deal(table);
}
function act(table, id, action) {
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
	} else if (action === "stand") hand.done = true;
	else if (action === "double") {
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
		const left = {
			cards: [leftCard, draw(table)],
			bet,
			done: aces,
			doubled: false,
			splitAce: aces
		};
		const right = {
			cards: [rightCard, draw(table)],
			bet,
			done: aces,
			doubled: false,
			splitAce: aces
		};
		if (!aces && handTotal(left.cards).total === 21) left.done = true;
		if (!aces && handTotal(right.cards).total === 21) right.done = true;
		seat.hands.splice(seat.focus, 1, left, right);
	} else return;
	advance(table);
}
function legalActions(table, id) {
	if (table.phase !== "acting" || table.turn < 0) return [];
	const seat = table.seats[table.turn];
	if (!seat || seat.id !== id) return [];
	const hand = seat.hands[seat.focus];
	if (!hand || hand.done) return [];
	if (hand.splitAce) return ["stand"];
	const actions = ["hit", "stand"];
	if (hand.cards.length === 2 && seat.chips >= hand.bet) actions.push("double");
	if (canSplit(seat, hand)) actions.push("split");
	return actions;
}
function nextRound(table) {
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
function snapshot(table) {
	return {
		phase: table.phase,
		seats: table.seats.map((seat) => ({
			...seat,
			hands: seat.hands.map((hand) => ({
				...hand,
				cards: [...hand.cards]
			}))
		})),
		dealer: table.holeHidden ? table.dealer.slice(0, 1) : [...table.dealer],
		holeHidden: table.holeHidden,
		turn: table.turn,
		shoeCount: table.shoe.length,
		round: table.round,
		banner: table.banner
	};
}
function isSnapshot(value) {
	if (!value || typeof value !== "object") return false;
	const snap = value;
	return (snap.phase === "betting" || snap.phase === "acting" || snap.phase === "result") && Array.isArray(snap.seats) && Array.isArray(snap.dealer) && typeof snap.banner === "string" && typeof snap.round === "number" && typeof snap.holeHidden === "boolean";
}
function parseClient(data) {
	if (!data || typeof data !== "object") return null;
	const msg = data;
	if (msg.t === "sit" && typeof msg.name === "string") return {
		t: "sit",
		name: msg.name
	};
	if (msg.t === "chip" && typeof msg.amount === "number" && CHIP_SET.has(msg.amount)) return {
		t: "chip",
		amount: msg.amount
	};
	if (msg.t === "clear") return { t: "clear" };
	if (msg.t === "lock") return { t: "lock" };
	if (msg.t === "repeat") return { t: "repeat" };
	if (msg.t === "next") return { t: "next" };
	if (msg.t === "rebuy") return { t: "rebuy" };
	if (msg.t === "act" && (msg.action === "hit" || msg.action === "stand" || msg.action === "double" || msg.action === "split")) return {
		t: "act",
		action: msg.action
	};
	return null;
}
/** Host-only. Applies one guest (or local) request and ignores anything illegal. */
function applyClient(table, id, msg) {
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
function seatById(table, id) {
	return table.seats.find((seat) => seat.id === id);
}
function canSplit(seat, hand) {
	if (hand.cards.length !== 2 || hand.splitAce) return false;
	if (seat.hands.length >= 2) return false;
	const [a, b] = hand.cards;
	if (!a || !b || a.r !== b.r) return false;
	return seat.chips >= hand.bet;
}
function deal(table) {
	if (table.shoe.length < 52) table.shoe = makeShoe(6);
	table.round += 1;
	table.dealer = [];
	table.holeHidden = true;
	for (const seat of table.seats) {
		seat.hands = [{
			cards: [],
			bet: seat.staged,
			done: false,
			doubled: false,
			splitAce: false
		}];
		seat.focus = 0;
	}
	for (let pass = 0; pass < 2; pass += 1) {
		for (const seat of table.seats) seat.hands[0].cards.push(draw(table));
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
function advance(table) {
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
function playDealer(table) {
	table.holeHidden = false;
	if (!table.seats.some((seat) => seat.hands.some((hand) => handTotal(hand.cards).total <= 21))) return;
	while (handTotal(table.dealer).total < 17) table.dealer.push(draw(table));
}
function settle(table, dealerNatural) {
	table.holeHidden = false;
	table.phase = "result";
	table.turn = -1;
	const dealerTotal = handTotal(table.dealer).total;
	const dealerBust = dealerTotal > 21;
	const lines = [];
	for (const seat of table.seats) {
		const bits = [];
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
				const profit = Math.floor(hand.bet * 3 / 2);
				seat.chips += hand.bet + profit;
				hand.outcome = "blackjack";
				bits.push("blackjack");
				continue;
			}
			if (dealerNatural || !dealerBust && total < dealerTotal) {
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
function outcomeLabel(outcome) {
	if (outcome === "blackjack") return "Blackjack";
	if (outcome === "bust") return "Bust";
	if (outcome === "win") return "Win";
	if (outcome === "lose") return "Lose";
	if (outcome === "push") return "Push";
	return "";
}
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
var ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
function makeCode() {
	const bytes = /* @__PURE__ */ new Uint8Array(4);
	crypto.getRandomValues(bytes);
	return Array.from(bytes, (n) => ALPHABET[n % 32]).join("");
}
function cleanCode(raw) {
	return raw.toUpperCase().replace(/[^A-Z2-9]/g, "").replace(/[IO]/g, "").slice(0, 4);
}
function hostKey(room) {
	return `parlor-host:${room}`;
}
function Parlor() {
	const [session, setSession] = (0, import_react.useState)(null);
	const [name, setName] = (0, import_react.useState)("Guest");
	const [code, setCode] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		const cleanName = (localStorage.getItem("parlor-name") || "Guest").trim().slice(0, 18) || "Guest";
		setName(cleanName);
		const room = cleanCode(new URLSearchParams(window.location.search).get("room") ?? "");
		if (!room) return;
		setCode(room);
		const creator = sessionStorage.getItem(hostKey(room)) === "1";
		setSession({
			kind: "net",
			room,
			creator,
			name: cleanName
		});
	}, []);
	if (session?.kind === "solo") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SoloTable, {
		name: session.name,
		onExit: () => setSession(null)
	});
	if (session?.kind === "net") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OnlineTable, {
		room: session.room,
		name: session.name,
		creator: session.creator,
		onExit: () => {
			sessionStorage.removeItem(hostKey(session.room));
			const url = new URL(window.location.href);
			url.searchParams.delete("room");
			window.history.replaceState(null, "", `${url.pathname}${url.search}`);
			setSession(null);
		}
	}, `${session.room}:${session.name}:${session.creator}`);
	const remember = (nextName) => {
		const clean = nextName.trim().slice(0, 18) || "Guest";
		localStorage.setItem("parlor-name", clean);
		return clean;
	};
	const openTable = (room, creator) => {
		const clean = remember(name);
		if (creator) sessionStorage.setItem(hostKey(room), "1");
		else sessionStorage.removeItem(hostKey(room));
		const url = new URL(window.location.href);
		url.searchParams.set("room", room);
		window.history.replaceState(null, "", `${url.pathname}${url.search}`);
		setSession({
			kind: "net",
			room,
			creator,
			name: clean
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
						className: "grid size-11 place-items-center rounded-lg border border-brass bg-ink-2 font-display text-xl text-brass",
						children: "P"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs tracking-widest text-muted uppercase",
						children: "Late table"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-lg leading-none",
						children: "Parlor"
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/house",
					className: "text-sm text-muted underline-offset-4 hover:text-paper hover:underline",
					children: "Night wing"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 grid flex-1 items-start gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display text-5xl leading-tight text-balance sm:text-6xl",
							children: "Two seats. One shoe."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-5 max-w-xl text-lg leading-relaxed text-pretty text-muted",
							children: "Blackjack against the house, with a friend in the other chair. You each bet, then play your own hand. The dealer stands on 17. Blackjack pays three to two."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							"data-qa": "practice",
							onClick: () => setSession({
								kind: "solo",
								name: remember(name)
							}),
							className: "mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-brass px-5 font-medium text-ink",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, {
								className: "size-5",
								"aria-hidden": true
							}), "Practice against the house"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 max-w-xl text-sm text-muted",
							children: "Practice stays on this device. Nobody else can join that shoe."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "mt-8 max-w-xl space-y-2 text-sm leading-relaxed text-muted",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Hit draws a card. Stand keeps the total. Double doubles the bet and takes exactly one card." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Split a pair into two hands, once. Split aces each get one card." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "A tie pushes. Bust and you lose, even if the dealer busts too." })
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-card border border-line bg-ink-2 p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, {
								className: "size-5 text-brass",
								"aria-hidden": true
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-2xl",
								children: "Sit with a friend"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm leading-relaxed text-muted",
							children: "Create a table and send the code. Your friend opens Parlor, enters it, and the two browsers connect directly. Your browser deals. Theirs never sees the deck or the hole card."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mt-5 block text-sm text-muted",
							htmlFor: "parlor-name",
							children: "Your name"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: "parlor-name",
							value: name,
							maxLength: 18,
							onChange: (event) => setName(event.target.value),
							className: "mt-2 min-h-12 w-full rounded-xl border border-line bg-ink px-3 text-paper"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"data-qa": "create-table",
							onClick: () => openTable(makeCode(), true),
							className: "mt-4 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-brass px-5 font-medium text-ink",
							children: "Create a table"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							className: "mt-4 flex gap-2",
							onSubmit: (event) => {
								event.preventDefault();
								const room = cleanCode(code);
								if (room.length === 4) openTable(room, false);
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "sr-only",
									htmlFor: "parlor-code",
									children: "Table code"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									id: "parlor-code",
									value: code,
									inputMode: "text",
									autoCapitalize: "characters",
									maxLength: 4,
									placeholder: "Code",
									onChange: (event) => setCode(cleanCode(event.target.value)),
									className: "min-h-12 min-w-0 flex-1 rounded-xl border border-line bg-ink px-3 tracking-widest text-paper uppercase"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "submit",
									"data-qa": "join-table",
									disabled: cleanCode(code).length !== 4,
									className: "inline-flex min-h-12 items-center justify-center rounded-full border border-line px-4 disabled:opacity-40",
									children: "Join"
								})
							]
						})
					]
				})]
			})]
		})
	});
}
function SoloTable({ name, onExit }) {
	const tableRef = (0, import_react.useRef)(null);
	const [snap, setSnap] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		const table = createTable();
		sit(table, "you", name);
		const saved = Number(localStorage.getItem("parlor-bank"));
		const seat = table.seats[0];
		if (seat && Number.isFinite(saved) && saved >= 0 && saved < 1e5) seat.chips = Math.floor(saved);
		tableRef.current = table;
		setSnap(snapshot(table));
	}, [name]);
	const send = (msg) => {
		const table = tableRef.current;
		if (!table) return;
		applyClient(table, "you", msg);
		const next = snapshot(table);
		const seat = next.seats[0];
		if (seat) localStorage.setItem("parlor-bank", String(seat.chips));
		setSnap(next);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableScreen, {
		snap,
		selfId: "you",
		note: "Practice. This shoe never leaves your browser.",
		onExit,
		onCommand: send
	});
}
function OnlineTable({ room, name, creator, onExit }) {
	const { selfId, peers, send, onMessage } = useP2PRoom({
		room,
		name
	});
	const tableRef = (0, import_react.useRef)(null);
	const hostFrom = (0, import_react.useRef)(null);
	const [snap, setSnap] = (0, import_react.useState)(null);
	const [full, setFull] = (0, import_react.useState)(false);
	const publish = (0, import_react.useCallback)(() => {
		const table = tableRef.current;
		if (!table) return;
		const next = snapshot(table);
		setSnap(next);
		send({
			t: "snap",
			snap: next
		});
	}, [send]);
	(0, import_react.useEffect)(() => {
		if (!creator) return;
		const table = createTable();
		sit(table, selfId, name);
		tableRef.current = table;
		setSnap(snapshot(table));
	}, [
		creator,
		selfId,
		name
	]);
	(0, import_react.useEffect)(() => {
		return onMessage((from, data) => {
			if (!creator) {
				if (!data || typeof data !== "object") return;
				const msg = data;
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
	}, [
		creator,
		onMessage,
		peers,
		publish,
		send
	]);
	const seated = snap?.seats.some((seat) => seat.id === selfId) ?? false;
	(0, import_react.useEffect)(() => {
		if (creator || seated || full) return;
		const announce = () => {
			if (peers.some((peer) => peer.connectionState === "connected")) send({
				t: "sit",
				name
			});
		};
		announce();
		const id = window.setInterval(announce, 700);
		return () => window.clearInterval(id);
	}, [
		creator,
		seated,
		full,
		peers,
		send,
		name
	]);
	(0, import_react.useEffect)(() => {
		if (!creator) return;
		const table = tableRef.current;
		if (!table) return;
		const alive = new Set(peers.map((peer) => peer.id));
		let changed = false;
		for (const seat of [...table.seats]) if (seat.id !== selfId && !alive.has(seat.id)) {
			leave(table, seat.id);
			changed = true;
		}
		if (changed) publish();
	}, [
		creator,
		peers,
		selfId,
		publish
	]);
	const connected = peers.some((peer) => peer.connectionState === "connected");
	const note = creator ? connected ? "Your friend is connected. You are dealing." : "Share the code. You deal once they sit down." : connected ? "Connected to the dealer. They hold the shoe." : "Looking for the host of this code. They need to stay at the table.";
	if (full) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, {
		onExit,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display text-4xl",
			children: "This table is full."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 max-w-md text-muted",
			children: "Parlor seats two. Ask for a new code, or play the house alone."
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableScreen, {
		snap,
		selfId,
		room,
		note,
		waiting: creator ? !snap : !seated,
		onExit,
		onCommand: (msg) => {
			if (creator) {
				const table = tableRef.current;
				if (!table) return;
				applyClient(table, selfId, msg);
				publish();
			} else send(msg);
		}
	});
}
function Shell({ children, onExit }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-ink px-5 py-8 text-paper",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: onExit,
			className: "inline-flex min-h-12 items-center gap-2 text-sm text-muted",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, {
				className: "size-4",
				"aria-hidden": true
			}), "Leave table"]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto mt-16 max-w-lg",
			children
		})]
	});
}
function TableScreen({ snap, selfId, room, note, waiting, onExit, onCommand }) {
	const [copied, setCopied] = (0, import_react.useState)(false);
	const commandRef = (0, import_react.useRef)(onCommand);
	commandRef.current = onCommand;
	(0, import_react.useEffect)(() => {
		const onKey = (event) => {
			if (event.metaKey || event.ctrlKey || event.altKey) return;
			const target = event.target;
			if (target instanceof HTMLInputElement || target instanceof HTMLButtonElement || target instanceof HTMLTextAreaElement) return;
			const key = event.key.toLowerCase();
			const action = {
				h: "hit",
				s: "stand",
				d: "double",
				p: "split"
			}[key];
			if (action) {
				event.preventDefault();
				commandRef.current({
					t: "act",
					action
				});
			} else if (key === "n") commandRef.current({ t: "next" });
			else if (key === "enter") commandRef.current({ t: "lock" });
			else if (key === "c") commandRef.current({ t: "clear" });
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-dvh overflow-x-hidden bg-ink text-paper",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex min-h-dvh w-full max-w-5xl flex-col px-4 py-4 sm:px-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "flex flex-wrap items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid size-10 place-items-center rounded-lg border border-brass font-display text-brass",
							children: "P"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-lg leading-none",
							children: "Parlor"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted",
							children: snap ? `Round ${snap.round}` : "Shuffling"
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [room ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => void copyCode(),
							className: "inline-flex min-h-12 items-center gap-2 rounded-full border border-line px-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, {
									className: "size-4 text-brass",
									"aria-hidden": true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-display tracking-widest",
									children: room
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm text-muted",
									children: copied ? "Copied" : "Copy"
								})
							]
						}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: onExit,
							className: "inline-flex min-h-12 items-center gap-2 rounded-full border border-line px-4 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, {
								className: "size-4",
								"aria-hidden": true
							}), "Leave"]
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-sm text-muted",
					"aria-live": "polite",
					children: note
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "table-felt mt-4 flex flex-1 flex-col gap-6 rounded-card px-4 py-6 sm:px-8",
					"data-qa": "table",
					children: waiting || !snap ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "m-auto text-center font-display text-3xl text-paper",
						children: "Taking a seat…"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dealer, {
							dealer: snap.dealer,
							holeHidden: snap.holeHidden
						}),
						others.map((seat) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeatView, {
							seat,
							active: snap.turn >= 0 && snap.seats[snap.turn]?.id === seat.id
						}, seat.id)),
						you ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeatView, {
							seat: you,
							mine: true,
							active: snap.turn >= 0 && snap.seats[snap.turn]?.id === you.id
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-center text-muted",
							children: "Waiting for an open chair."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-center font-display text-2xl text-balance",
							"data-qa": "banner",
							children: snap.banner
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-center text-xs tracking-widest text-muted uppercase",
							children: [snap.shoeCount, " cards left in the shoe"]
						})
					] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "sticky bottom-0 z-10 -mx-4 mt-4 border-t border-line bg-ink px-4 py-4 sm:-mx-6 sm:px-6",
					children: [
						you && snap?.phase === "betting" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Betting, {
							seat: you,
							onCommand
						}) : null,
						you && snap?.phase === "acting" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-2 sm:grid-cols-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Action, {
									label: "Hit",
									hint: "H",
									action: "hit",
									legal,
									onCommand,
									qa: "hit"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Action, {
									label: "Stand",
									hint: "S",
									action: "stand",
									legal,
									onCommand,
									qa: "stand"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Action, {
									label: "Double",
									hint: "D",
									action: "double",
									legal,
									onCommand,
									qa: "double"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Action, {
									label: "Split",
									hint: "P",
									action: "split",
									legal,
									onCommand,
									qa: "split"
								})
							]
						}) : null,
						snap?.phase === "result" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"data-qa": "next-hand",
							onClick: () => onCommand({ t: "next" }),
							className: "inline-flex min-h-12 w-full items-center justify-center rounded-full bg-brass font-medium text-ink",
							children: "Next hand"
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-center text-xs text-muted",
							children: "Keys when a hand is live: H hit, S stand, D double, P split. Enter locks a bet. N deals the next hand."
						})
					]
				})
			]
		})
	});
}
function Betting({ seat, onCommand }) {
	const broke = seat.chips < 10;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-3 flex items-end justify-between gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs tracking-widest text-muted uppercase",
			children: "Your bet"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display text-4xl tabular-nums text-brass",
			children: seat.locked ? seat.lastBet : seat.staged
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "text-sm text-muted tabular-nums",
			children: ["Stack ", seat.chips]
		})]
	}), broke ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: () => onCommand({ t: "rebuy" }),
		className: "inline-flex min-h-12 w-full items-center justify-center rounded-full bg-brass font-medium text-ink",
		children: ["Buy back in for ", START_CHIPS]
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex flex-wrap gap-2",
		children: CHIP_VALUES.map((value) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			"data-qa": `chip-${value}`,
			disabled: seat.locked || seat.staged + value > seat.chips || seat.staged + value > 500,
			onClick: () => onCommand({
				t: "chip",
				amount: value
			}),
			className: "grid size-14 place-items-center rounded-full border-2 border-brass bg-ink font-semibold text-brass disabled:opacity-40",
			children: value
		}, value))
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				disabled: seat.locked || seat.staged === 0,
				onClick: () => onCommand({ t: "clear" }),
				className: "inline-flex min-h-12 items-center justify-center rounded-full border border-line disabled:opacity-40",
				children: "Clear"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				disabled: seat.locked || seat.lastBet < 10,
				onClick: () => onCommand({ t: "repeat" }),
				className: "inline-flex min-h-12 items-center justify-center rounded-full border border-line disabled:opacity-40",
				children: "Same bet"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"data-qa": "lock",
				disabled: seat.locked || seat.staged < 10,
				onClick: () => onCommand({ t: "lock" }),
				className: "col-span-2 inline-flex min-h-12 items-center justify-center rounded-full bg-brass font-medium text-ink disabled:opacity-40",
				children: seat.locked ? "Bet locked" : "Lock bet"
			})
		]
	})] })] });
}
function Action({ label, hint, action, legal, qa, onCommand }) {
	const allowed = legal.includes(action);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		"data-qa": qa,
		disabled: !allowed,
		onClick: () => onCommand({
			t: "act",
			action
		}),
		className: `inline-flex min-h-12 items-center justify-center gap-2 rounded-full disabled:opacity-40 ${allowed && action === "hit" ? "bg-brass font-medium text-ink" : "border border-line"}`,
		children: [label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-xs opacity-70",
			children: hint
		})]
	});
}
function Dealer({ dealer, holeHidden }) {
	const total = dealer.length ? handTotal(dealer).total : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "text-center",
		"aria-label": "Dealer",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs tracking-widest text-muted uppercase",
				children: "House"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 flex min-h-24 justify-center",
				children: dealer.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-24 w-16 rounded-lg border border-dashed border-line sm:h-28 sm:w-20" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex",
					children: [dealer.map((card, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayingCard, {
						card,
						index
					}, `${card.r}${card.s}${index}`)), holeHidden ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardBack, { index: dealer.length }) : null]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted tabular-nums",
				children: dealer.length === 0 ? "Waiting for bets" : holeHidden ? `Showing ${total}` : `Total ${total}`
			})
		]
	});
}
function SeatView({ seat, mine, active }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: `rounded-2xl border px-3 py-3 ${active ? "border-brass" : "border-line"}`,
		"aria-label": seat.name,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-baseline justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "font-display text-xl",
				children: [mine ? "You" : seat.name, mine ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "ml-2 text-sm text-muted",
					children: seat.name
				}) : null]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted tabular-nums",
				children: [
					seat.chips,
					" chips",
					seat.locked && seat.hands[0] ? ` · bet ${seat.hands.reduce((sum, hand) => sum + hand.bet, 0)}` : "",
					!seat.locked && seat.staged > 0 ? ` · staging ${seat.staged}` : ""
				]
			})]
		}), seat.hands.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 text-sm text-muted",
			children: seat.locked ? "Bet locked." : "Choosing a bet."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-3 flex flex-wrap gap-4",
			children: seat.hands.map((hand, index) => {
				const total = handTotal(hand.cards);
				const focused = active && seat.focus === index && !hand.done;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: focused ? "rounded-xl ring-2 ring-brass ring-offset-2 ring-offset-ink" : "",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex",
						children: hand.cards.map((card, cardIndex) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayingCard, {
							card,
							index: cardIndex
						}, `${card.r}${card.s}${cardIndex}`))
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm tabular-nums",
						children: [
							total.total,
							total.soft && total.total < 21 ? " soft" : "",
							hand.doubled ? " · doubled" : "",
							hand.outcome ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OutcomeText, { outcome: hand.outcome }) : null
						]
					})]
				}, index);
			})
		})]
	});
}
function OutcomeText({ outcome }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: `ml-2 ${outcome === "win" || outcome === "blackjack" ? "text-brass" : outcome === "push" ? "text-muted" : "text-wine"}`,
		children: outcomeLabel(outcome)
	});
}
function PlayingCard({ card, index }) {
	const red = isRed(card.s);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `card-in relative flex h-24 w-16 flex-col justify-between rounded-lg border border-line bg-paper p-1.5 font-display sm:h-28 sm:w-20 ${index > 0 ? "-ml-5" : ""} ${red ? "text-wine" : "text-ink"}`,
		style: { animationDelay: `${index * 40}ms` },
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "text-sm leading-none",
				children: [rankLabel(card.r), suitGlyph(card.s)]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "self-center text-2xl leading-none sm:text-3xl",
				children: suitGlyph(card.s)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "rotate-180 self-end text-sm leading-none",
				children: [rankLabel(card.r), suitGlyph(card.s)]
			})
		]
	});
}
function CardBack({ index }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `card-in relative h-24 w-16 rounded-lg border-2 border-brass bg-ink sm:h-28 sm:w-20 ${index > 0 ? "-ml-5" : ""}`,
		style: { animationDelay: `${index * 40}ms` },
		"aria-label": "Face-down card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-2 rounded-md border border-brass" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-4 rounded-sm border border-wine" })]
	});
}
/**
* legalActions only needs the turn, phase, and the acting seat. The snapshot
* is already public, so reuse it instead of a second rules implementation.
*/
function viewAsTable(snap) {
	return {
		phase: snap.phase,
		seats: snap.seats,
		dealer: snap.dealer,
		holeHidden: snap.holeHidden,
		turn: snap.turn,
		shoe: [],
		round: snap.round,
		banner: snap.banner
	};
}
var SplitComponent = Parlor;
//#endregion
export { SplitComponent as component };
