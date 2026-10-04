/* ===== À REMPLIR PAR TOI : tout le site se met à jour depuis ce bloc ===== */
const CONFIG={
  BRAND:"IA Academy",
  WHATSAPP:"33600000000",   // ton numéro au format international, sans + (ex: 33612345678)
  // Liens de paiement (Stripe > Payment Links, ou PayPal.me). Vide = bouton WhatsApp à la place.
  PAY:{ p1:"", p2:"", p3:"", bundle:"" },
  PRICES:{ p1:29, p2:39, p3:39, bundle:79 }   // en € — modifie librement
};
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
document.documentElement.classList.add('js');
$$('[data-brand]').forEach(e=>e.textContent=CONFIG.BRAND);
$$('[data-price]').forEach(e=>e.textContent=CONFIG.PRICES[e.dataset.price]+'€');
const names={p1:"Pack 1 - Apprendre l'IA",p2:"Pack 2 - Gagner de l'argent avec l'IA (sites web)",p3:"Pack 3 - Vidéos IA pour TikTok",bundle:"Pack Complet (les 3)"};
$$('[data-buy]').forEach(a=>{
  const k=a.dataset.buy,url=CONFIG.PAY[k];
  a.href=url||`https://wa.me/${CONFIG.WHATSAPP}?text=${encodeURIComponent('Bonjour, je veux : '+names[k])}`;
  a.target='_blank';a.rel='noopener';
});
$$('[data-wa]').forEach(a=>{a.href=`https://wa.me/${CONFIG.WHATSAPP}`;a.target='_blank';a.rel='noopener'});
if('IntersectionObserver' in window){
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
  $$('.reveal').forEach(el=>{el.classList.add('pre');io.observe(el)});
}
