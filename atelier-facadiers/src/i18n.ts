export type Lang = 'fr' | 'en';

export const translations = {
  fr: {
    nav: {
      links: [
        { label: 'Qui sommes-nous', href: '#apropos' },
        { label: 'Bardage', href: '#marques' },
        { label: 'Ossature', href: '#ossature' },
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
    equitone: {
      tagline: 'Fibre cement facade materials',
      caption: "Villeneuve d'Ascq, EQUITONE [tectiva] te90",
      paragraphs: [
        "Découvrez les panneaux de façade EQUITONE. Le fibre-ciment est un matériau composite minéral hautes performances, authentique et durable. Du ciment, de la cellulose, des charges minérales, de l'eau et de l'air.",
        "La gamme EQUITONE est faite dans un matériau naturel à la personnalité pure et authentique. EQUITONE, de par sa conception incombustible et avec l'appui du test Lepir II, permet de supprimer les bavettes dans de nombreuses configurations.",
      ],
      gammesHeading: 'Gammes',
      backCta: 'Retour au bardage',
      quoteCta: 'Demander un devis EQUITONE',
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
      eyebrow: 'Qui sommes-nous',
      heading: 'Notre histoire',
      alt: "Siège de l'Atelier des Façadiers à Reyrieux",
      paragraphs: [
        "Créé en 2015, L'Atelier des Façadiers est né d'un constat : les bardeurs sont confrontés à des exigences croissantes en matière de rapidité et de qualité, tout en faisant face à des défis tels que le recrutement, le travail en hauteur et des conditions extérieures difficiles, souvent sur des sites occupés.",
        "Pour répondre à ces besoins, nous avons d'abord proposé des services de découpe et de perçage de panneaux. Puis, nous avons élargi notre offre avec des stocks d'accessoires et des solutions techniques complètes. Aujourd'hui, nous travaillons une large gamme de matériaux, allant des panneaux en fibrociment et compact HPL aux panneaux composites, en plan, cassette ou bandeaux. Nous fournissons également des solutions d'ossature pour répondre aux projets les plus complexes.",
      ],
      stats: [
        { value: 2, label: 'sites de production et de stockage sur +7 000 m²' },
        { value: 24, suffix: '+', label: 'collaborateurs à votre écoute' },
        { display: 'QB15', label: 'Certifié pour l’ensemble de nos panneaux' },
        { display: '★', label: "Diverses solutions d'usinage" },
      ],
      valuesHeading: 'Nos valeurs',
      values: [
        { title: 'Le bonheur des collaborateurs', text: 'Donner les meilleures conditions à chacun pour qu’il soit performant dans son travail.' },
        { title: "Cultiver l'amour du client", text: 'Faire de notre mieux et chercher les solutions qui rendraient service à nos clients.' },
        { title: "Esprit d'équipe, responsable et fier", text: 'Donner le meilleur de nous, avancer en équipe, être fiers de nous et de l’entreprise.' },
        { title: "Innovation & ouverture d'esprit", text: 'Tester, essayer pour toujours avancer, comprendre les problématiques de nos clients.' },
        { title: 'Préserver notre planète pour un avenir durable', text: 'Prendre chaque décision pour réduire notre impact sur notre planète.' },
      ],
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
        { label: 'Bardage', href: '#marques' },
        { label: 'Ossature', href: '#ossature' },
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
        { label: 'Cladding', href: '#marques' },
        { label: 'Framework', href: '#ossature' },
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
    equitone: {
      tagline: 'Fibre cement facade materials',
      caption: "Villeneuve d'Ascq, EQUITONE [tectiva] te90",
      paragraphs: [
        'Discover EQUITONE facade panels. Fibre cement is a high-performance mineral composite material, authentic and durable — made of cement, cellulose, mineral fillers, water and air.',
        "The EQUITONE range is made from a natural material with a pure, authentic character. Thanks to its non-combustible design and the Lepir II test, EQUITONE removes the need for flashing in many configurations.",
      ],
      gammesHeading: 'Ranges',
      backCta: 'Back to cladding',
      quoteCta: 'Request an EQUITONE quote',
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
      eyebrow: 'About us',
      heading: 'Our story',
      alt: 'Atelier des Façadiers headquarters in Reyrieux',
      paragraphs: [
        'Founded in 2015, Atelier des Façadiers was born from an observation: cladders face growing demands for speed and quality, while dealing with challenges like recruitment, working at height, and difficult outdoor conditions, often on occupied sites.',
        'To meet these needs, we first offered panel cutting and drilling services. We then expanded into accessory stock and complete technical solutions. Today we work with a wide range of materials, from fibre-cement and compact HPL panels to composite panels, in sheet, cassette or strip form. We also provide framework solutions for the most complex projects.',
      ],
      stats: [
        { value: 2, label: 'production and storage sites over +7,000 m²' },
        { value: 24, suffix: '+', label: 'staff ready to help' },
        { display: 'QB15', label: 'Certified across all our panels' },
        { display: '★', label: 'Various machining solutions' },
      ],
      valuesHeading: 'Our values',
      values: [
        { title: 'Staff wellbeing', text: 'Give everyone the best conditions to perform well in their work.' },
        { title: 'A love of the customer', text: 'Do our best and look for solutions that genuinely help our clients.' },
        { title: 'Team spirit, responsible and proud', text: 'Give our best, move forward as a team, be proud of ourselves and the company.' },
        { title: 'Innovation & open-mindedness', text: "Test and try to keep improving, and understand our clients' challenges." },
        { title: 'Protecting our planet for a sustainable future', text: 'Make every decision to reduce our impact on the planet.' },
      ],
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
        { label: 'Cladding', href: '#marques' },
        { label: 'Framework', href: '#ossature' },
        { label: 'Projects', href: '#projets' },
        { label: 'Contact / Quote', href: '#contact' },
      ],
      rights: '© 2026 Atelier des Façadiers — All rights reserved',
    },
  },
};

export type Translations = typeof translations.fr;
