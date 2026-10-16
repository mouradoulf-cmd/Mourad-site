---
name: openmontage
description: Make real videos (TikTok/Reels promos, site demo videos, explainers, ads, talking-head edits, subtitled clips, dubbing) with OpenMontage, the open-source agentic video production system (github.com/calesthio/OpenMontage). Use when Mourad asks for a video, a pub TikTok, a promo or demo video of a client site, a video in the "site de plombier que je ferais" format, or when a video task needs more than ffmpeg/Open Edit CLI. Free mode by default, never spend paid credits without asking.
---

# OpenMontage (video production studio)

OpenMontage is a full project (Python pipelines + Remotion/HyperFrames rendering + ~150 internal
skills), not a file to copy. It is licensed **AGPL-3.0**: use it as a tool, **never copy its code into
this repo** (the client sites must stay free of AGPL code). Only the finished videos come back here.

## Set up (once per session, ~3-5 min)

```bash
# skip if /tmp/claude-0/openmontage/.venv already exists in this container
git clone --depth 1 https://github.com/calesthio/OpenMontage.git /tmp/claude-0/openmontage
cd /tmp/claude-0/openmontage && make setup      # venv + pip + Remotion + HyperFrames, creates .env
```

Check it works without any key: `.venv/bin/python render_demo.py --list`, then
`.venv/bin/python render_demo.py focusflow-pitch` → `projects/demos/renders/focusflow-pitch.mp4`
(tested OK on 2026-10-16 in a cloud session).

## Work inside it

1. Read `/tmp/claude-0/openmontage/AGENT_GUIDE.md` first (its own rules: routing, pipelines in
   `pipeline_defs/` such as screen-demo, animated-explainer, clip-factory, talking-head,
   localization-dub, documentary-montage; its skills live in `skills/` and `.claude/skills/`).
2. Follow its proposal step: concept, tool plan, cost. Present it to Mourad in simple French.
3. Render, then copy the final `.mp4` (and captions/poster) back into this repo or the scratchpad and
   send it with SendUserFile. Videos for a site go in that site's folder (e.g. `nm/assets/video/`),
   compressed for the web (H.264, faststart). Never commit raw renders or big intermediates.

## Rules (Mourad)

- **Free by default.** `.env` stays without paid keys. Zero-key paths: Remotion/HyperFrames
  composition, free stock footage, local tools, our own screen recordings (Playwright) of the demo
  sites, gTTS / local voices. Any paid provider (video generation, ElevenLabs, HeyGen, fal, Veo…):
  say what it would cost and **wait for Mourad's yes for that specific run**. Never ask for card
  details; an API key only if Mourad chooses to add one himself.
- **No face swap, no avatar or voice clone of a real person** without that person's explicit consent.
  No fake testimonials, no fake clients, stock footage labelled as such when it could pass as a client.
- For NM Studio promos, reuse the format in CLAUDE.md (« le téléphone doit sonner »): 60-90 s vertical,
  dark background, short title on top, the site scrolling in the middle with zooms, word-by-word
  captions with the key word highlighted, final call to action. Thai and/or French depending on target.
- Pairs well with: `tiktok-marketing`, `viral-hook-creator`, `tiktok-captions`, `video-marketing`,
  `ugc-ad-scripts`, `text-to-speech`, and the Open Edit CLI (CLAUDE.md) for transcription.
