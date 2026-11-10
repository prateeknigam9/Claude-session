# make_open_storyboard.py - builds storyboard/open_dial.html: the cold open restyled with the look dial (2026-11-10).
# The video is the new picture with the APPROVED Chatterbox voice and mix (the script and timing are unchanged).
# Per beat: before/after stills (approved opening vs the dial build), the spoken lines, picture notes, the dial value
# and the sounds that fall inside the beat (playable). Re-run after re-rendering opening-v2/out/frames.
#   python make_open_storyboard.py
import os, re, html, shutil, subprocess

HERE = os.path.dirname(os.path.abspath(__file__))
OPEN = os.path.normpath(os.path.join(HERE, '..', '..', 'opening-v2'))
SK = os.path.normpath(os.path.join(HERE, '..', '..', '..', '..', '.claude', 'skills', 'vox-doc-sound'))
BEFORE = os.path.join(OPEN, 'out', 'opening_v2_chatterbox.mp4')        # the approved opening
AFTER = os.path.join(OPEN, 'out', 'opening_v3_dial_animatic.mp4')      # new picture + approved voice and mix
FPS = 24
for d in ('stills', 'sfx', 'video'): os.makedirs(os.path.join(HERE, d), exist_ok=True)

# planned (story) time -> real (voiced) time: invert the warp in src/config.js
WARP = [tuple(map(float, p)) for p in re.findall(r'\[([\d.]+),\s*([\d.]+)\]', re.search(r'WARP_PTS = \[(.*?)\];', open(os.path.join(OPEN, 'src', 'config.js'), encoding='utf8', errors='replace').read()).group(1))]
DUR = float(re.search(r'duration:\s*([\d.]+)', open(os.path.join(OPEN, 'src', 'config.js'), encoding='utf8', errors='replace').read()).group(1))
def real(p):
    for (r0, p0), (r1, p1) in zip(WARP, WARP[1:]):
        if p <= p1: return r0 + (p - p0) * (r1 - r0) / max(1e-6, p1 - p0)
    r, q = WARP[-1]; return r + (p - q)

LINES = [l.split('\t') for l in open(os.path.join(OPEN, 'voice', 'chatterbox_cbref.tsv'), encoding='utf8').read().strip().split('\n')[1:]]
CUES = [l.split('\t') for l in open(os.path.join(OPEN, 'sound', 'cues_open_cb.tsv'), encoding='utf8').read().strip().split('\n')[1:]]

# (id, title, planned start, planned end, dial text, picture note). Boundaries match SHOTS in src/scenes/open.js.
BEATS = [
 ('0.1', 'Night office', 0, 15.7, 'Dial 0 · mixed', 'The dark office in collage colours: a navy wall, a yellow corkboard, props with white cut-out borders. Hands spread the evidence (printouts, a phone with message bubbles, a polaroid with its face hidden). The camera pushes into the monitor. DRAMATIZATION tag in the corner.'),
 ('0.2', 'The video', 15.7, 20.9, 'Dial 0 · mixed', 'The truck video fills the frame: a yellow halftone sky, a navy road, the white truck gliding along. A red REC dot blinks. This is the pitch, so the look is at its brightest.'),
 ('0.3', 'The stakes', 20.9, 30.3, 'Dial 0 · mixed', 'Back in the office, two newspapers drop onto the desk: $30 BILLION (Nikola worth more than Ford), then $2 BILLION (General Motors buys in).'),
 ('0.4', "It's not flat", 30.3, 36.9, 'Dial 0 · mixed', 'Inside the video again. The frame rotates level and the flat road turns out to be a steep slope; a dashed level line and the angle appear.'),
 ('0.5', 'Towed, then let go', 36.9, 44.2, 'Dial 0 · mixed', 'A pickup tows the truck up the hill, the rope drops, the truck rolls. Tag: SOURCES · HINDENBURG REPORT.'),
 ('0.6', 'The choice', 44.2, 53.7, 'Dial 0 · mixed', "A finger hovers over the red PUBLISH key while the shadows of a carmaker's tower and a stock chart loom over the desk."),
 ('0.7', 'Publish', 53.7, 56.4, 'Dial 0 · mixed', 'The key goes down and pages fly. SEPT 10 2020.'),
 ('0.8', 'The tease', 56.4, 63.1, 'Dial 0 → 60 · the drain', 'Three spotlights in the dark: a gavel, a door stamped BANKRUPT, a ringing phone. The colour drains out while the line plays.'),
 ('0.9', 'Title', 63.1, None, 'Dial 60 · into diorama', 'The clipping wall and red string: THE PAPER TRAIL · CASE 03, then THE HILL. Sepia newsprint, with the red title strip kept as the accent.'),
]

def tc(x): return f'{int(x // 60)}:{x % 60:04.1f}'
def grab(src, t, dst):
    if not os.path.exists(dst):
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{t:.3f}', '-i', src, '-frames:v', '1', '-vf', 'scale=960:-2', '-q:v', '4', dst], check=True)
    return os.path.relpath(dst, HERE).replace(os.sep, '/')
def sfx(p):
    dst = os.path.join(HERE, 'sfx', os.path.basename(p))
    if not os.path.exists(dst): shutil.copy(os.path.join(SK, p), dst)
    return 'sfx/' + os.path.basename(p)
def nice(p): return re.sub(r'^(b\d|s\d)_', '', os.path.splitext(os.path.basename(p))[0]).replace('_', ' ').replace('-', ' ')

cards = []
for num, title, pa, pb, dial, pic in BEATS:
    a, b = real(pa), (real(pb) if pb is not None else DUR)
    ts = [a + (b - a) * f for f in ((.35, .8) if b - a > 4 else (.6,))]
    pairs = ''.join(f'''<figure class="pair"><div><img src="{grab(BEFORE, t, os.path.join(HERE, 'stills', f'open_before_{t:05.1f}.jpg'))}" alt="Approved look at {tc(t)}" loading="lazy"><span>Approved</span></div>
<div><img src="{grab(AFTER, t, os.path.join(HERE, 'stills', f'open_dial_{t:05.1f}.jpg'))}" alt="Dial build at {tc(t)}" loading="lazy"><span>Dial build</span></div><figcaption>{tc(t)}</figcaption></figure>''' for t in ts)
    vo = ''.join(f'<li>{html.escape(l[3])}</li>' for l in LINES if a - .05 <= float(l[1]) < b)
    snd = [(nice(c[2]), c[2]) for c in CUES if c[1] == 'one' and a <= float(c[3]) < b][:6]
    mus = [(nice(c[2]) + ' (music / ambience)', c[2]) for c in CUES if c[1] == 'loop' and float(c[3]) < b and float(c[3]) + float(c[4]) > a]
    sounds = ''.join(f'<li><span>{html.escape(n)}</span><audio controls preload="none" src="{sfx(p)}"></audio></li>' for n, p in mus + snd) or '<li><span>Silence</span></li>'
    cards.append(f'''<section class="beat"><header><span class="num">{num}</span><h2>{html.escape(title)}</h2><span class="dial">{html.escape(dial)}</span><span class="tc">{tc(a)}–{tc(b)}</span></header>
<div class="stills">{pairs}</div><div class="cols"><div><h3>Narration (approved take)</h3><ol class="vo">{vos if (vos := vo) else '<li class="none">No narration</li>'}</ol></div>
<div><h3>Picture</h3><p>{html.escape(pic)}</p><h3>Sound (approved mix)</h3><ul class="snd">{sounds}</ul></div></div></section>''')

# a web-sized copy of the animatic for the page (the full-quality file stays in opening-v2/out)
vid = 'video/open_dial_animatic_720p.mp4'
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', AFTER, '-vf', 'scale=1280:-2', '-c:v', 'libx264', '-preset', 'slow', '-crf', '27', '-pix_fmt', 'yuv420p',
                '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', os.path.join(HERE, vid)], check=True)

page = f'''<title>Case 03 Cold Open Dial</title>
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="claude:viewport-fit-sides" content="cover">
<style>
:root{{--bg:#0f1719;--card:#182326;--ink:#e9efe9;--mute:#9fb1ae;--acc:#e0b84a;--red:#c8463a;--line:#2e4044;color-scheme:dark}}
*{{box-sizing:border-box}} body{{margin:0;background:var(--bg);color:var(--ink);font:16px/1.55 Georgia,"Times New Roman",serif}}
main{{max-width:1180px;margin:0 auto;padding-block:28px 80px;padding-left:max(16px, env(safe-area-inset-left, 0px));padding-right:max(16px, env(safe-area-inset-right, 0px))}}
h1{{font:700 32px/1.15 Georgia,serif;margin:0 0 6px;text-wrap:balance}} .sub{{color:var(--mute);margin:0 0 18px}}
video{{width:100%;max-width:100%;border-radius:8px;background:#000;display:block;aspect-ratio:16/9}}
.note{{background:#22302a;border-left:4px solid var(--acc);padding:14px 18px;margin:18px 0 28px;border-radius:4px;font-size:15px;display:flex;flex-direction:column;gap:10px}}
.note p{{margin:0}} .note ol{{margin:0;padding-left:20px}}
.arc{{display:grid;grid-template-columns:repeat(9,minmax(0,1fr));gap:4px;margin:6px 0 2px}} .arc i{{display:block;height:12px;border-radius:2px}}
.beat{{background:var(--card);border-radius:10px;padding:18px;margin:0 0 22px}} .beat header{{display:flex;gap:12px;align-items:baseline;flex-wrap:wrap}}
.num{{background:var(--red);color:#fff;font:700 14px system-ui,sans-serif;padding:3px 8px;border-radius:4px}} h2{{margin:0;font-size:21px;flex:1;min-width:12ch}}
.dial{{font:600 12px system-ui,sans-serif;letter-spacing:.04em;color:var(--acc);border:1px solid var(--acc);border-radius:99px;padding:2px 10px}}
.tc{{color:var(--mute);font:14px ui-monospace,monospace}}
.stills{{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,460px),1fr));gap:14px;margin:14px 0}}
.pair{{margin:0;display:grid;grid-template-columns:1fr 1fr;gap:6px}} .pair div{{position:relative;min-width:0}} .pair img{{width:100%;border-radius:6px;display:block}}
.pair span{{position:absolute;left:6px;top:6px;font:600 11px system-ui,sans-serif;background:rgba(0,0,0,.65);color:#fff;padding:2px 6px;border-radius:3px}}
.pair figcaption{{grid-column:1/-1;color:var(--mute);font:13px ui-monospace,monospace}}
.cols{{display:grid;grid-template-columns:1fr 1fr;gap:22px}} .cols>div{{min-width:0}} @media(max-width:760px){{.cols{{grid-template-columns:1fr}}}}
h3{{font:700 12px system-ui,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:var(--acc);margin:6px 0}} .vo{{padding-left:20px;margin:0}} .vo li{{margin:3px 0}} .vo .none{{list-style:none;margin-left:-20px;color:var(--mute)}} p{{margin:0}}
.snd{{list-style:none;padding:0;margin:0}} .snd li{{display:flex;align-items:center;gap:10px;margin:5px 0;flex-wrap:wrap}} .snd span{{min-width:170px;color:var(--mute);font-size:14px}}
audio{{height:30px;max-width:100%}}
</style>
<main>
<h1>Case No. 03: The Hill · cold open with the look dial</h1>
<p class="sub">Cold open "It's Not Flat" · storyboard build, 2026-11-10 · for your approval</p>
<video controls preload="metadata" src="{vid}"></video>
<div class="note">
<p><b>What changed: the picture only.</b> The script, the approved Chatterbox voice, the timing and the mix are the ones you already approved, so this animatic plays with the real voice. The dial is 0 (bright collage) for most of the cold open, because this is the world as it was being sold. It drains to 60 over the tease line ("…a courtroom… a bankruptcy… and a phone call…") and holds there for the title, so Part 1 can open bright again.</p>
<div class="arc" aria-hidden="true"><i style="background:#F2C230"></i><i style="background:#F2C230"></i><i style="background:#F2C230"></i><i style="background:#F2C230"></i><i style="background:#F2C230"></i><i style="background:#F2C230"></i><i style="background:#F2C230"></i><i style="background:linear-gradient(90deg,#F2C230,#C6A350)"></i><i style="background:#C6A350"></i></div>
<p>The white truck and the red PUBLISH key are kept out of the sepia grade, as the episode's accents. The puppets stay generic, the DRAMATIZATION and SOURCES tags are unchanged, and company names are still plain type.</p>
<p><b>Two approvals, please (reply in chat):</b></p>
<ol><li>The picture: keep the dial look, or note changes per beat (for example "0.3: borders too strong").</li><li>Reusing the approved voice and mix as they are. If yes, the next steps are the full-quality render, QC and delivery of the cold open master.</li></ol>
</div>
{''.join(cards)}
</main>'''
open(os.path.join(HERE, 'open_dial.html'), 'w', encoding='utf8').write(page); print('wrote', os.path.join(HERE, 'open_dial.html'))
