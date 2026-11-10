# Directed Kokoro take: per-line speed, hand-set pauses, a darker voice. Usage: python make_kokoro.py [voice]
import csv, sys, numpy as np, soundfile as sf
from kokoro import KPipeline
V = sys.argv[1] if len(sys.argv) > 1 else 'am_fenrir'; P = KPipeline(lang_code='a'); SR = 24000
rows = list(csv.DictReader(open('LINES.tsv', encoding='utf8'), delimiter='\t')); out, tsv, t = [np.zeros(int(.3 * SR), np.float32)], ['id\tstart\tdur\ttext'], .3
for r in rows:
    a = np.concatenate([np.asarray(x[2], np.float32) for x in P(r['text'], voice=V, speed=float(r['speed']))])
    nz = np.where(np.abs(a) > .01)[0]; a = a[max(0, nz[0] - 600):nz[-1] + 1200]
    tsv.append(f"{r['id']}\t{t:.3f}\t{len(a) / SR:.3f}\t{r['text']}"); out += [a, np.zeros(int(float(r['gap']) * SR), np.float32)]; t += len(a) / SR + float(r['gap'])
sf.write(f'kokoro_{V}.wav', np.concatenate(out), SR); open(f'kokoro_{V}.tsv', 'w', encoding='utf8').write('\n'.join(tsv) + '\n'); print(V, round(t, 2), 's')
