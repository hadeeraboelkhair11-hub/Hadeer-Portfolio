import React, { useState } from 'react';

const A = '/wedding-assets/';

type Phase = 'closed' | 'opening' | 'open';

export default function WeddingInviteDemo() {
  const [phase, setPhase] = useState<Phase>('closed');

  const reveal = () => {
    if (phase !== 'closed') return;
    setPhase('opening');
    window.setTimeout(() => setPhase('open'), 1350);
  };

  const opening = phase === 'opening';
  const opened = phase === 'open';

  return (
    <main
      className="fixed inset-0 overflow-hidden bg-[#210307]"
      style={{
        perspective: '1500px',
        background:
          'radial-gradient(circle at 50% 35%, rgba(118,24,37,.72), rgba(35,3,8,1) 72%)',
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center p-3 sm:p-6">
        <div
          className="relative h-full w-full max-w-[470px] overflow-visible"
          style={{ maxHeight: '920px' }}
        >
          {/* Real artwork revealed behind the doors */}
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src={`${A}open.webp`}
              alt="Open wedding invitation"
              className="h-full w-full object-contain transition-all duration-700"
              style={{
                opacity: phase === 'closed' ? 0 : opened ? 0.18 : 1,
                transform: phase === 'closed' ? 'scale(.96)' : 'scale(1)',
                filter: 'drop-shadow(0 25px 45px rgba(0,0,0,.42))',
              }}
            />
          </div>

          {/* Final invitation card artwork */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <img
              src={`${A}card.webp`}
              alt="Wedding invitation card"
              className="h-full w-full object-contain transition-all duration-700"
              style={{
                opacity: opened ? 1 : 0,
                transform: opened ? 'scale(1)' : 'scale(.94)',
                filter: 'drop-shadow(0 28px 48px rgba(0,0,0,.38))',
              }}
            />
          </div>

          {/* LEFT HALF OF THE REAL CLOSED ARTWORK */}
          <div
            className="absolute left-0 top-0 h-full w-1/2 overflow-hidden"
            style={{
              transformOrigin: 'left center',
              transformStyle: 'preserve-3d',
              transform: opening || opened ? 'rotateY(-108deg)' : 'rotateY(0deg)',
              transition: 'transform 1.25s cubic-bezier(.65,.05,.22,1)',
              zIndex: 20,
            }}
          >
            <img
              src={`${A}closed.webp`}
              alt=""
              draggable={false}
              className="absolute left-0 top-0 h-full max-w-none object-contain select-none"
              style={{ width: '200%' }}
            />
          </div>

          {/* RIGHT HALF OF THE REAL CLOSED ARTWORK */}
          <div
            className="absolute right-0 top-0 h-full w-1/2 overflow-hidden"
            style={{
              transformOrigin: 'right center',
              transformStyle: 'preserve-3d',
              transform: opening || opened ? 'rotateY(108deg)' : 'rotateY(0deg)',
              transition: 'transform 1.25s cubic-bezier(.65,.05,.22,1)',
              zIndex: 20,
            }}
          >
            <img
              src={`${A}closed.webp`}
              alt=""
              draggable={false}
              className="absolute right-0 top-0 h-full max-w-none object-contain select-none"
              style={{ width: '200%' }}
            />
          </div>

          {/* Real wax seal is the interaction */}
          <button
            type="button"
            onClick={reveal}
            aria-label="Open wedding invitation"
            className="absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2 border-0 bg-transparent p-0 outline-none"
            style={{
              width: 'clamp(84px, 25vw, 118px)',
              opacity: phase === 'closed' ? 1 : 0,
              transform:
                phase === 'closed'
                  ? 'translate(-50%,-50%) scale(1)'
                  : 'translate(-50%,-50%) scale(.72)',
              transition: 'opacity .35s ease, transform .45s ease',
              filter: 'drop-shadow(0 12px 16px rgba(0,0,0,.5))',
              cursor: phase === 'closed' ? 'pointer' : 'default',
            }}
          >
            <img
              src={`${A}seal.webp`}
              alt="M S wax seal"
              className="block h-auto w-full"
              draggable={false}
            />
          </button>

          <div
            dir="rtl"
            className="absolute bottom-[5%] left-0 right-0 z-30 text-center text-[12px] tracking-wide text-[#f3dfb9]"
            style={{
              opacity: phase === 'closed' ? 0.94 : 0,
              transition: 'opacity .3s ease',
              textShadow: '0 2px 10px rgba(0,0,0,.75)',
            }}
          >
            اضغطي على الختم لفتح الدعوة
          </div>
        </div>
      </div>
    </main>
  );
}
