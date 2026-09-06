import CircularGallery from './CircularGallery.jsx';
import { BRAND_LOGOS } from '../assets/brandLogos';

const BRAND_NAMES = ['Fundermax', 'Trespa', 'PURA', 'EQUITONE', 'Cedral', 'Rockpanel', 'Stacbond', 'Alpolic', 'Fiberdeck'];

const ITEMS = BRAND_NAMES.map((name) => ({ image: BRAND_LOGOS[name], text: name }));

export default function BrandStripGallery() {
  return (
    <div style={{ height: 'clamp(440px, 48vw, 620px)' }}>
      <CircularGallery
        items={ITEMS}
        bend={1.1}
        textColor="#ffffff"
        borderRadius={0.08}
        scrollEase={0.035}
        font="700 34px Rajdhani"
        planeWidth={1000}
        planeHeight={420}
      />
    </div>
  );
}
