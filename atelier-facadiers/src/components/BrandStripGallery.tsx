import CircularGallery from './CircularGallery.jsx';
import { BRAND_LOGOS } from '../assets/brandLogos';

const BRAND_NAMES = ['Fundermax', 'Trespa', 'PURA', 'EQUITONE', 'Cedral', 'Rockpanel', 'Stacbond', 'Alpolic', 'Fiberdeck'];

const ITEMS = BRAND_NAMES.map((name) => ({ image: BRAND_LOGOS[name], text: name }));

export default function BrandStripGallery() {
  return (
    <div style={{ height: 'clamp(220px, 26vw, 300px)' }}>
      <CircularGallery
        items={ITEMS}
        bend={1.4}
        textColor="#ffffff"
        borderRadius={0.08}
        scrollEase={0.035}
        font="600 22px Rajdhani"
        planeWidth={980}
        planeHeight={340}
      />
    </div>
  );
}
