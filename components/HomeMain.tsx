import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { HOTEL_STORIES } from '../data/hotels';
import { HotelStory, Page } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { HeroSection } from './HeroSection';
import { HotelSectionBlock } from './HotelSectionBlock';
import { ValueBlock } from './ValueBlock';
import { VideoShowcase, VideoVerticalesInicio } from './VideoShowcase';
import { WhatWeCreate } from './WhatWeCreate';
import { WhyUs } from './WhyUs';
import { WaysToWork } from './WaysToWork';
import { ClosingCta } from './ClosingCta';
import { Testimonials } from './Testimonials';
import { BrandsMarquee } from './BrandsMarquee';
import { useSiteContent } from '../src/lib/content';
import { toTitleCase } from '../src/lib/hotelName';
import { CASE_STUDIES } from '../data/caseStudies';

/** Inicio muestra solo las propiedades insignia. Cada una responde a una
 *  objeción distinta (auditoría, p. 11): Abama prueba el nivel de resort de
 *  lujo, GPRO la relación que se repite, Vestige la identidad boutique e
 *  InterContinental el hotel urbano de cadena. Las nueve siguen intactas en
 *  /proyectos; aquí solo se reduce la vitrina, nunca se borra ningún hotel. */
const FLAGSHIP_IDS = [
  'ritz-carlton-abama',
  'gpro-valparaiso',
  'vestige-binidufa',
  'intercontinental-lisboa',
];

interface HomeMainProps {
  /** El hero no anima hasta que el video de intro se va: si no, la entrada se
   *  reproduce entera detras del video y al descubrirse ya esta puesta. */
  introDone: boolean;
  onNavigate: (page: Page) => void;
  onOpenAvailability: () => void;
  onSelectStory?: (story: HotelStory) => void;
}

function renderTwoLineHotelName(name: string) {
  const parts = name.trim().split(' ');
  if (parts.length <= 1) {
    return <span>{name}</span>;
  }
  
  const mid = Math.ceil(parts.length / 2);
  const line1 = parts.slice(0, mid).join(' ');
  const line2 = parts.slice(mid).join(' ');

  return (
    <span className="inline-block leading-snug">
      <span className="block">{line1}</span>
      <span className="block">{line2}</span>
    </span>
  );
}

export const HomeMain: React.FC<HomeMainProps> = ({
  introDone,
  onNavigate,
  onOpenAvailability,
  onSelectStory,
}) => {
  const [activeStoryIndex, setActiveStoryIndex] = useState<number>(0);

  // Los rotulos laterales se apagan cuando el centro de la pantalla sale de la
  // seccion. Habia un segundo estado, para el boton flotante, que se apagaba
  // cuando salia la seccion entera; el boton se fue a Proyectos y con el ese
  // estado y su observador.
  const [centroEnHoteles, setCentroEnHoteles] = useState<boolean>(false);
  const [isValueBlockVisible, setIsValueBlockVisible] = useState<boolean>(false);

  const { hotels: hotelContent } = useSiteContent();

  // Structural data (photos, layout, ids, routing) stays in code; the
  // editable text fields are overlaid from content.json at runtime.
  const hotelStories = useMemo(
    () =>
      HOTEL_STORIES.map((story, i) => ({
        ...story,
        hotelName: hotelContent[i]?.hotelName ?? story.hotelName,
        coupleName: hotelContent[i]?.coupleName ?? story.coupleName,
        description: hotelContent[i]?.description ?? story.description,
        quote: hotelContent[i]?.quote ?? story.quote,
        featuredLine: hotelContent[i]?.featuredLine,
      })),
    [hotelContent]
  );

  // Subconjunto que realmente se pinta en Inicio, en el orden fijo de la
  // auditoría -- el resto del código sigue hablando de hotelStories (las
  // nueve) para el overlay de contenido y el buscador por id.
  const flagshipStories = useMemo(
    () =>
      FLAGSHIP_IDS.map((id) => hotelStories.find((s) => s.id === id)).filter(
        (s): s is (typeof hotelStories)[number] => Boolean(s)
      ),
    [hotelStories]
  );

  const currentStory = hotelStories[activeStoryIndex] || hotelStories[0];

  // Observe which hotel section is currently in the middle of the viewport
  useEffect(() => {
    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const hotelId = entry.target.getAttribute('data-hotel-id');
          const foundIndex = HOTEL_STORIES.findIndex((h) => h.id === hotelId);
          if (foundIndex !== -1) {
            setActiveStoryIndex(foundIndex);
          }
        }
      });
    };

    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: '-25% 0px -25% 0px',
      threshold: 0.05,
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const sectionElements = document.querySelectorAll('.hotel-section-block');
    sectionElements.forEach((el) => observer.observe(el));

    // Los rotulos laterales viven anclados al CENTRO vertical de la pantalla
    // (top-1/2), asi que tienen que verse exactamente mientras ese centro cae
    // dentro de la seccion de hoteles -- ni un pixel mas.
    //
    // Antes esto miraba si la seccion entera segu­ia tocando la pantalla, con
    // un umbral del 2%. La seccion mide 7.235 px: el 2% son 145, asi que con
    // 200 px de seccion asomando por abajo el observador segu­ia diciendo que
    // si, mientras el centro de la pantalla ya estaba dentro de los
    // testimonios. Resultado medido: "HOTEL" y "THE RITZ-CARLTON TENERIFE,
    // ABAMA" a opacidad 1 encima de una cita de Costa Magica.
    //
    // El rootMargin de -50% arriba y abajo encoge la zona de deteccion a una
    // franja de un pixel justo en el centro. Asi "intersecar" pasa a
    // significar literalmente "el centro de la pantalla esta aqui dentro",
    // que es la regla que hace falta.
    const hotelSectionEl = document.getElementById('hotel-section');
    const containerObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0]) {
          setCentroEnHoteles(entries[0].isIntersecting);
        }
      },
      { rootMargin: '-50% 0px -50% 0px', threshold: 0 }
    );
    if (hotelSectionEl) {
      containerObserver.observe(hotelSectionEl);
    }

    // El bloque de valor ocupa la pantalla entera con su propio texto grande:
    // mientras esta a la vista se apartan los rotulos laterales y el boton
    // flotante, que si no se le montarian encima.
    const valueBlockEl = document.getElementById('value-block');
    const valueBlockObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0]) {
          setIsValueBlockVisible(entries[0].isIntersecting);
        }
      },
      { threshold: 0.12 }
    );
    if (valueBlockEl) {
      valueBlockObserver.observe(valueBlockEl);
    }

    return () => {
      sectionElements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
      if (hotelSectionEl) {
        containerObserver.unobserve(hotelSectionEl);
      }
      containerObserver.disconnect();
      if (valueBlockEl) {
        valueBlockObserver.unobserve(valueBlockEl);
      }
      valueBlockObserver.disconnect();
    };
  }, []);

  const rotulosVisibles = centroEnHoteles && !isValueBlockVisible;

  return (
    <div className="relative min-h-screen bg-[#fbfaf6] text-[#1a1918] select-none font-sans overflow-x-clip">
      {/* Hero Section */}
      <HeroSection introDone={introDone} onOpenAvailability={onOpenAvailability} />

      <WhatWeCreate />
      <ValueBlock />
      <VideoShowcase />

      {/* Target for smooth scroll from Hero */}
      <div id="hotel-section" className="relative pt-6">
        <div className="relative w-full pb-32">
          {/* Viewport-fixed Side Labels (Locked in place at screen vertical center while scrolling) */}
          <AnimatePresence>
            {rotulosVisibles && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed top-1/2 -translate-y-1/2 left-0 right-0 z-30 pointer-events-none px-2 md:px-3 lg:px-4 hidden md:flex items-center justify-between w-full"
              >
                {/* Left Tag */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStory.id + '-left'}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="font-serif text-base lg:text-xl tracking-[0.25em] text-[#1a1918] uppercase font-light"
                  >
                    {currentStory.leftTag || 'HOTEL'}
                  </motion.div>
                </AnimatePresence>

                {/* Right Hotel Name */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStory.id + '-right'}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="font-serif text-base lg:text-xl tracking-[0.18em] text-[#1a1918] uppercase font-light text-right max-w-[200px] lg:max-w-[250px]"
                  >
                    {renderTwoLineHotelName(currentStory.hotelName)}
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Cabecera de la vitrina: sin ella, cuatro bloques de fotos
              seguidos no decían qué eran ni por qué estaban ahí. */}
          <motion.div
            initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-90px' }}
            transition={{ duration: 0.75, ease: [0.4, 0, 0.2, 1] }}
            className="mx-auto max-w-3xl px-6 pb-4 text-center md:pb-10"
          >
            <h2 className="font-serif text-3xl leading-[1.15] md:text-[2.9rem]">
              Proyectos destacados
            </h2>
          </motion.div>

          {/* Vitrina de Inicio: solo las propiedades insignia (sin líneas divisorias) */}
          {flagshipStories.map((story, index) => {
            const caseStudy = CASE_STUDIES.find((c) => c.hotelId === story.id);
            return (
              <React.Fragment key={story.id}>
                <HotelSectionBlock story={story} index={index} onSelectStory={onSelectStory} />

                {/* Ficha bajo cada bloque: el nombre solo no decía qué
                    capacidad prueba cada proyecto, ni había manera de entrar
                    al caso documentado desde aquí. Va fuera del lienzo de
                    fotos, que no se toca. */}
                <div className="mx-auto -mt-6 max-w-3xl px-6 pb-20 text-center md:-mt-10 md:pb-28">
                  <h3 className="font-serif text-xl leading-[1.25] md:text-2xl">
                    {toTitleCase(story.hotelName)}
                  </h3>
                  {story.featuredLine && (
                    <p className="mx-auto mt-3 max-w-[40ch] text-[14px] leading-[1.7] text-[#5a5854] md:text-sm">
                      {story.featuredLine}
                    </p>
                  )}
                  <div className="mt-5 flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
                    {caseStudy && (
                      <Link
                        to={`/proyecto/${caseStudy.slug}`}
                        className="border-b border-[#1a1918]/65 pb-1.5 text-[11px] font-sans uppercase tracking-[0.22em] text-[#1a1918] transition-colors hover:border-[#1a1918] md:text-[12px]"
                      >
                        Ver proyecto
                      </Link>
                    )}
                    <Link
                      to={`/trabajo/${story.id}`}
                      className="border-b border-[#1a1918]/65 pb-1.5 text-[11px] font-sans uppercase tracking-[0.22em] text-[#1a1918] transition-colors hover:border-[#1a1918] md:text-[12px]"
                    >
                      Ver galería
                    </Link>
                  </div>
                </div>
              </React.Fragment>
            );
          })}

          {/* Salida al portafolio completo: ahora es una página con URL propia
              (/proyectos), que es lo que se puede enviar por correo. */}
          <div className="flex justify-center pt-4 pb-4">
            <Link
              to="/proyectos"
              className="inline-block bg-[#1a1918] px-8 py-4 text-[12px] font-sans uppercase tracking-[0.22em] font-medium text-[#f5f3ed] transition-colors hover:bg-[#5a5854] md:px-10 md:py-[1.15rem] md:text-xs"
            >
              Ver todos los proyectos
            </Link>
          </div>

          {/* EL ÍNDICE FLOTANTE DE HOTELES YA NO VIVE AQUÍ.
              Mayurlin: "me hace hacer dos pasos para algo tan simple como ir
              directamente a la galería". En Inicio era un atajo hacia otra
              página; ahora vive en Proyectos, donde es el índice de lo que ya
              estás mirando. El componente es `IndiceHoteles`. */}
        </div>
      </div>

      {/* Prueba social justo después de la vitrina de hoteles. Estaba en la
          pantalla 15 de 17,6 y casi nadie llegaba: quien acaba de ver el
          trabajo se pregunta quién más los ha contratado, y esa pregunta se
          contesta aquí y no seis pantallas más abajo. Primero las voces de los
          equipos, después las marcas. */}
      <section className="w-full bg-[#fbfaf6] pt-8 pb-16 md:pt-12 md:pb-24">
        <div className="mx-auto max-w-6xl px-6 md:px-12">
          {/* Sin titular grande: competia en tamano con la propia cita, que es
              lo que hay que leer aqui. */}
          <div className="mb-14 text-center">
            <span className="font-sans text-[11px] uppercase tracking-[0.3em] text-[#5a5854] md:text-xs">
              Lo que dicen los equipos con los que trabajamos
            </span>
          </div>
          <Testimonials />
        </div>
      </section>

      <BrandsMarquee limit={10} />

      {/* El argumento cierra la página: por qué nosotros y cómo se trabaja,
          pegados al último botón, que es donde alguien decide. */}
      <WhyUs onNavigate={onNavigate} />

      {/* Las piezas verticales, entre los dos bloques de texto del cierre. El
          porqué de este sitio exacto está en `VideoShowcase.tsx`: la banda de
          "Un rodaje tipo" de aquí abajo promete tres piezas verticales, y
          ahora se ven justo antes de leerlo. */}
      <VideoVerticalesInicio />

      <WaysToWork />

      <ClosingCta onOpenAvailability={onOpenAvailability} onNavigate={onNavigate} />
    </div>
  );
};
