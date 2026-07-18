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
    legLen: 1, armLen: 1, bodyLen: 1, size: 1,
    alpha: 1, fade: false, glow: null, hueCycle: false, starBody: false,
    hat: null, wings: null, halo: false, horns: false, ears: null, tail: false,
    trail: null, orbit: 0, orbitKind: null, acc: null, back: null, eyes: null,
    cloak: false, cloakColor: null, cape: false, marks: false, marksColor: "#f4b400",
    shell: null, branchArms: false, cactus: false, spiderLegs: false,
    tentacles: false, snowman: false, stripes: null, belly: false,
    beak: null, gloves: null, beard: false, comb: false, ball: null,
    chest: null, overhead: null, ride: null, strings: false, pet: null,
    suit: false, suitColor: "#1c1c24", tieColor: "#b71c1c",
    companion: null, marksKind: "squares",
    multiHead: 0, bubbleHelm: false, invert: false, headDots: null, stem: false,
    mask: false, armor: false, fishTail: false, emblem: null,
    move: null, speed: 1, glitch: false,
    crest: null, firePlume: false, halfRobot: false, pixelate: false,
    mjGlove: false, mjShoes: false, collar: false, hair: null, fangs: false,
    furry: false, muzzle: null, claws: false, lionTail: false,
    boltEars: false, electric: false, windLines: false, lightning: false,
    icicles: false, shiver: false, morph: false, dimWalk: false,
    auraFlame: false, signText: null
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

  // The king keeps exactly its tuned look — skip the generic accent passes
  // below that would otherwise recolor its head or add orbiting sparks.
  if (id === 1000) { FEATURE_CACHE.set(id, f); return f; }

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
  153: { head: "earth", headFill: "#42a5f5" },                           // Earth head
  154: { alpha: 0.16, fade: false, windLines: true, color: "#78909c", headFill: "#eceff1" }, // Wind
  155: { head: "cloud", headFill: "#78909c", color: "#37474f", lightning: true }, // Storm
  156: { snowman: true, move: "waddle", beak: "#fb8c00", legLen: 0.55, bodyLen: 0.75, color: "#607d8b", headFill: "#fff" }, // Snowman
  157: { icicles: true, shiver: true, trail: "snow" },                   // Frostbite
  163: { orbit: 3 },                                                     // Magnet
  171: { hat: "shako", color: "#2e7d32" },                               // Toy Soldier
  172: { back: "windkey" },                                              // Wind-Up
  175: { strings: true },                                                // Marionette
  179: { head: "square", headFill: "#bcaaa4" },                          // Cardboard
  187: { color: "#8d6e63", headFill: "#a1887f", marks: true, marksColor: "#fff" }, // Gingerbread
  189: { ears: "rabbit" },                                               // Easter
  194: { acc: "clover" },                                                // Lucky
  195: { overhead: "orb" },                                              // Fortune
  219: { orbit: 3, orbitKind: "note" },                                  // Music
  220: { chest: "keys" },                                                // Piano
  222: { acc: "drum" },                                                  // Drummer
  224: { orbit: 3, orbitKind: "note", acc: "wand" },                     // Conductor
  226: { ears: "phones" },                                               // DJ
  270: { headFill: "#fff" },                                             // Chess
  287: { invert: true, move: "float" },                                  // Gravityless
  335: { multiHead: 3, color: "#4e342e", headFill: "#8d6e63" },          // Cerberus
  351: { head: "camera" },                                               // Camera
  352: { head: "folder", acc: null },                                    // Folder
  356: { tail: true },                                                   // Mouse
  361: { chest: "book" },                                                // Book
  365: { move: "hobble", acc: "cane", speed: 0.55, beard: true, color: "#5f5f5f" }, // Old Man
  366: { acc: "moneybag" },                                              // Money Bag
  368: { color: "#6d4c41", marks: true, marksColor: "#f4b400" },         // Treasure Chest
  384: { head: "trophy" },                                               // Trophy
  390: { move: "slow" },                                                 // Sleepwalker
  414: { chest: "core" },                                                // AI Core
  420: { overhead: "cloud" },                                            // Sad
  424: { overhead: "bulb" },                                             // Idea
  530: { hat: "shako", color: "#78909c", headFill: "#b0bec5" },          // Tin Soldier
  531: { back: "windkey" },                                              // Wind-Up Hero
  540: { headFill: "#cfd8dc", glow: "#b3e5fc88" },                       // Mirror Ball
  644: { chest: "core" },                                                // System Core
  664: { head: "camera", headFill: "#ffd700" },                          // The Photographer
  703: { acc: "pencil", trail: "print" },                                // The Creator draws reality
  704: { acc: "pencil", trail: "print" },                                // The Artist
  851: { suit: true, glow: "#9575cd88", color: "#311b92" },              // The Unknown Traveler's suit
  927: { companion: "clock" },                                           // The Time Master
  935: { companion: "clock" },                                           // The Endless Clock
  936: { companion: "clock" },                                           // The Impossible Clock
  937: { companion: "clock" },                                           // The World Clock
  938: { companion: "clock" },                                           // The Universe Clock
  939: { companion: "clock" },                                           // The Final Clock
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
  }
  if (f.stem) {
    ctx.strokeStyle = "#4e342e";
    ctx.beginPath(); ctx.moveTo(cx, cy - r); ctx.lineTo(cx + r * 0.12, cy - r * 1.4); ctx.stroke();
    ctx.fillStyle = "#43a047";
    ctx.beginPath(); ctx.ellipse(cx + r * 0.45, cy - r * 1.35, r * 0.3, r * 0.15, -0.5, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = f.color;
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
    case "wizard":
      ctx.beginPath();
      ctx.moveTo(cx - r * 1.05, topY); ctx.lineTo(cx + r * 1.05, topY); ctx.lineTo(cx + r * 0.1, topY - r * 1.8);
      ctx.closePath();
      ctx.fillStyle = "#5e35b1"; ctx.fill(); ctx.stroke();
      break;
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
      ctx.fillStyle = "#8d6e63";
      ctx.beginPath(); ctx.ellipse(hx + 1 * s, hy + 2 * s, 4.5 * s, 3.4 * s, 0.35, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#fff";
      ctx.beginPath(); ctx.arc(hx + 1.5 * s, hy + 1.5 * s, 1.2 * s, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath();
      ctx.moveTo(hx + 4 * s, hy); ctx.lineTo(hx + 12 * s, hy - 5 * s);
      ctx.stroke();
      ctx.fillStyle = f.color;
      ctx.fillRect(hx + 11.4 * s, hy - 6.6 * s, 2.2 * s, 2.2 * s);
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
      ctx.fillStyle = "#76ff03";
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
  }
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
  if (f.glitch && Math.random() < 0.06) { jitterRot = (Math.random() - 0.5) * 0.4; color = "#e91e63"; }
  if (f.shiver && ((t + f.id * 0.7) % 4.5) < 0.55) jitterRot += Math.sin(t * 55) * 0.03; // cold shudder

  const headR = 5.5 * f.headScale * s;
  const legH = 14.5 * f.legLen * s;
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
    case "kneel": // bowing low on both knees before the king
      legsMode = "kneel"; armsMode = "kneel";
      stride = 0; lift = 0; bob = 0; lean = 3 * s; break;
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
  if (f.spiderLegs) legsMode = "spider";
  if (f.tentacles) legsMode = "tentacles";
  if (f.branchArms) armsMode = "branches";
  if (f.cactus) armsMode = "cactus";
  const spinC = Math.cos(ph * 2.4);

  ctx.save();
  ctx.translate(inst.x, inst.y);
  const facing = (move === "back" || move === "moonwalk") ? -inst.dir : inst.dir;
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
  if (f.glow) { ctx.shadowColor = f.glow; ctx.shadowBlur = 10; }

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
  if (move === "kneel") { // hips sink to the ground, torso and head bow forward
    hipY = -legH * 0.42;
    shoX = lean + 2 * s;
    shoY = hipY - bodyL * 0.92;
    headCX = shoX + headR * 0.5 + 2 * s;
    headCY = shoY - headR * 0.15;
  }

  // ---- legs ----
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
  } else if (legsMode === "kneel") {
    // shins folded flat behind, knees jutting down-forward onto the ground
    for (let i = 0; i < 2; i++) {
      const side = i ? 1 : -1;
      const fx = -4.5 * s + side * 1.4 * s;
      legPts.push(ik(0, hipY, fx, 0.2 * s, l1, l2, 1));
    }
  }

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
    // both hands lowered forward in supplication toward the king
    for (let i = 0; i < 2; i++) {
      const hx = shoX + armL * (0.55 + i * 0.12);
      const hy = shoY + armL * 0.72;
      armPts.push(ik(shoX, shoY, hx, hy, a1, a2, 1));
    }
  } else if (armsMode === "mj") {
    // stiff showman arms: near hand flared out behind, far hand low across the body
    const snap = Math.sin(ph * 2) * 0.6 * s;
    armPts.push(ik(shoX, shoY, shoX + armL * 0.8, shoY + armL * 0.5 + snap, a1, a2, 1));
    armPts.push(ik(shoX, shoY, shoX - armL * 0.45, shoY + armL * 0.72 - snap, a1, a2, -1));
  } else if (armsMode === "hobble") {
    // near arm: leaning on the cane out front, rocking slightly with each step
    const cx2 = shoX + armL * 0.62 + Math.sin(ph) * 0.8 * s;
    const cy2 = shoY + armL * 0.78;
    armPts.push(ik(shoX, shoY, cx2, cy2, a1, a2, 1));
    // far arm: bent behind, hand pressed on the lower back
    armPts.push(ik(shoX, shoY, -1.6 * s, hipY + 0.4 * s, a1, a2, -1));
  }

  const baseAlpha = ctx.globalAlpha;

  // ---- the king's black-outlined white aura of flame (behind everything) ----
  if (f.auraFlame) {
    const headTopY = shoY - headR * 2;         // top of the sign
    const acx = shoX * 0.5;
    const acy = headTopY * 0.5;                 // midpoint of feet(0)→head-top
    const halfH = -headTopY * 0.5;              // half the figure's height
    const rx = 8.5 * s, ry = halfH * 1.02;      // envelope hugging the silhouette
    ctx.save();
    ctx.globalAlpha = baseAlpha * 0.35;         // soft inner white halo
    ctx.fillStyle = "#fff";
    ctx.beginPath(); ctx.ellipse(acx, acy, rx * 0.8, ry * 0.82, 0, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = baseAlpha;
    ctx.lineJoin = "round";
    ctx.lineWidth = Math.max(1, f.lineW * s * 0.32);
    const N = 16;
    for (let i = 0; i < N; i++) {
      const a = (i / N) * Math.PI * 2 - Math.PI / 2;
      const fl = 1 + Math.sin(t * 6 + i * 1.9) * 0.16;      // gentle flicker
      const curl = Math.sin(t * 5 + i) * 1.4 * s;           // licking sway
      const ca = Math.cos(a), sa = Math.sin(a), pa = a + Math.PI / 2, bw = 2.2 * s;
      const bx = acx + ca * rx * 0.92, by = acy + sa * ry * 0.92;
      const tx = acx + ca * rx * 1.18 * fl, ty = acy + sa * ry * 1.18 * fl;
      ctx.beginPath();
      ctx.moveTo(bx + Math.cos(pa) * bw, by + Math.sin(pa) * bw);
      ctx.quadraticCurveTo(bx + ca * rx * 0.25 + curl, by + sa * ry * 0.25, tx, ty);
      ctx.quadraticCurveTo(bx - ca * rx * 0.05 + curl, by - sa * ry * 0.05, bx - Math.cos(pa) * bw, by - Math.sin(pa) * bw);
      ctx.closePath();
      ctx.fillStyle = "#fff"; ctx.fill();
      ctx.strokeStyle = "#000"; ctx.stroke();
    }
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
  if (f.chest) drawChestIcon(ctx, f, midX, midY, s, t);
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

  // ---- head group ----
  const tilt = move === "headspin" ? Math.PI
    : move === "kneel" ? 0.6
    : Math.sin(ph) * 0.05 + (move === "run" ? 0.16 : move === "slow" ? 0.12 : 0.02);
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
      } else if (f.orbitKind === "spark") {
        ctx.fillStyle = "#f4b400";
        starPath(ctx, ox, oy, 2.2 * s);
        ctx.fill();
      } else if (f.orbitKind === "note") {
        ctx.fillStyle = color;
        ctx.font = `bold ${6 * s}px sans-serif`;
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText("♪", ox, oy);
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

  ctx.restore();

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
  const keepMoves = ["float", "slither", "headspin", "twirl", "hop", "waddle", "hobble", "moonwalk", "kingfloat"];
  const move = keepMoves.includes(f.move) ? f.move : "walk";
  // the king is tall (big sign head) and wreathed in flame — shrink it and
  // drop it lower so the whole figure and aura fit inside the frame
  const fit = f.auraFlame ? 0.6 : 1.0;
  const inst = {
    x: w / 2, y: h * (f.auraFlame ? 0.92 : 0.88), dir: 1,
    phase: move === "twirl" ? 0.05 : 0.7,
    f, size: (h / 52) * fit, move,
    shot: false,
    portrait: true, // suppress the big vertical float so it stays framed
    _noMorph: true  // the bounty portrait must show the type itself, not a morph frame
  };
  drawStickman(ctx, inst, 1.234);
  return c;
}
