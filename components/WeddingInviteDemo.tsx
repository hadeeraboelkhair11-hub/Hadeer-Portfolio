import React, { FormEvent, useEffect, useState } from 'react';
import { Camera, Check, Heart, MapPin, Music2, Navigation, Share2, VolumeX } from 'lucide-react';

const cover = '/wedding-assets/opening-cover.png';
const weddingDate = new Date('2026-10-05T19:00:00+04:00').getTime();

type TimeLeft = { days: number; hours: number; minutes: number; seconds: number };

const calculateTimeLeft = (): TimeLeft => {
  const distance = Math.max(0, weddingDate - Date.now());
  return {
    days: Math.floor(distance / 86_400_000),
    hours: Math.floor((distance / 3_600_000) % 24),
    minutes: Math.floor((distance / 60_000) % 60),
    seconds: Math.floor((distance / 1_000) % 60),
  };
};

export default function WeddingInviteDemo() {
  const [isOpen, setIsOpen] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft);
  const [rsvpSent, setRsvpSent] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [musicEnabled, setMusicEnabled] = useState(false);

  useEffect(() => {
    const interval = window.setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const timer = window.setTimeout(() => setShowCountdown(true), 1100);
    return () => window.clearTimeout(timer);
  }, [isOpen]);

  const openInvitation = () => {
    if (!isOpen) setIsOpen(true);
  };

  const goToCountdown = () => {
    document.getElementById('wedding-countdown')?.scrollIntoView({ behavior: 'smooth' });
  };

  const submitRsvp = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setRsvpSent(true);
  };

  const shareInvitation = async () => {
    const data = { title: 'Maryam & Saif', text: 'Join us to celebrate our wedding day.', url: window.location.href };
    if (navigator.share) {
      await navigator.share(data).catch(() => undefined);
      return;
    }
    await navigator.clipboard?.writeText(window.location.href);
  };

  return (
    <main className="wedding-demo" aria-label="Wedding invitation">
      <style>{`
        .wedding-demo {
          min-height: 100vh;
          overflow-x: hidden;
          background: #160306;
        }

        .wedding-opening {
          min-height: 100vh;
          min-height: 100dvh;
          display: grid;
          place-items: center;
          overflow: hidden;
          padding: 18px;
          background:
            radial-gradient(circle at 50% 44%, rgba(108, 15, 29, .34), transparent 42%),
            linear-gradient(150deg, #210308 0%, #0d0103 58%, #190206 100%);
          box-sizing: border-box;
          position: relative;
        }

        .invitation-stage {
          position: relative;
          width: min(88vw, calc((100dvh - 36px) * 269 / 431), 420px);
          aspect-ratio: 269 / 431;
          perspective: 1500px;
          filter: drop-shadow(0 28px 34px rgba(0, 0, 0, .54));
          isolation: isolate;
        }

        .inner-card {
          position: absolute;
          inset: 1.3%;
          width: 97.4%;
          height: 97.4%;
          object-fit: contain;
          background: #f5ead8;
          box-shadow: 0 0 32px rgba(232, 190, 112, .16);
          opacity: .86;
          transform: scale(.965);
          transition: opacity 900ms ease 460ms, transform 1100ms cubic-bezier(.2,.72,.2,1) 400ms;
        }

        .invitation-stage.is-open .inner-card {
          opacity: 1;
          transform: scale(1);
        }

        .door {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 50.15%;
          z-index: 2;
          overflow: hidden;
          transform-style: preserve-3d;
          transition: transform 1550ms cubic-bezier(.18,.78,.2,1), filter 1200ms ease;
          will-change: transform;
          backface-visibility: visible;
          -webkit-backface-visibility: visible;
        }

        .door-left {
          left: 0;
          transform-origin: left center;
          border-radius: 2px 0 0 2px;
        }

        .door-right {
          right: 0;
          transform-origin: right center;
          border-radius: 0 2px 2px 0;
        }

        .door img {
          position: absolute;
          top: 0;
          width: 199.4%;
          max-width: none;
          height: 100%;
          object-fit: fill;
          pointer-events: none;
          user-select: none;
        }

        .door-left img { left: 0; }
        .door-right img { right: 0; }

        .invitation-stage.is-open .door-left {
          transform: rotateY(-84deg);
          filter: brightness(.58) drop-shadow(8px 0 10px rgba(0,0,0,.28));
        }

        .invitation-stage.is-open .door-right {
          transform: rotateY(84deg);
          filter: brightness(.58) drop-shadow(-8px 0 10px rgba(0,0,0,.28));
        }

        .seal-trigger {
          position: absolute;
          left: 50%;
          top: 50%;
          z-index: 4;
          width: 35%;
          aspect-ratio: 1;
          padding: 0;
          border: 0;
          border-radius: 50%;
          background: transparent;
          transform: translate(-50%, -50%);
          cursor: pointer;
          transition: opacity 360ms ease, transform 480ms ease, visibility 360ms step-end;
        }

        .seal-trigger::after {
          content: '';
          position: absolute;
          inset: 11%;
          border-radius: 50%;
          box-shadow: 0 0 0 1px rgba(255, 222, 151, .2), 0 0 22px rgba(248, 200, 112, .26);
          animation: seal-pulse 2.2s ease-in-out infinite;
        }

        .seal-trigger img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: contain;
          filter: drop-shadow(0 10px 12px rgba(0,0,0,.46));
          user-select: none;
        }

        .invitation-stage.is-open .seal-trigger {
          opacity: 0;
          visibility: hidden;
          transform: translate(-50%, -50%) scale(.78);
          pointer-events: none;
        }

        .opening-hint {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 4.8%;
          z-index: 4;
          margin: 0;
          color: #f3d99f;
          font-family: Cairo, sans-serif;
          font-size: clamp(12px, 3.4vw, 14px);
          font-weight: 400;
          letter-spacing: .02em;
          text-align: center;
          text-shadow: 0 2px 7px rgba(0,0,0,.9);
          transition: opacity 300ms ease;
          pointer-events: none;
        }

        .invitation-stage.is-open .opening-hint { opacity: 0; }

        .countdown-cue {
          position: absolute;
          left: 50%;
          bottom: 10px;
          z-index: 5;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          border: 0;
          padding: 7px 18px;
          background: transparent;
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
          min-height: 78vh;
          display: grid;
          place-items: center;
          padding: 78px 18px 92px;
          color: #f4ddb1;
          background:
            radial-gradient(circle at 50% 0%, rgba(132, 17, 39, .62), transparent 45%),
            linear-gradient(180deg, #26040a 0%, #4a0714 48%, #210308 100%);
          border-top: 1px solid rgba(195, 144, 66, .42);
          box-sizing: border-box;
        }

        .countdown-panel {
          width: min(100%, 660px);
          padding: 40px 22px 30px;
          border: 1px solid rgba(204, 157, 84, .62);
          outline: 1px solid rgba(204, 157, 84, .2);
          outline-offset: -8px;
          background: linear-gradient(145deg, rgba(111, 9, 29, .72), rgba(48, 3, 12, .92));
          box-shadow: 0 24px 65px rgba(0, 0, 0, .42), inset 0 0 46px rgba(255, 193, 95, .04);
          text-align: center;
        }

        .countdown-kicker {
          margin: 0 0 11px;
          color: #d5ad6b;
          font: 600 11px/1.5 Cairo, sans-serif;
          letter-spacing: .22em;
        }

        .countdown-title {
          margin: 0;
          color: #f2d8a5;
          font: 400 clamp(27px, 7vw, 43px)/1.25 Georgia, serif;
        }

        .countdown-divider {
          width: 88px;
          height: 1px;
          margin: 22px auto 27px;
          background: linear-gradient(90deg, transparent, #d0a55e, transparent);
        }

        .countdown-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 9px;
          direction: ltr;
        }

        .countdown-unit {
          position: relative;
          min-width: 0;
          padding: 22px 3px 17px;
          overflow: hidden;
          border: 1px solid rgba(208, 156, 77, .56);
          border-radius: 48px 48px 2px 2px;
          background: linear-gradient(180deg, rgba(116, 11, 32, .9), rgba(67, 4, 17, .92));
          box-shadow: inset 0 0 22px rgba(255, 200, 112, .05);
        }

        .countdown-number {
          display: block;
          color: #f2d59c;
          font: 400 clamp(28px, 8vw, 48px)/1 Georgia, serif;
          font-variant-numeric: tabular-nums;
        }

        .countdown-label {
          display: block;
          margin-top: 9px;
          color: #cda65f;
          font: 500 clamp(7px, 2vw, 10px)/1.2 Cairo, sans-serif;
          letter-spacing: .09em;
        }

        .countdown-date {
          margin: 24px 0 0;
          color: rgba(244, 221, 177, .74);
          font: 400 11px/1.5 Cairo, sans-serif;
          letter-spacing: .19em;
        }

        .venue-section {
          min-height: 92vh;
          display: grid;
          place-items: center;
          padding: 84px 18px 96px;
          color: #5c1421;
          background:
            radial-gradient(circle at 85% 10%, rgba(173, 21, 47, .08), transparent 30%),
            linear-gradient(180deg, #f8efe1 0%, #fffaf3 56%, #f4e7d4 100%);
          box-sizing: border-box;
        }

        .venue-shell {
          width: min(100%, 760px);
          text-align: center;
        }

        .venue-pin {
          width: 50px;
          height: 50px;
          display: grid;
          place-items: center;
          margin: 0 auto 17px;
          border: 1px solid rgba(178, 126, 54, .55);
          border-radius: 50%;
          color: #a86e25;
          background: rgba(255, 252, 246, .8);
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
          margin: 10px 0 30px;
          color: #8c6b62;
          font: 500 12px/1.5 Cairo, sans-serif;
          letter-spacing: .15em;
        }

        .venue-layout {
          display: grid;
          grid-template-columns: 1.04fr .96fr;
          overflow: hidden;
          border: 1px solid rgba(178, 126, 54, .55);
          background: #fff;
          box-shadow: 0 24px 58px rgba(84, 15, 29, .17);
          text-align: left;
        }

        .venue-art {
          min-height: 310px;
          display: grid;
          place-items: center;
          overflow: hidden;
          background: #f4e9d9;
        }

        .venue-art img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transform: scale(1.04);
        }

        .venue-map-wrap {
          min-height: 310px;
          position: relative;
          display: flex;
          flex-direction: column;
          padding: 10px;
          background: #f8efe3;
        }

        .venue-map {
          width: 100%;
          flex: 1;
          min-height: 230px;
          border: 0;
          filter: sepia(.28) saturate(.74) contrast(.96);
        }

        .venue-directions {
          min-height: 52px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          margin-top: 9px;
          border: 1px solid #8f3546;
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
          .venue-layout { grid-template-columns: 1fr; }
          .venue-art { min-height: 230px; }
          .venue-map-wrap { min-height: 300px; }
        }

        .gallery-section {
          padding: 88px 18px 96px;
          color: #f2dcae;
          background: radial-gradient(circle at 20% 10%, rgba(133, 17, 39, .5), transparent 30%), #26040b;
          text-align: center;
        }

        .gallery-shell, .rsvp-shell {
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
          margin: 14px auto 30px;
          color: rgba(241, 220, 180, .68);
          font: 400 14px/1.8 Georgia, serif;
        }

        .gallery-art {
          padding: 7px;
          border: 1px solid rgba(202, 155, 79, .58);
          background: #f8efe2;
          box-shadow: 0 28px 64px rgba(0, 0, 0, .42);
        }

        .gallery-art img { display: block; width: 100%; height: auto; }

        .rsvp-section {
          padding: 90px 18px 102px;
          color: #641222;
          background: linear-gradient(180deg, #fffaf3, #f3e4ce);
          text-align: center;
        }

        .rsvp-section .section-icon, .rsvp-section .section-kicker { color: #aa742c; }

        .rsvp-copy {
          max-width: 500px;
          margin: 14px auto 30px;
          color: #7d6266;
          font: 400 14px/1.8 Georgia, serif;
        }

        .rsvp-card {
          width: min(100%, 520px);
          margin: 0 auto;
          padding: 30px 24px;
          border: 1px solid rgba(178, 126, 54, .52);
          background: rgba(255, 253, 248, .84);
          box-shadow: 0 20px 48px rgba(84, 15, 29, .12);
        }

        .rsvp-form { display: grid; gap: 15px; text-align: left; }
        .rsvp-form label { display: grid; gap: 7px; color: #9b6c34; font-size: 10px; font-weight: 600; letter-spacing: .1em; }
        .rsvp-form input, .rsvp-form select {
          width: 100%;
          min-height: 50px;
          padding: 11px 13px;
          border: 1px solid #d6bb91;
          border-radius: 2px;
          outline: none;
          color: #57101d;
          background: #fffefa;
          font: 400 14px Cairo, sans-serif;
        }
        .rsvp-form input:focus, .rsvp-form select:focus { border-color: #8d3041; box-shadow: 0 0 0 3px rgba(109, 15, 33, .08); }
        .rsvp-submit {
          min-height: 52px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          margin-top: 5px;
          border: 1px solid #8c3141;
          border-radius: 2px;
          color: #f5dfb6;
          background: linear-gradient(135deg, #76152a, #520914);
          font: 600 11px Cairo, sans-serif;
          letter-spacing: .12em;
          cursor: pointer;
        }

        .rsvp-success { padding: 18px 5px; }
        .rsvp-success-badge { width: 62px; height: 62px; display: grid; place-items: center; margin: 0 auto 18px; border-radius: 50%; color: #f5dfb6; background: #6a1022; }
        .rsvp-success h3 { margin: 0 0 9px; font: 400 30px/1.3 Georgia, serif; }
        .rsvp-success p { margin: 0; color: #7d6266; }

        .finale-section {
          position: relative;
          min-height: 72vh;
          display: grid;
          place-items: center;
          overflow: hidden;
          padding: 82px 18px;
          color: #f1d9aa;
          background: radial-gradient(circle at 50% 24%, #77162b 0%, #390710 48%, #170205 100%);
          text-align: center;
        }

        .finale-content { width: min(100%, 560px); }
        .finale-content > img { width: 96px; height: 102px; object-fit: contain; filter: drop-shadow(0 10px 18px rgba(0,0,0,.4)); }
        .finale-copy { margin: 22px 0 12px; color: #d4b474; font-size: 10px; font-weight: 600; letter-spacing: .19em; }
        .finale-title { margin: 0; font: 400 clamp(40px, 11vw, 64px)/1.15 Georgia, serif; }
        .finale-title span { display: block; color: #d0a052; font-size: .62em; font-style: italic; }
        .finale-date { margin: 23px 0 27px; color: #d4b474; font-size: 11px; letter-spacing: .22em; }
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
        }

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
        }

        .music-control.on { animation: music-glow 1.8s ease-in-out infinite; }

        @media (max-width: 520px) {
          .countdown-section { min-height: 70vh; padding: 62px 12px 72px; }
          .countdown-panel { padding: 32px 12px 25px; }
          .countdown-grid { gap: 6px; }
          .countdown-unit { padding: 19px 2px 15px; }
          .countdown-label { letter-spacing: .04em; }
          .gallery-section, .rsvp-section { padding: 72px 16px 80px; }
          .rsvp-card { padding: 25px 18px; }
          .finale-actions { flex-direction: column; }
          .finale-action { width: min(100%, 250px); margin: 0 auto; }
        }

        @keyframes music-glow {
          0%, 100% { box-shadow: 0 8px 24px rgba(0,0,0,.3), 0 0 0 0 rgba(211,169,91,.24); }
          50% { box-shadow: 0 8px 24px rgba(0,0,0,.3), 0 0 0 8px rgba(211,169,91,0); }
        }

        @keyframes seal-pulse {
          0%, 100% { transform: scale(.94); opacity: .35; }
          50% { transform: scale(1.12); opacity: .82; }
        }

        @keyframes cue-bob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(5px); }
        }

        @media (prefers-reduced-motion: reduce) {
          .door, .inner-card, .seal-trigger, .opening-hint, .countdown-cue { transition-duration: 1ms !important; }
          .seal-trigger::after, .countdown-cue span:last-child { animation: none; }
        }
      `}</style>

      <section className="wedding-opening">
        <div
          className={`invitation-stage${isOpen ? ' is-open' : ''}`}
          onClick={openInvitation}
        >
          <img
            className="inner-card"
            src="/wedding-assets/card.webp"
            alt="Maryam and Saif wedding invitation"
          />

          <div className="door door-left" aria-hidden="true">
            <img src={cover} alt="" draggable={false} />
          </div>
          <div className="door door-right" aria-hidden="true">
            <img src={cover} alt="" draggable={false} />
          </div>

          <button
            className="seal-trigger"
            type="button"
            onClick={openInvitation}
            aria-label="فتح الدعوة"
            aria-expanded={isOpen}
          >
            <img src="/wedding-assets/seal.webp" alt="" draggable={false} />
          </button>

          <p className="opening-hint">اضغطي على الختم لفتح الدعوة</p>
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

      <section id="wedding-countdown" className="countdown-section" aria-labelledby="countdown-title">
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
                <strong className="countdown-number">{String(value).padStart(2, '0')}</strong>
                <span className="countdown-label">{label}</span>
              </div>
            ))}
          </div>
          <p className="countdown-date">05 · OCTOBER · 2026</p>
        </div>
      </section>

      <section className="venue-section" aria-labelledby="venue-title">
        <div className="venue-shell">
          <div className="venue-pin" aria-hidden="true"><MapPin size={23} strokeWidth={1.6} /></div>
          <p className="venue-kicker">THE VENUE</p>
          <h2 id="venue-title" className="venue-title">GRAND HYATT MUSCAT</h2>
          <p className="venue-place">MUSCAT · OMAN</p>

          <div className="venue-layout">
            <div className="venue-art">
              <img src="/wedding-assets/location-card.png" alt="Grand Hyatt Muscat wedding venue" />
            </div>
            <div className="venue-map-wrap">
              <iframe
                className="venue-map"
                title="Grand Hyatt Muscat map"
                src="https://www.google.com/maps?q=Grand%20Hyatt%20Muscat%2C%20Muscat%2C%20Oman&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <a
                className="venue-directions"
                href="https://www.google.com/maps/search/?api=1&query=Grand+Hyatt+Muscat%2C+Muscat%2C+Oman"
                target="_blank"
                rel="noreferrer"
              >
                <Navigation size={17} strokeWidth={1.7} />
                GET DIRECTIONS
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="gallery-section" aria-labelledby="gallery-title">
        <div className="gallery-shell">
          <Camera className="section-icon" size={25} strokeWidth={1.5} />
          <p className="section-kicker">OUR DAY</p>
          <h2 id="gallery-title" className="section-title">A glimpse of the celebration</h2>
          <p className="gallery-copy">A timeless evening filled with warm candlelight, burgundy blooms and the people we love.</p>
          <div className="gallery-art">
            <img src="/wedding-assets/arch-gallery.png" alt="Wedding venue, burgundy flowers and candlelit reception" />
          </div>
        </div>
      </section>

      <section className="rsvp-section" aria-labelledby="rsvp-title">
        <div className="rsvp-shell">
          <Heart className="section-icon" size={27} strokeWidth={1.5} />
          <p className="section-kicker">KINDLY REPLY</p>
          <h2 id="rsvp-title" className="section-title">Will you celebrate with us?</h2>
          <p className="rsvp-copy">Please send your response before September 15, 2026. We would be delighted to share our day with you.</p>

          <div className="rsvp-card">
            {rsvpSent ? (
              <div className="rsvp-success">
                <div className="rsvp-success-badge"><Check size={28} /></div>
                <h3>Thank you, {guestName}</h3>
                <p>Your response has been received.</p>
              </div>
            ) : (
              <form className="rsvp-form" onSubmit={submitRsvp}>
