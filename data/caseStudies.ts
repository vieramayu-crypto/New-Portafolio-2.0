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

/** Primer caso de estudio (pág. 12 de la auditoría): GPRO Valparaíso, el
 *  cliente con más rodajes repetidos y un testimonio ya publicado. Estructura
 *  fija de 6 pasos -- se usa como plantilla para los siguientes casos
 *  (InterContinental, Vestige) cuando se prioricen. */
export const CASE_STUDIES: CaseStudy[] = [
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
