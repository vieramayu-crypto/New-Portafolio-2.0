import { CollaborationCase, Testimonial } from '../types';
import { publicImage } from '../src/lib/content';

// Trabajos confirmados en el media kit. Sin fotografía propia todavía
// (hasMedia: false) -- se muestran como casos reservados en vez de usar
// imágenes de archivo que no son un trabajo real.
export const COLLABORATIONS: CollaborationCase[] = [
  {
    id: 'ritz-carlton-abama',
    brandName: 'The Ritz-Carlton Abama',
    category: 'Grandes Resorts de Lujo',
    summary: 'Fotografía y cine para uno de los resorts insignia de la marca.',
    hasMedia: false,
  },
  {
    id: 'intercontinental-lisboa',
    brandName: 'InterContinental Lisboa',
    category: 'Grandes Resorts de Lujo',
    location: 'Lisboa',
    summary: 'Un proyecto reciente con IHG Hotels & Resorts.',
    hasMedia: false,
  },
  {
    id: 'gpro-valparaiso',
    brandName: 'GPRO Valparaiso Palace & Spa',
    category: 'Boutique y Destino',
    summary: 'Producción visual para un resort boutique de lujo.',
    hasMedia: false,
  },
  {
    id: 'villa-venecia',
    brandName: 'Villa Venecia Boutique Hotel',
    category: 'Boutique y Destino',
    summary: 'Fotografía editorial para un hotel boutique gourmet.',
    hasMedia: false,
  },
  {
    id: 'honeymoon-petra',
    brandName: 'Honeymoon Petra Villas',
    category: 'Boutique y Destino',
    location: 'Santorini',
    summary: 'Contenido de marca para villas boutique en Santorini.',
    hasMedia: false,
  },
  {
    id: 'terra-dominicata',
    brandName: 'Terra Dominicata',
    category: 'Boutique y Destino',
    summary: 'Historias visuales para un destino boutique con enfoque sostenible.',
    hasMedia: false,
  },
  {
    id: 'delta-park',
    brandName: 'Delta Park',
    category: 'Experiencial y Sostenible',
    summary: 'Producción de contenido experiencial con enfoque sostenible.',
    hasMedia: false,
  },
  {
    id: 'numa',
    brandName: 'Numa',
    category: 'Experiencial y Sostenible',
    summary: 'Contenido de marca para la red de alojamientos Numa.',
    hasMedia: false,
  },
  {
    id: 'district-hive',
    brandName: 'District Hive',
    category: 'Experiencial y Sostenible',
    summary: 'Producción visual experiencial con enfoque sostenible.',
    hasMedia: false,
  },
];

// Testimonios reales de los equipos de cada propiedad. Ordenados por fuerza
// comercial, no cronológicamente: primero los que hablan en lenguaje de negocio
// (alcance, marca, resultados) y los que acreditan trabajo recurrente.
// Las citas están recortadas -- se quitan saludos y despedidas, el cuerpo queda
// intacto. `photo` solo se rellena cuando tenemos material de esa propiedad.
export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't-honeymoon-petra',
    quote:
      'Their unique perspective and use of captivating imagery have been invaluable in sharing our story and reaching new audiences. Their positive outlook has captured the essence of our brand.',
    author: 'Aias Mavrikis',
    role: 'Equipo de Marketing',
    brandName: 'Honeymoon Petra Villas',
    photo: publicImage('sec4-gal07-piscina-cruceros-v.jpg'),
  },
  {
    id: 't-gpro',
    quote:
      'Thank you both for, as always, the professionalism and craft you have shown throughout. And what can we say about the outstanding material you have left us. It will be a pleasure to have you back in our house.',
    author: 'Francisco Dominguez',
    role: 'Director de Marketing',
    brandName: 'GPRO Valparaíso Palace & Spa',
    photo: publicImage('sec5-gal09-piscina-palmeras-v.jpg'),
    repeatNote: '3 rodajes juntos',
  },
  {
    id: 't-ritz-carlton',
    quote:
      'On behalf of the department, I would like to thank her for her interest in the whole Ritz-Carlton, Abama project and in our gastronomic offering, and for the wonderful content she created during her stay. We hope to have her back with us in the future.',
    author: 'Jose Lorente',
    role: 'Equipo de Marketing',
    brandName: 'The Ritz-Carlton Tenerife, Abama',
    photo: publicImage('sec1-gal1-facade-v.jpg'),
  },
  {
    id: 't-costa-magica',
    quote:
      'Thank you so much for your work. The photos and videos are simply incredible. We gained a great many new followers.',
    author: 'Katerina',
    role: 'Community Manager',
    brandName: 'Costa Mágica',
    photo: publicImage('testi-costa-magica-v.jpg'),
  },
  {
    id: 't-numa',
    quote:
      'We have just reviewed the content and it is absolutely beautiful. Thank you for all the effort, the care and the love you put into it.',
    author: 'Luna Nemeth',
    role: 'Equipo de Marketing',
    brandName: 'Numa',
    photo: publicImage('testi-numa-v.jpg'),
    repeatNote: '3 propiedades: Madrid, Ámsterdam y Sevilla',
  },
  {
    id: 't-welmoon',
    quote:
      'Incredible content. You are true professionals. You will go far putting this much care into what you do. We would be delighted to welcome you again.',
    author: 'Juan',
    role: 'Equipo de Marketing',
    brandName: 'Welmoon Villas Paisaje',
    photo: publicImage('sec8-gal08-jacuzzi-noche-v.jpg'),
  },
  {
    id: 't-holiday-inn',
    quote:
      'We are very happy with how the content turned out. Very pleased with the quality and with the results of their creativity.',
    author: 'Zara',
    role: 'Equipo de Marketing',
    brandName: 'Holiday Inn Express Amsterdam',
    photo: publicImage('testi-holiday-inn-v.jpg'),
  },
  {
    id: 't-coeo',
    quote:
      'The photos are beautiful, and as content for all our channels they work extremely well. You will be seeing them everywhere.',
    author: 'María Andrea',
    role: 'Equipo de Marketing',
    brandName: 'COEO Stay & Share',
    photo: publicImage('testi-coeo-v.jpg'),
  },
];
