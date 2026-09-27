import type { SiteContent } from './content';

/** LA WEB ENTERA EN INGLÉS, palabra por palabra.
 *
 *  Este archivo es el espejo exacto de `public/images/content.en.json`, igual
 *  que `DEFAULT_CONTENT` lo es de `content.json`. Sirve de red: si el JSON
 *  falta, llega roto o el hosting lo sirve mal, el visitante en inglés sigue
 *  leyendo inglés en vez de caerse al español, que es lo que pasaría si la
 *  única versión inglesa viviera en el JSON.
 *
 *  SI SE EDITA UNO, SE EDITA EL OTRO. Los dos, siempre.
 *
 *  NO ES UNA TRADUCCIÓN LITERAL, y eso es deliberado. Donde el español spelled
 *  out "Treinta y cinco propiedades", aquí va "35 properties": escribirlo en
 *  letra obligaría a "thirty-five" y en esta web no entran guiones que separen
 *  palabras. "Preguntas frecuentes" es la fórmula estándar en español, así que
 *  en inglés va la fórmula estándar inglesa, no una versión ingeniosa. Y el
 *  inglés es británico ("organised", "enquiry"), porque los hoteles a los que
 *  va esto están en Europa.
 *
 *  LO ÚNICO CON GUION son los rangos de cifras (3–5, 40–50), que ya venían del
 *  español y no separan ideas, y el nombre propio Ritz-Carlton.
 */

export const DEFAULT_CONTENT_EN: SiteContent = {
  hero: {
    eyebrow: 'STUDIO · HOSPITALITY',
    titleLead: 'Photography and film production for',
    titleEmphasis: 'luxury hotels.',
    subline: 'We create photography, brand films and vertical pieces that show your hotel\'s spaces, its service and the experience of staying there.',
    glassLabel: 'VISUAL PRODUCTION STUDIO',
    ctaLabel: 'Start a project',
    secondaryLabel: 'See the work',
  },
  whatWeCreate: {
    heading: 'What we create',
    items: [
      {
        title: 'Hotel photography',
        description: 'Architecture, interiors, dining and the guest experience.',
      },
      {
        title: 'Brand films',
        description: 'Films that introduce your hotel.',
      },
      {
        title: 'Reels and vertical video',
        description: 'Pieces for social media, built for the format we agree on.',
      },
      {
        title: 'Photo and film library',
        description: 'Content organised for your website, your social channels and your campaigns.',
      },
    ],
    ctaLabel: 'Start a project',
  },
  whyUs: {
    heading: 'Why Mayu Travel',
    intro: 'Four things the photographs don\'t show.',
    items: [
      {
        title: 'No one in between',
        description: 'The two of us you see here are the two who arrive at your hotel. Nothing is outsourced.',
      },
      {
        title: 'Spaces with someone in them',
        description: 'The difference between showing a room and showing a stay. That is what makes someone book.',
      },
      {
        title: 'A hotel still running',
        description: '35 properties have taught us how to shoot without interrupting the service or the guests.',
      },
      {
        title: 'They call us back',
        description: 'Four hotels have booked us again. GPRO Valparaíso, three times.',
      },
    ],
    ctaLabel: 'Meet the team',
  },
  waysToWork: {
    eyebrow: 'Where to start',
    heading: 'Ways to work together',
    intro: 'Together we define what we shoot, how it can be used and what it costs.',
    items: [
      {
        title: 'Campaigns and launches',
        description: 'Photography and film for a campaign, an opening or a new space.',
      },
      {
        title: 'Refreshing your content',
        description: 'A library of photography and film to bring the hotel\'s communication up to date.',
      },
      {
        title: 'Ongoing production',
        description: 'New shoots as the seasons change and the hotel needs them.',
      },
    ],
    ctaLabel: 'Start a project',
    scopeLabel: 'A typical shoot',
    scopeNote: 'So you have a sense of it before writing. Every project is shaped around what the hotel needs.',
    scopeItems: [
      {
        value: '3–5',
        label: 'days on the property',
      },
      {
        value: '40–50',
        label: 'photographs',
      },
      {
        value: '3',
        label: 'vertical video pieces',
      },
    ],
  },
  valueBlock: {
    claim: 'One production, two destinations.',
    benefits: [
      'Content for your hotel\'s own channels.',
      'Posts on @mayurlintravel, as an additional service.',
    ],
    benefitDetails: [
      'Photography and film in the formats and with the usage rights set out in the proposal.',
      'When the project suits our audience, part of the material is published on @mayurlintravel, to an international community of travel and hospitality.',
    ],
    ctaLabel: 'Start a project',
  },
  closingCta: {
    heading: 'Let\'s start with what you need to show.',
    ctaLabel: 'Start a project',
    secondaryLabel: 'See the work',
  },
  about: {
    flipWords: [
      'Direction',
      'Production',
    ],
    introStatement: 'Mayu Travel is a visual production studio for luxury hospitality. We work as a pair and build every project out of the property itself: its architecture, its rhythm, its service and the way it wants to be remembered.',
    legacyQuote: 'We decide what gets shot and what doesn\'t. You don\'t tell a hotel by showing everything, but by choosing what makes someone want to be there.',
    overview: {
      heading: 'Your creative partner in hospitality.',
      paragraph: 'We are Mayurlin Viera and Yerfran. We work with your team to define what to show of your hotel and how to tell it in photography and film. We plan and carry out the production in a visual style that holds true to your brand.',
      boxes: [
        {
          label: 'Focus',
          value: 'Luxury hospitality',
        },
        {
          label: 'Approach',
          value: 'A proposal of its own for every hotel',
        },
        {
          label: 'Relationship',
          value: 'Direct with the people creating the work',
        },
        {
          label: 'Delivery',
          value: 'Photography and film ready to use',
        },
      ],
      ctaLabel: 'Meet the team',
    },
    mayurlin: {
      name: 'Mayurlin Viera',
      role: 'Photography and creative direction',
      bio: 'Mayurlin defines the visual concept from the hotel\'s own identity and directs the photography, appearing on camera when the agreed scenes call for it.',
    },
    yerfran: {
      name: 'Yerfran',
      role: 'Film production',
      bio: 'Yerfran plans and carries out the film production, from the technical decisions on the shoot to the edit and the final versions for the agreed channels.',
    },
    together: {
      heading: 'You work directly with us.',
      description: 'We coordinate the sessions, the spaces and the timings with your team, so guests and staff are disturbed as little as possible.',
    },
    closingStatement: 'We both direct the production. Appearances on camera and any extra support are agreed project by project.',
  },
  contact: {
    headingLines: [
      'Let\'s talk',
      'about your',
      'hotel.',
    ],
    introMain: 'Tell us what photography or film you need, where and by when.',
    introSub: 'The project doesn\'t have to be fully defined yet.',
    ctaLabel: 'Start a project',
    emailAddress: 'mayuviera@gmail.com',
    directLabel: 'Or write to us at',
    modalKicker: 'Project enquiry',
    modalTitle: 'Tell us the essentials.',
    modalCopy: 'That is enough for us to see whether we are a fit, check availability and propose the next steps.',
  },
  milestones: {
    eyebrow: 'Track record',
    items: [
      {
        value: '35+',
        label: 'properties',
      },
      {
        value: '5',
        label: 'countries',
      },
      {
        value: '4',
        label: 'returning clients',
      },
    ],
    affiliations: 'Properties within Marriott International, IHG Hotels & Resorts and Wyndham, alongside independent boutique collections in five countries.',
    footnote: 'Returning clients: GPRO Valparaíso (3 shoots) · Numa Group (3 properties) · Hotel Espléndido (2 shoots) · Portixol (2 shoots)',
  },
  howWeWork: {
    eyebrow: 'How we work',
    heading: 'The process',
    steps: [
      {
        number: '01',
        title: 'We define the project with you',
        description: 'What you need to show, to whom and on which channels.',
      },
      {
        number: '02',
        title: 'We prepare the production',
        description: 'Visual style, scenes and timings with your team.',
      },
      {
        number: '03',
        title: 'We photograph and film',
        description: 'We follow the plan agreed with the hotel.',
      },
      {
        number: '04',
        title: 'We edit and deliver',
        description: 'Photography and film in the formats and to the deadlines agreed.',
      },
    ],
  },
  faq: {
    heading: 'Frequently asked questions.',
    questions: [
      {
        question: 'How far ahead should we book a date?',
        answer: 'Two to three weeks is the usual range. For high season, openings or larger productions, it is better to write sooner.',
      },
      {
        question: 'Who covers travel and accommodation?',
        answer: 'Both are included in the budget proposal for each project. We coordinate the logistics and any transfers the production needs.',
      },
      {
        question: 'What usage rights does the delivery include?',
        answer: 'The rights are set according to the intended use: website, social media, email newsletters, press and PR, booking platforms and paid advertising campaigns, among others.',
      },
      {
        question: 'How is the budget calculated?',
        answer: 'It depends on the number of days, the photography and film, the formats, the usage rights and the travel. The proposal sets out exactly what is included.',
      },
      {
        question: 'Do you work with agencies and marketing teams?',
        answer: 'Yes. We can coordinate the production with your team or your agency and agree how the content is reviewed and approved.',
      },
    ],
  },
  projects: {
    heading: 'Projects and portfolio',
    caseSectionLabel: 'Projects',
    caseSectionLine: 'One shoot told from start to finish.',
    gallerySectionLabel: 'Portfolio',
    gallerySectionLine: 'The rest of the work, in pictures.',
    caseLabel: 'Project',
    caseLinkLabel: 'View project',
    galleryLinkLabel: 'View gallery',
    closingHeading: 'Every project begins with a conversation.',
    ctaLabel: 'Start a project',
    subline: 'Photography and film production for hotels and stays with an identity of their own.',
  },
  hotels: [
    {
      seccion: 1,
      hotelName: 'THE RITZ-CARLTON TENERIFE, ABAMA',
      coupleName: 'Moorish architecture',
      description: 'Architecture, gardens, spa and dining in a visual selection from the resort. A Moorish estate of terracotta walls above the cliffs of Guía de Isora, with subtropical gardens falling towards the Atlantic and La Gomera on the horizon.',
      quote: 'Terracotta, ocean and garden: three tones that meet in every corner of Abama.',
      featuredLine: 'Architecture and experience in a luxury resort.',
    },
    {
      seccion: 2,
      hotelName: 'INTERCONTINENTAL LISBOA',
      coupleName: 'City heights',
      description: 'Interiors, service in the room and the experience of the city in Lisbon. Contemporary architecture on one of the city\'s seven hills, facing Parque Eduardo VII, with the skyline and the Tagus behind.',
      quote: 'All of Lisbon unfolds from the top of this hill.',
      featuredLine: 'The hotel and the city around it.',
    },
    {
      seccion: 3,
      hotelName: 'VESTIGE COLLECTION, BINIDUFÀ',
      coupleName: 'Menorcan heritage',
      description: 'The spaces, the materials and the rural landscape of Menorca. A possessió from the eighteenth century, restored in the north of the island and sharing 800 hectares with Son Ermità: stone, clay and farmland silence.',
      quote: 'Stone, earth and silence. The north of Menorca as it has always been.',
      featuredLine: 'Heritage and landscape in Menorca.',
    },
    {
      seccion: 4,
      hotelName: 'DELTAPARK VITALRESORT',
      coupleName: 'Alpine wellbeing',
      description: 'Room, spa and lake: a visual walk through the wellbeing experience. Contemporary alpine architecture on the shore of Lake Thun, between two reserves of the Kander delta, with a spa of 2,000 m².',
      quote: 'The silence of the Alps, reflected whole in Lake Thun.',
    },
    {
      seccion: 5,
      hotelName: 'HONEYMOON PETRA VILLAS',
      coupleName: 'Aegean cliff',
      description: 'Volcanic architecture and the experience of staying above the caldera. Carved into the rock over the Santorini caldera, with the pool suspended above the sea.',
      quote: 'Volcanic rock and an endless horizon. This is how day breaks over the caldera.',
    },
    {
      seccion: 6,
      hotelName: 'GPRO VALPARAÍSO PALACE & SPA',
      coupleName: 'Mediterranean spa',
      description: 'Photographs of rooms, gardens and spa made in 2023, 2024 and 2026, according to the studio\'s records. Private gardens above the Bay of Palma, high in Bonanova, with the largest spa in Mallorca inside.',
      quote: 'Gardens, water and the Bay of Palma stretching out beyond every terrace.',
      featuredLine: 'Three productions for the same hotel.',
    },
    {
      seccion: 7,
      hotelName: 'HOTEL ESPLÉNDIDO',
      coupleName: 'Bay and stone',
      description: 'The stay, the service and life beside the Bay of Sóller. Limestone and terraces facing the bay, with the Serra de Tramuntana behind and the historic tram crossing the promenade.',
      quote: 'Stone, sea and the echo of the tram over the cobbles of Sóller.',
    },
    {
      seccion: 8,
      hotelName: 'DISTRICT HIVE',
      coupleName: 'Off the grid, in the desert',
      description: 'Architecture and the experience of staying in the landscape of Gorafe. A capsule of glass and steel suspended over the desert of Granada.',
      quote: 'The whole sky as a roof, the whole landscape as a horizon.',
    },
    {
      seccion: 9,
      hotelName: 'WELMOON VILLAS PAISAJE',
      coupleName: 'Under the stars',
      description: 'Interiors, forest and the experience of the night in a place unlike any other. Vaulted villas among the pine woods of Caravaca de la Cruz, built for sleeping under the unfiltered sky of the Murcian sierra.',
      quote: 'A roof of stars and the silence of the Murcian sierra.',
    },
  ],
};
