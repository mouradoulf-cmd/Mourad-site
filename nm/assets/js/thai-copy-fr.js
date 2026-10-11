/* PRIVATE reading copy for the owner (not for clients): French translation of thai-copy.js, amounts in euros (~38 THB = 1 EUR, rounded).
   Loaded only by the /nm/th-fr/ pages, after nm-copy3.js and before i18n.js. */
(function () {
  "use strict";
  var C = {
    fr: {
      meta: { description: "NM Studio réalise menus traduits, sites web, menus QR et fiches Google Business Profile pour restaurants, bars, salons et commerces. En ligne en quelques jours, sans engagement. Dès 8 € (299 ฿)." },
      meta2: {
        pricing: { title: "Tarifs pour les commerces en Thaïlande, dès 8 € (299 ฿) | NM Studio", description: "Menu traduit 8 € (299 ฿), fiche Google 21 € (790 ฿), pack complet 79 € (2 990 ฿) puis entretien 10 €/mois (390 ฿). Sans contrat, maquette gratuite avant de décider." },
        services: { title: "Services : menu traduit, Google et site web | NM Studio", description: "3 formules pour les commerces en Thaïlande : menu traduit, fiche Google et pack complet, dès 8 € (299 ฿). Sans engagement." }
      },
      hero2: {
        price: "Menu traduit dès <b>8 € (299 ฿)</b> · fiche Google <b>21 € (790 ฿)</b> · site complet <b>79 € (2 990 ฿)</b> puis <b>10 €/mois (390 ฿)</b>",
        l4: "Sans contrat : l’entretien mensuel se résilie à tout moment"
      },
      v4: { proof1: "Dès 8 € (299 ฿)" },
      offers: { lead: "Prix en bahts pour les commerces en Thaïlande (ici affichés en euros, ≈ 38 ฿ = 1 €). Dès 8 € (299 ฿), sans contrat, maquette gratuite avant de décider." },
      why2: { r3b: "Nouveaux prix, nouveau menu, nouvelles photos : envoyez-les par WhatsApp ou LINE et c’est fait." },
      svc: { sa4: "Pas besoin : l’hébergement est inclus dans l’entretien à 10 €/mois (390 ฿)." },
      prob: {
        fixB: "10 €/mois (390 ฿), sans rien gérer : nous créons, hébergeons et mettons à jour. Vous, vous gérez votre commerce.",
        cap5: "Site web, menu QR, fiche Google : nous nous occupons de tout. Vous, vous cuisinez."
      },
      price2: {
        title: "Des prix clairs, <em>dès 8 € (299 ฿)</em>",
        lead: "Pour les commerces en Thaïlande : sans contrat, sans frais cachés, maquette gratuite avant de décider.",
        pa1: "Menu traduit et fiche Google : paiement unique. Le pack complet a des frais d’installation de 79 € (2 990 ฿), puis un entretien de 10 €/mois (390 ฿), ou 103 €/an (3 900 ฿, 2 mois offerts). L’entretien compte à partir de la mise en ligne.",
        pq2: "Que comprend l’entretien à 10 €/mois (390 ฿) ?",
        pa2: "L’hébergement, le site toujours en ligne et les modifications illimitées du menu, des prix, des photos et des horaires par WhatsApp ou LINE. Pour aller plus loin : le forfait Croissance à 26 €/mois (990 ฿) et les réseaux sociaux dès 66 €/mois (2 500 ฿).",
        pa3: "Bien sûr. Beaucoup de commerces commencent par le menu traduit ou la fiche Google, puis passent au pack complet quand ils sont prêts.",
        pa4: "Scan du QR PromptPay, virement bancaire ou espèces quand on se rencontre. Les frais d’installation du pack complet se paient en 2 fois : la moitié au démarrage, l’autre moitié à la livraison.",
        pa5: "Non. Pas de contrat : l’entretien mensuel se résilie à tout moment, il suffit de nous envoyer un message."
      },
      free: {
        lead: "Maquette gratuite, sans engagement : vous décidez si elle vous plaît. Votre site peut être en ligne en quelques jours.",
        s3: "Elle vous plaît ? Vous décidez",
        s3b: "Installation 79 € (2 990 ฿), payable en 2 fois. Nous mettons le site en ligne et vous envoyons le lien par LINE ou WhatsApp.",
        s4: "Nous nous en occupons chaque mois",
        s4b: "10 €/mois (390 ฿), avec hébergement, mises à jour et modifications illimitées. Résiliable à tout moment."
      },
      founder: {
        title: "Bonjour, nous sommes Mourad et son épouse. <em>Une petite équipe qui travaille avec le cœur.</em>",
        body: "Nous aimons notre travail et les commerçants que nous rencontrons. Moi, je crée des sites, des menus QR et des fiches Google. Mon épouse est thaïlandaise : elle nous aide à bien vous comprendre, vous et vos clients.",
        quote: "Nous ne cherchons pas à devenir riches. Nous voulons simplement aider les commerçants thaïs, avec un travail soigné à un prix très doux. Quand votre commerce va bien, nous sommes heureux, et nous avançons ensemble.",
        p1: "Nous vous répondons nous-mêmes, avec plaisir, sur WhatsApp", p2: "Nous passons vous voir, ou on se parle en visio, comme vous préférez",
        p3: "Sans contrat, résiliable à tout moment", sign: "Avec le sourire, Mourad et son épouse · NM Studio"
      }
    }
  };
  function deep(t, s) { Object.keys(s).forEach(function (k) { if (s[k] && typeof s[k] === "object") { t[k] = t[k] || {}; deep(t[k], s[k]); } else t[k] = s[k]; }); return t; }
  window.NM_EXTRA_DICT = deep(window.NM_EXTRA_DICT || {}, C);
})();
