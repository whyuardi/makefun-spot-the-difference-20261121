// All sound is synthesized with WebAudio: no audio files, no network, and the
// game stays silent until the player first interacts with the page.

let ctx = null;
let muted = false;

export function setMuted(value) {
  muted = value;
}

export function isMuted() {
  return muted;
}

function audio() {
  if (muted) return null;
  if (!ctx) {
    const AC = window.AudioContext ?? window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

function tone(freq, at, dur, type, gain) {
  const ac = audio();
  if (!ac) return;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, ac.currentTime + at);
  g.gain.exponentialRampToValueAtTime(gain, ac.currentTime + at + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + at + dur);
  osc.connect(g).connect(ac.destination);
  osc.start(ac.currentTime + at);
  osc.stop(ac.currentTime + at + dur + 0.05);
}

export function playFind() {
  tone(660, 0, 0.16, 'sine', 0.22);
  tone(880, 0.09, 0.22, 'sine', 0.22);
  tone(1320, 0.18, 0.28, 'triangle', 0.12);
}

export function playMiss() {
  tone(160, 0, 0.18, 'sawtooth', 0.08);
}

export function playHint() {
  tone(520, 0, 0.12, 'sine', 0.14);
  tone(780, 0.08, 0.16, 'sine', 0.14);
}

export function playWin() {
  [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.11, 0.3, 'triangle', 0.18));
}

export function playTick() {
  tone(980, 0, 0.05, 'square', 0.05);
}
