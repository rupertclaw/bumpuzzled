#!/usr/bin/env python3
"""Level generator (dev tool). Searches for boards that are hard but fair.

  python levelgen.py --size 6x7 --tiles "H:3 J:1 S:1 C:2" --need spring,crack --runs 8

It hill-climbs random boards to maximise a difficulty score built from
sim.stats(): how many steps on the par path offer an irreversible mistake,
how long par is, how few shortest solutions exist. Output is a shortlist of
grids to curate by hand — nothing here is shipped to players.
"""
import argparse, math, random
import sim

FLOOR_W, WALL_W = 6, 3


def parse_tiles(spec):
    out = {}
    for part in spec.split():
        ch, w = part.split(":")
        out[ch] = float(w)
    return out


def palette(weights):
    base = {".": FLOOR_W, "#": WALL_W}
    base.update(weights)   # "." or "#" in --tiles override the defaults
    return [(k, v) for k, v in base.items() if v > 0]


# Template mode: only these cells may change; everything else is the
# designer's and stays put. None = the whole board is free.
FREE = None
TEMPLATE = None
CAP = 6000   # skip boards with more reachable states than this (too slow / unreadable)


def random_grid(w, h, weights, rng):
    pool = palette(weights)
    tiles, ws = zip(*pool)
    if TEMPLATE:
        return [[rng.choices(tiles, ws)[0] if ch == "?" else ch for ch in row] for row in TEMPLATE]
    g = [[rng.choices(tiles, ws)[0] for _ in range(w)] for _ in range(h)]
    cells = [(r, c) for r in range(h) for c in range(w)]
    (pr, pc), (er, ec) = rng.sample(cells, 2)
    g[pr][pc], g[er][ec] = "P", "E"
    return g


def fix_portals(g, rng):
    """Keep at most one 1/2 pair: strip strays, or complete a lonely one."""
    flat = [ch for row in g for ch in row]
    for a, b in (("1", "2"), ("3", "4")):
        spots = [(r, c) for r, row in enumerate(g) for c, ch in enumerate(row) if ch in (a, b)]
        for r, c in spots:
            g[r][c] = "."
        if len(spots) >= 2:
            (r1, c1), (r2, c2) = rng.sample(spots, 2)
            g[r1][c1], g[r2][c2] = a, b
    return g


def mutate(g, weights, rng):
    g = [row[:] for row in g]
    h, w = len(g), len(g[0])
    pool = palette(weights)
    tiles, ws = zip(*pool)
    for _ in range(rng.choice((1, 1, 1, 2, 3))):
        if FREE:
            r, c = rng.choice(FREE)
            g[r][c] = rng.choices(tiles, ws)[0]
            continue
        r, c = rng.randrange(h), rng.randrange(w)
        if g[r][c] in "PE":
            # move P or E somewhere else instead
            r2, c2 = rng.randrange(h), rng.randrange(w)
            if g[r2][c2] not in "PE":
                g[r][c], g[r2][c2] = g[r2][c2], g[r][c]
            continue
        g[r][c] = rng.choices(tiles, ws)[0]
    return g if FREE else fix_portals(g, rng)


def actions_used(grid, sol):
    lv = sim.Level(grid)
    st = sim.initial(lv)
    used = set()
    for d in sol:
        _, st, _, info = sim.step(lv, st, d)
        used.update(info)
    return used


def score(grid, need, par_lo, par_hi):
    rows = ["".join(r) for r in grid]
    if sim.check_grid(rows):
        return -1e9, None
    try:
        s = sim.stats(rows, cap=CAP)
    except RuntimeError:
        return -1e9, None
    if s is None:
        return -1e9, None
    used = actions_used(rows, s["sol"])
    missing = len(need - used)
    # tiles that sit on the board but never matter make it noisy
    specials = sum(1 for ch in "".join(rows) if ch not in ".#PE")
    pe = [(r, c) for r, row in enumerate(rows) for c, ch in enumerate(row) if ch in "PE"]
    manhattan = abs(pe[0][0] - pe[1][0]) + abs(pe[0][1] - pe[1][1])
    par = s["par"]
    v = (s["path_traps"] * 4
         + min(par, par_hi) * 1.0
         - max(0, par_lo - par) * 3
         - max(0, par - par_hi) * 2
         + (par - manhattan) * 0.5
         + math.log2(s["states"]) * 0.5
         - math.log2(s["optimal"]) * 2
         - (s["safe"] - 1) * 60          # forgiving boards (many safe moves) feel easy
         - missing * 25
         - specials * 0.3)
    return v, s


def climb(w, h, weights, need, par_lo, par_hi, iters, rng):
    g = random_grid(w, h, weights, rng)
    best, bs = score(g, need, par_lo, par_hi)
    cur, cs = g, best
    top = g
    T = 3.0
    for i in range(iters):
        ng = mutate(cur, weights, rng)
        v, _ = score(ng, need, par_lo, par_hi)
        if v >= cs or rng.random() < math.exp((v - cs) / max(T, 1e-3)):
            cur, cs = ng, v
            if v > best:
                best, top = v, ng
        T *= 0.997
    return best, clean(["".join(r) for r in top], need, par_lo, par_hi, rng)


def clean(rows, need, par_lo, par_hi, rng):
    """Strip clutter: turn each tile into plain floor (or wall) whenever that
    doesn't make the puzzle easier. What's left is the part that matters."""
    g = [list(r) for r in rows]
    base, _ = score(g, need, par_lo, par_hi)
    changed = True
    while changed:
        changed = False
        cells = [(r, c) for r in range(len(g)) for c in range(len(g[0]))
                 if g[r][c] not in ".PE" and (FREE is None or (r, c) in FREE)]
        rng.shuffle(cells)
        for r, c in cells:
            old = g[r][c]
            if old in ".PE":
                continue
            for repl in (".", "#") if old != "#" else (".",):
                t = [row[:] for row in g]
                t[r][c] = repl
                if old in "1234" and not FREE:
                    t = fix_portals(t, rng)
                v, _ = score(t, need, par_lo, par_hi)
                if v >= base - 0.5:
                    g, base, changed = t, max(v, base), True
                    break
    return ["".join(r) for r in g]


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--size", default="6x7", help="WxH")
    ap.add_argument("--tiles", default="H:3 J:1 S:1", help='weights, e.g. "H:3 C:2 S:1"')
    ap.add_argument("--need", default="", help="actions the solution must use: jump,spring,crack,lever,warp")
    ap.add_argument("--par", default="8-20")
    ap.add_argument("--runs", type=int, default=6)
    ap.add_argument("--iters", type=int, default=1500)
    ap.add_argument("--seed", type=int, default=None)
    ap.add_argument("--template", help="grid file; ? cells are free, the rest is fixed")
    ap.add_argument("--cap", type=int, default=6000, help="max reachable states per board")
    a = ap.parse_args()
    CAP = a.cap
    w, h = map(int, a.size.lower().split("x"))
    if a.template:
        TEMPLATE = [l.replace(" ", "") for l in open(a.template).read().splitlines() if l.strip()]
        FREE = [(r, c) for r, row in enumerate(TEMPLATE) for c, ch in enumerate(row) if ch == "?"]
        h, w = len(TEMPLATE), len(TEMPLATE[0])
    lo, hi = map(int, a.par.split("-"))
    need = set(x for x in a.need.split(",") if x)
    rng = random.Random(a.seed)
    results = []
    for run in range(a.runs):
        v, g = climb(w, h, parse_tiles(a.tiles), need, lo, hi, a.iters, rng)
        if v > -1e8:
            results.append((v, g))
    results.sort(reverse=True)
    for v, g in results:
        s = sim.stats(g)
        print(f"score={v:.1f} par={s['par']} traps-on-path={s['path_traps']} "
              f"optimal={s['optimal']} safe={s['safe']:.2f} states={s['states']} sol={s['sol']}")
        print("\n".join("   " + r for r in g))
        print()
