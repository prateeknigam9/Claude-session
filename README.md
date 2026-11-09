# vox-kit

A Remotion template kit for **Vox-style explainers and documentaries**. It
uses paper collage, halftone cut-outs, red marker annotations, rubber stamps,
case boards with red string, paper-cut dioramas and burned-in subtitles,
all drawn in code, with no stock footage.

```bash
npm install
npm run studio      # live preview in the browser
npm run render      # out/vox-demo.mp4 (54 s, 1920×1080, 30 fps)
```

- `src/theme.ts` holds the palette, fonts (bundled, OFL) and timing helpers.
  Re-brand here.
- `src/kit/` holds the reusable templates (see the table in the skill).
- `src/demo/` holds a **fictional** finance-scandal demo ("The Ledger That
  Lied") that uses every template. `script.ts` drives the scene timing and
  subtitles.
- `.claude/skills/vox-documentary/SKILL.md` is the playbook: story structure,
  script rules, visual system and the episode workflow.

To make a new episode, copy `src/demo` to `src/episodes/<slug>`, rewrite
`script.ts` from your sourced script and voiceover timings, and compose
scenes only from `src/kit`.
