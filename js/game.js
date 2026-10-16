// Copyright (c) 2026 logancrowther. All rights reserved. See LICENSE.
// Stickman Archive — game engine: world sim, camera, bounty frame, Stickdex, saving.

"use strict";

(() => {

const canvas = document.getElementById("world");
const ctx = canvas.getContext("2d");
const els = {
  money: document.getElementById("money"),
  giftBtn: document.getElementById("gift-btn"),
  giftBackdrop: document.getElementById("gift-backdrop"),
  giftModal: document.getElementById("gift-modal"),
  giftClose: document.getElementById("gift-close"),
  giftClaimBtn: document.getElementById("gift-claim-btn"),
  giftClaimedBadge: document.getElementById("gift-claimed-badge"),
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
  buyPermLuck: document.getElementById("buy-permluck"),
  buyPermCash: document.getElementById("buy-permcash"),
  permCashDesc: document.getElementById("permcash-desc"),
  buyTripod: document.getElementById("buy-tripod"),
  buyTimefreeze: document.getElementById("buy-timefreeze"),
  buyLuckyCharm: document.getElementById("buy-luckycharm"),
  buyExtraClover: document.getElementById("buy-extraclover"),
  buyTotem: document.getElementById("buy-totem"),
  buyEnergyDrink: document.getElementById("buy-energydrink"),
  buyOvertime: document.getElementById("buy-overtime"),
  buyEquipmentBox: document.getElementById("buy-equipmentbox"),
  tripodOwnedCount: document.getElementById("tripod-owned-count"),
  timefreezeOwnedCount: document.getElementById("timefreeze-owned-count"),
  luckyCharmOwnedCount: document.getElementById("luckycharm-owned-count"),
  extraCloverOwnedCount: document.getElementById("extraclover-owned-count"),
  totemOwnedCount: document.getElementById("totem-owned-count"),
  energyDrinkOwnedCount: document.getElementById("energydrink-owned-count"),
  overtimeOwnedCount: document.getElementById("overtime-owned-count"),
  equipmentBoxOwnedCount: document.getElementById("equipmentbox-owned-count"),
  tripodInvBtn: document.getElementById("tripod-inv-btn"),
  tripodInvCount: document.getElementById("tripod-inv-count"),
  timefreezeInvBtn: document.getElementById("timefreeze-inv-btn"),
  timefreezeInvCount: document.getElementById("timefreeze-inv-count"),
  luckyCharmInvBtn: document.getElementById("luckycharm-inv-btn"),
  luckyCharmInvCount: document.getElementById("luckycharm-inv-count"),
  extraCloverInvBtn: document.getElementById("extraclover-inv-btn"),
  extraCloverInvCount: document.getElementById("extraclover-inv-count"),
  totemInvBtn: document.getElementById("totem-inv-btn"),
  totemInvCount: document.getElementById("totem-inv-count"),
  energyDrinkInvBtn: document.getElementById("energydrink-inv-btn"),
  energyDrinkInvCount: document.getElementById("energydrink-inv-count"),
  overtimeInvBtn: document.getElementById("overtime-inv-btn"),
  overtimeInvCount: document.getElementById("overtime-inv-count"),
  equipmentBoxInvBtn: document.getElementById("equipmentbox-inv-btn"),
  equipmentBoxInvCount: document.getElementById("equipmentbox-inv-count"),
  extraExtraCloverInvBtn: document.getElementById("extraextraclover-inv-btn"),
  extraExtraCloverInvCount: document.getElementById("extraextraclover-inv-count"),
  energyOverloadInvBtn: document.getElementById("energyoverload-inv-btn"),
  energyOverloadInvCount: document.getElementById("energyoverload-inv-count"),
  reliableTripodInvBtn: document.getElementById("reliabletripod-inv-btn"),
  reliableTripodInvCount: document.getElementById("reliabletripod-inv-count"),
  placeHint: document.getElementById("place-hint"),
  placeConfirm: document.getElementById("place-confirm"),
  placeConfirmYes: document.getElementById("place-confirm-yes"),
  placeConfirmNo: document.getElementById("place-confirm-no"),
  rainbowTimer: document.getElementById("rainbow-timer"),
  rainbowTimerFill: document.getElementById("rainbow-timer-fill"),
  rainbowTimerTime: document.getElementById("rainbow-timer-time"),
  goldenTimer: document.getElementById("golden-timer"),
  goldenTimerFill: document.getElementById("golden-timer-fill"),
  goldenTimerTime: document.getElementById("golden-timer-time"),
  luckTimer: document.getElementById("luck-timer"),
  luckTimerFill: document.getElementById("luck-timer-fill"),
  luckTimerTime: document.getElementById("luck-timer-time"),
  cloverTimer: document.getElementById("clover-timer"),
  cloverTimerFill: document.getElementById("clover-timer-fill"),
  cloverTimerTime: document.getElementById("clover-timer-time"),
  stampedeTimer: document.getElementById("stampede-timer"),
  stampedeTimerFill: document.getElementById("stampede-timer-fill"),
  stampedeTimerTime: document.getElementById("stampede-timer-time"),
  totemTimer: document.getElementById("totem-timer"),
  totemTimerFill: document.getElementById("totem-timer-fill"),
  totemTimerTime: document.getElementById("totem-timer-time"),
  energyDrinkTimer: document.getElementById("energydrink-timer"),
  energyDrinkTimerFill: document.getElementById("energydrink-timer-fill"),
  energyDrinkTimerTime: document.getElementById("energydrink-timer-time"),
  extraExtraCloverTimer: document.getElementById("extraextraclover-timer"),
  extraExtraCloverTimerFill: document.getElementById("extraextraclover-timer-fill"),
  extraExtraCloverTimerTime: document.getElementById("extraextraclover-timer-time"),
  energyOverloadTimer: document.getElementById("energyoverload-timer"),
  energyOverloadTimerFill: document.getElementById("energyoverload-timer-fill"),
  energyOverloadTimerTime: document.getElementById("energyoverload-timer-time"),
  achievementsBtn: document.getElementById("achievements-btn"),
  achievements: document.getElementById("achievements"),
  achievementsBackdrop: document.getElementById("achievements-backdrop"),
  achBack: document.getElementById("ach-back"),
  achList: document.getElementById("ach-list")
};

const SAVE_KEY = "stickmanArchiveSaveV1";

// Save integrity: the save is signed with a checksum computed from a secret
// baked into this file. This is a deterrent, not real security — the secret
// ships to the browser, so someone who reads (or has an AI reproduce) this
// exact function can still forge a valid signature. What it does stop is
// hand-editing save values in DevTools without touching this logic, which is
// the actual thing that happened. See loadState()/saveState() below.
const SAVE_SIGNING_SECRET = "sa-integrity-v1";
function computeSaveSignature(str) {
  let h = 2166136261 >>> 0;
  const s = SAVE_SIGNING_SECRET + str;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return (h >>> 0).toString(36);
}

// The stored save is also XOR-obscured before it's signed, so opening
// DevTools > Application > Local Storage shows base64 noise instead of a
// plain JSON object with readable field names like "money". Same caveat as
// the signature above: the key ships in this file, so this stops casual
// inspection/hand-editing, not someone willing to read this function.
const SAVE_ENCRYPTION_KEY = "sa-obscure-v1";
function xorWithKey(str, key) {
  let out = "";
  for (let i = 0; i < str.length; i++) out += String.fromCharCode(str.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  return out;
}
function encryptSave(str) {
  return btoa(xorWithKey(unescape(encodeURIComponent(str)), SAVE_ENCRYPTION_KEY));
}
function decryptSave(str) {
  return decodeURIComponent(escape(xorWithKey(atob(str), SAVE_ENCRYPTION_KEY)));
}

const TAMPER_MSG_KEY = "stickmanArchiveTamperMsg"; // sessionStorage, survives the one reload

const FRAME_COOLDOWN_MS = 10 * 60 * 1000; // same type can't be the bounty within 10 minutes
const BOUNTY_TIMEOUT_MS = 10 * 60 * 1000;

// Shop
const FASTER_CAMERA_COST = 15000;
const MULTI_CAPTURE_COST = 25000;
const PERM_LUCK_COST = 75000;
const PERM_LUCK_MULT = 1.5;    // permanent — same rarity cutoff as the luck charms (LUCKY_CHARM_RARE_CUTOFF)
// Permanent Cash Boost is two tiers — tier 2 replaces tier 1 rather than stacking with it.
const PERM_CASH_TIER1_COST = 25000;
const PERM_CASH_TIER1_MULT = 1.25;
const PERM_CASH_TIER2_COST = 50000;
const PERM_CASH_TIER2_MULT = 1.5;
const PERM_CASH_MULT_BY_LEVEL = [1, PERM_CASH_TIER1_MULT, PERM_CASH_TIER2_MULT]; // only applies to photo payouts, not the gift or achievement rewards
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
const LUCKY_CHARM_RARE_CUTOFF = 0.01;    // % rarity — types rarer than this are boosted
const LUCKY_CHARM_RARE_MULT = 2;      // "2x luck"
const EXTRA_CLOVER_COST = 15000;
const EXTRA_CLOVER_MAX = 99;
const EXTRA_CLOVER_DURATION_MS = 3 * 60 * 1000;
const EXTRA_CLOVER_RARE_MULT = 3;     // "3x luck"

// Rainbow Event
const RAINBOW_CHECK_INTERVAL_MIN = 1; // roll once per this many minutes of play
const RAINBOW_EVENT_CHANCE = 0.0025;  // 0.25% chance on each roll
const RAINBOW_DURATION_MS = 3 * 60 * 1000;
const RAINBOW_RARE_CUTOFF = 0.01;        // % rarity — types rarer than this are boosted
const RAINBOW_RARE_MULT = 5;

// Golden Event
const GOLDEN_CHECK_INTERVAL_MIN = 1; // roll once per this many minutes of play
const GOLDEN_EVENT_CHANCE = 0.0025;  // 0.25% chance on each roll
const GOLDEN_DURATION_MS = 3 * 60 * 1000;
const GOLDEN_MONEY_MULT = 2;         // photos taken during the event pay double

// Stampede Event
const STAMPEDE_CHECK_INTERVAL_MIN = 1; // roll once per this many minutes of play
const STAMPEDE_EVENT_CHANCE = 0.005;   // 0.5% chance on each roll
const STAMPEDE_DURATION_MS = 60 * 1000;
const STAMPEDE_SPEED_MULT = 3;         // every stickman moves 3x as fast

// Totem: placed prop that boosts Rainbow/Golden/Stampede odds while active
const TOTEM_COST = 30000;
const TOTEM_MAX = 99;
const TOTEM_DURATION_MS = 10 * 60 * 1000;
const TOTEM_EVENT_MULT = 3;

// Energy Drink: instant-use, speeds up every stickman on screen for a minute
const ENERGY_DRINK_COST = 20000;
const ENERGY_DRINK_MAX = 99;
const ENERGY_DRINK_DURATION_MS = 60 * 1000;
const ENERGY_DRINK_SPEED_MULT = 2;

// Overtime: instant-use, only usable while a Rainbow/Golden/Stampede event
// is active — adds extra time to that event (once per event instance).
const OVERTIME_COST = 100000;
const OVERTIME_MAX = 99;
const OVERTIME_RAINBOW_GOLDEN_BONUS_MS = 3 * 60 * 1000;
const OVERTIME_STAMPEDE_BONUS_MS = 60 * 1000;

// Equipment Box: instant-use, opens into a random item worth no more than
// its own price (so never Overtime) — including 3 items only obtainable
// this way: Extra Extra Lucky Charm, Energy Overload, Reliable Tripod.
const EQUIPMENT_BOX_COST = 50000;
const EQUIPMENT_BOX_MAX = 99;
const EQUIPMENT_BOX_POOL = [
  "tripod", "timefreeze", "luck", "clover", "totem", "energydrink",
  "extraextraclover", "energyoverload", "reliabletripod"
];

// Extra Extra Lucky Charm: box-exclusive, placeable, 4x luck for 3 minutes
const EXTRA_EXTRA_CLOVER_MAX = 99;
const EXTRA_EXTRA_CLOVER_DURATION_MS = 3 * 60 * 1000;
const EXTRA_EXTRA_CLOVER_RARE_MULT = 4;

// Energy Overload: box-exclusive, instant-use, speeds up every stickman on
// screen for 2 minutes — faster than Energy Drink, still slower than Stampede.
const ENERGY_OVERLOAD_MAX = 99;
const ENERGY_OVERLOAD_DURATION_MS = 2 * 60 * 1000;
const ENERGY_OVERLOAD_SPEED_MULT = 2.5;

// Reliable Tripod: box-exclusive, placeable, shoots faster, watches a
// slightly bigger area, and lasts 5 minutes instead of 1.
const RELIABLE_TRIPOD_MAX = 99;
const RELIABLE_TRIPOD_RANGE = TRIPOD_RANGE + 20;
const RELIABLE_TRIPOD_DURATION_MS = 5 * 60 * 1000;
const RELIABLE_TRIPOD_SHOT_COOLDOWN_MS = 1500;

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
  permLuck: false,     // owns the permanent 1.5x Luck upgrade
  permCashLevel: 0,    // 0 = none, 1 = permanent 1.25x Cash, 2 = permanent 1.5x Cash (replaces tier 1)
  tripodCount: 0,        // unplaced tripods in inventory
  timeFreezeCount: 0,    // unused Time Freezes in inventory
  luckyCharmCount: 0,    // unused Lucky Charms in inventory
  extraCloverCount: 0,   // unused Extra Lucky Clovers in inventory
  totemCount: 0,         // unplaced Totems in inventory
  energyDrinkCount: 0,   // unused Energy Drinks in inventory
  overtimeCount: 0,      // unused Overtimes in inventory
  equipmentBoxCount: 0,  // unopened Equipment Boxes in inventory
  extraExtraCloverCount: 0, // unplaced Extra Extra Lucky Charms in inventory (box-exclusive)
  energyOverloadCount: 0,   // unused Energy Overloads in inventory (box-exclusive)
  reliableTripodCount: 0,   // unplaced Reliable Tripods in inventory (box-exclusive)
  spawnCredits: null,      // available spawn "rolls"; regenerates over real time, not on reload
  lastCreditUpdate: 0,    // timestamp spawnCredits was last topped up
  achFlags: {             // one-shot flags achievements check against
    boughtTripod: false, sawRainbow: false, sawGolden: false,
    caughtTripping: false
  },
  achievements: {},       // key -> { seen: bool, claimed: bool }
  bountiesCollected: 0,   // total bounty-frame captures, across camera and tripods
  auraGiftClaimed: false, // one-time free gift (gift icon in the HUD) — spawns the Aura Farmer
  auraFarmerCaught: false,// photographed the Aura Farmer during its one appearance
  auraFarmerThumb: null   // its Stickdex thumbnail, once captured
};

// Spawns are rate-limited by a persisted, wall-clock-driven credit budget so
// reloading the page can't grant free extra spawn rolls (and thus faster
// rare-hunting) beyond what would have naturally trickled in over that time.
const SPAWN_REGEN_PER_SEC = 6; // refilling an empty screen from scratch takes a few seconds
const LUCKY_BLOCK_SPAWN_CHANCE = 0.0000105; // per natural refill tick, when none is already on screen — matches #110's actual spawn odds (r/100)

// Placed tripods (transient — not saved, they only last about a minute anyway)
const tripods = [];
const tripodFlashes = [];

// Placed Totem/Lucky Charm/Extra Lucky Charm props (transient — not saved).
// Unlike tripods these are pure visual anchors for a global buff timer —
// no per-frame proximity checks.
const placedProps = [];

// Debug spawn queue: typeIds queued here take the place of the next
// natural refill spawns (see updateWorld) instead of a random roll. Transient,
// not saved — reachable via the Stickdex code box (code 8395) and as an
// achievement reward delivery mechanism (Lucky Block / Titan grants).
const spawnQueue = [];

// Sentinel typeId (not a real 1-1000 id) meaning "spawn a Lucky Block here
// instead of a normal type" — recognized by spawn() and the natural refill
// roll in updateWorld.
const LUCKY_BLOCK_ID = -1;

// Sentinel typeId for the Aura Farmer — a one-time, unnumbered special
// entry delivered by the free gift (see claimAuraGift/spawnAuraFarmer).
// Not part of TYPES, never added to state.dex, never picked as a bounty.
const AURA_FARMER_ID = -2;
const AURA_FARMER_VALUE = 67;
const AURA_SHOOT_RANGE_PX = 110;    // how close to the hoop before it stops to shoot
const AURA_BLACKOUT_SNAP_S = 0.35;  // fade to black
const AURA_BLACKOUT_HOLD_S = 0.7;   // held fully black — the crowd vanishes, the court is set
const AURA_BLACKOUT_FADE_S = 0.7;   // lights come back up on the empty court + the Aura Farmer
const AURA_SHOT_WINDUP_S = 0.3;     // stands still, winds up
const AURA_SHOT_ARC_S = 0.6;        // ball's flight time to the hoop
const AURA_SHOT_HANG_S = 0.3;       // confetti beat before it resumes walking

// Time Freeze: transient — not saved, it always finishes long before any reload matters
let timeFreezeUntil = 0;

// Lucky Charm: transient — not saved, it always finishes long before any reload matters
let luckUntil = 0;

// Extra Lucky Clover: transient — not saved, it always finishes long before any reload matters
let cloverUntil = 0;

// Totem: transient — not saved. Boosts Rainbow/Golden/Stampede odds while active.
let totemUntil = 0;

// Energy Drink: transient — not saved, it always finishes long before any reload matters
let energyDrinkUntil = 0;

// Extra Extra Lucky Charm: transient — not saved, it always finishes long before any reload matters
let extraExtraCloverUntil = 0;

// Energy Overload: transient — not saved, it always finishes long before any reload matters
let energyOverloadUntil = 0;

// Rainbow Event: transient — not saved. rainbowUntil is a performance.now() timestamp
// (0 = inactive). rainbowCheckBlock tracks which check-interval block of
// state.playMinutes (persisted) was last rolled, so reloading can't grant extra rolls.
let rainbowUntil = 0;
let rainbowCheckBlock = 0;
let rainbowOvertimeUsed = false;

// Golden Event: transient — not saved. Rolls independently of the Rainbow
// Event on its own check-interval blocks, same pattern as above.
let goldenUntil = 0;
let goldenCheckBlock = 0;
let goldenOvertimeUsed = false;

// Stampede Event: transient — not saved. Rolls independently of Rainbow/
// Golden on its own check-interval blocks, same pattern as above.
let stampedeUntil = 0;
let stampedeCheckBlock = 0;
let stampedeOvertimeUsed = false;

// Only one of Rainbow/Golden/Stampede may be active at a time.
function anyEventActive() {
  return !!rainbowUntil || !!goldenUntil || !!stampedeUntil;
}

function loadState() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return;
    const wrapper = JSON.parse(raw);
    if (!wrapper || typeof wrapper.data !== "string") {
      // Pre-signing save format — every save that exists before this feature
      // shipped. No grace period: all of them get wiped on this update.
      flagTamperedAndWipe("reset");
      return;
    }
    if (computeSaveSignature(wrapper.data) !== wrapper.sig) {
      flagTamperedAndWipe("tampered");
      return;
    }
    const s = JSON.parse(decryptSave(wrapper.data));
    Object.assign(state, s);
    if (state.bountyId && !TYPES[state.bountyId - 1]) state.bountyId = null;
  } catch (e) {
    flagTamperedAndWipe("tampered"); // corrupted/hand-broken save — same treatment as a signature mismatch
  }
}

let saveDirty = false;
let wiping = false;
function saveState(force) {
  if (wiping) return;
  if (!force && !saveDirty) return;
  saveDirty = false;
  // Refuse to blindly overwrite a save that was tampered with out-of-band
  // (hand-edited in DevTools) since we last wrote it. Without this check,
  // the beforeunload/visibility-hidden autosave below silently re-signs the
  // current in-memory state over the tampered entry before a reload's
  // loadState() ever gets to see it — quietly defeating the wipe entirely
  // instead of triggering it.
  const existing = localStorage.getItem(SAVE_KEY);
  if (existing) {
    try {
      const wrapper = JSON.parse(existing);
      if (!wrapper || typeof wrapper.data !== "string" || computeSaveSignature(wrapper.data) !== wrapper.sig) {
        flagTamperedAndWipe("tampered");
        return;
      }
    } catch (e) {
      flagTamperedAndWipe("tampered");
      return;
    }
  }
  try {
    const dataStr = encryptSave(JSON.stringify(state));
    localStorage.setItem(SAVE_KEY, JSON.stringify({ data: dataStr, sig: computeSaveSignature(dataStr) }));
  } catch (e) {
    // Quota exceeded — drop oldest thumbnails and retry once.
    const ids = Object.keys(state.dex);
    for (let i = 0; i < ids.length && i < 200; i++) delete state.dex[ids[i]].t;
    try {
      const dataStr = encryptSave(JSON.stringify(state));
      localStorage.setItem(SAVE_KEY, JSON.stringify({ data: dataStr, sig: computeSaveSignature(dataStr) }));
    } catch (e2) {}
  }
}

// Save was hand-edited (or otherwise corrupted) outside normal play, or
// predates this integrity check entirely: refuse to let it be played at
// all — wipe it and restart clean before any frame renders, rather than
// showing a dismissable warning.
function flagTamperedAndWipe(reason) {
  wiping = true;
  localStorage.removeItem(SAVE_KEY);
  sessionStorage.setItem(TAMPER_MSG_KEY, reason);
  location.reload();
}

// ------------------------------------------------------------------
// Spawn distribution: exactly each type's listed rarity, except the type
// currently shown in the bounty frame is 1.5x more likely to spawn.
// ------------------------------------------------------------------
let cumWeights = null, cumTotal = 0, weightsBountyId = -1, weightsRainbowActive = false, weightsLuckMult = 1;

function rebuildWeights() {
  const now = performance.now();
  const rainbowActive = rainbowUntil > now;
  let luckMult = 1;
  if (luckUntil > now) luckMult *= LUCKY_CHARM_RARE_MULT;
  if (cloverUntil > now) luckMult *= EXTRA_CLOVER_RARE_MULT;
  if (extraExtraCloverUntil > now) luckMult *= EXTRA_EXTRA_CLOVER_RARE_MULT;
  if (state.permLuck) luckMult *= PERM_LUCK_MULT;
  if (cumWeights && weightsBountyId === state.bountyId && weightsRainbowActive === rainbowActive && weightsLuckMult === luckMult) return;
  weightsBountyId = state.bountyId;
  weightsRainbowActive = rainbowActive;
  weightsLuckMult = luckMult;
  cumWeights = new Float64Array(TYPES.length);
  let acc = 0;
  for (let i = 0; i < TYPES.length; i++) {
    let w = TYPES[i].r;
    if (state.bountyId === i + 1) w *= 1.5;
    if (rainbowActive && TYPES[i].r < RAINBOW_RARE_CUTOFF) w *= RAINBOW_RARE_MULT;
    if (luckMult > 1 && TYPES[i].r < LUCKY_CHARM_RARE_CUTOFF) w *= luckMult;
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
  if (id === LUCKY_BLOCK_ID) return spawnLuckyBlock(onScreen);
  if (id === AURA_FARMER_ID) return spawnAuraFarmer();
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

// Lucky Block: not a real Stickdex type — a synthetic stickman that pays no
// money and never enters the dex. Photographing it (as the photo's focus)
// "opens" it into a random real character from #150-250 (see takePhoto).
function spawnLuckyBlock(onScreen) {
  const f = Object.assign({}, getFeatures(379), { vehicleBody: "luckyblock", color: "#000000", headFill: "#ffffff" });
  const dir = Math.random() < 0.5 ? 1 : -1;
  const size = 0.95 + Math.random() * 0.35;
  const laneTop = 120, laneBottom = H - 15;
  const inst = {
    instId: nextInstId++,
    type: { id: LUCKY_BLOCK_ID, name: "Lucky Block", desc: "A mysterious block. Photograph it to see what's inside.", r: 0, value: 0 },
    f,
    x: onScreen ? Math.random() * W : (dir === 1 ? -50 : W + 50),
    y: laneTop + Math.random() * Math.max(40, laneBottom - laneTop),
    dir, size,
    move: f.move || "walk",
    phase: Math.random() * Math.PI * 2,
    baseSpeed: (35 + Math.random() * 45) * f.speed,
    shot: false,
    tpTimer: 0, tpAlpha: 1,
    emitTimer: Math.random() * 0.2
  };
  stickmen.push(inst);
  return inst;
}

// ------------------------------------------------------------------
// Aura Farmer — the Free Gift's one-time special event. Spawning it hides
// every other stickman (physically removed from `stickmen`, not just drawn
// over) so it's alone on screen with a basketball hoop on the far side;
// it walks over, shoots, scores, and keeps walking off — at which point
// everyone hidden reappears exactly as they were.
// ------------------------------------------------------------------
let auraEvent = null;            // { farmer, t, dir, hoopX, hoopY, phase, ... } while running
let auraHiddenStickmen = [];      // everyone temporarily pulled out of `stickmen`

function spawnAuraFarmer() {
  if (auraEvent) return null; // already running — the gift can only ever queue one
  auraHiddenStickmen = stickmen.splice(0, stickmen.length);
  const f = Object.assign({}, getFeatures(1), {
    auraFlame: true, ball: "basketball", color: "#111111", headFill: "#ffffff", lineW: 2.2
  });
  const dir = Math.random() < 0.5 ? 1 : -1;
  const laneTop = 120, laneBottom = H - 15;
  const farmer = {
    instId: nextInstId++,
    type: { id: AURA_FARMER_ID, name: "Aura Farmer", r: 0, value: AURA_FARMER_VALUE,
            desc: "Appeared once, from the free gift. Grinding pure aura — there's only one shot at this." },
    f,
    x: dir === 1 ? -50 : W + 50,
    y: laneTop + (laneBottom - laneTop) * 0.5,
    dir, size: 1.15,
    move: "walk",
    phase: Math.random() * Math.PI * 2,
    baseSpeed: 55,
    shot: false,
    tpTimer: 0, tpAlpha: 1,
    emitTimer: Math.random() * 0.2,
    isAuraFarmer: true
  };
  stickmen.push(farmer);
  auraEvent = {
    farmer, t: 0, dir,
    hoopX: dir === 1 ? W - 80 : 80,
    hoopY: Math.max(150, H * 0.38),
    phase: "blackout",
    shotT: 0, shotStartX: 0, shotStartY: 0,
    scored: false
  };
  return farmer;
}

function updateAuraEvent(dt) {
  if (!auraEvent) return;
  const ev = auraEvent;
  ev.t += dt;

  const snap = AURA_BLACKOUT_SNAP_S, hold = AURA_BLACKOUT_HOLD_S, fade = AURA_BLACKOUT_FADE_S;
  let a = 0;
  if (ev.t < snap) a = ev.t / snap;
  else if (ev.t < snap + hold) a = 1;
  else if (ev.t < snap + hold + fade) a = 1 - (ev.t - snap - hold) / fade;
  kingFlash.style.opacity = String(Math.max(0, a));

  if (ev.phase === "blackout") {
    ev.farmer.x = ev.dir === 1 ? -50 : W + 50; // hold at the entry edge until the lights come up
    if (ev.t >= snap + hold + fade) ev.phase = "approach";
    return;
  }

  if (ev.phase === "approach") {
    if (Math.abs(ev.farmer.x - ev.hoopX) <= AURA_SHOOT_RANGE_PX) {
      ev.phase = "shooting";
      ev.shotT = 0;
      ev.shotStartX = ev.farmer.x;
      ev.shotStartY = ev.farmer.y - instHeight(ev.farmer) * 0.65;
      ev.farmer._savedSpeed = ev.farmer.baseSpeed;
      ev.farmer.baseSpeed = 0;
      ev.farmer.f.ball = null; // the held-ball bounce animation stops; the thrown-ball overlay takes over
    }
    return;
  }

  if (ev.phase === "shooting") {
    ev.shotT += dt;
    if (ev.shotT < AURA_SHOT_WINDUP_S) return; // brief wind-up, standing still
    const p = Math.min(1, (ev.shotT - AURA_SHOT_WINDUP_S) / AURA_SHOT_ARC_S);
    if (p >= 1 && !ev.scored) {
      ev.scored = true;
      for (let i = 0; i < 16; i++) {
        particles.push({
          x: ev.hoopX, y: ev.hoopY, kind: "confetti",
          life: 0.7 + Math.random() * 0.3,
          vx: (Math.random() - 0.5) * 36, vy: -22 - Math.random() * 14,
          r: 2, hue: Math.random() * 360
        });
      }
      showToast(`<span class="t-new">SWISH!</span> The Aura Farmer scores.`);
    }
    if (ev.shotT >= AURA_SHOT_WINDUP_S + AURA_SHOT_ARC_S + AURA_SHOT_HANG_S) {
      ev.farmer.baseSpeed = ev.farmer._savedSpeed;
      ev.phase = "walkoff";
    }
  }
  // phase "walkoff": the normal movement loop carries it off-screen; the
  // off-screen despawn check calls endAuraEvent() once it's gone.
}

function endAuraEvent() {
  if (!auraEvent) return;
  for (const s of auraHiddenStickmen) stickmen.push(s);
  auraHiddenStickmen = [];
  auraEvent = null;
  kingFlash.style.opacity = "0";
}

function drawAuraHoop() {
  if (!auraEvent) return;
  const { hoopX, hoopY, dir } = auraEvent;
  // The backboard+pole stand behind the rim, toward the far edge the farmer
  // is heading to; the rim itself faces back toward the court (toward the
  // approaching farmer), same arrangement as a real hoop stand.
  const bw = 34, bh = 30;                 // backboard width/height
  const poleX = hoopX + dir * (bw + 8);   // pole runs straight up behind the backboard
  const boardNear = poleX - dir * bw;     // the backboard's near (court-facing) edge
  const boardFar = poleX + dir * 2;       // its far edge, just past the pole

  ctx.save();
  ctx.strokeStyle = "#000"; ctx.lineWidth = 2.2; ctx.lineJoin = "round"; ctx.lineCap = "round";

  // pole, ground to backboard
  ctx.beginPath();
  ctx.moveTo(poleX, hoopY - bh * 0.3);
  ctx.lineTo(poleX, H - 15);
  ctx.stroke();

  // backboard (a flat rectangle facing the court)
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.rect(Math.min(boardNear, boardFar), hoopY - bh, Math.abs(boardFar - boardNear), bh);
  ctx.fill(); ctx.stroke();
  // inner target square, centered low on the backboard, just above the rim
  ctx.lineWidth = 1.3;
  const sqW = bw * 0.42, sqH = bh * 0.38;
  const sqCx = (boardNear + boardFar) / 2 + dir * bw * 0.08;
  ctx.strokeRect(sqCx - sqW / 2, hoopY - bh * 0.42, sqW, sqH);
  ctx.lineWidth = 2.2;

  // short bracket from the backboard face to the rim
  ctx.beginPath();
  ctx.moveTo(boardNear, hoopY);
  ctx.lineTo(hoopX + dir * 9, hoopY);
  ctx.stroke();

  // rim
  ctx.fillStyle = "#e64a19";
  ctx.beginPath();
  ctx.ellipse(hoopX, hoopY, 15, 4.5, 0, 0, Math.PI * 2);
  ctx.fill(); ctx.stroke();

  // net — a simple hanging diamond mesh
  ctx.lineWidth = 1.3;
  ctx.beginPath();
  const netTop = hoopY + 2, netBottom = hoopY + 18;
  for (let i = 0; i <= 6; i++) {
    const topX = hoopX - 13 + i * (26 / 6);
    const botX = hoopX - 7 + i * (14 / 6);
    ctx.moveTo(topX, netTop);
    ctx.lineTo(botX, netBottom);
  }
  for (let i = 0; i <= 1; i++) {
    const y1 = netTop + (netBottom - netTop) * (0.3 + i * 0.35);
    ctx.moveTo(hoopX - 11, y1); ctx.lineTo(hoopX + 11, y1);
  }
  ctx.stroke();
  ctx.restore();
}

function drawAuraBallShot() {
  const ev = auraEvent;
  if (!ev || ev.phase !== "shooting" || ev.shotT < AURA_SHOT_WINDUP_S) return;
  const p = Math.min(1, (ev.shotT - AURA_SHOT_WINDUP_S) / AURA_SHOT_ARC_S);
  const sx = ev.shotStartX, sy = ev.shotStartY;
  const ex = ev.hoopX, ey = ev.hoopY;
  const x = sx + (ex - sx) * p;
  const peak = Math.min(sy, ey) - 70;
  const y = (1 - p) * (1 - p) * sy + 2 * (1 - p) * p * peak + p * p * ey;
  ctx.save();
  ctx.fillStyle = "#f57c00"; ctx.strokeStyle = "#000"; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x - 5, y); ctx.lineTo(x + 5, y);
  ctx.moveTo(x, y - 5); ctx.lineTo(x, y + 5);
  ctx.stroke();
  ctx.restore();
}

// Standalone portrait renderer for the Stickdex card, mirroring drawPortrait()
// but bypassing TYPES/getFeatures(typeId) since the Aura Farmer isn't a real id.
function drawAuraFarmerPortrait(w, h) {
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  const pctx = c.getContext("2d");
  pctx.fillStyle = "#fff"; pctx.fillRect(0, 0, w, h);
  const f = Object.assign({}, getFeatures(1), {
    auraFlame: true, ball: "basketball", color: "#111111", headFill: "#ffffff", lineW: 2.2
  });
  const inst = {
    x: w / 2, y: h * 0.92, dir: 1, phase: 0.7,
    f, size: (h / 52) * 0.6, move: "walk",
    shot: false, portrait: true, _noMorph: true
  };
  drawStickman(pctx, inst, 1.234);
  return c;
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
  if (kind === "candyfall") { p.y = inst.y - Math.random() * instHeight(inst); p.vx = -inst.dir * 3; p.vy = 26 + Math.random() * 12; p.life = 0.7; p.hue = Math.random() * 360; }
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
  if (kind === "sand") { // rains straight down off the whole body
    p.y = inst.y - Math.random() * instHeight(inst);
    p.vx = -inst.dir * 3; p.vy = 30 + Math.random() * 14;
    p.life = 0.55; p.r = 1 + Math.random() * 1.2;
  }
  if (kind === "paint") { p.vx = -inst.dir * 4 + (Math.random() - 0.5) * 8; p.vy = 10 + Math.random() * 10; p.life = 1.0; p.r = 2 + Math.random() * 2; p.hue = Math.random() * 360; }
  if (kind === "smoke") {
    p.y = inst.y - 4 - Math.random() * instHeight(inst) * 0.5;
    p.vx = -inst.dir * 3 + (Math.random() - 0.5) * 8;
    p.vy = -14 - Math.random() * 10;
    p.life = 1.1; p.r = 2.4 + Math.random() * 2.4;
  }
  if (kind === "splash") { p.vx = -inst.dir * 10 + (Math.random() - 0.5) * 20; p.vy = -18 - Math.random() * 10; p.life = 0.5; p.r = 1.4 + Math.random() * 1.4; }
  if (kind === "ooze") { p.vx = 0; p.vy = 6 + Math.random() * 5; p.life = 1.0; p.r = 1.6 + Math.random() * 1.6; }
  if (kind === "paintline") { p.vx = 0; p.vy = 0; p.life = 1.4; p.r = 4 + Math.random() * 1; p.hue = Math.random() * 360; }
  if (kind === "comettail") { p.vx = 0; p.vy = 0; p.life = 1.6; p.r = 2.5 + Math.random() * 1.5; }
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
      case "sand": ctx.fillStyle = "#d7bd7a"; break;
      case "paint": ctx.fillStyle = `hsl(${p.hue}, 80%, 55%)`; break;
      case "smoke": ctx.fillStyle = "#9e9e9e"; break;
      case "splash": ctx.fillStyle = "#4fc3f7"; break;
      case "ooze": ctx.fillStyle = "#76ff03"; break;
      case "candyfall": ctx.fillStyle = `hsl(${p.hue}, 80%, 58%)`; break;
      case "paintline": ctx.fillStyle = `hsl(${p.hue}, 85%, 55%)`; break;
      case "comettail": ctx.fillStyle = "#ffb74d"; break;
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
    } else if (p.kind === "candy" || p.kind === "candyfall") {
      ctx.fillRect(p.x - 2, p.y - 1.4, 4, 2.8);
      ctx.beginPath();
      ctx.moveTo(p.x - 2, p.y); ctx.lineTo(p.x - 3.3, p.y - 1); ctx.lineTo(p.x - 3.3, p.y + 1); ctx.closePath();
      ctx.moveTo(p.x + 2, p.y); ctx.lineTo(p.x + 3.3, p.y - 1); ctx.lineTo(p.x + 3.3, p.y + 1); ctx.closePath();
      ctx.fill();
    } else if (p.kind === "paintline") {
      ctx.fillRect(p.x - p.r, p.y - 1.4, p.r * 2, 2.8);
    } else if (p.kind === "comettail") {
      ctx.save();
      ctx.shadowColor = "#ffb74d"; ctx.shadowBlur = 6;
      ctx.beginPath(); ctx.ellipse(p.x, p.y, p.r * 1.8, p.r * 0.8, 0, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
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
    } else if (p.kind === "sand") {
      ctx.fillRect(p.x - p.r * 0.5, p.y - p.r * 0.5, p.r, p.r);
    } else if (p.kind === "paint") {
      ctx.beginPath(); ctx.ellipse(p.x, p.y, p.r * 0.7, p.r, 0, 0, Math.PI * 2); ctx.fill();
    } else if (p.kind === "smoke") {
      ctx.globalAlpha *= 0.45;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
    } else if (p.kind === "splash") {
      ctx.beginPath(); ctx.ellipse(p.x, p.y, p.r, p.r * 0.7, 0, 0, Math.PI * 2); ctx.fill();
    } else if (p.kind === "ooze") {
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
  rainbowOvertimeUsed = false;
  document.body.classList.add("rainbow-event");
  els.rainbowTimer.classList.remove("hidden");
  state.achFlags.sawRainbow = true; // achievement: "Magical"
  saveDirty = true;
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
    if (!anyEventActive() && Math.random() < RAINBOW_EVENT_CHANCE * (totemUntil > now ? TOTEM_EVENT_MULT : 1)) startRainbowEvent(now);
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
  goldenOvertimeUsed = false;
  document.body.classList.add("golden-event");
  els.goldenTimer.classList.remove("hidden");
  state.achFlags.sawGolden = true; // achievement: "Shiny"
  saveDirty = true;
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
    if (!anyEventActive() && Math.random() < GOLDEN_EVENT_CHANCE * (totemUntil > now ? TOTEM_EVENT_MULT : 1)) startGoldenEvent(now);
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

// ------------------------------------------------------------------
// Stampede Event: every STAMPEDE_CHECK_INTERVAL_MIN minutes of play, a
// STAMPEDE_EVENT_CHANCE chance every stickman speeds up STAMPEDE_SPEED_MULT
// for STAMPEDE_DURATION_MS, shown as a bottom timer. Can also be triggered
// directly as an achievement reward (see claimAchievement).
// ------------------------------------------------------------------
function startStampedeEvent(now) {
  stampedeUntil = now + STAMPEDE_DURATION_MS;
  stampedeOvertimeUsed = false;
  document.body.classList.add("stampede-event");
  els.stampedeTimer.classList.remove("hidden");
}

function endStampedeEvent() {
  stampedeUntil = 0;
  document.body.classList.remove("stampede-event");
  els.stampedeTimer.classList.add("hidden");
}

function updateStampedeEvent(now) {
  const block = Math.floor(state.playMinutes / STAMPEDE_CHECK_INTERVAL_MIN);
  if (block > stampedeCheckBlock) {
    stampedeCheckBlock = block;
    if (!anyEventActive() && Math.random() < STAMPEDE_EVENT_CHANCE * (totemUntil > now ? TOTEM_EVENT_MULT : 1)) startStampedeEvent(now);
  }

  if (stampedeUntil) {
    const remain = stampedeUntil - now;
    if (remain <= 0) {
      endStampedeEvent();
    } else {
      els.stampedeTimerFill.style.width = (Math.max(0, Math.min(1, remain / STAMPEDE_DURATION_MS)) * 100) + "%";
      const secs = Math.ceil(remain / 1000);
      els.stampedeTimerTime.textContent = Math.floor(secs / 60) + ":" + String(secs % 60).padStart(2, "0");
    }
  }
}

// ------------------------------------------------------------------
// Achievements: each has a progress()/target pair (done when progress() >=
// target), an optional secret flag (name/desc show "???" until done, then
// reveal), and a reward the player claims via the Achievements panel.
// ------------------------------------------------------------------
function maxDexId() {
  let m = 0;
  for (const k in state.dex) { const n = +k; if (n > m) m = n; }
  return m;
}

const ACHIEVEMENTS = [
  { key: "start_archive", name: "Starting The Archive", desc: "Collect 10 entries in your Stickdex.",
    progress: () => Object.keys(state.dex).length, target: 10,
    reward: { type: "money", amount: 200 } },
  { key: "cube_chaos", name: "Cube Chaos", desc: "Collect 10 photos of Square.",
    progress: () => (state.dex[2] ? state.dex[2].c : 0), target: 10,
    reward: { type: "money", amount: 961 } },
  { key: "bounty_beginning", name: "Bounty Beginning", desc: "Collect one bounty.",
    progress: () => state.bountiesCollected, target: 1,
    reward: { type: "money", amount: 5000 } },
  { key: "bounty_hunter", name: "Bounty Hunter", desc: "Collect 10 bounties.",
    progress: () => state.bountiesCollected, target: 10,
    reward: { type: "money", amount: 10000 } },
  { key: "beginning", name: "The Beginning", desc: "Collect 50 entries in your Stickdex.",
    progress: () => Object.keys(state.dex).length, target: 50,
    reward: { type: "money", amount: 10000 } },
  { key: "improvements", name: "Improvements", desc: "Obtain a #100 or higher character.",
    progress: () => (maxDexId() >= 100 ? 1 : 0), target: 1,
    reward: { type: "combo", rewards: [
      { type: "money", amount: 15000 },
      { type: "item", item: "luckyCharm", amount: 3 }
    ] } },
  { key: "empty_pockets", name: "Empty Pockets", desc: "Obtain $50,000 or more at once.",
    progress: () => state.money, target: 50000,
    reward: { type: "money", amount: 20000 } },
  { key: "oops", name: "Oops", desc: "Catch a stickman while it's falling over.",
    progress: () => (state.achFlags.caughtTripping ? 1 : 0), target: 1,
    reward: { type: "event", event: "stampede" } },
  { key: "tripod_first", name: "Tripod!!!", desc: "Buy a tripod for the first time.",
    progress: () => (state.achFlags.boughtTripod ? 1 : 0), target: 1,
    reward: { type: "item", item: "tripod", amount: 1 } },
  { key: "magical", name: "Magical", desc: "Witness the Rainbow Event for the first time.",
    progress: () => (state.achFlags.sawRainbow ? 1 : 0), target: 1,
    reward: { type: "item", item: "extraClover", amount: 1 } },
  { key: "shiny", name: "Shiny", desc: "Witness the Golden Event for the first time.",
    progress: () => (state.achFlags.sawGolden ? 1 : 0), target: 1,
    reward: { type: "money", amount: 20000 } },
  { key: "lucky_200", name: "Lucky", desc: "Obtain a #200 or higher character.",
    progress: () => (maxDexId() >= 200 ? 1 : 0), target: 1,
    reward: { type: "spawn", ids: [LUCKY_BLOCK_ID] } },
  { key: "collector1", name: "Collector 1", desc: "Collect 100 entries in your Stickdex.",
    progress: () => Object.keys(state.dex).length, target: 100,
    reward: { type: "money", amount: 30000 } },
  { key: "collector2", name: "Collector 2", desc: "Collect 150 entries in your Stickdex.",
    progress: () => Object.keys(state.dex).length, target: 150,
    reward: { type: "combo", rewards: [
      { type: "money", amount: 40000 },
      { type: "item", item: "extraClover", amount: 1 }
    ] } },
  { key: "best_stick", name: "Best Stick", desc: "Obtain the Moon Walker entry.",
    progress: () => (state.dex[113] ? 1 : 0), target: 1,
    reward: { type: "money", amount: 32000 } },
  { key: "even_luckier", name: "Even Luckier", desc: "Obtain a #250 or higher character.",
    progress: () => (maxDexId() >= 250 ? 1 : 0), target: 1,
    reward: { type: "spawn", ids: [LUCKY_BLOCK_ID, LUCKY_BLOCK_ID] } },
  { key: "wealthy", name: "Wealthy", desc: "Obtain $250,000 or more at once.",
    progress: () => state.money, target: 250000,
    reward: { type: "money", amount: 50000 } },
  { key: "iron_fists", name: "Iron Fists", desc: "???", secret: true,
    revealDesc: "Capture Boxer 15 times.",
    progress: () => (state.dex[91] ? state.dex[91].c : 0), target: 15,
    reward: { type: "spawn", ids: [320] } },
  { key: "circle_1000", name: "???", desc: "???", secret: true,
    revealName: "Circle Emperor", revealDesc: "Capture Circle 1000 times.",
    progress: () => (state.dex[1] ? state.dex[1].c : 0), target: 1000,
    reward: { type: "spawn", ids: [320, 320] } },
  { key: "endless", name: "Endless", desc: "???", secret: true,
    revealDesc: "Collect every entry in the game to receive absolutely nothing but pride.",
    progress: () => Object.keys(state.dex).length, target: TYPES.length,
    reward: { type: "none" } }
];

function achState(key) {
  if (!state.achievements[key]) state.achievements[key] = { seen: false, claimed: false };
  return state.achievements[key];
}

function achDisplay(a) {
  const done = a.progress() >= a.target;
  return {
    done,
    name: done && a.revealName ? a.revealName : a.name,
    desc: done && a.revealDesc ? a.revealDesc : a.desc
  };
}

function rewardLabel(r) {
  if (r.type === "money") return formatMoney(r.amount);
  if (r.type === "item") {
    const names = { tripod: "Tripod", extraClover: "Extra Lucky Charm", luckyCharm: "Lucky Charm" };
    return `${r.amount}x ${names[r.item] || r.item}`;
  }
  if (r.type === "event") return r.event === "stampede" ? "Triggers a Stampede Event" : "Special event";
  if (r.type === "spawn") {
    const counts = {};
    for (const id of r.ids) {
      const label = id === LUCKY_BLOCK_ID ? "Lucky Block" : (TYPES[id - 1] ? TYPES[id - 1].name : `#${id}`);
      counts[label] = (counts[label] || 0) + 1;
    }
    return Object.entries(counts).map(([name, n]) => `${n}x ${name}`).join(", ");
  }
  if (r.type === "combo") return r.rewards.map(rewardLabel).join(" + ");
  return "Nothing — just pride";
}

function grantReward(r) {
  if (r.type === "money") {
    state.money += r.amount;
    updateMoneyDisplay(true);
  } else if (r.type === "item") {
    if (r.item === "tripod") state.tripodCount += r.amount;
    else if (r.item === "extraClover") state.extraCloverCount += r.amount;
    else if (r.item === "luckyCharm") state.luckyCharmCount += r.amount;
    buildShop();
  } else if (r.type === "event") {
    if (r.event === "stampede") startStampedeEvent(performance.now());
  } else if (r.type === "spawn") {
    for (const id of r.ids) spawnQueue.push(id);
  } else if (r.type === "combo") {
    for (const sub of r.rewards) grantReward(sub);
  }
}

let achCheckAccum = 0;
function checkAchievements(dt) {
  achCheckAccum += dt;
  if (achCheckAccum < 0.5) return;
  achCheckAccum = 0;
  for (const a of ACHIEVEMENTS) {
    const st = achState(a.key);
    if (st.seen) continue;
    if (a.progress() >= a.target) {
      st.seen = true;
      saveDirty = true;
      const disp = achDisplay(a);
      showToast(`<span class="t-new">Achievement complete: ${disp.name}!</span><br><small>Claim it in the Achievements panel.</small>`);
    }
  }
}

function claimAchievement(key) {
  const a = ACHIEVEMENTS.find(x => x.key === key);
  if (!a) return;
  const st = achState(key);
  if (a.progress() < a.target || st.claimed) return;
  grantReward(a.reward);
  st.claimed = true;
  saveDirty = true;
  const disp = achDisplay(a);
  showToast(`<span class="t-money">Reward claimed:</span> ${disp.name}`);
  buildAchievements();
}

let nextTripAt = 25 + Math.random() * 45; // runtime seconds until the next possible trip

function updateWorld(dt, t) {
  updateKingFlash(dt);
  updateAuraEvent(dt);
  const max = maxOnScreen();
  // escorts don't count toward the cap, and aren't replaced when they leave.
  // (population is frozen during the coronation, and during the Aura Farmer's
  // one-time event — nobody new wanders in while either is running.)
  state.spawnCredits = Math.min(max, state.spawnCredits + dt * SPAWN_REGEN_PER_SEC);
  state.lastCreditUpdate = Date.now(); // keep in sync with wall clock for the next reload's elapsed-time check
  if (!kingEvent && !auraEvent && stickmen.length - escortAlive < max && state.spawnCredits >= 1) {
    state.spawnCredits--;
    let queuedId = spawnQueue.length ? spawnQueue.shift() : null;
    if (queuedId === null && !stickmen.some(s => s.type.id === LUCKY_BLOCK_ID) && Math.random() < LUCKY_BLOCK_SPAWN_CHANCE) {
      queuedId = LUCKY_BLOCK_ID;
    }
    spawn(queuedId, false); // refill one per frame, staggered, budget permitting
  }

  // Reality Bender: any nearby stickman flickers with the glitch effect while close by
  for (const src of stickmen) {
    if (!src.f.glitchAura) continue;
    for (const s of stickmen) {
      if (s === src) continue;
      if (Math.abs(s.x - src.x) < 70 && Math.abs(s.y - src.y) < 50) s.forceGlitchUntil = t + 0.3;
    }
  }

  // ---- very rarely, a plain Circle trips over another stickman or the ground ----
  if (!kingEvent && !auraEvent && t >= nextTripAt) {
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
        if (s.isAuraFarmer) endAuraEvent(); // caught or not, it's gone — the crowd reappears
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
// Picks the new bounty id and commits it to state, but doesn't touch the DOM.
// Split out from pickBounty() so a successful bounty capture can rotate
// state.bountyId the instant it's earned — otherwise state.bountyId stayed
// pointed at the just-captured type for the ~1.6s fly-to-folder animation,
// and a Faster Camera burst (or any second stickman of that type still in
// frame) could cash in the x20 bounty payout several more times before the
// frame visually moved on.
function rollBounty() {
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
}

function pickBounty() {
  rollBounty();
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

// Records a successful capture in the Stickdex and returns whether it's a
// brand-new entry. The Aura Farmer is kept out of state.dex entirely (it's
// not a numbered type, and dex-count-based achievements must stay
// achievable even for a player who never catches it) — it gets its own
// separate one-shot flag and thumbnail instead.
function registerCapture(valueType, photoURL) {
  if (valueType.id === AURA_FARMER_ID) {
    const newCatch = !state.auraFarmerCaught;
    state.auraFarmerCaught = true;
    makeThumb(photoURL, thumb => { state.auraFarmerThumb = thumb; saveDirty = true; });
    return newCatch;
  }
  let newType = false;
  if (!state.dex[valueType.id]) { state.dex[valueType.id] = { c: 0 }; newType = true; }
  state.dex[valueType.id].c++;
  makeThumb(photoURL, thumb => {
    const e = state.dex[valueType.id];
    if (e && !e.t) e.t = thumb;
    saveDirty = true;
  });
  return newType;
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
  const isLuckyBlockFocus = valueType.id === LUCKY_BLOCK_ID;
  if (focus.tripping) state.achFlags.caughtTripping = true; // achievement: "Oops"

  // Multi Capture: every fresh stickman in frame pays out, not just the
  // focus. Only the focus is ever recorded in the Stickdex either way.
  // A Lucky Block never pays out, whether it's the focus or just a
  // background bystander in a Multi Capture photo (see spawnLuckyBlock).
  const payers = fresh.filter(s => s.type.id !== LUCKY_BLOCK_ID && (state.multiCapture || s === focus));
  let gained = 0;
  for (const s of payers) {
    gained += state.bountyId && s.type.id === state.bountyId ? s.type.value * 20 : s.type.value;
    s.shot = true;
  }
  focus.shot = true; // always mark the focus photographed, even a Lucky Block
  // Roll the next bounty target right away so a Faster Camera burst (or a
  // second instance of this type still in frame) can't cash in x20 more than
  // once for the same bounty — only the visual refresh waits for the
  // fly-to-folder animation (see playFrameAnimation).
  if (bountyHit) { rollBounty(); state.bountiesCollected++; }
  if (goldenUntil > performance.now()) gained *= GOLDEN_MONEY_MULT;
  if (state.permCashLevel) gained *= PERM_CASH_MULT_BY_LEVEL[state.permCashLevel];
  state.money += gained;

  let newType = false;
  if (!isLuckyBlockFocus) newType = registerCapture(valueType, photoURL);

  updateMoneyDisplay(true);
  saveDirty = true;

  let replacement = null;
  if (isLuckyBlockFocus) {
    const idx = stickmen.indexOf(focus);
    if (idx !== -1) stickmen.splice(idx, 1);
    const replacementId = 150 + ((Math.random() * 101) | 0); // #150-250 inclusive, uniform
    replacement = spawn(replacementId, true);
    replacement.x = focus.x; replacement.y = focus.y; replacement.dir = focus.dir;
  }

  if (isLuckyBlockFocus) {
    showToast(
      `<span class="t-bounty">LUCKY BLOCK!</span><br>` +
      `It opens and a wild ${replacement.type.name} appears!`
    );
  } else if (valueType.id === AURA_FARMER_ID) {
    showToast(
      `<span class="t-money">+${formatMoney(gained)}</span><br>` +
      `<span class="t-new">AURA FARMER CAPTURED!</span>` +
      (newType ? `<br><span class="t-new">NEW Stickdex entry!</span>` : "")
    );
  } else {
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
  }

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
      if (bountyCaptured) {
        renderBounty(); // rollBounty() already ran immediately in takePhoto() — just catch up the visual
      } else if (Date.now() - state.bountySetAt > BOUNTY_TIMEOUT_MS) {
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
  closeAchievements();
  closeGift();
  cancelPlaceMode();
  buildDex();
  els.stickdex.classList.remove("hidden");
}
function closeDex() { els.stickdex.classList.add("hidden"); }

function buildDex() {
  const found = Object.keys(state.dex).map(Number);
  els.dexCount.textContent = `${found.length}/???`;
  updateMoneyDisplay(false);
  els.dexGrid.innerHTML = "";
  if (found.length === 0 && !state.auraFarmerCaught) {
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
  // Special, unnumbered entry — always last, regardless of rarity sort.
  if (state.auraFarmerCaught) {
    const card = document.createElement("div");
    card.className = "dex-card";
    if (state.auraFarmerThumb) {
      const img = document.createElement("img");
      img.src = state.auraFarmerThumb;
      img.loading = "lazy";
      card.appendChild(img);
    } else {
      card.appendChild(drawAuraFarmerPortrait(160, 120));
    }
    const info = document.createElement("div");
    info.className = "dex-info";
    info.innerHTML =
      `<div class="dex-num dex-num-special">Special</div>` +
      `<div class="dex-name">Aura Farmer</div>` +
      `<div class="dex-desc"></div>` +
      `<div class="dex-photo-count">📷 1</div>`;
    info.querySelector(".dex-desc").textContent =
      "Appeared once, from the free gift. Grinding pure aura — there's only one shot at this.";
    card.appendChild(info);
    frag.appendChild(card);
  }
  els.dexGrid.appendChild(frag);
}

// ------------------------------------------------------------------
// Achievements
// ------------------------------------------------------------------
function openAchievements() {
  if (cameraMode) toggleCamera(false);
  closeDex(); closeShop(); closeGift();
  cancelPlaceMode();
  buildAchievements();
  els.achievements.classList.add("open");
  els.achievementsBackdrop.classList.add("open");
}
function closeAchievements() {
  els.achievements.classList.remove("open");
  els.achievementsBackdrop.classList.remove("open");
}

// ------------------------------------------------------------------
// Free Gift — a one-time claimable reward from the gift icon in the HUD.
// Claiming queues the Aura Farmer (see spawnAuraFarmer) to appear in place
// of the next natural spawn — not instantly. The claim itself is what's
// one-time: once pressed, the player can't reclaim it even if the Aura
// Farmer later walks off-screen unphotographed.
// ------------------------------------------------------------------
function openGift() {
  if (cameraMode) toggleCamera(false);
  closeDex(); closeShop(); closeAchievements();
  cancelPlaceMode();
  renderGift();
  els.giftModal.classList.add("open");
  els.giftBackdrop.classList.add("open");
}
function closeGift() {
  els.giftModal.classList.remove("open");
  els.giftBackdrop.classList.remove("open");
}
function renderGift() {
  els.giftClaimBtn.classList.toggle("hidden", state.auraGiftClaimed);
  els.giftClaimedBadge.classList.toggle("hidden", !state.auraGiftClaimed);
}
function claimAuraGift() {
  if (state.auraGiftClaimed) return;
  state.auraGiftClaimed = true;
  saveDirty = true;
  spawnQueue.push(AURA_FARMER_ID);
  renderGift();
  showToast(`<span class="t-new">Gift claimed!</span> Keep playing — something special is on its way.`);
}

function buildAchievements() {
  els.achList.innerHTML = "";
  const frag = document.createDocumentFragment();
  for (const a of ACHIEVEMENTS) {
    const st = achState(a.key);
    const disp = achDisplay(a);
    const row = document.createElement("div");
    row.className = "ach-row" + (disp.done ? " done" : "");
    const progressText = a.secret && !disp.done ? "???"
      : a.target > 1 ? `${Math.min(a.progress(), a.target)}/${a.target}` : (disp.done ? "Done" : "Locked");
    row.innerHTML =
      `<div class="ach-row-top">` +
        `<span class="ach-row-name"></span>` +
        `<span class="ach-row-progress">${progressText}</span>` +
      `</div>` +
      `<div class="ach-row-desc"></div>` +
      `<div class="ach-row-reward">Reward: <span></span></div>`;
    row.querySelector(".ach-row-name").textContent = disp.name;
    row.querySelector(".ach-row-desc").textContent = disp.desc;
    row.querySelector(".ach-row-reward span").textContent = rewardLabel(a.reward);
    if (disp.done) {
      if (st.claimed) {
        const badge = document.createElement("div");
        badge.className = "ach-claimed-badge";
        badge.textContent = "✓ Claimed";
        row.appendChild(badge);
      } else {
        const btn = document.createElement("button");
        btn.className = "ach-claim-btn";
        btn.textContent = "Claim reward";
        btn.addEventListener("click", () => claimAchievement(a.key));
        row.appendChild(btn);
      }
    }
    frag.appendChild(row);
  }
  els.achList.appendChild(frag);
}

// ------------------------------------------------------------------
// Shop
// ------------------------------------------------------------------
function openShop() {
  if (cameraMode) toggleCamera(false);
  closeDex();
  closeAchievements();
  closeGift();
  cancelPlaceMode();
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

  if (state.permLuck) {
    els.buyPermLuck.textContent = "Owned";
    els.buyPermLuck.disabled = true;
    els.buyPermLuck.classList.add("owned");
  } else {
    els.buyPermLuck.textContent = formatMoney(PERM_LUCK_COST);
    els.buyPermLuck.disabled = state.money < PERM_LUCK_COST;
    els.buyPermLuck.classList.remove("owned");
  }

  const PERM_CASH_DESCS = {
    0: "Permanent 1.25x money from photos.",
    1: "Owned: 1.25x money from photos. Upgrade to 1.5x for $50,000 — replaces the 1.25x, doesn't stack.",
    2: "Owned: 1.5x money from photos."
  };
  els.permCashDesc.textContent = PERM_CASH_DESCS[state.permCashLevel];
  if (state.permCashLevel >= 2) {
    els.buyPermCash.textContent = "Owned";
    els.buyPermCash.disabled = true;
    els.buyPermCash.classList.add("owned");
  } else if (state.permCashLevel === 1) {
    els.buyPermCash.textContent = formatMoney(PERM_CASH_TIER2_COST);
    els.buyPermCash.disabled = state.money < PERM_CASH_TIER2_COST;
    els.buyPermCash.classList.remove("owned");
  } else {
    els.buyPermCash.textContent = formatMoney(PERM_CASH_TIER1_COST);
    els.buyPermCash.disabled = state.money < PERM_CASH_TIER1_COST;
    els.buyPermCash.classList.remove("owned");
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

  els.extraCloverOwnedCount.textContent = state.extraCloverCount;
  els.buyExtraClover.textContent = formatMoney(EXTRA_CLOVER_COST);
  els.buyExtraClover.disabled = state.money < EXTRA_CLOVER_COST || state.extraCloverCount >= EXTRA_CLOVER_MAX;

  els.totemOwnedCount.textContent = state.totemCount;
  els.buyTotem.textContent = formatMoney(TOTEM_COST);
  els.buyTotem.disabled = state.money < TOTEM_COST || state.totemCount >= TOTEM_MAX;

  els.energyDrinkOwnedCount.textContent = state.energyDrinkCount;
  els.buyEnergyDrink.textContent = formatMoney(ENERGY_DRINK_COST);
  els.buyEnergyDrink.disabled = state.money < ENERGY_DRINK_COST || state.energyDrinkCount >= ENERGY_DRINK_MAX;

  els.overtimeOwnedCount.textContent = state.overtimeCount;
  els.buyOvertime.textContent = formatMoney(OVERTIME_COST);
  els.buyOvertime.disabled = state.money < OVERTIME_COST || state.overtimeCount >= OVERTIME_MAX;

  els.equipmentBoxOwnedCount.textContent = state.equipmentBoxCount;
  els.buyEquipmentBox.textContent = formatMoney(EQUIPMENT_BOX_COST);
  els.buyEquipmentBox.disabled = state.money < EQUIPMENT_BOX_COST || state.equipmentBoxCount >= EQUIPMENT_BOX_MAX;

  updateTripodInvBadge();
  updateTimefreezeInvBadge();
  updateLuckyCharmInvBadge();
  updateExtraCloverInvBadge();
  updateTotemInvBadge();
  updateEnergyDrinkInvBadge();
  updateOvertimeInvBadge();
  updateEquipmentBoxInvBadge();
  updateExtraExtraCloverInvBadge();
  updateEnergyOverloadInvBadge();
  updateReliableTripodInvBadge();
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

els.buyPermLuck.addEventListener("click", () => {
  if (state.permLuck || state.money < PERM_LUCK_COST) return;
  state.money -= PERM_LUCK_COST;
  state.permLuck = true;
  saveDirty = true;
  buildShop();
  showToast(`<span class="t-new">Permanent Luck purchased!</span>`);
});

els.buyPermCash.addEventListener("click", () => {
  if (state.permCashLevel === 0) {
    if (state.money < PERM_CASH_TIER1_COST) return;
    state.money -= PERM_CASH_TIER1_COST;
    state.permCashLevel = 1;
    showToast(`<span class="t-new">Permanent Cash Boost purchased! (1.25x)</span>`);
  } else if (state.permCashLevel === 1) {
    if (state.money < PERM_CASH_TIER2_COST) return;
    state.money -= PERM_CASH_TIER2_COST;
    state.permCashLevel = 2;
    showToast(`<span class="t-new">Permanent Cash Boost upgraded! (1.5x)</span>`);
  } else {
    return;
  }
  saveDirty = true;
  buildShop();
});

els.buyTripod.addEventListener("click", () => {
  if (state.money < TRIPOD_COST || state.tripodCount >= TRIPOD_MAX) return;
  state.money -= TRIPOD_COST;
  state.tripodCount++;
  state.achFlags.boughtTripod = true; // achievement: "Tripod!!!"
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

els.buyExtraClover.addEventListener("click", () => {
  if (state.money < EXTRA_CLOVER_COST || state.extraCloverCount >= EXTRA_CLOVER_MAX) return;
  state.money -= EXTRA_CLOVER_COST;
  state.extraCloverCount++;
  saveDirty = true;
  buildShop();
  showToast(`Extra Lucky Charm purchased <small>(${state.extraCloverCount}/${EXTRA_CLOVER_MAX})</small>`);
});

els.buyTotem.addEventListener("click", () => {
  if (state.money < TOTEM_COST || state.totemCount >= TOTEM_MAX) return;
  state.money -= TOTEM_COST;
  state.totemCount++;
  saveDirty = true;
  buildShop();
  showToast(`Totem purchased <small>(${state.totemCount}/${TOTEM_MAX})</small>`);
});

els.buyEnergyDrink.addEventListener("click", () => {
  if (state.money < ENERGY_DRINK_COST || state.energyDrinkCount >= ENERGY_DRINK_MAX) return;
  state.money -= ENERGY_DRINK_COST;
  state.energyDrinkCount++;
  saveDirty = true;
  buildShop();
  showToast(`Energy Drink purchased <small>(${state.energyDrinkCount}/${ENERGY_DRINK_MAX})</small>`);
});

els.buyOvertime.addEventListener("click", () => {
  if (state.money < OVERTIME_COST || state.overtimeCount >= OVERTIME_MAX) return;
  state.money -= OVERTIME_COST;
  state.overtimeCount++;
  saveDirty = true;
  buildShop();
  showToast(`Overtime purchased <small>(${state.overtimeCount}/${OVERTIME_MAX})</small>`);
});

els.buyEquipmentBox.addEventListener("click", () => {
  if (state.money < EQUIPMENT_BOX_COST || state.equipmentBoxCount >= EQUIPMENT_BOX_MAX) return;
  state.money -= EQUIPMENT_BOX_COST;
  state.equipmentBoxCount++;
  saveDirty = true;
  buildShop();
  showToast(`Equipment Box purchased <small>(${state.equipmentBoxCount}/${EQUIPMENT_BOX_MAX})</small>`);
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
// Lucky Charm: place one down to double the spawn weight of rare
// stickmen for 3m (see startPlacing/confirmPlace).
// ------------------------------------------------------------------
function updateLuckyCharmInvBadge() {
  els.luckyCharmInvCount.textContent = state.luckyCharmCount;
  els.luckyCharmInvBtn.classList.toggle("hidden", state.luckyCharmCount <= 0 && !(placeMode && placeKind === "luck"));
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
// Extra Lucky Charm: place one down to triple the spawn weight of rare
// stickmen for 3m (see startPlacing/confirmPlace).
// ------------------------------------------------------------------
function updateExtraCloverInvBadge() {
  els.extraCloverInvCount.textContent = state.extraCloverCount;
  els.extraCloverInvBtn.classList.toggle("hidden", state.extraCloverCount <= 0 && !(placeMode && placeKind === "clover"));
}

function updateCloverTimer(now) {
  if (!cloverUntil) return;
  const remain = cloverUntil - now;
  if (remain <= 0) {
    cloverUntil = 0;
    els.cloverTimer.classList.add("hidden");
  } else {
    els.cloverTimer.classList.remove("hidden");
    els.cloverTimerFill.style.width = (Math.max(0, Math.min(1, remain / EXTRA_CLOVER_DURATION_MS)) * 100) + "%";
    const secs = Math.ceil(remain / 1000);
    els.cloverTimerTime.textContent = Math.floor(secs / 60) + ":" + String(secs % 60).padStart(2, "0");
  }
}

// ------------------------------------------------------------------
// Totem: place one down to boost Rainbow/Golden/Stampede odds 3x for 10m.
// ------------------------------------------------------------------
function updateTotemInvBadge() {
  els.totemInvCount.textContent = state.totemCount;
  els.totemInvBtn.classList.toggle("hidden", state.totemCount <= 0 && !(placeMode && placeKind === "totem"));
}

function updateTotemTimer(now) {
  if (!totemUntil) return;
  const remain = totemUntil - now;
  if (remain <= 0) {
    totemUntil = 0;
    els.totemTimer.classList.add("hidden");
  } else {
    els.totemTimer.classList.remove("hidden");
    els.totemTimerFill.style.width = (Math.max(0, Math.min(1, remain / TOTEM_DURATION_MS)) * 100) + "%";
    const secs = Math.ceil(remain / 1000);
    els.totemTimerTime.textContent = Math.floor(secs / 60) + ":" + String(secs % 60).padStart(2, "0");
  }
}

// ------------------------------------------------------------------
// Energy Drink: one-use, speeds up every stickman on screen for a minute.
// ------------------------------------------------------------------
function updateEnergyDrinkInvBadge() {
  els.energyDrinkInvCount.textContent = state.energyDrinkCount;
  els.energyDrinkInvBtn.classList.toggle("hidden", state.energyDrinkCount <= 0);
}

function useEnergyDrink() {
  if (state.energyDrinkCount <= 0) { showToast("No Energy Drinks left — buy more in the Shop!"); return; }
  state.energyDrinkCount--;
  saveDirty = true;
  energyDrinkUntil = performance.now() + ENERGY_DRINK_DURATION_MS;
  energyOverloadUntil = 0; // Energy Drink and Energy Overload don't stack — the newer one replaces the other
  els.energyOverloadTimer.classList.add("hidden");
  updateEnergyDrinkInvBadge();
  showToast(`<span class="t-bounty">ENERGY DRINK!</span> Everyone speeds up for a minute…`);
}

function updateEnergyDrinkTimer(now) {
  if (!energyDrinkUntil) return;
  const remain = energyDrinkUntil - now;
  if (remain <= 0) {
    energyDrinkUntil = 0;
    els.energyDrinkTimer.classList.add("hidden");
  } else {
    els.energyDrinkTimer.classList.remove("hidden");
    els.energyDrinkTimerFill.style.width = (Math.max(0, Math.min(1, remain / ENERGY_DRINK_DURATION_MS)) * 100) + "%";
    const secs = Math.ceil(remain / 1000);
    els.energyDrinkTimerTime.textContent = Math.floor(secs / 60) + ":" + String(secs % 60).padStart(2, "0");
  }
}

// ------------------------------------------------------------------
// Extra Extra Lucky Charm: box-exclusive, placeable, 4x luck for 3 minutes.
// ------------------------------------------------------------------
function updateExtraExtraCloverInvBadge() {
  els.extraExtraCloverInvCount.textContent = state.extraExtraCloverCount;
  els.extraExtraCloverInvBtn.classList.toggle("hidden", state.extraExtraCloverCount <= 0 && !(placeMode && placeKind === "extraextraclover"));
}

function updateExtraExtraCloverTimer(now) {
  if (!extraExtraCloverUntil) return;
  const remain = extraExtraCloverUntil - now;
  if (remain <= 0) {
    extraExtraCloverUntil = 0;
    els.extraExtraCloverTimer.classList.add("hidden");
  } else {
    els.extraExtraCloverTimer.classList.remove("hidden");
    els.extraExtraCloverTimerFill.style.width = (Math.max(0, Math.min(1, remain / EXTRA_EXTRA_CLOVER_DURATION_MS)) * 100) + "%";
    const secs = Math.ceil(remain / 1000);
    els.extraExtraCloverTimerTime.textContent = Math.floor(secs / 60) + ":" + String(secs % 60).padStart(2, "0");
  }
}

// ------------------------------------------------------------------
// Energy Overload: box-exclusive, one-use, speeds up every stickman on
// screen for 2 minutes — faster than Energy Drink, slower than Stampede.
// ------------------------------------------------------------------
function updateEnergyOverloadInvBadge() {
  els.energyOverloadInvCount.textContent = state.energyOverloadCount;
  els.energyOverloadInvBtn.classList.toggle("hidden", state.energyOverloadCount <= 0);
}

function useEnergyOverload() {
  if (state.energyOverloadCount <= 0) { showToast("No Energy Overloads left!"); return; }
  state.energyOverloadCount--;
  saveDirty = true;
  energyOverloadUntil = performance.now() + ENERGY_OVERLOAD_DURATION_MS;
  energyDrinkUntil = 0; // Energy Drink and Energy Overload don't stack — the newer one replaces the other
  els.energyDrinkTimer.classList.add("hidden");
  updateEnergyOverloadInvBadge();
  showToast(`<span class="t-bounty">ENERGY OVERLOAD!</span> Everyone speeds up for 2 minutes…`);
}

function updateEnergyOverloadTimer(now) {
  if (!energyOverloadUntil) return;
  const remain = energyOverloadUntil - now;
  if (remain <= 0) {
    energyOverloadUntil = 0;
    els.energyOverloadTimer.classList.add("hidden");
  } else {
    els.energyOverloadTimer.classList.remove("hidden");
    els.energyOverloadTimerFill.style.width = (Math.max(0, Math.min(1, remain / ENERGY_OVERLOAD_DURATION_MS)) * 100) + "%";
    const secs = Math.ceil(remain / 1000);
    els.energyOverloadTimerTime.textContent = Math.floor(secs / 60) + ":" + String(secs % 60).padStart(2, "0");
  }
}

// ------------------------------------------------------------------
// Reliable Tripod: box-exclusive placeable Tripod variant (see PLACE_KINDS/
// confirmPlace) — faster shots, bigger range, lasts 5 minutes.
// ------------------------------------------------------------------
function updateReliableTripodInvBadge() {
  els.reliableTripodInvCount.textContent = state.reliableTripodCount;
  els.reliableTripodInvBtn.classList.toggle("hidden", state.reliableTripodCount <= 0 && !(placeMode && placeKind === "reliabletripod"));
}

// ------------------------------------------------------------------
// Equipment Box: one-use, opens into a random item worth no more than its
// own price (so it can never grant Overtime) — including 3 items only
// obtainable this way.
// ------------------------------------------------------------------
function updateEquipmentBoxInvBadge() {
  els.equipmentBoxInvCount.textContent = state.equipmentBoxCount;
  els.equipmentBoxInvBtn.classList.toggle("hidden", state.equipmentBoxCount <= 0);
}

const EQUIPMENT_BOX_GRANTS = {
  tripod: () => { state.tripodCount++; return "Tripod"; },
  timefreeze: () => { state.timeFreezeCount++; return "Time Freeze"; },
  luck: () => { state.luckyCharmCount++; return "Lucky Charm"; },
  clover: () => { state.extraCloverCount++; return "Extra Lucky Charm"; },
  totem: () => { state.totemCount++; return "Totem"; },
  energydrink: () => { state.energyDrinkCount++; return "Energy Drink"; },
  extraextraclover: () => { state.extraExtraCloverCount++; return "Extra Extra Lucky Charm"; },
  energyoverload: () => { state.energyOverloadCount++; return "Energy Overload"; },
  reliabletripod: () => { state.reliableTripodCount++; return "Reliable Tripod"; }
};

function useEquipmentBox() {
  if (state.equipmentBoxCount <= 0) { showToast("No Equipment Boxes left — buy more in the Shop!"); return; }
  state.equipmentBoxCount--;
  saveDirty = true;
  const pick = EQUIPMENT_BOX_POOL[(Math.random() * EQUIPMENT_BOX_POOL.length) | 0];
  const name = EQUIPMENT_BOX_GRANTS[pick]();
  updateEquipmentBoxInvBadge();
  buildShop(); // refreshes every owned count/badge, including whichever item was just granted
  showToast(`<span class="t-new">Equipment Box opened!</span><br>You got: <strong>${name}</strong>`);
}

// ------------------------------------------------------------------
// Overtime: one-use, only usable while a Rainbow/Golden/Stampede event is
// active. Adds extra time to whichever active event(s) haven't already
// had Overtime used on them this instance.
// ------------------------------------------------------------------
function updateOvertimeInvBadge() {
  els.overtimeInvCount.textContent = state.overtimeCount;
  els.overtimeInvBtn.classList.toggle("hidden", state.overtimeCount <= 0);
}

function useOvertime() {
  if (state.overtimeCount <= 0) { showToast("No Overtimes left — buy more in the Shop!"); return; }
  const now = performance.now();
  const rainbowEligible = rainbowUntil > now && !rainbowOvertimeUsed;
  const goldenEligible = goldenUntil > now && !goldenOvertimeUsed;
  const stampedeEligible = stampedeUntil > now && !stampedeOvertimeUsed;
  if (!rainbowEligible && !goldenEligible && !stampedeEligible) {
    showToast(anyEventActive() ? "Overtime already used for this event!" : "No event is active right now!");
    return;
  }
  state.overtimeCount--;
  saveDirty = true;
  const labels = [];
  if (rainbowEligible) { rainbowUntil += OVERTIME_RAINBOW_GOLDEN_BONUS_MS; rainbowOvertimeUsed = true; labels.push("Rainbow"); }
  if (goldenEligible) { goldenUntil += OVERTIME_RAINBOW_GOLDEN_BONUS_MS; goldenOvertimeUsed = true; labels.push("Golden"); }
  if (stampedeEligible) { stampedeUntil += OVERTIME_STAMPEDE_BONUS_MS; stampedeOvertimeUsed = true; labels.push("Stampede"); }
  updateOvertimeInvBadge();
  showToast(`<span class="t-bounty">OVERTIME!</span> +time added to the ${labels.join(" & ")} event…`);
}

// ------------------------------------------------------------------
// Placeable items: Tripods (buy up to 99, place one down and it
// auto-photographs anything that wanders into range for about a minute),
// Totem (boosts event odds while placed), Lucky Charm / Extra Lucky
// Charm (place one to start their luck buff). All four share the same
// aim/place/confirm UI flow; only what happens on confirm differs.
// ------------------------------------------------------------------
let placeMode = null; // null | "aiming" | "pending"
let placeKind = null; // "tripod" | "totem" | "luck" | "clover"
let placePreviewX = 0, placePreviewY = 0;
let pendingPlace = null; // { x, y } once a spot has been tapped/clicked

const PLACE_KINDS = {
  tripod: {
    countOf: () => state.tripodCount,
    emptyMsg: "No tripods left — buy more in the Shop!",
    aimHint: "Tap / click to set the tripod down · ESC to cancel",
    pendingHint: "Confirm the tripod's spot",
    invBtn: () => els.tripodInvBtn
  },
  totem: {
    countOf: () => state.totemCount,
    emptyMsg: "No totems left — buy more in the Shop!",
    aimHint: "Tap / click to set the totem down · ESC to cancel",
    pendingHint: "Confirm the totem's spot",
    invBtn: () => els.totemInvBtn
  },
  luck: {
    countOf: () => state.luckyCharmCount,
    emptyMsg: "No Lucky Charms left — buy more in the Shop!",
    aimHint: "Tap / click to set the charm down · ESC to cancel",
    pendingHint: "Confirm the charm's spot",
    invBtn: () => els.luckyCharmInvBtn
  },
  clover: {
    countOf: () => state.extraCloverCount,
    emptyMsg: "No Extra Lucky Charms left — buy more in the Shop!",
    aimHint: "Tap / click to set the charm down · ESC to cancel",
    pendingHint: "Confirm the charm's spot",
    invBtn: () => els.extraCloverInvBtn
  },
  extraextraclover: {
    countOf: () => state.extraExtraCloverCount,
    emptyMsg: "No Extra Extra Lucky Charms left!",
    aimHint: "Tap / click to set the charm down · ESC to cancel",
    pendingHint: "Confirm the charm's spot",
    invBtn: () => els.extraExtraCloverInvBtn
  },
  reliabletripod: {
    countOf: () => state.reliableTripodCount,
    emptyMsg: "No Reliable Tripods left!",
    aimHint: "Tap / click to set the tripod down · ESC to cancel",
    pendingHint: "Confirm the tripod's spot",
    invBtn: () => els.reliableTripodInvBtn
  }
};

function updateTripodInvBadge() {
  els.tripodInvCount.textContent = state.tripodCount;
  els.tripodInvBtn.classList.toggle("hidden", state.tripodCount <= 0 && !(placeMode && placeKind === "tripod"));
}

function positionPlaceConfirm(x, y) {
  const offsetY = placeKind === "tripod" ? TRIPOD_RANGE : placeKind === "reliabletripod" ? RELIABLE_TRIPOD_RANGE : 30;
  els.placeConfirm.style.left = x + "px";
  els.placeConfirm.style.top = (y - offsetY - 14) + "px";
}

function startPlacing(kind) {
  const info = PLACE_KINDS[kind];
  if (info.countOf() <= 0) { showToast(info.emptyMsg); return; }
  if (cameraMode) toggleCamera(false);
  closeDex(); closeShop(); closeAchievements(); closeGift();
  placeMode = "aiming";
  placeKind = kind;
  pendingPlace = null;
  placePreviewX = vfX || W / 2;
  placePreviewY = vfY || H / 2;
  document.body.classList.add("place-mode", "place-aiming");
  info.invBtn().classList.add("active");
  els.placeHint.classList.remove("hidden");
  els.placeHint.textContent = info.aimHint;
  els.placeConfirm.classList.add("hidden");
}

function placePending(x, y) {
  pendingPlace = { x, y };
  placeMode = "pending";
  document.body.classList.remove("place-aiming"); // show the real cursor again to click confirm/cancel
  els.placeHint.textContent = PLACE_KINDS[placeKind].pendingHint;
  positionPlaceConfirm(x, y);
  els.placeConfirm.classList.remove("hidden");
}

function confirmPlace() {
  if (!pendingPlace) return;
  const now = performance.now();
  const { x, y } = pendingPlace;
  if (placeKind === "tripod") {
    state.tripodCount--;
    tripods.push({ kind: "tripod", x, y, r: TRIPOD_RANGE, cooldownMs: TRIPOD_SHOT_COOLDOWN_MS, placedAt: now, expiresAt: now + TRIPOD_DURATION_MS, lastShotAt: -Infinity });
  } else if (placeKind === "reliabletripod") {
    state.reliableTripodCount--;
    tripods.push({ kind: "reliabletripod", x, y, r: RELIABLE_TRIPOD_RANGE, cooldownMs: RELIABLE_TRIPOD_SHOT_COOLDOWN_MS, placedAt: now, expiresAt: now + RELIABLE_TRIPOD_DURATION_MS, lastShotAt: -Infinity });
    updateReliableTripodInvBadge();
    showToast(`<span class="t-bounty">RELIABLE TRIPOD PLACED!</span> Faster shots, bigger range, 5 minutes…`);
  } else if (placeKind === "extraextraclover") {
    state.extraExtraCloverCount--;
    extraExtraCloverUntil = now + EXTRA_EXTRA_CLOVER_DURATION_MS;
    placedProps.push({ kind: "extraextraclover", x, y, placedAt: now, expiresAt: now + EXTRA_EXTRA_CLOVER_DURATION_MS });
    updateExtraExtraCloverInvBadge();
    showToast(`<span class="t-bounty">EXTRA EXTRA LUCKY CHARM!</span> 4x luck for 3 minutes…`);
  } else if (placeKind === "totem") {
    state.totemCount--;
    totemUntil = now + TOTEM_DURATION_MS;
    placedProps.push({ kind: "totem", x, y, placedAt: now, expiresAt: now + TOTEM_DURATION_MS });
    updateTotemInvBadge();
    showToast(`<span class="t-bounty">TOTEM PLACED!</span> 3x event odds for 10 minutes…`);
  } else if (placeKind === "luck") {
    state.luckyCharmCount--;
    luckUntil = now + LUCKY_CHARM_DURATION_MS;
    placedProps.push({ kind: "luck", x, y, placedAt: now, expiresAt: now + LUCKY_CHARM_DURATION_MS });
    updateLuckyCharmInvBadge();
    showToast(`<span class="t-bounty">LUCKY CHARM!</span> 2x luck for 3 minutes…`);
  } else if (placeKind === "clover") {
    state.extraCloverCount--;
    cloverUntil = now + EXTRA_CLOVER_DURATION_MS;
    placedProps.push({ kind: "clover", x, y, placedAt: now, expiresAt: now + EXTRA_CLOVER_DURATION_MS });
    updateExtraCloverInvBadge();
    showToast(`<span class="t-bounty">EXTRA LUCKY CHARM!</span> 3x luck for 3 minutes…`);
  }
  saveDirty = true;
  exitPlaceMode();
}

function cancelPlaceMode() {
  if (!placeMode) return;
  exitPlaceMode();
}

function exitPlaceMode() {
  if (placeKind) PLACE_KINDS[placeKind].invBtn().classList.remove("active");
  placeMode = null;
  placeKind = null;
  pendingPlace = null;
  document.body.classList.remove("place-mode", "place-aiming");
  els.placeHint.classList.add("hidden");
  els.placeConfirm.classList.add("hidden");
  updateTripodInvBadge();
  updateTotemInvBadge();
  updateLuckyCharmInvBadge();
  updateExtraCloverInvBadge();
  updateExtraExtraCloverInvBadge();
  updateReliableTripodInvBadge();
}

function updateTripods(dt) {
  const now = performance.now();
  for (let i = tripods.length - 1; i >= 0; i--) {
    const tp = tripods[i];
    if (now >= tp.expiresAt) { tripods.splice(i, 1); continue; }
    if (now - tp.lastShotAt < (tp.cooldownMs || TRIPOD_SHOT_COOLDOWN_MS)) continue;
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

function updatePlacedProps() {
  const now = performance.now();
  for (let i = placedProps.length - 1; i >= 0; i--) {
    if (now >= placedProps[i].expiresAt) placedProps.splice(i, 1);
  }
}

function tripodCapture(tp, focus) {
  tp.lastShotAt = performance.now();
  const label = tp.kind === "reliabletripod" ? "reliable tripod" : "tripod";
  const photoURL = snapshotRegion(tp.x - tp.r, tp.y - tp.r, tp.r * 2, tp.r * 2, focus);
  state.shots++;

  const valueType = focus.type;
  const isLuckyBlockFocus = valueType.id === LUCKY_BLOCK_ID;
  if (focus.tripping) state.achFlags.caughtTripping = true; // achievement: "Oops"
  const bountyHit = state.bountyId === valueType.id;
  let gained = isLuckyBlockFocus ? 0 : (bountyHit ? valueType.value * 20 : valueType.value);
  if (goldenUntil > performance.now()) gained *= GOLDEN_MONEY_MULT;
  if (state.permCashLevel) gained *= PERM_CASH_MULT_BY_LEVEL[state.permCashLevel];
  state.money += gained;

  focus.shot = true;
  let newType = false;
  if (!isLuckyBlockFocus) newType = registerCapture(valueType, photoURL);

  updateMoneyDisplay(true);
  saveDirty = true;
  tripodFlashes.push({ x: tp.x, y: tp.y, t: 0 });

  let replacement = null;
  if (isLuckyBlockFocus) {
    const idx = stickmen.indexOf(focus);
    if (idx !== -1) stickmen.splice(idx, 1);
    const replacementId = 150 + ((Math.random() * 101) | 0); // #150-250 inclusive, uniform
    replacement = spawn(replacementId, true);
    replacement.x = focus.x; replacement.y = focus.y; replacement.dir = focus.dir;
  }

  if (isLuckyBlockFocus) {
    showToast(
      `<span class="t-bounty">LUCKY BLOCK!</span> <small>(${label})</small><br>` +
      `It opens and a wild ${replacement.type.name} appears!`
    );
  } else if (valueType.id === AURA_FARMER_ID) {
    showToast(
      `<span class="t-money">+${formatMoney(gained)}</span> <small>(${label})</small><br>` +
      `<span class="t-new">AURA FARMER CAPTURED!</span>` +
      (newType ? `<br><span class="t-new">NEW Stickdex entry!</span>` : "")
    );
  } else {
    showToast(
      `<span class="t-money">+${formatMoney(gained)}</span> <small>(${label})</small><br>` +
      (bountyHit ? `<span class="t-bounty">BOUNTY x20!</span> ` : "") +
      `${valueType.name} <small>(${formatRarity(valueType.r)})</small>` +
      (newType ? `<br><span class="t-new">NEW Stickdex entry!</span>` : "")
    );
  }

  if (bountyHit) state.bountiesCollected++;
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

function drawTotemIcon(ctx, x, y, opts) {
  opts = opts || {};
  ctx.save();
  ctx.globalAlpha *= opts.alpha === undefined ? 1 : opts.alpha;
  ctx.fillStyle = "#9e9e9e"; ctx.strokeStyle = "#424242"; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.rect(x - 10, y - 8, 20, 10); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = "#757575"; ctx.lineCap = "round"; ctx.lineWidth = 2.4;
  ctx.beginPath(); ctx.arc(x, y - 26, 3.4, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y - 22.6); ctx.lineTo(x, y - 12);
  ctx.moveTo(x, y - 20); ctx.lineTo(x - 7, y - 28);
  ctx.moveTo(x, y - 20); ctx.lineTo(x + 7, y - 28);
  ctx.moveTo(x, y - 12); ctx.lineTo(x - 5, y - 8);
  ctx.moveTo(x, y - 12); ctx.lineTo(x + 5, y - 8);
  ctx.stroke();
  ctx.restore();
}

function drawCharmIcon(ctx, x, y, opts, color, sizeMult) {
  opts = opts || {};
  sizeMult = sizeMult || 1;
  ctx.save();
  ctx.globalAlpha *= opts.alpha === undefined ? 1 : opts.alpha;
  ctx.fillStyle = color || "#2e7d32"; ctx.strokeStyle = "#1b5e20"; ctx.lineWidth = 1.4;
  const r = 5 * sizeMult, cy = y - 14;
  for (const [dx, dy] of [[-r * 0.85, -r * 0.85], [r * 0.85, -r * 0.85], [-r * 0.85, r * 0.85], [r * 0.85, r * 0.85]]) {
    ctx.beginPath(); ctx.arc(x + dx, cy + dy, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  }
  ctx.beginPath(); ctx.moveTo(x, cy + r * 0.85); ctx.lineTo(x, y); ctx.stroke();
  ctx.restore();
}

function drawReliableTripodIcon(ctx, x, y, opts) {
  opts = opts || {};
  ctx.save();
  ctx.globalAlpha *= opts.alpha === undefined ? 1 : opts.alpha;
  ctx.strokeStyle = "#1565c0"; ctx.lineWidth = 3; ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x, y - 22); ctx.lineTo(x, y - 8);
  ctx.moveTo(x, y - 8); ctx.lineTo(x - 13, y + 15);
  ctx.moveTo(x, y - 8); ctx.lineTo(x + 13, y + 15);
  ctx.moveTo(x, y - 8); ctx.lineTo(x, y + 17);
  ctx.stroke();
  ctx.fillStyle = "#1565c0"; ctx.strokeStyle = "#0d47a1"; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.rect(x - 9, y - 31, 18, 11); ctx.fill(); ctx.stroke();
  ctx.fillStyle = "#fff";
  ctx.font = "bold 9px sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.fillText("R", x, y - 25.5);
  ctx.restore();
}

function drawPlaceKindIcon(kind, x, y, opts) {
  if (kind === "tripod") drawTripodIcon(ctx, x, y, opts);
  else if (kind === "reliabletripod") drawReliableTripodIcon(ctx, x, y, opts);
  else if (kind === "totem") drawTotemIcon(ctx, x, y, opts);
  else if (kind === "luck") drawCharmIcon(ctx, x, y, opts, "#43a047");
  else if (kind === "clover") drawCharmIcon(ctx, x, y, opts, "#00c853");
  else if (kind === "extraextraclover") drawCharmIcon(ctx, x, y, opts, "#00e676", 1.35);
}

function drawPlacedItems(t) {
  for (const tp of tripods) {
    if (tp.kind === "reliabletripod") drawReliableTripodIcon(ctx, tp.x, tp.y);
    else drawTripodIcon(ctx, tp.x, tp.y);
  }
  for (const fl of tripodFlashes) {
    const a = 1 - fl.t / 0.45;
    ctx.save();
    ctx.globalAlpha = a * 0.6;
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(fl.x, fl.y, TRIPOD_RANGE * (0.3 + fl.t), 0, Math.PI * 2); ctx.stroke();
    ctx.restore();
  }
  for (const p of placedProps) {
    if (p.kind === "totem") drawTotemIcon(ctx, p.x, p.y);
    else if (p.kind === "luck") drawCharmIcon(ctx, p.x, p.y, null, "#43a047");
    else if (p.kind === "clover") drawCharmIcon(ctx, p.x, p.y, null, "#00c853");
    else if (p.kind === "extraextraclover") drawCharmIcon(ctx, p.x, p.y, null, "#00e676", 1.35);
  }
  if (placeMode === "aiming") {
    if (placeKind === "tripod") drawTripodRange(ctx, placePreviewX, placePreviewY, TRIPOD_RANGE);
    else if (placeKind === "reliabletripod") drawTripodRange(ctx, placePreviewX, placePreviewY, RELIABLE_TRIPOD_RANGE);
    drawPlaceKindIcon(placeKind, placePreviewX, placePreviewY, { alpha: 0.5 });
  } else if (placeMode === "pending" && pendingPlace) {
    if (placeKind === "tripod") drawTripodRange(ctx, pendingPlace.x, pendingPlace.y, TRIPOD_RANGE);
    else if (placeKind === "reliabletripod") drawTripodRange(ctx, pendingPlace.x, pendingPlace.y, RELIABLE_TRIPOD_RANGE);
    drawPlaceKindIcon(placeKind, pendingPlace.x, pendingPlace.y, { alpha: 0.5 });
  }
}

// ------------------------------------------------------------------
// Input
// ------------------------------------------------------------------
els.cameraBtn.addEventListener("click", () => { closeShop(); closeGift(); cancelPlaceMode(); toggleCamera(); });
els.folderBtn.addEventListener("click", openDex);
els.dexBack.addEventListener("click", closeDex);
els.shopBtn.addEventListener("click", openShop);
els.shopBack.addEventListener("click", closeShop);
els.achievementsBtn.addEventListener("click", openAchievements);
els.achBack.addEventListener("click", closeAchievements);
els.achievementsBackdrop.addEventListener("click", closeAchievements);
els.giftBtn.addEventListener("click", openGift);
els.giftClose.addEventListener("click", closeGift);
els.giftBackdrop.addEventListener("click", closeGift);
els.giftClaimBtn.addEventListener("click", claimAuraGift);
function makePlaceToggle(kind) {
  return () => {
    if (placeMode && placeKind === kind) cancelPlaceMode();
    else startPlacing(kind);
  };
}
els.tripodInvBtn.addEventListener("click", makePlaceToggle("tripod"));
els.totemInvBtn.addEventListener("click", makePlaceToggle("totem"));
els.luckyCharmInvBtn.addEventListener("click", makePlaceToggle("luck"));
els.extraCloverInvBtn.addEventListener("click", makePlaceToggle("clover"));
els.extraExtraCloverInvBtn.addEventListener("click", makePlaceToggle("extraextraclover"));
els.reliableTripodInvBtn.addEventListener("click", makePlaceToggle("reliabletripod"));
els.placeConfirmYes.addEventListener("click", confirmPlace);
els.placeConfirmNo.addEventListener("click", cancelPlaceMode);
els.timefreezeInvBtn.addEventListener("click", useTimeFreeze);
els.energyDrinkInvBtn.addEventListener("click", useEnergyDrink);
els.overtimeInvBtn.addEventListener("click", useOvertime);
els.equipmentBoxInvBtn.addEventListener("click", useEquipmentBox);
els.energyOverloadInvBtn.addEventListener("click", useEnergyOverload);

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
    if (placeMode) cancelPlaceMode();
    else if (!els.stickdex.classList.contains("hidden")) closeDex();
    else if (!els.shop.classList.contains("hidden")) closeShop();
    else if (els.achievements.classList.contains("open")) closeAchievements();
    else if (els.giftModal.classList.contains("open")) closeGift();
    else if (cameraMode) toggleCamera(false);
  }
  if (e.key === "c" || e.key === "C") toggleCamera();
});

if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
  window.__debug = {
    stickmen, portals, state, buildShop, spawn, spawnQueue, particles,
    startRainbowEvent, startGoldenEvent, startStampedeEvent, useOvertime, anyEventActive,
    peek: () => ({
      money: state.money, fasterCamera: state.fasterCamera,
      tripodCount: state.tripodCount, timeFreezeCount: state.timeFreezeCount,
      luckyCharmCount: state.luckyCharmCount,
      placeMode, placeKind, tripods: tripods.length, placedProps: placedProps.length, timeFreezeUntil, luckUntil, totemUntil, energyDrinkUntil,
      energyOverloadUntil, extraExtraCloverUntil,
      rainbowUntil, goldenUntil, stampedeUntil, rainbowOvertimeUsed, goldenOvertimeUsed, stampedeOvertimeUsed,
      now: performance.now()
    }),
    peekAura: () => (auraEvent
      ? { phase: auraEvent.phase, t: auraEvent.t, farmerX: auraEvent.farmer.x, hoopX: auraEvent.hoopX, hoopY: auraEvent.hoopY, scored: auraEvent.scored, hiddenCount: auraHiddenStickmen.length }
      : null)
  };
}

window.addEventListener("mousemove", e => {
  if (cameraMode) setViewfinder(e.clientX, e.clientY);
  else if (placeMode === "aiming") { placePreviewX = e.clientX; placePreviewY = e.clientY; }
});
canvas.addEventListener("click", e => {
  if (cameraMode) { setViewfinder(e.clientX, e.clientY); takePhoto(); }
  else if (placeMode === "aiming") { placePending(e.clientX, e.clientY); }
});
canvas.addEventListener("touchstart", e => {
  if (cameraMode) { e.preventDefault(); const t = e.touches[0]; setViewfinder(t.clientX, t.clientY); }
  else if (placeMode === "aiming") { e.preventDefault(); const t = e.touches[0]; placePending(t.clientX, t.clientY); }
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
  updateStampedeEvent(now);
  updateLuckTimer(now);
  updateCloverTimer(now);
  updateTotemTimer(now);
  updateEnergyDrinkTimer(now);
  updateExtraExtraCloverTimer(now);
  updateEnergyOverloadTimer(now);
  checkAchievements(dt);

  const frozen = now < timeFreezeUntil;
  const stampeding = now < stampedeUntil;
  const energized = now < energyDrinkUntil;
  const overloaded = now < energyOverloadUntil;
  let worldDt = dt;
  if (frozen) {
    worldDt = dt * TIME_FREEZE_SCALE;
  } else {
    let speedMult = 1;
    if (stampeding) speedMult *= STAMPEDE_SPEED_MULT;
    if (energized) speedMult *= ENERGY_DRINK_SPEED_MULT;
    if (overloaded) speedMult *= ENERGY_OVERLOAD_SPEED_MULT;
    worldDt = dt * speedMult;
  }
  updateWorld(worldDt, t);
  updatePortals(dt);
  updateTripods(dt);
  updatePlacedProps();

  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, W, H);

  drawPortals(t);
  drawAuraHoop();
  drawParticles(dt, t);

  stickmen.sort((a, b) => a.y - b.y);
  for (const s of stickmen) drawStickman(ctx, s, t);
  drawAuraBallShot();

  drawPlacedItems(t);

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
// location.reload() (inside flagTamperedAndWipe) doesn't halt this synchronous
// script — skip the check here if a reload was just triggered, since the
// sessionStorage flag it just set needs to survive to the NEXT (fresh) load.
if (!wiping) {
  const tamperReason = sessionStorage.getItem(TAMPER_MSG_KEY);
  if (tamperReason) {
    sessionStorage.removeItem(TAMPER_MSG_KEY);
    showToast(tamperReason === "tampered"
      ? "Save reset — this file was modified outside normal play."
      : "Progress reset — a security update required all saves to restart fresh.");
  }
}
rainbowCheckBlock = Math.floor(state.playMinutes / RAINBOW_CHECK_INTERVAL_MIN); // don't retroactively roll past blocks
goldenCheckBlock = Math.floor(state.playMinutes / GOLDEN_CHECK_INTERVAL_MIN);   // don't retroactively roll past blocks
updateMoneyDisplay(false);
updateTripodInvBadge();
updateTimefreezeInvBadge();
updateLuckyCharmInvBadge();
updateExtraCloverInvBadge();
updateTotemInvBadge();
updateEnergyDrinkInvBadge();
updateOvertimeInvBadge();
updateEquipmentBoxInvBadge();
updateExtraExtraCloverInvBadge();
updateEnergyOverloadInvBadge();
updateReliableTripodInvBadge();
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
