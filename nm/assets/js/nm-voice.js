/* NM Studio: the founder's voice (EN / FR / IT / TH / AR).
   The owner wants the site to sound like him: a friendly, down-to-earth person who comes to see you, not a start-up
   or a big agency. Big-agency results, with a real person you can trust. First person ("I"), warm, simple, honest
   (in person when he is nearby, otherwise a video call). Prices and terms stay in the other copy files.
   Loaded after thai-copy.js and before i18n.js; deep-merged over the dictionary like the other copy files. */
(function () {
  "use strict";
  var C = {
    en: {
      hero2: { eyebrow: "Agency-level results, with a real person" },
      v4: {
        sub: "Restaurants, bars, salons, shops: I come to you, I take care of everything, and your customers find you on Google, read your menu in their language and message you on WhatsApp.",
        finaleTitle: "Shall we get started <em>together?</em>"
      },
      why2: {
        eyebrow: "Why me",
        title: "Big-agency work. <em>A friend's touch.</em>",
        r1t: "I come to you",
        r1b: "I drop by your place, we grab a coffee and look at what you need together. If you're far away, we talk on video. You never touch the tech side.",
        r2t: "Professional results, in days",
        r2b: "The same standard as a big agency, without the delays or the jargon. Send me your photos and your listing, menu or website is live within days.",
        r3t: "One message and it's done",
        r3b: "New price, new dish, new photo: message me on WhatsApp and I'll handle it. Just like between friends. Cancel whenever you like."
      },
      free: {
        eyebrow: "Free, no commitment, no pressure",
        title: "I'll make your website, <em>for free.</em>",
        lead: "I come by or you send me a few photos, and I prepare a mock-up of your website, free, within 48 hours. Like it? We carry on together. If not, no hard feelings.",
        m_k: "Free mock-up",
        m_t: "Your website in 48 h, on me",
        m_b: "Tell me your business name. I'll prepare a mock-up with your name, your photos and your style. Take your time to decide, no pressure.",
        a_b: "I look at your Google listing the way a customer sees it: photos, hours, reviews. You get 3 practical tips, even if we never work together.",
        note: "I reply to you myself on WhatsApp, usually the same day.",
        s1: "You ask me for your mock-up",
        s1b: "Free, takes 1 minute",
        s2: "I prepare your website",
        s2b: "Within 48 h, with your name. Free, no commitment. I can even come and show it to you."
      },
      book: {
        k: "Shall we meet?",
        t: "Coffee or video call? Book 20 minutes",
        b: "I'll come to your place if you're nearby, otherwise we talk on video. Free, no commitment: we simply look at what you need together.",
        call: "In person or video"
      },
      founder: {
        title: "I'm one of you, <em>not a big company.</em>",
        body: "My name is {name}. No call centre, no jargon: I'm the one who comes to see you, builds your website, menu and Google listing, and answers you on WhatsApp. You get big-agency results from someone down-to-earth and close by, who loves meeting people and takes the time to listen.",
        p1: "I come to you, or we talk on video",
        p2: "I answer you myself, on WhatsApp"
      },
      finale2: {
        title: "Let's talk over a coffee? <em>Message me on WhatsApp.</em>",
        replies: "I reply myself, usually within minutes"
      }
    },
    fr: {
      hero2: { eyebrow: "Un résultat de pro, avec un vrai contact humain" },
      v4: {
        sub: "Restaurants, bars, salons, boutiques : je viens vous voir, je m'occupe de tout, et vos clients vous trouvent sur Google, lisent votre menu dans leur langue et vous écrivent sur WhatsApp.",
        finaleTitle: "On s'y met <em>ensemble ?</em>"
      },
      why2: {
        eyebrow: "Pourquoi moi",
        title: "Le travail d'une grande agence. <em>Le contact d'un ami.</em>",
        r1t: "Je viens vous voir",
        r1b: "Je passe à votre commerce, on prend un café et on regarde ensemble ce qu'il vous faut. Si vous êtes loin, on se parle en visio. Vous ne touchez jamais à la technique.",
        r2t: "Un résultat de pro, en quelques jours",
        r2b: "Le même niveau qu'une grande agence, sans les délais ni le jargon. Vous m'envoyez vos photos, et votre fiche, votre menu ou votre site est en ligne en quelques jours.",
        r3t: "Un message, et c'est fait",
        r3b: "Un nouveau prix, un nouveau plat, une nouvelle photo : vous m'écrivez sur WhatsApp, je m'en occupe. Comme entre amis. Résiliable quand vous voulez."
      },
      free: {
        eyebrow: "Gratuit, sans engagement, sans pression",
        title: "Je vous prépare votre site, <em>gratuitement.</em>",
        lead: "Je viens vous voir ou vous m'envoyez quelques photos, et je vous prépare une maquette de votre site, offerte, en 48 h. Elle vous plaît ? On continue ensemble. Sinon, on reste amis.",
        m_k: "Maquette offerte",
        m_t: "Votre site en 48 h, offert",
        m_b: "Donnez-moi le nom de votre commerce. Je vous prépare une maquette avec votre nom, vos photos et votre style. Vous prenez le temps de décider, sans pression.",
        a_b: "Je regarde votre fiche Google comme un client la voit : photos, horaires, avis. Je vous donne 3 conseils concrets, même si on ne travaille jamais ensemble.",
        note: "C'est moi qui vous réponds sur WhatsApp, en général dans la journée.",
        s1: "Vous me demandez votre maquette",
        s1b: "Gratuit, en 1 minute",
        s2: "Je vous prépare votre site",
        s2b: "En 48 h, à votre nom. Gratuit et sans engagement. Je peux même venir vous le montrer."
      },
      book: {
        k: "On se rencontre ?",
        t: "Un café ou une visio ? Réservez 20 minutes",
        b: "Je passe vous voir à votre commerce si vous êtes près de chez moi, sinon on se parle en visio. Gratuit, sans engagement : on regarde simplement ensemble ce qu'il vous faut.",
        call: "Sur place ou en visio"
      },
      founder: {
        title: "Je suis l'un des vôtres, <em>pas une grosse boîte.</em>",
        body: "Je m'appelle {name}. Pas de centre d'appels, pas de jargon : c'est moi qui viens vous voir, qui crée votre site, votre menu et votre fiche Google, et qui vous réponds sur WhatsApp. Vous avez le résultat d'une grande agence, avec quelqu'un de simple et de proche, qui aime rencontrer les gens et prend le temps de vous écouter.",
        p1: "Je viens vous voir, ou on se parle en visio",
        p2: "Je vous réponds moi-même, sur WhatsApp"
      },
      finale2: {
        title: "On en parle autour d'un café ? <em>Écrivez-moi sur WhatsApp.</em>",
        replies: "C'est moi qui réponds, en général en quelques minutes"
      }
    },
    it: {
      hero2: { eyebrow: "Risultati da agenzia, con una persona vera" },
      v4: {
        sub: "Ristoranti, bar, saloni, negozi: vengo da voi, mi occupo di tutto, e i vostri clienti vi trovano su Google, leggono il menù nella loro lingua e vi scrivono su WhatsApp.",
        finaleTitle: "Iniziamo <em>insieme?</em>"
      },
      why2: {
        eyebrow: "Perché io",
        title: "Il lavoro di una grande agenzia. <em>Il tocco di un amico.</em>",
        r1t: "Vengo da voi",
        r1b: "Passo dal vostro locale, prendiamo un caffè e vediamo insieme cosa vi serve. Se siete lontani, ci sentiamo in videochiamata. Non dovete mai occuparvi della parte tecnica.",
        r2t: "Risultati professionali, in pochi giorni",
        r2b: "Lo stesso livello di una grande agenzia, senza attese né paroloni. Mi mandate le foto, e la vostra scheda, il menù o il sito è online in pochi giorni.",
        r3t: "Un messaggio ed è fatto",
        r3b: "Un nuovo prezzo, un nuovo piatto, una nuova foto: mi scrivete su WhatsApp e ci penso io. Come tra amici. Disdetta quando volete."
      },
      free: {
        eyebrow: "Gratis, senza impegno, senza pressioni",
        title: "Vi preparo il sito, <em>gratis.</em>",
        lead: "Passo da voi o mi mandate qualche foto, e vi preparo una bozza del vostro sito, gratis, in 48 ore. Vi piace? Andiamo avanti insieme. Altrimenti, amici come prima.",
        m_k: "Bozza gratuita",
        m_t: "Il vostro sito in 48 ore, offerto",
        m_b: "Ditemi il nome della vostra attività. Vi preparo una bozza con il vostro nome, le vostre foto e il vostro stile. Prendetevi il tempo per decidere, senza pressioni.",
        a_b: "Guardo la vostra scheda Google come la vede un cliente: foto, orari, recensioni. Vi do 3 consigli concreti, anche se non lavoreremo mai insieme.",
        note: "Vi rispondo io su WhatsApp, di solito in giornata.",
        s1: "Mi chiedete la bozza",
        s1b: "Gratis, in 1 minuto",
        s2: "Vi preparo il sito",
        s2b: "In 48 ore, con il vostro nome. Gratis e senza impegno. Posso anche venire a mostrarvelo."
      },
      book: {
        k: "Ci incontriamo?",
        t: "Un caffè o una videochiamata? Prenotate 20 minuti",
        b: "Passo dal vostro locale se siete vicini, altrimenti ci sentiamo in videochiamata. Gratis e senza impegno: guardiamo semplicemente insieme cosa vi serve.",
        call: "Di persona o in video"
      },
      founder: {
        title: "Sono uno di voi, <em>non una grande azienda.</em>",
        body: "Mi chiamo {name}. Niente call center, niente paroloni: sono io che vengo a trovarvi, creo il vostro sito, il menù e la scheda Google, e vi rispondo su WhatsApp. Avete i risultati di una grande agenzia, con una persona semplice e vicina, che ama conoscere gente e si prende il tempo di ascoltarvi.",
        p1: "Vengo da voi, o ci sentiamo in video",
        p2: "Vi rispondo io, su WhatsApp"
      },
      finale2: {
        title: "Ne parliamo davanti a un caffè? <em>Scrivetemi su WhatsApp.</em>",
        replies: "Rispondo io, di solito in pochi minuti"
      }
    },
    th: {
      hero2: { eyebrow: "งานระดับมืออาชีพ จากคนจริง ๆ ที่คุยง่าย" },
      v4: {
        sub: "ร้านอาหาร บาร์ ร้านเสริมสวย ร้านค้า ผมไปหาคุณถึงร้านและดูแลให้ทุกอย่าง ลูกค้าเจอร้านคุณบน Google อ่านเมนูเป็นภาษาของตัวเอง และทักหาคุณทาง WhatsApp",
        finaleTitle: "มาเริ่มไปด้วยกัน<em>ไหม?</em>"
      },
      why2: {
        eyebrow: "ทำไมต้องผม",
        title: "งานระดับเอเจนซี่ใหญ่ <em>แต่คุยกันแบบเพื่อน</em>",
        r1t: "ผมไปหาคุณถึงร้าน",
        r1b: "ผมแวะไปที่ร้าน นั่งคุยกันสบาย ๆ แล้วดูด้วยกันว่าร้านต้องการอะไร ถ้าอยู่ไกลก็คุยกันทางวิดีโอคอล คุณไม่ต้องยุ่งเรื่องเทคนิคเลย",
        r2t: "ผลงานมืออาชีพ เสร็จในไม่กี่วัน",
        r2b: "คุณภาพเท่าเอเจนซี่ใหญ่ แต่ไม่ต้องรอนานและไม่มีศัพท์ยาก ส่งรูปมาให้ผม แล้วโปรไฟล์ เมนู หรือเว็บไซต์ของคุณจะออนไลน์ในไม่กี่วัน",
        r3t: "ส่งข้อความเดียว ผมจัดการให้",
        r3b: "ราคาใหม่ เมนูใหม่ รูปใหม่ ทักมาทาง WhatsApp หรือ LINE ผมจัดการให้ เหมือนเพื่อนช่วยเพื่อน"
      },
      free: {
        eyebrow: "ฟรี ไม่มีข้อผูกมัด ไม่กดดัน",
        title: "ผมทำเว็บไซต์ให้คุณดู <em>ฟรี</em>",
        lead: "ผมแวะไปหาที่ร้าน หรือคุณส่งรูปมาให้ผมไม่กี่รูป แล้วผมจะทำแบบร่างเว็บไซต์ให้ฟรีภายใน 48 ชั่วโมง ชอบก็ไปต่อด้วยกัน ไม่ชอบก็ยังเป็นเพื่อนกันได้",
        m_k: "แบบร่างฟรี",
        m_t: "เว็บไซต์ของคุณใน 48 ชม. ฟรี",
        m_b: "บอกชื่อร้านมา ผมจะทำแบบร่างที่มีชื่อร้าน รูป และสไตล์ของคุณ ค่อย ๆ ตัดสินใจ ไม่ต้องรีบ ไม่มีการกดดัน",
        a_b: "ผมดูโปรไฟล์ Google ของคุณแบบที่ลูกค้าเห็น ทั้งรูป เวลาเปิด-ปิด และรีวิว แล้วให้คำแนะนำที่ใช้ได้จริง 3 ข้อ แม้จะไม่ได้ทำงานด้วยกันก็ตาม",
        note: "ผมตอบเองทาง WhatsApp ปกติภายในวันเดียวกัน",
        s1: "ขอแบบร่างจากผม",
        s1b: "ฟรี ใช้เวลา 1 นาที",
        s2: "ผมทำเว็บไซต์ให้คุณ",
        s2b: "ภายใน 48 ชม. ใช้ชื่อร้านของคุณ ฟรี ไม่มีข้อผูกมัด ผมไปเปิดให้ดูถึงร้านก็ได้"
      },
      book: {
        k: "เจอกันไหม?",
        t: "นั่งคุยกันหรือวิดีโอคอล? จองเวลา 20 นาที",
        b: "ถ้าร้านอยู่ใกล้ ผมแวะไปหาถึงร้าน ถ้าอยู่ไกลก็คุยกันทางวิดีโอคอล ฟรี ไม่มีข้อผูกมัด แค่มาดูด้วยกันว่าร้านต้องการอะไร",
        call: "เจอกันที่ร้าน หรือวิดีโอคอล"
      },
      founder: {
        title: "ผมเป็นคนธรรมดาเหมือนคุณ <em>ไม่ใช่บริษัทใหญ่</em>",
        body: "ผมชื่อ {name} ไม่มีคอลเซ็นเตอร์ ไม่มีศัพท์ยาก ผมเป็นคนไปหาคุณเอง ทำเว็บไซต์ เมนู และโปรไฟล์ Google ให้เอง และตอบคุณทาง WhatsApp เอง คุณได้ผลงานระดับเอเจนซี่ใหญ่ จากคนที่เป็นกันเอง ชอบเจอผู้คน และตั้งใจฟังคุณจริง ๆ",
        p1: "ผมไปหาคุณถึงร้าน หรือคุยทางวิดีโอคอล",
        p2: "ผมตอบคุณเองทาง WhatsApp"
      },
      finale2: {
        title: "นั่งคุยกันสักแก้วไหม? <em>ทักผมทาง WhatsApp</em>",
        replies: "ผมตอบเอง ปกติภายในไม่กี่นาที"
      }
    },
    ar: {
      hero2: { eyebrow: "نتائج احترافية، مع إنسان حقيقي" },
      v4: {
        sub: "مطاعم، مقاهٍ، صالونات، متاجر: آتي إليك وأتولّى كل شيء، فيجدك زبائنك على جوجل، ويقرؤون قائمتك بلغتهم، ويراسلونك على واتساب.",
        finaleTitle: "هل نبدأ <em>معًا؟</em>"
      },
      why2: {
        eyebrow: "لماذا أنا",
        title: "عمل وكالة كبيرة. <em>بلمسة صديق.</em>",
        r1t: "آتي إليك",
        r1b: "أزورك في محلّك، نشرب قهوة معًا ونرى ما تحتاجه. وإن كنت بعيدًا، نتحدث عبر مكالمة فيديو. لن تضطر أبدًا للتعامل مع الجانب التقني.",
        r2t: "نتائج احترافية في أيام قليلة",
        r2b: "المستوى نفسه لوكالة كبيرة، بلا انتظار ولا مصطلحات معقدة. أرسل لي صورك، فيصبح ملفك أو قائمتك أو موقعك متاحًا خلال أيام.",
        r3t: "رسالة واحدة وينتهي الأمر",
        r3b: "سعر جديد، طبق جديد، صورة جديدة: راسلني على واتساب وسأتولّى الأمر، كما بين الأصدقاء. يمكنك الإلغاء متى شئت."
      },
      free: {
        eyebrow: "مجانًا، بلا التزام، بلا ضغط",
        title: "أُجهّز لك موقعك <em>مجانًا.</em>",
        lead: "أزورك أو ترسل لي بعض الصور، فأُجهّز لك نموذجًا لموقعك مجانًا خلال 48 ساعة. أعجبك؟ نكمل معًا. وإن لم يعجبك، نبقى أصدقاء.",
        m_k: "نموذج مجاني",
        m_t: "موقعك خلال 48 ساعة، هدية مني",
        m_b: "أخبرني باسم محلّك، وسأُجهّز نموذجًا باسمك وصورك وأسلوبك. خذ وقتك في القرار، بلا أي ضغط.",
        a_b: "أنظر إلى ملفك على جوجل كما يراه الزبون: الصور، وساعات العمل، والتقييمات. وأقدّم لك 3 نصائح عملية، حتى لو لم نعمل معًا أبدًا.",
        note: "أنا من يرد عليك على واتساب، عادةً في اليوم نفسه.",
        s1: "تطلب مني نموذجك",
        s1b: "مجانًا، في دقيقة واحدة",
        s2: "أُجهّز لك موقعك",
        s2b: "خلال 48 ساعة، باسمك. مجانًا وبلا التزام. ويمكنني أن آتي لأريك إياه."
      },
      book: {
        k: "هل نلتقي؟",
        t: "قهوة أم مكالمة فيديو؟ احجز 20 دقيقة",
        b: "أزورك في محلّك إن كنت قريبًا، وإلا نتحدث عبر الفيديو. مجانًا وبلا التزام: نرى معًا ما تحتاجه فقط.",
        call: "لقاء أو فيديو"
      },
      founder: {
        title: "أنا واحد منكم، <em>لست شركة كبيرة.</em>",
        body: "اسمي {name}. لا مركز اتصال، ولا مصطلحات معقدة: أنا من يأتي لزيارتك، ويصمّم موقعك وقائمتك وملفك على جوجل، ويرد عليك على واتساب. تحصل على نتائج وكالة كبيرة، مع شخص بسيط وقريب، يحب التعرّف على الناس ويأخذ وقته ليستمع إليك.",
        p1: "آتي إليك، أو نتحدث عبر الفيديو",
        p2: "أرد عليك بنفسي على واتساب"
      },
      finale2: {
        title: "نتحدث على فنجان قهوة؟ <em>راسلني على واتساب.</em>",
        replies: "أنا من يرد، عادةً خلال دقائق"
      }
    }
  };
  /* the final call to action, in the first person; Thai booking line with "ผม" */
  var C2 = {
    en: { about: { nav: "About us", sig: "Mourad, your direct contact", read: "Read my story" }, finale: { sub: "Tell me about your business. I'll come and see you, show you what your website could look like, and put it online within days." } },
    fr: { about: { nav: "Qui sommes-nous", sig: "Mourad, votre contact direct", read: "Lire mon histoire" }, finale: { sub: "Parlez-moi de votre commerce. Je viens vous voir, je vous montre à quoi pourrait ressembler votre site, et je le mets en ligne en quelques jours." } },
    it: { about: { nav: "Chi siamo", sig: "Mourad, il vostro contatto diretto", read: "Leggi la mia storia" }, finale: { sub: "Raccontatemi della vostra attività. Vengo a trovarvi, vi mostro come potrebbe essere il vostro sito e lo metto online in pochi giorni." } },
    th: { about: { nav: "เกี่ยวกับเรา", sig: "Mourad ติดต่อผมได้โดยตรง", read: "อ่านเรื่องของเรา" }, finale: { sub: "เล่าเรื่องร้านของคุณให้ผมฟัง ผมจะไปหาคุณ ให้ดูว่าเว็บไซต์ของคุณจะออกมาเป็นแบบไหน แล้วทำให้ออนไลน์ในไม่กี่วัน" }, book: { b1: "ผมกับคุณดูร้านและโปรไฟล์ Google ไปด้วยกัน" } },
    ar: { about: { nav: "من نحن", sig: "Mourad، تواصلك المباشر", read: "اقرأ قصتي" }, finale: { sub: "حدّثني عن محلّك. سآتي لزيارتك، وأريك كيف يمكن أن يبدو موقعك، ثم أطلقه خلال أيام." } }
  };
  /* Thai only: the founder's story: years of skills, came to Thailand, met and married his Thai wife, they work together;
     not to get rich, loyal and happy clients so they can stay; win-win */
  var C3 = {
 "en": {
  "founder": {
   "title": "A small team: my wife and me. <em>Not a big company.</em>",
   "body": "Hello, I'm {name}. Over the years, I've learned to build websites, menus and Google listings that bring in real customers. Then I came to Thailand, met my wife here, and we got married. Today we work together: she is Thai, and between the two of us we understand local business owners as well as their foreign customers. We're not trying to get rich. We want loyal, happy clients, so we can keep living and working here, together. If it works for you, it works for us: let's move forward together.",
   "p1": "We answer you ourselves, on WhatsApp",
   "p2": "I come to you, or we talk on video"
  }
 },
 "fr": {
  "founder": {
   "title": "Une petite équipe : ma femme et moi. <em>Pas une grosse boîte.</em>",
   "body": "Bonjour, je m'appelle {name}. Pendant des années, j'ai appris à créer des sites, des menus et des fiches Google qui amènent de vrais clients. Puis je suis venu en Thaïlande, j'y ai rencontré ma femme et nous nous sommes mariés. Aujourd'hui, nous travaillons ensemble : elle est thaïe, et à deux, nous comprenons aussi bien les commerçants d'ici que leurs clients étrangers. Notre but n'est pas de devenir riches. Nous voulons des clients fidèles et heureux, pour pouvoir continuer à vivre et à travailler ici, ensemble. Si ça vous va, ça nous va : on avance ensemble.",
   "p1": "Nous vous répondons nous-mêmes, sur WhatsApp",
   "p2": "Je viens vous voir, ou on se parle en visio"
  }
 },
 "it": {
  "founder": {
   "title": "Una piccola squadra: mia moglie e io. <em>Non una grande azienda.</em>",
   "body": "Ciao, sono {name}. In tanti anni ho imparato a creare siti, menù e schede Google che portano clienti veri. Poi sono venuto in Thailandia, qui ho conosciuto mia moglie e ci siamo sposati. Oggi lavoriamo insieme: lei è thailandese, e in due capiamo sia i commercianti del posto sia i loro clienti stranieri. Non vogliamo diventare ricchi. Vogliamo clienti fedeli e felici, per poter continuare a vivere e lavorare qui, insieme. Se va bene a voi, va bene a noi: andiamo avanti insieme.",
   "p1": "Vi rispondiamo noi, su WhatsApp",
   "p2": "Vengo da voi, o ci sentiamo in video"
  }
 },
 "th": {
  "founder": {
   "title": "ทีมเล็ก ๆ ผมกับภรรยา <em>ไม่ใช่บริษัทใหญ่</em>",
   "body": "สวัสดีครับ ผมชื่อ {name} หลายปีที่ผ่านมา ผมฝึกฝนการทำเว็บไซต์ เมนู และโปรไฟล์ Google ที่ช่วยให้ร้านได้ลูกค้าจริง จากนั้นผมมาเมืองไทย ได้พบภรรยาของผมที่นี่ และเราก็แต่งงานกัน วันนี้เราทำงานด้วยกัน ภรรยาผมเป็นคนไทย เราจึงเข้าใจทั้งเจ้าของร้านคนไทยและลูกค้าชาวต่างชาติ เราไม่ได้อยากรวย เราแค่อยากมีลูกค้าประจำที่มีความสุข เพื่อให้เราได้อยู่และทำงานที่นี่ด้วยกันต่อไป คุณพอใจ เราก็มีความสุข เติบโตไปด้วยกันนะครับ",
   "p1": "เราตอบคุณเองทาง WhatsApp",
   "p2": "ผมไปหาคุณถึงร้าน หรือคุยทางวิดีโอคอล"
  }
 },
 "ar": {
  "founder": {
   "title": "فريق صغير: أنا وزوجتي. <em>لسنا شركة كبيرة.</em>",
   "body": "مرحبًا، اسمي {name}. على مدى سنوات، تعلّمت إنشاء مواقع وقوائم طعام وملفات على جوجل تجلب زبائن حقيقيين. ثم جئت إلى تايلاند، وتعرّفت هنا على زوجتي، وتزوّجنا. واليوم نعمل معًا: زوجتي تايلاندية، ومعًا نفهم أصحاب المحلات المحليين وزبائنهم الأجانب على حدّ سواء. لا نسعى إلى الثراء. نريد زبائن أوفياء وسعداء، لنتمكّن من مواصلة العيش والعمل هنا معًا. ما يناسبك يناسبنا: لنتقدّم معًا.",
   "p1": "نرد عليك بأنفسنا على واتساب",
   "p2": "آتي إليك، أو نتحدث عبر الفيديو"
  }
 }
};
  function deep(t, s) { Object.keys(s).forEach(function (k) { if (s[k] && typeof s[k] === "object") { t[k] = t[k] || {}; deep(t[k], s[k]); } else t[k] = s[k]; }); return t; }
  deep(C, C2); deep(C.th, C3.th);   // the wife story is for Thai readers only
  window.NM_EXTRA_DICT = deep(window.NM_EXTRA_DICT || {}, C);
  if (typeof module !== "undefined") module.exports = C;
})();
