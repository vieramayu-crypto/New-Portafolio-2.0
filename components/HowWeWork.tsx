import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { publicImage, useSiteContent } from '../src/lib/content';

// One photo per step, matched by index. Photos live in code (not content.json)
// so Mayurlin can rewrite the step copy without needing to touch image paths.
const STEP_PHOTOS = [
  publicImage('sec3-gal02-checkin-v.jpg'),
  publicImage('sec1-gal5-reflejo-v.jpg'),
  publicImage('sec1-gal2-paseo-v.jpg'),
  publicImage('sec4-gal09-piscina-imerovigli-v.jpg'),
];

const AUTO_ADVANCE_MS = 7500;

export const HowWeWork: React.FC = () => {
  const { howWeWork } = useSiteContent();
  const steps = howWeWork.steps;
  const [index, setIndex] = useState(0);
  const [started, setStarted] = useState(false);
  const [manual, setManual] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);

  // El recorrido automático arranca al entrar en pantalla. Si empezara al
  // montar, la sección vive tan abajo de "Acerca de" que al llegar ya estaría
  // en el último paso.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Pasa una sola vez por los cuatro pasos y se queda en el último. Cualquier
  // toque de Mayurlin lo detiene: a partir de ahí manda ella.
  useEffect(() => {
    if (!started || manual || index >= steps.length - 1) return;
    const timer = setTimeout(() => setIndex((prev) => prev + 1), AUTO_ADVANCE_MS);
    return () => clearTimeout(timer);
  }, [started, manual, index, steps.length]);

  const goNext = () => {
    setManual(true);
    setIndex((prev) => (prev + 1) % steps.length);
  };

  const goTo = (i: number) => {
    setManual(true);
    setIndex(i);
  };

  const step = steps[index];
  const photo = STEP_PHOTOS[index % STEP_PHOTOS.length];
  const nextPhoto = STEP_PHOTOS[(index + 1) % STEP_PHOTOS.length];

  if (!step) return null;

  return (
    <section ref={sectionRef} className="relative w-full overflow-hidden py-20 md:py-32">
      {/* Peripheral slice of the next photo, bleeding off the left edge.
          Sits level with the slide's photo band, echoing a carousel mid-motion. */}
      <div className="pointer-events-none absolute left-0 top-[40%] hidden h-[300px] w-[38px] -translate-y-1/2 overflow-hidden md:block lg:w-[54px]">
        <AnimatePresence mode="wait">
          <motion.img
            key={nextPhoto}
            src={nextPhoto}
            alt=""
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="h-full w-full object-cover"
            style={{ objectPosition: '80% 50%' }}
          />
        </AnimatePresence>
      </div>

      <div className="mx-auto max-w-6xl px-6 md:px-12">
        {/* Section label */}
        <div className="mb-16 text-center md:mb-24">
          <h2 className="font-serif text-4xl text-[#1a1918] md:text-6xl">{howWeWork.heading}</h2>
        </div>

        {/* Slide */}
        <div className="relative min-h-[430px] sm:min-h-[400px] md:min-h-[440px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.55, ease: 'easeInOut' }}
            >
              {/* La cifra sobredimensionada desaparece: competía con el
                  "Step N of M" que ya va debajo. */}
              <div
                role="button"
                tabIndex={0}
                onClick={goNext}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    goNext();
                  }
                }}
                aria-label="Ver el siguiente paso"
                className="cursor-pointer"
              >
                <div>
                  {/* Photo floats so the copy wraps around it, then runs full width below */}
                  <img
                    src={photo}
                    alt=""
                    className="float-left mb-3 mr-5 w-28 object-cover sm:w-36 md:mb-4 md:mr-8 md:w-[220px] lg:w-[250px]"
                    style={{ aspectRatio: '3 / 4' }}
                  />

                  <p className="font-serif text-[1.6rem] leading-[1.25] text-[#1a1918] sm:text-4xl md:text-[2.9rem] lg:text-5xl lg:leading-[1.22]">
                    {step.description}
                  </p>

                  <div className="clear-left pt-8 md:pt-12">
                    <div className="font-serif text-xl text-[#1a1918] md:text-2xl">{step.title}</div>
                    <div className="mt-1 text-[10px] font-sans uppercase tracking-[0.25em] text-[#5a5854] md:text-xs">
                      Paso {index + 1} de {steps.length}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dot pagination */}
        <div className="flex items-center justify-center gap-3 pt-14 md:pt-16">
          {steps.map((s, i) => (
            <button
              key={s.number}
              onClick={() => goTo(i)}
              aria-label={`Ir al paso ${i + 1}: ${s.title}`}
              aria-current={i === index}
              className="p-1.5 -m-1.5"
            >
              <span
                className={`block rounded-full transition-all duration-300 ${
                  i === index ? 'h-2.5 w-2.5 bg-[#1a1918]' : 'h-1.5 w-1.5 bg-[#1a1918]/25'
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
