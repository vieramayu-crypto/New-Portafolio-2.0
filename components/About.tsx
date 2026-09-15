import React from 'react';
import { motion } from 'motion/react';
import { FlipWords } from './FlipWords';
import { HowWeWork } from './HowWeWork';
import { COUPLE_PHOTO, MAYU_PORTRAIT, YERFRAN_PORTRAIT } from '../data/media';
import { useSiteContent } from '../src/lib/content';

interface AboutProps {
  onOpenAvailability: () => void;
}

export const About: React.FC<AboutProps> = ({ onOpenAvailability }) => {
  const content = useSiteContent();

  return (
    // `overflow-x-clip`, no `hidden`: los retratos entran desplazados 30px a
    // un lado y en móvil eso asomaba fuera de la pantalla. `hidden` recorta
    // igual pero convierte el div en contenedor de scroll y rompe cualquier
    // `position: sticky` que haya debajo.
    <div className="min-h-screen overflow-x-clip bg-[#f5f3ed] text-[#1a1918] font-sans">
      {/* Flip-words opening statement — full viewport, brutalist scale */}
      <section className="min-h-[100dvh] w-full flex flex-col items-center justify-center text-center px-6">
        <motion.h1
          initial={{ opacity: 0, y: 24, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className="font-serif font-medium text-[16vw] leading-[1.08] text-[#1a1918] sm:text-[13vw] md:text-[10.5vw]"
        >
          <span className="block">Fotografía,</span>
          <span className="block">cine y</span>
          <FlipWords words={content.about.flipWords} />
        </motion.h1>
      </section>

      {/* Franja de apertura: tesis de trabajo concreta + 4 datos rápidos,
          sustituye la lectura puramente emotiva por una que un gerente de
          marketing puede escanear en cinco segundos (pág. 13 de la auditoría).

          La foto de los dos era una banda aparte justo debajo. Unificadas:
          la foto es ahora el fondo a sangre completa de este bloque, así que
          quién lo dice y qué dice se leen a la vez, y Acerca de gana una
          pantalla entera. Texto en blanco y velo oscuro encima de la foto —
          el crema original sobre una foto en gris no se sostenía. */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.7 }}
        className="relative left-1/2 right-1/2 -mx-[50vw] mb-24 w-screen overflow-hidden md:mb-32"
      >
        <img
          src={COUPLE_PHOTO}
          alt="Mayurlin y Yerfran"
          referrerPolicy="no-referrer"
          className="absolute inset-0 h-full w-full object-cover object-[50%_32%] grayscale contrast-110"
        />
        {/* Velo plano + refuerzo arriba y abajo: la foto tiene cielo claro en
            la mitad superior y ahí el titular se quedaba corto de contraste. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[#1a1918]/60"
          style={{
            backgroundImage:
              'linear-gradient(180deg, rgba(26,25,24,.34), transparent 38%, transparent 62%, rgba(26,25,24,.30))',
          }}
        />

        <div className="relative mx-auto max-w-5xl px-6 py-20 text-center md:px-12 md:py-28">
          <h2 className="font-serif text-3xl leading-[1.15] text-white sm:text-4xl md:text-5xl">
            {content.about.overview.heading}
          </h2>
          <p className="mx-auto mt-6 max-w-[62ch] text-sm leading-relaxed text-white/80 md:text-base">
            {content.about.overview.paragraph}
          </p>

          <div className="mt-glass-async mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2 md:mt-12 md:gap-5">
            {content.about.overview.boxes.map((box) => (
              // `mt-glass` a secas, no la variante clara: esta vive sobre una
              // foto, no sobre crema. `relative` es obligatorio — los
              // ::before/::after del cristal anclan contra la caja.
              <div key={box.label} className="mt-glass relative overflow-hidden rounded-lg bg-white/[.07] p-5 text-left md:p-6">
                <div className="text-[10px] font-sans uppercase tracking-[0.22em] text-white/70 md:text-[11px]">
                  {box.label}
                </div>
                <div className="mt-1.5 font-serif text-lg text-white md:text-xl">{box.value}</div>
              </div>
            ))}
          </div>

          <div className="mt-10 md:mt-12">
            {/* Botón crema: el negro original se perdía sobre la foto oscura. */}
            <button
              onClick={() => document.getElementById('roles')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-[#f5f3ed] px-8 py-4 text-[11px] font-sans uppercase tracking-[0.22em] font-medium text-[#1a1918] transition-colors hover:bg-white md:px-10 md:py-[1.15rem] md:text-xs"
            >
              {content.about.overview.ctaLabel}
            </button>
          </div>
        </div>
      </motion.section>

      <div id="roles" className="max-w-6xl mx-auto px-6 md:px-12 pb-24 scroll-mt-24">
        {/* Mayu profile */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5"
          >
            <div className="relative aspect-[3/4] overflow-hidden shadow-md">
              <img
                src={MAYU_PORTRAIT}
                alt="Mayurlin Viera"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-[50%_20%] grayscale contrast-110"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="lg:col-span-7 space-y-4"
          >
            <h2 className="font-serif text-3xl md:text-4xl text-[#1a1918]">{content.about.mayurlin.name}</h2>
            <div className="text-[10px] font-sans uppercase tracking-[0.22em] text-[#5a5854] md:text-[11px]">
              {content.about.mayurlin.role}
            </div>
            <p className="text-sm md:text-base text-[#5a5854] leading-relaxed">{content.about.mayurlin.bio}</p>
          </motion.div>
        </div>

        {/* Yerfran profile */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-32">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 order-1 lg:order-2"
          >
            <div className="relative aspect-[3/4] overflow-hidden shadow-md">
              <img
                src={YERFRAN_PORTRAIT}
                alt="Yerfran"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-[50%_20%] grayscale contrast-110"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="lg:col-span-7 space-y-4 order-2 lg:order-1"
          >
            <h2 className="font-serif text-3xl md:text-4xl text-[#1a1918]">{content.about.yerfran.name}</h2>
            <div className="text-[10px] font-sans uppercase tracking-[0.22em] text-[#5a5854] md:text-[11px]">
              {content.about.yerfran.role}
            </div>
            <p className="text-sm md:text-base text-[#5a5854] leading-relaxed">{content.about.yerfran.bio}</p>
          </motion.div>
        </div>

        {/* Together */}
        <div className="min-h-[70vh] md:min-h-[85vh] flex flex-col items-center justify-center text-center px-2 py-20 mb-32 md:mb-40">
          <span className="text-[10px] font-sans uppercase tracking-[0.28em] text-[#5a5854] md:text-xs">
            {content.about.together.heading}
          </span>
          <p className="mt-6 font-serif text-3xl leading-[1.4] sm:text-4xl sm:leading-[1.38] md:text-[3.25rem] md:leading-[1.34] mx-auto max-w-4xl text-center text-[#1a1918]">
            {content.about.together.description}
          </p>
          <p className="mt-8 font-serif text-3xl leading-[1.4] sm:text-4xl sm:leading-[1.38] md:text-[3.25rem] md:leading-[1.34] mx-auto max-w-4xl text-center text-[#1a1918]">
            {content.about.closingStatement}
          </p>
          <div className="pt-16">
            <button
              onClick={onOpenAvailability}
              className="bg-[#1a1918] px-8 py-4 text-[11px] font-sans uppercase tracking-[0.22em] font-medium text-[#f5f3ed] transition-colors hover:bg-[#5a5854] md:px-10 md:py-[1.15rem] md:text-xs"
            >
              Consultar disponibilidad
            </button>
          </div>
        </div>

      </div>

      {/* How we work — full-width, replaces the old "Alcance de producción" block */}
      <HowWeWork />
    </div>
  );
};
