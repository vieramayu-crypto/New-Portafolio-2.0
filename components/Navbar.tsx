import React, { useState } from 'react';
import { Page } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { MENU_ABOUT_PHOTO, MAYU_PORTRAIT, PORTFOLIO_MENU_PHOTO } from '../data/media';
import mayuLogoBlack from '../src/assets/images/mayu-logo-black.png';

interface NavbarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onOpenAvailability: () => void;
}

const PAGE_LABELS: Partial<Record<Page, string>> = {
  about: 'Acerca de',
  contact: 'Contacto',
};

// The "Portafolio" link navigates to Home, so its hover-preview photo is
// tracked separately from Page rather than being a Page value itself.
type MenuLink = 'portfolio' | 'about' | 'contact';

const MENU_PHOTOS: Record<MenuLink, string> = {
  portfolio: PORTFOLIO_MENU_PHOTO,
  about: MENU_ABOUT_PHOTO,
  contact: MAYU_PORTRAIT,
};

const DEFAULT_MENU_PHOTO = MAYU_PORTRAIT;

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate, onOpenAvailability }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<MenuLink | null>(null);
  const pageLabel = PAGE_LABELS[currentPage];
  const activeMenuPhoto = (hoveredLink && MENU_PHOTOS[hoveredLink]) || DEFAULT_MENU_PHOTO;

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
          <img src={mayuLogoBlack} alt="MAYU" className="h-[25px] md:h-[30px] w-auto" />
        </button>

        {/* Right: Page indicator + Minimal Two-Line Menu Icon */}
        <div className="flex items-center gap-4 md:gap-6">
          {pageLabel && !isMenuOpen && (
            <span className="text-[10px] md:text-[11px] font-sans tracking-[0.25em] uppercase text-[#5a5854] pointer-events-none">
              {pageLabel}
            </span>
          )}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
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
                <img src={mayuLogoBlack} alt="MAYU" className="h-[25px] md:h-[30px] w-auto" />
              </button>

              <button
                onClick={() => setIsMenuOpen(false)}
                aria-label="Cerrar menú"
                className="text-xs font-sans tracking-[0.2em] uppercase text-[#1a1918] hover:opacity-60 transition-opacity p-2"
              >
                [ CERRAR ]
              </button>
            </div>

            {/* Main Page Links + Photo */}
            <div className="my-auto py-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center max-w-6xl mx-auto w-full">
              <div className="lg:col-span-4 hidden lg:block" />

              <div className="lg:col-span-4 flex flex-col items-center justify-center text-center space-y-8 md:space-y-10">
                <button
                  onClick={() => handleLinkClick('home')}
                  onMouseEnter={() => setHoveredLink('portfolio')}
                  onMouseLeave={() => setHoveredLink(null)}
                  className="group relative inline-block font-serif text-3xl md:text-5xl tracking-wide text-[#1a1918]"
                >
                  Portafolio
                  <span
                    className={`pointer-events-none absolute left-0 -bottom-1 h-px w-full origin-left bg-[#1a1918] transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
                      currentPage === 'home' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`}
                  />
                </button>

                <button
                  onClick={() => handleLinkClick('about')}
                  onMouseEnter={() => setHoveredLink('about')}
                  onMouseLeave={() => setHoveredLink(null)}
                  className="group relative inline-block font-serif text-3xl md:text-5xl tracking-wide text-[#1a1918]"
                >
                  Acerca de
                  <span
                    className={`pointer-events-none absolute left-0 -bottom-1 h-px w-full origin-left bg-[#1a1918] transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
                      currentPage === 'about' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`}
                  />
                </button>

                <button
                  onClick={() => handleLinkClick('contact')}
                  onMouseEnter={() => setHoveredLink('contact')}
                  onMouseLeave={() => setHoveredLink(null)}
                  className="group relative inline-block font-serif text-3xl md:text-5xl tracking-wide text-[#1a1918]"
                >
                  Contacto
                  <span
                    className={`pointer-events-none absolute left-0 -bottom-1 h-px w-full origin-left bg-[#1a1918] transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
                      currentPage === 'contact' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`}
                  />
                </button>
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
                className="uppercase hover:text-[#1a1918] transition-colors"
              >
                Instagram
              </a>

              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onOpenAvailability();
                }}
                className="flex items-center space-x-2 text-[#1a1918] hover:opacity-70 transition-opacity uppercase font-medium"
              >
                <span>Consultar disponibilidad</span>
                <span className="w-5 h-5 rounded-full bg-[#1a1918] text-[#f5f3ed] flex items-center justify-center text-[10px]">
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
