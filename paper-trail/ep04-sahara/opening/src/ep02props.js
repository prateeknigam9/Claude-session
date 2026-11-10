// ep02props.js — Case 02 (FTX) pieces, 16:9. Generic puppets only, no likenesses; no real logos ("FTX" only as plain type).
EXECS.sam = { seed: 3600, build: 'avg', skin: '#E9BE9C', suit: '#5D6B78', suit2: '#4F5C68', shirt: '#5D6B78', neck: 'tee', hair: 'quiff', hairCol: '#2E211A', iris: '#3A2A20', lip: '#B06E60' };
EXECS.caroline = { seed: 3700, build: 'slim', skin: '#EFCBAE', suit: '#2F3A4A', suit2: '#283240', shirt: '#E9E2D4', neck: 'open', hair: 'bob', hairCol: '#5A3A22', iris: '#4A3020', lip: '#B4705F', glasses: true };
STATUS.CONVICTED = '#8E2019'; STATUS.PLEADED = '#8E2019'; STATUS.BANKRUPT = '#8E2019'; STATUS.REPORTED = '#5E6B70'; STATUS.TESTIMONY = '#2E5C8A'; STATUS.EXAMPLE = '#5E6B70';
// sam(x, y, u, o) — the generic founder puppet (T-shirt, mop of hair). o.shorts draws shorts + bare shins over the legs.
function sam(x, y, u, o = {}) {
  const J = exec('sam', x, y, u, o);
  if (o.shorts !== false && !PAPER.dry) { const hy = y - u * 4.3;
    [-1, 1].forEach(sd => piece(SH.rect(u * .82, u * 1.9), { x: x + sd * u * .5, y: hy + u * 2.9, col: '#EBC4A2', mat: 'paper', depth: 1.05, seed: 3690 + (sd > 0), jit: o.jit ?? .5 }));
    piece(SH.rect(u * 2.0, u * 1.5), { x, y: hy + u * .9, col: '#7C6A4E', mat: 'paper', depth: 1.1, seed: 3692, jit: o.jit ?? .5 }); }
  return J;
}
// phonePending(x, y, w, { k, label, rot, seed }) — a phone stuck on "Pending…" (k pops it in)
function phonePending(x, y, w, o = {}) {
  const k = o.k ?? 1; if (k <= 0) return; const h = w * 1.7, p = k < 1 ? backOut(k) : 1;
  G.save(); G.translate(x, y); G.rotate((o.rot || 0) * D2R); G.scale(p, p);
  piece(SH.round(w + 14, h + 14, w * .12), { col: '#202425', mat: 'card', depth: 1.5, seed: (o.seed || 3800) + 1, jit: 0 });
  piece(SH.round(w, h, w * .09), { col: '#ECEFEE', mat: 'card', depth: .2, seed: o.seed || 3800, jit: 0, edge: false });
  print(o.label || 'WITHDRAW', 0, -h * .2, `700 ${w * .13}px ${TF.cond}`, { col: '#4A5356', ls: 2 });
  piece(SH.round(w * .78, w * .26, w * .06), { y: h * .05, col: '#B9C2C4', mat: 'card', depth: .3, seed: (o.seed || 3800) + 2, jit: 0 });
  const dots = '.'.repeat(1 + Math.floor(onStep(T, 3)) % 3); print('Pending' + dots, -w * .25, h * .08, `${w * .14}px ${TF.cond}`, { align: 'left', col: '#6C7275' });
  G.restore();
}
// vaultDiagram(x, y, s, k, { leak }) — YOU → FTX (a vault holding your money) → crypto. leak 0..1 opens a back door on the side.
function vaultDiagram(x, y, s, k = 1, o = {}) {
  const st = clamp(k);
  G.save(); G.translate(x, y); G.scale(s, s);
  if (st > 0) { paperPeople(-560, 40, 1, 150, 1); handText('YOU', -560, 190, 56, 1, { align: 'center', col: '#F1ECE2' }); }
  if (st > .2) { markerArrow([-460, 20], [-240, 20], seg(st, .2, .45), { w: 10, col: '#7E9C70', comp: 'source-over' }); }
  if (st > .3) { piece(SH.round(360, 360, 30), { col: '#8C979B', mat: 'card', depth: 1.6, seed: 3810, jit: 0 }); piece(SH.circle(110), { col: '#B6BEC1', mat: 'card', depth: .4, seed: 3811, jit: 0 }); print('FTX', 0, -200, `64px ${TF.tab}`, { col: '#F3EDE0' }); cashStack(0, 40, 1.2, 4, { seed: 3 }); }
  if (st > .55) { markerArrow([200, 20], [420, 20], seg(st, .55, .8), { w: 10, col: '#7E9C70', comp: 'source-over' }); coinCard(540, 20, 90, { txt: '₿', rot: 0 }); }
  if (o.leak) { piece(SH.rect(80, 160), { x: 180 + 60 * clamp(o.leak), y: 110, col: '#2A2526', mat: 'card', depth: 1.8, seed: 3812, jit: 0 }); markerArrow([200, 140], [300, 360], clamp(o.leak), { w: 10, col: '#E8483A', comp: 'source-over' }); }
  G.restore();
}
// arenaSign(x, y, w, txt) — a generic arena façade with a lettered sign (no real logo)
function arenaSign(x, y, w, txt, o = {}) {
  const h = w * .5; piece(SH.poly([[-w / 2, h / 2], [-w * .42, -h / 2], [w * .42, -h / 2], [w / 2, h / 2]]), { x, y, col: '#3F4A52', mat: 'card', depth: 1.5, seed: o.seed || 3820, jit: 0 });
  for (let i = 0; i < 7; i++) piece(SH.rect(w * .07, h * .45), { x: x - w * .33 + i * w * .11, y: y + h * .12, col: '#E8C25A', mat: 'card', depth: .2, seed: 3830 + i, jit: 0, alpha: .8 });
  piece(SH.rect(w * .7, h * .22), { x, y: y - h * .3, col: '#151A1D', mat: 'card', depth: .6, seed: 3840, jit: 0 }); print(txt, x, y - h * .3 + h * .07, `${h * .17}px ${TF.tab}`, { col: '#F3EDE0', ls: 4 });
}
// tvCard(x, y, w, txt, { sub }) — an old paper TV with a slogan on screen (generic ad)
function tvCard(x, y, w, txt, o = {}) {
  const h = w * .68; piece(SH.round(w, h, 24), { x, y, col: '#2A2526', mat: 'card', depth: 1.6, seed: o.seed || 3850, jit: 0 });
  piece(SH.round(w * .82, h * .72, 16), { x: x - w * .03, y: y - h * .03, col: '#24363A', mat: 'card', depth: .2, seed: 3851, jit: 0 });
  print(txt, x - w * .03, y + h * .02, `${w * .09}px ${TF.tab}`, { col: '#E8C25A' }); if (o.sub) print(o.sub, x - w * .03, y + h * .2, `${w * .05}px ${TF.cond}`, { col: '#C6D2D2' });
}
// magazine(x, y, w, puppet, { head, rot }) — a generic magazine cover with a puppet portrait
function magazine(x, y, w, name, o = {}) {
  const h = w * 1.3; G.save(); G.translate(x, y); G.rotate((o.rot || 0) * D2R);
  piece(SH.rect(w, h), { col: '#F3EFE4', mat: 'card', depth: 1.7, seed: o.seed || 3860, jit: 0 });
  print(o.title || 'THE FUTURE', 0, -h * .38, `${w * .14}px ${TF.tab}`, { col: '#C8342A', ls: 3 });
  G.save(); noShadow(); const iw = w * .8; G.drawImage(mugCanvas(name, { face: o.face || 'happy' }), -iw / 2, -h * .3, iw, iw); G.restore();
  if (o.head) print(o.head, 0, h * .42, `${w * .07}px ${TF.cond}`, { col: CASE.ink });
  G.restore();
}
// beanbag(x, y, s) — a squashed paper beanbag
function beanbag(x, y, s = 1) { piece(SH.blob(170 * s, 9, .22, 3870), { x, y, sy: .55, col: '#5E7FA8', mat: 'felt', depth: 1.3, seed: 3870, jit: 0 }); }
// balanceScale(x, y, s, tilt) — "earn to give": money on one side, a heart on the other
function balanceScale(x, y, s = 1, tilt = 0) {
  piece(SH.rect(16 * s, 260 * s), { x, y, col: '#8C979B', mat: 'card', depth: 1.4, seed: 3880, jit: 0 });
  G.save(); G.translate(x, y - 130 * s); G.rotate(tilt * D2R); piece(SH.rect(420 * s, 12 * s), { col: '#8C979B', mat: 'card', depth: 1.5, seed: 3881, jit: 0 });
  cashStack(-190 * s, -10 * s, .9 * s, 3, { seed: 7 }); piece(SH.heart ? SH.heart(60 * s) : SH.circle(50 * s), { x: 190 * s, y: -40 * s, col: '#C8342A', mat: 'paper', depth: 1.6, seed: 3882, jit: 0 }); G.restore();
}
