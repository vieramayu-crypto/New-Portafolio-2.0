import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'motion/react';
import { Link } from 'react-router-dom';
import { HOTEL_STORIES } from '../data/hotels';
import { useSiteContent, publicImage } from '../src/lib/content';

/** Los cuatro hoteles con los que se ejemplifica el bloque -- los mismos
 *  cuatro que pidió Mayurlin por nombre (Ritz-Carlton, GPRO, InterContinental,
 *  Deltapark). El botón de cada tarjeta ya lleva a su portafolio real. */
const FEATURED_IDS = ['ritz-carlton-abama', 'gpro-valparaiso', 'intercontinental-lisboa', 'deltapark-vitalresort'];

/** Foto real de la web. Ya no es sólo un marcador de posición: se queda
 *  DEBAJO del vídeo como red de seguridad. Si el servicio de vídeo no
 *  responde, no autoriza este dominio o tarda, la sección enseña esta foto
 *  en vez de un rectángulo negro. */
const BG_PLACEHOLDER = publicImage('sec6-gal01-fachada-noche-h.jpg');

/** El vídeo horizontal del fondo.
 *
 *  `tipo: 'incrustado'` es el reproductor del servicio en la nube de
 *  Mayurlin dentro de un <iframe>. Funciona sin tocar nada más, pero es una
 *  caja cerrada: el reproductor es de ellos. Por eso el arranque y la parada
 *  no se piden por API sino montando y desmontando el iframe según entra o
 *  sale de pantalla -- al desmontarlo el vídeo se para de verdad, sin
 *  depender de ningún SDK externo.
 *
 *  `tipo: 'archivo'` es la opción buena si el servicio da un enlace directo
 *  al .mp4 (en H.264, no H.265: 10 bits no se reproduce en Chrome ni en
 *  Firefox). Ahí recuperamos el control completo. Cambiar de una a otra es
 *  cambiar estas dos líneas.
 *
 *  `null` vuelve a dejar sólo la foto. */
const FONDO: { tipo: 'incrustado' | 'archivo'; src: string; enVivo: boolean } | null = {
  tipo: 'incrustado',
  src: 'https://livid.com/embed/oSYQOQcPwP5R?autoplay=1&loop=1&muted=1',
  /* En false el vídeo NO sale en la web publicada: sólo abriendo la dirección
     con ?video=1 delante de la almohadilla. Es una prueba sin riesgo -- un
     iframe que no carga (dominio no autorizado, servicio caído) no se queda
     transparente, pinta un rectángulo gris encima de todo, y eso es lo que
     verían los hoteles. Cuando la prueba salga bien, esto pasa a true. */
  enVivo: false,
};

/** ?video=1 antes de la almohadilla fuerza la prueba. Se lee una sola vez. */
const PRUEBA_VIDEO =
  typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('video');

const MOSTRAR_VIDEO = !!FONDO && (FONDO.enVivo || PRUEBA_VIDEO);

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

/** El fondo a sangre completa: foto de seguridad abajo y, encima, el vídeo.
 *
 *  Un <iframe> no admite `object-fit: cover`, así que se recorta a mano con
 *  el truco de sobredimensionar: 177.78svh de ancho es exactamente 16:9 sobre
 *  la altura de la pantalla, y los `min-` toman el relevo cuando la pantalla
 *  es más ancha que alta. Así el vídeo llena siempre, sin bandas.
 *
 *  `activo` llega de fuera: sólo se monta cuando la sección está en pantalla.
 */
const FondoVideo: React.FC<{ activo: boolean }> = ({ activo }) => {
  /* `onLoad` NO sirve para saber si el vídeo está ahí: el navegador lo dispara
     igual cuando la carga falla, porque su propia página de error también
     "carga" (comprobado: opacidad 1 con el dominio bloqueado). Así que antes
     de montar nada se llama a la dirección con `no-cors`, que no necesita
     permiso del servidor y falla si el servicio no responde. Sólo si contesta
     se monta el iframe. Si no, se queda la foto -- nunca el gris. */
  const [alcanzable, setAlcanzable] = useState(false);
  const [cargado, setCargado] = useState(false);

  useEffect(() => {
    if (!MOSTRAR_VIDEO || !activo || !FONDO || alcanzable) return;
    let vivo = true;
    fetch(FONDO.src, { mode: 'no-cors' })
      .then(() => { if (vivo) setAlcanzable(true); })
      .catch(() => { /* servicio caído o dominio bloqueado: se queda la foto */ });
    return () => { vivo = false; };
  }, [activo, alcanzable]);

  const montar = MOSTRAR_VIDEO && activo && alcanzable && !!FONDO;

  return (
    <>
      <img src={BG_PLACEHOLDER} alt="" className="absolute inset-0 h-full w-full object-cover" />
      {montar && FONDO!.tipo === 'incrustado' && (
        <iframe
          src={FONDO!.src}
          title=""
          frameBorder="0"
          allow="autoplay; encrypted-media; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
          onLoad={() => setCargado(true)}
          className={`pointer-events-none absolute left-1/2 top-1/2 h-[100svh] w-[177.78svh] min-h-[56.25vw] min-w-full -translate-x-1/2 -translate-y-1/2 border-0 transition-opacity duration-700 ${
            cargado ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
      {montar && FONDO!.tipo === 'archivo' && (
        <video
          src={FONDO!.src}
          autoPlay
          loop
          muted
          playsInline
          poster={BG_PLACEHOLDER}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
    </>
  );
};

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
        {/* La caja del nombre mide siempre lo mismo en las cuatro tarjetas:
            ancho completo del hueco y alto reservado para dos renglones. Antes
            se ajustaba al texto, y como unos nombres caben en una línea y
            otros en dos, las cuatro cajas salían de tamaños distintos y el
            conjunto se veía descuadrado. */}
        <div className="absolute inset-x-0 bottom-0 p-2 sm:p-3 md:p-4">
          <Link
            to={`/trabajo/${hotelId}`}
            className="mt-glass mt-glass-light relative flex min-h-[34px] w-full items-center justify-center overflow-hidden rounded-md px-2 py-1.5 text-center text-[9px] font-serif font-medium leading-tight tracking-[0.1em] text-[#1a1918] transition-all duration-300 hover:bg-[#1a1918] hover:text-[#f5f3ed] sm:min-h-[46px] sm:px-3 sm:py-2 sm:text-[12px] sm:tracking-[0.15em] md:min-h-[50px] md:text-xs"
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

  /* El vídeo sólo existe mientras la sección está en pantalla. Montar y
     desmontar es la única forma de encenderlo y apagarlo que no depende del
     reproductor del servicio externo. El margen de 200px lo arranca justo
     antes de que se vea, para que no se note el primer fotograma. */
  const [enPantalla, setEnPantalla] = useState(false);
  useEffect(() => {
    const nodo = containerRef.current;
    if (!nodo || typeof IntersectionObserver === 'undefined') return;
    const obs = new IntersectionObserver(
      ([entrada]) => setEnPantalla(entrada.isIntersecting),
      { rootMargin: '200px 0px' },
    );
    obs.observe(nodo);
    return () => obs.disconnect();
  }, []);

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
          <p className="mx-auto mt-4 max-w-[46ch] text-[14px] leading-[1.7] text-white/70 md:mt-5 md:text-sm">
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
        {/* Vídeo horizontal a sangre completa. El desenfoque y el zoom van en
            este contenedor, no en el vídeo: un filtro CSS sobre el padre
            también afecta al iframe, así que la entrada se conserva igual
            con vídeo incrustado que con archivo propio. */}
        <motion.div
          initial={false}
          animate={{ filter: deployed ? 'blur(16px)' : 'blur(0px)', scale: deployed ? 1.06 : 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 overflow-hidden"
        >
          <FondoVideo activo={enPantalla} />
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
