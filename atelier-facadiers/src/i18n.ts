export type Lang = 'fr' | 'en';

export const translations = {
  fr: {
    nav: {
      links: [
        { label: 'Qui sommes-nous', href: '#apropos' },
        { label: 'Bardage', href: '#services' },
        { label: 'Ossature', href: '#services' },
        { label: 'Projets', href: '#projets' },
        { label: 'Documentation', href: '#documentation' },
      ],
      cta: 'Devis',
      openMenu: 'Ouvrir le menu',
      closeMenu: 'Fermer le menu',
    },
    hero: {
      line1: 'Atelier des Façadiers',
      line2: 'Ça va barder !',
      text: 'Façonnier et distributeur de solutions de bardage nouvelle génération : stock, préconisation technique, usinage sur-mesure et logistique pilotés pour vos chantiers.',
      cta: 'Demander un devis',
    },
    brands: ['Fundermax', 'Trespa', 'PURA', 'EQUITONE', 'Cedral', 'Rockpanel', 'Stacbond', 'Alpolic', 'Fiberdeck'],
    ossature: {
      heading: "Nos marques d'ossature, conçues par nos soins",
      items: ['InnoCLAD', 'InnoCLAD+', 'TradiCLAD', 'TradiCLAD+', 'Ossature sur mesure'],
    },
    study: {
      heading: "Étude ossature et demande d'optimisation",
      card1: {
        title: 'Note de calcul',
        text: "Pour vous accompagner au mieux dans vos projets de bardage et dans l'exécution de ceux-ci, téléchargez la fiche de renseignement et renvoyez-la avec un plan et coupe de vos façades au format DWG.",
        cta: 'Demander une étude ossature',
      },
      card2: {
        title: 'Demande optimisation',
        text: 'Nous sommes certifiés pour la transformation des panneaux Equitone, Fundermax, Trespa, Stacbond et Alpolic. Nos partenaires fournisseurs bénéficient du droit d’usage à la marque QB.',
        cta: 'Demander une optimisation',
      },
    },
    news: {
      heading: 'Actualités',
      viewAll: 'Voir toutes les actualités',
      readMore: 'Lire la suite',
      items: [
        { title: 'Fermeture estivale', date: null as string | null },
        { title: 'Nouvelle gamme EQUITONE [inspira]', date: null as string | null },
        { title: "Nouveau bâtiment pour l'ossature !", date: '03 Juin 2026' },
        { title: 'Nouveau catalogue 2026', date: '02 Mars 2026' },
      ],
    },
    pillars: {
      heading1: 'Cinq métiers, les cinq couleurs de notre',
      heading2: 'enseigne',
      items: [
        {
          title: 'Stock',
          heading: 'Avec notre stock, démarrez vos chantiers dans les starting-blocks !',
          text: "Notre stock comprend une vaste gamme de panneaux et de systèmes de bardage adaptés à la réalisation rapide de chantiers. Grâce à notre stock bien fourni, nous offrons une grande flexibilité pour le démarrage et la clôture de vos projets. Que vous ayez besoin de matériaux pour un projet urgent ou d'une solution adaptable à vos exigences spécifiques, notre stock est conçu pour répondre à vos besoins avec efficacité et souplesse. Contactez-nous !",
        },
        {
          title: 'Préconisation',
          heading: 'Grâce à notre expertise, jamais de mauvaises surprises !',
          text: "Préconisation du bardage chez les architectes et maîtres d'ouvrage nous permet de valoriser la façade ventilée et les nombreux avantages qu'elle apporte en performance énergétique et en esthétisme afin que cette filière se développe. Nos équipes d'experts sont à votre écoute pour faire avancer vos projets. N'hésitez pas à nous appeler pour avoir des renseignements.",
        },
        {
          title: 'Logistique',
          heading: 'Besoin d’une livraison, notre équipe logistique est sur le pont !',
          text: 'Nous livrons sur chantier pour minimiser le nombre de kilomètres parcourus par nos clients et nos produits. Nos camions sont auto-déchargeables.',
        },
        {
          title: 'Usinage',
          heading: 'Un usinage de qualité pour des chantiers maîtrisés !',
          text: "Notre atelier permet l'usinage des panneaux fibres-ciment, compact HPL, aluminium composite et laine de roche comprimée : coupe, perçage, fraisage, rainurage, lettrage des matériaux de nos partenaires.",
        },
        {
          title: 'Service technique',
          heading: 'Un besoin spécifique ? Pas de panique, il y a le service technique !',
          text: "Notre service technique permet un échange sur les optimisations et les différentes possibilités d'usinage pour gagner du temps de pose, baisser les taux de chute ou proposer des solutions décoratives intégrées. Nous sommes certifiés en tant que transformateur pour la transformation des panneaux Equitone, Fundermax, Trespa, Stacbond et Alpolic, fournisseurs qui bénéficient du droit d'usage à la marque QB. Transmettez-nous vos plans DWG tramés ou le fichier complété.",
        },
      ],
    },
    about: {
      alt: 'Intérieur du hangar de stockage Atelier des Façadiers, panneaux de bardage sur convoyeur',
      heading1: "Le trait d'union entre les",
      headingAccent: 'fabricants',
      heading2: 'et les poseurs',
      text: 'Atelier des Façadiers accompagne les professionnels du bardage à chaque étape : sélection des matériaux, usinage sur-mesure, logistique de chantier et suivi technique. Un seul interlocuteur pour sécuriser vos délais et la qualité de vos façades.',
      stat1: 'métiers intégrés',
      stat2: 'marques distribuées',
    },
    projects: {
      heading1: 'Des',
      headingAccent: 'chantiers',
      heading2: 'menés du gros œuvre à la finition',
      caption1: "Nouveau bâtiment pour l'ossature",
      caption2: 'Bardage métallique — finition posée',
      caption3: 'Hangar prêt à équiper',
      caption4: 'Bardage bicolore — bois et anthracite',
      catalogueCta: 'Catalogue 2026 — demander un exemplaire',
    },
    cta: {
      heading: 'Un projet de bardage ?',
      headingAccent: 'Parlons-en.',
      text: 'Notre équipe vous répond pour étudier votre chantier et vous proposer la solution la plus adaptée.',
    },
    footer: {
      address: '7 rue des Garennes, 01600 Reyrieux',
      phone: '04 74 17 33 33',
      hours: 'Lun–Jeu 7h30–17h00 · Ven 7h30–16h00',
      links: [
        { label: 'Qui sommes-nous ?', href: '#apropos' },
        { label: 'Bardage', href: '#services' },
        { label: 'Ossature', href: '#services' },
        { label: 'Projets', href: '#projets' },
        { label: 'Contact / Devis', href: '#contact' },
      ],
      rights: '© 2026 Atelier des Façadiers — Tous droits réservés',
    },
  },
  en: {
    nav: {
      links: [
        { label: 'About us', href: '#apropos' },
        { label: 'Cladding', href: '#services' },
        { label: 'Framework', href: '#services' },
        { label: 'Projects', href: '#projets' },
        { label: 'Documentation', href: '#documentation' },
      ],
      cta: 'Get a quote',
      openMenu: 'Open menu',
      closeMenu: 'Close menu',
    },
    hero: {
      line1: 'Atelier des Façadiers',
      line2: 'Ça va barder !',
      text: 'Next-generation cladding fabricator and distributor: stock, technical guidance, custom machining and logistics run to keep your job sites on schedule.',
      cta: 'Get a quote',
    },
    brands: ['Fundermax', 'Trespa', 'PURA', 'EQUITONE', 'Cedral', 'Rockpanel', 'Stacbond', 'Alpolic', 'Fiberdeck'],
    ossature: {
      heading: 'Our own framework product lines',
      items: ['InnoCLAD', 'InnoCLAD+', 'TradiCLAD', 'TradiCLAD+', 'Custom framework'],
    },
    study: {
      heading: 'Framework study and optimisation request',
      card1: {
        title: 'Calculation report',
        text: 'To support your cladding projects and their execution, download the information sheet and return it with a plan and cross-section of your facades in DWG format.',
        cta: 'Request a framework study',
      },
      card2: {
        title: 'Optimisation request',
        text: 'We are certified to transform Equitone, Fundermax, Trespa, Stacbond and Alpolic panels. Our supplier partners benefit from usage rights to the QB brand.',
        cta: 'Request an optimisation',
      },
    },
    news: {
      heading: 'News',
      viewAll: 'View all news',
      readMore: 'Read more',
      items: [
        { title: 'Summer closure', date: null as string | null },
        { title: 'New EQUITONE [inspira] range', date: null as string | null },
        { title: 'New building for the steel frame!', date: 'June 3, 2026' },
        { title: '2026 catalogue', date: 'March 2, 2026' },
      ],
    },
    pillars: {
      heading1: 'Five trades, the five colours of our',
      heading2: 'brand',
      items: [
        {
          title: 'Stock',
          heading: 'With our stock, get your job sites off the starting blocks!',
          text: 'Our stock includes a wide range of cladding panels and systems suited to fast-moving job sites. With a well-stocked inventory, we offer great flexibility for starting and closing out your projects. Whether you need materials for an urgent job or a solution tailored to specific requirements, our stock is built to meet your needs efficiently and flexibly. Get in touch!',
        },
        {
          title: 'Guidance',
          heading: 'Thanks to our expertise, no bad surprises!',
          text: 'Advising architects and project owners on cladding lets us highlight the benefits of ventilated facades — energy performance and aesthetics — so the industry keeps growing. Our expert teams are on hand to move your projects forward. Feel free to call us for information.',
        },
        {
          title: 'Logistics',
          heading: 'Need a delivery? Our logistics team is on it!',
          text: 'We deliver directly to the job site to minimise the distance travelled by our clients and our products. Our trucks are self-unloading.',
        },
        {
          title: 'Machining',
          heading: 'Quality machining for well-controlled job sites!',
          text: "Our workshop handles machining of fibre-cement, compact HPL, aluminium composite and compressed rock wool panels: cutting, drilling, milling, grooving, and engraving of our partners' materials.",
        },
        {
          title: 'Technical support',
          heading: 'A specific need? No panic, our technical team is here!',
          text: 'Our technical team can discuss optimisations and machining options to reduce install time, cut waste rates or add integrated decorative solutions. We are certified transformers for Equitone, Fundermax, Trespa, Stacbond and Alpolic panels, suppliers who benefit from usage rights to the QB brand. Send us your gridded DWG plans or the completed form.',
        },
      ],
    },
    about: {
      alt: 'Inside the Atelier des Façadiers warehouse, cladding panels on the conveyor',
      heading1: 'The link between',
      headingAccent: 'manufacturers',
      heading2: 'and installers',
      text: 'Atelier des Façadiers supports cladding professionals at every step: material selection, custom machining, site logistics and technical follow-up. One single point of contact to secure your deadlines and the quality of your facades.',
      stat1: 'integrated trades',
      stat2: 'distributed brands',
    },
    projects: {
      heading1: 'Job sites',
      headingAccent: 'carried',
      heading2: 'from shell to finish',
      caption1: 'New building for the steel frame',
      caption2: 'Metal cladding — finish installed',
      caption3: 'Warehouse ready for fit-out',
      caption4: 'Two-tone cladding — timber and anthracite',
      catalogueCta: '2026 catalogue — request a copy',
    },
    cta: {
      heading: 'A cladding project?',
      headingAccent: "Let's talk.",
      text: 'Our team will review your job site and recommend the most suitable solution.',
    },
    footer: {
      address: '7 rue des Garennes, 01600 Reyrieux, France',
      phone: '+33 4 74 17 33 33',
      hours: 'Mon–Thu 7:30am–5pm · Fri 7:30am–4pm',
      links: [
        { label: 'About us', href: '#apropos' },
        { label: 'Cladding', href: '#services' },
        { label: 'Framework', href: '#services' },
        { label: 'Projects', href: '#projets' },
        { label: 'Contact / Quote', href: '#contact' },
      ],
      rights: '© 2026 Atelier des Façadiers — All rights reserved',
    },
  },
};

export type Translations = typeof translations.fr;
