"use client";

import { useState } from "react";
import Image from "next/image";
import Reveal from "./Reveal";
import MenuModal from "./MenuModal";
import { withBasePath } from "@/lib/basePath";

const DISHES = [
  {
    name: "Tartare di Manzo",
    price: "$24",
    desc: "Hand-cut beef tartare, cured egg yolk, slate presentation.",
    img: "/images/giulivo/tartare.jpg",
  },
  {
    name: "Linguine ai Frutti di Mare",
    price: "$38",
    desc: "Linguine, clams, mussels, prawns, white wine.",
    img: "/images/giulivo/linguine-frutti-di-mare.jpg",
  },
  {
    name: "Tonno in Crosta di Pistacchio",
    price: "$42",
    desc: "Pistachio-crusted tuna, seared rare, citrus salad.",
    img: "/images/giulivo/tonno-pistacchio.jpg",
  },
  {
    name: "Antipasto Misto",
    price: "$28",
    desc: "Tuna tartare, breaded fish, chef's mixed antipasti board.",
    img: "/images/giulivo/antipasto-misto.jpg",
  },
  {
    name: "Tortellini, Panna e Speck",
    price: "$32",
    desc: "House-made tortellini, cream, crisp speck.",
    img: "/images/giulivo/tortellini-panna-speck.jpg",
  },
  {
    name: "Piatto Signature",
    price: "$58",
    desc: "Chef's signature plate, market catch, natural presentation.",
    img: "/images/giulivo/piatto-signature.jpg",
  },
  {
    name: "Tavola da Condividere",
    price: "$65",
    desc: "Sharing table, chef's selection for the table.",
    img: "/images/giulivo/table-partage.jpg",
  },
  {
    name: "Panna Cotta ai Frutti di Bosco",
    price: "$14",
    desc: "House-made panna cotta, wild berry compote.",
    img: "/images/giulivo/panna-cotta.jpg",
  },
  {
    name: "Panna Cotta al Bicchiere",
    price: "$14",
    desc: "Panna cotta in a glass, dessert wine pairing.",
    img: "/images/giulivo/panna-cotta-verre.jpg",
  },
];

const TERRACE = [
  { img: "/images/giulivo/terrazza-ulivo.jpg", alt: "A corner under the century-old olive tree" },
  { img: "/images/giulivo/terrazza-pergola.jpg", alt: "The pergola over the terrace" },
  { img: "/images/giulivo/terrazza-tavoli.jpg", alt: "Tables set on the terrace" },
  { img: "/images/giulivo/terrazza-veranda.jpg", alt: "The veranda at sunset" },
  { img: "/images/giulivo/terrazza-vista.jpg", alt: "The view from the terrace" },
];

export default function FeaturedDishes() {
  const [open, setOpen] = useState(false);

  return (
    <section id="dishes" className="relative bg-ink py-28">
      <div className="mx-auto max-w-[1280px] px-6 md:px-10">
        <Reveal className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-gold">Signature Plates</p>
            <h2 className="mt-3 font-serif text-4xl md:text-5xl">Featured Dishes</h2>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="rounded-full border border-gold/60 px-6 py-3 text-sm text-gold transition-colors hover:bg-gold hover:text-ink"
            data-cursor-hover
          >
            View Full Menu
          </button>
        </Reveal>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {DISHES.map((d, i) => (
            <Reveal key={d.name} delay={(i % 3) * 0.1}>
              <div className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image
                    src={withBasePath(d.img)}
                    alt={d.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-serif text-lg">{d.name}</h3>
                    <span className="text-gold">{d.price}</span>
                  </div>
                  <p className="mt-2 text-sm font-light text-gray">{d.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-20 mb-8">
          <p className="text-sm uppercase tracking-[0.3em] text-gold">The Terrace</p>
          <h3 className="mt-3 font-serif text-3xl md:text-4xl">La Terrazza</h3>
        </Reveal>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {TERRACE.map((t, i) => (
            <Reveal key={t.img} delay={(i % 5) * 0.08}>
              <div className="group relative aspect-square overflow-hidden rounded-xl border border-white/10">
                <Image
                  src={withBasePath(t.img)}
                  alt={t.alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {open && <MenuModal onClose={() => setOpen(false)} />}
    </section>
  );
}
