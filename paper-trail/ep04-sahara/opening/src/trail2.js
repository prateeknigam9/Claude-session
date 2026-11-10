// trail2.js — Paper Trail kit v2 (loads after trail.js). Built from the refs/mood boards.
//
// Tier 1: handwriting (handText, note, checklist, timelineCard), marker annotations that draw themselves on
//         (markerCircle/Line/Arrow/Tick, scribble, doodleStar, paintMark), redaction bars (redact), fastenings
//         (tape, redCorner, safetyPin, map pins → pinCard({ fasten })), aged paper (ageOver, coffeeRing, crease,
//         clipping({ aged, mast: 'black' })), desk props (calculator, alarmClock, deskGlasses, pencil, stopwatch,
//         filmStrip, ticket, postStamp, lampGlow), trendCard.
// Tier 2: suspectPhoto (the cast as sepia polaroids), clippingWall (cached wall of newsprint), blackPanel + markerText,
//         sliceFx (a subject cut into sliding strips), tornReveal (tear a hole through a layer), xeroxFx (photocopy look).
// k arguments are 0 → 1 progress values; drive them with seg(sm(lt), t0, t1) for stop-motion steps.

TF.hand = '"Caveat", "Segoe Print", cursive'; TF.marker = '"Permanent Marker", "Caveat", cursive'; TF.black = '"UnifrakturMaguntia", "Old English Text MT", serif';
{ const _setup = ENGINE.setup;
  ENGINE.setup = async () => {
    await Promise.all([`700 40px ${TF.hand}`, `600 40px ${TF.hand}`, `40px ${TF.marker}`, `40px ${TF.black}`].map(s => document.fonts.load(s, 'AZaz0123456789$?!').catch(() => { })));
    await _setup();
  }; }
const INK = { blue: '#26346E', pencil: '#3B3A3C', dark: '#2A2321', red: '#B3271F' };

// ---------- buffers: draw into an offscreen canvas with the current world transform ----------
function renderTo(b, m, fn) {
  const c = b.getContext('2d'), sG = G;
  c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over'; c.filter = 'none'; c.shadowColor = 'transparent'; c.clearRect(0, 0, b.width, b.height);
  if (m) c.setTransform(m); G = c;
  try { fn(); } finally { G = sG; }
  return b;
}

// ---------- marker strokes (draw-on) ----------
function partial(pts, k) {
  if (k >= 1) return pts; const L = [0]; for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const lim = L[L.length - 1] * clamp(k), out = [pts[0]];
  for (let i = 1; i < pts.length; i++) { if (L[i] <= lim) { out.push(pts[i]); continue; } const f = (lim - L[i - 1]) / Math.max(1e-6, L[i] - L[i - 1]); out.push([lerp(pts[i - 1][0], pts[i][0], f), lerp(pts[i - 1][1], pts[i][1], f)]); break; }
  return out;
}
function strokeK(pts, k, o = {}) {
  if (k <= 0 || PAPER.dry || pts.length < 2) return; const P = partial(pts, k), col = o.col || INK.red, w = o.w || 6;
  G.save(); noShadow(); G.globalCompositeOperation = o.comp || 'multiply'; G.lineCap = 'round'; G.lineJoin = 'round';
  const path = () => { G.beginPath(); G.moveTo(P[0][0], P[0][1]); for (let i = 1; i < P.length; i++) G.lineTo(P[i][0], P[i][1]); };
  G.globalAlpha *= o.alpha ?? .85; G.strokeStyle = col; G.lineWidth = w; path(); G.stroke();
  G.globalAlpha *= .45; G.strokeStyle = mixCol(col, '#000000', .35); G.lineWidth = w * .3; G.translate(w * .12, w * .1); path(); G.stroke();
  G.restore();
}
const wobPts = (pts, amp, seed) => pts.map(([x, y], i) => [x + (fbm1(i * .23, seed) - .5) * 2 * amp, y + (fbm1(i * .23 + 40, seed) - .5) * 2 * amp]);
function markerCircle(x, y, rx, ry, k, o = {}) {
  const sd = o.seed || 1, n = 70, a0 = (o.a0 ?? -110) * D2R, sweep = (o.sweep ?? 385) * D2R, pts = [];
  for (let i = 0; i <= n; i++) { const t = i / n, a = a0 + sweep * t, r = 1 + (fbm1(t * 3, sd) - .5) * .16 + t * .05; pts.push([x + Math.cos(a) * rx * r, y + Math.sin(a) * ry * r]); }
  strokeK(pts, k, { w: 6, ...o });
}
function markerLine(x0, y0, x1, y1, k, o = {}) {
  const n = 24, bow = o.bow ?? 6, pts = []; for (let i = 0; i <= n; i++) { const t = i / n; pts.push([lerp(x0, x1, t), lerp(y0, y1, t) + Math.sin(t * Math.PI) * bow]); }
  strokeK(wobPts(pts, o.wob ?? 1.5, o.seed || 2), k, { w: 5, ...o });
}
function markerArrow(a, b, k, o = {}) {
  const bend = o.bend ?? .2, dx = b[0] - a[0], dy = b[1] - a[1], cx = (a[0] + b[0]) / 2 - dy * bend, cy = (a[1] + b[1]) / 2 + dx * bend, pts = [];
  for (let i = 0; i <= 40; i++) { const t = i / 40, u = 1 - t; pts.push([u * u * a[0] + 2 * u * t * cx + t * t * b[0], u * u * a[1] + 2 * u * t * cy + t * t * b[1]]); }
  strokeK(wobPts(pts, 1.2, o.seed || 3), k / .82, { w: 5, ...o });
  if (k > .82) { const ang = Math.atan2(b[1] - cy, b[0] - cx), hl = o.head || 26, kk = (k - .82) / .18;
    [1, -1].forEach(sd => strokeK([[b[0] - Math.cos(ang + sd * .5) * hl, b[1] - Math.sin(ang + sd * .5) * hl], b], kk, { w: 5, ...o })); }
}
function markerTick(x, y, s, k, o = {}) {
  const pts = [], P = [[-.5 * s, -.05 * s], [-.12 * s, .38 * s], [.62 * s, -.58 * s]];
  for (let j = 0; j < 2; j++) for (let i = 0; i <= 10; i++) { const t = i / 10; pts.push([lerp(P[j][0], P[j + 1][0], t) + x, lerp(P[j][1], P[j + 1][1], t) + y]); }
  strokeK(pts, k, { w: s * .14, ...o });
}
function scribble(x, y, w, h, k, o = {}) {
  const q = rnd('scr' + (o.seed || 1)), pts = [], n = o.n || 9;
  for (let i = 0; i <= n * 6; i++) { const t = i / (n * 6), ph = t * n * TAU; pts.push([x - w / 2 + w * (.5 + .5 * Math.sin(ph) * (.7 + .3 * q())) + (t - .5) * w * .2, y - h / 2 + h * t + Math.cos(ph * .5) * h * .03]); }
  strokeK(pts, k, { w: 4, col: INK.dark, ...o });
}
function doodleStar(x, y, r, k, o = {}) {
  const pts = []; for (let i = 0; i <= 5; i++) { const a = (-90 + i * 144) * D2R; pts.push([x + Math.cos(a) * r, y + Math.sin(a) * r]); }
  const dense = []; for (let i = 0; i < pts.length - 1; i++) for (let j = 0; j < 8; j++) { const t = j / 8; dense.push([lerp(pts[i][0], pts[i + 1][0], t), lerp(pts[i][1], pts[i + 1][1], t)]); }
  dense.push(pts[5]); strokeK(wobPts(dense, 1, o.seed || 4), k, { w: 4, ...o });
}
// paintMark('?', x, y, size, k) — a big brush-painted mark revealed top → bottom, with a couple of drips
function paintMark(txt, x, y, size, k, o = {}) {
  if (k <= 0 || PAPER.dry) return; const col = o.col || '#A8231C';
  G.save(); noShadow(); G.font = `${size}px ${TF.marker}`; G.textAlign = 'center'; G.textBaseline = 'middle';
  G.beginPath(); G.rect(x - size, y - size * .62, size * 2, size * 1.3 * clamp(k)); G.clip();
  G.globalCompositeOperation = 'multiply'; G.globalAlpha *= .9; G.fillStyle = col; G.fillText(txt, x, y);
  G.globalAlpha *= .4; G.fillText(txt, x + size * .015, y + size * .012);
  if (k > .8) { const d = seg(k, .8, 1); [[-.04, .3, .09], [.1, .46, .07]].forEach(([dx, dy, w]) => { G.fillRect(x + dx * size - w * size * .1, y + dy * size, w * size * .2, size * .22 * d); }); }
  G.restore();
}

// ---------- handwriting ----------
function handText(txt, x, y, size, k = 1, o = {}) {
  if (k <= 0 || PAPER.dry) return; const font = `${o.weight || 700} ${size}px ${TF.hand}`, w = textW(txt, font), al = o.align || 'left';
  const x0 = al === 'center' ? x - w / 2 : al === 'right' ? x - w : x;
  G.save(); noShadow(); G.beginPath(); G.rect(x0 - size * .2, y - size * 1.2, (w + size * .4) * clamp(k), size * 1.8); G.clip();
  G.font = font; G.textAlign = 'left'; G.textBaseline = 'alphabetic'; G.fillStyle = o.col || INK.blue; G.globalAlpha *= o.alpha ?? .92;
  if (o.rot) { G.translate(x0, y); G.rotate(o.rot * D2R); G.fillText(txt, 0, 0); } else G.fillText(txt, x0, y);
  G.restore(); return w;
}
// note(x, y, w, h, lines, { k, col, size, fasten, rot, aged, ink, torn }) → pin point. k = write-on progress over all lines
function note(x, y, w, h, lines, o = {}) {
  const size = o.size || w * .13, n = lines.length;
  return pinCard(x, y, w, h, { torn: o.torn ?? 'top', mat: 'paper', col: o.col || '#EFE4C6', ...o, draw: (cw, ch) => {
    const top = -ch / 2 + (ch - n * size * 1.15) / 2 + size * .85;
    lines.forEach((L, i) => handText(L, 0, top + i * size * 1.15, size, clamp((o.k ?? 1) * n - i), { align: 'center', col: o.ink || INK.dark }));
    if (o.after) o.after(cw, ch);
  } });
}
// checklist(x, y, w, items, prog, { title, ink, fasten, rot }) — prog 0..n: how many boxes are ticked (fractions draw on)
function checklist(x, y, w, items, prog, o = {}) {
  const lh = w * .15, h = lh * (items.length + (o.title ? 1.4 : .3)) + w * .14;
  return pinCard(x, y, w, h, { torn: 'top', mat: 'paper', col: o.col || '#EEE5CB', ...o, draw: (cw, ch) => {
    let cy = -ch / 2 + w * .1; const L = -cw / 2 + w * .1, ink = o.ink || INK.dark;
    if (o.title) { cy += lh * .85; const tw = handText(o.title, L, cy, lh * .8, 1, { col: ink }); markerLine(L, cy + lh * .18, L + tw, cy + lh * .2, 1, { w: 3, col: ink, alpha: .55, bow: 2 }); cy += lh * .35; }
    items.forEach((it, i) => {
      cy += lh; const bs = lh * .52;
      strokeK([[L, cy - bs], [L + bs, cy - bs], [L + bs, cy], [L, cy], [L, cy - bs]], 1, { w: 2.2, col: ink, alpha: .8 });
      handText(it, L + bs * 1.7, cy, lh * .66, 1, { col: ink });
      const kk = clamp(prog - i); if (kk > 0) markerTick(L + bs * .55, cy - bs * .5, bs * 1.3, kk, { w: bs * .2 });
    });
  } });
}
// timelineCard(x, y, w, rows [[time, text]], k, opts)
function timelineCard(x, y, w, rows, k = 1, o = {}) {
  const lh = w * .13, h = lh * (rows.length + 1.6) + w * .1;
  return pinCard(x, y, w, h, { torn: 'top', mat: 'paper', col: '#EFE6CF', ...o, draw: (cw, ch) => {
    let cy = -ch / 2 + w * .08 + lh; print(o.title || 'TIMELINE', 0, cy, `700 ${lh * .78}px ${TF.cond}`, { ls: 3, alpha: .85 }); cy += lh * .3;
    rows.forEach(([tm, tx], i) => { cy += lh; const kk = clamp(k * rows.length - i); handText(tm, -cw / 2 + w * .08, cy, lh * .7, kk, { col: INK.red }); handText(tx, -cw / 2 + w * .36, cy, lh * .7, kk, { col: INK.dark }); });
  } });
}

// ---------- redaction ----------
// redact(x, y, w, h, k, { peel }) — a fat black marker bar drawn left → right (k); peel 0 → 1 lifts it off (declassify)
function redact(x, y, w, h, k, o = {}) {
  if (k <= 0 || PAPER.dry) return; const p = clamp(o.peel || 0); if (p >= 1) return; const sd = o.seed || 7, ww = w * clamp(k), n = Math.max(6, Math.round(ww / 10)), pts = [];
  for (let i = 0; i <= n; i++) { const t = i / n; pts.push([x - w / 2 + ww * t, y - h / 2 + (fbm1(t * 6, sd) - .5) * h * .18]); }
  for (let i = n; i >= 0; i--) { const t = i / n; pts.push([x - w / 2 + ww * t, y + h / 2 + (fbm1(t * 6, sd + 3) - .5) * h * .18]); }
  G.save(); if (p > 0) { G.translate(x - w / 2, y); G.rotate(-p * 10 * D2R); G.translate(-(x - w / 2) + p * w * .6, -p * h * 1.6); }
  setShadow(p * 2, curScale()); G.globalAlpha *= 1 - p * p; G.fillStyle = '#151213'; G.beginPath(); G.moveTo(pts[0][0], pts[0][1]); pts.forEach(q => G.lineTo(q[0], q[1])); G.closePath(); G.fill();
  noShadow(); G.globalAlpha *= .25; G.strokeStyle = '#3A3536'; G.lineWidth = 1.5; for (let i = 1; i < 4; i++) { G.beginPath(); G.moveTo(x - w / 2, y - h / 2 + h * i / 4); G.lineTo(x - w / 2 + ww, y - h / 2 + h * i / 4 + 1); G.stroke(); }
  G.restore();
}

// ---------- fastenings ----------
function tape(x, y, w, rot = 0, o = {}) {
  const h = o.h || w * .32;
  piece(SH.rect(w, h), { x, y, rot, col: o.col || '#E6D9AE', mat: 'paper', torn: 'sides', tornAmp: 3, depth: .45, seed: o.seed || 8100, jit: 0, alpha: o.alpha ?? .82 });
}
function redCorner(x, y, s, rot = 0, o = {}) { piece(SH.poly([[-s / 2, -s / 2], [s / 2, -s / 2], [-s / 2, s / 2]]), { x, y, rot, col: o.col || NC.red, mat: 'paper', depth: .45, seed: o.seed || 8110, jit: 0, alpha: .92 }); }
function safetyPin(x, y, s = 120, rot = 0) {
  if (PAPER.dry) return; G.save(); G.translate(x, y); G.rotate(rot * D2R); setShadow(1, curScale());
  const g = G.createLinearGradient(0, -s * .1, 0, s * .1); g.addColorStop(0, '#E8EAEC'); g.addColorStop(.5, '#9EA3A8'); g.addColorStop(1, '#D3D6D9');
  G.strokeStyle = g; G.lineWidth = s * .035; G.lineCap = 'round';
  G.beginPath(); G.moveTo(s * .92, -s * .035); G.lineTo(s * .1, -s * .07); G.arc(s * .06, 0, s * .07, -Math.PI / 2, Math.PI / 2, true); G.lineTo(s * .88, s * .05); G.stroke();
  G.beginPath(); G.arc(s * .06, 0, s * .035, 0, TAU); G.stroke(); noShadow();
  G.fillStyle = g; G.beginPath(); G.roundRect(s * .8, -s * .08, s * .2, s * .15, s * .04); G.fill(); G.restore();
}
// fasten(kind, w, h, py, o) — called by pinCard in the card's local frame. kinds: pin · mappin · tape · corners · safety · none
function fasten(kind, w, h, py, o = {}) {
  const sd = (o.seed || 1) * 3;
  if (kind === 'pin') pushpin(0, py, o.pinCol);
  else if (kind === 'mappin') pushpin(0, py, o.pinCol || NC.gold, 9);
  else if (kind === 'tape') tape(0, -h / 2 + 4, Math.min(170, w * .42), (hash(sd) - .5) * 10, { seed: 8100 + sd });
  else if (kind === 'tape2') { tape(-w / 2 + 18, -h / 2 + 18, Math.min(120, w * .3), -40, { seed: 8101 + sd }); tape(w / 2 - 18, -h / 2 + 18, Math.min(120, w * .3), 40, { seed: 8102 + sd }); }
  else if (kind === 'corners') { const c = Math.min(60, w * .16); redCorner(-w / 2 + c * .42, -h / 2 + c * .42, c, 0, { seed: 8111 + sd }); redCorner(w / 2 - c * .42, -h / 2 + c * .42, c, 90, { seed: 8112 + sd }); }
  else if (kind === 'safety') safetyPin(-w * .32, -h / 2 + 10, Math.min(150, w * .45), -12);
}

// ---------- aged paper ----------
function ageOver(shape, o = {}) {
  if (PAPER.dry) return; const amt = o.amt ?? .6, q = rnd('age' + (o.seed || 1)); let minX = 1e9, maxX = -1e9, minY = 1e9, maxY = -1e9;
  for (const [px, py] of shape) { minX = Math.min(minX, px); maxX = Math.max(maxX, px); minY = Math.min(minY, py); maxY = Math.max(maxY, py); }
  const P = toPath(shape), w = maxX - minX, h = maxY - minY;
  G.save(); G.clip(P); noShadow(); G.globalCompositeOperation = 'multiply';
  for (let i = 0; i < 5 + Math.round(amt * 8); i++) { const cx = minX + q() * w, cy = minY + q() * h, r = (18 + q() * 70) * (w / 600 + .4), g = G.createRadialGradient(cx, cy, 0, cx, cy, r);
    g.addColorStop(0, `rgba(150,96,40,${(.12 + q() * .18) * amt})`); g.addColorStop(.7, `rgba(150,96,40,${.05 * amt})`); g.addColorStop(1, 'rgba(150,96,40,0)'); G.fillStyle = g; G.fillRect(cx - r, cy - r, r * 2, r * 2); }
  G.filter = `blur(${Math.max(4, w / 60)}px)`; G.strokeStyle = `rgba(112,66,24,${.6 * amt})`; G.lineWidth = Math.max(16, w / 14) * amt; G.stroke(P); G.filter = 'none';
  G.restore();
}
function coffeeRing(x, y, r, o = {}) {
  if (PAPER.dry) return; const sd = o.seed || 1, gap = o.gap ?? .18;
  G.save(); noShadow(); G.globalCompositeOperation = 'multiply';
  G.fillStyle = 'rgba(140,86,38,.07)'; G.beginPath(); G.arc(x, y, r * .97, 0, TAU); G.fill();
  for (let i = 0; i < 48; i++) { const t0 = i / 48, t1 = (i + 1.2) / 48; if (t0 < gap) continue; const a = fbm1(t0 * 5, sd);
    G.strokeStyle = `rgba(118,66,24,${.18 + a * .32})`; G.lineWidth = r * (.025 + a * .05); G.beginPath(); G.arc(x, y, r * (1 + (a - .5) * .03), t0 * TAU + sd, t1 * TAU + sd); G.stroke(); }
  G.restore();
}
function crease(x, y, len, rot = 0, o = {}) {
  if (PAPER.dry) return; G.save(); G.translate(x, y); G.rotate(rot * D2R); noShadow(); const b = o.bend ?? len * .04;
  const line = (dy, col) => { G.strokeStyle = col; G.lineWidth = o.w || 1.6; G.beginPath(); G.moveTo(-len / 2, dy); G.quadraticCurveTo(0, dy + b, len / 2, dy); G.stroke(); };
  line(0, 'rgba(255,250,236,.5)'); line(1.8, 'rgba(40,24,12,.18)'); G.restore();
}

// ---------- desk props (top-down) ----------
function calculator(x, y, s = 1, rot = 0, o = {}) {
  G.save(); G.translate(x, y); G.rotate(rot * D2R);
  piece(SH.round(230 * s, 330 * s, 22 * s), { col: '#3B3B3E', mat: 'card', depth: 1.4, seed: 8201, jit: 0 });
  piece(SH.round(190 * s, 64 * s, 8 * s), { y: -112 * s, col: '#9CB08F', mat: 'card', depth: .15, seed: 8202, jit: 0 });
  print(o.display ?? '0.00', 84 * s, -98 * s, `${40 * s}px ${TF.tab}`, { align: 'right', col: '#26301F', alpha: .85 });
  for (let r = 0; r < 5; r++) for (let c = 0; c < 4; c++) { const op = c === 3, top = r === 0 && c < 3;
    piece(SH.round(38 * s, 30 * s, 6 * s), { x: (-66 + c * 44) * s, y: (-46 + r * 40) * s, col: op ? '#D07A35' : top ? '#C9463A' : '#D6D0C3', mat: 'card', depth: .3, seed: 8210 + r * 4 + c, jit: 0 }); }
  G.restore();
}
function alarmClock(x, y, s = 1, o = {}) {   // o.time = [hours, minutes]; o.ring = shake amount
  const [hh, mm] = o.time || [10, 10], sh = (o.ring || 0) * Math.sin(PAPER.step * 2.7) * 4;
  G.save(); G.translate(x + sh, y);
  [-1, 1].forEach((sd, i) => piece(SH.ellipse(42 * s, 30 * s), { x: sd * 72 * s, y: -112 * s, rot: sd * 30, col: '#C69A45', depth: 1.5, seed: 8231 + i, jit: 0 }));
  piece(SH.circle(122 * s), { col: o.col || '#B6463A', depth: 1.4, seed: 8233, jit: 0 });
  piece(SH.circle(100 * s), { col: '#F2E9D4', mat: 'card', depth: .3, seed: 8234, jit: 0 });
  G.save(); noShadow(); G.fillStyle = NC.newsInk; for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; G.fillRect(Math.cos(a) * 86 * s - 3 * s, Math.sin(a) * 86 * s - 3 * s, 6 * s, 6 * s); } G.restore();
  const ha = ((hh % 12) + mm / 60) / 12 * 360, ma = mm / 60 * 360;
  piece(SH.round(9 * s, 56 * s, 4 * s), { x: Math.sin(ha * D2R) * 24 * s, y: -Math.cos(ha * D2R) * 24 * s, rot: ha, col: NC.newsInk, depth: .4, seed: 8235, jit: 0 });
  piece(SH.round(6 * s, 82 * s, 3 * s), { x: Math.sin(ma * D2R) * 36 * s, y: -Math.cos(ma * D2R) * 36 * s, rot: ma, col: NC.newsInk, depth: .5, seed: 8236, jit: 0 });
  brad(0, 0, 8 * s, { col: '#C69A45' }); G.restore();
}
function deskGlasses(x, y, s = 1, rot = 0) {
  if (PAPER.dry) return; G.save(); G.translate(x, y); G.rotate(rot * D2R); setShadow(1.2, curScale()); G.strokeStyle = '#5A2E1C'; G.lineWidth = 9 * s; G.lineCap = 'round';
  [-1, 1].forEach(sd => { G.beginPath(); G.ellipse(sd * 78 * s, 0, 62 * s, 46 * s, 0, 0, TAU); G.stroke(); G.beginPath(); G.moveTo(sd * 140 * s, -10 * s); G.lineTo(sd * 160 * s, -110 * s); G.stroke(); });
  G.beginPath(); G.moveTo(-18 * s, -6 * s); G.quadraticCurveTo(0, -20 * s, 18 * s, -6 * s); G.stroke(); noShadow();
  G.fillStyle = 'rgba(220,235,240,.18)'; [-1, 1].forEach(sd => { G.beginPath(); G.ellipse(sd * 78 * s, 0, 56 * s, 40 * s, 0, 0, TAU); G.fill(); }); G.restore();
}
function pencil(x, y, len = 420, rot = 0, o = {}) {
  G.save(); G.translate(x, y); G.rotate(rot * D2R); const w = len * .055;
  piece(SH.rect(len * .8, w), { col: o.col || '#E3A93A', depth: 1.1, seed: 8251 + (o.seed || 0), jit: 0 });
  piece(SH.poly([[len * .4, -w / 2], [len * .5, 0], [len * .4, w / 2]]), { col: '#E2C59A', mat: 'kraft', depth: 1, seed: 8252 + (o.seed || 0), jit: 0 });
  piece(SH.poly([[len * .47, -w * .15], [len * .5, 0], [len * .47, w * .15]]), { col: '#2F2C2D', depth: .2, seed: 8253, jit: 0 });
  piece(SH.rect(len * .05, w * 1.05), { x: -len * .425, col: '#B8B4AC', depth: .6, seed: 8254, jit: 0 });
  piece(SH.round(len * .06, w * 1.02, w * .3), { x: -len * .48, col: '#E38C8E', depth: .6, seed: 8255, jit: 0 }); G.restore();
}
function stopwatch(x, y, s = 1, sec = 0) {
  G.save(); G.translate(x, y);
  piece(SH.round(34 * s, 30 * s, 6 * s), { y: -118 * s, col: '#B9B5AE', depth: 1.2, seed: 8261, jit: 0 });
  piece(SH.circle(104 * s), { col: '#BDB9B2', depth: 1.4, seed: 8262, jit: 0 }); piece(SH.circle(88 * s), { col: '#F4EEE0', mat: 'card', depth: .2, seed: 8263, jit: 0 });
  G.save(); noShadow(); G.strokeStyle = NC.newsInk; G.lineWidth = 2 * s; for (let i = 0; i < 60; i++) { const a = i / 60 * TAU, r0 = i % 5 ? 78 : 70; G.beginPath(); G.moveTo(Math.cos(a) * r0 * s, Math.sin(a) * r0 * s); G.lineTo(Math.cos(a) * 84 * s, Math.sin(a) * 84 * s); G.stroke(); } G.restore();
  const a = (sec % 60) / 60 * 360; piece(SH.round(5 * s, 80 * s, 2 * s), { x: Math.sin(a * D2R) * 30 * s, y: -Math.cos(a * D2R) * 30 * s, rot: a, col: NC.red, depth: .5, seed: 8264, jit: 0 });
  brad(0, 0, 7 * s); G.restore();
}
// filmStrip(x, y, n, fw, { rot, frame(cx, cy, w, h, i), lum }) — black strip with sprocket holes and n frames
function filmStrip(x, y, n = 4, fw = 220, o = {}) {
  const fh = fw * .72, W2 = n * (fw + 14) + 14, H2 = fh + 60; G.save(); G.translate(x, y); G.rotate((o.rot || 0) * D2R);
  piece(SH.rect(W2, H2), { col: '#1B1819', mat: 'card', depth: 1.5, seed: 8271, jit: 0 });
  G.save(); noShadow(); G.fillStyle = '#E9E2D2'; for (let i = 0; i < W2 / 24 - 1; i++) [-1, 1].forEach(sd => G.fillRect(-W2 / 2 + 12 + i * 24, sd * (H2 / 2 - 15) - 6, 12, 12)); G.restore();
  for (let i = 0; i < n; i++) { const cx = -W2 / 2 + 14 + fw / 2 + i * (fw + 14);
    piece(SH.rect(fw, fh), { x: cx, col: '#CFC7B6', mat: 'card', depth: .05, seed: 8272 + i, jit: 0, edge: false });
    if (o.frame) { G.save(); G.beginPath(); G.rect(cx - fw / 2, -fh / 2, fw, fh); G.clip(); o.frame(cx, 0, fw, fh, i); G.restore(); }
    else photo(cx, 0, fw, fh, (o.lum || LUM.crowd)(i + 1), { key: 'film' + i + (o.seed || 0), sp: 5 }); }
  G.restore();
}
function ticket(x, y, w = 300, txt = 'ADMIT ONE', o = {}) {
  const h = w * .44, n = o.serial || '146017'; G.save(); G.translate(x, y); G.rotate((o.rot || 0) * D2R);
  const sh = []; const nr = 7; sh.push([-w / 2, -h / 2]); sh.push([w / 2, -h / 2]);
  for (let i = 0; i <= nr; i++) { const t = i / nr; sh.push([w / 2 - (i % 2 ? 9 : 0), -h / 2 + h * t]); } sh.push([-w / 2, h / 2]);
  for (let i = nr; i >= 0; i--) { const t = i / nr; sh.push([-w / 2 + (i % 2 ? 9 : 0), -h / 2 + h * t]); }
  piece(SH.poly(sh), { col: o.col || '#E9DBB5', mat: 'card', depth: 1.3, seed: o.seed || 8281, jit: 0 });
  G.save(); noShadow(); G.setLineDash([5, 6]); G.strokeStyle = 'rgba(40,30,20,.45)'; G.lineWidth = 2; G.beginPath(); G.moveTo(w * .26, -h / 2 + 6); G.lineTo(w * .26, h / 2 - 6); G.stroke(); G.restore();
  print(txt, -w * .12, h * .1, `${h * .26}px ${TF.type}`, { col: o.ink || NC.newsInk });
  G.save(); G.translate(w * .38, 0); G.rotate(-Math.PI / 2); print(n, 0, h * .08, `${h * .2}px ${TF.type}`, { col: NC.red }); G.restore(); G.restore();
}
function postStamp(x, y, w = 160, val = '6¢', o = {}) {
  const h = w * 1.2, pts = [], sc = Math.round(w / 14); G.save(); G.translate(x, y); G.rotate((o.rot || 0) * D2R);
  const edge = (x0, y0, x1, y1, n) => { for (let i = 0; i < n; i++) { const t = (i + .5) / n, mx = lerp(x0, x1, t), my = lerp(y0, y1, t), nx = -(y1 - y0), ny = x1 - x0, L = Math.hypot(nx, ny); pts.push([lerp(x0, x1, i / n), lerp(y0, y1, i / n)]); pts.push([mx - nx / L * 4, my - ny / L * 4]); } };
  edge(-w / 2, -h / 2, w / 2, -h / 2, sc); edge(w / 2, -h / 2, w / 2, h / 2, Math.round(sc * 1.2)); edge(w / 2, h / 2, -w / 2, h / 2, sc); edge(-w / 2, h / 2, -w / 2, -h / 2, Math.round(sc * 1.2));
  piece(SH.poly(pts), { col: '#F0E8D6', mat: 'card', depth: 1.2, seed: o.seed || 8291, jit: 0, wob: .3 });
  piece(SH.rect(w * .78, h * .62), { y: -h * .06, col: o.col || '#B9C7B2', mat: 'card', depth: .05, seed: (o.seed || 8291) + 1, jit: 0, edge: false });
  photo(0, -h * .06, w * .78, h * .62, (o.lum || LUM.building)(3), { key: 'stamp' + (o.seed || 0), sp: 4, alpha: .6 });
  print(val, w * .26, -h * .25, `900 ${w * .2}px ${TF.head}`, { col: NC.redDk }); print(o.label || 'POSTAGE', 0, h * .4, `700 ${w * .11}px ${TF.cond}`, { ls: 2 }); G.restore();
}
// lampGlow(x, y, r) — the hot pool of a desk lamp at the frame edge (screen blend)
function lampGlow(x, y, r = 700, o = {}) {
  if (PAPER.dry) return; G.save(); noShadow(); G.globalCompositeOperation = 'screen'; const g = G.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, `rgba(255,214,150,${o.a ?? .5})`); g.addColorStop(.4, `rgba(255,190,120,${(o.a ?? .5) * .35})`); g.addColorStop(1, 'rgba(255,190,120,0)'); G.fillStyle = g; G.fillRect(x - r, y - r, r * 2, r * 2); G.restore();
}
// trendCard(x, y, pct, { k, label, s }) — a taped card with a marker arrow (red down / green up) and the % change
function trendCard(x, y, pct, o = {}) {
  const s = (o.s || 120) / 120, w = 260 * s, h = 220 * s, up = pct >= 0, col = up ? '#2E7D3A' : INK.red, k = o.k ?? 1;
  if (k <= 0) return;
  pinCard(x, y, w, h, { fasten: 'tape', mat: 'paper', col: '#EEE5CC', rot: o.rot ?? 4, seed: 8301, draw: () => {
    markerArrow(up ? [-w * .3, h * .12] : [-w * .3, -h * .3], up ? [w * .3, -h * .3] : [w * .3, h * .12], seg(k, 0, .6), { col, w: 9 * s, bend: up ? -.15 : .15, head: 34 * s });
    if (k > .55) print(`${up ? '+' : '−'}${Math.abs(pct)}%`, 0, h * .38, `${62 * s}px ${TF.tab}`, { col, alpha: .95 });
    if (o.label) handText(o.label, 0, -h * .36, 28 * s, 1, { align: 'center', col: INK.dark });
  } });
}

// ================= Tier 2 =================
// ---------- suspect photos: the cast as sepia, halftone polaroids ----------
const MUGS = new Map();
function mugCanvas(name, o = {}) {
  const key = [name, o.face || 'neutral', o.style || TRAIL.puppetStyle, o.view || 'front'].join('|'); let c = MUGS.get(key); if (c) return c;
  const S = 420, u = o.u || 60, raw = makeCanvas(S, S), po = { face: o.face, style: o.style, view: o.view, jit: 0, blink: false, look: o.look };
  const J = exec(name, 0, 0, u, { ...po, dry: true });
  renderTo(raw, new DOMMatrix([1, 0, 0, 1, S / 2 - J.head[0], S * .4 - J.head[1]]), () => {
    const g = G.createRadialGradient(J.head[0] - 40, J.head[1] - 60, 20, J.head[0], J.head[1], S); g.addColorStop(0, '#D8D2C6'); g.addColorStop(1, '#8F887C');
    G.fillStyle = g; G.fillRect(J.head[0] - S, J.head[1] - S, S * 2, S * 2); exec(name, 0, 0, u, po);
  });
  c = makeCanvas(S, S); const x = c.getContext('2d'); x.filter = 'grayscale(1) sepia(.45) contrast(1.25) brightness(1.04)'; x.drawImage(raw, 0, 0); x.filter = 'none';
  x.globalCompositeOperation = 'multiply'; x.globalAlpha = .28; x.fillStyle = htPattern(4); x.fillRect(0, 0, S, S);
  MUGS.set(key, c); return c;
}
// suspectPhoto(x, y, w, name, { face, style, caption, fasten, rot, seed }) → pin point
function suspectPhoto(x, y, w, name, o = {}) {
  const h = w * 1.2;
  return pinCard(x, y, w, h, { col: '#F1EDE4', mat: 'card', ...o, draw: (cw, ch) => {
    const iw = cw * .86; G.save(); noShadow(); G.drawImage(mugCanvas(name, o), -iw / 2, -ch / 2 + cw * .07, iw, iw); G.restore();
    if (o.caption) handText(o.caption, 0, ch / 2 - cw * .08, cw * .12, 1, { align: 'center', col: INK.blue });
  } });
}

// ---------- the clipping wall (cached) ----------
const WALL_HEADS = ['Markets Tumble', 'Shares Plunge 40%', 'Board Ousts Chief', 'Auditors Raise Alarm', 'Investors Demand Answers', 'The Bubble Bursts', 'Bankruptcy Filed',
  'Merger Talks Collapse', 'Trading Halted', 'Whistleblower Speaks', 'Record Losses', 'Regulators Close In', 'Where Did The Money Go?', 'Founder Steps Down', 'Panic On The Floor', 'Profit Warning'];
const WALLS = new Map();
function clippingWall(o = {}) {
  const sd = o.seed || 1, key = 'wall' + sd, BW = 3400, BH = 2200; let c = WALLS.get(key);
  if (!c) {
    c = makeCanvas(BW, BH);
    renderTo(c, new DOMMatrix([1, 0, 0, 1, BW / 2 - 960, BH / 2 - 540]), () => {
      G.fillStyle = mat(NC.newsDk, 'news'); G.fillRect(-800, -600, BW, BH);
      const q = rnd('wall' + sd), lums = [LUM.mugshot, LUM.building, LUM.crowd, LUM.chart]; let i = 0;
      for (let gy = -520; gy < 1700; gy += 290) for (let gx = -720; gx < 2720; gx += 400) {
        const w = 360 + q() * 230, ph = q() < .38;
        clipping(gx + q() * 90, gy + q() * 70, w, { paper: q() < .45 ? false : ['THE DAILY LEDGER', 'MARKET WIRE', 'The Evening Ledger', 'FINANCIAL POST'][i % 4], mast: i % 4 === 2 ? 'black' : '',
          head: WALL_HEADS[Math.floor(q() * WALL_HEADS.length)], body: 3 + Math.floor(q() * 5), photo: ph ? lums[i % 4](i) : null, photoH: .42, rot: (q() - .5) * 9, seed: 9100 + i, hs: w * (.075 + q() * .03), aged: .25 + q() * .55, cols: 2, depth: .8 });
        i++;
      }
    });
    WALLS.set(key, c);
  }
  G.save(); noShadow(); G.drawImage(c, 960 - BW / 2, 540 - BH / 2);
  if (o.dim) { G.fillStyle = `rgba(22,14,10,${o.dim})`; G.fillRect(960 - BW / 2, 540 - BH / 2, BW, BH); }
  G.restore();
}

// ---------- black torn panels + marker lettering ----------
function blackPanel(x, y, w, h, o = {}) {
  G.save(); G.translate(x, y); G.rotate((o.rot || 0) * D2R);
  piece(SH.rect(w, h), { col: o.col || '#1D191A', mat: 'card', torn: true, tornAmp: o.tornAmp ?? 8, rim: '#E9E1D0', depth: o.depth ?? 1.7, seed: o.seed || 8401, jit: 0 });
  if (o.draw) { G.save(); G.beginPath(); G.rect(-w / 2 + 12, -h / 2 + 12, w - 24, h - 24); G.clip(); o.draw(w, h); G.restore(); }
  if (o.after) o.after(w, h);
  G.restore();
}
function markerText(txt, x, y, size, k = 1, o = {}) {
  if (k <= 0 || PAPER.dry) return; const font = `${size}px ${TF.marker}`, w = textW(txt, font), x0 = (o.align || 'center') === 'center' ? x - w / 2 : x;
  G.save(); noShadow(); G.beginPath(); G.rect(x0 - size * .2, y - size * 1.2, (w + size * .4) * clamp(k), size * 1.8); G.clip();
  G.font = font; G.textBaseline = 'alphabetic'; G.fillStyle = o.col || '#F1ECE2'; G.globalAlpha *= o.alpha ?? .95; G.fillText(txt, x0, y); G.restore(); return w;
}

// ---------- sliced subject ----------
// sliceFx(drawFn, [x, y, w, h] world rect, n, k, { amt, seed }) — draws drawFn, cut into n horizontal strips that slide apart
function sliceFx(drawFn, rect, n = 3, k = 0, o = {}) {
  if (PAPER.dry) return; if (k <= 0) return drawFn();
  const b = buf('slice'), m = G.getTransform(); renderTo(b, m, drawFn);
  const p0 = m.transformPoint(new DOMPoint(rect[0], rect[1])), p1 = m.transformPoint(new DOMPoint(rect[0] + rect[2], rect[1] + rect[3])), y0 = p0.y, bh = (p1.y - p0.y) / n, amt = (o.amt ?? 70) * k;
  G.save(); G.setTransform(1, 0, 0, 1, 0, 0);
  const band = (yy, hh, dx, dy, sh) => { G.save(); G.beginPath(); G.rect(-50, yy, W + 100, hh); G.clip(); if (sh) setShadow(sh, 1); G.drawImage(b, dx, dy); G.restore(); };
  band(-50, y0 + 50, 0, 0, 0); band(p1.y, H - p1.y + 50, 0, 0, 0);
  for (let i = 0; i < n; i++) band(y0 + i * bh, bh, (i % 2 ? 1 : -1) * amt * (.55 + .9 * hash(i * 3.1 + (o.seed || 1))), (i - (n - 1) / 2) * 10 * k, 1.4 * k);
  G.restore();
}

// ---------- torn reveal ----------
// tornReveal(k, overFn, { x, y, r, seed, xerox }) — overFn is drawn as a sheet with a torn hole of radius r·k at (x, y);
// whatever was drawn BEFORE the call shows through the hole. xerox: true prints the sheet as a photocopy.
function tornReveal(k, overFn, o = {}) {
  if (PAPER.dry) return; if (k <= 0 && !o.xerox) return overFn(); if (k >= 1 && o.gone) return;
  const b = buf('tear'), m = G.getTransform(); renderTo(b, m, overFn); const c = b.getContext('2d');
  if (o.xerox) xeroxBuf(b, o.xa ?? 1);
  if (k > 0) {
    c.setTransform(m); const sd = o.seed || 5, n = 110, r = (o.r || 320) * easeOut(k), P = new Path2D();
    for (let i = 0; i <= n; i++) { const a = i / n * TAU, rr = r * (1 + (fbm1(i * .19, sd) - .5) * .55 + (hash(i * 1.7 + sd) - .5) * .07); P[i ? 'lineTo' : 'moveTo'](o.x + Math.cos(a) * rr * 1.3, o.y + Math.sin(a) * rr); }
    P.closePath(); c.globalCompositeOperation = 'source-atop'; c.strokeStyle = '#F4EEE2'; c.lineWidth = 16; c.stroke(P);
    c.globalCompositeOperation = 'destination-out'; c.fill(P); c.globalCompositeOperation = 'source-over';
  }
  G.save(); G.setTransform(1, 0, 0, 1, 0, 0); setShadow(1.8, 1); G.drawImage(b, 0, 0); G.restore();
}

// ---------- xerox / photocopy look ----------
let TONER = null;
function tonerPat() {
  if (TONER) return TONER; const c = makeCanvas(512, 512), x = c.getContext('2d'), r = rnd('toner'); x.fillStyle = '#fff'; x.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 2600; i++) { x.fillStyle = `rgba(20,18,18,${.15 + r() * .6})`; const s = .6 + r() * 2.2; x.fillRect(r() * 512, r() * 512, s, s); }
  for (let i = 0; i < 40; i++) { x.fillStyle = 'rgba(20,18,18,.18)'; x.beginPath(); x.arc(r() * 512, r() * 512, 2 + r() * 7, 0, TAU); x.fill(); }
  return (TONER = OUT.createPattern(c, 'repeat'));
}
function xeroxBuf(b, a = 1) {   // photocopy a buffer in place (keeps its alpha)
  const t = buf('xtmp'), tc = t.getContext('2d'); tc.setTransform(1, 0, 0, 1, 0, 0); tc.clearRect(0, 0, W, H);
  tc.filter = `grayscale(1) contrast(${1 + 1.7 * a}) brightness(${1 + .12 * a})`; tc.drawImage(b, 0, 0); tc.filter = 'none';
  const p = tonerPat(); p.setTransform(new DOMMatrix([1, 0, 0, 1, hash(PAPER.step * 1.1) * 512, hash(PAPER.step * 2.3) * 512]));
  tc.globalCompositeOperation = 'source-atop'; tc.globalAlpha = .55 * a; tc.fillStyle = p; tc.globalCompositeOperation = 'multiply'; tc.fillRect(0, 0, W, H);
  tc.globalCompositeOperation = 'destination-in'; tc.globalAlpha = 1; tc.drawImage(b, 0, 0); tc.globalCompositeOperation = 'source-over';
  const c = b.getContext('2d'); c.setTransform(1, 0, 0, 1, 0, 0); c.globalCompositeOperation = 'copy'; c.drawImage(t, 0, 0); c.globalCompositeOperation = 'source-over';
}
// xeroxFx(a) — photocopy the whole frame drawn so far (call after camEnd, before transitions). a 0..1
function xeroxFx(a = 1) {
  if (IN_PREV || a <= 0) return; const cur = snapCur(); screenReset();
  G.filter = `grayscale(1) contrast(${1 + 1.7 * a}) brightness(${1 + .14 * a})`; G.drawImage(cur, 0, 0); G.filter = 'none';
  const p = tonerPat(); p.setTransform(new DOMMatrix([1, 0, 0, 1, hash(PAPER.step * 1.1) * 512, hash(PAPER.step * 2.3) * 512]));
  G.save(); G.globalCompositeOperation = 'multiply'; G.globalAlpha = .6 * a; G.fillStyle = p; G.fillRect(0, 0, W, H);
  G.globalAlpha = .07 * a; G.fillStyle = '#000'; for (let i = 0; i < 3; i++) G.fillRect(hash(PAPER.step * .7 + i) * W, 0, 2 + hash(i + PAPER.step) * 5, H); G.restore();
}
