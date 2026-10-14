# Tile Rush — Design & Rules Reference

## Origin

Inspired by classic mobile tile-routing puzzles. The goal: **brain-teaser routing and a real difficulty curve** — no lives, no currencies, no meta layer. Undo is free and unlimited. All code, art, sound and levels are original.

## The tile language (canonical)

Implemented twice — `sim.py` (Python solver) and `game-core.js` (the game). `verify.py` runs both engines over every reachable state of every level and fails on any disagreement.

| Char | Name | Behaviour |
|---|---|---|
| `#` | Wall | Blocks walking, jump landings and spring launches. Off the board counts as wall. |
| `.` | Tile | Walk on it. **Every tile you step off falls away** (see below). |
| `P` | Start | One per level. Acts as floor. |
| `E` | Exit | One per level. Arriving wins. |
| `H` | Hole | Walking in = fall. The player pops straight back (state unchanged, no move counted). |
| `J` | Jump pad | Standing on J, push toward a hole: leap over exactly that one hole, landing 2 tiles away. Landing on a wall or another hole = no move. Pushing toward anything else is a normal step. |
| `S` | Spring | Standing on S, push any way: fly over every hole in that direction and land on the first non-hole tile. If that tile is a wall, the launch doesn't happen. Adjacent solid tile = you just step there. |
| `T` | Lever | **Landing** on it swings every bridge. |
| `B` | Bridge (starts hanging) | Hanging = a gap that behaves exactly like a hole (springs fly over it, jump pads leap it, walking in = fall). Across = walkable. |
| `b` | Bridge (starts across) | Same, but starts across. One lever swings every `B` and `b`. |
| `1`/`2`, `3`/`4` | Portal pairs | **Landing** on one moves you to its twin. The entry portal falls as you pass through; the exit falls when you step off — one trip per pair. |

### Falling tiles (the core rule)

Every tile you leave — floor, start, spring, jump pad, lever, bridge, portal — falls away and becomes a gap. You can never retrace your steps, so every level is "plan your whole route". Fallen tiles are gaps like any other: springs fly over them, jump pads leap them.

### Exact move order (mirrors `step()` in both engines)

1. If standing on `S`: scan in the pushed direction past every hole-like tile; first other tile is the target, or a wall = blocked.
2. Otherwise look at the adjacent tile:
   - hole-like (H, a fallen tile, a hanging bridge): if standing on `J`, target is 2 tiles away (must not be wall or hole-like, else blocked); if not, **fall**.
   - wall: blocked.
   - anything else: target is that tile.
3. The tile you're leaving falls away.
4. Landing chain on the target: `T` flips the lever; a portal moves you to its twin; arriving on `E` wins.

### State

`(row, col, lever, fallen)` — `lever` is 0/1; `fallen` marks every cell that has fallen (a bitmask in Python, a "0101…" string in JS, index `row*width+col`). Nothing else carries over between moves; if you add a mechanic with memory, it must join this state in **both** engines and in the undo history.

## Level design

- One clear idea per level. The intro levels teach a single tile; the rest combine.
- Difficulty is measured, not guessed: `python sim.py` prints, per level:
  - `par` — shortest solution
  - `traps` — moves that put you in a state you can never win from (you must undo)
  - `on-path` — how many steps of the par route offer such a trap move. This is the best single "how hard does this feel" number.
  - `optimal` — how many different shortest solutions exist (1 = tight)
- `levelgen.py` is a sketchpad for finding hard layouts: give it a template (`?` = free cell) and the tiles to use; it hill-climbs for traps and strips clutter. Its output always needs a human pass for readability.
- Mobile limit: max 9 wide × 11 tall (enforced by `sim.check_grid`). 5–7 wide plays best.

## Stars

3★ = par or better. 2★ = within par + max(2, 25% of par). 1★ = solved.

## Pipeline

```
python sim.py --fix   # solve levels.js, write each level's "sol"
python verify.py      # full ship check (needs node)
```

`index.html` also replays every level's `sol` at load and sets the tab title to `Tile Rush (VERIFY FAIL)` if any fail.

## Decisions log

- 2026-09-27: Prototype — 6 levels, undo instead of lives, BFS-proven par.
- 2026-10-14: Full rethink after playtest ("too easy, looks plain, rules unclear"):
  - New mechanics with memory (cracked floor, lever-flipped bridges) so order matters and levels have real traps. Old one-shot trigger replaced by a lever that flips both ways; a raised bridge is a gap (not a wall) so springs and jump pads interact with it.
  - Levels moved into one file (`levels.js`); `sim.py` reads it. `solutions.json` and the second level copy are gone — nothing left to drift.
  - `verify.py` now compares the two engines on every reachable state, not just the solution path.
  - Falling no longer needs an undo — you pop back automatically. Moves = current path length, so undo refunds moves.
  - UI: tile art, move animations, intro card for each new tile, tap-a-tile explanations, legend, level select with stars, sound.
  - Service worker switched to network-first, so online players never run stale code.
- 2026-10-14 (later): Owner playtest feedback: tiles you've stepped on should fall away. Made it the core rule: every tile falls when you leave it (cracked floor removed as redundant; levers, springs, pads and portals are now one-use). All 16 levels redesigned for it. Board rebuilt as a real 3D tilted plane (CSS 3D transforms): tiles are slabs, walls are blocks, fallen tiles drop into the void, bridges swing on a hinge, player is an upright ball with a shadow. Progress key bumped to `tilerush3`.
- Planned: level editor + share-by-URL (levels are small JSON, encode into the link hash).
