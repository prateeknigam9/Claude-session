# Project rules: The Paper Trail (follow strictly)

These rules come from the user. They override any skill's own workflow or
defaults, including `cinecode` and `vox-documentary`. Full project context is
in `paper-trail/HANDOFF.md`.

## Production order

Every step needs the user's approval before the next one starts:

1. Script
2. HTML storyboard with sound (an animatic plus beat-by-beat stills)
3. Approval
4. Voice
5. Mix
6. Render
7. QC
8. Deliver

Each part (Part 1–4 of an episode) gets its own storyboard approval and its
own voiced-master approval.

## Series format

- Long-form episodes, 10–15 minutes, 16:9.
- Never make Shorts tests. Shorts are only cut from finished long videos.

The `vox-animation` skill is used for this series. Its own staged flow and
defaults (edge-tts voices, 60 s, 9:16) give way to these rules: the
production order and approvals above apply, the series format applies, and
the voice rules below replace its edge-tts step unless the user says
otherwise.

## Voice

- **No ElevenLabs.** The user declined it; never propose it. Also don't use
  cloud TTS by default (for example, cinecode's `tts.py` Gemini or ElevenLabs
  engines).
- Use local/free voices or the user's own recording.
- Default voice: Chatterbox (MIT licence, local CPU), cloned from a 9 s
  reference clip of Kokoro `am_fenrir`. Kokoro is the fallback.

## Style v2 (chosen 2026-11-08)

Viewer feedback on Case 01 was "too bland, the story is very flat, not
engaging". Style v2 answers that:

- A story-led script with a point of view. Withhold the outcome, build
  suspense, and use simple spoken English.
- Staged scenes (cinematic paper sets), with very little on-screen text.
- Sparse sound: room tone, silence, one hit per big moment, and a music cue
  that changes with the mood. No constant stingers.
- One closing takeaway instead of checklists or red-flag counters.
- Reconstructed scenes carry a small `DRAMATIZATION` tag. Example characters
  carry `EXAMPLE · NOT A REAL PERSON`.
