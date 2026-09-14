import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronRight, ShieldCheck, FileText } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import Reveal from '../components/Reveal';
import TiltCard from '../components/TiltCard';
import EquitoneGammesGallery from '../components/EquitoneGammesGallery';

import heroImg from '../assets/equitone/hero.jpg';
import tergoDiagram from '../assets/equitone/tergo-diagram.png';

const COLORS = ['#e41959', '#f5b90f', '#e41959', '#e41959', '#e41959'];

export default function Equitone() {
  const { t } = useLanguage();

  return (
    <>
      <section className="relative w-full h-[70vh] min-h-[480px] overflow-hidden">
        <img src={heroImg} alt={t.equitone.caption} className="hero-video absolute inset-0 w-full h-full object-cover" />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(5,8,13,0.55) 0%, rgba(5,8,13,0.25) 40%, rgba(5,8,13,0.95) 100%)' }}
        />
        <div className="relative h-full flex flex-col items-center justify-end text-center px-5 pb-14 z-10">
          <span className="hero-anim hero-fade text-xs uppercase tracking-widest text-white/50 mb-3" style={{ animationDelay: '0.1s' }}>
            {t.equitone.caption}
          </span>
          <h1
            className="hero-anim hero-reveal font-display text-white text-5xl sm:text-7xl tracking-wide"
            style={{ animationDelay: '0.25s' }}
          >
            EQUITONE
          </h1>
          <p className="hero-anim hero-fade text-white/70 text-sm sm:text-base mt-2" style={{ animationDelay: '0.5s' }}>
            {t.equitone.tagline}
          </p>
        </div>
        <Link
          to="/"
          className="hero-anim hero-fade absolute top-5 left-5 sm:top-6 sm:left-8 z-20 inline-flex items-center gap-2 text-white/80 hover:text-white text-sm bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full px-4 py-2 transition-colors"
          style={{ animationDelay: '0.7s' }}
        >
          <ArrowLeft size={15} /> {t.equitone.backCta}
        </Link>
      </section>

      <section className="relative z-10 py-16 px-5 sm:px-8">
        <Reveal className="max-w-4xl mx-auto glass-panel rounded-3xl p-6 sm:p-10" style={{ borderTop: '2px solid #e41959' }}>
          {t.equitone.paragraphs.map((p) => (
            <p key={p.slice(0, 20)} className="text-white/70 leading-relaxed mb-4 text-sm sm:text-base last:mb-0">
              {p}
            </p>
          ))}
          <Link
            to="/"
            className="inline-flex mt-6 bg-crimson hover:bg-[#c81450] text-white text-sm font-medium px-7 py-3 rounded-full transition-all hover:scale-[1.03]"
          >
            {t.equitone.quoteCta}
          </Link>
        </Reveal>
      </section>

      <section className="relative z-10 pb-24">
        <Reveal className="max-w-6xl mx-auto px-5 sm:px-8 mb-4">
          <h2 className="text-2xl sm:text-3xl font-light text-white">{t.equitone.gammesHeading}</h2>
          <p className="text-white/40 text-xs mt-1">{t.equitone.gammesHint}</p>
        </Reveal>
        <Reveal className="w-full">
          <EquitoneGammesGallery />
        </Reveal>
      </section>

      <section className="relative z-10 pb-24 px-5 sm:px-8">
        <Reveal className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-light text-white mb-8">{t.equitone.dimensionsHeading}</h2>
          <div className="glass-panel rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-white/80 border-collapse min-w-[720px]">
                <thead>
                  <tr>
                    <th className="text-left px-5 py-4 sticky left-0 bg-[#0a0f17]">&nbsp;</th>
                    {t.equitone.dimensionsGroups.map((g, i) => (
                      <th
                        key={g}
                        className="px-5 py-4 text-center font-display uppercase text-xs tracking-wide whitespace-nowrap"
                        style={{ color: COLORS[i % COLORS.length] }}
                      >
                        {g}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {t.equitone.dimensionsRows.map((row) => (
                    <tr key={row.label} className="border-t border-white/10">
                      <td className="px-5 py-3 text-white/60 sticky left-0 bg-[#0a0f17] whitespace-nowrap">{row.label}</td>
                      {row.values.map((v, i) => (
                        <td key={i} className="px-5 py-3 text-center whitespace-nowrap">
                          {v}
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 pt-7 pb-2 text-xs uppercase tracking-widest font-semibold sticky left-0 bg-[#0a0f17]"
                      style={{ color: '#f5b90f' }}
                    >
                      {t.equitone.formatBrutHeading}
                    </td>
                  </tr>
                  {t.equitone.formatBrutRows.map((row) => (
                    <tr key={row.label} className="border-t border-white/10">
                      <td className="px-5 py-3 text-white/60 sticky left-0 bg-[#0a0f17] whitespace-nowrap">{row.label}</td>
                      {row.values.map((v, i) => (
                        <td key={i} className="px-5 py-3 text-center whitespace-nowrap">
                          {v}
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 pt-7 pb-2 text-xs uppercase tracking-widest font-semibold sticky left-0 bg-[#0a0f17]"
                      style={{ color: '#e41959' }}
                    >
                      {t.equitone.formatEquerreHeading}
                    </td>
                  </tr>
                  {t.equitone.formatEquerreRows.map((row) => (
                    <tr key={row.label} className="border-t border-white/10">
                      <td className="px-5 py-3 text-white/60 sticky left-0 bg-[#0a0f17] whitespace-nowrap">{row.label}</td>
                      {row.values.map((v, i) => (
                        <td key={i} className="px-5 py-3 text-center whitespace-nowrap">
                          {v}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="relative z-10 pb-24 px-5 sm:px-8">
        <Reveal className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl sm:text-3xl font-light text-white mb-1">{t.equitone.systemsHeading}</h2>
            <div className="w-16 h-[2px] mb-6" style={{ background: '#e41959' }} />
            <span className="block text-xs uppercase tracking-widest mb-1" style={{ color: '#e41959' }}>
              {t.equitone.fixationLabel}
            </span>
            <h3 className="font-display uppercase text-xl text-white mb-4">{t.equitone.tergoLabel}</h3>
            {t.equitone.systemsParagraphs.map((p) => (
              <p key={p.slice(0, 20)} className="text-white/70 text-sm leading-relaxed mb-4 last:mb-0">
                {p}
              </p>
            ))}
            <div className="flex flex-wrap gap-2 mt-5">
              {t.equitone.systemsBadges.map((b) => (
                <span
                  key={b}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-white/80 bg-white/10 border border-white/15 rounded-full px-3 py-1.5"
                >
                  <ShieldCheck size={13} style={{ color: '#e41959' }} /> {b}
                </span>
              ))}
            </div>
          </div>
          <TiltCard className="bg-white rounded-2xl p-4 sm:p-6" style={{ borderTop: '3px solid #e41959' }}>
            <img src={tergoDiagram} alt={t.equitone.tergoLabel} className="w-full h-auto rounded-lg" draggable={false} />
          </TiltCard>
        </Reveal>
      </section>

      <section className="relative z-10 pb-24 px-5 sm:px-8">
        <Reveal className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-light text-white mb-8">{t.equitone.documentationHeading}</h2>
          <div
            className="glass-panel rounded-2xl px-6 py-5 flex items-center justify-between gap-4 flex-wrap"
            style={{ borderTop: '2px solid #e41959' }}
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <FileText size={20} className="text-white/70" />
              </div>
              <span className="font-display uppercase text-sm sm:text-base text-white tracking-wide">
                {t.equitone.brochureLabel}
              </span>
            </div>
            <Link
              to="/#contact"
              className="inline-flex items-center gap-2 text-sm font-medium text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-full px-5 py-2.5 transition-colors"
            >
              {t.equitone.brochureCta} <ChevronRight size={15} />
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
