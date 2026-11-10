// ep04p1props.js - Case 04 Part 1 "The Family" props. Generic: no logos, no likenesses, no real documents.
// Puppets (EXECS): the young founder, Kamla (an example, not a real person) and the Sahara agent who visits her.
EXECS.young = { ...EXECS.founder, seed: 9500, glasses: false, hair: 'slick', hairCol: '#1B1513', skin: '#B98256', suit: '#E9E3D3', suit2: '#D8D1BF', shirt: '#F4EFE3', neck: 'open', iris: '#2E1E14', lip: '#8C5242' };
EXECS.kamla = { ...EXECS.boss, seed: 9520, skin: '#9C6A45', suit: '#C8502E', suit2: '#A63F22', shirt: '#E8B84A', neck: 'open', hair: 'bob', hairCol: '#1E1714', earrings: true };
EXECS.agent = { ...EXECS.banker, seed: 9540, skin: '#A87450', suit: '#E6E0D0', suit2: '#D2CAB6', shirt: '#EFEAE0', neck: 'tee', tie: null, pocket: null, hair: 'slick', hairCol: '#221A16' };
EXECS.sri = { ...EXECS.young, seed: 9560, build: 'stout', suit: '#F3EFE6', suit2: '#E4DED2' };

const P1 = { sky: '#F4C74E', sky2: '#F7DD8A', dust: '#D9A86A', wall: '#E6B27A', wall2: '#C98A58', roof: '#9B4A30', green: '#4E8A52', tomato: '#D6402F', onion: '#B65A7A', crate: '#B98A55', awning: '#2F6FA8', awning2: '#F2EAD8', dusk: '#E08A5A', night: '#1B2440' };

// a dusty small-town street (Gorakhpur, 1978): flat-roofed shops, a tree, a sun
function townStreet(o = {}) {
  piece(SH.rect(5000, 3000), { x: 960, y: 200, col: o.sky || P1.sky, mat: 'paper', depth: 0, seed: 50000, jit: 0, edge: false });
  sun(1500, 200, 90, {});
  for (let i = 0; i < 9; i++) { const w = 220 + hash(i * 2.7) * 160, h = 220 + hash(i * 1.3) * 200, x = -300 + i * 300;
    piece(SH.rect(w, h), { x, y: 760 - h / 2, col: i % 2 ? P1.wall : P1.wall2, mat: 'paper', depth: .6, seed: 50010 + i, jit: 0 });
    piece(SH.rect(w * .5, h * .4), { x, y: 760 - h * .22, col: '#5A3A28', mat: 'card', depth: .1, seed: 50030 + i, jit: 0, edge: false });
    piece(SH.rect(w + 20, 18), { x, y: 760 - h, col: P1.roof, mat: 'card', depth: .4, seed: 50050 + i, jit: 0 }); }
  tree(1780, 760, 1.2, {});
  piece(SH.rect(5000, 420), { x: 960, y: 970, col: P1.dust, mat: 'kraft', depth: .3, seed: 50070, jit: 0, edge: false });
}
// a scooter, side view, facing right. Origin: ground, centre
function scooter(x, y, s = 1, o = {}) {
  G.save(); G.translate(x, y); G.scale(o.left ? -s : s, s); const c = o.col || '#5E8FA0';
  for (const wx of [-95, 95]) { piece(SH.circle(36), { x: wx, y: -36, col: '#1C1C1E', mat: 'card', depth: .8, seed: 51000 + (wx > 0), jit: 0 }); piece(SH.circle(13), { x: wx, y: -36, col: '#9AA0A4', mat: 'card', depth: .2, seed: 51002 + (wx > 0), jit: 0, edge: false }); }
  piece(SH.smooth([[-140, -50], [-130, -120], [-40, -130], [10, -90], [60, -80], [40, -50]]), { col: c, mat: 'card', depth: 1, seed: 51010, jit: 0 });   // body
  piece(SH.round(110, 22, 10), { x: -70, y: -138, col: '#3A2A22', mat: 'card', depth: 1.1, seed: 51011, jit: 0 });                                 // seat
  piece(SH.poly([[70, -60], [100, -60], [112, -200], [92, -200]]), { col: c, mat: 'card', depth: 1, seed: 51012, jit: 0 });                          // front column
  piece(SH.rect(70, 10), { x: 104, y: -205, col: '#2A2A2C', mat: 'card', depth: 1.2, seed: 51013, jit: 0 });                                          // handlebar
  piece(SH.circle(12), { x: 116, y: -170, col: '#F6E7B0', mat: 'card', depth: .3, seed: 51014, jit: 0, edge: false });
  G.restore();
}
// a rupee note (generic: no portrait, no numbers you could copy)
function rupee(x, y, rot = 0, s = 1, o = {}) {
  G.save(); G.translate(x, y); G.rotate(rot * D2R); const c = o.col || '#C79A6E';
  piece(SH.rect(220 * s, 104 * s), { col: mixCol(c, '#F3E9D6', .55), mat: 'paper', depth: o.depth ?? 1, seed: o.seed || 51100, jit: 0 });
  piece(SH.rect(190 * s, 78 * s), { col: c, mat: 'paper', depth: .05, seed: (o.seed || 51100) + 1, jit: 0, edge: false });
  piece(SH.circle(26 * s), { x: 52 * s, col: mixCol(c, '#F3E9D6', .4), mat: 'paper', depth: .05, seed: (o.seed || 51100) + 2, jit: 0, edge: false });
  G.restore();
}
// a little passbook, open, with hand-written daily amounts
function passbook(x, y, w, k = 1, rows = ['20', '30'], o = {}) {
  const h = w * .66; G.save(); G.translate(x, y); G.rotate((o.rot || 0) * D2R);
  piece(SH.rect(w + 16, h + 16), { col: '#8E2F2A', mat: 'card', depth: o.depth ?? 1.6, seed: 51200, jit: 0 });
  for (const sx of [-1, 1]) piece(SH.rect(w / 2 - 6, h), { x: sx * w / 4, col: '#F1EAD8', mat: 'paper', depth: .2, seed: 51201 + (sx > 0), jit: 0 });
  for (let i = 0; i < 6; i++) piece(SH.rect(w / 2 - 30, 2), { x: w / 4, y: -h * .36 + i * h * .14, col: '#B7AE98', mat: 'card', depth: 0, seed: 51210 + i, jit: 0, edge: false });
  fakeText(-w * .46, -h * .38, w * .38, 6, w * .03, 51220, { alpha: .35 });
  rows.forEach((r, i) => handText(r, w * .12, -h * .3 + i * h * .14 + h * .1, w * .07, clamp(k * rows.length - i), { col: '#2A3F7A' }));
  G.restore();
}
// Kamla's vegetable stall: awning, crates of tomatoes and onions, a hanging scale
function stall(x, y, s = 1, o = {}) {
  G.save(); G.translate(x, y); G.scale(s, s);
  for (const px of [-300, 300]) piece(SH.rect(14, 420), { x: px, y: -210, col: '#6B4A30', mat: 'wood', depth: .8, seed: 52000 + (px > 0), jit: 0 });
  for (let i = 0; i < 8; i++) piece(SH.poly([[-320 + i * 80, -440], [-240 + i * 80, -440], [-240 + i * 80, -380], [-280 + i * 80, -360], [-320 + i * 80, -380]], 'aw' + i), { col: i % 2 ? P1.awning2 : P1.awning, mat: 'paper', depth: 1, seed: 52010 + i, jit: 0 });
  piece(SH.rect(660, 120), { y: -60, col: '#7A5634', mat: 'wood', depth: 1.1, seed: 52020, jit: 0 });   // counter
  [[-200, P1.tomato], [0, P1.onion], [200, P1.green]].forEach(([cx, col], j) => {
    piece(SH.rect(170, 70), { x: cx, y: -150, col: P1.crate, mat: 'kraft', depth: 1.2, seed: 52030 + j, jit: 0 });
    for (let k = 0; k < 9; k++) piece(SH.circle(20 + hash(j * 9 + k) * 5), { x: cx - 64 + (k % 5) * 32 + (k > 4 ? 16 : 0), y: -196 - (k > 4 ? 26 : 0), col: mixCol(col, '#000000', hash(k * 1.3) * .15), mat: 'paper', depth: 1.3, seed: 52040 + j * 10 + (k % 4), jit: 0 });
  });
  // the hanging scale
  if (!PAPER.dry) { G.save(); noShadow(); G.strokeStyle = '#3A3330'; G.lineWidth = 3; G.beginPath(); G.moveTo(250, -380); G.lineTo(250, -300); G.moveTo(200, -300); G.lineTo(300, -300); G.moveTo(200, -300); G.lineTo(200, -250); G.moveTo(300, -300); G.lineTo(300, -262); G.stroke(); G.restore(); }
  piece(SH.ellipse(40, 10), { x: 200, y: -248, col: '#8C8F92', mat: 'card', depth: 1.2, seed: 52080, jit: 0 }); piece(SH.ellipse(40, 10), { x: 300, y: -260, col: '#8C8F92', mat: 'card', depth: 1.2, seed: 52081, jit: 0 });
  G.restore();
}
// a bank, far away, its doors shut
function closedBank(x, y, s = 1) {
  G.save(); G.translate(x, y); G.scale(s, s);
  piece(SH.poly([[-200, -300], [200, -300], [0, -380]]), { col: '#CFC9BC', mat: 'card', depth: 1, seed: 53000, jit: 0 });
  piece(SH.rect(400, 300), { y: -150, col: '#E6E1D5', mat: 'card', depth: 1, seed: 53001, jit: 0 });
  for (let i = 0; i < 4; i++) piece(SH.rect(26, 230), { x: -150 + i * 100, y: -140, col: '#F3F0E8', mat: 'card', depth: 1.3, seed: 53002 + i, jit: 0 });
  piece(SH.rect(90, 140), { y: -70, col: '#3B3F45', mat: 'card', depth: .3, seed: 53010, jit: 0 });
  print('BANK', 0, -306, `700 34px ${TF.cond}`, { col: '#4A4640', ls: 6 });
  G.restore();
}
// the empire, one card at a time
function jersey(x, y, s = 1) {   // a plain cricket shirt: no logo, no lettering
  G.save(); G.translate(x, y); G.scale(s, s);
  piece(SH.poly([[-110, -150], [-40, -175], [40, -175], [110, -150], [160, -80], [110, -50], [90, -80], [90, 120], [-90, 120], [-90, -80], [-110, -50], [-160, -80]]), { col: '#2F64B0', mat: 'felt', depth: 1.6, seed: 54000, jit: 0 });
  piece(SH.poly([[-40, -175], [40, -175], [0, -130]]), { col: '#F2D45C', mat: 'felt', depth: .3, seed: 54001, jit: 0 });
  G.restore();
}
function hotel(x, y, s = 1, tag = '', o = {}) {
  G.save(); G.translate(x, y); G.scale(s, s);
  piece(SH.rect(260, 420), { y: -210, col: o.col || '#D9CDB4', mat: 'card', depth: 1.4, seed: o.seed || 54100, jit: 0 });
  for (let r = 0; r < 7; r++) for (let c = 0; c < 4; c++) piece(SH.rect(34, 30), { x: -90 + c * 60, y: -380 + r * 52, col: '#F2D58A', mat: 'card', depth: .1, seed: (o.seed || 54100) + 1 + (r * 4 + c) % 8, jit: 0, edge: false });
  piece(SH.poly([[-150, -420], [150, -420], [120, -460], [-120, -460]]), { col: '#5E4A3A', mat: 'card', depth: 1.5, seed: (o.seed || 54100) + 20, jit: 0 });
  if (tag) labelTape(0, -500, tag, { size: 30, rot: -2, seed: (o.seed || 54100) + 30 });
  G.restore();
}
function township(x, y, s = 1) {
  G.save(); G.translate(x, y); G.scale(s, s);
  for (let i = 0; i < 7; i++) { const h = 120 + hash(i * 3.3) * 140; piece(SH.rect(90, h), { x: -270 + i * 90, y: -h / 2, col: ['#E8DCC4', '#D7C7A8', '#EFE6D2'][i % 3], mat: 'card', depth: 1.2, seed: 54200 + i, jit: 0 });
    for (let k = 0; k < 3; k++) piece(SH.rect(16, 16), { x: -270 + i * 90 - 22 + k * 22, y: -h + 30, col: '#5E7FA8', mat: 'card', depth: .1, seed: 54220 + (i + k) % 6, jit: 0, edge: false }); }
  G.restore();
}
function hillCity(x, y, s = 1) {
  G.save(); G.translate(x, y); G.scale(s, s);
  piece(SH.hills(700, 160, 2, 7, 300), { y: -120, col: '#5E9A3E', mat: 'paper', depth: 1, seed: 54300, jit: 0 });
  piece(SH.hills(700, 90, 3, 9, 200), { y: -40, col: '#3F7A45', mat: 'paper', depth: 1.1, seed: 54301, jit: 0 });
  for (let i = 0; i < 6; i++) { const hx = -220 + i * 90, hy = -150 + Math.sin(i) * 30; piece(SH.rect(50, 40), { x: hx, y: hy, col: '#F3EFE6', mat: 'card', depth: 1.3, seed: 54310 + i, jit: 0 }); piece(SH.tri(64, 30), { x: hx, y: hy - 34, col: '#B8574A', mat: 'card', depth: 1.35, seed: 54320 + i, jit: 0 }); }
  G.restore();
}
// the long banquet table, a figure in white at its head, backlit (no face)
function banquet(o = {}) {
  piece(SH.rect(5000, 3000), { x: 960, y: 400, col: '#3A1E1A', mat: 'paper', depth: 0, seed: 55000, jit: 0, edge: false });
  piece(SH.round(520, 640, 40), { x: 960, y: 420, col: '#F6E3B0', mat: 'card', depth: .2, seed: 55001, jit: 0 });   // the bright window behind him
  if (!PAPER.dry) glow(960, 420, 700, '255,226,170', .45);
  exec('sri', 960, 760, 34, { style: 'silhouette', jit: 0, blink: false });
  piece(SH.poly([[700, 760], [1220, 760], [1700, 1180], [220, 1180]]), { col: '#F3EEE2', mat: 'paper', depth: 1.4, seed: 55010, jit: 0 });   // the table, in perspective
  for (let i = 0; i < 5; i++) { const k = i / 4, lx = lerp(760, 380, k), rx = lerp(1160, 1540, k), yy = lerp(800, 1120, k), sc = lerp(.5, 1.1, k);
    for (const cx of [lx, rx]) { piece(SH.ellipse(46 * sc, 16 * sc), { x: cx, y: yy, col: '#E9D59A', mat: 'card', depth: .3, seed: 55020 + i, jit: 0 });
      piece(SH.rect(10 * sc, 60 * sc), { x: cx + (cx < 960 ? 60 : -60) * sc, y: yy - 30 * sc, col: '#F4EFE3', mat: 'card', depth: .6, seed: 55040 + i, jit: 0 });
      if (!PAPER.dry) glow(cx + (cx < 960 ? 60 : -60) * sc, yy - 64 * sc, 40 * sc, '255,210,120', .7); } }
  // a crown of paper flowers in the middle of the table
  for (let i = 0; i < 9; i++) { const a = i / 9 * TAU; piece(SH.circle(18), { x: 960 + Math.cos(a) * 60, y: 890 + Math.sin(a) * 18, col: i % 2 ? '#E8603C' : '#F4D05A', mat: 'paper', depth: 1.5, seed: 55060 + i, jit: 0 }); }
}
// the far-off office: a lamp, a thick document, a hand turning pages
function fineprint(lt, o = {}) {
  piece(SH.rect(5000, 3000), { x: 960, y: 540, col: '#2A2622', mat: 'paper', depth: 0, seed: 56000, jit: 0, edge: false });
  piece(SH.rect(2600, 700), { x: 960, y: 980, col: '#4A3426', mat: 'wood', depth: .3, seed: 56001, jit: 0, edge: false });
  if (!PAPER.dry) glow(900, 660, 760, '255,220,150', .5);
  for (let i = 0; i < 9; i++) piece(SH.rect(820, 560), { x: 960 + i * 2, y: 700 - i * 5, col: '#EFE8D6', mat: 'paper', depth: .3, seed: 56010 + i, jit: 0 });
  piece(SH.rect(820, 560), { x: 960, y: 655, col: '#F4EEE0', mat: 'paper', depth: .5, seed: 56030, jit: 0 });
  fakeText(600, 420, 700, 26, 17, 56031, { alpha: .45 });
  const turn = o.turn || 0; if (turn > 0) { G.save(); G.translate(960, 655); G.scale(1 - 2 * turn, 1); piece(SH.rect(410, 560), { x: 205, col: '#F7F2E6', mat: 'paper', depth: 1.2, seed: 56040, jit: 0 }); G.restore(); }
}
