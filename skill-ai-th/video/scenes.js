const SCENES={
fr:{disc:"Aucun revenu garanti • Tarifs indicatifs • Quotas gratuits variables",videos:[
 [ // V1 prix
  {t:3.2,h:"Tu paies <em>30 €… 100 €… 200 €</em> par mois ?"},
  {t:5.5,k:"Générateurs vidéo IA payants",h:"Pour ~30 clips de 10 secondes",items:[["30 €","/ mois","x"],["100 €","/ mois","x"],["200 €","/ mois","x"]]},
  {t:3.8,h:"Et si tu apprenais à faire <em>50 clips par jour</em> gratuitement ?",sub:"Objectif, selon les quotas gratuits des outils"},
  {t:4.5,k:"Ma méthode",h:"Outils gratuits.<br/>Zéro abonnement.",items:[["Script IA","",'good'],["Vidéo IA gratuite","",'good'],["Montage CapCut","",'good']]},
  {t:4,h:"Apprends la méthode",sub:"Lien dans ma bio 👆",cta:"AI Skill"}],
 [ // V2 packs
  {t:3,h:"<em>3 formations</em>, 1 objectif : maîtriser l'IA"},
  {t:4.5,k:"Pack 1",h:"Maîtriser l'IA",items:["Prompts qui marchent","Automatiser tes tâches","Textes, images, idées"],list:1},
  {t:4.5,k:"Pack 2",h:"Créer et vendre des <em>sites web</em>",items:["Site pro sans coder","Trouver tes clients","Devis & facturation"],list:1},
  {t:4.5,k:"Pack 3",h:"Vidéos IA pour <em>TikTok</em>",items:["Outils gratuits","Script → montage","Publier & mesurer"],list:1},
  {t:4,h:"Commence par le <em>cadeau gratuit</em>",sub:"15 prompts IA • lien en bio",cta:"Gratuit"}],
 [ // V3 steps
  {t:3,h:"De zéro à ta <em>première vidéo IA</em> en 4 étapes"},
  {t:7,k:"Comment ça marche",h:"Simple et pratique",items:[["1 · Tu choisis ton pack","",""],["2 · Tu reçois ton code","",""],["3 · Tu suis les leçons","",""],["4 · Tu passes à l'action","",'good']]},
  {t:4,h:"Pas besoin de <em>coder</em>",sub:"L'IA fait le gros du travail"},
  {t:3.5,h:"Aucun revenu garanti.<br/><em>Ta méthode, ton travail.</em>",sub:"On t'explique tout honnêtement"},
  {t:4,h:"Rejoins AI Skill",sub:"Lien dans ma bio 👆",cta:"Commencer"}]
]},
en:{disc:"No income guaranteed • Indicative prices • Free quotas vary",videos:[
 [{t:3.2,h:"Paying <em>€30… €100… €200</em> a month?"},
  {t:5.5,k:"Paid AI video generators",h:"For ~30 clips of 10 seconds",items:[["€30","/ month","x"],["€100","/ month","x"],["€200","/ month","x"]]},
  {t:3.8,h:"What if you learned to make <em>50 clips a day</em> for free?",sub:"A goal, within each tool's free quota"},
  {t:4.5,k:"My method",h:"Free tools.<br/>Zero subscriptions.",items:[["AI script","",'good'],["Free AI video","",'good'],["CapCut editing","",'good']]},
  {t:4,h:"Learn the method",sub:"Link in my bio 👆",cta:"AI Skill"}],
 [{t:3,h:"<em>3 courses</em>, 1 goal: master AI"},
  {t:4.5,k:"Pack 1",h:"Master AI",items:["Prompts that work","Automate your tasks","Text, images, ideas"],list:1},
  {t:4.5,k:"Pack 2",h:"Build and sell <em>websites</em>",items:["Pro site, no coding","Find your clients","Quotes & invoicing"],list:1},
  {t:4.5,k:"Pack 3",h:"AI videos for <em>TikTok</em>",items:["Free tools","Script → editing","Post & measure"],list:1},
  {t:4,h:"Start with the <em>free gift</em>",sub:"15 AI prompts • link in bio",cta:"Free"}],
 [{t:3,h:"From zero to your <em>first AI video</em> in 4 steps"},
  {t:7,k:"How it works",h:"Simple and practical",items:[["1 · Pick your pack","",""],["2 · Get your code","",""],["3 · Follow the lessons","",""],["4 · Take action","",'good']]},
  {t:4,h:"No <em>coding</em> needed",sub:"AI does the heavy lifting"},
  {t:3.5,h:"No income guaranteed.<br/><em>Your method, your work.</em>",sub:"We explain everything honestly"},
  {t:4,h:"Join AI Skill",sub:"Link in my bio 👆",cta:"Start"}]
]},
th:{disc:"ไม่รับประกันรายได้ • ราคาโดยประมาณ • โควตาฟรีเปลี่ยนแปลงได้",videos:[
 [{t:3.2,h:"จ่าย <em>฿1,100… ฿3,800… ฿7,500</em> ต่อเดือน?"},
  {t:5.5,k:"เครื่องมือวิดีโอ AI แบบเสียเงิน",h:"ได้แค่ ~30 คลิป × 10 วินาที",items:[["~฿1,100","/ เดือน","x"],["~฿3,800","/ เดือน","x"],["~฿7,500","/ เดือน","x"]]},
  {t:3.8,h:"ถ้าเรียนวิธีทำ <em>50 คลิปต่อวัน</em> ด้วยเครื่องมือฟรี?",sub:"เป้าหมาย ภายในโควตาฟรีของแต่ละเครื่องมือ"},
  {t:4.5,k:"วิธีของเรา",h:"เครื่องมือฟรี<br/>ไม่มีค่าสมาชิก",items:[["สคริปต์ด้วย AI","",'good'],["วิดีโอ AI ฟรี","",'good'],["ตัดต่อใน CapCut","",'good']]},
  {t:4,h:"เรียนวิธีทำเลย",sub:"ลิงก์ในไบโอ 👆",cta:"AI Skill"}],
 [{t:3,h:"<em>3 คอร์ส</em> เป้าหมายเดียว: ใช้ AI ให้เป็น"},
  {t:4.5,k:"แพ็ก 1",h:"เริ่มใช้ AI",items:["พรอมต์ที่ใช้ได้จริง","ทำงานซ้ำ ๆ อัตโนมัติ","ข้อความ รูป ไอเดีย"],list:1},
  {t:4.5,k:"แพ็ก 2",h:"สร้างและขาย<em>เว็บไซต์</em>",items:["เว็บมือโปรไม่ต้องโค้ด","หาลูกค้ากลุ่มแรก","ใบเสนอราคา & เก็บเงิน"],list:1},
  {t:4.5,k:"แพ็ก 3",h:"วิดีโอ AI ลง <em>TikTok</em>",items:["เครื่องมือฟรี","สคริปต์ → ตัดต่อ","โพสต์ & วัดผล"],list:1},
  {t:4,h:"เริ่มจาก<em>ของแจกฟรี</em>",sub:"พรอมต์ AI 15 ข้อ • ลิงก์ในไบโอ",cta:"ฟรี"}],
 [{t:3,h:"จากศูนย์ถึง<em>วิดีโอ AI คลิปแรก</em> ใน 4 ขั้น"},
  {t:7,k:"เรียนยังไง",h:"ง่ายและลงมือทำจริง",items:[["1 · เลือกแพ็ก","",""],["2 · รับรหัสเข้าเรียน","",""],["3 · เรียนทีละบท","",""],["4 · ลงมือทำ","",'good']]},
  {t:4,h:"ไม่ต้อง<em>เขียนโค้ด</em>",sub:"AI ช่วยทำส่วนใหญ่ให้"},
  {t:3.5,h:"ไม่รับประกันรายได้<br/><em>วิธีของคุณ งานของคุณ</em>",sub:"เราบอกตามจริงทุกอย่าง"},
  {t:4,h:"มาเรียนกับ AI Skill",sub:"ลิงก์ในไบโอ 👆",cta:"เริ่มเลย"}]
]}};
