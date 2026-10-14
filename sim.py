#!/usr/bin/env python3
"""Tile Rush solver + reference engine.

Levels live in ONE place: levels.js (the JSON array between the /*BEGIN*/ and
/*END*/ markers). This file reads them from there, so there is no second copy
to drift.

  python sim.py          solve every level, report par + difficulty stats
  python sim.py --fix    same, and write the BFS solutions back into levels.js

The rules here must match game-core.js exactly. verify.py checks that by
running both engines over every reachable state of every level.

State = (row, col, lever, fallen)
  lever  : 0/1, flipped each time you land on T
  fallen : bitmask over every cell (bit r*width+c). Every tile you step off
           falls away, so you can never retrace your steps.
"""
import json, collections, sys, re, pathlib

HERE = pathlib.Path(__file__).parent
LEVELS_JS = HERE / "levels.js"

DIRS = {"U": (-1, 0), "D": (1, 0), "L": (0, -1), "R": (0, 1)}
PAIRS = {"1": "2", "2": "1", "3": "4", "4": "3"}
TILES = set("#.PHJSTBb1234E")
MAX_W, MAX_H = 9, 11  # keeps cells big enough on a phone


# ---------------------------------------------------------------- levels.js io

def load_levels():
    txt = LEVELS_JS.read_text(encoding="utf-8")
    m = re.search(r"/\*BEGIN\*/(.*?)/\*END\*/", txt, re.S)
    if not m:
        raise SystemExit("levels.js: /*BEGIN*/ ... /*END*/ markers not found")
    return json.loads(m.group(1))


def dump_levels(levels):
    """Pretty JSON with one grid row per line, so levels.js stays readable."""
    out = ["["]
    for i, lv in enumerate(levels):
        out.append(" {")
        keys = [k for k in ("name", "hint", "grid", "sol") if k in lv]
        keys += [k for k in lv if k not in keys]
        for j, k in enumerate(keys):
            comma = "," if j < len(keys) - 1 else ""
            if k == "grid":
                rows = ",\n".join("   " + json.dumps(r) for r in lv[k])
                out.append(f'  "grid": [\n{rows}\n  ]{comma}')
            else:
                out.append(f"  {json.dumps(k)}: {json.dumps(lv[k], ensure_ascii=False)}{comma}")
        out.append(" }" + ("," if i < len(levels) - 1 else ""))
    out.append("]")
    return "\n".join(out)


def write_levels(levels):
    txt = LEVELS_JS.read_text(encoding="utf-8")
    new = re.sub(r"/\*BEGIN\*/.*?/\*END\*/",
                 lambda _: "/*BEGIN*/" + dump_levels(levels) + "/*END*/", txt, flags=re.S)
    LEVELS_JS.write_text(new, encoding="utf-8", newline="\n")


# ---------------------------------------------------------------- engine

class Level:
    """Pre-scanned grid: start position and portal partners."""

    def __init__(self, grid):
        self.g = grid
        self.h, self.w = len(grid), len(grid[0])
        self.start = None
        spots = {}
        for r, row in enumerate(grid):
            for c, ch in enumerate(row):
                if ch == "P":
                    self.start = (r, c)
                elif ch in PAIRS:
                    spots[ch] = (r, c)
        self.partner = {}
        for ch, pos in spots.items():
            if PAIRS[ch] in spots:
                self.partner[pos] = spots[PAIRS[ch]]

    def raw(self, r, c):
        if 0 <= r < self.h and 0 <= c < self.w:
            return self.g[r][c]
        return "#"

    def bit(self, r, c):
        return 1 << (r * self.w + c)

    def eff(self, r, c, lever, fallen):
        """What the tile acts like right now: '#', 'H', or its own char."""
        t = self.raw(r, c)
        if t == "#":
            return t
        if fallen & self.bit(r, c):
            return "H"
        if t == "B":
            return "." if lever else "H"   # B starts raised (a gap)
        if t == "b":
            return "H" if lever else "."   # b starts lowered (a bridge)
        return t


def step(lv, st, d):
    """Returns ('move', (r, c, lever, fallen), won, info) | ('fall', None) | None.

    info describes what happened, for the UI/animation:
      'walk' | 'jump' | 'spring', then optionally 'lever', 'warp'
    """
    r, c, lever, fallen = st
    dr, dc = DIRS[d]
    here = lv.eff(r, c, lever, fallen)
    info = []
    if here == "S":
        i = 1
        while lv.eff(r + i * dr, c + i * dc, lever, fallen) == "H":
            i += 1
        nr, nc = r + i * dr, c + i * dc
        if lv.eff(nr, nc, lever, fallen) == "#":
            return None
        info.append("spring")
    else:
        ahead = lv.eff(r + dr, c + dc, lever, fallen)
        if ahead == "H":
            if here != "J":
                return ("fall", None)
            nr, nc = r + 2 * dr, c + 2 * dc
            if lv.eff(nr, nc, lever, fallen) in ("#", "H"):
                return None
            info.append("jump")
        elif ahead == "#":
            return None
        else:
            nr, nc = r + dr, c + dc
            info.append("walk")
    # the tile you leave falls away
    fallen |= lv.bit(r, c)
    # landing chain
    t = lv.raw(nr, nc)
    if t == "T":
        lever ^= 1
        info.append("lever")
    if (nr, nc) in lv.partner:
        fallen |= lv.bit(nr, nc)   # you pass straight through the entry portal
        nr, nc = lv.partner[(nr, nc)]
        info.append("warp")
    won = lv.raw(nr, nc) == "E"
    return ("move", (nr, nc, lever, fallen), won, info)


def initial(lv):
    return (lv.start[0], lv.start[1], 0, 0)


# ---------------------------------------------------------------- search

def explore(lv, cap=400_000):
    """Full state graph from the start. Returns (states, edges, wins).
    edges[s] = list of (dir, next_state or 'WIN' or 'FALL' or None)."""
    s0 = initial(lv)
    seen = {s0}
    order = [s0]
    edges = {}
    q = collections.deque([s0])
    while q:
        s = q.popleft()
        out = []
        for d in "UDLR":
            res = step(lv, s, d)
            if res is None:
                out.append((d, None))
            elif res[0] == "fall":
                out.append((d, "FALL"))
            else:
                _, ns, won, _ = res
                if won:
                    out.append((d, "WIN"))
                else:
                    out.append((d, ns))
                    if ns not in seen:
                        if len(seen) >= cap:
                            raise RuntimeError("state cap hit")
                        seen.add(ns)
                        order.append(ns)
                        q.append(ns)
        edges[s] = out
    return order, edges


def solve(grid):
    """Shortest winning move string, or None."""
    lv = Level(grid)
    s0 = initial(lv)
    prev = {s0: None}
    q = collections.deque([s0])
    while q:
        s = q.popleft()
        for d in "UDLR":
            res = step(lv, s, d)
            if not res or res[0] == "fall":
                continue
            _, ns, won, _ = res
            if won:
                path = [d]
                while prev[s]:
                    s, pd = prev[s]
                    path.append(pd)
                return "".join(reversed(path))
            if ns not in prev:
                prev[ns] = (s, d)
                q.append(ns)
    return None


def stats(grid, cap=400_000):
    """Difficulty numbers for a level.

    states   : reachable states
    par      : shortest solution length
    dead     : reachable states you can never win from (you must undo)
    traps    : moves from a winnable state into a dead one (irreversible mistakes)
    path_traps: how many steps along the par path offer a trap move
    optimal  : how many different shortest solutions exist (fewer = tighter)
    """
    lv = Level(grid)
    order, edges = explore(lv, cap)
    # reverse reachability to WIN
    rev = collections.defaultdict(list)
    good = set()
    for s, out in edges.items():
        for _, ns in out:
            if ns == "WIN":
                good.add(s)
            elif isinstance(ns, tuple):
                rev[ns].append(s)
    q = collections.deque(good)
    while q:
        s = q.popleft()
        for p in rev[s]:
            if p not in good:
                good.add(p)
                q.append(p)
    s0 = initial(lv)
    if s0 not in good:
        return None
    dead = len(order) - len(good)
    traps = sum(1 for s in good for _, ns in edges[s]
                if isinstance(ns, tuple) and ns not in good)
    # BFS distances + shortest-path counts
    dist = {s0: 0}
    ways = {s0: 1}
    q = collections.deque([s0])
    best, best_ways = None, 0
    while q:
        s = q.popleft()
        if best is not None and dist[s] >= best:
            continue
        for _, ns in edges[s]:
            if ns == "WIN":
                L = dist[s] + 1
                if best is None or L < best:
                    best, best_ways = L, ways[s]
                elif L == best:
                    best_ways += ways[s]
            elif isinstance(ns, tuple):
                if ns not in dist:
                    dist[ns] = dist[s] + 1
                    ways[ns] = ways[s]
                    q.append(ns)
                elif dist[ns] == dist[s] + 1:
                    ways[ns] += ways[s]
    sol = solve(grid)
    st = s0
    path_traps = 0
    for d in sol:
        if any(isinstance(ns, tuple) and ns not in good for _, ns in edges[st]):
            path_traps += 1
        res = step(lv, st, d)
        st = res[1]
    return {"states": len(order), "par": best, "dead": dead, "traps": traps,
            "path_traps": path_traps, "optimal": best_ways, "sol": sol}


def check_grid(grid):
    """Structural problems with a grid, as a list of strings (empty = fine)."""
    errs = []
    if not grid:
        return ["empty grid"]
    w = len(grid[0])
    if any(len(r) != w for r in grid):
        errs.append("rows are not all the same width")
    if w > MAX_W or len(grid) > MAX_H:
        errs.append(f"grid {w}x{len(grid)} is bigger than {MAX_W}x{MAX_H}")
    flat = "".join(grid)
    bad = set(flat) - TILES
    if bad:
        errs.append(f"unknown tiles {sorted(bad)}")
    if flat.count("P") != 1:
        errs.append("needs exactly one P")
    if flat.count("E") != 1:
        errs.append("needs exactly one E")
    for a, b in (("1", "2"), ("3", "4")):
        if flat.count(a) > 1 or flat.count(b) > 1 or (a in flat) != (b in flat):
            errs.append(f"portals {a}/{b} must come as exactly one pair")
    return errs


# ---------------------------------------------------------------- main

if __name__ == "__main__":
    fix = "--fix" in sys.argv
    levels = load_levels()
    ok = True
    for n, lvl in enumerate(levels, 1):
        name = lvl.get("name", "?")
        errs = check_grid(lvl["grid"])
        if errs:
            print(f"L{n} {name}: BAD GRID - " + "; ".join(errs))
            ok = False
            continue
        s = stats(lvl["grid"])
        if s is None:
            print(f"L{n} {name}: UNSOLVABLE")
            ok = False
            continue
        print(f"L{n:<2} {name:<18} par={s['par']:<3} states={s['states']:<6} "
              f"traps={s['traps']:<4} on-path={s['path_traps']:<3} "
              f"optimal={s['optimal']:<4} {s['sol']}")
        if lvl.get("sol") != s["sol"]:
            if fix:
                lvl["sol"] = s["sol"]
            else:
                print(f"     stored sol {lvl.get('sol')!r} differs - run: python sim.py --fix")
                ok = False
    if fix:
        write_levels(levels)
        print("levels.js updated")
    sys.exit(0 if ok else 1)
