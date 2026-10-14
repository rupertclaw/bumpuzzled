# Tile Rush

Grid-routing brain-teaser puzzle game. Browser PWA, zero dependencies, zero build step, zero server, fully offline-capable.

Live: https://rupertclaw.github.io/tile-rush/
Repo: https://github.com/rupertclaw/tile-rush

Inspired by Puzzle Crusher (Gamescan/Seascape Network) — a web3 puzzle-platformer that was abandoned before its web3 features ever shipped. Tile Rush rebuilds the part that was actually good: routing a character across a grid of special tiles.

## For developers / contributors

Read [HANDOVER.md](HANDOVER.md) before touching anything. It explains the tile rules, the two-copies-of-level-data architecture, the verification pipeline, and the deployment gotchas.

Quick start:

```
python3 sim.py     # solve all levels, write solutions.json
python3 verify.py  # full cross-verification (requires node)
```

Then open `index.html`.

## Files

| File | Role |
|---|---|
| index.html | Game: UI, controls, progress, PWA shell + boot-time self-verification |
| game-core.js | Pure game engine: LEVELS, step(), land() — no DOM |
| sw.js | Service worker (offline cache) |
| manifest.webmanifest | PWA manifest |
| icon.svg | App icon |
| sim.py | Python BFS level solver — proves every level is beatable, computes par |
| solutions.json | Solver output: minimal solution path per level |
| verify.py | Cross-verification: sim.py <-> solutions.json <-> game-core.js <- index.html |
| DESIGN.md | Tile rules, design decisions log |
| HANDOVER.md | Detailed contributor brief |

## License

None yet. Ask before reusing assets or code.