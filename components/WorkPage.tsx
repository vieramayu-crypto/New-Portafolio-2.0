import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { HOTEL_STORIES } from '../data/hotels';
import { useSiteContent } from '../src/lib/content';

/** "Trabajo": misma tarjeta de cristal que el formulario de Contacto (mismo
 *  borde, mismo fondo, misma X para cerrar), no una foto a pantalla completa
 *  -- probamos esa vía y no funcionó. La foto ocupa solo la franja superior
 *  de la tarjeta; el resto es el panel de cristal con el nombre del hotel y
 *  el selector. Las miniaturas van superpuestas y comprimidas (no en fila
 *  suelta): solo la activa, o la que se pasa por encima, se agranda -- nueve
 *  fotos horizontales una al lado de la otra rompían la elegancia. */
export const WorkPage: React.FC = () => {
  const { hotels: hotelContent } = useSiteContent();
  const [active, setActive] = useState(0);

  const stories = useMemo(
    () =>
      HOTEL_STORIES.map((story, i) => ({
        ...story,
        hotelName: hotelContent[i]?.hotelName ?? story.hotelName,
      })),
    [hotelContent]
  );

  const current = stories[active];

  return (
    <div className="relative flex min-h-[100svh] w-full items-center justify-center bg-[#f5f3ed] px-3 py-24 md:px-10 md:py-16">
      <div className="mt-glass mt-glass-light relative flex max-h-full w-full flex-col overflow-hidden rounded-lg text-[#1a1918] md:max-h-[min(760px,calc(100svh-140px))] md:w-[min(880px,100%)] md:rounded-[10px]">
        {/* Un solo hijo directo de `.mt-glass`: esa clase fuerza `position:
            relative` en sus hijos directos (para que ganen al destello), y
            eso le habría roto el `absolute` a la X si viviera aquí mismo. */}
        <div className="no-scrollbar relative flex min-h-0 flex-1 flex-col overflow-y-auto">
          <Link
            to="/"
            aria-label="Cerrar"
            className="absolute right-4 top-4 z-[3] flex h-10 w-10 items-center justify-center rounded-full border border-[#1a1918]/20 bg-white/20 text-xl text-[#1a1918] transition-colors hover:bg-white/40 md:right-6 md:top-6 md:h-[42px] md:w-[42px]"
          >
            ×
          </Link>

          {/* Foto del hotel activo: solo la franja superior de la tarjeta. */}
          <div className="relative h-[30vh] max-h-[300px] w-full shrink-0 overflow-hidden">
            <img
              key={current.id}
              src={current.coverImage}
              alt={current.hotelName}
              className="h-full w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-[#faf8f2] to-transparent" />
          </div>

          <div className="px-6 pb-8 pt-6 text-center md:px-12 md:pb-10 md:pt-7">
            <h2 key={current.id + '-name'} className="font-serif text-2xl md:text-3xl">
              {current.hotelName}
            </h2>
            <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-[#5a5854] md:text-xs">
              {current.leftTag ? `${current.leftTag} · ` : ''}
              {current.location}, {current.country}
            </p>

            {/* Selector superpuesto: cada miniatura se monta sobre la anterior;
                la activa y la que se pasa por encima se agrandan y suben de
                plano. */}
            <div className="mt-7 flex items-center justify-center md:mt-9">
              {stories.map((story, i) => (
                <button
                  key={story.id}
                  onClick={() => setActive(i)}
                  aria-label={`Ver ${story.hotelName}`}
                  style={{ marginLeft: i === 0 ? 0 : -18, zIndex: i === active ? 20 : i }}
                  className={`group relative shrink-0 overflow-hidden rounded-[3px] border-2 border-[#faf8f2] shadow-[0_2px_10px_rgba(26,25,24,0.18)] transition-all duration-300 ease-out hover:z-30 hover:scale-125 ${
                    i === active ? 'w-14 scale-110 md:w-16' : 'w-11 scale-100 md:w-12'
                  }`}
                >
                  <span className="block aspect-video w-full">
                    <img src={story.coverImage} alt="" className="h-full w-full object-cover" />
                  </span>
                </button>
              ))}
            </div>

            <Link
              to={`/trabajo/${current.id}`}
              className="mt-8 inline-block bg-[#1a1918] px-8 py-4 text-[11px] font-sans uppercase tracking-[0.22em] font-medium text-[#f5f3ed] transition-colors hover:bg-[#5a5854] md:px-10 md:py-[1.15rem] md:text-xs"
            >
              Ver portafolio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
