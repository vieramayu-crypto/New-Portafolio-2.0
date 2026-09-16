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
 *  Titular a media altura sobre el margen izquierdo, y toda la trayectoria
 *  recogida en una banda de cristal estrecha al pie.
 *
 *  Movil no es el mismo hero encogido, es otro encuadre:
 *  - la banda deja solo las tres cifras (el rotulo y el enlace ganaban una
 *    segunda fila que doblaba su altura y le comia sitio a la foto),
 *  - el titular baja un 10% y sube para caer entero dentro de la franja
 *    oscura de la piedra, donde se lee sin ayuda,
 *  - la foto se reencuadra para que la persona quede a la derecha y deje la
 *    izquierda limpia,
 *  - y por eso mismo el velo lateral desaparece: ahi ya no hace falta.
 */
export const HeroSection: React.FC<HeroSectionProps> = ({ introDone, onOpenAvailability }) => {
  const { hero, milestones } = useSiteContent();
  const animate = introDone ? SETTLED : undefined;

  return (
    <section className="relative h-[100svh] min-h-[680px] w-full select-none overflow-hidden bg-[#1a1918] font-sans text-white">
      {/* Dos encuadres de la misma escena, uno por tamano. La horizontal en
          vertical obligaba al movil a usar un tercio de su ancho y estirarlo
          casi al doble, y la foto se veia blanda; la vertical llega ya
          recortada y el movil no amplia nada. `<picture>` no crea bloque
          contenedor, asi que el `absolute` del <img> sigue midiendo contra la
          seccion. */}
      <picture>
        <source media="(min-width: 768px)" srcSet={HERO_PHOTO} />
        <img
          src={HERO_PHOTO_MOBILE}
          alt="Mayu Travel, visual production for luxury hotels"
          // En movil la foto se dibuja un 5% mas alta y anclada arriba: a
          // 390x844 el `cover` ya encaja de altura exacta, asi que
          // `object-position` en el eje Y no hace nada y esta es la unica forma
          // de bajar a la persona hasta la altura del titular. El sobrante cae
          // detras de la banda.
          className="absolute left-0 top-0 h-[105%] w-full object-cover object-[10%_50%] saturate-[.84] md:h-full md:object-[56%_28%]"
        />
      </picture>

      {/* Dos velos cruzados: uno lateral que sostiene el titular sobre el margen
          izquierdo y uno inferior muy leve que asienta la banda. En movil el
          lateral va al 70% de su fuerza (.30 -> .21): la franja oscura de la
          piedra ya hace parte del trabajo, pero no todo — sin nada, el rotulo
          se queda en 2,2:1 sobre las piedras claras de arriba. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 md:hidden"
        style={{
          background:
            'linear-gradient(90deg, rgba(0,0,0,.21), transparent 62%), linear-gradient(0deg, rgba(0,0,0,.70), rgba(0,0,0,.62) 20%, rgba(0,0,0,.52) 34%, rgba(0,0,0,.28) 50%, transparent 64%)',
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

      {/* Bloque editorial.

          En escritorio va a media altura sobre el margen izquierdo, en flujo
          normal. En movil NO: cada pieza se coloca en su propio porcentaje de
          pantalla, porque con margenes encadenados el sitio de una dependia
          del alto de la anterior y nunca caia donde Mayurlin la marcaba. El
          titular se centra con la figura de la persona de la foto (su centro
          esta al 48% de la pantalla), el subtitulo arranca por debajo de los
          pies y el boton cierra sin llegar a la banda de cristal.

          Cada motion.* va envuelto en un div de posicion: Framer Motion
          escribe su propio `transform` para animar y se llevaria por delante
          cualquier `translate` que pusieramos en la misma etiqueta. */}
      <div className="absolute inset-x-5 inset-y-0 z-[3] md:inset-y-auto md:right-auto md:left-[clamp(22px,3.4vw,54px)] md:top-1/2 md:-translate-y-[52%]">
        {/* UNA sola pila, anclada por ABAJO y con huecos en pixeles.

            Antes el rotulo iba a top-16% y el titular a top-48%, mientras el
            subtitulo y la banda de cristal iban anclados por pixeles desde
            abajo. Dos sistemas a la vez: en cuanto el navegador colapsa su
            barra de direcciones y la ventana crece, los porcentajes se mueven
            y los pixeles no, asi que el reparto interior cambia solo. Medido
            con la ventana pasando de 700 a 790 de alto: el hueco rotulo-
            titular pasaba de 122 a 148px, y el titular-subtitulo de 23 a 67 --
            casi el triple. En Safari de iPhone no se notaba porque su barra
            va abajo y no cambia la altura igual.

            Con todo anclado por abajo y los huecos en pixeles, la pila entera
            sube o baja con la banda de cristal, pero por dentro no se mueve
            nada. En escritorio no cambia: los cuatro elementos ya iban en
            flujo normal y siguen en el mismo orden, con sus margenes md:. */}
        <div className="absolute inset-x-0 bottom-[118px] md:static md:bottom-auto">
          <motion.p
            {...rise(0.1)}
            animate={animate}
            // Blanco puro en movil: ahi no hay velo debajo y con .72 el rotulo
            // se quedaba en 2.2:1 sobre la piedra clara. En escritorio el velo
            // lateral lo sostiene y puede seguir apagado.
            className="m-0 mb-6 text-[10px] uppercase tracking-[0.28em] text-white/[.72] md:mb-10"
          >
            {hero.eyebrow}
          </motion.p>

          <motion.h1
            {...rise(0.18)}
            animate={animate}
            // Interlineado apretado a propósito: el problema no era el cuerpo
            // de la letra sino el aire ENTRE renglones, que estiraba el
            // titular hasta comerse la pantalla.
            className="m-0 max-w-[12ch] font-serif text-[clamp(38px,11vw,52px)] font-normal leading-[1.05] tracking-[-0.045em] md:max-w-[16ch] md:text-[clamp(48px,5.4vw,86px)]"
          >
            {hero.titleLead} <i>{hero.titleEmphasis}</i>
          </motion.h1>

          {/* Frase funcional: qué producimos y para qué sirve. Nunca compite
              en tamaño con el titular, pero en movil vive sobre la grava a
              pleno sol: sube a 14px y a peso medio, y va en blanco puro sobre
              el velo reforzado de abajo. Con 13px en .80 no se leia. */}
          <motion.p
            {...rise(0.26)}
            animate={animate}
            className="m-0 mt-6 text-[15px] font-medium leading-snug text-white [text-shadow:0_1px_16px_rgba(0,0,0,.52)] md:mt-10 md:max-w-[34ch] md:text-[16px] md:font-normal md:text-white/80 md:[text-shadow:none]"
          >
            {hero.subline}
          </motion.p>

          {/* El CTA vivía solo dentro de la banda de cristal, y esa banda
              esconde su columna de acción por debajo de 768px: en móvil no
              había ninguna forma de contactar desde la primera pantalla. Aquí
              va el botón para ese tamaño; en escritorio manda el de la banda. */}
          <motion.div {...rise(0.34)} animate={animate} className="mt-6 md:hidden">
            {/* `font-semibold` solo aqui: es el unico boton de la web que se
                lee sobre una foto a pleno sol. */}
            <button
              onClick={onOpenAvailability}
              className="bg-[#f5f3ed] px-6 py-3 text-[11px] font-sans uppercase tracking-[0.2em] font-semibold text-[#1a1918] transition-colors hover:bg-white"
            >
              {hero.ctaLabel}
            </button>
          </motion.div>
        </div>
      </div>

      {/* Banda de cristal. Se centra con `mx-auto`, no con `translate`: Framer
          Motion escribe su propio `transform` para animar y se llevaria por
          delante el centrado. */}
      <motion.div
        {...rise(0.42)}
        animate={animate}
        className="mt-glass mt-glass-halo absolute inset-x-0 bottom-[max(14px,env(safe-area-inset-bottom))] z-[3] mx-auto h-[74px] w-[calc(100vw-28px)] overflow-hidden rounded-[9px] md:bottom-[clamp(22px,3vw,42px)] md:h-[76px] md:w-[min(68vw,1120px)] md:min-w-[680px] md:rounded-[10px]"
      >
        {/* Las columnas son algo mas anchas que en el prototipo: la metrica
            aprobada ("4 clientes recurrentes") es mas larga que la que habia
            ("6 anos") y con el reparto original partia en dos lineas. */}
        <div className="grid h-full grid-cols-3 items-center px-4 text-[7.5px] uppercase tracking-[0.08em] md:grid-cols-[1.05fr_repeat(3,0.88fr)_0.9fr] md:whitespace-nowrap md:px-6 md:text-[9px] md:tracking-[0.18em]">
          {/* El rotulo y el enlace solo caben en escritorio. */}
          <div className="hidden md:block">{hero.glassLabel}</div>

          {milestones.items.map((item, i) => (
            <div
              key={item.label}
              className={`md:border-l md:border-white/[.14] md:pl-5 ${
                i === 0 ? 'pl-0' : 'border-l border-white/[.14] pl-3'
              }`}
            >
              <b className="mb-0.5 block font-serif text-[22px] font-normal italic tracking-normal md:mb-0 md:mr-[7px] md:inline">
                {item.value}
              </b>
              <span className="block min-h-[2.3em] leading-[1.15] md:inline md:min-h-0 md:leading-normal">
                {item.label}
              </span>
            </div>
          ))}

          <div className="hidden flex-col items-end gap-1 text-right md:flex">
            <button
              onClick={onOpenAvailability}
              className="uppercase tracking-[0.18em] text-white/90 transition-opacity hover:opacity-100"
            >
              {hero.ctaLabel}
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
