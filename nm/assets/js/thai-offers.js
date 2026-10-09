/* NM Studio: the Thailand price list (Thai only).
   Thai shop owners get their own, simpler offer: a translated menu from 299 baht, a Google listing at 790 baht and
   the complete pack (website + Google + QR menu) at 2,990 baht with the first year included, then 990 baht a year.
   No monthly subscription. Every other language keeps the regular offers (offers-config.js), untouched.
   - shown whenever the page is read in Thai (the language switch works in place, so this listens to "nm:lang")
   - the regular cards, the billing toggle, the care box, the comparison table and the guide are hidden while it shows
   - the menu calculator adds 150 baht per extra page (beyond 2) and 150 baht per printed, laminated copy
   - to change a price: edit P below, the cards and the calculator follow */
(function () {
  "use strict";
  var P = { menu: 299, menuPages: 2, page: 150, copy: 150, google: 790, pack: 2990, renew: 990 };
  var C = window.NM_CONTACT || {};
  var WA = C.whatsappNumber ? "https://wa.me/" + C.whatsappNumber + "?text=" : "";
  var WA_LINK = C.whatsappLink || "https://wa.me/qr/PYPOVXTCVM74I1";
  function wa(msg) { return WA ? WA + encodeURIComponent(msg) : WA_LINK; }
  function b(n) { return n.toLocaleString("en-US"); }

  var CHECK = '<svg aria-hidden="true" viewBox="0 0 20 20" fill="none"><path d="M4.5 10.5l3.5 3.5 7.5-8" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var ARROW = '<svg aria-hidden="true" class="btn__arrow" fill="none" viewBox="0 0 20 20"><path d="M4 10h11m0 0l-4.5-4.5M15 10l-4.5 4.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.7"></path></svg>';
  var ICON = {
    menu: '<svg aria-hidden="true" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="10" y="6" width="28" height="36" rx="4"/><path d="M17 15h14M17 22h14M17 29h9"/><path d="M33 33l4 4"/><circle cx="31" cy="31" r="3"/></svg>',
    google: '<svg aria-hidden="true" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M24 43s13-11.6 13-22A13 13 0 0 0 11 21c0 10.4 13 22 13 22z"/><circle cx="24" cy="20.5" r="4.5"/></svg>',
    pack: '<svg aria-hidden="true" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M24 5l15 6v11c0 10-6.5 17.5-15 21-8.5-3.5-15-11-15-21V11z"/><path d="M16.5 24l5.5 5.5 10-11"/></svg>'
  };
  function list(items) { return '<ul class="tho-card__list">' + items.map(function (t) { return "<li>" + CHECK + "<span>" + t + "</span></li>"; }).join("") + "</ul>"; }

  function html(freeHref) {
    return '' +
      '<div class="tho__grid">' +
        '<article class="tho-card">' +
          '<div class="tho-card__top"><span class="tho-card__tier">01</span><span class="tho-card__ic">' + ICON.menu + '</span></div>' +
          '<p class="tho-card__kicker">เริ่มต้นง่ายที่สุด</p>' +
          '<h3 class="tho-card__name">เมนูแปลภาษา</h3>' +
          '<p class="tho-card__benefit">เมนูของคุณ แปลและจัดหน้าใหม่ให้สวย ดูเป็นมืออาชีพ นักท่องเที่ยวอ่านแล้วสั่งได้ทันที</p>' +
          '<p class="tho-card__price"><strong>' + b(P.menu) + '</strong><span class="tho-card__cur">บาท</span></p>' +
          '<p class="tho-card__unit">ทั้งเมนู สูงสุด ' + P.menuPages + ' หน้า</p>' +
          list(["แปลเป็นภาษาอังกฤษ หรือภาษาที่ลูกค้าของคุณใช้", "ชื่ออาหารที่นักท่องเที่ยวเข้าใจทันที", "จัดหน้าใหม่ สีสวย อ่านง่าย", "ได้ไฟล์พร้อมพิมพ์ ส่งให้ทาง LINE หรือ WhatsApp"]) +
          '<a class="btn btn--outline btn--block tho-card__cta" href="' + wa("สวัสดี NM Studio สนใจทำเมนูแปลภาษา") + '" target="_blank" rel="noopener"><span>สั่งเมนูแปลภาษา</span>' + ARROW + '</a>' +
        '</article>' +
        '<article class="tho-card">' +
          '<div class="tho-card__top"><span class="tho-card__tier">02</span><span class="tho-card__ic">' + ICON.google + '</span></div>' +
          '<p class="tho-card__kicker">ให้ลูกค้าเจอร้านคุณ</p>' +
          '<h3 class="tho-card__name">Google Business Profile</h3>' +
          '<p class="tho-card__benefit">ร้านของคุณขึ้นบน Google Maps พร้อมรูปที่ทำให้คนอยากแวะ</p>' +
          '<p class="tho-card__price"><strong>' + b(P.google) + '</strong><span class="tho-card__cur">บาท</span></p>' +
          '<p class="tho-card__unit">จ่ายครั้งเดียว</p>' +
          list(["สร้างหรือปรับปรุงโปรไฟล์ร้านให้ครบ", "ใส่รูปร้านและรูปอาหารที่น่ากิน", "เวลาเปิด-ปิด เบอร์โทร และหมุดแผนที่", "ช่วยยืนยันร้านกับ Google จนเสร็จ"]) +
          '<a class="btn btn--outline btn--block tho-card__cta" href="' + wa("สวัสดี NM Studio สนใจทำ Google Business Profile") + '" target="_blank" rel="noopener"><span>สั่งโปรไฟล์ Google</span>' + ARROW + '</a>' +
        '</article>' +
        '<article class="tho-card tho-card--feat">' +
          '<span class="tho-card__badge">แนะนำ</span>' +
          '<div class="tho-card__top"><span class="tho-card__tier">03</span><span class="tho-card__ic">' + ICON.pack + '</span></div>' +
          '<p class="tho-card__kicker">คุ้มที่สุด ครบในที่เดียว</p>' +
          '<h3 class="tho-card__name">แพ็กเกจครบชุด</h3>' +
          '<p class="tho-card__benefit">เว็บไซต์ร้าน + Google + เมนู QR ทุกอย่างที่นักท่องเที่ยวมองหา ในแพ็กเดียว</p>' +
          '<p class="tho-card__price"><strong>' + b(P.pack) + '</strong><span class="tho-card__cur">บาท</span></p>' +
          '<p class="tho-card__unit">รวมปีแรก · ปีต่อไป ' + b(P.renew) + ' บาท/ปี</p>' +
          list(["เว็บไซต์ร้านจากรูปของคุณ หลายภาษา", "Google Business Profile (ปกติ " + b(P.google) + " บาท)", "เมนูออนไลน์ + QR code ประจำโต๊ะ", "จองโต๊ะผ่าน WhatsApp หรือ LINE", "โฮสติ้ง และแก้ไขเมนู ราคา รูป ได้ตลอดปี", "แบ่งจ่ายได้ 2 งวด"]) +
          '<a class="btn btn--sun btn--block tho-card__cta" href="' + freeHref + '"><span>ดูแบบร่างฟรีก่อน</span>' + ARROW + '</a>' +
          '<a class="tho-card__alt" href="' + wa("สวัสดี NM Studio สนใจแพ็กเกจครบชุด") + '" target="_blank" rel="noopener">หรือคุยกับเราทาง WhatsApp</a>' +
        '</article>' +
      '</div>' +

      '<div class="tho-extra">' +
        '<div class="tho-extra__copy">' +
          '<p class="tho-extra__k">อยากได้เมนูพรีเมียมแบบร้านอาหารชั้นนำ?</p>' +
          '<h3 class="tho-extra__t">เลือกเพิ่มได้ตามต้องการ</h3>' +
          '<ul class="tho-extra__list">' +
            '<li><b>+' + b(P.page) + ' บาท</b><span>ต่อหน้า สำหรับเมนูที่ยาวกว่า ' + P.menuPages + ' หน้า</span></li>' +
            '<li><b>+' + b(P.copy) + ' บาท</b><span>ต่อเล่ม พิมพ์สีบนกระดาษหนา เคลือบพลาสติกอย่างดี กันน้ำ กันคราบ มุมโค้งสวย</span></li>' +
          '</ul>' +
        '</div>' +
        '<div class="tho-calc" aria-labelledby="thoCalcT">' +
          '<p class="tho-calc__t" id="thoCalcT">คำนวณราคาเมนูของคุณ</p>' +
          '<div class="tho-calc__row"><span>จำนวนหน้า</span><div class="tho-step"><button type="button" data-step="pages" data-d="-1" aria-label="ลดจำนวนหน้า">−</button><output data-out="pages">2</output><button type="button" data-step="pages" data-d="1" aria-label="เพิ่มจำนวนหน้า">+</button></div></div>' +
          '<div class="tho-calc__row"><span>เล่มเคลือบพรีเมียม</span><div class="tho-step"><button type="button" data-step="copies" data-d="-1" aria-label="ลดจำนวนเล่ม">−</button><output data-out="copies">0</output><button type="button" data-step="copies" data-d="1" aria-label="เพิ่มจำนวนเล่ม">+</button></div></div>' +
          '<p class="tho-calc__total" aria-live="polite"><span>รวม</span><strong data-out="total">' + b(P.menu) + ' บาท</strong></p>' +
          '<p class="tho-calc__note">ตัวอย่าง: เมนู 4 หน้า + เคลือบ 6 เล่ม = ' + b(P.menu + 2 * P.page + 6 * P.copy) + ' บาท</p>' +
        '</div>' +
      '</div>' +

      '<ul class="tho-promise">' +
        '<li>' + CHECK + '<span>ดูแบบร่างฟรีก่อนตัดสินใจ</span></li>' +
        '<li>' + CHECK + '<span>ไม่มีค่ารายเดือน</span></li>' +
        '<li>' + CHECK + '<span>แพ็กเกจครบชุดแบ่งจ่ายได้ 2 งวด</span></li>' +
        '<li>' + CHECK + '<span>จ่ายง่ายผ่านพร้อมเพย์</span></li>' +
      '</ul>';
  }

  function calc(box) {
    var st = { pages: P.menuPages, copies: 0 }, lim = { pages: [1, 30], copies: [0, 60] };
    function render() {
      box.querySelector('[data-out="pages"]').textContent = st.pages;
      box.querySelector('[data-out="copies"]').textContent = st.copies;
      var total = P.menu + Math.max(0, st.pages - P.menuPages) * P.page + st.copies * P.copy;
      box.querySelector('[data-out="total"]').textContent = b(total) + " บาท";
      [].forEach.call(box.querySelectorAll("[data-step]"), function (btn) {
        var k = btn.getAttribute("data-step"), d = +btn.getAttribute("data-d");
        btn.disabled = d < 0 ? st[k] <= lim[k][0] : st[k] >= lim[k][1];
      });
    }
    box.addEventListener("click", function (e) {
      var btn = e.target.closest && e.target.closest("[data-step]");
      if (!btn) return;
      var k = btn.getAttribute("data-step");
      st[k] = Math.max(lim[k][0], Math.min(lim[k][1], st[k] + +btn.getAttribute("data-d")));
      render();
    });
    render();
  }

  var HIDE = [".offer-grid", ".offers__links", ".pcards", ".bill", ".carebox", "#compare", "#guide"];
  var box = null, hidden = [];
  function anchor() { return document.querySelector("#offers .offer-grid") || document.querySelector("#plans .pcards"); }

  function apply(lang) {
    var th = lang === "th", a = anchor();
    if (!a) return;
    if (th && !box) {
      box = document.createElement("div");
      box.className = "tho"; box.id = "thOffers";
      box.innerHTML = html(document.getElementById("free") ? "#free" : "index.html#free");
      a.parentNode.insertBefore(box, a);
      calc(box.querySelector(".tho-calc"));
    }
    if (box) box.classList.toggle("tho--off", !th);
    if (th) {
      hidden = [];
      HIDE.forEach(function (sel) { [].forEach.call(document.querySelectorAll(sel), function (el) { el.classList.add("tho-hide"); hidden.push(el); }); });
    } else {
      hidden.forEach(function (el) { el.classList.remove("tho-hide"); }); hidden = [];
    }
  }

  document.addEventListener("nm:lang", function (e) { apply(e.detail && e.detail.lang); });
  apply(window.NM_LANG || document.documentElement.lang);
})();
