# AI Order Line — démo NM Studio

Preuve de concept d'un agent vocal qui prend une commande à l'oral (comme
un client qui appellerait le restaurant) et l'envoie en direct sur un
écran cuisine — pour pitcher l'idée à un client type kebab/fast-food.

Site statique en HTML / CSS / JS pur, identité visuelle NM Studio (fond
`#04050c`, dégradé cyan/violet/rose, police Onest).

- `index.html` — écran "Appel" : micro (reconnaissance vocale du
  navigateur), menu à taper en secours, panier en direct.
- `tablet.html` — écran "Cuisine" : les commandes envoyées apparaissent ici
  automatiquement, comme un écran KDS.
- `assets/js/menu-data.js` — le menu du restaurant fictif "Kebab Express"
  (nom/produits à changer pour un vrai client).
- `assets/js/nlu.js` — reconnaissance très simple des articles/quantités
  dans une phrase (mots-clés + nombres en toutes lettres).
- `assets/js/order-bus.js` — synchronise les deux écrans via
  `BroadcastChannel`/`localStorage`, sans backend.
- `assets/js/call.js` / `assets/js/tablet.js` — logique de chaque écran.

## Voir la démo en local

```bash
python3 -m http.server 8000
```

Ouvrez `http://localhost:8000/ai-order-line/index.html`, puis ouvrez
`tablet.html` dans un **second onglet ou une seconde fenêtre du même
navigateur** — c'est ce second écran qui joue le rôle de la tablette
cuisine. Parlez (bouton micro) ou tapez une commande, elle apparaît
aussitôt de l'autre côté.

## Ce que c'est vraiment (et ce que ce n'est pas)

C'est une démo de concept qui tourne 100% dans le navigateur : le micro
utilisé est celui de l'appareil sur lequel la page est ouverte, il n'y a
**aucun vrai numéro de téléphone branché**, et la synchronisation entre
les deux écrans ne marche qu'entre deux onglets/fenêtres du **même**
navigateur (pas entre deux appareils différents, faute de serveur).

Pour une vraie ligne téléphonique chez un client, il faudrait en plus :

1. Un numéro de téléphone via un service comme **Twilio** (ou équivalent
   thaï), qui reçoit l'appel entrant.
2. Un petit serveur (webhook) qui relie cet appel à un moteur de
   reconnaissance vocale + à Claude pour comprendre la commande, et
   génère une réponse vocale (text-to-speech).
3. Une vraie synchronisation multi-appareils vers la tablette du
   restaurant (websocket ou base de données partagée, pas juste
   `localStorage`).

Alternative plus rapide à mettre en place que du sur-mesure : des
plateformes toutes faites comme **Vapi**, **Retell AI** ou **Slang.ai**
(spécialisé restaurants) permettent de brancher un vrai numéro en
quelques heures, en marque blanche.

## Personnalisation pour un vrai client

- Nom du restaurant et menu : `assets/js/menu-data.js`
  (`NM_RESTAURANT_NAME` et le tableau `MENU`).
- Mots-clés reconnus à l'oral : `assets/js/nlu.js`.
- Palette : variables CSS en haut de `assets/css/style.css`.

⚠️ Comme pour les autres démos fictives du repo, ne pas publier cette
page avec le nom d'un vrai restaurant sans son accord — elle reste un
support de démonstration à montrer en personne tant qu'elle n'est pas
branchée à une vraie ligne téléphonique.
