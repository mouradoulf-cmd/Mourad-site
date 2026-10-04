/* NM Studio — payment settings for checkout.html.
 *
 * Everything here is optional. Any method left empty still works: the
 * order is confirmed on the page and the customer is asked to send it to
 * you on WhatsApp, where you finish the payment by hand.
 *
 * card — Stripe Payment Links (dashboard.stripe.com → Payment Links), in THB.
 *        One link per combination below. The customer is sent to Stripe's
 *        own secure page (card, Apple Pay, Google Pay, 3-D Secure); card
 *        numbers never touch this site. In each link:
 *          · "Allow promotion codes" ON  (the promo field pre-fills it)
 *          · After payment → "Don't show confirmation page" → redirect to
 *            https://mouradoulf-cmd.github.io/Mourad-site/nm/success.html
 *        Offer only (one-time price):          google, qr
 *        Offer + subscription/care plan (one-time price + recurring price in
 *        the same link — Stripe charges both today, then renews):
 *          qr_monthly, qr_yearly, website_monthly, website_yearly,
 *          pack_monthly, pack_yearly
 *        website and pack are "setup + subscription": they only ever use the
 *        _monthly / _yearly links, never the plain key.
 *        Prices: see offers-config.js (yearly = 10 × monthly).
 * portal — your Stripe customer portal login link (Settings → Billing →
 *        Customer portal → "Login link"). Clients use it from account.html
 *        to download invoices, update their card or cancel the care plan.
 * promptpay — your PromptPay ID (Thai mobile number like "0812345678" or a
 *        13-digit tax/citizen ID). A scannable PromptPay QR with the exact
 *        amount is generated on the checkout page.
 * promptpayName — optional: the account name your bank app shows to the
 *        payer (e.g. "Mourad N."), printed under the QR.
 * bank — bank transfer details shown on the confirmation screen.
 */
window.NM_PAYMENTS = {
  card: {
    google: "", qr: "",
    qr_monthly: "", qr_yearly: "",
    website_monthly: "", website_yearly: "",
    pack_monthly: "", pack_yearly: ""
  },
  portal: "",
  promptpay: "",
  // Sample PromptPay QR (stamped "Sample", can't be paid) until the real
  // PromptPay ID above is filled in — then it switches off by itself.
  demo: true,
  promptpayName: "",
  /* Real bank details: the checkout shows the transfer block (holder, IBAN, copy
     button, slip upload) as soon as an IBAN is present, and the Thai QR stays off
     until a PromptPay ID is filled in above. Keep the IBAN grouped by four. */
  bank: { holder: "MOURAD OULD EL RHALIA", bank: "", iban: "FR76 2823 3000 0126 3448 3447 329", bic: "" }
};
