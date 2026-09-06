import CircularGallery from './CircularGallery.jsx';

import tectiva from '../assets/equitone/tectiva.jpg';
import linea from '../assets/equitone/linea.jpg';
import lunara from '../assets/equitone/lunara.jpg';
import natura from '../assets/equitone/natura.jpg';
import pictura from '../assets/equitone/pictura.jpg';
import textura from '../assets/equitone/textura.jpg';
import inspira from '../assets/equitone/inspira.jpg';

const ITEMS = [
  { image: tectiva, text: 'Tectiva' },
  { image: linea, text: 'Linea' },
  { image: lunara, text: 'Lunara' },
  { image: natura, text: 'Natura' },
  { image: pictura, text: 'Pictura' },
  { image: textura, text: 'Textura' },
  { image: inspira, text: 'Inspira' },
];

export default function EquitoneGammesGallery() {
  return (
    <div style={{ height: 'clamp(420px, 58vw, 620px)' }}>
      <CircularGallery
        items={ITEMS}
        bend={2.4}
        textColor="#ffffff"
        borderRadius={0.06}
        scrollEase={0.03}
        font="600 26px Rajdhani"
      />
    </div>
  );
}
