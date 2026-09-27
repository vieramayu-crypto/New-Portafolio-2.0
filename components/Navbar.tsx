import React, { useEffect, useRef, useState } from 'react';
import { Page } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { MENU_ABOUT_PHOTO, MAYU_PORTRAIT, HOME_MENU_PHOTO, PROJECTS_MENU_PHOTO } from '../data/media';
import mayuLogoBlack from '../src/assets/images/mayu-logo-black.png';
import { useIdioma } from '../src/lib/idioma';
import { crearT } from '../src/lib/textos';

interface NavbarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onOpenAvailability: () => void;
}

const PAGE_LABELS: Partial<Record<Page, 'navProyectosCorto' | 'navEquipo' | 'navContacto'>> = {
  projects: 'navProyectosCorto',
  about: 'navEquipo',
  contact: 'navContacto',
};

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
const Idiomas: React.FC<{ className?: string }> = ({ className }) => {
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

/** "Portafolio" llevaba a Inicio y Trabajo no estaba en el menú: no existía
 *  una URL del portafolio que enviar a un hotel. Ahora Proyectos es una
 *  página propia (/proyectos) y ocupa ese sitio. */
const MENU_ITEMS: { page: Page; clave: string; photo: string }[] = [
  { page: 'home', clave: 'navInicio', photo: HOME_MENU_PHOTO },
  { page: 'projects', clave: 'navProyectos', photo: PROJECTS_MENU_PHOTO },
  { page: 'about', clave: 'navEquipo', photo: MENU_ABOUT_PHOTO },
  { page: 'contact', clave: 'navContacto', photo: MAYU_PORTRAIT },
];

const DEFAULT_MENU_PHOTO = MAYU_PORTRAIT;

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate, onOpenAvailability }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<Page | null>(null);
  const { idioma } = useIdioma();
  const t = crearT(idioma);
  const claveRotulo = PAGE_LABELS[currentPage];
  const pageLabel = claveRotulo ? t(claveRotulo) : undefined;
  const activeMenuPhoto =
    MENU_ITEMS.find((item) => item.page === hoveredLink)?.photo || DEFAULT_MENU_PHOTO;

  const handleLinkClick = (page: Page) => {
    onNavigate(page);
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Top Header Chrome — solid white strip containing the logo/menu, same on mobile and desktop */}
      <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-4 md:px-12 md:py-8 bg-white pointer-events-none">
        {/* Left: Plain logo, no box */}
        <button onClick={() => handleLinkClick('home')} className="pointer-events-auto hover:opacity-70 transition-opacity">
          <img src={mayuLogoBlack} alt="MAYU" className="h-[22px] md:h-[26px] w-auto" />
        </button>

        {/* Right: Page indicator + Minimal Two-Line Menu Icon */}
        <div className="flex items-center gap-4 md:gap-6">
          {!isMenuOpen && <Idiomas />}
          {pageLabel && !isMenuOpen && (
            <span className="text-[11px] md:text-[12px] font-sans tracking-[0.25em] uppercase text-[#5a5854] pointer-events-none">
              {pageLabel}
            </span>
          )}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? t('menuCerrar') : t('menuAbrir')}
            aria-expanded={isMenuOpen}
            className="pointer-events-auto flex flex-col justify-center items-end gap-1.5 p-3 -m-1 focus:outline-none group cursor-pointer"
          >
            <span
              className={`h-[1.5px] bg-[#1a1918] transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
                isMenuOpen ? 'w-7 rotate-45 translate-y-[4px]' : 'w-8 group-hover:w-6'
              }`}
            />
            <span
              className={`h-[1.5px] bg-[#1a1918] transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
                isMenuOpen ? 'w-7 -rotate-45 -translate-y-[3.5px]' : 'w-5 group-hover:w-8'
              }`}
            />
          </button>
        </div>
      </header>

      {/* Fullscreen Overlay Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[60] bg-[#f5f3ed] flex flex-col justify-between px-6 py-8 md:px-16 md:py-12 overflow-y-auto"
          >
            {/* Top Row inside menu */}
            <div className="flex items-center justify-between">
              <button onClick={() => handleLinkClick('home')} className="hover:opacity-70 transition-opacity">
                <img src={mayuLogoBlack} alt="MAYU" className="h-[22px] md:h-[26px] w-auto" />
              </button>

              {/* EL INTERRUPTOR VA AQUÍ, no en la banda de abajo.
                  Con el menú abierto la cabecera queda por debajo de esta capa
                  y su interruptor no se puede tocar, así que hay que repetirlo
                  dentro. Primero estaba al pie del panel, y medido en un móvil
                  de 390x844 caía en y=851: siete píxeles por debajo del borde,
                  invisible sin desplazar el menú. Aquí arriba queda en el
                  mismo sitio en el que estaba antes de abrir. */}
              <div className="flex items-center gap-5">
                <Idiomas />
                <button
                  onClick={() => setIsMenuOpen(false)}
                  aria-label={t('menuCerrar')}
                  className="text-xs font-sans tracking-[0.2em] uppercase text-[#1a1918] hover:opacity-60 transition-opacity p-2"
                >
                  {t('menuCerrarCorchetes')}
                </button>
              </div>
            </div>

            {/* Main Page Links + Photo */}
            <div className="my-auto py-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center max-w-6xl mx-auto w-full">
              <div className="lg:col-span-4 hidden lg:block" />

              <div className="lg:col-span-4 flex flex-col items-center justify-center text-center space-y-8 md:space-y-10">
                {MENU_ITEMS.map((item) => (
                  <button
                    key={item.page}
                    onClick={() => handleLinkClick(item.page)}
                    onMouseEnter={() => setHoveredLink(item.page)}
                    onMouseLeave={() => setHoveredLink(null)}
                    className="group relative inline-block font-serif text-3xl md:text-5xl tracking-wide text-[#1a1918]"
                  >
                    {t(item.clave)}
                    <span
                      className={`pointer-events-none absolute left-0 -bottom-1 h-px w-full origin-left bg-[#1a1918] transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
                        currentPage === item.page ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                      }`}
                    />
                  </button>
                ))}
              </div>

              {/* Portrait that swaps with the hovered link */}
              <div className="lg:col-span-4 flex justify-center lg:justify-end">
                <div className="relative w-full max-w-[300px] aspect-[4/5] overflow-hidden shadow-sm">
                  <AnimatePresence mode="sync">
                    <motion.img
                      key={activeMenuPhoto}
                      src={activeMenuPhoto}
                      alt=""
                      referrerPolicy="no-referrer"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.6, ease: 'easeInOut' }}
                      className="absolute inset-0 w-full h-full object-cover object-[50%_20%] grayscale contrast-[1.12] brightness-[0.98]"
                    />
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Bottom Menu Info */}
            <div className="flex items-center justify-between pt-8 border-t border-[#1a1918]/10 text-xs font-sans tracking-[0.15em] text-[#5a5854] gap-4">
              <a
                href="https://instagram.com/mayurlintravel"
                target="_blank"
                rel="noreferrer"
                className="hidden sm:inline uppercase hover:text-[#1a1918] transition-colors"
              >
                {t('instagram')}
              </a>

              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onOpenAvailability();
                }}
                className="flex items-center space-x-2 text-[#1a1918] hover:opacity-70 transition-opacity uppercase font-medium"
              >
                <span>{t('consultarDisponibilidad')}</span>
                <span className="w-5 h-5 rounded-full bg-[#1a1918] text-[#f5f3ed] flex items-center justify-center text-[11px]">
                  &rarr;
                </span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
