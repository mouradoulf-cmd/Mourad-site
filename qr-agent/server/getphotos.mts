import fs from "node:fs";
import { findDishPhoto } from "./src/demo/photos.js";
const T: Record<string, string> = {
 borscht: "Borscht", stroganoff: "Beef Stroganoff", olivier: "Olivier salad", caesar: "Caesar salad", pelmeni: "Pelmeni", vareniki: "Vareniki", khinkali: "Khinkali", solyanka: "Solyanka",
 tomyam: "Tom yum", carbonara: "Spaghetti carbonara", bolognese: "Spaghetti bolognese", napoleon: "Napoleon cake", pancakes: "Blini pancakes", shuba: "Shuba salad", greek: "Greek salad",
 mimosa: "Mimosa salad", okroshka: "Okroshka", lula: "Lula kebab", shashlik: "Shashlik", duck: "Duck confit", tataki: "Tuna tataki", mussels: "Mussels cream", friedrice: "Fried rice",
 cappuccino: "Cappuccino", herring: "Salted herring", caprese: "Caprese salad", vinegret: "Vinaigrette salad russian", chickencutlet: "Chicken cutlet", ribs: "Pork ribs", lamb: "Rack of lamb", shrimps: "Garlic shrimp", noodles: "Fried noodles", mashed: "Mashed potatoes", fries: "French fries",
};
const out: Record<string, any> = {}; fs.mkdirSync("/tmp/pc/img", { recursive: true });
for (const [k, term] of Object.entries(T)) {
  try { const f = await findDishPhoto(term); if (f) { fs.writeFileSync(`/tmp/pc/img/${k}.jpg`, f.bytes); out[k] = { term, title: f.title, author: f.author, license: f.license, url: f.url }; console.log("OK ", k, f.title); } else console.log("no ", k); }
  catch (e: any) { console.log("ERR", k, e.message); }
}
fs.writeFileSync("/tmp/pc/credits.json", JSON.stringify(out, null, 1));
