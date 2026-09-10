import { publicImage } from '../src/lib/content';

export const HERO_PHOTO = publicImage('hero-portada.jpg');

// La de arriba es horizontal: en vertical el movil solo usaba un tercio de su
// ancho y lo estiraba, y la foto se veia blanda. Esta es el mismo encuadre ya
// recortado en vertical, asi que el movil no tiene que ampliar nada.
export const HERO_PHOTO_MOBILE = publicImage('hero-portada-movil.jpg');

export const MAYU_PORTRAIT = publicImage('sobre-mi-mayurlin.jpg');
export const YERFRAN_PORTRAIT = publicImage('sobre-mi-yerfran.jpg');

// Vivia en /wp-content/ del WordPress anterior y se perdio al retirarlo, asi
// que las dos pantallas que la usaban quedaron con la imagen rota. Ahora entra
// en el repo como las demas y ya no depende de donde este alojado el sitio.
export const COUPLE_PHOTO = publicImage('sobre-nosotros-pareja.jpg');

// La misma foto recortada a 4:5, que es el formato del retrato del menu.
export const MENU_ABOUT_PHOTO = publicImage('menu-pareja.jpg');

// Same photo as the Home hero background.
export const PORTFOLIO_MENU_PHOTO = HERO_PHOTO;
