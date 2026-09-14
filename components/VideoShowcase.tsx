import React, { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'motion/react';
import { Link } from 'react-router-dom';
import { HOTEL_STORIES } from '../data/hotels';
import { useSiteContent, publicImage } from '../src/lib/content';

/** Los cuatro hoteles con los que se ejemplifica el bloque -- los mismos
 *  cuatro que pidió Mayurlin por nombre (Ritz-Carlton, GPRO, InterContinental,
 *  Deltapark). El botón de cada tarjeta ya lleva a su portafolio real. */
const FEATURED_IDS = ['ritz-carlton-abama', 'gpro-valparaiso', 'intercontinental-lisboa', 'deltapark-vitalresort'];

/** Foto real de la web como fondo -- mientras no haya vídeo, es la única
 *  forma de ver que el desenfoque funciona (difuminar un color plano no se
 *  nota). Sustituir por el vídeo horizontal cuando Mayurlin lo entregue. */
const BG_PLACEHOLDER = publicImage('sec6-gal01-fachada-noche-h.jpg');

interface CardSpec {
  left: number; // % del viewport
  top: number; // % del viewport
}

/** Posiciones calcadas de los recuadros que Mayurlin dibujó sobre la web ya
 *  publicada, medidas una a una y luego repartidas con márgenes simétricos.
 *
 *  Escritorio: las cuatro en FILA, no en cuadrícula -- repartidas de
 *  izquierda a derecha y cada una a distinta altura (zigzag), que es lo que
 *  decía el boceto original ("uno más abajo de otro", "de forma simétrica").
 *  Margen lateral idéntico a izquierda y derecha, y la misma separación
 *  entre tarjeta y tarjeta.
 *
 *  Móvil: dos columnas, la izquierda siempre más alta que la derecha.
 *
 *  El tamaño se define por ALTO (svh), no por ancho: con `aspect-[9/16]` el
 *  ancho sale solo, y así el alto de la tarjeta ocupa siempre la misma
 *  fracción de pantalla -- que es lo que decide si algo se sale por arriba o
 *  por abajo. Con el ancho en `vw` una pantalla ancha hacía la tarjeta
 *  altísima y se salía. */
const DESKTOP_POSITIONS: CardSpec[] = [
  { left: 15, top: 60 }, // 1ª, abajo
  { left: 38.33, top: 42 }, // 2ª, arriba
  { left: 61.67, top: 56 }, // 3ª, abajo (algo más alta que la 1ª)
  { left: 85, top: 40 }, // 4ª, la más alta
];
/** 56svh de alto -> 31.5svh de ancho. Deja ~3% de margen lateral a cada lado
 *  y ~3% entre tarjetas en 1440x900, y sigue entrando en 1024x768. */
const DESKTOP_CARD_CLASS = 'h-[56svh] w-auto';

const MOBILE_POSITIONS: CardSpec[] = [
  { left: 26, top: 28 }, // arriba-izquierda (la más alta)
  { left: 74, top: 36 }, // arriba-derecha, un escalón más abajo
  { left: 26, top: 63 }, // abajo-izquierda
  { left: 74, top: 71 }, // abajo-derecha, la más baja
];
/** 32svh de alto -> 18svh de ancho (~39% de un móvil de 390px). */
const MOBILE_CARD_CLASS = 'h-[32svh] w-auto';

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
  pos: CardSpec;
  sizeClassName: string;
  visibilityClassName: string;
}

/** Las cuatro tarjetas arrancan superpuestas en el centro -- con la misma
 *  posición y escala, así que aunque las cuatro estén montadas se leen como
 *  una sola -- y el scroll las separa hacia su lugar final. Nunca se
 *  desmontan: es el propio scroll el que las mueve, hacia abajo las reparte,
 *  hacia arriba las vuelve a juntar. */
const VerticalCard: React.FC<VerticalCardProps> = ({
  hotelId,
  hotelName,
  index,
  scrollYProgress,
  pos,
  sizeClassName,
  visibilityClassName,
}) => {
  const start = 0.14 + index * 0.03;
  const end = start + 0.36;

  const left = useTransform(scrollYProgress, [start, end], ['50%', `${pos.left}%`]);
  const top = useTransform(scrollYProgress, [start, end], ['50%', `${pos.top}%`]);
  const scale = useTransform(scrollYProgress, [start, end], [0.86, 1]);
  const opacity = useLinearOpacity(scrollYProgress, 0.08, 0.14, 0, 1);

  return (
    <motion.div
      style={{ left, top, x: '-50%', y: '-50%', scale, opacity }}
      className={`absolute z-10 aspect-[9/16] ${sizeClassName} ${visibilityClassName}`}
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
 *  chicas -- nunca una vertical a pantalla completa.
 *
 *  Móvil y escritorio usan cada uno su propio set de posiciones/tamaño
 *  (DESKTOP_POSITIONS / MOBILE_POSITIONS, alternados por CSS, no por JS) en
 *  vez de un solo % compartido: compartirlo dejaba tarjetas cortadas por el
 *  borde en un formato al ajustar el otro. */
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
        {/* Vídeo horizontal: de momento una foto real de la web (a sangre
            completa, sin margen) para poder ver el desenfoque -- sustituir
            por el <video> cuando Mayurlin entregue el material. */}
        <motion.div style={{ filter }} className="absolute inset-0">
          <img src={BG_PLACEHOLDER} alt="" className="h-full w-full object-cover" />
        </motion.div>
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
            key={`desktop-${story.id}`}
            hotelId={story.id}
            hotelName={story.hotelName}
            index={i}
            scrollYProgress={scrollYProgress}
            pos={DESKTOP_POSITIONS[i]}
            sizeClassName={DESKTOP_CARD_CLASS}
            visibilityClassName="hidden lg:block"
          />
        ))}
        {stories.map((story, i) => (
          <VerticalCard
            key={`mobile-${story.id}`}
            hotelId={story.id}
            hotelName={story.hotelName}
            index={i}
            scrollYProgress={scrollYProgress}
            pos={MOBILE_POSITIONS[i]}
            sizeClassName={MOBILE_CARD_CLASS}
            visibilityClassName="lg:hidden"
          />
        ))}
      </div>
    </section>
  );
};
