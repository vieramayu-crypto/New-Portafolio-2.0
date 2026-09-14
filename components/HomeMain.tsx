import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { HOTEL_STORIES } from '../data/hotels';
import { HotelStory, Page } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { HeroSection } from './HeroSection';
import { HotelSectionBlock } from './HotelSectionBlock';
import { ValueBlock } from './ValueBlock';
import { VideoShowcase } from './VideoShowcase';
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
  onOpenWork: () => void;
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
  onOpenWork,
  onSelectStory,
}) => {
  const [activeStoryIndex, setActiveStoryIndex] = useState<number>(0);
  const [isHotelSelectorOpen, setIsHotelSelectorOpen] = useState<boolean>(false);
  const [showFixedLabels, setShowFixedLabels] = useState<boolean>(false);
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

    // Also observe the entire hotel section container to toggle label visibility
    const hotelSectionEl = document.getElementById('hotel-section');
    const containerObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0]) {
          setShowFixedLabels(entries[0].isIntersecting);
        }
      },
      { threshold: 0.02 }
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

  const chromeVisible = showFixedLabels && !isValueBlockVisible;

  const scrollToHotel = (hotelId: string) => {
    setIsHotelSelectorOpen(false);
    const element = document.getElementById(`hotel-${hotelId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#fbfaf6] text-[#1a1918] select-none font-sans overflow-x-clip">
      {/* Hero Section */}
      <HeroSection introDone={introDone} onOpenAvailability={onOpenAvailability} />

      <WhatWeCreate onOpenAvailability={onOpenAvailability} />
      <ValueBlock onOpenAvailability={onOpenAvailability} />
      <VideoShowcase />

      {/* Target for smooth scroll from Hero */}
      <div id="hotel-section" className="relative pt-6">
        <div className="relative w-full pb-32">
          {/* Viewport-fixed Side Labels (Locked in place at screen vertical center while scrolling) */}
          <AnimatePresence>
            {chromeVisible && (
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
            <div className="font-sans text-[9px] uppercase tracking-[0.28em] text-[#5a5854] md:text-[10px]">
              Selección
            </div>
            <h2 className="mt-4 font-serif text-3xl leading-[1.15] md:mt-5 md:text-[2.9rem]">
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
                    <p className="mx-auto mt-3 max-w-[40ch] text-[13px] leading-[1.7] text-[#5a5854] md:text-sm">
                      {story.featuredLine}
                    </p>
                  )}
                  <div className="mt-5 flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
                    {caseStudy && (
                      <Link
                        to={`/proyecto/${caseStudy.slug}`}
                        className="border-b border-[#1a1918]/65 pb-1.5 text-[10px] font-sans uppercase tracking-[0.22em] text-[#1a1918] transition-colors hover:border-[#1a1918] md:text-[11px]"
                      >
                        Ver proyecto
                      </Link>
                    )}
                    <Link
                      to={`/trabajo/${story.id}`}
                      className="border-b border-[#1a1918]/65 pb-1.5 text-[10px] font-sans uppercase tracking-[0.22em] text-[#1a1918] transition-colors hover:border-[#1a1918] md:text-[11px]"
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
              className="inline-block bg-[#1a1918] px-8 py-4 text-[11px] font-sans uppercase tracking-[0.22em] font-medium text-[#f5f3ed] transition-colors hover:bg-[#5a5854] md:px-10 md:py-[1.15rem] md:text-xs"
            >
              Ver todos los proyectos
            </Link>
          </div>

          {/* Bottom Floating Button: only appears once the first photo section is reached */}
          <AnimatePresence>
            {chromeVisible && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="fixed bottom-8 inset-x-0 z-50 flex flex-col items-center px-4"
              >
                <button
                  onClick={() => setIsHotelSelectorOpen(!isHotelSelectorOpen)}
                  className="mt-glass mt-glass-light pointer-events-auto relative overflow-hidden rounded-md px-5 py-2 flex items-center gap-3 text-sm md:text-base font-serif tracking-[0.25em] font-medium text-[#1a1918] hover:bg-[#1a1918] hover:text-[#f5f3ed] transition-all duration-300 shadow-[0_2px_20px_rgba(26,25,24,0.14)]"
                >
                  <span>Proyectos ({flagshipStories.length})</span>
                  <span className="text-xs">{isHotelSelectorOpen ? '▼' : '▲'}</span>
                </button>

                {/* Selector Popup Menu to Jump to Any Hotel Section */}
                <AnimatePresence>
                  {isHotelSelectorOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 15, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 15, scale: 0.95 }}
                      className="mt-glass mt-glass-light mt-glass-panel absolute bottom-16 z-50 w-80 overflow-hidden rounded-lg text-left md:w-96 md:rounded-[10px]"
                    >
                      {/* El scroll vive aqui dentro, no en la caja: un
                          pseudo-elemento posicionado se desplaza con el
                          contenido de su contenedor con scroll, y el borde de
                          cristal acababa cruzando la lista como una linea
                          blanca. */}
                      <div className="no-scrollbar max-h-80 space-y-1 overflow-y-auto p-3">
                      <div className="mb-1 border-b border-[#1a1918]/15 px-3 py-1.5 font-sans text-[10px] uppercase tracking-[0.2em] text-[#5a5854]">
                        Ir a hotel / cliente ({flagshipStories.length})
                      </div>
                      {flagshipStories.map((hotel) => (
                        <button
                          key={hotel.id}
                          onClick={() => scrollToHotel(hotel.id)}
                          className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center justify-between text-xs font-sans transition-colors ${
                            currentStory.id === hotel.id
                              ? 'bg-[#1a1918] text-[#fbfaf6] font-medium'
                              : 'text-[#1a1918] hover:bg-white/45'
                          }`}
                        >
                          <div>
                            <div className="font-serif text-sm tracking-wide font-medium">{hotel.hotelName}</div>
                            <div className="text-[10px] text-[#5a5854]">{hotel.location} &bull; {hotel.coupleName}</div>
                          </div>
                          <span className="text-[10px] tracking-wider uppercase font-mono text-[#5a5854]">
                            [{hotel.year}]
                          </span>
                        </button>
                      ))}
                      </div>
                      <button
                        onClick={() => {
                          setIsHotelSelectorOpen(false);
                          onOpenWork();
                        }}
                        className="block w-full border-t border-[#1a1918]/15 px-3 py-3 text-center font-sans text-[10px] uppercase tracking-[0.2em] text-[#5a5854] transition-colors hover:bg-white/45 hover:text-[#1a1918]"
                      >
                        Ver las nueve propiedades →
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <WhyUs onNavigate={onNavigate} />
      <WaysToWork onOpenAvailability={onOpenAvailability} />

      {/* Autoridad, después de haber enseñado el trabajo entero: primero las
          voces de los equipos, después las marcas. Los dos bloques son los
          originales — sólo cambian de sitio, desde Contacto hasta aquí. */}
      <section className="w-full bg-[#fbfaf6] pt-8 pb-16 md:pt-12 md:pb-24">
        <div className="mx-auto max-w-6xl px-6 md:px-12">
          {/* Sin titular grande: competia en tamano con la propia cita, que es
              lo que hay que leer aqui. */}
          <div className="mb-14 text-center">
            <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-[#5a5854] md:text-xs">
              Lo que dicen los equipos con los que trabajamos
            </span>
          </div>
          <Testimonials />
        </div>
      </section>

      <BrandsMarquee limit={10} />

      <ClosingCta onOpenAvailability={onOpenAvailability} onNavigate={onNavigate} />
    </div>
  );
};
