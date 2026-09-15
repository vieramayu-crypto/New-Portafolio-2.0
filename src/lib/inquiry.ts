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
  scope?: string;
  budget?: string;
  message?: string;
}

export function buildInquirySubject(f: InquiryFields): string {
  const property = f.propertyName.trim() || 'nueva propiedad';
  return `Consulta de disponibilidad: ${property}`;
}

export function buildInquiryBody(f: InquiryFields): string {
  const lines: string[] = [
    `Nombre: ${f.name.trim()}`,
    `Email: ${f.email.trim()}`,
  ];
  if (f.phone?.trim()) lines.push(`Teléfono: ${f.phone.trim()}`);
  lines.push(`Propiedad: ${f.propertyName.trim()}`);
  if (f.location?.trim()) lines.push(`Ubicación: ${f.location.trim()}`);
  if (f.link?.trim()) lines.push(`Instagram o web: ${f.link.trim()}`);
  if (f.scope?.trim()) lines.push(`Servicio: ${f.scope.trim()}`);
  if (f.budget?.trim()) lines.push(`Presupuesto estimado: ${f.budget.trim()}`);
  if (f.availabilityDate?.trim()) lines.push(`Fechas en consideración: ${f.availabilityDate.trim()}`);
  if (f.message?.trim()) lines.push('', 'Detalles del proyecto:', f.message.trim());
  return lines.join('\n');
}

export function buildInquiryMailto(to: string, f: InquiryFields): string {
  return `mailto:${to}?subject=${encodeURIComponent(buildInquirySubject(f))}&body=${encodeURIComponent(
    buildInquiryBody(f)
  )}`;
}

export type InquiryOutcome = 'enviado' | 'enviado-sin-adjunto' | 'correo';

/** Entrega la consulta. Devuelve por qué vía se fue, para poder decírselo al
 *  visitante sin mentirle. */
export async function sendInquiry(
  to: string,
  f: InquiryFields,
  file?: File | null
): Promise<InquiryOutcome> {
  const post = async (conAdjunto: boolean): Promise<boolean> => {
    const datos = new FormData();
    datos.append('access_key', WEB3FORMS_KEY);
    datos.append('subject', buildInquirySubject(f));
    datos.append('from_name', f.name.trim() || 'Consulta desde la web');
    datos.append('replyto', f.email.trim());
    datos.append('message', buildInquiryBody(f));
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
  openInquiryMail(to, f);
  return 'correo';
}

/** Abre el cliente de correo. Devuelve el texto compuesto para poder mostrarlo
 *  como respaldo copiable si el navegador no tiene cliente configurado. */
export function openInquiryMail(to: string, f: InquiryFields): string {
  const href = buildInquiryMailto(to, f);
  if (typeof window !== 'undefined') {
    window.location.href = href;
  }
  return buildInquiryBody(f);
}
