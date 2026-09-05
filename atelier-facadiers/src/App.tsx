import { LanguageProvider } from './context/LanguageContext';
import Nav from './components/Nav';
import Hero from './components/Hero';
import BrandStrip from './components/BrandStrip';
import Pillars from './components/Pillars';
import OssatureBrands from './components/OssatureBrands';
import OssatureStudy from './components/OssatureStudy';
import About from './components/About';
import Projects from './components/Projects';
import News from './components/News';
import CtaBand from './components/CtaBand';
import Footer from './components/Footer';

export default function App() {
  return (
    <LanguageProvider>
      <div id="top" className="min-h-screen bg-void tracking-[-0.01em]" style={{ fontFamily: "'Inter', sans-serif" }}>
        <div className="ambient-orb" style={{ top: '10%', left: '-10%', width: '38vw', height: '38vw', background: '#4c96d1' }} />
        <div className="ambient-orb" style={{ top: '55%', right: '-12%', width: '42vw', height: '42vw', background: '#e41959', animationDelay: '-8s' }} />
        <div className="ambient-orb" style={{ bottom: '-10%', left: '20%', width: '34vw', height: '34vw', background: '#7d2a72', animationDelay: '-16s' }} />

        <Nav />
        <Hero />
        <BrandStrip />
        <Pillars />
        <OssatureBrands />
        <OssatureStudy />
        <About />
        <Projects />
        <News />
        <CtaBand />
        <Footer />
      </div>
    </LanguageProvider>
  );
}
