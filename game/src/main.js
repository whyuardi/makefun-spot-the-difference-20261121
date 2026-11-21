// Boot: size the canvas, run the loop, wire input, and stage a screenshot scene
// when the page is opened with ?shot=<name>.

import { CANVAS, BEST_KEY, MUTE_KEY } from './config.js';
import { createWorld, tick, SCREEN_PLAY, SCREEN_LEVEL_DONE, SCREEN_WIN } from './world.js';
import { drawFrame } from './render.js';
import { attachInput } from './input.js';
import { stageShot } from './shots.js';
import { setMuted, isMuted, playTick } from './audio.js';

const canvas = document.getElementById('game');
const statusEl = document.getElementById('status');
const ctx = canvas.getContext('2d');

const world = createWorld();
world.best = Number(localStorage.getItem(BEST_KEY) ?? 0) || 0;
setMuted(localStorage.getItem(MUTE_KEY) === '1');

const params = new URLSearchParams(location.search);
const shot = params.get('shot');
if (shot) stageShot(shot, world);

function fitCanvas() {
  const scale = Math.min(window.innerWidth / CANVAS.width, window.innerHeight / CANVAS.height);
  canvas.style.width = `${Math.floor(CANVAS.width * scale)}px`;
  canvas.style.height = `${Math.floor(CANVAS.height * scale)}px`;
}

function announce() {
  const level = world.levelIndex + 1;
  statusEl.textContent =
    world.screen === SCREEN_PLAY
      ? `Level ${level}: found ${world.found.size} of 7 differences, ${Math.ceil(world.timeLeft)} seconds left, score ${world.score}.`
      : world.screen === SCREEN_LEVEL_DONE
        ? `Level ${level} complete. Score ${world.score}.`
        : world.screen === SCREEN_WIN
          ? `You found every difference. Final score ${world.score}.`
          : 'The Twin Rooms, a spot the difference game. Press Enter to play.';
}

attachInput(canvas, world, () => {
  if (world.score > world.best) {
    world.best = world.score;
    localStorage.setItem(BEST_KEY, String(world.best));
  }
  localStorage.setItem(MUTE_KEY, isMuted() ? '1' : '0');
  announce();
});

let last = performance.now();
let lastTickSecond = -1;

function frame(now) {
  const dt = Math.min(0.1, (now - last) / 1000);
  last = now;
  world.now = now;
  if (world.screen === SCREEN_PLAY) {
    const result = tick(world, dt);
    if (result === 'timeout') announce();
    const second = Math.ceil(world.timeLeft);
    if (second <= 10 && second !== lastTickSecond && second > 0) {
      lastTickSecond = second;
      playTick();
    }
  }
  drawFrame(ctx, world, now);
  requestAnimationFrame(frame);
}

fitCanvas();
window.addEventListener('resize', fitCanvas);
announce();
requestAnimationFrame(frame);
