---
name: vox-documentary
description: Plan, script and build a Vox-style explainer/documentary video (paper collage, cut-outs, red markers, case boards, burned-in subtitles) with the Remotion template kit in this repo. Use when the user wants a new episode, a script/storyboard for one, a new template, or to restyle the kit.
---

# Vox-style documentary playbook

The look is cheap to make and the effort goes into the script. Visuals come
from a small, strict set of reusable templates in `src/kit/`. Each new
episode is a new `script.ts` plus a new scene list. It never needs a new
art style.

## 1. Story structure (always this shape)

1. **Disclaimer card (3 s).** For example: "Based on official records. Some
   scenes are illustrated. Disputed claims are attributed."
2. **Cold open at the climax (30–45 s).** Show the collapse or blast moment,
   then end on ONE unanswered question in big text (for example
   "HIDDEN?" / "OR MISSED?").
3. **Title card**, shown only after the hook (`RansomTitle`).
4. **5–7 chapters**, each opened with a `ChapterCard`.
5. **Two twists.** Place one at about 20% of the runtime and one at about
   75%.
6. **A countdown or ticking sequence** before the climax.
7. **A direct answer** to the cold-open question, followed by honest
   complications.
8. **A callback ending** that uses a stamp echoing the cold open (for
   example "SEEN, TOO LATE."). Don't ask viewers to subscribe.

## 2. Script rules

- Use about 150–160 spoken words per minute, and change something on screen
  every 3–5 s.
- Put an exact time, name or number in nearly every line.
- Attribute anything disputed with "According to …" and show it on screen
  with `LabelTag`/`HonestyTag`.
- Write short punch lines ("Five in all." "Period."). Prefer dry irony to
  hype.
- Every visual must match the noun being spoken at that moment.
- Put the most famous name involved first in the YouTube title.

## 3. Visual system

| Rule | Value |
|---|---|
| Base | Paper stock, grain on top of everything (`PaperBackground`, `Grain`) |
| Emphasis | ONE signal red (`C.red`) for every emphasis; mustard (`C.mustard`) only for highlighter |
| Mood by colour | Warm paper = home/protagonist, navy/slate = power/institution, dark diorama = "what's underneath" |
| Motion | Slap-down cut-outs (`Drop`), slow push-ins (`Camera`), plain fades (`SceneFade`). No whip pans, glitches or 3D spins |
| Honesty | `HonestyTag` "ILLUSTRATION", "NOT TO SCALE", and "ACCORDING TO …" labels are part of the design |
| Subtitles | Always on, burned into a black band (`Subtitles`) |
| People | Use halftone cut-outs (`HalftonePhoto`). Use real photos only with rights; otherwise use the faceless `Silhouette` plus a `NameLabel` |

## 4. Template kit (`src/kit`)

| # | Template | Component |
|---|---|---|
| 1 | Establishing date stamp, typewriter text with a red cursor | `DateStamp` |
| 2 | Name label with a red bar | `NameLabel` |
| 3 | **Recurring motif**: "what the auditors / satellites saw" | `AuditorView` (swap in your own motif per topic) |
| 4 | Two-step pills: black context, then red punchline | `TwoStepPills` |
| 5 | Pointer callouts | `MarkerArrow`, `MarkerCircle`, `MarkerX`, `MeasureMark`, `Highlight` |
| 6 | Cutaway / paper-cut diorama with parallax | `PaperDiorama` |
| 7 | Map with a route that draws itself | `MapRoute` |
| 8 | Quote card (italic serif, word by word) | `QuoteCard` |
| 9 | Big number with a count-up | `BigNumber` |
| 10 | Black chapter card | `ChapterCard` |
| + | Collage pieces | `TornPaper`, `Tape`, `DocScrap`, `Stripes`, `Stamp`, `LabelTag`, `RansomTitle` |
| + | Case board with red string | `CaseBoard` |

## 5. Workflow for a new episode

Get the user's approval at each stage before starting the next: script, HTML
storyboard with sound, then voice, mix, render, QC and delivery.

1. **Research.** Collect sourced facts in a table: claim, source, and
   whether it is disputed.
2. **Script.** Follow §1 and §2. Mark each line with the template it uses.
3. **Storyboard.** Copy `src/demo/script.ts` to `src/episodes/<slug>/script.ts`.
   List scene boundaries in seconds in `SCENES` and subtitle lines in `CUES`.
4. **Voiceover.** Never use ElevenLabs; the user declined it. Use a local
   voice (Chatterbox cloned from the Kokoro `am_fenrir` reference, with
   Kokoro as the fallback) or the user's own recording. Use Whisper word
   timings to set the `CUES` and scene boundaries, and drop the audio into
   `public/` with `<Audio src={staticFile(...)} />`, with sparse sound under
   the voice (see `paper-trail/HANDOFF.md`).
5. **Build scenes.** Copy `src/demo/VoxDemo.tsx` and compose only from kit
   components. If a new visual is needed, add it to `src/kit/` as a reusable
   template, not a one-off.
6. **Check.** `npm run typecheck`, then render stills of every scene and look
   at them. Check that text clears the subtitle band (keep it above y ≈ 940)
   and that labels don't overlap.
7. **Render.** `npm run render` (1920×1080, 30 fps). For Shorts, register a
   1080×1920 composition and re-lay out scenes. Don't just crop.

## 6. Rendering in a sandbox

Chromium may not trust the network proxy's CA, so fonts are bundled in
`public/fonts` and renders work offline. If Remotion can't download its
browser, pass
`--browser-executable=/opt/pw-browsers/chromium_headless_shell-*/chrome-headless-shell-linux64/chrome-headless-shell`.
