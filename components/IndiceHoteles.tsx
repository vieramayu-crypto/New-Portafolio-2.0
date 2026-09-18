import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

/** Lo mínimo que el índice necesita saber de un hotel. */
export interface HotelDelIndice {
  id: string;
  hotelName: string;
  location: string;
  coupleName: string;
}

interface IndiceHotelesProps {
  /** Los hoteles, EN EL ORDEN EN QUE APARECEN EN LA PÁGINA. El índice no
   *  reordena nada: si la página los pinta en otro orden, saltar de uno a otro
   *  se vuelve un juego de adivinanzas. */
  hoteles: HotelDelIndice[];
  /** El que está ahora a la vista, para marcarlo en la lista. */
  activoId?: string;
  /** Mientras sea falso, no se pinta. */
  visible: boolean;
  /** Un pie opcional debajo de la lista, separado por una línea.
   *
   *  En Inicio llevaba "Ver todas las propiedades", porque allí sólo se ven
   *  cuatro de los nueve hoteles. En Proyectos no se pasa nada: ahí ya están
   *  los nueve delante, y ofrecer "ver todas" sería mandar a donde ya se está. */
  pie?: React.ReactNode;
}

/** El índice flotante de hoteles.
 *
 *  Vivía dentro de `HomeMain`. Mayurlin lo quitó de Inicio -- "me hace hacer
 *  dos pasos para algo tan simple como ir directamente a la galería" -- y lo
 *  pidió en Proyectos, donde no es un atajo hacia otra página sino lo que de
 *  verdad es: un índice de lo que ya estás mirando.
 *
 *  Se sacó a su propio archivo en vez de copiarlo para que no haya dos
 *  versiones que se separen con el tiempo.
 */
export const IndiceHoteles: React.FC<IndiceHotelesProps> = ({
  hoteles,
  activoId,
  visible,
  pie,
}) => {
  const [abierto, setAbierto] = useState(false);

  /* Cerrar el selector tocando fuera. Antes la única salida era volver a
     pulsar la misma flecha que lo abrió: quien tocaba la pantalla veía que no
     pasaba nada y tenía que deducir el camino de vuelta. `pointerdown` cubre
     ratón y dedo a la vez, y el listener sólo existe mientras está abierto.
     Escape hace lo mismo para quien navega con teclado. */
  const cajaRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!abierto) return;
    const fuera = (e: PointerEvent) => {
      const n = cajaRef.current;
      if (!n) return;
      /* Por coordenadas, no con contains(): el contenedor es una banda de
         ancho completo, así que un toque a 300px del botón seguiría estando
         "dentro" de él. Sus hijos directos sí son cajas ajustadas -- el botón
         y, si está abierto, el panel. */
      const dentro = [...n.children].some((hijo) => {
        const r = hijo.getBoundingClientRect();
        return (
          e.clientX >= r.left && e.clientX <= r.right &&
          e.clientY >= r.top && e.clientY <= r.bottom
        );
      });
      if (!dentro) setAbierto(false);
    };
    const escape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAbierto(false);
    };
    document.addEventListener('pointerdown', fuera);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('pointerdown', fuera);
      document.removeEventListener('keydown', escape);
    };
  }, [abierto]);

  const irAlHotel = (id: string) => {
    setAbierto(false);
    document.getElementById(`hotel-${id}`)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          ref={cajaRef}
          className="fixed bottom-8 right-5 z-50 flex flex-col items-end md:right-8"
        >
          {/* SÓLO LA FLECHA, Y A LA DERECHA.
              Llevaba "Hoteles (9) ▲" y vivía centrado abajo: en Proyectos eso
              cae justo encima del nombre del hotel, que es lo único que hay
              que leer en ese punto de la página. Mayurlin mandó la referencia
              -- la misma caja de cristal con la flecha sola -- y la esquina
              donde la quiere. El rótulo no hace falta: lo que abre se explica
              solo en cuanto se abre, y ahí sigue estando "Ir a un hotel". */}
          <button
            onClick={() => setAbierto(!abierto)}
            aria-label={`Ir a un hotel (${hoteles.length})`}
            aria-expanded={abierto}
            className="mt-glass mt-glass-light pointer-events-auto relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-md text-[13px] text-[#1a1918] shadow-[0_2px_20px_rgba(26,25,24,0.14)] transition-all duration-300 hover:bg-[#1a1918] hover:text-[#f5f3ed]"
          >
            <span aria-hidden>{abierto ? '▼' : '▲'}</span>
          </button>

          {/* La lista, para saltar a cualquier hotel */}
          <AnimatePresence>
            {abierto && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.95 }}
                className="mt-glass mt-glass-light mt-glass-panel absolute bottom-14 right-0 z-50 w-[min(20rem,calc(100vw-2.5rem))] overflow-hidden rounded-lg text-left md:w-96 md:rounded-[10px]"
              >
                {/* El scroll vive aqui dentro, no en la caja: un
                    pseudo-elemento posicionado se desplaza con el
                    contenido de su contenedor con scroll, y el borde de
                    cristal acababa cruzando la lista como una linea
                    blanca. */}
                <div className="no-scrollbar max-h-80 space-y-1 overflow-y-auto p-3">
                  <div className="mb-1 border-b border-[#1a1918]/15 px-3 py-1.5 font-sans text-[11px] uppercase tracking-[0.2em] text-[#5a5854]">
                    Ir a un hotel
                  </div>
                  {hoteles.map((hotel) => (
                    <button
                      key={hotel.id}
                      onClick={() => irAlHotel(hotel.id)}
                      className={`w-full rounded-lg px-3 py-2.5 text-left font-sans text-xs transition-colors ${
                        activoId === hotel.id
                          ? 'bg-[#1a1918] text-[#fbfaf6] font-medium'
                          : 'text-[#1a1918] hover:bg-white/45'
                      }`}
                    >
                      <div>
                        <div className="font-serif text-sm tracking-wide font-medium">
                          {hotel.hotelName}
                        </div>
                        <div className="text-[11px] text-[#5a5854]">
                          {hotel.location} &bull; {hotel.coupleName}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                {pie}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
