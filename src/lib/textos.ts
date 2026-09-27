import type { Idioma } from './idioma';

/** LOS TEXTOS QUE VIVEN DENTRO DE LOS COMPONENTES.
 *
 *  Aquí van los rótulos de interfaz: menús, botones, cabeceras de sección y
 *  las etiquetas que solo oyen los lectores de pantalla. Lo que Mayurlin
 *  puede editar sin tocar código sigue en `content.json`, que tiene su propia
 *  versión en inglés (`content.en.json`).
 *
 *  REGLA DE ESCRITURA, Y NO ES UN CAPRICHO SUYO: NADA DE GUIONES PARA SEPARAR
 *  IDEAS. Ni guion largo ni guion corto entre frases. Se usa la coma, el
 *  punto o el punto y coma, que es lo que hace el inglés bien escrito. Los
 *  únicos guiones permitidos son los que forman parte de un nombre propio,
 *  como Ritz-Carlton.
 *
 *  Y EL INGLÉS NO ES UNA TRADUCCIÓN LITERAL. "Proyectos destacados" no es
 *  "Featured projects", que suena a plantilla; es "Selected work", que es como
 *  lo titula un portafolio de verdad. Donde el español hace una frase larga,
 *  el inglés corta.
 */

type Diccionario = Record<string, { es: string; en: string }>;

export const TEXTOS: Diccionario = {
  // Navegación y menú
  menuAbrir: { es: 'Abrir menú', en: 'Open menu' },
  menuCerrar: { es: 'Cerrar menú', en: 'Close menu' },
  menuCerrarCorchetes: { es: '[ CERRAR ]', en: '[ CLOSE ]' },
  navInicio: { es: 'Inicio', en: 'Home' },
  navProyectos: { es: 'Proyectos y portafolio', en: 'Projects and portfolio' },
  navProyectosCorto: { es: 'Proyectos', en: 'Projects' },
  navEquipo: { es: 'Equipo', en: 'Team' },
  navContacto: { es: 'Contacto', en: 'Contact' },
  instagram: { es: 'Instagram', en: 'Instagram' },

  // Llamadas a la acción
  consultarDisponibilidad: { es: 'Consultar disponibilidad', en: 'Check availability' },
  iniciarProyecto: { es: 'Iniciar un proyecto', en: 'Start a project' },
  verProyecto: { es: 'Ver proyecto', en: 'View project' },
  verGaleria: { es: 'Ver galería', en: 'View gallery' },
  verGaleriaCompleta: { es: 'Ver galería completa', en: 'See the full gallery' },
  verProyectoCompleto: { es: 'Ver el proyecto completo', en: 'See the full project' },
  verTodosProyectos: { es: 'Ver todos los proyectos', en: 'View all projects' },
  verTodoTrabajo: { es: 'Ver todo el trabajo', en: 'See all the work' },
  volver: { es: 'Volver', en: 'Back' },

  // Inicio
  proyectosDestacados: { es: 'Proyectos destacados', en: 'Selected work' },
  loQueDicenEquipos: {
    es: 'Lo que dicen los equipos con los que trabajamos',
    en: 'In the words of the teams we work with',
  },

  // Ficha de hotel
  publicadoPorHotel: { es: 'Publicado por el hotel', en: 'Published by the hotel' },
  propiedad: { es: 'Propiedad', en: 'Property' },
  ubicacion: { es: 'Ubicación', en: 'Location' },
  creditos: { es: 'Créditos', en: 'Credits' },
  creditosVer: { es: 'Ver créditos', en: 'Show credits' },
  creditosCerrar: { es: 'Cerrar créditos', en: 'Hide credits' },
  creditoMayurlin: {
    es: 'Fotografía y dirección creativa · Mayurlin Viera',
    en: 'Photography and creative direction · Mayurlin Viera',
  },
  creditoYerfran: {
    es: 'Producción audiovisual · Yerfran',
    en: 'Film production · Yerfran',
  },
  buscasAlgoAsi: {
    es: '¿Buscas algo así para tu hotel?',
    en: 'Looking for something like this for your hotel?',
  },
  navegacionHoteles: { es: 'Navegación entre hoteles', en: 'Navigation between hotels' },
  anterior: { es: 'Anterior', en: 'Previous' },
  siguiente: { es: 'Siguiente', en: 'Next' },
  hotelAnterior: { es: 'Hotel anterior', en: 'Previous hotel' },
  hotelSiguiente: { es: 'Siguiente hotel', en: 'Next hotel' },
  irAUnHotel: { es: 'Ir a un hotel', en: 'Jump to a hotel' },
  casoDeEstudio: { es: 'Caso de estudio', en: 'Case study' },

  // Vídeo
  reproducirVideo: { es: 'Reproducir vídeo', en: 'Play video' },
  videoTitulo: { es: 'Vídeo de producción para hotel', en: 'Hotel production film' },
  piezaAnterior: { es: 'Pieza anterior', en: 'Previous piece' },
  piezaSiguiente: { es: 'Pieza siguiente', en: 'Next piece' },
  saltarIntro: { es: 'Saltar la introducción', en: 'Skip the intro' },

  // Carruseles
  testimonioAnterior: { es: 'Testimonio anterior', en: 'Previous testimonial' },
  testimonioSiguiente: { es: 'Siguiente testimonio', en: 'Next testimonial' },
  siguientePaso: { es: 'Ver el siguiente paso', en: 'See the next step' },

  // Formularios
  solicitudLista: { es: 'Tu solicitud está lista', en: 'Your request is ready' },
  cerrar: { es: 'Cerrar', en: 'Close' },
  atencionRapida: { es: 'Atención rápida', en: 'Quick response' },
  campoNombre: { es: 'Nombre', en: 'Name' },
  campoCorreo: { es: 'Correo', en: 'Email' },
  campoPropiedad: { es: 'Propiedad / Marca', en: 'Property or brand' },
  campoFechas: { es: 'Fechas de disponibilidad', en: 'Dates you have in mind' },
  phNombre: { es: 'Tu nombre', en: 'Your name' },
  phCorreo: { es: 'correo@ejemplo.com', en: 'name@example.com' },
  phPropiedad: { es: 'Nombre del hotel o marca', en: 'Hotel or brand name' },
  phFechas: { es: 'ej. semana del 12 de marzo', en: 'e.g. the week of 12 March' },
  phWeb: { es: '@tuhotel o tuhotel.com', en: '@yourhotel or yourhotel.com' },
  phMensaje: {
    es: 'Objetivo, fechas, dónde se va a usar y, si ya lo sabes, qué espacios te importan más y quién aprueba el contenido.',
    en: 'Your goal, the dates, where the content will be used and, if you already know, which spaces matter most and who signs it off.',
  },
  enviarOtraConsulta: { es: 'Enviar otra consulta', en: 'Send another enquiry' },
  selecciona: { es: 'Selecciona', en: 'Select' },

  // Alcance digital
  seguidoresInstagram: { es: 'Seguidores en Instagram', en: 'Instagram followers' },
  reproducciones30: {
    es: 'Reproducciones en los últimos 30 días',
    en: 'Views in the last 30 days',
  },
  perfilAudiencia: { es: 'Perfil de audiencia', en: 'Audience profile' },
  mercadosPrincipales: { es: 'Mercados principales', en: 'Main markets' },
  mercadosLista: {
    es: 'España • Argentina • Estados Unidos • México',
    en: 'Spain • Argentina • United States • Mexico',
  },

  // Pie de página
  pieDescripcion: {
    es: 'Producción visual para hoteles de lujo.',
    en: 'Visual production for luxury hotels.',
  },
  pieNavegacion: { es: 'Navegación', en: 'Navigation' },
  pieContactoRedes: { es: 'Contacto y redes', en: 'Contact and social' },

  // Varios
  materialEnPreparacion: { es: 'Material en preparación', en: 'In preparation' },
  retratoPareja: { es: 'Mayurlin y Yerfran', en: 'Mayurlin and Yerfran' },
};

/** El texto en el idioma que toque. Si falta la clave devuelve la propia
 *  clave, que en pantalla canta lo suficiente como para que se arregle. */
export function texto(idioma: Idioma, clave: keyof typeof TEXTOS | string): string {
  const t = TEXTOS[clave as string];
  if (!t) return String(clave);
  return idioma === 'en' ? t.en : t.es;
}

/** Atajo para componentes: `const t = useT()` y luego `t('verGaleria')`. */
export function crearT(idioma: Idioma) {
  return (clave: keyof typeof TEXTOS | string) => texto(idioma, clave);
}
