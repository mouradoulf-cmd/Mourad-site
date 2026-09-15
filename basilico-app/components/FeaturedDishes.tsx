"use client";

import { useState } from "react";
import Image from "next/image";
import Reveal from "./Reveal";
import MenuModal from "./MenuModal";

const DISHES = [
  {
    name: "Truffle Wagyu Ribeye",
    price: "$68",
    desc: "Black truffle jus, roasted bone marrow, confit shallot.",
    img: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Seared Scallops",
    price: "$26",
    desc: "Citrus beurre blanc, micro fennel, sea salt.",
    img: "https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Wild Mushroom Risotto",
    price: "$34",
    desc: "Aged parmesan, black truffle shavings, chive oil.",
    img: "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Dark Chocolate Fondant",
    price: "$16",
    desc: "Molten center, raspberry coulis, gold leaf.",
    img: "https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=800&auto=format&fit=crop",
  },
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

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {DISHES.map((d, i) => (
            <Reveal key={d.name} delay={i * 0.1}>
              <div className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image
                    src={d.img}
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
      </div>

      {open && <MenuModal onClose={() => setOpen(false)} />}
    </section>
  );
}
