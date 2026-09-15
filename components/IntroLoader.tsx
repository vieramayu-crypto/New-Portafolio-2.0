import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import introHorizontalMp4 from '../src/assets/videos/intro-horizontal.mp4';
import introHorizontalWebm from '../src/assets/videos/intro-horizontal.webm';
import introVerticalMp4 from '../src/assets/videos/intro-vertical.mp4';
import introVerticalWebm from '../src/assets/videos/intro-vertical.webm';

const FAILSAFE_MS = 6000;

/** Marca de "ya lo vio" dentro de la misma visita. Se borra al cerrar la
 *  pestaña, así que quien vuelve otro día lo vuelve a ver entero: el efecto se
 *  conserva para quien descubre la web, y deja de castigar a quien recarga o
 *  navega y vuelve. Medido antes del cambio: 4,3 s hasta poder usar la web en
 *  local, y 1,9 MB de vídeo descargados en cada carga. */
const VISTA_EN_ESTA_SESION = 'mt-intro-visto';

function yaVistoEnEstaSesion(): boolean {
  try {
    return sessionStorage.getItem(VISTA_EN_ESTA_SESION) === '1';
  } catch {
    return false; // navegación privada o almacenamiento bloqueado: se reproduce
  }
}

function isMobileViewport(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches;
}

interface IntroLoaderProps {
  onDone?: () => void;
}

export const IntroLoader: React.FC<IntroLoaderProps> = ({ onDone }) => {
  const [phase, setPhase] = useState<'playing' | 'fading' | 'done'>(() =>
    yaVistoEnEstaSesion() ? 'done' : 'playing'
  );
  const [isVertical] = useState(isMobileViewport);
  // Cache-busting so every mount forces a fresh network fetch instead of
  // relying on the browser's disk cache, which can corrupt playback of
  // large range-requested video on repeat loads.
  const [cacheBust] = useState(() => Date.now());
  const videoRef = useRef<HTMLVideoElement>(null);
  const triedFallbackRef = useRef(false);

  const mp4Src = isVertical ? introVerticalMp4 : introHorizontalMp4;
  const webmSrc = isVertical ? introVerticalWebm : introHorizontalWebm;

  const finish = () => {
    try {
      sessionStorage.setItem(VISTA_EN_ESTA_SESION, '1');
    } catch {
      /* si no se puede guardar, el vídeo simplemente se repetirá */
    }
    setPhase((current) => (current === 'playing' ? 'fading' : current));
  };

  useEffect(() => {
    if (phase === 'done') {
      onDone?.();
      return;
    }
    // Never let a stalled or undelivered video block the site indefinitely.
    const failsafe = window.setTimeout(finish, FAILSAFE_MS);
    return () => window.clearTimeout(failsafe);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (phase !== 'fading') return;
    const timeout = window.setTimeout(() => {
      setPhase('done');
      onDone?.();
    }, 500);
    return () => window.clearTimeout(timeout);
  }, [phase, onDone]);

  useLayoutEffect(() => {
    // Safari can miss the `muted` prop's timing and treat the video as
    // unmuted when it evaluates autoplay eligibility, silently blocking
    // autoplay and showing a native play button instead. Setting it
    // imperatively and kicking off playback explicitly avoids that.
    //
    // The source is also set imperatively here (instead of <source> children)
    // because a decode failure partway through an already-started fetch is
    // reported by some browsers as an error on the <video> element itself,
    // without automatically falling back to a sibling <source> -- automatic
    // fallback only applies during the initial resource-selection step.
    // Setting src directly lets handleError below retry with the webm copy.
    if (phase === 'done') return;
    const video = videoRef.current;
    if (!video) return;
    triedFallbackRef.current = false;
    video.muted = true;
    video.defaultMuted = true;
    video.src = `${mp4Src}?v=${cacheBust}`;
    video.play().catch(() => {
      // Still blocked (e.g. Low Power Mode) -- the failsafe timeout above
      // moves past the intro regardless.
    });
  }, [isVertical, cacheBust, mp4Src, phase]);

  const handleError = () => {
    const video = videoRef.current;
    if (video && !triedFallbackRef.current) {
      triedFallbackRef.current = true;
      video.src = `${webmSrc}?v=${cacheBust}`;
      video.play().catch(finish);
      return;
    }
    finish();
  };

  if (phase === 'done') return null;

  return (
    <div
      // Pulsar en cualquier sitio lo salta. No lleva botón visible: el rótulo
      // encima del vídeo rompería la entrada, y quien tiene prisa toca la
      // pantalla por instinto antes de buscar una cruz.
      role="button"
      tabIndex={0}
      aria-label="Saltar la introducción"
      onClick={finish}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') finish();
      }}
      className={`fixed inset-0 z-[100] cursor-pointer bg-[#f5f3ed] transition-opacity duration-500 ${
        phase === 'fading' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        onEnded={finish}
        onError={handleError}
        className="h-full w-full object-cover"
      />
    </div>
  );
};
