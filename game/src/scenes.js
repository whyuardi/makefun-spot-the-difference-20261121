// The three scenes of The Twin Rooms. Each scene draws itself into a 610x616 panel
// from a set of applied difference ids: the left panel is drawn with an empty set,
// the right panel with the differences applied, so the two pictures are
// near-identical and every difference is a small, deliberate change.
//
// A difference is { id, x, y, r, label }: its centre and hit radius in panel
// coordinates, used for click testing and for the gold marker rings.

export const PANEL_W = 610;
export const PANEL_H = 616;

function circle(ctx, x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function ellipse(ctx, x, y, rx, ry) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fill();
}

function poly(ctx, points) {
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i += 1) ctx.lineTo(points[i][0], points[i][1]);
  ctx.closePath();
  ctx.fill();
}

function line(ctx, x1, y1, x2, y2, width, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function cloud(ctx, x, y, s, color) {
  ctx.fillStyle = color;
  ellipse(ctx, x, y, 34 * s, 20 * s);
  ellipse(ctx, x - 26 * s, y + 8 * s, 24 * s, 15 * s);
  ellipse(ctx, x + 28 * s, y + 8 * s, 26 * s, 16 * s);
  ellipse(ctx, x + 4 * s, y - 12 * s, 22 * s, 14 * s);
}

function flower(ctx, x, y, petal, center) {
  ctx.fillStyle = petal;
  for (let i = 0; i < 5; i += 1) {
    const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
    circle(ctx, x + Math.cos(a) * 9, y + Math.sin(a) * 9, 7);
  }
  ctx.fillStyle = center;
  circle(ctx, x, y, 6);
}

function star4(ctx, x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y - r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.quadraticCurveTo(x, y, x, y + r);
  ctx.quadraticCurveTo(x, y, x - r, y);
  ctx.quadraticCurveTo(x, y, x, y - r);
  ctx.fill();
}

// ---------------------------------------------------------------------------
// Level 1 — Sunny Garden. A bright backyard: sun, house, apple tree, cat.
// ---------------------------------------------------------------------------

const GARDEN_DIFFS = [
  { id: 'sun-rays', x: 96, y: 96, r: 44, label: 'sun rays' },
  { id: 'bird', x: 302, y: 84, r: 26, label: 'a bird' },
  { id: 'flower-color', x: 184, y: 548, r: 24, label: 'a flower' },
  { id: 'cat-tail', x: 442, y: 486, r: 30, label: 'the cat tail' },
  { id: 'window', x: 352, y: 384, r: 28, label: 'a window' },
  { id: 'apple-count', x: 524, y: 226, r: 22, label: 'an apple' },
  { id: 'butterfly', x: 252, y: 436, r: 24, label: 'a butterfly' },
];

function drawGarden(ctx, diffs) {
  // Sky.
  const sky = ctx.createLinearGradient(0, 0, 0, 400);
  sky.addColorStop(0, '#8ec9ee');
  sky.addColorStop(1, '#dff2fd');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, PANEL_W, 400);

  // Sun, top left. The rays are one difference.
  ctx.fillStyle = '#ffd94d';
  circle(ctx, 96, 96, 40);
  if (!diffs.has('sun-rays')) {
    ctx.strokeStyle = '#ffd94d';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    for (let i = 0; i < 8; i += 1) {
      const a = (i / 8) * Math.PI * 2;
      line(ctx, 96 + Math.cos(a) * 50, 96 + Math.sin(a) * 50,
        96 + Math.cos(a) * 64, 96 + Math.sin(a) * 64, 6, '#ffd94d');
    }
  }

  // Clouds.
  cloud(ctx, 220, 74, 1, 'rgba(255,255,255,0.95)');
  cloud(ctx, 440, 56, 0.8, 'rgba(255,255,255,0.9)');
  cloud(ctx, 530, 140, 0.65, 'rgba(255,255,255,0.85)');

  // The bird is one difference: present on the left, gone on the right.
  if (!diffs.has('bird')) {
    ctx.strokeStyle = '#3d4a5c';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(286, 84);
    ctx.quadraticCurveTo(294, 74, 302, 84);
    ctx.quadraticCurveTo(310, 74, 318, 84);
    ctx.stroke();
  }

  // Rolling hills.
  ctx.fillStyle = '#7ec850';
  ctx.beginPath();
  ctx.moveTo(0, 400);
  ctx.quadraticCurveTo(160, 340, 330, 396);
  ctx.quadraticCurveTo(470, 440, PANEL_W, 390);
  ctx.lineTo(PANEL_W, PANEL_H);
  ctx.lineTo(0, PANEL_H);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#69b844';
  ctx.beginPath();
  ctx.moveTo(0, 470);
  ctx.quadraticCurveTo(200, 420, 420, 470);
  ctx.quadraticCurveTo(520, 492, PANEL_W, 462);
  ctx.lineTo(PANEL_W, PANEL_H);
  ctx.lineTo(0, PANEL_H);
  ctx.closePath();
  ctx.fill();

  // Pond, bottom left.
  ctx.fillStyle = '#6fc3e8';
  ellipse(ctx, 120, 556, 92, 34);
  ctx.fillStyle = '#8fd4f0';
  ellipse(ctx, 100, 550, 40, 12);
  ellipse(ctx, 150, 564, 34, 10);
  ctx.fillStyle = '#4d9e57';
  ellipse(ctx, 84, 556, 16, 7);
  ellipse(ctx, 158, 548, 13, 6);

  // House, centre.
  ctx.fillStyle = '#f7ead0';
  ctx.fillRect(288, 330, 150, 130);
  ctx.fillStyle = '#d95f4b';
  poly(ctx, [[272, 332], [363, 262], [454, 332]]);
  ctx.fillStyle = '#b84a38';
  ctx.fillRect(272, 330, 182, 10);
  // Door.
  ctx.fillStyle = '#8a5a33';
  roundRect(ctx, 348, 392, 34, 68, 6);
  ctx.fillStyle = '#ffd94d';
  circle(ctx, 376, 428, 4);
  // Windows: the left one changes between open and curtained.
  ctx.fillStyle = '#7fb8d8';
  ctx.fillRect(302, 352, 34, 34);
  ctx.fillStyle = '#7fb8d8';
  ctx.fillRect(398, 352, 34, 34);
  ctx.strokeStyle = '#f7ead0';
  ctx.lineWidth = 4;
  line(ctx, 319, 352, 319, 386, 4, '#f7ead0');
  line(ctx, 302, 369, 336, 369, 4, '#f7ead0');
  line(ctx, 415, 352, 415, 386, 4, '#f7ead0');
  line(ctx, 398, 369, 432, 369, 4, '#f7ead0');
  if (diffs.has('window')) {
    ctx.fillStyle = '#f2c94c';
    ctx.fillRect(302, 352, 34, 34);
    ctx.fillStyle = '#c9920e';
    ctx.fillRect(302, 352, 34, 10);
    ctx.fillRect(302, 376, 34, 10);
  }

  // Apple tree, right.
  ctx.fillStyle = '#7a4a2b';
  ctx.fillRect(512, 330, 26, 120);
  ctx.fillStyle = '#4d9e57';
  circle(ctx, 470, 300, 52);
  circle(ctx, 556, 296, 54);
  circle(ctx, 514, 246, 56);
  ctx.fillStyle = '#5cb85f';
  circle(ctx, 488, 262, 34);
  circle(ctx, 540, 268, 30);
  // Apples: three on the left, two on the right.
  ctx.fillStyle = '#e5534b';
  circle(ctx, 478, 296, 9);
  circle(ctx, 552, 308, 9);
  if (!diffs.has('apple-count')) circle(ctx, 524, 226, 9);
  ctx.fillStyle = '#7a4a2b';
  line(ctx, 478, 288, 478, 282, 3, '#7a4a2b');

  // Flower bed along the bottom.
  ctx.strokeStyle = '#4d9e57';
  ctx.lineWidth = 4;
  const flowers = [84, 184, 284, 384, 484];
  const colors = ['#ff7fa5', '#ff7fa5', '#c77dff', '#ff7fa5', '#ff9f43'];
  flowers.forEach((fx, i) => {
    line(ctx, fx, 548, fx, 578, 4, '#4d9e57');
    ctx.fillStyle = '#4d9e57';
    ellipse(ctx, fx - 8, 566, 10, 5);
    const petal = i === 1 && diffs.has('flower-color') ? '#7fb8d8' : colors[i];
    flower(ctx, fx, 548, petal, '#ffd94d');
  });

  // The butterfly flutters by the flowers on the left only.
  if (!diffs.has('butterfly')) {
    ctx.fillStyle = '#b388ff';
    ellipse(ctx, 242, 428, 12, 8);
    ellipse(ctx, 262, 428, 12, 8);
    ctx.fillStyle = '#7c4dff';
    ellipse(ctx, 244, 442, 10, 7);
    ellipse(ctx, 260, 442, 10, 7);
    ctx.fillStyle = '#3d2b4f';
    circle(ctx, 252, 436, 4);
  }

  // The cat sits by the house, watching. Its tail points up on the left.
  ctx.fillStyle = '#f2a541';
  ellipse(ctx, 442, 512, 34, 26);
  circle(ctx, 442, 472, 22);
  poly(ctx, [[426, 458], [432, 438], [442, 454]]);
  poly(ctx, [[446, 454], [456, 438], [460, 458]]);
  ctx.fillStyle = '#3d2b4f';
  circle(ctx, 434, 468, 3);
  circle(ctx, 450, 468, 3);
  ctx.strokeStyle = '#3d2b4f';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(436, 480);
  ctx.quadraticCurveTo(442, 484, 448, 480);
  ctx.stroke();
  ctx.strokeStyle = '#f2a541';
  ctx.lineWidth = 9;
  ctx.lineCap = 'round';
  ctx.beginPath();
  if (diffs.has('cat-tail')) {
    ctx.moveTo(472, 522);
    ctx.quadraticCurveTo(498, 528, 500, 506);
  } else {
    ctx.moveTo(472, 522);
    ctx.quadraticCurveTo(500, 514, 504, 488);
  }
  ctx.stroke();
}

export const GARDEN = { id: 'garden', name: 'Sunny Garden', differences: GARDEN_DIFFS, draw: drawGarden };

// ---------------------------------------------------------------------------
// Level 2 — Cozy Kitchen. Warm walls, a window, a table set for tea.
// ---------------------------------------------------------------------------

const KITCHEN_DIFFS = [
  { id: 'clock-hands', x: 480, y: 122, r: 42, label: 'the clock' },
  { id: 'steam', x: 300, y: 300, r: 26, label: 'the steam' },
  { id: 'cup-color', x: 392, y: 424, r: 24, label: 'a teacup' },
  { id: 'fruit-count', x: 208, y: 436, r: 26, label: 'a banana' },
  { id: 'jar-label', x: 486, y: 262, r: 22, label: 'a jar label' },
  { id: 'plant-leaf', x: 96, y: 186, r: 24, label: 'a plant leaf' },
  { id: 'cat-ear', x: 522, y: 452, r: 26, label: 'the cat ear' },
];

function drawKitchen(ctx, diffs) {
  // Warm wall and wooden floor.
  ctx.fillStyle = '#f7e8c8';
  ctx.fillRect(0, 0, PANEL_W, 420);
  ctx.fillStyle = '#e8d3a8';
  ctx.fillRect(0, 420, PANEL_W, 196);
  ctx.fillStyle = '#d9c08a';
  for (let y = 448; y < PANEL_H; y += 28) ctx.fillRect(0, y, PANEL_W, 3);

  // Window with sky and a curtain, left.
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(52, 52, 190, 170);
  const sky = ctx.createLinearGradient(0, 60, 0, 214);
  sky.addColorStop(0, '#8ec9ee');
  sky.addColorStop(1, '#dff2fd');
  ctx.fillStyle = sky;
  ctx.fillRect(60, 60, 174, 154);
  ctx.fillStyle = '#ffd94d';
  circle(ctx, 200, 96, 22);
  cloud(ctx, 120, 100, 0.7, 'rgba(255,255,255,0.95)');
  ctx.fillStyle = '#7ec850';
  ctx.fillRect(60, 178, 174, 36);
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 6;
  line(ctx, 147, 60, 147, 214, 6, '#ffffff');
  line(ctx, 60, 137, 234, 137, 6, '#ffffff');
  // Curtain.
  ctx.fillStyle = '#ff7fa5';
  poly(ctx, [[52, 52], [84, 52], [76, 222], [52, 222]]);
  ctx.fillStyle = '#ff9fbf';
  poly(ctx, [[234, 52], [202, 52], [210, 222], [234, 222]]);

  // Hanging plant, top left corner. One leaf is a difference.
  ctx.strokeStyle = '#8a5a33';
  ctx.lineWidth = 3;
  line(ctx, 96, 0, 96, 40, 3, '#8a5a33');
  ctx.fillStyle = '#c96f4a';
  poly(ctx, [[76, 40], [116, 40], [108, 74], [84, 74]]);
  ctx.fillStyle = '#4d9e57';
  ellipse(ctx, 76, 66, 16, 8);
  ellipse(ctx, 116, 66, 16, 8);
  ellipse(ctx, 96, 56, 12, 18);
  if (!diffs.has('plant-leaf')) ellipse(ctx, 96, 84, 14, 8);

  // Wall clock, right. Its hands are a difference.
  ctx.fillStyle = '#ffffff';
  circle(ctx, 480, 122, 44);
  ctx.strokeStyle = '#3d2b4f';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(480, 122, 44, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = '#3d2b4f';
  for (let i = 0; i < 12; i += 1) {
    const a = (i / 12) * Math.PI * 2;
    circle(ctx, 480 + Math.cos(a) * 36, 122 + Math.sin(a) * 36, 2);
  }
  ctx.strokeStyle = '#3d2b4f';
  ctx.lineCap = 'round';
  if (diffs.has('clock-hands')) {
    line(ctx, 480, 122, 480, 92, 4, '#3d2b4f');
    line(ctx, 480, 122, 502, 132, 4, '#3d2b4f');
  } else {
    line(ctx, 480, 122, 480, 92, 4, '#3d2b4f');
    line(ctx, 480, 122, 506, 122, 4, '#3d2b4f');
  }
  ctx.fillStyle = '#e5534b';
  circle(ctx, 480, 122, 4);

  // Shelf with three jars.
  ctx.fillStyle = '#8a5a33';
  ctx.fillRect(330, 252, 250, 12);
  const jars = [372, 446, 520];
  const labels = ['#e5534b', '#e5534b', '#4fc3f7'];
  jars.forEach((jx, i) => {
    ctx.fillStyle = '#bfe6f5';
    roundRect(ctx, jx - 24, 196, 48, 56, 8);
    ctx.fillStyle = '#8a5a33';
    ctx.fillRect(jx - 24, 190, 48, 10);
    const label = i === 1 && diffs.has('jar-label') ? '#f2c94c' : labels[i];
    ctx.fillStyle = label;
    ctx.fillRect(jx - 16, 218, 32, 18);
  });

  // Framed picture on the wall.
  ctx.fillStyle = '#8a5a33';
  ctx.fillRect(268, 96, 66, 54);
  ctx.fillStyle = '#bfe6f5';
  ctx.fillRect(274, 102, 54, 42);
  ctx.fillStyle = '#e5534b';
  circle(ctx, 301, 120, 10);
  ctx.fillStyle = '#7ec850';
  ctx.fillRect(274, 132, 54, 12);

  // Rug under the table.
  ctx.fillStyle = '#c96f4a';
  ellipse(ctx, 305, 566, 230, 34);
  ctx.fillStyle = '#e8a87c';
  ellipse(ctx, 305, 566, 190, 24);
  ctx.fillStyle = '#c96f4a';
  ellipse(ctx, 305, 566, 140, 16);

  // Table.
  ctx.fillStyle = '#a4713d';
  ctx.fillRect(40, 380, 530, 22);
  ctx.fillStyle = '#8a5a33';
  ctx.fillRect(66, 402, 18, 120);
  ctx.fillRect(526, 402, 18, 120);

  // Teapot, centre of the table. Its steam is a difference.
  if (!diffs.has('steam')) {
    ctx.strokeStyle = 'rgba(180,190,205,0.9)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(292, 330);
    ctx.quadraticCurveTo(282, 306, 292, 288);
    ctx.quadraticCurveTo(300, 272, 292, 258);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(310, 330);
    ctx.quadraticCurveTo(320, 306, 310, 288);
    ctx.quadraticCurveTo(302, 272, 310, 258);
    ctx.stroke();
  }
  ctx.fillStyle = '#4fc3f7';
  ellipse(ctx, 300, 356, 52, 36);
  poly(ctx, [[348, 340], [378, 322], [372, 344], [348, 356]]);
  ctx.strokeStyle = '#4fc3f7';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(246, 356, 18, Math.PI * 0.5, Math.PI * 1.5);
  ctx.stroke();
  ctx.fillStyle = '#3d9bd6';
  circle(ctx, 300, 322, 10);
  ctx.fillStyle = '#ffd94d';
  circle(ctx, 300, 322, 5);

  // Two teacups. The right one changes colour.
  ctx.fillStyle = '#ff7fa5';
  roundRect(ctx, 176, 410, 44, 26, 6);
  ctx.fillStyle = diffs.has('cup-color') ? '#58c96b' : '#4fc3f7';
  roundRect(ctx, 370, 410, 44, 26, 6);
  ctx.fillStyle = '#8a5a33';
  ctx.fillRect(176, 436, 44, 6);
  ctx.fillRect(370, 436, 44, 6);

  // Fruit bowl, left of the teapot. The banana is a difference.
  ctx.fillStyle = '#c96f4a';
  ellipse(ctx, 208, 452, 52, 16);
  ctx.fillStyle = '#e5534b';
  circle(ctx, 188, 440, 12);
  circle(ctx, 216, 436, 12);
  ctx.fillStyle = '#58c96b';
  circle(ctx, 202, 446, 10);
  if (!diffs.has('fruit-count')) {
    ctx.strokeStyle = '#ffd94d';
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(226, 452);
    ctx.quadraticCurveTo(246, 436, 258, 420);
    ctx.stroke();
  }

  // The cat naps on the chair, right. One ear folds on the right panel.
  ctx.fillStyle = '#8a5a33';
  ctx.fillRect(486, 470, 90, 12);
  ctx.fillRect(496, 482, 10, 60);
  ctx.fillRect(556, 482, 10, 60);
  ctx.fillStyle = '#5c5c6e';
  ellipse(ctx, 522, 462, 36, 22);
  circle(ctx, 522, 436, 20);
  poly(ctx, [[506, 424], [512, 404], [522, 420]]);
  if (diffs.has('cat-ear')) {
    poly(ctx, [[528, 420], [544, 424], [534, 436]]);
  } else {
    poly(ctx, [[530, 420], [538, 402], [546, 420]]);
  }
  ctx.fillStyle = '#f2c94c';
  circle(ctx, 514, 434, 3);
  circle(ctx, 530, 434, 3);
  ctx.strokeStyle = '#5c5c6e';
  ctx.lineWidth = 8;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(554, 468);
  ctx.quadraticCurveTo(574, 462, 572, 444);
  ctx.stroke();
}

export const KITCHEN = { id: 'kitchen', name: 'Cozy Kitchen', differences: KITCHEN_DIFFS, draw: drawKitchen };

// ---------------------------------------------------------------------------
// Level 3 — Starry Harbor. A night port: moon, boats, lighthouse, lanterns.
// ---------------------------------------------------------------------------

const HARBOR_DIFFS = [
  { id: 'moon-phase', x: 112, y: 102, r: 38, label: 'the moon' },
  { id: 'star-count', x: 302, y: 72, r: 20, label: 'a bright star' },
  { id: 'flag', x: 424, y: 332, r: 24, label: 'a boat flag' },
  { id: 'lantern', x: 542, y: 432, r: 22, label: 'a lantern' },
  { id: 'fish', x: 202, y: 482, r: 24, label: 'a jumping fish' },
  { id: 'lighthouse-beam', x: 522, y: 202, r: 32, label: 'the lighthouse beam' },
  { id: 'cloud', x: 382, y: 92, r: 30, label: 'a night cloud' },
];

const HARBOR_STARS = [
  [60, 60, 2], [150, 44, 2], [210, 96, 2], [260, 40, 2], [350, 120, 2],
  [420, 52, 2], [470, 96, 2], [540, 60, 2], [90, 160, 2], [180, 150, 2],
  [250, 180, 2], [330, 160, 2], [400, 190, 2], [470, 150, 2], [560, 130, 2],
  [120, 210, 2], [300, 210, 2], [520, 210, 2], [40, 250, 2], [580, 260, 2],
];

function drawHarbor(ctx, diffs) {
  // Night sky.
  const sky = ctx.createLinearGradient(0, 0, 0, 400);
  sky.addColorStop(0, '#0b1030');
  sky.addColorStop(1, '#24356e');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, PANEL_W, 400);

  // Stars, one bright one is a difference.
  ctx.fillStyle = '#ffffff';
  HARBOR_STARS.forEach(([sx, sy, sr]) => circle(ctx, sx, sy, sr));
  if (!diffs.has('star-count')) star4(ctx, 302, 72, 12, '#fff7ae');

  // The moon: full on the left, crescent on the right.
  ctx.fillStyle = '#f7f3d8';
  circle(ctx, 112, 102, 34);
  if (diffs.has('moon-phase')) {
    ctx.fillStyle = '#24356e';
    circle(ctx, 126, 94, 30);
  }
  ctx.fillStyle = 'rgba(247,243,216,0.25)';
  circle(ctx, 112, 102, 46);

  // A night cloud drifts across on the left only.
  if (!diffs.has('cloud')) cloud(ctx, 382, 92, 0.9, 'rgba(20,28,58,0.95)');

  // Sea.
  const sea = ctx.createLinearGradient(0, 400, 0, PANEL_H);
  sea.addColorStop(0, '#1d3a6e');
  sea.addColorStop(1, '#0e2142');
  ctx.fillStyle = sea;
  ctx.fillRect(0, 400, PANEL_W, 216);
  ctx.strokeStyle = 'rgba(140,190,235,0.5)';
  ctx.lineWidth = 3;
  for (let i = 0; i < 5; i += 1) {
    const wy = 430 + i * 36;
    ctx.beginPath();
    ctx.moveTo(20, wy);
    ctx.quadraticCurveTo(160, wy - 10, 300, wy);
    ctx.quadraticCurveTo(450, wy + 10, 590, wy);
    ctx.stroke();
  }
  // Moonlight on the water.
  ctx.fillStyle = 'rgba(247,243,216,0.35)';
  for (let i = 0; i < 6; i += 1) {
    ctx.fillRect(92 + (i % 2) * 12, 420 + i * 30, 44 - i * 4, 5);
  }

  // The jumping fish is a difference: it arcs out of the water on the left.
  if (!diffs.has('fish')) {
    ctx.fillStyle = '#8fd4f0';
    ctx.beginPath();
    ctx.moveTo(182, 486);
    ctx.quadraticCurveTo(202, 452, 226, 484);
    ctx.quadraticCurveTo(206, 492, 182, 486);
    ctx.fill();
    poly(ctx, [[224, 482], [238, 472], [234, 490]]);
    ctx.fillStyle = '#bfe6f5';
    ellipse(ctx, 196, 500, 22, 5);
    ellipse(ctx, 214, 508, 14, 4);
  }

  // Boat one, with a flag that changes colour.
  ctx.fillStyle = '#7a4a2b';
  poly(ctx, [[120, 470], [260, 470], [236, 500], [146, 500]]);
  ctx.fillStyle = '#a4713d';
  ctx.fillRect(188, 380, 8, 92);
  ctx.fillStyle = '#f7ead0';
  poly(ctx, [[196, 384], [196, 452], [262, 452]]);
  ctx.fillStyle = diffs.has('flag') ? '#f2c94c' : '#e5534b';
  poly(ctx, [[196, 384], [232, 394], [196, 406]]);

  // Boat two, smaller, further away.
  ctx.fillStyle = '#5c3a22';
  poly(ctx, [[330, 500], [430, 500], [412, 524], [350, 524]]);
  ctx.fillStyle = '#8a5a33';
  ctx.fillRect(376, 440, 7, 62);
  ctx.fillStyle = '#d9c08a';
  poly(ctx, [[383, 444], [383, 496], [428, 496]]);

  // Lighthouse on the rocks, right.
  ctx.fillStyle = '#5c5c6e';
  poly(ctx, [[470, 420], [570, 420], [556, 380], [484, 380]]);
  ctx.fillStyle = '#f7ead0';
  poly(ctx, [[496, 380], [544, 380], [540, 300], [500, 300]]);
  ctx.fillStyle = '#e5534b';
  poly(ctx, [[500, 340], [540, 340], [538, 300], [502, 300]]);
  ctx.fillStyle = '#3d2b4f';
  ctx.fillRect(492, 262, 56, 40);
  ctx.fillStyle = '#ffd94d';
  ctx.fillRect(500, 270, 40, 24);
  ctx.fillStyle = '#3d2b4f';
  poly(ctx, [[488, 264], [520, 240], [552, 264]]);
  // The beam sweeps left when it is on: a bright outer cone with a hotter core.
  if (!diffs.has('lighthouse-beam')) {
    ctx.fillStyle = 'rgba(255, 226, 110, 0.42)';
    poly(ctx, [[500, 282], [240, 214], [240, 336]]);
    ctx.fillStyle = 'rgba(255, 236, 150, 0.5)';
    poly(ctx, [[500, 282], [250, 246], [250, 312]]);
  }

  // The pier with lanterns, bottom right. One lantern is lit on the left.
  ctx.fillStyle = '#7a4a2b';
  ctx.fillRect(420, 520, 190, 16);
  ctx.fillStyle = '#8a5a33';
  ctx.fillRect(436, 536, 12, 60);
  ctx.fillRect(580, 536, 12, 60);
  ctx.strokeStyle = '#5c3a22';
  ctx.lineWidth = 3;
  for (let x = 440; x <= 590; x += 30) line(ctx, x, 520, x, 536, 3, '#5c3a22');
  const lanterns = [452, 502, 552];
  lanterns.forEach((lx) => {
    const lit = lx !== 552 || !diffs.has('lantern');
    ctx.fillStyle = lit ? '#ffd94d' : '#5c5c6e';
    roundRect(ctx, lx - 10, 488, 20, 26, 6);
    ctx.fillStyle = '#3d2b4f';
    ctx.fillRect(lx - 12, 484, 24, 6);
    if (lit) {
      ctx.fillStyle = 'rgba(255,217,77,0.25)';
      circle(ctx, lx, 501, 26);
    }
  });
}

export const HARBOR = { id: 'harbor', name: 'Starry Harbor', differences: HARBOR_DIFFS, draw: drawHarbor };

export const SCENES = [GARDEN, KITCHEN, HARBOR];

export function sceneById(id) {
  return SCENES.find((s) => s.id === id) ?? SCENES[0];
}

