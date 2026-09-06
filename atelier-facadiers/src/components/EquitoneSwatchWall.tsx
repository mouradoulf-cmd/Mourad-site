import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import tectiva from '../assets/equitone/tectiva.jpg';
import linea from '../assets/equitone/linea.jpg';
import lunara from '../assets/equitone/lunara.jpg';
import natura from '../assets/equitone/natura.jpg';
import pictura from '../assets/equitone/pictura.jpg';
import textura from '../assets/equitone/textura.jpg';
import inspira from '../assets/equitone/inspira.jpg';

const SWATCHES = [tectiva, linea, lunara, natura, pictura, textura, inspira];
const CELL_COUNT = 12;
const COLORS = ['#4fae8c', '#f5b90f', '#e41959', '#4c96d1', '#7d2a72'];

function Cell({ cellIndex }: { cellIndex: number }) {
  const [i, setI] = useState((cellIndex * 3) % SWATCHES.length);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const delay = 1400 + ((cellIndex * 547) % 1700);
    const id = setInterval(() => setI((v) => (v + 1) % SWATCHES.length), delay);
    return () => clearInterval(id);
  }, [cellIndex]);

  const flipAxis: 'rotateX' | 'rotateY' = cellIndex % 2 === 0 ? 'rotateY' : 'rotateX';
  const color = COLORS[(cellIndex + i) % COLORS.length];

  return (
    <div className="relative overflow-hidden" style={{ perspective: 500 }}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.img
          key={i}
          src={SWATCHES[i]}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ [flipAxis]: 90, opacity: 0 }}
          animate={{ [flipAxis]: 0, opacity: 1 }}
          exit={{ [flipAxis]: -90, opacity: 0 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformStyle: 'preserve-3d' }}
        />
      </AnimatePresence>
      <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: `inset 0 0 0 1px ${color}55` }} />
    </div>
  );
}

export default function EquitoneSwatchWall({ label = 'Nouvelle gamme EQUITONE [inspira]' }: { label?: string }) {
  return (
    <div className="relative w-full h-full bg-void">
      <div className="grid grid-cols-4 sm:grid-cols-6 grid-rows-2 gap-[2px] w-full h-full">
        {Array.from({ length: CELL_COUNT }).map((_, idx) => (
          <Cell key={idx} cellIndex={idx} />
        ))}
      </div>
      <div
        className="absolute inset-x-0 bottom-0 p-6 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 55%, transparent 100%)' }}
      >
        <span className="text-white text-sm font-medium font-display uppercase tracking-wide">{label}</span>
      </div>
    </div>
  );
}
