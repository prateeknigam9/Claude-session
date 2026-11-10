// trail4.js — kit v4, "the investigation look" (series plan v5: famous names, hidden money stories).
//
// LOOK     TRAIL.mood = 'case'  → cold blue-green grade, cool desk-lamp spot, deeper vignette (default from v4 on)
//          CASE palette · caseBoard() home base (dark teal felt board, big enough to pan) · hopCam() camera that never rests
// DEVICES  exhibitTag · redFlags (tally) · whoKnew (sticky note) · timeStamp · statusTag (CONVICTED/CHARGED/WANTED/MISSING)
// PEOPLE   wantedPoster · mugshotBoard · passport · boardingPass
// SCAMS    chatCard (generic messenger) · socialPost (generic feed post)
// NEWS     newsTicker (screen-fixed) · breakingBanner (screen-fixed) · courtSet · gavel
// MONEY    cryptoCrash · transferSlip · moneyFlow (who paid whom) · countdownCard
// HEISTS   blueprint (+ dashed route) · cctvFrame (draws any scene as a grey surveillance still)
// Every k is 0 → 1 progress; drive with seg(sm(lt), a, b). Pure functions of t, as everywhere in the kit.

TRAIL.mood = 'case';
const CASE = {
  board: '#1E3A3C', boardDk: '#142A2C', boardLt: '#2C5052', frame: '#2A2622', paper: '#EDE6D3', paperDk: '#D8CFB8',
  ink: '#1C1A1A', red: '#C8322A', redDk: '#8E2019', yellow: '#E9C94A', sticky: '#F2D45C', blue: '#2E5C8A', bp: '#24507E',
  bpLine: '#CFE0F0', green: '#3E8E5E', steel: '#9AA7AD', night: '#0E1416',
};
const STATUS = { CONVICTED: '#8E2019', CHARGED: '#B0641E', WANTED: '#C8322A', MISSING: '#2E5C8A', PARDONED: '#5B6B3A', ACCUSED: '#B0641E', FUGITIVE: '#C8322A' };

// ---------- the cold investigation grade ----------
{ const _bl = buildLook;
  buildLook = function () {
    if (TRAIL.mood !== 'case') return _bl();
    const c = makeCanvas(W, H), x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, W, H);
    const R = Math.max(W, H), g = x.createRadialGradient(W * .46, H * .42, Math.min(W, H) * .12, W * .5, H * .5, R * (W > H ? .66 : .62));
    g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(.5, 'rgba(160,190,194,.5)'); g.addColorStop(1, W > H ? 'rgba(8,20,24,.97)' : 'rgba(8,20,24,.9)');
    x.fillStyle = g; x.fillRect(0, 0, W, H); LOOK.mul = c;
    const s = makeCanvas(480, 270), y = s.getContext('2d'), g2 = y.createRadialGradient(205, 100, 0, 205, 100, 300);
    g2.addColorStop(0, 'rgba(225,240,245,.55)'); g2.addColorStop(1, 'rgba(200,225,235,0)'); y.fillStyle = g2; y.fillRect(0, 0, 480, 270); LOOK.spot = s;
    const n = makeCanvas(256, 256), z = n.getContext('2d'), id = z.createImageData(256, 256), r = rnd('filmgrain');
    for (let i = 0; i < id.data.length; i += 4) { const v = 128 + (r() - .5) * 100; id.data[i] = id.data[i + 1] = id.data[i + 2] = v; id.data[i + 3] = 255; }
    z.putImageData(id, 0, 0); LOOK.grain = OUT.createPattern(n, 'repeat');
  }; }

// ---------- home base: the board ----------
// caseBoard({ x, y, w, h, frame, scraps }) — dark teal felt board in WORLD space (pan around it); old pin holes + paper scraps
function caseBoard(o = {}) {
  const x = o.x ?? W / 2, y = o.y ?? H / 2, w = o.w ?? 3600, h = o.h ?? 2300;
  piece(SH.rect(w, h), { x, y, col: o.col || CASE.board, mat: 'felt', depth: .1, seed: 7101, jit: 0, edge: false });
  for (let i = 0; i < 7; i++) { const q = rnd('cbstain' + i); piece(SH.blob(160 + q() * 260, 9, .25, 7110 + i), { x: x + (q() - .5) * w * .9, y: y + (q() - .5) * h * .9, col: CASE.boardDk, mat: 'felt', depth: 0, seed: 7110 + i, jit: 0, alpha: .45, edge: false }); }
  if (!PAPER.dry) { G.save(); noShadow(); const q = rnd('holes'); G.fillStyle = 'rgba(5,12,13,.55)';
    for (let i = 0; i < 120; i++) { G.beginPath(); G.arc(x + (q() - .5) * w * .95, y + (q() - .5) * h * .95, 1.6 + q() * 1.4, 0, TAU); G.fill(); } G.restore(); }
  if (o.scraps !== false) { const q = rnd('scraps'); for (let i = 0; i < 16; i++) { const sx = x + (q() - .5) * w * .92, sy = y + (q() - .5) * h * .92;
    piece(SH.rect(40 + q() * 90, 20 + q() * 50), { x: sx, y: sy, rot: (q() - .5) * 40, col: q() < .7 ? CASE.paperDk : CASE.paper, mat: 'paper', torn: true, tornAmp: 3, depth: .3, seed: 7130 + i, jit: 0, alpha: .55 }); } }
  if (o.frame !== false) { const t = o.frameW ?? 64;
    [[x, y - h / 2, w + t, t], [x, y + h / 2, w + t, t], [x - w / 2, y, t, h + t], [x + w / 2, y, t, h + t]].forEach(([fx, fy, fw, fh], i) => piece(SH.rect(fw, fh), { x: fx, y: fy, col: CASE.frame, mat: 'wood', depth: 1.4, seed: 7120 + i, jit: 0 })); }
}

// hopCam(lt, stops [[t, x, y, zoom]], { mv, drift }) — the "always moving" camera: a quick eased hop (mv s) to each stop,
// then a slow push-in (drift = extra zoom per second) until the next hop. Use for evidence-to-evidence pacing.
function hopCam(lt, stops, o = {}) {
  const mv = o.mv ?? .38, dr = o.drift ?? .012; let i = 0; while (i + 1 < stops.length && lt >= stops[i + 1][0]) i++;
  const [t0, x1, y1, z1] = stops[i], p = i > 0 ? stops[i - 1] : stops[i], k = i > 0 ? easeOut(seg(lt, t0, t0 + mv)) : 1;
  const pz = p[3] * (1 + dr * Math.max(0, t0 - p[0])), z = lerp(pz, z1, k) * (1 + dr * Math.max(0, lt - t0) * k);
  camBegin(lerp(p[1], x1, k), lerp(p[2], y1, k), z, (o.rot || 0) * D2R);
}

// popIn(k, x, y, fn) — pin something onto the board: scales up from its centre with a little overshoot (k 0 → 1)
function popIn(k, x, y, fn) { if (k <= 0) return; if (k >= 1) return fn(); const s = backOut(k); G.save(); G.translate(x, y); G.scale(s, s); G.translate(-x, -y); fn(); G.restore(); }

// ---------- recurring devices ----------
// exhibitTag(x, y, letter, k, { rot, size }) — white evidence tag, red "EXHIBIT" + big letter; pops in
function exhibitTag(x, y, letter, k = 1, o = {}) {
  if (k <= 0) return; const s = o.size || 1, w = 200 * s, h = 92 * s, p = k < 1 ? backOut(k) : 1;
  G.save(); G.translate(x, y); G.rotate((o.rot ?? -6) * D2R); G.scale(p, p);
  piece(SH.round(w, h, 10 * s), { col: '#F4F0E6', mat: 'card', depth: 1.7, seed: 7201 + letter.charCodeAt(0), jit: 0 });
  piece(SH.rect(w, h * .34), { y: -h * .33, col: CASE.red, mat: 'paper', depth: .1, seed: 7202, jit: 0, edge: false });
  print('EXHIBIT', 0, -h * .23, `700 ${h * .24}px ${TF.cond}`, { col: '#FBF4E6', ls: 4 * s });
  print(letter, 0, h * .4, `${h * .5}px ${TF.tab}`, { col: CASE.ink });
  G.restore();
}
// redFlags(x, y, n, k, { s }) — the episode tally card: little red flags + the count; the newest flag pops (k)
function redFlags(x, y, n, k = 1, o = {}) {
  const s = o.s || 1, w = 330 * s, h = 150 * s;
  G.save(); G.translate(x, y); G.rotate((o.rot ?? 2) * D2R);
  piece(SH.rect(w, h), { col: CASE.paper, mat: 'paper', torn: 'top', depth: 1.5, seed: 7210, jit: 0 });
  print('RED FLAGS', -w * .44, -h * .2, `700 ${h * .2}px ${TF.cond}`, { align: 'left', ls: 3 * s, alpha: .85 });
  const shown = Math.min(n, 8);
  for (let i = 0; i < shown; i++) { const pop = i === n - 1 ? (k < 1 ? backOut(k) : 1) : 1; if (pop <= 0) continue;
    G.save(); G.translate(-w * .41 + i * w * .085, h * .3); G.scale(pop, pop); G.rotate((hash(i * 3.1) - .5) * .25);
    G.fillStyle = '#3A3533'; G.fillRect(-1.5 * s, -h * .32, 3 * s, h * .36);
    piece(SH.poly([[0, -h * .32], [w * .065, -h * .25], [0, -h * .18]]), { col: CASE.red, mat: 'paper', depth: .6, seed: 7220 + i, jit: 0 }); G.restore(); }
  const nk = k < 1 && n > 0 ? lerp(1.5, 1, easeOut(k)) : 1;
  G.save(); G.translate(w * .34, h * .1); G.scale(nk, nk); print(String(n), 0, h * .2, `${h * .62}px ${TF.tab}`, { col: CASE.red }); G.restore();
  G.restore();
}
// whoKnew(x, y, k, { txt, rot, s }) — yellow sticky note slapped on: "WHO KNEW?" in marker (write-on after the slap)
function whoKnew(x, y, k = 1, o = {}) {
  if (k <= 0) return; const s = o.s || 1, w = 270 * s, slap = seg(k, 0, .35), wr = seg(k, .3, 1), sc = slap < 1 ? lerp(1.35, 1, easeIn(slap)) : 1;
  G.save(); G.translate(x, y); G.rotate((o.rot ?? 5) * D2R); G.scale(sc, sc); G.globalAlpha *= slap < 1 ? .6 + .4 * slap : 1;
  piece(SH.rect(w, w), { col: CASE.sticky, mat: 'paper', depth: 1.4, seed: 7230, jit: 0 });
  piece(SH.rect(w, w * .16), { y: -w * .42, col: mixCol(CASE.sticky, '#B08A10', .18), mat: 'paper', depth: 0, seed: 7231, jit: 0, edge: false, alpha: .6 });
  const L = (o.txt || 'WHO|KNEW?').split('|');
  L.forEach((t, i) => markerText(t, 0, -w * .05 + i * w * .3 - (L.length - 2) * w * .15, w * .24, clamp(wr * L.length - i), { col: CASE.ink }));
  G.restore();
}
// timeStamp(x, y, txt, k, { rot, size, col }) — red label-maker strip, types on: "OCT 19 2025 · 09:30"
function timeStamp(x, y, txt, k = 1, o = {}) {
  if (k <= 0) return; const n = Math.max(1, Math.round([...txt].length * clamp(k * 1.4)));
  const shown = [...txt].slice(0, n).join(''), size = o.size || 34, font = `700 ${size}px ${TF.cond}`, w = textW(txt, font, size * .16) + size * 1.1, h = size * 1.45;
  G.save(); G.translate(x, y); G.rotate((o.rot ?? -2) * D2R);
  piece(SH.rect(w, h), { col: o.col || CASE.red, mat: 'card', depth: 1.3, seed: 7240 + (o.seed || 0), jit: 0 });
  print(shown, -w / 2 + size * .55, size * .36, font, { align: 'left', col: '#FBF1E6', ls: size * .16, alpha: .96 });
  G.restore();
}
// statusTag(x, y, status, k, { rot, size }) — the legal status of a person, always shown with them on screen
function statusTag(x, y, status, k = 1, o = {}) {
  if (k <= 0) return; const st = String(status).toUpperCase(), col = STATUS[st.split(' ')[0]] || CASE.red, size = o.size || 36, font = `${size}px ${TF.tab}`;
  const w = textW(st, font, size * .1) + size * 1.2, h = size * 1.5, sc = k < 1 ? lerp(1.5, 1, easeIn(k)) : 1;
  G.save(); G.translate(x, y); G.rotate((o.rot ?? -4) * D2R); G.scale(sc, sc);
  piece(SH.rect(w, h), { col, mat: 'card', depth: 1.6, seed: 7250 + st.length, jit: 0 });
  print(st, 0, size * .36, font, { col: '#FBF4E6', ls: size * .1 });
  G.restore();
}

// ---------- people ----------
// wantedPoster(x, y, w, puppet, { name, sub, reward, face, aged, rot, seed, pin }) → pin point
function wantedPoster(x, y, w, puppet, o = {}) {
  const h = w * 1.42;
  return pinCard(x, y, w, h, { col: '#E9DFC4', mat: 'news', torn: o.torn ?? true, aged: o.aged ?? .5, seed: o.seed || 7300, rot: o.rot ?? -2, fasten: o.fasten || 'pin', ...o, draw: (cw, ch) => {
    print('WANTED', 0, -ch / 2 + cw * .2, `${cw * .2}px ${TF.tab}`, { col: CASE.ink, ls: cw * .015 });
    G.fillStyle = CASE.ink; G.globalAlpha = .8; G.fillRect(-cw * .42, -ch / 2 + cw * .245, cw * .84, 3); G.globalAlpha = 1;
    const iw = cw * .62; G.save(); noShadow(); G.drawImage(mugCanvas(puppet, { face: o.face || 'smug' }), -iw / 2, -ch / 2 + cw * .29, iw, iw); G.restore();
    G.strokeStyle = CASE.ink; G.lineWidth = 3; G.strokeRect(-iw / 2, -ch / 2 + cw * .29, iw, iw);
    if (o.name) print(o.name.toUpperCase(), 0, -ch / 2 + cw * 1.03, `700 ${cw * .085}px ${TF.cond}`, { ls: 2 });
    if (o.sub) print(o.sub, 0, -ch / 2 + cw * 1.12, `${cw * .05}px ${TF.type}`, { alpha: .8 });
    if (o.reward) print(o.reward, 0, -ch / 2 + cw * 1.27, `${cw * .1}px ${TF.tab}`, { col: CASE.redDk });
  } });
}
// mugshotBoard(x, y, w, puppet, { face, number, name, k }) — height-chart backdrop + puppet head + placard (k: flash in)
function mugshotBoard(x, y, w, puppet, o = {}) {
  const h = w * .9;
  G.save(); G.translate(x, y); G.rotate((o.rot || 0) * D2R);
  piece(SH.rect(w, h), { col: '#C9CDCB', mat: 'card', depth: 1.4, seed: 7310, jit: 0 });
  if (!PAPER.dry) { G.save(); noShadow(); G.strokeStyle = 'rgba(30,30,30,.55)'; G.fillStyle = 'rgba(30,30,30,.7)';
    for (let i = 0; i <= 8; i++) { const yy = h / 2 - i * h / 8.5; G.lineWidth = i % 2 ? 1.5 : 3; G.beginPath(); G.moveTo(-w / 2 + 10, yy); G.lineTo(w / 2 - 10, yy); G.stroke();
      if (i % 2 === 0) { G.font = `700 ${w * .04}px ${TF.cond}`; G.fillText(`${4 + i / 2}'`, -w / 2 + 14, yy - 6); } } G.restore(); }
  const iw = w * .7; G.save(); noShadow(); G.drawImage(mugCanvas(puppet, { face: o.face || 'nervous' }), -iw / 2, -h / 2 + h * .02, iw, iw); G.restore();
  piece(SH.rect(w * .56, h * .2), { y: h * .34, col: '#1E1B1C', mat: 'card', depth: 1.8, seed: 7311, jit: 0 });
  print(o.number || 'No. 0000 0000', 0, h * .32, `700 ${w * .045}px ${TF.cond}`, { col: '#EDE7DA', ls: 2 });
  if (o.name) print(o.name.toUpperCase(), 0, h * .4, `${w * .04}px ${TF.type}`, { col: '#EDE7DA' });
  if (o.k != null && o.k < 1) { G.fillStyle = `rgba(255,255,255,${(1 - o.k) * .85})`; G.fillRect(-w / 2, -h / 2, w, h); }
  G.restore();
}
// passport(x, y, w, { rot, open, label, seed }) — a generic passport booklet (no real national design)
function passport(x, y, w = 260, o = {}) {
  const h = w * 1.38; G.save(); G.translate(x, y); G.rotate((o.rot ?? 8) * D2R);
  piece(SH.round(w, h, w * .05), { col: o.col || '#3A2430', mat: 'card', depth: 1.7, seed: o.seed || 7320, jit: 0 });
  if (!PAPER.dry) { G.save(); noShadow(); G.strokeStyle = 'rgba(214,180,100,.85)'; G.lineWidth = w * .015; G.beginPath(); G.arc(0, -h * .02, w * .2, 0, TAU); G.stroke(); G.beginPath(); G.arc(0, -h * .02, w * .13, 0, TAU); G.stroke(); G.restore(); }
  print(o.label || 'PASSPORT', 0, -h * .3, `700 ${w * .11}px ${TF.cond}`, { col: '#D6B464', ls: w * .02 });
  print('◆', 0, h * .3, `${w * .08}px ${TF.cond}`, { col: '#D6B464' });
  G.restore();
}
// boardingPass(x, y, w, from, to, { date, seat, name, rot, seed, k }) — k types the destination on
function boardingPass(x, y, w, from, to, o = {}) {
  const h = w * .38; G.save(); G.translate(x, y); G.rotate((o.rot ?? -5) * D2R);
  piece(SH.rect(w, h), { col: '#F3F0E8', mat: 'card', depth: 1.6, seed: o.seed || 7330, jit: 0 });
  piece(SH.rect(w, h * .2), { y: -h * .4, col: CASE.blue, mat: 'paper', depth: 0, seed: 7331, jit: 0, edge: false });
  print('BOARDING PASS', -w * .45, -h * .36, `700 ${h * .11}px ${TF.cond}`, { align: 'left', col: '#F3F0E8', ls: 3 });
  print(from, -w * .3, h * .12, `${h * .3}px ${TF.tab}`, { col: CASE.ink });
  print('✈', 0, h * .1, `${h * .22}px ${TF.cond}`, { col: CASE.blue });
  const n = o.k == null ? to.length : Math.round(to.length * clamp(o.k)); print(to.slice(0, n), w * .26, h * .12, `${h * .3}px ${TF.tab}`, { col: CASE.red });
  if (o.name) print('PASSENGER  ' + o.name.toUpperCase(), -w * .45, h * .36, `${h * .085}px ${TF.type}`, { align: 'left', alpha: .8 });
  if (o.date) print(o.date, w * .45, h * .36, `${h * .085}px ${TF.type}`, { align: 'right', alpha: .8 });
  G.setLineDash([6, 6]); G.strokeStyle = 'rgba(40,40,40,.35)'; G.lineWidth = 2; G.beginPath(); G.moveTo(w * .36, -h * .3); G.lineTo(w * .36, h / 2 - 6); G.stroke(); G.setLineDash([]);
  G.restore();
}

// ---------- scams: generic messenger + feed post ----------
// chatCard(x, y, w, msgs [[side 'in'|'out', text]], k, { title, sub, rot, seed }) — paper phone; bubbles appear in order (k)
function chatCard(x, y, w, msgs, k = 1, o = {}) {
  const fs = w * .052, lh = fs * 1.25, pad = w * .06, maxW = w * .68, font = `500 ${fs}px ${TF.cond}`;
  const laid = msgs.map(([side, txt]) => { const L = wrapLines(txt, font, maxW - pad); return { side, L, bw: Math.max(...L.map(l => textW(l, font))) + pad * 1.2, bh: L.length * lh + pad * .7 }; });
  const h = o.h || Math.max(w * 1.1, laid.reduce((a, b) => a + b.bh + pad * .45, 0) + w * .36);
  G.save(); G.translate(x, y); G.rotate((o.rot ?? 0) * D2R);
  piece(SH.round(w + 26, h + 26, w * .1), { col: '#232627', mat: 'card', depth: 1.8, seed: (o.seed || 7400) + 1, jit: 0 });
  piece(SH.round(w, h, w * .07), { col: '#ECEFEE', mat: 'card', depth: .2, seed: o.seed || 7400, jit: 0, edge: false });
  piece(SH.rect(w, w * .2), { y: -h / 2 + w * .1, col: '#D7DEDD', mat: 'paper', depth: 0, seed: 7402, jit: 0, edge: false });
  piece(SH.circle(w * .055), { x: -w * .36, y: -h / 2 + w * .1, col: o.avatar || '#8FA3A8', mat: 'paper', depth: .3, seed: 7403, jit: 0 });
  print(o.title || 'Unknown number', -w * .27, -h / 2 + w * .1, `700 ${fs * 1.05}px ${TF.cond}`, { align: 'left', col: CASE.ink });
  if (o.sub) print(o.sub, -w * .27, -h / 2 + w * .16, `${fs * .75}px ${TF.cond}`, { align: 'left', col: '#3E8E5E' });
  let cy = -h / 2 + w * .26; const N = laid.length;
  laid.forEach((m, i) => { const kk = clamp(k * N - i); if (kk <= 0) return; const p = kk < 1 ? backOut(kk) : 1, out = m.side === 'out';
    const bx = out ? w / 2 - pad - m.bw / 2 : -w / 2 + pad + m.bw / 2, by = cy + m.bh / 2;
    G.save(); G.translate(bx, by); G.scale(p, p);
    piece(SH.round(m.bw, m.bh, fs * .7), { col: out ? '#CFE8D2' : '#FFFFFF', mat: 'paper', depth: .5, seed: 7410 + i, jit: 0 });
    m.L.forEach((l, j) => print(l, -m.bw / 2 + pad * .6, -m.bh / 2 + pad * .35 + lh * (j + .8), font, { align: 'left', col: CASE.ink }));
    G.restore(); cy += m.bh + pad * .45; });
  G.restore();
}
// socialPost(x, y, w, { name, handle, text, likes, img, rot, seed, k }) — generic feed post (no platform branding)
function socialPost(x, y, w, o = {}) {
  const fs = w * .045, font = `500 ${fs}px ${TF.cond}`, L = wrapLines(o.text || '', font, w * .86), ph = o.img ? w * .52 : 0, h = w * .2 + L.length * fs * 1.3 + ph + w * .14;
  const p = o.k == null ? 1 : o.k < 1 ? backOut(o.k) : 1; if (p <= 0) return;
  G.save(); G.translate(x, y); G.rotate((o.rot ?? 2) * D2R); G.scale(p, p);
  piece(SH.round(w, h, w * .03), { col: '#FAFAF7', mat: 'card', depth: 1.6, seed: o.seed || 7420, jit: 0 });
  piece(SH.circle(w * .05), { x: -w * .4, y: -h / 2 + w * .09, col: o.avatar || '#C88A5A', mat: 'paper', depth: .3, seed: 7421, jit: 0 });
  print(o.name || 'Account', -w * .33, -h / 2 + w * .085, `700 ${fs}px ${TF.cond}`, { align: 'left', col: CASE.ink });
  print(o.handle || '@account', -w * .33, -h / 2 + w * .13, `${fs * .8}px ${TF.cond}`, { align: 'left', col: '#6C7275' });
  let cy = -h / 2 + w * .2; L.forEach(l => { cy += fs * 1.3; print(l, -w * .43, cy, font, { align: 'left', col: CASE.ink }); });
  if (ph) { cy += w * .03; G.save(); noShadow(); if (typeof o.img === 'function') { G.beginPath(); G.rect(-w * .43, cy, w * .86, ph); G.clip(); G.translate(0, cy + ph / 2); o.img(w * .86, ph); } G.restore(); cy += ph; }
  print('♥ ' + (o.likes || '12.4K') + '     ↻ ' + (o.shares || '3.1K'), -w * .43, h / 2 - w * .04, `${fs * .85}px ${TF.cond}`, { align: 'left', col: '#6C7275' });
  G.restore();
}

// ---------- news ----------
// newsTicker(t, items, { y, label, speed }) — screen-fixed bottom ticker strip (call after camEnd())
function newsTicker(t, items, o = {}) {
  if (PAPER.dry) return; const y = o.y ?? H - 70, h = o.h || 62, sp = o.speed || 170;
  G.save(); G.setTransform(1, 0, 0, 1, 0, 0); setShadow(1.2, 1);
  G.fillStyle = mat('#F1ECDF', 'paper'); G.fillRect(0, y - h / 2, W, h); noShadow();
  const txt = items.join('   ◆   ') + '   ◆   ', font = `700 ${h * .5}px ${TF.cond}`, tw = textW(txt, font), off = (onStep(t, 12) * sp) % tw;
  G.save(); G.beginPath(); G.rect(250, y - h / 2, W - 250, h); G.clip();
  for (let x0 = 250 - off; x0 < W; x0 += tw) print(txt, x0, y + h * .18, font, { align: 'left', col: CASE.ink }); G.restore();
  G.fillStyle = mat(CASE.red, 'card'); G.fillRect(0, y - h / 2 - 6, 250, h + 12);
  print(o.label || 'BREAKING', 125, y + h * .2, `${h * .58}px ${TF.tab}`, { col: '#FBF4E6', ls: 2 });
  G.restore();
}
// breakingBanner(k, txt, { y, sub }) — a torn red strip slams across the screen (screen-fixed, after camEnd())
function breakingBanner(k, txt, o = {}) {
  if (k <= 0 || PAPER.dry) return; const y = o.y ?? H * .5, s = k < 1 ? lerp(1.25, 1, easeIn(k)) : 1, x = lerp(-W * .6, 0, easeOut(seg(k, 0, .6)));
  G.save(); G.setTransform(1, 0, 0, 1, 0, 0); G.translate(W / 2 + x, y); G.rotate(-3 * D2R); G.scale(s, s);
  piece(SH.rect(W * 1.2, 190), { col: CASE.red, mat: 'card', torn: true, tornAmp: 7, depth: 2.2, seed: 7450, jit: 0 });
  print(txt, 0, 38, `120px ${TF.tab}`, { col: '#FBF4E6', ls: 6 });
  if (o.sub) { piece(SH.rect(W * .55, 64), { y: 128, x: 220, col: '#F1ECDF', mat: 'paper', torn: true, tornAmp: 3, depth: 1.4, seed: 7451, jit: 0 }); print(o.sub, 220, 142, `700 40px ${TF.cond}`, { col: CASE.ink, ls: 2 }); }
  G.restore();
}
// courtSet({ judge }) — courtroom: panelled wall, the bench, a judge silhouette, the seal (generic) — draw inside a camera
function courtSet(o = {}) {
  backdrop('#3B2A20', { mat: 'wood', to: 'rgba(10,6,4,.55)' });
  for (let i = 0; i < 7; i++) piece(SH.rect(250, 600), { x: 160 + i * 270, y: 380, col: '#4A3426', mat: 'wood', depth: .3, seed: 7460 + i, jit: 0 });
  piece(SH.circle(110), { x: 960, y: 230, col: '#C9A04A', mat: 'card', depth: .8, seed: 7470, jit: 0 }); piece(SH.circle(80), { x: 960, y: 230, col: '#E0C27A', mat: 'card', depth: .3, seed: 7471, jit: 0 });
  print('⚖', 960, 262, `100px ${TF.cond}`, { col: '#6B4E1E' });
  if (o.judge !== false) { piece(SH.ellipse(70, 84), { x: 960, y: 470, col: '#151214', mat: 'card', depth: 1, seed: 7472, jit: 0 }); piece(SH.round(360, 300, 120), { x: 960, y: 690, col: '#151214', mat: 'card', depth: 1, seed: 7473, jit: 0 }); }
  piece(SH.rect(1500, 330), { x: 960, y: 900, col: '#5C3D29', mat: 'wood', depth: 1.5, seed: 7474, jit: 0 });
  piece(SH.rect(1540, 40), { x: 960, y: 735, col: '#6E4A32', mat: 'wood', depth: 1.7, seed: 7475, jit: 0 });
}
// gavel(x, y, s, k) — k 0 → 1: lifted → struck (impact on the last step)
function gavel(x, y, s = 1, k = 1, o = {}) {
  const a = k < .7 ? lerp(-50, -60, k / .7) : lerp(-60, 0, easeIn(seg(k, .7, 1)));
  piece(SH.ellipse(110 * s, 34 * s), { x, y: y + 52 * s, col: '#4E3020', mat: 'wood', depth: 1.4, seed: 7480, jit: 0 });
  G.save(); G.translate(x + 150 * s, y); G.rotate(a * D2R);
  piece(SH.round(260 * s, 24 * s, 10 * s), { x: -120 * s, col: '#6B4228', mat: 'wood', depth: 2, seed: 7481, jit: 0 });
  piece(SH.round(80 * s, 130 * s, 18 * s), { x: -260 * s, col: '#5A3622', mat: 'wood', depth: 2.2, seed: 7482, jit: 0 });
  G.restore();
}

// ---------- money ----------
// cryptoCrash(x, y, w, h, pts [[0..1 x, value]], k, { label, cur, unit, rot, seed, crashAt }) — black screen-card price chart;
// green while rising, red after the peak, live price readout tracks the drawn tip.
function cryptoCrash(x, y, w, h, pts, k = 1, o = {}) {
  G.save(); G.translate(x, y); G.rotate((o.rot ?? -1.5) * D2R);
  piece(SH.round(w, h, 18), { col: '#121718', mat: 'card', depth: 1.7, seed: o.seed || 7500, jit: 0 });
  const L = -w / 2 + 50, R = w / 2 - 40, T = -h / 2 + 110, B = h / 2 - 50, vmax = Math.max(...pts.map(p => p[1])) * 1.08;
  if (!PAPER.dry) { G.save(); noShadow(); G.strokeStyle = 'rgba(160,190,190,.12)'; G.lineWidth = 1.5; for (let i = 0; i <= 4; i++) { const yy = lerp(T, B, i / 4); G.beginPath(); G.moveTo(L, yy); G.lineTo(R, yy); G.stroke(); }
    const P = pts.map(([u, v]) => [lerp(L, R, u), lerp(B, T, v / vmax)]), Q = partial(P, k), pk = pts.reduce((a, b, i) => b[1] > pts[a][1] ? i : a, 0);
    G.lineWidth = 6; G.lineJoin = 'round'; G.lineCap = 'round';
    for (let i = 1; i < Q.length; i++) { G.strokeStyle = i <= pk ? '#46C47A' : '#E5483C'; G.beginPath(); G.moveTo(...Q[i - 1]); G.lineTo(...Q[i]); G.stroke(); }
    const tip = Q[Q.length - 1], u = (tip[0] - L) / (R - L); let v = 0; for (let i = 1; i < pts.length; i++) if (u <= pts[i][0]) { v = lerp(pts[i - 1][1], pts[i][1], (u - pts[i - 1][0]) / Math.max(1e-6, pts[i][0] - pts[i - 1][0])); break; }
    G.fillStyle = Q.length - 1 > pk ? '#E5483C' : '#46C47A'; G.beginPath(); G.arc(tip[0], tip[1], 10, 0, TAU); G.fill();
    const pkv = pts[pk][1], base = Q.length - 1 > pk && o.fromPeak !== false ? pkv : pts[0][1], pct = ((v - base) / base * 100);
    print(o.label || 'COIN / USD', L, -h / 2 + 48, `700 ${h * .055}px ${TF.cond}`, { align: 'left', col: '#C6D2D2', ls: 2 });
    print((o.cur ?? '$') + (o.fmt ? o.fmt(v) : v.toFixed(2)), L, -h / 2 + 94, `${h * .075}px ${TF.tab}`, { align: 'left', col: Q.length - 1 > pk ? '#E5483C' : '#46C47A' });
    print((pct >= 0 ? '▲ ' : '▼ ') + Math.abs(pct).toFixed(1) + '%' + (base === pkv && pct < 0 ? ' FROM PEAK' : ''), R, -h / 2 + 94, `700 ${h * .06}px ${TF.cond}`, { align: 'right', col: pct >= 0 ? '#46C47A' : '#E5483C' });
    G.restore(); }
  G.restore();
}
// transferSlip(x, y, w, { from, to, amount, ref, date, rot, seed, redact: ['from'|'to'|'ref'], peel }) — a wire transfer slip
function transferSlip(x, y, w = 560, o = {}) {
  const h = w * .62, rows = [['FROM', o.from || 'Account ••••'], ['TO', o.to || 'Account ••••'], ['AMOUNT', o.amount || '$0'], ['REFERENCE', o.ref || '—'], ['DATE', o.date || '—']];
  G.save(); G.translate(x, y); G.rotate((o.rot ?? 3) * D2R);
  piece(SH.rect(w, h), { col: '#E8EEE6', mat: 'paper', depth: 1.5, seed: o.seed || 7510, jit: 0 });
  piece(SH.rect(w, h * .16), { y: -h * .42, col: '#5E7A6A', mat: 'paper', depth: 0, seed: 7511, jit: 0, edge: false });
  print('WIRE TRANSFER ORDER', -w * .45, -h * .385, `700 ${h * .075}px ${TF.cond}`, { align: 'left', col: '#F1F5EE', ls: 3 });
  rows.forEach(([k2, v], i) => { const yy = -h * .2 + i * h * .15;
    print(k2, -w * .45, yy, `700 ${h * .05}px ${TF.cond}`, { align: 'left', alpha: .65, ls: 2 });
    print(v, -w * .1, yy, `${k2 === 'AMOUNT' ? h * .085 : h * .06}px ${k2 === 'AMOUNT' ? TF.tab : TF.type}`, { align: 'left', col: k2 === 'AMOUNT' ? CASE.redDk : CASE.ink });
    G.strokeStyle = 'rgba(40,60,50,.25)'; G.lineWidth = 1.2; G.beginPath(); G.moveTo(-w * .12, yy + h * .03); G.lineTo(w * .45, yy + h * .03); G.stroke();
    if ((o.redact || []).includes(k2.toLowerCase())) redact(w * .17, yy - h * .025, w * .54, h * .085, 1, { peel: o.peel, seed: i + 3 }); });
  G.restore();
}
// moneyFlow(nodes {id: [x, y, label, sub]}, edges [[from, to, amount, t0, t1]], t, { col }) — boxes with marker arrows; each
// edge draws on between t0..t1 (stepped time), then a coin travels along it on a loop. Labels sit at the arrow middle.
function moneyFlow(nodes, edges, st, o = {}) {
  edges.forEach(([a, b, amt, t0, t1], i) => { const A = nodes[a], B = nodes[b]; if (!A || !B) return; const k = seg(st, t0, t1); if (k <= 0) return;
    const dx = B[0] - A[0], dy = B[1] - A[1], d = Math.hypot(dx, dy), ux = dx / d, uy = dy / d, p0 = [A[0] + ux * 170, A[1] + uy * 95], p1 = [B[0] - ux * 170, B[1] - uy * 95];
    markerArrow(p0, p1, k, { w: 10, col: o.col || '#E8483A', head: 34, bend: .12 * (i % 2 ? 1 : -1), comp: 'source-over', alpha: .95 });
    if (k >= 1) { const c = frac(onStep(st - t1, 12) * .45 + i * .3), cp = [lerp(p0[0], p1[0], c), lerp(p0[1], p1[1], c)];
      piece(SH.circle(17), { x: cp[0], y: cp[1] - 6, col: NC.gold, mat: 'card', depth: 1.2, seed: 7520 + i, jit: 0 }); print('$', cp[0], cp[1] + 4, `700 20px ${TF.cond}`, { col: '#7A5A12' }); }
    if (amt && k > .5) { const mx = (p0[0] + p1[0]) / 2 + uy * 70, my = (p0[1] + p1[1]) / 2 - ux * 70, pk = seg(k, .5, .8), sc = pk < 1 ? backOut(pk) : 1, fw = textW(amt, `56px ${TF.tab}`) + 40;
      G.save(); G.translate(mx, my); G.rotate((i % 2 ? 4 : -4) * D2R); G.scale(sc, sc); piece(SH.rect(fw, 80), { col: CASE.paper, mat: 'paper', torn: true, tornAmp: 3, depth: 1.5, seed: 7535 + i, jit: 0 }); print(amt, 0, 22, `56px ${TF.tab}`, { col: CASE.red }); G.restore(); } });
  Object.entries(nodes).forEach(([id, [x, y, lab, sub]], i) => { const k = o.nodeK ? o.nodeK(id) : 1; if (k <= 0) return; const p = k < 1 ? backOut(k) : 1;
    G.save(); G.translate(x, y); G.scale(p, p); G.rotate((hash(i * 5.3) - .5) * 4 * D2R);
    piece(SH.rect(300, 150), { col: CASE.paper, mat: 'paper', torn: 'top', depth: 1.4, seed: 7530 + i, jit: 0 });
    print(lab, 0, sub ? -4 : 16, `${lab.length > 9 ? 40 : 50}px ${TF.tab}`, { col: CASE.ink }); if (sub) print(sub, 0, 44, `${26}px ${TF.type}`, { alpha: .75 });
    pushpin(0, -58, CASE.red, 10); G.restore(); });
}
// countdownCard(x, y, s, secs, { label, rot }) — big flip-style digits HH:MM:SS (or MM:SS) on black card
function countdownCard(x, y, s, secs, o = {}) {
  const v = Math.max(0, Math.floor(secs)), hh = Math.floor(v / 3600), mm = Math.floor(v % 3600 / 60), ss = v % 60, p2 = n => String(n).padStart(2, '0');
  const txt = (o.hours === false ? '' : p2(hh) + ':') + p2(mm) + ':' + p2(ss), w = (o.hours === false ? 430 : 620) * s, h = 210 * s;
  G.save(); G.translate(x, y); G.rotate((o.rot ?? 1.5) * D2R);
  piece(SH.round(w, h, 18 * s), { col: '#141819', mat: 'card', depth: 1.8, seed: 7540, jit: 0 });
  if (o.label) print(o.label, 0, -h * .3, `700 ${h * .14}px ${TF.cond}`, { col: '#9FB1B1', ls: 4 * s });
  print(txt, 0, h * .32, `${h * .5}px ${TF.tab}`, { col: o.col || '#F05A4A', ls: 6 * s });
  G.restore();
}

// ---------- heists ----------
// blueprint(x, y, w, h, { rooms [[x,y,w,h,label]] (units 0..1 of the sheet), route [[u,v]...], k, title, rot, seed })
function blueprint(x, y, w, h, o = {}) {
  G.save(); G.translate(x, y); G.rotate((o.rot ?? -1) * D2R);
  piece(SH.rect(w, h), { col: CASE.bp, mat: 'paper', depth: 1.3, seed: o.seed || 7600, jit: 0 });
  if (!PAPER.dry) { G.save(); noShadow(); G.strokeStyle = 'rgba(207,224,240,.16)'; G.lineWidth = 1; for (let gx = -w / 2; gx < w / 2; gx += 40) { G.beginPath(); G.moveTo(gx, -h / 2); G.lineTo(gx, h / 2); G.stroke(); }
    for (let gy = -h / 2; gy < h / 2; gy += 40) { G.beginPath(); G.moveTo(-w / 2, gy); G.lineTo(w / 2, gy); G.stroke(); }
    G.strokeStyle = 'rgba(225,238,250,.85)'; G.lineWidth = 5;
    (o.rooms || []).forEach(([u, v, rw, rh, lab]) => { const rx = -w / 2 + u * w, ry = -h / 2 + v * h; G.strokeRect(rx, ry, rw * w, rh * h); if (lab) print(lab, rx + rw * w / 2, ry + rh * h / 2 + 10, `700 ${Math.min(30, rw * w * .12)}px ${TF.cond}`, { col: CASE.bpLine, ls: 2, alpha: .9 }); });
    if (o.title) print(o.title, -w / 2 + 30, h / 2 - 28, `700 30px ${TF.cond}`, { align: 'left', col: CASE.bpLine, ls: 4 });
    G.restore();
    if (o.route) { const P = o.route.map(([u, v]) => [-w / 2 + u * w, -h / 2 + v * h]), Q = partial(P, o.k ?? 1);
      G.save(); G.setLineDash([18, 12]); G.strokeStyle = '#FF5A4A'; G.lineWidth = 8; G.lineCap = 'round'; G.beginPath(); G.moveTo(...Q[0]); Q.forEach(q => G.lineTo(...q)); G.stroke(); G.setLineDash([]);
      const tip = Q[Q.length - 1]; G.fillStyle = '#FF5A4A'; G.beginPath(); G.arc(tip[0], tip[1], 14, 0, TAU); G.fill(); G.restore(); } }
  G.restore();
}
// cctvFrame(x, y, w, h, drawFn, { cam, time, rot, seed }) — draws drawFn (in a 1920×1080 frame space) into a grey, scan-lined
// surveillance still with REC dot + timestamp. drawFn may use any kit piece; it is rendered with the world reset.
const CCTV = {};
function cctvFrame(x, y, w, h, drawFn, o = {}) {
  if (PAPER.dry) return; const b = CCTV[o.key || 'a'] || (CCTV[o.key || 'a'] = makeCanvas(960, 540));
  renderTo(b, new DOMMatrix([.5, 0, 0, .5, 0, 0]), () => { G.fillStyle = '#777'; G.fillRect(0, 0, W, H); drawFn(); });
  G.save(); G.translate(x, y); G.rotate((o.rot ?? 1) * D2R);
  piece(SH.rect(w + 30, h + 30), { col: '#F1EEE6', mat: 'card', depth: 1.6, seed: o.seed || 7610, jit: 0 });
  G.save(); noShadow(); G.filter = 'grayscale(1) contrast(1.35) brightness(.92)'; G.drawImage(b, -w / 2, -h / 2, w, h); G.filter = 'none';
  G.fillStyle = 'rgba(0,0,0,.18)'; for (let yy = -h / 2; yy < h / 2; yy += 6) G.fillRect(-w / 2, yy, w, 2);
  G.fillStyle = 'rgba(40,70,60,.18)'; G.fillRect(-w / 2, -h / 2, w, h);
  if (frac(onStep(T, 12) * .5) < .6) { G.fillStyle = '#FF3B30'; G.beginPath(); G.arc(-w / 2 + 34, -h / 2 + 34, 11, 0, TAU); G.fill(); }
  G.font = `700 ${h * .055}px ${TF.cond}`; G.fillStyle = '#F2F2F2'; G.textAlign = 'left'; G.fillText('REC  ' + (o.cam || 'CAM 04'), -w / 2 + 54, -h / 2 + 46);
  G.textAlign = 'right'; G.fillText(o.time || '09:34:12', w / 2 - 22, h / 2 - 22); G.restore();
  G.restore();
}

// ---------- vertical (9:16) helper for Shorts ----------
// Shorts: set PROJECT.w = 1080, PROJECT.h = 1920 in config.js (kit.js sizes the canvas from PROJECT). Lay scenes out for
// the tall frame; vSafe = the area that stays clear of YouTube's Shorts UI.
const vSafe = { x0: 60, x1: 1020, y0: 230, y1: 1500 };
