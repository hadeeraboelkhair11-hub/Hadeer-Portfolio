import React, { FormEvent, useEffect, useState } from 'react';
import { Camera, Check, Heart, MapPin, Music2, Navigation, Share2, VolumeX } from 'lucide-react';

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
  const [isUnlocking, setIsUnlocking] = useState(false);
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
    if (!isUnlocking || isOpen) return;
    const timer = window.setTimeout(() => setIsOpen(true), 1550);
    return () => window.clearTimeout(timer);
  }, [isUnlocking, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const timer = window.setTimeout(() => setShowCountdown(true), 1700);
    return () => window.clearTimeout(timer);
  }, [isOpen]);

  const openInvitation = () => {
    if (!isOpen && !isUnlocking) setIsUnlocking(true);
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
          right: 96%;
          top: 50.2%;
          z-index: 5;
          width: min(76vw, 430px);
          padding: 0;
          border: 0;
          background: transparent;
          transform: translateY(-50%) rotate(-5deg);
          transform-origin: right center;
          cursor: pointer;
          filter: drop-shadow(0 16px 18px rgba(0,0,0,.48));
          -webkit-tap-highlight-color: transparent;
          will-change: right, transform, opacity;
        }

        .opening-key-button::after {
          content: '';
          position: absolute;
          right: -8px;
          top: 50%;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          transform: translate(50%, -50%);
          box-shadow: 0 0 0 0 rgba(255, 211, 116, .34);
          animation: key-target 2s ease-out infinite;
        }

        .opening-key-button img {
          display: block;
          width: 100%;
          height: auto;
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
          padding: 132px 20px 96px;
          color: #f4ddb1;
          background:
            linear-gradient(rgba(35, 2, 8, .33), rgba(22, 1, 5, .55)),
            url('/wedding-assets/opening-bg.webp') center / cover no-repeat;
          border-top: 1px solid rgba(195, 144, 66, .42);
          box-sizing: border-box;
        }

        .countdown-section::before {
          content: '';
          position: absolute;
          top: -20px;
          left: 50%;
          width: min(110%, 670px);
          height: min(52vw, 300px);
          background: url('/wedding-assets/opening-reveal.webp') center top / contain no-repeat;
          transform: translateX(-50%);
          opacity: .48;
          filter: drop-shadow(0 12px 20px rgba(0,0,0,.38));
          pointer-events: none;
        }

        .countdown-section::after {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 50% 52%, rgba(134, 25, 44, .18), transparent 42%);
          pointer-events: none;
        }

        .countdown-panel {
          position: relative;
          z-index: 1;
          width: min(100%, 720px);
          padding: 48px 34px 36px;
          border: 1px solid rgba(219, 174, 91, .76);
          border-radius: 4px;
          outline: 1px solid rgba(219, 174, 91, .24);
          outline-offset: -10px;
          background:
            radial-gradient(circle at 50% 20%, rgba(155, 31, 50, .28), transparent 46%),
            linear-gradient(155deg, rgba(104, 10, 27, .94), rgba(45, 2, 11, .97));
          box-shadow: 0 30px 75px rgba(0, 0, 0, .5), inset 0 0 52px rgba(255, 193, 95, .035);
          text-align: center;
          box-sizing: border-box;
        }

        .countdown-panel::before,
        .countdown-panel::after {
          content: '◆';
          position: absolute;
          top: 17px;
          color: #d5aa62;
          font-size: 10px;
          text-shadow: 0 0 10px rgba(236, 186, 92, .35);
        }

        .countdown-panel::before { left: 20px; }
        .countdown-panel::after { right: 20px; }

        .countdown-kicker {
          margin: 0 0 12px;
          color: #dcb874;
          font: 600 12px/1.5 Cairo, sans-serif;
          letter-spacing: .28em;
        }

        .countdown-title {
          margin: 0;
          color: #f2d8a5;
          font: 400 clamp(30px, 7vw, 46px)/1.2 Georgia, serif;
        }

        .countdown-divider {
          position: relative;
          width: min(72%, 260px);
          height: 1px;
          margin: 24px auto 31px;
          background: linear-gradient(90deg, transparent, #d0a55e, transparent);
        }

        .countdown-divider::after {
          content: '✦';
          position: absolute;
          left: 50%;
          top: 50%;
          padding: 0 9px;
          color: #d8ae65;
          background: #650a1b;
          font-size: 12px;
          transform: translate(-50%, -50%);
        }

        .countdown-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          align-items: stretch;
          gap: 14px;
          direction: ltr;
        }

        .countdown-unit {
          position: relative;
          display: flex;
          min-height: 132px;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-width: 0;
          padding: 22px 6px 18px;
          overflow: hidden;
          border: 1px solid rgba(215, 165, 82, .68);
          border-radius: 66px 66px 7px 7px;
          background: linear-gradient(180deg, rgba(128, 15, 37, .96), rgba(67, 4, 17, .97));
          box-shadow: inset 0 0 26px rgba(255, 200, 112, .055), 0 12px 22px rgba(20,0,4,.25);
        }

        .countdown-unit::before {
          content: '';
          position: absolute;
          inset: 7px;
          border: 1px solid rgba(228, 184, 100, .14);
          border-radius: 58px 58px 3px 3px;
          pointer-events: none;
        }

        .countdown-number {
          display: block;
          color: #f2d59c;
          font: 400 clamp(32px, 8vw, 52px)/1 Georgia, serif;
          font-variant-numeric: tabular-nums;
          text-shadow: 0 3px 14px rgba(0,0,0,.32);
        }

        .countdown-label {
          display: block;
          margin-top: 11px;
          color: #cda65f;
          font: 600 clamp(8px, 2vw, 10px)/1.2 Cairo, sans-serif;
          letter-spacing: .12em;
        }

        .countdown-date {
          margin: 30px 0 0;
          color: rgba(244, 221, 177, .86);
          font: 500 12px/1.5 Cairo, sans-serif;
          letter-spacing: .22em;
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
          .countdown-section { min-height: 100dvh; padding: 108px 12px 72px; }
          .countdown-section::before { width: 118%; height: 220px; opacity: .42; }
          .countdown-panel { padding: 38px 12px 27px; outline-offset: -7px; }
          .countdown-grid { gap: 6px; }
          .countdown-unit { min-height: 111px; padding: 18px 2px 14px; border-radius: 46px 46px 5px 5px; }
          .countdown-unit::before { inset: 5px; border-radius: 40px 40px 2px 2px; }
          .countdown-label { letter-spacing: .045em; }
          .countdown-date { margin-top: 24px; font-size: 10px; letter-spacing: .16em; }
          .gallery-section, .rsvp-section { padding: 72px 16px 80px; }
          .rsvp-card { padding: 25px 18px; }
          .finale-actions { flex-direction: column; }
          .finale-action { width: min(100%, 250px); margin: 0 auto; }
        }

        @keyframes music-glow {
          0%, 100% { box-shadow: 0 8px 24px rgba(0,0,0,.3), 0 0 0 0 rgba(211,169,91,.24); }
          50% { box-shadow: 0 8px 24px rgba(0,0,0,.3), 0 0 0 8px rgba(211,169,91,0); }
        }

        @keyframes key-target {
          0% { box-shadow: 0 0 0 0 rgba(255, 211, 116, .32); }
          72%, 100% { box-shadow: 0 0 0 17px rgba(255, 211, 116, 0); }
        }

        @keyframes key-unlock {
          0% { right: 96%; transform: translateY(-50%) rotate(-5deg); opacity: 1; }
          54% { right: 49%; transform: translateY(-50%) rotate(0deg); opacity: 1; }
          73% { right: 49%; transform: translateY(-50%) rotate(0deg); opacity: 1; }
          91% { right: 49%; transform: translateY(-50%) rotate(23deg); opacity: 1; }
          100% { right: 49%; transform: translateY(-50%) rotate(23deg); opacity: 0; }
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
          .opening-key-button, .opening-hint, .opening-content, .countdown-cue {
            transition-duration: 1ms !important;
            animation-duration: 1ms !important;
          }
          .opening-key-button::after, .countdown-cue span:last-child { animation: none; }
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
              alt="Maryam and Saif"
              draggable={false}
            />
            <p className="opening-together">TOGETHER WITH THEIR FAMILIES</p>
            <h1 className="opening-names">MARYAM <span>&amp;</span> SAIF</h1>
            <p className="opening-date">05 · OCTOBER · 2026</p>
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
                <label>
                  YOUR NAME
                  <input value={guestName} onChange={(event) => setGuestName(event.target.value)} placeholder="Full name" required />
                </label>
                <label>
                  NUMBER OF GUESTS
                  <select defaultValue="1">
                    <option value="1">1 Guest</option>
                    <option value="2">2 Guests</option>
                    <option value="3">3 Guests</option>
                    <option value="4">4 Guests</option>
                  </select>
                </label>
                <label>
                  YOUR RESPONSE
                  <select defaultValue="" required>
                    <option value="" disabled>Select response</option>
                    <option value="accept">Joyfully accepts</option>
                    <option value="decline">Regretfully declines</option>
                  </select>
                </label>
                <button className="rsvp-submit" type="submit"><Heart size={17} /> SEND RSVP</button>
              </form>
            )}
          </div>
        </div>
      </section>

      <footer className="finale-section">
        <div className="finale-content">
          <img src="/wedding-assets/seal.webp" alt="Maryam and Saif monogram" />
          <p className="finale-copy">WE CANNOT WAIT TO CELEBRATE WITH YOU</p>
          <h2 className="finale-title">MARYAM <span>&</span> SAIF</h2>
          <p className="finale-date">05 · OCTOBER · 2026</p>
          <div className="finale-actions">
            <a className="finale-action" href="https://www.google.com/maps/search/?api=1&query=Grand+Hyatt+Muscat%2C+Muscat%2C+Oman" target="_blank" rel="noreferrer">
              <MapPin size={16} /> LOCATION
            </a>
            <button className="finale-action" type="button" onClick={shareInvitation}><Share2 size={16} /> SHARE OUR DAY</button>
          </div>
        </div>
      </footer>

      <button
        className={`music-control${musicEnabled ? ' on' : ''}`}
        type="button"
        onClick={() => setMusicEnabled((enabled) => !enabled)}
        aria-label={musicEnabled ? 'إيقاف الموسيقى' : 'تشغيل الموسيقى'}
        aria-pressed={musicEnabled}
        title="Music control — track will be added in the final content stage"
      >
        {musicEnabled ? <Music2 size={20} /> : <VolumeX size={20} />}
      </button>
    </main>
  );
}
