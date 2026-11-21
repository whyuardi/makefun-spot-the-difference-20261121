// Mouse, touch and keyboard input: translate a pointer event into canvas
// coordinates, hand clicks to the world, and map keys to game actions.

import { CANVAS } from './config.js';
import { clickAt, useHint, startGame, startLevel, nextLevel, SCREEN_TITLE, SCREEN_PLAY, SCREEN_LEVEL_DONE, SCREEN_WIN, SCREEN_OVER } from './world.js';
import { playFind, playMiss, playHint, playWin, setMuted, isMuted } from './audio.js';

export function toCanvasPoint(canvas, clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((clientX - rect.left) / rect.width) * CANVAS.width,
    y: ((clientY - rect.top) / rect.height) * CANVAS.height,
  };
}

export function attachInput(canvas, world, onStateChange) {
  canvas.addEventListener('pointerdown', (event) => {
    const { x, y } = toCanvasPoint(canvas, event.clientX, event.clientY);
    if (world.screen === SCREEN_TITLE) {
      startGame(world);
      onStateChange('start');
      return;
    }
    if (world.screen === SCREEN_PLAY) {
      const result = clickAt(world, x, y);
      if (result.kind === 'found') {
        playFind();
        if (world.screen === SCREEN_LEVEL_DONE) playWin();
      } else if (result.kind === 'miss') {
        playMiss();
      }
      onStateChange('click');
    }
  });

  window.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    if (key === 'm') {
      setMuted(!isMuted());
      onStateChange('mute');
      return;
    }
    if (world.screen === SCREEN_TITLE) {
      if (key === 'enter' || key === ' ') startGame(world);
      else if (key === '1' || key === '2' || key === '3') {
        world.score = 0;
        startLevel(world, Number(key) - 1);
      }
      onStateChange('key');
      return;
    }
    if (world.screen === SCREEN_PLAY) {
      if (key === 'h') {
        const diff = useHint(world);
        if (diff) playHint();
      } else if (key === 'r') {
        startLevel(world, world.levelIndex);
      }
      onStateChange('key');
      return;
    }
    if (world.screen === SCREEN_LEVEL_DONE && (key === 'enter' || key === ' ')) {
      nextLevel(world);
      onStateChange('key');
      return;
    }
    if (world.screen === SCREEN_WIN && (key === 'enter' || key === ' ')) {
      startGame(world);
      onStateChange('key');
      return;
    }
    if (world.screen === SCREEN_OVER && key === 'r') {
      startLevel(world, world.levelIndex);
      onStateChange('key');
    }
  });
}
