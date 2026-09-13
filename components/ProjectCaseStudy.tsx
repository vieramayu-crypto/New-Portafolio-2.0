import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { CASE_STUDIES } from '../data/caseStudies';
import { HOTEL_STORIES } from '../data/hotels';

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-90px' },
  transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] as const, delay },
});

/** "Proyecto" (pág. 12 de la auditoría): a diferencia de Trabajo (galería
 *  completa, las nueve propiedades), esta página cuenta el encargo con
 *  contexto real -- sin inventar métricas de conversión que no existen. Solo
 *  GPRO por ahora (data/caseStudies.ts); se replica esta misma plantilla para
 *  InterContinental y Vestige cuando se prioricen. */
export const ProjectCaseStudy: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const caseStudy = CASE_STUDIES.find((c) => c.slug === id);
  const hotel = caseStudy ? HOTEL_STORIES.find((h) => h.id === caseStudy.hotelId) : undefined;

  if (!caseStudy || !hotel) {
    navigate('/trabajo', { replace: true });
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f5f3ed] text-[#1a1918]">
      <section className="relative h-[70vh] min-h-[420px] w-full overflow-hidden bg-stone-200">
        <img src={hotel.coverImage} alt={hotel.hotelName} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 px-6 pb-10 text-center md:px-12 md:pb-14">
          <span className="text-[10px] font-sans uppercase tracking-[0.28em] text-white/75 md:text-xs">
            Caso de estudio
          </span>
          <h1 className="mt-3 font-serif text-3xl text-white sm:text-4xl md:text-5xl">{caseStudy.heading}</h1>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-6 py-20 md:px-12 md:py-28">
        <div className="divide-y divide-[#1a1918]/12">
          {caseStudy.sections.map((section, i) => (
            <motion.div key={section.number} {...rise(0.05 * i)} className="py-9 md:py-11">
              <div className="flex gap-6 md:gap-10">
                <div className="shrink-0 font-serif text-2xl italic text-[#1a1918]/40 md:text-3xl">
                  {section.number}
                </div>
                <div>
                  <h2 className="font-serif text-xl text-[#1a1918] md:text-2xl">{section.title}</h2>
                  <p className="mt-3 font-sans text-sm leading-relaxed text-[#5a5854] md:text-[15px]">
                    {section.body}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-14 text-center md:mt-16">
          <Link
            to={`/trabajo/${hotel.id}`}
            className="inline-block bg-[#1a1918] px-8 py-4 text-[11px] font-sans uppercase tracking-[0.22em] font-medium text-[#f5f3ed] transition-colors hover:bg-[#5a5854] md:px-10 md:py-[1.15rem] md:text-xs"
          >
            Ver galería completa
          </Link>
        </div>
      </div>
    </div>
  );
};
