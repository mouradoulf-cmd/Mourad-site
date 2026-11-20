/* PRIVATE reading copy for the owner (not for clients): French translation of thai-copy.js, amounts in euros (~38 THB = 1 EUR, rounded).
   Loaded only by the /nm/th-fr/ pages, after nm-copy3.js and before i18n.js. */
(function () {
  "use strict";
  var C = {
    fr: {
      meta: { description: "NM Studio réalise des menus QR multilingues et des sites web pour restaurants, bars, salons et commerces. Menu QR : 3 000 ฿ une fois puis 390 ฿ par mois. Site web : 10 000 ฿ une fois puis 790 ฿ par mois. Sans engagement." },
      meta2: {
        pricing: { title: "Tarifs : menu QR 3 000 ฿ + 390 ฿/mois, site web 10 000 ฿ + 790 ฿/mois | NM Studio", description: "Menu QR en 9 langues : 3 000 ฿ une fois puis 390 ฿ par mois. Site web : 10 000 ฿ une fois puis 790 ฿ par mois. Hébergement, entretien et modifications compris dans l’abonnement. Sans contrat." },
        services: { title: "Services : menu QR et site web | NM Studio", description: "2 services pour les commerces en Thaïlande : menu QR en 9 langues et site web. Mise en place payée une fois, puis abonnement mensuel. Sans engagement." }
      },
      hero2: {
        price: "Menu QR <b>3 000 ฿</b> + <b>390 ฿/mois</b> · site web <b>10 000 ฿</b> + <b>790 ฿/mois</b>",
        l4: "Sans contrat : l’entretien mensuel se résilie à tout moment"
      },
      v4: { proof1: "Menu QR : 3 000 ฿ + 390 ฿/mois" },
      offers: { lead: "Prix en bahts. Une mise en place payée une seule fois, puis un abonnement mensuel : hébergement, entretien et modifications compris. Maquette gratuite avant de décider." },
      why2: { r3b: "Nouveaux prix, nouveau menu, nouvelles photos : envoyez-les par WhatsApp ou LINE et c’est fait." },
      svc: { sa4: "Pas besoin : l’hébergement est inclus dans l’abonnement mensuel." },
      prob: {
        fixB: "Abonnement mensuel, sans rien gérer : nous créons, hébergeons et mettons à jour. Vous, vous gérez votre commerce.",
        cap5: "Site web et menu QR : nous nous occupons de tout, chaque mois. Vous, vous cuisinez."
      },
      price2: {
        title: "Des prix clairs, <em>une fois, puis au mois</em>",
        lead: "Sans contrat, sans frais cachés, maquette gratuite avant de décider.",
        pa1: "Menu QR : 3 000 ฿ une seule fois, puis 390 ฿ par mois. Site web : 10 000 ฿ une seule fois, puis 790 ฿ par mois. L’abonnement mensuel commence une fois tout en ligne.",
        pq2: "Que comprend l’abonnement mensuel ?",
        pa2: "L’hébergement, le site ou le menu toujours en ligne, et les modifications des plats, des prix, des photos et des horaires par WhatsApp ou LINE.",
        pa3: "Bien sûr. Beaucoup de commerces commencent par le menu QR, puis ajoutent le site quand ils sont prêts. Pour les deux, écrivez-nous pour le prix.",
        pa4: "Scan du QR PromptPay, virement ou espèces quand on se rencontre. Nous fixons ensemble le paiement de la mise en place.",
        pa5: "Non. Pas de contrat : l’abonnement mensuel se résilie à tout moment, il suffit de nous envoyer un message."
      },
      free: {
        lead: "Maquette gratuite, sans engagement : vous décidez si elle vous plaît. Votre site peut être en ligne en quelques jours.",
        s3: "Elle vous plaît ? Vous décidez",
        s3b: "Elle vous plaît ? Vous réglez la mise en place (menu QR 3 000 ฿, site web 10 000 ฿), puis nous mettons en ligne et vous envoyons le lien par LINE ou WhatsApp.",
        s4: "Nous nous en occupons chaque mois",
        s4b: "Menu QR 390 ฿ ou site web 790 ฿ par mois : hébergement, entretien et modifications compris. Résiliable à tout moment."
      },
      founder: {
        title: "Bonjour, je suis Mourad. <em>Avec l’aide de mon épouse, nous avons créé ce business.</em>",
        body: "Cela fait longtemps que je travaille sur les sites web, les menus QR et les fiches Google. Mon épouse comprend les commerçants thaïs ; moi, étranger moi-même, je comprends les clients venus d’ailleurs. À deux, nous comprenons les deux côtés.",
        quote: "Nous ne cherchons pas à devenir riches. Nous voulons simplement aider les commerçants thaïs, avec un travail soigné à un prix très doux. Quand votre commerce va bien, nous sommes heureux, et nous avançons ensemble.",
        p1: "Nous vous répondons nous-mêmes, avec plaisir, sur WhatsApp", p2: "Nous passons vous voir, ou on se parle en visio, comme vous préférez",
        p3: "Sans contrat, résiliable à tout moment", sign: "Avec le sourire, Mourad · NM Studio"
      }
    }
  };
  function deep(t, s) { Object.keys(s).forEach(function (k) { if (s[k] && typeof s[k] === "object") { t[k] = t[k] || {}; deep(t[k], s[k]); } else t[k] = s[k]; }); return t; }
  window.NM_EXTRA_DICT = deep(window.NM_EXTRA_DICT || {}, C);
})();
