export interface CaseStudySection {
  number: string;
  title: string;
  body: string;
}

export interface CaseStudy {
  /** Coincide con el id del hotel en data/hotels.ts, para reutilizar sus fotos. */
  hotelId: string;
  slug: string;
  hotelName: string;
  heading: string;
  sections: CaseStudySection[];
}

/** Casos de estudio documentados. Misma estructura en los tres: contexto,
 *  dirección, producción, entrega y galería, más una sección de evidencia
 *  cuando hay un testimonio real publicado (GPRO y Abama lo tienen; Binidufà
 *  todavía no, y no se inventa).
 *
 *  Regla de contenido, pedido explícito de Mayurlin: el caso cuenta el
 *  TRABAJO, nunca el trato. Ni la relación comercial, ni lo que se pidió
 *  frente a lo que se entregó -- solo el alcance de la producción. */
export const CASE_STUDIES: CaseStudy[] = [
  {
    hotelId: 'ritz-carlton-abama',
    slug: 'ritz-carlton-abama',
    hotelName: 'The Ritz-Carlton Tenerife, Abama',
    heading: 'Ritz-Carlton Abama: rodaje en temporada alta',
    sections: [
      {
        number: '01',
        title: 'Contexto',
        body: 'Sobre los acantilados de Guía de Isora, en el suroeste de Tenerife, The Ritz-Carlton Tenerife, Abama ocupa una finca de muros de terracota con jardines subtropicales que descienden hasta el Atlántico. El rodaje se hizo en julio, en plena temporada alta.',
      },
      {
        number: '02',
        title: 'Dirección',
        body: 'Tres tonos sostienen toda la pieza: la terracota de los muros, el azul del océano y el verde del jardín. Arcadas, patios y fuentes escalonadas repiten el mismo lenguaje de piedra cálida, agua y sombra, con La Gomera siempre en el horizonte.',
      },
      {
        number: '03',
        title: 'Producción',
        body: 'Cuatro días en la propiedad. Tres piezas de vídeo y cincuenta fotografías: fachada y jardines, habitaciones, restauración y las zonas de agua, cubiertas a distintas horas del día para aprovechar la luz propia de cada espacio.',
      },
      {
        number: '04',
        title: 'Entrega',
        body: 'Material organizado para las redes sociales del hotel: vídeo vertical listo para publicar y fotografía en los formatos que pide cada canal.',
      },
      {
        number: '05',
        title: 'Evidencia',
        body: 'Jose Lorente, del equipo de marketing: “On behalf of the department, I would like to thank her for her interest in the whole Ritz-Carlton, Abama project and in our gastronomic offering, and for the wonderful content she created during her stay. We hope to have her back with us in the future.”',
      },
      {
        number: '06',
        title: 'Galería',
        body: 'Una selección del rodaje, con el recorrido completo por la propiedad, está en la galería de Abama.',
      },
    ],
  },
  {
    hotelId: 'vestige-binidufa',
    slug: 'vestige-binidufa',
    hotelName: 'Vestige Collection, Binidufà',
    heading: 'Vestige Binidufà: una possessió del siglo XVIII',
    sections: [
      {
        number: '01',
        title: 'Contexto',
        body: 'En un valle al norte de Menorca, dentro de una finca privada de 800 hectáreas, Vestige Collection, Binidufà restaura una possessió agrícola del siglo XVIII. El rodaje se hizo en junio, al principio de la temporada.',
      },
      {
        number: '02',
        title: 'Dirección',
        body: 'Piedra, barro y materiales naturales que toman su tono del paisaje que los rodea. La dirección evita el contraste: todo lo que entra en plano comparte la misma paleta de tierra, cal y sombra, y la herencia morisca sigue presente hasta en el nombre de la finca.',
      },
      {
        number: '03',
        title: 'Producción',
        body: 'Tres días en la finca. Tres piezas de vídeo y cuarenta fotografías: la casa y sus patios, las habitaciones, la mesa y el campo de alrededor.',
      },
      {
        number: '04',
        title: 'Entrega',
        body: 'Material organizado para las redes sociales de la finca: vídeo vertical listo para publicar y fotografía en los formatos que pide cada canal.',
      },
      {
        number: '05',
        title: 'Galería',
        body: 'Una selección del rodaje, con el recorrido completo por la finca, está en la galería de Binidufà.',
      },
    ],
  },
  {
    hotelId: 'gpro-valparaiso',
    slug: 'gpro-valparaiso',
    hotelName: 'GPRO Valparaíso Palace & Spa',
    heading: 'GPRO Valparaíso: producción recurrente',
    sections: [
      {
        number: '01',
        title: 'Contexto',
        body: 'En lo alto de Bonanova, Palma de Mallorca, GPRO Valparaíso Palace & Spa alberga el spa más grande de la isla. Cliente recurrente desde 2023: tres rodajes en tres años, coincidiendo con la temporada alta de verano.',
      },
      {
        number: '02',
        title: 'Dirección',
        body: 'El hilo visual es el agua, la piedra y la vegetación mediterránea: jardines privados, el spa como protagonista, y la Bahía de Palma como horizonte constante en cada plano exterior.',
      },
      {
        number: '03',
        title: 'Producción',
        body: 'Cinco días de rodaje en sitio: fotografía de habitaciones, spa, restauración y jardines, más cobertura en vivo del equipo en @mayurlintravel durante la estancia.',
      },
      {
        number: '04',
        title: 'Entrega',
        body: 'Activos para web, campañas y redes sociales, organizados para uso inmediato en la campaña de temporada alta del hotel.',
      },
      {
        number: '05',
        title: 'Evidencia',
        body: 'Francisco Dominguez, Director de Marketing, después de tres rodajes juntos: “Gracias a los dos, como siempre, por el profesionalismo y el oficio que han demostrado en todo momento. Y qué decir del material tan bueno que nos han dejado. Será un placer teneros de vuelta en nuestra casa.”',
      },
      {
        number: '06',
        // "Galería y film" prometía una pieza de vídeo que no existe: la
        // etiqueta nombra ahora solo lo que se puede abrir y revisar.
        title: 'Galería',
        body: 'La galería completa de GPRO Valparaíso, con las trece fotografías del rodaje, está en Proyectos.',
      },
    ],
  },
];
