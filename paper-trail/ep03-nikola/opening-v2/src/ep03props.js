// ep03props.js — Case 03 (Nikola) pieces, 16:9. Generic puppets only, no likenesses; no real logos ("NIKOLA", "GM", "FORD" only as plain type).
EXECS.milton = { seed: 4600, build: 'avg', skin: '#E6B994', suit: '#2C3540', suit2: '#252D37', shirt: '#E9ECEE', neck: 'open', hair: 'slick', hairCol: '#3A2A1E', beard: true, iris: '#4A3424', lip: '#B06E60' };
EXECS.tesla = { seed: 4700, build: 'slim', skin: '#E9D9C2', suit: '#2A2A2A', suit2: '#222', shirt: '#EEE', neck: 'tie', tie: '#222', hair: 'slick', hairCol: '#1E1A18', tache: true, iris: '#3A3A3A', lip: '#A87060' };
STATUS.GUILTY = '#8E2019'; STATUS.PROSECUTORS = '#2E5C8A'; STATUS.PROMISED = '#5E6B70'; STATUS.BILLIONAIRE = '#9A7A1E'; STATUS.REPORT = '#5E6B70'; STATUS.CRITICS = '#5E6B70';
const milton = (x, y, u, o = {}) => exec('milton', x, y, u, o);

// semi(x, y, s, { flip, rot, cutaway, label, seed }) — the white hydrogen semi (side view, ground point x,y, facing right).
// cutaway 0..1 lifts the side panel off: an EMPTY engine bay (dashed outline, a few loose wires).
function semi(x, y, s = 1, o = {}) {
  const S = o.seed || 4800; G.save(); G.translate(x, y); G.rotate((o.rot || 0) * D2R); G.scale(o.flip ? -s : s, s);
  piece(SH.rect(860, 56), { x: -40, y: -100, col: '#2B2F31', mat: 'card', depth: 1.2, seed: S, jit: 0 });   // chassis
  piece(SH.round(120, 60, 20), { x: -260, y: -150, col: '#B9C2C4', mat: 'card', depth: 1.3, seed: S + 7, jit: 0 });   // H2 tank
  piece(SH.rect(160, 26), { x: -390, y: -140, col: '#3A3F42', mat: 'card', depth: 1.25, seed: S + 8, jit: 0 });   // fifth wheel
  const body = SH.smooth([[-190, -80, 1], [-190, -560, 1], [40, -590], [200, -560], [330, -330], [370, -130], [360, -80, 1]]);
  piece(body, { col: '#F1F2EF', mat: 'card', depth: 1.5, seed: S + 1, jit: 0 });
  piece(SH.smooth([[150, -530, 1], [215, -510], [310, -330], [150, -330, 1]]), { col: '#26323A', mat: 'card', depth: .3, seed: S + 2, jit: 0 });   // window
  piece(SH.rect(540, 22), { x: 85, y: -280, col: '#C9CED0', mat: 'card', depth: .2, seed: S + 3, jit: 0 });   // stripe
  piece(SH.smooth([[330, -170], [372, -148], [366, -120], [325, -132]]), { col: '#F2D45C', mat: 'card', depth: .2, seed: S + 4, jit: 0 });   // lamp
  if (o.label !== false) { G.save(); if (o.flip) G.scale(-1, 1); print(o.label || 'NIKOLA ONE', o.flip ? 30 : -30, -420, `46px ${TF.tab}`, { col: '#2A3A40', ls: 4 }); G.restore(); }
  const ck = clamp(o.cutaway || 0);
  if (ck > 0) {   // the panel slides up and away; behind it: nothing
    G.save(); G.globalAlpha = ck; piece(SH.rect(330, 170), { x: 120, y: -170, col: '#20272B', mat: 'card', depth: .1, seed: S + 5, jit: 0 }); G.restore();
    if (!PAPER.dry && ck > .5) { G.save(); noShadow(); G.setLineDash([16, 12]); G.strokeStyle = '#F2D45C'; G.lineWidth = 5; G.strokeRect(-30, -245, 300, 150); G.setLineDash([]); G.restore();
      thread([[-10, -110], [30, -170], [60, -130]], { col: '#C8342A', w: 4 }); thread([[240, -110], [210, -190], [250, -200]], { col: '#46C47A', w: 4 });
      G.save(); if (o.flip) G.scale(-1, 1); print('EMPTY', o.flip ? -120 : 120, -150, `56px ${TF.tab}`, { col: '#F2D45C', ls: 6, alpha: seg(ck, .5, 1) }); G.restore(); }
    piece(SH.rect(330, 170), { x: 120 + ck * 120, y: -170 - ck * 380, rot: ck * -14, col: '#E5E7E3', mat: 'card', depth: 1.5 + ck * 1.5, seed: S + 6, jit: 0 });
  }
  const spin = (o.spin || 0);
  [-380, -240, 250].forEach((wx, i) => { G.save(); G.translate(wx, -70); G.rotate(spin); piece(SH.circle(72), { col: '#1A1C1D', mat: 'card', depth: 1.4, seed: S + 10 + i, jit: 0 });
    piece(SH.circle(34), { col: '#9AA7AD', mat: 'card', depth: .3, seed: S + 14 + i, jit: 0 }); piece(SH.rect(8, 50), { col: '#5E676A', depth: .1, seed: S + 18 + i, jit: 0, edge: false }); G.restore(); });
  G.restore();
}
// hillRoad(x0, y0, x1, y1, { w, seed }) — a desert road strip from (x0,y0) to (x1,y1) with a dashed centre line; returns pos(p) → [x, y, deg]
function hillRoad(x0, y0, x1, y1, o = {}) {
  const ang = Math.atan2(y1 - y0, x1 - x0), L = Math.hypot(x1 - x0, y1 - y0), w = o.w || 120;
  G.save(); G.translate((x0 + x1) / 2, (y0 + y1) / 2); G.rotate(ang);
  piece(SH.rect(L + 3000, 1400), { y: 700 + w / 2, col: '#C9A26E', mat: 'kraft', depth: .6, seed: (o.seed || 4900), jit: 0 });   // ground below the road
  piece(SH.rect(L + 3000, w), { col: '#4A4E50', mat: 'card', depth: .8, seed: (o.seed || 4900) + 1, jit: 0 });
  if (!PAPER.dry) { G.save(); noShadow(); G.fillStyle = '#E9C94A'; for (let d = -L / 2 - 1500; d < L / 2 + 1500; d += 110) G.fillRect(d, -4, 60, 8); G.restore(); }
  G.restore();
  return p => [lerp(x0, x1, p), lerp(y0, y1, p) - w * .1, ang / D2R];
}
// desertSky() — screen-wide dusk sky + mesas (draw first, inside the camera)
function desertSky(o = {}) {
  piece(SH.rect(7000, 3600), { x: 960, y: 300, col: '#EFC68C', mat: 'paper', depth: 0, seed: 4909, jit: 0, edge: false });
  sun(o.sunX ?? 1500, o.sunY ?? 260, 90);
  hills(960, 640, 3400, 380, '#B97E52', { seed: 4910, bumps: 4, depth: .3 });
  hills(960, 720, 3400, 300, '#A36A44', { seed: 4911, bumps: 3, depth: .45 });
}
// tripodCam(x, y, s, { rec }) — a camera on a tripod, ground point x,y
function tripodCam(x, y, s = 1, o = {}) {
  G.save(); G.translate(x, y); G.scale(s, s);
  [[-70, 0], [0, 10], [70, 0]].forEach(([dx, dy], i) => thread([[0, -210], [dx, dy]], { col: '#2B2F31', w: 9 }));
  piece(SH.round(170, 110, 14), { y: -270, col: '#2B2F31', mat: 'card', depth: 1.6, seed: 4920, jit: 0 });
  piece(SH.circle(42), { x: -110, y: -270, col: '#46525A', mat: 'card', depth: 1.7, seed: 4921, jit: 0 });
  piece(SH.rect(70, 60), { x: -85, y: -270, col: '#2B2F31', mat: 'card', depth: 1.6, seed: 4922, jit: 0 });
  if (o.rec && !PAPER.dry && frac(onStep(T, 12) * .5) < .6) { G.save(); noShadow(); G.fillStyle = '#FF3B30'; G.beginPath(); G.arc(55, -300, 13, 0, TAU); G.fill(); G.restore(); }
  G.restore();
}
// pickup(x, y, s) — a small paper tow pickup (side view, facing right)
function pickup(x, y, s = 1, o = {}) {
  G.save(); G.translate(x, y); G.rotate((o.rot || 0) * D2R); G.scale(o.flip ? -s : s, s);
  piece(SH.smooth([[-220, -50, 1], [-220, -150, 1], [-20, -150, 1], [30, -250, 1], [150, -250], [200, -150], [230, -110], [230, -50, 1]]), { col: o.col || '#6F8A93', mat: 'card', depth: 1.4, seed: 4930, jit: 0 });
  piece(SH.poly([[45, -235], [140, -235], [180, -160], [45, -160]]), { col: '#26323A', mat: 'card', depth: .2, seed: 4931, jit: 0 });
  [-140, 140].forEach((wx, i) => piece(SH.circle(48), { x: wx, y: -50, col: '#1A1C1D', mat: 'card', depth: 1.3, seed: 4932 + i, jit: 0 }));
  G.restore();
}
// videoFrame(x, y, w, title, drawFn, { k, play, rot, seed }) — a "posted video" card: drawFn renders a 1920×1080 frame into it
const VIDB = {};
function videoFrame(x, y, w, title, drawFn, o = {}) {
  const k = o.k ?? 1; if (k <= 0 || PAPER.dry) return; const h = w * 9 / 16, b = VIDB[o.key || 'v'] || (VIDB[o.key || 'v'] = makeCanvas(960, 540));
  renderTo(b, new DOMMatrix([.5, 0, 0, .5, 0, 0]), () => { G.fillStyle = '#777'; G.fillRect(0, 0, W, H); drawFn(); });
  popIn(k, x, y, () => { G.save(); G.translate(x, y); G.rotate((o.rot ?? -1.5) * D2R);
    piece(SH.rect(w + 24, h + 90), { y: 33, col: '#F6F6F2', mat: 'card', depth: 1.8, seed: o.seed || 4940, jit: 0 });
    G.save(); noShadow(); G.drawImage(b, -w / 2, -h / 2, w, h); G.restore();
    if (o.play !== false) { G.save(); noShadow(); G.fillStyle = 'rgba(0,0,0,.45)'; G.beginPath(); G.arc(0, 0, w * .07, 0, TAU); G.fill(); G.fillStyle = '#FFF'; G.beginPath(); G.moveTo(-w * .022, -w * .035); G.lineTo(w * .04, 0); G.lineTo(-w * .022, w * .035); G.closePath(); G.fill(); G.restore(); }
    print(title, -w / 2 + 14, h / 2 + 52, `700 ${w * .045}px ${TF.cond}`, { align: 'left', col: CASE.ink });
    G.restore(); });
}
// slip(x, y, w, head, body, { k, rot, stamp, seed }) — a reservation slip / order form
function slip(x, y, w, head, body, o = {}) {
  const k = o.k ?? 1; if (k <= 0) return; popIn(k, x, y, () => {
    pinCard(x, y, w, w * .62, { col: '#F4EFE2', mat: 'paper', rot: o.rot ?? 0, seed: o.seed || 4950, pin: false, draw: (cw, ch) => {
      print(head, 0, -ch * .22, `${cw * .1}px ${TF.tab}`, { col: CASE.ink, ls: 3 });
      print(body, 0, ch * .02, `${cw * .07}px ${TF.type}`, { col: '#5A5650' });
      if (!PAPER.dry) { G.save(); G.strokeStyle = 'rgba(40,40,40,.35)'; G.lineWidth = 2; G.beginPath(); G.moveTo(-cw * .38, ch * .22); G.lineTo(cw * .38, ch * .22); G.stroke(); G.restore(); }
    } }); });
  if (o.stamp) statusTag(x + w * .1, y + w * .1, o.stamp, o.stampK ?? 1, { size: w * .1, rot: -8 });
}
// portraitOval(x, y, w, name, sub, { k, rot, seed }) — a sepia period cut-out portrait (generic silhouette, not a likeness)
function portraitOval(x, y, w, name, sub, o = {}) {
  const k = o.k ?? 1; if (k <= 0) return; popIn(k, x, y, () => {
    G.save(); G.translate(x, y); G.rotate((o.rot ?? 3) * D2R);
    piece(SH.rect(w, w * 1.35), { col: '#E7DCC2', mat: 'card', depth: 1.6, seed: o.seed || 4960, jit: 0 });
    piece(SH.ellipse(w * .38, w * .48), { y: -w * .1, col: '#B79E77', mat: 'paper', depth: .3, seed: (o.seed || 4960) + 1, jit: 0 });
    G.save(); G.beginPath(); G.ellipse(0, -w * .1, w * .38, w * .48, 0, 0, TAU); G.clip(); exec('tesla', 0, w * 1.05, w * .12, { style: 'silhouette', jit: 0, blink: false }); G.restore();
    print(name, 0, w * .5, `${w * .1}px ${TF.tab}`, { col: CASE.ink, ls: 2 }); print(sub, 0, w * .59, `${w * .055}px ${TF.cond}`, { col: '#5A5650' });
    G.restore(); });
}
// h2Drop(x, y, s, k) — a water drop labelled H₂O
function h2Drop(x, y, s = 1, k = 1) { if (k <= 0) return; popIn(k, x, y, () => { piece(SH.drop(60 * s), { x, y, col: '#7FB7D6', mat: 'tissue', depth: 1.6, seed: 4970, jit: 0 }); print('H₂O', x, y + 100 * s, `${36 * s}px ${TF.tab}`, { col: '#CFE6F2' }); }); }
