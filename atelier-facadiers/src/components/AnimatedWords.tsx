import { motion } from 'framer-motion';
import { useInView } from '../hooks/useInView';

export default function AnimatedWords({ text, delayOffset = 0 }: { text: string; delayOffset?: number }) {
  const { ref, inView } = useInView<HTMLSpanElement>(0.4);
  const words = text.split(' ');

  return (
    <span ref={ref} style={{ perspective: 700 }}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} style={{ display: 'inline-block', overflow: 'hidden', paddingBottom: '0.08em' }}>
          <motion.span
            style={{ display: 'inline-block', transformOrigin: '50% 100%' }}
            initial={{ opacity: 0, rotateX: -100, y: '55%' }}
            animate={inView ? { opacity: 1, rotateX: 0, y: '0%' } : undefined}
            transition={{ duration: 0.75, delay: delayOffset + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </span>
  );
}
