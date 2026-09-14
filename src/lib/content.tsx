import React, { createContext, useContext, useEffect, useState } from 'react';

/** Builds a URL to a file in public/images/, correct in both dev and the built site. */
export function publicImage(filename: string): string {
  return `${import.meta.env.BASE_URL}images/${filename}`;
}

const CONTENT_URL = publicImage('content.json');

export interface HotelContent {
  seccion: number;
  hotelName: string;
  coupleName: string;
  description: string;
  quote: string;
}

export interface MilestoneItem {
  value: string;
  label: string;
}

export interface HowWeWorkStep {
  number: string;
  title: string;
  description: string;
}

export interface FaqEntry {
  question: string;
  answer: string;
}

export interface TitledItem {
  title: string;
  description: string;
}

export interface OverviewBox {
  label: string;
  value: string;
}

export interface SiteContent {
  hero: {
    /** Rótulo fino sobre el titular. */
    eyebrow: string;
    /** Titular editorial, en dos partes: la segunda va en cursiva. */
    titleLead: string;
    titleEmphasis: string;
    /** Frase funcional bajo el titular: qué producimos y para qué sirve. */
    subline: string;
    /** Etiqueta a la izquierda de la banda glass inferior. */
    glassLabel: string;
    /** CTA comercial principal de la banda glass: abre el formulario. */
    ctaLabel: string;
    /** Ruta secundaria junto al CTA principal: baja a Trabajo. */
    secondaryLabel: string;
  };
  whatWeCreate: {
    eyebrow: string;
    heading: string;
    items: TitledItem[];
    ctaLabel: string;
  };
  whyUs: {
    eyebrow: string;
    heading: string;
    intro: string;
    items: TitledItem[];
    ctaLabel: string;
  };
  waysToWork: {
    eyebrow: string;
    heading: string;
    intro: string;
    items: TitledItem[];
    ctaLabel: string;
  };
  valueBlock: {
    claim: string;
    /** Titular de cada una de las dos capas de valor. */
    benefits: string[];
    /** Párrafo de apoyo de cada una, en el mismo orden que `benefits`. */
    benefitDetails: string[];
    ctaLabel: string;
  };
  closingCta: {
    heading: string;
    ctaLabel: string;
    secondaryLabel: string;
  };
  about: {
    flipWords: string[];
    introStatement: string;
    legacyQuote: string;
    /** Franja de apertura de Acerca de: tesis de trabajo concreta + 4 datos. */
    overview: {
      heading: string;
      paragraph: string;
      boxes: OverviewBox[];
      ctaLabel: string;
    };
    mayurlin: { name: string; role: string; bio: string };
    yerfran: { name: string; role: string; bio: string };
    together: { heading: string; description: string };
    closingStatement: string;
  };
  contact: {
    /** Portada monumental: una línea por renglón, la última es la que cierra. */
    headingLines: string[];
    /** Segunda pantalla: una sola orientación y el CTA. */
    introMain: string;
    introSub: string;
    ctaLabel: string;
    emailAddress: string;
    directLabel: string;
    /** Cabecera del modal de solicitud. */
    modalKicker: string;
    modalTitle: string;
    modalCopy: string;
  };
  milestones: {
    eyebrow: string;
    items: MilestoneItem[];
    /** Los grupos hoteleros detrás de las marcas del carrusel. Sin esta línea
     *  el carrusel es una lista de 22 nombres sueltos y el lector nunca ata
     *  que Ritz-Carlton es Marriott, que InterContinental y Holiday Inn
     *  Express son ambos IHG, y que Dolce es Wyndham. */
    affiliations: string;
    footnote: string;
  };
  howWeWork: {
    eyebrow: string;
    heading: string;
    steps: HowWeWorkStep[];
  };
  faq: {
    eyebrow: string;
    heading: string;
    questions: FaqEntry[];
  };
  /** Página Proyectos: la vista completa del portafolio, con su propia URL
   *  para poder enviarla en un correo de outreach sin obligar a recorrer
   *  Inicio entero. */
  projects: {
    eyebrow: string;
    heading: string;
    intro: string;
    /** Distingue el caso documentado de las galerías: el comprador no debe
     *  esperar el mismo nivel de detalle en las nueve. */
    caseLabel: string;
    galleryLabel: string;
    caseLinkLabel: string;
    galleryLinkLabel: string;
    closingHeading: string;
    ctaLabel: string;
  };
  hotels: HotelContent[];
}

// Mirrors the site's current text exactly. Used as the immediate render (no
// loading flash) and as a safe fallback for any field missing or malformed
// in content.json once it's fetched.
export const DEFAULT_CONTENT: SiteContent = {
  hero: {
    eyebrow: 'PRODUCCIÓN VISUAL · HOTELERÍA DE LUJO',
    titleLead: 'Producción visual para',
    titleEmphasis: 'hoteles de lujo.',
    subline:
      'Fotografía, cine y contenido para redes sociales creados alrededor de la experiencia que vende cada propiedad.',
    glassLabel: 'ESTUDIO DE PRODUCCIÓN VISUAL',
    ctaLabel: 'Iniciar un proyecto',
    secondaryLabel: 'Ver trabajo',
  },
  whatWeCreate: {
    eyebrow: 'Qué producimos',
    heading: 'Qué creamos',
    items: [
      {
        title: 'Fotografía hotelera',
        description: 'Arquitectura · interiores · gastronomía · lifestyle.',
      },
      {
        title: 'Cine hotelero',
        description: 'Vídeos de marca · vídeos de propiedad · montajes de campaña.',
      },
      {
        title: 'Contenido para redes sociales',
        description: 'Piezas verticales y variaciones.',
      },
      {
        title: 'Dirección y biblioteca visual',
        description: 'Activos coherentes para uso multicanal.',
      },
    ],
    ctaLabel: 'Cuéntanos qué necesita la propiedad',
  },
  whyUs: {
    eyebrow: 'Diferenciación',
    heading: 'Por qué Mayu Travel',
    intro: 'Fotografía y cinematografía dentro de una unidad compacta.',
    items: [
      { title: 'Fotografía + Dirección', description: 'Mayurlin Viera.' },
      { title: 'Film + Cinematografía', description: 'Yerfran.' },
      {
        title: 'Talento integrado',
        description: 'Guest experience y lifestyle cuando el concepto lo requiere.',
      },
      {
        title: 'Unidad compacta',
        description: 'Dos especialistas · una producción · baja huella operativa.',
      },
    ],
    ctaLabel: 'Conocer al equipo',
  },
  waysToWork: {
    eyebrow: 'Cómo empezar',
    heading: 'Formas de trabajar juntos',
    intro: 'El alcance se define después del briefing; estas modalidades orientan sin cerrar precio ni entregables.',
    items: [
      {
        title: 'Campaña o lanzamiento',
        description: 'Producción puntual con objetivo y fecha.',
      },
      {
        title: 'Biblioteca de contenido',
        description: 'Activos para web, redes, OTA y publicidad paga.',
      },
      {
        title: 'Producción recurrente',
        description: 'Temporadas, aperturas y necesidades continuas.',
      },
      {
        title: 'Distribución editorial',
        description: 'Capa opcional cuando existe encaje.',
      },
    ],
    ctaLabel: 'Definir el proyecto',
  },
  valueBlock: {
    claim: 'Una producción. Dos capas de valor.',
    benefits: ['Activos para tu marca.', 'Distribución, cuando encaja.'],
    benefitDetails: [
      'Fotografía y cine listos para tu web, campañas, canales sociales y publicidad paga. El alcance y los derechos de uso se definen en cada propuesta, según lo que necesite la propiedad.',
      'Cuando encaja con el objetivo del proyecto, sumamos cobertura y publicación para una audiencia internacional interesada en viajes y hotelería. No es un requisito de la producción: es una capa adicional.',
    ],
    ctaLabel: 'Consultar producción',
  },
  closingCta: {
    heading: 'Hablemos de tu propiedad.',
    ctaLabel: 'Consultar disponibilidad',
    secondaryLabel: 'Conócenos',
  },
  about: {
    flipWords: ['Dirección', 'Distribución'],
    introStatement:
      'Mayu Travel es un estudio de producción visual especializado en hotelería de lujo. Trabajamos en pareja y construimos cada proyecto desde la propiedad misma: su arquitectura, su ritmo, su servicio y la forma en que quiere ser recordada.',
    legacyQuote:
      'No hacemos esto para llenar un feed. Lo hacemos porque cada hotel tiene un alma que merece verse tal como se siente estar ahí.',
    overview: {
      heading: 'Dirección creativa, fotografía y film para hotelería.',
      paragraph:
        'Mayu Travel es un estudio formado por Mayurlin Viera y Yerfran. Primero identificamos qué hace deseable una propiedad; después construimos la producción alrededor de su identidad, su experiencia y sus usos de marketing.',
      boxes: [
        { label: 'Especialización', value: 'Hotelería de lujo' },
        { label: 'Criterio', value: 'Propiedad antes que fórmula' },
        { label: 'Modelo', value: 'Dos profesionales · ejecución directa' },
        { label: 'Resultado', value: 'Activos coherentes y utilizables' },
      ],
      ctaLabel: 'Conocer nuestros roles',
    },
    mayurlin: {
      name: 'Mayurlin Viera',
      role: 'Fotografía y dirección creativa',
      bio: 'Mayurlin dirige la producción creativa de Mayu Travel: define el concepto de cada rodaje, aparece en cámara para mostrar la experiencia desde la perspectiva del huésped, y lleva la distribución editorial en @mayurlintravel cuando el proyecto lo pide. Crear contenido fue su sueño mucho antes de tener los medios para hacerlo, y trabajar con los mejores hoteles del mundo fue, desde el principio, su objetivo número uno. Seis años y más de 35 propiedades después, sigue mirando cada hotel nuevo como miró el primero.',
    },
    yerfran: {
      name: 'Yerfran',
      role: 'Film y cinematografía',
      bio: 'Yerfran dirige la cinematografía, la fotografía y la producción técnica de cada rodaje. Llegó a la fotografía por un camino distinto: capturar lo que una persona siente en un lugar, no solo cómo se ve. Años de prestar atención se convirtieron en un estilo propio, fotografías con alma, hechas con cuidado. Hoy dirige la producción visual de Mayu Travel junto a Mayurlin, en hoteles de España, Portugal, Grecia, Suiza y Países Bajos.',
    },
    together: {
      heading: 'Un equipo, una producción',
      description:
        'Dos especialistas trabajando bajo una misma dirección creativa, capaces de producir fotografía y film dentro de un mismo proyecto, con una estructura pequeña y poco invasiva para la operación del hotel.',
    },
    closingStatement:
      'Fotografía y cine en una sola producción, ejecutada siempre por nosotros dos, sin traspaso a equipos junior. Nos atraen especialmente las propiedades con una identidad fuerte: arquitectura, paisaje, gastronomía, bienestar, servicio, y proyectos donde la sostenibilidad es una parte real de la experiencia.',
  },
  contact: {
    headingLines: ['Hablemos', 'de tu', 'propiedad.'],
    introMain: 'Cuéntanos qué necesitas producir, dónde y cuándo.',
    introSub:
      'Si encaja, te respondemos con disponibilidad y los próximos pasos. No hace falta que traigas un briefing completo.',
    ctaLabel: 'Iniciar un proyecto',
    emailAddress: 'mayuviera@gmail.com',
    directLabel: 'O escríbenos directamente a',
    modalKicker: 'Consulta de proyecto',
    modalTitle: 'Cuéntanos lo esencial.',
    modalCopy: 'Con esto nos basta para valorar si encajamos, revisar disponibilidad y proponerte los próximos pasos.',
  },
  milestones: {
    eyebrow: 'Trayectoria',
    items: [
      { value: '35+', label: 'propiedades' },
      { value: '5', label: 'países' },
      { value: '4', label: 'clientes recurrentes' },
    ],
    affiliations:
      'Propiedades dentro de Marriott International, IHG Hotels & Resorts y Wyndham, junto a colecciones boutique independientes en cinco países.',
    footnote:
      'Clientes recurrentes: GPRO Valparaíso (3 rodajes) · Numa Group (3 propiedades) · Hotel Espléndido (2 rodajes) · Portixol (2 rodajes)',
  },
  howWeWork: {
    eyebrow: 'Cómo trabajamos',
    heading: 'El proceso',
    steps: [
      {
        number: '01',
        title: 'Primer contacto y encaje',
        description:
          'Nos escribes por el formulario o por email. En una llamada breve conocemos la propiedad, la temporada y cómo piensas usar el material.',
      },
      {
        number: '02',
        title: 'Plan visual',
        description:
          'Antes de viajar preparamos un brief creativo, un shot list y un guion para la pieza de vídeo. Lo afinamos con el equipo del hotel para que no falte nada.',
      },
      {
        number: '03',
        title: 'Rodaje en sitio',
        description:
          'De dos a cinco días en el hotel, con el alcance que marquen la temporada y las actividades disponibles. Cubrimos la propiedad en vivo mientras rodamos.',
      },
      {
        number: '04',
        title: 'Edición y entrega',
        description:
          'Corrección de color, edición y entrega en aproximadamente tres semanas, organizados para uso inmediato en tu web, redes sociales y publicidad.',
      },
    ],
  },
  faq: {
    eyebrow: 'Información práctica',
    heading: 'Preguntas frecuentes.',
    questions: [
      {
        question: '¿Con cuánta anticipación hay que reservar fecha?',
        answer:
          'Dos a tres semanas es el rango habitual. Para temporada alta, aperturas o producciones más grandes, conviene escribir antes.',
      },
      {
        question: '¿Quién cubre viaje y alojamiento?',
        answer:
          'Están incluidos en la propuesta de presupuesto de cada proyecto. Coordinamos la logística y los traslados que necesite la producción.',
      },
      {
        question: '¿Qué derechos de uso incluye la entrega?',
        answer:
          'Los derechos se definen según el uso previsto: web, redes sociales, boletines por correo, relaciones públicas, plataformas de reserva y campañas de publicidad paga, entre otros.',
      },
      {
        question: '¿La distribución en @mayurlintravel es parte de todos los proyectos?',
        answer:
          'No. Producción y distribución son capas separadas. Cuando hay encaje entre la propiedad, la campaña y nuestra audiencia, podemos sumar publicación y cobertura como parte adicional de la propuesta.',
      },
    ],
  },
  projects: {
    eyebrow: 'Portafolio',
    heading: 'Proyectos',
    intro:
      'Fotografía y producción audiovisual para hoteles y alojamientos con identidad propia.',
    caseLabel: 'Caso completo',
    galleryLabel: 'Selección de imágenes',
    caseLinkLabel: 'Ver proyecto',
    galleryLinkLabel: 'Ver galería',
    closingHeading: 'Cada proyecto empieza con una conversación.',
    ctaLabel: 'Iniciar un proyecto',
  },
  hotels: [
    {
      seccion: 1,
      hotelName: 'THE RITZ-CARLTON TENERIFE, ABAMA',
      coupleName: 'Arquitectura morisca',
      description:
        'Una finca morisca de muros de terracota sobre los acantilados de Guía de Isora, con jardines subtropicales que descienden hasta el Atlántico y La Gomera en el horizonte.',
      quote: 'Terracota, océano y jardín: tres tonos que se encuentran en cada rincón de Abama.',
    },
    {
      seccion: 2,
      hotelName: 'INTERCONTINENTAL LISBOA',
      coupleName: 'Altura urbana',
      description:
        'Arquitectura contemporánea sobre una de las siete colinas de Lisboa, frente al Parque Eduardo VII, con el skyline y el Tajo de fondo.',
      quote: 'Toda Lisboa se despliega desde lo alto de esta colina.',
    },
    {
      seccion: 3,
      hotelName: 'VESTIGE COLLECTION, BINIDUFÀ',
      coupleName: 'Herencia menorquina',
      description:
        'Una possessió del siglo XVIII, restaurada dentro de una finca privada de 800 hectáreas en el norte de Menorca: piedra, barro y silencio agrícola.',
      quote: 'Piedra, tierra y silencio. El norte de Menorca como siempre ha sido.',
    },
    {
      seccion: 4,
      hotelName: 'DELTAPARK VITALRESORT',
      coupleName: 'Bienestar alpino',
      description:
        'Arquitectura alpina contemporánea a orillas del lago Thun, entre dos reservas del delta del Kander, con un spa de 2.000 m².',
      quote: 'El silencio de los Alpes, reflejado entero en el lago Thun.',
    },
    {
      seccion: 5,
      hotelName: 'HONEYMOON PETRA VILLAS',
      coupleName: 'Acantilado del Egeo',
      description:
        'Tallada en roca volcánica sobre la caldera de Santorini, con una de las piscinas más codiciadas del Egeo suspendida sobre el mar.',
      quote: 'Roca volcánica y un horizonte infinito. Así amanece sobre la caldera.',
    },
    {
      seccion: 6,
      hotelName: 'GPRO VALPARAÍSO PALACE & SPA',
      coupleName: 'Spa mediterráneo',
      description:
        'Jardines privados sobre la Bahía de Palma, en lo alto de Bonanova, con el spa más grande de Mallorca en su interior.',
      quote: 'Jardines, agua y la Bahía de Palma extendiéndose más allá de cada terraza.',
    },
    {
      seccion: 7,
      hotelName: 'HOTEL ESPLÉNDIDO',
      coupleName: 'Bahía y piedra',
      description:
        'Piedra caliza y terrazas frente a la Bahía de Sóller, con la Serra de Tramuntana detrás y el tranvía histórico cruzando el paseo.',
      quote: 'Piedra, mar y el eco del tranvía sobre los adoquines de Sóller.',
    },
    {
      seccion: 8,
      hotelName: 'DISTRICT HIVE',
      coupleName: 'Fuera de la red, en el desierto',
      description:
        'Una cápsula de cristal y acero suspendida sobre el paisaje de Gorafe, con arquitectura que vive fuera de la red: agua extraída del aire y energía del sol.',
      quote: 'Todo el cielo como techo, todo el paisaje como horizonte.',
    },
    {
      seccion: 9,
      hotelName: 'WELMOON VILLAS PAISAJE',
      coupleName: 'Bajo las estrellas',
      description:
        'Villas abovedadas entre los pinares de Caravaca de la Cruz, diseñadas para dormir bajo el cielo sin filtrar de la sierra murciana.',
      quote: 'Un techo de estrellas y el silencio de la sierra murciana.',
    },
  ],
};

function isNonEmptyString(v: unknown): v is string {
  return typeof v === 'string' && v.trim().length > 0;
}

function isMilestoneItem(v: unknown): v is MilestoneItem {
  return (
    !!v &&
    typeof v === 'object' &&
    isNonEmptyString((v as MilestoneItem).value) &&
    isNonEmptyString((v as MilestoneItem).label)
  );
}

function isHowWeWorkStep(v: unknown): v is HowWeWorkStep {
  return (
    !!v &&
    typeof v === 'object' &&
    isNonEmptyString((v as HowWeWorkStep).number) &&
    isNonEmptyString((v as HowWeWorkStep).title) &&
    isNonEmptyString((v as HowWeWorkStep).description)
  );
}

function isFaqEntry(v: unknown): v is FaqEntry {
  return (
    !!v &&
    typeof v === 'object' &&
    isNonEmptyString((v as FaqEntry).question) &&
    isNonEmptyString((v as FaqEntry).answer)
  );
}

function isTitledItem(v: unknown): v is TitledItem {
  return (
    !!v &&
    typeof v === 'object' &&
    isNonEmptyString((v as TitledItem).title) &&
    isNonEmptyString((v as TitledItem).description)
  );
}

function isOverviewBox(v: unknown): v is OverviewBox {
  return (
    !!v &&
    typeof v === 'object' &&
    isNonEmptyString((v as OverviewBox).label) &&
    isNonEmptyString((v as OverviewBox).value)
  );
}

// Merges fetched JSON over the defaults field by field, so a missing or
// malformed field never breaks the page -- it just falls back silently.
function mergeContent(fetched: unknown): SiteContent {
  if (!fetched || typeof fetched !== 'object') return DEFAULT_CONTENT;
  const f = fetched as Partial<SiteContent>;

  const hotels = Array.isArray(f.hotels)
    ? DEFAULT_CONTENT.hotels.map((defaultHotel, i) => {
        const h = f.hotels?.[i];
        if (!h || typeof h !== 'object') return defaultHotel;
        return {
          seccion: defaultHotel.seccion,
          hotelName: isNonEmptyString(h.hotelName) ? h.hotelName : defaultHotel.hotelName,
          coupleName: isNonEmptyString(h.coupleName) ? h.coupleName : defaultHotel.coupleName,
          description: isNonEmptyString(h.description) ? h.description : defaultHotel.description,
          quote: isNonEmptyString(h.quote) ? h.quote : defaultHotel.quote,
        };
      })
    : DEFAULT_CONTENT.hotels;

  const milestoneItems =
    Array.isArray(f.milestones?.items) && f.milestones!.items.every(isMilestoneItem) && f.milestones!.items.length > 0
      ? f.milestones!.items
      : DEFAULT_CONTENT.milestones.items;

  const howWeWorkSteps =
    Array.isArray(f.howWeWork?.steps) && f.howWeWork!.steps.every(isHowWeWorkStep) && f.howWeWork!.steps.length > 0
      ? f.howWeWork!.steps
      : DEFAULT_CONTENT.howWeWork.steps;

  const faqQuestions =
    Array.isArray(f.faq?.questions) && f.faq!.questions.every(isFaqEntry) && f.faq!.questions.length > 0
      ? f.faq!.questions
      : DEFAULT_CONTENT.faq.questions;

  const stringList = (value: unknown, fallback: string[]): string[] =>
    Array.isArray(value) && value.length > 0 && value.every(isNonEmptyString)
      ? (value as string[])
      : fallback;

  const titledList = (value: unknown, fallback: TitledItem[]): TitledItem[] =>
    Array.isArray(value) && value.length > 0 && value.every(isTitledItem) ? (value as TitledItem[]) : fallback;

  const benefits = stringList(f.valueBlock?.benefits, DEFAULT_CONTENT.valueBlock.benefits);

  // Cada titular necesita su párrafo: si el JSON trae menos de los que hay
  // titulares, se completa con los de por defecto en vez de dejar huecos.
  const benefitDetails = stringList(
    f.valueBlock?.benefitDetails,
    DEFAULT_CONTENT.valueBlock.benefitDetails
  );

  const createItems = titledList(f.whatWeCreate?.items, DEFAULT_CONTENT.whatWeCreate.items);
  const whyUsItems = titledList(f.whyUs?.items, DEFAULT_CONTENT.whyUs.items);
  const wayToWorkItems = titledList(f.waysToWork?.items, DEFAULT_CONTENT.waysToWork.items);

  const overviewBoxes =
    Array.isArray(f.about?.overview?.boxes) &&
    f.about!.overview!.boxes.every(isOverviewBox) &&
    f.about!.overview!.boxes.length > 0
      ? f.about!.overview!.boxes
      : DEFAULT_CONTENT.about.overview.boxes;

  return {
    hero: {
      eyebrow: isNonEmptyString(f.hero?.eyebrow) ? f.hero!.eyebrow : DEFAULT_CONTENT.hero.eyebrow,
      titleLead: isNonEmptyString(f.hero?.titleLead)
        ? f.hero!.titleLead
        : DEFAULT_CONTENT.hero.titleLead,
      titleEmphasis: isNonEmptyString(f.hero?.titleEmphasis)
        ? f.hero!.titleEmphasis
        : DEFAULT_CONTENT.hero.titleEmphasis,
      subline: isNonEmptyString(f.hero?.subline) ? f.hero!.subline : DEFAULT_CONTENT.hero.subline,
      glassLabel: isNonEmptyString(f.hero?.glassLabel)
        ? f.hero!.glassLabel
        : DEFAULT_CONTENT.hero.glassLabel,
      ctaLabel: isNonEmptyString(f.hero?.ctaLabel)
        ? f.hero!.ctaLabel
        : DEFAULT_CONTENT.hero.ctaLabel,
      secondaryLabel: isNonEmptyString(f.hero?.secondaryLabel)
        ? f.hero!.secondaryLabel
        : DEFAULT_CONTENT.hero.secondaryLabel,
    },
    whatWeCreate: {
      eyebrow: isNonEmptyString(f.whatWeCreate?.eyebrow)
        ? f.whatWeCreate!.eyebrow
        : DEFAULT_CONTENT.whatWeCreate.eyebrow,
      heading: isNonEmptyString(f.whatWeCreate?.heading)
        ? f.whatWeCreate!.heading
        : DEFAULT_CONTENT.whatWeCreate.heading,
      items: createItems,
      ctaLabel: isNonEmptyString(f.whatWeCreate?.ctaLabel)
        ? f.whatWeCreate!.ctaLabel
        : DEFAULT_CONTENT.whatWeCreate.ctaLabel,
    },
    whyUs: {
      eyebrow: isNonEmptyString(f.whyUs?.eyebrow) ? f.whyUs!.eyebrow : DEFAULT_CONTENT.whyUs.eyebrow,
      heading: isNonEmptyString(f.whyUs?.heading) ? f.whyUs!.heading : DEFAULT_CONTENT.whyUs.heading,
      intro: isNonEmptyString(f.whyUs?.intro) ? f.whyUs!.intro : DEFAULT_CONTENT.whyUs.intro,
      items: whyUsItems,
      ctaLabel: isNonEmptyString(f.whyUs?.ctaLabel) ? f.whyUs!.ctaLabel : DEFAULT_CONTENT.whyUs.ctaLabel,
    },
    waysToWork: {
      eyebrow: isNonEmptyString(f.waysToWork?.eyebrow)
        ? f.waysToWork!.eyebrow
        : DEFAULT_CONTENT.waysToWork.eyebrow,
      heading: isNonEmptyString(f.waysToWork?.heading)
        ? f.waysToWork!.heading
        : DEFAULT_CONTENT.waysToWork.heading,
      intro: isNonEmptyString(f.waysToWork?.intro) ? f.waysToWork!.intro : DEFAULT_CONTENT.waysToWork.intro,
      items: wayToWorkItems,
      ctaLabel: isNonEmptyString(f.waysToWork?.ctaLabel)
        ? f.waysToWork!.ctaLabel
        : DEFAULT_CONTENT.waysToWork.ctaLabel,
    },
    valueBlock: {
      claim: isNonEmptyString(f.valueBlock?.claim) ? f.valueBlock!.claim : DEFAULT_CONTENT.valueBlock.claim,
      benefits,
      benefitDetails,
      ctaLabel: isNonEmptyString(f.valueBlock?.ctaLabel)
        ? f.valueBlock!.ctaLabel
        : DEFAULT_CONTENT.valueBlock.ctaLabel,
    },
    closingCta: {
      heading: isNonEmptyString(f.closingCta?.heading)
        ? f.closingCta!.heading
        : DEFAULT_CONTENT.closingCta.heading,
      ctaLabel: isNonEmptyString(f.closingCta?.ctaLabel)
        ? f.closingCta!.ctaLabel
        : DEFAULT_CONTENT.closingCta.ctaLabel,
      secondaryLabel: isNonEmptyString(f.closingCta?.secondaryLabel)
        ? f.closingCta!.secondaryLabel
        : DEFAULT_CONTENT.closingCta.secondaryLabel,
    },
    about: {
      flipWords:
        Array.isArray(f.about?.flipWords) && f.about!.flipWords.every(isNonEmptyString) && f.about!.flipWords.length > 0
          ? f.about!.flipWords
          : DEFAULT_CONTENT.about.flipWords,
      introStatement: isNonEmptyString(f.about?.introStatement)
        ? f.about!.introStatement
        : DEFAULT_CONTENT.about.introStatement,
      legacyQuote: isNonEmptyString(f.about?.legacyQuote) ? f.about!.legacyQuote : DEFAULT_CONTENT.about.legacyQuote,
      overview: {
        heading: isNonEmptyString(f.about?.overview?.heading)
          ? f.about!.overview!.heading
          : DEFAULT_CONTENT.about.overview.heading,
        paragraph: isNonEmptyString(f.about?.overview?.paragraph)
          ? f.about!.overview!.paragraph
          : DEFAULT_CONTENT.about.overview.paragraph,
        boxes: overviewBoxes,
        ctaLabel: isNonEmptyString(f.about?.overview?.ctaLabel)
          ? f.about!.overview!.ctaLabel
          : DEFAULT_CONTENT.about.overview.ctaLabel,
      },
      mayurlin: {
        name: isNonEmptyString(f.about?.mayurlin?.name) ? f.about!.mayurlin.name : DEFAULT_CONTENT.about.mayurlin.name,
        role: isNonEmptyString(f.about?.mayurlin?.role) ? f.about!.mayurlin.role : DEFAULT_CONTENT.about.mayurlin.role,
        bio: isNonEmptyString(f.about?.mayurlin?.bio) ? f.about!.mayurlin.bio : DEFAULT_CONTENT.about.mayurlin.bio,
      },
      yerfran: {
        name: isNonEmptyString(f.about?.yerfran?.name) ? f.about!.yerfran.name : DEFAULT_CONTENT.about.yerfran.name,
        role: isNonEmptyString(f.about?.yerfran?.role) ? f.about!.yerfran.role : DEFAULT_CONTENT.about.yerfran.role,
        bio: isNonEmptyString(f.about?.yerfran?.bio) ? f.about!.yerfran.bio : DEFAULT_CONTENT.about.yerfran.bio,
      },
      together: {
        heading: isNonEmptyString(f.about?.together?.heading)
          ? f.about!.together!.heading
          : DEFAULT_CONTENT.about.together.heading,
        description: isNonEmptyString(f.about?.together?.description)
          ? f.about!.together!.description
          : DEFAULT_CONTENT.about.together.description,
      },
      closingStatement: isNonEmptyString(f.about?.closingStatement)
        ? f.about!.closingStatement
        : DEFAULT_CONTENT.about.closingStatement,
    },
    contact: {
      headingLines: stringList(f.contact?.headingLines, DEFAULT_CONTENT.contact.headingLines),
      introMain: isNonEmptyString(f.contact?.introMain)
        ? f.contact!.introMain
        : DEFAULT_CONTENT.contact.introMain,
      introSub: isNonEmptyString(f.contact?.introSub)
        ? f.contact!.introSub
        : DEFAULT_CONTENT.contact.introSub,
      ctaLabel: isNonEmptyString(f.contact?.ctaLabel)
        ? f.contact!.ctaLabel
        : DEFAULT_CONTENT.contact.ctaLabel,
      emailAddress: isNonEmptyString(f.contact?.emailAddress)
        ? f.contact!.emailAddress
        : DEFAULT_CONTENT.contact.emailAddress,
      directLabel: isNonEmptyString(f.contact?.directLabel)
        ? f.contact!.directLabel
        : DEFAULT_CONTENT.contact.directLabel,
      modalKicker: isNonEmptyString(f.contact?.modalKicker)
        ? f.contact!.modalKicker
        : DEFAULT_CONTENT.contact.modalKicker,
      modalTitle: isNonEmptyString(f.contact?.modalTitle)
        ? f.contact!.modalTitle
        : DEFAULT_CONTENT.contact.modalTitle,
      modalCopy: isNonEmptyString(f.contact?.modalCopy)
        ? f.contact!.modalCopy
        : DEFAULT_CONTENT.contact.modalCopy,
    },
    milestones: {
      eyebrow: isNonEmptyString(f.milestones?.eyebrow)
        ? f.milestones!.eyebrow
        : DEFAULT_CONTENT.milestones.eyebrow,
      items: milestoneItems,
      affiliations: isNonEmptyString(f.milestones?.affiliations)
        ? f.milestones!.affiliations
        : DEFAULT_CONTENT.milestones.affiliations,
      footnote: isNonEmptyString(f.milestones?.footnote)
        ? f.milestones!.footnote
        : DEFAULT_CONTENT.milestones.footnote,
    },
    howWeWork: {
      eyebrow: isNonEmptyString(f.howWeWork?.eyebrow)
        ? f.howWeWork!.eyebrow
        : DEFAULT_CONTENT.howWeWork.eyebrow,
      heading: isNonEmptyString(f.howWeWork?.heading)
        ? f.howWeWork!.heading
        : DEFAULT_CONTENT.howWeWork.heading,
      steps: howWeWorkSteps,
    },
    faq: {
      eyebrow: isNonEmptyString(f.faq?.eyebrow) ? f.faq!.eyebrow : DEFAULT_CONTENT.faq.eyebrow,
      heading: isNonEmptyString(f.faq?.heading) ? f.faq!.heading : DEFAULT_CONTENT.faq.heading,
      questions: faqQuestions,
    },
    projects: {
      eyebrow: isNonEmptyString(f.projects?.eyebrow)
        ? f.projects!.eyebrow
        : DEFAULT_CONTENT.projects.eyebrow,
      heading: isNonEmptyString(f.projects?.heading)
        ? f.projects!.heading
        : DEFAULT_CONTENT.projects.heading,
      intro: isNonEmptyString(f.projects?.intro) ? f.projects!.intro : DEFAULT_CONTENT.projects.intro,
      caseLabel: isNonEmptyString(f.projects?.caseLabel)
        ? f.projects!.caseLabel
        : DEFAULT_CONTENT.projects.caseLabel,
      galleryLabel: isNonEmptyString(f.projects?.galleryLabel)
        ? f.projects!.galleryLabel
        : DEFAULT_CONTENT.projects.galleryLabel,
      caseLinkLabel: isNonEmptyString(f.projects?.caseLinkLabel)
        ? f.projects!.caseLinkLabel
        : DEFAULT_CONTENT.projects.caseLinkLabel,
      galleryLinkLabel: isNonEmptyString(f.projects?.galleryLinkLabel)
        ? f.projects!.galleryLinkLabel
        : DEFAULT_CONTENT.projects.galleryLinkLabel,
      closingHeading: isNonEmptyString(f.projects?.closingHeading)
        ? f.projects!.closingHeading
        : DEFAULT_CONTENT.projects.closingHeading,
      ctaLabel: isNonEmptyString(f.projects?.ctaLabel)
        ? f.projects!.ctaLabel
        : DEFAULT_CONTENT.projects.ctaLabel,
    },
    hotels,
  };
}

const ContentContext = createContext<SiteContent>(DEFAULT_CONTENT);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT);

  useEffect(() => {
    let cancelled = false;
    fetch(CONTENT_URL, { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data) setContent(mergeContent(data));
      })
      .catch(() => {
        // content.json missing/unreachable -- keep the built-in defaults.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return <ContentContext.Provider value={content}>{children}</ContentContext.Provider>;
};

export function useSiteContent(): SiteContent {
  return useContext(ContentContext);
}
