import { describe, it, expect, beforeEach } from "vitest";
import { titleMatches, keywords, findDishPhoto, findHero, setFetcherForPhotos } from "../src/demo/photos.js";

const bytes = new Uint8Array(20_000).fill(7);
function mock(files: Record<string, { w?: number; h?: number; license?: string }>) {
  setFetcherForPhotos((async (u: any) => {
    const url = String(u);
    if (url.includes("generator=search")) { const pages: any = {}; Object.entries(files).forEach(([t, f], i) => (pages[i] = { title: t, imageinfo: [{ width: f.w ?? 2000, height: f.h ?? 1500, mime: "image/jpeg" }] })); return new Response(JSON.stringify({ query: { pages } })); }
    if (url.includes("extmetadata")) { const t = decodeURIComponent(new URL(url).searchParams.get("titles")!); return new Response(JSON.stringify({ query: { pages: { 1: { imageinfo: [{ descriptionurl: "https://commons.wikimedia.org/wiki/" + t, extmetadata: { LicenseShortName: { value: files[t]?.license ?? "CC BY-SA 4.0" }, Artist: { value: "<a>Jane</a>" } } }] } } } })); }
    return new Response(bytes, { headers: { "content-type": "image/jpeg" } });
  }) as any);
}
beforeEach(() => mock({}));
describe("title matching is strict (never a close-enough picture of another dish)", () => {
  it("keywords drop short and filler words", () => expect(keywords("Pizza aux quatre fromages")).toEqual(["pizza", "quatre", "fromages"]));
  it("needs the dish's own words in the photo title", () => {
    expect(titleMatches("File:Pizza Margherita.jpg", "Pizza Margherita")).toBe(true);
    expect(titleMatches("File:Pizza oven at a bakery.jpg", "Pizza Margherita")).toBe(false);
    expect(titleMatches("File:Blue Hawaii (album).jpg", "Tiramisu")).toBe(false);
    expect(titleMatches("File:Tiramisu 001.jpg", "Tiramisu")).toBe(true);
  });
});
describe("finders", () => {
  it("returns a photo with author and licence when title, size and licence all pass", async () => {
    mock({ "File:Spaghetti carbonara plate.jpg": {} }); const f = await findDishPhoto("Spaghetti carbonara"); expect(f).toMatchObject({ license: "CC BY-SA 4.0", author: "Jane", title: "Spaghetti carbonara plate.jpg" }); expect(f!.bytes.length).toBeGreaterThan(8000);
  });
  it("refuses wrong dish, small images, NC/ND licences and logos", async () => {
    mock({ "File:Lasagne al forno.jpg": {} }); expect(await findDishPhoto("Spaghetti carbonara")).toBeNull();
    mock({ "File:Spaghetti carbonara.jpg": { w: 500, h: 400 } }); expect(await findDishPhoto("Spaghetti carbonara")).toBeNull();
    mock({ "File:Spaghetti carbonara.jpg": { license: "CC BY-NC 4.0" } }); expect(await findDishPhoto("Spaghetti carbonara")).toBeNull();
    mock({ "File:Spaghetti carbonara logo.jpg": {} }); expect(await findDishPhoto("Spaghetti carbonara")).toBeNull();
  });
  it("hero must be a wide venue photograph", async () => {
    mock({ "File:Trattoria interior Roma.jpg": { w: 3000, h: 2000 } }); expect((await findHero("italian"))?.title).toContain("Trattoria");
    mock({ "File:Trattoria interior Roma.jpg": { w: 1200, h: 2000 } }); expect(await findHero("italian")).toBeNull();
    mock({ "File:Cat on a sofa.jpg": { w: 3000, h: 2000 } }); expect(await findHero("italian")).toBeNull();
  });
});
