const BRANDS = ['Trespa', 'EQUITONE', 'Fundermax', 'Stacbond', 'Rockpanel'];

export default function BrandStrip() {
  const track = [...BRANDS, ...BRANDS];
  return (
    <div className="py-8 border-b border-navy/10 overflow-hidden">
      <div
        className="flex gap-10 w-max"
        style={{ animation: 'scrollMarquee 26s linear infinite' }}
      >
        {track.map((b, i) => (
          <span key={`${b}-${i}`} className="font-serif italic text-xl sm:text-2xl text-slate whitespace-nowrap">
            {b}
          </span>
        ))}
      </div>
      <style>{`
        @keyframes scrollMarquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
