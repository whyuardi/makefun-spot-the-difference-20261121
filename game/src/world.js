// The game's state machine, kept free of canvas and DOM so the rules can be
// tested on their own: screens, levels, found differences, timer, score, hints.

import { LEVELS, SCORE, HINTS_PER_LEVEL, HINT_SECONDS, COMBO_WINDOW_MS, PANEL } from './config.js';
import { sceneById } from './scenes.js';

export const SCREEN_TITLE = 'title';
export const SCREEN_PLAY = 'play';
export const SCREEN_LEVEL_DONE = 'level-done';
export const SCREEN_WIN = 'win';
export const SCREEN_OVER = 'over';

export function createWorld() {
  return {
    screen: SCREEN_TITLE,
    levelIndex: 0,
    found: new Set(),
    foundAt: {},
    missMarks: [],
    hint: null,
    hintEndsAt: 0,
    timeLeft: LEVELS[0].time,
    score: 0,
    best: 0,
    hintsLeft: HINTS_PER_LEVEL,
    combo: 0,
    lastFindAt: 0,
    levelBonus: 0,
    totalFound: 0,
    wrongStreak: 0,
    startedAt: 0,
    now: 0,
  };
}

export function levelOf(world) {
  return LEVELS[world.levelIndex];
}

export function sceneOf(world) {
  return sceneById(levelOf(world).id);
}

export function foundCount(world) {
  return world.found.size;
}

export function diffsTotal(world) {
  return sceneOf(world).differences.length;
}

export function startLevel(world, index) {
  world.levelIndex = index;
  world.found = new Set();
  world.foundAt = {};
  world.missMarks = [];
  world.hint = null;
  world.timeLeft = LEVELS[index].time;
  world.hintsLeft = HINTS_PER_LEVEL;
  world.combo = 0;
  world.levelBonus = 0;
  world.screen = SCREEN_PLAY;
  world.startedAt = world.now;
}

export function startGame(world) {
  world.score = 0;
  world.totalFound = 0;
  world.wrongStreak = 0;
  startLevel(world, 0);
}

export function nextLevel(world) {
  if (world.levelIndex + 1 < LEVELS.length) {
    startLevel(world, world.levelIndex + 1);
    return true;
  }
  world.screen = SCREEN_WIN;
  return false;
}

// Map a canvas click to a scene point, or null when it missed both panels.
// Returns { side: 'left' | 'right', x, y } in panel coordinates.
export function clickToScenePoint(px, py) {
  const { leftX, rightX, y, width, height } = PANEL;
  if (py < y || py > y + height) return null;
  if (px >= leftX && px <= leftX + width) return { side: 'left', x: px - leftX, y: py - y };
  if (px >= rightX && px <= rightX + width) return { side: 'right', x: px - rightX, y: py - y };
  return null;
}

// The result of a click: { kind: 'found' | 'miss' | 'already' | 'ignored', diff? }
export function clickAt(world, px, py) {
  if (world.screen !== SCREEN_PLAY) return { kind: 'ignored' };
  const point = clickToScenePoint(px, py);
  if (!point) return { kind: 'ignored' };
  const scene = sceneOf(world);
  for (const diff of scene.differences) {
    const dx = point.x - diff.x;
    const dy = point.y - diff.y;
    if (dx * dx + dy * dy <= (diff.r + 12) * (diff.r + 12)) {
      if (world.found.has(diff.id)) return { kind: 'already', diff };
      world.found.add(diff.id);
      world.foundAt[diff.id] = world.now;
      world.totalFound += 1;
      world.wrongStreak = 0;
      const fast = world.now - world.lastFindAt <= COMBO_WINDOW_MS && world.combo > 0;
      world.combo = fast ? world.combo + 1 : 1;
      world.lastFindAt = world.now;
      const gained = SCORE.find + (world.combo - 1) * SCORE.comboBonus;
      world.score += gained;
      if (world.found.size === scene.differences.length) {
        world.levelBonus = Math.round(world.timeLeft) * SCORE.timeBonusPerSecond;
        world.score += world.levelBonus;
        world.screen = SCREEN_LEVEL_DONE;
      }
      return { kind: 'found', diff, gained, combo: world.combo };
    }
  }
  world.score = Math.max(0, world.score + SCORE.miss);
  world.wrongStreak += 1;
  world.combo = 0;
  world.missMarks.push({ x: px, y: py, at: world.now });
  return { kind: 'miss' };
}

// Spend a hint: returns the difference it points at, or null when none is left.
export function useHint(world) {
  if (world.screen !== SCREEN_PLAY || world.hintsLeft <= 0) return null;
  const scene = sceneOf(world);
  const remaining = scene.differences.filter((d) => !world.found.has(d.id));
  if (remaining.length === 0) return null;
  world.hintsLeft -= 1;
  world.score = Math.max(0, world.score - SCORE.hintCost);
  const diff = remaining[Math.floor(Math.random() * remaining.length)];
  world.hint = diff;
  world.hintEndsAt = world.now + HINT_SECONDS * 1000;
  return diff;
}

// Advance the clock by dt seconds. Returns 'timeout' once, when time runs out.
export function tick(world, dt) {
  if (world.screen !== SCREEN_PLAY) return null;
  world.timeLeft -= dt;
  if (world.hint && world.now >= world.hintEndsAt) world.hint = null;
  world.missMarks = world.missMarks.filter((m) => world.now - m.at < 600);
  if (world.timeLeft <= 0) {
    world.timeLeft = 0;
    world.screen = SCREEN_OVER;
    return 'timeout';
  }
  return null;
}

export function formatTime(seconds) {
  const s = Math.max(0, Math.ceil(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}
