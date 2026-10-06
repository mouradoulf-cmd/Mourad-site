# Vidéos NM Academy (sources)

Deux vidéos explicatives (9:16, 34 s) × 3 langues (FR/EN/TH), rendues image par image puis encodées.

- `scene.html` : moteur d'animation (`?v=ai|web&l=fr|en|th`). Tous les textes sont dans l'objet `S`.
- `render.js` : rend les frames avec Playwright/Chromium (`node render.js ai fr 24`).
- `sound.py` : design sonore (numpy, sans musique) (`python3 sound.py ai ai.wav`).
- Encodage : `ffmpeg -framerate 24 -i frames/ai-fr/f%04d.jpg -i ai.wav -t 34 -c:v libx264 -pix_fmt yuv420p -crf 26 -movflags +faststart -c:a aac -b:a 128k ai-fr.mp4`

## Modifier une promesse
Les chiffres de la vidéo vidéo-IA sont affichés comme **objectif** (« 50 clips par jour : l'objectif du workflow ») et le prix des
abonnements comme « total cumulé possible, selon les outils et les offres ». Si tu peux réellement garantir autre chose,
change le texte dans `S` (clés `goal`, `a1_n`, `b1_bw`…) puis relance le rendu. Ne mets que ce qui est vrai et vérifiable.
