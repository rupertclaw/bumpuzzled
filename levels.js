// Bumpuzzled levels — the ONLY copy of level data.
// After editing: python sim.py --fix   (writes each "sol"), then python verify.py
// Tiles: # wall  . floor  P start  E exit  H hole  J jump pad  S spring
//        C cracked floor  T lever  B bridge (starts up)  b bridge (starts down)
//        1/2 and 3/4 portal pairs
const LEVELS = /*BEGIN*/[
 {
  "section": "Learning the ropes",
  "name": "First Steps",
  "hint": "Tiles fall away behind you. Look before you leap.",
  "grid": [
   ".#..",
   "....",
   "P.#.",
   ".#..",
   "#E.."
  ],
  "sol": "URRRDDDLL"
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
   ".J.J.",
   ".H.HE",
   "..#.#",
   "JH.H.",
   ".HJJP"
  ],
  "sol": "LLLUUUURRRRD"
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
  "hint": "Springs fly over every gap — including the ones you leave behind.",
  "grid": [
   "..#..",
   "H..S.",
   "SH..S",
   "..#.P",
   "E#..."
  ],
  "sol": "LULURRDLDD"
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
  "hint": "Every lever swings every bridge.",
  "grid": [
   ".Tb..",
   "..bTP",
   ".##.#",
   "..bT#",
   ".#.BE"
  ],
  "sol": "ULLDLLDDRRRDR"
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
   "..2.1",
   ".#..#",
   ".#...",
   "..#P.",
   "E#..#"
  ],
  "sol": "UUURLLDDDD"
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
 },
 {
  "section": "Expert",
  "name": "Deep End",
  "hint": "Welcome to Expert. Springs, bridges, and nowhere to hide.",
  "grid": [
   ".#.JH.",
   "TH.HS.",
   ".B..B.",
   "S...P.",
   ".##SHS",
   "#.#S..",
   "E.SB.."
  ],
  "sol": "LLUUURRDLLDRDLRDLDDLLL"
 },
 {
  "name": "Spring Fever",
  "hint": "Count the gaps before you jump.",
  "grid": [
   "S..P..",
   ".#.##.",
   ".S#..#",
   ".HJ.#.",
   "SH..H.",
   "...#ES"
  ],
  "sol": "LLLDDRDRURULLDRDL"
 },
 {
  "name": "Hopscotch",
  "hint": "Levers, pads and bridges. Choose your order.",
  "grid": [
   "E..#..",
   "#BHJ..",
   "#.#b#J",
   ".#.BT.",
   "T...b.",
   "PTbT#."
  ],
  "sol": "URDRURRURUULLLUL"
 },
 {
  "name": "Two Doors",
  "hint": "One portal pair, one shot.",
  "grid": [
   "E..S.S",
   "3..H.S",
   "S##.#S",
   "..#..S",
   "P.HJ#H",
   ".#..4."
  ],
  "sol": "UUULUURRUUULLLLL"
 },
 {
  "name": "Ricochet",
  "hint": "The long way is the only way.",
  "grid": [
   "#E.S#.",
   ".#..J.",
   "P.#.H.",
   "...#..",
   ".#.#..",
   "#..JHS"
  ],
  "sol": "DRRDDRRUUUULLULL"
 },
 {
  "name": "Crossed Wires",
  "hint": "Two portal pairs. Which first?",
  "grid": [
   "2...#.",
   "1.S#P.",
   ".#..3.",
   "JH.#..",
   ".E#.HS",
   ".#..4#"
  ],
  "sol": "RDDDLDRLLUULLDDDR"
 },
 {
  "name": "Tollgate",
  "hint": "Pay the lever a visit.",
  "grid": [
   "..SS.E",
   "..##.#",
   "#B#.#.",
   "..#T..",
   ".....#",
   "P....."
  ],
  "sol": "RRRRUULDLLUUUURRRR"
 },
 {
  "name": "Gatekeeper",
  "hint": "Two levers, two bridges, one route.",
  "grid": [
   "EJ.J..",
   "#H.#b#",
   "..#..T",
   ".T.#B.",
   "B.JP.#",
   "......"
  ],
  "sol": "DLLUURDRURULUULLLL"
 },
 {
  "name": "Slingshot",
  "hint": "Springs, pads and a portal. Waste none of them.",
  "grid": [
   "..J.#E",
   "S.H2#S",
   ".S1H.J",
   "S.#..H",
   "H.SHH.",
   ".HS..P"
  ],
  "sol": "LLLULULUUURRRDLRRUU"
 },
 {
  "name": "Switchyard",
  "hint": "The lever is on the way. Or is it?",
  "grid": [
   ".#....",
   ".1TJ.2",
   "..#..P",
   "J#.#..",
   "S...#.",
   "#.##E#",
   "...B.."
  ],
  "sol": "LUULLDRRDLDDRDDRRRU"
 },
 {
  "name": "Flip Side",
  "hint": "Too many levers? Every flip counts.",
  "grid": [
   "B.TB..",
   "E#J..#",
   "#.#.B.",
   ".#...T",
   ".T...T",
   "PB#.JJ"
  ],
  "sol": "URRRRRDLULUULULLD"
 },
 {
  "name": "Spring Trap",
  "hint": "Three springs in a row. Only one is your friend.",
  "grid": [
   "SSS##E",
   "T....B",
   ".B....",
   "#.b#..",
   "S..H.P",
   ".#.#S."
  ],
  "sol": "ULULLULLURRDLLRDURU"
 },
 {
  "name": "Labyrinth",
  "hint": "Plan the whole route before your first step.",
  "grid": [
   ".#..#E",
   "S.H.SS",
   ".B.#HH",
   ".##...",
   "...PT#",
   "S..BT.",
   "J.S..."
  ],
  "sol": "LDLLRDLLLLUUURULRRRU"
 },
 {
  "name": "Domino",
  "hint": "Every move sets up the next.",
  "grid": [
   ".#..#E",
   "...B..",
   "..PJ##",
   "#.J..S",
   ".#.BJ.",
   "S.HSBS",
   ".T.#.."
  ],
  "sol": "RDRRDDLLDLURULLUURRRU"
 },
 {
  "name": "Gauntlet",
  "hint": "Almost there. Almost.",
  "grid": [
   "E#S...",
   "H#T#.T",
   "....H.",
   "B..#..",
   "S...S.",
   ".PHS.S"
  ],
  "sol": "URRDRRUULDUULLDDLLDDU"
 },
 {
  "name": "Bumpuzzler",
  "hint": "The final boss. Good luck.",
  "grid": [
   ".#.1SP",
   "...#..",
   ".2.b..",
   "J.##.B",
   "B...#S",
   "S.#.#E",
   "..T..#"
  ],
  "sol": "DLDLLULLDDDDRRRUULLUURDRDD"
 }
]/*END*/;

if (typeof module !== "undefined") module.exports = LEVELS;
