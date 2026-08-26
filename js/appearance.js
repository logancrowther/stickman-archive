// Copyright (c) 2026 logancrowther. All rights reserved. See LICENSE.
// Stickman Archive — procedural appearance system.
// Looks are derived from word-boundary keyword rules over each type's
// name/description, then corrected per-id by the OVERRIDES table so every
// stickman models what it actually is. Bodies are jointed skeletons
// (two-bone IK knees/elbows, curved limbs and spine).

"use strict";

const TYPES = buildTypes();

function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const FEATURE_CACHE = new Map();
const WORD_RE = new Map();

function getFeatures(id) {
  if (FEATURE_CACHE.has(id)) return FEATURE_CACHE.get(id);
  const type = TYPES[id - 1];
  const txt = (type.name + " " + type.desc).toLowerCase();
  const rng = mulberry32(id * 7919 + 13);
  // whole-word matching — "king" must NOT match "walking"
  const has = (...words) => words.some(w => {
    let re = WORD_RE.get(w);
    if (!re) {
      re = new RegExp("\\b" + w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b");
      WORD_RE.set(w, re);
    }
    return re.test(txt);
  });

  const f = {
    id, head: "circle", headScale: 1, headFill: "#ffffff",
    color: "#000000", lineW: 2,
    legLen: 1, armLen: 1, bodyLen: 1, size: 1, stretchy: false,
    legColor: null, torsoColor: null,
    alpha: 1, fade: false, glow: null, hueCycle: false, starBody: false,
    hat: null, hatScale: 1, wings: null, halo: false, horns: false, ears: null, tail: false,
    trail: null, orbit: 0, orbitKind: null, acc: null, back: null, eyes: null,
    cloak: false, cloakColor: null, cape: false, marks: false, marksColor: "#f4b400", jointMarks: false,
    shell: null, branchArms: false, cactus: false, spiderLegs: false,
    tentacles: false, snowman: false, stripes: null, belly: false,
    beak: null, gloves: null, beard: false, comb: false, ball: null,
    chest: null, overhead: null, ride: null, strings: false, pet: null,
    suit: false, suitColor: "#1c1c24", tieColor: "#b71c1c",
    companion: null, marksKind: "squares",
    multiHead: 0, bubbleHelm: false, invert: false, headDots: null, stem: false,
    shine: false, shineColor: null,
    mask: false, armor: false, fishTail: false, emblem: null,
    move: null, speed: 1, glitch: false, glitchAura: false,
    crest: null, firePlume: false, halfRobot: false, pixelate: false,
    mjGlove: false, mjShoes: false, collar: false, hair: null, fangs: false,
    furry: false, muzzle: null, claws: false, lionTail: false,
    boltEars: false, electric: false, windLines: false, lightning: false,
    icicles: false, shiver: false, morph: false, dimWalk: false,
    auraFlame: false, signText: null,
    // deep-archive (951-999) effect flags
    dash: false, echo: null, restart: false, crowdBody: false,
    photoFrame: null, dissolve: false, censor: false, numberSwarm: null,
    eternalRing: false, perfectRings: false, erased: false, pathDots: false,
    emblemText: null, glowText: null, sparkleBurst: false, haloRings: 0,
    noFlip: false, photoFrameColor: null, sepia: false,
    // civic/vehicle (425-439) flags
    vehicleBody: null, vehicleOnly: null, rideVehicle: null,
    holdMachine: false, offAcc: null,
    centaurBody: false
  };

  // ---- head shape ----
  if (has("square head", "cube-shaped", "box head", "blocky")) f.head = "square";
  else if (has("triangular", "triangle head")) f.head = "triangle";
  else if (has("oval head", "oval eyes")) f.head = "oval";
  else if (has("diamond-shaped")) f.head = "diamond";
  else if (has("rectangular")) f.head = "rect";
  else if (has("five-sided")) f.head = "poly5";
  else if (has("six-sided", "hexagon")) f.head = "poly6";
  else if (has("eight-sided", "octagon head")) f.head = "poly8";
  else if (has("heart-shaped", "heart head")) f.head = "heart";
  else if (has("star head", "star replaces its head", "sun-shaped head", "dark star")) f.head = "star";
  else if (has("cloud-shaped")) f.head = "cloud";
  else if (has("droplet", "teardrop")) { f.head = "drop"; f.headFill = "#c9e8fb"; }
  else if (has("cross-shaped")) f.head = "cross";
  else if (has("rolling dice head", "dice head")) f.head = "dice";
  else if (has("padlock head", "lock symbol covers its face")) f.head = "lock";
  else if (has("walking doorway", "door covers its body")) f.head = "door";
  else if (has("infinity")) f.head = "infinity";
  else if (has("compass head")) f.head = "compass";
  else if (has("moon-shaped", "crescent")) f.head = "crescent";
  else if (has("television", "tv head", "monitor head", "screen head", "smartphone screen head")) f.head = "tv";
  else if (has("clock face head", "clock face", "loading symbol head")) f.head = "clock";
  else if (has("question mark replaces its head")) f.head = "question";
  else if (has("jack-o'-lantern", "pumpkin head", "pumpkin accessories")) f.head = "pumpkin";
  else if (has("apple head")) { f.head = "circle"; f.headFill = "#e64545"; f.stem = true; }
  else if (has("banana-shaped")) { f.head = "crescent"; f.headFill = "#ffdf4d"; }
  else if (has("watermelon head")) { f.head = "circle"; f.headFill = "#4fae54"; }
  else if (has("donut head")) { f.head = "donut"; f.headDots = "sprinkles"; }
  else if (has("mushroom cap")) { f.head = "mushroom"; f.headFill = "#e53935"; f.headDots = "spots"; }
  else if (has("trophy head")) f.head = "trophy";
  else if (has("camera for a head", "golden camera")) f.head = "camera";
  else if (has("walking file folder")) f.head = "folder";
  else if (has("battery-shaped head")) f.head = "battery";

  if (has("huge circular", "big head", "huge body", "massive body", "giant")) f.headScale = 1.5;
  if (has("very small circular", "tiny head")) f.headScale = 0.55;
  if (has("extremely long legs")) f.legLen = 1.9;
  if (has("extra-long swinging arms", "long arms")) f.armLen = 1.8;
  if (has("very short stickman", "short body", "small body")) f.size = 0.72;
  if (has("very tall stickman", "tall narrow body", "extremely tall")) { f.legLen = 1.5; f.bodyLen = 1.5; }
  if (has("broad stick body", "muscular", "wide shoulders")) f.lineW = 3.2;

  // ---- colors / body styles ----
  if (has("gold", "golden")) { f.color = "#b8860b"; f.headFill = "#ffd700"; f.glow = "#ffd70055"; }
  if (has("silver")) { f.color = "#7d868f"; f.headFill = "#d9dee3"; }
  if (has("bronze")) { f.color = "#8c5a2b"; f.headFill = "#cd7f32"; }
  if (has("crystal", "glass", "gem", "gems", "gemstones")) { f.color = "#4aa8c9"; f.headFill = "#d7f2fb"; f.alpha = 0.78; }
  if (has("icy", "frozen", "frost", "frostbite", "arctic", "ice")) { f.color = "#2e86c1"; f.headFill = "#cfeefc"; }
  if (has("lava", "flames", "flame", "burning", "phoenix")) { f.color = "#d84315"; f.headFill = "#ff9800"; f.glow = "#ff572266"; f.trail = f.trail || "fire"; }
  if (has("leaf", "leaves", "tree", "vines", "vine", "forest")) { f.color = "#2e7d32"; f.headFill = "#a5d6a7"; }
  if (has("green skin", "goblin", "alien", "martian")) f.headFill = "#8bc34a";
  if (has("toxic", "radioactive", "radiation")) { f.color = "#33691e"; f.headFill = "#76ff03"; f.glow = "#76ff0366"; }
  if (has("shadow", "silhouette", "dark cloak", "black body", "completely black", "black armor", "void", "darkness")) {
    f.color = "#000"; f.headFill = "#000"; f.eyes = "white";
  }
  if (has("ghost", "transparent body", "faint", "invisible", "fades", "faded", "hologram", "wandering soul")) {
    f.alpha = 0.35; f.fade = true;
  }
  if (has("rainbow", "every color", "aurora", "changes colors", "changing colors")) f.hueCycle = true;
  if (has("galaxy", "galaxies", "cosmic", "constellations", "universe", "filled with stars", "tiny stars", "starborn")) {
    f.color = "#3f2b7e"; f.headFill = "#241b4d"; f.starBody = true; f.eyes = "white";
  }
  if (has("robot", "metal body", "android", "cyborg", "machine", "mechanical")) {
    f.color = "#546e7a"; f.headFill = "#b0bec5"; if (f.head === "circle") f.head = "square";
  }
  if (has("stone", "rock body", "marble", "statue", "golem", "fossil", "mountain")) { f.color = "#5d5d5d"; f.headFill = "#9e9e9e"; }
  if (has("glowing white", "pure glowing", "white star", "shining aura", "beams of light")) { f.glow = "#fff8b055"; f.headFill = "#fffde7"; f.color = "#c9b458"; }
  if (has("electric", "lightning", "sparks", "plasma")) { f.color = "#f9a825"; f.glow = "#ffee5866"; f.trail = f.trail || "spark"; }
  if (has("skeleton", "bones")) { f.color = "#444"; f.headFill = "#f5f5f5"; f.chest = "ribs"; }
  if (has("zombie")) { f.headFill = "#a5c882"; f.move = "slow"; }
  if (has("blank white", "no features", "blank entry", "white stickman")) { f.color = "#bbb"; f.headFill = "#fff"; }
  if (has("pencil drawing", "sketch")) f.color = "#777";
  if (has("blueprint")) { f.color = "#1565c0"; f.headFill = "#bbdefb"; }
  if (has("inverted", "negative")) { f.color = "#fff"; f.headFill = "#000"; f.glow = "#00000033"; }
  if (has("chocolate", "gingerbread", "cookie", "cardboard", "bark")) { f.color = "#5d4037"; f.headFill = "#a1887f"; }
  if (has("candy", "sweet")) { f.color = "#d81b60"; f.headFill = "#f8bbd0"; }
  if (has("purple", "dream", "mist")) { f.color = "#6a1b9a"; f.headFill = "#e1bee7"; }
  if (has("red aura", "angry", "red shell", "demon")) { f.color = "#b71c1c"; f.headFill = "#ef9a9a"; }
  if (has("glowing red eyes")) f.eyes = "red";
  if (has("glowing eyes", "glowing eye", "glowing core")) f.eyes = "glow";
  if (has("green code", "command lines", "binary", "0s and 1s")) { f.color = "#1b5e20"; f.headFill = "#69f0ae"; }
  if (has("water", "liquid", "ocean", "waves", "wave")) { f.color = "#1976d2"; f.headFill = "#90caf9"; }
  if (has("smoke", "smoky", "mist follows")) { f.color = "#616161"; f.alpha = 0.6; f.trail = f.trail || "smoke"; }
  if (has("sand")) { f.color = "#c49000"; f.headFill = "#f0dfa8"; }
  if (has("paper", "origami", "folded")) { f.color = "#9e9e9e"; f.headFill = "#fafafa"; }
  if (has("glitch", "glitched", "corrupted", "static", "distorts", "broken pixels", "error")) f.glitch = true;
  if (has("one giant eye", "single glowing eye", "cyclops")) f.eyes = "cyclops";
  if (has("cloak", "robes", "hoodie", "hiding its body")) f.cloak = true;
  if (has("cape")) f.cape = true;
  if (has("carvings", "markings")) f.marks = true;
  if (has("glowing symbols", "ancient symbols", "hidden symbols", "impossible symbols", "rune", "runes", "magic symbols", "floating magic symbols", "control symbols", "strange symbols", "unknown writing")) {
    f.marks = true; f.marksKind = "glyphs";
  }
  if (/\bgods?\b/.test(txt)) { f.glow = "#ffd70088"; f.size = Math.max(f.size, 1.18); f.marks = true; f.marksKind = "glyphs"; }
  if (has("business suit")) f.suit = true;
  if (has("giant golden clock", "clock containing all time")) { f.companion = "clock"; f.acc = null; }
  if (has("pencil that draws reality", "draws new stickmen")) f.acc = "pencil";
  if (has("stickdex", "archive", "every page", "endless folder")) { f.orbit = f.orbit || 3; f.orbitKind = "page"; }
  if (has("tentacle", "tentacles")) f.tentacles = true;

  // ---- hats & head extras ----
  if (has("bowler hat")) f.hat = "bowler";
  else if (has("top hat", "tall hat", "tall top hat")) f.hat = "tophat";
  else if (has("police cap", "police")) f.hat = "police";
  else if (has("baseball cap", "pilot cap")) f.hat = "cap";
  else if (has("beanie")) f.hat = "beanie";
  else if (has("cowboy hat", "cowboy")) f.hat = "cowboy";
  else if (has("chef hat", "chef")) f.hat = "chef";
  else if (has("pizza slice hat")) f.hat = "pizza";
  else if (has("burger stacked")) f.hat = "burger";
  else if (has("knight helmet", "knight armor")) f.hat = "knight";
  else if (has("samurai", "traditional helmet")) f.hat = "samurai";
  else if (has("fire helmet")) f.hat = "firehelm";
  else if (has("helmet")) f.hat = "helmet";
  else if (has("graduation cap")) f.hat = "grad";
  else if (has("crown", "king", "queen", "royal")) f.hat = "crown";
  else if (has("pointed hat", "wizard", "witch", "magical hat")) f.hat = "wizard";
  else if (has("santa hat", "christmas")) f.hat = "santa";
  else if (has("party hat", "birthday", "new year")) f.hat = "party";
  else if (has("pirate hat", "pirate outfit", "pirate")) f.hat = "pirate";
  else if (has("jester", "clown hat", "four-point hat")) f.hat = "jester";
  else if (has("beret")) f.hat = "beret";
  else if (has("explorer hat", "tropical hat")) f.hat = "cowboy";

  if (has("halo")) f.halo = true;
  if (has("horns", "bull horns")) f.horns = true;
  if (has("antennae", "antenna")) f.ears = "antennae";
  else if (has("cat ears")) { f.ears = "cat"; f.tail = true; }
  else if (has("dog ears", "wolf head")) { f.ears = "dog"; f.tail = true; }
  else if (has("bunny ears", "floppy ears", "rabbit")) f.ears = "rabbit";
  else if (has("pointed ears", "fox")) { f.ears = "cat"; if (has("fox", "bushy tail")) f.tail = true; }
  else if (has("round ears", "bear")) f.ears = "bear";
  else if (has("headphones")) f.ears = "phones";
  if (has("pointed tail", "wagging tail", "fiery tail")) f.tail = true;
  if (has("single glowing horn", "unicorn")) f.hat = "horn";
  if (has("shark fin")) f.hat = "fin";
  if (has("flower growing")) f.hat = "flower";
  if (has("long beard")) f.beard = true;

  // ---- wings ----
  if (has("butterfly wings")) f.wings = "butterfly";
  else if (has("feathered wings", "celestial wings", "white feathered", "angel", "flaming wings", "bird-like wings")) f.wings = "feather";
  else if (has("tiny wings")) f.wings = "bee";
  else if (has("dragon wings", "cloud wings")) f.wings = "feather";

  // ---- carried / worn items ----
  if (has("backpack")) f.back = "backpack";
  if (has("katana", "sword")) f.back = "sword";
  if (has("wind-up key", "wind-up")) f.back = "windkey";

  if (has("cane")) f.acc = "cane";
  else if (has("scythe")) f.acc = "scythe";
  else if (has("glowing staff", "magic staff", "staff", "sceptre", "walking stick")) f.acc = "staff";
  else if (has("broom")) f.acc = "broom";
  else if (has("guitar")) f.acc = "guitar";
  else if (has("umbrella")) f.acc = "umbrella";
  else if (has("briefcase")) f.acc = "briefcase";
  else if (has("money sack", "money bag", "sack")) f.acc = "moneybag";
  else if (has("tennis racket", "racket")) f.acc = "racket";
  else if (has("golf club")) f.acc = "club";
  else if (has("four-leaf clover", "clover")) f.acc = "clover";
  else if (has("paintbrush")) f.acc = "brush";
  else if (has("book", "books", "scroll", "map")) f.acc = "book";
  else if (has("balloon", "balloons")) f.acc = "balloon";
  else if (has("magic wand", "wand")) f.acc = "wand";
  else if (has("camera")) f.acc = "camera";
  else if (has("folder")) f.acc = "folder";
  else if (has("clock")) f.acc = f.head === "clock" ? null : "clockAcc";
  else if (has("key", "keys")) f.acc = "key";
  else if (has("laptop", "controller", "keyboard")) f.acc = "briefcase";
  else if (has("frying pan", "pan")) f.acc = "pan";
  else if (has("flask", "potion", "potions")) f.acc = "flask";
  else if (has("microphone")) f.acc = "mic";
  else if (has("shield")) f.acc = "shield";
  else if (has("axe", "pickaxe", "mining tools", "lunar mining tool")) f.acc = "axe";
  else if (has("drum set", "drum")) f.acc = "drum";

  // ---- trails / particles ----
  if (has("rainbow trail", "rainbow drawings", "colorful footprints", "rainbow walker")) f.trail = "rainbow";
  if (has("frosty trail", "snow trail")) f.trail = "snow";
  if (has("bubbles", "bubble")) f.trail = f.trail || "bubble";
  if (has("sparkling trail", "fireworks", "confetti")) f.trail = f.trail || "spark";
  if (has("star walker", "stars where feet")) f.trail = "star";
  if (has("comet tail", "glowing tail", "leaves sparks behind", "burns behind")) f.trail = "fire";
  if (has("footprints")) f.trail = f.trail || "print";
  if (has("glowing paths", "light behind", "sunlight behind")) f.trail = "glowpath";
  if (has("releasing steam")) f.trail = "smoke";

  // ---- orbiting / floating companions ----
  if (has("satellite orbiting", "tiny planets orbit", "cards orbit", "attracting tiny objects")) f.orbit = 3;
  if (has("musical notes", "sound waves", "music discs")) { f.orbit = 3; f.orbitKind = "note"; }
  if (has("planets orbit")) f.orbit = 3;
  if (has("floating hearts", "question marks float", "magic symbols", "floating magic symbols")) f.orbit = f.orbit || 2;
  if (has("ufo hovering")) f.overhead = "ufo";
  if (has("light bulb floating")) f.overhead = "bulb";
  if (has("storm cloud above head", "rain cloud follows")) f.overhead = "cloud";
  if (has("crystal ball floating")) f.overhead = "orb";

  // ---- movement ----
  if (has("runs much faster", "moves faster", "extremely fast", "speedster", "sped up", "sugar rush")) { f.move = "run"; f.speed = 2.3; }
  if (has("slow", "slowly", "shuffling", "heavy footsteps", "extremely slowly", "impossibly slowly", "huge gravity")) { f.move = "slow"; f.speed = 0.45; }
  if (has("hopping", "hops", "jumping", "only by jumping", "pops upward")) f.move = "hop";
  if (has("skips", "skipping")) f.move = "skip";
  if (has("waddles", "waddle")) f.move = "waddle";
  if (has("slithers", "snake-like body")) f.move = "slither";
  if (has("floats", "floating movement", "flying", "flies", "glides", "gliding", "hovering", "never touches the ground", "swims", "broom")) f.move = "float";
  if (has("walks sideways", "sideways")) f.move = "waddle";
  if (has("walks backwards", "only moves backwards", "reversed animation", "moonwalk")) f.move = "back";
  if (has("spins", "spinning", "rolls", "rolling", "cartwheel", "wheel")) f.move = "spin";
  if (has("dances", "dance routine", "dancing", "dance move")) f.move = "dance";
  if (has("disappears and reappears", "teleport")) f.move = "teleport";
  if (has("upside down", "top of screen")) { f.move = "float"; f.invert = true; }
  if (has("spins on its head")) f.move = "headspin";
  if (has("graceful spinning", "spinning dance", "ballerina")) f.move = "twirl";
  if (has("strings attached", "puppet strings", "invisible strings")) f.strings = true;

  // ---- per-id hand-tuned corrections (applied last, so they always win) ----
  const ov = APPEARANCE_OVERRIDES[id];
  if (ov) Object.assign(f, ov);

  // The deep archive (951-1000) keeps exactly its tuned look — skip the
  // generic accent passes below that would recolor heads or add sparks.
  if (id >= 951) { FEATURE_CACHE.set(id, f); return f; }

  // ---- unique per-id accent for otherwise-plain rare types ----
  if (id > 30 && f.headFill === "#ffffff" && !f.hueCycle) {
    const h = Math.floor(rng() * 360);
    f.headFill = `hsl(${h}, 55%, 88%)`;
  }
  if (id > 400 && !f.glow && rng() < 0.5) f.glow = "#00000022"; // legendary aura
  if (id >= 900) { // deepest archive entries shimmer
    f.orbit = f.orbit || 2;
    f.orbitKind = f.orbitKind || "spark";
    f.glow = f.glow || "#ffd70055";
  }

  FEATURE_CACHE.set(id, f);
  return f;
}

// Hand-tuned fixes so each stickman models what it actually is.
const APPEARANCE_OVERRIDES = {
  12: { headFill: "#eceff1", headScale: 1.15 },                          // Cloud
  33: { back: "backpack", acc: null },                                   // Backpacker
  34: { acc: "umbrella", hat: null },                                    // Umbrella
  36: { acc: "briefcase", color: "#263238", suit: true },                // Briefcase (suit)
  29: { hat: "grad", cloak: true, cloakColor: "#37474f" },               // Graduate: mortarboard + gown
  30: { hat: "knight", armor: true, color: "#37474f" },                  // Knight: great helm + full plate
  37: { cloak: true, cloakColor: "#f5f5f5", emblem: "redcross", mask: true, color: "#37474f" }, // Doctor: white cloak, red cross, face mask
  38: { hat: "firehelm", acc: "axe", color: "#c62828" },                 // Firefighter
  39: { hat: "police", chest: "badge", color: "#1a237e" },               // Police: cap + badge
  40: { hat: "pilot", eyes: "shades", suit: true, suitColor: "#283593", color: "#263238" }, // Pilot: peaked cap + navy uniform
  41: { bubbleHelm: true, hat: null, move: "float" },                    // Astronaut
  42: { acc: "flask", hat: null },                                       // Scientist
  43: { acc: "brush", hat: "beret" },                                    // Artist
  46: { color: "#212121", headFill: "#2b2b2b", eyes: "white", back: "sword", acc: null }, // Ninja
  47: { hat: "pirate", acc: "rapier", suit: true, suitColor: "#7b1c1c", tieColor: null, color: "#3e2723" }, // Pirate: tricorne + rapier + red coat
  48: { hat: "samurai", back: "sword", color: "#4e342e" },               // Samurai
  49: { cloak: true, cloakColor: "#7b1fa2", hat: "crown", acc: "staff" },// King
  56: { marks: true, marksColor: "#2e7d32" },                            // Leaf
  58: { color: "#5d4037", headFill: "#66bb6a", head: "cloud", branchArms: true, acc: null, marks: false }, // Tree!
  60: { color: "#2e7d32", headFill: "#a5d6a7", cactus: true },           // Cactus
  61: { stripes: ["#fbc02d", "#212121"], wings: "bee", ears: "antennae", size: 0.8 }, // Bee
  62: { wings: "butterfly", ears: "antennae" },                          // Butterfly: structured wings + antennae
  63: { shell: "#e53935", ears: "antennae", color: "#b71c1c", headFill: "#212121" },  // Ladybug!
  64: { spiderLegs: true, color: "#212121", headFill: "#424242", eyes: "white" },     // Spider
  68: { color: "#e65100", headFill: "#ffb74d" },                         // Fox
  70: { color: "#5d4037", headFill: "#8d6e63", lineW: 3 },               // Bear
  71: { color: "#212121", headFill: "#fafafa", belly: true, beak: "#fb8c00", move: "waddle", wings: null }, // Penguin
  72: { beak: "#fb8c00", comb: true },                                   // Chicken
  73: { beak: "#fb8c00", headFill: "#fff59d" },                          // Duck
  74: { eyes: "big", wings: "owl", color: "#4e342e", headFill: "#d7ccc8", beak: "#f9a825", ears: "owltuft", belly: true }, // Owl: brown feathered wing + tufts
  76: { move: "float", fishTail: true, color: "#0277bd", headFill: "#4fc3f7" }, // Fish: forked caudal fin + dorsal fin
  77: { tentacles: true, headFill: "#ba68c8", headScale: 1.2 },          // Octopus
  78: { color: "#d84315", gloves: "#d84315", move: "waddle" },           // Crab
  80: { head: "banana", headFill: "#ffe135" },                           // Banana: structured fruit
  85: { head: "scoops", headDots: null },                                // Ice Cream
  87: { ball: "soccer" },                                                // Soccer
  88: { ball: "basketball" },                                            // Basketball
  89: { acc: "racket" },                                                 // Tennis
  90: { acc: "club" },                                                   // Golfer
  91: { gloves: "#e53935" },                                             // Boxer
  93: { beard: true },                                                   // Wizard
  94: { acc: "broom", move: "float" },                                   // Witch
  95: { pet: "dragon" },                                                 // Dragon Rider
  100: { wings: "flame", beak: "#f9a825", crest: "flame", firePlume: true }, // Phoenix: fiery bird
  102: { head: "android", headFill: "#cfd8dc", eyes: null, chest: "core" },  // Android: structured bot
  103: { halfRobot: true, color: "#000000", headFill: "#ffffff", head: "circle", lineW: 2 }, // Cyborg: half stick, half robot
  104: { trail: "smoke" },                                               // Steam Bot
  106: { head: "monitor", headFill: "#263238" },                         // Monitor: long thin screen
  107: { pixelate: true, head: "square" },                               // Pixel: made of pixels
  110: { eyes: "alien" },                                                // Alien
  111: { eyes: "alien" },                                                // Martian
  112: { overhead: "ufo" },                                              // UFO Pilot
  113: { hat: "fedora", suit: true, suitColor: "#141414", tieColor: null,
         color: "#111111", headFill: "#ffffff", trail: "print",
         mjGlove: true, mjShoes: true, move: "moonwalk" },                // Moon Walker: MJ moonwalk
  114: { head: "meteor", headFill: "#8d6e63", trail: "fire" },           // Meteor head
  115: { head: "comet", headFill: "#e3f2fd", glow: "#90caf988", trail: "fire" }, // Comet head
  116: { head: "saturn", headFill: "#e8c977" },                          // Planet: Saturn head
  118: { chest: "swirl", color: "#212121", headFill: "#37474f", eyes: "white" }, // Black Hole
  120: { hat: "horn", wings: "feather", color: "#5c6bc0", headFill: "#f6f6ff",
         tail: true, glow: "#e1bee766", lineW: 2.6 },                    // Pegasus: winged unicorn
  121: { centaurBody: true },                                             // Centaur: structured horse lower body
  122: { move: "float", tail: true, color: "#00838f", headFill: "#80deea" },     // Merfolk
  125: { multiHead: 3, color: "#2e7d32", headFill: "#a5d6a7" },          // Hydra
  126: { wings: "feather", beak: "#f9a825", ears: "owltuft", lionTail: true,
         color: "#6d4c41", headFill: "#e6c47a", claws: true, tail: false }, // Griffin: eagle front, lion back
  128: { color: "#90a4ae", headFill: "#eceff1", lineW: 3.4, size: 1.15 },// Yeti
  129: { color: "#4e342e", headFill: "#6d4c41", lineW: 3.4, size: 1.2 }, // Bigfoot
  130: { cloak: true, cloakColor: "#8e0e18", collar: true, cape: false,
         hair: "dracula", fangs: true, headFill: "#e8eaf6", eyes: "red" }, // Vampire: red cloak + Dracula hair
  131: { ears: "dog", color: "#37474f", lineW: 3, furry: true, muzzle: "#546e7a",
         claws: true, tail: true, eyes: "glow" },                        // Werewolf
  134: { stripes: ["#eeeeee", "#bdbdbd"], color: "#9e9e9e" },            // Mummy
  135: { head: "frank", headFill: "#9ccc65", boltEars: true, electric: true,
         marks: true, marksColor: "#546e7a" },                           // Franken: flat top, bolts, arcs
  137: { hat: "cowboy", marks: true, marksColor: "#fbc02d", overhead: "crows" }, // Scarecrow: crows above
  139: { alpha: 0.3, fade: false, trail: "blacksmoke", color: "#000000",
         headFill: "#000000", eyes: "white", glow: null },               // Shadow: near-invisible black + smoke
  140: { head: "mirror", headFill: "#dbe7ec" },                          // Mirror head
  143: { overhead: "cloud" },                                            // Thunder
  145: { ride: "cloud", move: "float" },                                 // Cloud Rider
  146: { chest: "gearTrain" },                                           // Clockwork: meshing gears
  147: { chest: "hourglass" },                                           // Hourglass
  149: { fade: false, alpha: 1, dimWalk: true },                         // Dimension Walker: portal hops
  150: { morph: true, glitch: true },                                    // Glitch: flips through models
  152: { trail: "splash" },                                              // Water: droplets kick up at each footfall
  153: { head: "earth", headFill: "#42a5f5" },                           // Earth head
  154: { alpha: 0.16, fade: false, windLines: true, color: "#78909c", headFill: "#eceff1" }, // Wind
  155: { head: "cloud", headFill: "#78909c", color: "#37474f", lightning: true }, // Storm
  156: { snowman: true, move: "waddle", beak: "#fb8c00", legLen: 0.55, bodyLen: 0.75, color: "#607d8b", headFill: "#fff" }, // Snowman
  157: { icicles: true, shiver: true, trail: "snow" },                   // Frostbite
  158: { trail: "sand" },                                                // Sand: constantly raining off the body
  159: { marks: true, shine: true },                                    // Glass: crack lines + a glassy highlight
  160: { trail: "smoke" },                                               // Smoke: soft expanding puffs
  161: { trail: "ooze", chest: "warning" },                              // Toxic: dripping green ooze + hazard warning symbol
  168: { trail: "comettail", glow: "#ffb74d99" },                        // Comet Tail: a long glowing tail streaming behind it
  162: { head: "radsign" },                                              // Radioactive: radiation trefoil head
  163: { orbit: 3 },                                                     // Magnet
  166: { glow: "#9c6dff99", orbit: 3, orbitKind: "star", color: "#5e35b1", headFill: "#7c4dff" }, // Lunar: purple glow + drifting stars, keeps its crescent head
  171: { hat: "shako", color: "#2e7d32" },                               // Toy Soldier
  172: { back: "windkey" },                                              // Wind-Up
  174: { color: "#f5dcd0", headFill: "#fbe8e0", jointMarks: true, eyes: null }, // Doll: porcelain skin + black joint marks + blank stare
  175: { strings: true },                                                // Marionette
  176: { legColor: "#1565c0", torsoColor: "#43a047", headFill: "#fdd835" }, // LEGO: blue feet, green body, yellow head
  177: { head: "origami", color: "#c9b896", headFill: "#e8dcc0" },       // Origami: folded-paper kite head
  178: { vehicleBody: "paper", color: "#9e9e9e", headFill: "#faf6ea" },  // Paper: a sheet with a pencil stickman doodle on it
  179: { head: "square", headFill: "#bcaaa4" },                          // Cardboard
  180: { stretchy: true, color: "#e64a8a", headFill: "#ff7fb0" },        // Rubber: legs stretch and snap back each stride
  184: { trail: "candyfall" },                                          // Candy: little candies fall from it as it walks
  185: { shine: true },                                                  // Chocolate: glossy glaze
  186: { marks: true, marksColor: "#5d4037" },                           // Cookie: chocolate-chip dots
  187: { color: "#8d6e63", headFill: "#a1887f", marks: true, marksColor: "#fff" }, // Gingerbread
  189: { ears: "rabbit", acc: "basket" },                                // Easter: carries a basket of colorful eggs
  194: { acc: "clover" },                                                // Lucky
  195: { overhead: "orb" },                                              // Fortune
  196: { trail: "bubble", color: "#7e57c2", headFill: "#b39ddb" },       // Dream: soft purple mist wisps
  198: { sepia: true, alpha: 0.85 },                                     // Memory: faded old photograph
  202: { marks: true, shine: true },                                    // Statue: chip/crack lines + marble sheen
  203: { head: "dinoskull" },                                            // Fossil: preserved dino skull
  205: { hat: "knight", armor: true, color: "#c9a227", headFill: "#e6c866" }, // Knight Lord: Knight's armor, in gold
  207: { hat: "wizard", hatScale: 1.9 },                                 // Wizard King: fixes the crown-chain bug, much taller hat
  209: { offAcc: "flaskRed" },                                          // Potion Master: a second, red potion in the other hand
  213: { vehicleBody: "treeguardian", armor: true, color: "#33691e", headFill: "#7cb342" }, // Forest Guardian: tree trunk + real plate armor
  217: { hat: "knight", armor: true, color: "#1a1a1a", headFill: "#0d0d0d" }, // Shadow Knight: real black armor (fixes the smoke-color bug)
  219: { orbit: 3, orbitKind: "note" },                                  // Music
  220: { chest: "keys", acc: null },                                     // Piano: clears the stray "keyboard" briefcase misfire
  222: { acc: "drum" },                                                  // Drummer: now actively bangs it (see armsMode "drum")
  223: { acc: "violin" },                                                // Violinist: bowing motion via armsMode "wave"
  224: { orbit: 3, orbitKind: "note", acc: "wand" },                     // Conductor
  226: { ears: "phones" },                                               // DJ
  227: { marks: true, marksColor: "#e91e63", acc: "brush", trail: "paintline" }, // Painter: paint-splash marks + brush that paints a colored line as it walks
  228: { acc: "statue", color: "#000000", headFill: "#f5f5f5" },        // Sculptor: holds a tiny statue, clears the stray stone-gray misfire
  229: { pixelate: true, color: "#e91e63", headFill: "#ffca28" },        // Pixel Artist: blocky 8-bit rendering
  230: { lineW: 3.4, color: "#000000", headFill: "#ffeb3b" },            // Comic: bold black outlines
  231: { dash: true },                                                   // Sketch: dashed pencil-sketch outline
  232: { trail: "ink", color: "#0d0d0d", headFill: "#212121" },          // Ink: glossy black, drips as it goes
  233: { trail: "paint" },                                               // Paint Spill: colorful paint drips
  235: { trail: "bubble", color: "#7e57c2", headFill: "#b39ddb" },       // Dream Painter: floating dream bubbles behind it
  236: { echo: true, shine: true, color: "#607d8b", headFill: "#cfd8dc" }, // Mirror Master: a faint mirrored reflection trails it
  237: { echo: true },                                                   // Echo: repeats its own movements after a delay
  239: { move: "walk" },                                                 // Slow Motion: normal walk cycle, just slowed (keeps keyword's low speed)
  243: { move: "twirl" },                                                // Acrobat: flipping/aerial energy
  245: { echo: true },                                                   // Shadow Dancer: dances with a delayed shadow copy
  248: { dimWalk: true },                                                // Portal Walker: opens real portals and steps through them
  249: { move: "float", glitchAura: true },                              // Reality Bender: floats, glitch effect spreads to nearby stickmen
  270: { headFill: "#fff" },                                             // Chess
  287: { invert: true, move: "float" },                                  // Gravityless

  // ---- the pantheon & bestiary (300-350): gods, giants, golems, myth beasts ----
  300: { glitch: true, morph: true, invert: true, hueCycle: true, size: 1.3 }, // The Impossible: every chaos flag stacked at once
  301: { armor: true, color: "#5d5d5d", headFill: "#9e9e9e",
         marks: true, marksKind: "glyphs", marksColor: "#ffd700", glow: "#ffd70044" }, // Ancient God: stone plate, glowing gold glyphs
  302: { wings: "feather", color: "#c9a227", headFill: "#fff8d6",
         overhead: "cloud", lightning: true, glow: "#ffe08266" },        // Sky God: golden wings, a storm cloud crackling above
  303: { hat: "crown", color: "#01579b", headFill: "#81d4fa",
         trail: "bubble", glow: "#4fc3f766" },                           // Sea God: an aqua crown, ocean bubbles trailing behind
  304: { color: "#4e6b4e", headFill: "#6d8f6d", branchArms: true,
         size: 1.3, lineW: 3.4 },                                        // Earth God: massive mossy-stone body, vine-branch arms
  305: { color: "#bf360c", headFill: "#ff5722", wings: "flame",
         eyes: "glow", glow: "#ff572299", size: 1.15 },                  // Fire God: a body wreathed in eternal fire wings
  306: { armor: true, icicles: true, color: "#1a5276", headFill: "#cfeefc",
         glow: "#81d4fa55" },                                            // Ice God: frozen plate armor bristling with crystal spikes
  307: { electric: true, color: "#f9a825", headFill: "#fff59d",
         trail: "spark", eyes: "glow", glow: "#ffee5877" },              // Lightning God: a crackling electric body, thunder in its wake
  308: { head: "void", cloak: true, cloakColor: "#000000",
         color: "#000000", headFill: "#000000", eyes: "white" },         // Shadow God: a dark cloak wrapped around a void where a face should be
  309: { glow: "#fffde799", headFill: "#fffde7", color: "#c9b458",
         halo: true, size: 1.1 },                                        // Light God: pure glowing white body, a radiant halo
  310: { companion: "clock", color: "#8d6e00", headFill: "#ffd700",
         glow: "#ffd70066" },                                            // Time God: carries a giant golden clock everywhere
  311: { starBody: true, color: "#241b4d", headFill: "#1a1440", eyes: "white" }, // Space God: a body filled with slow-drifting galaxies
  312: { orbit: 3, orbitKind: "block", color: "#37474f", headFill: "#b0bec5" }, // Creation: tiny built blocks tumbling around it as it walks
  313: { trail: "crack", color: "#212121", headFill: "#4a4a4a", eyes: "red" }, // Destruction: leaves jagged cracks in reality behind it
  314: { armor: true, acc: "shield", color: "#8d6e00", headFill: "#ffe9a8",
         glow: "#ffd70044" },                                            // Guardian: golden armor, a raised protective shield
  315: { armor: true, alpha: 0.88, color: "#6d5a4e", headFill: "#a89484", lineW: 3 }, // Ancient Warrior: dulled, forgotten battle plate
  316: { hat: "crown", cloak: true, cloakColor: "#5e4b56", alpha: 0.85,
         color: "#757575", headFill: "#bdbdbd",
         marks: true, marksKind: "cracks", marksColor: "#424242" },      // Lost King: a tarnished, cracked crown and faded robes
  317: { horns: true, tail: true, fangs: true, lineW: 3.4, size: 1.15,
         color: "#7a1f1f", headFill: "#b71c1c" },                        // Dragon King: huge horns and deep-red dragon scales
  318: { wings: "flame", crest: "flame", firePlume: true,
         color: "#8d5a00", headFill: "#ffd700", glow: "#ff9800aa" },     // Phoenix King: flaming wings, golden feathers
  319: { hat: "snakecrown", eyes: "glow", tail: true,
         color: "#1b3b1b", headFill: "#4caf50" },                        // Serpent King: a coiled snake crown, glowing eyes
  320: { size: 1.4, headScale: 1.3, lineW: 4, gloves: "#5d5d5d",
         color: "#5d5d5d", headFill: "#9e9e9e" },                        // Titan: a massive body ending in stone fists
  321: { size: 1.5, headScale: 1.4, lineW: 4.4, move: "slow", speed: 0.4,
         color: "#757575", headFill: "#bdbdbd" },                        // Colossus: an even huger, slow ancient giant
  322: { chest: "core", color: "#616161", headFill: "#9e9e9e", glow: "#ff8a6544" }, // Golem: rock body, a glowing core in its chest
  323: { alpha: 0.75, shine: true, color: "#4aa8c9", headFill: "#d7f2fb", glow: "#80deea66" }, // Crystal Golem: an entire gem-cut body
  324: { armor: true, head: "square", move: "slow", lineW: 3.6,
         color: "#546e7a", headFill: "#b0bec5" },                        // Iron Golem: heavy metal armor, slow heavy footsteps
  325: { branchArms: true, lineW: 3.2, color: "#5d4037", headFill: "#7cb342" }, // Wood Golem: bark-brown body, branches for arms
  326: { wings: "bee", trail: "spark", size: 0.75, color: "#ad6fc9", headFill: "#f3e5f5" }, // Fairy: tiny wings, a sparkling trail
  327: { wings: "butterfly", orbit: 2, orbitKind: "spark", size: 0.75,
         color: "#8e24aa", headFill: "#f8bbd0", glow: "#ce93d888" },     // Pixie: small, softly glowing magical body
  328: { color: "#2e7d32", headFill: "#a5d6a7", cloak: true, cloakColor: "#1b5e20" }, // Elf: pointed ears (generic), green cloak and clothing
  329: { size: 0.75, beard: true, acc: "axe", lineW: 3,
         color: "#6d4c41", headFill: "#bcaaa4" },                        // Dwarf: short and stout, mining axe in hand
  330: { headFill: "#7cb342", size: 0.8, color: "#33691e",
         eyes: "glow", move: "skip", fangs: true },                      // Goblin: green skin, a jittery sneaking gait
  331: { size: 1.2, lineW: 3.6, fangs: true, claws: true,
         color: "#556b2f", headFill: "#8f9779" },                        // Orc: large, muscular, tusked
  332: { size: 1.3, lineW: 4, claws: true, muzzle: "#4e4e4e",
         color: "#5d6d5d", headFill: "#8d9c8d" },                        // Troll: huge rocky creature with a snout
  333: { wings: "flame", trail: "fire", color: "#4e2b2b", headFill: "#8d4444", glow: "#e6432288" }, // Phoenix: ash-dark body burning back to life
  334: { move: "slither", eyes: "glow", tail: true,
         color: "#556b2f", headFill: "#c0ca33" },                        // Basilisk: a snake-like body, glowing eyes
  335: { multiHead: 3, tail: true, trail: "fire",
         color: "#4e342e", headFill: "#8d6e63" },                        // Cerberus: three dog heads, a fiery tail
  336: { lionTail: true, mask: true, color: "#c9a227", headFill: "#f0dfa8" }, // Sphinx: a lion's body, a masked mysterious face
  337: { wings: "feather", halo: true, size: 1.3,
         color: "#78909c", headFill: "#eceff1", glow: "#e3f2fd99" },     // Pegasus Lord: massive celestial wings, no horn
  338: { armor: true, trail: "fire", fangs: true,
         color: "#3e1414", headFill: "#5d1a1a" },                        // Dragon Lord: ancient dragon armor, breathes fire
  339: { starBody: true, claws: true, tail: true,
         color: "#000000", headFill: "#0a0a0a", eyes: "white" },         // Void Beast: a black body hiding empty stars
  340: { hueCycle: true, marks: true, marksKind: "glyphs", claws: true,
         size: 1.1, color: "#1a237e" },                                  // Cosmic Beast: shifting constellations across its body
  341: { morph: true, alpha: 0.7, color: "#9575cd", headFill: "#e1bee7", glow: "#ce93d866" }, // Dream Beast: changes shape every few seconds
  342: { color: "#000000", headFill: "#050505", eyes: null,
         claws: true, furry: true, muzzle: "#000000", lineW: 3 },        // Night Beast: only a dark silhouette, no visible face
  343: { head: "mirror", shine: true, claws: true,
         color: "#78909c", headFill: "#dbe7ec" },                        // Mirror Beast: reflects nearby stickmen perfectly
  344: { move: "teleport", sepia: true,
         marks: true, marksKind: "glyphs", marksColor: "#8d6e63" },      // Time Beast: sepia-toned, moves through different ages
  345: { glitch: true, windLines: true, color: "#4a148c", headFill: "#ce93d8" }, // Reality Beast: causes the whole screen to bend
  346: { alpha: 0.25, fade: false, armor: true,
         marks: true, marksKind: "glyphs", marksColor: "#bdbdbd",
         color: "#616161", headFill: "#757575" },                        // Forgotten One: ancient markings over near-invisible armor
  347: { eyes: null, alpha: 0.6, color: "#9e9e9e", headFill: "#f5f5f5" }, // The Nameless: no face, no identity
  348: { color: "#000000", headFill: "#f5f5f5" },                        // The First: the plain original prototype, nothing more
  349: { fade: true, dissolve: true, alpha: 0.5, color: "#9e9e9e", headFill: "#eeeeee" }, // The Last: fading away as it walks
  350: { eternalRing: true, halo: true, glow: "#ffd70088",
         color: "#c9a227", headFill: "#fffde7" },                        // The Eternal: never disappears until photographed

  // ---- desks, drawers & appliances (351-400) ----
  351: { head: "camera", color: "#212121", headFill: "#616161", trail: "photo" }, // Camera: black camera head, drops fake photos behind it
  352: { head: "folder", headFill: "#ffca28", color: "#f57f17",
         marks: true, marksKind: "paper", marksColor: "#ffffff" },       // Folder: manila folder head, loose papers fluttering off the top
  353: { head: "phone", headFill: "#111111", color: "#212121", glow: "#4fc3f755" }, // Phone: glowing smartphone screen cycling emoji
  354: { vehicleBody: "computer", color: "#37474f", headFill: "#eceff1" }, // Computer: monitor-and-tower body, arms and legs poke out
  355: { marks: true, marksKind: "keys", marksColor: "#455a64",
         color: "#37474f", headFill: "#cfd8dc" },                        // Keyboard: keycaps tiling its entire body
  356: { head: "mouseshape", tail: true, headFill: "#e0e0e0", color: "#616161" }, // Mouse: mouse-shaped head with a trailing cable tail
  357: { acc: "gamepad", color: "#263238", headFill: "#455a64" },        // Controller: grips a two-handed game controller
  358: { acc: "remote", color: "#212121", headFill: "#424242" },        // Remote: holds a button-covered remote out in front
  359: { head: "lamp", headFill: "#fff8e1", color: "#8d6e63", glow: "#fff9c4aa" }, // Lamp: a glowing lampshade head lighting the ground
  360: { overhead: "flame", headFill: "#fff3e0", color: "#f9a825", glow: "#ffb30066" }, // Candle: a small flame flickering above its head
  361: { chest: "book" },                                                // Book: an open book for a torso — already reads clearly, kept
  362: { marks: true, marksKind: "text", marksColor: "#4e342e",
         color: "#4e342e", headFill: "#efebe0" },                        // Dictionary: tiny scribbled unreadable text covers its body
  363: { acc: "newspaper", color: "#424242", headFill: "#fafafa" },      // Newspaper: carries a folded paper with headline lines
  364: { color: "#3e2723", headFill: "#fff8e1", glow: "#ffca2844" },     // Clock: warm brass clock-face head (shape already generic-matched)
  365: { move: "hobble", acc: "cane", speed: 0.55, beard: true, color: "#5f5f5f" }, // Old Man: kept — cane, hobble and beard already read clearly
  366: { acc: "moneybag", color: "#2e7d32", headFill: "#a5d6a7", glow: "#ffd70044" }, // Money Bag: hefts a bulging sack with a coin shine
  367: { marks: true, marksKind: "gems", marksColor: "#ce93d8",
         color: "#4a148c", headFill: "#ce93d8", shine: true },           // Diamond Collector: gem facets scattered over its body, glossy shine
  368: { vehicleBody: "trunk", color: "#6d4c41", headFill: "#ffd700" },  // Treasure Chest: a wooden chest body overflowing with gold
  369: { marks: true, marksKind: "keyring", marksColor: "#8d6e00",
         color: "#8d6e00", headFill: "#ffd54f" },                        // Key Master: dozens of keys dangling and jingling from its body
  370: { head: "lock", color: "#455a64", headFill: "#78909c" },         // Lock: a padlock head, silver-grey body
  371: { head: "door", color: "#6d4c41", headFill: "#8d6e63" },         // Door: a walking wooden doorway (shape already generic-matched)
  372: { head: "window", headFill: "#bbdefb", color: "#795548" },       // Window: a framed window head with a little sky scene inside
  373: { vehicleOnly: "chair" },                                         // Chair: a plain wooden chair walking on its own four legs
  374: { vehicleOnly: "table" },                                         // Table: a flat tabletop gliding along on four long legs
  375: { vehicleOnly: "sofa" },                                          // Sofa: a cushioned couch shuffling along on stubby feet
  376: { acc: "pillow", move: "slow", color: "#8d6e63", headFill: "#eceff1" }, // Bed: shuffles along hugging a pillow
  377: { vehicleBody: "toaster", trail: "toast", color: "#bdbdbd", headFill: "#eeeeee" }, // Toaster: chrome body, launches toast out the back
  378: { vehicleBody: "fridge", trail: "mist", color: "#eceff1", headFill: "#ffffff" }, // Fridge: tall white body, trailing cold mist
  379: { vehicleBody: "oven", glow: "#ff572266", color: "#424242", headFill: "#616161" }, // Oven: black body with a glowing hot window
  380: { vehicleBody: "vacuum", trail: "clean", color: "#c62828", headFill: "#e57373" }, // Vacuum: upright body, leaves a sparkling clean trail
  381: { vehicleOnly: "roomba", color: "#78909c", headFill: "#455a64" }, // Robot Vacuum: a low disc gliding randomly around the screen
  382: { back: "windkey", size: 0.82, move: "hop", color: "#c62828", headFill: "#ffccbc" }, // Clockwork Toy: small tin toy, jerking forward on a key
  383: { move: "pop", color: "#f57f17", headFill: "#fff176" },          // Jack-in-the-Box: springs upward in a sudden pop every few steps
  384: { head: "trophy", color: "#c9a227", headFill: "#ffd700", glow: "#ffd70055" }, // Trophy: gleaming gold trophy head
  385: { chest: "medals", color: "#546e7a", headFill: "#cfd8dc" },       // Medal: rows of medals pinned across its chest
  386: { acc: "cup", color: "#f9a825", headFill: "#fff59d", glow: "#ffd70044" }, // Champion: raises a championship cup overhead
  387: { head: "trophy", marks: true, marksKind: "cracks", marksColor: "#616161",
         alpha: 0.75, move: "droop", color: "#78909c", headFill: "#b0bec5" }, // Failure: a cracked, dulled trophy head and a slumped walk
  388: { trail: "confetti" },                                            // Confetti: bursts colourful paper with every step
  389: { move: "dance", orbit: 2, orbitKind: "balloon", hueCycle: true }, // Party: dances nonstop, balloons bobbing around it
  390: { move: "slow", eyes: "closed" },                                 // Sleepwalker: shuffles along with its eyes shut
  391: { beak: "#f57f17", comb: true, eyes: "glow", color: "#4a5d4a", headFill: "#8ba888" }, // Zombie Chicken: rotting skin, a beak and comb
  392: { hat: "pirate", halfRobot: true, color: "#546e7a", headFill: "#b0bec5" }, // Robot Pirate: a tricorn hat over a half-mechanical body
  393: { hat: "cowboy", trail: "spark", color: "#455a64", headFill: "#cfd8dc" }, // Cowboy Robot: metal body, sparking laser-lasso trail
  394: { hat: "wizard", acc: "staff", color: "#37474f", headFill: "#b0bec5" }, // Wizard Robot: robotic wizard with hat and staff
  395: { hat: "chef", eyes: "alien", headFill: "#8bc34a", color: "#33691e" }, // Alien Chef: green-skinned alien in a chef's toque
  396: { hat: "helmet", acc: "rapier", color: "#1a237e", headFill: "#7986cb" }, // Space Pirate: a space helmet and a drawn blade
  397: { hat: "chef", acc: "pan", starBody: true, orbit: 3, orbitKind: "planet",
         color: "#3f2b7e", headFill: "#241b4d" },                        // Galaxy Chef: cooks tiny orbiting planets in a pan
  398: { holdMachine: true, overhead: "cloud", orbit: 2, orbitKind: "spark",
         glow: "#ce93d866", color: "#7e57c2", headFill: "#d1c4e9" },     // Dream Machine: a gripped machine puffing a sparkling dream cloud
  399: { holdMachine: true, orbit: 3, orbitKind: "miniobj",
         color: "#37474f", headFill: "#b0bec5" },                        // Reality Printer: a gripped machine, tiny printed copies orbiting
  400: { acc: "folder", orbit: 2, orbitKind: "page", color: "#000000", headFill: "#f5f5f5" }, // The Collector: a folder and drifting pages
  414: { chest: "core" },                                                // AI Core
  420: { overhead: "cloud" },                                            // Sad
  424: { overhead: "bulb" },                                             // Idea

  // ---- the civic & vehicle set (425-439) ----
  425: { overhead: "bulb", holdMachine: true, color: "#5d4037",
         headFill: "#ffcc80", glow: "#fff59d66" },                       // Inventor: bulb overhead + a machine gripped in both hands
  426: { acc: "wrench", color: "#455a64", headFill: "#cfd8dc" },         // Engineer: tool belt era, wrench in hand
  427: { acc: "pencilSmall", offAcc: "blueprint",
         color: "#37474f", headFill: "#eceff1" },                        // Architect: pencil + blueprint, one in each hand
  428: { hat: "hardhat", acc: "hammer", color: "#6d4c41", headFill: "#ffe0b2" }, // Builder Master: hard hat + hammer
  429: { hat: "tinycity", color: "#37474f", headFill: "#eceff1" },       // Tiny City: a miniature skyline worn on the head
  430: { hat: "castle", color: "#78909c", headFill: "#eceff1" },         // Living Castle: a castle worn on the head
  431: { hat: "castle", acc: "shield", color: "#546e7a", headFill: "#cfd8dc" }, // Fortress: castle on the head + a shield in hand
  432: { vehicleBody: "tower", legLen: 1, bodyLen: 1 },                  // Tower: a tall black-outline tower for a body, normal limbs
  433: { vehicleBody: "bridge" },                                        // Bridge: a black-outline bridge body, hands and feet poking out
  434: { trail: "road", color: "#424242", headFill: "#e0e0e0" },        // Road: a normal stickman leaving a fading road trail
  435: { vehicleOnly: "train" },                                        // Train: a small black-outline locomotive, no human parts
  436: { vehicleOnly: "car" },                                          // Car: just a black-outline car, no human parts
  437: { rideVehicle: "motorcycle", move: "moto",
         color: "#111111", headFill: "#ffe0b2" },                       // Motorcycle: a stickman riding a black-outline motorcycle
  438: { vehicleBody: "rocket" },                                       // Rocket: a black-outline rocket body, hands and feet poking out
  439: { overhead: "spaceship", color: "#37474f", headFill: "#b0bec5" }, // Spaceship: a normal figure with ships floating above

  // ---- the collector's cabinet (500-550): food, toys & games, performers ----
  500: { cloak: true, cloakColor: "#241b3d", color: "#3a2d5c", headFill: "#2f2547",
         acc: "book", glow: "#7c4dff77", orbit: 2, orbitKind: "page",
         marks: true, marksKind: "glyphs", marksColor: "#c9a227", eyes: "glow" }, // The Archivist: hooded keeper, glowing tome, orbiting pages, gold runes
  501: { hat: "chef", color: "#c62828", headFill: "#ffe0b2",
         orbit: 3, orbitKind: "ingredient" },                            // Chef Chaos: chef's toque, ingredients tumbling around it
  502: { head: "pizzaslice", headFill: "#ffca28", color: "#8d5a2b" },     // Pizza Master: a whole cheesy pizza slice for a head
  503: { head: "sushi", headFill: "#ffffff", color: "#37474f" },         // Sushi: nigiri rice + salmon + nori belt head
  504: { head: "coffeecup", headFill: "#f5f5f5", color: "#4e342e" },     // Coffee: a cup head with a handle and rising steam
  505: { hat: "kettle", orbit: 3, orbitKind: "cup",
         color: "#4e342e", headFill: "#ffe0b2" },                        // Tea Master: teapot hat, floating teacups
  506: { hat: "crown", color: "#ad1457", headFill: "#f8bbd0",
         orbit: 3, orbitKind: "candy" },                                 // Candy King: gold crown, wrapped candies orbiting
  507: { move: "run", speed: 2.2, trail: "candy",
         color: "#e91e63", headFill: "#fff59d" },                        // Sugar Rush: sprints, dropping candy behind it
  508: { head: "popcorn", headFill: "#fff8e1", color: "#8d6e63" },       // Popcorn: a striped bucket head, kernels spilling over
  509: { trail: "choco", color: "#5d4037", headFill: "#8d6e63",
         glow: "#6d4c3766" },                                            // Chocolate Factory: rivers of chocolate flow behind it
  510: { headFill: "#c78a4b", headDots: "chips", color: "#8d6e63",
         marks: true, marksKind: "crumbs", marksColor: "#6d4c41" },      // Cookie Monster: choc-chip head, crumbs falling off its body
  511: { head: "scoops", headFill: "#ffccbc", headDots: "sprinkles",
         acc: "wand", color: "#7e57c2" },                                // Ice Cream Wizard: triple-scoop sprinkled head, magic wand
  512: { head: "watermelon", headFill: "#43a047", color: "#111111",
         acc: "katana" },                                                // Fruit Ninja: watermelon head, katana drawn mid-slice
  513: { head: "cabbage", headFill: "#7cb342", armor: true,
         acc: "shield", color: "#33691e" },                              // Vegetable Knight: leafy cabbage head, full plate armor + shield
  514: { head: "circle", headFill: "#ffd700", stem: true, shine: true,
         glow: "#ffd70066" },                                            // Golden Apple: gilded apple head with stem, leaf and a shine
  515: { head: "mysterybox", headFill: "#5d4037", color: "#3e2723",
         eyes: null },                                                   // Mystery Box: a crate with a colour-shifting "?" hiding its form
  516: { head: "giftbox", headFill: "#c62828", color: "#7a1f1f" },       // Gift: a wrapped present head with ribbon and a bow
  517: { head: "toybox", headFill: "#8d6e63", color: "#5d4037" },        // Toy Box: an open crate head with tiny toys peeking out
  518: { head: "rubik", headFill: "#1b1b1b", color: "#111111" },         // Rubik: a 3x3 cube head whose tiles keep shifting colour
  519: { head: "puzzlepiece", headFill: "#42a5f5", color: "#0d47a1",
         marks: true, marksKind: "puzzle", marksColor: "#1565c0" },      // Puzzle Master: a jigsaw-piece head, seams rearranging on its body
  520: { head: "dice", headFill: "#e53935", color: "#7f0000", move: "spin" }, // Dice Roller: a rolling dice head instead of walking
  521: { head: "dice", headFill: "#ffd700", color: "#8d6e00",
         glow: "#ffd70088", orbit: 2, orbitKind: "spark" },              // Lucky Dice: a golden dice head, always shining
  522: { acc: "cards", trail: "cards", color: "#212121", headFill: "#eeeeee" }, // Card Dealer: a fanned hand of cards, throwing them behind
  523: { orbit: 3, orbitKind: "card", cloak: true, cloakColor: "#311b92",
         color: "#4a148c", headFill: "#ce93d8" },                        // Magic Card: a cloaked magician with cards orbiting its body
  524: { head: "puzzlepiece", hueCycle: true,
         marks: true, marksKind: "puzzle", marksColor: "#ffffff" },      // Jigsaw: a rainbow puzzle-piece head, seams across its whole body
  525: { hat: "crown", color: "#111111", headFill: "#eeeeee",
         marks: true, marksKind: "chess", marksColor: "#111111" },       // Chess Master: a crown and a checkerboard body
  526: { head: "knightpiece", headFill: "#212121", color: "#000000", move: "hop" }, // Checkmate: a chess-knight head that hops like the piece moves
  527: { head: "domino", headFill: "#fdf6e3", color: "#212121", trail: "domino" }, // Domino: a pipped domino-tile head, leaving tiles behind
  528: { head: "legobrick", headFill: "#fdd835", color: "#f57f17",
         orbit: 2, orbitKind: "block" },                                 // Lego Builder: a studded brick head, tiny blocks floating around it
  529: { head: "android", headFill: "#e53935", color: "#1565c0", size: 0.85 }, // Toy Robot: a small, brightly coloured toy-robot body
  530: { hat: "shako", color: "#78909c", headFill: "#b0bec5" },          // Tin Soldier: old tin-toy soldier hat in dull metal tones
  531: { back: "windkey", color: "#546e7a", headFill: "#cfd8dc" },       // Wind-Up Hero: a giant wind-up key turning on its back
  532: { hat: "crown", chest: "gearTrain", color: "#8d6e00", headFill: "#ffe0b2" }, // Clockwork King: golden crown, meshing gears in its chest
  533: { color: "#78909c", headFill: "#cfd8dc", alpha: 0.85,
         marks: true, marksKind: "cracks", marksColor: "#37474f" },      // Broken Toy: dulled colours, cracked seams held together
  534: { furry: true, ears: "bear", eyes: "big",
         color: "#a1887f", headFill: "#d7ccc8" },                        // Stuffed Animal: soft plush fur, round ears, big button eyes
  535: { strings: true, overhead: "controlbar",
         color: "#4e342e", headFill: "#d7ccc8" },                        // Puppet Master: a wooden control bar and strings above itself
  536: { hat: "crown", strings: true, overhead: "controlbar",
         color: "#8d6e00", headFill: "#ffe0b2" },                        // Marionette King: golden crown and puppet strings
  537: { head: "balloon", headFill: "#e53935", color: "#7a1f1f", move: "float" }, // Balloon Friend: a floating balloon body on a string
  538: { trail: "bubble", orbit: 3, orbitKind: "bubble",
         color: "#4fc3f7", headFill: "#e1f5fe" },                        // Bubble Master: trailing and orbiting soap bubbles
  539: { alpha: 0.5, trail: "rainbow", headFill: "#e1f5fe",
         shine: true, shineColor: "#ffffffcc" },                         // Soap Bubble: transparent body with a rainbow shimmer trail
  540: { head: "discoball", headFill: "#cfd8dc", color: "#78909c",
         move: "spin", glow: "#b3e5fc88" },                              // Mirror Ball: a faceted disco-ball head, always spinning
  541: { trail: "spark", move: "dance", glow: "#ce93d888",
         color: "#4a148c", headFill: "#f8bbd0" },                        // Disco Legend: glowing sparks trailing a dance routine
  542: { acc: "guitar", trail: "spark", color: "#212121", headFill: "#eceff1" }, // Rock Star: an electric guitar and crackling lightning
  543: { acc: "mic", orbit: 2, orbitKind: "spark",
         color: "#ec407a", headFill: "#f8bbd0", glow: "#f8bbd066" },     // Pop Star: a microphone and a sparkling outfit
  544: { ears: "phones", orbit: 3, orbitKind: "wave",
         color: "#212121", headFill: "#37474f" },                       // DJ Master: headphones, floating soundwaves it controls
  545: { chest: "musicbox", color: "#8d6e63", headFill: "#d7ccc8" },     // Music Box: a tiny ornate music box in its chest
  546: { move: "twirl", color: "#f48fb1", headFill: "#fce4ec" },        // Ballerina: soft pastels, a graceful spinning dance
  547: { hat: "clown", orbit: 3, orbitKind: "ball",
         color: "#1e88e5", headFill: "#ffe0b2" },                        // Circus: a clown hat, juggling balls arcing overhead
  548: { hat: "jester", color: "#6a1b9a", headFill: "#ffd700", move: "dance" }, // Jester King: a four-point jester hat, chaotic dancing
  549: { morph: true },                                                  // The Performer: changes its whole look every moment
  550: { hat: "tophat", acc: "cane", glow: "#ffd70088", trail: "spark",
         size: 1.15, orbit: 3, orbitKind: "spark",
         color: "#212121", headFill: "#eeeeee" },                        // The Entertainer: a grand showman leaving sparks wherever it walks

  // ---- unfinished builds, glitches & digital archive (600-650) ----
  600: { sepia: true, haloRings: 3, orbit: 0, glow: "#8d6e4088", color: "#6d5843", headFill: "#d7ccc1" }, // The Endless: ancient, faded, ringed by time itself
  601: { dash: true, alpha: 0.8, color: "#9e9e9e", headFill: "#f0f0f0" }, // Prototype: a rough, unfinished sketch-line figure
  602: { emblemText: "BETA", glowText: "#42a5f5", color: "#455a64", headFill: "#cfd8dc" }, // Beta: stamped with an experimental build label
  603: { emblemText: "ALPHA", glowText: "#ff7043", erased: true, color: "#6d4c41", headFill: "#ffccbc" }, // Alpha: the very first test build, chunks missing
  604: { marks: true, marksKind: "text", marksColor: "#66bb6a",
         emblemText: "DEBUG", glowText: "#66bb6a", color: "#37474f", headFill: "#b0bec5" }, // Developer Build: debug scrawl and a stamped label
  605: { numberSwarm: true, color: "#455a64", headFill: "#cfd8dc" },     // Test Subject: covered in floating experiment numbers
  606: { morph: true, alpha: 0.6, color: "#795548", headFill: "#d7ccc8" }, // Rejected Design: flickers through discarded concepts
  607: { erased: true, alpha: 0.6, color: "#78909c", headFill: "#cfd8dc" }, // Scrapped: incomplete, chunks of it simply missing
  608: { pixelate: true, color: "#000000", headFill: "#212121" },       // Corrupted: rendered as broken black pixel blocks
  609: { echo: true, color: "#212121", headFill: "#111111" },           // Glitched Shadow: a stuttering afterimage trails behind it
  610: { glitch: true, crowdBody: true, color: "#4a148c", headFill: "#ce93d8" }, // Broken Reality: fragments of tiny figures in the wrong places
  611: { alpha: 0.5, eyes: null, color: "#000000", headFill: "#ff00ff" }, // Missing Texture: the classic magenta-and-black placeholder
  612: { color: "#39ff14", headFill: "#ff00ff", glow: "#ffffff33" },    // Wrong Color: a jarring, impossible clash that never settles
  613: { color: "#111111", headFill: "#000000", glow: "#ffffff77" },    // Negative: an inverted black head glowing white against dark limbs
  614: { move: "back", shine: true, color: "#00acc1", headFill: "#b2ebf2" }, // Mirror World: walks its own reflection, backwards
  615: { invert: true, color: "#5e35b1", headFill: "#d1c4e9" },         // Upside Reality: the world flips wherever it walks
  616: { shiver: true, windLines: true, color: "#607d8b", headFill: "#cfd8dc" }, // Broken Gravity: an erratic, wind-buffeted stumble
  617: { move: "twirl", color: "#8d6e63", headFill: "#d7ccc8" },        // Gravity Master: a controlled, graceful spin at will
  618: { move: "float", alpha: 0.7, color: "#90a4ae", headFill: "#eceff1" }, // Massless: drifts weightlessly with no footing
  619: { speed: 0.15, size: 1.3, color: "#4e4e4e", headFill: "#9e9e9e" }, // Infinite Weight: crushingly heavy, barely inches forward
  620: { glow: "#4fc3f7aa", alpha: 0.75, eyes: "glow", color: "#4fc3f7", headFill: "#e1f5fe" }, // Energy Form: a body of pure glowing light
  621: { trail: "spark", glow: "#ec407a99", color: "#ec407a", headFill: "#f8bbd0" }, // Plasma: bright flowing energy arcs off its body
  622: { fade: true, alpha: 0.8, color: "#7e57c2", headFill: "#d1c4e9" }, // Quantum: flickers between positions a beat apart
  623: { starBody: true, color: "#616161", headFill: "#eeeeee" },       // Particle: a body built from thousands of tiny points
  624: { move: "slither", color: "#00897b", headFill: "#b2dfdb" },      // Wave: its whole body ripples like a travelling signal
  625: { orbit: 2, orbitKind: "wave", color: "#26a69a", headFill: "#b2dfdb" }, // Frequency: soundwave arcs pulse outward as it moves
  626: { orbit: 3, orbitKind: "spark", color: "#26a69a", headFill: "#e0f2f1" }, // Signal: bursts of strange symbols scatter around it
  627: { head: "radio", headFill: "#8d6e63", color: "#4e342e" },        // Radio: old broadcast equipment for a head
  628: { overhead: "antenna", color: "#455a64", headFill: "#cfd8dc" },  // Broadcast: a tall antenna trailing floating messages
  629: { alpha: 0.5, fade: true, glitch: true, color: "#9e9e9e", headFill: "#e0e0e0" }, // Lost Signal: static hisses across its whole body
  630: { fade: true, alpha: 0.6, eyes: null, glow: "#78909c33", color: "#78909c", headFill: "#cfd8dc" }, // Unknown Signal: faint, faceless, no known source
  631: { marks: true, marksKind: "glyphs", marksColor: "#ce93d8",
         glow: "#ce93d866", color: "#7e57c2", headFill: "#e1bee7" },    // Dream Code: imaginary symbols drifting off a pastel body
  632: { alpha: 0.35, fade: true, eyes: "closed", color: "#283593", headFill: "#9fa8da" }, // Sleep Code: barely visible, dozing off mid-step
  633: { overhead: "thoughtbubble", color: "#8d6e63", headFill: "#d7ccc8" }, // Thought: a chain of bubbles rising to an idea above it
  634: { morph: true, hueCycle: true, headFill: "#f0f0f0" },            // Imagination: reshapes and recolours based on what's nearby
  635: { sepia: true, dissolve: true, alpha: 0.5, color: "#8d6e63", headFill: "#d7ccc8" }, // Memory Fragment: a half-dissolved, sepia-toned echo
  636: { overhead: "heart", alpha: 0.4, color: "#9e9e9e", headFill: "#e0e0e0" }, // Forgotten Friend: a faint companion nobody quite recalls
  637: { sepia: true, marks: true, marksKind: "cracks", marksColor: "#5d4037",
         orbit: 0, alpha: 0.7, color: "#6d4c41", headFill: "#d7ccc8" },  // Old Archive: a cracked, sun-faded old record
  638: { fade: true, alpha: 0.3, color: "#9e9e9e", headFill: "#eeeeee" }, // Hidden File: barely there, tucked out of sight
  639: { marks: true, marksKind: "text", marksColor: "#00e676",
         color: "#00e676", headFill: "#1b1b1b" },                       // Encrypted: matrix-green code scrawled over a black body
  640: { head: "lock", color: "#0d47a1", headFill: "#1565c0" },         // Password: a padlock face, deep authenticated blue
  641: { hueCycle: true, dash: true, headFill: "#f0f0f0" },             // Secret Code: sketchy and ever-shifting, never the same twice
  642: { head: "square", eyes: null, color: "#9e9e9e", headFill: "#e0e0e0" }, // Unknown User: a blank default profile icon
  643: { orbit: 3, orbitKind: "spark", glow: "#ffd70066", color: "#c9a227", headFill: "#fff8e1" }, // Administrator: gold control sparks orbiting
  644: { chest: "core", color: "#37474f", headFill: "#cfd8dc" },        // System Core: a glowing computer core for a chest — kept, already fits
  645: { marks: true, marksKind: "code", marksColor: "#00e676",
         color: "#212121", headFill: "#37474f" },                       // Root Access: green command-line text streaming down its body
  646: { erased: true, fade: true, dissolve: true, alpha: 0.25, color: "#9e9e9e", headFill: "#eeeeee" }, // Deleted: a faded, near-erased shape
  647: { sparkleBurst: true, glow: "#66bb6a66", color: "#43a047", headFill: "#c8e6c9" }, // Recovered: restored and sparkling with fresh health
  648: { head: "error", orbit: 0, headFill: "#37474f", color: "#ff1744" }, // Archive Error: a flickering, glitched ERROR screen for a head
  649: { photoFrameColor: "#9e9e9e", fade: true, alpha: 0.4, color: "#78909c", headFill: "#cfd8dc" }, // The Lost Entry: framed like a retrieved old photo
  650: { censor: true, orbit: 0, glow: "#ff1744aa", color: "#7a0000", headFill: "#4a0000" }, // The Forbidden Page: blacked out behind a censor bar

  // ---- the archive's own reflection: collectors, photos & meta (651-700) ----
  651: { chest: "book", marks: true, marksKind: "text", marksColor: "#4e342e",
         color: "#4e342e", headFill: "#d7ccc8" },                        // Hidden Scholar: books of unreadable text
  652: { acc: "scanner", color: "#37474f", headFill: "#cfd8dc" },        // Archive Researcher: a handheld Stickdex scanner
  653: { acc: "photostack", color: "#5d4037", headFill: "#d7ccc8" },     // Collector: a thick held stack of tiny photos
  654: { hat: "tophat", sepia: true, orbit: 0, color: "#6d4c41", headFill: "#d7ccc8" }, // First Collector: the vintage archive founder
  655: { head: "camera", marks: true, marksKind: "cracks", marksColor: "#616161",
         color: "#78909c", headFill: "#9e9e9e" },                        // Ancient Collector: a weathered stone camera
  656: { hat: "visor", color: "#37474f", headFill: "#b0bec5", glow: "#4fc3f733" }, // Future Collector: a glowing scan visor
  657: { starBody: true, orbit: 3, orbitKind: "specimen",
         color: "#4a148c", headFill: "#311b92" },                        // Dimension Collector: specimens from other worlds
  658: { acc: "detector", color: "#455a64", headFill: "#cfd8dc" },       // Rare Hunter: a pulsing rarity detector
  659: { move: "run", eyes: "glow", color: "#8d6e63", headFill: "#d7ccc8" }, // Legend Hunter: eager eyes fixed on the impossible
  660: { eyes: "cyclops", alpha: 0.85, color: "#546e7a", headFill: "#cfd8dc" }, // The Observer: one unblinking, silent eye
  661: { orbit: 1, orbitKind: "eye", color: "#37474f", headFill: "#cfd8dc" }, // The Watcher: a mysterious eye that follows
  662: { acc: "mic", orbit: 2, orbitKind: "wave", color: "#455a64", headFill: "#cfd8dc" }, // The Listener: recording the archive's sounds
  663: { acc: "camera", sepia: true, color: "#6d4c41", headFill: "#d7ccc8" }, // The Recorder: carries the very first camera
  664: { head: "camera", headFill: "#ffd700" },                          // The Photographer: the legendary golden camera — kept
  665: { photoFrameColor: "#ffffff", glow: "#ffffffaa", color: "#212121", headFill: "#fafafa" }, // The Snapshot: a bright freeze-frame flash
  666: { photoFrameColor: "#c9a227", shine: true, color: "#212121", headFill: "#fff8e1" }, // The Perfect Photo: sharp, vivid, gold-bordered
  667: { photoFrameColor: "#000000", color: "#f5f5f5", headFill: "#000000", eyes: "white" }, // The Negative Photo: tones fully inverted
  668: { dissolve: true, orbit: 0, alpha: 0.4, color: "#9e9e9e", headFill: "#eeeeee" }, // The Lost Photo: fading, escaping the archive
  669: { echo: true, sepia: true, color: "#8d6e63", headFill: "#d7ccc8" }, // The Moving Picture: a living, flickering photograph
  670: { marks: true, marksKind: "paint", color: "#5d4037", headFill: "#efebe0" }, // The Painting Walker: brushstrokes for a body
  671: { marks: true, marksKind: "pencil", marksColor: "#616161",
         color: "#757575", headFill: "#f5f5f5" },                        // The Sketch Walker: graphite cross-hatching
  672: { trail: "ink", color: "#0d0d0d", headFill: "#1a1a1a", alpha: 0.9 }, // The Ink Walker: flowing, dripping ink
  673: { marks: true, marksKind: "pencil", marksColor: "#c9a227",
         color: "#8d6e63", headFill: "#fdf6e3" },                        // The Paper Walker: creased folds of parchment
  674: { morph: true, color: "#ffffff", headFill: "#fdf6e3" },          // The Origami Master: endlessly refolding its shape
  675: { marks: true, marksKind: "keys", marksColor: "#42a5f7",
         color: "#42a5f7", headFill: "#0d47a1", glow: "#42a5f766" },     // The Blueprint: a glowing construction grid
  676: { dash: true, eyes: null, color: "#1976d2", headFill: "#bbdefb" }, // The Prototype Blueprint: sketched, unfinished, faceless
  677: { dissolve: true, color: "#8d6e63", headFill: "#d7ccc8" },        // The Unfinished: parts of its design missing
  678: { shine: true, glow: "#ffffff44", color: "#212121", headFill: "#fafafa" }, // The Complete: polished, flawless, finished
  679: { sepia: true, color: "#6d4c41", headFill: "#efebe0" },           // The Original: an aged, parchment-toned early design
  680: { echo: true, color: "#00acc1", headFill: "#b2ebf2" },            // The Copy: a perfect duplicate trailing itself
  681: { alpha: 0.75, glitch: true, color: "#616161", headFill: "#e0e0e0" }, // The Fake: something subtly, quietly wrong
  682: { emblemText: "✓", glowText: "#4caf50", eyes: "glow",
         color: "#212121", headFill: "#fafafa" },                        // The Real: confident, verified, unmistakable
  683: { marks: true, marksKind: "glyphs", marksColor: "#212121", color: "#000000", headFill: "#1a1a1a" }, // The Secret: symbols hidden in plain sight
  684: { fade: true, alpha: 0.4, color: "#78909c", headFill: "#cfd8dc" }, // The Hidden: only appears for a moment
  685: { alpha: 0.15, eyes: null, color: "#bdbdbd", headFill: "#f5f5f5" }, // The Forgotten: almost entirely erased
  686: { sparkleBurst: true, glow: "#ffca28aa", color: "#ff8f00", headFill: "#ffe0b2" }, // The Remembered: rediscovered, glowing warm
  687: { alpha: 0.6, overhead: "thoughtbubble", color: "#7e57c2", headFill: "#e1bee7" }, // The Dreamt: exists only in imagination
  688: { morph: true, color: "#9e9e9e", headFill: "#eeeeee" },           // The Imagined: reshapes for every different viewer
  689: { shine: true, glow: "#ba68c866", color: "#ba68c8", headFill: "#f3e5f5" }, // The Impossible Dream: vivid, solid, made real
  690: { haloRings: 2, size: 1.15, glow: "#c9a22799", color: "#8d6e00", headFill: "#ffd700" }, // The Myth: a legend finally confirmed
  691: { dash: true, alpha: 0.5, color: "#607d8b", headFill: "#cfd8dc" }, // The Rumor: an unconfirmed, sketchy whisper
  692: { orbit: 2, orbitKind: "spark", glow: "#26c6da88", color: "#00838f", headFill: "#b2ebf2" }, // The Discovery: something new, just found
  693: { morph: true, move: "pop", color: "#e91e63", headFill: "#f8bbd0" }, // The Surprise: pops into unexpected forms
  694: { eyes: null, emblemText: "?", glowText: "#616161", color: "#000000", headFill: "#1a1a1a" }, // The Mystery: no information recorded
  695: { eyes: null, alpha: 0.7, color: "#bdbdbd", headFill: "#e0e0e0" }, // The Unknown: an entirely blank entry
  696: { emblemText: "—", glowText: "#90a4ae", color: "#546e7a", headFill: "#cfd8dc" }, // The Unnamed: a dash where a title should be
  697: { erased: true, dash: true, alpha: 0.55, color: "#9e9e9e", headFill: "#eeeeee" }, // The Unrecorded: missing from every archive
  698: { head: "page", headFill: "#fffffe", color: "#000000", orbit: 0 }, // The First Page: crisp, solid, foundational
  699: { shine: true, eyes: null, color: "#7a0000", headFill: "#f5f5f5" }, // The Last Page: sealed, unopened, unread
  700: { acc: "folder", orbit: 3, orbitKind: "page", haloRings: 2,
         color: "#1a237e", headFill: "#c5cae9", glow: "#3949ab77" },     // The Endless Archive: carrying an infinite Stickdex
  703: { acc: "pencil", trail: "print" },                                // The Creator draws reality
  704: { acc: "pencil", trail: "print" },                                // The Artist
  851: { suit: true, glow: "#9575cd88", color: "#311b92" },              // The Unknown Traveler's suit
  927: { companion: "clock" },                                           // The Time Master
  935: { companion: "clock" },                                           // The Endless Clock
  936: { companion: "clock" },                                           // The Impossible Clock
  937: { companion: "clock" },                                           // The World Clock
  938: { companion: "clock" },                                           // The Universe Clock
  939: { companion: "clock" },                                           // The Final Clock

  // ---- the deep archive (951-999): each crafted to its name/description ----
  951: { head: "page", headFill: "#ffffff", headScale: 1.5, color: "#9e9e9e",
         glow: "#fff9c4bb", move: "float", eyes: null },                 // The Final Page — a glowing empty page
  952: { head: "circle", headFill: "#fdfdfd", color: "#e2e2e2", lineW: 1.6,
         eyes: null, glow: "#eeeeee66" },                                // The Blank Entry — near-featureless white
  953: { head: "missing", headFill: "#263238", color: "#111111", lineW: 3,
         headScale: 1.15, eyes: null, noFlip: true, move: "float" },     // The Missing Entry — redacted "?"
  954: { head: "circle", headFill: "#f7f7f7", color: "#9e9e9e", dash: true,
         eyes: null, move: "slow" },                                     // The Unwritten — dashed, unfinished
  955: { head: "circle", headFill: "#ffffff", color: "#cfcfcf", dash: true,
         eyes: null, alpha: 0.16, move: "teleport" },                    // The Unseen — barely there
  956: { head: "circle", headFill: "#eceff1", color: "#78909c", acc: "magnifier",
         glow: "#b0bec555" },                                            // The Unfound — searching, muted
  957: { head: "triangle", headFill: "#ffcdd2", color: "#c62828", glitch: true,
         move: "float", emblemText: "!", glowText: "#ff5252", noFlip: true }, // The Impossible Find
  958: { head: "circle", headFill: "#fff59d", color: "#c9a227", acc: "clover",
         numberSwarm: "#c9a227", glow: "#ffd54faa", noFlip: true, move: "float" }, // The Lucky Million
  959: { head: "infinity", headFill: "#311b92", color: "#7c4dff", starBody: true,
         haloRings: 3, glow: "#7c4dffaa", move: "float", eyes: "white" }, // The One In Forever
  960: { head: "circle", headFill: "#455a64", color: "#37474f", chest: "eye",
         eyes: "glow", glow: "#ffd54f66" },                              // The Hidden Truth — an all-seeing eye
  961: { head: "folder", acc: "key", orbit: 3, orbitKind: "page",
         color: "#8d6e63", glow: "#ffe08277" },                         // The Archive Secret — a folder of pages
  962: { head: "circle", headFill: "#d7ccc8", color: "#6d4c41", hat: "bowler",
         photoFrameColor: "#8d6e63", sepia: true },                      // The First Photograph — sepia + frame
  963: { head: "circle", headFill: "#ffe082", color: "#b8860b", acc: "folder",
         emblemText: "1", glowText: "#ffd700", glow: "#ffd70066", noFlip: true, move: "float" }, // The First Collection
  964: { head: "circle", headFill: "#ffffff", color: "#000000", lineW: 2,
         glow: "#ffd70044" },                                            // The Original Stickman — plain, faint gold
  965: { head: "circle", headFill: "#e1f5fe", color: "#0288d1", perfectRings: true,
         glow: "#4fc3f788", eyes: null },                                // The Perfect Circle
  966: { head: "circle", headFill: "#fff8e1", color: "#c9a227", eternalRing: true,
         glow: "#ffd54f77" },                                            // The Eternal Circle
  967: { head: "circle", headFill: "#e0e0e0", color: "#757575" },        // The Last Common — utterly ordinary, greyed
  968: { head: "circle", headFill: "#ffffff", color: "#000000", glow: "#ffd700aa",
         orbit: 3, orbitKind: "spark" },                                 // The Rare Common — a common that shimmers gold
  969: { head: "circle", headFill: "#ffffff", color: "#000000", echo: true,
         glow: "#9e9e9e44" },                                            // The Hidden Ordinary — a hidden double
  970: { head: "circle", headFill: "#fff9c4", color: "#a1887f", hat: "crown",
         marks: true, marksColor: "#b0a080", emblemText: "?", glowText: "#bdbdbd",
         noFlip: true, move: "float" },                                  // The Fake Rare — a cardboard legend
  971: { head: "square", headFill: "#b39ddb", color: "#6a1b9a", glitch: true,
         orbit: 3, orbitKind: "page" },                                  // The Archive Glitch
  972: { head: "diamond", headFill: "#fff59d", color: "#c9a227", glitch: true,
         glow: "#ffd54faa", eyes: "glow" },                             // The Perfect Glitch — a deliberate one
  973: { head: "error", headFill: "#212121", color: "#b71c1c", lineW: 2.6,
         noFlip: true, move: "float" },                                  // The Final Error
  974: { head: "earth", headFill: "#42a5f5", color: "#37474f", erased: true,
         glitch: true },                                                 // The Deleted World — half-erased
  975: { head: "galaxyorb", headFill: "#1a103a", color: "#4a3f6b", alpha: 0.5,
         fade: true, move: "float", starBody: false, eyes: null },       // The Lost Universe — fading galaxy
  976: { head: "galaxyorb", headFill: "#160d33", color: "#7c4dff", glow: "#7c4dffaa",
         move: "float", haloRings: 2, starBody: false, eyes: null },     // The Last Universe — the final galaxy
  977: { head: "void", headFill: "#0a0a14", color: "#2a2340", move: "float",
         starBody: false, eyes: null },                                  // The Empty Universe — a hole in space
  978: { head: "circle", headFill: "#b2dfdb", color: "#00897b", restart: true,
         glow: "#26a69a77", move: "float" },                             // The Beginning Again
  979: { head: "circle", headFill: "#e0f2f1", color: "#00796b", restart: "endless",
         glow: "#4db6ac88", move: "float" },                             // The Endless Beginning
  980: { head: "sun", headFill: "#ffca28", color: "#fb8c00", glow: "#ffb300aa",
         move: "float", eyes: null },                                    // The Final Beginning — a rising sun
  981: { head: "circle", headFill: "#ffccbc", color: "#4e342e", acc: "camera",
         overhead: "cursor" },                                           // The Player — camera + cursor
  982: { head: "camera", headFill: "#ffd700", color: "#b8860b", sparkleBurst: true,
         glow: "#ffd70088" },                                            // The Photographer — the golden camera
  983: { head: "circle", headFill: "#fff59d", color: "#b8860b", hat: "crown",
         acc: "folder", orbit: 3, orbitKind: "page", glow: "#ffd70088" }, // The Collector — crowned, complete
  984: { head: "circle", headFill: "#ffe0b2", color: "#ef6c00", overhead: "heart",
         move: "dance" },                                                // The Friend — warm, waving, a heart
  985: { head: "circle", headFill: "#37474f", color: "#263238", crowdBody: true,
         size: 1.15, eyes: "white" },                                    // The Community — a body of many
  986: { head: "circle", headFill: "#e3f2fd", color: "#64b5f6", alpha: 0.62,
         orbit: 4, orbitKind: "photo", glow: "#90caf966", move: "float" }, // The Memory — photos orbiting
  987: { head: "storybook", headFill: "#fff8e1", color: "#8d6e63", headScale: 1.2,
         glow: "#ffe08277" },                                            // The Story — an open book
  988: { head: "circle", headFill: "#d7ccc8", color: "#5d4037", pathDots: true,
         trail: "print" },                                               // The Journey — a path of footprints
  989: { head: "circle", headFill: "#fff9c4", color: "#f9a825", overhead: "bulb",
         sparkleBurst: true, glow: "#fff17688" },                        // The Discovery — the spark of an idea
  990: { head: "star", headFill: "#e1bee7", color: "#8e24aa", orbit: 3,
         orbitKind: "spark", glow: "#ce93d888", move: "float" },         // The Wonder
  991: { head: "question", headFill: "#d1c4e9", color: "#5e35b1", orbit: 2,
         orbitKind: "page", glow: "#7c4dff77", move: "float" },          // The Mystery Beyond
  992: { head: "void", headFill: "#0a0a14", color: "#4a3f6b", dissolve: true,
         move: "float", eyes: null },                                    // The Unknown Beyond
  993: { head: "circle", headFill: "#fff8e1", color: "#8d6e63", orbit: 5,
         orbitKind: "page", marks: true, marksKind: "glyphs", marksColor: "#ffb300",
         glow: "#ffe08277", move: "float" },                            // The Infinite Archive
  994: { head: "infinity", headFill: "#4527a0", color: "#5e35b1", hueCycle: true,
         glow: "#7c4dff88", move: "float", eyes: "white", orbit: 0 },    // The Never Ending
  995: { head: "circle", headFill: "#e3f2fd", color: "#42a5f5", acc: "pageHeld",
         glowText: "#42a5f5", glow: "#90caf988", noFlip: true },         // The Next Page — a page not yet written
  996: { head: "holo", headFill: "#00363a", color: "#26c6da", glow: "#26c6daaa",
         move: "float", emblemText: "v?", glowText: "#26c6da", noFlip: true }, // The Future Entry
  997: { head: "circle", headFill: "#455a64", color: "#263238", censor: true,
         noFlip: true, move: "float" },                                  // The Unreleased — COMING SOON
  998: { head: "circle", headFill: "#1a1a1a", color: "#000000", eyes: "white",
         emblemText: "1000", glowText: "#ffd70099", alpha: 0.85, orbit: 0,
         noFlip: true, move: "float" },                                  // The Hidden 1000 — a shadow of the king
  999: { head: "circle", headFill: "#ede7f6", color: "#4527a0", dissolve: true,
         emblemText: "999", glowText: "#241b4d", glow: "#7c4dff55",
         move: "float", noFlip: true },                                  // The Last Known — dissolving into the unknown

  1000: { head: "sign", signText: "STICKMAN ARCHIVE", auraFlame: true,   // The Archive Itself — the king
          move: "kingfloat", headScale: 1.7, color: "#111111",
          headFill: "#ffffff", lineW: 2.4 }
};

// ------------------------------------------------------------------
// Skeleton helpers
// ------------------------------------------------------------------

function ik(ox, oy, tx, ty, l1, l2, bend) {
  let dx = tx - ox, dy = ty - oy;
  let d = Math.hypot(dx, dy);
  const maxd = l1 + l2 - 0.4;
  if (d > maxd) { const k = maxd / d; dx *= k; dy *= k; d = maxd; tx = ox + dx; ty = oy + dy; }
  if (d < 0.1) { d = 0.1; ty = oy + 0.1; }
  const cos = Math.min(1, Math.max(-1, (l1 * l1 + d * d - l2 * l2) / (2 * l1 * d)));
  const ang = Math.atan2(ty - oy, tx - ox) + bend * Math.acos(cos);
  return [ox + l1 * Math.cos(ang), oy + l1 * Math.sin(ang), tx, ty];
}

function drawLimb(ctx, ox, oy, pts) {
  const [jx, jy, ex, ey] = pts;
  const mx = (ox + ex) / 2, my = (oy + ey) / 2;
  const cx = jx + (jx - mx) * 0.55, cy = jy + (jy - my) * 0.55;
  ctx.beginPath();
  ctx.moveTo(ox, oy);
  ctx.quadraticCurveTo(cx, cy, ex, ey);
  ctx.stroke();
}

function regularPoly(ctx, cx, cy, r, n, rot) {
  ctx.beginPath();
  for (let i = 0; i < n; i++) {
    const a = rot + (i * 2 * Math.PI) / n;
    const x = cx + r * Math.cos(a), y = cy + r * Math.sin(a);
    i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
  }
  ctx.closePath();
}

// One continuous puffy-cloud silhouette (no internal seams): a gently
// curved base with a run of bumps over the top.
function cloudPath(ctx, cx, cy, r) {
  const b = cy + r * 0.55;
  ctx.moveTo(cx - r * 1.15, b);
  ctx.quadraticCurveTo(cx - r * 1.45, b - r * 0.55, cx - r * 0.95, b - r * 0.75);
  ctx.quadraticCurveTo(cx - r * 0.95, b - r * 1.55, cx - r * 0.25, b - r * 1.4);
  ctx.quadraticCurveTo(cx + r * 0.05, b - r * 1.95, cx + r * 0.6, b - r * 1.45);
  ctx.quadraticCurveTo(cx + r * 1.25, b - r * 1.4, cx + r * 1.05, b - r * 0.7);
  ctx.quadraticCurveTo(cx + r * 1.45, b - r * 0.4, cx + r * 1.1, b);
  ctx.quadraticCurveTo(cx + r * 0.4, b + r * 0.18, cx, b);
  ctx.quadraticCurveTo(cx - r * 0.5, b + r * 0.18, cx - r * 1.15, b);
  ctx.closePath();
}

function starPath(ctx, cx, cy, r) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const rad = i % 2 === 0 ? r : r * 0.45;
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const x = cx + rad * Math.cos(a), y = cy + rad * Math.sin(a);
    i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
  }
  ctx.closePath();
}

// One side's butterfly wing pair (fore + hind) extending +x from the wing
// root at (0,0); the caller mirrors and squashes it to fake the flap.
function butterflyWingPair(ctx, s, hue) {
  const edge = `hsl(${hue}, 55%, 30%)`;
  ctx.strokeStyle = edge;
  ctx.lineJoin = "round";
  // forewing
  ctx.fillStyle = `hsl(${hue}, 78%, 66%)`;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(2.5 * s, -3.5 * s, 5.5 * s, -10 * s, 10.5 * s, -11.5 * s);
  ctx.bezierCurveTo(13.5 * s, -12.3 * s, 14.6 * s, -10 * s, 13.2 * s, -7.6 * s);
  ctx.bezierCurveTo(11.6 * s, -4.6 * s, 5.6 * s, -1.2 * s, 0, 0);
  ctx.closePath();
  ctx.fill(); ctx.stroke();
  // hindwing
  ctx.beginPath();
  ctx.moveTo(0, 0.6 * s);
  ctx.bezierCurveTo(4 * s, 0.8 * s, 8.6 * s, 2.6 * s, 9.6 * s, 5.6 * s);
  ctx.bezierCurveTo(10.2 * s, 8.2 * s, 7.6 * s, 10 * s, 5.2 * s, 8.8 * s);
  ctx.bezierCurveTo(2.8 * s, 7.6 * s, 0.8 * s, 4 * s, 0, 0.6 * s);
  ctx.closePath();
  ctx.fill(); ctx.stroke();
  // warmer patches near the wing base
  ctx.fillStyle = `hsl(${(hue + 40) % 360}, 85%, 62%)`;
  ctx.beginPath();
  ctx.ellipse(4.2 * s, -3.6 * s, 2.6 * s, 1.5 * s, -0.75, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(3.6 * s, 3.4 * s, 2 * s, 1.2 * s, 0.65, 0, Math.PI * 2);
  ctx.fill();
  // veins radiating from the root
  ctx.save();
  ctx.globalAlpha *= 0.55;
  ctx.lineWidth = Math.max(0.7, s * 0.35);
  ctx.beginPath();
  for (const [vx, vy] of [[10.5, -10.5], [12.6, -7.8], [9.5, -4.6], [9.2, 5.2], [6.4, 8.2]]) {
    ctx.moveTo(0.6 * s, 0);
    ctx.lineTo(vx * s, vy * s);
  }
  ctx.stroke();
  ctx.restore();
  // white margin spots
  ctx.fillStyle = "#fff";
  for (const [px, py, pr] of [[11.6, -9.4, 0.9], [11.2, -6.6, 0.7], [7.9, 6.9, 0.8]]) {
    ctx.beginPath(); ctx.arc(px * s, py * s, pr * s, 0, Math.PI * 2); ctx.fill();
  }
}

// ------------------------------------------------------------------
// Head
// ------------------------------------------------------------------
function drawHead(ctx, f, cx, cy, r, t) {
  if (f.head === "saturn") { // back half of the ring, behind the planet
    ctx.save();
    ctx.strokeStyle = "#c9a66b";
    ctx.lineWidth = Math.max(1.4, r * 0.22);
    ctx.beginPath();
    ctx.ellipse(cx, cy, r * 1.75, r * 0.5, -0.3, Math.PI, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
  ctx.beginPath();
  switch (f.head) {
    case "square": ctx.rect(cx - r, cy - r, r * 2, r * 2); break;
    case "triangle": regularPoly(ctx, cx, cy, r * 1.15, 3, -Math.PI / 2); break;
    case "oval": ctx.ellipse(cx, cy, r * 0.75, r * 1.15, 0, 0, Math.PI * 2); break;
    case "diamond": regularPoly(ctx, cx, cy, r * 1.1, 4, -Math.PI / 2); break;
    case "rect": ctx.rect(cx - r * 0.65, cy - r * 1.25, r * 1.3, r * 2.5); break;
    case "poly5": regularPoly(ctx, cx, cy, r * 1.1, 5, -Math.PI / 2); break;
    case "poly6": regularPoly(ctx, cx, cy, r * 1.1, 6, 0); break;
    case "poly8": regularPoly(ctx, cx, cy, r * 1.1, 8, Math.PI / 8); break;
    case "heart":
      ctx.moveTo(cx, cy + r);
      ctx.bezierCurveTo(cx - r * 1.4, cy - r * 0.1, cx - r * 0.6, cy - r * 1.2, cx, cy - r * 0.35);
      ctx.bezierCurveTo(cx + r * 0.6, cy - r * 1.2, cx + r * 1.4, cy - r * 0.1, cx, cy + r);
      break;
    case "star": starPath(ctx, cx, cy, r * 1.25); break;
    case "cloud":
      cloudPath(ctx, cx, cy, r * 0.95);
      break;
    case "drop": {
      const byc = cy + r * 0.3, br = r * 0.85;
      ctx.moveTo(cx, cy - r * 1.35);
      ctx.quadraticCurveTo(cx + r * 0.6, cy - r * 0.45, cx + br * 0.707, byc - br * 0.707);
      ctx.arc(cx, byc, br, -Math.PI / 4, Math.PI * 1.25);
      ctx.quadraticCurveTo(cx - r * 0.6, cy - r * 0.45, cx, cy - r * 1.35);
      ctx.closePath();
      break;
    }
    case "dice": ctx.rect(cx - r, cy - r, r * 2, r * 2); break;
    case "lock": ctx.rect(cx - r * 0.9, cy - r * 0.35, r * 1.8, r * 1.35); break;
    case "door": ctx.rect(cx - r * 0.75, cy - r * 1.2, r * 1.5, r * 2.4); break;
    case "infinity":
      ctx.arc(cx - r * 0.55, cy, r * 0.55, 0, Math.PI * 2);
      ctx.moveTo(cx + r * 1.1, cy);
      ctx.arc(cx + r * 0.55, cy, r * 0.55, 0, Math.PI * 2);
      break;
    case "compass": ctx.arc(cx, cy, r, 0, Math.PI * 2); break;
    case "cross": {
      const a = r * 0.4;
      ctx.rect(cx - a, cy - r, a * 2, r * 2);
      ctx.rect(cx - r, cy - a, r * 2, a * 2);
      break;
    }
    case "crescent":
      ctx.arc(cx, cy, r, Math.PI * 0.35, Math.PI * 1.65);
      ctx.arc(cx + r * 0.55, cy, r * 0.75, Math.PI * 1.55, Math.PI * 0.45, true);
      ctx.closePath();
      break;
    case "tv": ctx.rect(cx - r * 1.1, cy - r * 0.85, r * 2.2, r * 1.7); break;
    case "clock": ctx.arc(cx, cy, r, 0, Math.PI * 2); break;
    case "donut": ctx.arc(cx, cy, r, 0, Math.PI * 2); break;
    case "pumpkin": ctx.arc(cx, cy, r * 1.05, 0, Math.PI * 2); break;
    case "mushroom": ctx.arc(cx, cy, r * 1.2, Math.PI, 0); ctx.closePath(); break;
    case "question": ctx.arc(cx, cy, r, 0, Math.PI * 2); break;
    case "scoops": // triple-scoop ice cream
      ctx.arc(cx, cy + r * 0.55, r * 0.75, 0, Math.PI * 2);
      ctx.arc(cx, cy - r * 0.35, r * 0.62, 0, Math.PI * 2);
      ctx.arc(cx, cy - r * 1.1, r * 0.5, 0, Math.PI * 2);
      break;
    case "trophy":
      ctx.moveTo(cx - r * 0.9, cy - r);
      ctx.lineTo(cx + r * 0.9, cy - r);
      ctx.quadraticCurveTo(cx + r * 0.85, cy + r * 0.35, cx + r * 0.25, cy + r * 0.5);
      ctx.lineTo(cx + r * 0.25, cy + r * 0.8);
      ctx.lineTo(cx + r * 0.55, cy + r);
      ctx.lineTo(cx - r * 0.55, cy + r);
      ctx.lineTo(cx - r * 0.25, cy + r * 0.8);
      ctx.lineTo(cx - r * 0.25, cy + r * 0.5);
      ctx.quadraticCurveTo(cx - r * 0.85, cy + r * 0.35, cx - r * 0.9, cy - r);
      ctx.closePath();
      break;
    case "camera": ctx.rect(cx - r * 1.1, cy - r * 0.7, r * 2.2, r * 1.5); break;
    case "folder": {
      ctx.moveTo(cx - r, cy - r * 0.5);
      ctx.lineTo(cx - r * 0.3, cy - r * 0.5);
      ctx.lineTo(cx - r * 0.1, cy - r * 0.8);
      ctx.lineTo(cx + r, cy - r * 0.8);
      ctx.lineTo(cx + r, cy + r * 0.8);
      ctx.lineTo(cx - r, cy + r * 0.8);
      ctx.closePath();
      break;
    }
    case "battery": ctx.rect(cx - r * 1.1, cy - r * 0.6, r * 2, r * 1.2); break;
    case "phone": { // portrait smartphone screen, rounded corners
      const rr = r * 0.3;
      ctx.moveTo(cx - r * 0.62 + rr, cy - r * 1.15);
      ctx.lineTo(cx + r * 0.62 - rr, cy - r * 1.15);
      ctx.quadraticCurveTo(cx + r * 0.62, cy - r * 1.15, cx + r * 0.62, cy - r * 1.15 + rr);
      ctx.lineTo(cx + r * 0.62, cy + r * 1.15 - rr);
      ctx.quadraticCurveTo(cx + r * 0.62, cy + r * 1.15, cx + r * 0.62 - rr, cy + r * 1.15);
      ctx.lineTo(cx - r * 0.62 + rr, cy + r * 1.15);
      ctx.quadraticCurveTo(cx - r * 0.62, cy + r * 1.15, cx - r * 0.62, cy + r * 1.15 - rr);
      ctx.lineTo(cx - r * 0.62, cy - r * 1.15 + rr);
      ctx.quadraticCurveTo(cx - r * 0.62, cy - r * 1.15, cx - r * 0.62 + rr, cy - r * 1.15);
      ctx.closePath();
      break;
    }
    case "mouseshape": // computer-mouse body, tapered rear, rounded front
      ctx.moveTo(cx - r * 0.6, cy - r * 0.9);
      ctx.quadraticCurveTo(cx + r * 0.75, cy - r * 0.95, cx + r * 0.85, cy);
      ctx.quadraticCurveTo(cx + r * 0.75, cy + r * 0.95, cx - r * 0.6, cy + r * 0.9);
      ctx.quadraticCurveTo(cx - r * 0.85, cy, cx - r * 0.6, cy - r * 0.9);
      ctx.closePath();
      break;
    case "lamp": // lampshade cone over a small round base
      ctx.moveTo(cx - r * 0.35, cy + r * 0.9);
      ctx.lineTo(cx - r * 1.05, cy - r * 0.55);
      ctx.lineTo(cx + r * 1.05, cy - r * 0.55);
      ctx.lineTo(cx + r * 0.35, cy + r * 0.9);
      ctx.closePath();
      break;
    case "window": ctx.rect(cx - r * 1.05, cy - r * 0.95, r * 2.1, r * 1.9); break;
    case "radio": ctx.rect(cx - r * 1.15, cy - r * 0.7, r * 2.3, r * 1.5); break; // old broadcast-radio box
    case "banana": // curved fruit bowing downward, tips raised
      ctx.moveTo(cx - r * 1.15, cy - r * 0.4);
      ctx.quadraticCurveTo(cx, cy + r * 1.15, cx + r * 1.15, cy - r * 0.4);
      ctx.quadraticCurveTo(cx + r * 0.6, cy + r * 0.3, cx, cy + r * 0.35);
      ctx.quadraticCurveTo(cx - r * 0.6, cy + r * 0.3, cx - r * 1.15, cy - r * 0.4);
      ctx.closePath();
      break;
    case "android": { // smooth rounded-square helmet
      const rr = r * 0.45;
      ctx.moveTo(cx - r + rr, cy - r * 0.95);
      ctx.lineTo(cx + r - rr, cy - r * 0.95);
      ctx.quadraticCurveTo(cx + r, cy - r * 0.95, cx + r, cy - r * 0.95 + rr);
      ctx.lineTo(cx + r, cy + r * 0.95 - rr);
      ctx.quadraticCurveTo(cx + r, cy + r * 0.95, cx + r - rr, cy + r * 0.95);
      ctx.lineTo(cx - r + rr, cy + r * 0.95);
      ctx.quadraticCurveTo(cx - r, cy + r * 0.95, cx - r, cy + r * 0.95 - rr);
      ctx.lineTo(cx - r, cy - r * 0.95 + rr);
      ctx.quadraticCurveTo(cx - r, cy - r * 0.95, cx - r + rr, cy - r * 0.95);
      ctx.closePath();
      break;
    }
    case "monitor": ctx.rect(cx - r * 1.55, cy - r * 0.62, r * 3.1, r * 1.24); break;
    case "meteor": { // jagged space rock
      const bumps = [1.05, 0.88, 1.1, 0.92, 1.02, 0.85, 1.08, 0.9, 1.0, 0.86];
      for (let i = 0; i < bumps.length; i++) {
        const a = (i / bumps.length) * Math.PI * 2;
        const rad = r * bumps[i];
        const x = cx + Math.cos(a) * rad, y = cy + Math.sin(a) * rad;
        i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      }
      ctx.closePath();
      break;
    }
    case "comet": ctx.arc(cx, cy, r * 0.95, 0, Math.PI * 2); break;
    case "saturn": ctx.arc(cx, cy, r, 0, Math.PI * 2); break;
    case "mirror": ctx.ellipse(cx, cy, r * 0.8, r * 1.1, 0, 0, Math.PI * 2); break;
    case "earth": ctx.arc(cx, cy, r, 0, Math.PI * 2); break;
    case "sign": { // a hanging placard reading "STICKMAN ARCHIVE"
      const sw = r * 2.9, sh = r * 1.8;
      ctx.rect(cx - sw / 2, cy - sh / 2, sw, sh);
      break;
    }
    case "frank": // Frankenstein flat-top: square crown, rounded jaw
      ctx.moveTo(cx - r * 0.95, cy - r * 0.95);
      ctx.lineTo(cx + r * 0.95, cy - r * 0.95);
      ctx.lineTo(cx + r * 0.95, cy + r * 0.25);
      ctx.quadraticCurveTo(cx + r * 0.85, cy + r * 1.05, cx, cy + r * 1.05);
      ctx.quadraticCurveTo(cx - r * 0.85, cy + r * 1.05, cx - r * 0.95, cy + r * 0.25);
      ctx.closePath();
      break;
    case "page": ctx.rect(cx - r * 0.85, cy - r * 1.12, r * 1.7, r * 2.24); break; // sheet of paper
    case "galaxyorb": ctx.arc(cx, cy, r, 0, Math.PI * 2); break;
    case "void": ctx.arc(cx, cy, r, 0, Math.PI * 2); break;
    case "sun": ctx.arc(cx, cy, r * 0.9, 0, Math.PI * 2); break;
    case "holo": ctx.arc(cx, cy, r, 0, Math.PI * 2); break;
    case "missing": ctx.rect(cx - r, cy - r, r * 2, r * 2); break;
    case "error": ctx.rect(cx - r * 1.25, cy - r * 0.85, r * 2.5, r * 1.7); break;
    case "storybook": // an open book, two pages meeting at a centre spine
      ctx.moveTo(cx, cy - r * 0.85);
      ctx.quadraticCurveTo(cx - r * 0.7, cy - r * 1.02, cx - r * 1.25, cy - r * 0.68);
      ctx.lineTo(cx - r * 1.25, cy + r * 0.78);
      ctx.quadraticCurveTo(cx - r * 0.7, cy + r * 0.58, cx, cy + r * 0.82);
      ctx.quadraticCurveTo(cx + r * 0.7, cy + r * 0.58, cx + r * 1.25, cy + r * 0.78);
      ctx.lineTo(cx + r * 1.25, cy - r * 0.68);
      ctx.quadraticCurveTo(cx + r * 0.7, cy - r * 1.02, cx, cy - r * 0.85);
      ctx.closePath();
      break;

    // ---- the collector's cabinet (500-550): literal object heads ----
    case "pizzaslice": // wedge with a curved crust top
      ctx.moveTo(cx, cy + r * 1.05);
      ctx.lineTo(cx - r * 1.05, cy - r * 0.55);
      ctx.quadraticCurveTo(cx, cy - r * 1.2, cx + r * 1.05, cy - r * 0.55);
      ctx.closePath();
      break;
    case "sushi": { // nigiri: rounded rice base
      const rw = r * 1.1, rh = r * 0.8;
      ctx.moveTo(cx - rw, cy + rh * 0.25);
      ctx.quadraticCurveTo(cx - rw, cy + rh, cx, cy + rh);
      ctx.quadraticCurveTo(cx + rw, cy + rh, cx + rw, cy + rh * 0.25);
      ctx.lineTo(cx + rw, cy - rh * 0.15);
      ctx.quadraticCurveTo(cx + rw, cy - rh * 0.95, cx, cy - rh * 0.95);
      ctx.quadraticCurveTo(cx - rw, cy - rh * 0.95, cx - rw, cy - rh * 0.15);
      ctx.closePath();
      break;
    }
    case "coffeecup": // trapezoid cup body (handle drawn in details)
      ctx.moveTo(cx - r * 0.85, cy - r * 0.9);
      ctx.lineTo(cx + r * 0.85, cy - r * 0.9);
      ctx.lineTo(cx + r * 0.62, cy + r * 0.95);
      ctx.lineTo(cx - r * 0.62, cy + r * 0.95);
      ctx.closePath();
      break;
    case "popcorn": { // bucket with a jagged popcorn-poking top edge
      const topY = cy - r * 0.85, botY = cy + r * 1.05, topW = r * 1.15, botW = r * 0.72;
      ctx.moveTo(cx - botW, botY);
      ctx.lineTo(cx - topW, topY + r * 0.3);
      const peaks = 5;
      for (let i = 0; i <= peaks; i++) {
        const fr = i / peaks;
        const x = cx - topW + fr * topW * 2;
        const y = topY + (i % 2 === 0 ? -r * 0.2 : r * 0.18);
        ctx.lineTo(x, y);
      }
      ctx.lineTo(cx + topW, topY + r * 0.3);
      ctx.lineTo(cx + botW, botY);
      ctx.closePath();
      break;
    }
    case "mysterybox": ctx.rect(cx - r * 1.05, cy - r * 1.05, r * 2.1, r * 2.1); break;
    case "giftbox": ctx.rect(cx - r, cy - r * 0.8, r * 2, r * 1.75); break;
    case "toybox": // open crate, wider at the rim
      ctx.moveTo(cx - r * 0.68, cy - r * 0.35);
      ctx.lineTo(cx - r * 1.05, cy + r * 1.0);
      ctx.lineTo(cx + r * 1.05, cy + r * 1.0);
      ctx.lineTo(cx + r * 0.68, cy - r * 0.35);
      ctx.closePath();
      break;
    case "rubik": ctx.rect(cx - r * 1.05, cy - r * 1.05, r * 2.1, r * 2.1); break;
    case "puzzlepiece": ctx.rect(cx - r * 1.05, cy - r * 1.05, r * 2.1, r * 2.1); break;
    case "domino": ctx.rect(cx - r * 0.75, cy - r * 1.3, r * 1.5, r * 2.6); break;
    case "legobrick": ctx.rect(cx - r * 1.05, cy - r * 0.4, r * 2.1, r * 1.45); break;
    case "balloon": // teardrop with a knotted base
      ctx.ellipse(cx, cy - r * 0.08, r * 0.92, r * 1.1, 0, 0, Math.PI * 2);
      break;
    case "discoball": ctx.arc(cx, cy, r, 0, Math.PI * 2); break;
    case "cabbage": cloudPath(ctx, cx, cy, r * 1.05); break;
    case "watermelon": ctx.arc(cx, cy, r, 0, Math.PI * 2); break;
    case "knightpiece": { // simplified chess-knight silhouette (horse head + base)
      ctx.moveTo(cx - r * 0.55, cy + r * 1.1);
      ctx.lineTo(cx - r * 0.7, cy + r * 0.5);
      ctx.quadraticCurveTo(cx - r * 0.8, cy - r * 0.1, cx - r * 0.35, cy - r * 0.55);
      ctx.quadraticCurveTo(cx - r * 0.55, cy - r * 0.95, cx - r * 0.25, cy - r * 1.15);
      ctx.quadraticCurveTo(cx - r * 0.05, cy - r * 0.95, cx - r * 0.15, cy - r * 0.7);
      ctx.quadraticCurveTo(cx + r * 0.35, cy - r * 0.85, cx + r * 0.75, cy - r * 0.55);
      ctx.quadraticCurveTo(cx + r * 0.9, cy - r * 0.4, cx + r * 0.8, cy - r * 0.15);
      ctx.quadraticCurveTo(cx + r * 0.55, cy - r * 0.2, cx + r * 0.45, cy - r * 0.02);
      ctx.quadraticCurveTo(cx + r * 0.62, cy + r * 0.35, cx + r * 0.62, cy + r * 0.75);
      ctx.lineTo(cx + r * 0.62, cy + r * 1.1);
      ctx.closePath();
      break;
    }
    case "origami": // angular folded-paper kite
      ctx.moveTo(cx, cy - r * 1.2);
      ctx.lineTo(cx + r * 0.9, cy - r * 0.1);
      ctx.lineTo(cx, cy + r * 1.1);
      ctx.lineTo(cx - r * 0.9, cy - r * 0.1);
      ctx.closePath();
      break;
    case "dinoskull": // dome cranium + jagged jaw teeth
      ctx.moveTo(cx - r * 0.9, cy - r * 0.3);
      ctx.quadraticCurveTo(cx - r * 1.0, cy - r * 1.1, cx, cy - r * 1.15);
      ctx.quadraticCurveTo(cx + r * 1.0, cy - r * 1.1, cx + r * 0.9, cy - r * 0.3);
      ctx.lineTo(cx + r * 1.1, cy + r * 0.15);
      ctx.lineTo(cx + r * 0.75, cy + r * 0.15);
      ctx.lineTo(cx + r * 0.6, cy + r * 0.55);
      ctx.lineTo(cx + r * 0.3, cy + r * 0.15);
      ctx.lineTo(cx, cy + r * 0.5);
      ctx.lineTo(cx - r * 0.3, cy + r * 0.15);
      ctx.lineTo(cx - r * 0.6, cy + r * 0.55);
      ctx.lineTo(cx - r * 0.75, cy + r * 0.15);
      ctx.lineTo(cx - r * 1.1, cy + r * 0.15);
      ctx.closePath();
      break;
    case "radsign": { // radiation trefoil: center disk + 3 pie-wedge blades
      const rr = r * 0.32;
      ctx.arc(cx, cy, rr, 0, Math.PI * 2);
      for (let k = 0; k < 3; k++) {
        const ang = -Math.PI / 2 + k * (Math.PI * 2 / 3);
        const a0 = ang - 0.42, a1 = ang + 0.42;
        ctx.moveTo(cx + Math.cos(a0) * rr, cy + Math.sin(a0) * rr);
        ctx.arc(cx, cy, rr, a0, a1);
        ctx.lineTo(cx + Math.cos(a1) * r, cy + Math.sin(a1) * r);
        ctx.arc(cx, cy, r, a1, a0, true);
        ctx.closePath();
      }
      break;
    }
    default: ctx.arc(cx, cy, r, 0, Math.PI * 2);
  }
  ctx.fillStyle = f.head === "pumpkin" ? "#ff8f00"
    : f.head === "trophy" ? "#ffd700"
    : f.head === "folder" ? "#ffe082"
    : f.headFill;
  ctx.fill();
  ctx.stroke();

  // shape details
  if (f.head === "tv" || f.head === "camera") {
    if (f.head === "tv") {
      ctx.beginPath();
      ctx.moveTo(cx - r * 0.5, cy - r * 0.85); ctx.lineTo(cx - r * 0.9, cy - r * 1.6);
      ctx.moveTo(cx + r * 0.5, cy - r * 0.85); ctx.lineTo(cx + r * 0.9, cy - r * 1.6);
      ctx.stroke();
    } else {
      ctx.beginPath(); ctx.arc(cx, cy + r * 0.05, r * 0.45, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = f.color;
      ctx.fillRect(cx + r * 0.55, cy - r * 0.45, r * 0.35, r * 0.22);
      ctx.fillRect(cx - r * 0.55, cy - r * 0.95, r * 0.5, r * 0.28);
    }
  } else if (f.head === "clock") {
    // tick marks at 12/3/6/9
    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      const a = i * Math.PI / 2;
      ctx.moveTo(cx + Math.cos(a) * r * 0.78, cy + Math.sin(a) * r * 0.78);
      ctx.lineTo(cx + Math.cos(a) * r * 0.92, cy + Math.sin(a) * r * 0.92);
    }
    ctx.stroke();
    // working hour + minute hands
    const hA = t * 0.35 - Math.PI / 2, mA = t * 1.9 - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(hA) * r * 0.42, cy + Math.sin(hA) * r * 0.42);
    ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(mA) * r * 0.68, cy + Math.sin(mA) * r * 0.68);
    ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, cy, r * 0.07, 0, Math.PI * 2);
    ctx.fillStyle = f.color; ctx.fill();
  } else if (f.head === "donut") {
    ctx.beginPath(); ctx.arc(cx, cy, r * 0.4, 0, Math.PI * 2);
    ctx.fillStyle = "#fff"; ctx.fill(); ctx.stroke();
  } else if (f.head === "pumpkin") {
    ctx.fillStyle = "#4e2600";
    regularPoly(ctx, cx - r * 0.4, cy - r * 0.2, r * 0.22, 3, -Math.PI / 2); ctx.fill();
    regularPoly(ctx, cx + r * 0.4, cy - r * 0.2, r * 0.22, 3, -Math.PI / 2); ctx.fill();
    ctx.fillRect(cx - r * 0.45, cy + r * 0.3, r * 0.9, r * 0.16);
    ctx.fillRect(cx - r * 0.08, cy - r * 1.35, r * 0.16, r * 0.4);
  } else if (f.head === "question") {
    ctx.fillStyle = f.color;
    ctx.font = `bold ${r * 1.5}px sans-serif`;
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("?", cx, cy + r * 0.08);
  } else if (f.head === "dice") {
    ctx.fillStyle = f.color;
    for (const p of [[-0.45, -0.45], [0.45, 0.45], [0, 0], [0.45, -0.45], [-0.45, 0.45]]) {
      ctx.beginPath(); ctx.arc(cx + p[0] * r, cy + p[1] * r, r * 0.13, 0, Math.PI * 2); ctx.fill();
    }
  } else if (f.head === "lock") {
    ctx.beginPath(); ctx.arc(cx, cy - r * 0.35, r * 0.55, Math.PI, 0); ctx.stroke();
    ctx.fillStyle = f.color;
    ctx.beginPath(); ctx.arc(cx, cy + r * 0.2, r * 0.16, 0, Math.PI * 2); ctx.fill();
    ctx.fillRect(cx - r * 0.06, cy + r * 0.2, r * 0.12, r * 0.4);
  } else if (f.head === "door") {
    ctx.fillStyle = f.color;
    ctx.beginPath(); ctx.arc(cx + r * 0.45, cy + r * 0.1, r * 0.12, 0, Math.PI * 2); ctx.fill();
  } else if (f.head === "compass") {
    ctx.fillStyle = "#d32f2f";
    ctx.beginPath();
    ctx.moveTo(cx, cy - r * 0.6); ctx.lineTo(cx + r * 0.18, cy + r * 0.15); ctx.lineTo(cx - r * 0.18, cy + r * 0.15);
    ctx.closePath(); ctx.fill();
  } else if (f.head === "trophy") {
    ctx.beginPath();
    ctx.arc(cx - r * 0.95, cy - r * 0.45, r * 0.35, Math.PI * 0.5, Math.PI * 1.5);
    ctx.moveTo(cx + r * 1.3, cy - r * 0.45);
    ctx.arc(cx + r * 0.95, cy - r * 0.45, r * 0.35, -Math.PI * 0.5, Math.PI * 0.5);
    ctx.stroke();
  } else if (f.head === "battery") {
    ctx.fillStyle = f.color;
    ctx.fillRect(cx + r * 0.9, cy - r * 0.2, r * 0.25, r * 0.4);
    ctx.fillStyle = "#66bb6a";
    ctx.fillRect(cx - r * 0.95, cy - r * 0.42, r * 1.2, r * 0.84);
  } else if (f.head === "folder") {
    ctx.beginPath();
    ctx.moveTo(cx - r, cy - r * 0.15); ctx.lineTo(cx + r, cy - r * 0.15);
    ctx.stroke();
  } else if (f.head === "phone") {
    // seam-line home indicator + a tiny cycling emoji
    ctx.strokeStyle = "#424242";
    ctx.beginPath(); ctx.moveTo(cx - r * 0.22, cy + r * 0.95); ctx.lineTo(cx + r * 0.22, cy + r * 0.95); ctx.stroke();
    const emojis = ["\u{1F600}", "\u{1F602}", "\u{1F60E}", "\u{1F973}"];
    ctx.fillStyle = "#ffeb3b";
    ctx.font = `${r * 1.1}px sans-serif`;
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(emojis[Math.floor(t) % emojis.length], cx, cy - r * 0.05);
  } else if (f.head === "mouseshape") {
    ctx.beginPath(); ctx.moveTo(cx, cy - r * 0.85); ctx.lineTo(cx, cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx - r * 0.05, cy - r * 0.4); ctx.lineTo(cx + r * 0.05, cy - r * 0.4); ctx.stroke();
  } else if (f.head === "lamp") {
    ctx.fillStyle = "#fff9c4";
    ctx.beginPath(); ctx.arc(cx, cy + r * 0.9, r * 0.22, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  } else if (f.head === "window") {
    ctx.save();
    ctx.beginPath(); ctx.rect(cx - r * 1.05, cy - r * 0.95, r * 2.1, r * 1.9); ctx.clip();
    ctx.fillStyle = "#e3f2fd"; ctx.fillRect(cx - r * 1.05, cy - r * 0.95, r * 2.1, r * 1.9);
    ctx.fillStyle = "#ffffff";
    cloudPath(ctx, cx - r * 0.2, cy + r * 0.15, r * 0.5); ctx.fill();
    ctx.restore();
    ctx.beginPath(); ctx.moveTo(cx, cy - r * 0.95); ctx.lineTo(cx, cy + r * 0.95);
    ctx.moveTo(cx - r * 1.05, cy); ctx.lineTo(cx + r * 1.05, cy);
    ctx.stroke();
  } else if (f.head === "radio") {
    // thin antenna, speaker grille dots, one tuning dial
    ctx.beginPath(); ctx.moveTo(cx + r * 0.6, cy - r * 0.7); ctx.lineTo(cx + r * 0.9, cy - r * 1.7); ctx.stroke();
    ctx.fillStyle = "#3e2723";
    for (let i = 0; i < 6; i++) {
      const gx = cx - r * 0.75 + (i % 3) * r * 0.55, gy = cy - r * 0.15 + Math.floor(i / 3) * r * 0.4;
      ctx.beginPath(); ctx.arc(gx, gy, r * 0.12, 0, Math.PI * 2); ctx.fill();
    }
    ctx.fillStyle = "#cfd8dc"; ctx.strokeStyle = "#3e2723";
    ctx.beginPath(); ctx.arc(cx + r * 0.75, cy + r * 0.15, r * 0.22, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  } else if (f.head === "banana") {
    // brown tips at both ends + ridge line along the curve
    ctx.fillStyle = "#6d4c41";
    ctx.beginPath();
    ctx.arc(cx - r * 1.12, cy - r * 0.4, r * 0.16, 0, Math.PI * 2);
    ctx.arc(cx + r * 1.12, cy - r * 0.4, r * 0.16, 0, Math.PI * 2);
    ctx.fill();
    ctx.save();
    ctx.strokeStyle = "#d4a017";
    ctx.lineWidth = Math.max(0.8, r * 0.09);
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.95, cy - r * 0.28);
    ctx.quadraticCurveTo(cx, cy + r * 0.72, cx + r * 0.95, cy - r * 0.28);
    ctx.stroke();
    ctx.restore();
  } else if (f.head === "android") {
    // glowing blue visor band + seam + side antennas
    ctx.save();
    ctx.fillStyle = "#29b6f6";
    ctx.shadowColor = "#4fc3f7"; ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.72, cy - r * 0.42);
    ctx.lineTo(cx + r * 0.78, cy - r * 0.42);
    ctx.quadraticCurveTo(cx + r * 0.92, cy - r * 0.12, cx + r * 0.78, cy + r * 0.1);
    ctx.lineTo(cx - r * 0.72, cy + r * 0.1);
    ctx.closePath(); ctx.fill();
    ctx.restore();
    ctx.beginPath(); // chin seam + ear studs
    ctx.moveTo(cx - r * 0.6, cy + r * 0.55); ctx.lineTo(cx + r * 0.6, cy + r * 0.55);
    ctx.stroke();
    ctx.fillStyle = "#78909c";
    ctx.fillRect(cx - r * 1.18, cy - r * 0.25, r * 0.2, r * 0.5);
    ctx.fillRect(cx + r * 0.98, cy - r * 0.25, r * 0.2, r * 0.5);
  } else if (f.head === "monitor") {
    // slim bezel screen on a stand, showing a face
    ctx.fillStyle = "#455a64";
    ctx.fillRect(cx - r * 1.42, cy - r * 0.5, r * 2.84, r * 1.0); // screen
    ctx.fillStyle = "#69f0ae";
    ctx.beginPath(); // face on screen
    ctx.arc(cx - r * 0.45, cy - r * 0.12, r * 0.09, 0, Math.PI * 2);
    ctx.arc(cx + r * 0.45, cy - r * 0.12, r * 0.09, 0, Math.PI * 2);
    ctx.fill();
    ctx.save();
    ctx.strokeStyle = "#69f0ae";
    ctx.lineWidth = Math.max(0.9, r * 0.09);
    ctx.beginPath();
    ctx.arc(cx, cy + r * 0.02, r * 0.42, Math.PI * 0.15, Math.PI * 0.85);
    ctx.stroke();
    ctx.restore();
    // stand: neck + foot
    ctx.fillStyle = f.color;
    ctx.fillRect(cx - r * 0.12, cy + r * 0.62, r * 0.24, r * 0.35);
    ctx.fillRect(cx - r * 0.5, cy + r * 0.95, r * 1.0, r * 0.14);
  } else if (f.head === "meteor") {
    // fire streaming off the trailing edge (-x), then craters
    ctx.save();
    ctx.shadowColor = "#ff7043"; ctx.shadowBlur = 8;
    const lick = Math.sin(t * 11) * r * 0.18;
    ctx.fillStyle = "#ff7043";
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.5, cy - r * 0.85);
    ctx.quadraticCurveTo(cx - r * 2.3, cy - r * 0.7 + lick, cx - r * 2.7, cy);
    ctx.quadraticCurveTo(cx - r * 2.2, cy + r * 0.6 - lick, cx - r * 0.5, cy + r * 0.85);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#ffd54f";
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.55, cy - r * 0.45);
    ctx.quadraticCurveTo(cx - r * 1.7, cy + lick * 0.6, cx - r * 0.55, cy + r * 0.45);
    ctx.closePath(); ctx.fill();
    ctx.restore();
    ctx.fillStyle = "#5d4037";
    for (const [px, py, pr] of [[0.35, -0.3, 0.22], [-0.15, 0.35, 0.28], [0.5, 0.35, 0.15]]) {
      ctx.beginPath(); ctx.arc(cx + px * r, cy + py * r, pr * r, 0, Math.PI * 2); ctx.fill();
    }
  } else if (f.head === "comet") {
    // streaking icy tail behind the bright core
    ctx.save();
    ctx.strokeStyle = "#90caf9";
    ctx.lineCap = "round";
    for (let i = 0; i < 3; i++) {
      const yy = cy + (i - 1) * r * 0.45;
      const wob = Math.sin(t * 6 + i * 2) * r * 0.15;
      ctx.globalAlpha *= 0.8;
      ctx.lineWidth = Math.max(1, r * (0.3 - i * 0.06));
      ctx.beginPath();
      ctx.moveTo(cx - r * 0.6, yy);
      ctx.quadraticCurveTo(cx - r * 1.8, yy + wob, cx - r * (2.6 - i * 0.4), yy - r * 0.1);
      ctx.stroke();
    }
    ctx.restore();
    ctx.save();
    ctx.fillStyle = "#fff";
    ctx.shadowColor = "#bbdefb"; ctx.shadowBlur = 8;
    ctx.beginPath(); ctx.arc(cx + r * 0.15, cy, r * 0.5, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  } else if (f.head === "saturn") {
    // surface bands, then the front half of the ring
    ctx.save();
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.clip();
    ctx.fillStyle = "#d4a95c";
    ctx.fillRect(cx - r, cy - r * 0.55, r * 2, r * 0.28);
    ctx.fillRect(cx - r, cy + r * 0.15, r * 2, r * 0.22);
    ctx.fillStyle = "#c1934a";
    ctx.fillRect(cx - r, cy - r * 0.12, r * 2, r * 0.14);
    ctx.restore();
    ctx.save();
    ctx.strokeStyle = "#c9a66b";
    ctx.lineWidth = Math.max(1.4, r * 0.22);
    ctx.beginPath();
    ctx.ellipse(cx, cy, r * 1.75, r * 0.5, -0.3, 0, Math.PI);
    ctx.stroke();
    ctx.strokeStyle = "#e8d3a2";
    ctx.lineWidth = Math.max(0.8, r * 0.08);
    ctx.beginPath();
    ctx.ellipse(cx, cy, r * 1.45, r * 0.4, -0.3, 0, Math.PI);
    ctx.stroke();
    ctx.restore();
  } else if (f.head === "mirror") {
    // gilded frame, glass shine, top ornament
    ctx.save();
    ctx.strokeStyle = "#c9a227";
    ctx.lineWidth = Math.max(1.6, r * 0.22);
    ctx.beginPath(); ctx.ellipse(cx, cy, r * 0.8, r * 1.1, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = "#c9a227";
    ctx.beginPath(); ctx.arc(cx, cy - r * 1.25, r * 0.18, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = Math.max(1, r * 0.12);
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.35, cy + r * 0.5); ctx.lineTo(cx + r * 0.25, cy - r * 0.55);
    ctx.moveTo(cx - r * 0.05, cy + r * 0.62); ctx.lineTo(cx + r * 0.42, cy - r * 0.2);
    ctx.stroke();
    ctx.restore();
  } else if (f.head === "earth") {
    // green continents clipped to the globe + polar cap
    ctx.save();
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.clip();
    ctx.fillStyle = "#66bb6a";
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.9, cy - r * 0.4);
    ctx.quadraticCurveTo(cx - r * 0.2, cy - r * 0.9, cx + r * 0.1, cy - r * 0.35);
    ctx.quadraticCurveTo(cx - r * 0.3, cy - r * 0.05, cx - r * 0.9, cy - r * 0.4);
    ctx.closePath(); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(cx + r * 0.35, cy + r * 0.05);
    ctx.quadraticCurveTo(cx + r * 0.95, cy - r * 0.15, cx + r * 0.85, cy + r * 0.45);
    ctx.quadraticCurveTo(cx + r * 0.45, cy + r * 0.6, cx + r * 0.35, cy + r * 0.05);
    ctx.closePath(); ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cx - r * 0.35, cy + r * 0.6, r * 0.4, r * 0.22, 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#e1f5fe";
    ctx.beginPath(); ctx.ellipse(cx, cy - r * 0.92, r * 0.5, r * 0.2, 0, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  } else if (f.head === "sign") {
    // thick black frame, a hanging bar above, and the two-line title
    const sw = r * 2.9, sh = r * 1.8;
    ctx.save();
    ctx.lineWidth = Math.max(1.4, r * 0.16);
    ctx.strokeStyle = "#111";
    ctx.strokeRect(cx - sw / 2, cy - sh / 2, sw, sh);
    ctx.fillStyle = "#111"; // little mounting posts above the sign
    ctx.fillRect(cx - sw * 0.32, cy - sh / 2 - r * 0.35, r * 0.14, r * 0.4);
    ctx.fillRect(cx + sw * 0.32 - r * 0.14, cy - sh / 2 - r * 0.35, r * 0.14, r * 0.4);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `800 ${r * 0.5}px sans-serif`;
    const parts = (f.signText || "STICKMAN ARCHIVE").split(" ");
    if (parts.length >= 2) {
      ctx.fillText(parts[0], cx, cy - r * 0.42);
      ctx.fillText(parts.slice(1).join(" "), cx, cy + r * 0.42);
    } else {
      ctx.fillText(parts[0], cx, cy);
    }
    ctx.restore();
  } else if (f.head === "frank") {
    // black flat-top hair band + forehead stitches
    ctx.fillStyle = "#1b1b1b";
    ctx.fillRect(cx - r * 0.95, cy - r * 0.95, r * 1.9, r * 0.42);
    ctx.save();
    ctx.lineWidth = Math.max(0.8, r * 0.09);
    ctx.beginPath();
    ctx.moveTo(cx + r * 0.15, cy - r * 0.35); ctx.lineTo(cx + r * 0.75, cy - r * 0.3);
    for (const fx of [0.28, 0.45, 0.62]) {
      ctx.moveTo(cx + r * fx, cy - r * 0.45); ctx.lineTo(cx + r * fx, cy - r * 0.2);
    }
    ctx.stroke();
    ctx.restore();
  } else if (f.head === "page") {
    // a sheet of paper: dog-eared corner, optional ruled lines
    ctx.save();
    ctx.fillStyle = f.color;
    ctx.beginPath(); // folded top-right corner
    ctx.moveTo(cx + r * 0.85, cy - r * 1.12);
    ctx.lineTo(cx + r * 0.4, cy - r * 1.12);
    ctx.lineTo(cx + r * 0.85, cy - r * 0.6);
    ctx.closePath();
    ctx.globalAlpha *= 0.18; ctx.fill(); ctx.globalAlpha = 1;
    ctx.strokeStyle = f.color;
    ctx.lineWidth = Math.max(0.7, r * 0.06);
    ctx.beginPath();
    ctx.moveTo(cx + r * 0.4, cy - r * 1.12); ctx.lineTo(cx + r * 0.4, cy - r * 0.6); ctx.lineTo(cx + r * 0.85, cy - r * 0.6);
    ctx.stroke();
    if (f.headDots === "ruled") { // written pages have ruled text lines
      ctx.globalAlpha *= 0.5;
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const yy = cy - r * 0.5 + i * r * 0.4;
        ctx.moveTo(cx - r * 0.6, yy); ctx.lineTo(cx + r * (i === 0 ? 0.35 : 0.6), yy);
      }
      ctx.stroke();
    }
    ctx.restore();
  } else if (f.head === "galaxyorb") {
    // a spiral galaxy: bright core, two logarithmic arms, scattered stars
    ctx.save();
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.clip();
    ctx.strokeStyle = "#b39ddb";
    ctx.lineWidth = Math.max(1, r * 0.14);
    for (const off of [0, Math.PI]) {
      ctx.beginPath();
      for (let k = 0; k <= 18; k++) {
        const ang = off + t * 0.6 + k * 0.32;
        const rad = r * 0.12 + k * r * 0.055;
        const x = cx + Math.cos(ang) * rad, y = cy + Math.sin(ang) * rad;
        k ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      }
      ctx.stroke();
    }
    ctx.fillStyle = "#fff";
    ctx.save(); ctx.shadowColor = "#e1bee7"; ctx.shadowBlur = 8;
    ctx.beginPath(); ctx.arc(cx, cy, r * 0.22, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    for (let i = 0; i < 10; i++) {
      const a = i * 2.4, rr = ((i * 37) % 90) / 100 * r;
      ctx.globalAlpha = 0.7;
      ctx.fillRect(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr, r * 0.06, r * 0.06);
    }
    ctx.restore();
  } else if (f.head === "void") {
    // a hole in space: faint rim light, a few stars spiralling into nothing
    ctx.save();
    ctx.strokeStyle = "#4a3f6b";
    ctx.lineWidth = Math.max(1, r * 0.1);
    ctx.beginPath(); ctx.arc(cx, cy, r * 0.98, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = "#c5b3ff";
    for (let i = 0; i < 5; i++) {
      const a = t * 1.2 + i * 1.5, rr = r * (0.35 + (i % 3) * 0.2);
      ctx.globalAlpha = 0.5 + (i % 2) * 0.3;
      ctx.beginPath(); ctx.arc(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr, r * 0.05, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  } else if (f.head === "sun") {
    // a rising sun: warm disc with a ring of rays
    ctx.save();
    ctx.strokeStyle = "#ffb300";
    ctx.fillStyle = "#ffb300";
    ctx.lineWidth = Math.max(1, r * 0.1);
    for (let i = 0; i < 12; i++) {
      const a = i * Math.PI / 6 + t * 0.3;
      const r0 = r * 1.0, r1 = r * (1.32 + (i % 2) * 0.12);
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0);
      ctx.lineTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1);
      ctx.stroke();
    }
    ctx.globalAlpha = 0.35;
    ctx.beginPath(); ctx.arc(cx, cy, r * 0.62, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  } else if (f.head === "holo") {
    // a projected hologram: cyan wireframe, scanlines, bright eyes
    ctx.save();
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.clip();
    ctx.strokeStyle = "#26c6da";
    ctx.globalAlpha = 0.5;
    ctx.lineWidth = Math.max(0.6, r * 0.05);
    ctx.beginPath();
    for (let yy = -r; yy <= r; yy += r * 0.22) { ctx.moveTo(cx - r, cy + yy); ctx.lineTo(cx + r, cy + yy); }
    ctx.stroke();
    ctx.restore();
    ctx.save();
    ctx.fillStyle = "#4dd0e1"; ctx.shadowColor = "#26c6da"; ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.arc(cx - r * 0.34, cy - r * 0.05, r * 0.14, 0, Math.PI * 2);
    ctx.arc(cx + r * 0.34, cy - r * 0.05, r * 0.14, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  } else if (f.head === "missing") {
    // a redacted placeholder: dashed border, a large white "?"
    ctx.save();
    ctx.setLineDash([r * 0.28, r * 0.22]);
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = Math.max(1, r * 0.12);
    ctx.strokeRect(cx - r * 0.82, cy - r * 0.82, r * 1.64, r * 1.64);
    ctx.setLineDash([]);
    ctx.fillStyle = "#ffffff";
    ctx.font = `800 ${r * 1.3}px sans-serif`;
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("?", cx, cy + r * 0.06);
    ctx.restore();
  } else if (f.head === "error") {
    // a cracked screen flashing ERROR over static
    ctx.save();
    ctx.beginPath(); ctx.rect(cx - r * 1.25, cy - r * 0.85, r * 2.5, r * 1.7); ctx.clip();
    const seg = Math.floor(t * 5);
    const rng = mulberry32(f.id * 71 + seg * 17);
    ctx.globalAlpha = 0.5;
    for (let i = 0; i < 7; i++) {
      ctx.fillStyle = rng() < 0.5 ? "#37474f" : "#455a64";
      ctx.fillRect(cx - r * 1.25, cy - r * 0.85 + rng() * r * 1.7, r * 2.5, r * 0.12);
    }
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#ff1744";
    ctx.font = `800 ${r * 0.62}px monospace`;
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("ERROR", cx, cy + (seg % 2 ? 0 : r * 0.04));
    ctx.restore();
    ctx.strokeStyle = "#ff1744";
    ctx.lineWidth = Math.max(1, r * 0.08);
    ctx.strokeRect(cx - r * 1.25, cy - r * 0.85, r * 2.5, r * 1.7);
  } else if (f.head === "storybook") {
    // centre spine + a few lines of text on each page
    ctx.save();
    ctx.strokeStyle = f.color;
    ctx.lineWidth = Math.max(0.8, r * 0.07);
    ctx.beginPath(); ctx.moveTo(cx, cy - r * 0.82); ctx.lineTo(cx, cy + r * 0.8); ctx.stroke();
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      const yy = cy - r * 0.4 + i * r * 0.32;
      ctx.moveTo(cx - r * 1.05, yy); ctx.lineTo(cx - r * 0.2, yy);
      ctx.moveTo(cx + r * 0.2, yy); ctx.lineTo(cx + r * 1.05, yy);
    }
    ctx.stroke();
    ctx.restore();
  } else if (f.head === "pizzaslice") {
    // crust rim + pepperoni + a trailing string of cheese
    ctx.strokeStyle = "#e0a545";
    ctx.lineWidth = Math.max(1.2, r * 0.14);
    ctx.beginPath();
    ctx.moveTo(cx - r * 1.02, cy - r * 0.58);
    ctx.quadraticCurveTo(cx, cy - r * 1.22, cx + r * 1.02, cy - r * 0.58);
    ctx.stroke();
    ctx.fillStyle = "#c62828";
    for (const p of [[-0.32, -0.15], [0.22, -0.3], [0.05, 0.25], [0.4, 0.05]]) {
      ctx.beginPath(); ctx.arc(cx + p[0] * r, cy + p[1] * r, r * 0.15, 0, Math.PI * 2); ctx.fill();
    }
    ctx.strokeStyle = "#fff9c4";
    ctx.lineWidth = Math.max(1, r * 0.1);
    const stretch = Math.abs(Math.sin(t * 3)) * r * 0.3;
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.2, cy + r * 0.5);
    ctx.quadraticCurveTo(cx - r * 0.1, cy + r * 0.8 + stretch, cx, cy + r * 1.0 + stretch);
    ctx.stroke();
  } else if (f.head === "sushi") {
    // pink salmon cap + dark nori belt + a few rice grains
    ctx.fillStyle = "#ef9a9a";
    ctx.beginPath();
    ctx.moveTo(cx - r * 1.02, cy - r * 0.35);
    ctx.quadraticCurveTo(cx, cy - r * 0.95, cx + r * 1.02, cy - r * 0.35);
    ctx.lineTo(cx + r * 0.95, cy - r * 0.05);
    ctx.quadraticCurveTo(cx, cy - r * 0.55, cx - r * 0.95, cy - r * 0.05);
    ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#1b1b1b";
    ctx.fillRect(cx - r * 1.12, cy - r * 0.15, r * 0.4, r * 0.95);
    ctx.fillRect(cx + r * 0.72, cy - r * 0.15, r * 0.4, r * 0.95);
    ctx.fillStyle = "#fff";
    for (const p of [[-0.1, 0.35], [0.25, 0.5], [-0.4, 0.55]]) {
      ctx.beginPath(); ctx.ellipse(cx + p[0] * r, cy + p[1] * r, r * 0.08, r * 0.05, 0.3, 0, Math.PI * 2); ctx.fill();
    }
  } else if (f.head === "coffeecup") {
    // ring handle, rim highlight, and rising steam curls
    ctx.strokeStyle = f.color;
    ctx.lineWidth = Math.max(1.4, r * 0.16);
    ctx.beginPath(); ctx.arc(cx + r * 1.0, cy, r * 0.42, -Math.PI * 0.6, Math.PI * 0.6); ctx.stroke();
    ctx.fillStyle = "#6d4c41";
    ctx.beginPath(); ctx.ellipse(cx, cy - r * 0.9, r * 0.85, r * 0.16, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.save();
    ctx.strokeStyle = "#bcaaa4"; ctx.globalAlpha = 0.75;
    ctx.lineWidth = Math.max(1, r * 0.1); ctx.lineCap = "round";
    for (const ox of [-0.3, 0.3]) {
      const wob = Math.sin(t * 3 + ox * 10) * r * 0.15;
      ctx.beginPath();
      ctx.moveTo(cx + ox * r, cy - r * 1.05);
      ctx.quadraticCurveTo(cx + ox * r + wob, cy - r * 1.6, cx + ox * r, cy - r * 2.05);
      ctx.stroke();
    }
    ctx.restore();
  } else if (f.head === "popcorn") {
    // red/white bucket stripes + puffs of popcorn spilling over the top
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.72, cy - r * 0.55); ctx.lineTo(cx - r * 0.65, cy + r * 1.05);
    ctx.lineTo(cx - r * 0.22, cy + r * 1.05); ctx.lineTo(cx - r * 0.28, cy - r * 0.55);
    ctx.closePath();
    ctx.moveTo(cx + r * 0.18, cy - r * 0.55); ctx.lineTo(cx + r * 0.24, cy + r * 1.05);
    ctx.lineTo(cx + r * 0.68, cy + r * 1.05); ctx.lineTo(cx + r * 0.72, cy - r * 0.55);
    ctx.closePath();
    ctx.fillStyle = "#c62828"; ctx.fill();
    ctx.restore();
    ctx.fillStyle = "#fff8e1";
    for (const p of [[-0.55, -0.7], [-0.1, -0.9], [0.35, -0.72], [0.05, -0.55], [-0.32, -0.5]]) {
      ctx.beginPath(); ctx.arc(cx + p[0] * r, cy + p[1] * r, r * 0.22, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    }
  } else if (f.head === "mysterybox") {
    // crate seams + a big shifting-colour "?"
    ctx.strokeStyle = "#00000033";
    ctx.lineWidth = Math.max(0.8, r * 0.06);
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.35, cy - r * 1.05); ctx.lineTo(cx - r * 0.35, cy + r * 1.05);
    ctx.moveTo(cx + r * 0.35, cy - r * 1.05); ctx.lineTo(cx + r * 0.35, cy + r * 1.05);
    ctx.stroke();
    ctx.fillStyle = `hsl(${(t * 90) % 360}, 80%, 55%)`;
    ctx.font = `bold ${r * 1.5}px sans-serif`;
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("?", cx, cy + r * 0.08);
  } else if (f.head === "giftbox") {
    // ribbon cross + a bow on top
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(cx - r * 0.22, cy - r * 0.8, r * 0.44, r * 1.75);
    ctx.fillRect(cx - r, cy - r * 0.14, r * 2, r * 0.4);
    ctx.strokeRect(cx - r * 0.22, cy - r * 0.8, r * 0.44, r * 1.75);
    ctx.strokeRect(cx - r, cy - r * 0.14, r * 2, r * 0.4);
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.ellipse(cx - r * 0.42, cy - r * 0.9, r * 0.32, r * 0.22, 0.6, 0, Math.PI * 2);
    ctx.ellipse(cx + r * 0.42, cy - r * 0.9, r * 0.32, r * 0.22, -0.6, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, cy - r * 0.82, r * 0.16, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  } else if (f.head === "toybox") {
    // dark rim + a ball, a block and a small robot arm peeking over the top
    ctx.strokeStyle = "#5d4037";
    ctx.lineWidth = Math.max(1.2, r * 0.14);
    ctx.beginPath(); ctx.moveTo(cx - r * 0.68, cy - r * 0.35); ctx.lineTo(cx + r * 0.68, cy - r * 0.35); ctx.stroke();
    ctx.fillStyle = "#e53935";
    ctx.beginPath(); ctx.arc(cx - r * 0.42, cy - r * 0.62, r * 0.28, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#1e88e5";
    ctx.fillRect(cx - r * 0.06, cy - r * 0.85, r * 0.4, r * 0.4);
    ctx.strokeRect(cx - r * 0.06, cy - r * 0.85, r * 0.4, r * 0.4);
    ctx.fillStyle = "#8d6e63";
    ctx.beginPath(); ctx.arc(cx + r * 0.5, cy - r * 0.58, r * 0.16, 0, Math.PI * 2); ctx.fill();
    ctx.fillRect(cx + r * 0.42, cy - r * 0.58, r * 0.16, r * 0.32);
  } else if (f.head === "rubik") {
    // 3x3 grid of tiles, hues drifting independently
    const cell = (r * 2.1) / 3, x0 = cx - r * 1.05, y0 = cy - r * 1.05;
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        const idx = row * 3 + col;
        ctx.fillStyle = `hsl(${(t * 40 + idx * 47) % 360}, 80%, 55%)`;
        ctx.fillRect(x0 + col * cell + 0.06 * r, y0 + row * cell + 0.06 * r, cell - 0.12 * r, cell - 0.12 * r);
        ctx.strokeRect(x0 + col * cell + 0.06 * r, y0 + row * cell + 0.06 * r, cell - 0.12 * r, cell - 0.12 * r);
      }
    }
  } else if (f.head === "puzzlepiece") {
    // a round tab bulging out one side, a punched notch on the other
    ctx.fillStyle = f.headFill;
    ctx.beginPath(); ctx.arc(cx + r * 1.05, cy, r * 0.42, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#ffffff";
    ctx.beginPath(); ctx.arc(cx - r * 0.9, cy, r * 0.4, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  } else if (f.head === "domino") {
    // dividing line + two groups of pips
    ctx.strokeStyle = f.color;
    ctx.lineWidth = Math.max(1, r * 0.1);
    ctx.beginPath(); ctx.moveTo(cx - r * 0.75, cy); ctx.lineTo(cx + r * 0.75, cy); ctx.stroke();
    ctx.fillStyle = f.color;
    for (const p of [[-0.3, -0.7], [0.3, -0.35]]) {
      ctx.beginPath(); ctx.arc(cx + p[0] * r, cy + p[1] * r, r * 0.13, 0, Math.PI * 2); ctx.fill();
    }
    for (const p of [[-0.35, 0.35], [0, 0.68], [0.35, 1.0], [0.35, 0.35]]) {
      ctx.beginPath(); ctx.arc(cx + p[0] * r, cy + p[1] * r, r * 0.13, 0, Math.PI * 2); ctx.fill();
    }
  } else if (f.head === "legobrick") {
    // two round studs on top
    ctx.fillStyle = f.headFill;
    ctx.strokeStyle = f.color;
    for (const sx of [-0.42, 0.42]) {
      ctx.beginPath(); ctx.arc(cx + sx * r, cy - r * 0.4, r * 0.34, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    }
  } else if (f.head === "balloon") {
    // knotted base + a string swaying below
    ctx.fillStyle = f.headFill;
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.14, cy + r * 1.0);
    ctx.lineTo(cx + r * 0.14, cy + r * 1.0);
    ctx.lineTo(cx, cy + r * 1.2);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = f.color;
    ctx.lineWidth = Math.max(0.8, r * 0.06);
    const sway = Math.sin(t * 2.4) * r * 0.3;
    ctx.beginPath();
    ctx.moveTo(cx, cy + r * 1.2);
    ctx.quadraticCurveTo(cx + sway, cy + r * 1.9, cx, cy + r * 2.6);
    ctx.stroke();
  } else if (f.head === "discoball") {
    // a mirror-facet grid clipped to the sphere, with a couple of roving glints
    ctx.save();
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.clip();
    ctx.strokeStyle = "#90a4ae"; ctx.lineWidth = Math.max(0.6, r * 0.05);
    ctx.beginPath();
    for (let i = -3; i <= 3; i++) {
      ctx.moveTo(cx - r * 1.2, cy + i * r * 0.3); ctx.lineTo(cx + r * 1.2, cy + i * r * 0.3);
      ctx.moveTo(cx + i * r * 0.3, cy - r * 1.2); ctx.lineTo(cx + i * r * 0.3, cy + r * 1.2);
    }
    ctx.stroke();
    ctx.restore();
    ctx.save();
    ctx.fillStyle = "#ffffff";
    for (let i = 0; i < 2; i++) {
      const a = t * 2.5 + i * Math.PI;
      const gx = cx + Math.cos(a) * r * 0.5, gy = cy + Math.sin(a * 1.3) * r * 0.5;
      ctx.globalAlpha = 0.5 + 0.5 * Math.sin(t * 6 + i * 3);
      ctx.beginPath(); ctx.arc(gx, gy, r * 0.1, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  } else if (f.head === "cabbage") {
    // curved leaf-vein ridges following the bumpy outline
    ctx.strokeStyle = "#2e7d32";
    ctx.lineWidth = Math.max(0.8, r * 0.07);
    ctx.beginPath();
    ctx.moveTo(cx, cy - r * 0.7); ctx.quadraticCurveTo(cx - r * 0.15, cy, cx, cy + r * 0.75);
    ctx.moveTo(cx - r * 0.6, cy - r * 0.3); ctx.quadraticCurveTo(cx - r * 0.35, cy, cx - r * 0.5, cy + r * 0.55);
    ctx.moveTo(cx + r * 0.6, cy - r * 0.3); ctx.quadraticCurveTo(cx + r * 0.35, cy, cx + r * 0.5, cy + r * 0.55);
    ctx.stroke();
  } else if (f.head === "watermelon") {
    // a wedge cut away showing pink flesh + black seeds, thin white rind
    ctx.save();
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.clip();
    ctx.fillStyle = "#f48fb1";
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, r * 1.3, -0.15, 0.95); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = "#fce4ec"; ctx.lineWidth = Math.max(1, r * 0.1);
    ctx.beginPath(); ctx.arc(cx, cy, r * 1.02, -0.15, 0.95); ctx.stroke();
    ctx.fillStyle = "#212121";
    for (const p of [[0.55, 0.25], [0.68, 0.45], [0.45, 0.55], [0.72, 0.65]]) {
      ctx.beginPath(); ctx.ellipse(cx + p[0] * r, cy + p[1] * r, r * 0.06, r * 0.1, 0.8, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  } else if (f.head === "knightpiece") {
    // eye + mane notches on the horse-head silhouette
    ctx.fillStyle = "#fff";
    ctx.beginPath(); ctx.arc(cx - r * 0.02, cy - r * 0.55, r * 0.09, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = f.color;
    ctx.lineWidth = Math.max(0.8, r * 0.07);
    ctx.beginPath();
    for (const fr of [0.15, 0.4, 0.65]) {
      const px = cx - r * 0.5 + fr * r * 0.8, py = cy - r * 0.75 + fr * r * 0.65;
      ctx.moveTo(px, py); ctx.lineTo(px - r * 0.16, py + r * 0.16);
    }
    ctx.stroke();
    ctx.fillRect(cx - r * 0.55, cy + r * 1.05, r * 1.1, r * 0.14);
  } else if (f.head === "origami") {
    // center fold crease
    ctx.strokeStyle = "rgba(0,0,0,0.35)";
    ctx.lineWidth = Math.max(0.8, r * 0.06);
    ctx.beginPath();
    ctx.moveTo(cx, cy - r * 1.2); ctx.lineTo(cx, cy + r * 1.1);
    ctx.stroke();
  } else if (f.head === "dinoskull") {
    // dark eye socket
    ctx.fillStyle = "#212121";
    ctx.beginPath(); ctx.arc(cx - r * 0.35, cy - r * 0.35, r * 0.22, 0, Math.PI * 2); ctx.fill();
  }
  // neck bolts + arcing electricity (Franken)
  if (f.boltEars) {
    ctx.fillStyle = "#90a4ae";
    ctx.fillRect(cx - r * 1.35, cy + r * 0.45, r * 0.42, r * 0.3);
    ctx.fillRect(cx + r * 0.93, cy + r * 0.45, r * 0.42, r * 0.3);
    ctx.fillStyle = "#607d8b";
    ctx.beginPath();
    ctx.arc(cx - r * 1.35, cy + r * 0.6, r * 0.17, 0, Math.PI * 2);
    ctx.arc(cx + r * 1.35, cy + r * 0.6, r * 0.17, 0, Math.PI * 2);
    ctx.fill();
  }
  if (f.electric) {
    const seg = Math.floor(t * 4);
    if (mulberry32(f.id * 89 + seg * 31)() < 0.4) {
      ctx.save();
      ctx.strokeStyle = "#81d4fa";
      ctx.shadowColor = "#4fc3f7"; ctx.shadowBlur = 6;
      ctx.lineWidth = Math.max(0.9, r * 0.1);
      ctx.beginPath();
      ctx.moveTo(cx - r * 1.35, cy + r * 0.45);
      ctx.lineTo(cx - r * 0.6, cy - r * 1.25);
      ctx.lineTo(cx + r * 0.1, cy - r * 1.05);
      ctx.lineTo(cx + r * 0.7, cy - r * 1.35);
      ctx.lineTo(cx + r * 1.35, cy + r * 0.45);
      ctx.stroke();
      ctx.restore();
    }
  }
  // metal half-face with glowing red eye (Cyborg)
  if (f.halfRobot && f.head === "circle") {
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, -Math.PI / 2, Math.PI / 2); // front (+x) half
    ctx.closePath();
    ctx.fillStyle = "#b0bec5"; ctx.fill(); ctx.stroke();
    ctx.beginPath(); // seam + brow plate line
    ctx.moveTo(cx, cy - r); ctx.lineTo(cx, cy + r);
    ctx.moveTo(cx + r * 0.15, cy - r * 0.45); ctx.lineTo(cx + r * 0.8, cy - r * 0.4);
    ctx.stroke();
    ctx.fillStyle = "#ff1744";
    ctx.shadowColor = "#ff1744"; ctx.shadowBlur = 6;
    ctx.beginPath(); ctx.arc(cx + r * 0.42, cy - r * 0.08, r * 0.17, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    // organic eye on the stick half
    ctx.fillStyle = f.color;
    ctx.beginPath(); ctx.arc(cx - r * 0.35, cy - r * 0.08, r * 0.13, 0, Math.PI * 2); ctx.fill();
  }
  // slicked Dracula hair with widow's peak (front is +x)
  if (f.hair === "dracula") {
    ctx.fillStyle = "#14141c";
    ctx.beginPath();
    ctx.moveTo(cx + r * 0.55, cy - r * 0.82);
    ctx.quadraticCurveTo(cx, cy - r * 1.18, cx - r * 0.85, cy - r * 0.55);
    ctx.quadraticCurveTo(cx - r * 1.1, cy - r * 0.1, cx - r * 0.92, cy + r * 0.35);
    ctx.quadraticCurveTo(cx - r * 0.55, cy - r * 0.15, cx - r * 0.1, cy - r * 0.5);
    ctx.lineTo(cx + r * 0.32, cy - r * 0.18); // widow's peak dipping onto the forehead
    ctx.quadraticCurveTo(cx + r * 0.5, cy - r * 0.55, cx + r * 0.55, cy - r * 0.82);
    ctx.closePath(); ctx.fill();
  }
  if (f.fangs) {
    ctx.save();
    ctx.lineWidth = Math.max(0.8, r * 0.08);
    ctx.beginPath(); // thin mouth line
    ctx.moveTo(cx + r * 0.2, cy + r * 0.45); ctx.lineTo(cx + r * 0.72, cy + r * 0.38);
    ctx.stroke();
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.moveTo(cx + r * 0.3, cy + r * 0.45); ctx.lineTo(cx + r * 0.38, cy + r * 0.75); ctx.lineTo(cx + r * 0.46, cy + r * 0.44);
    ctx.moveTo(cx + r * 0.52, cy + r * 0.43); ctx.lineTo(cx + r * 0.6, cy + r * 0.7); ctx.lineTo(cx + r * 0.68, cy + r * 0.41);
    ctx.closePath(); ctx.fill();
    ctx.restore();
  }
  // wolf muzzle with nose + fang (front is +x)
  if (f.muzzle) {
    ctx.fillStyle = f.muzzle;
    ctx.beginPath();
    ctx.moveTo(cx + r * 0.5, cy - r * 0.25);
    ctx.quadraticCurveTo(cx + r * 1.55, cy - r * 0.3, cx + r * 1.6, cy + r * 0.12);
    ctx.quadraticCurveTo(cx + r * 1.55, cy + r * 0.45, cx + r * 0.5, cy + r * 0.5);
    ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#14141c";
    ctx.beginPath(); ctx.arc(cx + r * 1.42, cy - r * 0.05, r * 0.15, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.moveTo(cx + r * 0.85, cy + r * 0.48); ctx.lineTo(cx + r * 0.95, cy + r * 0.78); ctx.lineTo(cx + r * 1.05, cy + r * 0.46);
    ctx.closePath(); ctx.fill();
  }
  // shaggy fur around the skull (Werewolf)
  if (f.furry) {
    ctx.fillStyle = f.color;
    for (let i = 0; i < 6; i++) {
      const a = Math.PI * 0.55 + (i / 5) * Math.PI * 0.9; // back + top of the head
      const bx = cx + Math.cos(a) * r * 0.92, by = cy - Math.sin(a) * r * 0.92;
      const tx = cx + Math.cos(a) * r * 1.45, ty = cy - Math.sin(a) * r * 1.45;
      ctx.beginPath();
      ctx.moveTo(bx + Math.sin(a) * r * 0.22, by + Math.cos(a) * r * 0.22);
      ctx.lineTo(tx, ty);
      ctx.lineTo(bx - Math.sin(a) * r * 0.22, by - Math.cos(a) * r * 0.22);
      ctx.closePath(); ctx.fill();
    }
  }
  // flickering flame crest on the crown (Phoenix)
  if (f.crest === "flame") {
    ctx.save();
    ctx.shadowColor = "#ff9800"; ctx.shadowBlur = 6;
    for (const [ox, hgt, col] of [[-0.35, 1.5, "#ff7043"], [0.05, 1.9, "#ff9800"], [0.42, 1.4, "#ffd54f"]]) {
      const flick = 1 + Math.sin(t * 9 + ox * 20) * 0.18;
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.moveTo(cx + (ox - 0.18) * r, cy - r * 0.85);
      ctx.quadraticCurveTo(cx + (ox - 0.25) * r, cy - r * (0.85 + hgt * 0.55 * flick), cx + ox * r, cy - r * (0.85 + hgt * flick) * 1.0);
      ctx.quadraticCurveTo(cx + (ox + 0.25) * r, cy - r * (0.85 + hgt * 0.5 * flick), cx + (ox + 0.18) * r, cy - r * 0.85);
      ctx.closePath(); ctx.fill();
    }
    ctx.restore();
  }
  if (f.headDots === "spots") {
    ctx.fillStyle = "#fff";
    for (const p of [[-0.55, -0.45], [0.1, -0.75], [0.6, -0.35]]) {
      ctx.beginPath(); ctx.arc(cx + p[0] * r, cy + p[1] * r, r * 0.16, 0, Math.PI * 2); ctx.fill();
    }
  } else if (f.headDots === "sprinkles") {
    for (let i = 0; i < 6; i++) {
      ctx.fillStyle = `hsl(${i * 60}, 85%, 55%)`;
      const a = i * 1.05 + 0.4;
      ctx.fillRect(cx + Math.cos(a) * r * 0.66 - 1, cy + Math.sin(a) * r * 0.66 - 0.5, 2.4, 1.2);
    }
  } else if (f.headDots === "chips") { // chocolate chips studded across a cookie head
    ctx.fillStyle = "#4e342e";
    for (const p of [[-0.5, -0.4], [0.35, -0.55], [0.55, 0.15], [-0.15, 0.5], [-0.5, 0.2], [0.05, -0.05]]) {
      ctx.beginPath(); ctx.arc(cx + p[0] * r, cy + p[1] * r, r * 0.12, 0, Math.PI * 2); ctx.fill();
    }
  }
  if (f.stem) {
    ctx.strokeStyle = "#4e342e";
    ctx.beginPath(); ctx.moveTo(cx, cy - r); ctx.lineTo(cx + r * 0.12, cy - r * 1.4); ctx.stroke();
    ctx.fillStyle = "#43a047";
    ctx.beginPath(); ctx.ellipse(cx + r * 0.45, cy - r * 1.35, r * 0.3, r * 0.15, -0.5, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = f.color;
  }
  if (f.shine) { // a soft highlight for glossy round objects
    ctx.fillStyle = f.shineColor || "#ffffffaa";
    ctx.beginPath();
    ctx.ellipse(cx - r * 0.35, cy - r * 0.45, r * 0.28, r * 0.16, -0.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // eyes
  if (f.eyes === "cyclops") {
    ctx.fillStyle = "#fff";
    ctx.beginPath(); ctx.arc(cx, cy - r * 0.05, r * 0.38, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#222";
    ctx.beginPath(); ctx.arc(cx, cy - r * 0.05, r * 0.15, 0, Math.PI * 2); ctx.fill();
  } else if (f.eyes === "alien") {
    ctx.fillStyle = "#1b1b1b";
    ctx.beginPath();
    ctx.ellipse(cx - r * 0.35, cy - r * 0.05, r * 0.2, r * 0.32, 0.3, 0, Math.PI * 2);
    ctx.ellipse(cx + r * 0.35, cy - r * 0.05, r * 0.2, r * 0.32, -0.3, 0, Math.PI * 2);
    ctx.fill();
  } else if (f.eyes === "big") {
    for (const sx of [-0.38, 0.38]) {
      ctx.fillStyle = "#fff";
      ctx.beginPath(); ctx.arc(cx + sx * r, cy - r * 0.1, r * 0.32, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#222";
      ctx.beginPath(); ctx.arc(cx + sx * r, cy - r * 0.1, r * 0.13, 0, Math.PI * 2); ctx.fill();
    }
  } else if (f.eyes === "shades") {
    ctx.fillStyle = "#1b1b1b";
    ctx.fillRect(cx - r * 0.75, cy - r * 0.3, r * 1.5, r * 0.35);
  } else if (f.eyes === "closed") {
    ctx.strokeStyle = "#222";
    ctx.lineWidth = Math.max(0.9, r * 0.1);
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.45, cy - r * 0.08); ctx.quadraticCurveTo(cx - r * 0.33, cy + r * 0.05, cx - r * 0.2, cy - r * 0.08);
    ctx.moveTo(cx + r * 0.2, cy - r * 0.08); ctx.quadraticCurveTo(cx + r * 0.33, cy + r * 0.05, cx + r * 0.45, cy - r * 0.08);
    ctx.stroke();
  } else if (f.eyes) {
    ctx.fillStyle = f.eyes === "red" ? "#ff1744" : f.eyes === "glow" ? "#ffee58" : "#fff";
    ctx.beginPath();
    ctx.arc(cx - r * 0.33, cy - r * 0.1, r * 0.14, 0, Math.PI * 2);
    ctx.arc(cx + r * 0.33, cy - r * 0.1, r * 0.14, 0, Math.PI * 2);
    ctx.fill();
  }

  // beak (points forward, +x)
  if (f.beak) {
    ctx.fillStyle = f.beak;
    ctx.beginPath();
    ctx.moveTo(cx + r * 0.75, cy - r * 0.12);
    ctx.lineTo(cx + r * 1.55, cy + r * 0.08);
    ctx.lineTo(cx + r * 0.75, cy + r * 0.28);
    ctx.closePath(); ctx.fill();
  }
  if (f.comb) {
    ctx.fillStyle = "#e53935";
    for (const o of [-0.3, 0, 0.3]) {
      ctx.beginPath(); ctx.arc(cx + o * r, cy - r * 1.02, r * 0.18, 0, Math.PI * 2); ctx.fill();
    }
  }
  if (f.beard) {
    ctx.fillStyle = "#eceff1";
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.55, cy + r * 0.35);
    ctx.quadraticCurveTo(cx, cy + r * 2.1, cx + r * 0.55, cy + r * 0.35);
    ctx.closePath(); ctx.fill(); ctx.stroke();
  }

  // surgical face mask over the lower face (front is +x)
  if (f.mask) {
    ctx.fillStyle = "#7fccc0";
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.55, cy + r * 0.08);
    ctx.quadraticCurveTo(cx + r * 0.25, cy - r * 0.12, cx + r * 0.85, cy + r * 0.12);
    ctx.quadraticCurveTo(cx + r * 0.8, cy + r * 0.72, cx + r * 0.15, cy + r * 0.8);
    ctx.quadraticCurveTo(cx - r * 0.5, cy + r * 0.75, cx - r * 0.55, cy + r * 0.08);
    ctx.closePath();
    ctx.fill(); ctx.stroke();
    // pleats
    ctx.save();
    ctx.lineWidth = Math.max(0.8, ctx.lineWidth * 0.5);
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.38, cy + r * 0.28); ctx.lineTo(cx + r * 0.6, cy + r * 0.26);
    ctx.moveTo(cx - r * 0.34, cy + r * 0.5); ctx.lineTo(cx + r * 0.52, cy + r * 0.5);
    ctx.stroke();
    ctx.restore();
    // strap looping behind the head
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.52, cy + r * 0.15);
    ctx.quadraticCurveTo(cx - r * 0.95, cy + r * 0.02, cx - r * 1.0, cy - r * 0.18);
    ctx.stroke();
  }
}

// ------------------------------------------------------------------
// Hats
// ------------------------------------------------------------------
function drawHat(ctx, f, cx, topY, r) {
  ctx.fillStyle = f.hat === "santa" ? "#d32f2f"
    : f.hat === "crown" || f.hat === "horn" ? "#f4b400"
    : f.hat === "chef" ? "#fff"
    : f.hat === "party" || f.hat === "jester" ? "#ab47bc"
    : f.hat === "helmet" ? "#fdd835"
    : f.hat === "kettle" ? "#c0392b"
    : f.hat === "clown" ? "#e53935"
    : f.color;
  ctx.strokeStyle = f.color;
  switch (f.hat) {
    case "tophat":
      ctx.fillRect(cx - r * 0.7, topY - r * 1.7, r * 1.4, r * 1.5);
      ctx.fillRect(cx - r * 1.1, topY - r * 0.25, r * 2.2, r * 0.28);
      break;
    case "bowler":
      ctx.beginPath(); ctx.arc(cx, topY, r * 0.75, Math.PI, 0); ctx.fill();
      ctx.fillRect(cx - r, topY - r * 0.08, r * 2, r * 0.18);
      break;
    case "cap":
      ctx.beginPath(); ctx.arc(cx, topY + r * 0.05, r * 0.72, Math.PI, 0); ctx.fill();
      ctx.fillRect(cx - r * 1.25, topY, r * 0.75, r * 0.16);
      break;
    case "beanie":
      ctx.beginPath(); ctx.arc(cx, topY + r * 0.1, r * 0.78, Math.PI, 0); ctx.fill();
      break;
    case "cowboy":
      ctx.beginPath(); ctx.ellipse(cx, topY, r * 1.35, r * 0.3, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillRect(cx - r * 0.55, topY - r * 0.9, r * 1.1, r * 0.9);
      break;
    case "chef":
      ctx.fillRect(cx - r * 0.6, topY - r * 1.3, r * 1.2, r * 1.3);
      ctx.beginPath(); ctx.arc(cx, topY - r * 1.3, r * 0.62, Math.PI, 0); ctx.fill(); ctx.stroke();
      ctx.strokeRect(cx - r * 0.6, topY - r * 1.3, r * 1.2, r * 1.3);
      break;
    case "pizza":
      ctx.fillStyle = "#fbc02d";
      ctx.beginPath();
      ctx.moveTo(cx - r, topY); ctx.lineTo(cx + r, topY); ctx.lineTo(cx, topY - r * 1.5);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#e53935";
      for (const p of [[-0.3, -0.3], [0.25, -0.25], [0, -0.75]]) {
        ctx.beginPath(); ctx.arc(cx + p[0] * r, topY + p[1] * r, r * 0.13, 0, Math.PI * 2); ctx.fill();
      }
      break;
    case "burger":
      ctx.fillStyle = "#ffb74d";
      ctx.beginPath(); ctx.arc(cx, topY - r * 0.5, r * 0.8, Math.PI, 0); ctx.fill();
      ctx.fillStyle = "#6d4c41";
      ctx.fillRect(cx - r * 0.8, topY - r * 0.5, r * 1.6, r * 0.22);
      ctx.fillStyle = "#66bb6a";
      ctx.fillRect(cx - r * 0.85, topY - r * 0.28, r * 1.7, r * 0.12);
      ctx.fillStyle = "#ffb74d";
      ctx.fillRect(cx - r * 0.8, topY - r * 0.16, r * 1.6, r * 0.18);
      break;
    case "helmet":
      ctx.beginPath(); ctx.arc(cx, topY + r * 0.15, r * 0.85, Math.PI, 0); ctx.fill(); ctx.stroke();
      break;
    case "grad": { // mortarboard: skull cap, angled board with thickness, gold button + tassel
      ctx.fillStyle = "#263238";
      ctx.beginPath(); ctx.arc(cx, topY + r * 0.3, r * 0.8, Math.PI, 0); ctx.fill();
      const by = topY - r * 0.2;
      // board top face (diamond seen at a slight angle)
      ctx.fillStyle = "#212121";
      ctx.beginPath();
      ctx.moveTo(cx - r * 1.3, by + r * 0.12);
      ctx.lineTo(cx - r * 0.05, by - r * 0.45);
      ctx.lineTo(cx + r * 1.3, by - r * 0.15);
      ctx.lineTo(cx + r * 0.05, by + r * 0.42);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
      // board thickness along the two front edges
      ctx.fillStyle = "#101010";
      ctx.beginPath();
      ctx.moveTo(cx - r * 1.3, by + r * 0.12);
      ctx.lineTo(cx + r * 0.05, by + r * 0.42);
      ctx.lineTo(cx + r * 1.3, by - r * 0.15);
      ctx.lineTo(cx + r * 1.3, by + r * 0.05);
      ctx.lineTo(cx + r * 0.05, by + r * 0.62);
      ctx.lineTo(cx - r * 1.3, by + r * 0.32);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
      // gold centre button, cord draped over the front corner, tassel tuft
      ctx.fillStyle = "#f4b400";
      ctx.beginPath(); ctx.arc(cx, by - r * 0.02, r * 0.13, 0, Math.PI * 2); ctx.fill();
      ctx.save();
      ctx.strokeStyle = "#f4b400";
      ctx.lineWidth = Math.max(1, r * 0.09);
      ctx.beginPath();
      ctx.moveTo(cx, by - r * 0.02);
      ctx.quadraticCurveTo(cx + r * 0.85, by + r * 0.1, cx + r * 1.02, by + r * 0.75);
      ctx.stroke();
      ctx.restore();
      ctx.fillStyle = "#f4b400";
      ctx.beginPath();
      ctx.moveTo(cx + r * 0.9, by + r * 0.75);
      ctx.lineTo(cx + r * 1.14, by + r * 0.75);
      ctx.lineTo(cx + r * 1.1, by + r * 1.35);
      ctx.lineTo(cx + r * 0.94, by + r * 1.35);
      ctx.closePath(); ctx.fill();
      break;
    }
    case "crown": {
      ctx.beginPath();
      ctx.moveTo(cx - r * 0.75, topY);
      ctx.lineTo(cx - r * 0.75, topY - r * 0.7); ctx.lineTo(cx - r * 0.37, topY - r * 0.3);
      ctx.lineTo(cx, topY - r * 0.85); ctx.lineTo(cx + r * 0.37, topY - r * 0.3);
      ctx.lineTo(cx + r * 0.75, topY - r * 0.7); ctx.lineTo(cx + r * 0.75, topY);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      break;
    }
    case "wizard": {
      const hs = f.hatScale || 1;
      ctx.beginPath();
      ctx.moveTo(cx - r * 1.05, topY); ctx.lineTo(cx + r * 1.05, topY); ctx.lineTo(cx + r * 0.1, topY - r * 1.8 * hs);
      ctx.closePath();
      ctx.fillStyle = "#5e35b1"; ctx.fill(); ctx.stroke();
      break;
    }
    case "santa":
      ctx.beginPath();
      ctx.moveTo(cx - r * 0.8, topY); ctx.lineTo(cx + r * 0.8, topY); ctx.lineTo(cx + r * 0.9, topY - r * 1.3);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.beginPath(); ctx.arc(cx + r * 0.9, topY - r * 1.3, r * 0.22, 0, Math.PI * 2); ctx.fill();
      ctx.fillRect(cx - r * 0.85, topY - r * 0.12, r * 1.7, r * 0.2);
      break;
    case "party":
      ctx.beginPath();
      ctx.moveTo(cx - r * 0.55, topY); ctx.lineTo(cx + r * 0.55, topY); ctx.lineTo(cx, topY - r * 1.5);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      break;
    case "pirate": { // black tricorne: upswept brim corners, gold trim, skull-and-crossbones badge
      ctx.fillStyle = "#212121";
      // crown dome tucked under the brim
      ctx.beginPath(); ctx.arc(cx, topY + r * 0.05, r * 0.7, Math.PI, 0); ctx.fill();
      // brim silhouette, both corners curling up
      ctx.beginPath();
      ctx.moveTo(cx - r * 1.55, topY - r * 0.95);
      ctx.quadraticCurveTo(cx - r * 1.05, topY + r * 0.12, cx, topY + r * 0.1);
      ctx.quadraticCurveTo(cx + r * 1.0, topY + r * 0.12, cx + r * 1.5, topY - r * 0.85);
      ctx.quadraticCurveTo(cx + r * 0.75, topY - r * 0.55, cx + r * 0.05, topY - r * 0.6);
      ctx.quadraticCurveTo(cx - r * 0.8, topY - r * 0.58, cx - r * 1.55, topY - r * 0.95);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
      // gold trim along the upper brim edge
      ctx.save();
      ctx.strokeStyle = "#c9a227";
      ctx.lineWidth = Math.max(1, r * 0.09);
      ctx.beginPath();
      ctx.moveTo(cx - r * 1.45, topY - r * 0.88);
      ctx.quadraticCurveTo(cx - r * 0.8, topY - r * 0.52, cx + r * 0.05, topY - r * 0.54);
      ctx.quadraticCurveTo(cx + r * 0.75, topY - r * 0.5, cx + r * 1.42, topY - r * 0.78);
      ctx.stroke();
      ctx.restore();
      // skull-and-crossbones on the front face
      ctx.fillStyle = "#f5f5f5";
      ctx.beginPath(); ctx.arc(cx + r * 0.45, topY - r * 0.24, r * 0.16, 0, Math.PI * 2); ctx.fill();
      ctx.save();
      ctx.strokeStyle = "#f5f5f5";
      ctx.lineWidth = Math.max(1, r * 0.07);
      ctx.beginPath();
      ctx.moveTo(cx + r * 0.28, topY + r * 0.06); ctx.lineTo(cx + r * 0.62, topY - r * 0.1);
      ctx.moveTo(cx + r * 0.28, topY - r * 0.1); ctx.lineTo(cx + r * 0.62, topY + r * 0.06);
      ctx.stroke();
      ctx.restore();
      ctx.fillStyle = "#212121";
      ctx.beginPath();
      ctx.arc(cx + r * 0.4, topY - r * 0.27, r * 0.04, 0, Math.PI * 2);
      ctx.arc(cx + r * 0.51, topY - r * 0.27, r * 0.04, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case "jester":
      ctx.beginPath();
      ctx.moveTo(cx - r * 0.8, topY); ctx.lineTo(cx - r * 0.9, topY - r * 1.2);
      ctx.lineTo(cx - r * 0.2, topY - r * 0.5); ctx.lineTo(cx, topY - r * 1.5);
      ctx.lineTo(cx + r * 0.2, topY - r * 0.5); ctx.lineTo(cx + r * 0.9, topY - r * 1.2);
      ctx.lineTo(cx + r * 0.8, topY);
      ctx.closePath(); ctx.fill();
      break;
    case "beret":
      ctx.beginPath(); ctx.ellipse(cx - r * 0.15, topY - r * 0.1, r * 0.9, r * 0.35, -0.15, 0, Math.PI * 2);
      ctx.fillStyle = "#c62828"; ctx.fill();
      break;
    case "fedora": { // black fedora: wide brim, pinched crown, pale band
      ctx.fillStyle = "#181818";
      ctx.beginPath();
      ctx.ellipse(cx, topY + r * 0.02, r * 1.3, r * 0.26, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(cx - r * 0.72, topY);
      ctx.quadraticCurveTo(cx - r * 0.68, topY - r * 0.95, cx - r * 0.4, topY - r * 1.0);
      ctx.quadraticCurveTo(cx - r * 0.05, topY - r * 0.78, cx + r * 0.42, topY - r * 1.02); // pinched dent
      ctx.quadraticCurveTo(cx + r * 0.7, topY - r * 0.92, cx + r * 0.72, topY);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#e0e0e0";
      ctx.fillRect(cx - r * 0.7, topY - r * 0.3, r * 1.4, r * 0.22);
      break;
    }
    case "horn":
      ctx.beginPath();
      ctx.moveTo(cx - r * 0.15, topY); ctx.lineTo(cx + r * 0.15, topY); ctx.lineTo(cx, topY - r * 1.3);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      break;
    case "fin":
      ctx.beginPath();
      ctx.moveTo(cx - r * 0.4, topY); ctx.quadraticCurveTo(cx, topY - r * 1.4, cx + r * 0.5, topY);
      ctx.closePath(); ctx.fillStyle = "#78909c"; ctx.fill();
      break;
    case "police": // peaked cap: dark dome, band, front visor, gold badge
      ctx.fillStyle = "#263238";
      ctx.beginPath(); ctx.arc(cx, topY + r * 0.02, r * 0.8, Math.PI, 0); ctx.fill();
      ctx.fillRect(cx - r * 0.85, topY - r * 0.05, r * 1.7, r * 0.22);
      ctx.fillStyle = "#37474f";
      ctx.beginPath();
      ctx.ellipse(cx + r * 0.85, topY + r * 0.14, r * 0.5, r * 0.13, 0.12, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#f4b400";
      ctx.beginPath(); ctx.arc(cx, topY - r * 0.32, r * 0.16, 0, Math.PI * 2); ctx.fill();
      break;
    case "pilot": { // airline captain's cap: white crown, black band, glossy visor, gold wings
      ctx.fillStyle = "#fafafa";
      ctx.beginPath();
      ctx.moveTo(cx - r * 0.95, topY - r * 0.02);
      ctx.quadraticCurveTo(cx - r * 1.1, topY - r * 1.05, cx - r * 0.1, topY - r * 1.15);
      ctx.quadraticCurveTo(cx + r * 0.88, topY - r * 1.18, cx + r * 0.95, topY - r * 0.25);
      ctx.lineTo(cx + r * 0.88, topY - r * 0.02);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
      // black hat band
      ctx.fillStyle = "#1b1b1b";
      ctx.fillRect(cx - r * 0.92, topY - r * 0.14, r * 1.82, r * 0.28);
      // glossy visor sweeping forward
      ctx.beginPath();
      ctx.ellipse(cx + r * 0.88, topY + r * 0.16, r * 0.52, r * 0.15, 0.18, 0, Math.PI * 2);
      ctx.fill();
      // gold badge + swept wings on the band
      ctx.fillStyle = "#f4b400";
      ctx.beginPath(); ctx.arc(cx + r * 0.32, topY, r * 0.11, 0, Math.PI * 2); ctx.fill();
      ctx.save();
      ctx.strokeStyle = "#f4b400";
      ctx.lineWidth = Math.max(1, r * 0.08);
      ctx.beginPath();
      ctx.moveTo(cx + r * 0.2, topY + r * 0.02);
      ctx.quadraticCurveTo(cx - r * 0.1, topY - r * 0.08, cx - r * 0.32, topY + r * 0.05);
      ctx.moveTo(cx + r * 0.44, topY + r * 0.02);
      ctx.quadraticCurveTo(cx + r * 0.62, topY - r * 0.06, cx + r * 0.74, topY + r * 0.04);
      ctx.stroke();
      ctx.restore();
      break;
    }
    case "knight": { // full great helm: dome, visor slit, breaths, ridge, neck band, plume
      const hb = topY + r * 1.85;
      ctx.fillStyle = "#b0bec5";
      ctx.beginPath();
      ctx.moveTo(cx - r * 0.95, hb);
      ctx.lineTo(cx - r * 0.95, topY + r * 0.3);
      ctx.arc(cx, topY + r * 0.3, r * 0.95, Math.PI, 0);
      ctx.lineTo(cx + r * 0.95, hb);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
      // visor slit with hinge rivet
      ctx.fillStyle = "#263238";
      ctx.fillRect(cx - r * 0.55, topY + r * 0.62, r * 1.5, r * 0.22);
      ctx.fillStyle = "#546e7a";
      ctx.beginPath(); ctx.arc(cx - r * 0.72, topY + r * 0.73, r * 0.09, 0, Math.PI * 2); ctx.fill();
      // breathing holes on the face side
      for (const [hxx, hyy] of [[0.35, 1.25], [0.62, 1.25], [0.485, 1.45]]) {
        ctx.beginPath(); ctx.arc(cx + r * hxx, topY + r * hyy, r * 0.055, 0, Math.PI * 2); ctx.fill();
      }
      // centre ridge (split around the visor slit)
      ctx.beginPath();
      ctx.moveTo(cx, topY - r * 0.62); ctx.lineTo(cx, topY + r * 0.55);
      ctx.moveTo(cx, topY + r * 0.92); ctx.lineTo(cx, hb - r * 0.28);
      ctx.stroke();
      // riveted neck band
      ctx.fillStyle = "#90a4ae";
      ctx.fillRect(cx - r * 0.95, hb - r * 0.24, r * 1.9, r * 0.24);
      ctx.strokeRect(cx - r * 0.95, hb - r * 0.24, r * 1.9, r * 0.24);
      // flowing red plume from a gold crest socket
      ctx.fillStyle = "#f4b400";
      ctx.fillRect(cx - r * 0.16, topY - r * 0.78, r * 0.32, r * 0.28);
      ctx.fillStyle = "#c62828";
      ctx.beginPath();
      ctx.moveTo(cx - r * 0.02, topY - r * 0.55);
      ctx.quadraticCurveTo(cx - r * 0.5, topY - r * 1.4, cx - r * 1.5, topY - r * 1.2);
      ctx.quadraticCurveTo(cx - r * 2.15, topY - r * 1.05, cx - r * 2.35, topY - r * 0.5);
      ctx.quadraticCurveTo(cx - r * 1.75, topY - r * 0.82, cx - r * 1.25, topY - r * 0.75);
      ctx.quadraticCurveTo(cx - r * 0.6, topY - r * 0.6, cx - r * 0.28, topY - r * 0.18);
      ctx.closePath(); ctx.fill();
      break;
    }
    case "samurai": // kabuto: dome, flared side guards, gold crescent crest
      ctx.fillStyle = "#4e342e";
      ctx.beginPath(); ctx.arc(cx, topY + r * 0.1, r * 0.85, Math.PI, 0); ctx.fill(); ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx - r * 0.85, topY + r * 0.05);
      ctx.lineTo(cx - r * 1.25, topY + r * 0.55);
      ctx.moveTo(cx + r * 0.85, topY + r * 0.05);
      ctx.lineTo(cx + r * 1.25, topY + r * 0.55);
      ctx.stroke();
      ctx.strokeStyle = "#f4b400";
      ctx.beginPath();
      ctx.arc(cx, topY - r * 0.55, r * 0.5, Math.PI * 1.15, Math.PI * 1.85);
      ctx.arc(cx, topY - r * 1.05, r * 0.5, Math.PI * 0.2, Math.PI * 0.8, true);
      ctx.stroke();
      break;
    case "firehelm": // red fire helmet: ridged dome with wide rear brim
      ctx.fillStyle = "#c62828";
      ctx.beginPath(); ctx.arc(cx, topY + r * 0.05, r * 0.85, Math.PI, 0); ctx.fill();
      ctx.beginPath();
      ctx.ellipse(cx - r * 0.15, topY + r * 0.05, r * 1.15, r * 0.22, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#8e0000";
      ctx.beginPath();
      ctx.moveTo(cx, topY - r * 0.8); ctx.lineTo(cx, topY + r * 0.02);
      ctx.stroke();
      ctx.fillStyle = "#fdd835"; // front shield
      ctx.fillRect(cx + r * 0.35, topY - r * 0.5, r * 0.28, r * 0.4);
      break;
    case "shako": // tall toy-soldier hat with strap and plume pom
      ctx.fillStyle = "#212121";
      ctx.fillRect(cx - r * 0.62, topY - r * 1.5, r * 1.24, r * 1.5);
      ctx.fillStyle = "#f4b400";
      ctx.fillRect(cx - r * 0.62, topY - r * 0.28, r * 1.24, r * 0.16);
      ctx.fillStyle = "#c62828";
      ctx.beginPath(); ctx.arc(cx + r * 0.3, topY - r * 1.55, r * 0.2, 0, Math.PI * 2); ctx.fill();
      break;
    case "flower":
      ctx.strokeStyle = "#2e7d32";
      ctx.beginPath(); ctx.moveTo(cx, topY); ctx.lineTo(cx, topY - r * 0.9); ctx.stroke();
      ctx.fillStyle = "#ec407a";
      for (let i = 0; i < 5; i++) {
        const a = (i * 2 * Math.PI) / 5;
        ctx.beginPath();
        ctx.arc(cx + Math.cos(a) * r * 0.3, topY - r * 0.9 + Math.sin(a) * r * 0.3, r * 0.2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = "#ffeb3b";
      ctx.beginPath(); ctx.arc(cx, topY - r * 0.9, r * 0.18, 0, Math.PI * 2); ctx.fill();
      break;
    case "hardhat": // yellow construction helmet: full brim, domed shell, centre ridge
      ctx.fillStyle = "#fdd835";
      ctx.beginPath(); ctx.ellipse(cx, topY + r * 0.34, r * 1.15, r * 0.26, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx, topY + r * 0.14, r * 0.88, Math.PI, 0); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = "#c9a227";
      ctx.lineWidth = Math.max(1, r * 0.08);
      ctx.beginPath(); ctx.moveTo(cx, topY + r * 0.14 - r * 0.88); ctx.lineTo(cx, topY + r * 0.14); ctx.stroke();
      ctx.strokeStyle = f.color;
      break;
    case "visor": // a sleek glowing HUD band across the eyes
      ctx.save();
      ctx.fillStyle = "#37474f";
      ctx.beginPath(); ctx.rect(cx - r * 1.05, topY + r * 0.55, r * 2.1, r * 0.5); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#4fc3f7"; ctx.shadowColor = "#4fc3f7"; ctx.shadowBlur = 5;
      ctx.fillRect(cx - r * 0.9, topY + r * 0.65, r * 1.8, r * 0.28);
      ctx.restore();
      break;
    case "castle": { // a small castle turret worn on the head
      const w = r * 1.6, baseY = topY + r * 0.32;
      ctx.fillStyle = "#b0bec5";
      ctx.fillRect(cx - w / 2, baseY - r * 1.1, w, r * 1.1);
      ctx.strokeRect(cx - w / 2, baseY - r * 1.1, w, r * 1.1);
      const merW = w / 5;
      for (let i = 0; i < 5; i += 2) {
        ctx.fillRect(cx - w / 2 + i * merW, baseY - r * 1.1 - r * 0.3, merW, r * 0.3);
        ctx.strokeRect(cx - w / 2 + i * merW, baseY - r * 1.1 - r * 0.3, merW, r * 0.3);
      }
      ctx.fillStyle = "#90a4ae"; // corner turrets with pointed caps
      for (const side of [-1, 1]) {
        ctx.fillRect(cx + side * w * 0.44 - r * 0.16, baseY - r * 1.42, r * 0.32, r * 0.42);
        ctx.strokeRect(cx + side * w * 0.44 - r * 0.16, baseY - r * 1.42, r * 0.32, r * 0.42);
        ctx.beginPath();
        ctx.moveTo(cx + side * w * 0.44 - r * 0.2, baseY - r * 1.42);
        ctx.lineTo(cx + side * w * 0.44, baseY - r * 1.42 - r * 0.26);
        ctx.lineTo(cx + side * w * 0.44 + r * 0.2, baseY - r * 1.42);
        ctx.closePath(); ctx.fill(); ctx.stroke();
      }
      ctx.fillStyle = "#37474f"; // gate arch
      ctx.beginPath();
      ctx.moveTo(cx - r * 0.22, baseY); ctx.lineTo(cx - r * 0.22, baseY - r * 0.48);
      ctx.arc(cx, baseY - r * 0.48, r * 0.22, Math.PI, 0);
      ctx.lineTo(cx + r * 0.22, baseY); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = f.color;
      break;
    }
    case "tinycity": { // a miniature skyline sitting on the head
      const baseY = topY + r * 0.28;
      const bldgs = [
        [-r * 0.88, r * 0.46, r * 0.7, "#90a4ae"],
        [-r * 0.34, r * 0.4, r * 1.05, "#78909c"],
        [r * 0.1, r * 0.48, r * 0.85, "#b0bec5"],
        [r * 0.64, r * 0.38, r * 0.55, "#90a4ae"]
      ];
      for (const [bx, bw, bh, bc] of bldgs) {
        ctx.fillStyle = bc;
        ctx.fillRect(cx + bx, baseY - bh, bw, bh);
        ctx.strokeRect(cx + bx, baseY - bh, bw, bh);
        ctx.fillStyle = "#fff59d";
        for (let wy = baseY - bh + r * 0.16; wy < baseY - r * 0.12; wy += r * 0.22) {
          ctx.fillRect(cx + bx + bw * 0.22, wy, r * 0.08, r * 0.08);
          ctx.fillRect(cx + bx + bw * 0.6, wy, r * 0.08, r * 0.08);
        }
      }
      ctx.strokeStyle = f.color;
      break;
    }
    case "kettle": { // a teapot worn as a hat: body, spout, handle, lid knob
      ctx.fillStyle = "#c0392b";
      ctx.beginPath();
      ctx.ellipse(cx, topY - r * 0.35, r * 0.85, r * 0.55, 0, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();
      ctx.beginPath(); // spout
      ctx.moveTo(cx - r * 0.8, topY - r * 0.55);
      ctx.lineTo(cx - r * 1.3, topY - r * 1.0);
      ctx.lineTo(cx - r * 1.05, topY - r * 1.05);
      ctx.lineTo(cx - r * 0.65, topY - r * 0.3);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.beginPath(); // handle
      ctx.arc(cx + r * 0.95, topY - r * 0.35, r * 0.32, -Math.PI * 0.6, Math.PI * 0.6);
      ctx.stroke();
      ctx.fillStyle = "#a93226";
      ctx.beginPath(); ctx.ellipse(cx, topY - r * 0.85, r * 0.32, r * 0.16, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx, topY - r * 1.0, r * 0.12, 0, Math.PI * 2); ctx.fill();
      break;
    }
    case "clown": { // wide-brimmed cone with pompom + polka dots
      ctx.fillStyle = "#e53935";
      ctx.beginPath(); ctx.ellipse(cx, topY, r * 1.3, r * 0.32, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx - r * 0.62, topY); ctx.lineTo(cx + r * 0.62, topY); ctx.lineTo(cx, topY - r * 1.7);
      ctx.closePath(); ctx.fillStyle = "#1e88e5"; ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#fff176";
      for (const p of [[-0.2, -0.35], [0.18, -0.65], [0.05, -1.0]]) {
        ctx.beginPath(); ctx.arc(cx + p[0] * r, topY + p[1] * r, r * 0.12, 0, Math.PI * 2); ctx.fill();
      }
      ctx.fillStyle = "#f4b400";
      ctx.beginPath(); ctx.arc(cx, topY - r * 1.75, r * 0.22, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      break;
    }
    case "snakecrown": { // a coiled serpent wrapped around the brow, head rearing up front
      ctx.strokeStyle = "#2e7d32"; ctx.fillStyle = "#43a047";
      ctx.lineWidth = Math.max(2, r * 0.3);
      ctx.beginPath();
      ctx.moveTo(cx - r * 0.95, topY + r * 0.18);
      ctx.quadraticCurveTo(cx - r * 0.3, topY - r * 0.15, cx + r * 0.3, topY + r * 0.05);
      ctx.quadraticCurveTo(cx + r * 0.75, topY + r * 0.2, cx + r * 0.55, topY - r * 0.55);
      ctx.stroke();
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(cx + r * 0.55, topY - r * 0.6, r * 0.18, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = "#b71c1c";
      ctx.beginPath();
      ctx.moveTo(cx + r * 0.68, topY - r * 0.66); ctx.lineTo(cx + r * 0.85, topY - r * 0.72);
      ctx.moveTo(cx + r * 0.68, topY - r * 0.66); ctx.lineTo(cx + r * 0.82, topY - r * 0.58);
      ctx.stroke();
      ctx.strokeStyle = f.color;
      break;
    }
  }
}

// ------------------------------------------------------------------
// Hand-held items — proper models, scaled by s, anchored to the hand.
// Local coords: ground is y=0, up is negative.
// ------------------------------------------------------------------
function drawAccessory(ctx, f, hx, hy, s, t) {
  ctx.strokeStyle = f.color;
  ctx.fillStyle = f.color;
  ctx.lineWidth = Math.max(1.2, f.lineW * s * 0.8);
  switch (f.acc) {
    case "cane": // shaft planted on the ground with a curved handle at the hand
      ctx.beginPath();
      ctx.arc(hx, hy - 1.5 * s, 1.6 * s, Math.PI, 0);
      ctx.moveTo(hx + 1.6 * s, hy - 1.5 * s);
      ctx.lineTo(hx + 2.2 * s, -0.5 * s);
      ctx.stroke();
      break;
    case "staff": // tall staff planted on the ground, glowing orb on top
      ctx.beginPath();
      ctx.moveTo(hx + 2.5 * s, -0.5 * s);
      ctx.lineTo(hx + 1.5 * s, hy - 16 * s);
      ctx.stroke();
      ctx.fillStyle = "#7e57c2";
      ctx.save(); ctx.shadowColor = "#b388ff"; ctx.shadowBlur = 6;
      ctx.beginPath(); ctx.arc(hx + 1.4 * s, hy - 17.5 * s, 2.4 * s, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
      break;
    case "scythe": {
      ctx.beginPath();
      ctx.moveTo(hx + 3 * s, -0.5 * s);
      ctx.lineTo(hx - 1 * s, hy - 20 * s);
      ctx.stroke();
      ctx.fillStyle = "#90a4ae";
      ctx.beginPath();
      ctx.moveTo(hx - 1 * s, hy - 20 * s);
      ctx.quadraticCurveTo(hx + 9 * s, hy - 21 * s, hx + 12 * s, hy - 15 * s);
      ctx.quadraticCurveTo(hx + 8 * s, hy - 18.5 * s, hx - 1 * s, hy - 18.2 * s);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      break;
    }
    case "broom": // held diagonally, bristles at the low end
      ctx.beginPath();
      ctx.moveTo(hx - 8 * s, hy + 6 * s);
      ctx.lineTo(hx + 8 * s, hy - 4 * s);
      ctx.stroke();
      ctx.fillStyle = "#c49000";
      ctx.beginPath();
      ctx.moveTo(hx - 7 * s, hy + 4.5 * s);
      ctx.lineTo(hx - 12 * s, hy + 9 * s);
      ctx.lineTo(hx - 9 * s, hy + 10.5 * s);
      ctx.lineTo(hx - 5.5 * s, hy + 7 * s);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      break;
    case "guitar": {
      ctx.save();
      ctx.translate(hx, hy);
      ctx.rotate(0.32);
      // waisted electric-guitar body silhouette (double-bout shape)
      ctx.fillStyle = "#c62828"; ctx.strokeStyle = "#3e1f14";
      ctx.lineWidth = Math.max(0.9, f.lineW * s * 0.45);
      ctx.beginPath();
      ctx.moveTo(-1 * s, -4.5 * s);
      ctx.quadraticCurveTo(4 * s, -4.5 * s, 4.2 * s, -0.8 * s);
      ctx.quadraticCurveTo(4.4 * s, 1.4 * s, 2 * s, 2 * s);
      ctx.quadraticCurveTo(3.4 * s, 3.6 * s, 1.5 * s, 5.2 * s);
      ctx.quadraticCurveTo(-1 * s, 6.4 * s, -3 * s, 4.6 * s);
      ctx.quadraticCurveTo(-4.6 * s, 3 * s, -3.4 * s, 1 * s);
      ctx.quadraticCurveTo(-4.8 * s, -0.4 * s, -3.6 * s, -2.6 * s);
      ctx.quadraticCurveTo(-3 * s, -4.5 * s, -1 * s, -4.5 * s);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
      // pickups + bridge
      ctx.fillStyle = "#212121";
      ctx.fillRect(-1.4 * s, -0.6 * s, 2.8 * s, 0.9 * s);
      ctx.fillRect(-0.7 * s, 1.1 * s, 2.1 * s, 0.8 * s);
      // neck
      ctx.strokeStyle = "#3e1f14";
      ctx.lineWidth = Math.max(1.3, f.lineW * s * 0.7);
      ctx.beginPath(); ctx.moveTo(-1 * s, -4 * s); ctx.lineTo(-7.5 * s, -11.5 * s); ctx.stroke();
      // headstock + tuning pegs
      ctx.fillStyle = "#4e2b1f";
      ctx.fillRect(-9.4 * s, -13.4 * s, 3.2 * s, 2.6 * s);
      ctx.fillStyle = "#bdbdbd";
      for (const py of [-13.1, -12.2, -11.3]) {
        ctx.beginPath(); ctx.arc(-10 * s, py * s, 0.35 * s, 0, Math.PI * 2); ctx.fill();
      }
      // strings
      ctx.strokeStyle = "#eeeeee";
      ctx.lineWidth = Math.max(0.35, s * 0.14);
      ctx.beginPath();
      ctx.moveTo(-1.3 * s, -4 * s); ctx.lineTo(-7.3 * s, -11.2 * s);
      ctx.moveTo(-0.7 * s, -3.7 * s); ctx.lineTo(-6.8 * s, -10.9 * s);
      ctx.stroke();
      ctx.restore();
      break;
    }
    case "basket": { // wicker basket with colorful eggs inside
      const bx = hx + 2 * s, by = hy + 3 * s;
      ctx.fillStyle = "#d7a458"; ctx.strokeStyle = "#8d6e40";
      ctx.lineWidth = Math.max(0.9, f.lineW * s * 0.4);
      ctx.beginPath();
      ctx.moveTo(bx - 3.2 * s, by - 1.5 * s);
      ctx.lineTo(bx - 2.6 * s, by + 2 * s);
      ctx.lineTo(bx + 2.6 * s, by + 2 * s);
      ctx.lineTo(bx + 3.2 * s, by - 1.5 * s);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
      // handle
      ctx.beginPath();
      ctx.moveTo(bx - 2.6 * s, by - 1.5 * s);
      ctx.quadraticCurveTo(bx, by - 5.5 * s, bx + 2.6 * s, by - 1.5 * s);
      ctx.stroke();
      // weave lines
      ctx.beginPath();
      ctx.moveTo(bx - 2.9 * s, by); ctx.lineTo(bx + 2.9 * s, by);
      ctx.stroke();
      // colorful eggs peeking over the rim
      const eggHues = [0, 200, 130];
      for (let i = 0; i < 3; i++) {
        const ex = bx - 1.8 * s + i * 1.8 * s;
        ctx.fillStyle = `hsl(${eggHues[i]}, 70%, 65%)`;
        ctx.beginPath(); ctx.ellipse(ex, by - 2 * s, 1 * s, 1.35 * s, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      }
      break;
    }
    case "umbrella": { // open canopy overhead, curved handle in hand
      const px = hx + 2 * s, py = hy - 15 * s;
      ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(px, py); ctx.stroke();
      ctx.fillStyle = "#c62828";
      ctx.beginPath();
      ctx.moveTo(px - 10 * s, py);
      ctx.quadraticCurveTo(px, py - 8 * s, px + 10 * s, py);
      for (let i = 2; i >= 0; i--) {
        ctx.quadraticCurveTo(px + (i * 6.66 - 6.5) * s + 3.3 * s, py + 2 * s, px + (i * 6.66 - 10) * s, py);
      }
      ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(px, py - 8 * s + 1.5 * s); ctx.lineTo(px, py - 9.5 * s); ctx.stroke();
      break;
    }
    case "briefcase": // hangs from the hand by its handle
      ctx.beginPath(); ctx.arc(hx, hy + 1.6 * s, 1.6 * s, Math.PI, 0, true); ctx.stroke();
      ctx.fillStyle = "#6d4c41";
      ctx.fillRect(hx - 4.5 * s, hy + 2.6 * s, 9 * s, 6.4 * s);
      ctx.strokeRect(hx - 4.5 * s, hy + 2.6 * s, 9 * s, 6.4 * s);
      ctx.beginPath();
      ctx.moveTo(hx - 4.5 * s, hy + 5 * s); ctx.lineTo(hx + 4.5 * s, hy + 5 * s);
      ctx.stroke();
      break;
    case "moneybag": { // sack with a tied neck and a $ mark
      ctx.fillStyle = "#8d6e63";
      ctx.beginPath();
      ctx.moveTo(hx, hy + 1.5 * s);
      ctx.quadraticCurveTo(hx - 6 * s, hy + 3 * s, hx - 5 * s, hy + 8 * s);
      ctx.quadraticCurveTo(hx - 4 * s, hy + 11.5 * s, hx, hy + 11.5 * s);
      ctx.quadraticCurveTo(hx + 4 * s, hy + 11.5 * s, hx + 5 * s, hy + 8 * s);
      ctx.quadraticCurveTo(hx + 6 * s, hy + 3 * s, hx, hy + 1.5 * s);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#ffd700";
      ctx.font = `bold ${5 * s}px sans-serif`;
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("$", hx, hy + 7.5 * s);
      break;
    }
    case "racket":
      ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(hx + 4 * s, hy - 6 * s); ctx.stroke();
      ctx.fillStyle = "#fff";
      ctx.beginPath(); ctx.ellipse(hx + 6 * s, hy - 9 * s, 3.4 * s, 4.4 * s, 0.55, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.save(); ctx.lineWidth = 0.7;
      ctx.beginPath();
      ctx.moveTo(hx + 3.5 * s, hy - 9.5 * s); ctx.lineTo(hx + 8.5 * s, hy - 8.5 * s);
      ctx.moveTo(hx + 5.5 * s, hy - 12 * s); ctx.lineTo(hx + 6.5 * s, hy - 6 * s);
      ctx.stroke(); ctx.restore();
      break;
    case "club": { // driver resting over the shoulder: grip, steel shaft, real club head
      ctx.save();
      // steel shaft
      ctx.strokeStyle = "#9e9e9e";
      ctx.lineWidth = Math.max(1.1, f.lineW * s * 0.55);
      ctx.beginPath();
      ctx.moveTo(hx + 2 * s, hy + 2.6 * s);
      ctx.lineTo(hx - 9 * s, hy - 13 * s);
      ctx.stroke();
      // rubber grip through the hand
      ctx.strokeStyle = "#263238";
      ctx.lineWidth = Math.max(1.7, f.lineW * s * 0.95);
      ctx.beginPath();
      ctx.moveTo(hx + 2 * s, hy + 2.6 * s);
      ctx.lineTo(hx - 1 * s, hy - 1.6 * s);
      ctx.stroke();
      // driver head: rounded crown with a flat striking face toward the shaft
      ctx.strokeStyle = "#37474f";
      ctx.lineWidth = Math.max(0.9, f.lineW * s * 0.4);
      ctx.fillStyle = "#546e7a";
      ctx.beginPath();
      ctx.moveTo(hx - 8.6 * s, hy - 12.4 * s);
      ctx.lineTo(hx - 10.2 * s, hy - 11.2 * s);                                  // flat face
      ctx.quadraticCurveTo(hx - 13.6 * s, hy - 12.2 * s, hx - 13.2 * s, hy - 14.6 * s); // sole
      ctx.quadraticCurveTo(hx - 12.6 * s, hy - 16.4 * s, hx - 10 * s, hy - 15.6 * s);   // rounded rear
      ctx.quadraticCurveTo(hx - 8.6 * s, hy - 14.6 * s, hx - 8.6 * s, hy - 12.4 * s);   // hosel side
      ctx.closePath(); ctx.fill(); ctx.stroke();
      // crown highlight
      ctx.strokeStyle = "#b0bec5";
      ctx.beginPath();
      ctx.moveTo(hx - 9.6 * s, hy - 14.6 * s);
      ctx.quadraticCurveTo(hx - 11.4 * s, hy - 15.2 * s, hx - 12.4 * s, hy - 14.4 * s);
      ctx.stroke();
      ctx.restore();
      break;
    }
    case "clover":
      ctx.strokeStyle = "#2e7d32";
      ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(hx + 1.5 * s, hy - 4 * s); ctx.stroke();
      ctx.fillStyle = "#43a047";
      for (const a of [0, Math.PI / 2, Math.PI, Math.PI * 1.5]) {
        ctx.beginPath();
        ctx.arc(hx + 1.5 * s + Math.cos(a) * 1.7 * s, hy - 5.5 * s + Math.sin(a) * 1.7 * s, 1.5 * s, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    case "brush":
      ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(hx + 5 * s, hy - 7 * s); ctx.stroke();
      ctx.fillStyle = "#e53935";
      ctx.beginPath();
      ctx.moveTo(hx + 5 * s, hy - 7 * s);
      ctx.lineTo(hx + 7.5 * s, hy - 9.5 * s);
      ctx.lineTo(hx + 6.5 * s, hy - 6 * s);
      ctx.closePath(); ctx.fill();
      break;
    case "book": { // open book held in front
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.moveTo(hx, hy - 1 * s);
      ctx.lineTo(hx - 6 * s, hy - 3 * s); ctx.lineTo(hx - 6 * s, hy + 3 * s); ctx.lineTo(hx, hy + 5 * s);
      ctx.lineTo(hx + 6 * s, hy + 3 * s); ctx.lineTo(hx + 6 * s, hy - 3 * s);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(hx, hy - 1 * s); ctx.lineTo(hx, hy + 5 * s); ctx.stroke();
      break;
    }
    case "balloon":
      ctx.beginPath();
      ctx.moveTo(hx, hy);
      ctx.quadraticCurveTo(hx + 2 * s, hy - 8 * s, hx + 3 * s, hy - 15 * s);
      ctx.stroke();
      ctx.fillStyle = "#e53935";
      ctx.beginPath(); ctx.ellipse(hx + 3 * s, hy - 19.5 * s, 4.2 * s, 5.2 * s, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#ffffffaa";
      ctx.beginPath(); ctx.ellipse(hx + 1.6 * s, hy - 21 * s, 1.1 * s, 1.7 * s, -0.5, 0, Math.PI * 2); ctx.fill();
      break;
    case "wand":
      ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(hx + 7 * s, hy - 7 * s); ctx.stroke();
      ctx.fillStyle = "#fff";
      ctx.fillRect(hx + 5.4 * s, hy - 8.6 * s, 2.4 * s, 2.4 * s);
      break;
    case "camera":
      ctx.fillStyle = "#455a64";
      ctx.fillRect(hx - 3.5 * s, hy - 3 * s, 8 * s, 5.6 * s);
      ctx.strokeRect(hx - 3.5 * s, hy - 3 * s, 8 * s, 5.6 * s);
      ctx.fillStyle = "#90a4ae";
      ctx.beginPath(); ctx.arc(hx + 0.5 * s, hy - 0.2 * s, 1.9 * s, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#fff59d";
      ctx.fillRect(hx + 2.6 * s, hy - 2.4 * s, 1.3 * s, 1 * s);
      break;
    case "folder":
      ctx.fillStyle = "#ffe082";
      ctx.beginPath();
      ctx.moveTo(hx - 4.5 * s, hy - 2 * s);
      ctx.lineTo(hx - 1.5 * s, hy - 2 * s);
      ctx.lineTo(hx - 0.5 * s, hy - 3.2 * s);
      ctx.lineTo(hx + 4.5 * s, hy - 3.2 * s);
      ctx.lineTo(hx + 4.5 * s, hy + 3.5 * s);
      ctx.lineTo(hx - 4.5 * s, hy + 3.5 * s);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      break;
    case "key": // large golden key
      ctx.strokeStyle = "#c9a227";
      ctx.fillStyle = "#c9a227";
      ctx.lineWidth = Math.max(1.4, f.lineW * s * 0.9);
      ctx.beginPath(); ctx.arc(hx, hy - 3 * s, 2.4 * s, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(hx, hy - 0.6 * s); ctx.lineTo(hx, hy + 7 * s);
      ctx.moveTo(hx, hy + 7 * s); ctx.lineTo(hx + 2.4 * s, hy + 7 * s);
      ctx.moveTo(hx, hy + 5 * s); ctx.lineTo(hx + 1.8 * s, hy + 5 * s);
      ctx.stroke();
      break;
    case "pan":
      ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(hx + 4 * s, hy + 1 * s); ctx.stroke();
      ctx.fillStyle = "#455a64";
      ctx.beginPath(); ctx.ellipse(hx + 7.5 * s, hy + 1.5 * s, 3.6 * s, 1.6 * s, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      break;
    case "flask":
    case "flaskRed":
      ctx.fillStyle = f.acc === "flaskRed" ? "#e53935" : "#76ff03";
      ctx.beginPath();
      ctx.moveTo(hx - 1 * s, hy - 4 * s); ctx.lineTo(hx - 1 * s, hy - 1 * s);
      ctx.lineTo(hx - 4 * s, hy + 5 * s); ctx.lineTo(hx + 4 * s, hy + 5 * s);
      ctx.lineTo(hx + 1 * s, hy - 1 * s); ctx.lineTo(hx + 1 * s, hy - 4 * s);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      break;
    case "mic":
      ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(hx + 3 * s, hy - 6 * s); ctx.stroke();
      ctx.fillStyle = "#455a64";
      ctx.beginPath(); ctx.arc(hx + 3.5 * s, hy - 7.5 * s, 2.2 * s, 0, Math.PI * 2); ctx.fill();
      break;
    case "shield":
      ctx.fillStyle = "#b0bec5";
      ctx.beginPath();
      ctx.moveTo(hx - 3 * s, hy - 5 * s); ctx.lineTo(hx + 5 * s, hy - 5 * s);
      ctx.lineTo(hx + 5 * s, hy + 2 * s); ctx.lineTo(hx + 1 * s, hy + 7 * s);
      ctx.lineTo(hx - 3 * s, hy + 2 * s); ctx.closePath(); ctx.fill(); ctx.stroke();
      break;
    case "axe": { // fire axe carried level: wooden haft, steel head with blade down + pick up
      ctx.save();
      ctx.translate(hx, hy);
      ctx.rotate(-0.12); // slight upward tilt toward the head end
      // wooden haft with a darker grip at the back end
      ctx.strokeStyle = "#8d6e63";
      ctx.lineWidth = Math.max(1.6, f.lineW * s * 0.9);
      ctx.beginPath(); ctx.moveTo(-6.5 * s, 0); ctx.lineTo(6.4 * s, 0); ctx.stroke();
      ctx.strokeStyle = "#5d4037";
      ctx.beginPath(); ctx.moveTo(-6.5 * s, 0); ctx.lineTo(-4.6 * s, 0); ctx.stroke();
      ctx.strokeStyle = "#455a64";
      ctx.lineWidth = Math.max(1, f.lineW * s * 0.4);
      // pick spike pointing up from the head
      ctx.fillStyle = "#90a4ae";
      ctx.beginPath();
      ctx.moveTo(5.6 * s, -0.8 * s);
      ctx.lineTo(6.6 * s, -4.2 * s);
      ctx.lineTo(7.5 * s, -0.8 * s);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
      // blade hanging below: cheeks widening into a convex cutting edge
      ctx.fillStyle = "#b0bec5";
      ctx.beginPath();
      ctx.moveTo(5.4 * s, 0.9 * s);
      ctx.lineTo(7.6 * s, 0.9 * s);
      ctx.quadraticCurveTo(9.6 * s, 1.8 * s, 10 * s, 3.8 * s);
      ctx.quadraticCurveTo(9.4 * s, 5.8 * s, 7.4 * s, 6.4 * s);
      ctx.quadraticCurveTo(5.3 * s, 3.2 * s, 5.4 * s, 0.9 * s);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
      // eye collar where the haft passes through the head
      ctx.fillStyle = "#78909c";
      ctx.fillRect(5.6 * s, -1 * s, 1.7 * s, 2 * s);
      ctx.strokeRect(5.6 * s, -1 * s, 1.7 * s, 2 * s);
      ctx.restore();
      break;
    }
    case "drum":
      ctx.fillStyle = "#e53935";
      ctx.beginPath(); ctx.ellipse(hx + 2 * s, hy + 3 * s, 4.5 * s, 3 * s, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(hx + 2 * s, hy + 1 * s); ctx.lineTo(hx + 6 * s, hy - 3 * s);
      ctx.moveTo(hx + 2 * s, hy + 1 * s); ctx.lineTo(hx - 2 * s, hy - 3 * s);
      ctx.stroke();
      break;
    case "statue": { // a tiny posed stickman atop a small pedestal
      const px = hx + 2 * s, py = hy + 3 * s;
      ctx.fillStyle = "#bdbdbd";
      ctx.fillRect(px - 2.2 * s, py, 4.4 * s, 1.6 * s);
      ctx.strokeRect(px - 2.2 * s, py, 4.4 * s, 1.6 * s);
      ctx.strokeStyle = "#9e9e9e";
      ctx.lineWidth = Math.max(1, f.lineW * s * 0.45);
      ctx.fillStyle = "#9e9e9e";
      const bx = px, by = py;
      ctx.beginPath(); ctx.arc(bx, by - 5.4 * s, 1 * s, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath();
      ctx.moveTo(bx, by - 4.4 * s); ctx.lineTo(bx, by - 1.6 * s);
      ctx.moveTo(bx, by - 3.6 * s); ctx.lineTo(bx - 2 * s, by - 5 * s);
      ctx.moveTo(bx, by - 3.6 * s); ctx.lineTo(bx + 1.6 * s, by - 2.4 * s);
      ctx.moveTo(bx, by - 1.6 * s); ctx.lineTo(bx - 1.6 * s, by);
      ctx.moveTo(bx, by - 1.6 * s); ctx.lineTo(bx + 1.8 * s, by - 0.4 * s);
      ctx.stroke();
      break;
    }
    case "violin": {
      ctx.save();
      ctx.translate(hx, hy);
      ctx.rotate(-0.5);
      ctx.fillStyle = "#8d5524"; ctx.strokeStyle = "#5d3a1a";
      ctx.beginPath();
      ctx.ellipse(0, 0, 1.6 * s, 3 * s, 0, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, -3 * s); ctx.lineTo(0, -6.5 * s);
      ctx.stroke();
      ctx.beginPath(); ctx.arc(0, -6.8 * s, 0.6 * s, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.restore();
      ctx.strokeStyle = "#3e2723";
      ctx.lineWidth = Math.max(1, f.lineW * s * 0.4);
      ctx.beginPath();
      ctx.moveTo(hx - 3 * s, hy - 4 * s); ctx.lineTo(hx + 3 * s, hy + 2 * s);
      ctx.stroke();
      break;
    }
    case "clockAcc": {
      ctx.fillStyle = "#ffd700";
      ctx.beginPath(); ctx.arc(hx + 2 * s, hy + 2 * s, 4 * s, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      const mAng = t * 1.9 - Math.PI / 2, hAng = t * 0.35 - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(hx + 2 * s, hy + 2 * s);
      ctx.lineTo(hx + 2 * s + Math.cos(mAng) * 3 * s, hy + 2 * s + Math.sin(mAng) * 3 * s);
      ctx.moveTo(hx + 2 * s, hy + 2 * s);
      ctx.lineTo(hx + 2 * s + Math.cos(hAng) * 1.9 * s, hy + 2 * s + Math.sin(hAng) * 1.9 * s);
      ctx.stroke();
      break;
    }
    case "pencil": { // giant reality-drawing pencil, tip on the ground
      const tipX = hx + 5 * s, tipY = -0.5 * s;
      // squiggle it just drew, trailing behind the tip
      ctx.save();
      ctx.strokeStyle = "#78909c";
      ctx.lineWidth = Math.max(1, f.lineW * s * 0.5);
      ctx.beginPath();
      ctx.moveTo(tipX, tipY);
      for (let i = 1; i <= 6; i++) {
        ctx.lineTo(tipX - i * 3.2 * s, tipY + Math.sin(i * 1.9 + t * 4) * 1.4 * s);
      }
      ctx.stroke();
      ctx.restore();
      // pencil body angled from hand to tip
      const ang = Math.atan2((hy - 14 * s) - tipY, (hx - 3 * s) - tipX);
      ctx.save();
      ctx.translate(tipX, tipY);
      ctx.rotate(ang + Math.PI / 2);
      ctx.fillStyle = "#37474f"; // tip
      ctx.beginPath();
      ctx.moveTo(0, 0); ctx.lineTo(-1.8 * s, -3.5 * s); ctx.lineTo(1.8 * s, -3.5 * s);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#fbc02d"; // shaft
      ctx.fillRect(-1.8 * s, -18 * s, 3.6 * s, 14.5 * s);
      ctx.strokeRect(-1.8 * s, -18 * s, 3.6 * s, 14.5 * s);
      ctx.fillStyle = "#f48fb1"; // eraser
      ctx.fillRect(-1.8 * s, -21 * s, 3.6 * s, 3 * s);
      ctx.restore();
      break;
    }
    case "rapier": { // slender fencing blade, cup guard, knuckle bow, gold pommel
      ctx.save();
      ctx.strokeStyle = "#b0bec5";
      ctx.lineWidth = Math.max(1.1, f.lineW * s * 0.45);
      ctx.beginPath();
      ctx.moveTo(hx + 2.4 * s, hy - 1 * s);
      ctx.lineTo(hx + 14.5 * s, hy - 5 * s);
      ctx.stroke();
      ctx.restore();
      // cup guard: steel bowl tilted along the blade
      ctx.fillStyle = "#78909c";
      ctx.beginPath();
      ctx.ellipse(hx + 2.2 * s, hy - 0.9 * s, 0.9 * s, 2.1 * s, -0.32, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();
      // knuckle bow curving under the hand
      ctx.beginPath();
      ctx.moveTo(hx + 1.9 * s, hy + 0.9 * s);
      ctx.quadraticCurveTo(hx - 0.2 * s, hy + 2.4 * s, hx - 1.3 * s, hy + 0.9 * s);
      ctx.stroke();
      // grip + gold pommel behind the hand
      ctx.beginPath();
      ctx.moveTo(hx + 1.6 * s, hy - 0.7 * s);
      ctx.lineTo(hx - 1.1 * s, hy + 0.5 * s);
      ctx.stroke();
      ctx.fillStyle = "#c9a227";
      ctx.beginPath(); ctx.arc(hx - 1.6 * s, hy + 0.75 * s, 0.75 * s, 0, Math.PI * 2); ctx.fill();
      break;
    }
    case "magnifier": // a magnifying glass held out, searching
      ctx.save();
      ctx.strokeStyle = "#5d4037";
      ctx.lineWidth = Math.max(1.4, f.lineW * s * 0.9);
      ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(hx + 4 * s, hy - 4 * s); ctx.stroke();
      ctx.strokeStyle = "#455a64";
      ctx.lineWidth = Math.max(1.2, f.lineW * s * 0.7);
      ctx.beginPath(); ctx.arc(hx + 6.6 * s, hy - 6.6 * s, 3 * s, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = "rgba(180,220,240,0.35)";
      ctx.beginPath(); ctx.arc(hx + 6.6 * s, hy - 6.6 * s, 2.6 * s, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
      break;
    case "pageHeld": { // a glowing blank page held out, edges faintly shimmering
      ctx.save();
      ctx.shadowColor = f.glowText || "#b3e5fc"; ctx.shadowBlur = 8;
      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = "#90a4ae";
      ctx.lineWidth = Math.max(1, f.lineW * s * 0.5);
      const px = hx + 2 * s, py = hy - 1 * s;
      ctx.beginPath(); ctx.rect(px - 3 * s, py - 4.5 * s, 6 * s, 9 * s); ctx.fill(); ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.fillStyle = f.glowText || "#42a5f5";
      ctx.font = `800 ${5 * s}px sans-serif`;
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("?", px, py);
      ctx.restore();
      break;
    }
    case "hammer": { // claw hammer, filled silhouette angled forward-down so it always clears the head
      ctx.save();
      ctx.translate(hx, hy); ctx.rotate(0.5);
      ctx.strokeStyle = "#4e342e"; ctx.fillStyle = "#8d6e63";
      ctx.lineWidth = Math.max(0.9, f.lineW * s * 0.45);
      ctx.beginPath(); ctx.rect(-0.8 * s, 0, 1.6 * s, 6.8 * s); ctx.fill(); ctx.stroke(); // wooden handle
      ctx.fillStyle = "#78909c"; ctx.strokeStyle = "#37474f";
      ctx.beginPath(); ctx.rect(-3.2 * s, -2.6 * s, 6.4 * s, 2.6 * s); ctx.fill(); ctx.stroke(); // head block
      ctx.beginPath(); // claw notch on the back end
      ctx.moveTo(-3.2 * s, -2.6 * s);
      ctx.lineTo(-4.7 * s, -3.6 * s);
      ctx.lineTo(-4.7 * s, -1.8 * s);
      ctx.lineTo(-3.2 * s, -1.4 * s);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.restore();
      break;
    }
    case "wrench": { // open-end wrench, filled silhouette angled forward-down so it always clears the head
      ctx.save();
      ctx.translate(hx, hy); ctx.rotate(0.55);
      ctx.fillStyle = "#90a4ae"; ctx.strokeStyle = "#37474f";
      ctx.lineWidth = Math.max(0.8, f.lineW * s * 0.4);
      ctx.beginPath(); ctx.rect(-0.8 * s, 0, 1.6 * s, 6.4 * s); ctx.fill(); ctx.stroke(); // handle
      ctx.beginPath(); // open jaw head
      ctx.moveTo(-0.8 * s, 0);
      ctx.lineTo(-2.5 * s, -1.6 * s); ctx.lineTo(-2.5 * s, -3.3 * s); ctx.lineTo(-0.9 * s, -3.3 * s);
      ctx.lineTo(-0.9 * s, -2.2 * s); ctx.lineTo(0.9 * s, -2.2 * s); ctx.lineTo(0.9 * s, -3.3 * s);
      ctx.lineTo(2.5 * s, -3.3 * s); ctx.lineTo(2.5 * s, -1.6 * s); ctx.lineTo(0.8 * s, 0);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.restore();
      break;
    }
    case "pencilSmall": { // a plain drafting pencil, no ground squiggle
      ctx.save();
      ctx.translate(hx, hy); ctx.rotate(-0.7);
      ctx.fillStyle = "#fbc02d"; ctx.strokeStyle = "#b8860b";
      ctx.lineWidth = Math.max(0.8, f.lineW * s * 0.5);
      ctx.fillRect(-1.1 * s, -9 * s, 2.2 * s, 8 * s); ctx.strokeRect(-1.1 * s, -9 * s, 2.2 * s, 8 * s);
      ctx.fillStyle = "#37474f";
      ctx.beginPath(); ctx.moveTo(-1.1 * s, -9 * s); ctx.lineTo(1.1 * s, -9 * s); ctx.lineTo(0, -11 * s); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#f48fb1";
      ctx.fillRect(-1.1 * s, -1 * s, 2.2 * s, 1.6 * s);
      ctx.restore();
      break;
    }
    case "blueprint": { // a blue building-plan sheet with faint draft lines
      ctx.save();
      ctx.fillStyle = "#1565c0"; ctx.strokeStyle = "#0d47a1";
      ctx.lineWidth = Math.max(0.9, f.lineW * s * 0.45);
      ctx.beginPath(); ctx.rect(hx - 0.5 * s, hy - 4 * s, 8 * s, 6 * s); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#e3f2fd";
      ctx.beginPath(); ctx.ellipse(hx - 0.5 * s, hy - 1 * s, 1 * s, 3 * s, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = "#90caf9";
      ctx.lineWidth = Math.max(0.5, f.lineW * s * 0.28);
      ctx.beginPath();
      for (let i = 1; i < 3; i++) {
        const xx = hx - 0.5 * s + (i * 8 * s) / 3;
        ctx.moveTo(xx, hy - 3.4 * s); ctx.lineTo(xx, hy + 1.6 * s);
      }
      ctx.moveTo(hx - 0.5 * s, hy - 1 * s); ctx.lineTo(hx + 7.5 * s, hy - 1 * s);
      ctx.stroke();
      ctx.restore();
      break;
    }
    case "cards": { // a fanned hand of three playing cards
      ctx.save();
      for (const [ang, col] of [[-0.35, "#c62828"], [0, "#212121"], [0.35, "#c62828"]]) {
        ctx.save();
        ctx.translate(hx + 2 * s, hy);
        ctx.rotate(ang);
        ctx.fillStyle = "#fff"; ctx.strokeStyle = "#9e9e9e";
        ctx.lineWidth = Math.max(0.7, f.lineW * s * 0.4);
        ctx.fillRect(-2.2 * s, -6.5 * s, 4.4 * s, 6.5 * s);
        ctx.strokeRect(-2.2 * s, -6.5 * s, 4.4 * s, 6.5 * s);
        ctx.fillStyle = col;
        ctx.beginPath(); ctx.arc(0, -3.3 * s, 1.1 * s, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }
      ctx.restore();
      break;
    }
    case "katana": { // a curved blade held ready, with motion-slash lines
      ctx.save();
      ctx.strokeStyle = "#cfd8dc";
      ctx.lineWidth = Math.max(1.4, f.lineW * s * 1.1);
      ctx.beginPath();
      ctx.moveTo(hx - 1 * s, hy + 1 * s);
      ctx.quadraticCurveTo(hx + 6 * s, hy - 4 * s, hx + 11 * s, hy - 10 * s);
      ctx.stroke();
      ctx.strokeStyle = "#212121";
      ctx.lineWidth = Math.max(1.8, f.lineW * s * 1.3);
      ctx.beginPath(); ctx.moveTo(hx - 1 * s, hy + 1 * s); ctx.lineTo(hx - 3.5 * s, hy + 3 * s); ctx.stroke();
      ctx.strokeStyle = "#90a4ae";
      ctx.lineWidth = Math.max(0.7, f.lineW * s * 0.4);
      ctx.globalAlpha = 0.55;
      for (const off of [1.4, 2.6]) {
        ctx.beginPath();
        ctx.moveTo(hx - off * s, hy + (1 + off * 0.4) * s);
        ctx.quadraticCurveTo(hx + (6 - off * 0.4) * s, hy - (4 - off * 0.3) * s, hx + (11 - off) * s, hy - (10 - off * 0.4) * s);
        ctx.stroke();
      }
      ctx.restore();
      break;
    }
    case "gamepad": { // two-handed game controller with a joystick nub
      ctx.save();
      ctx.fillStyle = "#263238"; ctx.strokeStyle = "#111";
      ctx.beginPath();
      ctx.moveTo(hx - 5 * s, hy);
      ctx.quadraticCurveTo(hx - 6 * s, hy - 3 * s, hx - 2 * s, hy - 3 * s);
      ctx.lineTo(hx + 2 * s, hy - 3 * s);
      ctx.quadraticCurveTo(hx + 6 * s, hy - 3 * s, hx + 5 * s, hy);
      ctx.quadraticCurveTo(hx + 4 * s, hy + 3 * s, hx + 2 * s, hy + 1 * s);
      ctx.lineTo(hx - 2 * s, hy + 1 * s);
      ctx.quadraticCurveTo(hx - 4 * s, hy + 3 * s, hx - 5 * s, hy);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#e53935";
      ctx.beginPath(); ctx.arc(hx + 3 * s, hy - 1.5 * s, 0.6 * s, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#78909c";
      ctx.beginPath(); ctx.arc(hx - 3 * s, hy - 1.5 * s, 0.7 * s, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
      break;
    }
    case "remote": { // held remote control, buttons in rows, pointed forward
      ctx.save();
      ctx.fillStyle = "#212121"; ctx.strokeStyle = "#000";
      ctx.fillRect(hx, hy - 5 * s, 2.4 * s, 7 * s);
      ctx.strokeRect(hx, hy - 5 * s, 2.4 * s, 7 * s);
      ctx.fillStyle = "#4fc3f7";
      for (let i = 0; i < 3; i++) {
        ctx.beginPath(); ctx.arc(hx + 1.2 * s, hy - 3.5 * s + i * 1.8 * s, 0.5 * s, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
      break;
    }
    case "newspaper": { // folded paper with headline lines
      ctx.save();
      ctx.fillStyle = "#fafafa"; ctx.strokeStyle = "#9e9e9e";
      ctx.fillRect(hx - 1 * s, hy - 5 * s, 6 * s, 4.4 * s);
      ctx.strokeRect(hx - 1 * s, hy - 5 * s, 6 * s, 4.4 * s);
      ctx.strokeStyle = "#616161";
      ctx.lineWidth = Math.max(0.6, f.lineW * s * 0.35);
      ctx.beginPath();
      for (let i = 0; i < 3; i++) {
        ctx.moveTo(hx - 0.3 * s, hy - 4 * s + i * 1.3 * s);
        ctx.lineTo(hx + 4.3 * s, hy - 4 * s + i * 1.3 * s);
      }
      ctx.stroke();
      ctx.restore();
      break;
    }
    case "pillow": { // hugged fluffy pillow
      ctx.save();
      ctx.fillStyle = "#eceff1"; ctx.strokeStyle = "#b0bec5";
      ctx.beginPath(); ctx.ellipse(hx + 1 * s, hy - 1 * s, 4 * s, 3 * s, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.restore();
      break;
    }
    case "scanner": { // handheld scanner with a small screen and a sweeping beam
      ctx.save();
      ctx.fillStyle = "#37474f"; ctx.strokeStyle = "#111";
      ctx.fillRect(hx, hy - 3 * s, 4 * s, 3 * s); ctx.strokeRect(hx, hy - 3 * s, 4 * s, 3 * s);
      ctx.fillStyle = "#69f0ae";
      ctx.fillRect(hx + 0.6 * s, hy - 2.5 * s, 2.8 * s, 1.6 * s);
      ctx.strokeStyle = "#69f0ae"; ctx.globalAlpha = 0.6 + Math.sin(t * 6) * 0.3;
      ctx.beginPath(); ctx.moveTo(hx + 2 * s, hy); ctx.lineTo(hx + 2 * s - 5 * s, hy + 9 * s); ctx.lineTo(hx + 2 * s + 5 * s, hy + 9 * s); ctx.closePath(); ctx.stroke();
      ctx.restore();
      break;
    }
    case "photostack": { // a thick held stack of tiny photographs
      ctx.save();
      ctx.fillStyle = "#fff"; ctx.strokeStyle = "#9e9e9e";
      for (let i = 0; i < 4; i++) {
        ctx.save();
        ctx.translate(hx + i * 0.3 * s, hy - i * 0.4 * s); ctx.rotate((i - 1.5) * 0.12);
        ctx.fillRect(-2 * s, -2.6 * s, 4 * s, 5.2 * s); ctx.strokeRect(-2 * s, -2.6 * s, 4 * s, 5.2 * s);
        ctx.restore();
      }
      ctx.restore();
      break;
    }
    case "detector": { // a wand-tipped rarity detector, pulsing with a found-something glow
      ctx.save();
      ctx.strokeStyle = "#78909c"; ctx.lineWidth = Math.max(1.2, f.lineW * s * 0.7);
      ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(hx + 6 * s, hy - 4 * s); ctx.stroke();
      const pulse = 0.6 + Math.sin(t * 8) * 0.4;
      ctx.fillStyle = `rgba(255, 214, 0, ${pulse})`;
      ctx.shadowColor = "#ffd600"; ctx.shadowBlur = 6;
      ctx.beginPath(); ctx.arc(hx + 6 * s, hy - 4 * s, 1.4 * s, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
      break;
    }
    case "cup": { // championship cup raised overhead
      ctx.save();
      ctx.translate(hx, hy - 14 * s);
      ctx.fillStyle = "#ffd700"; ctx.strokeStyle = "#b8860b";
      ctx.beginPath();
      ctx.moveTo(-2.4 * s, -2 * s); ctx.lineTo(2.4 * s, -2 * s);
      ctx.lineTo(1.6 * s, 2 * s); ctx.lineTo(-1.6 * s, 2 * s);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-2.4 * s, -1 * s); ctx.quadraticCurveTo(-4.4 * s, -1 * s, -3.6 * s, 1 * s);
      ctx.moveTo(2.4 * s, -1 * s); ctx.quadraticCurveTo(4.4 * s, -1 * s, 3.6 * s, 1 * s);
      ctx.stroke();
      ctx.fillRect(-0.5 * s, 2 * s, 1 * s, 1.6 * s);
      ctx.fillRect(-1.6 * s, 3.4 * s, 3.2 * s, 0.8 * s);
      ctx.restore();
      break;
    }
  }
  ctx.lineWidth = f.lineW * 1;
}

// Items worn on the back (drawn behind the body).
function drawBackItem(ctx, f, shoX, shoY, hipY, s, t) {
  ctx.strokeStyle = f.color;
  switch (f.back) {
    case "backpack": {
      ctx.fillStyle = "#6d4c41";
      const bx = shoX - 7.5 * s, by = shoY + 1 * s;
      ctx.beginPath();
      ctx.moveTo(bx, by);
      ctx.lineTo(bx + 5 * s, by - 1 * s);
      ctx.lineTo(bx + 5.5 * s, by + 9 * s);
      ctx.lineTo(bx + 0.5 * s, by + 10 * s);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#5d4037";
      ctx.fillRect(bx + 1 * s, by + 2.5 * s, 3.5 * s, 3 * s); // pocket
      ctx.beginPath(); // strap across the chest
      ctx.moveTo(bx + 5 * s, by);
      ctx.quadraticCurveTo(shoX + 2 * s, shoY + 4 * s, shoX + 1 * s, hipY);
      ctx.stroke();
      break;
    }
    case "sword": // sheathed diagonally across the back
      ctx.strokeStyle = "#78909c";
      ctx.lineWidth = f.lineW * s * 1.1;
      ctx.beginPath();
      ctx.moveTo(shoX - 3 * s, shoY + 5 * s);
      ctx.lineTo(shoX - 9 * s, shoY - 6 * s);
      ctx.stroke();
      ctx.strokeStyle = f.color;
      ctx.lineWidth = f.lineW * s * 0.9;
      ctx.beginPath(); // crossguard + grip
      ctx.moveTo(shoX - 10.5 * s, shoY - 4.5 * s); ctx.lineTo(shoX - 7 * s, shoY - 7 * s);
      ctx.moveTo(shoX - 9 * s, shoY - 6 * s); ctx.lineTo(shoX - 11 * s, shoY - 9.5 * s);
      ctx.stroke();
      break;
    case "windkey": {
      const spin = t * 3;
      const kx = shoX - 6 * s, ky = (shoY + hipY) / 2;
      ctx.strokeStyle = "#b8860b";
      ctx.beginPath(); ctx.moveTo(shoX - 1 * s, ky); ctx.lineTo(kx, ky); ctx.stroke();
      ctx.save();
      ctx.translate(kx, ky); ctx.rotate(spin);
      ctx.beginPath();
      ctx.ellipse(-2.5 * s, 0, 2.5 * s, 1.4 * s, 0, 0, Math.PI * 2);
      ctx.ellipse(2.5 * s, 0, 2.5 * s, 1.4 * s, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
      break;
    }
  }
  ctx.lineWidth = f.lineW * 1;
}

// Icons embedded in the torso.
function drawChestIcon(ctx, f, cxp, cyp, s, t) {
  ctx.strokeStyle = f.color;
  switch (f.chest) {
    case "badge": { // gold star badge pinned on the chest
      ctx.fillStyle = "#f4b400";
      starPath(ctx, cxp + 1.2 * s, cyp - 1 * s, 1.6 * s);
      ctx.fill();
      ctx.strokeStyle = "#b8860b"; ctx.stroke();
      ctx.strokeStyle = f.color;
      break;
    }
    case "warning": { // yellow hazard triangle with a "!" pinned on the chest
      ctx.save();
      ctx.fillStyle = "#ffd600"; ctx.strokeStyle = "#212121";
      ctx.lineWidth = Math.max(0.8, f.lineW * s * 0.4);
      ctx.beginPath();
      ctx.moveTo(cxp + 1.2 * s, cyp - 2.4 * s);
      ctx.lineTo(cxp + 3.2 * s, cyp + 1.6 * s);
      ctx.lineTo(cxp - 0.8 * s, cyp + 1.6 * s);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#212121";
      ctx.fillRect(cxp + 1.05 * s, cyp - 1.5 * s, 0.3 * s, 1.6 * s);
      ctx.beginPath(); ctx.arc(cxp + 1.2 * s, cyp + 0.7 * s, 0.25 * s, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
      ctx.strokeStyle = f.color;
      break;
    }
    case "steth": { // stethoscope: tube around the neck down to a chest disc
      ctx.strokeStyle = "#455a64";
      ctx.lineWidth = Math.max(1, f.lineW * s * 0.5);
      ctx.beginPath();
      ctx.moveTo(cxp - 1.6 * s, cyp - 4.2 * s);
      ctx.quadraticCurveTo(cxp - 2.2 * s, cyp - 1 * s, cxp + 1.4 * s, cyp + 1.2 * s);
      ctx.moveTo(cxp + 1.8 * s, cyp - 4.4 * s);
      ctx.quadraticCurveTo(cxp + 2.6 * s, cyp - 1.5 * s, cxp + 1.4 * s, cyp + 1.2 * s);
      ctx.stroke();
      ctx.fillStyle = "#78909c";
      ctx.beginPath(); ctx.arc(cxp + 1.4 * s, cyp + 1.6 * s, 1.1 * s, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = f.color;
      ctx.lineWidth = f.lineW * s;
      break;
    }
    case "swirl":
      ctx.save();
      ctx.translate(cxp, cyp); ctx.rotate(t * 2);
      ctx.beginPath();
      for (let a = 0; a < Math.PI * 4; a += 0.4) {
        const rr = a * 0.55 * s;
        const x = Math.cos(a) * rr, y = Math.sin(a) * rr;
        a === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.restore();
      break;
    case "gear": {
      ctx.save();
      ctx.translate(cxp, cyp); ctx.rotate(t * 1.5);
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const a = (i * Math.PI) / 4;
        ctx.moveTo(Math.cos(a) * 2 * s, Math.sin(a) * 2 * s);
        ctx.lineTo(Math.cos(a) * 3.4 * s, Math.sin(a) * 3.4 * s);
      }
      ctx.stroke();
      ctx.beginPath(); ctx.arc(0, 0, 2 * s, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();
      break;
    }
    case "gearTrain": { // two meshing gears turning inside the torso
      const gear = (x, y, rad, n, rot, fill, edge) => {
        ctx.save();
        ctx.translate(x, y); ctx.rotate(rot);
        ctx.fillStyle = fill; ctx.strokeStyle = edge;
        ctx.lineWidth = Math.max(0.9, f.lineW * s * 0.4);
        const inner = rad * 0.74;
        ctx.beginPath();
        for (let i = 0; i < n; i++) {
          const a = (i * 2 * Math.PI) / n, dt2 = Math.PI / n;
          const px = (rr, ang) => [Math.cos(ang) * rr, Math.sin(ang) * rr];
          const [x1, y1] = px(inner, a - dt2 * 0.55);
          const [x2, y2] = px(rad, a - dt2 * 0.3);
          const [x3, y3] = px(rad, a + dt2 * 0.3);
          const [x4, y4] = px(inner, a + dt2 * 0.55);
          i === 0 ? ctx.moveTo(x1, y1) : ctx.lineTo(x1, y1);
          ctx.lineTo(x2, y2); ctx.lineTo(x3, y3); ctx.lineTo(x4, y4);
        }
        ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.arc(0, 0, inner * 0.62, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); // spokes
        for (let i = 0; i < 4; i++) {
          const a = (i * Math.PI) / 2;
          ctx.moveTo(Math.cos(a) * rad * 0.16, Math.sin(a) * rad * 0.16);
          ctx.lineTo(Math.cos(a) * inner * 0.62, Math.sin(a) * inner * 0.62);
        }
        ctx.stroke();
        ctx.beginPath(); ctx.arc(0, 0, rad * 0.14, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      };
      gear(cxp - 0.6 * s, cyp + 1 * s, 3.1 * s, 9, t * 1.1, "#b08d57", "#6d4c41");
      gear(cxp + 3 * s, cyp - 2.6 * s, 2 * s, 7, -t * 1.1 * 1.55 + 0.24, "#90a4ae", "#455a64");
      break;
    }
    case "hourglass":
      ctx.beginPath();
      ctx.moveTo(cxp - 2.6 * s, cyp - 3.5 * s); ctx.lineTo(cxp + 2.6 * s, cyp - 3.5 * s);
      ctx.lineTo(cxp - 2.6 * s, cyp + 3.5 * s); ctx.lineTo(cxp + 2.6 * s, cyp + 3.5 * s);
      ctx.closePath(); ctx.stroke();
      ctx.fillStyle = "#f4b400";
      ctx.beginPath();
      ctx.moveTo(cxp - 1.4 * s, cyp + 2.8 * s); ctx.lineTo(cxp + 1.4 * s, cyp + 2.8 * s);
      ctx.lineTo(cxp, cyp + 0.5 * s); ctx.closePath(); ctx.fill();
      break;
    case "ribs":
      ctx.beginPath();
      for (let i = 0; i < 3; i++) {
        ctx.moveTo(cxp - 3 * s, cyp + (i - 1) * 2.4 * s);
        ctx.lineTo(cxp + 3 * s, cyp + (i - 1) * 2.4 * s);
      }
      ctx.stroke();
      break;
    case "core":
      ctx.save(); ctx.shadowColor = "#4fc3f7"; ctx.shadowBlur = 8;
      ctx.fillStyle = "#4fc3f7";
      ctx.beginPath(); ctx.arc(cxp, cyp, 2.4 * s, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
      break;
    case "keys":
      for (let i = 0; i < 5; i++) {
        ctx.fillStyle = i % 2 ? "#212121" : "#fff";
        ctx.fillRect(cxp - 4 * s + i * 1.6 * s, cyp - 1.8 * s, 1.5 * s, 3.6 * s);
        ctx.strokeRect(cxp - 4 * s + i * 1.6 * s, cyp - 1.8 * s, 1.5 * s, 3.6 * s);
      }
      break;
    case "book":
      ctx.fillStyle = "#fff";
      ctx.fillRect(cxp - 3.4 * s, cyp - 2.4 * s, 6.8 * s, 4.8 * s);
      ctx.strokeRect(cxp - 3.4 * s, cyp - 2.4 * s, 6.8 * s, 4.8 * s);
      ctx.beginPath(); ctx.moveTo(cxp, cyp - 2.4 * s); ctx.lineTo(cxp, cyp + 2.4 * s); ctx.stroke();
      break;
    case "eye": { // an all-seeing eye holding a secret
      ctx.save();
      ctx.shadowColor = "#ffd54f"; ctx.shadowBlur = 6;
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.moveTo(cxp - 4 * s, cyp);
      ctx.quadraticCurveTo(cxp, cyp - 3 * s, cxp + 4 * s, cyp);
      ctx.quadraticCurveTo(cxp, cyp + 3 * s, cxp - 4 * s, cyp);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#5e35b1";
      ctx.beginPath(); ctx.arc(cxp, cyp, 1.6 * s, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#111";
      ctx.beginPath(); ctx.arc(cxp, cyp, 0.7 * s, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
      break;
    }
    case "musicbox": { // an ornate little box with a note popping out the lid
      ctx.save();
      ctx.fillStyle = "#8d6e63"; ctx.strokeStyle = "#5d4037";
      ctx.lineWidth = Math.max(0.8, f.lineW * s * 0.45);
      ctx.fillRect(cxp - 3.2 * s, cyp - 1.6 * s, 6.4 * s, 4.2 * s);
      ctx.strokeRect(cxp - 3.2 * s, cyp - 1.6 * s, 6.4 * s, 4.2 * s);
      ctx.fillStyle = "#c9a227";
      ctx.fillRect(cxp - 3.2 * s, cyp - 2.1 * s, 6.4 * s, 0.8 * s);
      const bob = Math.sin(t * 2.5) * 0.6 * s;
      ctx.fillStyle = "#c9a227";
      ctx.font = `bold ${4.4 * s}px sans-serif`;
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("♪", cxp + 1.5 * s, cyp - 3 * s + bob);
      ctx.restore();
      break;
    }
    case "medals": { // three ribboned medal discs pinned across the chest
      const cols = [["#ffd700", "#b8860b"], ["#c0c0c0", "#8c8c8c"], ["#cd7f32", "#8c5a2b"]];
      for (let i = 0; i < 3; i++) {
        const mx = cxp + (i - 1) * 2.6 * s, my = cyp + (i % 2 === 0 ? 0.6 * s : -0.2 * s);
        ctx.strokeStyle = "#b71c1c";
        ctx.beginPath(); ctx.moveTo(mx, my - 2.6 * s); ctx.lineTo(mx, my - 1 * s); ctx.stroke();
        ctx.fillStyle = cols[i][0]; ctx.strokeStyle = cols[i][1];
        ctx.beginPath(); ctx.arc(mx, my, 1.3 * s, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      }
      break;
    }
  }
  // a glowing word or number stamped on the chest (e.g. "1", "1000", "999")
  if (f.emblemText) {
    ctx.save();
    ctx.fillStyle = f.glowText || "#ffd54f";
    ctx.shadowColor = f.glowText || "#ffd54f"; ctx.shadowBlur = 8;
    ctx.font = `800 ${5.4 * s}px sans-serif`;
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(f.emblemText, cxp, cyp);
    ctx.restore();
  }
}

// Things hovering above the head.
function drawOverhead(ctx, f, hxp, hyp, s, t) {
  const bobo = Math.sin(t * 2.2) * 1.2 * s;
  const y = hyp + bobo;
  switch (f.overhead) {
    case "cloud":
      ctx.fillStyle = "#78909c";
      ctx.beginPath();
      cloudPath(ctx, hxp, y - 1 * s, 3.4 * s);
      ctx.fill();
      ctx.strokeStyle = "#4fc3f7";
      ctx.beginPath();
      for (let i = -1; i <= 1; i++) {
        ctx.moveTo(hxp + i * 2.5 * s, y + 2.5 * s);
        ctx.lineTo(hxp + i * 2.5 * s - 1 * s, y + 5 * s);
      }
      ctx.stroke();
      break;
    case "ufo":
      ctx.fillStyle = "#90a4ae";
      ctx.beginPath(); ctx.ellipse(hxp, y, 5.5 * s, 1.8 * s, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#b3e5fc";
      ctx.beginPath(); ctx.arc(hxp, y - 1.4 * s, 2.2 * s, Math.PI, 0); ctx.fill();
      break;
    case "bulb":
      ctx.save(); ctx.shadowColor = "#fff176"; ctx.shadowBlur = 8;
      ctx.fillStyle = "#fff176";
      ctx.beginPath(); ctx.arc(hxp, y, 2.6 * s, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
      ctx.fillStyle = "#90a4ae";
      ctx.fillRect(hxp - 1 * s, y + 2.2 * s, 2 * s, 1.4 * s);
      break;
    case "orb":
      ctx.save(); ctx.shadowColor = "#ce93d8"; ctx.shadowBlur = 8;
      ctx.fillStyle = "#ba68c8cc";
      ctx.beginPath(); ctx.arc(hxp + 7 * s, y + 6 * s, 3 * s, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
      break;
    case "crows": // a murder of crows wheeling overhead
      ctx.save();
      ctx.strokeStyle = "#212121";
      ctx.fillStyle = "#212121";
      ctx.lineCap = "round";
      for (let i = 0; i < 3; i++) {
        const a = t * (0.7 + i * 0.14) + i * 2.1;
        const cxp = hxp + Math.cos(a) * (8 + i * 3) * s;
        const cyp = y - (5 + i * 2.4) * s - Math.sin(a * 1.3) * 2 * s;
        const flap = Math.abs(Math.sin(t * 7 + i * 1.7)) * 2 * s;
        ctx.lineWidth = Math.max(1, 0.9 * s);
        ctx.beginPath();
        ctx.moveTo(cxp - 2.8 * s, cyp - flap);
        ctx.quadraticCurveTo(cxp - 1.2 * s, cyp + 0.7 * s, cxp, cyp);
        ctx.quadraticCurveTo(cxp + 1.2 * s, cyp + 0.7 * s, cxp + 2.8 * s, cyp - flap);
        ctx.stroke();
        ctx.beginPath(); ctx.arc(cxp, cyp + 0.2 * s, 0.7 * s, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
      break;
    case "cursor": { // a mouse pointer hovering — "the player"
      const px = hxp + 4 * s, py = y + 1 * s;
      ctx.save();
      ctx.fillStyle = "#fff"; ctx.strokeStyle = "#111";
      ctx.lineWidth = Math.max(1, 0.8 * s);
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px, py + 6 * s);
      ctx.lineTo(px + 1.7 * s, py + 4.4 * s);
      ctx.lineTo(px + 2.9 * s, py + 6.9 * s);
      ctx.lineTo(px + 4 * s, py + 6.4 * s);
      ctx.lineTo(px + 2.8 * s, py + 3.9 * s);
      ctx.lineTo(px + 5 * s, py + 3.7 * s);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.restore();
      break;
    }
    case "heart": { // a warm heart floating above — "the friend"
      const beat = 1.5 + Math.sin(t * 4) * 0.14;
      ctx.save();
      ctx.translate(hxp, y); ctx.scale(beat, beat);
      ctx.fillStyle = "#ec407a"; ctx.shadowColor = "#f48fb1"; ctx.shadowBlur = 7;
      ctx.beginPath();
      ctx.moveTo(0, 2.6 * s);
      ctx.bezierCurveTo(-3.4 * s, -0.4 * s, -1.8 * s, -3.2 * s, 0, -1.1 * s);
      ctx.bezierCurveTo(1.8 * s, -3.2 * s, 3.4 * s, -0.4 * s, 0, 2.6 * s);
      ctx.closePath(); ctx.fill();
      ctx.restore();
      break;
    }
    case "spaceship": { // two sleek ships drifting overhead, thrusters flickering
      const drawShip = (sx, sy, ang, sc) => {
        ctx.save();
        ctx.translate(sx, sy); ctx.rotate(ang);
        ctx.fillStyle = "#cfd8dc"; ctx.strokeStyle = "#455a64";
        ctx.lineWidth = Math.max(0.7, s * 0.35 * sc);
        ctx.beginPath(); // hull
        ctx.moveTo(3.2 * s * sc, 0);
        ctx.quadraticCurveTo(1 * s * sc, -1.6 * s * sc, -2.6 * s * sc, -1 * s * sc);
        ctx.lineTo(-3.4 * s * sc, 0);
        ctx.lineTo(-2.6 * s * sc, 1 * s * sc);
        ctx.quadraticCurveTo(1 * s * sc, 1.6 * s * sc, 3.2 * s * sc, 0);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.beginPath(); // tail fin
        ctx.moveTo(-1.6 * s * sc, -0.9 * s * sc);
        ctx.lineTo(-2.6 * s * sc, -2.4 * s * sc);
        ctx.lineTo(-0.6 * s * sc, -0.9 * s * sc);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = "#4fc3f7"; // cockpit window
        ctx.beginPath(); ctx.arc(0.8 * s * sc, 0, 0.7 * s * sc, 0, Math.PI * 2); ctx.fill();
        const fl = 1 + Math.sin(t * 10 + sx) * 0.3; // flickering thruster flame
        ctx.fillStyle = "#ff7043";
        ctx.beginPath();
        ctx.moveTo(-3.4 * s * sc, -0.5 * s * sc);
        ctx.lineTo(-5 * s * sc * fl, 0);
        ctx.lineTo(-3.4 * s * sc, 0.5 * s * sc);
        ctx.closePath(); ctx.fill();
        ctx.restore();
      };
      drawShip(hxp - 5 * s, y - 1 * s, -0.15 + Math.sin(t * 1.4) * 0.1, 1.0);
      drawShip(hxp + 5.5 * s, y + 2 * s, 0.2 + Math.sin(t * 1.1 + 2) * 0.1, 0.78);
      break;
    }
    case "controlbar": { // a puppeteer's wooden cross-bar, gently tilting
      const tilt = Math.sin(t * 1.6) * 0.12;
      ctx.save();
      ctx.translate(hxp, y - 2 * s); ctx.rotate(tilt);
      ctx.strokeStyle = "#6d4c41";
      ctx.lineWidth = Math.max(1.1, s * 0.6);
      ctx.beginPath();
      ctx.moveTo(-4.5 * s, 0); ctx.lineTo(4.5 * s, 0);
      ctx.moveTo(0, -1.6 * s); ctx.lineTo(0, 1.6 * s);
      ctx.stroke();
      ctx.restore();
      break;
    }
    case "antenna": { // a tall thin antenna trailing floating message glyphs
      ctx.strokeStyle = "#455a64";
      ctx.lineWidth = Math.max(1, 0.6 * s);
      ctx.beginPath(); ctx.moveTo(hxp, hyp + 1 * s); ctx.lineTo(hxp, hyp - 6 * s); ctx.stroke();
      ctx.beginPath(); ctx.arc(hxp, hyp - 6.6 * s, 0.6 * s, 0, Math.PI * 2); ctx.fill();
      const glyphs = ["♪", "!", "?", "#"];
      ctx.fillStyle = "#26a69a";
      ctx.font = `bold ${3.2 * s}px sans-serif`;
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      for (let i = 0; i < 3; i++) {
        const a = t * 1.4 + i * 2.1;
        const gx = hxp + Math.cos(a) * 5 * s, gy = hyp - 7 * s + Math.sin(a) * 2.4 * s;
        ctx.fillText(glyphs[(i + Math.floor(t)) % glyphs.length], gx, gy);
      }
      break;
    }
    case "thoughtbubble": { // a rising chain of bubbles leading to an idea
      ctx.save();
      ctx.fillStyle = "#fff"; ctx.strokeStyle = "#78909c";
      ctx.lineWidth = Math.max(0.6, 0.4 * s);
      for (const [ox2, oy2, rr] of [[1.4, 2.2, 0.7], [2.4, 0.6, 1.1]]) {
        ctx.beginPath(); ctx.arc(hxp + ox2 * s, y - oy2 * s, rr * s, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      }
      ctx.beginPath(); ctx.ellipse(hxp + 3.4 * s, y - 3.6 * s, 3.4 * s, 2.4 * s, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.restore();
      break;
    }
    case "flame": { // small candle flame flickering above the head
      const flick = 1 + Math.sin(t * 10) * 0.18;
      ctx.save();
      ctx.shadowColor = "#ff9800"; ctx.shadowBlur = 6;
      ctx.fillStyle = "#ffca28";
      ctx.beginPath();
      ctx.moveTo(hxp - 1 * s, y);
      ctx.quadraticCurveTo(hxp - 1.3 * s, y - 2.4 * s * flick, hxp, y - 3.6 * s * flick);
      ctx.quadraticCurveTo(hxp + 1.3 * s, y - 2.4 * s * flick, hxp + 1 * s, y);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#ff7043";
      ctx.beginPath(); ctx.ellipse(hxp, y - 0.6 * s, 0.6 * s, 1 * s * flick, 0, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
      break;
    }
  }
}

// ------------------------------------------------------------------
// Vehicles — pure black-outline machines drawn in place of body parts.
// ------------------------------------------------------------------

// Car (#436): the whole figure is replaced by this outline — no human parts.
function drawCarOutline(ctx, s, t) {
  ctx.save();
  ctx.strokeStyle = "#111111";
  ctx.fillStyle = "#ffffff";
  ctx.lineWidth = Math.max(1.3, 1.5 * s);
  ctx.lineJoin = "round"; ctx.lineCap = "round";
  const wheelR = 5 * s, wheelY = -wheelR;
  const bodyBot = wheelY - 0.9 * s, bodyTop = bodyBot - 9 * s;
  const rr = 2.2 * s;
  ctx.beginPath(); // main body, rounded rectangle
  ctx.moveTo(-15 * s + rr, bodyTop);
  ctx.lineTo(15 * s - rr, bodyTop);
  ctx.quadraticCurveTo(15 * s, bodyTop, 15 * s, bodyTop + rr);
  ctx.lineTo(15 * s, bodyBot - rr);
  ctx.quadraticCurveTo(15 * s, bodyBot, 15 * s - rr, bodyBot);
  ctx.lineTo(-15 * s + rr, bodyBot);
  ctx.quadraticCurveTo(-15 * s, bodyBot, -15 * s, bodyBot - rr);
  ctx.lineTo(-15 * s, bodyTop + rr);
  ctx.quadraticCurveTo(-15 * s, bodyTop, -15 * s + rr, bodyTop);
  ctx.closePath();
  ctx.fill(); ctx.stroke();
  ctx.beginPath(); // cabin roof
  ctx.moveTo(-8 * s, bodyTop);
  ctx.quadraticCurveTo(-8.4 * s, bodyTop - 6.5 * s, -3 * s, bodyTop - 7.5 * s);
  ctx.lineTo(5 * s, bodyTop - 7.5 * s);
  ctx.quadraticCurveTo(9.4 * s, bodyTop - 6.5 * s, 9 * s, bodyTop);
  ctx.closePath();
  ctx.fill(); ctx.stroke();
  ctx.beginPath(); // windshield divider
  ctx.moveTo(-1 * s, bodyTop - 7.1 * s); ctx.lineTo(-1 * s, bodyTop);
  ctx.stroke();
  for (const wx of [-9 * s, 9 * s]) { // wheels
    ctx.beginPath(); ctx.arc(wx, wheelY, wheelR, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(wx, wheelY, wheelR * 0.36, 0, Math.PI * 2); ctx.stroke();
  }
  ctx.beginPath(); // headlight
  ctx.arc(14 * s, (bodyTop + bodyBot) / 2, 0.9 * s, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); // door line
  ctx.moveTo(1 * s, bodyTop); ctx.lineTo(1 * s, bodyBot); ctx.stroke();
  ctx.restore();
}

// Train (#435): a small outline of a locomotive front — no human parts.
function drawTrainOutline(ctx, s, t) {
  ctx.save();
  ctx.strokeStyle = "#111111";
  ctx.fillStyle = "#ffffff";
  ctx.lineWidth = Math.max(1.3, 1.5 * s);
  ctx.lineJoin = "round"; ctx.lineCap = "round";
  const wheelR = 4 * s, wheelY = -wheelR;
  const frameBot = wheelY - 1 * s, boilerTop = frameBot - 11 * s;
  ctx.beginPath(); // boiler barrel
  ctx.moveTo(-14 * s, frameBot);
  ctx.lineTo(-14 * s, boilerTop + 2 * s);
  ctx.quadraticCurveTo(-14 * s, boilerTop, -12 * s, boilerTop);
  ctx.lineTo(8 * s, boilerTop);
  ctx.quadraticCurveTo(10 * s, boilerTop, 10 * s, boilerTop + 2 * s);
  ctx.lineTo(10 * s, frameBot);
  ctx.closePath();
  ctx.fill(); ctx.stroke();
  ctx.beginPath(); // cab at the back
  ctx.moveTo(-14 * s, boilerTop + 2 * s);
  ctx.lineTo(-14 * s, boilerTop - 6.4 * s);
  ctx.lineTo(-6 * s, boilerTop - 6.4 * s);
  ctx.lineTo(-6 * s, boilerTop);
  ctx.closePath();
  ctx.fill(); ctx.stroke();
  ctx.strokeRect(-12.4 * s, boilerTop - 4.8 * s, 3.8 * s, 2.8 * s); // cab window
  ctx.beginPath(); // cowcatcher at the front
  ctx.moveTo(10 * s, frameBot);
  ctx.lineTo(14.5 * s, frameBot - wheelR * 0.4);
  ctx.lineTo(14.5 * s, frameBot);
  ctx.closePath();
  ctx.fill(); ctx.stroke();
  ctx.fillRect(-2.6 * s, boilerTop - 5 * s, 2.2 * s, 5 * s); // smokestack
  ctx.strokeRect(-2.6 * s, boilerTop - 5 * s, 2.2 * s, 5 * s);
  ctx.beginPath();
  ctx.ellipse(-1.5 * s, boilerTop - 5 * s, 1.6 * s, 0.6 * s, 0, 0, Math.PI * 2);
  ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.arc(6.5 * s, boilerTop + 1 * s, 1 * s, 0, Math.PI * 2); ctx.stroke(); // headlamp
  const wheelXs = [-9 * s, -1 * s, 6 * s];
  for (const wx of wheelXs) {
    ctx.beginPath(); ctx.arc(wx, wheelY, wheelR, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(wx, wheelY, wheelR * 0.3, 0, Math.PI * 2); ctx.stroke();
  }
  ctx.beginPath(); // connecting rod
  ctx.moveTo(wheelXs[0], wheelY); ctx.lineTo(wheelXs[2], wheelY);
  ctx.stroke();
  ctx.restore();
}

// Motorcycle (#437): drawn behind the rider, feet on pegs and hands on the grips.
function drawMotorcycleOutline(ctx, s, t) {
  ctx.save();
  ctx.strokeStyle = "#111111";
  ctx.lineWidth = Math.max(1.1, 1.25 * s);
  ctx.lineJoin = "round"; ctx.lineCap = "round";
  const rW = 5 * s, rx = -7 * s, fx = 9 * s, spin = t * 10;
  for (const wx of [rx, fx]) { // wheels with spokes
    ctx.beginPath(); ctx.arc(wx, 0, rW, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(wx, 0, rW * 0.26, 0, Math.PI * 2); ctx.stroke();
    ctx.save();
    ctx.translate(wx, 0); ctx.rotate(spin);
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const a = (i * Math.PI * 2) / 5;
      ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * rW * 0.85, Math.sin(a) * rW * 0.85);
    }
    ctx.stroke();
    ctx.restore();
  }
  ctx.beginPath(); // upper frame: rear axle -> seat post -> tank hump -> steering head -> front axle
  ctx.moveTo(rx, -rW * 0.3);
  ctx.lineTo(-3 * s, -11 * s);
  ctx.quadraticCurveTo(1 * s, -13.5 * s, 4 * s, -12.5 * s);
  ctx.lineTo(7.5 * s, -9 * s);
  ctx.lineTo(fx, -rW * 0.2);
  ctx.stroke();
  ctx.beginPath(); // lower frame rail: rear axle -> engine -> steering head
  ctx.moveTo(rx, -rW * 0.2);
  ctx.lineTo(-2 * s, -4 * s);
  ctx.lineTo(4 * s, -4 * s);
  ctx.lineTo(7.5 * s, -9 * s);
  ctx.stroke();
  ctx.strokeRect(-2.6 * s, -7.5 * s, 5.6 * s, 3.6 * s); // engine block
  ctx.beginPath(); // seat
  ctx.moveTo(-6 * s, -11 * s); ctx.quadraticCurveTo(-3 * s, -12.6 * s, 0.5 * s, -11.6 * s);
  ctx.stroke();
  ctx.beginPath(); // fork + handlebar
  ctx.moveTo(7.5 * s, -9 * s); ctx.lineTo(8.6 * s, -14.6 * s);
  ctx.moveTo(8.6 * s, -14.6 * s); ctx.lineTo(6.4 * s, -15.4 * s);
  ctx.moveTo(8.6 * s, -14.6 * s); ctx.lineTo(11 * s, -14.2 * s);
  ctx.stroke();
  ctx.beginPath(); ctx.arc(10.6 * s, -13.6 * s, 1.2 * s, 0, Math.PI * 2); ctx.stroke(); // headlight
  ctx.beginPath(); // exhaust pipe
  ctx.moveTo(-1 * s, -3.8 * s); ctx.quadraticCurveTo(-9 * s, -2 * s, -11 * s, -1 * s);
  ctx.stroke();
  ctx.beginPath(); ctx.ellipse(-11.6 * s, -1 * s, 1 * s, 0.6 * s, 0, 0, Math.PI * 2); ctx.stroke();
  ctx.restore();
}

// Bridge (#433): stands in for the whole torso+head; legs and arms poke out normally.
function drawBridgeBody(ctx, hipY, topY, s, t) {
  const bottom = hipY + 0.5 * s, top = topY - 1 * s;
  const h = bottom - top;
  const deckY = top + h * 0.3, deckH = Math.max(1.3 * s, h * 0.1);
  const spanL = -5.6 * s, spanR = 5.6 * s, pierW = 1.7 * s;
  ctx.save();
  ctx.fillStyle = "#ffffff"; ctx.strokeStyle = "#111111";
  ctx.lineWidth = Math.max(1.3, 1.4 * s);
  ctx.lineJoin = "round";
  for (const px of [spanL + pierW / 2, spanR - pierW / 2]) { // piers from deck down to the hips
    ctx.beginPath(); ctx.rect(px - pierW / 2, deckY + deckH, pierW, bottom - (deckY + deckH)); ctx.fill(); ctx.stroke();
  }
  ctx.beginPath(); ctx.rect(spanL, deckY, spanR - spanL, deckH); ctx.fill(); ctx.stroke(); // deck
  ctx.beginPath(); // arch opening between the piers
  ctx.moveTo(spanL + pierW + 0.6 * s, deckY + deckH);
  ctx.quadraticCurveTo(0, bottom - 0.4 * s, spanR - pierW - 0.6 * s, deckY + deckH);
  ctx.stroke();
  ctx.beginPath(); // railing posts + top rail, up towards the head
  for (let x = spanL + 1.2 * s; x <= spanR - 1.2 * s; x += 2.6 * s) {
    ctx.moveTo(x, deckY); ctx.lineTo(x, top);
  }
  ctx.moveTo(spanL, top); ctx.lineTo(spanR, top);
  ctx.stroke();
  ctx.restore();
}

// Rocket (#438): stands in for the whole torso+head; legs and arms poke out normally.
function drawRocketBody(ctx, hipY, topY, s, t) {
  const bottom = hipY + 0.5 * s, top = topY - 1 * s;
  const h = bottom - top, w = 4.2 * s;
  ctx.save();
  ctx.fillStyle = "#ffffff"; ctx.strokeStyle = "#111111";
  ctx.lineWidth = Math.max(1.3, 1.4 * s);
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(0, top);
  ctx.quadraticCurveTo(w * 0.85, top + h * 0.22, w, top + h * 0.36);
  ctx.lineTo(w, bottom - h * 0.22);
  ctx.lineTo(w + 3 * s, bottom);
  ctx.lineTo(w * 0.45, bottom - h * 0.12);
  ctx.lineTo(w * 0.45, bottom);
  ctx.lineTo(-w * 0.45, bottom);
  ctx.lineTo(-w * 0.45, bottom - h * 0.12);
  ctx.lineTo(-(w + 3 * s), bottom);
  ctx.lineTo(-w, bottom - h * 0.22);
  ctx.lineTo(-w, top + h * 0.36);
  ctx.quadraticCurveTo(-w * 0.85, top + h * 0.22, 0, top);
  ctx.closePath();
  ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.arc(0, top + h * 0.46, w * 0.42, 0, Math.PI * 2); ctx.stroke(); // window
  ctx.beginPath(); ctx.moveTo(-w, bottom - h * 0.22); ctx.lineTo(w, bottom - h * 0.22); ctx.stroke(); // base ring
  ctx.restore();
}

// Tower (#432): a tall stone tower stands in for the whole torso+head.
function drawTowerBody(ctx, hipY, s, t) {
  const bottom = hipY + 0.5 * s, height = 46 * s, top = bottom - height;
  const wBot = 4.6 * s, wTop = 3.6 * s;
  ctx.save();
  ctx.fillStyle = "#ffffff"; ctx.strokeStyle = "#111111";
  ctx.lineWidth = Math.max(1.3, 1.4 * s);
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(-wBot, bottom);
  ctx.lineTo(-wTop, top + 6 * s);
  ctx.lineTo(-wTop, top);
  ctx.lineTo(wTop, top);
  ctx.lineTo(wTop, top + 6 * s);
  ctx.lineTo(wBot, bottom);
  ctx.closePath();
  ctx.fill(); ctx.stroke();
  const merW = (wTop * 2) / 5; // crenellations along the top
  for (let i = 0; i < 5; i += 2) {
    const mx = -wTop + i * merW;
    ctx.fillRect(mx, top - 2.2 * s, merW, 2.2 * s);
    ctx.strokeRect(mx, top - 2.2 * s, merW, 2.2 * s);
  }
  ctx.save(); // faint brick coursing lines
  ctx.globalAlpha *= 0.5;
  ctx.lineWidth = Math.max(0.6, 0.6 * s);
  ctx.beginPath();
  for (let i = 1; i < 7; i++) {
    const fr = i / 7, yy = bottom + (top - bottom) * fr, ww = wBot + (wTop - wBot) * fr;
    ctx.moveTo(-ww, yy); ctx.lineTo(ww, yy);
  }
  ctx.stroke();
  ctx.restore();
  ctx.fillStyle = "#37474f"; // window slits
  for (const wy of [top + height * 0.28, top + height * 0.58]) {
    ctx.beginPath(); ctx.rect(-0.7 * s, wy - 2 * s, 1.4 * s, 4 * s); ctx.fill(); ctx.stroke();
  }
  ctx.restore();
}

// Computer (#354): a monitor-on-tower body; arms and legs poke out normally.
function drawComputerBody(ctx, hipY, topY, s, t) {
  const bottom = hipY + 0.5 * s, top = topY - 1 * s;
  const h = bottom - top, w = 5.2 * s;
  ctx.save();
  ctx.fillStyle = "#ffffff"; ctx.strokeStyle = "#111111";
  ctx.lineWidth = Math.max(1.3, 1.4 * s);
  ctx.lineJoin = "round";
  const scrY = top + h * 0.08, scrH = h * 0.42;
  ctx.beginPath(); ctx.rect(-w, scrY, w * 2, scrH); ctx.fill(); ctx.stroke();
  ctx.fillStyle = "#263238";
  ctx.fillRect(-w * 0.8, scrY + h * 0.06, w * 1.6, scrH - h * 0.12);
  ctx.fillStyle = "#ffffff";
  ctx.beginPath(); ctx.rect(-1 * s, scrY + scrH, 2 * s, h * 0.12); ctx.fill(); ctx.stroke();
  const towY = scrY + scrH + h * 0.12;
  ctx.beginPath(); ctx.rect(-w * 0.55, towY, w * 1.1, bottom - towY); ctx.fill(); ctx.stroke();
  ctx.fillStyle = "#4fc3f7";
  ctx.beginPath(); ctx.arc(0, towY + (bottom - towY) * 0.5, 0.7 * s, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

// Treasure trunk (#368): a wooden chest overflowing with gold; arms and legs poke out normally.
function drawTrunkBody(ctx, hipY, topY, s, t) {
  const bottom = hipY + 0.5 * s, top = topY - 1 * s;
  const h = bottom - top, w = 5 * s;
  ctx.save();
  ctx.fillStyle = "#8d6e63"; ctx.strokeStyle = "#111111";
  ctx.lineWidth = Math.max(1.3, 1.4 * s);
  ctx.lineJoin = "round";
  const lidY = top + h * 0.35;
  ctx.beginPath(); ctx.rect(-w, lidY, w * 2, bottom - lidY); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.arc(0, lidY, w, Math.PI, 0); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = "#ffd700";
  for (const gx of [-2.4, -0.6, 1.2, 2.8]) {
    ctx.beginPath(); ctx.arc(gx * s, lidY - 0.5 * s, 1 * s, 0, Math.PI * 2); ctx.fill();
  }
  ctx.strokeStyle = "#5d4037";
  ctx.lineWidth = Math.max(1, 0.9 * s);
  ctx.beginPath(); ctx.moveTo(-w, lidY); ctx.lineTo(w, lidY); ctx.stroke();
  ctx.fillStyle = "#c9a227";
  ctx.fillRect(-0.6 * s, lidY + h * 0.15, 1.2 * s, 1.2 * s);
  ctx.restore();
}

// Toaster (#377): a chrome toaster body; arms and legs poke out normally.
function drawToasterBody(ctx, hipY, topY, s, t) {
  const bottom = hipY + 0.5 * s, top = topY - 1 * s;
  const h = bottom - top, w = 4.6 * s;
  ctx.save();
  ctx.fillStyle = "#eeeeee"; ctx.strokeStyle = "#111111";
  ctx.lineWidth = Math.max(1.3, 1.4 * s);
  ctx.lineJoin = "round";
  const rr = 1.6 * s;
  ctx.beginPath();
  ctx.moveTo(-w, bottom); ctx.lineTo(-w, top + rr);
  ctx.quadraticCurveTo(-w, top, -w + rr, top);
  ctx.lineTo(w - rr, top); ctx.quadraticCurveTo(w, top, w, top + rr);
  ctx.lineTo(w, bottom); ctx.closePath();
  ctx.fill(); ctx.stroke();
  ctx.fillStyle = "#212121";
  ctx.fillRect(-w * 0.55, top + h * 0.12, w * 0.3, h * 0.28);
  ctx.fillRect(w * 0.25, top + h * 0.12, w * 0.3, h * 0.28);
  ctx.restore();
}

// Paper (#178): a flat sheet of paper with a pencil stickman doodle drawn
// on it; arms and legs poke out normally.
function drawPaperBody(ctx, hipY, topY, s, t) {
  const bottom = hipY + 0.5 * s, top = topY - 1 * s;
  const h = bottom - top, w = 4 * s;
  ctx.save();
  ctx.fillStyle = "#faf6ea"; ctx.strokeStyle = "#bdb49a";
  ctx.lineWidth = Math.max(1, 1 * s);
  ctx.lineJoin = "round";
  const curl = 1.1 * s;
  ctx.beginPath();
  ctx.moveTo(-w, top);
  ctx.lineTo(w, top);
  ctx.lineTo(w, bottom - curl);
  ctx.lineTo(w - curl, bottom);
  ctx.lineTo(-w, bottom);
  ctx.closePath();
  ctx.fill(); ctx.stroke();
  ctx.fillStyle = "#e4dcc4";
  ctx.beginPath();
  ctx.moveTo(w, bottom - curl); ctx.lineTo(w - curl, bottom); ctx.lineTo(w, bottom); ctx.closePath();
  ctx.fill();
  // pencil stickman doodle
  ctx.strokeStyle = "#616161";
  ctx.lineWidth = Math.max(0.8, 0.6 * s);
  const dcx = 0, dcy = top + h * 0.42, dr = h * 0.14;
  ctx.beginPath(); ctx.arc(dcx, dcy - dr, dr * 0.8, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(dcx, dcy - dr * 0.2); ctx.lineTo(dcx, dcy + dr * 1.6);
  ctx.moveTo(dcx - dr, dcy + dr * 0.3); ctx.lineTo(dcx + dr, dcy + dr * 0.3);
  ctx.moveTo(dcx, dcy + dr * 1.6); ctx.lineTo(dcx - dr * 0.8, dcy + dr * 2.6);
  ctx.moveTo(dcx, dcy + dr * 1.6); ctx.lineTo(dcx + dr * 0.8, dcy + dr * 2.6);
  ctx.stroke();
  ctx.restore();
}

// Tree Guardian (#213): a bark-trunk body with leafy branch tufts; f.armor
// draws real plate armor over it generically (see the armor block below).
function drawTreeGuardianBody(ctx, hipY, topY, s, t) {
  const bottom = hipY + 0.5 * s, top = topY - 1 * s;
  const h = bottom - top, w = 3.6 * s;
  ctx.save();
  ctx.fillStyle = "#6d4c26"; ctx.strokeStyle = "#3e2b16";
  ctx.lineWidth = Math.max(1.3, 1.4 * s);
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(-w, bottom); ctx.lineTo(-w * 0.85, top);
  ctx.lineTo(w * 0.85, top); ctx.lineTo(w, bottom);
  ctx.closePath();
  ctx.fill(); ctx.stroke();
  ctx.strokeStyle = "#4e3319";
  ctx.lineWidth = Math.max(0.8, 0.6 * s);
  ctx.beginPath();
  for (const fx of [-0.4, 0.1, 0.5]) {
    ctx.moveTo(fx * w, top + h * 0.1);
    ctx.quadraticCurveTo(fx * w * 1.2, top + h * 0.5, fx * w * 0.8, bottom - h * 0.05);
  }
  ctx.stroke();
  ctx.save();
  ctx.shadowColor = "#8bc34a"; ctx.shadowBlur = 4 * s;
  ctx.fillStyle = "#558b2f";
  for (const [lx, ly, lr] of [[-w * 1.1, top + h * 0.05, 1.4 * s], [w * 1.0, top - h * 0.02, 1.2 * s], [0, top - h * 0.18, 1.5 * s]]) {
    ctx.beginPath(); ctx.arc(lx, ly, lr, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
  ctx.restore();
}

// Fridge (#378): a tall white fridge body; arms and legs poke out normally.
function drawFridgeBody(ctx, hipY, topY, s, t) {
  const bottom = hipY + 0.5 * s, top = topY - 1 * s;
  const h = bottom - top, w = 4.4 * s;
  ctx.save();
  ctx.fillStyle = "#ffffff"; ctx.strokeStyle = "#111111";
  ctx.lineWidth = Math.max(1.3, 1.4 * s);
  ctx.lineJoin = "round";
  ctx.beginPath(); ctx.rect(-w, top, w * 2, h); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-w, top + h * 0.32); ctx.lineTo(w, top + h * 0.32); ctx.stroke();
  ctx.fillStyle = "#cfd8dc";
  ctx.fillRect(w * 0.55, top + h * 0.06, w * 0.2, h * 0.2);
  ctx.fillRect(w * 0.55, top + h * 0.42, w * 0.2, h * 0.4);
  ctx.restore();
}

// Lucky Block: a black-and-white "?" block; arms and legs poke out normally.
function drawLuckyBlockBody(ctx, hipY, topY, s, t) {
  const bottom = hipY + 0.5 * s, top = topY - 1 * s;
  const h = bottom - top, w = h * 0.5; // roughly square (total width w*2 ~= h)
  ctx.save();
  ctx.fillStyle = "#111111"; ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = Math.max(1.6, 1.8 * s);
  ctx.lineJoin = "round";
  ctx.beginPath(); ctx.rect(-w, top, w * 2, h); ctx.fill(); ctx.stroke();
  ctx.fillStyle = "#ffffff";
  ctx.font = `bold ${Math.max(6, Math.round(h * 0.75))}px sans-serif`;
  ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.fillText("?", 0, top + h * 0.54);
  ctx.restore();
}

// Oven (#379): a black oven body with a glowing window; arms and legs poke out normally.
function drawOvenBody(ctx, hipY, topY, s, t) {
  const bottom = hipY + 0.5 * s, top = topY - 1 * s;
  const h = bottom - top, w = 4.6 * s;
  ctx.save();
  ctx.fillStyle = "#424242"; ctx.strokeStyle = "#111111";
  ctx.lineWidth = Math.max(1.3, 1.4 * s);
  ctx.lineJoin = "round";
  ctx.beginPath(); ctx.rect(-w, top, w * 2, h); ctx.fill(); ctx.stroke();
  ctx.save();
  ctx.shadowColor = "#ff7043"; ctx.shadowBlur = 6;
  ctx.fillStyle = "#ff7043aa";
  ctx.fillRect(-w * 0.65, top + h * 0.28, w * 1.3, h * 0.45);
  ctx.restore();
  ctx.strokeRect(-w * 0.65, top + h * 0.28, w * 1.3, h * 0.45);
  ctx.fillStyle = "#bdbdbd";
  ctx.beginPath(); ctx.arc(w * 0.55, top + h * 0.14, 0.6 * s, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

// Vacuum (#380): an upright vacuum body; arms and legs poke out normally.
function drawVacuumBody(ctx, hipY, topY, s, t) {
  const bottom = hipY + 0.5 * s, top = topY - 1 * s;
  const h = bottom - top, w = 3.2 * s;
  ctx.save();
  ctx.fillStyle = "#e57373"; ctx.strokeStyle = "#111111";
  ctx.lineWidth = Math.max(1.3, 1.4 * s);
  ctx.lineJoin = "round";
  ctx.beginPath(); ctx.rect(-w, top, w * 2, h * 0.62); ctx.fill(); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-w * 0.3, top + h * 0.62); ctx.lineTo(-w * 0.7, bottom); ctx.lineTo(w * 0.7, bottom); ctx.lineTo(w * 0.3, top + h * 0.62);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = "#bdbdbd";
  ctx.beginPath(); ctx.moveTo(0, top); ctx.quadraticCurveTo(w * 1.6, top - 3 * s, w * 1.8, top + 3 * s); ctx.stroke();
  ctx.restore();
}

// Chair (#373): a plain wooden chair walking on its own four legs — no human parts.
function drawChairOutline(ctx, s, t) {
  ctx.save();
  ctx.strokeStyle = "#5d4037"; ctx.fillStyle = "#8d6e63";
  ctx.lineWidth = Math.max(1.3, 1.5 * s);
  ctx.lineCap = "round";
  const seatY = -10 * s, seatW = 7 * s;
  for (const lx of [-seatW * 0.8, seatW * 0.8]) {
    ctx.beginPath(); ctx.moveTo(lx, 0); ctx.lineTo(lx, seatY); ctx.stroke();
  }
  ctx.beginPath(); ctx.rect(-seatW, seatY - 1.4 * s, seatW * 2, 1.4 * s); ctx.fill(); ctx.stroke();
  ctx.beginPath(); // backrest slats
  ctx.rect(-seatW * 0.85, seatY - 10 * s, seatW * 1.7, 1.2 * s);
  ctx.rect(-seatW * 0.85, seatY - 6 * s, seatW * 1.7, 1.2 * s);
  ctx.fill(); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-seatW * 0.8, seatY - 10 * s); ctx.lineTo(-seatW * 0.8, seatY);
  ctx.moveTo(seatW * 0.8, seatY - 10 * s); ctx.lineTo(seatW * 0.8, seatY);
  ctx.stroke();
  ctx.restore();
}

// Table (#374): a flat tabletop gliding on four long legs — no human parts.
function drawTableOutline(ctx, s, t) {
  ctx.save();
  ctx.strokeStyle = "#4e342e"; ctx.fillStyle = "#6d4c41";
  ctx.lineWidth = Math.max(1.3, 1.5 * s);
  ctx.lineCap = "round";
  const topY = -12 * s, topW = 13 * s;
  for (const lx of [-topW * 0.75, topW * 0.75]) {
    ctx.beginPath(); ctx.moveTo(lx, 0); ctx.lineTo(lx, topY + 1.4 * s); ctx.stroke();
  }
  ctx.beginPath(); ctx.rect(-topW, topY, topW * 2, 1.8 * s); ctx.fill(); ctx.stroke();
  ctx.restore();
}

// Sofa (#375): a cushioned couch shuffling along on stubby feet — no human parts.
function drawSofaOutline(ctx, s, t) {
  ctx.save();
  ctx.strokeStyle = "#37474f"; ctx.fillStyle = "#78909c";
  ctx.lineWidth = Math.max(1.3, 1.5 * s);
  ctx.lineJoin = "round";
  const seatY = -6 * s, w = 15 * s;
  ctx.beginPath(); ctx.rect(-w, seatY, w * 2, 6 * s); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.rect(-w, seatY - 6 * s, w * 2, 4 * s); ctx.fill(); ctx.stroke(); // backrest
  ctx.beginPath(); // armrests
  ctx.rect(-w - 1.4 * s, seatY - 4 * s, 2.4 * s, 10 * s);
  ctx.rect(w - 1 * s, seatY - 4 * s, 2.4 * s, 10 * s);
  ctx.fill(); ctx.stroke();
  ctx.strokeStyle = "#455a64";
  for (const lx of [-w * 0.7, -w * 0.2, w * 0.2, w * 0.7]) {
    ctx.beginPath(); ctx.moveTo(lx, seatY); ctx.lineTo(lx, seatY + 6 * s); ctx.stroke();
  }
  for (const fx of [-w * 0.85, w * 0.85]) {
    ctx.beginPath(); ctx.moveTo(fx, seatY + 6 * s); ctx.lineTo(fx, 0); ctx.stroke();
  }
  ctx.restore();
}

// Robot Vacuum (#381): a low disc gliding randomly — no human parts.
function drawRoombaOutline(ctx, s, t) {
  ctx.save();
  ctx.fillStyle = "#78909c"; ctx.strokeStyle = "#111111";
  ctx.lineWidth = Math.max(1.3, 1.4 * s);
  const w = 8 * s, hgt = 3.4 * s, cy = -hgt * 0.5;
  ctx.beginPath(); ctx.ellipse(0, cy, w, hgt, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = "#455a64";
  ctx.beginPath(); ctx.arc(0, cy, w * 0.32, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = "#37474f";
  ctx.beginPath(); ctx.arc(-w * 0.5, cy, 0.9 * s, 0, Math.PI * 2); ctx.arc(w * 0.5, cy, 0.9 * s, 0, Math.PI * 2); ctx.stroke();
  ctx.restore();
}

// Centaur (#121): a full horse body — rounded barrel, four trotting legs
// with hooves, and a swishing tail — stands in for the human legs; the
// human torso/arms/head still ride on top of it. Kept pure black-and-white
// (ignoring any type color) so it reads as a continuation of the stick
// figure's line art rather than a separate colored creature.
function drawCentaurBody(ctx, hipY, s, t, ph, stride, lift) {
  ctx.save();
  ctx.strokeStyle = "#000000";
  ctx.fillStyle = "#ffffff";
  ctx.lineWidth = Math.max(1.4, 1.6 * s);
  ctx.lineJoin = "round"; ctx.lineCap = "round";

  // barrel spans from the chest (attached under the human waist) back to
  // the rump; it hangs mostly below hipY so the human torso still reads as
  // rising up out of the horse's withers, not out of thin air above it.
  const cx = -7 * s, cy = hipY + 5.5 * s;
  const rx = 9.5 * s, ry = 6 * s;
  const rump = cx - rx, chest = cx + rx, belly = cy + ry;

  // ---- barrel ----
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill(); ctx.stroke();

  // ---- four legs, diagonal trot (front pair near the chest, back pair near the rump) ----
  const legHipXs = [chest - 2.5 * s, rump + 2.5 * s];
  for (let pair = 0; pair < 2; pair++) {
    const legX = legHipXs[pair];
    const legTopY = cy + ry * 0.75;
    for (let i = 0; i < 2; i++) {
      const p = ph + i * Math.PI + pair * Math.PI;
      const stepX = Math.sin(p) * stride * 0.45;
      const stepLift = Math.max(0, Math.cos(p)) * lift * 0.5;
      const fx = legX + stepX, fy = -stepLift;
      ctx.globalAlpha = i ? 1 : 0.62; // far leg of the pair dimmed, like the human legs
      ctx.beginPath();
      ctx.moveTo(legX, legTopY);
      ctx.quadraticCurveTo(legX + stepX * 0.3, (legTopY + fy) / 2, fx, fy);
      ctx.stroke();
      ctx.beginPath(); // hoof
      ctx.moveTo(fx - 1.1 * s, fy);
      ctx.lineTo(fx + 1.1 * s, fy);
      ctx.stroke();
    }
  }
  ctx.globalAlpha = 1;

  // ---- long swishing tail off the rump, kept clear of the hind legs ----
  const tailX = rump - 0.5 * s, tailY = cy - ry * 0.15;
  const sway = Math.sin(t * 3) * 1.8 * s;
  ctx.beginPath();
  ctx.moveTo(tailX, tailY);
  ctx.quadraticCurveTo(tailX - 5.5 * s + sway, tailY + 6 * s, tailX - 4 * s + sway, tailY + 13 * s);
  ctx.quadraticCurveTo(tailX - 3 * s + sway, tailY + 7 * s, tailX - 1 * s + sway, tailY + 3 * s);
  ctx.quadraticCurveTo(tailX + 1.3 * s, tailY + 5 * s, tailX + 1.4 * s, tailY);
  ctx.closePath();
  ctx.fill(); ctx.stroke();

  // ---- mane, swept back along the top of the neck/withers ----
  ctx.lineWidth = Math.max(1.1, 1.2 * s);
  for (let i = 0; i < 3; i++) {
    const mx = chest - (2.5 + i * 2.2) * s;
    const my = cy - ry * (0.95 - i * 0.08);
    ctx.beginPath();
    ctx.moveTo(mx, my);
    ctx.lineTo(mx - 2.6 * s, my - 3 * s);
    ctx.stroke();
  }

  ctx.restore();
}

// ------------------------------------------------------------------
// Full-body rendering.
// inst needs: x, y (feet), dir, phase, f (features), size, move, shot
// ------------------------------------------------------------------
const PIXEL_SCRATCH = typeof document !== "undefined" ? document.createElement("canvas") : null;

function drawStickman(ctx, inst, t) {
  let f = inst.f;

  // Glitch: flips through other stickman models for split seconds
  if (f.morph && !inst._noMorph) {
    const seg = Math.floor(t * 2.4);
    if (mulberry32(f.id * 419 + seg * 101)() < 0.7) {
      let mid = 1 + Math.floor(mulberry32(seg * 613 + f.id)() * TYPES.length);
      if (mid === f.id || getFeatures(mid).morph) mid = ((mid + 37) % TYPES.length) + 1;
      f = Object.assign({}, getFeatures(mid), { glitch: true, morph: false, dimWalk: false });
    }
  }

  // Pixel: render the figure small, then blow it up into hard blocks
  if (f.pixelate && !inst._noPix && PIXEL_SCRATCH) {
    const s2 = inst.size * f.size;
    const bw = 66 * s2, bh = 62 * s2;   // world-space box around the figure
    const px = 2.4 * s2;                // pixel block size
    const tw = Math.max(8, Math.round(bw / px)), th = Math.max(8, Math.round(bh / px));
    const c = PIXEL_SCRATCH;
    if (c.width !== tw) c.width = tw;
    if (c.height !== th) c.height = th;
    const pctx = c.getContext("2d");
    pctx.setTransform(1, 0, 0, 1, 0, 0);
    pctx.clearRect(0, 0, tw, th);
    pctx.setTransform(tw / bw, 0, 0, th / bh, 0, 0);
    const sub = Object.assign({}, inst, { x: bw / 2, y: bh - 4 * s2, _noPix: true, f });
    drawStickman(pctx, sub, t);
    ctx.save();
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(c, inst.x - bw / 2, inst.y - (bh - 4 * s2), bw, bh);
    ctx.restore();
    return;
  }

  // Echo: a faint offset copy drawn behind (a hidden second self)
  if (f.echo && !inst._echo) {
    const gf = Object.assign({}, f, { echo: false, glow: null, alpha: (f.alpha || 1) * 0.3 });
    const sub = Object.assign({}, inst, { _echo: true, f: gf, x: inst.x + (inst.dir || 1) * 6, y: inst.y - 2 });
    drawStickman(ctx, sub, t - 0.25);
  }

  const s = inst.size * f.size;
  const move = inst.move;
  const ph = inst.phase;

  let alpha = f.alpha;
  if (f.fade) alpha = f.alpha * (0.55 + 0.45 * Math.sin(t * 2.2 + ph));
  if (move === "teleport") alpha *= inst.tpAlpha !== undefined ? inst.tpAlpha : 1;
  if (inst.dwAlpha !== undefined) alpha *= inst.dwAlpha;
  if (alpha <= 0.01) return;

  let color = f.color;
  if (f.hueCycle) color = `hsl(${(t * 80 + f.id * 47) % 360}, 85%, 45%)`;
  let jitterRot = 0;
  if ((f.glitch || (inst.forceGlitchUntil && inst.forceGlitchUntil > t)) && Math.random() < 0.06) { jitterRot = (Math.random() - 0.5) * 0.4; color = "#e91e63"; }
  if (f.shiver && ((t + f.id * 0.7) % 4.5) < 0.55) jitterRot += Math.sin(t * 55) * 0.03; // cold shudder

  const headR = 5.5 * f.headScale * s;
  const stretchMult = f.stretchy ? 1 + Math.abs(Math.sin(ph)) * 0.18 : 1; // rubbery legs stretch and snap back each stride
  const legH = 14.5 * f.legLen * stretchMult * s;
  const bodyL = 12 * f.bodyLen * s;
  const armL = 10.5 * f.armLen * s;
  const l1 = legH * 0.55, l2 = legH * 0.55;
  const a1 = armL * 0.55, a2 = armL * 0.55;

  const pers = ((f.id * 37) % 20) / 20;

  let stride = legH * (0.46 + pers * 0.12), lift = legH * 0.24, bob = 1.0 * s,
      lean = (0.5 + pers * 0.5) * s, armAmp = 1, airLift = 0, rot = 0,
      legsMode = "walk", armsMode = "swing";

  switch (move) {
    case "run":
      stride = legH * 0.8; lift = legH * 0.55; bob = 2.2 * s; lean = 4 * s;
      armAmp = 1.7; airLift = Math.max(0, Math.sin(2 * ph)) * 2.2 * s; break;
    case "slow":
      stride = legH * 0.26; lift = legH * 0.12; bob = 0.7 * s; lean = 2.2 * s;
      armAmp = 0.3; armsMode = "zombie"; break;
    case "skip":
      lift = legH * 0.42; airLift = Math.max(0, Math.sin(ph * 1.5)) * 4.5 * s;
      bob = 1.8 * s; armAmp = 1.3; break;
    case "hop":
      legsMode = "hop"; armsMode = "raised";
      airLift = Math.abs(Math.sin(ph)) * 8 * s; break;
    case "waddle":
      stride = legH * 0.2; lift = legH * 0.18; rot = Math.sin(ph) * 0.16;
      armsMode = "out"; break;
    case "float":
      legsMode = "dangle"; armsMode = "drift";
      airLift = 7 * s + Math.sin(t * 2 + ph) * 3 * s; lean = 1.5 * s; break;
    case "slither":
      legsMode = "slither"; armsMode = "drift";
      airLift = Math.sin(ph * 2) * 1.5 * s; break;
    case "spin":
      rot = ph; legsMode = "spread"; armsMode = "spread";
      bob = 0; airLift = Math.abs(Math.sin(ph)) * 2 * s; break;
    case "headspin":
      legsMode = "headspin"; armsMode = "headspin"; bob = 0; lean = 0;
      rot = Math.sin(ph * 2.4) * 0.09; break;
    case "twirl":
      legsMode = "twirl"; armsMode = "twirl";
      bob = 0.4 * s; airLift = 1.4 * s; lean = 0; break;
    case "dance":
      airLift = Math.abs(Math.sin(ph * 2)) * 2.5 * s; stride = legH * 0.3;
      armsMode = "wave"; lean = 0; break;
    case "hobble": // old-man shuffle: hunched over a cane, one hand on the back
      stride = legH * 0.22; lift = legH * 0.09; bob = 0.45 * s;
      lean = 3.6 * s; armsMode = "hobble"; break;
    case "moonwalk": // gliding backslide, leaning back, feet skimming the ground
      legsMode = "moonwalk"; armsMode = "mj";
      stride = legH * 0.5; bob = 0.35 * s; lean = -2.6 * s; break;
    case "kingfloat": // the Archive Itself: a weightless, weaving, swaying hover
      legsMode = "dangle"; armsMode = "drift"; bob = 0;
      if (inst.portrait) { airLift = 4 * s; } // held steady for the frame
      else {
        airLift = 9 * s + Math.sin(t * 1.6 + ph) * 5 * s + Math.sin(t * 0.9) * 3.5 * s;
        lean = Math.sin(t * 1.2) * 3 * s;
        rot = Math.sin(t * 1.35) * 0.13;
      }
      break;
    case "kneel": // deep bow, both knees planted on the ground
      legsMode = "kneel"; armsMode = "kneel"; bob = 0; break;
    case "moto": // riding a motorcycle: seated, leaning into the handlebars, engine vibration
      legsMode = "moto"; armsMode = "moto";
      bob = 0.5 * s; lean = 2.5 * s; airLift = 0; break;
    case "pop": // a sudden vertical spring pop, then a pause, on repeat
      stride = legH * 0.15; lift = legH * 0.1;
      airLift = Math.max(0, Math.pow(Math.max(0, Math.sin(ph * 0.5)), 6)) * 11 * s;
      armAmp = 0.6; break;
    case "droop": // a sad, dulled, slumped shuffle
      stride = legH * 0.18; lift = legH * 0.08; bob = 0.35 * s;
      lean = 4.5 * s; armAmp = 0.25; break;
    case "trip": { // stumble → fall flat → push back up (driven by inst.tripT 0..1)
      const p = inst.tripT || 0;
      bob = 0;
      if (p < 0.18) { // toe catches, body pitches forward
        const q = p / 0.18;
        lean = 6.5 * s * q;
        stride = legH * 0.5; lift = legH * 0.08;
        armsMode = "spread";
      } else if (p < 0.42) { // falling to the ground
        const q = (p - 0.18) / 0.24;
        rot = 1.5 * q * q;
        lean = 6.5 * s * (1 - q * 0.4);
        legsMode = "sprawl"; armsMode = "brace";
      } else if (p < 0.68) { // flat, with a small impact bounce
        const q = (p - 0.42) / 0.26;
        rot = 1.5 + Math.sin(q * Math.PI * 2) * 0.05 * (1 - q);
        lean = 3 * s;
        legsMode = "sprawl"; armsMode = "brace";
      } else { // pushing back up to standing
        const q = (p - 0.68) / 0.32;
        const e = 1 - (1 - q) * (1 - q);
        rot = 1.5 * (1 - e);
        lean = 4 * s * (1 - e);
        legsMode = "sprawl"; armsMode = "brace";
      }
      break;
    }
  }
  if (f.snowman) { legsMode = "none"; armsMode = "out"; }
  if (f.centaurBody) legsMode = "none";
  if (f.spiderLegs) legsMode = "spider";
  if (f.tentacles) legsMode = "tentacles";
  if (f.branchArms) armsMode = "branches";
  if (f.cactus) armsMode = "cactus";
  if (f.holdMachine) armsMode = "machine";
  if (f.acc === "drum") armsMode = "drum"; // actively bangs the drum in time with its steps
  if (f.acc === "violin") armsMode = "wave"; // gentle back-and-forth bowing motion
  const spinC = Math.cos(ph * 2.4);

  ctx.save();
  ctx.translate(inst.x, inst.y);
  const facing = f.noFlip ? 1 : (move === "back" || move === "moonwalk") ? -inst.dir : inst.dir;
  if (facing < 0) ctx.scale(-1, 1);
  if (f.invert) { // walks the world upside down
    const hgt = legH + bodyL + headR * 2 + 4 * s;
    ctx.translate(0, -hgt);
    ctx.scale(1, -1);
  }
  if (rot || jitterRot) {
    // trips rotate around the feet so the fall lands along the ground
    const pivotY = (move === "headspin" || move === "trip") ? 0 : -legH * 0.75;
    ctx.translate(0, pivotY);
    ctx.rotate(rot + jitterRot);
    ctx.translate(0, -pivotY);
  }

  ctx.globalAlpha = Math.max(0.05, Math.min(1, alpha));
  ctx.strokeStyle = color;
  ctx.lineWidth = f.lineW * s;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  if (f.dash) ctx.setLineDash([3.2 * s, 2.4 * s]); // unfinished / sketch look
  if (f.glow) { ctx.shadowColor = f.glow; ctx.shadowBlur = 10; }

  // ---- pure-outline vehicles: no human skeleton at all ----
  if (f.vehicleOnly) {
    if (f.vehicleOnly === "car") drawCarOutline(ctx, s, t);
    else if (f.vehicleOnly === "train") drawTrainOutline(ctx, s, t);
    else if (f.vehicleOnly === "chair") drawChairOutline(ctx, s, t);
    else if (f.vehicleOnly === "table") drawTableOutline(ctx, s, t);
    else if (f.vehicleOnly === "sofa") drawSofaOutline(ctx, s, t);
    else if (f.vehicleOnly === "roomba") drawRoombaOutline(ctx, s, t);
    ctx.restore();
    if (inst.shot) {
      ctx.save();
      ctx.globalAlpha = 0.9;
      ctx.fillStyle = "#17a832";
      ctx.font = `bold ${10 * s + 4}px sans-serif`;
      ctx.textAlign = "center";
      ctx.fillText("✓", inst.x, inst.y - (legH + bodyL + headR * 2 + 8 * s));
      ctx.restore();
    }
    return;
  }

  // ---- skeleton anchor points ----
  let hipY = -legH + bob * Math.abs(Math.sin(ph)) - airLift;
  let shoX = lean;
  let shoY = hipY - bodyL + Math.sin(t * 3 + f.id) * 0.35 * s;
  let headCX = shoX + lean * 0.35;
  let headCY = shoY - headR - 2 * s + bob * 0.25 * Math.abs(Math.sin(ph));
  if (move === "headspin") {
    headCX = 0; headCY = -headR;
    shoX = Math.sin(ph * 2.4) * 0.6 * s;
    shoY = -(headR * 2 + 2 * s);
    hipY = shoY - bodyL;
  }
  if (move === "hobble") { // stooped: shoulders drop, head juts forward and down
    shoY += bodyL * 0.18;
    headCX += 2.2 * s;
    headCY += bodyL * 0.3;
  }
  if (move === "kneel") { // hips low over planted knees, torso folded into a deep bow
    hipY = -legH * 0.5;
    shoX = bodyL * 0.62;                  // back pitched well forward
    shoY = hipY - bodyL * 0.5;
    headCX = shoX + headR * 0.8 + 2 * s;  // head reaches forward
    headCY = shoY + headR * 0.35;         // and drops low
  }
  if (move === "moto") { // hunched forward over the tank, tucked down close to the handlebars
    shoY = hipY - bodyL * 0.66;
    shoX = lean + bodyL * 0.32;
    headCX = shoX + headR * 0.5;
    headCY = shoY - headR * 1.6;
  }

  // ---- legs ----
  if (f.legColor) ctx.strokeStyle = f.legColor;
  const legPts = [];
  if (legsMode === "walk") {
    for (let i = 0; i < 2; i++) {
      const p = ph + i * Math.PI;
      const fx = Math.sin(p) * stride + lean * 0.25;
      const fy = -Math.max(0, Math.cos(p)) * lift;
      legPts.push(ik(0, hipY, fx, fy, l1, l2, -1));
    }
  } else if (legsMode === "hop") {
    const air = Math.abs(Math.sin(ph));
    for (let i = 0; i < 2; i++) {
      const fx = (i ? 2.2 : -0.8) * s + air * 1.5 * s;
      const fy = -air * legH * 0.32;
      legPts.push(ik(0, hipY, fx, fy, l1, l2, -1));
    }
  } else if (legsMode === "dangle") {
    for (let i = 0; i < 2; i++) {
      const fx = (i ? 2 : -2) * s + Math.sin(t * 2 + i * 1.7) * 1.6 * s;
      legPts.push(ik(0, hipY, fx, hipY + legH * 0.92, l1, l2, -1));
    }
  } else if (legsMode === "spread") {
    for (let i = 0; i < 2; i++) {
      const fx = (i ? 1 : -1) * legH * 0.5;
      legPts.push(ik(0, hipY, fx, -legH * 0.03, l1, l2, -1));
    }
  } else if (legsMode === "headspin") {
    for (let i = 0; i < 2; i++) {
      const side = i ? 1 : -1;
      const tx = side * legH * 0.5 * (0.35 + 0.65 * Math.abs(spinC)) + spinC * legH * 0.12;
      const ty = hipY - legH * 0.72;
      legPts.push(ik(0, hipY, tx, ty, l1, l2, side));
    }
  } else if (legsMode === "twirl") {
    for (let i = 0; i < 2; i++) {
      const side = i ? 1 : -1;
      const tx = side * 1.3 * s * Math.abs(spinC);
      legPts.push(ik(0, hipY, tx, -legH * 0.02, l1, l2, -1));
    }
  } else if (legsMode === "sprawl") { // trailing legs during a trip
    for (let i = 0; i < 2; i++) {
      const fx = (i ? -3 : -0.8) * s;
      const fy = -(i ? 2 : 0.5) * s;
      legPts.push(ik(0, hipY, fx, fy, l1, l2, -1));
    }
  } else if (legsMode === "moonwalk") {
    // one foot flat, sliding; the other pushes off the toe with a raised heel
    for (let i = 0; i < 2; i++) {
      const p = ph + i * Math.PI;
      const fx = Math.cos(p) * stride * 0.55;
      const fy = -Math.max(0, Math.sin(p)) * legH * 0.14; // heel pop, toes stay low
      legPts.push(ik(0, hipY, fx, fy, l1, l2, -1));
    }
  } else if (legsMode === "moto") {
    // knees bent forward, feet resting on the motorcycle's foot pegs
    for (let i = 0; i < 2; i++) {
      const side = i ? 1 : -1;
      const fx = 1 * s + side * 0.6 * s;
      const fy = -6 * s + side * 0.4 * s;
      legPts.push(ik(0, hipY, fx, fy, l1, l2, 1));
    }
  }
  // kneeling legs are drawn explicitly (below) so the sharp knee reads clearly

  // ---- arms ----
  const armPts = [];
  if (armsMode === "swing") {
    for (let i = 0; i < 2; i++) {
      const p = ph + Math.PI + i * Math.PI;
      const hx = shoX + Math.sin(p) * stride * 0.75 * armAmp;
      const hy = shoY + armL * 0.82 - Math.abs(Math.sin(p)) * armAmp * 1.4 * s;
      armPts.push(ik(shoX, shoY, hx, hy, a1, a2, 1));
    }
  } else if (armsMode === "zombie") {
    for (let i = 0; i < 2; i++) {
      const hx = shoX + armL * 0.85 + Math.sin(t * 4 + i * 1.3) * 0.8 * s;
      const hy = shoY + armL * 0.22 + i * 2 * s;
      armPts.push(ik(shoX, shoY, hx, hy, a1, a2, 1));
    }
  } else if (armsMode === "out") {
    for (let i = 0; i < 2; i++) {
      const hx = shoX + (i ? -1 : 1) * armL * 0.6;
      const hy = shoY + armL * 0.45 + Math.sin(ph + i) * 1.2 * s;
      armPts.push(ik(shoX, shoY, hx, hy, a1, a2, i ? -1 : 1));
    }
  } else if (armsMode === "drift") {
    for (let i = 0; i < 2; i++) {
      const hx = shoX + Math.sin(t * 1.5 + i * 2.1) * armL * 0.35 + (i ? -2 : 2) * s;
      const hy = shoY + armL * 0.68;
      armPts.push(ik(shoX, shoY, hx, hy, a1, a2, i ? -1 : 1));
    }
  } else if (armsMode === "wave") {
    for (let i = 0; i < 2; i++) {
      const up = Math.sin(ph * 2 + i * Math.PI) > 0;
      const hx = shoX + (i ? -1 : 1) * armL * 0.55;
      const hy = shoY + (up ? -armL * 0.55 : armL * 0.55);
      armPts.push(ik(shoX, shoY, hx, hy, a1, a2, (i ? -1 : 1) * (up ? -1 : 1)));
    }
  } else if (armsMode === "drum") { // alternating overhead-to-downstroke bang, timed to the walk
    for (let i = 0; i < 2; i++) {
      const beat = Math.sin(ph * 2 + i * Math.PI);
      const hx = shoX + (i ? -1 : 1) * armL * 0.35;
      const hy = shoY + armL * 0.55 - Math.max(0, beat) * armL * 0.35;
      armPts.push(ik(shoX, shoY, hx, hy, a1, a2, i ? -1 : 1));
    }
  } else if (armsMode === "raised") {
    for (let i = 0; i < 2; i++) {
      const hx = shoX + (i ? -0.6 : 0.9) * armL * 0.55;
      const hy = shoY - armL * 0.1 + Math.abs(Math.sin(ph)) * -2 * s;
      armPts.push(ik(shoX, shoY, hx, hy, a1, a2, i ? -1 : 1));
    }
  } else if (armsMode === "spread") {
    for (let i = 0; i < 2; i++) {
      const hx = shoX + (i ? -1 : 1) * armL * 0.85;
      const hy = shoY + (i ? 0.4 : -0.4) * armL * 0.4;
      armPts.push(ik(shoX, shoY, hx, hy, a1, a2, i ? -1 : 1));
    }
  } else if (armsMode === "headspin") {
    for (let i = 0; i < 2; i++) {
      const side = i ? 1 : -1;
      const hx = shoX + side * (headR * 1.5 + 2 * s) * Math.max(0.4, Math.abs(spinC));
      const hy = -1 * s;
      armPts.push(ik(shoX, shoY, hx, hy, a1, a2, -side));
    }
  } else if (armsMode === "twirl") {
    for (let i = 0; i < 2; i++) {
      const side = i ? 1 : -1;
      const hx = shoX + side * armL * 0.9 * spinC;
      const hy = shoY + armL * 0.08 + (1 - Math.abs(spinC)) * 2 * s;
      armPts.push(ik(shoX, shoY, hx, hy, a1, a2, side));
    }
  } else if (armsMode === "brace") { // arms thrown out to catch a fall
    for (let i = 0; i < 2; i++) {
      const hx = shoX + armL * (0.8 - i * 0.18);
      const hy = shoY + armL * (0.62 + i * 0.12);
      armPts.push(ik(shoX, shoY, hx, hy, a1, a2, 1));
    }
  } else if (armsMode === "kneel") {
    // both arms reach forward and down toward the ground in a deep bow
    for (let i = 0; i < 2; i++) {
      const side = i ? 1 : -1;
      const hx = shoX + 2 * s + side * 0.8 * s;
      const hy = -0.3 * s;
      armPts.push(ik(shoX, shoY, hx, hy, a1, a2, 1));
    }
  } else if (armsMode === "mj") {
    // stiff showman arms: near hand flared out behind, far hand low across the body
    const snap = Math.sin(ph * 2) * 0.6 * s;
    armPts.push(ik(shoX, shoY, shoX + armL * 0.8, shoY + armL * 0.5 + snap, a1, a2, 1));
    armPts.push(ik(shoX, shoY, shoX - armL * 0.45, shoY + armL * 0.72 - snap, a1, a2, -1));
  } else if (armsMode === "moto") {
    // both hands gripping the handlebars, leaning into them
    for (let i = 0; i < 2; i++) {
      const side = i ? 1 : -1;
      const hx = 6.4 * s + side * 0.5 * s;
      const hy = -15.4 * s + side * 0.3 * s;
      armPts.push(ik(shoX, shoY, hx, hy, a1, a2, 1));
    }
  } else if (armsMode === "machine") {
    // both hands gripping a device held out in front of the chest
    for (let i = 0; i < 2; i++) {
      const side = i ? 1 : -1;
      const hx = shoX + side * 2.6 * s;
      const hy = shoY + armL * 0.55;
      armPts.push(ik(shoX, shoY, hx, hy, a1, a2, side));
    }
  } else if (armsMode === "hobble") {
    // near arm: leaning on the cane out front, rocking slightly with each step
    const cx2 = shoX + armL * 0.62 + Math.sin(ph) * 0.8 * s;
    const cy2 = shoY + armL * 0.78;
    armPts.push(ik(shoX, shoY, cx2, cy2, a1, a2, 1));
    // far arm: bent behind, hand pressed on the lower back
    armPts.push(ik(shoX, shoY, -1.6 * s, hipY + 0.4 * s, a1, a2, -1));
  }

  const baseAlpha = ctx.globalAlpha;

  // ---- a receding dotted path behind the feet (the journey taken) ----
  if (f.pathDots) {
    ctx.save();
    ctx.setLineDash([]);
    for (let i = 1; i <= 6; i++) {
      const px = -(inst.dir || 1) * i * 5 * s;
      const py = -0.5 * s - i * 0.3 * s;
      ctx.globalAlpha = baseAlpha * (0.55 - i * 0.07);
      ctx.fillStyle = "#90a4ae";
      ctx.beginPath();
      ctx.ellipse(px, py, (2.2 - i * 0.2) * s, (1 - i * 0.08) * s, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
    ctx.globalAlpha = baseAlpha;
  }

  // ---- concentric glowing rings radiating outward (a rarity beyond forever) ----
  if (f.haloRings) {
    ctx.save();
    const cxr = shoX * 0.5, cyr = (shoY + hipY) / 2 - headR * 0.5;
    ctx.strokeStyle = f.glow || "#b388ff";
    ctx.shadowColor = ctx.strokeStyle; ctx.shadowBlur = 8;
    for (let i = 0; i < f.haloRings; i++) {
      const phase = (t * 0.5 + i / f.haloRings) % 1;
      ctx.globalAlpha = baseAlpha * (1 - phase) * 0.6;
      ctx.lineWidth = Math.max(1, 1.4 * s);
      ctx.beginPath();
      ctx.ellipse(cxr, cyr, (6 + phase * 16) * s, (8 + phase * 20) * s, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
    ctx.globalAlpha = baseAlpha;
  }

  // ---- the king's aura: one structured flame silhouette, white with a bold black outline ----
  if (f.auraFlame) {
    const headTopY = shoY - headR * 2;              // top of the sign
    const acx = shoX * 0.5;
    const acy = headTopY * 0.5 + 2 * s;             // centre of feet(0)→head-top
    const halfH = -headTopY * 0.5 + 3 * s;
    const rx = 10 * s, ry = halfH;
    const N = 11;                                    // flame tongues around the body
    const outer = [], notch = [];
    for (let i = 0; i < N; i++) {
      const a = -Math.PI / 2 + (i / N) * Math.PI * 2;      // start at the top
      const up = (1 - Math.sin(a)) / 2;                    // 1 at top, 0 at bottom
      const fl = 1 + Math.sin(t * 7 + i * 2.1) * 0.16;     // flicker, per tongue
      const tip = (1.12 + up * 0.55) * fl;                 // taller licks reach upward
      outer.push([acx + Math.cos(a) * rx * tip, acy + Math.sin(a) * ry * tip]);
      const an = a + Math.PI / N;                          // dip between two tongues
      notch.push([acx + Math.cos(an) * rx * 0.68, acy + Math.sin(an) * ry * 0.68]);
    }
    ctx.save();
    ctx.globalAlpha = baseAlpha;
    ctx.lineJoin = "round";
    ctx.lineWidth = Math.max(1.6, f.lineW * s * 0.7);       // bold black outline
    // scalloped flame silhouette: pointed cusps at the tips, smooth dips at the notches
    ctx.beginPath();
    ctx.moveTo(outer[0][0], outer[0][1]);
    for (let i = 0; i < N; i++) {
      const nx = notch[i], ox = outer[(i + 1) % N];
      ctx.quadraticCurveTo(nx[0], nx[1], ox[0], ox[1]);
    }
    ctx.closePath();
    ctx.fillStyle = "#fff"; ctx.fill();
    ctx.strokeStyle = "#000"; ctx.stroke();
    // a second, inner flame contour for structure
    ctx.globalAlpha = baseAlpha * 0.55;
    ctx.lineWidth = Math.max(1, f.lineW * s * 0.4);
    ctx.beginPath();
    for (let i = 0; i < N; i++) {
      const a = -Math.PI / 2 + (i / N) * Math.PI * 2;
      const up = (1 - Math.sin(a)) / 2;
      const fl = 1 + Math.sin(t * 7 + i * 2.1 + 1) * 0.16;
      const tip = (0.6 + up * 0.32) * fl;
      const ox = acx + Math.cos(a) * rx * tip, oy = acy + Math.sin(a) * ry * tip;
      const an = a + Math.PI / N;
      const nx = acx + Math.cos(an) * rx * 0.4, ny = acy + Math.sin(an) * ry * 0.4;
      if (i === 0) ctx.moveTo(ox, oy);
      const nxt = -Math.PI / 2 + (((i + 1) % N) / N) * Math.PI * 2;
      const up2 = (1 - Math.sin(nxt)) / 2;
      const tip2 = (0.6 + up2 * 0.32) * (1 + Math.sin(t * 7 + ((i + 1) % N) * 2.1 + 1) * 0.16);
      ctx.quadraticCurveTo(nx, ny, acx + Math.cos(nxt) * rx * tip2, acy + Math.sin(nxt) * ry * tip2);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  }

  // ---- riding cloud ----
  if (f.ride === "cloud") {
    ctx.fillStyle = "#eceff1";
    ctx.strokeStyle = "#90a4ae";
    ctx.beginPath();
    cloudPath(ctx, 0, hipY + legH * 0.82, 4.2 * s);
    ctx.fill(); ctx.stroke();
    ctx.strokeStyle = color;
  }

  // ---- riding a motorcycle ----
  if (f.rideVehicle === "motorcycle") drawMotorcycleOutline(ctx, s, t);

  // ---- giant golden clock companion floating alongside ----
  if (f.companion === "clock") {
    const ccx = shoX - 13 * s, ccy = (hipY + shoY) / 2 + Math.sin(t * 1.8) * 1.5 * s;
    const cr = 6 * s;
    ctx.save();
    ctx.shadowColor = "#ffd70088"; ctx.shadowBlur = 8;
    ctx.fillStyle = "#ffd700";
    ctx.beginPath(); ctx.arc(ccx, ccy, cr, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#b8860b"; ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#fffde7";
    ctx.beginPath(); ctx.arc(ccx, ccy, cr * 0.78, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#5d4037";
    ctx.lineWidth = Math.max(1, f.lineW * s * 0.5);
    ctx.beginPath(); // hour ticks
    for (let i = 0; i < 4; i++) {
      const a = (i * Math.PI) / 2;
      ctx.moveTo(ccx + Math.cos(a) * cr * 0.62, ccy + Math.sin(a) * cr * 0.62);
      ctx.lineTo(ccx + Math.cos(a) * cr * 0.74, ccy + Math.sin(a) * cr * 0.74);
    }
    ctx.stroke();
    const mAng = t * 1.9 - Math.PI / 2, hAng = t * 0.35 - Math.PI / 2;
    ctx.lineWidth = Math.max(1.2, f.lineW * s * 0.6);
    ctx.beginPath(); // working hands
    ctx.moveTo(ccx, ccy); ctx.lineTo(ccx + Math.cos(mAng) * cr * 0.62, ccy + Math.sin(mAng) * cr * 0.62);
    ctx.moveTo(ccx, ccy); ctx.lineTo(ccx + Math.cos(hAng) * cr * 0.4, ccy + Math.sin(hAng) * cr * 0.4);
    ctx.stroke();
    ctx.restore();
  }

  // ---- back items behind everything ----
  if (f.back) drawBackItem(ctx, f, shoX, shoY, hipY, s, t);

  // ---- far limbs, dimmed for depth ----
  ctx.globalAlpha = baseAlpha * 0.62;
  if (legPts[1]) drawLimb(ctx, 0, hipY, legPts[1]);
  if (armPts[1] && armsMode !== "branches" && armsMode !== "cactus") drawLimb(ctx, shoX, shoY, armPts[1]);
  ctx.globalAlpha = baseAlpha;

  // ---- spider legs (8 thin legs) ----
  if (legsMode === "spider") {
    ctx.save();
    ctx.lineWidth = f.lineW * s * 0.7;
    for (let k = 0; k < 8; k++) {
      const side = k < 4 ? -1 : 1;
      const idx = k % 4;
      const reach = (0.35 + idx * 0.22) * legH;
      const liftk = Math.max(0, Math.sin(ph * 2 + k * 1.7)) * 2 * s;
      const pts = ik(0, hipY, side * reach, -liftk, l1 * 1.05, l2 * 1.05, side);
      ctx.globalAlpha = baseAlpha * (side < 0 ? 0.6 : 1);
      drawLimb(ctx, 0, hipY, pts);
    }
    ctx.restore();
  }

  // ---- tentacles instead of legs ----
  if (legsMode === "tentacles") {
    for (let k = 0; k < 4; k++) {
      const off = (k - 1.5) * 2.6 * s;
      const wob = Math.sin(ph * 2 + k * 1.3) * 3 * s;
      ctx.beginPath();
      ctx.moveTo(0, hipY);
      ctx.quadraticCurveTo(off + wob, hipY + legH * 0.5, off + wob * 1.4, -0.5 * s);
      ctx.stroke();
    }
  }

  // ---- wings behind body ----
  if (f.wings) {
    const flap = Math.sin(t * 7 + ph) * 0.35;
    ctx.save();
    ctx.globalAlpha = baseAlpha * 0.85;
    if (f.wings === "butterfly") {
      const hue = (f.id * 73) % 360;
      const fold = 0.45 + 0.55 * Math.abs(Math.cos(t * 5 + ph * 0.7));
      for (const layer of [0, 1]) { // far pair dimmed behind the near pair
        ctx.save();
        ctx.globalAlpha = baseAlpha * (layer ? 0.95 : 0.5);
        ctx.translate(shoX - 0.8 * s, shoY + (layer ? 0.6 : -0.9) * s);
        ctx.scale(-(layer ? fold : fold * 0.82), layer ? 1 : 0.9);
        butterflyWingPair(ctx, s * (layer ? 1 : 0.92), hue);
        ctx.restore();
      }
    } else if (f.wings === "owl") {
      ctx.save();
      ctx.globalAlpha = baseAlpha;
      ctx.translate(shoX - 0.5 * s, shoY + 0.5 * s);
      ctx.rotate(Math.sin(t * 4 + ph) * 0.1);
      ctx.lineWidth = Math.max(1, f.lineW * s * 0.55);
      ctx.strokeStyle = "#3e2723";
      // folded wing: smooth top edge, scalloped primary feather tips
      ctx.fillStyle = "#6d4c41";
      ctx.beginPath();
      ctx.moveTo(0.5 * s, -2.2 * s);
      ctx.quadraticCurveTo(-5 * s, -4.8 * s, -11.5 * s, -3 * s);
      ctx.quadraticCurveTo(-12.6 * s, -2.6 * s, -12.2 * s, -1.6 * s);
      ctx.quadraticCurveTo(-11 * s, -0.6 * s, -10.2 * s, 1.4 * s);
      ctx.quadraticCurveTo(-9.6 * s, 0.4 * s, -8.2 * s, 2.4 * s);
      ctx.quadraticCurveTo(-7.5 * s, 1.2 * s, -5.8 * s, 3.2 * s);
      ctx.quadraticCurveTo(-5.0 * s, 1.8 * s, -3.2 * s, 3.6 * s);
      ctx.quadraticCurveTo(-2.2 * s, 2.0 * s, -0.4 * s, 3.4 * s);
      ctx.quadraticCurveTo(0.6 * s, 1.2 * s, 0.5 * s, -2.2 * s);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
      // lighter covert feathers layered on top
      ctx.fillStyle = "#8d6e63";
      ctx.beginPath();
      ctx.moveTo(0.4 * s, -2 * s);
      ctx.quadraticCurveTo(-4 * s, -3.8 * s, -8 * s, -2.2 * s);
      ctx.quadraticCurveTo(-7.2 * s, -0.6 * s, -5.9 * s, 0.9 * s);
      ctx.quadraticCurveTo(-5.2 * s, -0.2 * s, -3.8 * s, 1.3 * s);
      ctx.quadraticCurveTo(-3.0 * s, 0.2 * s, -1.6 * s, 1.5 * s);
      ctx.quadraticCurveTo(-0.4 * s, 0.2 * s, 0.4 * s, -2 * s);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
      // feather shafts fanning to the tips
      ctx.save();
      ctx.globalAlpha = baseAlpha * 0.5;
      ctx.lineWidth = Math.max(0.7, f.lineW * s * 0.3);
      ctx.beginPath();
      for (const [fx2, fy2] of [[-11.6, -2.2], [-9.9, 0.8], [-7.9, 1.8], [-5.5, 2.6], [-3, 3]]) {
        ctx.moveTo(-1 * s, -1.5 * s);
        ctx.lineTo(fx2 * s, fy2 * s);
      }
      ctx.stroke();
      ctx.restore();
      ctx.restore();
    } else if (f.wings === "flame") {
      // fiery wing: swept-back blade of fire with trailing flame tongues
      ctx.save();
      ctx.translate(shoX - 0.5 * s, shoY);
      ctx.rotate(flap * 0.7 - 0.1);
      ctx.shadowColor = "#ff980088"; ctx.shadowBlur = 10;
      ctx.strokeStyle = "#bf360c";
      ctx.lineWidth = Math.max(0.9, f.lineW * s * 0.4);
      const layers = [
        [1, "#f4511e"],
        [0.62, "#ffb300"],
        [0.34, "#fff176"]
      ];
      for (const [k, col] of layers) {
        ctx.fillStyle = col;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(-6 * s * k, -9.5 * s * k, -14.5 * s * k, -10.5 * s * k); // leading edge
        ctx.quadraticCurveTo(-12.5 * s * k, -7.5 * s * k, -13.5 * s * k, -5 * s * k); // tongue 1
        ctx.quadraticCurveTo(-10 * s * k, -4.6 * s * k, -11 * s * k, -1.2 * s * k);   // tongue 2
        ctx.quadraticCurveTo(-7 * s * k, -1.6 * s * k, -7.6 * s * k, 2 * s * k);      // tongue 3
        ctx.quadraticCurveTo(-3.4 * s * k, 1.2 * s * k, 0, 0);
        ctx.closePath();
        ctx.fill();
        if (k === 1) ctx.stroke();
        ctx.shadowBlur = 0;
      }
      ctx.restore();
    } else if (f.wings === "bee") {
      ctx.beginPath(); ctx.ellipse(shoX - 3 * s, shoY - 3 * s, 3.5 * s, 1.8 * s, -0.8 + flap, 0, Math.PI * 2); ctx.stroke();
    } else {
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.moveTo(shoX - 2 * s, shoY);
      ctx.quadraticCurveTo(shoX - 12 * s, shoY - 8 * s + flap * 8 * s, shoX - 14 * s, shoY + 1 * s);
      ctx.quadraticCurveTo(shoX - 8 * s, shoY + 3 * s, shoX - 2 * s, shoY + 1 * s);
      ctx.closePath(); ctx.fill(); ctx.stroke();
    }
    ctx.restore();
  }

  // ---- tail ----
  if (f.tail && !f.furry) {
    ctx.beginPath();
    ctx.moveTo(0, hipY);
    ctx.quadraticCurveTo(-8 * s, hipY - 2 * s, -9 * s, hipY - 7 * s - Math.sin(t * 5) * 2);
    ctx.stroke();
  }
  if (f.tail && f.furry) { // bushy wolf tail: thick tapering brush
    ctx.save();
    ctx.fillStyle = color;
    const sway = Math.sin(t * 4 + ph) * 1.2 * s;
    ctx.beginPath();
    ctx.moveTo(0, hipY - 1 * s);
    ctx.quadraticCurveTo(-6 * s, hipY - 1 * s, -9 * s + sway, hipY - 5.5 * s);
    ctx.quadraticCurveTo(-11.5 * s + sway, hipY - 8.5 * s, -9.8 * s + sway, hipY - 9.5 * s);
    ctx.quadraticCurveTo(-8.5 * s + sway, hipY - 7 * s, -5.5 * s, hipY - 3.8 * s);
    ctx.quadraticCurveTo(-3 * s, hipY - 2 * s, 0, hipY + 0.6 * s);
    ctx.closePath(); ctx.fill();
    ctx.restore();
  }
  if (f.lionTail) { // lion tail ending in a dark tuft
    ctx.beginPath();
    ctx.moveTo(0, hipY);
    ctx.quadraticCurveTo(-7.5 * s, hipY + 1 * s, -10 * s, hipY - 4 * s - Math.sin(t * 4 + ph));
    ctx.stroke();
    ctx.fillStyle = "#4e342e";
    ctx.beginPath();
    ctx.ellipse(-10.3 * s, hipY - 5.3 * s - Math.sin(t * 4 + ph), 1.4 * s, 2 * s, -0.5, 0, Math.PI * 2);
    ctx.fill();
  }
  if (f.firePlume) { // trailing tail feathers of fire
    ctx.save();
    ctx.shadowColor = "#ff980088"; ctx.shadowBlur = 8;
    for (const [k, col, dy] of [[1, "#f4511e", 0], [0.68, "#ffb300", -0.6], [0.4, "#fff176", -1]]) {
      const wob = Math.sin(t * 8 + k * 5) * 1.2 * s;
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.moveTo(0, hipY + dy * s);
      ctx.quadraticCurveTo(-7 * s * k, hipY - 1 * s * k + wob, -12 * s * k, hipY + 2.5 * s * k + wob);
      ctx.quadraticCurveTo(-7 * s * k, hipY + 2.5 * s * k, 0, hipY + (dy + 1.5) * s);
      ctx.closePath(); ctx.fill();
      ctx.shadowBlur = 0;
    }
    ctx.restore();
  }

  // ---- structured fish tail: tapering peduncle into a forked caudal fin ----
  if (f.fishTail) {
    ctx.save();
    ctx.translate(0, hipY);
    ctx.rotate(Math.sin(t * 5 + ph) * 0.15);
    ctx.fillStyle = f.headFill;
    ctx.lineWidth = Math.max(1.2, f.lineW * s * 0.8);
    ctx.beginPath();
    ctx.moveTo(0, -2.4 * s);
    ctx.quadraticCurveTo(-4.5 * s, -2.1 * s, -7 * s, -0.9 * s);   // top of the peduncle
    ctx.quadraticCurveTo(-9.5 * s, -2.8 * s, -12 * s, -5 * s);    // upper lobe leading edge
    ctx.quadraticCurveTo(-10.4 * s, -1.8 * s, -9.6 * s, 0);       // trailing edge into the notch
    ctx.quadraticCurveTo(-10.4 * s, 1.8 * s, -12 * s, 5 * s);     // lower lobe
    ctx.quadraticCurveTo(-9.5 * s, 2.8 * s, -7 * s, 0.9 * s);     // back to the peduncle
    ctx.quadraticCurveTo(-4.5 * s, 2.1 * s, 0, 2.4 * s);          // underside
    ctx.closePath();
    ctx.fill(); ctx.stroke();
    // fin rays fanning across both lobes
    ctx.save();
    ctx.globalAlpha = baseAlpha * 0.7;
    ctx.lineWidth = Math.max(0.8, f.lineW * s * 0.35);
    ctx.beginPath();
    for (const [tx2, ty2] of [[-11.2, -4.2], [-10.4, -2.2], [-9.8, 0], [-10.4, 2.2], [-11.2, 4.2]]) {
      ctx.moveTo(-7.2 * s, 0);
      ctx.lineTo(tx2 * s, ty2 * s);
    }
    ctx.stroke();
    ctx.restore();
    ctx.restore();
    // dorsal fin on the back at mid-spine
    const dfx = shoX * 0.5 - 1.4 * s, dfy = (hipY + shoY) / 2;
    ctx.fillStyle = f.headFill;
    ctx.beginPath();
    ctx.moveTo(dfx + 0.2 * s, dfy - 2.4 * s);
    ctx.quadraticCurveTo(dfx - 4.5 * s, dfy - 4.5 * s, dfx - 6.8 * s, dfy - 1 * s);
    ctx.quadraticCurveTo(dfx - 3.6 * s, dfy + 1.2 * s, dfx + 0.4 * s, dfy + 1.6 * s);
    ctx.closePath();
    ctx.fill(); ctx.stroke();
    ctx.save();
    ctx.globalAlpha = baseAlpha * 0.6;
    ctx.lineWidth = Math.max(0.8, f.lineW * s * 0.35);
    ctx.beginPath();
    for (const [rx2, ry2] of [[-5.8, -1.2], [-4.2, -2.6], [-2.2, -3.2]]) {
      ctx.moveTo(dfx, dfy - 0.4 * s);
      ctx.lineTo(dfx + rx2 * s, dfy + ry2 * s);
    }
    ctx.stroke();
    ctx.restore();
  }

  // ---- pet on the shoulder (behind head) ----
  if (f.pet === "dragon") {
    const px = shoX - 4 * s, py = shoY - 2 * s;
    ctx.fillStyle = "#43a047";
    ctx.beginPath(); ctx.ellipse(px, py, 2.6 * s, 1.7 * s, -0.2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(px + 2.4 * s, py - 1.2 * s, 1.2 * s, 0, Math.PI * 2); ctx.fill();
    const flap = Math.sin(t * 9) * 0.4;
    ctx.beginPath();
    ctx.moveTo(px - 1 * s, py - 1 * s);
    ctx.lineTo(px - 3.5 * s, py - 3.5 * s - flap * 2 * s);
    ctx.lineTo(px - 0.2 * s, py - 2 * s);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = "#2e7d32";
    ctx.beginPath();
    ctx.moveTo(px - 2.4 * s, py + 0.5 * s);
    ctx.quadraticCurveTo(px - 5 * s, py + 1.5 * s, px - 5.5 * s, py - 0.5 * s);
    ctx.stroke();
    ctx.strokeStyle = color;
  }

  if (f.legColor) ctx.strokeStyle = f.torsoColor || color; // restore for torso/arms after the leg-only tint

  // ---- body / spine ----
  if (f.snowman) {
    ctx.fillStyle = "#fff";
    const c1r = legH * 0.62, c2r = legH * 0.48;
    ctx.beginPath(); ctx.arc(0, -c1r * 0.9, c1r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, hipY + (shoY - hipY) * 0.4, c2r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = color;
    for (const yy of [-c1r * 0.9, hipY + (shoY - hipY) * 0.4]) {
      ctx.beginPath(); ctx.arc(0, yy, 0.8 * s, 0, Math.PI * 2); ctx.fill();
    }
  } else if (legsMode === "slither") {
    ctx.beginPath();
    ctx.moveTo(-legH * 0.95 + Math.sin(ph) * 2 * s, -1.5 * s);
    ctx.quadraticCurveTo(-legH * 0.45, -2 * s + Math.sin(ph * 2) * 3 * s, 0, hipY);
    ctx.quadraticCurveTo(lean * 0.8 + 1 * s, (hipY + shoY) / 2, shoX, shoY);
    ctx.stroke();
  } else if (f.vehicleBody === "rocket") {
    // a rocket silhouette stands in for the whole torso and head
    drawRocketBody(ctx, hipY, headCY - headR, s, t);
  } else if (f.vehicleBody === "tower") {
    // a tall tower silhouette stands in for the whole torso and head
    drawTowerBody(ctx, hipY, s, t);
  } else if (f.vehicleBody === "bridge") {
    // a small bridge silhouette stands in for the whole torso and head
    drawBridgeBody(ctx, hipY, headCY - headR, s, t);
  } else if (f.vehicleBody === "computer") {
    drawComputerBody(ctx, hipY, headCY - headR, s, t);
  } else if (f.vehicleBody === "trunk") {
    drawTrunkBody(ctx, hipY, headCY - headR, s, t);
  } else if (f.vehicleBody === "paper") {
    drawPaperBody(ctx, hipY, headCY - headR, s, t);
  } else if (f.vehicleBody === "treeguardian") {
    drawTreeGuardianBody(ctx, hipY, headCY - headR, s, t);
  } else if (f.vehicleBody === "toaster") {
    drawToasterBody(ctx, hipY, headCY - headR, s, t);
  } else if (f.vehicleBody === "fridge") {
    drawFridgeBody(ctx, hipY, headCY - headR, s, t);
  } else if (f.vehicleBody === "oven") {
    drawOvenBody(ctx, hipY, headCY - headR, s, t);
  } else if (f.vehicleBody === "luckyblock") {
    drawLuckyBlockBody(ctx, hipY, headCY - headR, s, t);
  } else if (f.vehicleBody === "vacuum") {
    drawVacuumBody(ctx, hipY, headCY - headR, s, t);
  } else if (f.centaurBody) {
    drawCentaurBody(ctx, hipY, s, t, ph, stride, lift);
    ctx.beginPath();
    ctx.moveTo(0, hipY);
    ctx.quadraticCurveTo((shoX / 2) + lean * 0.55 + 0.6 * s, (hipY + shoY) / 2, shoX, shoY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(shoX, shoY);
    ctx.lineTo(headCX, headCY + (move === "headspin" ? -headR * 0.9 : headR * 0.9));
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.moveTo(0, hipY);
    ctx.quadraticCurveTo((shoX / 2) + lean * 0.55 + 0.6 * s, (hipY + shoY) / 2, shoX, shoY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(shoX, shoY);
    ctx.lineTo(headCX, headCY + (move === "headspin" ? -headR * 0.9 : headR * 0.9));
    ctx.stroke();
  }

  const midX = (shoX) / 2, midY = (hipY + shoY) / 2;

  // ---- shaggy fur bristling off the spine and shoulders ----
  if (f.furry) {
    ctx.save();
    ctx.lineWidth = Math.max(1, f.lineW * s * 0.5);
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const fr = (i + 0.5) / 5;
      const yy = shoY + (hipY - shoY) * fr;
      const xx = shoX * (1 - fr);
      const wob = Math.sin(t * 6 + i * 2.3) * 0.4 * s;
      ctx.moveTo(xx - 0.5 * s, yy);
      ctx.lineTo(xx - 3.2 * s + wob, yy - 1.6 * s);
    }
    // shoulder ruff
    ctx.moveTo(shoX, shoY - 0.5 * s); ctx.lineTo(shoX - 2.4 * s, shoY - 3.2 * s);
    ctx.moveTo(shoX - 1 * s, shoY + 0.5 * s); ctx.lineTo(shoX - 3.6 * s, shoY - 1.4 * s);
    ctx.stroke();
    ctx.restore();
  }

  // ---- fitted suit jacket ----
  if (f.suit && move !== "headspin") {
    ctx.fillStyle = f.suitColor;
    ctx.beginPath();
    ctx.moveTo(shoX - 2.8 * s, shoY - 0.6 * s);
    ctx.lineTo(shoX + 2.8 * s, shoY - 0.6 * s);
    ctx.quadraticCurveTo(shoX + 2.9 * s, midY, 2.4 * s, hipY + 0.8 * s);
    ctx.lineTo(-2.4 * s, hipY + 0.8 * s);
    ctx.quadraticCurveTo(shoX - 2.9 * s, midY, shoX - 2.8 * s, shoY - 0.6 * s);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // white shirt V + lapels
    ctx.fillStyle = "#f5f5f5";
    ctx.beginPath();
    ctx.moveTo(shoX - 1.3 * s, shoY - 0.4 * s);
    ctx.lineTo(shoX + 1.3 * s, shoY - 0.4 * s);
    ctx.lineTo(shoX * 0.75, midY + 0.5 * s);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#3a3a46";
    ctx.beginPath();
    ctx.moveTo(shoX - 1.3 * s, shoY - 0.4 * s); ctx.lineTo(shoX * 0.75 - 0.5 * s, midY + 0.9 * s);
    ctx.moveTo(shoX + 1.3 * s, shoY - 0.4 * s); ctx.lineTo(shoX * 0.75 + 0.5 * s, midY + 0.9 * s);
    ctx.stroke();
    // tie
    if (f.tieColor) {
      ctx.fillStyle = f.tieColor;
      ctx.beginPath();
      ctx.moveTo(shoX, shoY - 0.2 * s);
      ctx.lineTo(shoX * 0.85 + 0.7 * s, midY - 0.2 * s);
      ctx.lineTo(shoX * 0.8, midY + 1.6 * s);
      ctx.lineTo(shoX * 0.85 - 0.7 * s, midY - 0.2 * s);
      ctx.closePath();
      ctx.fill();
    }
    ctx.strokeStyle = color;
  }

  // ---- plate armor: cuirass + faulds ----
  if (f.armor && move !== "headspin") {
    const waistY = hipY + 0.6 * s;
    // faulds: overlapping skirt plates below the waist
    ctx.fillStyle = "#90a4ae";
    for (let i = 1; i >= 0; i--) {
      const y0 = waistY + i * 1.1 * s;
      const w = 2.5 * s + i * 0.5 * s;
      ctx.beginPath();
      ctx.moveTo(-w, y0 - 1.2 * s);
      ctx.lineTo(w, y0 - 1.2 * s);
      ctx.lineTo(w, y0 - 0.2 * s);
      ctx.quadraticCurveTo(0, y0 + 1.6 * s, -w, y0 - 0.2 * s);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
    }
    // breastplate
    ctx.fillStyle = "#b0bec5";
    ctx.beginPath();
    ctx.moveTo(shoX - 3.3 * s, shoY - 0.7 * s);
    ctx.lineTo(shoX + 3.3 * s, shoY - 0.7 * s);
    ctx.quadraticCurveTo(shoX + 3.5 * s, midY, 2.4 * s, waistY);
    ctx.lineTo(-2.4 * s, waistY);
    ctx.quadraticCurveTo(shoX - 3.5 * s, midY, shoX - 3.3 * s, shoY - 0.7 * s);
    ctx.closePath();
    ctx.fill(); ctx.stroke();
    // centre ridge + chest crease
    ctx.save();
    ctx.strokeStyle = "#546e7a";
    ctx.lineWidth = Math.max(1, f.lineW * s * 0.5);
    ctx.beginPath();
    ctx.moveTo(shoX, shoY - 0.4 * s);
    ctx.quadraticCurveTo(shoX * 0.5 + 0.6 * s, midY, 0, waistY - 0.2 * s);
    ctx.moveTo(shoX - 2.9 * s, shoY + 1.8 * s);
    ctx.quadraticCurveTo(shoX, shoY + 2.8 * s, shoX + 2.9 * s, shoY + 1.8 * s);
    ctx.stroke();
    // gold collar trim
    ctx.strokeStyle = "#c9a227";
    ctx.beginPath();
    ctx.moveTo(shoX - 3.3 * s, shoY - 0.7 * s);
    ctx.lineTo(shoX + 3.3 * s, shoY - 0.7 * s);
    ctx.stroke();
    ctx.restore();
  }

  // ---- torso decorations ----
  if (f.shell) { // ladybug/beetle shell over the back
    ctx.fillStyle = f.shell;
    ctx.beginPath();
    ctx.ellipse(midX - 1.5 * s, midY, 4.6 * s, 6 * s, 0.15, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();
    ctx.strokeStyle = "#212121";
    ctx.beginPath();
    ctx.moveTo(midX - 1.5 * s, midY - 6 * s); ctx.lineTo(midX - 1.5 * s, midY + 6 * s);
    ctx.stroke();
    ctx.fillStyle = "#212121";
    for (const p of [[-3.2, -2.5], [0.5, -3.4], [-3.4, 2.2], [0.8, 2.8]]) {
      ctx.beginPath(); ctx.arc(midX + p[0] * s, midY + p[1] * s, 0.95 * s, 0, Math.PI * 2); ctx.fill();
    }
    ctx.strokeStyle = color;
  }
  if (f.stripes) {
    for (let i = 0; i < 4; i++) {
      ctx.fillStyle = f.stripes[i % 2];
      const fr = i / 4;
      ctx.fillRect(midX - 2.6 * s, shoY + (hipY - shoY) * fr, 5.2 * s, (hipY - shoY) / 4 + 0.5);
    }
  }
  if (f.belly) {
    ctx.fillStyle = "#fff";
    ctx.beginPath(); ctx.ellipse(midX + 0.8 * s, midY + 1 * s, 3 * s, 4.6 * s, 0, 0, Math.PI * 2); ctx.fill();
  }
  if (f.chest || f.emblemText) drawChestIcon(ctx, f, midX, midY, s, t);
  if (f.marks) {
    if (f.marksKind === "glyphs") {
      // floating glowing runes orbiting the torso
      ctx.save();
      ctx.strokeStyle = f.marksColor;
      ctx.fillStyle = f.marksColor;
      ctx.shadowColor = f.marksColor;
      ctx.shadowBlur = 6 * s;
      ctx.lineWidth = Math.max(1, 0.5 * s);
      for (let i = 0; i < 3; i++) {
        const fr = (i + 0.5) / 3;
        const bob = Math.sin(t * 2.2 + i * 2.1) * 0.9 * s;
        const side = i % 2 === 0 ? 1 : -1;
        const gx = shoX * fr + side * 4.2 * s;
        const gy = shoY + (hipY - shoY) * fr + bob;
        const gr = 1.1 * s;
        const kind = (f.id + i) % 3;
        ctx.beginPath();
        if (kind === 0) { // triangle rune
          regularPoly(ctx, gx, gy, gr, 3, -Math.PI / 2 + t * 0.6);
          ctx.stroke();
        } else if (kind === 1) { // ring with dot
          ctx.arc(gx, gy, gr, 0, Math.PI * 2); ctx.stroke();
          ctx.beginPath(); ctx.arc(gx, gy, gr * 0.3, 0, Math.PI * 2); ctx.fill();
        } else { // zigzag bolt
          ctx.moveTo(gx - gr * 0.7, gy - gr);
          ctx.lineTo(gx + gr * 0.4, gy - gr * 0.2);
          ctx.lineTo(gx - gr * 0.4, gy + gr * 0.2);
          ctx.lineTo(gx + gr * 0.7, gy + gr);
          ctx.stroke();
        }
      }
      ctx.restore();
      // faint glowing lines etched on the body too
      ctx.save();
      ctx.strokeStyle = f.marksColor;
      ctx.shadowColor = f.marksColor;
      ctx.shadowBlur = 4 * s;
      ctx.lineWidth = Math.max(1, 0.45 * s);
      ctx.beginPath();
      for (let i = 0; i < 3; i++) {
        const fr = (i + 0.5) / 3;
        const yy = shoY + (hipY - shoY) * fr;
        ctx.moveTo(shoX * fr - 1.2 * s, yy);
        ctx.lineTo(shoX * fr + 1.2 * s, yy);
      }
      ctx.stroke();
      ctx.restore();
    } else if (f.marksKind === "puzzle") {
      // jigsaw seam lines drifting slowly across the torso
      ctx.save();
      ctx.strokeStyle = f.marksColor;
      ctx.lineWidth = Math.max(0.8, 0.5 * s);
      const drift = Math.sin(t * 0.6) * 0.6 * s;
      ctx.beginPath();
      for (let i = 1; i < 3; i++) {
        const xx = shoX * (i / 3) + drift;
        ctx.moveTo(xx, shoY); ctx.lineTo(xx, hipY);
      }
      for (let i = 1; i < 2; i++) {
        const yy = shoY + (hipY - shoY) * (i / 2) - drift;
        ctx.moveTo(shoX * 0.15, yy); ctx.lineTo(shoX * 0.85, yy);
      }
      ctx.stroke();
      ctx.restore();
    } else if (f.marksKind === "chess") {
      // black-and-white checkerboard squares across the torso
      const cols = 3, rows = 3, cw = (shoX * 0.9) / cols;
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          if ((row + col) % 2 === 0) continue;
          ctx.fillStyle = "#111";
          const xx = shoX * 0.05 + col * cw, yy = shoY + (hipY - shoY) * (row / rows);
          ctx.fillRect(xx, yy, cw, (hipY - shoY) / rows);
        }
      }
    } else if (f.marksKind === "cracks") {
      // jagged crack lines, like a chipped toy
      ctx.save();
      ctx.strokeStyle = f.marksColor;
      ctx.lineWidth = Math.max(0.8, 0.45 * s);
      ctx.beginPath();
      ctx.moveTo(shoX * 0.2, shoY + 1 * s);
      ctx.lineTo(shoX * 0.5, shoY + (hipY - shoY) * 0.3);
      ctx.lineTo(shoX * 0.3, shoY + (hipY - shoY) * 0.5);
      ctx.lineTo(shoX * 0.6, hipY - 1 * s);
      ctx.stroke();
      ctx.restore();
    } else if (f.marksKind === "crumbs") {
      // small crumbs gently falling off the body
      ctx.fillStyle = f.marksColor;
      for (let i = 0; i < 4; i++) {
        const fall = (t * 14 + i * 9) % 22;
        const xx = shoX * (0.15 + i * 0.22);
        const yy = shoY + fall * s;
        if (yy > hipY + 10 * s) continue;
        ctx.beginPath(); ctx.arc(xx, yy, 0.6 * s, 0, Math.PI * 2); ctx.fill();
      }
    } else if (f.marksKind === "paper") { // loose paper corners peeking from the top edge
      ctx.save();
      ctx.fillStyle = "#ffffff"; ctx.strokeStyle = "#bdbdbd";
      const flutter = Math.sin(t * 2) * 0.4 * s;
      for (let i = 0; i < 2; i++) {
        const xx = shoX * (0.3 + i * 0.35) + flutter;
        ctx.save();
        ctx.translate(xx, shoY - 0.5 * s); ctx.rotate((i - 0.5) * 0.3);
        ctx.fillRect(-1.4 * s, -1.8 * s, 2.8 * s, 2 * s);
        ctx.strokeRect(-1.4 * s, -1.8 * s, 2.8 * s, 2 * s);
        ctx.restore();
      }
      ctx.restore();
    } else if (f.marksKind === "keys") { // grid of tiled keycap squares covering the body
      ctx.fillStyle = "#eceff1"; ctx.strokeStyle = f.marksColor;
      const cols = 3, rows = 3, cw = (shoX * 0.85) / cols;
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const xx = shoX * 0.08 + col * cw, yy = shoY + (hipY - shoY) * (row / rows) + 1 * s;
          ctx.fillRect(xx, yy, cw * 0.82, ((hipY - shoY) / rows) * 0.7);
          ctx.strokeRect(xx, yy, cw * 0.82, ((hipY - shoY) / rows) * 0.7);
        }
      }
    } else if (f.marksKind === "text") { // tiny scribbled unreadable lines
      ctx.save();
      ctx.strokeStyle = f.marksColor;
      ctx.lineWidth = Math.max(0.6, 0.35 * s);
      ctx.beginPath();
      for (let row = 0; row < 5; row++) {
        const yy = shoY + (hipY - shoY) * ((row + 0.5) / 5);
        ctx.moveTo(shoX * 0.15, yy); ctx.lineTo(shoX * 0.8, yy);
      }
      ctx.stroke();
      ctx.restore();
    } else if (f.marksKind === "gems") { // colourful gem facets scattered over the body
      const gemCols = ["#e91e63", "#42a5f5", "#66bb6a", "#ffca28"];
      for (let i = 0; i < 4; i++) {
        const fr = (i + 0.5) / 4;
        const xx = shoX * fr * 0.8, yy = shoY + (hipY - shoY) * fr;
        ctx.fillStyle = gemCols[i % gemCols.length];
        regularPoly(ctx, xx, yy, 1 * s, 4, t * 0.5 + i);
        ctx.fill();
      }
    } else if (f.marksKind === "code") { // green command-line text streaming downward
      ctx.save();
      ctx.fillStyle = f.marksColor;
      ctx.font = `${1.8 * s}px monospace`;
      ctx.textAlign = "center";
      const chars = "01>_#";
      for (let col = 0; col < 3; col++) {
        const xx = shoX * (0.2 + col * 0.3);
        for (let row = 0; row < 4; row++) {
          const fall = (t * 10 + row * 6 + col * 3) % 24;
          const yy = shoY + fall * s;
          if (yy > hipY + 2 * s) continue;
          ctx.fillText(chars[(row + col + Math.floor(t)) % chars.length], xx, yy);
        }
      }
      ctx.restore();
    } else if (f.marksKind === "paint") { // soft daubs of oil-paint colour across the body
      const paintCols = ["#c62828", "#1565c0", "#f9a825", "#2e7d32"];
      for (let i = 0; i < 4; i++) {
        const fr = (i + 0.5) / 4;
        ctx.fillStyle = paintCols[i % paintCols.length];
        ctx.beginPath();
        ctx.ellipse(shoX * fr * 0.7 + (i % 2 ? 1.4 : -1.4) * s, shoY + (hipY - shoY) * fr, 1.6 * s, 1 * s, i, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (f.marksKind === "pencil") { // graphite cross-hatch shading lines
      ctx.save();
      ctx.strokeStyle = f.marksColor;
      ctx.lineWidth = Math.max(0.5, 0.3 * s);
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const fr = i / 6;
        const yy = shoY + (hipY - shoY) * fr;
        ctx.moveTo(shoX * 0.1, yy); ctx.lineTo(shoX * 0.9, yy + 3 * s);
      }
      ctx.stroke();
      ctx.restore();
    } else if (f.marksKind === "keyring") { // several small keys dangling and swinging
      ctx.save();
      ctx.strokeStyle = f.marksColor; ctx.fillStyle = f.marksColor;
      ctx.lineWidth = Math.max(0.7, 0.4 * s);
      for (let i = 0; i < 3; i++) {
        const fr = (i + 0.5) / 3;
        const baseX = shoX * fr, baseY = shoY + (hipY - shoY) * 0.15;
        const swing = Math.sin(t * 3 + i * 2) * 0.3;
        ctx.save();
        ctx.translate(baseX, baseY); ctx.rotate(swing);
        ctx.beginPath(); ctx.arc(0, 1.4 * s, 0.6 * s, 0, Math.PI * 2); ctx.stroke();
        ctx.fillRect(-0.3 * s, 1.9 * s, 0.6 * s, 1.6 * s);
        ctx.restore();
      }
      ctx.restore();
    } else {
      ctx.fillStyle = f.marksColor;
      for (let i = 0; i < 3; i++) {
        const fr = (i + 0.5) / 3;
        ctx.fillRect(shoX * fr + 2.4 * s, shoY + (hipY - shoY) * fr, 1.5 * s, 1.5 * s);
      }
    }
  }
  if (f.starBody) {
    ctx.fillStyle = "#fff";
    for (let i = 0; i < 4; i++) {
      const yy = shoY + (hipY - shoY) * (i / 4) + 1;
      ctx.fillRect(shoX * (i / 4) - 0.8, yy, 1.6, 1.6);
    }
  }
  if (f.crowdBody) { // a solid body packed with many tiny stickmen
    ctx.save();
    // filled torso capsule so the little figures read against it
    const topY2 = shoY - 1 * s, botY2 = hipY + 1 * s, halfW = 5.2 * s;
    ctx.beginPath();
    ctx.moveTo(shoX - halfW, topY2 + 2 * s);
    ctx.quadraticCurveTo(shoX - halfW, topY2, shoX - halfW + 2 * s, topY2);
    ctx.lineTo(shoX + halfW - 2 * s, topY2);
    ctx.quadraticCurveTo(shoX + halfW, topY2, shoX + halfW, topY2 + 2 * s);
    ctx.lineTo(2.4 * s, botY2);
    ctx.quadraticCurveTo(0, botY2 + 2 * s, -2.4 * s, botY2);
    ctx.closePath();
    ctx.fillStyle = f.headFill; ctx.fill();
    ctx.strokeStyle = f.color; ctx.lineWidth = f.lineW * s; ctx.stroke();
    ctx.clip();
    // tiny stickmen filling it
    ctx.strokeStyle = "#eceff1";
    ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.lineWidth = Math.max(0.5, 0.55 * s);
    const rows = 5, cols = 3;
    for (let r2 = 0; r2 < rows; r2++) {
      for (let c2 = 0; c2 < cols; c2++) {
        const fr = (r2 + 0.6) / (rows + 0.4);
        const mx = shoX * fr + (c2 - 1) * 3 * s * (1 - fr * 0.5) + (r2 % 2 ? 0.9 : -0.9) * s;
        const my = topY2 + (botY2 - topY2) * fr;
        const u = 0.85 * s;
        ctx.beginPath();
        ctx.arc(mx, my - 1.5 * u, 0.62 * u, 0, Math.PI * 2);          // head
        ctx.moveTo(mx, my - 0.85 * u); ctx.lineTo(mx, my + 0.7 * u);  // body
        ctx.moveTo(mx, my - 0.25 * u); ctx.lineTo(mx - 0.85 * u, my + 0.25 * u); // arms
        ctx.moveTo(mx, my - 0.25 * u); ctx.lineTo(mx + 0.85 * u, my + 0.25 * u);
        ctx.moveTo(mx, my + 0.7 * u); ctx.lineTo(mx - 0.75 * u, my + 1.7 * u); // legs
        ctx.moveTo(mx, my + 0.7 * u); ctx.lineTo(mx + 0.75 * u, my + 1.7 * u);
        ctx.stroke();
      }
    }
    ctx.restore();
  }
  if (f.cactus) { // spikes along the body
    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      const fr = (i + 0.5) / 4;
      const yy = shoY + (hipY - shoY) * fr;
      ctx.moveTo(shoX * fr - 1 * s, yy); ctx.lineTo(shoX * fr - 3 * s, yy - 1 * s);
      ctx.moveTo(shoX * fr + 1 * s, yy); ctx.lineTo(shoX * fr + 3 * s, yy - 1 * s);
    }
    ctx.stroke();
  }

  // ---- kneeling legs: thigh down-forward to a knee on the ground, shin flat behind ----
  if (move === "kneel") {
    for (let i = 1; i >= 0; i--) { // far leg first (dimmed), then near
      ctx.globalAlpha = baseAlpha * (i ? 0.6 : 1);
      const side = i ? 1 : -1;
      const hx = side * 1.3 * s;
      const kneeX = 4.2 * s + side * 0.5 * s;
      const footX = -3.6 * s + side * 0.5 * s;
      ctx.beginPath();
      ctx.moveTo(hx, hipY);
      ctx.lineTo(kneeX, 0.2 * s);   // thigh
      ctx.lineTo(footX, 0.2 * s);   // shin resting flat on the ground
      ctx.stroke();
    }
    ctx.globalAlpha = baseAlpha;
  }

  // ---- near leg ----
  if (legPts[0]) {
    if (f.halfRobot) { // robot side: hydraulic gray limb with joint caps
      ctx.save();
      ctx.strokeStyle = "#78909c";
      ctx.lineWidth = f.lineW * s * 1.5;
      drawLimb(ctx, 0, hipY, legPts[0]);
      ctx.fillStyle = "#b0bec5";
      ctx.strokeStyle = "#546e7a";
      ctx.lineWidth = Math.max(0.9, f.lineW * s * 0.45);
      for (const [jx, jy] of [[legPts[0][0], legPts[0][1]], [legPts[0][2], legPts[0][3]]]) {
        ctx.beginPath(); ctx.arc(jx, jy, 1.15 * s, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      }
      ctx.restore();
    } else {
      drawLimb(ctx, 0, hipY, legPts[0]);
    }
  }

  // ---- MJ loafers + white socks on both feet ----
  if (f.mjShoes) {
    for (let i = 1; i >= 0; i--) {
      if (!legPts[i]) continue;
      const [jx, jy, ex, ey] = legPts[i];
      ctx.globalAlpha = baseAlpha * (i ? 0.62 : 1);
      let dx = ex - jx, dy = ey - jy;
      const dl = Math.hypot(dx, dy) || 1; dx /= dl; dy /= dl;
      ctx.save(); // white sock band above the shoe
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = f.lineW * s * 1.15;
      ctx.beginPath();
      ctx.moveTo(ex - dx * 3 * s, ey - dy * 3 * s);
      ctx.lineTo(ex - dx * 0.8 * s, ey - dy * 0.8 * s);
      ctx.stroke();
      ctx.restore();
      ctx.fillStyle = "#111"; // black loafer pointing forward
      ctx.beginPath();
      ctx.ellipse(ex + 1.2 * s, ey - 0.3 * s, 2 * s, 0.9 * s, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = baseAlpha;
  }

  // ---- claw slashes at hands and feet ----
  if (f.claws) {
    ctx.save();
    ctx.lineWidth = Math.max(0.9, f.lineW * s * 0.4);
    for (let i = 1; i >= 0; i--) {
      ctx.globalAlpha = baseAlpha * (i ? 0.62 : 1);
      for (const pts of [legPts[i], armPts[i]]) {
        if (!pts) continue;
        ctx.beginPath();
        for (let k = -1; k <= 1; k++) {
          ctx.moveTo(pts[2], pts[3]);
          ctx.lineTo(pts[2] + 2.2 * s, pts[3] + k * 1.1 * s + 0.2 * s);
        }
        ctx.stroke();
      }
    }
    ctx.restore();
    ctx.globalAlpha = baseAlpha;
  }

  // ---- cloak / cape over the body ----
  if (f.cloak && move !== "headspin") {
    const sway = Math.sin(ph) * 1.5 * s;
    ctx.beginPath();
    ctx.moveTo(shoX - 3 * s, shoY - 1 * s);
    ctx.lineTo(shoX + 3 * s, shoY - 1 * s);
    ctx.quadraticCurveTo(shoX + 5 * s, (shoY + hipY) / 2, 6 * s + sway, -1 * s);
    ctx.lineTo(-6 * s + sway, -1 * s);
    ctx.quadraticCurveTo(shoX - 5 * s, (shoY + hipY) / 2, shoX - 3 * s, shoY - 1 * s);
    ctx.closePath();
    ctx.fillStyle = f.cloakColor || color;
    ctx.globalAlpha = baseAlpha * 0.92;
    ctx.fill();
    if (f.cloakColor) { ctx.globalAlpha = baseAlpha; ctx.stroke(); }
    ctx.globalAlpha = baseAlpha;
    if (f.emblem === "redcross") { // medical cross on the chest of the cloak
      ctx.fillStyle = "#e53935";
      const ex = shoX * 0.6, ey = (shoY + hipY) / 2;
      ctx.fillRect(ex - 0.55 * s, ey - 1.8 * s, 1.1 * s, 3.6 * s);
      ctx.fillRect(ex - 1.8 * s, ey - 0.55 * s, 3.6 * s, 1.1 * s);
    }
    if (f.collar) { // stiff Dracula collar rising beside the head
      ctx.fillStyle = "#6d0a10";
      for (const side of [-1, 1]) {
        ctx.beginPath();
        ctx.moveTo(shoX + side * 3.1 * s, shoY - 0.8 * s);
        ctx.lineTo(shoX + side * 4.6 * s, shoY - 8 * s);
        ctx.lineTo(shoX + side * 0.9 * s, shoY - 2.2 * s);
        ctx.closePath();
        ctx.fill(); ctx.stroke();
      }
    }
  }
  if (f.cape && move !== "headspin") {
    const wave = Math.sin(t * 5 + ph) * 2 * s;
    ctx.beginPath();
    ctx.moveTo(shoX - 1 * s, shoY);
    ctx.quadraticCurveTo(shoX - 8 * s, (shoY + hipY) / 2 + wave, shoX - 11 * s - wave, hipY + 2 * s);
    ctx.lineTo(shoX - 3 * s, hipY - 1 * s);
    ctx.closePath();
    ctx.fillStyle = f.cloakColor || color;
    ctx.globalAlpha = baseAlpha * 0.85;
    ctx.fill();
    ctx.globalAlpha = baseAlpha;
  }

  // ---- arms ----
  if (armsMode === "branches") {
    ctx.save();
    ctx.lineWidth = f.lineW * s * 0.9;
    for (const side of [-1, 1]) {
      const ex = shoX + side * armL * 0.75, ey = shoY - armL * 0.55;
      ctx.beginPath();
      ctx.moveTo(shoX, shoY);
      ctx.lineTo(ex, ey);
      ctx.moveTo(shoX + side * armL * 0.4, shoY - armL * 0.28);
      ctx.lineTo(shoX + side * armL * 0.5, shoY - armL * 0.65);
      ctx.stroke();
      ctx.fillStyle = "#66bb6a";
      ctx.beginPath(); ctx.arc(ex, ey, 2.6 * s, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(shoX + side * armL * 0.5, shoY - armL * 0.7, 1.9 * s, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  } else if (armsMode === "cactus") {
    ctx.save();
    ctx.lineWidth = f.lineW * s * 1.4;
    for (const side of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(shoX, shoY + 1 * s);
      ctx.lineTo(shoX + side * armL * 0.55, shoY + 1 * s);
      ctx.lineTo(shoX + side * armL * 0.55, shoY - armL * 0.5);
      ctx.stroke();
    }
    ctx.restore();
  } else if (armPts[0]) {
    if (f.halfRobot) { // robot side: hydraulic gray arm with joint caps
      ctx.save();
      ctx.strokeStyle = "#78909c";
      ctx.lineWidth = f.lineW * s * 1.5;
      drawLimb(ctx, shoX, shoY, armPts[0]);
      ctx.fillStyle = "#b0bec5";
      ctx.strokeStyle = "#546e7a";
      ctx.lineWidth = Math.max(0.9, f.lineW * s * 0.45);
      for (const [jx, jy] of [[armPts[0][0], armPts[0][1]], [armPts[0][2], armPts[0][3]]]) {
        ctx.beginPath(); ctx.arc(jx, jy, 1.05 * s, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      }
      ctx.restore();
    } else {
      drawLimb(ctx, shoX, shoY, armPts[0]);
    }
  }

  // single sparkling white glove on the near hand
  if (f.mjGlove && armPts[0]) {
    ctx.save();
    ctx.fillStyle = "#fff";
    ctx.shadowColor = "#e0e0e0"; ctx.shadowBlur = 5;
    ctx.beginPath(); ctx.arc(armPts[0][2], armPts[0][3], 1.7 * s, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = "#9e9e9e";
    ctx.lineWidth = Math.max(0.7, f.lineW * s * 0.3);
    ctx.stroke();
    // glint
    const gl = (t * 2 + f.id) % 3;
    if (gl < 0.4) {
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = Math.max(0.8, f.lineW * s * 0.35);
      const gx = armPts[0][2] + 1.6 * s, gy = armPts[0][3] - 1.8 * s;
      ctx.beginPath();
      ctx.moveTo(gx - 1.2 * s, gy); ctx.lineTo(gx + 1.2 * s, gy);
      ctx.moveTo(gx, gy - 1.2 * s); ctx.lineTo(gx, gy + 1.2 * s);
      ctx.stroke();
    }
    ctx.restore();
  }

  // icicles hanging from the hands (Frostbite)
  if (f.icicles) {
    ctx.save();
    ctx.fillStyle = "#b3e5fc";
    ctx.strokeStyle = "#4fc3f7";
    ctx.lineWidth = Math.max(0.7, f.lineW * s * 0.3);
    for (let i = 1; i >= 0; i--) {
      if (!armPts[i]) continue;
      ctx.globalAlpha = baseAlpha * (i ? 0.62 : 1);
      const [, , ex, ey] = armPts[i];
      for (const [ox, len] of [[-1.1, 3.2], [0.2, 4.6], [1.3, 2.6]]) {
        ctx.beginPath();
        ctx.moveTo(ex + (ox - 0.55) * s, ey + 0.6 * s);
        ctx.lineTo(ex + ox * s, ey + (0.6 + len) * s);
        ctx.lineTo(ex + (ox + 0.55) * s, ey + 0.6 * s);
        ctx.closePath(); ctx.fill(); ctx.stroke();
      }
    }
    ctx.restore();
    ctx.globalAlpha = baseAlpha;
  }

  // boxing gloves / claws on both hands
  if (f.gloves && armPts.length === 2) {
    ctx.fillStyle = f.gloves;
    for (let i = 0; i < 2; i++) {
      ctx.globalAlpha = baseAlpha * (i ? 0.7 : 1);
      ctx.beginPath(); ctx.arc(armPts[i][2], armPts[i][3], 2 * s, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = baseAlpha;
  }

  // ---- armored joints: pauldron, elbow/knee plates, gauntlets ----
  if (f.armor) {
    const plate = (x, y, rad) => {
      ctx.beginPath(); ctx.arc(x, y, rad, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();
    };
    ctx.save();
    ctx.fillStyle = "#b0bec5";
    ctx.strokeStyle = "#546e7a";
    ctx.lineWidth = Math.max(1, f.lineW * s * 0.5);
    for (let i = 1; i >= 0; i--) {
      ctx.globalAlpha = baseAlpha * (i ? 0.62 : 1);
      if (armPts[i]) { plate(armPts[i][0], armPts[i][1], 1.05 * s); plate(armPts[i][2], armPts[i][3], 1.35 * s); }
      if (legPts[i]) plate(legPts[i][0], legPts[i][1], 1.15 * s);
    }
    // pauldron capping the shoulder
    ctx.globalAlpha = baseAlpha;
    ctx.beginPath();
    ctx.arc(shoX, shoY - 0.2 * s, 2.5 * s, Math.PI * 0.85, Math.PI * 2.15);
    ctx.closePath();
    ctx.fill(); ctx.stroke();
    ctx.beginPath();
    ctx.arc(shoX, shoY - 0.2 * s, 1.6 * s, Math.PI, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  // ---- rings encircling the head (drawn behind it) ----
  if (f.eternalRing) { // a single eternal ring endlessly turning
    ctx.save();
    ctx.strokeStyle = f.glow || "#f4b400";
    ctx.shadowColor = ctx.strokeStyle; ctx.shadowBlur = 6;
    ctx.lineWidth = Math.max(1, 1.2 * s);
    const tilt2 = Math.sin(t * 1.2) * 0.5;
    ctx.beginPath();
    ctx.ellipse(headCX, headCY, headR * 1.5, headR * 0.5, tilt2, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
  if (f.perfectRings) { // faint compass-drawn construction circles
    ctx.save();
    ctx.strokeStyle = f.glow || "#4fc3f7";
    ctx.globalAlpha = baseAlpha * 0.5;
    ctx.lineWidth = Math.max(0.6, 0.5 * s);
    for (const rr of [1.28, 1.55]) {
      ctx.beginPath(); ctx.arc(headCX, headCY, headR * rr, 0, Math.PI * 2); ctx.stroke();
    }
    // a compass tick sweeping the outer circle
    const ca = t * 1.5;
    ctx.beginPath();
    ctx.moveTo(headCX, headCY);
    ctx.lineTo(headCX + Math.cos(ca) * headR * 1.55, headCY + Math.sin(ca) * headR * 1.55);
    ctx.stroke();
    ctx.restore();
    ctx.globalAlpha = baseAlpha;
  }

  // ---- head group (skipped entirely for vehicle bodies — they have no head) ----
  const tilt = move === "headspin" ? Math.PI
    : move === "kneel" ? 1.0
    : Math.sin(ph) * 0.05 + (move === "run" ? 0.16 : move === "slow" ? 0.12 : 0.02);
  if (!f.vehicleBody) {
  ctx.save();
  ctx.translate(headCX, headCY);
  ctx.rotate(tilt);
  drawHead(ctx, f, 0, 0, headR, t);
  const topY = f.head === "rect" ? -headR * 1.25 : -headR;
  if (f.hat) drawHat(ctx, f, 0, topY, headR);
  if (f.bubbleHelm) {
    ctx.strokeStyle = "#4aa8c9";
    ctx.beginPath(); ctx.arc(0, 0, headR * 1.45, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = color;
  }
  if (f.halo) {
    ctx.strokeStyle = "#f4b400";
    ctx.beginPath(); ctx.ellipse(0, topY - headR * 0.7, headR * 0.75, headR * 0.22, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = color;
  }
  if (f.horns) {
    ctx.beginPath();
    ctx.moveTo(-headR * 0.5, topY + headR * 0.2); ctx.quadraticCurveTo(-headR * 1.0, topY - headR * 0.5, -headR * 0.6, topY - headR * 0.9);
    ctx.moveTo(headR * 0.5, topY + headR * 0.2); ctx.quadraticCurveTo(headR * 1.0, topY - headR * 0.5, headR * 0.6, topY - headR * 0.9);
    ctx.stroke();
  }
  if (f.ears === "cat") {
    ctx.beginPath();
    ctx.moveTo(-headR * 0.6, topY + headR * 0.3); ctx.lineTo(-headR * 0.75, topY - headR * 0.55); ctx.lineTo(-headR * 0.1, topY + headR * 0.05);
    ctx.moveTo(headR * 0.6, topY + headR * 0.3); ctx.lineTo(headR * 0.75, topY - headR * 0.55); ctx.lineTo(headR * 0.1, topY + headR * 0.05);
    ctx.stroke();
  } else if (f.ears === "rabbit") {
    ctx.beginPath();
    ctx.ellipse(-headR * 0.35, topY - headR * 0.75, headR * 0.2, headR * 0.85, -0.15, 0, Math.PI * 2);
    ctx.ellipse(headR * 0.35, topY - headR * 0.75, headR * 0.2, headR * 0.85, 0.15, 0, Math.PI * 2);
    ctx.stroke();
  } else if (f.ears === "dog") {
    ctx.beginPath();
    ctx.ellipse(-headR * 0.7, topY + headR * 0.5, headR * 0.22, headR * 0.55, 0.5, 0, Math.PI * 2);
    ctx.ellipse(headR * 0.7, topY + headR * 0.5, headR * 0.22, headR * 0.55, -0.5, 0, Math.PI * 2);
    ctx.stroke();
  } else if (f.ears === "bear") {
    ctx.beginPath();
    ctx.arc(-headR * 0.6, topY, headR * 0.3, 0, Math.PI * 2);
    ctx.arc(headR * 0.6, topY, headR * 0.3, 0, Math.PI * 2);
    ctx.stroke();
  } else if (f.ears === "owltuft") { // feathered horn tufts
    ctx.fillStyle = f.color;
    for (const side of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(side * headR * 0.62, topY + headR * 0.28);
      ctx.quadraticCurveTo(side * headR * 0.88, topY - headR * 0.3, side * headR * 0.55, topY - headR * 0.55);
      ctx.quadraticCurveTo(side * headR * 0.35, topY - headR * 0.05, side * headR * 0.15, topY + headR * 0.12);
      ctx.closePath(); ctx.fill();
    }
  } else if (f.ears === "antennae") {
    ctx.beginPath();
    ctx.moveTo(-headR * 0.3, topY); ctx.lineTo(-headR * 0.6, topY - headR * 0.8);
    ctx.moveTo(headR * 0.3, topY); ctx.lineTo(headR * 0.6, topY - headR * 0.8);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(-headR * 0.6, topY - headR * 0.9, headR * 0.12, 0, Math.PI * 2);
    ctx.arc(headR * 0.6, topY - headR * 0.9, headR * 0.12, 0, Math.PI * 2);
    ctx.fill();
  } else if (f.ears === "phones") {
    ctx.beginPath(); ctx.arc(0, topY + headR * 0.4, headR * 1.15, Math.PI * 1.05, Math.PI * 1.95); ctx.stroke();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(-headR * 1.05, topY + headR * 0.75, headR * 0.22, headR * 0.4, 0, 0, Math.PI * 2);
    ctx.ellipse(headR * 1.05, topY + headR * 0.75, headR * 0.22, headR * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
  }

  // ---- extra heads (hydra / cerberus) ----
  if (f.multiHead > 1) {
    for (const side of [-1, 1]) {
      const hx2 = headCX + side * headR * 1.9;
      const hy2 = headCY + headR * 0.55;
      ctx.beginPath();
      ctx.moveTo(shoX, shoY);
      ctx.quadraticCurveTo(hx2 * 0.6, shoY - headR, hx2, hy2 + headR * 0.7);
      ctx.stroke();
      ctx.save();
      ctx.translate(hx2, hy2);
      ctx.rotate(side * 0.15);
      const f2 = Object.assign({}, f, { headScale: f.headScale * 0.72, beard: false, comb: false, beak: null, stem: false, headDots: null });
      drawHead(ctx, f2, 0, 0, headR * 0.72, t);
      ctx.restore();
    }
  }

  // ---- accessory in the near hand ----
  if (f.acc && armPts[0]) drawAccessory(ctx, f, armPts[0][2], armPts[0][3], s, t);

  // ---- a different item in the far hand ----
  if (f.offAcc && armPts[1]) {
    ctx.save();
    ctx.globalAlpha = baseAlpha * 0.82;
    drawAccessory(ctx, Object.assign({}, f, { acc: f.offAcc }), armPts[1][2], armPts[1][3], s, t);
    ctx.restore();
  }

  // ---- a device gripped with both hands ----
  if (f.holdMachine && armPts[0] && armPts[1]) {
    const mx = (armPts[0][2] + armPts[1][2]) / 2;
    const my = (armPts[0][3] + armPts[1][3]) / 2 - 1 * s;
    ctx.save();
    ctx.fillStyle = "#78909c"; ctx.strokeStyle = "#37474f";
    ctx.lineWidth = Math.max(1, f.lineW * s * 0.5);
    ctx.beginPath(); ctx.rect(mx - 3.6 * s, my - 2.6 * s, 7.2 * s, 5.2 * s); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#37474f"; // dial
    ctx.beginPath(); ctx.arc(mx - 1.6 * s, my - 0.2 * s, 1.3 * s, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = "#90a4ae";
    ctx.lineWidth = Math.max(0.6, f.lineW * s * 0.3);
    const needle = t * 3;
    ctx.beginPath();
    ctx.moveTo(mx - 1.6 * s, my - 0.2 * s);
    ctx.lineTo(mx - 1.6 * s + Math.cos(needle) * 1 * s, my - 0.2 * s + Math.sin(needle) * 1 * s);
    ctx.stroke();
    ctx.fillStyle = "#fbc02d"; // small lever
    ctx.beginPath(); ctx.rect(mx + 1.2 * s, my - 2.6 * s - 1.4 * s, 1 * s, 1.6 * s); ctx.fill();
    ctx.strokeStyle = "#90a4ae"; // stubby antenna
    ctx.lineWidth = Math.max(0.7, f.lineW * s * 0.35);
    ctx.beginPath(); ctx.moveTo(mx + 2.6 * s, my - 2.6 * s); ctx.lineTo(mx + 3.2 * s, my - 4.4 * s); ctx.stroke();
    const spark = ((t * 6) | 0) % 4 === 0;
    if (spark) {
      ctx.strokeStyle = "#4fc3f7"; ctx.lineWidth = Math.max(0.7, f.lineW * s * 0.4);
      ctx.beginPath();
      ctx.moveTo(mx + 3.2 * s, my - 4.4 * s);
      ctx.lineTo(mx + 4 * s, my - 5 * s);
      ctx.moveTo(mx + 3.2 * s, my - 4.4 * s);
      ctx.lineTo(mx + 2.6 * s, my - 5.2 * s);
      ctx.stroke();
    }
    ctx.restore();
  }

  // ---- puppet strings ----
  if (f.strings) {
    ctx.save();
    ctx.globalAlpha = baseAlpha * 0.5;
    ctx.lineWidth = Math.max(0.8, f.lineW * s * 0.4);
    ctx.beginPath();
    const topLine = headCY - headR - 24 * s;
    ctx.moveTo(headCX, topLine); ctx.lineTo(headCX, headCY - headR);
    if (armPts[0]) { ctx.moveTo(armPts[0][2], topLine); ctx.lineTo(armPts[0][2], armPts[0][3]); }
    if (armPts[1]) { ctx.moveTo(armPts[1][2], topLine); ctx.lineTo(armPts[1][2], armPts[1][3]); }
    ctx.stroke();
    ctx.restore();
  }

  // ---- overhead companions ----
  if (f.overhead) drawOverhead(ctx, f, headCX, headCY - headR * 2.6, s, t);

  // ---- sports ball ----
  if (f.ball === "soccer") {
    const bx = 6 * s + Math.sin(ph) * 3 * s;
    ctx.fillStyle = "#fff";
    ctx.beginPath(); ctx.arc(bx, -2.2 * s, 2.2 * s, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#212121";
    regularPoly(ctx, bx, -2.2 * s, 0.9 * s, 5, ph); ctx.fill();
  } else if (f.ball === "basketball") {
    const by = -2.2 * s - Math.abs(Math.sin(ph * 2)) * 9 * s;
    ctx.fillStyle = "#f57c00";
    ctx.beginPath(); ctx.arc(5.5 * s, by, 2.2 * s, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(3.3 * s, by); ctx.lineTo(7.7 * s, by);
    ctx.moveTo(5.5 * s, by - 2.2 * s); ctx.lineTo(5.5 * s, by + 2.2 * s);
    ctx.stroke();
  }

  // ---- orbiting objects ----
  if (f.orbit) {
    for (let i = 0; i < f.orbit; i++) {
      const a = t * 2 + (i * 2 * Math.PI) / f.orbit;
      const ox = headCX + Math.cos(a) * (headR + 7 * s);
      const oy = headCY + Math.sin(a) * (headR + 5 * s) * 0.5;
      if (f.orbitKind === "page") {
        ctx.fillStyle = "#fff";
        ctx.fillRect(ox - 2 * s, oy - 2.6 * s, 4 * s, 5.2 * s);
        ctx.strokeRect(ox - 2 * s, oy - 2.6 * s, 4 * s, 5.2 * s);
      } else if (f.orbitKind === "photo") { // little photographs orbiting
        ctx.save();
        ctx.fillStyle = "#fff"; ctx.strokeStyle = "#607d8b";
        ctx.lineWidth = Math.max(0.7, s * 0.4);
        ctx.fillRect(ox - 2.4 * s, oy - 2 * s, 4.8 * s, 4 * s);
        ctx.strokeRect(ox - 2.4 * s, oy - 2 * s, 4.8 * s, 4 * s);
        ctx.fillStyle = `hsl(${(i * 67 + f.id) % 360}, 60%, 72%)`;
        ctx.fillRect(ox - 1.8 * s, oy - 1.4 * s, 3.6 * s, 2.2 * s);
        ctx.restore();
      } else if (f.orbitKind === "spark") {
        ctx.fillStyle = "#f4b400";
        starPath(ctx, ox, oy, 2.2 * s);
        ctx.fill();
      } else if (f.orbitKind === "note") {
        ctx.fillStyle = color;
        ctx.font = `bold ${6 * s}px sans-serif`;
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText("♪", ox, oy);
      } else if (f.orbitKind === "ingredient") { // tomato / egg / pepper cycling
        const kind = i % 3;
        if (kind === 0) { ctx.fillStyle = "#e53935"; ctx.beginPath(); ctx.arc(ox, oy, 1.9 * s, 0, Math.PI * 2); ctx.fill(); }
        else if (kind === 1) { ctx.fillStyle = "#fff9c4"; ctx.beginPath(); ctx.ellipse(ox, oy, 1.4 * s, 1.9 * s, 0, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = "#fdd835"; ctx.beginPath(); ctx.arc(ox, oy, 0.7 * s, 0, Math.PI * 2); ctx.fill(); }
        else { ctx.fillStyle = "#66bb6a"; ctx.beginPath(); ctx.ellipse(ox, oy, 1.1 * s, 2 * s, 0.4, 0, Math.PI * 2); ctx.fill(); }
      } else if (f.orbitKind === "cup") { // small floating teacup
        ctx.fillStyle = "#fff"; ctx.strokeStyle = "#90a4ae";
        ctx.lineWidth = Math.max(0.6, s * 0.35);
        ctx.beginPath(); ctx.arc(ox, oy + 0.6 * s, 1.7 * s, 0, Math.PI); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.arc(ox + 2 * s, oy + 0.6 * s, 0.7 * s, -Math.PI * 0.5, Math.PI * 0.5); ctx.stroke();
      } else if (f.orbitKind === "candy") { // wrapped candy twist
        ctx.fillStyle = `hsl(${(i * 90 + f.id * 13) % 360}, 80%, 58%)`;
        ctx.beginPath(); ctx.ellipse(ox, oy, 1.8 * s, 1.1 * s, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath();
        ctx.moveTo(ox - 1.8 * s, oy); ctx.lineTo(ox - 2.6 * s, oy - 0.9 * s); ctx.lineTo(ox - 2.6 * s, oy + 0.9 * s); ctx.closePath();
        ctx.moveTo(ox + 1.8 * s, oy); ctx.lineTo(ox + 2.6 * s, oy - 0.9 * s); ctx.lineTo(ox + 2.6 * s, oy + 0.9 * s); ctx.closePath();
        ctx.fill();
      } else if (f.orbitKind === "card") { // small orbiting playing card
        ctx.save();
        ctx.translate(ox, oy); ctx.rotate(a);
        ctx.fillStyle = "#fff"; ctx.strokeStyle = "#616161";
        ctx.lineWidth = Math.max(0.5, s * 0.3);
        ctx.fillRect(-1.6 * s, -2.2 * s, 3.2 * s, 4.4 * s); ctx.strokeRect(-1.6 * s, -2.2 * s, 3.2 * s, 4.4 * s);
        ctx.fillStyle = i % 2 ? "#c62828" : "#212121";
        ctx.beginPath(); ctx.arc(0, 0, 0.8 * s, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      } else if (f.orbitKind === "bubble") { // translucent soap bubble
        ctx.save();
        ctx.globalAlpha = 0.55;
        ctx.strokeStyle = "#81d4fa"; ctx.fillStyle = "#e1f5fe55";
        ctx.lineWidth = Math.max(0.5, s * 0.3);
        ctx.beginPath(); ctx.arc(ox, oy, 1.8 * s + Math.sin(t * 3 + i) * 0.3 * s, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.restore();
      } else if (f.orbitKind === "ball") { // juggling ball on a bouncing arc
        const bob = Math.abs(Math.sin(a * 1.7)) * 3 * s;
        ctx.fillStyle = `hsl(${(i * 120) % 360}, 75%, 55%)`;
        ctx.beginPath(); ctx.arc(ox, oy - bob, 1.7 * s, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      } else if (f.orbitKind === "wave") { // a small soundwave arc
        ctx.strokeStyle = color;
        ctx.lineWidth = Math.max(0.8, s * 0.4);
        ctx.beginPath(); ctx.arc(ox, oy, 1.8 * s, -Math.PI * 0.4, Math.PI * 0.4); ctx.stroke();
        ctx.beginPath(); ctx.arc(ox, oy, 1 * s, -Math.PI * 0.4, Math.PI * 0.4); ctx.stroke();
      } else if (f.orbitKind === "block") { // small floating toy block
        ctx.fillStyle = `hsl(${(i * 90 + 20) % 360}, 70%, 55%)`;
        ctx.fillRect(ox - 1.6 * s, oy - 1.6 * s, 3.2 * s, 3.2 * s);
        ctx.strokeRect(ox - 1.6 * s, oy - 1.6 * s, 3.2 * s, 3.2 * s);
      } else if (f.orbitKind === "balloon") { // small balloon on a curling string
        ctx.save();
        ctx.strokeStyle = "#9e9e9e"; ctx.lineWidth = Math.max(0.5, s * 0.25);
        ctx.beginPath(); ctx.moveTo(ox, oy + 1.6 * s); ctx.quadraticCurveTo(ox + 0.6 * s, oy + 3 * s, ox, oy + 4.2 * s); ctx.stroke();
        ctx.fillStyle = `hsl(${(i * 110 + f.id * 7) % 360}, 80%, 60%)`;
        ctx.beginPath(); ctx.ellipse(ox, oy, 1.6 * s, 2 * s, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.restore();
      } else if (f.orbitKind === "planet") { // a tiny ringed planet cooking in a pan
        ctx.fillStyle = `hsl(${(i * 130 + 40) % 360}, 60%, 55%)`;
        ctx.beginPath(); ctx.arc(ox, oy, 1.6 * s, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = `hsl(${(i * 130 + 40) % 360}, 60%, 75%)`;
        ctx.lineWidth = Math.max(0.5, s * 0.3);
        ctx.beginPath(); ctx.ellipse(ox, oy, 2.6 * s, 0.7 * s, 0.3, 0, Math.PI * 2); ctx.stroke();
      } else if (f.orbitKind === "specimen") { // tiny collected stickman silhouettes, orbiting
        ctx.save();
        ctx.fillStyle = `hsl(${(i * 100 + f.id * 11) % 360}, 55%, 50%)`;
        ctx.beginPath();
        ctx.arc(ox, oy - 1.1 * s, 0.6 * s, 0, Math.PI * 2); ctx.fill();
        ctx.lineWidth = Math.max(0.6, s * 0.35); ctx.strokeStyle = ctx.fillStyle;
        ctx.beginPath(); ctx.moveTo(ox, oy - 0.5 * s); ctx.lineTo(ox, oy + 1 * s);
        ctx.moveTo(ox - 0.8 * s, oy); ctx.lineTo(ox + 0.8 * s, oy);
        ctx.moveTo(ox, oy + 1 * s); ctx.lineTo(ox - 0.7 * s, oy + 1.9 * s);
        ctx.moveTo(ox, oy + 1 * s); ctx.lineTo(ox + 0.7 * s, oy + 1.9 * s);
        ctx.stroke();
        ctx.restore();
      } else if (f.orbitKind === "eye") { // a single unblinking eye, following
        ctx.save();
        ctx.fillStyle = "#fff"; ctx.strokeStyle = "#616161";
        ctx.beginPath(); ctx.ellipse(ox, oy, 2 * s, 1.3 * s, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = "#37474f";
        ctx.beginPath(); ctx.arc(ox, oy, 0.85 * s, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      } else if (f.orbitKind === "star") { // tiny twinkling stars drifting around the head
        ctx.save();
        ctx.fillStyle = "#fff59d";
        ctx.globalAlpha *= 0.6 + Math.sin(t * 3 + i * 2) * 0.4;
        starPath(ctx, ox, oy, 1.3 * s);
        ctx.fill();
        ctx.restore();
      } else if (f.orbitKind === "miniobj") { // tiny printed copies of random shapes
        const kind = i % 3;
        ctx.fillStyle = `hsl(${(i * 70 + f.id * 5) % 360}, 55%, 60%)`;
        if (kind === 0) { ctx.fillRect(ox - 1.3 * s, oy - 1.3 * s, 2.6 * s, 2.6 * s); }
        else if (kind === 1) { ctx.beginPath(); ctx.arc(ox, oy, 1.4 * s, 0, Math.PI * 2); ctx.fill(); }
        else { regularPoly(ctx, ox, oy, 1.5 * s, 3, a); ctx.fill(); }
      } else {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(ox, oy, 1.6 * s, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // ---- streaming air currents wrapping the body (Wind) ----
  if (f.windLines) {
    ctx.save();
    ctx.globalAlpha = 0.55;
    ctx.strokeStyle = "#90a4ae";
    ctx.lineWidth = Math.max(1, f.lineW * s * 0.5);
    ctx.lineCap = "round";
    for (let i = 0; i < 3; i++) {
      const yy = hipY + (shoY - hipY) * (i / 2) - 1 * s;
      const drift = ((t * 30 + i * 21) % 34) - 17;
      ctx.beginPath();
      ctx.moveTo(drift - 11 * s, yy);
      ctx.quadraticCurveTo(drift - 3 * s, yy - 2 * s, drift + 3 * s, yy + 0.5 * s);
      ctx.quadraticCurveTo(drift + 7 * s, yy + 1.8 * s, drift + 8.5 * s, yy - 0.5 * s);
      ctx.arc(drift + 7.2 * s, yy - 1 * s, 1.5 * s, 0.4, Math.PI * 1.5, true); // curl
      ctx.stroke();
    }
    ctx.restore();
  }

  // ---- lightning striking all around (Storm) ----
  if (f.lightning) {
    for (let k = 0; k < 3; k++) {
      const cyc = t * 2.2 + k * 0.41;
      const seg = Math.floor(cyc);
      const rng2 = mulberry32(f.id * 31 + seg * 97 + k * 13);
      if (rng2() < 0.55 && cyc % 1 < 0.3) {
        const side = rng2() < 0.5 ? -1 : 1;
        const bx = side * (10 + rng2() * 10) * s;
        const topY2 = -(28 + rng2() * 8) * s;
        ctx.save();
        ctx.globalAlpha = baseAlpha * (0.5 + rng2() * 0.5);
        ctx.strokeStyle = "#ffe082";
        ctx.shadowColor = "#fff176"; ctx.shadowBlur = 8;
        ctx.lineWidth = Math.max(1.1, f.lineW * s * 0.55);
        ctx.beginPath();
        let lx = bx, ly = topY2;
        ctx.moveTo(lx, ly);
        for (let j = 0; j < 4; j++) {
          lx += (rng2() - 0.5) * 7 * s;
          ly += -topY2 / 4;
          ctx.lineTo(lx, ly);
        }
        ctx.stroke();
        ctx.restore();
      }
    }
    ctx.globalAlpha = baseAlpha;
  }

  // ---- deep-archive front overlays ----
  const figTop = shoY - headR * 2 - 3 * s, figBot = 1 * s;
  if (f.numberSwarm) { // tiny numbers drifting around (one in a million)
    ctx.save();
    ctx.fillStyle = f.numberSwarm;
    ctx.font = `700 ${3.4 * s}px monospace`;
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    for (let i = 0; i < 12; i++) {
      const a = t * 0.6 + i * 2.1;
      const rr = (6 + (i % 4) * 3) * s;
      const nx = shoX * 0.5 + Math.cos(a) * rr * 1.3;
      const ny = (shoY + hipY) / 2 - headR * 0.4 + Math.sin(a) * rr;
      ctx.globalAlpha = baseAlpha * (0.35 + (i % 3) * 0.22);
      ctx.fillText(String((i * 7 + Math.floor(t * 2)) % 10), nx, ny);
    }
    ctx.restore();
    ctx.globalAlpha = baseAlpha;
  }
  if (f.sparkleBurst) { // radiant sparkles (a flash of discovery / wonder)
    ctx.save();
    ctx.strokeStyle = f.glow || "#fff59d";
    ctx.shadowColor = ctx.strokeStyle; ctx.shadowBlur = 6;
    const cxs = shoX * 0.5, cys = (shoY + hipY) / 2 - headR * 0.4;
    for (let i = 0; i < 8; i++) {
      const a = i * Math.PI / 4;
      const puls = (Math.sin(t * 3 + i) * 0.5 + 0.5);
      const r0 = (9 + puls * 3) * s, r1 = (13 + puls * 5) * s;
      ctx.globalAlpha = baseAlpha * (0.4 + puls * 0.5);
      ctx.lineWidth = Math.max(0.8, 1 * s);
      ctx.beginPath();
      ctx.moveTo(cxs + Math.cos(a) * r0, cys + Math.sin(a) * r0);
      ctx.lineTo(cxs + Math.cos(a) * r1, cys + Math.sin(a) * r1);
      ctx.stroke();
    }
    ctx.restore();
    ctx.globalAlpha = baseAlpha;
  }
  if (f.dissolve) { // the leading edge disintegrates into drifting specks
    ctx.save();
    ctx.fillStyle = f.glow || "#b39ddb";
    const seg = Math.floor(t * 3);
    const rng = mulberry32(f.id * 53 + seg * 29);
    for (let i = 0; i < 22; i++) {
      const fy = figTop + rng() * (figBot - figTop);
      const spread = rng();
      const fx = 3 * s + spread * spread * 16 * s;
      ctx.globalAlpha = baseAlpha * (1 - spread) * 0.9;
      const sz = (0.6 + rng() * 1.2) * s;
      ctx.fillRect(fx, fy, sz, sz);
    }
    ctx.restore();
    ctx.globalAlpha = baseAlpha;
  }
  if (f.erased) { // chunks of the figure erased into white voids
    ctx.save();
    const seg = Math.floor(t * 1.5);
    const rng = mulberry32(f.id * 97 + seg * 41);
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#bdbdbd";
    ctx.setLineDash([2 * s, 1.6 * s]);
    ctx.lineWidth = Math.max(0.6, 0.5 * s);
    for (let i = 0; i < 3; i++) {
      const bx = (-5 + rng() * 12) * s;
      const by = figTop + rng() * (figBot - figTop);
      const bw = (4 + rng() * 5) * s, bh = (3 + rng() * 5) * s;
      ctx.fillRect(bx, by, bw, bh);
      ctx.strokeRect(bx, by, bw, bh);
    }
    ctx.restore();
  }
  if (f.restart) { // circular refresh arrows turning around the figure (a new beginning)
    ctx.save();
    const cxr = shoX * 0.5, cyr = (shoY + hipY) / 2 - headR * 0.4;
    const rr = (headR + bodyL * 0.5) * 1.15;
    ctx.strokeStyle = f.glow || "#26a69a";
    ctx.shadowColor = ctx.strokeStyle; ctx.shadowBlur = 5;
    ctx.lineWidth = Math.max(1.4, 1.6 * s);
    const spin = t * (f.restart === "endless" ? 1.6 : 1.0);
    const loops = f.restart === "endless" ? 2 : 1;
    for (let k = 0; k < loops; k++) {
      const a0 = spin + k * Math.PI;
      const a1 = a0 + Math.PI * 1.55;
      ctx.beginPath();
      ctx.arc(cxr, cyr, rr - k * 3 * s, a0, a1);
      ctx.stroke();
      // arrowhead at the leading end
      const ex = cxr + Math.cos(a1) * (rr - k * 3 * s);
      const ey = cyr + Math.sin(a1) * (rr - k * 3 * s);
      const ta = a1 + Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(ex, ey);
      ctx.lineTo(ex + Math.cos(ta - 0.5) * 3.2 * s, ey + Math.sin(ta - 0.5) * 3.2 * s);
      ctx.moveTo(ex, ey);
      ctx.lineTo(ex + Math.cos(ta + 0.5) * 3.2 * s, ey + Math.sin(ta + 0.5) * 3.2 * s);
      ctx.stroke();
    }
    ctx.restore();
    ctx.globalAlpha = baseAlpha;
  }
  if (f.censor) { // a black bar and label over an unreleased entry
    ctx.save();
    ctx.fillStyle = "#111";
    ctx.fillRect(headCX - headR * 1.15, headCY - headR * 0.28, headR * 2.3, headR * 0.62);
    const midY2 = (shoY + hipY) / 2;
    ctx.fillRect(shoX * 0.5 - 9 * s, midY2 - 2.2 * s, 18 * s, 4.4 * s);
    ctx.fillStyle = "#fff";
    ctx.font = `700 ${2.6 * s}px sans-serif`;
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("COMING SOON", shoX * 0.5, midY2);
    ctx.restore();
  }

  if (f.jointMarks) { // small black joint dots: neck, shoulder, hip (Doll) — drawn last so nothing covers them
    ctx.save();
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#000000";
    const jr = Math.max(0.9, 0.9 * s);
    for (const [jx, jy] of [
      [headCX, headCY + headR * 0.85],
      [shoX, shoY],
      [0, hipY]
    ]) {
      ctx.beginPath(); ctx.arc(jx, jy, jr, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }

  ctx.restore();

  // ---- an old photograph frame around the whole figure (drawn in world space) ----
  if (f.photoFrameColor) {
    ctx.save();
    const fh = legH + bodyL + headR * 2 + 10 * s;
    const fw = fh * 0.66;
    const fx = inst.x - fw / 2, fy = inst.y - fh + 4 * s;
    if (f.sepia) { // warm vintage wash over the subject
      ctx.globalAlpha = 0.16; ctx.fillStyle = "#a1743c";
      ctx.fillRect(fx, fy, fw, fh);
      ctx.globalAlpha = 1;
    }
    ctx.lineWidth = Math.max(3, 3.5 * s);
    ctx.strokeStyle = f.photoFrameColor;
    ctx.strokeRect(fx, fy, fw, fh);
    ctx.lineWidth = Math.max(1, 1 * s);
    ctx.strokeStyle = "#00000055";
    ctx.strokeRect(fx + 2 * s, fy + 2 * s, fw - 4 * s, fh - 4 * s);
    ctx.restore();
  }

  // photographed check mark (drawn unflipped, above the figure)
  if (inst.shot) {
    ctx.save();
    ctx.globalAlpha = 0.9;
    ctx.fillStyle = "#17a832";
    ctx.font = `bold ${10 * s + 4}px sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText("✓", inst.x, inst.y - (legH + bodyL + headR * 2 + 8 * s));
    ctx.restore();
  }
}

// Standing portrait for the bounty frame and Stickdex fallback.
function drawPortrait(typeId, w, h) {
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, w, h);
  const f = getFeatures(typeId);
  const keepMoves = ["float", "slither", "headspin", "twirl", "hop", "waddle", "hobble", "moonwalk", "kingfloat", "moto"];
  const move = keepMoves.includes(f.move) ? f.move : "walk";
  // the king is tall (big sign head) and wreathed in flame — shrink it and
  // drop it lower so the whole figure and aura fit inside the frame.
  // entries with something floating above the head get a little headroom too.
  const hasTop = f.overhead || f.haloRings || f.sparkleBurst;
  const fit = f.auraFlame ? 0.6 : f.vehicleBody === "tower" ? 0.62 : hasTop ? 0.82 : 1.0;
  const inst = {
    x: w / 2, y: h * (f.auraFlame ? 0.92 : hasTop ? 0.82 : 0.88), dir: 1,
    phase: move === "twirl" ? 0.05 : 0.7,
    f, size: (h / 52) * fit, move,
    shot: false,
    portrait: true, // suppress the big vertical float so it stays framed
    _noMorph: true  // the bounty portrait must show the type itself, not a morph frame
  };
  drawStickman(ctx, inst, 1.234);
  return c;
}
