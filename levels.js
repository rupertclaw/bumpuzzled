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
  "hint": "Springs everywhere. Every launch is a one-way ticket.",
  "grid": [
   ".#SP..",
   ".S.H.#",
   "S#.#H.",
   "..HES.",
   "SHH##.",
   "SJS..."
  ],
  "sol": "LDLLDDDDRRRRRUULL"
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
 },
 {
  "section": "Master",
  "name": "Pinball",
  "hint": "Springs, pads and a portal. Every one is single use.",
  "grid": [
   "..#..#",
   "..#.#E",
   "SJH.HJ",
   "..1..H",
   ".2J.P.",
   "......"
  ],
  "sol": "DLLLULURDDLLUURU"
 },
 {
  "name": "Twin Gates",
  "hint": "Two portal pairs. One order works.",
  "grid": [
   "SHJ..#",
   "E##SH.",
   "#.4J#3",
   "...#J.",
   ".S.H..",
   "P.#..#"
  ],
  "sol": "UURRDLRURURUULLD"
 },
 {
  "name": "Leverage",
  "hint": "The lever's on the way. Is the bridge?",
  "grid": [
   "..#TBJ",
   "....#P",
   "T...#.",
   ".HSBS#",
   "#.#J..",
   "Eb.S#."
  ],
  "sol": "ULDLLLDRRDRDLDLLL"
 },
 {
  "name": "Tightrope",
  "hint": "One wrong step and the floor is gone.",
  "grid": [
   "STJb..",
   ".T##..",
   "...P.#",
   ".#....",
   "#EH#..",
   "..JSB."
  ],
  "sol": "LLLUURRRDDDDDLLLU"
 },
 {
  "name": "Frog Pond",
  "hint": "Pads everywhere. Pick the wrong one and you're sunk.",
  "grid": [
   "P.....",
   ".#.HJ#",
   "#.H...",
   "#.JHJ#",
   "..##..",
   "#.#E#.",
   "..J..#"
  ],
  "sol": "RRRRDDDLLDDDRRU"
 },
 {
  "name": "Juggler",
  "hint": "Levers, springs and pads, all at once.",
  "grid": [
   "...Sb.",
   "#E##S#",
   ".HJH.T",
   "T.T.H.",
   "T....P",
   "T..#.."
  ],
  "sol": "LLLDLLUURRURUULLLD"
 },
 {
  "name": "Trampoline Park",
  "hint": "Bigger board, bigger bounces.",
  "grid": [
   "..#.#..",
   ".P#EHJ#",
   "J#.#.H.",
   ".#.#H..",
   "S.....J",
   "..#.SHS",
   "..#..S#"
  ],
  "sol": "LDDDRRRRRURDDLDRUL"
 },
 {
  "name": "Detour",
  "hint": "The direct route is a trap.",
  "grid": [
   ".#.HJT",
   ".S..2.",
   "..#H..",
   "#B.S#.",
   ".b1S.#",
   "T.#B..",
   "..P.#E"
  ],
  "sol": "LUURRULLDLDDRRDDRRD"
 },
 {
  "name": "Rabbit Hole",
  "hint": "Where does that portal really lead?",
  "grid": [
   "E#.#..",
   "BSH.#.",
   "PSJ...",
   "..##T.",
   "#.2.Tb",
   "..1#..",
   ".TbJ.."
  ],
  "sol": "DRDRDRRURUULULLLULU"
 },
 {
  "name": "Bounce House",
  "hint": "Springs land on the first tile still standing. Plan for it.",
  "grid": [
   "ES....S",
   "#H.#.#S",
   "..#.#.H",
   "..P.#..",
   ".#..#..",
   "..S.H.S",
   "..#..#."
  ],
  "sol": "DRDLRUURDDUULLLLLL"
 },
 {
  "name": "Long Shot",
  "hint": "Fly far, land right.",
  "grid": [
   "SH..S.",
   ".#...#",
   "SH.#P.",
   ".S2##.",
   ".H...H",
   "#.S.H.",
   ".1.#ES"
  ],
  "sol": "ULLURRLDDDRDDDRDLRDL"
 },
 {
  "name": "Moat",
  "hint": "Bridges across, bridges down. Pick your moment.",
  "grid": [
   "...HSS",
   "P.#..T",
   "...B.b",
   "TT#HB.",
   "..#Sb#",
   ".#E.#.",
   "S.#..."
  ],
  "sol": "DDDDDURDDRRRURULDLDL"
 },
 {
  "name": "Crossroads",
  "hint": "Every path crosses every other. Only once each.",
  "grid": [
   "...#.P",
   "..#.#.",
   "#.#...",
   "S.J.bT",
   ".S##T.",
   ".HS.Bb",
   "..#.#E"
  ],
  "sol": "DDLLDLRDDLLLURULRDDD"
 },
 {
  "name": "Skipping Stones",
  "hint": "Hop, fly, hop.",
  "grid": [
   ".#...#.",
   ".S#..S.",
   "JH.#JH.",
   "EH..H..",
   "#SH.S#H",
   "..JS#..",
   "...#P.S"
  ],
  "sol": "RURDUUULLDDLDLLUULDD"
 },
 {
  "name": "Gearbox",
  "hint": "Two levers, many moving parts.",
  "grid": [
   ".#E#.PJ",
   ".#..##.",
   "..b#...",
   ".S#..#.",
   "#.TB.J#",
   "...J#H.",
   "..#SJ.."
  ],
  "sol": "RDDLLDDRDLLULLUUURUU"
 },
 {
  "name": "Master Key",
  "hint": "Everything from this pack in one board.",
  "grid": [
   "....T.",
   "..BSbH",
   "P.J#JJ",
   ".#S.#.",
   "#..bT.",
   ".#H...",
   "EH...S"
  ],
  "sol": "RRURDRDRDDDLLULUDRRRL"
 },
 {
  "section": "Grandmaster",
  "name": "Floodgates",
  "hint": "Open one gate, close another.",
  "grid": [
   "T..##..",
   "JB...#.",
   "H.B.HE.",
   "..#.Jb#",
   "#JbB#..",
   ".....#.",
   ".P..T.."
  ],
  "sol": "RRRULLLUUUUULDRRDDRRU"
 },
 {
  "name": "Catapult",
  "hint": "The spring knows the way. Do you?",
  "grid": [
   "..#.#..",
   "..#..#P",
   "EB.....",
   "#S#b..S",
   ".B..S#T",
   ".b..#..",
   "..b.SH."
  ],
  "sol": "DLLLDDDDRRUUULLDLLUUL"
 },
 {
  "name": "Ferry",
  "hint": "Cross the water at the right time.",
  "grid": [
   "..T.JB#",
   "..B.#.E",
   "B#.B.#.",
   "..HJ.##",
   ".T.#b..",
   "..#PT.#",
   "...#T.."
  ],
  "sol": "RDRUULULLDLUUURRRURRDR"
 },
 {
  "name": "Stepping Stones",
  "hint": "Count every gap before you jump.",
  "grid": [
   "S.H.JH.",
   "..#.H..",
   "#P.#.S.",
   ".##.#..",
   ".HS.SH.",
   "J.##.H.",
   "S.E#.S#"
  ],
  "sol": "UULRRRDDDLUDLUULLLDDRR"
 },
 {
  "name": "Undertow",
  "hint": "The current pulls the wrong way.",
  "grid": [
   ".S.H.#.",
   "..T#B.E",
   ".#B.#.#",
   "H...##.",
   ".H.TS..",
   "......#",
   "ST..#P."
  ],
  "sol": "ULLLURRLDRDLUURRULRDRR"
 },
 {
  "name": "Tango",
  "hint": "Two steps forward, one portal back.",
  "grid": [
   ".#.1#E#",
   "P....B.",
   "..BS#..",
   ".#T.JB.",
   "##.#b..",
   ".2BTH.#",
   "..T.JH."
  ],
  "sol": "RRURDRURDRUULLURURRU"
 },
 {
  "name": "Toll Road",
  "hint": "Every lever costs you a tile.",
  "grid": [
   ".T....#",
   "#B...#.",
   "..#T.bT",
   "#b..#.T",
   "T.#..#P",
   "T..##..",
   "...BE#."
  ],
  "sol": "UULLUULLLDRRDDLLDDLDRRRR"
 },
 {
  "name": "Spring Garden",
  "hint": "So many springs, so few landings.",
  "grid": [
   ".....S.",
   "S#..#H.",
   "..#.#.P",
   "..S..##",
   "..#.#SE",
   "HH.HS.#",
   "SS.S..."
  ],
  "sol": "UULLLDDDLLDLUUUDRRRRURUR"
 },
 {
  "name": "Lighthouse",
  "hint": "Find the light at the end.",
  "grid": [
   "....T.",
   ".T#...",
   "...##.",
   "H..2..",
   "J.BS#1",
   ".Pb#E#",
   "S.S.B."
  ],
  "sol": "UUUUURRDRRDDDLDRLDDRRRRU"
 },
 {
  "name": "Seesaw",
  "hint": "Up one side, down the other.",
  "grid": [
   ".#.bS..",
   "P##EH#.",
   "...#H..",
   "STH..#.",
   ".#S.#..",
   "ST.HSBT",
   "#..#T.T"
  ],
  "sol": "DRDLRDLDLLRDRURUUUUULLLD"
 },
 {
  "name": "Chain Reaction",
  "hint": "Each lever sets up the next.",
  "grid": [
   ".#..P.T",
   ".T#.#.b",
   "...#.#T",
   ".J.#..T",
   "....J#.",
   "..J.#.#",
   "..bTbE."
  ],
  "sol": "RDRDDLLDLLLLUUURDDDRRDRR"
 },
 {
  "name": "Rabbit Warren",
  "hint": "Tunnels everywhere. One way out.",
  "grid": [
   "..B...1",
   "T......",
   ".#.#2BJ",
   "#.B....",
   "...#...",
   ".#E##.#",
   "..#.P.."
  ],
  "sol": "RUUURUULLLLLLURRRRRRDLLDD"
 },
 {
  "name": "Hall of Mirrors",
  "hint": "Nothing is where it seems.",
  "grid": [
   ".B.J..#",
   "S#.HE#.",
   ".J#.##.",
   "P...TB2",
   "..1.#T#",
   "..HB...",
   "BTJTHS."
  ],
  "sol": "DDRDRULDDDLUUULLULUURRRRD"
 },
 {
  "name": "Point of No Return",
  "hint": "Think twenty moves ahead.",
  "grid": [
   "..S.#.",
   "T....P",
   ".#.S..",
   "#E#...",
   "B.#...",
   ".#.b#.",
   "SS...#"
  ],
  "sol": "DDDLLURUULLLLURRDRDLLLUURU"
 },
 {
  "name": "Bamboozled",
  "hint": "You've been warned.",
  "grid": [
   "..H.S.#",
   "bTSBB#E",
   ".H.S.Hb",
   ".S.#B..",
   ".#S..#.",
   "T.#.P.#",
   "BSS...."
  ],
  "sol": "DLLLULUURRDRRUUULURLDRDRRU"
 },
 {
  "name": "Grand Bumpuzzle",
  "hint": "The final final boss.",
  "grid": [
   "T....#.",
   "b..J..#",
   ".J.#JB.",
   "bbS#..#",
   "B.#PJH.",
   "JHT.BS#",
   "...B#SE"
  ],
  "sol": "RUUULLDDLLUUURDDDLDDRRRURRDR"
 }
]/*END*/;

if (typeof module !== "undefined") module.exports = LEVELS;
