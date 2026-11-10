// p2.js - Case 04 Part 2 "The Letter" (script-v1.md, approved). Planned timing from tools/plan.py (t0 = 4.0).
// Look dial: picks up where Part 1 left off (0.1) and drains slowly to 0.3 as the regulator closes in. On the last
// line, "And Sahara sends it.", it cuts to the trucks in the cold open's own look (0.75), which is where Part 3 starts.
// The man in Indore is a real complainant: only his envelope is shown, never a person, and he is not named.
DIAL.keys = [[0, .1], [101.8, .3], [111.4, .3], [111.5, .75]];
TRAIL.showVO = !!window.STORYBOARD_VO;
EXECS.o1 = { ...EXECS.banker, seed: 9400, neck: 'tee', tie: null, shirt: '#151214', pocket: null };
(() => {
  const at = (a, b) => seg(sm(T), a, b), past = a => sm(T) >= a;
  const tag = (txt, x = 1800, y = 1050, al = 'right') => { if (PAPER.dry) return; G.save(); G.font = `700 22px ${TF.cond}`; const w = G.measureText(txt).width + 26; G.fillStyle = 'rgba(20,16,14,.72)'; G.fillRect(al === 'right' ? x - w + 13 : x - 13, y - 26, w, 36); G.restore(); print(txt, x, y, `700 22px ${TF.cond}`, { col: '#EFE8D8', ls: 3, align: al }); };
  const dramatization = () => tag('DRAMATIZATION');
  const fadeIn = (a, b) => { const k = 1 - at(a, b); if (k <= 0 || PAPER.dry) return; G.save(); G.setTransform(1, 0, 0, 1, 0, 0); G.fillStyle = `rgba(0,0,0,${k})`; G.fillRect(0, 0, W, H); G.restore(); };
  const typed = (txt, a, b, col = '#2A2622') => { if (!past(a)) return; G.save(); G.globalAlpha = at(a, a + .8) * (1 - at(b - .8, b)); print(txt, 120, 1010, `30px ${TF.type}`, { col, align: 'left' }); G.restore(); };
  const desk = (seed, col = '#7A5634') => piece(SH.rect(6000, 4000), { x: 960, y: 540, col, mat: 'wood', depth: 0, seed, jit: 0, edge: false });
  const finger = (x, y, rot = 0) => { G.save(); G.translate(x, y); G.rotate(rot * D2R);
    piece(SH.round(64, 230, 32), { y: 80, col: '#C99A76', mat: 'paper', depth: 2.4, seed: 59000, jit: 0 }); piece(SH.round(220, 260, 80), { x: 30, y: 300, col: '#C99A76', mat: 'paper', depth: 2.3, seed: 59001, jit: 0 });
    piece(SH.rect(230, 300), { x: 40, y: 560, col: '#2E3A4E', mat: 'paper', depth: 2.3, seed: 59002, jit: 0 }); G.restore(); };

  // ---------- 0 - 4: chapter card ----------
  function card(t, lt) {
    camBegin(960, 540, lerp(1.0, 1.04, at(0, 4)));
    piece(SH.rect(5000, 3000), { x: 960, y: 540, col: '#141110', mat: 'paper', depth: 0, seed: 59100, jit: 0, edge: false });
    blackPanel(960, 540, 1180, 360, { rot: 1.2, seed: 59101, after: () => { print('CASE FILE 2 / 4', 0, -60, `700 40px ${TF.cond}`, { col: '#D9A441', ls: 8 }); print('THE LETTER', 0, 70, `130px ${TF.tab}`, { col: '#F3ECDD' }); } });
    camEnd(); fadeIn(0, .8);
  }
  // ---------- 4.0 - 17.6: the share-sale filing lands; pages turn ----------
  function filing(t, lt) {
    camBegin(960, 560, lerp(1.0, 1.12, at(4, 17.6)));
    desk(59200);
    const k = easeIn(at(5.4, 6.0)), s = lerp(1.6, 1, k);
    if (past(5.4)) { G.save(); G.translate(960, 560); G.scale(s, s); G.translate(-960, -560);
      for (let i = 0; i < 12; i++) piece(SH.rect(760, 980), { x: 960 + i * 1.5, y: 560 - i * 3, col: '#EFE8D6', mat: 'paper', depth: .3, seed: 59210 + (i % 4), jit: 0 });
      piece(SH.rect(760, 980), { x: 960, y: 524, col: '#F6F1E6', mat: 'paper', depth: .6, seed: 59220, jit: 0 });
      fakeText(630, 110, 660, 46, 17, 59221 + Math.floor(Math.max(0, sm(T) - 10.5) / 1.3), { alpha: .5 });
      if (past(10.5)) { const p = frac((sm(T) - 10.5) / 1.3); if (p < .5) { G.save(); G.translate(960, 524); G.scale(1 - 2 * ease(p * 2), 1); piece(SH.rect(380, 980), { x: 190, col: '#FAF6EC', mat: 'paper', depth: 1.4, seed: 59230, jit: 0 }); G.restore(); } }
      G.restore(); }
    camEnd(); typed('SEPT 2009', 4.2, 9.5);
    trTear(t, at(4.0, 4.5));
  }
  // ---------- 17.6 - 28.7: somewhere inside, one line ----------
  function line(t, lt) {
    camBegin(960, 540, lerp(1.0, 1.25, ease(at(17.6, 28.4))));
    desk(59300);
    piece(SH.rect(1500, 1300), { x: 960, y: 600, col: '#F6F1E6', mat: 'paper', depth: .4, seed: 59301, jit: 0 });
    fakeText(320, 0, 1280, 40, 26, 59302, { alpha: .5 });
    const fy = past(20.9) ? lerp(200, 620, easeOut(at(20.9, 22.4))) : 200;
    if (past(24.5)) { highlighter(330, 612, 1180, 30, at(24.5, 25.8), {}); markerCircle(920, 622, 650, 60, at(26.0, 27.2), {}); }
    if (past(19.0)) finger(lerp(1500, 1240, easeOut(at(19.0, 19.8))), fy + 30, -20);
    camEnd();
  }
  // ---------- 28.7 - 40.4: the complaints arrive ----------
  function letters(t, lt) {
    camBegin(960, 560, 1.0);
    desk(59400);
    if (past(31.8)) typedLetter(lerp(-500, 640, easeOut(at(31.8, 32.6))), 470, 560, { rot: -6 });
    if (past(35.2)) indoreLetter(lerp(2500, 1220, easeOut(at(35.2, 36.0))), 620, 720, { rot: 5, k: at(36.2, 39.6) });
    camEnd();
  }
  // ---------- 40.4 - 54.9: passed from one desk to another; the question ----------
  function passed(t, lt) {
    if (past(46.2)) {   // the letter, open: lines of Hindi handwriting
      camBegin(960, 540, lerp(1.05, 1.22, at(46.2, 54.9)));
      desk(59500);
      piece(SH.rect(1100, 1300), { x: 960, y: 560, rot: -2, col: '#EEE4C8', mat: 'paper', depth: .8, seed: 59501, jit: 0 });
      for (let i = 0; i < 18; i++) piece(SH.rect(1000, 2), { x: 960, y: 60 + i * 56, rot: -2, col: '#C9BFA4', mat: 'card', depth: 0, seed: 59510 + (i % 3), jit: 0, edge: false });
      hindiScribble(470, 110, 960, 15, { lh: 56, rot: -2, seed: 21, k: at(46.4, 53.2), lw: 3.5 });
      camEnd(); return;
    }
    camBegin(960, 560, .9);
    piece(SH.rect(6000, 4000), { x: 960, y: 540, col: '#D9C9A8', mat: 'paper', depth: 0, seed: 59520, jit: 0, edge: false });
    for (const [dx, name, sd] of [[420, 'NATIONAL HOUSING BANK', 59530], [1500, 'MARKET REGULATOR', 59540]]) {
      piece(SH.rect(820, 420), { x: dx, y: 780, col: '#7A5634', mat: 'wood', depth: 1.2, seed: sd, jit: 0 });
      piece(SH.rect(300, 54), { x: dx, y: 600, col: '#2A2622', mat: 'card', depth: 1.5, seed: sd + 1, jit: 0 });
      print(name, dx, 610, `700 20px ${TF.cond}`, { col: '#E9E2D0', ls: 2 }); }
    const k = ease(at(41.2, 44.6)); indoreLetter(lerp(420, 1500, k), 700 - Math.sin(k * Math.PI) * 160, 300, { rot: lerp(-4, 6, k), depth: 2 });
    camEnd();
  }
  // ---------- 54.9 - 62.4: the regulator asks; the answer: none of your business ----------
  function asks(t, lt) {
    camBegin(960, 560, 1.0);
    desk(59600);
    if (!past(57.4)) docPage(lerp(960, 2400, easeIn(at(55.6, 57.2))), 560, 620, ['#Letter', '…', '…', '…', '…'], { rot: -4, seed: 59601 });
    if (past(58.2)) docPage(lerp(-600, 900, easeOut(at(58.2, 59.0))), 560, 620, ['#Reply', '…', '…'], { rot: 6, seed: 59610, col: '#EDE6D2' });
    if (past(60.4)) { const k = easeIn(at(60.4, 60.9)); piece(SH.rect(1400, 1600), { x: lerp(2700, 1700, k), y: 540, col: '#5A3A28', mat: 'wood', depth: 2.6, seed: 59620, jit: 0 });   // a door, shut
      piece(SH.circle(26), { x: lerp(2700, 1700, k) - 600, y: 560, col: '#C9A04A', mat: 'card', depth: 2.8, seed: 59621, jit: 0 }); }
    camEnd();
  }
  // ---------- 62.4 - 74.8: a private offer... to about three crore people ----------
  function offer(t, lt) {
    const z = lerp(2.3, .11, ease(at(63.0, 73.6)));
    camBegin(960, 600, z);
    piece(SH.rect(80000, 50000), { x: 960, y: 600, col: '#E8D7B4', mat: 'paper', depth: 0, seed: 59700, jit: 0, edge: false });
    if (z < 1.6) { const n = Math.round(lerp(4, 39, clamp((1.6 - z) / 1.5))), ny = Math.ceil(n * .6);   // covers the frame at the widest
      for (let gy = -ny; gy <= ny; gy++) for (let gx = -n; gx <= n; gx++) { if (Math.abs(gx) + Math.abs(gy) < 2) continue; chair(960 + gx * 240, 640 + gy * 220, 1, 59710 + ((gx + gy) & 3) * 3, { flat: true, col: ['#8C5B3E', '#7A5634', '#9A6A48'][(gx * 7 + gy * 3 + 300) % 3] }); } }
    piece(SH.ellipse(120, 50), { x: 960, y: 640, col: '#6B4A30', mat: 'wood', depth: 1, seed: 59720, jit: 0 });
    chair(860, 700, 1, 59730); chair(1060, 700, 1, 59733);
    camEnd();
  }
  // ---------- 74.8 - 86.6: the order, the appeals, up to the Supreme Court ----------
  function appeals(t, lt) {
    camBegin(lerp(700, 1200, ease(at(74.8, 86.6))), lerp(700, 460, ease(at(74.8, 86.6))), .85);
    piece(SH.rect(6000, 4000), { x: 960, y: 540, col: '#2F4A85', mat: 'paper', depth: 0, seed: 59800, jit: 0, edge: false });
    appealStairs(900, 1100, 1.0);
    const step = past(83.3) ? 2 : past(81.6) ? 1 : 0, k = step === 0 ? 1 : easeOut(at(step === 1 ? 81.6 : 83.3, (step === 1 ? 81.6 : 83.3) + .5));
    const pos = i => [480 + i * 420, 1100 - 140 * (i + 1) - 150], [x0, y0] = pos(Math.max(0, step - 1)), [x1, y1] = pos(step);
    docPage(lerp(x0, x1, k), lerp(y0, y1, k) - Math.sin(k * Math.PI) * 120, 200, ['#Order', '…', '…', '…'], { rot: -5, seed: 59810 });
    if (past(83.3)) popIn(at(83.6, 84.1), 1320, 560, () => courtBuilding(1320, 560, .45));
    camEnd(); if (past(75.0) && !past(81.4)) timeStamp(1620, 160, '2011', at(76.6, 77.4), { size: 44 });
  }
  // ---------- 86.6 - 101.8: the Supreme Court, August 2012 ----------
  function court(t, lt) {
    camBegin(960, lerp(560, 600, at(86.6, 101.8)), lerp(.95, 1.08, at(86.6, 101.8)));
    piece(SH.rect(6000, 4000), { x: 960, y: 400, col: '#5E6C78', mat: 'paper', depth: 0, seed: 59900, jit: 0, edge: false });
    courtBuilding(960, 1000, 1.25);
    if (past(97.0)) gavel(1330, 860, 1.0, at(97.2, 97.8));
    camEnd(); rain(.7); typed('AUG 2012', 86.8, 92.0, '#EFE8D8');
  }
  // ---------- 101.8 - 111.5: "they just have to find the investors"; they ask for the list ----------
  function ask(t, lt) {
    camBegin(960, 620, lerp(1.0, 1.1, at(101.8, 111.5)));
    piece(SH.rect(6000, 4000), { x: 960, y: 500, col: '#2A2622', mat: 'paper', depth: 0, seed: 60000, jit: 0, edge: false });
    if (!PAPER.dry) glow(980, 640, 700, '255,220,150', .45);
    exec('o1', 960, 1120, 40, { style: 'silhouette', jit: 0, blink: false });
    piece(SH.rect(2400, 400), { x: 960, y: 1110, col: '#4A3426', mat: 'wood', depth: 1.4, seed: 60001, jit: 0 });
    if (past(107.6)) docPage(lerp(960, 2500, easeIn(at(108.6, 109.8))), 900, 420, ['#Request', '…', '…', '…'], { rot: -3, seed: 60010, depth: 1.8 });
    camEnd(); dramatization();
  }
  // ---------- 111.5 - end: and Sahara sends it (the trucks, in the cold open's look) ----------
  function sends(t, lt) {
    camBegin(960, 560, lerp(1.0, 1.05, at(111.5, 116.5)));
    nightStreet();
    lorry(lerp(1500, 1100, easeOut(at(111.5, 113.5))), 900, .95, { left: true, lights: true, seed: 41000 });
    camEnd(); rain(1); dramatization();
  }
  shots([[0, card], [4.0, filing], [17.6, line], [28.7, letters], [40.4, passed], [54.9, asks], [62.4, offer], [74.8, appeals], [86.6, court], [101.8, ask], [111.5, sends]]);
})();
