#!/usr/bin/env python3
"""Bumpuzzled ship check. Run before every push:  python verify.py

  1. Every level in levels.js is a valid grid and solvable.
  2. Each level's stored "sol" is a shortest solution (BFS par).
  3. The JS engine (game-core.js) and the Python engine (sim.py) agree on
     every move from the reachable states of every level (up to 20k states
     each) plus 300 random boards. This is what catches rule drift.
  4. Each stored solution wins when replayed through the JS engine.
  5. sw.js caches every shipped file, and its CACHE version was bumped if
     any shipped file changed since origin/main (else returning players
     keep running old code).

Exit 0 = safe to ship. Needs node on PATH.
"""
import json, subprocess, sys, re, pathlib, tempfile, os
import sim

HERE = pathlib.Path(__file__).parent
SHIPPED = ["index.html", "game-core.js", "levels.js", "manifest.webmanifest", "icon.svg",
           "icon-192.png", "icon-512.png", "icon-maskable-512.png", "apple-touch-icon.png"]
ok = True


def fail(msg):
    global ok
    ok = False
    print("FAIL:", msg)


levels = sim.load_levels()
queries = []   # [grid index, r, c, lever, fallen-as-"0101..", dir]
expected = []


def states_upto(lv, limit):
    """Reachable states in BFS order, stopping after `limit` of them."""
    import collections
    s0 = sim.initial(lv)
    seen, order, q = {s0}, [s0], collections.deque([s0])
    while q and len(order) < limit:
        s = q.popleft()
        for d in "UDLR":
            res = sim.step(lv, s, d)
            if res and res[0] == "move" and not res[2] and res[1] not in seen:
                seen.add(res[1]); order.append(res[1]); q.append(res[1])
    return order[:limit]


def fallen_str(lv, fallen):
    return "".join("1" if fallen >> i & 1 else "0" for i in range(lv.h * lv.w))


def add_queries(gi, lv, order):
    for s in order:
        r, c, lever, fallen = s
        for d in "UDLR":
            res = sim.step(lv, s, d)
            queries.append([gi, r, c, lever, fallen_str(lv, fallen), d])
            if res is None:
                expected.append(None)
            elif res[0] == "fall":
                expected.append("fall")
            else:
                _, (nr, nc, nl, nf), won, info = res
                expected.append([[nr, nc, nl, fallen_str(lv, nf)], won, info])


# --- 1, 2: grids, solvability, par
for n, lvl in enumerate(levels, 1):
    g = lvl["grid"]
    errs = sim.check_grid(g)
    if errs:
        fail(f"L{n}: " + "; ".join(errs))
        continue
    fresh = sim.solve(g)
    if fresh is None:
        fail(f"L{n}: unsolvable")
        continue
    stored = lvl.get("sol", "")
    if len(stored) != len(fresh):
        fail(f"L{n}: stored sol is {len(stored)} moves, BFS par is {len(fresh)} - run python sim.py --fix")
    lv = sim.Level(g)
    st = sim.initial(lv)
    won = False
    for d in stored:
        res = sim.step(lv, st, d)
        if not res or res[0] == "fall":
            break
        if res[2]:
            won = True
            break
        st = res[1]
    if not won:
        fail(f"L{n}: stored sol does not win in sim.py")
    order = states_upto(lv, 20000)
    add_queries(n - 1, lv, order)
    print(f"L{n:<2} {lvl['name']:<18} par {len(fresh):<3} ({len(order)} states engine-checked)")

# Real levels don't exercise every rule combination, so also compare the
# engines on random boards that use every tile (fixed seed = repeatable).
import random
rng = random.Random(1234)
fuzz = []
while len(fuzz) < 300:
    w, h = rng.randint(3, 7), rng.randint(3, 7)
    g = [[rng.choice("..##HHJJSSTBb") for _ in range(w)] for _ in range(h)]
    cells = rng.sample([(r, c) for r in range(h) for c in range(w)], 4)
    for (r, c), ch in zip(cells, "PE12"):
        g[r][c] = ch
    fuzz.append(["".join(row) for row in g])
for i, g in enumerate(fuzz):
    lv = sim.Level(g)
    add_queries(len(levels) + i, lv, states_upto(lv, 400))

# --- 3, 4: node runs the real game-core.js over the same queries
node_code = r"""
const core = require(process.argv[2]);
const levels = require(process.argv[3]);
const { grids, q } = JSON.parse(require("fs").readFileSync(process.argv[4], "utf8"));
const lvs = grids.map(g => core.makeLevel(g));
const out = q.map(([li, r, c, lever, fallen, d]) => {
  const res = core.step(lvs[li], { r, c, lever, fallen }, d);
  if (!res) return null;
  if (res.fall) return "fall";
  return [[res.st.r, res.st.c, res.st.lever, res.st.fallen], res.won, res.info];
});
const replays = levels.map(l => core.replay(l.grid, l.sol || ""));
console.log(JSON.stringify({ out, replays }));
"""
with tempfile.TemporaryDirectory() as td:
    td = pathlib.Path(td)
    grids = [l["grid"] for l in levels] + fuzz
    (td / "q.json").write_text(json.dumps({"grids": grids, "q": queries}))
    (td / "run.js").write_text(node_code)
    r = subprocess.run(["node", str(td / "run.js"), str(HERE / "game-core.js"),
                        str(HERE / "levels.js"), str(td / "q.json")],
                       capture_output=True, text=True, timeout=300)
if r.returncode != 0:
    fail("node crashed:\n" + r.stderr)
else:
    res = json.loads(r.stdout)
    mismatches = 0
    for q, want, got in zip(queries, expected, res["out"]):
        if want != got:
            mismatches += 1
            if mismatches <= 5:
                where = (f"L{q[0]+1}" if q[0] < len(levels)
                         else "random board " + "/".join(fuzz[q[0] - len(levels)]))
                fail(f"engines disagree on {where} state {q[1:5]} move {q[5]}: "
                     f"python={want} js={got}")
    if mismatches > 5:
        fail(f"...and {mismatches - 5} more engine disagreements")
    if not mismatches:
        print(f"engines agree on all {len(queries)} moves (levels + {len(fuzz)} random boards)")
    for n, w in enumerate(res["replays"], 1):
        if not w:
            fail(f"L{n}: stored sol does not win in game-core.js")

# --- 5: service worker
sw = (HERE / "sw.js").read_text()
for f in SHIPPED:
    if f"./{f}" not in sw:
        fail(f"sw.js ASSETS is missing ./{f}")
cache_re = r'CACHE\s*=\s*"([^"]+)"'
cur = re.search(cache_re, sw).group(1)
try:
    changed = subprocess.run(["git", "diff", "--name-only", "origin/main", "--"] + SHIPPED,
                             capture_output=True, text=True, cwd=HERE, check=True).stdout.split()
    remote_sw = subprocess.run(["git", "show", "origin/main:sw.js"], capture_output=True,
                               text=True, cwd=HERE, check=True).stdout
    old = re.search(cache_re, remote_sw).group(1)
    if changed and cur == old:
        fail(f"{', '.join(changed)} changed since origin/main but sw.js CACHE is still "
             f'"{cur}" - bump it')
    else:
        print(f'sw.js CACHE "{cur}" ok')
except (subprocess.CalledProcessError, AttributeError, FileNotFoundError):
    print("note: couldn't compare sw.js with origin/main (no git remote?) - check CACHE by hand")

print("\n" + ("ALL CHECKS PASS" if ok else "*** PROBLEMS FOUND - DO NOT SHIP ***"))
sys.exit(0 if ok else 1)
