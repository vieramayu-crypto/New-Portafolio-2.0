import React, { useEffect, useRef } from 'react';
import './mosaico-verticales.css';
import { PIEZAS_VERTICALES } from './GaleriaPiezas';

/** EL MOSAICO DE PIEZAS VERTICALES. HOY SÓLO VIVE EN LA RUTA DE PRUEBA.
 *
 *  Las seis piezas verticales reproduciéndose A LA VEZ en tres columnas que
 *  se desplazan solas en sentidos alternos (dos columnas en móvil), con el
 *  texto del bloque a la izquierda. Sustituye a `GaleriaPiezas` sólo dentro de
 *  `/pruebas/inicio-mosaico`; el Inicio de verdad sigue con la galería de una
 *  pieza cada vez.
 *
 *  POR QUÉ ESTÁ EN PRUEBAS Y NO PUBLICADO. Cada pieza es un marco de otro
 *  dominio: en cuanto existe, descarga su código y pide vídeo. La web entera
 *  tiene un tope de DOS reproductores vivos a la vez (`src/lib/cerca.ts`),
 *  que es lo que arregló que en el móvil hubiera que darle al play a mano.
 *  Esto enseña seis, y medido en la prueba suelta llegaba a diez en móvil y
 *  trece en escritorio contando los clones. Es el concepto, no un fallo: lo
 *  que gusta de este bloque es ver las seis moviéndose. La ruta de prueba
 *  existe justo para medir si un móvil de verdad lo sostiene.
 *
 *  LO QUE SÍ HACE ESTE COMPONENTE para no cargarse el resto de la página: el
 *  reproductor no existe mientras su celda está lejos de la pantalla, así que
 *  al pasar de largo el bloque no deja ni uno vivo. Ver `repartir`.
 *
 *  La geometría, los tiempos y las curvas salen de `public/pruebas/
 *  verticales.html`, que Mayurlin aprobó en móvil y en escritorio. Si hay que
 *  tocar algo visual, mirar también allí para no dejarlos distintos.
 */

/** CADA COLUMNA LLEVA SU PROPIO PAR DE PIEZAS, ALTERNADO, y eso es lo único
 *  que garantiza las seis a la vez: c1 sólo enseña la 1 y la 2, c2 la 3 y la
 *  4, c3 la 5 y la 6. Como alternan, en la franja visible de cada columna
 *  siempre hay una de cada. Repartidas al azar salían entre tres y seis,
 *  porque c2 gira al revés y se va desfasando de las otras dos.
 *  En móvil hay dos columnas, así que son tríos en vez de pares. */
const PARES = [
  [0, 1],
  [2, 3],
  [4, 5],
];
const TRIOS = [
  [0, 1, 2],
  [3, 4, 5],
];

/** Cuántos huecos por columna antes de clonar. Los justos para cubrir la
 *  pantalla: el clonado duplica la columna para que el `translateY(-50%)`
 *  cierre el bucle sin costura, así que de más sería el doble de marcos. */
const HUECOS_ESCRITORIO = 4;
const HUECOS_MOVIL = 6;

/** EL REPRODUCTOR SE MONTA A 90px DE ENTRAR Y SE TIRA A 320 DE HABER SALIDO.
 *  Las dos distancias son distintas a propósito: con un solo umbral, una
 *  celda parada justo en el borde se montaría y se tiraría sin parar. A la
 *  velocidad de la cinta esa banda son unos seis segundos. */
const CERCA = 90;
const LEJOS = 320;

/** EL FRENO Y EL ARRANQUE, CON CURVA. `animation-play-state` sólo tiene dos
 *  estados, así que con él no se puede frenar poco a poco. Lo que sí se puede
 *  tocar en continuo es la VELOCIDAD de la animación, `playbackRate`, por la
 *  API de animaciones del navegador.
 *
 *  EL ARRANQUE NO PUEDE EMPEZAR CON FUERZA. La primera versión usaba una
 *  curva con exceso de las de siempre y salía disparada: a los 100ms ya iba
 *  al 45% de la velocidad normal, y ese tirón se veía. Ahora son dos tramos
 *  con la misma curva simétrica del freno: de 0 al 110% en el primer 62% del
 *  tiempo, y del 110% al 100% en el resto. La aceleración sale de cero, crece
 *  y vuelve a cero en el pico y otra vez al final. */
const FRENO = 650;
const ESPERA = 3500;
const ARRANQUE = 1400;
const PICO = 1.1;
const SUBIDA = 0.62;

/** Curva simétrica: entra y sale despacio. */
const suave = (u: number) => (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2);

interface MosaicoVerticalesProps {
  titulo: string;
  subtitulo: string;
  /** El marfil de la casa. `alterno` usa el otro, igual que `GaleriaPiezas`. */
  alterno?: boolean;
}

export const MosaicoVerticales: React.FC<MosaicoVerticalesProps> = ({
  titulo,
  subtitulo,
  alterno,
}) => {
  const rejillaRef = useRef<HTMLDivElement>(null);
  const capaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rejilla = rejillaRef.current;
    const capa = capaRef.current;
    if (!rejilla || !capa) return;

    const columnas = (): HTMLDivElement[] =>
      Array.from(rejilla.querySelectorAll<HTMLDivElement>('.mv-col'));
    const visibles = (): HTMLDivElement[] =>
      columnas().filter((c) => getComputedStyle(c).display !== 'none');

    /* ---------- construir las celdas ---------- */

    /* Las columnas las pinta React vacías y las rellena esto. React no tiene
       hijos que reconciliar ahí dentro, así que no se pelea con nosotros, y un
       iframe montado a mano no se vuelve a montar en cada render: remontarlo
       es tirar la descarga y volver a empezar. */
    let cuantas = 0;
    const construir = () => {
      const dos = !window.matchMedia('(min-width: 1024px)').matches;
      const n = dos ? 2 : 3;
      if (n === cuantas) return;
      cuantas = n;
      columnas().forEach((col, ci) => {
        col.innerHTML = '';
        const lista = dos ? TRIOS[ci % TRIOS.length] : PARES[ci % PARES.length];
        const huecos = dos ? HUECOS_MOVIL : HUECOS_ESCRITORIO;
        for (let k = 0; k < huecos; k += 1) {
          const celda = document.createElement('div');
          celda.className = 'mv-celda';
          celda.dataset.pieza = String(lista[k % lista.length] % PIEZAS_VERTICALES.length);
          col.appendChild(celda);
        }
        Array.from(col.children).forEach((c) => col.appendChild(c.cloneNode(true)));
      });
    };

    /* ---------- montar y tirar reproductores por cercanía ---------- */

    /* `display: none` NO cuenta como fuera de pantalla: ocultar un iframe no
       impide que descargue. Por eso la columna escondida se vacía entera. */
    const repartir = () => {
      const alto = window.innerHeight;

      /* NI UN REPRODUCTOR HASTA QUE EL BLOQUE ESTÁ LLEGANDO. Sin esto, con la
         página recién abierta ya había CUATRO vivos: el bloque es la tercera
         sección y sus primeras celdas caen a menos de `CERCA` del borde de
         abajo. Cuatro marcos descargando vídeo mientras el móvil todavía trae
         la foto del hero es exactamente lo que volvía lenta la web. Medido
         con esta puerta: cero al abrir y cero al dejar el bloque atrás. */
      const marco = rejilla.getBoundingClientRect();
      if (marco.top - alto > 200 || marco.bottom < -200) {
        columnas().forEach((col) => {
          col.querySelectorAll('iframe').forEach((f) => f.remove());
        });
        return;
      }
      columnas().forEach((col) => {
        const oculta = getComputedStyle(col).display === 'none';
        col.querySelectorAll<HTMLDivElement>('.mv-celda').forEach((celda) => {
          const marco = celda.firstElementChild;
          const tiene = marco?.tagName === 'IFRAME';
          if (oculta) {
            if (tiene && marco) celda.removeChild(marco);
            return;
          }
          const r = celda.getBoundingClientRect();
          const fuera = Math.max(0, Math.max(r.top - alto, -r.bottom));
          if (!tiene && fuera <= CERCA) {
            const pieza = PIEZAS_VERTICALES[Number(celda.dataset.pieza) || 0];
            if (!pieza) return;
            /* El bloque del proveedor, sin tocarlo: los mismos atributos que
               `VideoNube` y la dirección intacta. Todo lo que se le ha añadido
               alguna vez a un iframe de éstos ha empeorado la reproducción. */
            const f = document.createElement('iframe');
            f.setAttribute(
              'allow',
              'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture; web-share',
            );
            f.setAttribute('allowfullscreen', '');
            f.setAttribute('frameborder', '0');
            f.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
            f.setAttribute('title', `Pieza vertical: ${pieza.hotel}`);
            f.src = pieza.src;
            celda.appendChild(f);
          } else if (tiene && marco && fuera > LEJOS) {
            celda.removeChild(marco);
          }
        });
      });
    };

    /* ---------- frenar y arrancar con curva ---------- */

    const rampas = new Map<Element, number>();
    const esperas = new Map<Element, number>();
    const animDe = (col: Element) => col.getAnimations?.()[0] ?? null;

    const cortar = (col: Element) => {
      const r = rampas.get(col);
      if (r) {
        cancelAnimationFrame(r);
        rampas.delete(col);
      }
      const e = esperas.get(col);
      if (e) {
        window.clearTimeout(e);
        esperas.delete(col);
      }
    };

    const llevar = (
      col: HTMLDivElement,
      dur: number,
      tasa: (u: number) => number,
      alAcabar?: () => void,
    ) => {
      const a = animDe(col);
      if (!a) {
        /* Sin la API de animaciones no hay curva posible: corte de siempre. */
        col.style.animationPlayState = tasa(1) < 0.01 ? 'paused' : '';
        alAcabar?.();
        return;
      }
      const t0 = performance.now();
      const paso = (t: number) => {
        const u = Math.min(1, (t - t0) / dur);
        a.playbackRate = Math.max(0, tasa(u));
        if (u < 1) rampas.set(col, requestAnimationFrame(paso));
        else {
          rampas.delete(col);
          alAcabar?.();
        }
      };
      rampas.set(col, requestAnimationFrame(paso));
    };

    /* La frenada dura menos si la columna ya venía lenta, para que
       interrumpir un arranque a medias no se quede colgado medio segundo. */
    const frenar = (col: HTMLDivElement, alParar?: () => void) => {
      cortar(col);
      const v0 = animDe(col)?.playbackRate ?? 1;
      llevar(col, FRENO * Math.max(0.35, v0), (u) => v0 * (1 - suave(u)), alParar);
    };
    const soltar = (col: HTMLDivElement) => {
      cortar(col);
      const v0 = animDe(col)?.playbackRate ?? 0;
      llevar(col, ARRANQUE, (u) =>
        u < SUBIDA
          ? v0 + (PICO - v0) * suave(u / SUBIDA)
          : PICO + (1 - PICO) * suave((u - SUBIDA) / (1 - SUBIDA)),
      );
    };

    const columnaEn = (x: number): HTMLDivElement | null => {
      const dentro = visibles().filter((c) => {
        const r = c.getBoundingClientRect();
        return x >= r.left && x <= r.right;
      });
      return dentro.length ? dentro[dentro.length - 1] : null;
    };

    /* ESCRITORIO: se para la columna bajo el cursor y se suelta al salir. Sin
       temporizador: mientras el cursor siga encima, se queda quieta. */
    let bajoCursor: HTMLDivElement | null = null;
    const alMover = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      const c = columnaEn(e.clientX);
      if (c === bajoCursor) return;
      if (bajoCursor) soltar(bajoCursor);
      bajoCursor = c;
      if (c) frenar(c);
    };
    const alSalir = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      if (bajoCursor) soltar(bajoCursor);
      bajoCursor = null;
    };

    /* MÓVIL: un toque frena la columna, espera 3,5s QUIETA y arranca sola.
       Los 3,5s se cuentan desde que está parada del todo, no desde el toque,
       así que la quietud dura lo que dice. Otro toque antes la arranca ya.
       LA CLAVE ES DISTINGUIR UN TOQUE DE UN DESPLAZAMIENTO: antes valía
       cualquier contacto y al bajar por la página la columna se quedaba
       fijada. Sólo cuenta si el dedo se movió menos de 12px y levantó antes
       de medio segundo; si el navegador manda `pointercancel` porque el gesto
       pasó a ser scroll, tampoco. */
    let fijada: HTMLDivElement | null = null;
    let tx = 0;
    let ty = 0;
    let tt = 0;
    let valido = false;
    const alPulsar = (e: PointerEvent) => {
      if (e.pointerType !== 'touch') return;
      tx = e.clientX;
      ty = e.clientY;
      tt = Date.now();
      valido = true;
    };
    const alArrastrar = (e: PointerEvent) => {
      if (e.pointerType !== 'touch' || !valido) return;
      if (Math.abs(e.clientX - tx) > 12 || Math.abs(e.clientY - ty) > 12) valido = false;
    };
    const alCancelar = (e: PointerEvent) => {
      if (e.pointerType !== 'touch') return;
      valido = false;
    };
    const alSoltar = (e: PointerEvent) => {
      if (e.pointerType !== 'touch' || !valido) return;
      valido = false;
      if (Date.now() - tt > 500) return;
      const c = columnaEn(e.clientX);
      if (!c) return;
      if (fijada === c) {
        fijada = null;
        soltar(c);
        return;
      }
      if (fijada) soltar(fijada);
      fijada = c;
      frenar(c, () => {
        esperas.set(
          c,
          window.setTimeout(() => {
            if (fijada === c) {
              fijada = null;
              soltar(c);
            }
          }, ESPERA),
        );
      });
    };

    const refrescar = () => {
      construir();
      repartir();
    };
    refrescar();

    const reloj = window.setInterval(repartir, 500);
    window.addEventListener('resize', refrescar, { passive: true });
    window.addEventListener('orientationchange', refrescar, { passive: true });
    window.addEventListener('scroll', repartir, { passive: true });
    capa.addEventListener('pointermove', alMover);
    capa.addEventListener('pointerleave', alSalir);
    capa.addEventListener('pointerdown', alPulsar);
    capa.addEventListener('pointermove', alArrastrar);
    capa.addEventListener('pointercancel', alCancelar);
    capa.addEventListener('pointerup', alSoltar);

    return () => {
      window.clearInterval(reloj);
      window.removeEventListener('resize', refrescar);
      window.removeEventListener('orientationchange', refrescar);
      window.removeEventListener('scroll', repartir);
      capa.removeEventListener('pointermove', alMover);
      capa.removeEventListener('pointerleave', alSalir);
      capa.removeEventListener('pointerdown', alPulsar);
      capa.removeEventListener('pointermove', alArrastrar);
      capa.removeEventListener('pointercancel', alCancelar);
      capa.removeEventListener('pointerup', alSoltar);
      rampas.forEach((r) => cancelAnimationFrame(r));
      esperas.forEach((e) => window.clearTimeout(e));
      /* Al salir de la página no se deja ni un reproductor vivo. */
      columnas().forEach((col) => {
        col.innerHTML = '';
      });
    };
  }, []);

  return (
    <section className={`mv ${alterno ? 'mv--alterno' : ''}`}>
      <div className="mv-lienzo">
        <div className="mv-texto">
          <div className="mv-interior">
            <h2 className="font-serif">{titulo}</h2>
            <p className="font-sans">{subtitulo}</p>
          </div>
        </div>

        <div className="mv-rejilla" ref={rejillaRef}>
          <div className="mv-col mv-c1" aria-hidden />
          <div className="mv-col mv-c2" aria-hidden />
          <div className="mv-col mv-c3" aria-hidden />
          <div className="mv-capa" ref={capaRef} aria-hidden />
        </div>
      </div>
    </section>
  );
};
