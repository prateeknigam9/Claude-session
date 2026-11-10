// ep01props.js — Case 01 (OneCoin) pieces, 16:9. Generic puppets only, no likenesses. (stage/queen/coin/screens from the parked Shorts test)
//   queen(x, y, u, o)      the "Crypto Queen" puppet: a generic paper puppet in an evening gown (not a likeness)
//   stageSet(st, o)        an arena stage at night: spotlight cones, crowd silhouettes with phone lights, a big screen
//   coinCard(x, y, r, o)   a gold paper coin ('ONE' or '?')
//   priceScreen(...)       a phone showing a balance that only goes up
//   withdrawScreen(...)    a phone with a WITHDRAW button (stamped DENIED)
//   paperPeople(...)       a row of small paper people popping in
//   voTrack([...])         planned-narration band for the storyboard animatic (TRAIL.showVO)
EXECS.queen = { seed: 3500, build: 'slim', skin: '#EDC7A6', suit: '#9E1F2C', suit2: '#861A25', shirt: '#9E1F2C', neck: 'open', hair: 'bob', hairCol: '#1E1614', iris: '#3A2618', lip: '#B0303A', earrings: true };
function queen(x, y, u, o = {}) {
  const J = exec('queen', x, y, u, { ...o });
  if (o.gown !== false && !PAPER.dry) {   // the gown: a long red paper skirt from the waist to the floor, over the legs
    const wy = y - u * 4.6, hw = u * 1.25;
    piece(SH.poly([[-hw * .62, 0], [hw * .62, 0], [hw * 1.75, u * 4.75], [-hw * 1.75, u * 4.75]]), { x, y: wy, col: '#9E1F2C', mat: 'paper', depth: 1.15, seed: 3590, jit: o.jit ?? .6 });
    piece(SH.poly([[-hw * .2, u * .5], [hw * .05, u * .5], [hw * .3, u * 4.7], [-hw * .4, u * 4.7]]), { x, y: wy, col: '#B8303C', mat: 'tissue', depth: .2, seed: 3591, jit: 0 });
  }
  return J;
}
// stageSet(st, { beams, screen }) — draw inside a camera; the floor line is y = 1500 (world), centre x = 540
function stageSet(st, o = {}) {
  backdrop('#0F1416', { to: 'rgba(0,0,0,.6)' });
  piece(SH.rect(1700, 560), { x: 540, y: 520, col: '#1B2629', mat: 'card', depth: .3, seed: 8801, jit: 0 });
  if (o.screen) { piece(SH.rect(900, 380), { x: 540, y: 640, col: '#24363A', mat: 'card', depth: .5, seed: 8802, jit: 0 }); print(o.screen, 540, 690, `150px ${TF.tab}`, { col: '#E8C25A', ls: 10 }); }
  piece(SH.rect(2400, 500), { x: 540, y: 1760, col: '#2A2224', mat: 'wood', depth: .8, seed: 8803, jit: 0 });
  piece(SH.rect(2400, 30), { x: 540, y: 1515, col: '#3E3234', mat: 'wood', depth: 1, seed: 8804, jit: 0 });
  if (!PAPER.dry) {   // spotlight cones (light, so 'screen')
    G.save(); noShadow(); G.globalCompositeOperation = 'screen';
    (o.beams || [[540, -200, 540, 1500, 260]]).forEach(([x0, y0, x1, y1, r], i) => { const g = G.createLinearGradient(x0, y0, x1, y1); g.addColorStop(0, 'rgba(255,240,205,.0)'); g.addColorStop(.35, 'rgba(255,236,190,.22)'); g.addColorStop(1, 'rgba(255,230,180,.34)');
      G.fillStyle = g; G.beginPath(); G.moveTo(x0 - 30, y0); G.lineTo(x0 + 30, y0); G.lineTo(x1 + r, y1); G.lineTo(x1 - r, y1); G.closePath(); G.fill();
      G.fillStyle = 'rgba(255,236,190,.25)'; G.beginPath(); G.ellipse(x1, y1, r, r * .18, 0, 0, TAU); G.fill(); });
    G.restore(); }
}
// crowd(st, y, n, { s, phones }) — rows of black paper heads/shoulders in the foreground, with phone lights
function crowd(st, y = 1800, o = {}) {
  const s = o.s || 1; for (let row = 0; row < 2; row++) for (let i = 0; i < 9; i++) {
    const x = -260 + i * 200 + row * 100 + (hash(i * 3.1 + row) - .5) * 40, yy = y + row * 120, bob = Math.sin(st * 3 + i) * 4 * s;
    piece(SH.round(170 * s, 200 * s, 70 * s), { x, y: yy + 120 * s + bob, col: '#0B0D0E', mat: 'card', depth: 1.6, seed: 8810 + i + row * 10, jit: 0 });
    piece(SH.ellipse(52 * s, 62 * s), { x, y: yy - 20 * s + bob, col: '#0B0D0E', mat: 'card', depth: 1.6, seed: 8830 + i + row * 10, jit: 0 });
    if (o.phones && hash(i * 7.7 + row) < .5 && !PAPER.dry) { G.save(); noShadow(); G.fillStyle = 'rgba(220,240,255,.9)'; G.fillRect(x + 30 * s, yy - 90 * s + bob, 26 * s, 44 * s); G.restore(); }
  }
}
// coinCard(x, y, r, { txt, k, rot, seed }) — gold paper coin; k pops it in
function coinCard(x, y, r, o = {}) {
  const k = o.k ?? 1; if (k <= 0) return; const p = k < 1 ? backOut(k) : 1;
  G.save(); G.translate(x, y); G.rotate((o.rot ?? -8) * D2R); G.scale(p, p);
  piece(SH.circle(r), { col: '#D9AE4B', mat: 'card', depth: 2, seed: o.seed || 8850, jit: 0 });
  piece(SH.circle(r * .8), { col: '#E7C468', mat: 'card', depth: .4, seed: (o.seed || 8850) + 1, jit: 0 });
  print(o.txt || 'ONE', 0, r * .2, `${r * (o.txt === '?' ? .9 : .5)}px ${TF.tab}`, { col: '#7A5A12', alpha: .9 });
  G.restore();
}
// priceScreen(x, y, w, value, { k, label, rot, seed }) — phone card: YOUR BALANCE + an up-only sparkline (k draws it)
function priceScreen(x, y, w, val, o = {}) {
  const h = w * 1.5; G.save(); G.translate(x, y); G.rotate((o.rot ?? 3) * D2R);
  piece(SH.round(w + 26, h + 26, w * .1), { col: '#232627', mat: 'card', depth: 1.8, seed: (o.seed || 8860) + 1, jit: 0 });
  piece(SH.round(w, h, w * .07), { col: '#ECEFEE', mat: 'card', depth: .2, seed: o.seed || 8860, jit: 0, edge: false });
  print(o.label || 'YOUR BALANCE', 0, -h * .32, `700 ${w * .065}px ${TF.cond}`, { col: '#4A5356', ls: 3 });
  print(val, 0, -h * .18, `${w * .15}px ${TF.tab}`, { col: '#2E8A55' });
  const pts = [], n = 14; for (let i = 0; i <= n; i++) pts.push([-w * .38 + i / n * w * .76, h * .28 - Math.pow(i / n, 1.6) * h * .4 + (hash(i * 4.1) - .5) * h * .03]);
  strokeK(pts, o.k ?? 1, { col: '#2E8A55', w: 8, comp: 'source-over' });
  print('▲ only up', w * .38, h * .4, `700 ${w * .06}px ${TF.cond}`, { align: 'right', col: '#2E8A55' });
  G.restore();
}
// withdrawScreen(x, y, w, { press, denied, rot }) — phone with a big WITHDRAW button; press 0..1 dims it; denied 0..1 stamps
function withdrawScreen(x, y, w, o = {}) {
  const h = w * 1.5; G.save(); G.translate(x, y); G.rotate((o.rot ?? -3) * D2R);
  piece(SH.round(w + 26, h + 26, w * .1), { col: '#232627', mat: 'card', depth: 1.8, seed: 8871, jit: 0 });
  piece(SH.round(w, h, w * .07), { col: '#ECEFEE', mat: 'card', depth: .2, seed: 8870, jit: 0, edge: false });
  print('YOUR BALANCE', 0, -h * .3, `700 ${w * .065}px ${TF.cond}`, { col: '#4A5356', ls: 3 }); print('€ 48,250', 0, -h * .16, `${w * .14}px ${TF.tab}`, { col: '#2E8A55' });
  const pr = o.press || 0, s = 1 - .06 * Math.sin(Math.PI * clamp(pr * 2));
  G.save(); G.translate(0, h * .12); G.scale(s, s); piece(SH.round(w * .7, w * .2, w * .05), { col: pr > .5 ? '#7FA88E' : '#2E8A55', mat: 'card', depth: 1, seed: 8872, jit: 0 });
  print('WITHDRAW', 0, w * .035, `${w * .085}px ${TF.tab}`, { col: '#F3F7F2', ls: 3 }); G.restore();
  if (pr > .5) print('Withdrawals are not available right now.', 0, h * .3, `${w * .045}px ${TF.cond}`, { col: '#8E2019' });
  G.restore();
  if (o.denied) stamp(x, y + h * .05, 'DENIED', o.denied, { size: w * .2, rot: -14 });
}
// paperPeople(x, y, n, s, k, { cols }) — a row of simple paper people (head + body) popping in left → right
function paperPeople(x, y, n, s, k, o = {}) {
  const cols = o.cols || ['#C88A5A', '#7E9C70', '#5E7FA8', '#B8574A', '#D9AE4B', '#8C6BA0'], sp = s * 1.25;
  for (let i = 0; i < n; i++) { const kk = clamp(k * n - i); if (kk <= 0) continue; const p = kk < 1 ? backOut(kk) : 1, px = x - (n - 1) * sp / 2 + i * sp;
    G.save(); G.translate(px, y); G.scale(p, p);
    piece(SH.round(s * .9, s * 1.1, s * .4), { y: s * .2, col: cols[i % cols.length], mat: 'paper', depth: 1.2, seed: 8880 + i, jit: .5 });
    piece(SH.circle(s * .3), { y: -s * .62, col: ['#EDC6A3', '#B47D57', '#8C5B3E', '#E7BB96'][i % 4], mat: 'paper', depth: 1.3, seed: 8890 + i, jit: .5 });
    G.restore(); }
}

// cropMap(M, lon0, lon1, lat0, lat1, { sea, land, seed }) — paper map of only the countries inside a lon/lat box, drawn at the
// scale of world frame M (use a big M.w to zoom into a region without rasterising the whole world). Cached.
const CROPC = new Map();
function cropMap(M, lon0, lon1, lat0, lat1, o = {}) {
  const [x0, y0] = M.xy(lon0, lat1), [x1, y1] = M.xy(lon1, lat0), key = [M.w | 0, lon0, lon1, lat0, lat1, o.seed].join('|'); let c = CROPC.get(key);
  if (!c) { c = makeCanvas(Math.ceil(x1 - x0), Math.ceil(y1 - y0));
    renderTo(c, new DOMMatrix([1, 0, 0, 1, -x0, -y0]), () => {
      G.fillStyle = mat(o.sea || '#2F4E52', 'paper'); G.fillRect(x0, y0, x1 - x0, y1 - y0);
      const cols = [o.land || '#E7DBBE', mixCol(o.land || '#E7DBBE', '#C9B58A', .25), mixCol(o.land || '#E7DBBE', '#FFFFFF', .2)];
      M.D.f.forEach((f, i) => f.polys.forEach((fl, j) => { const pts = polyPts(M, fl); let a = 1e9, b = -1e9, cc = 1e9, d = -1e9; pts.forEach(([px, py]) => { a = Math.min(a, px); b = Math.max(b, px); cc = Math.min(cc, py); d = Math.max(d, py); });
        if (b < x0 || a > x1 || d < y0 || cc > y1 || pts.length < 3) return;
        piece(SH.poly(pts, `crop${M.w | 0}_${i}_${j}`), { col: cols[i % 3], mat: 'paper', depth: .5, seed: 9700 + i * 7 + j, jit: 0 }); })); });
    CROPC.set(key, c); }
  G.save(); noShadow(); G.drawImage(c, x0, y0); G.restore();
}
// plane(x, y, s, rot) — a small paper airliner, top view
function plane(x, y, s = 1, rot = 0) {
  G.save(); G.translate(x, y); G.rotate(rot * D2R);
  piece(SH.round(170 * s, 26 * s, 13 * s), { col: '#EDEFF0', mat: 'card', depth: 2.2, seed: 9801, jit: 0 });
  piece(SH.poly([[-10 * s, 0], [25 * s, 0], [-15 * s, -95 * s], [-35 * s, -95 * s]]), { col: '#DDE2E4', mat: 'card', depth: 2, seed: 9802, jit: 0 });
  piece(SH.poly([[-10 * s, 0], [25 * s, 0], [-15 * s, 95 * s], [-35 * s, 95 * s]]), { col: '#DDE2E4', mat: 'card', depth: 2, seed: 9803, jit: 0 });
  piece(SH.poly([[-70 * s, 0], [-55 * s, 0], [-80 * s, -35 * s], [-90 * s, -35 * s]]), { col: '#DDE2E4', mat: 'card', depth: 2, seed: 9804, jit: 0 });
  piece(SH.poly([[-70 * s, 0], [-55 * s, 0], [-80 * s, 35 * s], [-90 * s, 35 * s]]), { col: '#DDE2E4', mat: 'card', depth: 2, seed: 9805, jit: 0 });
  G.restore();
}
// iconCard(x, y, w, kind, label, { k, crossed, rot }) — a pinned card with a simple paper icon: 'vault' | 'gun' | 'coin' | 'bank'
function iconCard(x, y, w, kind, label, o = {}) {
  const k = o.k ?? 1; if (k <= 0) return; popIn(k, x, y, () => {
    pinCard(x, y, w, w * 1.15, { col: '#EEE7D4', mat: 'paper', rot: o.rot ?? 0, seed: o.seed || 9810, draw: (cw, ch) => {
      const s = cw / 300, cy = -ch * .08;
      if (kind === 'vault') { piece(SH.circle(95 * s), { y: cy, col: '#8C979B', mat: 'card', depth: .6, seed: 9811, jit: 0 }); piece(SH.circle(60 * s), { y: cy, col: '#B6BEC1', mat: 'card', depth: .4, seed: 9812, jit: 0 });
        for (let i = 0; i < 4; i++) { G.save(); G.translate(0, cy); G.rotate(i * Math.PI / 4); piece(SH.rect(110 * s, 10 * s), { col: '#5E676A', mat: 'card', depth: .2, seed: 9813 + i, jit: 0 }); G.restore(); } }
      if (kind === 'gun') piece(SH.poly([[-95 * s, -30 * s], [85 * s, -30 * s], [85 * s, 0], [-20 * s, 0], [-30 * s, 70 * s], [-80 * s, 70 * s], [-70 * s, 0], [-95 * s, 0]]), { y: cy - 10 * s, col: '#3B3D40', mat: 'card', depth: .6, seed: 9820, jit: 0 });
      if (kind === 'coin') { piece(SH.circle(90 * s), { y: cy, col: '#D9AE4B', mat: 'card', depth: .6, seed: 9830, jit: 0 }); print('ONE', 0, cy + 22 * s, `${60 * s}px ${TF.tab}`, { col: '#7A5A12' }); }
      print(label, 0, ch * .4, `${34 * s}px ${TF.tab}`, { col: CASE.ink, ls: 2 });
    } }); });
  if (o.crossed) markerLine(x - w * .4, y - w * .45, x + w * .4, y + w * .3, o.crossed, { w: 14, col: '#D8352A', comp: 'source-over' });
}
// pyramid(x, y, rows, s, k, { cols, red }) — rows of paper people building down from one at the top (k 0 → 1 over all rows)
function pyramid(x, y, rows, s, k, o = {}) {
  const cols = ['#C88A5A', '#7E9C70', '#5E7FA8', '#B8574A', '#D9AE4B', '#8C6BA0'];
  for (let r = 0; r < rows; r++) { const n = r * 2 + 1, kk = clamp(k * rows - r); if (kk <= 0) continue;
    for (let i = 0; i < n; i++) { const p = clamp(kk * n - i); if (p <= 0) continue; const px = x + (i - (n - 1) / 2) * s * 1.05, py = y + r * s * 1.25, red = o.red && r >= rows - (o.redRows || 1);
      G.save(); G.translate(px, py); const sc = p < 1 ? backOut(p) : 1; G.scale(sc, sc);
      piece(SH.round(s * .8, s * .75, s * .3), { y: s * .2, col: red ? '#C8322A' : cols[(r + i) % 6], mat: 'paper', depth: 1.1, seed: 9900 + r * 31 + i, jit: .4 });
      piece(SH.circle(s * .24), { y: -s * .32, col: ['#EDC6A3', '#B47D57', '#8C5B3E', '#E7BB96'][(r * 3 + i) % 4], mat: 'paper', depth: 1.2, seed: 9950 + r * 31 + i, jit: .4 });
      G.restore(); } }
}
// the storyboard VO band (planned narration as text; switched off for the real render)
const VO_TRACK = []; TRAIL.showVO = false;
function voTrack(list) { VO_TRACK.push(...list); }
window.overlayHook = (c, t) => {
  if (!TRAIL.showVO) return; const cur = VO_TRACK.find(([a, b]) => t >= a - .05 && t < b + .3); if (!cur) return;
  c.save(); c.font = `30px ${TF.type}`; const words = cur[2].split(' '), lines = []; let L = '';
  words.forEach(w => { const tt = L ? L + ' ' + w : w; if (c.measureText(tt).width > 1500 && L) { lines.push(L); L = w; } else L = tt; }); if (L) lines.push(L);
  const bh = 22 + lines.length * 40, y0 = H - 40 - bh, bw = Math.min(1640, Math.max(...lines.map(l => c.measureText(l).width)) + 80);
  c.fillStyle = 'rgba(10,12,13,.75)'; c.fillRect(W / 2 - bw / 2, y0, bw, bh); c.fillStyle = '#F3ECDD'; c.textAlign = 'center'; c.textBaseline = 'middle';
  lines.forEach((l, i) => c.fillText(l, W / 2, y0 + 30 + i * 40)); c.font = '700 14px sans-serif'; c.fillStyle = '#E8B04A'; c.textAlign = 'left'; c.fillText('VO (storyboard)', W / 2 - bw / 2 + 10, y0 + 12); c.restore();
};
