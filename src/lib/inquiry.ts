/** Entrega de la solicitud.
 *
 *  El sitio es estático y no tiene servidor propio, así que el formulario se
 *  entrega a Web3Forms, que lo reenvía al correo de Mayurlin. La clave de
 *  acceso va a la vista en el código del navegador: es así por diseño, no es
 *  una contraseña de la cuenta, sólo identifica a qué formulario pertenece el
 *  envío, y se puede regenerar desde su panel.
 *
 *  Si el envío falla por lo que sea -- sin red, el formulario restringido a
 *  otro dominio, el servicio caído -- se cae al `mailto:` de siempre, que abre
 *  el correo del visitante con todo escrito. Así no se pierde ninguna consulta
 *  mientras el dominio definitivo no esté puesto.
 */

import type { Idioma } from './idioma';
import { texto } from './textos';

const WEB3FORMS_KEY = '9b7fed74-124f-416b-ad48-57237c33b3f7';
const WEB3FORMS_URL = 'https://api.web3forms.com/submit';

export interface InquiryFields {
  name: string;
  email: string;
  propertyName: string;
  /** Opcional y hoy sin usar: el formulario único no pide una fecha aparte, las
   *  fechas se cuentan dentro del proyecto. Se mantiene el campo porque el
   *  cuerpo del correo ya sabe colocarlo si algún día vuelve a hacer falta. */
  availabilityDate?: string;
  phone?: string;
  location?: string;
  /** Instagram o web de la propiedad, en un solo campo: quien contesta va a
   *  mirar una cosa o la otra, y pedir las dos por separado es una casilla
   *  más que rellenar sin ganar nada. */
  link?: string;
  /** CLAVE del diccionario (`alcanceFotoVideo`), no el texto que se ve.
   *
   *  Guardaba el texto ya traducido, y eso rompía el formulario al cambiar de
   *  idioma: el estado conservaba "Fotografía y vídeo" mientras la lista ya
   *  mostraba opciones inglesas, así que la selección desaparecía de la vista
   *  y el correo salía mezclando rótulos ingleses con respuestas españolas.
   *  Con la clave, la elección sobrevive al cambio y se traduce al redactar. */
  scope?: string;
  /** En qué punto está el proyecto, también por clave (`etapaAprobado`).
   *  Sustituye al tramo de presupuesto: el formulario ya no pregunta cifras. */
  stage?: string;
  message?: string;
}

/** El correo se redacta en el idioma en el que el visitante rellenó el
 *  formulario. Quien escribe desde la web inglesa ve abrirse un correo en
 *  inglés, no uno en español con sus datos dentro. Mayurlin lee los dos. */
export function buildInquirySubject(f: InquiryFields, idioma: Idioma = 'es'): string {
  if (idioma === 'en') {
    const property = f.propertyName.trim() || 'a new property';
    return `Availability enquiry: ${property}`;
  }
  const property = f.propertyName.trim() || 'nueva propiedad';
  return `Consulta de disponibilidad: ${property}`;
}

const ROTULOS = {
  es: {
    nombre: 'Nombre',
    email: 'Email',
    telefono: 'Teléfono',
    propiedad: 'Propiedad',
    ubicacion: 'Ubicación',
    enlace: 'Instagram o web',
    servicio: 'Servicio',
    estado: 'Estado del proyecto',
    fechas: 'Fechas en consideración',
    detalles: 'Detalles del proyecto:',
  },
  en: {
    nombre: 'Name',
    email: 'Email',
    telefono: 'Phone',
    propiedad: 'Property',
    ubicacion: 'Location',
    enlace: 'Instagram or website',
    servicio: 'Service',
    estado: 'Project status',
    fechas: 'Dates under consideration',
    detalles: 'Project details:',
  },
} as const;

export function buildInquiryBody(f: InquiryFields, idioma: Idioma = 'es'): string {
  const r = ROTULOS[idioma === 'en' ? 'en' : 'es'];
  const lines: string[] = [
    `${r.nombre}: ${f.name.trim()}`,
    `${r.email}: ${f.email.trim()}`,
  ];
  if (f.phone?.trim()) lines.push(`${r.telefono}: ${f.phone.trim()}`);
  lines.push(`${r.propiedad}: ${f.propertyName.trim()}`);
  if (f.location?.trim()) lines.push(`${r.ubicacion}: ${f.location.trim()}`);
  if (f.link?.trim()) lines.push(`${r.enlace}: ${f.link.trim()}`);
  // Las dos listas viajan como clave y se traducen aquí, al idioma en el que
  // el visitante rellenó el formulario. `texto` devuelve la propia clave si no
  // la encuentra, así que un valor viejo nunca deja la línea vacía.
  if (f.scope?.trim()) lines.push(`${r.servicio}: ${texto(idioma, f.scope.trim())}`);
  if (f.stage?.trim()) lines.push(`${r.estado}: ${texto(idioma, f.stage.trim())}`);
  if (f.availabilityDate?.trim()) lines.push(`${r.fechas}: ${f.availabilityDate.trim()}`);
  if (f.message?.trim()) lines.push('', r.detalles, f.message.trim());
  return lines.join('\n');
}

export function buildInquiryMailto(to: string, f: InquiryFields, idioma: Idioma = 'es'): string {
  return `mailto:${to}?subject=${encodeURIComponent(
    buildInquirySubject(f, idioma)
  )}&body=${encodeURIComponent(buildInquiryBody(f, idioma))}`;
}

export type InquiryOutcome = 'enviado' | 'enviado-sin-adjunto' | 'correo';

/** Entrega la consulta. Devuelve por qué vía se fue, para poder decírselo al
 *  visitante sin mentirle. */
export async function sendInquiry(
  to: string,
  f: InquiryFields,
  file?: File | null,
  idioma: Idioma = 'es'
): Promise<InquiryOutcome> {
  const post = async (conAdjunto: boolean): Promise<boolean> => {
    const datos = new FormData();
    datos.append('access_key', WEB3FORMS_KEY);
    datos.append('subject', buildInquirySubject(f, idioma));
    datos.append(
      'from_name',
      f.name.trim() || (idioma === 'en' ? 'Enquiry from the website' : 'Consulta desde la web')
    );
    datos.append('replyto', f.email.trim());
    datos.append('message', buildInquiryBody(f, idioma));
    if (conAdjunto && file) datos.append('attachment', file);
    try {
      const r = await fetch(WEB3FORMS_URL, { method: 'POST', body: datos });
      return r.ok;
    } catch {
      return false;
    }
  };

  if (await post(true)) return file ? 'enviado' : 'enviado';
  // Un adjunto puede pasarse de tamaño o no estar cubierto por el plan: antes
  // de darlo por perdido se reintenta sin él, que es lo que de verdad importa.
  if (file && (await post(false))) return 'enviado-sin-adjunto';
  openInquiryMail(to, f, idioma);
  return 'correo';
}

/** Abre el cliente de correo. Devuelve el texto compuesto para poder mostrarlo
 *  como respaldo copiable si el navegador no tiene cliente configurado. */
export function openInquiryMail(to: string, f: InquiryFields, idioma: Idioma = 'es'): string {
  const href = buildInquiryMailto(to, f, idioma);
  if (typeof window !== 'undefined') {
    window.location.href = href;
  }
  return buildInquiryBody(f, idioma);
}
