import fs from "node:fs";
import { findDishPhoto } from "./src/demo/photos.js";
const T: Record<string, string> = {
 borscht: "Borscht", stroganoff: "Beef Stroganoff", olivier: "Olivier salad", caesar: "Caesar salad", pelmeni: "Pelmeni", vareniki: "Varenyky", khinkali: "Khinkali", solyanka: "Solyanka soup",
 tomyam: "Tom yum goong", carbonara: "Spaghetti carbonara", bolognese: "Spaghetti bolognese", napoleon: "Napoleon cake", blini: "Blini", shuba: "Shuba salad", greek: "Greek salad",
 mimosa: "Mimosa salad", okroshka: "Okroshka", lula: "Lula kebab", shashlik: "Shashlik", duck: "Duck confit", tataki: "Tuna tataki", mussels: "Steamed mussels", friedrice: "Japanese fried rice",
 cappuccino: "Cappuccino", herring: "Herring onion", caprese: "Caprese salad", vinegret: "Vinegret", chickencutlet: "Chicken Kiev", ribs: "Pork ribs", lamb: "Rack of lamb", shrimps: "Garlic prawns", noodles: "Yakisoba", mashed: "Mashed potatoes", fries: "French fries",
 salo: "Salo", caviar: "Red caviar", salmon: "Grilled salmon", tuna: "Tuna steak", mackerel: "Grilled mackerel", seabass: "Grilled sea bass", squid: "Grilled squid", wings: "Chicken wings", legs: "Chicken drumsticks", cowboy: "Pork steak",
 tongue: "Beef tongue", seafoodpasta: "Seafood pasta", pasta: "Penne pasta", avocado: "Avocado shrimp salad", seafoodsalad: "Seafood salad", icecream: "Ice cream", cakepop: "Cake pops", medovik: "Medovik", espresso: "Espresso",
 americano: "Americano coffee", latte: "Caffe latte", cocoa: "Hot chocolate", orange: "Orange juice", mango: "Mango smoothie", coco: "Coconut water", soda: "Italian soda", cola: "Coca-Cola", beer: "Beer glass", buckwheat: "Buckwheat", rice: "Steamed rice",
 olives: "Olives", pickles: "Pickled cucumbers", eggplant: "Eggplant rolls", pate: "Chicken liver pate", fruit: "Fruit platter", tea: "Black tea", kvass: "Kvass", mors: "Mors berry drink", prawns: "Prawns cream sauce", ponzu: "Tuna salad", nuggets: "Chicken nuggets",
};
const done = fs.existsSync("/tmp/pc/credits2.json") ? JSON.parse(fs.readFileSync("/tmp/pc/credits2.json", "utf8")) : {};
fs.mkdirSync("/tmp/pc/img2", { recursive: true });
for (const [k, term] of Object.entries(T)) {
  if (done[k]) continue;
  try { const f = await findDishPhoto(term, 1600); if (f) { fs.writeFileSync(`/tmp/pc/img2/${k}.jpg`, f.bytes); done[k] = { term, title: f.title, author: f.author, license: f.license, url: f.url }; console.log("OK ", k, "|", f.title); } else console.log("no ", k); }
  catch (e: any) { console.log("ERR", k, e.message); }
  fs.writeFileSync("/tmp/pc/credits2.json", JSON.stringify(done, null, 1));
}
console.log("FINISHED");
