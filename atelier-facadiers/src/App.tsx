import { Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import Nav from './components/Nav';
import Footer from './components/Footer';
import Home from './pages/Home';
import Equitone from './pages/Equitone';

export default function App() {
  return (
    <LanguageProvider>
      <div id="top" className="min-h-screen bg-void tracking-[-0.01em]" style={{ fontFamily: "'Inter', sans-serif" }}>
        <div className="ambient-orb" style={{ top: '10%', left: '-10%', width: '38vw', height: '38vw', background: '#4c96d1' }} />
        <div className="ambient-orb" style={{ top: '55%', right: '-12%', width: '42vw', height: '42vw', background: '#e41959', animationDelay: '-8s' }} />
        <div className="ambient-orb" style={{ bottom: '-10%', left: '20%', width: '34vw', height: '34vw', background: '#7d2a72', animationDelay: '-16s' }} />

        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/bardage/equitone" element={<Equitone />} />
        </Routes>
        <Footer />
      </div>
    </LanguageProvider>
  );
}
