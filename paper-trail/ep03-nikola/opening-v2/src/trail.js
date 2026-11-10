// trail.js — "The Paper Trail: Billion-Dollar Blunders" series kit, on top of cutout.js + cast.js.
//
// Shared by every episode: noir desk palette & materials (cork, newsprint, manila), corkboard + push pins + red string,
// the red-string transition (trString), newspaper clippings, ransom-note letters, rubber stamps, case tags, label tape,
// halftone photos, banknotes, the split-flap money counter, finance props, and four generic executive puppets in three
// switchable styles (jointed / collage / silhouette).
//
//   TRAIL.puppetStyle = 'jointed' | 'collage' | 'silhouette'   (global default; override per puppet with { style })
//   TRAIL.mood        = 'noir' | 'warm'                         (lamp / vignette strength)
// All angles in DEGREES, all poses on stepped time sm(lt), every function a pure function of t (see GUIDE.md).

const TRAIL = { puppetStyle: 'jointed', mood: 'noir', execBrads: 'pewter' };
PAPER.shadow = 1.15;

// ---------- palette ----------
const NC = {
  cork: '#A8774A', corkDk: '#87592F', frame: '#4E3322', wall: '#3A3337', wallDk: '#2C2629', floor: '#4A3024', desk: '#5A3826',
  news: '#E8E0CB', newsDk: '#CDC3A8', newsInk: '#231F1C', manila: '#E2C68C', manilaDk: '#C6A362', blackCard: '#2A2526',
  red: '#B8322A', redDk: '#8C231D', stamp: '#C23A2E', brass: '#C9A04A', tape: '#1E1B1C',
  money: '#7E9C70', moneyDk: '#4E6A47', moneyLt: '#D3DEC0', shirt: '#F0EBDF', gold: '#D9AE4B',
};
const TF = {   // fonts (loaded in ENGINE.setup)
  head: '"Playfair Display", Georgia, serif', tab: 'Anton, Impact, sans-serif', type: '"Special Elite", "Courier New", monospace',
  old: '"Old Standard TT", Georgia, serif', cond: 'Oswald, "Arial Narrow", sans-serif',
};

// ---------- materials: cork, newsprint, manila ----------
Object.assign(GRAIN_SPEC, {
  cork: { mott: 20, mid: 22, fine: 40, fib: 0, fibL: [2, 4], fibA: 0, specks: 3200, str: .95 },
  news: { mott: 5, mid: 4, fine: 12, fib: 320, fibL: [2, 7], fibA: .07, specks: 50, creases: 5, str: .55 },
  manila: { mott: 7, mid: 5, fine: 6, fib: 600, fibL: [3, 12], fibA: .08, specks: 40, str: .6 },
});

// ---------- the noir lamp: darker falloff, a hot pool of desk-lamp light ----------
buildLook = function () {
  const noir = TRAIL.mood === 'noir', c = makeCanvas(W, H), x = c.getContext('2d');
  x.fillStyle = '#fff'; x.fillRect(0, 0, W, H);
  const g = x.createRadialGradient(W * .44, H * .4, H * (noir ? .15 : .28), W * .5, H * .5, W * (noir ? .64 : .75));
  g.addColorStop(0, 'rgba(255,250,240,0)'); g.addColorStop(.55, noir ? 'rgba(200,162,130,.5)' : 'rgba(236,214,190,.35)'); g.addColorStop(1, noir ? 'rgba(44,26,16,.96)' : 'rgba(150,112,80,.8)');
  x.fillStyle = g; x.fillRect(0, 0, W, H); LOOK.mul = c;
  const s = makeCanvas(480, 270), y = s.getContext('2d'), g2 = y.createRadialGradient(190, 95, 0, 190, 95, 290);
  g2.addColorStop(0, noir ? 'rgba(255,212,145,.72)' : 'rgba(255,226,170,.55)'); g2.addColorStop(1, 'rgba(255,214,150,0)'); y.fillStyle = g2; y.fillRect(0, 0, 480, 270); LOOK.spot = s;
  const n = makeCanvas(256, 256), z = n.getContext('2d'), id = z.createImageData(256, 256), r = rnd('filmgrain');
  for (let i = 0; i < id.data.length; i += 4) { const v = 128 + (r() - .5) * 90; id.data[i] = id.data[i + 1] = id.data[i + 2] = v; id.data[i + 3] = 255; }
  z.putImageData(id, 0, 0); LOOK.grain = OUT.createPattern(n, 'repeat');
};
{ const _setup = ENGINE.setup;
  ENGINE.setup = async () => {
    const f = [`900 40px ${TF.head}`, `700 40px ${TF.head}`, `italic 700 40px ${TF.head}`, `40px ${TF.tab}`, `40px ${TF.type}`, `700 40px ${TF.old}`, `700 40px ${TF.cond}`, `500 40px ${TF.cond}`];
    await Promise.all(f.map(s => document.fonts.load(s, 'AZaz$€£0123456789,.').catch(() => { })));
    for (const k of ['cork', 'news', 'manila']) GRAIN[k] = makeGrain(k);
    await _setup();
  }; }

// ---------- printing (ink on paper) ----------
function print(txt, x, y, font, o = {}) {
  if (PAPER.dry) return; G.save(); noShadow(); G.font = font; G.textAlign = o.align || 'center'; G.textBaseline = o.base || 'alphabetic';
  if (o.ls) G.letterSpacing = o.ls + 'px'; G.fillStyle = o.col || NC.newsInk; G.globalAlpha *= o.alpha ?? .93;
  if (o.stroke) { G.lineJoin = 'round'; G.lineWidth = o.stroke; G.strokeStyle = o.strokeCol || NC.news; G.strokeText(txt, x, y); }
  G.fillText(txt, x, y); G.restore();
}
function textW(txt, font, ls = 0) { G.save(); G.font = font; if (ls) G.letterSpacing = ls + 'px'; const w = G.measureText(txt).width; G.restore(); return w; }
function wrapLines(txt, font, maxW) {
  const words = String(txt).split(/\s+/), out = []; let cur = '';
  for (const w of words) { const t = cur ? cur + ' ' + w : w; if (cur && textW(t, font) > maxW) { out.push(cur); cur = w; } else cur = t; }
  if (cur) out.push(cur); return out;
}
// fake body copy: rows of word-shaped ink bars (reads as newspaper columns at any size)
function fakeText(x0, y0, w, rows, lh, seed = 1, o = {}) {
  if (PAPER.dry) return; const q = rnd('ft' + seed); G.save(); noShadow(); G.fillStyle = o.col || NC.newsInk; G.globalAlpha *= o.alpha ?? .55;
  for (let i = 0; i < rows; i++) {
    const end = (i + 1) % (4 + Math.floor(q() * 4)) === 0, lw = end ? w * (.3 + q() * .4) : w; let x = x0;
    while (x < x0 + lw - 6) { const ww = Math.min(x0 + lw - x, lh * (.9 + q() * 2.6)); G.fillRect(x, y0 + i * lh, ww, lh * .4); x += ww + lh * .36; }
  }
  G.restore();
}

// ---------- halftone ----------
const HT = new Map();
function htPattern(sp = 5, col = '#2A201A') {
  const k = sp + col; let p = HT.get(k); if (p) return p;
  const c = makeCanvas(sp * 2, sp * 2), x = c.getContext('2d'); x.fillStyle = col;
  for (const [cx, cy] of [[sp * .5, sp * .5], [sp * 1.5, sp * 1.5]]) { x.beginPath(); x.arc(cx, cy, sp * .34, 0, TAU); x.fill(); }
  p = x.createPattern(c, 'repeat'); HT.set(k, p); return p;
}
// overlay printed dots on a shape (collage / magazine look)
function halftoneOver(shape, o = {}) {
  if (PAPER.dry) return; G.save(); G.translate(o.x || 0, o.y || 0); if (o.rot) G.rotate(o.rot * D2R); if (o.sx != null) G.scale(o.sx, o.sy ?? 1);
  G.clip(toPath(shape)); noShadow(); G.globalCompositeOperation = 'multiply'; G.globalAlpha *= o.alpha ?? .22; G.fillStyle = htPattern(o.sp || 5, o.col);
  G.fillRect(-3000, -3000, 6000, 6000); G.restore();
}
// a halftone "photo" (cached canvas): lum(u, v) → 0 (black) .. 1 (paper) over the unit square
const HTIMG = new Map();
function halftoneImg(key, w, h, lum, sp = 7) {
  const k = key + w + 'x' + h; let c = HTIMG.get(k); if (c) return c;
  c = makeCanvas(Math.ceil(w), Math.ceil(h)); const x = c.getContext('2d'); x.fillStyle = '#1E1916';
  for (let j = 0, row = 0; j < h + sp; j += sp * .87, row++) for (let i = (row % 2) * sp / 2; i < w + sp; i += sp) {
    const v = clamp(lum(i / w, j / h)), r = sp * .62 * Math.sqrt(1 - v); if (r < .35) continue; x.beginPath(); x.arc(i, j, r, 0, TAU); x.fill();
  }
  HTIMG.set(k, c); return c;
}
// generic portrait / scene luminance functions for halftone photos
const LUM = {
  mugshot: (seed = 1) => (u, v) => { const hx = .5 + (hash(seed) - .5) * .08, d = Math.hypot((u - hx) / .17, (v - .38) / .21), sh = Math.hypot((u - .5) / .42, (v - 1.02) / .36);
    return d < 1 ? .28 + .25 * clamp(1 - d) * (u < hx ? 1.4 : .5) : sh < 1 ? .18 : .78 + .2 * v - .1 * Math.sin(u * 9 + seed); },
  building: (seed = 1) => (u, v) => { const b = Math.abs(u - .5) < .22 && v > .12, win = b && (Math.floor(u * 40) % 3 === 0) && (Math.floor(v * 30) % 2 === 0); return win ? .85 : b ? .25 : .7 + .25 * v; },
  crowd: (seed = 1) => (u, v) => { let m = .82; for (let i = 0; i < 7; i++) { const cx = (i + .5) / 7 + (hash(i + seed) - .5) * .06, d = Math.hypot((u - cx) / .07, (v - .55) / .1), s = Math.hypot((u - cx) / .1, (v - .95) / .22); if (d < 1 || s < 1) m = .2 + .15 * hash(i * 3 + seed); } return m; },
  chart: (seed = 1) => (u, v) => { const y = .25 + .55 * u + .08 * Math.sin(u * 17 + seed); return Math.abs(v - (1 - y)) < .03 ? .1 : v > 1 - y ? .55 : .9; },
};
function photo(x, y, w, h, lum, o = {}) {   // a halftone print, glued on the current layer
  if (PAPER.dry) return; const img = halftoneImg(o.key || 'ph', w, h, lum, o.sp || 7);
  G.save(); G.translate(x, y); if (o.rot) G.rotate(o.rot * D2R); noShadow(); G.globalCompositeOperation = 'multiply'; G.globalAlpha *= o.alpha ?? .9;
  G.drawImage(img, -w / 2, -h / 2, w, h); G.restore();
}

// ---------- corkboard, pins, string ----------
// corkboard({ x, y, w, h, frame }) — a framed cork board in WORLD space (bigger than the frame so the camera can pan)
function corkboard(o = {}) {
  const x = o.x ?? W / 2, y = o.y ?? H / 2, w = o.w ?? 3400, h = o.h ?? 2200;
  piece(SH.rect(w, h), { x, y, col: o.col || NC.cork, mat: 'cork', depth: .15, seed: 5101, jit: 0, edge: false });
  for (let i = 0; i < 9; i++) { const q = rnd('corkstain' + i); piece(SH.blob(120 + q() * 220, 9, .25, 5110 + i), { x: x + (q() - .5) * w * .9, y: y + (q() - .5) * h * .9, col: NC.corkDk, mat: 'cork', depth: 0, seed: 5110 + i, jit: 0, alpha: .35, edge: false }); }
  if (o.frame !== false) { const t = o.frameW ?? 70, fc = NC.frame;
    [[x, y - h / 2, w + t, t], [x, y + h / 2, w + t, t], [x - w / 2, y, t, h + t], [x + w / 2, y, t, h + t]].forEach(([fx, fy, fw, fh], i) => piece(SH.rect(fw, fh), { x: fx, y: fy, col: fc, mat: 'wood', depth: 1.4, seed: 5120 + i, jit: 0 })); }
}
// pushpin(x, y, col, r) — a glossy push pin head with its long lamp shadow
function pushpin(x, y, col = NC.red, r = 11) {
  if (PAPER.dry) return; G.save(); G.translate(x, y); const k = curScale(); setShadow(1.8, k, 1.2);
  const g = G.createRadialGradient(-r * .35, -r * .4, r * .1, 0, 0, r);
  g.addColorStop(0, mixCol(col, '#FFFFFF', .55)); g.addColorStop(.5, col); g.addColorStop(1, mixCol(col, '#000000', .45));
  G.fillStyle = g; G.beginPath(); G.arc(0, 0, r, 0, TAU); G.fill(); noShadow();
  G.fillStyle = 'rgba(255,255,255,.72)'; G.beginPath(); G.ellipse(-r * .35, -r * .38, r * .3, r * .17, -.6, 0, TAU); G.fill(); G.restore();
}
// redString(a, b, k, { sag, w, col, pins }) — red yarn drawn from pin a toward pin b (k 0 → 1 = how far it has reached)
function redString(a, b, k = 1, o = {}) {
  if (k <= 0 || PAPER.dry) return; const n = 30, d = Math.hypot(b[0] - a[0], b[1] - a[1]), sag = o.sag ?? d * .07, m = Math.max(1, Math.ceil(n * clamp(k)));
  const P = i => { const u = Math.min(i / n, k); return [lerp(a[0], b[0], u), lerp(a[1], b[1], u) + sag * 4 * u * (1 - u)]; };
  G.save(); const sc = curScale(); setShadow(.9, sc, .9); G.strokeStyle = o.col || NC.red; G.lineWidth = o.w || 3.4; G.lineCap = 'round'; G.lineJoin = 'round';
  G.beginPath(); G.moveTo(...P(0)); for (let i = 1; i <= m; i++) G.lineTo(...P(i)); G.stroke(); noShadow();
  G.strokeStyle = 'rgba(255,170,150,.45)'; G.lineWidth = (o.w || 3.4) * .38; G.setLineDash([5, 6]); G.stroke(); G.restore();
  if (o.pins !== false) { pushpin(a[0], a[1], o.pinCol); if (k >= 1) pushpin(b[0], b[1], o.pinCol); }
}
// pinCard(x, y, w, h, { rot, col, mat, torn, draw(w, h), pin, pinCol, seed }) → [x, y] of its pin (for strings)
function pinCard(x, y, w, h, o = {}) {
  const rot = o.rot || 0, py = -h / 2 + (o.pinY ?? 20), a = rot * D2R;
  G.save(); G.translate(x, y); G.rotate(a);
  piece(SH.rect(w, h), { col: o.col || NC.news, mat: o.mat || 'news', torn: o.torn, tornAmp: o.tornAmp ?? 4, depth: o.depth ?? 1.2, seed: o.seed || 5200, jit: o.jit ?? 0 });
  if (o.aged) ageOver(SH.rect(w, h), { amt: o.aged, seed: o.seed || 5200 });
  if (o.draw) o.draw(w, h);
  if (o.pin !== false) fasten(o.fasten || 'pin', w, h, py, o);
  G.restore();
  return [x - Math.sin(a) * py, y + Math.cos(a) * py];
}
// polaroid(x, y, w, lum, { rot, caption, seed }) → pin point. A white-bordered halftone photo with a pen caption
function polaroid(x, y, w, lum, o = {}) {
  const h = w * 1.18;
  return pinCard(x, y, w, h, { ...o, col: '#F1EDE4', mat: 'card', draw: (cw, ch) => {
    piece(SH.rect(cw * .86, cw * .86), { y: -ch / 2 + cw * .5, col: '#BDB5A8', mat: 'card', depth: 0, seed: (o.seed || 5300) + 1, jit: 0, edge: false });
    photo(0, -ch / 2 + cw * .5, cw * .86, cw * .86, lum, { key: 'pol' + (o.seed || 5300), sp: Math.max(4, cw / 34) });
    if (o.caption) print(o.caption, 0, ch / 2 - cw * .1, `${cw * .085}px ${TF.type}`, { col: '#2B3C78', alpha: .85 });
  } });
}

// ---------- newspaper clipping ----------
// clipping(x, y, w, { paper, date, head, sub, body, photo: lum fn, rot, seed, hs, upper, depth }) → { h }
// (x, y) = centre. Torn newsprint with a masthead, rule, dateline, wrapped headline, optional halftone photo, columns.
function clipping(x, y, w, o = {}) {
  const pad = w * .06, iw = w - pad * 2, hs = o.hs || w * .088, hfont = `900 ${hs}px ${TF.head}`, head = o.upper === false ? o.head || '' : String(o.head || '').toUpperCase();
  const lines = wrapLines(head, hfont, iw), ms = w * .055, ss = hs * .42;
  const sub = o.sub ? wrapLines(o.sub, `italic 700 ${ss}px ${TF.head}`, iw) : [];
  const ph = o.photo ? iw * (o.photoH || .45) : 0, bodyRows = o.body ?? 6, lh = w * .022, cols = o.cols || 3;
  let h = pad * .8 + (o.paper !== false ? ms * 1.5 + w * .03 : 0) + lines.length * hs * 1.02 + (sub.length ? sub.length * ss * 1.25 + ss * .4 : 0) + (ph ? ph + pad * .5 : 0) + bodyRows * lh + pad;
  G.save(); G.translate(x, y); G.rotate((o.rot || 0) * D2R);
  piece(SH.rect(w, h), { col: o.col || NC.news, mat: 'news', torn: true, tornAmp: o.tornAmp ?? 5, depth: o.depth ?? 1.4, seed: o.seed || 5400, jit: 0 });
  if (o.aged) ageOver(SH.rect(w, h), { amt: o.aged, seed: o.seed || 5400 });
  let cy = -h / 2 + pad * .8;
  if (o.paper !== false) {
    cy += ms; if (o.mast === 'black') print(o.paper || 'The Daily Ledger', 0, cy + ms * .1, `${ms * 1.35}px ${TF.black}`); else print(o.paper || 'THE DAILY LEDGER', 0, cy, `700 ${ms}px ${TF.old}`, { ls: ms * .08 });
    cy += ms * .3; G.save(); G.fillStyle = NC.newsInk; G.globalAlpha = .85; G.fillRect(-iw / 2, cy, iw, 2.5); G.fillRect(-iw / 2, cy + 5, iw, 1); G.restore();
    if (o.date) print(o.date, -iw / 2, cy + w * .027, `${w * .02}px ${TF.type}`, { align: 'left', alpha: .8 });
    print(o.price || 'FIVE CENTS', iw / 2, cy + w * .027, `${w * .02}px ${TF.type}`, { align: 'right', alpha: .8 });
    cy += w * .03 + ms * .2;
  }
  lines.forEach(L => { cy += hs * .9; print(L, 0, cy, hfont); cy += hs * .12; });
  if (sub.length) { cy += ss * .35; sub.forEach(L => { cy += ss * 1.1; print(L, 0, cy, `italic 700 ${ss}px ${TF.head}`, { alpha: .85 }); }); cy += ss * .15; }
  if (ph) { cy += pad * .35; piece(SH.rect(iw, ph), { y: cy + ph / 2, col: '#C9C0AC', mat: 'news', depth: 0, seed: (o.seed || 5400) + 1, jit: 0, edge: false }); photo(0, cy + ph / 2, iw, ph, o.photo, { key: 'clip' + (o.seed || 5400), sp: Math.max(4, w / 120) }); cy += ph + pad * .15; }
  const cw = (iw - (cols - 1) * pad * .4) / cols; cy += pad * .3;
  for (let c = 0; c < cols; c++) fakeText(-iw / 2 + c * (cw + pad * .4), cy, cw, bodyRows, lh, (o.seed || 5400) + c);
  G.restore();
  return { h };
}

// ---------- ransom-note letters, stamps, tags, tape ----------

// ransom(txt, x, y, size, k, { seed, cols }) — every glyph cut from a different magazine, popping in one by one (k 0 → 1)
function ransom(txt, x, y, size, k = 1, o = {}) {
  const chars = [...txt], seed = o.seed || 1, fontOf = i => { const f = Math.floor(hash(seed * 7 + i * 3.3) * 5); return f === 0 ? `${size}px ${TF.tab}` : f === 1 ? `900 ${size}px ${TF.head}` : f === 2 ? `${size * .95}px ${TF.type}` : f === 3 ? `700 ${size}px ${TF.old}` : `700 ${size}px ${TF.cond}`; };
  const pal = o.cols || [[NC.news, NC.newsInk], [NC.manila, NC.newsInk], [NC.blackCard, '#F3EDE0'], [NC.red, '#FBF4E6'], ['#F3EFE6', NC.red], [NC.moneyLt, NC.moneyDk]];
  const ws = chars.map((ch, i) => ch === ' ' ? size * .35 : textW(ch, fontOf(i)) + size * .3), tot = ws.reduce((a, b) => a + b, 0) + (chars.length - 1) * size * .05;
  let cx = x - tot / 2; const n = chars.length;
  chars.forEach((ch, i) => {
    const w = ws[i], mx = cx + w / 2; cx += w + size * .05; if (ch === ' ') return;
    const kk = clamp(k * (n + 2) - i), pop = kk <= 0 ? 0 : kk < 1 ? backOut(kk) : 1; if (pop <= 0) return;
    const [bg, fg] = pal[Math.floor(hash(seed * 11 + i * 5.1) * pal.length)], r = (hash(seed + i * 9.7) - .5) * 14, dy = (hash(seed + i * 4.3) - .5) * size * .18, hh = size * (1.18 + hash(i + seed) * .2);
    G.save(); G.translate(mx, y + dy); G.rotate(r * D2R); G.scale(pop, pop);
    piece(SH.rect(w, hh), { col: bg, mat: 'news', torn: hash(i * 2.2 + seed) < .5 ? true : false, tornAmp: 2.5, depth: 1.6, seed: 5500 + seed * 31 + i, jit: 0 });
    print(ch, 0, size * .36, fontOf(i), { col: fg });
    G.restore();
  });
  return tot;
}
// stamp(x, y, txt, k, { rot, col, size, box }) — a rubber stamp that slams down (k: 0 → 1 over ~2 steps), ink multiplies
const STAMPC = new Map();
function stampCanvas(txt, size, col) {
  const key = txt + size + col; let c = STAMPC.get(key); if (c) return c;
  const font = `${size}px ${TF.tab}`, tw = textW(txt, font, size * .06), w = Math.ceil(tw + size * 1.0), h = Math.ceil(size * 1.6);
  c = makeCanvas(w, h); const x = c.getContext('2d'); x.strokeStyle = col; x.fillStyle = col;
  x.lineWidth = size * .09; x.beginPath(); x.roundRect(size * .1, size * .1, w - size * .2, h - size * .2, size * .14); x.stroke();
  x.lineWidth = size * .035; x.beginPath(); x.roundRect(size * .22, size * .22, w - size * .44, h - size * .44, size * .08); x.stroke();
  x.font = font; x.letterSpacing = size * .06 + 'px'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(txt, w / 2, h / 2 + size * .04);
  x.globalCompositeOperation = 'destination-out'; const r = rnd('stamp' + key);
  for (let i = 0; i < w * h / 55; i++) { x.globalAlpha = .3 + r() * .7; x.beginPath(); x.arc(r() * w, r() * h, .4 + r() * 1.8, 0, TAU); x.fill(); }
  for (let i = 0; i < 5; i++) { x.globalAlpha = .25; x.fillRect(0, r() * h, w, 1 + r() * 3); }
  STAMPC.set(key, c); return c;
}
function stamp(x, y, txt, k, o = {}) {
  if (k <= 0 || PAPER.dry) return; const c = stampCanvas(txt, o.size || 110, o.col || NC.stamp), s = k < 1 ? lerp(1.6, 1, easeIn(k)) : 1;
  G.save(); G.translate(x, y); G.rotate((o.rot ?? -9) * D2R); G.scale(s, s); noShadow(); G.globalCompositeOperation = 'multiply'; G.globalAlpha *= (k < 1 ? .5 : .92) * (o.alpha ?? 1);
  G.drawImage(c, -c.width / 2, -c.height / 2); G.restore();
}
// caseTag(x, y, name, role, { rot, w, seed }) — a manila luggage tag on a string: name the players
function caseTag(x, y, name, role = '', o = {}) {
  const w = o.w || 430, h = w * .36, rot = o.rot ?? -3;
  G.save(); G.translate(x, y); G.rotate(rot * D2R);
  thread([[-w / 2 + h * .32, 0], [-w / 2 - (o.strLen ?? 70), -h * .5]], { col: '#D8CDB5', w: 2.4 });
  piece(SH.poly([[-w / 2 + h * .3, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2 + h * .3, h / 2], [-w / 2, h * .2], [-w / 2, -h * .2]]), { col: NC.manila, mat: 'manila', depth: 1.5, seed: o.seed || 5600, jit: 0 });
  piece(SH.circle(h * .13), { x: -w / 2 + h * .32, col: '#F2E7CC', mat: 'card', depth: .2, seed: (o.seed || 5600) + 1, jit: 0 });
  print(name, -w / 2 + h * .62, -h * .04, `${h * .3}px ${TF.type}`, { align: 'left' });
  if (role) print(role, -w / 2 + h * .62, h * .3, `500 ${h * .2}px ${TF.cond}`, { align: 'left', alpha: .75, ls: 1.5 });
  G.restore();
}
// labelTape(x, y, txt, { size, rot, col }) — embossed label-maker tape (EXHIBIT A, CASE No. 03 …)
function labelTape(x, y, txt, o = {}) {
  const size = o.size || 40, font = `700 ${size}px ${TF.cond}`, w = textW(txt, font, size * .18) + size * 1.1, h = size * 1.45;
  G.save(); G.translate(x, y); G.rotate((o.rot ?? -1.5) * D2R);
  piece(SH.rect(w, h), { col: o.col || NC.tape, mat: 'card', depth: 1.3, seed: o.seed || 5700, jit: 0 });
  print(txt, 0, size * .36, font, { col: '#EDE7DA', ls: size * .18, alpha: .95 });
  G.restore();
}
// envelope(x, y, w, { rot, label, seed, col }) — a manila envelope (letters, offers, leaks)
function envelope(x, y, w = 360, o = {}) {
  const h = w * .62; G.save(); G.translate(x, y); G.rotate((o.rot || 0) * D2R);
  piece(SH.rect(w, h), { col: o.col || NC.manila, mat: 'manila', depth: o.depth ?? 1.5, seed: o.seed || 5800, jit: 0 });
  piece(SH.poly([[-w / 2, -h / 2], [w / 2, -h / 2], [0, h * .08]]), { col: mixCol(o.col || NC.manila, '#8A6A3A', .18), mat: 'manila', depth: .4, seed: (o.seed || 5800) + 1, jit: 0 });
  if (o.label) print(o.label, 0, h * .32, `${h * .17}px ${TF.type}`, { col: NC.red, alpha: .9 });
  G.restore();
}

// ---------- money ----------
// bill(x, y, rot, s, { seed, sym, val, depth }) — a generic paper banknote (no real currency design)
function bill(x, y, rot = 0, s = 1, o = {}) {
  const sd = o.seed || 6000, w = 260 * s, h = 112 * s;
  G.save(); G.translate(x, y); G.rotate(rot * D2R);
  piece(SH.rect(w, h), { col: NC.moneyLt, mat: 'paper', depth: o.depth ?? 1, seed: sd, jit: o.jit ?? 0 });
  piece(SH.rect(w * .9, h * .78), { col: NC.money, mat: 'paper', depth: .05, seed: sd + 1, jit: 0, edge: false });
  piece(SH.ellipse(h * .3, h * .3), { col: NC.moneyLt, mat: 'paper', depth: .05, seed: sd + 2, jit: 0, edge: false });
  print(o.sym || '$', 0, h * .13, `900 ${h * .42}px ${TF.head}`, { col: NC.moneyDk });
  print(o.val || '100', -w * .36, -h * .17, `${h * .2}px ${TF.tab}`, { col: NC.moneyLt }); print(o.val || '100', w * .36, h * .3, `${h * .2}px ${TF.tab}`, { col: NC.moneyLt });
  G.restore();
}
function cashStack(x, y, s = 1, n = 5, o = {}) {   // a banded stack of bills seen from above
  for (let i = 0; i < n; i++) bill(x + (hash(i * 3.1 + (o.seed || 0)) - .5) * 8 * s, y - i * 4 * s, (hash(i * 1.7 + (o.seed || 0)) - .5) * 5, s, { seed: 6100 + i * 7 + (o.seed || 0) * 50, depth: i ? .3 : 1 });
  piece(SH.rect(40 * s, 118 * s), { x, y: y - (n - 1) * 4 * s, col: '#E9DDC0', mat: 'card', depth: .3, seed: 6190 + (o.seed || 0), jit: 0 });
}
// moneyRain(lt, { t0, n, seed, area }) — bills fluttering down in steps
function moneyRain(lt, o = {}) {
  const a = sm(lt) - (o.t0 || 0); if (a < 0) return; const n = o.n || 14, [x0, x1] = o.area || [100, 1820];
  for (let i = 0; i < n; i++) { const q = rnd('rain' + (o.seed || 1) + i), d = q() * 1.6, tt = a - d; if (tt < 0) continue;
    const x = lerp(x0, x1, q()) + Math.sin(tt * 2.2 + q() * 6) * 90, y = -150 + tt * (260 + q() * 160), r = Math.sin(tt * 3 + q() * 6) * 40 + q() * 360;
    bill(x, y, r, .55 + q() * .3, { seed: 6200 + i * 5, depth: 2.4, jit: 0 }); }
}
// countVal(lt, [[t, v], ...], { log }) → the stepped, eased value at shot time lt (log: interpolate in log space)
function countVal(lt, keys, o = {}) {
  const st = sm(lt, o.fps || PAPER.fps);
  if (st <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) if (st < keys[i][0]) { const [a, va] = keys[i - 1], [b, vb] = keys[i], k = (o.ease || ease)((st - a) / (b - a)); return o.log ? Math.exp(lerp(Math.log(Math.max(1, va)), Math.log(Math.max(1, vb)), k)) : lerp(va, vb, k); }
  return keys[keys.length - 1][1];
}
// moneyCounter(x, y, s, value, { prev, digits, sym, label, digitCol, cardCol }) — split-flap counter in a black housing.
// Pass prev = countVal(lt - 1/12, ...) so changing digits show the flap mid-flip (top new / bottom old).
function moneyCounter(x, y, s, val, o = {}) {
  const digits = o.digits || String(Math.floor(Math.abs(val))).length, pad = v => String(Math.max(0, Math.round(v))).padStart(digits, ' ').slice(-digits);
  const cur = pad(val), prv = pad(o.prev ?? val), cw = .62 * s, ch = s, gap = .07 * s, comma = .22 * s, symW = o.sym === '' ? -.14 * s : .7 * s;
  const toks = []; for (let i = 0; i < digits; i++) { toks.push(['d', i]); const left = digits - 1 - i; if (o.commas !== false && left > 0 && left % 3 === 0) toks.push(['c', i]); }
  const tw = symW + gap * 2 + toks.reduce((a, [k]) => a + (k === 'd' ? cw + gap : comma), 0), hw = tw + .5 * s, hh = ch + .5 * s;
  G.save(); G.translate(x, y);
  piece(SH.round(hw, hh, .12 * s), { col: o.house || NC.blackCard, mat: 'card', depth: o.depth ?? 1.6, seed: 6300, jit: 0 });
  [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([a, b]) => brad(a * (hw / 2 - .12 * s), b * (hh / 2 - .12 * s), .05 * s));
  let cx = -tw / 2;
  if (o.sym !== '') { piece(SH.round(symW, ch, .06 * s), { x: cx + symW / 2, col: o.symCol || NC.red, mat: 'card', depth: .5, seed: 6301, jit: 0 });
    print(o.sym || '$', cx + symW / 2, ch * .32, `${ch * .78}px ${TF.tab}`, { col: '#F7EFE0' }); }
  cx += symW + gap * 2;
  const font = `${ch * .8}px ${TF.tab}`, dcol = o.digitCol || '#F4ECDC', lead = cur.search(/\d/), sig = o.sig ?? 3;
  const moving = o.prev != null && Math.round(o.prev) !== Math.round(val);
  for (const [k, i] of toks) {
    if (k === 'c') { print(',', cx + comma / 2, ch * .38, font, { col: dcol }); cx += comma; continue; }
    const mx = cx + cw / 2; cx += cw + gap;
    piece(SH.round(cw, ch, .05 * s), { x: mx, col: o.cardCol || '#1A1617', mat: 'card', depth: .45, seed: 6310 + i, jit: 0 });
    let nd = cur[i], od = prv[i]; const spin = moving && lead >= 0 && i >= lead + sig;
    if (spin) nd = od = String(Math.floor(hash(i * 7.3 + PAPER.step * 1.37) * 10));
    G.save(); G.beginPath(); G.rect(mx - cw / 2, -ch / 2, cw, ch / 2); G.clip(); if (nd !== ' ') print(nd, mx, ch * .29, font, { col: dcol }); G.restore();
    G.save(); G.beginPath(); G.rect(mx - cw / 2, 0, cw, ch / 2); G.clip(); const bd = nd !== od ? od : nd; if (bd !== ' ') print(bd, mx, ch * .29, font, { col: dcol, alpha: spin ? .5 : nd !== od ? .8 : .93 }); G.restore();
    if (spin) { G.save(); G.beginPath(); G.rect(mx - cw / 2, -ch / 2, cw, ch); G.clip(); [-.22, .22].forEach(d => print(nd, mx, ch * (.29 + d), font, { col: dcol, alpha: .18 })); G.restore(); }
    G.save(); noShadow(); G.fillStyle = 'rgba(0,0,0,.45)'; G.fillRect(mx - cw / 2, -1, cw, 2); if (nd !== od) { G.fillStyle = 'rgba(255,255,255,.08)'; G.fillRect(mx - cw / 2, -ch / 2, cw, ch / 2); } G.restore();
  }
  G.restore();
  if (o.label) labelTape(x, y + hh / 2 + .42 * s, o.label, { size: .26 * s, rot: o.labelRot ?? 1.2 });
  if (o.trend) trendCard(x + hw / 2 + 1.3 * s, y - .25 * s, o.trend.pct, { k: o.trend.k ?? 1, label: o.trend.label, s });
}

// ---------- finance props (drawn around the grip point; ang = forearm angle) ----------
Object.assign(PROPS, {
  briefcase(x, y, ang = 0, s = 30, col = '#5A3A26') {   // hangs from the hand by its handle (ignores the arm angle)
    piece(SH.band(.42 * s, .14 * s, 180, 360), { x, y: y + .3 * s, col: '#2B1D16', depth: .8, seed: 6401, jit: 0 });
    piece(SH.round(2.4 * s, 1.7 * s, .18 * s), { x, y: y + 1.2 * s, col, mat: 'kraft', depth: 1.2, seed: 6402 });
    piece(SH.rect(2.4 * s, .12 * s), { x, y: y + .75 * s, col: mixCol(col, '#000000', .3), depth: .1, seed: 6403, jit: 0, edge: false });
    brad(x - .7 * s, y + .78 * s, .13 * s); brad(x + .7 * s, y + .78 * s, .13 * s);
  },
  folder(x, y, ang = 0, s = 30, col = NC.manila) {
    G.save(); G.translate(x, y); G.rotate((ang * .3 - 8) * D2R);
    piece(SH.poly([[-1.5 * s, -1.05 * s], [-.4 * s, -1.05 * s], [-.25 * s, -1.25 * s], [.5 * s, -1.25 * s], [.65 * s, -1.05 * s], [1.5 * s, -1.05 * s], [1.5 * s, 1.05 * s], [-1.5 * s, 1.05 * s]]), { col, mat: 'manila', depth: 1.3, seed: 6411 });
    stamp(0, .1 * s, 'CONFIDENTIAL', 1, { size: .32 * s, rot: -6 }); G.restore();
  },
  cash(x, y, ang = 0, s = 30) { G.save(); G.translate(x, y); G.rotate(-20 * D2R); cashStack(0, 0, s / 95, 4, { seed: 3 }); G.restore(); },
  check(x, y, ang = 0, s = 30) {
    G.save(); G.translate(x, y); G.rotate((-12) * D2R);
    piece(SH.rect(3.2 * s, 1.4 * s), { col: '#E7EEDC', mat: 'card', depth: 1.3, seed: 6421 });
    print('PAY TO THE ORDER OF', -1.45 * s, -.25 * s, `${.17 * s}px ${TF.type}`, { align: 'left', alpha: .7 });
    G.save(); G.fillStyle = NC.newsInk; G.globalAlpha = .5; G.fillRect(-1.45 * s, .05 * s, 2.0 * s, 2); G.fillRect(-1.45 * s, .45 * s, 2.9 * s, 2); G.restore();
    piece(SH.rect(.8 * s, .34 * s), { x: 1.05 * s, y: -.1 * s, col: '#F7F4EA', mat: 'card', depth: .1, seed: 6422, jit: 0 }); G.restore();
  },
  phone(x, y, ang = 0, s = 30, col = '#2E3440') {   // a candy-bar "brick" phone
    G.save(); G.translate(x, y); G.rotate((180 - ang * .2) * D2R);
    piece(SH.round(.95 * s, 2.3 * s, .3 * s), { y: .6 * s, col, mat: 'card', depth: 1.2, seed: 6431 });
    piece(SH.round(.7 * s, .65 * s, .08 * s), { y: .05 * s, col: '#9DB59A', mat: 'card', depth: .15, seed: 6432, jit: 0 });
    for (let i = 0; i < 9; i++) piece(SH.round(.16 * s, .12 * s, .04 * s), { x: (i % 3 - 1) * .24 * s, y: (.7 + Math.floor(i / 3) * .2) * s, col: '#C9C3B8', depth: .1, seed: 6433 + i, jit: 0 });
    G.restore();
  },
  magnifier(x, y, ang = 0, s = 30) {
    G.save(); G.translate(x, y); G.rotate((180 + ang) * D2R);
    piece(SH.capsule(1.6 * s, .18 * s), { col: '#3B2618', mat: 'kraft', depth: 1, seed: 6441 });
    piece(SH.band(.75 * s, .18 * s, 0, 360), { y: 2.35 * s, col: NC.gold, depth: 1.2, seed: 6442 });
    piece(SH.circle(.68 * s), { y: 2.35 * s, col: '#CFE5EA', mat: 'tissue', depth: .2, seed: 6443 }); G.restore();
  },
  pen(x, y, ang = 0, s = 30) { G.save(); G.translate(x, y); G.rotate((150 + ang) * D2R); piece(SH.capsule(1.8 * s, .1 * s, .06 * s), { col: '#1E1E26', depth: 1, seed: 6451 }); piece(SH.rect(.05 * s, .7 * s), { x: .1 * s, y: .5 * s, col: NC.gold, depth: .2, seed: 6452, jit: 0 }); G.restore(); },
});

// ---------- sets ----------
// officeSet({ blinds, floorY }) — dark office wall with venetian-blind light slats and a floor line (noir interiors)
function officeSet(o = {}) {
  const lit = !!o.lit;   // lit: a pale lamp-lit wall with dark blind shadows (silhouettes read against it)
  backdrop(o.wall || (lit ? '#CDB894' : NC.wall), { to: lit ? 'rgba(60,35,20,.35)' : 'rgba(15,10,12,.45)' });
  const fy = o.floorY ?? 900;
  layer(.6, () => {
    piece(SH.rect(4000, 26), { x: 960, y: fy - 260, col: lit ? '#9C8466' : NC.wallDk, mat: 'card', depth: .4, seed: 6501, jit: 0 });   // dado rail
    if (o.blinds !== false) { G.save(); noShadow(); G.globalCompositeOperation = lit ? 'multiply' : 'screen'; G.fillStyle = lit ? 'rgba(70,45,30,.28)' : 'rgba(255,214,150,.13)';
      const bx = o.blindX ?? 1250; for (let i = 0; i < 9; i++) { const y0 = 120 + i * 62; G.beginPath(); G.moveTo(bx, y0); G.lineTo(bx + 520, y0 + 150); G.lineTo(bx + 520, y0 + 182); G.lineTo(bx, y0 + 30); G.fill(); } G.restore(); }
  });
  piece(SH.rect(4200, 700), { x: 960, y: fy + 350, col: NC.floor, mat: 'wood', depth: .6, seed: 6502, jit: 0, torn: 'top', tornAmp: 3 });
}
// deskTop() — top-down dark wood desk (counters, documents, cash)
function deskTop(o = {}) { backdrop(o.col || NC.desk, { mat: 'wood', to: 'rgba(15,8,5,.4)' }); }

// ---------- transition: the red string ----------
// trString(t, k, { seed }) — the old frame shrinks onto a card pinned on the corkboard, red yarn runs to a second card,
// and the camera dives into it: that card IS the new shot. Incoming shot calls it after camEnd() with k 0 → 1.
function trString(t, k, o = {}) {
  if (IN_PREV || k >= 1) return;
  const prev = prevFrame(t) || plainSheet(NC.news), cur = snapCur(), s = .3;
  const A = { x: W * .3, y: H * .54, r: -3.5 }, B = { x: W * .7, y: H * .46, r: 2.5 }, OV = { x: W / 2, y: H / 2, r: 0, z: .92 };
  const full = c => ({ x: c.x, y: c.y, r: c.r, z: 1 / s });
  const mixC = (a, b, e) => ({ x: lerp(a.x, b.x, e), y: lerp(a.y, b.y, e), r: lerp(a.r, b.r, e), z: Math.exp(lerp(Math.log(a.z), Math.log(b.z), e)) });
  const e1 = ease(seg(k, 0, .34)), e3 = ease(seg(k, .66, 1)), drift = seg(k, .34, .66);
  const thunk = k > .64 && k < .7 ? (hash(Math.floor(k * 200)) - .5) * 6 : 0;   // a tiny jolt when the pin goes in
  const cam = k < .34 ? mixC(full(A), OV, e1) : k < .66 ? { ...OV, x: OV.x + thunk, z: OV.z * (1 + .03 * drift) } : mixC(OV, full(B), e3);
  screenReset();
  G.save(); G.translate(W / 2, H / 2); G.rotate(-cam.r * D2R); G.scale(cam.z, cam.z); G.translate(-cam.x, -cam.y);
  corkboard({ w: 3200, h: 2000, frame: false });
  pinCard(W * .52, H * .14, 260, 150, { rot: 6, col: NC.manila, mat: 'manila', seed: 5901, draw: (w, h) => fakeText(-w * .4, -h * .15, w * .8, 4, 14, 3) });
  pinCard(W * .5, H * .86, 300, 120, { rot: -4, seed: 5902, torn: true, draw: (w, h) => fakeText(-w * .42, -h * .2, w * .84, 4, 12, 4) });
  const card = (img, c, vis = 1) => {
    if (vis <= 0) return null; const w = W * s, h = H * s, b = 9;
    G.save(); G.translate(c.x, c.y); G.rotate(c.r * D2R); G.scale(vis, vis);
    setShadow(2.4, curScale()); G.fillStyle = '#F4EFE4'; G.fillRect(-w / 2 - b, -h / 2 - b, w + b * 2, h + b * 2); noShadow();
    G.drawImage(img, -w / 2, -h / 2, w, h); G.restore();
    const a = c.r * D2R, py = -h / 2 + 2; return [c.x - Math.sin(a) * py, c.y + Math.cos(a) * py];
  };
  const pinOf = c => { const a = c.r * D2R, py = -H * s / 2 + 2; return [c.x - Math.sin(a) * py, c.y + Math.cos(a) * py]; };
  const bvis = k < .36 ? 0 : k >= .5 ? 1 : (st => st < .6 ? 1.18 : st < .8 ? .96 : 1)(seg(sm(k * 2.4), .87, 1.2));
  const pa = card(prev, A), pb = pinOf(B);
  redString(pa, pb, ease(seg(k, .4, .64)), { pins: false, w: 4 });   // the yarn runs UNDER the incoming card
  card(cur, B, bvis);
  if (e1 > .3) pushpin(pa[0], pa[1]); if (k >= .64) pushpin(pb[0], pb[1]);
  G.restore();
}

// ---------- executive puppets (jointed / collage / silhouette) ----------
EXPR.smug = { eye: 'open', lid: .4, low: .14, tilt: 8, brow: [.1, 12], mouth: 'smirk', cheek: .25, look: [.3, 0] };
EXPR.nervous = { eye: 'open', lid: .05, pupil: .8, brow: [.55, -18], mouth: 'wobble', cheek: 0, sweat: 1, look: [.7, .1] };
EXPR.greedy = { eye: 'open', lid: .3, low: .2, tilt: 10, brow: [.05, 16], mouth: 'grin', cheek: .8 };
EXPR.shocked = { eye: 'wide', pupil: .4, brow: [.9, -8], mouth: 'wail', cheek: 0, sweat: 1 };
{ const _dm = drawMouth;
  drawMouth = function (kind, x, y, s, S, q3) {
    if (kind === 'smirk') { piece(SH.band(.36 * s, .12 * s, 15, 115), { x: x + .12 * s, y: y - .26 * s, rot: -10, col: MOUTH_LINE, depth: .35, seed: S + 119 }); return; }
    return _dm(kind, x, y, s, S, q3);
  }; }
{ const _em = emote;
  emote = function (kind, x, y, s = 40, age = 1) {
    if (kind !== 'dollar') return _em(kind, x, y, s, age);
    const a = sm(age); if (a < 0) return; const pop = a < .25 ? backOut(a / .25) : 1;
    G.save(); G.translate(x, y + sway('emd', .08 * s, .9)); G.scale(pop, pop);
    [[0, 0, 1], [.9, -.7, .6], [-.8, -.9, .5]].forEach(([dx, dy, k], i) => { G.save(); G.translate(dx * s, dy * s); G.rotate(sway('emd' + i, 10, .7) * D2R);
      piece(SH.circle(.62 * s * k), { col: NC.money, depth: 1.4, seed: 1930 + i, jit: 0 }); print('$', 0, .3 * s * k, `900 ${.85 * s * k}px ${TF.head}`, { col: NC.moneyLt }); G.restore(); });
    G.restore();
  }; }

const EXECS = {
  chairman: { seed: 3100, build: 'stout', skin: '#EDC6A3', suit: '#28324A', suit2: '#212A3F', shirt: NC.shirt, tie: '#B3261E', neck: 'tie', hair: 'bald', hairCol: '#CFC9BF', brow: '#A29B91', tache: true, iris: '#5F7385', lip: '#B97668', pocket: '#E8DFC9' },
  founder: { seed: 3200, build: 'tall', skin: '#E7BB96', suit: '#3C3B41', suit2: '#33415E', shirt: '#EDE8DD', neck: 'tee', hair: 'quiff', hairCol: '#6A4530', glasses: true, iris: '#5A3D28', lip: '#B4705F' },
  banker: { seed: 3300, build: 'avg', skin: '#B47D57', suit: '#5D5F67', suit2: '#4E5058', shirt: '#E2EBF0', tie: '#E0AE35', neck: 'tie', hair: 'slick', hairCol: '#1E1917', iris: '#3A2618', lip: '#8C5242', pocket: '#E0AE35' },
  boss: { seed: 3400, build: 'slim', skin: '#8C5B3E', suit: '#7A2D3A', suit2: '#682531', shirt: '#F1E8D8', neck: 'open', hair: 'bob', hairCol: '#2A1D19', iris: '#2E1E14', lip: '#7B3833', earrings: true },
};
const BUILDS = {
  avg: { hipH: 4.3, thigh: 2.1, shin: 2.0, bh: 4.0, sw: 1.35, belly: 0, hip: .55, legR: [.42, .36, .3], armR: [.4, .34, .29], head: [1.35, 1.6] },
  stout: { hipH: 3.75, thigh: 1.8, shin: 1.75, bh: 3.8, sw: 1.6, belly: .5, hip: .68, legR: [.52, .44, .36], armR: [.45, .38, .32], head: [1.5, 1.55] },
  tall: { hipH: 4.8, thigh: 2.35, shin: 2.25, bh: 4.2, sw: 1.25, belly: -.1, hip: .5, legR: [.38, .32, .27], armR: [.36, .31, .27], head: [1.3, 1.66] },
  slim: { hipH: 4.4, thigh: 2.15, shin: 2.05, bh: 3.9, sw: 1.18, belly: -.12, hip: .5, legR: [.37, .31, .26], armR: [.34, .29, .25], head: [1.28, 1.58] },
};
const SILH = '#262122';
const EXEC_DEFS = {};
function execDef(name, style) {
  const key = name + ':' + style; if (EXEC_DEFS[key]) return EXEC_DEFS[key];
  const P = EXECS[name], B = BUILDS[P.build], sil = style === 'silhouette', col = style === 'collage';
  const C = {   // colours per style
    skin: sil ? SILH : P.skin, suit: sil ? SILH : P.suit, suit2: sil ? SILH : P.suit2, hair: sil ? SILH : P.hairCol, shoe: sil ? SILH : '#1F1A1A',
    shirt: sil ? '#E9E2D0' : P.shirt, tie: sil ? NC.red : P.tie, lapel: sil ? '#3A3334' : mixCol(P.suit, '#000000', .25),
  };
  const M = { suit: col ? 'news' : sil ? 'card' : 'paper', skin: col ? 'news' : sil ? 'card' : 'paper' };
  const [hrx, hry] = B.head, hk = hrx / 1.35, vk = hry / 1.6, bh = B.bh, sw = B.sw, upper = bh * .42;
  const headY = -(bh + .5 + hry * .95);
  const F = { eyes: [[-.5 * hk, -.02], [.5 * hk, -.02]], eyeR: [.25, .3], pupil: .17, lid: C.skin, brow: [.42, .1, .15], browCol: sil ? SILH : (P.brow || P.hairCol), lineCol: PC.ink,
    cheeks: [[-.86 * hk, .55], [.86 * hk, .55]], cheekR: .22, cheekCol: mixCol(P.skin, '#E26D8A', .35), mouth: [0, .92 * vk], mouthS: .62, turn: .42, sweat: [1.45 * hk, -.5], vein: [.95, -1.0] };
  const D = {
    seed: P.seed, hipH: B.hipH, crouch: 1.5, ankleH: .3, thigh: B.thigh, shin: B.shin, legR: B.legR, upper, fore: upper * .9, armR: B.armR, handR: .38,
    brad: .12, topR: hry + (P.hair === 'quiff' ? .9 : .4), farTint: .14,
    limb: C.suit, sleeve: C.suit, cuff: C.shirt, hand: C.skin, leg: C.suit2, shoe: C.shoe, sleeveMat: M.suit, legMat: M.suit, restArm: [[-8, 6], [8, -6]],
    foot: [0, 0, .32, -.02], footShape: u => SH.smooth([[-.5 * u, .14 * u, 1], [-.48 * u, -.2 * u], [.35 * u, -.24 * u], [.85 * u, -.05 * u], [.85 * u, .16 * u, 1], [0, .2 * u]]),
    front: { hips: [[-B.hip, 0], [B.hip, 0]], feet: [[-B.hip - .12, 0], [B.hip + .12, 0]], shoulders: [[-sw, -bh], [sw, -bh]], neck: [0, -(bh + .5)], head: [0, headY] },
    '3q': { hips: [[-B.hip * .45, -.05], [B.hip * .9, 0]], feet: [[-B.hip * .6, 0], [B.hip + .1, 0]], shoulders: [[-sw * .65, -bh - .05], [sw * .82, -bh + .05]], neck: [.12, -(bh + .5)], head: [.18, headY] },
    face: F, style, P, C,
    back() { },
    body(u, view, o, S) {
      const q3 = view === '3q', k = q3 ? .9 : 1, cx = q3 ? .06 * u : 0, vx = (q3 ? .4 : 0) * u, wb = B.belly;
      piece(SH.capsule(.9 * u, .3 * u), { x: (q3 ? .1 : 0) * u, y: -(bh + 1.15) * u, col: C.skin, mat: M.skin, depth: .4, seed: S + 2 });   // neck
      const jk = SH.smooth([[-.5 * u, -(bh + .38) * u], [.5 * u, -(bh + .38) * u], [(sw + .28) * u, -(bh - .08) * u, 1], [(sw + .08 + wb * .5) * u, -(bh - 1.5) * u], [(sw - .12 + wb) * u, -.6 * u], [(sw - .2 + wb * .6) * u, .9 * u, 1], [0, 1.02 * u], [-(sw - .2 + wb * .6) * u, .9 * u, 1], [-(sw - .12 + wb) * u, -.6 * u], [-(sw + .08 + wb * .5) * u, -(bh - 1.5) * u], [-(sw + .28) * u, -(bh - .08) * u, 1]]);
      piece(jk, { x: cx, sx: k, col: C.suit, mat: M.suit, depth: 1.2, seed: S + 3 });
      if (col) halftoneOver(jk, { x: cx, sx: k, alpha: .16 });
      const vt = -(bh + .32) * u, vb = -(bh - 1.6) * u;
      piece(SH.poly([[-.52 * u, vt], [.52 * u, vt], [0, vb]]), { x: vx, col: P.neck === 'open' && !sil ? C.skin : C.shirt, mat: P.neck === 'open' ? M.skin : 'card', depth: .3, seed: S + 4 });
      if (P.neck === 'open') { [-1, 1].forEach((sd, i) => piece(SH.poly([[sd * .52 * u, vt], [sd * .15 * u, vt + .55 * u], [sd * .6 * u, vt + .45 * u]]), { x: vx, col: C.shirt, mat: 'card', depth: .45, seed: S + 5 + i })); if (P.earrings && !sil) piece(SH.ellipse(.16 * u, .2 * u), { x: vx, y: vt + .9 * u, col: NC.gold, depth: .3, seed: S + 7 }); }
      if (P.neck === 'tee') piece(SH.band(.4 * u, .1 * u, 20, 160), { x: vx, y: vt - .05 * u, col: mixCol(C.shirt, '#000000', .12), depth: .15, seed: S + 8 });
      if (P.neck === 'tie') {
        piece(SH.poly([[-.17 * u, vt + .02 * u], [.17 * u, vt + .02 * u], [.11 * u, vt + .3 * u], [-.11 * u, vt + .3 * u]]), { x: vx, col: C.tie, depth: .5, seed: S + 9 });
        piece(SH.poly([[-.11 * u, vt + .28 * u], [.11 * u, vt + .28 * u], [.16 * u, vb - .55 * u], [0, vb - .12 * u], [-.16 * u, vb - .55 * u]]), { x: vx, col: C.tie, depth: .45, seed: S + 10 });
      }
      [-1, 1].forEach((sd, i) => piece(SH.poly([[sd * .52 * u, vt], [sd * .05 * u, vb], [sd * .92 * u, vt + .9 * u], [sd * .78 * u, vt + .08 * u]]), { x: vx, col: C.lapel, mat: M.suit, depth: .55, seed: S + 11 + i }));
      [vb + .3 * u, vb + 1.0 * u].forEach((by, i) => piece(SH.circle(.09 * u), { x: vx + .1 * u, y: by, col: sil ? '#3A3334' : mixCol(P.suit, '#000000', .45), depth: .2, seed: S + 13 + i }));
      piece(SH.rect(.05 * u, (.9 * u - vb)), { x: vx + .02 * u, y: (vb + .9 * u) / 2, col: mixCol(C.suit, '#000000', .3), depth: .05, seed: S + 15, edge: false });
      if (P.pocket && !sil) piece(SH.poly([[-.25 * u, 0], [.25 * u, 0], [.18 * u, -.22 * u], [0, -.1 * u], [-.12 * u, -.26 * u]]), { x: vx + .85 * u * (q3 ? .9 : 1), y: vt + 1.35 * u, col: P.pocket, mat: 'card', depth: .3, seed: S + 16 });
    },
    head(u, view, o, S, e, st) {
      const q3 = view === '3q', hx = q3 ? .05 * u : 0, fx = q3 ? .2 * u : 0, bx = q3 ? -.25 * u : 0, X = (pts, dx) => pts.map(([a, b, c]) => [a * hk * u + dx, b * vk * u, c]);
      if (P.hair === 'bob') piece(SH.smooth(X([[-1.72, 1.25, 1], [-1.78, -.4], [-1.28, -1.75], [0, -2.06], [1.28, -1.75], [1.78, -.4], [1.72, 1.25, 1], [0, 1.0]], bx)), { col: C.hair, mat: M.skin, depth: 1.2, seed: S + 20 });
      if (!q3) [-1, 1].forEach((sd, i) => piece(SH.ellipse(.26 * u, .38 * u), { x: sd * (hrx - .04) * u, y: .1 * u, col: mixCol(C.skin, '#000000', sil ? 0 : .06), mat: M.skin, depth: .9, seed: S + 21 + i }));
      if (q3 && !col) piece(SH.poly([[0, -.3 * u], [.36 * u, .16 * u], [0, .24 * u]]), { x: (hrx + .05) * u, y: .3 * u, col: C.skin, mat: M.skin, depth: .8, seed: S + 23 });   // nose tip on the profile edge
      const head = SH.ellipse(hrx * (q3 ? .96 : 1) * u, hry * u);
      piece(head, { x: hx, col: C.skin, mat: M.skin, depth: 1.2, seed: S + 24 });
      if (col) halftoneOver(head, { x: hx, alpha: .18 });
      if (q3) piece(SH.ellipse(.27 * u, .4 * u), { x: -(hrx * .72) * u, y: .1 * u, col: mixCol(C.skin, '#000000', sil ? 0 : .08), mat: M.skin, depth: .4, seed: S + 25 });
      // hair
      const hp = { col: C.hair, mat: M.skin, depth: .9, seed: S + 26 };
      if (P.hair === 'bald') {
        (q3 ? [[-1.18, -.62]] : [[-1.22, -.62], [1.22, -.62]]).forEach(([a, b], i) => piece(SH.blob(.36 * u, 7, .2, S + 27 + i), { ...hp, x: a * hk * u, y: b * u, sy: 1.2, rot: a < 0 ? -20 : 20, seed: S + 27 + i }));
        if (!sil) piece(SH.ellipse(.42 * u, .2 * u), { x: hx - .45 * u, y: -1.18 * u, rot: -18, col: '#FFFFFF', mat: 'tissue', depth: 0, seed: S + 29 });
      } else if (P.hair === 'slick') {
        piece(SH.smooth(X([[-1.42, -.1, 1], [-1.42, -.95], [-.95, -1.58], [0, -1.8], [.95, -1.6], [1.4, -1.0], [1.42, -.1, 1], [1.2, -.58], [.92, -1.06], [-.3, -1.16], [-1.15, -.72]], fx * .5)), hp);
        if (!sil) { piece(SH.rect(.06 * u, .62 * u), { x: -.42 * u + fx * .5, y: -1.4 * u, rot: 64, col: mixCol(C.hair, '#FFFFFF', .25), depth: .05, seed: S + 30, edge: false }); piece(SH.band(1.1 * u, .1 * u, 205, 250), { x: fx * .5, y: -.3 * u, col: '#FFFFFF', mat: 'tissue', depth: 0, seed: S + 31 }); }
      } else if (P.hair === 'quiff') {
        piece(SH.smooth(X([[-1.4, -.2, 1], [-1.46, -1.0], [-1.0, -1.62], [-.2, -1.84], [.25, -2.4], [1.0, -2.34], [1.32, -1.75], [1.45, -.95], [1.4, -.2, 1], [1.15, -.72], [.4, -1.12], [-.6, -1.06], [-1.15, -.72]], fx * .6)), hp);
      } else if (P.hair === 'bob') {
        piece(SH.smooth(X([[-1.48, .5, 1], [-1.5, -.9], [-.95, -1.62], [.2, -1.8], [1.1, -1.52], [1.5, -.7], [1.52, .62, 1], [1.22, -.1], [1.0, -.68], [.3, -.98], [-.55, -.7], [-1.14, -.15]], fx)), hp);
      }
      // face
      if (style === 'jointed') drawFace(F, u, e, { view, blink: st.blink, look: st.look }, S);
      else if (style === 'collage') collageFace(F, u, e, st, S, P, q3, hk);
      if (!sil) {
        const nx = (q3 ? F.turn * 1.15 : 0) * u;
        if (style === 'jointed') piece(SH.smooth([[-.16 * u, .1 * u], [0, -.32 * u], [.16 * u, .1 * u], [0, .2 * u]]), { x: nx, y: .4 * u, col: mixCol(P.skin, '#6B3A22', .22), mat: M.skin, depth: .3, seed: S + 33 });
        if (P.beard) { const by = (F.mouth ? F.mouth[1] : .9); piece(SH.smooth([[-1.32 * u, -.1 * u, 1], [-1.22 * u, .9 * u], [-.7 * u, 1.62 * u], [0, 1.95 * u], [.7 * u, 1.62 * u], [1.22 * u, .9 * u], [1.32 * u, -.1 * u, 1], [1.0 * u, .5 * u], [.55 * u, (by + .02) * u], [0, (by + .38) * u], [-.55 * u, (by + .02) * u], [-1.0 * u, .5 * u]]), { x: nx * .5, y: 0, col: C.hair, mat: M.skin, depth: .5, seed: S + 35 }); }
        if (P.tache) piece(SH.smooth([[-.58 * u, .06 * u, 1], [-.22 * u, -.12 * u], [0, -.04 * u], [.22 * u, -.12 * u], [.58 * u, .06 * u, 1], [.34 * u, .18 * u], [0, .1 * u], [-.34 * u, .18 * u]]), { x: nx * .95, y: .66 * u, col: C.hair, depth: .45, seed: S + 34 });
      }
      if (P.glasses) { const gc = sil ? '#E9E2D0' : '#1E1A1A', ey = -.02 * u; G.save(); setShadow(.4, curScale()); G.strokeStyle = gc; G.lineWidth = .085 * u;
        const ex = i => { const x0 = F.eyes[i][0] * u; return q3 ? x0 * .8 + F.turn * u + (i === 0 ? .06 * u : 0) : x0; };
        [0, 1].forEach(i => { G.beginPath(); G.ellipse(ex(i), ey, .38 * u * (q3 && i === 0 ? .78 : 1), .32 * u, 0, 0, TAU); G.stroke(); });
        G.beginPath(); G.moveTo(ex(0) + .36 * u * (q3 ? .78 : 1), ey - .05 * u); G.lineTo(ex(1) - .36 * u, ey - .05 * u); G.stroke(); G.restore(); }
    },
  };
  return (EXEC_DEFS[key] = D);
}
function exec(name, x, y, u, o = {}) {
  const sv = TRAIL._pewter; TRAIL._pewter = TRAIL.execBrads === 'pewter';
  try { return puppet(execDef(name, o.style || TRAIL.puppetStyle), x, y, u, o); } finally { TRAIL._pewter = sv; }
}
{ const _b = brad;   // executives get small dull pewter split pins so they don't read as extra jacket buttons
  brad = function (x, y, r = 6, o = {}) { if (TRAIL._pewter && !o.col) { o = { hi: '#B4AFA9', col: '#625D59', lo: '#2B2826', ...o }; r *= .72; } return _b(x, y, r, o); }; }
const chairman = (x, y, u, o) => exec('chairman', x, y, u, o);
const founder = (x, y, u, o) => exec('founder', x, y, u, o);
const banker = (x, y, u, o) => exec('banker', x, y, u, o);
const boss = (x, y, u, o) => exec('boss', x, y, u, o);

// ---------- collage faces: eyes and mouth cut from magazine photos, halftone printed ----------
function collageFace(F, u, e, st, S, P, q3, hk) {
  const sh = q3 ? F.turn * u : 0, blink = st.blink || 0, L = st.look || e.look || [0, 0];
  const ey = F.eyes[0][1] * u, sw = 2.35 * u * hk * (q3 ? .86 : 1), sht = .82 * u, rot = (hash(S * .37) - .5) * 7;
  const strip = SH.rect(sw, sht), stripCol = mixCol(P.skin, '#D8CEBD', .3);
  piece(strip, { x: sh * .85, y: ey, rot, col: stripCol, mat: 'news', torn: true, tornAmp: 2.6, depth: .7, seed: S + 201 });
  G.save(); G.translate(sh * .85, ey); G.rotate(rot * D2R);
  F.eyes.forEach(([x0], i) => {
    const kind = (i === 1 && e.eyeR) || e.eye || 'open', far = q3 && i === 0, wide = kind === 'wide', r = .34 * u * (wide ? 1.15 : 1) * (far ? .8 : 1);
    const cx = x0 * u * (q3 ? .78 : 1), lid = clamp(Math.max(wide ? 0 : (e.lid || 0), blink));
    photoEye(cx, 0, r, kind, lid, L, e, P, S + 210 + i * 5, i === 0 ? -1 : 1);
    if (e.brow) { const [lift, ang] = e.brow; piece(SH.smooth([[-.5 * r * 1.6, .05 * r], [-.2 * r, -.18 * r], [.55 * r * 1.4, -.08 * r], [.5 * r * 1.6, .1 * r], [0, .02 * r]]), { x: cx, y: -r * .95 - lift * r * .5, rot: -(i === 0 ? -1 : 1) * ang, sx: i === 0 ? -1 : 1, col: mixCol(P.brow || P.hairCol, '#000000', .1), mat: 'news', depth: .2, seed: S + 230 + i }); }
  });
  halftoneOver(strip, { alpha: .2, sp: 4 });
  G.restore();
  // mouth strip
  const my = F.mouth[1] * u, mw = 1.55 * u * hk, mh = .78 * u, mrot = (hash(S * .71) - .5) * 9, mx = sh * 1.0;
  const mstrip = SH.rect(mw, mh);
  piece(mstrip, { x: mx, y: my, rot: mrot, col: stripCol, mat: 'news', torn: true, tornAmp: 2.4, depth: .7, seed: S + 240 });
  G.save(); G.translate(mx, my); G.rotate(mrot * D2R); photoLips(e.mouth || 'flat', .5 * u, P, S + 245); halftoneOver(mstrip, { alpha: .2, sp: 4 }); G.restore();
  // nose: a soft printed shadow
  piece(SH.smooth([[-.2 * u, .12 * u], [-.04 * u, -.4 * u], [.12 * u, -.38 * u], [.22 * u, .12 * u], [0, .2 * u]]), { x: sh * 1.1, y: .4 * u, col: mixCol(P.skin, '#5A3420', .3), mat: 'news', depth: .15, seed: S + 250, alpha: .8 });
  if (e.sweat) piece(SH.drop(.26 * u), { x: F.sweat[0] * u + sh * .6, y: F.sweat[1] * u, col: '#9AD6F2', mat: 'tissue', depth: 1, seed: S + 251 });
}
function photoEye(cx, cy, r, kind, lid, L, e, P, seed, side) {
  if (PAPER.dry) return;
  if (kind === 'arcUp' || kind === 'shut' || lid >= .95) {
    G.save(); noShadow(); G.strokeStyle = '#2A1D18'; G.lineWidth = r * .16; G.lineCap = 'round'; G.beginPath();
    if (kind === 'arcUp') G.arc(cx, cy + r * .35, r * .8, Math.PI * 1.15, Math.PI * 1.85); else G.arc(cx, cy - r * .5, r * .85, Math.PI * .2, Math.PI * .8);
    G.stroke(); G.restore(); return;
  }
  const alm = SH.smooth([[-r, 0, 1], [-r * .4, -r * .55], [r * .45, -r * .55], [r, 0, 1], [r * .4, r * .45], [-r * .4, r * .45]]);
  piece(alm, { x: cx, y: cy, col: '#EEE8DD', mat: 'card', depth: .12, seed, jit: 0, edge: false });
  G.save(); G.translate(cx, cy); G.clip(toPath(alm)); noShadow();
  const ir = r * .42 * (e.pupil ? Math.min(1.1, .8 + e.pupil * .3) : 1), ix = clamp(L[0] + .0, -1, 1) * r * .38, iy = clamp((L[1] || 0) + (e.pupilY || 0), -1, 1) * r * .18;
  const g = G.createRadialGradient(ix - ir * .2, iy - ir * .2, ir * .1, ix, iy, ir);
  g.addColorStop(0, mixCol(P.iris, '#FFFFFF', .35)); g.addColorStop(.7, P.iris); g.addColorStop(1, mixCol(P.iris, '#000000', .5));
  G.fillStyle = g; G.beginPath(); G.arc(ix, iy, ir, 0, TAU); G.fill();
  G.fillStyle = '#120D0B'; G.beginPath(); G.arc(ix, iy, ir * .45 * (e.eye === 'wide' ? .8 : 1), 0, TAU); G.fill();
  G.fillStyle = 'rgba(255,255,255,.85)'; G.beginPath(); G.arc(ix - ir * .35, iy - ir * .35, ir * .18, 0, TAU); G.fill();
  const sg = G.createLinearGradient(0, -r * .6, 0, r * .1); sg.addColorStop(0, 'rgba(60,30,20,.45)'); sg.addColorStop(1, 'rgba(60,30,20,0)'); G.fillStyle = sg; G.fillRect(-r, -r, r * 2, r * 1.1);
  if (lid > .02) { const tilt = (e.tilt || 0) * -side; G.save(); G.rotate(tilt * D2R); G.fillStyle = mixCol(P.skin, '#7A5038', .25); G.fillRect(-r * 1.3, -r * .62, r * 2.6, r * 1.1 * lid); G.restore(); }
  if ((e.low || 0) > .02) { G.fillStyle = mixCol(P.skin, '#7A5038', .2); G.fillRect(-r * 1.3, r * .5 - r * .9 * e.low, r * 2.6, r); }
  G.restore();
  G.save(); noShadow(); G.strokeStyle = '#21160F'; G.lineWidth = r * .13; G.lineCap = 'round'; const ly = cy - r * .55 + r * 1.05 * clamp(lid) * .9;
  G.beginPath(); G.moveTo(cx - r * 1.02, cy); G.quadraticCurveTo(cx, ly - r * .2 * (1 - lid), cx + r * 1.02, cy - r * .05); G.stroke(); G.restore();
}
function photoLips(kind, s, P, seed) {
  const spec = { flat: [0, 0, 1], set: [-.06, 0, .95], small: [0, .06, .62], smile: [.32, 0, 1.05], grin: [.38, .26, 1.1], open: [.22, .55, 1], o: [0, .5, .55],
    frown: [-.34, 0, 1], wail: [-.22, .6, 1], grit: [0, .24, 1.05], wobble: [-.1, .05, .95], smirk: [.2, 0, 1] }[kind] || [0, 0, 1];
  const [cv, op, wk] = spec, w = s * wk, lc = P.lip, ri = kind === 'smirk' ? .34 : 0;
  const cyL = -cv * w * .55, cyR = -(cv + ri) * w * .55;
  if (op > 0) {
    piece(SH.smooth([[-w * .9, cyL, 1], [0, -w * .12], [w * .9, cyR, 1], [w * .5, w * .1 + op * w * .7], [-w * .5, w * .1 + op * w * .7]]), { col: '#3A1512', mat: 'card', depth: .05, seed, jit: 0, edge: false });
    if (kind === 'grin' || kind === 'grit' || kind === 'open') piece(SH.smooth([[-w * .7, cyL * .8, 1], [w * .7, cyR * .8, 1], [w * .55, w * .14], [-w * .55, w * .14]]), { y: -w * .02, col: '#EFE8DA', mat: 'card', depth: .03, seed: seed + 1, jit: 0, edge: false });
  }
  piece(SH.smooth([[-w, cyL, 1], [-w * .45, -w * .2 + cyL * .3], [-w * .1, -w * .26], [0, -w * .18], [w * .1, -w * .26], [w * .45, -w * .2 + cyR * .3], [w, cyR, 1], [w * .4, -w * .06], [-w * .4, -w * .06]]), { col: mixCol(lc, '#3A1A14', .2), mat: 'news', depth: .15, seed: seed + 2, jit: 0 });
  const lb = w * .1 + op * w * .7;
  piece(SH.smooth([[-w * .92, cyL + w * .02, 1], [-w * .4, lb], [0, lb + w * .2], [w * .4, lb], [w * .92, cyR + w * .02, 1], [w * .4, lb - w * .14], [-w * .4, lb - w * .14]]), { col: lc, mat: 'news', depth: .15, seed: seed + 3, jit: 0 });
  G.save(); noShadow(); G.fillStyle = 'rgba(255,240,230,.35)'; G.beginPath(); G.ellipse(0, lb + w * .06, w * .25, w * .05, 0, 0, TAU); G.fill(); G.restore();
}

// ---------- model sheet: node render.mjs --loop=execs --sheet=0 --cols=1 --w=1600 --out=out/check/execs.jpg ----------
LOOPS.execs = t => {
  backdrop(NC.wall, { to: 'rgba(15,10,12,.4)' });
  const names = Object.keys(EXECS), styles = ['jointed', 'collage', 'silhouette'], faces = ['neutral', 'smug', 'shocked'];
  styles.forEach((sty, r) => names.forEach((nm, c) => {
    const x = 180 + c * 440 + (r % 2) * 0, y = 330 + r * 350;
    exec(nm, x, y, 19, { style: sty, face: faces[(c + r) % 3], blink: false, jit: 0, view: c % 2 ? '3q' : 'front' });
    print(`${nm} · ${sty}`, x, y + 30, `500 22px ${TF.cond}`, { col: '#EDE6D8' });
  }));
};
LOOPS.execs.len = 1;
LOOPS.execfaces = t => {   // every expression, collage vs jointed, close-up
  backdrop(NC.wall);
  const names = Object.keys(EXPR); names.forEach((nm, i) => {
    const c = i % 9, r = Math.floor(i / 9), x = 110 + c * 212, y = 230 + r * 530;
    G.save(); G.translate(x, y); exec('banker', 0, 380, 26, { face: nm, blink: false, jit: 0, style: r % 2 ? 'jointed' : 'collage', dry: false }); G.restore();
    print(nm, x, y + 410, `500 20px ${TF.cond}`, { col: '#EDE6D8' });
  });
};
LOOPS.execfaces.len = 1;
LOOPS.execclose = t => {   // close-ups: t < .5 jointed (front), t >= .5 collage (3/4)
  backdrop('#C9B79A'); const sty = t < .5 ? 'jointed' : 'collage';
  Object.keys(EXECS).forEach((nm, c) => exec(nm, 240 + c * 480, 1040, 62, { style: sty, face: ['neutral', 'smug', 'shocked', 'determined'][c], blink: false, jit: 0, view: t < .5 ? 'front' : '3q' }));
};
LOOPS.execclose.len = 1;
