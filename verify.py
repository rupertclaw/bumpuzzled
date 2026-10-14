#!/usr/bin/env python3
"""Tile Rush cross-verification.

Checks:
  1. sim.py's BFS results match solutions.json (fresh solve vs stored).
  2. Game engine (game-core.js) has IDENTICAL LEVELS to sim.py LEVELS.
  3. index.html's SOLUTIONS par strings match solutions.json.
  4. Each solution replays to a WIN through game-core.js step() (via node).
Exit 0 = all good. Exit 1 = drift anywhere.
"""
import json, subprocess, sys, re, pathlib

HERE = pathlib.Path(__file__).parent
sys.path.insert(0, str(HERE))
ok = True

# --- 1) fresh solve
import sim, importlib
importlib.reload(sim)
fresh = {}
for n, g in sim.LEVELS.items():
    path = sim.solve(g)
    assert path is not None, f"L{n} UNSOLVABLE in sim.py"
    fresh[n] = "".join(path)
stored = {int(k): "".join(v) for k, v in
          json.load(open(HERE / "solutions.json")).items()}
lvl_sim = sorted(sim.LEVELS)
lvl_stored = sorted(stored)
if lvl_sim != lvl_stored:
    print(f"FAIL: level number set mismatch sim={lvl_sim} stored={lvl_stored}")
    ok = False
else:
    for n in lvl_sim:
        if fresh[n] != stored.get(n):
            print(f"FAIL: L{n} par drift fresh={fresh[n]} stored={stored.get(n)}")
            ok = False
        else:
            print(f"L{n}: fresh BFS == solutions.json  ({fresh[n]})")

# --- 2) + 4) node-based engine checks
node_code = r'''
const fs = require("fs");
const node_args = process.argv;
const core = fs.readFileSync(node_args[2], "utf8");
(0, eval)(core.replace(/^const /gm, "var "));
const sols = JSON.parse(fs.readFileSync(node_args[3], "utf8"));
const pySols0 = JSON.parse(fs.readFileSync(node_args[4], "utf8"));
const pyLevels = pySols0.grids;
const pySols = pySols0.solutions;
let allOk = true;
if (LEVELS.length !== Object.keys(pySols).length) {
  console.log(`FAIL: js LEVELS count ${LEVELS.length} != solutions.json ${Object.keys(pySols).length}`);
  allOk = false;
}
for (let i = 0; i < LEVELS.length; i++) {
  const g = LEVELS[i].grid;
  // structural comparison vs python export
  const py = pyLevels[String(i + 1)];
  if (JSON.stringify(g) !== JSON.stringify(py)) {
    console.log(`FAIL: L${i+1} grid drift between game-core.js and sim.py`);
    allOk = false;
  }
  let p = null;
  for (let r = 0; r < g.length; r++)
    for (let c = 0; c < g[r].length; c++)
      if (g[r][c] === "P") p = { r, c };
  const solStr = (sols[String(i+1)] || []).join("");
  // replay through the real engine
  let br = false, won = false, used = 0;
  for (const d of solStr) {
    const res = step(g.map(r=>r.split("")), p.r, p.c, br, d);
    if (!res || res.fall) { console.log(`FAIL: L${i+1} replay dies at move ${used} (${d})`); allOk = false; break; }
    p = { r: res.r, c: res.c }; br = res.bridgesOpen; used++;
    if (res.won) { won = true; break; }
  }
  if (!won) { console.log(`FAIL: L${i+1} replay does not WIN`); allOk = false; }
  else console.log(`L${i+1} engine replay: WIN in ${used}`);
}
console.log(allOk ? "ENGINE OK" : "ENGINE FAIL");
process.exit(allOk ? 0 : 1);
'''

# python level grids + fresh solutions exported as JSON for the node structural check
py_grids = {str(n): sim.LEVELS[n] for n in sim.LEVELS}
(HERE / "_verify_pygrids.json").write_text(json.dumps({
    "grids": py_grids,
    "solutions": {str(n): list(fresh[n]) for n in fresh},
}))
tmp = HERE / "_verify_engine.js"
tmp.write_text(node_code)
r = subprocess.run(["node", str(tmp), str(HERE / "game-core.js"),
                    str(HERE / "solutions.json"),
                    str(HERE / "_verify_pygrids.json")],
                   capture_output=True, text=True, timeout=60)
print(r.stdout.strip())
if r.returncode != 0:
    print("STDERR:", r.stderr)
    ok = False

# --- 3) game-core.js SOLUTIONS par strings match solutions.json
# (SOLUTIONS lives in game-core.js; index.html consumes it. Do NOT add a second copy.)
core_txt = (HERE / "game-core.js").read_text()
m = re.search(r"const\s+SOLUTIONS\s*=\s*\{(.*?)\};", core_txt, re.S)
if not m:
    print("FAIL: SOLUTIONS block not found in game-core.js")
    ok = False
else:
    pairs = dict(re.findall(r'(\d+):\s*"([URDL]+)"', m.group(1)))
    for n in lvl_sim:
        htmlsol = pairs.get(str(n))
        if htmlsol is None:
            print(f"FAIL: L{n} missing from game-core.js SOLUTIONS")
            ok = False
        elif htmlsol != fresh[n]:
            print(f"FAIL: L{n} game-core.js SOLUTIONS drift: '{htmlsol}' vs '{fresh[n]}'")
            ok = False
        else:
            print(f"L{n}: game-core.js SOLUTIONS matches ({htmlsol})")

# cleanup temp files
tmp.unlink(missing_ok=True)
(HERE / "_verify_pygrids.json").unlink(missing_ok=True)

print("\n" + ("ALL CHECKS PASS" if ok else "*** DRIFT DETECTED — DO NOT SHIP ***"))
sys.exit(0 if ok else 1)