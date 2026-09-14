import React, { useRef, useState } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'motion/react';
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
  { left: 26, top: 66.5 }, // abajo-izquierda
  { left: 74, top: 74.5 }, // abajo-derecha, la más baja
];
/** 37svh de alto -> 20.8svh de ancho. Un 15% más grande que las 32svh
 *  anteriores, que es lo máximo que permite la pantalla: a 390px el ancho
 *  de la tarjeta sale a ~176px y quedan ~13px de margen a cada lado y ~11px
 *  entre columnas. Subir más se come el margen antes que el alto. */
const MOBILE_CARD_CLASS = 'h-[37svh] w-auto';

/** Umbrales de despliegue, con histéresis: una vez abiertas hace falta subir
 *  bastante más para volver a cerrarlas, así una rueda de ratón que rebota en
 *  el límite no las hace parpadear. */
const DEPLOY_ON = 0.2;
const DEPLOY_OFF = 0.12;

/** Muelle blando a propósito: la animación ya no va pegada al dedo, se
 *  dispara sola, así que puede permitirse inercia. Con un `ease` lineal se
 *  veía robótica -- que es justo lo que pidió corregir Mayurlin. */
const CARD_SPRING = { type: 'spring' as const, stiffness: 110, damping: 19, mass: 1 };

const PlayIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M8 5v14l11-7z" />
  </svg>
);

interface VerticalCardProps {
  hotelId: string;
  hotelName: string;
  index: number;
  deployed: boolean;
  pos: CardSpec;
  sizeClassName: string;
  visibilityClassName: string;
}

/** Las cuatro tarjetas arrancan superpuestas en el centro -- con la misma
 *  posición y escala, así que se leen como una sola -- y al cruzar el umbral
 *  salen disparadas a su sitio, cada una con un retardo distinto. Nunca se
 *  desmontan: volver a subir invierte exactamente el mismo movimiento.
 *
 *  El desenfoque que las acompaña es el "motion blur": sube al arrancar,
 *  baja al llegar. No es un desenfoque direccional real (CSS no lo tiene sin
 *  filtros SVG), pero cumple la misma función -- tapa el salto y hace que el
 *  movimiento se lea como inercia y no como un salto de coordenadas. */
const VerticalCard: React.FC<VerticalCardProps> = ({
  hotelId,
  hotelName,
  index,
  deployed,
  pos,
  sizeClassName,
  visibilityClassName,
}) => {
  const delay = index * 0.08;

  return (
    <motion.div
      // `initial={false}`: al montar debe estar ya recogida, sin reproducir
      // la animación de cierre a espaldas del visitante.
      initial={false}
      animate={
        deployed
          ? {
              left: `${pos.left}%`,
              top: `${pos.top}%`,
              scale: 1,
              opacity: 1,
              x: '-50%',
              y: '-50%',
              filter: ['blur(14px)', 'blur(7px)', 'blur(0px)'],
            }
          : {
              left: '50%',
              top: '50%',
              scale: 0.86,
              opacity: 0,
              x: '-50%',
              y: '-50%',
              filter: ['blur(0px)', 'blur(7px)', 'blur(12px)'],
            }
      }
      transition={{
        default: { ...CARD_SPRING, delay },
        opacity: { duration: 0.5, ease: 'easeOut', delay },
        filter: { duration: 0.85, times: [0, 0.35, 1], ease: 'easeOut', delay },
      }}
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
 *  encima se reparten cuatro vídeos verticales.
 *
 *  El scroll ya NO dibuja la animación fotograma a fotograma: solo la
 *  enciende y la apaga. Cruzar el umbral la dispara entera y ella sola
 *  (muelle + desenfoque de movimiento); volver a subir la invierte igual.
 *  Pedido explícito de Mayurlin -- ir pegada al dedo la hacía ver robótica y
 *  dejaba las tarjetas congeladas a medio camino.
 *
 *  Móvil y escritorio usan cada uno su propio set de posiciones/tamaño
 *  (DESKTOP_POSITIONS / MOBILE_POSITIONS, alternados por CSS, no por JS) en
 *  vez de un solo % compartido: compartirlo dejaba tarjetas cortadas por el
 *  borde en un formato al ajustar el otro. */
export const VideoShowcase: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { hotels: hotelContent } = useSiteContent();
  const [deployed, setDeployed] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    setDeployed((abierto) => (abierto ? p > DEPLOY_OFF : p >= DEPLOY_ON));
  });

  const stories = FEATURED_IDS.map((id) => {
    const idx = HOTEL_STORIES.findIndex((s) => s.id === id);
    const base = HOTEL_STORIES[idx];
    return { id, hotelName: hotelContent[idx]?.hotelName ?? base.hotelName };
  });

  return (
    <>
      {/* El titular vivía ENCIMA del vídeo. Con una foto fija se leía bien,
          pero el vídeo va a reproducirse solo y en bucle: un bloque de texto
          fijo sobre la imagen en movimiento le quita la pantalla justo cuando
          hay algo que ver. Sale fuera, a su propia cabecera sobre el fondo
          oscuro, y el vídeo se queda limpio. */}
      <section className="w-full bg-[#1a1918] px-6 pb-14 pt-20 text-center md:pb-20 md:pt-28">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <h2 className="mx-auto max-w-[20ch] font-serif text-3xl leading-[1.15] text-white md:max-w-none md:text-5xl">
            Vídeos para mostrar la experiencia de tu hotel
          </h2>
          <p className="mx-auto mt-4 max-w-[46ch] text-[13px] leading-[1.7] text-white/70 md:mt-5 md:text-sm">
            Desde una presentación de la propiedad hasta reels centrados en sus espacios,
            gastronomía o servicio.
          </p>
        </motion.div>
      </section>

    {/* 220vh, no 280: el alto solo tiene que dar para llegar al umbral, ver la
        animación completa y quedarse un rato con las cuatro puestas. Ya no hay
        que reservar recorrido para "dibujarla". */}
    <section ref={containerRef} className="relative w-full bg-[#1a1918]" style={{ height: '220vh' }}>
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        {/* Vídeo horizontal: de momento una foto real de la web (a sangre
            completa, sin margen) para poder ver el desenfoque -- sustituir
            por el <video> cuando Mayurlin entregue el material. */}
        <motion.div
          initial={false}
          animate={{ filter: deployed ? 'blur(16px)' : 'blur(0px)', scale: deployed ? 1.06 : 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <img src={BG_PLACEHOLDER} alt="" className="h-full w-full object-cover" />
        </motion.div>
        <motion.div
          initial={false}
          animate={{ opacity: deployed ? 0 : 1, scale: deployed ? 0.9 : 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 shadow-lg md:h-20 md:w-20">
            <PlayIcon className="h-6 w-6 translate-x-[2px] text-[#1a1918] md:h-7 md:w-7" />
          </span>
        </motion.div>

        {/* Velo que sube junto con el desenfoque, igual que detrás de las
            ventanas emergentes: sostiene la lectura de las tarjetas sin
            apagar del todo el vídeo de fondo. */}
        <motion.div
          initial={false}
          animate={{ opacity: deployed ? 0.45 : 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none absolute inset-0 bg-black"
        />

        {stories.map((story, i) => (
          <VerticalCard
            key={`desktop-${story.id}`}
            hotelId={story.id}
            hotelName={story.hotelName}
            index={i}
            deployed={deployed}
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
            deployed={deployed}
            pos={MOBILE_POSITIONS[i]}
            sizeClassName={MOBILE_CARD_CLASS}
            visibilityClassName="lg:hidden"
          />
        ))}
      </div>
    </section>
    </>
  );
};
