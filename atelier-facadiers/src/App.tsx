import { LanguageProvider } from './context/LanguageContext';
import Nav from './components/Nav';
import Scene3D from './components/Scene3D';
import Hero from './components/Hero';
import BrandStrip from './components/BrandStrip';
import Pillars from './components/Pillars';
import About from './components/About';
import Projects from './components/Projects';
import CtaBand from './components/CtaBand';
import Footer from './components/Footer';

export default function App() {
  return (
    <LanguageProvider>
      <div id="top" className="min-h-screen bg-void tracking-[-0.01em]" style={{ fontFamily: "'Inter', sans-serif" }}>
        <Scene3D />
        <Nav />
        <Hero />
        <BrandStrip />
        <Pillars />
        <About />
        <Projects />
        <CtaBand />
        <Footer />
      </div>
    </LanguageProvider>
  );
}
