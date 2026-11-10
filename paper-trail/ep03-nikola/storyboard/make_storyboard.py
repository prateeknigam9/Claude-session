# make_storyboard.py <part>  — builds storyboard/partN.html: the animatic (planned narration as text + scratch sound, no voice),
# then per beat: stills from the rendered frames, the planned narration (from src/vo_partN.js), picture notes and the
# sounds that fall inside the beat (from sound/cues_pN.tsv, playable). Re-run after changing the build.
import os, sys, shutil, html, glob, json, re
N = sys.argv[1] if len(sys.argv) > 1 else '1'
HERE = os.path.dirname(os.path.abspath(__file__)); PART = os.path.join(os.path.dirname(HERE), f'part{N}'); SK = os.path.expanduser('~/.claude/skills/vox-doc-sound')
for d in ('stills', 'sfx', 'video'): os.makedirs(os.path.join(HERE, d), exist_ok=True)
VO = json.loads(re.search(r'voTrack\((\[.*\])\);', open(os.path.join(PART, 'src', f'vo_part{N}.js'), encoding='utf8').read(), re.S).group(1))
CUES = [l.split('\t') for l in open(os.path.join(PART, 'sound', f'cues_p{N}.tsv'), encoding='utf8').read().strip().split('\n')[1:]]
FRAMES = sorted(glob.glob(os.path.join(PART, 'out', 'frames', '*.jpg')))
def tc(x): return f'{int(x // 60)}:{x % 60:04.1f}'
def still(t):
    dst = os.path.join(HERE, 'stills', f'p{N}_{t:06.1f}.jpg'); shutil.copy(FRAMES[min(len(FRAMES) - 1, int(round(t * 24)))], dst); return 'stills/' + os.path.basename(dst)
def sfx(p):
    dst = os.path.join(HERE, 'sfx', os.path.basename(p))
    if not os.path.exists(dst): shutil.copy(os.path.join(SK, p), dst)
    return 'sfx/' + os.path.basename(p)
def nice(p): return re.sub(r'^(b\d|s\d)_', '', os.path.splitext(os.path.basename(p))[0]).replace('_', ' ').replace('-', ' ')

sys.path.insert(0, HERE); _B = __import__(f'beats_p{N}'); BEATS = _B.BEATS; SUB = {N: _B.SUB}
cards = []
for num, title, a, b, ts, pic in BEATS:
    vo = [r[2] for r in VO if a - .05 <= r[0] < b]
    snd = [(nice(c[2]), c[2]) for c in CUES if c[1] == 'one' and a <= float(c[3]) < b][:6]
    mus = [(nice(c[2]) + ' (music/ambience)', c[2]) for c in CUES if c[1] == 'loop' and float(c[3]) < b and float(c[3]) + (float(c[4]) if c[4] != 'all' else 1e9) > a]
    imgs = ''.join(f'<img src="{still(t)}" alt="frame at {tc(t)}" loading="lazy">' for t in ts)
    vos = ''.join(f'<li>{html.escape(v)}</li>' for v in vo)
    sounds = ''.join(f'<li><span>{html.escape(n)}</span><audio controls preload="none" src="{sfx(p)}"></audio></li>' for n, p in mus + snd)
    cards.append(f'''<section class="beat"><header><span class="num">{num}</span><h2>{html.escape(title)}</h2><span class="tc">{tc(a)}–{tc(b)}</span></header>
<div class="stills">{imgs}</div><div class="cols"><div><h3>Narration (planned)</h3><ol class="vo">{vos}</ol></div>
<div><h3>Picture</h3><p>{html.escape(pic)}</p><h3>Sound</h3><ul class="snd">{sounds}</ul></div></div>
<label class="fb">Your notes on {num}<textarea placeholder="Keep / change / cut…"></textarea></label></section>''')
vid = f'video/part{N}_storyboard.mp4'; shutil.copy(os.path.join(PART, 'out', f'part{N}_storyboard.mp4'), os.path.join(HERE, vid))
page = f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Case 03 Storyboard</title><style>
:root{{--bg:#0f1719;--card:#182326;--ink:#e9efe9;--mute:#9fb1ae;--acc:#e0b84a;--red:#c8463a}}
*{{box-sizing:border-box}} body{{margin:0;background:var(--bg);color:var(--ink);font:16px/1.55 Georgia,serif}}
main{{max-width:1180px;margin:0 auto;padding:28px 16px 80px}} h1{{font:700 32px/1.15 Georgia,serif;margin:0 0 6px}} .sub{{color:var(--mute);margin:0 0 18px}}
video{{width:100%;border-radius:8px;background:#000;display:block}}
.note{{background:#22302a;border-left:4px solid var(--acc);padding:12px 16px;margin:18px 0 28px;border-radius:4px;font-size:15px}}
.beat{{background:var(--card);border-radius:10px;padding:18px;margin:0 0 22px}} .beat header{{display:flex;gap:12px;align-items:baseline;flex-wrap:wrap}}
.num{{background:var(--red);color:#fff;font:700 14px sans-serif;padding:3px 8px;border-radius:4px}} h2{{margin:0;font-size:21px;flex:1}} .tc{{color:var(--mute);font:14px monospace}}
.stills{{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px;margin:14px 0}} .stills img{{width:100%;border-radius:6px;display:block}}
.cols{{display:grid;grid-template-columns:1fr 1fr;gap:22px}} @media(max-width:760px){{.cols{{grid-template-columns:1fr}}}}
h3{{font:700 12px sans-serif;letter-spacing:.08em;text-transform:uppercase;color:var(--acc);margin:6px 0}} .vo{{padding-left:20px;margin:0}} .vo li{{margin:3px 0}} p{{margin:0}}
.snd{{list-style:none;padding:0;margin:0}} .snd li{{display:flex;align-items:center;gap:10px;margin:5px 0;flex-wrap:wrap}} .snd span{{min-width:170px;color:var(--mute);font-size:14px}}
audio{{height:30px;max-width:100%}} .fb{{display:block;margin-top:14px;color:var(--mute);font-size:14px}}
textarea{{width:100%;min-height:56px;margin-top:6px;background:var(--bg);color:var(--ink);border:1px solid #2e4044;border-radius:6px;padding:8px;font:15px Georgia,serif}}
</style></head><body><main>
<h1>Case No. 03: The Hill (Nikola)</h1>
<p class="sub">Part {N} of 4 · {SUB[N]} · storyboard build, 2026-11-08 · for your approval</p>
<video controls preload="metadata" src="{vid}"></video>
<div class="note">This animatic has the <b>planned narration as on-screen text</b> (the "VO (storyboard)" band) and <b>scratch music and sound effects only</b>. There's no voice yet: it's recorded after you approve, and every cue is then re-timed to the real spoken words. The puppets are generic, not likenesses, and there are no real logos (NIKOLA, FORD and the brewer are plain type). Trevor Milton was convicted by a jury, so the verdict is stated as fact; the specific false claims are tagged PROSECUTORS, and the reservation doubts are tagged CRITICS. The posts on screen are paraphrased. Leave notes per beat below, or tell me in chat.</div>
{''.join(cards)}
</main></body></html>'''
open(os.path.join(HERE, f'part{N}.html'), 'w', encoding='utf8').write(page); print('wrote', os.path.join(HERE, f'part{N}.html'))
