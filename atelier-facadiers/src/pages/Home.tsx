import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '../components/Hero';
import ArchitectureScene from '../components/ArchitectureScene';
import BrandStrip from '../components/BrandStrip';
import Pillars from '../components/Pillars';
import OssatureBrands from '../components/OssatureBrands';
import OssatureStudy from '../components/OssatureStudy';
import About from '../components/About';
import Projects from '../components/Projects';
import News from '../components/News';
import CtaBand from '../components/CtaBand';

export default function Home() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;
    const el = document.querySelector(location.hash);
    if (el) requestAnimationFrame(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  }, [location.hash, location.key]);

  return (
    <>
      <Hero />
      <ArchitectureScene />
      <Pillars />
      <OssatureStudy />
      <About />
      <Projects />
      <News />
      <BrandStrip />
      <OssatureBrands />
      <CtaBand />
    </>
  );
}
