# Stepfall

A grid-routing brain-teaser where every tile falls away behind you — so plan your whole route. Springs, jump pads, levers, drawbridges and portals; every level is proven solvable by a solver and has a par to beat.

Browser PWA: no server, no build step, no dependencies, works offline, installs to your home screen.

Live: https://rupertclaw.github.io/tile-rush/
Repo: https://github.com/rupertclaw/tile-rush

Inspired by classic tile-routing puzzle games. All code, art, sound and levels are original.

## Playing

Swipe or use the arrow buttons. Undo is free and unlimited. Tap any tile to see what it does, or press **?** for this level's tiles. Match par for three stars.

Add `?all` to the URL to unlock every level (handy for testing).

## Working on it

Read [HANDOVER.md](HANDOVER.md) first. Needs Python 3 and Node.

```
python sim.py --fix   # solve every level in levels.js, store the solutions
python verify.py      # ship check — must say ALL CHECKS PASS before you push
```

Then serve the folder (`python -m http.server`) and open it.

| File | Role |
|---|---|
| index.html | The game: rendering, animation, input, intro cards, progress, sound |
| game-core.js | Pure rules engine (no DOM) — `makeLevel`, `step`, `replay` |
| levels.js | All level data. The only copy. |
| sw.js | Service worker (offline cache) |
| manifest.webmanifest, icon.svg | PWA install bits |
| sim.py | Python copy of the rules + BFS solver + difficulty stats |
| verify.py | Ship check: both engines agree on every reachable state, solutions valid, cache bumped |
| levelgen.py | Dev tool: searches for hard layouts to curate |
| DESIGN.md | Tile rules, design method, decisions log |
| HANDOVER.md | Contributor brief |

## License

None yet. Ask before reusing assets or code.
