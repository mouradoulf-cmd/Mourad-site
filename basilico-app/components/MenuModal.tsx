"use client";

import { useEffect } from "react";

const MENU = {
  Starters: [
    ["Burrata & Heirloom Tomato", "$22"],
    ["Seared Scallops, Citrus Beurre Blanc", "$26"],
    ["Wild Mushroom Tartlet", "$19"],
    ["Tuna Crudo, Yuzu, Chili Oil", "$24"],
  ],
  Mains: [
    ["Truffle Wagyu Ribeye", "$68"],
    ["Roasted Duck Breast, Cherry Jus", "$44"],
    ["Pan-Seared Halibut, Saffron Broth", "$46"],
    ["Wild Mushroom Risotto", "$34"],
  ],
  Desserts: [
    ["Dark Chocolate Fondant", "$16"],
    ["Basil Panna Cotta", "$14"],
    ["Roasted Fig Tart", "$15"],
  ],
};

export default function MenuModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
      <div className="absolute inset-0 bg-[#070707]/85 backdrop-blur-md" onClick={onClose} />
      <div className="relative max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-white/10 bg-[#0d0d0d]/90 p-7 shadow-[0_0_60px_rgba(217,163,95,0.12)] md:p-12">
        <button
          onClick={onClose}
          aria-label="Close menu"
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-paper hover:border-gold/60 hover:text-gold"
          data-cursor-hover
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <p className="text-sm uppercase tracking-[0.3em] text-gold">The Full Menu</p>
        <h3 className="mt-2 font-serif text-3xl md:text-4xl">Basilico</h3>

        <div className="mt-8 space-y-10">
          {Object.entries(MENU).map(([cat, items]) => (
            <div key={cat}>
              <h4 className="mb-4 font-serif text-xl text-gold">{cat}</h4>
              <ul className="space-y-3">
                {items.map(([name, price]) => (
                  <li key={name} className="flex items-baseline gap-3">
                    <span className="font-light text-paper">{name}</span>
                    <span className="flex-1 border-b border-dashed border-white/20" />
                    <span className="text-gray">{price}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
