// Stickman Archive — game engine: world sim, camera, bounty frame, Stickdex, saving.

"use strict";

(() => {

const canvas = document.getElementById("world");
const ctx = canvas.getContext("2d");
const els = {
  money: document.getElementById("money"),
  cameraBtn: document.getElementById("camera-btn"),
  folderBtn: document.getElementById("folder-btn"),
  frame: document.getElementById("frame"),
  frameCanvas: document.getElementById("frame-canvas"),
  framePhoto: document.getElementById("frame-photo"),
  frameTick: document.getElementById("frame-tick"),
  viewfinder: document.getElementById("viewfinder"),
  cameraHint: document.getElementById("camera-hint"),
  flash: document.getElementById("flash"),
  toast: document.getElementById("toast"),
  stickdex: document.getElementById("stickdex"),
  dexBack: document.getElementById("dex-back"),
  dexMoney: document.getElementById("dex-money"),
  dexCount: document.getElementById("dex-count"),
  dexGrid: document.getElementById("dex-grid"),
  shopBtn: document.getElementById("shop-btn"),
  shop: document.getElementById("shop"),
  shopBack: document.getElementById("shop-back"),
  shopMoney: document.getElementById("shop-money"),
  buyFasterCam: document.getElementById("buy-fastercam"),
  buyMultiCapture: document.getElementById("buy-multicapture"),
  buyTripod: document.getElementById("buy-tripod"),
  buyTimefreeze: document.getElementById("buy-timefreeze"),
  buyLuckyCharm: document.getElementById("buy-luckycharm"),
  tripodOwnedCount: document.getElementById("tripod-owned-count"),
  timefreezeOwnedCount: document.getElementById("timefreeze-owned-count"),
  luckyCharmOwnedCount: document.getElementById("luckycharm-owned-count"),
  tripodInvBtn: document.getElementById("tripod-inv-btn"),
  tripodInvCount: document.getElementById("tripod-inv-count"),
  timefreezeInvBtn: document.getElementById("timefreeze-inv-btn"),
  timefreezeInvCount: document.getElementById("timefreeze-inv-count"),
  luckyCharmInvBtn: document.getElementById("luckycharm-inv-btn"),
  luckyCharmInvCount: document.getElementById("luckycharm-inv-count"),
  tripodHint: document.getElementById("tripod-hint"),
  tripodConfirm: document.getElementById("tripod-confirm"),
  tripodConfirmYes: document.getElementById("tripod-confirm-yes"),
  tripodConfirmNo: document.getElementById("tripod-confirm-no"),
  rainbowTimer: document.getElementById("rainbow-timer"),
  rainbowTimerFill: document.getElementById("rainbow-timer-fill"),
  rainbowTimerTime: document.getElementById("rainbow-timer-time"),
  goldenTimer: document.getElementById("golden-timer"),
  goldenTimerFill: document.getElementById("golden-timer-fill"),
  goldenTimerTime: document.getElementById("golden-timer-time"),
  luckTimer: document.getElementById("luck-timer"),
  luckTimerFill: document.getElementById("luck-timer-fill"),
  luckTimerTime: document.getElementById("luck-timer-time")
};

const SAVE_KEY = "stickmanArchiveSaveV1";
const FRAME_COOLDOWN_MS = 10 * 60 * 1000; // same type can't be the bounty within 10 minutes
const BOUNTY_TIMEOUT_MS = 10 * 60 * 1000;

// Shop
const FASTER_CAMERA_COST = 15000;
const MULTI_CAPTURE_COST = 25000;
const TRIPOD_COST = 3000;
const TRIPOD_MAX = 99;
const TRIPOD_RANGE = 100;             // px radius a placed tripod watches
const TRIPOD_DURATION_MS = 60 * 1000; // a placed tripod works for about a minute
const TRIPOD_SHOT_COOLDOWN_MS = 3000; // a tripod's own pace between auto-shots
const TIME_FREEZE_COST = 5000;
const TIME_FREEZE_MAX = 99;
const TIME_FREEZE_DURATION_MS = 5000;
const TIME_FREEZE_SCALE = 0.04; // how much the world slows to while frozen
const LUCKY_CHARM_COST = 7000;
const LUCKY_CHARM_MAX = 99;
const LUCKY_CHARM_DURATION_MS = 3 * 60 * 1000;
const LUCKY_CHARM_RARE_CUTOFF = 1;    // % rarity — types rarer than this are boosted
const LUCKY_CHARM_RARE_MULT = 2;      // "2x luck"

// Rainbow Event
const RAINBOW_CHECK_INTERVAL_MIN = 7; // roll once per this many minutes of play
const RAINBOW_EVENT_CHANCE = 0.01;    // 1% chance on each roll
const RAINBOW_DURATION_MS = 3 * 60 * 1000;
const RAINBOW_RARE_CUTOFF = 1;        // % rarity — types rarer than this are boosted
const RAINBOW_RARE_MULT = 3;

// Golden Event
const GOLDEN_CHECK_INTERVAL_MIN = 7; // roll once per this many minutes of play
const GOLDEN_EVENT_CHANCE = 0.01;    // 1% chance on each roll
const GOLDEN_DURATION_MS = 3 * 60 * 1000;
const GOLDEN_MONEY_MULT = 2;         // photos taken during the event pay double

// ------------------------------------------------------------------
// State
// ------------------------------------------------------------------
const state = {
  money: 0,
  shots: 0,          // total photos taken (drives luck)
  playMinutes: 0,
  dex: {},           // typeId -> { c: count, t: thumbnail dataURL | undefined }
  frameCooldowns: {},// typeId -> timestamp of last time it was the bounty
  bountyId: null,
  bountySetAt: 0,
  fasterCamera: false, // owns the Faster Camera upgrade
  multiCapture: false, // owns the Multi Capture upgrade
  tripodCount: 0,        // unplaced tripods in inventory
  timeFreezeCount: 0,    // unused Time Freezes in inventory
  luckyCharmCount: 0,    // unused Lucky Charms in inventory
  spawnCredits: null,      // available spawn "rolls"; regenerates over real time, not on reload
  lastCreditUpdate: 0    // timestamp spawnCredits was last topped up
};

// Spawns are rate-limited by a persisted, wall-clock-driven credit budget so
// reloading the page can't grant free extra spawn rolls (and thus faster
// rare-hunting) beyond what would have naturally trickled in over that time.
const SPAWN_REGEN_PER_SEC = 6; // refilling an empty screen from scratch takes a few seconds

// Placed tripods (transient — not saved, they only last about a minute anyway)
const tripods = [];
const tripodFlashes = [];

// Time Freeze: transient — not saved, it always finishes long before any reload matters
let timeFreezeUntil = 0;

// Lucky Charm: transient — not saved, it always finishes long before any reload matters
let luckUntil = 0;

// Rainbow Event: transient — not saved. rainbowUntil is a performance.now() timestamp
// (0 = inactive). rainbowCheckBlock tracks which 7-minute block of state.playMinutes
// (persisted) was last rolled, so reloading can't grant extra rolls.
let rainbowUntil = 0;
let rainbowCheckBlock = 0;

// Golden Event: transient — not saved. Rolls independently of the Rainbow
// Event on its own 7-minute blocks, same pattern as above.
let goldenUntil = 0;
let goldenCheckBlock = 0;

function loadState() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return;
    const s = JSON.parse(raw);
    Object.assign(state, s);
    if (state.bountyId && !TYPES[state.bountyId - 1]) state.bountyId = null;
  } catch (e) { /* corrupted save — start fresh */ }
}

let saveDirty = false;
let wiping = false;
function saveState(force) {
  if (wiping) return;
  if (!force && !saveDirty) return;
  saveDirty = false;
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch (e) {
    // Quota exceeded — drop oldest thumbnails and retry once.
    const ids = Object.keys(state.dex);
    for (let i = 0; i < ids.length && i < 200; i++) delete state.dex[ids[i]].t;
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); } catch (e2) {}
  }
}

// ------------------------------------------------------------------
// Spawn distribution: exactly each type's listed rarity, except the type
// currently shown in the bounty frame is 1.5x more likely to spawn.
// ------------------------------------------------------------------
let cumWeights = null, cumTotal = 0, weightsBountyId = -1, weightsRainbowActive = false, weightsLuckActive = false;

function rebuildWeights() {
  const rainbowActive = rainbowUntil > performance.now();
  const luckActive = luckUntil > performance.now();
  if (cumWeights && weightsBountyId === state.bountyId && weightsRainbowActive === rainbowActive && weightsLuckActive === luckActive) return;
  weightsBountyId = state.bountyId;
  weightsRainbowActive = rainbowActive;
  weightsLuckActive = luckActive;
  cumWeights = new Float64Array(TYPES.length);
  let acc = 0;
  for (let i = 0; i < TYPES.length; i++) {
    let w = TYPES[i].r;
    if (state.bountyId === i + 1) w *= 1.5;
    if (rainbowActive && TYPES[i].r < RAINBOW_RARE_CUTOFF) w *= RAINBOW_RARE_MULT;
    if (luckActive && TYPES[i].r < LUCKY_CHARM_RARE_CUTOFF) w *= LUCKY_CHARM_RARE_MULT;
    acc += w;
    cumWeights[i] = acc;
  }
  cumTotal = acc;
}

function sampleTypeId() {
  rebuildWeights();
  const x = Math.random() * cumTotal;
  let lo = 0, hi = cumWeights.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (cumWeights[mid] < x) lo = mid + 1; else hi = mid;
  }
  return lo + 1;
}

// ------------------------------------------------------------------
// World / stickman instances
// ------------------------------------------------------------------
let W = 0, H = 0, DPR = 1;
const stickmen = [];
const particles = [];
let nextInstId = 1;

function resize() {
  DPR = Math.min(2, window.devicePixelRatio || 1);
  W = window.innerWidth; H = window.innerHeight;
  canvas.width = Math.round(W * DPR);
  canvas.height = Math.round(H * DPR);
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
}
window.addEventListener("resize", resize);
resize();

function maxOnScreen() {
  return Math.max(12, Math.min(50, Math.round((W * H) / 22000)));
}

const MOVES = ["walk", "walk", "walk", "run", "skip", "hop", "dance"];

// King's-guard knights (and magician-conjured companions, below) live
// outside the population budget: while they're alive the count runs over
// the cap, and when they leave nothing replaces them — so they can never
// inflate the world population.
let escortAlive = 0;

function spawn(typeId, onScreen) {
  let id = typeId || sampleTypeId();
  const type = TYPES[id - 1];
  const f = getFeatures(id);
  const dir = Math.random() < 0.5 ? 1 : -1;
  const size = 0.95 + Math.random() * 0.35;
  const laneTop = 120, laneBottom = H - 15;
  const inst = {
    instId: nextInstId++,
    type, f,
    x: onScreen ? Math.random() * W : (dir === 1 ? -50 : W + 50),
    y: laneTop + Math.random() * Math.max(40, laneBottom - laneTop),
    dir, size,
    move: f.move || MOVES[(Math.random() * MOVES.length) | 0],
    phase: Math.random() * Math.PI * 2,
    baseSpeed: 35 + Math.random() * 45,
    shot: false,
    tpTimer: 0, tpAlpha: 1,
    emitTimer: Math.random() * 0.2
  };
  if (inst.move === "run") inst.baseSpeed *= 1.9;
  if (inst.move === "slow") inst.baseSpeed *= 0.45;
  if (inst.move === "hobble") inst.baseSpeed *= 0.35;
  if (inst.move === "hop") inst.baseSpeed *= 0.8;
  inst.baseSpeed *= f.speed;
  // special types
  if (type.id === 592) inst.pauseAt = 0.2 + Math.random() * 0.6; // "Pause" stops mid-screen
  stickmen.push(inst);
  if (id === 1000) startKingEvent(inst); // the Archive Itself — begin the coronation

  // King's guard: 5% of kings arrive with two knights marching in step behind
  if (id === 49 && Math.random() < 0.05) {
    for (let k = 1; k <= 2; k++) {
      const kn = spawn(30, onScreen);
      kn.escortOf = inst.instId;
      kn.escortDist = 14 + k * 16;
      kn.noRefill = true;
      escortAlive++;
      kn.dir = inst.dir;
      kn.move = "walk";
      kn.baseSpeed = inst.baseSpeed;
      kn.size = inst.size * 0.96;
      kn.x = inst.x - inst.dir * kn.escortDist;
      kn.y = inst.y + (k === 1 ? -4 : 4);
      kn.phase = inst.phase + k * 0.4;
    }
  }

  // Magician's conjuring: 5% of magicians will wave their wand and summon
  // a random companion once they wander into the middle of the screen.
  if (id === 45 && Math.random() < 0.05) {
    inst.willCast = true;
    inst.castAt = 0.4 + Math.random() * 0.2; // trigger fraction, centered on mid-screen
  }
  return inst;
}

function instHeight(inst) {
  const f = inst.f, s = inst.size * f.size;
  return (14.5 * f.legLen + 12 * f.bodyLen + 11 * f.headScale + 6) * s;
}

function emitTrail(inst, dt) {
  if (!inst.f.trail || particles.length > 240) return;
  inst.emitTimer -= dt;
  if (inst.emitTimer > 0) return;
  inst.emitTimer = 0.12;
  const kind = inst.f.trail;
  const p = {
    x: inst.x - inst.dir * 6, y: inst.y - 2, kind,
    life: 1, vx: -inst.dir * 8, vy: 0, r: 2 + Math.random() * 2
  };
  if (kind === "fire") { p.vy = -22; p.life = 0.6; }
  if (kind === "spark") { p.vx = (Math.random() - 0.5) * 40; p.vy = -Math.random() * 30; p.life = 0.5; }
  if (kind === "snow") { p.vy = 12; p.y = inst.y - instHeight(inst) * 0.7; p.life = 0.9; }
  if (kind === "bubble") { p.vy = -14; p.life = 0.9; }
  if (kind === "rainbow") { p.vy = 0; p.vx = 0; p.life = 0.8; p.hue = (performance.now() / 4) % 360; }
  if (kind === "star" || kind === "print" || kind === "glowpath") { p.vx = 0; p.vy = 0; p.life = 0.9; }
  if (kind === "road") { p.vx = 0; p.vy = 0; p.life = 1.3; p.r = 5 + Math.random() * 1.5; }
  if (kind === "blacksmoke") { // curls up off the whole body
    p.y = inst.y - 4 - Math.random() * instHeight(inst) * 0.8;
    p.vx = -inst.dir * 4 + (Math.random() - 0.5) * 12;
    p.vy = -10 - Math.random() * 8;
    p.life = 0.85; p.r = 1.6 + Math.random() * 2.2;
  }
  if (kind === "candy") { p.vx = 0; p.vy = 0; p.life = 1.0; p.hue = Math.random() * 360; }
  if (kind === "choco") { p.vx = 0; p.vy = 0; p.life = 1.4; p.r = 3 + Math.random() * 2; }
  if (kind === "cards") { p.vx = 0; p.vy = 0; p.life = 0.9; p.pip = Math.random() < 0.5; }
  if (kind === "domino") { p.vx = 0; p.vy = 0; p.life = 1.3; }
  if (kind === "crack") { p.vx = 0; p.vy = 0; p.life = 1.1; p.rot = Math.random() * Math.PI; }
  if (kind === "photo") { p.vx = 0; p.vy = 18; p.life = 1.1; p.rot = (Math.random() - 0.5) * 0.6; }
  if (kind === "toast") { p.vx = -inst.dir * 6 + (Math.random() - 0.5) * 10; p.vy = -26 - Math.random() * 10; p.life = 0.6; }
  if (kind === "mist") { p.vx = (Math.random() - 0.5) * 6; p.vy = -6 - Math.random() * 6; p.life = 0.8; p.r = 2 + Math.random() * 2.5; }
  if (kind === "clean") { p.vx = 0; p.vy = 0; p.life = 0.5; p.rot = Math.random() * Math.PI; }
  if (kind === "confetti") { p.vx = (Math.random() - 0.5) * 30; p.vy = -20 - Math.random() * 12; p.life = 0.7; p.hue = Math.random() * 360; }
  if (kind === "ink") { p.vx = 0; p.vy = 8 + Math.random() * 6; p.life = 0.9; p.r = 1.5 + Math.random() * 1.8; }
  particles.push(p);
}

function drawParticles(dt, t) {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.life -= dt;
    if (p.life <= 0) { particles.splice(i, 1); continue; }
    p.x += p.vx * dt; p.y += p.vy * dt;
    const a = Math.max(0, Math.min(1, p.life));
    ctx.globalAlpha = a * 0.8;
    switch (p.kind) {
      case "fire": ctx.fillStyle = "#ff7043"; break;
      case "spark": ctx.fillStyle = "#fbc02d"; break;
      case "snow": ctx.fillStyle = "#90caf9"; break;
      case "bubble": ctx.strokeStyle = "#64b5f6"; break;
      case "rainbow": ctx.fillStyle = `hsl(${p.hue}, 90%, 55%)`; break;
      case "star": ctx.fillStyle = "#fbc02d"; break;
      case "print": ctx.fillStyle = "#bdbdbd"; break;
      case "glowpath": ctx.fillStyle = "#ffe082"; break;
      case "blacksmoke": ctx.fillStyle = "#1c1c1c"; break;
      case "dust": ctx.fillStyle = "#c9c2b8"; break;
      case "road": ctx.fillStyle = "#616161"; break;
      case "candy": ctx.fillStyle = `hsl(${p.hue}, 80%, 58%)`; break;
      case "choco": ctx.fillStyle = "#5d4037"; break;
      case "cards": ctx.fillStyle = "#fff"; break;
      case "domino": ctx.fillStyle = "#fdf6e3"; break;
      case "crack": ctx.strokeStyle = "#b71c1c"; break;
      case "photo": ctx.fillStyle = "#fff"; break;
      case "toast": ctx.fillStyle = "#d7a458"; break;
      case "mist": ctx.fillStyle = "#e0f7fa"; break;
      case "clean": ctx.strokeStyle = "#fff59d"; break;
      case "confetti": ctx.fillStyle = `hsl(${p.hue}, 85%, 60%)`; break;
      case "ink": ctx.fillStyle = "#0d0d0d"; break;
      default: ctx.fillStyle = "#999";
    }
    if (p.kind === "bubble") {
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.stroke();
    } else if (p.kind === "star") {
      starPath(ctx, p.x, p.y, p.r + 1); ctx.fill();
    } else if (p.kind === "print") {
      ctx.fillRect(p.x - 2, p.y - 1, 4, 2);
    } else if (p.kind === "road") {
      ctx.fillRect(p.x - p.r, p.y - 1.6, p.r * 2, 3.2);
      ctx.fillStyle = "#fdd835";
      ctx.fillRect(p.x - p.r * 0.35, p.y - 0.5, p.r * 0.7, 1);
    } else if (p.kind === "candy") {
      ctx.fillRect(p.x - 2, p.y - 1.4, 4, 2.8);
      ctx.beginPath();
      ctx.moveTo(p.x - 2, p.y); ctx.lineTo(p.x - 3.3, p.y - 1); ctx.lineTo(p.x - 3.3, p.y + 1); ctx.closePath();
      ctx.moveTo(p.x + 2, p.y); ctx.lineTo(p.x + 3.3, p.y - 1); ctx.lineTo(p.x + 3.3, p.y + 1); ctx.closePath();
      ctx.fill();
    } else if (p.kind === "choco") {
      ctx.beginPath(); ctx.ellipse(p.x, p.y, p.r * 1.6, p.r * 0.6, 0, 0, Math.PI * 2); ctx.fill();
    } else if (p.kind === "cards") {
      ctx.strokeStyle = "#9e9e9e";
      ctx.fillRect(p.x - 2, p.y - 2.8, 4, 5.6); ctx.strokeRect(p.x - 2, p.y - 2.8, 4, 5.6);
      ctx.fillStyle = p.pip ? "#c62828" : "#212121";
      ctx.beginPath(); ctx.arc(p.x, p.y, 0.9, 0, Math.PI * 2); ctx.fill();
    } else if (p.kind === "domino") {
      ctx.strokeStyle = "#bcaaa4";
      ctx.fillRect(p.x - 1.6, p.y - 3, 3.2, 6); ctx.strokeRect(p.x - 1.6, p.y - 3, 3.2, 6);
      ctx.fillStyle = "#212121";
      ctx.beginPath(); ctx.arc(p.x, p.y - 1.2, 0.5, 0, Math.PI * 2); ctx.arc(p.x, p.y + 1.2, 0.5, 0, Math.PI * 2); ctx.fill();
    } else if (p.kind === "crack") {
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(-4, -3); ctx.lineTo(-1, 0); ctx.lineTo(-2.5, 2); ctx.lineTo(0, 1); ctx.lineTo(3, 4);
      ctx.stroke();
      ctx.restore();
    } else if (p.kind === "photo") {
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
      ctx.fillRect(-2.4, -3, 4.8, 6); ctx.strokeStyle = "#bdbdbd"; ctx.strokeRect(-2.4, -3, 4.8, 6);
      ctx.fillStyle = "#90caf9"; ctx.fillRect(-1.8, -2.4, 3.6, 3.2);
      ctx.restore();
    } else if (p.kind === "toast") {
      ctx.beginPath();
      ctx.moveTo(p.x - 2, p.y + 2); ctx.lineTo(p.x - 2, p.y - 1);
      ctx.quadraticCurveTo(p.x, p.y - 3, p.x + 2, p.y - 1);
      ctx.lineTo(p.x + 2, p.y + 2); ctx.closePath(); ctx.fill();
    } else if (p.kind === "mist") {
      ctx.globalAlpha *= 0.5;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
    } else if (p.kind === "clean") {
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(-3, 0); ctx.lineTo(3, 0); ctx.moveTo(0, -3); ctx.lineTo(0, 3); ctx.stroke();
      ctx.restore();
    } else if (p.kind === "confetti") {
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.x * 0.3);
      ctx.fillRect(-1.6, -1, 3.2, 2);
      ctx.restore();
    } else if (p.kind === "ink") {
      ctx.beginPath(); ctx.ellipse(p.x, p.y, p.r * 0.6, p.r, 0, 0, Math.PI * 2); ctx.fill();
    } else {
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
    }
  }
  ctx.globalAlpha = 1;
}

// ------------------------------------------------------------------
// Dimension portals (for the Dimension Walker): swirling rifts that a
// walker opens, vanishes into, and re-emerges from further along.
// ------------------------------------------------------------------
const portals = [];

function spawnPortal(x, y, ry) {
  const p = { x, y, r: 0, targ: ry, closing: false };
  portals.push(p);
  return p;
}

function updatePortals(dt) {
  for (let i = portals.length - 1; i >= 0; i--) {
    const p = portals[i];
    p.r += ((p.closing ? 0 : p.targ) - p.r) * Math.min(1, dt * 6);
    if (p.closing && p.r < 0.6) portals.splice(i, 1);
  }
}

function drawPortals(t) {
  for (const p of portals) {
    if (p.r < 0.8) continue;
    const rx = p.r * 0.36, ry = p.r;
    ctx.save();
    ctx.translate(p.x, p.y - p.r); // bottom edge sits on the walker's baseline
    ctx.shadowColor = "#7c4dff"; ctx.shadowBlur = 14;
    ctx.fillStyle = "#140433";
    ctx.beginPath(); ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = "#b388ff";
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = "#7c4dffaa";
    ctx.lineWidth = 1.4;
    for (const k of [0, 1]) { // inner swirl arcs
      const a = t * 3.2 + k * Math.PI;
      ctx.beginPath(); ctx.ellipse(0, 0, rx * 0.55, ry * 0.62, 0, a, a + 1.9); ctx.stroke();
    }
    ctx.restore();
  }
}

// ------------------------------------------------------------------
// The Archive Itself (#1000): a one-in-a-billion coronation. The screen
// blacks out; when the lights rise, every other stickman is kneeling
// before the floating king, and the world only resumes once he drifts
// off the far edge of the screen.
// ------------------------------------------------------------------
let kingEvent = null; // { king, t } while the coronation is running
const kingFlash = document.createElement("div");
kingFlash.id = "king-flash";
kingFlash.style.cssText =
  "position:fixed;inset:0;background:#000;opacity:0;pointer-events:none;z-index:150;";
document.body.appendChild(kingFlash);

function kneel(s) {
  if (s.kneeling) return;
  s.kneeling = true;
  s.preKingMove = s.move;
  s.move = "kneel";
  // keep whatever direction they were already facing — never turn toward the king
}

function startKingEvent(king) {
  if (kingEvent) return;
  kingEvent = { king, t: 0 };
  king.isKing = true;
  king.move = "kingfloat";
  king.dir = 1;                      // always cross rightward so the sign reads upright
  king.size = 1.7;                   // towering over the court
  king.baseSpeed = 60;               // a slow, majestic drift
  king.x = W * 0.16;                 // step in from the left while the screen is black
  king.y = Math.max(150, H * 0.42);  // float above the kneeling crowd
  for (const s of stickmen) if (s !== king) kneel(s);
}

function endKingEvent() {
  if (!kingEvent) return;
  for (const s of stickmen) {
    if (s.kneeling) { s.move = s.preKingMove || "walk"; s.kneeling = false; }
  }
  kingEvent = null;
  kingFlash.style.opacity = "0";
}

function updateKingFlash(dt) {
  if (!kingEvent) return;
  kingEvent.t += dt;
  const et = kingEvent.t;
  let a = 0;
  if (et < 0.35) a = et / 0.35;                     // snap to black
  else if (et < 1.05) a = 1;                        // hold while the court is arranged
  else if (et < 1.75) a = 1 - (et - 1.05) / 0.7;    // lights rise on the kneeling crowd
  kingFlash.style.opacity = String(Math.max(0, a));
}

// ------------------------------------------------------------------
// Rainbow Event: every RAINBOW_CHECK_INTERVAL_MIN minutes of play, a
// RAINBOW_EVENT_CHANCE chance the map starts glowing and rare stickmen get
// a spawn-weight boost for RAINBOW_DURATION_MS, shown as a bottom timer.
// ------------------------------------------------------------------
function startRainbowEvent(now) {
  rainbowUntil = now + RAINBOW_DURATION_MS;
  document.body.classList.add("rainbow-event");
  els.rainbowTimer.classList.remove("hidden");
}

function endRainbowEvent() {
  rainbowUntil = 0;
  document.body.classList.remove("rainbow-event");
  els.rainbowTimer.classList.add("hidden");
}

function updateRainbowEvent(now) {
  const block = Math.floor(state.playMinutes / RAINBOW_CHECK_INTERVAL_MIN);
  if (block > rainbowCheckBlock) {
    rainbowCheckBlock = block;
    if (!rainbowUntil && Math.random() < RAINBOW_EVENT_CHANCE) startRainbowEvent(now);
  }

  if (rainbowUntil) {
    const remain = rainbowUntil - now;
    if (remain <= 0) {
      endRainbowEvent();
    } else {
      els.rainbowTimerFill.style.width = (Math.max(0, Math.min(1, remain / RAINBOW_DURATION_MS)) * 100) + "%";
      const secs = Math.ceil(remain / 1000);
      els.rainbowTimerTime.textContent = Math.floor(secs / 60) + ":" + String(secs % 60).padStart(2, "0");
    }
  }
}

// ------------------------------------------------------------------
// Golden Event: every GOLDEN_CHECK_INTERVAL_MIN minutes of play, a
// GOLDEN_EVENT_CHANCE chance the map turns gold and photos taken during it
// pay GOLDEN_MONEY_MULT money, shown as a bottom timer.
// ------------------------------------------------------------------
function startGoldenEvent(now) {
  goldenUntil = now + GOLDEN_DURATION_MS;
  document.body.classList.add("golden-event");
  els.goldenTimer.classList.remove("hidden");
}

function endGoldenEvent() {
  goldenUntil = 0;
  document.body.classList.remove("golden-event");
  els.goldenTimer.classList.add("hidden");
}

function updateGoldenEvent(now) {
  const block = Math.floor(state.playMinutes / GOLDEN_CHECK_INTERVAL_MIN);
  if (block > goldenCheckBlock) {
    goldenCheckBlock = block;
    if (!goldenUntil && Math.random() < GOLDEN_EVENT_CHANCE) startGoldenEvent(now);
  }

  if (goldenUntil) {
    const remain = goldenUntil - now;
    if (remain <= 0) {
      endGoldenEvent();
    } else {
      els.goldenTimerFill.style.width = (Math.max(0, Math.min(1, remain / GOLDEN_DURATION_MS)) * 100) + "%";
      const secs = Math.ceil(remain / 1000);
      els.goldenTimerTime.textContent = Math.floor(secs / 60) + ":" + String(secs % 60).padStart(2, "0");
    }
  }
}

let nextTripAt = 25 + Math.random() * 45; // runtime seconds until the next possible trip

function updateWorld(dt, t) {
  updateKingFlash(dt);
  const max = maxOnScreen();
  // escorts don't count toward the cap, and aren't replaced when they leave.
  // (population is frozen during the coronation — nobody new wanders in.)
  state.spawnCredits = Math.min(max, state.spawnCredits + dt * SPAWN_REGEN_PER_SEC);
  state.lastCreditUpdate = Date.now(); // keep in sync with wall clock for the next reload's elapsed-time check
  if (!kingEvent && stickmen.length - escortAlive < max && state.spawnCredits >= 1) {
    state.spawnCredits--;
    spawn(null, false); // refill one per frame, staggered, budget permitting
  }

  // ---- very rarely, a plain Circle trips over another stickman or the ground ----
  if (!kingEvent && t >= nextTripAt) {
    const candidates = stickmen.filter(s =>
      s.type.id === 1 && !s.tripping && s.move === "walk" &&
      s.x > 40 && s.x < W - 40);
    if (candidates.length) {
      nextTripAt = t + 50 + Math.random() * 80;
      // prefer a circle that's touching someone — it trips over them
      let victim = null;
      outer:
      for (const c of candidates) {
        for (const o of stickmen) {
          if (o !== c && Math.abs(o.x - c.x) < 10 && Math.abs(o.y - c.y) < 9) { victim = c; break outer; }
        }
      }
      victim = victim || candidates[(Math.random() * candidates.length) | 0];
      victim.tripping = true;
      victim.tripT = 0;
      victim.tripDust = false;
      victim.preTripMove = victim.move;
      victim.move = "trip";
    } else {
      nextTripAt = t + 6; // nobody suitable mid-screen — check again soon
    }
  }

  for (let i = stickmen.length - 1; i >= 0; i--) {
    const s = stickmen[i];

    // during the coronation, everyone but the king is frozen kneeling
    // (facing whatever way they already were — they never turn)
    if (kingEvent && s !== kingEvent.king) {
      kneel(s);
      continue;
    }

    let speed = s.baseSpeed;

    if (s.pauseAt !== undefined) { // "Pause" — stands still until photographed
      const frac = s.x / W;
      if (!s.shot && ((s.dir === 1 && frac >= s.pauseAt) || (s.dir === -1 && frac <= s.pauseAt))) speed = 0;
    }
    if (s.tripping) {
      s.tripT += dt / 2.6; // full stumble-fall-recover cycle ≈ 2.6s
      if (s.tripT >= 1) {
        s.tripping = false;
        s.move = s.preTripMove;
      } else if (s.tripT < 0.18) {
        speed *= 1.5; // stumbling lurch forward
      } else {
        speed = 0;    // on the ground / getting up
        if (!s.tripDust && s.tripT > 0.4) { // dust puff on impact
          s.tripDust = true;
          for (let d = 0; d < 5; d++) {
            particles.push({
              x: s.x + s.dir * (8 + Math.random() * 16), y: s.y - 1, kind: "dust",
              life: 0.45 + Math.random() * 0.3,
              vx: (Math.random() - 0.5) * 34, vy: -6 - Math.random() * 16,
              r: 1.5 + Math.random() * 2
            });
          }
        }
      }
    }
    if (s.willCast && !s.castDone) { // magician: wait until mid-screen, then wave the wand
      const frac = s.x / W;
      if ((s.dir === 1 && frac >= s.castAt) || (s.dir === -1 && frac <= s.castAt)) {
        s.castDone = true;
        s.castTimer = 0.5; // brief pause to wave the wand
      }
    }
    if (s.castTimer > 0) {
      speed = 0;
      s.castTimer -= dt;
      if (particles.length < 240) { // sparkle burst while the wand waves
        particles.push({
          x: s.x + s.dir * 8, y: s.y - instHeight(s) * 0.6 + (Math.random() - 0.5) * 10,
          kind: "star", life: 0.4 + Math.random() * 0.3,
          vx: (Math.random() - 0.5) * 20, vy: -10 - Math.random() * 14,
          r: 1.5 + Math.random() * 2
        });
      }
      if (s.castTimer <= 0) { // the flash: a random companion appears beside the magician
        const conjured = spawn(null, true);
        conjured.x = s.x - s.dir * 18;
        conjured.y = s.y;
        conjured.dir = Math.random() < 0.5 ? 1 : -1;
        conjured.noRefill = true;
        escortAlive++;
      }
    }
    if (s.escortOf) { // knight guard: hold formation behind the king
      const king = stickmen.find(o => o.instId === s.escortOf);
      if (king) {
        s.dir = king.dir;
        const targetX = king.x - king.dir * s.escortDist;
        s.x += (targetX - s.x) * Math.min(1, dt * 2.5);
      } else {
        s.escortOf = null; // king left the map — march on and exit
      }
    }
    if (s.f.dimWalk && !s.escortOf) { // Dimension Walker: portal-hop cycle
      if (!s.dwState) { s.dwState = "walk"; s.dwT = 4 + Math.random() * 5; s.dwAlpha = 1; }
      if (s.dwState === "walk") {
        if (s.dwAlpha < 1) s.dwAlpha = Math.min(1, s.dwAlpha + dt * 2.5);
        s.dwT -= dt;
        if (s.dwT <= 0 && s.x > 70 && s.x < W - 70) {
          s.dwPortal = spawnPortal(s.x + s.dir * 30, s.y, instHeight(s) * 0.62);
          s.dwState = "enter";
        }
      } else if (s.dwState === "enter") { // walks into the rift, fading as it overlaps
        const d = (s.dwPortal.x - s.x) * s.dir;
        s.dwAlpha = Math.max(0, Math.min(1, d / 16));
        if (d <= -4) {
          s.dwState = "gone";
          s.dwT = 0.9 + Math.random() * 0.9;
          s.dwAlpha = 0;
          s.dwPortal.closing = true;
        }
      } else if (s.dwState === "gone") { // between dimensions
        speed = 0;
        s.dwT -= dt;
        if (s.dwT <= 0) {
          s.x += s.dir * (70 + Math.random() * 150);
          if (s.x > 20 && s.x < W - 20) {
            s.dwPortal2 = spawnPortal(s.x, s.y, instHeight(s) * 0.62);
            s.dwState = "exit";
          } else { // stepped out past the edge of the world — just fade back in
            s.dwState = "walk";
            s.dwT = 5;
          }
        }
      } else if (s.dwState === "exit") { // steps back out once the portal reopens
        if (s.dwPortal2.r < s.dwPortal2.targ * 0.75) {
          speed = 0;
        } else {
          s.dwAlpha = Math.min(1, s.dwAlpha + dt * 2.5);
        }
        if (s.dwAlpha >= 1 && (s.x - s.dwPortal2.x) * s.dir > 16) {
          s.dwPortal2.closing = true;
          s.dwState = "walk";
          s.dwT = 5 + Math.random() * 6;
        }
      }
    }
    if (s.move === "teleport") {
      s.tpTimer -= dt;
      if (s.tpTimer <= 0) {
        s.tpTimer = 1.2 + Math.random() * 1.2;
        s.x += s.dir * (40 + Math.random() * 70);
        s.tpAlpha = 0;
      }
      s.tpAlpha = Math.min(1, (s.tpAlpha || 0) + dt * 3);
    }

    s.x += s.dir * speed * dt;
    s.phase += dt * (speed * 0.16 + 2.2);
    emitTrail(s, dt);

    const off = s.dir === 1 ? s.x > W + 60 : s.x < -60;
    if (off) {
      if (s.type.id === 350 && !s.shot) { // "The Eternal" never leaves until photographed
        s.x = s.dir === 1 ? -50 : W + 50;
      } else {
        if (s.isKing) endKingEvent();  // the king has left — the world resumes
        if (s.noRefill) escortAlive--; // escort slot vanishes with the knight
        if (s.dwPortal) s.dwPortal.closing = true;   // don't strand open rifts
        if (s.dwPortal2) s.dwPortal2.closing = true;
        stickmen.splice(i, 1);
      }
    }
  }
}

// ------------------------------------------------------------------
// Bounty frame
// ------------------------------------------------------------------
function pickBounty() {
  const now = Date.now();
  const K = 8 + Math.min(42, Math.floor(state.playMinutes));
  let best = null;
  for (let i = 0; i < K; i++) {
    const id = sampleTypeId();
    const last = state.frameCooldowns[id] || 0;
    if (now - last < FRAME_COOLDOWN_MS) continue;
    if (!best || TYPES[id - 1].r < TYPES[best - 1].r) best = id;
  }
  if (!best) best = 1;
  state.bountyId = best;
  state.bountySetAt = now;
  state.frameCooldowns[best] = now;
  // prune old cooldown entries
  for (const k of Object.keys(state.frameCooldowns)) {
    if (now - state.frameCooldowns[k] > FRAME_COOLDOWN_MS) delete state.frameCooldowns[k];
  }
  saveDirty = true;
  renderBounty();
}

function renderBounty() {
  if (!state.bountyId) return;
  const fc = els.frameCanvas;
  const c = drawPortrait(state.bountyId, fc.width, fc.height);
  const fctx = fc.getContext("2d");
  fctx.clearRect(0, 0, fc.width, fc.height);
  fctx.drawImage(c, 0, 0);
  els.frame.classList.remove("showing-photo");
  els.frame.title = "Bounty: photograph this stickman for x20 money!";
}

// ------------------------------------------------------------------
// Camera
// ------------------------------------------------------------------
let cameraMode = false;
let vfX = 0, vfY = 0;
const SHOT_COOLDOWN_MS = 3000;
let lastShotAt = -Infinity;
let burstShotsUsed = 0; // Faster Camera: shots fired since the burst last refilled

// With the Faster Camera upgrade, 3 shots can be fired with no cooldown between
// them; the cooldown only kicks in once the burst is spent, then refills.
function shotCooldownLeft() {
  if (state.fasterCamera) {
    if (burstShotsUsed < 3) return 0;
    const left = SHOT_COOLDOWN_MS - (performance.now() - lastShotAt);
    if (left <= 0) { burstShotsUsed = 0; return 0; }
    return left;
  }
  return SHOT_COOLDOWN_MS - (performance.now() - lastShotAt);
}

function registerShotCooldown() {
  if (state.fasterCamera) {
    burstShotsUsed++;
    if (burstShotsUsed >= 3) {
      lastShotAt = performance.now();
      els.viewfinder.classList.add("cooling");
      setTimeout(() => els.viewfinder.classList.remove("cooling"), SHOT_COOLDOWN_MS);
    }
  } else {
    lastShotAt = performance.now();
    els.viewfinder.classList.add("cooling");
    setTimeout(() => els.viewfinder.classList.remove("cooling"), SHOT_COOLDOWN_MS);
  }
}

function setViewfinder(x, y) {
  vfX = x; vfY = y;
  const r = els.viewfinder.getBoundingClientRect();
  els.viewfinder.style.left = (x - r.width / 2) + "px";
  els.viewfinder.style.top = (y - r.height / 2) + "px";
}

function toggleCamera(on) {
  cameraMode = on === undefined ? !cameraMode : on;
  document.body.classList.toggle("camera-mode", cameraMode);
  els.cameraBtn.classList.toggle("active", cameraMode);
  els.viewfinder.classList.toggle("hidden", !cameraMode);
  els.cameraHint.classList.toggle("hidden", !cameraMode);
  if (cameraMode) setViewfinder(vfX || W / 2, vfY || H / 2);
}

function snapshotRegion(x, y, w, h, focus) {
  const out = document.createElement("canvas");
  out.width = 320; out.height = Math.round(320 * h / w);
  const octx = out.getContext("2d");
  const scale = out.width / w;
  const t = performance.now() / 1000;
  octx.fillStyle = "#fff";
  octx.fillRect(0, 0, out.width, out.height);
  // render everyone EXCEPT the subject to a separate layer, then blur it —
  // this keeps the subject completely out of the blurred background
  const pad = 10; // margin so the blur fades cleanly at the photo edges
  const tmp = document.createElement("canvas");
  tmp.width = Math.round((w + pad * 2) * scale);
  tmp.height = Math.round((h + pad * 2) * scale);
  const tctx = tmp.getContext("2d");
  tctx.scale(scale, scale);
  tctx.translate(-(x - pad), -(y - pad));
  for (const s of stickmen) {
    if (s !== focus) drawStickman(tctx, s, t);
  }
  octx.filter = "blur(3px)";
  octx.drawImage(tmp, -pad * scale, -pad * scale);
  octx.filter = "none";
  // the subject, sharp and untouched on top
  if (focus) {
    octx.save();
    octx.scale(scale, scale);
    octx.translate(-x, -y);
    drawStickman(octx, focus, t);
    octx.restore();
  }
  return out.toDataURL("image/jpeg", 0.72);
}

function makeThumb(dataURL, cb) {
  const img = new Image();
  img.onload = () => {
    const c = document.createElement("canvas");
    c.width = 160; c.height = 120;
    const cctx = c.getContext("2d");
    cctx.fillStyle = "#fff"; cctx.fillRect(0, 0, 160, 120);
    cctx.drawImage(img, 0, 0, 160, 120);
    cb(c.toDataURL("image/jpeg", 0.6));
  };
  img.src = dataURL;
}

function takePhoto() {
  const cdLeft = shotCooldownLeft();
  if (cdLeft > 0) {
    showToast(`Camera recharging… ${(cdLeft / 1000).toFixed(1)}s`);
    return;
  }

  const vf = els.viewfinder.getBoundingClientRect();
  const rx = vf.left, ry = vf.top, rw = vf.width, rh = vf.height;

  els.flash.classList.remove("go");
  void els.flash.offsetWidth;
  els.flash.classList.add("go");

  // find stickmen whose body box overlaps the viewfinder
  const captured = [];
  for (const s of stickmen) {
    const hgt = instHeight(s);
    const halfW = hgt * 0.45;
    if (s.x + halfW > rx && s.x - halfW < rx + rw &&
        s.y > ry && s.y - hgt < ry + rh) {
      captured.push(s);
    }
  }
  const fresh = captured.filter(s => !s.shot);

  if (fresh.length === 0) {
    showToast(captured.length
      ? "Already photographed — find a new one!"
      : "No stickman in frame!");
    return;
  }

  registerShotCooldown();

  // the focus: bounty type if in frame, else the rarest fresh stickman.
  // Only the focus is photographed — everyone else is blurred background.
  const bountyHit = state.bountyId ? fresh.find(s => s.type.id === state.bountyId) : null;
  const focus = bountyHit || fresh.reduce((a, s) => (s.type.r < a.type.r ? s : a), fresh[0]);

  const photoURL = snapshotRegion(rx, ry, rw, rh, focus);
  state.shots++;

  const valueType = focus.type;

  // Multi Capture: every fresh stickman in frame pays out, not just the
  // focus. Only the focus is ever recorded in the Stickdex either way.
  const payers = state.multiCapture ? fresh : [focus];
  let gained = 0;
  for (const s of payers) {
    gained += state.bountyId && s.type.id === state.bountyId ? s.type.value * 20 : s.type.value;
    s.shot = true;
  }
  if (goldenUntil > performance.now()) gained *= GOLDEN_MONEY_MULT;
  state.money += gained;

  let newType = false;
  if (!state.dex[valueType.id]) { state.dex[valueType.id] = { c: 0 }; newType = true; }
  state.dex[valueType.id].c++;
  makeThumb(photoURL, thumb => {
    const e = state.dex[valueType.id];
    if (e && !e.t) e.t = thumb;
    saveDirty = true;
  });

  updateMoneyDisplay(true);
  saveDirty = true;

  const others = captured.length - 1;
  const paidOthers = payers.length - 1;
  let othersMsg = "";
  if (state.multiCapture && paidOthers > 0) {
    othersMsg = ` <small>+${paidOthers} more counted for money</small>`;
  } else if (others > 0) {
    othersMsg = ` <small>+${others} in the background</small>`;
  }
  showToast(
    `<span class="t-money">+${formatMoney(gained)}</span><br>` +
    (bountyHit ? `<span class="t-bounty">BOUNTY x20!</span> ` : "") +
    `${valueType.name} <small>(${formatRarity(valueType.r)})</small>` +
    othersMsg +
    (newType ? `<br><span class="t-new">NEW Stickdex entry!</span>` : "")
  );

  playFrameAnimation(photoURL, !!bountyHit);
}

function playFrameAnimation(photoURL, bountyCaptured) {
  els.framePhoto.src = photoURL;
  els.frame.classList.add("showing-photo");
  els.frameTick.classList.remove("stamp");
  void els.frameTick.offsetWidth;
  els.frameTick.classList.add("stamp");

  setTimeout(() => {
    const frameRect = els.frame.getBoundingClientRect();
    const folderRect = els.folderBtn.getBoundingClientRect();
    const fly = document.createElement("img");
    fly.className = "fly-photo";
    fly.src = photoURL;
    fly.style.left = frameRect.left + "px";
    fly.style.top = frameRect.top + "px";
    fly.style.width = frameRect.width + "px";
    fly.style.height = frameRect.height + "px";
    document.body.appendChild(fly);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      fly.style.left = (folderRect.left + folderRect.width / 2 - 8) + "px";
      fly.style.top = (folderRect.top + folderRect.height / 2 - 8) + "px";
      fly.style.width = "16px";
      fly.style.height = "16px";
      fly.style.opacity = "0.2";
    }));
    setTimeout(() => {
      fly.remove();
      els.frameTick.classList.remove("stamp");
      if (bountyCaptured || Date.now() - state.bountySetAt > BOUNTY_TIMEOUT_MS) {
        pickBounty();
      } else {
        renderBounty();
      }
    }, 900);
  }, 700);
}

let toastTimer = 0;
function showToast(html) {
  els.toast.innerHTML = html;
  els.toast.classList.remove("hidden");
  els.toast.style.animation = "none";
  void els.toast.offsetWidth;
  els.toast.style.animation = "";
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => els.toast.classList.add("hidden"), 2200);
}

function updateMoneyDisplay(pop) {
  const txt = formatMoney(state.money);
  els.money.textContent = txt;
  els.dexMoney.textContent = txt;
  if (pop) {
    els.money.classList.remove("pop");
    void els.money.offsetWidth;
    els.money.classList.add("pop");
  }
}

// ------------------------------------------------------------------
// Stickdex
// ------------------------------------------------------------------
function openDex() {
  if (cameraMode) toggleCamera(false);
  closeShop();
  cancelTripodMode();
  buildDex();
  els.stickdex.classList.remove("hidden");
}
function closeDex() { els.stickdex.classList.add("hidden"); }

function buildDex() {
  const found = Object.keys(state.dex).map(Number);
  els.dexCount.textContent = `${found.length}/???`;
  updateMoneyDisplay(false);
  els.dexGrid.innerHTML = "";
  if (found.length === 0) {
    const d = document.createElement("div");
    d.id = "dex-empty";
    d.textContent = "No stickmen photographed yet. Grab the camera and start hunting!";
    els.dexGrid.appendChild(d);
    return;
  }
  // most common at the start, rarest at the end
  found.sort((a, b) => (TYPES[b - 1].r - TYPES[a - 1].r) || (a - b));
  const frag = document.createDocumentFragment();
  for (const id of found) {
    const type = TYPES[id - 1];
    const e = state.dex[id];
    const card = document.createElement("div");
    card.className = "dex-card";
    if (e.t) {
      const img = document.createElement("img");
      img.src = e.t;
      img.loading = "lazy";
      card.appendChild(img);
    } else {
      card.appendChild(drawPortrait(id, 160, 120));
    }
    const info = document.createElement("div");
    info.className = "dex-info";
    info.innerHTML =
      `<div class="dex-num">#${id}</div>` +
      `<div class="dex-name"></div>` +
      `<div class="dex-rarity">${formatRarity(type.r)}</div>` +
      `<div class="dex-desc"></div>` +
      `<div class="dex-photo-count">📷 ${e.c}</div>`;
    info.querySelector(".dex-name").textContent = type.name;
    info.querySelector(".dex-desc").textContent = type.desc;
    card.appendChild(info);
    frag.appendChild(card);
  }
  els.dexGrid.appendChild(frag);
}

// ------------------------------------------------------------------
// Shop
// ------------------------------------------------------------------
function openShop() {
  if (cameraMode) toggleCamera(false);
  cancelTripodMode();
  buildShop();
  els.shop.classList.remove("hidden");
}
function closeShop() { els.shop.classList.add("hidden"); }

function buildShop() {
  updateMoneyDisplay(false);
  els.shopMoney.textContent = formatMoney(state.money);

  if (state.fasterCamera) {
    els.buyFasterCam.textContent = "Owned";
    els.buyFasterCam.disabled = true;
    els.buyFasterCam.classList.add("owned");
  } else {
    els.buyFasterCam.textContent = formatMoney(FASTER_CAMERA_COST);
    els.buyFasterCam.disabled = state.money < FASTER_CAMERA_COST;
    els.buyFasterCam.classList.remove("owned");
  }

  if (state.multiCapture) {
    els.buyMultiCapture.textContent = "Owned";
    els.buyMultiCapture.disabled = true;
    els.buyMultiCapture.classList.add("owned");
  } else {
    els.buyMultiCapture.textContent = formatMoney(MULTI_CAPTURE_COST);
    els.buyMultiCapture.disabled = state.money < MULTI_CAPTURE_COST;
    els.buyMultiCapture.classList.remove("owned");
  }

  els.tripodOwnedCount.textContent = state.tripodCount;
  els.buyTripod.textContent = formatMoney(TRIPOD_COST);
  els.buyTripod.disabled = state.money < TRIPOD_COST || state.tripodCount >= TRIPOD_MAX;

  els.timefreezeOwnedCount.textContent = state.timeFreezeCount;
  els.buyTimefreeze.textContent = formatMoney(TIME_FREEZE_COST);
  els.buyTimefreeze.disabled = state.money < TIME_FREEZE_COST || state.timeFreezeCount >= TIME_FREEZE_MAX;

  els.luckyCharmOwnedCount.textContent = state.luckyCharmCount;
  els.buyLuckyCharm.textContent = formatMoney(LUCKY_CHARM_COST);
  els.buyLuckyCharm.disabled = state.money < LUCKY_CHARM_COST || state.luckyCharmCount >= LUCKY_CHARM_MAX;

  updateTripodInvBadge();
  updateTimefreezeInvBadge();
  updateLuckyCharmInvBadge();
}

els.buyFasterCam.addEventListener("click", () => {
  if (state.fasterCamera || state.money < FASTER_CAMERA_COST) return;
  state.money -= FASTER_CAMERA_COST;
  state.fasterCamera = true;
  saveDirty = true;
  buildShop();
  showToast(`<span class="t-new">Faster Camera purchased!</span>`);
});

els.buyMultiCapture.addEventListener("click", () => {
  if (state.multiCapture || state.money < MULTI_CAPTURE_COST) return;
  state.money -= MULTI_CAPTURE_COST;
  state.multiCapture = true;
  saveDirty = true;
  buildShop();
  showToast(`<span class="t-new">Multi Capture purchased!</span>`);
});

els.buyTripod.addEventListener("click", () => {
  if (state.money < TRIPOD_COST || state.tripodCount >= TRIPOD_MAX) return;
  state.money -= TRIPOD_COST;
  state.tripodCount++;
  saveDirty = true;
  buildShop();
  showToast(`Tripod purchased <small>(${state.tripodCount}/${TRIPOD_MAX})</small>`);
});

els.buyTimefreeze.addEventListener("click", () => {
  if (state.money < TIME_FREEZE_COST || state.timeFreezeCount >= TIME_FREEZE_MAX) return;
  state.money -= TIME_FREEZE_COST;
  state.timeFreezeCount++;
  saveDirty = true;
  buildShop();
  showToast(`Time Freeze purchased <small>(${state.timeFreezeCount}/${TIME_FREEZE_MAX})</small>`);
});

els.buyLuckyCharm.addEventListener("click", () => {
  if (state.money < LUCKY_CHARM_COST || state.luckyCharmCount >= LUCKY_CHARM_MAX) return;
  state.money -= LUCKY_CHARM_COST;
  state.luckyCharmCount++;
  saveDirty = true;
  buildShop();
  showToast(`Lucky Charm purchased <small>(${state.luckyCharmCount}/${LUCKY_CHARM_MAX})</small>`);
});

// ------------------------------------------------------------------
// Time Freeze: one-use, slows every stickman on screen to a crawl for 5s.
// ------------------------------------------------------------------
function updateTimefreezeInvBadge() {
  els.timefreezeInvCount.textContent = state.timeFreezeCount;
  els.timefreezeInvBtn.classList.toggle("hidden", state.timeFreezeCount <= 0);
}

function useTimeFreeze() {
  if (state.timeFreezeCount <= 0) { showToast("No Time Freezes left — buy more in the Shop!"); return; }
  state.timeFreezeCount--;
  saveDirty = true;
  timeFreezeUntil = performance.now() + TIME_FREEZE_DURATION_MS;
  updateTimefreezeInvBadge();
  showToast(`<span class="t-bounty">TIME FREEZE!</span> Stickmen slow to a crawl…`);
}

// ------------------------------------------------------------------
// Lucky Charm: one-use, doubles the spawn weight of rare stickmen for 3m.
// ------------------------------------------------------------------
function updateLuckyCharmInvBadge() {
  els.luckyCharmInvCount.textContent = state.luckyCharmCount;
  els.luckyCharmInvBtn.classList.toggle("hidden", state.luckyCharmCount <= 0);
}

function useLuckyCharm() {
  if (state.luckyCharmCount <= 0) { showToast("No Lucky Charms left — buy more in the Shop!"); return; }
  state.luckyCharmCount--;
  saveDirty = true;
  luckUntil = performance.now() + LUCKY_CHARM_DURATION_MS;
  updateLuckyCharmInvBadge();
  showToast(`<span class="t-bounty">LUCKY CHARM!</span> 2x luck for 3 minutes…`);
}

function updateLuckTimer(now) {
  if (!luckUntil) return;
  const remain = luckUntil - now;
  if (remain <= 0) {
    luckUntil = 0;
    els.luckTimer.classList.add("hidden");
  } else {
    els.luckTimer.classList.remove("hidden");
    els.luckTimerFill.style.width = (Math.max(0, Math.min(1, remain / LUCKY_CHARM_DURATION_MS)) * 100) + "%";
    const secs = Math.ceil(remain / 1000);
    els.luckTimerTime.textContent = Math.floor(secs / 60) + ":" + String(secs % 60).padStart(2, "0");
  }
}

// ------------------------------------------------------------------
// Tripods: buy up to 99, place one down and it auto-photographs any
// stickman that wanders into range for about a minute, then it's gone.
// ------------------------------------------------------------------
let tripodMode = null; // null | "aiming" | "pending"
let tripodPreviewX = 0, tripodPreviewY = 0;
let pendingTripod = null; // { x, y } once a spot has been tapped/clicked

function updateTripodInvBadge() {
  els.tripodInvCount.textContent = state.tripodCount;
  els.tripodInvBtn.classList.toggle("hidden", state.tripodCount <= 0 && !tripodMode);
}

function positionTripodConfirm(x, y) {
  els.tripodConfirm.style.left = x + "px";
  els.tripodConfirm.style.top = (y - TRIPOD_RANGE - 14) + "px";
}

function startTripodAiming() {
  if (state.tripodCount <= 0) { showToast("No tripods left — buy more in the Shop!"); return; }
  if (cameraMode) toggleCamera(false);
  closeDex(); closeShop();
  tripodMode = "aiming";
  pendingTripod = null;
  tripodPreviewX = vfX || W / 2;
  tripodPreviewY = vfY || H / 2;
  document.body.classList.add("tripod-mode");
  els.tripodInvBtn.classList.add("active");
  els.tripodHint.classList.remove("hidden");
  els.tripodHint.textContent = "Tap / click to set the tripod down · ESC to cancel";
  els.tripodConfirm.classList.add("hidden");
}

function placePendingTripod(x, y) {
  pendingTripod = { x, y };
  tripodMode = "pending";
  els.tripodHint.textContent = "Confirm the tripod's spot";
  positionTripodConfirm(x, y);
  els.tripodConfirm.classList.remove("hidden");
}

function confirmTripod() {
  if (!pendingTripod) return;
  state.tripodCount--;
  saveDirty = true;
  const now = performance.now();
  tripods.push({
    x: pendingTripod.x, y: pendingTripod.y, r: TRIPOD_RANGE,
    placedAt: now, expiresAt: now + TRIPOD_DURATION_MS, lastShotAt: -Infinity
  });
  exitTripodMode();
}

function cancelTripodMode() {
  if (!tripodMode) return;
  exitTripodMode();
}

function exitTripodMode() {
  tripodMode = null;
  pendingTripod = null;
  document.body.classList.remove("tripod-mode");
  els.tripodInvBtn.classList.remove("active");
  els.tripodHint.classList.add("hidden");
  els.tripodConfirm.classList.add("hidden");
  updateTripodInvBadge();
}

function updateTripods(dt) {
  const now = performance.now();
  for (let i = tripods.length - 1; i >= 0; i--) {
    const tp = tripods[i];
    if (now >= tp.expiresAt) { tripods.splice(i, 1); continue; }
    if (now - tp.lastShotAt < TRIPOD_SHOT_COOLDOWN_MS) continue;
    let best = null;
    for (const s of stickmen) {
      if (s.shot) continue;
      const cy = s.y - instHeight(s) * 0.5;
      if (Math.hypot(s.x - tp.x, cy - tp.y) > tp.r) continue;
      if (state.bountyId && s.type.id === state.bountyId) { best = s; break; }
      if (!best || s.type.r < best.type.r) best = s;
    }
    if (best) tripodCapture(tp, best);
  }
  for (let i = tripodFlashes.length - 1; i >= 0; i--) {
    tripodFlashes[i].t += dt;
    if (tripodFlashes[i].t > 0.45) tripodFlashes.splice(i, 1);
  }
}

function tripodCapture(tp, focus) {
  tp.lastShotAt = performance.now();
  const photoURL = snapshotRegion(tp.x - tp.r, tp.y - tp.r, tp.r * 2, tp.r * 2, focus);
  state.shots++;

  const valueType = focus.type;
  const bountyHit = state.bountyId === valueType.id;
  let gained = bountyHit ? valueType.value * 20 : valueType.value;
  if (goldenUntil > performance.now()) gained *= GOLDEN_MONEY_MULT;
  state.money += gained;

  focus.shot = true;
  let newType = false;
  if (!state.dex[valueType.id]) { state.dex[valueType.id] = { c: 0 }; newType = true; }
  state.dex[valueType.id].c++;
  makeThumb(photoURL, thumb => {
    const e = state.dex[valueType.id];
    if (e && !e.t) e.t = thumb;
    saveDirty = true;
  });

  updateMoneyDisplay(true);
  saveDirty = true;
  tripodFlashes.push({ x: tp.x, y: tp.y, t: 0 });

  showToast(
    `<span class="t-money">+${formatMoney(gained)}</span> <small>(tripod)</small><br>` +
    (bountyHit ? `<span class="t-bounty">BOUNTY x20!</span> ` : "") +
    `${valueType.name} <small>(${formatRarity(valueType.r)})</small>` +
    (newType ? `<br><span class="t-new">NEW Stickdex entry!</span>` : "")
  );

  if (bountyHit || Date.now() - state.bountySetAt > BOUNTY_TIMEOUT_MS) pickBounty();
}

function drawTripodIcon(ctx, x, y, opts) {
  opts = opts || {};
  ctx.save();
  ctx.globalAlpha *= opts.alpha === undefined ? 1 : opts.alpha;
  ctx.strokeStyle = "#000"; ctx.lineWidth = 2; ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x, y - 22); ctx.lineTo(x, y - 8);
  ctx.moveTo(x, y - 8); ctx.lineTo(x - 12, y + 14);
  ctx.moveTo(x, y - 8); ctx.lineTo(x + 12, y + 14);
  ctx.moveTo(x, y - 8); ctx.lineTo(x, y + 16);
  ctx.stroke();
  ctx.fillStyle = "#fff"; ctx.strokeStyle = "#000";
  ctx.beginPath(); ctx.rect(x - 8, y - 30, 16, 10); ctx.fill(); ctx.stroke();
  ctx.restore();
}

function drawTripodRange(ctx, x, y, r) {
  ctx.save();
  ctx.strokeStyle = "#1565c0";
  ctx.lineWidth = 1.6;
  ctx.setLineDash([5, 5]);
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = "#1565c012";
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

function drawTripods(t) {
  for (const tp of tripods) drawTripodIcon(ctx, tp.x, tp.y);
  for (const fl of tripodFlashes) {
    const a = 1 - fl.t / 0.45;
    ctx.save();
    ctx.globalAlpha = a * 0.6;
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(fl.x, fl.y, TRIPOD_RANGE * (0.3 + fl.t), 0, Math.PI * 2); ctx.stroke();
    ctx.restore();
  }
  if (tripodMode === "aiming") {
    drawTripodRange(ctx, tripodPreviewX, tripodPreviewY, TRIPOD_RANGE);
    drawTripodIcon(ctx, tripodPreviewX, tripodPreviewY, { alpha: 0.5 });
  } else if (tripodMode === "pending" && pendingTripod) {
    drawTripodRange(ctx, pendingTripod.x, pendingTripod.y, TRIPOD_RANGE);
    drawTripodIcon(ctx, pendingTripod.x, pendingTripod.y, { alpha: 0.5 });
  }
}

// ------------------------------------------------------------------
// Input
// ------------------------------------------------------------------
els.cameraBtn.addEventListener("click", () => { closeShop(); cancelTripodMode(); toggleCamera(); });
els.folderBtn.addEventListener("click", openDex);
els.dexBack.addEventListener("click", closeDex);
els.shopBtn.addEventListener("click", openShop);
els.shopBack.addEventListener("click", closeShop);
els.tripodInvBtn.addEventListener("click", () => {
  if (tripodMode) cancelTripodMode();
  else startTripodAiming();
});
els.tripodConfirmYes.addEventListener("click", confirmTripod);
els.tripodConfirmNo.addEventListener("click", cancelTripodMode);
els.timefreezeInvBtn.addEventListener("click", useTimeFreeze);
els.luckyCharmInvBtn.addEventListener("click", useLuckyCharm);

document.getElementById("wipe-btn").addEventListener("click", () => {
  if (confirm("Wipe ALL progress?\n\nThis permanently deletes your money and your entire Stickdex. This cannot be undone.")) {
    wiping = true;
    localStorage.removeItem(SAVE_KEY);
    location.reload();
  }
});

window.addEventListener("keydown", e => {
  if (e.target && e.target.tagName === "INPUT") return; // typing in a text box
  if (e.key === "Escape") {
    if (tripodMode) cancelTripodMode();
    else if (!els.stickdex.classList.contains("hidden")) closeDex();
    else if (!els.shop.classList.contains("hidden")) closeShop();
    else if (cameraMode) toggleCamera(false);
  }
  if (e.key === "c" || e.key === "C") toggleCamera();
});

window.__debug = {
  stickmen, portals, state, buildShop,
  peek: () => ({
    money: state.money, fasterCamera: state.fasterCamera,
    tripodCount: state.tripodCount, timeFreezeCount: state.timeFreezeCount,
    luckyCharmCount: state.luckyCharmCount,
    tripodMode, tripods: tripods.length, timeFreezeUntil, luckUntil, now: performance.now()
  })
}; // headless inspection hook

window.addEventListener("mousemove", e => {
  if (cameraMode) setViewfinder(e.clientX, e.clientY);
  else if (tripodMode === "aiming") { tripodPreviewX = e.clientX; tripodPreviewY = e.clientY; }
});
canvas.addEventListener("click", e => {
  if (cameraMode) { setViewfinder(e.clientX, e.clientY); takePhoto(); }
  else if (tripodMode === "aiming") { placePendingTripod(e.clientX, e.clientY); }
});
canvas.addEventListener("touchstart", e => {
  if (cameraMode) { e.preventDefault(); const t = e.touches[0]; setViewfinder(t.clientX, t.clientY); }
  else if (tripodMode === "aiming") { e.preventDefault(); const t = e.touches[0]; placePendingTripod(t.clientX, t.clientY); }
}, { passive: false });
canvas.addEventListener("touchmove", e => {
  if (cameraMode) { e.preventDefault(); const t = e.touches[0]; setViewfinder(t.clientX, t.clientY); }
}, { passive: false });
canvas.addEventListener("touchend", e => {
  if (cameraMode) { e.preventDefault(); takePhoto(); }
}, { passive: false });

// ------------------------------------------------------------------
// Main loop
// ------------------------------------------------------------------
let lastTime = performance.now();

function frame(now) {
  const dt = Math.min(0.05, (now - lastTime) / 1000);
  lastTime = now;
  const t = now / 1000;
  state.playMinutes += dt / 60;
  updateRainbowEvent(now);
  updateGoldenEvent(now);
  updateLuckTimer(now);

  const frozen = now < timeFreezeUntil;
  const worldDt = frozen ? dt * TIME_FREEZE_SCALE : dt;
  updateWorld(worldDt, t);
  updatePortals(dt);
  updateTripods(dt);

  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, W, H);

  drawPortals(t);
  drawParticles(dt, t);

  stickmen.sort((a, b) => a.y - b.y);
  for (const s of stickmen) drawStickman(ctx, s, t);

  drawTripods(t);

  if (frozen) {
    ctx.fillStyle = "#42a5f522";
    ctx.fillRect(0, 0, W, H);
  }

  requestAnimationFrame(frame);
}

// ------------------------------------------------------------------
// Boot
// ------------------------------------------------------------------
loadState();
rainbowCheckBlock = Math.floor(state.playMinutes / RAINBOW_CHECK_INTERVAL_MIN); // don't retroactively roll past blocks
goldenCheckBlock = Math.floor(state.playMinutes / GOLDEN_CHECK_INTERVAL_MIN);   // don't retroactively roll past blocks
updateMoneyDisplay(false);
updateTripodInvBadge();
updateTimefreezeInvBadge();
updateLuckyCharmInvBadge();
if (state.bountyId) renderBounty(); else pickBounty();

// initial population spread across the screen — gated by the same spawn
// credit budget as ongoing refills, so a reload can't grant more rare-hunting
// rolls than would have naturally trickled in over the real elapsed time.
const initial = maxOnScreen();
if (typeof state.spawnCredits !== "number") state.spawnCredits = initial; // first-ever visit: fully populated
else if (state.lastCreditUpdate) {
  const elapsedSec = Math.max(0, (Date.now() - state.lastCreditUpdate) / 1000);
  state.spawnCredits = Math.min(initial, state.spawnCredits + elapsedSec * SPAWN_REGEN_PER_SEC);
}
state.lastCreditUpdate = Date.now();
for (let i = 0; i < initial && state.spawnCredits >= 1; i++) {
  state.spawnCredits--;
  spawn(null, true);
}

setInterval(() => { saveDirty = true; saveState(); }, 8000);
window.addEventListener("beforeunload", () => saveState(true));
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") saveState(true);
});

requestAnimationFrame(frame);

})();
