import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import mayuLogo from '../src/assets/images/mayu-logo-black.png';
import { useIdioma } from '../src/lib/idioma';
import { ruta } from '../src/lib/rutas';
import { COPY_MEDIA_KIT, CORREO, urlMediaKit } from '../src/lib/mediaKit';
import { useEsMovil } from './VideoNube';

/** LA PÁGINA DEL MEDIA KIT. Una sola pantalla y el documento debajo.
 *
 *  Va suelta: sin cabecera, sin menú y sin pie. No es una sección más de la
 *  web, es lo que se abre cuando Mayurlin manda un enlace a una agencia, y
 *  cuanto menos haya alrededor del documento, mejor. La única salida es el
 *  enlace al portafolio del pie, que es el sentido que ella pidió: del media
 *  kit a la web, nunca al revés.
 *
 *  EL VISOR SÓLO EN ESCRITORIO, y no es pereza. Safari de iPhone no dibuja un
 *  PDF dentro de un marco: deja la primera página congelada, o un recuadro
 *  gris. Así que en móvil se enseñan las dos acciones de verdad (descargar y
 *  abrir en el navegador, donde el teléfono usa su propio visor, que funciona
 *  bien) y nada más.
 *
 *  Y SE COMPRUEBA QUE EL ARCHIVO ESTÉ antes de enseñar nada. Si el PDF todavía
 *  no se ha subido, un marco vacío enseñaría el 404 del servidor dentro de la
 *  página, que es lo peor que puede ver una agencia. En su lugar sale una
 *  línea diciendo que se está actualizando, con el correo al lado. */
export const MediaKit: React.FC = () => {
  const { idioma } = useIdioma();
  const esMovil = useEsMovil();
  const copy = COPY_MEDIA_KIT[idioma];
  const pdf = urlMediaKit(idioma);
  const [estado, setEstado] = useState<'buscando' | 'esta' | 'falta'>('buscando');

  /* `noindex, nofollow` MIENTRAS SE MIRA, y la etiqueta de siempre al salir.
     El `index, follow` vive en `index.html` y lo comparten todas las páginas,
     así que aquí se cambia el valor y se devuelve al desmontar. Que esta
     página acabe en Google sería exactamente lo contrario de lo que se pidió. */
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
    <div className="min-h-screen bg-[#fbfaf6] px-6 pb-16 pt-14 text-[#1a1918] md:px-10 md:pb-24 md:pt-20">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-[760px] text-center"
      >
        <img src={mayuLogo} alt="Mayu Travel" className="mx-auto h-[22px] w-auto md:h-[26px]" />

        <p className="mt-10 font-sans text-[10px] uppercase tracking-[0.3em] text-[#1a1918]/55 md:mt-12 md:text-[11px]">
          {copy.rotulo}
        </p>

        <h1 className="mx-auto mt-5 max-w-[19ch] font-serif text-[2rem] leading-[1.14] md:mt-6 md:max-w-[27ch] md:text-[2.9rem]">
          {copy.titular}
        </h1>

        <p className="mx-auto mt-5 max-w-[46ch] font-sans text-[15px] leading-relaxed text-[#1a1918]/70 md:mt-6 md:text-base">
          {copy.linea}
        </p>

        {estado === 'falta' ? (
          <p className="mx-auto mt-10 max-w-[44ch] font-sans text-[13px] leading-relaxed text-[#1a1918]/60 md:mt-12">
            {copy.pendiente}{' '}
            <a href={`mailto:${CORREO}`} className="border-b border-[#1a1918]/40 pb-[2px] text-[#1a1918] transition-colors hover:border-[#1a1918]">
              {CORREO}
            </a>
          </p>
        ) : (
          <div className="mt-10 flex flex-col items-center gap-5 md:mt-12">
            {/* El botón de la casa, sin inventar otro tamaño. Un solo CTA en
                el bloque: descargar. "Abrir en el navegador" va debajo como
                enlace fino, que es lo que hace falta en el móvil. */}
            <a
              href={pdf}
              download
              className="bg-[#1a1918] px-8 py-4 font-sans text-[12px] font-medium uppercase tracking-[0.22em] text-[#f5f3ed] transition-colors hover:bg-[#5a5854] md:px-10 md:py-[1.15rem] md:text-xs"
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
      </motion.div>

      {/* EL DOCUMENTO, a la vista y sin tener que descargar nada.
          LA BANDA OSCURA NO ES DECORACIÓN, es lo que hace que esto no parezca
          un error. El visor de PDF lo pinta el navegador dentro del marco, con
          su propio fondo gris oscuro y su barra de herramientas, y desde fuera
          no se puede cambiar ni un píxel: sobre el marfil se veía como un
          ladrillo negro caído en mitad de la página. Metido en una banda
          `#1a1918` a sangre, que es la tinta de la casa y el mismo fondo que
          usan los bloques de vídeo, el gris del visor se lee como parte del
          diseño.

          Alto en vh porque un PDF no tiene una proporción que se pueda calcular
          desde fuera: son muchas páginas y el visor las apila. Y `#view=FitH`
          para que abra encajado al ancho en la primera página en vez de al
          tamaño que le parezca. */}
      {estado === 'esta' && !esMovil && (
        <div className="relative left-1/2 right-1/2 mt-16 -mx-[50vw] w-screen bg-[#1a1918] px-6 py-10 md:mt-20 md:px-10 md:py-14">
          <iframe
            src={`${pdf}#view=FitH`}
            title={copy.rotulo}
            className="mx-auto block h-[80vh] w-full max-w-[1100px] border-0"
          />
        </div>
      )}

      {/* LA ÚNICA SALIDA, y hacia la web. Discreta, al pie, para que no compita
          con el botón de descargar: quien abre esto viene al documento. */}
      <div className="mx-auto mt-14 max-w-[760px] border-t border-[#1a1918]/12 pt-8 text-center md:mt-16 md:pt-10">
        <a
          href={`mailto:${CORREO}`}
          className="font-sans text-[12px] text-[#1a1918]/65 transition-colors hover:text-[#1a1918] md:text-[13px]"
        >
          {CORREO}
        </a>
        <span aria-hidden className="mx-3 text-[#1a1918]/25">·</span>
        <Link
          to={ruta(idioma, 'inicio')}
          className="font-sans text-[12px] text-[#1a1918]/65 transition-colors hover:text-[#1a1918] md:text-[13px]"
        >
          {copy.portafolio}
        </Link>
      </div>
    </div>
  );
};
