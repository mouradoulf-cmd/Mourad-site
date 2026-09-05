import { Boxes, ClipboardCheck, Truck, Ruler, LifeBuoy } from 'lucide-react';

const PILLARS = [
  {
    icon: Boxes,
    color: '#4fae8c',
    title: 'Stock',
    text: 'Un stock permanent des principales gammes de bardage pour livrer vos chantiers sans attendre.',
  },
  {
    icon: ClipboardCheck,
    color: '#f5b90f',
    title: 'Préconisation',
    text: "Un accompagnement technique pour choisir le bon matériau, la bonne pose, la bonne finition.",
  },
  {
    icon: Truck,
    color: '#e41959',
    title: 'Logistique',
    text: 'Une organisation pensée pour livrer au bon endroit, au bon moment, sans casse ni retard.',
  },
  {
    icon: Ruler,
    color: '#4c96d1',
    title: 'Usinage',
    text: 'Découpe et façonnage sur-mesure des panneaux selon les plans de votre chantier.',
  },
  {
    icon: LifeBuoy,
    color: '#7d2a72',
    title: 'Service technique',
    text: 'Un support réactif avant, pendant et après le chantier pour sécuriser votre mise en œuvre.',
  },
];

export default function Pillars() {
  return (
    <section id="services" className="py-24 px-5 sm:px-8 bg-cream">
      <div className="max-w-3xl mx-auto text-center mb-14">
        <h2 className="text-3xl sm:text-5xl font-light text-navy" style={{ textWrap: 'balance' }}>
          Cinq métiers, les cinq couleurs de notre <span className="font-serif italic">enseigne</span>
        </h2>
      </div>
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-4 sm:gap-5">
        {PILLARS.map(({ icon: Icon, color, title, text }) => (
          <div
            key={title}
            className="bg-white rounded-2xl p-6 flex flex-col gap-4 transition-transform hover:-translate-y-1 hover:shadow-lg"
            style={{ boxShadow: '0 1px 2px rgba(28,58,82,0.06)' }}
          >
            <span
              className="inline-flex items-center justify-center w-11 h-11 rounded-full"
              style={{ backgroundColor: `${color}1a`, color }}
              aria-hidden="true"
            >
              <Icon size={20} strokeWidth={1.75} />
            </span>
            <h3 className="text-base font-semibold text-navy">{title}</h3>
            <p className="text-sm leading-relaxed text-slate">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
