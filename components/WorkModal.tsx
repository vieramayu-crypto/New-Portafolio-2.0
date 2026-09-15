import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { HOTEL_STORIES } from '../data/hotels';
import { CASE_STUDIES } from '../data/caseStudies';
import { HotelStory } from '../types';
import { useSiteContent } from '../src/lib/content';

interface WorkModalProps {
  open: boolean;
  onClose: () => void;
}

const ArrowIcon: React.FC<{ direction: 'left' | 'right' }> = ({ direction }) => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 sm:h-[18px] sm:w-[18px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={direction === 'left' ? 'M15 18l-6-6 6-6' : 'M9 18l6-6-6-6'} />
  </svg>
);

interface HotelCarouselProps {
  stories: HotelStory[];
  active: number;
  onNavigate: (direction: 'prev' | 'next') => void;
}

/** Carrusel con profundidad: el hotel activo va grande y nítido al centro;
 *  el anterior y el siguiente asoman más pequeños y difusos a los lados; el
 *  resto queda invisible pero sigue montado (nunca se desmonta), para que
 *  cada cambio de índice anime con una transición CSS -- nunca un salto
 *  seco. Las nueve miniaturas en fila no se distinguían entre sí; esto deja
 *  claro cuál es cuál y cómo pasar de una a otra (flechas o deslizando). */
const HotelCarousel: React.FC<HotelCarouselProps> = ({ stories, active, onNavigate }) => {
  const total = stories.length;
  const pistaRef = useRef<HTMLDivElement>(null);
  const arrastreX = useRef<number | null>(null);
  // Un deslizar que empieza justo sobre la miniatura lateral también
  // dispara su clic (tap) al soltar: este candado evita contar el cambio
  // de hotel dos veces.
  const justSwiped = useRef(false);
  // El gesto de dos dedos del trackpad llega en muchos eventos pequeños, no en
  // uno grande: hay que sumarlos hasta el umbral o el carrusel saltaría cinco
  // hoteles de un solo gesto.
  const ruedaAcumulada = useRef(0);
  const ruedaBloqueada = useRef(false);

  const navegar = (dir: 'prev' | 'next') => {
    justSwiped.current = true;
    onNavigate(dir);
    window.setTimeout(() => {
      justSwiped.current = false;
    }, 400);
  };

  // Arrastre con el dedo y con el ratón, en el mismo sitio: Pointer Events
  // cubre los dos y evita tener dos caminos que mantener.
  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    arrastreX.current = e.clientX;
  };
  const handlePointerUp = (e: React.PointerEvent) => {
    if (arrastreX.current === null) return;
    const delta = e.clientX - arrastreX.current;
    if (Math.abs(delta) > 40) navegar(delta > 0 ? 'prev' : 'next');
    arrastreX.current = null;
  };

  // `wheel` va con `addEventListener` y no como prop de React porque hace falta
  // `passive: false` para poder cortar el gesto: sin eso, Safari y Chrome se
  // llevan el deslizamiento horizontal como "volver atrás" en el historial y el
  // visitante se sale de la web sin querer.
  useEffect(() => {
    const nodo = pistaRef.current;
    if (!nodo) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return; // scroll vertical: no es para nosotros
      e.preventDefault();
      if (ruedaBloqueada.current) return;
      ruedaAcumulada.current += e.deltaX;
      if (Math.abs(ruedaAcumulada.current) < 45) return;
      navegar(ruedaAcumulada.current > 0 ? 'next' : 'prev');
      ruedaAcumulada.current = 0;
      ruedaBloqueada.current = true;
      window.setTimeout(() => {
        ruedaBloqueada.current = false;
      }, 320);
    };
    nodo.addEventListener('wheel', onWheel, { passive: false });
    return () => nodo.removeEventListener('wheel', onWheel);
  }, [onNavigate]);

  return (
    // `isolation: isolate` + capa propia por miniatura: en Safari de iOS
    // aparecía una franja de color cruzando el carrusel al pasar de un hotel
    // a otro. No se reproduce en Chromium, así que no es un elemento que
    // estemos dibujando: es el compositor de Safari reutilizando un búfer
    // sucio al mezclar `filter: blur()` animado dentro de un contenedor con
    // `backdrop-filter` (el cristal de la ventana). Aislar el contexto de
    // apilado y dar a cada miniatura su propia capa desde el principio es el
    // remedio conocido para ese fallo.
    <div
      ref={pistaRef}
      // `touch-action: pan-y` deja pasar el scroll vertical de la página y se
      // queda con el horizontal, que es el que mueve el carrusel.
      className="relative h-[230px] w-full cursor-grab touch-pan-y select-none overflow-hidden [isolation:isolate] active:cursor-grabbing sm:h-[290px]"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => {
        arrastreX.current = null;
      }}
    >
      {stories.map((story, i) => {
        let diff = i - active;
        if (diff > total / 2) diff -= total;
        if (diff < -total / 2) diff += total;

        const absDiff = Math.abs(diff);
        const isCenter = diff === 0;
        const isNear = absDiff === 1;
        const isFar = absDiff === 2;
        // Dos niveles de profundidad a cada lado (no solo uno): así se nota
        // que hay más de tres propiedades, aunque el segundo nivel quede
        // borroso e ilegible a propósito.
        const scale = isCenter ? 1 : isNear ? 0.42 : isFar ? 0.28 : 0.22;
        const opacity = isCenter ? 1 : isNear ? 0.72 : isFar ? 0.4 : 0;
        const blur = isCenter ? 0 : isNear ? 2.5 : isFar ? 4.5 : 6;
        const zIndex = isCenter ? 20 : isNear ? 10 : isFar ? 5 : 0;
        const leftPercent = 50 + diff * 20;
        const clickable = isNear;

        return (
          <button
            key={story.id}
            onClick={() => {
              if (!clickable || justSwiped.current) return;
              if (diff === -1) onNavigate('prev');
              else if (diff === 1) onNavigate('next');
            }}
            aria-label={clickable ? `Ver ${story.hotelName}` : undefined}
            aria-hidden={!clickable || undefined}
            tabIndex={clickable ? 0 : -1}
            style={{
              left: `${leftPercent}%`,
              zIndex,
              opacity,
              filter: `blur(${blur}px)`,
              transform: `translate(-50%, -50%) scale(${scale}) translateZ(0)`,
              pointerEvents: clickable ? 'auto' : 'none',
              willChange: 'transform, opacity, filter',
              backfaceVisibility: 'hidden',
            }}
            className="absolute top-1/2 aspect-[4/3] h-[180px] overflow-hidden rounded-[8px] shadow-[0_10px_30px_rgba(26,25,24,0.22)] transition-[transform,opacity,filter,left] duration-500 ease-out sm:h-[240px]"
          >
            <img src={story.coverImage} alt={story.hotelName} className="h-full w-full object-cover" />
          </button>
        );
      })}

      <button
        onClick={() => onNavigate('prev')}
        aria-label="Hotel anterior"
        className="absolute left-1 top-1/2 z-30 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#1a1918]/20 bg-white/70 text-[#1a1918] shadow-sm backdrop-blur-sm transition-colors hover:bg-white sm:left-2 sm:h-10 sm:w-10"
      >
        <ArrowIcon direction="left" />
      </button>
      <button
        onClick={() => onNavigate('next')}
        aria-label="Siguiente hotel"
        className="absolute right-1 top-1/2 z-30 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#1a1918]/20 bg-white/70 text-[#1a1918] shadow-sm backdrop-blur-sm transition-colors hover:bg-white sm:right-2 sm:h-10 sm:w-10"
      >
        <ArrowIcon direction="right" />
      </button>
    </div>
  );
};

/** "Trabajo": misma ventana emergente que la de Contacto -- mismo velo, mismo
 *  borde de cristal, misma X -- no una página propia. Cerrarla deja al
 *  visitante exactamente donde estaba (nunca recarga Inicio), porque nunca
 *  cambia de ruta: solo alterna un booleano en AppShell, igual que
 *  InquiryModal. Adentro, el carrusel con profundidad reemplaza la fila de
 *  miniaturas (que no se distinguía) y el "Ver portafolio" sí navega de
 *  verdad, a la ficha completa del hotel. */
export const WorkModal: React.FC<WorkModalProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const { hotels: hotelContent } = useSiteContent();
  const [active, setActive] = useState(0);

  const stories = useMemo(
    () =>
      HOTEL_STORIES.map((story, i) => ({
        ...story,
        hotelName: hotelContent[i]?.hotelName ?? story.hotelName,
      })),
    [hotelContent]
  );

  const current = stories[active];
  const total = stories.length;

  const navigateCarousel = (direction: 'prev' | 'next') => {
    setActive((i) => (direction === 'next' ? (i + 1) % total : (i - 1 + total) % total));
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') navigateCarousel('prev');
      if (e.key === 'ArrowRight') navigateCarousel('next');
    };
    document.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, onClose]);

  // El hotel activo se reinicia en Ritz-Carlton Abama cada vez que se abre,
  // en vez de recordar la última selección de la visita anterior.
  useEffect(() => {
    if (open) setActive(0);
  }, [open]);

  const openPortfolio = () => {
    navigate(`/trabajo/${current.id}`);
    onClose();
  };

  const currentCase = CASE_STUDIES.find((c) => c.hotelId === current.id);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="veil"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-[#f5f3ed]/78 backdrop-blur-[9px]"
            aria-hidden
          />

          <div
            key="modal"
            className="pointer-events-none fixed inset-0 z-[61] flex items-center justify-center p-3 md:p-10"
          >
            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-labelledby="work-modal-title"
              initial={{ opacity: 0, y: 12, scale: 0.982 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.982 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="mt-glass mt-glass-light pointer-events-auto relative flex max-h-full w-full flex-col overflow-hidden rounded-lg text-[#1a1918] md:max-h-[min(860px,calc(100svh-80px))] md:w-[min(1140px,100%)] md:rounded-[10px]"
            >
              {/* Un solo hijo directo de `.mt-glass`: esa clase fuerza
                  `position: relative` en sus hijos directos (para que ganen al
                  destello), y eso le habría roto el `absolute` a la X si
                  viviera aquí mismo. */}
              <div className="no-scrollbar relative flex min-h-0 flex-1 flex-col overflow-y-auto">
                <button
                  onClick={onClose}
                  aria-label="Cerrar"
                  className="absolute right-4 top-4 z-[3] flex h-10 w-10 items-center justify-center rounded-full border border-[#1a1918]/20 bg-white/20 text-xl text-[#1a1918] transition-colors hover:bg-white/40 md:right-6 md:top-6 md:h-[42px] md:w-[42px]"
                >
                  ×
                </button>

                <div className="px-6 pb-10 pt-14 text-center md:px-12 md:pb-14 md:pt-16">
                  <HotelCarousel stories={stories} active={active} onNavigate={navigateCarousel} />

                  {/* Alto fijo para dos líneas: un nombre corto (una línea)
                      y uno largo (dos) no deben cambiar la altura de la
                      tarjeta -- eso es lo que causaba el salto al pasar de
                      un hotel a otro en móvil. */}
                  <div className="mt-7 flex min-h-[64px] items-center justify-center md:mt-9 md:min-h-[72px]">
                    <h2 id="work-modal-title" key={current.id + '-name'} className="font-serif text-2xl md:text-3xl">
                      {current.hotelName}
                    </h2>
                  </div>

                  {/* Alto reservado, no dependiente del contenido: por debajo de `sm` los
                      dos botones se apilan, y los hoteles sin proyecto documentado
                      dejaban de dibujar el segundo — la ventana encogía y crecía al
                      pasar de un hotel a otro. El hueco se reserva siempre. */}
                  <div className="mt-8 flex min-h-[94px] flex-col items-center justify-start gap-4 sm:min-h-0 sm:flex-row sm:justify-center md:mt-9">
                    <button
                      onClick={openPortfolio}
                      className="bg-[#1a1918] px-8 py-4 text-[12px] font-sans uppercase tracking-[0.22em] font-medium text-[#f5f3ed] transition-colors hover:bg-[#5a5854] md:px-10 md:py-[1.15rem] md:text-xs"
                    >
                      Ver galería
                    </button>
                    {/* Solo los hoteles con caso documentado ofrecen la
                        segunda salida: llamar "proyecto" a una galería sin
                        contexto es justo lo que pedía evitar la auditoría. */}
                    {currentCase && (
                      <button
                        onClick={() => {
                          navigate(`/proyecto/${currentCase.slug}`);
                          onClose();
                        }}
                        className="border-b border-[#1a1918]/65 pb-2 text-[11px] font-sans uppercase tracking-[0.22em] text-[#1a1918] transition-colors hover:border-[#1a1918] md:text-[12px]"
                      >
                        Ver proyecto
                      </button>
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
