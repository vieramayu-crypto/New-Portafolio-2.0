import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { idiomaDeRuta, traducirRuta } from './rutas';

/** EL IDIOMA DE LA WEB: español por defecto, inglés a un clic.
 *
 *  Mayurlin trabaja en dos mundos y este portafolio va a hoteles de lujo de
 *  cinco países, así que el inglés no es un extra: es la mitad del trabajo.
 *  El interruptor vive al lado del menú, en móvil y en escritorio, y sólo
 *  enseña el idioma activo.
 *
 *  EL IDIOMA ES LA DIRECCIÓN, y eso es lo que cambió aquí.
 *
 *  Antes vivía en `localStorage`: se recordaba entre visitas, pero era
 *  invisible desde fuera. Dos personas abriendo el mismo enlace veían idiomas
 *  distintos, no se podía mandar por correo "la versión inglesa", y sobre todo
 *  Google no sabía que existía. Una versión que el buscador no puede ver ni
 *  enlazar ni declarar con `hreflang` es, para el buscador, una versión que no
 *  está.
 *
 *  Ahora la dirección manda: `/proyectos` es español y `/en/projects` es
 *  inglés, siempre, para todo el mundo. Cambiar de idioma es navegar a la
 *  misma página en el otro, así que el botón de atrás del navegador también
 *  deshace el cambio, que es lo que la gente espera.
 *
 *  SE QUITÓ EL RECUERDO ENTRE VISITAS a propósito. Ya no hace falta: quien
 *  entra en inglés guarda un enlace que YA es inglés. Y mantenerlo sería peor,
 *  porque una redirección automática al abrir la portada acaba enseñándole a
 *  alguien un idioma distinto del que le mandaron.
 *
 *  Y CAMBIA EL `lang` DEL DOCUMENTO, que no es decorativo: de ahí sacan el
 *  idioma los lectores de pantalla para elegir la voz, y Google para saber a
 *  quién enseñar cada versión.
 */

export type Idioma = 'es' | 'en';

interface ContextoIdioma {
  idioma: Idioma;
  setIdioma: (i: Idioma) => void;
}

const Contexto = createContext<ContextoIdioma>({ idioma: 'es', setIdioma: () => {} });

export const IdiomaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const idioma = idiomaDeRuta(pathname);

  useEffect(() => {
    if (typeof document !== 'undefined') document.documentElement.lang = idioma;
  }, [idioma]);

  const valor = useMemo<ContextoIdioma>(
    () => ({
      idioma,
      setIdioma: (nuevo: Idioma) => {
        if (nuevo === idioma) return;
        navigate(traducirRuta(pathname, nuevo));
      },
    }),
    [idioma, pathname, navigate]
  );

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
};

export function useIdioma(): ContextoIdioma {
  return useContext(Contexto);
}

/** Elige entre dos versiones de lo mismo. Es el atajo para los textos sueltos
 *  que viven dentro de un componente y no pasan por el diccionario. */
export function segun<T>(idioma: Idioma, es: T, en: T): T {
  return idioma === 'en' ? en : es;
}
