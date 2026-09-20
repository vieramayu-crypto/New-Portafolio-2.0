import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { VIDEOS_HORIZONTALES, VIDEOS_VERTICALES } from '../data/videos';
import { VideoNube } from './VideoNube';

/** UNA GALERÍA DE PIEZAS: un marco, una pieza a la vez, y debajo una línea
 *  fina que dice de quién es. Nada detrás ni al lado.
 *
 *  ES UN COMPONENTE PORTÁTIL, y eso es a propósito. Lleva su propia cabecera
 *  y su propio fondo, así que se puede mover a cualquier punto de la página
 *  cambiando una línea en `HomeMain`. Mayurlin quiere repartir más vídeo por
 *  la web y todavía no ha decidido dónde; esto lo deja preparado.
 *
 *  UNA GALERÍA POR FORMATO, NO UNA PARA TODO. Primero se probó con las siete
 *  piezas en la misma lista. Es más limpio, pero ella vio el fallo: "hay que
 *  desplazarse por todos los vídeos para poder ver una pieza u otra", y el
 *  marco pegaba un salto de alto en cada cambio de formato. Ahora cada
 *  formato tiene la suya y se le pasan las piezas por `piezas`.
 */

type Formato = 'h' | 'v';

interface Pieza {
  id: string;
  formato: Formato;
  hotel: string;
  tipo: string;
  src: string;
  hotelId?: string;
}

/** Las dos listas, DERIVADAS de `data/videos.ts` y no duplicadas: añadir un
 *  vídeo allí lo mete aquí solo. */
export const PIEZAS_HORIZONTALES: Pieza[] = VIDEOS_HORIZONTALES.map((v) => ({
  id: v.id,
  formato: 'h' as Formato,
  hotel: v.hotelName,
  tipo: v.descripcion ?? 'Vídeo de presentación',
  src: v.src,
  hotelId: v.hotelId,
}));

export const PIEZAS_VERTICALES: Pieza[] = VIDEOS_VERTICALES.filter(
  (v) => !v.provisional,
).map((v) => ({
  id: v.id,
  formato: 'v' as Formato,
  hotel: v.hotel,
  tipo: v.tipo,
  src: v.src,
  hotelId: v.hotelId,
}));

const Flecha: React.FC<{ hacia: 'izq' | 'der' }> = ({ hacia }) => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.3">
    <path
      d={hacia === 'izq' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

interface GaleriaPiezasProps {
  piezas: Pieza[];
  titulo: string;
  subtitulo: string;
  /** El marfil de la casa. `alterno` usa el otro, para que dos galerías
   *  seguidas no se lean como un solo bloque interminable. */
  alterno?: boolean;
}

export const GaleriaPiezas: React.FC<GaleriaPiezasProps> = ({
  piezas: PIEZAS,
  titulo,
  subtitulo,
  alterno,
}) => {
  const total = PIEZAS.length;
  const [i, setI] = useState(0);
  const [sentido, setSentido] = useState(1);
  const pieza = PIEZAS[i];

  const ir = (delta: number) => {
    setSentido(delta);
    setI((n) => (n + delta + total) % total);
  };

  if (!pieza) return null;

  /* EL TAMAÑO SALE DE DOS TOPES, NO DE UNO.
     Primero se probó con el marco a un alto fijo y la pieza a `h-full` con su
     proporción: en móvil el horizontal salía de 960 px de ancho sobre una
     pantalla de 390 y se desbordaba. Con `min(100%, alto * proporción)` el
     ancho nunca pasa del contenedor y el alto nunca pasa de `--alto`, así que
     los dos formatos entran enteros en cualquier pantalla sin deformarse.

     Y el marco NO tiene alto fijo: se adapta a la pieza y Framer anima el
     cambio con `layout`. Con alto fijo, un horizontal en móvil dejaba 330 px
     de nada arriba y abajo -- justo el hueco vacío que ella ya había
     rechazado antes en esta misma sección. */
  const proporcion = pieza.formato === 'v' ? 9 / 16 : 16 / 9;

  return (
    <section
      className={`relative w-full pb-20 pt-16 md:pb-28 md:pt-24 ${
        alterno ? 'bg-[#f5f3ed]' : 'bg-[#fbfaf6]'
      }`}
    >
      <div className="mx-auto max-w-6xl px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="mb-10 text-center md:mb-14"
        >
          <h2 className="mx-auto max-w-[20ch] font-serif text-3xl leading-[1.15] text-[#1a1918] md:max-w-none md:text-5xl">
            {titulo}
          </h2>
          <p className="mx-auto mt-4 max-w-[46ch] text-[14px] leading-[1.7] text-[#5a5854] md:mt-5 md:text-sm">
            {subtitulo}
          </p>
        </motion.div>

      </div>

      {/* UN 15% MÁS GRANDE, pedido de Mayurlin.
          EL MARCO SALE DEL CONTENEDOR DE LA SECCIÓN, a propósito. El tamaño de
          la pieza sale de DOS topes -- el alto y el ancho -- y en escritorio el
          horizontal ya estaba tocando el ancho del `max-w-6xl`: subiendo sólo
          `--alto` no se movía ni un píxel. Medido: seguía en 1056x594.

          La cabecera y el pie se quedan en `max-w-6xl` porque un titular a
          1.216 px se lee peor y las flechas del pie se irían a los extremos.
          Crece sólo la pieza, que es lo que ella quiere ver más grande.

          El ancho lleva su propio tope contra el viewport y no un margen
          negativo: con `-mx-20`, entre 1.152 y 1.216 px de pantalla el marco
          se salía y el `overflow-x-clip` de Inicio le habría cortado los
          bordes en silencio.

          Medido antes/después a 1440x900: horizontal 1056x594 → 1216x684,
          vertical 365x648 → 420x747. En móvil el horizontal NO crece: ya iba
          de lado a lado (342 de 390) y lo único que quedaba era comerse el
          margen. El vertical sí: 294x523 → 337x599. */}
      <div className="mx-auto w-[min(1216px,calc(100vw-3rem))]">
        <motion.div
          layout
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="flex justify-center [--alto:71svh] md:[--alto:83svh]"
        >
          <AnimatePresence mode="wait" custom={sentido}>
            <motion.div
              key={pieza.id}
              custom={sentido}
              initial={{ opacity: 0, x: sentido * 26 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: sentido * -26 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              style={{
                aspectRatio: `${proporcion}`,
                width: `min(100%, calc(var(--alto) * ${proporcion}))`,
              }}
              className="overflow-hidden rounded-[10px] bg-[#1a1918] shadow-[0_30px_80px_-30px_rgba(26,25,24,0.55)]"
            >
              <div className="h-full [&>div]:h-full [&_iframe]:h-full">
                <VideoNube
                  src={pieza.src}
                  proporcion={pieza.formato === 'v' ? '177.778%' : '56.25%'}
                  className="h-full"
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      <div className="mx-auto max-w-6xl px-6 md:px-12">
        {/* EL PIE: quién es, y la navegación. Una sola línea fina, como la de
            los datos de rodaje en la ficha de hotel. */}
        <div className="mt-7 flex items-center justify-between gap-4 md:mt-9">
          <button
            onClick={() => ir(-1)}
            aria-label="Pieza anterior"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[#1a1918] transition-colors duration-300 hover:bg-[#1a1918]/[0.06]"
          >
            <Flecha hacia="izq" />
          </button>

          <div className="min-w-0 flex-1 text-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={pieza.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
              >
                {pieza.hotelId ? (
                  <Link
                    to={`/trabajo/${pieza.hotelId}`}
                    className="font-serif text-lg text-[#1a1918] underline-offset-4 hover:underline md:text-2xl"
                  >
                    {pieza.hotel}
                  </Link>
                ) : (
                  <div className="font-serif text-lg text-[#1a1918] md:text-2xl">{pieza.hotel}</div>
                )}
                <div className="mt-1.5 text-[10px] font-sans uppercase tracking-[0.22em] text-[#5a5854] md:text-[11px]">
                  {pieza.tipo}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <button
            onClick={() => ir(1)}
            aria-label="Pieza siguiente"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[#1a1918] transition-colors duration-300 hover:bg-[#1a1918]/[0.06]"
          >
            <Flecha hacia="der" />
          </button>
        </div>

        {/* LA REGLA DE PIEZAS. No son puntos: son marcas de distinto ancho
            según el formato -- anchas las horizontales, estrechas las
            verticales -- así que el índice dice de un vistazo qué hay en la
            galería y en qué formato, sin una sola palabra. */}
        <div className="mt-8 flex items-center justify-center gap-2 md:mt-10">
          {PIEZAS.map((p, n) => (
            <button
              key={p.id}
              onClick={() => {
                setSentido(n > i ? 1 : -1);
                setI(n);
              }}
              aria-label={`Ver ${p.hotel}`}
              aria-current={n === i}
              className={`h-[3px] rounded-full transition-all duration-300 ${
                p.formato === 'h' ? 'w-9' : 'w-4'
              } ${n === i ? 'bg-[#1a1918]' : 'bg-[#1a1918]/20 hover:bg-[#1a1918]/40'}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
