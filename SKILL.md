# Tile Rush - Design Doc (living)

Puzzle Crusher tribute. Dead game, reborn as web2 PWA, no server.

## Core rule (mirrored in sim.py + game.js, keep in sync!)
- Player at pos (r,c). Press U/D/L/R.
- Floor/other safe tiles: move 1. Walls (#) and closed bridges (B) block, no move, no cost... (cost: counts as a move attempt but state unchanged - TUNE)
- Hole (H): stepping in = death. Standing on Jump pad (J): pressing into H leaps over ONE H (H must be directly adjacent, landing must be landable + not H/wall).
- Spring (S): pressing a dir launches: skip run of holes, land first landable (not H, not wall/closed B). Blocked = no move.
- Teleport 1/2 (3/4): stepping on warps to partner instantly (arrival tile checked at partner).
- T = bridge trigger: landing opens ALL bridges in level (state bridgesOpen=true).
- B = bridge: closed=blocker, open=floor.
- E = exit: arrive -> WIN.

## Decisions log
- 2026-09-27: v1 = 6 levels, brain-teaser priority, no hearts/lives (undo instead), no meta buildings. Map-editor + share-via-URL planned post-prototype.
- 2026-09-27: BFS par used as level score target, best-moves tracked in localStorage.

## Files
- sim.py: BFS solver, LEVELS dict + solutions.json. RUN BEFORE SHIPPING NEW LEVELS.
- index.html: game (grid render, input, undo, restart, progress via localStorage, PWA shell)
- sw.js: offline service worker
- manifest.webmanifest