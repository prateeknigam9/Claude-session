// open.js - Case 04 cold open "127 Trucks" (script-v1.md, approved 2026-11-10). Planned timing from tools/plan.py.
// Staged scenes, almost no on-screen text. The regulator's street, warehouse and desk are reconstructions (DRAMATIZATION).
// Look dial: the whole cold open sits at 0.75 (night, sepia newsprint). The forms, the red stamps and the tail lights are
// the accents, kept out of the grade: the names are the point. Part 1 opens bright (0) in Gorakhpur.
DIAL.keys = [[0, .75]];
TRAIL.showVO = !!window.STORYBOARD_VO;
EXECS.o1 = { ...EXECS.banker, seed: 9400, neck: 'tee', tie: null, shirt: '#151214', pocket: null };
(() => {
  const at = (a, b) => seg(sm(T), a, b), past = a => sm(T) >= a;
  const dramatization = () => { if (!PAPER.dry) { G.save(); G.globalAlpha = .7; print('DRAMATIZATION', 1800, 1050, `700 20px ${TF.cond}`, { col: '#C9C3B4', ls: 3, align: 'right' }); G.restore(); } };
  const fadeIn = (a, b) => { const k = 1 - at(a, b); if (k <= 0 || PAPER.dry) return; G.save(); G.setTransform(1, 0, 0, 1, 0, 0); G.fillStyle = `rgba(0,0,0,${k})`; G.fillRect(0, 0, W, H); G.restore(); };

  // ---------- the street: lorries pull in, one after another (0 - 7.5) ----------
  function street(t, lt) {
    camBegin(lerp(900, 980, at(0, 7.5)), 560, lerp(1.0, 1.06, at(0, 7.5)));
    nightStreet();
    // three lorries arrive from the right and stop in a queue; the next pair of headlights is already coming
    [[0.4, 980], [2.6, 1560], [4.8, 2140]].forEach(([a, stop], i) => {
      const k = easeOut(at(a, a + 2.4)), x = lerp(2700 + i * 300, stop, k);
      lorry(x, 900, .95, { left: true, lights: true, seed: 41000 + i * 50, col: [SA.lorry, '#B2452E', '#C9A13A'][i] });
    });
    if (past(6.2)) glow(2050, 760, 60, '255,240,200', .8 * at(6.2, 6.8));
    camEnd(); rain(1); dramatization();
    if (past(.6)) { G.save(); G.globalAlpha = at(.6, 1.4) * (1 - at(6.6, 7.4)); print('JAN 2013 · MUMBAI', 120, 1010, `30px ${TF.type}`, { col: '#E9E2D0', align: 'left' }); G.restore(); }
    fadeIn(0, .8);
  }
  // ---------- high and wide: headlights all the way down the road (7.5 - 11.9) ----------
  function road(t, lt) {
    camBegin(960, 540, lerp(1.0, .94, at(7.5, 11.9)));
    piece(SH.rect(5000, 3000), { x: 960, y: 300, col: SA.sky, mat: 'paper', depth: 0, seed: 45000, jit: 0, edge: false });
    for (let i = 0; i < 22; i++) { const w = 60 + hash(i * 2.3) * 120, h = 40 + hash(i * 4.1) * 150; piece(SH.rect(w, h), { x: -100 + i * 100, y: 470 - h / 2, col: mixCol(SA.night, SA.facade, .4), mat: 'card', depth: .1, seed: 45010 + i, jit: 0, edge: false }); }
    piece(SH.poly([[-400, 1180], [2320, 1180], [1000, 470], [920, 470]]), { col: '#2A3238', mat: 'paper', depth: .2, seed: 45100, jit: 0 });
    for (let k = 0; k < 18; k++) { const u0 = 1 / (1 + k * .55), u1 = 1 / (1 + (k + .45) * .55), x0 = lerp(960, 760, u0), x1 = lerp(960, 760, u1), y0 = lerp(470, 1180, u0), y1 = lerp(470, 1180, u1);
      piece(SH.poly([[x0 - 9 * u0, y0], [x0 + 9 * u0, y0], [x1 + 9 * u1, y1], [x1 - 9 * u1, y1]], 'dash' + k), { col: '#C9C2AE', mat: 'card', depth: 0, seed: 45200 + k, jit: 0, edge: false }); }
    if (!PAPER.dry) {
      const run = onStep(T, 12) * .35;
      for (let k = 0; k < 46; k++) { const z = k - frac(run); if (z < 0) continue; const u = 1 / (1 + z * .22), y = lerp(470, 1120, u), xc = lerp(960, 1180, u), sp = 150 * u, r = 3 + 18 * u;
        glow(xc - sp / 2, y, r * 5, '255,236,190', .5); glow(xc + sp / 2, y, r * 5, '255,236,190', .5);
        G.save(); noShadow(); G.fillStyle = '#FFF3D0'; for (const dx of [-sp / 2, sp / 2]) { G.beginPath(); G.arc(xc + dx, y, r * .5, 0, TAU); G.fill(); } G.restore(); }
    }
    camEnd(); rain(.8); dramatization();
  }
  // ---------- the shutter rolls up: cartons floor to roof (11.9 - 19.4) ----------
  function shutter(t, lt) {
    const z = past(13.6) ? lerp(1.15, 2.1, ease(at(13.6, 19.2))) : 1.15;
    camBegin(960, lerp(640, 600, at(11.9, 19.4)), z);
    piece(SH.rect(5000, 3000), { x: 960, y: 400, col: '#101418', mat: 'paper', depth: 0, seed: 46000, jit: 0, edge: false });
    piece(SH.rect(5000, 500), { x: 960, y: 1180, col: SA.street, mat: 'paper', depth: .2, seed: 46001, jit: 0, edge: false });
    lorryRear(960, 1000, 1.4, ease(at(12.0, 13.4)));
    if (!PAPER.dry) glow(960, 560, 700, '255,214,150', .18 * at(12.6, 13.6));
    camEnd(); rain(.7); dramatization();
  }
  // ---------- one form; then the pull back: it's one of millions (19.4 - 30.8) ----------
  function forms(t, lt) {
    const pull = ease(at(25.2, 30.4)), z = lerp(1.12, .11, pull);
    camBegin(960, 540, z);
    piece(SH.rect(30000, 20000), { x: 960, y: 540, col: SA.desk, mat: 'wood', depth: 0, seed: 47000, jit: 0, edge: false });
    if (pull > .02) { for (let gy = -9; gy <= 9; gy++) for (let gx = -13; gx <= 13; gx++) { if (!gx && !gy) continue;
      form(960 + gx * 600 + (gy % 2) * 120, 540 + gy * 760, 520, { simple: true, rot: (hash(gx * 3.7 + gy) - .5) * 8, seed: 47100 + ((gy + 9) * 7 + gx + 13) % 12, depth: Math.abs(gx) + Math.abs(gy) < 3 ? .8 : 0, keep: 1 }); } }
    const sl = easeOut(at(19.5, 20.4));
    form(lerp(2400, 960, sl), 540, 520, { rot: lerp(14, -3, sl), seed: 42000, keep: 1 });
    camEnd();
    if (!PAPER.dry) { G.save(); noShadow(); G.globalCompositeOperation = 'multiply'; const g = G.createRadialGradient(960, 520, 200, 960, 540, 1100); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(1, `rgba(40,28,18,${.85 - .4 * pull})`); G.fillStyle = g; G.fillRect(0, 0, W, H); G.restore(); }
    dramatization(); trSlide(t, at(19.4, 19.8), { dir: 'left' });
  }
  // ---------- the warehouse: "one job now"; then the one problem (30.8 - 41.5) ----------
  function store(t, lt) {
    camBegin(960, 600, lerp(1.0, 1.14, at(30.8, 41.5)));
    const flick = past(38.1) && !past(38.5) ? (onStep(T, 12) % 2 ? .25 : .6) : 1;
    warehouse({ sway: Math.sin(onStep(T, 12) * .9) * .3, light: flick });
    exec('o1', 960, 1180, 44, { style: 'silhouette', jit: 0, blink: false });
    camEnd(); dramatization();
  }
  // ---------- envelopes come back, stamped (41.5 - 45.5) ----------
  function returned(t, lt) {
    camBegin(960, 560, lerp(1.0, 1.08, at(41.5, 45.5)));
    piece(SH.rect(5000, 3000), { x: 960, y: 540, col: SA.desk, mat: 'wood', depth: 0, seed: 48000, jit: 0, edge: false });
    let a = 41.6, gap = .9;
    for (let i = 0; i < 16 && a < 45.4; i++) {
      if (past(a)) { const k = easeOut(at(a, a + .3)), q = rnd('env' + i), ex = 960 + (q() - .5) * 360, ey = 560 + (q() - .5) * 220, rot = (q() - .5) * 30;
        envelope(lerp(2300, ex, k), lerp(-300, ey, k), 380, { rot, seed: 48100 + i * 3, depth: 1.2 + i * .02 });
        G.save(); G.translate(ex, ey); G.rotate(rot * D2R); stampKeep(0, 0, 'UNTRACEABLE', at(a + .28, a + .4), { size: 52, rot: -12 }); G.restore(); }
      a += gap; gap = Math.max(.16, gap * .72);
    }
    camEnd(); dramatization();
  }
  // ---------- the tease: a palace... a prison... an account (45.5 - 56.3) ----------
  function tease(t, lt) {
    camBegin(960, 560, lerp(1.0, .97, at(45.5, 56.3)));
    piece(SH.rect(5000, 3000), { x: 960, y: 540, col: '#0B0F13', mat: 'paper', depth: 0, seed: 49000, jit: 0, edge: false });
    const spot = (x, a) => { if (!past(a) || PAPER.dry) return; G.save(); noShadow(); const g = G.createRadialGradient(x, 600, 20, x, 600, 400); g.addColorStop(0, `rgba(255,236,190,${.5 * at(a, a + .3)})`); g.addColorStop(1, 'rgba(255,236,190,0)'); G.fillStyle = g; G.fillRect(x - 400, 180, 800, 840); G.restore(); };
    spot(400, 49.6); spot(960, 50.8); spot(1520, 53.0);
    if (past(49.6)) popIn(at(49.6, 50.0), 400, 760, () => palaceSet(400, 820, 1.05));
    if (past(50.8)) popIn(at(50.8, 51.2), 960, 760, () => prisonSet(960, 820, 1.05));
    if (past(53.0)) popIn(at(53.0, 53.4), 1520, 760, () => accountSet(1520, 820, 1.0, ease(at(53.4, 55.8))));
    camEnd();
  }
  // ---------- the title (56.3 - end) ----------
  function title(t, lt) {
    camBegin(960, 540, lerp(.95, .9, at(56.3, 65)));
    clippingWall({ seed: 11, dim: .55 });
    redString([-200, 300], [2200, 360], at(56.3, 56.8), { pins: false, w: 6 });
    labelTape(960, 330, 'THE PAPER TRAIL · CASE 04', { size: 60, rot: -2 });
    if (past(58.2)) kinetic('THREE CRORE|NAMES', 960, 640, 170, at(58.2, 59.4), { style: 'strip', hl: [2] });
    camEnd(); trTear(t, at(56.3, 56.8));
  }
  shots([[0, street], [7.5, road], [11.9, shutter], [19.4, forms], [30.8, store], [41.5, returned], [45.5, tease], [56.3, title]]);
})();
