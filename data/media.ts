import { publicImage } from '../src/lib/content';

// LAS DOS FOTOS DEL HERO, cada una encuadrada por Mayurlin para su pantalla.
//
// Antes habia una sola escena y el codigo la recortaba: la horizontal puesta
// en vertical obligaba al movil a usar un tercio de su ancho y ampliarlo, y de
// ahi venia la perdida de calidad. Ahora ella manda el encuadre ya hecho para
// cada formato, asi que el codigo no recorta nada: solo llena la caja.
//
// Ambas entran con su graduacion tal cual -- calidas y claras. En el codigo no
// queda ningun filtro de color sobre ellas, ni en movil ni en escritorio: el
// `saturate(.84)` que llevaba escritorio existia para domar una foto sin
// graduar y aqui se llevaria por delante su trabajo.
//
// SE REDIMENSIONAN, NO SE RECOMPRIMEN A LA BAJA. Sus originales son de
// 5465x3869 (15 MB) y 2176x3793 (6,3 MB); se guardan enteros en /originales.
// Lo que se publica esta ajustado a lo que una pantalla puede dibujar de
// verdad -- 2880 px para una caja de 1440 a 2x, 1600 px para un movil de
// 430 pt a 3x (1.290) -- con JPEG a quality=97 y subsampling=0. Por encima de
// esas cifras no hay mas detalle visible, solo megabytes.
export const HERO_PHOTO = publicImage('hero-portada.jpg');
export const HERO_PHOTO_MOBILE = publicImage('hero-movil.jpg');

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
