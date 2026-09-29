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
 *        Offer only (one-time price):          google, qr, pack, ultimate
 *        Offer + care plan (one-time price + recurring price in the same
 *        link — Stripe charges both today, then renews the care plan):
 *          qr_monthly, qr_yearly, pack_monthly, pack_yearly,
 *          ultimate_monthly, ultimate_yearly
 *        Prices: see offers-config.js (care yearly = 10 × monthly).
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
    google: "", qr: "", pack: "", ultimate: "",
    qr_monthly: "", qr_yearly: "",
    pack_monthly: "", pack_yearly: "",
    ultimate_monthly: "", ultimate_yearly: ""
  },
  portal: "",
  promptpay: "",
  promptpayName: "",
  bank: { holder: "", bank: "", iban: "", bic: "" }
};
