import { useEffect, useRef, useState, type ReactNode } from "react";

export const Btn = ({ kind = "ghost", ...p }: React.ButtonHTMLAttributes<HTMLButtonElement> & { kind?: "primary" | "ghost" | "danger" }) => <button {...p} className={`btn btn-${kind} ${p.className ?? ""}`} />;
export const Card = ({ children, className = "", style }: { children: ReactNode; className?: string; style?: React.CSSProperties }) => <div className={`card ${className}`} style={style}>{children}</div>;
export const Field = ({ label, children }: { label: string; children: ReactNode }) => <label className="block"><span className="label">{label}</span>{children}</label>;
export function Badge({ tone = "mute", children }: { tone?: "mute" | "accent" | "mint" | "amber" | "rose"; children: ReactNode }) {
  const t = { mute: "text-mute border-line bg-raise/60", accent: "text-accent border-accent/30 bg-accent/10", mint: "text-mint border-mint/30 bg-mint/10", amber: "text-amber border-amber/30 bg-amber/10", rose: "text-rose border-rose/30 bg-rose/10" }[tone];
  return <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold ${t}`}>{children}</span>;
}
export const statusTone = (s: string) => (["interested", "quote_sent", "client_won"].includes(s) ? "mint" : ["email_to_validate", "demo_ready"].includes(s) ? "accent" : ["do_not_contact", "client_lost", "not_contactable"].includes(s) ? "rose" : ["email_sent", "replied"].includes(s) ? "amber" : "mute") as any;
export function Score({ v }: { v: number | null }) {
  if (v == null) return <span className="text-mute mono text-sm">—</span>;
  const c = v >= 70 ? "#3ee0b0" : v >= 50 ? "#8b7bff" : v >= 30 ? "#f5b94a" : "#8b91a7";
  return <span className="inline-flex items-center gap-2"><span className="relative h-1.5 w-12 overflow-hidden rounded-full bg-white/10"><span className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${v}%`, background: c }} /></span><span className="mono text-sm font-semibold" style={{ color: c }}>{v}</span></span>;
}
export function Kpi({ label, value, sub, tone = "ink", i = 0 }: { label: string; value: ReactNode; sub?: ReactNode; tone?: string; i?: number }) {
  return <Card className="rise p-4" style={{ animationDelay: `${i * 40}ms` }}><div className="label">{label}</div><div className={`mono mt-1 text-3xl font-bold tracking-tight text-${tone}`}>{value}</div>{sub && <div className="mt-1 text-xs text-mute">{sub}</div>}</Card>;
}
export function Toast({ msg }: { msg: string | null }) { return <div role="status" aria-live="polite" className={`fixed bottom-20 left-1/2 z-50 -translate-x-1/2 rounded-xl border border-line bg-raise px-4 py-2 text-sm shadow-xl transition ${msg ? "opacity-100" : "pointer-events-none opacity-0"}`}>{msg}</div>; }
export function useToast() { const [m, setM] = useState<string | null>(null); const t = useRef<any>(0); return { msg: m, say: (s: string) => { setM(s); clearTimeout(t.current); t.current = setTimeout(() => setM(null), 3200); } }; }
export function Drawer({ open, onClose, children, title }: { open: boolean; onClose: () => void; children: ReactNode; title: string }) {
  useEffect(() => { const k = (e: KeyboardEvent) => e.key === "Escape" && onClose(); if (open) { addEventListener("keydown", k); document.body.style.overflow = "hidden"; } return () => { removeEventListener("keydown", k); document.body.style.overflow = ""; }; }, [open]);
  return <div className={`fixed inset-0 z-40 ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}><div onClick={onClose} className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition ${open ? "opacity-100" : "opacity-0"}`} /><aside role="dialog" aria-label={title} className={`absolute right-0 top-0 flex h-full w-full max-w-[760px] flex-col border-l border-line bg-[#0b0d14] shadow-2xl transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}><div className="flex items-center justify-between border-b border-line px-5 py-3"><h2 className="truncate text-lg font-bold">{title}</h2><Btn onClick={onClose} aria-label="Fermer">✕</Btn></div><div className="scroll-thin flex-1 overflow-y-auto p-5">{children}</div></aside></div>;
}
export function Spark({ data, keys }: { data: any[]; keys: { k: string; c: string; n: string }[] }) {
  const W = 640, H = 150, P = 6; const max = Math.max(1, ...data.flatMap((d) => keys.map((x) => d[x.k]))); const x = (i: number) => P + (i * (W - 2 * P)) / Math.max(1, data.length - 1); const y = (v: number) => H - P - (v / max) * (H - 2 * P - 8);
  return <div><svg viewBox={`0 0 ${W} ${H}`} className="h-40 w-full" role="img" aria-label="Activité sur 30 jours">{[0.25, 0.5, 0.75, 1].map((f) => <line key={f} x1={P} x2={W - P} y1={y(max * f)} y2={y(max * f)} stroke="rgba(255,255,255,.05)" />)}
    {keys.map((s) => { const pts = data.map((d, i) => `${x(i)},${y(d[s.k])}`); return <g key={s.k}><path d={`M${x(0)},${H - P} L${pts.join(" L")} L${x(data.length - 1)},${H - P} Z`} fill={s.c} opacity=".1" /><polyline points={pts.join(" ")} fill="none" stroke={s.c} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" /></g>; })}</svg>
    <div className="flex flex-wrap gap-4 text-xs text-mute">{keys.map((s) => <span key={s.k} className="inline-flex items-center gap-1.5"><i className="h-2 w-2 rounded-full" style={{ background: s.c }} />{s.n}</span>)}</div></div>;
}
