# make_cues.py — opening v2: room tone and silence, very few hits (planned times on the am_fenrir take)
P, K, M = 'sfx/StableAudio/', 'sfx/Kenney_CC0/', 'music/Gemini/'
rows = [
 ('rain', 'loop', P + 'Ambience/b2_rain_light.mp3', 0, 15.9, -20, 1.5, .6),
 ('tick', 'loop', P + 'Time/b2_clock_tick_a.mp3', 0, 15.9, -27, 1.0, .6),
 ('bed', 'loop', M + 'ambient_mystery/ambient_mystery_01.mp3', 1.0, 32.6, -23, 4.0, .4),    # cut to silence before the reveal
 ('rain2', 'loop', P + 'Ambience/b2_rain_light.mp3', 20.9, 9.4, -22, .4, .5),
 ('drone', 'loop', P + 'Ambience/b2_tension_drone.mp3', 35.0, 9.5, -20, .3, 1.5),
 ('tick2', 'loop', P + 'Time/b4_clock_tick_g.mp3', 44.2, 10.4, -21, .6, .2),
 ('m_choice', 'loop', M + 'ambient_tension/ambient_tension_02.mp3', 44.0, 12.3, -21, 2.0, .3),
 ('m_tease', 'loop', M + 'tension/tension_02.mp3', 56.2, 12.3, -19, .3, 2.0),
]
one = [
 (7.9, K + 'Paper/card-place-1.ogg', -24), (9.35, 'Data/b2_phone_vibrate_a.mp3', -26), (10.85, K + 'Paper/card-place-2.ogg', -24), (13.0, 'Reveal/s1_swell_reverse_a.mp3', -24),
 (21.5, 'Emphasis/b2_paper_slam_a.mp3', -22), (26.1, 'Emphasis/b2_paper_slam_b.mp3', -21),
 (34.45, K + 'Emphasis/impactSoft_heavy_002.ogg', -12),    # "It's not flat." — the one hit
 (37.3, 'Paper/b2_stamp_press_a.mp3', -24), (41.5, 'Paper/b4_string_snap_a.mp3', -22),
 (54.6, 'Data/b2_mouse_click_a.mp3', -14), (54.8, 'Data/b2_printer_a.mp3', -19), (55.0, 'Paper/b3_cutout_slide_a.mp3', -21),
 (57.8, 'LawPolitics/b2_gavel_a.mp3', -14), (59.4, 'Emphasis/b2_door_thud_a.mp3', -15), (61.0, 'Data/b2_phone_vibrate_b.mp3', -16),
 (63.15, 'Paper/b4_string_snap_b.mp3', -17), (64.7, 'Emphasis/b2_paper_slam_a.mp3', -15),
]
import os
S = os.path.expanduser('~/.claude/skills/vox-doc-sound'); cat = open(os.path.join(S, 'CATALOG.tsv'), encoding='utf8').read()
out = ['label\tkind\tfile\tat\tdur\tgain_db\tfade_in\tfade_out']; miss = []
for r in rows:
    if r[2] not in cat: miss.append(r[2]); continue
    out.append('\t'.join(map(str, r)))
for i, (t, f, g) in enumerate(one):
    path = f if f.startswith('sfx/') else P + f
    if path not in cat: miss.append(path); continue
    out.append(f'c{i:03d}\tone\t{path}\t{t}\t-\t{g}\t0\t0')
open('sound/cues_open.tsv', 'w', encoding='utf8').write('\n'.join(out) + '\n'); print(len(out) - 1, 'cues; missing:', miss)
