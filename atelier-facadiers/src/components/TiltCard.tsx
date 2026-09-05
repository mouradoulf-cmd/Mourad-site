import { useRef, type ReactNode } from 'react';

export default function TiltCard({
  children,
  className = '',
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${-py * 16}deg) rotateY(${px * 16}deg) translateY(-6px) scale(1.03)`;
    if (glareRef.current) {
      glareRef.current.style.opacity = '1';
      glareRef.current.style.background = `radial-gradient(circle at ${(px + 0.5) * 100}% ${(py + 0.5) * 100}%, rgba(255,255,255,0.22), transparent 55%)`;
    }
  }

  function onMouseLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.transform = 'perspective(900px) rotateX(0) rotateY(0) translateY(0) scale(1)';
    if (glareRef.current) glareRef.current.style.opacity = '0';
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={`relative ${className}`}
      style={{ transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1)', willChange: 'transform', ...style }}
    >
      {children}
      <div
        ref={glareRef}
        className="pointer-events-none absolute inset-0 rounded-[inherit]"
        style={{ opacity: 0, transition: 'opacity 0.3s ease' }}
        aria-hidden="true"
      />
    </div>
  );
}
