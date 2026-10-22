# Bumpuzzled — Design & Rules Reference

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
  - `safe` — along the par route, the average number of moves that keep the level winnable. **1.00 means only one safe move every step; ~1.15+ feels easy even with lots of traps** (owner found Frog Pond, safe 1.16 / 4 optimal routes, too easy). Aim for ≤ 1.08 and optimal ≤ 2 on puzzle levels.
- `levelgen.py` is a sketchpad for finding hard layouts: give it a template (`?` = free cell) and the tiles to use; it hill-climbs for traps and strips clutter. Its output always needs a human pass for readability.
- Mobile limit: max 9 wide × 11 tall (enforced by `sim.check_grid`). 5–7 wide plays best.

## Stars

3★ = par or better. 2★ = within par + max(2, 25% of par). 1★ = solved.

## Pipeline

```
python sim.py --fix   # solve levels.js, write each level's "sol"
python verify.py      # full ship check (needs node)
```

`index.html` also replays every level's `sol` at load and sets the tab title to `Bumpuzzled (VERIFY FAIL)` if any fail.

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
- 2026-10-14: Renamed Tile Rush → Stepfall (several apps already use "Tile Rush") → **Bumpuzzled** (stepfall.com taken; owner's pick, from a reality-TV contestant's take on "bamboozled"). Repo/URL slug and save key unchanged.
- 2026-10-15: Owner finished all 16 and asked for more + harder intros. Intro levels (1, 3, 5, 8, 11) rebuilt with 5–10 trap steps each (were 0–2). Added levels 17–32 ("Expert": 6×6/6×7 boards, par 16–26, 7–18 trap steps, mixed mechanics). Level-select section headings. Service worker now revalidates every file (`cache: no-cache`) so a new index.html can't run with a stale levels.js.
- 2026-10-15: Live at https://bumpuzzled.com (Namecheap DNS → GitHub Pages, HTTPS enforced). Win card gets a Share button (native share sheet on phones, clipboard on desktop, spoiler-free text: level, stars, moves vs par, link). Fixed a stale win card appearing if you left a level right after winning. Packs 3–4 (levels 33–64) are built but deliberately NOT in this public repo — see HANDOVER.
- 2026-10-15: Google Analytics 4 added (owner's account). Production-only; consent banner for UK/EU (time-zone check) backed by Google's region-based consent defaults; Privacy card with an on/off switch. Level start/complete/restart/quit, share, install and launch-mode events. "More packs coming soon" box + end-of-game message.
- 2026-10-15: Level 17 "Long Haul" (plain maze, 7 trap steps — owner found it too easy) replaced by "Deep End" (par 22, 17 trap steps, one optimal route). Share now sends a picture of the result (Facebook drops pre-filled text); link previews via Open Graph tags + og-image.jpg.
- 2026-10-16: Packs 3 "Master" and 4 "Grandmaster" (levels 33–64) published free — owner wants more users before monetising; paid packs to be retrofitted later for newcomers / new packs. Level 18 upgraded.
- 2026-10-19: Umami (cookie-free analytics) added alongside Google Analytics, because GA misses EU players who decline cookies and ad-blocker users. Privacy card's switch now turns both off; the cookie banner only governs Google's cookie.
- 2026-10-20: SEO basics: keyword title ("Bumpuzzled – Free Brain-Teaser Puzzle Game"), canonical link, schema.org VideoGame data, the logo is now the page's h1, a short description at the bottom of the home screen, robots.txt and sitemap.xml.
- 2026-10-20: Packs 5 "Legend" and 6 "Mythic" (levels 65–96, built 2026-10-16 with the tightness filter: par 16–26, safe ≈1.00) released. Packs 7–8 being built as the next held-back promo packs.
- 2026-10-21: Google Analytics, its UK/EU cookie banner and the GA custom setup removed; Umami (cookie-free) is the only analytics, so no consent prompt is needed. Matches Kablamagram. Privacy card now says the game uses no cookies.
- 2026-10-21: Unlockable characters (9) and board themes (6), earned with total stars, picked on the home screen's Style card; a "New character / board theme!" box on the win card. Cosmetic only, no server. Share pictures use the chosen look. Next idea discussed: a daily puzzle and/or all-time progress leaderboard on a small server (like Kablamagram's), with the server replaying routes to stop cheating.
- 2026-10-21: Daily puzzle + leaderboard. A Cloudflare Worker hands out one board per day (from a bank made with levelgen, kept outside this repo), times players on its own clock from Start, and replays each route through the game rules. Ranking: fewest moves, then quickest; first finish counts (owner's question: most players will match par, so time breaks ties). Nickname optional. The daily share picture hides the board.
- 2026-10-22: Daily #1 played far too easy (par 16, 34 reachable positions); dailies #2+ rebuilt at Mythic level (par 18-28, 14+ trap steps, 300+ positions). Daily button icon: the exit tile (the calendar emoji shows a fixed date). Past daily puzzles archive, matching Kablamagram's: one try each, saved as you go, no leaderboard.
- Planned (on hold — owner wants to think about it): level editor + share-by-URL (levels are small JSON, encode into the link hash).
