/* NM Studio — payment settings for checkout.html.
 *
 * Everything here is optional. Any method left empty still works: the
 * order is confirmed on the page and the customer is asked to send it to
 * you on WhatsApp, where you finish the payment by hand.
 *
 * card      — Stripe Payment Links (dashboard.stripe.com → Payment Links).
 *             Create one link per plan for the setup fee, in each currency
 *             you sell in, and paste the URLs below. The customer is sent
 *             to Stripe's own secure page (card, Apple Pay, Google Pay);
 *             card numbers never touch this site.
 * promptpay — your PromptPay ID (Thai mobile number like "0812345678" or a
 *             13-digit tax/citizen ID). A scannable PromptPay QR with the
 *             exact amount is generated on the checkout page.
 * promptpayName — optional: the account name your bank app shows to the
 *             payer (e.g. "Mourad N."), printed under the QR so customers
 *             can check they're paying the right person.
 * bank      — bank transfer details shown on the confirmation screen.
 */
window.NM_PAYMENTS = {
  card: {
    eur: { basic: "", pro: "", elite: "" },
    thb: { basic: "", pro: "", elite: "" },
    mad: { basic: "", pro: "", elite: "" }
  },
  promptpay: "",
  promptpayName: "",
  bank: { holder: "", bank: "", iban: "", bic: "" }
};
