/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ContentStatus = 'draft' | 'in_review' | 'published' | 'archived';

export interface ContentBase {
  id: string;
  slug: string;
  status: ContentStatus;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  scheduledAt?: string;
  
  // Advanced SEO metadata
  seoTitleEn?: string;
  seoTitleNp?: string;
  seoDescriptionEn?: string;
  seoDescriptionNp?: string;
  seoKeywordsEn?: string;
  seoKeywordsNp?: string;
  seoFocusKeyphrase?: string;
  seoCanonicalUrl?: string;
  seoNoIndex?: boolean;
}

export interface Blog extends ContentBase {
  titleEn: string;
  titleNp: string;
  bodyEn: string;
  bodyNp: string;
  authorEn: string;
  authorNp: string;
  categoryEn: string;
  categoryNp: string;
  imageEn: string;
  imageNp: string;
  imageAltEn: string;
  imageAltNp: string;
}

export interface Project extends ContentBase {
  titleEn: string;
  titleNp: string;
  descriptionEn: string;
  descriptionNp: string;
  bodyEn: string;
  bodyNp: string;
  statusEn: string; // e.g. "Ongoing", "Completed"
  statusNp: string; // e.g. "सञ्चालित", "सम्पन्न"
  locationEn: string;
  locationNp: string;
  imageEn: string;
  imageNp: string;
  imageAltEn: string;
  imageAltNp: string;
}

export interface Program extends ContentBase {
  titleEn: string;
  titleNp: string;
  descriptionEn: string;
  descriptionNp: string;
  bodyEn: string;
  bodyNp: string;
  dateEn: string;
  dateNp: string;
  venueEn: string;
  venueNp: string;
  imageEn: string;
  imageNp: string;
  imageAltEn: string;
  imageAltNp: string;
}

export interface GalleryCollection extends ContentBase {
  titleEn: string;
  titleNp: string;
  descriptionEn: string;
  descriptionNp: string;
  images: {
    id: string;
    url: string;
    altEn: string;
    altNp: string;
  }[];
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  resolved: boolean;
  notes?: string;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  action: string; // e.g., "Created draft", "Published", "Updated"
  actionNp: string;
  contentType: 'blog' | 'project' | 'program' | 'gallery' | 'submission';
  contentNameEn: string;
  contentNameNp: string;
  userEn: string;
  userNp: string;
  timeAgoEn: string;
  timeAgoNp: string;
  createdAt: string;
}

export interface DashboardStats {
  blogs: Record<string, number>;
  projects: Record<string, number>;
  programs: Record<string, number>;
  submissions: {
    total: number;
    resolved: number;
    pending: number;
  };
}

export interface CarouselSlide {
  id: string;
  image: string;
  titleEn: string;
  titleNp: string;
  subtitleEn: string;
  subtitleNp: string;
  buttonTextEn: string;
  buttonTextNp: string;
  buttonLink: string;
  order: number;
}

export interface Teammate {
  id: string;
  nameEn: string;
  nameNp: string;
  roleEn: string;
  roleNp: string;
  image: string;
  email?: string;
  order: number;
}

export interface AboutUsSettings {
  historyEn: string;
  historyNp: string;
  missionEn: string;
  missionNp: string;
  visionEn: string;
  visionNp: string;
  team: Teammate[];
}

