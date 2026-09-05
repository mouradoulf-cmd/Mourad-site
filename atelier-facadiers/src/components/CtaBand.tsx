export default function CtaBand() {
  return (
    <section id="contact" className="relative z-10 py-24 px-5 text-center">
      <div className="max-w-xl mx-auto glass-panel rounded-3xl p-10">
        <h2 className="text-3xl sm:text-4xl font-light text-white mb-4" style={{ textWrap: 'balance' }}>
          Un projet de bardage ? <span className="font-serif italic">Parlons-en.</span>
        </h2>
        <p className="text-white/60 mb-8">
          Notre équipe vous répond pour étudier votre chantier et vous proposer la solution la plus adaptée.
        </p>
        <a
          href="tel:0474173333"
          className="inline-flex bg-crimson hover:bg-[#c81450] text-white text-base font-medium px-9 py-4 rounded-full transition-all hover:scale-[1.03] active:scale-95 hover:shadow-lg hover:shadow-crimson/40"
        >
          04 74 17 33 33
        </a>
      </div>
    </section>
  );
}
