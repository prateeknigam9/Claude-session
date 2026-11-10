# voice_part.py <N> <step>   steps: lines | warp
#   lines: part<N>/src/vo_part<N>.js → part<N>/vo/LINES.tsv (gaps from the plan; 'Ruja' spelled for TTS)
#   warp : VO.tsv → src/warp.js (real→planned), vo/warp.json, out/part<N>.srt, config duration, sound/cues_p<N>_voiced.tsv
import json, re, sys, os
N, step = sys.argv[1], sys.argv[2]; D = f'part{N}'
rows = json.loads(re.search(r'voTrack\((\[.*\])\);', open(f'{D}/src/vo_part{N}.js', encoding='utf8').read(), re.S).group(1))
if step == 'lines':
    os.makedirs(f'{D}/vo', exist_ok=True); out = ['id\ttext\tgap']
    for i, (a, b, t) in enumerate(rows):
        d = rows[i + 1][0] - b if i + 1 < len(rows) else 1.2; gap = round(d - .3 if d > 2 else max(.15, min(.5, d)), 2)
        out.append(f'{i + 1:02d}\t' + t.replace('Ruja', 'Rooja').replace('…', '...') + f'\t{gap}')
    open(f'{D}/vo/LINES.tsv', 'w', encoding='utf8').write('\n'.join(out) + '\n'); print(len(rows), 'lines')
else:
    vo = [l.rstrip('\n').split('\t') for l in open(f'{D}/vo/VO.tsv', encoding='utf8')][1:]
    OFF = rows[0][0]; pts = [[0.0, 0.0]] + [[round(OFF + float(s), 3), a] for (a, b, t), (i, s, d, tx) in zip(rows, vo)]
    lastR = OFF + float(vo[-1][1]) + float(vo[-1][2]); pts.append([round(lastR, 3), rows[-1][1]]); dur = round(lastR + 2.0, 2)
    open(f'{D}/src/warp.js', 'w', encoding='utf8').write('// warp.js — generated: maps REAL time (voice) → PLANNED storyboard time, piecewise linear on line starts\nconst WARP_PTS = ' + json.dumps(pts) + ';\nwindow.WARP = t => { const P = WARP_PTS; if (t <= P[0][0]) return t; for (let i = 1; i < P.length; i++) if (t <= P[i][0]) { const [r0, p0] = P[i - 1], [r1, p1] = P[i]; return p0 + (t - r0) * (p1 - p0) / Math.max(1e-6, r1 - r0); } const [r, p] = P[P.length - 1]; return p + (t - r); };\n')
    json.dump({'pts': pts, 'dur': dur, 'off': OFF}, open(f'{D}/vo/warp.json', 'w'))
    fmt = lambda x: f'{int(x // 3600):02d}:{int(x % 3600 // 60):02d}:{int(x % 60):02d},{int(round((x % 1) * 1000)) % 1000:03d}'
    srt = [f'{n}\n{fmt(OFF + float(s))} --> {fmt(OFF + float(s) + float(d) + .15)}\n{t}' for n, ((a, b, t), (i, s, d, tx)) in enumerate(zip(rows, vo), 1)]
    os.makedirs(f'{D}/out', exist_ok=True); open(f'{D}/out/part{N}.srt', 'w', encoding='utf8').write('\n\n'.join(srt) + '\n')
    c = open(f'{D}/src/config.js').read(); open(f'{D}/src/config.js', 'w').write(re.sub(r'duration: [\d.]+', f'duration: {dur}', c))
    def inv(p):
        if p <= pts[0][1]: return p
        for k in range(1, len(pts)):
            if p <= pts[k][1]: (r0, p0), (r1, p1) = pts[k - 1], pts[k]; return r0 + (p - p0) * (r1 - r0) / max(1e-6, p1 - p0)
        r, pp = pts[-1]; return r + (p - pp)
    L = [l.rstrip('\n').split('\t') for l in open(f'{D}/sound/cues_p{N}.tsv', encoding='utf8')]; out = [L[0]]
    for cc in L[1:]:
        a = float(cc[3]); ra = inv(a)
        if cc[1] == 'loop' and cc[4] != 'all': cc[4] = str(round(inv(a + float(cc[4])) - ra, 2))
        cc[3] = str(round(ra, 3)); out.append(cc)
    open(f'{D}/sound/cues_p{N}_voiced.tsv', 'w', encoding='utf8').write('\n'.join('\t'.join(x) for x in out) + '\n')
    print('duration', dur, 'offset', OFF, 'max drift', round(max(abs(r - p) for r, p in pts), 2))
