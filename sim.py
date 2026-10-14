#!/usr/bin/env python3
"""Tile Rush level solvability simulator.
Rules mirror the JS game exactly:
- Player on grid. Press a direction.
- Normal tile: move 1 cell (walls/# and closed B block).
- Standing on J (jump pad): pressing into an adjacent hole jumps over ONE hole.
- Standing on S (spring): pressing a direction launches you: fly straight over holes,
  land on first landable cell; wall/closed-B blocks the launch (no move).
- Landing on T: opens all B tiles (one-way, for the level).
- Landing on 1/2 (or 3/4) teleport pads: warp to partner.
- Arrival on E: level won.
State: (row, col, bridgesOpen). BFS -> solvable + par (min moves).
"""
import json, collections, sys

LEVELS = {
1: [  # First Steps: walk around a wall
 "##########",
 "#P.......#",
 "####.#####",
 "#.......E#",
 "##########",
],
2: [  # Getting Air: spring flies you over holes
 "##########",
 "#P....SHHE",
 "##########",
],
3: [  # Bridge Work: trigger opens the bridge
 "##########",
 "#P.......#",
 "####.#####",
 "#T...B...#",
 "#####E####",
 "##########",
],
4: [  # Warp Zone: teleporter into a sealed pocket
 "##########",
 "#P...1...#",
 "##########",
 "#2......E#",
 "##########",
],
5: [  # Double Trouble: chained jump pads over holes
 "#########",
 "#PJHJH.E#",
 "#########",
],
6: [  # Crusher Finale: spring launch over a hole run, bridge opens the exit
 "############",
 "#P..T.SHH.E#",
 "############",
],
}

DIRS = {"U": (-1, 0), "D": (1, 0), "L": (0, -1), "R": (0, 1)}
PAIRS = {"1": "2", "2": "1", "3": "4", "4": "3"}


def tile(g, r, c):
    if 0 <= r < len(g) and 0 <= c < len(g[0]):
        return g[r][c]
    return "#"

def blocked(g, t, br):
    return t == "#" or (t == "B" and not br)

def land(g, r, c, br):
    """Arrival chain after moving onto (r,c). Returns (r, c, br, won)."""
    t = tile(g, r, c)
    won = t == "E"
    if t == "T":
        br = True
    if t in PAIRS:
        o = PAIRS[t]
        for rr, row in enumerate(g):
            for cc, ch in enumerate(row):
                if ch == o:
                    return (rr, cc, br, won)
    return (r, c, br, won)

def step(g, st, d):
    """st=(r,c,br). Returns ('move', (r,c,br,won)) | ('fall', None) | None (no move)."""
    r, c, br = st
    dr, dc = DIRS[d]
    t = tile(g, r, c)
    if t == "S":
        # launch: fly straight, ignore holes, land on first non-hole landable cell
        i = 1
        while True:
            rr, cc = r + i * dr, c + i * dc
            tt = tile(g, rr, cc)
            if tt == "H":
                i += 1
                continue
            if tt == "#" or (tt == "B" and not br):
                return None  # launch blocked, stay on spring
            return ("move", land(g, rr, cc, br))
    tr, tc = r + dr, c + dc
    tt = tile(g, tr, tc)
    if tt == "H":
        if t == "J":
            lr, lc = r + 2 * dr, c + 2 * dc
            lt = tile(g, lr, lc)
            if lt == "#" or lt == "H" or (lt == "B" and not br):
                return None
            return ("move", land(g, lr, lc, br))
        return ("fall", None)
    if blocked(g, tt, br):
        return None
    return ("move", land(g, tr, tc, br))

def solve(g):
    start = None
    for r, row in enumerate(g):
        for c, ch in enumerate(row):
            if ch == "P":
                start = (r, c)
    if start is None:
        return None
    init = (start[0], start[1], False)
    q = collections.deque([(init, [])])
    seen = {init}
    while q:
        st, path = q.popleft()
        for d in "UDLR":
            res = step(g, st, d)
            if res is None:
                continue
            kind, nst = res
            if kind == "fall":
                continue
            r, c, br, won = nst
            npath = path + [d]
            if won:
                return npath
            ns2 = (r, c, br)
            if ns2 not in seen:
                seen.add(ns2)
                q.append((ns2, npath))
    return None

if __name__ == "__main__":
    names = {1: "First Steps", 2: "Getting Air", 3: "Bridge Work",
             4: "Warp Zone", 5: "Double Trouble", 6: "Crusher Finale"}
    ok = True
    out = {}
    for n, g in LEVELS.items():
        w = len(g[0])
        assert all(len(row) == w for row in g), f"L{n}: ragged rows"
        has_p = any("P" in row for row in g)
        has_e = any("E" in row for row in g)
        assert has_p and has_e, f"L{n}: missing P or E"
        path = solve(g)
        if path is None:
            print(f"L{n} {names[n]}: UNSOLVABLE")
            ok = False
        else:
            print(f"L{n} {names[n]}: solvable, par={len(path)} path={''.join(path)}")
            out[n] = path
    with open("solutions.json", "w") as f:
        json.dump(out, f)
    sys.exit(0 if ok else 1)