import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { HOTEL_STORIES } from '../data/hotels';
import { useSiteContent } from '../src/lib/content';

/** Primera frase de la descripción larga del hotel (pensada para la ficha
 *  completa), para el texto corto que acompaña la foto activa aquí. */
function firstSentence(text: string): string {
  const cut = text.indexOf('. ');
  return cut === -1 ? text : text.slice(0, cut + 1);
}

/** "Trabajo": vitrina inmersiva de las nueve propiedades, reemplaza el grid
 *  plano anterior (rechazado por no reflejar el resto del diseño). Una sola
 *  pantalla -- foto de fondo a pantalla completa por hotel, con crossfade al
 *  cambiar -- y abajo una fila de miniaturas horizontales (la misma portada
 *  de cada ficha, sin recortar a círculo) para elegir cuál mirar. Solo al
 *  confirmar con "Ver portafolio" navega de verdad a /trabajo/:id -- mientras
 *  tanto es puro vistazo, sin cambiar de URL. */
export const WorkPage: React.FC = () => {
  const { hotels: hotelContent } = useSiteContent();
  const [active, setActive] = useState(0);

  const stories = useMemo(
    () =>
      HOTEL_STORIES.map((story, i) => ({
        ...story,
        hotelName: hotelContent[i]?.hotelName ?? story.hotelName,
        description: hotelContent[i]?.description ?? story.description,
      })),
    [hotelContent]
  );

  const current = stories[active];

  return (
    <section className="relative h-[100svh] w-full select-none overflow-hidden bg-[#1a1918] font-sans text-white">
      {/* Fondos apilados, uno por hotel: solo el activo tiene opacidad, el
          resto queda listo debajo para el siguiente crossfade. */}
      {stories.map((story, i) => (
        <div
          key={story.id}
          aria-hidden={i !== active}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ease-out ${
            i === active ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ backgroundImage: `url(${story.coverImage})` }}
        />
      ))}

      {/* Velo suave: sostiene el texto sin apagar la foto. */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/35 via-black/10 to-black/45" />

      <div className="relative z-10 flex h-full flex-col justify-between px-6 pb-6 pt-28 sm:px-10 sm:pb-8 sm:pt-32 lg:px-16 lg:pt-36">
        {/* Encabezado: titular fijo a la izquierda, descripción del hotel activo
            a la derecha (cambia con la selección). */}
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between md:gap-16">
          <h1 className="max-w-xl font-serif text-3xl font-normal leading-[1.1] tracking-tight sm:text-5xl lg:text-7xl">
            El trabajo completo, hotel por hotel.
          </h1>
          <p
            key={current.id + '-desc'}
            className="max-w-xs animate-[fadeIn_0.5s_ease] font-sans text-sm font-medium leading-relaxed text-white/80 sm:text-base md:pt-2"
          >
            {firstSentence(current.description)}
          </p>
        </div>

        {/* Pie: selector de miniaturas + ficha del hotel activo. */}
        <div className="flex flex-col gap-6 sm:gap-8">
          <div className="no-scrollbar flex items-end gap-2 overflow-x-auto pb-1 sm:gap-3 sm:overflow-visible sm:pb-0">
            {stories.map((story, i) => (
              <button
                key={story.id}
                onClick={() => setActive(i)}
                aria-label={`Ver ${story.hotelName}`}
                className="flex shrink-0 flex-col items-center gap-2"
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_5px_rgba(0,0,0,0.7)] transition-opacity duration-300 ${
                    i === active ? 'opacity-100' : 'opacity-0'
                  }`}
                />
                <span className="block aspect-video w-16 overflow-hidden sm:w-24 lg:w-28">
                  <img src={story.coverImage} alt={story.hotelName} className="h-full w-full object-cover" />
                </span>
              </button>
            ))}
          </div>

          <div className="flex flex-col items-center gap-3 border-t border-white/20 pt-5 text-center">
            <h2 key={current.id + '-name'} className="animate-[fadeIn_0.5s_ease] font-serif text-xl sm:text-2xl">
              {current.hotelName}
            </h2>
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/70 sm:text-xs">
              {current.leftTag ? `${current.leftTag} · ` : ''}
              {current.location}, {current.country}
            </p>
            <Link
              to={`/trabajo/${current.id}`}
              className="mt-2 border border-white px-8 py-4 text-[11px] font-sans uppercase tracking-[0.22em] font-medium text-white transition-colors hover:bg-white hover:text-[#1a1918] md:px-10 md:py-[1.15rem] md:text-xs"
            >
              Ver portafolio
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
