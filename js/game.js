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
  dexGrid: document.getElementById("dex-grid")
};

const SAVE_KEY = "stickmanArchiveSaveV1";
const FRAME_COOLDOWN_MS = 10 * 60 * 1000; // same type can't be the bounty within 10 minutes
const BOUNTY_TIMEOUT_MS = 10 * 60 * 1000;

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
  bountySetAt: 0
};

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
let cumWeights = null, cumTotal = 0, weightsBountyId = -1;

function rebuildWeights() {
  if (cumWeights && weightsBountyId === state.bountyId) return;
  weightsBountyId = state.bountyId;
  cumWeights = new Float64Array(TYPES.length);
  let acc = 0;
  for (let i = 0; i < TYPES.length; i++) {
    let w = TYPES[i].r;
    if (state.bountyId === i + 1) w *= 1.5;
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

// TEST ONLY (remove for release): types queued here replace upcoming natural
// spawns one-for-one, so the population never grows past the normal cap.
const testQueue = [];

// King's-guard knights live outside the population budget: while they're
// alive the count runs over the cap, and when they leave nothing replaces
// them — so escorts can never inflate the world population.
let escortAlive = 0;

function spawn(typeId, onScreen) {
  let id = typeId || sampleTypeId();
  if (!typeId && testQueue.length) id = testQueue.shift(); // TEST ONLY
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

let nextTripAt = 25 + Math.random() * 45; // runtime seconds until the next possible trip

function updateWorld(dt, t) {
  updateKingFlash(dt);
  const max = maxOnScreen();
  // escorts don't count toward the cap, and aren't replaced when they leave.
  // (population is frozen during the coronation — nobody new wanders in.)
  if (!kingEvent && stickmen.length - escortAlive < max) spawn(null, false); // refill one per frame, staggered

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
  const cdLeft = SHOT_COOLDOWN_MS - (performance.now() - lastShotAt);
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

  lastShotAt = performance.now();
  els.viewfinder.classList.add("cooling");
  setTimeout(() => els.viewfinder.classList.remove("cooling"), SHOT_COOLDOWN_MS);

  // the focus: bounty type if in frame, else the rarest fresh stickman.
  // Only the focus is photographed — everyone else is blurred background.
  const bountyHit = state.bountyId ? fresh.find(s => s.type.id === state.bountyId) : null;
  const focus = bountyHit || fresh.reduce((a, s) => (s.type.r < a.type.r ? s : a), fresh[0]);

  const photoURL = snapshotRegion(rx, ry, rw, rh, focus);
  state.shots++;

  const valueType = focus.type;
  const gained = bountyHit ? valueType.value * 20 : valueType.value;
  state.money += gained;

  // record only the focus in the Stickdex
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

  const others = captured.length - 1;
  showToast(
    `<span class="t-money">+${formatMoney(gained)}</span><br>` +
    (bountyHit ? `<span class="t-bounty">BOUNTY x20!</span> ` : "") +
    `${valueType.name} <small>(${formatRarity(valueType.r)})</small>` +
    (others > 0 ? ` <small>+${others} in the background</small>` : "") +
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
// Input
// ------------------------------------------------------------------
els.cameraBtn.addEventListener("click", () => toggleCamera());
els.folderBtn.addEventListener("click", openDex);
els.dexBack.addEventListener("click", closeDex);

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
    if (!els.stickdex.classList.contains("hidden")) closeDex();
    else if (cameraMode) toggleCamera(false);
  }
  if (e.key === "c" || e.key === "C") toggleCamera();
});

// ---- TEST ONLY: spawn panel — remove this whole block for release ----
{
  const testBtn = document.getElementById("test-btn");
  const testPanel = document.getElementById("test-panel");
  const testSearch = document.getElementById("test-search");
  const testList = document.getElementById("test-list");
  let testListBuilt = false;
  testBtn.addEventListener("click", () => {
    if (!testListBuilt) {
      testListBuilt = true;
      const frag = document.createDocumentFragment();
      for (const type of TYPES) {
        const row = document.createElement("div");
        row.className = "test-row";
        row.dataset.id = type.id;
        row.textContent = `#${type.id} ${type.name}`;
        row.title = type.desc;
        frag.appendChild(row);
      }
      testList.appendChild(frag);
    }
    testPanel.classList.toggle("hidden");
    if (!testPanel.classList.contains("hidden")) testSearch.focus();
  });
  testSearch.addEventListener("input", () => {
    const q = testSearch.value.trim().toLowerCase();
    for (const row of testList.children) {
      row.style.display = !q || row.textContent.toLowerCase().includes(q) ? "" : "none";
    }
  });
  testList.addEventListener("click", e => {
    const row = e.target.closest(".test-row");
    if (!row) return;
    const id = Number(row.dataset.id);
    testQueue.push(id);
    showToast(`Queued <b>${TYPES[id - 1].name}</b> — it replaces the next natural spawn (${testQueue.length} waiting)`);
  });
  // ?queue=1,2,3 pre-queues type ids (handy for headless screenshots)
  const preQueue = new URLSearchParams(location.search).get("queue");
  if (preQueue) {
    for (const id of preQueue.split(",").map(Number)) {
      if (TYPES[id - 1]) testQueue.push(id);
    }
  }
  window.__debug = { stickmen, portals, testQueue }; // headless inspection hook
}

window.addEventListener("mousemove", e => {
  if (cameraMode) setViewfinder(e.clientX, e.clientY);
});
canvas.addEventListener("click", e => {
  if (cameraMode) { setViewfinder(e.clientX, e.clientY); takePhoto(); }
});
canvas.addEventListener("touchstart", e => {
  if (cameraMode) { e.preventDefault(); const t = e.touches[0]; setViewfinder(t.clientX, t.clientY); }
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

  updateWorld(dt, t);
  updatePortals(dt);

  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, W, H);

  drawPortals(t);
  drawParticles(dt, t);

  stickmen.sort((a, b) => a.y - b.y);
  for (const s of stickmen) drawStickman(ctx, s, t);

  requestAnimationFrame(frame);
}

// ------------------------------------------------------------------
// Boot
// ------------------------------------------------------------------
loadState();
updateMoneyDisplay(false);
if (state.bountyId) renderBounty(); else pickBounty();

// initial population spread across the screen
const initial = maxOnScreen();
for (let i = 0; i < initial; i++) spawn(null, true);

setInterval(() => { saveDirty = true; saveState(); }, 8000);
window.addEventListener("beforeunload", () => saveState(true));
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") saveState(true);
});

requestAnimationFrame(frame);

})();
