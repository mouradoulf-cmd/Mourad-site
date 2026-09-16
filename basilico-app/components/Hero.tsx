"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const WORDS = ["Crafting", "Exceptional", "Culinary", "Experiences"];
const HERO_VIDEO = "https://strvid.nyc3.cdn.digitaloceanspaces.com/motionsite/hero_food_video.mp4";

export default function Hero() {
  const wordsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const fadeRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      gsap.set(wordsRef.current, { opacity: 1, y: 0 });
      gsap.set(fadeRef.current, { opacity: 1, y: 0 });
      gsap.set(cueRef.current, { opacity: 1 });
      return;
    }

    const tl = gsap.timeline({ delay: 0.2 });
    tl.fromTo(
      wordsRef.current,
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.4, ease: "power4.out", stagger: 0.14 }
    ).fromTo(
      fadeRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out" },
      "-=0.6"
    ).fromTo(
      cueRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1 },
      "-=0.4"
    );

    if (cardRef.current) {
      gsap.to(cardRef.current, {
        y: 18,
        duration: 2.6,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    }
  }, []);

  return (
    <section id="top" className="relative flex min-h-[100svh] items-center overflow-hidden pt-28">
      <div className="absolute inset-0 -z-20 overflow-hidden">
        <video
          className="hero-bg-video h-full w-full object-cover opacity-80"
          autoPlay
          loop
          muted
          playsInline
          src={HERO_VIDEO}
        />
      </div>
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 30%, #070707 100%), linear-gradient(90deg, rgba(7,7,7,0.7), transparent 55%)",
        }}
      />

      <div className="mx-auto grid w-full max-w-[1280px] grid-cols-1 items-center gap-12 px-6 md:px-10 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <p className="mb-5 text-sm font-light uppercase tracking-[0.3em] text-gray">Fine Dining · Est. Contemporary</p>
          <h1 className="font-serif font-medium leading-[1.05] text-[42px] sm:text-[54px] md:text-[62px] lg:text-[50px] xl:text-[62px]">
            <span className="block overflow-hidden">
              <span ref={(el) => { wordsRef.current[0] = el; }} className="inline-block">
                {WORDS[0]}
              </span>
            </span>
            <span className="block overflow-hidden">
              <span ref={(el) => { wordsRef.current[1] = el; }} className="gold-text inline-block">
                {WORDS[1]}
              </span>
            </span>
            <span className="block overflow-hidden">
              <span ref={(el) => { wordsRef.current[2] = el; }} className="inline-block">
                {WORDS[2]}
              </span>{" "}
              <span className="block overflow-hidden">
                <span ref={(el) => { wordsRef.current[3] = el; }} className="inline-block">
                  {WORDS[3]}
                </span>
              </span>
            </span>
          </h1>

          <div ref={fadeRef} className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#reservations"
              className="rounded-full bg-gold px-7 py-3 text-sm font-medium text-ink transition-transform hover:-translate-y-0.5"
              data-cursor-hover
            >
              Reserve a Table
            </a>
            <a
              href="#dishes"
              className="rounded-full border border-white/15 bg-white/5 px-7 py-3 text-sm text-paper backdrop-blur-md transition-colors hover:border-gold/60"
              data-cursor-hover
            >
              View Menu
            </a>
          </div>
        </div>

        <div ref={cardRef} className="relative mx-auto w-full max-w-[450px] lg:mx-0 lg:justify-self-end">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-white/10 shadow-[0_0_40px_rgba(217,163,95,0.15)]">
            <video
              className="h-full w-full object-cover"
              autoPlay
              loop
              muted
              playsInline
              src={HERO_VIDEO}
            />
            <div className="absolute inset-x-4 bottom-4 rounded-xl border border-white/10 bg-[#070707]/50 px-4 py-3 backdrop-blur-md">
              <p className="text-xs uppercase tracking-wide text-gray">Chef&apos;s Special</p>
              <p className="font-serif text-lg text-paper">Truffle Wagyu Ribeye</p>
            </div>
          </div>
        </div>
      </div>

      <div
        ref={cueRef}
        className="absolute inset-x-0 bottom-8 hidden flex-col items-center gap-2 opacity-0 sm:flex"
      >
        <span className="text-[11px] uppercase tracking-[0.3em] text-gray">Scroll</span>
        <span className="h-10 w-px overflow-hidden bg-white/15">
          <span className="hero-cue-line block h-full w-full bg-gold" />
        </span>
      </div>
    </section>
  );
}
