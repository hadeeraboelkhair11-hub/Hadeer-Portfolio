export type InvitationStatus = 'draft' | 'published';

export type WeddingSections = {
  countdown: boolean;
  venue: boolean;
  gallery: boolean;
  dressCode: boolean;
  rsvp: boolean;
  music: boolean;
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
  templateId: 'royal-burgundy';
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

