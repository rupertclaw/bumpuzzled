// Stepfall levels — the ONLY copy of level data.
// After editing: python sim.py --fix   (writes each "sol"), then python verify.py
// Tiles: # wall  . floor  P start  E exit  H hole  J jump pad  S spring
//        C cracked floor  T lever  B bridge (starts up)  b bridge (starts down)
//        1/2 and 3/4 portal pairs
const LEVELS = /*BEGIN*/[
 {
  "name": "First Steps",
  "hint": "Tiles fall away behind you. Pick your path.",
  "grid": [
   "P..#",
   ".#..",
   "...#",
   "#..E"
  ],
  "sol": "DDRDRR"
 },
 {
  "name": "Dead Ends",
  "hint": "Don't paint yourself into a corner.",
  "grid": [
   "....E",
   "..#.#",
   "#..#.",
   "..#.P",
   "....."
  ],
  "sol": "DLLLUUUURRR"
 },
 {
  "name": "Hop",
  "hint": "Jump pads clear one gap. Not two.",
  "grid": [
   "P.JH.",
   "##.#.",
   "EHJ.."
  ],
  "sol": "RRDDL"
 },
 {
  "name": "Leapfrog",
  "hint": "Every pad works once.",
  "grid": [
   ".HJ.P",
   "#.H#.",
   "....#",
   ".J#HE",
   "..JJ."
  ],
  "sol": "LLDLDDRRRU"
 },
 {
  "name": "Boing",
  "hint": "Take the long way to the spring. Every tile you leave becomes a gap it can fly over.",
  "grid": [
   "EH..S",
   "##.#.",
   "P...."
  ],
  "sol": "RRUURRL"
 },
 {
  "name": "Spring Loaded",
  "hint": "A spring only lands on a tile that's still standing.",
  "grid": [
   ".HSSS",
   "...#.",
   "S#.HS",
   "..#E.",
   "..P#."
  ],
  "sol": "LULUURRURRDDDL"
 },
 {
  "name": "Pogo",
  "hint": "Springs and pads, one shot each.",
  "grid": [
   "..SS.",
   ".P#..",
   "#.HS#",
   "E#...",
   "..#..",
   "SHJ.."
  ],
  "sol": "URRDDDDDLLUU"
 },
 {
  "name": "Lever",
  "hint": "Something has to bring that bridge across.",
  "grid": [
   "P.T",
   "##.",
   "EB."
  ],
  "sol": "RRDDLL"
 },
 {
  "name": "Switchback",
  "hint": "Two levers. Count your flips.",
  "grid": [
   "P.#E#",
   "..B..",
   ".BT##",
   "..T#.",
   "....."
  ],
  "sol": "DDDDRRULUURRU"
 },
 {
  "name": "Drawbridge",
  "hint": "A bridge across stops a spring. A hanging one doesn't.",
  "grid": [
   "..B..",
   ".TT.#",
   ".....",
   "#.S##",
   "P..#E",
   ".B.BS"
  ],
  "sol": "RUUUURRDDLDDDRRU"
 },
 {
  "name": "Warp",
  "hint": "Portals take you somewhere new — once.",
  "grid": [
   "P.1#.E",
   "####.#",
   "H..#2."
  ],
  "sol": "RRUUR"
 },
 {
  "name": "Wormhole",
  "hint": "Where you come out matters.",
  "grid": [
   "E..#.",
   "#JH.#",
   "..#P.",
   "#.1..",
   ".#.#J",
   ".2..."
  ],
  "sol": "DRDDLLLLUUUL"
 },
 {
  "name": "Long Way Round",
  "hint": "The short way isn't.",
  "grid": [
   "...#E",
   "...#.",
   "SH.PH",
   "SH.#J",
   "SH#..",
   "SS..."
  ],
  "sol": "LULLDDDDRRRURUUU"
 },
 {
  "name": "Relay",
  "hint": "Use everything. Waste nothing.",
  "grid": [
   "#S.SP",
   ".....",
   "#1JH.",
   "....#",
   "#H...",
   "E.##2"
  ],
  "sol": "DLUDDRDDRUULUDL"
 },
 {
  "name": "Clockwork",
  "hint": "Two levers, one bridge, one route.",
  "grid": [
   ".P...S",
   "JHB.#.",
   ".#E#.b",
   "J##.#.",
   "..T...",
   ".#..T."
  ],
  "sol": "RRRRDDDDLLLLLUUURD"
 },
 {
  "name": "Crusher",
  "hint": "Everything you've learned.",
  "grid": [
   "..#.#E",
   ".H..#B",
   ".S.J#.",
   "T.....",
   "B##S..",
   ".PJ..."
  ],
  "sol": "RRRUULLLLURRRDRUUUU"
 }
]/*END*/;

if (typeof module !== "undefined") module.exports = LEVELS;
