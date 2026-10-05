/* ============================================================
   CONFIG — edit this file to sell your course. Nothing here is a real price until YOU fill it in.
   - BUY_URL: payment link (Stripe/PayPal link, LINE OA, Gumroad, Payhip…). Empty = "coming soon" + LINE button if LINE is set.
   - LINE: your LINE OA link (e.g. https://lin.ee/xxxx) — used for questions / manual PromptPay payment.
   - CODES: access codes you hand out after payment. NOTE: they live in this public file, so a technical visitor
     can read them. Fine for a small launch; for real protection use a server-side check or a payment platform.
   ============================================================ */
window.EE = window.EE || {};
EE.CONFIG = {
  PRODUCT: "English Easy Pro",
  TAGLINE: "ปลดล็อกทุกบทเรียน หัวใจไม่จำกัด เรียนต่อเนื่องไม่สะดุด",
  /* FREE_UNITS = how many course units are free (the rest need Pro). 12 = free up to "Daily routine"; 99 = everything free. */
  FREE_UNITS: 12,
  /* Suggested launch prices (Thai market). Change freely. `months` is used to compute the real saving vs the monthly plan. */
  PLANS: [
    { id: "month", name: "รายเดือน", price: "฿199", amount: 199, per: "/เดือน", note: "ยกเลิกได้ทุกเมื่อ", months: 1 },
    { id: "year", name: "รายปี", price: "฿1,290", amount: 1290, per: "/ปี", note: "เฉลี่ยเดือนละ ฿108", months: 12, best: true },
    { id: "life", name: "ตลอดชีพ", price: "฿2,490", amount: 2490, per: "ครั้งเดียว", note: "จ่ายครั้งเดียว เรียนได้ตลอด", months: 0 }
  ],
  FEATURES: [
    ["🎓", "คอร์สเต็มครบ 24 หน่วย", "ปลดล็อกหน่วย 13–24: ร่างกาย ช้อปปิ้ง ไวยากรณ์ อดีต/อนาคต สถานการณ์จริง"],
    ["🎙️", "ฝึกพูดพร้อมตรวจเสียง", "พูดใส่ไมค์ ระบบเช็คการออกเสียงให้ทันที"],
    ["🔊", "ออกเสียงให้ชัด", "บทเฉพาะสำหรับคนไทย: th, r/l, v/w, สระสั้น–ยาว"],
    ["♾️", "หัวใจไม่จำกัด + ใบรับรอง", "เรียนต่อเนื่อง และรับใบรับรองเมื่อจบคอร์ส"]
  ],
  BUY_URL: "",          /* legacy: single payment link (used only if no CARD_LINKS) */
  LINE: "",             /* https://lin.ee/xxxx — support / manual payment */
  /* Access codes you give buyers. String = lifetime access; or { code, plan:"month"|"year"|"life" }. Public file → weak by design. */
  CODES: [],

  /* ------------ PAYMENT (everything below is read by assets/js/checkout.js — see PAYMENT.md) ------------ */
  PAYMENT: {
    TEST_MODE: false,           /* true = shows a "simulate payment" button (for demos/screenshots ONLY, never in production) */
    PROMPTPAY_ID: "",           /* your PromptPay phone (08xxxxxxxx) or 13-digit national/tax ID → generates a real QR with the amount */
    PROMPTPAY_NAME: "",         /* account holder name shown under the QR */
    CARD_LINKS: { month: "", year: "", life: "" },  /* payment-link per plan (Stripe Payment Link, Omise, PayPal.me…). {email} and {ref} are replaced */
    LINE_ID: "",                /* your LINE OA id, e.g. "@englisheasy" → opens a chat with the order pre-filled */
    VERIFY_URL: "",             /* optional: your server endpoint that confirms a code/payment (see PAYMENT.md). Empty = local CODES */
    SUPPORT_EMAIL: "",
    SELLER: { name: "", address: "", taxId: "" },   /* shown on receipt & legal pages */
    REFUND_DAYS: 7
  }
};
