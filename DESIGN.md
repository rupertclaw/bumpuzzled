# Tile Rush — Design & Rules Reference

## Origin

Tribute to **Puzzle Crusher** (developed by Gamescan, incubated by Seascape Network). Puzzle Crusher was a web3 puzzle-platformer (iOS/Android) that went dead around 2024-2025: Play Store listing 404s, App Store returns zero results, puzzlecrusher.com domain dropped. Its web3 integrations never shipped. What the original player (Graeme) liked and what Tile Rush preserves: **the brain-teaser routing gameplay and its progressive difficulty curve**.

Tile Rush deliberately drops: web3/token/NFT mechanics, the original's hearts/lives economy, the building-upgrade meta layer. Design stance: pure puzzle, offline PWA, no server. Undo replaces death punishment.

## The Tile Language (canonical rules)

Grid of characters. These rules are canon and implemented in **both** `sim.py` (Python, solver) and `game-core.js` (JS, game). They must stay identical. `verify.py` exists to catch drift.

| Char | Name | Behavior |
|---|---|---|
| `#` | Wall | Blocks movement. Nothing passes; springs blocked by it; jumps blocked by it. |
| `.` | Floor | Plain walkable, 1 cell per move. |
| `P` | Player start | Only one per level. Player spawns here. Behaves as floor. |
| `H` | Hole | **Death** if walked into. Springs fly over hole runs. Jump pads leap exactly ONE adjacent hole. |
| `J` | Jump pad | Walkable. When standing on J and pressing into an adjacent H: leap over it, landing 2 cells away. Landing must be floor-ish (not wall/H/closed bridge), else no move. |
| `S` | Spring | Walkable. When standing on S and pressing any direction: launch straight in that direction, skipping every H, landing on the first landable tile. Blocked by wall/closed bridge (= no move). |
| `T` | Trigger | Walkable. **Landing** on T opens every `B` in the level (one-way for that level visit; persists through undo? — currently yes, state is per-move snapshot; verify on change). |
| `B` | Bridge | Closed B = wall. Open B = floor. Opened by T. |
| `1`/`2`, `3`/`4` | Teleport pair | Walkable. **Landing** on one warps you instantly to its partner. Arrival tile effects at partner DO apply (e.g. warping onto E wins, warping onto T triggers). Only the landing check runs once (no infinite warp loops). |
| `E` | Exit | Walkable. **Arriving** here wins the level. |

### Movement semantics (exact)

- A move = press U/D/L/R.
- Normal tiles: move 1 cell in that direction.
- Arrival on a tile runs the "landing chain": T opens bridges; teleport warps (then partner's arrival chain runs ONCE); E wins.
- Holes: stepping into H = death state (game shows "You fell in", move is recorded in history, undo recovers). Death is state-unchanged otherwise.
- Springs: the launch ignores every H along the ray. First non-H tile decides: landable → land there (with landing chain); wall/closed-bridge → no move.
- Jump pads: only when the tile directly ahead is H. Leap to exactly 2 cells ahead. Landing must be non-H, non-wall, non-closed-B.
- Walls/closed bridges: direction press is a no-op (state unchanged). Game prints "Blocked."

### State

BFS state = (player row, player col, bridgesOpen bool). Teleport/trigger/win are arrival effects. This state space is what `sim.py` searches.

## Verification pipeline (critical)

Three places hold level data + solutions. They must stay in lockstep:

1. `sim.py` — `LEVELS` dict (Python source of truth for solving)
2. `game-core.js` — `LEVELS` array (game's live copy) AND `SOLUTIONS` map (par strings)
3. `solutions.json` — solver output consumed by verify.py and the node replay harness

Pipeline:

```
python3 sim.py      # reads its LEVELS, writes solutions.json
python3 verify.py   # checks: fresh BFS == solutions.json == game-core.js SOLUTIONS
                    # compares game-core.js LEVELS grids vs sim.py LEVELS (structural)
                    # replays every solution through game-core.js step() via node
```

All three must pass before shipping. `index.html` ALSO self-verifies at boot (replays SOLUTIONS through step(); sets document.title to "Tile Rush (VERIFY FAIL)" and logs console.error if broken).

**Rule for contributors: never hand-edit level strings without re-running the full pipeline.** Hand-authored grids are how unsolvable levels happen.

## Decisions log

- 2026-09-27: Prototype scope = 6 levels, brain-teaser priority. No lives/hearts — undo instead. No meta progression buildings. Rationale: preserve what made Puzzle Crusher good, kill the churn mechanics.
- 2026-09-27: BFS-first development: solver written before game code. Every level's par is proven, not guessed.
- 2026-09-27: Death is recoverable (undo/restart), not a fail state with cost. No punishment loops.
- 2026-09-27: Skip button exists in the prototype; should be dev-mode scaffolding only in a real release.
- Planned: more levels (12-16), level editor with share-via-URL (levels encoded into the link, no server), visual polish.

## Architecture notes

- game-core.js is DOM-free on purpose. Pure functions: `tileAt(grid,r,c)`, `land(grid,r,c,bridgesOpen)`, `returns {r,c,bridgesOpen,won}` or `{fall:true}` or `null`. This is what makes node-based verification possible. Keep it pure.
- index.html owns: rendering, input (buttons/swipe/keys), history/undo stack, localStorage progress (`tilerush` key), winbox UI, boot-time verification.
- Progress keys in localStorage `tilerush`: `best<N>` = best move count per level (1-indexed), `unlocked` = highest reachable level index.
- sim.py `solve()` returns minimal path as list of "UDLR" chars. Level number = 1-indexed in solutions.json ("1".."6") and SOLUTIONS keys.
- sw.js: cache-first, version constant `CACHE = "tilerush-v1"`. **Bump v-string on every content change** or users keep stale code.

## Deployment

GitHub Pages, branch `main`, root. Deploys automatically on push to main. Custom domain: none. Live URL: https://rupertclaw.github.io/tile-rush/
Deployment gotchas documented in HANDOVER.md.