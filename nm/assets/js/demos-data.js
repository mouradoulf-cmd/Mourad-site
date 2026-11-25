/* NM Studio — data behind "Mon espace" (demos.html, private). Claude keeps this file up to date in every
 * conversation on this repo: any new demo, page or project goes here, and NM_UPDATED gets today's date.
 *
 * NM_DEMOS — one line per client demo (the site lives at /Mourad-site/demos/<slug>/), any order (sorted A-Z):
 *   { slug: "chez-paolo", name: "Chez Paolo", type: "Restaurant", city: "Hua Hin", date: "2026-10-12",
 *     status: "prete" | "envoyee" | "discussion" | "client" | "non", phone: "", note: "" }
 * NM_LINKS — every link, grouped; `space` puts the group in one of the three spaces:
 *   "site" (Site web) · "video" (Vidéo IA) · "formation" (Formation). `path` is relative to /Mourad-site/,
 *   or a full https:// URL for something hosted elsewhere.
 */
window.NM_UPDATED = "2026-11-25";

window.NM_DEMOS = [
  { slug: "steak-dek-naew", name: "Steak Dek Naew (สเต็กเด็กแนว)", type: "Steakhouse", city: "Pattaya (à confirmer)", date: "2026-11-19", status: "prete", phone: "", note: "Premier client. Site 3 langues (thaï, anglais, français) fait avec ses vraies photos + son menu QR (menus/steak-dek-naew/). À compléter : adresse, horaires, LINE/WhatsApp du patron." },
  { slug: "tattoo-studio", name: "Tattoo Studio (nom à confirmer)", type: "Salon de tatouage", city: "Pattaya (à confirmer)", date: "2026-11-19", status: "prete", phone: "", note: "V4 pro : héros, manifeste, section poupées tatouées, étapes, galerie avec agrandissement, FAQ, réservation en 3 étapes (style, zone, taille) qui prépare le message pour LINE ou WhatsApp. À fournir : nom, LINE/WhatsApp du salon, adresse, prix, accord des clients, vraies infos d\'hygiène." },
];

window.NM_LINKS = [
  { space: "site", pane: "nm", group: "Le site NM Studio, par langue", items: [
    { name: "NM Studio · Français", path: "nm/fr/", note: "Le site à montrer aux clients" },
    { name: "NM Studio · English", path: "nm/" },
    { name: "NM Studio · ไทย", path: "nm/th/", note: "La vraie version en thaï, celle que tu montres aux patrons" },
    { name: "NM Studio · Italiano", path: "nm/it/" },
    { name: "NM Studio · العربية", path: "nm/ar/" },
    { name: "Tarifs", path: "nm/fr/pricing.html", note: "Prix Europe" }
  ] },
  { space: "site", pane: "nm", group: "Pour les clients thaïs (copie traduite en français)", items: [
    { name: "Site thaïlandais · en français", icon: "🇹🇭🇫🇷", path: "nm/th-fr/", note: "Ce que voient les clients thaïs, traduit pour toi (copie privée, pas pour les clients)" },
    { name: "Les 2 offres", icon: "🇹🇭🇫🇷", path: "nm/th-fr/#offers", note: "Menu QR 390 ฿/mois, installation gratuite · Site web + menu QR 790 ฿/mois · bouton rendez-vous" },
    { name: "Avant / après", icon: "🇹🇭🇫🇷", path: "nm/th-fr/#menu-ba", note: "Le vieux menu papier → QR code → le menu dans le téléphone" },
    { name: "Prendre rendez-vous", icon: "🇹🇭🇫🇷", path: "nm/th-fr/#book", note: "Jour + heure, puis commerce, adresse, prénom → WhatsApp s'ouvre avec le message tout écrit" },
    { name: "Inscription clients thaïs (390 / 790)", icon: "✍️", path: "nm/th/signup.html", note: "Lien à donner au patron : il choisit l'offre, met son nom et son numéro → message prêt sur WhatsApp ou LINE" },
    { name: "Kit de vente (pour ta femme)", icon: "🇹🇭🇫🇷", path: "nm/kit.html", note: "Pitch 1 min, réponses aux objections, prix, liste de ce qu'il faut récupérer (thaï / FR)" }
  ] },
  { space: "site", pane: "clients", group: "Les sites de mes clients", items: [
    { name: "Menu QR · Tahiti Beach Club (à montrer au restaurant)", icon: "🏖️", path: "menus/tahiti-beach-club/", note: "Leur menu à eux : 156 plats et boissons, 20 langues, leur plage en héros, photos d'illustration (mention en bas). Panier + écran serveur" },
    { name: "Site web · Steak Dek Naew", icon: "🥩", path: "demos/steak-dek-naew/", note: "Le site du restaurant : héros photo + assiettes, section menu QR avec téléphone. TH/EN/FR" },
    { name: "Menu QR · Fisherman's Garden (démo prospect)", icon: "🍹", path: "menus/fishermans-garden/", note: "Carte complète (200 articles : plats + boissons, 9 langues) lue sur 22 photos du menu papier. À montrer en direct au patron" },
    { name: "Menu QR · Thai Foods (brouillon)", icon: "🍤", path: "menus/thai-seafood/", note: "78 plats, 9 langues, photos tirées des panneaux du patron. Nom lu sur l'enseigne, à confirmer" },
    { name: "Menu QR · Steak Dek Naew", icon: "🥩", path: "menus/steak-dek-naew/", note: "Premier client réel : 52 plats, 9 langues, prix lus sur son menu papier" }
  ] },
  { space: "site", pane: "demos", group: "Exemples de menus QR à montrer", items: [
    { name: "Démo prospect · Pelmeni Club (Pattaya, prototype non officiel)", icon: "🥟", path: "menus/pelmeni-club-demo/", note: "Fait depuis leur carte publique (150 plats), à envoyer par WhatsApp/LINE. Photos libres de droits = illustrations. Plats/prix à confirmer par eux" },
    { name: "Menu QR · Tahiti Beach Club (à montrer au restaurant)", icon: "🏖️", path: "menus/tahiti-beach-club/", note: "Leur menu à eux : 156 plats et boissons, 20 langues, leur plage en héros, photos d'illustration (mention en bas). Panier + écran serveur" },
    { name: "Menu QR · Mae Lek en français", icon: "🇫🇷", path: "menus/mae-lek/?lang=fr", note: "Photos, piment, allergies, « montrer au serveur » en thaï" },
    { name: "Menu QR · Mae Lek en thaï", icon: "🇹🇭", path: "menus/mae-lek/", note: "9 langues (dont 中文 / Русский / 한국어, hindi, arabe, allemand), piment, écran serveur en thaï" },
    { name: "Menu v2 · filtres + bouton Réserver", path: "nm/demo-menu/", note: "Baan Suan (8 langues) : filtres Végétarien / Pas épicé / Épicé / Choix du chef, WhatsApp + LINE en bas" }
  ] },
  { space: "site", pane: "demos", group: "Démos premium déjà prêtes", items: [
    { name: "SOCAP Paysage", path: "socap-paysage/", note: "Paysagiste (Ain) · démo premium" },
    { name: "Giulivo", path: "giulivo/", note: "Restaurant (Vicopisano) · carte à feuilleter, lumières qui s’allument" }
  ] },
  { space: "site", pane: "tools", group: "Mes outils", items: [
    { name: "Page de vente en thaï · Site web", icon: "🇹🇭", path: "nm/pitch/site-th.html", note: "Une page à envoyer par LINE à un patron : ce qu'il reçoit, étapes, prix 10 000 ฿ + 790 ฿/mois, confiance, calcul d'exemple" },
    { name: "Carte de présentation animée (thaï + français)", icon: "✨", path: "nm/card/index.html", note: "À montrer sur ton téléphone au patron : 7 écrans animés (qui tu es, menu QR, 9 langues, pourquoi plus de clients, prix 150 ฿ la carte, contact LINE/WhatsApp) + traduction française à la fin" },
    { name: "Vidéo menu QR (film + démo claire, ambiance sonore, sans voix)", icon: "🎬", path: "nm/card/video-menu-qr.mp4", note: "100 s, vertical, avec intro « Hello, I'm Mourad » : le resto qui attend → touristes perdus → scan du QR → menu en photos et 9 langues → 150 ฿ la carte + LINE. Sous-titres thaï + anglais (pour un patron anglophone), aucune voix nécessaire" },
    { name: "Vidéo de présentation (sans voix pour l'instant)", icon: "🎬", path: "nm/card/video-sans-voix.mp4", note: "44 s, thaï + sous-titres français. La voix thaïe (ta femme) sera ajoutée dessus" },
    { name: "Vidéo « 5 raisons d'avoir un menu QR » (thaï + anglais)", icon: "🎬", path: "nm/card/video-5-raisons.mp4", note: "27 s, vertical, sous-titres thaï + anglais, ton propre contenu. Voix thaïe à ajouter (enregistrement de ta femme)" },
    { name: "Page de vente en thaï · Menu QR", icon: "🇹🇭", path: "nm/pitch/menu-th.html", note: "Même chose pour le menu QR : 3 000 ฿ + 390 ฿/mois, exemple « 13 ฿ par jour »" },
    { name: "Statistiques détaillées", path: "nm/stats.html", note: "Visites et contacts, jour par jour (le résumé est dans l'onglet Site visits)" },
    { name: "Tableau de bord des menus QR", path: "nm/menus.html", note: "Clients (qui a payé, QR, rappel WhatsApp) · Chiffres · + Nouveau client" },
    { name: "Maquette express", path: "nm/maquette.html", note: "Montrer à un commerçant à quoi son site pourrait ressembler" },
    { name: "Générateur de QR code", path: "nm/qr-generator.html", note: "Un QR en PNG ou SVG pour n'importe quel lien" },
    { name: "Chevalet QR à imprimer (A5)", path: "nm/print/chevalet-qr.html", note: "Nom du resto + lien du menu → panneau de table prêt à imprimer, QR testé" },
    { name: "Carte de visite (thaï)", path: "nm/print/carte-th.html", note: "90 × 54 mm · fichier imprimerie : nm/print/carte-visite-imprimerie.pdf" },
    { name: "Avant / après à imprimer (A4)", path: "nm/print/avant-apres-th.html", note: "La feuille « vieux menu → QR → téléphone » en thaï" },
    { name: "Mes discussions", path: "nm/organisation.html", note: "Où en est chaque conversation + ce qui t'attend" }
  ] },
  { space: "formation", group: "NM Academy", items: [
    { name: "NM Academy (à jour)", path: "https://claude.ai/artifact/8nSXmvuVbzfwtwMEkdeBjh", note: "La formation : page de vente, formations, réalisations, tarifs, inscription" }
  ] },
  { space: "video", group: "Mon site", items: [
    { name: "Story Studio", path: "story/", note: "Dessin animé en plusieurs épisodes" }
  ] },
  { space: "video", group: "Pub NM Studio", items: [
    { name: "Pub NM Studio · Français", path: "nm/assets/video/pub/nm-studio-pub-fr.mp4?v=5", note: "Film complet 63 s · site Giulivo sur le téléphone · TikTok / Reels avec sous-titres" },
    { name: "Pub NM Studio · English", path: "nm/assets/video/pub/nm-studio-pub-en.mp4?v=5" },
    { name: "Pub NM Studio · ไทย", path: "nm/assets/video/pub/nm-studio-pub-th.mp4?v=5" }
  ] }
];
