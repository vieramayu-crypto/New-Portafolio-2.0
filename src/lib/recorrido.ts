/** El recorrido: volver deja al visitante donde estaba.
 *
 *  El problema que resuelve, con las palabras de Mayurlin: "estoy en Inicio,
 *  entro en Proyectos, bajo hasta GPRO Valparaíso, le doy a Ver galería, y al
 *  volver me manda a Inicio. Aquí se rompe el flujo."
 *
 *  Eran dos fallos encadenados:
 *
 *    1. El botón Volver de una ficha hacía `navigate('/')` -- literalmente
 *       "ve a Inicio" -- sin mirar de dónde venías.
 *    2. Aunque volviera bien, un `scrollTo(0)` en cada cambio de ruta te
 *       dejaba arriba del todo, no en el bloque del hotel que estabas viendo.
 *
 *  Aquí viven las dos piezas que lo arreglan.
 */

/** Dónde estaba el scroll en cada entrada del historial.
 *
 *  La clave es `location.key`, que React Router crea única POR ENTRADA, no por
 *  ruta: si visitas Proyectos dos veces y las dejas a distinta altura, cada una
 *  recuerda la suya. Vive en memoria y se pierde al recargar, que es lo
 *  correcto -- una recarga empieza de cero.
 */
const posiciones = new Map<string, number>();

/** Anota la altura de esta entrada del historial mientras se está en ella.
 *
 *  Tiene que ser continuo y no "al salir": la limpieza de un efecto corre en
 *  la fase pasiva, DESPUÉS de que el efecto de layout de la pantalla nueva ya
 *  haya puesto el scroll a cero. Guardando al salir se guardaba siempre un
 *  cero, y volver aterrizaba arriba del todo -- medido: 2.286 px de desvío
 *  respecto al bloque de GPRO. Vigilando el scroll, el último valor anotado es
 *  el bueno.
 *
 *  Devuelve la función para dejar de vigilar.
 */
export function vigilarPosicion(clave: string): () => void {
  let pendiente = false;
  const anotar = () => {
    if (pendiente) return;
    pendiente = true;
    requestAnimationFrame(() => {
      pendiente = false;
      posiciones.set(clave, window.scrollY);
    });
  };
  anotar();
  window.addEventListener('scroll', anotar, { passive: true });
  return () => window.removeEventListener('scroll', anotar);
}

export function posicionGuardada(clave: string): number | undefined {
  return posiciones.get(clave);
}

/** Lleva el scroll a `destino`, insistiendo mientras la página siga creciendo.
 *
 *  Hace falta insistir porque Inicio mide más de 20.000 px y esa altura no
 *  existe en el instante en que React monta: las fotos aún no han llegado y el
 *  documento es mucho más corto, así que un `scrollTo(14000)` a secas se queda
 *  donde alcance. Se reintenta durante medio segundo, y se para en cuanto el
 *  visitante toca la rueda o la pantalla: si ya ha decidido moverse, mandar
 *  nosotros sería peor que no restaurar nada.
 *
 *  Devuelve una función para cancelarlo, que el efecto que lo llama usa al
 *  desmontarse.
 */
/** El bloque al que hay que volver, si lo sabemos.
 *
 *  Lo pone el botón Volver de una ficha antes de retroceder, porque
 *  `navigate(-1)` no admite pasar datos. Sirve para no depender sólo del
 *  número de píxeles: en móvil la página de destino puede haber crecido
 *  mientras el visitante estaba fuera -- fotos que terminan de cargar -- y
 *  entonces esos píxeles ya no caen en el mismo bloque. Con el identificador
 *  del hotel se recalcula el destino a cada intento y siempre acierta.
 */
let anclaPendiente: string | null = null;

export function pedirAncla(id: string): void {
  anclaPendiente = id;
}

/** Devuelve el ancla pendiente y la consume: sólo vale para la vuelta actual. */
export function tomarAncla(): string | null {
  const a = anclaPendiente;
  anclaPendiente = null;
  return a;
}

export function restaurarScroll(destino: number, ancla?: string | null, ms = 1600): () => void {
  let cancelado = false;
  const parar = () => {
    cancelado = true;
  };

  const opciones = { passive: true, once: true } as AddEventListenerOptions;
  window.addEventListener('wheel', parar, opciones);
  window.addEventListener('touchstart', parar, opciones);
  window.addEventListener('keydown', parar, opciones);

  const limite = performance.now() + ms;
  let aciertos = 0;
  const paso = () => {
    if (cancelado) return;
    // Si sabemos a qué bloque volvemos, mandan sus coordenadas de AHORA, no
    // las de cuando se salió.
    const elemento = ancla ? document.getElementById(`hotel-${ancla}`) : null;
    if (elemento) {
      const arriba = elemento.getBoundingClientRect().top + window.scrollY;
      destino = Math.max(0, Math.round(arriba) - 96);
    }
    window.scrollTo({ top: destino, behavior: 'instant' as ScrollBehavior });
    // Damos por bueno el destino sólo cuando se sostiene varios fotogramas
    // seguidos: una foto que termina de cargar puede reacomodar la página
    // justo después de haber acertado, y entonces hay que volver a colocarse.
    aciertos = Math.abs(window.scrollY - destino) <= 2 ? aciertos + 1 : 0;
    if (aciertos < 4 && performance.now() < limite) {
      requestAnimationFrame(paso);
    } else {
      parar();
    }
  };
  requestAnimationFrame(paso);

  return () => {
    parar();
    window.removeEventListener('wheel', parar);
    window.removeEventListener('touchstart', parar);
    window.removeEventListener('keydown', parar);
  };
}

/** ¿Hay algo detrás en el historial, dentro de esta misma visita?
 *
 *  React Router numera sus entradas en `history.state.idx`. Un 0 significa que
 *  esta es la primera pantalla de la visita -- se ha entrado por un enlace
 *  directo, que es justo el caso de los enlaces que Mayurlin manda a un hotel.
 *  Ahí `navigate(-1)` sacaría al visitante de la web, así que el botón Volver
 *  tiene que llevarlo a un sitio con sentido en vez de hacia atrás.
 */
export function hayHistorialPropio(): boolean {
  const idx = (window.history.state as { idx?: number } | null)?.idx;
  return typeof idx === 'number' && idx > 0;
}
