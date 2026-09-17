import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { VIDEOS_HORIZONTALES } from '../data/videos';
import { VideoNube } from './VideoNube';

const ArrowIcon: React.FC<{ direction: 'left' | 'right' }> = ({ direction }) => (
  <svg
    viewBox="0 0 24 24"
    className="h-4 w-4 sm:h-[18px] sm:w-[18px]"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    {direction === 'left' ? <polyline points="15 18 9 12 15 6" /> : <polyline points="9 18 15 12 9 6" />}
  </svg>
);

interface VideoModalProps {
  open: boolean;
  onClose: () => void;
}

/** La ventana de vídeos horizontales.
 *
 *  Mismo carrusel con profundidad que la ventana de propiedades -- misma
 *  escala, mismo desenfoque, mismas flechas, mismo rótulo debajo -- pero con
 *  los vídeos. Idea de Mayurlin, y resuelve el problema de raíz: el vídeo
 *  horizontal ocupa la pantalla entera, así que no caben dos en el bloque de
 *  Inicio sin alargarlo. Aquí caben los que haga falta, no alarga la página, y
 *  no se descarga un solo vídeo hasta que alguien abre la ventana.
 *
 *  LA REGLA QUE NO SE PUEDE ROMPER: sólo se monta UN <iframe>, el del centro.
 *  Los laterales son la foto de portada. Ya pasó una vez con la galería --
 *  dos copias del mismo vídeo, una para móvil y otra para escritorio,
 *  escondidas con CSS -- y el resultado fue el vídeo descargándose dos veces y
 *  dos reproductores sonando a la vez: esconder un iframe no impide que cargue
 *  ni que reproduzca. Con cuatro vídeos serían cuatro descargas y cuatro
 *  audios. Además, los laterales van al 42% de tamaño y desenfocados: ahí no
 *  se aprecia que algo se mueva, así que un reproductor no aporta nada.
 */
export const VideoModal: React.FC<VideoModalProps> = ({ open, onClose }) => {
  const [active, setActive] = useState(0);
  const pistaRef = useRef<HTMLDivElement>(null);
  // Cuánto se separan las tarjetas, en % del ancho de la pista. No es un
  // número fijo: la tarjeta central mide lo mismo en móvil que la pista casi
  // entera, así que un 26% -- que en escritorio va bien -- dejaba 62 px de la
  // lateral montados encima de la central (medido). Se calcula a partir del
  // tamaño real: media tarjeta central (50%) más media lateral (21%, porque
  // están al 42%), más un 4% de aire.
  const [separacion, setSeparacion] = useState(26);
  const arrastreX = useRef<number | null>(null);
  const acabaDeArrastrar = useRef(false);

  const total = VIDEOS_HORIZONTALES.length;
  const actual = VIDEOS_HORIZONTALES[active];

  const mover = (direccion: 'prev' | 'next') => {
    if (total <= 1) return;
    setActive((i) => (direccion === 'next' ? (i + 1) % total : (i - 1 + total) % total));
  };

  // Arrastrar con el dedo o el ratón, igual que en la ventana de propiedades.
  const alSoltar = (e: React.PointerEvent) => {
    if (arrastreX.current === null) return;
    const delta = e.clientX - arrastreX.current;
    arrastreX.current = null;
    if (Math.abs(delta) < 40) return;
    acabaDeArrastrar.current = true;
    window.setTimeout(() => {
      acabaDeArrastrar.current = false;
    }, 120);
    mover(delta < 0 ? 'next' : 'prev');
  };

  useEffect(() => {
    if (!open) return;
    const alPulsar = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') mover('prev');
      if (e.key === 'ArrowRight') mover('next');
    };
    document.addEventListener('keydown', alPulsar);
    const anterior = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', alPulsar);
      document.body.style.overflow = anterior;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, onClose, total]);

  // Cada vez que se abre vuelve al primero, en vez de recordar dónde se quedó
  // la última vez. Mismo criterio que la ventana de propiedades.
  useEffect(() => {
    if (open) setActive(0);
  }, [open]);

  // La separación se recalcula con el tamaño real de la pista, y se vuelve a
  // calcular si se gira el móvil o se cambia el tamaño de la ventana.
  useEffect(() => {
    if (!open) return;
    const pista = pistaRef.current;
    if (!pista) return;
    const recalcular = () => {
      const anchoPista = pista.clientWidth;
      const central = pista.querySelector<HTMLElement>('[data-central="si"]');
      const anchoCentral = central?.getBoundingClientRect().width ?? 0;
      if (!anchoPista || !anchoCentral) return;
      const minimo = ((anchoCentral * 0.71) / anchoPista) * 100 + 4;
      setSeparacion(Math.min(52, Math.max(26, Math.round(minimo))));
    };
    recalcular();
    const ro = new ResizeObserver(recalcular);
    ro.observe(pista);
    return () => ro.disconnect();
  }, [open]);

  if (!actual) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="velo"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-[#f5f3ed]/78 backdrop-blur-[9px]"
            aria-hidden
          />

          <div
            key="ventana"
            className="pointer-events-none fixed inset-0 z-[61] flex items-center justify-center p-3 md:p-10"
          >
            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-labelledby="video-modal-title"
              initial={{ opacity: 0, y: 12, scale: 0.982 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.982 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="mt-glass mt-glass-light pointer-events-auto relative flex max-h-full w-full flex-col overflow-hidden rounded-lg text-[#1a1918] md:max-h-[min(860px,calc(100svh-80px))] md:w-[min(1180px,100%)] md:rounded-[10px]"
            >
              <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
                <div className="relative px-4 pb-10 pt-16 md:px-10 md:pb-14 md:pt-14">
                  <button
                    onClick={onClose}
                    aria-label="Cerrar"
                    className="absolute right-4 top-4 z-[3] flex h-10 w-10 items-center justify-center rounded-full border border-[#1a1918]/20 bg-white/20 text-xl text-[#1a1918] transition-colors hover:bg-white/40 md:right-6 md:top-6 md:h-[42px] md:w-[42px]"
                  >
                    ×
                  </button>

                  {/* El carrusel. Las tarjetas son 16:9, no 4:3 como las de
                      propiedades: son vídeos y hay que verlos en su forma. */}
                  <div
                    ref={pistaRef}
                    className="relative h-[220px] w-full cursor-grab touch-pan-y select-none overflow-hidden [isolation:isolate] active:cursor-grabbing sm:h-[320px] md:h-[430px]"
                    onPointerDown={(e) => {
                      arrastreX.current = e.clientX;
                    }}
                    onPointerUp={alSoltar}
                    onPointerCancel={() => {
                      arrastreX.current = null;
                    }}
                  >
                    {VIDEOS_HORIZONTALES.map((video, i) => {
                      let diff = i - active;
                      if (diff > total / 2) diff -= total;
                      if (diff < -total / 2) diff += total;

                      const dist = Math.abs(diff);
                      const centro = diff === 0;
                      const cerca = dist === 1;
                      const lejos = dist === 2;

                      const escala = centro ? 1 : cerca ? 0.42 : lejos ? 0.28 : 0.22;
                      const opacidad = centro ? 1 : cerca ? 0.72 : lejos ? 0.4 : 0;
                      const desenfoque = centro ? 0 : cerca ? 2.5 : lejos ? 4.5 : 6;
                      const capa = centro ? 20 : cerca ? 10 : lejos ? 5 : 0;
                      const izquierda = 50 + diff * separacion;
                      const pulsable = cerca;

                      return (
                        <div
                          key={video.id}
                          data-central={centro ? 'si' : 'no'}
                          style={{
                            left: `${izquierda}%`,
                            zIndex: capa,
                            opacity: opacidad,
                            filter: `blur(${desenfoque}px)`,
                            transform: `translate(-50%, -50%) scale(${escala}) translateZ(0)`,
                            pointerEvents: centro || pulsable ? 'auto' : 'none',
                            willChange: 'transform, opacity, filter',
                            backfaceVisibility: 'hidden',
                          }}
                          className="absolute top-1/2 aspect-video h-[124px] overflow-hidden rounded-[8px] bg-[#1a1918] shadow-[0_10px_30px_rgba(26,25,24,0.22)] transition-[transform,opacity,filter,left] duration-500 ease-out sm:h-[196px] sm:rounded-[10px] md:h-[304px]"
                        >
                          {centro ? (
                            /* Sólo aquí vive un reproductor. Ver el comentario
                               de cabecera: cuatro iframes son cuatro descargas
                               y cuatro audios sonando a la vez. */
                            <VideoNube src={video.src} />
                          ) : (
                            <button
                              onClick={() => {
                                if (!pulsable || acabaDeArrastrar.current) return;
                                mover(diff === -1 ? 'prev' : 'next');
                              }}
                              aria-label={pulsable ? `Ver el vídeo de ${video.hotelName}` : undefined}
                              aria-hidden={!pulsable || undefined}
                              tabIndex={pulsable ? 0 : -1}
                              className="block h-full w-full"
                            >
                              <img
                                src={video.portada}
                                alt=""
                                className="h-full w-full object-cover"
                              />
                            </button>
                          )}
                        </div>
                      );
                    })}

                    {total > 1 && (
                      <>
                        <button
                          onClick={() => mover('prev')}
                          aria-label="Vídeo anterior"
                          className="absolute left-1 top-1/2 z-30 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#1a1918]/20 bg-white/70 text-[#1a1918] shadow-sm backdrop-blur-sm transition-colors hover:bg-white sm:left-2 sm:h-10 sm:w-10"
                        >
                          <ArrowIcon direction="left" />
                        </button>
                        <button
                          onClick={() => mover('next')}
                          aria-label="Siguiente vídeo"
                          className="absolute right-1 top-1/2 z-30 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#1a1918]/20 bg-white/70 text-[#1a1918] shadow-sm backdrop-blur-sm transition-colors hover:bg-white sm:right-2 sm:h-10 sm:w-10"
                        >
                          <ArrowIcon direction="right" />
                        </button>
                      </>
                    )}
                  </div>

                  {/* Rótulo y salidas, calcados de la ventana de propiedades. */}
                  <div className="mt-8 text-center md:mt-10">
                    <h2
                      id="video-modal-title"
                      className="font-serif text-[26px] uppercase leading-[1.1] tracking-[0.04em] text-[#1a1918] sm:text-4xl md:text-[44px]"
                    >
                      {actual.hotelName}
                    </h2>
                    {actual.descripcion && (
                      <p className="mx-auto mt-4 max-w-[46ch] font-sans text-[13px] leading-[1.6] text-[#5a5854] md:text-sm">
                        {actual.descripcion}
                      </p>
                    )}

                    {actual.hotelId && (
                      <div className="mt-8 flex flex-wrap items-center justify-center gap-x-7 gap-y-4 md:mt-10">
                        <Link
                          to={`/trabajo/${actual.hotelId}`}
                          onClick={onClose}
                          className="bg-[#1a1918] px-8 py-4 text-[11px] font-sans font-medium uppercase tracking-[0.22em] text-[#f5f3ed] transition-colors hover:bg-[#5a5854] md:px-10 md:py-[1.15rem] md:text-xs"
                        >
                          Ver galería
                        </Link>
                      </div>
                    )}

                    {total > 1 && (
                      <div className="mt-8 font-sans text-[11px] uppercase tracking-[0.25em] text-[#5a5854] md:text-xs">
                        {active + 1} / {total}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.aside>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
