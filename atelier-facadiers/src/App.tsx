import { LanguageProvider } from './context/LanguageContext';
import Nav from './components/Nav';
import Hero from './components/Hero';
import BrandStrip from './components/BrandStrip';
import Pillars from './components/Pillars';
import OssatureBrands from './components/OssatureBrands';
import About from './components/About';
import Projects from './components/Projects';
import CtaBand from './components/CtaBand';
import Footer from './components/Footer';

export default function App() {
  return (
    <LanguageProvider>
      <div id="top" className="min-h-screen bg-void tracking-[-0.01em]" style={{ fontFamily: "'Inter', sans-serif" }}>
        <Nav />
        <Hero />
        <BrandStrip />
        <Pillars />
        <OssatureBrands />
        <About />
        <Projects />
        <CtaBand />
        <Footer />
      </div>
    </LanguageProvider>
  );
}
