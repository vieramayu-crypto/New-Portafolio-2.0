import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { HOTEL_STORIES } from '../data/hotels';
import { useSiteContent } from '../src/lib/content';

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 22, filter: 'blur(8px)' },
  whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' },
  viewport: { once: true, margin: '-90px' },
  transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] as const, delay },
});

/** "Trabajo" (pág. 11 de la auditoría): página editorial con los nueve
 *  proyectos existentes. Inicio deja de contener el portfolio completo y
 *  conduce aquí; cada entrada abre su propia ficha con URL real
 *  (/trabajo/:id), compartible directamente. El material no se borra ni se
 *  reduce -- solo cambia de sitio. */
export const WorkPage: React.FC = () => {
  const { hotels: hotelContent } = useSiteContent();

  const stories = useMemo(
    () =>
      HOTEL_STORIES.map((story, i) => ({
        ...story,
        hotelName: hotelContent[i]?.hotelName ?? story.hotelName,
        coupleName: hotelContent[i]?.coupleName ?? story.coupleName,
      })),
    [hotelContent]
  );

  return (
    <div className="min-h-screen bg-[#f5f3ed] px-6 pb-24 pt-32 text-[#1a1918] md:px-12 md:pt-40">
      <div className="mx-auto mb-16 max-w-3xl text-center md:mb-20">
        <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-[#5a5854] md:text-xs">
          Portafolio completo
        </span>
        <h1 className="mt-4 font-serif text-4xl text-[#1a1918] md:text-6xl">Trabajo</h1>
        <p className="mx-auto mt-5 max-w-[52ch] font-serif text-xl leading-snug text-[#1a1918]/80 md:text-2xl">
          Las nueve propiedades, con su propiedad, país y disciplinas.
        </p>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 sm:grid-cols-2 md:gap-10 lg:grid-cols-3">
        {stories.map((story, i) => (
          <motion.div key={story.id} {...rise(0.04 * (i % 6))}>
            <Link to={`/trabajo/${story.id}`} className="group block">
              <div className="relative aspect-[4/5] overflow-hidden bg-stone-200 shadow-lg">
                <img
                  src={story.coverImage}
                  alt={story.hotelName}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="mt-4 text-center">
                <div className="font-serif text-lg tracking-wide text-[#1a1918] md:text-xl">
                  {story.hotelName}
                </div>
                <div className="mt-1 text-[10px] font-sans uppercase tracking-[0.2em] text-[#5a5854] md:text-xs">
                  {story.location} · {story.country}
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
