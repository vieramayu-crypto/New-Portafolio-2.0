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
  /** Una línea que dice qué capacidad demuestra este proyecto. Solo la usan
   *  los destacados de Inicio: tres nombres de hotel no bastaban para que el
   *  comprador entendiera qué prueba cada uno. Opcional. */
  featuredLine?: string;
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
    heading: string;
    intro: string;
    /** Distingue el proyecto documentado de la galería: el comprador no debe
     *  esperar el mismo nivel de detalle en las nueve propiedades. Los dos
     *  rótulos de sección separan físicamente una cosa de la otra, porque
     *  "proyecto" y "portafolio" no se distinguen solos. */
    caseSectionLabel: string;
    caseSectionLine: string;
    gallerySectionLabel: string;
    gallerySectionLine: string;
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
    eyebrow: 'ESTUDIO · HOTELERÍA',
    titleLead: 'Fotografía y producción audiovisual para',
    titleEmphasis: 'hoteles de lujo.',
    subline:
      'Creamos fotografías, vídeos de marca y piezas verticales para mostrar los espacios, el servicio y la experiencia de tu hotel.',
    glassLabel: 'ESTUDIO DE PRODUCCIÓN VISUAL',
    ctaLabel: 'Iniciar un proyecto',
    secondaryLabel: 'Ver proyectos',
  },
  whatWeCreate: {
    eyebrow: 'Qué producimos',
    heading: 'Qué creamos',
    items: [
      {
        title: 'Fotografía hotelera',
        description: 'Arquitectura, interiores, gastronomía y experiencia del huésped.',
      },
      {
        title: 'Vídeos de marca',
        description: 'Producciones audiovisuales para presentar tu hotel.',
      },
      {
        title: 'Reels y vídeos verticales',
        description: 'Piezas para redes sociales, adaptadas al formato acordado.',
      },
      {
        title: 'Banco de imágenes y vídeos',
        description: 'Contenido organizado para tu web, redes y campañas.',
      },
    ],
    ctaLabel: 'Iniciar un proyecto',
  },
  whyUs: {
    eyebrow: 'Diferenciación',
    heading: 'Por qué Mayu Travel',
    intro: 'Dos personas, cada una con una responsabilidad clara.',
    items: [
      {
        title: 'Fotografía y dirección creativa',
        description: 'Mayurlin define el estilo visual y dirige la fotografía.',
      },
      {
        title: 'Producción audiovisual',
        description: 'Yerfran se encarga de la grabación y edición de vídeo.',
      },
      {
        title: 'Presencia en cámara',
        description: 'Mayurlin puede aparecer en las escenas acordadas.',
      },
      {
        title: 'Trato directo',
        description: 'Trabajas con nosotros durante todo el proyecto.',
      },
    ],
    ctaLabel: 'Conocer al equipo',
  },
  waysToWork: {
    eyebrow: 'Cómo empezar',
    heading: 'Formas de trabajar juntos',
    intro: 'Definimos juntos el contenido y los usos.',
    items: [
      {
        title: 'Campañas y lanzamientos',
        description: 'Fotografías y vídeos para una campaña, apertura o novedad.',
      },
      {
        title: 'Renovación de contenido',
        description: 'Un banco de imágenes y vídeos para actualizar la comunicación del hotel.',
      },
      {
        title: 'Producciones periódicas',
        description: 'Nuevas sesiones según la temporada y las necesidades del hotel.',
      },
    ],
    ctaLabel: 'Iniciar un proyecto',
  },
  valueBlock: {
    claim: 'Una producción, dos destinos.',
    benefits: ['Los canales de tu hotel.', 'También nuestro canal.'],
    benefitDetails: [
      'Fotografías y vídeos en los formatos y con los usos definidos en la propuesta.',
      'Cuando el proyecto encaja con nuestra audiencia, parte del material se publica en @mayurlintravel, ante una comunidad internacional de viajes y hotelería.',
    ],
    ctaLabel: 'Iniciar un proyecto',
  },
  closingCta: {
    heading: 'Empecemos por lo que necesitas mostrar.',
    ctaLabel: 'Iniciar un proyecto',
    secondaryLabel: 'Ver proyectos',
  },
  about: {
    flipWords: ['Dirección', 'Producción'],
    introStatement:
      'Mayu Travel es un estudio de producción visual especializado en hotelería de lujo. Trabajamos en pareja y construimos cada proyecto desde la propiedad misma: su arquitectura, su ritmo, su servicio y la forma en que quiere ser recordada.',
    legacyQuote:
      'No hacemos esto para llenar un feed. Lo hacemos porque cada hotel tiene un alma que merece verse tal como se siente estar ahí.',
    overview: {
      heading: 'Un estudio de fotografía y producción audiovisual para hoteles.',
      paragraph:
        'Somos Mayurlin Viera y Yerfran. Planificamos y producimos contenido que muestra los espacios, los detalles y la experiencia de cada hotel, con un estilo visual coherente con su marca.',
      boxes: [
        { label: 'Especialización', value: 'Hotelería de lujo' },
        { label: 'Criterio', value: 'Propiedad antes que fórmula' },
        { label: 'Modelo', value: 'Dos profesionales · ejecución directa' },
        { label: 'Resultado', value: 'Material listo para usar' },
      ],
      ctaLabel: 'Conoce al equipo',
    },
    mayurlin: {
      name: 'Mayurlin Viera',
      role: 'Fotografía y dirección creativa',
      bio:
        'Define el concepto visual y dirige la fotografía. Participa en cámara cuando las escenas acordadas lo requieren.',
    },
    yerfran: {
      name: 'Yerfran',
      role: 'Producción audiovisual',
      bio:
        'Se encarga de la planificación técnica, la grabación y la edición de vídeo, desde el rodaje hasta las versiones finales.',
    },
    together: {
      heading: 'Un equipo reducido, coordinado con tu hotel',
      description:
        'Planificamos las sesiones, los espacios y los horarios con tu equipo para reducir las molestias a huéspedes y personal.',
    },
    closingStatement:
      'Mayurlin y Yerfran dirigen la producción. La participación en cámara y los apoyos necesarios se acuerdan para cada proyecto.',
  },
  contact: {
    headingLines: ['Hablemos', 'de tu', 'hotel.'],
    introMain: 'Cuéntanos qué fotografías o vídeos necesitas, dónde y para cuándo.',
    introSub:
      'Si encaja, te respondemos con disponibilidad y los próximos pasos. No hace falta que traigas un briefing completo.',
    ctaLabel: 'Iniciar un proyecto',
    emailAddress: 'mayuviera@gmail.com',
    directLabel: 'O escríbenos a',
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
        title: 'Definimos el proyecto',
        description: 'Qué necesitas mostrar, a quién y en qué canales.',
      },
      {
        number: '02',
        title: 'Preparamos la producción',
        description: 'Estilo visual, escenas y horarios con tu equipo.',
      },
      {
        number: '03',
        title: 'Fotografiamos y grabamos',
        description: 'Seguimos el plan acordado con el hotel.',
      },
      {
        number: '04',
        title: 'Editamos y entregamos',
        description: 'Fotografías y vídeos en los formatos y plazos definidos.',
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
        question: '¿Cómo se calcula el presupuesto?',
        answer:
          'Depende de las jornadas, las fotografías y vídeos, los formatos, los derechos de uso y los desplazamientos. La propuesta detalla lo que incluye.',
      },
      {
        question: '¿Trabajáis con agencias y equipos de marketing?',
        answer:
          'Sí. Podemos coordinar la producción con tu equipo o tu agencia y acordar cómo se revisa y aprueba el contenido.',
      },
    ],
  },
  projects: {
    heading: 'Proyectos y portafolio',
    intro:
      'Un proyecto es un encargo contado entero: el contexto de la propiedad, la dirección visual, los días de rodaje y lo que se entregó. El portafolio es la selección de imágenes de cada hotel, sin ese relato detrás.',
    caseSectionLabel: 'Proyectos',
    caseSectionLine: 'Encargos contados de principio a fin.',
    gallerySectionLabel: 'Portafolio',
    gallerySectionLine: 'El resto de propiedades, en imágenes.',
    caseLabel: 'Proyecto',
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
        'Arquitectura, jardines, spa y gastronomía en una selección visual del resort. Una finca morisca de muros de terracota sobre los acantilados de Guía de Isora, con jardines subtropicales que descienden hasta el Atlántico y La Gomera en el horizonte.',
      quote: 'Terracota, océano y jardín: tres tonos que se encuentran en cada rincón de Abama.',
      featuredLine: 'Arquitectura y experiencia en un resort de lujo.',
    },
    {
      seccion: 2,
      hotelName: 'INTERCONTINENTAL LISBOA',
      coupleName: 'Altura urbana',
      description:
        'Interiores, servicio en la habitación y experiencia urbana en Lisboa. Arquitectura contemporánea sobre una de las siete colinas de la ciudad, frente al Parque Eduardo VII, con el skyline y el Tajo de fondo.',
      quote: 'Toda Lisboa se despliega desde lo alto de esta colina.',
      featuredLine: 'El hotel y la experiencia de ciudad.',
    },
    {
      seccion: 3,
      hotelName: 'VESTIGE COLLECTION, BINIDUFÀ',
      coupleName: 'Herencia menorquina',
      description:
        'Los espacios, los materiales y el paisaje rural de Menorca. Una possessió del siglo XVIII restaurada en el norte de la isla, que comparte con Son Ermità un entorno de 800 hectáreas: piedra, barro y silencio agrícola.',
      quote: 'Piedra, tierra y silencio. El norte de Menorca como siempre ha sido.',
      featuredLine: 'Patrimonio y paisaje de Menorca.',
    },
    {
      seccion: 4,
      hotelName: 'DELTAPARK VITALRESORT',
      coupleName: 'Bienestar alpino',
      description:
        'Habitación, spa y lago: un recorrido visual por la experiencia de bienestar. Arquitectura alpina contemporánea a orillas del lago Thun, entre dos reservas del delta del Kander, con un spa de 2.000 m².',
      quote: 'El silencio de los Alpes, reflejado entero en el lago Thun.',
    },
    {
      seccion: 5,
      hotelName: 'HONEYMOON PETRA VILLAS',
      coupleName: 'Acantilado del Egeo',
      description:
        'Arquitectura volcánica y experiencia de estancia frente a la caldera. Tallada en roca sobre la caldera de Santorini, con la piscina suspendida sobre el mar.',
      quote: 'Roca volcánica y un horizonte infinito. Así amanece sobre la caldera.',
    },
    {
      seccion: 6,
      hotelName: 'GPRO VALPARAÍSO PALACE & SPA',
      coupleName: 'Spa mediterráneo',
      description:
        'Fotografías de habitaciones, jardines y spa realizadas en 2023, 2024 y 2026, según el registro del estudio. Jardines privados sobre la Bahía de Palma, en lo alto de Bonanova, con el spa más grande de Mallorca en su interior.',
      quote: 'Jardines, agua y la Bahía de Palma extendiéndose más allá de cada terraza.',
      featuredLine: 'Tres producciones para un mismo hotel.',
    },
    {
      seccion: 7,
      hotelName: 'HOTEL ESPLÉNDIDO',
      coupleName: 'Bahía y piedra',
      description:
        'Estancia, servicio y vida junto a la Bahía de Sóller. Piedra caliza y terrazas frente a la bahía, con la Serra de Tramuntana detrás y el tranvía histórico cruzando el paseo.',
      quote: 'Piedra, mar y el eco del tranvía sobre los adoquines de Sóller.',
    },
    {
      seccion: 8,
      hotelName: 'DISTRICT HIVE',
      coupleName: 'Fuera de la red, en el desierto',
      description:
        'Arquitectura y experiencia de estancia en el paisaje de Gorafe. Una cápsula de cristal y acero suspendida sobre el desierto granadino.',
      quote: 'Todo el cielo como techo, todo el paisaje como horizonte.',
    },
    {
      seccion: 9,
      hotelName: 'WELMOON VILLAS PAISAJE',
      coupleName: 'Bajo las estrellas',
      description:
        'Interiores, bosque y experiencia nocturna en una estancia singular. Villas abovedadas entre los pinares de Caravaca de la Cruz, diseñadas para dormir bajo el cielo sin filtrar de la sierra murciana.',
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
          featuredLine: isNonEmptyString(h.featuredLine) ? h.featuredLine : defaultHotel.featuredLine,
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
      caseSectionLabel: isNonEmptyString(f.projects?.caseSectionLabel)
        ? f.projects!.caseSectionLabel
        : DEFAULT_CONTENT.projects.caseSectionLabel,
      caseSectionLine: isNonEmptyString(f.projects?.caseSectionLine)
        ? f.projects!.caseSectionLine
        : DEFAULT_CONTENT.projects.caseSectionLine,
      gallerySectionLabel: isNonEmptyString(f.projects?.gallerySectionLabel)
        ? f.projects!.gallerySectionLabel
        : DEFAULT_CONTENT.projects.gallerySectionLabel,
      gallerySectionLine: isNonEmptyString(f.projects?.gallerySectionLine)
        ? f.projects!.gallerySectionLine
        : DEFAULT_CONTENT.projects.gallerySectionLine,
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
