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

// Testimonios reales de los equipos de cada propiedad. EL ORDEN DE ESTA LISTA
// ES EL ORDEN EN QUE SE VEN, y lo eligió Mayurlin: abre GPRO Valparaíso -- el
// cliente que ha repetido tres veces, y cuya cita habla de oficio y de querer
// repetir -- y le sigue Ritz-Carlton Abama, que es la marca que más pesa. El
// resto va por fuerza comercial: primero los que hablan en lenguaje de negocio
// (alcance, marca, resultados). No tocar los dos primeros sin que ella lo pida.
// Las citas están recortadas -- se quitan saludos y despedidas, el cuerpo queda
// intacto. `photo` solo se rellena cuando tenemos material de esa propiedad.
export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't-gpro',
    quote:
      'Gracias a los dos, como siempre, por el profesionalismo y el oficio que han demostrado en todo momento. Y qué decir del material tan bueno que nos han dejado. Será un placer teneros de vuelta en nuestra casa.',
    author: 'Francisco Dominguez',
    role: 'Director de Marketing',
    brandName: 'GPRO Valparaíso Palace & Spa',
    photo: publicImage('sec5-gal09-piscina-palmeras-v.jpg'),
    repeatNote: '3 rodajes juntos',
  },
  {
    id: 't-ritz-carlton',
    quote:
      'En nombre del departamento, quiero agradecerle el interés por todo el proyecto de Ritz-Carlton, Abama y por nuestra propuesta gastronómica, y el contenido tan bonito que creó durante su estancia. Esperamos tenerla de vuelta con nosotros.',
    author: 'Jose Lorente',
    role: 'Equipo de Marketing',
    brandName: 'The Ritz-Carlton Tenerife, Abama',
    photo: publicImage('sec1-gal1-facade-v.jpg'),
  },
  {
    id: 't-honeymoon-petra',
    quote:
      'Su mirada y sus imágenes nos han ayudado muchísimo a contar nuestra historia y a llegar a públicos nuevos. Han sabido capturar la esencia de la marca.',
    author: 'Aias Mavrikis',
    role: 'Equipo de Marketing',
    brandName: 'Honeymoon Petra Villas',
    photo: publicImage('sec4-gal07-piscina-cruceros-v.jpg'),
  },
  {
    id: 't-costa-magica',
    quote:
      'Muchísimas gracias por vuestro trabajo. Las fotos y los vídeos son increíbles. Hemos ganado muchísimos seguidores nuevos.',
    author: 'Katerina',
    role: 'Community Manager',
    brandName: 'Costa Mágica',
    photo: publicImage('testi-costa-magica-v.jpg'),
  },
  {
    id: 't-numa',
    quote:
      'Acabamos de ver el contenido y es precioso. Gracias por todo el esfuerzo, el cuidado y el cariño que le habéis puesto.',
    author: 'Luna Nemeth',
    role: 'Equipo de Marketing',
    brandName: 'Numa',
    photo: publicImage('testi-numa-v.jpg'),
    repeatNote: '3 propiedades: Madrid, Ámsterdam y Sevilla',
  },
  {
    id: 't-welmoon',
    quote:
      'Un contenido increíble. Sois unos verdaderos profesionales. Vais a llegar lejos poniendo este cuidado en lo que hacéis. Nos encantaría recibiros otra vez.',
    author: 'Juan',
    role: 'Equipo de Marketing',
    brandName: 'Welmoon Villas Paisaje',
    photo: publicImage('sec8-gal08-jacuzzi-noche-v.jpg'),
  },
  {
    id: 't-holiday-inn',
    quote:
      'Estamos muy contentos con cómo ha quedado el contenido. Muy satisfechos con la calidad y con el resultado de su creatividad.',
    author: 'Zara',
    role: 'Equipo de Marketing',
    brandName: 'Holiday Inn Express Amsterdam',
    photo: publicImage('testi-holiday-inn-v.jpg'),
  },
  {
    id: 't-coeo',
    quote:
      'Las fotos son preciosas, y como contenido para todos nuestros canales funcionan estupendamente. Las vais a ver por todas partes.',
    author: 'María Andrea',
    role: 'Equipo de Marketing',
    brandName: 'COEO Stay & Share',
    photo: publicImage('testi-coeo-v.jpg'),
  },
];
