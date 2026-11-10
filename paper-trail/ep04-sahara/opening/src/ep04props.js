// ep04props.js - Case 04 (Sahara) props. Everything generic: no logos, no likenesses, no real documents.
// Sizes in world px (1920x1080 frame), angles in degrees, every function a pure function of time.
const SA = {
  night: '#0D1418', sky: '#16222B', street: '#1A2025', kerb: '#2B3338', facade: '#23292E', winLit: '#E2BE68', winDk: '#141A1F',
  lorry: '#C8812E', lorryDk: '#8E5A1E', body: '#2F5E52', bodyDk: '#22463D', plank: '#3C6E60', wheel: '#151517', hub: '#8C8F92',
  kraft: '#B98A55', kraftDk: '#8F6638', tape: '#D9CBA4', form: '#EEE8D8', formDk: '#D6CDB6', ink: '#2A2622', thumb: '#46508E',
  tail: '#D23A2A', head: '#F6E7B0', bulb: '#F2D58A', floor: '#1E1A17', desk: '#3A2A20',
};

// ---------- weather & light ----------
// rain over the whole frame (screen space), stepped at 12 fps like everything else
function rain(a = 1, o = {}) {
  if (PAPER.dry || a <= 0) return; const st = onStep(T, 12), n = o.n || 170;
  G.save(); G.setTransform(1, 0, 0, 1, 0, 0); noShadow(); G.strokeStyle = `rgba(190,206,222,${(.3 * a).toFixed(3)})`; G.lineWidth = 2; G.lineCap = 'round'; G.beginPath();
  for (let i = 0; i < n; i++) { const x = frac(hash(i * 7.13) + st * .031) * (W + 200) - 100, y = frac(hash(i * 3.71) + st * .53) * (H + 120) - 60, L = 26 + hash(i * 1.9) * 34; G.moveTo(x, y); G.lineTo(x - L * .22, y + L); }
  G.stroke(); G.restore();
}
// a soft additive glow (headlights, bulbs, reflections)
function glow(x, y, r, col = '255,226,170', a = .5, o = {}) {
  if (PAPER.dry || a <= 0) return; G.save(); noShadow(); G.globalCompositeOperation = 'screen';
  const g = G.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, `rgba(${col},${a})`); g.addColorStop(1, `rgba(${col},0)`);
  G.fillStyle = g; if (o.sy) { G.translate(x, y); G.scale(1, o.sy); G.translate(-x, -y); } G.fillRect(x - r, y - r, r * 2, r * 2); G.restore();
}

// ---------- the night street ----------
function nightStreet(o = {}) {
  piece(SH.rect(5000, 3000), { x: 960, y: 300, col: SA.sky, mat: 'paper', depth: 0, seed: 40000, jit: 0, edge: false });
  // far skyline
  for (let i = 0; i < 16; i++) { const w = 120 + hash(i * 3.3) * 160, h = 180 + hash(i * 1.7) * 320, x = -200 + i * 170;
    piece(SH.rect(w, h), { x, y: 640 - h / 2, col: mixCol(SA.night, SA.facade, .35 + hash(i) * .3), mat: 'card', depth: .2, seed: 40010 + i, jit: 0, edge: false });
    for (let k = 0; k < 5; k++) if (hash(i * 9 + k) > .72) piece(SH.rect(10, 14), { x: x - w / 3 + hash(i + k) * w * .6, y: 640 - h + 30 + k * 40, col: SA.winLit, mat: 'card', depth: 0, seed: 40100 + i * 9 + k, jit: 0, edge: false }); }
  // the regulator's building, left: no sign, no logo
  piece(SH.rect(760, 980), { x: 250, y: 330, col: SA.facade, mat: 'card', depth: .6, seed: 40200, jit: 0 });
  for (let r = 0; r < 9; r++) for (let c = 0; c < 6; c++) { const lit = hash(r * 7 + c * 3.1) > .62;
    piece(SH.rect(70, 46), { x: -40 + c * 110, y: -60 + r * 82, col: lit ? SA.winLit : SA.winDk, mat: 'card', depth: .15, seed: 40210 + r * 6 + c, jit: 0, edge: false }); }
  piece(SH.rect(420, 40), { x: 420, y: 700, col: '#30383E', mat: 'card', depth: 1, seed: 40290, jit: 0 });   // entrance canopy
  // street and kerb
  piece(SH.rect(5000, 420), { x: 960, y: 980, col: SA.street, mat: 'paper', depth: .3, seed: 40300, jit: 0, edge: false });
  piece(SH.rect(5000, 24), { x: 960, y: 772, col: SA.kerb, mat: 'card', depth: .4, seed: 40301, jit: 0, edge: false });
  if (!PAPER.dry) { glow(420, 760, 260, '226,190,104', .22, { sy: .35 }); }
}

// ---------- the lorry: an Indian goods truck, side view, facing right (o.left flips it). Origin: ground, mid-length ----------
function lorry(x, y, s = 1, o = {}) {
  const sd = o.seed || 41000; G.save(); G.translate(x, y); G.scale(o.left ? -s : s, s);
  piece(SH.rect(470, 22), { x: -40, y: -42, col: '#1C1C1E', mat: 'card', depth: .8, seed: sd, jit: 0 });                          // chassis
  piece(SH.rect(330, 200), { x: -100, y: -150, col: SA.body, mat: 'card', depth: 1, seed: sd + 1, jit: 0 });                        // cargo body
  for (let i = 0; i < 6; i++) piece(SH.rect(330, 6), { x: -100, y: -220 + i * 30, col: SA.plank, mat: 'card', depth: .05, seed: sd + 2 + i, jit: 0, edge: false });
  piece(SH.round(350, 60, 20), { x: -100, y: -268, col: SA.bodyDk, mat: 'felt', depth: .6, seed: sd + 9, jit: 0 });                // tarp roll
  piece(SH.poly([[80, -40], [80, -212], [150, -212], [188, -168], [200, -110], [204, -40]]), { col: o.col || SA.lorry, mat: 'card', depth: 1.1, seed: sd + 10, jit: 0 });   // cab
  piece(SH.poly([[150, -200], [182, -164], [150, -164]]), { col: '#2A3440', mat: 'card', depth: .1, seed: sd + 11, jit: 0, edge: false });   // windscreen
  piece(SH.rect(52, 40), { x: 116, y: -182, col: '#2A3440', mat: 'card', depth: .1, seed: sd + 12, jit: 0, edge: false });                // side window
  piece(SH.rect(110, 10), { x: 142, y: -120, col: SA.lorryDk, mat: 'card', depth: .05, seed: sd + 13, jit: 0, edge: false });            // painted stripe
  piece(SH.rect(30, 16), { x: 206, y: -48, col: '#9AA0A4', mat: 'card', depth: .3, seed: sd + 14, jit: 0 });                             // bumper
  for (const [i, wx] of [[0, -205], [1, -120], [2, 150]].map(a => a)) {
    piece(SH.circle(34), { x: wx, y: -34, col: SA.wheel, mat: 'card', depth: .9, seed: sd + 20 + i, jit: 0 });
    piece(SH.circle(12), { x: wx, y: -34, col: SA.hub, mat: 'card', depth: .2, seed: sd + 24 + i, jit: 0, edge: false });
  }
  piece(SH.circle(9), { x: 198, y: -78, col: SA.head, mat: 'card', depth: .2, seed: sd + 30, jit: 0, edge: false });                       // headlight
  piece(SH.rect(10, 18), { x: -266, y: -70, col: SA.tail, mat: 'card', depth: .2, seed: sd + 31, jit: 0, edge: false, keep: o.keepTail });  // tail light
  if (o.lights && !PAPER.dry) {   // headlight beam onto the wet road, and the reflection
    G.save(); noShadow(); G.globalCompositeOperation = 'screen'; const g = G.createLinearGradient(200, 0, 900, 0);
    g.addColorStop(0, 'rgba(255,236,180,.42)'); g.addColorStop(1, 'rgba(255,236,180,0)'); G.fillStyle = g;
    G.beginPath(); G.moveTo(200, -86); G.lineTo(900, -200); G.lineTo(900, 30); G.lineTo(200, -66); G.closePath(); G.fill(); G.restore();
    glow(198, -78, 46, '255,240,200', .8); glow(300, 30, 220, '255,226,160', .2, { sy: .22 });
  }
  G.restore();
}
// the lorry from behind, with a roll-up shutter. shutter 0 = closed, 1 = fully up. Origin: ground, centre
function lorryRear(x, y, s = 1, shutter = 0, o = {}) {
  const sd = o.seed || 41500, bw = 460, bh = 400, ow = 400, oh = 340, top = -60 - bh; G.save(); G.translate(x, y); G.scale(s, s);
  for (const wx of [-170, 170]) piece(SH.round(80, 90, 16), { x: wx, y: -40, col: SA.wheel, mat: 'card', depth: .6, seed: sd + (wx > 0 ? 1 : 0), jit: 0 });
  piece(SH.rect(bw, bh), { x: 0, y: top + bh / 2, col: SA.body, mat: 'card', depth: 1, seed: sd + 2, jit: 0 });
  piece(SH.rect(ow, oh), { x: 0, y: top + 30 + oh / 2, col: '#0F1214', mat: 'card', depth: .1, seed: sd + 3, jit: 0, edge: false });
  if (shutter > 0) {   // the cartons inside, floor to roof
    G.save(); G.beginPath(); G.rect(-ow / 2, top + 30, ow, oh); G.clip();
    cartonWall(-ow / 2 + 38, top + 30 + 26, 6, 5, 64, 52, sd + 100, { gap: 2, depth: .6 });
    G.restore();
  }
  const sh = oh * (1 - clamp(shutter));   // the shutter, ribbed, coming down from the top of the opening
  if (sh > 1) { G.save(); G.beginPath(); G.rect(-ow / 2, top + 30, ow, sh); G.clip();
    piece(SH.rect(ow, oh), { x: 0, y: top + 30 + sh - oh / 2, col: '#7C8387', mat: 'card', depth: .3, seed: sd + 4, jit: 0 });
    for (let i = 0; i < 14; i++) piece(SH.rect(ow, 4), { x: 0, y: top + 30 + sh - oh + 12 + i * 24, col: '#5E6468', mat: 'card', depth: 0, seed: sd + 5 + i, jit: 0, edge: false });
    G.restore(); }
  piece(SH.rect(bw + 20, 26), { x: 0, y: -48, col: '#1E2022', mat: 'card', depth: .8, seed: sd + 30, jit: 0 });                        // bumper
  for (const tx of [-bw / 2 + 24, bw / 2 - 24]) { piece(SH.rect(28, 40), { x: tx, y: -96, col: SA.tail, mat: 'card', depth: .3, seed: sd + 31 + (tx > 0 ? 1 : 0), jit: 0, keep: 1 }); glow(tx, -96, 60, '255,80,60', .45); }
  G.restore();
}

// ---------- cartons, forms, thumbprints ----------
function carton(x, y, w, h, seed, o = {}) {
  // a small set of cuts and tints, so the engine's caches hold (thousands of unique cartons made frames take 30 s)
  const r = (hash(seed * 1.3) - .5) * (o.rot ?? 2.4), v = Math.floor(hash(seed * 2.1) * 3); seed = 43000 + Math.floor(hash(seed * 3.7) * 24) * 3;
  piece(SH.rect(w, h), { x, y, rot: r, col: [SA.kraft, mixCol(SA.kraft, SA.kraftDk, .25), mixCol(SA.kraft, SA.kraftDk, .5)][v], mat: 'kraft', depth: o.flat ? 0 : o.depth ?? .9, seed, jit: 0 });
  if (o.flat) return;   // far away: no shadow blur, no tape or label (blurred shadows on ~1,000 pieces cost 30 s a frame)
  G.save(); G.translate(x, y); G.rotate(r * D2R);
  piece(SH.rect(w * .16, h), { col: SA.tape, mat: 'card', depth: .05, seed: seed + 1, jit: 0, edge: false });
  if (w > 50) piece(SH.rect(w * .34, h * .22), { x: w * .24, y: h * .18, col: '#EFE9DA', mat: 'card', depth: .05, seed: seed + 2, jit: 0, edge: false });
  G.restore();
}
function cartonWall(x0, y0, cols, rows, w, h, seed, o = {}) {
  const gap = o.gap ?? 4;
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) carton(x0 + c * (w + gap) + (r % 2) * w * .1, y0 + r * (h + gap), w, h, seed + r * 31 + c * 7, o);
}
// a fingerprint in ink pad colour: concentric wobbly loops
function thumbprint(x, y, r, seed = 1, o = {}) {
  if (PAPER.dry) return; const q = rnd('thumb' + seed); G.save(); noShadow(); G.translate(x, y); G.rotate((o.rot ?? 12) * D2R);
  G.strokeStyle = o.col || SA.thumb; G.globalAlpha *= o.alpha ?? .8; G.lineWidth = r * .07; G.globalCompositeOperation = 'multiply';
  for (let i = 1; i <= 8; i++) { const rr = r * i / 8; G.beginPath();
    for (let a = 0; a <= 64; a++) { const t = a / 64 * TAU, wob = 1 + (q() - .5) * .07; const px = Math.cos(t) * rr * .72 * wob, py = Math.sin(t) * rr * wob - (i < 3 ? r * .08 : 0); a ? G.lineTo(px, py) : G.moveTo(px, py); }
    G.stroke(); }
  G.restore();
}
// an application form: header band, fields, an EMPTY photo box (no face), a thumbprint. o.keep keeps it out of the sepia grade
function form(x, y, w, o = {}) {
  const h = w * 1.36, sd = o.seed || 42000; G.save(); G.translate(x, y); G.rotate((o.rot || 0) * D2R);
  piece(SH.rect(w, h), { col: SA.form, mat: 'paper', depth: o.depth ?? 1.4, seed: sd, jit: 0, keep: o.keep });
  piece(SH.rect(w * .86, h * .06), { y: -h * .42, col: '#3B3F45', mat: 'card', depth: .05, seed: sd + 1, jit: 0, edge: false, keep: o.keep });
  if (w > 120 && !o.simple) {
    fakeText(-w * .4, -h * .32, w * .5, 7, w * .045, sd + 2, { alpha: .45 });
    for (let i = 0; i < 4; i++) piece(SH.rect(w * .5, 2), { x: -w * .15, y: -h * .02 + i * h * .07, col: '#9C9484', mat: 'card', depth: 0, seed: sd + 10 + i, jit: 0, edge: false });
    piece(SH.rect(w * .26, w * .32), { x: w * .28, y: -h * .2, col: SA.formDk, mat: 'card', depth: .05, seed: sd + 20, jit: 0, keep: o.keep });   // the photo box, empty
    fakeText(-w * .4, h * .26, w * .8, 3, w * .04, sd + 3, { alpha: .35 });
    piece(SH.rect(w * .26, w * .26), { x: w * .28, y: h * .3, col: '#E7E0CE', mat: 'card', depth: .04, seed: sd + 21, jit: 0, keep: o.keep });
    thumbprint(w * .28, h * .3, w * .085, sd);
  }
  G.restore();
}

// ---------- the warehouse of cartons ----------
function warehouse(o = {}) {
  piece(SH.rect(5000, 3000), { x: 960, y: 400, col: '#120F0D', mat: 'paper', depth: 0, seed: 43000, jit: 0, edge: false });
  piece(SH.rect(5000, 600), { x: 960, y: 1080, col: SA.floor, mat: 'wood', depth: .2, seed: 43001, jit: 0, edge: false });
  const rows = [[640, .42, '#6E5236'], [720, .62, '#83613E'], [830, .86, null]];   // far to near: baseline, scale, tint
  rows.forEach(([base, sc, tint], li) => {
    for (let k = 0; k < 9; k++) { const sx = -700 + k * 430 * sc + (li % 2) * 120, n = 4 + Math.floor(hash(li * 17 + k) * 3);
      G.save(); G.translate(sx, base); G.scale(sc, sc);
      for (let j = 0; j < n; j++) for (let c = 0; c < 3; c++) carton(c * 104 - 104, -60 - j * 82, 100, 78, 43100 + li * 400 + k * 40 + j * 4 + c, { depth: .5, flat: li < 2 });
      if (tint && !PAPER.dry) { G.save(); noShadow(); G.globalAlpha = .55 - li * .15; G.fillStyle = '#120F0D'; G.fillRect(-170, -60 - n * 82, 360, n * 82 + 80); G.restore(); }
      G.restore(); }
  });
  // one bulb
  const sw = o.sway || 0; G.save(); G.translate(960 + sw * 30, 0); if (!PAPER.dry) { G.strokeStyle = '#111'; G.lineWidth = 3; G.beginPath(); G.moveTo(-sw * 30, -40); G.lineTo(0, 250); G.stroke(); }
  piece(SH.circle(18), { x: 0, y: 266, col: SA.bulb, mat: 'card', depth: .4, seed: 43900, jit: 0, edge: false }); G.restore();
  if (!PAPER.dry) glow(960 + sw * 30, 280, 900, '255,214,140', (o.light ?? 1) * .42);
}

// ---------- the tease: palace, prison, account ----------
function palaceSet(x, y, s = 1) {
  G.save(); G.translate(x, y); G.scale(s, s); const gold = '#C9A04A', cream = '#E9DFC7';
  piece(SH.rect(420, 200), { y: -100, col: cream, mat: 'card', depth: 1, seed: 44000, jit: 0 });
  piece(SH.ellipse(90, 90), { y: -230, col: gold, mat: 'card', depth: 1.1, seed: 44001, jit: 0 });
  piece(SH.rect(200, 40), { y: -205, col: cream, mat: 'card', depth: 1.2, seed: 44002, jit: 0 });
  for (const tx of [-190, 190]) { piece(SH.rect(40, 300), { x: tx, y: -150, col: cream, mat: 'card', depth: 1.2, seed: 44010 + (tx > 0), jit: 0 }); piece(SH.ellipse(26, 30), { x: tx, y: -310, col: gold, mat: 'card', depth: 1.3, seed: 44012 + (tx > 0), jit: 0 }); }
  for (let i = 0; i < 5; i++) piece(SH.round(46, 90, 22), { x: -120 + i * 60, y: -70, col: '#3A2C22', mat: 'card', depth: .2, seed: 44020 + i, jit: 0, edge: false });
  G.restore();
}
function prisonSet(x, y, s = 1) {
  G.save(); G.translate(x, y); G.scale(s, s);
  piece(SH.rect(360, 420), { y: -210, col: '#55524E', mat: 'card', depth: 1, seed: 44100, jit: 0 });
  piece(SH.rect(200, 170), { y: -270, col: '#141516', mat: 'card', depth: .2, seed: 44101, jit: 0 });
  for (let i = 0; i < 5; i++) piece(SH.rect(12, 180), { x: -80 + i * 40, y: -270, col: '#8F9396', mat: 'card', depth: 1.3, seed: 44110 + i, jit: 0 });
  piece(SH.rect(210, 12), { y: -240, col: '#8F9396', mat: 'card', depth: 1.3, seed: 44120, jit: 0 });
  G.restore();
}
function accountSet(x, y, s = 1, k = 0) {   // a vault door; k turns the wheel
  G.save(); G.translate(x, y); G.scale(s, s);
  piece(SH.rect(380, 420), { y: -210, col: '#3C4346', mat: 'card', depth: 1, seed: 44200, jit: 0 });
  piece(SH.circle(150), { y: -210, col: '#9AA2A6', mat: 'card', depth: 1.3, seed: 44201, jit: 0 });
  piece(SH.circle(118), { y: -210, col: '#7E878B', mat: 'card', depth: .3, seed: 44202, jit: 0, edge: false });
  G.save(); G.translate(0, -210); G.rotate(k * 90 * D2R);
  for (let i = 0; i < 3; i++) piece(SH.rect(14, 190), { rot: i * 60, col: '#C9A04A', mat: 'card', depth: 1.5, seed: 44210 + i, jit: 0 });
  piece(SH.circle(26), { col: '#C9A04A', mat: 'card', depth: 1.6, seed: 44220, jit: 0 }); G.restore();
  G.restore();
}

// a rubber stamp that stays out of the sepia grade (red ink is the cold open's accent)
function stampKeep(x, y, txt, k, o = {}) {
  stamp(x, y, txt, k, o);
  if (k > 0 && !PAPER.dry && G === OUT && typeof dialDio === 'function' && dialDio() > 0) {
    const c = stampCanvas(txt, o.size || 110, o.col || NC.stamp), s = k < 1 ? lerp(1.6, 1, easeIn(k)) : 1, K = DIAL.keepX;
    K.save(); K.setTransform(G.getTransform()); K.translate(x, y); K.rotate((o.rot ?? -9) * D2R); K.scale(s, s); K.globalCompositeOperation = 'source-over'; K.drawImage(c, -c.width / 2, -c.height / 2); K.restore();
    DIAL.used = true;
  }
}
