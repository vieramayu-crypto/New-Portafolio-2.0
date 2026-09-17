import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { HOTEL_STORIES } from '../data/hotels';
import { CASE_STUDIES } from '../data/caseStudies';
import { useSiteContent } from '../src/lib/content';
import { toTitleCase } from '../src/lib/hotelName';
import { versionMovil, MEDIA_MOVIL } from '../src/lib/foto';
import { BrandsMarquee } from './BrandsMarquee';
import { HotelSectionBlock } from './HotelSectionBlock';

interface ProjectsPageProps {
  onOpenAvailability: () => void;
}

/** La primera frase de la descripción del hotel, que es la que resume qué
 *  prueba ese trabajo ("Arquitectura, jardines, spa y gastronomía en una
 *  selección visual del resort"). El resto es la evocación, y debajo de un
 *  mosaico de tres fotos sobra: aquí hace falta el rótulo, no el párrafo. */
function primeraFrase(texto: string): string {
  const corte = texto.indexOf('. ');
  return corte === -1 ? texto : texto.slice(0, corte + 1);
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
  const location = useLocation();
  const navigate = useNavigate();

  // Quien entra a la galería de un hotel por un enlace directo no tiene
  // pantalla anterior a la que volver, así que su botón Volver trae aquí
  // señalando ese hotel. Aterrizar arriba del todo dejaría al visitante
  // buscando a mano el bloque del que acaba de salir.
  const irA = (location.state as { irA?: string } | null)?.irA;
  useEffect(() => {
    if (!irA) return;
    const destino = document.getElementById(`hotel-${irA}`);
    if (destino) destino.scrollIntoView({ block: 'start', behavior: 'instant' as ScrollBehavior });
  }, [irA]);

  const stories = HOTEL_STORIES.map((story, i) => ({
    ...story,
    hotelName: hotelContent[i]?.hotelName ?? story.hotelName,
    description: hotelContent[i]?.description ?? story.description,
  }));

  // Ya no se separan en dos bloques con diseños distintos: los nueve van
  // seguidos, con el mismo mosaico, y lo que distingue a uno con caso
  // documentado es que su ficha añade el enlace "Ver proyecto".
  const caseByHotel = new Map(CASE_STUDIES.map((c) => [c.hotelId, c]));

  return (
    <div className="min-h-screen bg-[#f5f3ed] text-[#1a1918] font-sans">
      {/* Apertura */}
      <section className="mx-auto max-w-4xl px-6 pb-10 pt-32 text-center md:px-12 md:pb-14 md:pt-44">
        {/* El titular y una sola línea de posicionamiento. Antes había aquí un
            párrafo que explicaba qué era un proyecto y qué el portafolio, y las
            dos secciones de más abajo lo volvían a decir cada una en su sitio:
            se leía lo mismo tres veces antes de llegar a una foto. Esa
            explicación se quedó donde hace falta, pegada a lo que nombra. Lo
            que sí falta aquí es a quién se dirige el estudio, porque a esta
            página se entra por un enlace suelto, sin haber pasado por Inicio. */}
        <motion.div {...rise(0)}>
          <h1 className="font-serif text-[13vw] leading-[1.04] tracking-[-0.03em] sm:text-[9vw] md:text-[5vw]">
            {projects.heading}
          </h1>
          <p className="mx-auto mt-6 max-w-[44ch] font-sans text-[13px] leading-[1.6] text-[#5a5854] md:mt-7 md:text-sm">
            {projects.subline}
          </p>
        </motion.div>
      </section>

      {/* Regla a sangre completa = cambio de sección */}
      <div className="h-px w-full bg-[#1a1918]/12" />

      {/* LAS NUEVE PROPIEDADES, CON EL MOSAICO DE INICIO.
          Antes esta página enseñaba lo mismo de dos maneras distintas: los
          casos como una foto horizontal a pantalla completa, y las galerías
          como una foto al 80% con la ficha al lado. Dos lenguajes en una
          página que resume las dos cosas, y ninguno era el de Inicio.

          Ahora es el mosaico de tres fotos de Inicio, que ya está probado en
          móvil y en escritorio y es el que sostiene la web. La página es más
          larga -- son nueve bloques -- pero se lee como el resto y se entiende
          de un vistazo qué hay dentro.

          Lo que distingue un proyecto de una galería ya no es el diseño sino
          los enlaces de su ficha: "Ver proyecto" sólo aparece donde hay un
          caso documentado. */}
      {stories.map((story, index) => {
        const caseStudy = caseByHotel.get(story.id);
        return (
          <React.Fragment key={story.id}>
            {/* El id para anclar lo pone ya HotelSectionBlock; repetirlo aquí
                dejaba dos elementos con el mismo id y el Volver aterrizaba en
                el primero que encontrara. */}
            <HotelSectionBlock
              story={story}
              index={index}
              onSelectStory={(s) => navigate(`/trabajo/${s.id}`)}
            />

            {/* Misma ficha que en Inicio: nombre, qué prueba este trabajo y
                las salidas. Fuera del lienzo de fotos, que no se toca. */}
            <div className="mx-auto -mt-6 max-w-3xl px-6 pb-20 text-center md:-mt-10 md:pb-28">
              <h3 className="font-serif text-xl leading-[1.25] md:text-2xl">
                {toTitleCase(story.hotelName)}
              </h3>
              <p className="mx-auto mt-3 max-w-[46ch] text-[14px] leading-[1.7] text-[#5a5854] md:text-sm">
                {primeraFrase(story.description)}
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
                {caseStudy && (
                  <Link
                    to={`/proyecto/${caseStudy.slug}`}
                    className="border-b border-[#1a1918]/65 pb-1.5 text-[11px] font-sans uppercase tracking-[0.22em] text-[#1a1918] transition-colors hover:border-[#1a1918] md:text-[12px]"
                  >
                    {projects.caseLinkLabel}
                  </Link>
                )}
                <Link
                  to={`/trabajo/${story.id}`}
                  className="border-b border-[#1a1918]/65 pb-1.5 text-[11px] font-sans uppercase tracking-[0.22em] text-[#1a1918] transition-colors hover:border-[#1a1918] md:text-[12px]"
                >
                  {projects.galleryLinkLabel}
                </Link>
              </div>
            </div>
          </React.Fragment>
        );
      })}

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
            className="mt-9 bg-[#1a1918] px-8 py-4 text-[12px] font-sans uppercase tracking-[0.22em] font-medium text-[#f5f3ed] transition-colors hover:bg-[#5a5854] md:mt-11 md:px-10 md:py-[1.15rem] md:text-xs"
          >
            {projects.ctaLabel}
          </button>
        </motion.div>
      </section>
    </div>
  );
};
