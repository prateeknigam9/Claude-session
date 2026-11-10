// open.js — Case 03 new opening test (v2): staged scenes, almost no on-screen text. Planned on the am_fenrir take
// (voice/kokoro_am_fenrir.tsv); other takes are re-timed with a warp.
EXECS.r1 = { ...EXECS.banker, seed: 9200, neck: 'tee', tie: null, shirt: '#151214', pocket: null }; EXECS.r2 = { ...EXECS.boss, seed: 9210, neck: 'tee', shirt: '#151214', earrings: false };
(() => {
  const at = (a, b) => seg(sm(T), a, b), past = a => sm(T) >= a, lt0 = a => sm(T) - a;
  const ROAD = [250, 330, 1800, 800], SLOPE = Math.atan2(ROAD[3] - ROAD[1], ROAD[2] - ROAD[0]) / D2R;   // ≈ 16.9°
  const dramatization = () => { if (!PAPER.dry) { G.save(); G.globalAlpha = .7; print('DRAMATIZATION', 1800, 1050, `700 20px ${TF.cond}`, { col: '#C9C3B4', ls: 3, align: 'right' }); G.restore(); } };
  // ---------- the office ----------
  function office(o = {}) {
    piece(SH.rect(4000, 2600), { x: 960, y: 540, col: '#1A2430', mat: 'paper', depth: 0, seed: 9000, jit: 0, edge: false });   // wall
    // window with city lights and rain
    G.save(); G.translate(1420, 330); piece(SH.rect(620, 460), { col: '#0E1520', mat: 'card', depth: .3, seed: 9001, jit: 0 });
    if (!PAPER.dry) { G.save(); G.beginPath(); G.rect(-300, -220, 600, 440); G.clip(); noShadow();
      for (let i = 0; i < 26; i++) { const x = -290 + hash(i * 3.3) * 580, h = 60 + hash(i * 1.7) * 200; G.fillStyle = '#16202C'; G.fillRect(x, 220 - h, 40 + hash(i) * 40, h); G.fillStyle = 'rgba(242,200,110,.75)'; for (let k = 0; k < 6; k++) if (hash(i * 9 + k) > .55) G.fillRect(x + 6 + (k % 2) * 16, 220 - h + 12 + Math.floor(k / 2) * 26, 8, 10); }
      G.strokeStyle = 'rgba(190,210,230,.35)'; G.lineWidth = 2; const st = onStep(T, 12);
      for (let i = 0; i < 70; i++) { const x = -300 + frac(hash(i * 5.1) + st * .013) * 600, y = -220 + frac(hash(i * 2.9) + st * .11) * 440; G.beginPath(); G.moveTo(x, y); G.lineTo(x - 6, y + 26); G.stroke(); }
      G.restore(); }
    piece(SH.rect(18, 460), { col: '#2A3440', mat: 'wood', depth: .5, seed: 9002, jit: 0 }); piece(SH.rect(620, 18), { col: '#2A3440', mat: 'wood', depth: .5, seed: 9003, jit: 0 }); G.restore();
    // clock
    G.save(); G.translate(420, 230); piece(SH.circle(78), { col: '#E9E2D0', mat: 'card', depth: 1.2, seed: 9004, jit: 0 }); const s = onStep(T, 1) % 60;
    if (!PAPER.dry) { G.save(); noShadow(); G.strokeStyle = '#1C1A1A'; G.lineWidth = 6; G.rotate(-.9); G.beginPath(); G.moveTo(0, 0); G.lineTo(0, -40); G.stroke(); G.rotate(.9 + 2.2); G.beginPath(); G.moveTo(0, 0); G.lineTo(0, -58); G.stroke(); G.restore();
      G.save(); noShadow(); G.rotate(s / 60 * TAU); G.strokeStyle = '#C8342A'; G.lineWidth = 3; G.beginPath(); G.moveTo(0, 10); G.lineTo(0, -64); G.stroke(); G.restore(); } G.restore();
    // corkboard with blurred pins behind
    piece(SH.rect(520, 340), { x: 760, y: 360, col: '#7A5A3A', mat: 'cork', depth: .4, seed: 9005, jit: 0 }); [[600, 300], [700, 420], [860, 320], [920, 450]].forEach(([x, y], i) => piece(SH.rect(110, 80), { x, y, rot: (i - 1.5) * 5, col: '#E9E2D0', mat: 'paper', depth: .6, seed: 9006 + i, jit: 0 }));
    // researchers (silhouettes from behind) and the desk
    monitor(1000, 600, 520, o.screen);
    if (!PAPER.dry) { G.save(); noShadow(); G.globalCompositeOperation = 'screen'; const g = G.createRadialGradient(1000, 600, 60, 1000, 600, 620); g.addColorStop(0, 'rgba(150,190,230,.35)'); g.addColorStop(1, 'rgba(150,190,230,0)'); G.fillStyle = g; G.fillRect(300, 0, 1400, 1200); G.restore(); }
    exec('r1', 680, 1060, 38, { style: 'silhouette', jit: 0, blink: false, lean: o.lean || 0 }); exec('r2', 1330, 1080, 36, { style: 'silhouette', jit: 0, blink: false });
    piece(SH.rect(2400, 260), { x: 960, y: 1010, col: '#3A2A20', mat: 'wood', depth: 1.6, seed: 9010, jit: 0 });
    // lamp
    piece(SH.poly([[-60, 0], [60, 0], [30, -70], [-30, -70]]), { x: 380, y: 760, col: '#2C4A3A', mat: 'card', depth: 2, seed: 9011, jit: 0 }); piece(SH.rect(12, 120), { x: 380, y: 830, col: '#2A2A2A', mat: 'card', depth: 1.9, seed: 9012, jit: 0 });
    lampGlow(380, 900, 700, { a: .3 }); if (o.papers) { for (let i = 0; i < 6; i++) piece(SH.rect(220, 280), { x: 500 + i * 60, y: 960 - i * 4, rot: (hash(i) - .5) * 30, col: '#EDE6D3', mat: 'paper', depth: 1.7 + i * .02, seed: 9013 + i, jit: 0 }); }
  }
  function monitor(x, y, w, screen) { const h = w * .62;
    piece(SH.rect(40, 140), { x, y: y + h / 2 + 50, col: '#222', mat: 'card', depth: 1.4, seed: 9020, jit: 0 }); piece(SH.round(w + 30, h + 30, 16), { x, y, col: '#181818', mat: 'card', depth: 1.5, seed: 9021, jit: 0 });
    if (PAPER.dry) return; const b = VIDB.mon || (VIDB.mon = makeCanvas(960, 540)); renderTo(b, new DOMMatrix([.5, 0, 0, .5, 0, 0]), () => { G.fillStyle = '#222'; G.fillRect(0, 0, W, H); (screen || (() => hillShot(.4, 0)))(); });
    G.save(); noShadow(); G.drawImage(b, x - w / 2, y - h / 2, w, h); G.fillStyle = 'rgba(120,170,220,.08)'; G.fillRect(x - w / 2, y - h / 2, w, h); G.restore(); }
  // the truck video. tilt = 1 → camera leveled to the road (looks flat); 0 → the true hill
  function hillShot(p, tilt, o = {}) {
    G.save(); G.translate(960, 540); G.rotate(-SLOPE * tilt * D2R); G.scale(1 + .25 * tilt, 1 + .25 * tilt); G.translate(-960, -540);
    desertSky({ sunX: 1450, sunY: 180 }); const pos = hillRoad(...ROAD, { w: 110 }), [x, y, deg] = pos(p);
    if (o.tow != null) { const [px, py, pd] = pos(o.tow), [rx, ry] = pos(p - .13); thread([[rx, ry - 50], [px + 90, py - 60]], { col: '#2B2F31', w: 4 }); pickup(px, py, .45, { rot: pd, flip: true }); }
    semi(x, y, .45, { rot: deg, spin: -p * 30, label: 'NIKOLA ONE' }); G.restore();
    if (!PAPER.dry && o.gold !== false) { G.save(); noShadow(); G.globalCompositeOperation = 'soft-light'; G.fillStyle = 'rgba(255,190,90,.35)'; G.fillRect(0, 0, W, H); G.restore(); }
  }
  // ---------- shots ----------
  function sA(t, lt) {   // 0 – 15.7: night office; evidence; push into the monitor
    const z = past(12.8) ? lerp(1.15, 4.6, easeIn(at(12.9, 15.6))) : past(7.8) ? 1.6 : past(3.3) ? lerp(1.05, 1.2, at(3.3, 7.8)) : lerp(.95, 1.05, at(0, 3.3));
    const c = past(12.8) ? [lerp(960, 1000, at(12.9, 15)), lerp(700, 640, at(12.9, 15))] : past(7.8) ? [620, 930] : [960, 640];
    camBegin(c[0], c[1], z); office({ papers: past(7.8), screen: () => hillShot(.25 + .5 * frac(lt0(0) / 6), 1) });
    if (past(7.8) && !past(12.8)) {
      popIn(at(7.9, 8.2), 480, 900, () => docPage(480, 900, 260, ['#', '…', '…', '…'], { rot: -8, seed: 9030, size: 20 }));
      if (past(9.3)) popIn(at(9.3, 9.6), 680, 880, () => { piece(SH.round(150, 260, 18), { x: 680, y: 880, rot: 6, col: '#202425', mat: 'card', depth: 2.2, seed: 9031, jit: 0 }); [0, 1, 2].forEach(i => piece(SH.round(100, 34, 12), { x: 680 + (i % 2 ? 14 : -14), y: 810 + i * 50, rot: 6, col: i % 2 ? '#46C47A' : '#E3E8EA', mat: 'card', depth: 2.3, seed: 9032 + i, jit: 0 })); });
      if (past(10.8)) popIn(at(10.8, 11.1), 860, 900, () => { polaroid(860, 900, 200, LUM.crowd(3), { caption: '', rot: 8, seed: 9036 }); piece(SH.rect(150, 40), { x: 860, y: 870, rot: 8, col: '#111', mat: 'card', depth: 2.4, seed: 9037, jit: 0 }); });
    }
    camEnd(); dramatization();
    if (past(.4) && !past(7.6)) { G.save(); G.globalAlpha = at(.4, 1.2) * (1 - at(6.8, 7.6)); print('SEPT 2020 · NEW YORK', 120, 1010, `30px ${TF.type}`, { col: '#E9E2D0', align: 'left' }); G.restore(); }
    sheetIn(at(0, .3));
  }
  function sB(t, lt) {   // 15.7 – 20.9: the video, full frame, looking flat and beautiful
    camBegin(960, 540, lerp(1.0, 1.08, at(15.7, 20.9))); hillShot(lerp(.15, .62, at(15.7, 20.9)), 1); camEnd();
    if (!PAPER.dry && frac(onStep(T, 12) * .5) < .6) { G.save(); G.fillStyle = '#FF3B30'; G.beginPath(); G.arc(70, 70, 12, 0, TAU); G.fill(); G.restore(); }
  }
  function sC(t, lt) {   // 20.9 – 30.3: the stakes land on the desk
    camBegin(lerp(760, 880, at(20.9, 30.3)), 860, 1.35); office({ papers: true, screen: () => hillShot(.25 + .5 * frac(lt0(20.9) / 6), 1) });
    const drop = (a, x, y, rot, seed, head, sub) => { if (!past(a)) return; const k = at(a, a + .5), yy = lerp(y - 700, y, easeIn(k));
      G.save(); G.translate(x, yy); G.rotate(rot * D2R); piece(SH.rect(560, 340), { col: '#E7E1D2', mat: 'news', depth: 2.6 - k * .6, seed, jit: 0 }); print(head, 0, -60, `56px ${TF.head}`, { col: CASE.ink }); print(sub, 0, 10, `30px ${TF.cond}`, { col: '#4A4440' }); for (let i = 0; i < 4; i++) piece(SH.rect(480, 8), { y: 60 + i * 24, col: '#B9B1A0', depth: .05, seed: seed + 1 + i, jit: 0, edge: false }); G.restore(); };
    drop(21.4, 640, 860, -6, 9040, '$30 BILLION', 'Nikola worth more than Ford'); drop(26.0, 1000, 880, 5, 9046, '$2 BILLION', 'General Motors buys in');
    camEnd(); dramatization(); trSlide(t, at(20.9, 21.3), { dir: 'left' });
  }
  function sD(t, lt) {   // 30.3 – 36.9: back to the video… it's not flat
    const tilt = past(34.4) ? 1 - ease(at(34.4, 35.6)) : 1;
    camBegin(960, 540, past(34.4) ? lerp(1.18, 1.0, ease(at(34.4, 35.6))) : lerp(1.0, 1.18, at(30.3, 34.4))); hillShot(.45 + .05 * at(30.3, 34.4), tilt, { gold: !past(34.4) }); camEnd();
    if (!PAPER.dry && !past(34.4) && frac(onStep(T, 12) * .5) < .6) { G.save(); G.fillStyle = '#FF3B30'; G.beginPath(); G.arc(70, 70, 12, 0, TAU); G.fill(); G.restore(); }
    if (past(34.4) && !PAPER.dry) { G.save(); G.globalAlpha = at(34.5, 35.2); G.setLineDash([16, 12]); G.strokeStyle = '#F2D45C'; G.lineWidth = 5; G.beginPath(); G.moveTo(150, 330); G.lineTo(1850, 330); G.stroke(); G.restore(); print(Math.round(SLOPE) + '°', 1700, 420, `70px ${TF.tab}`, { col: '#F2D45C', alpha: at(35.6, 36.0) }); }
  }
  function sE(t, lt) {   // 36.9 – 44.2: how: towed up, let go
    camBegin(1000, 560, .95); const tow = at(37.0, 40.4), roll = easeIn(at(41.6, 44.0));
    const p = past(41.6) ? lerp(.17, .8, roll) : lerp(.6, .17, ease(tow)); hillShot(p, 0, { tow: past(41.4) ? null : p - .23, gold: false }); camEnd();
    if (past(37.2)) statusTag(1580, 990, 'SOURCES · HINDENBURG REPORT', at(37.2, 37.5), { size: 30, rot: -2 });
    if (past(41.4) && !PAPER.dry) { G.save(); G.globalAlpha = 1 - at(42.2, 43.0); print('let go', 520, 330, `italic 60px ${TF.head}`, { col: '#FBF4E6' }); G.restore(); }
  }
  function sF(t, lt) {   // 44.2 – 53.7: the choice: a finger over PUBLISH; the giants loom
    camBegin(960, 600, lerp(1.0, 1.12, at(44.2, 53.6)));
    piece(SH.rect(4000, 2600), { x: 960, y: 540, col: '#141A22', mat: 'paper', depth: 0, seed: 9050, jit: 0, edge: false });
    if (!PAPER.dry) { G.save(); noShadow(); G.globalAlpha = .55 * at(45.9, 47.5); G.fillStyle = '#05080C'; G.fillRect(1250, 40, 260, 620); G.fillRect(1320, -60, 120, 140); for (let i = 0; i < 8; i++) G.fillRect(1180 + i * 20, 660 - i * 6, 14, 6);
      G.globalAlpha = .55 * at(47.0, 48.6); G.lineWidth = 60; G.strokeStyle = '#05080C'; G.beginPath(); G.moveTo(150, 640); G.lineTo(450, 420); G.lineTo(650, 480); G.lineTo(950, 120); G.stroke(); G.restore(); }
    piece(SH.round(1500, 420, 30), { x: 960, y: 860, col: '#20252B', mat: 'card', depth: 1.4, seed: 9051, jit: 0 });
    for (let r = 0; r < 4; r++) for (let c = 0; c < 14; c++) { const kx = 330 + c * 96, ky = 730 + r * 90; if (r === 2 && c >= 6 && c <= 8) continue; piece(SH.round(80, 74, 10), { x: kx, y: ky, col: '#3A414A', mat: 'card', depth: 1.5, seed: 9052 + r * 14 + c, jit: 0 }); }
    const press = past(54.5) ? at(54.5, 54.7) : 0; piece(SH.round(272, 74, 10), { x: 1003, y: 910 + press * 10, col: '#C8342A', keep: 1, mat: 'card', depth: 1.6 - press, seed: 9120, jit: 0 }); print('PUBLISH', 1003, 924 + press * 10, `34px ${TF.tab}`, { col: '#FBF4E6', ls: 4 });
    const hover = past(51.6) && !past(53.7) ? -60 * ease(at(51.6, 52.2)) : 0, fy = past(53.7) ? lerp(640, 860, easeIn(at(53.8, 54.5))) : 640 + hover + Math.sin(onStep(T, 12) * .6) * 6;
    piece(SH.round(70, 260, 34), { x: 1003, y: fy - 40, col: '#D9A882', mat: 'paper', depth: 2.6, seed: 9121, jit: .4 }); piece(SH.round(260, 300, 90), { x: 1040, y: fy - 290, col: '#D9A882', mat: 'paper', depth: 2.5, seed: 9122, jit: .4 }); piece(SH.rect(240, 360), { x: 1060, y: fy - 560, col: '#2C3540', mat: 'paper', depth: 2.5, seed: 9123, jit: .4 });
    camEnd(); dramatization(); trTear(t, at(44.2, 44.8));
  }
  function sG(t, lt) {   // 53.7 – 56.4: pressed; pages fly
    sF(t, lt);
    if (past(54.6)) { for (let i = 0; i < 24; i++) { const k = at(54.6 + i * .05, 55.8 + i * .05), x = lerp(1003, -200 + hash(i * 3.1) * 2300, ease(k)), y = lerp(900, -150 + hash(i * 1.7) * 700, ease(k)); if (k > 0) piece(SH.rect(220, 290), { x, y, rot: k * (hash(i) - .5) * 400, col: '#EDE6D3', mat: 'paper', depth: 3, seed: 9130 + i, jit: 0 }); }
      timeStamp(960, 160, 'SEPT 10 2020', at(54.7, 55.5), { size: 50 }); }
  }
  function sH(t, lt) {   // 56.4 – 63.1: a courtroom… a bankruptcy… a phone call
    camBegin(960, 540, 1); piece(SH.rect(4000, 2600), { x: 960, y: 540, col: '#0B0F13', mat: 'paper', depth: 0, seed: 9160, jit: 0, edge: false });
    const spot = (x, a) => { if (!past(a) || PAPER.dry) return; G.save(); noShadow(); const g = G.createRadialGradient(x, 560, 20, x, 560, 380); g.addColorStop(0, `rgba(255,236,190,${.5 * at(a, a + .3)})`); g.addColorStop(1, 'rgba(255,236,190,0)'); G.fillStyle = g; G.fillRect(x - 380, 180, 760, 760); G.restore(); };
    spot(400, 57.6); spot(960, 59.2); spot(1520, 60.6);
    if (past(57.6)) gavel(400, 640, 1.5, at(57.7, 58.3));
    if (past(59.2)) { piece(SH.rect(280, 480), { x: 960, y: 580, col: '#5C3D29', mat: 'wood', depth: 1.6, seed: 9161, jit: 0 }); statusTag(960, 560, 'BANKRUPT', at(59.4, 59.7), { size: 50, rot: -10 }); }
    if (past(60.6)) { const r = past(61.0) ? Math.sin(onStep(T, 12) * 9) * 7 : 0; G.save(); G.translate(1520, 580); G.rotate(r * D2R); G.scale(1.4, 1.4); piece(SH.round(170, 300, 26), { col: '#202425', mat: 'card', depth: 2, seed: 9162, jit: 0 }); piece(SH.round(140, 250, 18), { col: '#2C4A5A', mat: 'card', depth: .2, seed: 9163, jit: 0, edge: false }); print('☎', 0, 30, `90px ${TF.cond}`, { col: '#E9E2D0' }); G.restore(); }
    camEnd(); trSlide(t, at(56.4, 56.8), { dir: 'up' });
  }
  function sI(t, lt) {   // 63.1 – end: title
    camBegin(960, 540, lerp(.95, .9, at(63.1, 68.5))); clippingWall({ seed: 5, dim: .55 });
    redString([-200, 300], [2200, 360], at(63.1, 63.6), { pins: false, w: 6 }); labelTape(960, 330, 'THE PAPER TRAIL · CASE 03', { size: 60, rot: -2 });
    if (past(64.6)) kinetic('THE HILL', 960, 640, 200, at(64.6, 65.6), { style: 'strip', hl: [1] });
    camEnd(); trTear(t, at(63.1, 63.6));
  }
  shots([[0, sA], [15.7, sB], [20.9, sC], [30.3, sD], [36.9, sE], [44.2, sF], [53.7, sG], [56.4, sH], [63.1, sI]]);
})();
