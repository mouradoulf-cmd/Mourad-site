/* NM Studio: the owner's settings that are not prices. Fill these in, nothing else to change.
 *
 * whatsappNumber — full international number, digits only (e.g. "66812345678"). When set, the free mock-up and
 *                  free check forms open WhatsApp with the message already typed. Empty: the message is copied
 *                  and the usual WhatsApp QR link opens.
 * whatsappLink   — the link used everywhere today (QR link from the WhatsApp Business app).
 * founderName    — the first name shown in "Who is behind NM Studio".
 * founderPhoto   — path to a square photo, e.g. "assets/img/founder.jpg" (from the nm/ folder). Empty: a monogram.
 * analyticsToken — Cloudflare Web Analytics token (free, no cookies). Empty: no analytics at all.
 */
window.NM_CONTACT = {
  whatsappNumber: "",
  whatsappLink: "https://wa.me/qr/PYPOVXTCVM74I1",
  founderName: "Mourad",
  founderPhoto: "",
  analyticsToken: "",

  /* Video-call booking (Thailand time). Only real data here: your real opening hours and the slots really taken.
     days: 1 = Monday ... 7 = Sunday.  booked: "YYYY-MM-DD HH:MM", e.g. "2026-10-12 15:00".  closed: whole days off, "YYYY-MM-DD". */
  booking: {
    days: [1, 2, 3, 4, 5, 6],
    hours: ["10:00", "11:00", "14:00", "15:00", "16:00", "17:00", "18:00"],
    minutes: 20,
    daysAhead: 10,
    booked: [],
    closed: []
  }
};
