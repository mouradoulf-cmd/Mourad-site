import Image from "next/image";
import Reveal from "./Reveal";

export default function About() {
  return (
    <section id="about" className="bg-ink py-28">
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-14 px-6 md:px-10 lg:grid-cols-2">
        <Reveal>
          <p className="text-sm uppercase tracking-[0.3em] text-gold">Our Story</p>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl">A Vision Rooted in Craft</h2>
          <p className="mt-6 max-w-lg font-light leading-relaxed text-gray">
            Basilico was born from a simple belief: that a dish, like a story, should be
            told with patience and precision. Every plate is composed from ingredients
            sourced within a day&apos;s drive, shaped by classical technique and a quiet
            sense of place.
          </p>
          <p className="mt-4 max-w-lg font-light leading-relaxed text-gray">
            Chef Alexander Thorne leads a kitchen built on restraint — letting the
            ingredient, not the plate, take the final bow.
          </p>
          <p className="mt-10 font-serif text-4xl italic text-gray/80">Alexander Thorne</p>
          <p className="text-sm font-light text-gray/60">Executive Chef &amp; Founder</p>
        </Reveal>

        <Reveal delay={0.15} className="relative mx-auto aspect-square w-full max-w-md">
          <div className="absolute -inset-4 rounded-full bg-gold/10 blur-2xl" />
          <div className="relative h-full w-full overflow-hidden rounded-full border border-white/10">
            <Image
              src="https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=800&auto=format&fit=crop"
              alt="Chef Alexander Thorne"
              fill
              className="object-cover"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
