"use client";

import Reveal from "./Reveal";

export default function Reservations() {
  return (
    <section id="reservations" className="relative overflow-hidden bg-ink py-28">
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(217,163,95,0.35), transparent 70%)" }}
      />
      <div className="relative mx-auto max-w-2xl px-6 md:px-10">
        <Reveal className="mb-10 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-gold">Book a Table</p>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl">Reservations</h2>
        </Reveal>

        <Reveal
          delay={0.1}
          className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md shadow-[0_0_40px_rgba(217,163,95,0.1)] md:p-10"
        >
          <form
            className="grid grid-cols-1 gap-5 sm:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              alert("Demo form — no reservation was actually sent.");
            }}
          >
            <label className="flex flex-col gap-2 text-sm text-gray">
              Name
              <input
                type="text"
                required
                placeholder="Your name"
                className="rounded-lg border border-white/15 bg-[#121212] px-4 py-3 text-paper outline-none focus:border-gold/60"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm text-gray">
              Phone
              <input
                type="tel"
                required
                placeholder="Phone number"
                className="rounded-lg border border-white/15 bg-[#121212] px-4 py-3 text-paper outline-none focus:border-gold/60"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm text-gray">
              Date
              <input
                type="date"
                required
                className="rounded-lg border border-white/15 bg-[#121212] px-4 py-3 text-paper outline-none focus:border-gold/60"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm text-gray">
              Time
              <select className="rounded-lg border border-white/15 bg-[#121212] px-4 py-3 text-paper outline-none focus:border-gold/60">
                {["18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00"].map((t) => (
                  <option key={t} value={t} className="bg-[#121212]">
                    {t}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-2 text-sm text-gray">
              Guests
              <select className="rounded-lg border border-white/15 bg-[#121212] px-4 py-3 text-paper outline-none focus:border-gold/60">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <option key={n} value={n} className="bg-[#121212]">
                    {n} {n === 1 ? "guest" : "guests"}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-2 text-sm text-gray sm:col-span-2">
              Special Requests
              <textarea
                rows={3}
                placeholder="Allergies, occasion, seating preference..."
                className="resize-none rounded-lg border border-white/15 bg-[#121212] px-4 py-3 text-paper outline-none focus:border-gold/60"
              />
            </label>

            <button
              type="submit"
              className="mt-2 rounded-full bg-gold px-7 py-3 text-sm font-medium text-ink transition-transform hover:-translate-y-0.5 sm:col-span-2"
              data-cursor-hover
            >
              Confirm Reservation
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
