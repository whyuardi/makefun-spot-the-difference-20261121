// Everything the player sees: the HUD, the two picture panels, the gold markers
// on found differences, hint rings, miss marks, and the title / end screens.

import { CANVAS, HUD, PANEL, FOOTER_Y, PALETTE, FONT, LEVELS } from './config.js';
import { sceneOf, foundCount, diffsTotal, formatTime, SCREEN_TITLE, SCREEN_PLAY, SCREEN_LEVEL_DONE, SCREEN_WIN, SCREEN_OVER } from './world.js';

function text(ctx, str, x, y, size, color, weight = 600, align = 'left') {
  ctx.fillStyle = color;
  ctx.font = `${weight} ${size}px ${FONT}`;
  ctx.textAlign = align;
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(str, x, y);
}

function panelOrigin(side) {
  return { x: side === 'left' ? PANEL.leftX : PANEL.rightX, y: PANEL.y };
}

function drawMarker(ctx, ox, oy, diff, ageMs) {
  // Age can be negative when a staged scene's found-times predate the render
  // clock; clamp so the radius can never go negative (a negative arc radius
  // throws and would kill the whole frame).
  const age = Math.max(0, ageMs);
  const pop = age < 300 ? 0.6 + (age / 300) * 0.4 : 1;
  const r = diff.r * pop;
  ctx.save();
  ctx.translate(ox + diff.x, oy + diff.y);
  ctx.strokeStyle = PALETTE.gold;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, r - 5, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = PALETTE.gold;
  ctx.beginPath();
  ctx.arc(0, -r - 4, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawHintRing(ctx, ox, oy, diff, now) {
  const pulse = 1 + 0.12 * Math.sin(now / 180);
  ctx.save();
  ctx.translate(ox + diff.x, oy + diff.y);
  ctx.strokeStyle = '#37e0ff';
  ctx.lineWidth = 4;
  ctx.setLineDash([10, 8]);
  ctx.beginPath();
  ctx.arc(0, 0, (diff.r + 8) * pulse, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function drawMiss(ctx, mark, now) {
  const age = now - mark.at;
  const alpha = Math.max(0, 1 - age / 600);
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = PALETTE.danger;
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(mark.x - 12, mark.y - 12);
  ctx.lineTo(mark.x + 12, mark.y + 12);
  ctx.moveTo(mark.x + 12, mark.y - 12);
  ctx.lineTo(mark.x - 12, mark.y + 12);
  ctx.stroke();
  ctx.restore();
}

function drawPanel(ctx, world, side, now) {
  const { x, y } = panelOrigin(side);
  const scene = sceneOf(world);
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, PANEL.width, PANEL.height);
  ctx.clip();
  ctx.translate(x, y);
  scene.draw(ctx, side === 'right' ? new Set(scene.differences.map((d) => d.id)) : new Set());
  ctx.restore();

  // Frame and letter badge.
  ctx.strokeStyle = PALETTE.panelFrame;
  ctx.lineWidth = 3;
  ctx.strokeRect(x + 1.5, y + 1.5, PANEL.width - 3, PANEL.height - 3);
  ctx.fillStyle = side === 'left' ? PALETTE.accent : PALETTE.gold;
  ctx.beginPath();
  ctx.arc(x + 24, y + 24, 17, 0, Math.PI * 2);
  ctx.fill();
  text(ctx, side === 'left' ? 'A' : 'B', x + 24, y + 31, 20, PALETTE.panelLabel, 800, 'center');

  // Markers on every difference already found, on both panels.
  for (const diff of scene.differences) {
    if (!world.found.has(diff.id)) continue;
    const age = now - (world.foundAt[diff.id] ?? now);
    drawMarker(ctx, x, y, diff, age);
  }
  if (world.hint) drawHintRing(ctx, x, y, world.hint, now);
}

function drawHud(ctx, world) {
  ctx.fillStyle = PALETTE.hud;
  ctx.fillRect(0, 0, CANVAS.width, HUD.height);
  ctx.fillStyle = PALETTE.hudLine;
  ctx.fillRect(0, HUD.height - 2, CANVAS.width, 2);

  const level = LEVELS[world.levelIndex];
  text(ctx, 'THE TWIN ROOMS', 16, 30, 22, PALETTE.text, 800);
  text(ctx, `Level ${world.levelIndex + 1} · ${level.name}`, 16, 56, 14, PALETTE.muted, 500);

  // Timer bar, centre.
  const frac = Math.max(0, world.timeLeft / level.time);
  const bx = 430;
  const bw = 320;
  text(ctx, 'TIME', bx, 30, 13, PALETTE.muted, 700);
  ctx.fillStyle = '#2c3550';
  ctx.beginPath();
  ctx.roundRect(bx, 36, bw, 16, 8);
  ctx.fill();
  ctx.fillStyle = frac < 0.25 ? PALETTE.danger : frac < 0.5 ? PALETTE.gold : PALETTE.good;
  ctx.beginPath();
  ctx.roundRect(bx, 36, Math.max(16, bw * frac), 16, 8);
  ctx.fill();
  text(ctx, formatTime(world.timeLeft), bx + bw + 12, 51, 20, PALETTE.text, 700);

  // Found counter, score, hints — right side.
  text(ctx, `FOUND ${foundCount(world)} / ${diffsTotal(world)}`, 830, 40, 24, PALETTE.gold, 800);
  text(ctx, `SCORE ${world.score}`, 1080, 40, 20, PALETTE.text, 700);
  const hints = '◆'.repeat(world.hintsLeft) + '◇'.repeat(3 - world.hintsLeft);
  text(ctx, `HINT ${hints}`, 1080, 62, 14, PALETTE.muted, 600);

  text(ctx, 'Click a difference in either picture  •  H hint  •  M sound  •  R restart level', CANVAS.width / 2, FOOTER_Y + 10, 13, PALETTE.muted, 500, 'center');
}

function overlay(ctx) {
  ctx.fillStyle = 'rgba(10,13,22,0.78)';
  ctx.fillRect(0, 0, CANVAS.width, CANVAS.height);
}

function card(ctx, w, h) {
  const x = (CANVAS.width - w) / 2;
  const y = (CANVAS.height - h) / 2;
  ctx.fillStyle = '#1d2436';
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 18);
  ctx.fill();
  ctx.strokeStyle = PALETTE.panelFrame;
  ctx.lineWidth = 2;
  ctx.stroke();
  return { x, y };
}

function drawTitle(ctx, world) {
  overlay(ctx);
  text(ctx, 'THE TWIN ROOMS', CANVAS.width / 2, 190, 64, PALETTE.gold, 800, 'center');
  text(ctx, 'Spot the Difference', CANVAS.width / 2, 240, 30, PALETTE.text, 600, 'center');
  text(ctx, 'Two pictures. Seven differences. Three curious rooms.', CANVAS.width / 2, 292, 19, PALETTE.muted, 500, 'center');
  text(ctx, 'Click a difference in either picture to circle it.', CANVAS.width / 2, 330, 19, PALETTE.text, 600, 'center');
  text(ctx, 'Find all 7 before the timer runs out — hints cost points, misses too.', CANVAS.width / 2, 360, 17, PALETTE.muted, 500, 'center');
  text(ctx, 'Keys:  1 / 2 / 3  choose a room     H  hint     M  sound     R  restart', CANVAS.width / 2, 396, 16, PALETTE.muted, 500, 'center');
  const blink = Math.floor(performance.now() / 600) % 2 === 0;
  if (blink) text(ctx, 'Click or press Enter to play', CANVAS.width / 2, 470, 26, PALETTE.accent, 700, 'center');
  if (world.best > 0) text(ctx, `Best score: ${world.best}`, CANVAS.width / 2, 520, 17, PALETTE.gold, 700, 'center');
}

function drawLevelDone(ctx, world) {
  const level = LEVELS[world.levelIndex];
  overlay(ctx);
  const { x, y } = card(ctx, 520, 320);
  text(ctx, 'Level Complete!', CANVAS.width / 2, y + 70, 40, PALETTE.gold, 800, 'center');
  text(ctx, `${level.name} — all ${diffsTotal(world)} differences found`, CANVAS.width / 2, y + 112, 18, PALETTE.text, 600, 'center');
  text(ctx, `Time bonus  +${world.levelBonus}`, CANVAS.width / 2, y + 160, 20, PALETTE.good, 700, 'center');
  text(ctx, `Score  ${world.score}`, CANVAS.width / 2, y + 196, 24, PALETTE.text, 800, 'center');
  const last = world.levelIndex + 1 >= LEVELS.length;
  text(ctx, last ? 'Press Enter for the final score' : 'Press Enter for the next room', CANVAS.width / 2, y + 262, 18, PALETTE.accent, 700, 'center');
}

function drawWin(ctx, world) {
  overlay(ctx);
  const { x, y } = card(ctx, 560, 340);
  text(ctx, 'You found them all!', CANVAS.width / 2, y + 72, 40, PALETTE.gold, 800, 'center');
  text(ctx, 'Three rooms, twenty-one differences, zero left hiding.', CANVAS.width / 2, y + 114, 18, PALETTE.text, 600, 'center');
  text(ctx, `Final score  ${world.score}`, CANVAS.width / 2, y + 168, 28, PALETTE.text, 800, 'center');
  if (world.best > 0) text(ctx, `Best score  ${world.best}`, CANVAS.width / 2, y + 204, 18, PALETTE.gold, 700, 'center');
  text(ctx, 'Press Enter to play again', CANVAS.width / 2, y + 272, 18, PALETTE.accent, 700, 'center');
}

function drawOver(ctx, world) {
  overlay(ctx);
  const { x, y } = card(ctx, 520, 320);
  text(ctx, "Time's up!", CANVAS.width / 2, y + 70, 40, PALETTE.danger, 800, 'center');
  text(ctx, `${LEVELS[world.levelIndex].name} — you found ${foundCount(world)} of ${diffsTotal(world)}`, CANVAS.width / 2, y + 112, 18, PALETTE.text, 600, 'center');
  text(ctx, `Score  ${world.score}`, CANVAS.width / 2, y + 160, 22, PALETTE.text, 800, 'center');
  text(ctx, 'Press R to retry this room', CANVAS.width / 2, y + 232, 18, PALETTE.accent, 700, 'center');
}

export function drawFrame(ctx, world, now) {
  ctx.fillStyle = PALETTE.page;
  ctx.fillRect(0, 0, CANVAS.width, CANVAS.height);
  drawHud(ctx, world);
  drawPanel(ctx, world, 'left', now);
  drawPanel(ctx, world, 'right', now);
  for (const mark of world.missMarks) drawMiss(ctx, mark, now);
  if (world.screen === SCREEN_TITLE) drawTitle(ctx, world);
  else if (world.screen === SCREEN_LEVEL_DONE) drawLevelDone(ctx, world);
  else if (world.screen === SCREEN_WIN) drawWin(ctx, world);
  else if (world.screen === SCREEN_OVER) drawOver(ctx, world);
}
