import React, { useState } from 'react';

const cover = '/wedding-assets/opening-cover.png';

export default function WeddingInviteDemo() {
  const [isOpen, setIsOpen] = useState(false);

  const openInvitation = () => {
    if (!isOpen) setIsOpen(true);
  };

  return (
    <main className="wedding-opening" aria-label="Wedding invitation">
      <style>{`
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

        @keyframes seal-pulse {
          0%, 100% { transform: scale(.94); opacity: .35; }
          50% { transform: scale(1.12); opacity: .82; }
        }

        @media (prefers-reduced-motion: reduce) {
          .door, .inner-card, .seal-trigger, .opening-hint { transition-duration: 1ms !important; }
          .seal-trigger::after { animation: none; }
        }
      `}</style>

      <section
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
      </section>
    </main>
  );
}
