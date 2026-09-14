import { Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import Nav from './components/Nav';
import Footer from './components/Footer';
import ScrollProgress from './components/ScrollProgress';
import BackToTop from './components/BackToTop';
import Home from './pages/Home';
import Equitone from './pages/Equitone';

export default function App() {
  return (
    <LanguageProvider>
      <div id="top" className="min-h-screen bg-void tracking-[-0.01em]" style={{ fontFamily: "'Inter', sans-serif" }}>
        <div className="ambient-orb" style={{ top: '10%', left: '-10%', width: '38vw', height: '38vw', background: '#e41959' }} />
        <div className="ambient-orb" style={{ bottom: '-10%', right: '-8%', width: '34vw', height: '34vw', background: '#f5b90f', animationDelay: '-16s', opacity: 0.08 }} />

        <ScrollProgress />
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/bardage/equitone" element={<Equitone />} />
        </Routes>
        <Footer />
        <BackToTop />
      </div>
    </LanguageProvider>
  );
}
