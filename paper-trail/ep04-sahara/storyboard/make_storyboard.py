# make_storyboard.py <beats-module>  - builds the Case 04 storyboard page for one piece (cold open or a part):
# the animatic (planned narration as an on-screen band, scratch sound, no voice), then per beat: stills from the
# rendered frames, the planned narration, picture notes and the playable sounds that fall in the beat.
#   python make_storyboard.py beats_open        -> open.html
import os, sys, re, json, html, shutil, subprocess, glob
HERE = os.path.dirname(os.path.abspath(__file__)); EP = os.path.dirname(HERE)
SK = os.path.normpath(os.path.join(EP, '..', '..', '.claude', 'skills', 'vox-doc-sound'))
sys.path.insert(0, HERE); B = __import__(sys.argv[1] if len(sys.argv) > 1 else 'beats_open')
PART = os.path.join(EP, B.PART_DIR); KEY = B.__name__.replace('beats_', '')
for d in ('stills', 'sfx', 'video'): os.makedirs(os.path.join(HERE, d), exist_ok=True)
VO = json.loads(re.search(r'voTrack\((\[.*\])\);', open(os.path.join(PART, B.VO_JS), encoding='utf8').read(), re.S).group(1))
CUES = [l.split('\t') for l in open(os.path.join(PART, B.CUES), encoding='utf8').read().strip().split('\n')[1:]]
FRAMES = sorted(glob.glob(os.path.join(PART, 'out', 'frames', 'f*.jpg')))
FPS = json.load(open(os.path.join(PART, 'out', 'frames', 'manifest.json'))).get('fps', 24)
def tc(x): return f'{int(x // 60)}:{x % 60:04.1f}'
def still(t):
    dst = os.path.join(HERE, 'stills', f'{KEY}_{t:05.1f}.jpg')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', FRAMES[min(len(FRAMES) - 1, int(round(t * FPS)))], '-vf', 'scale=960:-2', '-q:v', '4', dst], check=True)
    return 'stills/' + os.path.basename(dst)
def sfx(p):
    dst = os.path.join(HERE, 'sfx', os.path.basename(p))
    if not os.path.exists(dst): shutil.copy(os.path.join(SK, p), dst)
    return 'sfx/' + os.path.basename(p)
def nice(p): return re.sub(r'^(b\d|s\d)_', '', os.path.splitext(os.path.basename(p))[0]).replace('_', ' ').replace('-', ' ')

cards = []
for num, title, a, b, ts, pic in B.BEATS:
    vo = [r[2] for r in VO if a <= (r[0] + r[1]) / 2 < b]
    snd = [(nice(c[2]), c[2]) for c in CUES if c[1] == 'one' and a <= float(c[3]) < b][:6]
    mus = [(nice(c[2]) + ' (music / ambience)', c[2]) for c in CUES if c[1] == 'loop' and float(c[3]) < b and float(c[3]) + float(c[4]) > a]
    imgs = ''.join(f'<figure><img src="{still(t)}" alt="Frame at {tc(t)}" loading="lazy"><figcaption>{tc(t)}</figcaption></figure>' for t in ts)
    vos = ''.join(f'<li>{html.escape(v)}</li>' for v in vo) or '<li class="none">No narration</li>'
    sounds = ''.join(f'<li><span>{html.escape(n)}</span><audio controls preload="none" src="{sfx(p)}"></audio></li>' for n, p in mus + snd) or '<li><span>Silence</span></li>'
    cards.append(f'''<section class="beat"><header><span class="num">{num}</span><h2>{html.escape(title)}</h2><span class="tc">{tc(a)}–{tc(b)}</span></header>
<div class="stills">{imgs}</div><div class="cols"><div><h3>Narration (planned)</h3><ol class="vo">{vos}</ol></div>
<div><h3>Picture</h3><p>{html.escape(pic)}</p><h3>Sound (scratch)</h3><ul class="snd">{sounds}</ul></div></div></section>''')

vid = f'video/{KEY}_storyboard_720p.mp4'
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', os.path.join(PART, B.VIDEO), '-vf', 'scale=1280:-2', '-c:v', 'libx264', '-preset', 'slow', '-crf', '27', '-pix_fmt', 'yuv420p',
                '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', os.path.join(HERE, vid)], check=True)
page = f'''<title>Case 04 Storyboard</title>
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="claude:viewport-fit-sides" content="cover">
<style>
:root{{--bg:#15130f;--card:#201d18;--ink:#ece6da;--mute:#a79f90;--acc:#d9a441;--red:#b8322a;--line:#3a352c;color-scheme:dark}}
*{{box-sizing:border-box}} body{{margin:0;background:var(--bg);color:var(--ink);font:16px/1.55 Georgia,"Times New Roman",serif}}
main{{max-width:1180px;margin:0 auto;padding-block:28px 80px;padding-left:max(16px, env(safe-area-inset-left, 0px));padding-right:max(16px, env(safe-area-inset-right, 0px))}}
h1{{font:700 32px/1.15 Georgia,serif;margin:0 0 6px;text-wrap:balance}} .sub{{color:var(--mute);margin:0 0 18px}}
video{{width:100%;max-width:100%;border-radius:8px;background:#000;display:block;aspect-ratio:16/9}}
.note{{background:#2a2419;border-left:4px solid var(--acc);padding:14px 18px;margin:18px 0 28px;border-radius:4px;font-size:15px;display:flex;flex-direction:column;gap:10px}}
.note p{{margin:0}}
.beat{{background:var(--card);border-radius:10px;padding:18px;margin:0 0 22px}} .beat header{{display:flex;gap:12px;align-items:baseline;flex-wrap:wrap}}
.num{{background:var(--red);color:#fff;font:700 14px system-ui,sans-serif;padding:3px 8px;border-radius:4px}} h2{{margin:0;font-size:21px;flex:1;min-width:12ch}} .tc{{color:var(--mute);font:14px ui-monospace,monospace}}
.stills{{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr));gap:10px;margin:14px 0}} .stills figure{{margin:0}} .stills img{{width:100%;border-radius:6px;display:block}}
.stills figcaption{{color:var(--mute);font:13px ui-monospace,monospace;margin-top:4px}}
.cols{{display:grid;grid-template-columns:1fr 1fr;gap:22px}} .cols>div{{min-width:0}} @media(max-width:760px){{.cols{{grid-template-columns:1fr}}}}
h3{{font:700 12px system-ui,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:var(--acc);margin:6px 0}} .vo{{padding-left:20px;margin:0}} .vo li{{margin:3px 0}} .vo .none{{list-style:none;margin-left:-20px;color:var(--mute)}} p{{margin:0}}
.snd{{list-style:none;padding:0;margin:0}} .snd li{{display:flex;align-items:center;gap:10px;margin:5px 0;flex-wrap:wrap}} .snd span{{min-width:170px;color:var(--mute);font-size:14px}}
audio{{height:30px;max-width:100%}}
</style>
<main>
<h1>Case No. 04: Three Crore Names (Sahara)</h1>
<p class="sub">{html.escape(B.TITLE)} · storyboard build, 2026-11-10 · for your approval</p>
<video controls preload="metadata" src="{vid}"></video>
<div class="note">
<p>This animatic follows the approved script. The <b>planned narration is shown as on-screen text</b> (the "VO (storyboard)" band), with <b>scratch music and sound effects only</b>. There's no voice yet: Chatterbox records it after you approve, and the picture and sound are then re-timed to the real spoken words. The frames are at 12 fps for the storyboard; the final render is 24 fps.</p>
<p>{html.escape(B.DIAL)}</p>
<p>Every staged scene carries DRAMATIZATION. No logos, no likenesses: the building has no sign, the people are generic paper puppets, and the form's photo box is empty.</p>
<p><b>Your approval, please (reply in chat):</b> keep the cold open as it is, or note changes per beat (for example "0.4: pull back slower").</p>
</div>
{''.join(cards)}
</main>'''
out = os.path.join(HERE, f'{KEY}.html'); open(out, 'w', encoding='utf8').write(page); print('wrote', out)
