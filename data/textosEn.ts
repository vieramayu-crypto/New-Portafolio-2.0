import type { HotelStory, PhotoItem, Testimonial } from '../types';
import type { CaseStudy } from './caseStudies';
import type { Idioma } from '../src/lib/idioma';

/** LA CAPA INGLESA DE LOS DATOS.
 *
 *  `data/hotels.ts` tiene 1.300 líneas y `caseStudies.ts` y `collaborations.ts`
 *  van llenos de comentarios que explican por qué cada cosa está donde está.
 *  Meter un campo inglés al lado de cada campo español los habría duplicado de
 *  tamaño y habría enterrado esos comentarios. Así que el inglés vive aquí,
 *  aparte, y se aplica al pintar.
 *
 *  LOS TEXTOS ALTERNATIVOS VAN INDEXADOS POR SU PROPIO TEXTO ESPAÑOL, no por
 *  el id de la foto. Hay 129 en la web y sólo 112 distintos: varias fotos del
 *  avance de Inicio se repiten en la galería del hotel, y con esta forma de
 *  indexar se traducen una vez sola en vez de dos.
 *
 *  NO HAY GUIONES QUE SEPAREN IDEAS en ninguna de estas frases, igual que en
 *  el resto de la web. Los únicos permitidos son los de un nombre propio.
 *
 *  SI FALTA UNA TRADUCCIÓN, SE QUEDA EL ESPAÑOL. Nunca se pinta la clave ni un
 *  hueco: una frase en español dentro de la web inglesa se ve raro, pero una
 *  foto sin texto alternativo deja de existir para quien navega con lector de
 *  pantalla, y eso es peor.
 */

/** Textos alternativos de las fotos, en inglés. */
export const ALT_EN: Record<string, string> = {
  // The Ritz-Carlton Tenerife, Abama
  'Vista aérea del resort Abama entre plataneras y el campo de golf':
    'Aerial view of the Abama resort between banana groves and the golf course',
  'Mujer bajando la escalinata de terracota junto al estanque de Abama':
    'A woman walking down the terracotta steps beside the pond at Abama',
  'Cabaña de bambú con una clase de yoga entre palmeras':
    'Bamboo pavilion with a yoga class among the palm trees',
  'Fachada de terracota de Abama entre palmeras y fuentes escalonadas':
    'The terracotta facade of Abama among palm trees and stepped fountains',
  'Mujer caminando con una cámara en mano frente a la fachada del resort':
    'A woman walking with a camera in hand in front of the resort facade',
  'Detalle de la habitación: mesita de noche y lámpara colgante junto a la cama':
    'Detail of the room: bedside table and pendant lamp beside the bed',
  'Vista elevada de la cala de Abama con sombrillas y tumbonas':
    'Elevated view of the Abama cove with parasols and sun loungers',
  'Reflejo simétrico de las palmeras y la fachada en un estanque':
    'Symmetrical reflection of the palm trees and the facade in a pond',
  'Piscina principal del resort entre palmeras y jardines ornamentales':
    "The resort's main pool among palm trees and ornamental gardens",
  'Cabaña de bambú con una clase de yoga entre palmeras, junto al campo de golf':
    'Bamboo pavilion with a yoga class among the palm trees, beside the golf course',
  'Tratamiento con piedras calientes en el spa del resort':
    'Hot stone treatment in the resort spa',
  'Plato de alta cocina servido en el restaurante del resort':
    'A fine dining dish served in the resort restaurant',

  // InterContinental Lisboa
  'Vista vertical de la fachada del InterContinental Lisboa, el edificio completo sobre la colina':
    'Vertical view of the InterContinental Lisboa facade, the whole building on the hill',
  'El tranvía amarillo número 28 pasando por una calle empedrada de Lisboa':
    'The yellow number 28 tram passing along a cobbled street in Lisbon',
  'Camarero sirviendo café con un vaso de zumo de naranja en primer plano':
    'A waiter pouring coffee with a glass of orange juice in the foreground',
  'Vista en esquina de la fachada del InterContinental Lisboa, con la marquesina de la entrada':
    'Corner view of the InterContinental Lisboa facade, with the entrance canopy',
  'Recepción del hotel con mostrador dorado y un panel de mármol azul iluminado':
    'The hotel reception with a gold counter and a lit blue marble panel',
  'Vestíbulo del hotel con lámparas colgantes de globos de cristal ámbar':
    'The hotel lobby with pendant lamps of amber glass globes',
  'Escritorio en la habitación con portátil y lámpara junto a la ventana con vistas al skyline de Lisboa':
    'The desk in the room with a laptop and a lamp beside the window looking over the Lisbon skyline',
  'Detalle de la cama con cojines bordados en turquesa y lámparas encendidas':
    'Detail of the bed with turquoise embroidered cushions and the lamps lit',
  'Camarero sirviendo el desayuno en la suite': 'A waiter serving breakfast in the suite',
  'Vista cenital del desayuno servido en la habitación':
    'Overhead view of breakfast served in the room',
  'Pareja en albornoces blancos brindando con zumo de naranja en la cama, con el desayuno servido delante':
    'A couple in white robes toasting with orange juice on the bed, breakfast served in front of them',
  'Silueta de una mujer abriendo la cortina a contraluz de la mañana':
    'The silhouette of a woman opening the curtain against the morning light',
  'Luces y sombras de las cortinas cayendo sobre la alfombra del dormitorio':
    'Light and shadow from the curtains falling across the bedroom carpet',
  'Mujer corriendo en una cinta en el gimnasio del hotel':
    'A woman running on a treadmill in the hotel gym',
  'Lámpara y planta sobre una mesa de mármol en el restaurante al anochecer':
    'A lamp and a plant on a marble table in the restaurant at dusk',

  // Vestige Collection, Binidufà
  'Vista aérea de la finca Vestige Binidufà entre olivos y campos al norte de Menorca':
    'Aerial view of the Vestige Binidufà estate among olive trees and fields in the north of Menorca',
  'Mujer caminando por el camino de tierra hacia las casas de piedra de la finca':
    'A woman walking along the dirt track towards the stone houses of the estate',
  'Gran vasija de barro y una planta en un rincón de paredes encaladas':
    'A large clay vessel and a plant in a corner of whitewashed walls',
  'Vista aérea de la finca entre campos de cultivo y colinas':
    'Aerial view of the estate among farmed fields and hills',
  'Fachada de piedra de la finca con tumbonas y una sombrilla en la terraza':
    'The stone facade of the estate with sun loungers and a parasol on the terrace',
  'Hombre caminando por el salón rústico de techos de madera':
    'A man walking through the rustic living room with its timber ceilings',
  'Mujer leyendo en un sillón bajo un arco de piedra junto a la habitación':
    'A woman reading in an armchair under a stone arch beside the room',
  'Gimnasio abovedado con vistas al mar a través de una ventana en arco':
    'A vaulted gym looking out to sea through an arched window',
  'Ganado pastando en los campos que rodean la finca':
    'Cattle grazing in the fields around the estate',
  'Vista aérea de la piscina ovalada entre tumbonas y vegetación':
    'Aerial view of the oval pool among sun loungers and greenery',
  'Mujer en albornoz sentada en la habitación junto a un muro de piedra':
    'A woman in a robe sitting in the room beside a stone wall',

  // Deltapark Vitalresort
  'Servicio de café y folleto de Deltapark Vitalresort sobre la cama':
    'Coffee service and the Deltapark Vitalresort booklet on the bed',
  'Vista aérea del complejo junto al lago Thun': 'Aerial view of the resort beside Lake Thun',
  'Cesta de mimbre con toallas recién lavadas junto a la entrada':
    'A wicker basket of freshly washed towels beside the entrance',
  'Chimenea de diseño en el vestíbulo del complejo':
    'A sculptural fireplace in the resort lobby',
  'Mujer con albornoz de Deltapark caminando por el jardín hacia el complejo':
    'A woman in a Deltapark robe walking through the garden towards the resort',
  'Mujer en albornoz tomando café en el balcón de la habitación':
    'A woman in a robe drinking coffee on the room balcony',
  'Café y una manzana sobre un albornoz de Deltapark en la cama':
    'Coffee and an apple on a Deltapark robe laid on the bed',
  'Mujer sentada en la sauna de madera del spa':
    'A woman sitting in the timber sauna of the spa',
  'Mujer en albornoz sentada frente a las vistas al lago desde la zona de relajación':
    'A woman in a robe sitting before the lake views from the relaxation area',
  'Atardecer sobre el lago Thun con veleros amarrados':
    'Sunset over Lake Thun with sailing boats moored',
  'Fachada del complejo iluminada al anochecer entre los árboles':
    'The resort facade lit at dusk among the trees',
  'Vista aérea cenital del complejo junto al lago':
    'Overhead aerial view of the resort beside the lake',

  // Honeymoon Petra Villas
  'Pareja desayunando frente a la caldera de Santorini':
    'A couple having breakfast facing the Santorini caldera',
  'Arquitectura de cúpulas blancas de Honeymoon Petra Villas con el mar Egeo al fondo':
    'The white domed architecture of Honeymoon Petra Villas with the Aegean behind',
  'Piscina infinita sobre los acantilados de Imerovigli':
    'Infinity pool above the cliffs of Imerovigli',
  'Entrada a Honeymoon Petra Villas con la cúpula azul de una iglesia al fondo':
    'The entrance to Honeymoon Petra Villas with a blue church dome behind',
  'Sombrero y toalla bordada de Honeymoon Petra sobre la cama':
    'A hat and an embroidered Honeymoon Petra towel on the bed',
  'Habitación con cabecero de madera y un cojín bordado de Honeymoon Petra Villas':
    'The room with a timber headboard and an embroidered Honeymoon Petra Villas cushion',
  'Mujer con vestido azul caminando por la terraza hacia las vistas de la caldera':
    'A woman in a blue dress walking along the terrace towards the caldera views',
  'Rodajas de sandía servidas en el buffet de desayuno':
    'Slices of watermelon served at the breakfast buffet',
  'Mujer bajo la sombrilla de Honeymoon Petra al borde de la piscina':
    'A woman under the Honeymoon Petra parasol at the edge of the pool',
  'Piscina infinita con vistas a los cruceros anclados en la caldera':
    'Infinity pool looking out to the cruise ships anchored in the caldera',
  'Vista panorámica de la piscina con la caldera y los cruceros al fondo':
    'Panoramic view of the pool with the caldera and the cruise ships behind',
  'Reflejo del sol en la piscina infinita con las casas blancas de Imerovigli detrás':
    'Sunlight reflected in the infinity pool with the white houses of Imerovigli behind',

  // GPRO Valparaíso Palace & Spa
  'Piscina interior del spa con cascada de agua': 'The indoor spa pool with its water cascade',
  'Llegada a la habitación con una maleta y un plato de frutas de bienvenida':
    'Arrival in the room with a suitcase and a welcome plate of fruit',
  'Huésped en albornoz leyendo el folleto de tratamientos con vistas a la Bahía de Palma':
    'A guest in a robe reading the treatments booklet with views over the Bay of Palma',
  'Anfitrión recibiendo a un huésped en el mostrador de recepción de GPRO Valparaíso':
    'A host welcoming a guest at the GPRO Valparaíso reception desk',
  'Cartel del jardín señalando la Piscina, el Hall, Gamba Palace, Wellness & Spa, Tenis y el Bistro Mar Blau':
    'The garden sign pointing to the Pool, the Hall, Gamba Palace, Wellness & Spa, Tennis and the Bistro Mar Blau',
  'Mano levantando una taza de café sobre la cama, con el cabecero de cuero mostaza detrás':
    'A hand lifting a cup of coffee over the bed, with the mustard leather headboard behind',
  'Botella de cava Codorníu Cuvée Original con dos copas y la tarjeta de GPRO Valparaíso Palace & Spa sobre la cama':
    'A bottle of Codorníu Cuvée Original cava with two glasses and the GPRO Valparaíso Palace & Spa card on the bed',
  'Silueta de una mujer en albornoz blanco abriendo la cortina hacia el balcón con vistas a la bahía':
    'The silhouette of a woman in a white robe opening the curtain onto the balcony with views over the bay',
  'Silueta de una mujer sentada en la sauna, con luz cálida detrás iluminando los paneles de madera':
    'The silhouette of a woman sitting in the sauna, warm light behind lighting the timber panels',
  'Piscina interior del spa con cascada de agua y arquitectura de mármol verde':
    'The indoor spa pool with its water cascade and green marble architecture',
  'Pareja relajándose en el jacuzzi interior del spa con vistas al jardín tropical':
    'A couple relaxing in the indoor spa jacuzzi with views over the tropical garden',
  'Piscina exterior de GPRO con palmeras y camas balinesas junto al agua':
    "The outdoor pool at GPRO with palm trees and daybeds at the water's edge",
  'Piernas al borde de la piscina con una naranja, una manzana y una nectarina en el borde':
    'Legs at the edge of the pool with an orange, an apple and a nectarine on the rim',
  'Piscina exterior del complejo con palmeras altas y cielo abierto':
    "The resort's outdoor pool with tall palm trees and open sky",

  // Hotel Espléndido
  'Entrada al Hotel Espléndido con el bistró Davant la Mar':
    'The entrance to Hotel Espléndido with the Davant la Mar bistro',
  'Vista elevada del tranvía histórico y la playa de Port de Sóller':
    'Elevated view of the historic tram and the beach at Port de Sóller',
  'Pareja conversando en la terraza con vistas a la Bahía de Sóller':
    'A couple talking on the terrace with views over the Bay of Sóller',
  'Fachada del Hotel Espléndido iluminada de noche, con el tranvía naranja de época y la terraza del bistró':
    'The Hotel Espléndido facade lit at night, with the vintage orange tram and the bistro terrace',
  'La guía del Hotel Espléndido de Sóller abierta sobre la cama, con un sombrero de paja y una mandarina':
    'The Hotel Espléndido Sóller guide open on the bed, with a straw hat and a mandarin',
  'Detalle de la habitación con cabecero de cuero, una lámpara encendida, un sillón turquesa y un sombrero de paja':
    'Detail of the room with a leather headboard, a lit lamp, a turquoise armchair and a straw hat',
  'Mujer con cesta de mimbre y kaftán de encaje entrando al spa del Hotel Espléndido':
    'A woman with a wicker basket and a lace kaftan walking into the Hotel Espléndido spa',
  'Piscina interior del spa iluminada en turquesa con una celosía blanca decorativa':
    'The indoor spa pool lit in turquoise with a white decorative lattice',
  'Panorámica de la Bahía de Port de Sóller con gaviotas, veleros y la playa de piedras blancas':
    'Panorama of the Bay of Port de Sóller with gulls, sailing boats and the white pebble beach',
  'Mujer con vestido turquesa sentada en la playa de piedras, vista desde la habitación entre las palmeras':
    'A woman in a turquoise dress sitting on the pebble beach, seen from the room through the palm trees',
  'Pareja nadando en la piscina de la azotea con vistas a la Bahía de Sóller y su faro':
    'A couple swimming in the rooftop pool with views over the Bay of Sóller and its lighthouse',
  'Mujer con bañador blanco al borde de la piscina de la azotea bebiendo de un coco verde':
    'A woman in a white swimsuit at the edge of the rooftop pool drinking from a green coconut',
  'Piernas al borde de la piscina con una copa de cava y la guía del Hotel Espléndido de Sóller abierta':
    'Legs at the edge of the pool with a glass of cava and the Hotel Espléndido Sóller guide open',
  'Entrada al Hotel Espléndido con el bistró Davant la Mar y sus flores rojas':
    'The entrance to Hotel Espléndido with the Davant la Mar bistro and its red flowers',

  // District Hive
  'Hombre caminando junto a la cápsula de cristal y acero de District Hive en el desierto de Gorafe':
    'A man walking beside the glass and steel capsule of District Hive in the Gorafe desert',
  'Logo hexagonal de District Hive en la ventana, con el paisaje de Gorafe al fondo':
    'The hexagonal District Hive logo on the window, with the Gorafe landscape behind',
  'Cápsula de cristal de District Hive con su piscina exterior suspendida sobre el paisaje de Gorafe':
    'The glass capsule of District Hive with its outdoor pool suspended over the Gorafe landscape',
  'Panorámica del paisaje de Gorafe con el embalse y un pueblo blanco al fondo':
    'Panorama of the Gorafe landscape with the reservoir and a white village behind',
  'Vista aérea elevada del desierto de Gorafe con la propiedad apenas visible a lo lejos':
    'High aerial view of the Gorafe desert with the property barely visible in the distance',
  'Hombre caminando junto a la cápsula de cristal y acero de District Hive':
    'A man walking beside the glass and steel capsule of District Hive',
  'Mujer caminando hacia la cápsula al atardecer con el logo de District Hive visible en su lateral':
    'A woman walking towards the capsule at sunset with the District Hive logo on its side',
  'Vista aérea de la cápsula de District Hive al borde del cañón en el desierto de Gorafe':
    'Aerial view of the District Hive capsule at the canyon edge in the Gorafe desert',
  'Ducha exterior de District Hive con la cápsula al fondo, entre grava y tierra roja':
    'The outdoor shower at District Hive with the capsule behind, among gravel and red earth',
  'Cápsula de cristal de District Hive con su piscina exterior suspendida sobre el paisaje':
    'The glass capsule of District Hive with its outdoor pool suspended over the landscape',
  'La cápsula vista desde el jacuzzi exterior con las montañas al fondo':
    'The capsule seen from the outdoor jacuzzi with the mountains behind',

  // Welmoon Villas Paisaje
  'Telescopio y tumbona en la terraza de madera entre los pinos':
    'A telescope and a lounger on the timber deck among the pines',
  'Pareja relajándose en la cama exterior con la villa abovedada al fondo':
    'A couple relaxing on the outdoor bed with the vaulted villa behind',
  'Interior de la villa abovedada con techo de cristal y vistas al bosque':
    'Inside the vaulted villa with its glass roof and views into the forest',
  'Fachada de madera de la villa abovedada Welmoon Paisaje entre los pinos, con un banco con cojines en la terraza':
    'The timber front of the vaulted Welmoon Paisaje villa among the pines, with a cushioned bench on the deck',
  'Dos gatos atigrados sobre el felpudo de "Welmoon" en la entrada de la villa':
    'Two tabby cats on the "Welmoon" doormat at the villa entrance',
  'Interior de la villa abovedada con cama, cojines y vistas hacia el baño de mármol y el bosque':
    'Inside the vaulted villa with the bed, the cushions and views through to the marble bathroom and the forest',
  'Baño de la villa con lavabo de piedra, un espejo circular y hierba de las pampas':
    'The villa bathroom with a stone basin, a round mirror and pampas grass',
  'Detalle de amenities de Welmoon: tarros de marca, una toalla bordada y una caja de bienvenida con un corazón':
    'Detail of the Welmoon amenities: branded jars, an embroidered towel and a welcome box with a heart',
  'Vista del pinar desde la cama, a través del gran ventanal abovedado':
    'The pine wood seen from the bed, through the great vaulted window',
  'Desayuno servido en la mesa de madera con un cruasán, fruta, mermelada y una lámpara cálida':
    'Breakfast served on the timber table with a croissant, fruit, jam and a warm lamp',
  'Bañera de madera con estufa de leña y velas encendidas en la terraza, cielo nocturno entre los pinos':
    'A timber tub with a wood burner and candles lit on the deck, the night sky through the pines',
};

interface HotelEn {
  leftTag?: string;
  location?: string;
  country?: string;
  season?: string;
  duration?: string;
  usage?: string;
}

/** Los datos de ficha de cada hotel. El nombre, el rótulo de pareja, la
 *  descripción y la cita NO están aquí: esos cuatro los sirve `content.en.json`
 *  y se pisan más arriba, en el mismo sitio donde ya se pisaban en español. */
export const HOTEL_EN: Record<string, HotelEn> = {
  'ritz-carlton-abama': {
    leftTag: 'HOTEL',
    location: 'Guía de Isora, Tenerife',
    country: 'Spain',
    season: 'July · Summer',
    duration: '4 days',
    usage: 'Social media',
  },
  'intercontinental-lisboa': {
    leftTag: 'HOTEL',
    location: 'Lisbon',
    country: 'Portugal',
    season: 'September · Summer',
    duration: '3 days',
    usage: 'Social media',
  },
  'vestige-binidufa': {
    leftTag: 'ESTATE',
    location: 'Ferreries, Menorca',
    country: 'Spain',
    season: 'June · Summer',
    duration: '3 days',
    usage: 'Social media',
  },
  'deltapark-vitalresort': {
    leftTag: 'RESORT',
    location: 'Gwatt, Thunersee',
    country: 'Switzerland',
    season: 'September · Summer',
    duration: '3 days',
    usage: 'Social media',
  },
  'honeymoon-petra-villas': {
    leftTag: 'VILLAS',
    location: 'Imerovigli, Santorini',
    country: 'Greece',
    season: 'May · Spring',
    duration: '4 days',
    usage: 'Social media',
  },
  'gpro-valparaiso': {
    leftTag: 'PALACE',
    location: 'Bonanova, Palma de Mallorca',
    country: 'Spain',
    season: 'Summer · 2023, 2024 and 2026',
    duration: '5 days',
    usage: 'Social media · High season campaign',
  },
  'hotel-esplendido': {
    leftTag: 'HOTEL',
    location: 'Port de Sóller, Mallorca',
    country: 'Spain',
    season: 'July · 2024 and 2026',
    duration: '3 days',
    usage: 'Social media',
  },
  'district-hive': {
    leftTag: 'CAPSULE',
    location: 'Gorafe, Granada',
    country: 'Spain',
    season: 'October · Autumn',
    duration: '4 days',
    usage: 'Social media',
  },
  'welmoon-villas': {
    leftTag: 'GLAMPING',
    location: 'Caravaca de la Cruz, Murcia',
    country: 'Spain',
    season: 'March · Spring',
    duration: '3 days',
    usage: 'Social media',
  },
};

/** Los casos de estudio, por slug. Las citas de los clientes van traducidas:
 *  quien lee la web en inglés no puede leerlas en español, y dejarlas tal cual
 *  sería enseñar la prueba más fuerte que hay en un idioma que no entiende.
 *  Son palabras de personas reales y la versión inglesa es una traducción. */
export const CASO_EN: Record<string, { heading: string; sections: { title: string; body: string }[] }> = {
  'ritz-carlton-abama': {
    heading: 'Ritz-Carlton Abama: architecture and experience in a luxury resort',
    sections: [
      {
        title: 'Context',
        body: 'Above the cliffs of Guía de Isora, in the southwest of Tenerife, The Ritz-Carlton Tenerife, Abama occupies an estate of terracotta walls with subtropical gardens falling towards the Atlantic. The shoot took place in July, at the height of the season.',
      },
      {
        title: 'Direction',
        body: 'Three tones hold the whole piece together: the terracotta of the walls, the blue of the ocean and the green of the garden. Arcades, courtyards and stepped fountains repeat the same language of warm stone, water and shade, with La Gomera always on the horizon.',
      },
      {
        title: 'Production',
        body: 'Four days on the property. Three film pieces and fifty photographs: facade and gardens, rooms, dining and the water areas, covered at different hours of the day to use the light each space has of its own.',
      },
      {
        title: 'Delivery',
        body: "Material organised for the hotel's social channels: vertical film ready to publish and photography in the formats each channel asks for.",
      },
      {
        title: 'Evidence',
        body: 'Jose Lorente, from the marketing team: “On behalf of the department, I want to thank her for the interest she took in the whole Ritz-Carlton, Abama project and in our dining offer, and for the beautiful content she created during her stay. We hope to have her back with us.”',
      },
      {
        title: 'Gallery',
        body: 'A selection from the shoot, with the full walk through the property, is in the Abama gallery.',
      },
    ],
  },
  'vestige-binidufa': {
    heading: 'Vestige Binidufà: heritage and landscape in Menorca',
    sections: [
      {
        title: 'Context',
        body: 'In a valley in the north of Menorca, Vestige Collection, Binidufà restores an agricultural possessió from the eighteenth century, surrounded by a working farm. The shoot took place in June, at the start of the season.',
      },
      {
        title: 'Direction',
        body: 'Stone, clay and natural materials that take their tone from the landscape around them. The direction avoids contrast: everything that enters the frame shares the same palette of earth, lime and shade, and the Moorish inheritance is still there even in the name of the estate.',
      },
      {
        title: 'Production',
        body: 'Three days on the estate. Three film pieces and forty photographs: the house and its courtyards, the rooms, the table and the land around it.',
      },
      {
        title: 'Delivery',
        body: "Material organised for the estate's social channels: vertical film ready to publish and photography in the formats each channel asks for.",
      },
      {
        title: 'Gallery',
        body: 'A selection from the shoot, with the full walk through the estate, is in the Binidufà gallery.',
      },
    ],
  },
  'gpro-valparaiso': {
    heading: 'GPRO Valparaíso: three productions at the same property',
    sections: [
      {
        title: 'Context',
        body: 'High in Bonanova, Palma de Mallorca, GPRO Valparaíso Palace & Spa holds the largest spa on the island. A returning client since 2023: three shoots in three years, each in the high summer season.',
      },
      {
        title: 'Direction',
        body: 'The visual thread is water, stone and Mediterranean planting: private gardens, the spa as the lead, and the Bay of Palma as a constant horizon in every exterior frame.',
      },
      {
        title: 'Production',
        body: 'Five days shooting on site: photography of rooms, spa, dining and gardens.',
      },
      {
        title: 'Delivery',
        body: "Assets for the website, campaigns and social channels, organised for immediate use in the hotel's high season campaign.",
      },
      {
        title: 'Evidence',
        body: 'Francisco Dominguez, Marketing Director, after three shoots together: “Thank you both, as always, for the professionalism and the craft you have shown throughout. And what can I say about the excellent material you have left us. It will be a pleasure to have you back in our house.”',
      },
      {
        title: 'Gallery',
        body: 'The full GPRO Valparaíso gallery, with the thirteen photographs from the shoot, is under Projects.',
      },
    ],
  },
};

/** Los testimonios, por id. Mismo criterio que en los casos: son palabras de
 *  personas reales y esto es su traducción, no una cita en inglés original. */
export const TESTIMONIO_EN: Record<string, { quote: string; role?: string; repeatNote?: string }> = {
  't-gpro': {
    quote:
      'Thank you both, as always, for the professionalism and the craft you have shown throughout. And what can I say about the excellent material you have left us. It will be a pleasure to have you back in our house.',
    role: 'Marketing Director',
    repeatNote: '3 shoots together',
  },
  't-ritz-carlton': {
    quote:
      'On behalf of the department, I want to thank her for the interest she took in the whole Ritz-Carlton, Abama project and in our dining offer, and for the beautiful content she created during her stay. We hope to have her back with us.',
    role: 'Marketing team',
  },
  't-honeymoon-petra': {
    quote:
      'Their eye and their images have helped us enormously to tell our story and to reach new audiences. They have captured the essence of the brand.',
    role: 'Marketing team',
  },
  't-costa-magica': {
    quote:
      'Thank you so much for your work. The photos and the films are incredible. We have gained a great many new followers.',
    role: 'Community Manager',
  },
  't-numa': {
    quote:
      'We have just seen the content and it is beautiful. Thank you for all the effort, the care and the affection you put into it.',
    role: 'Marketing team',
    repeatNote: '3 properties: Madrid, Amsterdam and Seville',
  },
  't-welmoon': {
    quote:
      'Incredible content. You are true professionals. You will go far taking this much care in what you do. We would love to have you back.',
    role: 'Marketing team',
  },
  't-holiday-inn': {
    quote:
      'We are very happy with how the content turned out. Very pleased with the quality and with the result of their creativity.',
    role: 'Marketing team',
  },
  't-coeo': {
    quote:
      'The photos are beautiful, and as content for all our channels they work wonderfully. You are going to see them everywhere.',
    role: 'Marketing team',
  },
};

function fotosEn(fotos?: PhotoItem[]): PhotoItem[] | undefined {
  if (!fotos) return fotos;
  return fotos.map((f) => ({ ...f, alt: ALT_EN[f.alt] ?? f.alt }));
}

/** La ficha de un hotel en el idioma activo. En español devuelve el mismo
 *  objeto, sin copiarlo, para no romper las comparaciones por referencia ni
 *  obligar a React a repintar de más. */
export function traducirHotel(story: HotelStory, idioma: Idioma): HotelStory {
  if (idioma !== 'en') return story;
  const en = HOTEL_EN[story.id];
  return {
    ...story,
    leftTag: en?.leftTag ?? story.leftTag,
    location: en?.location ?? story.location,
    country: en?.country ?? story.country,
    photos: fotosEn(story.photos) ?? story.photos,
    galleryPhotos: fotosEn(story.galleryPhotos),
    caseStudy: story.caseStudy
      ? {
          season: en?.season ?? story.caseStudy.season,
          duration: en?.duration ?? story.caseStudy.duration,
          usage: en?.usage ?? story.caseStudy.usage,
        }
      : story.caseStudy,
  };
}

export function traducirCaso(caso: CaseStudy, idioma: Idioma): CaseStudy {
  if (idioma !== 'en') return caso;
  const en = CASO_EN[caso.slug];
  if (!en) return caso;
  return {
    ...caso,
    heading: en.heading,
    // El número de cada sección no se traduce y el orden es el mismo en los
    // dos idiomas, así que van emparejadas por posición.
    sections: caso.sections.map((s, i) => ({
      number: s.number,
      title: en.sections[i]?.title ?? s.title,
      body: en.sections[i]?.body ?? s.body,
    })),
  };
}

export function traducirTestimonio(t: Testimonial, idioma: Idioma): Testimonial {
  if (idioma !== 'en') return t;
  const en = TESTIMONIO_EN[t.id];
  if (!en) return t;
  return {
    ...t,
    quote: en.quote,
    role: en.role ?? t.role,
    repeatNote: en.repeatNote ?? t.repeatNote,
  };
}
