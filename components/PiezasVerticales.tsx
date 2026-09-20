import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { VIDEOS_VERTICALES } from '../data/videos';
import type { VideoVertical } from '../data/videos';
import { VideoNube } from './VideoNube';

/** EL CUARTO CARRUSEL HERMANO.
 *
 *  Las piezas verticales vivían en una constelación: cuatro tarjetas
 *  desparramadas sobre una foto desenfocada, en un bloque pegajoso y oscuro.
 *  Era la única sección de la web que no hablaba el idioma de la casa, y
 *  Mayurlin lo dijo sin rodeos: "no me cierra para nada".
 *
 *  De las cuatro direcciones que se le propusieron eligió ésta -- que las
 *  piezas usen el esqueleto que ella ya aprobó tres veces: ancla a la
 *  izquierda (la cifra), la pieza flotada, el texto en serif grande
 *  envolviéndola y la firma abajo. Es el mismo de "El proceso" (Acerca de) y
 *  "Voces de la industria" (Contacto). Cambiar uno es cambiar los cuatro.
 *
 *  Y sobre fondo claro, como los otros tres. El negro era la excepción de la
 *  web; ahora el vídeo es lo más oscuro de la página, que es donde tiene que
 *  ir la mirada.
 */

/** Cada cuánto pasa sola. Más lento que las citas (9 s): aquí hay un vídeo
 *  que hay que dar tiempo a ver, y cambiar de pieza recarga el reproductor. */
const PASO_MS = 14000;

/** La tarjeta de una pieza.
 *
 *  `medidor` la pinta invisible y SIN reproductor, sólo para que la rejilla
 *  tome la altura de la más alta. Montar el vídeo en las copias de medición
 *  sería montarlos todos, que es justo lo que este rediseño evita. */
const TarjetaPieza: React.FC<{ pieza: VideoVertical; indice: number; medidor?: boolean }> = ({
  pieza,
  indice,
  medidor,
}) => {
  /* Mismas clases de flotado que las otras dos, con la anchura subida un
     escalón: una pieza 9:16 al ancho de una foto 3:4 se queda estrecha y el
     vídeo, que es lo que hay que ver, sale diminuto. */
  const clasesPieza =
    'float-left mb-3 mr-5 w-32 sm:w-40 md:mb-4 md:mr-8 md:w-[220px] lg:w-[250px]';

  return (
    <div className="md:grid md:grid-cols-[auto_1fr] md:gap-x-10 lg:gap-x-16">
      {/* La cifra -- el ancla decorativa, igual que la comilla de "Voces de la
          industria" y la cifra de "El proceso", para que los carruseles se
          lean como un conjunto. */}
      <div
        aria-hidden
        className="mb-4 font-serif text-6xl leading-none text-[#1a1918]/25 md:mb-0 md:text-8xl lg:text-9xl"
      >
        {String(indice + 1).padStart(2, '0')}
      </div>

      <div>
        <div className={clasesPieza}>
          <div
            className="overflow-hidden rounded-[8px] bg-[#1a1918] shadow-[0_18px_50px_-18px_rgba(26,25,24,0.55)]"
            style={{ aspectRatio: '9 / 16' }}
          >
            {!medidor && (
              <div className="h-full [&>div]:h-full [&_iframe]:h-full">
                <VideoNube src={pieza.src} proporcion="177.778%" className="h-full" />
              </div>
            )}
          </div>
        </div>

        <p className="font-serif text-[1.45rem] leading-[1.3] text-[#1a1918] sm:text-3xl md:text-[2.35rem] md:leading-[1.28] lg:text-[2.6rem]">
          {pieza.titular}
        </p>

        <div className="clear-left pt-8 md:pt-10">
          {pieza.hotelId ? (
            <Link
              to={`/trabajo/${pieza.hotelId}`}
              className="font-serif text-xl text-[#1a1918] underline-offset-4 hover:underline md:text-2xl"
            >
              {pieza.hotel}
            </Link>
          ) : (
            <div className="font-serif text-xl text-[#1a1918] md:text-2xl">{pieza.hotel}</div>
          )}
          <div className="mt-1 text-[11px] font-sans uppercase tracking-[0.22em] text-[#5a5854] md:text-xs">
            {pieza.tipo}
          </div>
        </div>
      </div>
    </div>
  );
};

export const PiezasVerticales: React.FC = () => {
  const piezas = VIDEOS_VERTICALES.filter((p) => !p.provisional);
  const [indice, setIndice] = useState(0);
  const [parado, setParado] = useState(false);
  const total = piezas.length;

  /* Va sola hasta que alguien la toca, igual que "El proceso": cualquier
     gesto de Mayurlin la detiene y manda ella. */
  useEffect(() => {
    if (total <= 1 || parado) return;
    const t = window.setInterval(() => setIndice((i) => (i + 1) % total), PASO_MS);
    return () => window.clearInterval(t);
  }, [total, parado]);

  const ir = (delta: number) => {
    setParado(true);
    setIndice((i) => (i + delta + total) % total);
  };

  /* Arrastrar para pasar, como la tira de vídeos horizontales. */
  const arrastreX = useRef<number | null>(null);

  if (!total) return null;
  const pieza = piezas[indice];

  return (
    <section className="relative w-full bg-[#fbfaf6] py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-6 md:px-12">
        <div className="mb-12 md:mb-16">
          <h2 className="font-serif text-[8vw] leading-[1.06] text-[#1a1918] sm:text-[6vw] md:text-[3.2vw]">
            Piezas verticales
          </h2>
          <p className="mt-4 max-w-[52ch] font-sans text-[14px] leading-[1.7] text-[#5a5854] md:text-sm">
            Para las redes del hotel, en el formato en que se publican.
          </p>
        </div>

        <div
          className="relative touch-pan-y select-none"
          onPointerDown={(e) => {
            arrastreX.current = e.clientX;
          }}
          onPointerUp={(e) => {
            if (arrastreX.current === null) return;
            const d = e.clientX - arrastreX.current;
            arrastreX.current = null;
            if (Math.abs(d) > 40) ir(d < 0 ? 1 : -1);
          }}
          onPointerCancel={() => {
            arrastreX.current = null;
          }}
        >
          {/* El marco mide lo que mide la pieza más alta a este ancho. Todas
              se apilan en la MISMA celda de una rejilla -- las copias,
              invisibles y sin reproductor, sólo para medir -- y la rejilla
              toma la altura de la mayor. Mismo truco que en "Voces de la
              industria": un `min-h` fijo es un mínimo, no un tope, y la caja
              daba un salto cada vez que cambiaba el contenido. */}
          <div className="relative grid">
            {piezas.map((p, i) => (
              <div
                key={`medidor-${p.id}`}
                aria-hidden
                className="pointer-events-none invisible [grid-area:1/1]"
              >
                <TarjetaPieza pieza={p} indice={i} medidor />
              </div>
            ))}

            <div className="[grid-area:1/1]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={pieza.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -18 }}
                  transition={{ duration: 0.55, ease: 'easeInOut' }}
                >
                  <TarjetaPieza pieza={pieza} indice={indice} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Los puntos, con el mismo peso que en los otros carruseles: marcan
            dónde estás y dejan saltar, sin gritar. */}
        {total > 1 && (
          <div className="mt-10 flex items-center justify-center gap-3 md:mt-12">
            {piezas.map((p, i) => (
              <button
                key={p.id}
                onClick={() => {
                  setParado(true);
                  setIndice(i);
                }}
                aria-label={`Ver la pieza de ${p.tipo}`}
                aria-current={i === indice}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === indice ? 'w-7 bg-[#1a1918]' : 'w-1.5 bg-[#1a1918]/25 hover:bg-[#1a1918]/45'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
