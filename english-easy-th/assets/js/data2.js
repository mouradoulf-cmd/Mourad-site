/* English Easy TH — curriculum part 2: grammar, daily life, real-life situations, pronunciation (A1 → A2). Appended to EE.UNITS. */
(function (EE) {
"use strict";
const W = (en, th, emoji, extra) => Object.assign({ en, th, emoji: emoji || "" }, extra || {});
const S = (en, th) => ({ en, th });
const N = (t, body, ex) => ({ t, body, ex: ex || [] });   /* grammar note shown before the exercises */

EE.UNITS.push(

/* ---------------------------------------------------------------- 11 */
{ id: "be", title: "ฉัน คุณ เขา & Verb to be", sub: "Pronouns & To be", emoji: "🧩", color: "#6c5ce7", dark: "#4b3fc4",
  intro: "รากฐานของทุกประโยค: สรรพนามและ am / is / are",
  lessons: [
    { id: "be1", title: "สรรพนาม I, you, he…", note: N("สรรพนาม (Pronouns)", "สรรพนามใช้แทนคน/สิ่งของ ไม่ต้องพูดชื่อซ้ำ<br><b>I</b> = ฉัน · <b>you</b> = คุณ · <b>he</b> = เขา(ชาย) · <b>she</b> = เธอ(หญิง) · <b>it</b> = มัน · <b>we</b> = พวกเรา · <b>they</b> = พวกเขา<br>⚠️ <b>I</b> เขียนตัวใหญ่เสมอ", [["I am Mali.", "ฉันชื่อมะลิ"], ["She is my sister.", "เธอเป็นพี่สาวของฉัน"]]), words: [
        W("I", "ฉัน / ผม", "🙋"), W("You", "คุณ / เธอ", "👉"), W("He", "เขา (ผู้ชาย)", "👨"), W("She", "เธอ (ผู้หญิง)", "👩"), W("It", "มัน / สิ่งนั้น", "📦"), W("We", "พวกเรา", "👥"), W("They", "พวกเขา", "🧑‍🤝‍🧑"),
        W("My", "ของฉัน", "🫵"), W("Your", "ของคุณ", "🫴")], sentences: [S("I am from Thailand.", "ฉันมาจากประเทศไทย"), S("They are my friends.", "พวกเขาเป็นเพื่อนของฉัน")] },
    { id: "be2", title: "am / is / are", note: N("Verb to be: am / is / are", "ใช้บอกว่า “เป็น / อยู่ / คือ”<br><b>I am</b> · <b>You are</b> · <b>He / She / It is</b> · <b>We / They are</b><br>ย่อได้: I'm, you're, he's, she's, it's, we're, they're", [["I am happy.", "ฉันมีความสุข"], ["He is a doctor.", "เขาเป็นหมอ"], ["We are students.", "พวกเราเป็นนักเรียน"]]), words: [], sentences: [
        S("I am happy.", "ฉันมีความสุข"), S("You are kind.", "คุณใจดี"), S("He is a doctor.", "เขาเป็นหมอ"), S("She is at home.", "เธออยู่ที่บ้าน"), S("It is a big dog.", "มันเป็นสุนัขตัวใหญ่"), S("We are ready.", "พวกเราพร้อมแล้ว"), S("They are late.", "พวกเขามาสาย")] },
    { id: "be3", title: "ปฏิเสธ & ถาม", note: N("ปฏิเสธและถามด้วย to be", "<b>ปฏิเสธ</b>: เติม <b>not</b> หลัง am/is/are → I am <b>not</b> · He is<b>n't</b> · They are<b>n't</b><br><b>ถาม</b>: สลับ be ไปไว้หน้าประโยค → <b>Are</b> you ready? · <b>Is</b> she a teacher?<br>ตอบ: Yes, I am. / No, she isn't.", [["I am not tired.", "ฉันไม่เหนื่อย"], ["Are you ready?", "คุณพร้อมไหม"], ["Yes, I am.", "ใช่ พร้อมแล้ว"]]), words: [], sentences: [
        S("I am not tired.", "ฉันไม่เหนื่อย"), S("He is not here.", "เขาไม่ได้อยู่ที่นี่"), S("They aren't students.", "พวกเขาไม่ใช่นักเรียน"), S("Are you ready?", "คุณพร้อมไหม"), S("Is she your sister?", "เธอเป็นพี่สาวของคุณใช่ไหม"), S("Yes, I am.", "ใช่ ฉันใช่"), S("No, it isn't.", "ไม่ ไม่ใช่")] }
  ] },

/* ---------------------------------------------------------------- 12 */
{ id: "routine", title: "กิจวัตรประจำวัน", sub: "Daily routine", emoji: "⏰", color: "#f39c12", dark: "#b9770e",
  intro: "เล่าวันของคุณตั้งแต่ตื่นนอนจนเข้านอน",
  lessons: [
    { id: "routine1", title: "ตอนเช้า", words: [
        W("Wake up", "ตื่นนอน", "⏰", { alt: ["wake up"] }), W("Get up", "ลุกจากเตียง", "🛏️"), W("Brush my teeth", "แปรงฟัน", "🪥"), W("Take a shower", "อาบน้ำ", "🚿"), W("Get dressed", "แต่งตัว", "👕"),
        W("Have breakfast", "กินอาหารเช้า", "🍳"), W("Go to work", "ไปทำงาน", "💼"), W("Go to school", "ไปโรงเรียน", "🏫")], sentences: [S("I wake up at six o'clock.", "ฉันตื่นนอนหกโมงเช้า"), S("I brush my teeth every morning.", "ฉันแปรงฟันทุกเช้า"), S("She goes to work by bus.", "เธอไปทำงานด้วยรถเมล์")] },
    { id: "routine2", title: "ตลอดวัน", words: [
        W("Study", "เรียน / ศึกษา", "📚"), W("Work", "ทำงาน", "💻"), W("Have lunch", "กินอาหารกลางวัน", "🍱"), W("Take a break", "พักผ่อนสักครู่", "☕"), W("Meet friends", "พบเพื่อน", "🧑‍🤝‍🧑"),
        W("Go home", "กลับบ้าน", "🏠"), W("Cook dinner", "ทำอาหารเย็น", "🍳"), W("Watch TV", "ดูทีวี", "📺")], sentences: [S("I have lunch at noon.", "ฉันกินข้าวกลางวันตอนเที่ยง"), S("We study English together.", "เราเรียนภาษาอังกฤษด้วยกัน"), S("He watches TV after dinner.", "เขาดูทีวีหลังอาหารเย็น")] },
    { id: "routine3", title: "ตอนเย็น & กลางคืน", words: [
        W("Take a bath", "อาบน้ำ (แช่น้ำ)", "🛁"), W("Read a book", "อ่านหนังสือ", "📖"), W("Listen to music", "ฟังเพลง", "🎧"), W("Do homework", "ทำการบ้าน", "📝"), W("Wash the dishes", "ล้างจาน", "🍽️"),
        W("Clean the house", "ทำความสะอาดบ้าน", "🧹"), W("Go to bed", "เข้านอน", "🛌"), W("Fall asleep", "หลับ", "😴")], sentences: [S("I go to bed at ten o'clock.", "ฉันเข้านอนสี่ทุ่ม"), S("She reads a book before bed.", "เธออ่านหนังสือก่อนนอน"), S("What time do you wake up?", "คุณตื่นกี่โมง")] }
  ] },

/* ---------------------------------------------------------------- 13 */
{ id: "home", title: "บ้าน & ของใช้", sub: "Home & things", emoji: "🏡", color: "#16a085", dark: "#0e6f5c",
  intro: "ห้องต่าง ๆ เฟอร์นิเจอร์ และของใช้ในบ้าน",
  lessons: [
    { id: "home1", title: "ห้องในบ้าน", words: [
        W("Living room", "ห้องนั่งเล่น", "🛋️"), W("Bedroom", "ห้องนอน", "🛏️"), W("Kitchen", "ห้องครัว", "🍳"), W("Bathroom", "ห้องน้ำ", "🚽"), W("Garden", "สวน", "🌷"), W("Garage", "โรงรถ", "🚗"), W("Door", "ประตู", "🚪"), W("Window", "หน้าต่าง", "🪟")],
      sentences: [S("The kitchen is next to the living room.", "ห้องครัวอยู่ติดกับห้องนั่งเล่น"), S("My bedroom is upstairs.", "ห้องนอนของฉันอยู่ชั้นบน")] },
    { id: "home2", title: "เฟอร์นิเจอร์", words: [
        W("Bed", "เตียง", "🛏️"), W("Table", "โต๊ะ", "🪑"), W("Chair", "เก้าอี้", "🪑"), W("Sofa", "โซฟา", "🛋️"), W("Lamp", "โคมไฟ", "💡"), W("Fridge", "ตู้เย็น", "🧊"), W("Fan", "พัดลม", "🌀"), W("Air conditioner", "เครื่องปรับอากาศ", "❄️")],
      sentences: [S("The lamp is on the table.", "โคมไฟอยู่บนโต๊ะ"), S("Please turn on the fan.", "ช่วยเปิดพัดลมหน่อย")] },
    { id: "home3", title: "ของใช้ส่วนตัว", words: [
        W("Phone", "โทรศัพท์", "📱"), W("Key", "กุญแจ", "🔑"), W("Wallet", "กระเป๋าสตางค์", "👛"), W("Bag", "กระเป๋า", "👜"), W("Glasses", "แว่นตา", "👓"), W("Watch", "นาฬิกาข้อมือ", "⌚"), W("Charger", "ที่ชาร์จ", "🔌"), W("Umbrella", "ร่ม", "☂️")],
      sentences: [S("Where is my phone?", "โทรศัพท์ของฉันอยู่ไหน"), S("I can't find my keys.", "ฉันหากุญแจไม่เจอ"), S("It is in my bag.", "มันอยู่ในกระเป๋าของฉัน")] }
  ] },

/* ---------------------------------------------------------------- 14 */
{ id: "body", title: "ร่างกาย & สุขภาพ", sub: "Body & health", emoji: "🩺", color: "#e74c3c", dark: "#a93226",
  intro: "บอกอาการและขอความช่วยเหลือเมื่อไม่สบาย",
  lessons: [
    { id: "body1", title: "ส่วนต่าง ๆ ของร่างกาย", words: [
        W("Head", "ศีรษะ", "🗣️"), W("Eye", "ตา", "👁️"), W("Ear", "หู", "👂"), W("Mouth", "ปาก", "👄"), W("Hand", "มือ", "✋"), W("Leg", "ขา", "🦵"), W("Stomach", "ท้อง / กระเพาะ", "🤰"), W("Back", "หลัง", "🔙")],
      sentences: [S("I wash my hands.", "ฉันล้างมือ"), S("Open your mouth, please.", "ช่วยอ้าปากหน่อย")] },
    { id: "body2", title: "อาการเจ็บป่วย", note: N("I have + อาการ / My ... hurts", "บอกอาการได้ 2 แบบ:<br>1) <b>I have a</b> headache / fever / cough (ฉันปวดหัว / มีไข้ / ไอ)<br>2) <b>My</b> back <b>hurts</b> (หลังของฉันเจ็บ)", [["I have a fever.", "ฉันมีไข้"], ["My stomach hurts.", "ท้องของฉันเจ็บ"]]), words: [
        W("Headache", "ปวดหัว", "🤕"), W("Fever", "ไข้", "🤒"), W("Cough", "ไอ", "😷"), W("Sore throat", "เจ็บคอ", "🗣️"), W("Stomachache", "ปวดท้อง", "🤢"), W("Toothache", "ปวดฟัน", "🦷"), W("Allergy", "ภูมิแพ้", "🤧"), W("Pain", "ความเจ็บปวด", "😖")],
      sentences: [S("I have a headache.", "ฉันปวดหัว"), S("My back hurts.", "หลังของฉันเจ็บ"), S("I feel sick.", "ฉันรู้สึกไม่สบาย")] },
    { id: "body3", title: "ที่โรงพยาบาล", words: [
        W("Doctor", "หมอ", "👨‍⚕️"), W("Nurse", "พยาบาล", "👩‍⚕️"), W("Hospital", "โรงพยาบาล", "🏥"), W("Pharmacy", "ร้านขายยา", "💊"), W("Medicine", "ยา", "💊"), W("Appointment", "การนัดหมาย", "📅"), W("Emergency", "เหตุฉุกเฉิน", "🚨"), W("Ambulance", "รถพยาบาล", "🚑")],
      sentences: [S("I need to see a doctor.", "ฉันต้องไปหาหมอ"), S("Please call an ambulance.", "ช่วยเรียกรถพยาบาลด้วย"), S("Take this medicine twice a day.", "ทานยานี้วันละสองครั้ง")] }
  ] },

/* ---------------------------------------------------------------- 15 */
{ id: "shop", title: "ช้อปปิ้ง & เงิน", sub: "Shopping & money", emoji: "🛍️", color: "#8e44ad", dark: "#5e2d73",
  intro: "ถามราคา ต่อรอง และจ่ายเงินได้อย่างมั่นใจ",
  lessons: [
    { id: "shop1", title: "ในร้านค้า", words: [
        W("Shop", "ร้านค้า", "🏪"), W("Market", "ตลาด", "🧺"), W("Mall", "ห้างสรรพสินค้า", "🏬"), W("Price", "ราคา", "🏷️"), W("Cheap", "ถูก", "🪙"), W("Expensive", "แพง", "💎"), W("Discount", "ส่วนลด", "🔖"), W("Size", "ขนาด / ไซซ์", "📏")],
      sentences: [S("How much is this?", "อันนี้ราคาเท่าไหร่"), S("It is too expensive.", "มันแพงเกินไป"), S("Do you have a smaller size?", "มีไซซ์เล็กกว่านี้ไหม")] },
    { id: "shop2", title: "จ่ายเงิน", words: [
        W("Cash", "เงินสด", "💵"), W("Credit card", "บัตรเครดิต", "💳"), W("Receipt", "ใบเสร็จ", "🧾"), W("Change", "เงินทอน", "🪙"), W("Pay", "จ่ายเงิน", "💰"), W("Buy", "ซื้อ", "🛒"), W("Sell", "ขาย", "🏷️"), W("Bag", "ถุง / กระเป๋า", "🛍️")],
      sentences: [S("Can I pay by card?", "จ่ายด้วยบัตรได้ไหม"), S("Here is your change.", "นี่เงินทอนของคุณ"), S("Can I have a receipt, please?", "ขอใบเสร็จด้วยได้ไหม")] },
    { id: "shop3", title: "เสื้อผ้า", words: [
        W("Shirt", "เสื้อเชิ้ต", "👔"), W("T-shirt", "เสื้อยืด", "👕"), W("Pants", "กางเกงขายาว", "👖"), W("Dress", "ชุดกระโปรง", "👗"), W("Shoes", "รองเท้า", "👟"), W("Hat", "หมวก", "🧢"), W("Try on", "ลอง (สวม)", "🪞"), W("Fit", "พอดีตัว", "✅")],
      sentences: [S("Can I try this on?", "ขอลองใส่ตัวนี้ได้ไหม"), S("It fits me well.", "ใส่พอดีตัวเลย"), S("I'll take it.", "ฉันเอาอันนี้")] }
  ] },

/* ---------------------------------------------------------------- 16 */
{ id: "place", title: "สถานที่ & การบอกทาง", sub: "Places & directions", emoji: "🧭", color: "#2980b9", dark: "#1c5f8a",
  intro: "ถามทาง บอกทาง และเรียกสถานที่ในเมือง",
  lessons: [
    { id: "place1", title: "สถานที่ในเมือง", words: [
        W("Bank", "ธนาคาร", "🏦"), W("Post office", "ที่ทำการไปรษณีย์", "📮"), W("Police station", "สถานีตำรวจ", "👮"), W("Station", "สถานี", "🚉"), W("Airport", "สนามบิน", "✈️"), W("Temple", "วัด", "🛕"), W("Park", "สวนสาธารณะ", "🌳"), W("Restaurant", "ร้านอาหาร", "🍽️")],
      sentences: [S("Where is the bank?", "ธนาคารอยู่ที่ไหน"), S("The station is near here.", "สถานีอยู่ใกล้ ๆ นี่")] },
    { id: "place2", title: "ทิศทาง", note: N("บอกทาง", "<b>Turn left / right</b> = เลี้ยวซ้าย / ขวา · <b>Go straight</b> = ตรงไป · <b>It's on your left</b> = อยู่ทางซ้ายมือ<br>ตำแหน่ง: <b>next to</b> (ติดกับ) · <b>in front of</b> (ด้านหน้า) · <b>behind</b> (ด้านหลัง) · <b>between</b> (ระหว่าง)", [["Turn left at the corner.", "เลี้ยวซ้ายที่หัวมุม"], ["It is next to the bank.", "มันอยู่ติดกับธนาคาร"]]), words: [
        W("Left", "ซ้าย", "⬅️"), W("Right", "ขวา", "➡️"), W("Straight", "ตรงไป", "⬆️"), W("Corner", "หัวมุม", "↩️"), W("Near", "ใกล้", "📍"), W("Far", "ไกล", "🗺️"), W("Next to", "ติดกับ", "🔗"), W("Opposite", "ตรงข้าม", "↔️")],
      sentences: [S("Turn left at the corner.", "เลี้ยวซ้ายที่หัวมุม"), S("Go straight for two blocks.", "ตรงไปสองช่วงตึก"), S("It's on your right.", "อยู่ทางขวามือของคุณ")] },
    { id: "place3", title: "เดินทาง", words: [
        W("Bus", "รถเมล์", "🚌"), W("Train", "รถไฟ", "🚆"), W("Taxi", "แท็กซี่", "🚕"), W("Motorbike", "มอเตอร์ไซค์", "🏍️"), W("Ticket", "ตั๋ว", "🎫"), W("Map", "แผนที่", "🗺️"), W("Stop", "จอด / ป้าย", "🛑"), W("Lost", "หลงทาง", "😵‍💫")],
      sentences: [S("How do I get to the airport?", "ไปสนามบินยังไง"), S("I am lost.", "ฉันหลงทาง"), S("Please stop here.", "ช่วยจอดตรงนี้ครับ/ค่ะ")] }
  ] },

/* ---------------------------------------------------------------- 17 */
{ id: "weather", title: "อากาศ & ธรรมชาติ", sub: "Weather & nature", emoji: "⛅", color: "#00a8cc", dark: "#007a94",
  intro: "คุยเรื่องอากาศ ฤดูกาล และธรรมชาติ",
  lessons: [
    { id: "weather1", title: "สภาพอากาศ", words: [
        W("Sunny", "แดดออก", "☀️"), W("Cloudy", "มีเมฆมาก", "☁️"), W("Rainy", "ฝนตก", "🌧️"), W("Windy", "ลมแรง", "💨"), W("Stormy", "พายุ", "⛈️"), W("Hot", "ร้อน", "🥵"), W("Cold", "หนาว", "🥶"), W("Humid", "ชื้น", "💦")],
      sentences: [S("It is sunny today.", "วันนี้แดดออก"), S("It's raining.", "ฝนกำลังตก"), S("It is very humid in Bangkok.", "กรุงเทพชื้นมาก")] },
    { id: "weather2", title: "ฤดู & ธรรมชาติ", words: [
        W("Summer", "ฤดูร้อน", "🏖️"), W("Rainy season", "ฤดูฝน", "🌦️"), W("Winter", "ฤดูหนาว", "⛄"), W("Mountain", "ภูเขา", "⛰️"), W("River", "แม่น้ำ", "🏞️"), W("Beach", "ชายหาด", "🏝️"), W("Forest", "ป่า", "🌲"), W("Flower", "ดอกไม้", "🌸")],
      sentences: [S("I love the beach in summer.", "ฉันชอบชายหาดตอนหน้าร้อน"), S("What's the weather like?", "อากาศเป็นยังไงบ้าง")] }
  ] },

/* ---------------------------------------------------------------- 18 */
{ id: "work", title: "งาน & อาชีพ", sub: "Work & jobs", emoji: "💼", color: "#34495e", dark: "#1f2d3a",
  intro: "แนะนำอาชีพและคุยเรื่องงานกับคนต่างชาติ",
  lessons: [
    { id: "work1", title: "อาชีพ", words: [
        W("Teacher", "ครู", "👩‍🏫"), W("Engineer", "วิศวกร", "👷"), W("Driver", "คนขับรถ", "🚖"), W("Chef", "เชฟ", "👨‍🍳"), W("Farmer", "ชาวนา / เกษตรกร", "👨‍🌾"), W("Police officer", "ตำรวจ", "👮"), W("Waiter", "พนักงานเสิร์ฟ", "🧑‍🍳"), W("Businessman", "นักธุรกิจ", "🕴️")],
      sentences: [S("What do you do?", "คุณทำงานอะไร"), S("I am a teacher.", "ฉันเป็นครู"), S("My father is a driver.", "พ่อของฉันเป็นคนขับรถ")] },
    { id: "work2", title: "ที่ทำงาน", words: [
        W("Office", "ออฟฟิศ", "🏢"), W("Boss", "หัวหน้า / เจ้านาย", "🧑‍💼"), W("Colleague", "เพื่อนร่วมงาน", "🧑‍🤝‍🧑"), W("Meeting", "ประชุม", "🗓️"), W("Salary", "เงินเดือน", "💰"), W("Email", "อีเมล", "📧"), W("Project", "โปรเจกต์", "📊"), W("Deadline", "กำหนดส่งงาน", "⏳")],
      sentences: [S("I have a meeting at three.", "ฉันมีประชุมตอนบ่ายสาม"), S("Please send me an email.", "ช่วยส่งอีเมลมาให้ฉันหน่อย"), S("The deadline is Friday.", "กำหนดส่งคือวันศุกร์")] }
  ] }
);
EE.rebuild();
})(window.EE);
