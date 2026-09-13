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
    <div className="min-h-screen bg-[#f5f3ed] text-[#1a1918] font-sans">
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

      {/* Intro paragraph — its own full-screen section, generous breathing room */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.7 }}
        className="min-h-[100dvh] w-full flex items-center justify-center px-6 py-24"
      >
        <p className="font-serif text-3xl leading-[1.4] sm:text-4xl sm:leading-[1.38] md:text-[3.25rem] md:leading-[1.34] mx-auto max-w-4xl text-center text-[#1a1918]">
          {content.about.introStatement}
        </p>
      </motion.section>

      {/* Legacy statement — full-width photo background, text overlaid */}
      <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen min-h-[90vh] md:min-h-[100dvh] mb-24 md:mb-32 overflow-hidden">
        <img
          src={COUPLE_PHOTO}
          alt="Mayurlin and Yerfran"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover grayscale contrast-110"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/10" />
        <div className="relative min-h-[90vh] md:min-h-[100dvh] flex items-center justify-center px-6 md:px-16">
          <p className="font-serif text-3xl leading-[1.4] sm:text-4xl sm:leading-[1.38] md:text-[3.25rem] md:leading-[1.34] mx-auto max-w-4xl text-center text-white">
            &ldquo;{content.about.legacyQuote}&rdquo;
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-12 pb-24">
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
            <p className="text-sm md:text-base text-[#5a5854] leading-relaxed">{content.about.yerfran.bio}</p>
          </motion.div>
        </div>

        {/* Together */}
        <div className="min-h-[70vh] md:min-h-[85vh] flex flex-col items-center justify-center text-center px-2 py-20 mb-32 md:mb-40">
          <p className="font-serif text-3xl leading-[1.4] sm:text-4xl sm:leading-[1.38] md:text-[3.25rem] md:leading-[1.34] mx-auto max-w-4xl text-center text-[#1a1918]">
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
