import { publicImage } from '../src/lib/content';

export const HERO_PHOTO = publicImage('hero-portada.jpg');

// La de arriba es horizontal: en vertical el movil solo usaba un tercio de su
// ancho y lo estiraba, y la foto se veia blanda. Esta es el mismo encuadre ya
// recortado en vertical, asi que el movil no tiene que ampliar nada.
export const HERO_PHOTO_MOBILE = publicImage('hero-portada-movil.jpg');

// La que se usa ahora en el hero de movil: el encuadre vertical nitido con la
// graduacion de Mayurlin encima.
//
// POR QUE NO ES SU .WEBP TAL CUAL. El archivo que ella graduó es la escena
// entera en 2000x1416, y el hero solo usa 732 px de su ancho. Un movil de
// 440 pt a 3x pide 1.320, asi que habia que ampliar un 80% -- de ahi la
// perdida de calidad que ella noto. Este archivo parte del vertical
// (1.450 px para ese mismo encuadre: no amplia nada) y le traslada la
// graduacion de ella con una curva GLOBAL por canal mas una correccion de
// muy baja frecuencia para su degradado.
//
// GLOBAL ES LA PALABRA. Un primer intento ajusto el tono por bloques y salio
// PEOR que el original (gradiente medio 2,5 frente a 3,9): al forzar cada
// bloque a parecerse al de la version ampliada, el ajuste aplanaba el detalle.
// Una curva de 256 entradas por canal no puede hacer eso.
//
// Medido a 1.320 px, el tamaño real de pantalla: gradiente medio 6,40 frente
// a 3,95 (1,6x mas detalle) con el mismo brillo (111,8 vs 111,9), el mismo
// contraste (sd 56,4 vs 56,3) y el mismo color (RGB 121/109/102, identico).
// Ver scripts en el historial: curva por emparejado de histogramas.
export const HERO_PHOTO_MOBILE_GRADUADA = publicImage('hero-portada-movil-graduada-nitida.webp');

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
