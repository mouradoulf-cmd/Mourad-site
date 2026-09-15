import Reveal from "./Reveal";

const COURSES = [
  { n: "01", name: "Amuse-Bouche", desc: "A single bite to open the evening." },
  { n: "02", name: "Ocean", desc: "Seared scallop, citrus, sea foam." },
  { n: "03", name: "Garden", desc: "Heirloom vegetables, herb emulsion." },
  { n: "04", name: "Land", desc: "Duck breast, cherry, charred leek." },
  { n: "05", name: "Interlude", desc: "Basil sorbet, cucumber." },
  { n: "06", name: "Signature", desc: "Truffle wagyu, bone marrow jus." },
  { n: "07", name: "Finale", desc: "Dark chocolate, gold leaf, espresso." },
];

export default function TastingMenu() {
  const columns = [COURSES.slice(0, 3), COURSES.slice(3, 5), COURSES.slice(5)];

  return (
    <section id="tasting" className="bg-ink py-28">
      <div className="mx-auto max-w-[1280px] px-6 md:px-10">
        <Reveal className="mb-14 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-gold">Chef&apos;s Selection</p>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl">The Seven Course Tasting</h2>
        </Reveal>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {columns.map((col, ci) => (
            <Reveal key={ci} delay={ci * 0.15}>
              <div className="space-y-8 rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-md">
                {col.map((c) => (
                  <div key={c.n}>
                    <span className="font-serif text-2xl text-gold">{c.n}</span>
                    <h3 className="mt-2 font-serif text-xl">{c.name}</h3>
                    <p className="mt-1 text-sm font-light text-gray">{c.desc}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.3} className="mt-12 text-center">
          <p className="font-serif text-3xl text-gold">$185 per guest</p>
          <p className="mt-1 text-sm font-light text-gray">Wine pairing available, +$95</p>
        </Reveal>
      </div>
    </section>
  );
}
