// ep04p2props.js - Case 04 Part 2 "The Letter" props. Generic: no logos, no likenesses, no real documents.

// Hindi-style handwriting without real words: a top bar (the shirorekha) with loops hanging from it
function hindiScribble(x, y, w, rows = 3, o = {}) {
  if (PAPER.dry) return; const q = rnd('hindi' + (o.seed || 1)), lh = o.lh || 34, k = o.k ?? 1;
  G.save(); noShadow(); G.translate(x, y); G.rotate((o.rot || 0) * D2R); G.strokeStyle = o.col || '#24356E'; G.lineWidth = o.lw || 3; G.lineCap = 'round'; G.lineJoin = 'round';
  for (let r = 0; r < rows; r++) { const yy = r * lh, len = w * (r === rows - 1 ? .6 : .95) * clamp(k * rows - r); if (len <= 2) continue;
    let px = 0; while (px < len) { const ww = Math.min(len - px, 40 + q() * 70);
      G.beginPath(); G.moveTo(px, yy); G.lineTo(px + ww, yy); G.stroke();
      for (let c = px + 6; c < px + ww - 6; c += 14 + q() * 8) { G.beginPath(); G.moveTo(c, yy); const h = lh * (.35 + q() * .3);
        G.bezierCurveTo(c - 8, yy + h * .4, c + 10, yy + h * .6, c + 2 * (q() - .5) * 6, yy + h); if (q() > .6) G.lineTo(c + 7, yy + h * .7); G.stroke(); }
      px += ww + 12 + q() * 10; } }
  G.restore();
}
// a round postmark with a town name
function postmark(x, y, r, txt, o = {}) {
  if (PAPER.dry) return; G.save(); noShadow(); G.translate(x, y); G.rotate((o.rot ?? -12) * D2R); G.globalCompositeOperation = 'multiply';
  G.strokeStyle = o.col || 'rgba(60,40,90,.75)'; G.lineWidth = 3; G.beginPath(); G.arc(0, 0, r, 0, TAU); G.stroke(); G.beginPath(); G.arc(0, 0, r * .72, 0, TAU); G.stroke();
  G.restore(); print(txt, x, y + r * .12, `700 ${Math.round(r * .32)}px ${TF.cond}`, { col: 'rgba(60,40,90,.8)', ls: 2 });
  if (!PAPER.dry) { G.save(); noShadow(); G.strokeStyle = 'rgba(60,40,90,.6)'; G.lineWidth = 3; for (let i = 0; i < 4; i++) { G.beginPath(); G.moveTo(x + r * 1.1, y - r * .45 + i * r * .3); G.bezierCurveTo(x + r * 1.6, y - r * .6 + i * r * .3, x + r * 2.0, y - r * .3 + i * r * .3, x + r * 2.6, y - r * .45 + i * r * .3); G.stroke(); } G.restore(); }
}
// the letter from Indore: a hand-addressed envelope with stamps and a postmark
function indoreLetter(x, y, w, o = {}) {
  const h = w * .6; G.save(); G.translate(x, y); G.rotate((o.rot || 0) * D2R);
  piece(SH.rect(w, h), { col: '#E9DDBE', mat: 'paper', depth: o.depth ?? 1.6, seed: 58000, jit: 0 });
  piece(SH.rect(w * .14, w * .16), { x: w * .38, y: -h * .3, col: '#C0504A', mat: 'card', depth: .1, seed: 58001, jit: 0 });
  piece(SH.rect(w * .14, w * .16), { x: w * .22, y: -h * .3, col: '#4E7A9E', mat: 'card', depth: .1, seed: 58002, jit: 0 });
  hindiScribble(-w * .3, -h * .02, w * .55, 3, { lh: w * .07, seed: 7, k: o.k ?? 1 });
  postmark(w * .28, -h * .22, w * .1, 'INDORE');
  G.restore();
}
// a typed envelope from the investor advocates' group
function typedLetter(x, y, w, o = {}) {
  const h = w * .6; G.save(); G.translate(x, y); G.rotate((o.rot || 0) * D2R);
  piece(SH.rect(w, h), { col: '#F2EEE4', mat: 'paper', depth: o.depth ?? 1.5, seed: 58100, jit: 0 });
  fakeText(-w * .2, -h * .05, w * .45, 3, w * .045, 58101, { alpha: .6 });
  piece(SH.rect(w * .14, w * .16), { x: w * .38, y: -h * .3, col: '#6E8C5A', mat: 'card', depth: .1, seed: 58102, jit: 0 });
  G.restore();
}
// a plain wooden chair, seen from the front (cheap: used by the thousand)
function chair(x, y, s = 1, seed = 58200, o = {}) {
  const d = o.flat ? 0 : .6, c = o.col || '#8C5B3E';
  piece(SH.rect(80 * s, 14 * s), { x, y: y - 60 * s, col: c, mat: 'card', depth: d, seed, jit: 0, edge: !o.flat });
  piece(SH.rect(70 * s, 70 * s), { x, y: y - 110 * s, col: mixCol(c, '#000000', .15), mat: 'card', depth: d, seed: seed + 1, jit: 0, edge: !o.flat });
  if (!o.flat) for (const lx of [-34, 34]) piece(SH.rect(8 * s, 60 * s), { x: x + lx * s, y: y - 30 * s, col: c, mat: 'card', depth: d, seed: seed + 2, jit: 0 });
}
// a staircase of three steps, from the regulator up to the Supreme Court
function appealStairs(x, y, s = 1) {
  G.save(); G.translate(x, y); G.scale(s, s);
  ['#D9CDB4', '#CBBE9F', '#BDB08F'].forEach((c, i) => piece(SH.rect(420, 140 + i * 140), { x: -420 + i * 420, y: -(70 + i * 70), col: c, mat: 'card', depth: 1.2, seed: 58300 + i, jit: 0 }));
  G.restore();
}
// the Supreme Court: a paper building, columns of folded card, rain on the steps
function courtBuilding(x, y, s = 1) {
  G.save(); G.translate(x, y); G.scale(s, s);
  for (let i = 0; i < 4; i++) piece(SH.rect(900 - i * 40, 40), { y: -20 - i * 40, col: ['#E6DFD0', '#DAD2C0', '#E6DFD0', '#DAD2C0'][i], mat: 'card', depth: 1, seed: 58400 + i, jit: 0 });   // steps
  for (let i = 0; i < 6; i++) { piece(SH.rect(56, 380), { x: -300 + i * 120, y: -350, col: '#F1ECE1', mat: 'card', depth: 1.4, seed: 58410 + i, jit: 0 });
    for (let f = 0; f < 3; f++) piece(SH.rect(6, 370), { x: -316 + i * 120 + f * 16, y: -350, col: '#D8D0BE', mat: 'card', depth: 0, seed: 58420 + f, jit: 0, edge: false }); }
  piece(SH.rect(820, 50), { y: -565, col: '#E6DFD0', mat: 'card', depth: 1.5, seed: 58430, jit: 0 });
  piece(SH.poly([[-440, -590], [440, -590], [0, -740]]), { col: '#EFE9DC', mat: 'card', depth: 1.5, seed: 58431, jit: 0 });
  G.restore();
}
