Drop the background video here as `labs-video.mp4` (source: `https://cdn.5sdesign.art/projects/labs/labs-video.mp4`,
blocked by this environment's network policy at build time). Once the file exists at
`public/labs-video.mp4`, the hero's `<video>` tag in `src/App.tsx` picks it up automatically —
no code changes needed. Until then, a CSS animated fallback (see `src/index.css` /
`src/App.tsx`) approximates the look.
