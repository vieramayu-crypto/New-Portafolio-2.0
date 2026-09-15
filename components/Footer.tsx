import React from 'react';
import { Page } from '../types';
import mayuLogoWhite from '../src/assets/images/mayu-logo-white.png';

interface FooterProps {
  onNavigate: (page: Page) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#1a1918] text-[#f5f3ed] pt-16 pb-12 px-6 md:px-16 font-sans border-t border-[#f5f3ed]/10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#f5f3ed]/15">
        {/* Brand */}
        <div className="md:col-span-4 space-y-4">
          <img src={mayuLogoWhite} alt="MAYU" className="h-[25px] w-auto" />
          <p className="text-xs text-[#f5f3ed]/60 max-w-xs leading-relaxed font-sans">
            Producción visual para hoteles de lujo.
          </p>
        </div>

        {/* Links */}
        <div className="md:col-span-4 space-y-3">
          <span className="text-[11px] font-sans tracking-[0.25em] uppercase text-[#f5f3ed]/60 block mb-2">
            Navegación
          </span>
          <div className="flex flex-col space-y-2 text-xs font-sans tracking-wider uppercase text-[#f5f3ed]/80">
            <button onClick={() => onNavigate('home')} className="text-left hover:text-[#f5f3ed]">
              Inicio
            </button>
            <button onClick={() => onNavigate('projects')} className="text-left hover:text-[#f5f3ed]">
              Proyectos
            </button>
            <button onClick={() => onNavigate('about')} className="text-left hover:text-[#f5f3ed]">
              Acerca de
            </button>
            <button onClick={() => onNavigate('contact')} className="text-left hover:text-[#f5f3ed]">
              Contacto
            </button>
          </div>
        </div>

        {/* Contact & Social */}
        <div className="md:col-span-4 space-y-3">
          <span className="text-[11px] font-sans tracking-[0.25em] uppercase text-[#f5f3ed]/60 block mb-2">
            Contacto y redes
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
              Instagram
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto pt-8 text-center text-[12px] font-sans text-[#f5f3ed]/50 tracking-wider">
        <span>&copy; {new Date().getFullYear()} Mayurlin Viera. Todos los derechos reservados.</span>
      </div>
    </footer>
  );
};
