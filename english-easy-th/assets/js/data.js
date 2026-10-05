/* English Easy TH — curriculum data.
   Every item: en (English), th (Thai meaning), optional emoji, optional `say` (what the voice should pronounce),
   optional `alt` (extra accepted typed answers). Sentences: en, th. Content is written for Thai learners (A1). */
(function (EE) {
"use strict";

const W = (en, th, emoji, extra) => Object.assign({ en, th, emoji: emoji || "" }, extra || {});
const S = (en, th) => ({ en, th });

/* ---- the alphabet (letter name in Thai, example word) ---- */
const LET = [
  ["A", "เอ", "ay", "Apple", "แอปเปิล", "🍎"], ["B", "บี", "bee", "Banana", "กล้วย", "🍌"], ["C", "ซี", "see", "Cat", "แมว", "🐱"],
  ["D", "ดี", "dee", "Dog", "สุนัข", "🐶"], ["E", "อี", "ee", "Egg", "ไข่", "🥚"], ["F", "เอฟ", "eff", "Fish", "ปลา", "🐟"],
  ["G", "จี", "jee", "Grapes", "องุ่น", "🍇"], ["H", "เอช", "aitch", "House", "บ้าน", "🏠"], ["I", "ไอ", "eye", "Ice cream", "ไอศกรีม", "🍦"],
  ["J", "เจ", "jay", "Juice", "น้ำผลไม้", "🧃"], ["K", "เค", "kay", "Key", "กุญแจ", "🔑"], ["L", "แอล", "el", "Lemon", "มะนาว", "🍋"],
  ["M", "เอ็ม", "em", "Moon", "ดวงจันทร์", "🌙"], ["N", "เอ็น", "en", "Nose", "จมูก", "👃"], ["O", "โอ", "oh", "Orange", "ส้ม", "🍊"],
  ["P", "พี", "pee", "Pizza", "พิซซ่า", "🍕"], ["Q", "คิว", "cue", "Queen", "ราชินี", "👑"], ["R", "อาร์", "ar", "Rice", "ข้าว", "🍚"],
  ["S", "เอส", "ess", "Sun", "ดวงอาทิตย์", "☀️"], ["T", "ที", "tee", "Tree", "ต้นไม้", "🌳"], ["U", "ยู", "you", "Umbrella", "ร่ม", "☂️"],
  ["V", "วี", "vee", "Violin", "ไวโอลิน", "🎻"], ["W", "ดับเบิลยู", "double you", "Water", "น้ำ", "💧"], ["X", "เอ็กซ์", "ex", "X-ray", "เอ็กซเรย์", "🩻"],
  ["Y", "วาย", "why", "Yellow", "สีเหลือง", "💛"], ["Z", "แซด", "zee", "Zebra", "ม้าลาย", "🦓"]
].map(l => ({ en: l[0], th: l[1], say: l[2], ex: l[3], exTh: l[4], emoji: l[5], letter: true }));

EE.ALPHABET = LET;

EE.UNITS = [
  { id: "abc", title: "ตัวอักษร ABC", sub: "Alphabet", emoji: "🔤", color: "#6c5ce7", dark: "#4b3fc4",
    intro: "เริ่มจากตัวอักษร 26 ตัว ฟังเสียงแล้วจำชื่อและคำตัวอย่าง",
    lessons: [
      { id: "abc1", title: "A – I", words: LET.slice(0, 9) },
      { id: "abc2", title: "J – R", words: LET.slice(9, 18) },
      { id: "abc3", title: "S – Z", words: LET.slice(18, 26) }
    ] },

  { id: "greet", title: "ทักทาย", sub: "Greetings", emoji: "👋", color: "#00b894", dark: "#00876c",
    intro: "ประโยคทักทายและมารยาทพื้นฐาน ใช้ได้ทุกวัน",
    lessons: [
      { id: "greet1", title: "สวัสดี & ลาก่อน", words: [
          W("Hello", "สวัสดี", "👋"), W("Hi", "หวัดดี", "🙂"), W("Good morning", "สวัสดีตอนเช้า", "🌅"), W("Good afternoon", "สวัสดีตอนบ่าย", "☀️"),
          W("Good evening", "สวัสดีตอนเย็น", "🌆"), W("Good night", "ราตรีสวัสดิ์", "🌙"), W("Goodbye", "ลาก่อน", "👋")],
        sentences: [S("Good morning, teacher.", "สวัสดีตอนเช้าครับ/ค่ะ คุณครู"), S("See you tomorrow.", "เจอกันพรุ่งนี้นะ")] },
      { id: "greet2", title: "มารยาท", words: [
          W("Thank you", "ขอบคุณ", "🙏"), W("Please", "กรุณา / ขอ...หน่อย", "🤲"), W("Sorry", "ขอโทษ", "😔"), W("Excuse me", "ขอโทษนะ (เรียกความสนใจ)", "🙋"),
          W("Welcome", "ยินดีต้อนรับ", "🤗"), W("You're welcome", "ไม่เป็นไร / ยินดีครับ-ค่ะ", "😊"), W("Yes", "ใช่", "✅"), W("No", "ไม่", "❌")],
        sentences: [S("Thank you very much.", "ขอบคุณมากครับ/ค่ะ"), S("Excuse me, please.", "ขอโทษครับ/ค่ะ ขอทางหน่อย")] },
      { id: "greet3", title: "แนะนำตัว", words: [
          W("How are you?", "สบายดีไหม", "💬"), W("I'm fine", "ฉันสบายดี", "😄"), W("What's your name?", "คุณชื่ออะไร", "🏷️"), W("My name is", "ฉันชื่อ...", "🪪"),
          W("Nice to meet you", "ยินดีที่ได้รู้จัก", "🤝"), W("Where are you from?", "คุณมาจากที่ไหน", "🌏")],
        sentences: [S("I am from Thailand.", "ฉันมาจากประเทศไทย"), S("How are you today?", "วันนี้คุณสบายดีไหม"), S("My name is Mali.", "ฉันชื่อมะลิ")] }
    ] },

  { id: "num", title: "ตัวเลข", sub: "Numbers", emoji: "🔢", color: "#0984e3", dark: "#0a66b0",
    intro: "นับเลข 0–20 และเลขหลักสิบ ใช้บอกราคา เวลา และอายุ",
    lessons: [
      { id: "num1", title: "0 – 10", words: [
          W("zero", "ศูนย์ (0)", "0️⃣"), W("one", "หนึ่ง (1)", "1️⃣"), W("two", "สอง (2)", "2️⃣"), W("three", "สาม (3)", "3️⃣"), W("four", "สี่ (4)", "4️⃣"),
          W("five", "ห้า (5)", "5️⃣"), W("six", "หก (6)", "6️⃣"), W("seven", "เจ็ด (7)", "7️⃣"), W("eight", "แปด (8)", "8️⃣"), W("nine", "เก้า (9)", "9️⃣"), W("ten", "สิบ (10)", "🔟")],
        sentences: [S("I have two brothers.", "ฉันมีพี่ชายสองคน")] },
      { id: "num2", title: "11 – 20", words: [
          W("eleven", "สิบเอ็ด (11)"), W("twelve", "สิบสอง (12)"), W("thirteen", "สิบสาม (13)"), W("fourteen", "สิบสี่ (14)"), W("fifteen", "สิบห้า (15)"),
          W("sixteen", "สิบหก (16)"), W("seventeen", "สิบเจ็ด (17)"), W("eighteen", "สิบแปด (18)"), W("nineteen", "สิบเก้า (19)"), W("twenty", "ยี่สิบ (20)")],
        sentences: [S("I am twenty years old.", "ฉันอายุยี่สิบปี")] },
      { id: "num3", title: "สิบ & ร้อย", words: [
          W("thirty", "สามสิบ (30)"), W("forty", "สี่สิบ (40)"), W("fifty", "ห้าสิบ (50)"), W("sixty", "หกสิบ (60)"), W("seventy", "เจ็ดสิบ (70)"),
          W("eighty", "แปดสิบ (80)"), W("ninety", "เก้าสิบ (90)"), W("one hundred", "หนึ่งร้อย (100)", "💯")],
        sentences: [S("It is fifty baht.", "ราคาห้าสิบบาท"), S("One hundred baht, please.", "ขอหนึ่งร้อยบาทครับ/ค่ะ")] }
    ] },

  { id: "color", title: "สี", sub: "Colors", emoji: "🎨", color: "#e17055", dark: "#b8502f",
    intro: "เรียกชื่อสีและบอกสีของสิ่งของรอบตัว",
    lessons: [
      { id: "color1", title: "สีพื้นฐาน", words: [
          W("red", "สีแดง", "🔴"), W("blue", "สีน้ำเงิน / สีฟ้า", "🔵"), W("green", "สีเขียว", "🟢"), W("yellow", "สีเหลือง", "🟡"), W("black", "สีดำ", "⚫"), W("white", "สีขาว", "⚪")],
        sentences: [S("The sky is blue.", "ท้องฟ้าสีฟ้า")] },
      { id: "color2", title: "สีอื่น ๆ", words: [
          W("orange", "สีส้ม", "🟠"), W("pink", "สีชมพู", "🩷"), W("purple", "สีม่วง", "🟣"), W("brown", "สีน้ำตาล", "🟤"), W("gray", "สีเทา", "🩶", { alt: ["grey"] }), W("gold", "สีทอง", "🥇")],
        sentences: [S("I like pink.", "ฉันชอบสีชมพู")] },
      { id: "color3", title: "บอกสีของสิ่งของ", words: [
          W("a red apple", "แอปเปิลสีแดง", "🍎"), W("a green leaf", "ใบไม้สีเขียว", "🍃"), W("a yellow banana", "กล้วยสีเหลือง", "🍌"), W("a black cat", "แมวสีดำ", "🐈‍⬛"),
          W("a white shirt", "เสื้อเชิ้ตสีขาว", "👔"), W("a blue car", "รถสีน้ำเงิน", "🚙")],
        sentences: [S("What color is it?", "มันสีอะไร"), S("It is red.", "มันสีแดง")] }
    ] },

  { id: "fam", title: "ครอบครัว & ผู้คน", sub: "Family", emoji: "👨‍👩‍👧", color: "#e84393", dark: "#b82d73",
    intro: "เรียกชื่อสมาชิกในครอบครัวและคนใกล้ตัว",
    lessons: [
      { id: "fam1", title: "สมาชิกครอบครัว", words: [
          W("mother", "แม่", "👩"), W("father", "พ่อ", "👨"), W("sister", "พี่สาว / น้องสาว", "👧"), W("brother", "พี่ชาย / น้องชาย", "👦"),
          W("grandmother", "ยาย / ย่า", "👵"), W("grandfather", "ตา / ปู่", "👴"), W("family", "ครอบครัว", "👪")],
        sentences: [S("This is my family.", "นี่คือครอบครัวของฉัน"), S("I love my mother.", "ฉันรักแม่ของฉัน")] },
      { id: "fam2", title: "ลูก & คู่ชีวิต", words: [
          W("son", "ลูกชาย", "👦"), W("daughter", "ลูกสาว", "👧"), W("husband", "สามี", "🤵"), W("wife", "ภรรยา", "👰"), W("baby", "ทารก", "👶"), W("child", "เด็ก", "🧒")],
        sentences: [S("She is my wife.", "เธอคือภรรยาของฉัน"), S("He is my son.", "เขาคือลูกชายของฉัน")] },
      { id: "fam3", title: "ผู้คน", words: [
          W("friend", "เพื่อน", "🧑‍🤝‍🧑"), W("man", "ผู้ชาย", "👨"), W("woman", "ผู้หญิง", "👩"), W("boy", "เด็กชาย", "👦"), W("girl", "เด็กหญิง", "👧"), W("teacher", "ครู", "🧑‍🏫"), W("student", "นักเรียน", "🧑‍🎓")],
        sentences: [S("He is my friend.", "เขาเป็นเพื่อนของฉัน"), S("I am a student.", "ฉันเป็นนักเรียน")] }
    ] },

  { id: "food", title: "อาหาร & เครื่องดื่ม", sub: "Food & Drink", emoji: "🍜", color: "#fdcb6e", dark: "#d39e26",
    intro: "สั่งอาหารและพูดถึงรสชาติได้อย่างมั่นใจ",
    lessons: [
      { id: "food1", title: "อาหารหลัก", words: [
          W("rice", "ข้าว", "🍚"), W("chicken", "ไก่", "🍗"), W("pork", "หมู", "🥩"), W("beef", "เนื้อวัว", "🥩"), W("fish", "ปลา", "🐟"), W("egg", "ไข่", "🥚"),
          W("noodles", "ก๋วยเตี๋ยว / เส้น", "🍜"), W("soup", "ซุป / ต้ม", "🍲")] },
      { id: "food2", title: "ผลไม้ & เครื่องดื่ม", words: [
          W("fruit", "ผลไม้", "🍉"), W("banana", "กล้วย", "🍌"), W("mango", "มะม่วง", "🥭"), W("water", "น้ำดื่ม", "💧"), W("coffee", "กาแฟ", "☕"), W("tea", "ชา", "🍵"),
          W("milk", "นม", "🥛"), W("juice", "น้ำผลไม้", "🧃"), W("beer", "เบียร์", "🍺")],
        sentences: [S("I would like a coffee, please.", "ขอกาแฟหนึ่งแก้วครับ/ค่ะ")] },
      { id: "food3", title: "รสชาติ & ความรู้สึก", words: [
          W("delicious", "อร่อย", "😋"), W("hungry", "หิว", "🤤"), W("thirsty", "กระหายน้ำ", "🥤"), W("spicy", "เผ็ด", "🌶️"), W("sweet", "หวาน", "🍬"), W("sour", "เปรี้ยว", "🍋")],
        sentences: [S("I am hungry.", "ฉันหิว"), S("The food is delicious.", "อาหารอร่อยมาก"), S("I don't like spicy food.", "ฉันไม่ชอบอาหารเผ็ด")] }
    ] },

  { id: "verb", title: "กริยาในชีวิตประจำวัน", sub: "Daily verbs", emoji: "🏃", color: "#00cec9", dark: "#00a19d",
    intro: "คำกริยาที่ใช้บ่อยที่สุด พูดถึงสิ่งที่ทำทุกวัน",
    lessons: [
      { id: "verb1", title: "กิจวัตร", words: [
          W("eat", "กิน", "🍽️"), W("drink", "ดื่ม", "🥤"), W("sleep", "นอน", "😴"), W("wake up", "ตื่นนอน", "⏰"), W("go", "ไป", "➡️"), W("come", "มา", "⬅️"), W("work", "ทำงาน", "💼"), W("study", "เรียน / อ่านหนังสือ", "📚")],
        sentences: [S("I wake up at six.", "ฉันตื่นนอนตอนหกโมง"), S("I go to work.", "ฉันไปทำงาน")] },
      { id: "verb2", title: "ทักษะภาษา", words: [
          W("read", "อ่าน", "📖"), W("write", "เขียน", "✍️"), W("speak", "พูด", "🗣️"), W("listen", "ฟัง", "👂"), W("walk", "เดิน", "🚶"), W("run", "วิ่ง", "🏃")],
        sentences: [S("I speak English.", "ฉันพูดภาษาอังกฤษ"), S("Please listen.", "กรุณาฟัง")] },
      { id: "verb3", title: "ความต้องการ", words: [
          W("buy", "ซื้อ", "🛒"), W("sell", "ขาย", "🏷️"), W("like", "ชอบ", "👍"), W("love", "รัก", "❤️"), W("want", "อยาก / ต้องการ", "🙏"), W("need", "จำเป็นต้องมี / ต้อง", "❗")],
        sentences: [S("I like music.", "ฉันชอบดนตรี"), S("I want water.", "ฉันอยากได้น้ำ"), S("I need help.", "ฉันต้องการความช่วยเหลือ")] }
    ] },

  { id: "travel", title: "ท่องเที่ยว & บริการ", sub: "Travel", emoji: "🏖️", color: "#2d98da", dark: "#1c72ab",
    intro: "ภาษาอังกฤษสำหรับโรงแรม ร้านอาหาร แท็กซี่ และการเดินทาง",
    lessons: [
      { id: "travel1", title: "สถานที่", words: [
          W("hotel", "โรงแรม", "🏨"), W("room", "ห้องพัก", "🛏️"), W("airport", "สนามบิน", "✈️"), W("beach", "ชายหาด", "🏖️"), W("restaurant", "ร้านอาหาร", "🍴"), W("taxi", "แท็กซี่", "🚕"),
          W("toilet", "ห้องน้ำ", "🚻", { alt: ["bathroom", "restroom"] })],
        sentences: [S("Where is the toilet?", "ห้องน้ำอยู่ที่ไหน"), S("I have a reservation.", "ฉันจองไว้แล้ว")] },
      { id: "travel2", title: "ซื้อของ & จ่ายเงิน", words: [
          W("price", "ราคา", "🏷️"), W("expensive", "แพง", "💸"), W("cheap", "ถูก", "🪙"), W("discount", "ส่วนลด", "🔻"), W("money", "เงิน", "💵"), W("menu", "เมนู", "📋"), W("bill", "บิล / ใบเสร็จ", "🧾")],
        sentences: [S("How much is this?", "อันนี้ราคาเท่าไหร่"), S("Can I have the bill, please?", "ขอบิลหน่อยครับ/ค่ะ"), S("It is too expensive.", "มันแพงเกินไป")] },
      { id: "travel3", title: "ถามทาง", words: [
          W("left", "ซ้าย", "⬅️"), W("right", "ขวา", "➡️"), W("straight", "ตรงไป", "⬆️"), W("near", "ใกล้", "📍"), W("far", "ไกล", "🗺️"), W("map", "แผนที่", "🗺️"), W("help", "ช่วย / ความช่วยเหลือ", "🆘")],
        sentences: [S("Turn left.", "เลี้ยวซ้าย"), S("Go straight.", "ตรงไป"), S("Can you help me?", "คุณช่วยฉันได้ไหม"), S("Do you speak English?", "คุณพูดภาษาอังกฤษได้ไหม")] }
    ] },

  { id: "time", title: "วัน & เวลา", sub: "Time & Days", emoji: "🗓️", color: "#a29bfe", dark: "#7a70dd",
    intro: "วันในสัปดาห์ ช่วงเวลา และคำบอกความถี่",
    lessons: [
      { id: "time1", title: "วันในสัปดาห์", words: [
          W("Monday", "วันจันทร์"), W("Tuesday", "วันอังคาร"), W("Wednesday", "วันพุธ"), W("Thursday", "วันพฤหัสบดี"), W("Friday", "วันศุกร์"), W("Saturday", "วันเสาร์"), W("Sunday", "วันอาทิตย์")],
        sentences: [S("Today is Monday.", "วันนี้เป็นวันจันทร์")] },
      { id: "time2", title: "ช่วงเวลา", words: [
          W("today", "วันนี้", "📅"), W("tomorrow", "พรุ่งนี้", "➡️"), W("yesterday", "เมื่อวาน", "⬅️"), W("morning", "ตอนเช้า", "🌅"), W("afternoon", "ตอนบ่าย", "☀️"), W("evening", "ตอนเย็น", "🌇"), W("night", "กลางคืน", "🌃")],
        sentences: [S("See you tomorrow.", "เจอกันพรุ่งนี้")] },
      { id: "time3", title: "หน่วยเวลา & ความถี่", words: [
          W("week", "สัปดาห์", "🗓️"), W("month", "เดือน", "📆"), W("year", "ปี", "🎆"), W("hour", "ชั่วโมง", "🕐"), W("minute", "นาที", "⏱️"), W("now", "ตอนนี้", "👉"), W("always", "เสมอ", "♾️"), W("never", "ไม่เคย", "🚫")],
        sentences: [S("What time is it?", "ตอนนี้กี่โมงแล้ว"), S("It is ten o'clock.", "ตอนนี้สิบโมง")] }
    ] },

  { id: "sent", title: "ประโยคพื้นฐาน", sub: "Basic sentences", emoji: "💬", color: "#fd79a8", dark: "#d25783",
    intro: "ต่อคำเป็นประโยคที่ใช้จริง ถามและตอบง่าย ๆ",
    lessons: [
      { id: "sent1", title: "I am / You are", words: [], sentences: [
          S("I am a student.", "ฉันเป็นนักเรียน"), S("You are my friend.", "คุณเป็นเพื่อนของฉัน"), S("She is a teacher.", "เธอเป็นครู"), S("He works in a hotel.", "เขาทำงานในโรงแรม"),
          S("We are happy.", "พวกเรามีความสุข"), S("They are at home.", "พวกเขาอยู่บ้าน")] },
      { id: "sent2", title: "ถาม & ตอบ", words: [], sentences: [
          S("Do you like music?", "คุณชอบดนตรีไหม"), S("Yes, I do.", "ใช่ ฉันชอบ"), S("No, I don't.", "ไม่ ฉันไม่ชอบ"), S("Where are you from?", "คุณมาจากที่ไหน"),
          S("What is your name?", "คุณชื่ออะไร"), S("How old are you?", "คุณอายุเท่าไหร่")] },
      { id: "sent3", title: "ใช้จริงในชีวิต", words: [], sentences: [
          S("Can you speak slowly, please?", "ช่วยพูดช้า ๆ หน่อยได้ไหม"), S("I don't understand.", "ฉันไม่เข้าใจ"), S("Let's go!", "ไปกันเถอะ"), S("I love Thailand.", "ฉันรักประเทศไทย"),
          S("I would like some water.", "ฉันขอน้ำหน่อย"), S("Nice to meet you.", "ยินดีที่ได้รู้จัก")] }
    ] }
];

/* ---- Word of the day (en, th, sentence, thai sentence) ---- */
EE.WOTD = [
  ["Beautiful", "สวยงาม", "The beach is beautiful.", "ชายหาดสวยงามมาก"], ["Delicious", "อร่อย", "This food is delicious.", "อาหารนี้อร่อย"],
  ["Welcome", "ยินดีต้อนรับ", "Welcome to Thailand.", "ยินดีต้อนรับสู่ประเทศไทย"], ["Together", "ด้วยกัน", "Let's eat together.", "มากินข้าวด้วยกันเถอะ"],
  ["Remember", "จำได้ / จดจำ", "Please remember my name.", "กรุณาจำชื่อของฉันด้วย"], ["Practice", "ฝึกฝน", "I practice English every day.", "ฉันฝึกภาษาอังกฤษทุกวัน"],
  ["Helpful", "เป็นประโยชน์ / ช่วยเหลือดี", "The staff are very helpful.", "พนักงานช่วยเหลือดีมาก"], ["Comfortable", "สบาย / สะดวกสบาย", "The room is comfortable.", "ห้องพักสบายมาก"],
  ["Quickly", "อย่างรวดเร็ว", "Please come quickly.", "กรุณามาเร็ว ๆ"], ["Slowly", "ช้า ๆ", "Please speak slowly.", "กรุณาพูดช้า ๆ"],
  ["Important", "สำคัญ", "This is very important.", "เรื่องนี้สำคัญมาก"], ["Different", "แตกต่าง", "This one is different.", "อันนี้แตกต่างออกไป"],
  ["Easy", "ง่าย", "English is easy with practice.", "ภาษาอังกฤษง่ายถ้าฝึกบ่อย ๆ"], ["Difficult", "ยาก", "This word is difficult.", "คำนี้ยาก"],
  ["Ready", "พร้อม", "I am ready.", "ฉันพร้อมแล้ว"], ["Wait", "รอ", "Please wait a moment.", "กรุณารอสักครู่"],
  ["Choose", "เลือก", "You can choose a drink.", "คุณเลือกเครื่องดื่มได้"], ["Enjoy", "สนุก / เพลิดเพลิน", "Enjoy your meal.", "ทานให้อร่อยนะ"],
  ["Safe", "ปลอดภัย", "This place is safe.", "ที่นี่ปลอดภัย"], ["Clean", "สะอาด", "The room is clean.", "ห้องสะอาด"],
  ["Hot", "ร้อน", "It is very hot today.", "วันนี้ร้อนมาก"], ["Cold", "เย็น / หนาว", "The water is cold.", "น้ำเย็น"],
  ["Open", "เปิด", "The shop is open.", "ร้านเปิดอยู่"], ["Closed", "ปิด", "The bank is closed.", "ธนาคารปิดอยู่"],
  ["Free", "ฟรี / ว่าง", "Breakfast is free.", "อาหารเช้าฟรี"], ["Busy", "ยุ่ง / คนเยอะ", "I am busy today.", "วันนี้ฉันยุ่ง"],
  ["Tired", "เหนื่อย", "I am tired.", "ฉันเหนื่อย"], ["Happy", "มีความสุข", "I am happy to see you.", "ฉันดีใจที่ได้เจอคุณ"],
  ["Smile", "ยิ้ม", "Smile and say hello.", "ยิ้มแล้วทักทายสิ"], ["Learn", "เรียนรู้", "I learn new words every day.", "ฉันเรียนคำศัพท์ใหม่ทุกวัน"]
].map(x => ({ en: x[0], th: x[1], ex: x[2], exTh: x[3] }));

/* ---- Grammar tips (Thai) ---- */
EE.TIPS = [
  { t: "ประโยคพื้นฐาน: Subject + Verb", body: "ภาษาอังกฤษเรียงประโยคเป็น <b>ประธาน + กริยา + กรรม</b> เหมือนภาษาไทย<br>ตัวอย่าง: <b>I eat rice.</b> = ฉัน กิน ข้าว", ex: [["I eat rice.", "ฉันกินข้าว"], ["She reads a book.", "เธออ่านหนังสือ"]] },
  { t: "Verb to be: am / is / are", body: "ใช้บอกว่า “เป็น / อยู่ / คือ”<br><b>I am</b> · <b>You are</b> · <b>He/She/It is</b> · <b>We/They are</b>", ex: [["I am a student.", "ฉันเป็นนักเรียน"], ["They are at home.", "พวกเขาอยู่บ้าน"]] },
  { t: "a / an", body: "ใช้ <b>a</b> นำหน้านามนับได้เอกพจน์ที่ขึ้นต้นด้วยเสียงพยัญชนะ และ <b>an</b> เมื่อขึ้นต้นด้วยเสียงสระ (a, e, i, o, u)", ex: [["a cat", "แมวตัวหนึ่ง"], ["an apple", "แอปเปิลหนึ่งผล"]] },
  { t: "พหูพจน์: เติม -s", body: "นามส่วนใหญ่เติม <b>-s</b> เมื่อมีมากกว่าหนึ่ง เช่น cat → cats<br>บางคำเปลี่ยนรูป เช่น man → men, child → children", ex: [["two cats", "แมวสองตัว"], ["three children", "เด็กสามคน"]] },
  { t: "Present simple (กริยาปกติ)", body: "ประธาน <b>he / she / it</b> เติม <b>-s</b> ที่กริยา: He <b>works</b>. She <b>likes</b> coffee.<br>ประธานอื่นใช้กริยาเดิม: I work. We like coffee.", ex: [["He works in a hotel.", "เขาทำงานในโรงแรม"], ["We like coffee.", "พวกเราชอบกาแฟ"]] },
  { t: "ถามด้วย Do / Does", body: "ถามด้วย <b>Do</b> (I, you, we, they) หรือ <b>Does</b> (he, she, it)<br>ตอบ: Yes, I <b>do</b>. / No, I <b>don't</b>.", ex: [["Do you like music?", "คุณชอบดนตรีไหม"], ["Does she work here?", "เธอทำงานที่นี่ไหม"]] },
  { t: "in / on / at", body: "<b>in</b> = ใน (เดือน ปี สถานที่ใหญ่) · <b>on</b> = บน/วัน · <b>at</b> = ที่ (เวลา สถานที่เฉพาะ)", ex: [["in July", "ในเดือนกรกฎาคม"], ["on Monday", "ในวันจันทร์"], ["at six o'clock", "ตอนหกโมงตรง"]] },
  { t: "ขอสิ่งต่าง ๆ อย่างสุภาพ", body: "ใช้ <b>I would like ...</b> (ฉันขอ...) และ <b>Can I have ...?</b> (ขอ...ได้ไหม) แล้วปิดท้ายด้วย <b>please</b>", ex: [["I would like a coffee, please.", "ขอกาแฟหนึ่งแก้วครับ/ค่ะ"], ["Can I have the menu?", "ขอเมนูได้ไหม"]] }
];

/* flat helpers (rebuilt by data2.js after the extra units are appended) */
EE.rebuild = function () {
EE.ALL_WORDS = [];
EE.UNITS.forEach(u => u.lessons.forEach(l => {
  l.unit = u.id;
  (l.words || []).forEach(w => { w.unit = u.id; EE.ALL_WORDS.push(w); });
}));
EE.LESSONS = [];
EE.UNITS.forEach((u, ui) => u.lessons.forEach((l, li) => { l.ui = ui; l.li = li; EE.LESSONS.push(l); }));
EE.lessonById = id => EE.LESSONS.find(l => l.id === id);
EE.unitById = id => EE.UNITS.find(u => u.id === id);

};
EE.rebuild();
})(window.EE = window.EE || {});
