import React from 'react';
import { Page } from '../types';
import { useIdioma } from '../src/lib/idioma';
import { crearT } from '../src/lib/textos';
import mayuLogoWhite from '../src/assets/images/mayu-logo-white.png';

interface FooterProps {
  onNavigate: (page: Page) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const t = crearT(useIdioma().idioma);

  return (
    <footer className="bg-[#1a1918] text-[#f5f3ed] pt-16 pb-12 px-6 md:px-16 font-sans border-t border-[#f5f3ed]/10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#f5f3ed]/15">
        {/* Brand */}
        <div className="md:col-span-4 space-y-4">
          <img src={mayuLogoWhite} alt="MAYU" className="h-[22px] w-auto" />
          <p className="text-xs text-[#f5f3ed]/60 max-w-xs leading-relaxed font-sans">
            {t('pieDescripcion')}
          </p>
        </div>

        {/* Links */}
        <div className="md:col-span-4 space-y-3">
          <span className="text-[11px] font-sans tracking-[0.25em] uppercase text-[#f5f3ed]/60 block mb-2">
            {t('pieNavegacion')}
          </span>
          <div className="flex flex-col space-y-2 text-xs font-sans tracking-wider uppercase text-[#f5f3ed]/80">
            <button onClick={() => onNavigate('home')} className="text-left hover:text-[#f5f3ed]">
              {t('navInicio')}
            </button>
            <button onClick={() => onNavigate('projects')} className="text-left hover:text-[#f5f3ed]">
              {t('navProyectos')}
            </button>
            <button onClick={() => onNavigate('about')} className="text-left hover:text-[#f5f3ed]">
              {t('navEquipo')}
            </button>
            <button onClick={() => onNavigate('contact')} className="text-left hover:text-[#f5f3ed]">
              {t('navContacto')}
            </button>
          </div>
        </div>

        {/* Contact & Social */}
        <div className="md:col-span-4 space-y-3">
          <span className="text-[11px] font-sans tracking-[0.25em] uppercase text-[#f5f3ed]/60 block mb-2">
            {t('pieContactoRedes')}
          </span>
          <p className="text-xs text-[#f5f3ed]/80">
            <a href="mailto:mayuviera@gmail.com" className="hover:text-[#f5f3ed]">
              mayuviera@gmail.com
            </a>
          </p>
          <div className="flex space-x-6 text-xs uppercase tracking-widest text-[#f5f3ed]/70 pt-2">
            <a
              href="https://instagram.com/mayurlintravel"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#f5f3ed]"
            >
              {t('instagram')}
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto pt-8 text-center text-[12px] font-sans text-[#f5f3ed]/50 tracking-wider">
        <span>&copy; {new Date().getFullYear()} Mayurlin Viera. {t('derechosReservados')}</span>
      </div>
    </footer>
  );
};
