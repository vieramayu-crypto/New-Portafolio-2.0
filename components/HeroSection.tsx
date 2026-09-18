import React from 'react';
import { motion } from 'motion/react';
import { HERO_PHOTO, HERO_PHOTO_MOBILE } from '../data/media';
import { useSiteContent } from '../src/lib/content';

interface HeroSectionProps {
  /** El hero se monta debajo del video de intro. Si la entrada arrancara al
   *  montar, se reproduciria entera tapada por el video y al descubrirse ya
   *  estaria puesta — que es justo lo que pasaba. */
  introDone: boolean;
  /** El CTA de la banda de cristal abre el formulario de solicitud en vez de
   *  solo hacer scroll: la Home necesita un gesto comercial, no solo uno de
   *  navegación (pedido explícito del rediseño). */
  onOpenAvailability: () => void;
}

/** Entrada compartida del bloque editorial, con los mismos valores que el
 *  titular de Acerca de y el de Contacto: sube, se aclara y se queda. */
const rise = (delay: number) => ({
  initial: { opacity: 0, y: 24, filter: 'blur(10px)' },
  transition: { duration: 0.9, ease: 'easeOut' as const, delay },
});

const SETTLED = { opacity: 1, y: 0, filter: 'blur(0px)' } as const;

/** Hero D — Editorial Index refinado.
 *
 *  ESCRITORIO (md y arriba) no ha cambiado: titular a media altura sobre el
 *  margen izquierdo y toda la trayectoria recogida en una banda de cristal
 *  estrecha al pie, flotando sobre la foto.
 *
 *  MÓVIL es otra composición, la que aprobó Mayurlin sobre una referencia
 *  visual. Tres cosas la definen:
 *
 *  1. LA SECCIÓN YA NO MIDE UNA PANTALLA EXACTA. Antes era `h-[100svh]` y
 *     todo se colgaba por dentro con porcentajes y anclajes al borde
 *     inferior. Ahora el área de la foto tiene un alto mínimo y crece con lo
 *     que lleva dentro, así que no hay nada que recortar ni que solapar
 *     cuando el texto se agranda o la pantalla es estrecha.
 *  2. EL TEXTO VA EN FLUJO, en dos grupos: arriba el rótulo con el titular
 *     (que se leen como una sola unidad) y abajo el párrafo con el enlace.
 *     Los separa un `justify-between`, no coordenadas.
 *  3. LAS CIFRAS SALEN DE LA FOTO. En móvil dejan de ser una caja de cristal
 *     flotando encima y pasan a una franja marfil plana, debajo de la
 *     fotografía. Mismo dato, mismo marcado: sólo cambian las clases (ver
 *     `.mt-hero-cifras` en `index.css`, que apaga el cristal por debajo de
 *     768px).
 */
export const HeroSection: React.FC<HeroSectionProps> = ({ introDone, onOpenAvailability }) => {
  const { hero, milestones } = useSiteContent();
  const animate = introDone ? SETTLED : undefined;

  return (
    <section className="relative w-full select-none bg-[#1a1918] font-sans text-white md:h-[100svh] md:min-h-[680px] md:overflow-hidden">
      {/* ÁREA FOTOGRÁFICA.
          En móvil es una caja en flujo, con alto mínimo, que contiene la foto,
          los velos y el texto. En escritorio se convierte en una capa que
          cubre la sección entera (`md:absolute md:inset-0`), así que todo lo
          que hay dentro mantiene exactamente las coordenadas que tenía cuando
          colgaba de la sección. */}
      <div className="mt-hero-foto relative flex flex-col overflow-hidden md:absolute md:inset-0 md:block md:min-h-0">
        {/* Dos encuadres de la misma escena, uno por tamano. La horizontal en
            vertical obligaba al movil a usar un tercio de su ancho y estirarlo
            casi al doble, y la foto se veia blanda; la vertical llega ya
            recortada y el movil no amplia nada. `<picture>` no crea bloque
            contenedor, asi que el `absolute` del <img> sigue midiendo contra
            su caja. */}
        <picture>
          <source media="(min-width: 768px)" srcSet={HERO_PHOTO} />
          <img
            src={HERO_PHOTO_MOBILE}
            alt="Mayu Travel, visual production for luxury hotels"
            // El blanco y negro va SÓLO en la capa de la imagen, nunca en
            // el contenedor: ahí dentro vive el texto, y un filtro en la caja
            // se lo llevaría por delante.
            //
            // EL ENCUADRE NO SALE DE `object-cover`, SALE DE UNA CUENTA.
            // La referencia que aprobó Mayurlin es un recorte concreto del
            // archivo: x 25-1475 e y 160-2286 de sus 1800x2726 -- se buscó por
            // correlación contra su imagen, no a ojo. Con `object-cover` no se
            // puede pedir eso: el recorte lo decide él. Así que la imagen se
            // coloca a mano, y las cuentas son éstas, con W = ancho de la caja:
            //   ancho dibujado = 1800/1450 = 124,14% de W
            //   izquierda      = -25/1450  = -1,72% de W
            //   arriba         = -160/1450 de W, que sobre un alto de
            //                    2126/1450 de W son -7,53% del ALTO
            // `h-auto` mantiene la proporción del archivo y `max-w-none` evita
            // el `max-width:100%` que Tailwind pone a toda imagen.
            className="absolute left-[-1.72%] top-[-7.53%] h-auto w-[124.14%] max-w-none grayscale brightness-[1.24] contrast-[0.86] md:brightness-100 md:contrast-100 md:left-0 md:top-0 md:h-full md:w-full md:object-cover md:object-[56%_28%] md:grayscale-0 md:saturate-[.84]"
          />
        </picture>

        {/* VELOS. Tres capas que hacen trabajos distintos, y ninguna tapa la
            escena entera: Mayurlin comparó su referencia con lo que había y el
            problema era justo ése -- la foto salía apagada. Medido sobre las
            dos imágenes: su referencia tiene un brillo medio de 103 y la mía
            iba en 74, y en el tercio de la derecha, donde está ella, 129 contra
            83.

            1. Lateral izquierdo, flojo, para que el titular no flote sobre la
               piedra clara.
            2. Esquina inferior izquierda, que es donde de verdad cae el párrafo
               y el enlace. Va en diagonal a propósito: así protege el texto sin
               apagar la grava de la derecha, que en la referencia está clara.
            3. Un dedo de sombra en el borde de abajo, para asentar la franja de
               cifras.

            Antes era una sola capa que subía hasta el 64% al 70% de negro. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 md:hidden"
          style={{
            background:
              'linear-gradient(90deg, rgba(0,0,0,.44), rgba(0,0,0,.22) 26%, transparent 48%), linear-gradient(to top right, rgba(0,0,0,.30), transparent 42%), linear-gradient(0deg, rgba(0,0,0,.52), rgba(0,0,0,.42) 12%, rgba(0,0,0,.28) 26%, rgba(0,0,0,.16) 38%, transparent 52%)',
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 hidden md:block"
          style={{
            background:
              'linear-gradient(90deg, rgba(0,0,0,.30), transparent 62%), linear-gradient(0deg, rgba(0,0,0,.13), transparent 42%)',
          }}
        />

        {/* BLOQUE EDITORIAL.
            Móvil: columna en flujo con dos grupos separados por
            `justify-between`. Escritorio: exactamente donde estaba, a media
            altura sobre el margen izquierdo. */}
        <div
          className="relative z-[3] flex flex-1 flex-col justify-between gap-10 px-7 pb-[clamp(26px,4.5vh,44px)] pt-[calc(39.8vw_+_56px)]
                     md:absolute md:inset-y-auto md:left-[clamp(22px,3.4vw,54px)] md:right-auto md:top-1/2 md:block md:-translate-y-[52%] md:gap-0 md:p-0"
        >
          {/* GRUPO SUPERIOR: el rótulo y el titular se leen como una unidad.
              El hueco entre ellos era de 57 px medidos y dejaba el rótulo
              suelto arriba; ahora son 20. */}
          <div>
            <motion.p
              {...rise(0.1)}
              animate={animate}
              className="m-0 mb-5 text-[10px] uppercase tracking-[0.24em] text-white/[.78] [text-shadow:0_1px_10px_rgba(0,0,0,.55)] md:[text-shadow:none] md:mb-10 md:tracking-[0.28em] md:text-white/[.72]"
            >
              {hero.eyebrow}
            </motion.p>

            {/* El corte en cuatro líneas -- "Fotografía y / producción /
                audiovisual para / hoteles de lujo." -- sale del ancho máximo
                en `ch`, no de saltos escritos a mano: así aguanta otros anchos
                y otro idioma.

                EL CUERPO LO MANDA LA FIGURA, no una cifra redonda. El encargo
                pedía 34-40 px a 390, pero a ese tamaño el renglón más largo
                ("audiovisual para") llega a 234 px y el vestido empieza en
                225: el texto se le montaba encima, que era justo lo que había
                que evitar. A 31 px termina en 208 y queda libre por 17. Medido
                con el texto escondido, para no confundir el vestido con los
                propios glifos blancos. */}
            <motion.h1
              {...rise(0.18)}
              animate={animate}
              className="m-0 max-w-[13ch] font-serif text-[clamp(29px,8.3vw,35px)] font-normal leading-[1.12] tracking-[-0.03em] [text-shadow:0_2px_18px_rgba(0,0,0,.45)] md:[text-shadow:none] md:max-w-[16ch] md:text-[clamp(48px,5.4vw,86px)] md:leading-[1.05] md:tracking-[-0.045em]"
            >
              {hero.titleLead} <i>{hero.titleEmphasis}</i>
            </motion.h1>
          </div>

          {/* GRUPO INFERIOR: qué producimos y la salida. Vive sobre el
              degradado corto de abajo, fuera de la zona protagonista de la
              foto. */}
          <div>
            <motion.p
              {...rise(0.26)}
              animate={animate}
              className="m-0 max-w-[40ch] text-[15px] font-normal leading-[1.55] text-white [text-shadow:0_1px_14px_rgba(0,0,0,.5)] md:mt-10 md:max-w-[34ch] md:text-[16px] md:leading-snug md:text-white/80 md:[text-shadow:none]"
            >
              {hero.subline}
            </motion.p>

            {/* El CTA vivía solo dentro de la banda de cristal, y esa banda
                esconde su columna de acción por debajo de 768px: en móvil no
                había ninguna forma de contactar desde la primera pantalla.
                Aquí va el enlace para ese tamaño; en escritorio manda el de la
                banda.

                `py-3.5 -my-3.5` deja la zona táctil en 45 px -- el mínimo son
                44 -- sin mover el subrayado ni el sitio del enlace: el relleno
                se compensa con el margen negativo. Con `py-3` se quedaba en 41. */}
            <motion.div {...rise(0.34)} animate={animate} className="mt-7 md:hidden">
              <button
                onClick={onOpenAvailability}
                className="group relative inline-block -my-3.5 py-3.5 text-[11px] font-sans uppercase tracking-[0.2em] font-semibold text-white [text-shadow:0_1px_10px_rgba(0,0,0,.6)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/80"
              >
                {hero.ctaLabel}
                {/* Se dibuja sola de izquierda a derecha, despacio, y se
                    queda. Mismo tiempo y misma curva que la de la banda de
                    escritorio, para que sea el mismo gesto y no dos
                    parecidos. La sombra bajo la línea hace el mismo trabajo
                    que la del texto. */}
                <motion.span
                  aria-hidden
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1.5, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
                  style={{ transformOrigin: 'left' }}
                  className="absolute bottom-[9px] left-0 block h-px w-full bg-white/80 shadow-[0_1px_6px_rgba(0,0,0,.55)]"
                />
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* LAS CIFRAS.
          Móvil: franja marfil plana, en flujo, justo debajo de la foto.
          Escritorio: la misma banda de cristal de siempre, flotando sobre la
          fotografía y centrada con `mx-auto` -- no con `translate`, porque
          Framer Motion escribe su propio `transform` para animar y se llevaría
          por delante el centrado.

          `mt-hero-cifras` apaga el cristal por debajo de 768px: `.mt-glass`
          declara el desenfoque, el fondo y la sombra sin condición, así que no
          basta con no ponerla. */}
      <motion.div
        {...rise(0.42)}
        animate={animate}
        className="mt-glass mt-glass-halo mt-hero-cifras relative z-[3] w-full text-[#1a1918]
                   md:absolute md:inset-x-0 md:bottom-[clamp(22px,3vw,42px)] md:mx-auto md:h-[76px] md:w-[min(68vw,1120px)] md:min-w-[680px] md:overflow-hidden md:rounded-[10px] md:text-white"
      >
        {/* Las columnas son algo mas anchas que en el prototipo: la metrica
            aprobada ("4 clientes recurrentes") es mas larga que la que habia
            ("6 anos") y con el reparto original partia en dos lineas. */}
        <div className="grid grid-cols-3 items-start px-5 py-7 text-[9px] uppercase tracking-[0.14em] md:h-full md:grid-cols-[1.05fr_repeat(3,0.88fr)_0.9fr] md:items-center md:whitespace-nowrap md:px-6 md:py-0 md:tracking-[0.18em]">
          {/* El rotulo y el enlace solo caben en escritorio. */}
          <div className="hidden md:block">{hero.glassLabel}</div>

          {milestones.items.map((item, i) => (
            <div
              key={item.label}
              className={`md:border-l md:border-white/[.14] md:pl-5 ${
                i === 0 ? 'pl-0' : 'border-l border-[#1a1918]/15 pl-4'
              }`}
            >
              <b className="mb-1.5 block font-serif text-[30px] font-normal italic leading-none tracking-normal md:mb-0 md:mr-[7px] md:inline md:text-[22px] md:leading-normal">
                {item.value}
              </b>
              {/* Dos líneas caben a propósito: "CLIENTES RECURRENTES" no
                  cabe de una en pantallas estrechas, y encoger las tres
                  columnas para forzarlo sería peor. */}
              <span className="block min-h-[2.3em] leading-[1.3] md:inline md:min-h-0 md:leading-normal">
                {item.label}
              </span>
            </div>
          ))}

          <div className="hidden flex-col items-end gap-1 text-right md:flex">
            {/* La acción principal y la secundaria vivían con el mismo peso:
                dos líneas de texto seguidas, la de abajo un poco más apagada.
                No hacía falta otro botón fuera de la caja de cristal -- eso
                rompería el bloque entero -- sino un detalle que sólo tiene
                ésta: una línea finísima que se dibuja sola de izquierda a
                derecha, despacio, y se queda. Basta para que el ojo caiga
                aquí primero. */}
            <button
              onClick={onOpenAvailability}
              className="group relative uppercase tracking-[0.18em] text-white/90 transition-opacity hover:opacity-100"
            >
              {hero.ctaLabel}
              <motion.span
                aria-hidden
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.5, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformOrigin: 'left' }}
                className="absolute -bottom-[3px] left-0 block h-px w-full bg-white/70"
              />
            </button>
            {/* Ruta secundaria: nunca compite en peso con el CTA comercial,
                solo baja a Trabajo para quien todavia quiere ver el portafolio. */}
            <button
              onClick={() =>
                document.getElementById('hotel-section')?.scrollIntoView({ behavior: 'smooth' })
              }
              className="uppercase tracking-[0.18em] text-white/55 transition-opacity hover:text-white/85"
            >
              {hero.secondaryLabel}
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
