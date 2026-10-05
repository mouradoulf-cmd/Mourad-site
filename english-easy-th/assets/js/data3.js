/* English Easy TH — curriculum part 3: tenses, questions, real-life situations, pronunciation for Thai speakers. */
(function (EE) {
"use strict";
const W = (en, th, emoji, extra) => Object.assign({ en, th, emoji: emoji || "" }, extra || {});
const S = (en, th) => ({ en, th });
const N = (t, body, ex) => ({ t, body, ex: ex || [] });

EE.UNITS.push(

/* ---------------------------------------------------------------- 19 */
{ id: "present", title: "Present Simple", sub: "สิ่งที่ทำเป็นประจำ", emoji: "🔁", color: "#e67e22", dark: "#a85d12",
  intro: "ไวยากรณ์ที่ใช้บ่อยที่สุด: พูดถึงนิสัย กิจวัตร และความจริง",
  lessons: [
    { id: "present1", title: "ประโยคบอกเล่า", note: N("Present simple: บอกเล่า", "ใช้กับ <b>กิจวัตร นิสัย ความจริง</b><br>ประธาน I / you / we / they → กริยาเดิม: I <b>work</b>.<br>ประธาน he / she / it → <b>เติม -s / -es</b>: She <b>works</b>. He <b>goes</b>.<br>กริยาลงท้าย -y (พยัญชนะ+y) → <b>-ies</b>: study → stud<b>ies</b>", [["I work in Bangkok.", "ฉันทำงานที่กรุงเทพ"], ["She works in Chiang Mai.", "เธอทำงานที่เชียงใหม่"], ["He studies English.", "เขาเรียนภาษาอังกฤษ"]]), words: [
        W("Always", "เสมอ", "♾️"), W("Usually", "ปกติ", "📆"), W("Often", "บ่อย ๆ", "🔂"), W("Sometimes", "บางครั้ง", "🌗"), W("Never", "ไม่เคย", "🚫"), W("Every day", "ทุกวัน", "🗓️"), W("On weekends", "ในวันหยุดสุดสัปดาห์", "🎉"), W("Rarely", "นาน ๆ ครั้ง", "🌑")],
      sentences: [S("I usually drink coffee.", "ฉันมักดื่มกาแฟ"), S("She goes to the gym on Monday.", "เธอไปยิมวันจันทร์"), S("He never eats meat.", "เขาไม่เคยกินเนื้อสัตว์"), S("They often play football.", "พวกเขาเล่นฟุตบอลบ่อย ๆ")] },
    { id: "present2", title: "ปฏิเสธ don't / doesn't", note: N("Present simple: ปฏิเสธ", "ใช้ <b>don't</b> (I, you, we, they) และ <b>doesn't</b> (he, she, it) + <b>กริยาเดิม ไม่เติม s</b><br>✅ She <b>doesn't like</b> tea. ❌ She doesn't likes tea.", [["I don't like spicy food.", "ฉันไม่ชอบอาหารเผ็ด"], ["He doesn't work on Sunday.", "เขาไม่ทำงานวันอาทิตย์"]]), words: [], sentences: [
        S("I don't like spicy food.", "ฉันไม่ชอบอาหารเผ็ด"), S("You don't know him.", "คุณไม่รู้จักเขา"), S("We don't have a car.", "พวกเราไม่มีรถ"), S("She doesn't drink coffee.", "เธอไม่ดื่มกาแฟ"), S("He doesn't work on Sunday.", "เขาไม่ทำงานวันอาทิตย์"), S("It doesn't rain here.", "ที่นี่ฝนไม่ตก")] },
    { id: "present3", title: "ถาม Do / Does", note: N("Present simple: คำถาม", "ถามด้วย <b>Do</b> (I, you, we, they) / <b>Does</b> (he, she, it) + ประธาน + <b>กริยาเดิม</b><br><b>Do</b> you like music? → Yes, I <b>do</b>. / No, I <b>don't</b>.<br><b>Does</b> she work here? → Yes, she <b>does</b>.", [["Do you speak English?", "คุณพูดภาษาอังกฤษได้ไหม"], ["Does he live here?", "เขาอาศัยอยู่ที่นี่ไหม"]]), words: [], sentences: [
        S("Do you speak English?", "คุณพูดภาษาอังกฤษได้ไหม"), S("Do they live in Phuket?", "พวกเขาอยู่ภูเก็ตหรือเปล่า"), S("Does she work here?", "เธอทำงานที่นี่ไหม"), S("Does he like football?", "เขาชอบฟุตบอลไหม"), S("Yes, she does.", "ใช่ เธอทำ"), S("No, they don't.", "ไม่ พวกเขาไม่")] }
  ] },

/* ---------------------------------------------------------------- 20 */
{ id: "past", title: "Past Simple", sub: "เล่าเรื่องในอดีต", emoji: "⏪", color: "#9b59b6", dark: "#6c3483",
  intro: "เล่าว่าเมื่อวานทำอะไร สุดสัปดาห์ที่ผ่านมาไปไหน",
  lessons: [
    { id: "past1", title: "กริยาปกติ + -ed", note: N("Past simple: กริยาปกติ", "อดีตของกริยาปกติ <b>เติม -ed</b>: work → work<b>ed</b> · play → play<b>ed</b><br>ลงท้าย -e เติม <b>-d</b>: live → live<b>d</b> · ลงท้าย พยัญชนะ+y → <b>-ied</b>: study → stud<b>ied</b><br>ใช้รูปเดียวกันกับทุกประธาน: I <b>worked</b>, she <b>worked</b>", [["I watched TV yesterday.", "เมื่อวานฉันดูทีวี"], ["She cooked dinner.", "เธอทำอาหารเย็น"]]), words: [
        W("Yesterday", "เมื่อวาน", "⏮️"), W("Last night", "เมื่อคืน", "🌙"), W("Last week", "สัปดาห์ที่แล้ว", "🗓️"), W("Ago", "ที่แล้ว (เมื่อ...ก่อน)", "⌛"), W("Walked", "เดิน (อดีต)", "🚶"), W("Played", "เล่น (อดีต)", "🎮"), W("Watched", "ดู (อดีต)", "📺"), W("Cooked", "ทำอาหาร (อดีต)", "🍳")],
      sentences: [S("I watched a movie last night.", "เมื่อคืนฉันดูหนัง"), S("She cooked dinner yesterday.", "เมื่อวานเธอทำอาหารเย็น"), S("We played football two days ago.", "เราเล่นฟุตบอลเมื่อสองวันก่อน")] },
    { id: "past2", title: "กริยาไม่ปกติ", note: N("Past simple: กริยาไม่ปกติ", "บางคำ <b>เปลี่ยนรูป</b> ต้องจำ: go → <b>went</b> · eat → <b>ate</b> · see → <b>saw</b> · have → <b>had</b> · make → <b>made</b> · come → <b>came</b> · take → <b>took</b>", [["I went to the market.", "ฉันไปตลาด"], ["We ate noodles.", "เรากินก๋วยเตี๋ยว"]]), words: [
        W("Went", "ไป (อดีตของ go)", "➡️"), W("Ate", "กิน (อดีตของ eat)", "🍽️"), W("Saw", "เห็น (อดีตของ see)", "👀"), W("Had", "มี / กิน (อดีตของ have)", "✋"), W("Made", "ทำ / สร้าง (อดีตของ make)", "🔨"), W("Came", "มา (อดีตของ come)", "🚶‍♂️"), W("Took", "เอา / พา (อดีตของ take)", "🫴"), W("Bought", "ซื้อ (อดีตของ buy)", "🛒")],
      sentences: [S("I went to the market yesterday.", "เมื่อวานฉันไปตลาด"), S("We ate noodles for lunch.", "เรากินก๋วยเตี๋ยวเป็นมื้อกลางวัน"), S("She bought a new phone.", "เธอซื้อโทรศัพท์เครื่องใหม่")] },
    { id: "past3", title: "ปฏิเสธ & ถาม did", note: N("Past simple: did / didn't", "ปฏิเสธใช้ <b>didn't</b> + กริยาเดิม: I <b>didn't go</b>.<br>ถามใช้ <b>Did</b> + ประธาน + กริยาเดิม: <b>Did</b> you <b>eat</b>? → Yes, I <b>did</b>. / No, I <b>didn't</b>.<br>⚠️ หลัง did / didn't กริยากลับเป็นรูปเดิมเสมอ", [["I didn't go to work.", "ฉันไม่ได้ไปทำงาน"], ["Did you eat?", "คุณกินข้าวหรือยัง"]]), words: [], sentences: [
        S("I didn't go to work.", "ฉันไม่ได้ไปทำงาน"), S("She didn't call me.", "เธอไม่ได้โทรหาฉัน"), S("Did you eat breakfast?", "คุณกินอาหารเช้าหรือยัง"), S("Did he come to the party?", "เขามางานปาร์ตี้ไหม"), S("Yes, I did.", "ใช่ ฉันกินแล้ว"), S("No, we didn't.", "ไม่ พวกเราไม่ได้ไป")] }
  ] },

/* ---------------------------------------------------------------- 21 */
{ id: "future", title: "อนาคต & แผนการ", sub: "Future & plans", emoji: "🚀", color: "#1abc9c", dark: "#12806a",
  intro: "พูดถึงสิ่งที่จะทำ แผนการ และความตั้งใจ",
  lessons: [
    { id: "future1", title: "will & going to", note: N("will / going to", "<b>will + กริยาเดิม</b> = ตัดสินใจตอนพูด / สัญญา / คาดการณ์: I <b>will</b> help you.<br><b>be going to + กริยาเดิม</b> = แผนที่ตั้งใจไว้แล้ว: I <b>am going to</b> visit Japan.<br>ปฏิเสธ: <b>won't</b> (will not)", [["I will help you.", "ฉันจะช่วยคุณ"], ["I am going to visit Japan.", "ฉันกำลังจะไปเที่ยวญี่ปุ่น"]]), words: [
        W("Tomorrow", "พรุ่งนี้", "📅"), W("Next week", "สัปดาห์หน้า", "🗓️"), W("Next month", "เดือนหน้า", "🈷️"), W("Soon", "เร็ว ๆ นี้", "⏩"), W("Plan", "แผน", "📋"), W("Want to", "อยากจะ", "💭"), W("Hope", "หวังว่า", "🤞"), W("Maybe", "อาจจะ", "🤔")],
      sentences: [S("I will call you tomorrow.", "พรุ่งนี้ฉันจะโทรหาคุณ"), S("We are going to travel next month.", "เดือนหน้าเราจะไปเที่ยว"), S("It won't rain today.", "วันนี้ฝนจะไม่ตก")] },
    { id: "future2", title: "พูดถึงความฝัน & แผน", words: [
        W("Dream", "ความฝัน", "💫"), W("Goal", "เป้าหมาย", "🎯"), W("Learn", "เรียนรู้", "📖"), W("Travel", "ท่องเที่ยว", "🧳"), W("Start", "เริ่ม", "▶️"), W("Open a business", "เปิดธุรกิจ", "🏪"), W("Save money", "เก็บเงิน", "🐷"), W("Succeed", "ประสบความสำเร็จ", "🏆")],
      sentences: [S("I want to speak English well.", "ฉันอยากพูดภาษาอังกฤษให้เก่ง"), S("I'm going to save money for my trip.", "ฉันจะเก็บเงินไปเที่ยว"), S("What are you going to do this weekend?", "สุดสัปดาห์นี้คุณจะทำอะไร")] }
  ] },

/* ---------------------------------------------------------------- 22 */
{ id: "wh", title: "ถามให้เป็น", sub: "Wh-questions", emoji: "❓", color: "#c0392b", dark: "#8e2b20",
  intro: "คำถาม What, Where, When, Why, Who, How — ปลดล็อกการสนทนา",
  lessons: [
    { id: "wh1", title: "What / Where / Who", note: N("คำถาม Wh-", "<b>What</b> = อะไร · <b>Where</b> = ที่ไหน · <b>Who</b> = ใคร · <b>When</b> = เมื่อไหร่ · <b>Why</b> = ทำไม · <b>How</b> = อย่างไร<br>โครงสร้าง: <b>Wh-word + do/does/is/are + ประธาน + ...?</b>", [["What is your name?", "คุณชื่ออะไร"], ["Where do you live?", "คุณอาศัยอยู่ที่ไหน"]]), words: [
        W("What", "อะไร", "❔"), W("Where", "ที่ไหน", "📍"), W("Who", "ใคร", "🧑"), W("When", "เมื่อไหร่", "🕐"), W("Why", "ทำไม", "🤷"), W("How", "อย่างไร", "🛠️"), W("Which", "อันไหน", "👆"), W("Whose", "ของใคร", "🏷️")],
      sentences: [S("What do you do?", "คุณทำงานอะไร"), S("Where do you live?", "คุณอาศัยอยู่ที่ไหน"), S("Who is that man?", "ผู้ชายคนนั้นคือใคร")] },
    { id: "wh2", title: "When / Why / How", words: [], sentences: [
        S("When is your birthday?", "วันเกิดของคุณเมื่อไหร่"), S("Why are you late?", "ทำไมคุณมาสาย"), S("Because I missed the bus.", "เพราะฉันตกรถเมล์"), S("How do you go to work?", "คุณไปทำงานยังไง"), S("How are you feeling today?", "วันนี้คุณรู้สึกยังไงบ้าง"), S("Which one do you want?", "คุณต้องการอันไหน")] },
    { id: "wh3", title: "How much / How many", note: N("How much / How many", "<b>How much</b> + นามนับไม่ได้ / ราคา: How <b>much</b> water? · How <b>much</b> is it?<br><b>How many</b> + นามนับได้พหูพจน์: How <b>many</b> people?", [["How much is this shirt?", "เสื้อตัวนี้ราคาเท่าไหร่"], ["How many brothers do you have?", "คุณมีพี่น้องผู้ชายกี่คน"]]), words: [], sentences: [
        S("How much is this shirt?", "เสื้อตัวนี้ราคาเท่าไหร่"), S("How many brothers do you have?", "คุณมีพี่น้องผู้ชายกี่คน"), S("How long does it take?", "ใช้เวลานานเท่าไหร่"), S("How old is your sister?", "พี่สาวของคุณอายุเท่าไหร่"), S("How far is the station?", "สถานีไกลแค่ไหน")] }
  ] },

/* ---------------------------------------------------------------- 23 */
{ id: "real", title: "สถานการณ์จริง", sub: "Real-life English", emoji: "🌍", color: "#d35400", dark: "#9a3e00",
  intro: "ประโยคพร้อมใช้ในร้านอาหาร โรงแรม สนามบิน และโทรศัพท์",
  lessons: [
    { id: "real1", title: "ร้านอาหาร", words: [
        W("Menu", "เมนู", "📜"), W("Order", "สั่งอาหาร", "📝"), W("Bill", "ใบเสร็จ / บิล", "🧾"), W("Table for two", "โต๊ะสำหรับสองคน", "🍽️"), W("Spicy", "เผ็ด", "🌶️"), W("Delicious", "อร่อย", "😋"), W("Vegetarian", "มังสวิรัติ", "🥗"), W("Takeaway", "ซื้อกลับบ้าน", "🥡")],
      sentences: [S("A table for two, please.", "ขอโต๊ะสำหรับสองคนค่ะ/ครับ"), S("Can I see the menu?", "ขอดูเมนูหน่อยได้ไหม"), S("I would like the fried rice, please.", "ขอข้าวผัดหนึ่งที่"), S("Not too spicy, please.", "ไม่เผ็ดมากนะ"), S("Can we have the bill, please?", "ขอเช็คบิลด้วย")] },
    { id: "real2", title: "โรงแรม", words: [
        W("Reservation", "การจองห้อง", "📅"), W("Check in", "เช็คอิน", "🔑"), W("Check out", "เช็คเอาท์", "🚪"), W("Single room", "ห้องเดี่ยว", "🛏️"), W("Double room", "ห้องเตียงคู่", "🛌"), W("Wi-Fi", "ไวไฟ", "📶"), W("Towel", "ผ้าเช็ดตัว", "🧖"), W("Breakfast included", "รวมอาหารเช้า", "🥐")],
      sentences: [S("I have a reservation.", "ฉันจองห้องไว้แล้ว"), S("What time is check-out?", "เช็คเอาท์กี่โมง"), S("What is the Wi-Fi password?", "รหัสไวไฟคืออะไร"), S("The air conditioner doesn't work.", "แอร์ใช้ไม่ได้")] },
    { id: "real3", title: "สนามบิน", words: [
        W("Passport", "หนังสือเดินทาง", "🛂"), W("Boarding pass", "บัตรโดยสาร", "🎫"), W("Gate", "ประตูขึ้นเครื่อง", "🚪"), W("Flight", "เที่ยวบิน", "✈️"), W("Luggage", "สัมภาระ", "🧳"), W("Delay", "ล่าช้า", "⏳"), W("Customs", "ศุลกากร", "🛃"), W("Window seat", "ที่นั่งริมหน้าต่าง", "🪟")],
      sentences: [S("Here is my passport.", "นี่คือพาสปอร์ตของฉัน"), S("Where is gate 12?", "ประตู 12 อยู่ที่ไหน"), S("My flight is delayed.", "เที่ยวบินของฉันล่าช้า"), S("I would like a window seat.", "ขอที่นั่งริมหน้าต่างค่ะ/ครับ")] },
    { id: "real4", title: "โทรศัพท์ & พบปะ", words: [], sentences: [
        S("Hello, this is Somchai.", "สวัสดีครับ นี่สมชายนะครับ"), S("Can I speak to Mr. Smith?", "ขอสายคุณสมิธได้ไหม"), S("Could you repeat that, please?", "ช่วยพูดอีกครั้งได้ไหม"), S("Sorry, I didn't catch that.", "ขอโทษ ฉันฟังไม่ทัน"), S("Let's meet at five o'clock.", "นัดเจอกันห้าโมงเย็นนะ"), S("I'll call you back.", "เดี๋ยวฉันโทรกลับนะ")] }
  ] },

/* ---------------------------------------------------------------- 24 */
{ id: "sound", title: "ออกเสียงให้ชัด", sub: "Pronunciation for Thai speakers", emoji: "🎙️", color: "#6c5ce7", dark: "#4b3fc4",
  intro: "เสียงที่คนไทยมักพลาด: th, r/l, v/w, ชิป/ชีพ และเสียงท้ายคำ — ฟังแล้วแยกให้ออก",
  lessons: [
    { id: "sound1", title: "เสียง th", note: N("เสียง th", "เสียง <b>th</b> ไม่เหมือน ท/ส/ต: วางปลายลิ้น<b>ระหว่างฟัน</b>แล้วเป่าลมออก<br>think ≠ sink · three ≠ tree · thank ≠ tank<br>🎧 ฝึกฟังคู่เสียงด้านล่างทีละคู่", [["I think so.", "ฉันคิดอย่างนั้น"], ["Thank you very much.", "ขอบคุณมาก"]]), words: [
        W("Think", "คิด", "💭"), W("Sink", "อ่างล้างจาน", "🚰"), W("Three", "สาม", "3️⃣"), W("Tree", "ต้นไม้", "🌳"), W("Thank", "ขอบคุณ", "🙏"), W("Tank", "ถังน้ำ", "🛢️"), W("Mouth", "ปาก", "👄"), W("Mouse", "หนู", "🐭")],
      sentences: [S("Thank you very much.", "ขอบคุณมาก"), S("Three thin trees.", "ต้นไม้ผอมสามต้น")] },
    { id: "sound2", title: "เสียง r และ l", note: N("เสียง r / l", "<b>r</b> = ม้วนลิ้นขึ้นเล็กน้อยโดยไม่แตะเพดาน (ไม่รัวลิ้นแบบไทย) · <b>l</b> = ปลายลิ้นแตะเหงือกบน<br>right ≠ light · rice ≠ lice · road ≠ load", [["Turn right at the light.", "เลี้ยวขวาตรงไฟแดง"]]), words: [
        W("Right", "ขวา / ถูกต้อง", "➡️"), W("Light", "แสง / ไฟ", "💡"), W("Rice", "ข้าว", "🍚"), W("Lice", "เหา", "🐛"), W("Road", "ถนน", "🛣️"), W("Load", "บรรทุก", "📦"), W("Rock", "หิน", "🪨"), W("Lock", "ล็อก / กุญแจ", "🔒")],
      sentences: [S("The red light is on.", "ไฟแดงติดอยู่"), S("I really like rice.", "ฉันชอบข้าวจริง ๆ")] },
    { id: "sound3", title: "สระสั้น-ยาว & ch / sh", note: N("สระสั้น–ยาว และ ch / sh", "<b>ship</b> (สระสั้น ิ) ≠ <b>sheep</b> (สระยาว ี) · <b>sit</b> ≠ <b>seat</b><br><b>ch</b> = ช (chair, cheap) · <b>sh</b> = ชฺ แบบลมออก (share, sheet)", [["The sheep is on the ship.", "แกะอยู่บนเรือ"]]), words: [
        W("Ship", "เรือใหญ่", "🚢"), W("Sheep", "แกะ", "🐑"), W("Sit", "นั่ง", "🪑"), W("Seat", "ที่นั่ง", "💺"), W("Chair", "เก้าอี้", "🪑"), W("Share", "แบ่งปัน", "🤝"), W("Cheap", "ถูก", "🪙"), W("Sheet", "ผ้าปู / แผ่น", "🛏️")],
      sentences: [S("Please sit in this seat.", "เชิญนั่งที่นั่งนี้"), S("Can we share a table?", "เรานั่งโต๊ะร่วมกันได้ไหม")] },
    { id: "sound4", title: "เสียง v และ w", note: N("เสียง v / w", "<b>v</b> = ฟันบนกดริมฝีปากล่างแล้วมีเสียงสั่น (ไม่ใช่ ว) · <b>w</b> = ห่อปากกลมเหมือน ว<br>vest ≠ west · vine ≠ wine · very ≠ wary<br>💡 <b>เสียงท้ายคำ</b>: ออกเสียง -s, -t, -d ท้ายคำให้ชัด เช่น cat<b>s</b>, walk<b>ed</b>, bus<b>y</b>", [["I live in a very warm village.", "ฉันอยู่หมู่บ้านที่อบอุ่นมาก"]]), words: [
        W("Vest", "เสื้อกั๊ก", "🦺"), W("West", "ตะวันตก", "🧭"), W("Wine", "ไวน์", "🍷"), W("Vine", "เถาองุ่น", "🍇"), W("Very", "มาก", "💯"), W("Berry", "เบอร์รี", "🫐"), W("Van", "รถตู้", "🚐"), W("Wet", "เปียก", "💦")],
      sentences: [S("Very good!", "ดีมาก!"), S("The wine is very cold.", "ไวน์เย็นมาก")] }
  ] }
);
EE.rebuild();
})(window.EE);
