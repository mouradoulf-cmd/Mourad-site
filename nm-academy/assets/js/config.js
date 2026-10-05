/* =====================================================================
   NM ACADEMY — réglages (modifie uniquement ce bloc)
   ===================================================================== */
window.CONFIG={
  BRAND:"NM Academy",
  CURRENCY:"€",
  // Contact de vente (le bouton "Rejoindre" ouvre WhatsApp si aucun lien de paiement n'est renseigné)
  WHATSAPP:"33600000000",            // numéro international sans + ni espaces
  EMAIL:"contact@exemple.com",
  // Liens de paiement (Stripe > Payment Links, ou autre) — laisse vide tant que ce n'est pas prêt
  LINKS:{a:"",b:"",pack:""},
  // Prix d'EXEMPLE : à remplacer par tes vrais prix
  PLANS:{
    a:{price:49, per:"mo"},      // abonnement mensuel (accès + templates + mises à jour)
    b:{price:97, per:"once"},    // paiement unique
    pack:{price:197, per:"once"} // A + B à vie
  },
  // Fin d'offre RÉELLE (ISO, ex "2026-12-31T23:59:00+01:00"). Vide = aucun compte à rebours (ne jamais mettre une fausse date)
  OFFER_END:"",
  MEMBER_CODE:"NM2026",              // code d'accès à l'espace membres (à envoyer après paiement ; à changer)
  REFUND_DAYS:7
};
