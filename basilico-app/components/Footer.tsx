"use client";

export default function Footer() {
  return (
    <footer id="contact" className="border-t border-white/10 bg-ink py-16">
      <div className="mx-auto max-w-[1280px] px-6 md:px-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <p className="font-serif text-2xl">Basilico</p>
            <p className="mt-3 max-w-sm text-sm font-light text-gray">
              A contemporary fine-dining room built on classical technique, seasonal
              ingredients, and quiet confidence.
            </p>
          </div>
          <div>
            <p className="text-sm uppercase tracking-widest text-gray/70">Contact</p>
            <ul className="mt-4 space-y-2 text-sm font-light text-gray">
              <li>12 Riverside Lane, Downtown</li>
              <li>
                <a href="tel:+15551234567" target="_blank" rel="noopener" className="hover:text-gold">
                  +1 (555) 123-4567
                </a>
              </li>
              <li>hello@basilico.demo</li>
            </ul>
          </div>
          <div>
            <p className="text-sm uppercase tracking-widest text-gray/70">Newsletter</p>
            <form
              className="mt-4 flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                alert("Demo form — no email was actually sent.");
              }}
            >
              <input
                type="email"
                required
                placeholder="Email address"
                className="w-full min-w-0 rounded-full border border-white/15 bg-[#121212] px-4 py-2.5 text-sm text-paper outline-none focus:border-gold/60"
              />
              <button className="shrink-0 rounded-full border border-gold/60 px-4 py-2.5 text-sm text-gold hover:bg-gold hover:text-ink">
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="mt-14 border-t border-white/10 pt-6 text-center text-xs font-light text-gray/50">
          © 2026 Basilico — Demo site. Fictional restaurant, sample menu and content.
        </div>
      </div>
    </footer>
  );
}
