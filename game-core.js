const LEVELS = [
 { name: "First Steps",
  grid: [
   "##########",
   "#P.......#",
   "####.#####",
   "#.......E#",
   "##########"] },
 { name: "Getting Air",
  grid: [
   "##########",
   "#P....SHHE",
   "##########"] },
 { name: "Bridge Work",
  grid: [
   "##########",
   "#P.......#",
   "####.#####",
   "#T...B...#",
   "#####E####",
   "##########"] },
 { name: "Warp Zone",
  grid: [
   "##########",
   "#P...1...#",
   "##########",
   "#2......E#",
   "##########"] },
 { name: "Double Trouble",
  grid: [
   "#########",
   "#PJHJH.E#",
   "#########"] },
 { name: "Crusher Finale",
  grid: [
   "############",
   "#P..T.SHH.E#",
   "############"] },
];

// Runtime verification against BFS solver solutions (solutions.json)
const SOLUTIONS = {
 1: "RRRDDRRRR",
 2: "RRRRRR",
 3: "RRRDDLLLRRRRD",
 4: "RRRRRRRRRRR",
 5: "RRRR",
 6: "RRRRRRR",
};

const DIRS = { U: [-1, 0], D: [1, 0], L: [0, -1], R: [0, 1] };
const PAIRS = { 1: "2", 2: "1", 3: "4", 4: "3" };

function tileAt(grid, r, c) {
  if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length) return "#";
  return grid[r][c];
}

// mirrors sim.py land()
function land(grid, r, c, bridgesOpen) {
  const t = tileAt(grid, r, c);
  const won = t === "E";
  if (t === "T") bridgesOpen = true;
  if (PAIRS[t]) {
    const other = PAIRS[t];
    for (let rr = 0; rr < grid.length; rr++) {
      for (let cc = 0; cc < grid[rr].length; cc++) {
        if (grid[rr][cc] === other) return { r: rr, c: cc, bridgesOpen, won };
      }
    }
  }
  return { r, c, bridgesOpen, won };
}

// mirrors sim.py step()
function step(grid, r, c, bridgesOpen, dir) {
  const [dr, dc] = DIRS[dir];
  const t = tileAt(grid, r, c);
  if (t === "S") {
    let i = 1;
    while (true) {
      const rr = r + i * dr, cc = c + i * dc;
      const tt = tileAt(grid, rr, cc);
      if (tt === "H") { i++; continue; }
      if (tt === "#" || (tt === "B" && !bridgesOpen)) return null; // blocked launch
      return land(grid, rr, cc, bridgesOpen);
    }
  }
  const tr = r + dr, tc = c + dc;
  const tt = tileAt(grid, tr, tc);
  if (tt === "H") {
    if (t === "J") {
      const lr = r + 2 * dr, lc = c + 2 * dc;
      const lt = tileAt(grid, lr, lc);
      if (lt === "#" || lt === "H" || (lt === "B" && !bridgesOpen)) return null;
      return land(grid, lr, lc, bridgesOpen);
    }
    return { fall: true };
  }
  if (tt === "#" || (tt === "B" && !bridgesOpen)) return null;
  return land(grid, tr, tc, bridgesOpen);
}