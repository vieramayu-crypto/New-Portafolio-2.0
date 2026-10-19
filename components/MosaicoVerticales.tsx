import React, { useEffect, useRef } from 'react';
import './mosaico-verticales.css';
import { VIDEOS_VERTICALES } from '../data/videos';
import { MINIATURAS } from '../data/miniaturas';
import { publicVideo } from '../src/lib/content';

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

/** LAS PIEZAS, SERVIDAS POR NOSOTROS, NO POR EL PROVEEDOR.
 *
 *  Sólo entran las que tienen `archivo`, es decir las que existen como vídeo
 *  comprimido en `public/videos/`. Las demás no se pintan: más vale un hueco
 *  que un recuadro roto.
 *
 *  POR QUÉ NO EL REPRODUCTOR DEL PROVEEDOR. Un marco de otro dominio es una
 *  caja cerrada: no se le puede decir que empiece, que pare, ni preguntarle si
 *  está reproduciendo. Con seis a la vez eso se paga caro, y Mayurlin lo vio
 *  en su móvil: al volver al navegador después de un par de minutos, los clips
 *  salían en negro o congelados. El navegador le quita los decodificadores a
 *  una pestaña que pasa a segundo plano, y al volver los que no caben no los
 *  recuperan. Con vídeo nativo el código SÍ puede pausar el que no se ve y
 *  reanudarlo al volver, que es exactamente lo que faltaba. */
const PIEZAS = VIDEOS_VERTICALES.filter((v) => !v.provisional && v.archivo);

/** CADA COLUMNA LLEVA SU PROPIO JUEGO DE PIEZAS, Y ALTERNA ENTRE ELLAS.
 *
 *  Es lo único que garantiza verlas todas a la vez: si una columna sólo enseña
 *  las piezas 1 y 4, y la siguiente la 2 y la 5, en la franja visible de cada
 *  una siempre hay piezas distintas, caiga donde caiga el bucle. Repartidas al
 *  azar salían entre tres y seis en pantalla, porque la columna del medio gira
 *  al revés y se va desfasando de las otras dos.
 *
 *  EL REPARTO SE CALCULA, NO SE ESCRIBE A MANO. Antes eran dos listas fijas,
 *  una de pares y otra de tríos, que daban por hecho que las piezas eran seis.
 *  Al entrar la de Ritz pasaron a siete, y la última se habría quedado fuera
 *  sin que nadie se enterara. Ahora se reparten por turnos: con siete piezas y
 *  tres columnas salen 3, 2 y 2; con dos columnas, 4 y 3. */
const repartoPorColumna = (cuantas: number, piezas: number): number[][] =>
  Array.from({ length: cuantas }, (_, c) =>
    Array.from({ length: piezas }, (_, i) => i).filter((i) => i % cuantas === c),
  );

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

/** A QUÉ DISTANCIA SE PIDEN LAS PORTADAS. ES EL ARREGLO DE "LAS COLUMNAS
 *  TARDAN EN APARECER".
 *
 *  Mayurlin, en escritorio: "a las columnas les cuesta aparecer, es como si no
 *  terminaran de cargar y no se mostraran hasta que finalmente se cargan los
 *  vídeos, y después aparece de golpe". Medido a 12 Mbps, llegando al bloque:
 *  a los 600ms había NUEVE RECUADROS NEGROS, y el primer fotograma no entraba
 *  hasta los 2,6 segundos; el último, a los nueve.
 *
 *  La causa no era la red, era el orden. La portada se pedía en el mismo
 *  instante en que la celda se acercaba a 90px, o sea sin un milisegundo de
 *  margen, y encima salía a la red DETRÁS de dos vídeos de varios megas que ya
 *  estaban descargando. Y un `<video>` sin un solo fotograma se pinta negro.
 *
 *  Así que las portadas se piden cuando el bloque está a pantalla y media:
 *  son siete archivos de 3 a 28 KB, 110 en total, menos que una sola foto de
 *  la web. Para cuando se llega, están. Los vídeos siguen pidiéndose igual de
 *  tarde que antes: esto no adelanta ni un byte de vídeo. */
const ANTESALA = 1400;

/** CUÁNTOS VÍDEOS PUEDEN ESTAR DESCARGANDO A LA VEZ.
 *
 *  ESTE NÚMERO ES EL ARREGLO DE "LOS VÍDEOS SE QUEDAN COLGADOS". Antes cada
 *  celda pedía su archivo nada más montarse, así que doce descargas salían a
 *  la red a la vez y se ahogaban entre ellas: cada una avanzaba a un doceavo
 *  de la velocidad y ninguna juntaba búfer para empezar. Medido con la red a
 *  10 Mbps, que no es poca: DIEZ SEGUNDOS sin que arrancara ni uno, y doce
 *  recuadros negros esperando. Es justo lo que vio Mayurlin.
 *
 *  Ahora se pide de dos en dos, por orden de cercanía al centro de la
 *  pantalla, y las demás esperan su turno enseñando su portada, que pesa
 *  veinte veces menos. Dos y no uno porque con uno el mosaico tarda demasiado
 *  en llenarse; dos y no cuatro porque a partir de ahí vuelven a estorbarse. */
const DESCARGAS_A_LA_VEZ = 2;

/** QUÉ FORMATO PIDE ESTE NAVEGADOR, PREGUNTADO ANTES DE PEDIR NADA.
 *
 *  El respaldo por `error` funciona, pero es caro: el navegador se descarga
 *  medio mp4, descubre que no sabe decodificarlo, lo tira y empieza el webm de
 *  cero. Medido en el Chromium de este entorno, que no lleva H.264: CINCO
 *  SEGUNDOS tirados por pieza. `canPlayType` lo resuelve antes de gastar un
 *  byte. El respaldo por `error` se queda igualmente, por si el navegador
 *  dice que sí y luego no puede. */
const prefiereWebm = (): boolean => {
  if (typeof document === 'undefined') return false;
  const v = document.createElement('video');
  const mp4 = v.canPlayType('video/mp4; codecs="avc1.4d401f"');
  if (mp4 === 'probably' || mp4 === 'maybe') return false;
  return !!v.canPlayType('video/webm; codecs="vp9"');
};

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

    /* Una sola vez por montaje: no cambia mientras la pestaña viva. */
    const webm = prefiereWebm();

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
      /* Al cambiar de dos columnas a tres (o al revés) se tira todo y se
         vuelve a construir. Hay que SOLTAR los vídeos antes de vaciar el
         HTML: un `innerHTML = ''` se lleva los elementos pero deja al
         navegador con los decodificadores cogidos un rato largo. */
      if (cuantas) vaciar();
      cuantas = n;
      const reparto = repartoPorColumna(n, PIEZAS.length);
      columnas().forEach((col, ci) => {
        col.innerHTML = '';
        const lista = reparto[ci % reparto.length];
        if (!lista.length) return;
        const huecos = dos ? HUECOS_MOVIL : HUECOS_ESCRITORIO;
        for (let k = 0; k < huecos; k += 1) {
          const celda = document.createElement('div');
          celda.className = 'mv-celda';
          celda.dataset.pieza = String(lista[k % lista.length]);
          col.appendChild(celda);
        }
        Array.from(col.children).forEach((c) => col.appendChild(c.cloneNode(true)));
      });
    };

    /* ---------- montar y tirar reproductores por cercanía ---------- */

    /* `display: none` NO cuenta como fuera de pantalla: ocultar un iframe no
       impide que descargue. Por eso la columna escondida se vacía entera. */
    /* EL VÍDEO SE MONTA A MANO, NO CON `<source>` HIJOS.
       Es un fallo real ya visto en esta web, no una manía: si la fuente
       primaria empieza a descargar y falla al decodificar A MITAD, algunos
       navegadores disparan `error` en el `<video>` en vez de pasar a la
       siguiente `<source>`; el respaldo automático sólo vale en la elección
       inicial. Así que se pone el mp4 a mano y, si falla, se reintenta con el
       webm desde el manejador de error. Mismo arreglo que en
       `components/IntroLoader.tsx`. */
    /** LAS SIETE PORTADAS, PEDIDAS DE UNA VEZ Y UNA SOLA VEZ. Van por el mismo
     *  camino que cualquier foto: al ser las mismas direcciones que luego usa
     *  cada celda, la segunda vez salen de la caché del navegador sin tocar la
     *  red. Se dispara desde `repartir` cuando el bloque entra en `ANTESALA`,
     *  así que una visita que no baje hasta aquí no se descarga nada. */
    let portadasPedidas = false;
    let portadasListas = false;
    const pedirPortadas = () => {
      if (portadasPedidas) return;
      portadasPedidas = true;
      const conPortada = PIEZAS.filter((p) => p.archivo);
      let faltan = conPortada.length;
      if (!faltan) {
        portadasListas = true;
        return;
      }
      /* UN TOPE DE SEGURIDAD. Si una portada se pierde o el servidor tarda,
         los vídeos no se quedan esperando para siempre. */
      const tope = window.setTimeout(() => {
        portadasListas = true;
      }, 2500);
      const una = () => {
        faltan -= 1;
        if (faltan > 0) return;
        window.clearTimeout(tope);
        portadasListas = true;
      };
      conPortada.forEach((p) => {
        const img = new Image();
        img.addEventListener('load', una);
        img.addEventListener('error', una);
        img.src = publicVideo(`${p.archivo}.jpg`);
      });
    };

    /* Y SE PIDEN EN CUANTO LA PÁGINA TERMINA DE CARGAR, no sólo al llegar al
       bloque. En un refresco el navegador devuelve el desplazamiento donde
       estaba, así que se puede aterrizar aquí sin un metro de aviso; para
       entonces conviene que las fotos ya estén. Va detrás del `load` y en un
       hueco libre para no competir con la del hero, que es la que de verdad
       pesa. */
    const programarPortadas = () => {
      const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: object) => number };
      if (w.requestIdleCallback) w.requestIdleCallback(pedirPortadas, { timeout: 1500 });
      else window.setTimeout(pedirPortadas, 300);
    };
    if (document.readyState === 'complete') programarPortadas();
    else window.addEventListener('load', programarPortadas, { once: true });

    const pintar = (celda: HTMLDivElement) => {
      const pieza = PIEZAS[Number(celda.dataset.pieza) || 0];
      if (!pieza?.archivo) return;
      /* LA PORTADA VA DE FONDO DE LA CELDA, NO EN EL ATRIBUTO `poster`.
         Con `poster`, la foto y el vídeo son la misma caja: en cuanto el
         vídeo tiene su primer fotograma, la portada desaparece de golpe, y
         mientras no lo tiene el elemento se pinta NEGRO. De fondo, la foto es
         una capa aparte que está ahí desde el principio y no se va nunca; el
         vídeo nace invisible por encima y entra con un fundido de 0,45s
         cuando de verdad tiene algo que enseñar. Nunca hay un recuadro negro
         ni un salto. */
      /* DOS FONDOS, Y EL ORDEN IMPORTA: el primero va ENCIMA. Mientras la
         portada no está, se ve la miniatura de 12x21 que viaja dentro del
         paquete (`data/miniaturas.ts`), o sea el color de la escena sin
         pedirle nada a la red. El navegador hace el relevo solo, sin una
         línea de JavaScript: en cuanto la portada decodifica, tapa a la
         miniatura. */
      const mini = MINIATURAS[pieza.archivo];
      celda.style.backgroundImage = [
        `url("${publicVideo(`${pieza.archivo}.jpg`)}")`,
        mini ? `url("${mini}")` : null,
      ]
        .filter(Boolean)
        .join(', ');
      const v = document.createElement('video');
      v.muted = true;
      v.loop = true;
      v.autoplay = true;
      v.setAttribute('playsinline', '');
      v.setAttribute('aria-label', `Pieza vertical: ${pieza.hotel}`);
      v.dataset.pieza = celda.dataset.pieza || '0';
      /* SE MONTA SIN DIRECCIÓN. El vídeo nace con su portada puesta y sin
         pedir un solo byte; quien reparte las descargas es `encolar`. Así la
         celda se ve desde el primer momento como una foto en vez de como un
         agujero negro, y la red se dedica a los dos que de verdad tocan. */
      v.preload = 'none';
      /* `loadeddata` es el primer momento en que hay un fotograma de verdad.
         Antes de eso el elemento sigue a opacidad cero y lo que se ve es la
         portada de debajo. */
      v.addEventListener('loadeddata', () => {
        v.dataset.visto = '1';
      });
      v.dataset.respaldo = '0';
      v.addEventListener('error', () => {
        if (v.dataset.respaldo === '1' || !pieza.archivo) return;
        v.dataset.respaldo = '1';
        v.src = publicVideo(`${pieza.archivo}.${webm ? 'mp4' : 'webm'}`);
        v.load();
      });
      celda.appendChild(v);
    };

    /** ¿Está este vídeo descargando ahora mismo? Tiene dirección puesta pero
     *  todavía no hay suficiente para reproducir sin cortes. */
    const descargando = (v: HTMLVideoElement) => !!v.getAttribute('src') && v.readyState < 3;

    /** REPARTIR LAS DESCARGAS: las más cercanas al centro primero, y antes una
     *  pieza que no haya pedido nadie que la cuarta copia de la misma. Las
     *  copias salen casi gratis, porque para cuando les toca el archivo ya
     *  está en la caché del navegador. */
    const encolar = () => {
      /* LAS FOTOS PRIMERO, Y NO ES UNA PREFERENCIA: ES EL ORDEN.
         Medido a 12 Mbps: las portadas salían a la red 60ms ANTES que los dos
         vídeos y aun así llegaban 700ms DESPUÉS, porque un vídeo, una vez
         empezado, no suelta el ancho de banda. Resultado, nueve recuadros
         negros. Son 110 KB entre las siete: esperarlas retrasa el primer
         vídeo una décima y a cambio el mosaico se ve entero desde el primer
         momento. */
      if (!portadasListas) return;
      const centro = window.innerHeight / 2;
      const todos: HTMLVideoElement[] = Array.from(
        rejilla.querySelectorAll<HTMLVideoElement>('.mv-celda video'),
      );
      let enMarcha = todos.filter(descargando).length;
      if (enMarcha >= DESCARGAS_A_LA_VEZ) return;

      /* DOS CONJUNTOS DISTINTOS, Y LA DIFERENCIA IMPORTA.
         `bajando` son las piezas que están descargando AHORA: a ésas no se
         les pide otra copia, porque serían los mismos bytes dos veces.
         `yaPedidas` son las que ya tiene alguien, descargando o no, y sólo
         sirve para ordenar: primero una pieza que no esté en pantalla, luego
         las copias.
         LA PRIMERA VERSIÓN USABA UN SOLO CONJUNTO y dejaba fuera a las copias
         para siempre: la mitad de las celdas visibles se quedaban en su
         portada sin moverse nunca, que es justo lo que Mayurlin vio como
         vídeos colgados. */
      const bajando = new Set(todos.filter(descargando).map((v) => v.dataset.pieza));
      const yaPedidas = new Set(
        todos.filter((v) => v.getAttribute('src')).map((v) => v.dataset.pieza),
      );
      const candidatos = todos
        .filter((v) => !v.getAttribute('src'))
        .map((v) => {
          const r = v.getBoundingClientRect();
          /* El vídeo se pide a `CERCA` de entrar, igual que antes. Lo que se
             adelantó es la PORTADA, no el vídeo: ahora todas las celdas
             tienen su elemento montado, así que aquí hay que volver a mirar
             la distancia, que antes la miraba `repartir` al pintar. */
          return {
            v,
            fuera: Math.max(0, Math.max(r.top - window.innerHeight, -r.bottom)),
            nueva: !yaPedidas.has(v.dataset.pieza),
            dist: Math.abs(r.top + r.height / 2 - centro),
          };
        })
        .filter((c) => c.fuera <= CERCA)
        .sort((a, b) => (a.nueva === b.nueva ? a.dist - b.dist : a.nueva ? -1 : 1));

      for (const c of candidatos) {
        if (enMarcha >= DESCARGAS_A_LA_VEZ) break;
        const pieza = PIEZAS[Number(c.v.dataset.pieza) || 0];
        if (!pieza?.archivo) continue;
        /* LA MISMA PIEZA NO SE PIDE DOS VECES A LA VEZ. Hay varias celdas por
           pieza, y sin esto dos copias salían juntas a por el mismo archivo:
           el doble de datos para el mismo fotograma. Se comprueba aquí dentro
           y no al ordenar, porque la lista se calcula antes del bucle. */
        if (bajando.has(c.v.dataset.pieza)) continue;
        c.v.preload = 'auto';
        c.v.src = publicVideo(`${pieza.archivo}.${webm ? 'webm' : 'mp4'}`);
        c.v.load();
        bajando.add(c.v.dataset.pieza);
        enMarcha += 1;
      }
    };

    /* SOLTAR EL DECODIFICADOR SIN PERDER LA CELDA: parar, vaciar la dirección
       y pedir una carga en vacío. Un vídeo pausado sigue teniendo cogido su
       decodificador; uno sin dirección, no. El ELEMENTO se queda donde está,
       otra vez invisible, y lo que se ve vuelve a ser la portada de fondo.
       Antes se quitaba del DOM, y volver a la celda costaba repintarlo todo
       desde cero: ése era el recuadro negro. */
    const soltarVideo = (v: HTMLVideoElement) => {
      v.pause();
      v.removeAttribute('src');
      delete v.dataset.visto;
      v.load();
    };

    /* Esto sí lo saca del documento. Sólo cuando el bloque queda lejos de
       verdad, o al desmontar el componente. */
    const quitarVideo = (celda: HTMLDivElement, v: HTMLVideoElement) => {
      soltarVideo(v);
      celda.removeChild(v);
    };

    const cadaVideo = (hacer: (celda: HTMLDivElement, v: HTMLVideoElement) => void) => {
      columnas().forEach((col) => {
        col.querySelectorAll<HTMLDivElement>('.mv-celda').forEach((celda) => {
          const v = celda.firstElementChild as HTMLVideoElement | null;
          if (v?.tagName === 'VIDEO') hacer(celda, v as HTMLVideoElement);
        });
      });
    };

    /** Ni un decodificador vivo, pero las celdas siguen enseñando su foto. */
    const vaciar = () => cadaVideo((_, v) => soltarVideo(v));
    /** Ni un elemento. */
    const desmontar = () => cadaVideo(quitarVideo);

    const repartir = () => {
      const alto = window.innerHeight;

      /* CON LA PESTAÑA EN SEGUNDO PLANO NO VIVE NINGUNO. No basta con
         pausarlos: un vídeo pausado sigue teniendo su decodificador cogido, y
         el navegador se los quita a las pestañas de atrás precisamente porque
         son un recurso escaso. Soltarlos nosotros y volver a montarlos al
         regresar es lo que evita el negro que vio Mayurlin. Los archivos ya
         están en la caché del navegador, así que volver no cuesta descarga.
         Esto tiene que estar DENTRO de `repartir`, no sólo en el manejador de
         visibilidad: el reloj de medio segundo los remontaría igualmente. */
      if (document.hidden) {
        vaciar();
        return;
      }

      /* NI UN REPRODUCTOR HASTA QUE EL BLOQUE ESTÁ LLEGANDO. Sin esto, con la
         página recién abierta ya había CUATRO vivos: el bloque es la tercera
         sección y sus primeras celdas caen a menos de `CERCA` del borde de
         abajo. Cuatro marcos descargando vídeo mientras el móvil todavía trae
         la foto del hero es exactamente lo que volvía lenta la web. Medido
         con esta puerta: cero al abrir y cero al dejar el bloque atrás. */
      const marco = rejilla.getBoundingClientRect();
      if (marco.top - alto > ANTESALA || marco.bottom < -ANTESALA) {
        desmontar();
        return;
      }

      /* EL BLOQUE ESTÁ LLEGANDO: las portadas salen ya, y cada celda se monta
         con la suya puesta. Montar la celda no cuesta red (el `<video>` nace
         con `preload="none"` y sin dirección), así que no hay motivo para
         esperar a los 90px como antes: esperar era justo lo que dejaba la
         columna en negro. La red de vídeo la sigue repartiendo `encolar`. */
      pedirPortadas();

      /* LA PUERTA DEL VÍDEO ES LA DE SIEMPRE Y NO SE MUEVE, pero hay que
         mirar el BLOQUE, no sólo cada celda. Las columnas van en posición
         absoluta con desfases negativos, así que el rectángulo de una celda
         puede caer dentro de la pantalla mientras el bloque está 700px por
         debajo; la máscara la tapa, pero `getBoundingClientRect` no lo sabe.
         Medido sin esta puerta: tres celdas se declaraban a la vista y DOS
         VÍDEOS salían a la red nada más abrir la página. */
      const bloqueCerca = marco.top - alto <= 200 && marco.bottom >= -200;

      columnas().forEach((col) => {
        const oculta = getComputedStyle(col).display === 'none';
        col.querySelectorAll<HTMLDivElement>('.mv-celda').forEach((celda) => {
          const puesto = celda.firstElementChild as HTMLVideoElement | null;
          const tiene = puesto?.tagName === 'VIDEO';
          if (oculta) {
            if (tiene && puesto) quitarVideo(celda, puesto);
            return;
          }
          if (!tiene) {
            pintar(celda);
            return;
          }
          if (!puesto) return;
          const r = celda.getBoundingClientRect();
          const fuera = Math.max(0, Math.max(r.top - alto, -r.bottom));
          if (fuera > LEJOS || !bloqueCerca) {
            soltarVideo(puesto);
            return;
          }
          /* SÓLO SUENA LO QUE SE VE DE VERDAD: MEDIA CELDA, NO UN DEDO.
             Antes bastaba con que la celda ROZARA la pantalla, y eso dejaba
             diez vídeos descodificando a la vez en escritorio. Sumados a los
             dos marcos del proveedor que puede haber cerca, son doce flujos
             de vídeo peleándose por los decodificadores del navegador, que
             son pocos y no se reparten: es lo que Mayurlin describe como
             "un fallo aleatorio", unos vídeos arrancan y otros no.

             Y no cuesta nada visualmente, que es lo bonito: las celdas que
             sólo asoman un poco caen JUSTO DENTRO del desvanecido de los
             bordes, así que están medio apagadas de todas formas. */
          const visible = Math.min(r.bottom, alto) - Math.max(r.top, 0);
          const medioDentro = visible >= r.height * 0.5;
          const aLaVista = !document.hidden && bloqueCerca && fuera === 0 && medioDentro;
          /* `readyState < 3` es "todavía no hay con qué reproducir sin
             cortes". Pedirle `play()` ahí no acelera nada y además lo deja
             marcado como reproduciendo sin que avance un fotograma, que es
             precisamente lo que parecía colgado. */
          if (aLaVista && puesto.paused && puesto.readyState >= 3) {
            const intento = puesto.play();
            if (intento) intento.catch(() => undefined);
          } else if (!aLaVista && !puesto.paused) {
            puesto.pause();
          }
        });
      });

      if (bloqueCerca) encolar();
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

    /* EL REGRESO A LA PESTAÑA, QUE ERA EL FALLO QUE ELLA VIO.
       Al irse, se para todo y se sueltan los decodificadores; al volver, se
       reparte otra vez y los que están a la vista vuelven a reproducir. Es lo
       que no se podía hacer con los marcos del proveedor. */
    const alCambiarVisibilidad = () => repartir();

    const reloj = window.setInterval(repartir, 500);
    document.addEventListener('visibilitychange', alCambiarVisibilidad);
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
      document.removeEventListener('visibilitychange', alCambiarVisibilidad);
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
      vaciar();
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
          {/* Las dos capas del desvanecido de los bordes. Van por encima de
              las columnas y por debajo de `mv-capa`, que es la que recoge el
              ratón. Ver `.mv-velo` en el CSS: antes esto era una máscara y
              era lo que impedía componer la animación. */}
          <div className="mv-velo mv-velo--arriba" aria-hidden />
          <div className="mv-velo mv-velo--abajo" aria-hidden />
          <div className="mv-capa" ref={capaRef} aria-hidden />
        </div>
      </div>
    </section>
  );
};
