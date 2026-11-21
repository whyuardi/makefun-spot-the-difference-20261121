// The screenshot scenes behind ?shot=start|play|play2|end. Each one stages a real
// game state — a fresh world, a few differences already found by real clicks —
// so the frame is what a short game really looks like, and the same seed always
// gives the same frame. Screenshots are taken with ?shot=<name>&seed=1.

import { startLevel, startGame, clickAt, sceneOf, SCREEN_TITLE, SCREEN_PLAY } from './world.js';

// A click through the world's own rules, at the centre of a difference.
function findDiff(world, scene, id, atMs) {
  const diff = scene.differences.find((d) => d.id === id);
  if (!diff) return;
  world.now = atMs;
  clickAt(world, 16 + diff.x, 84 + diff.y);
}

export function stageShot(name, world) {
  if (name === 'play') {
    startGame(world);
    world.now = 1000;
    const s = sceneOfWorld(world);
    findDiff(world, s, 'sun-rays', 2000);
    findDiff(world, s, 'bird', 6000);
    findDiff(world, s, 'flower-color', 12000);
    // Markers render at full size: the render clock restarts on load, so the
    // staged find-times would otherwise read as the future.
    for (const id of world.found) world.foundAt[id] = -1e9;
    world.timeLeft = 72;
    world.score = 300;
    world.now = 48000;
    world.screen = SCREEN_PLAY;
    return;
  }
  if (name === 'play2') {
    startGame(world);
    startLevel(world, 1);
    world.now = 1000;
    const s = sceneOfWorld(world);
    findDiff(world, s, 'clock-hands', 3000);
    findDiff(world, s, 'steam', 9000);
    for (const id of world.found) world.foundAt[id] = -1e9;
    world.timeLeft = 96;
    world.score = 200;
    world.now = 54000;
    world.screen = SCREEN_PLAY;
    return;
  }
  if (name === 'end') {
    startGame(world);
    world.timeLeft = 41;
    world.now = 1000;
    const s = sceneOfWorld(world);
    s.differences.forEach((d, i) => findDiff(world, s, d.id, 2000 + i * 5000));
    for (const id of world.found) world.foundAt[id] = -1e9;
    world.now = 79000;
    // clickAt already moved the screen to level-done on the last find.
    return;
  }
  if (name === 'play3') {
    startGame(world);
    startLevel(world, 2);
    world.now = 1000;
    const s = sceneOfWorld(world);
    findDiff(world, s, 'moon-phase', 3000);
    findDiff(world, s, 'flag', 9000);
    for (const id of world.found) world.foundAt[id] = -1e9;
    world.timeLeft = 131;
    world.score = 200;
    world.now = 49000;
    world.screen = SCREEN_PLAY;
    return;
  }
  // Anything else is the title screen over the first room.
  world.screen = SCREEN_TITLE;
  world.levelIndex = 0;
  world.timeLeft = 120;
  world.now = 0;
}

function sceneOfWorld(world) {
  return sceneOf(world);
}
