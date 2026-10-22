import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import mayuLogo from '../src/assets/images/mayu-logo-black.png';
import { HERO_PHOTO, HERO_PHOTO_MOBILE } from '../data/media';
import { useIdioma } from '../src/lib/idioma';
import { ruta } from '../src/lib/rutas';
import { COPY_MEDIA_KIT, CORREO, urlMediaKit } from '../src/lib/mediaKit';
import { useEsMovil } from './VideoNube';
import { SelectorIdioma } from './SelectorIdioma';

/** LA PÁGINA DEL MEDIA KIT: la foto del hero y una sola caja de cristal.
 *
 *  LA PRIMERA VERSIÓN ERA UNA PÁGINA DE TEXTO SOBRE MARFIL, con el documento
 *  incrustado debajo en una banda oscura. Mayurlin: *"la presentación del PDF
 *  está bastante pobre. Como mínimo debe tener un diseño bonito... puede ser
 *  la caja de cristal que usamos para el formulario, con una animación de
 *  entrada hacia arriba y con poco texto, donde se pueda acceder al documento
 *  de forma más fácil"*. Tenía razón: era una pantalla de aviso, no la portada
 *  de un media kit.
 *
 *  ASÍ QUE NO SE INVENTA NADA NUEVO, se usan dos piezas que ya existen y que
 *  son lo mejor que tiene la web: la fotografía del hero y el cristal del
 *  formulario (`mt-glass mt-glass-light`). Es la misma imagen que ve quien
 *  entra por la portada, así que el enlace del media kit se reconoce como
 *  parte de la misma casa.
 *
 *  EL CRISTAL NECESITA ALGO DETRÁS. `backdrop-filter` desenfoca lo que hay
 *  debajo: sobre el marfil plano de antes no habría desenfocado nada y la caja
 *  se vería como un rectángulo gris. Sobre la fotografía sí es cristal.
 *
 *  Y SE FUE EL VISOR INCRUSTADO. El navegador lo pinta con su propio fondo
 *  gris oscuro y su barra de herramientas, y no se puede tocar ni un píxel
 *  desde fuera: era justo lo que ella llamó pobre. "Abrir en el navegador"
 *  lleva al mismo visor pero a pantalla completa, que es donde ese visor sí
 *  funciona bien, y además es lo único que vale en el iPhone, donde Safari no
 *  dibuja un PDF dentro de una página.
 *
 *  SE COMPRUEBA QUE EL ARCHIVO ESTÉ antes de enseñar los botones: si el PDF no
 *  está subido, dos botones que llevan a un 404 son peor que una línea
 *  diciendo que se está actualizando. */
export const MediaKit: React.FC = () => {
  const { idioma } = useIdioma();
  const esMovil = useEsMovil();
  const copy = COPY_MEDIA_KIT[idioma];
  const pdf = urlMediaKit(idioma);
  const [estado, setEstado] = useState<'buscando' | 'esta' | 'falta'>('buscando');

  /* `noindex, nofollow` MIENTRAS SE MIRA, y la etiqueta de siempre al salir.
     El `index, follow` vive en `index.html` y lo comparten todas las páginas,
     así que aquí se cambia el valor y se devuelve al desmontar. Que esta
     página acabe en Google sería lo contrario de lo que se pidió. */
  useEffect(() => {
    const meta = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    const antes = meta?.content ?? null;
    if (meta) meta.content = 'noindex, nofollow';
    return () => {
      if (meta && antes !== null) meta.content = antes;
    };
  }, []);

  useEffect(() => {
    let vivo = true;
    setEstado('buscando');
    fetch(pdf, { method: 'HEAD' })
      .then((r) => {
        if (vivo) setEstado(r.ok ? 'esta' : 'falta');
      })
      .catch(() => {
        if (vivo) setEstado('falta');
      });
    return () => {
      vivo = false;
    };
  }, [pdf]);

  return (
    <section className="relative min-h-[100dvh] overflow-hidden bg-[#1a1918]">
      {/* LA FOTO VA SIN FILTROS, que es la regla que puso ella para el hero y
          vale igual aquí: es su graduación. Una sola copia, elegida por ancho
          de pantalla, nunca las dos con `hidden`. */}
      <img
        src={esMovil ? HERO_PHOTO_MOBILE : HERO_PHOTO}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover object-[50%_65%] md:object-[50%_66%]"
      />

      <div className="relative z-10 flex min-h-[100dvh] items-center justify-center px-5 py-14 md:px-10 md:py-16">
        {/* LA ENTRADA ES HACIA ARRIBA, como pidió. Mismo muelle y misma curva
            que el panel del formulario, para que sea el mismo gesto y no dos
            parecidos; sólo el recorrido es mayor (34px contra 12), porque aquí
            la caja llega a una página vacía y no sobre contenido que ya está. */}
        <motion.div
          initial={{ opacity: 0, y: 34 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-glass mt-glass-light relative w-full max-w-[460px] overflow-hidden rounded-lg px-7 py-11 text-center text-[#1a1918] md:max-w-[520px] md:rounded-[10px] md:px-12 md:py-14"
        >
          {/* EL MISMO SELECTOR DE IDIOMA QUE EL RESTO DE LA WEB, y aquí hace
              dos cosas a la vez. Mayurlin: *"así no tengo que manejar dos
              enlaces, sino un solo enlace con la capacidad de cambiar de
              idioma la interfaz y el archivo que hay de fondo"*. Al pulsarlo
              cambia la dirección, el texto Y el PDF, porque el archivo sale
              del idioma activo. El trabajo de verdad no está aquí sino en
              `traducirRuta` (`src/lib/rutas.ts`): sin ella, pulsar EN desde
              el media kit llevaba a la portada inglesa.

              VA DENTRO DEL CRISTAL, no flotando sobre la foto. Se probó
              arriba a la derecha de la pantalla, en su propia píldora, y las
              dos letras desaparecían: ese rincón cae sobre el olivo, que es
              la zona oscura del encuadre, y el cristal es translúcido, así
              que la tinta sobre una foto oscura no se lee. Aquí el fondo lo
              pone la propia caja y siempre es claro. */}
          {/* EL `position` VIVE EN `.mt-kit-idioma` (en `index.css`) y no en una
              utilidad de Tailwind: `.mt-glass > *` declara `relative` a todos
              los hijos del cristal y esa hoja va después de las utilidades,
              así que un `absolute` aquí no se aplicaba. Es la misma trampa
              que ya costó una ronda con el velo del hero. */}
          <div className="mt-kit-idioma">
            <SelectorIdioma />
          </div>

          <img src={mayuLogo} alt="Mayu Travel" className="mx-auto h-[22px] w-auto md:h-[26px]" />

          <p className="mt-8 font-sans text-[10px] uppercase tracking-[0.3em] text-[#1a1918]/60 md:mt-9 md:text-[11px]">
            {copy.rotulo}
          </p>

          <h1 className="mx-auto mt-4 max-w-[22ch] font-serif text-[1.75rem] leading-[1.16] md:mt-5 md:max-w-[20ch] md:text-[2.15rem]">
            {copy.titular}
          </h1>

          {estado === 'falta' ? (
            <p className="mx-auto mt-7 max-w-[34ch] font-sans text-[13px] leading-relaxed text-[#1a1918]/70">
              {copy.pendiente}
            </p>
          ) : (
            <div className="mt-9 flex flex-col items-center gap-[18px] md:mt-10">
              {/* El botón de la casa, sin inventar otro tamaño, y a todo el
                  ancho de la caja: es a lo que se viene. */}
              <a
                href={pdf}
                download
                className="w-full bg-[#1a1918] px-8 py-4 font-sans text-[12px] font-medium uppercase tracking-[0.22em] text-[#f5f3ed] transition-colors hover:bg-[#5a5854] md:py-[1.15rem] md:text-xs"
              >
                {copy.descargar}
              </a>
              <a
                href={pdf}
                target="_blank"
                rel="noopener noreferrer"
                className="border-b border-[#1a1918]/45 pb-[3px] font-sans text-[11px] uppercase tracking-[0.22em] text-[#1a1918]/80 transition-colors hover:border-[#1a1918] hover:text-[#1a1918] md:text-[12px]"
              >
                {copy.abrir}
              </a>
            </div>
          )}

          {/* LA ÚNICA SALIDA, y hacia la web: del media kit al portafolio, no al
              revés. Dentro del cristal y no sobre la foto, que es donde se lee
              sin pelear con lo que haya debajo. */}
          <div className="mt-10 border-t border-[#1a1918]/15 pt-6 md:mt-11">
            <a
              href={`mailto:${CORREO}`}
              className="font-sans text-[12px] text-[#1a1918]/65 transition-colors hover:text-[#1a1918]"
            >
              {CORREO}
            </a>
            <span aria-hidden className="mx-3 text-[#1a1918]/25">
              ·
            </span>
            <Link
              to={ruta(idioma, 'inicio')}
              className="font-sans text-[12px] text-[#1a1918]/65 transition-colors hover:text-[#1a1918]"
            >
              {copy.portafolio}
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
