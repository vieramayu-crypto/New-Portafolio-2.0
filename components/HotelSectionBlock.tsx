import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { HotelStory } from '../types';

interface HotelSectionBlockProps {
  story: HotelStory;
  index: number;
  onSelectStory?: (story: HotelStory) => void;
}

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

  // Parallax offsets for floating photos
  const yPhoto1 = useTransform(smoothProgress, [0, 1], ['80px', '-80px']);
  const yPhoto2 = useTransform(smoothProgress, [0, 1], ['120px', '-120px']);
  const yPhoto3 = useTransform(smoothProgress, [0, 1], ['50px', '-50px']);

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

  return (
    <div
      ref={sectionRef}
      id={`hotel-${story.id}`}
      data-hotel-id={story.id}
      className="hotel-section-block relative w-full py-16 md:py-28 px-4 md:px-12 lg:px-20 overflow-hidden min-h-[1050px] md:min-h-[1380px]"
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
      <div className="max-w-[1380px] xl:max-w-[1520px] mx-auto pl-6 md:pl-28 lg:pl-36 pr-6 md:pr-28 lg:pr-36 min-h-[980px] md:min-h-[1320px] relative">
        
        {/* VARIANT 0: Giant Hero VERTICAL (left ~68%) + Top-Right Floating + Bottom-Right Overlap (~48%) */}
        {variant === 0 && (
          <div className="relative w-full h-full min-h-[980px] md:min-h-[1320px] flex flex-col md:block">
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
                className="relative md:absolute left-0 md:left-[0%] top-0 md:top-[2%] w-full md:w-[68%] aspect-[3/4] shadow-2xl group overflow-hidden bg-stone-200 mb-8 md:mb-0 z-10"
              >
                <img
                  src={photos[0].url}
                  alt={photos[0].alt}
                  className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                    photos[0].isBlackAndWhite ? 'grayscale contrast-125' : ''
                  }`}
                />
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
                className="relative md:absolute right-0 md:right-[0%] top-0 md:top-[2%] w-full md:w-[34%] aspect-[3/4] shadow-md group overflow-hidden bg-stone-200 mb-8 md:mb-0 z-10"
              >
                <img
                  src={photos[1].url}
                  alt={photos[1].alt}
                  className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                    photos[1].isBlackAndWhite ? 'grayscale contrast-125' : ''
                  }`}
                />
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
                className="relative md:absolute right-0 md:right-[2%] top-0 md:top-[58%] w-full md:w-[48%] aspect-[4/3] shadow-2xl group overflow-hidden bg-stone-200 z-20"
              >
                <img
                  src={photos[2].url}
                  alt={photos[2].alt}
                  className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                    photos[2].isBlackAndWhite ? 'grayscale contrast-125' : ''
                  }`}
                />
              </motion.div>
            )}
          </div>
        )}

        {/* VARIANT 1: Giant Hero SQUARE (right ~68%) + Top-Left Detail + Bottom-Left Overlap (~46%) */}
        {variant === 1 && (
          <div className="relative w-full h-full min-h-[980px] md:min-h-[1320px] flex flex-col md:block">
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
                className="relative md:absolute left-0 md:left-[0%] top-0 md:top-[2%] w-full md:w-[36%] aspect-[4/3] shadow-lg group overflow-hidden bg-stone-200 mb-8 md:mb-0 z-10"
              >
                <img
                  src={photos[0].url}
                  alt={photos[0].alt}
                  className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                    photos[0].isBlackAndWhite ? 'grayscale contrast-125' : ''
                  }`}
                />
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
                className="relative md:absolute right-0 md:right-[0%] top-0 md:top-[2%] w-full md:w-[68%] aspect-square shadow-2xl group overflow-hidden bg-stone-200 mb-8 md:mb-0 z-10"
              >
                <img
                  src={photos[1].url}
                  alt={photos[1].alt}
                  className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                    photos[1].isBlackAndWhite ? 'grayscale contrast-125' : ''
                  }`}
                />
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
                className="relative md:absolute left-0 md:left-[4%] top-0 md:top-[48%] w-full md:w-[46%] aspect-[3/4] shadow-2xl group overflow-hidden bg-stone-200 z-20"
              >
                <img
                  src={photos[2].url}
                  alt={photos[2].alt}
                  className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                    photos[2].isBlackAndWhite ? 'grayscale contrast-125' : ''
                  }`}
                />
              </motion.div>
            )}
          </div>
        )}

        {/* VARIANT 2: Giant Hero VERTICAL (left ~68%) + Top-Right Landscape + Bottom-Right Portrait (~42%) */}
        {variant === 2 && (
          <div className="relative w-full h-full min-h-[980px] md:min-h-[1320px] flex flex-col md:block">
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
                className="relative md:absolute left-0 md:left-[0%] top-0 md:top-[2%] w-full md:w-[68%] aspect-[3/4] shadow-2xl group overflow-hidden bg-stone-200 mb-8 md:mb-0 z-10"
              >
                <img
                  src={photos[0].url}
                  alt={photos[0].alt}
                  className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                    photos[0].isBlackAndWhite ? 'grayscale contrast-125' : ''
                  }`}
                />
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
                className="relative md:absolute right-0 md:right-[0%] top-0 md:top-[2%] w-full md:w-[38%] aspect-[4/3] shadow-lg group overflow-hidden bg-stone-200 mb-8 md:mb-0 z-10"
              >
                <img
                  src={photos[1].url}
                  alt={photos[1].alt}
                  className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                    photos[1].isBlackAndWhite ? 'grayscale contrast-125' : ''
                  }`}
                />
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
                className="relative md:absolute right-0 md:right-[2%] top-0 md:top-[58%] w-full md:w-[42%] aspect-[3/4] shadow-2xl group overflow-hidden bg-stone-200 z-20"
              >
                <img
                  src={photos[2].url}
                  alt={photos[2].alt}
                  className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                    photos[2].isBlackAndWhite ? 'grayscale contrast-125' : ''
                  }`}
                />
              </motion.div>
            )}
          </div>
        )}

        {/* VARIANT 3: Giant Hero SQUARE (center/right ~68%) + Left Top Floating + Bottom Right Overlap (~44%) */}
        {variant === 3 && (
          <div className="relative w-full h-full min-h-[980px] md:min-h-[1320px] flex flex-col md:block">
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
                className="relative md:absolute left-0 md:left-[0%] top-0 md:top-[4%] w-full md:w-[32%] aspect-[3/4] shadow-md group overflow-hidden bg-stone-200 mb-8 md:mb-0 z-30"
              >
                <img
                  src={photos[0].url}
                  alt={photos[0].alt}
                  className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                    photos[0].isBlackAndWhite ? 'grayscale contrast-125' : ''
                  }`}
                />
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
                className="relative md:absolute left-0 md:left-[22%] top-0 md:top-[2%] w-full md:w-[68%] aspect-square shadow-2xl group overflow-hidden bg-stone-200 mb-8 md:mb-0 z-10"
              >
                <img
                  src={photos[1].url}
                  alt={photos[1].alt}
                  className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                    photos[1].isBlackAndWhite ? 'grayscale contrast-125' : ''
                  }`}
                />
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
                className="relative md:absolute right-0 md:right-[0%] top-0 md:top-[52%] w-full md:w-[44%] aspect-[4/3] shadow-2xl group overflow-hidden bg-stone-200 z-20"
              >
                <img
                  src={photos[2].url}
                  alt={photos[2].alt}
                  className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                    photos[2].isBlackAndWhite ? 'grayscale contrast-125' : ''
                  }`}
                />
              </motion.div>
            )}
          </div>
        )}

        {/* VARIANT 4: Top Floating + Giant Hero VERTICAL (bottom left ~66%) + Bottom-Right Floating (~38%) */}
        {variant === 4 && (
          <div className="relative w-full h-full min-h-[980px] md:min-h-[1320px] flex flex-col md:block">
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
                className="relative md:absolute left-0 md:left-[20%] top-0 md:top-[4%] w-full md:w-[60%] aspect-[16/9] shadow-xl group overflow-hidden bg-stone-200 mb-8 md:mb-0 z-10"
              >
                <img
                  src={photos[0].url}
                  alt={photos[0].alt}
                  className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                    photos[0].isBlackAndWhite ? 'grayscale contrast-125' : ''
                  }`}
                />
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
                className="relative md:absolute left-0 md:left-[0%] top-0 md:top-[26%] w-full md:w-[66%] aspect-[3/4] shadow-2xl group overflow-hidden bg-stone-200 mb-8 md:mb-0 z-20"
              >
                <img
                  src={photos[1].url}
                  alt={photos[1].alt}
                  className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                    photos[1].isBlackAndWhite ? 'grayscale contrast-125' : ''
                  }`}
                />
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
                className="relative md:absolute right-0 md:right-[0%] top-0 md:top-[44%] w-full md:w-[38%] aspect-[3/4] shadow-md group overflow-hidden bg-stone-200 z-10"
              >
                <img
                  src={photos[2].url}
                  alt={photos[2].alt}
                  className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                    photos[2].isBlackAndWhite ? 'grayscale contrast-125' : ''
                  }`}
                />
              </motion.div>
            )}
          </div>
        )}

        {/* VARIANT 5: Giant Hero VERTICAL (right ~58%) + Top-Left Detail + Bottom-Left Landscape (~48%) */}
        {variant === 5 && (
          <div className="relative w-full h-full min-h-[980px] md:min-h-[1320px] flex flex-col md:block">
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
                className="relative md:absolute left-0 md:left-[0%] top-0 md:top-[4%] w-full md:w-[32%] aspect-square shadow-md group overflow-hidden bg-stone-200 mb-8 md:mb-0 z-10"
              >
                <img
                  src={photos[0].url}
                  alt={photos[0].alt}
                  className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                    photos[0].isBlackAndWhite ? 'grayscale contrast-125' : ''
                  }`}
                />
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
                className="relative md:absolute right-0 md:right-[0%] top-0 md:top-[2%] w-full md:w-[58%] aspect-[3/4] shadow-2xl group overflow-hidden bg-stone-200 mb-8 md:mb-0 z-10"
              >
                <img
                  src={photos[1].url}
                  alt={photos[1].alt}
                  className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                    photos[1].isBlackAndWhite ? 'grayscale contrast-125' : ''
                  }`}
                />
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
                className="relative md:absolute left-0 md:left-[2%] top-0 md:top-[48%] w-full md:w-[48%] aspect-[4/3] shadow-2xl group overflow-hidden bg-stone-200 z-20"
              >
                <img
                  src={photos[2].url}
                  alt={photos[2].alt}
                  className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                    photos[2].isBlackAndWhite ? 'grayscale contrast-125' : ''
                  }`}
                />
              </motion.div>
            )}
          </div>
        )}

        {/* VARIANT 6: Giant Hero VERTICAL (left ~68%) + Right Top Floating + Bottom Center Portrait (~42%) */}
        {variant === 6 && (
          <div className="relative w-full h-full min-h-[980px] md:min-h-[1320px] flex flex-col md:block">
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
                className="relative md:absolute left-0 md:left-[0%] top-0 md:top-[2%] w-full md:w-[68%] aspect-[3/4] shadow-2xl group overflow-hidden bg-stone-200 mb-8 md:mb-0 z-10"
              >
                <img
                  src={photos[0].url}
                  alt={photos[0].alt}
                  className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                    photos[0].isBlackAndWhite ? 'grayscale contrast-125' : ''
                  }`}
                />
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
                className="relative md:absolute right-0 md:right-[0%] top-0 md:top-[2%] w-full md:w-[36%] aspect-[3/4] shadow-lg group overflow-hidden bg-stone-200 mb-8 md:mb-0 z-10"
              >
                <img
                  src={photos[1].url}
                  alt={photos[1].alt}
                  className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                    photos[1].isBlackAndWhite ? 'grayscale contrast-125' : ''
                  }`}
                />
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
                className="relative md:absolute left-0 md:left-[30%] top-0 md:top-[56%] w-full md:w-[42%] aspect-[3/4] shadow-2xl group overflow-hidden bg-stone-200 z-20"
              >
                <img
                  src={photos[2].url}
                  alt={photos[2].alt}
                  className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                    photos[2].isBlackAndWhite ? 'grayscale contrast-125' : ''
                  }`}
                />
              </motion.div>
            )}
          </div>
        )}

        {/* VARIANT 7: Giant Hero SQUARE (right ~68%) + Top Left Floating + Bottom Left Landscape (~48%) */}
        {variant === 7 && (
          <div className="relative w-full h-full min-h-[980px] md:min-h-[1320px] flex flex-col md:block">
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
                className="relative md:absolute left-0 md:left-[0%] top-0 md:top-[2%] w-full md:w-[32%] aspect-square shadow-lg group overflow-hidden bg-stone-200 mb-8 md:mb-0 z-10"
              >
                <img
                  src={photos[0].url}
                  alt={photos[0].alt}
                  className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                    photos[0].isBlackAndWhite ? 'grayscale contrast-125' : ''
                  }`}
                />
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
                className="relative md:absolute right-0 md:right-[0%] top-0 md:top-[2%] w-full md:w-[68%] aspect-square shadow-2xl group overflow-hidden bg-stone-200 mb-8 md:mb-0 z-10"
              >
                <img
                  src={photos[1].url}
                  alt={photos[1].alt}
                  className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                    photos[1].isBlackAndWhite ? 'grayscale contrast-125' : ''
                  }`}
                />
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
                className="relative md:absolute left-0 md:left-[0%] top-0 md:top-[56%] w-full md:w-[48%] aspect-[4/3] shadow-2xl group overflow-hidden bg-stone-200 z-20"
              >
                <img
                  src={photos[2].url}
                  alt={photos[2].alt}
                  className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                    photos[2].isBlackAndWhite ? 'grayscale contrast-125' : ''
                  }`}
                />
              </motion.div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
