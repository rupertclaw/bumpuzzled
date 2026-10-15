# Bumpuzzled — Contributor Handover Brief

**Game name:** Bumpuzzled (originally Tile Rush, briefly Stepfall, both 2026-10-14). The name comes from a reality-TV contestant mangling "bamboozled". Repo renamed `tile-rush` → `bumpuzzled` on 2026-10-15 (before the game was shared, so the old Pages URL dying didn't matter). The save key `tilerush3` was kept so progress survived. Custom domain bumpuzzled.com (Namecheap) connected 2026-10-15 — a new origin, so installs and saved progress started fresh there.
**Repo:** https://github.com/rupertclaw/bumpuzzled
**Live site:** https://bumpuzzled.com (GitHub Pages, branch `main`, root; custom domain via the `CNAME` file — don't delete it. DNS is at Namecheap: 4 A records for `@` → 185.199.108–111.153, `www` CNAME → rupertclaw.github.io. The old github.io address redirects here.)
**Updated:** 2026-10-14 (v2 rethink). Original brief: 2026-09-27 by Rupert.

Assumes you can see the repo and nothing else. Rules live in DESIGN.md; this file is about how to work on it safely.

---

## 1. What this is

A grid-routing brain-teaser PWA. Plain HTML/CSS/JS + a service worker: no server, no build step, no dependencies. Inspired by classic mobile tile-routing puzzles: brain-teaser feel and a real difficulty curve, without lives, currencies or meta-progression.

**v1 → v2 (2026-10-14).** The owner playtested v1 and found it too easy, plain-looking, and unclear. v1's mechanics had no memory, so every level was just a maze (most were solved by holding Right). v2's core rule (from the owner): **every tile you step off falls away**, so you can never retrace your steps. Plus lever-swung bridges, one-use springs/pads/portals, every level redesigned with measured difficulty, and a 3D board (tilted CSS-3D plane with slab tiles), intro cards, tap-to-explain, level select, stars, sound.

Owner preferences (constraints):
- **Don't name or reference other games, studios or companies** in the repo or the game (it's public). Say "inspired by classic tile-routing puzzles" if anything. All code, art, sound and level layouts must be original — never copy assets, text or levels from another game.
- Web2 only. No API keys in client code, ever. No server, no database. Everything local.
- Mobile-first PWA; must work offline.
- Simple, universal UX over platform-specific branching.
- Owner is a vibe-coder: plain English, analogies over jargon, short reports.
- `rupertclaw` GitHub account only. (A separate `MaplePulse` account exists for an unrelated project — don't mix them up.)

Roadmap: 1) levels ✔ — 32 levels in two sections ("Learning the ropes" 1–16, "Expert" 17–32; a level object's optional `section` key starts a heading on the level-select screen), 2) level editor + share-by-URL — **on hold, owner wants to think about it** (felt too close to the inspiration game), 3) further polish.

## 2. Repo map

| File | What | Notes |
|---|---|---|
| `index.html` | All UI | Boot-time self-check replays every level's `sol` |
| `game-core.js` | Rules engine | **Must stay DOM-free** — verify.py runs it in node |
| `levels.js` | Level data | **Only copy.** JSON between `/*BEGIN*/` and `/*END*/`; sim.py reads and writes it |
| `sim.py` | Python rules engine + BFS solver + difficulty stats | `--fix` writes solutions into levels.js |
| `verify.py` | Ship check | Run before every push |
| `levelgen.py` | Dev-only layout search | Not shipped |
| `sw.js` | Service worker, network-first | Bump `CACHE` when shipped files change (verify.py enforces) |
| `manifest.webmanifest`, `icon.svg` | PWA bits | |
| `DESIGN.md` | Canonical rules + decisions log | Keep in sync when rules change |
| `.claude/launch.json` | Local preview server config | Dev convenience |

## 3. The two-engine rule

The rules exist twice: `sim.py` (solver) and `game-core.js` (game). That's deliberate — the solver proves levels are winnable and computes par — but it means they can drift. `verify.py` explores **every reachable state** of **every level** in Python, asks node to run the same moves through `game-core.js`, and fails on any difference. If you change a rule, change both, then run verify.

State is `(row, col, lever, broken)`. If you add a mechanic that remembers anything, it must join the state in both engines, in `index.html`'s undo history (history stores whole state objects, so that's automatic as long as it's in the state), and in the verify query format.

## 4. Workflow

Adding or changing a level:
1. Edit `levels.js` (grid rows as strings, `name`, `hint`). Leave `sol` empty for a new level.
2. `python sim.py --fix` — prints par + difficulty stats and writes `sol`. UNSOLVABLE or BAD GRID → fix the grid.
3. Look at the stats. `on-path` (steps on the par route where a trap move is available) is the best "will this feel hard" number. Intro levels ~0, puzzle levels 3+, finales 6+.
4. Play it in the browser (`python -m http.server`, open with `?all` to unlock everything). Numbers don't tell you if it's *readable*.
5. `python verify.py` → must say ALL CHECKS PASS (includes the sw.js CACHE bump check vs origin/main).
6. Commit, push to `main` (= deploy). Check the live site's tab title doesn't say VERIFY FAIL.

Grid limits: max 9×11, exactly one P and one E, portals in complete pairs. Keep open areas small: with falling tiles the number of possible states grows fast (verify engine-checks up to 20k states per level). Off-board = wall, so no border walls needed.

## 5. Deployment

GitHub Pages from `main` root; live ~60s after push. Quick check:
```
curl -s https://bumpuzzled.com/levels.js | head -5
```
The service worker is network-first (online players always get the latest files; offline players get the last cached copy). Still bump `CACHE` on every shipped change so old caches get cleared — verify.py fails if you forget.

No secrets, tokens or env vars anywhere — keep it that way.

## 6. Progress storage

localStorage key `tilerush3` (bumped whenever the level set changes, so old progress is ignored; deliberately not renamed when the game was, so players keep their progress): `{ stars: {levelIndex: 1-3}, best: {levelIndex: moves}, seen: [tile kinds whose intro card was shown], sound: bool }`. Level N unlocks when level N-1 has any stars.

## 7. Pitfalls

1. **Editing rules in one engine only.** verify.py will catch it — run it.
2. **Unreadable levels.** levelgen output is noisy; always strip tiles that don't matter and play it yourself.
3. **Teleport/lever arrival semantics.** Effects trigger on *landing* (including after a spring or jump), once. Portals don't chain.
4. **Tiles fall when you step off, not when you step on.** The entry portal is the exception: it falls as you warp through it.
5. **3D rendering.** The board is a CSS-3D scene (`#scene`, `rotateX(--tilt)`); the player and upright sprites (star, lever) counter-rotate by the tilt to face the camera. If you change the tilt, change `TILT` in JS and `--tilt` in CSS together.
6. **Stale files after a deploy.** GitHub Pages sends a 10-minute cache header. sw.js fetches with `cache: "no-cache"` so installed players always revalidate; a first-time visitor's browser can still briefly hold old files. When testing locally, hard-reload (or the browser keeps old `levels.js`).
7. **Phone height.** Board + D-pad must fit 375×667. Keep levels ≤7 rows where possible.

## 8. Style for reports to the owner

- Short, plain English. "Done and live" reports include the live URL and what changed.
- Every push/PR: include the full repo or PR link in the chat reply.
- `main` is the only branch; no branch protection. If you introduce a PR flow, agree it with the owner first.
