# Pushing The Paper Trail from your PC into this repo

Run these steps in **PowerShell** on the Windows PC. You need Git for Windows,
which includes Git LFS. Nothing on your PC is moved or deleted; the files are
copied.

## 1. Get this repo and branch

```powershell
cd C:\Users\prate\Documents\videogen
git clone https://github.com/prateeknigam9/Claude-session.git cloud-repo
cd cloud-repo
git checkout claude/new-session-sjhiya
git lfs install
```

## 2. Copy the project, the sound skill and the memory notes

```powershell
# Project. Skips frame caches, envs and node_modules.
robocopy ..\cld\paper-trail paper-trail /E /XD .git node_modules __pycache__ frames frames_storyboard check takes_alt takes_rejected chatterbox-env kokoro-env

# Sound skill (mix.py, CATALOG.tsv and its SFX/music library)
robocopy $HOME\.claude\skills\vox-doc-sound .claude\skills\vox-doc-sound /E /XD __pycache__

# Claude memory notes for this project
robocopy $HOME\.claude\projects\C--Users-prate-Documents-videogen-cld\memory paper-trail\memory /E
```

`robocopy` exit codes 0–7 mean success.

## 3. Check the size before committing

```powershell
git add -A
git lfs ls-files --size | Select-Object -Last 15     # media going to LFS
git status --short | Measure-Object                   # number of files
```

- `.wav`, `.mp4`, `.mp3`, `.mov`, `.flac` and `.psd` files go through Git LFS,
  as set in `.gitattributes`.
- GitHub's free LFS allowance is 1 GB of storage and 1 GB of bandwidth a
  month.
- If the total is bigger than that, keep only the approved masters. Unstage
  the bulky folders with commands like
  `git reset paper-trail/ep03-nikola/v2/part*/vo/takes_cbref`, and add them
  to `paper-trail/.gitignore`.
- Any single file over 2 GB can't go to GitHub at all.

## 4. Commit and push

```powershell
git commit -m "Import The Paper Trail project, vox-doc-sound skill and memory notes"
git push origin claude/new-session-sjhiya
```

Then tell the cloud session the push is done.

## Not included (re-create on any new machine)

- Python environments:
  - `chatterbox-env`: Python 3.10, CPU torch 2.6, `chatterbox-tts`.
  - `kokoro-env`.
  - `faster-whisper` for voice QC.
- Rendered frame caches (`out/frames*`). `node render.mjs --frames` re-makes
  them.
