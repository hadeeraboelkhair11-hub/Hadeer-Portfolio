import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { Camera, Check, Heart, MapPin, Music2, Navigation, Share2, VolumeX, X } from 'lucide-react';
import type { Invitation } from '../wedding/types';
import { addRsvp, royalBurgundySeed } from '../wedding/store';

type TimeLeft = { days: number; hours: number; minutes: number; seconds: number };

const calculateTimeLeft = (weddingDate: number): TimeLeft => {
  const distance = Math.max(0, weddingDate - Date.now());
  return {
    days: Math.floor(distance / 86_400_000),
    hours: Math.floor((distance / 3_600_000) % 24),
    minutes: Math.floor((distance / 60_000) % 60),
    seconds: Math.floor((distance / 1_000) % 60),
  };
};

export default function WeddingInviteDemo({ invitation = royalBurgundySeed }: { invitation?: Invitation }) {
  const weddingDate = new Date(`${invitation.weddingDate}T${invitation.ceremonyTime || '19:00'}:00`).getTime();
  const displayDate = invitation.weddingDate ? new Date(`${invitation.weddingDate}T12:00:00`).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }).toUpperCase() : 'DATE TO BE ANNOUNCED';
  const displayTime = invitation.ceremonyTime ? new Date(`2000-01-01T${invitation.ceremonyTime}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : '';
  const mapEmbed = `https://www.google.com/maps?q=${encodeURIComponent(invitation.address || invitation.venueName)}&output=embed`;
  const [isOpen, setIsOpen] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdownInView, setCountdownInView] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calculateTimeLeft(weddingDate));
  const [rsvpSent, setRsvpSent] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [guestCount, setGuestCount] = useState('1');
  const [rsvpResponse, setRsvpResponse] = useState<'accept' | 'decline' | ''>('');
  const [guestMessage, setGuestMessage] = useState('');
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [selectedGallery, setSelectedGallery] = useState<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const musicGainRef = useRef<GainNode | null>(null);
  const musicTimerRef = useRef<number | null>(null);
  const uploadedAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const interval = window.setInterval(() => setTimeLeft(calculateTimeLeft(weddingDate)), 1000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isUnlocking || isOpen) return;
    const timer = window.setTimeout(() => setIsOpen(true), 1550);
    return () => window.clearTimeout(timer);
  }, [isUnlocking, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const timer = window.setTimeout(() => setShowCountdown(true), 1700);
    return () => window.clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    const section = document.getElementById('wedding-countdown');
    if (!section) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setCountdownInView(true);
      observer.disconnect();
    }, { threshold: 0.32 });

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (selectedGallery === null) return;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedGallery(null);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [selectedGallery]);

  useEffect(() => () => {
    if (musicTimerRef.current !== null) window.clearInterval(musicTimerRef.current);
    void audioContextRef.current?.close();
  }, []);

  const openInvitation = () => {
    if (!isOpen && !isUnlocking) setIsUnlocking(true);
  };

  const goToCountdown = () => {
    document.getElementById('wedding-countdown')?.scrollIntoView({ behavior: 'smooth' });
  };

  const submitRsvp = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addRsvp({ id: crypto.randomUUID(), invitationId: invitation.id, guestName, attending: rsvpResponse === 'accept', guests: rsvpResponse === 'accept' ? Number(guestCount) : 0, message: guestMessage, submittedAt: new Date().toISOString() });
    setRsvpSent(true);
  };

  const shareInvitation = async () => {
    const data = { title: `${invitation.brideName} & ${invitation.groomName}`, text: invitation.invitationText || 'Join us to celebrate our wedding day.', url: window.location.href };
    if (navigator.share) {
      await navigator.share(data).catch(() => undefined);
      return;
    }
    await navigator.clipboard?.writeText(window.location.href);
  };

  const scheduleWeddingMelody = (context: AudioContext, output: GainNode) => {
    const notes = [
      523.25, 659.25, 783.99, 659.25,
      587.33, 698.46, 880, 698.46,
      493.88, 659.25, 783.99, 659.25,
      523.25, 659.25, 783.99, 1046.5,
    ];
    const bass = [130.81, 146.83, 123.47, 130.81];
    const start = context.currentTime + .08;

    notes.forEach((frequency, index) => {
      const noteStart = start + index * .72;
      const oscillator = context.createOscillator();
      const noteGain = context.createGain();
      oscillator.type = index % 4 === 0 ? 'sine' : 'triangle';
      oscillator.frequency.setValueAtTime(frequency, noteStart);
      noteGain.gain.setValueAtTime(0, noteStart);
      noteGain.gain.linearRampToValueAtTime(index % 4 === 0 ? .32 : .21, noteStart + .035);
      noteGain.gain.exponentialRampToValueAtTime(.001, noteStart + 1.05);
      oscillator.connect(noteGain).connect(output);
      oscillator.start(noteStart);
      oscillator.stop(noteStart + 1.1);

      if (index % 4 === 0) {
        const bassOscillator = context.createOscillator();
        const bassGain = context.createGain();
        bassOscillator.type = 'sine';
        bassOscillator.frequency.setValueAtTime(bass[index / 4], noteStart);
        bassGain.gain.setValueAtTime(.1, noteStart);
        bassGain.gain.exponentialRampToValueAtTime(.001, noteStart + 2.5);
        bassOscillator.connect(bassGain).connect(output);
        bassOscillator.start(noteStart);
        bassOscillator.stop(noteStart + 2.55);
      }
    });
  };

  const toggleMusic = async () => {
    if (invitation.musicUrl) {
      if (!uploadedAudioRef.current) { uploadedAudioRef.current = new Audio(invitation.musicUrl); uploadedAudioRef.current.loop = true; }
      if (musicEnabled) uploadedAudioRef.current.pause(); else await uploadedAudioRef.current.play();
      setMusicEnabled(!musicEnabled);
      return;
    }
    if (musicEnabled) {
      if (musicTimerRef.current !== null) window.clearInterval(musicTimerRef.current);
      musicTimerRef.current = null;
      const context = audioContextRef.current;
      const gain = musicGainRef.current;
      if (context && gain) {
        gain.gain.cancelScheduledValues(context.currentTime);
        gain.gain.setValueAtTime(Math.max(gain.gain.value, .0001), context.currentTime);
        gain.gain.exponentialRampToValueAtTime(.0001, context.currentTime + .45);
        window.setTimeout(() => void context.suspend(), 500);
      }
      setMusicEnabled(false);
      return;
    }

    let context = audioContextRef.current;
    let gain = musicGainRef.current;
    if (!context || !gain) {
      context = new AudioContext();
      gain = context.createGain();
      gain.gain.setValueAtTime(.0001, context.currentTime);
      gain.connect(context.destination);
      audioContextRef.current = context;
      musicGainRef.current = gain;
    }
    await context.resume();
    gain.gain.cancelScheduledValues(context.currentTime);
    gain.gain.setValueAtTime(Math.max(gain.gain.value, .0001), context.currentTime);
    gain.gain.exponentialRampToValueAtTime(.085, context.currentTime + .7);
    scheduleWeddingMelody(context, gain);
    musicTimerRef.current = window.setInterval(() => {
      if (audioContextRef.current && musicGainRef.current) {
        scheduleWeddingMelody(audioContextRef.current, musicGainRef.current);
      }
    }, 11_520);
    setMusicEnabled(true);
  };

  return (
    <main className="wedding-demo" aria-label="Wedding invitation" style={{'--w-primary': invitation.theme.primary, '--w-secondary': invitation.theme.secondary, '--w-background': invitation.theme.background, '--w-text': invitation.theme.text} as React.CSSProperties}>
      <style>{`
        .wedding-demo {
          min-height: 100vh;
          overflow-x: hidden;
          background: #160306;
        }
        .wedding-demo .opening-names, .wedding-demo .venue-title, .wedding-demo .section-title { color: var(--w-text); }
        .wedding-demo .venue-directions, .wedding-demo .rsvp-submit { background: var(--w-primary); }
        .dress-section { padding: 76px 18px; color: var(--w-text); background: var(--w-background); text-align:center; }
        .dress-card { width:min(100%,620px); margin:auto; padding:34px 22px; border:1px solid var(--w-secondary); background:rgba(255,255,255,.66); }
        .dress-card p { margin:8px 0 0; font:400 24px/1.5 Georgia,serif; }

        .wedding-opening {
          min-height: 100vh;
          min-height: 100dvh;
          display: grid;
          place-items: center;
          overflow: hidden;
          background: #260308;
          position: relative;
        }

        .opening-stage {
          position: relative;
          width: min(100%, 620px);
          height: 100vh;
          height: 100dvh;
          min-height: 620px;
          overflow: hidden;
          isolation: isolate;
        }

        .opening-backdrop {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          z-index: -3;
          transform: scale(1.025);
          transition: transform 2200ms cubic-bezier(.2,.72,.2,1), filter 1800ms ease;
        }

        .opening-stage.is-open .opening-backdrop {
          transform: scale(1);
          filter: brightness(.82) saturate(1.06);
        }

        .opening-vignette {
          position: absolute;
          inset: 0;
          z-index: -2;
          background:
            radial-gradient(circle at 50% 48%, transparent 0 20%, rgba(18, 0, 4, .18) 62%, rgba(10, 0, 2, .62) 100%),
            linear-gradient(180deg, rgba(15,0,3,.12), transparent 20%, transparent 76%, rgba(15,0,3,.48));
          pointer-events: none;
        }

        .opening-reveal-art {
          position: absolute;
          z-index: 1;
          top: 0;
          left: 50%;
          width: min(122%, 720px);
          height: min(72vh, 720px);
          object-fit: contain;
          object-position: center top;
          opacity: 0;
          transform: translate(-50%, -9%) scale(.92);
          filter: drop-shadow(0 18px 28px rgba(0,0,0,.38));
          transition: opacity 950ms ease 240ms, transform 1500ms cubic-bezier(.16,.8,.2,1) 160ms;
          pointer-events: none;
        }

        .opening-stage.is-open .opening-reveal-art {
          opacity: 1;
          transform: translate(-50%, 0) scale(1);
        }

        .lock-cluster {
          position: absolute;
          inset: 0;
          z-index: 4;
          transition: opacity 420ms ease 1180ms, visibility 0s linear 1600ms;
        }

        .opening-stage.is-open .lock-cluster {
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
        }

        .opening-lock {
          position: absolute;
          left: 50%;
          top: 47%;
          width: min(55vw, 288px);
          height: auto;
          transform: translate(-50%, -50%) scale(1);
          filter: drop-shadow(0 20px 26px rgba(0,0,0,.55));
          transition: filter 300ms ease;
          pointer-events: none;
        }

        .opening-stage.is-unlocking .opening-lock {
          animation: lock-release 1550ms cubic-bezier(.2,.72,.2,1) forwards;
        }

        .opening-key-button {
          position: absolute;
          left: 55%;
          top: 50.2%;
          z-index: 5;
          width: min(58vw, 340px);
          padding: 0;
          border: 0;
          background: transparent;
          transform: translateY(-50%) rotate(5deg);
          transform-origin: left center;
          cursor: pointer;
          filter: drop-shadow(0 16px 18px rgba(0,0,0,.48));
          -webkit-tap-highlight-color: transparent;
          will-change: left, transform, opacity;
        }

        .opening-key-button img {
          display: block;
          width: 100%;
          height: auto;
          transform: scaleX(-1);
        }

        .opening-stage.is-unlocking .opening-key-button {
          animation: key-unlock 1550ms cubic-bezier(.2,.72,.2,1) forwards;
          pointer-events: none;
        }

        .opening-hint {
          position: absolute;
          left: 0;
          right: 0;
          bottom: max(7%, 42px);
          z-index: 6;
          margin: 0;
          color: #f2d8a0;
          font-family: Cairo, sans-serif;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: .04em;
          text-align: center;
          text-shadow: 0 2px 7px rgba(0,0,0,.9);
          transition: opacity 300ms ease, transform 300ms ease;
          pointer-events: none;
        }

        .opening-stage.is-unlocking .opening-hint,
        .opening-stage.is-open .opening-hint {
          opacity: 0;
          transform: translateY(8px);
        }

        .opening-content {
          position: absolute;
          left: 50%;
          top: 51%;
          z-index: 3;
          width: min(78%, 430px);
          transform: translate(-50%, -40%) scale(.96);
          color: #f2dcae;
          text-align: center;
          opacity: 0;
          pointer-events: none;
          transition: opacity 900ms ease 560ms, transform 1200ms cubic-bezier(.16,.8,.2,1) 450ms;
        }

        .opening-stage.is-open .opening-content {
          opacity: 1;
          transform: translate(-50%, -50%) scale(1);
        }

        .opening-monogram {
          width: min(52vw, 235px);
          height: auto;
          margin: 0 auto -12px;
          filter: drop-shadow(0 10px 22px rgba(0,0,0,.35));
        }

        .opening-together {
          margin: 4px 0 12px;
          color: #d5aa62;
          font: 600 10px/1.5 Cairo, sans-serif;
          letter-spacing: .23em;
        }

        .opening-names {
          margin: 0;
          color: #f5dfb5;
          font: 400 clamp(35px, 9vw, 54px)/1.05 Georgia, serif;
          letter-spacing: .035em;
          text-shadow: 0 3px 18px rgba(0,0,0,.55);
        }

        .opening-names span {
          display: block;
          margin: 4px 0;
          color: #c99c51;
          font-size: .62em;
          font-style: italic;
        }

        .opening-date {
          margin: 21px 0 0;
          color: #e5c78f;
          font: 500 11px/1.5 Cairo, sans-serif;
          letter-spacing: .2em;
        }

        .countdown-cue {
          position: absolute;
          left: 50%;
          bottom: max(2.3%, 12px);
          z-index: 8;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          border: 0;
          padding: 7px 18px;
          background: rgba(40, 2, 9, .22);
          border-radius: 999px;
          color: #e8c98d;
          font-family: Cairo, sans-serif;
          font-size: 10px;
          letter-spacing: .18em;
          transform: translate(-50%, 14px);
          opacity: 0;
          pointer-events: none;
          cursor: pointer;
          transition: opacity 600ms ease, transform 600ms ease;
        }

        .countdown-cue.visible {
          opacity: .92;
          transform: translate(-50%, 0);
          pointer-events: auto;
        }

        .countdown-cue span:last-child {
          font-family: Georgia, serif;
          font-size: 23px;
          line-height: 16px;
          animation: cue-bob 1.6s ease-in-out infinite;
        }

        .countdown-section {
          min-height: 100vh;
          min-height: 100dvh;
          display: grid;
          place-items: center;
          position: relative;
          overflow: hidden;
          padding: 104px 20px 92px;
          color: #641222;
          background:
            radial-gradient(circle at 50% 15%, rgba(255,255,255,.88), transparent 35%),
            radial-gradient(circle at 12% 84%, rgba(161, 17, 45, .07), transparent 28%),
            #fff7e9 url('/wedding-assets/invitation-paper.webp') center top / 720px auto repeat-y;
          border-top: 1px solid rgba(174, 119, 48, .28);
          box-sizing: border-box;
        }

        .countdown-section::before {
          content: '';
          position: absolute;
          top: -54px;
          left: -78px;
          width: min(63vw, 420px);
          aspect-ratio: 1;
          background: url('/wedding-assets/floral-corner-top.webp') left top / contain no-repeat;
          opacity: .82;
          filter: drop-shadow(0 16px 24px rgba(82, 13, 27, .16));
          pointer-events: none;
        }

        .countdown-section::after {
          content: '';
          position: absolute;
          right: -82px;
          bottom: -82px;
          width: min(65vw, 430px);
          aspect-ratio: 1;
          background: url('/wedding-assets/floral-corner-bottom.webp') right bottom / contain no-repeat;
          opacity: .78;
          filter: drop-shadow(0 16px 24px rgba(82, 13, 27, .16));
          pointer-events: none;
        }

        .countdown-panel {
          position: relative;
          z-index: 1;
          width: min(100%, 740px);
          padding: 48px 32px 38px;
          border: 1px solid rgba(169, 112, 43, .48);
          border-radius: 2px;
          outline: 1px solid rgba(169, 112, 43, .16);
          outline-offset: -10px;
          background:
            radial-gradient(circle at 50% 15%, rgba(255,255,255,.64), transparent 48%),
            rgba(255, 252, 245, .9);
          box-shadow: 0 26px 65px rgba(91, 30, 37, .13), 0 0 36px rgba(218, 168, 83, .12), inset 0 0 42px rgba(174, 119, 48, .04);
          text-align: center;
          box-sizing: border-box;
          opacity: 0;
          transform: translateY(34px) scale(.975);
          will-change: transform, opacity;
        }

        .countdown-section.is-visible .countdown-panel {
          animation: countdown-arrive 950ms cubic-bezier(.16,.8,.2,1) forwards;
        }

        .countdown-panel::before,
        .countdown-panel::after {
          content: '◆';
          position: absolute;
          top: 17px;
          color: #b37b35;
          font-size: 10px;
          text-shadow: 0 0 10px rgba(174, 119, 48, .2);
        }

        .countdown-panel::before { left: 20px; }
        .countdown-panel::after { right: 20px; }

        .countdown-kicker {
          margin: 0 0 10px;
          color: #a36d2c;
          font: 600 11px/1.5 Cairo, sans-serif;
          letter-spacing: .28em;
        }

        .countdown-title {
          margin: 0;
          color: #681326;
          font: 400 clamp(31px, 6vw, 45px)/1.18 Georgia, serif;
        }

        .countdown-divider {
          position: relative;
          width: min(72%, 260px);
          height: 1px;
          margin: 22px auto 27px;
          background: linear-gradient(90deg, transparent, #b67d35, transparent);
        }

        .countdown-divider::after {
          content: '✦';
          position: absolute;
          left: 50%;
          top: 50%;
          padding: 0 9px;
          color: #b47a32;
          background: #fff8ec;
          font-size: 12px;
          transform: translate(-50%, -50%);
        }

        .countdown-grid {
          position: relative;
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          align-items: stretch;
          gap: 0;
          width: 100%;
          aspect-ratio: 1774 / 887;
          padding: 0;
          background: url('/wedding-assets/countdown-frames.webp') center / 100% 100% no-repeat;
          box-sizing: border-box;
          direction: ltr;
        }

        .countdown-unit {
          position: relative;
          display: flex;
          min-height: 0;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-width: 0;
          padding: 3% 2px 0;
          border: 0;
          background: transparent;
          opacity: 0;
          transform: translateY(14px);
        }

        .countdown-section.is-visible .countdown-unit {
          animation: countdown-unit-arrive 650ms cubic-bezier(.2,.75,.2,1) forwards;
        }

        .countdown-section.is-visible .countdown-unit:nth-child(1) { animation-delay: 390ms; }
        .countdown-section.is-visible .countdown-unit:nth-child(2) { animation-delay: 500ms; }
        .countdown-section.is-visible .countdown-unit:nth-child(3) { animation-delay: 610ms; }
        .countdown-section.is-visible .countdown-unit:nth-child(4) { animation-delay: 720ms; }

        .countdown-section.is-visible .countdown-number {
          animation: countdown-tick 420ms cubic-bezier(.2,.8,.2,1);
        }

        .countdown-number {
          display: block;
          color: #6b1426;
          font: 400 clamp(28px, 6vw, 48px)/1 Georgia, serif;
          font-variant-numeric: tabular-nums;
          text-shadow: 0 2px 10px rgba(108, 20, 38, .12);
        }

        .countdown-label {
          display: block;
          margin-top: 8px;
          color: #9a682d;
          font: 600 clamp(8px, 2vw, 10px)/1.2 Cairo, sans-serif;
          letter-spacing: .12em;
        }

        .countdown-date {
          margin: 26px 0 0;
          color: #7c5c58;
          font: 500 12px/1.5 Cairo, sans-serif;
          letter-spacing: .22em;
        }

        .venue-section {
          min-height: 100vh;
          display: grid;
          place-items: center;
          position: relative;
          overflow: hidden;
          padding: 100px 18px 108px;
          color: #5c1421;
          background:
            radial-gradient(circle at 50% 16%, rgba(255,255,255,.88), transparent 33%),
            #fff7e9 url('/wedding-assets/invitation-paper.webp') center top / 720px auto repeat-y;
          box-sizing: border-box;
        }

        .venue-section::before,
        .venue-section::after {
          content: '';
          position: absolute;
          z-index: 0;
          width: min(43vw, 340px);
          aspect-ratio: 1;
          pointer-events: none;
          opacity: .58;
          filter: drop-shadow(0 18px 26px rgba(87, 11, 28, .14));
        }

        .venue-section::before {
          top: -68px;
          right: -82px;
          background: url('/wedding-assets/floral-corner-top.webp') center / contain no-repeat;
          transform: scaleX(-1);
        }

        .venue-section::after {
          left: -86px;
          bottom: -86px;
          background: url('/wedding-assets/floral-corner-bottom.webp') center / contain no-repeat;
          transform: scaleX(-1);
        }

        .venue-shell {
          position: relative;
          z-index: 1;
          width: min(100%, 790px);
          text-align: center;
        }

        .venue-pin {
          width: 58px;
          height: 58px;
          display: grid;
          place-items: center;
          margin: 0 auto 18px;
          border: 1px solid rgba(178, 126, 54, .72);
          border-radius: 50%;
          color: #a86e25;
          background: rgba(255, 252, 246, .92);
          box-shadow: 0 10px 28px rgba(91, 30, 37, .1), inset 0 0 0 5px rgba(178, 126, 54, .08);
        }

        .venue-kicker {
          margin: 0 0 9px;
          color: #ad7b36;
          font: 600 11px/1.5 Cairo, sans-serif;
          letter-spacing: .2em;
        }

        .venue-title {
          margin: 0;
          color: #6c1022;
          font: 400 clamp(30px, 7vw, 48px)/1.25 Georgia, serif;
          letter-spacing: .05em;
        }

        .venue-place {
          margin: 10px 0 18px;
          color: #8c6b62;
          font: 500 13px/1.5 Cairo, sans-serif;
          letter-spacing: .15em;
        }

        .venue-divider {
          display: block;
          width: min(54%, 250px);
          height: 42px;
          margin: 0 auto 22px;
          object-fit: contain;
        }

        .venue-card {
          position: relative;
          padding: 9px;
          overflow: hidden;
          border: 1px solid rgba(175, 119, 43, .75);
          background: linear-gradient(145deg, #8d2035, #4d0714 58%, #6a1022);
          box-shadow: 0 30px 70px rgba(84, 15, 29, .22), 0 0 0 8px rgba(179, 123, 48, .06);
        }

        .venue-map-frame {
          position: relative;
          width: 100%;
          height: 390px;
          overflow: hidden;
          background: #eadcc8;
        }

        .venue-map-frame::after {
          content: '';
          position: absolute;
          inset: 0;
          border: 1px solid rgba(255, 238, 196, .62);
          box-shadow: inset 0 0 38px rgba(66, 8, 19, .18);
          pointer-events: none;
        }

        .venue-map {
          display: block;
          width: 100%;
          height: 100%;
          border: 0;
          filter: sepia(.2) saturate(.82) contrast(.96);
        }

        .venue-information {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 24px;
          padding: 24px 25px 22px;
          color: #f3ddb0;
          text-align: center;
        }

        .venue-fact span {
          display: block;
          margin-bottom: 5px;
          color: #cc9b4f;
          font: 600 10px/1.4 Cairo, sans-serif;
          letter-spacing: .18em;
        }

        .venue-fact strong {
          color: #f6e4bc;
          font: 400 16px/1.35 Georgia, serif;
          letter-spacing: .06em;
        }

        .venue-information-divider {
          width: 1px;
          height: 38px;
          background: linear-gradient(transparent, rgba(222, 181, 106, .7), transparent);
        }

        .venue-directions {
          min-height: 54px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          margin-top: 18px;
          padding: 0 28px;
          border: 1px solid #8b2d40;
          border-radius: 2px;
          color: #f5dfb6;
          background: linear-gradient(135deg, #76152a, #530914);
          font: 600 11px/1 Cairo, sans-serif;
          letter-spacing: .11em;
          text-decoration: none;
          box-shadow: 0 8px 18px rgba(77, 5, 18, .2);
          transition: transform 180ms ease, box-shadow 180ms ease;
        }

        .venue-directions:hover {
          transform: translateY(-2px);
          box-shadow: 0 11px 24px rgba(77, 5, 18, .27);
        }

        @media (max-width: 620px) {
          .venue-section { padding: 82px 11px 90px; }
          .venue-section::before, .venue-section::after { width: 260px; opacity: .42; }
          .venue-title { font-size: clamp(29px, 9vw, 40px); }
          .venue-map-frame { height: 330px; }
          .venue-information { gap: 12px; padding: 20px 8px 18px; }
          .venue-fact strong { font-size: 13px; letter-spacing: .025em; }
          .venue-fact span { font-size: 9px; }
        }

        .gallery-section {
          position: relative;
          overflow: hidden;
          padding: 102px 18px 110px;
          color: #f2dcae;
          background:
            radial-gradient(circle at 50% 0%, rgba(149, 24, 49, .48), transparent 36%),
            radial-gradient(circle at 10% 76%, rgba(116, 15, 37, .48), transparent 30%),
            #25030a;
          text-align: center;
        }

        .gallery-section::before {
          content: '';
          position: absolute;
          inset: 0;
          opacity: .13;
          background: url('/wedding-assets/opening-bg.webp') center / cover no-repeat;
          filter: blur(1px) saturate(.8);
          pointer-events: none;
        }

        .gallery-shell, .rsvp-shell {
          position: relative;
          z-index: 1;
          width: min(100%, 760px);
          margin: 0 auto;
        }

        .section-icon {
          margin: 0 auto 14px;
          color: #c99a50;
        }

        .section-kicker {
          margin: 0 0 10px;
          color: #c99a50;
          font: 600 11px/1.5 Cairo, sans-serif;
          letter-spacing: .2em;
        }

        .section-title {
          margin: 0;
          font: 400 clamp(30px, 7vw, 47px)/1.25 Georgia, serif;
        }

        .gallery-copy {
          max-width: 470px;
          margin: 14px auto 38px;
          color: rgba(241, 220, 180, .68);
          font: 400 16px/1.75 Georgia, serif;
        }

        .gallery-arches {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          align-items: center;
          gap: 15px;
          width: 100%;
        }

        .gallery-arch-button {
          position: relative;
          display: block;
          width: 100%;
          aspect-ratio: 2 / 3.05;
          padding: 0;
          overflow: hidden;
          border: 1px solid rgba(224, 185, 111, .8);
          border-radius: 50% 50% 3px 3px / 23% 23% 3px 3px;
          background: #4b0916;
          box-shadow: 0 24px 42px rgba(0,0,0,.42), 0 0 0 5px rgba(205, 156, 76, .07);
          cursor: pointer;
          transition: transform 300ms ease, filter 300ms ease;
        }

        .gallery-arch-button:nth-child(2) { transform: translateY(-18px); }
        .gallery-arch-button:hover { transform: translateY(-8px) scale(1.018); filter: brightness(1.06); }
        .gallery-arch-button:nth-child(2):hover { transform: translateY(-25px) scale(1.018); }

        .gallery-arch-button::after {
          content: '';
          position: absolute;
          inset: 6px;
          border: 1px solid rgba(250, 221, 157, .45);
          border-radius: inherit;
          box-shadow: inset 0 0 32px rgba(28, 0, 7, .34);
          pointer-events: none;
        }

        .gallery-sprite {
          display: block;
          width: 300%;
          max-width: none;
          height: 100%;
          object-fit: cover;
        }

        .gallery-sprite-0 { transform: translateX(0); }
        .gallery-sprite-1 { transform: translateX(-33.3333%); }
        .gallery-sprite-2 { transform: translateX(-66.6666%); }

        .gallery-caption {
          display: block;
          margin-top: 28px;
          color: rgba(226, 185, 111, .78);
          font: 600 10px/1.4 Cairo, sans-serif;
          letter-spacing: .2em;
        }

        .gallery-lightbox {
          position: fixed;
          inset: 0;
          z-index: 50;
          display: grid;
          place-items: center;
          padding: 22px;
          border: 0;
          background: rgba(17, 0, 4, .9);
          backdrop-filter: blur(12px);
        }

        .gallery-lightbox-card {
          position: relative;
          width: min(88vw, 430px);
          aspect-ratio: 2 / 3.05;
          overflow: hidden;
          border: 1px solid rgba(229, 189, 112, .9);
          border-radius: 50% 50% 4px 4px / 23% 23% 4px 4px;
          background: #4b0916;
          box-shadow: 0 34px 80px rgba(0,0,0,.62), 0 0 0 8px rgba(205, 156, 76, .08);
          animation: gallery-open 420ms cubic-bezier(.16,.8,.2,1) both;
        }

        .gallery-lightbox-close {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 51;
          width: 44px;
          height: 44px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(230, 193, 122, .55);
          border-radius: 50%;
          color: #f3dcae;
          background: rgba(79, 7, 20, .86);
          cursor: pointer;
        }

        @keyframes gallery-open {
          from { opacity: 0; transform: translateY(20px) scale(.94); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        @media (max-width: 620px) {
          .gallery-section { padding: 84px 0 92px; }
          .gallery-section .section-icon,
          .gallery-section .section-kicker,
          .gallery-section .section-title,
          .gallery-copy { margin-left: 18px; margin-right: 18px; }
          .gallery-arches {
            grid-template-columns: repeat(3, 72vw);
            align-items: center;
            gap: 14px;
            padding: 22px 14vw 28px;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            scrollbar-width: none;
            box-sizing: border-box;
          }
          .gallery-arches::-webkit-scrollbar { display: none; }
          .gallery-arch-button,
          .gallery-arch-button:nth-child(2) { transform: none; scroll-snap-align: center; }
          .gallery-arch-button:hover,
          .gallery-arch-button:nth-child(2):hover { transform: scale(1.012); }
          .gallery-caption { margin-top: 2px; }
        }

        .rsvp-section {
          position: relative;
          overflow: hidden;
          padding: 104px 18px 112px;
          color: #641222;
          background:
            radial-gradient(circle at 50% 12%, rgba(255,255,255,.88), transparent 34%),
            #fff7e9 url('/wedding-assets/invitation-paper.webp') center top / 720px auto repeat-y;
          text-align: center;
        }

        .rsvp-section::before,
        .rsvp-section::after {
          content: '';
          position: absolute;
          width: min(45vw, 360px);
          aspect-ratio: 1;
          opacity: .48;
          pointer-events: none;
          filter: drop-shadow(0 15px 24px rgba(91, 18, 34, .13));
        }

        .rsvp-section::before {
          top: -96px;
          left: -105px;
          background: url('/wedding-assets/floral-corner-top.webp') center / contain no-repeat;
        }

        .rsvp-section::after {
          right: -102px;
          bottom: -105px;
          background: url('/wedding-assets/floral-corner-bottom.webp') center / contain no-repeat;
        }

        .rsvp-section .section-icon, .rsvp-section .section-kicker { color: #aa742c; }

        .rsvp-copy {
          max-width: 500px;
          margin: 14px auto 32px;
          color: #7d6266;
          font: 400 16px/1.75 Georgia, serif;
        }

        .rsvp-card {
          position: relative;
          width: min(100%, 560px);
          margin: 0 auto;
          padding: 38px 34px 36px;
          border: 1px solid #b78037;
          outline: 1px solid rgba(183, 128, 55, .42);
          outline-offset: -9px;
          background: rgba(255, 253, 247, .94);
          box-shadow: 0 26px 62px rgba(84, 15, 29, .15);
          box-sizing: border-box;
        }

        .rsvp-card > * { position: relative; z-index: 1; }

        .rsvp-form {
          display: grid;
          gap: 18px;
          text-align: left;
        }

        .rsvp-field {
          display: grid;
          gap: 8px;
        }

        .rsvp-field > span,
        .rsvp-choice-label {
          color: #9b6c34;
          font: 600 11px/1.4 Cairo, sans-serif;
          letter-spacing: .12em;
        }

        .rsvp-form input, .rsvp-form select {
          width: 100%;
          min-height: 52px;
          padding: 11px 15px;
          border: 1px solid #d6bb91;
          border-radius: 2px;
          outline: none;
          color: #57101d;
          background: rgba(255,255,255,.78);
          font: 400 15px Cairo, sans-serif;
          box-sizing: border-box;
        }

        .rsvp-form input:focus, .rsvp-form select:focus { border-color: #8d3041; box-shadow: 0 0 0 3px rgba(109, 15, 33, .08); }

        .rsvp-choices {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .rsvp-choice {
          position: relative;
          min-height: 72px;
          display: grid;
          place-items: center;
          padding: 10px;
          border: 1px solid #d6bb91;
          color: #6f3740;
          background: rgba(255,255,255,.66);
          font: 500 14px/1.35 Georgia, serif;
          text-align: center;
          cursor: pointer;
          transition: color 180ms ease, background 180ms ease, border-color 180ms ease, transform 180ms ease;
        }

        .rsvp-choice input {
          position: absolute;
          width: 1px;
          min-height: 1px;
          opacity: 0;
        }

        .rsvp-choice.selected {
          border-color: #7a1b2e;
          color: #f7e5bc;
          background: linear-gradient(145deg, #7b172c, #510813);
          box-shadow: 0 9px 22px rgba(79, 8, 20, .2);
          transform: translateY(-2px);
        }

        .rsvp-submit {
          min-height: 54px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          margin-top: 2px;
          border: 1px solid #8c3141;
          border-radius: 2px;
          color: #f5dfb6;
          background: linear-gradient(135deg, #76152a, #520914);
          font: 600 11px Cairo, sans-serif;
          letter-spacing: .12em;
          cursor: pointer;
        }

        .rsvp-success { padding: 38px 5px 34px; }
        .rsvp-success-badge { width: 68px; height: 68px; display: grid; place-items: center; margin: 0 auto 20px; border: 1px solid #b9853d; border-radius: 50%; color: #f5dfb6; background: #6a1022; box-shadow: 0 10px 25px rgba(89, 11, 28, .2); }
        .rsvp-success h3 { margin: 0 0 10px; font: 400 32px/1.3 Georgia, serif; }
        .rsvp-success p { max-width: 350px; margin: 0 auto; color: #7d6266; font: 400 15px/1.7 Georgia, serif; }

        .finale-section {
          position: relative;
          min-height: 100vh;
          min-height: 100dvh;
          display: grid;
          place-items: center;
          overflow: hidden;
          padding: 96px 18px;
          color: #f1d9aa;
          background:
            radial-gradient(circle at 50% 22%, rgba(132, 25, 47, .84), transparent 46%),
            linear-gradient(rgba(28, 1, 7, .76), rgba(20, 0, 5, .92)),
            url('/wedding-assets/opening-bg.webp') center / cover no-repeat;
          text-align: center;
          box-sizing: border-box;
        }

        .finale-section::before,
        .finale-section::after {
          content: '';
          position: absolute;
          width: min(49vw, 410px);
          aspect-ratio: 1;
          pointer-events: none;
          opacity: .72;
          filter: drop-shadow(0 20px 30px rgba(0,0,0,.35));
        }

        .finale-section::before {
          top: -105px;
          left: -130px;
          background: url('/wedding-assets/floral-corner-top.webp') center / contain no-repeat;
        }

        .finale-section::after {
          right: -128px;
          bottom: -118px;
          background: url('/wedding-assets/floral-corner-bottom.webp') center / contain no-repeat;
        }

        .finale-content {
          position: relative;
          z-index: 1;
          width: min(100%, 590px);
          padding: 55px 34px 48px;
          border: 1px solid rgba(218, 176, 99, .62);
          outline: 1px solid rgba(218, 176, 99, .2);
          outline-offset: -10px;
          background: rgba(48, 3, 13, .65);
          box-shadow: 0 34px 80px rgba(0,0,0,.38), inset 0 0 50px rgba(133, 25, 47, .16);
          backdrop-filter: blur(4px);
          box-sizing: border-box;
        }

        .finale-seal { width: 110px; height: 116px; object-fit: contain; filter: drop-shadow(0 12px 21px rgba(0,0,0,.48)); }
        .finale-copy { margin: 22px 0 13px; color: #d4b474; font-size: 11px; font-weight: 600; letter-spacing: .2em; }
        .finale-title { margin: 0; font: 400 clamp(42px, 10vw, 66px)/1.1 Georgia, serif; text-shadow: 0 4px 22px rgba(0,0,0,.3); }
        .finale-title span { display: block; color: #d0a052; font-size: .62em; font-style: italic; }
        .finale-divider { width: min(62%, 250px); height: 42px; object-fit: contain; filter: brightness(1.15); }
        .finale-date { margin: 9px 0 9px; color: #e0c38b; font-size: 12px; letter-spacing: .22em; }
        .finale-place { margin: 0 0 29px; color: rgba(240, 216, 171, .68); font: 400 14px/1.5 Georgia, serif; letter-spacing: .12em; }
        .finale-actions { display: flex; justify-content: center; gap: 10px; }
        .finale-action {
          min-width: 124px;
          min-height: 48px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border: 1px solid rgba(211, 171, 99, .58);
          border-radius: 2px;
          color: #f1d9aa;
          background: rgba(73, 7, 20, .7);
          font: 600 10px Cairo, sans-serif;
          letter-spacing: .1em;
          cursor: pointer;
          text-decoration: none;
          transition: transform 180ms ease, background 180ms ease;
        }

        .finale-action:hover { transform: translateY(-2px); background: rgba(107, 16, 34, .88); }

        .music-control {
          position: fixed;
          right: 16px;
          bottom: 16px;
          z-index: 20;
          width: 48px;
          height: 48px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(221, 183, 112, .7);
          border-radius: 50%;
          color: #f0d39a;
          background: rgba(64, 5, 17, .9);
          box-shadow: 0 8px 24px rgba(0,0,0,.3);
          backdrop-filter: blur(8px);
          cursor: pointer;
          transition: transform 180ms ease, background 180ms ease;
        }

        .music-control:hover { transform: translateY(-2px); }
        .music-control.on {
          background: linear-gradient(145deg, #8a1e35, #520914);
          animation: music-glow 1.8s ease-in-out infinite;
        }

        .music-bars {
          position: absolute;
          left: -5px;
          bottom: -3px;
          display: flex;
          align-items: end;
          gap: 2px;
          height: 13px;
          padding: 3px 4px;
          border-radius: 9px;
          background: #f1d9aa;
        }

        .music-bars i {
          width: 2px;
          height: 5px;
          display: block;
          background: #6a1022;
          animation: music-bar .7s ease-in-out infinite alternate;
        }

        .music-bars i:nth-child(2) { height: 9px; animation-delay: .18s; }
        .music-bars i:nth-child(3) { height: 7px; animation-delay: .34s; }

        @media (max-width: 520px) {
          .countdown-section { min-height: 100dvh; padding: 78px 10px 64px; background-size: 520px auto; }
          .countdown-section::before { top: -28px; left: -64px; width: 260px; opacity: .58; }
          .countdown-section::after { right: -58px; bottom: -48px; width: 255px; opacity: .52; }
          .countdown-panel { padding: 36px 8px 26px; outline-offset: -7px; }
          .countdown-divider { margin-bottom: 22px; }
          .countdown-unit { padding: 3% 1px 0; }
          .countdown-number { font-size: clamp(25px, 8vw, 34px); }
          .countdown-label { margin-top: 6px; font-size: clamp(7px, 2vw, 9px); letter-spacing: .025em; }
          .countdown-date { margin-top: 24px; font-size: 10px; letter-spacing: .16em; }
          .gallery-section, .rsvp-section { padding: 72px 16px 80px; }
          .rsvp-section::before, .rsvp-section::after { width: 245px; opacity: .34; }
          .rsvp-card { padding: 31px 22px 29px; outline-offset: -7px; }
          .rsvp-choices { grid-template-columns: 1fr; gap: 8px; }
          .rsvp-choice { min-height: 58px; }
          .finale-actions { flex-direction: column; }
          .finale-action { width: min(100%, 250px); margin: 0 auto; }
          .finale-section { padding: 76px 13px; }
          .finale-section::before, .finale-section::after { width: 275px; opacity: .5; }
          .finale-content { padding: 46px 22px 40px; outline-offset: -7px; }
          .finale-seal { width: 92px; height: 98px; }
        }

        @media (max-width: 380px) {
          .opening-stage { min-height: 560px; }
          .countdown-title { font-size: 29px; }
          .countdown-panel { padding-left: 5px; padding-right: 5px; }
          .countdown-number { font-size: 26px; }
          .countdown-label { font-size: 7px; letter-spacing: 0; }
          .venue-map-frame { height: 285px; }
          .venue-information { grid-template-columns: 1fr; gap: 9px; }
          .venue-information-divider { width: 56px; height: 1px; margin: 0 auto; }
          .rsvp-card { padding-left: 17px; padding-right: 17px; }
          .finale-title { font-size: 40px; }
        }

        @keyframes music-glow {
          0%, 100% { box-shadow: 0 8px 24px rgba(0,0,0,.3), 0 0 0 0 rgba(211,169,91,.24); }
          50% { box-shadow: 0 8px 24px rgba(0,0,0,.3), 0 0 0 8px rgba(211,169,91,0); }
        }

        @keyframes music-bar {
          from { transform: scaleY(.45); }
          to { transform: scaleY(1); }
        }

        @keyframes countdown-arrive {
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes countdown-unit-arrive {
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes countdown-tick {
          0% { opacity: .35; transform: translateY(-5px) scale(.94); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes key-unlock {
          0% { left: 55%; transform: translateY(-50%) rotate(5deg); opacity: 1; }
          54% { left: 49%; transform: translateY(-50%) rotate(0deg); opacity: 1; }
          73% { left: 49%; transform: translateY(-50%) rotate(0deg); opacity: 1; }
          91% { left: 49%; transform: translateY(-50%) rotate(-23deg); opacity: 1; }
          100% { left: 49%; transform: translateY(-50%) rotate(-23deg); opacity: 0; }
        }

        @keyframes lock-release {
          0%, 68% { transform: translate(-50%, -50%) scale(1); filter: drop-shadow(0 20px 26px rgba(0,0,0,.55)); opacity: 1; }
          80% { transform: translate(-50%, -50%) scale(1.055); filter: drop-shadow(0 0 28px rgba(255,208,116,.78)); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(.88); filter: drop-shadow(0 0 45px rgba(255,208,116,.2)); opacity: 0; }
        }

        @keyframes cue-bob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(5px); }
        }

        @media (prefers-reduced-motion: reduce) {
          .opening-backdrop, .opening-reveal-art, .lock-cluster, .opening-lock,
          .opening-key-button, .opening-hint, .opening-content, .countdown-cue,
          .countdown-panel, .countdown-unit, .countdown-number {
            transition-duration: 1ms !important;
            animation-duration: 1ms !important;
          }
          .countdown-cue span:last-child, .music-bars i { animation: none; }
        }
      `}</style>

      <section className="wedding-opening">
        <div
          className={`opening-stage${isUnlocking ? ' is-unlocking' : ''}${isOpen ? ' is-open' : ''}`}
        >
          <img
            className="opening-backdrop"
            src="/wedding-assets/opening-bg.webp"
            alt=""
            draggable={false}
          />
          <div className="opening-vignette" aria-hidden="true" />

          <img
            className="opening-reveal-art"
            src="/wedding-assets/opening-reveal.webp"
            alt=""
            draggable={false}
          />

          <div className="opening-content" aria-hidden={!isOpen}>
            <img
              className="opening-monogram"
              src="/wedding-assets/opening-monogram.webp"
              alt={`${invitation.brideName} and ${invitation.groomName}`}
              draggable={false}
            />
            <p className="opening-together">TOGETHER WITH THEIR FAMILIES</p>
            <h1 className="opening-names">{invitation.brideName.toUpperCase()} <span>&amp;</span> {invitation.groomName.toUpperCase()}</h1>
            <p className="opening-date">{displayDate.replace(/ /g, ' · ')}</p>
          </div>

          <div className="lock-cluster">
            <img
              className="opening-lock"
              src="/wedding-assets/opening-lock.webp"
              alt=""
              draggable={false}
            />
            <button
              className="opening-key-button"
              type="button"
              onClick={openInvitation}
              aria-label="استخدمي المفتاح لفتح الدعوة"
              aria-expanded={isOpen}
              disabled={isUnlocking}
            >
              <img src="/wedding-assets/opening-key.webp" alt="" draggable={false} />
            </button>
          </div>

          <p className="opening-hint">اضغطي على المفتاح لفتح الدعوة</p>
        </div>

        <button
          type="button"
          className={`countdown-cue${showCountdown ? ' visible' : ''}`}
          onClick={goToCountdown}
          aria-label="الانتقال إلى العد التنازلي"
        >
          <span>DISCOVER OUR DAY</span>
          <span aria-hidden="true">⌄</span>
        </button>
      </section>

      {invitation.sections.countdown && <section
        id="wedding-countdown"
        className={`countdown-section${countdownInView ? ' is-visible' : ''}`}
        aria-labelledby="countdown-title"
      >
        <div className="countdown-panel">
          <p className="countdown-kicker">COUNTING DOWN</p>
          <h2 id="countdown-title" className="countdown-title">Until our forever begins</h2>
          <div className="countdown-divider" aria-hidden="true" />
          <div className="countdown-grid" aria-live="polite">
            {[
              ['days', timeLeft.days, 'DAYS'],
              ['hours', timeLeft.hours, 'HOURS'],
              ['minutes', timeLeft.minutes, 'MINUTES'],
              ['seconds', timeLeft.seconds, 'SECONDS'],
            ].map(([key, value, label]) => (
              <div className="countdown-unit" key={key}>
                <strong className="countdown-number" key={`${key}-${value}`}>{String(value).padStart(2, '0')}</strong>
                <span className="countdown-label">{label}</span>
              </div>
            ))}
          </div>
          <p className="countdown-date">{displayDate.replace(/ /g, ' · ')}</p>
        </div>
      </section>}

      {invitation.sections.venue && <section className="venue-section" aria-labelledby="venue-title">
        <div className="venue-shell">
          <div className="venue-pin" aria-hidden="true"><MapPin size={23} strokeWidth={1.6} /></div>
          <p className="venue-kicker">THE VENUE</p>
          <h2 id="venue-title" className="venue-title">{invitation.venueName.toUpperCase()}</h2>
          <p className="venue-place">{invitation.address.toUpperCase()}</p>
          <img className="venue-divider" src="/wedding-assets/gold-divider.png" alt="" draggable={false} />

          <div className="venue-card">
            <div className="venue-map-frame">
              <iframe
                className="venue-map"
                title={`${invitation.venueName} map`}
                src={mapEmbed}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="venue-information">
              <div className="venue-fact">
                <span>THE DATE</span>
                <strong>{displayDate}</strong>
              </div>
              <span className="venue-information-divider" aria-hidden="true" />
              <div className="venue-fact">
                <span>THE TIME</span>
                <strong>{displayTime}</strong>
              </div>
            </div>
          </div>

          <a
            className="venue-directions"
            href={invitation.mapsUrl}
            target="_blank"
            rel="noreferrer"
          >
            <Navigation size={17} strokeWidth={1.7} />
            OPEN IN GOOGLE MAPS
          </a>
        </div>
      </section>}

      {invitation.sections.gallery && <section className="gallery-section" aria-labelledby="gallery-title">
        <div className="gallery-shell">
          <Camera className="section-icon" size={25} strokeWidth={1.5} />
          <p className="section-kicker">OUR DAY</p>
          <h2 id="gallery-title" className="section-title">A glimpse of our celebration</h2>
          <p className="gallery-copy">Warm candlelight, burgundy blooms and a night made for beautiful memories.</p>
          <div className="gallery-arches" aria-label="Wedding gallery">
            {[
              'The celebration venue',
              'Burgundy wedding flowers',
              'The candlelit reception',
            ].map((label, index) => (
              <button
                className="gallery-arch-button"
                type="button"
                key={label}
                onClick={() => setSelectedGallery(index)}
                aria-label={`View ${label.toLowerCase()}`}
              >
                <img
                  className={invitation.galleryImages[index] ? '' : `gallery-sprite gallery-sprite-${index}`}
                  src={invitation.galleryImages[index] || '/wedding-assets/arch-gallery.png'}
                  alt={label}
                  draggable={false}
                />
              </button>
            ))}
          </div>
          <span className="gallery-caption">TAP A MOMENT TO VIEW</span>
        </div>
      </section>}

      {selectedGallery !== null && (
        <div
          className="gallery-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Wedding gallery preview"
          onClick={() => setSelectedGallery(null)}
        >
          <button
            className="gallery-lightbox-close"
            type="button"
            onClick={() => setSelectedGallery(null)}
            aria-label="Close gallery preview"
          >
            <X size={21} />
          </button>
          <div className="gallery-lightbox-card" onClick={(event) => event.stopPropagation()}>
            <img
              className={invitation.galleryImages[selectedGallery] ? '' : `gallery-sprite gallery-sprite-${selectedGallery}`}
              src={invitation.galleryImages[selectedGallery] || '/wedding-assets/arch-gallery.png'}
              alt="Selected wedding moment"
              draggable={false}
            />
          </div>
        </div>
      )}

      {invitation.sections.dressCode && invitation.dressCode && <section className="dress-section" aria-label="Dress code"><div className="dress-card"><span className="section-kicker">DRESS CODE</span><p>{invitation.dressCode}</p></div></section>}

      {invitation.sections.rsvp && <section className="rsvp-section" aria-labelledby="rsvp-title">
        <div className="rsvp-shell">
          <Heart className="section-icon" size={27} strokeWidth={1.5} />
          <p className="section-kicker">KINDLY REPLY</p>
          <h2 id="rsvp-title" className="section-title">Will you celebrate with us?</h2>
          <p className="rsvp-copy">Please send your response before {invitation.rsvpDeadline || 'the celebration'}. We would be delighted to share our day with you.</p>

          <div className="rsvp-card">
            {rsvpSent ? (
              <div className="rsvp-success">
                <div className="rsvp-success-badge"><Check size={28} /></div>
                <h3>Thank you, {guestName}</h3>
                <p>
                  {rsvpResponse === 'accept'
                    ? `We have reserved ${guestCount} ${guestCount === '1' ? 'place' : 'places'} for you. We cannot wait to celebrate together.`
                    : 'Your response has been received. You will be in our thoughts on our special day.'}
                </p>
              </div>
            ) : (
              <form className="rsvp-form" onSubmit={submitRsvp}>
                <label className="rsvp-field">
                  <span>YOUR NAME</span>
                  <input value={guestName} onChange={(event) => setGuestName(event.target.value)} placeholder="Full name" required />
                </label>
                <div className="rsvp-field">
                  <span className="rsvp-choice-label">WILL YOU JOIN US?</span>
                  <div className="rsvp-choices">
                    <label className={`rsvp-choice${rsvpResponse === 'accept' ? ' selected' : ''}`}>
                      <input
                        type="radio"
                        name="response"
                        value="accept"
                        checked={rsvpResponse === 'accept'}
                        onChange={() => setRsvpResponse('accept')}
                        required
                      />
                      Joyfully accepts
                    </label>
                    <label className={`rsvp-choice${rsvpResponse === 'decline' ? ' selected' : ''}`}>
                      <input
                        type="radio"
                        name="response"
                        value="decline"
                        checked={rsvpResponse === 'decline'}
                        onChange={() => setRsvpResponse('decline')}
                        required
                      />
                      Regretfully declines
                    </label>
                  </div>
                </div>
                {rsvpResponse === 'accept' && (
                  <label className="rsvp-field">
                    <span>NUMBER OF GUESTS</span>
                    <select value={guestCount} onChange={(event) => setGuestCount(event.target.value)}>
                      <option value="1">1 Guest</option>
                      <option value="2">2 Guests</option>
                      <option value="3">3 Guests</option>
                      <option value="4">4 Guests</option>
                    </select>
                  </label>
                )}
                <label className="rsvp-field"><span>MESSAGE (OPTIONAL)</span><input value={guestMessage} onChange={(event)=>setGuestMessage(event.target.value)} placeholder="A note for the couple" /></label>
                <button className="rsvp-submit" type="submit"><Heart size={17} /> SEND RSVP</button>
              </form>
            )}
          </div>
        </div>
      </section>}

      <footer className="finale-section">
        <div className="finale-content">
          <img className="finale-seal" src="/wedding-assets/seal.webp" alt={`${invitation.brideName} and ${invitation.groomName} monogram`} />
          <p className="finale-copy">WE CANNOT WAIT TO CELEBRATE WITH YOU</p>
          <h2 className="finale-title">{invitation.brideName.toUpperCase()} <span>&</span> {invitation.groomName.toUpperCase()}</h2>
          <img className="finale-divider" src="/wedding-assets/gold-divider.png" alt="" draggable={false} />
          <p className="finale-date">{displayDate.replace(/ /g, ' · ')}</p>
          <p className="finale-place">{invitation.venueName} · {displayTime}</p>
          <div className="finale-actions">
            <a className="finale-action" href={invitation.mapsUrl} target="_blank" rel="noreferrer">
              <MapPin size={16} /> LOCATION
            </a>
            <button className="finale-action" type="button" onClick={shareInvitation}><Share2 size={16} /> SHARE OUR DAY</button>
          </div>
        </div>
      </footer>

      {invitation.sections.music && <button
        className={`music-control${musicEnabled ? ' on' : ''}`}
        type="button"
        onClick={toggleMusic}
        aria-label={musicEnabled ? 'إيقاف الموسيقى' : 'تشغيل الموسيقى'}
        aria-pressed={musicEnabled}
        title={musicEnabled ? 'Pause our song' : 'Play our song'}
      >
        {musicEnabled ? <Music2 size={20} /> : <VolumeX size={20} />}
        {musicEnabled && (
          <span className="music-bars" aria-hidden="true"><i /><i /><i /></span>
        )}
      </button>}
    </main>
  );
}
