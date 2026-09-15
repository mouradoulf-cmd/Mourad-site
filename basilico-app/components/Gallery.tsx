import Image from "next/image";
import Reveal from "./Reveal";

const IMAGES = [
  { src: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?q=80&w=800&auto=format&fit=crop", span: "row-span-2" },
  { src: "https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=800&auto=format&fit=crop", span: "" },
  { src: "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=800&auto=format&fit=crop", span: "" },
  { src: "https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=800&auto=format&fit=crop", span: "row-span-2" },
  { src: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?q=80&w=800&auto=format&fit=crop", span: "" },
  { src: "https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=800&auto=format&fit=crop", span: "" },
];

export default function Gallery() {
  return (
    <section id="gallery" className="bg-ink py-28">
      <div className="mx-auto max-w-[1280px] px-6 md:px-10">
        <Reveal className="mb-14">
          <p className="text-sm uppercase tracking-[0.3em] text-gold">Visual Story</p>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl">Gallery</h2>
        </Reveal>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:[grid-auto-rows:220px]">
          {IMAGES.map((img, i) => (
            <Reveal key={i} delay={i * 0.06} className={img.span}>
              <div className="relative h-full min-h-[160px] w-full overflow-hidden rounded-2xl border border-white/10">
                <Image src={img.src} alt="" fill className="object-cover transition-transform duration-700 hover:scale-110" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
