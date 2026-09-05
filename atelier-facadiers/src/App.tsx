import Nav from './components/Nav';
import Hero from './components/Hero';
import BrandStrip from './components/BrandStrip';
import Pillars from './components/Pillars';
import About from './components/About';
import Projects from './components/Projects';
import CtaBand from './components/CtaBand';
import Footer from './components/Footer';

export default function App() {
  return (
    <div id="top" className="min-h-screen bg-cream tracking-[-0.01em]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Nav />
      <Hero />
      <BrandStrip />
      <Pillars />
      <About />
      <Projects />
      <CtaBand />
      <Footer />
    </div>
  );
}
