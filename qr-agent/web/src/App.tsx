import { useEffect, useState } from "react";
import { api, ApiError } from "./api";
import { Btn, Card, Field, Toast, useToast, Badge } from "./ui";
import { Dashboard, Prospects } from "./pages1";
import { Crm, Emails, Demos, Reports } from "./pages2";
import { Automations, Agents, Connections, Compliance } from "./pages3";

const NAV: [string, string, string][] = [["dashboard", "Tableau de bord", "◧"], ["prospects", "Prospects", "◎"], ["crm", "CRM", "▤"], ["emails", "Emails", "✉"], ["demos", "Démonstrations", "▣"], ["auto", "Automatisations", "⟳"], ["agents", "Agents IA", "✦"], ["connect", "Connexions API", "⌁"], ["legal", "Conformité", "⚖"], ["reports", "Rapports", "☰"]];
const useHash = () => { const [h, setH] = useState(location.hash.slice(2) || "dashboard"); useEffect(() => { const f = () => setH(location.hash.slice(2) || "dashboard"); addEventListener("hashchange", f); return () => removeEventListener("hashchange", f); }, []); return h; };

function Login({ onOk }: { onOk: () => void }) {
  const [email, setEmail] = useState(""); const [password, setPw] = useState(""); const [err, setErr] = useState("");
  const go = async (e: React.FormEvent) => { e.preventDefault(); setErr(""); try { await api("/api/login", { method: "POST", body: { email, password } }); onOk(); } catch (x) { setErr(x instanceof ApiError && x.status === 429 ? "Trop d'essais. Réessayez dans 15 minutes." : "Identifiants incorrects."); } };
  return <main className="grid min-h-full place-items-center p-4"><form onSubmit={go} className="card rise w-full max-w-sm space-y-4 p-7"><div><div className="text-xs font-bold uppercase tracking-[.2em] text-accent">QR Business</div><h1 className="mt-1 text-2xl font-extrabold">Agent commercial</h1><p className="mt-1 text-sm text-mute">Connexion propriétaire</p></div>
    <Field label="Email"><input className="input" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required /></Field>
    <Field label="Mot de passe"><input className="input" type="password" autoComplete="current-password" value={password} onChange={(e) => setPw(e.target.value)} required /></Field>
    {err && <p role="alert" className="text-sm text-rose">{err}</p>}<Btn kind="primary" className="w-full" type="submit">Se connecter</Btn></form></main>;
}

export default function App() {
  const [auth, setAuth] = useState<boolean | null>(null); const [sys, setSys] = useState<any>(null); const page = useHash(); const [menu, setMenu] = useState(false); const toast = useToast();
  const load = () => api("/api/session").then(async (r) => { if (!r.auth) return setAuth(false); setSys(await api("/api/system")); setAuth(true); }).catch(() => setAuth(false));
  useEffect(() => { load(); }, []);
  if (auth === null) return <div className="grid h-full place-items-center text-mute">Chargement…</div>;
  if (!auth) return <Login onOk={load} />;
  const P = { say: toast.say, sys, reload: load };
  const view = { dashboard: <Dashboard {...P} />, prospects: <Prospects {...P} />, crm: <Crm {...P} />, emails: <Emails {...P} />, demos: <Demos {...P} />, auto: <Automations {...P} />, agents: <Agents {...P} />, connect: <Connections {...P} />, legal: <Compliance {...P} />, reports: <Reports {...P} /> }[page] ?? <Dashboard {...P} />;
  const live = sys?.email?.live;
  return <div className="flex h-full">
    <aside className={`fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-line bg-[#090a10]/95 backdrop-blur transition-transform lg:static lg:translate-x-0 ${menu ? "translate-x-0" : "-translate-x-full"}`}>
      <div className="px-5 pb-3 pt-6"><div className="text-[10px] font-bold uppercase tracking-[.25em] text-accent">NM Studio</div><div className="text-lg font-extrabold leading-tight">QR Business<br /><span className="text-mute">AI Agent</span></div></div>
      <nav className="scroll-thin flex-1 space-y-0.5 overflow-y-auto px-3 py-2" aria-label="Navigation principale">{NAV.map(([id, label, ic]) => <a key={id} href={`#/${id}`} onClick={() => setMenu(false)} aria-current={page === id ? "page" : undefined} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${page === id ? "bg-accent/15 text-ink shadow-[inset_2px_0_0_#8b7bff]" : "text-mute hover:bg-raise hover:text-ink"}`}><span className="w-5 text-center text-base opacity-80">{ic}</span>{label}</a>)}</nav>
      <div className="space-y-2 border-t border-line p-4 text-xs"><div className="flex items-center justify-between"><span className="text-mute">IA</span><Badge tone={sys?.ai.configured ? "mint" : "amber"}>{sys?.ai.configured ? "Claude actif" : "modèles fixes"}</Badge></div><div className="flex items-center justify-between"><span className="text-mute">Emails</span><Badge tone={live ? "rose" : "mint"}>{live ? "ENVOI RÉEL" : "mode test"}</Badge></div>
        <button className="text-mute underline" onClick={async () => { await api("/api/logout", { method: "POST" }); setAuth(false); }}>Se déconnecter</button></div>
    </aside>
    {menu && <div className="fixed inset-0 z-20 bg-black/60 lg:hidden" onClick={() => setMenu(false)} />}
    <div className="flex min-w-0 flex-1 flex-col"><header className="flex items-center justify-between gap-3 border-b border-line bg-bg/70 px-4 py-3 backdrop-blur lg:hidden"><Btn onClick={() => setMenu(true)} aria-label="Menu">☰</Btn><div className="text-sm font-bold">{NAV.find((n) => n[0] === page)?.[1]}</div><Badge tone={live ? "rose" : "mint"}>{live ? "réel" : "test"}</Badge></header>
      <main className="scroll-thin flex-1 overflow-y-auto px-4 pb-24 pt-5 lg:px-8 lg:pt-8"><div className="mx-auto max-w-[1200px]">{view}</div></main></div>
    <Toast msg={toast.msg} /></div>;
}
