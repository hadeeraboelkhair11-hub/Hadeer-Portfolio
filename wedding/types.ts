export type InvitationStatus = 'draft' | 'published';
export type InvitationLanguage = 'ar' | 'en';
export type WeddingTemplateId = 'royal-burgundy' | 'old-money-burgundy';

export type TimelineItem = { id: string; title: string; time: string; description?: string; icon?: string };
export type LoveStoryItem = { id: string; title: string; date: string; description: string; image: string };
export type ExternalLink = { id: string; label: string; url: string };

export type OldMoneyContent = {
  heroImage: string;
  monogramImage: string;
  ceremonyTitle: string;
  ceremonyDescription: string;
  receptionTitle: string;
  receptionTime: string;
  receptionDescription: string;
  timeline: TimelineItem[];
  loveStoryTitle: string;
  loveStory: LoveStoryItem[];
  dressCodeTitle: string;
  dressCodeDescription: string;
  dressCodeColors: string[];
  stayEnabled: boolean;
  hotelName: string;
  hotelDescription: string;
  hotelAddress: string;
  hotelUrl: string;
  externalLinks: ExternalLink[];
};

export type WeddingSections = {
  countdown: boolean;
  venue: boolean;
  gallery: boolean;
  dressCode: boolean;
  rsvp: boolean;
  music: boolean;
  welcome?: boolean;
  details?: boolean;
  timeline?: boolean;
  loveStory?: boolean;
  whereToStay?: boolean;
  externalLinks?: boolean;
};

export type WeddingTheme = {
  primary: string;
  secondary: string;
  background: string;
  text: string;
};

export type Invitation = {
  id: string;
  slug: string;
  templateId: WeddingTemplateId;
  language: InvitationLanguage;
  status: InvitationStatus;
  brideName: string;
  groomName: string;
  weddingDate: string;
  openingTime: string;
  ceremonyTime: string;
  venueName: string;
  address: string;
  mapsUrl: string;
  invitationText: string;
  dressCode: string;
  rsvpDeadline: string;
  contactNumber: string;
  venueImage: string;
  galleryImages: string[];
  musicUrl: string;
  oldMoney?: OldMoneyContent;
  sections: WeddingSections;
  theme: WeddingTheme;
  createdAt: string;
  updatedAt: string;
};

export type RsvpResponse = {
  id: string;
  invitationId: string;
  guestName: string;
  attending: boolean;
  guests: number;
  message: string;
  submittedAt: string;
};
