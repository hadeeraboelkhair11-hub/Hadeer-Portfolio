import type { Invitation, OldMoneyContent, RsvpResponse } from './types';

const INVITATIONS_KEY = 'hadeer-wedding-invitations-v1';
const RSVP_KEY = 'hadeer-wedding-rsvps-v1';
const MEDIA_DB = 'hadeer-wedding-media-v1';
const MEDIA_STORE = 'invitation-media';
type InvitationMedia = Pick<Invitation, 'venueImage' | 'galleryImages' | 'musicUrl'> & { heroImage?: string; monogramImage?: string; storyImages?: Record<string, string> };

export const createOldMoneyContent = (): OldMoneyContent => ({
  heroImage: '', monogramImage: '',
  ceremonyTitle: 'Wedding Ceremony', ceremonyDescription: 'Join us as we exchange our vows.',
  receptionTitle: 'Dinner & Reception', receptionTime: '20:00', receptionDescription: 'Dinner, celebration and dancing to follow.',
  timeline: [
    { id: crypto.randomUUID(), title: 'Guest Arrival', time: '6:30 PM', description: 'Welcome drinks' },
    { id: crypto.randomUUID(), title: 'Ceremony', time: '7:00 PM', description: 'The exchange of vows' },
    { id: crypto.randomUUID(), title: 'Reception', time: '8:00 PM', description: 'Dinner and celebration' },
  ],
  loveStoryTitle: 'Our Love Story',
  loveStory: [],
  dressCodeTitle: 'Dress Code', dressCodeDescription: 'Formal evening attire', dressCodeColors: ['#5d0b18', '#f2e7d4', '#b78b43', '#1f1715'],
  stayEnabled: false, hotelName: '', hotelDescription: '', hotelAddress: '', hotelUrl: '', externalLinks: [],
});

const openMediaDb = (): Promise<IDBDatabase> => new Promise((resolve, reject) => {
  const request = indexedDB.open(MEDIA_DB, 1);
  request.onupgradeneeded = () => {
    if (!request.result.objectStoreNames.contains(MEDIA_STORE)) request.result.createObjectStore(MEDIA_STORE);
  };
  request.onsuccess = () => resolve(request.result);
  request.onerror = () => reject(request.error || new Error('تعذر فتح مساحة حفظ الوسائط.'));
});

const saveMedia = async (invitation: Invitation) => {
  const db = await openMediaDb();
  await new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(MEDIA_STORE, 'readwrite');
    transaction.objectStore(MEDIA_STORE).put({
      venueImage: invitation.venueImage, galleryImages: invitation.galleryImages, musicUrl: invitation.musicUrl,
      heroImage: invitation.oldMoney?.heroImage || '', monogramImage: invitation.oldMoney?.monogramImage || '',
      storyImages: Object.fromEntries((invitation.oldMoney?.loveStory || []).map((item) => [item.id, item.image])),
    }, invitation.id);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error || new Error('تعذر حفظ الصور والموسيقى.'));
    transaction.onabort = () => reject(transaction.error || new Error('تعذر حفظ الصور والموسيقى.'));
  });
  db.close();
};

const getMedia = async (id: string): Promise<InvitationMedia> => {
  const db = await openMediaDb();
  const media = await new Promise<InvitationMedia | undefined>((resolve, reject) => {
    const request = db.transaction(MEDIA_STORE, 'readonly').objectStore(MEDIA_STORE).get(id);
    request.onsuccess = () => resolve(request.result as InvitationMedia | undefined);
    request.onerror = () => reject(request.error);
  });
  db.close();
  return media || { venueImage: '', galleryImages: [], musicUrl: '', heroImage: '', monogramImage: '', storyImages: {} };
};

const deleteMedia = async (id: string) => {
  const db = await openMediaDb();
  await new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(MEDIA_STORE, 'readwrite');
    transaction.objectStore(MEDIA_STORE).delete(id);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
  db.close();
};

export const royalBurgundySeed: Invitation = {
  id: 'maryam-saif-demo', slug: 'maryam-saif', templateId: 'royal-burgundy', status: 'published',
  language: 'en',
  brideName: 'Maryam', groomName: 'Saif', weddingDate: '2026-10-05', openingTime: '18:30', ceremonyTime: '19:00',
  venueName: 'Grand Hyatt Muscat', address: 'Shatti Al Qurum, Muscat, Oman',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Grand+Hyatt+Muscat%2C+Muscat%2C+Oman',
  invitationText: 'Together with their families, Maryam and Saif invite you to celebrate the beginning of their forever.',
  dressCode: 'Formal evening attire', rsvpDeadline: '2026-09-15', contactNumber: '+968 9000 0000',
  venueImage: '', galleryImages: [], musicUrl: '',
  sections: { countdown: true, venue: true, gallery: true, dressCode: true, rsvp: true, music: true },
  theme: { primary: '#6d0f21', secondary: '#c99a4b', background: '#fff7e9', text: '#57101d' },
  createdAt: '2026-09-08T00:00:00.000Z', updatedAt: '2026-09-08T00:00:00.000Z',
};

export const oldMoneySeed: Invitation = {
  ...royalBurgundySeed,
  id: 'old-money-demo', slug: 'old-money-demo', templateId: 'old-money-burgundy', language: 'en', status: 'published',
  brideName: 'Isabella', groomName: 'James', weddingDate: '2026-11-21', openingTime: '18:00', ceremonyTime: '18:30',
  venueName: 'The Royal Estate', address: 'Muscat, Oman',
  invitationText: 'Together with their families, Isabella and James request the pleasure of your company as they celebrate their marriage.',
  dressCode: 'Black tie · Burgundy, ivory and antique gold',
  sections: { countdown: false, venue: true, gallery: false, dressCode: true, rsvp: true, music: true, welcome: true, details: true, timeline: true, loveStory: true, whereToStay: true, externalLinks: true },
  theme: { primary: '#5d0b18', secondary: '#b78b43', background: '#f2e7d4', text: '#4a1118' },
  oldMoney: {
    ...createOldMoneyContent(), stayEnabled: true, hotelName: 'The Chedi Muscat', hotelDescription: 'A preferred stay for our guests.', hotelAddress: 'North Ghubra, Muscat', hotelUrl: 'https://www.google.com/maps',
    loveStory: [
      { id: 'story-first', title: 'The First Hello', date: '2021', description: 'A chance meeting became the beginning of everything.', image: '' },
      { id: 'story-yes', title: 'She Said Yes', date: '2025', description: 'Under a sky full of stars, we chose forever.', image: '' },
    ],
  },
  createdAt: '2026-09-16T00:00:00.000Z', updatedAt: '2026-09-16T00:00:00.000Z',
};

const safeParse = <T,>(value: string | null, fallback: T): T => {
  try { return value ? JSON.parse(value) as T : fallback; } catch { return fallback; }
};

const normalizeInvitation = (item: Invitation): Invitation => ({ ...item, language: item.language || 'en', oldMoney: item.templateId === 'old-money-burgundy' ? { ...createOldMoneyContent(), ...item.oldMoney } : item.oldMoney });

export const getInvitations = (): Invitation[] => {
  if (typeof window === 'undefined') return [royalBurgundySeed, oldMoneySeed];
  const stored = safeParse<Invitation[]>(localStorage.getItem(INVITATIONS_KEY), []);
  if (!stored.some((item) => item.id === royalBurgundySeed.id)) stored.unshift(royalBurgundySeed);
  if (!stored.some((item) => item.id === oldMoneySeed.id)) stored.unshift(oldMoneySeed);
  const normalized = stored.map(normalizeInvitation);
  localStorage.setItem(INVITATIONS_KEY, JSON.stringify(normalized));
  return normalized;
};

export const saveInvitation = async (invitation: Invitation) => {
  await saveMedia(invitation);
  const items = getInvitations();
  const lightweight = { ...invitation, venueImage: '', galleryImages: [], musicUrl: '', oldMoney: invitation.oldMoney ? { ...invitation.oldMoney, heroImage: '', monogramImage: '', loveStory: invitation.oldMoney.loveStory.map((item) => ({ ...item, image: '' })) } : undefined };
  const index = items.findIndex((item) => item.id === invitation.id);
  if (index >= 0) items[index] = lightweight; else items.unshift(lightweight);
  localStorage.setItem(INVITATIONS_KEY, JSON.stringify(items));
  const saved = safeParse<Invitation[]>(localStorage.getItem(INVITATIONS_KEY), []);
  if (!saved.some((item) => item.id === invitation.id && item.updatedAt === invitation.updatedAt)) {
    throw new Error('تعذر التأكد من حفظ الدعوة. حاولي مرة أخرى.');
  }
  return invitation;
};

export const deleteInvitation = async (id: string) => { localStorage.setItem(INVITATIONS_KEY, JSON.stringify(getInvitations().filter((item) => item.id !== id))); await deleteMedia(id); };
export const getInvitationBySlug = (slug: string) => getInvitations().find((item) => item.slug === slug);
export const getInvitationById = (id: string) => getInvitations().find((item) => item.id === id);
export const hydrateInvitation = async (invitation: Invitation) => {
  const media = await getMedia(invitation.id);
  return { ...invitation, venueImage: media.venueImage, galleryImages: media.galleryImages, musicUrl: media.musicUrl, oldMoney: invitation.oldMoney ? { ...invitation.oldMoney, heroImage: media.heroImage || '', monogramImage: media.monogramImage || '', loveStory: invitation.oldMoney.loveStory.map((item) => ({ ...item, image: media.storyImages?.[item.id] || '' })) } : undefined };
};
export const getInvitationBySlugWithMedia = async (slug: string) => { const item = getInvitationBySlug(slug); return item ? hydrateInvitation(item) : undefined; };
export const getInvitationByIdWithMedia = async (id: string) => { const item = getInvitationById(id); return item ? hydrateInvitation(item) : undefined; };
export const getRsvps = (): RsvpResponse[] => safeParse<RsvpResponse[]>(localStorage.getItem(RSVP_KEY), []);
export const addRsvp = (response: RsvpResponse) => localStorage.setItem(RSVP_KEY, JSON.stringify([response, ...getRsvps()]));

export const duplicateInvitation = async (source: Invitation): Promise<Invitation> => {
  const now = new Date().toISOString();
  const hydrated = await hydrateInvitation(source);
  return { ...hydrated, id: crypto.randomUUID(), slug: `${source.slug}-copy-${Date.now().toString().slice(-4)}`, status: 'draft', createdAt: now, updatedAt: now };
};

export const emptyInvitation = (): Invitation => {
  const now = new Date().toISOString();
  return { ...royalBurgundySeed, id: crypto.randomUUID(), slug: '', status: 'draft', brideName: '', groomName: '', weddingDate: '', venueName: '', address: '', mapsUrl: '', invitationText: '', dressCode: '', rsvpDeadline: '', contactNumber: '', createdAt: now, updatedAt: now };
};
