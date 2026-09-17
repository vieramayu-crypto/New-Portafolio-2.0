import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from 'motion/react';
import { Link } from 'react-router-dom';
import { HOTEL_STORIES } from '../data/hotels';
import { useSiteContent, publicImage } from '../src/lib/content';
import { VideoNube } from './VideoNube';
import { VIDEOS_HORIZONTALES } from '../data/videos';

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
  /* Prueba superada en el navegador de Mayurlin: sondeo "responde", iframe
     montado y cargado, caja de 1459x824 sobre una pantalla de 824 de alto
     (el recorte a sangre completa cuadra). El vídeo pasa a verse para todos.
     El modo ?video=1 y su recuadro de diagnóstico se quedan: no estorban a
     nadie y son la forma de volver a mirar si algún día deja de cargar. */
  enVivo: true,
};

const MOSTRAR_VIDEO = !!FONDO && FONDO.enVivo;

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
  /* Las cuatro iban en dos columnas perfectas (26 / 74 repetido) y a la misma
     distancia, y eso se leía como una cuadrícula, no como una escena. Ahora
     cada columna se desplaza un poco entre su tarjeta de arriba y la de
     abajo, así que ningún borde se alinea con el de enfrente.
     El desorden es SÓLO lateral y en pasos pequeños. Con un escalonado mayor
     las de abajo subían tanto que tapaban la placa del nombre de las de
     arriba -- y el nombre es lo único que informa en cada tarjeta. Las
     alturas dejan ~9px de aire entre la fila de arriba y la de abajo (antes
     se tocaban a hueso, que tampoco era la idea) y hacen que la última acabe
     antes del aviso de salida, que empieza a 776px sobre una pantalla de
     844. */
  { left: 26, top: 28 }, // arriba-izquierda (la más alta)
  { left: 74, top: 32 }, // arriba-derecha, un escalón por debajo
  { left: 28, top: 66 }, // abajo-izquierda, corrida a la derecha respecto a la de arriba
  { left: 73, top: 70 }, // abajo-derecha, corrida a la izquierda respecto a la de arriba
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

/** El aviso de que hay más abajo. No sale desde el primer fotograma -- ahí se
 *  leería como parte del decorado y se pasaría por alto -- pero sí en cuanto
 *  las cuatro tarjetas terminan de desplegarse (el despliegue arranca en
 *  0.20). Antes esperaba al 62 % y obligaba a un segundo scroll para
 *  descubrirlo: quien se paraba a mirar las tarjetas no lo veía nunca. */
const SALIDA_ON = 0.26;
const SALIDA_OFF = 0.18;

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
/** Cada cuánto pasa sola la tira de vídeos. 15 s, no 5: cambiar el vídeo de
 *  fondo significa recargar el reproductor, así que tiene que dar tiempo a
 *  verlo. Y en cuanto Mayurlin toca uno, se para y manda ella -- misma regla
 *  que "El proceso" en Acerca de. */
const PASO_AUTOMATICO_MS = 15000;

const FondoVideo: React.FC<{ src: string }> = ({ src }) => (
  <>
    {/* La foto de respaldo se recorta como el vídeo: a sangre completa en
        escritorio, y en móvil como banda 16:9 centrada, para que el bloque se
        vea igual con vídeo y sin él. */}
    <img
      src={BG_PLACEHOLDER}
      alt=""
      className="absolute left-1/2 top-1/2 h-[56.25vw] w-full -translate-x-1/2 -translate-y-1/2 object-cover md:left-0 md:top-0 md:h-full md:w-full md:translate-x-0 md:translate-y-0"
    />
    {FONDO && MOSTRAR_VIDEO && (
      /* El recorte a sangre completa se hace ENSANCHANDO ESTE CONTENEDOR, no
         deformando el iframe: dentro, el vídeo conserva exactamente la caja
         16:9 y el iframe al 100% que da el proveedor. 177.78svh de ancho es
         justo lo que hace que esa caja 16:9 mida 100svh de alto.
         `pointer-events-none` va aquí fuera y no en el iframe: es un fondo
         decorativo a pantalla completa y se tragaría el gesto de desplazar. */
      <div className="pointer-events-none absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2 md:w-[177.78svh] md:min-w-full">
        <VideoNube key={src} src={src} />
      </div>
    )}
  </>
);

/** La tira de vídeos horizontales, en la base del bloque.
 *
 *  Mismo efecto de profundidad que el carrusel de la ventana de propiedades:
 *  el del centro grande y nítido -- que es el que suena de fondo -- y los de
 *  al lado pequeños, apagados y desenfocados. Se pasa arrastrando o tocando
 *  uno de los laterales.
 *
 *  El alto lo manda `ALTO_TIRA_SVH`: 15% de la pantalla, que es el techo que
 *  puso Mayurlin para que tape lo menos posible del vídeo de detrás.
 *
 *  Las miniaturas son FOTOS, nunca reproductores. El único vídeo de esta
 *  sección es el del fondo; cuatro iframes serían cuatro descargas y cuatro
 *  audios sonando a la vez.
 */
const ALTO_TIRA_SVH = 15;

const TiraVideos: React.FC<{ activo: number; onElegir: (i: number) => void }> = ({
  activo,
  onElegir,
}) => {
  const total = VIDEOS_HORIZONTALES.length;
  const arrastreX = useRef<number | null>(null);
  const acabaDeArrastrar = useRef(false);
  const pistaRef = useRef<HTMLDivElement>(null);
  // La separación entre miniaturas se calcula, no se fija: en móvil la
  // central ocupa casi dos tercios de la tira, y con un porcentaje fijo las de
  // al lado se le montaban encima 61 px (medido). Media central (50%) más
  // media lateral (31%, porque van al 62%) más un 4% de aire.
  const [separacion, setSeparacion] = useState(34);

  useEffect(() => {
    const pista = pistaRef.current;
    if (!pista) return;
    const recalcular = () => {
      const ancho = pista.clientWidth;
      const centro = pista.querySelector<HTMLElement>('[aria-current="true"]');
      const anchoCentro = centro?.getBoundingClientRect().width ?? 0;
      if (!ancho || !anchoCentro) return;
      setSeparacion(Math.min(56, Math.max(28, Math.round(((anchoCentro * 0.81) / ancho) * 100 + 4))));
    };
    recalcular();
    const ro = new ResizeObserver(recalcular);
    ro.observe(pista);
    return () => ro.disconnect();
  }, [activo]);

  const alSoltar = (e: React.PointerEvent) => {
    if (arrastreX.current === null) return;
    const delta = e.clientX - arrastreX.current;
    arrastreX.current = null;
    if (Math.abs(delta) < 40) return;
    acabaDeArrastrar.current = true;
    window.setTimeout(() => {
      acabaDeArrastrar.current = false;
    }, 120);
    onElegir(activo + (delta < 0 ? 1 : -1));
  };

  return (
    <div
      ref={pistaRef}
      className="relative w-full max-w-[760px] cursor-grab touch-pan-y select-none [isolation:isolate] active:cursor-grabbing"
      style={{ height: `${ALTO_TIRA_SVH}svh`, minHeight: 96 }}
      onPointerDown={(e) => {
        arrastreX.current = e.clientX;
      }}
      onPointerUp={alSoltar}
      onPointerCancel={() => {
        arrastreX.current = null;
      }}
    >
      {VIDEOS_HORIZONTALES.map((video, i) => {
        let diff = i - activo;
        if (diff > total / 2) diff -= total;
        if (diff < -total / 2) diff += total;

        const dist = Math.abs(diff);
        const centro = diff === 0;
        const cerca = dist === 1;

        const escala = centro ? 1 : cerca ? 0.62 : 0.46;
        const opacidad = centro ? 1 : cerca ? 0.5 : 0.24;
        const desenfoque = centro ? 0 : cerca ? 1.6 : 3;
        const capa = centro ? 20 : cerca ? 10 : 5;
        const izquierda = 50 + diff * separacion;

        return (
          <button
            key={video.id}
            onClick={() => {
              if (acabaDeArrastrar.current) return;
              onElegir(i);
            }}
            aria-label={`Ver el vídeo de ${video.hotelName}`}
            aria-current={centro}
            style={{
              left: `${izquierda}%`,
              zIndex: capa,
              opacity: opacidad,
              filter: `blur(${desenfoque}px)`,
              transform: `translate(-50%, -50%) scale(${escala}) translateZ(0)`,
              willChange: 'transform, opacity, filter',
              backfaceVisibility: 'hidden',
            }}
            className={`absolute top-1/2 block aspect-video h-full overflow-hidden rounded-[6px] bg-[#1a1918] transition-[transform,opacity,filter,left] duration-500 ease-out ${
              centro
                ? 'shadow-[0_6px_28px_rgba(0,0,0,0.5)] ring-1 ring-white/45'
                : 'shadow-[0_4px_16px_rgba(0,0,0,0.4)]'
            }`}
          >
            <img src={video.portada} alt="" className="h-full w-full object-cover" />
          </button>
        );
      })}
    </div>
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
  // Cuál de los vídeos horizontales se está reproduciendo de fondo. La tira de
  // abajo lo cambia. Antes esto vivía detrás de un botón que abría una ventana,
  // y Mayurlin lo dijo claro: eso entorpece el flujo. Ahora los cuatro están
  // siempre a la vista y cambiar es desplazar o tocar.
  const [activo, setActivo] = useState(0);
  const [pasoParado, setPasoParado] = useState(false);
  const totalVideos = VIDEOS_HORIZONTALES.length;
  const hayVarios = totalVideos > 1;
  const videoActivo = VIDEOS_HORIZONTALES[activo] ?? VIDEOS_HORIZONTALES[0];

  const irAVideo = (i: number) => {
    setPasoParado(true);
    setActivo(((i % totalVideos) + totalVideos) % totalVideos);
  };

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const [salidaVisible, setSalidaVisible] = useState(false);

  // La tira va sola hasta que alguien la toca.
  useEffect(() => {
    if (!hayVarios || pasoParado) return;
    const t = window.setInterval(
      () => setActivo((i) => (i + 1) % totalVideos),
      PASO_AUTOMATICO_MS,
    );
    return () => window.clearInterval(t);
  }, [hayVarios, pasoParado, totalVideos]);

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    setDeployed((abierto) => (abierto ? p > DEPLOY_OFF : p >= DEPLOY_ON));
    setSalidaVisible((visible) => (visible ? p > SALIDA_OFF : p >= SALIDA_ON));
  });

  /* Salta al final de esta sección, no a un id concreto: así el bloque no
     tiene que saber qué viene detrás y sigue funcionando si se reordena. */
  const irAbajo = () => {
    const n = containerRef.current;
    if (!n) return;
    window.scrollTo({ top: n.getBoundingClientRect().bottom + window.scrollY, behavior: 'smooth' });
  };

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

    {/* El alto sólo tiene que dar para llegar al umbral, ver la animación
        completa y quedarse un rato con las cuatro tarjetas puestas.

        En móvil son 160vh y no 220: el vídeo horizontal ahí es una banda 16:9
        de 219 px dentro de una pantalla de 844, así que con 220vh había que
        recorrer 1.857 px -- dos pantallas y pico -- de los que la mayoría era
        negro. Medido. En escritorio el vídeo llena la pantalla entera y ese
        recorrido sí se aprovecha. */}
    <section ref={containerRef} className="relative h-[160vh] w-full bg-[#1a1918] md:h-[220vh]">
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
          <FondoVideo src={videoActivo.src} />
        </motion.div>
        {/* Aquí había un botón de reproducir grande y blanco. Tenía sentido
            sobre la foto fija: decía "esto es un vídeo". Con el vídeo real
            reproduciéndose solo es un botón que no hace nada, puesto encima
            de algo que ya está en marcha. */}

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

        {/* LA TIRA DE VÍDEOS. Siempre a la vista, en la base del bloque y
            centrada. Antes esto vivía detrás de un botón que abría una
            ventana; Mayurlin lo dijo claro: ir a un botón para abrir una
            ventana para ver otro vídeo entorpece el flujo. Ahora los cuatro
            están ahí y cambiar es desplazar o tocar.

            Mismo efecto de profundidad que la ventana de propiedades -- el
            del centro grande y nítido, los de al lado pequeños y
            desenfocados -- pero en pequeño: la tira ocupa un 15% del alto de
            la pantalla como máximo, que es lo que ella pidió, para tapar lo
            menos posible del vídeo que hay detrás.

            NINGUNA miniatura es un reproductor: son las fotos de portada. El
            único vídeo que existe en esta sección es el del fondo. */}
        {hayVarios && (
          <motion.div
            initial={false}
            animate={{ opacity: deployed ? 0 : 1, y: deployed ? 16 : 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{ pointerEvents: deployed ? 'none' : 'auto' }}
            /* En móvil va pegada bajo el vídeo, no al fondo de la pantalla:
               el vídeo es una banda centrada y entre ella y el borde había
               más de 300 px de negro. En escritorio el vídeo llena la
               pantalla, así que ahí sí va abajo. */
            className="absolute inset-x-0 top-[calc(50%+130px)] z-30 flex justify-center px-4 md:top-auto md:bottom-24"
          >
            <TiraVideos activo={activo} onElegir={irAVideo} />
          </motion.div>
        )}

        {/* Aviso de salida. Este bloque es pegajoso y ocupa la pantalla
            entera: sin una señal, al llegar a las cuatro tarjetas es
            razonable pensar que la página se acaba aquí. Dice a dónde lleva
            en vez de un "hay más abajo" genérico -- nombrar lo que viene es
            también una razón para seguir. Mismo cristal que la banda
            flotante de Inicio, pero con el texto en claro: ese cristal es
            translúcido al 32 % y aquí vive sobre un vídeo oscurecido por el
            velo, así que el texto casi negro de la banda de Inicio (que sí
            funciona sobre crema) quedaba ilegible. Flecha moviéndose despacio
            para que se vea sin gritar. La sombra del texto no es decorativa:
            el fondo ya no es una foto fija sino vídeo, y un plano soleado
            podría aclarar el cristal justo debajo de estas letras. */}
        <AnimatePresence>
          {salidaVisible && (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 14 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="absolute inset-x-0 bottom-8 z-40 flex justify-end px-6 md:px-10"
            >
              {/* Sin el recuadro de cristal y a la derecha: el centro de abajo
                  es ahora de la tira de vídeos, y dos cajas de cristal
                  seguidas competían. Queda el texto, que es lo que hace
                  falta, con su sombra para que se lea sobre cualquier plano
                  del vídeo. */}
              <button
                onClick={irAbajo}
                className="relative flex items-center gap-3 font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-[#f5f3ed]/85 [text-shadow:0_1px_6px_rgba(26,25,24,0.9)] transition-colors duration-300 hover:text-[#f5f3ed] md:text-xs"
              >
                <span>Ver los hoteles</span>
                <motion.span
                  aria-hidden
                  animate={{ y: [0, 4, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                  className="leading-none"
                >
                  &#8595;
                </motion.span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>

    </>
  );
};
