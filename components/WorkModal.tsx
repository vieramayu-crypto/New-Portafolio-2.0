import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { HOTEL_STORIES } from '../data/hotels';
import { useSiteContent } from '../src/lib/content';

interface WorkModalProps {
  open: boolean;
  onClose: () => void;
}

/** "Trabajo": misma ventana emergente que la de Contacto -- mismo velo, mismo
 *  borde de cristal, misma X -- no una página propia. Cerrarla deja al
 *  visitante exactamente donde estaba (nunca recarga Inicio), porque nunca
 *  cambia de ruta: solo alterna un booleano en AppShell, igual que
 *  InquiryModal. La foto de portada del hotel activo ocupa solo la franja
 *  superior de la tarjeta; debajo, el selector de miniaturas superpuestas
 *  (comprimido para no romper la elegancia con nueve fotos en fila) y el
 *  botón que sí navega de verdad, a la ficha completa del hotel. */
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

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
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
              className="mt-glass mt-glass-light pointer-events-auto relative flex max-h-full w-full flex-col overflow-hidden rounded-lg text-[#1a1918] md:max-h-[min(800px,calc(100svh-80px))] md:w-[min(760px,100%)] md:rounded-[10px]"
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

                {/* Foto del hotel activo: solo la franja superior de la tarjeta. */}
                <div className="relative h-[26vh] max-h-[260px] w-full shrink-0 overflow-hidden">
                  <img
                    key={current.id}
                    src={current.coverImage}
                    alt={current.hotelName}
                    className="h-full w-full object-cover"
                  />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-[#faf8f2] to-transparent" />
                </div>

                <div className="px-6 pb-9 pt-6 text-center md:px-12 md:pb-11 md:pt-7">
                  <h2
                    id="work-modal-title"
                    key={current.id + '-name'}
                    className="font-serif text-2xl md:text-3xl"
                  >
                    {current.hotelName}
                  </h2>
                  <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-[#5a5854] md:text-xs">
                    {current.leftTag ? `${current.leftTag} · ` : ''}
                    {current.location}, {current.country}
                  </p>

                  {/* Selector superpuesto: cada miniatura se monta sobre la
                      anterior; la activa y la que se pasa por encima se
                      agrandan y suben de plano. Miniaturas grandes a
                      propósito -- las primeras eran ilegibles. */}
                  <div className="no-scrollbar mt-8 flex items-center justify-center overflow-x-auto py-2 md:mt-10 md:overflow-visible">
                    {stories.map((story, i) => (
                      <button
                        key={story.id}
                        onClick={() => setActive(i)}
                        aria-label={`Ver ${story.hotelName}`}
                        style={{ marginLeft: i === 0 ? 0 : -28, zIndex: i === active ? 20 : i }}
                        className={`group relative shrink-0 overflow-hidden rounded-[4px] border-2 border-[#faf8f2] shadow-[0_3px_14px_rgba(26,25,24,0.2)] transition-all duration-300 ease-out hover:z-30 hover:scale-125 ${
                          i === active ? 'w-20 scale-110 md:w-24' : 'w-16 scale-100 md:w-[72px]'
                        }`}
                      >
                        <span className="block aspect-video w-full">
                          <img src={story.coverImage} alt="" className="h-full w-full object-cover" />
                        </span>
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={openPortfolio}
                    className="mt-9 inline-block bg-[#1a1918] px-8 py-4 text-[11px] font-sans uppercase tracking-[0.22em] font-medium text-[#f5f3ed] transition-colors hover:bg-[#5a5854] md:px-10 md:py-[1.15rem] md:text-xs"
                  >
                    Ver portafolio
                  </button>
                </div>
              </div>
            </motion.aside>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
