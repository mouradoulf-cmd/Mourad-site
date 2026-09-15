"use client";

import { useState } from "react";
import Reveal from "./Reveal";

const QUOTES = [
  {
    text: "Basilico doesn't just serve food — it composes it. Every course felt inevitable, like it couldn't have been any other way.",
    author: "Eleanor Voss",
    role: "The Gourmet Review",
  },
  {
    text: "The wagyu ribeye alone justifies the reservation wait. This is confident, unhurried cooking.",
    author: "Marcus Iyer",
    role: "City Table Magazine",
  },
  {
    text: "A rare kitchen that trusts silence between flavors. Basilico is one of the year's most complete rooms.",
    author: "Sofia Renaud",
    role: "Plate & Province",
  },
];

export default function Testimonials() {
  const [i, setI] = useState(0);
  const go = (dir: number) => setI((v) => (v + dir + QUOTES.length) % QUOTES.length);

  return (
    <section className="bg-ink py-28">
      <div className="mx-auto max-w-[1280px] px-6 md:px-10">
        <Reveal className="mb-14 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-gold">In the Press</p>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl">What Critics Say</h2>
        </Reveal>

        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="font-serif text-2xl leading-relaxed text-paper md:text-3xl">
            &ldquo;{QUOTES[i].text}&rdquo;
          </p>
          <p className="mt-6 text-gold">{QUOTES[i].author}</p>
          <p className="text-sm font-light text-gray">{QUOTES[i].role}</p>

          <div className="mt-10 flex items-center justify-center gap-6">
            <button
              onClick={() => go(-1)}
              aria-label="Previous"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 hover:border-gold/60 hover:text-gold"
              data-cursor-hover
            >
              ←
            </button>
            <div className="flex gap-2">
              {QUOTES.map((_, idx) => (
                <span
                  key={idx}
                  className={`h-1.5 w-1.5 rounded-full ${idx === i ? "bg-gold" : "bg-white/20"}`}
                />
              ))}
            </div>
            <button
              onClick={() => go(1)}
              aria-label="Next"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 hover:border-gold/60 hover:text-gold"
              data-cursor-hover
            >
              →
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
