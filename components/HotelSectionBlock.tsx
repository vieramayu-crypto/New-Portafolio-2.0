import React, { useLayoutEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { HotelStory } from '../types';
import { versionMovil, MEDIA_MOVIL } from '../src/lib/foto';

interface HotelSectionBlockProps {
  story: HotelStory;
  index: number;
  onSelectStory?: (story: HotelStory) => void;
  /** La ficha del hotel -- nombre, dónde, qué prueba y las salidas -- puesta
   *  DENTRO del mosaico, en el hueco que ese mosaico ya deja vacío.
   *
   *  La usa la página de Proyectos, donde van los nueve hoteles seguidos.
   *  Mayurlin: "hay mucho espacio vacío donde se podría aprovechar para
   *  colocar todo el texto, el nombre, el rodaje, todo" y "en un solo bloque
   *  estén las fotos y la descripción, el texto, el botón de ver galería".
   *
   *  Poniéndola en ese hueco no cuesta ni un píxel de alto: antes iba debajo
   *  del mosaico y cada hotel ocupaba 1.747 px, casi dos pantallas.
   *
   *  Inicio no la pasa: allí la ficha sigue debajo y el bloque no cambia. */
  ficha?: React.ReactNode;
}

/** El hueco vacío de cada mosaico, en % del lienzo: dónde empieza la ficha y
 *  cuánto ancho tiene. Uno por variante (0-7), medido sobre las posiciones de
 *  layout reales de las tres fotos -- sin el parallax, que las desplaza hasta
 *  120 px y falsearía la lectura.
 *
 *  No vale una sola posición para todas: cada variante deja su hueco en un
 *  sitio distinto. La 0 y la 2 lo tienen abajo a la izquierda, la 6 en la
 *  banda derecha, la 4 (la más llena) sólo en la esquina inferior derecha.
 *
 *  SI SE CAMBIA UNA VARIANTE, HAY QUE VOLVER A MIRAR SU HUECO. */
const HUECO_FICHA: { x: number; y: number; ancho: number }[] = [
  { x: 11.3, y: 74, ancho: 34 }, // 0  foto1 acaba en 70,1% y foto3 empieza en x50%
  { x: 54, y: 60, ancho: 36 },   // 1  foto2 acaba en 53,1%; la mitad derecha queda libre
  { x: 11.3, y: 75, ancho: 37 }, // 2  bajo foto1 (70,1%), a la izquierda de foto3 (x54,7%)
  { x: 11.3, y: 60, ancho: 37 }, // 3  bajo foto2 (53,1%), a la izquierda de foto3 (x54,7%)
  { x: 64, y: 86, ancho: 34 },   // 4  la más llena: sólo cabe bajo foto3 (82,1%), a la derecha
  { x: 54, y: 67, ancho: 38 },   // 5  bajo foto2 (60,1%), a la derecha de foto3 (x50%)
  { x: 69, y: 48, ancho: 29 },   // 6  banda derecha: foto1 acaba en x64% y foto3 en x67,1%
  { x: 54, y: 60, ancho: 36 },   // 7  bajo foto2 (53,1%), a la derecha de foto3 (x48,4%)
];

/** Aire entre la última foto y la ficha cuando la ficha va debajo (móvil y
 *  tableta). Es el número que Mayurlin pidió revisar: "el espacio que tiene
 *  entre la foto y el texto, porque eso es lo que está perjudicando su
 *  lectura". Antes no existía como número -- salía de restar la altura fija
 *  del lienzo a donde cayera la foto más baja, y daba de -54 a +119 px según
 *  el hotel: en dos la foto tapaba el nombre y en otros sobraba un palmo.
 *  Ahora es este, el mismo en los nueve. */
const AIRE_FICHA_DEBAJO = 40;

/** Aire por debajo de lo último que se ve, antes del hotel siguiente. */
const AIRE_ABAJO = 56;

/** Cuánto recorre cada foto con el parallax, a tamaño de referencia.
 *
 *  Hay que contarlo para colocar la ficha: la ficha está quieta y las fotos
 *  no, así que dejar el hueco por donde acaba la foto en reposo no basta.
 *  Medido, la foto 2 de Honeymoon Petra Villas se metía 26 px dentro del
 *  texto al entrar el bloque en pantalla, y estas tres llegan a bajar 78, 117
 *  y 49 px justo mientras la ficha se está leyendo -- casi todo su recorrido.
 *
 *  Mayurlin: "dónde termina la animación y dónde empieza la animación de cada
 *  foto, porque esto influye en su posición y el recorrido que van a hacer". */
const PARALLAX = [80, 120, 50];

/** El ancho de lienzo para el que están pensados esos 80/120/50. */
const LIENZO_REFERENCIA = 1280;

/** A partir de aquí la ficha cabe dentro del mosaico.
 *  Por debajo el lienzo es demasiado estrecho: a 1.024 px la columna de la
 *  variante 6 mediría 250 px y el nombre del hotel saldría partido en cuatro
 *  líneas, así que ahí la ficha sigue yendo debajo. */
const ANCHO_FICHA_DENTRO = '(min-width: 1280px)';

/**
 * Splits a hotel name into two lines if it contains two or more words,
 * so it renders elegantly in the sticky right column on desktop.
 */
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

export const HotelSectionBlock: React.FC<HotelSectionBlockProps> = ({
  story,
  index,
  onSelectStory,
  ficha,
}) => {
  // STRICT CONSTRAINT: Maximum 3 photos per section so each photo has its own space to be viewed
  const photos = (story.photos || []).slice(0, 3);
  // The home teaser has 8 layout templates (0-7). Some hotels reuse a gallery-only
  // layout variant beyond 7 (e.g. District Hive uses variant 8 for its gallery but
  // still needs a home teaser); modulo folds those back into 0-7 without visual break.
  const rawVariant = story.layoutVariant !== undefined ? story.layoutVariant : index;
  const variant = ((rawVariant % 8) + 8) % 8;

  // Track section scroll for smooth vertical parallax motion on photos
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 70, damping: 22 });

  /* EL RECORRIDO DEL PARALLAX VA CON EL TAMAÑO DEL MOSAICO.
   *
   *  Los 80/120/50 px están pensados para un lienzo de 1.280 px. En el móvil
   *  el lienzo mide 358, así que esos mismos píxeles son un CUARTO de su alto:
   *  las fotos se movían tanto que se comían el aire hasta el texto, y de ahí
   *  salían a la vez los solapes y los huecos de 141 px. Escalado, el recorrido
   *  se ve igual de vivo en cada tamaño y el aire hasta la ficha sale parejo
   *  en los nueve hoteles.
   *
   *  Sólo donde hay ficha dentro (Proyectos). Inicio no cambia. */
  const [escala, setEscala] = useState(1);
  const yPhoto1 = useTransform(smoothProgress, [0, 1], [80 * escala, -80 * escala]);
  const yPhoto2 = useTransform(smoothProgress, [0, 1], [120 * escala, -120 * escala]);
  const yPhoto3 = useTransform(smoothProgress, [0, 1], [50 * escala, -50 * escala]);

  // Entry transition: on click, the other photos converge into the clicked one, which
  // then hands off (via App's PhotoZoomTransition) into a full-screen zoom.
  const photoRefs = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)];
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);
  const [convergeOffsets, setConvergeOffsets] = useState<{ dx: number; dy: number }[]>([
    { dx: 0, dy: 0 },
    { dx: 0, dy: 0 },
    { dx: 0, dy: 0 },
  ]);

  const handlePhotoClick = (photoIndex: number) => {
    if (clickedIndex !== null || !onSelectStory) return;

    // All 3 photos converge on the exact center of the viewport, regardless of where
    // in the section (or scroll position) each one currently sits.
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;

    const offsets = photoRefs.map((ref) => {
      const el = ref.current;
      if (!el) return { dx: 0, dy: 0 };
      const r = el.getBoundingClientRect();
      return {
        dx: cx - (r.left + r.width / 2),
        dy: cy - (r.top + r.height / 2),
      };
    });

    setConvergeOffsets(offsets);
    setClickedIndex(photoIndex);
    window.setTimeout(() => onSelectStory(story), 480);
  };

  /* DÓNDE ACABA DE VERDAD EL MOSAICO, Y DÓNDE EMPIEZA LA FICHA.
   *
   *  El lienzo mide siempre lo mismo (1.320 px en escritorio), pero las fotos
   *  no llegan siempre igual de abajo: medido, la variante 5 acaba en el 75%
   *  del lienzo y la 2 en el 100,2%. De ahí salían los dos defectos que
   *  Mayurlin señaló a la vez -- "las fotos están puestas por encima del
   *  texto" en unos hoteles y "el texto está demasiado abajo" en otros.
   *
   *  Así que no se fija: se mide. Y se mide con la cadena de `offsetTop`, no
   *  con `getBoundingClientRect`, porque los rectángulos incluyen el parallax
   *  -- que desplaza las fotos hasta 120 px -- y la medida cambiaría según
   *  dónde estuviera el scroll en ese instante. `offsetTop` ignora los
   *  `transform`, así que da la posición de layout, que es la estable.
   *
   *  Con eso se decide (a) dónde va la ficha cuando va debajo y (b) cuánto
   *  hay que subir el hotel siguiente para que no quede un palmo de nada. */
  const lienzoRef = useRef<HTMLDivElement>(null);
  const fichaRef = useRef<HTMLDivElement>(null);
  const [ajuste, setAjuste] = useState<{ topFicha: number; dentro: boolean; alto: number }>(
    () => ({
      topFicha: 0,
      dentro:
        typeof window !== 'undefined' && window.matchMedia(ANCHO_FICHA_DENTRO).matches,
      alto: 0,
    }),
  );

  const hueco = HUECO_FICHA[variant] || HUECO_FICHA[0];

  useLayoutEffect(() => {
    if (!ficha) return;
    const lienzo = lienzoRef.current;
    const caja = fichaRef.current;
    if (!lienzo || !caja) return;

    const medir = () => {
      // Altura de un elemento dentro del lienzo, sin contar los `transform`.
      const fondoDe = (el: HTMLElement) => {
        let y = 0;
        let n: HTMLElement | null = el;
        while (n && n !== lienzo) {
          y += n.offsetTop;
          n = n.offsetParent as HTMLElement | null;
        }
        return y + el.offsetHeight;
      };
      const izquierdaDe = (el: HTMLElement) => {
        let x = 0;
        let n: HTMLElement | null = el;
        while (n && n !== lienzo) {
          x += n.offsetLeft;
          n = n.offsetParent as HTMLElement | null;
        }
        return x;
      };

      const fotos = Array.prototype.slice.call(
        lienzo.getElementsByTagName('img'),
      ) as HTMLElement[];
      if (!fotos.length) return;
      // Se mide el marco pulsable, no la `img`: es el que lleva la forma.
      const fondoFotos = fotos.reduce((m, img) => {
        const marco = (img.closest('.absolute') as HTMLElement | null) || img;
        return Math.max(m, fondoDe(marco));
      }, 0);

      // Nunca más de lo de siempre, y nunca tan poco que el movimiento
      // desaparezca: entre el 30% y el 100% del recorrido de referencia.
      const f = Math.min(1, Math.max(0.3, lienzo.offsetWidth / LIENZO_REFERENCIA));
      setEscala(f);

      const dentro = window.matchMedia(ANCHO_FICHA_DENTRO).matches;
      // Dentro del mosaico la ficha ocupa su columna; debajo, todo el ancho.
      const izq = dentro ? (hueco.x / 100) * lienzo.offsetWidth : 0;
      const der = dentro
        ? ((hueco.x + hueco.ancho) / 100) * lienzo.offsetWidth
        : lienzo.offsetWidth;

      // La ficha baja hasta despejar las fotos que de verdad tiene ENCIMA --
      // las que pisan su columna -- contando lo que esas fotos bajan con el
      // parallax. Las que quedan a su lado no la estorban, y por eso no se la
      // hace bajar por ellas: ahí está el espacio que se gana.
      let tope = dentro ? (hueco.y / 100) * lienzo.offsetHeight : 0;
      photoRefs.forEach((ref, i) => {
        const marco = ref.current;
        if (!marco) return;
        const x = izquierdaDe(marco);
        if (x >= der || x + marco.offsetWidth <= izq) return; // no la pisa
        tope = Math.max(tope, fondoDe(marco) + PARALLAX[i] * f + AIRE_FICHA_DEBAJO);
      });
      const topFicha = Math.round(tope);

      // El alto del bloque: justo hasta lo último que se ve. Es un alto, no un
      // margen negativo, porque el bloque lleva `overflow-hidden` -- con un
      // margen, la ficha que sobresale del lienzo se quedaba recortada (medido:
      // a GPRO Valparaíso le faltaban los dos enlaces, 84 px por debajo).
      const fondo = Math.max(fondoFotos, topFicha + caja.offsetHeight);
      setAjuste({
        topFicha,
        dentro,
        alto: Math.round(lienzo.offsetTop + fondo + AIRE_ABAJO),
      });
    };

    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(lienzo);
    ro.observe(caja);
    const mq = window.matchMedia(ANCHO_FICHA_DENTRO);
    mq.addEventListener('change', medir);
    return () => {
      ro.disconnect();
      mq.removeEventListener('change', medir);
    };
  }, [ficha, hueco.y, story.id]);

  return (
    <div
      ref={sectionRef}
      id={`hotel-${story.id}`}
      data-hotel-id={story.id}
      style={ficha && ajuste.alto ? { height: ajuste.alto } : undefined}
      className={`hotel-section-block relative w-full scroll-mt-24 px-4 md:px-12 lg:px-20 overflow-hidden ${
        ficha
          ? // El alto lo decide la medida de abajo, no un mínimo. Y arriba
            // sobra aire: con la ficha dentro, el hotel empieza en la foto.
            'py-10 md:pt-12 md:pb-0'
          : 'py-16 md:py-28 md:min-h-[1380px]'
      }`}
    >
      {/* El nombre del hotel lo pone ahora la ficha que va debajo del bloque
          (en HomeMain), la misma en móvil y en escritorio. Aquí se repetía
          justo encima, en mayúsculas, y en móvil se leían los dos seguidos. */}
      <div className="md:hidden w-full max-w-md mx-auto mb-8 text-center">
        <span className="text-[11px] font-sans tracking-[0.25em] text-[#5a5854] uppercase block">
          {story.leftTag || 'HOTEL'}
        </span>
      </div>


      {/* =========================================================
          MAIN PHOTO CANVAS (MAX 3 PHOTOS, 50% EXTRA HEIGHT)
          - Expanded height (1320px) gives generous breathing space for each photo.
          - Side padding ensures photos never collide with sticky side labels.
         ========================================================= */}
      <div
        ref={lienzoRef}
        className={`relative mx-auto aspect-[124/165] max-w-[1380px] pl-4 pr-4 md:pl-28 md:pr-28 lg:pl-36 lg:pr-36 xl:max-w-[1520px] ${
          ficha
            ? // CON FICHA DENTRO EL LIENZO ES PROPORCIONAL, NO DE ALTO FIJO.
              // Las fotos son `absolute`: su ANCHO va en % del lienzo y su
              // alto sale de su `aspect-ratio`, mientras su `top` va en % del
              // ALTO del lienzo. Con un alto fijo de 1.320 px las dos cosas
              // dejan de ir juntas en cuanto la pantalla no mide 1.440: a
              // 1.920 las fotos se hacen un 19% más altas sin que el lienzo
              // crezca y se salen por abajo (medido: hasta 204 px encima de
              // la ficha), y a 1.280 encogen y el mosaico se abre y queda
              // disperso. Con la proporción fija, todo escala a la vez.
              'md:aspect-[1280/1320]'
            : 'md:aspect-auto md:min-h-[1320px]'
        }`}
      >
        
        {/* VARIANT 0: Giant Hero VERTICAL (left ~68%) + Top-Right Floating + Bottom-Right Overlap (~48%) */}
        {variant === 0 && (
          <div className={`relative block h-full w-full ${ficha ? '' : 'md:min-h-[1320px]'}`}>
            {/* Photo 1: Giant Hero VERTICAL */}
            {photos[0] && (
              <motion.div
                ref={photoRefs[0]}
                style={{ y: clickedIndex === null ? yPhoto1 : undefined, cursor: onSelectStory ? 'pointer' : undefined }}
                animate={
                  clickedIndex === null
                    ? undefined
                    : { x: convergeOffsets[0].dx, y: convergeOffsets[0].dy, scale: 0.3, opacity: 0 }
                }
                transition={{ duration: 0.56, ease: [0.5, 0, 0.25, 1.1] }}
                onClick={() => handlePhotoClick(0)}
                className="absolute left-[0%] top-[2%] w-[68%] aspect-[3/4] shadow-2xl group overflow-hidden bg-stone-200 z-10"
              >
                <picture>
                  <source media={MEDIA_MOVIL} srcSet={versionMovil(photos[0].url)} />
                  <img
                    src={photos[0].url}
                    alt={photos[0].alt}
                    className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                      photos[0].isBlackAndWhite ? 'grayscale contrast-125' : ''
                    }`}
                  />
                </picture>
              </motion.div>
            )}

            {/* Photo 2: Top-Right Floating Portrait */}
            {photos[1] && (
              <motion.div
                ref={photoRefs[1]}
                style={{ y: clickedIndex === null ? yPhoto2 : undefined, cursor: onSelectStory ? 'pointer' : undefined }}
                animate={
                  clickedIndex === null
                    ? undefined
                    : { x: convergeOffsets[1].dx, y: convergeOffsets[1].dy, scale: 0.3, opacity: 0 }
                }
                transition={{ duration: 0.56, ease: [0.5, 0, 0.25, 1.1] }}
                onClick={() => handlePhotoClick(1)}
                className="absolute right-[0%] top-[2%] w-[39%] md:w-[34%] aspect-[3/4] shadow-md group overflow-hidden bg-stone-200 z-10"
              >
                <picture>
                  <source media={MEDIA_MOVIL} srcSet={versionMovil(photos[1].url)} />
                  <img
                    src={photos[1].url}
                    alt={photos[1].alt}
                    className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                      photos[1].isBlackAndWhite ? 'grayscale contrast-125' : ''
                    }`}
                  />
                </picture>
              </motion.div>
            )}

            {/* Photo 3: Bottom-Right Landscape (Subtle overlap under 5%) */}
            {photos[2] && (
              <motion.div
                ref={photoRefs[2]}
                style={{ y: clickedIndex === null ? yPhoto3 : undefined, cursor: onSelectStory ? 'pointer' : undefined }}
                animate={
                  clickedIndex === null
                    ? undefined
                    : { x: convergeOffsets[2].dx, y: convergeOffsets[2].dy, scale: 0.3, opacity: 0 }
                }
                transition={{ duration: 0.56, ease: [0.5, 0, 0.25, 1.1] }}
                onClick={() => handlePhotoClick(2)}
                className="absolute right-[2%] top-[58%] w-[53%] md:w-[48%] aspect-[4/3] shadow-2xl group overflow-hidden bg-stone-200 z-20"
              >
                <picture>
                  <source media={MEDIA_MOVIL} srcSet={versionMovil(photos[2].url)} />
                  <img
                    src={photos[2].url}
                    alt={photos[2].alt}
                    className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                      photos[2].isBlackAndWhite ? 'grayscale contrast-125' : ''
                    }`}
                  />
                </picture>
              </motion.div>
            )}
          </div>
        )}

        {/* VARIANT 1: Giant Hero SQUARE (right ~68%) + Top-Left Detail + Bottom-Left Overlap (~46%) */}
        {variant === 1 && (
          <div className={`relative block h-full w-full ${ficha ? '' : 'md:min-h-[1320px]'}`}>
            {/* Photo 1: Top-Left Floating Detail */}
            {photos[0] && (
              <motion.div
                ref={photoRefs[0]}
                style={{ y: clickedIndex === null ? yPhoto1 : undefined, cursor: onSelectStory ? 'pointer' : undefined }}
                animate={
                  clickedIndex === null
                    ? undefined
                    : { x: convergeOffsets[0].dx, y: convergeOffsets[0].dy, scale: 0.3, opacity: 0 }
                }
                transition={{ duration: 0.56, ease: [0.5, 0, 0.25, 1.1] }}
                onClick={() => handlePhotoClick(0)}
                className="absolute left-[0%] top-[2%] w-[41%] md:w-[36%] aspect-[4/3] shadow-lg group overflow-hidden bg-stone-200 z-10"
              >
                <picture>
                  <source media={MEDIA_MOVIL} srcSet={versionMovil(photos[0].url)} />
                  <img
                    src={photos[0].url}
                    alt={photos[0].alt}
                    className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                      photos[0].isBlackAndWhite ? 'grayscale contrast-125' : ''
                    }`}
                  />
                </picture>
              </motion.div>
            )}

            {/* Photo 2: Giant Hero SQUARE (~68% width) */}
            {photos[1] && (
              <motion.div
                ref={photoRefs[1]}
                style={{ y: clickedIndex === null ? yPhoto2 : undefined, cursor: onSelectStory ? 'pointer' : undefined }}
                animate={
                  clickedIndex === null
                    ? undefined
                    : { x: convergeOffsets[1].dx, y: convergeOffsets[1].dy, scale: 0.3, opacity: 0 }
                }
                transition={{ duration: 0.56, ease: [0.5, 0, 0.25, 1.1] }}
                onClick={() => handlePhotoClick(1)}
                className="absolute right-[0%] top-[2%] w-[68%] aspect-square shadow-2xl group overflow-hidden bg-stone-200 z-10"
              >
                <picture>
                  <source media={MEDIA_MOVIL} srcSet={versionMovil(photos[1].url)} />
                  <img
                    src={photos[1].url}
                    alt={photos[1].alt}
                    className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                      photos[1].isBlackAndWhite ? 'grayscale contrast-125' : ''
                    }`}
                  />
                </picture>
              </motion.div>
            )}

            {/* Photo 3: Bottom-Left Overlap (~46% width) */}
            {photos[2] && (
              <motion.div
                ref={photoRefs[2]}
                style={{ y: clickedIndex === null ? yPhoto3 : undefined, cursor: onSelectStory ? 'pointer' : undefined }}
                animate={
                  clickedIndex === null
                    ? undefined
                    : { x: convergeOffsets[2].dx, y: convergeOffsets[2].dy, scale: 0.3, opacity: 0 }
                }
                transition={{ duration: 0.56, ease: [0.5, 0, 0.25, 1.1] }}
                onClick={() => handlePhotoClick(2)}
                className="absolute left-[4%] top-[48%] w-[51%] md:w-[46%] aspect-[3/4] shadow-2xl group overflow-hidden bg-stone-200 z-20"
              >
                <picture>
                  <source media={MEDIA_MOVIL} srcSet={versionMovil(photos[2].url)} />
                  <img
                    src={photos[2].url}
                    alt={photos[2].alt}
                    className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                      photos[2].isBlackAndWhite ? 'grayscale contrast-125' : ''
                    }`}
                  />
                </picture>
              </motion.div>
            )}
          </div>
        )}

        {/* VARIANT 2: Giant Hero VERTICAL (left ~68%) + Top-Right Landscape + Bottom-Right Portrait (~42%) */}
        {variant === 2 && (
          <div className={`relative block h-full w-full ${ficha ? '' : 'md:min-h-[1320px]'}`}>
            {/* Photo 1: Giant Hero VERTICAL */}
            {photos[0] && (
              <motion.div
                ref={photoRefs[0]}
                style={{ y: clickedIndex === null ? yPhoto1 : undefined, cursor: onSelectStory ? 'pointer' : undefined }}
                animate={
                  clickedIndex === null
                    ? undefined
                    : { x: convergeOffsets[0].dx, y: convergeOffsets[0].dy, scale: 0.3, opacity: 0 }
                }
                transition={{ duration: 0.56, ease: [0.5, 0, 0.25, 1.1] }}
                onClick={() => handlePhotoClick(0)}
                className="absolute left-[0%] top-[2%] w-[68%] aspect-[3/4] shadow-2xl group overflow-hidden bg-stone-200 z-10"
              >
                <picture>
                  <source media={MEDIA_MOVIL} srcSet={versionMovil(photos[0].url)} />
                  <img
                    src={photos[0].url}
                    alt={photos[0].alt}
                    className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                      photos[0].isBlackAndWhite ? 'grayscale contrast-125' : ''
                    }`}
                  />
                </picture>
              </motion.div>
            )}

            {/* Photo 2: Top-Right Landscape */}
            {photos[1] && (
              <motion.div
                ref={photoRefs[1]}
                style={{ y: clickedIndex === null ? yPhoto2 : undefined, cursor: onSelectStory ? 'pointer' : undefined }}
                animate={
                  clickedIndex === null
                    ? undefined
                    : { x: convergeOffsets[1].dx, y: convergeOffsets[1].dy, scale: 0.3, opacity: 0 }
                }
                transition={{ duration: 0.56, ease: [0.5, 0, 0.25, 1.1] }}
                onClick={() => handlePhotoClick(1)}
                className="absolute right-[0%] top-[2%] w-[43%] md:w-[38%] aspect-[4/3] shadow-lg group overflow-hidden bg-stone-200 z-10"
              >
                <picture>
                  <source media={MEDIA_MOVIL} srcSet={versionMovil(photos[1].url)} />
                  <img
                    src={photos[1].url}
                    alt={photos[1].alt}
                    className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                      photos[1].isBlackAndWhite ? 'grayscale contrast-125' : ''
                    }`}
                  />
                </picture>
              </motion.div>
            )}

            {/* Photo 3: Bottom-Right Portrait Overlap */}
            {photos[2] && (
              <motion.div
                ref={photoRefs[2]}
                style={{ y: clickedIndex === null ? yPhoto3 : undefined, cursor: onSelectStory ? 'pointer' : undefined }}
                animate={
                  clickedIndex === null
                    ? undefined
                    : { x: convergeOffsets[2].dx, y: convergeOffsets[2].dy, scale: 0.3, opacity: 0 }
                }
                transition={{ duration: 0.56, ease: [0.5, 0, 0.25, 1.1] }}
                onClick={() => handlePhotoClick(2)}
                className="absolute right-[2%] top-[58%] w-[46%] md:w-[42%] aspect-[3/4] shadow-2xl group overflow-hidden bg-stone-200 z-20"
              >
                <picture>
                  <source media={MEDIA_MOVIL} srcSet={versionMovil(photos[2].url)} />
                  <img
                    src={photos[2].url}
                    alt={photos[2].alt}
                    className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                      photos[2].isBlackAndWhite ? 'grayscale contrast-125' : ''
                    }`}
                  />
                </picture>
              </motion.div>
            )}
          </div>
        )}

        {/* VARIANT 3: Giant Hero SQUARE (center/right ~68%) + Left Top Floating + Bottom Right Overlap (~44%) */}
        {variant === 3 && (
          <div className={`relative block h-full w-full ${ficha ? '' : 'md:min-h-[1320px]'}`}>
            {/* Photo 1: Left Top Floating Portrait */}
            {photos[0] && (
              <motion.div
                ref={photoRefs[0]}
                style={{ y: clickedIndex === null ? yPhoto1 : undefined, cursor: onSelectStory ? 'pointer' : undefined }}
                animate={
                  clickedIndex === null
                    ? undefined
                    : { x: convergeOffsets[0].dx, y: convergeOffsets[0].dy, scale: 0.3, opacity: 0 }
                }
                transition={{ duration: 0.56, ease: [0.5, 0, 0.25, 1.1] }}
                onClick={() => handlePhotoClick(0)}
                className="absolute left-[0%] top-[4%] w-[37%] md:w-[32%] aspect-[3/4] shadow-md group overflow-hidden bg-stone-200 z-30"
              >
                <picture>
                  <source media={MEDIA_MOVIL} srcSet={versionMovil(photos[0].url)} />
                  <img
                    src={photos[0].url}
                    alt={photos[0].alt}
                    className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                      photos[0].isBlackAndWhite ? 'grayscale contrast-125' : ''
                    }`}
                  />
                </picture>
              </motion.div>
            )}

            {/* Photo 2: Giant Hero SQUARE (~68% width) */}
            {photos[1] && (
              <motion.div
                ref={photoRefs[1]}
                style={{ y: clickedIndex === null ? yPhoto2 : undefined, cursor: onSelectStory ? 'pointer' : undefined }}
                animate={
                  clickedIndex === null
                    ? undefined
                    : { x: convergeOffsets[1].dx, y: convergeOffsets[1].dy, scale: 0.3, opacity: 0 }
                }
                transition={{ duration: 0.56, ease: [0.5, 0, 0.25, 1.1] }}
                onClick={() => handlePhotoClick(1)}
                className="absolute left-[22%] top-[2%] w-[68%] aspect-square shadow-2xl group overflow-hidden bg-stone-200 z-10"
              >
                <picture>
                  <source media={MEDIA_MOVIL} srcSet={versionMovil(photos[1].url)} />
                  <img
                    src={photos[1].url}
                    alt={photos[1].alt}
                    className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                      photos[1].isBlackAndWhite ? 'grayscale contrast-125' : ''
                    }`}
                  />
                </picture>
              </motion.div>
            )}

            {/* Photo 3: Right Bottom Landscape Overlap */}
            {photos[2] && (
              <motion.div
                ref={photoRefs[2]}
                style={{ y: clickedIndex === null ? yPhoto3 : undefined, cursor: onSelectStory ? 'pointer' : undefined }}
                animate={
                  clickedIndex === null
                    ? undefined
                    : { x: convergeOffsets[2].dx, y: convergeOffsets[2].dy, scale: 0.3, opacity: 0 }
                }
                transition={{ duration: 0.56, ease: [0.5, 0, 0.25, 1.1] }}
                onClick={() => handlePhotoClick(2)}
                className="absolute right-[0%] top-[52%] w-[48%] md:w-[44%] aspect-[4/3] shadow-2xl group overflow-hidden bg-stone-200 z-20"
              >
                <picture>
                  <source media={MEDIA_MOVIL} srcSet={versionMovil(photos[2].url)} />
                  <img
                    src={photos[2].url}
                    alt={photos[2].alt}
                    className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                      photos[2].isBlackAndWhite ? 'grayscale contrast-125' : ''
                    }`}
                  />
                </picture>
              </motion.div>
            )}
          </div>
        )}

        {/* VARIANT 4: Top Floating + Giant Hero VERTICAL (bottom left ~66%) + Bottom-Right Floating (~38%) */}
        {variant === 4 && (
          <div className={`relative block h-full w-full ${ficha ? '' : 'md:min-h-[1320px]'}`}>
            {/* Photo 1: Top Floating Landscape */}
            {photos[0] && (
              <motion.div
                ref={photoRefs[0]}
                style={{ y: clickedIndex === null ? yPhoto1 : undefined, cursor: onSelectStory ? 'pointer' : undefined }}
                animate={
                  clickedIndex === null
                    ? undefined
                    : { x: convergeOffsets[0].dx, y: convergeOffsets[0].dy, scale: 0.3, opacity: 0 }
                }
                transition={{ duration: 0.56, ease: [0.5, 0, 0.25, 1.1] }}
                onClick={() => handlePhotoClick(0)}
                className="absolute left-[20%] top-[4%] w-[60%] aspect-[16/9] shadow-xl group overflow-hidden bg-stone-200 z-10"
              >
                <picture>
                  <source media={MEDIA_MOVIL} srcSet={versionMovil(photos[0].url)} />
                  <img
                    src={photos[0].url}
                    alt={photos[0].alt}
                    className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                      photos[0].isBlackAndWhite ? 'grayscale contrast-125' : ''
                    }`}
                  />
                </picture>
              </motion.div>
            )}

            {/* Photo 2: Giant Hero VERTICAL (~66% width) */}
            {photos[1] && (
              <motion.div
                ref={photoRefs[1]}
                style={{ y: clickedIndex === null ? yPhoto2 : undefined, cursor: onSelectStory ? 'pointer' : undefined }}
                animate={
                  clickedIndex === null
                    ? undefined
                    : { x: convergeOffsets[1].dx, y: convergeOffsets[1].dy, scale: 0.3, opacity: 0 }
                }
                transition={{ duration: 0.56, ease: [0.5, 0, 0.25, 1.1] }}
                onClick={() => handlePhotoClick(1)}
                className="absolute left-[0%] top-[26%] w-[66%] aspect-[3/4] shadow-2xl group overflow-hidden bg-stone-200 z-20"
              >
                <picture>
                  <source media={MEDIA_MOVIL} srcSet={versionMovil(photos[1].url)} />
                  <img
                    src={photos[1].url}
                    alt={photos[1].alt}
                    className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                      photos[1].isBlackAndWhite ? 'grayscale contrast-125' : ''
                    }`}
                  />
                </picture>
              </motion.div>
            )}

            {/* Photo 3: Bottom Right Floating Portrait */}
            {photos[2] && (
              <motion.div
                ref={photoRefs[2]}
                style={{ y: clickedIndex === null ? yPhoto3 : undefined, cursor: onSelectStory ? 'pointer' : undefined }}
                animate={
                  clickedIndex === null
                    ? undefined
                    : { x: convergeOffsets[2].dx, y: convergeOffsets[2].dy, scale: 0.3, opacity: 0 }
                }
                transition={{ duration: 0.56, ease: [0.5, 0, 0.25, 1.1] }}
                onClick={() => handlePhotoClick(2)}
                className="absolute right-[0%] top-[44%] w-[43%] md:w-[38%] aspect-[3/4] shadow-md group overflow-hidden bg-stone-200 z-10"
              >
                <picture>
                  <source media={MEDIA_MOVIL} srcSet={versionMovil(photos[2].url)} />
                  <img
                    src={photos[2].url}
                    alt={photos[2].alt}
                    className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                      photos[2].isBlackAndWhite ? 'grayscale contrast-125' : ''
                    }`}
                  />
                </picture>
              </motion.div>
            )}
          </div>
        )}

        {/* VARIANT 5: Giant Hero VERTICAL (right ~58%) + Top-Left Detail + Bottom-Left Landscape (~48%) */}
        {variant === 5 && (
          <div className={`relative block h-full w-full ${ficha ? '' : 'md:min-h-[1320px]'}`}>
            {/* Photo 1: Top-Left Floating Detail */}
            {photos[0] && (
              <motion.div
                ref={photoRefs[0]}
                style={{ y: clickedIndex === null ? yPhoto1 : undefined, cursor: onSelectStory ? 'pointer' : undefined }}
                animate={
                  clickedIndex === null
                    ? undefined
                    : { x: convergeOffsets[0].dx, y: convergeOffsets[0].dy, scale: 0.3, opacity: 0 }
                }
                transition={{ duration: 0.56, ease: [0.5, 0, 0.25, 1.1] }}
                onClick={() => handlePhotoClick(0)}
                className="absolute left-[0%] top-[4%] w-[37%] md:w-[32%] aspect-square shadow-md group overflow-hidden bg-stone-200 z-10"
              >
                <picture>
                  <source media={MEDIA_MOVIL} srcSet={versionMovil(photos[0].url)} />
                  <img
                    src={photos[0].url}
                    alt={photos[0].alt}
                    className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                      photos[0].isBlackAndWhite ? 'grayscale contrast-125' : ''
                    }`}
                  />
                </picture>
              </motion.div>
            )}

            {/* Photo 2: Giant Hero VERTICAL (~58% width, 50%+ larger footprint) */}
            {photos[1] && (
              <motion.div
                ref={photoRefs[1]}
                style={{ y: clickedIndex === null ? yPhoto2 : undefined, cursor: onSelectStory ? 'pointer' : undefined }}
                animate={
                  clickedIndex === null
                    ? undefined
                    : { x: convergeOffsets[1].dx, y: convergeOffsets[1].dy, scale: 0.3, opacity: 0 }
                }
                transition={{ duration: 0.56, ease: [0.5, 0, 0.25, 1.1] }}
                onClick={() => handlePhotoClick(1)}
                className="absolute right-[0%] top-[2%] w-[58%] aspect-[3/4] shadow-2xl group overflow-hidden bg-stone-200 z-10"
              >
                <picture>
                  <source media={MEDIA_MOVIL} srcSet={versionMovil(photos[1].url)} />
                  <img
                    src={photos[1].url}
                    alt={photos[1].alt}
                    className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                      photos[1].isBlackAndWhite ? 'grayscale contrast-125' : ''
                    }`}
                  />
                </picture>
              </motion.div>
            )}

            {/* Photo 3: Bottom-Left Landscape Overlap (~48% width) */}
            {photos[2] && (
              <motion.div
                ref={photoRefs[2]}
                style={{ y: clickedIndex === null ? yPhoto3 : undefined, cursor: onSelectStory ? 'pointer' : undefined }}
                animate={
                  clickedIndex === null
                    ? undefined
                    : { x: convergeOffsets[2].dx, y: convergeOffsets[2].dy, scale: 0.3, opacity: 0 }
                }
                transition={{ duration: 0.56, ease: [0.5, 0, 0.25, 1.1] }}
                onClick={() => handlePhotoClick(2)}
                className="absolute left-[2%] top-[48%] w-[53%] md:w-[48%] aspect-[4/3] shadow-2xl group overflow-hidden bg-stone-200 z-20"
              >
                <picture>
                  <source media={MEDIA_MOVIL} srcSet={versionMovil(photos[2].url)} />
                  <img
                    src={photos[2].url}
                    alt={photos[2].alt}
                    className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                      photos[2].isBlackAndWhite ? 'grayscale contrast-125' : ''
                    }`}
                  />
                </picture>
              </motion.div>
            )}
          </div>
        )}

        {/* VARIANT 6: Giant Hero VERTICAL (left ~68%) + Right Top Floating + Bottom Center Portrait (~42%) */}
        {variant === 6 && (
          <div className={`relative block h-full w-full ${ficha ? '' : 'md:min-h-[1320px]'}`}>
            {/* Photo 1: Giant Hero VERTICAL (~68% width) */}
            {photos[0] && (
              <motion.div
                ref={photoRefs[0]}
                style={{ y: clickedIndex === null ? yPhoto1 : undefined, cursor: onSelectStory ? 'pointer' : undefined }}
                animate={
                  clickedIndex === null
                    ? undefined
                    : { x: convergeOffsets[0].dx, y: convergeOffsets[0].dy, scale: 0.3, opacity: 0 }
                }
                transition={{ duration: 0.56, ease: [0.5, 0, 0.25, 1.1] }}
                onClick={() => handlePhotoClick(0)}
                className="absolute left-[0%] top-[2%] w-[68%] aspect-[3/4] shadow-2xl group overflow-hidden bg-stone-200 z-10"
              >
                <picture>
                  <source media={MEDIA_MOVIL} srcSet={versionMovil(photos[0].url)} />
                  <img
                    src={photos[0].url}
                    alt={photos[0].alt}
                    className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                      photos[0].isBlackAndWhite ? 'grayscale contrast-125' : ''
                    }`}
                  />
                </picture>
              </motion.div>
            )}

            {/* Photo 2: Right Top Floating Portrait */}
            {photos[1] && (
              <motion.div
                ref={photoRefs[1]}
                style={{ y: clickedIndex === null ? yPhoto2 : undefined, cursor: onSelectStory ? 'pointer' : undefined }}
                animate={
                  clickedIndex === null
                    ? undefined
                    : { x: convergeOffsets[1].dx, y: convergeOffsets[1].dy, scale: 0.3, opacity: 0 }
                }
                transition={{ duration: 0.56, ease: [0.5, 0, 0.25, 1.1] }}
                onClick={() => handlePhotoClick(1)}
                className="absolute right-[0%] top-[2%] w-[41%] md:w-[36%] aspect-[3/4] shadow-lg group overflow-hidden bg-stone-200 z-10"
              >
                <picture>
                  <source media={MEDIA_MOVIL} srcSet={versionMovil(photos[1].url)} />
                  <img
                    src={photos[1].url}
                    alt={photos[1].alt}
                    className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                      photos[1].isBlackAndWhite ? 'grayscale contrast-125' : ''
                    }`}
                  />
                </picture>
              </motion.div>
            )}

            {/* Photo 3: Bottom Center Portrait Overlap */}
            {photos[2] && (
              <motion.div
                ref={photoRefs[2]}
                style={{ y: clickedIndex === null ? yPhoto3 : undefined, cursor: onSelectStory ? 'pointer' : undefined }}
                animate={
                  clickedIndex === null
                    ? undefined
                    : { x: convergeOffsets[2].dx, y: convergeOffsets[2].dy, scale: 0.3, opacity: 0 }
                }
                transition={{ duration: 0.56, ease: [0.5, 0, 0.25, 1.1] }}
                onClick={() => handlePhotoClick(2)}
                className="absolute left-[30%] top-[56%] w-[46%] md:w-[42%] aspect-[3/4] shadow-2xl group overflow-hidden bg-stone-200 z-20"
              >
                <picture>
                  <source media={MEDIA_MOVIL} srcSet={versionMovil(photos[2].url)} />
                  <img
                    src={photos[2].url}
                    alt={photos[2].alt}
                    className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                      photos[2].isBlackAndWhite ? 'grayscale contrast-125' : ''
                    }`}
                  />
                </picture>
              </motion.div>
            )}
          </div>
        )}

        {/* VARIANT 7: Giant Hero SQUARE (right ~68%) + Top Left Floating + Bottom Left Landscape (~48%) */}
        {variant === 7 && (
          <div className={`relative block h-full w-full ${ficha ? '' : 'md:min-h-[1320px]'}`}>
            {/* Photo 1: Top Left Floating Detail */}
            {photos[0] && (
              <motion.div
                ref={photoRefs[0]}
                style={{ y: clickedIndex === null ? yPhoto1 : undefined, cursor: onSelectStory ? 'pointer' : undefined }}
                animate={
                  clickedIndex === null
                    ? undefined
                    : { x: convergeOffsets[0].dx, y: convergeOffsets[0].dy, scale: 0.3, opacity: 0 }
                }
                transition={{ duration: 0.56, ease: [0.5, 0, 0.25, 1.1] }}
                onClick={() => handlePhotoClick(0)}
                className="absolute left-[0%] top-[2%] w-[32%] aspect-square shadow-lg group overflow-hidden bg-stone-200 z-10"
              >
                <picture>
                  <source media={MEDIA_MOVIL} srcSet={versionMovil(photos[0].url)} />
                  <img
                    src={photos[0].url}
                    alt={photos[0].alt}
                    className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                      photos[0].isBlackAndWhite ? 'grayscale contrast-125' : ''
                    }`}
                  />
                </picture>
              </motion.div>
            )}

            {/* Photo 2: Giant Hero SQUARE (~68% width) */}
            {photos[1] && (
              <motion.div
                ref={photoRefs[1]}
                style={{ y: clickedIndex === null ? yPhoto2 : undefined, cursor: onSelectStory ? 'pointer' : undefined }}
                animate={
                  clickedIndex === null
                    ? undefined
                    : { x: convergeOffsets[1].dx, y: convergeOffsets[1].dy, scale: 0.3, opacity: 0 }
                }
                transition={{ duration: 0.56, ease: [0.5, 0, 0.25, 1.1] }}
                onClick={() => handlePhotoClick(1)}
                className="absolute right-[0%] top-[2%] w-[68%] aspect-square shadow-2xl group overflow-hidden bg-stone-200 z-10"
              >
                <picture>
                  <source media={MEDIA_MOVIL} srcSet={versionMovil(photos[1].url)} />
                  <img
                    src={photos[1].url}
                    alt={photos[1].alt}
                    className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                      photos[1].isBlackAndWhite ? 'grayscale contrast-125' : ''
                    }`}
                  />
                </picture>
              </motion.div>
            )}

            {/* Photo 3: Bottom Left Landscape Overlap (~48% width) */}
            {photos[2] && (
              <motion.div
                ref={photoRefs[2]}
                style={{ y: clickedIndex === null ? yPhoto3 : undefined, cursor: onSelectStory ? 'pointer' : undefined }}
                animate={
                  clickedIndex === null
                    ? undefined
                    : { x: convergeOffsets[2].dx, y: convergeOffsets[2].dy, scale: 0.3, opacity: 0 }
                }
                transition={{ duration: 0.56, ease: [0.5, 0, 0.25, 1.1] }}
                onClick={() => handlePhotoClick(2)}
                className="absolute left-[0%] top-[56%] w-[53%] md:w-[48%] aspect-[4/3] shadow-2xl group overflow-hidden bg-stone-200 z-20"
              >
                <picture>
                  <source media={MEDIA_MOVIL} srcSet={versionMovil(photos[2].url)} />
                  <img
                    src={photos[2].url}
                    alt={photos[2].alt}
                    className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                      photos[2].isBlackAndWhite ? 'grayscale contrast-125' : ''
                    }`}
                  />
                </picture>
              </motion.div>
            )}
          </div>
        )}

        {/* LA FICHA, DENTRO DEL MOSAICO.
            En pantallas anchas va en el hueco que esa variante deja vacío, y
            entonces no cuesta ni un píxel de alto. Por debajo de 1.280 px va
            debajo de la última foto, a `AIRE_FICHA_DEBAJO` exactos -- los
            mismos en los nueve hoteles, que es lo que faltaba.

            Va posicionada siempre (`absolute`) para que no empuje al lienzo:
            quien decide el alto del bloque es la medida de arriba. */}
        {ficha && (
          <div
            ref={fichaRef}
            data-ficha
            style={
              ajuste.dentro
                ? { top: ajuste.topFicha, left: `${hueco.x}%`, width: `${hueco.ancho}%` }
                : { top: ajuste.topFicha, left: 0, right: 0 }
            }
            className={`absolute z-30 ${ajuste.dentro ? 'text-left' : 'px-2 text-center'}`}
          >
            {ficha}
          </div>
        )}
      </div>
    </div>
  );
};
