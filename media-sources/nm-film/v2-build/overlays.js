// Renders transparent 720x1280 PNG overlays (captions, phone cards, end card) for the NM Studio film, per language.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const D = __dirname;
const url = f => 'file://' + path.join(D, f);

const L = {
  fr: {
    caps: [
      'Un bon restaurant, une <em>bonne cuisine</em>…',
      '…mais la salle <em>reste vide</em>.',
      'Les touristes vous cherchent <em>sur leur téléphone</em>…',
      '…pas de photos, pas de site : <em>ils passent leur chemin</em>.',
      'Et sur place ? Un menu <em>qu’ils ne comprennent pas</em>.',
      'Ils hésitent, commandent peu… <em>ou repartent</em>.',
      'Le soir, ils trouvent <em>son nouveau site</em>…',
      '…avec <em>les photos de tous les plats</em>.',
      'À table : <em>le menu QR</em>, dans leur langue.',
      'Et la salle <em>se remplit</em>.',
      'Site web, menu QR, fiche Google : <em>NM Studio</em>.',
      'Plus de clients, <em>chaque soir</em>.'
    ],
    bad: { title: 'Restaurant', sub: 'Restaurant thaï', items: ['Aucune photo', 'Pas de site web', 'Pas de menu'] },
    good: { title: 'Menu', items: ['Photos des plats', 'Menu en 5 langues', 'Réservation WhatsApp'] },
    end: { a: 'Plus de clients.', b: 'Plus de chiffre d’affaires.', c: 'Site web · Menu QR · Fiche Google', d: 'Maquette gratuite en 48 h' }
  },
  en: {
    caps: [
      'Great restaurant, <em>great food</em>…',
      '…but the tables <em>stay empty</em>.',
      'Tourists look for you <em>on their phone</em>…',
      '…no photos, no website: <em>they walk on by</em>.',
      'And inside? A menu <em>they can’t read</em>.',
      'They hesitate, order little… <em>or leave</em>.',
      'That evening, they find <em>her new website</em>…',
      '…with <em>photos of every dish</em>.',
      'At the table: <em>a QR menu</em>, in their language.',
      'And the tables <em>fill up</em>.',
      'Website, QR menu, Google listing: <em>NM Studio</em>.',
      'More customers, <em>every night</em>.'
    ],
    bad: { title: 'Restaurant', sub: 'Thai restaurant', items: ['No photos', 'No website', 'No menu'] },
    good: { title: 'Menu', items: ['Photos of every dish', 'Menu in 5 languages', 'WhatsApp booking'] },
    end: { a: 'More customers.', b: 'More revenue.', c: 'Website · QR menu · Google listing', d: 'Free mock-up in 48 h' }
  },
  th: {
    caps: [
      'ร้านดี <em>อาหารอร่อย</em>…',
      '…แต่ร้าน<em>ยังว่างเปล่า</em>',
      'นักท่องเที่ยวค้นหาร้าน<em>ในมือถือ</em>…',
      '…ไม่มีรูป ไม่มีเว็บไซต์ <em>เขาก็เดินผ่านไป</em>',
      'เข้ามาในร้าน? เจอเมนู<em>ที่อ่านไม่เข้าใจ</em>',
      'ลังเล สั่งน้อย… <em>หรือเดินออกไป</em>',
      'ตอนเย็น เขาเจอ<em>เว็บไซต์ใหม่ของร้าน</em>…',
      '…พร้อม<em>รูปอาหารทุกจาน</em>',
      'ที่โต๊ะ: <em>เมนู QR</em> เป็นภาษาของเขา',
      'แล้วร้านก็<em>เต็ม</em>',
      'เว็บไซต์ เมนู QR และ Google: <em>NM Studio</em>',
      'ลูกค้ามากขึ้น <em>ทุกคืน</em>'
    ],
    bad: { title: 'ร้านอาหาร', sub: 'ร้านอาหารไทย', items: ['ไม่มีรูปภาพ', 'ไม่มีเว็บไซต์', 'ไม่มีเมนู'] },
    good: { title: 'เมนู', items: ['รูปอาหารทุกจาน', 'เมนู 5 ภาษา', 'จองผ่าน WhatsApp'] },
    end: { a: 'ลูกค้ามากขึ้น', b: 'ยอดขายมากขึ้น', c: 'เว็บไซต์ · เมนู QR · Google', d: 'ทำตัวอย่างฟรีใน 48 ชม.' }
  }
};

const CSS = `
@font-face{font-family:Sat;src:url(${url('satoshi-900.woff2')});font-weight:900}
@font-face{font-family:Sat;src:url(${url('satoshi-700.woff2')});font-weight:700}
@font-face{font-family:Fra;src:url(${url('fraunces-italic-latin.woff2')});font-style:italic}
@font-face{font-family:Thai;src:url(${url('noto-sans-thai-thai.woff2')})}
*{margin:0;box-sizing:border-box}
html,body{width:720px;height:1280px;background:transparent;overflow:hidden;font-family:Sat,Thai,sans-serif;color:#fff}
.cap{position:absolute;left:44px;right:44px;bottom:250px;text-align:center;font-weight:900;font-size:50px;line-height:1.14;letter-spacing:-.02em;
 text-shadow:0 3px 18px rgba(0,0,0,.75),0 1px 3px rgba(0,0,0,.9)}
.cap em{font-style:normal;color:#f4c96b}
.th .cap{font-size:46px;line-height:1.38;letter-spacing:0;font-weight:700}
.shade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0) 52%,rgba(0,0,0,.62) 100%)}
.card{position:absolute;left:110px;right:110px;top:54px;transform:scale(.82);transform-origin:50% 0;padding:22px;border-radius:30px;background:rgba(250,250,252,.97);color:#16161a;
 box-shadow:0 30px 70px rgba(0,0,0,.55);font-weight:700}
.bar{display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:999px;background:#eef0f3;color:#8a8f98;font-size:20px}
.bar i{width:18px;height:18px;border-radius:50%;border:3px solid #9aa0a8}
.imgs{display:grid;grid-template-columns:1.4fr 1fr;gap:8px;margin-top:16px;height:170px}
.ph{border-radius:16px;background:#e3e5e9;display:grid;place-items:center}
.ph svg{width:46px;height:46px;opacity:.45}
.imgs .col{display:grid;gap:8px}
.t{margin-top:16px;font-size:30px;font-weight:900}
.s{font-size:20px;color:#8a8f98;margin-top:2px}
.row{display:flex;align-items:center;gap:12px;margin-top:12px;font-size:24px}
.x{flex:none;width:34px;height:34px;border-radius:50%;display:grid;place-items:center;color:#fff;font-weight:900;font-size:20px}
.bad .x{background:#e5484d}.good .x{background:#22b573}
.good .gimgs{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin-top:14px}
.good .gimgs div{aspect-ratio:1;border-radius:14px;background-size:cover;background-position:center}
.hdr{display:flex;align-items:center;justify-content:space-between}
.hdr b{font-size:30px;font-weight:900}
.lang{display:flex;gap:6px}.lang span{padding:4px 9px;border-radius:999px;background:#16161a;color:#fff;font-size:15px}
.end{position:absolute;inset:0;background:radial-gradient(70% 45% at 50% 38%,#0f3a2c 0%,#06140f 60%,#020806 100%);display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:0 50px}
.end .logo{display:flex;align-items:center;gap:16px;margin-bottom:60px}
.end .logo b{font-size:46px;font-weight:700;letter-spacing:-.02em}
.end .a{font-size:62px;font-weight:900;line-height:1.08;letter-spacing:-.03em}
.end .b{font-family:Fra,Thai,serif;font-style:italic;font-size:60px;line-height:1.15;color:#f4c96b;margin-top:6px}
.th .end .a{font-family:Thai;font-weight:700;letter-spacing:0;line-height:1.3}
.th .end .b{font-family:Thai;font-style:normal;line-height:1.35}
.end .c{margin-top:46px;font-size:26px;color:#cfe3d9;font-weight:700;letter-spacing:.01em}
.end .d{margin-top:30px;padding:16px 30px;border-radius:999px;background:#2bd97a;color:#04140b;font-size:28px;font-weight:900}
`;
const BROKEN = '<svg viewBox="0 0 24 24" fill="none" stroke="#7a808a" stroke-width="2"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 15l5-5 4 4 3-3 6 6M4 4l16 16"/></svg>';
const LOGO = '<svg width="74" height="74" viewBox="0 0 32 32"><rect width="32" height="32" rx="7.5" fill="#0d0b16"/><rect x="0.8" y="0.8" width="30.4" height="30.4" rx="6.9" fill="none" stroke="#e6c27a" stroke-opacity="0.5" stroke-width="1.6"/><g fill="none" stroke-linecap="round" stroke-width="2.4"><path d="M4.8 12.4c2.9 0 2.9 4.9 5.9 4.9s2.9-4.9 5.4-4.9 2.9 4.9 5.9 4.9 2.9-4.9 5.4-4.9" stroke="#7b61ff"/><path d="M4.8 19.2c2.9 0 2.9 4.9 5.9 4.9s3-4.9 5.4-4.9 2.9 4.9 5.9 4.9 2.9-4.9 5.4-4.9" stroke="#e6c27a"/></g></svg>';

(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const p = await b.newPage({ viewport: { width: 720, height: 1280 } });
  async function shot(html, file, lang, opaque) {
    fs.writeFileSync(path.join(D, '_tmp.html'), `<!doctype html><html class="${lang || ''}"><head><meta charset="utf-8"><style>${CSS}</style></head><body>${html}</body></html>`);
    await p.goto(url('_tmp.html'));
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(80);
    await p.screenshot({ path: path.join(D, 'ov', file), omitBackground: !opaque });
  }
  fs.mkdirSync(path.join(D, 'ov'), { recursive: true });
  await shot('<div class="shade"></div>', 'shade.png');
  for (const [lg, t] of Object.entries(L)) {
    for (let i = 0; i < t.caps.length; i++) await shot(`<p class="cap">${t.caps[i]}</p>`, `${lg}-cap${i + 1}.png`, lg);
    await shot(`<div class="card bad"><div class="bar"><i></i>${t.bad.sub}</div><div class="imgs"><div class="ph">${BROKEN}</div><div class="col"><div class="ph">${BROKEN}</div><div class="ph">${BROKEN}</div></div></div>` +
      `<p class="t">${t.bad.title}</p><p class="s">— · —</p>` + t.bad.items.map(x => `<p class="row"><span class="x">✕</span>${x}</p>`).join('') + '</div>', `${lg}-bad.png`, lg);
    const imgs = ['d-padthai.jpg', 'd-curry.jpg', 'd-mango.jpg', 'd-tomyum.jpg', 'd-somtam.jpg', 'd-krapao.jpg'].map(f => `<div style="background-image:url(${url(f)})"></div>`).join('');
    await shot(`<div class="card good"><div class="hdr"><b>${t.good.title}</b><span class="lang"><span>EN</span><span>FR</span><span>ไทย</span><span>中文</span></span></div><div class="gimgs">${imgs}</div>` +
      t.good.items.map(x => `<p class="row"><span class="x">✓</span>${x}</p>`).join('') + '</div>', `${lg}-good.png`, lg);
    await shot(`<div class="end"><div class="logo">${LOGO}<b>NM Studio</b></div><p class="a">${t.end.a}</p><p class="b">${t.end.b}</p><p class="c">${t.end.c}</p><p class="d">${t.end.d}</p></div>`, `${lg}-end.png`, lg, true);
  }
  // site version cards: no words (the site shows its own captions in 5 languages)
  {
    const imgs = ['d-padthai.jpg', 'd-curry.jpg', 'd-mango.jpg', 'd-tomyum.jpg', 'd-somtam.jpg', 'd-krapao.jpg'].map(f => `<div style="background-image:url(${url(f)})"></div>`).join('');
    await shot(`<div class="card bad"><div class="bar"><i></i>—</div><div class="imgs"><div class="ph">${BROKEN}</div><div class="col"><div class="ph">${BROKEN}</div><div class="ph">${BROKEN}</div></div></div>` +
      `<p class="row" style="justify-content:center;gap:18px;margin-top:18px"><span class="x" style="width:54px;height:54px;font-size:30px">✕</span></p></div>`, 'site-bad.png');
    await shot(`<div class="card good"><div class="hdr"><b>🍽️</b><span class="lang"><span>EN</span><span>FR</span><span>ไทย</span><span>中文</span></span></div><div class="gimgs">${imgs}</div>` +
      `<p class="row" style="justify-content:center;margin-top:16px"><span class="x" style="width:54px;height:54px;font-size:30px">✓</span></p></div>`, 'site-good.png');
  }
  // site version end card: logo only (the site shows its own captions in 5 languages)
  await shot(`<div class="end"><div class="logo" style="margin:0">${LOGO}<b>NM Studio</b></div></div>`, 'site-end.png', '', true);
  await b.close();
  console.log('ok');
})();
