// Every tuning number for The Twin Rooms in one place. The playfield is a fixed
// 1280x720 logical canvas; the renderer scales it to the window, so no rule below
// depends on the screen size.

export const CANVAS = { width: 1280, height: 720 };

// Top HUD bar, then the two picture panels, then a thin footer line.
export const HUD = { height: 76 };
export const PANEL = {
  width: 610,
  height: 616,
  leftX: 16,
  rightX: 654,
  y: 84,
};
export const FOOTER_Y = 706;

export const LEVELS = [
  { id: 'garden', name: 'Sunny Garden', time: 120, diffs: 7 },
  { id: 'kitchen', name: 'Cozy Kitchen', time: 150, diffs: 7 },
  { id: 'harbor', name: 'Starry Harbor', time: 180, diffs: 7 },
];

export const SCORE = {
  find: 100,
  comboBonus: 25,
  miss: -10,
  hintCost: 25,
  timeBonusPerSecond: 5,
};

export const HINTS_PER_LEVEL = 3;
export const HINT_SECONDS = 3;
export const MARK_RING_MS = 900;
export const MISS_MARK_MS = 600;
export const COMBO_WINDOW_MS = 4000;

export const PALETTE = {
  page: '#10131c',
  hud: '#1a2030',
  hudLine: '#2c3550',
  text: '#f2f4f8',
  muted: '#9aa5bd',
  gold: '#f2c94c',
  goldDeep: '#c9920e',
  accent: '#4fc3f7',
  danger: '#e5534b',
  good: '#58c96b',
  panelFrame: '#39415a',
  panelLabel: '#10131c',
};

export const FONT = 'system-ui, -apple-system, "Segoe UI", sans-serif';

export const BEST_KEY = 'twin-rooms.best';
export const MUTE_KEY = 'twin-rooms.muted';
