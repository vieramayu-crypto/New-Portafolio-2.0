import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { HOTEL_STORIES } from '../data/hotels';
import { CASE_STUDIES } from '../data/caseStudies';
import { useSiteContent } from '../src/lib/content';
import { toTitleCase } from '../src/lib/hotelName';
import { BrandsMarquee } from './BrandsMarquee';

interface ProjectsPageProps {
  onOpenAvailability: () => void;
}

/** Misma entrada suave que usan Qué creamos, Formas de trabajar y el cierre
 *  de Inicio: la página nueva no estrena animación propia. */
const rise = (delay: number) => ({
  initial: { opacity: 0, y: 22, filter: 'blur(8px)' },
  whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' },
  viewport: { once: true, margin: '-90px' },
  transition: { duration: 0.75, ease: [0.4, 0, 0.2, 1] as const, delay },
});

/** Página Proyectos (pág. 5 y 17 de la auditoría). Trabajo vivía solo en una
 *  ventana emergente, así que no había ninguna URL que enviar a un hotel con
 *  el portafolio entero: había que recorrer Inicio. Esta página es esa URL.
 *
 *  Separa a propósito dos cosas que antes se leían igual: el caso documentado
 *  (encargo, dirección, producción y entrega) y las galerías, que son una
 *  selección de imágenes. Etiquetar de "caso" una galería sin contexto era
 *  justo lo que la auditoría pedía evitar. */
export const ProjectsPage: React.FC<ProjectsPageProps> = ({ onOpenAvailability }) => {
  const { projects, hotels: hotelContent } = useSiteContent();

  const stories = HOTEL_STORIES.map((story, i) => ({
    ...story,
    hotelName: hotelContent[i]?.hotelName ?? story.hotelName,
    description: hotelContent[i]?.description ?? story.description,
  }));

  const caseBySlug = new Map(CASE_STUDIES.map((c) => [c.hotelId, c]));
  const featured = stories.find((s) => caseBySlug.has(s.id));
  const featuredCase = featured ? caseBySlug.get(featured.id) : undefined;
  const rest = stories.filter((s) => s.id !== featured?.id);

  return (
    <div className="min-h-screen bg-[#f5f3ed] text-[#1a1918] font-sans">
      {/* Apertura */}
      <section className="mx-auto max-w-4xl px-6 pt-32 pb-16 text-center md:px-12 md:pt-44 md:pb-24">
        <motion.div {...rise(0)}>
          <div className="font-sans text-[9px] uppercase tracking-[0.28em] text-[#5a5854] md:text-[10px]">
            {projects.eyebrow}
          </div>
          <h1 className="mt-5 font-serif text-[15vw] leading-[1.04] tracking-[-0.03em] sm:text-[10vw] md:mt-6 md:text-[5.4vw]">
            {projects.heading}
          </h1>
          <p className="mx-auto mt-6 max-w-[52ch] text-[13px] leading-[1.7] text-[#5a5854] md:mt-8 md:text-sm">
            {projects.intro}
          </p>
        </motion.div>
      </section>

      {/* Regla a sangre completa = cambio de sección */}
      <div className="h-px w-full bg-[#1a1918]/12" />

      {/* Caso documentado: foto a sangre y ficha debajo, para que se distinga
          de un vistazo de las galerías que vienen después. */}
      {featured && featuredCase && (
        <section className="pb-20 md:pb-28">
          <motion.div {...rise(0)}>
            <Link to={`/proyecto/${featuredCase.slug}`} className="group block">
              <div className="relative h-[58vh] min-h-[320px] w-full overflow-hidden bg-stone-200 md:h-[72vh]">
                <img
                  src={featured.coverImage}
                  alt={toTitleCase(featured.hotelName)}
                  className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
              </div>
            </Link>

            <div className="mx-auto max-w-4xl px-6 pt-10 text-center md:px-12 md:pt-14">
              <div className="font-sans text-[9px] uppercase tracking-[0.28em] text-[#5a5854] md:text-[10px]">
                {projects.caseLabel}
              </div>
              <h2 className="mt-4 font-serif text-3xl leading-[1.15] md:mt-5 md:text-[2.9rem]">
                {toTitleCase(featured.hotelName)}
              </h2>
              <div className="mt-3 font-sans text-[11px] uppercase tracking-[0.2em] text-[#5a5854] md:text-xs">
                {featured.location} · {featured.country} · {featured.year}
              </div>
              <p className="mx-auto mt-6 max-w-[58ch] text-[13px] leading-[1.75] text-[#5a5854] md:text-sm">
                {featured.description}
              </p>

              <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row md:mt-11">
                <Link
                  to={`/proyecto/${featuredCase.slug}`}
                  className="bg-[#1a1918] px-8 py-4 text-[11px] font-sans uppercase tracking-[0.22em] font-medium text-[#f5f3ed] transition-colors hover:bg-[#5a5854] md:px-10 md:py-[1.15rem] md:text-xs"
                >
                  {projects.caseLinkLabel}
                </Link>
                <Link
                  to={`/trabajo/${featured.id}`}
                  className="border-b border-[#1a1918]/65 pb-2 text-[10px] font-sans uppercase tracking-[0.22em] text-[#1a1918] transition-colors hover:border-[#1a1918] md:text-[11px]"
                >
                  {projects.galleryLinkLabel}
                </Link>
              </div>
            </div>
          </motion.div>
        </section>
      )}

      <div className="h-px w-full bg-[#1a1918]/12" />

      {/* Galerías: filas alternas, foto grande y ficha al lado. */}
      <section className="mx-auto max-w-6xl px-6 py-20 md:px-12 md:py-28">
        <div className="space-y-20 md:space-y-32">
          {rest.map((story, i) => {
            const photoFirst = i % 2 === 0;
            return (
              <motion.article
                key={story.id}
                {...rise(0)}
                className="grid grid-cols-1 items-center gap-8 md:grid-cols-12 md:gap-12"
              >
                <Link
                  to={`/trabajo/${story.id}`}
                  className={`group block md:col-span-7 ${photoFirst ? '' : 'md:order-2'}`}
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-200">
                    <img
                      src={story.coverImage}
                      alt={story.hotelName}
                      className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
                    />
                  </div>
                </Link>

                <div className={`md:col-span-5 ${photoFirst ? '' : 'md:order-1'}`}>
                  <div className="font-sans text-[9px] uppercase tracking-[0.28em] text-[#5a5854] md:text-[10px]">
                    {projects.galleryLabel}
                  </div>
                  <h2 className="mt-3 font-serif text-2xl leading-[1.2] md:mt-4 md:text-[2rem]">
                    {toTitleCase(story.hotelName)}
                  </h2>
                  <div className="mt-2.5 font-sans text-[11px] uppercase tracking-[0.2em] text-[#5a5854]">
                    {story.location} · {story.country}
                  </div>
                  <p className="mt-5 max-w-[46ch] text-[13px] leading-[1.75] text-[#5a5854]">
                    {story.description}
                  </p>
                  <Link
                    to={`/trabajo/${story.id}`}
                    className="mt-6 inline-block border-b border-[#1a1918]/65 pb-2 text-[10px] font-sans uppercase tracking-[0.22em] text-[#1a1918] transition-colors hover:border-[#1a1918] md:text-[11px]"
                  >
                    {projects.galleryLinkLabel}
                  </Link>
                </div>
              </motion.article>
            );
          })}
        </div>
      </section>

      <div className="h-px w-full bg-[#1a1918]/12" />

      {/* La lista completa de marcas vive aquí: en Inicio solo van las
          primeras, porque veintidós nombres seguidos no se recuerdan. */}
      <BrandsMarquee />

      <div className="h-px w-full bg-[#1a1918]/12" />

      {/* Cierre: un solo CTA, el mismo de toda la web. */}
      <section className="mx-auto max-w-3xl px-6 py-20 text-center md:px-12 md:py-28">
        <motion.div {...rise(0)}>
          <h2 className="mx-auto max-w-[22ch] font-serif text-3xl leading-[1.2] md:text-[2.6rem]">
            {projects.closingHeading}
          </h2>
          <button
            onClick={onOpenAvailability}
            className="mt-9 bg-[#1a1918] px-8 py-4 text-[11px] font-sans uppercase tracking-[0.22em] font-medium text-[#f5f3ed] transition-colors hover:bg-[#5a5854] md:mt-11 md:px-10 md:py-[1.15rem] md:text-xs"
          >
            {projects.ctaLabel}
          </button>
        </motion.div>
      </section>
    </div>
  );
};
