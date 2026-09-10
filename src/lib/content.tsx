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

export interface SiteContent {
  hero: {
    /** Rótulo fino sobre el titular. */
    eyebrow: string;
    /** Titular editorial, en dos partes: la segunda va en cursiva. */
    titleLead: string;
    titleEmphasis: string;
    /** Etiqueta a la izquierda de la banda glass inferior. */
    glassLabel: string;
    /** Enlace al final de la banda glass. */
    ctaLabel: string;
  };
  valueBlock: {
    claim: string;
    /** Titular de cada una de las dos formas de generar valor. */
    benefits: string[];
    /** Párrafo de apoyo de cada una, en el mismo orden que `benefits`. */
    benefitDetails: string[];
    ctaLabel: string;
  };
  closingCta: {
    heading: string;
    ctaLabel: string;
  };
  about: {
    flipWords: string[];
    introStatement: string;
    legacyQuote: string;
    mayurlin: { name: string; bio: string };
    yerfran: { name: string; bio: string };
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
  hotels: HotelContent[];
}

// Mirrors the site's current text exactly. Used as the immediate render (no
// loading flash) and as a safe fallback for any field missing or malformed
// in content.json once it's fetched.
export const DEFAULT_CONTENT: SiteContent = {
  hero: {
    eyebrow: 'Mayu Travel · Creative Studio',
    titleLead: 'Visual production for',
    titleEmphasis: 'luxury hotels.',
    glassLabel: 'Photo · Film · Content',
    ctaLabel: 'Projects ↓',
  },
  valueBlock: {
    claim: 'One production. Two ways to create value.',
    benefits: ['Assets for your brand.', 'Distribution, when it fits.'],
    benefitDetails: [
      'Photography and film ready for your website, campaigns, social channels and paid advertising. Scope and usage rights are defined in each proposal, according to what the property needs.',
      'When it fits the goal of the project, we add coverage and publication to an international audience interested in travel and hospitality. It is not a requirement of the production: it is an additional layer.',
    ],
    ctaLabel: 'Enquire about production',
  },
  closingCta: {
    heading: 'Let’s talk about your property.',
    ctaLabel: 'Check availability',
  },
  about: {
    flipWords: ['Direction', 'Distribution'],
    introStatement:
      'Mayu Travel is a visual production studio specialising in luxury hospitality. We work as a couple and build every project from the property itself: its architecture, its rhythm, its service and the way it wants to be remembered.',
    legacyQuote:
      'We don’t do this to fill a feed. We do it because every hotel has a soul that deserves to be seen the way it feels to be there.',
    mayurlin: {
      name: 'Mayurlin Viera',
      bio: 'Creating content was Mayu’s dream long before she had the means to do it. Working with the finest hotels in the world was, from the very beginning, her number one goal. That idea never left her. It simply waited for the right moment and the right hands to make it real. Six years and more than 35 properties later, she still looks at every new hotel the way she looked at the first.',
    },
    yerfran: {
      name: 'Yerfran',
      bio: 'Yerfran came to photography from a different direction: capturing what a person feels in a place, not only how it looks. Years of paying close attention turned into a style of his own: photographs with soul, made with care. Today he directs Mayu Travel’s visual production alongside Mayurlin, in hotels across Spain, Portugal, Greece, Switzerland and the Netherlands.',
    },
    closingStatement:
      'We are especially drawn to properties with a strong sense of place: architecture, landscape, gastronomy, wellness, service, and projects where sustainability is a real part of the experience.',
  },
  contact: {
    headingLines: ['Let\'s talk', 'about your', 'property.'],
    introMain: 'Tell us what you need to produce, where and when.',
    introSub:
      'If there’s a fit, we’ll reply with availability and next steps. You don’t need to prepare a full brief.',
    ctaLabel: 'Start a project',
    emailAddress: 'mayuviera@gmail.com',
    modalKicker: 'Project enquiry',
    modalTitle: 'Tell us the essentials.',
    modalCopy:
      'This is all we need to assess the fit, check availability and propose the next steps.',
  },
  milestones: {
    eyebrow: 'Track record',
    items: [
      { value: '35+', label: 'properties' },
      { value: '5', label: 'countries' },
      { value: '4', label: 'returning clients' },
    ],
    affiliations:
      'Properties within Marriott International, IHG Hotels & Resorts and Wyndham, alongside independent boutique collections across five countries.',
    footnote:
      'Returning clients: GPRO Valparaíso (3 shoots) · Numa Group (3 properties) · Hotel Espléndido (2 shoots) · Portixol (2 shoots)',
  },
  howWeWork: {
    eyebrow: 'How we work',
    heading: 'The process',
    steps: [
      {
        number: '01',
        title: 'First contact and fit',
        description:
          'You get in touch through the form or by email. In a short call we get to know the property, the season and how you plan to use the material.',
      },
      {
        number: '02',
        title: 'Visual plan',
        description:
          'Before we travel we prepare a creative brief, a shot list and a storyboard for the short film. We refine it with the hotel team so that nothing is left out.',
      },
      {
        number: '03',
        title: 'Shooting on site',
        description:
          'Two to five days at the hotel, with the scope set by the season and the activities on offer. We cover the property live while we shoot.',
      },
      {
        number: '04',
        title: 'Editing and delivery',
        description:
          'Colour grading, editing and delivery in approximately three weeks, organised for immediate use on your website, social channels and advertising.',
      },
    ],
  },
  faq: {
    eyebrow: 'Practical information',
    heading: 'Common questions.',
    questions: [
      {
        question: 'How far in advance should dates be booked?',
        answer:
          'Two to three weeks is the usual range. For high season, openings or larger productions, it is worth getting in touch earlier.',
      },
      {
        question: 'Who covers travel and accommodation?',
        answer:
          'They are included in the budget proposal for each project. We coordinate the logistics and any transfers the production requires.',
      },
      {
        question: 'What usage rights does the delivery include?',
        answer:
          'Rights are defined according to the intended use: website, social channels, newsletters, PR, booking platforms and paid advertising campaigns, among others.',
      },
      {
        question: 'Is distribution on @mayurlintravel part of every project?',
        answer:
          'No. Production and distribution are separate layers. When there is a fit between the property, the campaign and our audience, we can add publication and coverage as an additional part of the proposal.',
      },
    ],
  },
  hotels: [
    {
      seccion: 1,
      hotelName: 'THE RITZ-CARLTON TENERIFE, ABAMA',
      coupleName: 'Moorish architecture',
      description:
        'A Moorish estate of terracotta walls above the cliffs of Guía de Isora, with subtropical gardens descending to the Atlantic and La Gomera on the horizon.',
      quote: 'Terracotta, ocean and garden: three tones that meet at every corner of Abama.',
    },
    {
      seccion: 2,
      hotelName: 'INTERCONTINENTAL LISBOA',
      coupleName: 'Urban heights',
      description:
        'Contemporary architecture on one of Lisbon’s seven hills, facing Parque Eduardo VII, with the skyline and the Tagus beyond.',
      quote: 'The whole of Lisbon unfolds from the top of this hill.',
    },
    {
      seccion: 3,
      hotelName: 'VESTIGE COLLECTION, BINIDUFÀ',
      coupleName: 'Menorcan heritage',
      description:
        'A possessió from the 18th century, restored within a private estate of 800 hectares in northern Menorca: stone, clay and agricultural silence.',
      quote: 'Stone, earth and silence. Northern Menorca as it has always been.',
    },
    {
      seccion: 4,
      hotelName: 'DELTAPARK VITALRESORT',
      coupleName: 'Alpine wellness',
      description:
        'Contemporary Alpine architecture on the shore of Lake Thun, between two reserves of the Kander delta, with a 2,000 m² spa.',
      quote: 'The silence of the Alps, reflected whole in Lake Thun.',
    },
    {
      seccion: 5,
      hotelName: 'HONEYMOON PETRA VILLAS',
      coupleName: 'Aegean cliffside',
      description:
        'Carved into volcanic rock above the Santorini caldera, with one of the most coveted pools in the Aegean suspended over the sea.',
      quote: 'Volcanic rock and an endless horizon. This is sunrise over the caldera.',
    },
    {
      seccion: 6,
      hotelName: 'GPRO VALPARAÍSO PALACE & SPA',
      coupleName: 'Mediterranean spa',
      description:
        'Private gardens above the Bay of Palma, high in Bonanova, with the largest spa in Mallorca inside.',
      quote: 'Gardens, water and the Bay of Palma stretching out beyond every terrace.',
    },
    {
      seccion: 7,
      hotelName: 'HOTEL ESPLÉNDIDO',
      coupleName: 'Bay and stone',
      description:
        'Limestone and terraces facing the Bay of Sóller, with the Serra de Tramuntana behind and the historic tram crossing the promenade.',
      quote: 'Stone, sea and the echo of the tram on the cobbles of Sóller.',
    },
    {
      seccion: 8,
      hotelName: 'DISTRICT HIVE',
      coupleName: 'Off the grid, in the desert',
      description:
        'A capsule of glass and steel suspended above the Gorafe badlands, with architecture that runs off the grid: water drawn from the air and power from the sun.',
      quote: 'The whole sky for a roof, the whole badlands for a horizon.',
    },
    {
      seccion: 9,
      hotelName: 'WELMOON VILLAS PAISAJE',
      coupleName: 'Under the stars',
      description:
        'Vaulted villas among the pine woods of Caravaca de la Cruz, designed for sleeping under the unfiltered skies of the Murcian sierra.',
      quote: 'A roof of stars and the silence of the Murcian sierra.',
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

  const benefits = stringList(f.valueBlock?.benefits, DEFAULT_CONTENT.valueBlock.benefits);

  // Cada titular necesita su párrafo: si el JSON trae menos de los que hay
  // titulares, se completa con los de por defecto en vez de dejar huecos.
  const benefitDetails = stringList(
    f.valueBlock?.benefitDetails,
    DEFAULT_CONTENT.valueBlock.benefitDetails
  );

  return {
    hero: {
      eyebrow: isNonEmptyString(f.hero?.eyebrow) ? f.hero!.eyebrow : DEFAULT_CONTENT.hero.eyebrow,
      titleLead: isNonEmptyString(f.hero?.titleLead)
        ? f.hero!.titleLead
        : DEFAULT_CONTENT.hero.titleLead,
      titleEmphasis: isNonEmptyString(f.hero?.titleEmphasis)
        ? f.hero!.titleEmphasis
        : DEFAULT_CONTENT.hero.titleEmphasis,
      glassLabel: isNonEmptyString(f.hero?.glassLabel)
        ? f.hero!.glassLabel
        : DEFAULT_CONTENT.hero.glassLabel,
      ctaLabel: isNonEmptyString(f.hero?.ctaLabel)
        ? f.hero!.ctaLabel
        : DEFAULT_CONTENT.hero.ctaLabel,
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
      mayurlin: {
        name: isNonEmptyString(f.about?.mayurlin?.name) ? f.about!.mayurlin.name : DEFAULT_CONTENT.about.mayurlin.name,
        bio: isNonEmptyString(f.about?.mayurlin?.bio) ? f.about!.mayurlin.bio : DEFAULT_CONTENT.about.mayurlin.bio,
      },
      yerfran: {
        name: isNonEmptyString(f.about?.yerfran?.name) ? f.about!.yerfran.name : DEFAULT_CONTENT.about.yerfran.name,
        bio: isNonEmptyString(f.about?.yerfran?.bio) ? f.about!.yerfran.bio : DEFAULT_CONTENT.about.yerfran.bio,
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
