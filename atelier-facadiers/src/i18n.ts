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
      line1: "De l'ossature",
      line2: 'à la façade',
      text: 'Façonnier et distributeur de solutions de bardage nouvelle génération : stock, préconisation technique, usinage sur-mesure et logistique pilotés pour vos chantiers.',
      cta: 'Demander un devis',
    },
    brands: ['Trespa', 'EQUITONE', 'Fundermax', 'Stacbond', 'Rockpanel'],
    pillars: {
      heading1: 'Cinq métiers, les cinq couleurs de notre',
      heading2: 'enseigne',
      items: [
        { title: 'Stock', text: 'Un stock permanent des principales gammes de bardage pour livrer vos chantiers sans attendre.' },
        { title: 'Préconisation', text: 'Un accompagnement technique pour choisir le bon matériau, la bonne pose, la bonne finition.' },
        { title: 'Logistique', text: 'Une organisation pensée pour livrer au bon endroit, au bon moment, sans casse ni retard.' },
        { title: 'Usinage', text: 'Découpe et façonnage sur-mesure des panneaux selon les plans de votre chantier.' },
        { title: 'Service technique', text: 'Un support réactif avant, pendant et après le chantier pour sécuriser votre mise en œuvre.' },
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
      line1: 'From the frame',
      line2: 'to the facade',
      text: 'Next-generation cladding fabricator and distributor: stock, technical guidance, custom machining and logistics run to keep your job sites on schedule.',
      cta: 'Get a quote',
    },
    brands: ['Trespa', 'EQUITONE', 'Fundermax', 'Stacbond', 'Rockpanel'],
    pillars: {
      heading1: 'Five trades, the five colours of our',
      heading2: 'brand',
      items: [
        { title: 'Stock', text: 'A permanent stock of the main cladding ranges, so your job sites never wait.' },
        { title: 'Guidance', text: 'Technical support to choose the right material, the right install, the right finish.' },
        { title: 'Logistics', text: 'Deliveries organised to arrive at the right place, on time, without damage or delay.' },
        { title: 'Machining', text: 'Custom cutting and shaping of panels to your job site plans.' },
        { title: 'Technical support', text: 'Responsive support before, during and after the job to secure your installation.' },
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
