import Hero from '../components/Hero';
import BrandStrip from '../components/BrandStrip';
import Pillars from '../components/Pillars';
import OssatureBrands from '../components/OssatureBrands';
import OssatureStudy from '../components/OssatureStudy';
import About from '../components/About';
import Projects from '../components/Projects';
import News from '../components/News';
import CtaBand from '../components/CtaBand';

export default function Home() {
  return (
    <>
      <Hero />
      <BrandStrip />
      <Pillars />
      <OssatureBrands />
      <OssatureStudy />
      <About />
      <Projects />
      <News />
      <CtaBand />
    </>
  );
}
