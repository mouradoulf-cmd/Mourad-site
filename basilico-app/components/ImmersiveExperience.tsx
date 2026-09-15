"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Reveal from "./Reveal";
import { withBasePath } from "@/lib/basePath";

export default function ImmersiveExperience() {
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !imgRef.current) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.to(imgRef.current, {
        yPercent: 15,
        ease: "none",
        scrollTrigger: {
          trigger: imgRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section className="relative overflow-hidden bg-ink py-28">
      <div className="mx-auto max-w-[1280px] px-6 md:px-10">
        <Reveal className="mb-12 max-w-xl">
          <p className="text-sm uppercase tracking-[0.3em] text-gold">The Experience</p>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl">
            Private Dining &amp; a Cellar Worth Lingering In
          </h2>
          <p className="mt-6 font-light leading-relaxed text-gray">
            From an intimate chef&apos;s table to a private room for twelve, every space at
            Basilico is designed to slow time down — candlelight, low music, and a wine
            cellar holding over 400 labels.
          </p>
        </Reveal>

        <div className="relative aspect-[16/9] overflow-hidden rounded-3xl border border-white/10">
          <div ref={imgRef} className="absolute inset-0 -top-[8%] h-[116%] w-full">
            <Image
              src={withBasePath("/images/giulivo/terrazza-tavoli.jpg")}
              alt="Basilico private dining room"
              fill
              className="object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
        </div>
      </div>
    </section>
  );
}
