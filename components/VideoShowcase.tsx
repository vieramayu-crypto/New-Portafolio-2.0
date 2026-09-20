import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { publicImage } from '../src/lib/content';
import { VideoNube } from './VideoNube';
import { PiezasVerticales } from './PiezasVerticales';
import { VIDEOS_HORIZONTALES } from '../data/videos';

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

/** Cada cuánto pasa sola la tira de vídeos. 15 s, no 5: cambiar el vídeo de
 *  fondo significa recargar el reproductor, así que tiene que dar tiempo a
 *  verlo. Y en cuanto Mayurlin toca uno, se para y manda ella -- misma regla
 *  que "El proceso" en Acerca de. */
const PASO_AUTOMATICO_MS = 15000;

const FondoVideo: React.FC<{ src: string }> = ({ src }) => (
  <>
    {/* La foto de respaldo llena la caja que le den. El recorte ya no lo
        decide ella: lo decide el contenedor, que en móvil es una banda 16:9
        pegada al titular y en escritorio la pantalla entera. */}
    <img src={BG_PLACEHOLDER} alt="" className="absolute inset-0 h-full w-full object-cover" />
    {FONDO && MOSTRAR_VIDEO && (
      /* El recorte a sangre completa se hace ENSANCHANDO ESTE CONTENEDOR, no
         deformando el iframe: dentro, el vídeo conserva exactamente la caja
         16:9 y el iframe al 100% que da el proveedor. 177.78svh de ancho es
         justo lo que hace que esa caja 16:9 mida 100svh de alto. En móvil no
         hace falta: la caja del padre YA es 16:9, así que `w-full` calza.
         `pointer-events-none` va aquí fuera y no en el iframe: es un fondo
         decorativo y se tragaría el gesto de desplazar. */
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

/** Las tres ranuras que existen: izquierda, centro, derecha. Ni una más.
 *
 *  LA CAUSA DEL "BARRIDO RARO", que no era la opacidad. Antes se pintaban las
 *  CUATRO miniaturas y cada una calculaba su sitio por distancia al centro.
 *  Con cuatro vídeos, al pasar de uno al siguiente la que estaba a -1 pasaba
 *  a +2: viajaba de un extremo al otro CRUZANDO POR EL MEDIO, detrás de la
 *  central, en los mismos 500 ms. Eso es lo que se veía "pasar de dos a un
 *  lado y uno al otro".
 *
 *  Ahora sólo existen tres nodos. Al cambiar de vídeo, la central se convierte
 *  en lateral (un salto de ranura), la lateral de ese lado se va apagándose
 *  por el borde y entra una nueva por el otro. Ninguna cruza el centro nunca.
 */
const RANURAS = [-1, 0, 1] as const;

/** Muelle, no `ease`. Mayurlin lo dijo tal cual: "no es fluida, no es
 *  orgánica, va a trompicones". Un muelle tiene aceleración y frenada
 *  propias; una curva fija de 500 ms, no. */
const TIRA_MUELLE = { type: 'spring' as const, stiffness: 170, damping: 26, mass: 0.9 };

const TiraVideos: React.FC<{
  activo: number;
  onElegir: (i: number) => void;
  nombre: string;
}> = ({ activo, onElegir, nombre }) => {
  const total = VIDEOS_HORIZONTALES.length;
  const arrastreX = useRef<number | null>(null);
  const acabaDeArrastrar = useRef(false);
  const pistaRef = useRef<HTMLDivElement>(null);

  /* La separación se mide, no se fija, y ahora en PÍXELES.
     Iba en `left: %`, y animar `left` obliga al navegador a recalcular la
     maquetación en cada fotograma -- de ahí los tirones. Los píxeles viajan
     en `transform`, que va por la tarjeta gráfica.
     Media central + media lateral (que va al 62%) + un dedo de aire. */
  const [sep, setSep] = useState(0);
  useEffect(() => {
    const pista = pistaRef.current;
    if (!pista) return;
    const recalcular = () => {
      const ancho = pista.clientWidth;
      const alto = pista.clientHeight;
      if (!ancho || !alto) return;
      const anchoCentral = (alto * 16) / 9;
      setSep(Math.min(ancho * 0.5, anchoCentral * 0.81 + ancho * 0.04));
    };
    recalcular();
    const ro = new ResizeObserver(recalcular);
    ro.observe(pista);
    return () => ro.disconnect();
  }, []);

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

  const enRanura = RANURAS.map((r) => {
    const i = ((activo + r) % total + total) % total;
    return { r, i, video: VIDEOS_HORIZONTALES[i] };
  });

  return (
    <div className="flex w-full max-w-[760px] flex-col items-center gap-3">
      <div
        ref={pistaRef}
        className="relative w-full cursor-grab touch-pan-y select-none [isolation:isolate] active:cursor-grabbing"
        style={{ height: `${ALTO_TIRA_SVH}svh`, minHeight: 96 }}
        onPointerDown={(e) => {
          arrastreX.current = e.clientX;
        }}
        onPointerUp={alSoltar}
        onPointerCancel={() => {
          arrastreX.current = null;
        }}
      >
        <AnimatePresence initial={false}>
          {enRanura.map(({ r, i, video }) => {
            const centro = r === 0;
            return (
              /* DOS CAJAS, Y EL REPARTO IMPORTA.
                 La de fuera ocupa la pista entera (`inset-0`) y es la única
                 que anima. La de dentro centra la miniatura con CSS estático.

                 Aquí me equivoqué una vez y se rompió la sección entera: puse
                 el centrado (`-translate-x-1/2 -translate-y-1/2`) Y la
                 animación en el MISMO elemento. Las clases de Tailwind y
                 Framer escriben las dos la propiedad `transform`, y Framer,
                 que la pone en línea, se lleva el centrado por delante: las
                 miniaturas quedaron colgando del punto central hacia abajo y
                 hacia la derecha, tapando el nombre del hotel.

                 Con la capa a tamaño de pista no hay conflicto: `scale` sobre
                 la capa equivale a escalar la miniatura sobre su propio centro
                 (está centrada en ella), y `x` no se ve afectado por la escala
                 porque en CSS el desplazamiento se aplica en el sistema de
                 coordenadas del padre. */
              <motion.div
                key={video.id}
                className="pointer-events-none absolute inset-0"
                style={{ zIndex: centro ? 20 : 10 }}
                initial={{ opacity: 0, x: r * sep * 1.45, scale: 0.42, filter: 'blur(7px)' }}
                animate={{
                  opacity: centro ? 1 : 0.5,
                  x: r * sep,
                  scale: centro ? 1 : 0.62,
                  /* EL DESENFOQUE DE MOVIMIENTO. Sube al arrancar y baja al
                     llegar, igual que en las tarjetas verticales: tapa el
                     salto y hace que el recorrido se lea como inercia. */
                  filter: centro ? ['blur(4px)', 'blur(0px)'] : ['blur(5px)', 'blur(1.6px)'],
                }}
                /* Se va POR EL BORDE, no se apaga en el sitio: Framer guarda
                   las props del último renderizado, así que este `r` es el
                   lado por el que estaba saliendo. */
                exit={{ opacity: 0, x: r * sep * 1.45, scale: 0.42, filter: 'blur(7px)' }}
                transition={{
                  default: TIRA_MUELLE,
                  opacity: { duration: 0.38, ease: 'easeOut' },
                  filter: { duration: 0.5, ease: 'easeOut' },
                }}
              >
                <div className="absolute left-1/2 top-1/2 h-full -translate-x-1/2 -translate-y-1/2">
                <button
                  onClick={() => {
                    if (acabaDeArrastrar.current) return;
                    onElegir(i);
                  }}
                  aria-label={`Ver el vídeo de ${video.hotelName}`}
                  aria-current={centro}
                  tabIndex={centro ? 0 : -1}
                  /* SIN BORDE. La central llevaba `ring-1 ring-white/45` y
                     Mayurlin pidió quitarlo: "no quiero que tenga ningún
                     borde, por muy pequeño que sea". La sombra se queda --
                     eso es profundidad, no un filo. */
                  className={`pointer-events-auto block aspect-video h-full overflow-hidden rounded-[6px] bg-[#1a1918] ${
                    centro
                      ? 'shadow-[0_6px_28px_rgba(0,0,0,0.5)]'
                      : 'shadow-[0_4px_16px_rgba(0,0,0,0.4)]'
                  }`}
                >
                  <img src={video.portada} alt="" className="h-full w-full object-cover" />
                </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* EL NOMBRE DEL HOTEL, DEBAJO. La miniatura sola no dice de quién es
          el vídeo que suena de fondo. Misma serif de la casa, en blanco y
          pequeña. Caja de alto fijo para que la tira no salte cuando un
          nombre ocupa dos líneas. */}
      <div className="flex h-4 items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.span
            key={nombre}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="font-serif text-[10px] uppercase tracking-[0.22em] text-white/80 [text-shadow:0_1px_8px_rgba(0,0,0,.8)] md:text-[11px]"
          >
            {nombre}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
};

/** El bloque de vídeo de Inicio: cabecera, el vídeo horizontal con su tira, y
 *  debajo las piezas verticales.
 *
 *  YA NO HAY CONSTELACIÓN. Durante muchas rondas los cuatro verticales eran
 *  tarjetas desparramadas sobre una foto desenfocada, en un bloque pegajoso y
 *  oscuro que se desplegaba con el scroll. Mayurlin lo descartó entero -- "no
 *  me cierra para nada" -- y eligió que las piezas usaran el esqueleto de los
 *  carruseles que ya funcionan. Viven en `PiezasVerticales`.
 *
 *  Con eso se fueron el bloque pegajoso, el despliegue con muelle, el fondo
 *  desenfocado, el velo, el aviso de salida y los dos juegos de posiciones.
 *  Si alguien echa de menos alguna de esas piezas, está en el historial. */
export const VideoShowcase: React.FC = () => {
  const [activo, setActivo] = useState(0);
  const [pasoParado, setPasoParado] = useState(false);
  const totalVideos = VIDEOS_HORIZONTALES.length;
  const hayVarios = totalVideos > 1;
  const videoActivo = VIDEOS_HORIZONTALES[activo] ?? VIDEOS_HORIZONTALES[0];

  const irAVideo = (i: number) => {
    setPasoParado(true);
    setActivo(((i % totalVideos) + totalVideos) % totalVideos);
  };

  return (
    <>
      {/* El titular vivía ENCIMA del vídeo. Con una foto fija se leía bien,
          pero el vídeo va a reproducirse solo y en bucle: un bloque de texto
          fijo sobre la imagen en movimiento le quita la pantalla justo cuando
          hay algo que ver. Sale fuera, a su propia cabecera sobre el fondo
          oscuro, y el vídeo se queda limpio. */}
      {/* LA CABECERA, EN MARFIL. Era el único bloque oscuro de la web y por
          eso se leía como un bache. Ahora el vídeo que viene debajo es lo más
          oscuro de la página, que es donde tiene que ir la mirada. */}
      <div aria-hidden className="h-px w-full bg-[#1a1918]/12" />
      <section className="w-full bg-[#fbfaf6] px-6 pb-9 pt-20 text-center md:pb-12 md:pt-28">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <h2 className="mx-auto max-w-[20ch] font-serif text-3xl leading-[1.15] text-[#1a1918] md:max-w-none md:text-5xl">
            Vídeos para mostrar la experiencia de tu hotel
          </h2>
          <p className="mx-auto mt-4 max-w-[46ch] text-[14px] leading-[1.7] text-[#5a5854] md:mt-5 md:text-sm">
            Desde una presentación de la propiedad hasta reels centrados en sus espacios,
            gastronomía o servicio.
          </p>
        </motion.div>
      </section>

    {/* SECCIÓN 1 -- EL VÍDEO HORIZONTAL, CON SU PROPIO ESPACIO.

        Antes esto y los verticales compartían un bloque pegajoso de 160vh:
        el vídeo quedaba debajo y las tarjetas se desplegaban ENCIMA al primer
        scroll, así que quien bajaba un poco se quedaba sin ver el vídeo
        -- "te impide la visualización del vídeo horizontal", dijo Mayurlin.
        Ahora son dos secciones seguidas y cada una manda en lo suyo.

        En móvil la banda 16:9 va pegada al titular. Estaba centrada en una
        pantalla completa, así que entre el texto y el vídeo había ~300 px de
        negro y la tira caía tan abajo que hacía falta otro scroll para
        encontrarla. En escritorio el vídeo sí llena la pantalla. */}
    <section className="relative w-full bg-[#1a1918] md:h-[100dvh] md:overflow-hidden">
      <div className="relative aspect-video w-full md:absolute md:inset-0 md:aspect-auto">
        <FondoVideo src={videoActivo.src} />
      </div>

      {/* LA TIRA. En móvil, en flujo justo debajo del vídeo. En escritorio
          sigue flotando sobre él, que ahí sí hay sitio de sobra.

          NINGUNA miniatura es un reproductor: son las fotos de portada. El
          único vídeo que existe en esta sección es el del fondo. */}
      {hayVarios && (
        <div className="relative z-30 flex justify-center px-4 pb-12 pt-6 md:absolute md:inset-x-0 md:bottom-16 md:px-6 md:pb-0 md:pt-0">
          <TiraVideos activo={activo} onElegir={irAVideo} nombre={videoActivo.hotelName} />
        </div>
      )}
    </section>

    {/* SECCIÓN 2 -- LAS PIEZAS VERTICALES, COMO EL CUARTO CARRUSEL HERMANO.

        Aquí había una constelación: cuatro tarjetas desparramadas sobre una
        foto desenfocada, en un bloque pegajoso y oscuro de 150vh. Mayurlin:
        "no me cierra para nada". De las cuatro direcciones propuestas eligió
        que las piezas hablen el idioma de la casa -- el mismo esqueleto de
        "El proceso" y "Voces de la industria". Ver PiezasVerticales. */}
    <PiezasVerticales />

    </>
  );
};
