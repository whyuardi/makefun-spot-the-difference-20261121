[![bounty](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/whyuardi/makefun-spot-the-difference-20261121/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)

# The Twin Rooms — Spot the Difference

Two pictures. Seven differences. Three curious rooms.

A complete spot-the-difference game that plays offline in a desktop browser from
static files — no network, no libraries, no build step. Open `game/index.html`
(or run `node serve.ts` and visit http://localhost:8080) and click the
differences in either picture to circle them.

## The rooms

1. **Sunny Garden** — a bright backyard: sun, house, apple tree, and a cat
   watching a butterfly. 120 seconds.
2. **Cozy Kitchen** — tea on the table, a ticking clock, a cat napping on the
   chair. 150 seconds.
3. **Starry Harbor** — a night port under a full moon, boats, a lighthouse, and
   lanterns on the pier. 180 seconds.

Each room hides 7 differences: fair, but not obvious — a missing sun ray, a
teacup that changed colour, a lighthouse beam that went dark.

## How it plays

- **Click / tap** a difference in either picture: a gold ring marks it on both
  panels, +100 points (fast finds in a row build a combo bonus).
- **Wrong clicks** cost 10 points. **Hints** (H, 3 per room) pulse a ring
  around one difference you haven't found yet, for 25 points.
- **Timer**: finish a room before it runs out; leftover seconds pay a bonus.
  The bar turns red under 30 seconds and ticks in the last 10.
- **Sound** is synthesized with WebAudio (M to mute). Best score is kept in
  the browser. Keys: 1 / 2 / 3 choose a room, H hint, M sound, R restart.

## Layout

- `game/index.html` — the page shell
- `game/src/main.js` — boot and game loop
- `game/src/config.js` — every tuning number in one place
- `game/src/scenes.js` — the three hand-drawn rooms and their differences
- `game/src/world.js` — the state machine: screens, levels, scoring, hints
- `game/src/render.js` — HUD, panels, markers, title and end screens
- `game/src/input.js` — mouse, touch and keyboard
- `game/src/audio.js` — synthesized sounds, no audio files
- `game/src/shots.js` — the staged scenes behind `?shot=start|play|play2|end`
- `main.ts` — hands the game in: copies `game/` and `screenshots/` to
  `/output` and writes `dossier.json`
- `serve.ts` — tiny static server for local play-testing
- `shots.json` — the four screenshots and the query that stages each one

## Screenshots

Real renders of the game's own code, staged with `?shot=` and taken in desktop
Chrome at 1280×720. `1-play.jpg` is the cover: three differences found and
ringed, four still hiding, and the counter reading FOUND 3 / 7.
