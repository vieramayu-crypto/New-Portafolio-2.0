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
            'linear-gradient(90deg, rgba(0,0,0,.21), transparent 62%), linear-gradient(0deg, rgba(0,0,0,.13), transparent 42%)',
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

      {/* Bloque editorial, a media altura sobre el margen izquierdo en los dos
          tamanos. */}
      <div className="absolute inset-x-5 top-1/2 z-[3] -translate-y-1/2 md:right-auto md:left-[clamp(22px,3.4vw,54px)] md:-translate-y-[52%]">
        <motion.p
          {...rise(0.1)}
          animate={animate}
          // Blanco puro en movil: ahi no hay velo debajo y con .72 el rotulo
          // se quedaba en 2.2:1 sobre la piedra clara. En escritorio el velo
          // lateral lo sostiene y puede seguir apagado.
          className="mb-[15px] text-[9px] uppercase tracking-[0.28em] text-white/[.72]"
        >
          {hero.eyebrow}
        </motion.p>
        <motion.h1
          {...rise(0.18)}
          animate={animate}
          className="m-0 max-w-[7.7ch] font-serif text-[clamp(52px,14.85vw,74px)] font-normal leading-[1.16] tracking-[-0.045em] md:max-w-[8.7ch] md:text-[clamp(64px,7.3vw,116px)]"
        >
          {hero.titleLead} <i>{hero.titleEmphasis}</i>
        </motion.h1>
        {/* Frase funcional: qué producimos y para qué sirve. Un solo renglón
            discreto, nunca compite en tamaño con el titular. */}
        <motion.p
          {...rise(0.26)}
          animate={animate}
          className="mt-3 max-w-[26ch] text-[13px] leading-snug text-white/80 md:mt-4 md:max-w-[34ch] md:text-[15px]"
        >
          {hero.subline}
        </motion.p>
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
        <div className="grid h-full grid-cols-3 items-center px-4 text-[6.5px] uppercase tracking-[0.18em] md:grid-cols-[1.05fr_repeat(3,0.88fr)_0.9fr] md:whitespace-nowrap md:px-6 md:text-[8px]">
          {/* El rotulo y el enlace solo caben en escritorio. */}
          <div className="hidden md:block">{hero.glassLabel}</div>

          {milestones.items.map((item, i) => (
            <div
              key={item.label}
              className={`md:border-l md:border-white/[.14] md:pl-5 ${
                i === 0 ? 'pl-0' : 'border-l border-white/[.14] pl-3'
              }`}
            >
              <b className="mb-0.5 block font-serif text-[21px] font-normal italic tracking-normal md:mb-0 md:mr-[7px] md:inline">
                {item.value}
              </b>
              {item.label}
            </div>
          ))}

          <button
            onClick={onOpenAvailability}
            className="hidden text-right uppercase tracking-[0.18em] text-white/90 transition-opacity hover:opacity-100 md:block"
          >
            {hero.ctaLabel}
          </button>
        </div>
      </motion.div>
    </section>
  );
};
