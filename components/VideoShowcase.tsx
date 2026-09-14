import React, { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'motion/react';
import { Link } from 'react-router-dom';
import { HOTEL_STORIES } from '../data/hotels';
import { useSiteContent } from '../src/lib/content';

/** Los cuatro hoteles con los que se ejemplifica el bloque -- los mismos
 *  cuatro que pidió Mayurlin por nombre (Ritz-Carlton, GPRO, InterContinental,
 *  Deltapark). El botón de cada tarjeta ya lleva a su portafolio real. */
const FEATURED_IDS = ['ritz-carlton-abama', 'hotel-danieli-venezia', 'aman-venice', 'hotel-caruso-belmond'];

/** Posición final de cada tarjeta (% del viewport), asimétrica y a distinta
 *  altura -- calcada del boceto: dos arriba (una más alta que la otra), dos
 *  abajo, ninguna alineada con su pareja. Mismos porcentajes en móvil y
 *  escritorio: lo que cambia de tamaño es la tarjeta, no su ubicación. */
const POSITIONS: { left: number; top: number }[] = [
  { left: 22, top: 24 }, // arriba-izquierda
  { left: 68, top: 16 }, // arriba-derecha, más alta
  { left: 20, top: 64 }, // abajo-izquierda
  { left: 72, top: 70 }, // abajo-derecha, más baja
];

const PlayIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M8 5v14l11-7z" />
  </svg>
);

/** `useTransform(progress, [a,b], [from,to])` (la forma de arrays) no pinta
 *  bien la opacidad en este entorno: el valor interno queda correcto pero lo
 *  que se dibuja en pantalla no, y sigue cambiando pasado el límite en vez de
 *  quedarse fijo. La forma con función (recalcular a mano en cada frame) sí
 *  pinta bien -- por eso toda opacidad de esta sección pasa por aquí en vez
 *  de por `useTransform` con arrays. */
function useLinearOpacity(progress: MotionValue<number>, start: number, end: number, from: number, to: number) {
  return useTransform(() => {
    const t = Math.min(1, Math.max(0, (progress.get() - start) / (end - start)));
    return from + (to - from) * t;
  });
}

interface VerticalCardProps {
  hotelId: string;
  hotelName: string;
  index: number;
  scrollYProgress: MotionValue<number>;
}

/** Las cuatro tarjetas arrancan superpuestas en el centro -- con la misma
 *  posición y escala, así que aunque las cuatro estén montadas se leen como
 *  una sola -- y el scroll las separa hacia su lugar final. Nunca se
 *  desmontan: es el propio scroll el que las mueve, hacia abajo las reparte,
 *  hacia arriba las vuelve a juntar. */
const VerticalCard: React.FC<VerticalCardProps> = ({ hotelId, hotelName, index, scrollYProgress }) => {
  const pos = POSITIONS[index];
  const start = 0.14 + index * 0.03;
  const end = start + 0.36;

  const left = useTransform(scrollYProgress, [start, end], ['50%', `${pos.left}%`]);
  const top = useTransform(scrollYProgress, [start, end], ['50%', `${pos.top}%`]);
  const scale = useTransform(scrollYProgress, [start, end], [0.86, 1]);
  const opacity = useLinearOpacity(scrollYProgress, 0.08, 0.14, 0, 1);

  return (
    <motion.div
      style={{ left, top, x: '-50%', y: '-50%', scale, opacity }}
      className="absolute z-10 aspect-[9/16] w-[30vw] max-w-[150px] sm:w-[24vw] sm:max-w-[190px] md:max-w-[220px]"
    >
      <div className="relative h-full w-full overflow-hidden rounded-[8px] bg-[#1a1918] shadow-2xl md:rounded-[10px]">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/95 shadow-lg sm:h-12 sm:w-12 md:h-14 md:w-14">
            <PlayIcon className="h-3.5 w-3.5 translate-x-[1px] text-[#1a1918] sm:h-5 sm:w-5" />
          </span>
        </div>
        <div className="absolute inset-x-0 bottom-0 flex justify-center p-2 sm:p-3 md:p-4">
          <Link
            to={`/trabajo/${hotelId}`}
            className="mt-glass mt-glass-light relative overflow-hidden rounded-md px-2.5 py-1.5 text-center text-[8px] font-serif font-medium leading-tight tracking-[0.1em] text-[#1a1918] transition-all duration-300 hover:bg-[#1a1918] hover:text-[#f5f3ed] sm:px-4 sm:py-2 sm:text-[11px] sm:tracking-[0.15em] md:text-xs"
          >
            {hotelName}
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

/** Sección "El hotel en movimiento" (pág. 9 de la auditoría). Un vídeo
 *  horizontal a pantalla completa (sin margen, 16:9) que se reproduce solo al
 *  llegar; al seguir bajando, se difumina como el cristal de los modales y
 *  encima se reparten cuatro vídeos verticales -- arrancan superpuestos en
 *  el centro (se leen como uno) y el scroll los separa a su lugar. Subir
 *  invierte la animación. Misma mecánica en móvil, solo con tarjetas más
 *  chicas -- nunca una vertical a pantalla completa. */
export const VideoShowcase: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { hotels: hotelContent } = useSiteContent();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const stories = FEATURED_IDS.map((id) => {
    const idx = HOTEL_STORIES.findIndex((s) => s.id === id);
    const base = HOTEL_STORIES[idx];
    return { id, hotelName: hotelContent[idx]?.hotelName ?? base.hotelName };
  });

  const headingOpacity = useLinearOpacity(scrollYProgress, 0, 0.1, 1, 0);
  const blurPx = useTransform(scrollYProgress, [0.1, 0.42], [0, 16]);
  const filter = useTransform(blurPx, (b) => `blur(${b}px)`);
  const veilOpacity = useLinearOpacity(scrollYProgress, 0.1, 0.42, 0, 0.45);
  const bgIconOpacity = useLinearOpacity(scrollYProgress, 0.04, 0.16, 1, 0);

  return (
    <section ref={containerRef} className="relative w-full bg-[#1a1918]" style={{ height: '280vh' }}>
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        {/* Vídeo horizontal: placeholder oscuro a sangre completa, sin margen. */}
        <motion.div style={{ filter }} className="absolute inset-0 bg-[#1a1918]" />
        <motion.div style={{ opacity: bgIconOpacity }} className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 shadow-lg md:h-20 md:w-20">
            <PlayIcon className="h-6 w-6 translate-x-[2px] text-[#1a1918] md:h-7 md:w-7" />
          </span>
        </motion.div>

        {/* Velo que sube junto con el desenfoque, igual que detrás de las
            ventanas emergentes: sostiene la lectura de las tarjetas sin
            apagar del todo el vídeo de fondo. */}
        <motion.div style={{ opacity: veilOpacity }} className="pointer-events-none absolute inset-0 bg-black" />

        <motion.h2
          style={{ opacity: headingOpacity }}
          className="pointer-events-none absolute inset-x-0 top-[14%] z-20 text-center font-serif text-4xl text-white md:text-6xl"
        >
          El hotel en movimiento
        </motion.h2>

        {stories.map((story, i) => (
          <VerticalCard
            key={story.id}
            hotelId={story.id}
            hotelName={story.hotelName}
            index={i}
            scrollYProgress={scrollYProgress}
          />
        ))}
      </div>
    </section>
  );
};
