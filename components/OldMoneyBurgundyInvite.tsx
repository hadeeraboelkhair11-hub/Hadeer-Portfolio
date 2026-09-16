import React, { FormEvent, useRef, useState } from 'react';
import { CalendarDays, ExternalLink, Hotel, MapPin, Music, Pause, Play, Volume2 } from 'lucide-react';
import type { Invitation } from '../wedding/types';
import { addRsvp, createOldMoneyContent } from '../wedding/store';
import './OldMoneyBurgundyInvite.css';

const A = '/wedding-assets/template-02';

const dictionary = {
  en: { open:'Open Invitation', welcome:'Together with their families', details:'Wedding Details', ceremony:'Ceremony', reception:'Reception', timeline:'Wedding Timeline', story:'Our Love Story', dress:'Dress Code', stay:'Where to Stay', venue:'The Venue', directions:'View Location', rsvp:'Kindly Reply', guest:'Guest name', yes:'Joyfully accepts', no:'Regretfully declines', count:'Number of guests', message:'A note for the couple (optional)', send:'Send RSVP', sent:'Thank you. Your response has been received.', links:'Useful Links', music:'Music' },
  ar: { open:'افتح الدعوة', welcome:'بكل الحب ومع عائلتيهما', details:'تفاصيل الزفاف', ceremony:'المراسم', reception:'حفل الاستقبال', timeline:'برنامج الحفل', story:'قصتنا', dress:'الزي المطلوب', stay:'أماكن الإقامة', venue:'مكان الحفل', directions:'عرض الموقع', rsvp:'تأكيد الحضور', guest:'اسم الضيف', yes:'سأحضر بكل سرور', no:'أعتذر عن الحضور', count:'عدد الضيوف', message:'رسالة للعروسين (اختياري)', send:'إرسال الرد', sent:'شكرًا لك، تم استلام ردك.', links:'روابط مهمة', music:'الموسيقى' },
} as const;

export default function OldMoneyBurgundyInvite({ invitation }: { invitation: Invitation }) {
  const [opened, setOpened] = useState(false);
  const [entered, setEntered] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [sent, setSent] = useState(false);
  const audio = useRef<HTMLAudioElement | null>(null);
  const content = invitation.oldMoney || createOldMoneyContent();
  const lang = invitation.language || 'en';
  const t = dictionary[lang];
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const date = invitation.weddingDate ? new Intl.DateTimeFormat(lang === 'ar' ? 'ar-OM' : 'en-GB', { day:'2-digit', month:'long', year:'numeric' }).format(new Date(`${invitation.weddingDate}T12:00:00`)) : '';
  const initials = `${invitation.brideName?.[0] || ''}${invitation.groomName?.[0] || ''}`;

  const enter = () => {
    setOpened(true);
    if (invitation.sections.music && invitation.musicUrl) {
      audio.current = new Audio(invitation.musicUrl); audio.current.loop = true;
      void audio.current.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
    window.setTimeout(() => setEntered(true), 900);
  };
  const toggleMusic = () => {
    if (!audio.current && invitation.musicUrl) { audio.current = new Audio(invitation.musicUrl); audio.current.loop = true; }
    if (!audio.current) return;
    if (playing) { audio.current.pause(); setPlaying(false); } else void audio.current.play().then(() => setPlaying(true));
  };
  const submitRsvp = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); const form = new FormData(event.currentTarget);
    addRsvp({ id: crypto.randomUUID(), invitationId: invitation.id, guestName: String(form.get('guestName') || ''), attending: form.get('attending') === 'yes', guests: Number(form.get('guests') || 1), message: String(form.get('message') || ''), submittedAt: new Date().toISOString() });
    setSent(true); event.currentTarget.reset();
  };

  return <div className="om-invite" dir={dir} style={{ '--om-wine': invitation.theme.primary, '--om-gold': invitation.theme.secondary, '--om-ivory': invitation.theme.background, '--om-ink': invitation.theme.text } as React.CSSProperties}>
    {!entered && <section className={`om-opening ${opened ? 'is-opening' : ''}`}>
      <div className="om-opening-satin"/><div className="om-opening-glow"/>
      <img className="om-envelope om-envelope-closed" src={`${A}/envelope-closed.png`} alt=""/>
      <img className="om-envelope om-envelope-open" src={`${A}/envelope-open.png`} alt=""/>
      <div className="om-opening-copy">
        {content.monogramImage ? <img className="om-custom-monogram" src={content.monogramImage} alt=""/> : <span className="om-monogram">{initials}</span>}
        <p>{t.welcome}</p><h1>{invitation.brideName}<i>&amp;</i>{invitation.groomName}</h1><time>{date}</time>
        <button onClick={enter}>{t.open}<span>↗</span></button>
      </div>
    </section>}

    {entered && <main className="om-content">
      {invitation.sections.music && invitation.musicUrl && <button className="om-music" onClick={toggleMusic} aria-label={t.music}>{playing ? <Pause/> : <Play/>}<span>{t.music}</span></button>}

      {invitation.sections.welcome !== false && <section className="om-hero om-dark">
        <img className="om-satin-piece" src={`${A}/burgundy-satin.png`} alt=""/><img className="om-hero-flower" src={`${A}/ivory-flowers.png`} alt=""/>
        <div className="om-hero-inner"><p>{t.welcome}</p><h1>{invitation.brideName}<i>&amp;</i>{invitation.groomName}</h1><time>{date}</time><div className="om-divider"/><p className="om-message">{invitation.invitationText}</p></div>
        {content.heroImage && <div className="om-hero-photo"><img src={`${A}/gold-frame.png`} alt=""/><img src={content.heroImage} alt=""/></div>}
      </section>}

      {invitation.sections.details !== false && <section className="om-paper om-details"><div className="om-paper-card"><span className="om-kicker">{t.details}</span><h2>{date}</h2><div className="om-detail-grid"><article><CalendarDays/><h3>{content.ceremonyTitle || t.ceremony}</h3><time>{invitation.ceremonyTime}</time><p>{content.ceremonyDescription}</p></article><article><Volume2/><h3>{content.receptionTitle || t.reception}</h3><time>{content.receptionTime}</time><p>{content.receptionDescription}</p></article></div></div></section>}

      {invitation.sections.timeline !== false && content.timeline.length > 0 && <section className="om-dark om-timeline"><span className="om-kicker">{t.timeline}</span><h2>{t.timeline}</h2><div className="om-timeline-list">{content.timeline.map((item, index) => <article key={item.id}><span>{String(index + 1).padStart(2,'0')}</span><div><time>{item.time}</time><h3>{item.title}</h3>{item.description && <p>{item.description}</p>}</div></article>)}</div></section>}

      {invitation.sections.loveStory !== false && content.loveStory.length > 0 && <section className="om-paper om-story"><span className="om-kicker">{content.loveStoryTitle || t.story}</span><h2>{content.loveStoryTitle || t.story}</h2><div className="om-story-list">{content.loveStory.map((item, index) => <article key={item.id} className={index % 2 ? 'reverse' : ''}><div className="om-polaroid"><img className="om-polaroid-frame" src={`${A}/polaroid-frame.png`} alt=""/>{item.image ? <img className="om-polaroid-photo" src={item.image} alt=""/> : <div className="om-photo-placeholder">{initials}</div>}</div><div><time>{item.date}</time><h3>{item.title}</h3><p>{item.description}</p></div></article>)}</div></section>}

      {invitation.sections.dressCode && <section className="om-dark om-dress"><img src={`${A}/ivory-flowers.png`} alt=""/><div><span className="om-kicker">{content.dressCodeTitle || t.dress}</span><h2>{content.dressCodeTitle || t.dress}</h2><p>{content.dressCodeDescription || invitation.dressCode}</p><div className="om-palette">{content.dressCodeColors.map((color) => <i key={color} style={{background:color}} title={color}/>)}</div></div></section>}

      {invitation.sections.whereToStay !== false && content.stayEnabled && <section className="om-paper om-stay"><div className="om-paper-card"><Hotel/><span className="om-kicker">{t.stay}</span><h2>{content.hotelName}</h2><p>{content.hotelDescription}</p><address>{content.hotelAddress}</address>{content.hotelUrl && <a href={content.hotelUrl} target="_blank" rel="noreferrer">{lang === 'ar' ? 'عرض الفندق' : 'View Hotel'} ↗</a>}</div></section>}

      {invitation.sections.venue && <section className="om-venue"><div className="om-venue-art">{invitation.venueImage ? <img src={invitation.venueImage} alt={invitation.venueName}/> : <img src={`${A}/gold-frame.png`} alt=""/>}</div><div><MapPin/><span className="om-kicker">{t.venue}</span><h2>{invitation.venueName}</h2><p>{invitation.address}</p>{invitation.mapsUrl && <a href={invitation.mapsUrl} target="_blank" rel="noreferrer">{t.directions} ↗</a>}</div></section>}

      {invitation.sections.rsvp && <section className="om-rsvp om-dark"><img className="om-rsvp-flower" src={`${A}/ivory-flowers.png`} alt=""/><div className="om-rsvp-card"><span className="om-kicker">RSVP</span><h2>{t.rsvp}</h2>{sent ? <p className="om-sent">{t.sent}</p> : <form onSubmit={submitRsvp}><label>{t.guest}<input name="guestName" required/></label><div className="om-attending"><label><input type="radio" name="attending" value="yes" required/><span>{t.yes}</span></label><label><input type="radio" name="attending" value="no" required/><span>{t.no}</span></label></div><label>{t.count}<input name="guests" type="number" min="1" max="10" defaultValue="1"/></label><label>{t.message}<textarea name="message" rows={3}/></label><button>{t.send}</button></form>}</div></section>}

      {invitation.sections.externalLinks !== false && content.externalLinks.length > 0 && <section className="om-links"><span className="om-kicker">{t.links}</span><h2>{t.links}</h2>{content.externalLinks.map(link => <a key={link.id} href={link.url} target="_blank" rel="noreferrer"><ExternalLink/>{link.label}<span>↗</span></a>)}</section>}
      <footer><span className="om-monogram small">{initials}</span><p>{invitation.brideName} &amp; {invitation.groomName}</p></footer>
    </main>}
  </div>;
}
