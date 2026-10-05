# English Easy — payment setup

The whole checkout is built (`#/checkout/<plan>`: plan → details → pay → activate → receipt). It stays in "coming soon" until you fill in **`assets/js/config.js`**.
Nothing is charged by this site itself: money goes through PromptPay / your payment provider / LINE.

## 1. Pick how you get paid (any combination)

| Method | What to fill in `CONFIG.PAYMENT` | How it works |
|---|---|---|
| **PromptPay QR** | `PROMPTPAY_ID` (08… phone or 13-digit ID), `PROMPTPAY_NAME` | The site generates a *real* EMV PromptPay QR with the exact amount. Buyer pays in their banking app, then sends you the slip (LINE/email). You reply with an activation code. Free, no provider needed. |
| **Card** | `CARD_LINKS: { month, year, life }` | Create 3 *Payment Links* (Stripe, Omise, PayPal…). The site opens the right one (Stripe gets `prefilled_email` + `client_reference_id`). |
| **LINE** | `LINE_ID: "@youroa"` (or top-level `LINE`) | Opens a LINE chat with the order text pre-filled. |
| Test | `TEST_MODE: true` | Shows "simulate payment" so you can demo the flow. **Turn off before going live** — anyone could use it. |

Also fill `SELLER` (name/address/tax id → receipt & legal pages), `SUPPORT_EMAIL`, `REFUND_DAYS`, and the prices in `PLANS` (`amount` is the number charged).

## 2. Activation (how a paying buyer gets Pro)

* **Simple (no server):** put codes in `CODES` (`"ABC123"` = lifetime, or `{ code:"X1", plan:"year" }`). Send one code per buyer after you see the payment. ⚠️ The file is public, so a technical visitor can read the codes.
* **Safe (recommended when you scale):** set `VERIFY_URL` to a tiny server/serverless endpoint. The site POSTs `{ code, email, orderId }` and expects `{ "ok": true, "plan": "month|year|life", "until": <ms timestamp optional> }` (or `{ "ok": false, "msg": "…" }`). Your function checks the code/payment in your database or Stripe and answers. Free options: Cloudflare Workers, Vercel/Netlify functions, Supabase.
* Even then Pro is stored in the buyer's browser; clearing data means re-entering the code. Real accounts need a backend (ask me to add Supabase/Firebase login).

## 3. Before you sell
* Have the Terms/Privacy templates (`#/terms`, `#/privacy`) reviewed by a lawyer; register as required (e.g. tax/VAT, DBD e-commerce registration in Thailand).
* Test with a real small payment end-to-end.
