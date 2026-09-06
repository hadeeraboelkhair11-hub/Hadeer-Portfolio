import React, { useEffect, useState } from 'react';

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
    </main>
  );
}
