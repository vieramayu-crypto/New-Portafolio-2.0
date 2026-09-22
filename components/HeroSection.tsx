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
        {/* UN ENCUADRE POR PANTALLA, hecho por Mayurlin, no por el codigo.
            La horizontal puesta en vertical obligaba al movil a usar un tercio
            de su ancho y ampliarlo, y ahi se perdia la nitidez. Ahora llegan
            dos archivos ya encuadrados y aqui no se recorta nada.
            `<picture>` no crea bloque contenedor, asi que el `absolute` del
            <img> sigue midiendo contra su caja. */}
        <picture>
          <source media="(min-width: 768px)" srcSet={HERO_PHOTO} />
          <img
            src={HERO_PHOTO_MOBILE}
            alt="Mayu Travel, visual production for luxury hotels"
            // LAS DOS FOTOS ENTRAN TAL CUAL, SIN UN SOLO FILTRO. Las graduó
            // ella: cálidas, claras y con su propio degradado. Ni `grayscale`,
            // ni `brightness`, ni `contrast`, ni el `saturate(.84)` que
            // escritorio arrastraba de cuando su foto no venía graduada --
            // cualquiera de ellos se llevaría por delante su trabajo.
            //
            // Y TAMPOCO HACE FALTA CUADRAR EL ENCUADRE A MANO. Aquí hubo tres
            // porcentajes calculados (-73,22% / -6,71% / 273,22%) mientras el
            // archivo era la escena entera y el hero usaba sólo una ventana de
            // 732 px de ancho. Ahora cada archivo ya es su encuadre, así que
            // basta con llenar la caja.
            //
            // LO QUE SÍ DECIDE EL CÓDIGO ES QUÉ SE RECORTA AL LLENARLA, porque
            // ninguna de las dos tiene exactamente la proporción de su caja:
            //   móvil      0,574 contra 0,621 -> sobran 291 px de alto (7,7%)
            //   escritorio 1,413 contra 1,600 -> sobran 453 px de alto (11,7%)
            // En los dos casos el recorte se tira hacia arriba (el tejado), no
            // hacia abajo: abajo está la grava sobre la que cae el texto, y en
            // escritorio también los pies de la figura.
            //
            // EL 65% DE MÓVIL SON LOS 72% DE ANTES MENOS UN 2% DE LA CAJA.
            // Mayurlin pidió bajar la foto "un 2% para que se alinee mejor con
            // el título". Un 2% de los 627,7 px de la caja son 12,55, y como
            // lo que sobra de alto son 174,5 px, eso son 7,2 puntos de
            // `object-position`: 72 - 7,2 = 64,8, redondeado a 65.
            className="absolute inset-y-0 left-0 h-full w-[123%] max-w-none object-cover object-[50%_65%] md:w-full md:max-w-full md:object-[50%_66%]"
          />
        </picture>

        {/* DOS CAPAS, Y NINGUNA TOCA LA FOTO: van encima, en su propio
            div, así que el archivo de Mayurlin sigue intacto.

            1. La lateral izquierda al 15% que ella aprobó.
            2. Una elipse enorme anclada FUERA del encuadre, por debajo de la
               esquina inferior izquierda (`at 16% 108%`), justo donde ella
               marcó en negro que podía caer. Empieza en 46% y tarda el 90% del
               radio en llegar a cero, así que no tiene borde: se lee como la
               sombra que ya proyecta el muro, no como una capa.

            POR QUÉ ESTA Y NO OTRA. Anclar la elipse en una esquina y dejarla
            desbordar es lo que la hace invisible: un óvalo oscuro centrado
            sobre el párrafo se vería como una mancha en mitad de la grava.
            La caída por la esquina es fotográficamente plausible.

            MEDIDO en el párrafo de móvil, mediana sobre los glifos:
              sin nada          1,88:1
              al 34%            2,59:1
              al 46% (ésta)     2,99:1
              al 58%            3,50:1  -- ya se ve, descartada
            En escritorio la misma capa da 3,56:1. El mínimo de la norma son
            4,5:1 y no se alcanza sin que el degradado se note; está hablado
            con ella y es su decisión. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 md:hidden"
          style={{
            background:
              'linear-gradient(90deg, rgba(0,0,0,.15), transparent 55%), radial-gradient(130% 66% at 16% 108%, rgba(0,0,0,.46), rgba(0,0,0,.28) 40%, rgba(0,0,0,.11) 68%, transparent 90%)',
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 hidden md:block"
          style={{
            background:
              'linear-gradient(90deg, rgba(0,0,0,.15), transparent 55%), radial-gradient(95% 78% at 6% 112%, rgba(0,0,0,.46), rgba(0,0,0,.28) 42%, rgba(0,0,0,.11) 70%, transparent 92%)',
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
              className="m-0 mb-5 text-[10px] uppercase tracking-[0.24em] text-white/[.78] md:mb-10 md:tracking-[0.28em] md:text-white/[.72]"
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
              className="m-0 max-w-[13ch] font-serif text-[clamp(29px,8.3vw,35px)] font-normal leading-[1.12] tracking-[-0.03em] md:max-w-[16ch] md:text-[clamp(48px,6.5vw,104px)] md:leading-[1.05] md:tracking-[-0.045em]"
            >
              {hero.titleLead} <i>{hero.titleEmphasis}</i>
            </motion.h1>
          </div>

          {/* GRUPO INFERIOR: qué producimos y la salida.
              VUELVE AL BLANCO. Se probó en tinta oscura y resolvía el
              contraste (1,89 -> 9,16:1), pero Mayurlin lo descartó por una
              razón de diseño, no de medida: "prefiero que esté todo el texto
              en un solo color", con el titular en blanco justo encima.
              Lo que sostiene la lectura ahora es CUERPO, no sombra: más
              tamaño y más peso, y una sola sombra suave y ancha -- no las
              cinco de antes, que ella ya había mandado quitar. En escritorio
              el párrafo crece mucho más porque ahí sobra sitio.
              La banda de cristal de escritorio SÍ se queda en tinta: es el
              único sitio donde ella dijo que se lee mejor así. */}
          <div>
            <motion.p
              {...rise(0.26)}
              animate={animate}
              className="m-0 max-w-[40ch] text-[16px] font-medium leading-[1.5] text-white [text-shadow:0_1px_22px_rgba(0,0,0,.26)] [text-wrap:balance] md:mt-11 md:max-w-[30ch] md:text-[clamp(20px,1.6vw,26px)] md:font-normal md:leading-[1.45]"
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
                className="group relative inline-block -my-3.5 py-3.5 text-[12px] font-sans uppercase tracking-[0.2em] font-semibold text-white [text-shadow:0_1px_20px_rgba(0,0,0,.28)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/80"
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
                  className="absolute bottom-[8px] left-0 block h-[1.5px] w-full bg-white/90"
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
          basta con no ponerla.

          TODO EN TINTA, TAMBIÉN EN ESCRITORIO. La banda iba en blanco desde
          que el hero era una foto oscura. Con la de Mayurlin, que es clara, el
          cristal translúcido se vuelve casi blanco y el blanco encima
          desaparecía -- "ESTUDIO DE PRODUCCIÓN VISUAL" y "VER PROYECTOS"
          apenas se leían. Aquí vive el CTA de escritorio, así que entra en el
          mismo arreglo que el párrafo.

          EL FONDO NO SE ANIMA, SÓLO SU CONTENIDO. La caja entera llevaba el
          `rise` (opacidad de 0 a 1) y en móvil eso dejaba ver el `bg-[#1a1918]`
          de la sección durante el primer segundo: al cargar aparecía un bloque
          negro a pantalla completa debajo de la foto, y luego se aclaraba
          hasta marfil. En escritorio no se notaba porque la banda flota sobre
          la fotografía, no sobre el fondo de la sección. Ahora el marfil está
          desde el primer fotograma y lo que entra son las cifras. */}
      <div
        className="mt-glass mt-glass-halo mt-hero-cifras relative z-[3] w-full text-[#1a1918]
                   md:absolute md:inset-x-0 md:bottom-[clamp(22px,3vw,42px)] md:mx-auto md:h-[76px] md:w-[min(68vw,1120px)] md:min-w-[680px] md:overflow-hidden md:rounded-[10px]"
      >
        <motion.div {...rise(0.42)} animate={animate} className="md:h-full">
        {/* Las columnas son algo mas anchas que en el prototipo: la metrica
            aprobada ("4 clientes recurrentes") es mas larga que la que habia
            ("6 anos") y con el reparto original partia en dos lineas. */}
        <div className="grid grid-cols-3 items-start px-5 pb-[15px] pt-[18px] text-[9px] uppercase tracking-[0.14em] md:h-full md:grid-cols-[1.05fr_repeat(3,0.88fr)_0.9fr] md:items-center md:whitespace-nowrap md:px-6 md:py-0 md:tracking-[0.18em]">
          {/* El rotulo y el enlace solo caben en escritorio. */}
          <div className="hidden md:block">{hero.glassLabel}</div>

          {milestones.items.map((item, i) => (
            <div
              key={item.label}
              className={`md:border-l md:border-[#1a1918]/[.18] md:pl-5 ${
                i === 0 ? 'pl-0' : 'border-l border-[#1a1918]/15 pl-4'
              }`}
            >
              <b className="mb-1 block font-serif text-[27px] font-normal italic leading-none tracking-normal md:mb-0 md:mr-[7px] md:inline md:text-[22px] md:leading-normal">
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
              className="group relative uppercase tracking-[0.18em] text-[#1a1918] transition-opacity hover:opacity-70"
            >
              {hero.ctaLabel}
              <motion.span
                aria-hidden
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.5, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformOrigin: 'left' }}
                className="absolute -bottom-[3px] left-0 block h-px w-full bg-[#1a1918]/65"
              />
            </button>
            {/* Ruta secundaria: nunca compite en peso con el CTA comercial,
                solo baja a Trabajo para quien todavia quiere ver el portafolio. */}
            <button
              onClick={() =>
                document.getElementById('hotel-section')?.scrollIntoView({ behavior: 'smooth' })
              }
              className="uppercase tracking-[0.18em] text-[#1a1918]/65 transition-opacity hover:text-[#1a1918]"
            >
              {hero.secondaryLabel}
            </button>
          </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
