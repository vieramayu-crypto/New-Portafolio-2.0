import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'motion/react';
import { HotelStory, PhotoItem } from '../types';
import { CASE_STUDIES } from '../data/caseStudies';
import { toTitleCase } from '../src/lib/hotelName';

interface HotelDetailProps {
  story: HotelStory;
  onBack: () => void;
  onNavigateStory?: (direction: 'prev' | 'next') => void;
  prevStory?: HotelStory | null;
  nextStory?: HotelStory | null;
}

interface GalleryPhotoProps {
  photo: PhotoItem;
  y: ReturnType<typeof useTransform<number, string>>;
  aspectClass: string;
  widthClass: string;
  offsetClass?: string;
  bleed?: boolean;
}

const GalleryPhoto: React.FC<GalleryPhotoProps> = ({ photo, y, aspectClass, widthClass, offsetClass, bleed }) => (
  <motion.div
    style={{ y }}
    className={`relative ${widthClass} ${aspectClass} ${offsetClass || ''} ${
      bleed ? '' : 'shadow-2xl'
    } group overflow-hidden bg-stone-200`}
  >
    <img
      src={photo.url}
      alt={photo.alt}
      className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
        photo.isBlackAndWhite ? 'grayscale contrast-125' : ''
      }`}
    />
  </motion.div>
);

interface GalleryVideoProps {
  video: { url: string; poster: string };
  y: ReturnType<typeof useTransform<number, string>>;
}

const GalleryVideo: React.FC<GalleryVideoProps> = ({ video, y }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    videoRef.current?.play();
    setIsPlaying(true);
  };

  return (
    <motion.div style={{ y }} className="relative w-full aspect-[16/9] overflow-hidden bg-stone-200 group">
      <video
        ref={videoRef}
        src={video.url}
        poster={video.poster}
        playsInline
        controls={isPlaying}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        className="w-full h-full object-cover"
      />
      {!isPlaying && (
        <button
          onClick={handlePlay}
          aria-label="Reproducir vídeo"
          className="absolute inset-0 flex items-center justify-center"
        >
          <span className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/95 shadow-lg flex items-center justify-center transition-transform group-hover:scale-105">
            <svg viewBox="0 0 24 24" className="w-6 h-6 md:w-7 md:h-7 translate-x-[2px] text-[#1a1918]" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </button>
      )}
    </motion.div>
  );
};

interface GalleryLayoutProps {
  photos: PhotoItem[];
  y: ReturnType<typeof useTransform<number, string>>[];
  video?: { url: string; poster: string };
}

const Bleed: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen">{children}</div>
);

// 8 distinct gallery arrangements -- one per hotel, picked via story.layoutVariant.
// Each hotel already has its own single-digit layoutVariant (0-7) for its home
// teaser block, so it's reused here to also pick a matching, unique gallery
// rhythm: a different opening move, width split, offset direction and aspect
// ratio mix, so no two hotel portfolios read as the same template reordered.
// All blocks are conditional on the photo existing, same as before, so a
// hotel with only 3 photos loaded still renders a complete-feeling page.
const GALLERY_LAYOUTS: Array<React.FC<GalleryLayoutProps>> = [
  // 0 -- THE RITZ-CARLTON TENERIFE, ABAMA: a guided walk through the property --
  // facade, grounds + room, private cove, architecture + pool, spa, dining.
  ({ photos, y, video }) => (
    <>
      {photos[0] && (
        <div className="w-full flex justify-center">
          <GalleryPhoto photo={photos[0]} y={y[0]} aspectClass="aspect-[3/4]" widthClass="w-full md:w-[56%]" />
        </div>
      )}
      {(photos[1] || photos[2]) && (
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
          {photos[1] && (
            <GalleryPhoto photo={photos[1]} y={y[1]} aspectClass="aspect-[3/4]" widthClass="w-full md:w-[62%]" />
          )}
          {photos[2] && (
            <GalleryPhoto
              photo={photos[2]}
              y={y[2]}
              aspectClass="aspect-[3/4]"
              widthClass="w-full md:w-[34%]"
              offsetClass="md:mt-20"
            />
          )}
        </div>
      )}
      {video ? (
        <Bleed>
          <GalleryVideo video={video} y={y[3]} />
        </Bleed>
      ) : (
        photos[3] && (
          <Bleed>
            <GalleryPhoto photo={photos[3]} y={y[3]} aspectClass="aspect-[16/9]" widthClass="w-full" bleed />
          </Bleed>
        )
      )}
      {(photos[4] || photos[5]) && (
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
          {photos[4] && (
            <GalleryPhoto
              photo={photos[4]}
              y={y[4]}
              aspectClass="aspect-[3/4]"
              widthClass="w-full md:w-[34%]"
              offsetClass="md:mt-20"
            />
          )}
          {photos[5] && (
            <GalleryPhoto photo={photos[5]} y={y[5]} aspectClass="aspect-[3/4]" widthClass="w-full md:w-[62%]" />
          )}
        </div>
      )}
      {photos[6] && (
        <div className="w-full flex justify-center">
          <GalleryPhoto photo={photos[6]} y={y[6]} aspectClass="aspect-[4/5]" widthClass="w-full md:w-[68%]" />
        </div>
      )}
      {photos[7] && (
        <Bleed>
          <GalleryPhoto photo={photos[7]} y={y[7]} aspectClass="aspect-[16/9]" widthClass="w-full" bleed />
        </Bleed>
      )}
      {photos[8] && (
        <div className="w-full flex justify-center">
          <GalleryPhoto photo={photos[8]} y={y[8]} aspectClass="aspect-square" widthClass="w-full md:w-[50%]" />
        </div>
      )}
      {photos[9] && (
        <div className="w-full">
          <GalleryPhoto photo={photos[9]} y={y[9]} aspectClass="aspect-[16/9]" widthClass="w-full" />
        </div>
      )}
    </>
  ),

  // 1 -- VESTIGE COLLECTION, BINIDUFÀ: a longer guided walk (10 photos) -- aerial,
  // facade, common areas, the path in, patio + gym, grounds, pool, room.
  ({ photos, y }) => (
    <>
      {photos[0] && (
        <Bleed>
          <GalleryPhoto photo={photos[0]} y={y[0]} aspectClass="aspect-[16/9]" widthClass="w-full" bleed />
        </Bleed>
      )}
      {photos[1] && (
        <div className="w-full flex justify-center">
          <GalleryPhoto photo={photos[1]} y={y[1]} aspectClass="aspect-[4/3]" widthClass="w-full md:w-[72%]" />
        </div>
      )}
      {(photos[2] || photos[3]) && (
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 justify-center">
          {photos[2] && (
            <GalleryPhoto
              photo={photos[2]}
              y={y[2]}
              aspectClass="aspect-[3/4]"
              widthClass="w-full md:w-[42%]"
              offsetClass="md:mt-16"
            />
          )}
          {photos[3] && (
            <GalleryPhoto photo={photos[3]} y={y[3]} aspectClass="aspect-[3/4]" widthClass="w-full md:w-[42%]" />
          )}
        </div>
      )}
      {photos[4] && (
        <Bleed>
          <GalleryPhoto photo={photos[4]} y={y[4]} aspectClass="aspect-[16/9]" widthClass="w-full" bleed />
        </Bleed>
      )}
      {(photos[5] || photos[6]) && (
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 justify-center">
          {photos[5] && (
            <GalleryPhoto photo={photos[5]} y={y[5]} aspectClass="aspect-[3/4]" widthClass="w-full md:w-[42%]" />
          )}
          {photos[6] && (
            <GalleryPhoto
              photo={photos[6]}
              y={y[6]}
              aspectClass="aspect-[3/4]"
              widthClass="w-full md:w-[42%]"
              offsetClass="md:mt-16"
            />
          )}
        </div>
      )}
      {photos[7] && (
        <div className="w-full flex justify-center">
          <GalleryPhoto photo={photos[7]} y={y[7]} aspectClass="aspect-[3/4]" widthClass="w-full md:w-[52%]" />
        </div>
      )}
      {photos[8] && (
        <Bleed>
          <GalleryPhoto photo={photos[8]} y={y[8]} aspectClass="aspect-[16/9]" widthClass="w-full" bleed />
        </Bleed>
      )}
      {photos[9] && (
        <div className="w-full flex justify-center">
          <GalleryPhoto photo={photos[9]} y={y[9]} aspectClass="aspect-[4/3]" widthClass="w-full md:w-[68%]" />
        </div>
      )}
    </>
  ),

  // 2 -- DELTAPARK VITALRESORT: a longer guided walk (12 photos) -- aerial,
  // lobby + arrival, room + balcony, breakfast, spa, wellness + lake, dusk
  // facade, closing overhead aerial. Denser rhythm than the others: two
  // pairs run back-to-back twice instead of always alternating with solos.
  ({ photos, y }) => (
    <>
      {photos[0] && (
        <Bleed>
          <GalleryPhoto photo={photos[0]} y={y[0]} aspectClass="aspect-[16/9]" widthClass="w-full" bleed />
        </Bleed>
      )}
      {(photos[1] || photos[2]) && (
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
          {photos[1] && (
            <GalleryPhoto photo={photos[1]} y={y[1]} aspectClass="aspect-[3/4]" widthClass="w-full md:w-[62%]" />
          )}
          {photos[2] && (
            <GalleryPhoto
              photo={photos[2]}
              y={y[2]}
              aspectClass="aspect-[3/4]"
              widthClass="w-full md:w-[34%]"
              offsetClass="md:mt-20"
            />
          )}
        </div>
      )}
      {(photos[3] || photos[4]) && (
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
          {photos[3] && (
            <GalleryPhoto
              photo={photos[3]}
              y={y[3]}
              aspectClass="aspect-[3/4]"
              widthClass="w-full md:w-[34%]"
              offsetClass="md:mt-20"
            />
          )}
          {photos[4] && (
            <GalleryPhoto photo={photos[4]} y={y[4]} aspectClass="aspect-[3/4]" widthClass="w-full md:w-[62%]" />
          )}
        </div>
      )}
      {photos[5] && (
        <div className="w-full flex justify-center">
          <GalleryPhoto photo={photos[5]} y={y[5]} aspectClass="aspect-[4/5]" widthClass="w-full md:w-[54%]" />
        </div>
      )}
      {(photos[6] || photos[7]) && (
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
          {photos[6] && (
            <GalleryPhoto photo={photos[6]} y={y[6]} aspectClass="aspect-[3/4]" widthClass="w-full md:w-[62%]" />
          )}
          {photos[7] && (
            <GalleryPhoto
              photo={photos[7]}
              y={y[7]}
              aspectClass="aspect-[3/4]"
              widthClass="w-full md:w-[34%]"
              offsetClass="md:mt-20"
            />
          )}
        </div>
      )}
      {(photos[8] || photos[9]) && (
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
          {photos[8] && (
            <GalleryPhoto
              photo={photos[8]}
              y={y[8]}
              aspectClass="aspect-[3/4]"
              widthClass="w-full md:w-[34%]"
              offsetClass="md:mt-20"
            />
          )}
          {photos[9] && (
            <GalleryPhoto photo={photos[9]} y={y[9]} aspectClass="aspect-[3/4]" widthClass="w-full md:w-[62%]" />
          )}
        </div>
      )}
      {photos[10] && (
        <Bleed>
          <GalleryPhoto photo={photos[10]} y={y[10]} aspectClass="aspect-[16/9]" widthClass="w-full" bleed />
        </Bleed>
      )}
      {photos[11] && (
        <div className="w-full flex justify-center">
          <GalleryPhoto photo={photos[11]} y={y[11]} aspectClass="aspect-[3/4]" widthClass="w-full md:w-[50%]" />
        </div>
      )}
    </>
  ),

  // 3 -- HONEYMOON PETRA VILLAS: a longer guided walk (12 photos) -- arrival,
  // room details, walk to view, breakfast + square dome hero, poolside pair,
  // wide pool bleed, cliff pool + closing sunset. Photos 0/9/10 horizontal,
  // 6 square, rest portrait.
  ({ photos, y }) => (
    <>
      {photos[0] && (
        <Bleed>
          <GalleryPhoto photo={photos[0]} y={y[0]} aspectClass="aspect-[3/2]" widthClass="w-full" bleed />
        </Bleed>
      )}
      {(photos[1] || photos[2]) && (
        <div className="flex flex-col md:flex-row gap-10 md:gap-14 justify-center items-start">
          {photos[1] && (
            <GalleryPhoto photo={photos[1]} y={y[1]} aspectClass="aspect-[3/4]" widthClass="w-full md:w-[36%]" />
          )}
          {photos[2] && (
            <GalleryPhoto
              photo={photos[2]}
              y={y[2]}
              aspectClass="aspect-[3/4]"
              widthClass="w-full md:w-[36%]"
              offsetClass="md:mt-12"
            />
          )}
        </div>
      )}
      {(photos[3] || photos[4]) && (
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
          {photos[3] && (
            <GalleryPhoto photo={photos[3]} y={y[3]} aspectClass="aspect-[3/4]" widthClass="w-full md:w-[62%]" />
          )}
          {photos[4] && (
            <GalleryPhoto
              photo={photos[4]}
              y={y[4]}
              aspectClass="aspect-[3/4]"
              widthClass="w-full md:w-[34%]"
              offsetClass="md:mt-20"
            />
          )}
        </div>
      )}
      {photos[5] && (
        <div className="w-full flex justify-center">
          <GalleryPhoto photo={photos[5]} y={y[5]} aspectClass="aspect-[3/4]" widthClass="w-full md:w-[48%]" />
        </div>
      )}
      {photos[6] && (
        <div className="w-full flex justify-center">
          <GalleryPhoto photo={photos[6]} y={y[6]} aspectClass="aspect-square" widthClass="w-full md:w-[58%]" />
        </div>
      )}
      {(photos[7] || photos[8]) && (
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
          {photos[7] && (
            <GalleryPhoto
              photo={photos[7]}
              y={y[7]}
              aspectClass="aspect-[3/4]"
              widthClass="w-full md:w-[34%]"
              offsetClass="md:mt-20"
            />
          )}
          {photos[8] && (
            <GalleryPhoto photo={photos[8]} y={y[8]} aspectClass="aspect-[3/4]" widthClass="w-full md:w-[62%]" />
          )}
        </div>
      )}
      {photos[9] && (
        <Bleed>
          <GalleryPhoto photo={photos[9]} y={y[9]} aspectClass="aspect-[16/9]" widthClass="w-full" bleed />
        </Bleed>
      )}
      {photos[10] && (
        <div className="w-full">
          <GalleryPhoto photo={photos[10]} y={y[10]} aspectClass="aspect-[16/9]" widthClass="w-full" />
        </div>
      )}
      {photos[11] && (
        <div className="w-full flex justify-center">
          <GalleryPhoto photo={photos[11]} y={y[11]} aspectClass="aspect-[3/4]" widthClass="w-full md:w-[52%]" />
        </div>
      )}
    </>
  ),

  // 4 -- GPRO VALPARAÍSO PALACE & SPA: 13 photos, chronological with color coherence.
  // Slot map:
  //   0 recepción-h (solo landscape) → 1 cartel-jardín-v (solo portrait) →
  //   2+3 suite arrival + café mostaza (warm-room portrait pair) →
  //   4+5 cava + silueta cortina (warm-room portrait pair) →
  //   6 albornoz vista (portrait solo) → 7 sauna (portrait solo, warm dark) →
  //   8 spa cascada (landscape bleed, transition to blue) →
  //   9 jacuzzi pareja (landscape solo) →
  //   10 piscina bali beds (landscape bleed, exterior wow) →
  //   11+12 piernas frutas + piscina palmeras (blue-pool portrait pair).
  ({ photos, y }) => (
    <>
      {photos[0] && (
        <div className="w-full flex justify-center">
          <GalleryPhoto photo={photos[0]} y={y[0]} aspectClass="aspect-[3/2]" widthClass="w-full md:w-[78%]" />
        </div>
      )}
      {photos[1] && (
        <div className="w-full flex justify-center">
          <GalleryPhoto photo={photos[1]} y={y[1]} aspectClass="aspect-[3/4]" widthClass="w-full md:w-[42%]" />
        </div>
      )}
      {(photos[2] || photos[3]) && (
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
          {photos[2] && (
            <GalleryPhoto photo={photos[2]} y={y[2]} aspectClass="aspect-[3/4]" widthClass="w-full md:w-[48%]" />
          )}
          {photos[3] && (
            <GalleryPhoto
              photo={photos[3]}
              y={y[3]}
              aspectClass="aspect-[3/4]"
              widthClass="w-full md:w-[48%]"
              offsetClass="md:mt-16"
            />
          )}
        </div>
      )}
      {(photos[4] || photos[5]) && (
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
          {photos[4] && (
            <GalleryPhoto
              photo={photos[4]}
              y={y[4]}
              aspectClass="aspect-[3/4]"
              widthClass="w-full md:w-[48%]"
              offsetClass="md:mt-16"
            />
          )}
          {photos[5] && (
            <GalleryPhoto photo={photos[5]} y={y[5]} aspectClass="aspect-[3/4]" widthClass="w-full md:w-[48%]" />
          )}
        </div>
      )}
      {photos[6] && (
        <div className="w-full flex justify-center">
          <GalleryPhoto photo={photos[6]} y={y[6]} aspectClass="aspect-[3/4]" widthClass="w-full md:w-[46%]" />
        </div>
      )}
      {photos[7] && (
        <div className="w-full flex justify-center">
          <GalleryPhoto photo={photos[7]} y={y[7]} aspectClass="aspect-[3/4]" widthClass="w-full md:w-[46%]" />
        </div>
      )}
      {photos[8] && (
        <Bleed>
          <GalleryPhoto photo={photos[8]} y={y[8]} aspectClass="aspect-[3/2]" widthClass="w-full" bleed />
        </Bleed>
      )}
      {photos[9] && (
        <div className="w-full flex justify-center">
          <GalleryPhoto photo={photos[9]} y={y[9]} aspectClass="aspect-[3/2]" widthClass="w-full md:w-[74%]" />
        </div>
      )}
      {photos[10] && (
        <Bleed>
          <GalleryPhoto photo={photos[10]} y={y[10]} aspectClass="aspect-[3/2]" widthClass="w-full" bleed />
        </Bleed>
      )}
      {(photos[11] || photos[12]) && (
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
          {photos[11] && (
            <GalleryPhoto photo={photos[11]} y={y[11]} aspectClass="aspect-[3/4]" widthClass="w-full md:w-[48%]" />
          )}
          {photos[12] && (
            <GalleryPhoto
              photo={photos[12]}
              y={y[12]}
              aspectClass="aspect-[3/4]"
              widthClass="w-full md:w-[48%]"
              offsetClass="md:mt-16"
            />
          )}
        </div>
      )}
    </>
  ),

  // 5 -- HOTEL ESPLÉNDIDO: 13 photos, chronological with color coherence.
  // Slot map:
  //   0 fachada nocturna (landscape bleed) → 1 guía flat lay (portrait solo) →
  //   2+3 detalle habitación + spa entrada (warm portrait pair) →
  //   4 spa interior turquesa (landscape solo, transition to blue) →
  //   5+6 bahía panorámica + playa vestido (blue portrait pair) →
  //   7 piscina + bahía + faro (landscape bleed, pool wow) →
  //   8+9 coco + copa piernas (blue-pool portrait pair) →
  //   10 entrada bistro Davant la Mar (square solo, day facade) →
  //   11 terraza pareja vista (landscape solo, warm terrace) →
  //   12 tranvía (portrait solo, closing outside).
  ({ photos, y }) => (
    <>
      {photos[0] && (
        <Bleed>
          <GalleryPhoto photo={photos[0]} y={y[0]} aspectClass="aspect-[3/2]" widthClass="w-full" bleed />
        </Bleed>
      )}
      {photos[1] && (
        <div className="w-full flex justify-center">
          <GalleryPhoto photo={photos[1]} y={y[1]} aspectClass="aspect-[3/4]" widthClass="w-full md:w-[42%]" />
        </div>
      )}
      {(photos[2] || photos[3]) && (
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
          {photos[2] && (
            <GalleryPhoto photo={photos[2]} y={y[2]} aspectClass="aspect-[3/4]" widthClass="w-full md:w-[48%]" />
          )}
          {photos[3] && (
            <GalleryPhoto
              photo={photos[3]}
              y={y[3]}
              aspectClass="aspect-[3/4]"
              widthClass="w-full md:w-[48%]"
              offsetClass="md:mt-16"
            />
          )}
        </div>
      )}
      {photos[4] && (
        <div className="w-full flex justify-center">
          <GalleryPhoto photo={photos[4]} y={y[4]} aspectClass="aspect-[3/2]" widthClass="w-full md:w-[74%]" />
        </div>
      )}
      {(photos[5] || photos[6]) && (
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
          {photos[5] && (
            <GalleryPhoto
              photo={photos[5]}
              y={y[5]}
              aspectClass="aspect-[3/4]"
              widthClass="w-full md:w-[48%]"
              offsetClass="md:mt-16"
            />
          )}
          {photos[6] && (
            <GalleryPhoto photo={photos[6]} y={y[6]} aspectClass="aspect-[3/4]" widthClass="w-full md:w-[48%]" />
          )}
        </div>
      )}
      {photos[7] && (
        <Bleed>
          <GalleryPhoto photo={photos[7]} y={y[7]} aspectClass="aspect-[3/2]" widthClass="w-full" bleed />
        </Bleed>
      )}
      {(photos[8] || photos[9]) && (
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
          {photos[8] && (
            <GalleryPhoto photo={photos[8]} y={y[8]} aspectClass="aspect-[3/4]" widthClass="w-full md:w-[48%]" />
          )}
          {photos[9] && (
            <GalleryPhoto
              photo={photos[9]}
              y={y[9]}
              aspectClass="aspect-[3/4]"
              widthClass="w-full md:w-[48%]"
              offsetClass="md:mt-16"
            />
          )}
        </div>
      )}
      {photos[10] && (
        <div className="w-full flex justify-center">
          <GalleryPhoto photo={photos[10]} y={y[10]} aspectClass="aspect-square" widthClass="w-full md:w-[50%]" />
        </div>
      )}
      {photos[11] && (
        <div className="w-full flex justify-center">
          <GalleryPhoto photo={photos[11]} y={y[11]} aspectClass="aspect-[3/2]" widthClass="w-full md:w-[74%]" />
        </div>
      )}
      {photos[12] && (
        <div className="w-full flex justify-center">
          <GalleryPhoto photo={photos[12]} y={y[12]} aspectClass="aspect-[3/4]" widthClass="w-full md:w-[46%]" />
        </div>
      )}
    </>
  ),

  // 6 -- INTERCONTINENTAL LISBOA: 12 photos, chronological arrival-to-dinner walk.
  // Slot map (h/v):
  //   0 fachada-h (bleed) → 1 recepcion-h (solo) → 2 lobby-v (solo) →
  //   3 escritorio-h (solo landscape "room with the view") → 4 cama-detalle-v (solo) →
  //   5+6 butler-v + desayuno-cenital-v (pair) → 7 pareja-brindando-h (bleed) →
  //   8+9 silueta-v + cortinas-v (light-and-curtain pair) →
  //   10+11 gym-v + lampara-restaurante-v (closing pair).
  // The vertical facade, the tram and the coffee close-up live on the home teaser.
  ({ photos, y }) => (
    <>
      {photos[0] && (
        <Bleed>
          <GalleryPhoto photo={photos[0]} y={y[0]} aspectClass="aspect-[3/2]" widthClass="w-full" bleed />
        </Bleed>
      )}
      {photos[1] && (
        <div className="w-full flex justify-center">
          <GalleryPhoto photo={photos[1]} y={y[1]} aspectClass="aspect-[3/2]" widthClass="w-full md:w-[74%]" />
        </div>
      )}
      {photos[2] && (
        <div className="w-full flex justify-center">
          <GalleryPhoto photo={photos[2]} y={y[2]} aspectClass="aspect-[3/4]" widthClass="w-full md:w-[46%]" />
        </div>
      )}
      {photos[3] && (
        <div className="w-full flex justify-center">
          <GalleryPhoto photo={photos[3]} y={y[3]} aspectClass="aspect-[4/3]" widthClass="w-full md:w-[68%]" />
        </div>
      )}
      {photos[4] && (
        <div className="w-full flex justify-center">
          <GalleryPhoto photo={photos[4]} y={y[4]} aspectClass="aspect-[3/4]" widthClass="w-full md:w-[46%]" />
        </div>
      )}
      {(photos[5] || photos[6]) && (
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
          {photos[5] && (
            <GalleryPhoto photo={photos[5]} y={y[5]} aspectClass="aspect-[3/4]" widthClass="w-full md:w-[48%]" />
          )}
          {photos[6] && (
            <GalleryPhoto
              photo={photos[6]}
              y={y[6]}
              aspectClass="aspect-[3/4]"
              widthClass="w-full md:w-[48%]"
              offsetClass="md:mt-16"
            />
          )}
        </div>
      )}
      {photos[7] && (
        <Bleed>
          <GalleryPhoto photo={photos[7]} y={y[7]} aspectClass="aspect-[3/2]" widthClass="w-full" bleed />
        </Bleed>
      )}
      {(photos[8] || photos[9]) && (
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
          {photos[8] && (
            <GalleryPhoto
              photo={photos[8]}
              y={y[8]}
              aspectClass="aspect-[3/4]"
              widthClass="w-full md:w-[48%]"
              offsetClass="md:mt-16"
            />
          )}
          {photos[9] && (
            <GalleryPhoto photo={photos[9]} y={y[9]} aspectClass="aspect-[3/4]" widthClass="w-full md:w-[48%]" />
          )}
        </div>
      )}
      {(photos[10] || photos[11]) && (
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
          {photos[10] && (
            <GalleryPhoto photo={photos[10]} y={y[10]} aspectClass="aspect-[3/4]" widthClass="w-full md:w-[48%]" />
          )}
          {photos[11] && (
            <GalleryPhoto
              photo={photos[11]}
              y={y[11]}
              aspectClass="aspect-[3/4]"
              widthClass="w-full md:w-[48%]"
              offsetClass="md:mt-16"
            />
          )}
        </div>
      )}
    </>
  ),

  // 7 -- WELMOON VILLAS PAISAJE: 11 photos, walk through the pod at daylight then closing night.
  // Slot map:
  //   0 fachada del pod (portrait solo, arrival) →
  //   1 gatos en el felpudo (landscape solo, welcome) →
  //   2 interior cama + baño (landscape bleed) →
  //   3+4 baño detalle + amenities Welmoon (portrait pair, room details) →
  //   5 vista al bosque desde la cama (landscape solo) →
  //   6 techo de cristal hacia el bosque (landscape bleed) →
  //   7 desayuno en la mesa (portrait solo) →
  //   8+9 telescopio + cama exterior con pareja (square pair, terrace) →
  //   10 jacuzzi al calor de las velas de noche (portrait solo, closing).
  ({ photos, y }) => (
    <>
      {photos[0] && (
        <div className="w-full flex justify-center">
          <GalleryPhoto photo={photos[0]} y={y[0]} aspectClass="aspect-[3/4]" widthClass="w-full md:w-[48%]" />
        </div>
      )}
      {photos[1] && (
        <div className="w-full flex justify-center">
          <GalleryPhoto photo={photos[1]} y={y[1]} aspectClass="aspect-[3/2]" widthClass="w-full md:w-[68%]" />
        </div>
      )}
      {photos[2] && (
        <Bleed>
          <GalleryPhoto photo={photos[2]} y={y[2]} aspectClass="aspect-[3/2]" widthClass="w-full" bleed />
        </Bleed>
      )}
      {(photos[3] || photos[4]) && (
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
          {photos[3] && (
            <GalleryPhoto photo={photos[3]} y={y[3]} aspectClass="aspect-[3/4]" widthClass="w-full md:w-[48%]" />
          )}
          {photos[4] && (
            <GalleryPhoto
              photo={photos[4]}
              y={y[4]}
              aspectClass="aspect-[3/4]"
              widthClass="w-full md:w-[48%]"
              offsetClass="md:mt-16"
            />
          )}
        </div>
      )}
      {photos[5] && (
        <div className="w-full flex justify-center">
          <GalleryPhoto photo={photos[5]} y={y[5]} aspectClass="aspect-[3/2]" widthClass="w-full md:w-[74%]" />
        </div>
      )}
      {photos[6] && (
        <Bleed>
          <GalleryPhoto photo={photos[6]} y={y[6]} aspectClass="aspect-[3/2]" widthClass="w-full" bleed />
        </Bleed>
      )}
      {photos[7] && (
        <div className="w-full flex justify-center">
          <GalleryPhoto photo={photos[7]} y={y[7]} aspectClass="aspect-[3/4]" widthClass="w-full md:w-[46%]" />
        </div>
      )}
      {(photos[8] || photos[9]) && (
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
          {photos[8] && (
            <GalleryPhoto photo={photos[8]} y={y[8]} aspectClass="aspect-square" widthClass="w-full md:w-[48%]" />
          )}
          {photos[9] && (
            <GalleryPhoto
              photo={photos[9]}
              y={y[9]}
              aspectClass="aspect-square"
              widthClass="w-full md:w-[48%]"
              offsetClass="md:mt-12"
            />
          )}
        </div>
      )}
      {photos[10] && (
        <div className="w-full flex justify-center">
          <GalleryPhoto photo={photos[10]} y={y[10]} aspectClass="aspect-[3/4]" widthClass="w-full md:w-[52%]" />
        </div>
      )}
    </>
  ),

  // 8 -- DISTRICT HIVE: 9 photos, badlands walk with landscape openers.
  // Slot map:
  //   0 panorámica badlands (landscape bleed) →
  //   1 badlands aéreo vertical (portrait solo) →
  //   2+3 hombre caminando + mujer al atardecer (portrait pair, human moments) →
  //   4 aérea del cañón (landscape bleed) →
  //   5+6 logo + ducha exterior (portrait pair, details) →
  //   7+8 cápsula + piscina + jacuzzi (landscape pair, closing).
  ({ photos, y }) => (
    <>
      {photos[0] && (
        <Bleed>
          <GalleryPhoto photo={photos[0]} y={y[0]} aspectClass="aspect-[3/2]" widthClass="w-full" bleed />
        </Bleed>
      )}
      {photos[1] && (
        <div className="w-full flex justify-center">
          <GalleryPhoto photo={photos[1]} y={y[1]} aspectClass="aspect-[3/4]" widthClass="w-full md:w-[46%]" />
        </div>
      )}
      {(photos[2] || photos[3]) && (
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
          {photos[2] && (
            <GalleryPhoto photo={photos[2]} y={y[2]} aspectClass="aspect-[3/4]" widthClass="w-full md:w-[48%]" />
          )}
          {photos[3] && (
            <GalleryPhoto
              photo={photos[3]}
              y={y[3]}
              aspectClass="aspect-[3/4]"
              widthClass="w-full md:w-[48%]"
              offsetClass="md:mt-16"
            />
          )}
        </div>
      )}
      {photos[4] && (
        <Bleed>
          <GalleryPhoto photo={photos[4]} y={y[4]} aspectClass="aspect-[3/2]" widthClass="w-full" bleed />
        </Bleed>
      )}
      {(photos[5] || photos[6]) && (
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
          {photos[5] && (
            <GalleryPhoto
              photo={photos[5]}
              y={y[5]}
              aspectClass="aspect-[3/4]"
              widthClass="w-full md:w-[48%]"
              offsetClass="md:mt-16"
            />
          )}
          {photos[6] && (
            <GalleryPhoto photo={photos[6]} y={y[6]} aspectClass="aspect-[3/4]" widthClass="w-full md:w-[48%]" />
          )}
        </div>
      )}
      {(photos[7] || photos[8]) && (
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
          {photos[7] && (
            <GalleryPhoto photo={photos[7]} y={y[7]} aspectClass="aspect-[4/3]" widthClass="w-full md:w-[48%]" />
          )}
          {photos[8] && (
            <GalleryPhoto
              photo={photos[8]}
              y={y[8]}
              aspectClass="aspect-[4/3]"
              widthClass="w-full md:w-[48%]"
              offsetClass="md:mt-14"
            />
          )}
        </div>
      )}
    </>
  ),
];

export const HotelDetail: React.FC<HotelDetailProps> = ({
  story,
  onBack,
  onNavigateStory,
  prevStory,
  nextStory,
}) => {
  const [creditsOpen, setCreditsOpen] = useState(false);
  const caseStudy = CASE_STUDIES.find((c) => c.hotelId === story.id);
  const [heroLoaded, setHeroLoaded] = useState(false);

  // STRICT CONSTRAINT: Maximum 14 photos in the gallery
  const photos = (story.galleryPhotos ?? story.photos ?? []).slice(0, 14);

  const galleryRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: galleryRef,
    offset: ['start end', 'end start'],
  });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 70, damping: 22 });

  // Same parallax mechanism as the home page hotel sections, extended to 14 photos
  const y0 = useTransform(smoothProgress, [0, 1], ['60px', '-60px']);
  const y1 = useTransform(smoothProgress, [0, 1], ['110px', '-110px']);
  const y2 = useTransform(smoothProgress, [0, 1], ['40px', '-40px']);
  const y3 = useTransform(smoothProgress, [0, 1], ['70px', '-70px']);
  const y4 = useTransform(smoothProgress, [0, 1], ['100px', '-100px']);
  const y5 = useTransform(smoothProgress, [0, 1], ['50px', '-50px']);
  const y6 = useTransform(smoothProgress, [0, 1], ['80px', '-80px']);
  const y7 = useTransform(smoothProgress, [0, 1], ['90px', '-90px']);
  const y8 = useTransform(smoothProgress, [0, 1], ['65px', '-65px']);
  const y9 = useTransform(smoothProgress, [0, 1], ['55px', '-55px']);
  const y10 = useTransform(smoothProgress, [0, 1], ['75px', '-75px']);
  const y11 = useTransform(smoothProgress, [0, 1], ['95px', '-95px']);
  const y12 = useTransform(smoothProgress, [0, 1], ['45px', '-45px']);
  const y13 = useTransform(smoothProgress, [0, 1], ['85px', '-85px']);
  const yTransforms = [y0, y1, y2, y3, y4, y5, y6, y7, y8, y9, y10, y11, y12, y13];

  const venueMapUrl = `https://www.google.com/maps/search/${encodeURIComponent(
    `${story.hotelName} ${story.location} ${story.country}`
  )}`;

  return (
    <div className="bg-[#f5f3ed] text-[#1a1918] font-sans">
      {/* HERO — full-screen horizontal cover photo */}
      <section className="relative h-[100dvh] w-full overflow-hidden bg-stone-200">
        <img
          src={story.coverImage}
          alt={story.hotelName}
          onLoad={() => setHeroLoaded(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* El titular vive centrado, y el degradado anterior era transparente
            justo ahi: sobre una portada clara (sec1) se perdia. Este recorre la
            imagen entera y nunca llega a transparente, asi que no hay ningun
            canto que delate una capa encima — se lee como exposicion, no como
            velo. Medido sobre sec1-portada.jpg: el p95 del fondo bajo el
            titular sube de 1,37:1 a 2,60:1, y la sombra del titular hace el
            resto. Se probo .36, que llega a 3:1, pero ahi la foto ya se ve
            apagada y el degradado deja de ser invisible. */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(26,25,24,.32) 0%, rgba(26,25,24,.30) 45%, rgba(26,25,24,.40) 78%, rgba(26,25,24,.56) 100%)',
          }}
        />

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={heroLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.9, ease: 'easeOut', delay: 0.2 }}
          className="absolute inset-0 flex items-center justify-center px-6 text-center pointer-events-none"
        >
          <span
            className="font-serif text-white leading-[0.95] tracking-tight text-[13vw] sm:text-7xl md:text-8xl lg:text-[7.5rem]"
            style={{ textShadow: '0 1px 3px rgba(0,0,0,0.28), 0 2px 34px rgba(0,0,0,0.5)' }}
          >
            {toTitleCase(story.hotelName)}
          </span>
        </motion.h1>

        <button
          onClick={onBack}
          className="absolute top-24 sm:top-28 left-6 md:left-12 z-10 flex items-center gap-2 text-xs md:text-sm font-sans tracking-[0.15em] uppercase text-white/90 hover:text-white transition-colors"
        >
          <span aria-hidden="true">&larr;</span>
          <span>Volver</span>
        </button>

        {/* Los datos del rodaje, en una sola línea al pie de la portada: se leen
            de un vistazo y no interrumpen a quien sólo viene a mirar fotos. */}
        {story.caseStudy && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={heroLoaded ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut', delay: 0.5 }}
            className="pointer-events-none absolute inset-x-0 bottom-0 px-6 pb-6 sm:px-10 sm:pb-8 md:px-16"
          >
            <div className="flex flex-wrap items-baseline justify-center gap-x-6 gap-y-1 text-[10px] font-sans uppercase tracking-[0.2em] text-white/85 md:gap-x-12 md:text-[11px]">
              {story.caseStudy.season && <span>{story.caseStudy.season}</span>}
              {story.caseStudy.duration && <span>{story.caseStudy.duration}</span>}
              {story.caseStudy.usage && <span>{story.caseStudy.usage}</span>}
            </div>
          </motion.div>
        )}
      </section>

      {/* TEXT BLOCK — description + Venue / Location / Credits, its own section between hero and gallery */}
      <section className="px-6 md:px-12 pt-28 md:pt-36 pb-24 md:pb-32 max-w-4xl mx-auto text-center">
        <p className="font-serif text-2xl sm:text-3xl md:text-[2.1rem] leading-[1.5] md:leading-[1.55] text-[#1a1918]">
          {story.description}
        </p>

        <div className="grid grid-cols-3 gap-3 md:gap-6 mt-16 md:mt-20">
          <div>
            <span className="block text-[12px] sm:text-xs md:text-sm text-[#5a5854] mb-2">Propiedad</span>
            <a
              href={venueMapUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-block text-xs sm:text-sm md:text-base font-sans text-[#1a1918] underline underline-offset-4 decoration-[#1a1918]/40 hover:decoration-[#1a1918] transition-colors"
            >
              {story.hotelName}
            </a>
          </div>
          <div>
            <span className="block text-[12px] sm:text-xs md:text-sm text-[#5a5854] mb-2">Ubicación</span>
            <span className="text-xs sm:text-sm md:text-base font-sans text-[#1a1918]">
              {story.location}
            </span>
          </div>
          <div>
            <span className="block text-[12px] sm:text-xs md:text-sm text-[#5a5854] mb-2">Créditos</span>
            <button
              onClick={() => setCreditsOpen((v) => !v)}
              aria-expanded={creditsOpen}
              aria-label={creditsOpen ? 'Cerrar créditos' : 'Ver créditos'}
              className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-[#1a1918] text-[#f5f3ed] flex items-center justify-center mx-auto hover:opacity-80 transition-opacity"
            >
              <motion.span
                animate={{ rotate: creditsOpen ? 45 : 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="text-lg leading-none"
              >
                +
              </motion.span>
            </button>
          </div>
        </div>

        <AnimatePresence>
          {creditsOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="pt-6 space-y-1.5 text-xs sm:text-sm text-[#5a5854] font-sans">
                <div>Fotografía y dirección creativa · Mayurlin Viera</div>
                <div>Producción audiovisual · Yerfran</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cuando el hotel tiene caso documentado, esta galería es la puerta
            de entrada: el caso existía pero no se enlazaba desde ningún
            sitio, así que solo llegaba quien supiera la URL de memoria. */}
        {caseStudy && (
          <div className="mt-14 md:mt-16">
            <Link
              to={`/proyecto/${caseStudy.slug}`}
              className="inline-block bg-[#1a1918] px-8 py-4 text-[12px] font-sans uppercase tracking-[0.22em] font-medium text-[#f5f3ed] transition-colors hover:bg-[#5a5854] md:px-10 md:py-[1.15rem] md:text-xs"
            >
              Ver el proyecto completo
            </Link>
          </div>
        )}
      </section>

      {/* GALLERY — max 10 photos, masonry mix with shared parallax movement */}
      <section
        ref={galleryRef}
        className="px-4 md:px-10 lg:px-16 pb-16 md:pb-24 max-w-[1600px] mx-auto flex flex-col gap-6 md:gap-10"
      >
        {(() => {
          const Layout = GALLERY_LAYOUTS[(story.layoutVariant ?? 0) % GALLERY_LAYOUTS.length];
          return <Layout photos={photos} y={yTransforms} video={story.galleryVideo} />;
        })()}
      </section>

      {/* Navigation between hotel portfolios — no re-load, no intro re-play */}
      {onNavigateStory && (prevStory || nextStory) && (
        <nav
          aria-label="Navegación entre hoteles"
          className="max-w-[1600px] mx-auto px-6 md:px-10 lg:px-16 pb-20 md:pb-28 border-t border-[#1a1918]/10 pt-10 md:pt-14"
        >
          <div className="flex items-stretch justify-between gap-4 md:gap-10">
            {prevStory ? (
              <button
                onClick={() => onNavigateStory('prev')}
                className="group flex flex-col items-start text-left flex-1 max-w-[46%] hover:opacity-70 transition-opacity"
              >
                <span className="text-[11px] md:text-xs font-sans tracking-[0.25em] uppercase text-[#5a5854] flex items-center gap-2">
                  <span aria-hidden="true" className="transition-transform group-hover:-translate-x-1">
                    &larr;
                  </span>
                  Anterior
                </span>
                <span className="mt-2 md:mt-3 font-serif text-sm md:text-lg tracking-wide text-[#1a1918]">
                  {prevStory.hotelName}
                </span>
              </button>
            ) : (
              <span className="flex-1" />
            )}

            {nextStory ? (
              <button
                onClick={() => onNavigateStory('next')}
                className="group flex flex-col items-end text-right flex-1 max-w-[46%] hover:opacity-70 transition-opacity"
              >
                <span className="text-[11px] md:text-xs font-sans tracking-[0.25em] uppercase text-[#5a5854] flex items-center gap-2">
                  Siguiente
                  <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                    &rarr;
                  </span>
                </span>
                <span className="mt-2 md:mt-3 font-serif text-sm md:text-lg tracking-wide text-[#1a1918]">
                  {nextStory.hotelName}
                </span>
              </button>
            ) : (
              <span className="flex-1" />
            )}
          </div>
        </nav>
      )}
    </div>
  );
};
