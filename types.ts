export type Page = 'home' | 'projects' | 'about' | 'contact';

// Home page hero/scroll experience (original design) -- kept alongside the
// newer CollaborationCase model used on the About/Portfolio/Contact pages.
export interface PhotoItem {
  id: string;
  url: string;
  alt: string;
  caption?: string;
  aspectRatio?: 'portrait' | 'landscape' | 'square';
  isBlackAndWhite?: boolean;
}

export interface HotelStory {
  id: string;
  hotelName: string;
  leftTag?: string; // e.g. "HOTEL", "VILLA", "PALAZZO"
  coupleName: string;
  location: string;
  country: string;
  year: string;
  coverImage: string;
  description: string;
  photos: PhotoItem[]; // exactly 3 photos for the home page teaser block
  // Optional dedicated, chronologically-ordered photo set for the portfolio detail
  // page gallery (a guided "walk through the property" -- facade, room, amenities,
  // dining, etc). Falls back to `photos` when a hotel doesn't have one yet.
  galleryPhotos?: PhotoItem[];
  // Optional horizontal video for the story detail page gallery (position ~4, never first).
  galleryVideo?: {
    url: string;
    poster: string;
  };
  quote?: string;
  category: 'Luxury Hotel' | 'Destination Wedding' | 'Romantic Escape' | 'Historic Villa';
  layoutVariant?: number; // 0 to 7 unique layout variations
  /** Durable facts about the shoot, shown on the portfolio page. They turn the
   *  gallery from "nice photos" into demonstrable commercial work. Every field
   *  is optional -- each one renders only when we actually have the data. */
  caseStudy?: {
    /** When it was shot, e.g. "Julio · Verano" or "Verano · 2023, 2024 y 2026". */
    season?: string;
    /** Length of the shoot, e.g. "4 días". */
    duration?: string;
    /** Where the hotel put the material, e.g. "Redes sociales · Campaña de temporada alta". */
    usage?: string;
  };
}

export type CollaborationCategory =
  | 'Grandes Resorts de Lujo'
  | 'Boutique y Destino'
  | 'Experiencial y Sostenible';

export interface CollaborationCase {
  id: string;
  brandName: string;
  category: CollaborationCategory;
  location?: string;
  summary: string;
  /** True once real photography/video for this collaboration has been added. */
  hasMedia: boolean;
  coverImage?: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  /** Job title. Omitted when the client only gave us a name. */
  role?: string;
  brandName: string;
  /** Photo from that property's shoot, shown beside the quote. Falls back to
   *  the brand name set in type when we don't have imagery for the brand yet. */
  photo?: string;
  /** Durable proof of repeat business, e.g. "3 rodajes juntos". */
  repeatNote?: string;
}

export interface CollaborationInquiry {
  name: string;
  email: string;
  phone?: string;
  propertyName: string;
  collaborationType: string;
  availabilityDate: string;
  message: string;
}
