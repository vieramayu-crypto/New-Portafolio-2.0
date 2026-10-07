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
  verPieza: { es: 'Ver', en: 'See' },
  piezaAnterior: { es: 'Pieza anterior', en: 'Previous piece' },
  piezaSiguiente: { es: 'Pieza siguiente', en: 'Next piece' },
  saltarIntro: { es: 'Saltar la introducción', en: 'Skip the intro' },

  // Carruseles
  verTestimonioDe: { es: 'Ver testimonio de', en: 'See the testimonial from' },
  testimonioAnterior: { es: 'Testimonio anterior', en: 'Previous testimonial' },
  testimonioSiguiente: { es: 'Siguiente testimonio', en: 'Next testimonial' },
  paso: { es: 'Paso', en: 'Step' },
  pasoDe: { es: 'de', en: 'of' },
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
  heroAlt: {
    es: 'Mayu Travel, producción visual para hoteles de lujo',
    en: 'Mayu Travel, visual production for luxury hotels',
  },
  retratoPareja: { es: 'Mayurlin y Yerfran', en: 'Mayurlin and Yerfran' },

  // Acerca de / Equipo
  aboutTituloLinea1: { es: 'Fotografía,', en: 'Photography,' },
  aboutTituloLinea2: { es: 'vídeo y', en: 'film and' },

  // Galerías de vídeo
  videoPresentacion: { es: 'Vídeo de presentación', en: 'Presentation film' },
  videosTitulo: {
    es: 'Vídeos para mostrar la experiencia de tu hotel',
    en: 'Films that show the experience of your hotel',
  },
  videosSubtitulo: {
    es: 'Una pieza que presenta la propiedad entera, para su web y sus campañas.',
    en: 'One piece that presents the whole property, for its website and its campaigns.',
  },
  verticalesTitulo: {
    es: 'Piezas verticales para sus redes',
    en: 'Vertical pieces for their social channels',
  },
  verticalesSubtitulo: {
    es: 'Centradas en un espacio, la gastronomía o el servicio.',
    en: 'Built around one space, the food or the service.',
  },
  verticalesTituloSuelto: { es: 'Piezas verticales', en: 'Vertical pieces' },
  verticalesSubtituloSuelto: {
    es: 'Para las redes del hotel, en el formato en que se publican.',
    en: "For the hotel's own channels, in the format they are published in.",
  },

  // Proyectos
  verTodasPropiedades: { es: 'Ver todas las propiedades', en: 'See every property' },

  // Sólo lo oye un lector de pantalla: el rótulo de los cuatro puntos que
  // recorren los pasos del proceso en Acerca de. Lleva detrás el número y el
  // título del paso, que ya vienen traducidos.
  irAlPaso: { es: 'Ir al paso', en: 'Go to step' },

  // FORMULARIO ANTIGUO (`AvailabilityModal`), HOY SIN USAR. El formulario
  // vivo es `InquiryModal`. Estas claves existen para que el componente no
  // tenga ni una frase en español escrita dentro: si algún día se reactiva,
  // se reactiva en los dos idiomas.
  dispEyebrow: { es: 'Atención rápida', en: 'Quick response' },
  dispTitulo: { es: 'Consultar disponibilidad', en: 'Check availability' },
  dispLista: { es: 'Tu solicitud está lista', en: 'Your request is ready' },
  disp48h: { es: 'Respondemos en 48 h.', en: 'We reply within 48 hours.' },
  campoPropiedadMarca: { es: 'Propiedad / Marca', en: 'Property or brand' },
  phHotelMarca: { es: 'Nombre del hotel o marca', en: 'Hotel or brand name' },
  campoFechasDisp: { es: 'Fechas de disponibilidad', en: 'Dates of availability' },
  phSemanaEjemplo: { es: 'ej. semana del 12 de marzo', en: 'e.g. the week of 12 March' },

  // Formulario: campos que sólo tiene la consulta larga
  campoHotelEmpresa: { es: 'Hotel o empresa', en: 'Hotel or company' },
  campoUbicacionOpc: { es: 'Ubicación (opcional)', en: 'Location (optional)' },
  campoEnlaceOpc: { es: 'Instagram o web (opcional)', en: 'Instagram or website (optional)' },
  campoAlcanceOpc: {
    es: '¿Qué necesitas producir? (opcional)',
    en: 'What do you need produced? (optional)',
  },
  campoEtapaOpc: { es: 'En qué punto está (opcional)', en: 'Where the project stands (optional)' },
  campoProyecto: { es: 'Proyecto', en: 'Project' },
  // En ingles "brief" es el documento que se adjunta; "briefing" es la sesion
  // en la que se informa. El espanol conserva "briefing" a proposito: es la voz
  // del sector tal y como la usa Mayurlin.
  campoBriefingOpc: { es: 'Briefing (opcional)', en: 'Brief (optional)' },
  campoEmail: { es: 'Email', en: 'Email' },
  adjuntarArchivo: { es: 'Adjuntar archivo', en: 'Attach a file' },
  cambiarArchivo: { es: 'Cambiar archivo', en: 'Change the file' },
  quitarArchivo: { es: 'quitar', en: 'remove' },
  enviando: { es: 'Enviando…', en: 'Sending…' },
  enviarConsulta: { es: 'Enviar consulta', en: 'Send enquiry' },
  consultaLista: { es: 'Tu consulta está lista', en: 'Your enquiry is ready' },
  consultaEnviada: { es: 'Consulta enviada', en: 'Enquiry sent' },
  tuPropiedad: { es: 'tu propiedad', en: 'your property' },
  noSeAbrio: { es: '¿No se abrió?', en: 'Did it not open?' },
  escribenosA: { es: 'Escríbenos a', en: 'Write to us at' },

  // Qué necesita producir
  alcanceFoto: { es: 'Fotografía', en: 'Photography' },
  alcanceVideo: { es: 'Vídeo', en: 'Film' },
  alcanceFotoVideo: { es: 'Fotografía y vídeo', en: 'Photography and film' },
  alcanceBanco: { es: 'Banco de imágenes y vídeos', en: 'Photo and film library' },
  alcanceContinua: { es: 'Producción continua', en: 'Ongoing production' },

  // En qué punto está
  etapaAprobado: { es: 'Presupuesto aprobado', en: 'Budget approved' },
  etapaPendiente: { es: 'Pendiente de aprobación', en: 'Awaiting approval' },
  etapaExplorando: { es: 'Explorando opciones', en: 'Exploring options' },

  // Alcance digital
  perfilAudienciaValor: {
    es: '70% con base en Europa, interesada en viajes y hotelería.',
    en: '70% based in Europe, interested in travel and hospitality.',
  },

  // Pie de página
  derechosReservados: { es: 'Todos los derechos reservados.', en: 'All rights reserved.' },
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
