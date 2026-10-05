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
  PLANS: [
    { id: "month", name: "รายเดือน", price: "฿—", per: "/เดือน", note: "ยกเลิกได้ทุกเมื่อ" },
    { id: "year", name: "รายปี", price: "฿—", per: "/ปี", note: "คุ้มที่สุด", best: true }
  ],
  FEATURES: [
    ["♾️", "หัวใจไม่จำกัด", "เรียนต่อได้ไม่ต้องรอ"],
    ["🔓", "ปลดล็อกทุกบทเรียน", "ข้ามไปบทที่ต้องการได้ทันที"],
    ["🎯", "โหมดฝึกจุดอ่อน", "ทวนเฉพาะคำที่ตอบผิด"],
    ["🧠", "อัปเดตเนื้อหาใหม่", "คำศัพท์และบทเรียนเพิ่มเรื่อย ๆ"]
  ],
  BUY_URL: "",
  LINE: "",
  CODES: []
};
