import { useEffect, useState } from 'react';

/** VOLVER A LA PESTAÑA DESPUÉS DE UN RATO FUERA.
 *
 *  EL PROBLEMA. Mayurlin, en el móvil: reproduce los vídeos, se va a otra
 *  aplicación, vuelve, y los marcos se han quedado en negro. No continúan.
 *
 *  POR QUÉ PASA. Cuando una pestaña se va al fondo, los navegadores de móvil
 *  liberan memoria, y lo primero que sueltan son los marcos incrustados de
 *  otros dominios. El marco sigue en la página -- por eso queda el hueco, con
 *  su fondo oscuro -- pero el reproductor que vivía dentro ya no está. No es
 *  que se haya pausado: es que se lo han llevado.
 *
 *  POR QUÉ NO SE PUEDE ARREGLAR DE OTRA MANERA. El vídeo vive en el dominio
 *  del proveedor, así que desde aquí no se puede mirar dentro del marco, ni
 *  preguntarle si sigue vivo, ni decirle que siga reproduciendo. El navegador
 *  lo prohíbe, y con razón. La única palanca que queda desde fuera es la más
 *  bruta y la única que funciona: TIRAR EL MARCO Y HACER OTRO. Al nacer, el
 *  nuevo carga la dirección del proveedor, que ya lleva dentro el arranque
 *  automático y el bucle, y vuelve a reproducirse solo.
 *
 *  POR QUÉ HAY UN UMBRAL DE TIEMPO. Rehacer el marco reinicia el vídeo desde
 *  el principio, y eso no se le puede hacer a alguien que sólo ha mirado una
 *  notificación dos segundos: volvería y el plano habría saltado hacia atrás
 *  sin motivo. Por debajo del umbral no se toca nada, porque además en esos
 *  casos el navegador no ha soltado nada. Por encima, lo más probable es que
 *  el marco esté vacío, y un vídeo reiniciado es infinitamente mejor que un
 *  rectángulo negro.
 *
 *  UN SOLO ESCUCHA PARA TODA LA WEB, como en `cerca.ts`: el estado es uno,
 *  compartido, y los vídeos que haya montados se rehacen todos a la vez. Si
 *  cada uno pusiera el suyo, siete vídeos serían siete escuchas haciendo la
 *  misma cuenta.
 */

/** Cuánto tiene que estar la pestaña al fondo para que al volver se rehagan
 *  los marcos. Cuatro segundos: por debajo, es un vistazo a otra aplicación y
 *  el navegador casi nunca ha soltado nada. */
const UMBRAL_MS = 4000;

let generacion = 0;
let ocultaDesde = 0;
const suscritos = new Set<(g: number) => void>();
let escuchando = false;

function rehacer() {
  generacion += 1;
  suscritos.forEach((f) => f(generacion));
}

function alCambiarVisibilidad() {
  if (document.visibilityState === 'hidden') {
    ocultaDesde = Date.now();
    return;
  }
  // Vuelve a estar a la vista.
  if (ocultaDesde && Date.now() - ocultaDesde >= UMBRAL_MS) rehacer();
  ocultaDesde = 0;
}

/** Volver atrás desde otra página. El navegador guarda la página entera en su
 *  caché y la restaura tal cual, con los marcos ya vaciados: `persisted` dice
 *  justamente que viene de ahí. En ese caso no hay tiempo que medir. */
function alMostrarPagina(e: PageTransitionEvent) {
  if (e.persisted) rehacer();
}

function empezarAEscuchar() {
  if (escuchando || typeof document === 'undefined') return;
  escuchando = true;
  document.addEventListener('visibilitychange', alCambiarVisibilidad);
  window.addEventListener('pageshow', alMostrarPagina);
}

/** Un número que sube cada vez que hay que rehacer los marcos de vídeo.
 *
 *  Se usa como `key` del `<iframe>`: cuando cambia, React tira el marco viejo
 *  y monta uno nuevo, que es exactamente lo que hace falta. */
export function useGeneracionDeVideo(): number {
  const [g, setG] = useState(generacion);
  useEffect(() => {
    empezarAEscuchar();
    suscritos.add(setG);
    // Por si la generación avanzó entre el primer dibujo y este momento.
    setG(generacion);
    return () => {
      suscritos.delete(setG);
    };
  }, []);
  return g;
}
