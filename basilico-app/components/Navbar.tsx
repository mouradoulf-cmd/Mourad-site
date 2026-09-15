"use client";

import { useState } from "react";

const LINKS = [
  { href: "#dishes", label: "Menu" },
  { href: "#about", label: "About" },
  { href: "#tasting", label: "Tasting" },
  { href: "#gallery", label: "Gallery" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto max-w-[1280px] px-6 py-4 md:px-10">
        <div className="flex items-center justify-between rounded-full border border-white/10 bg-[#070707]/50 px-5 py-3 backdrop-blur-md shadow-[0_0_30px_rgba(217,163,95,0.08)]">
          <a href="#top" className="font-serif text-xl tracking-wide text-paper" data-cursor-hover>
            Basilico
          </a>

          <nav className="hidden items-center gap-8 text-sm font-light text-gray md:flex">
            {LINKS.map((l) => (
              <a key={l.href} href={l.href} className="transition-colors hover:text-gold" data-cursor-hover>
                {l.label}
              </a>
            ))}
          </nav>

          <a
            href="#reservations"
            className="hidden rounded-full border border-gold/60 px-5 py-2 text-sm text-gold transition-colors hover:bg-gold hover:text-ink md:inline-block"
            data-cursor-hover
          >
            Reserve Table
          </a>

          <button
            className="text-paper md:hidden"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>

        {open && (
          <div className="mt-3 flex flex-col gap-4 rounded-2xl border border-white/10 bg-[#070707]/80 p-6 backdrop-blur-md md:hidden">
            {LINKS.map((l) => (
              <a key={l.href} href={l.href} className="text-gray hover:text-gold" onClick={() => setOpen(false)}>
                {l.label}
              </a>
            ))}
            <a
              href="#reservations"
              className="mt-2 rounded-full border border-gold/60 px-5 py-2 text-center text-sm text-gold"
              onClick={() => setOpen(false)}
            >
              Reserve Table
            </a>
          </div>
        )}
      </div>
    </header>
  );
}
