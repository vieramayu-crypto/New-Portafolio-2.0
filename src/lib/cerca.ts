import { useEffect, useRef, useState, type RefObject } from 'react';

/** CUÁNTOS REPRODUCTORES DE VÍDEO PUEDEN ESTAR VIVOS A LA VEZ, Y CUÁLES.
 *
 *  EL PROBLEMA. Cada reproductor es un marco incrustado de otro dominio: en
 *  cuanto existe, descarga su propio código y empieza a pedir vídeo. Inicio
 *  mide catorce pantallas y media de alto y tiene siete repartidos. Medido en
 *  un móvil de 390px, antes de esto: SIETE funcionando a la vez al llegar al
 *  60% de la página, dos de ellos desde el instante de abrirla, y en casi
 *  ningún punto del recorrido más de uno visible. Seis de siete reproduciendo
 *  para nadie.
 *
 *  Eso es lo que volvía lenta la web en el móvil. Y es la explicación más
 *  probable de que el navegador dejara de arrancarlos solos: los navegadores
 *  de móvil limitan cuántos vídeos dejan correr a la vez, y con siete pidiendo
 *  turno los que llegan tarde se quedan parados esperando un toque.
 *
 *  POR QUÉ NO BASTA CON LA DISTANCIA. Fue lo primero que se probó: encender al
 *  acercarse y apagar al alejarse. Ayuda en los extremos (la página ya no
 *  termina con siete encendidos) pero no en el medio, porque los hoteles con
 *  pieza están juntos: con la distancia de apagado en 2.400 px el pico seguía
 *  en CINCO. Y no se puede apretar más sin tocar la distancia de ENCENDIDO,
 *  que es el "segundo y medio antes" que pidió Mayurlin y no se toca.
 *
 *  ASÍ QUE HAY UN TOPE. Todos los bloques dicen si se quieren encender, y este
 *  módulo deja vivos sólo los DOS más cercanos al centro de la pantalla. El
 *  resto espera su turno. Dos es un número que cualquier móvil sostiene sin
 *  despeinarse, y por pantalla nunca se ve más de uno o dos de todas formas.
 *
 *  LA HOLGURA SIGUE AHÍ: se enciende a 1.800 px y se deja de querer a 3.200,
 *  así que pasar por delante de un bloque y volver no reconstruye el vídeo.
 */

const LIMITE = 2;

interface Inscrito {
  el: Element;
  quiere: boolean;
  set: (v: boolean) => void;
}

const inscritos = new Set<Inscrito>();
let pendiente = false;

function distanciaAlCentro(el: Element): number {
  const r = el.getBoundingClientRect();
  return Math.abs((r.top + r.bottom) / 2 - window.innerHeight / 2);
}

/** Reparte los turnos: los más cercanos al centro de la pantalla, encendidos;
 *  los demás, apagados. Se agrupa en un fotograma para no recalcularlo una vez
 *  por bloque cada vez que algo cambia. */
function repartir() {
  if (pendiente) return;
  pendiente = true;
  requestAnimationFrame(() => {
    pendiente = false;
    const quieren: Inscrito[] = [];
    inscritos.forEach((i) => {
      if (i.quiere) quieren.push(i);
      else i.set(false);
    });
    quieren.sort((a, b) => distanciaAlCentro(a.el) - distanciaAlCentro(b.el));
    quieren.forEach((i, n) => i.set(n < LIMITE));
  });
}

if (typeof window !== 'undefined') {
  window.addEventListener('scroll', repartir, { passive: true });
  window.addEventListener('resize', repartir, { passive: true });
}

export function useCercaDePantalla(
  ref: RefObject<Element | null>,
  { encender = 1800, apagar = 3200, activo = true }: {
    encender?: number;
    apagar?: number;
    activo?: boolean;
  } = {}
): boolean {
  const [cerca, setCerca] = useState(false);
  const inscritoRef = useRef<Inscrito | null>(null);

  useEffect(() => {
    if (!activo) return;
    const el = ref.current;
    // Sin observador (navegador antiguo, o el recorrido del prerenderizado):
    // se monta y ya. Más vale que funcione para todos que ahorrar en el caso
    // raro.
    if (!el || typeof IntersectionObserver === 'undefined') {
      setCerca(true);
      return;
    }

    const inscrito: Inscrito = { el, quiere: false, set: setCerca };
    inscritoRef.current = inscrito;
    inscritos.add(inscrito);

    const encenderIO = new IntersectionObserver(
      (entradas) => {
        if (entradas[0]?.isIntersecting) {
          inscrito.quiere = true;
          repartir();
        }
      },
      { rootMargin: `${encender}px 0px` }
    );
    const apagarIO = new IntersectionObserver(
      (entradas) => {
        if (!entradas[0]?.isIntersecting) {
          inscrito.quiere = false;
          repartir();
        }
      },
      { rootMargin: `${apagar}px 0px` }
    );
    encenderIO.observe(el);
    apagarIO.observe(el);

    return () => {
      encenderIO.disconnect();
      apagarIO.disconnect();
      inscritos.delete(inscrito);
      inscritoRef.current = null;
      repartir();
    };
  }, [ref, encender, apagar, activo]);

  return cerca;
}
