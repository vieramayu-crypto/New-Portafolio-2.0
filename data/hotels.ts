import { HotelStory } from '../types';
import { publicImage } from '../src/lib/content';

export const HOTEL_STORIES: HotelStory[] = [
  {
    id: 'ritz-carlton-abama',
    hotelName: 'THE RITZ-CARLTON TENERIFE, ABAMA',
    leftTag: 'HOTEL',
    coupleName: 'Arquitectura morisca',
    location: 'Guía de Isora, Tenerife',
    country: 'España',
    year: '2026',
    category: 'Luxury Hotel',
    layoutVariant: 0,
    galleryEmbed: 'https://livid.com/embed/oSYQOQcPwP5R?autoplay=1&loop=1&muted=1',
    publishedByHotel: true,
    caseStudy: {
      season: 'Julio · Verano',
      duration: '4 días',
      usage: 'Redes sociales',
    },
    coverImage: publicImage('sec1-portada.jpg'),
    description: 'Una finca morisca de muros de terracota sobre los acantilados de Guía de Isora, con jardines subtropicales que descienden hasta el Atlántico y La Gomera en el horizonte. Dentro, las arcadas, patios y fuentes escalonadas comparten un mismo lenguaje: piedra cálida, agua y sombra. Cada rincón de la propiedad cuenta una historia distinta, y juntas forman uno de los escenarios más completos que hemos rodado.',
    quote: 'Terracota, océano y jardín: tres tonos que se encuentran en cada rincón de Abama.',
    photos: [
      {
        id: 'gt-1',
        url: publicImage('sec1-foto1-v.jpg'),
        alt: 'Vista aérea del resort Abama entre plataneras y el campo de golf',
        caption: 'El resort visto desde el aire',
        aspectRatio: 'portrait',
        isBlackAndWhite: false
      },
      {
        id: 'gt-2',
        url: publicImage('sec1-foto2-v.jpg'),
        alt: 'Mujer bajando la escalinata de terracota junto al estanque de Abama',
        caption: 'La icónica escalinata de la Ciudadela',
        aspectRatio: 'portrait',
        isBlackAndWhite: false
      },
      {
        id: 'gt-3',
        url: publicImage('sec1-foto3-h.jpg'),
        alt: 'Cabaña de bambú con una clase de yoga entre palmeras',
        caption: 'Yoga bajo la cabaña junto al campo de golf',
        aspectRatio: 'landscape',
        isBlackAndWhite: false
      }
    ],
    galleryPhotos: [
      {
        id: 'gt-gal-1',
        url: publicImage('sec1-gal1-facade-v.jpg'),
        alt: 'Fachada de terracota de Abama entre palmeras y fuentes escalonadas',
        caption: 'La fachada morisca, entre palmeras y fuentes',
        aspectRatio: 'portrait',
        isBlackAndWhite: false
      },
      {
        id: 'gt-gal-2',
        url: publicImage('sec1-gal2-paseo-v.jpg'),
        alt: 'Mujer caminando con una cámara en mano frente a la fachada del resort',
        caption: 'Un paseo por los jardines del resort',
        aspectRatio: 'portrait',
        isBlackAndWhite: false
      },
      {
        id: 'gt-gal-3',
        url: publicImage('sec1-gal3-habitacion-v.jpg'),
        alt: 'Detalle de la habitación: mesita de noche y lámpara colgante junto a la cama',
        caption: 'El detalle en cada habitación',
        aspectRatio: 'portrait',
        isBlackAndWhite: false
      },
      {
        id: 'gt-gal-4',
        url: publicImage('sec1-gal4-playa-h.jpg'),
        alt: 'Vista elevada de la cala de Abama con sombrillas y tumbonas',
        caption: 'La cala del resort',
        aspectRatio: 'landscape',
        isBlackAndWhite: false
      },
      {
        id: 'gt-gal-5',
        url: publicImage('sec1-gal5-reflejo-v.jpg'),
        alt: 'Reflejo simétrico de las palmeras y la fachada en un estanque',
        caption: 'Simetría entre el agua y la arquitectura',
        aspectRatio: 'portrait',
        isBlackAndWhite: false
      },
      {
        id: 'gt-gal-6',
        url: publicImage('sec1-gal6-piscina-v.jpg'),
        alt: 'Piscina principal del resort entre palmeras y jardines ornamentales',
        caption: 'La piscina principal, entre las palmeras',
        aspectRatio: 'portrait',
        isBlackAndWhite: false
      },
      {
        id: 'gt-gal-7',
        url: publicImage('sec1-gal7-spa-v.jpg'),
        alt: 'Tratamiento con piedras calientes en el spa del resort',
        caption: 'Un momento de calma en el spa',
        aspectRatio: 'portrait',
        isBlackAndWhite: false
      },
      {
        id: 'gt-gal-8',
        url: publicImage('sec1-gal8-restaurante-h.jpg'),
        alt: 'Plato de alta cocina servido en el restaurante del resort',
        caption: 'Alta cocina para cerrar el día',
        aspectRatio: 'landscape',
        isBlackAndWhite: false
      }
    ]
  },
  {
    id: 'intercontinental-lisboa',
    hotelName: 'INTERCONTINENTAL LISBOA',
    leftTag: 'HOTEL',
    coupleName: 'Altura urbana',
    location: 'Lisboa',
    country: 'Portugal',
    year: '2026',
    category: 'Luxury Hotel',
    layoutVariant: 6,
    publishedByHotel: true,
    caseStudy: {
      season: 'Septiembre · Verano',
      duration: '3 días',
      usage: 'Redes sociales',
    },
    coverImage: publicImage('sec7-portada.jpg'),
    description:
      'Construido sobre una de las siete colinas de Lisboa, frente al Parque Eduardo VII, el InterContinental Lisboa combina arquitectura contemporánea con vistas que llegan hasta el Tajo, una lectura moderna del skyline de Lisboa.',
    quote: 'Toda Lisboa se despliega desde lo alto de esta colina.',
    photos: [
      {
        id: 'av-1',
        url: publicImage('sec7-portada.jpg'),
        alt: 'Vista vertical de la fachada del InterContinental Lisboa, el edificio completo sobre la colina',
        caption: 'La fachada, sobre la colina',
        aspectRatio: 'portrait',
        isBlackAndWhite: false
      },
      {
        id: 'av-2',
        url: publicImage('sec7-gal12-tranvia-v.jpg'),
        alt: 'El tranvía amarillo número 28 pasando por una calle empedrada de Lisboa',
        caption: 'Lisboa, justo a las puertas del hotel',
        aspectRatio: 'portrait',
        isBlackAndWhite: false
      },
      {
        id: 'av-3',
        url: publicImage('sec7-gal08-cafe-v.jpg'),
        alt: 'Camarero sirviendo café con un vaso de zumo de naranja en primer plano',
        caption: 'Café, servido con cuidado',
        aspectRatio: 'portrait',
        isBlackAndWhite: false
      }
    ],
    galleryPhotos: [
      {
        id: 'av-gal-1',
        url: publicImage('sec7-gal02-fachada-h.jpg'),
        alt: 'Vista en esquina de la fachada del InterContinental Lisboa, con la marquesina de la entrada',
        caption: 'La entrada, desde la avenida',
        aspectRatio: 'landscape',
        isBlackAndWhite: false
      },
      {
        id: 'av-gal-2',
        url: publicImage('sec7-gal03-recepcion-h.jpg'),
        alt: 'Recepción del hotel con mostrador dorado y un panel de mármol azul iluminado',
        caption: 'El registro, entre mármol azul y latón',
        aspectRatio: 'landscape',
        isBlackAndWhite: false
      },
      {
        id: 'av-gal-3',
        url: publicImage('sec7-foto1-v.jpg'),
        alt: 'Vestíbulo del hotel con lámparas colgantes de globos de cristal ámbar',
        caption: 'El vestíbulo, bajo las lámparas de cristal',
        aspectRatio: 'portrait',
        isBlackAndWhite: false
      },
      {
        id: 'av-gal-4',
        url: publicImage('sec7-gal04-escritorio-h.jpg'),
        alt: 'Escritorio en la habitación con portátil y lámpara junto a la ventana con vistas al skyline de Lisboa',
        caption: 'La habitación, con Lisboa de fondo',
        aspectRatio: 'landscape',
        isBlackAndWhite: false
      },
      {
        id: 'av-gal-5',
        url: publicImage('sec7-gal05-cama-detalle-v.jpg'),
        alt: 'Detalle de la cama con cojines bordados en turquesa y lámparas encendidas',
        caption: 'La cama, entre cojines bordados',
        aspectRatio: 'portrait',
        isBlackAndWhite: false
      },
      {
        id: 'av-gal-6',
        url: publicImage('sec7-foto2-v.jpg'),
        alt: 'Camarero sirviendo el desayuno en la suite',
        caption: 'El servicio, en la habitación',
        aspectRatio: 'portrait',
        isBlackAndWhite: false
      },
      {
        id: 'av-gal-7',
        url: publicImage('sec7-foto3-v.jpg'),
        alt: 'Vista cenital del desayuno servido en la habitación',
        caption: 'El desayuno, visto desde arriba',
        aspectRatio: 'portrait',
        isBlackAndWhite: false
      },
      {
        id: 'av-gal-8',
        url: publicImage('sec7-gal07-cama-h.jpg'),
        alt: 'Pareja en albornoces blancos brindando con zumo de naranja en la cama, con el desayuno servido delante',
        caption: 'Un brindis, antes de que empiece el día',
        aspectRatio: 'landscape',
        isBlackAndWhite: false
      },
      {
        id: 'av-gal-9',
        url: publicImage('sec7-gal06-silueta-v.jpg'),
        alt: 'Silueta de una mujer abriendo la cortina a contraluz de la mañana',
        caption: 'La primera luz, al abrirse la cortina',
        aspectRatio: 'portrait',
        isBlackAndWhite: false
      },
      {
        id: 'av-gal-10',
        url: publicImage('sec7-gal09-cortinas-v.jpg'),
        alt: 'Luces y sombras de las cortinas cayendo sobre la alfombra del dormitorio',
        caption: 'Luz de media tarde en la suite',
        aspectRatio: 'portrait',
        isBlackAndWhite: false
      },
      {
        id: 'av-gal-11',
        url: publicImage('sec7-gal10-gym-v.jpg'),
        alt: 'Mujer corriendo en una cinta en el gimnasio del hotel',
        caption: 'Un momento en el gimnasio',
        aspectRatio: 'portrait',
        isBlackAndWhite: false
      },
      {
        id: 'av-gal-12',
        url: publicImage('sec7-gal11-lampara-v.jpg'),
        alt: 'Lámpara y planta sobre una mesa de mármol en el restaurante al anochecer',
        caption: 'La cena, entre luz cálida y mármol',
        aspectRatio: 'portrait',
        isBlackAndWhite: false
      }
    ]
  },
  {
    id: 'vestige-binidufa',
    hotelName: 'VESTIGE COLLECTION, BINIDUFÀ',
    leftTag: 'FINCA',
    coupleName: 'Herencia menorquina',
    location: 'Ferreries, Menorca',
    country: 'España',
    year: '2026',
    category: 'Historic Villa',
    layoutVariant: 1,
    caseStudy: {
      season: 'Junio · Verano',
      duration: '3 días',
      usage: 'Redes sociales',
    },
    coverImage: publicImage('sec2-portada.jpg'),
    description:
      'En un valle al norte de Menorca, Vestige Binidufà restaura una possessió agrícola del siglo XVIII, en un entorno de 800 hectáreas que comparte con Son Ermità: piedra, barro y materiales naturales que toman su tono directamente del paisaje que los rodea, con la herencia morisca todavía presente en su nombre.',
    quote: 'Piedra, tierra y silencio. El norte de Menorca como siempre ha sido.',
    photos: [
      {
        id: 'vc-1',
        url: publicImage('sec2-foto1-h.jpg'),
        alt: 'Vista aérea de la finca Vestige Binidufà entre olivos y campos al norte de Menorca',
        caption: 'La finca vista desde el aire',
        aspectRatio: 'landscape',
        isBlackAndWhite: false
      },
      {
        id: 'vc-2',
        url: publicImage('sec2-foto2-c.jpg'),
        alt: 'Mujer caminando por el camino de tierra hacia las casas de piedra de la finca',
        caption: 'El camino hacia la possessió',
        aspectRatio: 'square',
        isBlackAndWhite: false
      },
      {
        id: 'vc-3',
        url: publicImage('sec2-foto3-v.jpg'),
        alt: 'Gran vasija de barro y una planta en un rincón de paredes encaladas',
        caption: 'Materiales nacidos del paisaje',
        aspectRatio: 'portrait',
        isBlackAndWhite: false
      }
    ],
    galleryPhotos: [
      {
        id: 'vc-gal-1',
        url: publicImage('sec2-gal01-aerea-h.jpg'),
        alt: 'Vista aérea de la finca entre campos de cultivo y colinas',
        caption: 'La finca vista desde el aire',
        aspectRatio: 'landscape',
        isBlackAndWhite: false
      },
      {
        id: 'vc-gal-2',
        url: publicImage('sec2-gal02-facade-h.jpg'),
        alt: 'Fachada de piedra de la finca con tumbonas y una sombrilla en la terraza',
        caption: 'La fachada de piedra, entre colinas',
        aspectRatio: 'landscape',
        isBlackAndWhite: false
      },
      {
        id: 'vc-gal-3',
        url: publicImage('sec2-gal03-salon-v.jpg'),
        alt: 'Hombre caminando por el salón rústico de techos de madera',
        caption: 'Un paseo por las zonas comunes',
        aspectRatio: 'portrait',
        isBlackAndWhite: false
      },
      {
        id: 'vc-gal-4',
        url: publicImage('sec2-gal04-urna-v.jpg'),
        alt: 'Gran vasija de barro y una planta en un rincón de paredes encaladas',
        caption: 'Materiales nacidos del paisaje',
        aspectRatio: 'portrait',
        isBlackAndWhite: false
      },
      {
        id: 'vc-gal-5',
        url: publicImage('sec2-gal05-camino-h.jpg'),
        alt: 'Mujer caminando por el camino de tierra hacia las casas de piedra de la finca',
        caption: 'El camino hacia la possessió',
        aspectRatio: 'landscape',
        isBlackAndWhite: false
      },
      {
        id: 'vc-gal-6',
        url: publicImage('sec2-gal06-patio-v.jpg'),
        alt: 'Mujer leyendo en un sillón bajo un arco de piedra junto a la habitación',
        caption: 'Un momento de calma en el patio',
        aspectRatio: 'portrait',
        isBlackAndWhite: false
      },
      {
        id: 'vc-gal-7',
        url: publicImage('sec2-gal07-gym-v.jpg'),
        alt: 'Gimnasio abovedado con vistas al mar a través de una ventana en arco',
        caption: 'El gimnasio, frente al mar',
        aspectRatio: 'portrait',
        isBlackAndWhite: false
      },
      {
        id: 'vc-gal-8',
        url: publicImage('sec2-gal08-vacas-v.jpg'),
        alt: 'Ganado pastando en los campos que rodean la finca',
        caption: 'Los campos que rodean la finca',
        aspectRatio: 'portrait',
        isBlackAndWhite: false
      },
      {
        id: 'vc-gal-9',
        url: publicImage('sec2-gal09-piscina-h.jpg'),
        alt: 'Vista aérea de la piscina ovalada entre tumbonas y vegetación',
        caption: 'La piscina, vista desde el aire',
        aspectRatio: 'landscape',
        isBlackAndWhite: false
      },
      {
        id: 'vc-gal-10',
        url: publicImage('sec2-gal10-habitacion-h.jpg'),
        alt: 'Mujer en albornoz sentada en la habitación junto a un muro de piedra',
        caption: 'Descanso, junto a la piedra',
        aspectRatio: 'landscape',
        isBlackAndWhite: false
      }
    ]
  },
  {
    id: 'deltapark-vitalresort',
    hotelName: 'DELTAPARK VITALRESORT',
    leftTag: 'COMPLEJO',
    coupleName: 'Bienestar alpino',
    location: 'Gwatt, Thunersee',
    country: 'Suiza',
    year: '2026',
    category: 'Romantic Escape',
    layoutVariant: 2,
    caseStudy: {
      season: 'Septiembre · Verano',
      duration: '3 días',
      usage: 'Redes sociales',
    },
    coverImage: publicImage('sec3-portada.jpg'),
    description:
      'A orillas del lago Thun, entre dos reservas naturales del delta del Kander, Deltapark Vitalresort combina arquitectura alpina contemporánea con un spa de 2.000 m²: agua, montaña y bienestar en un mismo horizonte.',
    quote: 'El silencio de los Alpes, reflejado entero en el lago Thun.',
    photos: [
      {
        id: 'hc-1',
        url: publicImage('sec3-foto1-v.jpg'),
        alt: 'Servicio de café y folleto de Deltapark Vitalresort sobre la cama',
        caption: 'Los pequeños detalles del servicio',
        aspectRatio: 'portrait',
        isBlackAndWhite: false
      },
      {
        id: 'hc-2',
        url: publicImage('sec3-foto2-h.jpg'),
        alt: 'Vista aérea del complejo junto al lago Thun',
        caption: 'El complejo visto desde el aire',
        aspectRatio: 'landscape',
        isBlackAndWhite: false
      },
      {
        id: 'hc-3',
        url: publicImage('sec3-foto3-v.jpg'),
        alt: 'Cesta de mimbre con toallas recién lavadas junto a la entrada',
        caption: 'Un detalle del spa alpino',
        aspectRatio: 'portrait',
        isBlackAndWhite: false
      }
    ],
    galleryPhotos: [
      {
        id: 'hc-gal-1',
        url: publicImage('sec3-foto2-h.jpg'),
        alt: 'Vista aérea del complejo junto al lago Thun',
        caption: 'El complejo, visto desde el aire',
        aspectRatio: 'landscape',
        isBlackAndWhite: false
      },
      {
        id: 'hc-gal-2',
        url: publicImage('sec3-gal01-fireplace-v.jpg'),
        alt: 'Chimenea de diseño en el vestíbulo del complejo',
        caption: 'La chimenea del vestíbulo',
        aspectRatio: 'portrait',
        isBlackAndWhite: false
      },
      {
        id: 'hc-gal-3',
        url: publicImage('sec3-gal02-checkin-v.jpg'),
        alt: 'Mujer con albornoz de Deltapark caminando por el jardín hacia el complejo',
        caption: 'De camino a recepción',
        aspectRatio: 'portrait',
        isBlackAndWhite: false
      },
      {
        id: 'hc-gal-4',
        url: publicImage('sec3-foto1-v.jpg'),
        alt: 'Servicio de café y folleto de Deltapark Vitalresort sobre la cama',
        caption: 'Los pequeños detalles del servicio',
        aspectRatio: 'portrait',
        isBlackAndWhite: false
      },
      {
        id: 'hc-gal-5',
        url: publicImage('sec3-gal03-balcon-v.jpg'),
        alt: 'Mujer en albornoz tomando café en el balcón de la habitación',
        caption: 'Café en el balcón, frente al lago',
        aspectRatio: 'portrait',
        isBlackAndWhite: false
      },
      {
        id: 'hc-gal-6',
        url: publicImage('sec3-gal04-desayuno-v.jpg'),
        alt: 'Café y una manzana sobre un albornoz de Deltapark en la cama',
        caption: 'Desayuno en la habitación',
        aspectRatio: 'portrait',
        isBlackAndWhite: false
      },
      {
        id: 'hc-gal-7',
        url: publicImage('sec3-foto3-v.jpg'),
        alt: 'Cesta de mimbre con toallas recién lavadas junto a la entrada',
        caption: 'Un detalle del spa alpino',
        aspectRatio: 'portrait',
        isBlackAndWhite: false
      },
      {
        id: 'hc-gal-8',
        url: publicImage('sec3-gal05-sauna-v.jpg'),
        alt: 'Mujer sentada en la sauna de madera del spa',
        caption: 'Un momento de calma en la sauna',
        aspectRatio: 'portrait',
        isBlackAndWhite: true
      },
      {
        id: 'hc-gal-9',
        url: publicImage('sec3-gal06-lounge-v.jpg'),
        alt: 'Mujer en albornoz sentada frente a las vistas al lago desde la zona de relajación',
        caption: 'La zona de relajación, frente al lago',
        aspectRatio: 'portrait',
        isBlackAndWhite: false
      },
      {
        id: 'hc-gal-10',
        url: publicImage('sec3-gal07-atardecer-v.jpg'),
        alt: 'Atardecer sobre el lago Thun con veleros amarrados',
        caption: 'Atardecer sobre el lago',
        aspectRatio: 'portrait',
        isBlackAndWhite: false
      },
      {
        id: 'hc-gal-11',
        url: publicImage('sec3-gal08-fachada-h.jpg'),
        alt: 'Fachada del complejo iluminada al anochecer entre los árboles',
        caption: 'La fachada, al anochecer',
        aspectRatio: 'landscape',
        isBlackAndWhite: false
      },
      {
        id: 'hc-gal-12',
        url: publicImage('sec3-gal09-aerea-v.jpg'),
        alt: 'Vista aérea cenital del complejo junto al lago',
        caption: 'El complejo, visto desde arriba',
        aspectRatio: 'portrait',
        isBlackAndWhite: false
      }
    ]
  },
  {
    id: 'honeymoon-petra-villas',
    hotelName: 'HONEYMOON PETRA VILLAS',
    leftTag: 'VILLAS',
    coupleName: 'Acantilado del Egeo',
    location: 'Imerovigli, Santorini',
    country: 'Grecia',
    year: '2026',
    category: 'Luxury Hotel',
    layoutVariant: 3,
    publishedByHotel: true,
    caseStudy: {
      season: 'Mayo · Primavera',
      duration: '4 días',
      usage: 'Redes sociales',
    },
    coverImage: publicImage('sec4-portada.jpg'),
    description:
      'Suspendida sobre los acantilados de Imerovigli, tallada en roca volcánica sobre la caldera de Santorini, Honeymoon Petra Villas abre sus piscinas sobre la caldera como un balcón de piedra sobre el Egeo.',
    quote: 'Roca volcánica y un horizonte infinito. Así amanece sobre la caldera.',
    photos: [
      {
        id: 'be-1',
        url: publicImage('sec4-foto1-v.jpg'),
        alt: 'Pareja desayunando frente a la caldera de Santorini',
        caption: 'Desayuno frente a la caldera',
        aspectRatio: 'portrait',
        isBlackAndWhite: false
      },
      {
        id: 'be-2',
        url: publicImage('sec4-foto2-c.jpg'),
        alt: 'Arquitectura de cúpulas blancas de Honeymoon Petra Villas con el mar Egeo al fondo',
        caption: 'Cúpulas blancas sobre el Egeo',
        aspectRatio: 'square',
        isBlackAndWhite: false
      },
      {
        id: 'be-3',
        url: publicImage('sec4-foto3-h.jpg'),
        alt: 'Piscina infinita sobre los acantilados de Imerovigli',
        caption: 'La piscina, un balcón de piedra sobre la caldera',
        aspectRatio: 'landscape',
        isBlackAndWhite: false
      }
    ],
    galleryPhotos: [
      {
        id: 'be-gal-1',
        url: publicImage('sec4-gal01-entrada-h.jpg'),
        alt: 'Entrada a Honeymoon Petra Villas con la cúpula azul de una iglesia al fondo',
        caption: 'La entrada, con la cúpula azul de fondo',
        aspectRatio: 'landscape',
        isBlackAndWhite: false
      },
      {
        id: 'be-gal-2',
        url: publicImage('sec4-gal02-detalle-hat-v.jpg'),
        alt: 'Sombrero y toalla bordada de Honeymoon Petra sobre la cama',
        caption: 'Los detalles de la bienvenida',
        aspectRatio: 'portrait',
        isBlackAndWhite: false
      },
      {
        id: 'be-gal-3',
        url: publicImage('sec4-gal03-habitacion-v.jpg'),
        alt: 'Habitación con cabecero de madera y un cojín bordado de Honeymoon Petra Villas',
        caption: 'Descanso, tallado en la roca',
        aspectRatio: 'portrait',
        isBlackAndWhite: false
      },
      {
        id: 'be-gal-4',
        url: publicImage('sec4-gal04-terraza-caminando-v.jpg'),
        alt: 'Mujer con vestido azul caminando por la terraza hacia las vistas de la caldera',
        caption: 'De camino a la terraza',
        aspectRatio: 'portrait',
        isBlackAndWhite: false
      },
      {
        id: 'be-gal-5',
        url: publicImage('sec4-foto1-v.jpg'),
        alt: 'Pareja desayunando frente a la caldera de Santorini',
        caption: 'Desayuno frente a la caldera',
        aspectRatio: 'portrait',
        isBlackAndWhite: false
      },
      {
        id: 'be-gal-6',
        url: publicImage('sec4-gal05-desayuno-v.jpg'),
        alt: 'Rodajas de sandía servidas en el buffet de desayuno',
        caption: 'Sabores de la isla en el desayuno',
        aspectRatio: 'portrait',
        isBlackAndWhite: false
      },
      {
        id: 'be-gal-7',
        url: publicImage('sec4-foto2-c.jpg'),
        alt: 'Arquitectura de cúpulas blancas de Honeymoon Petra Villas con el mar Egeo al fondo',
        caption: 'Cúpulas blancas sobre el Egeo',
        aspectRatio: 'square',
        isBlackAndWhite: false
      },
      {
        id: 'be-gal-8',
        url: publicImage('sec4-gal06-piscina-mujer-v.jpg'),
        alt: 'Mujer bajo la sombrilla de Honeymoon Petra al borde de la piscina',
        caption: 'Sombra al borde de la piscina',
        aspectRatio: 'portrait',
        isBlackAndWhite: false
      },
      {
        id: 'be-gal-9',
        url: publicImage('sec4-gal07-piscina-cruceros-v.jpg'),
        alt: 'Piscina infinita con vistas a los cruceros anclados en la caldera',
        caption: 'La piscina, frente a los cruceros en la caldera',
        aspectRatio: 'portrait',
        isBlackAndWhite: false
      },
      {
        id: 'be-gal-10',
        url: publicImage('sec4-gal08-piscina-panorama-h.jpg'),
        alt: 'Vista panorámica de la piscina con la caldera y los cruceros al fondo',
        caption: 'Toda la caldera, desde la piscina',
        aspectRatio: 'landscape',
        isBlackAndWhite: false
      },
      {
        id: 'be-gal-11',
        url: publicImage('sec4-foto3-h.jpg'),
        alt: 'Piscina infinita sobre los acantilados de Imerovigli',
        caption: 'La piscina, un balcón de piedra sobre la caldera',
        aspectRatio: 'landscape',
        isBlackAndWhite: false
      },
      {
        id: 'be-gal-12',
        url: publicImage('sec4-gal09-piscina-imerovigli-v.jpg'),
        alt: 'Reflejo del sol en la piscina infinita con las casas blancas de Imerovigli detrás',
        caption: 'Últimos reflejos sobre Imerovigli',
        aspectRatio: 'portrait',
        isBlackAndWhite: false
      }
    ]
  },
  {
    id: 'gpro-valparaiso',
    hotelName: 'GPRO VALPARAÍSO PALACE & SPA',
    leftTag: 'PALACIO',
    coupleName: 'Spa mediterráneo',
    location: 'Bonanova, Palma de Mallorca',
    country: 'España',
    year: '2026',
    category: 'Luxury Hotel',
    layoutVariant: 4,
    publishedByHotel: true,
    caseStudy: {
      season: 'Verano · 2023, 2024 y 2026',
      duration: '5 días',
      usage: 'Redes sociales · Campaña de temporada alta',
    },
    coverImage: publicImage('sec5-portada.jpg'),
    description:
      'En lo alto del barrio de Bonanova, rodeado de jardines privados con vistas a la Bahía de Palma, GPRO Valparaíso Palace & Spa alberga el spa más grande de Mallorca, un retiro sereno de agua, piedra y vegetación mediterránea.',
    quote: 'Jardines, agua y la Bahía de Palma extendiéndose más allá de cada terraza.',
    photos: [
      {
        id: 'hd-1',
        url: publicImage('sec5-foto1-h.jpg'),
        alt: 'Piscina interior del spa con cascada de agua',
        caption: 'El spa más grande de Mallorca',
        aspectRatio: 'landscape',
        isBlackAndWhite: false
      },
      {
        id: 'hd-2',
        url: publicImage('sec5-foto2-v.jpg'),
        alt: 'Llegada a la habitación con una maleta y un plato de frutas de bienvenida',
        caption: 'Llegada a la suite',
        aspectRatio: 'portrait',
        isBlackAndWhite: false
      },
      {
        id: 'hd-3',
        url: publicImage('sec5-foto3-v.jpg'),
        alt: 'Huésped en albornoz leyendo el folleto de tratamientos con vistas a la Bahía de Palma',
        caption: 'Tratamientos con vistas a la bahía',
        aspectRatio: 'portrait',
        isBlackAndWhite: false
      }
    ],
    galleryPhotos: [
      {
        id: 'hd-gal-1',
        url: publicImage('sec5-gal01-recepcion-h.jpg'),
        alt: 'Anfitrión recibiendo a un huésped en el mostrador de recepción de GPRO Valparaíso',
        caption: 'Recepción, la primera bienvenida',
        aspectRatio: 'landscape',
        isBlackAndWhite: false
      },
      {
        id: 'hd-gal-2',
        url: publicImage('sec5-gal10-cartel-jardin-v.jpg'),
        alt: 'Cartel del jardín señalando la Piscina, el Hall, Gamba Palace, Wellness & Spa, Tenis y el Bistro Mar Blau',
        caption: 'Un vistazo al mapa del complejo',
        aspectRatio: 'portrait',
        isBlackAndWhite: false
      },
      {
        id: 'hd-gal-3',
        url: publicImage('sec5-foto2-v.jpg'),
        alt: 'Llegada a la habitación con una maleta y un plato de frutas de bienvenida',
        caption: 'Llegada a la suite',
        aspectRatio: 'portrait',
        isBlackAndWhite: false
      },
      {
        id: 'hd-gal-4',
        url: publicImage('sec5-gal03-cafe-cama-v.jpg'),
        alt: 'Mano levantando una taza de café sobre la cama, con el cabecero de cuero mostaza detrás',
        caption: 'Café, buenos días',
        aspectRatio: 'portrait',
        isBlackAndWhite: false
      },
      {
        id: 'hd-gal-5',
        url: publicImage('sec5-gal02-cava-v.jpg'),
        alt: 'Botella de cava Codorníu Cuvée Original con dos copas y la tarjeta de GPRO Valparaíso Palace & Spa sobre la cama',
        caption: 'Una bienvenida con cava en la habitación',
        aspectRatio: 'portrait',
        isBlackAndWhite: false
      },
      {
        id: 'hd-gal-6',
        url: publicImage('sec5-gal04-silueta-cortina-v.jpg'),
        alt: 'Silueta de una mujer en albornoz blanco abriendo la cortina hacia el balcón con vistas a la bahía',
        caption: 'La luz de la mañana entra en la suite',
        aspectRatio: 'portrait',
        isBlackAndWhite: false
      },
      {
        id: 'hd-gal-7',
        url: publicImage('sec5-foto3-v.jpg'),
        alt: 'Huésped en albornoz leyendo el folleto de tratamientos con vistas a la Bahía de Palma',
        caption: 'Tratamientos con vistas a la bahía',
        aspectRatio: 'portrait',
        isBlackAndWhite: false
      },
      {
        id: 'hd-gal-8',
        url: publicImage('sec5-gal05-sauna-v.jpg'),
        alt: 'Silueta de una mujer sentada en la sauna, con luz cálida detrás iluminando los paneles de madera',
        caption: 'Un momento de calma en la sauna',
        aspectRatio: 'portrait',
        isBlackAndWhite: false
      },
      {
        id: 'hd-gal-9',
        url: publicImage('sec5-foto1-h.jpg'),
        alt: 'Piscina interior del spa con cascada de agua y arquitectura de mármol verde',
        caption: 'El spa más grande de Mallorca',
        aspectRatio: 'landscape',
        isBlackAndWhite: false
      },
      {
        id: 'hd-gal-10',
        url: publicImage('sec5-gal06-jacuzzi-spa-h.jpg'),
        alt: 'Pareja relajándose en el jacuzzi interior del spa con vistas al jardín tropical',
        caption: 'El jacuzzi del spa, frente al jardín',
        aspectRatio: 'landscape',
        isBlackAndWhite: false
      },
      {
        id: 'hd-gal-11',
        url: publicImage('sec5-gal07-piscina-bali-h.jpg'),
        alt: 'Piscina exterior de GPRO con palmeras y camas balinesas junto al agua',
        caption: 'La piscina exterior, entre las palmeras',
        aspectRatio: 'landscape',
        isBlackAndWhite: false
      },
      {
        id: 'hd-gal-12',
        url: publicImage('sec5-gal08-piernas-frutas-v.jpg'),
        alt: 'Piernas al borde de la piscina con una naranja, una manzana y una nectarina en el borde',
        caption: 'El borde de la piscina, con fruta',
        aspectRatio: 'portrait',
        isBlackAndWhite: false
      },
      {
        id: 'hd-gal-13',
        url: publicImage('sec5-gal09-piscina-palmeras-v.jpg'),
        alt: 'Piscina exterior del complejo con palmeras altas y cielo abierto',
        caption: 'Palmeras y cielo abierto',
        aspectRatio: 'portrait',
        isBlackAndWhite: false
      }
    ]
  },
  {
    id: 'hotel-esplendido',
    hotelName: 'HOTEL ESPLÉNDIDO',
    leftTag: 'HOTEL',
    coupleName: 'Bahía y piedra',
    location: 'Port de Sóller, Mallorca',
    country: 'España',
    year: '2026',
    category: 'Luxury Hotel',
    layoutVariant: 5,
    caseStudy: {
      season: 'Julio · 2024 y 2026',
      duration: '3 días',
      usage: 'Redes sociales',
    },
    coverImage: publicImage('sec6-portada.jpg'),
    description:
      'En el paseo marítimo de la Bahía de Port de Sóller, con la Serra de Tramuntana de fondo, Hotel Espléndido combina fachadas de piedra caliza, terrazas frente al mar y el tranvía histórico que todavía recorre el paseo.',
    quote: 'Piedra, mar y el eco del tranvía sobre los adoquines de Sóller.',
    photos: [
      {
        id: 'vde-1',
        url: publicImage('sec6-foto1-c.jpg'),
        alt: 'Entrada al Hotel Espléndido con el bistró Davant la Mar',
        caption: 'La entrada, en el paseo marítimo',
        aspectRatio: 'square',
        isBlackAndWhite: false
      },
      {
        id: 'vde-2',
        url: publicImage('sec6-foto2-v.jpg'),
        alt: 'Vista elevada del tranvía histórico y la playa de Port de Sóller',
        caption: 'El tranvía histórico junto a la bahía',
        aspectRatio: 'portrait',
        isBlackAndWhite: false
      },
      {
        id: 'vde-3',
        url: publicImage('sec6-foto3-h.jpg'),
        alt: 'Pareja conversando en la terraza con vistas a la Bahía de Sóller',
        caption: 'Terraza frente a la bahía',
        aspectRatio: 'landscape',
        isBlackAndWhite: false
      }
    ],
    galleryPhotos: [
      {
        id: 'vde-gal-1',
        url: publicImage('sec6-gal01-fachada-noche-h.jpg'),
        alt: 'Fachada del Hotel Espléndido iluminada de noche, con el tranvía naranja de época y la terraza del bistró',
        caption: 'La fachada, al caer la noche',
        aspectRatio: 'landscape',
        isBlackAndWhite: false
      },
      {
        id: 'vde-gal-2',
        url: publicImage('sec6-gal02-guia-flatlay-v.jpg'),
        alt: 'La guía del Hotel Espléndido de Sóller abierta sobre la cama, con un sombrero de paja y una mandarina',
        caption: 'La guía del hotel, sobre la cama',
        aspectRatio: 'portrait',
        isBlackAndWhite: false
      },
      {
        id: 'vde-gal-3',
        url: publicImage('sec6-gal03-detalle-habitacion-v.jpg'),
        alt: 'Detalle de la habitación con cabecero de cuero, una lámpara encendida, un sillón turquesa y un sombrero de paja',
        caption: 'Un detalle de la habitación',
        aspectRatio: 'portrait',
        isBlackAndWhite: false
      },
      {
        id: 'vde-gal-4',
        url: publicImage('sec6-gal04-spa-entrada-v.jpg'),
        alt: 'Mujer con cesta de mimbre y kaftán de encaje entrando al spa del Hotel Espléndido',
        caption: 'De camino al spa',
        aspectRatio: 'portrait',
        isBlackAndWhite: false
      },
      {
        id: 'vde-gal-5',
        url: publicImage('sec6-gal05-spa-interior-h.jpg'),
        alt: 'Piscina interior del spa iluminada en turquesa con una celosía blanca decorativa',
        caption: 'La piscina interior del spa',
        aspectRatio: 'landscape',
        isBlackAndWhite: false
      },
      {
        id: 'vde-gal-6',
        url: publicImage('sec6-gal06-bahia-panoramica-v.jpg'),
        alt: 'Panorámica de la Bahía de Port de Sóller con gaviotas, veleros y la playa de piedras blancas',
        caption: 'La Bahía de Sóller, entre las gaviotas',
        aspectRatio: 'portrait',
        isBlackAndWhite: false
      },
      {
        id: 'vde-gal-7',
        url: publicImage('sec6-gal07-playa-vestido-v.jpg'),
        alt: 'Mujer con vestido turquesa sentada en la playa de piedras, vista desde la habitación entre las palmeras',
        caption: 'La playa, vista desde la habitación',
        aspectRatio: 'portrait',
        isBlackAndWhite: false
      },
      {
        id: 'vde-gal-8',
        url: publicImage('sec6-gal08-piscina-pareja-h.jpg'),
        alt: 'Pareja nadando en la piscina de la azotea con vistas a la Bahía de Sóller y su faro',
        caption: 'La piscina, frente al faro',
        aspectRatio: 'landscape',
        isBlackAndWhite: false
      },
      {
        id: 'vde-gal-9',
        url: publicImage('sec6-gal09-piscina-coco-v.jpg'),
        alt: 'Mujer con bañador blanco al borde de la piscina de la azotea bebiendo de un coco verde',
        caption: 'Un coco al borde de la piscina',
        aspectRatio: 'portrait',
        isBlackAndWhite: false
      },
      {
        id: 'vde-gal-10',
        url: publicImage('sec6-gal10-piscina-copa-v.jpg'),
        alt: 'Piernas al borde de la piscina con una copa de cava y la guía del Hotel Espléndido de Sóller abierta',
        caption: 'Cava y la guía al sol',
        aspectRatio: 'portrait',
        isBlackAndWhite: false
      },
      {
        id: 'vde-gal-11',
        url: publicImage('sec6-foto1-c.jpg'),
        alt: 'Entrada al Hotel Espléndido con el bistró Davant la Mar y sus flores rojas',
        caption: 'La entrada, en el paseo marítimo',
        aspectRatio: 'square',
        isBlackAndWhite: false
      },
      {
        id: 'vde-gal-12',
        url: publicImage('sec6-foto3-h.jpg'),
        alt: 'Pareja conversando en la terraza con vistas a la Bahía de Sóller',
        caption: 'Terraza frente a la bahía',
        aspectRatio: 'landscape',
        isBlackAndWhite: false
      },
      {
        id: 'vde-gal-13',
        url: publicImage('sec6-foto2-v.jpg'),
        alt: 'Vista elevada del tranvía histórico y la playa de Port de Sóller',
        caption: 'El tranvía histórico junto a la bahía',
        aspectRatio: 'portrait',
        isBlackAndWhite: false
      }
    ]
  },
  {
    id: 'district-hive',
    hotelName: 'DISTRICT HIVE',
    leftTag: 'CÁPSULA',
    coupleName: 'Fuera de la red, en el desierto',
    location: 'Gorafe, Granada',
    country: 'España',
    year: '2026',
    category: 'Romantic Escape',
    layoutVariant: 8,
    caseStudy: {
      season: 'Octubre · Otoño',
      duration: '4 días',
      usage: 'Redes sociales',
    },
    coverImage: publicImage('sec9-foto1-v.jpg'),
    description:
      'En pleno desierto de Gorafe, District Hive es una cápsula de cristal y acero suspendida sobre el paisaje de Granada, con una arquitectura pensada para dejar la menor huella posible y desaparecer en el paisaje, rodeada del silencio del interior de Andalucía.',
    quote: 'Todo el cielo como techo, todo el paisaje como horizonte.',
    photos: [
      {
        id: 'dh-1',
        url: publicImage('sec9-foto1-v.jpg'),
        alt: 'Hombre caminando junto a la cápsula de cristal y acero de District Hive en el desierto de Gorafe',
        caption: 'Un paseo junto a la cápsula',
        aspectRatio: 'portrait',
        isBlackAndWhite: false
      },
      {
        id: 'dh-2',
        url: publicImage('sec9-foto2-v.jpg'),
        alt: 'Logo hexagonal de District Hive en la ventana, con el paisaje de Gorafe al fondo',
        caption: 'El logo, sobre el desierto',
        aspectRatio: 'portrait',
        isBlackAndWhite: false
      },
      {
        id: 'dh-3',
        url: publicImage('sec9-foto3-h.jpg'),
        alt: 'Cápsula de cristal de District Hive con su piscina exterior suspendida sobre el paisaje de Gorafe',
        caption: 'La cápsula, con su piscina sobre el desierto',
        aspectRatio: 'landscape',
        isBlackAndWhite: false
      }
    ],
    galleryPhotos: [
      {
        id: 'dh-gal-1',
        url: publicImage('sec9-gal06-panoramica-h.jpg'),
        alt: 'Panorámica del paisaje de Gorafe con el embalse y un pueblo blanco al fondo',
        caption: 'El paisaje de Gorafe, hasta el embalse',
        aspectRatio: 'landscape',
        isBlackAndWhite: false
      },
      {
        id: 'dh-gal-2',
        url: publicImage('sec9-gal02-badlands-aerea-v.jpg'),
        alt: 'Vista aérea elevada del desierto de Gorafe con la propiedad apenas visible a lo lejos',
        caption: 'La propiedad, apenas visible en el desierto',
        aspectRatio: 'portrait',
        isBlackAndWhite: false
      },
      {
        id: 'dh-gal-3',
        url: publicImage('sec9-foto1-v.jpg'),
        alt: 'Hombre caminando junto a la cápsula de cristal y acero de District Hive',
        caption: 'Un paseo junto a la cápsula',
        aspectRatio: 'portrait',
        isBlackAndWhite: false
      },
      {
        id: 'dh-gal-4',
        url: publicImage('sec9-gal05-atardecer-v.jpg'),
        alt: 'Mujer caminando hacia la cápsula al atardecer con el logo de District Hive visible en su lateral',
        caption: 'La cápsula, al caer la tarde',
        aspectRatio: 'portrait',
        isBlackAndWhite: false
      },
      {
        id: 'dh-gal-5',
        url: publicImage('sec9-gal01-aerea-h.jpg'),
        alt: 'Vista aérea de la cápsula de District Hive al borde del cañón en el desierto de Gorafe',
        caption: 'La cápsula, al borde del cañón',
        aspectRatio: 'landscape',
        isBlackAndWhite: false
      },
      {
        id: 'dh-gal-6',
        url: publicImage('sec9-foto2-v.jpg'),
        alt: 'Logo hexagonal de District Hive en la ventana, con el paisaje de Gorafe al fondo',
        caption: 'El logo, sobre el desierto',
        aspectRatio: 'portrait',
        isBlackAndWhite: false
      },
      {
        id: 'dh-gal-7',
        url: publicImage('sec9-gal03-ducha-v.jpg'),
        alt: 'Ducha exterior de District Hive con la cápsula al fondo, entre grava y tierra roja',
        caption: 'La ducha exterior, junto a la cápsula',
        aspectRatio: 'portrait',
        isBlackAndWhite: false
      },
      {
        id: 'dh-gal-8',
        url: publicImage('sec9-foto3-h.jpg'),
        alt: 'Cápsula de cristal de District Hive con su piscina exterior suspendida sobre el paisaje',
        caption: 'La cápsula, con su piscina sobre el desierto',
        aspectRatio: 'landscape',
        isBlackAndWhite: false
      },
      {
        id: 'dh-gal-9',
        url: publicImage('sec9-gal04-jacuzzi-h.jpg'),
        alt: 'La cápsula vista desde el jacuzzi exterior con las montañas al fondo',
        caption: 'La cápsula, vista desde el jacuzzi',
        aspectRatio: 'landscape',
        isBlackAndWhite: false
      }
    ]
  },
  {
    id: 'welmoon-villas',
    hotelName: 'WELMOON VILLAS PAISAJE',
    leftTag: 'GLAMPING',
    coupleName: 'Bajo las estrellas',
    location: 'Caravaca de la Cruz, Murcia',
    country: 'España',
    year: '2026',
    category: 'Romantic Escape',
    layoutVariant: 7,
    caseStudy: {
      season: 'Marzo · Primavera',
      duration: '3 días',
      usage: 'Redes sociales',
    },
    coverImage: publicImage('sec8-portada.jpg'),
    description:
      'Entre los pinares de Caravaca de la Cruz, las villas abovedadas de Welmoon Paisaje están diseñadas para dormir bajo un manto de estrellas: arquitectura íntima, hecha para desconectar del ruido y mirar el cielo sin filtros.',
    quote: 'Un techo de estrellas y el silencio de la sierra murciana.',
    photos: [
      {
        id: 'sdp-1',
        url: publicImage('sec8-foto1-c.jpg'),
        alt: 'Telescopio y tumbona en la terraza de madera entre los pinos',
        caption: 'Lista para observar las estrellas',
        aspectRatio: 'square',
        isBlackAndWhite: false
      },
      {
        id: 'sdp-2',
        url: publicImage('sec8-foto2-c.jpg'),
        alt: 'Pareja relajándose en la cama exterior con la villa abovedada al fondo',
        caption: 'La cama exterior, junto a la villa',
        aspectRatio: 'square',
        isBlackAndWhite: false
      },
      {
        id: 'sdp-3',
        url: publicImage('sec8-foto3-h.jpg'),
        alt: 'Interior de la villa abovedada con techo de cristal y vistas al bosque',
        caption: 'El techo de cristal hacia el bosque',
        aspectRatio: 'landscape',
        isBlackAndWhite: false
      }
    ],
    galleryPhotos: [
      {
        id: 'sdp-gal-1',
        url: publicImage('sec8-gal01-fachada-v.jpg'),
        alt: 'Fachada de madera de la villa abovedada Welmoon Paisaje entre los pinos, con un banco con cojines en la terraza',
        caption: 'La villa, entre los pinos',
        aspectRatio: 'portrait',
        isBlackAndWhite: false
      },
      {
        id: 'sdp-gal-2',
        url: publicImage('sec8-gal02-cats-h.jpg'),
        alt: 'Dos gatos atigrados sobre el felpudo de "Welmoon" en la entrada de la villa',
        caption: 'El comité de bienvenida de Welmoon',
        aspectRatio: 'landscape',
        isBlackAndWhite: false
      },
      {
        id: 'sdp-gal-3',
        url: publicImage('sec8-gal03-interior-cama-h.jpg'),
        alt: 'Interior de la villa abovedada con cama, cojines y vistas hacia el baño de mármol y el bosque',
        caption: 'El interior, bajo el techo abovedado',
        aspectRatio: 'landscape',
        isBlackAndWhite: false
      },
      {
        id: 'sdp-gal-4',
        url: publicImage('sec8-gal04-bano-v.jpg'),
        alt: 'Baño de la villa con lavabo de piedra, un espejo circular y hierba de las pampas',
        caption: 'El baño, entre madera y piedra',
        aspectRatio: 'portrait',
        isBlackAndWhite: false
      },
      {
        id: 'sdp-gal-5',
        url: publicImage('sec8-gal05-amenities-v.jpg'),
        alt: 'Detalle de amenities de Welmoon: tarros de marca, una toalla bordada y una caja de bienvenida con un corazón',
        caption: 'El detalle Welmoon',
        aspectRatio: 'portrait',
        isBlackAndWhite: false
      },
      {
        id: 'sdp-gal-6',
        url: publicImage('sec8-gal06-vista-bosque-h.jpg'),
        alt: 'Vista del pinar desde la cama, a través del gran ventanal abovedado',
        caption: 'El pinar, desde la cama',
        aspectRatio: 'landscape',
        isBlackAndWhite: false
      },
      {
        id: 'sdp-gal-7',
        url: publicImage('sec8-foto3-h.jpg'),
        alt: 'Interior de la villa abovedada con techo de cristal y vistas al bosque',
        caption: 'El techo de cristal hacia el bosque',
        aspectRatio: 'landscape',
        isBlackAndWhite: false
      },
      {
        id: 'sdp-gal-8',
        url: publicImage('sec8-gal07-desayuno-v.jpg'),
        alt: 'Desayuno servido en la mesa de madera con un cruasán, fruta, mermelada y una lámpara cálida',
        caption: 'Desayuno, entre madera cálida',
        aspectRatio: 'portrait',
        isBlackAndWhite: false
      },
      {
        id: 'sdp-gal-9',
        url: publicImage('sec8-foto1-c.jpg'),
        alt: 'Telescopio y tumbona en la terraza de madera entre los pinos',
        caption: 'Lista para observar las estrellas',
        aspectRatio: 'square',
        isBlackAndWhite: false
      },
      {
        id: 'sdp-gal-10',
        url: publicImage('sec8-foto2-c.jpg'),
        alt: 'Pareja relajándose en la cama exterior con la villa abovedada al fondo',
        caption: 'La cama exterior, junto a la villa',
        aspectRatio: 'square',
        isBlackAndWhite: false
      },
      {
        id: 'sdp-gal-11',
        url: publicImage('sec8-gal08-jacuzzi-noche-v.jpg'),
        alt: 'Bañera de madera con estufa de leña y velas encendidas en la terraza, cielo nocturno entre los pinos',
        caption: 'El jacuzzi a la luz de las velas',
        aspectRatio: 'portrait',
        isBlackAndWhite: false
      }
    ]
  }
];
