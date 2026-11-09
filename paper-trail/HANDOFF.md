# The Paper Trail: project handoff (as of 2026-11-09)

A complete summary so another session can pick up this work.

> **Cloud sessions:** the working files live on the user's Windows PC under
> `C:\Users\prate\Documents\videogen\...`. Once they're pushed into this
> folder (see `IMPORT.md`), the paths below are relative to `paper-trail/`.
> The voice environments (Chatterbox, Kokoro) and the `vox-doc-sound` skill's
> sound library are not in git unless they were copied in.

## 1. The channel

"The Paper Trail · Follow the Money" is a YouTube channel about money crimes
(fraud, Ponzi schemes, crypto collapses), told in a paper-cutout,
stop-motion style: cut paper, cardstock, kraft, felt; soft drop shadows;
puppets with brass split pins; 12 fps stepped motion.

- **Format:** long-form, 10–15 minutes, 16:9. Never make Shorts tests.
  Shorts are only cut from finished long videos.
- **Episodes:**
  - Case 01: published.
  - Case 02 (FTX): done, publish pack made.
  - Case 03 (Nikola, "The Hill"): in production now (details below).
  - Case 04 tease: Nirav Modi.
- **Playlist cover:** done (`series-art/out/playlist_cover_1280x720.jpg`).

## 2. How the user wants work done (follow strictly)

**Production order.** Every step needs the user's approval before the next
one:

1. Script
2. HTML storyboard with sound (an animatic plus beat-by-beat stills)
3. Approval
4. Voice
5. Mix
6. Render
7. QC
8. Deliver

**Fixed preferences:**

- **No ElevenLabs.** The user declined it; don't propose it. Use local/free
  voices (Chatterbox, Kokoro) or the user's own recording.
- Each part (Part 1–4 of an episode) gets its own storyboard approval and its
  own voiced-master approval.

Viewer feedback on Case 01: "too bland, the story is very flat, not
engaging". That feedback produced **Style v2**, chosen 2026-11-08:

- Story-led script with a point of view. Withhold the outcome; build
  suspense; simple spoken English.
- Staged scenes (cinematic paper sets), very little on-screen text.
- Sparse sound: room tone, silence, one hit per big moment, a music cue that
  changes with the mood. No constant stingers.
- One closing takeaway instead of checklists or red-flag counters.
- Reconstructed scenes carry a small `DRAMATIZATION` tag. Example characters
  carry `EXAMPLE · NOT A REAL PERSON`.
- Voice: Chatterbox (MIT licence, local CPU), cloned from a 9 s reference
  clip of Kokoro `am_fenrir`.

## 3. Legal and accuracy rules (Case 03)

- Trevor Milton's guilty verdict is stated as fact (one count of securities
  fraud, two of wire fraud; Oct 14, 2022).
- False claims are always attributed to "prosecutors". Video and report
  details are attributed to "the report" or "their sources".
- **The pardon (Part 4):**
  - State the facts from the record, next to Trump's stated reason and
    Milton's claim.
  - Never suggest the pardon was bought.
- People on screen: generic puppets only, no likenesses and no logos.
  Company names appear as plain type (NIKOLA, FORD, GENERAL MOTORS).
- "Hindenburg Research" appears only on a document on screen, never in the
  narration.
- The rancher (Part 1) is a real victim named in court filings. He's shown as
  a generic puppet with the tag `EXAMPLE OF A REAL VICTIM · NOT A LIKENESS ·
  DRAMATIZATION`, and never named.
  - **Open question for the user:** keep that tag, or make him fully
    anonymous?
- The delivery driver (Parts 2–4) is a labelled example, not a real person.
- The fact table (claims N1–N16 with sources and status) is at the bottom of
  `ep03-nikola/script-v2.md`. Check the facts before voicing each part.

## 4. Case 03 v2: status

The script is `ep03-nikola/script-v2.md` (approved; about 1,700 words, about
12 minutes). Its sections:

- COLD OPEN "It's Not Flat"
- PART 1 The Showman
- PART 2 The Rocket
- PART 3 The Report
- PART 4 The Phone Call
- NEXT CASE (Nirav Modi)

Mood tags (`low|warm|build|hit|title`) and `[pause]` markers drive the voice
and the timing.

| Piece | Folder | Status |
|---|---|---|
| Cold open | `ep03-nikola/opening-v2/` | ✅ Approved (`out/opening_v2_chatterbox.mp4`, 71.8 s) |
| Part 1 "The Showman" | `ep03-nikola/v2/part1/` | ✅ Approved: `out/p1_master.mp4` (2:27). The 12 visual defects found in QC are fixed |
| Part 2 "The Rocket" | `ep03-nikola/v2/part2/` | ✅ Approved: `out/p2_master.mp4` (2:10) |
| Part 3 "The Report" | `ep03-nikola/v2/part3/` | Storyboard ✅ approved. Voicing was running when this was written (see §7) |
| Part 4 "The Phone Call" | (not yet in v2) | Not started in v2. The old-style v1 storyboard is on hold and superseded |
| Final join | — | Not done. Join the cold open + Parts 1–4 + next-case tease, then run loudnorm to −14 LUFS |

Old-style v1 parts (`ep03-nikola/part1..4/`) are superseded; don't use them.

### Script lines changed during production (already applied to `script-v2.md`)

**Fact fixes:**

- N6 Badger claim: "was fully working" → "was built from the ground up, by
  Nikola". That's the indictment's wording; it was really built on Ford donor
  trucks.
- Part 3, settlement: "Nikola agrees to pay…" → "Nikola will end up
  paying…". Milton was charged in July 2021, before the December 2021
  settlement.
- Part 3, trial date: "October, twenty twenty-two" → "September, twenty
  twenty-two". The trial began in September; the verdict was October 14.
- Part 3, "a hit job": couldn't attribute that phrase to the company → "false
  and defamatory", the company's documented wording.

**TTS fixes.** Chatterbox turns "Nikola" + a word starting with s into
"Nicholas" or "Nikola's", so avoid "Nikola s…":

- P1: "a big piece of Nikola stock" → "a big block of Nikola shares".
- P2: "Nikola slips inside it" → "Nikola climbs inside it".
- P3: "and Nikola says so loudly" → "and Nikola points that out, loudly".

**Confirmed facts:**

- N1: Milton born April 6, 1982, so 34 in Dec 2016.
- N2: OK as worded.
- N6: confirmed.
- N15, N16: added.

## 5. The toolchain (on the user's PC)

Root: `C:\Users\prate\Documents\videogen\cld\paper-trail\`

**The paper-cutout engine:**

- Canvas2D, every frame a pure function of t, rendered in headless Chrome by
  `render.mjs`, encoded with ffmpeg.
- Each part folder holds: `render.mjs`, `studio.html`, `src/` (`kit.js`,
  `cutout.js`, `cast.js`, `trail*.js`, `ep0Nprops.js`, `config.js`,
  `warp.js`, `vo_partN.js`, `scenes/pN.js`), `sound/`, `vo/`, `out/`.

**Render commands** (run in the part folder):

- `node render.mjs --sheet=t1,t2,... --cols=4 --w=480 --out=out/check/x.jpg`
  makes a contact sheet. The times are in real (voiced) time.
- `node render.mjs --frames --workers=3` renders frames. It's resumable and
  cached, about 5 minutes per part.
  - **Don't run two renders at once:** that caused a crash earlier.
- `node render.mjs --encode --audio=<wav> --out=out/<name>.mp4` encodes the
  video.

**Scene helpers:**

- Common: `sm()` (stepped time), `seg`, `ease`, `easeIn`, `easeOut`,
  `camBegin`/`camEnd`, `piece(SH.*)`, `statusTag`, `labelTape`, `docPage`,
  `pinCard`, `exec()`/`milton()` puppets, `semi()` truck, `hillRoad`,
  `desertSky`.
- There's no `easeInOut`; use `ease`.

**Narration band:**

- The storyboard band is turned on by `window.STORYBOARD_VO = true;` in
  `config.js`. Remove that line before the voiced render.
- Before the voiced render, move the old frames aside:
  `mv out/frames out/frames_storyboard`.

**Timing:**

- `ep03-nikola/tools/plan_v2.py "<## PART N>" "<## PART N+1>" v2/partN 4.0`
  turns script-v2 into `src/vo_partN.js` (the planned band) and
  `vo/LINES.tsv` (id, text, gap, mood).
- Rates per mood: low 2.6, warm 2.75, build 2.95, hit 2.2 words/s.

**Voice (Chatterbox):**

- Python: `C:/Users/prate/Documents/videogen/chatterbox-env/Scripts/python.exe`
  (Python 3.10, CPU torch 2.6).
- `vo/make_chatterbox.py ref_fenrir.wav cbref` makes `takes_cbref/NN.wav` and
  `chatterbox_cbref.wav/.tsv`. It reuses existing takes.
- Mood settings (exaggeration, cfg): low .35/.5, warm .45/.5, build .6/.4,
  hit .7/.3.
- `vo/remake.py ID[,ID]` makes 3 alternative takes (seeds 11, 23, 37) in
  `takes_alt/`.
  - Keep the best one; move the bad take to `takes_rejected/`; copy the good
    one into `takes_cbref/`; re-run `make_chatterbox.py` to join.
- Kokoro (fallback):
  `C:/Users/prate/Documents/videogen/kokoro-env/Scripts/python.exe`.

**Voice QC:**

- Transcribe every take with faster_whisper `small.en`, passing audio
  arrays, not file paths.
- Compare with the script; flag anything under 0.9 similarity.
- Number formatting ("2020", "$30 billion") is a false alarm. Wrong words are
  real errors.

**Warp:**

- `cp vo/chatterbox_cbref.wav vo/VO.wav; cp vo/chatterbox_cbref.tsv vo/VO.tsv`,
  then from `v2/`: `python ../tools/voice_part.py N warp`.
- It writes `src/warp.js` (real time → planned time), `vo/warp.json`,
  `out/partN.srt`, sets the config duration, and writes
  `sound/cues_pN_voiced.tsv` (cues remapped).

**Placing the voice:**

- `ffmpeg -i vo/VO.wav -af "adelay=4000:all=1,apad=whole_dur=<dur>" -ar 48000 vo/VO_placed.wav`.
- The voice starts at 4.0 s, after the chapter card.

**Sound (`vox-doc-sound` skill):**

- Location: `~/.claude/skills/vox-doc-sound`. Run
  `python scripts/mix.py <cues.tsv> --vo <VO_placed.wav> --dur <dur> --out <mix.wav>`.
- Omit `--vo` for the storyboard scratch mix.
- Cues are written by `sound/make_cues.py` in each part, which checks every
  file against `CATALOG.tsv` and reports missing ones.
- Loudness: each part masters at about −15.5 LUFS. The final join applies
  loudnorm to −14.

**Storyboard page:**

- In `ep03-nikola/v2/storyboard/`, write `beats_pN.py` (BEATS + SUB), then run
  `python make_storyboard.py N`. That makes `partN.html` with the video,
  stills, narration and playable cues.

## 6. QC lessons (apply to every part)

Found the hard way in Part 1:

- Check frames from the finished MP4, not just render samples:
  `ffmpeg -vf "fps=1/2.5,scale=384:-1,tile=6x9"`.
- Nothing cropped at the frame edge: maps, memory cards and tags.
- Phones always have a visible body and hands.
- Nothing ever covers a face: phones, papers, headphones.
- Tags sit on dark backing strips, at least 26–44 px, so they're readable on a
  phone.
- No cream flash: chapter cards fade up from black, not `sheetIn`.
- Never put a transition (`trTear`/`trSlide`) at a sub-cut inside one shot
  function. `prevFrame()` would show the wrong shot.
- After the warp, re-check anything timed to a word. For example, in Part 2
  the $30B tag landed before Nikola's bar had passed Ford's.
- Move SFX when you move an action: for example, the water-drop sound in
  Part 1.
- Silhouettes still show a white shirt-V. That's accepted, and consistent
  with the cold open.

## 7. What was in progress / next steps

**Part 3 voice** (was running in the background):

- Command: `make_chatterbox.py ref_fenrir.wav cbref` in `v2/part3/vo/`,
  followed by the Whisper QC of all 27 takes.
- Next: review the transcript and re-make any wrong-word lines (watch for
  "Nikola s…" → "Nicholas").
- Then: warp → remove `STORYBOARD_VO` from config → `VO_placed` → mix →
  `mv out/frames out/frames_storyboard` → render → encode
  `out/p3_master.mp4` → transcribe the master → frame-tile QC → send for
  approval.

**Part 4 "The Phone Call":**

- Same flow: fact-check the script section (the pardon rules in §3) →
  `plan_v2.py` → scaffold `v2/part4` by copying part3 → scenes `p4.js` →
  frame QC → cues → animatic → storyboard page → approval → voice.
- Remember sentencing, Dec 18, 2023 (N13); the $165M rancher award, unpaid;
  the 99% stock fall (N14); the Aug 2023 recall (N8); and the next-case tease
  (Nirav Modi).

**Final assembly:**

- Join the cold open + P1–P4 + tease, and loudnorm to −14 LUFS.
- Combine the SRTs (offsets per part).
- Make thumbnails and a publish pack (as for Case 02:
  `ep02-ftx/final/publish-pack.md`).

**Open questions for the user:**

- The rancher's tag (§3).
- "earshot" and "realsfx" installs. The user asked to install them; the names
  are ambiguous or not found, and links or commands were requested. Nothing
  is installed.

## 8. Memory files (the user's Claude Code memory)

Location:
`C:\Users\prate\.claude\projects\C--Users-prate-Documents-videogen-cld\memory\`.
The relevant ones:

- `paper-trail-series.md`
- `paper-trail-style-v2.md`
- `paper-trail-feedback-flat.md`
- `video-production-order.md`
- `no-elevenlabs.md`
