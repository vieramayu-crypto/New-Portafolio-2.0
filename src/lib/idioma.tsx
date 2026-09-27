import React, { createContext, useContext, useEffect, useState } from 'react';

/** EL IDIOMA DE LA WEB: español por defecto, inglés a un clic.
 *
 *  Mayurlin trabaja en dos mundos y este portafolio va a hoteles de lujo de
 *  cinco países, así que el inglés no es un extra: es la mitad del trabajo.
 *  El interruptor vive al lado del menú, en móvil y en escritorio, con las
 *  dos abreviaturas (ES / EN) y nada más.
 *
 *  SE RECUERDA ENTRE VISITAS. Quien entra en inglés y vuelve una semana
 *  después sigue en inglés; si no, cada visita le devolvería al español y la
 *  web parecería rota.
 *
 *  Y CAMBIA EL `lang` DEL DOCUMENTO, que no es decorativo: de ahí sacan el
 *  idioma los lectores de pantalla para elegir la voz, y Google para saber a
 *  quién enseñar cada versión.
 */

export type Idioma = 'es' | 'en';

const CLAVE = 'mt-idioma';

interface ContextoIdioma {
  idioma: Idioma;
  setIdioma: (i: Idioma) => void;
}

const Contexto = createContext<ContextoIdioma>({ idioma: 'es', setIdioma: () => {} });

function leerGuardado(): Idioma {
  if (typeof window === 'undefined') return 'es';
  try {
    const v = window.localStorage.getItem(CLAVE);
    return v === 'en' ? 'en' : 'es';
  } catch {
    // Navegación privada o almacenamiento bloqueado: se sigue en español y ya.
    return 'es';
  }
}

export const IdiomaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [idioma, setIdiomaEstado] = useState<Idioma>(leerGuardado);

  useEffect(() => {
    if (typeof document !== 'undefined') document.documentElement.lang = idioma;
    try {
      window.localStorage.setItem(CLAVE, idioma);
    } catch {
      /* si no se puede guardar, el idioma dura lo que dure la visita */
    }
  }, [idioma]);

  return (
    <Contexto.Provider value={{ idioma, setIdioma: setIdiomaEstado }}>{children}</Contexto.Provider>
  );
};

export function useIdioma(): ContextoIdioma {
  return useContext(Contexto);
}

/** Elige entre dos versiones de lo mismo. Es el atajo para los textos sueltos
 *  que viven dentro de un componente y no pasan por el diccionario. */
export function segun<T>(idioma: Idioma, es: T, en: T): T {
  return idioma === 'en' ? en : es;
}
