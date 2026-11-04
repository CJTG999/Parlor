import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  START_CHIPS,
  act,
  addChip,
  applyClient,
  createTable,
  debugShoe,
  handTotal,
  isSnapshot,
  leave,
  lockBet,
  nextRound,
  sit,
  snapshot,
  type Card,
} from "./engine.ts";

const c = (r: Card["r"], s: Card["s"]): Card => ({ r, s });

describe("hand totals", () => {
  it("counts ace high then low", () => {
    assert.deepEqual(handTotal([c(1, "s"), c(13, "h")]), { total: 21, soft: true });
    assert.deepEqual(handTotal([c(1, "s"), c(1, "h"), c(9, "d")]), { total: 21, soft: true });
    assert.deepEqual(handTotal([c(13, "s"), c(12, "c")]), { total: 20, soft: false });
    assert.deepEqual(handTotal([c(1, "s"), c(6, "h"), c(10, "d")]), { total: 17, soft: false });
  });
});

describe("dealing and payouts", () => {
  it("pays blackjack 3:2 and does not let the player hit", () => {
    const table = createTable(() => 0);
    sit(table, "you", "You");
    debugShoe(table, [c(13, "s"), c(10, "h"), c(1, "s"), c(9, "d")]);
    addChip(table, "you", 100);
    lockBet(table, "you");
    assert.equal(table.phase, "result");
    assert.equal(table.seats[0]?.chips, START_CHIPS - 100 + 250);
    assert.equal(table.seats[0]?.hands[0]?.outcome, "blackjack");
    act(table, "you", "hit");
    assert.equal(table.seats[0]?.hands[0]?.cards.length, 2);
  });

  it("stands the dealer on 17 and pays a win", () => {
    const table = createTable(() => 0);
    sit(table, "you", "You");
    debugShoe(table, [c(10, "s"), c(10, "h"), c(9, "s"), c(7, "d")]);
    addChip(table, "you", 100);
    lockBet(table, "you");
    assert.equal(table.phase, "acting");
    assert.equal(snapshot(table).dealer.length, 1);
    act(table, "you", "stand");
    assert.equal(table.phase, "result");
    assert.equal(table.holeHidden, false);
    assert.equal(handTotal(table.dealer).total, 17);
    assert.equal(table.seats[0]?.chips, START_CHIPS + 100);
    assert.equal(table.seats[0]?.hands[0]?.outcome, "win");
  });

  it("busts a hit and does not pay if the dealer would have busted", () => {
    const table = createTable(() => 0);
    sit(table, "you", "You");
    debugShoe(table, [c(10, "s"), c(6, "h"), c(7, "s"), c(10, "d"), c(5, "c"), c(9, "h")]);
    addChip(table, "you", 50);
    lockBet(table, "you");
    act(table, "you", "hit");
    assert.equal(table.seats[0]?.hands[0]?.outcome, "bust");
    assert.equal(table.dealer.length, 2);
    assert.equal(table.seats[0]?.chips, START_CHIPS - 50);
  });

  it("doubles for one card", () => {
    const table = createTable(() => 0);
    sit(table, "you", "You");
    debugShoe(table, [c(5, "s"), c(10, "h"), c(6, "d"), c(9, "c"), c(10, "s")]);
    addChip(table, "you", 100);
    lockBet(table, "you");
    act(table, "you", "double");
    assert.equal(table.seats[0]?.hands[0]?.cards.length, 3);
    assert.equal(table.seats[0]?.hands[0]?.bet, 200);
    assert.equal(table.seats[0]?.chips, START_CHIPS + 200);
  });

  it("splits a pair, then wins one hand and busts the other", () => {
    const table = createTable(() => 0);
    sit(table, "you", "You");
    debugShoe(table, [
      c(8, "s"),
      c(10, "h"),
      c(8, "d"),
      c(7, "c"),
      c(10, "s"),
      c(10, "d"),
      c(5, "c"),
    ]);
    addChip(table, "you", 100);
    lockBet(table, "you");
    act(table, "you", "split");
    assert.equal(table.seats[0]?.hands.length, 2);
    assert.equal(table.phase, "acting");
    act(table, "you", "stand");
    act(table, "you", "hit");
    assert.equal(table.phase, "result");
    const hands = table.seats[0]?.hands ?? [];
    assert.equal(hands[0]?.outcome, "win");
    assert.equal(hands[1]?.outcome, "bust");
    assert.equal(table.seats[0]?.chips, START_CHIPS);
  });

  it("waits for both seats before dealing", () => {
    const table = createTable(() => 0);
    sit(table, "a", "Ada");
    sit(table, "b", "Bo");
    debugShoe(table, [c(10, "s"), c(9, "h"), c(7, "d"), c(8, "c"), c(8, "s"), c(6, "d")]);
    addChip(table, "a", 10);
    lockBet(table, "a");
    assert.equal(table.phase, "betting");
    addChip(table, "b", 50);
    lockBet(table, "b");
    assert.equal(table.phase, "acting");
    assert.equal(applyClient(table, "b", { t: "act", action: "stand" }), "ok");
    assert.equal(table.phase, "acting");
    act(table, "a", "stand");
    assert.equal(table.phase, "acting");
    act(table, "b", "stand");
    assert.equal(table.phase, "result");
    nextRound(table);
    assert.equal(table.phase, "betting");
    assert.equal(table.dealer.length, 0);
  });

  it("hides the hole card and refuses a third seat", () => {
    const table = createTable(() => 0);
    sit(table, "a", "Ada");
    sit(table, "b", "Bo");
    debugShoe(table, [c(9, "s"), c(8, "h"), c(9, "d"), c(5, "c"), c(10, "s"), c(10, "h")]);
    addChip(table, "a", 10);
    addChip(table, "b", 10);
    lockBet(table, "a");
    lockBet(table, "b");
    const snap = snapshot(table);
    assert.equal(snap.dealer.length, 1);
    assert.equal(snap.holeHidden, true);
    assert.equal(isSnapshot(snap), true);
    assert.equal("shoe" in snap, false);
    assert.equal(applyClient(table, "c", { t: "sit", name: "Cyd" }), "full");
  });

  it("lets the other seat finish when someone leaves mid-hand", () => {
    const table = createTable(() => 0);
    sit(table, "a", "Ada");
    sit(table, "b", "Bo");
    debugShoe(table, [c(10, "s"), c(9, "h"), c(6, "d"), c(8, "c"), c(9, "s"), c(8, "d")]);
    addChip(table, "a", 10);
    addChip(table, "b", 10);
    lockBet(table, "a");
    lockBet(table, "b");
    assert.equal(table.turn, 0);
    leave(table, "a");
    assert.equal(table.seats.length, 1);
    assert.equal(table.phase, "acting");
    act(table, "b", "stand");
    assert.equal(table.phase, "result");
  });
});
