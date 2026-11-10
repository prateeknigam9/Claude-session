// p1.js - Case 04 Part 1 "The Family" (script-v1.md, approved). Planned timing from tools/plan.py (t0 = 4.0).
// Look dial: 0 (bright editorial collage) all through: this is the world as it was sold. It starts to drain (0 -> 0.2)
// on the last line, "someone is about to read the fine print", which leads into Part 2.
// Kamla is an example, not a real person; the founder is a generic puppet, never a likeness.
DIAL.keys = [[0, 0], [99.9, 0], [107.0, .2]];
TRAIL.showVO = !!window.STORYBOARD_VO;
(() => {
  const at = (a, b) => seg(sm(T), a, b), past = a => sm(T) >= a;
  const tag = (txt, x = 1800, y = 1050, al = 'right') => { if (PAPER.dry) return; G.save(); G.font = `700 22px ${TF.cond}`; const w = G.measureText(txt).width + 26; G.fillStyle = 'rgba(20,16,14,.72)'; G.fillRect(al === 'right' ? x - w + 13 : x - 13, y - 26, w, 36); G.restore(); print(txt, x, y, `700 22px ${TF.cond}`, { col: '#EFE8D8', ls: 3, align: al }); };
  const dramatization = () => tag('DRAMATIZATION');
  const example = (x, y) => tag('EXAMPLE · NOT A REAL PERSON', x, y, 'left');
  const fadeIn = (a, b) => { const k = 1 - at(a, b); if (k <= 0 || PAPER.dry) return; G.save(); G.setTransform(1, 0, 0, 1, 0, 0); G.fillStyle = `rgba(0,0,0,${k})`; G.fillRect(0, 0, W, H); G.restore(); };
  const typed = (txt, a, b) => { if (!past(a)) return; G.save(); G.globalAlpha = at(a, a + .8) * (1 - at(b - .8, b)); print(txt, 120, 1010, `30px ${TF.type}`, { col: '#2A2622', align: 'left' }); G.restore(); };

  // ---------- 0 - 4: chapter card, up from black (no cream flash) ----------
  function card(t, lt) {
    camBegin(960, 540, lerp(1.0, 1.04, at(0, 4)));
    piece(SH.rect(5000, 3000), { x: 960, y: 540, col: '#141110', mat: 'paper', depth: 0, seed: 57000, jit: 0, edge: false });
    blackPanel(960, 540, 1180, 360, { rot: -1.5, seed: 57001, after: () => {
      print('CASE FILE 1 / 4', 0, -60, `700 40px ${TF.cond}`, { col: '#D9A441', ls: 8 });
      print('THE FAMILY', 0, 70, `130px ${TF.tab}`, { col: '#F3ECDD' }); } });
    camEnd(); fadeIn(0, .8);
  }
  // ---------- 4.0 - 10.3: Gorakhpur, 1978: a young man on a borrowed scooter ----------
  function street(t, lt) {
    const x = lerp(-260, 1240, ease(at(4.2, 9.8)));
    camBegin(lerp(700, 1100, at(4, 10.3)), 600, 1.0);
    townStreet();
    exec('young', x - 40, 940, 30, { view: '3q', jit: 0, blink: false, lean: 4 });
    scooter(x, 950, 1.05, { col: '#5E8FA0' });
    if (!PAPER.dry) { const r = rnd('dust' + onStep(T, 12)); G.save(); noShadow(); G.fillStyle = 'rgba(210,170,110,.45)'; for (let i = 0; i < 10; i++) { G.beginPath(); G.arc(x - 160 - r() * 140, 930 - r() * 40, 6 + r() * 12, 0, TAU); G.fill(); } G.restore(); }
    camEnd(); dramatization(); typed('GORAKHPUR · 1978', 8.6, 10.3);
    trTear(t, at(4.0, 4.5));
  }
  // ---------- 10.3 - 20.0: one desk, a borrowed scooter, two thousand rupees ----------
  function office(t, lt) {
    camBegin(960, 600, lerp(1.0, 1.1, at(10.3, 20.0)));
    piece(SH.rect(5000, 3000), { x: 960, y: 400, col: '#E9C98E', mat: 'paper', depth: 0, seed: 57100, jit: 0, edge: false });
    piece(SH.rect(5000, 500), { x: 960, y: 1030, col: '#B98A55', mat: 'kraft', depth: .2, seed: 57101, jit: 0, edge: false });
    piece(SH.rect(300, 220), { x: 520, y: 360, col: '#F3E7CF', mat: 'card', depth: .6, seed: 57102, jit: 0 });   // window
    piece(SH.rect(300, 8), { x: 520, y: 360, col: '#8C5B3E', mat: 'card', depth: .7, seed: 57103, jit: 0 }); piece(SH.rect(8, 220), { x: 520, y: 360, col: '#8C5B3E', mat: 'card', depth: .7, seed: 57104, jit: 0 });
    exec('young', 900, 900, 34, { jit: 0, look: [.3, .1], armR: [-40, -60] });
    piece(SH.rect(560, 30), { x: 900, y: 800, col: '#7A5634', mat: 'wood', depth: 1.5, seed: 57110, jit: 0 });          // the one desk
    piece(SH.rect(500, 160), { x: 900, y: 890, col: '#6B4A30', mat: 'wood', depth: 1.4, seed: 57111, jit: 0 });
    if (past(14.6)) popIn(at(14.6, 15.0), 840, 780, () => { rupee(820, 778, -6, .8, { seed: 57120 }); rupee(880, 772, 5, .8, { seed: 57124 }); });
    if (past(16.4)) popIn(at(16.4, 16.8), 1480, 980, () => scooter(1480, 990, 1.0, { col: '#5E8FA0', left: true }));
    camEnd(); dramatization();
  }
  // ---------- 20.0 - 30.4: no bank account, cash every day; so Sahara sends people to them ----------
  function idea(t, lt) {
    camBegin(960, 560, lerp(1.0, .95, at(20, 30.4)));
    piece(SH.rect(5000, 3000), { x: 960, y: 300, col: P1.sky2, mat: 'paper', depth: 0, seed: 57200, jit: 0, edge: false });
    piece(SH.rect(5000, 500), { x: 960, y: 1000, col: P1.dust, mat: 'kraft', depth: .2, seed: 57201, jit: 0, edge: false });
    closedBank(1560, 760, .75);
    if (past(21.8)) { paperPeople(560, 700, 7, 90, at(21.8, 23.4), {}); paperPeople(520, 860, 8, 90, at(22.4, 24.0), {}); }
    if (past(24.6)) for (let i = 0; i < 6; i++) popIn(at(24.6 + i * .15, 24.9 + i * .15), 300 + i * 90, 560, () => rupee(300 + i * 90, 560, (i - 2.5) * 8, .35, { seed: 57210 + (i % 3) * 4, depth: 1.6 }));
    if (past(27.6)) for (let i = 0; i < 3; i++) { const lt2 = Math.max(0, sm(T) - 27.6 - i * .3), wc = walkCycle(lt2, {}); exec('agent', 1380 - walkSpeed() * 24 * lt2 - i * 140, 1000 + i * 30, 24, { ...wc, view: '3q', flip: true, jit: 0, blink: false }); }
    camEnd();
  }
  // ---------- 30.4 - 59.7: Kamla's stall; the man from Sahara every evening ----------
  function kamla(t, lt) {
    const insert = past(41.9) && !past(47.1), dusk = at(36.5, 39.0);
    if (insert) {   // the little book, close
      camBegin(960, 540, lerp(1.0, 1.06, at(41.9, 47.1)));
      piece(SH.rect(5000, 3000), { x: 960, y: 540, col: '#7A5634', mat: 'wood', depth: 0, seed: 57300, jit: 0, edge: false });
      passbook(960, 560, 900, at(42.0, 45.8), ['20', '30', '20', '25'], { rot: -3 });
      piece(SH.round(120, 40, 18), { x: 1360, y: 760, rot: 30, col: '#2A3F7A', mat: 'card', depth: 2, seed: 57301, jit: 0 });   // a pen
      camEnd(); dramatization(); return;
    }
    const pull = ease(at(55.1, 59.5)), z = lerp(1.08, .62, pull);
    camBegin(lerp(960, 960, pull), lerp(620, 560, pull), z);
    piece(SH.rect(6000, 3000), { x: 960, y: 300, col: mixCol(P1.sky, P1.dusk, dusk), mat: 'paper', depth: 0, seed: 57310, jit: 0, edge: false });
    piece(SH.rect(6000, 500), { x: 960, y: 1060, col: P1.dust, mat: 'kraft', depth: .2, seed: 57311, jit: 0, edge: false });
    if (pull > .02) for (const sx of [-120, 2040]) stall(sx, 1000, .9);    // the other stalls, revealed on the pull back
    exec('kamla', 960, 1000, 30, { view: '3q', jit: 0, look: past(41.0) ? [-.4, 0] : [0, 0], armL: past(47.1) ? [20, -40] : undefined });
    stall(960, 1000, 1.0);
    if (past(38.6)) { const lt2 = Math.max(0, sm(T) - 38.6), k = clamp(lt2 / 2.2), wc = walkCycle(lt2, {}), ax = lerp(-200, 520, easeOut(k));
      exec('agent', ax, 1010, 30, { ...(k < 1 ? wc : {}), view: '3q', jit: 0, blink: false, holdR: past(41.2) ? 'book' : undefined });
      if (past(41.2) && !past(41.9)) passbook(ax + 70, 760, 120, 0, [], { depth: 2.2 }); }
    if (pull > .3) for (let i = 0; i < 2; i++) exec('agent', [260, 1700][i], 1010, 27, { view: '3q', flip: !!i, jit: 0, blink: false });
    camEnd(); dramatization(); if (past(30.6)) example(120, 1050);
  }
  // ---------- 59.7 - 66.7: the Sahara family, and it grows ----------
  function family(t, lt) {
    camBegin(960, 560, lerp(1.1, .55, ease(at(59.7, 66.5))));
    piece(SH.rect(8000, 5000), { x: 960, y: 560, col: '#F2EAD8', mat: 'paper', depth: 0, seed: 57400, jit: 0, edge: false });
    const k = at(59.9, 66.3), rows = 9;
    for (let r = 0; r < rows; r++) { const kk = clamp(k * rows * .9 - r * .8); if (kk <= 0) continue;
      paperPeople(960, 300 + r * 130, 7 + r * 3, 96, kk, { cols: ['#F4EFE3', '#E8DFC9'] }); }
    camEnd();
  }
  // ---------- 66.7 - 77.5: an airline, TV, townships, a hill city, the cricket shirt, two hotels ----------
  function empire(t, lt) {
    hopCam(sm(T), [[66.7, 760, 560, 1.0], [68.6, 1460, 560, 1.0], [70.8, 2160, 560, 1.0], [74.9, 2900, 540, .95]]);
    piece(SH.rect(9000, 3000), { x: 2000, y: 400, col: P1.sky, mat: 'paper', depth: 0, seed: 57500, jit: 0, edge: false });
    halftoneOver(SH.rect(9000, 3000), { alpha: .12, sp: 9 });
    piece(SH.rect(9000, 500), { x: 2000, y: 1010, col: '#2F4A85', mat: 'paper', depth: .3, seed: 57501, jit: 0, edge: false });
    if (past(66.7)) popIn(at(66.7, 67.1), 560, 380, () => plane(560, 380, 1.6, -8));
    if (past(67.6)) popIn(at(67.6, 68.0), 1000, 620, () => tvCard(1000, 620, 320, '', { seed: 57510 }));
    if (past(68.6)) popIn(at(68.6, 69.0), 1400, 900, () => township(1400, 900, .9));
    if (past(69.6)) popIn(at(69.6, 70.0), 1900, 920, () => hillCity(1900, 920, .8));
    if (past(70.8)) popIn(at(70.8, 71.3), 2300, 640, () => jersey(2300, 640, 1.4));
    if (past(74.9)) popIn(at(74.9, 75.3), 2740, 980, () => hotel(2740, 980, 1.0, 'LONDON', { seed: 57520 }));
    if (past(75.7)) popIn(at(75.7, 76.1), 3080, 980, () => hotel(3080, 980, 1.0, 'NEW YORK', { seed: 57540, col: '#E6DCC6' }));
    camEnd();
  }
  // ---------- 77.5 - 90.7: Saharasri at the head of the table; nobody asks ----------
  function feast(t, lt) {
    camBegin(960, lerp(700, 640, at(77.5, 90.7)), lerp(1.05, .92, at(77.5, 90.7)));
    banquet();
    if (past(87.4) && !PAPER.dry) { G.save(); noShadow(); G.globalAlpha = .35 * at(87.4, 88.4); G.fillStyle = '#000'; G.fillRect(-2000, -2000, 6000, 6000); G.restore(); }
    camEnd(); dramatization();
  }
  // ---------- 90.7 - 99.9: Kamla, at night, with her book ----------
  function night(t, lt) {
    camBegin(960, 640, lerp(1.0, 1.12, at(90.7, 99.9)));
    piece(SH.rect(6000, 3000), { x: 960, y: 300, col: P1.night, mat: 'paper', depth: 0, seed: 57600, jit: 0, edge: false });
    piece(SH.rect(6000, 500), { x: 960, y: 1060, col: '#5A4632', mat: 'kraft', depth: .2, seed: 57601, jit: 0, edge: false });
    exec('kamla', 960, 1000, 30, { view: '3q', jit: 0, look: [.2, .3] });
    stall(960, 1000, 1.0);
    passbook(820, 905, 170, 1, ['20', '30'], { rot: 8, depth: 1.8 });
    if (!PAPER.dry) glow(1180, 700, 260, '255,214,140', .55);
    piece(SH.circle(16), { x: 1180, y: 700, col: P1.sky2, mat: 'card', depth: .5, seed: 57602, jit: 0, edge: false });   // the lamp
    if (past(93.7)) { const lt2 = Math.max(0, sm(T) - 93.7), k = clamp(lt2 / 2.2), wc = walkCycle(lt2, {}); exec('agent', lerp(-200, 520, easeOut(k)), 1010, 30, { ...(k < 1 ? wc : {}), view: '3q', jit: 0, blink: false }); }
    camEnd(); dramatization(); example(120, 1050);
  }
  // ---------- 99.9 - end: somewhere else, someone reads the fine print ----------
  function office2(t, lt) {
    camBegin(lerp(960, 900, at(99.9, 107)), lerp(640, 560, at(99.9, 107)), lerp(1.0, 1.7, ease(at(99.9, 107))));
    fineprint(sm(T), { turn: at(101.5, 102.3) });
    camEnd(); dramatization(); trSlide(t, at(99.9, 100.3), { dir: 'left' });
  }
  shots([[0, card], [4.0, street], [10.3, office], [20.0, idea], [30.4, kamla], [59.7, family], [66.7, empire], [77.5, feast], [90.7, night], [99.9, office2]]);
})();
