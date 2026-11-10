# Chatterbox take (MIT licence, local CPU): per-line expressiveness from the "mood" column, hand-set pauses.
# Usage: <chatterbox-env python> make_chatterbox.py [ref.wav|default] [tag]
import csv, sys, os, numpy as np, soundfile as sf, torch
from chatterbox.tts import ChatterboxTTS
ref = sys.argv[1] if len(sys.argv) > 1 else 'default'; tag = sys.argv[2] if len(sys.argv) > 2 else 'cb'
torch.manual_seed(7)
m = ChatterboxTTS.from_pretrained(device='cpu'); SR = m.sr
MOOD = {'low': (.35, .5), 'warm': (.45, .5), 'build': (.6, .4), 'hit': (.7, .3), 'title': (.55, .45)}   # exaggeration, cfg_weight
rows = list(csv.DictReader(open('LINES.tsv', encoding='utf8'), delimiter='\t')); os.makedirs(f'takes_{tag}', exist_ok=True)
out, tsv, t = [np.zeros(int(.3 * SR), np.float32)], ['id\tstart\tdur\ttext'], .3
for r in rows:
    p = f"takes_{tag}/{r['id']}.wav"
    if not os.path.exists(p):
        ex, cfg = MOOD[r['mood']]; kw = {} if ref == 'default' else {'audio_prompt_path': ref}
        w = m.generate(r['text'], exaggeration=ex, cfg_weight=cfg, **kw).squeeze(0).numpy().astype(np.float32); sf.write(p, w, SR); print(r['id'], round(len(w) / SR, 2), flush=True)
    a, _ = sf.read(p, dtype='float32'); nz = np.where(np.abs(a) > .01)[0]; a = a[max(0, nz[0] - 600):nz[-1] + 1500]
    tsv.append(f"{r['id']}\t{t:.3f}\t{len(a) / SR:.3f}\t{r['text']}"); out += [a, np.zeros(int(float(r['gap']) * SR), np.float32)]; t += len(a) / SR + float(r['gap'])
sf.write(f'chatterbox_{tag}.wav', np.concatenate(out), SR); open(f'chatterbox_{tag}.tsv', 'w', encoding='utf8').write('\n'.join(tsv) + '\n'); print(tag, round(t, 2), 's')
