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
    { id: "month", name: "รายเดือน", price: "฿199", per: "/เดือน", note: "ยกเลิกได้ทุกเมื่อ", months: 1 },
    { id: "year", name: "รายปี", price: "฿1,290", per: "/ปี", note: "เฉลี่ยเดือนละ ฿108", months: 12, best: true },
    { id: "life", name: "ตลอดชีพ", price: "฿2,490", per: "ครั้งเดียว", note: "จ่ายครั้งเดียว เรียนได้ตลอด", months: 0 }
  ],
  FEATURES: [
    ["🎓", "คอร์สเต็มครบ 24 หน่วย", "ปลดล็อกหน่วย 13–24: ร่างกาย ช้อปปิ้ง ไวยากรณ์ อดีต/อนาคต สถานการณ์จริง"],
    ["🎙️", "ฝึกพูดพร้อมตรวจเสียง", "พูดใส่ไมค์ ระบบเช็คการออกเสียงให้ทันที"],
    ["🔊", "ออกเสียงให้ชัด", "บทเฉพาะสำหรับคนไทย: th, r/l, v/w, สระสั้น–ยาว"],
    ["♾️", "หัวใจไม่จำกัด + ใบรับรอง", "เรียนต่อเนื่อง และรับใบรับรองเมื่อจบคอร์ส"]
  ],
  BUY_URL: "",
  LINE: "",
  CODES: []
};
