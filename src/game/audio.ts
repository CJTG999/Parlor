/** Tiny synthesized cues. The AudioContext stays locked until the first gesture. */

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let heart: GainNode | null = null;
let heartTimer = 0;

export function unlockAudio() {
  const AC =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return;
  if (!ctx) {
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.22;
    master.connect(ctx.destination);
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = 62;
    heart = ctx.createGain();
    heart.gain.value = 0.0001;
    osc.connect(heart);
    heart.connect(master);
    osc.start();
  }
  void ctx.resume();
}

function tone(freq: number, dur: number, type: OscillatorType, vol: number, when = 0) {
  if (!ctx || !master) return;
  const t = ctx.currentTime + when;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  g.gain.setValueAtTime(Math.max(vol, 0.0001), t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g);
  g.connect(master);
  o.start(t);
  o.stop(t + dur + 0.02);
}

export function playTick() {
  tone(740, 0.045, "square", 0.035);
}

export function playFound() {
  tone(150, 0.35, "sawtooth", 0.09);
  tone(80, 0.5, "sine", 0.08);
}

export function playEscape() {
  tone(523, 0.16, "sine", 0.07);
  tone(784, 0.22, "sine", 0.06, 0.14);
}

export function playStep() {
  tone(70 + Math.random() * 50, 0.045, "triangle", 0.03);
}

export function playReady() {
  tone(440, 0.08, "sine", 0.04);
}

/** urgency 0..1. Pulses faster as the seeker gets close. */
export function heartbeat(urgency: number, dt: number) {
  if (!heart || !ctx) return;
  if (urgency < 0.04) {
    heartTimer = 0;
    return;
  }
  heartTimer -= dt;
  if (heartTimer > 0) return;
  heartTimer = 0.9 - urgency * 0.62;
  const t = ctx.currentTime;
  heart.gain.cancelScheduledValues(t);
  heart.gain.setValueAtTime(0.0001, t);
  heart.gain.linearRampToValueAtTime(0.09 * urgency, t + 0.025);
  heart.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
}
