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
const TICK_MS = 180;
const COLORS = ['#4fae8c', '#f5b90f', '#e41959', '#4c96d1', '#7d2a72'];

function Cell({ cellIndex, tick, reduced }: { cellIndex: number; tick: number; reduced: boolean }) {
  const [i, setI] = useState((cellIndex * 3) % SWATCHES.length);
  const isMyTurn = tick % CELL_COUNT === cellIndex;

  useEffect(() => {
    if (reduced || !isMyTurn || tick === 0) return;
    setI((v) => (v + 1) % SWATCHES.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick]);

  const flipAxis: 'rotateX' | 'rotateY' = cellIndex % 2 === 0 ? 'rotateY' : 'rotateX';
  const color = COLORS[(cellIndex + i) % COLORS.length];
  const active = isMyTurn && !reduced;

  return (
    <div className="relative overflow-hidden" style={{ perspective: 500 }}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.img
          key={i}
          src={SWATCHES[i]}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ [flipAxis]: 100, opacity: 0, scale: 1.15 }}
          animate={{ [flipAxis]: 0, opacity: 1, scale: 1 }}
          exit={{ [flipAxis]: -100, opacity: 0, scale: 1.15 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformStyle: 'preserve-3d' }}
        />
      </AnimatePresence>
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-300"
        style={{
          boxShadow: active ? `inset 0 0 0 2px ${color}, 0 0 18px 2px ${color}99` : `inset 0 0 0 1px rgba(255,255,255,0.08)`,
        }}
      />
    </div>
  );
}

export default function EquitoneSwatchWall({ label = 'Nouvelle gamme EQUITONE [inspira]' }: { label?: string }) {
  const [tick, setTick] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    if (mq.matches) return;
    const id = setInterval(() => setTick((t) => t + 1), TICK_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative w-full h-full bg-void">
      <div className="grid grid-cols-4 sm:grid-cols-6 grid-rows-2 gap-[2px] w-full h-full">
        {Array.from({ length: CELL_COUNT }).map((_, idx) => (
          <Cell key={idx} cellIndex={idx} tick={tick} reduced={reduced} />
        ))}
      </div>
      <div
        className="absolute inset-x-0 bottom-0 p-6 pointer-events-none flex items-center gap-2"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 55%, transparent 100%)' }}
      >
        {!reduced && (
          <span className="relative flex h-2 w-2">
            <span
              className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
              style={{ background: COLORS[tick % COLORS.length] }}
            />
            <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: COLORS[tick % COLORS.length] }} />
          </span>
        )}
        <span className="text-white text-sm font-medium font-display uppercase tracking-wide">{label}</span>
      </div>
    </div>
  );
}
