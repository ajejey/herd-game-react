import React from 'react';
import { motion } from 'framer-motion';

/*
  The "Soft Liquid" aura visual — layered blurred pastel blobs that slowly
  breathe and drift (lava-lamp / dreamcore). No SVG line-art, no stars: the aura
  IS the soft glowing light. Driven entirely by a two-stop pastel gradient.
*/
export default function AuraBlob({ from, to, size = 280, breathing = true, className = '' }) {
  const s = size;
  const blur = Math.round(size * 0.06);

  return (
    <div
      className={className}
      style={{ position: 'relative', width: s, height: s, margin: '0 auto' }}
      aria-hidden="true"
    >
      {/* ambient halo */}
      <motion.div
        style={{
          position: 'absolute', inset: '-12%', borderRadius: '50%',
          background: `radial-gradient(circle at 50% 45%, ${to}88, transparent 70%)`,
          filter: `blur(${blur * 1.6}px)`,
        }}
        animate={breathing ? { scale: [1, 1.08, 1], opacity: [0.7, 0.9, 0.7] } : {}}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* drifting satellite blob A */}
      <motion.div
        style={{
          position: 'absolute', width: '62%', height: '62%', borderRadius: '50%',
          left: '6%', top: '10%',
          background: `radial-gradient(circle at 40% 40%, ${from}, ${to})`,
          filter: `blur(${blur}px)`, mixBlendMode: 'multiply',
        }}
        animate={breathing ? { x: [0, 14, -6, 0], y: [0, -10, 8, 0] } : {}}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* drifting satellite blob B */}
      <motion.div
        style={{
          position: 'absolute', width: '58%', height: '58%', borderRadius: '50%',
          right: '4%', bottom: '8%',
          background: `radial-gradient(circle at 60% 40%, ${to}, ${from})`,
          filter: `blur(${blur}px)`, mixBlendMode: 'multiply',
        }}
        animate={breathing ? { x: [0, -12, 6, 0], y: [0, 8, -8, 0] } : {}}
        transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* core bloom */}
      <motion.div
        style={{
          position: 'absolute', inset: '22%', borderRadius: '50%',
          background: `radial-gradient(circle at 50% 42%, #ffffff, ${from} 45%, ${to})`,
          filter: `blur(${Math.round(blur * 0.5)}px)`,
          boxShadow: `0 0 ${size * 0.25}px ${to}66`,
        }}
        animate={breathing ? { scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}
