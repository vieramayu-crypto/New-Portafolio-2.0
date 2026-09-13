import React, { useRef, useState } from 'react';
import { useSiteContent } from '../src/lib/content';

const ELEGANT = 'font-serif italic tracking-wide text-2xl md:text-3xl';
const SANS_BOLD_UPPER = 'font-sans font-bold uppercase tracking-wide text-xl md:text-2xl';
const SANS_MEDIUM_UPPER = 'font-sans font-medium uppercase tracking-[0.1em] text-lg md:text-xl';
const SERIF_WIDE = 'font-serif tracking-[0.15em] text-2xl md:text-3xl';
const SERIF_SEMI = 'font-serif font-semibold tracking-wide text-2xl md:text-3xl';

const BRANDS: { name: string; sub?: string; className: string }[] = [
  { name: 'The Ritz-Carlton', className: SERIF_WIDE },
  { name: 'InterContinental', sub: 'LISBOA', className: SERIF_SEMI },
  { name: 'Holiday Inn Express', className: SANS_MEDIUM_UPPER },
  { name: 'numa', className: 'font-sans font-bold lowercase text-2xl md:text-3xl' },
  { name: 'Dolce', sub: 'BARCELONA RESORT', className: SERIF_WIDE },
  { name: 'Hotel Gold River', sub: 'PORTAVENTURA WORLD', className: SERIF_SEMI },
  { name: 'Vestige Collection', className: ELEGANT },
  { name: 'GPRO Valparaíso Palace & Spa', className: ELEGANT },
  { name: 'Honeymoon Petra Villas', sub: 'SANTORINI', className: SANS_MEDIUM_UPPER },
  { name: 'Terra Dominicata', className: 'font-serif italic text-2xl md:text-3xl' },
  { name: 'Deltapark Vitalresort', className: ELEGANT },
  { name: 'District Hive', className: SANS_BOLD_UPPER },
  { name: 'Villa Venecia', className: ELEGANT },
  { name: 'Portixol', sub: 'MALLORCA', className: SERIF_WIDE },
  { name: 'Carema Hotels', sub: 'MENORCA', className: SANS_MEDIUM_UPPER },
  { name: 'Lago Resort', sub: 'MENORCA', className: SERIF_SEMI },
  { name: 'Bluesea Hotels', className: SANS_BOLD_UPPER },
  { name: 'Welmoon Villas', className: ELEGANT },
  { name: 'Hotel Espléndido', sub: 'SÓLLER', className: SERIF_WIDE },
  { name: 'Casa Marquina', className: 'font-serif italic text-2xl md:text-3xl' },
  { name: 'Costa Mágica', sub: 'TENERIFE', className: ELEGANT },
  { name: 'COEO', sub: 'STAY & SHARE', className: SANS_BOLD_UPPER },
];

const BrandLogo: React.FC<{ brand: (typeof BRANDS)[number] }> = ({ brand }) => (
  <div className="flex flex-col items-center justify-center px-10 md:px-14 shrink-0 text-[#1a1918]/70">
    <span className={brand.className}>{brand.name}</span>
    {brand.sub && (
      <span className="mt-1 text-[10px] font-sans uppercase tracking-[0.3em] text-[#5a5854]">{brand.sub}</span>
    )}
  </div>
);

export const BrandsMarquee: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ startX: 0, startScrollLeft: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const { milestones } = useSiteContent();

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    if (!el) return;
    setIsDragging(true);
    drag.current = { startX: e.clientX, startScrollLeft: el.scrollLeft };
    el.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    if (!el || !isDragging) return;
    el.scrollLeft = drag.current.startScrollLeft - (e.clientX - drag.current.startX);
  };

  const stopDragging = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    scrollRef.current?.releasePointerCapture(e.pointerId);
  };

  return (
    <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen bg-white py-8 md:py-10 overflow-hidden">
      {/* El carrusel era el unico bloque de Inicio que entraba en seco. Y sin
          rotulo, los 22 nombres se leen como una lista suelta: nadie ata que
          Ritz-Carlton es Marriott, que InterContinental y Holiday Inn Express
          son los dos IHG, y que Dolce es Wyndham. Esta cabecera nombra los
          grupos y rescata la linea de clientes recurrentes, que llevaba
          escrita en el contenido sin pintarse en ninguna parte.
          "Properties within" y no "clients": son propiedades dentro de esos
          grupos, no contratos con la corporacion. */}
      {/* `text-balance` reparte las lineas en vez de llenar cada una hasta el
          borde: sin el, la medida justa partia "IHG Hotels & / Resorts" y
          "Numa Group (3 / properties)" por la mitad del nombre. */}
      {/* El contenedor es 4xl por la linea de recurrentes, que necesita ~780px
          para caber en una sola: la frase de grupos se queda estrecha con su
          propio ancho y sigue centrada. */}
      <div className="mx-auto mb-11 max-w-4xl px-6 text-center md:mb-16 md:px-12">
        <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-[#5a5854] md:text-xs">
          {milestones.eyebrow}
        </span>
        <p className="mx-auto mt-5 max-w-[46ch] text-balance font-serif text-[17px] font-light leading-[1.5] text-[#1a1918] md:mt-6 md:max-w-[62ch] md:text-[21px] md:leading-[1.45]">
          {milestones.affiliations}
        </p>
        <p className="mx-auto mt-4 max-w-[52ch] text-balance font-sans text-[11px] leading-relaxed text-[#5a5854] md:mt-5 md:max-w-none md:text-xs">
          {milestones.footnote}
        </p>
      </div>

      <div
        ref={scrollRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={stopDragging}
        onPointerLeave={stopDragging}
        className={`no-scrollbar select-none overflow-x-auto ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-x' }}
      >
        <div className="animate-marquee-slow whitespace-nowrap">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex items-center">
              {BRANDS.map((brand) => (
                <BrandLogo key={`${copy}-${brand.name}`} brand={brand} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
