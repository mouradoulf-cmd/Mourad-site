import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import tectiva from '../assets/equitone/tectiva.jpg';
import linea from '../assets/equitone/linea.jpg';
import lunara from '../assets/equitone/lunara.jpg';
import natura from '../assets/equitone/natura.jpg';
import pictura from '../assets/equitone/pictura.jpg';
import textura from '../assets/equitone/textura.jpg';
import inspira from '../assets/equitone/inspira.jpg';

const SLIDES = [
  { name: 'Tectiva', img: tectiva, color: '#4fae8c' },
  { name: 'Linea', img: linea, color: '#f5b90f' },
  { name: 'Lunara', img: lunara, color: '#e41959' },
  { name: 'Natura', img: natura, color: '#4c96d1' },
  { name: 'Pictura', img: pictura, color: '#7d2a72' },
  { name: 'Textura', img: textura, color: '#4fae8c' },
  { name: 'Inspira', img: inspira, color: '#f5b90f' },
];

export default function EquitoneNewsThumb({ className = '' }: { className?: string }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => setI((v) => (v + 1) % SLIDES.length), 1900);
    return () => clearInterval(id);
  }, []);

  const slide = SLIDES[i];

  return (
    <div className={`relative overflow-hidden bg-void ${className}`} style={{ perspective: 600 }}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.img
          key={slide.name}
          src={slide.img}
          alt="EQUITONE"
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ rotateY: 75, opacity: 0, scale: 1.05 }}
          animate={{ rotateY: 0, opacity: 1, scale: 1 }}
          exit={{ rotateY: -75, opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformStyle: 'preserve-3d' }}
        />
      </AnimatePresence>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(5,8,13,0.75) 0%, rgba(5,8,13,0.1) 45%, transparent 70%)' }}
      />
      <span
        key={`label-${slide.name}`}
        className="absolute bottom-1.5 left-2 text-[10px] font-display uppercase tracking-wider text-white/90"
      >
        EQUITONE [{slide.name.toLowerCase()}]
      </span>
      <div className="absolute top-0 left-0 right-0 h-[2px] flex">
        {SLIDES.map((s, si) => (
          <span key={s.name} className="flex-1" style={{ background: si === i ? s.color : 'rgba(255,255,255,0.15)' }} />
        ))}
      </div>
    </div>
  );
}
