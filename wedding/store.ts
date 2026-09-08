import type { Invitation, RsvpResponse } from './types';

const INVITATIONS_KEY = 'hadeer-wedding-invitations-v1';
const RSVP_KEY = 'hadeer-wedding-rsvps-v1';
const MEDIA_DB = 'hadeer-wedding-media-v1';
const MEDIA_STORE = 'invitation-media';
type InvitationMedia = Pick<Invitation, 'venueImage' | 'galleryImages' | 'musicUrl'>;

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
    transaction.objectStore(MEDIA_STORE).put({ venueImage: invitation.venueImage, galleryImages: invitation.galleryImages, musicUrl: invitation.musicUrl }, invitation.id);
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
  return media || { venueImage: '', galleryImages: [], musicUrl: '' };
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

const safeParse = <T,>(value: string | null, fallback: T): T => {
  try { return value ? JSON.parse(value) as T : fallback; } catch { return fallback; }
};

export const getInvitations = (): Invitation[] => {
  if (typeof window === 'undefined') return [royalBurgundySeed];
  const stored = safeParse<Invitation[]>(localStorage.getItem(INVITATIONS_KEY), []);
  if (!stored.some((item) => item.id === royalBurgundySeed.id)) stored.unshift(royalBurgundySeed);
  localStorage.setItem(INVITATIONS_KEY, JSON.stringify(stored));
  return stored;
};

export const saveInvitation = async (invitation: Invitation) => {
  await saveMedia(invitation);
  const items = getInvitations();
  const lightweight = { ...invitation, venueImage: '', galleryImages: [], musicUrl: '' };
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
export const hydrateInvitation = async (invitation: Invitation) => ({ ...invitation, ...(await getMedia(invitation.id)) });
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
