// trail3.js — Paper Trail kit v3: Vox-style explainer pieces, in the same paper / halftone / marker materials.
//   Maps          M = mapFrame('us' | 'world', x, y, w) · paperMap(M, opts) · mapLift / mapHighlight(M, names, k) · mapPin(M, lon, lat, k)
//                 mapRoute(M, a, b, k) · mapScatter(M, n, k, { off }) (e.g. 9,000 stores lighting up, then going dark)
//   Charts        graphPaper(x, y, w, h) · C = chartFrame(x, y, w, h, { x: [a, b], y: [a, b], xTicks, yTicks, fmt })
//                 lineChart(C, pts, k) · barChart(C, bars, k) · chartNote(C, xv, yv, txt, k, { dx, dy })
//   Documents     docPage(x, y, w, lines, { title, caseNo, pleading, hl: [{ line, k, from, to }], marks }) · highlighter(x, y, w, h, k)
//   Kinetic type  kinetic('SEVEN MILLION | POINTS.', x, y, size, k, { style: 'slam' | 'strip' | 'type', hl: [0, 1] })
//   Photo layers  TRAIL.photos.push('file.jpg') (files in assets/photos, loaded at setup) · photoCut(src, x, y, w, opts) ·
//                 photoLayers([{ src, x, y, w, k }, ...]) — src = a file name (PNG with alpha = cut-out) or a LUM function
// Map data: Natural Earth (world-atlas) and US Census (us-atlas), public domain — rebuild with node scripts/build_maps.mjs.

TRAIL.photos = TRAIL.photos || [];
const PHOTOS = {};
{ const _setup = ENGINE.setup;
  ENGINE.setup = async () => {
    await Promise.all(TRAIL.photos.map(n => new Promise(ok => { const im = new Image(); im.onload = () => { PHOTOS[n] = im; ok(); }; im.onerror = () => { console.warn('photo missing: ' + n); ok(); }; im.src = 'assets/photos/' + n; })));
    await _setup();
  }; }

// ================= maps =================
function albers48(lon, lat) {   // the us-atlas "Albers USA" frame (lower 48), in its 975 × 610 px space
  const r = Math.PI / 180, p0 = 29.5 * r, p1 = 45.5 * r, n = (Math.sin(p0) + Math.sin(p1)) / 2, c = Math.cos(p0) ** 2 + 2 * n * Math.sin(p0), r0 = Math.sqrt(c) / n;
  const raw = (l, f) => { const rr = Math.sqrt(c - 2 * n * Math.sin(f)) / n; return [rr * Math.sin(l * n), r0 - rr * Math.cos(l * n)]; };
  const [px, py] = raw((lon + 96) * r, lat * r), [cx, cy] = raw(-.6 * r, 38.7 * r);
  return [487.5 + 1300 * (px - cx), 305 - 1300 * (py - cy)];
}
// mapFrame(region, x, y, w) → placement: { x, y, w, h, xy(lon, lat) → world [x, y], P(nx, ny) }
function mapFrame(region, x, y, w) {
  const D = MAPDATA[region], h = w / D.aspect, M = { region, x, y, w, h, D };
  M.P = (nx, ny) => [x - w / 2 + nx * w, y - h / 2 + ny * h];
  M.xy = (lon, lat) => region === 'us' ? (([a, b]) => M.P(a / 975, b / 610))(albers48(lon, lat)) : M.P((lon + 180) / 360, (84 - lat) / 142);
  return M;
}
const featOf = (M, name) => M.D.f.filter(f => f.name === name || f.id === name);
function polyPts(M, flat) { const p = []; for (let i = 0; i < flat.length; i += 2) p.push(M.P(flat[i], flat[i + 1])); return p; }
function featPath(M, f) { const P = new Path2D(); for (const fl of f.polys) { const pts = polyPts(M, fl); P.moveTo(pts[0][0], pts[0][1]); for (const q of pts) P.lineTo(q[0], q[1]); P.closePath(); } return P; }
// paperMap(M, { sea, land, cols, border, seed }) — each country / state is its own cut piece of paper (cached)
const MAPCACHE = new Map();
function paperMap(M, o = {}) {
  const key = [M.region, M.w | 0, o.land, o.sea, o.seed].join('|'); let c = MAPCACHE.get(key); const pad = 80;
  if (!c) {
    c = makeCanvas(Math.ceil(M.w + pad * 2), Math.ceil(M.h + pad * 2));
    renderTo(c, new DOMMatrix([1, 0, 0, 1, -(M.x - M.w / 2) + pad, -(M.y - M.h / 2) + pad]), () => {
      if (o.sea !== false) piece(SH.rect(M.w + pad * 1.2, M.h + pad * 1.2), { x: M.x, y: M.y, col: o.sea || '#B8C9C3', mat: 'news', depth: .2, seed: 9301, jit: 0, torn: true, tornAmp: 6 });
      const cols = o.cols || [o.land || '#E7DBBE', mixCol(o.land || '#E7DBBE', '#C9B58A', .25), mixCol(o.land || '#E7DBBE', '#FFFFFF', .2)];
      M.D.f.forEach((f, i) => f.polys.forEach((fl, j) => {
        const pts = polyPts(M, fl); let ext = 0; for (const q of pts) ext = Math.max(ext, Math.abs(q[0] - pts[0][0]) + Math.abs(q[1] - pts[0][1]));
        if (ext < 10) { G.fillStyle = cols[0]; G.beginPath(); pts.forEach((q, k) => G[k ? 'lineTo' : 'moveTo'](q[0], q[1])); G.fill(); return; }
        piece(SH.poly(pts, `map${M.region}${i}_${j}_${M.w | 0}`), { col: cols[i % cols.length], mat: 'paper', depth: .45, seed: 9400 + i * 7 + j, jit: 0, wob: .4 });
      }));
    });
    MAPCACHE.set(key, c);
  }
  G.save(); noShadow(); G.drawImage(c, M.x - M.w / 2 - pad, M.y - M.h / 2 - pad); G.restore();
}
// mapHighlight(M, names, k, { col, wipe }) — highlighter ink over regions (k wipes it on left → right)
function mapHighlight(M, names, k, o = {}) {
  if (k <= 0 || PAPER.dry) return; [].concat(names).forEach(nm => featOf(M, nm).forEach(f => {
    const P = featPath(M, f); G.save(); noShadow(); G.beginPath(); G.rect(M.x - M.w / 2, M.y - M.h / 2, M.w * clamp(k), M.h); G.clip();
    G.globalCompositeOperation = 'multiply'; G.fillStyle = o.col || 'rgba(242,206,58,.85)'; G.fill(P); G.globalAlpha = .6; G.strokeStyle = mixCol(o.line || '#B3271F', '#000000', 0); G.lineWidth = o.lw || 2; G.stroke(P); G.restore();
  }));
}
// mapLift(M, name, k, { col, lift }) — the region is cut out and lifted off the map (big drop shadow)
const LIFTSH = new Map();
function mapLift(M, name, k, o = {}) {
  if (k <= 0) return; featOf(M, name).forEach((f, fi) => f.polys.forEach((fl, j) => {
    const key = `lift${M.region}${name}${j}${M.w | 0}`; let sh = LIFTSH.get(key); if (!sh) { sh = SH.poly(polyPts(M, fl), key); LIFTSH.set(key, sh); }
    const up = (o.lift ?? 18) * easeOut(k);
    piece(sh, { y: -up, col: o.col || NC.red, mat: 'paper', depth: .6 + 2.4 * k, seed: 9600 + j, jit: 0, wob: .5 });
  }));
}
function mapPin(M, lon, lat, k = 1, o = {}) {
  if (k <= 0) return null; const [x, y] = M.xy(lon, lat), s = k < 1 ? backOut(k) : 1;
  G.save(); G.translate(x, y); G.scale(s, s); pushpin(0, 0, o.col || NC.red, o.r || 12); G.restore();
  if (o.label) handText(o.label, x + (o.lx ?? 22), y + (o.ly ?? -18), o.size || 40, seg(k, .5, 1), { col: o.ink || INK.dark });
  return [x, y];
}
function mapRoute(M, a, b, k, o = {}) { const p = M.xy(...a), q = M.xy(...b); if (o.dashed) { const pts = []; for (let i = 0; i <= 30; i++) { const t = i / 30 * clamp(k); pts.push(arcPt(p, q, o.arc ?? 60, t)); } thread(pts, { col: o.col || NC.red, w: 3 }); } else markerArrow(p, q, k, { bend: o.bend ?? -.2, w: o.w || 5, ...o }); }
// mapScatter(M, n, k, { seed, off, col, r, only }) — n dots inside the land that pop in with k and switch off with off (0 → 1)
const SCAT = new Map();
function scatterPts(M, n, seed, only) {
  const key = [M.region, n, seed, only].join('|'); let pts = SCAT.get(key); if (pts) return pts;
  const feats = only ? M.D.f.filter(f => [].concat(only).includes(f.name)) : M.D.f, c = makeCanvas(400, Math.ceil(400 / M.D.aspect)), x = c.getContext('2d');
  x.fillStyle = '#000'; feats.forEach(f => f.polys.forEach(fl => { x.beginPath(); for (let i = 0; i < fl.length; i += 2) x[i ? 'lineTo' : 'moveTo'](fl[i] * c.width, fl[i + 1] * c.height); x.fill(); }));
  const d = x.getImageData(0, 0, c.width, c.height).data, q = rnd('scat' + seed); pts = [];
  for (let tries = 0; pts.length < n && tries < n * 60; tries++) { const u = q(), v = q(), px = Math.floor(u * c.width), py = Math.floor(v * c.height); if (d[(py * c.width + px) * 4 + 3] > 0) pts.push([u, v, q()]); }
  SCAT.set(key, pts); return pts;
}
function mapScatter(M, n, k, o = {}) {
  if (k <= 0 || PAPER.dry) return; const pts = scatterPts(M, n, o.seed || 1, o.only), off = clamp(o.off || 0), r = o.r || 5;
  G.save(); noShadow();
  for (const [u, v, w] of pts) { if (w > k) continue; const [x, y] = M.P(u, v), dark = w < off;
    G.fillStyle = dark ? 'rgba(40,32,30,.55)' : (o.col || '#C8342A'); G.beginPath(); G.arc(x, y, r * (dark ? .8 : 1), 0, TAU); G.fill();
    if (!dark) { G.fillStyle = 'rgba(255,240,220,.6)'; G.beginPath(); G.arc(x - r * .3, y - r * .3, r * .3, 0, TAU); G.fill(); } }
  G.restore();
}

// ================= graph-paper charts =================
let GRIDPAT = null;
function graphPaper(x, y, w, h, o = {}) {
  piece(SH.rect(w, h), { x, y, rot: o.rot || 0, col: o.col || '#EEF0E4', mat: 'paper', depth: o.depth ?? 1.3, seed: o.seed || 9701, jit: 0, torn: o.torn });
  if (PAPER.dry) return; const cell = o.cell || 26;
  G.save(); G.translate(x, y); G.rotate((o.rot || 0) * D2R); G.beginPath(); G.rect(-w / 2, -h / 2, w, h); G.clip(); noShadow();
  for (let gx = -w / 2, i = 0; gx <= w / 2; gx += cell, i++) { G.fillStyle = i % 5 ? 'rgba(60,120,160,.16)' : 'rgba(60,120,160,.32)'; G.fillRect(gx, -h / 2, i % 5 ? 1 : 1.8, h); }
  for (let gy = -h / 2, i = 0; gy <= h / 2; gy += cell, i++) { G.fillStyle = i % 5 ? 'rgba(60,120,160,.16)' : 'rgba(60,120,160,.32)'; G.fillRect(-w / 2, gy, w, i % 5 ? 1 : 1.8); }
  G.restore(); if (o.aged) ageOver(xform(SH.rect(w, h), x, y), { amt: o.aged, seed: o.seed || 9701 });
}
// chartFrame(x, y, w, h, { x: [min, max], y: [min, max], xTicks: [[v, label]], yTicks, title, unit, k }) → C with C.X(v), C.Y(v)
function chartFrame(x, y, w, h, o = {}) {
  const pl = o.padL ?? w * .12, pr = o.padR ?? w * .05, pt = o.padT ?? h * .14, pb = o.padB ?? h * .14, x0 = x - w / 2 + pl, x1 = x + w / 2 - pr, y0 = y + h / 2 - pb, y1 = y - h / 2 + pt;
  const C = { x0, x1, y0, y1, X: v => lerp(x0, x1, (v - o.x[0]) / (o.x[1] - o.x[0])), Y: v => lerp(y0, y1, (v - o.y[0]) / (o.y[1] - o.y[0])) };
  const k = o.k ?? 1, ink = o.ink || INK.dark, fs = o.fs || h * .055;
  markerLine(x0, y0, x1 + 10, y0, seg(k, 0, .5), { col: ink, w: 4, bow: 1, seed: 21 }); markerLine(x0, y0, x0, y1 - 10, seg(k, .1, .6), { col: ink, w: 4, bow: -1, seed: 22 });
  (o.xTicks || []).forEach(([v, lab], i) => handText(lab, C.X(v), y0 + fs * 1.3, fs, seg(k, .4 + i * .04, .6 + i * .04), { align: 'center', col: ink }));
  (o.yTicks || []).forEach(([v, lab], i) => { const yy = C.Y(v); handText(lab, x0 - fs * .4, yy + fs * .3, fs, seg(k, .4 + i * .04, .6 + i * .04), { align: 'right', col: ink }); G.save(); noShadow(); G.fillStyle = 'rgba(40,30,30,.35)'; G.fillRect(x0 - 8, yy - 1, 8, 2.5); G.restore(); });
  if (o.title) print(o.title, x, y - h / 2 + pt * .55, `700 ${fs * 1.15}px ${TF.cond}`, { ls: 3 });
  return C;
}
// lineChart(C, [[x, y], ...], k, { col, w, dots, area }) — the line draws itself on; dots pop as it passes
function lineChart(C, pts, k, o = {}) {
  const P = pts.map(([a, b]) => [C.X(a), C.Y(b)]), dense = []; for (let i = 0; i < P.length - 1; i++) for (let j = 0; j < 12; j++) dense.push([lerp(P[i][0], P[i + 1][0], j / 12), lerp(P[i][1], P[i + 1][1], j / 12)]); dense.push(P[P.length - 1]);
  if (o.area && k > 0) { const D2 = partial(dense, k); G.save(); noShadow(); G.globalCompositeOperation = 'multiply'; G.fillStyle = o.area; G.beginPath(); G.moveTo(D2[0][0], C.y0); D2.forEach(q => G.lineTo(q[0], q[1])); G.lineTo(D2[D2.length - 1][0], C.y0); G.fill(); G.restore(); }
  strokeK(dense, k, { col: o.col || INK.red, w: o.w || 7, ...o });
  if (o.dots !== false) { const L = P.length - 1; P.forEach(([x, y], i) => { const kk = seg(k * L, i - .02, i + .3); if (kk > 0) { const s = backOut(kk); G.save(); G.translate(x, y); G.scale(s, s); piece(SH.circle(o.dot || 11), { col: o.col || INK.red, depth: .8, seed: 9800 + i, jit: 0 }); G.restore(); } }); }
}
// barChart(C, [[x, value, label?, col?], ...], k, { w, col, valFmt }) — paper bars grow up from the axis, one after another
function barChart(C, bars, k, o = {}) {
  const n = bars.length, bw = o.w || (C.x1 - C.x0) / n * .55;
  bars.forEach(([xv, v, lab, col], i) => {
    const kk = seg(k * n, i, i + 1), x = C.X(xv), top = C.Y(v), h = C.y0 - top; if (kk <= 0) return;
    G.save(); G.translate(x, C.y0); G.scale(1, easeOut(kk)); piece(SH.rect(bw, h), { y: -h / 2, col: col || o.col || '#D9A441', mat: 'paper', depth: 1, seed: 9900 + i, jit: 0 }); G.restore();
    if (lab) handText(lab, x, C.y0 + (o.fs || 40) * 1.3, o.fs || 40, kk, { align: 'center', col: INK.dark });
    if (kk >= 1 && o.valFmt) print(o.valFmt(v), x, top - 16, `${(o.fs || 40) * 1.1}px ${TF.tab}`, { col: col || INK.dark });
  });
}
function chartNote(C, xv, yv, txt, k, o = {}) {
  const p = [C.X(xv), C.Y(yv)], q = [p[0] + (o.dx ?? -160), p[1] + (o.dy ?? -120)];
  markerArrow(q, [p[0] + (o.dx < 0 ? -14 : 14) * 0, p[1] - 14], seg(k, 0, .6), { col: o.col || INK.red, w: 5, bend: o.bend ?? .25 });
  handText(txt, q[0], q[1] - 12, o.size || 46, seg(k, .4, 1), { align: 'center', col: o.col || INK.red });
}

// ================= documents =================
function highlighter(x, y, w, h, k, o = {}) {
  if (k <= 0 || PAPER.dry) return; const ww = w * clamp(k), sd = o.seed || 1, col = o.col || 'rgba(246,214,52,.62)';
  G.save(); noShadow(); G.globalCompositeOperation = 'multiply'; G.fillStyle = col;
  for (let pass = 0; pass < 2; pass++) { G.beginPath(); const n = Math.max(4, Math.round(ww / 18));
    for (let i = 0; i <= n; i++) { const t = i / n; G.lineTo(x + ww * t, y + (fbm1(t * 4 + pass, sd) - .5) * h * .25 + pass * 2); }
    for (let i = n; i >= 0; i--) { const t = i / n; G.lineTo(x + ww * t, y + h + (fbm1(t * 4 + 9 + pass, sd) - .5) * h * .25 - pass * 2); }
    G.closePath(); G.fill(); G.globalAlpha *= .55; }
  G.restore();
}
// docPage(x, y, w, lines, { title, caseNo, pleading, size, rot, aged, seed, hl: [{ line, k, from, to }], marks: [{ line, kind, k, from, to }] })
//   lines: strings; a line starting with '#' is a bold heading, '>' is indented. Returns { h, line(i) → [x0, y, x1] local }.
function docPage(x, y, w, lines, o = {}) {
  const size = o.size || w * .028, lh = size * 1.8, mL = w * (o.pleading ? .16 : .1), head = (o.title ? size * 3.2 : 0) + (o.caseNo ? size * 1.6 : 0), h = o.h || head + lines.length * lh + size * 4;
  const font = l => l.startsWith('#') ? `700 ${size * 1.05}px ${TF.old}` : `${size}px ${TF.type}`, txt = l => l.replace(/^[#>]\s?/, '');
  G.save(); G.translate(x, y); G.rotate((o.rot || 0) * D2R);
  piece(SH.rect(w, h), { col: o.col || '#F3EFE4', mat: 'card', depth: o.depth ?? 1.4, seed: o.seed || 9951, jit: 0 });
  if (o.aged) ageOver(SH.rect(w, h), { amt: o.aged, seed: o.seed || 9951 });
  let cy = -h / 2 + size * 2.4;
  if (o.title) { print(o.title, 0, cy, `700 ${size * 1.25}px ${TF.old}`, { ls: 2 }); cy += size * 1.1; G.save(); noShadow(); G.fillStyle = NC.newsInk; G.globalAlpha = .7; G.fillRect(-w * .36, cy, w * .72, 2); G.restore(); cy += size * 2.1; }
  if (o.caseNo) { print(o.caseNo, w / 2 - w * .08, cy - size * .6, `${size * .9}px ${TF.type}`, { align: 'right', alpha: .8 }); cy += size * 1.6; }
  if (o.pleading) { G.save(); noShadow(); G.fillStyle = 'rgba(150,40,40,.45)'; G.fillRect(-w / 2 + mL - size * .9, -h / 2, 1.6, h); G.fillRect(-w / 2 + mL - size * .6, -h / 2, 1.6, h); G.restore(); }
  const rows = lines.map((l, i) => { const yy = cy + i * lh, x0 = -w / 2 + mL + (l.startsWith('>') ? size * 2 : 0); return { yy, x0, l, f: font(l), t: txt(l) }; });
  const span = (r, from, to) => { const a = from ? textW(r.t.slice(0, from), r.f) : 0, b = textW(to != null ? r.t.slice(0, to) : r.t, r.f); return [r.x0 + a, r.x0 + b]; };
  (o.hl || []).forEach(({ line, k, from, to, col }) => { const r = rows[line]; if (!r) return; const [a, b] = span(r, from, to); highlighter(a - 4, r.yy - size * .9, b - a + 8, size * 1.2, k, { col, seed: line + 3 }); });
  rows.forEach((r, i) => { if (o.pleading) print(String(i + 1), -w / 2 + mL - size * 1.5, r.yy, `${size * .8}px ${TF.type}`, { align: 'right', alpha: .55 }); print(r.t, r.x0, r.yy, r.f, { align: 'left' }); });
  (o.marks || []).forEach(({ line, kind, k, from, to, col }) => { const r = rows[line]; if (!r) return; const [a, b] = span(r, from, to);
    if (kind === 'circle') markerCircle((a + b) / 2, r.yy - size * .3, (b - a) / 2 + size * .8, size * 1.1, k, { col: col || INK.red, w: 5 });
    else markerLine(a, r.yy + size * .3, b, r.yy + size * .35, k, { col: col || INK.red, w: 4, bow: 2 }); });
  G.restore();
  return { h, rows };
}

// ================= kinetic type =================
// kinetic(text, x, y, size, k, { style, hl, font, col, hlCol, lh, strip }) — '|' breaks lines; words land one per beat of k
function kinetic(text, x, y, size, k, o = {}) {
  if (k <= 0 || PAPER.dry) return; const style = o.style || 'slam', font = o.font || `${size}px ${TF.tab}`, lines = text.split('|').map(s => s.trim().split(/\s+/)), N = lines.flat().length, lh = (o.lh || 1.05) * size, gap = size * .28;
  let j = 0; const tot = lines.length * lh;
  lines.forEach((ws, li) => {
    const widths = ws.map(wd => textW(wd, font)), lw = widths.reduce((a, b) => a + b, 0) + gap * (ws.length - 1); let cx = x - lw / 2; const cy = y - tot / 2 + lh * (li + .78);
    ws.forEach((wd, wi) => {
      const kk = clamp(k * N - j), mid = cx + widths[wi] / 2, hl = (o.hl || []).includes(j); cx += widths[wi] + gap; j++; if (kk <= 0) return;
      if (style === 'type') { const n = Math.max(1, Math.round(wd.length * kk)); print(wd.slice(0, n), mid - widths[wi] / 2, cy, font, { align: 'left', col: o.col || NC.newsInk }); if (hl && kk >= 1) highlighter(mid - widths[wi] / 2 - 6, cy - size * .82, widths[wi] + 12, size * .95, 1, { col: o.hlCol, seed: j }); return; }
      const s = style === 'slam' ? (kk < 1 ? lerp(1.9, 1, easeOut(kk)) : 1) : (kk < 1 ? backOut(kk) : 1), r = (hash(j * 3.7 + (o.seed || 0)) - .5) * (style === 'strip' ? 6 : 2.5);
      G.save(); G.translate(mid, cy - size * .35); G.rotate(r * D2R); G.scale(s, s);
      if (style === 'strip') piece(SH.rect(widths[wi] + size * .35, size * 1.08), { col: hl ? (o.hlBg || NC.red) : (o.bg || NC.news), mat: 'news', torn: true, tornAmp: 3, depth: 1.6, seed: 9980 + j, jit: 0 });
      else if (hl) highlighter(-widths[wi] / 2 - 8, -size * .48, widths[wi] + 16, size * .95, seg(kk, .3, 1), { col: o.hlCol, seed: j });
      print(wd, 0, size * .35, font, { col: style === 'strip' && hl ? '#FBF4E6' : (hl && o.hlInk) || o.col || NC.newsInk, alpha: kk < 1 && style === 'slam' ? .4 + .6 * kk : .95 });
      G.restore();
    });
  });
}

// ================= parallax photo layers =================
const OUTLINED = new Map();
function outlined(img, pad = 10) {   // a white "scissor margin" around a cut-out PNG
  let c = OUTLINED.get(img); if (c) return c; c = makeCanvas(img.width + pad * 2, img.height + pad * 2); const x = c.getContext('2d');
  for (let a = 0; a < 16; a++) x.drawImage(img, pad + Math.cos(a / 16 * TAU) * pad, pad + Math.sin(a / 16 * TAU) * pad);
  x.globalCompositeOperation = 'source-in'; x.fillStyle = '#F4EFE3'; x.fillRect(0, 0, c.width, c.height); x.globalCompositeOperation = 'source-over'; x.drawImage(img, pad, pad);
  OUTLINED.set(img, c); return c;
}
// photoCut(src, x, y, w, { h, rot, tone: 'bw' | 'sepia' | 'color', halftone, border, torn, depth, seed, key })
//   src: a file in TRAIL.photos (a PNG with alpha is drawn as a cut-out with a white margin; anything else as a print)
//        or a LUM function (halftone placeholder print)
function photoCut(src, x, y, w, o = {}) {
  if (PAPER.dry) return; const tone = o.tone || 'sepia', filt = tone === 'bw' ? 'grayscale(1) contrast(1.15)' : tone === 'sepia' ? 'grayscale(1) sepia(.5) contrast(1.15)' : 'none';
  G.save(); G.translate(x, y); G.rotate((o.rot || 0) * D2R);
  if (typeof src === 'function') { const h = o.h || w * .7; piece(SH.rect(w + 18, h + 18), { col: '#F1ECE2', mat: 'card', depth: o.depth ?? 1.4, seed: o.seed || 9990, jit: 0, torn: o.torn }); photo(0, 0, w, h, src, { key: o.key || 'pc' + (o.seed || 0), sp: o.sp || 6 }); G.restore(); return; }
  const img = PHOTOS[src]; if (!img) { G.restore(); return; }
  const h = o.h || w * img.height / img.width, cut = /\.png$/i.test(src) && o.cutout !== false;
  if (cut) { const c = outlined(img), sc = w / img.width; setShadow(o.depth ?? 2, curScale()); G.filter = filt; G.drawImage(c, -w / 2 - 10 * sc, -h / 2 - 10 * sc, c.width * sc, c.height * sc); G.filter = 'none'; noShadow(); }
  else { piece(SH.rect(w + 20, h + 20), { col: '#F1ECE2', mat: 'card', depth: o.depth ?? 1.4, seed: o.seed || 9991, jit: 0, torn: o.torn });
    G.save(); G.beginPath(); G.rect(-w / 2, -h / 2, w, h); G.clip(); G.filter = filt; G.drawImage(img, -w / 2, -h / 2, w, h); G.filter = 'none'; G.restore(); }
  if (o.halftone !== false) { G.save(); noShadow(); G.beginPath(); G.rect(-w / 2, -h / 2, w, h); G.clip(); G.globalCompositeOperation = 'multiply'; G.globalAlpha = .22; G.fillStyle = htPattern(4); G.fillRect(-w / 2, -h / 2, w, h); G.restore(); }
  G.restore();
}
// photoLayers([{ src, x, y, w, k, ...photoCut opts }]) — each layer on its own parallax plane (k < 1 far, > 1 near)
function photoLayers(list) { list.forEach(L => layer(L.k ?? 1, () => photoCut(L.src, L.x, L.y, L.w, L))); }
