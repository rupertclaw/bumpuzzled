// Bumpuzzled engine. Pure: no document, window or localStorage in here, so
// verify.py can run it in node. Rules must match sim.py exactly — verify.py
// runs both engines over every reachable state of every level to check.
//
// State = { r, c, lever, fallen }
//   lever  : 0/1, flipped each time you land on T
//   fallen : string of "0"/"1", one per cell (index r*width+c). Every tile you
//            step off falls away, so you can never retrace your steps.

const DIRS = { U: [-1, 0], D: [1, 0], L: [0, -1], R: [0, 1] };
const PAIRS = { 1: "2", 2: "1", 3: "4", 4: "3" };

function makeLevel(grid) {
  const lv = { g: grid, h: grid.length, w: grid[0].length, start: null, partner: {} };
  const spots = {};
  for (let r = 0; r < lv.h; r++) {
    for (let c = 0; c < lv.w; c++) {
      const ch = grid[r][c];
      if (ch === "P") lv.start = { r, c };
      else if (PAIRS[ch]) spots[ch] = [r, c];
    }
  }
  for (const ch in spots) {
    const other = spots[PAIRS[ch]];
    if (other) lv.partner[spots[ch].join(",")] = other;
  }
  return lv;
}

function initialState(lv) {
  return { r: lv.start.r, c: lv.start.c, lever: 0, fallen: "0".repeat(lv.h * lv.w) };
}

function rawTile(lv, r, c) {
  if (r < 0 || r >= lv.h || c < 0 || c >= lv.w) return "#";
  return lv.g[r][c];
}

function hasFallen(lv, fallen, r, c) {
  return fallen[r * lv.w + c] === "1";
}

function dropTile(lv, fallen, r, c) {
  const i = r * lv.w + c;
  return fallen.slice(0, i) + "1" + fallen.slice(i + 1);
}

// What the tile acts like right now: "#", "H", or its own char.
function effTile(lv, r, c, lever, fallen) {
  const t = rawTile(lv, r, c);
  if (t === "#") return t;
  if (hasFallen(lv, fallen, r, c)) return "H";
  if (t === "B") return lever ? "." : "H"; // B starts raised (a gap)
  if (t === "b") return lever ? "H" : "."; // b starts lowered (a bridge)
  return t;
}

// Returns:
//   null                                  blocked, nothing changes
//   { fall: true, r, c }                  stepped into the gap at (r, c)
//   { st, won, info, land }               moved; land = where you touched
//                                         down before any portal warp
// info lists what happened: walk | jump | spring, then lever | warp
function step(lv, st, dir) {
  const [dr, dc] = DIRS[dir];
  let { r, c, lever, fallen } = st;
  const here = effTile(lv, r, c, lever, fallen);
  const info = [];
  let nr, nc;
  if (here === "S") {
    let i = 1;
    while (effTile(lv, r + i * dr, c + i * dc, lever, fallen) === "H") i++;
    nr = r + i * dr; nc = c + i * dc;
    if (effTile(lv, nr, nc, lever, fallen) === "#") return null;
    info.push("spring");
  } else {
    const ar = r + dr, ac = c + dc;
    const ahead = effTile(lv, ar, ac, lever, fallen);
    if (ahead === "H") {
      if (here !== "J") return { fall: true, r: ar, c: ac };
      nr = r + 2 * dr; nc = c + 2 * dc;
      const lt = effTile(lv, nr, nc, lever, fallen);
      if (lt === "#" || lt === "H") return null;
      info.push("jump");
    } else if (ahead === "#") {
      return null;
    } else {
      nr = ar; nc = ac;
      info.push("walk");
    }
  }
  // the tile you leave falls away
  fallen = dropTile(lv, fallen, r, c);
  // landing chain
  const land = { r: nr, c: nc };
  if (rawTile(lv, nr, nc) === "T") { lever ^= 1; info.push("lever"); }
  const p = lv.partner[nr + "," + nc];
  if (p) {
    fallen = dropTile(lv, fallen, nr, nc); // you pass straight through the entry portal
    nr = p[0]; nc = p[1];
    info.push("warp");
  }
  const won = rawTile(lv, nr, nc) === "E";
  return { st: { r: nr, c: nc, lever, fallen }, won, info, land };
}

// Plays a move string from the start. Returns true if it ends on the exit.
function replay(grid, moves) {
  const lv = makeLevel(grid);
  let st = initialState(lv);
  for (const d of moves) {
    const res = step(lv, st, d);
    if (!res || res.fall) return false;
    if (res.won) return true;
    st = res.st;
  }
  return false;
}

if (typeof module !== "undefined") {
  module.exports = { DIRS, makeLevel, initialState, rawTile, effTile, hasFallen, step, replay };
}
