import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useIdioma } from '../src/lib/idioma';

/* ESTE COMPONENTE VIVÍA DENTRO DE `Navbar.tsx`, y se sacó al necesitarlo en
   una segunda pantalla: la página del media kit, que va suelta y sin cabecera.
   Se saca en vez de copiarlo porque son dos sitios que tienen que comportarse
   igual, y dos copias se separan a la primera ronda. Mismo criterio que con
   `IndiceHoteles`, que también salió de donde estaba al mudarse. */

const IDIOMAS = [
  { codigo: 'es' as const, etiqueta: 'ES', aria: 'Ver la web en español' },
  { codigo: 'en' as const, etiqueta: 'EN', aria: 'View this site in English' },
];

/** EL INTERRUPTOR DE IDIOMA: DOS LETRAS, NO CUATRO.
 *
 *  Antes enseñaba las dos abreviaturas a la vez con una barra fina en medio
 *  ("ES | EN"), y Mayurlin lo vio enseguida: *"ocupa mucho espacio, más de lo
 *  que me gustaría"*. Medido: 58 px en móvil y 62 px en escritorio, la mitad
 *  de ellos para decir algo que el visitante ya sabe, porque está leyendo la
 *  web en ese idioma. Ahora son 30 y 33 px, casi la mitad exacta.
 *
 *  AHORA SÓLO SE VE EL IDIOMA ACTIVO. Al pulsarlo se abre un cuadrito con el
 *  otro, y elegirlo cambia la web. La cabecera recupera la mitad del hueco y
 *  el rótulo de la página vuelve a respirar.
 *
 *  EL CHEVRÓN ES DIMINUTO PERO NO SOBRA. Sin él, dos letras sueltas en una
 *  cabecera se leen como un rótulo, no como algo que se pueda tocar: el
 *  visitante no tiene forma de saber que ahí hay un idioma que cambiar. Son
 *  seis píxeles y es la única señal que lo dice.
 *
 *  SE CIERRA SOLO al elegir, al tocar fuera y con Escape. Sin lo de tocar
 *  fuera, en móvil se queda abierto por encima del contenido y hay que dar
 *  con la letra otra vez para cerrarlo.
 *
 *  Va en la cabecera, que es fija y está en todas las páginas, y se repite
 *  dentro del menú abierto: la cabecera es z-40 y la capa del menú z-60, así
 *  que con el menú abierto el de arriba queda por debajo y no se alcanza.
 */
export const SelectorIdioma: React.FC<{ className?: string }> = ({ className }) => {
  const { idioma, setIdioma } = useIdioma();
  const [abierto, setAbierto] = useState(false);
  const cajaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!abierto) return;
    const fuera = (e: Event) => {
      if (cajaRef.current && !cajaRef.current.contains(e.target as Node)) setAbierto(false);
    };
    const tecla = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAbierto(false);
    };
    document.addEventListener('mousedown', fuera);
    document.addEventListener('touchstart', fuera);
    document.addEventListener('keydown', tecla);
    return () => {
      document.removeEventListener('mousedown', fuera);
      document.removeEventListener('touchstart', fuera);
      document.removeEventListener('keydown', tecla);
    };
  }, [abierto]);

  const tipo = 'font-sans text-[11px] md:text-[12px] tracking-[0.25em] uppercase';
  const activo = IDIOMAS.find((i) => i.codigo === idioma) ?? IDIOMAS[0];
  const resto = IDIOMAS.filter((i) => i.codigo !== idioma);

  return (
    <div ref={cajaRef} className={`pointer-events-auto relative ${className || ''}`}>
      <button
        onClick={() => setAbierto((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={abierto}
        aria-label={activo.aria}
        className={`${tipo} flex items-center gap-1 text-[#1a1918] transition-opacity duration-300 hover:opacity-60`}
      >
        {activo.etiqueta}
        <span
          aria-hidden
          className={`text-[7px] leading-none transition-transform duration-300 ${
            abierto ? 'rotate-180' : ''
          }`}
        >
          ▾
        </span>
      </button>

      <AnimatePresence>
        {abierto && (
          <motion.div
            role="listbox"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            /* Alineado a la derecha, que es el borde por el que crece la
               cabecera: así el cuadrito nunca se sale por el lado de fuera
               en un móvil estrecho. */
            className="mt-glass mt-glass-light mt-glass-panel absolute right-0 top-[calc(100%+9px)] z-50 overflow-hidden rounded-md"
          >
            {resto.map((op) => (
              <button
                key={op.codigo}
                role="option"
                aria-selected={false}
                onClick={() => {
                  setIdioma(op.codigo);
                  setAbierto(false);
                }}
                aria-label={op.aria}
                className={`${tipo} block w-full px-4 py-2.5 text-[#1a1918] transition-colors duration-300 hover:bg-[#1a1918] hover:text-[#f5f3ed]`}
              >
                {op.etiqueta}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

