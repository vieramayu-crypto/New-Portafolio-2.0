import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

interface FlipWordsProps {
  words: string[];
  className?: string;
  intervalMs?: number;
}

export const FlipWords: React.FC<FlipWordsProps> = ({ words, className = '', intervalMs = 2400 }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [words.length, intervalMs]);

  return (
    <span className={`inline-block relative ${className}`}>
      {/* LA KEY ES LA LISTA ENTERA, NO SÓLO LA PALABRA A LA VISTA.
          Al cambiar de idioma, `AnimatePresence` sacaba la palabra anterior con
          su medio segundo de salida -- y esa palabra era la del idioma viejo,
          así que durante ese rato se leía "Photography, film and Dirección".
          Cambiando la key, React tira el bloque entero y monta el nuevo: no
          queda nada del idioma anterior que animar. */}
      <AnimatePresence mode="wait" key={words.join('|')}>
        <motion.span
          key={words[index]}
          initial={{ opacity: 0, y: 8, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -8, filter: 'blur(8px)' }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="inline-block"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};
