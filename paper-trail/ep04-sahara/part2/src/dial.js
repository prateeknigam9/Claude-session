// dial.js - the "look" dial (Case 03 restyle, 2026-11-10). Load after cutout.js and the props, before the scenes.
//
//   0 = mixed:   bright editorial collage. Paper colours snap to a bold flat palette (navy, yellow, coral, off-white),
//                big colour fields get halftone dots, lifted props get white cut-out borders, light and grain stay clean.
//   1 = diorama: sepia newsprint documentary. A sepia grade over the frame, newsprint lines printed on the paper,
//                heavy grain and vignette.
//
// The dial is keyed in planned (story) time, like SHOTS, so it follows the scenes whatever voice take is warped in.
// The episode's accent stays out of the sepia grade: the semi truck, and any piece drawn with { keep: 1 }.
// Every frame is still a pure function of t.
const DIAL = {
  // cold open: bright until the tease, then drains to 0.6 over its last line ("...a courtroom, a bankruptcy...")
  keys: [[0, 0], [56.4, 0], [63.1, .6]],
  pal: { deep: '#141B30', navy: '#1E2A4A', blue: '#2F4A85', teal: '#2C9A93', yellow: '#F2C230', coral: '#E8604C', off: '#F6F1E6' },
  m: 0,          // the dial at the frame being drawn
  used: false,   // a kept (accent) piece was drawn on the main canvas this frame
};
const dialAt = t => kf(t, DIAL.keys);
const dialMixed = () => 1 - clamp(DIAL.m * 2);            // mixed features: full at 0, gone by 0.5
const dialDio = () => clamp((DIAL.m - .2) / .8);           // diorama features: start at 0.2, full at 1

// ---------- colour: paper colour -> the mixed palette ----------
const DIAL_TGT = new Map();
function dialTarget(col) {
  let t = DIAL_TGT.get(col); if (t) return t;
  const n = parseInt(col.slice(1), 16), r = (n >> 16 & 255) / 255, g = (n >> 8 & 255) / 255, b = (n & 255) / 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn;
  const s = d ? d / (1 - Math.abs(2 * l - 1)) : 0;
  let h = 0; if (d) h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h = (h * 60 + 360) % 360;
  const P = DIAL.pal;
  if (l < .13) t = P.deep;
  else if (l < .3) t = s > .45 && (h < 20 || h > 330) ? P.coral : P.navy;
  else if (l > .84) t = P.off;
  else if (h >= 12 && h <= 38 && s > .25 && s < .72 && l > .5 && l < .8) t = col;   // skin tones stay as they are
  else if (s < .14) t = l > .6 ? P.off : P.navy;                                    // greys
  else if (h < 22 || h >= 330) t = P.coral;
  else if (h < 62) t = P.yellow;
  else if (h < 175) t = P.teal;
  else t = P.blue;
  DIAL_TGT.set(col, t); return t;
}
const dialCol = col => (typeof col === 'string' && /^#[0-9a-f]{6}$/i.test(col) && dialMixed() > 0) ? mixCol(col, dialTarget(col), .85 * dialMixed()) : col;

// ---------- textures: halftone dots (mixed) and newsprint lines (diorama), printed onto the paper ----------
const DIAL_TEX = {};
function dialTextures() {
  const ht = makeCanvas(18, 18), a = ht.getContext('2d');
  a.fillStyle = '#fff'; a.fillRect(0, 0, 18, 18); a.fillStyle = '#000';
  for (const [x, y] of [[4.5, 4.5], [13.5, 13.5]]) { a.beginPath(); a.arc(x, y, 2.8, 0, TAU); a.fill(); }
  DIAL_TEX.ht = OUT.createPattern(ht, 'repeat');
  const nw = makeCanvas(420, 300), b = nw.getContext('2d'), r = rnd('dial-news');
  b.fillStyle = '#fff'; b.fillRect(0, 0, 420, 300); b.fillStyle = '#6E6352';
  for (let cx = 6; cx < 420; cx += 70) for (let y = 8; y < 296; y += 9) { const end = r() < .12; b.fillRect(cx, y, end ? 58 * (.3 + r() * .4) : 58, 2.4); if (end) y += 6; }
  DIAL_TEX.news = OUT.createPattern(nw, 'repeat');
  DIAL.keepC = makeCanvas(); DIAL.keepX = DIAL.keepC.getContext('2d');
  DIAL.snapC = makeCanvas(); DIAL.snapX = DIAL.snapC.getContext('2d');
  DIAL.keepL = makeCanvas(); DIAL.keepLX = DIAL.keepL.getContext('2d');
}
function dialSize(shape) {
  if (shape._dial != null) return shape._dial;
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; for (const p of shape) { x0 = Math.min(x0, p[0]); x1 = Math.max(x1, p[0]); y0 = Math.min(y0, p[1]); y1 = Math.max(y1, p[1]); }
  return (shape._dial = Math.max(x1 - x0, y1 - y0));
}

// ---------- the piece, with the dial applied (same contract as cutout.js) ----------
piece = function (shape, o = {}) {
  if (PAPER.dry || !shape || shape.length < 3) return;
  const seed = o.seed ?? 1, col = dialCol(o.col || PC.cream), kind = o.mat || 'paper', P = cutOf(shape, seed, o);
  let x = o.x || 0, y = o.y || 0, rot = o.rot || 0;
  const jit = o.jit ?? PAPER.jit;
  if (jit) { const h = seed * 13.17 + PAPER.step * 7.31; x += (hash(h) - .5) * 2 * jit; y += (hash(h + 1.7) - .5) * 2 * jit; rot += (hash(h + 3.1) - .5) * .7 * jit; }
  G.save(); G.translate(x, y); if (rot) G.rotate(rot * D2R); if (o.sx != null || o.sy != null) G.scale(o.sx ?? 1, o.sy ?? o.sx ?? 1);
  const k = curScale(), tissue = kind === 'tissue', size = dialSize(shape), depth = o.depth ?? 1, mixA = dialMixed(), dioA = dialDio();
  if (o.alpha != null) G.globalAlpha *= o.alpha;
  if (tissue) { G.globalAlpha *= .8; G.globalCompositeOperation = 'multiply'; }
  setShadow(depth * (tissue ? .35 : 1), k);
  // mixed: a white cut-out border round lifted props (not backgrounds, not tissue)
  const keep = o.keep || PAPER.keep, border = !tissue && mixA > 0 && depth >= 1.7 && size < 900 && o.edge !== false;
  if (border) { const a0 = G.globalAlpha; G.globalAlpha = a0 * mixA; G.lineJoin = 'round'; G.lineWidth = 9 / k; G.strokeStyle = '#FFFFFF'; G.stroke(P.outer); G.globalAlpha = a0; }
  const pat = matPat(col, kind, seed);
  if (P.inner) {
    G.fillStyle = o.rim || rimOf(col); G.fill(P.outer); noShadow();
    G.lineWidth = .9 / k * (k > 1 ? k * .7 : 1); G.strokeStyle = o.rim || rimOf(col); G.stroke(P.fib);
    G.fillStyle = pat; G.fill(P.inner);
  } else { G.fillStyle = pat; G.fill(P.outer); noShadow(); }
  // printed textures, multiplied onto the paper so they move with it
  if (!tissue && !keep && (mixA > 0 && size >= 500 || dioA > 0 && size >= 180)) {
    const a0 = G.globalAlpha, op = G.globalCompositeOperation; G.globalCompositeOperation = 'multiply';
    if (mixA > 0 && size >= 500 && !keep) { G.globalAlpha = a0 * .13 * mixA; G.fillStyle = DIAL_TEX.ht; G.fill(P.inner || P.outer); }
    if (dioA > 0 && size >= 180 && !keep) { G.globalAlpha = a0 * .3 * dioA; G.fillStyle = DIAL_TEX.news; G.fill(P.inner || P.outer); }
    G.globalAlpha = a0; G.globalCompositeOperation = op;
  }
  if (!tissue && o.edge !== false) { G.lineWidth = Math.max(.8, 1.3 / k); G.strokeStyle = 'rgba(52,30,16,.2)'; G.stroke(P.outer); }
  // the accent: remember where it is, so the sepia grade leaves it alone
  if (keep && G === OUT && dioA > 0) {
    const K = DIAL.keepX; K.setTransform(G.getTransform()); K.fillStyle = '#fff'; K.fill(P.outer);
    if (border) { K.lineWidth = 9 / k; K.strokeStyle = '#fff'; K.stroke(P.outer); }
    DIAL.used = true;
  }
  G.restore();
};
// the semi truck is the accent ("a huge white truck"): it stays white when the world goes sepia
if (typeof semi === 'function') { const semi0 = semi; semi = function (...a) { const was = PAPER.keep; PAPER.keep = true; try { return semi0(...a); } finally { PAPER.keep = was; } }; }

// ---------- the frame: sepia grade, then the engine's own finish with the dial's light and grain ----------
function dialGrade() {
  const d = dialDio(); if (d <= 0) return;
  const S = DIAL.snapX; S.setTransform(1, 0, 0, 1, 0, 0); S.globalCompositeOperation = 'copy'; S.drawImage(OUTC, 0, 0);
  const c = OUT; c.save(); c.setTransform(1, 0, 0, 1, 0, 0); noShadow(c); c.globalAlpha = 1; c.globalCompositeOperation = 'copy';
  c.filter = `sepia(${(.92 * d).toFixed(3)}) saturate(${(1 - .35 * d).toFixed(3)}) contrast(${(1 + .1 * d).toFixed(3)}) brightness(${(1 - .06 * d).toFixed(3)})`;
  c.drawImage(DIAL.snapC, 0, 0); c.filter = 'none'; c.globalCompositeOperation = 'source-over';
  if (DIAL.used) {
    const L = DIAL.keepLX; L.setTransform(1, 0, 0, 1, 0, 0); L.globalCompositeOperation = 'copy'; L.drawImage(DIAL.snapC, 0, 0);
    L.globalCompositeOperation = 'destination-in'; L.drawImage(DIAL.keepC, 0, 0); L.globalCompositeOperation = 'source-over';
    c.drawImage(DIAL.keepL, 0, 0);
  }
  c.restore();
}
{
  const setup0 = ENGINE.setup, begin0 = ENGINE.begin, end0 = ENGINE.end;
  ENGINE.setup = async () => { await setup0(); dialTextures(); };
  ENGINE.begin = t => {
    begin0(t); DIAL.m = dialAt(t); DIAL.used = false;
    const K = DIAL.keepX; K.setTransform(1, 0, 0, 1, 0, 0); K.clearRect(0, 0, W, H);
    PAPER.vignette = lerp(.35, 1.35, DIAL.m); PAPER.grain = lerp(.6, 2.6, DIAL.m);   // clean collage light -> heavy documentary grain
  };
  ENGINE.end = t => { dialGrade(); end0(t); };
}
