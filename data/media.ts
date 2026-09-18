import { publicImage } from '../src/lib/content';

export const HERO_PHOTO = publicImage('hero-portada.jpg');

// La de arriba es horizontal: en vertical el movil solo usaba un tercio de su
// ancho y lo estiraba, y la foto se veia blanda. Esta es el mismo encuadre ya
// recortado en vertical, asi que el movil no tiene que ampliar nada.
export const HERO_PHOTO_MOBILE = publicImage('hero-portada-movil.jpg');

// La que se usa ahora en el hero de movil. Es la escena entera, ya graduada por
// Mayurlin: en calido, oscurecida y con su propio degradado. Entra TAL CUAL en
// el repositorio, sin recodificar ni redimensionar -- por eso sigue siendo el
// .webp que ella mando -- y el codigo no le aplica ningun filtro.
//
// OJO A LA RESOLUCION: es la escena completa en 2000x1416, y el encuadre del
// hero solo usa 732 px de ancho de ella. Un movil de 440 px a 3x pide 1.320,
// asi que hay que ampliar un 80%. El archivo vertical anterior daba 1.450 px
// para ese mismo encuadre y no ampliaba nada. Si se quiere la graduacion de
// ella SIN perder nitidez, hace falta la misma graduacion aplicada sobre el
// vertical, o un export mas grande.
export const HERO_PHOTO_MOBILE_GRADUADA = publicImage('hero-portada-movil-graduada.webp');

export const MAYU_PORTRAIT = publicImage('sobre-mi-mayurlin.jpg');
export const YERFRAN_PORTRAIT = publicImage('sobre-mi-yerfran.jpg');

// Vivia en /wp-content/ del WordPress anterior y se perdio al retirarlo, asi
// que las dos pantallas que la usaban quedaron con la imagen rota. Ahora entra
// en el repo como las demas y ya no depende de donde este alojado el sitio.
export const COUPLE_PHOTO = publicImage('sobre-nosotros-pareja.jpg');

// La misma foto recortada a 4:5, que es el formato del retrato del menu.
export const MENU_ABOUT_PHOTO = publicImage('menu-pareja.jpg');

// El retrato del menu para "Inicio": la misma foto que el fondo del hero, que
// es justo lo que se va a encontrar al pulsar.
export const HOME_MENU_PHOTO = HERO_PHOTO;

// "Proyectos y portafolio" tenia esa misma foto, asi que el menu ensenaba dos
// veces la misma imagen. Esta es de la galeria de Ritz-Carlton Abama: las
// palmeras reflejadas en el agua quieta.
//
// Se probo antes la piscina infinita de Honeymoon Petra Villas con Imerovigli
// detras. Se descarto: en el recuadro de 300x375 dejaba el tercio de arriba en
// cielo vacio y el pueblo blanco se leia como ruido. Esta llena el marco, y en
// el blanco y negro que el menu aplica a todos sus retratos las palmeras y su
// reflejo quedan graficos.
//
// No es un retrato de persona a proposito: Equipo y Contacto ya lo son. Y es
// una foto que ensena oficio, no solo un sitio bonito, que es lo que tiene que
// prometer el enlace al portafolio.
export const PROJECTS_MENU_PHOTO = publicImage('sec1-gal5-reflejo-v.jpg');
